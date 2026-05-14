import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Network } from 'lucide-react';
import { CHEMISTRY_KNOWLEDGE_BASE } from '@/data/theory';
import { CORE_KNOWLEDGE_LESSONS } from '@/data/coreKnowledge';

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

  // Nhóm các chủ đề kiến thức theo danh mục
  const groupedKnowledge = React.useMemo(() => {
    const groups = {};
    CHEMISTRY_KNOWLEDGE_BASE.forEach(topic => {
      if (!groups[topic.category]) {
        groups[topic.category] = [];
      }
      groups[topic.category].push(topic);
    });
    return groups;
  }, []);

  const CATEGORY_ICONS = {
    'Đại cương': '⚛️',
    'Liên kết': '🔗',
    'Mol và định lượng': '⚖️',
    'Chất khí': '💨',
    'Dung dịch': '🧪',
    'Axit – bazơ – muối': '🧫',
    'Phản ứng hóa học': '🔥',
    'Động hóa học': '⚡',
    'Cân bằng hóa học': '⏳',
    'Nhiệt hóa học': '🌡️',
    'Oxi hóa – khử': '🔋',
    'Điện hóa': '⚡',
    'Kim loại': '🪙',
    'Phi kim': '🌍',
    'Hữu cơ': '🧬',
    'An toàn': '🛡️',
  };

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
               Bắt đầu hành trình<br/><span className="text-viet-green">Hóa học</span>của bạn
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

        {/* Divider */}
        <div className="my-24 h-0.5 w-full bg-gradient-to-r from-transparent via-duo-border to-transparent" />

        {/* Cây kiến thức tổng hệ thống lại kiến thức */}
        <div className="mt-8 pb-20">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-duo-border bg-white shadow-sm mb-4">
              <Network size={16} className="text-viet-green animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-widest text-[#1a1a1a]">
                {t('classroom.knowledge_tree.academic_map')}
              </span>
            </div>
            <h2 className="font-rubik text-3xl md:text-4xl font-black text-[#1a1a1a] mb-6 tracking-tight uppercase leading-tight">
              {t('classroom.knowledge_tree.title')}
            </h2>
            <p className="text-[#1a1a1a]/70 font-bold text-base leading-relaxed">
              {t('classroom.knowledge_tree.subtitle')}
              <br/>
              <span className="text-viet-green">{t('classroom.knowledge_tree.instruction')}</span>
            </p>

            {/* Chú thích màu sắc tương ứng các lớp */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[8, 9, 10, 11, 12].map(g => (
                <span 
                  key={g}
                  className={`px-4 py-2 rounded-full border-2 text-[11px] font-black uppercase tracking-wider ${
                    g === 8 ? 'bg-green-50 text-green-700 border-green-200' :
                    g === 9 ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    g === 10 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    g === 11 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    'bg-purple-50 text-purple-700 border-purple-200'
                  }`}
                >
                  {t('common.grade', { grade: g })}
                </span>
              ))}
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(groupedKnowledge).map(([category, topics], catIndex) => {
              const catIcon = CATEGORY_ICONS[category] || '📚';
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ type: "spring", stiffness: 100, delay: catIndex * 0.05 }}
                  className="card-tactile bg-white p-8 flex flex-col h-full relative overflow-hidden"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-duo-border">
                    <span className="text-2xl shrink-0" role="img" aria-label={category}>{catIcon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-rubik text-lg font-black text-[#1a1a1a] uppercase tracking-tight truncate">
                        {category}
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 bg-gray-100 border-2 border-duo-border rounded-full text-[10px] font-black text-slate-500">
                      {topics.length}
                    </span>
                  </div>

                  {/* Topics List with Vertical Connector Line */}
                  <div className="relative pl-6 flex-1 space-y-8">
                    {/* Vertical Connector line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-100 rounded-full" />

                    {topics.map((topic) => {
                      const topicLessons = CORE_KNOWLEDGE_LESSONS[topic.id] || [];
                      return (
                        <div key={topic.id} className="relative group/topic">
                          {/* Timeline Dot Node */}
                          <div className="absolute left-[-23px] top-1.5 w-4 h-4 rounded-full border-2 border-duo-border bg-white group-hover/topic:border-viet-green group-hover/topic:scale-110 transition-all duration-200" />
                          
                          <div>
                            <h4 className="font-bold text-[14px] text-slate-800 group-hover/topic:text-viet-green transition-colors leading-snug flex flex-wrap items-center gap-2">
                              {topic.title}
                              {topic.formula && (
                                <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 font-normal">
                                  {topic.formula.replace(/\\/g, '').replace(/text\{|\}/g, '')}
                                </span>
                              )}
                            </h4>
                            
                            <p className="text-[11.5px] text-slate-500 leading-relaxed font-medium mt-1 mb-3">
                              {topic.explanation.replace(/\*\*/g, '')}
                            </p>

                            {/* Related Lessons */}
                            {topicLessons.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {topicLessons.map((lesson) => (
                                  <button
                                    key={lesson.lessonId}
                                    onClick={() => navigate(`/classroom/${lesson.classId}/journey`)}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10.5px] font-bold border-2 transition-all duration-200 active:scale-95 ${
                                      lesson.classId === 8 ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100/70 hover:border-green-300' :
                                      lesson.classId === 9 ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100/70 hover:border-orange-300' :
                                      lesson.classId === 10 ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/70 hover:border-blue-300' :
                                      lesson.classId === 11 ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70 hover:border-emerald-300' :
                                      'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100/70 hover:border-purple-300'
                                    }`}
                                    title={t('classroom.knowledge_tree.go_journey', { grade: lesson.classId })}
                                  >
                                    <span className="opacity-80">L{lesson.classId}</span>
                                    <span className="w-1 h-1 rounded-full bg-current opacity-40 mx-0.5" />
                                    <span className="truncate max-w-[120px]">{lesson.title.replace(/^Bài \d+: /, '')}</span>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[10px] italic text-slate-400">
                                {t('classroom.knowledge_tree.updating')}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;

