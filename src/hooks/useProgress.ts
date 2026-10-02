import { useState, useEffect, useCallback } from 'react';
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

export function useProgress() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [progress, setProgress] = useState<UserProgress>(() => loadUserProgress(settings.isDemoMode));

  // Persist settings whenever changed
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Persist progress whenever updated (instant offline-first local cache + debounced cloud sync)
  useEffect(() => {
    if (settings.isDemoMode) {
      saveUserProgress(progress, true);
    } else {
      syncManager.queueSync(progress, false);
    }
  }, [progress, settings.isDemoMode]);

  // Listen to background cloud sync / merge updates
  useEffect(() => {
    const unsub = syncManager.onProgressUpdated((mergedProgress) => {
      setProgress(mergedProgress);
    });
    return unsub;
  }, []);

  // Direct progress updater when cloud state is merged
  const setFullProgress = useCallback((newProgress: UserProgress) => {
    setProgress(newProgress);
  }, []);

  // Reload progress when toggling demo mode
  const toggleDemoMode = useCallback((enabled?: boolean) => {
    setSettings(prev => {
      const nextDemo = enabled !== undefined ? enabled : !prev.isDemoMode;
      const nextSettings = { ...prev, isDemoMode: nextDemo };
      setProgress(loadUserProgress(nextDemo));
      return nextSettings;
    });
  }, []);

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
    setProgress(prev => {
      const isCompleted = prev.completedDays.includes(day);
      let newCompleted: number[];
      let newInProgress = prev.inProgressDays;

      if (isCompleted) {
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
        inProgressDays: newInProgress
      };
    });
  };

  const toggleBookmark = (day: number) => {
    setProgress(prev => {
      const isBookmarked = prev.bookmarkedDays.includes(day);
      return {
        ...prev,
        bookmarkedDays: isBookmarked
          ? prev.bookmarkedDays.filter(d => d !== day)
          : [...prev.bookmarkedDays, day]
      };
    });
  };

  const toggleTask = (day: number, taskKey: 'dsa' | 'sql' | 'backendCloud' | 'aiMl' | 'cs' | 'handsOn' | 'questions' | 'deliverable') => {
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

      const updatedDayTasks = {
        ...currentDayTasks,
        [taskKey]: !currentDayTasks[taskKey]
      };

      // Auto mark completed if all 8 tasks checked
      const allDone = Object.values(updatedDayTasks).every(Boolean);
      let completedDays = prev.completedDays;
      if (allDone && !completedDays.includes(day)) {
        completedDays = [...completedDays, day].sort((a, b) => a - b);
      }

      return {
        ...prev,
        dayTasks: {
          ...prev.dayTasks,
          [day]: updatedDayTasks
        },
        completedDays
      };
    });
  };

  const toggleProblemSolved = (problemTitle: string) => {
    setProgress(prev => ({
      ...prev,
      solvedProblems: {
        ...prev.solvedProblems,
        [problemTitle]: !prev.solvedProblems[problemTitle]
      }
    }));
  };

  const toggleQuestionMastered = (questionId: string) => {
    setProgress(prev => ({
      ...prev,
      masteredQuestions: {
        ...prev.masteredQuestions,
        [questionId]: !prev.masteredQuestions[questionId]
      }
    }));
  };

  const saveNote = (key: string, content: string) => {
    setProgress(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [key]: content
      }
    }));
  };

  const addStudyMinutes = (mins: number) => {
    setProgress(prev => ({
      ...prev,
      studyMinutes: prev.studyMinutes + mins
    }));
  };

  const toggleProjectTask = (projectId: string, taskId: string) => {
    setProgress(prev => {
      const projectTasks = prev.projectChecklist[projectId] || {};
      return {
        ...prev,
        projectChecklist: {
          ...prev.projectChecklist,
          [projectId]: {
            ...projectTasks,
            [taskId]: !projectTasks[taskId]
          }
        }
      };
    });
  };

  const resetAllProgress = () => {
    if (window.confirm('Are you sure you want to reset all preparation progress? This action cannot be undone.')) {
      setProgress(initialProgress);
      resetStoredProgress(settings.isDemoMode);
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
          const restored = importBackupJson(content);
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
    resetAllProgress,
    exportBackup,
    importBackup,
    setFullProgress
  };
}
