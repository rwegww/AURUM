-- AURUM full clean Supabase schema
-- Generated for the current runtime codebase.
-- This script keeps runtime tables/data, removes known legacy tables, and creates
-- the clean schema, functions, indexes, policies, grants, and system seeds.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- ---------------------------------------------------------------------------
-- Legacy table cleanup: not used by the current runtime code.
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS public.sys_ai_cache CASCADE;
DROP TABLE IF EXISTS public.sys_ai_knowledge CASCADE;
DROP TABLE IF EXISTS public.ai_cache CASCADE;
DROP TABLE IF EXISTS public.ai_knowledge_base CASCADE;

DROP TABLE IF EXISTS public.content_material_feedback CASCADE;
DROP TABLE IF EXISTS public.content_lesson_discussions CASCADE;
DROP TABLE IF EXISTS public.content_reaction_ingredients CASCADE;
DROP TABLE IF EXISTS public.content_balancing_questions CASCADE;
DROP TABLE IF EXISTS public.content_materials CASCADE;
DROP TABLE IF EXISTS public.content_reactions CASCADE;
DROP TABLE IF EXISTS public.content_chemicals CASCADE;
DROP TABLE IF EXISTS public.content_lessons CASCADE;
DROP TABLE IF EXISTS public.content_grade_levels CASCADE;

DROP TABLE IF EXISTS public.edu_submissions CASCADE;
DROP TABLE IF EXISTS public.edu_schedules CASCADE;
DROP TABLE IF EXISTS public.edu_posts CASCADE;
DROP TABLE IF EXISTS public.edu_class_members CASCADE;
DROP TABLE IF EXISTS public.edu_classes CASCADE;

DROP TABLE IF EXISTS public.sys_feedback CASCADE;
DROP TABLE IF EXISTS public.user_stats CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP TABLE IF EXISTS public.periodic_elements CASCADE;
DROP TABLE IF EXISTS public.reaction_ingredients CASCADE;
DROP TABLE IF EXISTS public.user_unlocked_lessons CASCADE;
DROP TABLE IF EXISTS public.user_unlocked_chemicals CASCADE;
DROP TABLE IF EXISTS public.user_devices CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;

DROP FUNCTION IF EXISTS public.match_ai_knowledge CASCADE;
DROP FUNCTION IF EXISTS public.set_user_devices_updated_at CASCADE;

-- ---------------------------------------------------------------------------
-- Core runtime tables.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id text PRIMARY KEY,
  username text NOT NULL UNIQUE,
  email text UNIQUE,
  password text,
  role text NOT NULL DEFAULT 'student',
  xp integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  avatar_seed text,
  arena_stats jsonb NOT NULL DEFAULT '{"total":0,"wins":0,"losses":0,"points":0}'::jsonb,
  arena_avatar jsonb NOT NULL DEFAULT '{"seed":"Chem Master","aura":"#a855f7"}'::jsonb,
  active_minutes integer NOT NULL DEFAULT 0,
  last_active_at timestamp with time zone NOT NULL DEFAULT now(),
  is_locked boolean NOT NULL DEFAULT false,
  streak_count integer NOT NULL DEFAULT 0,
  last_streak_at timestamp with time zone,
  today_online_minutes integer NOT NULL DEFAULT 0,
  today_lesson_completed boolean NOT NULL DEFAULT false,
  current_session_id text,
  linked_accounts jsonb NOT NULL DEFAULT '{}'::jsonb,
  study_plan jsonb NOT NULL DEFAULT '{"emailEnabled":false,"dailyLessonTarget":1,"completed":false}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT users_role_check CHECK (role IN ('student', 'teacher', 'admin'))
);

CREATE TABLE IF NOT EXISTS public.grade_levels (
  id integer PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id text PRIMARY KEY,
  class_id integer NOT NULL REFERENCES public.grade_levels(id) ON DELETE CASCADE,
  program_id text NOT NULL DEFAULT 'ketnoi',
  title text NOT NULL,
  chapter text,
  "order" integer,
  description text,
  theory_modules jsonb NOT NULL DEFAULT '[]'::jsonb,
  video_modules jsonb NOT NULL DEFAULT '[]'::jsonb,
  quizzes jsonb NOT NULL DEFAULT '[]'::jsonb,
  story_slides jsonb NOT NULL DEFAULT '[]'::jsonb,
  challenges jsonb NOT NULL DEFAULT '[]'::jsonb,
  game jsonb NOT NULL DEFAULT '{}'::jsonb,
  intro_video_url text,
  is_premium boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id text NOT NULL,
  progress_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  unlocked_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_type, item_id),
  CONSTRAINT user_progress_item_type_check CHECK (item_type IN ('lesson', 'chemical', 'achievement', 'balancing'))
);

CREATE TABLE IF NOT EXISTS public.feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES public.users(id) ON DELETE SET NULL,
  username text,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'suggestion',
  status text NOT NULL DEFAULT 'unread',
  image_url text,
  is_approved boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT feedback_type_check CHECK (type IN ('bug', 'suggestion', 'praise', 'other', 'teacher_registration')),
  CONSTRAINT feedback_status_check CHECK (status IN ('unread', 'resolved', 'rejected'))
);

-- ---------------------------------------------------------------------------
-- Learning, lab, arena, and classroom tables.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lab_chemicals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  formula text NOT NULL UNIQUE,
  name text NOT NULL,
  state text,
  color text,
  type text,
  is_starter boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT lab_chemicals_state_check CHECK (state IS NULL OR state IN ('solid', 'liquid', 'gas'))
);

CREATE TABLE IF NOT EXISTS public.lab_reactions (
  id text PRIMARY KEY,
  name text NOT NULL,
  type text,
  equation text NOT NULL,
  reactants jsonb NOT NULL,
  products jsonb NOT NULL,
  grade_level integer REFERENCES public.grade_levels(id) ON DELETE CASCADE,
  category text,
  conditions text,
  observation text,
  energy numeric,
  animation text,
  requires_heat boolean NOT NULL DEFAULT false,
  danger_level integer NOT NULL DEFAULT 0,
  safety_warning text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.balancing_questions (
  id bigserial PRIMARY KEY,
  reactants jsonb NOT NULL,
  products jsonb NOT NULL,
  answer jsonb NOT NULL,
  difficulty text,
  category text,
  grade_level integer DEFAULT 8 REFERENCES public.grade_levels(id),
  equation_string text,
  node_id integer NOT NULL,
  lesson_id text REFERENCES public.lessons(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT balancing_questions_difficulty_check CHECK (difficulty IS NULL OR difficulty IN ('easy', 'medium', 'hard'))
);

CREATE TABLE IF NOT EXISTS public.arena_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_level integer NOT NULL DEFAULT 8 REFERENCES public.grade_levels(id) ON DELETE CASCADE,
  difficulty text NOT NULL DEFAULT 'easy',
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_option_index integer NOT NULL,
  points integer NOT NULL DEFAULT 10,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT arena_questions_difficulty_check CHECK (difficulty IN ('easy', 'medium', 'hard', 'super', 'auto')),
  CONSTRAINT arena_questions_correct_index_check CHECK (correct_option_index >= 0 AND correct_option_index <= 3)
);

CREATE TABLE IF NOT EXISTS public.arena_rooms (
  id text PRIMARY KEY,
  name text NOT NULL,
  host_id text REFERENCES public.users(id) ON DELETE CASCADE,
  mode text NOT NULL DEFAULT 'solo',
  difficulty text NOT NULL DEFAULT 'auto',
  status text NOT NULL DEFAULT 'waiting',
  max_players integer NOT NULL DEFAULT 2,
  current_players integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT arena_rooms_status_check CHECK (status IN ('waiting', 'playing', 'finished'))
);

CREATE TABLE IF NOT EXISTS public.arena_match_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES public.users(id) ON DELETE CASCADE,
  room_id text,
  opponent_name text,
  result text,
  score integer NOT NULL DEFAULT 0,
  pts_change integer NOT NULL DEFAULT 0,
  played_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT arena_match_history_result_check CHECK (result IS NULL OR result IN ('win', 'lose', 'draw'))
);

CREATE TABLE IF NOT EXISTS public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade_level integer NOT NULL REFERENCES public.grade_levels(id) ON DELETE CASCADE,
  teacher_id text REFERENCES public.users(id) ON DELETE CASCADE,
  description text,
  code text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.class_members (
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (class_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.class_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
  author_id text REFERENCES public.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'announcement',
  content text NOT NULL,
  media_url text,
  deadline timestamp with time zone,
  target_student_id text REFERENCES public.users(id) ON DELETE CASCADE,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT class_posts_type_check CHECK (type IN ('announcement', 'assignment', 'video'))
);

CREATE TABLE IF NOT EXISTS public.class_assignment_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.class_posts(id) ON DELETE CASCADE,
  student_id text REFERENCES public.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'submitted',
  score numeric,
  feedback text,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT class_assignment_submissions_status_check CHECK (status IN ('submitted', 'graded')),
  CONSTRAINT class_assignment_submissions_post_student_unique UNIQUE (post_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.class_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES public.classes(id) ON DELETE CASCADE,
  title text NOT NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone,
  meet_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Materials, missions, discussions, notes, and activity history.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text,
  category text,
  view_count integer NOT NULL DEFAULT 0,
  download_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.material_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid REFERENCES public.materials(id) ON DELETE CASCADE,
  user_id text REFERENCES public.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  rating integer,
  reply_content text,
  reply_user_id text REFERENCES public.users(id) ON DELETE SET NULL,
  reply_created_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT material_feedback_rating_check CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5))
);

CREATE TABLE IF NOT EXISTS public.missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  action_type text NOT NULL,
  target_count integer NOT NULL DEFAULT 1,
  xp_reward integer NOT NULL DEFAULT 50,
  type text NOT NULL DEFAULT 'daily',
  icon text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT missions_type_check CHECK (type IN ('daily', 'achievement', 'story'))
);

CREATE TABLE IF NOT EXISTS public.user_missions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES public.users(id) ON DELETE CASCADE,
  mission_id uuid REFERENCES public.missions(id) ON DELETE CASCADE,
  current_count integer NOT NULL DEFAULT 0,
  is_completed boolean NOT NULL DEFAULT false,
  is_claimed boolean NOT NULL DEFAULT false,
  last_reset_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_missions_user_mission_unique UNIQUE (user_id, mission_id)
);

CREATE TABLE IF NOT EXISTS public.lesson_discussions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id text NOT NULL,
  user_id text REFERENCES public.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  parent_id uuid REFERENCES public.lesson_discussions(id) ON DELETE CASCADE,
  likes integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id text NOT NULL,
  content text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_notes_user_lesson_unique UNIQUE (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS public.user_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES public.users(id) ON DELETE CASCADE,
  action_type text,
  description text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Normalize existing databases toward the clean schema.
-- ---------------------------------------------------------------------------
ALTER TABLE IF EXISTS public.users
  DROP COLUMN IF EXISTS unlocked_lessons,
  DROP COLUMN IF EXISTS unlocked_chemicals,
  DROP COLUMN IF EXISTS balancing_progress,
  DROP COLUMN IF EXISTS last_streak_reset_at,
  DROP COLUMN IF EXISTS inventory;

ALTER TABLE IF EXISTS public.grade_levels
  DROP COLUMN IF EXISTS description;

ALTER TABLE IF EXISTS public.lab_reactions
  DROP COLUMN IF EXISTS lesson_id;

ALTER TABLE IF EXISTS public.materials
  DROP COLUMN IF EXISTS author_id;

ALTER TABLE IF EXISTS public.user_activities
  DROP COLUMN IF EXISTS type,
  DROP COLUMN IF EXISTS label,
  DROP COLUMN IF EXISTS icon,
  DROP COLUMN IF EXISTS link;

-- ---------------------------------------------------------------------------
-- Functions used by the runtime.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, username, email, role)
  VALUES (
    new.id::text,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_active_minutes(user_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.users
  SET active_minutes = COALESCE(active_minutes, 0) + 1,
      last_active_at = now(),
      updated_at = now()
  WHERE id = user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_likes(row_id uuid)
RETURNS public.lesson_discussions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_comment public.lesson_discussions;
BEGIN
  UPDATE public.lesson_discussions
  SET likes = COALESCE(likes, 0) + 1
  WHERE id = row_id
  RETURNING * INTO updated_comment;

  RETURN updated_comment;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_material_view(material_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_count integer;
BEGIN
  UPDATE public.materials
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = $1
  RETURNING view_count INTO next_count;

  RETURN COALESCE(next_count, 0);
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_mission_reward(p_user_id text, p_mission_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  reward integer;
  total_xp integer;
  next_level integer;
BEGIN
  WITH claimed AS (
    UPDATE public.user_missions um
    SET is_claimed = true,
        updated_at = now()
    FROM public.missions m
    WHERE um.user_id = p_user_id
      AND um.mission_id = p_mission_id
      AND um.mission_id = m.id
      AND um.is_completed = true
      AND COALESCE(um.is_claimed, false) = false
    RETURNING COALESCE(m.xp_reward, 0) AS xp_reward
  )
  SELECT xp_reward INTO reward FROM claimed;

  IF reward IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE public.users
  SET xp = COALESCE(xp, 0) + reward,
      level = floor(((COALESCE(xp, 0) + reward)::numeric) / 1000)::integer + 1,
      updated_at = now()
  WHERE id = p_user_id
  RETURNING xp, level INTO total_xp, next_level;

  RETURN jsonb_build_object('xpGained', reward, 'totalXP', total_xp, 'newLevel', next_level);
END;
$$;

CREATE OR REPLACE FUNCTION public.join_arena_room(p_room_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  joined_room jsonb;
BEGIN
  UPDATE public.arena_rooms
  SET current_players = COALESCE(current_players, 0) + 1
  WHERE id = p_room_id
    AND status = 'waiting'
    AND COALESCE(current_players, 0) < COALESCE(max_players, 2)
  RETURNING to_jsonb(public.arena_rooms.*) INTO joined_room;

  RETURN joined_room;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_user_streak(user_id_text text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record public.users;
BEGIN
  SELECT * INTO user_record FROM public.users WHERE id = user_id_text;

  IF user_record.id IS NULL THEN
    RETURN NULL;
  END IF;

  IF user_record.updated_at::date < now()::date THEN
    UPDATE public.users
    SET today_online_minutes = 0,
        today_lesson_completed = false,
        updated_at = now()
    WHERE id = user_id_text
    RETURNING * INTO user_record;
  END IF;

  RETURN jsonb_build_object(
    'streak_count', user_record.streak_count,
    'last_streak_at', user_record.last_streak_at,
    'today_online_minutes', user_record.today_online_minutes,
    'today_lesson_completed', user_record.today_lesson_completed
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- Indexes.
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_active_minutes ON public.users (active_minutes DESC);
CREATE INDEX IF NOT EXISTS idx_users_last_active_at ON public.users (last_active_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_lessons_class_order ON public.lessons (class_id, "order");
CREATE INDEX IF NOT EXISTS idx_lessons_program ON public.lessons (program_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_type ON public.user_progress (user_id, item_type);
CREATE INDEX IF NOT EXISTS idx_user_progress_item ON public.user_progress (item_type, item_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback (status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON public.feedback (type);
CREATE INDEX IF NOT EXISTS idx_lab_reactions_grade_level ON public.lab_reactions (grade_level);
CREATE INDEX IF NOT EXISTS idx_balancing_questions_grade_level ON public.balancing_questions (grade_level);
CREATE INDEX IF NOT EXISTS idx_arena_questions_grade_level ON public.arena_questions (grade_level);
CREATE INDEX IF NOT EXISTS idx_arena_rooms_host_id ON public.arena_rooms (host_id);
CREATE INDEX IF NOT EXISTS idx_arena_match_history_user_id ON public.arena_match_history (user_id);
CREATE INDEX IF NOT EXISTS idx_arena_match_history_room_id ON public.arena_match_history (room_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON public.classes (teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_grade_level ON public.classes (grade_level);
CREATE INDEX IF NOT EXISTS idx_class_members_student_id ON public.class_members (student_id);
CREATE INDEX IF NOT EXISTS idx_class_posts_class_id ON public.class_posts (class_id);
CREATE INDEX IF NOT EXISTS idx_class_posts_author_id ON public.class_posts (author_id);
CREATE INDEX IF NOT EXISTS idx_class_posts_target_student_id ON public.class_posts (target_student_id);
CREATE INDEX IF NOT EXISTS idx_class_assignment_submissions_post_id ON public.class_assignment_submissions (post_id);
CREATE INDEX IF NOT EXISTS idx_class_assignment_submissions_student_id ON public.class_assignment_submissions (student_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_class_id ON public.class_schedules (class_id);
CREATE INDEX IF NOT EXISTS idx_material_feedback_material_id ON public.material_feedback (material_id);
CREATE INDEX IF NOT EXISTS idx_material_feedback_user_id ON public.material_feedback (user_id);
CREATE INDEX IF NOT EXISTS idx_missions_action_type ON public.missions (action_type);
CREATE INDEX IF NOT EXISTS idx_user_missions_user_id ON public.user_missions (user_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_mission_id ON public.user_missions (mission_id);
CREATE INDEX IF NOT EXISTS idx_lesson_discussions_lesson ON public.lesson_discussions (lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_discussions_user_id ON public.lesson_discussions (user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_discussions_parent_id ON public.lesson_discussions (parent_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_lesson_id ON public.user_notes (lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_activities_user_created ON public.user_activities (user_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- RLS policies.
-- ---------------------------------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_chemicals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.balancing_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arena_match_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read grade levels" ON public.grade_levels;
CREATE POLICY "Public read grade levels" ON public.grade_levels FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read lessons" ON public.lessons;
CREATE POLICY "Public read lessons" ON public.lessons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read lab chemicals" ON public.lab_chemicals;
CREATE POLICY "Public read lab chemicals" ON public.lab_chemicals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read lab reactions" ON public.lab_reactions;
CREATE POLICY "Public read lab reactions" ON public.lab_reactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read balancing questions" ON public.balancing_questions;
CREATE POLICY "Public read balancing questions" ON public.balancing_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read arena questions" ON public.arena_questions;
CREATE POLICY "Public read arena questions" ON public.arena_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read materials" ON public.materials;
CREATE POLICY "Public read materials" ON public.materials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read missions" ON public.missions;
CREATE POLICY "Public read missions" ON public.missions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read lesson discussions" ON public.lesson_discussions;
CREATE POLICY "Public read lesson discussions" ON public.lesson_discussions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create own discussions" ON public.lesson_discussions;
CREATE POLICY "Authenticated users can create own discussions"
  ON public.lesson_discussions FOR INSERT
  WITH CHECK (user_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (id = (select auth.uid())::text)
  WITH CHECK (id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can read own progress" ON public.user_progress;
CREATE POLICY "Users can read own progress"
  ON public.user_progress FOR SELECT
  USING (user_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (user_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (user_id = (select auth.uid())::text)
  WITH CHECK (user_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can read own notes" ON public.user_notes;
CREATE POLICY "Users can read own notes" ON public.user_notes FOR SELECT USING (user_id = (select auth.uid())::text);
DROP POLICY IF EXISTS "Users can insert own notes" ON public.user_notes;
CREATE POLICY "Users can insert own notes" ON public.user_notes FOR INSERT WITH CHECK (user_id = (select auth.uid())::text);
DROP POLICY IF EXISTS "Users can update own notes" ON public.user_notes;
CREATE POLICY "Users can update own notes" ON public.user_notes FOR UPDATE USING (user_id = (select auth.uid())::text) WITH CHECK (user_id = (select auth.uid())::text);
DROP POLICY IF EXISTS "Users can delete own notes" ON public.user_notes;
CREATE POLICY "Users can delete own notes" ON public.user_notes FOR DELETE USING (user_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can read own missions" ON public.user_missions;
CREATE POLICY "Users can read own missions" ON public.user_missions FOR SELECT USING (user_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Public read waiting arena rooms" ON public.arena_rooms;
CREATE POLICY "Public read waiting arena rooms" ON public.arena_rooms FOR SELECT USING (status = 'waiting');
DROP POLICY IF EXISTS "Authenticated users create own arena rooms" ON public.arena_rooms;
CREATE POLICY "Authenticated users create own arena rooms" ON public.arena_rooms FOR INSERT WITH CHECK (host_id = (select auth.uid())::text);
DROP POLICY IF EXISTS "Arena hosts update own rooms" ON public.arena_rooms;
CREATE POLICY "Arena hosts update own rooms" ON public.arena_rooms FOR UPDATE USING (host_id = (select auth.uid())::text) WITH CHECK (host_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can view own match history" ON public.arena_match_history;
CREATE POLICY "Users can view own match history" ON public.arena_match_history FOR SELECT USING (user_id = (select auth.uid())::text);
DROP POLICY IF EXISTS "Users can insert own match history" ON public.arena_match_history;
CREATE POLICY "Users can insert own match history" ON public.arena_match_history FOR INSERT WITH CHECK (user_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Class members can read joined classes" ON public.classes;
CREATE POLICY "Class members can read joined classes"
  ON public.classes FOR SELECT
  USING (
    teacher_id = (select auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM public.class_members cm
      WHERE cm.class_id = classes.id AND cm.student_id = (select auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "Teachers can insert owned classes" ON public.classes;
CREATE POLICY "Teachers can insert owned classes" ON public.classes FOR INSERT WITH CHECK (teacher_id = (select auth.uid())::text);
DROP POLICY IF EXISTS "Teachers can update owned classes" ON public.classes;
CREATE POLICY "Teachers can update owned classes" ON public.classes FOR UPDATE USING (teacher_id = (select auth.uid())::text) WITH CHECK (teacher_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Students can read own class memberships" ON public.class_members;
CREATE POLICY "Students can read own class memberships" ON public.class_members FOR SELECT USING (student_id = (select auth.uid())::text);
DROP POLICY IF EXISTS "Students can join as themselves" ON public.class_members;
CREATE POLICY "Students can join as themselves" ON public.class_members FOR INSERT WITH CHECK (student_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Class members can read visible posts" ON public.class_posts;
CREATE POLICY "Class members can read visible posts"
  ON public.class_posts FOR SELECT
  USING (
    author_id = (select auth.uid())::text
    OR target_student_id = (select auth.uid())::text
    OR (
      target_student_id IS NULL
      AND EXISTS (
        SELECT 1 FROM public.class_members cm
        WHERE cm.class_id = class_posts.class_id AND cm.student_id = (select auth.uid())::text
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_posts.class_id AND c.teacher_id = (select auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "Teachers can insert posts for owned classes" ON public.class_posts;
CREATE POLICY "Teachers can insert posts for owned classes"
  ON public.class_posts FOR INSERT
  WITH CHECK (
    author_id = (select auth.uid())::text
    AND EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_posts.class_id AND c.teacher_id = (select auth.uid())::text)
  );

DROP POLICY IF EXISTS "Teachers can delete owned class posts" ON public.class_posts;
CREATE POLICY "Teachers can delete owned class posts"
  ON public.class_posts FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_posts.class_id AND c.teacher_id = (select auth.uid())::text));

DROP POLICY IF EXISTS "Students and teachers can read submissions" ON public.class_assignment_submissions;
CREATE POLICY "Students and teachers can read submissions"
  ON public.class_assignment_submissions FOR SELECT
  USING (
    student_id = (select auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM public.class_posts p
      JOIN public.classes c ON c.id = p.class_id
      WHERE p.id = class_assignment_submissions.post_id AND c.teacher_id = (select auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "Students can insert submitted own assignment" ON public.class_assignment_submissions;
CREATE POLICY "Students can insert submitted own assignment"
  ON public.class_assignment_submissions FOR INSERT
  WITH CHECK (
    student_id = (select auth.uid())::text
    AND status = 'submitted'
    AND score IS NULL
    AND EXISTS (
      SELECT 1
      FROM public.class_posts p
      JOIN public.class_members cm ON cm.class_id = p.class_id
      WHERE p.id = class_assignment_submissions.post_id
        AND p.type = 'assignment'
        AND cm.student_id = (select auth.uid())::text
        AND (p.target_student_id IS NULL OR p.target_student_id = (select auth.uid())::text)
    )
  );

DROP POLICY IF EXISTS "Teachers can update submissions for owned classes" ON public.class_assignment_submissions;
CREATE POLICY "Teachers can update submissions for owned classes"
  ON public.class_assignment_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.class_posts p
      JOIN public.classes c ON c.id = p.class_id
      WHERE p.id = class_assignment_submissions.post_id AND c.teacher_id = (select auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.class_posts p
      JOIN public.classes c ON c.id = p.class_id
      WHERE p.id = class_assignment_submissions.post_id AND c.teacher_id = (select auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "Class members can read schedules" ON public.class_schedules;
CREATE POLICY "Class members can read schedules"
  ON public.class_schedules FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_schedules.class_id AND c.teacher_id = (select auth.uid())::text)
    OR EXISTS (SELECT 1 FROM public.class_members cm WHERE cm.class_id = class_schedules.class_id AND cm.student_id = (select auth.uid())::text)
  );

DROP POLICY IF EXISTS "Teachers can insert schedules for owned classes" ON public.class_schedules;
CREATE POLICY "Teachers can insert schedules for owned classes"
  ON public.class_schedules FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.classes c WHERE c.id = class_schedules.class_id AND c.teacher_id = (select auth.uid())::text));

DROP POLICY IF EXISTS "Authenticated users can insert anonymous or own feedback" ON public.feedback;
CREATE POLICY "Authenticated users can insert anonymous or own feedback" ON public.feedback FOR INSERT WITH CHECK (user_id IS NULL OR user_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Authenticated users can insert material feedback" ON public.material_feedback;
CREATE POLICY "Authenticated users can insert material feedback" ON public.material_feedback FOR INSERT WITH CHECK (user_id IS NULL OR user_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can insert own activities" ON public.user_activities;
CREATE POLICY "Users can insert own activities" ON public.user_activities FOR INSERT WITH CHECK (user_id = (select auth.uid())::text);
DROP POLICY IF EXISTS "Users can view own activities" ON public.user_activities;
CREATE POLICY "Users can view own activities" ON public.user_activities FOR SELECT USING (user_id = (select auth.uid())::text);
DROP POLICY IF EXISTS "Users can delete own activities" ON public.user_activities;
CREATE POLICY "Users can delete own activities" ON public.user_activities FOR DELETE USING (user_id = (select auth.uid())::text);

-- Backend uses the service-role client for writes; authenticated users only get narrow direct grants.
REVOKE UPDATE ON TABLE public.users FROM anon, authenticated;
GRANT UPDATE (avatar_seed, study_plan) ON TABLE public.users TO authenticated;

REVOKE ALL ON FUNCTION public.increment_likes(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_material_view(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_mission_reward(text, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.join_arena_room(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_likes(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_material_view(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_mission_reward(text, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.join_arena_room(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_active_minutes(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.sync_user_streak(text) TO service_role;

-- ---------------------------------------------------------------------------
-- System seeds.
-- ---------------------------------------------------------------------------
INSERT INTO public.grade_levels (id, name)
VALUES
  (8, 'Khối 8'),
  (9, 'Khối 9'),
  (10, 'Khối 10'),
  (11, 'Khối 11'),
  (12, 'Khối 12')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.missions (title, description, action_type, target_count, xp_reward, type, icon)
SELECT title, description, action_type, target_count, xp_reward, type, icon
FROM (
  VALUES
    ('Nhà luyện kim tập sự', 'Thực hiện 3 phản ứng hóa học.', 'reaction', 3, 100, 'daily', '⚗️'),
    ('Bậc thầy cân bằng', 'Cân bằng chính xác 5 phương trình.', 'balancing', 5, 150, 'daily', '⚖️'),
    ('Chiến binh Đấu trường', 'Thắng 1 trận đấu Đấu trường.', 'arena_win', 1, 200, 'daily', '⚔️'),
    ('Thắp lửa hôm nay', 'Online đủ 10 phút hoặc hoàn thành 1 bài học để thắp chuỗi.', 'streak_light', 1, 50, 'daily', '🔥'),
    ('Giữ lửa (3 ngày)', 'Duy trì chuỗi học tập trong 3 ngày liên tiếp.', 'streak', 3, 300, 'achievement', '🕯️'),
    ('Kiên trì (7 ngày)', 'Duy trì chuỗi học tập trong 7 ngày liên tiếp.', 'streak', 7, 700, 'achievement', '🔥'),
    ('Bền bỉ (14 ngày)', 'Duy trì chuỗi học tập trong 14 ngày liên tiếp.', 'streak', 14, 1500, 'achievement', '☄️'),
    ('Đam mê (30 ngày)', 'Duy trì chuỗi học tập trong 30 ngày liên tiếp.', 'streak', 30, 4000, 'achievement', '☀️'),
    ('Bất diệt (90 ngày)', 'Duy trì chuỗi học tập trong 90 ngày liên tiếp.', 'streak', 90, 12000, 'achievement', '👑')
) AS seed(title, description, action_type, target_count, xp_reward, type, icon)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.missions m
  WHERE m.action_type = seed.action_type
    AND m.target_count = seed.target_count
    AND m.type = seed.type
);

NOTIFY pgrst, 'reload schema';

COMMIT;
