-- ==========================================
-- SCRIPT THÊM CỘT CHO TÍNH NĂNG FEEDBACK (ẢNH VÀ DUYỆT KHEN NGỢI)
-- ==========================================
-- Hướng dẫn:
-- 1. Mở Supabase Dashboard của bạn.
-- 2. Vào phần "SQL Editor" ở menu bên trái.
-- 3. Paste toàn bộ nội dung script này vào và bấm "RUN" (hoặc Ctrl+Enter).

-- Thêm cột cho bảng feedback (schema v1/chung)
ALTER TABLE public.feedback 
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false;

