-- =========================================================
-- MASTER DATABASE SCHEMA FOR CHEMISTRY ODYSSEY (COMPLETE)
-- This file contains EVERYTHING: Core, Lab, Arena, Missions, AI, Community, etc.
-- =========================================================

-- [PASTE OF ALL CORE TABLES FROM SCHEMA.SQL]
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, 
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    inventory JSONB DEFAULT '{"ingredients": [], "craftedItems": []}',
    avatar_seed TEXT,
    arena_stats JSONB DEFAULT '{"total": 0, "wins": 0, "losses": 0, "points": 0}',
    arena_avatar JSONB DEFAULT '{"seed": "Chem Master", "aura": "#a855f7"}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grade_levels (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

INSERT INTO grade_levels (id, name) VALUES 
(8, 'Khối 8'), (9, 'Khối 9'), (10, 'Khối 10'), (11, 'Khối 11'), (12, 'Khối 12')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    class_id INTEGER NOT NULL REFERENCES grade_levels(id) ON DELETE CASCADE,
    program_id TEXT DEFAULT 'ketnoi',
    title TEXT NOT NULL,
    chapter TEXT,
    "order" INTEGER,
    description TEXT,
    theory_modules JSONB DEFAULT '[]',
    video_modules JSONB DEFAULT '[]',
    quizzes JSONB DEFAULT '[]',
    story_slides JSONB DEFAULT '[]',
    challenges JSONB DEFAULT '[]',
    game JSONB DEFAULT '{}',
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
    username TEXT,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'suggestion' CHECK (type IN ('bug', 'suggestion', 'praise', 'other')),
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- LABORATORY MODULE
CREATE TABLE IF NOT EXISTS lab_chemicals (
    id UUID DEFAULT gen_random_uuid(),
    formula TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    state TEXT CHECK (state IN ('solid', 'liquid', 'gas')),
    color TEXT,
    type TEXT,
    is_starter BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lab_reactions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    equation TEXT NOT NULL,
    reactants JSONB NOT NULL,
    products JSONB NOT NULL,
    grade_level INTEGER REFERENCES grade_levels(id) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES lessons(id) ON DELETE SET NULL,
    category TEXT,
    conditions TEXT,
    observation TEXT,
    energy NUMERIC,
    animation TEXT,
    requires_heat BOOLEAN DEFAULT FALSE,
    danger_level INTEGER DEFAULT 0,
    safety_warning TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ARENA MODULE
CREATE TABLE IF NOT EXISTS periodic_elements (
    atomic_number INTEGER PRIMARY KEY,
    symbol TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    atomic_mass NUMERIC,
    state TEXT DEFAULT 'solid' CHECK (state IN ('solid', 'liquid', 'gas', 'unknown')),
    category TEXT,
    color_hex TEXT,
    electron_configuration TEXT,
    is_discovered_by_default BOOLEAN DEFAULT false,
    grade_level INTEGER REFERENCES grade_levels(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS arena_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_level INTEGER NOT NULL DEFAULT 8 REFERENCES grade_levels(id) ON DELETE CASCADE,
    difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard', 'super', 'auto')),
    question TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]',
    correct_option_index INTEGER NOT NULL CHECK (correct_option_index >= 0 AND correct_option_index <= 3),
    points INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS arena_rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    host_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    mode TEXT DEFAULT 'solo',
    difficulty TEXT DEFAULT 'auto',
    status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
    max_players INTEGER DEFAULT 2,
    current_players INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS arena_match_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    room_id TEXT,
    opponent_name TEXT,
    result TEXT CHECK (result IN ('win', 'lose', 'draw')),
    score INTEGER DEFAULT 0,
    pts_change INTEGER DEFAULT 0,
    played_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- LIBRARY & MATERIALS
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT,
    category TEXT,
    author_id TEXT REFERENCES users(id),
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS material_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CLASSROOM MODULE
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    grade_level INTEGER NOT NULL REFERENCES grade_levels(id) ON DELETE CASCADE,
    teacher_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_members (
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (class_id, student_id)
);

CREATE TABLE IF NOT EXISTS class_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    author_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'announcement' CHECK (type IN ('announcement', 'assignment', 'video')),
    content TEXT NOT NULL,
    media_url TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    target_student_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    questions JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS class_assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES class_posts(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded')),
    score NUMERIC,
    feedback TEXT,
    answers JSONB DEFAULT '[]',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, student_id)
);

-- MISSION SYSTEM
CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    action_type TEXT NOT NULL,
    target_count INTEGER NOT NULL DEFAULT 1,
    xp_reward INTEGER DEFAULT 50,
    type TEXT DEFAULT 'daily' CHECK (type IN ('daily', 'achievement', 'story')),
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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

-- DISCUSSION & NOTES
CREATE TABLE IF NOT EXISTS lesson_discussions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id TEXT NOT NULL,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id UUID REFERENCES lesson_discussions(id) ON DELETE CASCADE,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL,
    content TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, lesson_id)
);

-- AI AGENT MODULE
CREATE TABLE IF NOT EXISTS ai_knowledge_base (
    id TEXT PRIMARY KEY,
    kind TEXT NOT NULL,
    input TEXT NOT NULL,
    output TEXT NOT NULL,
    input_normalized TEXT,
    category TEXT,
    title TEXT,
    difficulty TEXT,
    source_id TEXT,
    symbol TEXT,
    compare_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_cache (
    query_hash TEXT PRIMARY KEY,
    original_query TEXT NOT NULL,
    response JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROGRESS TRACKING
CREATE TABLE IF NOT EXISTS user_unlocked_lessons (
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    lesson_id TEXT REFERENCES lessons(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, lesson_id)
);

-- FUNCTIONS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, email, role)
  VALUES (
    new.id::text,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_kb_input_normalized ON ai_knowledge_base(input_normalized);
CREATE INDEX IF NOT EXISTS idx_lessons_grade ON lessons(class_id);
CREATE INDEX IF NOT EXISTS idx_discussions_lesson ON lesson_discussions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_missions_user ON user_missions(user_id);

-- SEED MISSIONS
INSERT INTO missions (title, description, action_type, target_count, xp_reward, type, icon)
VALUES 
    ('Nhà luyện kim tập sự', 'Thực hiện 3 phản ứng hóa học.', 'reaction', 3, 100, 'daily', '⚗️'),
    ('Bậc thầy cân bằng', 'Cân bằng chính xác 5 phương trình.', 'balancing', 5, 150, 'daily', '⚖️'),
    ('Chiến binh Đấu trường', 'Thắng 1 trận đấu Đấu trường.', 'arena_win', 1, 200, 'daily', '⚔️')
ON CONFLICT DO NOTHING;

-- RLS POLICIES
ALTER TABLE ai_knowledge_base ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Knowledge" ON ai_knowledge_base FOR SELECT USING (true);
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Lessons" ON lessons FOR SELECT USING (true);
ALTER TABLE lab_chemicals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Chemicals" ON lab_chemicals FOR SELECT USING (true);
ALTER TABLE lab_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Reactions" ON lab_reactions FOR SELECT USING (true);
