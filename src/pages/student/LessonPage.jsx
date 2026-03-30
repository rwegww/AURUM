import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import TheoryRenderer from '@/components/lessons/TheoryRenderer';
import QuizModule from '@/components/lessons/QuizModule';
import LessonSidebar from '@/components/navigation/LessonSidebar';
import DiscussionBoard from '@/components/lessons/DiscussionBoard';

const LessonPage = () => {
  const { grade, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [gradeLessons, setGradeLessons] = useState([]);
  const [activeTab, setActiveTab] = useState('theory'); // 'theory' or 'quiz'
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  const fetchLessonData = async () => {
    setLoading(true);
    try {
      // Fetch both specific lesson and the list for sidebar
      const [lessonRes, listRes] = await Promise.all([
        fetch(`/api/lessons/${lessonId}`),
        fetch(`/api/lessons?classId=${grade}`)
      ]);
      
      const lessonData = await lessonRes.json();
      const listData = await listRes.json();
      
      setLesson(lessonData);
      setGradeLessons(listData);
    } catch (err) {
      console.error('Lỗi tải dữ liệu bài học:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (grade && lessonId) {
      fetchLessonData();
    }
  }, [grade, lessonId]);

  if (loading || !lesson) {
    return (
      <div className="min-h-screen bg-viet-bg flex items-center justify-center text-viet-text">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-4">Đang tải bài học...</h2>
          <Link to="/lessons" className="text-viet-green hover:underline">Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  // --- RENDERING LOGIC (Unified Light Theme) ---
  const video = lesson.videoModules?.[0] || { url: '', title: lesson.title };

  return (
    <div className="min-h-screen bg-viet-bg pt-[70px]">
      <div className="flex">
        {/* Sidebar - Only show for logged in users or if desired for all */}
        {isLoggedIn && (
          <LessonSidebar 
            grade={grade} 
            lessons={gradeLessons} 
            currentLessonId={lesson.lessonId} 
          />
        )}

        <main className={`flex-1 p-8 max-w-[1200px] ${isLoggedIn ? 'ml-[300px]' : 'mx-auto'}`}>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-viet-green text-white text-[11px] font-bold rounded-lg uppercase tracking-wider">
                HÓA HỌC LỚP {grade}
              </span>
              <span className="text-viet-text-light text-[14px]">/</span>
              <span className="text-viet-text-light text-[14px] font-medium">Học kì 1</span>
            </div>
            <h1 className="text-[28px] font-bold text-viet-text leading-tight">
              {lesson.title}
            </h1>
          </div>

          <div className="viet-card mb-8 aspect-video relative group border-none shadow-xl shadow-viet-green/5">
             <div className="absolute top-0 left-0 w-full h-[60px] bg-white/90 backdrop-blur px-6 flex items-center gap-3 z-10 border-b border-viet-border rounded-t-[24px]">
                <div className="w-8 h-8 rounded-full bg-viet-green flex items-center justify-center text-white shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                  </svg>
                </div>
                <div className="flex flex-col">
                   <h2 className="text-[13px] font-bold text-viet-text leading-none">{lesson.title} | VioEdu TV</h2>
                   <span className="text-[10px] text-viet-text-light font-medium uppercase mt-0.5">VioEdu TV</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                   <span className="text-[10px] text-viet-text-light font-bold">Phát triển bởi</span>
                   <span className="text-[14px] font-black text-blue-600 italic">FPT</span>
                </div>
             </div>
             <iframe 
                className="w-full h-full pt-[60px]"
                src={video.url.replace('watch?v=', 'embed/')} 
                title={video.title}
                allowFullScreen
              />
          </div>

          {isLoggedIn && (
            <div className="viet-card p-4 mb-6 bg-white flex items-center gap-6">
              <div className="w-12 h-12 rounded-full border-[3px] border-[#fce8cc] flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-[#d97706]">0%</span>
              </div>
              <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[13px] font-bold text-viet-text">Đã xem: 0%</h3>
                    <span className="text-[10px] text-viet-text-light font-medium">Tự động hoàn thành khi xem đạt 75%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#f0f2f5] rounded-full overflow-hidden">
                    <div className="h-full bg-[#f9b800] w-[0%]" />
                  </div>
              </div>
            </div>
          )}

          <div className="flex bg-[#76c034] p-1.5 rounded-[20px] mb-8">
            <button
              onClick={() => setActiveTab('theory')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[15px] transition-all text-[14px] font-bold ${
                activeTab === 'theory' ? 'bg-white text-[#76c034] shadow-lg' : 'text-white/70 hover:text-white'
              }`}
            >Lý thuyết</button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[15px] transition-all text-[14px] font-bold ${
                activeTab === 'quiz' ? 'bg-white text-[#76c034] shadow-lg' : 'text-white/70 hover:text-white'
              }`}
            >Bài tập củng cố</button>
          </div>

          <div className="mb-12">
            {activeTab === 'theory' ? (
              <div className="viet-card p-8 min-h-[400px]">
                <div className="flex items-center gap-2 mb-6 text-viet-green border-b border-viet-border pb-4">
                   <h3 className="text-[20px] font-bold">Nội dung bài học</h3>
                </div>
                <div className="prose prose-slate max-w-none">
                  <TheoryRenderer modules={lesson.theoryModules} />
                </div>
              </div>
            ) : (
              <div className="viet-card p-8 min-h-[400px]">
                 <QuizModule quizData={lesson.game?.basic || lesson.quizzes || []} />
              </div>
            )}
          </div>

          <DiscussionBoard />
        </main>
      </div>
    </div>
  );
};

export default LessonPage;
