import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test() {
  console.log('Testing Supabase connection...');
  console.log('URL:', process.env.SUPABASE_URL);
  
  const { count, error } = await supabase.from('users').select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('❌ Supabase Error:', error.message);
    console.error('Code:', error.code);
  } else {
    console.log('✅ Supabase Connected! User count:', count);
  }
}

test();
