import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { notifyAdminApprovalResult, parseAdminMutationResponse } from '@/utils/adminApproval';
import { toNonNegativeInteger } from '@/utils/teacherUi';

const EMPTY_CLASS = { name: '', khoi_id: '10', description: '' };

const ClassManager = () => {
  const [lop, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState('');
  const [newClass, setNewClass] = useState(EMPTY_CLASS);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name }
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const loadRequestRef = useRef(null);
  const createRequestRef = useRef(null);
  const deleteRequestRef = useRef(null);

  const fetchClasses = useCallback(async (showLoader = true) => {
    loadRequestRef.current?.abort();
    const controller = new AbortController();
    loadRequestRef.current = controller;
    if (showLoader) setLoading(true);
    setLoadError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/classes', {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Không thể tải danh sách lớp học.');
      }
      if (!Array.isArray(data)) throw new Error('Dữ liệu lớp học không đúng định dạng.');

      if (loadRequestRef.current === controller) setClasses(data);
    } catch (error) {
      if (error.name !== 'AbortError' && loadRequestRef.current === controller) {
        setLoadError(error.message || 'Không thể tải danh sách lớp học.');
      }
    } finally {
      if (loadRequestRef.current === controller) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(fetchClasses, 0);
    return () => {
      window.clearTimeout(timer);
      loadRequestRef.current?.abort();
      createRequestRef.current?.abort();
      deleteRequestRef.current?.abort();
    };
  }, [fetchClasses]);

  const resetCreateForm = () => {
    setIsCreating(false);
    setCreateError('');
    setNewClass(EMPTY_CLASS);
  };

  const openDeleteDialog = (cls) => {
    setDeleteError('');
    setDeleteTarget({ id: cls.id, name: cls.name || 'Lớp chưa đặt tên' });
  };

  const closeDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteTarget(null);
    setDeleteError('');
  };

  const handleDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    deleteRequestRef.current?.abort();
    const controller = new AbortController();
    deleteRequestRef.current = controller;
    setIsDeleting(true);
    setDeleteError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/classes/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Không thể xóa lớp học.');
      }
      setClasses((current) => current.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      if (error.name !== 'AbortError') {
        setDeleteError(error.message || 'Không thể xóa lớp học.');
      }
    } finally {
      if (deleteRequestRef.current === controller) setIsDeleting(false);
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const name = newClass.name.trim();
    const description = newClass.description.trim();
    if (!name) {
      setCreateError('Vui lòng nhập tên lớp học.');
      return;
    }

    createRequestRef.current?.abort();
    const controller = new AbortController();
    createRequestRef.current = controller;
    setIsSubmitting(true);
    setCreateError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          khoi_id: Number.parseInt(newClass.khoi_id, 10),
        }),
        signal: controller.signal,
      });
      const result = await parseAdminMutationResponse(response);
      if (controller.signal.aborted) return;

      notifyAdminApprovalResult(result);
      if (!result.pendingApproval && result.data?.id) {
        setClasses((current) => [result.data, ...current.filter((item) => item.id !== result.data.id)]);
      }
      resetCreateForm();
      if (!result.pendingApproval) await fetchClasses(false);
    } catch (error) {
      if (error.name !== 'AbortError') {
        setCreateError(error.message || 'Không thể tạo lớp học.');
      }
    } finally {
      if (createRequestRef.current === controller) setIsSubmitting(false);
    }
  };

  if (loading && lop.length === 0) {
    return (
      <div role="status" className="px-4 py-12 sm:p-8 flex flex-col items-center justify-center gap-3 text-sm font-medium text-viet-text-light">
        <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin" aria-hidden="true" />
        Đang tải danh sách lớp học…
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:p-8 sm:pb-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-viet-text tracking-tight mb-2">Quản lý lớp học</h1>
            <p className="text-sm sm:text-base text-viet-text-light font-medium">Tạo và quản lý lớp học, bài tập và sinh hoạt chung.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setCreateError('');
              setIsCreating(true);
            }}
            disabled={isCreating}
            className="w-full md:w-auto min-h-12 px-6 py-3 bg-viet-green text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-viet-green/20 shrink-0 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-viet-green focus-visible:ring-offset-2"
          >
            + Tạo lớp mới
          </button>
        </header>

        {loadError && lop.length > 0 && (
          <div role="alert" className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span>{loadError} Danh sách hiện tại có thể chưa được cập nhật.</span>
            <button type="button" onClick={() => fetchClasses(false)} className="min-h-10 shrink-0 rounded-xl border border-amber-300 bg-white px-4 font-bold">Thử lại</button>
          </div>
        )}

        {isCreating && (
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleCreate}
            className="mb-8 p-5 sm:p-6 bg-white rounded-[28px] sm:rounded-[32px] border border-viet-green/30 shadow-lg shadow-viet-green/5 space-y-4"
            aria-labelledby="create-class-title"
          >
            <h2 id="create-class-title" className="text-sm font-black text-viet-green text-center uppercase tracking-widest">Thiết lập lớp học</h2>
            {createError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{createError}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="class-name" className="mb-1 block text-[10px] font-black uppercase text-viet-text-light pl-2">Tên lớp</label>
                <input
                  id="class-name"
                  type="text"
                  required
                  autoFocus
                  maxLength={200}
                  value={newClass.name}
                  onChange={(event) => setNewClass((current) => ({ ...current, name: event.target.value }))}
                  className="w-full h-12 px-4 rounded-xl border border-viet-border outline-none focus:border-viet-green focus:ring-2 focus:ring-viet-green/20"
                  placeholder="VD: 10A1 Chuyên Hóa"
                />
              </div>
              <div>
                <label htmlFor="class-grade" className="mb-1 block text-[10px] font-black uppercase text-viet-text-light pl-2">Khối / Cấp</label>
                <select
                  id="class-grade"
                  value={newClass.khoi_id}
                  onChange={(event) => setNewClass((current) => ({ ...current, khoi_id: event.target.value }))}
                  className="w-full h-12 px-4 rounded-xl border border-viet-border outline-none focus:border-viet-green focus:ring-2 focus:ring-viet-green/20"
                >
                  {[6, 7, 8, 9, 10, 11, 12].map((grade) => <option key={grade} value={grade}>Khối {grade}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="class-description" className="mb-1 block text-[10px] font-black uppercase text-viet-text-light pl-2">Mô tả ngắn</label>
              <textarea
                id="class-description"
                rows={3}
                maxLength={2000}
                value={newClass.description}
                onChange={(event) => setNewClass((current) => ({ ...current, description: event.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-viet-border outline-none resize-y focus:border-viet-green focus:ring-2 focus:ring-viet-green/20"
                placeholder="Thông tin ngắn giúp phân biệt lớp học"
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-2">
              <button type="button" onClick={resetCreateForm} disabled={isSubmitting} className="min-h-11 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-viet-text-light hover:bg-slate-50 rounded-xl disabled:opacity-60">Hủy</button>
              <button type="submit" disabled={isSubmitting} className="min-h-11 px-8 py-2.5 bg-viet-green text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? 'Đang tạo…' : 'Tạo ngay'}
              </button>
            </div>
          </motion.form>
        )}

        <section aria-label="Các lớp đang quản lý" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lop.length === 0 ? (
            <div className="col-span-full py-12 sm:py-16 px-4 text-center border-2 border-dashed border-viet-border rounded-[28px] sm:rounded-[32px]">
              {loadError ? (
                <>
                  <p role="alert" className="text-red-700 font-bold mb-4">{loadError}</p>
                  <button type="button" onClick={() => fetchClasses()} className="min-h-11 rounded-xl bg-viet-text px-5 text-sm font-bold text-white">Thử tải lại</button>
                </>
              ) : (
                <>
                  <span className="text-4xl block opacity-30 mb-2" aria-hidden="true">🏫</span>
                  <p className="text-viet-text-light font-bold mb-4">Chưa có lớp học nào được tạo.</p>
                  <button type="button" onClick={() => setIsCreating(true)} className="min-h-11 rounded-xl bg-viet-green px-5 text-sm font-bold text-white">Tạo lớp đầu tiên</button>
                </>
              )}
            </div>
          ) : (
            lop.map((cls) => {
              const grade = cls.khoi_id ?? cls.gradeLevelId;
              return (
                <article key={cls.id} className="bg-white p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] border border-viet-border shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className="px-3 py-1 bg-viet-green/10 text-viet-green text-[10px] font-black uppercase rounded tracking-widest">{grade ? `Khối ${grade}` : 'Chưa rõ khối'}</span>
                    <div className="flex items-center gap-2">
                      {cls.code && <span className="text-[11px] font-black text-viet-text opacity-60 select-all">Mã: {cls.code}</span>}
                      <button
                        type="button"
                        onClick={() => openDeleteDialog(cls)}
                        aria-label={`Xóa lớp ${cls.name || ''}`.trim()}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-viet-text-light hover:text-red-500 hover:bg-red-50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <h2 className="text-xl font-black text-viet-text leading-tight mb-2 break-words">{cls.name || 'Lớp chưa đặt tên'}</h2>
                  <p className="text-xs font-medium text-viet-text-light mb-4 flex-1 whitespace-pre-wrap break-words">{cls.description || 'Chưa có mô tả.'}</p>
                  <p className="mb-4 text-xs font-bold text-viet-text-light">{toNonNegativeInteger(cls.student_count).toLocaleString('vi-VN')} học sinh</p>

                  <div className="pt-4 border-t border-viet-border mt-auto">
                    <Link
                      to={`/teacher/lop/${cls.id}`}
                      className="flex min-h-11 items-center justify-center py-3 bg-slate-50 border border-viet-border rounded-xl text-[10px] font-black text-viet-text uppercase tracking-widest hover:bg-viet-green hover:text-white hover:border-viet-green transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-viet-green"
                      aria-label={`Vào quản lý lớp ${cls.name || ''}`.trim()}
                    >
                      Vào quản lý lớp
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            key="delete-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={closeDeleteDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <motion.div
              key="delete-dialog"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-[28px] p-6 shadow-2xl border border-viet-border"
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-2xl bg-red-50 text-red-500">
                <Trash2 size={22} />
              </div>
              <h2 id="delete-dialog-title" className="text-center text-base font-black text-viet-text mb-1">Xóa lớp học?</h2>
              <p className="text-center text-sm text-viet-text-light mb-1">
                Bạn có chắc muốn xóa lớp
              </p>
              <p className="text-center text-sm font-bold text-viet-text mb-4 break-words">
                &ldquo;{deleteTarget.name}&rdquo;?
              </p>
              <p className="text-center text-xs text-red-500 font-medium mb-5">Hành động này không thể hoàn tác.</p>

              {deleteError && (
                <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 text-center">{deleteError}</p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeDeleteDialog}
                  disabled={isDeleting}
                  className="flex-1 min-h-11 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-viet-text-light bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-60"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 min-h-11 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-md shadow-red-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isDeleting ? 'Đang xóa…' : 'Xóa lớp'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassManager;
