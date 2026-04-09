import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCards = ({ title, desc, iconSvg, linkText, linkUrl }) => {
  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-[#f0f0f0] transition-all hover:shadow-[0_15px_50px_rgba(118,192,52,0.15)] hover:-translate-y-1 relative group flex flex-col h-full z-10">
      
      {/* Centered Graphic Area */}
      <div className="pt-12 pb-6 flex items-center justify-center">
        {iconSvg}
      </div>

      {/* Content Area */}
      <div className="px-8 pb-10 flex-1 flex flex-col">
        <h3 className="text-[22px] font-black text-viet-text leading-tight mb-3 tracking-tight">
          {title}
        </h3>
        <p className="text-[#6b7280] font-medium text-[14px] leading-relaxed mb-6 flex-1">
          {desc}
        </p>
        
        <Link 
          to={linkUrl} 
          className="text-viet-green font-bold text-[15px] flex items-center gap-2 hover:gap-3 transition-all relative z-20 w-fit underline decoration-2 underline-offset-4"
        >
          {linkText} <span className="text-xl">→</span>
        </Link>
      </div>

      {/* Bottom Right Green Accent Blob */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-viet-green rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 scale-50 group-hover:scale-100 origin-bottom-right" style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} />
      {/* Default static corner accent from the image (a quarter circle) */}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#76c034] pointer-events-none rounded-tl-full opacity-90 group-hover:opacity-0 transition-opacity" />
    </div>
  );
};

export default FeatureCards;
