-- Kiểm tra chức năng trên dữ liệu thử, toàn bộ thay đổi được ROLLBACK.
-- Không dùng tài khoản/bài nộp thật; không gọi dịch vụ gửi thông báo.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgrelid = 'public.bai_nop'::regclass
      AND NOT tgisinternal AND tgenabled <> 'D'
  ) THEN
    RAISE EXCEPTION 'Dừng kiểm tra: bài_nop có trigger ngoài dự kiến.';
  END IF;
END;
$$;

SET LOCAL ROLE service_role;
DO $$
DECLARE
  student_id text := gen_random_uuid()::text;
  teacher_id text := gen_random_uuid()::text;
  class_id uuid;
  post_id uuid;
  material_id uuid;
  lesson_id text := 'db-check-' || gen_random_uuid()::text;
  task_state jsonb;
  reward_result jsonb;
  craft_result jsonb;
  reset_payload jsonb := '{"tasks":{"check_task":{"progress":0,"claimed":false,"history":[]}}}'::jsonb;
  rejected boolean := false;
  checks text[] := ARRAY[]::text[];
BEGIN
  PERFORM set_config('aurum.check_student_id', student_id, true);
  INSERT INTO public.nguoi_dung (id, username, role)
  VALUES (student_id, 'db_check_' || student_id, 'student'),
         (teacher_id, 'db_check_' || teacher_id, 'teacher');

  task_state := public.increment_crafting_task_progress(
    student_id, 'reaction_a', '[{"id":"check_task","target":2}]', reset_payload
  );
  IF task_state #>> '{tasks,check_task,progress}' <> '1' THEN
    RAISE EXCEPTION 'Không tăng tiến độ nhiệm vụ.';
  END IF;
  checks := array_append(checks, 'task_progress');

  task_state := public.increment_crafting_task_progress(
    student_id, 'reaction_a', '[{"id":"check_task","target":2}]', reset_payload
  );
  IF task_state #>> '{tasks,check_task,progress}' <> '1' THEN
    RAISE EXCEPTION 'Tiến độ bị cộng trùng.';
  END IF;
  checks := array_append(checks, 'task_deduplication');

  task_state := public.increment_crafting_task_progress(
    student_id, 'reaction_b', '[{"id":"check_task","target":2}]', reset_payload
  );
  IF task_state #>> '{tasks,check_task,progress}' <> '2' THEN
    RAISE EXCEPTION 'Không hoàn thành nhiệm vụ.';
  END IF;

  reward_result := public.claim_crafting_task_reward(
    student_id, 'check_task', 2, '[{"ingredientId":"check_ingredient","amount":3}]', 50
  );
  IF reward_result->>'totalXP' <> '50'
    OR reward_result #>> '{tasks,check_task,claimed}' <> 'true'
    OR reward_result #>> '{inventory,ingredients,0,amount}' <> '3' THEN
    RAISE EXCEPTION 'Kết quả nhận thưởng không đúng.';
  END IF;
  checks := array_append(checks, 'reward_inventory_and_xp');

  BEGIN
    PERFORM public.claim_crafting_task_reward(student_id, 'check_task', 2, '[]', 50);
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> 'Phần thưởng này đã được nhận.' THEN RAISE; END IF;
    rejected := true;
  END;
  IF NOT rejected THEN RAISE EXCEPTION 'Nhận thưởng trùng chưa bị chặn.'; END IF;
  checks := array_append(checks, 'duplicate_reward_rejected');

  craft_result := public.craft_lab_item(student_id, 'check_item', 'H2O', '{"check_ingredient":3}', 25);
  IF craft_result->>'totalXP' <> '75'
    OR craft_result #>> '{inventory,ingredients,0,amount}' <> '0'
    OR NOT (craft_result #> '{inventory,craftedItems}' ? 'check_item')
    OR NOT EXISTS (
      SELECT 1 FROM public.tien_do_nguoi_dung
      WHERE nguoi_dung_id = student_id AND loai_tien_do = 'chemical' AND doi_tuong_id = 'H2O'
    ) THEN
    RAISE EXCEPTION 'Chế tạo chưa trừ nguyên liệu/cộng XP/mở khóa đúng.';
  END IF;
  checks := array_append(checks, 'craft_inventory_unlock_and_xp');

  rejected := false;
  BEGIN
    PERFORM public.craft_lab_item(student_id, 'check_item', 'H2O', '{"check_ingredient":3}', 25);
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> 'Vật phẩm này đã được chế tạo.' THEN RAISE; END IF;
    rejected := true;
  END;
  IF NOT rejected THEN RAISE EXCEPTION 'Chế tạo trùng chưa bị chặn.'; END IF;
  checks := array_append(checks, 'duplicate_craft_rejected');

  rejected := false;
  BEGIN
    PERFORM public.craft_lab_item(student_id, 'check_other_item', 'NaCl', '{"check_ingredient":1}', 25);
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM <> 'Chưa đủ nguyên liệu kiến thức để chế tạo.' THEN RAISE; END IF;
    rejected := true;
  END;
  IF NOT rejected THEN RAISE EXCEPTION 'Chế tạo thiếu nguyên liệu chưa bị chặn.'; END IF;
  IF (SELECT diem_kinh_nghiem FROM public.nguoi_dung WHERE id = student_id) <> 75 THEN
    RAISE EXCEPTION 'Thao tác thất bại vẫn làm thay đổi XP.';
  END IF;
  checks := array_append(checks, 'failed_craft_keeps_xp');

  INSERT INTO public.lop (ten, khoi_id, giao_vien_id, ma_lop)
  VALUES ('Lớp kiểm tra giao dịch', 8, teacher_id, 'check_' || gen_random_uuid()::text)
  RETURNING id INTO class_id;
  INSERT INTO public.thanh_vien_lop (lop_id, hoc_sinh_id) VALUES (class_id, student_id);
  INSERT INTO public.bai_dang_lop (lop_id, tac_gia_id, type, noi_dung)
  VALUES (class_id, teacher_id, 'assignment', 'Bài kiểm tra giao dịch') RETURNING id INTO post_id;
  INSERT INTO public.bai_nop (bai_dang_id, hoc_sinh_id) VALUES (post_id, student_id);
  INSERT INTO public.lich_lop (lop_id, tieu_de, bat_dau_luc)
  VALUES (class_id, 'Lịch kiểm tra giao dịch', now());
  DELETE FROM public.lop WHERE id = class_id;
  IF EXISTS (SELECT 1 FROM public.thanh_vien_lop WHERE lop_id = class_id)
    OR EXISTS (SELECT 1 FROM public.bai_dang_lop WHERE lop_id = class_id)
    OR EXISTS (SELECT 1 FROM public.lich_lop WHERE lop_id = class_id)
    OR EXISTS (SELECT 1 FROM public.bai_nop WHERE bai_dang_id = post_id) THEN
    RAISE EXCEPTION 'Xóa lớp chưa xóa đủ các bản ghi phụ thuộc.';
  END IF;
  checks := array_append(checks, 'class_delete_cascades');

  INSERT INTO public.hoc_lieu (tieu_de, file_url, nguoi_tao_id)
  VALUES ('Học liệu kiểm tra giao dịch', 'https://example.invalid/db-check', teacher_id)
  RETURNING id INTO material_id;
  INSERT INTO public.phan_hoi_hoc_lieu (hoc_lieu_id, nguoi_dung_id, noi_dung, nguoi_tra_loi_id)
  VALUES (material_id, student_id, 'Phản hồi kiểm tra', teacher_id);
  DELETE FROM public.hoc_lieu WHERE id = material_id;
  IF EXISTS (SELECT 1 FROM public.phan_hoi_hoc_lieu WHERE hoc_lieu_id = material_id) THEN
    RAISE EXCEPTION 'Xóa học liệu chưa xóa phản hồi.';
  END IF;
  checks := array_append(checks, 'material_delete_cascades');

  INSERT INTO public.bai_hoc (id, khoi_id, tieu_de, updated_at)
  VALUES (lesson_id, 8, 'Bài học kiểm tra giao dịch', '2000-01-01'::timestamptz);
  UPDATE public.bai_hoc SET tieu_de = 'Đã cập nhật trong giao dịch' WHERE id = lesson_id;
  IF NOT EXISTS (SELECT 1 FROM public.bai_hoc WHERE id = lesson_id AND created_at IS NOT NULL AND updated_at = now()) THEN
    RAISE EXCEPTION 'Timestamp bài học chưa tự cập nhật.';
  END IF;
  checks := array_append(checks, 'lesson_timestamp_default_and_trigger');
  PERFORM set_config('aurum.sync_checks', to_jsonb(checks)::text, true);
END;
$$;

SET LOCAL ROLE authenticated;
DO $$
DECLARE
  student_id text := current_setting('aurum.check_student_id');
  checks jsonb := current_setting('aurum.sync_checks')::jsonb;
  rejected boolean := false;
BEGIN
  PERFORM set_config('request.jwt.claim.sub', student_id, true);
  BEGIN
    INSERT INTO public.tien_do_nguoi_dung (nguoi_dung_id, loai_tien_do, doi_tuong_id)
    VALUES (student_id, 'chemical', 'not_allowed');
  EXCEPTION WHEN insufficient_privilege THEN rejected := true;
  END;
  IF NOT rejected THEN RAISE EXCEPTION 'Client vẫn ghi được tiến độ.'; END IF;
  checks := checks || '["client_progress_write_denied"]'::jsonb;

  rejected := false;
  BEGIN
    PERFORM public.craft_lab_item(student_id, 'forbidden', 'H2O', '{}', 100);
  EXCEPTION WHEN insufficient_privilege THEN rejected := true;
  END;
  IF NOT rejected THEN RAISE EXCEPTION 'Client vẫn gọi được RPC chế tạo.'; END IF;
  checks := checks || '["client_rpc_execute_denied"]'::jsonb;

  rejected := false;
  BEGIN
    PERFORM dap_an FROM public.cau_hoi_dau LIMIT 1;
  EXCEPTION WHEN insufficient_privilege THEN rejected := true;
  END;
  IF NOT rejected THEN RAISE EXCEPTION 'Client vẫn đọc được đáp án.'; END IF;
  checks := checks || '["authenticated_answer_read_denied"]'::jsonb;

  rejected := false;
  BEGIN
    INSERT INTO public.yeu_cau_duyet_admin (action_key, action_label, request_hash)
    VALUES ('forbidden', 'Yêu cầu không được phép', gen_random_uuid()::text);
  EXCEPTION WHEN insufficient_privilege THEN rejected := true;
  END;
  IF NOT rejected THEN RAISE EXCEPTION 'Client vẫn ghi được yêu cầu duyệt.'; END IF;
  checks := checks || '["client_approval_write_denied"]'::jsonb;

  PERFORM count(*) FROM public.phong_dau;
  checks := checks || '["authenticated_arena_read_available"]'::jsonb;
  PERFORM set_config('aurum.sync_checks', checks::text, true);
END;
$$;

SET LOCAL ROLE anon;
DO $$
DECLARE
  rejected boolean := false;
  checks jsonb := current_setting('aurum.sync_checks')::jsonb;
BEGIN
  BEGIN
    PERFORM dap_an FROM public.cau_hoi_dau LIMIT 1;
  EXCEPTION WHEN insufficient_privilege THEN rejected := true;
  END;
  IF NOT rejected THEN RAISE EXCEPTION 'Anon vẫn đọc được đáp án.'; END IF;
  checks := checks || '["anonymous_answer_read_denied"]'::jsonb;

  rejected := false;
  BEGIN
    INSERT INTO public.phan_hoi (noi_dung, type, da_duyet)
    VALUES ('Phản hồi không được phép', 'praise', true);
  EXCEPTION WHEN insufficient_privilege THEN rejected := true;
  END;
  IF NOT rejected THEN RAISE EXCEPTION 'Anon vẫn tự tạo được phản hồi đã duyệt.'; END IF;
  checks := checks || '["anonymous_feedback_write_denied"]'::jsonb;

  PERFORM count(*) FROM public.hoa_chat;
  PERFORM count(*) FROM public.hoc_lieu;
  PERFORM count(*) FROM public.bai_hoc;
  PERFORM count(*) FROM public.phong_dau;
  checks := checks || '["public_catalog_and_waiting_rooms_read_available"]'::jsonb;
  PERFORM set_config('aurum.sync_checks', checks::text, true);
END;
$$;

SELECT current_setting('aurum.sync_checks')::jsonb AS passed_checks;
ROLLBACK;
