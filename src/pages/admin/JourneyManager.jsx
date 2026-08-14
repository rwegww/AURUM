import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, GripVertical, Map as MapIcon, RefreshCcw, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { parseAdminMutationResponse } from '@/utils/adminApproval';
import { reorderJourneyLessons } from '@/utils/adminLessonData';

const GRADES = [6, 7, 8, 9, 10, 11, 12];

const getOrder = (lesson, fallback = Number.MAX_SAFE_INTEGER) => {
  const order = Number(lesson?.order);
  return Number.isFinite(order) ? order : fallback;
};

const sortLessons = (lessons) => [...lessons].sort((first, second) => (
  getOrder(first) - getOrder(second)
  || String(first?.title || '').localeCompare(String(second?.title || ''), 'vi')
));

const getResponseData = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.error || 'Không thể tải hành trình.');
  return data;
};

const JourneyManager = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(8);
  const selectedProgram = 'ketnoi';
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [saveNotice, setSaveNotice] = useState('');
  const [savedOrders, setSavedOrders] = useState(() => new Map());

  const hasChanges = useMemo(() => lessons.some((lesson) => (
    getOrder(lesson) !== savedOrders.get(lesson.lessonId)
  )), [lessons, savedOrders]);

  const fetchJourney = useCallback(async (signal) => {
    setLoading(true);
    setLoadError('');
    setSaveError('');
    setSaveNotice('');
    try {
      const params = new URLSearchParams({ classId: String(selectedGrade), programId: selectedProgram });
      const response = await fetch(`/api/lessons?${params}`, { signal });
      const data = await getResponseData(response);
      if (!Array.isArray(data)) throw new Error('Dữ liệu hành trình trả về không hợp lệ.');
      const sortedData = sortLessons(data);
      setSavedOrders(new Map(sortedData.map((lesson) => [lesson.lessonId, getOrder(lesson)])));
      setLessons(sortedData);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Lỗi tải hành trình:', err);
        setLoadError(err.message || 'Không thể tải hành trình.');
        setLessons([]);
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [selectedGrade, selectedProgram]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => fetchJourney(controller.signal), 0);
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchJourney]);

  useEffect(() => {
    const warnBeforeUnload = (event) => {
      if (!hasChanges) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warnBeforeUnload);
    return () => window.removeEventListener('beforeunload', warnBeforeUnload);
  }, [hasChanges]);

  const confirmDiscard = () => !hasChanges || window.confirm('Bạn có thay đổi thứ tự chưa lưu. Bạn có chắc muốn rời khỏi trang?');

  const handleGradeChange = (grade) => {
    if (grade === selectedGrade || saving || !confirmDiscard()) return;
    setSelectedGrade(grade);
  };

  const moveItem = (index, direction) => {
    const newIndex = index + direction;
    if (saving || newIndex < 0 || newIndex >= lessons.length) return;

    setLessons((current) => reorderJourneyLessons(current, index, direction));
    setSaveError('');
    setSaveNotice('');
  };

  const handleSave = async () => {
    if (!hasChanges || saving) return;
    const changedLessons = lessons.filter((lesson) => (
      getOrder(lesson) !== savedOrders.get(lesson.lessonId)
    ));

    setSaving(true);
    setSaveError('');
    setSaveNotice('');
    try {
      const token = localStorage.getItem('token');
      const outcomes = await Promise.all(changedLessons.map(async (lesson) => {
        try {
          const response = await fetch(`/api/admin/lessons/${encodeURIComponent(lesson.lessonId)}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token || ''}`,
            },
            // The API merges this patch with the latest lesson at execution time.
            body: JSON.stringify({ order: getOrder(lesson) }),
          });
          return { lesson, result: await parseAdminMutationResponse(response) };
        } catch (error) {
          return { lesson, error };
        }
      }));

      const accepted = outcomes.filter((outcome) => !outcome.error);
      const failed = outcomes.filter((outcome) => outcome.error);
      const pendingCount = accepted.filter((outcome) => outcome.result.pendingApproval).length;
      const savedById = new Map(accepted
        .filter((outcome) => !outcome.result.pendingApproval)
        .map((outcome) => [outcome.lesson.lessonId, outcome.result.data]));

      setSavedOrders((current) => {
        const next = new Map(current);
        accepted.forEach(({ lesson }) => next.set(lesson.lessonId, getOrder(lesson)));
        return next;
      });
      setLessons((current) => current.map((lesson) => savedById.get(lesson.lessonId) || { ...lesson }));

      if (failed.length > 0) {
        const firstMessage = failed[0].error?.message || 'Lỗi không xác định.';
        setSaveError(`Đã ghi nhận ${accepted.length}/${outcomes.length} thay đổi. ${failed.length} bài chưa lưu được: ${firstMessage}`);
      }

      if (pendingCount > 0) {
        setSaveNotice(`Đã tạo ${pendingCount} yêu cầu duyệt thứ tự. Cần quản trị viên còn lại xác nhận để áp dụng.`);
      } else if (failed.length === 0) {
        setSaveNotice(`Đã cập nhật thứ tự của ${accepted.length} bài học thành công.`);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <header className="mb-8 flex flex-col justify-between gap-6 lg:mb-10 lg:flex-row lg:items-center">
        <div>
          <Link
            to="/admin"
            onClick={(event) => { if (!confirmDiscard()) event.preventDefault(); }}
            className="mb-2 block text-xs font-bold text-viet-green hover:underline"
          >
            ← Quay lại Bảng điều khiển
          </Link>
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-viet-text">
            Quản lý <span className="text-viet-green">Hành trình</span> <MapIcon className="text-viet-green" size={28} aria-hidden="true" />
          </h1>
          <p className="mt-1 font-medium italic text-viet-text-light">Sắp xếp lộ trình học tập cho học sinh theo từng khối lớp.</p>
        </div>

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex max-w-full gap-1 overflow-x-auto no-scrollbar rounded-2xl border border-viet-border bg-white p-1 shadow-sm" aria-label="Chọn khối lớp">
            {GRADES.map((grade) => (
              <button
                type="button"
                key={grade}
                onClick={() => handleGradeChange(grade)}
                disabled={saving}
                aria-pressed={selectedGrade === grade}
                className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all sm:px-5 ${
                  selectedGrade === grade ? 'bg-viet-green text-white shadow-md' : 'text-viet-text-light hover:bg-gray-50'
                } disabled:opacity-60`}
              >
                Lớp {grade}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-viet-green px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-viet-green/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none"
          >
            {saving ? <RefreshCcw className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </header>

      {hasChanges && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-700" role="status">
          <AlertTriangle className="mt-0.5 shrink-0" size={18} />
          Bạn có thay đổi chưa lưu. Hãy lưu trước khi chuyển lớp hoặc mở trang chi tiết.
        </motion.div>
      )}

      {saveError && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700" role="alert">
          <AlertCircle className="mt-0.5 shrink-0" size={18} /> {saveError}
        </div>
      )}

      {saveNotice && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700" role="status" aria-live="polite">
          <CheckCircle2 className="mt-0.5 shrink-0" size={18} /> {saveNotice}
        </div>
      )}

      {loading ? (
        <div className="space-y-4" role="status" aria-label="Đang tải hành trình">
          {[1, 2, 3, 4, 5].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl border border-viet-border bg-white" />)}
        </div>
      ) : loadError ? (
        <div className="rounded-[32px] border border-red-200 bg-white px-6 py-14 text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={36} />
          <p className="font-bold text-viet-text">Không thể tải hành trình lớp {selectedGrade}</p>
          <p className="mt-2 text-sm text-viet-text-light">{loadError}</p>
          <button type="button" onClick={() => fetchJourney()} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-viet-green px-5 py-2.5 text-sm font-bold text-white">
            <RefreshCcw size={16} /> Thử lại
          </button>
        </div>
      ) : lessons.length === 0 ? (
        <div className="rounded-[40px] border border-dashed border-slate-200 bg-white py-20 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-300"><MapIcon size={32} /></div>
          <p className="font-bold text-slate-500">Chưa có bài học nào cho khối lớp này.</p>
          <Link to="/admin/bai_hoc" className="mt-2 block text-sm font-bold text-viet-green hover:underline">Tới trang Quản lý Học liệu →</Link>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute bottom-10 left-6 top-10 hidden w-1 rounded-full bg-slate-100 sm:block" aria-hidden="true" />
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <motion.div
                key={lesson.lessonId}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
                className="group relative flex items-stretch gap-3 sm:items-center sm:gap-6"
              >
                <div className={`z-10 hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border-4 text-sm font-black transition-colors sm:flex ${
                  index === 0 ? 'border-viet-green/20 bg-viet-green text-white' : 'border-slate-50 bg-white text-viet-text-light'
                }`} aria-label={`Chặng ${index + 1}`}>
                  {index + 1}
                </div>

                <article className="flex min-w-0 flex-1 flex-col gap-4 rounded-[24px] border border-viet-border bg-white p-4 shadow-sm transition-all group-hover:border-viet-green/30 group-hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:rounded-[28px] sm:p-5">
                  <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400" aria-hidden="true">
                      <GripVertical size={20} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="truncate font-bold leading-tight text-viet-text">{lesson.title || 'Bài học chưa có tiêu đề'}</h2>
                      <p className="mt-1 truncate text-[11px] font-medium uppercase tracking-wider text-viet-text-light">{lesson.chapter || 'Nội dung cốt lõi'} • ID: {lesson.lessonId}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1 sm:gap-2">
                    <button type="button" onClick={() => moveItem(index, -1)} disabled={saving || index === 0} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-viet-green disabled:opacity-30" aria-label={`Đưa ${lesson.title} lên một chặng`}>
                      <ChevronLeft size={20} className="rotate-90" />
                    </button>
                    <button type="button" onClick={() => moveItem(index, 1)} disabled={saving || index === lessons.length - 1} className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-viet-green disabled:opacity-30" aria-label={`Đưa ${lesson.title} xuống một chặng`}>
                      <ChevronRight size={20} className="rotate-90" />
                    </button>
                    <div className="mx-1 h-6 w-px bg-slate-100 sm:mx-2" />
                    <Link
                      to={`/admin/journey/${encodeURIComponent(lesson.lessonId)}`}
                      onClick={(event) => { if (!confirmDiscard()) event.preventDefault(); }}
                      className="rounded-xl bg-viet-green/5 px-3 py-2 text-[11px] font-black uppercase text-viet-green transition-colors hover:bg-viet-green hover:text-white sm:px-4"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </article>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyManager;
