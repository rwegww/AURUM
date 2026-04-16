import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { reactions, chemicals } from '../src/data/reactions/index.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('🚀 Starting migration of Lab Data...');

  // 1. Migrate Chemicals
  console.log(`🧪 Preparing ${chemicals.length} chemicals...`);
  
  // Deduplicate chemicals by formula
  const uniqueChemicals = [];
  const formulasSeen = new Set();
  
  for (const c of chemicals) {
    if (!formulasSeen.has(c.formula)) {
      uniqueChemicals.push(c);
      formulasSeen.add(c.formula);
    }
  }
  
  console.log(`🧪 Migrating ${uniqueChemicals.length} unique chemicals...`);
  const formattedChemicals = uniqueChemicals.map(c => ({
    formula: c.formula,
    name: c.name,
    state: c.state,
    color: c.color,
    type: c.category,
    is_starter: c.isStarter || false
  }));

  const { error: chemError } = await supabase
    .from('lab_chemicals')
    .upsert(formattedChemicals, { onConflict: 'formula' });

  if (chemError) {
    console.error('❌ Error migrating chemicals:', chemError);
  } else {
    console.log('✅ Chemicals migrated successfully');
  }

  // 2. Migrate Reactions
  console.log(`⚗️ Migrating ${reactions.length} reactions...`);
  const formattedReactions = reactions.map(r => ({
    id: r.id,
    name: r.name,
    type: r.type,
    equation: r.equation,
    reactants: r.reactants,
    products: r.products,
    grade_level: r.gradeLevel,
    category: r.category,
    conditions: r.conditions,
    observation: r.observation,
    energy: r.energy,
    animation: r.animation,
    requires_heat: r.requiresHeat || false,
    danger_level: r.dangerLevel || 0,
    safety_warning: r.safetyWarning
  }));

  const { error: rxError } = await supabase
    .from('lab_reactions')
    .upsert(formattedReactions, { onConflict: 'id' });

  if (rxError) {
    console.error('❌ Error migrating reactions:', rxError);
  } else {
    console.log('✅ Reactions migrated successfully');
  }

  console.log('🏁 Migration finished!');
}

migrate();
