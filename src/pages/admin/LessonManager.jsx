import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import MediaUploader from '@/components/admin/MediaUploader';

const LessonManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  const fetchLessons = async (grade) => {
    setLoading(true);
    try {
      const url = grade ? `/api/lessons?classId=${grade}` : '/api/lessons';
      const res = await fetch(url);
      const data = await res.json();
      setLessons(data);
    } catch (err) {
      console.error('Lỗi tải bài học:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons(selectedGrade);
  }, [selectedGrade]);

  const handleEdit = async (lessonId) => {
    // Fetch full lesson data for editing
    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      const data = await res.json();
      setEditingLesson(data);
    } catch (err) {
      console.error('Lỗi tải chi tiết bài học:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    // Implementation for saving (PUT /api/lessons/:id) will go here
    // For now, let's just close the modal
    setEditingLesson(null);
    alert('Chức năng lưu đang được hoàn thiện!');
  };

  return (
    <div className="p-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link to="/admin" className="text-viet-green font-bold text-xs mb-2 block hover:underline">← Quay lại Dashboard</Link>
            <h1 className="text-3xl font-bold text-viet-text tracking-tight">Quản lý <span className="text-viet-green">Học liệu</span></h1>
            <p className="text-viet-text-light mt-1 font-medium italic">Tùy chỉnh nội dung bài học, lý thuyết và bài tập.</p>
          </div>
          
          <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-viet-border shadow-sm">
             {[null, 8, 9, 10, 11, 12].map(g => (
               <button 
                 key={g} 
                 onClick={() => setSelectedGrade(g)}
                 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                   selectedGrade === g ? 'bg-viet-green text-white shadow-md' : 'text-viet-text-light hover:bg-gray-50'
                 }`}
               >
                 {g ? `Lớp ${g}` : 'Tất cả'}
               </button>
             ))}
          </div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-50">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white h-[200px] rounded-[32px] animate-pulse border border-viet-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson, i) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-[32px] border border-viet-border shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                   <span className="px-2 py-1 bg-viet-green/10 text-viet-green text-[10px] font-black rounded-md uppercase">LỚP {lesson.classId}</span>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(lesson.lessonId)}
                        className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all"
                      >✎</button>
                      <button className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-all">🗑</button>
                   </div>
                </div>
                <h3 className="text-lg font-bold text-viet-text mb-2 line-clamp-2">{lesson.title}</h3>
                <p className="text-xs text-viet-text-light line-clamp-2 mb-4 font-medium">{lesson.description}</p>
                <div className="pt-4 border-t border-viet-border flex items-center justify-between">
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-viet-green" />
                      <span className="text-[10px] font-bold text-viet-text-light uppercase tracking-wider">{lesson.chapter || 'Kỳ 1'}</span>
                   </div>
                   <span className="text-[10px] font-black text-viet-text uppercase opacity-30">ID: {lesson.lessonId}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Modal (Simplified for now) */}
        <AnimatePresence>
          {editingLesson && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            >
               <motion.div 
                 initial={{ y: 50 }}
                 animate={{ y: 0 }}
                 className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
               >
                  <div className="p-8 border-b border-viet-border flex items-center justify-between bg-viet-bg/30">
                     <div>
                        <h2 className="text-2xl font-bold text-viet-text">Chỉnh sửa bài học</h2>
                        <p className="text-sm text-viet-text-light font-medium">{editingLesson.title}</p>
                     </div>
                     <button 
                       onClick={() => setEditingLesson(null)}
                       className="w-10 h-10 rounded-full bg-white border border-viet-border flex items-center justify-center text-viet-text hover:bg-red-50 hover:text-red-500 transition-all"
                     >✕</button>
                  </div>

                  <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="block text-xs font-bold text-viet-text-light uppercase tracking-wider">Tiêu đề bài học</label>
                           <input 
                             type="text" 
                             defaultValue={editingLesson.title}
                             className="w-full h-12 px-6 rounded-2xl border border-viet-border bg-viet-bg/20 focus:bg-white focus:border-viet-green transition-all outline-none font-bold"
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="block text-xs font-bold text-viet-text-light uppercase tracking-wider">Chương / Phần</label>
                           <input 
                             type="text" 
                             defaultValue={editingLesson.chapter}
                             className="w-full h-12 px-6 rounded-2xl border border-viet-border bg-viet-bg/20 focus:bg-white focus:border-viet-green transition-all outline-none font-bold"
                           />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="block text-xs font-bold text-viet-text-light uppercase tracking-wider">Mô tả bài tập</label>
                        <textarea 
                          defaultValue={editingLesson.description}
                          className="w-full p-6 rounded-2xl border border-viet-border bg-viet-bg/20 focus:bg-white focus:border-viet-green transition-all outline-none font-medium h-32 resize-none"
                        />
                     </div>

                     <section className="space-y-6 pt-4 border-t border-viet-border">
                        <h3 className="text-sm font-bold text-viet-text uppercase tracking-widest text-viet-green">Tải tài liệu lên Cloudinary</h3>
                        <MediaUploader onUploadSuccess={(url) => console.log('New URL:', url)} />
                     </section>
                  </form>

                  <div className="p-8 border-t border-viet-border bg-viet-bg/30 flex justify-end gap-4">
                     <button 
                       type="button"
                       onClick={() => setEditingLesson(null)}
                       className="px-8 py-3 rounded-2xl font-bold text-viet-text-light hover:bg-white hover:shadow-sm transition-all"
                     >Hủy bỏ</button>
                     <button 
                        onClick={handleSave}
                        className="px-10 py-3 rounded-2xl bg-viet-green text-white font-bold shadow-lg shadow-viet-green/20 hover:scale-105 transition-all"
                     >Lưu thay đổi</button>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LessonManager;
