import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowDown, ArrowUp, ArrowUpDown, CheckCircle2, Clock3, Filter, RefreshCcw, RotateCcw, ShieldCheck, XCircle } from 'lucide-react';
import { parseAdminMutationResponse } from '@/utils/adminApproval';
import { useAuth } from '@/context/AuthContext';

const PAGE_SIZE = 50;

const statusConfig = {
  pending: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock3 },
  executed: { label: 'Đã thực thi', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  rejected: { label: 'Đã từ chối', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
  failed: { label: 'Lỗi thực thi', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: XCircle },
};

const summarizePayload = (payload = {}) => {
  if (!payload || typeof payload !== 'object') return 'Dữ liệu thay đổi không thể hiển thị';
  if (payload.content) {
    const text = String(payload.content);
    const shortText = text.length > 80 ? `${text.slice(0, 80)}...` : text;
    return payload.username ? `💬 "${shortText}" — @${payload.username}` : `💬 "${shortText}"`;
  }
  if (payload.message) return String(payload.message);
  if (payload.title || payload.lesson?.title) return `📚 Bài học: ${payload.title || payload.lesson?.title}`;
  if (payload.name) return `🏫 Lớp: ${payload.name}`;
  if (payload.username) return `👤 Tài khoản: @${payload.username}${payload.email ? ` (${payload.email})` : ''}`;
  if (payload.id && Object.keys(payload).length <= 2) return `Mã ID đối tượng: ${payload.id}`;
  try {
    return JSON.stringify(payload).slice(0, 140);
  } catch {
    return 'Dữ liệu thay đổi';
  }
};

const ApprovalPayloadDetail = ({ payload = {} }) => {
  const [showRawJson, setShowRawJson] = useState(false);

  if (!payload || typeof payload !== 'object' || Object.keys(payload).length === 0) {
    return <div className="mt-2 text-slate-400 italic text-xs">Không có dữ liệu chi tiết.</div>;
  }

  const content = payload.content || payload.noi_dung || payload.message;
  const username = payload.username || payload.tac_gia?.username;
  const email = payload.email;
  const title = payload.title || payload.tieu_de || payload.lesson?.title;
  const gradeLevelId = payload.gradeLevelId || payload.khoi_id || payload.lesson?.gradeLevelId;
  const name = payload.name;
  const isLocked = payload.isLocked;
  const proofUrl = payload.proofUrl || payload.imageUrl;
  const lesson = payload.lesson;

  return (
    <div className="mt-3 space-y-2.5 max-w-xl">
      {content && (
        <div className="p-3 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-slate-800">
          <div className="flex items-center justify-between gap-2 mb-1 text-[11px] font-black text-amber-800 uppercase tracking-wider">
            <span>💬 Nội dung phản hồi / Lời khen</span>
            {username && <span className="normal-case font-bold text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-md">@{username}</span>}
          </div>
          <p className="text-xs font-medium leading-relaxed italic text-slate-800">"{content}"</p>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs space-y-1.5">
        {title && (
          <div className="flex items-start justify-between gap-4">
            <span className="font-bold text-slate-500 shrink-0">Tên bài học:</span>
            <span className="font-black text-slate-900 text-right">{title}</span>
          </div>
        )}

        {gradeLevelId && (
          <div className="flex items-start justify-between gap-4">
            <span className="font-bold text-slate-500 shrink-0">Khối lớp:</span>
            <span className="font-black text-viet-green text-right">Lớp {gradeLevelId}</span>
          </div>
        )}

        {name && (
          <div className="flex items-start justify-between gap-4">
            <span className="font-bold text-slate-500 shrink-0">Tên lớp:</span>
            <span className="font-black text-slate-900 text-right">{name}</span>
          </div>
        )}

        {username && !content && (
          <div className="flex items-start justify-between gap-4">
            <span className="font-bold text-slate-500 shrink-0">Tài khoản:</span>
            <span className="font-black text-slate-900 text-right">@{username}</span>
          </div>
        )}

        {email && (
          <div className="flex items-start justify-between gap-4">
            <span className="font-bold text-slate-500 shrink-0">Email:</span>
            <span className="font-semibold text-slate-700 text-right">{email}</span>
          </div>
        )}

        {isLocked !== undefined && (
          <div className="flex items-start justify-between gap-4">
            <span className="font-bold text-slate-500 shrink-0">Hành động khóa:</span>
            <span className={`font-black ${isLocked ? 'text-red-600' : 'text-emerald-600'}`}>
              {isLocked ? '🔒 Khóa tài khoản' : '🔓 Mở khóa tài khoản'}
            </span>
          </div>
        )}

        {proofUrl && (
          <div className="flex items-center justify-between gap-4 pt-1">
            <span className="font-bold text-slate-500 shrink-0">Minh chứng:</span>
            <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-viet-green underline hover:opacity-80">
              Xem ảnh minh chứng ↗
            </a>
          </div>
        )}

        {payload.id && (
          <div className="flex items-start justify-between gap-4 pt-1 border-t border-slate-200/60 text-[11px]">
            <span className="font-bold text-slate-400 shrink-0">Mã ID đối tượng:</span>
            <span className="font-mono text-slate-500 break-all">{payload.id}</span>
          </div>
        )}
      </div>

      {lesson && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs space-y-1.5">
          <div className="font-bold text-slate-700 mb-1">Cấu trúc bài học:</div>
          <div className="grid grid-cols-2 gap-2 text-slate-600">
            <div>Mô-đun lý thuyết: <strong className="text-slate-900">{lesson.theoryModules?.length || 0}</strong></div>
            <div>Mô-đun video: <strong className="text-slate-900">{lesson.videoModules?.length || 0}</strong></div>
            <div>Slide câu chuyện: <strong className="text-slate-900">{lesson.storySlides?.length || 0}</strong></div>
            <div>Thử thách/Câu hỏi: <strong className="text-slate-900">{lesson.challenges?.length || 0}</strong></div>
          </div>
        </div>
      )}

      <div className="pt-0.5">
        <button
          type="button"
          onClick={() => setShowRawJson(!showRawJson)}
          className="text-[11px] font-bold text-slate-400 hover:text-slate-600 underline"
        >
          {showRawJson ? 'Ẩn mã JSON thô' : 'Hiển thị mã JSON thô'}
        </button>

        {showRawJson && (
          <pre className="mt-2 max-h-60 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-slate-900 p-3 text-[11px] font-mono text-emerald-400">
            {JSON.stringify(payload, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

const mergeApprovals = (current, incoming) => {
  const byId = new Map(current.map((item) => [item.id, item]));
  incoming.forEach((item) => byId.set(item.id, item));
  return Array.from(byId.values());
};

const formatDateTime = (value) => {
  if (!value) return 'Không rõ thời gian';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Không rõ thời gian' : date.toLocaleString('vi-VN');
};

const ApprovalManager = () => {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [actingId, setActingId] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionNotice, setActionNotice] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [requesterFilter, setRequesterFilter] = useState('');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const requestSequence = useRef(0);

  const tabs = useMemo(() => Object.keys(statusConfig), []);

  const handleSort = (field) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortField(null);
        setSortDirection('desc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const resetFilters = () => {
    setActionFilter('');
    setRequesterFilter('');
    setSortField(null);
    setSortDirection('desc');
  };

  const hasActiveFilters = Boolean(actionFilter || requesterFilter || sortField);

  const fetchApprovals = useCallback(async ({
    nextStatus = status,
    append = false,
    cursor = null,
    signal,
  } = {}) => {
    const requestId = ++requestSequence.current;
    if (append) setLoadingMore(true);
    else setLoading(true);
    setLoadError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
      const params = new URLSearchParams({ status: nextStatus, limit: String(PAGE_SIZE) });
      if (append && cursor) params.set('before', cursor);
      const res = await fetch(`/api/admin/approvals?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || 'Không tải được danh sách yêu cầu duyệt.');
      if (!Array.isArray(data)) throw new Error('Dữ liệu yêu cầu duyệt trả về không hợp lệ.');
      if (signal?.aborted || requestId !== requestSequence.current) return;
      setApprovals((current) => append ? mergeApprovals(current, data) : data);
      setNextCursor(res.headers.get('X-Next-Cursor') || null);
    } catch (err) {
      if (err.name === 'AbortError' || requestId !== requestSequence.current) return;
      console.error('Lỗi tải yêu cầu duyệt:', err);
      setLoadError(err.message || 'Không tải được danh sách yêu cầu duyệt.');
      if (!append) setApprovals([]);
    } finally {
      if (!signal?.aborted && requestId === requestSequence.current) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [status]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      fetchApprovals({ nextStatus: status, signal: controller.signal });
    }, 0);
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
      requestSequence.current += 1;
    };
  }, [fetchApprovals, status]);

  const filteredApprovals = useMemo(() => {
    let result = [...approvals];

    if (actionFilter) {
      const kw = actionFilter.trim().toLocaleLowerCase('vi');
      result = result.filter((item) =>
        String(item.actionLabel || '').toLocaleLowerCase('vi').includes(kw) ||
        JSON.stringify(item.payload || {}).toLocaleLowerCase('vi').includes(kw)
      );
    }

    if (requesterFilter) {
      const kw = requesterFilter.trim().toLocaleLowerCase('vi');
      result = result.filter((item) => {
        const name = item.requester?.username || item.requestedBy || '';
        return String(name).toLocaleLowerCase('vi').includes(kw);
      });
    }

    if (sortField) {
      result.sort((a, b) => {
        let valA, valB;
        if (sortField === 'action') {
          valA = String(a.actionLabel || '').toLocaleLowerCase('vi');
          valB = String(b.actionLabel || '').toLocaleLowerCase('vi');
          return sortDirection === 'asc' ? valA.localeCompare(valB, 'vi') : valB.localeCompare(valA, 'vi');
        }
        if (sortField === 'requester') {
          valA = String(a.requester?.username || a.requestedBy || '').toLocaleLowerCase('vi');
          valB = String(b.requester?.username || b.requestedBy || '').toLocaleLowerCase('vi');
          return sortDirection === 'asc' ? valA.localeCompare(valB, 'vi') : valB.localeCompare(valA, 'vi');
        }
        if (sortField === 'approvals') {
          valA = Number(a.currentApprovals || 0) / Math.max(1, Number(a.requiredApprovals || 1));
          valB = Number(b.currentApprovals || 0) / Math.max(1, Number(b.requiredApprovals || 1));
        } else if (sortField === 'date') {
          valA = new Date(a.createdAt || 0).getTime();
          valB = new Date(b.createdAt || 0).getTime();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [approvals, actionFilter, requesterFilter, sortField, sortDirection]);

  const approveRequest = async (id) => {
    if (actingId) return;
    setActingId(id);
    setActionError('');
    setActionNotice('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/approvals/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await parseAdminMutationResponse(res);
      setActionNotice(result.message || 'Thay đổi đã được xác nhận và thực thi.');
      await fetchApprovals({ nextStatus: status });
    } catch (err) {
      console.error('Lỗi xác nhận yêu cầu duyệt:', err);
      setActionError(err.message || 'Không thể xác nhận yêu cầu duyệt.');
    } finally {
      setActingId(null);
    }
  };

  const rejectRequest = async (id) => {
    if (actingId) return;
    if (!window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu này?')) return;
    setActingId(id);
    setActionError('');
    setActionNotice('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/approvals/${id}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Không thể từ chối yêu cầu.');
      setActionNotice(data.message || 'Đã từ chối yêu cầu thay đổi.');
      await fetchApprovals({ nextStatus: status });
    } catch (err) {
      console.error('Lỗi từ chối yêu cầu duyệt:', err);
      setActionError(err.message || 'Không thể từ chối yêu cầu.');
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-8 pb-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Link to="/admin" className="text-viet-green font-bold text-xs mb-2 block hover:underline">← Quay lại Bảng điều khiển</Link>
            <h1 className="text-3xl font-bold text-viet-text tracking-tight flex items-center gap-3">
              Duyệt thay đổi <ShieldCheck className="text-viet-green" size={28} />
            </h1>
            <p className="text-viet-text-light mt-1 font-medium italic">Các thao tác quản trị cần đủ hai admin xác nhận trước khi áp dụng.</p>
          </div>

          <button
            type="button"
            onClick={() => fetchApprovals({ nextStatus: status })}
            disabled={loading || loadingMore || Boolean(actingId)}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-viet-border rounded-2xl text-xs font-black text-viet-text hover:text-viet-green transition-all"
          >
            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> Làm mới
          </button>
        </header>

        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = statusConfig[tab].icon;
            return (
              <button
                type="button"
                key={tab}
                disabled={Boolean(actingId)}
                aria-pressed={status === tab}
                onClick={() => {
                  setStatus(tab);
                  setActionError('');
                  setActionNotice('');
                }}
                className={`px-5 py-2.5 rounded-2xl border text-xs font-black flex items-center gap-2 transition-all ${
                  status === tab ? statusConfig[tab].color : 'bg-white border-viet-border text-viet-text-light hover:text-viet-text'
                }`}
              >
                <Icon size={15} /> {statusConfig[tab].label}
              </button>
            );
          })}
        </div>

        {loadError && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700" role="alert">
            <span className="flex items-start gap-2"><AlertCircle size={18} className="mt-0.5 shrink-0" />{loadError}</span>
            <button type="button" onClick={() => fetchApprovals({ nextStatus: status })} className="shrink-0 font-black underline">Thử lại</button>
          </div>
        )}
        {actionError && <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700" role="alert">{actionError}</div>}
        {actionNotice && <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700" role="status" aria-live="polite">{actionNotice}</div>}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin" />
          </div>
        ) : approvals.length === 0 ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin" />
          </div>
        ) : approvals.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-viet-border p-20 text-center">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-viet-text-light font-bold">Không có yêu cầu nào trong trạng thái này.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] border border-viet-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-viet-bg/40 border-b border-viet-border">
                  <tr>
                    <th className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleSort('action')}
                        className="inline-flex items-center gap-1.5 text-[11px] font-black text-viet-text-light uppercase tracking-widest hover:text-viet-green transition-colors focus:outline-none"
                      >
                        <span>Thay đổi</span>
                        {sortField === 'action' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-viet-green" /> : <ArrowDown className="w-3.5 h-3.5 text-viet-green" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleSort('requester')}
                        className="inline-flex items-center gap-1.5 text-[11px] font-black text-viet-text-light uppercase tracking-widest hover:text-viet-green transition-colors focus:outline-none"
                      >
                        <span>Người tạo</span>
                        {sortField === 'requester' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-viet-green" /> : <ArrowDown className="w-3.5 h-3.5 text-viet-green" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleSort('approvals')}
                        className="inline-flex items-center gap-1.5 text-[11px] font-black text-viet-text-light uppercase tracking-widest hover:text-viet-green transition-colors focus:outline-none"
                      >
                        <span>Xác nhận</span>
                        {sortField === 'approvals' ? (
                          sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-viet-green" /> : <ArrowDown className="w-3.5 h-3.5 text-viet-green" />
                        ) : (
                          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </button>
                    </th>
                    <th className="px-6 py-4 text-right text-[11px] font-black text-viet-text-light uppercase tracking-widest">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-viet-border">
                  {filteredApprovals.map((item) => {
                    const executionUnfinished = item.status === 'executed' && !item.executedAt;
                    const cfg = executionUnfinished
                      ? { ...statusConfig.pending, label: 'Chưa chốt kết quả' }
                      : statusConfig[item.status] || statusConfig.pending;
                    const alreadyApproved = Array.isArray(item.approverIds) && item.approverIds.includes(user?.id);
                    const canRetryExecution = Number(item.currentApprovals) >= Number(item.requiredApprovals);
                    return (
                      <tr key={item.id} className="hover:bg-viet-bg/20 transition-colors">
                        <td className="px-6 py-5">
                          <div className="space-y-2">
                            <span className={`inline-flex px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-wider ${cfg.color}`}>
                              {cfg.label}
                            </span>
                            <div>
                              <p className="text-sm font-black text-viet-text">{item.actionLabel}</p>
                              <p className="text-xs text-viet-text-light font-medium mt-1 break-all">{summarizePayload(item.payload)}</p>
                              <details className="mt-2 text-xs">
                                <summary className="cursor-pointer font-bold text-viet-green">Xem chi tiết thay đổi</summary>
                                <ApprovalPayloadDetail payload={item.payload} />
                              </details>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{formatDateTime(item.createdAt)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm font-bold text-viet-text">
                          {item.requester?.username || item.requestedBy || 'Không rõ'}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-viet-text">
                            {item.currentApprovals}/{item.requiredApprovals}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          {item.status === 'pending' ? (
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => approveRequest(item.id)}
                                disabled={Boolean(actingId) || (alreadyApproved && !canRetryExecution)}
                                className="px-4 py-2 bg-viet-green text-white rounded-xl text-xs font-black uppercase tracking-wider disabled:opacity-50"
                              >
                                {alreadyApproved && !canRetryExecution ? 'Đã xác nhận' : canRetryExecution ? 'Tiếp tục' : 'Xác nhận'}
                              </button>
                              <button
                                type="button"
                                onClick={() => rejectRequest(item.id)}
                                disabled={Boolean(actingId)}
                                className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-black uppercase tracking-wider disabled:opacity-50"
                              >
                                Từ chối
                              </button>
                            </div>
                          ) : (
                            <p className="text-right text-xs font-bold text-viet-text-light">{executionUnfinished
                              ? 'Kết quả chưa được xác nhận. Hãy làm mới và kiểm tra dữ liệu trước khi tạo lại yêu cầu.'
                              : item.error || item.result?.message || item.executor?.username || ''}</p>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && nextCursor && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => fetchApprovals({ nextStatus: status, append: true, cursor: nextCursor })}
              disabled={loadingMore || Boolean(actingId)}
              className="inline-flex items-center gap-2 rounded-xl border border-viet-border bg-white px-5 py-2.5 text-sm font-bold text-viet-text transition-colors hover:text-viet-green disabled:opacity-60"
            >
              <RefreshCcw size={16} className={loadingMore ? 'animate-spin' : ''} />
              {loadingMore ? 'Đang tải...' : 'Tải thêm yêu cầu'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalManager;
