import { useState, useEffect, useCallback, useRef } from 'react';
import type { UserProgress, AppSettings } from '../types';
import confetti from 'canvas-confetti';
import { 
  loadUserProgress, 
  saveUserProgress, 
  exportBackupJson, 
  importBackupJson, 
  resetStoredProgress,
  loadSettings,
  saveSettings,
  initialProgress
} from '../storage';

import { syncManager } from '../storage/syncManager';

export function useProgress(userId?: string | null) {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress(settings.isDemoMode, userId));
  const isReceivingRemoteUpdateRef = useRef(false);

  // When user identity changes (login/logout), reload the user-scoped progress
  useEffect(() => {
    if (settings.isDemoMode) return;
    setProgress(loadUserProgress(false, userId));
  }, [userId, settings.isDemoMode]);

  // Persist settings whenever changed
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Persist progress whenever updated (instant offline-first local cache + debounced cloud sync)
  useEffect(() => {
    if (isReceivingRemoteUpdateRef.current) {
      isReceivingRemoteUpdateRef.current = false;
      return;
    }

    if (settings.isDemoMode) {
      saveUserProgress(progress, true);
    } else {
      syncManager.queueSync(progress, false);
    }
  }, [progress, settings.isDemoMode]);

  // Listen to background cloud sync / merge updates
  useEffect(() => {
    const unsub = syncManager.onProgressUpdated((mergedProgress) => {
      isReceivingRemoteUpdateRef.current = true;
      setProgress(mergedProgress);
    });
    return unsub;
  }, []);

  // Direct progress updater when cloud state is merged
  const setFullProgress = useCallback((newProgress: UserProgress) => {
    isReceivingRemoteUpdateRef.current = true;
    setProgress(newProgress);
  }, []);

  // Reload progress when toggling demo mode
  const toggleDemoMode = useCallback((enabled?: boolean) => {
    setSettings(prev => {
      const nextDemo = enabled !== undefined ? enabled : !prev.isDemoMode;
      const nextSettings = { ...prev, isDemoMode: nextDemo };
      setProgress(loadUserProgress(nextDemo, userId));
      return nextSettings;
    });
  }, [userId]);

  // Streak verification logic
  useEffect(() => {
    if (settings.isDemoMode) return;
    const today = new Date().toISOString().split('T')[0];
    if (progress.lastActiveDate !== today) {
      const lastDate = new Date(progress.lastActiveDate);
      const currentDate = new Date(today);
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        // Consecutive day
        setProgress(prev => {
          const newStreak = prev.currentStreak + 1;
          return {
            ...prev,
            currentStreak: newStreak,
            longestStreak: Math.max(prev.longestStreak, newStreak),
            lastActiveDate: today
          };
        });
      } else if (diffDays > 1) {
        // Streak broken
        setProgress(prev => ({
          ...prev,
          currentStreak: 1,
          lastActiveDate: today
        }));
      }
    }
  }, [settings.isDemoMode, progress.lastActiveDate]);

  const toggleDayCompletion = (day: number) => {
    const now = new Date().toISOString();
    setProgress(prev => {
      const isCompleted = prev.completedDays.includes(day);
      const nextState = !isCompleted;
      let newCompleted: number[];
      let newInProgress = prev.inProgressDays;

      if (!nextState) {
        newCompleted = prev.completedDays.filter(d => d !== day);
      } else {
        newCompleted = [...prev.completedDays, day].sort((a, b) => a - b);
        newInProgress = prev.inProgressDays.filter(d => d !== day);

        // Fire festive celebration confetti!
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // Ignore confetti error
        }
      }

      return {
        ...prev,
        completedDays: newCompleted,
        inProgressDays: newInProgress,
        dayCompletionTimestamps: {
          ...(prev.dayCompletionTimestamps || {}),
          [day]: { completed: nextState, updatedAt: now }
        }
      };
    });
  };

  const toggleBookmark = (day: number) => {
    const now = new Date().toISOString();
    setProgress(prev => {
      const isBookmarked = prev.bookmarkedDays.includes(day);
      const nextState = !isBookmarked;
      return {
        ...prev,
        bookmarkedDays: nextState
          ? [...prev.bookmarkedDays, day].sort((a, b) => a - b)
          : prev.bookmarkedDays.filter(d => d !== day),
        bookmarkTimestamps: {
          ...(prev.bookmarkTimestamps || {}),
          [day]: { bookmarked: nextState, updatedAt: now }
        }
      };
    });
  };

  const toggleTask = (day: number, taskKey: 'dsa' | 'sql' | 'backendCloud' | 'aiMl' | 'cs' | 'handsOn' | 'questions' | 'deliverable') => {
    const now = new Date().toISOString();
    setProgress(prev => {
      const currentDayTasks = prev.dayTasks[day] || {
        dsa: false,
        sql: false,
        backendCloud: false,
        aiMl: false,
        cs: false,
        handsOn: false,
        questions: false,
        deliverable: false
      };

      const nextTaskState = !currentDayTasks[taskKey];
      const updatedDayTasks = {
        ...currentDayTasks,
        [taskKey]: nextTaskState
      };

      // Auto mark completed if all 8 tasks checked
      const allDone = Object.values(updatedDayTasks).every(Boolean);
      let completedDays = prev.completedDays;
      let dayTimestamps = prev.dayCompletionTimestamps || {};
      if (allDone && !completedDays.includes(day)) {
        completedDays = [...completedDays, day].sort((a, b) => a - b);
        dayTimestamps = {
          ...dayTimestamps,
          [day]: { completed: true, updatedAt: now }
        };
      }

      const dayTaskTimestamps = prev.taskTimestamps?.[day] || {};

      return {
        ...prev,
        dayTasks: {
          ...prev.dayTasks,
          [day]: updatedDayTasks
        },
        completedDays,
        dayCompletionTimestamps: dayTimestamps,
        taskTimestamps: {
          ...(prev.taskTimestamps || {}),
          [day]: {
            ...dayTaskTimestamps,
            [taskKey]: { done: nextTaskState, updatedAt: now }
          }
        }
      };
    });
  };

  const toggleProblemSolved = (problemTitle: string) => {
    const now = new Date().toISOString();
    setProgress(prev => {
      const nextSolved = !prev.solvedProblems[problemTitle];
      return {
        ...prev,
        solvedProblems: {
          ...prev.solvedProblems,
          [problemTitle]: nextSolved
        },
        problemTimestamps: {
          ...(prev.problemTimestamps || {}),
          [problemTitle]: { solved: nextSolved, updatedAt: now }
        }
      };
    });
  };

  const toggleQuestionMastered = (questionId: string) => {
    const now = new Date().toISOString();
    setProgress(prev => {
      const nextMastered = !prev.masteredQuestions[questionId];
      return {
        ...prev,
        masteredQuestions: {
          ...prev.masteredQuestions,
          [questionId]: nextMastered
        },
        questionTimestamps: {
          ...(prev.questionTimestamps || {}),
          [questionId]: { mastered: nextMastered, updatedAt: now }
        }
      };
    });
  };

  const saveNote = (key: string, content: string) => {
    const now = new Date().toISOString();
    setProgress(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [key]: content
      },
      notesTimestamps: {
        ...(prev.notesTimestamps || {}),
        [key]: now
      }
    }));
  };

  const toggleRevisionItem = (revKey: string) => {
    const now = new Date().toISOString();
    setProgress(prev => {
      const current = prev.revisionItems || {};
      const nextState = !current[revKey];
      return {
        ...prev,
        revisionItems: {
          ...current,
          [revKey]: nextState
        },
        revisionTimestamps: {
          ...(prev.revisionTimestamps || {}),
          [revKey]: { completed: nextState, updatedAt: now }
        }
      };
    });
  };

  const addStudyMinutes = (mins: number) => {
    setProgress(prev => ({
      ...prev,
      studyMinutes: prev.studyMinutes + mins
    }));
  };

  const toggleProjectTask = (projectId: string, taskId: string) => {
    const now = new Date().toISOString();
    setProgress(prev => {
      const projectTasks = prev.projectChecklist[projectId] || {};
      const nextDone = !projectTasks[taskId];
      const projTimestamps = prev.projectTimestamps?.[projectId] || {};
      return {
        ...prev,
        projectChecklist: {
          ...prev.projectChecklist,
          [projectId]: {
            ...projectTasks,
            [taskId]: nextDone
          }
        },
        projectTimestamps: {
          ...(prev.projectTimestamps || {}),
          [projectId]: {
            ...projTimestamps,
            [taskId]: { completed: nextDone, updatedAt: now }
          }
        }
      };
    });
  };

  const resetAllProgress = () => {
    if (window.confirm('Are you sure you want to reset all preparation progress? This action cannot be undone.')) {
      setProgress(initialProgress);
      resetStoredProgress(settings.isDemoMode, userId);
    }
  };

  const exportBackup = () => {
    const json = exportBackupJson(progress);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `focusflow-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importBackup = (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const restored = importBackupJson(content, userId);
          setProgress(restored);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read backup file'));
      reader.readAsText(file);
    });
  };

  return {
    progress,
    settings,
    isDemoMode: settings.isDemoMode,
    toggleDemoMode,
    toggleDayCompletion,
    toggleBookmark,
    toggleTask,
    toggleProblemSolved,
    toggleQuestionMastered,
    saveNote,
    addStudyMinutes,
    toggleProjectTask,
    toggleRevisionItem,
    resetAllProgress,
    exportBackup,
    importBackup,
    setFullProgress
  };
}
