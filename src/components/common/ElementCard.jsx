import React from 'react';
import { Sparkles } from 'lucide-react';

const ElementCard = ({ element, onClick }) => {
  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'diatomic-nonmetal': return 'from-emerald-500/10 to-emerald-600/5 border-emerald-200 text-emerald-600';
      case 'noble-gas': return 'from-indigo-500/10 to-indigo-600/5 border-indigo-200 text-indigo-600';
      case 'alkali-metal': return 'from-red-500/10 to-red-600/5 border-red-200 text-red-600';
      case 'alkaline-earth-metal': return 'from-orange-500/10 to-orange-600/5 border-orange-200 text-orange-600';
      case 'transition-metal': return 'from-yellow-500/10 to-yellow-600/5 border-yellow-200 text-yellow-600';
      case 'post-transition-metal': return 'from-cyan-500/10 to-cyan-600/5 border-cyan-200 text-cyan-600';
      case 'metalloid': return 'from-teal-500/10 to-teal-600/5 border-teal-200 text-teal-600';
      case 'polyatomic-nonmetal': return 'from-green-500/10 to-green-600/5 border-green-200 text-green-600';
      case 'lanthanide': return 'from-pink-500/10 to-pink-600/5 border-pink-200 text-pink-600';
      case 'actinide': return 'from-purple-500/10 to-purple-600/5 border-purple-200 text-purple-600';
      default: return 'from-slate-500/10 to-slate-600/5 border-slate-200 text-slate-600';
    }
  };

  return (
    <div 
      onClick={() => onClick && onClick(element)}
      className={`relative aspect-square cursor-pointer transition-all duration-300 group ${getCategoryColor(element.category)}`}
    >
        <div className={`absolute inset-0 rounded-2xl border bg-gradient-to-br shadow-sm transition-all duration-500 hover:ring-4 hover:ring-blue-500/30 hover:shadow-2xl hover:z-10 hover:-translate-y-2 overflow-hidden`}>
          {/* AI Trigger */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent('aurum-ask', { detail: { query: `${element.name} là gì?` } }));
            }}
            className="absolute top-1 right-1 p-1 rounded-lg bg-blue-500 text-white opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-20 shadow-lg"
            title="Hỏi AI Aurum"
          >
            <Sparkles size={10} />
          </button>

          <div className="p-1 px-1.5 h-full flex flex-col justify-between">
            <span className="text-[10px] font-bold opacity-60 leading-none">{element.number}</span>
            <div className="flex flex-col items-center justify-center flex-1 -mt-1">
              <span className="text-sm font-black leading-none">{element.symbol}</span>
              <span className="text-[7px] font-bold opacity-70 truncate w-full text-center mt-0.5">{element.name}</span>
            </div>
            <span className="text-[7px] font-bold opacity-40 leading-none text-right">
              {parseFloat(element.weight).toFixed(2)}
            </span>
          </div>
        </div>
    </div>
  );
};

export default ElementCard;
