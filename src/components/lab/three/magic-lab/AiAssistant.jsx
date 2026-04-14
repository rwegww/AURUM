import React, { useState, useEffect, useMemo } from 'react';
import { Bot, Sparkles, MessageSquare, Search, X, FlaskConical, Beaker as BeakerIcon, Lightbulb } from 'lucide-react';
import useLabStore from './store'; // Correct import

const normalize = (f) => {
  if (!f) return "";
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return f.toString().replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => subMap[m]).trim().toUpperCase();
};

const getSuggestions = (currentItems, reactions, chemicals) => {
  const currentFormulas = currentItems.map(item => normalize(item.formula));
  if (currentFormulas.length === 0) return [{ text: "Hãy thử thêm H2O hoặc một kim loại kiềm như Na!", type: 'tip' }];

  const suggestions = [];
  
  for (let rx of reactions) {
    const rxReactants = rx.reactants.map(r => normalize(r.formula));
    const hasSome = rxReactants.some(req => currentFormulas.includes(req));
    const isMissingSomething = rxReactants.some(req => !currentFormulas.includes(req));
    const alreadyMatch = rxReactants.every(req => currentFormulas.includes(req));

    if (hasSome && isMissingSomething && !alreadyMatch) {
      const missing = rxReactants.filter(req => !currentFormulas.includes(req));
      const missingNames = missing.map(m => chemicals.find(c => normalize(c.formula) === m)?.name || m).join(', ');
      suggestions.push({
        text: `Thêm ${missingNames} để thực hiện phản ứng: ${rx.name || rx.formula}`,
        type: 'reaction_path',
        missing: missing
      });
    }
  }

  return suggestions.slice(0, 3);
};

const getRecipe = (targetFormula, reactions, chemicals) => {
  const recipes = [];
  const targetNorm = normalize(targetFormula);
  
  for (let rx of reactions) {
    if (rx.products.some(p => normalize(p.formula) === targetNorm)) {
      const reactants = rx.reactants.map(r => chemicals.find(c => normalize(c.formula) === normalize(r.formula))?.name || r.formula).join(' + ');
      recipes.push({
        target: chemicals.find(c => normalize(c.formula) === targetNorm)?.name || targetFormula,
        reactants: reactants,
        conditions: rx.requires_heat ? "Cần đun nóng" : "Điều kiện thường",
        message: rx.name || ""
      });
    }
  }
  
  return recipes;
};

const AiAssistant = ({ chemicals = [], reactions = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recipeResults, setRecipeResults] = useState([]);

  // Use the store hook to get the active beaker's contents
  const activeBeakerIndex = useLabStore(state => state.activeBeakerIndex);
  const currentBeakerContents = useLabStore(state => state.beakers[activeBeakerIndex]?.contents || []);

  // Update suggestions when beaker contents change
  useEffect(() => {
    const newSuggestions = getSuggestions(currentBeakerContents, reactions, chemicals);
    setSuggestions(newSuggestions);
  }, [currentBeakerContents, reactions, chemicals]);

  // Search recipes
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length < 2) {
      setRecipeResults([]);
      return;
    }

    const matches = chemicals
      .filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) || 
        c.formula.toLowerCase().includes(query.toLowerCase())
      )
      .map(c => getRecipe(c.formula, reactions, chemicals))
      .flat();
    
    setRecipeResults(matches);
  };

  return (
    <div className="absolute top-24 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* 1. Proactive Suggestion Bubble */}
      {suggestions.length > 0 && !isOpen && (
        <div className="bg-blue-600/80 backdrop-blur-xl border border-blue-400/30 p-3 rounded-2xl rounded-tr-none shadow-2xl animate-bounce-soft max-w-[200px] pointer-events-auto">
          <div className="flex gap-2 items-start">
            <Lightbulb size={16} className="text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-[10px] font-medium leading-tight text-white">
              {suggestions[0].text}
            </p>
          </div>
        </div>
      )}

      {/* 2. Main AI Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 pointer-events-auto group
          ${isOpen 
            ? 'bg-blue-600 rotate-0' 
            : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-110 active:scale-95'
          }
        `}
      >
        {isOpen ? <X size={24} className="text-white" /> : (
          <div className="relative text-white">
            <Bot size={30} className="group-hover:animate-pulse" />
            <Sparkles size={14} className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
        )}
      </button>

      {/* 3. AI Panel */}
      {isOpen && (
        <div className="w-80 bg-black/80 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-scaleIn pointer-events-auto flex flex-col max-h-[70vh]">
          {/* Header */}
          <div className="p-5 border-b border-white/10 bg-white/5 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold">Trợ lí Lab AI</h3>
                <p className="text-[10px] text-white/40">Gợi ý & Công thức</p>
              </div>
            </div>
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-xl transition-colors ${showSearch ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-white/40'}`}
              title="Tìm công thức"
            >
              <Search size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-white">
            {showSearch ? (
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Tìm chất muốn tạo..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-blue-500 outline-none transition-all text-white"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                </div>

                <div className="space-y-3">
                  {recipeResults.length > 0 ? (
                    recipeResults.map((r, i) => (
                      <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-2xl space-y-2 animate-slideIn">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-400">{r.target}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full ${r.conditions.includes('nhiệt') ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                            {r.conditions}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/70 leading-relaxed font-mono bg-black/30 p-2 rounded-lg">
                          {r.reactants}
                        </p>
                      </div>
                    ))
                  ) : searchQuery.length >= 2 ? (
                    <p className="text-center text-[10px] text-white/40 py-4">Không tìm thấy công thức cho "{searchQuery}"</p>
                  ) : (
                    <div className="p-4 text-center space-y-2">
			      <div className="flex justify-center">
				<BeakerIcon size={24} className="text-white/10" />
			      </div>
                              <p className="text-[10px] text-white/40">Nhập tên chất để xem cách điều chế.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest px-1">
                  <MessageSquare size={12} />
                  <span>Gợi ý cho cốc hiện tại</span>
                </div>

                <div className="space-y-3">
                  {suggestions.map((s, i) => (
                    <div 
                      key={i} 
                      className={`
                        p-4 rounded-2xl border transition-all cursor-help
                        ${s.type === 'reaction_path' 
                          ? 'bg-blue-600/10 border-blue-500/20 hover:bg-blue-600/20' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                        }
                      `}
                    >
                      <div className="flex gap-3">
                        <div className={`shrink-0 p-2 rounded-xl ${s.type === 'reaction_path' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                          {s.type === 'reaction_path' ? <FlaskConical size={14} /> : <Lightbulb size={14} />}
                        </div>
                        <p className="text-[11px] leading-relaxed text-white/90">
                          {s.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-soft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-soft { animation: bounce-soft 3s ease-in-out infinite; }
        
        @keyframes scaleIn {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-scaleIn { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }

        @keyframes slideIn {
          from { transform: translateX(10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default AiAssistant;
