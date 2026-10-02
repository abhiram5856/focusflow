-- =========================================================================
-- FocusFlow 150-Day Preparation OS — Supabase Schema & Row-Level Security
-- =========================================================================
-- This script creates the 10 core normalized personal progress tables and enforces
-- strict Row Level Security (RLS) so users can only ever access their own data.
-- Cross-device sync: Laptop 1, Laptop 2, and Phone.
--
-- Instructions: Paste this script into the Supabase SQL Editor
-- (Supabase Dashboard -> SQL Editor -> New Query -> Run).
-- =========================================================================

-- 1. PROFILES TABLE (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROGRESS TABLE (Core metrics, streaks, completed days, solved problems)
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  completed_days INTEGER[] DEFAULT '{}',
  in_progress_days INTEGER[] DEFAULT '{1}',
  solved_problems JSONB DEFAULT '{}'::jsonb,
  mastered_questions JSONB DEFAULT '{}'::jsonb,
  current_streak INTEGER DEFAULT 1,
  longest_streak INTEGER DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  study_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backwards-compatibility table user_progress
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  completed_days INTEGER[] DEFAULT '{}',
  in_progress_days INTEGER[] DEFAULT '{1}',
  solved_problems JSONB DEFAULT '{}'::jsonb,
  mastered_questions JSONB DEFAULT '{}'::jsonb,
  current_streak INTEGER DEFAULT 1,
  longest_streak INTEGER DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  study_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DAILY TASKS TABLE (Normalized 8-pillar checklist per day)
CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  dsa BOOLEAN DEFAULT FALSE,
  sql BOOLEAN DEFAULT FALSE,
  backend_cloud BOOLEAN DEFAULT FALSE,
  ai_ml BOOLEAN DEFAULT FALSE,
  cs BOOLEAN DEFAULT FALSE,
  hands_on BOOLEAN DEFAULT FALSE,
  questions BOOLEAN DEFAULT FALSE,
  deliverable BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, day_number)
);

-- 4. BOOKMARKS TABLE (Bookmarked curriculum days)
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, day_number)
);

-- 5. NOTES TABLE (Per-day study scratchpad & general notes with timestamps)
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  note_key TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, note_key)
);

-- 6. SETTINGS TABLE (UI themes, sound, auto-save)
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme TEXT DEFAULT 'luna-blue',
  sound_enabled BOOLEAN DEFAULT TRUE,
  auto_save_interval_ms INTEGER DEFAULT 5000,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backwards-compatibility table user_settings
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme TEXT DEFAULT 'luna-blue',
  sound_enabled BOOLEAN DEFAULT TRUE,
  auto_save_interval_ms INTEGER DEFAULT 5000,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TOPIC PROGRESS TABLE (Granular DSA & topic problem tracking)
CREATE TABLE IF NOT EXISTS public.topic_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  topic_key TEXT NOT NULL,
  category TEXT DEFAULT 'DSA',
  solved BOOLEAN DEFAULT FALSE,
  solved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, topic_key)
);

-- 8. REVISION ITEMS TABLE (Smart Spaced Repetition items & review dates)
CREATE TABLE IF NOT EXISTS public.revision_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  revision_day INTEGER NOT NULL,
  interval_days INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, day_number, revision_day)
);

-- 9. PROJECT PROGRESS TABLE (Capstone milestone tasks)
CREATE TABLE IF NOT EXISTS public.project_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id TEXT NOT NULL,
  tasks JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, project_id)
);

-- Backwards-compatibility table project_checklist
CREATE TABLE IF NOT EXISTS public.project_checklist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id TEXT NOT NULL,
  tasks JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, project_id)
);

-- 10. INTERVIEW PROGRESS TABLE (Interview questions mastered)
CREATE TABLE IF NOT EXISTS public.interview_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL,
  category TEXT,
  mastered BOOLEAN DEFAULT FALSE,
  mastered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, question_id)
);

-- =========================================================================
-- INDEXES FOR LOW-LATENCY USER-SCOPED LOOKUPS
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_day ON public.daily_tasks(user_id, day_number);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_day ON public.bookmarks(user_id, day_number);
CREATE INDEX IF NOT EXISTS idx_notes_user_key ON public.notes(user_id, note_key);
CREATE INDEX IF NOT EXISTS idx_settings_user ON public.settings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user ON public.user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_topic_progress_user_key ON public.topic_progress(user_id, topic_key);
CREATE INDEX IF NOT EXISTS idx_revision_items_user_day ON public.revision_items(user_id, day_number);
CREATE INDEX IF NOT EXISTS idx_project_progress_user_proj ON public.project_progress(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_project_checklist_user_proj ON public.project_checklist(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_interview_progress_user_q ON public.interview_progress(user_id, question_id);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Users can ONLY ever SELECT, INSERT, UPDATE, or DELETE
-- rows where user_id = auth.uid() (or id = auth.uid() for profiles).
-- Cross-user access is strictly blocked at the database engine level.
-- =========================================================================

-- Enable RLS on every table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_progress ENABLE ROW LEVEL SECURITY;

-- Helper to safely drop and recreate policies
DO $$
DECLARE
  tables text[] := ARRAY[
    'profiles', 'progress', 'user_progress', 'daily_tasks', 
    'bookmarks', 'notes', 'settings', 'user_settings', 
    'topic_progress', 'revision_items', 'project_progress', 
    'project_checklist', 'interview_progress'
  ];
  t text;
  uid_col text;
BEGIN
  FOREACH t IN ARRAY tables LOOP
    uid_col := CASE WHEN t = 'profiles' THEN 'id' ELSE 'user_id' END;

    EXECUTE format('DROP POLICY IF EXISTS "Users can view own %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "Users can view own %I" ON public.%I FOR SELECT USING (auth.uid() = %I)', t, t, uid_col);

    EXECUTE format('DROP POLICY IF EXISTS "Users can insert own %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "Users can insert own %I" ON public.%I FOR INSERT WITH CHECK (auth.uid() = %I)', t, t, uid_col);

    EXECUTE format('DROP POLICY IF EXISTS "Users can update own %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "Users can update own %I" ON public.%I FOR UPDATE USING (auth.uid() = %I)', t, t, uid_col);

    EXECUTE format('DROP POLICY IF EXISTS "Users can delete own %I" ON public.%I', t, t);
    EXECUTE format('CREATE POLICY "Users can delete own %I" ON public.%I FOR DELETE USING (auth.uid() = %I)', t, t, uid_col);
  END LOOP;
END $$;

-- =========================================================================
-- AUTOMATIC PROFILE & PROGRESS INITIALIZATION ON SIGNUP
-- =========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
