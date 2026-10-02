import type { UserProgress } from '../types';
import { SupabaseStorageProvider } from './SupabaseStorageProvider';
import { 
  loadUserProgress, 
  saveUserProgress, 
  initialProgress 
} from './progressStorage';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'unconfigured' | 'error' | 'pending';

export interface SyncListener {
  (status: SyncStatus, lastSyncedAt?: Date, errorMessage?: string): void;
}

class SyncManager {
  private status: SyncStatus = 'unconfigured';
  private lastSyncedAt?: Date;
  private errorMessage?: string;
  private listeners: Set<SyncListener> = new Set();
  private progressListeners: Set<(progress: UserProgress) => void> = new Set();
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private currentUserId: string | null = null;
  private isSyncInProgress = false;
  private pendingProgress: UserProgress | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (this.currentUserId) {
          this.setStatus('pending');
          this.syncNow();
        } else {
          this.updateInitialStatus();
        }
      });

      window.addEventListener('offline', () => {
        this.setStatus('offline', 'Network connection unavailable — saved locally');
      });

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
    this.currentUserId = userId;
    if (!userId) {
      this.updateInitialStatus();
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

  /**
   * Non-destructive union merge of local and cloud progress.
   * Ensures that if device A did Day 27 and device B did Day 28,
   * both are preserved seamlessly with zero data loss.
   */
  public mergeProgress(local: UserProgress, cloud: UserProgress): UserProgress {
    // 1. Completed & in-progress days (Set union)
    const completedSet = new Set([...(local.completedDays || []), ...(cloud.completedDays || [])]);
    const inProgressSet = new Set([...(local.inProgressDays || []), ...(cloud.inProgressDays || [])]);

    // 2. Bookmarked days (Set union)
    const bookmarkedSet = new Set([...(local.bookmarkedDays || []), ...(cloud.bookmarkedDays || [])]);

    // 3. Day tasks 8-pillar boolean OR merge
    const mergedDayTasks: UserProgress['dayTasks'] = {};
    const allDays = new Set([
      ...Object.keys(local.dayTasks || {}),
      ...Object.keys(cloud.dayTasks || {})
    ]);

    for (const dayStr of allDays) {
      const dayNum = parseInt(dayStr, 10);
      const l = local.dayTasks?.[dayNum];
      const c = cloud.dayTasks?.[dayNum];
      mergedDayTasks[dayNum] = {
        dsa: Boolean(l?.dsa || c?.dsa),
        sql: Boolean(l?.sql || c?.sql),
        backendCloud: Boolean(l?.backendCloud || c?.backendCloud),
        aiMl: Boolean(l?.aiMl || c?.aiMl),
        cs: Boolean(l?.cs || c?.cs),
        handsOn: Boolean(l?.handsOn || c?.handsOn),
        questions: Boolean(l?.questions || c?.questions),
        deliverable: Boolean(l?.deliverable || c?.deliverable)
      };
    }

    // 4. Solved problems boolean OR merge
    const mergedProblems: Record<string, boolean> = {
      ...(cloud.solvedProblems || {}),
      ...(local.solvedProblems || {})
    };
    for (const key of Object.keys(cloud.solvedProblems || {})) {
      if (cloud.solvedProblems[key]) {
        mergedProblems[key] = true;
      }
    }

    // 5. Mastered questions boolean OR merge
    const mergedQuestions: Record<string, boolean> = {
      ...(cloud.masteredQuestions || {}),
      ...(local.masteredQuestions || {})
    };
    for (const key of Object.keys(cloud.masteredQuestions || {})) {
      if (cloud.masteredQuestions[key]) {
        mergedQuestions[key] = true;
      }
    }

    // 6. Streaks & study metrics (Maximums)
    const currentStreak = Math.max(local.currentStreak || 1, cloud.currentStreak || 1);
    const longestStreak = Math.max(local.longestStreak || 1, cloud.longestStreak || 1);
    const studyMinutes = Math.max(local.studyMinutes || 0, cloud.studyMinutes || 0);
    const lastActiveDate = (local.lastActiveDate || '') > (cloud.lastActiveDate || '') 
      ? local.lastActiveDate 
      : cloud.lastActiveDate || new Date().toISOString().split('T')[0];

    // 7. Notes: Key union, favoring whichever is non-empty/detailed
    const mergedNotes: Record<string, string> = {
      ...initialProgress.notes,
      ...(cloud.notes || {})
    };
    for (const [key, content] of Object.entries(local.notes || {})) {
      if (!mergedNotes[key] || content.length >= (mergedNotes[key]?.length || 0)) {
        mergedNotes[key] = content;
      }
    }

    // 8. Project checklist: Boolean OR merge
    const mergedProjects: Record<string, Record<string, boolean>> = {
      ...initialProgress.projectChecklist
    };
    const allProjKeys = new Set([
      ...Object.keys(cloud.projectChecklist || {}),
      ...Object.keys(local.projectChecklist || {})
    ]);
    for (const projId of allProjKeys) {
      const cTasks = cloud.projectChecklist?.[projId] || {};
      const lTasks = local.projectChecklist?.[projId] || {};
      const taskKeys = new Set([...Object.keys(cTasks), ...Object.keys(lTasks)]);
      mergedProjects[projId] = {};
      for (const tKey of taskKeys) {
        mergedProjects[projId][tKey] = Boolean(lTasks[tKey] || cTasks[tKey]);
      }
    }

    return {
      completedDays: Array.from(completedSet).sort((a, b) => a - b),
      inProgressDays: Array.from(inProgressSet).sort((a, b) => a - b),
      bookmarkedDays: Array.from(bookmarkedSet).sort((a, b) => a - b),
      dayTasks: mergedDayTasks,
      solvedProblems: mergedProblems,
      masteredQuestions: mergedQuestions,
      currentStreak,
      longestStreak,
      lastActiveDate,
      studyMinutes,
      notes: mergedNotes,
      projectChecklist: mergedProjects
    };
  }

  /**
   * Schedules a debounced sync to Supabase (e.g. 1500ms after last local edit).
   * Local cache is updated instantly by caller, guaranteeing optimistic zero-latency UI.
   */
  public queueSync(progress: UserProgress, isDemoMode = false) {
    if (isDemoMode) {
      // Demo mode never writes to cloud
      return;
    }

    // Always update local cache first (offline-first)
    saveUserProgress(progress, false);
    this.pendingProgress = progress;

    if (!this.currentUserId || !isSupabaseConfigured()) {
      this.setStatus('synced');
      return;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.setStatus('offline', 'Offline — changes stored locally and will sync when online');
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
   * Immediately flushes any pending local changes to Supabase.
   */
  public async syncNow(): Promise<boolean> {
    if (!this.currentUserId || !isSupabaseConfigured()) {
      return false;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      this.setStatus('offline', 'Offline — changes stored locally');
      return false;
    }

    if (this.isSyncInProgress) {
      return false;
    }

    this.isSyncInProgress = true;
    this.setStatus('syncing');

    try {
      const progressToSync = this.pendingProgress || loadUserProgress(false);
      const success = await SupabaseStorageProvider.saveProgress(this.currentUserId, progressToSync);

      if (success) {
        this.setStatus('synced');
        return true;
      } else {
        this.setStatus('error', 'Sync failed — changes kept in local cache');
        return false;
      }
    } catch (err: any) {
      console.error('syncNow error:', err);
      this.setStatus('error', err?.message || 'Sync failed');
      return false;
    } finally {
      this.isSyncInProgress = false;
    }
  }

  /**
   * Initializes sync upon authentication:
   * 1. Fetches cloud progress
   * 2. Merges with local cache using non-destructive union merge
   * 3. Saves merged state to both local cache and cloud
   * 4. Returns the authoritative merged UserProgress
   */
  public async pullAndMergeOnLogin(userId: string): Promise<UserProgress> {
    this.setUserId(userId);
    this.setStatus('syncing');

    const localProgress = loadUserProgress(false);

    try {
      const cloudProgress = await SupabaseStorageProvider.fetchProgress(userId);

      if (!cloudProgress) {
        // First login: Cloud has no record yet. Push local progress to cloud!
        await SupabaseStorageProvider.saveProgress(userId, localProgress);
        this.setStatus('synced');
        return localProgress;
      }

      // Merge cloud + local non-destructively
      const merged = this.mergeProgress(localProgress, cloudProgress);

      // Save to local cache
      saveUserProgress(merged, false);

      // Save merged to cloud
      await SupabaseStorageProvider.saveProgress(userId, merged);

      this.setStatus('synced');
      this.notifyProgressUpdated(merged);
      return merged;
    } catch (err: any) {
      console.error('Error during pullAndMergeOnLogin:', err);
      this.setStatus('error', 'Failed to retrieve cloud progress — using local cache');
      return localProgress;
    }
  }

  /**
   * Explicit migration tool: Takes current local progress from localStorage
   * and pushes/merges it into the authenticated user's Supabase account.
   */
  public async importLocalProgressToCloud(userId: string): Promise<{ success: boolean; message: string }> {
    if (!userId || !isSupabaseConfigured()) {
      return { success: false, message: 'Authentication or Supabase configuration missing.' };
    }

    this.setStatus('syncing');
    try {
      const local = loadUserProgress(false);
      const cloud = await SupabaseStorageProvider.fetchProgress(userId);

      const merged = cloud ? this.mergeProgress(local, cloud) : local;

      const saved = await SupabaseStorageProvider.saveProgress(userId, merged);
      if (saved) {
        saveUserProgress(merged, false);
        this.setStatus('synced');
        this.notifyProgressUpdated(merged);
        return { 
          success: true, 
          message: `Successfully synchronized ${merged.completedDays.length} completed days and all checklist data to your account!` 
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
