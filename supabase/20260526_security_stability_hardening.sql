-- Security and stability hardening for AURUM.
-- Safe to run more than once.

-- Remove broad write policies that let anon/authenticated users bypass backend checks.
DROP POLICY IF EXISTS "Temp Anon Insert" ON public.arena_questions;
DROP POLICY IF EXISTS "Temp Anon Insert" ON public.balancing_questions;
DROP POLICY IF EXISTS "Temp Anon Insert" ON public.class_assignment_submissions;
DROP POLICY IF EXISTS "Temp Anon Insert" ON public.class_posts;
DROP POLICY IF EXISTS "Temp Anon Insert" ON public.lab_chemicals;
DROP POLICY IF EXISTS "Temp Anon Insert" ON public.lab_reactions;
DROP POLICY IF EXISTS "Temp Anon Insert" ON public.lessons;
DROP POLICY IF EXISTS "Temp Anon Insert" ON public.materials;
DROP POLICY IF EXISTS "Allow insert match history" ON public.arena_match_history;
DROP POLICY IF EXISTS "Allow authenticated insert on arena rooms" ON public.arena_rooms;
DROP POLICY IF EXISTS "Allow authenticated update on arena rooms" ON public.arena_rooms;
DROP POLICY IF EXISTS "Allow students to insert submissions" ON public.class_assignment_submissions;
DROP POLICY IF EXISTS "Allow teachers to update submissions" ON public.class_assignment_submissions;
DROP POLICY IF EXISTS "Allow auth insert class_members" ON public.class_members;
DROP POLICY IF EXISTS "Allow teachers to insert posts" ON public.class_posts;
DROP POLICY IF EXISTS "Allow teachers to insert schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Allow teachers to insert classes" ON public.classes;
DROP POLICY IF EXISTS "Allow authenticated insert feedback" ON public.feedback;
DROP POLICY IF EXISTS "Allow authenticated insert on feedback" ON public.material_feedback;
DROP POLICY IF EXISTS "Allow all for authenticated on materials" ON public.materials;
DROP POLICY IF EXISTS "Users can insert own activities" ON public.user_activities;

-- Collapse duplicate read policies into a single public read policy per content table.
DROP POLICY IF EXISTS "Allow public read on chemicals" ON public.lab_chemicals;
DROP POLICY IF EXISTS "Public Read Chemicals" ON public.lab_chemicals;
DROP POLICY IF EXISTS "Allow public read on reactions" ON public.lab_reactions;
DROP POLICY IF EXISTS "Public Read Reactions" ON public.lab_reactions;
DROP POLICY IF EXISTS "Allow public read access on materials" ON public.materials;

DROP POLICY IF EXISTS "Public read grade levels" ON public.grade_levels;
DROP POLICY IF EXISTS "Public read missions" ON public.missions;
DROP POLICY IF EXISTS "Public read lessons" ON public.lessons;
DROP POLICY IF EXISTS "Public read lab chemicals" ON public.lab_chemicals;
DROP POLICY IF EXISTS "Public read lab reactions" ON public.lab_reactions;
DROP POLICY IF EXISTS "Public read arena questions" ON public.arena_questions;
DROP POLICY IF EXISTS "Public read balancing questions" ON public.balancing_questions;
DROP POLICY IF EXISTS "Public read materials" ON public.materials;
DROP POLICY IF EXISTS "Public read lesson discussions" ON public.lesson_discussions;
DROP POLICY IF EXISTS "Authenticated users can create own discussions" ON public.lesson_discussions;
DROP POLICY IF EXISTS "Users can read own notes" ON public.user_notes;
DROP POLICY IF EXISTS "Users can insert own notes" ON public.user_notes;
DROP POLICY IF EXISTS "Users can update own notes" ON public.user_notes;
DROP POLICY IF EXISTS "Users can delete own notes" ON public.user_notes;
DROP POLICY IF EXISTS "Users can read own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can read own missions" ON public.user_missions;
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Public read waiting arena rooms" ON public.arena_rooms;
DROP POLICY IF EXISTS "Authenticated users create own arena rooms" ON public.arena_rooms;
DROP POLICY IF EXISTS "Arena hosts update own rooms" ON public.arena_rooms;
DROP POLICY IF EXISTS "Users can view own match history" ON public.arena_match_history;
DROP POLICY IF EXISTS "Users can insert own match history" ON public.arena_match_history;
DROP POLICY IF EXISTS "Class members can read joined classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can insert owned classes" ON public.classes;
DROP POLICY IF EXISTS "Teachers can update owned classes" ON public.classes;
DROP POLICY IF EXISTS "Students can read own class memberships" ON public.class_members;
DROP POLICY IF EXISTS "Students can join as themselves" ON public.class_members;
DROP POLICY IF EXISTS "Class members can read visible posts" ON public.class_posts;
DROP POLICY IF EXISTS "Teachers can insert posts for owned classes" ON public.class_posts;
DROP POLICY IF EXISTS "Teachers can delete owned class posts" ON public.class_posts;
DROP POLICY IF EXISTS "Class members can read schedules" ON public.class_schedules;
DROP POLICY IF EXISTS "Teachers can insert schedules for owned classes" ON public.class_schedules;
DROP POLICY IF EXISTS "Students can insert submitted own assignment" ON public.class_assignment_submissions;
DROP POLICY IF EXISTS "Teachers can update submissions for owned classes" ON public.class_assignment_submissions;
DROP POLICY IF EXISTS "Authenticated users can insert anonymous or own feedback" ON public.feedback;
DROP POLICY IF EXISTS "Authenticated users can insert material feedback" ON public.material_feedback;
DROP POLICY IF EXISTS "Users can insert own activities" ON public.user_activities;

CREATE POLICY "Public read grade levels"
  ON public.grade_levels FOR SELECT
  USING (true);

CREATE POLICY "Public read missions"
  ON public.missions FOR SELECT
  USING (true);

CREATE POLICY "Public read lessons"
  ON public.lessons FOR SELECT
  USING (true);

CREATE POLICY "Public read lab chemicals"
  ON public.lab_chemicals FOR SELECT
  USING (true);

CREATE POLICY "Public read lab reactions"
  ON public.lab_reactions FOR SELECT
  USING (true);

CREATE POLICY "Public read arena questions"
  ON public.arena_questions FOR SELECT
  USING (true);

CREATE POLICY "Public read balancing questions"
  ON public.balancing_questions FOR SELECT
  USING (true);

CREATE POLICY "Public read materials"
  ON public.materials FOR SELECT
  USING (true);

CREATE POLICY "Public read lesson discussions"
  ON public.lesson_discussions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create own discussions"
  ON public.lesson_discussions FOR INSERT
  WITH CHECK (user_id = (select auth.uid())::text);

CREATE POLICY "Users can read own notes"
  ON public.user_notes FOR SELECT
  USING (user_id = (select auth.uid())::text);

CREATE POLICY "Users can insert own notes"
  ON public.user_notes FOR INSERT
  WITH CHECK (user_id = (select auth.uid())::text);

CREATE POLICY "Users can update own notes"
  ON public.user_notes FOR UPDATE
  USING (user_id = (select auth.uid())::text)
  WITH CHECK (user_id = (select auth.uid())::text);

CREATE POLICY "Users can delete own notes"
  ON public.user_notes FOR DELETE
  USING (user_id = (select auth.uid())::text);

CREATE POLICY "Users can read own progress"
  ON public.user_progress FOR SELECT
  USING (user_id = (select auth.uid())::text);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (user_id = (select auth.uid())::text);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE
  USING (user_id = (select auth.uid())::text)
  WITH CHECK (user_id = (select auth.uid())::text);

CREATE POLICY "Users can read own missions"
  ON public.user_missions FOR SELECT
  USING (user_id = (select auth.uid())::text);

CREATE POLICY "Users can read own profile"
  ON public.users FOR SELECT
  USING (id = (select auth.uid())::text);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (id = (select auth.uid())::text)
  WITH CHECK (id = (select auth.uid())::text);

REVOKE UPDATE ON TABLE public.users FROM anon, authenticated;
GRANT UPDATE (avatar_seed, study_plan) ON TABLE public.users TO authenticated;

CREATE POLICY "Public read waiting arena rooms"
  ON public.arena_rooms FOR SELECT
  USING (status = 'waiting');

CREATE POLICY "Authenticated users create own arena rooms"
  ON public.arena_rooms FOR INSERT
  WITH CHECK (host_id = (select auth.uid())::text);

CREATE POLICY "Arena hosts update own rooms"
  ON public.arena_rooms FOR UPDATE
  USING (host_id = (select auth.uid())::text)
  WITH CHECK (host_id = (select auth.uid())::text);

CREATE POLICY "Users can view own match history"
  ON public.arena_match_history FOR SELECT
  USING (user_id = (select auth.uid())::text);

CREATE POLICY "Users can insert own match history"
  ON public.arena_match_history FOR INSERT
  WITH CHECK (user_id = (select auth.uid())::text);

CREATE POLICY "Class members can read joined classes"
  ON public.classes FOR SELECT
  USING (
    teacher_id = (select auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM public.class_members cm
      WHERE cm.class_id = classes.id
        AND cm.student_id = (select auth.uid())::text
    )
  );

CREATE POLICY "Teachers can insert owned classes"
  ON public.classes FOR INSERT
  WITH CHECK (teacher_id = (select auth.uid())::text);

CREATE POLICY "Teachers can update owned classes"
  ON public.classes FOR UPDATE
  USING (teacher_id = (select auth.uid())::text)
  WITH CHECK (teacher_id = (select auth.uid())::text);

CREATE POLICY "Students can read own class memberships"
  ON public.class_members FOR SELECT
  USING (student_id = (select auth.uid())::text);

CREATE POLICY "Students can join as themselves"
  ON public.class_members FOR INSERT
  WITH CHECK (student_id = (select auth.uid())::text);

CREATE POLICY "Class members can read visible posts"
  ON public.class_posts FOR SELECT
  USING (
    author_id = (select auth.uid())::text
    OR target_student_id = (select auth.uid())::text
    OR (
      target_student_id IS NULL
      AND EXISTS (
        SELECT 1 FROM public.class_members cm
        WHERE cm.class_id = class_posts.class_id
          AND cm.student_id = (select auth.uid())::text
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_posts.class_id
        AND c.teacher_id = (select auth.uid())::text
    )
  );

CREATE POLICY "Teachers can insert posts for owned classes"
  ON public.class_posts FOR INSERT
  WITH CHECK (
    author_id = (select auth.uid())::text
    AND EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_posts.class_id
        AND c.teacher_id = (select auth.uid())::text
    )
  );

CREATE POLICY "Teachers can delete owned class posts"
  ON public.class_posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_posts.class_id
        AND c.teacher_id = (select auth.uid())::text
    )
  );

CREATE POLICY "Class members can read schedules"
  ON public.class_schedules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_schedules.class_id
        AND c.teacher_id = (select auth.uid())::text
    )
    OR EXISTS (
      SELECT 1 FROM public.class_members cm
      WHERE cm.class_id = class_schedules.class_id
        AND cm.student_id = (select auth.uid())::text
    )
  );

CREATE POLICY "Teachers can insert schedules for owned classes"
  ON public.class_schedules FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_schedules.class_id
        AND c.teacher_id = (select auth.uid())::text
    )
  );

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

CREATE POLICY "Teachers can update submissions for owned classes"
  ON public.class_assignment_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.class_posts p
      JOIN public.classes c ON c.id = p.class_id
      WHERE p.id = class_assignment_submissions.post_id
        AND c.teacher_id = (select auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.class_posts p
      JOIN public.classes c ON c.id = p.class_id
      WHERE p.id = class_assignment_submissions.post_id
        AND c.teacher_id = (select auth.uid())::text
    )
  );

CREATE POLICY "Authenticated users can insert anonymous or own feedback"
  ON public.feedback FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id = (select auth.uid())::text);

CREATE POLICY "Authenticated users can insert material feedback"
  ON public.material_feedback FOR INSERT
  WITH CHECK (user_id IS NULL OR user_id = (select auth.uid())::text);

CREATE POLICY "Users can insert own activities"
  ON public.user_activities FOR INSERT
  WITH CHECK (user_id = (select auth.uid())::text);

-- Atomic RPCs used by the backend service-role client.
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

  RETURN jsonb_build_object(
    'xpGained', reward,
    'totalXP', total_xp,
    'newLevel', next_level
  );
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

REVOKE ALL ON FUNCTION public.increment_likes(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_material_view(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_mission_reward(text, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.join_arena_room(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_likes(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_material_view(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_mission_reward(text, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.join_arena_room(text) TO service_role;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'set_user_devices_updated_at'
      AND p.pronargs = 0
  ) THEN
    EXECUTE 'ALTER FUNCTION public.set_user_devices_updated_at() SET search_path = public';
  END IF;
END $$;

-- Cover foreign keys flagged by the database linter.
CREATE INDEX IF NOT EXISTS idx_arena_match_history_room_id ON public.arena_match_history (room_id);
CREATE INDEX IF NOT EXISTS idx_arena_questions_grade_level ON public.arena_questions (grade_level);
CREATE INDEX IF NOT EXISTS idx_arena_rooms_host_id ON public.arena_rooms (host_id);
CREATE INDEX IF NOT EXISTS idx_balancing_questions_grade_level ON public.balancing_questions (grade_level);
CREATE INDEX IF NOT EXISTS idx_class_assignment_submissions_student_id ON public.class_assignment_submissions (student_id);
CREATE INDEX IF NOT EXISTS idx_class_posts_author_id ON public.class_posts (author_id);
CREATE INDEX IF NOT EXISTS idx_class_posts_target_student_id ON public.class_posts (target_student_id);
CREATE INDEX IF NOT EXISTS idx_class_schedules_class_id ON public.class_schedules (class_id);
CREATE INDEX IF NOT EXISTS idx_classes_grade_level ON public.classes (grade_level);
CREATE INDEX IF NOT EXISTS idx_classes_teacher_id ON public.classes (teacher_id);
CREATE INDEX IF NOT EXISTS idx_lab_reactions_grade_level ON public.lab_reactions (grade_level);
CREATE INDEX IF NOT EXISTS idx_lesson_discussions_parent_id ON public.lesson_discussions (parent_id);
CREATE INDEX IF NOT EXISTS idx_lesson_discussions_user_id ON public.lesson_discussions (user_id);
CREATE INDEX IF NOT EXISTS idx_material_feedback_material_id ON public.material_feedback (material_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_mission_id ON public.user_missions (mission_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_lesson_id ON public.user_notes (lesson_id);

DROP INDEX IF EXISTS public.class_assignment_submissions_post_student_uidx;
DROP INDEX IF EXISTS public.user_missions_user_mission_uidx;

NOTIFY pgrst, 'reload schema';
