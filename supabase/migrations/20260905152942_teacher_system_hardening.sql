-- Siết luồng ghi của hệ giáo viên, tăng lượt tải nguyên tử và bổ sung chỉ mục truy vấn.

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

CREATE INDEX IF NOT EXISTS idx_thanh_vien_lop_lop_tham_gia
  ON public.thanh_vien_lop (lop_id, tham_gia_luc DESC);
CREATE INDEX IF NOT EXISTS idx_bai_dang_lop_lop_type_created
  ON public.bai_dang_lop (lop_id, type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bai_dang_lop_assignment_deadline
  ON public.bai_dang_lop (lop_id, han_nop)
  WHERE type = 'assignment';
CREATE INDEX IF NOT EXISTS idx_bai_dang_lop_lop_target_created
  ON public.bai_dang_lop (lop_id, hoc_sinh_nhan_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bai_nop_bai_dang_nop_luc
  ON public.bai_nop (bai_dang_id, nop_luc DESC);
CREATE INDEX IF NOT EXISTS idx_lich_lop_lop_bat_dau
  ON public.lich_lop (lop_id, bat_dau_luc);
CREATE INDEX IF NOT EXISTS idx_phan_hoi_hoc_lieu_hoc_lieu_created
  ON public.phan_hoi_hoc_lieu (hoc_lieu_id, created_at DESC);

-- Mọi thay đổi nghiệp vụ đi qua API Express dùng service role; client chỉ đọc trực tiếp.
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

REVOKE ALL ON FUNCTION public.increment_material_download(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_material_download(uuid) TO service_role;
