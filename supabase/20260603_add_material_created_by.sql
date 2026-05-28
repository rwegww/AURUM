BEGIN;

ALTER TABLE IF EXISTS public.hoc_lieu
  ADD COLUMN IF NOT EXISTS nguoi_tao_id text REFERENCES public.nguoi_dung(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_hoc_lieu_nguoi_tao_id
  ON public.hoc_lieu (nguoi_tao_id);

NOTIFY pgrst, 'reload schema';

COMMIT;
