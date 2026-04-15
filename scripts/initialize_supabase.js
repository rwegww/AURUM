import { supabase } from '../api/lib/supabase.js';
import User from '../api/models/User.js';

async function initialize() {
  console.log('🚀 Initializing Supabase System Data...');

  try {
    // 1. Create Grade Levels if missing
    const grades = [8, 9, 10, 11, 12];
    for (const g of grades) {
      await supabase.from('grade_levels').upsert({ id: g, name: `Khối ${g}` });
    }
    console.log('✅ Grade levels initialized.');

    // 2. Create Admin and Teacher Accounts
    // NOTE: This will fail if SERVICE_ROLE_KEY is invalid and RLS is active
    const users = [
      {
        username: 'admin',
        email: 'admin@chemodyssey.com',
        password: 'password123',
        role: 'admin'
      },
      {
        username: 'teacher',
        email: 'teacher@chemodyssey.com',
        password: 'password123',
        role: 'teacher'
      }
    ];

    for (const u of users) {
      try {
        const existing = await User.findOne({ username: u.username });
        if (!existing) {
          await User.create(u);
          console.log(`✅ Created ${u.role} account: ${u.username}`);
        } else {
          console.log(`ℹ️ Account ${u.username} already exists.`);
        }
      } catch (err) {
        console.error(`❌ Failed to create ${u.username}:`, err.message);
      }
    }

  } catch (err) {
    console.error('💥 Initialization failed:', err.message);
  }
}

initialize();
