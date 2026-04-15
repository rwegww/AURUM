-- SQL Migration: Add Activity Tracking to Users Table
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Add columns for tracking activity
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS active_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT FALSE;

-- 2. Create a function to safely increment active minutes
-- This prevents race conditions and handles the update in a single transaction
CREATE OR REPLACE FUNCTION increment_active_minutes(user_id TEXT)
RETURNS void AS $$
BEGIN
  UPDATE public.users
  SET 
    active_minutes = COALESCE(active_minutes, 0) + 1,
    last_active_at = NOW()
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. (Optional) Index for leaderboard performance
CREATE INDEX IF NOT EXISTS idx_users_active_minutes ON public.users(active_minutes DESC);
