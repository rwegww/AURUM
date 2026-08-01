import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Clock3, GraduationCap, Mail, RefreshCcw } from 'lucide-react';
import { parseAdminMutationResponse } from '@/utils/adminApproval';

const PAGE_SIZE = 100;

const formatDateTime = (value) => {
  if (!value) return 'Không rõ thời gian';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Không rõ thời gian' : date.toLocaleString('vi-VN');
};

const parseTeacherRequest = (message) => {
  try {
    const data = JSON.parse(message);
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid payload');
    return { email: typeof data.email === 'string' ? data.email : '', invalid: false };
  } catch {
    return { email: '', invalid: true };
  }
};

const mergeUniqueFeedback = (current, incoming) => {
  const feedbackById = new Map(current.map((item) => [item.id, item]));
  incoming.forEach((item) => feedbackById.set(item.id, item));
  return Array.from(feedbackById.values());
};

const getTypeStyle = (type) => {
  switch (type) {
    case 'bug': return 'bg-red-50 text-red-700 ring-red-200';
    case 'suggestion': return 'bg-blue-50 text-blue-700 ring-blue-200';
    case 'praise': return 'bg-green-50 text-green-700 ring-green-200';
    case 'teacher_registration': return 'bg-purple-50 text-purple-700 ring-purple-200';
    default: return 'bg-gray-50 text-gray-700 ring-gray-200';
  }
};

const getTypeLabel = (type) => {
  if (type === 'suggestion') return 'Góp ý';
  if (type === 'bug') return 'Báo lỗi';
  if (type === 'praise') return 'Khen ngợi';
  if (type === 'teacher_registration') return 'Yêu cầu giáo viên';
  return type || 'Khác';
};

const FeedbackManager = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionNotice, setActionNotice] = useState('');
  const [activeTab, setActiveTab] = useState('feedback');
  const [actingId, setActingId] = useState(null);
  const [pendingActions, setPendingActions] = useState(() => new Set());
  const requestSequence = useRef(0);

  const fetchFeedbacks = useCallback(async ({ signal, background = false, append = false, cursor = null } = {}) => {
    const requestId = ++requestSequence.current;
    if (append) setLoadingMore(true);
    else if (background) setRefreshing(true);
    else setLoading(true);
    setLoadError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');

      const params = new URLSearchParams({ limit: String(PAGE_SIZE) });
      if (append && cursor) params.set('before', cursor);
      const res = await fetch(`/api/admin/feedback?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || 'Không thể tải phản hồi.');
      if (!Array.isArray(data)) throw new Error('Dữ liệu phản hồi trả về không hợp lệ.');

      if (requestId === requestSequence.current) {
        setFeedbacks((current) => append ? mergeUniqueFeedback(current, data) : data);
        setNextCursor(res.headers.get('X-Next-Cursor') || null);
        if (!append) setPendingActions(new Set());
      }
    } catch (err) {
      if (err.name === 'AbortError' || requestId !== requestSequence.current) return;
      console.error('Lỗi tải phản hồi:', err);
      setLoadError(err.message || 'Không thể tải phản hồi.');
    } finally {
      if (!signal?.aborted && requestId === requestSequence.current) {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => fetchFeedbacks({ signal: controller.signal }), 0);
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchFeedbacks]);

  const visibleFeedbacks = useMemo(() => feedbacks.filter((item) => (
    activeTab === 'teachers' ? item.type === 'teacher_registration' : item.type !== 'teacher_registration'
  )), [activeTab, feedbacks]);

  const unreadTeacherRequests = useMemo(() => feedbacks.filter((item) => (
    item.type === 'teacher_registration' && item.status === 'unread'
  )).length, [feedbacks]);

  const hasPendingAction = (id) => Array.from(pendingActions).some((key) => key.startsWith(`${id}:`));

  const performAction = async ({ id, action, endpoint, method = 'PATCH', confirmation, update }) => {
    const actionKey = `${id}:${action}`;
    if (actingId || pendingActions.has(actionKey) || hasPendingAction(id)) return;
    if (confirmation && !window.confirm(confirmation)) return;

    setActingId(id);
    setActionError('');
    setActionNotice('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');

      const res = await fetch(endpoint, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await parseAdminMutationResponse(res);
      setActionNotice(result.message);

      if (result.pendingApproval) {
        setPendingActions((current) => new Set(current).add(actionKey));
      } else if (update) {
        setFeedbacks((current) => current.map((item) => item.id === id ? update(item, result.data) : item));
        setPendingActions((current) => {
          const next = new Set(current);
          Array.from(next).forEach((key) => {
            if (key.startsWith(`${id}:`)) next.delete(key);
          });
          return next;
        });
      }
    } catch (err) {
      console.error('Lỗi xử lý phản hồi:', err);
      const message = err.message || 'Không thể xử lý phản hồi.';
      setActionError(message);
    } finally {
      setActingId(null);
    }
  };

  const isFetching = loading || refreshing || loadingMore;

  return (
    <div className="p-4 sm:p-8 pb-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
          <div>
            <Link to="/admin" className="text-viet-green font-bold text-xs mb-2 block hover:underline">← Quay lại Bảng điều khiển</Link>
            <h1 className="text-3xl font-bold text-viet-text tracking-tight">Hòm thư <span className="text-viet-green">góp ý</span></h1>
            <p className="text-viet-text-light mt-1 font-medium italic">Lắng nghe ý kiến người dùng và xử lý yêu cầu giáo viên.</p>
          </div>
          <button
            type="button"
            onClick={() => fetchFeedbacks({ background: feedbacks.length > 0 })}
            disabled={isFetching || Boolean(actingId)}
            className="inline-flex w-fit items-center gap-2 rounded-2xl border border-viet-border bg-white px-5 py-3 text-xs font-black text-viet-text hover:text-viet-green disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" /> Làm mới
          </button>
        </header>

        <div className="flex flex-wrap gap-3 sm:gap-4 mb-8" role="tablist" aria-label="Loại nội dung">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'feedback'}
            onClick={() => setActiveTab('feedback')}
            className={`px-5 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'feedback' ? 'bg-viet-green text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Phản hồi và báo lỗi
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'teachers'}
            onClick={() => setActiveTab('teachers')}
            className={`px-5 sm:px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === 'teachers' ? 'bg-viet-green text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} flex items-center gap-2`}
          >
            Duyệt giáo viên
            {unreadTeacherRequests > 0 && (
              <span className="min-w-5 h-5 px-1 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px]" aria-label={`${unreadTeacherRequests} yêu cầu chưa xử lý`}>
                {unreadTeacherRequests > 99 ? '99+' : unreadTeacherRequests}
              </span>
            )}
          </button>
        </div>

        {(loadError || actionError) && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700 flex items-start gap-3" role="alert">
            <AlertTriangle className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{actionError || loadError}</span>
          </div>
        )}

        {actionNotice && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700 flex items-start gap-3" role="status" aria-live="polite">
            <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>{actionNotice}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24" role="status" aria-live="polite">
            <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin" aria-hidden="true" />
            <span className="mt-4 text-sm font-bold text-viet-text-light">Đang tải hòm thư...</span>
          </div>
        ) : loadError && feedbacks.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-viet-border p-12 sm:p-20 text-center">
            <p className="text-viet-text-light font-bold">Hòm thư chưa thể tải.</p>
            <button type="button" onClick={() => fetchFeedbacks()} className="mt-5 rounded-xl bg-viet-green px-5 py-2.5 text-sm font-bold text-white">Thử lại</button>
          </div>
        ) : (
          <div role="tabpanel" className="space-y-6" aria-busy={refreshing || loadingMore}>
            {visibleFeedbacks.length === 0 ? (
              <div className="bg-white rounded-[32px] border border-viet-border p-12 sm:p-20 text-center">
                {activeTab === 'teachers'
                  ? <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" aria-hidden="true" />
                  : <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" aria-hidden="true" />}
                <p className="text-viet-text-light font-bold">
                  {activeTab === 'teachers' ? 'Không có yêu cầu giáo viên trong dữ liệu đã tải.' : 'Không có phản hồi trong dữ liệu đã tải.'}
                </p>
              </div>
            ) : visibleFeedbacks.map((feedback, index) => {
              const username = feedback.username === 'Anonymous' ? 'Ẩn danh' : (feedback.username || 'Không rõ người gửi');
              const pending = hasPendingAction(feedback.id);
              const acting = actingId === feedback.id;
              const teacherRequest = feedback.type === 'teacher_registration' ? parseTeacherRequest(feedback.message) : null;

              return (
                <motion.article
                  key={feedback.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.04, 0.3) }}
                  className={`bg-white rounded-[24px] sm:rounded-[32px] border border-viet-border p-5 sm:p-8 shadow-sm relative overflow-hidden transition-all ${feedback.status === 'resolved' ? 'opacity-75' : 'hover:shadow-md'}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-viet-bg flex items-center justify-center text-viet-green font-black" aria-hidden="true">{username.charAt(0).toUpperCase() || '?'}</div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-viet-text break-all">{username}</p>
                        <time className="text-[10px] text-viet-text-light font-medium uppercase mt-0.5" dateTime={feedback.createdAt || undefined}>{formatDateTime(feedback.createdAt)}</time>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ring-1 ${getTypeStyle(feedback.type)}`}>{getTypeLabel(feedback.type)}</span>
                      {pending ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 ring-1 ring-amber-200 text-[10px] font-black rounded-lg uppercase">
                          <Clock3 className="w-3.5 h-3.5" aria-hidden="true" /> Chờ quản trị viên khác
                        </span>
                      ) : feedback.type !== 'teacher_registration' ? (
                        feedback.status === 'unread' ? (
                          <button
                            type="button"
                            onClick={() => performAction({
                              id: feedback.id,
                              action: 'resolve',
                              endpoint: `/api/admin/feedback/${encodeURIComponent(feedback.id)}`,
                              confirmation: 'Đánh dấu phản hồi này là đã xử lý? Yêu cầu sẽ cần quản trị viên thứ hai xác nhận.',
                              update: (item) => ({ ...item, status: 'resolved' }),
                            })}
                            disabled={Boolean(actingId)}
                            className="px-4 py-1.5 bg-viet-green text-white text-[10px] font-black rounded-lg uppercase tracking-tight disabled:opacity-50"
                          >{acting ? 'Đang gửi...' : 'Hoàn thành'}</button>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-500 text-[10px] font-black rounded-lg tracking-wider"><CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Đã xử lý</span>
                        )
                      ) : teacherRequest.invalid ? (
                        <span className="px-2.5 py-1 bg-red-50 text-red-700 ring-1 ring-red-200 text-[10px] font-black rounded-lg">Dữ liệu không hợp lệ</span>
                      ) : feedback.status === 'unread' ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => performAction({
                              id: feedback.id,
                              action: 'teacher-approve',
                              endpoint: `/api/admin/teacher-requests/${encodeURIComponent(feedback.id)}/approve`,
                              method: 'POST',
                              confirmation: `Duyệt tài khoản giáo viên ${username}? Nếu đủ xác nhận, tài khoản sẽ được tạo và email sẽ được gửi.`,
                              update: (item, resultData) => ({
                                ...item,
                                status: resultData?.feedbackUpdated === false ? item.status : 'resolved',
                              }),
                            })}
                            disabled={Boolean(actingId)}
                            className="px-4 py-1.5 bg-green-600 text-white text-[10px] font-black rounded-lg uppercase tracking-tight disabled:opacity-50"
                          >{acting ? 'Đang gửi...' : 'Duyệt'}</button>
                          <button
                            type="button"
                            onClick={() => performAction({
                              id: feedback.id,
                              action: 'teacher-reject',
                              endpoint: `/api/admin/teacher-requests/${encodeURIComponent(feedback.id)}/reject`,
                              method: 'POST',
                              confirmation: `Từ chối yêu cầu của ${username}? Nếu đủ xác nhận, email từ chối sẽ được gửi.`,
                              update: (item) => ({ ...item, status: 'rejected' }),
                            })}
                            disabled={Boolean(actingId)}
                            className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-black rounded-lg uppercase tracking-tight disabled:opacity-50"
                          >Từ chối</button>
                        </div>
                      ) : feedback.status === 'resolved' ? (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-lg tracking-wider">Đã duyệt</span>
                      ) : (
                        <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[10px] font-black rounded-lg tracking-wider">Đã từ chối</span>
                      )}
                    </div>
                  </div>

                  <div className="sm:pl-[52px]">
                    {feedback.type === 'teacher_registration' ? (
                      <div className={`p-5 sm:p-6 rounded-2xl border mb-4 ${teacherRequest.invalid ? 'bg-red-50 border-red-100' : 'bg-viet-bg/30 border-viet-green/5'}`}>
                        <h2 className="text-sm font-bold mb-2">Thông tin đăng ký</h2>
                        {teacherRequest.invalid ? (
                          <p className="text-sm font-bold text-red-700">Không thể đọc dữ liệu đăng ký. Các thao tác duyệt đã được khóa để tránh xử lý sai.</p>
                        ) : (
                          <dl className="text-sm grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                            <dt className="font-bold">Tên đăng nhập:</dt><dd className="break-all">{feedback.username || 'Không rõ'}</dd>
                            <dt className="font-bold">Email:</dt><dd className="break-all">{teacherRequest.email || 'Không có'}</dd>
                          </dl>
                        )}
                      </div>
                    ) : (
                      <p className="text-viet-text font-medium leading-relaxed whitespace-pre-wrap break-words bg-viet-bg/30 p-5 sm:p-6 rounded-2xl border border-viet-green/5">{feedback.message || 'Không có nội dung.'}</p>
                    )}

                    {feedback.imageUrl && (
                      <div className="mt-4">
                        <img src={feedback.imageUrl} alt={feedback.type === 'teacher_registration' ? 'Ảnh minh chứng đăng ký giáo viên' : 'Ảnh đính kèm phản hồi'} loading="lazy" className="max-w-md w-full rounded-2xl border border-viet-border object-contain max-h-[300px]" />
                      </div>
                    )}

                    {feedback.type === 'praise' && (
                      <div className="mt-4 flex justify-end">
                        {feedback.isApproved ? (
                          <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-bold rounded-xl flex items-center gap-2"><CheckCircle2 className="w-4 h-4" aria-hidden="true" /> Đang hiển thị trên trang chủ</span>
                        ) : pending ? null : (
                          <button
                            type="button"
                            onClick={() => performAction({
                              id: feedback.id,
                              action: 'approve-praise',
                              endpoint: `/api/admin/feedback/${encodeURIComponent(feedback.id)}/approve`,
                              confirmation: 'Duyệt công khai lời khen này trên trang chủ? Yêu cầu sẽ cần quản trị viên thứ hai xác nhận.',
                              update: (item) => ({ ...item, isApproved: true }),
                            })}
                            disabled={Boolean(actingId)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-md disabled:opacity-50"
                          >Duyệt hiển thị trên trang chủ</button>
                        )}
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}

            {nextCursor && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => fetchFeedbacks({ append: true, cursor: nextCursor })}
                  disabled={isFetching || Boolean(actingId)}
                  className="inline-flex items-center gap-2 rounded-xl border border-viet-border bg-white px-5 py-2.5 text-sm font-bold text-viet-green hover:bg-viet-bg disabled:opacity-50"
                >
                  <RefreshCcw className={`w-4 h-4 ${loadingMore ? 'animate-spin' : ''}`} aria-hidden="true" />
                  {loadingMore ? 'Đang tải...' : 'Tải thêm'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackManager;
