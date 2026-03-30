import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  lessonId: { type: String, required: true, unique: true },
  classId: { type: Number, required: true },
  programId: { type: String, default: 'ketnoi' },
  title: { type: String, required: true },
  chapter: { type: String },
  order: { type: Number },
  description: { type: String },
  theoryModules: { type: Array, default: [] },
  videoModules: { type: Array, default: [] },
  quizzes: { type: Array, default: [] },
  game: { type: Object, default: {} },
  isPremium: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Lesson || mongoose.model('Lesson', LessonSchema);
