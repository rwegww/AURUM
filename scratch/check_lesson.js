import dotenv from 'dotenv';
import Lesson from '../api/models/Lesson.js';

dotenv.config();

async function check() {
  try {
    const lessonId = 'hoa8_kntt_bai1';
    const lesson = await Lesson.findById(lessonId);
    if (lesson) {
      console.log('✅ Lesson 1 of Grade 8 found in DB:', lesson.title);
    } else {
      console.log('❌ Lesson 1 of Grade 8 NOT found in DB.');
    }
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

check();
