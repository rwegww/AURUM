-- Cleanup broad legacy SELECT policies left before the hardening migration.

DROP POLICY IF EXISTS "Allow public read access on arena questions" ON public.arena_questions;
DROP POLICY IF EXISTS "Allow public read access on arena rooms" ON public.arena_rooms;
DROP POLICY IF EXISTS "Allow public read on balancing questions" ON public.balancing_questions;
DROP POLICY IF EXISTS "Allow members to read class_members" ON public.class_members;
DROP POLICY IF EXISTS "Allow members to read posts" ON public.class_posts;
DROP POLICY IF EXISTS "Allow members to read schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Allow public read access on classes" ON public.classes;
DROP POLICY IF EXISTS "Allow members to read submissions" ON public.class_assignment_submissions;
DROP POLICY IF EXISTS "Users can view own activities" ON public.user_activities;

DROP POLICY IF EXISTS "Students and teachers can read submissions" ON public.class_assignment_submissions;
CREATE POLICY "Students and teachers can read submissions"
  ON public.class_assignment_submissions FOR SELECT
  USING (
    student_id = (select auth.uid())::text
    OR EXISTS (
      SELECT 1
      FROM public.class_posts p
      JOIN public.classes c ON c.id = p.class_id
      WHERE p.id = class_assignment_submissions.post_id
        AND c.teacher_id = (select auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "Users can view own activities" ON public.user_activities;
CREATE POLICY "Users can view own activities"
  ON public.user_activities FOR SELECT
  USING (user_id = (select auth.uid())::text);

NOTIFY pgrst, 'reload schema';
