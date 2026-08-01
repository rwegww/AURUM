-- Chỉ bổ sung chỉ mục cho các truy vấn admin; không thay đổi dữ liệu nghiệp vụ.
CREATE INDEX IF NOT EXISTS idx_nguoi_dung_hoat_dong_id
  ON public.nguoi_dung (hoat_dong_cuoi_luc DESC NULLS LAST, id DESC);
CREATE INDEX IF NOT EXISTS idx_phan_hoi_created_id
  ON public.phan_hoi (created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_phan_hoi_teacher_pending_email
  ON public.phan_hoi ((thong_tin_bo_sung->>'email'))
  WHERE type = 'teacher_registration' AND status = 'unread';
CREATE INDEX IF NOT EXISTS idx_yeu_cau_duyet_admin_status_created_id
  ON public.yeu_cau_duyet_admin (status, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_lop_giao_vien_created
  ON public.lop (giao_vien_id, created_at DESC);
