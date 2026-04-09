-- =========================================================
-- ARENA PATCH: Run this in Supabase SQL Editor
-- =========================================================

-- 1. Add arena_stats column to users (wins, losses, total, points)
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS arena_stats JSONB DEFAULT '{"total":0,"wins":0,"losses":0,"points":0}';

-- 2. Add arena_avatar column to users (persisted avatar seed + aura)
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS arena_avatar JSONB DEFAULT '{"seed":"Chem Master","aura":"#a855f7"}';

-- 3. Match history table
CREATE TABLE IF NOT EXISTS arena_match_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    room_id TEXT,
    opponent_name TEXT,
    result TEXT CHECK (result IN ('win', 'lose', 'draw')),
    score INTEGER DEFAULT 0,
    pts_change INTEGER DEFAULT 0,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE arena_match_history ENABLE ROW LEVEL SECURITY;

-- Policies: users can see/insert their own match history
DROP POLICY IF EXISTS "Users can view own match history" ON arena_match_history;
CREATE POLICY "Users can view own match history" ON arena_match_history
  FOR SELECT USING (auth.uid()::text = user_id OR true); -- allow all for now (server-side auth)

DROP POLICY IF EXISTS "Allow insert match history" ON arena_match_history;
CREATE POLICY "Allow insert match history" ON arena_match_history
  FOR INSERT WITH CHECK (true);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_match_history_user_id ON arena_match_history(user_id);
CREATE INDEX IF NOT EXISTS idx_match_history_played_at ON arena_match_history(played_at DESC);
