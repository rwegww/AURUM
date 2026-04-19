-- SQL Migration: Add Daily Streak System
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_streak_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS today_online_minutes INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS today_lesson_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_streak_reset_at TIMESTAMPTZ;

-- Function to reset daily counters
-- This can be called by a cron job or manually when a user logs in for the first time in a new day.
CREATE OR REPLACE FUNCTION public.sync_user_streak(user_id_text TEXT)
RETURNS JSONB AS $$
DECLARE
    user_record RECORD;
    now_ts TIMESTAMPTZ := NOW();
    yesterday_ts TIMESTAMPTZ := NOW() - INTERVAL '1 day';
    two_days_ago_ts TIMESTAMPTZ := NOW() - INTERVAL '2 days';
    is_streak_maintained BOOLEAN := FALSE;
    new_streak INTEGER;
    recovery_cost INTEGER;
BEGIN
    SELECT * INTO user_record FROM public.users WHERE id = user_id_text;
    
    -- 1. Reset daily counters if it's a new day (UTC based)
    IF user_record.updated_at::date < now_ts::date THEN
        UPDATE public.users 
        SET today_online_minutes = 0, 
            today_lesson_completed = FALSE,
            updated_at = now_ts
        WHERE id = user_id_text;
    END IF;

    -- 2. Check if streak is broken (more than 48 hours since last streak)
    IF user_record.last_streak_at IS NOT NULL AND user_record.last_streak_at < two_days_ago_ts THEN
        -- Streak is broken, but we don't reset to 0 yet to allow recovery
        -- Or we can set it to -1 to flag "Needs Recovery"
    END IF;

    RETURN jsonb_build_object(
        'streak_count', user_record.streak_count,
        'last_streak_at', user_record.last_streak_at,
        'today_online_minutes', user_record.today_online_minutes,
        'today_lesson_completed', user_record.today_lesson_completed
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
