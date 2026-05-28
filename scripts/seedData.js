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
    console.log('ðŸš€ Starting Supabase Seeding...');
    
    console.log('ðŸ§¹ Cleaning old bai_hoc...');
    await Lesson.deleteMany();
    
    console.log(`ðŸ“¦ Preparing to seed ${allData.length} bai_hoc...`);
    
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
          { character: 'professor', text: `ChÃ o má»«ng báº¡n Ä‘áº¿n vá»›i ${l.title}! TÃ´i lÃ  GiÃ¡o sÆ° Mole, ngÆ°á»i sáº½ Ä‘á»“ng hÃ nh cÃ¹ng báº¡n.` },
          { character: 'robot', text: `TÃ´i lÃ  Robot Chem-E! Äá»ƒ khÃ¡m phÃ¡ bÃ i há»c nÃ y, chÃºng ta cáº§n hoÃ n thÃ nh cÃ¡c thá»­ thÃ¡ch phÃ­a trÆ°á»›c.` },
          { character: 'professor', text: 'Báº¡n Ä‘Ã£ sáºµn sÃ ng Ä‘á»ƒ trá»Ÿ thÃ nh má»™t nhÃ  giáº£ kim thá»±c thá»¥ chÆ°a? HÃ£y báº¯t Ä‘áº§u thÃ´i!' }
        ] : (l.storySlides || []),
        game: l.game || {},
        isPremium: l.isPremium || false
      }));

    if (formattedData.length === 0) {
      throw new Error('No valid lesson data found to seed!');
    }

    console.log('âŒ› Inserting bai_hoc into Supabase...');
    await Lesson.insertMany(formattedData);
    console.log(`âœ… Successfully seeded ${formattedData.length} bai_hoc! ðŸŽ‰`);
    
    process.exit(0);
  } catch (error) {
    console.error('âŒ Seed error:', error);
    process.exit(1);
  }
}

seed();

