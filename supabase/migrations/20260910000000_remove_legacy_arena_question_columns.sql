ALTER TABLE public.cau_hoi_dau
  DROP CONSTRAINT IF EXISTS cau_hoi_dau_chi_so_dap_an_dung_check;

ALTER TABLE public.cau_hoi_dau
  DROP COLUMN IF EXISTS lua_chon,
  DROP COLUMN IF EXISTS chi_so_dap_an_dung;
