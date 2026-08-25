import { supabase } from '../_lib/supabase.js';

const LESSON_TABLE = process.env.LESSONS_TABLE || 'bai_hoc';

const getGradeLevelId = (lesson) => lesson?.khoi_id;

const mapLesson = (lesson) => {
  if (!lesson) return null;
  const gradeLevelId = getGradeLevelId(lesson);
  let theoryModules = lesson.module_ly_thuyet || lesson.theory_modules || [];
  if (typeof theoryModules === 'string') {
    try {
      theoryModules = JSON.parse(theoryModules);
    } catch (e) {
      console.error('Error parsing module_ly_thuyet:', e);
      theoryModules = [];
    }
  }

  return {
    ...lesson,
    lessonId: lesson.id,
    classId: gradeLevelId,
    gradeLevelId,
    programId: lesson.chuong_trinh_id || lesson.program_id,
    title: lesson.tieu_de ?? lesson.title,
    chapter: lesson.chuong ?? lesson.chapter,
    order: lesson.thu_tu ?? lesson.order,
    description: lesson.mo_ta ?? lesson.description,
    theoryModules: theoryModules,
    videoModules: lesson.module_video || lesson.video_modules || [],
    quizzes: lesson.cau_do || lesson.quizzes || [],
    storySlides: lesson.slide_cau_chuyen || lesson.story_slides || [],
    challenges: lesson.thu_thach || lesson.challenges || [],
    game: lesson.tro_choi || lesson.game || {},
    introVideoUrl: lesson.intro_video_url,
    isPremium: lesson.tra_phi ?? lesson.is_premium,
    // Remove snake_case versions to avoid confusion
    khoi_id: undefined,
    program_id: undefined,
    chuong_trinh_id: undefined,
    tieu_de: undefined,
    chuong: undefined,
    thu_tu: undefined,
    mo_ta: undefined,
    theory_modules: undefined,
    module_ly_thuyet: undefined,
    video_modules: undefined,
    module_video: undefined,
    cau_do: undefined,
    story_slides: undefined,
    slide_cau_chuyen: undefined,
    thu_thach: undefined,
    tro_choi: undefined,
    is_premium: undefined,
    tra_phi: undefined
  };
};

const mapToPostgres = (l) => ({
  id: l.lessonId || l.id,
  khoi_id: l.gradeLevelId ?? l.khoi_id ?? l.classId,
  chuong_trinh_id: l.programId,
  tieu_de: l.title,
  chuong: l.chapter,
  thu_tu: l.order,
  mo_ta: l.description,
  module_ly_thuyet: l.theoryModules || [],
  module_video: l.videoModules || [],
  cau_do: l.quizzes || [],
  slide_cau_chuyen: l.storySlides || [],
  thu_thach: l.challenges || [],
  tro_choi: l.game || {},
  intro_video_url: l.introVideoUrl,
  tra_phi: l.isPremium || false
});

export const Lesson = {
  async find(query = {}) {
    let supabaseQuery = supabase
      .from(LESSON_TABLE)
      .select('*');
    
    const gradeLevelId = query.gradeLevelId ?? query.classId;
    if (gradeLevelId) {
      supabaseQuery = supabaseQuery.eq('khoi_id', gradeLevelId);
    }
    if (query.programId) {
      supabaseQuery = supabaseQuery.eq('chuong_trinh_id', query.programId);
    }

    const { data, error } = await supabaseQuery.order('thu_tu', { ascending: true });
    
    if (error) throw error;
    return data.map(mapLesson);
  },

  async findAll() {
    const { data, error } = await supabase
      .from(LESSON_TABLE)
      .select('*')
      .order('thu_tu', { ascending: true });
    
    if (error) throw error;
    return data.map(mapLesson);
  },

  async findByClass(classId) {
    const { data, error } = await supabase
      .from(LESSON_TABLE)
      .select('*')
      .eq('khoi_id', classId)
      .order('thu_tu', { ascending: true });
    
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
    if (updateData.classId || updateData.gradeLevelId || updateData.khoi_id) {
      pgUpdateData.khoi_id = updateData.gradeLevelId ?? updateData.khoi_id ?? updateData.classId;
      delete pgUpdateData.classId;
      delete pgUpdateData.gradeLevelId;
    }
    if (updateData.programId) pgUpdateData.chuong_trinh_id = updateData.programId;
    
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

  async insertMany(bai_hoc) {
    const { data, error } = await supabase
      .from(LESSON_TABLE)
      .insert(bai_hoc.map(mapToPostgres));
    
    if (error) throw error;
    return data;
  }
};


export default Lesson;
