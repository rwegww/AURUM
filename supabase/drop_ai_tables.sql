-- ==========================================
-- SCRIPT XÓA BỎ CÁC BẢNG LIÊN QUAN TỚI AI
-- ==========================================
-- Hướng dẫn: 
-- 1. Mở Supabase Dashboard của bạn.
-- 2. Vào phần "SQL Editor" ở menu bên trái.
-- 3. Paste toàn bộ nội dung script này vào và bấm "RUN" (hoặc Ctrl+Enter).

-- Xóa các bảng AI cũ (từ schema v1)
DROP TABLE IF EXISTS public.ai_cache CASCADE;
DROP TABLE IF EXISTS public.ai_knowledge_base CASCADE;

-- Xóa các bảng AI hệ thống (từ schema v2)
DROP TABLE IF EXISTS public.sys_ai_cache CASCADE;
DROP TABLE IF EXISTS public.sys_ai_knowledge CASCADE;

-- (Tùy chọn) Xóa các hàm liên quan đến AI nếu có
-- DROP FUNCTION IF EXISTS public.match_ai_knowledge CASCADE;

-- Kết thúc
