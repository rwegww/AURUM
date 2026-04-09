import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ClassDetail = () => {
  const { id } = useParams();
  const [cls, setCls] = useState(null);
  const [posts, setPosts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newPost, setNewPost] = useState({ content: '', type: 'announcement', media_url: '', deadline: '', target_student_id: '' });
  const [newSchedule, setNewSchedule] = useState({ title: '', start_time: '', meet_url: '' });

  useEffect(() => {
    fetchClassData();
  }, [id]);

  const fetchClassData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get class info. Since we don't have a GET /api/classes/:id endpoint, 
      // we can just fetch all classes and filter, or I should just rely on posts for now.
      const classRes = await fetch('/api/classes', { headers: { 'Authorization': `Bearer ${token}` }});
      if (classRes.ok) {
        const classes = await classRes.json();
        const currentClass = classes.find(c => c.id === id);
        setCls(currentClass);
      }

      // Get posts
      const postsRes = await fetch(`/api/classes/${id}/posts`, { headers: { 'Authorization': `Bearer ${token}` }});
      if (postsRes.ok) setPosts(await postsRes.json());
      
      // Get schedules
      const schedRes = await fetch(`/api/classes/${id}/schedules`, { headers: { 'Authorization': `Bearer ${token}` }});
      if (schedRes.ok) setSchedules(await schedRes.json());

      // Get members
      const membersRes = await fetch(`/api/classes/${id}/members`, { headers: { 'Authorization': `Bearer ${token}` }});
      if (membersRes.ok) setMembers(await membersRes.json());

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/classes/${id}/posts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...newPost, target_student_id: newPost.target_student_id || null })
      });
      if (res.ok) {
        setNewPost({ content: '', type: 'announcement', media_url: '', deadline: '', target_student_id: '' });
        fetchClassData(); // Refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/classes/${id}/schedules`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newSchedule)
      });
      if (res.ok) {
        setNewSchedule({ title: '', start_time: '', meet_url: '' });
        fetchClassData(); // Refresh
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startPrivateMessage = (studentId) => {
    setNewPost(prev => ({ ...prev, target_student_id: studentId, type: 'announcement' }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <div className="p-8 flex justify-center"><div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin"></div></div>;
  }

  if (!cls) {
    return <div className="p-8">Không tìm thấy thông tin lớp học.</div>;
  }

  return (
    <div className="p-8 pb-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <header className="lg:col-span-12 mb-6">
           <Link to="/teacher/classes" className="text-viet-green font-bold text-xs hover:underline mb-2 inline-block">← QUAY LẠI DANH SÁCH LỚP</Link>
           <div className="bg-white p-8 rounded-[32px] border border-viet-border flex items-center justify-between shadow-sm">
              <div>
                 <h1 className="text-3xl font-black text-viet-text uppercase tracking-tight">{cls.name}</h1>
                 <p className="text-viet-text-light font-medium">Khối {cls.grade_level} • Mã tham gia: <strong className="text-viet-green bg-viet-green/10 px-2 py-1 rounded select-all">{cls.code}</strong></p>
              </div>
           </div>
        </header>

        {/* Nội dung chính (Bảng tin) */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white p-6 rounded-[32px] border border-viet-border shadow-sm">
             <h2 className="text-sm font-black text-viet-text uppercase tracking-widest mb-4">Tạo bài đăng mới</h2>
             <form onSubmit={handleCreatePost} className="space-y-4">
                <textarea 
                  value={newPost.content}
                  onChange={e => setNewPost({...newPost, content: e.target.value})}
                  className="w-full h-24 p-4 rounded-xl border border-viet-border bg-slate-50 outline-none focus:border-viet-green focus:bg-white transition-colors text-sm font-medium resize-none"
                  placeholder="Chia sẻ bài giảng, thông báo hoặc bài tập với lớp..."
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                   <select 
                     value={newPost.type}
                     onChange={e => setNewPost({...newPost, type: e.target.value})}
                     className="h-10 px-4 rounded-xl border border-viet-border outline-none text-xs font-bold uppercase tracking-wider text-viet-text"
                   >
                      <option value="announcement">📢 Chung</option>
                      <option value="video">📺 Video bài giảng</option>
                      <option value="assignment">📝 Bài tập</option>
                   </select>
                   <select 
                     value={newPost.target_student_id}
                     onChange={e => setNewPost({...newPost, target_student_id: e.target.value})}
                     className="h-10 px-4 rounded-xl border border-viet-border outline-none text-xs font-bold uppercase tracking-wider text-viet-text"
                   >
                      <option value="">👥 Cả lớp</option>
                      {members.map(m => (
                        <option key={m.student.id} value={m.student.id}>👤 {m.student.username}</option>
                      ))}
                   </select>

                   {newPost.type === 'video' && (
                     <input 
                       type="url" 
                       placeholder="Link YouTube..." 
                       value={newPost.media_url}
                       onChange={e => setNewPost({...newPost, media_url: e.target.value})}
                       className="h-10 px-4 rounded-xl border border-viet-border outline-none text-xs"
                     />
                   )}
                   {newPost.type === 'assignment' && (
                     <input 
                       type="datetime-local" 
                       value={newPost.deadline}
                       onChange={e => setNewPost({...newPost, deadline: e.target.value})}
                       className="h-10 px-4 rounded-xl border border-viet-border outline-none text-xs"
                     />
                   )}
                </div>

                <div className="flex justify-end">
                   <button type="submit" className="px-6 py-2 bg-viet-green text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-viet-green/20">
                     Đăng bài
                   </button>
                </div>
             </form>
           </div>

           <div className="space-y-4">
              <h2 className="text-xs font-black text-viet-text-light uppercase tracking-widest pl-2">Lịch sử bài đăng</h2>
              {posts.map(post => (
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
                          <p className="text-sm font-black text-viet-text">{post.author?.username || 'Giáo viên'}</p>
                          <p className="text-[10px] font-bold text-viet-text-light uppercase">{new Date(post.created_at).toLocaleString()}</p>
                       </div>
                      <div className="ml-auto flex items-center gap-2">
                         {post.target && <span className="px-2 py-1 bg-purple-50 text-purple-600 font-black text-[10px] rounded-lg tracking-widest uppercase">Gửi riêng: {post.target.username}</span>}
                         {post.type === 'video' && <span className="px-2 py-1 bg-red-50 text-red-500 font-black text-[10px] rounded-lg tracking-widest uppercase">VIDEO</span>}
                         {post.type === 'assignment' && <span className="px-2 py-1 bg-blue-50 text-blue-500 font-black text-[10px] rounded-lg tracking-widest uppercase">BÀI TẬP</span>}
                         {post.type === 'announcement' && <span className="px-2 py-1 bg-orange-50 text-orange-500 font-black text-[10px] rounded-lg tracking-widest uppercase">TIN NHẮN</span>}
                      </div>
                   </div>
                   
                   <div className="text-sm font-medium text-viet-text whitespace-pre-wrap leading-relaxed">
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
                      <div className="mt-2 py-2 px-4 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between">
                         <span className="text-red-500 text-[11px] font-black uppercase tracking-widest">Hạn nộp</span>
                         <span className="text-red-600 font-bold text-sm bg-white px-2 py-1 rounded border border-red-100">{new Date(post.deadline).toLocaleString()}</span>
                      </div>
                   )}
                </motion.div>
              ))}
           </div>
        </div>

        {/* Sidebar Quản lý */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-white p-6 rounded-[32px] border border-viet-border shadow-sm">
             <h3 className="text-sm font-black text-viet-text uppercase tracking-widest mb-4">Lên lịch học</h3>
             <form onSubmit={handleCreateSchedule} className="space-y-3 mb-6">
                <input 
                  type="text" 
                  placeholder="Tiêu đề buổi học..." 
                  value={newSchedule.title}
                  onChange={e => setNewSchedule({...newSchedule, title: e.target.value})}
                  className="w-full h-10 px-4 rounded-xl border border-viet-border outline-none text-xs"
                  required
                />
                <input 
                  type="datetime-local" 
                  value={newSchedule.start_time}
                  onChange={e => setNewSchedule({...newSchedule, start_time: e.target.value})}
                  className="w-full h-10 px-4 rounded-xl border border-viet-border outline-none text-xs"
                  required
                />
                <input 
                  type="url" 
                  placeholder="Link Google Meet / Zoom..." 
                  value={newSchedule.meet_url}
                  onChange={e => setNewSchedule({...newSchedule, meet_url: e.target.value})}
                  className="w-full h-10 px-4 rounded-xl border border-viet-border outline-none text-xs"
                />
                <button type="submit" className="w-full py-2 bg-viet-text text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-black transition-colors">
                  Tạo lịch
                </button>
             </form>

             <div className="space-y-3 border-t border-viet-border pt-4">
                <h4 className="text-xs font-black text-viet-text-light uppercase tracking-widest">Lịch học sắp tới</h4>
                {schedules.map(sch => (
                  <div key={sch.id} className="p-3 border border-viet-border rounded-xl">
                    <p className="text-xs font-black text-viet-text min-w-0 truncate">{sch.title}</p>
                    <p className="text-[10px] font-bold text-viet-green mt-1">{new Date(sch.start_time).toLocaleString()}</p>
                  </div>
                ))}
             </div>
           </div>

           <div className="bg-white p-6 rounded-[32px] border border-viet-border shadow-sm">
             <h3 className="text-sm font-black text-viet-text uppercase tracking-widest mb-4">Danh sách học viên ({members.length})</h3>
             <div className="space-y-3">
                {members.length === 0 ? (
                  <p className="text-xs text-viet-text-light font-medium italic">Chưa có học sinh tham gia</p>
                ) : (
                  members.map(m => (
                    <div key={m.student.id} className="flex items-center justify-between p-3 bg-slate-50 border border-viet-border rounded-2xl group/member transition-all hover:bg-white hover:shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-viet-green text-white rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                           {m.student.username.substring(0,2)}
                        </div>
                        <span className="text-xs font-bold text-viet-text">{m.student.username}</span>
                      </div>
                      <button 
                        onClick={() => startPrivateMessage(m.student.id)}
                        className="w-8 h-8 rounded-lg bg-white border border-viet-border flex items-center justify-center text-xs opacity-0 group-hover/member:opacity-100 transition-all hover:bg-viet-green hover:text-white hover:border-viet-green shadow-sm"
                        title="Nhắn tin riêng"
                      >
                        💬
                      </button>
                    </div>
                  ))
                )}
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ClassDetail;
