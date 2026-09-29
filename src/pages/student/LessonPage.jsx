import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import TheoryRenderer from '@/components/lessons/TheoryRenderer';
import LessonSidebar from '@/components/navigation/LessonSidebar';
import { activityService } from '@/services/ActivityService';
import DiscussionBoard from '@/components/lessons/DiscussionBoard';
import { getVideoEmbedUrl, isFileVideo } from '@/utils/videoLinks';
import {
  formatSgkLessonReference,
  getAurumLessonOrder,
  getLessonDisplayTitle,
} from '@/utils/lessonLabels';

const LessonPage = () => {
  const { t } = useTranslation();
  const { grade, lessonId } = useParams();
  const navigate = useNavigate();
  
  const [lesson, setLesson] = useState(null);
  const [gradeLessons, setGradeLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  const fetchLessonData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch both specific lesson and the list for sidebar
      const [lessonRes, listRes] = await Promise.all([
        fetch(`/api/lessons/${lessonId}`),
        fetch(`/api/lessons?classId=${grade}&view=summary`)
      ]);
      
      const lessonData = await lessonRes.json();
      const listData = await listRes.json();
      
      setLesson(lessonData);
      setGradeLessons(listData);

      // LOG ACTIVITY
      activityService.log({
        type: 'lesson',
        label: `Học bài: ${lessonData.title}`,
        description: `Đã truy cập bài học ${lessonData.title} (Lớp ${grade})`,
        icon: 'BookOpen',
        link: `/lectures/${grade}/${lessonId}`
      });

    } catch (err) {
      console.error(t('lesson_page.error.fetch'), err);
    } finally {
      setLoading(false);
    }
  }, [grade, lessonId, t]);

  useEffect(() => {
    if (grade && lessonId) {
      fetchLessonData();
    }
  }, [fetchLessonData, grade, lessonId]);

  if (loading || !lesson) {
    return (
      <div className="min-h-screen bg-viet-bg flex items-center justify-center text-viet-text">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-4">{t('lesson_page.loading')}</h2>
          <Link to="/lectures" className="text-viet-green hover:underline">{t('lesson_page.back_btn')}</Link>
        </div>
      </div>
    );
  }

  // --- RENDERING LOGIC (Unified Light Theme) ---
  const video = lesson.videoModules?.find(module => module?.url) || null;
  const lessonIndex = gradeLessons.findIndex((item) => item.lessonId === lesson.lessonId || item.id === lesson.id);
  const aurumOrder = getAurumLessonOrder(lesson, lessonIndex);
  const displayTitle = getLessonDisplayTitle(lesson);
  const sgkReference = formatSgkLessonReference(lesson);

  return (
    <div className="min-h-dvh bg-viet-bg pt-[96px] xl:h-dvh xl:overflow-hidden">
      <div className="flex relative items-start xl:h-[calc(100dvh-96px)] xl:overflow-hidden">
        {/* Sidebar - Only show for logged in nguoi_dung or if desired for all */}
        {isLoggedIn && (
          <div className="hidden xl:block h-full shrink-0">
          <LessonSidebar 
            grade={grade} 
            bai_hoc={gradeLessons} 
            currentLessonId={lesson.lessonId} 
          />
          </div>
        )}

        <main className={`flex-1 min-w-0 w-full flex flex-col p-4 sm:p-6 xl:p-8 pt-4 pb-20 max-w-[1200px] xl:h-full xl:overflow-hidden ${isLoggedIn ? 'mx-auto xl:mx-0' : 'mx-auto'}`}>
          {isLoggedIn && (
            <div className="xl:hidden mb-5">
              <Link to={`/lectures?grade=${grade}`} className="inline-flex min-h-11 items-center text-sm font-bold text-viet-green mb-2">
                ← {t('lesson_page.back_btn')}
              </Link>
              <label htmlFor="compact-lesson-select" className="block text-sm font-bold text-viet-text-light mb-2">
                {t('lesson_page.choose_lesson', { defaultValue: 'Chọn bài học' })}
              </label>
              <select
                id="compact-lesson-select"
                value={lesson.lessonId}
                onChange={(event) => navigate(`/lectures/${grade}/${event.target.value}`)}
                className="w-full min-h-12 min-w-0 rounded-2xl border border-viet-border bg-white px-3 text-base font-bold"
              >
                {gradeLessons.map((item) => (
                  <option key={item.lessonId} value={item.lessonId}>{item.title}</option>
                ))}
              </select>
            </div>
          )}
          {/* Header section - FIXED above the scrollable content */}
          <div className="mb-6 shrink-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-viet-green text-white text-[11px] font-bold rounded-lg uppercase tracking-wider">
                {t('lesson_page.grade_label', { grade })}
              </span>
              {aurumOrder && (
                <span className="px-3 py-1 bg-white border border-viet-border text-viet-text-light text-[11px] font-bold rounded-lg uppercase tracking-wider">
                  {t('lectures.card.system_lesson', {
                    order: aurumOrder,
                    defaultValue: 'Bài {{order}} trên AURUM',
                  })}
                </span>
              )}
              {sgkReference && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-bold rounded-lg">
                  <BookOpen size={13} aria-hidden="true" />
                  {sgkReference}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-viet-text leading-tight break-words">
              {displayTitle}
            </h1>
          </div>

          {/* Scrollable Container (Inside the Blue Box) */}
          <div className="min-w-0 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:pr-2 space-y-6 sm:space-y-8 custom-scrollbar">
            {video?.url && (
            <div className="bg-white rounded-3xl overflow-hidden relative group shadow-xl shadow-viet-green/5 shrink-0">
               <div className="min-h-[60px] bg-white/90 backdrop-blur px-3 sm:px-6 py-3 flex items-center gap-3 border-b border-viet-border">
                  <div className="w-8 h-8 rounded-full bg-viet-green flex items-center justify-center text-white shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                     <h2 className="text-[13px] font-bold text-viet-text leading-none">{displayTitle} | Aurum TV</h2>
                     <span className="text-[10px] text-viet-text-light font-medium uppercase mt-0.5">Aurum</span>
                  </div>
                  <div className="ml-auto hidden sm:flex shrink-0 items-center gap-2">
                     <span className="text-[10px] text-viet-text-light font-bold">{t('lesson_page.video.powered_by')}</span>
                     <span className="text-[14px] font-black text-viet-green italic">Aurum Team</span>
                  </div>
               </div>
               {isFileVideo(video.url) ? (
                   <video 
                      controls 
                      className="w-full aspect-video bg-black"
                      src={video.url}
                   />
                 ) : (
                   <iframe 
                      className="w-full aspect-video"
                      src={getVideoEmbedUrl(video.url)} 
                      title={video.title}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
               )}
            </div>
            )}

            <div>
              <div className="viet-card p-4 sm:p-6 xl:p-8">
                <div className="flex items-center gap-2 mb-6 text-viet-green border-b border-viet-border pb-4">
                   <h3 className="text-[20px] font-bold">{t('lesson_page.content_title')}</h3>
                </div>
                <div className="prose prose-slate max-w-none min-w-0 overflow-x-auto">
                  <TheoryRenderer modules={lesson.theoryModules} />
                </div>
              </div>
            </div>

            <DiscussionBoard lessonId={lesson.lessonId} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default LessonPage;

