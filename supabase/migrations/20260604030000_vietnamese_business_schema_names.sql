-- Chuẩn hóa tên bảng/cột nghiệp vụ sang tiếng Việt không dấu.
-- Migration này dùng RENAME để giữ nguyên dữ liệu, OID, grants, RLS enablement và quan hệ hiện có.

BEGIN;

DO $$
DECLARE
  item record;
BEGIN
  FOR item IN
    SELECT *
    FROM (VALUES
      ('users', 'nguoi_dung'),
      ('grade_levels', 'khoi'),
      ('missions', 'nhiem_vu'),
      ('user_missions', 'nhiem_vu_nguoi_dung'),
      ('user_activities', 'hoat_dong_nguoi_dung'),
      ('user_progress', 'tien_do_nguoi_dung'),
      ('user_notes', 'ghi_chu'),
      ('materials', 'hoc_lieu'),
      ('material_feedback', 'phan_hoi_hoc_lieu'),
      ('feedback', 'phan_hoi'),
      ('lessons', 'bai_hoc'),
      ('lesson_discussions', 'thao_luan'),
      ('classes', 'lop'),
      ('class_members', 'thanh_vien_lop'),
      ('class_posts', 'bai_dang_lop'),
      ('class_schedules', 'lich_lop'),
      ('class_assignment_submissions', 'bai_nop'),
      ('lab_chemicals', 'hoa_chat'),
      ('lab_reactions', 'phan_ung'),
      ('balancing_questions', 'cau_hoi_can'),
      ('arena_questions', 'cau_hoi_dau'),
      ('arena_rooms', 'phong_dau'),
      ('arena_room_players', 'nguoi_choi'),
      ('arena_round_answers', 'tra_loi_vong'),
      ('arena_match_history', 'lich_su_dau')
    ) AS mapping(old_name, new_name)
  LOOP
    IF to_regclass('public.' || quote_ident(item.old_name)) IS NOT NULL
       AND to_regclass('public.' || quote_ident(item.new_name)) IS NULL THEN
      EXECUTE format('ALTER TABLE public.%I RENAME TO %I', item.old_name, item.new_name);
    END IF;
  END LOOP;
END $$;

DO $$
DECLARE
  item record;
BEGIN
  FOR item IN
    SELECT *
    FROM (VALUES
      ('nguoi_dung', 'xp', 'diem_kinh_nghiem'),
      ('nguoi_dung', 'level', 'cap_do'),
      ('nguoi_dung', 'arena_stats', 'thong_ke_dau'),
      ('nguoi_dung', 'active_minutes', 'phut_hoat_dong'),
      ('nguoi_dung', 'last_active_at', 'hoat_dong_cuoi_luc'),
      ('nguoi_dung', 'is_locked', 'bi_khoa'),
      ('nguoi_dung', 'streak_count', 'so_ngay_chuoi'),
      ('nguoi_dung', 'last_streak_at', 'chuoi_cuoi_luc'),
      ('nguoi_dung', 'today_online_minutes', 'phut_online_hom_nay'),
      ('nguoi_dung', 'today_lesson_completed', 'da_hoan_thanh_bai_hom_nay'),
      ('nguoi_dung', 'study_plan', 'ke_hoach_hoc'),
      ('nguoi_dung', 'linked_accounts', 'tai_khoan_lien_ket'),

      ('khoi', 'name', 'ten'),

      ('nhiem_vu', 'title', 'tieu_de'),
      ('nhiem_vu', 'description', 'mo_ta'),
      ('nhiem_vu', 'action_type', 'loai_hanh_dong'),
      ('nhiem_vu', 'target_count', 'so_luong_muc_tieu'),
      ('nhiem_vu', 'xp_reward', 'thuong_xp'),
      ('nhiem_vu', 'icon', 'bieu_tuong'),

      ('nhiem_vu_nguoi_dung', 'user_id', 'nguoi_dung_id'),
      ('nhiem_vu_nguoi_dung', 'mission_id', 'nhiem_vu_id'),
      ('nhiem_vu_nguoi_dung', 'current_count', 'so_luong_hien_tai'),
      ('nhiem_vu_nguoi_dung', 'is_completed', 'da_hoan_thanh'),
      ('nhiem_vu_nguoi_dung', 'is_claimed', 'da_nhan'),
      ('nhiem_vu_nguoi_dung', 'last_reset_at', 'dat_lai_cuoi_luc'),

      ('hoat_dong_nguoi_dung', 'user_id', 'nguoi_dung_id'),
      ('hoat_dong_nguoi_dung', 'action_type', 'loai_hanh_dong'),
      ('hoat_dong_nguoi_dung', 'metadata', 'thong_tin_bo_sung'),
      ('hoat_dong_nguoi_dung', 'description', 'mo_ta'),

      ('tien_do_nguoi_dung', 'user_id', 'nguoi_dung_id'),
      ('tien_do_nguoi_dung', 'progress_type', 'loai_tien_do'),
      ('tien_do_nguoi_dung', 'target_id', 'doi_tuong_id'),
      ('tien_do_nguoi_dung', 'progress_payload', 'noi_dung_tien_do'),
      ('tien_do_nguoi_dung', 'unlocked_at', 'mo_khoa_luc'),

      ('ghi_chu', 'user_id', 'nguoi_dung_id'),
      ('ghi_chu', 'lesson_id', 'bai_hoc_id'),
      ('ghi_chu', 'content', 'noi_dung'),

      ('hoc_lieu', 'title', 'tieu_de'),
      ('hoc_lieu', 'description', 'mo_ta'),
      ('hoc_lieu', 'category', 'danh_muc'),
      ('hoc_lieu', 'view_count', 'luot_xem'),
      ('hoc_lieu', 'download_count', 'luot_tai'),
      ('hoc_lieu', 'created_by_user_id', 'nguoi_tao_id'),

      ('phan_hoi_hoc_lieu', 'material_id', 'hoc_lieu_id'),
      ('phan_hoi_hoc_lieu', 'user_id', 'nguoi_dung_id'),
      ('phan_hoi_hoc_lieu', 'content', 'noi_dung'),
      ('phan_hoi_hoc_lieu', 'rating', 'danh_gia'),
      ('phan_hoi_hoc_lieu', 'reply_content', 'noi_dung_tra_loi'),
      ('phan_hoi_hoc_lieu', 'reply_user_id', 'nguoi_tra_loi_id'),
      ('phan_hoi_hoc_lieu', 'reply_created_at', 'tra_loi_luc'),

      ('phan_hoi', 'user_id', 'nguoi_dung_id'),
      ('phan_hoi', 'message', 'noi_dung'),
      ('phan_hoi', 'is_approved', 'da_duyet'),
      ('phan_hoi', 'metadata', 'thong_tin_bo_sung'),

      ('bai_hoc', 'grade_level_id', 'khoi_id'),
      ('bai_hoc', 'program_id', 'chuong_trinh_id'),
      ('bai_hoc', 'title', 'tieu_de'),
      ('bai_hoc', 'chapter', 'chuong'),
      ('bai_hoc', 'order', 'thu_tu'),
      ('bai_hoc', 'description', 'mo_ta'),
      ('bai_hoc', 'theory_modules', 'module_ly_thuyet'),
      ('bai_hoc', 'video_modules', 'module_video'),
      ('bai_hoc', 'quizzes', 'cau_do'),
      ('bai_hoc', 'story_slides', 'slide_cau_chuyen'),
      ('bai_hoc', 'challenges', 'thu_thach'),
      ('bai_hoc', 'game', 'tro_choi'),
      ('bai_hoc', 'is_premium', 'tra_phi'),

      ('thao_luan', 'lesson_id', 'bai_hoc_id'),
      ('thao_luan', 'user_id', 'nguoi_dung_id'),
      ('thao_luan', 'content', 'noi_dung'),
      ('thao_luan', 'parent_id', 'cha_id'),
      ('thao_luan', 'likes', 'luot_thich'),

      ('lop', 'name', 'ten'),
      ('lop', 'grade_level_id', 'khoi_id'),
      ('lop', 'teacher_id', 'giao_vien_id'),
      ('lop', 'description', 'mo_ta'),
      ('lop', 'code', 'ma_lop'),

      ('thanh_vien_lop', 'class_id', 'lop_id'),
      ('thanh_vien_lop', 'student_id', 'hoc_sinh_id'),
      ('thanh_vien_lop', 'joined_at', 'tham_gia_luc'),

      ('bai_dang_lop', 'class_id', 'lop_id'),
      ('bai_dang_lop', 'author_id', 'tac_gia_id'),
      ('bai_dang_lop', 'content', 'noi_dung'),
      ('bai_dang_lop', 'deadline', 'han_nop'),
      ('bai_dang_lop', 'target_student_id', 'hoc_sinh_nhan_id'),
      ('bai_dang_lop', 'questions', 'cau_hoi'),

      ('lich_lop', 'class_id', 'lop_id'),
      ('lich_lop', 'title', 'tieu_de'),
      ('lich_lop', 'start_time', 'bat_dau_luc'),
      ('lich_lop', 'end_time', 'ket_thuc_luc'),

      ('bai_nop', 'post_id', 'bai_dang_id'),
      ('bai_nop', 'student_id', 'hoc_sinh_id'),
      ('bai_nop', 'score', 'diem'),
      ('bai_nop', 'teacher_feedback', 'phan_hoi_giao_vien'),
      ('bai_nop', 'submitted_at', 'nop_luc'),
      ('bai_nop', 'answers', 'cau_tra_loi'),

      ('hoa_chat', 'formula', 'cong_thuc'),
      ('hoa_chat', 'name', 'ten'),
      ('hoa_chat', 'state', 'trang_thai_vat_chat'),
      ('hoa_chat', 'color', 'mau_sac'),
      ('hoa_chat', 'category', 'danh_muc'),
      ('hoa_chat', 'is_starter', 'la_chat_khoi_dau'),

      ('phan_ung', 'name', 'ten'),
      ('phan_ung', 'equation', 'phuong_trinh'),
      ('phan_ung', 'reactants', 'chat_tham_gia'),
      ('phan_ung', 'products', 'san_pham'),
      ('phan_ung', 'grade_level_id', 'khoi_id'),
      ('phan_ung', 'category', 'danh_muc'),
      ('phan_ung', 'conditions', 'dieu_kien'),
      ('phan_ung', 'observation', 'hien_tuong'),
      ('phan_ung', 'energy', 'nang_luong'),
      ('phan_ung', 'animation', 'hieu_ung'),
      ('phan_ung', 'requires_heat', 'can_nhiet'),
      ('phan_ung', 'danger_level', 'muc_do_nguy_hiem'),
      ('phan_ung', 'safety_warning', 'canh_bao_an_toan'),

      ('cau_hoi_can', 'reactants', 'chat_tham_gia'),
      ('cau_hoi_can', 'products', 'san_pham'),
      ('cau_hoi_can', 'answer', 'dap_an'),
      ('cau_hoi_can', 'difficulty', 'do_kho'),
      ('cau_hoi_can', 'category', 'danh_muc'),
      ('cau_hoi_can', 'grade_level_id', 'khoi_id'),
      ('cau_hoi_can', 'equation_string', 'chuoi_phuong_trinh'),
      ('cau_hoi_can', 'node_id', 'nut_id'),
      ('cau_hoi_can', 'lesson_id', 'bai_hoc_id'),

      ('cau_hoi_dau', 'grade_level_id', 'khoi_id'),
      ('cau_hoi_dau', 'difficulty', 'do_kho'),
      ('cau_hoi_dau', 'question', 'cau_hoi'),
      ('cau_hoi_dau', 'options', 'lua_chon'),
      ('cau_hoi_dau', 'correct_option_index', 'chi_so_dap_an_dung'),
      ('cau_hoi_dau', 'points', 'diem'),
      ('cau_hoi_dau', 'game_type', 'loai_game'),
      ('cau_hoi_dau', 'payload', 'noi_dung_game'),
      ('cau_hoi_dau', 'answer', 'dap_an'),
      ('cau_hoi_dau', 'time_limit_seconds', 'gioi_han_giay'),
      ('cau_hoi_dau', 'explanation', 'giai_thich'),
      ('cau_hoi_dau', 'is_active', 'dang_hoat_dong'),

      ('phong_dau', 'name', 'ten'),
      ('phong_dau', 'host_id', 'chu_phong_id'),
      ('phong_dau', 'mode', 'che_do'),
      ('phong_dau', 'difficulty', 'do_kho'),
      ('phong_dau', 'max_players', 'so_nguoi_toi_da'),
      ('phong_dau', 'current_players', 'so_nguoi_hien_tai'),
      ('phong_dau', 'question_ids', 'danh_sach_cau_hoi_id'),
      ('phong_dau', 'current_round_index', 'vong_hien_tai'),
      ('phong_dau', 'round_started_at', 'vong_bat_dau_luc'),
      ('phong_dau', 'round_ends_at', 'vong_ket_thuc_luc'),
      ('phong_dau', 'started_at', 'bat_dau_luc'),
      ('phong_dau', 'finished_at', 'ket_thuc_luc'),
      ('phong_dau', 'winner_user_id', 'nguoi_thang_id'),
      ('phong_dau', 'is_practice', 'la_luyen_tap'),

      ('nguoi_choi', 'room_id', 'phong_dau_id'),
      ('nguoi_choi', 'user_id', 'nguoi_dung_id'),
      ('nguoi_choi', 'correct_count', 'so_cau_dung'),
      ('nguoi_choi', 'answered_rounds', 'vong_da_tra_loi'),
      ('nguoi_choi', 'joined_at', 'tham_gia_luc'),
      ('nguoi_choi', 'last_seen_at', 'xem_cuoi_luc'),

      ('tra_loi_vong', 'room_id', 'phong_dau_id'),
      ('tra_loi_vong', 'question_id', 'cau_hoi_id'),
      ('tra_loi_vong', 'user_id', 'nguoi_dung_id'),
      ('tra_loi_vong', 'round_index', 'thu_tu_vong'),
      ('tra_loi_vong', 'answer_payload', 'noi_dung_tra_loi'),
      ('tra_loi_vong', 'is_correct', 'dung'),
      ('tra_loi_vong', 'score_awarded', 'diem_duoc_cong'),
      ('tra_loi_vong', 'submitted_at', 'nop_luc'),

      ('lich_su_dau', 'user_id', 'nguoi_dung_id'),
      ('lich_su_dau', 'room_id', 'phong_dau_id'),
      ('lich_su_dau', 'opponent_name', 'ten_doi_thu'),
      ('lich_su_dau', 'result', 'ket_qua'),
      ('lich_su_dau', 'score', 'diem'),
      ('lich_su_dau', 'points_delta', 'diem_thay_doi'),
      ('lich_su_dau', 'played_at', 'dau_luc')
    ) AS mapping(table_name, old_name, new_name)
  LOOP
    IF to_regclass('public.' || quote_ident(item.table_name)) IS NOT NULL
       AND EXISTS (
         SELECT 1
         FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = item.table_name
           AND column_name = item.old_name
       )
       AND NOT EXISTS (
         SELECT 1
         FROM information_schema.columns
         WHERE table_schema = 'public'
           AND table_name = item.table_name
           AND column_name = item.new_name
       ) THEN
      EXECUTE format('ALTER TABLE public.%I RENAME COLUMN %I TO %I', item.table_name, item.old_name, item.new_name);
    END IF;
  END LOOP;
END $$;

DO $$
DECLARE
  item record;
  next_name text;
BEGIN
  FOR item IN
    SELECT con.oid, con.conname, rel.relname AS table_name
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace n ON n.oid = rel.relnamespace
    WHERE n.nspname = 'public'
  LOOP
    next_name := item.conname;
    next_name := replace(next_name, 'class_assignment_submissions', 'bai_nop');
    next_name := replace(next_name, 'arena_round_answers', 'tra_loi_vong');
    next_name := replace(next_name, 'arena_room_players', 'nguoi_choi');
    next_name := replace(next_name, 'arena_match_history', 'lich_su_dau');
    next_name := replace(next_name, 'balancing_questions', 'cau_hoi_can');
    next_name := replace(next_name, 'lesson_discussions', 'thao_luan');
    next_name := replace(next_name, 'material_feedback', 'phan_hoi_hoc_lieu');
    next_name := replace(next_name, 'arena_questions', 'cau_hoi_dau');
    next_name := replace(next_name, 'lab_chemicals', 'hoa_chat');
    next_name := replace(next_name, 'lab_reactions', 'phan_ung');
    next_name := replace(next_name, 'class_schedules', 'lich_lop');
    next_name := replace(next_name, 'class_members', 'thanh_vien_lop');
    next_name := replace(next_name, 'class_posts', 'bai_dang_lop');
    next_name := replace(next_name, 'grade_levels', 'khoi');
    next_name := replace(next_name, 'user_activities', 'hoat_dong_nguoi_dung');
    next_name := replace(next_name, 'user_missions', 'nhiem_vu_nguoi_dung');
    next_name := replace(next_name, 'user_progress', 'tien_do_nguoi_dung');
    next_name := replace(next_name, 'user_notes', 'ghi_chu');
    next_name := replace(next_name, 'arena_rooms', 'phong_dau');
    next_name := replace(next_name, 'classes', 'lop');
    next_name := replace(next_name, 'materials', 'hoc_lieu');
    next_name := replace(next_name, 'missions', 'nhiem_vu');
    next_name := replace(next_name, 'feedback', 'phan_hoi');
    next_name := replace(next_name, 'lessons', 'bai_hoc');
    next_name := replace(next_name, 'lesson', 'bai_hoc');
    next_name := replace(next_name, 'users', 'nguoi_dung');
    next_name := replace(next_name, 'grade_level_id', 'khoi_id');
    next_name := replace(next_name, 'created_by_user_id', 'nguoi_tao_id');
    next_name := replace(next_name, 'target_student_id', 'hoc_sinh_nhan_id');
    next_name := replace(next_name, 'student_id', 'hoc_sinh_id');
    next_name := replace(next_name, 'teacher_id', 'giao_vien_id');
    next_name := replace(next_name, 'author_id', 'tac_gia_id');
    next_name := replace(next_name, 'host_id', 'chu_phong_id');
    next_name := replace(next_name, 'winner_user_id', 'nguoi_thang_id');
    next_name := replace(next_name, 'question_id', 'cau_hoi_id');
    next_name := replace(next_name, 'room_id', 'phong_dau_id');
    next_name := replace(next_name, 'class_id', 'lop_id');
    next_name := replace(next_name, 'post_id', 'bai_dang_id');
    next_name := replace(next_name, 'mission_id', 'nhiem_vu_id');
    next_name := replace(next_name, 'material_id', 'hoc_lieu_id');
    next_name := replace(next_name, 'user_id', 'nguoi_dung_id');
    next_name := replace(next_name, 'correct_option_index', 'chi_so_dap_an_dung');
    next_name := replace(next_name, 'time_limit_seconds', 'gioi_han_giay');
    next_name := replace(next_name, 'time_limit', 'gioi_han');
    next_name := replace(next_name, 'game_type', 'loai_game');
    next_name := replace(next_name, 'progress_type', 'loai_tien_do');
    next_name := replace(next_name, 'parent_id', 'cha_id');
    next_name := replace(next_name, 'round_index', 'thu_tu_vong');
    next_name := replace(next_name, 'difficulty', 'do_kho');
    next_name := replace(next_name, 'formula', 'cong_thuc');
    next_name := replace(next_name, 'category', 'danh_muc');
    next_name := replace(next_name, 'rating', 'danh_gia');
    next_name := replace(next_name, 'result', 'ket_qua');
    next_name := replace(next_name, 'active', 'dang_hoat_dong');
    next_name := replace(next_name, 'state', 'trang_thai_vat_chat');
    next_name := replace(next_name, 'code', 'ma_lop');
    next_name := replace(next_name, 'type', 'type');
    IF length(next_name) > 60 THEN
      next_name := left(next_name, 52) || '_' || substr(md5(next_name), 1, 7);
    END IF;

    IF next_name <> item.conname
       AND NOT EXISTS (
         SELECT 1
         FROM pg_constraint
         WHERE connamespace = 'public'::regnamespace
           AND conname = next_name
       ) THEN
      EXECUTE format('ALTER TABLE public.%I RENAME CONSTRAINT %I TO %I', item.table_name, item.conname, next_name);
    END IF;
  END LOOP;
END $$;

DO $$
DECLARE
  item record;
  next_name text;
BEGIN
  FOR item IN
    SELECT i.relname AS index_name
    FROM pg_class i
    JOIN pg_namespace n ON n.oid = i.relnamespace
    WHERE n.nspname = 'public'
      AND i.relkind = 'i'
  LOOP
    next_name := item.index_name;
    next_name := replace(next_name, 'class_assignment_submissions', 'bai_nop');
    next_name := replace(next_name, 'arena_round_answers', 'tra_loi_vong');
    next_name := replace(next_name, 'arena_room_players', 'nguoi_choi');
    next_name := replace(next_name, 'arena_match_history', 'lich_su_dau');
    next_name := replace(next_name, 'balancing_questions', 'cau_hoi_can');
    next_name := replace(next_name, 'lesson_discussions', 'thao_luan');
    next_name := replace(next_name, 'material_feedback', 'phan_hoi_hoc_lieu');
    next_name := replace(next_name, 'arena_questions', 'cau_hoi_dau');
    next_name := replace(next_name, 'lab_chemicals', 'hoa_chat');
    next_name := replace(next_name, 'lab_reactions', 'phan_ung');
    next_name := replace(next_name, 'class_schedules', 'lich_lop');
    next_name := replace(next_name, 'class_members', 'thanh_vien_lop');
    next_name := replace(next_name, 'class_posts', 'bai_dang_lop');
    next_name := replace(next_name, 'grade_levels', 'khoi');
    next_name := replace(next_name, 'user_activities', 'hoat_dong_nguoi_dung');
    next_name := replace(next_name, 'user_missions', 'nhiem_vu_nguoi_dung');
    next_name := replace(next_name, 'user_progress', 'tien_do_nguoi_dung');
    next_name := replace(next_name, 'user_notes', 'ghi_chu');
    next_name := replace(next_name, 'arena_rooms', 'phong_dau');
    next_name := replace(next_name, 'classes', 'lop');
    next_name := replace(next_name, 'materials', 'hoc_lieu');
    next_name := replace(next_name, 'missions', 'nhiem_vu');
    next_name := replace(next_name, 'feedback', 'phan_hoi');
    next_name := replace(next_name, 'lessons', 'bai_hoc');
    next_name := replace(next_name, 'lesson', 'bai_hoc');
    next_name := replace(next_name, 'users', 'nguoi_dung');
    next_name := replace(next_name, 'grade_level_id', 'khoi_id');
    next_name := replace(next_name, 'created_by_user_id', 'nguoi_tao_id');
    next_name := replace(next_name, 'target_student_id', 'hoc_sinh_nhan_id');
    next_name := replace(next_name, 'student_id', 'hoc_sinh_id');
    next_name := replace(next_name, 'teacher_id', 'giao_vien_id');
    next_name := replace(next_name, 'author_id', 'tac_gia_id');
    next_name := replace(next_name, 'host_id', 'chu_phong_id');
    next_name := replace(next_name, 'winner_user_id', 'nguoi_thang_id');
    next_name := replace(next_name, 'question_id', 'cau_hoi_id');
    next_name := replace(next_name, 'room_id', 'phong_dau_id');
    next_name := replace(next_name, 'class_id', 'lop_id');
    next_name := replace(next_name, 'post_id', 'bai_dang_id');
    next_name := replace(next_name, 'mission_id', 'nhiem_vu_id');
    next_name := replace(next_name, 'material_id', 'hoc_lieu_id');
    next_name := replace(next_name, 'user_id', 'nguoi_dung_id');
    next_name := replace(next_name, 'correct_option_index', 'chi_so_dap_an_dung');
    next_name := replace(next_name, 'time_limit_seconds', 'gioi_han_giay');
    next_name := replace(next_name, 'time_limit', 'gioi_han');
    next_name := replace(next_name, 'game_type', 'loai_game');
    next_name := replace(next_name, 'progress_type', 'loai_tien_do');
    next_name := replace(next_name, 'parent_id', 'cha_id');
    next_name := replace(next_name, 'round_index', 'thu_tu_vong');
    next_name := replace(next_name, 'difficulty', 'do_kho');
    next_name := replace(next_name, 'formula', 'cong_thuc');
    next_name := replace(next_name, 'category', 'danh_muc');
    next_name := replace(next_name, 'rating', 'danh_gia');
    next_name := replace(next_name, 'result', 'ket_qua');
    next_name := replace(next_name, 'active', 'dang_hoat_dong');
    next_name := replace(next_name, 'state', 'trang_thai_vat_chat');
    next_name := replace(next_name, 'code', 'ma_lop');
    next_name := replace(next_name, 'played_at', 'dau_luc');
    next_name := replace(next_name, 'created_at', 'created_at');
    IF length(next_name) > 60 THEN
      next_name := left(next_name, 52) || '_' || substr(md5(next_name), 1, 7);
    END IF;

    IF next_name <> item.index_name
       AND to_regclass('public.' || quote_ident(next_name)) IS NULL THEN
      EXECUTE format('ALTER INDEX public.%I RENAME TO %I', item.index_name, next_name);
    END IF;
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.claim_mission_reward(p_user_id text, p_mission_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  reward integer;
  total_xp integer;
  next_level integer;
BEGIN
  WITH claimed AS (
    UPDATE public.nhiem_vu_nguoi_dung um
    SET da_nhan = true,
        updated_at = now()
    FROM public.nhiem_vu m
    WHERE um.nguoi_dung_id = p_user_id
      AND um.nhiem_vu_id = p_mission_id
      AND um.nhiem_vu_id = m.id
      AND um.da_hoan_thanh = true
      AND COALESCE(um.da_nhan, false) = false
    RETURNING COALESCE(m.thuong_xp, 0) AS xp_reward
  )
  SELECT xp_reward INTO reward FROM claimed;

  IF reward IS NULL THEN
    RETURN NULL;
  END IF;

  UPDATE public.nguoi_dung
  SET diem_kinh_nghiem = COALESCE(diem_kinh_nghiem, 0) + reward,
      cap_do = floor(((COALESCE(diem_kinh_nghiem, 0) + reward)::numeric) / 1000)::integer + 1,
      updated_at = now()
  WHERE id = p_user_id
  RETURNING diem_kinh_nghiem, cap_do INTO total_xp, next_level;

  RETURN jsonb_build_object(
    'xpGained', reward,
    'totalXP', total_xp,
    'newLevel', next_level
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_likes(row_id uuid)
RETURNS public.thao_luan
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  updated_comment public.thao_luan;
BEGIN
  UPDATE public.thao_luan
  SET luot_thich = COALESCE(luot_thich, 0) + 1
  WHERE id = row_id
  RETURNING * INTO updated_comment;

  RETURN updated_comment;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_material_view(material_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  next_count integer;
BEGIN
  UPDATE public.hoc_lieu
  SET luot_xem = COALESCE(luot_xem, 0) + 1
  WHERE id = $1
  RETURNING luot_xem INTO next_count;

  RETURN COALESCE(next_count, 0);
END;
$function$;

CREATE OR REPLACE FUNCTION public.join_arena_room(p_room_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  joined_room jsonb;
BEGIN
  UPDATE public.phong_dau
  SET so_nguoi_hien_tai = COALESCE(so_nguoi_hien_tai, 0) + 1
  WHERE id = p_room_id
    AND status = 'waiting'
    AND COALESCE(so_nguoi_hien_tai, 0) < COALESCE(so_nguoi_toi_da, 2)
  RETURNING to_jsonb(public.phong_dau.*) INTO joined_room;

  RETURN joined_room;
END;
$function$;

NOTIFY pgrst, 'reload schema';

COMMIT;

-- Rollback thủ công nếu cần:
-- 1. Đảm bảo ứng dụng đã quay lại version code cũ.
-- 2. Chạy migration ngược dùng chính mapping ở trên theo thứ tự đảo:
--    đổi cột new_name -> old_name, đổi bảng new_name -> old_name, rồi recreate RPC body cũ.
-- 3. Nếu cần đối chiếu dữ liệu, dùng snapshot tạo bởi `npm run db:backup` trước migration.
