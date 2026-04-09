import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { balanceEquation } from '../src/utils/balancer.js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- CHEMICAL REAGENTS DATA ---
const metals = [
  { s: 'Na', v: 1 }, { s: 'K', v: 1 }, { s: 'Mg', v: 2 }, { s: 'Ca', v: 2 }, 
  { s: 'Ba', v: 2 }, { s: 'Al', v: 3 }, { s: 'Zn', v: 2 }, { s: 'Fe', v: 2 }, 
  { s: 'Fe', v: 3 }, { s: 'Cu', v: 2 }, { s: 'Ag', v: 1 }
];

const nonMetals = ['O2', 'Cl2', 'Br2', 'I2', 'S', 'P'];

const acids = [
  { f: 'HCl', ion: 'Cl', v: 1 },
  { f: 'H2SO4', ion: 'SO4', v: 2 },
  { f: 'HNO3', ion: 'NO3', v: 1 },
  { f: 'H3PO4', ion: 'PO4', v: 3 }
];

const bases = metals.map(m => ({
  f: `${m.s}(OH)${m.v > 1 ? m.v : ''}`,
  metal: m.s,
  v: m.v
}));

const salts = [];
metals.forEach(m => {
  acids.forEach(a => {
    // Basic ionic formula construction
    // m(v) a(v) -> m_av a_mv
    const m_sub = a.v > 1 ? a.v : '';
    const a_sub = m.v > 1 ? m.v : '';
    const ionClause = a.ion.length > 1 && a_sub > 1 ? `(${a.ion})${a_sub}` : `${a.ion}${a_sub}`;
    salts.push({
      f: `${m.s}${m_sub}${ionClause}`,
      metal: m.s,
      ion: a.ion,
      m_v: m.v,
      a_ion_v: a.v
    });
  });
});

// --- GENERATOR LOGIC ---
const questions = [];
const seenEquations = new Set();

function addQuestion(reactants, products, category, grade) {
  const result = balanceEquation(reactants, products);
  if (result.balanced) {
    const eq = result.equation;
    if (seenEquations.has(eq)) return;
    
    // Calculate difficulty
    const totalCoeffSum = result.coefficients.reduce((a, b) => a + b, 0);
    let difficulty = 'easy';
    if (totalCoeffSum > 6 || reactants.length + products.length > 3) difficulty = 'medium';
    if (totalCoeffSum > 12 || result.coefficients.some(c => c > 5)) difficulty = 'hard';

    questions.push({
      reactants,
      products,
      answer: result.coefficients,
      difficulty,
      category,
      grade_level: grade,
      equation_string: eq
    });
    seenEquations.push ? null : seenEquations.add(eq);
  }
}

console.log('🧪 Starting 3,000 balancing quest generation...');

// 1. Combination (Metal + Non-metal)
metals.forEach(m => {
    nonMetals.forEach(nm => {
        let product = '';
        if (nm === 'O2') product = m.v === 1 ? `${m.s}2O` : (m.v === 2 ? `${m.s}O` : `${m.s}2O3`);
        else if (nm === 'Cl2') product = `${m.s}Cl${m.v > 1 ? m.v : ''}`;
        else if (nm === 'S') product = m.v === 2 ? `${m.s}S` : (m.v === 1 ? `${m.s}2S` : `${m.s}2S3`);
        if (product) addQuestion([m.s, nm], [product], 'Hóa hợp', 8);
    });
});

// 2. Substitution (Metal + Acid)
metals.forEach(m => {
    acids.forEach(a => {
        if (['Cu', 'Ag'].includes(m.s)) return;
        const saltMatch = salts.find(s => s.metal === m.s && s.ion === a.ion);
        if (saltMatch) addQuestion([m.s, a.f], [saltMatch.f, 'H2'], 'Thế', 8);
    });
});

// 3. Neutralization (Acid + Base)
bases.forEach(b => {
    acids.forEach(a => {
        const saltMatch = salts.find(s => s.metal === b.metal && s.ion === a.ion);
        if (saltMatch) addQuestion([b.f, a.f], [saltMatch.f, 'H2O'], 'Trung hòa', 9);
    });
});

// 4. Metal Oxide + Acid
const metalOxides = metals.map(m => ({
    f: m.v === 1 ? `${m.s}2O` : (m.v === 2 ? `${m.s}O` : `${m.s}2O3`),
    metal: m.s
}));
metalOxides.forEach(mo => {
    acids.forEach(a => {
        const saltMatch = salts.find(s => s.metal === mo.metal && s.ion === a.ion);
        if (saltMatch) addQuestion([mo.f, a.f], [saltMatch.f, 'H2O'], 'Oxit + Axit', 9);
    });
});

// 5. Double Replacement (Salt + Salt - All combinations)
for (let i = 0; i < salts.length; i++) {
    for (let j = 0; j < salts.length; j++) {
        if (i === j) continue;
        const s1 = salts[i];
        const s2 = salts[j];
        if (s1.metal === s2.metal || s1.ion === s2.ion) continue;
        const p1 = salts.find(s => s.metal === s1.metal && s.ion === s2.ion);
        const p2 = salts.find(s => s.metal === s2.metal && s.ion === s1.ion);
        if (p1 && p2) addQuestion([s1.f, s2.f], [p1.f, p2.f], 'Trao đổi muối', 9);
    }
}

// 6. Hydrocarbon Combustion (Extensive C1-C20)
for (let n = 1; n <= 20; n++) {
    const h_alkane = 2 * n + 2;
    const h_alkene = 2 * n;
    const h_alkyne = 2 * n - 2;
    addQuestion([`C${n}H${h_alkane}`, 'O2'], ['CO2', 'H2O'], 'Cháy Alkan', 11);
    if (n > 1) addQuestion([`C${n}H${h_alkene}`, 'O2'], ['CO2', 'H2O'], 'Cháy Alken', 11);
    if (n > 1) addQuestion([`C${n}H${h_alkyne}`, 'O2'], ['CO2', 'H2O'], 'Cháy Alkyn', 11);
}

// 7. Metal Oxide + Hydrogen / Carbon (Redox)
metalOxides.forEach(mo => {
    addQuestion([mo.f, 'H2'], [mo.metal, 'H2O'], 'Khử oxit', 10);
    addQuestion([mo.f, 'CO'], [mo.metal, 'CO2'], 'Khử oxit', 10);
});

// 8. Salt + Base (All combinations)
salts.forEach(s => {
    bases.forEach(b => {
        if (s.metal === b.metal) return;
        const p1 = bases.find(base => base.metal === s.metal);
        const p2 = salts.find(salt => salt.metal === b.metal && salt.ion === s.ion);
        if (p1 && p2) addQuestion([s.f, b.f], [p1.f, p2.f], 'Muối + Bazơ', 9);
    });
});

// 9. Base + Non-metal Oxide
const nonMetalOxides = ['CO2', 'SO2', 'SO3', 'P2O5'];
bases.forEach(b => {
    nonMetalOxides.forEach(nmo => {
        let salt = '';
        if (nmo === 'CO2') salt = b.v === 1 ? 'Na2CO3' : (b.metal === 'Ca' ? 'CaCO3' : 'BaCO3');
        if (nmo === 'SO2') salt = b.v === 1 ? 'Na2SO3' : (b.metal === 'Ca' ? 'CaSO3' : 'BaSO3');
        if (salt) addQuestion([b.f, nmo], [salt, 'H2O'], 'Bazơ + Oxit axit', 9);
    });
});

// 7. TO REACH 3000: We need systematic variations.
// We'll multiply existing common patterns with pseudo-parameters if needed, 
// or just ensure we have enough reactant combinations.

console.log(`✅ Generated ${questions.length} unique questions.`);

async function seed() {
    console.log('🚀 Seeding to Supabase...');
    const { error } = await supabase.from('balancing_questions').upsert(
        questions.map((q, i) => ({
            ...q,
            node_id: Math.floor(i / 6) + 1 // 6 questions per node
        }))
    );
    if (error) console.error('❌ Error seeding:', error);
    else console.log('🎉 Successfully seeded questions!');
}

seed();
