import type { UserProgress } from '../types';
import { SupabaseStorageProvider } from './SupabaseStorageProvider';
import { 
  loadUserProgress, 
  saveUserProgress, 
  initialProgress 
} from './progressStorage';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'unconfigured' | 'error' | 'pending';

export interface SyncListener {
  (status: SyncStatus, lastSyncedAt?: Date, errorMessage?: string): void;
}

export interface LocalProgressStats {
  hasLocalProgress: boolean;
  completedDaysCount: number;
  notesCount: number;
  solvedCount: number;
  masteredCount: number;
}

class SyncManager {
  private status: SyncStatus = 'unconfigured';
  private lastSyncedAt?: Date;
  private errorMessage?: string;
  private listeners: Set<SyncListener> = new Set();
  private progressListeners: Set<(progress: UserProgress) => void> = new Set();
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private retryCount = 0;
  private currentUserId: string | null = null;
  private isSyncInProgress = false;
  private pendingProgress: UserProgress | null = null;
  private realtimeChannel: any = null;
  private periodicInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // 1. Online / Offline browser lifecycle handlers
      window.addEventListener('online', () => {
        if (this.currentUserId) {
          this.setStatus('pending');
          this.retryCount = 0;
          this.syncNow();
        } else {
          this.updateInitialStatus();
        }
      });

      window.addEventListener('offline', () => {
        this.setStatus('offline', 'Network connection unavailable — saved in local storage');
      });

      // 2. Tab focus listener: When user switches back to this laptop/tab, pull updates from Phone
      window.addEventListener('focus', () => {
        if (this.currentUserId && navigator.onLine) {
          this.silentPullAndMerge();
        }
      });

      // 3. Periodic 60s background sync poll
      this.periodicInterval = setInterval(() => {
        if (this.currentUserId && navigator.onLine && !this.isSyncInProgress && !this.pendingProgress) {
          this.silentPullAndMerge();
        }
      }, 60000);

      this.updateInitialStatus();
    }
  }

  private updateInitialStatus() {
    if (!isSupabaseConfigured()) {
      this.status = 'unconfigured';
    } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.status = 'offline';
    } else if (this.currentUserId) {
      this.status = 'synced';
    } else {
      this.status = 'synced'; // Local-only mode default
    }
    this.notify();
  }

  public setUserId(userId: string | null) {
    const prevUserId = this.currentUserId;
    this.currentUserId = userId;

    if (userId) {
      this.setupRealtimeSubscription(userId);
    } else {
      this.cleanupRealtimeSubscription();
      if (prevUserId) {
        this.updateInitialStatus();
      }
    }
  }

  private setupRealtimeSubscription(userId: string) {
    if (!isSupabaseConfigured() || !userId) return;

    try {
      this.cleanupRealtimeSubscription();

      this.realtimeChannel = supabase
        .channel(`user-sync-${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_progress',
            filter: `user_id=eq.${userId}`
          },
          () => {
            // Remote change detected (e.g. from Phone or Laptop 2)
            this.silentPullAndMerge();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'progress',
            filter: `user_id=eq.${userId}`
          },
          () => {
            this.silentPullAndMerge();
          }
        )
        .subscribe();
    } catch {
      // Realtime not supported or disabled, falls back to polling & focus
    }
  }

  private cleanupRealtimeSubscription() {
    if (this.realtimeChannel) {
      try {
        supabase.removeChannel(this.realtimeChannel);
      } catch {
        // Ignore cleanup error
      }
      this.realtimeChannel = null;
    }
  }

  public getStatus(): { status: SyncStatus; lastSyncedAt?: Date; errorMessage?: string } {
    return {
      status: this.status,
      lastSyncedAt: this.lastSyncedAt,
      errorMessage: this.errorMessage
    };
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    listener(this.status, this.lastSyncedAt, this.errorMessage);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onProgressUpdated(listener: (progress: UserProgress) => void): () => void {
    this.progressListeners.add(listener);
    return () => {
      this.progressListeners.delete(listener);
    };
  }

  private notifyProgressUpdated(progress: UserProgress) {
    for (const listener of this.progressListeners) {
      try {
        listener(progress);
      } catch (e) {
        console.error('Error in progress listener:', e);
      }
    }
  }

  private setStatus(status: SyncStatus, errorMessage?: string) {
    this.status = status;
    this.errorMessage = errorMessage;
    if (status === 'synced') {
      this.lastSyncedAt = new Date();
      this.retryCount = 0;
    }
    this.notify();
  }

  private notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.status, this.lastSyncedAt, this.errorMessage);
      } catch (e) {
        console.error('Error in sync listener:', e);
      }
    }
  }

  private loginSyncPromise: Promise<UserProgress> | null = null;

  /**
   * Conflict Resolution & Deletion Semantics Strategy:
   * 1. Entity-Level Timestamps:
   *    Every entity mutation (day completed/uncompleted, bookmark added/removed, task checked/unchecked,
   *    problem solved/unsolved, question mastered/unmastered, note edited) is recorded with an ISO timestamp.
   * 2. Deletion Semantics:
   *    If an entity is unchecked or removed on Device A at timestamp T2 (where T2 > T1), the state is
   *    { completed: false, updatedAt: T2 }. When merging with Cloud (which had { completed: true, updatedAt: T1 }),
   *    the newer timestamp wins, ensuring the item remains unchecked and is NOT resurrected.
   * 3. Additive Progress Across Devices:
   *    If Laptop 1 completes Day 27 (T1) and Laptop 2 completes Day 28 (T2), both items have { completed: true },
   *    so both Day 27 and Day 28 are included in completedDays.
   * 4. Stale Device Protection:
   *    If an offline device reconnects after 3 days, its older timestamps (T_old < T_cloud) will lose to
   *    the newer cloud records, preventing stale local state from overwriting recent work.
   * 5. Legacy Fallback:
   *    If historical records lack timestamps, an additive union fallback preserves all historical work.
   */
  public mergeProgress(local: UserProgress, cloud: UserProgress): UserProgress {
    // 1. Completed Days with timestamp comparison
    const mergedDayCompletionTimestamps: Record<number, { completed: boolean; updatedAt: string }> = {};
    const allDaysCandidate = new Set<number>([
      ...(local.completedDays || []),
      ...(cloud.completedDays || []),
      ...Object.keys(local.dayCompletionTimestamps || {}).map(Number),
      ...Object.keys(cloud.dayCompletionTimestamps || {}).map(Number)
    ]);

    const mergedCompletedDays: number[] = [];
    for (const day of allDaysCandidate) {
      const lRec = local.dayCompletionTimestamps?.[day];
      const cRec = cloud.dayCompletionTimestamps?.[day];

      let isCompleted: boolean;
      let winningRec: { completed: boolean; updatedAt: string };

      if (lRec && cRec) {
        if (lRec.updatedAt >= cRec.updatedAt) {
          isCompleted = lRec.completed;
          winningRec = lRec;
        } else {
          isCompleted = cRec.completed;
          winningRec = cRec;
        }
      } else if (lRec) {
        isCompleted = lRec.completed;
        winningRec = lRec;
      } else if (cRec) {
        isCompleted = cRec.completed;
        winningRec = cRec;
      } else {
        isCompleted = (local.completedDays || []).includes(day) || (cloud.completedDays || []).includes(day);
        winningRec = { completed: isCompleted, updatedAt: new Date(0).toISOString() };
      }

      mergedDayCompletionTimestamps[day] = winningRec;
      if (isCompleted) {
        mergedCompletedDays.push(day);
      }
    }

    // In-progress days: Union with completed filtered out
    const inProgressSet = new Set<number>([
      ...(local.inProgressDays || []),
      ...(cloud.inProgressDays || [])
    ]);
    for (const doneDay of mergedCompletedDays) {
      inProgressSet.delete(doneDay);
    }
    if (inProgressSet.size === 0 && mergedCompletedDays.length > 0) {
      const nextDay = Math.min(150, Math.max(...mergedCompletedDays) + 1);
      inProgressSet.add(nextDay);
    } else if (inProgressSet.size === 0) {
      inProgressSet.add(1);
    }

    // 2. Bookmarked Days with timestamp comparison
    const mergedBookmarkTimestamps: Record<number, { bookmarked: boolean; updatedAt: string }> = {};
    const allBookmarksCandidate = new Set<number>([
      ...(local.bookmarkedDays || []),
      ...(cloud.bookmarkedDays || []),
      ...Object.keys(local.bookmarkTimestamps || {}).map(Number),
      ...Object.keys(cloud.bookmarkTimestamps || {}).map(Number)
    ]);

    const mergedBookmarkedDays: number[] = [];
    for (const day of allBookmarksCandidate) {
      const lRec = local.bookmarkTimestamps?.[day];
      const cRec = cloud.bookmarkTimestamps?.[day];

      let isBookmarked: boolean;
      let winningRec: { bookmarked: boolean; updatedAt: string };

      if (lRec && cRec) {
        if (lRec.updatedAt >= cRec.updatedAt) {
          isBookmarked = lRec.bookmarked;
          winningRec = lRec;
        } else {
          isBookmarked = cRec.bookmarked;
          winningRec = cRec;
        }
      } else if (lRec) {
        isBookmarked = lRec.bookmarked;
        winningRec = lRec;
      } else if (cRec) {
        isBookmarked = cRec.bookmarked;
        winningRec = cRec;
      } else {
        isBookmarked = (local.bookmarkedDays || []).includes(day) || (cloud.bookmarkedDays || []).includes(day);
        winningRec = { bookmarked: isBookmarked, updatedAt: new Date(0).toISOString() };
      }

      mergedBookmarkTimestamps[day] = winningRec;
      if (isBookmarked) {
        mergedBookmarkedDays.push(day);
      }
    }

    // 3. Day Tasks 8-pillar checklist with timestamp comparison
    const pillars = ['dsa', 'sql', 'backendCloud', 'aiMl', 'cs', 'handsOn', 'questions', 'deliverable'] as const;
    const mergedDayTasks: UserProgress['dayTasks'] = {};
    const mergedTaskTimestamps: Record<number, Record<string, { done: boolean; updatedAt: string }>> = {};
    const allTaskDays = new Set<string>([
      ...Object.keys(local.dayTasks || {}),
      ...Object.keys(cloud.dayTasks || {}),
      ...Object.keys(local.taskTimestamps || {}),
      ...Object.keys(cloud.taskTimestamps || {})
    ]);

    for (const dayStr of allTaskDays) {
      const day = parseInt(dayStr, 10);
      const lTasks = local.dayTasks?.[day];
      const cTasks = cloud.dayTasks?.[day];
      const lTimeMap = local.taskTimestamps?.[day] || {};
      const cTimeMap = cloud.taskTimestamps?.[day] || {};

      mergedDayTasks[day] = {} as any;
      mergedTaskTimestamps[day] = {};

      for (const p of pillars) {
        const lRec = lTimeMap[p];
        const cRec = cTimeMap[p];

        let done: boolean;
        let winningRec: { done: boolean; updatedAt: string };

        if (lRec && cRec) {
          if (lRec.updatedAt >= cRec.updatedAt) {
            done = lRec.done;
            winningRec = lRec;
          } else {
            done = cRec.done;
            winningRec = cRec;
          }
        } else if (lRec) {
          done = lRec.done;
          winningRec = lRec;
        } else if (cRec) {
          done = cRec.done;
          winningRec = cRec;
        } else {
          done = Boolean(lTasks?.[p] || cTasks?.[p]);
          winningRec = { done, updatedAt: new Date(0).toISOString() };
        }

        mergedDayTasks[day][p] = done;
        mergedTaskTimestamps[day][p] = winningRec;
      }
    }

    // 4. Solved Problems with timestamp comparison
    const mergedProblems: Record<string, boolean> = {};
    const mergedProblemTimestamps: Record<string, { solved: boolean; updatedAt: string }> = {};
    const allProblems = new Set<string>([
      ...Object.keys(local.solvedProblems || {}),
      ...Object.keys(cloud.solvedProblems || {}),
      ...Object.keys(local.problemTimestamps || {}),
      ...Object.keys(cloud.problemTimestamps || {})
    ]);

    for (const prob of allProblems) {
      const lRec = local.problemTimestamps?.[prob];
      const cRec = cloud.problemTimestamps?.[prob];

      let solved: boolean;
      let winningRec: { solved: boolean; updatedAt: string };

      if (lRec && cRec) {
        if (lRec.updatedAt >= cRec.updatedAt) {
          solved = lRec.solved;
          winningRec = lRec;
        } else {
          solved = cRec.solved;
          winningRec = cRec;
        }
      } else if (lRec) {
        solved = lRec.solved;
        winningRec = lRec;
      } else if (cRec) {
        solved = cRec.solved;
        winningRec = cRec;
      } else {
        solved = Boolean(local.solvedProblems?.[prob] || cloud.solvedProblems?.[prob]);
        winningRec = { solved, updatedAt: new Date(0).toISOString() };
      }

      mergedProblems[prob] = solved;
      mergedProblemTimestamps[prob] = winningRec;
    }

    // 5. Mastered Questions with timestamp comparison
    const mergedQuestions: Record<string, boolean> = {};
    const mergedQuestionTimestamps: Record<string, { mastered: boolean; updatedAt: string }> = {};
    const allQuestions = new Set<string>([
      ...Object.keys(local.masteredQuestions || {}),
      ...Object.keys(cloud.masteredQuestions || {}),
      ...Object.keys(local.questionTimestamps || {}),
      ...Object.keys(cloud.questionTimestamps || {})
    ]);

    for (const q of allQuestions) {
      const lRec = local.questionTimestamps?.[q];
      const cRec = cloud.questionTimestamps?.[q];

      let mastered: boolean;
      let winningRec: { mastered: boolean; updatedAt: string };

      if (lRec && cRec) {
        if (lRec.updatedAt >= cRec.updatedAt) {
          mastered = lRec.mastered;
          winningRec = lRec;
        } else {
          mastered = cRec.mastered;
          winningRec = cRec;
        }
      } else if (lRec) {
        mastered = lRec.mastered;
        winningRec = lRec;
      } else if (cRec) {
        mastered = cRec.mastered;
        winningRec = cRec;
      } else {
        mastered = Boolean(local.masteredQuestions?.[q] || cloud.masteredQuestions?.[q]);
        winningRec = { mastered, updatedAt: new Date(0).toISOString() };
      }

      mergedQuestions[q] = mastered;
      mergedQuestionTimestamps[q] = winningRec;
    }

    // 6. Revision Items with timestamp comparison
    const mergedRevisionItems: Record<string, boolean> = {};
    const mergedRevisionTimestamps: Record<string, { completed: boolean; updatedAt: string }> = {};
    const allRevisions = new Set<string>([
      ...Object.keys(local.revisionItems || {}),
      ...Object.keys(cloud.revisionItems || {}),
      ...Object.keys(local.revisionTimestamps || {}),
      ...Object.keys(cloud.revisionTimestamps || {})
    ]);

    for (const rev of allRevisions) {
      const lRec = local.revisionTimestamps?.[rev];
      const cRec = cloud.revisionTimestamps?.[rev];

      let completed: boolean;
      let winningRec: { completed: boolean; updatedAt: string };

      if (lRec && cRec) {
        if (lRec.updatedAt >= cRec.updatedAt) {
          completed = lRec.completed;
          winningRec = lRec;
        } else {
          completed = cRec.completed;
          winningRec = cRec;
        }
      } else if (lRec) {
        completed = lRec.completed;
        winningRec = lRec;
      } else if (cRec) {
        completed = cRec.completed;
        winningRec = cRec;
      } else {
        completed = Boolean(local.revisionItems?.[rev] || cloud.revisionItems?.[rev]);
        winningRec = { completed, updatedAt: new Date(0).toISOString() };
      }

      mergedRevisionItems[rev] = completed;
      mergedRevisionTimestamps[rev] = winningRec;
    }

    // 7. Project Checklist with timestamp comparison
    const mergedProjects: Record<string, Record<string, boolean>> = {
      ...initialProgress.projectChecklist
    };
    const mergedProjectTimestamps: Record<string, Record<string, { completed: boolean; updatedAt: string }>> = {};
    const allProjKeys = new Set([
      ...Object.keys(cloud.projectChecklist || {}),
      ...Object.keys(local.projectChecklist || {}),
      ...Object.keys(cloud.projectTimestamps || {}),
      ...Object.keys(local.projectTimestamps || {})
    ]);

    for (const projId of allProjKeys) {
      const cTasks = cloud.projectChecklist?.[projId] || {};
      const lTasks = local.projectChecklist?.[projId] || {};
      const cTimes = cloud.projectTimestamps?.[projId] || {};
      const lTimes = local.projectTimestamps?.[projId] || {};
      const taskKeys = new Set([
        ...Object.keys(cTasks), 
        ...Object.keys(lTasks),
        ...Object.keys(cTimes),
        ...Object.keys(lTimes)
      ]);

      mergedProjects[projId] = {};
      mergedProjectTimestamps[projId] = {};

      for (const tKey of taskKeys) {
        const lRec = lTimes[tKey];
        const cRec = cTimes[tKey];

        let completed: boolean;
        let winningRec: { completed: boolean; updatedAt: string };

        if (lRec && cRec) {
          if (lRec.updatedAt >= cRec.updatedAt) {
            completed = lRec.completed;
            winningRec = lRec;
          } else {
            completed = cRec.completed;
            winningRec = cRec;
          }
        } else if (lRec) {
          completed = lRec.completed;
          winningRec = lRec;
        } else if (cRec) {
          completed = cRec.completed;
          winningRec = cRec;
        } else {
          completed = Boolean(lTasks[tKey] || cTasks[tKey]);
          winningRec = { completed, updatedAt: new Date(0).toISOString() };
        }

        mergedProjects[projId][tKey] = completed;
        mergedProjectTimestamps[projId][tKey] = winningRec;
      }
    }

    // 8. Streaks & study metrics (Monotonic & Maximums)
    const currentStreak = Math.max(local.currentStreak || 1, cloud.currentStreak || 1);
    const longestStreak = Math.max(local.longestStreak || 1, cloud.longestStreak || 1);
    const studyMinutes = Math.max(local.studyMinutes || 0, cloud.studyMinutes || 0);
    const lastActiveDate = (local.lastActiveDate || '') > (cloud.lastActiveDate || '') 
      ? local.lastActiveDate 
      : cloud.lastActiveDate || new Date().toISOString().split('T')[0];

    // 9. Notes: Timestamped Last-Write-Wins (LWW)
    const localTimestamps = local.notesTimestamps || {};
    const cloudTimestamps = cloud.notesTimestamps || {};
    const mergedNotesTimestamps: Record<string, string> = { ...cloudTimestamps, ...localTimestamps };

    const mergedNotes: Record<string, string> = {
      ...initialProgress.notes,
      ...(cloud.notes || {})
    };

    const allNoteKeys = new Set([
      ...Object.keys(cloud.notes || {}),
      ...Object.keys(local.notes || {})
    ]);

    for (const key of allNoteKeys) {
      const localContent = local.notes?.[key];
      const cloudContent = cloud.notes?.[key];

      if (localContent === undefined) {
        mergedNotes[key] = cloudContent || '';
        continue;
      }
      if (cloudContent === undefined) {
        mergedNotes[key] = localContent;
        continue;
      }

      const lTime = localTimestamps[key] || '';
      const cTime = cloudTimestamps[key] || '';

      if (lTime && cTime) {
        if (lTime >= cTime) {
          mergedNotes[key] = localContent;
          mergedNotesTimestamps[key] = lTime;
        } else {
          mergedNotes[key] = cloudContent;
          mergedNotesTimestamps[key] = cTime;
        }
      } else {
        if (localContent.length >= cloudContent.length) {
          mergedNotes[key] = localContent;
        } else {
          mergedNotes[key] = cloudContent;
        }
      }
    }

    return {
      completedDays: mergedCompletedDays.sort((a, b) => a - b),
      inProgressDays: Array.from(inProgressSet).sort((a, b) => a - b),
      bookmarkedDays: mergedBookmarkedDays.sort((a, b) => a - b),
      dayTasks: mergedDayTasks,
      solvedProblems: mergedProblems,
      masteredQuestions: mergedQuestions,
      revisionItems: mergedRevisionItems,
      currentStreak,
      longestStreak,
      lastActiveDate,
      studyMinutes,
      notes: mergedNotes,
      notesTimestamps: mergedNotesTimestamps,
      projectChecklist: mergedProjects,
      dayCompletionTimestamps: mergedDayCompletionTimestamps,
      bookmarkTimestamps: mergedBookmarkTimestamps,
      taskTimestamps: mergedTaskTimestamps,
      problemTimestamps: mergedProblemTimestamps,
      questionTimestamps: mergedQuestionTimestamps,
      revisionTimestamps: mergedRevisionTimestamps,
      projectTimestamps: mergedProjectTimestamps
    };
  }

  /**
   * Schedules a debounced sync to Supabase (e.g. 1500ms after last local edit).
   * Local cache is updated instantly by caller, guaranteeing optimistic zero-latency UI.
   */
  public queueSync(progress: UserProgress, isDemoMode = false) {
    if (isDemoMode) {
      return;
    }

    // Offline-First: Always update user-scoped local cache immediately
    saveUserProgress(progress, false, this.currentUserId);
    this.pendingProgress = progress;

    if (!this.currentUserId || !isSupabaseConfigured()) {
      this.setStatus('synced');
      return;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.setStatus('offline', 'Offline — changes safely saved locally and will sync when online');
      return;
    }

    this.setStatus('pending');

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.syncNow();
    }, 1500);
  }

  /**
   * Flushes pending local changes to Supabase with exponential backoff retry.
   */
  public async syncNow(): Promise<boolean> {
    if (!this.currentUserId || !isSupabaseConfigured()) {
      return false;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.setStatus('offline', 'Offline — changes kept safely in local cache');
      return false;
    }

    if (this.isSyncInProgress) {
      return false;
    }

    this.isSyncInProgress = true;
    this.setStatus('syncing');

    try {
      const progressToSync = this.pendingProgress || loadUserProgress(false, this.currentUserId);
      const success = await SupabaseStorageProvider.saveProgress(this.currentUserId, progressToSync);

      if (success) {
        this.pendingProgress = null;
        this.retryCount = 0;
        this.setStatus('synced');
        return true;
      } else {
        this.handleSyncFailure('Database write rejected — changes kept safely in local cache');
        return false;
      }
    } catch (err: any) {
      console.error('syncNow error:', err);
      this.handleSyncFailure(err?.message || 'Sync failed');
      return false;
    } finally {
      this.isSyncInProgress = false;
    }
  }

  /**
   * Exponential backoff retry handler when sync encounters network/transient failures.
   */
  private handleSyncFailure(message: string) {
    this.setStatus('error', message);

    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }

    // Retry delays: 5s, 15s, 30s, capped at 60s
    const delays = [5000, 15000, 30000, 60000];
    const delay = delays[Math.min(this.retryCount, delays.length - 1)];
    this.retryCount++;

    this.retryTimer = setTimeout(() => {
      if (this.currentUserId && navigator.onLine) {
        this.syncNow();
      }
    }, delay);
  }

  /**
   * Silently pulls from cloud and merges without disrupting user interaction.
   */
  private async silentPullAndMerge() {
    if (!this.currentUserId || this.isSyncInProgress || this.pendingProgress) return;

    try {
      const cloud = await SupabaseStorageProvider.fetchProgress(this.currentUserId);
      if (!cloud) return;

      const local = loadUserProgress(false, this.currentUserId);
      const merged = this.mergeProgress(local, cloud);

      saveUserProgress(merged, false, this.currentUserId);
      this.setStatus('synced');
      this.notifyProgressUpdated(merged);
    } catch (err) {
      console.warn('silentPullAndMerge notice:', err);
    }
  }

  /**
   * Initializes sync upon authentication:
   * 1. Dedupes concurrent calls (mutex pattern)
   * 2. Fetches cloud progress
   * 3. Merges with user-scoped cache non-destructively
   * 4. Saves merged state to both local cache and cloud
   * 5. Returns the authoritative merged UserProgress
   */
  public async pullAndMergeOnLogin(userId: string): Promise<UserProgress> {
    if (this.loginSyncPromise && this.currentUserId === userId) {
      return this.loginSyncPromise;
    }

    this.setUserId(userId);
    this.setStatus('syncing');

    this.loginSyncPromise = (async () => {
      try {
        let localProgress = loadUserProgress(false, userId);
        
        // If this user has no scoped progress yet, check if there's guest progress to inherit
        const hasScopedProgress = localProgress.completedDays.length > 0 || 
          Object.values(localProgress.solvedProblems || {}).some(Boolean);
        
        if (!hasScopedProgress) {
          const guestProgress = loadUserProgress(false, null);
          const hasGuestProgress = guestProgress.completedDays.length > 0 || 
            Object.values(guestProgress.solvedProblems || {}).some(Boolean);
          if (hasGuestProgress) {
            localProgress = guestProgress;
          }
        }

        const cloudProgress = await SupabaseStorageProvider.fetchProgress(userId);

        if (!cloudProgress) {
          // First login: Cloud has no record yet. Push local progress to cloud!
          await SupabaseStorageProvider.saveProgress(userId, localProgress);
          saveUserProgress(localProgress, false, userId);
          this.setStatus('synced');
          return localProgress;
        }

        // Merge cloud + local non-destructively with deletion semantics
        const merged = this.mergeProgress(localProgress, cloudProgress);

        // Save to user-scoped local cache
        saveUserProgress(merged, false, userId);

        // Save merged to cloud
        await SupabaseStorageProvider.saveProgress(userId, merged);

        this.setStatus('synced');
        this.notifyProgressUpdated(merged);
        return merged;
      } catch (err: any) {
        console.error('Error during pullAndMergeOnLogin:', err);
        this.setStatus('error', 'Failed to retrieve cloud progress — using local cache');
        return loadUserProgress(false, userId);
      } finally {
        this.loginSyncPromise = null;
      }
    })();

    return this.loginSyncPromise;
  }

  /**
   * Detects whether the browser's guest local cache has progress that can be imported to the cloud.
   */
  public detectLocalProgress(): LocalProgressStats {
    const local = loadUserProgress(false, null);
    const completedDaysCount = local.completedDays.length;
    const notesCount = Object.keys(local.notes || {}).filter(k => k !== 'general' && local.notes[k]?.trim()).length;
    const solvedCount = Object.values(local.solvedProblems || {}).filter(Boolean).length;
    const masteredCount = Object.values(local.masteredQuestions || {}).filter(Boolean).length;

    const hasLocalProgress = completedDaysCount > 0 || notesCount > 0 || solvedCount > 0 || masteredCount > 0;

    return {
      hasLocalProgress,
      completedDaysCount,
      notesCount,
      solvedCount,
      masteredCount
    };
  }

  /**
   * Explicit migration tool: Takes guest local progress from localStorage
   * (focusflow_user_progress_v2) and pushes/merges it into the authenticated user's Supabase account.
   */
  public async importLocalProgressToCloud(userId: string): Promise<{ success: boolean; message: string; details?: string }> {
    if (!userId || !isSupabaseConfigured()) {
      return { success: false, message: 'Authentication or Supabase configuration missing.' };
    }

    this.setStatus('syncing');
    try {
      const local = loadUserProgress(false, null);
      const cloud = await SupabaseStorageProvider.fetchProgress(userId);

      const merged = cloud ? this.mergeProgress(local, cloud) : local;

      const saved = await SupabaseStorageProvider.saveProgress(userId, merged);
      if (saved) {
        saveUserProgress(merged, false, userId);
        this.setStatus('synced');
        this.notifyProgressUpdated(merged);
        return { 
          success: true, 
          message: `Successfully synchronized ${merged.completedDays.length} completed days and all checklist data to your account!`,
          details: `Merged ${merged.completedDays.length} days, ${Object.values(merged.solvedProblems).filter(Boolean).length} solved problems, and ${Object.keys(merged.notes).length} notes.`
        };
      } else {
        this.setStatus('error');
        return { success: false, message: 'Database save failed. Please verify network and table permissions.' };
      }
    } catch (err: any) {
      this.setStatus('error');
      return { success: false, message: err?.message || 'Migration encountered an error.' };
    }
  }
}

export const syncManager = new SyncManager();
