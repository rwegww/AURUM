import dotenv from 'dotenv';
import { supabase } from '../api/lib/supabase.js';

dotenv.config();

async function test() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      console.error('❌ Supabase Query Error:', error.message);
    } else {
      console.log('✅ Supabase Query Success. Count:', data.length);
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Fatal Error:', err.message);
    process.exit(1);
  }
}

test();
