import React, { useEffect, useState } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import TheoryRenderer from '@/components/lessons/TheoryRenderer';
import LessonSidebar from '@/components/navigation/LessonSidebar';
import DiscussionBoard from '@/components/lessons/DiscussionBoard';
import StoryIntro from '@/components/lessons/StoryIntro';

const LessonPage = () => {
  const { t } = useTranslation();
  const { grade, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  
  const [lesson, setLesson] = useState(null);
  const [gradeLessons, setGradeLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStory, setShowStory] = useState(false);
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

      // Show story if not in lecture mode and slides exist
      if (mode !== 'lecture' && lessonData.storySlides?.length > 0) {
        setShowStory(true);
      }
    } catch (err) {
      console.error(t('lesson_page.error.fetch'), err);
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
          <h2 className="text-xl font-bold mb-4">{t('lesson_page.loading')}</h2>
          <Link to="/lessons" className="text-viet-green hover:underline">{t('lesson_page.back_btn')}</Link>
        </div>
      </div>
    );
  }

  // --- RENDERING LOGIC (Unified Light Theme) ---
  const video = lesson.videoModules?.[0] || { url: '', title: lesson.title };

  return (
    <div className="min-h-screen bg-viet-bg pt-[70px]">
      {showStory && lesson.storySlides?.length > 0 && (
        <StoryIntro 
          slides={lesson.storySlides} 
          onComplete={() => setShowStory(false)}
          onSkip={() => setShowStory(false)}
        />
      )}
      <div className="flex">
        {/* Sidebar - Only show for logged in users or if desired for all */}
        {isLoggedIn && (
          <LessonSidebar 
            grade={grade} 
            lessons={gradeLessons} 
            currentLessonId={lesson.lessonId} 
          />
        )}

        <main className={`flex-1 p-8 max-w-[1200px] ${isLoggedIn ? 'ml-[320px]' : 'mx-auto'}`}>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-viet-green text-white text-[11px] font-bold rounded-lg uppercase tracking-wider">
                {t('lesson_page.grade_label', { grade })}
              </span>
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
                   <h2 className="text-[13px] font-bold text-viet-text leading-none">{lesson.title} | Aurum TV</h2>
                   <span className="text-[10px] text-viet-text-light font-medium uppercase mt-0.5">Aurum</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                   <span className="text-[10px] text-viet-text-light font-bold">{t('lesson_page.video.powered_by')}</span>
                   <span className="text-[14px] font-black text-viet-green italic">Aurum Team</span>
                </div>
             </div>
             {video.url ? (
               <iframe 
                  className="w-full h-full pt-[60px]"
                  src={video.url.replace('watch?v=', 'embed/')} 
                  title={video.title}
                  allowFullScreen
                />
             ) : (
               <div className="w-full h-full pt-[60px] flex items-center justify-center bg-gray-100 text-gray-400 font-medium">
                 {t('lesson_page.video.placeholder')}
               </div>
             )}
          </div>



          <div className="mb-12">
            <div className="viet-card p-8 min-h-[400px]">
              <div className="flex items-center gap-2 mb-6 text-viet-green border-b border-viet-border pb-4">
                 <h3 className="text-[20px] font-bold">{t('lesson_page.content_title')}</h3>
              </div>
              <div className="prose prose-slate max-w-none">
                <TheoryRenderer modules={lesson.theoryModules} />
              </div>
            </div>
          </div>

          <DiscussionBoard lessonId={lesson.lessonId} />
        </main>
      </div>
    </div>
  );
};

export default LessonPage;
