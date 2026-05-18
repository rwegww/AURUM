-- Additive stability cleanup for the current AURUM schema.
-- Safe to run more than once.

ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS current_session_id text,
  ADD COLUMN IF NOT EXISTS linked_accounts jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS study_plan jsonb DEFAULT '{"studyTime":"20:00","dailyLessonTarget":1,"remindersEnabled":true}'::jsonb;

ALTER TABLE IF EXISTS public.lesson
  ADD COLUMN IF NOT EXISTS intro_video_url text;

ALTER TABLE IF EXISTS public.lessons
  ADD COLUMN IF NOT EXISTS intro_video_url text;

-- Existing code can mark teacher registration feedback as rejected.
DO $$
BEGIN
  IF to_regclass('public.feedback') IS NOT NULL THEN
    ALTER TABLE public.feedback DROP CONSTRAINT IF EXISTS feedback_status_check;
    ALTER TABLE public.feedback
      ADD CONSTRAINT feedback_status_check
      CHECK (status = ANY (ARRAY['unread'::text, 'resolved'::text, 'rejected'::text]));
  END IF;
END $$;

-- Deduplicate before adding the conflict targets used by upsert().
DO $$
BEGIN
  IF to_regclass('public.user_missions') IS NOT NULL THEN
    DELETE FROM public.user_missions a
    USING public.user_missions b
    WHERE a.ctid < b.ctid
      AND a.user_id = b.user_id
      AND a.mission_id = b.mission_id;

    CREATE UNIQUE INDEX IF NOT EXISTS user_missions_user_mission_uidx
      ON public.user_missions (user_id, mission_id);
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.class_assignment_submissions') IS NOT NULL THEN
    DELETE FROM public.class_assignment_submissions a
    USING public.class_assignment_submissions b
    WHERE a.ctid < b.ctid
      AND a.post_id = b.post_id
      AND a.student_id = b.student_id;

    CREATE UNIQUE INDEX IF NOT EXISTS class_assignment_submissions_post_student_uidx
      ON public.class_assignment_submissions (post_id, student_id);
  END IF;
END $$;
