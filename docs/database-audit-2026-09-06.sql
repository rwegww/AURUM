-- Kiểm tra dữ liệu AURUM; chỉ đọc, không gọi RPC ghi dữ liệu.
-- Đối chiếu schema ở commit 22f9f33, project mwtrcaadhnjhrzcrntou.
-- rows.* là số bản ghi; các kiểm tra khác có count > 0 cần được xem xét.
-- Định dạng quiz nhóm và tin nhắn gửi giáo viên đã được xét theo logic ứng dụng.
BEGIN TRANSACTION READ ONLY;
SET LOCAL statement_timeout = '30s';
SELECT 'rows.phan_ung' AS check_name, count(*) AS count FROM public."phan_ung" t
UNION ALL
SELECT 'rows.cau_hoi_dau' AS check_name, count(*) AS count FROM public."cau_hoi_dau" t
UNION ALL
SELECT 'rows.lich_su_dau' AS check_name, count(*) AS count FROM public."lich_su_dau" t
UNION ALL
SELECT 'rows.tien_do_nguoi_dung' AS check_name, count(*) AS count FROM public."tien_do_nguoi_dung" t
UNION ALL
SELECT 'rows.phong_dau' AS check_name, count(*) AS count FROM public."phong_dau" t
UNION ALL
SELECT 'rows.nguoi_choi' AS check_name, count(*) AS count FROM public."nguoi_choi" t
UNION ALL
SELECT 'rows.tra_loi_vong' AS check_name, count(*) AS count FROM public."tra_loi_vong" t
UNION ALL
SELECT 'rows.khoi' AS check_name, count(*) AS count FROM public."khoi" t
UNION ALL
SELECT 'rows.yeu_cau_duyet_admin' AS check_name, count(*) AS count FROM public."yeu_cau_duyet_admin" t
UNION ALL
SELECT 'rows.hoa_chat' AS check_name, count(*) AS count FROM public."hoa_chat" t
UNION ALL
SELECT 'rows.nhiem_vu' AS check_name, count(*) AS count FROM public."nhiem_vu" t
UNION ALL
SELECT 'rows.nhiem_vu_nguoi_dung' AS check_name, count(*) AS count FROM public."nhiem_vu_nguoi_dung" t
UNION ALL
SELECT 'rows.lop' AS check_name, count(*) AS count FROM public."lop" t
UNION ALL
SELECT 'rows.thanh_vien_lop' AS check_name, count(*) AS count FROM public."thanh_vien_lop" t
UNION ALL
SELECT 'rows.bai_dang_lop' AS check_name, count(*) AS count FROM public."bai_dang_lop" t
UNION ALL
SELECT 'rows.phan_hoi' AS check_name, count(*) AS count FROM public."phan_hoi" t
UNION ALL
SELECT 'rows.bai_nop' AS check_name, count(*) AS count FROM public."bai_nop" t
UNION ALL
SELECT 'rows.lich_lop' AS check_name, count(*) AS count FROM public."lich_lop" t
UNION ALL
SELECT 'rows.hoc_lieu' AS check_name, count(*) AS count FROM public."hoc_lieu" t
UNION ALL
SELECT 'rows.phan_hoi_hoc_lieu' AS check_name, count(*) AS count FROM public."phan_hoi_hoc_lieu" t
UNION ALL
SELECT 'rows.bai_hoc' AS check_name, count(*) AS count FROM public."bai_hoc" t
UNION ALL
SELECT 'rows.thao_luan' AS check_name, count(*) AS count FROM public."thao_luan" t
UNION ALL
SELECT 'rows.ghi_chu' AS check_name, count(*) AS count FROM public."ghi_chu" t
UNION ALL
SELECT 'rows.hoat_dong_nguoi_dung' AS check_name, count(*) AS count FROM public."hoat_dong_nguoi_dung" t
UNION ALL
SELECT 'rows.nguoi_dung' AS check_name, count(*) AS count FROM public."nguoi_dung" t
UNION ALL
SELECT 'orphan.phan_ung_khoi_id_fkey' AS check_name, count(*) AS count FROM public."phan_ung" t WHERE t."khoi_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."khoi" p WHERE p."id"=t."khoi_id")
UNION ALL
SELECT 'orphan.cau_hoi_dau_khoi_id_fkey' AS check_name, count(*) AS count FROM public."cau_hoi_dau" t WHERE t."khoi_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."khoi" p WHERE p."id"=t."khoi_id")
UNION ALL
SELECT 'orphan.lich_su_dau_nguoi_dung_id_fkey' AS check_name, count(*) AS count FROM public."lich_su_dau" t WHERE t."nguoi_dung_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."nguoi_dung_id")
UNION ALL
SELECT 'orphan.lich_su_dau_phong_dau_id_fkey' AS check_name, count(*) AS count FROM public."lich_su_dau" t WHERE t."phong_dau_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."phong_dau" p WHERE p."id"=t."phong_dau_id")
UNION ALL
SELECT 'orphan.tien_do_nguoi_dung_nguoi_dung_id_fkey' AS check_name, count(*) AS count FROM public."tien_do_nguoi_dung" t WHERE t."nguoi_dung_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."nguoi_dung_id")
UNION ALL
SELECT 'orphan.phong_dau_chu_phong_id_fkey' AS check_name, count(*) AS count FROM public."phong_dau" t WHERE t."chu_phong_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."chu_phong_id")
UNION ALL
SELECT 'orphan.phong_dau_nguoi_thang_id_fkey' AS check_name, count(*) AS count FROM public."phong_dau" t WHERE t."nguoi_thang_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."nguoi_thang_id")
UNION ALL
SELECT 'orphan.nguoi_choi_nguoi_dung_id_fkey' AS check_name, count(*) AS count FROM public."nguoi_choi" t WHERE t."nguoi_dung_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."nguoi_dung_id")
UNION ALL
SELECT 'orphan.nguoi_choi_phong_dau_id_fkey' AS check_name, count(*) AS count FROM public."nguoi_choi" t WHERE t."phong_dau_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."phong_dau" p WHERE p."id"=t."phong_dau_id")
UNION ALL
SELECT 'orphan.tra_loi_vong_cau_hoi_id_fkey' AS check_name, count(*) AS count FROM public."tra_loi_vong" t WHERE t."cau_hoi_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."cau_hoi_dau" p WHERE p."id"=t."cau_hoi_id")
UNION ALL
SELECT 'orphan.tra_loi_vong_nguoi_dung_id_fkey' AS check_name, count(*) AS count FROM public."tra_loi_vong" t WHERE t."nguoi_dung_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."nguoi_dung_id")
UNION ALL
SELECT 'orphan.tra_loi_vong_phong_dau_id_fkey' AS check_name, count(*) AS count FROM public."tra_loi_vong" t WHERE t."phong_dau_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."phong_dau" p WHERE p."id"=t."phong_dau_id")
UNION ALL
SELECT 'orphan.yeu_cau_duyet_admin_executed_by_fkey' AS check_name, count(*) AS count FROM public."yeu_cau_duyet_admin" t WHERE t."executed_by" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."executed_by")
UNION ALL
SELECT 'orphan.yeu_cau_duyet_admin_requested_by_fkey' AS check_name, count(*) AS count FROM public."yeu_cau_duyet_admin" t WHERE t."requested_by" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."requested_by")
UNION ALL
SELECT 'orphan.nhiem_vu_nguoi_dung_nguoi_dung_id_fkey' AS check_name, count(*) AS count FROM public."nhiem_vu_nguoi_dung" t WHERE t."nguoi_dung_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."nguoi_dung_id")
UNION ALL
SELECT 'orphan.nhiem_vu_nguoi_dung_nhiem_vu_id_fkey' AS check_name, count(*) AS count FROM public."nhiem_vu_nguoi_dung" t WHERE t."nhiem_vu_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nhiem_vu" p WHERE p."id"=t."nhiem_vu_id")
UNION ALL
SELECT 'orphan.lop_giao_vien_id_fkey' AS check_name, count(*) AS count FROM public."lop" t WHERE t."giao_vien_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."giao_vien_id")
UNION ALL
SELECT 'orphan.lop_khoi_id_fkey' AS check_name, count(*) AS count FROM public."lop" t WHERE t."khoi_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."khoi" p WHERE p."id"=t."khoi_id")
UNION ALL
SELECT 'orphan.thanh_vien_lop_hoc_sinh_id_fkey' AS check_name, count(*) AS count FROM public."thanh_vien_lop" t WHERE t."hoc_sinh_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."hoc_sinh_id")
UNION ALL
SELECT 'orphan.thanh_vien_lop_lop_id_fkey' AS check_name, count(*) AS count FROM public."thanh_vien_lop" t WHERE t."lop_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."lop" p WHERE p."id"=t."lop_id")
UNION ALL
SELECT 'orphan.bai_dang_lop_hoc_sinh_nhan_id_fkey' AS check_name, count(*) AS count FROM public."bai_dang_lop" t WHERE t."hoc_sinh_nhan_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."hoc_sinh_nhan_id")
UNION ALL
SELECT 'orphan.bai_dang_lop_lop_id_fkey' AS check_name, count(*) AS count FROM public."bai_dang_lop" t WHERE t."lop_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."lop" p WHERE p."id"=t."lop_id")
UNION ALL
SELECT 'orphan.bai_dang_lop_tac_gia_id_fkey' AS check_name, count(*) AS count FROM public."bai_dang_lop" t WHERE t."tac_gia_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."tac_gia_id")
UNION ALL
SELECT 'orphan.phan_hoi_nguoi_dung_id_fkey' AS check_name, count(*) AS count FROM public."phan_hoi" t WHERE t."nguoi_dung_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."nguoi_dung_id")
UNION ALL
SELECT 'orphan.bai_nop_bai_dang_id_fkey' AS check_name, count(*) AS count FROM public."bai_nop" t WHERE t."bai_dang_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."bai_dang_lop" p WHERE p."id"=t."bai_dang_id")
UNION ALL
SELECT 'orphan.bai_nop_hoc_sinh_id_fkey' AS check_name, count(*) AS count FROM public."bai_nop" t WHERE t."hoc_sinh_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."hoc_sinh_id")
UNION ALL
SELECT 'orphan.lich_lop_lop_id_fkey' AS check_name, count(*) AS count FROM public."lich_lop" t WHERE t."lop_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."lop" p WHERE p."id"=t."lop_id")
UNION ALL
SELECT 'orphan.hoc_lieu_nguoi_tao_id_fkey' AS check_name, count(*) AS count FROM public."hoc_lieu" t WHERE t."nguoi_tao_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."nguoi_tao_id")
UNION ALL
SELECT 'orphan.phan_hoi_hoc_lieu_hoc_lieu_id_fkey' AS check_name, count(*) AS count FROM public."phan_hoi_hoc_lieu" t WHERE t."hoc_lieu_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."hoc_lieu" p WHERE p."id"=t."hoc_lieu_id")
UNION ALL
SELECT 'orphan.bai_hoc_khoi_id_fkey' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE t."khoi_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."khoi" p WHERE p."id"=t."khoi_id")
UNION ALL
SELECT 'orphan.thao_luan_bai_hoc_id_fkey' AS check_name, count(*) AS count FROM public."thao_luan" t WHERE t."bai_hoc_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."bai_hoc" p WHERE p."id"=t."bai_hoc_id")
UNION ALL
SELECT 'orphan.thao_luan_cha_id_fkey' AS check_name, count(*) AS count FROM public."thao_luan" t WHERE t."cha_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."thao_luan" p WHERE p."id"=t."cha_id")
UNION ALL
SELECT 'orphan.thao_luan_nguoi_dung_id_fkey' AS check_name, count(*) AS count FROM public."thao_luan" t WHERE t."nguoi_dung_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."nguoi_dung_id")
UNION ALL
SELECT 'orphan.ghi_chu_bai_hoc_id_fkey' AS check_name, count(*) AS count FROM public."ghi_chu" t WHERE t."bai_hoc_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."bai_hoc" p WHERE p."id"=t."bai_hoc_id")
UNION ALL
SELECT 'orphan.ghi_chu_nguoi_dung_id_fkey' AS check_name, count(*) AS count FROM public."ghi_chu" t WHERE t."nguoi_dung_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."nguoi_dung_id")
UNION ALL
SELECT 'orphan.hoat_dong_nguoi_dung_nguoi_dung_id_fkey' AS check_name, count(*) AS count FROM public."hoat_dong_nguoi_dung" t WHERE t."nguoi_dung_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public."nguoi_dung" p WHERE p."id"=t."nguoi_dung_id")
UNION ALL
SELECT 'null.nguoi_dung.role' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "role" IS NULL
UNION ALL
SELECT 'null.nguoi_dung.diem_kinh_nghiem' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "diem_kinh_nghiem" IS NULL
UNION ALL
SELECT 'null.nguoi_dung.cap_do' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "cap_do" IS NULL
UNION ALL
SELECT 'null.nguoi_dung.thong_ke_dau' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "thong_ke_dau" IS NULL
UNION ALL
SELECT 'json_shape.nguoi_dung.thong_ke_dau' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "thong_ke_dau" IS NOT NULL AND jsonb_typeof("thong_ke_dau") NOT IN ('object')
UNION ALL
SELECT 'null.nguoi_dung.phut_hoat_dong' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "phut_hoat_dong" IS NULL
UNION ALL
SELECT 'null.nguoi_dung.hoat_dong_cuoi_luc' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "hoat_dong_cuoi_luc" IS NULL
UNION ALL
SELECT 'null.nguoi_dung.bi_khoa' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "bi_khoa" IS NULL
UNION ALL
SELECT 'null.nguoi_dung.so_ngay_chuoi' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "so_ngay_chuoi" IS NULL
UNION ALL
SELECT 'null.nguoi_dung.phut_online_hom_nay' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "phut_online_hom_nay" IS NULL
UNION ALL
SELECT 'null.nguoi_dung.da_hoan_thanh_bai_hom_nay' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "da_hoan_thanh_bai_hom_nay" IS NULL
UNION ALL
SELECT 'null.nguoi_dung.tai_khoan_lien_ket' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "tai_khoan_lien_ket" IS NULL
UNION ALL
SELECT 'json_shape.nguoi_dung.tai_khoan_lien_ket' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "tai_khoan_lien_ket" IS NOT NULL AND jsonb_typeof("tai_khoan_lien_ket") NOT IN ('object')
UNION ALL
SELECT 'null.nguoi_dung.ke_hoach_hoc' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "ke_hoach_hoc" IS NULL
UNION ALL
SELECT 'json_shape.nguoi_dung.ke_hoach_hoc' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "ke_hoach_hoc" IS NOT NULL AND jsonb_typeof("ke_hoach_hoc") NOT IN ('object')
UNION ALL
SELECT 'null.nguoi_dung.created_at' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "created_at" IS NULL
UNION ALL
SELECT 'null.nguoi_dung.updated_at' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE "updated_at" IS NULL
UNION ALL
SELECT 'null.bai_hoc.tieu_de' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "tieu_de" IS NULL
UNION ALL
SELECT 'null.bai_hoc.module_ly_thuyet' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "module_ly_thuyet" IS NULL
UNION ALL
SELECT 'json_shape.bai_hoc.module_ly_thuyet' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "module_ly_thuyet" IS NOT NULL AND jsonb_typeof("module_ly_thuyet") NOT IN ('array')
UNION ALL
SELECT 'null.bai_hoc.module_video' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "module_video" IS NULL
UNION ALL
SELECT 'json_shape.bai_hoc.module_video' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "module_video" IS NOT NULL AND jsonb_typeof("module_video") NOT IN ('array')
UNION ALL
SELECT 'null.bai_hoc.cau_do' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "cau_do" IS NULL
UNION ALL
SELECT 'json_shape.bai_hoc.cau_do' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "cau_do" IS NOT NULL AND jsonb_typeof("cau_do") NOT IN ('array','object')
UNION ALL
SELECT 'null.bai_hoc.slide_cau_chuyen' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "slide_cau_chuyen" IS NULL
UNION ALL
SELECT 'json_shape.bai_hoc.slide_cau_chuyen' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "slide_cau_chuyen" IS NOT NULL AND jsonb_typeof("slide_cau_chuyen") NOT IN ('array')
UNION ALL
SELECT 'null.bai_hoc.thu_thach' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "thu_thach" IS NULL
UNION ALL
SELECT 'json_shape.bai_hoc.thu_thach' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "thu_thach" IS NOT NULL AND jsonb_typeof("thu_thach") NOT IN ('array')
UNION ALL
SELECT 'null.bai_hoc.tro_choi' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "tro_choi" IS NULL
UNION ALL
SELECT 'json_shape.bai_hoc.tro_choi' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "tro_choi" IS NOT NULL AND jsonb_typeof("tro_choi") NOT IN ('object')
UNION ALL
SELECT 'null.bai_hoc.tra_phi' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "tra_phi" IS NULL
UNION ALL
SELECT 'null.bai_hoc.created_at' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "created_at" IS NULL
UNION ALL
SELECT 'null.bai_hoc.updated_at' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE "updated_at" IS NULL
UNION ALL
SELECT 'json_shape.tien_do_nguoi_dung.noi_dung_tien_do' AS check_name, count(*) AS count FROM public."tien_do_nguoi_dung" t WHERE "noi_dung_tien_do" IS NOT NULL AND jsonb_typeof("noi_dung_tien_do") NOT IN ('object')
UNION ALL
SELECT 'null.phan_hoi.type' AS check_name, count(*) AS count FROM public."phan_hoi" t WHERE "type" IS NULL
UNION ALL
SELECT 'null.phan_hoi.status' AS check_name, count(*) AS count FROM public."phan_hoi" t WHERE "status" IS NULL
UNION ALL
SELECT 'null.phan_hoi.da_duyet' AS check_name, count(*) AS count FROM public."phan_hoi" t WHERE "da_duyet" IS NULL
UNION ALL
SELECT 'json_shape.phan_hoi.thong_tin_bo_sung' AS check_name, count(*) AS count FROM public."phan_hoi" t WHERE "thong_tin_bo_sung" IS NOT NULL AND jsonb_typeof("thong_tin_bo_sung") NOT IN ('object')
UNION ALL
SELECT 'null.phan_hoi.created_at' AS check_name, count(*) AS count FROM public."phan_hoi" t WHERE "created_at" IS NULL
UNION ALL
SELECT 'json_shape.yeu_cau_duyet_admin.approver_ids' AS check_name, count(*) AS count FROM public."yeu_cau_duyet_admin" t WHERE "approver_ids" IS NOT NULL AND jsonb_typeof("approver_ids") NOT IN ('array')
UNION ALL
SELECT 'json_shape.yeu_cau_duyet_admin.payload' AS check_name, count(*) AS count FROM public."yeu_cau_duyet_admin" t WHERE "payload" IS NOT NULL AND jsonb_typeof("payload") NOT IN ('object')
UNION ALL
SELECT 'json_shape.yeu_cau_duyet_admin.result' AS check_name, count(*) AS count FROM public."yeu_cau_duyet_admin" t WHERE "result" IS NOT NULL AND jsonb_typeof("result") NOT IN ('object')
UNION ALL
SELECT 'null.hoa_chat.la_chat_khoi_dau' AS check_name, count(*) AS count FROM public."hoa_chat" t WHERE "la_chat_khoi_dau" IS NULL
UNION ALL
SELECT 'null.hoa_chat.created_at' AS check_name, count(*) AS count FROM public."hoa_chat" t WHERE "created_at" IS NULL
UNION ALL
SELECT 'json_shape.phan_ung.chat_tham_gia' AS check_name, count(*) AS count FROM public."phan_ung" t WHERE "chat_tham_gia" IS NOT NULL AND jsonb_typeof("chat_tham_gia") NOT IN ('array')
UNION ALL
SELECT 'json_shape.phan_ung.san_pham' AS check_name, count(*) AS count FROM public."phan_ung" t WHERE "san_pham" IS NOT NULL AND jsonb_typeof("san_pham") NOT IN ('array')
UNION ALL
SELECT 'null.phan_ung.can_nhiet' AS check_name, count(*) AS count FROM public."phan_ung" t WHERE "can_nhiet" IS NULL
UNION ALL
SELECT 'null.phan_ung.muc_do_nguy_hiem' AS check_name, count(*) AS count FROM public."phan_ung" t WHERE "muc_do_nguy_hiem" IS NULL
UNION ALL
SELECT 'null.phan_ung.created_at' AS check_name, count(*) AS count FROM public."phan_ung" t WHERE "created_at" IS NULL
UNION ALL
SELECT 'null.cau_hoi_dau.do_kho' AS check_name, count(*) AS count FROM public."cau_hoi_dau" t WHERE "do_kho" IS NULL
UNION ALL
SELECT 'json_shape.cau_hoi_dau.lua_chon' AS check_name, count(*) AS count FROM public."cau_hoi_dau" t WHERE "lua_chon" IS NOT NULL AND jsonb_typeof("lua_chon") NOT IN ('array')
UNION ALL
SELECT 'null.cau_hoi_dau.diem' AS check_name, count(*) AS count FROM public."cau_hoi_dau" t WHERE "diem" IS NULL
UNION ALL
SELECT 'json_shape.cau_hoi_dau.noi_dung_game' AS check_name, count(*) AS count FROM public."cau_hoi_dau" t WHERE "noi_dung_game" IS NOT NULL AND jsonb_typeof("noi_dung_game") NOT IN ('object')
UNION ALL
SELECT 'json_shape.cau_hoi_dau.dap_an' AS check_name, count(*) AS count FROM public."cau_hoi_dau" t WHERE "dap_an" IS NOT NULL AND jsonb_typeof("dap_an") NOT IN ('object')
UNION ALL
SELECT 'null.cau_hoi_dau.created_at' AS check_name, count(*) AS count FROM public."cau_hoi_dau" t WHERE "created_at" IS NULL
UNION ALL
SELECT 'null.phong_dau.che_do' AS check_name, count(*) AS count FROM public."phong_dau" t WHERE "che_do" IS NULL
UNION ALL
SELECT 'null.phong_dau.do_kho' AS check_name, count(*) AS count FROM public."phong_dau" t WHERE "do_kho" IS NULL
UNION ALL
SELECT 'null.phong_dau.status' AS check_name, count(*) AS count FROM public."phong_dau" t WHERE "status" IS NULL
UNION ALL
SELECT 'null.phong_dau.so_nguoi_toi_da' AS check_name, count(*) AS count FROM public."phong_dau" t WHERE "so_nguoi_toi_da" IS NULL
UNION ALL
SELECT 'null.phong_dau.so_nguoi_hien_tai' AS check_name, count(*) AS count FROM public."phong_dau" t WHERE "so_nguoi_hien_tai" IS NULL
UNION ALL
SELECT 'null.phong_dau.created_at' AS check_name, count(*) AS count FROM public."phong_dau" t WHERE "created_at" IS NULL
UNION ALL
SELECT 'json_shape.tra_loi_vong.noi_dung_tra_loi' AS check_name, count(*) AS count FROM public."tra_loi_vong" t WHERE "noi_dung_tra_loi" IS NOT NULL AND jsonb_typeof("noi_dung_tra_loi") NOT IN ('object')
UNION ALL
SELECT 'null.lich_su_dau.diem' AS check_name, count(*) AS count FROM public."lich_su_dau" t WHERE "diem" IS NULL
UNION ALL
SELECT 'null.lich_su_dau.diem_thay_doi' AS check_name, count(*) AS count FROM public."lich_su_dau" t WHERE "diem_thay_doi" IS NULL
UNION ALL
SELECT 'null.lich_su_dau.dau_luc' AS check_name, count(*) AS count FROM public."lich_su_dau" t WHERE "dau_luc" IS NULL
UNION ALL
SELECT 'null.lop.created_at' AS check_name, count(*) AS count FROM public."lop" t WHERE "created_at" IS NULL
UNION ALL
SELECT 'null.thanh_vien_lop.tham_gia_luc' AS check_name, count(*) AS count FROM public."thanh_vien_lop" t WHERE "tham_gia_luc" IS NULL
UNION ALL
SELECT 'null.bai_dang_lop.type' AS check_name, count(*) AS count FROM public."bai_dang_lop" t WHERE "type" IS NULL
UNION ALL
SELECT 'null.bai_dang_lop.cau_hoi' AS check_name, count(*) AS count FROM public."bai_dang_lop" t WHERE "cau_hoi" IS NULL
UNION ALL
SELECT 'json_shape.bai_dang_lop.cau_hoi' AS check_name, count(*) AS count FROM public."bai_dang_lop" t WHERE "cau_hoi" IS NOT NULL AND jsonb_typeof("cau_hoi") NOT IN ('array')
UNION ALL
SELECT 'null.bai_dang_lop.created_at' AS check_name, count(*) AS count FROM public."bai_dang_lop" t WHERE "created_at" IS NULL
UNION ALL
SELECT 'null.bai_nop.status' AS check_name, count(*) AS count FROM public."bai_nop" t WHERE "status" IS NULL
UNION ALL
SELECT 'null.bai_nop.cau_tra_loi' AS check_name, count(*) AS count FROM public."bai_nop" t WHERE "cau_tra_loi" IS NULL
UNION ALL
SELECT 'json_shape.bai_nop.cau_tra_loi' AS check_name, count(*) AS count FROM public."bai_nop" t WHERE "cau_tra_loi" IS NOT NULL AND jsonb_typeof("cau_tra_loi") NOT IN ('array','object')
UNION ALL
SELECT 'null.bai_nop.nop_luc' AS check_name, count(*) AS count FROM public."bai_nop" t WHERE "nop_luc" IS NULL
UNION ALL
SELECT 'null.lich_lop.created_at' AS check_name, count(*) AS count FROM public."lich_lop" t WHERE "created_at" IS NULL
UNION ALL
SELECT 'null.hoc_lieu.luot_xem' AS check_name, count(*) AS count FROM public."hoc_lieu" t WHERE "luot_xem" IS NULL
UNION ALL
SELECT 'null.hoc_lieu.luot_tai' AS check_name, count(*) AS count FROM public."hoc_lieu" t WHERE "luot_tai" IS NULL
UNION ALL
SELECT 'null.hoc_lieu.created_at' AS check_name, count(*) AS count FROM public."hoc_lieu" t WHERE "created_at" IS NULL
UNION ALL
SELECT 'null.phan_hoi_hoc_lieu.created_at' AS check_name, count(*) AS count FROM public."phan_hoi_hoc_lieu" t WHERE "created_at" IS NULL
UNION ALL
SELECT 'null.nhiem_vu.thuong_xp' AS check_name, count(*) AS count FROM public."nhiem_vu" t WHERE "thuong_xp" IS NULL
UNION ALL
SELECT 'null.nhiem_vu.type' AS check_name, count(*) AS count FROM public."nhiem_vu" t WHERE "type" IS NULL
UNION ALL
SELECT 'null.nhiem_vu.created_at' AS check_name, count(*) AS count FROM public."nhiem_vu" t WHERE "created_at" IS NULL
UNION ALL
SELECT 'null.nhiem_vu_nguoi_dung.so_luong_hien_tai' AS check_name, count(*) AS count FROM public."nhiem_vu_nguoi_dung" t WHERE "so_luong_hien_tai" IS NULL
UNION ALL
SELECT 'null.nhiem_vu_nguoi_dung.da_hoan_thanh' AS check_name, count(*) AS count FROM public."nhiem_vu_nguoi_dung" t WHERE "da_hoan_thanh" IS NULL
UNION ALL
SELECT 'null.nhiem_vu_nguoi_dung.da_nhan' AS check_name, count(*) AS count FROM public."nhiem_vu_nguoi_dung" t WHERE "da_nhan" IS NULL
UNION ALL
SELECT 'null.nhiem_vu_nguoi_dung.dat_lai_cuoi_luc' AS check_name, count(*) AS count FROM public."nhiem_vu_nguoi_dung" t WHERE "dat_lai_cuoi_luc" IS NULL
UNION ALL
SELECT 'null.nhiem_vu_nguoi_dung.updated_at' AS check_name, count(*) AS count FROM public."nhiem_vu_nguoi_dung" t WHERE "updated_at" IS NULL
UNION ALL
SELECT 'null.thao_luan.luot_thich' AS check_name, count(*) AS count FROM public."thao_luan" t WHERE "luot_thich" IS NULL
UNION ALL
SELECT 'null.thao_luan.created_at' AS check_name, count(*) AS count FROM public."thao_luan" t WHERE "created_at" IS NULL
UNION ALL
SELECT 'null.ghi_chu.updated_at' AS check_name, count(*) AS count FROM public."ghi_chu" t WHERE "updated_at" IS NULL
UNION ALL
SELECT 'null.hoat_dong_nguoi_dung.thong_tin_bo_sung' AS check_name, count(*) AS count FROM public."hoat_dong_nguoi_dung" t WHERE "thong_tin_bo_sung" IS NULL
UNION ALL
SELECT 'json_shape.hoat_dong_nguoi_dung.thong_tin_bo_sung' AS check_name, count(*) AS count FROM public."hoat_dong_nguoi_dung" t WHERE "thong_tin_bo_sung" IS NOT NULL AND jsonb_typeof("thong_tin_bo_sung") NOT IN ('object')
UNION ALL
SELECT 'null.hoat_dong_nguoi_dung.created_at' AS check_name, count(*) AS count FROM public."hoat_dong_nguoi_dung" t WHERE "created_at" IS NULL
UNION ALL
SELECT 'logical.lesson_progress_missing' AS check_name, count(*) AS count FROM public."tien_do_nguoi_dung" t WHERE loai_tien_do='lesson' AND NOT EXISTS (SELECT 1 FROM public.bai_hoc p WHERE p.id=t.doi_tuong_id)
UNION ALL
SELECT 'logical.discussion_lesson_missing' AS check_name, count(*) AS count FROM public."thao_luan" t WHERE NOT EXISTS (SELECT 1 FROM public.bai_hoc p WHERE p.id=t.bai_hoc_id)
UNION ALL
SELECT 'logical.note_lesson_missing' AS check_name, count(*) AS count FROM public."ghi_chu" t WHERE NOT EXISTS (SELECT 1 FROM public.bai_hoc p WHERE p.id=t.bai_hoc_id)
UNION ALL
SELECT 'logical.class_teacher_role' AS check_name, count(*) AS count FROM public."lop" t WHERE giao_vien_id IS NULL OR NOT EXISTS (SELECT 1 FROM public.nguoi_dung p WHERE p.id=t.giao_vien_id AND p.role IN ('teacher','admin'))
UNION ALL
SELECT 'logical.membership_student_role' AS check_name, count(*) AS count FROM public."thanh_vien_lop" t WHERE NOT EXISTS (SELECT 1 FROM public.nguoi_dung p WHERE p.id=t.hoc_sinh_id AND p.role='student')
UNION ALL
SELECT 'logical.schedule_end_before_start' AS check_name, count(*) AS count FROM public."lich_lop" t WHERE ket_thuc_luc < bat_dau_luc
UNION ALL
SELECT 'logical.assignment_target_not_member' AS check_name, count(*) AS count FROM public."bai_dang_lop" t WHERE type='assignment' AND hoc_sinh_nhan_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.thanh_vien_lop p WHERE p.lop_id=t.lop_id AND p.hoc_sinh_id=t.hoc_sinh_nhan_id)
UNION ALL
SELECT 'logical.submission_not_assignment' AS check_name, count(*) AS count FROM public."bai_nop" t WHERE NOT EXISTS (SELECT 1 FROM public.bai_dang_lop p WHERE p.id=t.bai_dang_id AND p.type='assignment')
UNION ALL
SELECT 'logical.submission_not_member' AS check_name, count(*) AS count FROM public."bai_nop" t WHERE NOT EXISTS (SELECT 1 FROM public.bai_dang_lop p JOIN public.thanh_vien_lop m ON m.lop_id=p.lop_id WHERE p.id=t.bai_dang_id AND m.hoc_sinh_id=t.hoc_sinh_id)
UNION ALL
SELECT 'logical.submission_score' AS check_name, count(*) AS count FROM public."bai_nop" t WHERE diem < 0 OR diem > 10 OR (status='graded' AND diem IS NULL)
UNION ALL
SELECT 'logical.negative_user_metrics' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE diem_kinh_nghiem<0 OR cap_do<1 OR phut_hoat_dong<0 OR so_ngay_chuoi<0
UNION ALL
SELECT 'logical.level_xp_mismatch' AS check_name, count(*) AS count FROM public."nguoi_dung" t WHERE cap_do <> floor(diem_kinh_nghiem::numeric/1000)::integer+1
UNION ALL
SELECT 'logical.material_counter_negative' AS check_name, count(*) AS count FROM public."hoc_lieu" t WHERE luot_xem<0 OR luot_tai<0
UNION ALL
SELECT 'logical.mission_claimed_incomplete' AS check_name, count(*) AS count FROM public."nhiem_vu_nguoi_dung" t WHERE da_nhan AND NOT da_hoan_thanh
UNION ALL
SELECT 'logical.room_count_mismatch' AS check_name, count(*) AS count FROM public."phong_dau" t WHERE so_nguoi_hien_tai <> (SELECT count(*) FROM public.nguoi_choi p WHERE p.phong_dau_id=t.id AND p.status <> 'left')
UNION ALL
SELECT 'logical.room_exceeds_capacity' AS check_name, count(*) AS count FROM public."phong_dau" t WHERE so_nguoi_hien_tai>so_nguoi_toi_da OR so_nguoi_hien_tai<0
UNION ALL
SELECT 'logical.room_question_missing' AS check_name, count(*) AS count FROM public."phong_dau" t WHERE EXISTS (SELECT 1 FROM unnest(danh_sach_cau_hoi_id) q(id) WHERE NOT EXISTS (SELECT 1 FROM public.cau_hoi_dau p WHERE p.id=q.id))
UNION ALL
SELECT 'logical.approval_executed_incomplete' AS check_name, count(*) AS count FROM public."yeu_cau_duyet_admin" t WHERE status='executed' AND (executed_at IS NULL OR executed_by IS NULL OR jsonb_array_length(approver_ids)<2)
UNION ALL
SELECT 'logical.approval_expired_pending' AS check_name, count(*) AS count FROM public."yeu_cau_duyet_admin" t WHERE status='pending' AND expires_at<now()
UNION ALL
SELECT 'logical.empty_lesson_title' AS check_name, count(*) AS count FROM public."bai_hoc" t WHERE coalesce(btrim(tieu_de),'')=''
UNION ALL
SELECT 'logical.empty_material_url' AS check_name, count(*) AS count FROM public."hoc_lieu" t WHERE coalesce(btrim(file_url),'')=''
ORDER BY check_name;
COMMIT;

-- Kiểm tra các cấu hình gây sai lệch chức năng đã phát hiện trong phiên audit.
BEGIN TRANSACTION READ ONLY;
SET LOCAL statement_timeout = '30s';

SELECT signature, to_regprocedure(signature) IS NOT NULL AS exists_in_database
FROM (VALUES
  ('public.increment_crafting_task_progress(text,text,jsonb,jsonb)'),
  ('public.claim_crafting_task_reward(text,text,integer,jsonb,integer)'),
  ('public.craft_lab_item(text,text,text,jsonb,integer)')
) expected(signature);

SELECT c.conrelid::regclass AS table_name, c.conname,
       pg_get_constraintdef(c.oid) AS definition, c.convalidated
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE n.nspname = 'public' AND c.contype = 'f'
ORDER BY c.conrelid::regclass::text, c.conname;

SELECT count(*) AS classes_with_dependent_rows
FROM public.lop l
WHERE EXISTS (SELECT 1 FROM public.thanh_vien_lop m WHERE m.lop_id = l.id)
   OR EXISTS (SELECT 1 FROM public.bai_dang_lop b WHERE b.lop_id = l.id)
   OR EXISTS (SELECT 1 FROM public.lich_lop s WHERE s.lop_id = l.id);

SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

SELECT c.relname AS table_name, c.relrowsecurity AS rls,
       has_table_privilege('anon', c.oid, 'SELECT') AS anon_select,
       has_table_privilege('anon', c.oid, 'INSERT') AS anon_insert,
       has_table_privilege('authenticated', c.oid, 'INSERT') AS authenticated_insert,
       has_table_privilege('authenticated', c.oid, 'UPDATE') AS authenticated_update
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY c.relname;

SELECT tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('tien_do_nguoi_dung', 'phan_hoi', 'yeu_cau_duyet_admin', 'cau_hoi_dau')
ORDER BY tablename, policyname;

SELECT c.relname AS table_name, t.tgname, pg_get_triggerdef(t.oid) AS definition
FROM pg_trigger t
JOIN pg_class c ON c.oid = t.tgrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND NOT t.tgisinternal;

SELECT doi_tuong_id AS chemical_formula, count(*) AS progress_rows
FROM public.tien_do_nguoi_dung
WHERE loai_tien_do = 'chemical' AND doi_tuong_id = 'HClO'
GROUP BY doi_tuong_id;

-- Sau khi cập nhật, hai quyền này phải là false.
SELECT has_table_privilege('anon', 'public.cau_hoi_dau', 'SELECT') AS anon_answer_read,
       has_table_privilege('authenticated', 'public.cau_hoi_dau', 'SELECT') AS authenticated_answer_read;
COMMIT;
