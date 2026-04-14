import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, MessageSquare, ExternalLink, Beaker, BrainCircuit, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import AurumExpert from '@/services/ai/AurumExpert';

const AurumAiAgent = () => {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  const role = user?.role || 'guest';

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcome = getWelcomeMessage(role);
      setMessages([{ id: 1, text: welcome, sender: 'ai', timestamp: new Date() }]);
    }
  }, [role]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const getWelcomeMessage = (role) => {
    const messages = {
      student: "Chào mừng bạn, nhà nghiên cứu trẻ! Tôi là Aurum AI. Bạn cần tôi giúp gì về các phản ứng hóa học hay bài tập hôm nay?",
      teacher: "Chào bạn đồng nghiệp. Tôi là Trợ thủ Aurum. Tôi có thể hỗ trợ dữ liệu lớp học hoặc gợi ý học liệu cho bạn.",
      admin: "Chào Admin. Tôi đang trong trạng thái sẵn sàng báo cáo dữ liệu hệ thống.",
      guest: "Chào bạn. Đăng nhập để tôi có thể hỗ trợ bạn sâu hơn nhé!"
    };
    return messages[role] || messages.guest;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), text: inputValue, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // AI Logic
    setTimeout(async () => {
      const response = await AurumExpert.ask(userMsg.text, { role, page: location.pathname, user });
      
      const aiMsg = { 
        id: Date.now() + 1, 
        text: response.message, 
        sender: 'ai', 
        timestamp: new Date(),
        data: response.data,
        actions: response.actions,
        suggestions: response.suggestions,
        confidence: response.confidence
      };
      
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleActionClick = (action) => {
    if (action.link) {
      navigate(action.link);
      setIsOpen(false);
    }
    // Handle internal actions if needed
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-4 w-[380px] h-[550px] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col pointer-events-auto"
          >
            {/* Header */}
            <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <Bot size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-[2px]">Aurum AI Agent</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                      {role === 'guest' ? 'Smart Assistant' : `${role} Assistant`}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2.5 rounded-xl hover:bg-white/10 text-white/40 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Messages Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                    <div className={`
                      p-4 rounded-[24px] text-[13px] leading-relaxed relative
                      ${msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white/5 text-white/90 border border-white/5 rounded-tl-none backdrop-blur-md'
                      }
                    `}>
                      {msg.confidence && (
                         <div className="absolute -top-3 left-0 bg-blue-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                           Confidence: {(msg.confidence * 100).toFixed(0)}%
                         </div>
                      )}
                      {msg.text}
                    </div>

                    {/* AI Sub-components: Actions/Data */}
                    {msg.sender === 'ai' && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {msg.suggestions?.map((s, idx) => (
                          <button key={idx} onClick={() => setInputValue(s)} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 hover:text-white hover:bg-blue-600/30 transition-all">
                             {s}
                          </button>
                        ))}
                        {msg.actions?.map((action, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => handleActionClick(action)}
                            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[11px] font-bold hover:bg-blue-600/30 transition-all"
                          >
                             {action.label}
                             <ExternalLink size={12} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-3xl rounded-tl-none border border-white/5">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-6 bg-white/5 border-t border-white/10 shadow-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Hỏi Aurum về hóa học..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-white/20"
                />
                <button 
                  type="submit" 
                  disabled={!inputValue.trim() || isTyping}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white disabled:opacity-30 hover:scale-105 active:scale-95 transition-all"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 rounded-[28px] flex items-center justify-center shadow-[0_20px_40px_rgba(37,99,235,0.3)] transition-all duration-500 pointer-events-auto
          ${isOpen ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'}
        `}
      >
        {isOpen ? <X size={28} /> : (
          <div className="relative">
            <Bot size={32} />
            <Sparkles size={14} className="absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
          </div>
        )}
      </motion.button>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
};

export default AurumAiAgent;
