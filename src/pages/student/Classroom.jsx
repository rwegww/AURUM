import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

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
    <div className="min-h-screen bg-viet-bg pt-[110px] pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center max-w-3xl mx-auto animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-black text-viet-text mb-6 tracking-tight uppercase">
            <Trans i18nKey="classroom.title">
               Bắt đầu hành trình <span className="text-viet-green">Hóa học</span> của bạn
            </Trans>
          </h1>
          <p className="text-viet-text-light text-lg font-bold">
            {t('classroom.subtitle')}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {classroomData.map((item, index) => (
            <motion.div
              key={item.grade}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="bg-white rounded-[40px] overflow-hidden border border-viet-border shadow-sm hover:shadow-2xl hover:shadow-viet-green/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                {/* Image Section */}
                <div className="aspect-[16/10] overflow-hidden relative">
                   <img 
                     src={item.image} 
                     alt={item.title} 
                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                   />
                   <div className="absolute top-6 left-6 flex items-center gap-2">
                      <span className="px-4 py-1.5 bg-white border border-viet-border rounded-full text-[11px] font-black text-viet-text-light uppercase tracking-widest shadow-sm">
                         {item.age}
                      </span>
                   </div>
                   <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-1">
                   <div className="flex items-center gap-2 mb-4">
                      <span className={`w-8 h-1 rounded-full ${item.color}`} />
                      <span className="text-[10px] font-black text-viet-green uppercase tracking-widest">Aurum</span>
                   </div>
                   
                   <h3 className="text-2xl font-black text-viet-text mb-4 group-hover:text-viet-green transition-colors leading-tight">
                      {item.title}
                   </h3>
                   
                   <p className="text-viet-text-light font-medium text-sm leading-relaxed mb-8 flex-1">
                      {item.desc}
                   </p>

                   <button 
                     onClick={() => navigate(`/classroom/${item.grade}/journey`)}
                     className={`w-full py-4 rounded-[20px] font-black text-[12px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
                       item.grade === 8 
                       ? 'bg-viet-green text-white shadow-xl shadow-viet-green/20 hover:scale-[1.02]' 
                       : 'bg-gray-50 border border-viet-border text-viet-text-light hover:bg-viet-green hover:text-white hover:border-viet-green'
                     }`}
                   >
                     {t('classroom.enter_class')} <span className="text-lg">➔</span>
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Classroom;
