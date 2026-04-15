/**
 * Migration Script: Upload 10,000 chemistry knowledge entries to Supabase
 * Table: ai_knowledge_base
 * 
 * Usage: node scripts/migrateKnowledgeBase.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY // Use the one we tested and works
);

// Dynamic import all parts
async function loadDataset() {
  const parts = [];
  for (let i = 1; i <= 5; i++) {
    const filePath = path.join(__dirname, '..', 'src', 'data', 'chemistry_dataset_10000_js', `chemistry_dataset_part${i}.js`);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Extract the array from the JS export
    const match = content.match(/export const .+? = (\[[\s\S]*\]);/);
    if (match) {
      const data = eval(match[1]);
      parts.push(...data);
      console.log(`✅ Part ${i}: ${data.length} records loaded`);
    }
  }
  return parts;
}

async function createTable() {
  console.log('📦 Creating ai_knowledge_base table via RPC...');
  
  // Try to create table using SQL via Supabase
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS ai_knowledge_base (
        id TEXT PRIMARY KEY,
        kind TEXT NOT NULL,
        input TEXT NOT NULL,
        output TEXT NOT NULL,
        input_normalized TEXT,
        category TEXT,
        title TEXT,
        difficulty TEXT,
        source_id TEXT,
        symbol TEXT,
        compare_to TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_kb_input_normalized ON ai_knowledge_base(input_normalized);
      CREATE INDEX IF NOT EXISTS idx_kb_kind ON ai_knowledge_base(kind);
      CREATE INDEX IF NOT EXISTS idx_kb_category ON ai_knowledge_base(category);
    `
  });
  
  if (error) {
    console.warn('⚠️ RPC not available. Please create the table manually in Supabase SQL Editor:');
    console.log(`
CREATE TABLE IF NOT EXISTS ai_knowledge_base (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  input TEXT NOT NULL,
  output TEXT NOT NULL,
  input_normalized TEXT,
  category TEXT,
  title TEXT,
  difficulty TEXT,
  source_id TEXT,
  symbol TEXT,
  compare_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_kb_input_normalized ON ai_knowledge_base(input_normalized);
CREATE INDEX IF NOT EXISTS idx_kb_kind ON ai_knowledge_base(kind);
CREATE INDEX IF NOT EXISTS idx_kb_category ON ai_knowledge_base(category);
    `);
  } else {
    console.log('✅ Table created successfully');
  }
}

async function uploadData(dataset) {
  const BATCH_SIZE = 200;
  let uploaded = 0;
  let errors = 0;

  for (let i = 0; i < dataset.length; i += BATCH_SIZE) {
    const batch = dataset.slice(i, i + BATCH_SIZE).map(item => ({
      id: item.id,
      kind: item.kind,
      input: item.input,
      output: item.output,
      input_normalized: item.inputNormalized || null,
      category: item.category || null,
      title: item.title || null,
      difficulty: item.difficulty || null,
      source_id: item.sourceId || null,
      symbol: item.symbol || null,
      compare_to: item.compareTo || null
    }));

    const { error } = await supabase
      .from('ai_knowledge_base')
      .upsert(batch, { onConflict: 'id' });

    if (error) {
      console.error(`❌ Batch ${i}-${i + batch.length}: ${error.message}`);
      errors += batch.length;
    } else {
      uploaded += batch.length;
      console.log(`📤 Uploaded ${uploaded}/${dataset.length} (${((uploaded / dataset.length) * 100).toFixed(1)}%)`);
    }
  }

  console.log(`\n🏁 Migration complete: ${uploaded} uploaded, ${errors} errors`);
}

async function main() {
  console.log('🚀 Starting Knowledge Base Migration...\n');
  
  const dataset = await loadDataset();
  console.log(`\n📊 Total records: ${dataset.length}\n`);
  
  await createTable();
  await uploadData(dataset);
}

main().catch(console.error);
