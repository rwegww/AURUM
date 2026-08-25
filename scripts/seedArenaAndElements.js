import { supabase } from '../api/_lib/supabase.js';
import { arenaQuestions } from '../src/data/arenaQuestions.js';
import dotenv from 'dotenv';

dotenv.config();

const QUESTION_FIELDS = [
  'do_kho',
  'khoi_id',
  'cau_hoi',
  'loai_game',
  'noi_dung_game',
  'dap_an',
  'diem',
  'gioi_han_giay',
  'giai_thich',
  'dang_hoat_dong',
];

const stableValue = (value) => {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.keys(value).sort().map((key) => [key, stableValue(value[key])]),
  );
};

const rowsMatch = (existing, expected) => QUESTION_FIELDS.every((field) => (
  JSON.stringify(stableValue(existing[field])) === JSON.stringify(stableValue(expected[field]))
));

async function seed() {
  try {
    console.log('Starting Arena DB seeding...');

    const { data: existingQuestions, error: fetchError } = await supabase
      .from('cau_hoi_dau')
      .select(`id,${QUESTION_FIELDS.join(',')}`);
    if (fetchError) throw fetchError;

    const existingByKey = new Map(
      (existingQuestions || []).map((question) => [
        `${question.do_kho}::${question.cau_hoi}`,
        question,
      ]),
    );

    const questionsToSeed = [];
    const questionsToUpdate = [];
    Object.keys(arenaQuestions).forEach((difficulty) => {
      if (!Array.isArray(arenaQuestions[difficulty])) return;

      arenaQuestions[difficulty].forEach((question) => {
        const row = {
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
        };

        const key = `${row.do_kho}::${row.cau_hoi}`;
        const existing = existingByKey.get(key);
        if (!existing) {
          questionsToSeed.push(row);
          existingByKey.set(key, row);
        } else if (!rowsMatch(existing, row)) {
          questionsToUpdate.push({ id: existing.id, row });
        }
      });
    });

    if (questionsToSeed.length > 0) {
      for (let index = 0; index < questionsToSeed.length; index += 100) {
        const { error } = await supabase
          .from('cau_hoi_dau')
          .insert(questionsToSeed.slice(index, index + 100));
        if (error) throw error;
      }
      console.log(`Inserted ${questionsToSeed.length} arena questions.`);
    }

    for (const question of questionsToUpdate) {
      const { error } = await supabase
        .from('cau_hoi_dau')
        .update(question.row)
        .eq('id', question.id);
      if (error) throw error;
    }
    if (questionsToUpdate.length > 0) {
      console.log(`Updated ${questionsToUpdate.length} arena questions.`);
    }

    if (questionsToSeed.length === 0 && questionsToUpdate.length === 0) {
      console.log('Arena question bank is already up to date.');
    }

    process.exitCode = 0;
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  }
}

seed();
