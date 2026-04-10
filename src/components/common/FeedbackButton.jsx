import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const { isLoggedIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/feedback/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ type, message })
      });

      if (res.ok) {
        setDone(true);
        setMessage('');
        setTimeout(() => {
          setDone(false);
          setIsOpen(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Lỗi gửi phản hồi:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-viet-green text-white rounded-full shadow-2xl shadow-viet-green/30 flex items-center justify-center text-2xl hover:scale-110 transition-all z-[60] group"
      >
        <span>💬</span>
        <span className="absolute right-full mr-4 px-4 py-2 bg-viet-text text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Góp ý cho Aurum
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-viet-text/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden p-8"
            >
              <header className="mb-6">
                <h2 className="text-2xl font-bold text-viet-text">Gửi <span className="text-viet-green">Góp ý</span></h2>
                <p className="text-sm text-viet-text-light font-medium mt-1">Chúng tôi luôn trân trọng mọi ý kiến từ bạn.</p>
              </header>

              {done ? (
                <div className="py-12 text-center">
                   <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
                      ✓
                   </div>
                   <p className="text-lg font-bold text-viet-text">Cảm ơn bạn!</p>
                   <p className="text-sm text-viet-text-light font-medium">Ý kiến của bạn đã được gửi thành công.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex gap-2 p-1 bg-viet-bg rounded-xl">
                    {['suggestion', 'bug', 'praise'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
                          type === t ? 'bg-white text-viet-green shadow-sm' : 'text-viet-text-light hover:text-viet-text'
                        }`}
                      >
                        {t === 'suggestion' ? 'Góp ý' : t === 'bug' ? 'Báo lỗi' : 'Khen ngợi'}
                      </button>
                    ))}
                  </div>

                  <textarea 
                    autoFocus
                    required
                    placeholder="Hãy mô tả chi tiết ý kiến của bạn..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-40 p-6 rounded-2xl border border-viet-border bg-viet-bg/20 focus:bg-white focus:border-viet-green transition-all outline-none text-sm font-medium resize-none"
                  />

                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-4 text-xs font-bold text-viet-text-light"
                    >Đóng</button>
                    <button 
                      type="submit"
                      disabled={sending}
                      className="flex-[2] py-4 bg-viet-green text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-viet-green/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                      {sending ? 'Đang gửi...' : 'Gửi phản hồi ➔'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackButton;
