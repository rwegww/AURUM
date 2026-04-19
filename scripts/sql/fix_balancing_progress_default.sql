-- SQL Migration: Fix Balancing Progress Default
-- This script fixes the issue where new accounts automatically have the first lesson completed.

-- 1. Add the column if it doesn't exist and set the correct default value
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS balancing_progress JSONB DEFAULT '{"completedNodeIds": [], "completedCount": 0, "passedGrades": []}'::jsonb;

-- 2. Ensure the default is correct for future alterations
ALTER TABLE public.users 
ALTER COLUMN balancing_progress SET DEFAULT '{"completedNodeIds": [], "completedCount": 0, "passedGrades": []}'::jsonb;

-- 2. Update existing users who might be affected by the "6 questions" bug
-- Criteria: users with exactly 6 questions done, node 1 completed, and 0 XP (likely new accounts).
-- WARNING: This will reset progress for users who legitimately only finished the first lesson.
-- If you want to be safe, you can skip this step and only fix it for new users.
UPDATE public.users
SET balancing_progress = '{"completedNodeIds": [], "completedCount": 0, "passedGrades": []}'::jsonb
WHERE (balancing_progress->>'completedCount')::int = 6 
  AND (balancing_progress->'completedNodeIds') @> '[1]'::jsonb
  AND xp = 0;

-- 3. Update the handle_new_user trigger to explicitly initialize progress
-- This ensures that accounts created via Supabase Auth (OAuth/Email) are also initialized correctly.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, email, role, balancing_progress)
  VALUES (
    new.id::text,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    '{"completedNodeIds": [], "completedCount": 0, "passedGrades": []}'::jsonb
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Verify the column type (ensure it's JSONB)
-- If it's currently TEXT, you should convert it (Caution: data loss possible if not formatted correctly)
-- ALTER TABLE public.users ALTER COLUMN balancing_progress TYPE JSONB USING balancing_progress::jsonb;
