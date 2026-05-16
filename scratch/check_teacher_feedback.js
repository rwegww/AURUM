import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

if (fs.existsSync('.env.local')) {
  dotenv.config({ path: '.env.local' });
} else {
  dotenv.config();
}

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function checkFeedback() {
  try {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('type', 'teacher_registration');
      
    if (error) {
      console.error('Error fetching teacher registration feedback:', error);
    } else {
      console.log('Teacher registration requests in feedback table:', data);
    }
  } catch (err) {
    console.error('Exception fetching feedback:', err);
  }
}

checkFeedback();
