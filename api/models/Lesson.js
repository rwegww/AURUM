import { supabase } from '../lib/supabase.js';

const LESSON_TABLE = process.env.LESSONS_TABLE || 'lessons';

const mapLesson = (lesson) => {
  if (!lesson) return null;
  let theoryModules = lesson.theory_modules || [];
  if (typeof theoryModules === 'string') {
    try {
      theoryModules = JSON.parse(theoryModules);
    } catch (e) {
      console.error('Error parsing theory_modules:', e);
      theoryModules = [];
    }
  }

  return {
    ...lesson,
    lessonId: lesson.id,
    classId: lesson.class_id,
    programId: lesson.program_id,
    theoryModules: theoryModules,
    videoModules: lesson.video_modules || [],
    quizzes: lesson.quizzes || [],
    storySlides: lesson.story_slides || [],
    challenges: lesson.challenges || [],
    introVideoUrl: lesson.intro_video_url,
    isPremium: lesson.is_premium,
    // Remove snake_case versions to avoid confusion
    class_id: undefined,
    program_id: undefined,
    theory_modules: undefined,
    video_modules: undefined,
    story_slides: undefined,
    is_premium: undefined
  };
};

const mapToPostgres = (l) => ({
  id: l.lessonId || l.id,
  class_id: l.classId,
  program_id: l.programId,
  title: l.title,
  chapter: l.chapter,
  order: l.order,
  description: l.description,
  theory_modules: l.theoryModules || [],
  video_modules: l.videoModules || [],
  quizzes: l.quizzes || [],
  story_slides: l.storySlides || [],
  challenges: l.challenges || [],
  game: l.game || {},
  intro_video_url: l.introVideoUrl,
  is_premium: l.isPremium || false
});

export const Lesson = {
  async find(query = {}) {
    let supabaseQuery = supabase
      .from(LESSON_TABLE)
      .select('*');
    
    if (query.classId) {
      supabaseQuery = supabaseQuery.eq('class_id', query.classId);
    }
    if (query.programId) {
      supabaseQuery = supabaseQuery.eq('program_id', query.programId);
    }

    const { data, error } = await supabaseQuery.order('order', { ascending: true });
    
    if (error) throw error;
    return data.map(mapLesson);
  },

  async findAll() {
    const { data, error } = await supabase
      .from(LESSON_TABLE)
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data.map(mapLesson);
  },

  async findByClass(classId) {
    const { data, error } = await supabase
      .from(LESSON_TABLE)
      .select('*')
      .eq('class_id', classId)
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data.map(mapLesson);
  },

  async findById(lessonId) {
    const { data, error } = await supabase
      .from(LESSON_TABLE)
      .select('*')
      .eq('id', lessonId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return mapLesson(data);
  },

  async create(lessonData) {
    const pgData = mapToPostgres(lessonData);
    const { data, error } = await supabase
      .from(LESSON_TABLE)
      .insert(pgData)
      .select()
      .single();
    
    if (error) throw error;
    return mapLesson(data);
  },

  async update(lessonId, lessonData) {
    const pgData = mapToPostgres(lessonData);
    // Remove ID from update data to prevent primary key mutation errors
    delete pgData.id;

    const { data, error } = await supabase
      .from(LESSON_TABLE)
      .update(pgData)
      .eq('id', lessonId)
      .select()
      .single();
    
    if (error) throw error;
    return mapLesson(data);
  },

  async delete(lessonId) {
    const { error } = await supabase
      .from(LESSON_TABLE)
      .delete()
      .eq('id', lessonId);
    
    if (error) throw error;
    return true;
  },

  async updateProgress(lessonId, updateData) {
    // Keep this for backward compatibility if used elsewhere, but ideally use update()
    const pgUpdateData = { ...updateData };
    if (updateData.classId) pgUpdateData.class_id = updateData.classId;
    if (updateData.programId) pgUpdateData.program_id = updateData.programId;
    
    const { data, error } = await supabase
      .from(LESSON_TABLE)
      .update(pgUpdateData)
      .eq('id', lessonId)
      .select()
      .single();
    
    if (error) throw error;
    return mapLesson(data);
  },

  async countAll() {
    const { count, error } = await supabase
      .from(LESSON_TABLE)
      .select('id', { count: 'exact', head: true });
    
    if (error) throw error;
    return count;
  },

  async deleteMany() {
    const { error } = await supabase
      .from(LESSON_TABLE)
      .delete()
      .neq('id', '');
    
    if (error) throw error;
  },

  async insertMany(lessons) {
    const { data, error } = await supabase
      .from(LESSON_TABLE)
      .insert(lessons.map(mapToPostgres));
    
    if (error) throw error;
    return data;
  }
};


export default Lesson;
