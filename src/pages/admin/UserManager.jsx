import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Eye, Lock, RefreshCcw, Search, Unlock } from 'lucide-react';
import { parseAdminMutationResponse } from '@/utils/adminApproval';

const PAGE_SIZE = 100;

const toSafeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : fallback;
};

const formatDate = (value) => {
  if (!value) return 'Không rõ';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Không rõ' : date.toLocaleDateString('vi-VN');
};

const getRoleLabel = (role) => {
  if (role === 'admin') return 'Quản trị viên';
  if (role === 'teacher') return 'Giáo viên';
  return 'Học sinh';
};

const mergeUniqueUsers = (current, incoming) => {
  const usersById = new Map(current.map((user) => [user.id, user]));
  incoming.forEach((user) => usersById.set(user.id, user));
  return Array.from(usersById.values());
};

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionNotice, setActionNotice] = useState('');
  const [actingId, setActingId] = useState(null);
  const [pendingApprovalIds, setPendingApprovalIds] = useState(() => new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const requestSequence = useRef(0);

  const fetchUsers = useCallback(async ({ signal, background = false, append = false, cursor = null } = {}) => {
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
      const res = await fetch(`/api/admin/nguoi_dung?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || 'Không thể tải danh sách người dùng.');
      if (!Array.isArray(data)) throw new Error('Dữ liệu người dùng trả về không hợp lệ.');

      if (requestId === requestSequence.current) {
        setUsers((current) => append ? mergeUniqueUsers(current, data) : data);
        setNextCursor(res.headers.get('X-Next-Cursor') || null);
        if (!append) setPendingApprovalIds(new Set());
      }
    } catch (err) {
      if (err.name === 'AbortError' || requestId !== requestSequence.current) return;
      console.error('Lỗi tải danh sách người dùng:', err);
      setLoadError(err.message || 'Không thể tải danh sách người dùng.');
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
    const timeoutId = window.setTimeout(() => fetchUsers({ signal: controller.signal }), 0);
    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const keyword = searchTerm.trim().toLocaleLowerCase('vi');
    if (!keyword) return users;
    return users.filter((user) => String(user?.username || '').toLocaleLowerCase('vi').includes(keyword));
  }, [searchTerm, users]);

  const toggleUserLock = async (user) => {
    if (!user?.id || user.role === 'admin' || actingId || pendingApprovalIds.has(user.id)) return;

    const shouldLock = !user.is_locked;
    const confirmed = window.confirm(
      `Bạn có chắc muốn ${shouldLock ? 'khóa' : 'mở khóa'} tài khoản ${user.username || 'này'}? Yêu cầu sẽ cần quản trị viên thứ hai xác nhận.`,
    );
    if (!confirmed) return;

    setActingId(user.id);
    setActionError('');
    setActionNotice('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');

      const res = await fetch(`/api/admin/nguoi_dung/${encodeURIComponent(user.id)}/lock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isLocked: shouldLock }),
      });
      const result = await parseAdminMutationResponse(res);
      setActionNotice(result.message);

      if (result.pendingApproval) {
        setPendingApprovalIds((current) => new Set(current).add(user.id));
      } else {
        setPendingApprovalIds((current) => {
          const next = new Set(current);
          next.delete(user.id);
          return next;
        });
        setUsers((current) => current.map((item) => (
          item.id === user.id ? { ...item, is_locked: shouldLock } : item
        )));
      }
    } catch (err) {
      console.error('Lỗi thay đổi trạng thái tài khoản:', err);
      const message = err.message || 'Không thể thay đổi trạng thái tài khoản.';
      setActionError(message);
    } finally {
      setActingId(null);
    }
  };

  const isFetching = loading || refreshing || loadingMore;

  return (
    <div className="p-4 sm:p-8 pb-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link to="/admin" className="text-viet-green font-bold text-xs mb-2 block hover:underline">← Quay lại Bảng điều khiển</Link>
            <h1 className="text-3xl font-bold text-viet-text tracking-tight">Quản lý <span className="text-viet-green">người dùng</span></h1>
            <p className="text-viet-text-light mt-1 font-medium italic">Theo dõi hoạt động, tiến độ và trạng thái tài khoản.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <label className="relative w-full md:w-80">
              <span className="sr-only">Tìm kiếm theo tên người dùng</span>
              <input
                type="search"
                placeholder="Tìm kiếm tên người dùng..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-2xl border border-viet-border bg-white text-sm font-bold focus:border-viet-green focus:shadow-lg shadow-viet-green/5 transition-all outline-none"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-viet-text-light pointer-events-none" aria-hidden="true" />
            </label>
            <button
              type="button"
              onClick={() => fetchUsers({ background: users.length > 0 })}
              disabled={isFetching || Boolean(actingId)}
              className="h-12 inline-flex items-center justify-center gap-2 px-4 rounded-2xl border border-viet-border bg-white text-xs font-black text-viet-text hover:text-viet-green disabled:opacity-50"
            >
              <RefreshCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} aria-hidden="true" />
              Làm mới
            </button>
          </div>
        </header>

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
            <span className="mt-4 text-sm font-bold text-viet-text-light">Đang tải danh sách người dùng...</span>
          </div>
        ) : loadError && users.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-viet-border px-6 py-20 text-center">
            <p className="text-viet-text-light font-bold">Danh sách chưa thể tải.</p>
            <button type="button" onClick={() => fetchUsers()} className="mt-5 rounded-xl bg-viet-green px-5 py-2.5 text-sm font-bold text-white">Thử lại</button>
          </div>
        ) : (
          <div className="bg-white rounded-[24px] sm:rounded-[32px] border border-viet-border overflow-hidden shadow-sm" aria-busy={refreshing || loadingMore}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <caption className="sr-only">Danh sách tài khoản trong hệ thống</caption>
                <thead className="bg-viet-bg/30 border-b border-viet-border">
                  <tr>
                    <th scope="col" className="px-8 py-5 text-[11px] font-black text-viet-text-light uppercase tracking-widest">Người dùng</th>
                    <th scope="col" className="px-8 py-5 text-[11px] font-black text-viet-text-light uppercase tracking-widest text-center">Cấp độ</th>
                    <th scope="col" className="px-8 py-5 text-[11px] font-black text-viet-text-light uppercase tracking-widest text-center">Hoạt động</th>
                    <th scope="col" className="px-8 py-5 text-[11px] font-black text-viet-text-light uppercase tracking-widest text-center">Tiến trình</th>
                    <th scope="col" className="px-8 py-5 text-[11px] font-black text-viet-text-light uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-viet-border">
                  {filteredUsers.map((user, index) => {
                    const username = String(user?.username || 'Không có tên');
                    const xp = toSafeNumber(user?.xp);
                    const level = Math.max(1, Math.floor(toSafeNumber(user?.level, 1)));
                    const activeMinutes = Math.floor(toSafeNumber(user?.active_minutes));
                    const progress = (xp % 1000) / 10;
                    const isPending = pendingApprovalIds.has(user.id);
                    const isActing = actingId === user.id;
                    const isProtectedAdmin = user.role === 'admin';

                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: Math.min(index * 0.03, 0.3) }}
                        className={`hover:bg-viet-bg/10 transition-colors ${user.is_locked ? 'bg-red-50/30 opacity-80' : ''}`}
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-viet-text font-black border border-viet-border" aria-hidden="true">{username.charAt(0).toUpperCase() || '?'}</div>
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${user.isOnline ? 'bg-green-500' : 'bg-slate-300'}`} aria-hidden="true" />
                              <span className="sr-only">{user.isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-viet-text flex flex-wrap items-center gap-2">
                                <span className="break-all">{username}</span>
                                <span className="bg-blue-50 text-blue-700 text-[8px] px-1.5 py-0.5 rounded font-black uppercase">{getRoleLabel(user.role)}</span>
                                {user.is_locked && <span className="bg-red-100 text-red-700 text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest">Đã khóa</span>}
                              </p>
                              <p className="text-[10px] text-viet-text-light font-medium uppercase mt-0.5">Tham gia: {formatDate(user.createdAt)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="flex flex-col items-center">
                            <span className={`px-3 py-1 rounded-lg text-xs font-black ring-1 ${user.is_locked ? 'bg-red-50 text-red-600 ring-red-200' : 'bg-yellow-50 text-yellow-700 ring-yellow-200'}`}>Lv {level}</span>
                            <span className="text-[10px] font-bold text-viet-text-light/60 mt-1 uppercase tracking-tighter">{xp.toLocaleString('vi-VN')} XP</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-sm font-black text-viet-text">{activeMinutes >= 60 ? `${Math.floor(activeMinutes / 60)} giờ ${activeMinutes % 60} phút` : `${activeMinutes} phút`}</span>
                            <span className="text-[10px] font-bold text-viet-text-light/60 uppercase tracking-tighter">Tổng thời gian</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="max-w-[120px] mx-auto">
                            <div className="flex justify-between text-[10px] font-bold text-viet-text-light mb-1.5 uppercase tracking-tighter">
                              <span>Cấp hiện tại</span>
                              <span>{progress.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-viet-bg rounded-full overflow-hidden" role="progressbar" aria-label={`Tiến trình cấp độ của ${username}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
                              <div className="h-full bg-viet-green" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => toggleUserLock(user)}
                              disabled={Boolean(actingId) || isPending || isProtectedAdmin}
                              aria-label={`${user.is_locked ? 'Mở khóa' : 'Khóa'} tài khoản ${username}`}
                              title={isProtectedAdmin ? 'Tài khoản quản trị viên được bảo vệ để duy trì cơ chế hai người duyệt' : isPending ? 'Đang chờ quản trị viên khác xác nhận' : undefined}
                              className={`px-3 py-1.5 flex items-center gap-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all disabled:cursor-not-allowed disabled:opacity-50 ${user.is_locked ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
                            >
                              {isActing ? (
                                <><RefreshCcw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> Đang gửi</>
                              ) : isPending ? (
                                <>Chờ duyệt</>
                              ) : isProtectedAdmin ? (
                                <>Được bảo vệ</>
                              ) : user.is_locked ? (
                                <><Unlock className="w-3.5 h-3.5" aria-hidden="true" /> Mở khóa</>
                              ) : (
                                <><Lock className="w-3.5 h-3.5" aria-hidden="true" /> Khóa</>
                              )}
                            </button>
                            {user.role !== 'admin' && (
                              <Link
                                to={`/admin/nguoi_dung/${encodeURIComponent(user.id)}`}
                                className="p-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-white text-slate-500 hover:text-blue-600 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                                aria-label={`Xem chi tiết ${username}`}
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" aria-hidden="true" />
                              </Link>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="py-20 px-6 text-center flex flex-col items-center">
                <Search className="w-12 h-12 text-viet-text-light/40 mb-4" aria-hidden="true" />
                <p className="text-viet-text-light font-bold">{searchTerm.trim() ? 'Không tìm thấy người dùng khớp với từ khóa trong dữ liệu đã tải.' : 'Hệ thống chưa có người dùng nào.'}</p>
              </div>
            )}
            {nextCursor && (
              <div className="border-t border-viet-border p-5 text-center">
                <button
                  type="button"
                  onClick={() => fetchUsers({ append: true, cursor: nextCursor })}
                  disabled={isFetching}
                  className="inline-flex items-center gap-2 rounded-xl border border-viet-border bg-white px-5 py-2.5 text-sm font-bold text-viet-green hover:bg-viet-bg disabled:opacity-50"
                >
                  <RefreshCcw className={`w-4 h-4 ${loadingMore ? 'animate-spin' : ''}`} aria-hidden="true" />
                  {loadingMore ? 'Đang tải...' : 'Tải thêm người dùng'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;
