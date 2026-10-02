import type { UserProgress, BackupPayload } from '../types';
import { defaultStorageProvider } from './LocalStorageProvider';
import { 
  CURRENT_SCHEMA_VERSION, 
  StorageEnvelope,
  getProgressStorageKey
} from './types';

export const initialProgress: UserProgress = {
  completedDays: [],
  inProgressDays: [1],
  bookmarkedDays: [],
  dayTasks: {},
  solvedProblems: {},
  masteredQuestions: {},
  revisionItems: {},
  currentStreak: 1,
  longestStreak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  studyMinutes: 120,
  notes: {
    'general': `# FocusFlow Personal Preparation Journal
Target: AI Engineer, GenAI/RAG Engineer, Backend Engineer, Cloud Engineer.
Core Principle: Consistent simultaneous execution across DSA, SQL, Spring Boot, AWS, and GenAI.
`,
    'day-1': `# Day 1 Study Notes
- Explored JVM architecture, bytecode loading, and tier compilation.
- Two Sum solved in Java with HashMap in O(N) time and O(N) space.
- Being Zero DDL and DML table creation syntax verified.
- Python memory model PyObject reference counting verified.
`
  },
  notesTimestamps: {},
  projectChecklist: {
    'project-1': { 'task-0': true, 'task-1': false },
    'project-2': { 'task-0': false },
    'project-3': { 'task-0': false }
  },
  dayCompletionTimestamps: {},
  bookmarkTimestamps: {},
  taskTimestamps: {},
  problemTimestamps: {},
  questionTimestamps: {},
  revisionTimestamps: {},
  projectTimestamps: {}
};

export const demoProgress: UserProgress = {
  completedDays: [1, 2, 3],
  inProgressDays: [4],
  bookmarkedDays: [1, 50, 100],
  dayTasks: {
    1: { dsa: true, sql: true, backendCloud: true, aiMl: true, cs: true, handsOn: true, questions: true, deliverable: true },
    2: { dsa: true, sql: true, backendCloud: true, aiMl: true, cs: true, handsOn: true, questions: true, deliverable: true },
    3: { dsa: true, sql: true, backendCloud: true, aiMl: true, cs: true, handsOn: true, questions: true, deliverable: true }
  },
  solvedProblems: {
    'Two Sum': true,
    'Remove Duplicates from Sorted Array': true,
    'Subarray Sum Equals K': true
  },
  masteredQuestions: {
    'q-java-1': true,
    'q-sql-1': true
  },
  revisionItems: {},
  currentStreak: 3,
  longestStreak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  studyMinutes: 360,
  notes: {
    'general': `# FocusFlow Demo Mode
This is a read-only demo profile. Personal user progress is safely stored in private local storage and cannot be viewed or modified in demo mode.
`
  },
  notesTimestamps: {},
  projectChecklist: {
    'project-1': { 'task-0': true, 'task-1': true, 'task-2': false },
    'project-2': { 'task-0': false },
    'project-3': { 'task-0': false }
  },
  dayCompletionTimestamps: {},
  bookmarkTimestamps: {},
  taskTimestamps: {},
  problemTimestamps: {},
  questionTimestamps: {},
  revisionTimestamps: {},
  projectTimestamps: {}
};

/**
 * Loads user progress from storage with schema migration support and user-scoping.
 */
export function loadUserProgress(isDemoMode: boolean = false, userId?: string | null): UserProgress {
  const key = getProgressStorageKey(userId, isDemoMode);
  const envelope = defaultStorageProvider.getItem<StorageEnvelope<UserProgress> | UserProgress>(key);

  if (!envelope) {
    // If guest and legacy exists, migrate legacy
    if (!isDemoMode && !userId) {
      const legacy = defaultStorageProvider.getItem<UserProgress>('ai_engineer_150_progress_v2');
      if (legacy) {
        const migrated: UserProgress = { ...initialProgress, ...legacy };
        saveUserProgress(migrated, false, userId);
        return migrated;
      }
    }
    return isDemoMode ? demoProgress : initialProgress;
  }

  // Handle versioned envelope vs raw object
  let progressData: UserProgress;
  if ('version' in envelope && 'data' in envelope) {
    progressData = envelope.data;
  } else {
    progressData = envelope as UserProgress;
  }

  return {
    ...initialProgress,
    ...progressData,
    // Ensure nested objects always exist even if storage has older structure
    dayTasks: progressData.dayTasks || {},
    solvedProblems: progressData.solvedProblems || {},
    masteredQuestions: progressData.masteredQuestions || {},
    revisionItems: progressData.revisionItems || {},
    notes: { ...initialProgress.notes, ...(progressData.notes || {}) },
    notesTimestamps: progressData.notesTimestamps || {},
    projectChecklist: progressData.projectChecklist || initialProgress.projectChecklist,
    dayCompletionTimestamps: progressData.dayCompletionTimestamps || {},
    bookmarkTimestamps: progressData.bookmarkTimestamps || {},
    taskTimestamps: progressData.taskTimestamps || {},
    problemTimestamps: progressData.problemTimestamps || {},
    questionTimestamps: progressData.questionTimestamps || {},
    revisionTimestamps: progressData.revisionTimestamps || {},
    projectTimestamps: progressData.projectTimestamps || {}
  };
}

/**
 * Persists user progress inside a versioned envelope scoped by user.
 */
export function saveUserProgress(progress: UserProgress, isDemoMode: boolean = false, userId?: string | null): void {
  const key = getProgressStorageKey(userId, isDemoMode);
  const envelope: StorageEnvelope<UserProgress> = {
    version: CURRENT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    ownerUserId: userId || null,
    data: progress
  };
  defaultStorageProvider.setItem(key, envelope);
}

/**
 * Exports progress as a formatted JSON string for downloading as a personal backup.
 */
export function exportBackupJson(progress: UserProgress): string {
  const payload: BackupPayload = {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    app: 'FocusFlow 150-Day OS',
    progress
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Imports and validates a JSON backup payload.
 */
export function importBackupJson(jsonString: string, userId?: string | null): UserProgress {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('Invalid JSON format');
    }

    let importedProgress: UserProgress;
    if (parsed.app === 'FocusFlow 150-Day OS' && parsed.progress) {
      importedProgress = parsed.progress;
    } else if (Array.isArray(parsed.completedDays)) {
      importedProgress = parsed as UserProgress;
    } else {
      throw new Error('Unrecognized backup schema');
    }

    const validated: UserProgress = {
      ...initialProgress,
      ...importedProgress,
      dayTasks: importedProgress.dayTasks || {},
      solvedProblems: importedProgress.solvedProblems || {},
      masteredQuestions: importedProgress.masteredQuestions || {},
      revisionItems: importedProgress.revisionItems || {},
      notes: { ...initialProgress.notes, ...(importedProgress.notes || {}) },
      notesTimestamps: importedProgress.notesTimestamps || {},
      projectChecklist: importedProgress.projectChecklist || initialProgress.projectChecklist,
      dayCompletionTimestamps: importedProgress.dayCompletionTimestamps || {},
      bookmarkTimestamps: importedProgress.bookmarkTimestamps || {},
      taskTimestamps: importedProgress.taskTimestamps || {},
      problemTimestamps: importedProgress.problemTimestamps || {},
      questionTimestamps: importedProgress.questionTimestamps || {},
      revisionTimestamps: importedProgress.revisionTimestamps || {},
      projectTimestamps: importedProgress.projectTimestamps || {}
    };

    saveUserProgress(validated, false, userId);
    return validated;
  } catch (err: any) {
    throw new Error(`Backup restore failed: ${err.message || 'Corrupt file'}`);
  }
}

/**
 * Clears private local storage progress.
 */
export function resetStoredProgress(isDemoMode: boolean = false, userId?: string | null): void {
  const key = getProgressStorageKey(userId, isDemoMode);
  defaultStorageProvider.removeItem(key);
}

