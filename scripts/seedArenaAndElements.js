import { supabase } from '../api/lib/supabase.js';
import { elements } from '../elements_v2.js';
import { arenaQuestions } from '../src/data/arenaQuestions.js';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  try {
    console.log('🚀 Starting Elements and Arena DB Seeding...');

    // 1. Seed Periodic Elements
    console.log(`📦 Preparing to seed ${elements.length} periodic elements...`);
    const formattedElements = elements.map(el => ({
      atomic_number: el.number,
      symbol: el.symbol,
      name: el.name,
      atomic_mass: parseFloat(el.weight) || 0,
      category: el.category || 'unknown',
      electron_configuration: el.shells ? el.shells.join('-') : null,
      state: 'unknown',
      color_hex: null
    }));

    const { error: err1 } = await supabase.from('periodic_elements').upsert(formattedElements, { onConflict: 'atomic_number' });
    if (err1) throw err1;
    console.log(`✅ Successfully seeded ${formattedElements.length} elements!`);

    // 2. Seed Arena Questions
    console.log('🧹 Cleaning old arena questions...');
    await supabase.from('arena_questions').delete().neq('question', 'placeholder-to-delete-all'); // deletes all

    console.log('📦 Preparing to seed arena questions...');
    let questionsToSeed = [];
    
    // Map object categories (easy, medium, hard, super) into array
    Object.keys(arenaQuestions).forEach(difficulty => {
      // exclude arrays like mockRooms if they exist in the import
      if (Array.isArray(arenaQuestions[difficulty])) {
         arenaQuestions[difficulty].forEach(q => {
           questionsToSeed.push({
             difficulty: difficulty === 'auto' ? 'easy' : difficulty, 
             grade_level: 8, // Keep default for now
             question: q.question,
             options: q.options,
             correct_option_index: q.correct,
             points: q.points || 10
           });
         });
      }
    });

    if (questionsToSeed.length > 0) {
      const { error: err2 } = await supabase.from('arena_questions').insert(questionsToSeed);
      if (err2) throw err2;
      console.log(`✅ Successfully seeded ${questionsToSeed.length} arena questions!`);
    } else {
      console.log('⚠️ No valid arena questions found to seed.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
