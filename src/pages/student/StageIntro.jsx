import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle2, Compass, FlaskConical } from 'lucide-react';
import StageVideoModal from '@/components/lessons/StageVideoModal';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { getLessonSummary } from '@/utils/lessonSummary';

const StageIntro = () => {
  const { t } = useTranslation();
  const { grade, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const order = searchParams.get('order') || '1';

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all bai_hoc for this grade to determine order
        const listRes = await fetch(`/api/lessons?classId=${grade}`);
        const listData = await listRes.json();
        const sortedLessons = Array.isArray(listData) ? listData : [];

        const res = await fetch(`/api/lessons/${lessonId}`);
        const data = await res.json();
        setLesson(data);

        // Security check
        if (user?.role !== 'admin' && user?.role !== 'teacher') {
          const currentIndex = sortedLessons.findIndex(l => l.lessonId === lessonId);
          if (currentIndex !== -1) {
            const isFirstDefaultUnlocked = currentIndex === 0 && ['6', '7', '8'].includes(grade);
            const isPlacedFirstLesson = currentIndex === 0
              && user?.balancingProgress?.placement?.status === 'placed'
              && String(user.balancingProgress.placement.assignedGrade) === String(grade);
            const isSelfUnlocked = user?.unlockedLessons?.includes(lessonId);
            const isPrevUnlocked = currentIndex > 0 && user?.unlockedLessons?.includes(sortedLessons[currentIndex - 1].lessonId);
            
            if (!isFirstDefaultUnlocked && !isPlacedFirstLesson && !isSelfUnlocked && !isPrevUnlocked) {
              console.warn('Truy cập bị chặn: Bài học chưa được mở khóa (cần pass test học vượt hoặc hoàn thành bài trước)');
              navigate(`/classroom/${grade}/journey`);
            }
          }
        }

      } catch (err) {
        console.error('Lỗi tải bài học:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lessonId, grade, user, navigate]);


  const handleComplete = () => {
    navigate(`/classroom/${grade}/journey/${lessonId}/story?order=${order}`);
  };

  const handleBack = () => {
    navigate(`/classroom/${grade}/journey`);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const videoSrc = lesson?.introVideoUrl || lesson?.videoModules?.find(module => module?.url)?.url || '';
  const summary = getLessonSummary(lesson);
  const briefingGoals = (summary.goals.length ? summary.goals : [
    lesson?.description || 'Nắm ý chính của bài, ghi lại từ khóa quan trọng và sẵn sàng bước vào nhiệm vụ khám phá.',
  ]).slice(0, 3);
  const quizTotal = Array.isArray(lesson?.quizzes)
    ? lesson.quizzes.length
    : Object.values(lesson?.quizzes || {}).reduce((total, group) => (
      total + (Array.isArray(group) ? group.length : 0)
    ), 0);

  if (!videoSrc) {
    return (
      <div className="min-h-screen bg-[#fffbf0] pt-24 pb-10 px-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <button
            type="button"
            onClick={handleBack}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Quay lại lộ trình
          </button>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[28px] border border-amber-100 bg-white shadow-2xl shadow-amber-100/50"
          >
            <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
              <div className="bg-slate-950 p-8 text-white md:p-10">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-amber-100">
                    <Compass size={18} />
                    Chặng {order}
                  </div>
                  <span className="rounded-full bg-amber-400 px-4 py-2 text-sm font-black text-slate-950">
                    Video sẽ bổ sung sau
                  </span>
                </div>

                <p className="text-sm font-black uppercase tracking-[0.25em] text-amber-300">
                  Nhiệm vụ học tập
                </p>
                <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
                  {summary.title}
                </h1>
                <p className="mt-5 text-base leading-8 text-slate-200 md:text-lg">
                  {briefingGoals[0]}
                </p>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Nhiệm vụ', value: summary.challengeCount || 1 },
                    { label: 'Câu hỏi', value: quizTotal },
                    { label: 'Ý chính', value: summary.concepts.length || summary.keywords.length || 3 },
                  ].map(item => (
                    <div key={item.label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <div className="text-2xl font-black text-white">{item.value}</div>
                      <div className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-300">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 md:p-10">
                <div className="mb-7 flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">Briefing trước bài</p>
                    <h2 className="text-2xl font-black text-slate-900">Chuẩn bị trước khi vào thử thách</h2>
                  </div>
                </div>

                <div className="space-y-3">
                  {briefingGoals.map((goal, index) => (
                    <div key={goal} className="flex gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <CheckCircle2 className="mt-1 shrink-0 text-emerald-600" size={20} />
                      <div>
                        <p className="text-xs font-black uppercase tracking-wide text-slate-400">Mục tiêu {index + 1}</p>
                        <p className="mt-1 font-semibold leading-7 text-slate-700">{goal}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-3xl border border-amber-100 bg-amber-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-200 text-amber-800">
                      <FlaskConical size={22} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-amber-900">Nhiệm vụ quan sát</p>
                      <p className="text-sm font-semibold text-amber-800">{summary.lab?.title || 'Kết nối bài học với tình huống quen thuộc'}</p>
                    </div>
                  </div>
                  <p className="mt-4 leading-7 text-amber-950">
                    {summary.lab?.content || summary.applications[0] || 'Hãy ghi lại một ví dụ trong đời sống có liên quan đến bài học để dùng ở phần thử thách.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleComplete}
                  className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-viet-red px-6 py-4 text-lg font-black text-white shadow-lg shadow-red-900/20 transition-transform hover:scale-[1.01]"
                >
                  Vào thử thách
                  <ArrowRight size={22} />
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <StageVideoModal
        videoSrc={videoSrc}
        lessonTitle={lesson?.title || t('common.loading')}
        onComplete={handleComplete}
        onSkip={handleComplete}
        onBack={handleBack}
      />
    </div>
  );
};

export default StageIntro;


