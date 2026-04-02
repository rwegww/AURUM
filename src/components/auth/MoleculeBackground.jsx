import React from 'react';
import { motion } from 'framer-motion';

const Particle = ({ delay, x, y, size, color }) => (
  <motion.div
    initial={{ x: `${x}%`, y: `${y}%`, opacity: 0.1, scale: 0.5 }}
    animate={{ 
      y: [`${y}%`, `${y - 20}%`, `${y}%`],
      x: [`${x}%`, `${x + 5}%`, `${x}%`],
      opacity: [0.1, 0.3, 0.1],
      scale: [0.5, 0.8, 0.5]
    }}
    transition={{ 
      duration: 10 + Math.random() * 10, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut" 
    }}
    className="absolute rounded-full blur-[1px]"
    style={{ 
      width: size, 
      height: size, 
      backgroundColor: color,
      boxShadow: `0 0 15px ${color}`
    }}
  />
);

const MoleculeBackground = () => {
  const particles = [
    { x: 10, y: 20, size: 40, color: '#76c034', delay: 0 },
    { x: 80, y: 15, size: 60, color: '#4a90e2', delay: 2 },
    { x: 45, y: 60, size: 30, color: '#f5a623', delay: 1 },
    { x: 20, y: 80, size: 50, color: '#ae63e4', delay: 3 },
    { x: 85, y: 85, size: 35, color: '#76c034', delay: 0.5 },
    { x: 5, y: 50, size: 45, color: '#e74c3c', delay: 2.5 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-viet-bg/50">
      {particles.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: 'radial-gradient(#76c034 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }} 
      />
    </div>
  );
};

export default MoleculeBackground;
