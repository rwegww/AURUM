-- Create users table (public profile)
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- Changed from UUID to TEXT for Firebase UID compatibility
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password TEXT, -- Password can be null for OAuth users
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    inventory JSONB DEFAULT '{"ingredients": [], "craftedItems": []}',
    unlocked_lessons TEXT[] DEFAULT '{}',
    unlocked_chemicals TEXT[] DEFAULT '{}', -- List of chemical formulas unlocked
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    class_id INTEGER NOT NULL,
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

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE SET NULL, -- Changed to TEXT to match users.id
    username TEXT,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'suggestion' CHECK (type IN ('bug', 'suggestion', 'praise', 'other')),
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to sync auth.users to public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, email, role)
  VALUES (
    new.id::text, -- Explicit cast to text
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicate errors
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Policies for lessons (Public Read)
DROP POLICY IF EXISTS "Allow public read access" ON lessons;
CREATE POLICY "Allow public read access" ON lessons FOR SELECT USING (true);

-- Policies for users (Owner Read/Write)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id);

-- Policies for feedback (Authenticated Insert)
DROP POLICY IF EXISTS "Allow authenticated insert feedback" ON feedback;
CREATE POLICY "Allow authenticated insert feedback" ON feedback FOR INSERT WITH CHECK (true);

-- =========================================================
-- ARENA & PERIODIC TABLE MODULE STRUCTURE
-- =========================================================

-- Create periodic table elements
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create arena questions bank
CREATE TABLE IF NOT EXISTS arena_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_level INTEGER NOT NULL DEFAULT 8,
    difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard', 'super', 'auto')),
    question TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]', -- e.g., ["Oxi", "Hidro", "Cacbon", "Nito"]
    correct_option_index INTEGER NOT NULL CHECK (correct_option_index >= 0 AND correct_option_index <= 3),
    points INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create arena rooms (Lobby)
CREATE TABLE IF NOT EXISTS arena_rooms (
    id TEXT PRIMARY KEY, -- Using TEXT for short PIN codes like '294819'
    name TEXT NOT NULL,
    host_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    mode TEXT DEFAULT 'solo',
    difficulty TEXT DEFAULT 'auto',
    status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
    max_players INTEGER DEFAULT 2,
    current_players INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for new tables
ALTER TABLE periodic_elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE arena_rooms ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- LABORATORY & ALCHEMY MODULE
-- =========================================================

-- Chemicals table
CREATE TABLE IF NOT EXISTS lab_chemicals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    formula TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    state TEXT CHECK (state IN ('solid', 'liquid', 'gas')),
    color TEXT,
    type TEXT,
    is_starter BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reactions table
CREATE TABLE IF NOT EXISTS lab_reactions (
    id TEXT PRIMARY KEY, -- e.g. rx_001
    name TEXT NOT NULL,
    type TEXT,
    equation TEXT NOT NULL,
    reactants JSONB NOT NULL, -- [{formula, coeff, name}]
    products JSONB NOT NULL,  -- [{formula, coeff, name}]
    grade_level INTEGER,
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

-- Enable RLS
ALTER TABLE lab_chemicals ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_reactions ENABLE ROW LEVEL SECURITY;

-- Policies (Public Read)
DROP POLICY IF EXISTS "Allow public read on chemicals" ON lab_chemicals;
CREATE POLICY "Allow public read on chemicals" ON lab_chemicals FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read on reactions" ON lab_reactions;
CREATE POLICY "Allow public read on reactions" ON lab_reactions FOR SELECT USING (true);

-- Policies for Periodic Elements
DROP POLICY IF EXISTS "Allow public read access on elements" ON periodic_elements;
CREATE POLICY "Allow public read access on elements" ON periodic_elements FOR SELECT USING (true);

-- Policies for Arena Questions (Public Read to fetch for game)
DROP POLICY IF EXISTS "Allow public read access on arena questions" ON arena_questions;
CREATE POLICY "Allow public read access on arena questions" ON arena_questions FOR SELECT USING (true);

-- Policies for Arena Rooms (Public Read/Write to allow joining)
DROP POLICY IF EXISTS "Allow public read access on arena rooms" ON arena_rooms;
CREATE POLICY "Allow public read access on arena rooms" ON arena_rooms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert on arena rooms" ON arena_rooms;
CREATE POLICY "Allow authenticated insert on arena rooms" ON arena_rooms FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated update on arena rooms" ON arena_rooms;
CREATE POLICY "Allow authenticated update on arena rooms" ON arena_rooms FOR UPDATE USING (true);

-- =========================================================
-- LEARNING MATERIAL LIBRARY
-- =========================================================

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_type TEXT,
    category TEXT,
    author_id TEXT REFERENCES users(id), -- Changed to TEXT for users.id
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Material Feedback table
CREATE TABLE IF NOT EXISTS material_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE, -- Changed to TEXT for users.id
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_feedback ENABLE ROW LEVEL SECURITY;

-- Policies for Materials (Public Read)
DROP POLICY IF EXISTS "Allow public read access on materials" ON materials;
CREATE POLICY "Allow public read access on materials" ON materials FOR SELECT USING (true);

-- Policies for Materials (Admin/Teacher Write - Simplification for now)
DROP POLICY IF EXISTS "Allow all for authenticated on materials" ON materials;
CREATE POLICY "Allow all for authenticated on materials" ON materials FOR ALL USING (true);

-- Policies for Feedback
DROP POLICY IF EXISTS "Allow public read access on feedback" ON material_feedback;
CREATE POLICY "Allow public read access on feedback" ON material_feedback FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow authenticated insert on feedback" ON material_feedback;
CREATE POLICY "Allow authenticated insert on feedback" ON material_feedback FOR INSERT WITH CHECK (true);

-- Functions
CREATE OR REPLACE FUNCTION increment_material_view(material_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE materials
    SET view_count = view_count + 1
    WHERE id = material_id;
END;
$$ LANGUAGE plpgsql;



-- =========================================================
-- EQUATION BALANCING MODULE (3,000 QUESTIONS & SKILL TREE)
-- =========================================================

-- Balancing Questions Bank
CREATE TABLE IF NOT EXISTS balancing_questions (
    id BIGSERIAL PRIMARY KEY,
    reactants JSONB NOT NULL,    -- ["H2", "O2"]
    products JSONB NOT NULL,     -- ["H2O"]
    answer JSONB NOT NULL,       -- [2, 1, 2]
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    category TEXT,               -- "Hóa hợp", "Thế", "Oxi hóa khử"
    grade_level INTEGER DEFAULT 8,
    equation_string TEXT,        -- "2H2 + O2 -> 2H2O"
    node_id INTEGER NOT NULL,    -- Maps to a specific Skill Tree node
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Progress for Balancing Roadmap
CREATE TABLE IF NOT EXISTS user_balancing_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    completed_question_ids BIGINT[] DEFAULT '{}',
    completed_node_ids INTEGER[] DEFAULT '{}',
    stars_earned INTEGER DEFAULT 0,
    last_daily_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE balancing_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_balancing_progress ENABLE ROW LEVEL SECURITY;

-- Policies (Public Read for questions)
DROP POLICY IF EXISTS "Allow public read on balancing questions" ON balancing_questions;
CREATE POLICY "Allow public read on balancing questions" ON balancing_questions FOR SELECT USING (true);

-- Policies (Owner Read/Write for progress)
DROP POLICY IF EXISTS "Users can view own balancing progress" ON user_balancing_progress;
CREATE POLICY "Users can view own balancing progress" ON user_balancing_progress FOR SELECT USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Users can update own balancing progress" ON user_balancing_progress;
CREATE POLICY "Users can update own balancing progress" ON user_balancing_progress FOR ALL USING (auth.uid()::text = user_id);

-- =========================================================
-- INTERACTIVE CLASSROOM MODULE
-- =========================================================

-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    grade_level INTEGER NOT NULL,
    teacher_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    code TEXT UNIQUE NOT NULL, -- Join code for students
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Class members (Students)
CREATE TABLE IF NOT EXISTS class_members (
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (class_id, student_id)
);

-- Class Posts (Messages/Assignments/Videos from Teacher)
CREATE TABLE IF NOT EXISTS class_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    author_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'announcement' CHECK (type IN ('announcement', 'assignment', 'video')),
    content TEXT NOT NULL,
    media_url TEXT,
    deadline TIMESTAMP WITH TIME ZONE,
    target_student_id TEXT REFERENCES users(id) ON DELETE CASCADE, -- If null, it's for everyone
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Class Schedules
CREATE TABLE IF NOT EXISTS class_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    meet_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Class Assignment Submissions
CREATE TABLE IF NOT EXISTS class_assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES class_posts(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded')),
    score NUMERIC,
    feedback TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, student_id)
);

-- Enable RLS
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_assignment_submissions ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Allow public read access on classes" ON classes;
CREATE POLICY "Allow public read access on classes" ON classes FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow teachers to insert classes" ON classes;
CREATE POLICY "Allow teachers to insert classes" ON classes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow members to read class_members" ON class_members;
CREATE POLICY "Allow members to read class_members" ON class_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow auth insert class_members" ON class_members;
CREATE POLICY "Allow auth insert class_members" ON class_members FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow members to read posts" ON class_posts;
CREATE POLICY "Allow members to read posts" ON class_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow teachers to insert posts" ON class_posts;
CREATE POLICY "Allow teachers to insert posts" ON class_posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow members to read schedules" ON class_schedules;
CREATE POLICY "Allow members to read schedules" ON class_schedules FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow teachers to insert schedules" ON class_schedules;
CREATE POLICY "Allow teachers to insert schedules" ON class_schedules FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow members to read submissions" ON class_assignment_submissions;
CREATE POLICY "Allow members to read submissions" ON class_assignment_submissions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow students to insert submissions" ON class_assignment_submissions;
CREATE POLICY "Allow students to insert submissions" ON class_assignment_submissions FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow teachers to update submissions" ON class_assignment_submissions;
CREATE POLICY "Allow teachers to update submissions" ON class_assignment_submissions FOR UPDATE USING (true);
