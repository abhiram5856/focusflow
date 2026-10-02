import { masterCurriculum } from '../data/curriculumData.ts';
import { syncManager } from '../storage/syncManager.ts';
import { initialProgress, demoProgress, exportBackupJson, importBackupJson } from '../storage/progressStorage.ts';
import { getProgressStorageKey, PROGRESS_STORAGE_KEY, DEMO_PROGRESS_STORAGE_KEY } from '../storage/types.ts';
import type { UserProgress } from '../types/index.ts';

declare const process: any;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
  }
}

console.log('====================================================');
console.log('FOCUSFLOW 150-DAY OS: PRODUCTION VERIFICATION SUITE');
console.log('====================================================\n');

// ----------------------------------------------------
// SECTION 1: 150-DAY CURRICULUM INTEGRITY AUDIT
// ----------------------------------------------------
console.log('--- 1. Curriculum Integrity Audit ---');
assert(masterCurriculum.length === 150, `Curriculum has exactly 150 days (found ${masterCurriculum.length})`);

const dayNumbers = masterCurriculum.map(d => d.day);
const uniqueDays = new Set(dayNumbers);
assert(uniqueDays.size === 150, `All 150 days are unique (found ${uniqueDays.size})`);

let missingDays: number[] = [];
for (let i = 1; i <= 150; i++) {
  if (!uniqueDays.has(i)) missingDays.push(i);
}
assert(missingDays.length === 0, `No missing days in sequence 1..150`, `Missing: ${missingDays.join(',')}`);

let dsaErrors = 0;
let sqlErrors = 0;
let backendErrors = 0;
let aiMlErrors = 0;
let csErrors = 0;
let handsOnErrors = 0;
let questionErrors = 0;
let workloadErrors = 0;
let deliverableErrors = 0;

for (const d of masterCurriculum) {
  if (!d.dsaTrack?.pattern || !d.dsaTrack?.problems || d.dsaTrack.problems.length === 0) dsaErrors++;
  if (!d.sqlTrack?.topic || !d.sqlTrack?.exercise?.title) sqlErrors++;
  if (!d.backendCloudTrack?.topic || !d.backendCloudTrack?.learn || d.backendCloudTrack.learn.length === 0) backendErrors++;
  if (!d.aiMlTrack?.topic || !d.aiMlTrack?.learn || d.aiMlTrack.learn.length === 0) aiMlErrors++;
  if (!d.csFoundationTrack?.topic || !d.csFoundationTrack?.concept) csErrors++;
  if (!d.handsOnEngineering?.title || !d.handsOnEngineering?.task) handsOnErrors++;
  if (!d.interviewQuestions || d.interviewQuestions.length === 0) questionErrors++;
  if (!d.dailyWorkload?.mustDo || d.dailyWorkload.mustDo.length === 0) workloadErrors++;
  if (!d.deliverable || d.deliverable.trim().length === 0) deliverableErrors++;
}

assert(dsaErrors === 0, `All 150 days contain DSA track and practice problems (errors: ${dsaErrors})`);
assert(sqlErrors === 0, `All 150 days contain SQL track and exercises (errors: ${sqlErrors})`);
assert(backendErrors === 0, `All 150 days contain Backend/Cloud track (errors: ${backendErrors})`);
assert(aiMlErrors === 0, `All 150 days contain AI/ML/GenAI track (errors: ${aiMlErrors})`);
assert(csErrors === 0, `All 150 days contain CS Foundations track (errors: ${csErrors})`);
assert(handsOnErrors === 0, `All 150 days contain actionable Hands-On Engineering tasks (errors: ${handsOnErrors})`);
assert(questionErrors === 0, `All 150 days contain verified Interview Questions (errors: ${questionErrors})`);
assert(workloadErrors === 0, `All 150 days contain Tier 1/2/3 Daily Workload tiers (errors: ${workloadErrors})`);
assert(deliverableErrors === 0, `All 150 days contain clear deliverables (errors: ${deliverableErrors})`);

// ----------------------------------------------------
// SECTION 2: MULTI-DEVICE ADDITIVE PROGRESS MERGE
// ----------------------------------------------------
console.log('\n--- 2. Multi-Device Additive Progress Merge ---');

const laptop1: UserProgress = {
  ...initialProgress,
  completedDays: [1, 27],
  dayCompletionTimestamps: {
    1: { completed: true, updatedAt: '2026-10-01T10:00:00Z' },
    27: { completed: true, updatedAt: '2026-10-02T10:00:00Z' }
  },
  solvedProblems: { 'Two Sum': true },
  problemTimestamps: { 'Two Sum': { solved: true, updatedAt: '2026-10-02T10:00:00Z' } },
  currentStreak: 2,
  longestStreak: 2,
  studyMinutes: 120
};

const laptop2: UserProgress = {
  ...initialProgress,
  completedDays: [1, 28],
  dayCompletionTimestamps: {
    1: { completed: true, updatedAt: '2026-10-01T10:00:00Z' },
    28: { completed: true, updatedAt: '2026-10-02T12:00:00Z' }
  },
  solvedProblems: { '3Sum': true },
  problemTimestamps: { '3Sum': { solved: true, updatedAt: '2026-10-02T12:00:00Z' } },
  currentStreak: 3,
  longestStreak: 3,
  studyMinutes: 150
};

const mergedAdditive = syncManager.mergeProgress(laptop1, laptop2);
assert(
  mergedAdditive.completedDays.includes(1) && 
  mergedAdditive.completedDays.includes(27) && 
  mergedAdditive.completedDays.includes(28),
  'Additive days merged correctly: Laptop 1 (Day 27) + Laptop 2 (Day 28) -> [1, 27, 28]'
);
assert(
  mergedAdditive.solvedProblems['Two Sum'] === true && 
  mergedAdditive.solvedProblems['3Sum'] === true,
  'Additive solved problems merged: Two Sum + 3Sum both solved'
);
assert(
  mergedAdditive.studyMinutes === 150,
  `Study minutes monotonic max: 150 (got ${mergedAdditive.studyMinutes})`
);
assert(
  mergedAdditive.currentStreak === 3,
  `Streak calculation max: 3 (got ${mergedAdditive.currentStreak})`
);

// ----------------------------------------------------
// SECTION 3: DELETION SEMANTICS & NO PHANTOM RESURRECTION
// ----------------------------------------------------
console.log('\n--- 3. Deletion Semantics & Resurrection Prevention ---');

// Cloud had Day 20 completed at T0
const cloudWithDay20: UserProgress = {
  ...initialProgress,
  completedDays: [20],
  dayCompletionTimestamps: {
    20: { completed: true, updatedAt: '2026-10-01T08:00:00Z' }
  },
  bookmarkedDays: [20],
  bookmarkTimestamps: {
    20: { bookmarked: true, updatedAt: '2026-10-01T08:00:00Z' }
  },
  solvedProblems: { 'Reverse Linked List': true },
  problemTimestamps: {
    'Reverse Linked List': { solved: true, updatedAt: '2026-10-01T08:00:00Z' }
  }
};

// User explicitly uncompleted Day 20, unbookmarked Day 20, and unchecked problem at T1 > T0
const localUncompletedDay20: UserProgress = {
  ...initialProgress,
  completedDays: [], // Day 20 removed
  dayCompletionTimestamps: {
    20: { completed: false, updatedAt: '2026-10-02T09:00:00Z' }
  },
  bookmarkedDays: [], // Day 20 unbookmarked
  bookmarkTimestamps: {
    20: { bookmarked: false, updatedAt: '2026-10-02T09:00:00Z' }
  },
  solvedProblems: { 'Reverse Linked List': false }, // unchecked
  problemTimestamps: {
    'Reverse Linked List': { solved: false, updatedAt: '2026-10-02T09:00:00Z' }
  }
};

const mergedDeletion = syncManager.mergeProgress(localUncompletedDay20, cloudWithDay20);

assert(
  !mergedDeletion.completedDays.includes(20),
  'Deletion semantics: Uncompleted Day 20 is NOT resurrected by cloud'
);
assert(
  !mergedDeletion.bookmarkedDays.includes(20),
  'Deletion semantics: Unbookmarked Day 20 is NOT resurrected by cloud'
);
assert(
  mergedDeletion.solvedProblems['Reverse Linked List'] === false,
  'Deletion semantics: Unsolved problem is NOT resurrected by cloud'
);

// ----------------------------------------------------
// SECTION 4: STALE DEVICE PROTECTION
// ----------------------------------------------------
console.log('\n--- 4. Stale Device Protection ---');

// Stale device offline for 3 days (timestamps from Oct 01)
const staleDevice: UserProgress = {
  ...initialProgress,
  completedDays: [1, 2],
  dayCompletionTimestamps: {
    1: { completed: true, updatedAt: '2026-10-01T00:00:00Z' },
    2: { completed: true, updatedAt: '2026-10-01T00:00:00Z' }
  },
  notes: {
    'general': 'Old note from stale device'
  },
  notesTimestamps: {
    'general': '2026-10-01T00:00:00Z'
  }
};

// Cloud updated on Oct 04 (uncompleted Day 2, added Day 3, updated note)
const freshCloud: UserProgress = {
  ...initialProgress,
  completedDays: [1, 3],
  dayCompletionTimestamps: {
    1: { completed: true, updatedAt: '2026-10-01T00:00:00Z' },
    2: { completed: false, updatedAt: '2026-10-04T12:00:00Z' },
    3: { completed: true, updatedAt: '2026-10-04T12:00:00Z' }
  },
  notes: {
    'general': 'Fresh note updated on Phone'
  },
  notesTimestamps: {
    'general': '2026-10-04T12:00:00Z'
  }
};

const mergedStale = syncManager.mergeProgress(staleDevice, freshCloud);

assert(
  !mergedStale.completedDays.includes(2),
  'Stale device cannot resurrect Day 2 because Cloud uncompleted it later'
);
assert(
  mergedStale.completedDays.includes(3),
  'Fresh cloud Day 3 is preserved when stale device connects'
);
assert(
  mergedStale.notes['general'] === 'Fresh note updated on Phone',
  'Stale device cannot overwrite newer cloud note'
);

// ----------------------------------------------------
// SECTION 5: NOTES CONFLICT RESOLUTION (LWW)
// ----------------------------------------------------
console.log('\n--- 5. Notes Conflict Resolution (Last-Write-Wins) ---');

const noteA: UserProgress = {
  ...initialProgress,
  notes: { 'day-5': 'Note written on Laptop at 14:00' },
  notesTimestamps: { 'day-5': '2026-10-02T14:00:00Z' }
};

const noteB: UserProgress = {
  ...initialProgress,
  notes: { 'day-5': 'Note updated on Phone at 14:30' },
  notesTimestamps: { 'day-5': '2026-10-02T14:30:00Z' }
};

const mergedNote = syncManager.mergeProgress(noteA, noteB);
assert(
  mergedNote.notes['day-5'] === 'Note updated on Phone at 14:30',
  'Last-Write-Wins correctly selected later timestamp note (14:30 > 14:00)'
);

// ----------------------------------------------------
// SECTION 6: STORAGE USER-SCOPING & ISOLATION
// ----------------------------------------------------
console.log('\n--- 6. User Storage Scoping & Isolation ---');

const guestKey = getProgressStorageKey(null, false);
const userAKey = getProgressStorageKey('user-alice-123', false);
const userBKey = getProgressStorageKey('user-bob-456', false);
const demoKey = getProgressStorageKey('user-alice-123', true);

assert(guestKey === PROGRESS_STORAGE_KEY, `Guest key is default: ${guestKey}`);
assert(userAKey === `${PROGRESS_STORAGE_KEY}_usr_user-alice-123`, `User A key is scoped: ${userAKey}`);
assert(userBKey === `${PROGRESS_STORAGE_KEY}_usr_user-bob-456`, `User B key is scoped: ${userBKey}`);
assert(userAKey !== userBKey, 'User A and User B have strictly isolated storage keys');
assert(demoKey === DEMO_PROGRESS_STORAGE_KEY, `Demo mode always uses isolated demo key: ${demoKey}`);

// ----------------------------------------------------
// SECTION 7: DEMO MODE PURITY
// ----------------------------------------------------
console.log('\n--- 7. Demo Mode Purity ---');

assert(demoProgress.completedDays.length === 3, 'Demo progress has 3 pre-filled days');
assert(initialProgress.completedDays.length === 0, 'Initial user progress starts empty');
assert(
  demoProgress.notes['general'].includes('Demo Mode'),
  'Demo progress contains isolated demo notice'
);

// ----------------------------------------------------
// SECTION 8: BACKUP EXPORT & IMPORT VALIDATION
// ----------------------------------------------------
console.log('\n--- 8. Backup Export & Import Validation ---');

const sampleProgress: UserProgress = {
  ...initialProgress,
  completedDays: [1, 2, 3, 4, 5],
  currentStreak: 5,
  longestStreak: 5,
  studyMinutes: 600,
  notes: { 'day-1': 'Sample backup note' }
};

const exportedJson = exportBackupJson(sampleProgress);
assert(typeof exportedJson === 'string' && exportedJson.includes('FocusFlow 150-Day OS'), 'Exported backup contains valid JSON header');

const restoredProgress = importBackupJson(exportedJson, 'test-user-id');
assert(
  restoredProgress.completedDays.length === 5 &&
  restoredProgress.studyMinutes === 600 &&
  restoredProgress.notes['day-1'] === 'Sample backup note',
  'Restored progress matches original export exactly'
);

// Test corrupt JSON detection
let corruptCaught = false;
try {
  importBackupJson('{"broken": true, [invalid json]}');
} catch {
  corruptCaught = true;
}
assert(corruptCaught, 'Corrupt backup JSON is rejected with error, preventing state destruction');

// ----------------------------------------------------
// FINAL VERIFICATION SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`TOTAL TESTS: ${totalTests}`);
console.log(`PASSED: ${passedTests}`);
console.log(`FAILED: ${failedTests}`);
console.log('====================================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL AUDIT TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
}
