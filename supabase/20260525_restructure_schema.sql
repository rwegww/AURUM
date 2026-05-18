-- AURUM schema restructure.
-- Requires invalid lessons.theory_modules text rows to be repaired before this runs.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.lessons') IS NULL AND to_regclass('public.lesson') IS NOT NULL THEN
    ALTER TABLE public.lesson RENAME TO lessons;
  END IF;

  IF to_regclass('public.lessons') IS NULL THEN
    RAISE EXCEPTION 'Expected public.lessons or public.lesson to exist.';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'lessons'
      AND column_name = 'theory_modules'
      AND data_type = 'text'
  ) THEN
    ALTER TABLE public.lessons
      ALTER COLUMN theory_modules DROP DEFAULT,
      ALTER COLUMN theory_modules TYPE jsonb
        USING COALESCE(NULLIF(theory_modules, '')::jsonb, '[]'::jsonb),
      ALTER COLUMN theory_modules SET DEFAULT '[]'::jsonb;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('lesson', 'chemical', 'achievement', 'balancing')),
  item_id text NOT NULL,
  progress_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  unlocked_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT user_progress_pkey PRIMARY KEY (user_id, item_type, item_id)
);

DO $$
BEGIN
  IF to_regclass('public.user_unlocked_lessons') IS NOT NULL THEN
    EXECUTE $sql$
      INSERT INTO public.user_progress (user_id, item_type, item_id, progress_data, unlocked_at, updated_at)
      SELECT user_id, 'lesson', lesson_id, '{}'::jsonb, COALESCE(unlocked_at, now()), COALESCE(unlocked_at, now())
      FROM public.user_unlocked_lessons
      ON CONFLICT (user_id, item_type, item_id) DO UPDATE
      SET unlocked_at = LEAST(public.user_progress.unlocked_at, EXCLUDED.unlocked_at),
          updated_at = GREATEST(public.user_progress.updated_at, EXCLUDED.updated_at)
    $sql$;
  END IF;

  IF to_regclass('public.user_unlocked_chemicals') IS NOT NULL THEN
    EXECUTE $sql$
      INSERT INTO public.user_progress (user_id, item_type, item_id, progress_data, unlocked_at, updated_at)
      SELECT user_id, 'chemical', chemical_formula, '{}'::jsonb, COALESCE(unlocked_at, now()), COALESCE(unlocked_at, now())
      FROM public.user_unlocked_chemicals
      ON CONFLICT (user_id, item_type, item_id) DO UPDATE
      SET unlocked_at = LEAST(public.user_progress.unlocked_at, EXCLUDED.unlocked_at),
          updated_at = GREATEST(public.user_progress.updated_at, EXCLUDED.updated_at)
    $sql$;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'balancing_progress'
  ) THEN
    EXECUTE $sql$
      INSERT INTO public.user_progress (user_id, item_type, item_id, progress_data, unlocked_at, updated_at)
      SELECT id,
             'balancing',
             'current',
             COALESCE(balancing_progress, '{"completedNodeIds":[],"completedCount":0,"passedGrades":[],"lessonStars":{}}'::jsonb),
             COALESCE(created_at, now()),
             COALESCE(updated_at, now())
      FROM public.users
      WHERE balancing_progress IS NOT NULL
      ON CONFLICT (user_id, item_type, item_id) DO UPDATE
      SET progress_data = EXCLUDED.progress_data,
          updated_at = EXCLUDED.updated_at
    $sql$;
  END IF;
END $$;

ALTER TABLE IF EXISTS public.feedback
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

UPDATE public.feedback
SET metadata = '{}'::jsonb
WHERE metadata IS NULL;

ALTER TABLE IF EXISTS public.feedback
  ALTER COLUMN metadata SET NOT NULL;

DO $$
BEGIN
  IF to_regclass('public.feedback') IS NOT NULL THEN
    ALTER TABLE public.feedback DROP CONSTRAINT IF EXISTS feedback_type_check;
    ALTER TABLE public.feedback
      ADD CONSTRAINT feedback_type_check
      CHECK (type IN ('bug', 'suggestion', 'praise', 'other', 'teacher_registration'));

    ALTER TABLE public.feedback DROP CONSTRAINT IF EXISTS feedback_status_check;
    ALTER TABLE public.feedback
      ADD CONSTRAINT feedback_status_check
      CHECK (status IN ('unread', 'resolved', 'rejected'));
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.testimonials') IS NOT NULL THEN
    EXECUTE $sql$
      INSERT INTO public.feedback (id, username, message, type, status, is_approved, created_at, metadata)
      SELECT id,
             name,
             COALESCE(content_vi, content_en),
             'praise',
             'resolved',
             true,
             COALESCE(created_at, now()),
             jsonb_build_object(
               'source_table', 'testimonials',
               'role_vi', role_vi,
               'role_en', role_en,
               'content_vi', content_vi,
               'content_en', content_en,
               'rating', rating
             )
      FROM public.testimonials
      ON CONFLICT (id) DO UPDATE
      SET username = EXCLUDED.username,
          message = EXCLUDED.message,
          type = EXCLUDED.type,
          status = EXCLUDED.status,
          is_approved = EXCLUDED.is_approved,
          metadata = EXCLUDED.metadata
    $sql$;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'material_feedback'
      AND column_name = 'user_id'
      AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.material_feedback
      ALTER COLUMN user_id TYPE text USING user_id::text;
  END IF;
END $$;

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

GRANT EXECUTE ON FUNCTION public.increment_likes(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.increment_material_view(uuid) TO anon, authenticated, service_role;

DROP TABLE IF EXISTS public.user_unlocked_lessons CASCADE;
DROP TABLE IF EXISTS public.user_unlocked_chemicals CASCADE;
DROP TABLE IF EXISTS public.user_devices CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;

ALTER TABLE IF EXISTS public.users
  DROP COLUMN IF EXISTS balancing_progress,
  DROP COLUMN IF EXISTS last_streak_reset_at;

ALTER TABLE IF EXISTS public.grade_levels
  DROP COLUMN IF EXISTS description;

ALTER TABLE IF EXISTS public.lab_reactions
  DROP COLUMN IF EXISTS lesson_id;

ALTER TABLE IF EXISTS public.materials
  DROP COLUMN IF EXISTS author_id;

CREATE INDEX IF NOT EXISTS idx_user_progress_user_type
  ON public.user_progress (user_id, item_type);

CREATE INDEX IF NOT EXISTS idx_user_progress_item
  ON public.user_progress (item_type, item_id);

NOTIFY pgrst, 'reload schema';

COMMIT;
