import LoadingScreen from '@/components/common/LoadingScreen';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  CirclePlay,
  ClipboardList,
  Gamepad2,
  Layers,
  Plus,
  RefreshCcw,
  Save,
  Star,
  Trash2,
  Zap,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import MediaUploader from '@/components/admin/MediaUploader';
import { normalizeQuizGroups, validateJourneyLesson } from '@/utils/adminLessonData';
import { parseAdminMutationResponse } from '@/utils/adminApproval';
import { getJourneyQuizGroups, getJourneyStageOverview } from '@/utils/journeyLessonData';
import { getVideoEmbedUrl, isExternalEmbedVideo, normalizeHttpUrl } from '@/utils/videoLinks';
import { LESSON_LEVEL_XP } from '../../../shared/journeyRewards.js';

const QUIZ_LEVELS = [
  { id: 'level1', label: 'Vòng 1: Xem và hiểu', shortLabel: 'Vòng 1', icon: <Star className="w-4 h-4 text-amber-500 fill-amber-400 inline" /> },
  { id: 'level2', label: 'Vòng 2: Luyện tập nâng cao', shortLabel: 'Vòng 2', icon: <span className="inline-flex gap-0.5"><Star className="w-4 h-4 text-amber-500 fill-amber-400" /><Star className="w-4 h-4 text-amber-500 fill-amber-400" /></span> },
  { id: 'level3', label: 'Vòng 3: Ôn tập tổng hợp', shortLabel: 'Vòng 3', icon: <span className="inline-flex gap-0.5"><Star className="w-4 h-4 text-amber-500 fill-amber-400" /><Star className="w-4 h-4 text-amber-500 fill-amber-400" /><Star className="w-4 h-4 text-amber-500 fill-amber-400" /></span> },
];

const QUESTION_TYPE_LABELS = {
  'multiple-choice': 'Trắc nghiệm',
  'image-selection': 'Chọn hình ảnh',
  'fill-in-the-blank': 'Điền đáp án',
  'drag-drop': 'Sắp xếp',
  matching: 'Ghép cặp',
  'lab-task': 'Nhiệm vụ thực hành',
};

const DEFAULT_GAME = {
  type: 'quiz-rush',
  difficulty: 2,
  rewardXp: 150,
  rewardGem: 10,
  rewardItemId: 'item_basic_flask',
};

const normalizeLessonForEditor = (data) => ({
  ...data,
  quizzes: normalizeQuizGroups(data?.quizzes),
  game: {
    ...DEFAULT_GAME,
    ...(data?.game && !Array.isArray(data.game) && typeof data.game === 'object' ? data.game : {}),
  },
  introVideoUrl: typeof data?.introVideoUrl === 'string' ? data.introVideoUrl : '',
});

const getResponseData = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.error || 'Không thể tải chi tiết bài học.');
  return data;
};

const getItemLabel = (item) => typeof item === 'string'
  ? item
  : String(item?.label || item?.text || item?.name || item?.id || 'Mục chưa có tên');

const StudentQuestionPreview = ({ question, index }) => {
  const type = question?.type || 'multiple-choice';
  const prompt = question?.question || question?.content || question?.text || `Câu hỏi ${index + 1}`;
  const correctAnswer = question?.correctAnswer ?? question?.answer;
  const options = Array.isArray(question?.options) ? question.options : [];
  const images = Array.isArray(question?.images) ? question.images : [];
  const items = Array.isArray(question?.items) ? question.items : [];
  const correctOrder = Array.isArray(question?.correctOrder) ? question.correctOrder : [];

  return (
    <article className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.16em] text-emerald-600">Câu {index + 1}</span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
          {QUESTION_TYPE_LABELS[type] || type}
        </span>
      </div>
      <p className="mt-3 text-sm font-bold leading-6 text-viet-text">{prompt}</p>
      {question?.narrative && <p className="mt-2 text-xs leading-5 text-viet-text-light">{question.narrative}</p>}

      {type === 'multiple-choice' && options.length > 0 && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {options.map((option, optionIndex) => (
            <div key={optionIndex} className={`rounded-xl border px-3 py-2 text-xs font-medium ${correctAnswer === optionIndex ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-100 bg-slate-50 text-slate-600'}`}>
              <span className="mr-2 font-black">{String.fromCharCode(65 + optionIndex)}.</span>{getItemLabel(option)}
              {correctAnswer === optionIndex && <CheckCircle2 className="ml-2 inline" size={13} />}
            </div>
          ))}
        </div>
      )}

      {type === 'image-selection' && images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((image, imageIndex) => {
            const source = typeof image === 'string' ? image : image?.url || image?.src || '';
            return (
              <div key={`${source}-${imageIndex}`} className={`overflow-hidden rounded-xl border-2 bg-slate-50 ${correctAnswer === imageIndex ? 'border-emerald-400' : 'border-slate-100'}`}>
                {source ? <img src={source} alt={`Lựa chọn ${imageIndex + 1}`} className="aspect-square w-full object-contain p-2" /> : <div className="grid aspect-square place-items-center text-xs text-slate-400">Thiếu ảnh</div>}
                <div className={`px-2 py-1 text-center text-[10px] font-bold ${correctAnswer === imageIndex ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500'}`}>
                  Hình {imageIndex + 1}{correctAnswer === imageIndex ? ' · Đáp án đúng' : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {type === 'fill-in-the-blank' && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800">
          Đáp án: {String(correctAnswer || 'Chưa có')}
        </div>
      )}

      {type === 'drag-drop' && (
        <div className="mt-4 space-y-2">
          {correctOrder.map((itemId, orderIndex) => {
            const item = items.find((candidate) => String(candidate?.id) === String(itemId));
            return <div key={`${itemId}-${orderIndex}`} className="rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700"><strong className="mr-2 text-emerald-600">{orderIndex + 1}.</strong>{getItemLabel(item || itemId)}</div>;
          })}
        </div>
      )}

      {type === 'matching' && (
        <div className="mt-4 space-y-2">
          {(question.leftItems || []).map((leftItem, pairIndex) => {
            const targetId = correctOrder[pairIndex];
            const target = items.find((candidate) => String(candidate?.id) === String(targetId));
            return <div key={leftItem?.id || pairIndex} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700"><span>{getItemLabel(leftItem)}</span><span className="font-black text-emerald-500">→</span><span>{getItemLabel(target || targetId)}</span></div>;
          })}
        </div>
      )}

      {type === 'lab-task' && (
        <div className="mt-4 rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-medium leading-5 text-sky-800">
          Học sinh xác nhận đã hoàn thành nhiệm vụ thực hành này.
        </div>
      )}
    </article>
  );
};

const JourneyDetail = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [formErrors, setFormErrors] = useState([]);
  const [saveNotice, setSaveNotice] = useState('');
  const [failedVideoUrl, setFailedVideoUrl] = useState('');
  const [activeTab, setActiveTab] = useState('video');
  const [activeQuizLevel, setActiveQuizLevel] = useState('level1');

  const fetchLesson = useCallback(async (signal) => {
    setLoading(true);
    setLoadError('');
    setFormErrors([]);
    setSaveNotice('');
    try {
      const response = await fetch(`/api/lessons/${encodeURIComponent(lessonId)}`, { signal });
      const data = await getResponseData(response);
      if (!data || typeof data !== 'object' || !data.lessonId) {
        throw new Error('Dữ liệu bài học trả về không hợp lệ.');
      }
      setLesson(normalizeLessonForEditor(data));
      setHasChanges(false);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Lỗi tải chi tiết bài học:', err);
        setLoadError(err.message || 'Không thể tải chi tiết bài học.');
        setLesson(null);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => fetchLesson(controller.signal), 0);
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchLesson]);

  useEffect(() => {
    const warnBeforeUnload = (event) => {
      if (!hasChanges && !mediaUploading) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [hasChanges, mediaUploading]);

  const updateLesson = (updater) => {
    setLesson((current) => typeof updater === 'function' ? updater(current) : updater);
    setHasChanges(true);
    setFormErrors([]);
    setSaveNotice('');
  };

  const confirmDiscard = () => (!hasChanges && !mediaUploading) || window.confirm('Bạn có thay đổi chưa lưu hoặc tệp đang tải lên. Bạn có chắc muốn rời khỏi trang?');

  const handleBack = () => {
    if (saving || !confirmDiscard()) return;
    navigate('/admin/journey');
  };

  const updateQuestion = (questionIndex, updater) => {
    updateLesson((current) => {
      const currentQuestions = current.quizzes[activeQuizLevel] || [];
      const nextQuestions = currentQuestions.map((question, index) => (
        index === questionIndex ? updater(question) : question
      ));
      return {
        ...current,
        quizzes: { ...current.quizzes, [activeQuizLevel]: nextQuestions },
      };
    });
  };

  const addQuestion = () => {
    const currentCount = lesson.quizzes[activeQuizLevel]?.length || 0;
    if (currentCount >= 10) return;
    const newQuestion = {
      id: `q_admin_${Date.now()}_${currentCount + 1}`,
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      answer: 0,
    };
    updateLesson((current) => ({
      ...current,
      quizzes: {
        ...current.quizzes,
        [activeQuizLevel]: [...(current.quizzes[activeQuizLevel] || []), newQuestion],
      },
    }));
  };

  const removeQuestion = (questionIndex) => {
    if (!window.confirm(`Xóa câu hỏi ${questionIndex + 1} khỏi ${QUIZ_LEVELS.find((level) => level.id === activeQuizLevel)?.shortLabel.toLowerCase()}?`)) return;
    updateLesson((current) => ({
      ...current,
      quizzes: {
        ...current.quizzes,
        [activeQuizLevel]: current.quizzes[activeQuizLevel].filter((_, index) => index !== questionIndex),
      },
    }));
  };

  const handleSave = async () => {
    if (!lesson || !hasChanges || saving || mediaUploading) return;

    const normalizedVideoUrl = lesson.introVideoUrl.trim() ? normalizeHttpUrl(lesson.introVideoUrl) : '';
    const errors = validateJourneyLesson(lesson);
    if (lesson.introVideoUrl.trim() && !normalizedVideoUrl) {
      errors.unshift('Đường dẫn video phải là URL HTTP hoặc HTTPS hợp lệ.');
    }
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    setFormErrors([]);
    setSaveNotice('');
    try {
      const payload = { ...lesson, introVideoUrl: normalizedVideoUrl };
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/lessons/${encodeURIComponent(lessonId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        // Send the complete object because the current API mapper defaults omitted JSON fields
        // to empty arrays/objects, which would otherwise erase lesson content.
        body: JSON.stringify(payload),
      });
      const result = await parseAdminMutationResponse(response);
      if (!result.pendingApproval) {
        setLesson(normalizeLessonForEditor(result.data));
        setSaveNotice(result.message || 'Đã cập nhật chi tiết hành trình thành công.');
      } else {
        setLesson(payload);
        setSaveNotice(result.message || 'Thay đổi đã được gửi và đang chờ quản trị viên còn lại xác nhận.');
      }
      setHasChanges(false);
    } catch (err) {
      console.error('Lỗi lưu chi tiết hành trình:', err);
      setFormErrors([err.message || 'Không thể lưu dữ liệu. Vui lòng thử lại.']);
    } finally {
      setSaving(false);
    }
  };

  const studentQuizGroups = useMemo(() => getJourneyQuizGroups(lesson), [lesson]);
  const stageOverview = useMemo(() => getJourneyStageOverview(lesson), [lesson]);
  const quizTotal = stageOverview.totalQuestions;
  const customVideoUrl = lesson?.introVideoUrl?.trim() || '';
  const videoUrl = stageOverview.videoUrl;
  const isFallbackVideo = Boolean(videoUrl && !customVideoUrl);
  const normalizedPreviewUrl = videoUrl ? normalizeHttpUrl(videoUrl) : '';
  const canPreviewVideo = Boolean(normalizedPreviewUrl);
  const isEmbedVideo = canPreviewVideo && isExternalEmbedVideo(normalizedPreviewUrl);
  const videoPlaybackError = Boolean(normalizedPreviewUrl && failedVideoUrl === normalizedPreviewUrl);

  if (loading) {
    return <LoadingScreen inline label="Đang tải chi tiết hành trình…" />;
  }

  if (loadError || !lesson) {
    return (
      <div className="mx-auto max-w-2xl p-4 sm:p-8">
        <div className="rounded-[32px] border border-red-200 bg-white px-6 py-14 text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={40} />
          <h1 className="text-xl font-bold text-viet-text">Không thể mở chi tiết hành trình</h1>
          <p className="mt-2 text-sm text-viet-text-light">{loadError || 'Không tìm thấy bài học.'}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => navigate('/admin/journey')} className="rounded-xl border border-viet-border px-5 py-2.5 text-sm font-bold text-viet-text">Quay lại</button>
            <button type="button" onClick={() => fetchLesson()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-viet-green px-5 py-2.5 text-sm font-bold text-white"><RefreshCcw size={16} /> Thử lại</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 pb-28 sm:p-6 lg:p-8">
      <header className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="min-w-0">
          <button type="button" onClick={handleBack} className="mb-2 flex items-center gap-1 text-xs font-bold text-viet-green hover:underline">
            <ChevronLeft size={14} /> Quay lại Quản lý hành trình
          </button>
          <h1 className="flex flex-wrap items-center gap-3 text-3xl font-bold tracking-tight text-viet-text">
            Thiết kế <span className="text-viet-green">Chặng đường</span> <Zap className="text-viet-green" size={28} aria-hidden="true" />
          </h1>
          <p className="mt-1 font-medium italic text-viet-text-light">Thông tin học sinh nhìn thấy tại chặng: <span className="font-bold text-viet-green">{stageOverview.title}</span></p>
        </div>

        <button type="button" onClick={handleSave} disabled={saving || mediaUploading || !hasChanges} title={mediaUploading ? 'Vui lòng đợi tải video hoàn tất trước khi lưu.' : undefined} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-viet-green px-8 py-3 text-sm font-bold text-white shadow-lg shadow-viet-green/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none">
          {saving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? 'Đang lưu...' : 'Lưu toàn bộ thay đổi'}
        </button>
      </header>

      {formErrors.length > 0 && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          <div className="flex items-center gap-2 font-bold"><AlertCircle size={18} /> Không thể lưu thay đổi</div>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            {formErrors.slice(0, 8).map((error) => <li key={error}>{error}</li>)}
          </ul>
          {formErrors.length > 8 && <p className="mt-2 font-medium">Và {formErrors.length - 8} lỗi khác.</p>}
        </div>
      )}

      {saveNotice && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700" role="status">
          <CheckCircle2 size={18} /> {saveNotice}
        </div>
      )}

      <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Tóm tắt nội dung học sinh nhìn thấy">
        <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-sky-700"><CirclePlay size={15} /> Mở đầu</div>
          <p className="mt-2 text-sm font-bold text-sky-950">{stageOverview.videoUrl ? 'Có video bài học' : 'Briefing không video'}</p>
          <p className="mt-1 text-[10px] font-medium text-sky-700/70">{isFallbackVideo ? 'Đang dùng video từ học liệu' : stageOverview.videoUrl ? 'Đang dùng video ưu tiên' : 'Học sinh vẫn có thể vào câu hỏi'}</p>
        </div>
        {QUIZ_LEVELS.map((level) => (
          <div key={level.id} className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-700"><Star size={14} fill="currentColor" /> {level.shortLabel}</div>
            <p className="mt-2 text-2xl font-black text-amber-950">{stageOverview.questionCounts[level.id]}</p>
            <p className="text-[10px] font-medium text-amber-700/70">câu học sinh thực hiện</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
        <aside className="grid grid-cols-3 gap-2 lg:block lg:space-y-2" aria-label="Các nhóm thiết lập">
          {[
            { id: 'video', label: 'Video bài giảng', mobileLabel: 'Video', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
            { id: 'quiz', label: 'Câu hỏi 3 vòng', mobileLabel: 'Câu hỏi', icon: ClipboardList, color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { id: 'game', label: 'Tiến độ & Phần thưởng', mobileLabel: 'Phần thưởng', icon: Gamepad2, color: 'text-rose-600', bg: 'bg-rose-50' },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={activeTab === tab.id}
              className={`flex min-w-0 flex-col items-center justify-center gap-2 rounded-2xl border-2 px-2 py-3 text-center transition-all lg:w-full lg:flex-row lg:justify-start lg:px-4 lg:py-4 ${
                activeTab === tab.id ? `${tab.bg} border-current ${tab.color} font-bold shadow-sm` : 'border-transparent bg-white text-slate-400 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={20} />
              <span className="text-xs sm:hidden">{tab.mobileLabel}</span>
              <span className="hidden text-sm sm:inline">{tab.label}</span>
            </button>
          ))}
        </aside>

        <main className="min-w-0 space-y-6 lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'video' && (
              <motion.section key="video" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="rounded-[24px] border border-viet-border bg-white p-5 shadow-sm sm:rounded-[32px] sm:p-8">
                <div className="mb-7">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-viet-text"><BookOpen className="text-amber-500" /> Video bài giảng</h2>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-viet-text-light">Đúng nguồn video học sinh sẽ xem trước Vòng 1</p>
                </div>

                <div className="space-y-5 rounded-2xl border border-slate-100 bg-slate-50/30 p-4 sm:p-6">
                  <label className="block space-y-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Link video ưu tiên
                    <input type="url" value={lesson.introVideoUrl} onChange={(event) => {
                      setFailedVideoUrl('');
                      updateLesson((current) => ({ ...current, introVideoUrl: event.target.value }));
                    }} placeholder="https://www.youtube.com/watch?v=... hoặc https://.../video.mp4" className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm font-normal normal-case tracking-normal outline-none focus:border-amber-400" />
                  </label>

                  {isFallbackVideo && (
                    <div className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-medium leading-5 text-sky-800">
                      Chưa đặt video ưu tiên. Học sinh hiện đang xem video đầu tiên trong học liệu của bài này.
                    </div>
                  )}

                  {videoUrl && !canPreviewVideo && <p className="text-xs font-bold text-red-600" role="alert">URL chưa hợp lệ. Vui lòng dùng đường dẫn bắt đầu bằng http:// hoặc https://.</p>}

                  {canPreviewVideo && !videoPlaybackError ? (
                    <div className="aspect-video overflow-hidden rounded-xl border border-slate-100 bg-black shadow-lg">
                      {isEmbedVideo ? (
                        <iframe src={getVideoEmbedUrl(normalizedPreviewUrl)} title={`Video bài giảng ${lesson.title}`} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                      ) : (
                        <video src={normalizedPreviewUrl} className="h-full w-full object-contain" controls onError={() => setFailedVideoUrl(normalizedPreviewUrl)} aria-label={`Video bài giảng ${lesson.title}`} />
                      )}
                    </div>
                  ) : canPreviewVideo && videoPlaybackError ? (
                    <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-red-200 bg-red-50 px-6 text-center text-red-600">
                      <AlertCircle size={36} />
                      <p className="text-sm font-bold">Không thể phát thử video từ URL này.</p>
                    </div>
                  ) : !videoUrl ? (
                    <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 text-slate-400">
                      <Layers size={48} className="opacity-20" />
                      <p className="text-xs font-medium">Chưa có video được thiết lập</p>
                    </div>
                  ) : null}

                  {customVideoUrl && (
                    <button type="button" onClick={() => updateLesson((current) => ({ ...current, introVideoUrl: '' }))} className="text-xs font-bold text-red-600 hover:underline">Bỏ video ưu tiên và dùng video học liệu</button>
                  )}
                </div>

                <div className="mt-6 space-y-3 border-t border-viet-border pt-6">
                  <h3 className="text-sm font-bold text-viet-text">Hoặc tải video mới lên Cloudinary</h3>
                  <MediaUploader type="video" maxSizeMB={10} disabled={saving} onUploadingChange={setMediaUploading} onUploadSuccess={(url) => updateLesson((current) => ({ ...current, introVideoUrl: url }))} />
                </div>
              </motion.section>
            )}

            {activeTab === 'quiz' && (
              <motion.section key="quiz" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="rounded-[24px] border border-viet-border bg-white p-5 shadow-sm sm:rounded-[32px] sm:p-8">
                <div className="mb-7">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-viet-text"><ClipboardList className="text-emerald-500" /> Hệ thống câu hỏi 3 vòng</h2>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-viet-text-light">Tổng hợp đúng từ câu hỏi tùy chỉnh, ngân hàng trò chơi và thử thách</p>
                </div>

                <div className="grid grid-cols-1 gap-1 rounded-2xl bg-slate-100 p-1.5 sm:grid-cols-3" aria-label="Chọn cấp độ câu hỏi">
                  {QUIZ_LEVELS.map((level) => (
                    <button type="button" key={level.id} onClick={() => setActiveQuizLevel(level.id)} aria-pressed={activeQuizLevel === level.id} className={`flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all ${activeQuizLevel === level.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      <span aria-hidden="true">{level.icon}</span> {level.label}
                    </button>
                  ))}
                </div>

                <div className="my-6 rounded-[24px] border border-emerald-100 bg-emerald-50/40 p-4 sm:p-6">
                  <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                    <div>
                      <h3 className="text-sm font-bold text-emerald-900">Nội dung học sinh thực tế nhìn thấy</h3>
                      <p className="mt-1 text-xs font-medium text-emerald-700/70">{studentQuizGroups[activeQuizLevel].length} câu trong {QUIZ_LEVELS.find((level) => level.id === activeQuizLevel)?.shortLabel.toLowerCase()}.</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 shadow-sm">Đồng bộ tự động</span>
                  </div>
                  <div className="space-y-3">
                    {studentQuizGroups[activeQuizLevel].map((question, questionIndex) => (
                      <StudentQuestionPreview key={`${question.id || question.type || 'question'}-${questionIndex}`} question={question} index={questionIndex} />
                    ))}
                    {studentQuizGroups[activeQuizLevel].length === 0 && (
                      <div className="rounded-2xl border border-dashed border-emerald-200 bg-white py-10 text-center text-sm font-medium italic text-emerald-700/60">Học sinh chưa có câu hỏi hợp lệ trong vòng này.</div>
                    )}
                  </div>
                </div>

                <div className="my-6 flex flex-col justify-between gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-sm font-bold text-slate-700">Câu hỏi tùy chỉnh lưu trực tiếp ({lesson.quizzes[activeQuizLevel]?.length || 0}/10)</h3>
                    <p className="mt-1 text-xs font-medium text-slate-400">Các câu bên trên còn có thể đến từ ngân hàng trò chơi và thử thách của bài học.</p>
                  </div>
                  <button type="button" onClick={addQuestion} disabled={(lesson.quizzes[activeQuizLevel]?.length || 0) >= 10} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500">
                    <Plus size={16} /> Thêm câu hỏi
                  </button>
                </div>

                <div className="space-y-6">
                  {(lesson.quizzes[activeQuizLevel] || []).map((question, questionIndex) => (
                    <article key={question.id || `${activeQuizLevel}-${questionIndex}`} className="space-y-4 rounded-[24px] border border-slate-100 bg-slate-50/50 p-4 sm:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-black uppercase text-emerald-600">Câu hỏi {questionIndex + 1}</span>
                        <button type="button" onClick={() => removeQuestion(questionIndex)} className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500" aria-label={`Xóa câu hỏi ${questionIndex + 1}`}><Trash2 size={16} /></button>
                      </div>

                      <label className="block text-xs font-bold text-slate-600">
                        Nội dung câu hỏi
                        <input type="text" value={question.question} onChange={(event) => updateQuestion(questionIndex, (current) => ({ ...current, question: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold outline-none focus:border-emerald-400" maxLength={1000} />
                      </label>

                      <fieldset>
                        <legend className="mb-2 text-xs font-bold text-slate-600">Phương án trả lời — chọn nút tròn để đánh dấu đáp án đúng</legend>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {(question.options || []).map((option, optionIndex) => (
                            <div key={optionIndex} className={`flex items-center gap-3 rounded-xl border bg-white px-3 transition-colors ${question.answer === optionIndex ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200'}`}>
                              <input
                                type="radio"
                                name={`correct-answer-${activeQuizLevel}-${question.id || questionIndex}`}
                                checked={question.answer === optionIndex}
                                onChange={() => updateQuestion(questionIndex, (current) => ({ ...current, answer: optionIndex, correctAnswer: optionIndex }))}
                                className="h-4 w-4 shrink-0 accent-emerald-500"
                                aria-label={`Đặt phương án ${optionIndex + 1} làm đáp án đúng`}
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(event) => updateQuestion(questionIndex, (current) => {
                                  const options = [...(current.options || [])];
                                  options[optionIndex] = event.target.value;
                                  return { ...current, options };
                                })}
                                className="min-w-0 flex-1 bg-transparent py-2 text-xs font-medium outline-none"
                                aria-label={`Phương án ${optionIndex + 1} của câu ${questionIndex + 1}`}
                                maxLength={500}
                              />
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </article>
                  ))}

                  {(!lesson.quizzes[activeQuizLevel] || lesson.quizzes[activeQuizLevel].length === 0) && (
                    <div className="rounded-[24px] border-2 border-dashed border-slate-100 py-12 text-center font-medium italic text-slate-400">Không có câu hỏi tùy chỉnh lưu trực tiếp trong vòng này.</div>
                  )}
                </div>
              </motion.section>
            )}

            {activeTab === 'game' && (
              <motion.section key="game" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="rounded-[24px] border border-viet-border bg-white p-5 shadow-sm sm:rounded-[32px] sm:p-8">
                <div className="mb-7">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-viet-text"><Gamepad2 className="text-rose-500" /> Tiến độ & Phần thưởng</h2>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wider text-viet-text-light">Đúng cơ chế học sinh nhận sau mỗi vòng</p>
                </div>

                <div className="space-y-8 rounded-[28px] border border-rose-100 bg-rose-50 p-5 sm:rounded-[40px] sm:p-8">
                  <h3 className="flex items-center gap-2 font-bold text-rose-700"><Zap size={20} /> Phần thưởng lần hoàn thành đầu tiên</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {[
                      { label: 'Vòng 1', xp: LESSON_LEVEL_XP.level1, note: 'Xem video và câu hỏi nền tảng' },
                      { label: 'Vòng 2', xp: LESSON_LEVEL_XP.level2, note: 'Luyện tập nâng cao' },
                      { label: 'Vòng 3', xp: LESSON_LEVEL_XP.level3, note: 'Ôn tập và mở chặng tiếp theo' },
                    ].map((reward) => (
                      <div key={reward.label} className="rounded-3xl border border-rose-100 bg-white p-5 text-center shadow-sm">
                        <span className="block text-xs font-black uppercase tracking-widest text-slate-500">{reward.label}</span>
                        <div className="mt-3 text-3xl font-black text-rose-600">+{reward.xp} XP</div>
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700"><Star size={13} fill="currentColor" /> +1 sao</div>
                        <p className="mt-3 text-xs font-medium leading-5 text-slate-500">{reward.note}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 rounded-3xl border border-rose-200 bg-white/60 p-5 sm:gap-6 sm:p-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-200 sm:h-16 sm:w-16" aria-hidden="true">
                      <Star size={28} className="fill-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rose-900">Cách học sinh hoàn thành chặng</h4>
                      <p className="mt-1 text-xs font-medium leading-5 text-rose-700/70">Mỗi vòng cộng đúng 1 sao. Vòng 3 mở tranh kiến thức và chặng tiếp theo; XP chỉ cộng ở lần hoàn thành đầu tiên và có thể kèm thưởng chuỗi học tập.</p>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-2xl border border-viet-border bg-white/90 px-4 py-3 shadow-2xl backdrop-blur-xl sm:bottom-8 sm:right-8 sm:rounded-[28px] sm:px-6 sm:py-4" role="status">
        <div className="flex h-8 min-w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-100 px-2 text-[10px] font-bold text-emerald-700" aria-label={`${quizTotal} câu hỏi`}>{quizTotal}</div>
        <div className="h-8 w-px bg-slate-200" />
        <div className={`flex items-center gap-2 ${hasChanges ? 'text-amber-600' : 'text-viet-green'}`}>
          {hasChanges ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span className="text-xs font-bold">{hasChanges ? 'Chưa lưu' : 'Đã đồng bộ'}</span>
        </div>
      </div>
    </div>
  );
};

export default JourneyDetail;
