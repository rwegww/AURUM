SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- Công thức cấp độ đang được API và RPC sử dụng: mỗi 1.000 XP tăng một cấp.
UPDATE public.nguoi_dung
SET cap_do = floor(diem_kinh_nghiem::numeric / 1000)::integer + 1,
    updated_at = now()
WHERE cap_do IS DISTINCT FROM floor(diem_kinh_nghiem::numeric / 1000)::integer + 1;

-- Bổ sung chất đã có trong danh mục biên soạn src/data/reactions/chemicals.js.
INSERT INTO public.hoa_chat (cong_thuc, ten, trang_thai_vat_chat, mau_sac, danh_muc, la_chat_khoi_dau)
VALUES ('HClO', 'Axit Hipoclorơ', 'liquid', 'rgba(255,255,255,0.2)', 'Axit', false)
ON CONFLICT (cong_thuc) DO NOTHING;

-- Phản ứng tạo amoni sunfat cần hai phân tử NH3.
UPDATE public.phan_ung r
SET chat_tham_gia = (
      SELECT jsonb_agg(
        CASE WHEN translate(item->>'formula', '₀₁₂₃₄₅₆₇₈₉', '0123456789') = 'NH3'
          THEN jsonb_set(item, '{coeff}', '2'::jsonb)
          ELSE item END ORDER BY ordinal
      ) FROM jsonb_array_elements(r.chat_tham_gia) WITH ORDINALITY AS species(item, ordinal)
    ),
    phuong_trinh = '2NH₃ + H₂SO₄ → (NH₄)₂SO₄'
WHERE r.id = 'rx_full_283'
  AND r.phuong_trinh = 'NH₃ + H₂SO₄ → (NH₄)₂SO₄';

-- Hai phản ứng dùng polymer/phức tinh bột được giữ nguyên nội dung biên soạn;
-- bộ lọc Lab hiện tại sẽ tiếp tục loại các công thức mà engine chưa hỗ trợ.

CREATE INDEX IF NOT EXISTS idx_phong_dau_nguoi_thang_id ON public.phong_dau (nguoi_thang_id);
CREATE INDEX IF NOT EXISTS idx_tra_loi_vong_cau_hoi_id ON public.tra_loi_vong (cau_hoi_id);
CREATE INDEX IF NOT EXISTS idx_tra_loi_vong_nguoi_dung_id ON public.tra_loi_vong (nguoi_dung_id);
CREATE INDEX IF NOT EXISTS idx_phan_hoi_hoc_lieu_nguoi_tra_loi_id ON public.phan_hoi_hoc_lieu (nguoi_tra_loi_id);
DROP INDEX IF EXISTS public.idx_nhiem_vu_nguoi_dung_user;

NOTIFY pgrst, 'reload schema';
