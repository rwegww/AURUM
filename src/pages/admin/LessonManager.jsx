import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import MediaUploader from '@/components/admin/MediaUploader';

const modulesToMarkdown = (modules) => {
  if (!modules || !modules.length) return '';
  if (modules.length === 1 && modules[0].type === 'markdown') {
    return modules[0].content.text;
  }
  
  return modules.map(m => {
    if (m.type === 'heading') {
      const level = m.content.level ? parseInt(m.content.level.replace('h', '')) : 2;
      return `${'#'.repeat(level)} ${m.content.text}`;
    }
    if (m.type === 'paragraph') return m.content.text;
    if (m.type === 'list') return m.content.items.map(i => `- ${i}`).join('\n');
    if (m.type === 'infoBox') return `> â„¹ï¸ **${m.content.title}**\n> ${m.content.content}`;
    if (m.type === 'warningBox') return `> âš ï¸ **${m.content.title}**\n> ${m.content.content}`;
    return '';
  }).join('\n\n');
};

const LessonManager = () => {
  const [bai_hoc, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    videoUrl: '',
    classId: 8,
    chapter: 'ChÆ°Æ¡ng 1',
    programId: 'ketnoi'
  });

  const fetchLessons = async (grade) => {
    setLoading(true);
    try {
      const url = grade ? `/api/lessons?classId=${grade}` : '/api/lessons';
      const res = await fetch(url);
      const data = await res.json();
      setLessons(data);
    } catch (err) {
      console.error('Lá»—i táº£i bÃ i há»c:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons(selectedGrade);
  }, [selectedGrade]);

  const handleEdit = async (lessonId) => {
    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      const data = await res.json();
      setEditingLesson(data);
      setFormData({
        title: data.title,
        description: data.description,
        content: modulesToMarkdown(data.theoryModules),
        videoUrl: data.videoModules?.[0]?.url || '',
        classId: data.classId,
        chapter: data.chapter,
        programId: data.programId || 'ketnoi'
      });
      setIsCreating(false);
    } catch (err) {
      console.error('Lá»—i táº£i chi tiáº¿t bÃ i há»c:', err);
    }
  };

  const handleCreateNew = () => {
    setEditingLesson(null);
    setIsCreating(true);
    setFormData({
      title: '',
      description: '',
      content: '',
      videoUrl: '',
      classId: selectedGrade || 8,
      chapter: 'ChÆ°Æ¡ng 1',
      programId: 'ketnoi'
    });
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm('Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a bÃ i há»c nÃ y?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setLessons(prev => prev.filter(l => l.lessonId !== lessonId));
      } else {
        const error = await res.json();
        alert(`Lá»—i: ${error.message}`);
      }
    } catch (err) {
      console.error('Lá»—i xÃ³a bÃ i há»c:', err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = isCreating ? 'POST' : 'PUT';
      const url = isCreating ? '/api/admin/lessons' : `/api/admin/lessons/${editingLesson.lessonId}`;
      
      const payload = {
        ...formData,
        theoryModules: [
          {
            type: "markdown",
            content: { text: formData.content }
          }
        ],
        videoModules: formData.videoUrl ? [
          {
            type: "youtube",
            url: formData.videoUrl,
            title: formData.title
          }
        ] : []
      };
      delete payload.content;
      delete payload.videoUrl;

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const savedLesson = await res.json();
        if (isCreating) {
          setLessons(prev => [...prev, savedLesson]);
        } else {
          setLessons(prev => prev.map(l => l.lessonId === savedLesson.lessonId ? savedLesson : l));
        }
        setEditingLesson(null);
        setIsCreating(false);
      } else {
        const error = await res.json();
        alert(`Lá»—i: ${error.message}`);
      }
    } catch (err) {
      console.error('Lá»—i lÆ°u bÃ i há»c:', err);
    }
  };

  return (
    <div className="p-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link to="/admin" className="text-viet-green font-bold text-xs mb-2 block hover:underline">â† Quay láº¡i Báº£ng Ä‘iá»u khiá»ƒn</Link>
            <h1 className="text-3xl font-bold text-viet-text tracking-tight">Quáº£n lÃ½ <span className="text-viet-green">Há»c liá»‡u</span></h1>
            <p className="text-viet-text-light mt-1 font-medium italic">TÃ¹y chá»‰nh ná»™i dung bÃ i há»c, lÃ½ thuyáº¿t vÃ  bÃ i táº­p.</p>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={handleCreateNew}
              className="px-6 py-2.5 bg-viet-green text-white rounded-xl text-xs font-bold shadow-lg shadow-viet-green/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>âž•</span> ThÃªm bÃ i há»c
            </button>
            <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-viet-border shadow-sm">
               {[null, 8, 9, 10, 11, 12].map(g => (
                 <button 
                   key={g} 
                   onClick={() => setSelectedGrade(g)}
                   className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                     selectedGrade === g ? 'bg-viet-green text-white shadow-md' : 'text-viet-text-light hover:bg-gray-50'
                   }`}
                 >
                   {g ? `Lá»›p ${g}` : 'Táº¥t cáº£'}
                 </button>
               ))}
            </div>
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
            {bai_hoc.map((lesson, i) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-[32px] border border-viet-border shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                   <span className="px-2 py-1 bg-viet-green/10 text-viet-green text-[10px] font-black rounded-md uppercase">Lá»šP {lesson.classId}</span>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(lesson.lessonId)}
                        className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-all"
                      >âœŽ</button>
                      <button 
                        onClick={() => handleDelete(lesson.lessonId)}
                        className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-all"
                      >ðŸ—‘</button>
                   </div>
                </div>
                <h3 className="text-lg font-bold text-viet-text mb-2 line-clamp-2">{lesson.title}</h3>
                <p className="text-xs text-viet-text-light line-clamp-2 mb-4 font-medium">{lesson.description}</p>
                <div className="pt-4 border-t border-viet-border flex items-center justify-between">
                   <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-viet-green" />
                      <span className="text-[10px] font-bold text-viet-text-light uppercase tracking-wider">{lesson.chapter || 'Ká»³ 1'}</span>
                   </div>
                   <span className="text-[10px] font-black text-viet-text uppercase opacity-30">ID: {lesson.lessonId}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit/Create Modal */}
        <AnimatePresence>
          {(editingLesson || isCreating) && (
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
                        <h2 className="text-2xl font-bold text-viet-text">{isCreating ? 'ThÃªm bÃ i há»c má»›i' : 'Chá»‰nh sá»­a bÃ i há»c'}</h2>
                        <p className="text-sm text-viet-text-light font-medium">{isCreating ? 'Nháº­p thÃ´ng tin cho há»c liá»‡u má»›i' : editingLesson.title}</p>
                     </div>
                     <button 
                       onClick={() => { setEditingLesson(null); setIsCreating(false); }}
                       className="w-10 h-10 rounded-full bg-white border border-viet-border flex items-center justify-center text-viet-text hover:bg-red-50 hover:text-red-500 transition-all"
                     >âœ•</button>
                  </div>

                  <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <label className="block text-xs font-bold text-viet-text-light uppercase tracking-wider">TiÃªu Ä‘á» bÃ i há»c</label>
                           <input 
                             type="text" 
                             value={formData.title}
                             onChange={(e) => setFormData({...formData, title: e.target.value})}
                             className="w-full h-12 px-6 rounded-2xl border border-viet-border bg-viet-bg/20 focus:bg-white focus:border-viet-green transition-all outline-none font-bold"
                             required
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="block text-xs font-bold text-viet-text-light uppercase tracking-wider">ChÆ°Æ¡ng / Pháº§n</label>
                           <input 
                             type="text" 
                             value={formData.chapter}
                             onChange={(e) => setFormData({...formData, chapter: e.target.value})}
                             className="w-full h-12 px-6 rounded-2xl border border-viet-border bg-viet-bg/20 focus:bg-white focus:border-viet-green transition-all outline-none font-bold"
                             required
                           />
                        </div>
                        <div className="space-y-4">
                           <label className="block text-xs font-bold text-viet-text-light uppercase tracking-wider">Lá»›p</label>
                           <select 
                             value={formData.classId}
                             onChange={(e) => setFormData({...formData, classId: parseInt(e.target.value)})}
                             className="w-full h-12 px-6 rounded-2xl border border-viet-border bg-viet-bg/20 focus:bg-white focus:border-viet-green transition-all outline-none font-bold"
                           >
                              {[8, 9, 10, 11, 12].map(g => (
                                <option key={g} value={g}>Lá»›p {g}</option>
                              ))}
                           </select>
                        </div>
                        <div className="space-y-4">
                           <label className="block text-xs font-bold text-viet-text-light uppercase tracking-wider">Bá»™ sÃ¡ch</label>
                           <select 
                             value={formData.programId}
                             onChange={(e) => setFormData({...formData, programId: e.target.value})}
                             className="w-full h-12 px-6 rounded-2xl border border-viet-border bg-viet-bg/20 focus:bg-white focus:border-viet-green transition-all outline-none font-bold"
                           >
                              <option value="ketnoi">Káº¿t ná»‘i tri thá»©c</option>
                              <option value="canhdieu">CÃ¡nh diá»u</option>
                              <option value="chantroi">ChÃ¢n trá»i sÃ¡ng táº¡o</option>
                           </select>
                        </div>
                        <div className="space-y-4 md:col-span-2">
                           <label className="block text-xs font-bold text-viet-text-light uppercase tracking-wider">Link Video YouTube</label>
                           <input 
                             type="text" 
                             value={formData.videoUrl}
                             onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                             placeholder="https://www.youtube.com/watch?v=..."
                             className="w-full h-12 px-6 rounded-2xl border border-viet-border bg-viet-bg/20 focus:bg-white focus:border-viet-green transition-all outline-none font-bold text-blue-600"
                           />
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="block text-xs font-bold text-viet-text-light uppercase tracking-wider">MÃ´ táº£ bÃ i há»c</label>
                        <textarea 
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="w-full p-6 rounded-2xl border border-viet-border bg-viet-bg/20 focus:bg-white focus:border-viet-green transition-all outline-none font-medium h-32 resize-none"
                        />
                     </div>

                     <div className="space-y-4">
                        <label className="block text-xs font-bold text-viet-text-light uppercase tracking-wider">Ná»™i dung bÃ i há»c (Há»— trá»£ Markdown / LaTex)</label>
                        <textarea 
                          value={formData.content}
                          onChange={(e) => setFormData({...formData, content: e.target.value})}
                          className="w-full p-6 rounded-2xl border border-viet-border bg-viet-bg/20 focus:bg-white focus:border-viet-green transition-all outline-none font-mono text-sm h-96 resize-y"
                          placeholder="Nháº­p ná»™i dung bÃ i há»c..."
                        />
                     </div>

                     <section className="space-y-6 pt-4 border-t border-viet-border">
                        <h3 className="text-sm font-bold text-viet-text uppercase tracking-widest text-viet-green">Táº£i tÃ i liá»‡u lÃªn Cloudinary</h3>
                        <MediaUploader onUploadSuccess={(url) => console.log('New URL:', url)} />
                     </section>
                  </form>

                  <div className="p-8 border-t border-viet-border bg-viet-bg/30 flex justify-end gap-4">
                     <button 
                       type="button"
                       onClick={() => { setEditingLesson(null); setIsCreating(false); }}
                       className="px-8 py-3 rounded-2xl font-bold text-viet-text-light hover:bg-white hover:shadow-sm transition-all"
                     >Há»§y bá»</button>
                     <button 
                        onClick={handleSave}
                        className="px-10 py-3 rounded-2xl bg-viet-green text-white font-bold shadow-lg shadow-viet-green/20 hover:scale-105 transition-all"
                     >{isCreating ? 'Táº¡o bÃ i há»c' : 'LÆ°u thay Ä‘á»•i'}</button>
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


