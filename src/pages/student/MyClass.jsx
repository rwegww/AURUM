import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const MyClass = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  
  const [selectedClass, setSelectedClass] = useState(null);
  const [posts, setPosts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [privateMessage, setPrivateMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/classes', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
        if (data.length > 0) {
          selectClass(data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectClass = async (cls) => {
    setSelectedClass(cls);
    markAsRead(cls.id);
    const token = localStorage.getItem('token');
    
    // Fetch posts
    try {
      const pRes = await fetch(`/api/classes/${cls.id}/posts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (pRes.ok) setPosts(await pRes.json());
    } catch (err) {}

    // Fetch schedules
    try {
      const sRes = await fetch(`/api/classes/${cls.id}/schedules`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (sRes.ok) setSchedules(await sRes.json());
    } catch (err) {}
  };

  const markAsRead = (classId) => {
    const lastReadData = JSON.parse(localStorage.getItem('classroom_last_read') || '{}');
    lastReadData[classId] = new Date().toISOString();
    localStorage.setItem('classroom_last_read', JSON.stringify(lastReadData));
    // Dispatch custom event to notify Navbar
    window.dispatchEvent(new Event('classroom_read'));
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!joinCode) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/classes/join', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: joinCode.trim().toUpperCase() })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi tham gia lớp');
      
      setJoinCode('');
      setError('');
      fetchClasses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompleteAssignment = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/classes/assignments/${postId}/submit`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        // Refresh posts to show updated state (though we'd need to fetch status)
        const currentClass = selectedClass;
        if (currentClass) selectClass(currentClass);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getFileIcon = (url) => {
    if (!url) return '🔗';
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.endsWith('.pdf') || lowerUrl.includes('/pdf')) return '📕';
    if (lowerUrl.includes('doc') || lowerUrl.includes('word') || lowerUrl.includes('docx')) return '📘';
    if (lowerUrl.includes('xls') || lowerUrl.includes('excel') || lowerUrl.includes('xlsx')) return '📗';
    return '🔗';
  };

  const getFileLabel = (url) => {
    if (!url) return 'Xem tài liệu';
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.endsWith('.pdf') || lowerUrl.includes('/pdf')) return 'Mở File PDF';
    if (lowerUrl.includes('docx') || lowerUrl.includes('word') || lowerUrl.endsWith('.doc')) return 'Mở File Word';
    if (lowerUrl.includes('xlsx') || lowerUrl.includes('excel') || lowerUrl.endsWith('.xls')) return 'Mở File Excel';
    return 'Dán đường link';
  };

  const getEmbedUrl = (url) => {
    if (!url) return '';
    let processedUrl = url;

    // Google Drive handling
    if (url.includes('drive.google.com')) {
      processedUrl = url.replace('/view', '/preview').replace('/edit', '/preview');
      return processedUrl;
    }

    // Cloudinary URL cleanup (ensuring extension is present for the viewer)
    if (url.includes('res.cloudinary.com')) {
      const lowerUrl = url.toLowerCase();
      // If extension is missing, add it based on what we detected
      if (!lowerUrl.endsWith('.pdf') && !lowerUrl.endsWith('.docx') && !lowerUrl.endsWith('.doc')) {
        if (lowerUrl.includes('/pdf')) processedUrl += '.pdf';
        else if (lowerUrl.includes('word') || lowerUrl.includes('docx')) processedUrl += '.docx';
        else if (lowerUrl.includes('excel') || lowerUrl.includes('xlsx')) processedUrl += '.xlsx';
      }
    }

    const lowerProcessedUrl = processedUrl.toLowerCase();
    const isPdf = lowerProcessedUrl.endsWith('.pdf');
    const isDoc = lowerProcessedUrl.endsWith('.docx') || lowerProcessedUrl.endsWith('.doc') || 
                  lowerProcessedUrl.endsWith('.xlsx') || lowerProcessedUrl.endsWith('.xls') || 
                  lowerProcessedUrl.endsWith('.pptx') || lowerProcessedUrl.endsWith('.ppt');
    
    // PDFs can usually be displayed directly in iframe
    if (isPdf) return processedUrl;

    if (isDoc && !processedUrl.includes('google.com/viewer')) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(processedUrl)}&embedded=true`;
    }

    return processedUrl;
  };

  const handleSendToTeacher = async (e) => {
    e.preventDefault();
    if (!privateMessage.trim() || !selectedClass) return;
    
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/classes/${selectedClass.id}/posts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'announcement',
          content: privateMessage,
          target_student_id: selectedClass.teacher_id, // Send specifically to the teacher
        })
      });

      if (res.ok) {
        setPrivateMessage('');
        setIsMessageModalOpen(false);
        selectClass(selectedClass); // Refresh feed
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-viet-bg pt-28 pb-20 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin"></div>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="min-h-screen bg-viet-bg pt-28 pb-20 px-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[40px] max-w-md w-full text-center border border-viet-border shadow-xl shadow-black/5"
        >
          <div className="w-20 h-20 bg-viet-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-viet-green">🏫</span>
          </div>
          <h2 className="text-2xl font-black text-viet-text mb-2 uppercase tracking-tight">Chưa có lớp học</h2>
          <p className="text-sm font-medium text-viet-text-light mb-8">
            Bạn chưa tham gia bất kỳ lớp học nào. Vui lòng nhập mã lớp do giáo viên cung cấp để bắt đầu.
          </p>

          <form onSubmit={handleJoinClass} className="space-y-4">
            {error && <div className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl">{error}</div>}
            <input 
              type="text" 
              placeholder="Nhập mã lớp (VD: XYZ1A2)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full h-14 bg-slate-50 border-2 border-transparent focus:border-viet-green focus:bg-white rounded-2xl text-center font-black tracking-[4px] text-lg uppercase outline-none transition-all placeholder:tracking-normal placeholder:font-medium"
            />
            <button 
              type="submit"
              className="w-full h-14 bg-viet-green text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-viet-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Tham gia ngay
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-viet-bg pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lớp Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xs font-black text-viet-text-light uppercase tracking-widest pl-2">Lớp của bạn</h2>
          {classes.map(cls => (
            <button
              key={cls.id}
              onClick={() => selectClass(cls)}
              className={`w-full text-left p-5 rounded-[24px] border transition-all flex flex-col gap-1 ${
                selectedClass?.id === cls.id 
                ? 'bg-viet-green text-white shadow-lg shadow-viet-green/20 border-transparent' 
                : 'bg-white hover:bg-slate-50 border-viet-border hover:shadow-sm'
              }`}
            >
              <h3 className={`text-lg font-black leading-tight ${selectedClass?.id === cls.id ? 'text-white' : 'text-viet-text'}`}>{cls.name}</h3>
              <p className={`text-[11px] font-bold uppercase tracking-wider ${selectedClass?.id === cls.id ? 'text-white/80' : 'text-viet-text-light'}`}>
                GV: {cls.teacher?.username} • Lớp {cls.grade_level}
              </p>
            </button>
          ))}
          
          <div className="pt-4 mt-6 border-t border-viet-border">
            <p className="text-[10px] font-bold text-viet-text-light mb-3 tracking-widest pl-2 uppercase">Tham gia lớp khác</p>
             <form onSubmit={handleJoinClass} className="flex gap-2">
               <input 
                  type="text" 
                  placeholder="Mã lớp"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="flex-1 h-11 bg-white border border-viet-border rounded-xl px-4 text-sm font-bold uppercase outline-none focus:border-viet-green transition-colors"
                />
                <button type="submit" className="h-11 px-4 bg-viet-text text-white rounded-xl font-black text-xs hover:bg-black transition-colors">
                  VÀO
                </button>
             </form>
             {error && <p className="text-[10px] text-red-500 font-bold mt-2 pl-2">{error}</p>}
          </div>
        </div>

        {/* Nội dung chính */}
        {selectedClass && (
          <div className="lg:col-span-6 space-y-6">
            <header className="bg-white p-8 rounded-[32px] border border-viet-border flex flex-col gap-2 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-viet-green/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
               <span className="px-3 py-1 bg-viet-green/10 text-viet-green text-[10px] font-black tracking-widest uppercase rounded-lg w-max">HOẠT ĐỘNG CHUNG</span>
               <h1 className="text-3xl font-black text-viet-text uppercase tracking-tight">{selectedClass.name}</h1>
               <p className="text-sm font-medium text-viet-text-light">{selectedClass.description}</p>
            </header>

            <div className="space-y-6">
              <h2 className="text-sm font-black text-viet-text uppercase tracking-widest">Bảng tin lớp học</h2>
              
              {posts.length === 0 ? (
                <div className="bg-white border text-center border-viet-border border-dashed p-12 rounded-[32px]">
                   <span className="text-4xl block mb-2 opacity-30">📭</span>
                   <p className="text-viet-text-light font-bold text-sm">Chưa có thông báo hoặc bài học nào từ giáo viên.</p>
                </div>
              ) : (
                posts.map((post) => (
                  <motion.div 
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-[24px] border border-viet-border shadow-sm flex flex-col gap-4"
                  >
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-viet-border">
                           <img src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${post.author?.username}`} alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <p className="text-sm font-black text-viet-text">{post.author?.username === user?.username ? "Bạn" : post.author?.username}</p>
                           <p className="text-[10px] font-bold text-viet-text-light uppercase">{new Date(post.created_at).toLocaleString()}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                           {post.target && <span className="px-2 py-1 bg-purple-50 text-purple-600 font-black text-[10px] rounded-lg tracking-widest uppercase flex items-center gap-1">🔒 TIN NHẮN RIÊNG</span>}
                           {post.author_id === user?.id && post.target_student_id && <span className="px-2 py-1 bg-slate-100 text-viet-text-light font-black text-[10px] rounded-lg tracking-widest uppercase">Đã gửi cho GV</span>}
                           {post.type === 'video' && <span className="px-2 py-1 bg-red-50 text-red-500 font-black text-[10px] rounded-lg tracking-widest uppercase">VIDEO</span>}
                           {post.type === 'assignment' && <span className="px-2 py-1 bg-blue-50 text-blue-500 font-black text-[10px] rounded-lg tracking-widest uppercase">BÀI TẬP</span>}
                           {post.type === 'announcement' && !post.target && <span className="px-2 py-1 bg-orange-50 text-orange-500 font-black text-[10px] rounded-lg tracking-widest uppercase">THÔNG BÁO</span>}
                        </div>
                     </div>
                     
                     <div className="text-sm font-medium text-viet-text whitespace-pre-wrap leading-relaxed px-1">
                        {post.content}
                     </div>

                     {post.media_url && post.type === 'video' && (
                        <div className="w-full aspect-video rounded-xl bg-black overflow-hidden mt-2">
                           <iframe 
                             src={post.media_url.replace('watch?v=', 'embed/')} 
                             className="w-full h-full border-0" 
                             allowFullScreen
                           />
                        </div>
                     )}

                     {post.deadline && (
                        <div className="mt-2 py-3 px-4 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between">
                           <span className="text-red-500 text-[11px] font-black uppercase tracking-widest">Hạn nộp bài</span>
                           <span className="text-red-600 font-bold text-sm bg-white px-3 py-1 rounded-lg border border-red-100 shadow-sm">{new Date(post.deadline).toLocaleString()}</span>
                        </div>
                     )}

                     {post.type === 'assignment' && (
                        <div className="mt-2 flex flex-col gap-2">
                          {post.media_url && (
                           <button 
                               onClick={() => {
                                 setViewingAssignment(post);
                                 setIsIframeLoading(true);
                               }}
                               className={`w-full py-3 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                                  post.media_url.toLowerCase().endsWith('.pdf') ? 'bg-red-500 shadow-red-500/20' : 
                                  post.media_url.toLowerCase().includes('doc') ? 'bg-blue-600 shadow-blue-600/20' : 
                                  'bg-slate-700 shadow-slate-700/20'
                               }`}
                             >
                               <span>{getFileIcon(post.media_url)}</span> {getFileLabel(post.media_url)}
                             </button>
                          )}
                          
                          {post.is_completed ? (
                            <div className="w-full py-3 bg-slate-100 text-viet-green font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 border-2 border-viet-green/20">
                              <span>✓</span> Đã hoàn thành bài tập
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleCompleteAssignment(post.id)}
                              className="w-full py-3 bg-viet-green text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-viet-green/20 hover:scale-[1.02] transition-all"
                            >
                              Xác nhận đã hoàn thành bài tập
                            </button>
                          )}
                        </div>
                     )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Lịch học & Khác (Right Sidebar) */}
        {selectedClass && (
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-[32px] border border-viet-border shadow-sm">
               <h3 className="text-xs font-black text-viet-text uppercase tracking-widest mb-4 flex items-center gap-2">
                 <span>📅</span> Lịch học sắp tới
               </h3>
               
               <div className="space-y-3">
                 {schedules.length === 0 ? (
                   <p className="text-xs font-medium text-viet-text-light text-center py-4 bg-slate-50 rounded-xl">Không có lịch học nào</p>
                 ) : (
                   schedules.map(sch => (
                     <div key={sch.id} className="p-3 border border-viet-border rounded-xl hover:border-viet-green transition-colors group">
                       <p className="text-xs font-black text-viet-text mb-1 truncate">{sch.title}</p>
                       <p className="text-[10px] font-bold text-viet-green uppercase bg-viet-green/5 px-2 py-1 rounded-md inline-block mb-2">
                         {new Date(sch.start_time).toLocaleString()}
                       </p>
                       {sch.meet_url && (
                          <a href={sch.meet_url} target="_blank" rel="noreferrer" className="block w-full py-2 bg-viet-text text-white text-[10px] font-black uppercase text-center rounded-lg mt-1 group-hover:bg-viet-green transition-colors">
                            Tham gia Meet
                          </a>
                       )}
                     </div>
                   ))
                 )}
               </div>
            </div>

            <div className="bg-gradient-to-br from-viet-green to-emerald-600 p-6 rounded-[32px] shadow-lg shadow-viet-green/20 relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-white font-black text-lg mb-2">Bạn cần hỗ trợ?</h3>
                  <p className="text-white/80 text-xs font-medium mb-4">Liên hệ riêng với giáo viên qua hệ thống để được giải đáp bài tập.</p>
                  <button 
                    onClick={() => setIsMessageModalOpen(true)}
                    className="w-full bg-white text-viet-green font-black text-xs uppercase tracking-widest py-3 rounded-xl shadow-sm hover:scale-[1.02] transition-all"
                  >
                    Gửi tin nhắn riêng
                  </button>
               </div>
               <div className="absolute right-0 bottom-0 text-7xl opacity-10 translate-x-1/4 translate-y-1/4">💬</div>
            </div>

            {/* Messaging Modal */}
            <AnimatePresence>
               {isMessageModalOpen && (
                 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border border-viet-border"
                    >
                       <div className="p-6 bg-slate-50 border-b border-viet-border flex justify-between items-center">
                          <div>
                             <h3 className="text-lg font-black text-viet-text uppercase tracking-tight">Nhắn tin cho Giáo viên</h3>
                             <p className="text-[10px] font-bold text-viet-green uppercase tracking-widest">Lớp: {selectedClass.name}</p>
                          </div>
                          <button onClick={() => setIsMessageModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-viet-text-light transition-colors">✕</button>
                       </div>
                       <form onSubmit={handleSendToTeacher} className="p-6 space-y-4">
                          <textarea 
                             className="w-full h-32 p-4 bg-slate-50 border border-viet-border rounded-2xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-medium resize-none shadow-inner"
                             placeholder="Nhập nội dung thắc mắc hoặc câu hỏi của bạn..."
                             value={privateMessage}
                             onChange={(e) => setPrivateMessage(e.target.value)}
                             required
                          />
                          <button 
                             disabled={sending}
                             className="w-full py-4 bg-viet-green text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-viet-green/20 flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all disabled:opacity-50"
                          >
                             {sending ? 'Đang gửi...' : 'Gửi tin nhắn ➔'}
                          </button>
                       </form>
                    </motion.div>
                 </div>
               )}
            </AnimatePresence>
        </div>
        )}
      </div>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {viewingAssignment && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full h-full max-w-6xl rounded-none sm:rounded-[40px] overflow-hidden shadow-2xl flex flex-col"
            >
               <div className="p-6 bg-slate-50 border-b border-viet-border flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl">
                        {getFileIcon(viewingAssignment.media_url)}
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-viet-text uppercase tracking-tight">
                           {getFileLabel(viewingAssignment.media_url)}
                        </h3>
                        <p className="text-[10px] font-bold text-viet-text-light uppercase tracking-widest">
                           Của {viewingAssignment.author?.username} • Hạn nộp: {viewingAssignment.deadline ? new Date(viewingAssignment.deadline).toLocaleString() : 'Không có'}
                        </p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <a 
                        href={viewingAssignment.media_url} 
                        download 
                        target="_blank" 
                        rel="noreferrer"
                        className="hidden sm:flex px-6 py-3 bg-white border-2 border-slate-200 text-viet-text font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all items-center gap-2"
                     >
                        <span>📥</span> Tải tệp xuống
                     </a>
                     <button 
                        onClick={() => setViewingAssignment(null)} 
                        className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-viet-text-light hover:text-red-500 hover:border-red-100 transition-all font-black text-xl shadow-sm"
                     >✕</button>
                  </div>
               </div>
               
               <div className="flex-1 bg-slate-200 relative">
                  {isIframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-10 transition-opacity">
                       <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Đang chuẩn bị nội dung...</p>
                    </div>
                  )}

                  <iframe 
                    src={getEmbedUrl(viewingAssignment.media_url)}
                    className="w-full h-full border-0 absolute inset-0"
                    title="Assignment Viewer"
                    onLoad={() => setIsIframeLoading(false)}
                  />
                  
                  {/* Overlay help if blocked or empty */}
                  {!isIframeLoading && (
                    <div className="absolute bottom-6 right-6 z-20">
                       <a 
                         href={viewingAssignment.media_url} 
                         target="_blank" 
                         rel="noreferrer"
                         className="px-6 py-3 bg-white/90 backdrop-blur shadow-xl border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"
                       >
                         <span>🔗</span> Mở trong tab mới nếu lỗi
                       </a>
                    </div>
                  )}
               </div>

               <div className="p-6 bg-white border-t border-viet-border flex gap-4 shrink-0 sm:hidden">
                  <a 
                    href={viewingAssignment.media_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 py-4 bg-viet-text text-white font-black text-[10px] uppercase tracking-widest rounded-xl text-center"
                  >Tải tệp xuống 📥</a>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyClass;
