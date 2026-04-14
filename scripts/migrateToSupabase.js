import { createClient } from '@supabase/supabase-js';
import { FLAT_KNOWLEDGE_BASE } from '../src/data/theory.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * MIGRATION SCRIPT: Theory File -> Supabase Database
 */

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('🚀 Starting Knowledge Base Migration to Supabase...');
  
  let count = 0;
  for (const item of FLAT_KNOWLEDGE_BASE) {
    try {
      const { error } = await supabase
        .from('ai_knowledge')
        .upsert({
          id: item.id,
          title: item.title,
          category: item.category,
          patterns: item.patterns || [],
          explanation: item.explanation,
          formula: item.formula || '',
          suggestions: item.suggestions || []
        });

      if (error) {
        console.error(`❌ Error uploading ${item.id}:`, error.message);
      } else {
        console.log(`✅ Migrated: ${item.id} - ${item.title}`);
        count++;
      }
    } catch (err) {
      console.error(`❌ Unexpected error for ${item.id}:`, err);
    }
  }

  console.log(`\n🎉 Migration complete! Total items pushed: ${count}`);
  process.exit(0);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('💥 ERROR: Supabase credentials missing in .env');
  process.exit(1);
}

migrate();
