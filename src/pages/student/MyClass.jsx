import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTranslation, Trans } from 'react-i18next';
import { CheckCircle2, Rocket, ChevronLeft, ChevronRight, Calendar, Users } from 'lucide-react';

const QUESTION_TYPE_LABELS = {
  multiple_choice: 'Trắc nghiệm',
  true_false: 'Đúng/Sai',
  short_answer: 'Trả lời ngắn',
  essay: 'Tự luận',
};
const POST_PAGE_SIZE = 20;
const CLASS_OVERVIEW_CACHE_TTL_MS = 30_000;

const normalizeClassOverview = (data = {}) => ({
  posts: Array.isArray(data.posts) ? data.posts : [],
  postsHasMore: Boolean(data.postsHasMore),
  schedules: Array.isArray(data.schedules) ? data.schedules : [],
  schedulesHasMore: Boolean(data.schedulesHasMore),
  members: Array.isArray(data.members) ? data.members : [],
  membersHasMore: Boolean(data.membersHasMore),
  loadedAt: Date.now(),
});

const getQuestionSectionTitle = (question = {}) => {
  const part = Number(question.part);
  const partLabel = ({ 1: 'I', 2: 'II', 3: 'III' })[part] || question.part || '';
  const typeLabel = QUESTION_TYPE_LABELS[question.type || 'multiple_choice'] || 'Câu hỏi';
  return `Phần ${partLabel} - ${typeLabel}`;
};

const MyClass = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [lop, setClasses] = useState([]);
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  
  const [selectedClass, setSelectedClass] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsPage, setPostsPage] = useState(1);
  const [postsHasMore, setPostsHasMore] = useState(false);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [schedulesHasMore, setSchedulesHasMore] = useState(false);
  const [scheduleIndex, setScheduleIndex] = useState(0);
  const [members, setMembers] = useState([]);
  const [membersHasMore, setMembersHasMore] = useState(false);
  const [memberPage, setMemberPage] = useState(0);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState('');
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [privateMessage, setPrivateMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [viewingAssignment, setViewingAssignment] = useState(null);
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [referenceTime, setReferenceTime] = useState(() => Date.now());
  const classDataRequestRef = React.useRef(null);
  const classPostRequestRef = React.useRef(null);
  const classOverviewCacheRef = React.useRef(new Map());

  const markAsRead = useCallback((classId) => {
    const lastReadData = JSON.parse(localStorage.getItem('classroom_last_read') || '{}');
    lastReadData[classId] = new Date().toISOString();
    localStorage.setItem('classroom_last_read', JSON.stringify(lastReadData));
    window.dispatchEvent(new Event('classroom_read'));
  }, []);

  const selectClass = useCallback(async (cls, prefetchedOverview = null) => {
    classDataRequestRef.current?.abort();
    classPostRequestRef.current?.abort();
    const controller = new AbortController();
    classDataRequestRef.current = controller;
    const cached = prefetchedOverview
      ? normalizeClassOverview(prefetchedOverview)
      : classOverviewCacheRef.current.get(cls.id);
    const hasFreshCache = cached && Date.now() - cached.loadedAt < CLASS_OVERVIEW_CACHE_TTL_MS;
    setReferenceTime(Date.now());
    setSelectedClass(cls);
    setOverviewError('');
    setOverviewLoading(!hasFreshCache);
    setScheduleIndex(0);
    setMemberPage(0);

    if (hasFreshCache) {
      setPosts(cached.posts);
      setPostsPage(1);
      setPostsHasMore(cached.postsHasMore);
      setSchedules(cached.schedules);
      setSchedulesHasMore(cached.schedulesHasMore);
      setMembers(cached.members);
      setMembersHasMore(cached.membersHasMore);
    } else {
      setPosts([]);
      setPostsPage(1);
      setPostsHasMore(false);
      setSchedules([]);
      setSchedulesHasMore(false);
      setMembers([]);
      setMembersHasMore(false);
    }

    markAsRead(cls.id);
    if (prefetchedOverview) {
      classOverviewCacheRef.current.set(cls.id, cached);
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`/api/classes/${cls.id}/overview`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Không thể tải tổng quan lớp học.');
      if (controller.signal.aborted || classDataRequestRef.current !== controller) return;

      const overview = normalizeClassOverview(data);
      classOverviewCacheRef.current.set(cls.id, overview);
      setPosts(overview.posts);
      setPostsPage(1);
      setPostsHasMore(overview.postsHasMore);
      setSchedules(overview.schedules);
      setSchedulesHasMore(overview.schedulesHasMore);
      setMembers(overview.members);
      setMembersHasMore(overview.membersHasMore);
    } catch (err) {
      if (err.name !== 'AbortError' && !hasFreshCache) {
        setOverviewError(err.message || 'Không thể tải tổng quan lớp học.');
      }
    } finally {
      if (classDataRequestRef.current === controller) setOverviewLoading(false);
    }
  }, [markAsRead]);

  const loadMorePosts = useCallback(async () => {
    if (!selectedClass || !postsHasMore || loadingMorePosts) return;
    classPostRequestRef.current?.abort();
    const controller = new AbortController();
    classPostRequestRef.current = controller;
    setLoadingMorePosts(true);
    try {
      const token = localStorage.getItem('token');
      const nextPage = postsPage + 1;
      const response = await fetch(`/api/classes/${selectedClass.id}/posts?page=${nextPage}&limit=${POST_PAGE_SIZE}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: controller.signal,
      });
      const data = await response.json().catch(() => []);
      if (!response.ok) throw new Error(data.error || 'Không thể tải thêm bài đăng.');
      if (!controller.signal.aborted && classPostRequestRef.current === controller && Array.isArray(data)) {
        setPosts((current) => [
          ...current,
          ...data.filter((post) => !current.some((existing) => existing.id === post.id)),
        ]);
        setPostsPage(nextPage);
        setPostsHasMore(response.headers.get('X-Has-More') === 'true');
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    } finally {
      if (classPostRequestRef.current === controller) setLoadingMorePosts(false);
    }
  }, [loadingMorePosts, postsHasMore, postsPage, selectedClass]);

  const fetchClasses = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/classes?includeOverview=first', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const payload = await res.json();
        const classes = Array.isArray(payload) ? payload : payload.classes;
        const classList = Array.isArray(classes) ? classes : [];
        setClasses(classList);
        if (classList.length > 0) {
          const firstClass = classList.find((item) => item.id === payload.selectedClassId) || classList[0];
          selectClass(firstClass, Array.isArray(payload) ? null : payload.overview);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectClass]);

  useEffect(() => {
    const timeout = window.setTimeout(fetchClasses, 0);
    return () => {
      window.clearTimeout(timeout);
      classDataRequestRef.current?.abort();
      classPostRequestRef.current?.abort();
    };
  }, [fetchClasses]);

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
      if (!res.ok) throw new Error(data.error || t('common.error_joining_class', { defaultValue: 'Lỗi tham gia lớp' }));
      
      setJoinCode('');
      setError('');
      fetchClasses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompleteAssignment = async (postId, answers = null) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/classes/assignments/${postId}/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ answers: answers || {} })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const currentClass = selectedClass;
        if (currentClass) selectClass(currentClass);
        setActiveQuiz(null);
        return data;
      } else {
        throw new Error(data.error || 'Nộp bài thất bại!');
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
      throw err;
    }
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz || getAnsweredQuestionCount(activeQuiz.questions) < activeQuiz.questions.length) return;

    setIsSubmittingQuiz(true);
    try {
      const submitted = await handleCompleteAssignment(activeQuiz.id, quizAnswers);
      const autoGrade = submitted?.auto_grade;
      if (autoGrade?.score !== null && autoGrade?.score !== undefined && autoGrade?.needsManualReview) {
        alert(`Đã nộp bài. Phần tự động chấm được ${autoGrade.score}/10 (${autoGrade.correct}/${autoGrade.total} câu); giáo viên sẽ xem các câu còn lại.`);
      } else if (autoGrade?.score !== null && autoGrade?.score !== undefined) {
        alert(t('my_class.quiz.score_msg', { score: autoGrade.score }));
      } else {
        alert(t('my_class.quiz.success_msg'));
      }
    } catch (err) {
      // Error already alerted in handleCompleteAssignment
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const getFileIcon = (url) => {
    if (!url) return 'Link2';
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.endsWith('.pdf') || lowerUrl.includes('/pdf')) return '📕';
    if (lowerUrl.includes('doc') || lowerUrl.includes('word') || lowerUrl.includes('docx')) return '📘';
    if (lowerUrl.includes('xls') || lowerUrl.includes('excel') || lowerUrl.includes('xlsx')) return '📗';
    return 'Link2';
  };

  const getFileLabel = (url) => {
    if (!url) return t('my_class.feed.assignment.file_Default');
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.endsWith('.pdf') || lowerUrl.includes('/pdf')) return t('my_class.feed.assignment.file_PDF');
    if (lowerUrl.includes('docx') || lowerUrl.includes('word') || lowerUrl.endsWith('.doc')) return t('my_class.feed.assignment.file_Word');
    if (lowerUrl.includes('xlsx') || lowerUrl.includes('excel') || lowerUrl.endsWith('.xls')) return t('my_class.feed.assignment.file_Excel');
    if (lowerUrl.startsWith('http')) return t('my_class.feed.assignment.file_Link');
    return t('my_class.feed.assignment.file_Placeholder');
  };

  const formatActiveTime = (minutes) => {
    const totalMinutes = Number(minutes) || 0;
    if (totalMinutes <= 0) return 'Chưa có hoạt động';

    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    if (hours && remainingMinutes) return `${hours} giờ ${remainingMinutes} phút`;
    if (hours) return `${hours} giờ`;
    return `${remainingMinutes} phút`;
  };

  const hasAssignmentExpired = (assignment) => {
    if (!assignment?.deadline) return false;
    const deadline = new Date(assignment.deadline).getTime();
    return Number.isFinite(deadline) && deadline <= referenceTime;
  };

  const isQuestionAnswered = (question, index) => {
    const answer = quizAnswers[index];
    const type = question?.type || 'multiple_choice';

    if (type === 'multiple_choice') return answer !== undefined && answer !== null;
    if (type === 'true_false') {
      const optionKeys = Object.keys(question.options || {});
      return optionKeys.length > 0 && optionKeys.every((key) => typeof answer?.[key] === 'boolean');
    }

    return typeof answer === 'string' ? answer.trim().length > 0 : Boolean(answer);
  };

  const getAnsweredQuestionCount = (questions = []) => questions.filter(isQuestionAnswered).length;

  const getEmbedUrl = (url) => {
    if (!url) return '';
    let processedUrl = url;

    // Google Drive handling
    if (url.includes('drive.google.com')) {
      processedUrl = url.replace('/view', '/preview').replace('/edit', '/preview');
      return processedUrl;
    }

    // Cloudinary URL cleanup
    if (url.includes('res.cloudinary.com')) {
      const lowerUrl = url.toLowerCase();
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
      const res = await fetch(`/api/classes/${selectedClass.id}/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: privateMessage,
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || data.message || 'Gửi tin nhắn thất bại');
      }

      setPrivateMessage('');
      setIsMessageModalOpen(false);
      selectClass(selectedClass);
    } catch (err) {
      console.error(err);
      alert(err.message);
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

  if (lop.length === 0) {
    return (
      <div className="min-h-screen bg-viet-bg pt-28 pb-20 px-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[40px] max-w-md w-full text-center border border-viet-border shadow-xl shadow-black/5"
        >
          <div className="w-20 h-20 bg-viet-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-viet-green">School</span>
          </div>
          <h2 className="text-2xl font-black text-viet-text mb-2 uppercase tracking-tight">{t('my_class.empty.title')}</h2>
          <p className="text-sm font-medium text-viet-text-light mb-8">
            {t('my_class.empty.desc')}
          </p>

          <form onSubmit={handleJoinClass} className="space-y-4">
            {error && <div className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl">{error}</div>}
            <input 
              type="text" 
              placeholder={t('my_class.empty.placeholder')}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="w-full h-14 bg-slate-50 border-2 border-transparent focus:border-viet-green focus:bg-white rounded-2xl text-center font-black tracking-[4px] text-lg uppercase outline-none transition-all placeholder:tracking-normal placeholder:font-medium"
            />
            <button 
              type="submit"
              className="w-full h-14 bg-viet-green text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-viet-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {t('my_class.empty.submit')}
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
        <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-[96px] lg:self-start lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
          <h2 className="text-xs font-black text-viet-text-light uppercase tracking-widest pl-2">{t('my_class.sidebar.title')}</h2>
          {lop.map(cls => (
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
                {t('my_class.sidebar.teacher_prefix')} {cls.teacher?.username} • {t('my_class.sidebar.grade_label', { grade: cls.khoi_id || cls.gradeLevelId })}
              </p>
            </button>
          ))}
          
          <div className="pt-4 mt-6 border-t border-viet-border">
            <p className="text-[10px] font-bold text-viet-text-light mb-3 tracking-widest pl-2 uppercase">{t('my_class.sidebar.join_other')}</p>
             <form onSubmit={handleJoinClass} className="flex gap-2">
               <input 
                  type="text" 
                  placeholder={t('my_class.sidebar.code_placeholder')}
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="flex-1 h-11 bg-white border border-viet-border rounded-xl px-4 text-sm font-bold uppercase outline-none focus:border-viet-green transition-colors"
                />
                <button type="submit" className="h-11 px-4 bg-viet-text text-white rounded-xl font-black text-xs hover:bg-black transition-colors">
                  {t('my_class.sidebar.join_btn')}
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
               <span className="px-3 py-1 bg-viet-green/10 text-viet-green text-[10px] font-black tracking-widest uppercase rounded-lg w-max">{t('my_class.header.badge')}</span>
               <h1 className="text-3xl font-black text-viet-text uppercase tracking-tight">{selectedClass.name}</h1>
               <p className="text-sm font-medium text-viet-text-light">{selectedClass.description}</p>
            </header>

            {overviewError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700" role="alert">
                {overviewError}
              </div>
            )}

            <div className="space-y-6">
              <h2 className="text-sm font-black text-viet-text uppercase tracking-widest">{t('my_class.feed.title')}</h2>
              
              {overviewLoading ? (
                <div className="space-y-3 rounded-[32px] border border-viet-border bg-white p-6" aria-label="Đang tải bảng tin lớp học">
                  <div className="h-4 w-32 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white border text-center border-viet-border border-dashed p-12 rounded-[32px]">
                   <span className="text-4xl block mb-2 opacity-30">MailX</span>
                   <p className="text-viet-text-light font-bold text-sm">{t('my_class.feed.empty')}</p>
                </div>
              ) : (
                <>
                {posts.map((post) => (
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
                           <p className="text-sm font-black text-viet-text">{post.author?.username === user?.username ? t('my_class.feed.author_you') : post.author?.username}</p>
                           <p className="text-[10px] font-bold text-viet-text-light uppercase">{new Date(post.created_at).toLocaleString()}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                           {post.target && <span className="px-2 py-1 bg-purple-50 text-purple-600 font-black text-[10px] rounded-lg tracking-widest uppercase flex items-center gap-1">{t('my_class.feed.private_badge')}</span>}
                           {post.tac_gia_id === user?.id && post.hoc_sinh_nhan_id && <span className="px-2 py-1 bg-slate-100 text-viet-text-light font-black text-[10px] rounded-lg tracking-widest uppercase">{t('my_class.feed.sent_to_teacher')}</span>}
                           {post.type === 'video' && <span className="px-2 py-1 bg-red-50 text-red-500 font-black text-[10px] rounded-lg tracking-widest uppercase">{t('my_class.feed.type_video')}</span>}
                           {post.type === 'assignment' && <span className="px-2 py-1 bg-blue-50 text-blue-500 font-black text-[10px] rounded-lg tracking-widest uppercase">{t('my_class.feed.type_assignment')}</span>}
                           {post.type === 'announcement' && !post.target && <span className="px-2 py-1 bg-orange-50 text-orange-500 font-black text-[10px] rounded-lg tracking-widest uppercase">{t('my_class.feed.type_announcement')}</span>}
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
                           <span className="text-red-500 text-[11px] font-black uppercase tracking-widest">{t('my_class.feed.deadline')}</span>
                           <span className="text-red-600 font-bold text-sm bg-white px-3 py-1 rounded-lg border border-red-100 shadow-sm">{new Date(post.deadline).toLocaleString()}</span>
                        </div>
                     )}

                     {post.type === 'assignment' && (
                        <div className="mt-2 flex flex-col gap-2">
                          {post.media_url && (!post.questions || post.questions.length === 0) && (
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
                            <div className="flex flex-col gap-2">
                                <div className="w-full py-4 bg-emerald-50 text-viet-green font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 border-2 border-viet-green/20">
                                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {t('my_class.feed.assignment.completed')}
                                </div>
                                {post.user_submission?.score !== null && post.user_submission?.score !== undefined && (
                                   <div className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-sm">
                                      <div className="flex flex-col">
                                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{t('my_class.feed.assignment.result_label')}</span>
                                         <span className="text-lg font-black text-viet-text uppercase tracking-tight">{t('my_class.feed.assignment.online_label')}</span>
                                      </div>
                                      <div className="flex items-center gap-2 bg-viet-green text-white px-4 py-2 rounded-xl shadow-lg shadow-viet-green/20">
                                         <span className="text-xl font-black">{post.user_submission.score}</span>
                                         <span className="text-[10px] font-black opacity-60">/ 10</span>
                                      </div>
                                   </div>
                                )}
                            </div>
                          ) : hasAssignmentExpired(post) ? (
                            <div className="w-full py-4 bg-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center border-2 border-slate-200">
                              Đã hết hạn nộp bài
                            </div>
                          ) : post.questions && post.questions.length > 0 ? (
                            <button 
                              onClick={() => {
                                setActiveQuiz(post);
                                setQuizAnswers({});
                              }}
                              className="w-full py-4 bg-viet-green text-white font-black text-xs uppercase tracking-[2px] rounded-xl shadow-lg shadow-viet-green/20 hover:scale-[1.02] transition-all border-b-4 border-emerald-700"
                            >
                              <span className="inline-flex items-center justify-center gap-2">
                                <Rocket className="h-4 w-4" aria-hidden="true" />
                                {t('my_class.feed.assignment.start_online', { count: post.questions.length })}
                              </span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleCompleteAssignment(post.id)}
                              className="w-full py-3 bg-viet-green text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-viet-green/20 hover:scale-[1.02] transition-all"
                            >
                              {t('my_class.feed.assignment.confirm_btn')}
                            </button>
                          )}
                        </div>
                     )}
                  </motion.div>
                ))}
                {postsHasMore && (
                  <button
                    type="button"
                    onClick={loadMorePosts}
                    disabled={loadingMorePosts}
                    className="mx-auto min-h-11 rounded-xl border border-viet-border bg-white px-6 py-2.5 text-xs font-black uppercase tracking-widest text-viet-green hover:border-viet-green disabled:opacity-60"
                  >
                    {loadingMorePosts ? 'Đang tải...' : 'Xem thêm bài đăng'}
                  </button>
                )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Lịch học & Khác (Right Sidebar) */}
        {selectedClass && (
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-[96px] lg:self-start lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
            {/* Lịch học Widget */}
            <div className="bg-white p-6 rounded-[32px] border border-viet-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-viet-text uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-viet-green" aria-hidden="true" />
                  {t('my_class.schedules.title')}
                </h3>
                {!overviewLoading && schedules.length > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setScheduleIndex((prev) => (prev > 0 ? prev - 1 : schedules.length - 1))}
                      className="w-7 h-7 rounded-lg border border-viet-border hover:bg-slate-100 flex items-center justify-center text-viet-text transition-colors"
                      aria-label="Lịch học trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-extrabold text-viet-text-light px-1">
                      {scheduleIndex + 1}/{schedules.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setScheduleIndex((prev) => (prev < schedules.length - 1 ? prev + 1 : 0))}
                      className="w-7 h-7 rounded-lg border border-viet-border hover:bg-slate-100 flex items-center justify-center text-viet-text transition-colors"
                      aria-label="Lịch học tiếp theo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
               
              <div>
                {overviewLoading ? (
                  <div className="space-y-2" aria-label="Đang tải lịch học">
                    <div className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                  </div>
                ) : schedules.length === 0 ? (
                  <p className="text-xs font-medium text-viet-text-light text-center py-4 bg-slate-50 rounded-xl">{t('my_class.schedules.empty')}</p>
                ) : (
                  (() => {
                    const currentSch = schedules[scheduleIndex] || schedules[0];
                    return (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentSch.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="p-4 border-2 border-viet-green/20 bg-viet-green/5 rounded-2xl flex flex-col justify-between"
                        >
                          <div>
                            <p className="text-xs font-black text-viet-text mb-2 leading-snug">{currentSch.title}</p>
                            <p className="text-[10px] font-bold text-viet-green uppercase bg-white px-2 py-1 rounded-md inline-block border border-viet-green/20 shadow-xs mb-3">
                              {new Date(currentSch.start_time).toLocaleString()}
                            </p>
                          </div>
                          {currentSch.meet_url && (
                            <a 
                              href={currentSch.meet_url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="block w-full py-2 bg-viet-green hover:bg-emerald-600 text-white text-[10px] font-black uppercase text-center rounded-xl transition-all shadow-md shadow-viet-green/20"
                            >
                              {t('my_class.schedules.join_meet')}
                            </a>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    );
                  })()
                )}
              </div>
            </div>

            {/* Bạn cùng lớp Widget */}
            <div className="bg-white p-6 rounded-[32px] border border-viet-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-viet-text uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4 text-viet-green" aria-hidden="true" />
                  {t('my_class.members.title', { defaultValue: 'Bạn cùng lớp' })}
                </h3>
                {!overviewLoading && members.length > 3 && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setMemberPage((prev) => (prev > 0 ? prev - 1 : Math.ceil(members.length / 3) - 1))}
                      className="w-7 h-7 rounded-lg border border-viet-border hover:bg-slate-100 flex items-center justify-center text-viet-text transition-colors"
                      aria-label="Trang thành viên trước"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-extrabold text-viet-text-light px-1">
                      {memberPage + 1}/{Math.ceil(members.length / 3)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setMemberPage((prev) => (prev < Math.ceil(members.length / 3) - 1 ? prev + 1 : 0))}
                      className="w-7 h-7 rounded-lg border border-viet-border hover:bg-slate-100 flex items-center justify-center text-viet-text transition-colors"
                      aria-label="Trang thành viên tiếp theo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
               
              <div>
                {overviewLoading ? (
                  <div className="space-y-2" aria-label="Đang tải thành viên lớp">
                    <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
                  </div>
                ) : members.length === 0 ? (
                  <p className="text-xs font-medium text-viet-text-light text-center py-4 bg-slate-50 rounded-xl">{t('my_class.members.empty', { defaultValue: 'Chưa có thành viên nào' })}</p>
                ) : (
                  (() => {
                    const pageSize = 3;
                    const currentMembers = members.slice(memberPage * pageSize, (memberPage + 1) * pageSize);
                    return (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={memberPage}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-2.5"
                        >
                          {currentMembers.map(m => (
                            <div key={m.id} className="flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                              <div className="relative shrink-0">
                                <div className="w-9 h-9 rounded-xl bg-viet-green/10 text-viet-green flex items-center justify-center text-xs font-black border border-viet-green/20">
                                  {m.username.substring(0,2).toUpperCase()}
                                </div>
                                <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${m.isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-bold text-viet-text truncate leading-tight">{m.username}</span>
                                <span className="text-[9px] font-bold text-viet-text-light/60 uppercase">
                                  {formatActiveTime(m.active_minutes)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    );
                  })()
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-viet-green to-emerald-600 p-6 rounded-[32px] shadow-lg shadow-viet-green/20 relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-white font-black text-lg mb-2">{t('my_class.support.title')}</h3>
                  <p className="text-white/80 text-xs font-medium mb-4">{t('my_class.support.desc')}</p>
                  <button 
                    onClick={() => setIsMessageModalOpen(true)}
                    className="w-full bg-white text-viet-green font-black text-xs uppercase tracking-widest py-3 rounded-xl shadow-sm hover:scale-[1.02] transition-all"
                  >
                    {t('my_class.support.btn')}
                  </button>
               </div>
               <div className="absolute right-0 bottom-0 text-7xl opacity-10 translate-x-1/4 translate-y-1/4">MessageCircle</div>
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
                             <h3 className="text-lg font-black text-viet-text uppercase tracking-tight">{t('my_class.message_modal.title')}</h3>
                             <p className="text-[10px] font-bold text-viet-green uppercase tracking-widest">{t('my_class.message_modal.class_prefix')} {selectedClass.name}</p>
                          </div>
                          <button onClick={() => setIsMessageModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center text-viet-text-light transition-colors">×</button>
                       </div>
                       <form onSubmit={handleSendToTeacher} className="p-6 space-y-4">
                          <textarea 
                             className="w-full h-32 p-4 bg-slate-50 border border-viet-border rounded-2xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-medium resize-none shadow-inner"
                             placeholder={t('my_class.message_modal.placeholder')}
                             value={privateMessage}
                             onChange={(e) => setPrivateMessage(e.target.value)}
                             required
                          />
                          <button 
                             disabled={sending}
                             className="w-full py-4 bg-viet-green text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-viet-green/20 flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all disabled:opacity-50"
                          >
                             {sending ? t('my_class.message_modal.sending') : t('my_class.message_modal.send_btn')}
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
                           {t('my_class.viewer.from')} {viewingAssignment.author?.username} • {t('my_class.viewer.deadline')} {viewingAssignment.deadline ? new Date(viewingAssignment.deadline).toLocaleString() : t('my_class.viewer.no_deadline')}
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
                        <span>📥</span> {t('my_class.viewer.download')}
                     </a>
                     <button 
                        onClick={() => setViewingAssignment(null)} 
                        className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center text-viet-text-light hover:text-red-500 hover:border-red-100 transition-all font-black text-xl shadow-sm"
                     >×</button>
                  </div>
               </div>
               
               <div className="flex-1 bg-slate-200 relative">
                  {isIframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-10 transition-opacity">
                       <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">{t('my_class.viewer.loading')}</p>
                    </div>
                  )}

                  <iframe 
                    src={getEmbedUrl(viewingAssignment.media_url)}
                    className="w-full h-full border-0 absolute inset-0"
                    title="Assignment Viewer"
                    onLoad={() => setIsIframeLoading(false)}
                  />
                  
                  {!isIframeLoading && (
                    <div className="absolute bottom-6 right-6 z-20">
                       <a 
                         href={viewingAssignment.media_url} 
                         target="_blank" 
                         rel="noreferrer"
                         className="px-6 py-3 bg-white/90 backdrop-blur shadow-xl border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2"
                       >
                         <span>Link2</span> {t('my_class.viewer.tab_fallback')}
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
                  >{t('my_class.viewer.download')} 📥</a>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Interactive Quiz Modal */}
      <AnimatePresence>
        {activeQuiz && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-viet-text/80 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] overflow-hidden shadow-2xl flex flex-col border border-white/20"
            >
              <div className="p-8 bg-slate-50 border-b border-viet-border flex justify-between items-center shrink-0">
                <div>
                   <span className="text-[10px] font-black text-viet-green uppercase tracking-widest bg-viet-green/10 px-3 py-1 rounded-full mb-2 inline-block">{t('my_class.quiz.badge')}</span>
                   <h3 className="text-2xl font-black text-viet-text uppercase tracking-tight">{activeQuiz.content}</h3>
                </div>
                <button onClick={() => setActiveQuiz(null)} className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-viet-text-light hover:text-red-500 transition-all font-black text-xl shadow-sm">×</button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                {activeQuiz.questions.map((q, qIdx) => (
                  <React.Fragment key={qIdx}>
                    {(qIdx === 0
                      || activeQuiz.questions[qIdx - 1].part !== q.part
                      || activeQuiz.questions[qIdx - 1].type !== q.type) && (
                      <div className="flex items-center gap-4 pt-8 pb-4">
                        <div className="h-px flex-1 bg-slate-200"></div>
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          {getQuestionSectionTitle(q)}
                        </h3>
                        <div className="h-px flex-1 bg-slate-200"></div>
                      </div>
                    )}
                    <div className="space-y-6">
                    <div className="flex gap-4">
                      <span className="shrink-0 w-10 h-10 bg-viet-green text-white rounded-2xl flex items-center justify-center font-black text-lg shadow-lg shadow-viet-green/20">
                        {qIdx + 1}
                      </span>
                      <p className="text-xl font-bold text-viet-text leading-relaxed pt-1">{q.question || q.content}</p>
                    </div>
                    
                    <div className="flex-1 pl-14 space-y-4">
                      {(q.type || 'multiple_choice') === 'multiple_choice' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(Array.isArray(q.options) ? q.options : (q.options ? Object.values(q.options) : [])).map((opt, oIdx) => (
                            <button 
                              key={oIdx}
                              onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })}
                              className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center gap-4 group ${
                                quizAnswers[qIdx] === oIdx 
                                ? 'border-viet-green bg-emerald-50 shadow-md shadow-viet-green/10' 
                                : 'border-slate-100 bg-white hover:border-slate-200'
                              }`}
                            >
                              <span className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center font-black text-xs transition-all ${
                                quizAnswers[qIdx] === oIdx 
                                ? 'bg-viet-green text-white' 
                                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                              }`}>
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className={`text-sm font-bold ${quizAnswers[qIdx] === oIdx ? 'text-viet-green' : 'text-viet-text'}`}>{opt}</span>
                            </button>
                          ))}
                        </div>
                      ) : (q.type === 'true_false') ? (
                        <div className="grid grid-cols-1 gap-3">
                          {Object.entries(q.options || {}).map(([key, opt]) => (
                            <div key={key} className="p-4 rounded-2xl border-2 border-slate-100 bg-white flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 flex-1">
                                <span className="w-8 h-8 shrink-0 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center font-black text-xs uppercase">{key}</span>
                                <span className="text-sm font-bold text-viet-text">{opt}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button 
                                  onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: { ...(quizAnswers[qIdx] || {}), [key]: true } })}
                                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${quizAnswers[qIdx]?.[key] === true ? 'bg-viet-green text-white shadow-md shadow-viet-green/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                >Đúng</button>
                                <button 
                                  onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: { ...(quizAnswers[qIdx] || {}), [key]: false } })}
                                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${quizAnswers[qIdx]?.[key] === false ? 'bg-red-500 text-white shadow-md shadow-red-500/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                                >Sai</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="relative group">
                          <textarea 
                            value={quizAnswers[qIdx] || ''}
                            onChange={(e) => setQuizAnswers({ ...quizAnswers, [qIdx]: e.target.value })}
                            placeholder={t('my_class.quiz.essay_placeholder')}
                            className="w-full min-h-[160px] p-5 bg-slate-50 border-2 border-slate-100 rounded-[32px] outline-none focus:border-blue-400 focus:bg-white transition-all text-sm font-medium resize-none shadow-inner"
                          />
                          <div className="absolute bottom-4 right-6 text-[10px] font-black text-slate-300 uppercase tracking-widest pointer-events-none">
                            {t('my_class.quiz.essay_badge')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  </React.Fragment>
                ))}
              </div>

              <div className="p-8 bg-slate-50 border-t border-viet-border flex items-center justify-between shrink-0">
                <div className="flex flex-col">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('my_class.quiz.progress')}</span>
                   <span className="text-sm font-black text-viet-text uppercase">{t('my_class.quiz.count_done', { done: getAnsweredQuestionCount(activeQuiz.questions), total: activeQuiz.questions.length })}</span>
                </div>
                <button 
                  onClick={handleSubmitQuiz}
                  disabled={isSubmittingQuiz || getAnsweredQuestionCount(activeQuiz.questions) < activeQuiz.questions.length}
                  className={`px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl ${
                    getAnsweredQuestionCount(activeQuiz.questions) < activeQuiz.questions.length
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-viet-green text-white hover:scale-[1.05] shadow-viet-green/20 active:scale-[0.98]'
                  }`}
                >
                  {isSubmittingQuiz ? t('my_class.quiz.submitting') : t('my_class.quiz.submit_btn')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyClass;
