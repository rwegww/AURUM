import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import AurumExpert from '@/services/ai/AurumExpert';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Import policy document as raw text
import policyContent from '../../docs/AI_IDENTITY.md?raw';

const AurumAiAgent = () => {
  const { user, isLoggedIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
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

  // Listen for external triggers (e.g. from ElementCard)
  useEffect(() => {
    const handleExternalAsk = (e) => {
      const { query } = e.detail;
      setIsOpen(true);
      performAsk(query);
    };

    window.addEventListener('aurum-ask', handleExternalAsk);
    return () => window.removeEventListener('aurum-ask', handleExternalAsk);
  }, [role, user]);

  const getWelcomeMessage = (role) => {
    const messages = {
      student: "Chào mừng bạn! Tôi là Aurum AI. Tôi vừa được nâng cấp **Mạng thần kinh nhân tạo** để dự đoán phản ứng. Bạn cần tôi giúp gì?",
      teacher: "Chào đồng nghiệp. Trợ thủ AI đã sẵn sàng với bộ máy dự đoán thực tế. Tôi có thể hỗ trợ gì cho bài giảng của bạn?",
      admin: "Hệ thống Neural AI đã trực tuyến. Chào Admin, mọi dữ liệu đã được đồng bộ.",
      guest: "Chào bạn. Đăng nhập để trải nghiệm sức mạnh của AI Aurum nhé!"
    };
    return messages[role] || messages.guest;
  };

  const performAsk = async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), text, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    // AI Logic
    setTimeout(async () => {
      // Build chat history from recent messages (last 10 turns max)
      const recentMessages = [...messages].slice(-10);
      const chat_history = recentMessages
        .filter(m => m.text)
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        }));

      const response = await AurumExpert.ask(text, { 
        role, 
        page: location.pathname, 
        user,
        chat_history
      });
      
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
    }, 1000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    performAsk(inputValue);
    setInputValue('');
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-tight">Aurum AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Neural Engine Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowPolicy(true)}
                  className="text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-1.5 rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
                  title="Chính sách AI & An toàn"
                >
                  <svg className="w-3 h-3 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <span className="font-bold opacity-80">Chính sách AI</span>
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2.5 rounded-xl hover:bg-white/10 text-white/40 transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            </div>

            {/* AI Policy Modal Overlay */}
            <AnimatePresence>
              {showPolicy && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xl flex flex-col"
                >
                  <div className="p-6 border-b border-white/10 flex items-center justify-between bg-blue-600/10">
                    <div className="flex items-center gap-3 text-white">
                      <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      <h4 className="font-bold text-sm uppercase tracking-wider">Hiến chương Aurum AI</h4>
                    </div>
                    <button onClick={() => setShowPolicy(false)} className="p-2 rounded-lg hover:bg-white/10 text-white/60">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 text-xs leading-relaxed text-white/80 scroll-smooth custom-scrollbar">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      className="markdown-content policy-markdown"
                    >
                      {policyContent}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
                      {/* Safety & Logic Badges */}
                      {msg.sender === 'ai' && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {msg.confidence && (
                            <div className="flex items-center gap-1 bg-blue-500/20 text-blue-400 text-[8px] font-black px-1.5 py-0.5 rounded-md border border-blue-500/30 uppercase tracking-tighter">
                              <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M20 12h2"/><path d="M2 12h2"/></svg>
                              Confidence: {(msg.confidence * 100).toFixed(0)}%
                            </div>
                          )}
                          {msg.safety && (
                            <div className={`
                              flex items-center gap-1 text-[8px] font-black px-1.5 py-0.5 rounded-md border uppercase tracking-tighter
                              ${msg.safety === 'Danger' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                                msg.safety === 'Caution' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' :
                                'bg-green-500/20 text-green-500 border-green-500/30'}
                            `}>
                              <svg className="w-2 h-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                              {msg.safety === 'Danger' ? 'Cảnh báo Nguy hiểm' : msg.safety === 'Caution' ? 'Cần Thận trọng' : 'An toàn Giáo dục'}
                            </div>
                          )}
                        </div>
                      )}

                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkMath]} 
                        rehypePlugins={[rehypeKatex]}
                        className="markdown-content"
                        components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-black text-white underline decoration-blue-500/50 decoration-2 underline-offset-2" {...props} />,
                          code: ({node, inline, className, children, ...props}) => (
                            <code className="bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-300 font-mono text-[11px] border border-blue-500/20" {...props}>
                              {children}
                            </code>
                          )
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
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
                             <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6m4-3h6v6m-11 5L21 3"/></svg>
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

            {/* Input Area / Auth States */}
            {!isLoggedIn ? (
              <div className="p-6 bg-white/5 border-t border-white/10 text-center">
                <p className="text-sm font-bold text-white mb-2">Vui lòng đăng nhập</p>
                <p className="text-[10px] text-white/50 mb-4">Bạn cần đăng nhập để trải nghiệm sức mạnh của AI Aurum.</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 transition-colors text-white text-xs font-bold rounded-xl"
                >
                  Đăng nhập ngay
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10 shadow-2xl relative">
                <div className="relative mt-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Hỏi Aurum về hóa học..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-3.5 pl-5 pr-14 text-sm text-white focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-white/20"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputValue.trim() || isTyping}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white disabled:opacity-30 hover:scale-105 active:scale-95 transition-all"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                  </button>
                </div>
              </form>
            )}
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
        {isOpen ? <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg> : (
          <div className="relative">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
            <svg className="absolute -top-1 -right-1 w-3.5 h-3.5 text-yellow-300 animate-pulse" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
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
