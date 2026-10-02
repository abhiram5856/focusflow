import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { UserProgress, AppSettings } from '../types';
import { initialProgress } from './progressStorage';

export class SupabaseStorageProvider {
  /**
   * Fetches user progress from Supabase across all normalized tables
   * and aggregates it into a single UserProgress object.
   */
  static async fetchProgress(userId: string): Promise<UserProgress | null> {
    if (!isSupabaseConfigured() || !userId) {
      return null;
    }

    try {
      // 1. Fetch core progress row
      const { data: progressRow, error: progressErr } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (progressErr) {
        console.warn('Supabase fetch user_progress error:', progressErr);
        return null;
      }

      // If no progress record exists yet in Supabase for this user, return null
      if (!progressRow) {
        return null;
      }

      // 2. Fetch daily tasks
      const { data: taskRows } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', userId);

      const dayTasks: UserProgress['dayTasks'] = {};
      if (taskRows && taskRows.length > 0) {
        for (const row of taskRows) {
          dayTasks[row.day_number] = {
            dsa: Boolean(row.dsa),
            sql: Boolean(row.sql),
            backendCloud: Boolean(row.backend_cloud),
            aiMl: Boolean(row.ai_ml),
            cs: Boolean(row.cs),
            handsOn: Boolean(row.hands_on),
            questions: Boolean(row.questions),
            deliverable: Boolean(row.deliverable)
          };
        }
      }

      // 3. Fetch bookmarks
      const { data: bookmarkRows } = await supabase
        .from('bookmarks')
        .select('day_number')
        .eq('user_id', userId);

      const bookmarkedDays: number[] = bookmarkRows 
        ? bookmarkRows.map((b: { day_number: number }) => b.day_number) 
        : [];

      // 4. Fetch notes
      const { data: noteRows } = await supabase
        .from('notes')
        .select('note_key, content')
        .eq('user_id', userId);

      const notes: Record<string, string> = { ...initialProgress.notes };
      if (noteRows && noteRows.length > 0) {
        for (const n of noteRows) {
          notes[n.note_key] = n.content;
        }
      }

      // 5. Fetch project checklist
      const { data: projectRows } = await supabase
        .from('project_checklist')
        .select('project_id, tasks')
        .eq('user_id', userId);

      const projectChecklist: Record<string, Record<string, boolean>> = {
        ...initialProgress.projectChecklist
      };
      if (projectRows && projectRows.length > 0) {
        for (const p of projectRows) {
          projectChecklist[p.project_id] = p.tasks || {};
        }
      }

      const mergedProgress: UserProgress = {
        completedDays: Array.isArray(progressRow.completed_days) ? progressRow.completed_days : [],
        inProgressDays: Array.isArray(progressRow.in_progress_days) && progressRow.in_progress_days.length > 0 
          ? progressRow.in_progress_days 
          : [1],
        bookmarkedDays,
        dayTasks,
        solvedProblems: progressRow.solved_problems || {},
        masteredQuestions: progressRow.mastered_questions || {},
        currentStreak: progressRow.current_streak ?? 1,
        longestStreak: progressRow.longest_streak ?? 1,
        lastActiveDate: progressRow.last_active_date || new Date().toISOString().split('T')[0],
        studyMinutes: progressRow.study_minutes ?? 0,
        notes,
        projectChecklist
      };

      return mergedProgress;
    } catch (err) {
      console.error('Error fetching progress from Supabase:', err);
      return null;
    }
  }

  /**
   * Saves UserProgress into normalized Supabase tables with RLS enforcement.
   */
  static async saveProgress(userId: string, progress: UserProgress): Promise<boolean> {
    if (!isSupabaseConfigured() || !userId) {
      return false;
    }

    try {
      const now = new Date().toISOString();

      // 1. Upsert user_progress core table
      const { error: coreErr } = await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: userId,
            completed_days: progress.completedDays || [],
            in_progress_days: progress.inProgressDays || [1],
            solved_problems: progress.solvedProblems || {},
            mastered_questions: progress.masteredQuestions || {},
            current_streak: progress.currentStreak || 1,
            longest_streak: progress.longestStreak || 1,
            last_active_date: progress.lastActiveDate || new Date().toISOString().split('T')[0],
            study_minutes: progress.studyMinutes || 0,
            updated_at: now
          },
          { onConflict: 'user_id' }
        );

      if (coreErr) {
        console.error('Failed to upsert user_progress:', coreErr);
        return false;
      }

      // 2. Upsert daily tasks in batches
      const dayTaskEntries = Object.entries(progress.dayTasks || {});
      if (dayTaskEntries.length > 0) {
        const taskPayload = dayTaskEntries.map(([dayStr, tasks]) => ({
          user_id: userId,
          day_number: parseInt(dayStr, 10),
          dsa: Boolean(tasks.dsa),
          sql: Boolean(tasks.sql),
          backend_cloud: Boolean(tasks.backendCloud),
          ai_ml: Boolean(tasks.aiMl),
          cs: Boolean(tasks.cs),
          hands_on: Boolean(tasks.handsOn),
          questions: Boolean(tasks.questions),
          deliverable: Boolean(tasks.deliverable),
          updated_at: now
        }));

        const { error: taskErr } = await supabase
          .from('daily_tasks')
          .upsert(taskPayload, { onConflict: 'user_id,day_number' });

        if (taskErr) {
          console.warn('Failed to upsert daily_tasks:', taskErr);
        }
      }

      // 3. Sync bookmarks
      if (progress.bookmarkedDays) {
        // Delete old bookmarks and re-insert current set for clean sync
        await supabase.from('bookmarks').delete().eq('user_id', userId);
        if (progress.bookmarkedDays.length > 0) {
          const bookmarkPayload = progress.bookmarkedDays.map(day => ({
            user_id: userId,
            day_number: day,
            created_at: now
          }));
          await supabase.from('bookmarks').insert(bookmarkPayload);
        }
      }

      // 4. Upsert notes
      const noteEntries = Object.entries(progress.notes || {});
      if (noteEntries.length > 0) {
        const notePayload = noteEntries.map(([noteKey, content]) => ({
          user_id: userId,
          note_key: noteKey,
          content: content || '',
          updated_at: now
        }));

        await supabase
          .from('notes')
          .upsert(notePayload, { onConflict: 'user_id,note_key' });
      }

      // 5. Upsert project checklist
      const projectEntries = Object.entries(progress.projectChecklist || {});
      if (projectEntries.length > 0) {
        const projectPayload = projectEntries.map(([projectId, tasks]) => ({
          user_id: userId,
          project_id: projectId,
          tasks: tasks || {},
          updated_at: now
        }));

        await supabase
          .from('project_checklist')
          .upsert(projectPayload, { onConflict: 'user_id,project_id' });
      }

      return true;
    } catch (err) {
      console.error('Error saving progress to Supabase:', err);
      return false;
    }
  }

  /**
   * Fetches user settings from Supabase.
   */
  static async fetchSettings(userId: string): Promise<Partial<AppSettings> | null> {
    if (!isSupabaseConfigured() || !userId) return null;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) return null;

      return {
        theme: data.theme || 'luna-blue',
        soundEnabled: data.sound_enabled ?? true,
        autoSaveIntervalMs: data.auto_save_interval_ms ?? 5000
      };
    } catch (err) {
      console.warn('Error fetching settings from Supabase:', err);
      return null;
    }
  }

  /**
   * Saves user settings to Supabase.
   */
  static async saveSettings(userId: string, settings: AppSettings): Promise<boolean> {
    if (!isSupabaseConfigured() || !userId) return false;

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert(
          {
            user_id: userId,
            theme: settings.theme,
            sound_enabled: settings.soundEnabled,
            auto_save_interval_ms: settings.autoSaveIntervalMs,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id' }
        );

      return !error;
    } catch (err) {
      console.warn('Error saving settings to Supabase:', err);
      return false;
    }
  }
}
