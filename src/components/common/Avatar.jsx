import React from 'react';

export default function Avatar({ seed = 'User', size = 128, className = "" }) {
  // Use the DiceBear API URL instead of the local library to prevent crashes
  const avatarUri = `https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(seed)}`;

  return (
    <img 
      src={avatarUri} 
      alt={`Avatar of ${seed}`} 
      className={className} 
      style={{ width: size, height: size }}
    />
  );
}
