import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const FeedbackManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/feedback', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      console.error('Lỗi tải phản hồi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleResolve = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: 'resolved' } : f));
      }
    } catch (err) {
      console.error('Lỗi cập nhật phản hồi:', err);
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'bug': return 'bg-red-50 text-red-600 ring-red-200';
      case 'suggestion': return 'bg-blue-50 text-blue-600 ring-blue-200';
      case 'praise': return 'bg-green-50 text-green-600 ring-green-200';
      default: return 'bg-gray-50 text-gray-600 ring-gray-200';
    }
  };

  return (
    <div className="p-8 pb-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <Link to="/admin" className="text-viet-green font-bold text-xs mb-2 block hover:underline">← Quay lại Dashboard</Link>
          <h1 className="text-3xl font-bold text-viet-text tracking-tight">Hòm thư <span className="text-viet-green">Góp ý</span></h1>
          <p className="text-viet-text-light mt-1 font-medium italic">Lắng nghe ý kiến của học sinh để cải thiện hệ thống.</p>
        </header>

        {loading ? (
           <div className="flex justify-center py-24">
              <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin" />
           </div>
        ) : (
          <div className="space-y-6">
            {feedbacks.length === 0 ? (
               <div className="bg-white rounded-[32px] border border-viet-border p-24 text-center">
                  <span className="text-4xl mb-4 block">📫</span>
                  <p className="text-viet-text-light font-bold">Hòm thư hiện đang trống</p>
               </div>
            ) : (
              feedbacks.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-white rounded-[32px] border border-viet-border p-8 shadow-sm relative overflow-hidden transition-all ${
                    f.status === 'resolved' ? 'opacity-60' : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-viet-bg flex items-center justify-center text-viet-green font-black">
                          {f.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-viet-text">{f.username}</p>
                          <p className="text-[10px] text-viet-text-light font-medium uppercase mt-0.5">{new Date(f.createdAt).toLocaleString()}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ring-1 ${getTypeStyle(f.type)}`}>
                           {f.type}
                        </span>
                        {f.status === 'unread' ? (
                           <button 
                             onClick={() => handleResolve(f.id)}
                             className="px-4 py-1.5 bg-viet-green text-white text-[10px] font-black rounded-lg uppercase tracking-tight hover:scale-105 transition-all"
                           >Hoàn thành</button>
                        ) : (
                           <span className="px-2.5 py-1 bg-gray-100 text-gray-400 text-[10px] font-black italic rounded-lg tracking-wider">ĐÃ XỬ LÝ</span>
                        )}
                     </div>
                  </div>
                  <div className="pl-[52px]">
                     <p className="text-viet-text font-medium leading-relaxed bg-viet-bg/30 p-6 rounded-2xl border border-viet-green/5">
                        {f.message}
                     </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackManager;
