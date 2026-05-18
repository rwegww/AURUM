import { createClient } from '@supabase/supabase-js';
import '../env.js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

const isValid = (url, key) => {
  if (!url || !key) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const hasValidCredentials = isValid(supabaseUrl, supabaseKey);

if (!hasValidCredentials) {
  const message =
    'Supabase credentials missing or invalid. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/SUPABASE_KEY.';
  if (process.env.NODE_ENV === 'production') {
    throw new Error(message);
  }
  console.warn(`WARNING: ${message} Database calls will fail until env is configured.`);
} else {
  console.log('Supabase client initialized successfully.');
}

const notConfigured = () => {
  throw new Error('Database client not initialized');
};

// Non-production keeps imports alive, but DB calls fail explicitly instead of returning fake data.
export const supabase = hasValidCredentials
  ? createClient(supabaseUrl, supabaseKey)
  : {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: notConfigured,
            maybeSingle: notConfigured,
          }),
          filter: () => ({
            order: notConfigured,
          }),
          order: notConfigured,
        }),
        insert: notConfigured,
        update: () => ({ eq: notConfigured }),
        upsert: notConfigured,
        delete: () => ({ eq: notConfigured, lte: notConfigured }),
      }),
      auth: {
        getUser: notConfigured,
      },
      rpc: notConfigured,
    };
