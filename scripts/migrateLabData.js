import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { reactions, chemicals } from '../src/data/reactions/index.js';

dotenv.config({ path: '.env.local' });

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
    cong_thuc: c.formula,
    ten: c.name,
    trang_thai_vat_chat: c.state,
    mau_sac: c.color,
    danh_muc: c.category,
    la_chat_khoi_dau: c.isStarter || false
  }));

  const { error: chemError } = await supabase
    .from('hoa_chat')
    .upsert(formattedChemicals, { onConflict: 'cong_thuc' });

  if (chemError) {
    console.error('❌ Error migrating chemicals:', chemError);
  } else {
    console.log('✅ Chemicals migrated successfully');
  }

  // 2. Migrate Reactions
  console.log(`⚗️ Migrating ${reactions.length} reactions...`);
  const formattedReactions = reactions.map(r => ({
    id: r.id,
    ten: r.name,
    type: r.type,
    phuong_trinh: r.equation,
    chat_tham_gia: r.reactants,
    san_pham: r.products,
    khoi_id: r.gradeLevel,
    danh_muc: r.category,
    dieu_kien: r.conditions,
    hien_tuong: r.observation,
    nang_luong: r.energy,
    hieu_ung: r.animation,
    can_nhiet: r.requiresHeat || false,
    muc_do_nguy_hiem: r.dangerLevel || 0,
    canh_bao_an_toan: r.safetyWarning
  }));

  const { error: rxError } = await supabase
    .from('phan_ung')
    .upsert(formattedReactions, { onConflict: 'id' });

  if (rxError) {
    console.error('❌ Error migrating reactions:', rxError);
  } else {
    console.log('✅ Reactions migrated successfully');
  }

  console.log('🏁 Migration finished!');
}

migrate();
