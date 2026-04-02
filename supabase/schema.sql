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
  );
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
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Policies for feedback (Authenticated Insert)
DROP POLICY IF EXISTS "Allow authenticated insert feedback" ON feedback;
CREATE POLICY "Allow authenticated insert feedback" ON feedback FOR INSERT WITH CHECK (true);
