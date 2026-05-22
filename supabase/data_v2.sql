-- ==========================================
-- AURUM DATABASE SCHEMA V2 (RESTRUCTURED)
-- ==========================================

-- 1. MODULE: PROFILES & IDENTITY
CREATE TABLE public.profiles (
  id text NOT NULL, -- UUID from auth.users
  username text NOT NULL UNIQUE,
  email text UNIQUE,
  role text DEFAULT 'student'::text CHECK (role = ANY (ARRAY['student'::text, 'teacher'::text, 'admin'::text])),
  avatar_seed text,
  is_locked boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id)
);

-- 2. MODULE: USER STATS (GAMIFICATION)
CREATE TABLE public.user_stats (
  user_id text PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  streak_count integer DEFAULT 0,
  last_streak_at timestamp with time zone,
  active_minutes_total integer DEFAULT 0,
  arena_points integer DEFAULT 0,
  arena_wins integer DEFAULT 0,
  arena_losses integer DEFAULT 0,
  arena_total_matches integer DEFAULT 0,
  inventory jsonb DEFAULT '{"ingredients": [], "craftedItems": []}'::jsonb,
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. MODULE: USER PROGRESS (CONSOLIDATED)
CREATE TABLE public.user_progress (
  user_id text NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  item_type text NOT NULL, -- 'lesson', 'chemical', 'achievement', 'balancing'
  item_id text NOT NULL,
  progress_data jsonb DEFAULT '{}'::jsonb,
  unlocked_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_progress_pkey PRIMARY KEY (user_id, item_type, item_id)
);

-- 4. MODULE: CORE CONTENT
CREATE TABLE public.content_grade_levels (
  id integer PRIMARY KEY,
  name text NOT NULL,
  description text
);

CREATE TABLE public.content_lessons (
  id text PRIMARY KEY,
  grade_level integer REFERENCES public.content_grade_levels(id),
  title text NOT NULL,
  description text,
  theory_modules jsonb DEFAULT '[]'::jsonb,
  video_modules jsonb DEFAULT '[]'::jsonb,
  quizzes jsonb DEFAULT '[]'::jsonb,
  is_premium boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.content_chemicals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  formula text NOT NULL UNIQUE,
  name text NOT NULL,
  state text,
  color text,
  is_starter boolean DEFAULT false
);

CREATE TABLE public.content_reactions (
  id text PRIMARY KEY,
  name text NOT NULL,
  equation text NOT NULL,
  reactants jsonb NOT NULL,
  products jsonb NOT NULL,
  conditions text,
  observation text,
  safety_warning text,
  lesson_id text REFERENCES public.content_lessons(id)
);

CREATE TABLE public.content_reaction_ingredients (
  reaction_id text REFERENCES public.content_reactions(id) ON DELETE CASCADE,
  chemical_id uuid REFERENCES public.content_chemicals(id) ON DELETE CASCADE,
  role text CHECK (role = ANY (ARRAY['reactant'::text, 'product'::text, 'catalyst'::text])),
  coeff integer DEFAULT 1,
  PRIMARY KEY (reaction_id, chemical_id, role)
);

-- 5. MODULE: ARENA (EXTENDED)
CREATE TABLE public.arena_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  grade_level integer REFERENCES public.content_grade_levels(id),
  difficulty text DEFAULT 'easy'::text CHECK (difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text, 'super'::text, 'auto'::text])),
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_option_index integer NOT NULL,
  points integer DEFAULT 10,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.arena_rooms (
  id text PRIMARY KEY,
  name text NOT NULL,
  host_id text REFERENCES public.profiles(id),
  mode text DEFAULT 'solo'::text,
  difficulty text DEFAULT 'auto'::text,
  status text DEFAULT 'waiting'::text CHECK (status = ANY (ARRAY['waiting'::text, 'playing'::text, 'finished'::text])),
  max_players integer DEFAULT 2,
  current_players integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.arena_match_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES public.profiles(id),
  room_id text,
  opponent_name text,
  result text CHECK (result = ANY (ARRAY['win'::text, 'lose'::text, 'draw'::text])),
  score integer DEFAULT 0,
  pts_change integer DEFAULT 0,
  played_at timestamp with time zone DEFAULT now()
);

-- 6. MODULE: CLASSROOM (EDU)
CREATE TABLE public.edu_classes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  grade_level integer REFERENCES public.content_grade_levels(id),
  teacher_id text REFERENCES public.profiles(id),
  description text,
  code text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.edu_class_members (
  class_id uuid REFERENCES public.edu_classes(id) ON DELETE CASCADE,
  student_id text REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (class_id, student_id)
);

CREATE TABLE public.edu_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id uuid REFERENCES public.edu_classes(id),
  author_id text REFERENCES public.profiles(id),
  type text DEFAULT 'announcement'::text CHECK (type = ANY (ARRAY['announcement'::text, 'assignment'::text, 'video'::text])),
  content text NOT NULL,
  media_url text,
  deadline timestamp with time zone,
  questions jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.edu_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES public.edu_posts(id),
  student_id text REFERENCES public.profiles(id),
  status text DEFAULT 'submitted'::text,
  score numeric,
  feedback text,
  answers jsonb DEFAULT '[]'::jsonb,
  submitted_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.edu_schedules (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id uuid REFERENCES public.edu_classes(id),
  title text NOT NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone,
  meet_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- 7. MODULE: MISSIONS & PROGRESS
CREATE TABLE public.sys_missions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  action_type text NOT NULL,
  target_count integer DEFAULT 1,
  xp_reward integer DEFAULT 50,
  type text DEFAULT 'daily'::text,
  icon text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.user_missions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES public.profiles(id),
  mission_id uuid REFERENCES public.sys_missions(id),
  current_count integer DEFAULT 0,
  is_completed boolean DEFAULT false,
  is_claimed boolean DEFAULT false,
  last_reset_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 8. MODULE: ADDITIONAL LEARNING TOOLS
CREATE TABLE public.content_materials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text,
  category text,
  author_id text REFERENCES public.profiles(id),
  view_count integer DEFAULT 0,
  download_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.content_material_feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id uuid REFERENCES public.content_materials(id) ON DELETE CASCADE,
  user_id text REFERENCES public.profiles(id),
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.content_lesson_discussions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id text REFERENCES public.content_lessons(id),
  user_id text REFERENCES public.profiles(id),
  content text NOT NULL,
  parent_id uuid REFERENCES public.content_lesson_discussions(id),
  likes integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.user_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES public.profiles(id),
  lesson_id text REFERENCES public.content_lessons(id),
  content text NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.content_balancing_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  equation_string text NOT NULL,
  reactants jsonb NOT NULL,
  products jsonb NOT NULL,
  answer jsonb NOT NULL,
  difficulty text,
  grade_level integer REFERENCES public.content_grade_levels(id),
  lesson_id text REFERENCES public.content_lessons(id),
  created_at timestamp with time zone DEFAULT now()
);



CREATE TABLE public.sys_feedback (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES public.profiles(id),
  message text NOT NULL,
  type text DEFAULT 'suggestion'::text,
  status text DEFAULT 'unread'::text,
  image_url text,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.user_activities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text REFERENCES public.profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  label text NOT NULL,
  description text,
  icon text,
  link text,
  created_at timestamp with time zone DEFAULT now()
);
