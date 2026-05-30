import { supabase } from '../api/lib/supabase.js';
import { arenaQuestions } from '../src/data/arenaQuestions.js';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  try {
    console.log('Starting Arena DB seeding...');

    await supabase
      .from('arena_questions')
      .delete()
      .neq('question', 'placeholder-to-delete-all');

    const questionsToSeed = [];
    Object.keys(arenaQuestions).forEach((difficulty) => {
      if (!Array.isArray(arenaQuestions[difficulty])) return;

      arenaQuestions[difficulty].forEach((question) => {
        questionsToSeed.push({
          difficulty: difficulty === 'auto' ? 'easy' : difficulty,
          grade_level: question.gradeLevel || 8,
          question: question.question,
          options: question.options || [],
          correct_option_index: question.correct ?? null,
          game_type: question.gameType || 'calculation',
          payload: question.payload || {},
          answer: question.answer || {},
          points: question.points || 100,
          time_limit_seconds: question.timeLimitSeconds || 45,
          explanation: question.explanation || null,
          is_active: question.isActive ?? true,
        });
      });
    });

    if (questionsToSeed.length > 0) {
      const { error } = await supabase.from('arena_questions').insert(questionsToSeed);
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
