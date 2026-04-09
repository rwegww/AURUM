-- Create missions table
CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    action_type TEXT NOT NULL, -- 'reaction', 'balancing', 'arena_win', 'lesson_complete'
    target_count INTEGER NOT NULL DEFAULT 1,
    xp_reward INTEGER DEFAULT 50,
    type TEXT DEFAULT 'daily' CHECK (type IN ('daily', 'achievement', 'story')),
    icon TEXT, -- Emoji or icon name
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_missions table to track progress
CREATE TABLE IF NOT EXISTS user_missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    current_count INTEGER DEFAULT 0,
    is_completed BOOLEAN DEFAULT FALSE,
    is_claimed BOOLEAN DEFAULT FALSE,
    last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, mission_id)
);

-- Seed initial daily missions
INSERT INTO missions (title, description, action_type, target_count, xp_reward, type, icon)
VALUES 
    ('Nhà luyện kim tập sự', 'Thực hiện 3 phản ứng hóa học trong phòng Lab.', 'reaction', 3, 100, 'daily', '⚗️'),
    ('Bậc thầy cân bằng', 'Cân bằng chính xác 5 phương trình hóa học.', 'balancing', 5, 150, 'daily', '⚖️'),
    ('Chiến binh Đấu trường', 'Giành chiến thắng 1 trận đấu trong Đấu trường.', 'arena_win', 1, 200, 'daily', '⚔️'),
    ('Học giả siêng năng', 'Hoàn thành 1 bài học mới trong chương trình.', 'lesson_complete', 1, 120, 'daily', '📖'),
    ('Nhà thám hiểm', 'Khám phá 2 nguyên tố hoặc hợp chất mới.', 'discovery', 2, 80, 'daily', '🔭'),
    ('Luyện tập mỗi ngày', 'Xem lời giải hoặc bài giảng của 1 bài học.', 'review', 1, 50, 'daily', '🧘')
ON CONFLICT DO NOTHING;

-- Seed some achievements
INSERT INTO missions (title, description, action_type, target_count, xp_reward, type, icon)
VALUES 
    ('Nhà khoa học vĩ đại', 'Thực hiện tổng cộng 50 phản ứng hóa học.', 'reaction', 50, 1000, 'achievement', '🌟'),
    ('Vua Đấu trường', 'Thắng 20 trận đấu trong Đấu trường.', 'arena_win', 20, 1500, 'achievement', '👑'),
    ('Khai phá tri thức', 'Hoàn thành 10 bài học.', 'lesson_complete', 10, 800, 'achievement', '🎓')
ON CONFLICT DO NOTHING;
