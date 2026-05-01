import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, Save, Plus, Trash2, Edit3, Image, 
  Gamepad2, ClipboardList, BookOpen, Layers, Zap,
  CheckCircle2, AlertCircle
} from 'lucide-react';

const JourneyDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('video'); // video, quiz, game

  const fetchLesson = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      const data = await res.json();
      
      if (!data.quizzes || data.quizzes.length === 0) {
        data.quizzes = [
          { 
            question: `Câu hỏi ôn tập: Thành phần chính trong bài ${data.title} là gì?`, 
            options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
            answer: 0
          }
        ];
      }

      if (!data.game || Object.keys(data.game).length === 0) {
        data.game = {
          type: 'quiz-rush',
          difficulty: 2,
          rewardXp: 150,
          rewardGem: 10,
          rewardItemId: 'item_basic_flask'
        };
      }

      setLesson(data);
    } catch (err) {
      console.error('Lỗi tải chi tiết bài học:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(lesson)
      });
      
      if (res.ok) {
        alert('Đã cập nhật chi tiết hành trình thành công!');
      } else {
        alert('Lỗi khi lưu dữ liệu.');
      }
    } catch (err) {
      console.error('Lỗi lưu:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !lesson) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button 
            onClick={() => navigate('/admin/journey')}
            className="text-viet-green font-bold text-xs mb-2 flex items-center gap-1 hover:underline"
          >
            <ChevronLeft size={14} /> Quay lại Quản lý hành trình
          </button>
          <h1 className="text-3xl font-bold text-viet-text tracking-tight flex items-center gap-3">
            Thiết kế <span className="text-viet-green">Chặng đường</span> <Zap className="text-viet-green" size={28} />
          </h1>
          <p className="text-viet-text-light mt-1 font-medium italic">Tùy chỉnh video, câu hỏi và phần thưởng cho bài học: <span className="text-viet-green font-bold">{lesson.title}</span></p>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-viet-green text-white rounded-2xl text-sm font-bold shadow-lg shadow-viet-green/20 hover:scale-105 transition-all disabled:opacity-50"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
          Lưu toàn bộ thay đổi
        </button>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Tabs */}
        <aside className="space-y-2">
          {[
            { id: 'video', label: 'Video bài giảng', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-50' },
            { id: 'quiz', label: 'Câu hỏi trắc nghiệm', icon: ClipboardList, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { id: 'game', label: 'Thưởng & Tính điểm', icon: Gamepad2, color: 'text-rose-500', bg: 'bg-rose-50' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all border-2 ${
                activeTab === tab.id 
                  ? `${tab.bg} border-current ${tab.color} font-bold shadow-sm` 
                  : 'bg-white border-transparent text-slate-400 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-3 space-y-6">
          
          <AnimatePresence mode="wait">
            {activeTab === 'video' && (
              <motion.section 
                key="video" 
                initial={{ opacity: 0, x: 10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="bg-white rounded-[32px] border border-viet-border p-8 shadow-sm"
              >
                <div className="mb-8">
                   <h3 className="text-xl font-bold text-viet-text flex items-center gap-2">
                     <BookOpen className="text-amber-500" /> Video bài giảng
                   </h3>
                   <p className="text-xs text-viet-text-light font-medium mt-1 uppercase tracking-wider">Cung cấp URL video từ Cloudinary để học sinh xem phần giới thiệu</p>
                </div>

                <div className="space-y-6">
                   <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/30 space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Link video bài giảng (Cloudinary URL)</label>
                      <input 
                        type="text" 
                        value={lesson.introVideoUrl || ''}
                        onChange={(e) => setLesson({...lesson, introVideoUrl: e.target.value})}
                        placeholder="Dán link video .mp4 từ Cloudinary..."
                        className="w-full bg-white px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono focus:border-amber-400 outline-none"
                      />
                      {lesson.introVideoUrl && (
                        <div className="aspect-video rounded-xl border border-slate-100 overflow-hidden bg-black shadow-lg">
                           <video 
                             src={lesson.introVideoUrl} 
                             className="w-full h-full object-contain" 
                             controls
                           />
                        </div>
                      )}
                      {!lesson.introVideoUrl && (
                        <div className="aspect-video rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-3">
                           <Layers size={48} className="opacity-20" />
                           <p className="text-xs font-medium">Chưa có video được thiết lập</p>
                        </div>
                      )}
                   </div>
                </div>
              </motion.section>
            )}

            {activeTab === 'quiz' && (
              <motion.section 
                key="quiz" 
                initial={{ opacity: 0, x: 10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="bg-white rounded-[32px] border border-viet-border p-8 shadow-sm"
              >
                <div className="flex items-center justify-between mb-8">
                   <div>
                      <h3 className="text-xl font-bold text-viet-text flex items-center gap-2">
                        <ClipboardList className="text-emerald-500" /> Hệ thống Câu hỏi
                      </h3>
                      <p className="text-xs text-viet-text-light font-medium mt-1 uppercase tracking-wider">Cài đặt các câu hỏi đánh giá kiến thức sau video</p>
                   </div>
                   <button 
                     onClick={() => {
                       const newQuizzes = [...(lesson.quizzes || [])];
                       newQuizzes.push({ 
                         question: 'Câu hỏi mới...', 
                         options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
                         answer: 0
                       });
                       setLesson({...lesson, quizzes: newQuizzes});
                     }}
                     className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:scale-105 transition-all"
                   >
                     <Plus size={16} /> Thêm Câu hỏi
                   </button>
                </div>

                <div className="space-y-6">
                  {(lesson.quizzes || []).map((q, idx) => (
                    <div key={idx} className="p-6 rounded-[24px] border border-slate-100 bg-slate-50/50 space-y-4">
                       <div className="flex items-center justify-between">
                         <span className="text-[11px] font-black text-emerald-600 uppercase">Câu hỏi {idx + 1}</span>
                         <button 
                           onClick={() => {
                             const newQuizzes = lesson.quizzes.filter((_, i) => i !== idx);
                             setLesson({...lesson, quizzes: newQuizzes});
                           }}
                           className="text-slate-300 hover:text-red-500 transition-colors"
                         >
                           <Trash2 size={16} />
                         </button>
                       </div>
                       <input 
                         type="text" 
                         value={q.question}
                         onChange={(e) => {
                           const newQuizzes = [...lesson.quizzes];
                           newQuizzes[idx].question = e.target.value;
                           setLesson({...lesson, quizzes: newQuizzes});
                         }}
                         className="w-full bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-emerald-400"
                       />
                       <div className="grid grid-cols-2 gap-3">
                         {(q.options || []).map((opt, optIdx) => (
                           <div key={optIdx} className="relative">
                              <input 
                                type="text" 
                                value={opt}
                                onChange={(e) => {
                                  const newQuizzes = [...lesson.quizzes];
                                  newQuizzes[idx].options[optIdx] = e.target.value;
                                  setLesson({...lesson, quizzes: newQuizzes});
                                }}
                                className={`w-full bg-white pl-10 pr-4 py-2 rounded-xl border text-xs font-medium outline-none transition-all ${
                                  q.answer === optIdx ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100'
                                }`}
                              />
                              <button 
                                onClick={() => {
                                  const newQuizzes = [...lesson.quizzes];
                                  newQuizzes[idx].answer = optIdx;
                                  setLesson({...lesson, quizzes: newQuizzes});
                                }}
                                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all ${
                                  q.answer === optIdx ? 'bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/30' : 'border-slate-200'
                                }`}
                              />
                           </div>
                         ))}
                       </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {activeTab === 'game' && (
              <motion.section 
                key="game" 
                initial={{ opacity: 0, x: 10 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -10 }}
                className="bg-white rounded-[32px] border border-viet-border p-8 shadow-sm"
              >
                <div className="mb-8">
                   <h3 className="text-xl font-bold text-viet-text flex items-center gap-2">
                     <Gamepad2 className="text-rose-500" /> Thưởng & Tính điểm
                   </h3>
                   <p className="text-xs text-viet-text-light font-medium mt-1 uppercase tracking-wider">Cấu hình XP và Đá Aurum mà học sinh nhận được khi hoàn thành chặng</p>
                </div>

                <div className="space-y-8">
                   <div className="p-8 rounded-[40px] bg-rose-50 border border-rose-100 space-y-8">
                      <h4 className="font-bold text-rose-700 flex items-center gap-2">
                        <Zap size={20} /> Thiết lập Phần thưởng (Rewards)
                      </h4>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm">
                          <label className="text-xs font-black text-slate-400 uppercase mb-3 block text-center tracking-widest">XP Thưởng (Kinh nghiệm)</label>
                          <input 
                            type="number" 
                            value={lesson.game?.rewardXp || 100}
                            onChange={(e) => setLesson({...lesson, game: {...(lesson.game || {}), rewardXp: parseInt(e.target.value)}})}
                            className="w-full text-center text-4xl font-black text-rose-600 outline-none"
                          />
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-rose-100 shadow-sm">
                          <label className="text-xs font-black text-slate-400 uppercase mb-3 block text-center tracking-widest">Đá Aurum (Tiền tệ)</label>
                          <input 
                            type="number" 
                            value={lesson.game?.rewardGem || 5}
                            onChange={(e) => setLesson({...lesson, game: {...(lesson.game || {}), rewardGem: parseInt(e.target.value)}})}
                            className="w-full text-center text-4xl font-black text-sky-500 outline-none"
                          />
                        </div>
                      </div>

                      <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-rose-200 flex items-center gap-6">
                         <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-rose-200">
                            ⭐
                         </div>
                         <div className="flex-1">
                            <h5 className="font-bold text-rose-900 text-sm">Cách tính điểm hoàn thành</h5>
                            <p className="text-xs text-rose-700/60 font-medium">Học sinh sẽ nhận đủ số điểm trên khi hoàn thành video và trả lời đúng các câu hỏi trắc nghiệm.</p>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Floating Info */}
      <div className="fixed bottom-8 right-8 flex items-center gap-4 bg-white/80 backdrop-blur-xl border border-viet-border px-6 py-4 rounded-[32px] shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-8">
         <div className="flex -space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-emerald-600 font-bold text-[10px]">{lesson.quizzes?.length || 0}</div>
         </div>
         <div className="w-px h-8 bg-slate-200" />
         <div className="flex items-center gap-2 text-viet-green">
            <CheckCircle2 size={16} />
            <span className="text-xs font-bold">Dữ liệu tối giản</span>
         </div>
      </div>
    </div>
  );
};

export default JourneyDetail;
