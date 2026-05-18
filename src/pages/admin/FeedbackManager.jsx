import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const FeedbackManager = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feedbacks');

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

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/feedback/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, isApproved: true } : f));
      }
    } catch (err) {
      console.error('Lỗi duyệt phản hồi:', err);
    }
  };

  const handleTeacherApprove = async (id) => {
    if (!window.confirm('Bạn có chắc chắn duyệt yêu cầu này?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/teacher-requests/${id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: 'resolved' } : f));
      } else {
        const data = await res.json();
        alert(data.message || 'Lỗi duyệt');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTeacherReject = async (id) => {
    if (!window.confirm('Bạn có chắc chắn từ chối yêu cầu này?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/teacher-requests/${id}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: 'rejected' } : f));
      } else {
        const data = await res.json();
        alert(data.message || 'Lỗi từ chối');
      }
    } catch (err) {
      console.error(err);
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
          <Link to="/admin" className="text-viet-green font-bold text-xs mb-2 block hover:underline">← Quay lại Bảng điều khiển</Link>
          <h1 className="text-3xl font-bold text-viet-text tracking-tight">Hòm thư <span className="text-viet-green">Góp ý</span></h1>
          <p className="text-viet-text-light mt-1 font-medium italic">Lắng nghe ý kiến của học sinh để cải thiện hệ thống.</p>
        </header>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('feedbacks')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'feedbacks' ? 'bg-viet-green text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            Phản hồi & Báo lỗi
          </button>
          <button 
            onClick={() => setActiveTab('teachers')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'teachers' ? 'bg-viet-green text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'} flex items-center gap-2`}
          >
            Duyệt Giáo viên
            {feedbacks.filter(f => f.type === 'teacher_registration' && f.status === 'unread').length > 0 && (
              <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]">
                {feedbacks.filter(f => f.type === 'teacher_registration' && f.status === 'unread').length}
              </span>
            )}
          </button>
        </div>

        {loading ? (
           <div className="flex justify-center py-24">
              <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin" />
           </div>
        ) : (
          <div className="space-y-6">
            {feedbacks.filter(f => activeTab === 'teachers' ? f.type === 'teacher_registration' : f.type !== 'teacher_registration').length === 0 ? (
               <div className="bg-white rounded-[32px] border border-viet-border p-24 text-center">
                  <span className="text-4xl mb-4 block">{activeTab === 'teachers' ? '🎓' : '📫'}</span>
                  <p className="text-viet-text-light font-bold">{activeTab === 'teachers' ? 'Không có yêu cầu duyệt nào' : 'Hòm thư hiện đang trống'}</p>
               </div>
            ) : (
              feedbacks.filter(f => activeTab === 'teachers' ? f.type === 'teacher_registration' : f.type !== 'teacher_registration').map((f, i) => (
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
                          <p className="text-sm font-bold text-viet-text">{f.username === 'Anonymous' ? 'Ẩn danh' : f.username}</p>
                          <p className="text-[10px] text-viet-text-light font-medium uppercase mt-0.5">{new Date(f.createdAt).toLocaleString('vi-VN')}</p>
                        </div>
                     </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ring-1 ${getTypeStyle(f.type)}`}>
                           {f.type === 'suggestion' ? 'Góp ý' : f.type === 'bug' ? 'Báo lỗi' : f.type === 'praise' ? 'Khen ngợi' : f.type === 'teacher_registration' ? 'Yêu cầu GV' : f.type}
                        </span>
                        {f.type !== 'teacher_registration' && (
                          f.status === 'unread' ? (
                             <button 
                               onClick={() => handleResolve(f.id)}
                               className="px-4 py-1.5 bg-viet-green text-white text-[10px] font-black rounded-lg uppercase tracking-tight hover:scale-105 transition-all"
                             >Hoàn thành</button>
                          ) : (
                             <span className="px-2.5 py-1 bg-gray-100 text-gray-400 text-[10px] font-black italic rounded-lg tracking-wider">ĐÃ XỬ LÝ</span>
                          )
                        )}
                        {f.type === 'teacher_registration' && (
                          f.status === 'unread' ? (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleTeacherApprove(f.id)}
                                className="px-4 py-1.5 bg-green-500 text-white text-[10px] font-black rounded-lg uppercase tracking-tight hover:scale-105 transition-all"
                              >Duyệt</button>
                              <button 
                                onClick={() => handleTeacherReject(f.id)}
                                className="px-4 py-1.5 bg-red-500 text-white text-[10px] font-black rounded-lg uppercase tracking-tight hover:scale-105 transition-all"
                              >Từ chối</button>
                            </div>
                          ) : f.status === 'resolved' ? (
                             <span className="px-2.5 py-1 bg-green-100 text-green-600 text-[10px] font-black italic rounded-lg tracking-wider">ĐÃ DUYỆT</span>
                          ) : (
                             <span className="px-2.5 py-1 bg-red-100 text-red-600 text-[10px] font-black italic rounded-lg tracking-wider">ĐÃ TỪ CHỐI</span>
                          )
                        )}
                     </div>
                  </div>
                  <div className="pl-[52px]">
                     {f.type === 'teacher_registration' ? (
                       <div className="bg-viet-bg/30 p-6 rounded-2xl border border-viet-green/5 mb-4">
                         <h4 className="text-sm font-bold mb-2">Thông tin đăng ký:</h4>
                         <ul className="text-sm space-y-1">
                           <li><b>Tên đăng nhập:</b> {f.username}</li>
                           <li><b>Email:</b> {JSON.parse(f.message).email || 'N/A'}</li>
                         </ul>
                       </div>
                     ) : (
                       <p className="text-viet-text font-medium leading-relaxed bg-viet-bg/30 p-6 rounded-2xl border border-viet-green/5">
                          {f.message}
                       </p>
                     )}
                     
                     {f.imageUrl && (
                       <div className="mt-4">
                         <img src={f.imageUrl} alt="Đính kèm báo lỗi" className="max-w-md w-full rounded-2xl border border-viet-border object-contain max-h-[300px]" />
                       </div>
                     )}
                     {f.type === 'praise' && (
                       <div className="mt-4 flex justify-end">
                         {f.isApproved ? (
                           <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-xl flex items-center gap-2">
                             ✓ Đang hiển thị trang chủ
                           </span>
                         ) : (
                           <button 
                             onClick={() => handleApprove(f.id)}
                             className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition shadow-md"
                           >
                             ⭐ Duyệt hiển thị trang chủ
                           </button>
                         )}
                       </div>
                     )}
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
