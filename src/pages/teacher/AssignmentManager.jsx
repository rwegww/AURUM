import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadToCloudinary } from '@/utils/cloudinaryUpload';
import {
    BarChart3,
    CheckCircle2,
    ClipboardList,
    CloudUpload,
    FileText,
    Inbox,
    Loader2,
    PenLine,
    Plus,
    Trash2,
    X,
} from 'lucide-react';
import { parseAdminMutationResponse } from '@/utils/adminApproval';
import {
    ASSIGNMENT_FILE_ACCEPT,
    assignmentMatchesClass,
    buildAssignmentPayload,
    formatAnswer,
    formatDate,
    getCorrectOptionIndex,
    getErrorMessage,
    getQuestionOptions,
    isAssignmentPast,
    isValidHttpUrl,
    normalizeExamQuestions,
    validateAssignmentDraft,
    validateAssignmentFile,
    validateGrade,
    MAX_ASSIGNMENT_QUESTIONS,
} from '@/utils/teacherAssignmentUtils';

const EMPTY_ASSIGNMENT = {
    lop_id: '',
    bai_hoc_id: '',
    content: '',
    deadline: '',
};

const EMPTY_GRADING = { studentId: null, score: '', phan_hoi: '' };

const createEmptyQuestion = () => normalizeExamQuestions([{
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `q-${Date.now()}`,
    type: 'multiple_choice',
    part: 1,
    content: '',
    options: { A: '', B: '', C: '', D: '' },
    correct_answer: '',
}])[0];

const AssignmentManager = () => {
    const [assignments, setAssignments] = useState([]);
    const [lop, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [actionError, setActionError] = useState('');
    const [actionNotice, setActionNotice] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingSubmissions, setViewingSubmissions] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [subLoading, setSubLoading] = useState(false);
    const [subError, setSubError] = useState('');
    
    // Upload & Submit State
    const [uploadMethod, setUploadMethod] = useState('link'); // 'link' or 'file'
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [parsedQuestions, setParsedQuestions] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showQuestionsReview, setShowQuestionsReview] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [deletingId, setDeletingId] = useState(null);
    
    // Filters
    const [filterClass, setFilterClass] = useState('all');
    const [activeTab, setActiveTab] = useState('active'); // active, past

    // Grading State
    const [grading, setGrading] = useState(EMPTY_GRADING);
    const [gradingErrors, setGradingErrors] = useState({});
    const [gradingStudentId, setGradingStudentId] = useState(null);

    // New Assignment Form State
    const [newAssignment, setNewAssignment] = useState(EMPTY_ASSIGNMENT);

    const initialRequestRef = React.useRef({ id: 0, controller: null });
    const submissionsRequestRef = React.useRef({ id: 0, controller: null });
    const uploadRequestRef = React.useRef({ id: 0, controller: null });
    const analysisRequestRef = React.useRef({ id: 0, controller: null });
    const createRequestRef = React.useRef(null);

    const fetchInitialData = useCallback(async ({ showLoader = true } = {}) => {
        initialRequestRef.current.controller?.abort();
        const controller = new AbortController();
        const requestId = initialRequestRef.current.id + 1;
        initialRequestRef.current = { id: requestId, controller };
        if (showLoader) setLoading(true);
        setLoadError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
            const [aRes, cRes] = await Promise.all([
                fetch('/api/classes/assignments/all', {
                    headers: { 'Authorization': `Bearer ${token}` },
                    signal: controller.signal,
                }),
                fetch('/api/classes', {
                    headers: { 'Authorization': `Bearer ${token}` },
                    signal: controller.signal,
                })
            ]);

            const [assignmentData, classData] = await Promise.all([
                aRes.json().catch(() => ({})),
                cRes.json().catch(() => ({})),
            ]);
            if (!aRes.ok) throw new Error(getErrorMessage(assignmentData, 'Không thể tải danh sách bài tập.'));
            if (!cRes.ok) throw new Error(getErrorMessage(classData, 'Không thể tải danh sách lớp học.'));
            if (initialRequestRef.current.id !== requestId) return;
            setAssignments(Array.isArray(assignmentData) ? assignmentData : []);
            setClasses(Array.isArray(classData) ? classData : []);
        } catch (err) {
            if (err.name !== 'AbortError' && initialRequestRef.current.id === requestId) {
                console.error(err);
                setLoadError(err.message || 'Không thể tải dữ liệu bài tập.');
            }
        } finally {
            if (initialRequestRef.current.id === requestId) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInitialData();
        return () => {
            initialRequestRef.current.controller?.abort();
            submissionsRequestRef.current.controller?.abort();
            uploadRequestRef.current.controller?.abort();
            analysisRequestRef.current.controller?.abort();
            createRequestRef.current?.abort();
        };
    }, [fetchInitialData]);

    const handleDeleteAssignment = async (id) => {
        if (deletingId !== null) return;
        if (!window.confirm('Bạn có chắc chắn muốn xóa bài tập này?')) return;
        setDeletingId(id);
        setActionError('');
        setActionNotice('');
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
            const res = await fetch(`/api/classes/assignments/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await parseAdminMutationResponse(res);
            setActionNotice(result.message || 'Đã gửi yêu cầu xóa bài tập.');
            if (!result.pendingApproval) {
                setAssignments((current) => current.filter((assignment) => assignment.id !== id));
                await fetchInitialData({ showLoader: false });
            }
        } catch (err) {
            console.error(err);
            setActionError(err.message || 'Không thể xóa bài tập.');
        } finally {
            setDeletingId(null);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fileError = validateAssignmentFile(file);
        if (fileError) {
            setFormErrors((current) => ({ ...current, media: fileError }));
            e.target.value = '';
            return;
        }

        uploadRequestRef.current.controller?.abort();
        analysisRequestRef.current.controller?.abort();
        const controller = new AbortController();
        const requestId = uploadRequestRef.current.id + 1;
        uploadRequestRef.current = { id: requestId, controller };

        setIsUploading(true);
        setUploadedFile(null);
        setParsedQuestions([]);
        setShowQuestionsReview(false);
        setFormErrors((current) => ({ ...current, media: undefined, questions: undefined }));

        try {
            const uploadData = await uploadToCloudinary(file, 'chemistry-odyssey/assignments', {
                signal: controller.signal,
            });
            if (uploadRequestRef.current.id !== requestId) return;
            setUploadedFile({ name: file.name, url: uploadData.url });
            setNewAssignment((current) => ({ ...current, bai_hoc_id: uploadData.url }));
            setIsUploading(false);
            await handleAnalyzeFile(file);
        } catch (err) {
            if (err.name !== 'AbortError' && uploadRequestRef.current.id === requestId) {
                console.error(err);
                setFormErrors((current) => ({
                    ...current,
                    media: err.message || 'Tải tập tin thất bại. Vui lòng thử lại.',
                }));
            }
        } finally {
            if (uploadRequestRef.current.id === requestId) setIsUploading(false);
        }
    };

    const handleAnalyzeFile = async (file) => {
        analysisRequestRef.current.controller?.abort();
        const controller = new AbortController();
        const requestId = analysisRequestRef.current.id + 1;
        analysisRequestRef.current = { id: requestId, controller };
        if (file.size < 1000) {
            setFormErrors((current) => ({
                ...current,
                questions: `Tệp "${file.name}" quá nhỏ (${file.size} byte). Hệ thống đã chuyển sang chế độ nhập câu hỏi thủ công.`,
            }));
            setParsedQuestions([createEmptyQuestion()]);
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
                body: formData,
                signal: controller.signal,
            });

            if (res.ok) {
                const data = await res.json();
                if (analysisRequestRef.current.id !== requestId) return;
                const normalizedQuestions = normalizeExamQuestions(data);
                if (normalizedQuestions.length > 0) {
                    setParsedQuestions(normalizedQuestions);
                    setShowQuestionsReview(true);
                } else {
                    setFormErrors((current) => ({
                        ...current,
                        questions: 'Không tự động nhận diện được câu hỏi. Hệ thống đã chuyển sang chế độ nhập thủ công.',
                    }));
                    setParsedQuestions([createEmptyQuestion()]);
                    setShowQuestionsReview(true);
                }
            } else {
                const errorData = await res.json().catch(() => ({ message: 'Lỗi không xác định từ máy chủ' }));
                console.error('Analysis API Error:', errorData);
                setFormErrors((current) => ({
                    ...current,
                    questions: `${errorData.message || errorData.error || 'Máy chủ gặp sự cố khi đọc file.'} Hệ thống đã chuyển sang chế độ nhập thủ công.`,
                }));
                setParsedQuestions([createEmptyQuestion()]);
                setShowQuestionsReview(true);
            }
        } catch (err) {
            if (err.name !== 'AbortError' && analysisRequestRef.current.id === requestId) {
                console.error('Analysis failed:', err);
                setFormErrors((current) => ({
                    ...current,
                    questions: 'Không thể phân tích tệp. Bạn vẫn có thể giao tệp hoặc thêm câu hỏi thủ công.',
                }));
            }
        } finally {
            if (analysisRequestRef.current.id === requestId) setIsAnalyzing(false);
        }
    };

    const resetAssignmentForm = () => {
        setNewAssignment(EMPTY_ASSIGNMENT);
        setUploadedFile(null);
        setParsedQuestions([]);
        setShowQuestionsReview(false);
        setUploadMethod('link');
        setFormErrors({});
    };

    const closeCreateModal = () => {
        if (isSubmitting) return;
        uploadRequestRef.current.controller?.abort();
        analysisRequestRef.current.controller?.abort();
        setIsUploading(false);
        setIsAnalyzing(false);
        setIsModalOpen(false);
        resetAssignmentForm();
    };

    const clearAttachment = () => {
        uploadRequestRef.current.controller?.abort();
        analysisRequestRef.current.controller?.abort();
        setIsUploading(false);
        setIsAnalyzing(false);
        setUploadedFile(null);
        setParsedQuestions([]);
        setShowQuestionsReview(false);
        setNewAssignment((current) => ({ ...current, bai_hoc_id: '' }));
        setFormErrors((current) => ({ ...current, media: undefined, questions: undefined }));
    };

    const handleUploadMethodChange = (method) => {
        if (method === uploadMethod) return;
        clearAttachment();
        setUploadMethod(method);
    };

    const updateQuestion = (questionIndex, updater) => {
        setParsedQuestions((current) => current.map((question, index) => (
            index === questionIndex ? updater(question) : question
        )));
        setFormErrors((current) => ({ ...current, questions: undefined, submit: undefined }));
    };

    const handleCreateAssignment = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const nextErrors = validateAssignmentDraft(
            { ...newAssignment, questions: parsedQuestions },
            { uploadMethod, uploadedFile },
        );
        setFormErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        const controller = new AbortController();
        createRequestRef.current = controller;
        setIsSubmitting(true);
        setActionError('');
        setActionNotice('');
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
            const res = await fetch(`/api/classes/${newAssignment.lop_id}/posts`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(buildAssignmentPayload(newAssignment, parsedQuestions)),
                signal: controller.signal,
            });

            const result = await parseAdminMutationResponse(res);
            setActionNotice(result.message || 'Đã gửi bài tập.');
            if (!result.pendingApproval) await fetchInitialData({ showLoader: false });
            setIsModalOpen(false);
            resetAssignmentForm();
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error(err);
                setFormErrors((current) => ({
                    ...current,
                    submit: err.message || 'Không thể tạo bài tập lúc này.',
                }));
            }
        } finally {
            setIsSubmitting(false);
            createRequestRef.current = null;
        }
    };

    const fetchSubmissions = async (postId) => {
        submissionsRequestRef.current.controller?.abort();
        const controller = new AbortController();
        const requestId = submissionsRequestRef.current.id + 1;
        submissionsRequestRef.current = { id: requestId, controller };
        setSubLoading(true);
        setSubError('');
        setSubmissions([]);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
            const res = await fetch(`/api/classes/assignments/${postId}/submissions`, {
                headers: { 'Authorization': `Bearer ${token}` },
                signal: controller.signal,
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(getErrorMessage(data, 'Không thể tải tiến độ nộp bài.'));
            if (submissionsRequestRef.current.id === requestId) {
                setSubmissions(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            if (err.name !== 'AbortError' && submissionsRequestRef.current.id === requestId) {
                console.error(err);
                setSubError(err.message || 'Không thể tải tiến độ nộp bài.');
            }
        } finally {
            if (submissionsRequestRef.current.id === requestId) setSubLoading(false);
        }
    };

    const openSubmissions = (assignment) => {
        setViewingSubmissions(assignment);
        setGrading(EMPTY_GRADING);
        setGradingErrors({});
        fetchSubmissions(assignment.id);
    };

    const closeSubmissions = () => {
        submissionsRequestRef.current.controller?.abort();
        setViewingSubmissions(null);
        setSubmissions([]);
        setSubError('');
        setGrading(EMPTY_GRADING);
        setGradingErrors({});
    };

    const startGrading = (submission) => {
        setGrading({
            studentId: submission.student?.id,
            score: submission.score ?? '',
            phan_hoi: submission.teacher_feedback ?? '',
        });
        setGradingErrors({});
    };

    const handleGrade = async (studentId) => {
        if (!viewingSubmissions || gradingStudentId !== null) return;
        const nextErrors = validateGrade(grading.score, grading.phan_hoi);
        setGradingErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        const postId = viewingSubmissions.id;
        setGradingStudentId(studentId);
        setActionError('');
        setActionNotice('');
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
            const res = await fetch(`/api/classes/assignments/${postId}/grade/${studentId}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    score: Number(grading.score),
                    phan_hoi: grading.phan_hoi.trim()
                })
            });
            const result = await parseAdminMutationResponse(res);
            setActionNotice(result.message || 'Đã lưu kết quả chấm điểm.');
            if (!result.pendingApproval) await fetchSubmissions(postId);
            setGrading(EMPTY_GRADING);
            setGradingErrors({});
        } catch (err) {
            console.error(err);
            setGradingErrors({ submit: err.message || 'Không thể lưu kết quả chấm điểm.' });
        } finally {
            setGradingStudentId(null);
        }
    };

    const filteredAssignments = assignments.filter(a => {
        const matchesClass = assignmentMatchesClass(a, filterClass);
        const isPast = isAssignmentPast(a);
        const matchesTab = activeTab === 'active' ? !isPast : isPast;
        return matchesClass && matchesTab;
    });

    if (loading) return (
        <div className="p-8 flex items-center justify-center gap-3 min-h-[400px]" role="status" aria-live="polite">
            <Loader2 className="w-5 h-5 animate-spin text-viet-green" aria-hidden="true" />
            Đang tải dữ liệu bài tập...
        </div>
    );

    return (
        <div className="p-4 sm:p-8 pb-24">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-viet-text tracking-tight mb-2 uppercase flex items-center gap-3">
                           <ClipboardList className="w-8 h-8 text-viet-green" aria-hidden="true" /> Quản lý bài tập
                        </h1>
                        <p className="text-viet-text-light font-bold">Lên lịch học, giao nhiệm vụ và theo dõi tiến độ nộp bài.</p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        disabled={lop.length === 0}
                        className="px-6 sm:px-8 py-4 bg-viet-green text-white font-black rounded-2xl shadow-xl shadow-viet-green/30 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all outline-none flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                        title={lop.length === 0 ? 'Bạn cần tạo lớp học trước khi giao bài' : undefined}
                    >
                        <Plus className="w-5 h-5" aria-hidden="true" /> Giao bài tập mới
                    </button>
                </header>

                {loadError && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3" role="alert">
                        <p className="text-sm font-bold">{loadError}</p>
                        <button type="button" onClick={() => fetchInitialData()} className="px-4 py-2 rounded-xl bg-white border border-red-200 text-xs font-black uppercase tracking-widest">
                            Thử lại
                        </button>
                    </div>
                )}

                {actionError && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700" role="alert">{actionError}</div>
                )}

                {actionNotice && (
                    <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800" role="status" aria-live="polite">{actionNotice}</div>
                )}

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-2 rounded-3xl border border-viet-border shadow-sm">
                   <div className="flex w-full sm:w-auto bg-slate-100 p-1 rounded-2xl" role="group" aria-label="Trạng thái bài tập">
                      {['active', 'past'].map(tab => (
                         <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            aria-pressed={activeTab === tab}
                            className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-viet-green shadow-sm' : 'text-viet-text-light hover:text-viet-text'}`}
                         >
                            {tab === 'active' ? 'Đang hoạt động' : 'Đã kết thúc'}
                         </button>
                      ))}
                   </div>
                   
                   <div className="flex w-full sm:w-auto items-center gap-3 sm:pr-4">
                      <label htmlFor="assignment-class-filter" className="text-[10px] font-black text-viet-text-light uppercase tracking-widest">Lọc theo:</label>
                      <select 
                        id="assignment-class-filter"
                        value={filterClass}
                        onChange={(e) => setFilterClass(e.target.value)}
                        className="min-w-0 flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-viet-green"
                      >
                         <option value="all">Tất cả lớp</option>
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
                            <div className="absolute top-0 right-0 p-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleDeleteAssignment(assignment.id)}
                                    disabled={deletingId !== null}
                                    className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                    title="Xóa bài tập"
                                    aria-label={`Xóa bài tập ${assignment.content || ''}`}
                                >
                                    {deletingId === assignment.id
                                        ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                                        : <Trash2 className="w-4 h-4" aria-hidden="true" />}
                                </button>
                            </div>

                            <div className="flex justify-between items-start mb-6">
                                <span className="px-4 py-1.5 bg-viet-green/10 text-viet-green text-[10px] font-black uppercase tracking-widest rounded-full">
                                    {assignment.class?.name || 'Lớp học'}
                                </span>
                                <span className="text-[10px] text-viet-text-light font-black uppercase tracking-widest">
                                    {formatDate(assignment.created_at, { dateStyle: 'short' })}
                                </span>
                            </div>
                            
                            <h3 className="font-black text-viet-text text-xl mb-3 line-clamp-2 leading-snug">{assignment.content}</h3>
                            
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-2 text-[11px] text-viet-text-light font-bold">
                                    <span className="w-5" aria-hidden="true"></span>
                                    <span>Hạn nộp:</span>
                                    <span className={isAssignmentPast(assignment) ? 'text-red-500 font-black' : 'text-viet-text'}>
                                        {formatDate(assignment.deadline, { dateStyle: 'short', timeStyle: 'short' }, 'Không có')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-[11px] text-viet-text-light font-bold">
                                    <FileText className="w-4 h-4 shrink-0" aria-hidden="true" />
                                    <span>Tài liệu: </span>
                                    {assignment.media_url && isValidHttpUrl(assignment.media_url) ? (
                                        <a href={assignment.media_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline truncate max-w-[150px]">Xem tệp đính kèm</a>
                                    ) : assignment.media_url ? (
                                        <span className="text-slate-500">Học liệu nội bộ</span>
                                    ) : (
                                        <span className="text-slate-400">Không có</span>
                                    )}
                                </div>
                            </div>

                            <button 
                                onClick={() => openSubmissions(assignment)}
                                className="w-full py-4 bg-viet-text text-white rounded-2xl font-black text-xs uppercase tracking-[2px] hover:bg-viet-green shadow-lg shadow-viet-text/10 hover:shadow-viet-green/20 transition-all border-b-4 border-black/20"
                            >
                                Xem tiến độ nộp bài
                            </button>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                            <Inbox className="w-14 h-14 mx-auto mb-4 text-slate-300" aria-hidden="true" />
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
                                onClick={closeCreateModal}
                                className="absolute inset-0 bg-viet-text/60 backdrop-blur-md"
                                aria-hidden="true"
                            />
                            <motion.div 
                                initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                className="relative bg-white rounded-[28px] sm:rounded-[40px] shadow-2xl w-full max-w-xl p-5 sm:p-8 lg:p-10 border border-white/20 max-h-[92vh] overflow-y-auto flex flex-col custom-scrollbar"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="create-assignment-title"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-viet-green to-emerald-400"></div>
                                <div className="flex items-start justify-between gap-4 mb-8">
                                    <h2 id="create-assignment-title" className="text-2xl sm:text-3xl font-black text-viet-text uppercase tracking-tight flex items-center gap-2">
                                        <Plus className="w-6 h-6 text-viet-green" aria-hidden="true" /> Giao bài tập mới
                                    </h2>
                                    <button type="button" onClick={closeCreateModal} disabled={isSubmitting} className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-500 disabled:opacity-50" aria-label="Đóng cửa sổ giao bài">
                                        <X className="w-5 h-5" aria-hidden="true" />
                                    </button>
                                </div>
                                <form onSubmit={handleCreateAssignment} className="space-y-6" noValidate>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="assignment-class" className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Chọn Lớp</label>
                                            <select 
                                                id="assignment-class"
                                                value={newAssignment.lop_id}
                                                onChange={(e) => {
                                                    setNewAssignment((current) => ({ ...current, lop_id: e.target.value }));
                                                    setFormErrors((current) => ({ ...current, lop_id: undefined, submit: undefined }));
                                                }}
                                                disabled={isSubmitting}
                                                aria-invalid={Boolean(formErrors.lop_id)}
                                                aria-describedby={formErrors.lop_id ? 'assignment-class-error' : undefined}
                                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-bold"
                                            >
                                                <option value="">-- Lớp học --</option>
                                                {lop.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                            {formErrors.lop_id && <p id="assignment-class-error" className="mt-2 text-xs font-bold text-red-600">{formErrors.lop_id}</p>}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex bg-slate-100 p-1 rounded-xl mb-1">
                                                {['link', 'file'].map(m => (
                                                    <button 
                                                        key={m} type="button"
                                                        onClick={() => handleUploadMethodChange(m)}
                                                        disabled={isSubmitting || isUploading || isAnalyzing}
                                                        aria-pressed={uploadMethod === m}
                                                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${uploadMethod === m ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                                                    >
                                                        {m === 'link' ? 'Dán liên kết' : 'Tải tệp & phân tích'}
                                                    </button>
                                                ))}
                                            </div>

                                            {uploadMethod === 'link' ? (
                                                <div className="relative">
                                                     <label htmlFor="assignment-link" className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Liên kết tài liệu</label>
                                                     <input 
                                                         id="assignment-link"
                                                         type="url"
                                                         placeholder="Link Google Drive, OneDrive..."
                                                         value={newAssignment.bai_hoc_id}
                                                         onChange={(e) => {
                                                             setNewAssignment((current) => ({ ...current, bai_hoc_id: e.target.value }));
                                                             setFormErrors((current) => ({ ...current, media: undefined, submit: undefined }));
                                                         }}
                                                         disabled={isSubmitting}
                                                         aria-invalid={Boolean(formErrors.media)}
                                                         aria-describedby={formErrors.media ? 'assignment-media-error' : undefined}
                                                         className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-bold"
                                                     />
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <span className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Tải tệp từ máy tính</span>
                                                    <input id="assignment-file" type="file" accept={ASSIGNMENT_FILE_ACCEPT} className="sr-only" onChange={handleFileUpload} disabled={isUploading || isAnalyzing || isSubmitting} aria-label="Chọn tệp PDF hoặc Word" />
                                                    <div className="relative">
                                                        <label htmlFor="assignment-file" className={`w-full h-[52px] px-4 flex items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all focus-within:ring-2 focus-within:ring-blue-300 ${isUploading || isAnalyzing ? 'bg-slate-50 border-slate-200' : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
                                                            {isUploading || isAnalyzing ? (
                                                                <div className="flex items-center gap-2">
                                                                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" aria-hidden="true" />
                                                                    <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">{isUploading ? 'Đang tải lên...' : 'Đang phân tích...'}</span>
                                                                </div>
                                                            ) : uploadedFile ? (
                                                                <div className="flex min-w-0 items-center gap-2 pr-8 text-blue-600">
                                                                    <FileText className="w-5 h-5 shrink-0" aria-hidden="true" />
                                                                    <span className="text-xs font-bold truncate">{uploadedFile.name}</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex items-center gap-2 text-slate-400">
                                                                    <CloudUpload className="w-5 h-5 shrink-0" aria-hidden="true" />
                                                                    <span className="text-xs font-bold uppercase tracking-widest text-center">Tải PDF/Word để tự động tạo câu hỏi</span>
                                                                </div>
                                                            )}
                                                        </label>
                                                        {uploadedFile && !isUploading && !isAnalyzing && (
                                                            <button type="button" onClick={clearAttachment} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500" aria-label="Xóa tệp đã tải">
                                                                <X className="w-4 h-4" aria-hidden="true" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {formErrors.media && <p id="assignment-media-error" className="mt-2 text-xs font-bold text-red-600">{formErrors.media}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="assignment-content" className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Nội dung bài tập</label>
                                        <textarea 
                                            id="assignment-content"
                                            placeholder="Giao nhiệm vụ cụ thể cho học sinh..."
                                            value={newAssignment.content}
                                            onChange={(e) => {
                                                setNewAssignment((current) => ({ ...current, content: e.target.value }));
                                                setFormErrors((current) => ({ ...current, content: undefined, submit: undefined }));
                                            }}
                                            maxLength={2000}
                                            disabled={isSubmitting}
                                            aria-invalid={Boolean(formErrors.content)}
                                            aria-describedby={formErrors.content ? 'assignment-content-error' : undefined}
                                            className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-medium min-h-[120px] resize-none"
                                        />
                                        <div className="mt-2 flex justify-between gap-3 text-xs">
                                            <span id="assignment-content-error" className="font-bold text-red-600">{formErrors.content || ''}</span>
                                            <span className="text-slate-400" aria-label={`${newAssignment.content.length} trên 2000 ký tự`}>{newAssignment.content.length}/2000</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="assignment-deadline" className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Hạn nộp bài (không bắt buộc)</label>
                                        <input 
                                            id="assignment-deadline"
                                            type="datetime-local"
                                            value={newAssignment.deadline}
                                            onChange={(e) => {
                                                setNewAssignment((current) => ({ ...current, deadline: e.target.value }));
                                                setFormErrors((current) => ({ ...current, deadline: undefined, submit: undefined }));
                                            }}
                                            disabled={isSubmitting}
                                            aria-invalid={Boolean(formErrors.deadline)}
                                            aria-describedby={formErrors.deadline ? 'assignment-deadline-error' : undefined}
                                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-bold"
                                        />
                                        {formErrors.deadline && <p id="assignment-deadline-error" className="mt-2 text-xs font-bold text-red-600">{formErrors.deadline}</p>}
                                    </div>
                                    
                                    {/* Questions Review Section */}
                                    {showQuestionsReview && (
                                        <div className="mt-8 pt-8 border-t-4 border-viet-green/20 space-y-6">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50 p-4 rounded-2xl border border-viet-green/20">
                                                <div>
                                                   <h3 className="text-sm font-black text-viet-text uppercase tracking-widest flex items-center"><ClipboardList className="w-5 h-5 mr-2" /> DANH SÁCH CÂU HỎI ({parsedQuestions.length})</h3>
                                                   <p className="text-[10px] font-bold text-viet-green uppercase mt-1">Format 2025: Trắc nghiệm, Đúng/Sai, Trả lời ngắn</p>
                                                </div>
                                                 <div className="flex gap-2">
                                                     <button
                                                        type="button"
                                                        disabled={parsedQuestions.length >= MAX_ASSIGNMENT_QUESTIONS}
                                                        onClick={() => { setParsedQuestions((current) => [...current, createEmptyQuestion()]); setFormErrors((current) => ({ ...current, questions: undefined })); }}
                                                        className="text-[10px] font-black bg-viet-green text-white uppercase px-3 py-2 rounded-xl hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-viet-green/20"
                                                     >+ Thêm câu hỏi</button>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                {parsedQuestions.map((q, qIdx) => (
                                                    <div key={q.id || qIdx} className="p-5 rounded-2xl border relative group bg-slate-50 border-slate-200">
                                                        <button 
                                                            type="button" 
                                                            onClick={() => { setParsedQuestions((current) => current.filter((_, i) => i !== qIdx)); setFormErrors((current) => ({ ...current, questions: undefined })); }}
                                                            className="absolute top-2 right-2 w-7 h-7 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity text-xs"
                                                            aria-label={`Xóa câu hỏi ${qIdx + 1}`}
                                                        ><X className="w-3 h-3" aria-hidden="true" /></button>
                                                        
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                                                    PHẦN {q.part || 1} - CÂU {qIdx + 1}
                                                                </span>
                                                                <select 
                                                                    value={q.type || 'multiple_choice'}
                                                                    onChange={(e) => {
                                                                        const nextType = e.target.value;
                                                                        updateQuestion(qIdx, (current) => ({
                                                                            ...current,
                                                                            type: nextType,
                                                                            options: nextType === 'multiple_choice'
                                                                                ? { A: '', B: '', C: '', D: '' }
                                                                                : nextType === 'true_false'
                                                                                    ? { a: '', b: '', c: '', d: '' }
                                                                                    : undefined,
                                                                            correct_answer: nextType === 'true_false'
                                                                                ? { a: null, b: null, c: null, d: null }
                                                                                : '',
                                                                        }));
                                                                    }}
                                                                    aria-label={`Loại câu hỏi ${qIdx + 1}`}
                                                                    className="text-[9px] font-black uppercase tracking-widest bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none"
                                                                >
                                                                    <option value="multiple_choice">Trắc nghiệm</option>
                                                                    <option value="true_false">Đúng / Sai</option>
                                                                    <option value="short_answer">Trả lời ngắn</option>
                                                                </select>
                                                            </div>
                                                            <div>
                                                                <textarea 
                                                                    value={q.content}
                                                                    onChange={(e) => updateQuestion(qIdx, (current) => ({ ...current, content: e.target.value }))}
                                                                    placeholder="Nhập nội dung câu hỏi..."
                                                                    aria-label={`Nội dung câu hỏi ${qIdx + 1}`}
                                                                    className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-bold outline-none focus:border-viet-green"
                                                                />
                                                            </div>
                                                            
                                                            {(q.type || 'multiple_choice') === 'multiple_choice' && (
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                    {['A', 'B', 'C', 'D'].map((key) => (
                                                                        <div key={key} className="flex flex-col gap-1">
                                                                            <div className="flex items-center justify-between px-1">
                                                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{key}.</span>
                                                                                <input 
                                                                                    type="radio" 
                                                                                    name={`q-${qIdx}-correct`} 
                                                                                    checked={q.correct_answer === key}
                                                                                    onChange={() => updateQuestion(qIdx, (current) => ({ ...current, correct_answer: key }))}
                                                                                    className="w-3 h-3 accent-viet-green cursor-pointer"
                                                                                    aria-label={`Chọn đáp án ${key} là đáp án đúng cho câu ${qIdx + 1}`}
                                                                                />
                                                                            </div>
                                                                            <input 
                                                                                value={q.options?.[key] || ''}
                                                                                onChange={(e) => updateQuestion(qIdx, (current) => ({
                                                                                    ...current,
                                                                                    options: { ...(current.options || {}), [key]: e.target.value },
                                                                                }))}
                                                                                placeholder={`Đáp án ${key}`}
                                                                                aria-label={`Đáp án ${key} của câu ${qIdx + 1}`}
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
                                                                                onChange={(e) => updateQuestion(qIdx, (current) => ({
                                                                                    ...current,
                                                                                    options: { ...(current.options || {}), [key]: e.target.value },
                                                                                }))}
                                                                                placeholder={`Ý ${key}`}
                                                                                aria-label={`Mệnh đề ${key} của câu ${qIdx + 1}`}
                                                                                className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-[11px] font-medium outline-none focus:border-viet-green"
                                                                            />
                                                                            <select
                                                                                value={typeof q.correct_answer?.[key] === 'boolean' ? String(q.correct_answer[key]) : ''}
                                                                                onChange={(e) => {
                                                                                    const answer = e.target.value === '' ? null : e.target.value === 'true';
                                                                                    updateQuestion(qIdx, (current) => ({
                                                                                        ...current,
                                                                                        correct_answer: {
                                                                                            ...(current.correct_answer && typeof current.correct_answer === 'object' ? current.correct_answer : {}),
                                                                                            [key]: answer,
                                                                                        },
                                                                                    }));
                                                                                }}
                                                                                aria-label={`Đáp án cho mệnh đề ${key} của câu ${qIdx + 1}`}
                                                                                className="bg-white border border-slate-200 rounded-xl p-2 text-xs font-bold outline-none min-w-[80px]"
                                                                            >
                                                                                <option value="">- Chọn -</option>
                                                                                <option value="true">Đúng</option>
                                                                                <option value="false">Sai</option>
                                                                            </select>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {q.type === 'short_answer' && (
                                                                <div>
                                                                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1 block">Đáp án</span>
                                                                    <input 
                                                                        value={q.correct_answer || ''}
                                                                        onChange={(e) => updateQuestion(qIdx, (current) => ({ ...current, correct_answer: e.target.value }))}
                                                                        placeholder="Nhập đáp án (thường là số)..."
                                                                        aria-label={`Đáp án tham khảo của câu ${qIdx + 1}`}
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
                                    {formErrors.questions && (
                                        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600" role="alert">
                                            {formErrors.questions}
                                        </p>
                                    )}
                                    {formErrors.submit && (
                                        <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600" role="alert">
                                            {formErrors.submit}
                                        </p>
                                    )}
                                    <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                                        <button
                                            type="button"
                                            onClick={closeCreateModal}
                                            disabled={isSubmitting}
                                            className="flex-1 py-4 sm:py-5 bg-slate-100 text-viet-text font-black rounded-2xl hover:bg-slate-200 disabled:opacity-50 transition-all uppercase tracking-widest text-xs"
                                        >
                                            Hủy bỏ
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || isUploading || isAnalyzing}
                                            className={`flex-1 py-4 sm:py-5 text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs border-b-4 inline-flex items-center justify-center gap-2 ${isSubmitting || isUploading || isAnalyzing ? 'bg-slate-300 border-slate-400 cursor-not-allowed' : 'bg-viet-green border-emerald-700 hover:bg-emerald-600 shadow-viet-green/20'}`}
                                        >
                                            {(isSubmitting || isUploading || isAnalyzing) && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                                            {isSubmitting ? 'Đang xử lý...' : isUploading ? 'Đang tải tệp...' : isAnalyzing ? 'Đang phân tích...' : showQuestionsReview ? 'Lưu bài tập & câu hỏi' : 'Xác nhận giao bài'}
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
                                onClick={closeSubmissions}
                                className="absolute inset-0 bg-viet-text/60 backdrop-blur-md"
                                aria-hidden="true"
                            />
                            <motion.div 
                                initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
                                className="relative bg-white rounded-[28px] sm:rounded-[40px] shadow-2xl w-full max-w-4xl p-5 sm:p-8 lg:p-10 flex flex-col max-h-[92vh] border border-white/20"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="submissions-title"
                            >
                                <div className="flex justify-between items-start gap-4 mb-6 sm:mb-8 pb-5 sm:pb-6 border-b border-slate-100">
                                    <div className="min-w-0">
                                        <h2 id="submissions-title" className="text-2xl sm:text-3xl font-black text-viet-text mb-1 uppercase tracking-tight flex items-center gap-2">
                                            <BarChart3 className="w-6 h-6 text-viet-green shrink-0" aria-hidden="true" /> Tiến độ nộp bài
                                        </h2>
                                        <p className="text-xs sm:text-sm font-bold text-viet-green uppercase tracking-widest line-clamp-2">{viewingSubmissions.content}</p>
                                    </div>
                                    <button 
                                        onClick={closeSubmissions}
                                        className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
                                        aria-label="Đóng danh sách tiến độ"
                                    ><X className="w-5 h-5" aria-hidden="true" /></button>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto sm:pr-3 custom-scrollbar lg:grid lg:grid-cols-2 lg:gap-6">
                                    {subLoading ? (
                                        <div className="col-span-full py-20 flex items-center justify-center gap-3 uppercase font-black text-viet-text-light tracking-widest" role="status">
                                            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Đang tải danh sách...
                                        </div>
                                    ) : subError ? (
                                        <div className="col-span-full py-12 text-center rounded-2xl bg-red-50 border border-red-200 text-red-700" role="alert">
                                            <p className="font-bold mb-4">{subError}</p>
                                            <button type="button" onClick={() => fetchSubmissions(viewingSubmissions.id)} className="px-4 py-2 rounded-xl bg-white border border-red-200 text-xs font-black uppercase tracking-widest">Thử lại</button>
                                        </div>
                                    ) : submissions.length === 0 ? (
                                        <div className="col-span-full py-16 text-center rounded-2xl border-2 border-dashed border-slate-200 text-viet-text-light">
                                            <Inbox className="w-10 h-10 mx-auto mb-3 text-slate-300" aria-hidden="true" />
                                            <p className="text-xs font-black uppercase tracking-widest">Lớp chưa có học sinh</p>
                                        </div>
                                    ) : submissions.map((sub, idx) => {
                                        const student = sub.student || { id: `unknown-${idx}`, username: 'Học sinh không xác định' };
                                        const canGrade = Boolean(sub.student?.id);
                                        return (
                                        <div key={student.id} className={`p-4 sm:p-6 rounded-3xl border-2 mb-4 transition-all ${sub.submitted ? 'border-viet-green/20 bg-emerald-50/30' : 'border-slate-100 bg-white opacity-70'}`}>
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100 overflow-hidden">
                                                        <img src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(student.username)}`} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-viet-text uppercase">{student.username}</p>
                                                        <p className={`text-[9px] font-black uppercase tracking-widest ${sub.submitted ? 'text-viet-green' : 'text-red-500'}`}>
                                                            {sub.submitted ? 'Đã hoàn thành' : 'Chưa nộp bài'}
                                                        </p>
                                                        {sub.submitted_at && (
                                                            <p className="mt-1 text-[9px] font-bold text-slate-400">
                                                                {formatDate(sub.submitted_at, { dateStyle: 'short', timeStyle: 'short' })}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {sub.score !== null && sub.score !== undefined && (
                                                    <div className="bg-viet-green text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-lg shadow-viet-green/20">
                                                        {sub.score}
                                                    </div>
                                                )}
                                            </div>

                                            {sub.submitted && grading.studentId !== student.id && (
                                                <button 
                                                    onClick={() => startGrading(sub)}
                                                    disabled={!canGrade || gradingStudentId !== null}
                                                    className="w-full py-3 bg-white border-2 border-viet-green/30 text-viet-green font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-viet-green hover:text-white transition-all"
                                                >
                                                    {sub.score === null || sub.score === undefined ? 'Chấm điểm & phản hồi' : 'Sửa điểm & phản hồi'}
                                                </button>
                                            )}

                                            {grading.studentId === student.id && (
                                                <div className="mt-4 p-5 bg-white rounded-3xl border-2 border-viet-green shadow-xl shadow-viet-green/5 space-y-6">
                                                    <div className="space-y-4">
                                                        <h4 className="text-[10px] font-black text-viet-text uppercase tracking-widest border-b border-slate-100 pb-2 flex items-center gap-2">
                                                            <ClipboardList className="w-4 h-4" /> Chi tiết bài làm
                                                        </h4>
                                                        <div className="space-y-4 max-h-[300px] overflow-y-auto sm:pr-2 custom-scrollbar">
                                                            {Array.isArray(viewingSubmissions.questions) && viewingSubmissions.questions.length > 0 ? viewingSubmissions.questions.map((q, qIdx) => {
                                                                const studentAnswer = sub.answers?.[qIdx] ?? sub.answers?.[String(qIdx)] ?? null;
                                                                const isMC = (q.type || 'multiple_choice') === 'multiple_choice';
                                                                
                                                                return (
                                                                    <div key={qIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                                                        <div className="flex gap-2">
                                                                            <span className="shrink-0 w-6 h-6 bg-slate-200 text-viet-text rounded-lg flex items-center justify-center text-[10px] font-black">
                                                                                {qIdx + 1}
                                                                            </span>
                                                                            <p className="text-[11px] font-bold text-viet-text leading-tight">{q.question || q.content}</p>
                                                                        </div>
                                                                        
                                                                        {isMC ? (
                                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:pl-8">
                                                                                {getQuestionOptions(q).map((opt, oIdx) => {
                                                                                    const isChosen = Number(studentAnswer) === oIdx;
                                                                                    const isCorrect = getCorrectOptionIndex(q) === oIdx;
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
                                                                                    <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest block mb-1">Câu trả lời của học sinh:</span>
                                                                                    <p className="text-[11px] font-medium text-viet-text italic whitespace-pre-wrap">
                                                                                        {formatAnswer(studentAnswer)}
                                                                                    </p>
                                                                                </div>
                                                                                {(q.sample_answer || q.correct_answer) && (
                                                                                    <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                                                                                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Đáp án mẫu tham khảo:</span>
                                                                                        <p className="text-[10px] font-medium text-emerald-800 whitespace-pre-wrap">
                                                                                            {formatAnswer(q.sample_answer || q.correct_answer)}
                                                                                        </p>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            }) : (
                                                                <p className="rounded-xl bg-slate-50 p-4 text-xs font-bold text-viet-text-light">
                                                                    Bài tập này không có câu hỏi trực tuyến. Hãy chấm theo tệp hoặc nội dung học sinh đã xác nhận.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                                                        <h4 className="text-[10px] font-black text-viet-text uppercase tracking-widest flex items-center gap-2">
                                                            <PenLine className="w-4 h-4" aria-hidden="true" /> Chấm điểm & nhận xét
                                                        </h4>
                                                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                                                            <div className="relative">
                                                                <label htmlFor={`grade-score-${student.id}`} className="sr-only">Điểm của {student.username}</label>
                                                                <input 
                                                                    id={`grade-score-${student.id}`}
                                                                    type="number" min="0" max="10" step="0.1" placeholder="0"
                                                                    value={grading.score}
                                                                    onChange={(e) => { setGrading((current) => ({ ...current, score: e.target.value })); setGradingErrors((current) => ({ ...current, score: undefined, submit: undefined })); }}
                                                                    disabled={gradingStudentId !== null}
                                                                    aria-invalid={Boolean(gradingErrors.score)}
                                                                    aria-describedby={gradingErrors.score ? `grade-score-error-${student.id}` : undefined}
                                                                    className="w-full sm:w-24 p-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-black text-center outline-none focus:border-viet-green focus:shadow-lg focus:shadow-viet-green/10"
                                                                />
                                                                <span className="absolute -top-2 -right-2 bg-viet-green text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-sm">/10</span>
                                                                {gradingErrors.score && <p id={`grade-score-error-${student.id}`} className="mt-2 text-[10px] font-bold text-red-600">{gradingErrors.score}</p>}
                                                            </div>
                                                            <div className="flex-1">
                                                                <label htmlFor={`grade-feedback-${student.id}`} className="sr-only">Nhận xét cho {student.username}</label>
                                                                <textarea
                                                                    id={`grade-feedback-${student.id}`}
                                                                    placeholder="Ghi chú nhận xét cho học sinh..."
                                                                    value={grading.phan_hoi}
                                                                    onChange={(e) => { setGrading((current) => ({ ...current, phan_hoi: e.target.value })); setGradingErrors((current) => ({ ...current, feedback: undefined, submit: undefined })); }}
                                                                    maxLength={1500}
                                                                    disabled={gradingStudentId !== null}
                                                                    aria-invalid={Boolean(gradingErrors.feedback)}
                                                                    className="w-full min-h-20 p-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-viet-green focus:shadow-lg focus:shadow-viet-green/10 resize-y"
                                                                />
                                                                {gradingErrors.feedback && <p className="mt-2 text-[10px] font-bold text-red-600">{gradingErrors.feedback}</p>}
                                                            </div>
                                                        </div>
                                                        {gradingErrors.submit && <p className="text-xs font-bold text-red-600" role="alert">{gradingErrors.submit}</p>}
                                                        <div className="flex gap-2">
                                                            <button 
                                                                type="button"
                                                                onClick={() => { setGrading(EMPTY_GRADING); setGradingErrors({}); }}
                                                                disabled={gradingStudentId !== null}
                                                                className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-viet-text-light hover:text-red-500 transition-colors"
                                                            >Hủy bỏ</button>
                                                            <button 
                                                                type="button"
                                                                onClick={() => handleGrade(student.id)}
                                                                disabled={gradingStudentId !== null}
                                                                className="flex-1 py-3 bg-viet-green text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-viet-green/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 transition-all inline-flex items-center justify-center gap-2"
                                                            >
                                                                {gradingStudentId === student.id && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                                                                Lưu kết quả
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {sub.teacher_feedback && (
                                                <div className="mt-2 p-3 bg-white/50 rounded-xl border border-slate-100 text-[11px] font-bold text-viet-text-light italic">
                                                    " {sub.teacher_feedback} "
                                                </div>
                                            )}
                                        </div>
                                        );
                                    })}
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

