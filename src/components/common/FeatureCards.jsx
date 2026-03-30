import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCards = ({ title, desc, icon, color, link }) => {
  return (
    <Link 
      to={link}
      className="viet-card p-10 hover:border-viet-green/40 transition-all group cursor-pointer hover:-translate-y-2 !shadow-lg bg-white block"
    >
      <div className={`w-16 h-16 rounded-2xl ${color}/10 border border-${color}/20 flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-viet-text uppercase tracking-tight">{title}</h3>
      <p className="text-viet-text-light leading-relaxed font-medium">
        {desc}
      </p>
      <div className="mt-8 flex items-center gap-2 text-viet-green font-black text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        Khám phá ngay 
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4">
          <path d="M5 12h14m-7-7 7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};

export default FeatureCards;
