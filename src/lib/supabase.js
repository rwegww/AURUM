import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hcogvbcloyvcaqozbmqx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_zH3xEorL6TgoyBDrMVh6Zw_gePhidAQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
