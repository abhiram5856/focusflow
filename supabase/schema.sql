-- =========================================================================
-- FocusFlow 150-Day Preparation OS — Supabase Schema & Row-Level Security
-- =========================================================================
-- This script creates the normalized personal progress tables and enforces
-- strict Row Level Security (RLS) so users can only ever access their own data.
-- Paste this script into the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query).
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

-- 2. USER PROGRESS TABLE (Core metrics, streaks, completed days, solved problems)
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
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, day_number)
);

-- 5. NOTES TABLE (Per-day study scratchpad & general notes)
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  note_key TEXT NOT NULL,
  content TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, note_key)
);

-- 6. PROJECT CHECKLIST TABLE (Capstone milestone tasks)
CREATE TABLE IF NOT EXISTS public.project_checklist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id TEXT NOT NULL,
  tasks JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, project_id)
);

-- 7. USER SETTINGS TABLE (UI themes, sound, auto-save)
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  theme TEXT DEFAULT 'luna-blue',
  sound_enabled BOOLEAN DEFAULT TRUE,
  auto_save_interval_ms INTEGER DEFAULT 5000,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- INDEXES FOR LOW-LATENCY LOOKUPS
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_day ON public.daily_tasks(user_id, day_number);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_day ON public.bookmarks(user_id, day_number);
CREATE INDEX IF NOT EXISTS idx_notes_user_key ON public.notes(user_id, note_key);
CREATE INDEX IF NOT EXISTS idx_project_checklist_user_proj ON public.project_checklist(user_id, project_id);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Users can ONLY ever select, insert, update, or delete
-- rows where user_id = auth.uid(). Cross-user data leakage is strictly blocked.
-- =========================================================================

-- Enable RLS on every table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 2. User Progress Policies
CREATE POLICY "Users can view own progress" 
  ON public.user_progress FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
  ON public.user_progress FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
  ON public.user_progress FOR UPDATE 
  USING (auth.uid() = user_id);

-- 3. Daily Tasks Policies
CREATE POLICY "Users can view own daily tasks" 
  ON public.daily_tasks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily tasks" 
  ON public.daily_tasks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily tasks" 
  ON public.daily_tasks FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily tasks" 
  ON public.daily_tasks FOR DELETE 
  USING (auth.uid() = user_id);

-- 4. Bookmarks Policies
CREATE POLICY "Users can view own bookmarks" 
  ON public.bookmarks FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" 
  ON public.bookmarks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" 
  ON public.bookmarks FOR DELETE 
  USING (auth.uid() = user_id);

-- 5. Notes Policies
CREATE POLICY "Users can view own notes" 
  ON public.notes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" 
  ON public.notes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" 
  ON public.notes FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" 
  ON public.notes FOR DELETE 
  USING (auth.uid() = user_id);

-- 6. Project Checklist Policies
CREATE POLICY "Users can view own project checklist" 
  ON public.project_checklist FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own project checklist" 
  ON public.project_checklist FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own project checklist" 
  ON public.project_checklist FOR UPDATE 
  USING (auth.uid() = user_id);

-- 7. Settings Policies
CREATE POLICY "Users can view own settings" 
  ON public.user_settings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" 
  ON public.user_settings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" 
  ON public.user_settings FOR UPDATE 
  USING (auth.uid() = user_id);

-- =========================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
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

  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
