import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mwtrcaadhnjhrzcrntou.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dHJjYWFkaG5qaHJ6Y3JudG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjcwNzcsImV4cCI6MjA5NDM0MzA3N30.WYIm_OqG77ktS_LHaZGh0i9pkXEpa-nOQGYF2h0D0XQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  try {
    console.log('Fetching testimonials...');
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching testimonials:', error);
    } else {
      console.log('Success! Testimonials data:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Fatal error:', err);
  }
}

run();
