import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Map, ChevronRight, ChevronLeft, Save, RefreshCcw, GripVertical, AlertTriangle } from 'lucide-react';

const JourneyManager = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState(8);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchJourney = async (grade) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lessons?classId=${grade}`);
      const data = await res.json();
      // Ensure lessons are sorted by order
      const sortedData = [...data].sort((a, b) => (a.order || 0) - (b.order || 0));
      setLessons(sortedData);
      setHasChanges(false);
    } catch (err) {
      console.error('Lỗi tải hành trình:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJourney(selectedGrade);
  }, [selectedGrade]);

  const moveItem = (index, direction) => {
    const newLessons = [...lessons];
    const newIndex = index + direction;
    
    if (newIndex < 0 || newIndex >= newLessons.length) return;
    
    const temp = newLessons[index];
    newLessons[index] = newLessons[newIndex];
    newLessons[newIndex] = temp;
    
    // Update order values based on new indices
    const updatedLessons = newLessons.map((lesson, idx) => ({
      ...lesson,
      order: idx + 1
    }));
    
    setLessons(updatedLessons);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      // Update all lessons in parallel or sequence
      const updatePromises = lessons.map(lesson => 
        fetch(`/api/admin/lessons/${lesson.lessonId}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({
            ...lesson,
            order: lesson.order
          })
        })
      );
      
      await Promise.all(updatePromises);
      setHasChanges(false);
      alert('Đã cập nhật thứ tự hành trình thành công!');
    } catch (err) {
      console.error('Lỗi lưu hành trình:', err);
      alert('Có lỗi xảy ra khi lưu hành trình.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link to="/admin" className="text-viet-green font-bold text-xs mb-2 block hover:underline">← Quay lại Bảng điều khiển</Link>
          <h1 className="text-3xl font-bold text-viet-text tracking-tight flex items-center gap-3">
            Quản lý <span className="text-viet-green">Hành trình</span> <Map className="text-viet-green" size={28} />
          </h1>
          <p className="text-viet-text-light mt-1 font-medium italic">Sắp xếp lộ trình học tập cho học sinh theo từng khối lớp.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 bg-white rounded-2xl border border-viet-border shadow-sm">
            {[8, 9, 10, 11, 12].map(g => (
              <button 
                key={g} 
                onClick={() => setSelectedGrade(g)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedGrade === g ? 'bg-viet-green text-white shadow-md' : 'text-viet-text-light hover:bg-gray-50'
                }`}
              >
                Lớp {g}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
              hasChanges 
                ? 'bg-viet-green text-white shadow-viet-green/20 hover:scale-105' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {saving ? <RefreshCcw className="animate-spin" size={16} /> : <Save size={16} />}
            Lưu thay đổi
          </button>
        </div>
      </header>

      {hasChanges && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-700 text-sm font-medium"
        >
          <AlertTriangle size={18} />
          Bạn có thay đổi chưa lưu. Hãy nhấn "Lưu thay đổi" để cập nhật thứ tự mới cho học sinh.
        </motion.div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-viet-border" />
          ))}
        </div>
      ) : (
        <div className="relative">
          {/* Path Line */}
          <div className="absolute left-[52px] top-10 bottom-10 w-1 bg-slate-100 rounded-full" />
          
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.lessonId}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative flex items-center gap-6"
              >
                {/* Step Indicator */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm border-4 z-10 transition-colors ${
                  index === 0 ? 'bg-viet-green text-white border-viet-green/20' : 'bg-white text-viet-text-light border-slate-50'
                }`}>
                  {index + 1}
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-white p-5 rounded-[28px] border border-viet-border shadow-sm group-hover:shadow-md group-hover:border-viet-green/30 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                      <GripVertical size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-viet-text leading-tight">{lesson.title}</h3>
                      <p className="text-[11px] text-viet-text-light font-medium mt-1 uppercase tracking-wider">
                        {lesson.chapter || 'Nội dung cốt lõi'} • ID: {lesson.lessonId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-viet-green disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                      <ChevronLeft size={20} className="rotate-90" />
                    </button>
                    <button 
                      onClick={() => moveItem(index, 1)}
                      disabled={index === lessons.length - 1}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-viet-green disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                      <ChevronRight size={20} className="rotate-90" />
                    </button>
                    
                    <div className="w-px h-6 bg-slate-100 mx-2" />
                    
                    <Link 
                      to={`/admin/journey/${lesson.lessonId}`} 
                      className="px-4 py-2 rounded-xl text-[11px] font-black uppercase text-viet-green bg-viet-green/5 hover:bg-viet-green hover:text-white transition-all"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {lessons.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Map size={32} />
              </div>
              <p className="text-slate-400 font-bold">Chưa có bài học nào cho khối lớp này.</p>
              <Link to="/admin/lessons" className="text-viet-green font-bold text-sm mt-2 block hover:underline">Tới trang Quản lý Học liệu →</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JourneyManager;
