import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock3, RefreshCcw, ShieldCheck, XCircle } from 'lucide-react';
import { parseAdminMutationResponse } from '@/utils/adminApproval';

const statusConfig = {
  pending: { label: 'Chờ duyệt', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock3 },
  executed: { label: 'Đã thực thi', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  rejected: { label: 'Đã từ chối', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
  failed: { label: 'Lỗi thực thi', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: XCircle },
};

const summarizePayload = (payload = {}) => {
  if (payload.id && Object.keys(payload).length <= 2) return `ID: ${payload.id}`;
  if (payload.lesson?.title) return payload.lesson.title;
  if (payload.id && payload.lesson) return `ID: ${payload.id}`;
  return JSON.stringify(payload).slice(0, 140);
};

const ApprovalManager = () => {
  const [approvals, setApprovals] = useState([]);
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const tabs = useMemo(() => Object.keys(statusConfig), []);

  const fetchApprovals = async (nextStatus = status) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/approvals?status=${nextStatus}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Không tải được danh sách yêu cầu duyệt.');
      setApprovals(data);
    } catch (err) {
      console.error('Lỗi tải yêu cầu duyệt:', err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals(status);
  }, [status]);

  const approveRequest = async (id) => {
    setActingId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/approvals/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await parseAdminMutationResponse(res);
      alert(result.message || 'Thay đổi đã được xác nhận và thực thi.');
      await fetchApprovals(status);
    } catch (err) {
      console.error('Lỗi xác nhận yêu cầu duyệt:', err);
      alert(err.message);
    } finally {
      setActingId(null);
    }
  };

  const rejectRequest = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu này?')) return;
    setActingId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/approvals/${id}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Không thể từ chối yêu cầu.');
      alert(data.message || 'Đã từ chối yêu cầu thay đổi.');
      await fetchApprovals(status);
    } catch (err) {
      console.error('Lỗi từ chối yêu cầu duyệt:', err);
      alert(err.message);
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="p-8 pb-12">
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
            onClick={() => fetchApprovals(status)}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-viet-border rounded-2xl text-xs font-black text-viet-text hover:text-viet-green transition-all"
          >
            <RefreshCcw size={16} /> Làm mới
          </button>
        </header>

        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((tab) => {
            const Icon = statusConfig[tab].icon;
            return (
              <button
                key={tab}
                onClick={() => setStatus(tab)}
                className={`px-5 py-2.5 rounded-2xl border text-xs font-black flex items-center gap-2 transition-all ${
                  status === tab ? statusConfig[tab].color : 'bg-white border-viet-border text-viet-text-light hover:text-viet-text'
                }`}
              >
                <Icon size={15} /> {statusConfig[tab].label}
              </button>
            );
          })}
        </div>

        {loading ? (
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
              <table className="w-full text-left">
                <thead className="bg-viet-bg/40 border-b border-viet-border">
                  <tr>
                    <th className="px-6 py-4 text-[11px] font-black text-viet-text-light uppercase tracking-widest">Thay đổi</th>
                    <th className="px-6 py-4 text-[11px] font-black text-viet-text-light uppercase tracking-widest">Người tạo</th>
                    <th className="px-6 py-4 text-[11px] font-black text-viet-text-light uppercase tracking-widest text-center">Xác nhận</th>
                    <th className="px-6 py-4 text-[11px] font-black text-viet-text-light uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-viet-border">
                  {approvals.map((item) => {
                    const cfg = statusConfig[item.status] || statusConfig.pending;
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
                              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{new Date(item.createdAt).toLocaleString('vi-VN')}</p>
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
                                onClick={() => approveRequest(item.id)}
                                disabled={actingId === item.id}
                                className="px-4 py-2 bg-viet-green text-white rounded-xl text-xs font-black uppercase tracking-wider disabled:opacity-50"
                              >
                                Xác nhận
                              </button>
                              <button
                                onClick={() => rejectRequest(item.id)}
                                disabled={actingId === item.id}
                                className="px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-black uppercase tracking-wider disabled:opacity-50"
                              >
                                Từ chối
                              </button>
                            </div>
                          ) : (
                            <p className="text-right text-xs font-bold text-viet-text-light">{item.error || item.executor?.username || ''}</p>
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
      </div>
    </div>
  );
};

export default ApprovalManager;
