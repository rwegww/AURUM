import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const DiscussionBoard = ({ lessonId }) => {
  const { user, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'qna'
  const [comments, setComments] = useState([]);
  const [noteContent, setNoteContent] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [expandedComments, setExpandedComments] = useState([]);

  const toggleReplies = (id) => {
    if (expandedComments.includes(id)) {
      setExpandedComments(expandedComments.filter(cid => cid !== id));
    } else {
      setExpandedComments([...expandedComments, id]);
    }
  };

  useEffect(() => {
    if (lessonId) {
      if (activeTab === 'qna') fetchComments();
      if (activeTab === 'notes' && isLoggedIn) fetchNote();
    }
  }, [lessonId, activeTab, isLoggedIn]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/discussions/${lessonId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setComments(data);
      } else {
        setComments([]);
        console.error('Dữ liệu bình luận không hợp lệ:', data);
      }
    } catch (err) {
      console.error('Lỗi tải bình luận:', err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNote = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/discussions/notes/${lessonId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setNoteContent(data.content || '');
    } catch (err) {
      console.error('Lỗi tải ghi chú:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    if (!isLoggedIn) return;
    setSavingNote(true);
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/discussions/notes`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ lessonId, content: noteContent })
      });
    } catch (err) {
      console.error('Lỗi lưu ghi chú:', err);
    } finally {
      setSavingNote(false);
    }
  };

  const postComment = async () => {
    if (!isLoggedIn || !inputValue.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/discussions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          lessonId, 
          content: inputValue, 
          parentId: replyTo?.id || null 
        })
      });
      if (res.ok) {
        setInputValue('');
        setReplyTo(null);
        fetchComments();
      }
    } catch (err) {
      console.error('Lỗi gửi bình luận:', err);
    }
  };

  const likeComment = async (id) => {
    if (!isLoggedIn) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/discussions/${id}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchComments();
    } catch (err) {
      console.error('Lỗi thích bình luận:', err);
    }
  };

  return (
    <div className="viet-card border-none shadow-none bg-transparent">
      {/* Tabs Header */}
      <div className="flex bg-[#76c034] p-1.5 rounded-[20px] mb-6">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[15px] transition-all text-[14px] font-bold ${
            activeTab === 'notes' ? 'bg-[#98d65a]/30 text-white border border-[#ffffff]/20 shadow-inner' : 'text-white/70 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Ghi chú
        </button>
        <button
          onClick={() => setActiveTab('qna')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[15px] transition-all text-[14px] font-bold ${
            activeTab === 'qna' ? 'bg-white text-[#76c034] shadow-lg' : 'text-white/70 hover:text-white'
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
          Hỏi đáp
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'notes' ? (
          <motion.div 
            key="notes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="viet-card p-6 border-[#fff9ec] bg-[#fdfcfb] relative">
              {loading && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-[32px]">Đang tải...</div>}
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Ghi lại các kiến thức quan trọng của bạn ở đây..."
                className="w-full h-40 bg-transparent border-none outline-none text-[15px] text-viet-text placeholder:text-[#b4bac2] resize-none leading-relaxed italic"
              />
              <div className="flex justify-end mt-4">
                <button 
                  onClick={saveNote}
                  disabled={savingNote || !isLoggedIn}
                  className="px-6 py-2.5 bg-viet-green text-white rounded-xl text-[13px] font-bold shadow-lg shadow-viet-green/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {savingNote ? 'Đang lưu...' : 'Lưu ghi chú'}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="qna"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Input Area */}
            <div className="viet-card p-4 border-[#fff9ec] bg-[#fdfcfb] mb-6">
              {replyTo && (
                <div className="flex items-center justify-between px-4 py-2 bg-viet-green/5 rounded-t-xl mb-2 border-l-2 border-viet-green">
                  <span className="text-[11px] font-bold text-viet-green">Đang trả lời {replyTo.user?.username}:</span>
                  <button onClick={() => setReplyTo(null)} className="text-[11px] font-bold text-red-500">Hủy</button>
                </div>
              )}
              <div className="flex bg-[#fffbf0] border border-[#f0ede4] rounded-full px-5 py-3 items-center gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && postComment()}
                  placeholder={isLoggedIn ? "Nhập bình luận ..." : "Đăng nhập để bình luận"}
                  disabled={!isLoggedIn}
                  className="flex-1 bg-transparent border-none outline-none text-[14px] text-viet-text placeholder:text-[#b4bac2]"
                />
                <div className="flex items-center gap-2">
                  <button 
                    onClick={postComment}
                    disabled={!isLoggedIn || !inputValue.trim()}
                    className="w-8 h-8 rounded-full bg-[#76c034] flex items-center justify-center text-white shadow-sm shadow-viet-green/20 hover:scale-110 active:scale-90 transition-all disabled:opacity-30"
                  >
                    <svg className="w-4 h-4 translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2 px-2">
                 <span className="text-[12px] font-bold text-viet-text-light uppercase tracking-widest">
                   {comments.length} Bình luận
                 </span>
              </div>
              
              {comments.filter(c => !c.parent_id).map(comment => (
                <div key={comment.id} className="space-y-3">
                  <div className="viet-card p-5 border-[#faefd4] bg-[#fffbf0]/50 relative overflow-visible">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-[#f8f9fa] border border-viet-border overflow-hidden shrink-0 shadow-sm">
                         <img src={`https://ui-avatars.com/api/?name=${comment.user?.username || 'User'}&background=random`} alt="User" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[14px] font-bold text-viet-text">{comment.user?.username || 'Người dùng'}</h4>
                          <span className="text-[11px] text-viet-text-light font-medium">• {new Date(comment.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <p className="text-[11px] text-viet-text-light font-medium mb-3 opacity-60">
                          {comment.user?.role === 'student' ? 'Học sinh' : comment.user?.role === 'teacher' ? 'Giáo viên' : 'Thành viên'}
                        </p>
                        
                        <div className="bg-white border border-[#f0ede4] rounded-2xl p-4 text-[14px] text-viet-text mb-3 shadow-sm leading-relaxed">
                           {comment.content}
                        </div>

                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => likeComment(comment.id)}
                            className={`flex items-center gap-1 text-[11px] font-bold transition-all ${comment.likes > 0 ? 'text-[#f9b800]' : 'text-viet-text-light hover:text-[#f9b800]'}`}
                          >
                            <svg className="w-3.5 h-3.5" fill={comment.likes > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{comment.likes || 0}</span>
                          </button>
                          <div className="flex items-center gap-4">
                             <button 
                               onClick={() => setReplyTo(comment)}
                               className="flex items-center gap-1 text-[11px] font-bold text-viet-text-light hover:text-viet-green transition-colors"
                             >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                                Trả lời
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Reply indicator */}
                    {comments.filter(r => r.parent_id === comment.id).length > 0 && (
                      <div className="absolute -bottom-3 left-8">
                        <button 
                          onClick={() => toggleReplies(comment.id)}
                          className="bg-white border border-[#f0ede4] rounded-full px-3 py-1 flex items-center gap-1 shadow-sm text-[10px] font-bold text-viet-green hover:scale-105 active:scale-95 transition-all"
                        >
                           <svg className={`w-3 h-3 transition-transform ${expandedComments.includes(comment.id) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path d="M19 9l-7 7-7-7" />
                           </svg>
                           {comments.filter(r => r.parent_id === comment.id).length} phản hồi
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Replies */}
                  {expandedComments.includes(comment.id) && comments.filter(r => r.parent_id === comment.id).map(reply => (
                    <motion.div 
                      key={reply.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-12 viet-card p-4 border-[#faefd4]/50 bg-white/40 flex gap-3"
                    >
                       <div className="w-8 h-8 rounded-xl bg-[#f8f9fa] border border-viet-border overflow-hidden shrink-0 shadow-sm">
                          <img src={`https://ui-avatars.com/api/?name=${reply.user?.username || 'User'}&background=random`} alt="User" />
                       </div>
                       <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[13px] font-bold text-viet-text">{reply.user?.username}</h4>
                            <span className="text-[10px] text-viet-text-light font-medium">• {new Date(reply.created_at).toLocaleDateString('vi-VN')}</span>
                          </div>
                          <p className="text-[13px] text-viet-text-light">{reply.content}</p>
                       </div>
                    </motion.div>
                  ))}
                </div>
              ))}

              {comments.length === 0 && !loading && (
                <div className="text-center py-12 text-viet-text-light/40 italic text-[14px]">
                  Chưa có bình luận nào. Hãy là người đầu tiên đặt câu hỏi!
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiscussionBoard;
