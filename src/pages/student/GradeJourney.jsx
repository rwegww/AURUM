import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import InfographicBook from '@/components/lessons/InfographicBook';

const GradeThemes = {
  8: { title: "Hành Trình Khởi Đầu", subtitle: "Làm chủ các nguyên tố cơ bản", color: "bg-viet-green" },
  9: { title: "Vương Quốc Chuyển Hóa", subtitle: "Bí thuật phản ứng hóa học", color: "bg-indigo-500" },
  10: { title: "Kiến Trúc Sư Nguyên Tử", subtitle: "Xây dựng thế giới vi mô", color: "bg-blue-500" },
};

const GradeJourney = () => {
  const { grade } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookOpen, setIsBookOpen] = useState(false);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch(`/api/lessons?classId=${grade}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Lỗi server (${res.status}): ${text.substring(0, 100)}`);
        }
        const data = await res.json();
        // Take first 12 lessons
        setLessons(Array.isArray(data) ? data.slice(0, 12) : []);
      } catch (err) {
        console.error('Lỗi tải hành trình:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [grade]);

  // Save scroll position on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!loading) {
        sessionStorage.setItem(`scroll-pos-grade-${grade}`, window.scrollY);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [grade, loading]);

  // Restore scroll position after loading
  useLayoutEffect(() => {
    if (!loading) {
      const savedPos = sessionStorage.getItem(`scroll-pos-grade-${grade}`);
      if (savedPos) {
        // Small delay to ensure browser has rendered the long winding path
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedPos, 10));
        }, 100);
      }
    }
  }, [loading, grade]);

  const handleStageClick = (lesson, index) => {
    navigate(`/classroom/${grade}/journey/${lesson.lessonId}/intro?order=${index + 1}`);
  };

  const theme = GradeThemes[grade] || GradeThemes[8];

  if (loading) return (
    <div className="min-h-screen bg-viet-bg flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffbf0] pt-28 pb-20 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-6 relative">
        
        {/* Header Section */}
        <header className="text-center mb-24 relative z-10">
           <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
           >
             <span className="px-4 py-1 bg-viet-green/10 text-viet-green text-[12px] font-black uppercase tracking-[4px] rounded-full">
               Chương Trình Lớp {grade}
             </span>
             <h1 className="text-4xl md:text-5xl font-black text-viet-text mt-4 mb-2 tracking-tight italic">
               {theme.title}
             </h1>
             <p className="text-viet-text-light font-bold text-lg">{theme.subtitle}</p>
           </motion.div>
        </header>

        {/* Winding Path */}
        <div className="relative">
          {/* Path Line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-3 bg-viet-green/5 rounded-full" />
          
          <div className="flex flex-col gap-16 relative z-10">
            {lessons.map((lesson, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`flex items-center w-full ${isEven ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Stage Card */}
                  <div className={`w-[42%] flex ${isEven ? 'justify-end' : 'justify-start'}`}>
                    <button
                      onClick={() => handleStageClick(lesson, index)}
                      className="group relative"
                    >
                      <div className="viet-card p-6 w-full max-w-[280px] hover:scale-105 transition-all cursor-pointer border-2 hover:border-viet-green/40 bg-white">
                         <h4 className="text-[10px] font-black text-viet-green uppercase tracking-widest mb-2">Stage {index + 1}</h4>
                         <h3 className="text-[14px] font-bold text-viet-text leading-tight group-hover:text-viet-green transition-colors">
                            {lesson.title.split(': ').pop()}
                         </h3>
                      </div>
                      
                      {/* Floating Tooltip */}
                      <div className={`absolute top-1/2 -translate-y-1/2 bg-viet-green text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap
                        ${isEven ? '-left-4 -translate-x-full' : '-right-4 translate-x-full'}
                      `}>
                         Nhiệm vụ ➔
                      </div>
                    </button>
                  </div>

                  {/* Connector Node */}
                  <div className="w-[16%] flex justify-center relative">
                     <div className="w-12 h-12 bg-white rounded-2xl border-4 border-viet-green flex items-center justify-center shadow-xl z-10 group cursor-pointer hover:scale-125 transition-all">
                        <span className="text-[14px] font-black text-viet-green">{index + 1}</span>
                     </div>
                  </div>

                  {/* Narrative Spacer */}
                  <div className="w-[42%] px-6">
                     <p className="text-[13px] font-medium text-viet-text-light italic line-clamp-3">
                        {lesson.description || "Hãy chuẩn bị tâm thế để khai mở bí mật của nguyên tố này."}
                     </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* End Milestone / Book */}
          <div className="mt-40 mb-20 flex flex-col items-center">
             <motion.button 
               whileHover={{ scale: 1.1, rotate: [-2, 2, -2] }}
               whileTap={{ scale: 0.9 }}
               onClick={() => setIsBookOpen(true)}
               className="relative group w-32 h-32 flex items-center justify-center cursor-pointer"
             >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-viet-green/20 blur-3xl group-hover:bg-viet-green/40 transition-all rounded-full" />
                
                {/* Book Container */}
                <div className="relative w-24 h-24 bg-white rounded-2xl border-4 border-viet-green shadow-2xl flex flex-col items-center justify-center overflow-hidden transition-transform group-hover:rotate-6">
                   <div className="text-5xl">📖</div>
                   <div className="absolute bottom-1 w-full text-center text-[10px] font-black text-viet-green/40 uppercase tracking-widest">Guide</div>
                </div>

                {/* Badge */}
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-bounce">
                  NEW
                </div>
             </motion.button>
             
             <div className="mt-8 text-center">
                <h3 className="text-xl font-black text-viet-text font-sora">Sổ Tay Hành Trình</h3>
                <p className="text-viet-text-light/60 text-[13px] font-bold mt-1 uppercase tracking-widest">Khám phá Infographic tổng hợp lớp {grade}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Infographic Book Modal */}
      <AnimatePresence>
        {isBookOpen && (
          <InfographicBook 
            isOpen={isBookOpen} 
            onClose={() => setIsBookOpen(false)} 
            lessons={lessons}
            grade={grade}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GradeJourney;
