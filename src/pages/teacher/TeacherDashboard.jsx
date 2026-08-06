import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toNonNegativeInteger } from '@/utils/teacherUi';
import { BookOpen, Users, FileText, ArrowUpRight, ArrowDownRight, RefreshCcw, Activity } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';

const fetchJson = async (url, signal, fallbackMessage) => {
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || fallbackMessage);
  }

  return data;
};

const ClassCard = ({ className, id, grade, students, code, delay }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-viet-green/50 transition-all group flex flex-col"
  >
    <div className="flex justify-between items-start gap-4 mb-4">
      <div className="min-w-0">
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-viet-green transition-colors break-words line-clamp-1">
          <Link to={`/teacher/lop/${id}`} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-viet-green rounded">
            {className || 'Lớp chưa đặt tên'}
          </Link>
        </h3>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
          {grade ? `Khối ${grade}` : 'Chưa xác định khối'}
        </p>
      </div>
      <div className="w-10 h-10 shrink-0 rounded-xl bg-viet-green/10 text-viet-green flex items-center justify-center font-black text-sm" aria-hidden="true">
        {grade || '—'}
      </div>
    </div>

    <div className="space-y-3 flex-1">
      <div className="flex justify-between items-center text-sm bg-slate-50 p-2.5 rounded-lg">
        <span className="text-slate-500 font-medium">Sĩ số</span>
        <span className="font-bold text-slate-800">{toNonNegativeInteger(students).toLocaleString('vi-VN')} hs</span>
      </div>
      <div className="flex justify-between items-center text-sm bg-slate-50 p-2.5 rounded-lg">
        <span className="text-slate-500 font-medium">Mã tham gia</span>
        <span className="font-bold text-viet-green select-all tracking-wider">{code || 'Chưa có'}</span>
      </div>
    </div>

    <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center">
      <span className="text-[10px] text-slate-400 font-bold uppercase">Hoạt động</span>
      <Link
        to={`/teacher/lop/${id}`}
        className="inline-flex items-center gap-1 rounded-lg text-xs font-bold text-viet-green hover:underline focus:outline-none"
        aria-label={`Quản lý lớp ${className || ''}`.trim()}
      >
        Chi tiết <ArrowUpRight size={14} />
      </Link>
    </div>
  </motion.article>
);

const TeacherDashboard = () => {
  const [lop, setClasses] = React.useState([]);
  const [summary, setSummary] = React.useState({ total_students: 0, active_assignments: 0 });
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState('');
  const [isLinkingGoogle, setIsLinkingGoogle] = React.useState(false);
  const [googleError, setGoogleError] = React.useState('');
  const [googleNotice, setGoogleNotice] = React.useState('');
  const dashboardRequestRef = React.useRef(null);
  const googleCallbackHandledRef = React.useRef(false);
  const { user, linkAccount } = useAuth();

  const loadDashboard = React.useCallback(async () => {
    dashboardRequestRef.current?.abort();
    const controller = new AbortController();
    dashboardRequestRef.current = controller;
    setLoading(true);
    setLoadError('');

    const [classesResult, summaryResult] = await Promise.allSettled([
      fetchJson('/api/classes', controller.signal, 'Không thể tải danh sách lớp học.'),
      fetchJson('/api/classes/teacher-summary', controller.signal, 'Không thể tải số liệu tổng quan.'),
    ]);

    if (controller.signal.aborted || dashboardRequestRef.current !== controller) return;

    const errors = [];
    if (classesResult.status === 'fulfilled') {
      if (Array.isArray(classesResult.value)) {
        setClasses(classesResult.value);
      } else {
        errors.push('Dữ liệu lớp học không đúng định dạng.');
      }
    } else if (classesResult.reason?.name !== 'AbortError') {
      errors.push(classesResult.reason?.message || 'Không thể tải danh sách lớp học.');
    }

    if (summaryResult.status === 'fulfilled' && summaryResult.value && typeof summaryResult.value === 'object') {
      setSummary({
        total_students: toNonNegativeInteger(summaryResult.value.total_students),
        active_assignments: toNonNegativeInteger(summaryResult.value.active_assignments),
      });
    } else if (summaryResult.status === 'rejected' && summaryResult.reason?.name !== 'AbortError') {
      errors.push(summaryResult.reason?.message || 'Không thể tải số liệu tổng quan.');
    } else if (summaryResult.status === 'fulfilled') {
      errors.push('Dữ liệu tổng quan không đúng định dạng.');
    }

    setLoadError([...new Set(errors)].join(' '));
    setLoading(false);
  }, []);

  React.useEffect(() => {
    const timer = window.setTimeout(loadDashboard, 0);
    return () => {
      window.clearTimeout(timer);
      dashboardRequestRef.current?.abort();
    };
  }, [loadDashboard]);

  React.useEffect(() => {
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.get('linking_google') !== 'true' || !user?.id || googleCallbackHandledRef.current) return undefined;

    googleCallbackHandledRef.current = true;
    let active = true;

    const completeGoogleLink = async () => {
      setIsLinkingGoogle(true);
      setGoogleError('');
      setGoogleNotice('');
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!data?.session?.user) throw new Error('Không tìm thấy phiên Google để liên kết. Vui lòng thử lại.');

        const providerUser = data.session.user;
        const result = await linkAccount('google', providerUser.id, providerUser.email);
        if (!result.success) throw new Error(result.message || 'Không thể liên kết tài khoản Google.');
        if (active) setGoogleNotice('Liên kết Google thành công!');
      } catch (error) {
        if (active) setGoogleError(`Lỗi liên kết Google: ${error.message}`);
      } finally {
        currentUrl.searchParams.delete('linking_google');
        const cleanUrl = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;
        window.history.replaceState({}, document.title, cleanUrl);
        if (active) setIsLinkingGoogle(false);
      }
    };

    completeGoogleLink();
    return () => {
      active = false;
    };
  }, [linkAccount, user?.id]);

  const handleLinkGoogle = async () => {
    if (isLinkingGoogle) return;
    setIsLinkingGoogle(true);
    setGoogleError('');
    setGoogleNotice('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/teacher?linking_google=true`,
          queryParams: { prompt: 'select_account' },
        },
      });
      if (error) throw error;
    } catch (error) {
      setIsLinkingGoogle(false);
      setGoogleError(`Lỗi liên kết Google: ${error.message}`);
    }
  };

  // Mock sparkline data
  const sparklineData = Array(7).fill(0).map(() => ({ value: Math.floor(Math.random() * 100) + 50 }));

  return (
    <div className="px-4 py-6 sm:p-6 lg:p-8 pb-24 space-y-6">
      
      {/* Messages */}
      {loadError && (
        <div role="alert" className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          <span>{loadError}</span>
          <button type="button" onClick={loadDashboard} disabled={loading} className="px-3 py-1.5 rounded-lg border border-red-300 bg-white font-bold text-red-600 disabled:opacity-60 flex items-center gap-1">
            <RefreshCcw size={14} /> Thử lại
          </button>
        </div>
      )}

      {googleError && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-800">{googleError}</div>
      )}

      {googleNotice && (
        <div role="status" aria-live="polite" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">{googleNotice}</div>
      )}

      {/* 3 Top Cards (Redesigned) */}
      <section aria-label="Số liệu tổng quan" aria-busy={loading} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100 text-blue-600">
              <BookOpen size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400">Số lượng</span>
          </div>
          <h3 className="text-sm font-bold text-slate-500 mb-1">Tổng số lớp</h3>
          <p className="text-3xl font-black text-slate-800">{loading ? '…' : lop.length.toLocaleString('vi-VN')}</p>
          
          <div className="flex items-center gap-2 mt-4 text-xs">
            <span className="font-bold flex items-center gap-0.5 text-green-500">
              <ArrowUpRight size={14} /> 12%
            </span>
            <span className="text-slate-400 font-medium">So với học kỳ trước</span>
          </div>

          <div className="absolute -bottom-2 -right-4 w-32 h-16 opacity-30 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-100 text-green-600">
              <Users size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400">Quy mô</span>
          </div>
          <h3 className="text-sm font-bold text-slate-500 mb-1">Tổng học sinh</h3>
          <p className="text-3xl font-black text-slate-800">{loading ? '…' : summary.total_students.toLocaleString('vi-VN')}</p>
          
          <div className="flex items-center gap-2 mt-4 text-xs">
            <span className="font-bold flex items-center gap-0.5 text-green-500">
              <ArrowUpRight size={14} /> 5%
            </span>
            <span className="text-slate-400 font-medium">So với tháng trước</span>
          </div>

          <div className="absolute -bottom-2 -right-4 w-32 h-16 opacity-30 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-100 text-purple-600">
              <FileText size={20} />
            </div>
            <span className="text-xs font-bold text-slate-400">Tiến độ</span>
          </div>
          <h3 className="text-sm font-bold text-slate-500 mb-1">Bài tập hoạt động</h3>
          <p className="text-3xl font-black text-slate-800">{loading ? '…' : summary.active_assignments.toLocaleString('vi-VN')}</p>
          
          <div className="flex items-center gap-2 mt-4 text-xs">
            <span className="font-bold flex items-center gap-0.5 text-orange-500">
              <ArrowDownRight size={14} /> 2%
            </span>
            <span className="text-slate-400 font-medium">Tuần này</span>
          </div>

          <div className="absolute -bottom-2 -right-4 w-32 h-16 opacity-30 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Class List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-viet-green" /> Lớp học của tôi
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">Quản lý danh sách lớp học và học sinh</p>
            </div>
            <Link to="/teacher/lop" className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md hover:bg-black transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-viet-green">
              Tạo lớp mới <span className="ml-1" aria-hidden="true">+</span>
            </Link>
          </div>

          <section aria-label="Danh sách lớp học" aria-busy={loading} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              <div role="status" className="col-span-full py-12 text-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-viet-green rounded-full animate-spin mx-auto mb-3" aria-hidden="true" />
                <span className="text-sm font-medium text-slate-500">Đang tải lớp học…</span>
              </div>
            ) : lop.length === 0 ? (
              <div className="col-span-full py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <p className="text-slate-500 font-bold mb-4">Chưa có lớp nào được tạo.</p>
                <Link to="/teacher/lop" className="inline-flex min-h-10 items-center rounded-xl bg-viet-green px-5 text-sm font-bold text-white shadow-sm hover:brightness-110">Bắt đầu tạo lớp</Link>
              </div>
            ) : (
              lop.map((cls, index) => (
                <ClassCard
                  key={cls.id}
                  className={cls.name}
                  id={cls.id}
                  grade={cls.khoi_id ?? cls.gradeLevelId}
                  students={cls.student_count}
                  code={cls.code}
                  delay={Math.min(index * 0.05, 0.3)}
                />
              ))
            )}
          </section>
        </div>

        {/* Linked Accounts */}
        <div className="space-y-6">
          <section aria-labelledby="linked-accounts-title" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h2 id="linked-accounts-title" className="text-base font-bold text-slate-800">Tài khoản liên kết</h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">Liên kết Google để đăng nhập nhanh</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 text-center sm:text-left sm:flex-row">
              <div className="flex items-center gap-3 w-full">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-8 h-8 shrink-0 bg-white p-1.5 rounded-full border border-slate-200 shadow-sm" alt="" aria-hidden="true" />
                <div className="min-w-0 flex-1 text-left">
                  <div className="text-sm font-bold text-slate-800">Google</div>
                  <div className="text-[11px] text-slate-500 font-medium">Đăng nhập nhanh 1 chạm</div>
                </div>
              </div>
              
              <div className="w-full sm:w-auto">
                {user?.linkedAccounts?.google ? (
                  <div className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold bg-green-50 text-green-700 border border-green-200 text-center">Đã liên kết</div>
                ) : (
                  <button
                    type="button"
                    className="w-full sm:w-auto min-h-9 px-4 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-300 shadow-sm text-slate-600 hover:text-viet-green hover:border-viet-green transition-all disabled:opacity-60"
                    onClick={handleLinkGoogle}
                    disabled={isLinkingGoogle}
                  >
                    {isLinkingGoogle ? 'Đang liên kết…' : 'Liên kết ngay'}
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;
