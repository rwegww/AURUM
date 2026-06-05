import React from 'react';

const AssistantAvatar = ({ size = 40, className = "" }) => {
  return (
    <div 
      className={`relative rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-gradient-to-tr from-[#0F172A] to-[#1E293B] border border-white/10 shadow-inner ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-[85%] h-[85%] select-none"
      >
        <defs>
          {/* Main Gold Gradient for Aurum */}
          <linearGradient id="aurumGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          
          {/* Theme Green Gradient */}
          <linearGradient id="aurumGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Helmet Body Gradient */}
          <linearGradient id="helmetGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#E2E8F0" />
          </linearGradient>

          {/* Dark Glass Screen Visor */}
          <linearGradient id="visorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          
          {/* Outer ring glow */}
          <radialGradient id="glowRing" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#76c034" stopOpacity="0" />
            <stop offset="100%" stopColor="#76c034" stopOpacity="0.4" />
          </radialGradient>

          {/* Visor Glow filter */}
          <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Ring Glow */}
        <circle cx="50" cy="50" r="48" fill="url(#glowRing)" className="animate-pulse" />

        {/* Outer Tech Orbit Track */}
        <circle cx="50" cy="50" r="46" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="4 6" />

        {/* Robot Shoulders / Base */}
        <path 
          d="M26 80 C 26 70, 74 70, 74 80 C 74 84, 26 84, 26 80 Z" 
          fill="url(#helmetGrad)" 
          stroke="#94A3B8" 
          strokeWidth="1.5" 
        />
        
        {/* Collar Connection */}
        <path d="M42 66 H58 V72 H42 Z" fill="#64748B" />

        {/* Side Ear Antennas */}
        {/* Left Ear */}
        <path d="M18 42 C18 40, 22 40, 22 42 V54 C22 56, 18 56, 18 54 Z" fill="url(#aurumGold)" />
        <rect x="19.5" y="30" width="1" height="10" fill="#FBBF24" />
        <circle cx="20" cy="29" r="2.5" fill="#10B981" filter="url(#neonGlow)" />

        {/* Right Ear */}
        <path d="M78 42 C78 40, 82 40, 82 42 V54 C82 56, 78 56, 78 54 Z" fill="url(#aurumGold)" />
        <rect x="80.5" y="30" width="1" height="10" fill="#FBBF24" />
        <circle cx="81" cy="29" r="2.5" fill="#10B981" filter="url(#neonGlow)" />

        {/* Outer Helmet Head */}
        <rect x="23" y="24" width="54" height="44" rx="18" fill="url(#helmetGrad)" stroke="#CBD5E1" strokeWidth="2" />
        <path d="M30 25 C30 25, 50 21, 70 25" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />

        {/* Visor Mask (Digital Face Screen) */}
        <rect x="29" y="30" width="42" height="28" rx="10" fill="url(#visorGrad)" stroke="#475569" strokeWidth="1.5" />
        
        {/* Interactive grid elements inside screen */}
        <line x1="33" y1="36" x2="67" y2="36" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="0.5" />
        <line x1="33" y1="42" x2="67" y2="42" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="0.5" />
        <line x1="33" y1="48" x2="67" y2="48" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="0.5" />
        <line x1="33" y1="54" x2="67" y2="54" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="0.5" />
        
        {/* Glowing Chemistry Atom Emblem on Forehead */}
        <g transform="translate(50, 16)" stroke="url(#aurumGold)" strokeWidth="0.75" fill="none">
          {/* Nucleus */}
          <circle cx="0" cy="0" r="1.2" fill="#FBBF24" />
          {/* Electron Orbits */}
          <ellipse cx="0" cy="0" rx="5" ry="1.8" transform="rotate(30)" />
          <ellipse cx="0" cy="0" rx="5" ry="1.8" transform="rotate(-30)" />
          <ellipse cx="0" cy="0" rx="5" ry="1.8" transform="rotate(90)" />
        </g>

        {/* Sleek Digital LED Eyes (Pill Shaped) */}
        {/* Left Eye */}
        <g>
          <rect x="38" y="39" width="6" height="8" rx="3" fill="#10B981" filter="url(#neonGlow)">
            <animate attributeName="height" values="8;8;1;8;8" keyTimes="0;0.9;0.95;1;1" dur="4s" repeatCount="indefinite" />
            <animate attributeName="y" values="39;39;42.5;39;39" keyTimes="0;0.9;0.95;1;1" dur="4s" repeatCount="indefinite" />
          </rect>
          {/* Inner pupil reflection */}
          <circle cx="41" cy="42" r="1" fill="#ffffff" />
        </g>

        {/* Right Eye */}
        <g>
          <rect x="56" y="39" width="6" height="8" rx="3" fill="#10B981" filter="url(#neonGlow)">
            <animate attributeName="height" values="8;8;1;8;8" keyTimes="0;0.9;0.95;1;1" dur="4s" repeatCount="indefinite" />
            <animate attributeName="y" values="39;39;42.5;39;39" keyTimes="0;0.9;0.95;1;1" dur="4s" repeatCount="indefinite" />
          </rect>
          {/* Inner pupil reflection */}
          <circle cx="59" cy="42" r="1" fill="#ffffff" />
        </g>

        {/* Waveform Smile/Mouth */}
        <path 
          d="M44 51 Q 50 54, 56 51" 
          stroke="#F59E0B" 
          strokeWidth="1.75" 
          strokeLinecap="round" 
          fill="none" 
          filter="url(#neonGlow)"
        >
          <animate 
            attributeName="d" 
            values="M44 51 Q 50 54, 56 51; M44 51 Q 50 49, 56 51; M44 51 Q 50 54, 56 51" 
            dur="4s" 
            repeatCount="indefinite" 
          />
        </path>
      </svg>
    </div>
  );
};

export default AssistantAvatar;
