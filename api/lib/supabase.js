import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Ensure env variables are loaded even if this is the first module imported
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
// Prioritize SUPABASE_SERVICE_ROLE_KEY to bypass RLS on the backend.
// Fall back to ANON_KEY if service role is missing.
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
  console.warn('⚠️  Supabase credentials missing or invalid. Falling back to dummy client.');
} else {
  console.log('✅ Supabase client initialized successfully.');
}

// Fail-safe client creation with more robust dummy methods
export const supabase = isValid(supabaseUrl, supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : { 
      from: () => ({ 
        select: () => ({ 
          eq: () => ({ 
            single: () => Promise.resolve({ data: null, error: new Error('Database client not initialized') }),
            maybeSingle: () => Promise.resolve({ data: null, error: null }) // Be graceful for lookups
          }),
          filter: () => ({
            order: () => Promise.resolve({ data: [], error: null })
          }),
          order: () => Promise.resolve({ data: [], error: null }) 
        }),
        insert: () => Promise.resolve({ data: null, error: new Error('Database client not initialized') }),
        update: () => ({ eq: () => Promise.resolve({ error: new Error('Database client not initialized') }) }),
        upsert: () => Promise.resolve({ error: new Error('Database client not initialized') })
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Auth not initialized') })
      }
    };
