-- AURUM Supabase schema - latest consolidated version
-- Generated on 2026-06-04.
--
-- This file is the single source of truth for the current public schema.
-- It creates the Vietnamese snake_case business schema used by the runtime.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- ---------------------------------------------------------------------------
-- Legacy object cleanup. These objects are not used by the current runtime.
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS public.sys_ai_cache CASCADE;
DROP TABLE IF EXISTS public.sys_ai_knowledge CASCADE;
DROP TABLE IF EXISTS public.ai_cache CASCADE;
DROP TABLE IF EXISTS public.ai_knowledge_base CASCADE;
DROP TABLE IF EXISTS public.content_material_feedback CASCADE;
DROP TABLE IF EXISTS public.content_lesson_discussions CASCADE;
DROP TABLE IF EXISTS public.content_reaction_ingredients CASCADE;
DROP TABLE IF EXISTS public.content_balancing_questions CASCADE;
DROP TABLE IF EXISTS public.content_materials CASCADE;
DROP TABLE IF EXISTS public.content_reactions CASCADE;
DROP TABLE IF EXISTS public.content_chemicals CASCADE;
DROP TABLE IF EXISTS public.content_lessons CASCADE;
DROP TABLE IF EXISTS public.content_grade_levels CASCADE;
DROP TABLE IF EXISTS public.edu_submissions CASCADE;
DROP TABLE IF EXISTS public.edu_schedules CASCADE;
DROP TABLE IF EXISTS public.edu_posts CASCADE;
DROP TABLE IF EXISTS public.edu_class_members CASCADE;
DROP TABLE IF EXISTS public.edu_classes CASCADE;
DROP TABLE IF EXISTS public.sys_feedback CASCADE;
DROP TABLE IF EXISTS public.user_stats CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.periodic_elements CASCADE;
DROP TABLE IF EXISTS public.reaction_ingredients CASCADE;
DROP TABLE IF EXISTS public.user_unlocked_lessons CASCADE;
DROP TABLE IF EXISTS public.user_unlocked_chemicals CASCADE;
DROP TABLE IF EXISTS public.user_devices CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;

DROP FUNCTION IF EXISTS public.match_ai_knowledge CASCADE;
DROP FUNCTION IF EXISTS public.set_user_devices_updated_at CASCADE;

-- ---------------------------------------------------------------------------
-- Rename old English business tables when this script is applied to a legacy DB.
-- Fresh installs skip this block.
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- Rename old English business columns when present.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  item record;
BEGIN
  FOR item IN
    SELECT *
    FROM (VALUES
      ('nguoi_dung', 'password', 'password_hash'),
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
      ('tien_do_nguoi_dung', 'item_type', 'loai_tien_do'),
      ('tien_do_nguoi_dung', 'progress_type', 'loai_tien_do'),
      ('tien_do_nguoi_dung', 'item_id', 'doi_tuong_id'),
      ('tien_do_nguoi_dung', 'target_id', 'doi_tuong_id'),
      ('tien_do_nguoi_dung', 'progress_data', 'noi_dung_tien_do'),
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
      ('hoc_lieu', 'author_id', 'nguoi_tao_id'),
      ('hoc_lieu', 'created_by', 'nguoi_tao_id'),
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
      ('bai_hoc', 'class_id', 'khoi_id'),
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
      ('lop', 'grade_level', 'khoi_id'),
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
      ('bai_nop', 'feedback', 'phan_hoi_giao_vien'),
      ('bai_nop', 'teacher_feedback', 'phan_hoi_giao_vien'),
      ('bai_nop', 'submitted_at', 'nop_luc'),
      ('bai_nop', 'answers', 'cau_tra_loi'),
      ('hoa_chat', 'formula', 'cong_thuc'),
      ('hoa_chat', 'name', 'ten'),
      ('hoa_chat', 'state', 'trang_thai_vat_chat'),
      ('hoa_chat', 'color', 'mau_sac'),
      ('hoa_chat', 'type', 'danh_muc'),
      ('hoa_chat', 'category', 'danh_muc'),
      ('hoa_chat', 'is_starter', 'la_chat_khoi_dau'),
      ('phan_ung', 'name', 'ten'),
      ('phan_ung', 'equation', 'phuong_trinh'),
      ('phan_ung', 'reactants', 'chat_tham_gia'),
      ('phan_ung', 'products', 'san_pham'),
      ('phan_ung', 'grade_level', 'khoi_id'),
      ('phan_ung', 'grade_level_id', 'khoi_id'),
      ('phan_ung', 'category', 'danh_muc'),
      ('phan_ung', 'conditions', 'dieu_kien'),
      ('phan_ung', 'observation', 'hien_tuong'),
      ('phan_ung', 'energy', 'nang_luong'),
      ('phan_ung', 'animation', 'hieu_ung'),
      ('phan_ung', 'requires_heat', 'can_nhiet'),
      ('phan_ung', 'danger_level', 'muc_do_nguy_hiem'),
      ('phan_ung', 'safety_warning', 'canh_bao_an_toan'),
      ('cau_hoi_dau', 'grade_level', 'khoi_id'),
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
      ('lich_su_dau', 'pts_change', 'diem_thay_doi'),
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

-- ---------------------------------------------------------------------------
-- Current runtime tables.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.nguoi_dung (
  id text PRIMARY KEY,
  username text NOT NULL UNIQUE,
  email text UNIQUE,
  password_hash text,
  role text NOT NULL DEFAULT 'student',
  diem_kinh_nghiem integer NOT NULL DEFAULT 0,
  cap_do integer NOT NULL DEFAULT 1,
  avatar_seed text,
  thong_ke_dau jsonb NOT NULL DEFAULT '{"total":0,"wins":0,"losses":0,"points":0}'::jsonb,
  phut_hoat_dong integer NOT NULL DEFAULT 0,
  hoat_dong_cuoi_luc timestamp with time zone NOT NULL DEFAULT now(),
  bi_khoa boolean NOT NULL DEFAULT false,
  so_ngay_chuoi integer NOT NULL DEFAULT 0,
  chuoi_cuoi_luc timestamp with time zone,
  phut_online_hom_nay integer NOT NULL DEFAULT 0,
  da_hoan_thanh_bai_hom_nay boolean NOT NULL DEFAULT false,
  current_session_id text,
  tai_khoan_lien_ket jsonb NOT NULL DEFAULT '{}'::jsonb,
  ke_hoach_hoc jsonb NOT NULL DEFAULT '{"emailEnabled":false,"dailyLessonTarget":1,"completed":false}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT nguoi_dung_role_check CHECK (role IN ('student', 'teacher', 'admin'))
);

CREATE TABLE IF NOT EXISTS public.khoi (
  id integer PRIMARY KEY,
  ten text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.bai_hoc (
  id text PRIMARY KEY,
  khoi_id integer NOT NULL REFERENCES public.khoi(id) ON DELETE CASCADE,
  chuong_trinh_id text NOT NULL DEFAULT 'ketnoi',
  tieu_de text NOT NULL,
  chuong text,
  thu_tu integer,
  mo_ta text,
  module_ly_thuyet jsonb NOT NULL DEFAULT '[]'::jsonb,
  module_video jsonb NOT NULL DEFAULT '[]'::jsonb,
  cau_do jsonb NOT NULL DEFAULT '[]'::jsonb,
  slide_cau_chuyen jsonb NOT NULL DEFAULT '[]'::jsonb,
  thu_thach jsonb NOT NULL DEFAULT '[]'::jsonb,
  tro_choi jsonb NOT NULL DEFAULT '{}'::jsonb,
  intro_video_url text,
  tra_phi boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tien_do_nguoi_dung (
  nguoi_dung_id text NOT NULL REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  loai_tien_do text NOT NULL,
  doi_tuong_id text NOT NULL,
  noi_dung_tien_do jsonb NOT NULL DEFAULT '{}'::jsonb,
  mo_khoa_luc timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (nguoi_dung_id, loai_tien_do, doi_tuong_id),
  CONSTRAINT tien_do_nguoi_dung_loai_tien_do_check
    CHECK (loai_tien_do IN ('lesson', 'chemical', 'achievement', 'balancing'))
);

CREATE TABLE IF NOT EXISTS public.phan_hoi (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nguoi_dung_id text REFERENCES public.nguoi_dung(id) ON DELETE SET NULL,
  username text,
  noi_dung text NOT NULL,
  type text NOT NULL DEFAULT 'suggestion',
  status text NOT NULL DEFAULT 'unread',
  image_url text,
  da_duyet boolean NOT NULL DEFAULT false,
  thong_tin_bo_sung jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT phan_hoi_type_check CHECK (type IN ('bug', 'suggestion', 'praise', 'other', 'teacher_registration')),
  CONSTRAINT phan_hoi_status_check CHECK (status IN ('unread', 'resolved', 'rejected'))
);

CREATE TABLE IF NOT EXISTS public.yeu_cau_duyet_admin (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action_key text NOT NULL,
  action_label text NOT NULL,
  request_hash text NOT NULL,
  requested_by text REFERENCES public.nguoi_dung(id) ON DELETE SET NULL,
  approver_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  result jsonb NOT NULL DEFAULT '{}'::jsonb,
  error text,
  executed_by text REFERENCES public.nguoi_dung(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  executed_at timestamp with time zone,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  CONSTRAINT yeu_cau_duyet_admin_approver_ids_check CHECK (jsonb_typeof(approver_ids) = 'array'),
  CONSTRAINT yeu_cau_duyet_admin_status_check CHECK (status IN ('pending', 'executed', 'rejected', 'failed'))
);

CREATE TABLE IF NOT EXISTS public.hoa_chat (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cong_thuc text NOT NULL UNIQUE,
  ten text NOT NULL,
  trang_thai_vat_chat text,
  mau_sac text,
  danh_muc text,
  la_chat_khoi_dau boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT hoa_chat_trang_thai_vat_chat_check
    CHECK (trang_thai_vat_chat IS NULL OR trang_thai_vat_chat IN ('solid', 'liquid', 'gas'))
);

CREATE TABLE IF NOT EXISTS public.phan_ung (
  id text PRIMARY KEY,
  ten text NOT NULL,
  type text,
  phuong_trinh text NOT NULL,
  chat_tham_gia jsonb NOT NULL,
  san_pham jsonb NOT NULL,
  khoi_id integer REFERENCES public.khoi(id) ON DELETE CASCADE,
  danh_muc text,
  dieu_kien text,
  hien_tuong text,
  nang_luong numeric,
  hieu_ung text,
  can_nhiet boolean NOT NULL DEFAULT false,
  muc_do_nguy_hiem integer NOT NULL DEFAULT 0,
  canh_bao_an_toan text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cau_hoi_dau (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  khoi_id integer NOT NULL DEFAULT 8 REFERENCES public.khoi(id) ON DELETE CASCADE,
  do_kho text NOT NULL DEFAULT 'easy',
  cau_hoi text NOT NULL,
  lua_chon jsonb NOT NULL DEFAULT '[]'::jsonb,
  chi_so_dap_an_dung integer,
  diem integer NOT NULL DEFAULT 10,
  loai_game text NOT NULL DEFAULT 'calculation',
  noi_dung_game jsonb NOT NULL DEFAULT '{}'::jsonb,
  dap_an jsonb NOT NULL DEFAULT '{}'::jsonb,
  gioi_han_giay integer NOT NULL DEFAULT 45,
  giai_thich text,
  dang_hoat_dong boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT cau_hoi_dau_do_kho_check CHECK (do_kho IN ('easy', 'medium', 'hard', 'super', 'auto')),
  CONSTRAINT cau_hoi_dau_chi_so_dap_an_dung_check
    CHECK (chi_so_dap_an_dung IS NULL OR (chi_so_dap_an_dung >= 0 AND chi_so_dap_an_dung <= 3)),
  CONSTRAINT cau_hoi_dau_loai_game_check
    CHECK (loai_game IN ('calculation', 'balancing', 'atom_match', 'electron_match')),
  CONSTRAINT cau_hoi_dau_gioi_han_giay_check CHECK (gioi_han_giay BETWEEN 10 AND 180)
);

CREATE TABLE IF NOT EXISTS public.phong_dau (
  id text PRIMARY KEY,
  ten text NOT NULL,
  chu_phong_id text REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  che_do text NOT NULL DEFAULT 'solo',
  do_kho text NOT NULL DEFAULT 'auto',
  status text NOT NULL DEFAULT 'waiting',
  so_nguoi_toi_da integer NOT NULL DEFAULT 2,
  so_nguoi_hien_tai integer NOT NULL DEFAULT 1,
  danh_sach_cau_hoi_id uuid[] NOT NULL DEFAULT ARRAY[]::uuid[],
  vong_hien_tai integer NOT NULL DEFAULT 0,
  vong_bat_dau_luc timestamp with time zone,
  vong_ket_thuc_luc timestamp with time zone,
  bat_dau_luc timestamp with time zone,
  ket_thuc_luc timestamp with time zone,
  nguoi_thang_id text REFERENCES public.nguoi_dung(id) ON DELETE SET NULL,
  la_luyen_tap boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT phong_dau_status_check CHECK (status IN ('waiting', 'playing', 'finished'))
);

CREATE TABLE IF NOT EXISTS public.nguoi_choi (
  phong_dau_id text NOT NULL REFERENCES public.phong_dau(id) ON DELETE CASCADE,
  nguoi_dung_id text NOT NULL REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  username text NOT NULL,
  avatar_seed text,
  score integer NOT NULL DEFAULT 0,
  so_cau_dung integer NOT NULL DEFAULT 0,
  vong_da_tra_loi integer[] NOT NULL DEFAULT ARRAY[]::integer[],
  status text NOT NULL DEFAULT 'joined',
  tham_gia_luc timestamp with time zone NOT NULL DEFAULT now(),
  xem_cuoi_luc timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (phong_dau_id, nguoi_dung_id),
  CONSTRAINT nguoi_choi_status_check CHECK (status IN ('joined', 'ready', 'playing', 'finished', 'left'))
);

CREATE TABLE IF NOT EXISTS public.tra_loi_vong (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phong_dau_id text NOT NULL REFERENCES public.phong_dau(id) ON DELETE CASCADE,
  cau_hoi_id uuid NOT NULL REFERENCES public.cau_hoi_dau(id) ON DELETE CASCADE,
  nguoi_dung_id text NOT NULL REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  thu_tu_vong integer NOT NULL,
  noi_dung_tra_loi jsonb NOT NULL DEFAULT '{}'::jsonb,
  dung boolean NOT NULL DEFAULT false,
  diem_duoc_cong integer NOT NULL DEFAULT 0,
  nop_luc timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tra_loi_vong_phong_nguoi_vong_unique UNIQUE (phong_dau_id, nguoi_dung_id, thu_tu_vong)
);

CREATE TABLE IF NOT EXISTS public.lich_su_dau (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nguoi_dung_id text REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  phong_dau_id text,
  ten_doi_thu text,
  ket_qua text,
  diem integer NOT NULL DEFAULT 0,
  diem_thay_doi integer NOT NULL DEFAULT 0,
  dau_luc timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT lich_su_dau_ket_qua_check CHECK (ket_qua IS NULL OR ket_qua IN ('win', 'lose', 'draw'))
);

CREATE TABLE IF NOT EXISTS public.lop (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ten text NOT NULL,
  khoi_id integer NOT NULL REFERENCES public.khoi(id) ON DELETE CASCADE,
  giao_vien_id text REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  mo_ta text,
  ma_lop text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.thanh_vien_lop (
  lop_id uuid NOT NULL REFERENCES public.lop(id) ON DELETE CASCADE,
  hoc_sinh_id text NOT NULL REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  tham_gia_luc timestamp with time zone NOT NULL DEFAULT now(),
  PRIMARY KEY (lop_id, hoc_sinh_id)
);

CREATE TABLE IF NOT EXISTS public.bai_dang_lop (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lop_id uuid REFERENCES public.lop(id) ON DELETE CASCADE,
  tac_gia_id text REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'announcement',
  noi_dung text NOT NULL,
  media_url text,
  han_nop timestamp with time zone,
  hoc_sinh_nhan_id text REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  cau_hoi jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT bai_dang_lop_type_check CHECK (type IN ('announcement', 'assignment', 'video'))
);

CREATE TABLE IF NOT EXISTS public.bai_nop (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bai_dang_id uuid REFERENCES public.bai_dang_lop(id) ON DELETE CASCADE,
  hoc_sinh_id text REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'submitted',
  diem numeric,
  phan_hoi_giao_vien text,
  cau_tra_loi jsonb NOT NULL DEFAULT '[]'::jsonb,
  nop_luc timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT bai_nop_status_check CHECK (status IN ('submitted', 'graded')),
  CONSTRAINT bai_nop_bai_dang_hoc_sinh_unique UNIQUE (bai_dang_id, hoc_sinh_id)
);

CREATE TABLE IF NOT EXISTS public.lich_lop (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lop_id uuid REFERENCES public.lop(id) ON DELETE CASCADE,
  tieu_de text NOT NULL,
  bat_dau_luc timestamp with time zone NOT NULL,
  ket_thuc_luc timestamp with time zone,
  meet_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.hoc_lieu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tieu_de text NOT NULL,
  mo_ta text,
  file_url text NOT NULL,
  file_type text,
  danh_muc text,
  nguoi_tao_id text REFERENCES public.nguoi_dung(id) ON DELETE SET NULL,
  luot_xem integer NOT NULL DEFAULT 0,
  luot_tai integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.phan_hoi_hoc_lieu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hoc_lieu_id uuid REFERENCES public.hoc_lieu(id) ON DELETE CASCADE,
  nguoi_dung_id text REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  noi_dung text NOT NULL,
  danh_gia integer,
  noi_dung_tra_loi text,
  nguoi_tra_loi_id text REFERENCES public.nguoi_dung(id) ON DELETE SET NULL,
  tra_loi_luc timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT phan_hoi_hoc_lieu_danh_gia_check CHECK (danh_gia IS NULL OR (danh_gia >= 1 AND danh_gia <= 5))
);

CREATE TABLE IF NOT EXISTS public.nhiem_vu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tieu_de text NOT NULL,
  mo_ta text,
  loai_hanh_dong text NOT NULL,
  so_luong_muc_tieu integer NOT NULL DEFAULT 1,
  thuong_xp integer NOT NULL DEFAULT 50,
  type text NOT NULL DEFAULT 'daily',
  bieu_tuong text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT nhiem_vu_type_check CHECK (type IN ('daily', 'achievement', 'story'))
);

CREATE TABLE IF NOT EXISTS public.nhiem_vu_nguoi_dung (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nguoi_dung_id text REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  nhiem_vu_id uuid REFERENCES public.nhiem_vu(id) ON DELETE CASCADE,
  so_luong_hien_tai integer NOT NULL DEFAULT 0,
  da_hoan_thanh boolean NOT NULL DEFAULT false,
  da_nhan boolean NOT NULL DEFAULT false,
  dat_lai_cuoi_luc timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT nhiem_vu_nguoi_dung_unique UNIQUE (nguoi_dung_id, nhiem_vu_id)
);

CREATE TABLE IF NOT EXISTS public.thao_luan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bai_hoc_id text NOT NULL,
  nguoi_dung_id text REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  noi_dung text NOT NULL,
  cha_id uuid REFERENCES public.thao_luan(id) ON DELETE CASCADE,
  luot_thich integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ghi_chu (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nguoi_dung_id text REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  bai_hoc_id text NOT NULL,
  noi_dung text NOT NULL,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ghi_chu_nguoi_dung_bai_hoc_unique UNIQUE (nguoi_dung_id, bai_hoc_id)
);

CREATE TABLE IF NOT EXISTS public.hoat_dong_nguoi_dung (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nguoi_dung_id text REFERENCES public.nguoi_dung(id) ON DELETE CASCADE,
  loai_hanh_dong text,
  mo_ta text,
  thong_tin_bo_sung jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Ensure newer columns exist when this file is applied to an older database
-- whose tables were renamed instead of freshly created.
ALTER TABLE public.nguoi_dung
  ADD COLUMN IF NOT EXISTS password_hash text,
  ADD COLUMN IF NOT EXISTS diem_kinh_nghiem integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS cap_do integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS avatar_seed text,
  ADD COLUMN IF NOT EXISTS thong_ke_dau jsonb DEFAULT '{"total":0,"wins":0,"losses":0,"points":0}'::jsonb,
  ADD COLUMN IF NOT EXISTS phut_hoat_dong integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS hoat_dong_cuoi_luc timestamp with time zone DEFAULT now(),
  ADD COLUMN IF NOT EXISTS bi_khoa boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS so_ngay_chuoi integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS chuoi_cuoi_luc timestamp with time zone,
  ADD COLUMN IF NOT EXISTS phut_online_hom_nay integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS da_hoan_thanh_bai_hom_nay boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS current_session_id text,
  ADD COLUMN IF NOT EXISTS tai_khoan_lien_ket jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS ke_hoach_hoc jsonb DEFAULT '{"emailEnabled":false,"dailyLessonTarget":1,"completed":false}'::jsonb;

ALTER TABLE public.bai_hoc
  ADD COLUMN IF NOT EXISTS chuong_trinh_id text DEFAULT 'ketnoi',
  ADD COLUMN IF NOT EXISTS chuong text,
  ADD COLUMN IF NOT EXISTS thu_tu integer,
  ADD COLUMN IF NOT EXISTS mo_ta text,
  ADD COLUMN IF NOT EXISTS module_ly_thuyet jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS module_video jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS cau_do jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS slide_cau_chuyen jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS thu_thach jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tro_choi jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS intro_video_url text,
  ADD COLUMN IF NOT EXISTS tra_phi boolean DEFAULT false;

ALTER TABLE public.phan_hoi
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS da_duyet boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS thong_tin_bo_sung jsonb DEFAULT '{}'::jsonb;

ALTER TABLE public.hoc_lieu
  ADD COLUMN IF NOT EXISTS file_type text,
  ADD COLUMN IF NOT EXISTS danh_muc text,
  ADD COLUMN IF NOT EXISTS nguoi_tao_id text,
  ADD COLUMN IF NOT EXISTS luot_xem integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS luot_tai integer DEFAULT 0;

ALTER TABLE public.phan_hoi_hoc_lieu
  ADD COLUMN IF NOT EXISTS danh_gia integer,
  ADD COLUMN IF NOT EXISTS noi_dung_tra_loi text,
  ADD COLUMN IF NOT EXISTS nguoi_tra_loi_id text,
  ADD COLUMN IF NOT EXISTS tra_loi_luc timestamp with time zone;

ALTER TABLE public.bai_nop
  ADD COLUMN IF NOT EXISTS phan_hoi_giao_vien text,
  ADD COLUMN IF NOT EXISTS cau_tra_loi jsonb DEFAULT '[]'::jsonb;

ALTER TABLE public.cau_hoi_dau
  ADD COLUMN IF NOT EXISTS loai_game text DEFAULT 'calculation',
  ADD COLUMN IF NOT EXISTS noi_dung_game jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS dap_an jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS gioi_han_giay integer DEFAULT 45,
  ADD COLUMN IF NOT EXISTS giai_thich text,
  ADD COLUMN IF NOT EXISTS dang_hoat_dong boolean DEFAULT true;

ALTER TABLE public.cau_hoi_dau
  ALTER COLUMN chi_so_dap_an_dung DROP NOT NULL;

ALTER TABLE public.phong_dau
  ADD COLUMN IF NOT EXISTS danh_sach_cau_hoi_id uuid[] DEFAULT ARRAY[]::uuid[],
  ADD COLUMN IF NOT EXISTS vong_hien_tai integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vong_bat_dau_luc timestamp with time zone,
  ADD COLUMN IF NOT EXISTS vong_ket_thuc_luc timestamp with time zone,
  ADD COLUMN IF NOT EXISTS bat_dau_luc timestamp with time zone,
  ADD COLUMN IF NOT EXISTS ket_thuc_luc timestamp with time zone,
  ADD COLUMN IF NOT EXISTS nguoi_thang_id text,
  ADD COLUMN IF NOT EXISTS la_luyen_tap boolean DEFAULT false;

ALTER TABLE public.hoat_dong_nguoi_dung
  ADD COLUMN IF NOT EXISTS loai_hanh_dong text,
  ADD COLUMN IF NOT EXISTS mo_ta text,
  ADD COLUMN IF NOT EXISTS thong_tin_bo_sung jsonb DEFAULT '{}'::jsonb;

-- Normalize selected legacy column types after rename.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'hoc_lieu' AND column_name = 'nguoi_tao_id' AND data_type != 'text'
  ) THEN
    ALTER TABLE public.hoc_lieu ALTER COLUMN nguoi_tao_id TYPE text USING nguoi_tao_id::text;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'phan_hoi_hoc_lieu' AND column_name = 'nguoi_dung_id' AND data_type != 'text'
  ) THEN
    DROP POLICY IF EXISTS "Authenticated users can insert material feedback" ON public.phan_hoi_hoc_lieu;
    ALTER TABLE public.phan_hoi_hoc_lieu ALTER COLUMN nguoi_dung_id TYPE text USING nguoi_dung_id::text;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'phan_hoi_hoc_lieu' AND column_name = 'nguoi_tra_loi_id' AND data_type != 'text'
  ) THEN
    ALTER TABLE public.phan_hoi_hoc_lieu ALTER COLUMN nguoi_tra_loi_id TYPE text USING nguoi_tra_loi_id::text;
  END IF;
END $$;

ALTER TABLE IF EXISTS public.nguoi_dung
  DROP COLUMN IF EXISTS unlocked_lessons,
  DROP COLUMN IF EXISTS unlocked_chemicals,
  DROP COLUMN IF EXISTS balancing_progress,
  DROP COLUMN IF EXISTS last_streak_reset_at,
  DROP COLUMN IF EXISTS inventory;

ALTER TABLE IF EXISTS public.khoi
  DROP COLUMN IF EXISTS description;

ALTER TABLE IF EXISTS public.phan_ung
  DROP COLUMN IF EXISTS lesson_id;

-- ---------------------------------------------------------------------------
-- Runtime RPC functions.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.nguoi_dung (id, username, email, role)
  VALUES (
    new.id::text,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    'student'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_active_minutes(user_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.nguoi_dung
  SET phut_hoat_dong = COALESCE(phut_hoat_dong, 0) + 1,
      hoat_dong_cuoi_luc = now(),
      updated_at = now()
  WHERE id = user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_likes(row_id uuid)
RETURNS public.thao_luan
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_comment public.thao_luan;
BEGIN
  UPDATE public.thao_luan
  SET luot_thich = COALESCE(luot_thich, 0) + 1
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
  UPDATE public.hoc_lieu
  SET luot_xem = COALESCE(luot_xem, 0) + 1
  WHERE id = $1
  RETURNING luot_xem INTO next_count;

  RETURN COALESCE(next_count, 0);
END;
$$;

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
$$;

DROP FUNCTION IF EXISTS public.join_arena_room(text);

CREATE OR REPLACE FUNCTION public.cleanup_user_arena_memberships(
  p_user_id text,
  p_keep_room_id text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  old_room record;
  remaining_count integer;
  next_host_id text;
BEGIN
  FOR old_room IN
    SELECT room_row.id, room_row.status, room_row.chu_phong_id
    FROM public.phong_dau room_row
    JOIN public.nguoi_choi player_row
      ON player_row.phong_dau_id = room_row.id
    WHERE player_row.nguoi_dung_id = p_user_id
      AND player_row.status IN ('joined', 'ready', 'playing')
      AND (p_keep_room_id IS NULL OR room_row.id <> p_keep_room_id)
    ORDER BY room_row.id
    FOR UPDATE OF room_row
  LOOP
    UPDATE public.nguoi_choi
    SET status = 'left', xem_cuoi_luc = pg_catalog.now()
    WHERE phong_dau_id = old_room.id
      AND nguoi_dung_id = p_user_id
      AND status IN ('joined', 'ready', 'playing');

    SELECT
      count(*)::integer,
      (array_agg(player_row.nguoi_dung_id ORDER BY player_row.tham_gia_luc))[1]
    INTO remaining_count, next_host_id
    FROM public.nguoi_choi player_row
    WHERE player_row.phong_dau_id = old_room.id
      AND player_row.status IN ('joined', 'ready', 'playing');

    IF remaining_count = 0 THEN
      IF old_room.status = 'waiting' THEN
        DELETE FROM public.phong_dau WHERE id = old_room.id;
      ELSIF old_room.status = 'playing' THEN
        UPDATE public.phong_dau
        SET status = 'finished',
            so_nguoi_hien_tai = 0,
            ket_thuc_luc = pg_catalog.now(),
            vong_ket_thuc_luc = pg_catalog.now(),
            nguoi_thang_id = NULL
        WHERE id = old_room.id;
      END IF;
    ELSE
      UPDATE public.phong_dau
      SET so_nguoi_hien_tai = remaining_count,
          chu_phong_id = CASE
            WHEN old_room.chu_phong_id = p_user_id AND next_host_id IS NOT NULL THEN next_host_id
            ELSE chu_phong_id
          END
      WHERE id = old_room.id;
    END IF;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_material_download(material_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_count integer;
BEGIN
  UPDATE public.hoc_lieu
  SET luot_tai = COALESCE(luot_tai, 0) + 1
  WHERE id = $1
  RETURNING luot_tai INTO next_count;

  RETURN next_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_arena_room(
  p_room_id text,
  p_name text,
  p_user_id text,
  p_username text,
  p_avatar_seed text,
  p_mode text,
  p_difficulty text,
  p_max_players integer,
  p_is_practice boolean
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  created_room public.phong_dau%ROWTYPE;
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('aurum-arena-membership', 0));
  PERFORM public.cleanup_user_arena_memberships(p_user_id, NULL);

  INSERT INTO public.phong_dau (
    id, ten, chu_phong_id, che_do, do_kho, status,
    so_nguoi_toi_da, so_nguoi_hien_tai, la_luyen_tap
  )
  VALUES (
    p_room_id,
    COALESCE(NULLIF(pg_catalog.btrim(p_name), ''), 'Arena ' || p_room_id),
    p_user_id,
    p_mode,
    p_difficulty,
    'waiting',
    p_max_players,
    1,
    p_is_practice
  )
  RETURNING * INTO created_room;

  INSERT INTO public.nguoi_choi (
    phong_dau_id, nguoi_dung_id, username, avatar_seed, status, xem_cuoi_luc
  )
  VALUES (
    p_room_id,
    p_user_id,
    COALESCE(NULLIF(pg_catalog.btrim(p_username), ''), 'Ẩn danh'),
    COALESCE(NULLIF(pg_catalog.btrim(p_avatar_seed), ''), 'Aurum'),
    CASE WHEN p_is_practice THEN 'ready' ELSE 'joined' END,
    pg_catalog.now()
  );

  RETURN to_jsonb(created_room);
END;
$$;

CREATE OR REPLACE FUNCTION public.join_arena_room(
  p_room_id text,
  p_user_id text,
  p_username text,
  p_avatar_seed text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_room public.phong_dau%ROWTYPE;
  joined_room jsonb;
  active_count integer;
  already_joined boolean;
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('aurum-arena-membership', 0));

  SELECT * INTO target_room
  FROM public.phong_dau
  WHERE id = p_room_id AND status = 'waiting'
  FOR UPDATE;

  IF NOT FOUND OR target_room.la_luyen_tap THEN
    RETURN NULL;
  END IF;

  SELECT
    count(*)::integer,
    COALESCE(bool_or(player_row.nguoi_dung_id = p_user_id), false)
  INTO active_count, already_joined
  FROM public.nguoi_choi player_row
  WHERE player_row.phong_dau_id = p_room_id
    AND player_row.status IN ('joined', 'ready', 'playing');

  IF NOT already_joined AND active_count >= target_room.so_nguoi_toi_da THEN
    RETURN NULL;
  END IF;

  PERFORM public.cleanup_user_arena_memberships(p_user_id, p_room_id);

  INSERT INTO public.nguoi_choi (
    phong_dau_id, nguoi_dung_id, username, avatar_seed, status, xem_cuoi_luc
  )
  VALUES (
    p_room_id,
    p_user_id,
    COALESCE(NULLIF(pg_catalog.btrim(p_username), ''), 'Ẩn danh'),
    COALESCE(NULLIF(pg_catalog.btrim(p_avatar_seed), ''), 'Aurum'),
    'joined',
    pg_catalog.now()
  )
  ON CONFLICT (phong_dau_id, nguoi_dung_id) DO UPDATE
  SET username = EXCLUDED.username,
      avatar_seed = EXCLUDED.avatar_seed,
      status = 'joined',
      tham_gia_luc = pg_catalog.now(),
      xem_cuoi_luc = pg_catalog.now();

  SELECT count(*)::integer INTO active_count
  FROM public.nguoi_choi player_row
  WHERE player_row.phong_dau_id = p_room_id
    AND player_row.status IN ('joined', 'ready', 'playing');

  UPDATE public.phong_dau
  SET so_nguoi_hien_tai = active_count
  WHERE id = p_room_id
  RETURNING to_jsonb(public.phong_dau.*) INTO joined_room;

  RETURN joined_room;
END;
$$;

CREATE OR REPLACE FUNCTION public.leave_arena_room(
  p_room_id text,
  p_user_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_room public.phong_dau%ROWTYPE;
  remaining_count integer;
  next_host_id text;
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('aurum-arena-membership', 0));

  SELECT * INTO target_room
  FROM public.phong_dau
  WHERE id = p_room_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('deleted', true, 'current_players', 0);
  END IF;

  UPDATE public.nguoi_choi
  SET status = 'left', xem_cuoi_luc = pg_catalog.now()
  WHERE phong_dau_id = p_room_id
    AND nguoi_dung_id = p_user_id
    AND status IN ('joined', 'ready', 'playing');

  SELECT
    count(*)::integer,
    (array_agg(player_row.nguoi_dung_id ORDER BY player_row.tham_gia_luc))[1]
  INTO remaining_count, next_host_id
  FROM public.nguoi_choi player_row
  WHERE player_row.phong_dau_id = p_room_id
    AND player_row.status IN ('joined', 'ready', 'playing');

  IF remaining_count = 0 THEN
    IF target_room.status = 'waiting' THEN
      DELETE FROM public.phong_dau WHERE id = p_room_id;
      RETURN jsonb_build_object('deleted', true, 'current_players', 0);
    ELSIF target_room.status = 'playing' THEN
      UPDATE public.phong_dau
      SET status = 'finished',
          so_nguoi_hien_tai = 0,
          ket_thuc_luc = pg_catalog.now(),
          vong_ket_thuc_luc = pg_catalog.now(),
          nguoi_thang_id = NULL
      WHERE id = p_room_id;
      RETURN jsonb_build_object('deleted', false, 'finished', true, 'current_players', 0);
    END IF;
  END IF;

  UPDATE public.phong_dau
  SET so_nguoi_hien_tai = remaining_count,
      chu_phong_id = CASE
        WHEN target_room.chu_phong_id = p_user_id AND next_host_id IS NOT NULL THEN next_host_id
        ELSE chu_phong_id
      END
  WHERE id = p_room_id;

  RETURN jsonb_build_object(
    'deleted', false,
    'current_players', remaining_count,
    'host_id', CASE
      WHEN target_room.chu_phong_id = p_user_id AND next_host_id IS NOT NULL THEN next_host_id
      ELSE target_room.chu_phong_id
    END
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.start_arena_room(
  p_room_id text,
  p_user_id text,
  p_started_at timestamp with time zone,
  p_round_ends_at timestamp with time zone
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_room public.phong_dau%ROWTYPE;
  active_count integer;
  started_room jsonb;
BEGIN
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('aurum-arena-membership', 0));

  SELECT * INTO target_room
  FROM public.phong_dau
  WHERE id = p_room_id
  FOR UPDATE;

  IF NOT FOUND OR target_room.status = 'finished' THEN
    RETURN NULL;
  END IF;

  IF target_room.status = 'playing' THEN
    RETURN to_jsonb(target_room);
  END IF;

  IF target_room.chu_phong_id <> p_user_id
     OR COALESCE(pg_catalog.array_length(target_room.danh_sach_cau_hoi_id, 1), 0) = 0 THEN
    RETURN NULL;
  END IF;

  SELECT count(*)::integer INTO active_count
  FROM public.nguoi_choi player_row
  WHERE player_row.phong_dau_id = p_room_id
    AND player_row.status IN ('joined', 'ready', 'playing');

  IF NOT target_room.la_luyen_tap AND active_count < target_room.so_nguoi_toi_da THEN
    RETURN NULL;
  END IF;

  UPDATE public.phong_dau
  SET status = 'playing',
      so_nguoi_hien_tai = active_count,
      vong_hien_tai = 0,
      bat_dau_luc = p_started_at,
      ket_thuc_luc = NULL,
      nguoi_thang_id = NULL,
      vong_bat_dau_luc = p_started_at,
      vong_ket_thuc_luc = p_round_ends_at
  WHERE id = p_room_id
  RETURNING to_jsonb(public.phong_dau.*) INTO started_room;

  UPDATE public.nguoi_choi
  SET status = 'playing', xem_cuoi_luc = pg_catalog.now()
  WHERE phong_dau_id = p_room_id
    AND status IN ('joined', 'ready', 'playing');

  RETURN started_room;
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_user_arena_memberships(text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_arena_room(text, text, text, text, text, text, text, integer, boolean) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.join_arena_room(text, text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.leave_arena_room(text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.start_arena_room(text, text, timestamp with time zone, timestamp with time zone) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_arena_room(text, text, text, text, text, text, text, integer, boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.join_arena_room(text, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.leave_arena_room(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.start_arena_room(text, text, timestamp with time zone, timestamp with time zone) TO service_role;

CREATE OR REPLACE FUNCTION public.sync_user_streak(user_id_text text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_record public.nguoi_dung;
BEGIN
  SELECT * INTO user_record FROM public.nguoi_dung WHERE id = user_id_text;

  IF user_record.id IS NULL THEN
    RETURN NULL;
  END IF;

  IF user_record.updated_at::date < now()::date THEN
    UPDATE public.nguoi_dung
    SET phut_online_hom_nay = 0,
        da_hoan_thanh_bai_hom_nay = false,
        updated_at = now()
    WHERE id = user_id_text
    RETURNING * INTO user_record;
  END IF;

  RETURN jsonb_build_object(
    'streak_count', user_record.so_ngay_chuoi,
    'last_streak_at', user_record.chuoi_cuoi_luc,
    'today_online_minutes', user_record.phut_online_hom_nay,
    'today_lesson_completed', user_record.da_hoan_thanh_bai_hom_nay
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- Indexes.
-- ---------------------------------------------------------------------------
-- Repair legacy Arena data before enforcing one active room per user.
-- Supabase migrations run transactionally; this lock prevents concurrent
-- Arena writes from inserting another duplicate between cleanup and indexing.
LOCK TABLE public.phong_dau, public.nguoi_choi IN SHARE ROW EXCLUSIVE MODE;

UPDATE public.nguoi_choi player_row
SET status = 'finished', xem_cuoi_luc = now()
FROM public.phong_dau room_row
WHERE room_row.id = player_row.phong_dau_id
  AND room_row.status = 'finished'
  AND player_row.status IN ('joined', 'ready', 'playing');

WITH ranked_memberships AS (
  SELECT
    player_row.phong_dau_id,
    player_row.nguoi_dung_id,
    row_number() OVER (
      PARTITION BY player_row.nguoi_dung_id
      ORDER BY
        CASE WHEN room_row.status = 'playing' THEN 0 ELSE 1 END,
        player_row.xem_cuoi_luc DESC,
        player_row.tham_gia_luc DESC,
        player_row.phong_dau_id DESC
    ) AS membership_rank
  FROM public.nguoi_choi player_row
  JOIN public.phong_dau room_row ON room_row.id = player_row.phong_dau_id
  WHERE player_row.status IN ('joined', 'ready', 'playing')
)
UPDATE public.nguoi_choi player_row
SET status = 'left', xem_cuoi_luc = now()
FROM ranked_memberships ranked
WHERE ranked.membership_rank > 1
  AND player_row.phong_dau_id = ranked.phong_dau_id
  AND player_row.nguoi_dung_id = ranked.nguoi_dung_id;

UPDATE public.phong_dau room_row
SET so_nguoi_hien_tai = (
  SELECT count(*)::integer
  FROM public.nguoi_choi player_row
  WHERE player_row.phong_dau_id = room_row.id
    AND player_row.status IN ('joined', 'ready', 'playing')
)
WHERE room_row.status IN ('waiting', 'playing');

UPDATE public.phong_dau room_row
SET chu_phong_id = (
  SELECT player_row.nguoi_dung_id
  FROM public.nguoi_choi player_row
  WHERE player_row.phong_dau_id = room_row.id
    AND player_row.status IN ('joined', 'ready', 'playing')
  ORDER BY player_row.tham_gia_luc
  LIMIT 1
)
WHERE room_row.status IN ('waiting', 'playing')
  AND NOT EXISTS (
    SELECT 1
    FROM public.nguoi_choi host_player
    WHERE host_player.phong_dau_id = room_row.id
      AND host_player.nguoi_dung_id = room_row.chu_phong_id
      AND host_player.status IN ('joined', 'ready', 'playing')
  )
  AND EXISTS (
    SELECT 1
    FROM public.nguoi_choi active_player
    WHERE active_player.phong_dau_id = room_row.id
      AND active_player.status IN ('joined', 'ready', 'playing')
  );

DELETE FROM public.phong_dau room_row
WHERE room_row.status = 'waiting'
  AND NOT EXISTS (
    SELECT 1
    FROM public.nguoi_choi player_row
    WHERE player_row.phong_dau_id = room_row.id
      AND player_row.status IN ('joined', 'ready', 'playing')
  );

UPDATE public.phong_dau room_row
SET status = 'finished',
    so_nguoi_hien_tai = 0,
    ket_thuc_luc = now(),
    vong_ket_thuc_luc = now(),
    nguoi_thang_id = NULL
WHERE room_row.status = 'playing'
  AND NOT EXISTS (
    SELECT 1
    FROM public.nguoi_choi player_row
    WHERE player_row.phong_dau_id = room_row.id
      AND player_row.status IN ('joined', 'ready', 'playing')
  );

CREATE INDEX IF NOT EXISTS idx_nguoi_dung_phut_hoat_dong ON public.nguoi_dung (phut_hoat_dong DESC);
CREATE INDEX IF NOT EXISTS idx_nguoi_dung_hoat_dong_cuoi_luc ON public.nguoi_dung (hoat_dong_cuoi_luc DESC);
CREATE INDEX IF NOT EXISTS idx_nguoi_dung_hoat_dong_id ON public.nguoi_dung (hoat_dong_cuoi_luc DESC NULLS LAST, id DESC);
CREATE INDEX IF NOT EXISTS idx_nguoi_dung_role ON public.nguoi_dung (role);
CREATE INDEX IF NOT EXISTS idx_bai_hoc_khoi_thu_tu ON public.bai_hoc (khoi_id, thu_tu);
CREATE INDEX IF NOT EXISTS idx_bai_hoc_chuong_trinh ON public.bai_hoc (chuong_trinh_id);
CREATE INDEX IF NOT EXISTS idx_tien_do_nguoi_dung_loai_tien_do ON public.tien_do_nguoi_dung (nguoi_dung_id, loai_tien_do);
CREATE INDEX IF NOT EXISTS idx_tien_do_nguoi_dung_doi_tuong_id ON public.tien_do_nguoi_dung (loai_tien_do, doi_tuong_id);
CREATE INDEX IF NOT EXISTS idx_phan_hoi_status ON public.phan_hoi (status);
CREATE INDEX IF NOT EXISTS idx_phan_hoi_type ON public.phan_hoi (type);
CREATE INDEX IF NOT EXISTS idx_phan_hoi_created_id ON public.phan_hoi (created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_phan_hoi_teacher_pending_email
  ON public.phan_hoi ((thong_tin_bo_sung->>'email'))
  WHERE type = 'teacher_registration' AND status = 'unread';
CREATE INDEX IF NOT EXISTS idx_phan_hoi_teacher_created_id
  ON public.phan_hoi (created_at DESC, id DESC)
  WHERE type = 'teacher_registration';
CREATE INDEX IF NOT EXISTS idx_phan_hoi_general_created_id
  ON public.phan_hoi (created_at DESC, id DESC)
  WHERE type <> 'teacher_registration';
CREATE INDEX IF NOT EXISTS idx_yeu_cau_duyet_admin_status_created ON public.yeu_cau_duyet_admin (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_yeu_cau_duyet_admin_status_created_id ON public.yeu_cau_duyet_admin (status, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_yeu_cau_duyet_admin_requested_by ON public.yeu_cau_duyet_admin (requested_by);
CREATE INDEX IF NOT EXISTS idx_yeu_cau_duyet_admin_executed_by ON public.yeu_cau_duyet_admin (executed_by);
CREATE UNIQUE INDEX IF NOT EXISTS idx_yeu_cau_duyet_admin_pending_hash
  ON public.yeu_cau_duyet_admin (request_hash)
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_phan_ung_khoi_id ON public.phan_ung (khoi_id);
CREATE INDEX IF NOT EXISTS idx_cau_hoi_dau_khoi_id ON public.cau_hoi_dau (khoi_id);
CREATE INDEX IF NOT EXISTS idx_cau_hoi_dau_loai_game ON public.cau_hoi_dau (loai_game);
CREATE INDEX IF NOT EXISTS idx_cau_hoi_dau_dang_hoat_dong_do_kho ON public.cau_hoi_dau (dang_hoat_dong, do_kho);
CREATE INDEX IF NOT EXISTS idx_phong_dau_chu_phong_id ON public.phong_dau (chu_phong_id);
CREATE INDEX IF NOT EXISTS idx_nguoi_choi_nguoi_dung_id ON public.nguoi_choi (nguoi_dung_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_nguoi_choi_mot_phong_dang_hoat_dong
  ON public.nguoi_choi (nguoi_dung_id)
  WHERE status IN ('joined', 'ready', 'playing');
CREATE INDEX IF NOT EXISTS idx_nguoi_choi_phong_dang_hoat_dong
  ON public.nguoi_choi (phong_dau_id, tham_gia_luc)
  WHERE status IN ('joined', 'ready', 'playing');
CREATE INDEX IF NOT EXISTS idx_tra_loi_vong_phong_dau_thu_tu_vong ON public.tra_loi_vong (phong_dau_id, thu_tu_vong);
CREATE INDEX IF NOT EXISTS idx_lich_su_dau_nguoi_dung_id ON public.lich_su_dau (nguoi_dung_id);
CREATE INDEX IF NOT EXISTS idx_lich_su_dau_phong_dau_id ON public.lich_su_dau (phong_dau_id);
CREATE INDEX IF NOT EXISTS idx_lich_su_dau_dau_luc ON public.lich_su_dau (dau_luc DESC);
CREATE INDEX IF NOT EXISTS idx_lop_giao_vien_id ON public.lop (giao_vien_id);
CREATE INDEX IF NOT EXISTS idx_lop_giao_vien_created ON public.lop (giao_vien_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lop_khoi_id ON public.lop (khoi_id);
CREATE INDEX IF NOT EXISTS idx_thanh_vien_lop_hoc_sinh_id ON public.thanh_vien_lop (hoc_sinh_id);
CREATE INDEX IF NOT EXISTS idx_thanh_vien_lop_lop_tham_gia ON public.thanh_vien_lop (lop_id, tham_gia_luc DESC);
CREATE INDEX IF NOT EXISTS idx_bai_dang_lop_lop_id ON public.bai_dang_lop (lop_id);
CREATE INDEX IF NOT EXISTS idx_bai_dang_lop_tac_gia_id ON public.bai_dang_lop (tac_gia_id);
CREATE INDEX IF NOT EXISTS idx_bai_dang_lop_hoc_sinh_nhan_id ON public.bai_dang_lop (hoc_sinh_nhan_id);
CREATE INDEX IF NOT EXISTS idx_bai_dang_lop_lop_type_created ON public.bai_dang_lop (lop_id, type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bai_dang_lop_assignment_deadline ON public.bai_dang_lop (lop_id, han_nop)
  WHERE type = 'assignment';
CREATE INDEX IF NOT EXISTS idx_bai_dang_lop_lop_target_created ON public.bai_dang_lop (lop_id, hoc_sinh_nhan_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bai_nop_bai_dang_id ON public.bai_nop (bai_dang_id);
CREATE INDEX IF NOT EXISTS idx_bai_nop_hoc_sinh_id ON public.bai_nop (hoc_sinh_id);
CREATE INDEX IF NOT EXISTS idx_bai_nop_bai_dang_nop_luc ON public.bai_nop (bai_dang_id, nop_luc DESC);
CREATE INDEX IF NOT EXISTS idx_lich_lop_lop_id ON public.lich_lop (lop_id);
CREATE INDEX IF NOT EXISTS idx_lich_lop_lop_bat_dau ON public.lich_lop (lop_id, bat_dau_luc);
CREATE INDEX IF NOT EXISTS idx_hoc_lieu_nguoi_tao_id ON public.hoc_lieu (nguoi_tao_id);
CREATE INDEX IF NOT EXISTS idx_phan_hoi_hoc_lieu_hoc_lieu_id ON public.phan_hoi_hoc_lieu (hoc_lieu_id);
CREATE INDEX IF NOT EXISTS idx_phan_hoi_hoc_lieu_nguoi_dung_id ON public.phan_hoi_hoc_lieu (nguoi_dung_id);
CREATE INDEX IF NOT EXISTS idx_phan_hoi_hoc_lieu_hoc_lieu_created ON public.phan_hoi_hoc_lieu (hoc_lieu_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nhiem_vu_loai_hanh_dong ON public.nhiem_vu (loai_hanh_dong);
CREATE INDEX IF NOT EXISTS idx_nhiem_vu_nguoi_dung_nguoi_dung_id ON public.nhiem_vu_nguoi_dung (nguoi_dung_id);
CREATE INDEX IF NOT EXISTS idx_nhiem_vu_nguoi_dung_nhiem_vu_id ON public.nhiem_vu_nguoi_dung (nhiem_vu_id);
CREATE INDEX IF NOT EXISTS idx_thao_luan_bai_hoc_id ON public.thao_luan (bai_hoc_id);
CREATE INDEX IF NOT EXISTS idx_thao_luan_nguoi_dung_id ON public.thao_luan (nguoi_dung_id);
CREATE INDEX IF NOT EXISTS idx_thao_luan_cha_id ON public.thao_luan (cha_id);
CREATE INDEX IF NOT EXISTS idx_ghi_chu_bai_hoc_id ON public.ghi_chu (bai_hoc_id);
CREATE INDEX IF NOT EXISTS idx_ghi_chu_nguoi_dung_bai_hoc ON public.ghi_chu (nguoi_dung_id, bai_hoc_id);
CREATE INDEX IF NOT EXISTS idx_hoat_dong_nguoi_dung_created ON public.hoat_dong_nguoi_dung (nguoi_dung_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Row level security and policies.
-- ---------------------------------------------------------------------------
ALTER TABLE public.nguoi_dung ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.khoi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bai_hoc ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tien_do_nguoi_dung ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phan_hoi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yeu_cau_duyet_admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hoa_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phan_ung ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cau_hoi_dau ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phong_dau ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nguoi_choi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tra_loi_vong ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lich_su_dau ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thanh_vien_lop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bai_dang_lop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bai_nop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lich_lop ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hoc_lieu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phan_hoi_hoc_lieu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nhiem_vu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nhiem_vu_nguoi_dung ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thao_luan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ghi_chu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hoat_dong_nguoi_dung ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read grade levels" ON public.khoi;
CREATE POLICY "Public read grade levels" ON public.khoi FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read lessons" ON public.bai_hoc;
CREATE POLICY "Public read lessons" ON public.bai_hoc FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read lab chemicals" ON public.hoa_chat;
CREATE POLICY "Public read lab chemicals" ON public.hoa_chat FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read lab reactions" ON public.phan_ung;
CREATE POLICY "Public read lab reactions" ON public.phan_ung FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read arena questions" ON public.cau_hoi_dau;
CREATE POLICY "Public read arena questions" ON public.cau_hoi_dau FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read materials" ON public.hoc_lieu;
CREATE POLICY "Public read materials" ON public.hoc_lieu FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read missions" ON public.nhiem_vu;
CREATE POLICY "Public read missions" ON public.nhiem_vu FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read lesson discussions" ON public.thao_luan;
CREATE POLICY "Public read lesson discussions" ON public.thao_luan FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create own discussions" ON public.thao_luan;
CREATE POLICY "Authenticated users can create own discussions"
  ON public.thao_luan FOR INSERT
  WITH CHECK (nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can read own profile" ON public.nguoi_dung;
CREATE POLICY "Users can read own profile"
  ON public.nguoi_dung FOR SELECT
  USING (id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can update own profile" ON public.nguoi_dung;
CREATE POLICY "Users can update own profile"
  ON public.nguoi_dung FOR UPDATE
  USING (id = (select auth.uid())::text)
  WITH CHECK (id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can read own progress" ON public.tien_do_nguoi_dung;
CREATE POLICY "Users can read own progress"
  ON public.tien_do_nguoi_dung FOR SELECT
  USING (nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can insert own progress" ON public.tien_do_nguoi_dung;
CREATE POLICY "Users can insert own progress"
  ON public.tien_do_nguoi_dung FOR INSERT
  WITH CHECK (nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can update own progress" ON public.tien_do_nguoi_dung;
CREATE POLICY "Users can update own progress"
  ON public.tien_do_nguoi_dung FOR UPDATE
  USING (nguoi_dung_id = (select auth.uid())::text)
  WITH CHECK (nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can read own notes" ON public.ghi_chu;
CREATE POLICY "Users can read own notes"
  ON public.ghi_chu FOR SELECT
  USING (nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can insert own notes" ON public.ghi_chu;
CREATE POLICY "Users can insert own notes"
  ON public.ghi_chu FOR INSERT
  WITH CHECK (nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can update own notes" ON public.ghi_chu;
CREATE POLICY "Users can update own notes"
  ON public.ghi_chu FOR UPDATE
  USING (nguoi_dung_id = (select auth.uid())::text)
  WITH CHECK (nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can delete own notes" ON public.ghi_chu;
CREATE POLICY "Users can delete own notes"
  ON public.ghi_chu FOR DELETE
  USING (nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can read own missions" ON public.nhiem_vu_nguoi_dung;
CREATE POLICY "Users can read own missions"
  ON public.nhiem_vu_nguoi_dung FOR SELECT
  USING (nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Public read waiting arena rooms" ON public.phong_dau;
CREATE POLICY "Public read waiting arena rooms"
  ON public.phong_dau FOR SELECT
  USING (status = 'waiting' AND la_luyen_tap = false);

DROP POLICY IF EXISTS "Arena participants read rooms" ON public.phong_dau;
CREATE POLICY "Arena participants read rooms"
  ON public.phong_dau FOR SELECT
  TO authenticated
  USING (
    chu_phong_id = (select auth.uid())::text
    OR EXISTS (
      SELECT 1
      FROM public.nguoi_choi p
      WHERE p.phong_dau_id = phong_dau.id
        AND p.nguoi_dung_id = (select auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "Authenticated users create own arena rooms" ON public.phong_dau;
CREATE POLICY "Authenticated users create own arena rooms"
  ON public.phong_dau FOR INSERT
  WITH CHECK (chu_phong_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Arena hosts update own rooms" ON public.phong_dau;
CREATE POLICY "Arena hosts update own rooms"
  ON public.phong_dau FOR UPDATE
  USING (chu_phong_id = (select auth.uid())::text)
  WITH CHECK (chu_phong_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Authenticated users read arena room players" ON public.nguoi_choi;
CREATE POLICY "Authenticated users read arena room players"
  ON public.nguoi_choi FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users read own arena answers" ON public.tra_loi_vong;
CREATE POLICY "Users read own arena answers"
  ON public.tra_loi_vong FOR SELECT
  TO authenticated
  USING (nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can view own match history" ON public.lich_su_dau;
CREATE POLICY "Users can view own match history"
  ON public.lich_su_dau FOR SELECT
  USING (nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can insert own match history" ON public.lich_su_dau;
CREATE POLICY "Users can insert own match history"
  ON public.lich_su_dau FOR INSERT
  WITH CHECK (nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Class members can read joined classes" ON public.lop;
CREATE POLICY "Class members can read joined classes"
  ON public.lop FOR SELECT
  USING (
    giao_vien_id = (select auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM public.thanh_vien_lop cm
      WHERE cm.lop_id = lop.id AND cm.hoc_sinh_id = (select auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "Teachers can insert owned classes" ON public.lop;
CREATE POLICY "Teachers can insert owned classes"
  ON public.lop FOR INSERT
  WITH CHECK (giao_vien_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Teachers can update owned classes" ON public.lop;
CREATE POLICY "Teachers can update owned classes"
  ON public.lop FOR UPDATE
  USING (giao_vien_id = (select auth.uid())::text)
  WITH CHECK (giao_vien_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Students can read own class memberships" ON public.thanh_vien_lop;
CREATE POLICY "Students can read own class memberships"
  ON public.thanh_vien_lop FOR SELECT
  USING (hoc_sinh_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Students can join as themselves" ON public.thanh_vien_lop;
CREATE POLICY "Students can join as themselves"
  ON public.thanh_vien_lop FOR INSERT
  WITH CHECK (hoc_sinh_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Class members can read visible posts" ON public.bai_dang_lop;
CREATE POLICY "Class members can read visible posts"
  ON public.bai_dang_lop FOR SELECT
  USING (
    tac_gia_id = (select auth.uid())::text
    OR hoc_sinh_nhan_id = (select auth.uid())::text
    OR (
      hoc_sinh_nhan_id IS NULL
      AND EXISTS (
        SELECT 1 FROM public.thanh_vien_lop cm
        WHERE cm.lop_id = bai_dang_lop.lop_id AND cm.hoc_sinh_id = (select auth.uid())::text
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.lop c
      WHERE c.id = bai_dang_lop.lop_id AND c.giao_vien_id = (select auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "Teachers can insert posts for owned classes" ON public.bai_dang_lop;
CREATE POLICY "Teachers can insert posts for owned classes"
  ON public.bai_dang_lop FOR INSERT
  WITH CHECK (
    tac_gia_id = (select auth.uid())::text
    AND EXISTS (SELECT 1 FROM public.lop c WHERE c.id = bai_dang_lop.lop_id AND c.giao_vien_id = (select auth.uid())::text)
  );

DROP POLICY IF EXISTS "Teachers can delete owned class posts" ON public.bai_dang_lop;
CREATE POLICY "Teachers can delete owned class posts"
  ON public.bai_dang_lop FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.lop c WHERE c.id = bai_dang_lop.lop_id AND c.giao_vien_id = (select auth.uid())::text));

DROP POLICY IF EXISTS "Students and teachers can read submissions" ON public.bai_nop;
CREATE POLICY "Students and teachers can read submissions"
  ON public.bai_nop FOR SELECT
  USING (
    hoc_sinh_id = (select auth.uid())::text
    OR EXISTS (
      SELECT 1 FROM public.bai_dang_lop p
      JOIN public.lop c ON c.id = p.lop_id
      WHERE p.id = bai_nop.bai_dang_id AND c.giao_vien_id = (select auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "Students can insert submitted own assignment" ON public.bai_nop;
CREATE POLICY "Students can insert submitted own assignment"
  ON public.bai_nop FOR INSERT
  WITH CHECK (
    hoc_sinh_id = (select auth.uid())::text
    AND status = 'submitted'
    AND diem IS NULL
    AND EXISTS (
      SELECT 1
      FROM public.bai_dang_lop p
      JOIN public.thanh_vien_lop cm ON cm.lop_id = p.lop_id
      WHERE p.id = bai_nop.bai_dang_id
        AND p.type = 'assignment'
        AND cm.hoc_sinh_id = (select auth.uid())::text
        AND (p.hoc_sinh_nhan_id IS NULL OR p.hoc_sinh_nhan_id = (select auth.uid())::text)
    )
  );

DROP POLICY IF EXISTS "Teachers can update submissions for owned classes" ON public.bai_nop;
CREATE POLICY "Teachers can update submissions for owned classes"
  ON public.bai_nop FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.bai_dang_lop p
      JOIN public.lop c ON c.id = p.lop_id
      WHERE p.id = bai_nop.bai_dang_id AND c.giao_vien_id = (select auth.uid())::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.bai_dang_lop p
      JOIN public.lop c ON c.id = p.lop_id
      WHERE p.id = bai_nop.bai_dang_id AND c.giao_vien_id = (select auth.uid())::text
    )
  );

DROP POLICY IF EXISTS "Class members can read schedules" ON public.lich_lop;
CREATE POLICY "Class members can read schedules"
  ON public.lich_lop FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.lop c WHERE c.id = lich_lop.lop_id AND c.giao_vien_id = (select auth.uid())::text)
    OR EXISTS (SELECT 1 FROM public.thanh_vien_lop cm WHERE cm.lop_id = lich_lop.lop_id AND cm.hoc_sinh_id = (select auth.uid())::text)
  );

DROP POLICY IF EXISTS "Teachers can insert schedules for owned classes" ON public.lich_lop;
CREATE POLICY "Teachers can insert schedules for owned classes"
  ON public.lich_lop FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.lop c WHERE c.id = lich_lop.lop_id AND c.giao_vien_id = (select auth.uid())::text));

DROP POLICY IF EXISTS "Authenticated users can insert anonymous or own feedback" ON public.phan_hoi;
CREATE POLICY "Authenticated users can insert anonymous or own feedback"
  ON public.phan_hoi FOR INSERT
  WITH CHECK (nguoi_dung_id IS NULL OR nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Admins can read approval requests" ON public.yeu_cau_duyet_admin;
CREATE POLICY "Admins can read approval requests"
  ON public.yeu_cau_duyet_admin FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.nguoi_dung u
      WHERE u.id = (select auth.uid())::text AND u.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can create approval requests" ON public.yeu_cau_duyet_admin;
CREATE POLICY "Admins can create approval requests"
  ON public.yeu_cau_duyet_admin FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.nguoi_dung u
      WHERE u.id = (select auth.uid())::text AND u.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update approval requests" ON public.yeu_cau_duyet_admin;
CREATE POLICY "Admins can update approval requests"
  ON public.yeu_cau_duyet_admin FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.nguoi_dung u
      WHERE u.id = (select auth.uid())::text AND u.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.nguoi_dung u
      WHERE u.id = (select auth.uid())::text AND u.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Authenticated users can insert material feedback" ON public.phan_hoi_hoc_lieu;
CREATE POLICY "Authenticated users can insert material feedback"
  ON public.phan_hoi_hoc_lieu FOR INSERT
  WITH CHECK (nguoi_dung_id IS NULL OR nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can insert own activities" ON public.hoat_dong_nguoi_dung;
CREATE POLICY "Users can insert own activities"
  ON public.hoat_dong_nguoi_dung FOR INSERT
  WITH CHECK (nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can view own activities" ON public.hoat_dong_nguoi_dung;
CREATE POLICY "Users can view own activities"
  ON public.hoat_dong_nguoi_dung FOR SELECT
  USING (nguoi_dung_id = (select auth.uid())::text);

DROP POLICY IF EXISTS "Users can delete own activities" ON public.hoat_dong_nguoi_dung;
CREATE POLICY "Users can delete own activities"
  ON public.hoat_dong_nguoi_dung FOR DELETE
  USING (nguoi_dung_id = (select auth.uid())::text);

-- Backend writes through service-role. Direct authenticated updates stay narrow.
REVOKE UPDATE ON TABLE public.nguoi_dung FROM anon, authenticated;
GRANT UPDATE (avatar_seed, ke_hoach_hoc) ON TABLE public.nguoi_dung TO authenticated;

-- Class and material mutations must pass through the Express authorization layer.
REVOKE INSERT, UPDATE, DELETE ON TABLE
  public.lop,
  public.thanh_vien_lop,
  public.bai_dang_lop,
  public.bai_nop,
  public.lich_lop,
  public.hoc_lieu,
  public.phan_hoi_hoc_lieu
FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  public.lop,
  public.thanh_vien_lop,
  public.bai_dang_lop,
  public.bai_nop,
  public.lich_lop,
  public.hoc_lieu,
  public.phan_hoi_hoc_lieu
TO service_role;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_active_minutes(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_likes(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_material_view(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.increment_material_download(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.claim_mission_reward(text, uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cleanup_user_arena_memberships(text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_arena_room(text, text, text, text, text, text, text, integer, boolean) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.join_arena_room(text, text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.leave_arena_room(text, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.start_arena_room(text, text, timestamp with time zone, timestamp with time zone) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_user_streak(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_likes(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_material_view(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_material_download(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_mission_reward(text, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.create_arena_room(text, text, text, text, text, text, text, integer, boolean) TO service_role;
GRANT EXECUTE ON FUNCTION public.join_arena_room(text, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.leave_arena_room(text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.start_arena_room(text, text, timestamp with time zone, timestamp with time zone) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_active_minutes(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.sync_user_streak(text) TO service_role;

-- ---------------------------------------------------------------------------
-- Realtime arena tables.
-- ---------------------------------------------------------------------------
ALTER TABLE public.phong_dau REPLICA IDENTITY FULL;
ALTER TABLE public.nguoi_choi REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    EXECUTE 'CREATE PUBLICATION supabase_realtime';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'phong_dau'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.phong_dau';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'nguoi_choi'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.nguoi_choi';
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- System seeds.
-- ---------------------------------------------------------------------------
INSERT INTO public.khoi (id, ten)
VALUES
  (6, 'Khoi 6'),
  (7, 'Khoi 7'),
  (8, 'Khoi 8'),
  (9, 'Khoi 9'),
  (10, 'Khoi 10'),
  (11, 'Khoi 11'),
  (12, 'Khoi 12')
ON CONFLICT (id) DO UPDATE SET ten = EXCLUDED.ten;

INSERT INTO public.nhiem_vu (tieu_de, mo_ta, loai_hanh_dong, so_luong_muc_tieu, thuong_xp, type, bieu_tuong)
SELECT tieu_de, mo_ta, loai_hanh_dong, so_luong_muc_tieu, thuong_xp, type, bieu_tuong
FROM (
  VALUES
    ('Nha luyen kim tap su', 'Thuc hien 3 phan ung hoa hoc.', 'reaction', 3, 100, 'daily', 'reaction'),
    ('Chien binh dau truong', 'Thang 1 tran dau dau truong.', 'arena_win', 1, 200, 'daily', 'arena'),
    ('Thap lua hom nay', 'Online du 10 phut hoac hoan thanh 1 bai hoc de thap chuoi.', 'streak_light', 1, 50, 'daily', 'flame'),
    ('Giu lua 3 ngay', 'Duy tri chuoi hoc tap trong 3 ngay lien tiep.', 'streak', 3, 300, 'achievement', 'streak-3'),
    ('Kien tri 7 ngay', 'Duy tri chuoi hoc tap trong 7 ngay lien tiep.', 'streak', 7, 700, 'achievement', 'streak-7'),
    ('Ben bi 14 ngay', 'Duy tri chuoi hoc tap trong 14 ngay lien tiep.', 'streak', 14, 1500, 'achievement', 'streak-14'),
    ('Dam me 30 ngay', 'Duy tri chuoi hoc tap trong 30 ngay lien tiep.', 'streak', 30, 4000, 'achievement', 'streak-30'),
    ('Bat diet 90 ngay', 'Duy tri chuoi hoc tap trong 90 ngay lien tiep.', 'streak', 90, 12000, 'achievement', 'streak-90')
) AS seed(tieu_de, mo_ta, loai_hanh_dong, so_luong_muc_tieu, thuong_xp, type, bieu_tuong)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.nhiem_vu m
  WHERE m.loai_hanh_dong = seed.loai_hanh_dong
    AND m.so_luong_muc_tieu = seed.so_luong_muc_tieu
    AND m.type = seed.type
);

NOTIFY pgrst, 'reload schema';

COMMIT;
