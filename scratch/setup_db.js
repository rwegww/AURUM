const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function setupDatabase() {
  console.log('--- Setting up Database Tables ---');

  // Note: Supabase JS client doesn't support creating tables directly via SQL unless using a specific RPC or extension.
  // Usually, we should provide the SQL to the user to run in the SQL editor.
  // However, I will check if I can use a raw SQL approach if available, but safest is to provide the SQL.
  
  const sql = `
    -- Materials table
    CREATE TABLE IF NOT EXISTS materials (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      file_url TEXT NOT NULL,
      file_type TEXT,
      category TEXT,
      author_id UUID REFERENCES users(id),
      view_count INTEGER DEFAULT 0,
      download_count INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Material Feedback table
    CREATE TABLE IF NOT EXISTS material_feedback (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Enable RLS
    ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
    ALTER TABLE material_feedback ENABLE ROW LEVEL SECURITY;

    -- Policies (Open for now, can be refined)
    CREATE POLICY "Allow public read" ON materials FOR SELECT USING (true);
    CREATE POLICY "Allow all for authenticated" ON materials FOR ALL USING (auth.role() = 'authenticated');
    
    CREATE POLICY "Allow public read feedback" ON material_feedback FOR SELECT USING (true);
    CREATE POLICY "Allow authenticated insert feedback" ON material_feedback FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  `;

  console.log('Please run the following SQL in your Supabase SQL Editor:');
  console.log(sql);
}

setupDatabase();
