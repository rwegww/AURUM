import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkColumn() {
  const { data, error } = await supabase
    .from('users')
    .select('avatar_seed')
    .limit(1);
  
  if (error) {
    console.error('Error selecting avatar_seed:', error.message);
  } else {
    console.log('Column avatar_seed exists!');
  }
}

checkColumn();
