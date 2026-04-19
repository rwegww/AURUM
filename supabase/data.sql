-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.ai_cache (
  query_hash text NOT NULL,
  original_query text,
  response jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ai_cache_pkey PRIMARY KEY (query_hash)
);
CREATE TABLE public.ai_knowledge_base (
  id text NOT NULL,
  kind text NOT NULL,
  input text NOT NULL,
  output text NOT NULL,
  input_normalized text,
  category text,
  title text,
  difficulty text,
  source_id text,
  symbol text,
  compare_to text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ai_knowledge_base_pkey PRIMARY KEY (id)
);
CREATE TABLE public.arena_match_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text,
  room_id text,
  opponent_name text,
  result text CHECK (result = ANY (ARRAY['win'::text, 'lose'::text, 'draw'::text])),
  score integer DEFAULT 0,
  pts_change integer DEFAULT 0,
  played_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT arena_match_history_pkey PRIMARY KEY (id),
  CONSTRAINT arena_match_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.arena_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  grade_level integer NOT NULL DEFAULT 8,
  difficulty text DEFAULT 'easy'::text CHECK (difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text, 'super'::text, 'auto'::text])),
  question text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_option_index integer NOT NULL CHECK (correct_option_index >= 0 AND correct_option_index <= 3),
  points integer DEFAULT 10,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT arena_questions_pkey PRIMARY KEY (id),
  CONSTRAINT arena_questions_grade_level_fkey FOREIGN KEY (grade_level) REFERENCES public.grade_levels(id)
);
CREATE TABLE public.arena_rooms (
  id text NOT NULL,
  name text NOT NULL,
  host_id text,
  mode text DEFAULT 'solo'::text,
  difficulty text DEFAULT 'auto'::text,
  status text DEFAULT 'waiting'::text CHECK (status = ANY (ARRAY['waiting'::text, 'playing'::text, 'finished'::text])),
  max_players integer DEFAULT 2,
  current_players integer DEFAULT 1,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT arena_rooms_pkey PRIMARY KEY (id),
  CONSTRAINT arena_rooms_host_id_fkey FOREIGN KEY (host_id) REFERENCES public.users(id)
);
CREATE TABLE public.balancing_questions (
  id bigint NOT NULL DEFAULT nextval('balancing_questions_id_seq'::regclass),
  reactants jsonb NOT NULL,
  products jsonb NOT NULL,
  answer jsonb NOT NULL,
  difficulty text CHECK (difficulty = ANY (ARRAY['easy'::text, 'medium'::text, 'hard'::text])),
  category text,
  grade_level integer DEFAULT 8,
  equation_string text,
  node_id integer NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  lesson_id text,
  CONSTRAINT balancing_questions_pkey PRIMARY KEY (id),
  CONSTRAINT balancing_questions_grade_level_fkey FOREIGN KEY (grade_level) REFERENCES public.grade_levels(id),
  CONSTRAINT balancing_questions_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);
CREATE TABLE public.class_assignment_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid,
  student_id text,
  status text DEFAULT 'submitted'::text CHECK (status = ANY (ARRAY['submitted'::text, 'graded'::text])),
  score numeric,
  feedback text,
  submitted_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  answers jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT class_assignment_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT class_assignment_submissions_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.class_posts(id),
  CONSTRAINT class_assignment_submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id)
);
CREATE TABLE public.class_members (
  class_id uuid NOT NULL,
  student_id text NOT NULL,
  joined_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT class_members_pkey PRIMARY KEY (class_id, student_id),
  CONSTRAINT class_members_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id),
  CONSTRAINT class_members_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id)
);
CREATE TABLE public.class_posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  class_id uuid,
  author_id text,
  type text DEFAULT 'announcement'::text CHECK (type = ANY (ARRAY['announcement'::text, 'assignment'::text, 'video'::text])),
  content text NOT NULL,
  media_url text,
  deadline timestamp with time zone,
  target_student_id text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  questions jsonb DEFAULT '[]'::jsonb,
  CONSTRAINT class_posts_pkey PRIMARY KEY (id),
  CONSTRAINT class_posts_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id),
  CONSTRAINT class_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id),
  CONSTRAINT class_posts_target_student_id_fkey FOREIGN KEY (target_student_id) REFERENCES public.users(id)
);
CREATE TABLE public.class_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  class_id uuid,
  title text NOT NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone,
  meet_url text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT class_schedules_pkey PRIMARY KEY (id),
  CONSTRAINT class_schedules_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.classes(id)
);
CREATE TABLE public.classes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade_level integer NOT NULL,
  teacher_id text,
  description text,
  code text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT classes_pkey PRIMARY KEY (id),
  CONSTRAINT classes_grade_level_fkey FOREIGN KEY (grade_level) REFERENCES public.grade_levels(id),
  CONSTRAINT classes_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id)
);
CREATE TABLE public.feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text,
  username text,
  message text NOT NULL,
  type text DEFAULT 'suggestion'::text CHECK (type = ANY (ARRAY['bug'::text, 'suggestion'::text, 'praise'::text, 'other'::text])),
  status text DEFAULT 'unread'::text CHECK (status = ANY (ARRAY['unread'::text, 'resolved'::text])),
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT feedback_pkey PRIMARY KEY (id),
  CONSTRAINT feedback_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.grade_levels (
  id integer NOT NULL,
  name text NOT NULL,
  description text,
  CONSTRAINT grade_levels_pkey PRIMARY KEY (id)
);
CREATE TABLE public.lab_chemicals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  formula text NOT NULL UNIQUE,
  name text NOT NULL,
  state text CHECK (state = ANY (ARRAY['solid'::text, 'liquid'::text, 'gas'::text])),
  color text,
  type text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  is_starter boolean DEFAULT false,
  CONSTRAINT lab_chemicals_pkey PRIMARY KEY (id)
);
CREATE TABLE public.lab_reactions (
  id text NOT NULL,
  name text NOT NULL,
  type text,
  equation text NOT NULL,
  reactants jsonb NOT NULL,
  products jsonb NOT NULL,
  grade_level integer,
  category text,
  conditions text,
  observation text,
  energy numeric,
  animation text,
  requires_heat boolean DEFAULT false,
  danger_level integer DEFAULT 0,
  safety_warning text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  lesson_id text,
  CONSTRAINT lab_reactions_pkey PRIMARY KEY (id),
  CONSTRAINT lab_reactions_grade_level_fkey FOREIGN KEY (grade_level) REFERENCES public.grade_levels(id),
  CONSTRAINT lab_reactions_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);
CREATE TABLE public.lesson_discussions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  lesson_id text NOT NULL,
  user_id text,
  content text NOT NULL,
  parent_id uuid,
  likes integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lesson_discussions_pkey PRIMARY KEY (id),
  CONSTRAINT lesson_discussions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT lesson_discussions_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.lesson_discussions(id)
);
CREATE TABLE public.lessons (
  id text NOT NULL,
  class_id integer NOT NULL,
  program_id text DEFAULT 'ketnoi'::text,
  title text NOT NULL,
  chapter text,
  order integer,
  description text,
  theory_modules jsonb DEFAULT '[]'::jsonb,
  video_modules jsonb DEFAULT '[]'::jsonb,
  quizzes jsonb DEFAULT '[]'::jsonb,
  story_slides jsonb DEFAULT '[]'::jsonb,
  challenges jsonb DEFAULT '[]'::jsonb,
  game jsonb DEFAULT '{}'::jsonb,
  is_premium boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT lessons_pkey PRIMARY KEY (id),
  CONSTRAINT lessons_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.grade_levels(id)
);
CREATE TABLE public.material_feedback (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  material_id uuid,
  user_id uuid,
  content text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT material_feedback_pkey PRIMARY KEY (id),
  CONSTRAINT material_feedback_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.materials(id)
);
CREATE TABLE public.materials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text,
  category text,
  author_id uuid,
  view_count integer DEFAULT 0,
  download_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT materials_pkey PRIMARY KEY (id)
);
CREATE TABLE public.missions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  action_type text NOT NULL,
  target_count integer NOT NULL DEFAULT 1,
  xp_reward integer DEFAULT 50,
  type text DEFAULT 'daily'::text CHECK (type = ANY (ARRAY['daily'::text, 'achievement'::text, 'story'::text])),
  icon text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT missions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reaction_ingredients (
  reaction_id text NOT NULL,
  chemical_id uuid NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['reactant'::text, 'product'::text, 'catalyst'::text])),
  coeff integer DEFAULT 1,
  CONSTRAINT reaction_ingredients_pkey PRIMARY KEY (reaction_id, chemical_id, role),
  CONSTRAINT reaction_ingredients_reaction_id_fkey FOREIGN KEY (reaction_id) REFERENCES public.lab_reactions(id),
  CONSTRAINT reaction_ingredients_chemical_id_fkey FOREIGN KEY (chemical_id) REFERENCES public.lab_chemicals(id)
);
CREATE TABLE public.user_missions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text,
  mission_id uuid,
  current_count integer DEFAULT 0,
  is_completed boolean DEFAULT false,
  is_claimed boolean DEFAULT false,
  last_reset_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_missions_pkey PRIMARY KEY (id),
  CONSTRAINT user_missions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_missions_mission_id_fkey FOREIGN KEY (mission_id) REFERENCES public.missions(id)
);
CREATE TABLE public.user_notes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id text,
  lesson_id text NOT NULL,
  content text NOT NULL,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_notes_pkey PRIMARY KEY (id),
  CONSTRAINT user_notes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_unlocked_chemicals (
  user_id text NOT NULL,
  chemical_formula text NOT NULL,
  unlocked_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_unlocked_chemicals_pkey PRIMARY KEY (user_id, chemical_formula),
  CONSTRAINT user_unlocked_chemicals_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_unlocked_lessons (
  user_id text NOT NULL,
  lesson_id text NOT NULL,
  unlocked_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_unlocked_lessons_pkey PRIMARY KEY (user_id, lesson_id),
  CONSTRAINT user_unlocked_lessons_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id),
  CONSTRAINT user_unlocked_lessons_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES public.lessons(id)
);
CREATE TABLE public.users (
  id text NOT NULL,
  username text NOT NULL UNIQUE,
  email text UNIQUE,
  password text,
  role text DEFAULT 'student'::text CHECK (role = ANY (ARRAY['student'::text, 'teacher'::text, 'admin'::text])),
  xp integer DEFAULT 0,
  level integer DEFAULT 1,
  inventory jsonb DEFAULT '{"ingredients": [], "craftedItems": []}'::jsonb,
  unlocked_lessons ARRAY DEFAULT '{}'::text[],
  unlocked_chemicals ARRAY DEFAULT '{}'::text[],
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  arena_stats jsonb DEFAULT '{"wins": 0, "total": 0, "losses": 0, "points": 0}'::jsonb,
  arena_avatar jsonb DEFAULT '{"aura": "#a855f7", "seed": "Chem Master"}'::jsonb,
  avatar_seed text,
  active_minutes integer DEFAULT 0,
  last_active_at timestamp with time zone DEFAULT now(),
  is_locked boolean DEFAULT false,
  balancing_progress jsonb DEFAULT '{"passedGrades": [], "completedCount": 0, "completedNodeIds": []}'::jsonb,
  streak_count integer DEFAULT 0,
  last_streak_at timestamp with time zone,
  today_online_minutes integer DEFAULT 0,
  today_lesson_completed boolean DEFAULT false,
  last_streak_reset_at timestamp with time zone,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);