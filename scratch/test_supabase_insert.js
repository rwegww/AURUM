import dotenv from 'dotenv';
import { supabase } from '../api/lib/supabase.js';

dotenv.config();

async function test() {
  try {
    console.log('Testing Supabase Insert...');
    const testId = 'test_' + Date.now();
    const { error } = await supabase.from('users').insert([{
        id: testId,
        username: 'test_user',
        email: 'test@example.com',
        password: 'test',
        role: 'student'
    }]);
    
    if (error) {
      console.error('❌ Supabase Insert Error:', error.message);
    } else {
      console.log('✅ Supabase Insert Success!');
      // Clean up
      await supabase.from('users').delete().eq('id', testId);
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Fatal Error:', err.message);
    process.exit(1);
  }
}

test();
