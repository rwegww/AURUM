import dotenv from 'dotenv';
import { bai1 } from '../src/data/curriculum/class8/lesson-1.js';
import Lesson from '../api/models/Lesson.js';

dotenv.config();

async function restore() {
  try {
    console.log('🔄 Restoring Lesson 1 of Grade 8...');
    
    const formatted = {
      lessonId: bai1.id || bai1.lessonId,
      classId: bai1.classId,
      programId: bai1.programId || 'ketnoi',
      title: bai1.title,
      chapter: bai1.chapter,
      order: bai1.order,
      description: bai1.description,
      theoryModules: bai1.theoryModules || [],
      videoModules: bai1.videoModules || [],
      challenges: bai1.challenges || [],
      quizzes: bai1.quizzes || [],
      storySlides: [
        { character: 'professor', text: `Chào mừng bạn đến với ${bai1.title}! Tôi là Giáo sư Mole, người sẽ đồng hành cùng bạn.` },
        { character: 'robot', text: `Tôi là Robot Chem-E! Để khám phá bài học này, chúng ta cần hoàn thành các thử thách phía trước.` },
        { character: 'professor', text: 'Bạn đã sẵn sàng để trở thành một nhà giả kim thực thụ chưa? Hãy bắt đầu thôi!' }
      ],
      game: bai1.game || {},
      isPremium: bai1.isPremium || false
    };

    // Upsert (Delete if exists, then insert)
    await Lesson.delete(formatted.lessonId).catch(() => {});
    const result = await Lesson.create(formatted);
    
    console.log('✅ Successfully restored:', result.title);
    process.exit(0);
  } catch (err) {
    console.error('❌ Restore error:', err);
    process.exit(1);
  }
}

restore();
