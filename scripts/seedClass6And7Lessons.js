import { class6Data } from '../src/data/curriculum/class6.js';
import { class7Data } from '../src/data/curriculum/class7.js';
import Lesson from '../api/_models/Lesson.js';
import { supabase } from '../api/_lib/supabase.js';

const lessons = [
  ...class6Data.ketnoi,
  ...class7Data.ketnoi,
];

const toPayload = (lesson) => ({
  lessonId: lesson.id || lesson.lessonId,
  classId: lesson.classId,
  programId: lesson.programId || 'ketnoi',
  title: lesson.title,
  chapter: lesson.chapter,
  order: lesson.order,
  description: lesson.description,
  theoryModules: lesson.theoryModules || [],
  introVideoUrl: lesson.introVideoUrl || '',
  videoModules: lesson.videoModules || [],
  challenges: lesson.challenges || [],
  quizzes: lesson.quizzes || {},
  storySlides: lesson.storySlides || [],
  game: lesson.game || {},
  isPremium: lesson.isPremium || false,
});

const ensureGradeRows = async () => {
  const { error } = await supabase
    .from('khoi')
    .upsert([
      { id: 6, ten: 'Khoi 6' },
      { id: 7, ten: 'Khoi 7' },
    ]);

  if (error) throw error;
};

const main = async () => {
  await ensureGradeRows();

  let created = 0;
  let updated = 0;

  for (const lesson of lessons) {
    const payload = toPayload(lesson);
    const existing = await Lesson.findById(payload.lessonId);

    if (existing) {
      await Lesson.update(payload.lessonId, payload);
      updated += 1;
    } else {
      await Lesson.create(payload);
      created += 1;
    }
  }

  console.log(`Upserted class 6-7 lessons. Created: ${created}. Updated: ${updated}.`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
