-- Tables for Lesson Discussions (Public Q&A)
CREATE TABLE IF NOT EXISTS lesson_discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id TEXT NOT NULL,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES lesson_discussions(id) ON DELETE CASCADE,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tables for User Notes (Private per Lesson)
CREATE TABLE IF NOT EXISTS user_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    content TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_discussions_lesson ON lesson_discussions(lesson_id);
-- Function to increment likes safely
CREATE OR REPLACE FUNCTION increment_likes(row_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE lesson_discussions
    SET likes = COALESCE(likes, 0) + 1
    WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;
