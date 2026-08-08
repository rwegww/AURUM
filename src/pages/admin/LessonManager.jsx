import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, BookOpen, CheckCircle2, Pencil, Plus, RefreshCcw, Save, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import MediaUploader from '@/components/admin/MediaUploader';
import { modulesToMarkdown } from '@/utils/adminLessonData';
import { parseAdminMutationResponse } from '@/utils/adminApproval';
import { isExternalEmbedVideo, normalizeHttpUrl } from '@/utils/videoLinks';

const GRADES = [6, 7, 8, 9, 10, 11, 12];
const PROGRAM_CODES = { ketnoi: 'kntt', canhdieu: 'cd', chantroi: 'ctst' };

const sortLessons = (lessons) => [...lessons].sort((first, second) => {
  const firstOrder = Number.isFinite(Number(first?.order)) ? Number(first.order) : Number.MAX_SAFE_INTEGER;
  const secondOrder = Number.isFinite(Number(second?.order)) ? Number(second.order) : Number.MAX_SAFE_INTEGER;
  return firstOrder - secondOrder || String(first?.title || '').localeCompare(String(second?.title || ''), 'vi');
});

const createFormDefaults = (lessons, classId = 8, programId = 'ketnoi') => {
  const relatedLessons = lessons.filter((lesson) => (
    Number(lesson.classId) === Number(classId) && (lesson.programId || 'ketnoi') === programId
  ));
  const nextOrder = relatedLessons.reduce((highest, lesson) => {
    const order = Number(lesson.order);
    return Number.isInteger(order) && order > highest ? order : highest;
  }, 0) + 1;
  const baseId = `hoa${classId}_${PROGRAM_CODES[programId] || programId}_bai${nextOrder}`;
  const existingIds = new Set(lessons.map((lesson) => String(lesson.lessonId || lesson.id)));
  let lessonId = baseId;
  let suffix = 2;
  while (existingIds.has(lessonId)) {
    lessonId = `${baseId}_${suffix}`;
    suffix += 1;
  }

  return {
    lessonId,
    title: '',
    description: '',
    content: '',
    videoUrl: '',
    classId,
    chapter: 'Chương 1',
    programId,
    order: nextOrder,
  };
};

const getResponseData = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.error || fallbackMessage);
  return data;
};

const LessonManager = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionNotice, setActionNotice] = useState('');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(() => createFormDefaults([], 8));
  const [formDirty, setFormDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [deletingId, setDeletingId] = useState('');

  const fetchLessons = useCallback(async (signal) => {
    setLoading(true);
    setLoadError('');
    try {
      const query = selectedGrade ? `?classId=${selectedGrade}` : '';
      const response = await fetch(`/api/lessons${query}`, { signal });
      const data = await getResponseData(response, 'Không thể tải danh sách bài học.');
      if (!Array.isArray(data)) throw new Error('Dữ liệu bài học trả về không hợp lệ.');
      setLessons(sortLessons(data));
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Lỗi tải bài học:', err);
        setLoadError(err.message || 'Không thể tải danh sách bài học.');
        setLessons([]);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [selectedGrade]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => fetchLessons(controller.signal), 0);
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchLessons]);

  useEffect(() => {
    const warnBeforeUnload = (event) => {
      if (!formDirty && !mediaUploading) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [formDirty, mediaUploading]);

  const modalOpen = Boolean(editingLesson || isCreating);
  const modalTitleId = 'lesson-editor-title';

  const resetEditor = () => {
    setEditingLesson(null);
    setIsCreating(false);
    setFormDirty(false);
    setActionError('');
  };

  const closeEditor = () => {
    if (saving) return;
    if ((formDirty || mediaUploading) && !window.confirm('Bạn có thay đổi chưa lưu hoặc tệp đang tải lên. Bạn có chắc muốn đóng?')) return;
    resetEditor();
  };

  useEffect(() => {
    if (!modalOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') closeEditor();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  });

  const updateForm = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setFormDirty(true);
    setActionError('');
  };

  const handleEdit = async (lessonId) => {
    setEditingId(lessonId);
    setActionError('');
    try {
      const response = await fetch(`/api/lessons/${encodeURIComponent(lessonId)}`);
      const data = await getResponseData(response, 'Không thể tải chi tiết bài học.');
      setEditingLesson(data);
      setFormData({
        lessonId: data.lessonId || data.id || '',
        title: data.title || '',
        description: data.description || '',
        content: modulesToMarkdown(data.theoryModules),
        videoUrl: data.videoModules?.find((module) => module?.url)?.url || '',
        classId: Number(data.classId) || 8,
        chapter: data.chapter || '',
        programId: data.programId || 'ketnoi',
        order: Number.isInteger(Number(data.order)) && Number(data.order) > 0 ? Number(data.order) : 1,
      });
      setFormDirty(false);
      setIsCreating(false);
    } catch (err) {
      console.error('Lỗi tải chi tiết bài học:', err);
      setActionError(err.message || 'Không thể tải chi tiết bài học.');
    } finally {
      setEditingId('');
    }
  };

  const handleCreateNew = () => {
    const classId = selectedGrade || 8;
    setEditingLesson(null);
    setIsCreating(true);
    setFormData(createFormDefaults(lessons, classId));
    setFormDirty(false);
    setActionError('');
  };

  const handleDelete = async (lessonId, title) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài học “${title || lessonId}”? Thao tác này có thể ảnh hưởng tiến độ học sinh.`)) return;

    setDeletingId(lessonId);
    setActionError('');
    setActionNotice('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/lessons/${encodeURIComponent(lessonId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token || ''}` },
      });
      const result = await parseAdminMutationResponse(response);
      setActionNotice(result.message);
      if (!result.pendingApproval) {
        setLessons((current) => current.filter((lesson) => lesson.lessonId !== lessonId));
      }
    } catch (err) {
      console.error('Lỗi xóa bài học:', err);
      setActionError(err.message || 'Không thể xóa bài học.');
    } finally {
      setDeletingId('');
    }
  };

  const validateForm = () => {
    if (!formData.lessonId.trim()) return 'Vui lòng nhập mã bài học.';
    if (!/^[a-z0-9_-]+$/i.test(formData.lessonId.trim())) {
      return 'Mã bài học chỉ được chứa chữ không dấu, số, dấu gạch ngang hoặc gạch dưới.';
    }
    if (isCreating && lessons.some((lesson) => String(lesson.lessonId || lesson.id) === formData.lessonId.trim())) {
      return 'Mã bài học đã tồn tại trong danh sách hiện tại.';
    }
    if (!formData.title.trim()) return 'Vui lòng nhập tiêu đề bài học.';
    if (!formData.chapter.trim()) return 'Vui lòng nhập chương hoặc phần.';
    if (!Number.isInteger(Number(formData.order)) || Number(formData.order) < 1) {
      return 'Thứ tự bài học phải là số nguyên lớn hơn 0.';
    }
    if (formData.videoUrl.trim() && !normalizeHttpUrl(formData.videoUrl)) {
      return 'Đường dẫn video phải là URL HTTP hoặc HTTPS hợp lệ.';
    }
    return '';
  };

  const buildVideoModules = (normalizedVideoUrl) => {
    const existingModules = Array.isArray(editingLesson?.videoModules) ? editingLesson.videoModules : [];
    const primaryIndex = existingModules.findIndex((module) => module?.url);
    const originalUrl = primaryIndex >= 0 ? existingModules[primaryIndex].url : '';
    if (!isCreating && formData.videoUrl.trim() === String(originalUrl || '').trim()) return existingModules;

    if (!normalizedVideoUrl) {
      return primaryIndex >= 0 ? existingModules.filter((_, index) => index !== primaryIndex) : existingModules;
    }

    const updatedModule = {
      ...(primaryIndex >= 0 ? existingModules[primaryIndex] : {}),
      type: isExternalEmbedVideo(normalizedVideoUrl) ? 'youtube' : 'video',
      url: normalizedVideoUrl,
      title: formData.title.trim(),
    };
    if (primaryIndex < 0) return [updatedModule, ...existingModules];
    return existingModules.map((module, index) => index === primaryIndex ? updatedModule : module);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (saving || mediaUploading) return;

    const validationError = validateForm();
    if (validationError) {
      setActionError(validationError);
      return;
    }

    setSaving(true);
    setActionError('');
    setActionNotice('');
    try {
      const normalizedVideoUrl = formData.videoUrl.trim() ? normalizeHttpUrl(formData.videoUrl) : '';
      const originalMarkdown = modulesToMarkdown(editingLesson?.theoryModules);
      const theoryModules = !isCreating && formData.content === originalMarkdown
        ? (Array.isArray(editingLesson?.theoryModules) ? editingLesson.theoryModules : [])
        : (formData.content.trim() ? [{ type: 'markdown', content: { text: formData.content } }] : []);
      const payload = {
        ...(editingLesson || {}),
        lessonId: formData.lessonId.trim(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        classId: Number(formData.classId),
        gradeLevelId: Number(formData.classId),
        chapter: formData.chapter.trim(),
        programId: formData.programId,
        order: Number(formData.order),
        theoryModules,
        videoModules: buildVideoModules(normalizedVideoUrl),
      };
      const token = localStorage.getItem('token');
      const method = isCreating ? 'POST' : 'PUT';
      const targetId = editingLesson?.lessonId || formData.lessonId.trim();
      const url = isCreating
        ? '/api/admin/lessons'
        : `/api/admin/lessons/${encodeURIComponent(targetId)}`;
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await parseAdminMutationResponse(response);
      setActionNotice(result.message);

      if (!result.pendingApproval) {
        const savedLesson = result.data;
        setLessons((current) => {
          const withoutOldVersion = current.filter((lesson) => lesson.lessonId !== targetId);
          if (selectedGrade && Number(savedLesson.classId) !== Number(selectedGrade)) {
            return withoutOldVersion;
          }
          return sortLessons([...withoutOldVersion, savedLesson]);
        });
      }
      resetEditor();
    } catch (err) {
      console.error('Lỗi lưu bài học:', err);
      setActionError(err.message || 'Không thể lưu bài học.');
    } finally {
      setSaving(false);
    }
  };

  const emptyMessage = useMemo(() => (
    selectedGrade ? `Chưa có bài học nào cho lớp ${selectedGrade}.` : 'Chưa có bài học nào trong hệ thống.'
  ), [selectedGrade]);

  return (
    <div className="p-4 pb-12 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-6 lg:mb-12 lg:flex-row lg:items-center">
          <div>
            <Link to="/admin" className="mb-2 block text-xs font-bold text-viet-green hover:underline">← Quay lại Bảng điều khiển</Link>
            <h1 className="text-3xl font-bold tracking-tight text-viet-text">Quản lý <span className="text-viet-green">Học liệu</span></h1>
            <p className="mt-1 font-medium italic text-viet-text-light">Tùy chỉnh nội dung bài học, lý thuyết và video.</p>
          </div>

          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleCreateNew}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-viet-green px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-viet-green/20 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-viet-green"
            >
              <Plus size={16} aria-hidden="true" /> Thêm bài học
            </button>
            <div className="flex max-w-full gap-1 overflow-x-auto no-scrollbar rounded-2xl border border-viet-border bg-white p-1.5 shadow-sm" aria-label="Lọc theo khối lớp">
              {[null, ...GRADES].map((grade) => (
                <button
                  type="button"
                  key={grade ?? 'all'}
                  onClick={() => setSelectedGrade(grade)}
                  aria-pressed={selectedGrade === grade}
                  className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition-all sm:px-4 ${
                    selectedGrade === grade ? 'bg-viet-green text-white shadow-md' : 'text-viet-text-light hover:bg-gray-50'
                  }`}
                >
                  {grade ? `Lớp ${grade}` : 'Tất cả'}
                </button>
              ))}
            </div>
          </div>
        </header>

        {actionError && !modalOpen && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700" role="alert">
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <span className="flex-1">{actionError}</span>
            <button type="button" onClick={() => setActionError('')} aria-label="Đóng thông báo lỗi"><X size={16} /></button>
          </div>
        )}

        {actionNotice && !modalOpen && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700" role="status" aria-live="polite">
            <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
            <span className="flex-1">{actionNotice}</span>
            <button type="button" onClick={() => setActionNotice('')} aria-label="Đóng thông báo"><X size={16} /></button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-6 opacity-60 md:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Đang tải danh sách bài học">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="h-[200px] animate-pulse rounded-[32px] border border-viet-border bg-white" />
            ))}
          </div>
        ) : loadError ? (
          <div className="rounded-[32px] border border-red-200 bg-white px-6 py-14 text-center">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={36} />
            <p className="font-bold text-viet-text">Không thể tải danh sách bài học</p>
            <p className="mt-2 text-sm text-viet-text-light">{loadError}</p>
            <button type="button" onClick={() => fetchLessons()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-viet-green px-5 py-2.5 text-sm font-bold text-white">
              <RefreshCcw size={16} /> Thử lại
            </button>
          </div>
        ) : lessons.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-viet-border bg-white px-6 py-16 text-center">
            <BookOpen className="mx-auto mb-4 text-slate-300" size={42} />
            <p className="font-bold text-viet-text">{emptyMessage}</p>
            <button type="button" onClick={handleCreateNew} className="mt-4 text-sm font-bold text-viet-green hover:underline">Tạo bài học đầu tiên →</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson, index) => {
              const id = lesson.lessonId || lesson.id;
              return (
                <motion.article
                  key={id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(index * 0.03, 0.3) }}
                  className="group rounded-[32px] border border-viet-border bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <span className="rounded-md bg-viet-green/10 px-2 py-1 text-[10px] font-black uppercase text-viet-green">Lớp {lesson.classId}</span>
                    <div className="flex gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleEdit(id)}
                        disabled={Boolean(editingId || deletingId)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100 disabled:opacity-50"
                        aria-label={`Chỉnh sửa ${lesson.title || id}`}
                      >
                        {editingId === id ? <RefreshCcw className="animate-spin" size={16} /> : <Pencil size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(id, lesson.title)}
                        disabled={Boolean(editingId || deletingId)}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                        aria-label={`Xóa ${lesson.title || id}`}
                      >
                        {deletingId === id ? <RefreshCcw className="animate-spin" size={16} /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </div>
                  <h2 className="mb-2 line-clamp-2 text-lg font-bold text-viet-text">{lesson.title || 'Bài học chưa có tiêu đề'}</h2>
                  <p className="mb-4 line-clamp-2 min-h-8 text-xs font-medium text-viet-text-light">{lesson.description || 'Chưa có mô tả.'}</p>
                  <div className="flex items-center justify-between gap-3 border-t border-viet-border pt-4">
                    <span className="min-w-0 truncate text-[10px] font-bold uppercase tracking-wider text-viet-text-light">{lesson.chapter || 'Chưa phân chương'}</span>
                    <span className="shrink-0 text-[10px] font-black uppercase text-viet-text opacity-40">#{lesson.order || '—'} · {id}</span>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-4"
            >
              <motion.form
                onSubmit={handleSave}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby={modalTitleId}
                className="flex max-h-[96vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-[40px]"
              >
                <div className="flex items-start justify-between gap-4 border-b border-viet-border bg-viet-bg/30 p-5 sm:p-8">
                  <div>
                    <h2 id={modalTitleId} className="text-xl font-bold text-viet-text sm:text-2xl">{isCreating ? 'Thêm bài học mới' : 'Chỉnh sửa bài học'}</h2>
                    <p className="mt-1 text-sm font-medium text-viet-text-light">{isCreating ? 'Nhập thông tin cho học liệu mới' : editingLesson?.title}</p>
                  </div>
                  <button type="button" onClick={closeEditor} disabled={saving} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-viet-border bg-white text-viet-text transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50" aria-label="Đóng trình chỉnh sửa">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex-1 space-y-7 overflow-y-auto p-5 sm:p-8">
                  {actionError && (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700" role="alert">
                      <AlertCircle className="mt-0.5 shrink-0" size={18} /> {actionError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-viet-text-light">
                      Mã bài học
                      <input
                        type="text"
                        value={formData.lessonId}
                        onChange={(event) => updateForm('lessonId', event.target.value)}
                        disabled={!isCreating}
                        pattern="[A-Za-z0-9_-]+"
                        title="Chỉ dùng chữ không dấu, số, dấu gạch ngang hoặc gạch dưới"
                        className="h-12 w-full rounded-2xl border border-viet-border bg-viet-bg/20 px-5 font-mono text-sm normal-case outline-none transition-colors focus:border-viet-green focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        required
                      />
                      <span className="block text-[11px] font-medium normal-case tracking-normal">Mã là duy nhất và không thể đổi sau khi tạo.</span>
                    </label>
                    <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-viet-text-light">
                      Tiêu đề bài học
                      <input type="text" value={formData.title} onChange={(event) => updateForm('title', event.target.value)} className="h-12 w-full rounded-2xl border border-viet-border bg-viet-bg/20 px-5 font-bold normal-case outline-none transition-colors focus:border-viet-green focus:bg-white" maxLength={250} required />
                    </label>
                    <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-viet-text-light">
                      Chương / Phần
                      <input type="text" value={formData.chapter} onChange={(event) => updateForm('chapter', event.target.value)} className="h-12 w-full rounded-2xl border border-viet-border bg-viet-bg/20 px-5 font-bold normal-case outline-none transition-colors focus:border-viet-green focus:bg-white" maxLength={150} required />
                    </label>
                    <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-viet-text-light">
                      Thứ tự
                      <input type="number" min="1" step="1" value={formData.order} onChange={(event) => updateForm('order', event.target.value)} className="h-12 w-full rounded-2xl border border-viet-border bg-viet-bg/20 px-5 font-bold normal-case outline-none transition-colors focus:border-viet-green focus:bg-white" required />
                    </label>
                    <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-viet-text-light">
                      Lớp
                      <select value={formData.classId} onChange={(event) => updateForm('classId', Number(event.target.value))} className="h-12 w-full rounded-2xl border border-viet-border bg-viet-bg/20 px-5 font-bold normal-case outline-none transition-colors focus:border-viet-green focus:bg-white">
                        {GRADES.map((grade) => <option key={grade} value={grade}>Lớp {grade}</option>)}
                      </select>
                    </label>
                    <label className="space-y-2 text-xs font-bold uppercase tracking-wider text-viet-text-light md:col-span-2">
                      Link video chính
                      <input type="url" value={formData.videoUrl} onChange={(event) => updateForm('videoUrl', event.target.value)} placeholder="https://www.youtube.com/watch?v=... hoặc https://.../video.mp4" className="h-12 w-full rounded-2xl border border-viet-border bg-viet-bg/20 px-5 font-medium normal-case text-blue-600 outline-none transition-colors focus:border-viet-green focus:bg-white" />
                      <span className="block text-[11px] font-medium normal-case tracking-normal">Hỗ trợ YouTube, Vimeo và tệp video trực tiếp. Các video phụ hiện có vẫn được giữ nguyên.</span>
                    </label>
                  </div>

                  <label className="block space-y-2 text-xs font-bold uppercase tracking-wider text-viet-text-light">
                    Mô tả bài học
                    <textarea value={formData.description} onChange={(event) => updateForm('description', event.target.value)} className="h-28 w-full resize-y rounded-2xl border border-viet-border bg-viet-bg/20 p-5 font-medium normal-case outline-none transition-colors focus:border-viet-green focus:bg-white" maxLength={2000} />
                  </label>

                  <label className="block space-y-2 text-xs font-bold uppercase tracking-wider text-viet-text-light">
                    Nội dung bài học (Markdown / LaTeX)
                    <textarea value={formData.content} onChange={(event) => updateForm('content', event.target.value)} className="h-80 w-full resize-y rounded-2xl border border-viet-border bg-viet-bg/20 p-5 font-mono text-sm font-medium normal-case outline-none transition-colors focus:border-viet-green focus:bg-white" placeholder="Nhập nội dung bài học..." />
                    {!isCreating && Array.isArray(editingLesson?.theoryModules) && editingLesson.theoryModules.some((module) => module?.type !== 'markdown') && (
                      <span className="block rounded-xl bg-amber-50 p-3 text-[11px] font-medium normal-case tracking-normal text-amber-700">Nội dung gốc có cấu trúc nhiều khối. Nếu không sửa vùng này, cấu trúc gốc sẽ được giữ nguyên; nếu sửa, nội dung sẽ được lưu thành Markdown.</span>
                    )}
                  </label>

                  <section className="space-y-4 border-t border-viet-border pt-6" aria-labelledby="upload-video-title">
                    <div>
                      <h3 id="upload-video-title" className="text-sm font-bold uppercase tracking-widest text-viet-green">Tải video lên Cloudinary</h3>
                      <p className="mt-1 text-xs text-viet-text-light">URL sau khi tải thành công sẽ tự động điền vào ô “Link video chính”.</p>
                    </div>
                    <MediaUploader type="video" maxSizeMB={10} disabled={saving} onUploadingChange={setMediaUploading} onUploadSuccess={(url) => updateForm('videoUrl', url)} />
                  </section>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-viet-border bg-viet-bg/30 p-5 sm:flex-row sm:justify-end sm:p-8">
                  <button type="button" onClick={closeEditor} disabled={saving} className="rounded-2xl px-8 py-3 font-bold text-viet-text-light transition-colors hover:bg-white disabled:opacity-50">Hủy bỏ</button>
                  <button type="submit" disabled={saving || mediaUploading} title={mediaUploading ? 'Vui lòng đợi tải video hoàn tất trước khi lưu.' : undefined} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-viet-green px-8 py-3 font-bold text-white shadow-lg shadow-viet-green/20 transition-transform hover:scale-[1.01] disabled:cursor-wait disabled:opacity-60">
                    {saving ? <RefreshCcw className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? 'Đang lưu...' : isCreating ? 'Tạo bài học' : 'Lưu thay đổi'}
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LessonManager;
