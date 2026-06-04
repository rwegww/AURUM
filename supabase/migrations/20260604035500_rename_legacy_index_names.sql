-- Rename legacy index names that still carried old business terminology.
-- Metadata-only; no indexed column or data changes.

BEGIN;

DO $$
BEGIN
  IF to_regclass('public.idx_bai_hoc_grade_level_order') IS NOT NULL
     AND to_regclass('public.idx_bai_hoc_khoi_thu_tu') IS NULL THEN
    ALTER INDEX public.idx_bai_hoc_grade_level_order RENAME TO idx_bai_hoc_khoi_thu_tu;
  END IF;

  IF to_regclass('public.idx_subnhiem_vu_post') IS NOT NULL
     AND to_regclass('public.idx_bai_nop_bai_dang_id') IS NULL THEN
    ALTER INDEX public.idx_subnhiem_vu_post RENAME TO idx_bai_nop_bai_dang_id;
  END IF;

  IF to_regclass('public.idx_notes_user_bai_hoc') IS NOT NULL
     AND to_regclass('public.idx_ghi_chu_nguoi_dung_bai_hoc') IS NULL THEN
    ALTER INDEX public.idx_notes_user_bai_hoc RENAME TO idx_ghi_chu_nguoi_dung_bai_hoc;
  END IF;

  IF to_regclass('public.idx_match_history_dau_luc') IS NOT NULL
     AND to_regclass('public.idx_lich_su_dau_dau_luc') IS NULL THEN
    ALTER INDEX public.idx_match_history_dau_luc RENAME TO idx_lich_su_dau_dau_luc;
  END IF;

  IF to_regclass('public.idx_match_history_nguoi_dung_id') IS NOT NULL
     AND to_regclass('public.idx_lich_su_dau_nguoi_dung_id') IS NULL THEN
    ALTER INDEX public.idx_match_history_nguoi_dung_id RENAME TO idx_lich_su_dau_nguoi_dung_id;
  END IF;

  IF to_regclass('public.idx_thanh_vien_lop_student') IS NOT NULL
     AND to_regclass('public.idx_thanh_vien_lop_hoc_sinh_id') IS NULL THEN
    ALTER INDEX public.idx_thanh_vien_lop_student RENAME TO idx_thanh_vien_lop_hoc_sinh_id;
  END IF;

  IF to_regclass('public.idx_discussions_bai_hoc') IS NOT NULL
     AND to_regclass('public.idx_thao_luan_bai_hoc_id') IS NULL THEN
    ALTER INDEX public.idx_discussions_bai_hoc RENAME TO idx_thao_luan_bai_hoc_id;
  END IF;

  IF to_regclass('public.idx_tien_do_nguoi_dung_target') IS NOT NULL
     AND to_regclass('public.idx_tien_do_nguoi_dung_doi_tuong_id') IS NULL THEN
    ALTER INDEX public.idx_tien_do_nguoi_dung_target RENAME TO idx_tien_do_nguoi_dung_doi_tuong_id;
  END IF;

  IF to_regclass('public.idx_tien_do_nguoi_dung_tien_do_nguoi_dung_type') IS NOT NULL
     AND to_regclass('public.idx_tien_do_nguoi_dung_loai_tien_do') IS NULL THEN
    ALTER INDEX public.idx_tien_do_nguoi_dung_tien_do_nguoi_dung_type RENAME TO idx_tien_do_nguoi_dung_loai_tien_do;
  END IF;

  IF to_regclass('public.idx_tra_loi_vong_room_round') IS NOT NULL
     AND to_regclass('public.idx_tra_loi_vong_phong_dau_thu_tu_vong') IS NULL THEN
    ALTER INDEX public.idx_tra_loi_vong_room_round RENAME TO idx_tra_loi_vong_phong_dau_thu_tu_vong;
  END IF;
END $$;

NOTIFY pgrst, 'reload schema';

COMMIT;
