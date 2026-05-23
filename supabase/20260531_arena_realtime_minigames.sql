-- Arena realtime mini game schema.
-- Adds DB-backed mini game payloads and realtime match state.

ALTER TABLE public.arena_questions
  ALTER COLUMN correct_option_index DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS game_type text NOT NULL DEFAULT 'calculation',
  ADD COLUMN IF NOT EXISTS payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS answer jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS time_limit_seconds integer NOT NULL DEFAULT 45,
  ADD COLUMN IF NOT EXISTS explanation text,
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'arena_questions_game_type_check'
      AND conrelid = 'public.arena_questions'::regclass
  ) THEN
    ALTER TABLE public.arena_questions
      ADD CONSTRAINT arena_questions_game_type_check
      CHECK (game_type IN ('calculation', 'balancing', 'atom_match', 'electron_match'));
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'arena_questions_time_limit_check'
      AND conrelid = 'public.arena_questions'::regclass
  ) THEN
    ALTER TABLE public.arena_questions
      ADD CONSTRAINT arena_questions_time_limit_check
      CHECK (time_limit_seconds BETWEEN 10 AND 180);
  END IF;
END $$;

ALTER TABLE public.arena_rooms
  ADD COLUMN IF NOT EXISTS question_ids uuid[] NOT NULL DEFAULT ARRAY[]::uuid[],
  ADD COLUMN IF NOT EXISTS current_round_index integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS round_started_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS round_ends_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS started_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS finished_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS winner_user_id text REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_practice boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.arena_room_players (
  room_id text NOT NULL REFERENCES public.arena_rooms(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  username text NOT NULL,
  avatar_seed text,
  score integer NOT NULL DEFAULT 0,
  correct_count integer NOT NULL DEFAULT 0,
  answered_rounds integer[] NOT NULL DEFAULT ARRAY[]::integer[],
  status text NOT NULL DEFAULT 'joined',
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  last_seen_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (room_id, user_id),
  CONSTRAINT arena_room_players_status_check
    CHECK (status IN ('joined', 'ready', 'playing', 'finished', 'left'))
);

CREATE TABLE IF NOT EXISTS public.arena_round_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL REFERENCES public.arena_rooms(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES public.arena_questions(id) ON DELETE CASCADE,
  user_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  round_index integer NOT NULL,
  answer_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_correct boolean NOT NULL DEFAULT false,
  score_awarded integer NOT NULL DEFAULT 0,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (room_id, user_id, round_index)
);

CREATE INDEX IF NOT EXISTS idx_arena_questions_game_type
  ON public.arena_questions (game_type);
CREATE INDEX IF NOT EXISTS idx_arena_questions_active_difficulty
  ON public.arena_questions (is_active, difficulty);
CREATE INDEX IF NOT EXISTS idx_arena_room_players_user_id
  ON public.arena_room_players (user_id);
CREATE INDEX IF NOT EXISTS idx_arena_round_answers_room_round
  ON public.arena_round_answers (room_id, round_index);

ALTER TABLE public.arena_room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_round_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read arena questions" ON public.arena_questions;
DROP POLICY IF EXISTS "Allow public read access on arena questions" ON public.arena_questions;

DROP POLICY IF EXISTS "Public read waiting arena rooms" ON public.arena_rooms;
CREATE POLICY "Public read waiting arena rooms"
  ON public.arena_rooms FOR SELECT
  USING (status = 'waiting' AND is_practice = false);

DROP POLICY IF EXISTS "Arena participants read rooms" ON public.arena_rooms;
CREATE POLICY "Arena participants read rooms"
  ON public.arena_rooms FOR SELECT
  TO authenticated
  USING (
    host_id = (select auth.uid())::text
    OR EXISTS (
      SELECT 1
      FROM public.arena_room_players p
      WHERE p.room_id = arena_rooms.id
        AND p.user_id = (select auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "Authenticated users read arena room players" ON public.arena_room_players;
CREATE POLICY "Authenticated users read arena room players"
  ON public.arena_room_players FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users read own arena answers" ON public.arena_round_answers;
CREATE POLICY "Users read own arena answers"
  ON public.arena_round_answers FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid())::text);

ALTER TABLE public.arena_rooms REPLICA IDENTITY FULL;
ALTER TABLE public.arena_room_players REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    EXECUTE 'CREATE PUBLICATION supabase_realtime';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'arena_rooms'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_rooms';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'arena_room_players'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.arena_room_players';
  END IF;
END $$;
