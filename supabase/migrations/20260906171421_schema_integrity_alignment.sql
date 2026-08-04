SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

-- Đồng bộ hành vi xóa của các khóa ngoại theo schema hiện tại.
ALTER TABLE public."phan_hoi" DROP CONSTRAINT "phan_hoi_nguoi_dung_id_fkey";
ALTER TABLE public."phan_hoi" ADD CONSTRAINT "phan_hoi_nguoi_dung_id_fkey" FOREIGN KEY ("nguoi_dung_id") REFERENCES public."nguoi_dung" ("id") ON DELETE SET NULL;
ALTER TABLE public."phan_ung" DROP CONSTRAINT "phan_ung_khoi_id_fkey";
ALTER TABLE public."phan_ung" ADD CONSTRAINT "phan_ung_khoi_id_fkey" FOREIGN KEY ("khoi_id") REFERENCES public."khoi" ("id") ON DELETE CASCADE;
ALTER TABLE public."cau_hoi_dau" DROP CONSTRAINT "cau_hoi_dau_khoi_id_fkey";
ALTER TABLE public."cau_hoi_dau" ADD CONSTRAINT "cau_hoi_dau_khoi_id_fkey" FOREIGN KEY ("khoi_id") REFERENCES public."khoi" ("id") ON DELETE CASCADE;
ALTER TABLE public."phong_dau" DROP CONSTRAINT "phong_dau_chu_phong_id_fkey";
ALTER TABLE public."phong_dau" ADD CONSTRAINT "phong_dau_chu_phong_id_fkey" FOREIGN KEY ("chu_phong_id") REFERENCES public."nguoi_dung" ("id") ON DELETE CASCADE;
ALTER TABLE public."lich_su_dau" DROP CONSTRAINT "lich_su_dau_nguoi_dung_id_fkey";
ALTER TABLE public."lich_su_dau" ADD CONSTRAINT "lich_su_dau_nguoi_dung_id_fkey" FOREIGN KEY ("nguoi_dung_id") REFERENCES public."nguoi_dung" ("id") ON DELETE CASCADE;
ALTER TABLE public."lop" DROP CONSTRAINT "lop_khoi_id_fkey";
ALTER TABLE public."lop" ADD CONSTRAINT "lop_khoi_id_fkey" FOREIGN KEY ("khoi_id") REFERENCES public."khoi" ("id") ON DELETE CASCADE;
ALTER TABLE public."lop" DROP CONSTRAINT "lop_giao_vien_id_fkey";
ALTER TABLE public."lop" ADD CONSTRAINT "lop_giao_vien_id_fkey" FOREIGN KEY ("giao_vien_id") REFERENCES public."nguoi_dung" ("id") ON DELETE CASCADE;
ALTER TABLE public."thanh_vien_lop" DROP CONSTRAINT "thanh_vien_lop_lop_id_fkey";
ALTER TABLE public."thanh_vien_lop" ADD CONSTRAINT "thanh_vien_lop_lop_id_fkey" FOREIGN KEY ("lop_id") REFERENCES public."lop" ("id") ON DELETE CASCADE;
ALTER TABLE public."thanh_vien_lop" DROP CONSTRAINT "thanh_vien_lop_hoc_sinh_id_fkey";
ALTER TABLE public."thanh_vien_lop" ADD CONSTRAINT "thanh_vien_lop_hoc_sinh_id_fkey" FOREIGN KEY ("hoc_sinh_id") REFERENCES public."nguoi_dung" ("id") ON DELETE CASCADE;
ALTER TABLE public."bai_dang_lop" DROP CONSTRAINT "bai_dang_lop_lop_id_fkey";
ALTER TABLE public."bai_dang_lop" ADD CONSTRAINT "bai_dang_lop_lop_id_fkey" FOREIGN KEY ("lop_id") REFERENCES public."lop" ("id") ON DELETE CASCADE;
ALTER TABLE public."bai_dang_lop" DROP CONSTRAINT "bai_dang_lop_tac_gia_id_fkey";
ALTER TABLE public."bai_dang_lop" ADD CONSTRAINT "bai_dang_lop_tac_gia_id_fkey" FOREIGN KEY ("tac_gia_id") REFERENCES public."nguoi_dung" ("id") ON DELETE CASCADE;
ALTER TABLE public."bai_dang_lop" DROP CONSTRAINT "bai_dang_lop_hoc_sinh_nhan_id_fkey";
ALTER TABLE public."bai_dang_lop" ADD CONSTRAINT "bai_dang_lop_hoc_sinh_nhan_id_fkey" FOREIGN KEY ("hoc_sinh_nhan_id") REFERENCES public."nguoi_dung" ("id") ON DELETE CASCADE;
ALTER TABLE public."bai_nop" DROP CONSTRAINT "bai_nop_hoc_sinh_id_fkey";
ALTER TABLE public."bai_nop" ADD CONSTRAINT "bai_nop_hoc_sinh_id_fkey" FOREIGN KEY ("hoc_sinh_id") REFERENCES public."nguoi_dung" ("id") ON DELETE CASCADE;
ALTER TABLE public."lich_lop" DROP CONSTRAINT "lich_lop_lop_id_fkey";
ALTER TABLE public."lich_lop" ADD CONSTRAINT "lich_lop_lop_id_fkey" FOREIGN KEY ("lop_id") REFERENCES public."lop" ("id") ON DELETE CASCADE;
ALTER TABLE public."phan_hoi_hoc_lieu" ADD CONSTRAINT "phan_hoi_hoc_lieu_nguoi_dung_id_fkey" FOREIGN KEY ("nguoi_dung_id") REFERENCES public."nguoi_dung" ("id") ON DELETE CASCADE;
ALTER TABLE public."phan_hoi_hoc_lieu" ADD CONSTRAINT "phan_hoi_hoc_lieu_nguoi_tra_loi_id_fkey" FOREIGN KEY ("nguoi_tra_loi_id") REFERENCES public."nguoi_dung" ("id") ON DELETE SET NULL;
ALTER TABLE public."nhiem_vu_nguoi_dung" DROP CONSTRAINT "nhiem_vu_nguoi_dung_nguoi_dung_id_fkey";
ALTER TABLE public."nhiem_vu_nguoi_dung" ADD CONSTRAINT "nhiem_vu_nguoi_dung_nguoi_dung_id_fkey" FOREIGN KEY ("nguoi_dung_id") REFERENCES public."nguoi_dung" ("id") ON DELETE CASCADE;
ALTER TABLE public."nhiem_vu_nguoi_dung" DROP CONSTRAINT "nhiem_vu_nguoi_dung_nhiem_vu_id_fkey";
ALTER TABLE public."nhiem_vu_nguoi_dung" ADD CONSTRAINT "nhiem_vu_nguoi_dung_nhiem_vu_id_fkey" FOREIGN KEY ("nhiem_vu_id") REFERENCES public."nhiem_vu" ("id") ON DELETE CASCADE;
ALTER TABLE public."thao_luan" DROP CONSTRAINT "thao_luan_nguoi_dung_id_fkey";
ALTER TABLE public."thao_luan" ADD CONSTRAINT "thao_luan_nguoi_dung_id_fkey" FOREIGN KEY ("nguoi_dung_id") REFERENCES public."nguoi_dung" ("id") ON DELETE CASCADE;
ALTER TABLE public."thao_luan" DROP CONSTRAINT "thao_luan_cha_id_fkey";
ALTER TABLE public."thao_luan" ADD CONSTRAINT "thao_luan_cha_id_fkey" FOREIGN KEY ("cha_id") REFERENCES public."thao_luan" ("id") ON DELETE CASCADE;
ALTER TABLE public."ghi_chu" DROP CONSTRAINT "ghi_chu_nguoi_dung_id_fkey";
ALTER TABLE public."ghi_chu" ADD CONSTRAINT "ghi_chu_nguoi_dung_id_fkey" FOREIGN KEY ("nguoi_dung_id") REFERENCES public."nguoi_dung" ("id") ON DELETE CASCADE;

-- Các ngày cũ không thể khôi phục: dùng mốc chuẩn hóa, không coi là lịch sử gốc.
-- Danh sách giá trị trước khi sửa đã lưu trong bản sao cục bộ của phiên cập nhật.
UPDATE public.bai_hoc
SET created_at = COALESCE(created_at, updated_at, now()),
    updated_at = COALESCE(updated_at, created_at, now())
WHERE created_at IS NULL OR updated_at IS NULL;

COMMENT ON COLUMN public.bai_hoc.created_at IS
  'Thời điểm tạo; các bản ghi legacy thiếu ngày trước 06/09/2026 dùng mốc chuẩn hóa trong migration schema_integrity_alignment, không phải ngày tạo lịch sử đã được xác minh.';
COMMENT ON COLUMN public.bai_hoc.updated_at IS
  'Thời điểm cập nhật; các giá trị legacy thiếu ngày được chuẩn hóa trong migration schema_integrity_alignment.';

ALTER TABLE public.bai_hoc
  ALTER COLUMN khoi_id TYPE integer USING khoi_id::integer,
  ALTER COLUMN thu_tu TYPE integer USING thu_tu::integer;

ALTER TABLE public."nguoi_dung"
  ALTER COLUMN "role" SET DEFAULT 'student',
  ALTER COLUMN "role" SET NOT NULL,
  ALTER COLUMN "diem_kinh_nghiem" SET DEFAULT 0,
  ALTER COLUMN "diem_kinh_nghiem" SET NOT NULL,
  ALTER COLUMN "cap_do" SET DEFAULT 1,
  ALTER COLUMN "cap_do" SET NOT NULL,
  ALTER COLUMN "thong_ke_dau" SET DEFAULT '{"total":0,"wins":0,"losses":0,"points":0}'::jsonb,
  ALTER COLUMN "thong_ke_dau" SET NOT NULL,
  ALTER COLUMN "phut_hoat_dong" SET DEFAULT 0,
  ALTER COLUMN "phut_hoat_dong" SET NOT NULL,
  ALTER COLUMN "hoat_dong_cuoi_luc" SET DEFAULT now(),
  ALTER COLUMN "hoat_dong_cuoi_luc" SET NOT NULL,
  ALTER COLUMN "bi_khoa" SET DEFAULT false,
  ALTER COLUMN "bi_khoa" SET NOT NULL,
  ALTER COLUMN "so_ngay_chuoi" SET DEFAULT 0,
  ALTER COLUMN "so_ngay_chuoi" SET NOT NULL,
  ALTER COLUMN "phut_online_hom_nay" SET DEFAULT 0,
  ALTER COLUMN "phut_online_hom_nay" SET NOT NULL,
  ALTER COLUMN "da_hoan_thanh_bai_hom_nay" SET DEFAULT false,
  ALTER COLUMN "da_hoan_thanh_bai_hom_nay" SET NOT NULL,
  ALTER COLUMN "tai_khoan_lien_ket" SET DEFAULT '{}'::jsonb,
  ALTER COLUMN "tai_khoan_lien_ket" SET NOT NULL,
  ALTER COLUMN "ke_hoach_hoc" SET DEFAULT '{"emailEnabled":false,"dailyLessonTarget":1,"completed":false}'::jsonb,
  ALTER COLUMN "ke_hoach_hoc" SET NOT NULL,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL,
  ALTER COLUMN "updated_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE public."bai_hoc"
  ALTER COLUMN "chuong_trinh_id" SET DEFAULT 'ketnoi',
  ALTER COLUMN "tieu_de" SET NOT NULL,
  ALTER COLUMN "module_ly_thuyet" SET DEFAULT '[]'::jsonb,
  ALTER COLUMN "module_ly_thuyet" SET NOT NULL,
  ALTER COLUMN "module_video" SET DEFAULT '[]'::jsonb,
  ALTER COLUMN "module_video" SET NOT NULL,
  ALTER COLUMN "cau_do" SET DEFAULT '[]'::jsonb,
  ALTER COLUMN "cau_do" SET NOT NULL,
  ALTER COLUMN "slide_cau_chuyen" SET DEFAULT '[]'::jsonb,
  ALTER COLUMN "slide_cau_chuyen" SET NOT NULL,
  ALTER COLUMN "thu_thach" SET DEFAULT '[]'::jsonb,
  ALTER COLUMN "thu_thach" SET NOT NULL,
  ALTER COLUMN "tro_choi" SET DEFAULT '{}'::jsonb,
  ALTER COLUMN "tro_choi" SET NOT NULL,
  ALTER COLUMN "tra_phi" SET DEFAULT false,
  ALTER COLUMN "tra_phi" SET NOT NULL,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL,
  ALTER COLUMN "updated_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE public."tien_do_nguoi_dung"
  ALTER COLUMN "noi_dung_tien_do" SET DEFAULT '{}'::jsonb,
  ALTER COLUMN "mo_khoa_luc" SET DEFAULT now(),
  ALTER COLUMN "updated_at" SET DEFAULT now();

ALTER TABLE public."phan_hoi"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "type" SET DEFAULT 'suggestion',
  ALTER COLUMN "type" SET NOT NULL,
  ALTER COLUMN "status" SET DEFAULT 'unread',
  ALTER COLUMN "status" SET NOT NULL,
  ALTER COLUMN "da_duyet" SET DEFAULT false,
  ALTER COLUMN "da_duyet" SET NOT NULL,
  ALTER COLUMN "thong_tin_bo_sung" SET DEFAULT '{}'::jsonb,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE public."yeu_cau_duyet_admin"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "approver_ids" SET DEFAULT '[]'::jsonb,
  ALTER COLUMN "payload" SET DEFAULT '{}'::jsonb,
  ALTER COLUMN "status" SET DEFAULT 'pending',
  ALTER COLUMN "result" SET DEFAULT '{}'::jsonb,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" SET DEFAULT now(),
  ALTER COLUMN "expires_at" SET DEFAULT (now() + interval '7 days');

ALTER TABLE public."hoa_chat"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "la_chat_khoi_dau" SET DEFAULT false,
  ALTER COLUMN "la_chat_khoi_dau" SET NOT NULL,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE public."phan_ung"
  ALTER COLUMN "can_nhiet" SET DEFAULT false,
  ALTER COLUMN "can_nhiet" SET NOT NULL,
  ALTER COLUMN "muc_do_nguy_hiem" SET DEFAULT 0,
  ALTER COLUMN "muc_do_nguy_hiem" SET NOT NULL,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE public."cau_hoi_dau"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "khoi_id" SET DEFAULT 8,
  ALTER COLUMN "do_kho" SET DEFAULT 'easy',
  ALTER COLUMN "do_kho" SET NOT NULL,
  ALTER COLUMN "lua_chon" SET DEFAULT '[]'::jsonb,
  ALTER COLUMN "diem" SET DEFAULT 10,
  ALTER COLUMN "diem" SET NOT NULL,
  ALTER COLUMN "loai_game" SET DEFAULT 'calculation',
  ALTER COLUMN "noi_dung_game" SET DEFAULT '{}'::jsonb,
  ALTER COLUMN "dap_an" SET DEFAULT '{}'::jsonb,
  ALTER COLUMN "gioi_han_giay" SET DEFAULT 45,
  ALTER COLUMN "dang_hoat_dong" SET DEFAULT true,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE public."phong_dau"
  ALTER COLUMN "che_do" SET DEFAULT 'solo',
  ALTER COLUMN "che_do" SET NOT NULL,
  ALTER COLUMN "do_kho" SET DEFAULT 'auto',
  ALTER COLUMN "do_kho" SET NOT NULL,
  ALTER COLUMN "status" SET DEFAULT 'waiting',
  ALTER COLUMN "status" SET NOT NULL,
  ALTER COLUMN "so_nguoi_toi_da" SET DEFAULT 2,
  ALTER COLUMN "so_nguoi_toi_da" SET NOT NULL,
  ALTER COLUMN "so_nguoi_hien_tai" SET DEFAULT 1,
  ALTER COLUMN "so_nguoi_hien_tai" SET NOT NULL,
  ALTER COLUMN "danh_sach_cau_hoi_id" SET DEFAULT ARRAY[]::uuid[],
  ALTER COLUMN "vong_hien_tai" SET DEFAULT 0,
  ALTER COLUMN "la_luyen_tap" SET DEFAULT false,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE public."nguoi_choi"
  ALTER COLUMN "score" SET DEFAULT 0,
  ALTER COLUMN "so_cau_dung" SET DEFAULT 0,
  ALTER COLUMN "vong_da_tra_loi" SET DEFAULT ARRAY[]::integer[],
  ALTER COLUMN "status" SET DEFAULT 'joined',
  ALTER COLUMN "tham_gia_luc" SET DEFAULT now(),
  ALTER COLUMN "xem_cuoi_luc" SET DEFAULT now();

ALTER TABLE public."tra_loi_vong"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "noi_dung_tra_loi" SET DEFAULT '{}'::jsonb,
  ALTER COLUMN "dung" SET DEFAULT false,
  ALTER COLUMN "diem_duoc_cong" SET DEFAULT 0,
  ALTER COLUMN "nop_luc" SET DEFAULT now();

ALTER TABLE public."lich_su_dau"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "diem" SET DEFAULT 0,
  ALTER COLUMN "diem" SET NOT NULL,
  ALTER COLUMN "diem_thay_doi" SET DEFAULT 0,
  ALTER COLUMN "diem_thay_doi" SET NOT NULL,
  ALTER COLUMN "dau_luc" SET DEFAULT now(),
  ALTER COLUMN "dau_luc" SET NOT NULL;

ALTER TABLE public."lop"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE public."thanh_vien_lop"
  ALTER COLUMN "tham_gia_luc" SET DEFAULT now(),
  ALTER COLUMN "tham_gia_luc" SET NOT NULL;

ALTER TABLE public."bai_dang_lop"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "type" SET DEFAULT 'announcement',
  ALTER COLUMN "type" SET NOT NULL,
  ALTER COLUMN "cau_hoi" SET DEFAULT '[]'::jsonb,
  ALTER COLUMN "cau_hoi" SET NOT NULL,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE public."bai_nop"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "status" SET DEFAULT 'submitted',
  ALTER COLUMN "status" SET NOT NULL,
  ALTER COLUMN "cau_tra_loi" SET DEFAULT '[]'::jsonb,
  ALTER COLUMN "cau_tra_loi" SET NOT NULL,
  ALTER COLUMN "nop_luc" SET DEFAULT now(),
  ALTER COLUMN "nop_luc" SET NOT NULL;

ALTER TABLE public."lich_lop"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE public."hoc_lieu"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "luot_xem" SET DEFAULT 0,
  ALTER COLUMN "luot_xem" SET NOT NULL,
  ALTER COLUMN "luot_tai" SET DEFAULT 0,
  ALTER COLUMN "luot_tai" SET NOT NULL,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE public."phan_hoi_hoc_lieu"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE public."nhiem_vu"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "so_luong_muc_tieu" SET DEFAULT 1,
  ALTER COLUMN "thuong_xp" SET DEFAULT 50,
  ALTER COLUMN "thuong_xp" SET NOT NULL,
  ALTER COLUMN "type" SET DEFAULT 'daily',
  ALTER COLUMN "type" SET NOT NULL,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE public."nhiem_vu_nguoi_dung"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "so_luong_hien_tai" SET DEFAULT 0,
  ALTER COLUMN "so_luong_hien_tai" SET NOT NULL,
  ALTER COLUMN "da_hoan_thanh" SET DEFAULT false,
  ALTER COLUMN "da_hoan_thanh" SET NOT NULL,
  ALTER COLUMN "da_nhan" SET DEFAULT false,
  ALTER COLUMN "da_nhan" SET NOT NULL,
  ALTER COLUMN "dat_lai_cuoi_luc" SET DEFAULT now(),
  ALTER COLUMN "dat_lai_cuoi_luc" SET NOT NULL,
  ALTER COLUMN "updated_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE public."thao_luan"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "luot_thich" SET DEFAULT 0,
  ALTER COLUMN "luot_thich" SET NOT NULL,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL;

ALTER TABLE public."ghi_chu"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "updated_at" SET DEFAULT now(),
  ALTER COLUMN "updated_at" SET NOT NULL;

ALTER TABLE public."hoat_dong_nguoi_dung"
  ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
  ALTER COLUMN "thong_tin_bo_sung" SET DEFAULT '{}'::jsonb,
  ALTER COLUMN "thong_tin_bo_sung" SET NOT NULL,
  ALTER COLUMN "created_at" SET DEFAULT now(),
  ALTER COLUMN "created_at" SET NOT NULL;

CREATE OR REPLACE FUNCTION public.set_bai_hoc_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := pg_catalog.now();
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.set_bai_hoc_updated_at() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.set_bai_hoc_updated_at() TO service_role;
DROP TRIGGER IF EXISTS set_bai_hoc_updated_at ON public.bai_hoc;
CREATE TRIGGER set_bai_hoc_updated_at
  BEFORE UPDATE ON public.bai_hoc
  FOR EACH ROW EXECUTE FUNCTION public.set_bai_hoc_updated_at();

NOTIFY pgrst, 'reload schema';
