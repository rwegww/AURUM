import { supabase } from '../lib/supabase.js';

const mapLesson = (lesson) => {
  if (!lesson) return null;
  return {
    ...lesson,
    lessonId: lesson.id,
    classId: lesson.class_id,
    programId: lesson.program_id,
    theoryModules: lesson.theory_modules || [],
    videoModules: lesson.video_modules || [],
    quizzes: lesson.quizzes || [],
    storySlides: lesson.story_slides || [],
    challenges: lesson.challenges || [],
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
  is_premium: l.isPremium || false
});

export const Lesson = {
  async find(query = {}) {
    let supabaseQuery = supabase
      .from('lessons')
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
      .from('lessons')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data.map(mapLesson);
  },

  async findByClass(classId) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('class_id', classId)
      .order('order', { ascending: true });
    
    if (error) throw error;
    return data.map(mapLesson);
  },

  async findById(lessonId) {
    const { data, error } = await supabase
      .from('lessons')
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
      .from('lessons')
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
      .from('lessons')
      .update(pgData)
      .eq('id', lessonId)
      .select()
      .single();
    
    if (error) throw error;
    return mapLesson(data);
  },

  async delete(lessonId) {
    const { error } = await supabase
      .from('lessons')
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
      .from('lessons')
      .update(pgUpdateData)
      .eq('id', lessonId)
      .select()
      .single();
    
    if (error) throw error;
    return mapLesson(data);
  },

  async countAll() {
    const { count, error } = await supabase
      .from('lessons')
      .select('id', { count: 'exact', head: true });
    
    if (error) throw error;
    return count;
  },

  async deleteMany() {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .neq('id', '');
    
    if (error) throw error;
  },

  async insertMany(lessons) {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lessons.map(mapToPostgres));
    
    if (error) throw error;
    return data;
  }
};


export default Lesson;
