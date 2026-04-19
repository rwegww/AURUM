import React from 'react';

export default function Avatar({ seed = 'User', size = 128, className = "", streakCount = 0 }) {
  const avatarUri = `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(seed)}`;
  
  // Streak ring color logic
  let ringColor = 'transparent';
  let glow = 'none';
  let borderWidth = 0;
  
  if (streakCount >= 30) {
    ringColor = 'linear-gradient(45deg, #ef4444, #f59e0b)'; // Legend: Red-Gold Gradient
    glow = '0 0 15px rgba(239, 68, 68, 0.6)';
    borderWidth = size * 0.08;
  } else if (streakCount >= 14) {
    ringColor = '#f59e0b'; // Master: Amber/Gold
    glow = '0 0 10px rgba(245, 158, 11, 0.5)';
    borderWidth = size * 0.06;
  } else if (streakCount >= 7) {
    ringColor = '#10b981'; // Chemist: Green
    borderWidth = size * 0.05;
  } else if (streakCount >= 3) {
    ringColor = '#3b82f6'; // Beginner: Blue
    borderWidth = size * 0.04;
  }

  return (
    <div 
      className={`relative rounded-full flex items-center justify-center shrink-0 ${className}`}
      style={{ 
        width: size, 
        height: size, 
        padding: borderWidth > 0 ? `${borderWidth}px` : '0',
        background: ringColor,
        boxShadow: glow,
        transition: 'all 0.3s ease'
      }}
    >
      <div className="w-full h-full rounded-full bg-white overflow-hidden flex items-center justify-center">
        <img 
          src={avatarUri} 
          alt={`Avatar of ${seed}`} 
          className="w-full h-full object-cover scale-110"
        />
      </div>
      
      {streakCount > 0 && size > 40 && (
         <div 
           className="absolute -bottom-1 -right-1 bg-white text-orange-600 font-black rounded-full border-2 border-orange-500 flex items-center justify-center shadow-lg"
           style={{ 
             fontSize: size * 0.15,
             minWidth: size * 0.35,
             height: size * 0.35,
             padding: '0 4px'
           }}
         >
           🔥{streakCount}
         </div>
      )}
    </div>
  );
}
