import { supabase } from '../api/lib/supabase.js';
import { arenaQuestions } from '../src/data/arenaQuestions.js';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  try {
    console.log('Starting Arena DB seeding...');

    await supabase
      .from('cau_hoi_dau')
      .delete()
      .neq('cau_hoi', 'placeholder-to-delete-all');

    const questionsToSeed = [];
    Object.keys(arenaQuestions).forEach((difficulty) => {
      if (!Array.isArray(arenaQuestions[difficulty])) return;

      arenaQuestions[difficulty].forEach((question) => {
        questionsToSeed.push({
          do_kho: difficulty === 'auto' ? 'easy' : difficulty,
          khoi_id: question.gradeLevel || 8,
          cau_hoi: question.question,
          loai_game: question.gameType || 'calculation',
          noi_dung_game: question.payload || {},
          dap_an: question.answer || {},
          diem: question.points || 100,
          gioi_han_giay: question.timeLimitSeconds || 45,
          giai_thich: question.explanation || null,
          dang_hoat_dong: question.isActive ?? true,
        });
      });
    });

    if (questionsToSeed.length > 0) {
      const { error } = await supabase.from('cau_hoi_dau').insert(questionsToSeed);
      if (error) throw error;
      console.log(`Successfully seeded ${questionsToSeed.length} arena questions.`);
    } else {
      console.log('No valid arena questions found to seed.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
