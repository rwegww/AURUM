BEGIN;

-- Standardize business column names without copying or dropping table data.
-- Most operations use RENAME COLUMN so PostgreSQL preserves existing values,
-- indexes, constraints, and dependent policies where possible.

-- ---------------------------------------------------------------------------
-- Users/Auth
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE public.users RENAME COLUMN password TO password_hash;
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    UPDATE public.users SET password_hash = COALESCE(password_hash, password);
    ALTER TABLE public.users DROP COLUMN password;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Grade-level foreign keys
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'class_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'grade_level_id'
  ) THEN
    ALTER TABLE public.lessons RENAME COLUMN class_id TO grade_level_id;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'classes' AND column_name = 'grade_level'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'classes' AND column_name = 'grade_level_id'
  ) THEN
    ALTER TABLE public.classes RENAME COLUMN grade_level TO grade_level_id;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'lab_reactions' AND column_name = 'grade_level'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'lab_reactions' AND column_name = 'grade_level_id'
  ) THEN
    ALTER TABLE public.lab_reactions RENAME COLUMN grade_level TO grade_level_id;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'balancing_questions' AND column_name = 'grade_level'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'balancing_questions' AND column_name = 'grade_level_id'
  ) THEN
    ALTER TABLE public.balancing_questions RENAME COLUMN grade_level TO grade_level_id;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'arena_questions' AND column_name = 'grade_level'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'arena_questions' AND column_name = 'grade_level_id'
  ) THEN
    ALTER TABLE public.arena_questions RENAME COLUMN grade_level TO grade_level_id;
  END IF;
END $$;

-- Rename FK constraints when they exist; add the missing lessons FK as NOT VALID
-- because the live schema currently exposes no FK for lessons -> grade_levels.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_class_id_fkey') THEN
    ALTER TABLE public.lessons RENAME CONSTRAINT lessons_class_id_fkey TO lessons_grade_level_id_fkey;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lessons_grade_level_id_fkey')
     AND EXISTS (
       SELECT 1 FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = 'lessons' AND column_name = 'grade_level_id'
     ) THEN
    ALTER TABLE public.lessons
      ADD CONSTRAINT lessons_grade_level_id_fkey
      FOREIGN KEY (grade_level_id) REFERENCES public.grade_levels(id)
      ON DELETE CASCADE NOT VALID;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'classes_grade_level_fkey') THEN
    ALTER TABLE public.classes RENAME CONSTRAINT classes_grade_level_fkey TO classes_grade_level_id_fkey;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'lab_reactions_grade_level_fkey') THEN
    ALTER TABLE public.lab_reactions RENAME CONSTRAINT lab_reactions_grade_level_fkey TO lab_reactions_grade_level_id_fkey;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'balancing_questions_grade_level_fkey') THEN
    ALTER TABLE public.balancing_questions RENAME CONSTRAINT balancing_questions_grade_level_fkey TO balancing_questions_grade_level_id_fkey;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'arena_questions_grade_level_fkey') THEN
    ALTER TABLE public.arena_questions RENAME CONSTRAINT arena_questions_grade_level_fkey TO arena_questions_grade_level_id_fkey;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- User progress polymorphic target naming
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_progress' AND column_name = 'item_type'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_progress' AND column_name = 'progress_type'
  ) THEN
    ALTER TABLE public.user_progress RENAME COLUMN item_type TO progress_type;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_progress' AND column_name = 'item_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_progress' AND column_name = 'target_id'
  ) THEN
    ALTER TABLE public.user_progress RENAME COLUMN item_id TO target_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_progress' AND column_name = 'progress_data'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_progress' AND column_name = 'progress_payload'
  ) THEN
    ALTER TABLE public.user_progress RENAME COLUMN progress_data TO progress_payload;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_progress_item_type_check') THEN
    ALTER TABLE public.user_progress RENAME CONSTRAINT user_progress_item_type_check TO user_progress_progress_type_check;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Library, classroom, arena, and lab clarity
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'materials' AND column_name = 'created_by'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'materials' AND column_name = 'created_by_user_id'
  ) THEN
    ALTER TABLE public.materials RENAME COLUMN created_by TO created_by_user_id;
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'materials' AND column_name = 'created_by_user_id'
  ) THEN
    ALTER TABLE public.materials ADD COLUMN created_by_user_id text;
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'materials' AND column_name = 'created_by'
  ) THEN
    UPDATE public.materials
    SET created_by_user_id = COALESCE(created_by_user_id, created_by);
    ALTER TABLE public.materials DROP COLUMN created_by;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'materials_created_by_fkey') THEN
    ALTER TABLE public.materials RENAME CONSTRAINT materials_created_by_fkey TO materials_created_by_user_id_fkey;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'materials_created_by_user_id_fkey') THEN
    ALTER TABLE public.materials
      ADD CONSTRAINT materials_created_by_user_id_fkey
      FOREIGN KEY (created_by_user_id) REFERENCES public.users(id)
      ON DELETE SET NULL NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'class_assignment_submissions' AND column_name = 'feedback'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'class_assignment_submissions' AND column_name = 'teacher_feedback'
  ) THEN
    ALTER TABLE public.class_assignment_submissions RENAME COLUMN feedback TO teacher_feedback;
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'class_assignment_submissions' AND column_name = 'feedback'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'class_assignment_submissions' AND column_name = 'teacher_feedback'
  ) THEN
    UPDATE public.class_assignment_submissions
    SET teacher_feedback = COALESCE(teacher_feedback, feedback);
    ALTER TABLE public.class_assignment_submissions DROP COLUMN feedback;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'arena_match_history' AND column_name = 'pts_change'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'arena_match_history' AND column_name = 'points_delta'
  ) THEN
    ALTER TABLE public.arena_match_history RENAME COLUMN pts_change TO points_delta;
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'arena_match_history' AND column_name = 'pts_change'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'arena_match_history' AND column_name = 'points_delta'
  ) THEN
    UPDATE public.arena_match_history
    SET points_delta = COALESCE(points_delta, pts_change);
    ALTER TABLE public.arena_match_history DROP COLUMN pts_change;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'lab_chemicals' AND column_name = 'type'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'lab_chemicals' AND column_name = 'category'
  ) THEN
    ALTER TABLE public.lab_chemicals RENAME COLUMN type TO category;
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'lab_chemicals' AND column_name = 'type'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'lab_chemicals' AND column_name = 'category'
  ) THEN
    UPDATE public.lab_chemicals
    SET category = COALESCE(category, type);
    ALTER TABLE public.lab_chemicals DROP COLUMN type;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Index names aligned with renamed columns.
-- ---------------------------------------------------------------------------
DROP INDEX IF EXISTS public.idx_lessons_class_order;
CREATE INDEX IF NOT EXISTS idx_lessons_grade_level_order
  ON public.lessons (grade_level_id, "order");

DROP INDEX IF EXISTS public.idx_lab_reactions_grade_level;
CREATE INDEX IF NOT EXISTS idx_lab_reactions_grade_level_id
  ON public.lab_reactions (grade_level_id);

DROP INDEX IF EXISTS public.idx_balancing_questions_grade_level;
CREATE INDEX IF NOT EXISTS idx_balancing_questions_grade_level_id
  ON public.balancing_questions (grade_level_id);

DROP INDEX IF EXISTS public.idx_arena_questions_grade_level;
CREATE INDEX IF NOT EXISTS idx_arena_questions_grade_level_id
  ON public.arena_questions (grade_level_id);

DROP INDEX IF EXISTS public.idx_classes_grade_level;
CREATE INDEX IF NOT EXISTS idx_classes_grade_level_id
  ON public.classes (grade_level_id);

DROP INDEX IF EXISTS public.idx_user_progress_user_type;
CREATE INDEX IF NOT EXISTS idx_user_progress_user_progress_type
  ON public.user_progress (user_id, progress_type);

DROP INDEX IF EXISTS public.idx_user_progress_item;
CREATE INDEX IF NOT EXISTS idx_user_progress_target
  ON public.user_progress (progress_type, target_id);

DROP INDEX IF EXISTS public.idx_materials_created_by;
CREATE INDEX IF NOT EXISTS idx_materials_created_by_user_id
  ON public.materials (created_by_user_id);

-- The NOT VALID clauses above keep the rename migration non-blocking for old
-- data. Validate when the referenced data is clean so new installs end with
-- fully trusted foreign keys.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'lessons_grade_level_id_fkey'
      AND convalidated = false
  )
  AND NOT EXISTS (
    SELECT 1
    FROM public.lessons l
    LEFT JOIN public.grade_levels g ON g.id = l.grade_level_id
    WHERE g.id IS NULL
  ) THEN
    ALTER TABLE public.lessons VALIDATE CONSTRAINT lessons_grade_level_id_fkey;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'materials_created_by_user_id_fkey'
      AND convalidated = false
  )
  AND NOT EXISTS (
    SELECT 1
    FROM public.materials m
    LEFT JOIN public.users u ON u.id = m.created_by_user_id
    WHERE m.created_by_user_id IS NOT NULL
      AND u.id IS NULL
  ) THEN
    ALTER TABLE public.materials VALIDATE CONSTRAINT materials_created_by_user_id_fkey;
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';

COMMIT;
