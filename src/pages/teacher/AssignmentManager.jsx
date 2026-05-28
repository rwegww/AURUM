import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadToCloudinary } from '@/utils/cloudinaryUpload';
import { ClipboardList } from 'lucide-react';

const AssignmentManager = () => {
    const [assignments, setAssignments] = useState([]);
    const [lop, setClasses] = useState([]);
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
    const [parsedQuestions, setParsedQuestions] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showQuestionsReview, setShowQuestionsReview] = useState(false);
    
    // Filters
    const [filterClass, setFilterClass] = useState('all');
    const [activeTab, setActiveTab] = useState('active'); // active, past

    // Grading State
    const [grading, setGrading] = useState({ studentId: null, score: '', phan_hoi: '' });

    // New Assignment Form State
    const [newAssignment, setNewAssignment] = useState({
        lop_id: '',
        bai_hoc_id: '',
        content: '',
        deadline: '',
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [aRes, cRes] = await Promise.all([
                fetch('/api/classes/assignments/all', { headers: { 'Authorization': `Bearer ${token}` }}),
                fetch('/api/classes', { headers: { 'Authorization': `Bearer ${token}` }})
            ]);

            if (aRes.ok) setAssignments(await aRes.json());
            if (cRes.ok) setClasses(await cRes.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAssignment = async (id) => {
        if (!window.confirm('Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a bÃ i táº­p nÃ y?')) return;
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

        try {
            const uploadData = await uploadToCloudinary(file, 'chemistry-odyssey/assignments');
            setUploadedFile({ name: file.name, url: uploadData.url });
            setNewAssignment({ ...newAssignment, bai_hoc_id: uploadData.url });
            
            // Automatically trigger analysis for PDF/Docx/Doc
            if (file.type === 'application/pdf' || 
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                file.type === 'application/msword' ||
                file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
                handleAnalyzeFile(file);
            }
        } catch (err) {
            console.error(err);
            alert('Táº£i táº­p tin tháº¥t báº¡i. Vui lÃ²ng thá»­ láº¡i.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAnalyzeFile = async (file) => {
        console.log('Analyzing file:', file.name, 'Type:', file.type, 'Size:', file.size, 'bytes');
        
        if (file.size < 1000) {
            alert(`File "${file.name}" quÃ¡ nhá» (${file.size} bytes). ÄÃ¢y cÃ³ thá»ƒ khÃ´ng pháº£i file Word há»£p lá»‡.`);
            setParsedQuestions([{ id: 'q1', type: 'multiple_choice', part: 1, content: '', options: {A: '', B: '', C: '', D: ''}, correct_answer: '' }]);
            setShowQuestionsReview(true);
            return;
        }
        
        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/classes/parse-exam-file', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    setParsedQuestions(data);
                    setShowQuestionsReview(true);
                } else {
                    alert('Há»‡ thá»‘ng khÃ´ng tá»± Ä‘á»™ng nháº­n diá»‡n Ä‘Æ°á»£c cÃ¢u há»i tá»« file nÃ y. Báº¡n cÃ³ thá»ƒ nháº­p cÃ¢u há»i thá»§ cÃ´ng bÃªn dÆ°á»›i.');
                    setParsedQuestions([{ id: 'q1', type: 'multiple_choice', part: 1, content: '', options: {A: '', B: '', C: '', D: ''}, correct_answer: '' }]);
                    setShowQuestionsReview(true);
                }
            } else {
                const errorData = await res.json().catch(() => ({ message: 'Lá»—i khÃ´ng xÃ¡c Ä‘á»‹nh tá»« mÃ¡y chá»§' }));
                console.error('Analysis API Error:', errorData);
                const useManual = window.confirm(
                    `${errorData.message || errorData.error || 'MÃ¡y chá»§ gáº·p sá»± cá»‘ khi Ä‘á»c file.'}\n\nBáº¡n cÃ³ muá»‘n nháº­p cÃ¢u há»i thá»§ cÃ´ng khÃ´ng?`
                );
                if (useManual) {
                    setParsedQuestions([{ id: 'q1', type: 'multiple_choice', part: 1, content: '', options: {A: '', B: '', C: '', D: ''}, correct_answer: '' }]);
                    setShowQuestionsReview(true);
                }
            }
        } catch (err) {
            console.error('Analysis failed:', err);
            alert('KhÃ´ng thá»ƒ káº¿t ná»‘i tá»›i mÃ¡y chá»§ Ä‘á»ƒ phÃ¢n tÃ­ch file.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/classes/${newAssignment.lop_id}/posts`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: 'assignment',
                    content: newAssignment.content,
                    deadline: newAssignment.deadline,
                    media_url: newAssignment.bai_hoc_id, // Stores either the pasted link or the uploaded file URL
                    questions: parsedQuestions
                })
            });

            if (res.ok) {
                fetchInitialData();
                setIsModalOpen(false);
                setShowQuestionsReview(false);
                setNewAssignment({ lop_id: '', bai_hoc_id: '', content: '', deadline: '' });
                setUploadedFile(null);
                setParsedQuestions([]);
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
                    phan_hoi: grading.phan_hoi
                })
            });
            if (res.ok) {
                fetchSubmissions(viewingSubmissions.id);
                setGrading({ studentId: null, score: '', phan_hoi: '' });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredAssignments = assignments.filter(a => {
        const matchesClass = filterClass === 'all' || a.lop_id === filterClass;
        const isPast = a.deadline && new Date(a.deadline) < new Date();
        const matchesTab = activeTab === 'active' ? !isPast || !a.deadline : isPast;
        return matchesClass && matchesTab;
    });

    if (loading) return <div className="p-8 flex items-center justify-center min-h-[400px]">Äang táº£i...</div>;

    return (
        <div className="p-8 pb-24">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-black text-viet-text tracking-tight mb-2 uppercase">
                           ðŸ“ QUáº¢N LÃ BÃ€I Táº¬P
                        </h1>
                        <p className="text-viet-text-light font-bold">LÃªn lá»‹ch há»c, giao nhiá»‡m vá»¥ vÃ  theo dÃµi tiáº¿n Ä‘á»™ ná»™p bÃ i.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-4 bg-viet-green text-white font-black rounded-2xl shadow-xl shadow-viet-green/30 hover:scale-105 transition-all outline-none flex items-center gap-3 uppercase tracking-widest text-sm"
                    >
                        <span className="text-xl">+</span> Giao BÃ i Táº­p Má»›i
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
                            {tab === 'active' ? 'Äang hoáº¡t Ä‘á»™ng' : 'ÄÃ£ káº¿t thÃºc'}
                         </button>
                      ))}
                   </div>
                   
                   <div className="flex items-center gap-3 pr-4">
                      <span className="text-[10px] font-black text-viet-text-light uppercase tracking-widest">Lá»c theo:</span>
                      <select 
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-viet-green"
                      >
                         <option value="all">Táº¥t cáº£ lá»›p</option>
                         {lop.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                                    title="XÃ³a bÃ i táº­p"
                                >âœ•</button>
                            </div>

                            <div className="flex justify-between items-start mb-6">
                                <span className="px-4 py-1.5 bg-viet-green/10 text-viet-green text-[10px] font-black uppercase tracking-widest rounded-full">
                                    {assignment.class?.name || 'Lá»›p há»c'}
                                </span>
                                <span className="text-[10px] text-viet-text-light font-black uppercase tracking-widest">
                                    {new Date(assignment.created_at).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                            
                            <h3 className="font-black text-viet-text text-xl mb-3 line-clamp-2 leading-snug">{assignment.content}</h3>
                            
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-2 text-[11px] text-viet-text-light font-bold">
                                    <span className="w-5" aria-hidden="true"></span>
                                    <span>Háº¡n ná»™p:</span>
                                    <span className={new Date(assignment.deadline) < new Date() ? 'text-red-500 font-black' : 'text-viet-text'}>
                                        {assignment.deadline ? new Date(assignment.deadline).toLocaleString('vi-VN') : 'KhÃ´ng cÃ³'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-viet-text-light font-bold">
                                    <span className="w-5">ðŸ“„</span>
                                    <span>TÃ i liá»‡u: </span>
                                    {assignment.media_url ? (
                                        <a href={assignment.media_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline truncate max-w-[150px]">Xem tá»‡p Ä‘Ã­nh kÃ¨m</a>
                                    ) : (
                                        <span className="text-slate-400">KhÃ´ng cÃ³</span>
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
                                Xem tiáº¿n Ä‘á»™ ná»™p bÃ i
                            </button>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                            <span className="text-6xl block mb-4 grayscale opacity-30">ðŸ“­</span>
                            <p className="text-viet-text-light font-black uppercase tracking-widest text-sm">ChÆ°a cÃ³ bÃ i táº­p nÃ o hiá»ƒn thá»‹.</p>
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
                                className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-xl p-10 border border-white/20 max-h-[90vh] overflow-y-auto flex flex-col custom-scrollbar"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-viet-green to-emerald-400"></div>
                                <h2 className="text-3xl font-black text-viet-text mb-8 uppercase tracking-tight">âž• Giao BÃ i Táº­p Má»›i</h2>
                                <form onSubmit={handleCreateAssignment} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Chá»n Lá»›p</label>
                                            <select 
                                                required
                                                value={newAssignment.lop_id}
                                                onChange={(e) => setNewAssignment({...newAssignment, lop_id: e.target.value})}
                                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-bold"
                                            >
                                                <option value="">-- Lá»›p há»c --</option>
                                                {lop.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
                                                        {m === 'link' ? 'ðŸ”— DÃ¡n Link' : 'ðŸ“„ Táº£i file & PhÃ¢n tÃ­ch'}
                                                    </button>
                                                ))}
                                            </div>

                                            {uploadMethod === 'link' ? (
                                                <div className="relative">
                                                     <label className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Link TÃ i liá»‡u (Word/PDF)</label>
                                                     <input 
                                                         type="url"
                                                         placeholder="Link Google Drive, OneDrive..."
                                                         value={newAssignment.bai_hoc_id}
                                                         onChange={(e) => setNewAssignment({...newAssignment, bai_hoc_id: e.target.value})}
                                                         className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-bold"
                                                     />
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <label className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Táº£i tá»‡p tá»« mÃ¡y tÃ­nh</label>
                                                    <label className={`w-full h-[52px] flex items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all ${isUploading ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
                                                        <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                                                        {isUploading ? (
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Äang táº£i lÃªn...</span>
                                                            </div>
                                                        ) : uploadedFile ? (
                                                            <div className="flex items-center gap-2 text-blue-600">
                                                                <span className="text-lg">ðŸ“„</span>
                                                                <span className="text-xs font-bold truncate max-w-[150px]">{uploadedFile.name}</span>
                                                                <button type="button" onClick={() => setUploadedFile(null)} className="ml-2 text-slate-400 hover:text-red-500">âœ•</button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 text-slate-400">
                                                                <span className="text-lg">â˜ï¸</span>
                                                                <span className="text-xs font-bold uppercase tracking-widest text-center">Táº£i file PDF/Word Ä‘á»ƒ há»‡ thá»‘ng tá»± Ä‘á»™ng Ä‘á»c vÃ  táº¡o cÃ¢u há»i</span>
                                                            </div>
                                                        )}
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Ná»™i dung bÃ i táº­p</label>
                                        <textarea 
                                            required
                                            placeholder="Giao nhiá»‡m vá»¥ cá»¥ thá»ƒ cho há»c sinh..."
                                            value={newAssignment.content}
                                            onChange={(e) => setNewAssignment({...newAssignment, content: e.target.value})}
                                            className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-medium min-h-[120px] resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Háº¡n Ná»™p BÃ i</label>
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
                                            Há»§y bá»
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={isSubmitting || isUploading || isAnalyzing}
                                            className={`flex-1 py-5 text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs border-b-4 ${isSubmitting || isUploading || isAnalyzing ? 'bg-slate-300 border-slate-400 cursor-not-allowed' : 'bg-viet-green border-emerald-700 hover:bg-emerald-600 shadow-viet-green/20'}`}
                                        >
                                            {isSubmitting ? 'Äang xá»­ lÃ½...' : isAnalyzing ? 'Äang phÃ¢n tÃ­ch...' : showQuestionsReview ? 'LÆ°u bÃ i táº­p & CÃ¢u há»i' : 'XÃ¡c nháº­n giao bÃ i'}
                                        </button>
                                    </div>
                                    
                                                                        {/* Questions Review Section */}
                                    {showQuestionsReview && (
                                        <div className="mt-8 pt-8 border-t-4 border-viet-green/20 space-y-6">
                                            <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-viet-green/20">
                                                <div>
                                                   <h3 className="text-sm font-black text-viet-text uppercase tracking-widest flex items-center"><ClipboardList className="w-5 h-5 mr-2" /> DANH SÃCH CÃ‚U Há»ŽI ({parsedQuestions.length})</h3>
                                                   <p className="text-[10px] font-bold text-viet-green uppercase mt-1">Format 2025: Tráº¯c nghiá»‡m, ÄÃºng/Sai, Tráº£ lá»i ngáº¯n</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button type="button" onClick={() => setParsedQuestions([...parsedQuestions, { id: 'q'+Date.now(), type: 'multiple_choice', part: 1, content: 'CÃ¢u há»i má»›i', options: {A: '', B: '', C: '', D: ''}, correct_answer: '' }])} className="text-[10px] font-black bg-viet-green text-white uppercase px-3 py-2 rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-viet-green/20">+ ThÃªm cÃ¢u há»i</button>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                {parsedQuestions.map((q, qIdx) => (
                                                    <div key={q.id || qIdx} className="p-5 rounded-2xl border relative group bg-slate-50 border-slate-200">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => setParsedQuestions(parsedQuestions.filter((_, i) => i !== qIdx))}
                                                            className="absolute top-2 right-2 w-6 h-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                                        >âœ•</button>
                                                        
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                                    PHáº¦N {q.part || 1} - CÃ‚U {qIdx + 1}
                                                                </span>
                                                                <select 
                                                                    value={q.type || 'multiple_choice'}
                                                                    onChange={(e) => {
                                                                        const newQ = [...parsedQuestions];
                                                                        newQ[qIdx].type = e.target.value;
                                                                        if (e.target.value === 'multiple_choice') {
                                                                            newQ[qIdx].options = {A:'', B:'', C:'', D:''};
                                                                            newQ[qIdx].correct_answer = '';
                                                                        } else if (e.target.value === 'true_false') {
                                                                            newQ[qIdx].options = {a:'', b:'', c:'', d:''};
                                                                            newQ[qIdx].correct_answer = {a:'', b:'', c:'', d:''};
                                                                        } else {
                                                                            newQ[qIdx].correct_answer = '';
                                                                        }
                                                                        setParsedQuestions(newQ);
                                                                    }}
                                                                    className="text-[9px] font-black uppercase tracking-widest bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none"
                                                                >
                                                                    <option value="multiple_choice">ðŸ”˜ Tráº¯c nghiá»‡m</option>
                                                                    <option value="true_false">â˜‘ï¸ ÄÃºng / Sai</option>
                                                                    <option value="short_answer">ðŸ“ Tráº£ lá»i ngáº¯n</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <textarea 
                                                                    value={q.content}
                                                                    onChange={(e) => {
                                                                        const newQ = [...parsedQuestions];
                                                                        newQ[qIdx].content = e.target.value;
                                                                        setParsedQuestions(newQ);
                                                                    }}
                                                                    placeholder="Nháº­p ná»™i dung cÃ¢u há»i..."
                                                                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-viet-green"
                                                                />
                                                            </div>
                                                            
                                                            {(q.type || 'multiple_choice') === 'multiple_choice' && (
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    {['A', 'B', 'C', 'D'].map((key) => (
                                                                        <div key={key} className="flex flex-col gap-1">
                                                                            <div className="flex items-center justify-between px-1">
                                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{key}.</span>
                                                                                <input 
                                                                                    type="radio" 
                                                                                    name={`q-${qIdx}-correct`} 
                                                                                    checked={q.correct_answer === key}
                                                                                    onChange={() => {
                                                                                        const newQ = [...parsedQuestions];
                                                                                        newQ[qIdx].correct_answer = key;
                                                                                        setParsedQuestions(newQ);
                                                                                    }}
                                                                                    className="w-3 h-3 accent-viet-green cursor-pointer"
                                                                                />
                                                                            </div>
                                                                            <input 
                                                                                value={q.options?.[key] || ''}
                                                                                onChange={(e) => {
                                                                                    const newQ = [...parsedQuestions];
                                                                                    if (!newQ[qIdx].options) newQ[qIdx].options = {};
                                                                                    newQ[qIdx].options[key] = e.target.value;
                                                                                    setParsedQuestions(newQ);
                                                                                }}
                                                                                placeholder={`ÄÃ¡p Ã¡n ${key}`}
                                                                                className={`w-full bg-white border rounded-xl p-2.5 text-[11px] font-medium outline-none transition-all ${q.correct_answer === key ? 'border-viet-green bg-emerald-50/50' : 'border-slate-200 focus:border-viet-green'}`}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {q.type === 'true_false' && (
                                                                <div className="grid grid-cols-1 gap-3">
                                                                    {['a', 'b', 'c', 'd'].map((key) => (
                                                                        <div key={key} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                                                                            <span className="text-[11px] font-black text-slate-400 min-w-[20px]">{key})</span>
                                                                            <input 
                                                                                value={q.options?.[key] || ''}
                                                                                onChange={(e) => {
                                                                                    const newQ = [...parsedQuestions];
                                                                                    if (!newQ[qIdx].options) newQ[qIdx].options = {};
                                                                                    newQ[qIdx].options[key] = e.target.value;
                                                                                    setParsedQuestions(newQ);
                                                                                }}
                                                                                placeholder={`Ã ${key}`}
                                                                                className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-[11px] font-medium outline-none focus:border-viet-green"
                                                                            />
                                                                            <select
                                                                                value={q.correct_answer?.[key] || ''}
                                                                                onChange={(e) => {
                                                                                    const newQ = [...parsedQuestions];
                                                                                    if (!newQ[qIdx].correct_answer || typeof newQ[qIdx].correct_answer !== 'object') {
                                                                                        newQ[qIdx].correct_answer = {a:'', b:'', c:'', d:''};
                                                                                    }
                                                                                    newQ[qIdx].correct_answer[key] = e.target.value;
                                                                                    setParsedQuestions(newQ);
                                                                                }}
                                                                                className="bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold outline-none min-w-[80px]"
                                                                            >
                                                                                <option value="">- Chá»n -</option>
                                                                                <option value="True">ÄÃºng</option>
                                                                                <option value="False">Sai</option>
                                                                            </select>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {q.type === 'short_answer' && (
                                                                <div>
                                                                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1 block">ÄÃ¡p Ã¡n</span>
                                                                    <input 
                                                                        value={q.correct_answer || ''}
                                                                        onChange={(e) => {
                                                                            const newQ = [...parsedQuestions];
                                                                            newQ[qIdx].correct_answer = e.target.value;
                                                                            setParsedQuestions(newQ);
                                                                        }}
                                                                        placeholder="Nháº­p Ä‘Ã¡p Ã¡n (thÆ°á»ng lÃ  sá»‘)..."
                                                                        className="w-full bg-white border border-blue-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-blue-400"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
                                        <h2 className="text-3xl font-black text-viet-text mb-1 uppercase tracking-tight">ðŸ“Š TIáº¾N Äá»˜ Ná»˜P BÃ€I</h2>
                                        <p className="text-sm font-bold text-viet-green uppercase tracking-widest">{viewingSubmissions.content}</p>
                                    </div>
                                    <button 
                                        onClick={() => setViewingSubmissions(null)} 
                                        className="w-12 h-12 flex items-center justify-center bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
                                    >âœ•</button>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar lg:grid lg:grid-cols-2 lg:gap-8">
                                    {subLoading ? (
                                        <div className="col-span-full py-20 text-center uppercase font-black text-viet-text-light tracking-widest">Äang táº£i danh sÃ¡ch...</div>
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
                                                            {sub.submitted ? 'âœ“ ÄÃ£ hoÃ n thÃ nh' : 'âœ— ChÆ°a ná»™p bÃ i'}
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
                                                    Cháº¥m Ä‘iá»ƒm & Pháº£n há»“i
                                                </button>
                                            )}

                                            {grading.studentId === sub.student.id && (
                                                <div className="mt-4 p-5 bg-white rounded-3xl border-2 border-viet-green shadow-xl shadow-viet-green/5 space-y-6">
                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black text-viet-text uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                                                            <ClipboardList className="w-4 h-4" /> Chi tiáº¿t bÃ i lÃ m
                                                        </h4>
                                                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                                            {viewingSubmissions.questions.map((q, qIdx) => {
                                                                const studentAnswer = sub.answers ? sub.answers[qIdx] : null;
                                                                const isMC = (q.type || 'multiple_choice') === 'multiple_choice';
                                                                
                                                                return (
                                                                    <div key={qIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                                                        <div className="flex gap-2">
                                                                            <span className="shrink-0 w-6 h-6 bg-slate-200 text-viet-text rounded-lg flex items-center justify-center text-[10px] font-black">
                                                                                {qIdx + 1}
                                                                            </span>
                                                                            <p className="text-[11px] font-bold text-viet-text leading-tight">{q.question}</p>
                                                                        </div>
                                                                        
                                                                        {isMC ? (
                                                                            <div className="grid grid-cols-2 gap-2 pl-8">
                                                                                {(Array.isArray(q.options) ? q.options : (q.options ? Object.values(q.options) : [])).map((opt, oIdx) => {
                                                                                    const isChosen = studentAnswer === oIdx;
                                                                                    const isCorrect = q.correct_index === oIdx;
                                                                                    let statusClass = 'bg-white border-slate-100 text-slate-400';
                                                                                    if (isChosen && isCorrect) statusClass = 'bg-emerald-500 border-emerald-600 text-white';
                                                                                    else if (isChosen && !isCorrect) statusClass = 'bg-red-500 border-red-600 text-white';
                                                                                    else if (!isChosen && isCorrect) statusClass = 'bg-emerald-100 border-emerald-200 text-emerald-700';
                                                                                    
                                                                                    return (
                                                                                        <div key={oIdx} className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold ${statusClass}`}>
                                                                                            {String.fromCharCode(65 + oIdx)}. {opt}
                                                                                        </div>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="pl-8 space-y-2">
                                                                                <div className="p-3 bg-white border-2 border-blue-100 rounded-xl">
                                                                                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest block mb-1">CÃ¢u tráº£ lá»i cá»§a há»c sinh:</span>
                                                                                    <p className="text-[11px] font-medium text-viet-text italic whitespace-pre-wrap">
                                                                                        {studentAnswer || '(ChÆ°a tráº£ lá»i)'}
                                                                                    </p>
                                                                                </div>
                                                                                {q.sample_answer && (
                                                                                    <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                                                                                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest block mb-1">ÄÃ¡p Ã¡n máº«u tham kháº£o:</span>
                                                                                        <p className="text-[10px] font-medium text-emerald-800 whitespace-pre-wrap">
                                                                                            {q.sample_answer}
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>

                                                    <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                                                        <h4 className="text-[10px] font-black text-viet-text uppercase tracking-widest flex items-center gap-2">
                                                            <span>âœï¸</span> Cháº¥m Ä‘iá»ƒm & Nháº­n xÃ©t
                                                        </h4>
                                                        <div className="flex items-center gap-3">
                                                            <div className="relative">
                                                                <input 
                                                                    type="number" min="0" max="10" step="0.5" placeholder="0"
                                                                    value={grading.score}
                                                                    onChange={(e) => setGrading({...grading, score: e.target.value})}
                                                                    className="w-20 p-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-black text-center outline-none focus:border-viet-green focus:shadow-lg focus:shadow-viet-green/10"
                                                                />
                                                                <span className="absolute -top-2 -right-2 bg-viet-green text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-sm">/10</span>
                                                            </div>
                                                            <input 
                                                                type="text" placeholder="Ghi chÃº nháº­n xÃ©t cho há»c sinh..."
                                                                value={grading.phan_hoi}
                                                                onChange={(e) => setGrading({...grading, phan_hoi: e.target.value})}
                                                                className="flex-1 p-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-viet-green focus:shadow-lg focus:shadow-viet-green/10"
                                                            />
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={() => setGrading({...grading, studentId: null})}
                                                                className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-viet-text-light hover:text-red-500 transition-colors"
                                                            >Há»§y bá»</button>
                                                            <button 
                                                                onClick={() => handleGrade(sub.student.id)}
                                                                className="flex-1 py-3 bg-viet-green text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-viet-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                                            >LÆ°u káº¿t quáº£ âž”</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {sub.teacher_phan_hoi && (
                                                <div className="mt-2 p-3 bg-white/50 rounded-xl border border-slate-100 text-[11px] font-bold text-viet-text-light italic">
                                                    " {sub.teacher_phan_hoi} "
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

