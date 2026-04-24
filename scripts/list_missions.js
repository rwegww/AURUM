import { supabase } from '../api/lib/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

async function listMissions() {
  const { data, error } = await supabase.from('missions').select('*');
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log(JSON.stringify(data, null, 2));
}

listMissions();
