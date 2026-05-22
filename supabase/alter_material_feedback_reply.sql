-- Thêm các cột phục vụ tính năng phản hồi đánh giá của người dùng
ALTER TABLE public.material_feedback 
ADD COLUMN IF NOT EXISTS reply_content text,
ADD COLUMN IF NOT EXISTS reply_user_id text, -- Kiểu text để đồng bộ với user_id hiện tại của material_feedback
ADD COLUMN IF NOT EXISTS reply_created_at timestamp with time zone;
