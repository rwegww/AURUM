import React from 'react';

export default function Avatar({ seed = 'User', size = 128, className = "", streakCount = 0, level = null }) {
  const avatarUri = `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(seed)}`;
  
  // Milestone Configuration
  let ringStyle = {
    background: 'transparent',
    glow: 'none',
    borderWidth: 0,
    animation: 'none',
    borderImage: 'none'
  };

  if (streakCount >= 100) {
    // 100+ Days: Chroma/Rainbow God
    ringStyle.background = 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff)';
    ringStyle.glow = '0 0 20px rgba(255, 255, 255, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.5)';
    ringStyle.borderWidth = size * 0.12;
    ringStyle.animation = 'chroma-rotate 3s linear infinite';
  } else if (streakCount >= 90) {
    // 90 Days: Mystic Purple
    ringStyle.background = 'linear-gradient(135deg, #a855f7, #6366f1)';
    ringStyle.glow = '0 0 15px rgba(168, 85, 247, 0.7)';
    ringStyle.borderWidth = size * 0.10;
    ringStyle.animation = 'pulse-glow 2s ease-in-out infinite';
  } else if (streakCount >= 30) {
    // 30 Days: Solar Flare
    ringStyle.background = 'linear-gradient(to bottom, #f97316, #ef4444)';
    ringStyle.glow = '0 0 12px rgba(249, 115, 22, 0.6)';
    ringStyle.borderWidth = size * 0.08;
    ringStyle.animation = 'pulse-glow 1.5s ease-in-out infinite';
  } else if (streakCount >= 14) {
    // 14 Days: Golden Alchemist
    ringStyle.background = 'linear-gradient(135deg, #fbbf24, #d97706)';
    ringStyle.glow = '0 0 10px rgba(251, 191, 36, 0.5)';
    ringStyle.borderWidth = size * 0.06;
  } else if (streakCount >= 7) {
    // 7 Days: Emerald Sage
    ringStyle.background = '#10b981';
    ringStyle.borderWidth = size * 0.05;
  } else if (streakCount >= 3) {
    // 3 Days: Blue Novice
    ringStyle.background = '#3b82f6';
    ringStyle.borderWidth = size * 0.04;
  }

  return (
    <div 
      className={`relative rounded-full flex items-center justify-center shrink-0 ${className}`}
      style={{ 
        width: size, 
        height: size, 
        padding: ringStyle.borderWidth > 0 ? `${ringStyle.borderWidth}px` : '0',
        background: ringStyle.background,
        boxShadow: ringStyle.glow,
        animation: ringStyle.animation,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <style>
        {`
          @keyframes chroma-rotate {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
          }
          @keyframes pulse-glow {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(0.98); }
          }
        `}
      </style>
      
      <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center relative">
        <img 
          src={avatarUri} 
          alt={`Avatar of ${seed}`} 
          className="w-full h-full object-cover scale-110"
        />
      </div>

      {/* Level Badge - Top Left */}
      {level !== null && (
        <div 
          className="absolute -top-1 -left-1 bg-viet-green text-white font-black rounded-lg border-2 border-white shadow-md flex items-center justify-center"
          style={{ 
            fontSize: size * 0.12,
            width: size * 0.3,
            height: size * 0.3,
            zIndex: 30
          }}
        >
          {level}
        </div>
      )}
      
      {/* Streak Badge - Bottom Right */}
      {streakCount > 0 && (
         <div 
           className="absolute -bottom-1 -right-1 bg-white text-orange-600 font-black rounded-full border-2 border-orange-500 flex items-center justify-center shadow-lg z-30"
           style={{ 
             fontSize: size * 0.14,
             minWidth: size * 0.38,
             height: size * 0.38,
             padding: '0 4px'
           }}
         >
           🔥{streakCount}
         </div>
      )}
    </div>
  );
}
