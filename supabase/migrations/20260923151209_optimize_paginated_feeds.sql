-- Hỗ trợ tải học liệu theo từng trang với thứ tự ổn định.
CREATE INDEX IF NOT EXISTS idx_hoc_lieu_created_id
  ON public.hoc_lieu (created_at DESC, id DESC);

-- Hỗ trợ phân trang bình luận gốc theo bài học và lấy phản hồi theo cha_id.
CREATE INDEX IF NOT EXISTS idx_thao_luan_bai_hoc_cha_created_id
  ON public.thao_luan (bai_hoc_id, cha_id, created_at DESC, id DESC);

-- Hỗ trợ feed lớp học theo thứ tự mới nhất.
CREATE INDEX IF NOT EXISTS idx_bai_dang_lop_lop_created_id
  ON public.bai_dang_lop (lop_id, created_at DESC, id DESC);
