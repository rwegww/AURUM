import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { AlertTriangle, CheckCircle2, GraduationCap, LoaderCircle, Lock } from 'lucide-react';

import { revealGroup as containerVariants, revealItem as itemVariants } from '@/utils/motion';
import { useAuth } from '@/context/AuthContext';
import GradePlacementModal from '@/components/lessons/GradePlacementModal';
import { getStudentPlacement, isStudentPlaced, usesInitialPlacement } from '@/utils/studentPlacement';

const Classroom = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, startGradePlacement, submitGradePlacement } = useAuth();
  const [assessment, setAssessment] = useState(null);
  const [startingGrade, setStartingGrade] = useState(null);
  const [placementError, setPlacementError] = useState('');

  const placement = getStudentPlacement(user);
  const placementManaged = usesInitialPlacement(user);
  const placed = isStudentPlaced(user);
  const assignedGrade = placed ? String(placement.assignedGrade) : null;
  const classroomData = [
    {
      grade: 6,
      age: t('common.grade', { grade: 6 }),
      title: t('classroom.grades.6.title'),
      desc: t('classroom.grades.6.desc'),
      image: "/assets/images/classroom/grade8-viet.png",
      color: "bg-sky-500"
    },
    {
      grade: 7,
      age: t('common.grade', { grade: 7 }),
      title: t('classroom.grades.7.title'),
      desc: t('classroom.grades.7.desc'),
      image: "/assets/images/classroom/grade8-viet.png",
      color: "bg-cyan-500"
    },
    {
      grade: 8,
      age: t('common.grade', { grade: 8 }),
      title: t('classroom.grades.8.title'),
      desc: t('classroom.grades.8.desc'),
      image: "/assets/images/classroom/grade8-viet.png",
      color: "bg-viet-green"
    },
    {
      grade: 9,
      age: t('common.grade', { grade: 9 }),
      title: t('classroom.grades.9.title'),
      desc: t('classroom.grades.9.desc'),
      image: "/assets/images/classroom/grade9-viet.png",
      color: "bg-orange-500"
    },
    {
      grade: 10,
      age: t('common.grade', { grade: 10 }),
      title: t('classroom.grades.10.title'),
      desc: t('classroom.grades.10.desc'),
      image: "/assets/images/classroom/grade10-viet.png",
      color: "bg-blue-500"
    },
    {
      grade: 11,
      age: t('common.grade', { grade: 11 }),
      title: t('classroom.grades.11.title'),
      desc: t('classroom.grades.11.desc'),
      image: "/assets/images/classroom/grade11-viet.png",
      color: "bg-emerald-600"
    },
    {
      grade: 12,
      age: t('common.grade', { grade: 12 }),
      title: t('classroom.grades.12.title'),
      desc: t('classroom.grades.12.desc'),
      image: "/assets/images/classroom/grade12-viet.png",
      color: "bg-purple-600"
    },
    {
      grade: 'map',
      age: t('classroom.knowledge_tree.academic_map', 'BẢN ĐỒ KIẾN THỨC'),
      title: t('classroom.knowledge_tree.title', 'Cây Kiến Thức Tổng'),
      desc: t('classroom.knowledge_tree.subtitle', 'Hệ thống hóa toàn bộ kiến thức hóa học từ lớp 8 đến 12'),
      image: "/assets/images/classroom/grade10-viet.png",
      color: "bg-slate-600"
    }
  ];

  const displayedClassrooms = placementManaged && placed
    ? classroomData.filter((item) => item.grade === 'map' || String(item.grade) === assignedGrade)
    : classroomData.filter((item) => item.grade !== 'map' || !placementManaged || placed);

  const startPlacement = async (grade) => {
    setStartingGrade(String(grade));
    setPlacementError('');
    const response = await startGradePlacement(String(grade));
    setStartingGrade(null);
    if (!response.success) {
      setPlacementError(response.message);
      return;
    }
    setAssessment(response.assessment);
  };

  const handleClassroomAction = (item) => {
    if (item.grade === 'map') {
      navigate('/knowledge-map');
      return;
    }

    if (!placementManaged) {
      navigate(`/classroom/${item.grade}/journey`);
      return;
    }

    if (placed) {
      if (String(item.grade) === assignedGrade) navigate(`/classroom/${item.grade}/journey`);
      return;
    }

    void startPlacement(item.grade);
  };

  const handlePlacementPass = (response) => {
    setAssessment(null);
    const firstLesson = response.firstLesson;
    if (!firstLesson?.lessonId) {
      navigate(`/classroom/${response.result.grade}/journey`);
      return;
    }
    navigate(`/classroom/${response.result.grade}/journey/${firstLesson.lessonId}/intro?order=${firstLesson.order || 1}`);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.02_135)] pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-viet-green selection:text-white">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-16 text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="font-rubik text-4xl md:text-5xl font-black text-[#1a1a1a] mb-6 tracking-tight uppercase leading-tight">
            {placementManaged && !placed ? (
              <>Chọn khối để bắt đầu<br/><span className="text-viet-green">Hành trình</span> của bạn</>
            ) : (
              <Trans i18nKey="classroom.title">
                 Bắt đầu hành trình<br/><span className="text-viet-green">Hóa học</span> của bạn
              </Trans>
            )}
          </h1>
          <p className="text-[#1a1a1a]/70 text-lg font-bold">
            {placementManaged && !placed
              ? 'Chọn khối phù hợp và hoàn thành bài đánh giá kiến thức nền để xác nhận lớp học.'
              : t('classroom.subtitle')}
          </p>
        </header>

        {placementManaged && (
          <section className={`mb-10 rounded-[28px] border-2 p-6 shadow-sm ${placed ? 'border-emerald-200 bg-emerald-50' : placement?.lastResult?.passed === false ? 'border-amber-200 bg-amber-50' : 'border-sky-200 bg-sky-50'}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${placed ? 'bg-emerald-600 text-white' : placement?.lastResult?.passed === false ? 'bg-amber-500 text-white' : 'bg-sky-600 text-white'}`}>
                {placed ? <CheckCircle2 size={30} /> : placement?.lastResult?.passed === false ? <AlertTriangle size={30} /> : <GraduationCap size={30} />}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {placed ? `Đã xác nhận khối ${assignedGrade}` : placement?.lastResult?.passed === false ? 'Hãy chọn lại khối phù hợp hơn' : 'Bạn chưa được xếp lớp'}
                </h2>
                <p className="mt-1 font-semibold leading-7 text-slate-600">
                  {placed
                    ? 'Bạn có thể tiếp tục toàn bộ hành trình của khối này.'
                    : placement?.lastResult?.passed === false
                      ? `Lần gần nhất đạt ${placement.lastResult.percent}%. Hệ thống gợi ý khối ${placement.lastResult.recommendedGrade}, nhưng quyết định vẫn là của bạn.`
                      : 'Bài đánh giá gồm 7 câu kiến thức nền, cần đạt tối thiểu 70%. Kết quả không trừ điểm hay XP.'}
                </p>
              </div>
            </div>
          </section>
        )}

        {placementError && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-700" role="alert">
            {placementError}
          </div>
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayedClassrooms.map((item) => {
            const isAssigned = item.grade !== 'map' && String(item.grade) === assignedGrade;
            const isStarting = String(item.grade) === startingGrade;
            const isLocked = placementManaged && placed && item.grade !== 'map' && !isAssigned;
            return (
            <motion.div
              key={item.grade}
              variants={itemVariants}
              className="group flex flex-col h-full"
            >
              <div className="card-tactile overflow-hidden hover:translate-y-1 transition-all duration-200 flex flex-col h-full">
                {/* Image Section */}
                <div className="aspect-[16/10] overflow-hidden relative border-b-2 border-duo-border">
                   <img 
                     src={item.image} 
                     alt={item.title} 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                   />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="px-4 py-1.5 bg-white border-2 border-duo-border border-b-4 rounded-full text-[11px] font-black text-[#1a1a1a] uppercase tracking-widest">
                         {item.age}
                      </span>
                   </div>
                   {isAssigned && (
                     <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg">
                       <CheckCircle2 size={14} /> Khối của bạn
                     </span>
                   )}
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`w-8 h-2 rounded-full border border-duo-border ${item.color}`} />
                      <span className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-widest">Aurum</span>
                   </div>
                   
                   <h3 className="font-rubik text-2xl font-black text-[#1a1a1a] mb-4 group-hover:text-viet-green transition-colors leading-tight">
                      {item.title}
                   </h3>
                   
                   <p className="text-[#1a1a1a]/70 font-medium text-sm leading-relaxed mb-8 flex-1">
                      {item.desc}
                   </p>

                   <button 
                     type="button"
                     onClick={() => handleClassroomAction(item)}
                     disabled={isLocked || isStarting}
                      className={`w-full py-4 rounded-[1rem] font-black text-[13px] uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
                        !isLocked && (item.grade === 6 || item.grade === 7 || item.grade === 8 || item.grade === 'map' || isAssigned || (placementManaged && !placed))
                        ? 'btn-tactile-green' 
                        : 'bg-white text-[#1a1a1a] border-2 border-duo-border border-b-4 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
                      }`}
                   >
                     {isStarting ? <><LoaderCircle size={18} className="animate-spin" /> Đang chuẩn bị</>
                       : isLocked ? <><Lock size={17} /> Đã khóa</>
                         : item.grade === 'map' ? 'Khám phá ngay'
                           : placementManaged && !placed ? <>Chọn khối này <span className="text-lg">→</span></>
                             : <>{t('classroom.enter_class')} <span className="text-lg">→</span></>}
                   </button>
                </div>
              </div>
            </motion.div>
          );})}
        </motion.div>
      </div>

      <AnimatePresence>
        {assessment && (
          <GradePlacementModal
            assessment={assessment}
            onClose={() => setAssessment(null)}
            onSubmit={submitGradePlacement}
            onPass={handlePlacementPass}
            onFail={() => setAssessment(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Classroom;


