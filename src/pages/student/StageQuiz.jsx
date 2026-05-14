import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import MissionModal from '@/components/lessons/MissionModal';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const StageQuiz = () => {
  const { t } = useTranslation();
  const { grade, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, completeLessonSegment } = useAuth();
  
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLevel, setCurrentLevel] = useState(searchParams.get('level') || 'level1');
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [videoCompleted, setVideoCompleted] = useState(false);
  
  const order = searchParams.get('order') || '1';

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lessons/${lessonId}`);
        const data = await res.json();
        setLesson(data);
      } catch (err) {
        console.error('Lỗi tải bài học:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  // Xử lý hoàn thành quiz (level1, level2, level3)
  const handleLevelComplete = async ({ mistakes, total }) => {
    let stars = 1;
    if (mistakes <= 1) stars = 3;
    else if (mistakes <= 3) stars = 2;

    const result = { mistakes, total, stars };
    setLastResult(result);
    setShowResult(true);

    if (user) {
      const xpMap = { level1: 30, level2: 50, level3: 100 };
      const xpGain = xpMap[currentLevel] || 30;
      const isLessonCompletion = currentLevel === 'level3';

      try {
        await completeLessonSegment(lessonId, currentLevel, stars, xpGain, isLessonCompletion);
        console.log('✅ Đã lưu giai đoạn:', { lessonId, currentLevel, stars });
      } catch (err) {
        console.error('❌ Lỗi khi lưu giai đoạn:', err);
      }
    }
  };

  // Xử lý hoàn thành xem video (level1)
  const handleVideoComplete = async () => {
    setVideoCompleted(true);

    // Chỉ tự động lưu nếu level1 không có bài tập trắc nghiệm nào
    const currentQuestions = getLevelData('level1');
    if (user && currentQuestions.length === 0) {
      try {
        await completeLessonSegment(lessonId, 'level1', 3, 30, false);
        console.log('✅ Đã lưu giai đoạn 1 (Chỉ video):', { lessonId });
      } catch (err) {
        console.error('❌ Lỗi khi lưu giai đoạn video:', err);
      }
    }
  };

  const handleContinue = () => {
    navigate(`/classroom/${grade}/journey`);
  };

  const handleCancel = () => {
    navigate(`/classroom/${grade}/journey`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const getLevelData = (lvl) => {
    if (!lesson?.quizzes) return [];
    if (Array.isArray(lesson.quizzes)) return lvl === 'level2' ? lesson.quizzes : [];
    return lesson.quizzes[lvl] || [];
  };

  const currentQuestions = getLevelData(currentLevel);

  // ========== LEVEL 1: XEM VIDEO BÀI GIẢNG ==========
  if (currentLevel === 'level1' && !videoCompleted) {
    const videoUrl = lesson?.introVideoUrl;
    // ... existing video render logic ...

    return (
      <div className="fixed inset-0 z-[110] flex items-start justify-center p-4 py-12 bg-[#fffbf0]/90 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="max-w-2xl w-full bg-white rounded-[40px] border border-viet-border shadow-2xl overflow-hidden relative"
        >
          {/* Progress Bar - Full for video */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-viet-green/5">
            <motion.div 
              className="h-full bg-viet-green" 
              initial={{ width: '0%' }} 
              animate={{ width: videoCompleted ? '100%' : '10%' }} 
              transition={{ duration: 0.8 }}
            />
          </div>

          <div className="p-8 md:p-10">
            {/* Header - Giống MissionModal */}
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-viet-green/5 rounded-2xl flex items-center justify-center text-4xl border border-viet-green/10">
                  🎬
                </div>
                <div>
                  <h3 className="text-[12px] font-black text-viet-green uppercase tracking-[3px] mb-1">Bài giảng</h3>
                  <h2 className="text-xl font-bold text-viet-text line-clamp-1">{lesson?.title || 'Bài giảng'}</h2>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-viet-text-light uppercase tracking-widest mb-1">Đoạn</div>
                <div className="text-lg font-black text-viet-green">
                  1<span className="text-viet-text-light/30"> / 3</span>
                </div>
              </div>
            </div>

            {/* Content Area - Giống MissionModal */}
            <div className="bg-[#fcf8f0] rounded-[30px] p-6 mb-8 border border-viet-border">
              {/* Professor Narrative */}
              <div className="flex items-start gap-4 mb-6">
                <img 
                  src="/assets/images/characters/professor_mole.png" 
                  className="w-14 h-14 object-contain grayscale-[0.5] opacity-80" 
                  alt="Prof Mole" 
                />
                <div className="bg-white px-4 py-3 rounded-2xl border border-viet-border text-[14px] font-medium text-viet-text-light relative shadow-sm">
                  <div className="absolute top-4 -left-2 w-4 h-4 bg-white border-l border-b border-viet-border rotate-45" />
                  Hãy xem video bài giảng bên dưới để nắm vững kiến thức trước khi làm bài tập nhé!
                </div>
              </div>

              {/* Video Player */}
              {videoUrl ? (
                <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border border-viet-border mb-4">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full"
                    onEnded={handleVideoComplete}
                    playsInline
                  />
                </div>
              ) : (
                <div className="aspect-video bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 mb-4">
                  <div className="text-4xl mb-3">📭</div>
                  <h4 className="text-sm font-black text-slate-400">Chưa có video bài giảng</h4>
                  <p className="text-[12px] text-slate-300 mt-1">Bài học này chưa được cập nhật video</p>
                </div>
              )}

              {/* Video Status */}
              <div className="text-center">
                <AnimatePresence mode="wait">
                  {videoCompleted ? (
                    <motion.div 
                      key="done"
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="text-viet-green font-black text-[12px] uppercase flex items-center justify-center gap-2"
                    >
                      <span>✅ Đã học xong — Bắt đầu làm bài tập ngay!</span>
                    </motion.div>
                  ) : (
                    <motion.p 
                      key="watching"
                      className="text-[11px] font-bold text-viet-text-light/50 uppercase tracking-widest"
                    >
                      Xem hết video để hoàn thành đoạn này
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Footer - Giống MissionModal */}
            <div className="flex justify-between items-center">
              <button 
                onClick={handleCancel}
                className="text-[11px] font-black text-viet-text-light/50 uppercase tracking-widest hover:text-red-500 transition-colors"
              >
                Hủy lộ trình
              </button>

              {videoCompleted ? (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setVideoCompleted(true)}
                  className="px-8 py-3 bg-viet-green text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-lg hover:brightness-110 hover:scale-105 transition-all"
                >
                  Bắt đầu học ngay →
                </motion.button>
              ) : (
                <button
                  onClick={handleVideoComplete}
                  className="px-6 py-3 bg-slate-100 text-slate-500 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-viet-green hover:text-white transition-all"
                >
                  Đã xem xong
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ========== LEVEL 2 & 3: LÀM BÀI KIỂM TRA ==========
  if (currentQuestions.length === 0) {
    navigate(`/classroom/${grade}/journey`);
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fffbf0]">
       <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-xl border border-viet-border">
         <div className="pr-4 border-r border-slate-200">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Đang làm</div>
            <div className="text-sm font-bold text-slate-700">
               {currentLevel === 'level1' ? 'Đoạn 1: Video + Học' : (currentLevel === 'level2' ? 'Đoạn 2: Hiểu' : 'Đoạn 3: Ôn tập')}
            </div>
         </div>
      </div>

      <MissionModal
        key={currentLevel}
        lessonTitle={`${lesson?.title || 'Bài kiểm tra'}`}
        challenges={currentQuestions.map(q => ({
          ...q,
          type: 'multiple-choice',
          correctAnswer: q.answer
        }))}
        onUnlock={handleLevelComplete}
        onCancel={handleCancel}
      />

      <AnimatePresence>
        {showResult && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[40px] p-10 max-w-sm w-full text-center shadow-2xl border-4 border-viet-green"
            >
              <div className="text-6xl mb-6">🎉</div>
              <h2 className="text-2xl font-black text-viet-text mb-2">Hoàn thành đoạn!</h2>
              <p className="text-viet-text-light font-medium mb-8 uppercase tracking-widest text-xs">
                {currentLevel === 'level1' ? 'Bạn đã bắt đầu hành trình xuất sắc' : (currentLevel === 'level2' ? 'Bạn đã nắm vững kiến thức' : 'Bạn đã ôn tập xuất sắc')}
              </p>

              <div className="bg-slate-50 rounded-2xl p-4 mb-8 flex justify-around">
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase">Chính xác</div>
                   <div className="text-xl font-black text-viet-green">{lastResult?.total - lastResult?.mistakes}/{lastResult?.total}</div>
                </div>
                <div className="w-px bg-slate-200" />
                <div>
                   <div className="text-[10px] font-black text-slate-400 uppercase">Đánh giá</div>
                   <div className="text-xl font-black text-amber-500">
                     {lastResult?.stars === 3 ? 'A+' : lastResult?.stars === 2 ? 'B' : 'C'}
                   </div>
                </div>
              </div>

              <button 
                onClick={handleContinue}
                className="w-full py-4 bg-viet-green text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-viet-green/20 hover:scale-105 transition-all"
              >
                Tiếp tục hành trình
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StageQuiz;

