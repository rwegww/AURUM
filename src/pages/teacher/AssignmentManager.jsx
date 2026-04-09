import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const AssignmentManager = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [classes, setClasses] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingSubmissions, setViewingSubmissions] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [subLoading, setSubLoading] = useState(false);
    
    // Upload & Submit State
    const [uploadMethod, setUploadMethod] = useState('link'); // 'link' or 'file'
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    
    // Filters
    const [filterClass, setFilterClass] = useState('all');
    const [activeTab, setActiveTab] = useState('active'); // active, past

    // Grading State
    const [grading, setGrading] = useState({ studentId: null, score: '', feedback: '' });

    // New Assignment Form State
    const [newAssignment, setNewAssignment] = useState({
        class_id: '',
        lesson_id: '',
        content: '',
        deadline: '',
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [aRes, cRes, lRes] = await Promise.all([
                fetch('/api/classes/assignments/all', { headers: { 'Authorization': `Bearer ${token}` }}),
                fetch('/api/classes', { headers: { 'Authorization': `Bearer ${token}` }}),
                fetch('/api/lessons', { headers: { 'Authorization': `Bearer ${token}` }})
            ]);

            if (aRes.ok) setAssignments(await aRes.json());
            if (cRes.ok) setClasses(await cRes.json());
            if (lRes.ok) setLessons(await lRes.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAssignment = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài tập này?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/classes/assignments/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchInitialData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/media/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setUploadedFile({ name: file.name, url: data.url });
                setNewAssignment({ ...newAssignment, lesson_id: data.url });
            } else {
                alert('Tải tập tin thất bại. Vui lòng thử lại.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/classes/${newAssignment.class_id}/posts`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: 'assignment',
                    content: newAssignment.content,
                    deadline: newAssignment.deadline,
                    media_url: newAssignment.lesson_id // Stores either the pasted link or the uploaded file URL
                })
            });

            if (res.ok) {
                fetchInitialData();
                setIsModalOpen(false);
                setNewAssignment({ class_id: '', lesson_id: '', content: '', deadline: '' });
                setUploadedFile(null);
                setUploadMethod('link');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchSubmissions = async (postId) => {
        setSubLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/classes/assignments/${postId}/submissions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setSubmissions(await res.json());
        } catch (err) {
            console.error(err);
        } finally {
            setSubLoading(false);
        }
    };

    const handleGrade = async (studentId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/classes/assignments/${viewingSubmissions.id}/grade/${studentId}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    score: grading.score,
                    feedback: grading.feedback
                })
            });
            if (res.ok) {
                fetchSubmissions(viewingSubmissions.id);
                setGrading({ studentId: null, score: '', feedback: '' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredAssignments = assignments.filter(a => {
        const matchesClass = filterClass === 'all' || a.class_id === filterClass;
        const isPast = a.deadline && new Date(a.deadline) < new Date();
        const matchesTab = activeTab === 'active' ? !isPast || !a.deadline : isPast;
        return matchesClass && matchesTab;
    });

    if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]">Đang tải...</div>;

    return (
        <div className="p-8 pb-24">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-viet-text tracking-tight mb-2 uppercase">
                           📝 QUẢN LÝ BÀI TẬP
                        </h1>
                        <p className="text-viet-text-light font-bold">Lên lịch học, giao nhiệm vụ và theo dõi tiến độ nộp bài.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-4 bg-viet-green text-white font-black rounded-2xl shadow-xl shadow-viet-green/30 hover:scale-105 transition-all outline-none flex items-center gap-3 uppercase tracking-widest text-sm"
                    >
                        <span className="text-xl">+</span> Giao Bài Tập Mới
                    </button>
                </header>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-2 rounded-3xl border border-viet-border shadow-sm">
                   <div className="flex bg-slate-100 p-1 rounded-2xl">
                      {['active', 'past'].map(tab => (
                         <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-viet-green shadow-sm' : 'text-viet-text-light hover:text-viet-text'}`}
                         >
                            {tab === 'active' ? 'Đang hoạt động' : 'Đã kết thúc'}
                         </button>
                      ))}
                   </div>
                   
                   <div className="flex items-center gap-3 pr-4">
                      <span className="text-[10px] font-black text-viet-text-light uppercase tracking-widest">Lọc theo:</span>
                      <select 
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-viet-green"
                      >
                         <option value="all">Tất cả lớp</option>
                         {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredAssignments.length > 0 ? filteredAssignments.map((assignment) => (
                        <motion.div 
                            key={assignment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[32px] border border-viet-border p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleDeleteAssignment(assignment.id)}
                                    className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    title="Xóa bài tập"
                                >✕</button>
                            </div>

                            <div className="flex justify-between items-start mb-6">
                                <span className="px-4 py-1.5 bg-viet-green/10 text-viet-green text-[10px] font-black uppercase tracking-widest rounded-full">
                                    {assignment.class?.name || 'Lớp học'}
                                </span>
                                <span className="text-[10px] text-viet-text-light font-black uppercase tracking-widest">
                                    {new Date(assignment.created_at).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            
                            <h3 className="font-black text-viet-text text-xl mb-3 line-clamp-2 leading-snug">{assignment.content}</h3>
                            
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-2 text-[11px] text-viet-text-light font-bold">
                                    <span className="w-5">📅</span>
                                    <span>Hạn nộp:</span>
                                    <span className={new Date(assignment.deadline) < new Date() ? 'text-red-500 font-black' : 'text-viet-text'}>
                                        {assignment.deadline ? new Date(assignment.deadline).toLocaleString('vi-VN') : 'Không có'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-viet-text-light font-bold">
                                    <span className="w-5">📄</span>
                                    <span>Tài liệu: </span>
                                    {assignment.media_url ? (
                                        <a href={assignment.media_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline truncate max-w-[150px]">Xem tệp đính kèm</a>
                                    ) : (
                                        <span className="text-slate-400">Không có</span>
                                    )}
                                </div>
                            </div>

                            <button 
                                onClick={() => {
                                    setViewingSubmissions(assignment);
                                    fetchSubmissions(assignment.id);
                                }}
                                className="w-full py-4 bg-viet-text text-white rounded-2xl font-black text-xs uppercase tracking-[2px] hover:bg-viet-green shadow-lg shadow-viet-text/10 hover:shadow-viet-green/20 transition-all border-b-4 border-black/20"
                            >
                                Xem tiến độ nộp bài
                            </button>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                            <span className="text-6xl block mb-4 grayscale opacity-30">📭</span>
                            <p className="text-viet-text-light font-black uppercase tracking-widest text-sm">Chưa có bài tập nào hiển thị.</p>
                        </div>
                    )}
                </div>

                {/* Create Assignment Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setIsModalOpen(false)}
                                className="absolute inset-0 bg-viet-text/60 backdrop-blur-md"
                            />
                            <motion.div 
                                initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-xl p-10 border border-white/20 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-viet-green to-emerald-400"></div>
                                <h2 className="text-3xl font-black text-viet-text mb-8 uppercase tracking-tight">➕ Giao Bài Tập Mới</h2>
                                <form onSubmit={handleCreateAssignment} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Chọn Lớp</label>
                                            <select 
                                                required
                                                value={newAssignment.class_id}
                                                onChange={(e) => setNewAssignment({...newAssignment, class_id: e.target.value})}
                                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-bold"
                                            >
                                                <option value="">-- Lớp học --</option>
                                                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex bg-slate-100 p-1 rounded-xl mb-1">
                                                {['link', 'file'].map(m => (
                                                    <button 
                                                        key={m} type="button"
                                                        onClick={() => {
                                                            setUploadMethod(m);
                                                            if (m === 'link') setUploadedFile(null);
                                                        }}
                                                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${uploadMethod === m ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                                                    >
                                                        {m === 'link' ? '🔗 Dán Link' : '📁 Tải Tệp'}
                                                    </button>
                                                ))}
                                            </div>

                                            {uploadMethod === 'link' ? (
                                                <div className="relative">
                                                     <label className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Link Tài liệu (Word/PDF)</label>
                                                     <input 
                                                         type="url"
                                                         placeholder="Link Google Drive, OneDrive..."
                                                         value={newAssignment.lesson_id}
                                                         onChange={(e) => setNewAssignment({...newAssignment, lesson_id: e.target.value})}
                                                         className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-bold"
                                                     />
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <label className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Tải tệp từ máy tính</label>
                                                    <label className={`w-full h-[52px] flex items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all ${isUploading ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
                                                        <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                                                        {isUploading ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Đang tải lên...</span>
                                                            </div>
                                                        ) : uploadedFile ? (
                                                            <div className="flex items-center gap-2 text-blue-600">
                                                                <span className="text-lg">📄</span>
                                                                <span className="text-xs font-bold truncate max-w-[150px]">{uploadedFile.name}</span>
                                                                <button type="button" onClick={() => setUploadedFile(null)} className="ml-2 text-slate-400 hover:text-red-500">✕</button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                <span className="text-lg">☁️</span>
                                                                <span className="text-xs font-bold uppercase tracking-widest">Chọn tệp Word/PDF</span>
                                                            </div>
                                                        )}
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Nội dung bài tập</label>
                                        <textarea 
                                            required
                                            placeholder="Giao nhiệm vụ cụ thể cho học sinh..."
                                            value={newAssignment.content}
                                            onChange={(e) => setNewAssignment({...newAssignment, content: e.target.value})}
                                            className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-medium min-h-[120px] resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Hạn Nộp Bài</label>
                                        <input 
                                            type="datetime-local"
                                            value={newAssignment.deadline}
                                            onChange={(e) => setNewAssignment({...newAssignment, deadline: e.target.value})}
                                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-bold"
                                        />
                                    </div>
                                    <div className="pt-6 flex gap-4">
                                        <button 
                                            type="button" 
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-5 bg-slate-100 text-viet-text font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={isSubmitting || isUploading}
                                            className={`flex-1 py-5 text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs border-b-4 ${isSubmitting || isUploading ? 'bg-slate-300 border-slate-400 cursor-not-allowed' : 'bg-viet-green border-emerald-700 hover:bg-emerald-600 shadow-viet-green/20'}`}
                                        >
                                            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận giao bài'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Submissions Progress Modal */}
                <AnimatePresence>
                    {viewingSubmissions && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setViewingSubmissions(null)}
                                className="absolute inset-0 bg-viet-text/60 backdrop-blur-md"
                            />
                            <motion.div 
                                initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-4xl p-10 flex flex-col max-h-[90vh] border border-white/20"
                            >
                                <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
                                    <div>
                                        <h2 className="text-3xl font-black text-viet-text mb-1 uppercase tracking-tight">📊 TIẾN ĐỘ NỘP BÀI</h2>
                                        <p className="text-sm font-bold text-viet-green uppercase tracking-widest">{viewingSubmissions.content}</p>
                                    </div>
                                    <button 
                                        onClick={() => setViewingSubmissions(null)} 
                                        className="w-12 h-12 flex items-center justify-center bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
                                    >✕</button>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar lg:grid lg:grid-cols-2 lg:gap-8">
                                    {subLoading ? (
                                        <div className="col-span-full py-20 text-center uppercase font-black text-viet-text-light tracking-widest">Đang tải danh sách...</div>
                                    ) : submissions.map((sub, idx) => (
                                        <div key={idx} className={`p-6 rounded-3xl border-2 mb-4 transition-all ${sub.submitted ? 'border-viet-green/20 bg-emerald-50/30' : 'border-slate-100 bg-white opacity-70'}`}>
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100 overflow-hidden">
                                                        <img src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${sub.student.username}`} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-viet-text uppercase">{sub.student.username}</p>
                                                        <p className={`text-[9px] font-black uppercase tracking-widest ${sub.submitted ? 'text-viet-green' : 'text-red-500'}`}>
                                                            {sub.submitted ? '✓ Đã hoàn thành' : '✗ Chưa nộp bài'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {sub.score && (
                                                    <div className="bg-viet-green text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-viet-green/20">
                                                        {sub.score}
                                                    </div>
                                                )}
                                            </div>

                                            {sub.submitted && !sub.score && grading.studentId !== sub.student.id && (
                                                <button 
                                                    onClick={() => setGrading({...grading, studentId: sub.student.id})}
                                                    className="w-full py-3 bg-white border-2 border-viet-green/30 text-viet-green font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-viet-green hover:text-white transition-all"
                                                >
                                                    Chấm điểm & Phản hồi
                                                </button>
                                            )}

                                            {grading.studentId === sub.student.id && (
                                                <div className="mt-4 p-4 bg-white rounded-2xl border-2 border-viet-green shadow-inner space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <input 
                                                            type="number" min="0" max="10" placeholder="Điểm"
                                                            value={grading.score}
                                                            onChange={(e) => setGrading({...grading, score: e.target.value})}
                                                            className="w-20 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:border-viet-green"
                                                        />
                                                        <input 
                                                            type="text" placeholder="Ghi chú nhận xét..."
                                                            value={grading.feedback}
                                                            onChange={(e) => setGrading({...grading, feedback: e.target.value})}
                                                            className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-viet-green"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => setGrading({...grading, studentId: null})}
                                                            className="flex-1 text-[9px] font-black uppercase tracking-widest text-viet-text-light hover:text-red-500"
                                                        >Hủy</button>
                                                        <button 
                                                            onClick={() => handleGrade(sub.student.id)}
                                                            className="flex-1 py-2 bg-viet-green text-white font-black text-[10px] uppercase tracking-widest rounded-lg"
                                                        >Lưu điểm</button>
                                                    </div>
                                                </div>
                                            )}

                                            {sub.feedback && (
                                                <div className="mt-2 p-3 bg-white/50 rounded-xl border border-slate-100 text-[11px] font-bold text-viet-text-light italic">
                                                    " {sub.feedback} "
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AssignmentManager;
