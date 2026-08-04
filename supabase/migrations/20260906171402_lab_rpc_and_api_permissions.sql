SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- Bổ sung các RPC nguyên tử của bản cập nhật Lab ngày 06/09.
CREATE OR REPLACE FUNCTION public.increment_crafting_task_progress(
  p_user_id text,
  p_item_id text,
  p_tasks jsonb,
  p_reset_payload jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  task_payload jsonb;
  task_definition jsonb;
  task_state jsonb;
  task_history jsonb;
  task_id text;
  task_target integer;
  current_progress integer;
  today_vietnam text;
  already_recorded boolean;
BEGIN
  IF p_user_id IS NULL
    OR p_tasks IS NULL
    OR p_reset_payload IS NULL
    OR jsonb_typeof(p_tasks) <> 'array'
    OR jsonb_typeof(p_reset_payload) <> 'object'
  THEN
    RAISE EXCEPTION 'Yêu cầu cập nhật nhiệm vụ không hợp lệ.';
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('aurum-crafting:' || p_user_id, 0)
  );
  today_vietnam := pg_catalog.to_char(
    pg_catalog.timezone('Asia/Ho_Chi_Minh', pg_catalog.now()),
    'YYYY-MM-DD'
  );

  SELECT progress.noi_dung_tien_do
  INTO task_payload
  FROM public.tien_do_nguoi_dung progress
  WHERE progress.nguoi_dung_id = p_user_id
    AND progress.loai_tien_do = 'achievement'
    AND progress.doi_tuong_id = 'crafting_tasks'
  FOR UPDATE;

  IF task_payload IS NULL OR COALESCE(task_payload->>'lastResetDate', '') <> today_vietnam THEN
    task_payload := jsonb_set(p_reset_payload, '{lastResetDate}', to_jsonb(today_vietnam), true);
  END IF;

  FOR task_definition IN SELECT value FROM jsonb_array_elements(p_tasks) LOOP
    task_id := task_definition->>'id';
    task_target := GREATEST(1, COALESCE((task_definition->>'target')::integer, 1));
    task_state := task_payload #> ARRAY['tasks', task_id];

    IF task_id IS NULL
      OR task_state IS NULL
      OR COALESCE((task_state->>'claimed')::boolean, false)
    THEN
      CONTINUE;
    END IF;

    current_progress := GREATEST(0, COALESCE((task_state->>'progress')::integer, 0));
    task_history := CASE
      WHEN jsonb_typeof(task_state->'history') = 'array' THEN task_state->'history'
      ELSE '[]'::jsonb
    END;

    IF p_item_id IS NOT NULL THEN
      SELECT EXISTS (
        SELECT 1
        FROM jsonb_array_elements_text(task_history) AS history_item(value)
        WHERE history_item.value = p_item_id
      ) INTO already_recorded;

      IF already_recorded THEN
        CONTINUE;
      END IF;

      task_history := task_history || jsonb_build_array(p_item_id);
      task_state := jsonb_set(task_state, '{history}', task_history, true);
      current_progress := LEAST(task_target, jsonb_array_length(task_history));
    ELSE
      current_progress := LEAST(task_target, current_progress + 1);
    END IF;

    task_state := jsonb_set(task_state, '{progress}', to_jsonb(current_progress), true);
    task_payload := jsonb_set(task_payload, ARRAY['tasks', task_id], task_state, true);
  END LOOP;

  INSERT INTO public.tien_do_nguoi_dung (
    nguoi_dung_id, loai_tien_do, doi_tuong_id, noi_dung_tien_do, updated_at
  ) VALUES (
    p_user_id, 'achievement', 'crafting_tasks', task_payload, pg_catalog.now()
  )
  ON CONFLICT (nguoi_dung_id, loai_tien_do, doi_tuong_id)
  DO UPDATE SET
    noi_dung_tien_do = EXCLUDED.noi_dung_tien_do,
    updated_at = pg_catalog.now();

  RETURN task_payload;
END;
$$;

CREATE OR REPLACE FUNCTION public.claim_crafting_task_reward(
  p_user_id text,
  p_task_id text,
  p_target integer,
  p_rewards jsonb,
  p_xp_reward integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  task_payload jsonb;
  task_state jsonb;
  inventory_payload jsonb;
  ingredient_list jsonb;
  reward_item jsonb;
  reward_id text;
  reward_amount integer;
  reward_exists boolean;
  today_vietnam text;
  total_xp integer;
  next_level integer;
BEGIN
  IF p_user_id IS NULL OR p_task_id IS NULL OR p_target < 1 OR p_xp_reward < 0 THEN
    RAISE EXCEPTION 'Yêu cầu nhận thưởng không hợp lệ.';
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('aurum-crafting:' || p_user_id, 0)
  );

  today_vietnam := to_char(timezone('Asia/Ho_Chi_Minh', now()), 'YYYY-MM-DD');

  SELECT progress.noi_dung_tien_do
  INTO task_payload
  FROM public.tien_do_nguoi_dung progress
  WHERE progress.nguoi_dung_id = p_user_id
    AND progress.loai_tien_do = 'achievement'
    AND progress.doi_tuong_id = 'crafting_tasks'
  FOR UPDATE;

  IF task_payload IS NULL THEN
    RAISE EXCEPTION 'Không tìm thấy nhiệm vụ.';
  END IF;

  IF COALESCE(task_payload->>'lastResetDate', '') <> today_vietnam THEN
    RAISE EXCEPTION 'Nhiệm vụ đã hết hạn. Hãy tải lại trang.';
  END IF;

  task_state := task_payload #> ARRAY['tasks', p_task_id];
  IF task_state IS NULL THEN
    RAISE EXCEPTION 'Không tìm thấy nhiệm vụ.';
  END IF;
  IF COALESCE((task_state->>'claimed')::boolean, false) THEN
    RAISE EXCEPTION 'Phần thưởng này đã được nhận.';
  END IF;
  IF COALESCE((task_state->>'progress')::integer, 0) < p_target THEN
    RAISE EXCEPTION 'Chưa hoàn thành mục tiêu nhiệm vụ.';
  END IF;

  SELECT progress.noi_dung_tien_do
  INTO inventory_payload
  FROM public.tien_do_nguoi_dung progress
  WHERE progress.nguoi_dung_id = p_user_id
    AND progress.loai_tien_do = 'achievement'
    AND progress.doi_tuong_id = 'inventory'
  FOR UPDATE;

  inventory_payload := COALESCE(inventory_payload, '{"ingredients":[],"craftedItems":[]}'::jsonb);
  ingredient_list := CASE
    WHEN jsonb_typeof(inventory_payload->'ingredients') = 'array' THEN inventory_payload->'ingredients'
    ELSE '[]'::jsonb
  END;

  FOR reward_item IN SELECT value FROM jsonb_array_elements(COALESCE(p_rewards, '[]'::jsonb)) LOOP
    reward_id := reward_item->>'ingredientId';
    reward_amount := GREATEST(1, COALESCE((reward_item->>'amount')::integer, 1));
    IF reward_id IS NULL OR reward_id = '' THEN
      CONTINUE;
    END IF;

    SELECT EXISTS (
      SELECT 1 FROM jsonb_array_elements(ingredient_list) ingredient
      WHERE ingredient->>'id' = reward_id
    ) INTO reward_exists;

    SELECT COALESCE(jsonb_agg(
      CASE
        WHEN ingredient->>'id' = reward_id THEN
          jsonb_set(
            ingredient,
            '{amount}',
            to_jsonb(COALESCE((ingredient->>'amount')::integer, 0) + reward_amount),
            true
          )
        ELSE ingredient
      END
    ), '[]'::jsonb)
    INTO ingredient_list
    FROM jsonb_array_elements(ingredient_list) ingredient;

    IF NOT reward_exists THEN
      ingredient_list := ingredient_list || jsonb_build_array(
        jsonb_build_object('id', reward_id, 'amount', reward_amount)
      );
    END IF;
  END LOOP;

  inventory_payload := jsonb_set(inventory_payload, '{ingredients}', ingredient_list, true);
  task_payload := jsonb_set(task_payload, ARRAY['tasks', p_task_id, 'claimed'], 'true'::jsonb, true);

  UPDATE public.tien_do_nguoi_dung
  SET noi_dung_tien_do = task_payload,
      updated_at = now()
  WHERE nguoi_dung_id = p_user_id
    AND loai_tien_do = 'achievement'
    AND doi_tuong_id = 'crafting_tasks';

  INSERT INTO public.tien_do_nguoi_dung (
    nguoi_dung_id, loai_tien_do, doi_tuong_id, noi_dung_tien_do, updated_at
  ) VALUES (
    p_user_id, 'achievement', 'inventory', inventory_payload, now()
  )
  ON CONFLICT (nguoi_dung_id, loai_tien_do, doi_tuong_id)
  DO UPDATE SET
    noi_dung_tien_do = EXCLUDED.noi_dung_tien_do,
    updated_at = now();

  UPDATE public.nguoi_dung
  SET diem_kinh_nghiem = COALESCE(diem_kinh_nghiem, 0) + p_xp_reward,
      cap_do = floor(((COALESCE(diem_kinh_nghiem, 0) + p_xp_reward)::numeric) / 1000)::integer + 1,
      updated_at = now()
  WHERE id = p_user_id
  RETURNING diem_kinh_nghiem, cap_do INTO total_xp, next_level;

  IF total_xp IS NULL THEN
    RAISE EXCEPTION 'Không tìm thấy người dùng.';
  END IF;

  RETURN jsonb_build_object(
    'tasks', task_payload,
    'inventory', inventory_payload,
    'rewards', p_rewards,
    'xpGained', p_xp_reward,
    'totalXP', total_xp,
    'newLevel', next_level
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.craft_lab_item(
  p_user_id text,
  p_item_id text,
  p_formula text,
  p_requirements jsonb,
  p_xp_reward integer
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  inventory_payload jsonb;
  ingredient_list jsonb;
  crafted_items jsonb;
  requirement record;
  available_amount integer;
  total_xp integer;
  next_level integer;
BEGIN
  IF p_user_id IS NULL OR p_item_id IS NULL OR p_formula IS NULL OR p_xp_reward < 0 THEN
    RAISE EXCEPTION 'Yêu cầu chế tạo không hợp lệ.';
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('aurum-crafting:' || p_user_id, 0)
  );

  SELECT progress.noi_dung_tien_do
  INTO inventory_payload
  FROM public.tien_do_nguoi_dung progress
  WHERE progress.nguoi_dung_id = p_user_id
    AND progress.loai_tien_do = 'achievement'
    AND progress.doi_tuong_id = 'inventory'
  FOR UPDATE;

  inventory_payload := COALESCE(inventory_payload, '{"ingredients":[],"craftedItems":[]}'::jsonb);
  ingredient_list := CASE
    WHEN jsonb_typeof(inventory_payload->'ingredients') = 'array' THEN inventory_payload->'ingredients'
    ELSE '[]'::jsonb
  END;
  crafted_items := CASE
    WHEN jsonb_typeof(inventory_payload->'craftedItems') = 'array' THEN inventory_payload->'craftedItems'
    ELSE '[]'::jsonb
  END;

  IF crafted_items ? p_item_id THEN
    RAISE EXCEPTION 'Vật phẩm này đã được chế tạo.';
  END IF;

  FOR requirement IN SELECT key AS ingredient_id, value::integer AS amount FROM jsonb_each_text(COALESCE(p_requirements, '{}'::jsonb)) LOOP
    SELECT COALESCE(MAX((ingredient->>'amount')::integer), 0)
    INTO available_amount
    FROM jsonb_array_elements(ingredient_list) ingredient
    WHERE ingredient->>'id' = requirement.ingredient_id;

    IF available_amount < requirement.amount THEN
      RAISE EXCEPTION 'Chưa đủ nguyên liệu kiến thức để chế tạo.';
    END IF;

    SELECT COALESCE(jsonb_agg(
      CASE
        WHEN ingredient->>'id' = requirement.ingredient_id THEN
          jsonb_set(
            ingredient,
            '{amount}',
            to_jsonb((ingredient->>'amount')::integer - requirement.amount),
            true
          )
        ELSE ingredient
      END
    ), '[]'::jsonb)
    INTO ingredient_list
    FROM jsonb_array_elements(ingredient_list) ingredient;
  END LOOP;

  crafted_items := crafted_items || jsonb_build_array(p_item_id);
  inventory_payload := jsonb_set(inventory_payload, '{ingredients}', ingredient_list, true);
  inventory_payload := jsonb_set(inventory_payload, '{craftedItems}', crafted_items, true);

  INSERT INTO public.tien_do_nguoi_dung (
    nguoi_dung_id, loai_tien_do, doi_tuong_id, noi_dung_tien_do, updated_at
  ) VALUES (
    p_user_id, 'achievement', 'inventory', inventory_payload, now()
  )
  ON CONFLICT (nguoi_dung_id, loai_tien_do, doi_tuong_id)
  DO UPDATE SET noi_dung_tien_do = EXCLUDED.noi_dung_tien_do, updated_at = now();

  INSERT INTO public.tien_do_nguoi_dung (
    nguoi_dung_id, loai_tien_do, doi_tuong_id, noi_dung_tien_do, updated_at
  ) VALUES (
    p_user_id, 'chemical', p_formula, '{}'::jsonb, now()
  )
  ON CONFLICT (nguoi_dung_id, loai_tien_do, doi_tuong_id)
  DO UPDATE SET updated_at = now();

  UPDATE public.nguoi_dung
  SET diem_kinh_nghiem = COALESCE(diem_kinh_nghiem, 0) + p_xp_reward,
      cap_do = floor(((COALESCE(diem_kinh_nghiem, 0) + p_xp_reward)::numeric) / 1000)::integer + 1,
      updated_at = now()
  WHERE id = p_user_id
  RETURNING diem_kinh_nghiem, cap_do INTO total_xp, next_level;

  IF total_xp IS NULL THEN
    RAISE EXCEPTION 'Không tìm thấy người dùng.';
  END IF;

  RETURN jsonb_build_object(
    'inventory', inventory_payload,
    'formula', p_formula,
    'totalXP', total_xp,
    'newLevel', next_level
  );
END;
$$;

REVOKE ALL ON FUNCTION public.increment_crafting_task_progress(text, text, jsonb, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_crafting_task_reward(text, text, integer, jsonb, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.craft_lab_item(text, text, text, jsonb, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_crafting_task_progress(text, text, jsonb, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_crafting_task_reward(text, text, integer, jsonb, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.craft_lab_item(text, text, text, jsonb, integer) TO service_role;

-- Các trạng thái nghiệp vụ chỉ được ghi qua API Express/service_role.
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE
  public.tien_do_nguoi_dung,
  public.phan_hoi,
  public.yeu_cau_duyet_admin,
  public.phong_dau,
  public.nguoi_choi,
  public.tra_loi_vong,
  public.lich_su_dau
FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  public.tien_do_nguoi_dung,
  public.phan_hoi,
  public.yeu_cau_duyet_admin,
  public.phong_dau,
  public.nguoi_choi,
  public.tra_loi_vong,
  public.lich_su_dau
TO service_role;

-- Đáp án đấu trường chỉ được API đọc và lọc trước khi trả về client.
REVOKE ALL ON TABLE public.cau_hoi_dau FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.cau_hoi_dau TO service_role;

-- Không cấp quyền quản trị bảng cho các vai trò trình duyệt.
REVOKE TRUNCATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA public FROM PUBLIC, anon, authenticated;
DROP POLICY IF EXISTS "Public read arena questions" ON public."cau_hoi_dau";
DROP POLICY IF EXISTS "Users can insert own match history" ON public."lich_su_dau";
DROP POLICY IF EXISTS "Users can insert own progress" ON public."tien_do_nguoi_dung";
DROP POLICY IF EXISTS "Users can update own progress" ON public."tien_do_nguoi_dung";
DROP POLICY IF EXISTS "Arena hosts update own rooms" ON public."phong_dau";
DROP POLICY IF EXISTS "Authenticated users create own arena rooms" ON public."phong_dau";
DROP POLICY IF EXISTS "Admins can create approval requests" ON public."yeu_cau_duyet_admin";
DROP POLICY IF EXISTS "Admins can update approval requests" ON public."yeu_cau_duyet_admin";
DROP POLICY IF EXISTS "Authenticated users can insert anonymous or own feedback" ON public."phan_hoi";

DROP POLICY IF EXISTS "Public read waiting arena rooms" ON public.phong_dau;
CREATE POLICY "Public read waiting arena rooms"
  ON public.phong_dau FOR SELECT TO anon
  USING (status = 'waiting' AND la_luyen_tap = false);

DROP POLICY IF EXISTS "Arena participants read rooms" ON public.phong_dau;
CREATE POLICY "Arena participants read rooms"
  ON public.phong_dau FOR SELECT TO authenticated
  USING (
    (status = 'waiting' AND la_luyen_tap = false)
    OR chu_phong_id = (select auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM public.nguoi_choi p
      WHERE p.phong_dau_id = phong_dau.id
        AND p.nguoi_dung_id = (select auth.uid())::text
    )
  );

-- Luồng giáo viên đọc thông báo từ API; webhook cũ không có Edge Function đích.
DROP TRIGGER IF EXISTS aurumhook ON public.bai_nop;

NOTIFY pgrst, 'reload schema';
