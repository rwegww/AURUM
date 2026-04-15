import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", bounce: 0, duration: 0.8 } 
  }
};

const Classroom = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const classroomData = [
    {
      grade: 8,
      age: t('common.grade', { grade: 8 }),
      title: t('classroom.grades.8.title'),
      desc: t('classroom.grades.8.desc'),
      image: "/assets/images/classroom/grade8.png",
      color: "bg-viet-green"
    },
    {
      grade: 9,
      age: t('common.grade', { grade: 9 }),
      title: t('classroom.grades.9.title'),
      desc: t('classroom.grades.9.desc'),
      image: "/assets/images/classroom/grade9.png",
      color: "bg-orange-500"
    },
    {
      grade: 10,
      age: t('common.grade', { grade: 10 }),
      title: t('classroom.grades.10.title'),
      desc: t('classroom.grades.10.desc'),
      image: "/assets/images/classroom/grade10.png",
      color: "bg-blue-500"
    },
    {
      grade: 11,
      age: t('common.grade', { grade: 11 }),
      title: t('classroom.grades.11.title'),
      desc: t('classroom.grades.11.desc'),
      image: "/assets/images/classroom/grade11.png",
      color: "bg-emerald-600"
    },
    {
      grade: 12,
      age: t('common.grade', { grade: 12 }),
      title: t('classroom.grades.12.title'),
      desc: t('classroom.grades.12.desc'),
      image: "/assets/images/classroom/grade12.png",
      color: "bg-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.02_135)] pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-viet-green selection:text-white">
      <div className="max-w-[1200px] mx-auto">
        <header className="mb-16 text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="font-rubik text-4xl md:text-5xl font-black text-[#1a1a1a] mb-6 tracking-tight uppercase leading-tight">
            <Trans i18nKey="classroom.title">
               Bắt đầu hành trình <span className="text-viet-green">Hóa học</span> của bạn
            </Trans>
          </h1>
          <p className="text-[#1a1a1a]/70 text-lg font-bold">
            {t('classroom.subtitle')}
          </p>
        </header>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {classroomData.map((item, index) => (
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
                     onClick={() => navigate(`/classroom/${item.grade}/journey`)}
                     className={`w-full py-4 rounded-[1rem] font-black text-[13px] uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 ${
                       item.grade === 8 
                       ? 'btn-tactile-green' 
                       : 'bg-white text-[#1a1a1a] border-2 border-duo-border border-b-4 hover:bg-gray-50'
                     }`}
                   >
                     {t('classroom.enter_class')} <span className="text-lg">→</span>
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Classroom;
