import dotenv from 'dotenv';
import { class8Data } from '../src/data/curriculum/class8.js';
import { class9Data } from '../src/data/curriculum/class9.js';
import { class10Data } from '../src/data/curriculum/class10.js';
import { class11Data } from '../src/data/curriculum/class11.js';
import { class12Data } from '../src/data/curriculum/class12.js';
import Lesson from '../api/models/Lesson.js';

dotenv.config();

const allData = [
  ...class8Data.ketnoi,
  ...class9Data.ketnoi,
  ...class10Data.ketnoi,
  ...class11Data.ketnoi,
  ...class12Data.ketnoi,
];

async function seed() {
  try {
    console.log('🚀 Starting Supabase Seeding...');
    
    console.log('🧹 Cleaning old lessons...');
    await Lesson.deleteMany();
    
    console.log(`📦 Preparing to seed ${allData.length} lessons...`);
    
    const formattedData = allData
      .filter(l => l && (l.id || l.lessonId)) // Ensure we only take items with an ID
      .map(l => ({
        lessonId: l.id || l.lessonId,
        classId: l.classId,
        programId: l.programId || 'ketnoi',
        title: l.title,
        chapter: l.chapter,
        order: l.order,
        description: l.description,
        theoryModules: l.theoryModules || [],
        videoModules: l.videoModules || [],
        challenges: l.challenges || [],
        quizzes: l.quizzes || [],
        storySlides: l.classId === 8 ? [
          { character: 'professor', text: `Chào mừng bạn đến với ${l.title}! Tôi là Giáo sư Mole, người sẽ đồng hành cùng bạn.` },
          { character: 'robot', text: `Tôi là Robot Chem-E! Để khám phá bài học này, chúng ta cần hoàn thành các thử thách phía trước.` },
          { character: 'professor', text: 'Bạn đã sẵn sàng để trở thành một nhà giả kim thực thụ chưa? Hãy bắt đầu thôi!' }
        ] : (l.storySlides || []),
        game: l.game || {},
        isPremium: l.isPremium || false
      }));

    if (formattedData.length === 0) {
      throw new Error('No valid lesson data found to seed!');
    }

    console.log('⌛ Inserting lessons into Supabase...');
    await Lesson.insertMany(formattedData);
    console.log(`✅ Successfully seeded ${formattedData.length} lessons! 🎉`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
