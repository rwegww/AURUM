-- Cho phép giáo viên xóa học liệu cùng toàn bộ phản hồi phụ thuộc.
ALTER TABLE public.phan_hoi_hoc_lieu
  DROP CONSTRAINT IF EXISTS phan_hoi_hoc_lieu_hoc_lieu_id_fkey;

ALTER TABLE public.phan_hoi_hoc_lieu
  ADD CONSTRAINT phan_hoi_hoc_lieu_hoc_lieu_id_fkey
  FOREIGN KEY (hoc_lieu_id)
  REFERENCES public.hoc_lieu(id)
  ON DELETE CASCADE;
