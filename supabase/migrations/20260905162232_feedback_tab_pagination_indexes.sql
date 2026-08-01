-- Phân trang hai nhóm phản hồi độc lập mà không phải sắp xếp toàn bộ bảng.
CREATE INDEX IF NOT EXISTS idx_phan_hoi_teacher_created_id
  ON public.phan_hoi (created_at DESC, id DESC)
  WHERE type = 'teacher_registration';

CREATE INDEX IF NOT EXISTS idx_phan_hoi_general_created_id
  ON public.phan_hoi (created_at DESC, id DESC)
  WHERE type <> 'teacher_registration';
