import React from 'react';
import { motion } from 'framer-motion';

const InfographicPage = ({ lesson, pageNumber }) => {
  if (!lesson) return null;

  const imagePath = `/assets/curriculum/class${lesson.classId}/${lesson.classId}-${lesson.order}.png`;
  const [imageError, setImageError] = React.useState(false);

  // Extract key summary points from theoryModules (Paragraphs, Lists, InfoBoxes, WarningBoxes)
  const summaryPoints = lesson.theoryModules
    ?.filter(mod => ['list', 'paragraph', 'infoBox', 'warningBox'].includes(mod.type))
    ?.slice(0, 3) // Take up to 3 points
    ?.map(mod => {
      if (mod.type === 'list') return mod.content.items?.[0];
      if (mod.type === 'infoBox' || mod.type === 'warningBox') return mod.content.content;
      return mod.content.text;
    })
    ?.filter(Boolean) || [];

  // Find the most prominent chemical formula in the lesson
  const allText = lesson.theoryModules?.map(m => 
    m.content?.text || m.content?.content || m.content?.items?.join(' ') || ""
  ).join(' ') || "";
  
  const formulas = allText.match(/\$.*?\$/g) || [];
  const mainFormula = formulas.length > 0 ? formulas[0] : "";

  return (
    <div className="w-full h-full bg-white p-4 md:p-8 flex flex-col relative rounded-[40px] overflow-hidden select-none border-x border-viet-border/20 shadow-inner">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-viet-green/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
      
      {/* Grid texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#000 0.5px, transparent 0.5px), linear-gradient(90deg, #000 0.5px, transparent 0.5px)', backgroundSize: '15px 15px' }} />

      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <span className="text-[10px] font-black text-viet-green border border-viet-green/30 px-3 py-1 rounded-full uppercase tracking-widest mb-1 block w-fit">
            Lesson {pageNumber}
          </span>
          <h2 className="text-lg md:text-xl font-black text-viet-text font-sora leading-tight uppercase italic origin-left">
            {lesson.title.split(': ').pop()}
          </h2>
        </div>
      </div>

      <div className="flex-1 relative z-10 flex flex-col min-h-0">
        {!imageError ? (
          <div className="flex-1 w-full bg-[#fcf8f0] rounded-2xl border-2 border-viet-border/30 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img 
              src={imagePath} 
              alt={lesson.title}
              className="w-full h-full object-contain"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {/* Formula Section Fallback */}
            {mainFormula && (
              <div className="bg-[#fcf8f0] p-4 rounded-[20px] border border-dashed border-viet-green/40 text-center shadow-sm">
                 <div className="text-2xl md:text-3xl font-black text-viet-green mb-1">
                    {mainFormula.replace(/\$/g, '')}
                 </div>
                 <div className="text-[9px] font-black text-viet-text-light/50 uppercase tracking-widest">Key Formula</div>
              </div>
            )}

            {/* Facts Fallback */}
            <div className="flex flex-col gap-2">
               <h3 className="text-[11px] font-black text-viet-text uppercase tracking-widest flex items-center gap-2">
                 <span className="w-4 h-[2px] bg-viet-green" /> Kiến thức trọng tâm
               </h3>
               <div className="space-y-2">
                  {summaryPoints.length > 0 ? (
                    summaryPoints.map((point, i) => (
                      <div key={i} className="flex gap-2 items-start bg-viet-bg/30 p-2 rounded-xl border border-viet-border/10">
                         <div className="w-5 h-5 rounded-lg bg-white border border-viet-border flex items-center justify-center shrink-0 text-[10px] font-black text-viet-green shadow-sm">
                           {i + 1}
                         </div>
                         <p className="text-[12px] font-medium text-viet-text-light leading-snug">
                           {point}
                         </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[12px] text-viet-text-light italic">Đang tổng hợp dữ liệu...</p>
                  )}
               </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-4 pt-4 border-t border-viet-border/40 flex justify-between items-end shrink-0">
        <div className="flex flex-col">
          <span className="text-[7px] font-black text-viet-text-light/30 uppercase tracking-[3px]">Survival Guide</span>
          <span className="text-[9px] font-bold text-viet-text font-sora">Chemistry Odyssey</span>
        </div>
        {!imageError && (
          <button 
            onClick={() => window.open(imagePath, '_blank')}
            className="text-[10px] font-black text-viet-green hover:underline flex items-center gap-1"
          >
            Mở ảnh gốc ↗
          </button>
        )}
        <div className="text-[11px] font-black text-viet-green font-mono">
          PG.{String(pageNumber).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

export default InfographicPage;
