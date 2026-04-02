import React from 'react';
import { elements } from '@/data/elements';

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'diatomic-nonmetal', name: 'Phi kim' },
    { id: 'noble-gas', name: 'Khí hiếm' },
    { id: 'alkali-metal', name: 'Kim loại kiềm' },
    { id: 'alkaline-earth-metal', name: 'Kim loại kiềm thổ' },
    { id: 'metalloid', name: 'Á kim' },
  ];

  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto pb-4 custom-scrollbar scroll-smooth">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange && onCategoryChange(cat.id)}
          className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all border-2 ${
            activeCategory === cat.id
              ? 'bg-viet-green border-viet-green text-white shadow-lg shadow-viet-green/20'
              : 'bg-white border-viet-border text-viet-text-light hover:border-viet-green/30 hover:text-viet-green'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
