import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

// Strict validation to prevent crashes
const isValid = (url, key) => {
  if (!url || !key) return false;
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

if (!isValid(supabaseUrl, supabaseKey)) {
  console.error('❌ CRITICAL: Supabase credentials missing or invalid!');
}

// Fail-safe client creation
export const supabase = isValid(supabaseUrl, supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : { 
      from: () => ({ 
        select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: new Error('Database client not initialized') }) }), order: () => Promise.resolve({ data: [], error: null }) }),
        insert: () => Promise.resolve({ data: null, error: new Error('Database client not initialized') }),
        update: () => ({ eq: () => Promise.resolve({ error: new Error('Database client not initialized') }) }),
        upsert: () => Promise.resolve({ error: new Error('Database client not initialized') })
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Auth not initialized') })
      }
    };
