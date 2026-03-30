import mongoose from 'mongoose';
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
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    console.log('Cleaning old lessons...');
    await Lesson.deleteMany({});
    
    console.log(`Preparing to seed ${allData.length} lessons...`);
    
    const formattedData = allData
      .filter(l => l && l.id) // Ensure we only take items with an ID
      .map(l => ({
        lessonId: l.id,
        classId: l.classId,
        programId: l.programId || 'ketnoi',
        title: l.title,
        chapter: l.chapter,
        order: l.order,
        description: l.description,
        theoryModules: l.theoryModules || [],
        videoModules: l.videoModules || [],
        quizzes: l.quizzes || [],
        game: l.game || {},
        isPremium: l.isPremium || false
      }));

    if (formattedData.length === 0) {
      throw new Error('No valid lesson data found to seed!');
    }

    await Lesson.insertMany(formattedData);
    console.log(`Successfully seeded ${formattedData.length} lessons! 🎉`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
