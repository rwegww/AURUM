import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mwtrcaadhnjhrzcrntou.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dHJjYWFkaG5qaHJ6Y3JudG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NjcwNzcsImV4cCI6MjA5NDM0MzA3N30.WYIm_OqG77ktS_LHaZGh0i9pkXEpa-nOQGYF2h0D0XQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
