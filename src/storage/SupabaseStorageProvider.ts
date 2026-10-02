import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { UserProgress, AppSettings } from '../types';
import { initialProgress } from './progressStorage';

export class SupabaseStorageProvider {
  /**
   * Fetches user progress from Supabase across all normalized tables
   * and aggregates it into a single UserProgress object.
   * Supports both 'progress' and 'user_progress' tables gracefully.
   */
  static async fetchProgress(userId: string): Promise<UserProgress | null> {
    if (!isSupabaseConfigured() || !userId) {
      return null;
    }

    try {
      // 1. Fetch core progress row (try 'progress', fallback to 'user_progress')
      let progressRow: any = null;
      const { data: pData, error: pErr } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!pErr && pData) {
        progressRow = pData;
      } else {
        // Fallback to legacy or alternative user_progress table
        const { data: upData, error: upErr } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (!upErr && upData) {
          progressRow = upData;
        } else if (pErr && pErr.code !== 'PGRST205' && upErr && upErr.code !== 'PGRST205') {
          console.warn('Supabase fetch progress error:', pErr || upErr);
        }
      }

      // If no progress record exists yet in Supabase for this user, return null
      if (!progressRow) {
        return null;
      }

      // 2. Fetch daily tasks (8-pillar checklist)
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

      // 4. Fetch notes with timestamps for Last-Write-Wins conflict resolution
      const { data: noteRows } = await supabase
        .from('notes')
        .select('note_key, content, updated_at')
        .eq('user_id', userId);

      const notes: Record<string, string> = { ...initialProgress.notes };
      const notesTimestamps: Record<string, string> = {};
      if (noteRows && noteRows.length > 0) {
        for (const n of noteRows) {
          notes[n.note_key] = n.content;
          if (n.updated_at) {
            notesTimestamps[n.note_key] = n.updated_at;
          }
        }
      }

      // 5. Fetch project checklist / progress
      let projectRows: any = null;
      const { data: ppData, error: ppErr } = await supabase
        .from('project_progress')
        .select('project_id, tasks')
        .eq('user_id', userId);

      if (!ppErr && ppData) {
        projectRows = ppData;
      } else {
        const { data: pcData } = await supabase
          .from('project_checklist')
          .select('project_id, tasks')
          .eq('user_id', userId);
        projectRows = pcData;
      }

      const projectChecklist: Record<string, Record<string, boolean>> = {
        ...initialProgress.projectChecklist
      };
      if (projectRows && projectRows.length > 0) {
        for (const p of projectRows) {
          projectChecklist[p.project_id] = p.tasks || {};
        }
      }

      // 6. Fetch topic progress (DSA problem status)
      const solvedProblems: Record<string, boolean> = {
        ...(progressRow.solved_problems || {})
      };
      const { data: topicRows } = await supabase
        .from('topic_progress')
        .select('topic_key, solved')
        .eq('user_id', userId);

      if (topicRows && topicRows.length > 0) {
        for (const row of topicRows) {
          solvedProblems[row.topic_key] = Boolean(row.solved);
        }
      }

      // 7. Fetch interview progress (Mastered interview questions)
      const masteredQuestions: Record<string, boolean> = {
        ...(progressRow.mastered_questions || {})
      };
      const { data: interviewRows } = await supabase
        .from('interview_progress')
        .select('question_id, mastered')
        .eq('user_id', userId);

      if (interviewRows && interviewRows.length > 0) {
        for (const row of interviewRows) {
          masteredQuestions[row.question_id] = Boolean(row.mastered);
        }
      }

      // 8. Fetch revision items
      const revisionItems: Record<string, boolean> = {};
      const { data: revisionRows } = await supabase
        .from('revision_items')
        .select('day_number, revision_day, completed')
        .eq('user_id', userId);

      if (revisionRows && revisionRows.length > 0) {
        for (const row of revisionRows) {
          const revKey = `day-${row.day_number}-rev-${row.revision_day}`;
          revisionItems[revKey] = Boolean(row.completed);
        }
      }

      const mergedProgress: UserProgress = {
        completedDays: Array.isArray(progressRow.completed_days) ? progressRow.completed_days : [],
        inProgressDays: Array.isArray(progressRow.in_progress_days) && progressRow.in_progress_days.length > 0 
          ? progressRow.in_progress_days 
          : [1],
        bookmarkedDays,
        dayTasks,
        solvedProblems,
        masteredQuestions,
        revisionItems,
        currentStreak: progressRow.current_streak ?? 1,
        longestStreak: progressRow.longest_streak ?? 1,
        lastActiveDate: progressRow.last_active_date || new Date().toISOString().split('T')[0],
        studyMinutes: progressRow.study_minutes ?? 0,
        notes,
        notesTimestamps,
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
   * Seamlessly writes to 'progress' or 'user_progress', and updates
   * normalized daily_tasks, bookmarks, notes, topic_progress, revision_items,
   * and project_progress tables.
   */
  static async saveProgress(userId: string, progress: UserProgress): Promise<boolean> {
    if (!isSupabaseConfigured() || !userId) {
      return false;
    }

    try {
      const now = new Date().toISOString();

      const corePayload = {
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
      };

      // 1. Upsert progress table (or user_progress)
      let coreSaved = false;
      const { error: pErr } = await supabase
        .from('progress')
        .upsert(corePayload, { onConflict: 'user_id' });

      if (!pErr) {
        coreSaved = true;
      }

      // Also upsert user_progress if progress table failed or for backward compatibility
      const { error: upErr } = await supabase
        .from('user_progress')
        .upsert(corePayload, { onConflict: 'user_id' });

      if (!upErr) {
        coreSaved = true;
      }

      if (!coreSaved) {
        console.error('Failed to upsert core progress:', pErr || upErr);
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

      // 4. Upsert notes with timestamps for Last-Write-Wins conflict resolution
      const noteEntries = Object.entries(progress.notes || {});
      if (noteEntries.length > 0) {
        const notePayload = noteEntries.map(([noteKey, content]) => ({
          user_id: userId,
          note_key: noteKey,
          content: content || '',
          updated_at: progress.notesTimestamps?.[noteKey] || now
        }));

        await supabase
          .from('notes')
          .upsert(notePayload, { onConflict: 'user_id,note_key' });
      }

      // 5. Upsert project progress / checklist
      const projectEntries = Object.entries(progress.projectChecklist || {});
      if (projectEntries.length > 0) {
        const projectPayload = projectEntries.map(([projectId, tasks]) => ({
          user_id: userId,
          project_id: projectId,
          tasks: tasks || {},
          updated_at: now
        }));

        // Try project_progress first
        const { error: ppErr } = await supabase
          .from('project_progress')
          .upsert(projectPayload, { onConflict: 'user_id,project_id' });

        // If table doesn't exist, fallback to project_checklist
        if (ppErr) {
          await supabase
            .from('project_checklist')
            .upsert(projectPayload, { onConflict: 'user_id,project_id' });
        }
      }

      // 6. Upsert topic_progress (if table exists)
      const topicEntries = Object.entries(progress.solvedProblems || {});
      if (topicEntries.length > 0) {
        const topicPayload = topicEntries.map(([topicKey, solved]) => ({
          user_id: userId,
          topic_key: topicKey,
          category: 'DSA',
          solved: Boolean(solved),
          solved_at: solved ? now : null,
          updated_at: now
        }));

        try {
          await supabase
            .from('topic_progress')
            .upsert(topicPayload, { onConflict: 'user_id,topic_key' });
        } catch {
          // Table may not exist yet in schema before migration, safe to ignore
        }
      }

      // 7. Upsert interview_progress (if table exists)
      const questionEntries = Object.entries(progress.masteredQuestions || {});
      if (questionEntries.length > 0) {
        const interviewPayload = questionEntries.map(([qId, mastered]) => ({
          user_id: userId,
          question_id: qId,
          mastered: Boolean(mastered),
          mastered_at: mastered ? now : null,
          updated_at: now
        }));

        try {
          await supabase
            .from('interview_progress')
            .upsert(interviewPayload, { onConflict: 'user_id,question_id' });
        } catch {
          // Safe to ignore if table pending creation
        }
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
      let data: any = null;
      const { data: sData, error: sErr } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (!sErr && sData) {
        data = sData;
      } else {
        const { data: usData } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        data = usData;
      }

      if (!data) return null;

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
      const payload = {
        user_id: userId,
        theme: settings.theme,
        sound_enabled: settings.soundEnabled,
        auto_save_interval_ms: settings.autoSaveIntervalMs,
        updated_at: new Date().toISOString()
      };

      const { error: sErr } = await supabase
        .from('settings')
        .upsert(payload, { onConflict: 'user_id' });

      if (sErr) {
        const { error: usErr } = await supabase
          .from('user_settings')
          .upsert(payload, { onConflict: 'user_id' });
        return !usErr;
      }

      return true;
    } catch (err) {
      console.warn('Error saving settings to Supabase:', err);
      return false;
    }
  }
}
