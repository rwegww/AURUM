import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toNonNegativeInteger } from '@/utils/teacherUi';

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
    className="bg-white rounded-[28px] sm:rounded-[32px] border border-viet-border p-5 sm:p-6 hover:shadow-md hover:border-viet-green/30 transition-all group"
  >
    <div className="flex justify-between items-start gap-4 mb-6">
      <div className="min-w-0">
        <h3 className="text-xl font-bold text-viet-text group-hover:text-viet-green transition-colors break-words">
          <Link to={`/teacher/lop/${id}`} className="rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-viet-green">
            {className || 'Lớp chưa đặt tên'}
          </Link>
        </h3>
        <p className="text-xs font-bold text-viet-text-light uppercase tracking-wider">
          {grade ? `Hóa học khối ${grade}` : 'Chưa xác định khối'}
        </p>
      </div>
      <div className="w-10 h-10 shrink-0 rounded-2xl bg-viet-green/10 text-viet-green flex items-center justify-center font-black" aria-hidden="true">
        {grade || '—'}
      </div>
    </div>

    <dl className="space-y-4">
      <div className="flex justify-between items-center gap-4 text-sm">
        <dt className="text-viet-text-light font-medium">Sĩ số</dt>
        <dd className="font-bold text-viet-text">{toNonNegativeInteger(students).toLocaleString('vi-VN')} học sinh</dd>
      </div>
      <div className="flex justify-between items-center gap-4 text-sm">
        <dt className="text-viet-text-light font-medium">Mã tham gia</dt>
        <dd className="font-bold text-viet-green select-all">{code || 'Chưa có'}</dd>
      </div>
    </dl>

    <div className="mt-6 pt-4 border-t border-viet-border flex justify-end">
      <Link
        to={`/teacher/lop/${id}`}
        className="inline-flex min-h-10 items-center rounded-lg px-2 text-xs font-bold text-viet-green hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-viet-green"
        aria-label={`Quản lý lớp ${className || ''}`.trim()}
      >
        Quản lý <span aria-hidden="true">→</span>
      </Link>
    </div>
  </motion.article>
);

const IconClass = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
    <path d="M3 21h18M3 10h18M5 10V5a2 2 0 012-2h10a2 2 0 012 2v5M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconStudents = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconTasks = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
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

  return (
    <div className="px-4 py-6 sm:p-8 sm:pb-24">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 sm:mb-12 flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-2xl bg-viet-green flex items-center justify-center text-white shadow-lg shadow-viet-green/20">
            <IconClass />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-viet-text tracking-tight">Bảng tóm tắt giáo viên</h1>
            <p className="text-sm sm:text-base text-viet-text-light font-medium">Quản lý lớp học và bài tập trên Aurum</p>
          </div>
        </header>

        {loadError && (
          <div role="alert" className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span>{loadError}</span>
            <button type="button" onClick={loadDashboard} disabled={loading} className="min-h-10 shrink-0 rounded-xl border border-amber-300 bg-white px-4 font-bold disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Đang tải…' : 'Thử lại'}
            </button>
          </div>
        )}

        {googleError && (
          <div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{googleError}</div>
        )}

        {googleNotice && (
          <div role="status" aria-live="polite" className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">{googleNotice}</div>
        )}

        <section aria-label="Số liệu tổng quan" aria-busy={loading} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-gradient-to-br from-viet-green/20 to-viet-green/5 p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] border border-viet-green/20 relative overflow-hidden group hover:shadow-xl hover:shadow-viet-green/5 transition-all duration-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-viet-green uppercase tracking-wider">Tổng số lớp</span>
              <div className="p-2 rounded-lg bg-viet-green/10 text-viet-green group-hover:scale-110 transition-transform"><IconClass /></div>
            </div>
            <p className="text-4xl font-black text-viet-text tracking-tight">{loading ? '…' : lop.length.toLocaleString('vi-VN')}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] border border-blue-500/20 relative overflow-hidden group hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Tổng số học sinh</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 group-hover:scale-110 transition-transform"><IconStudents /></div>
            </div>
            <p className="text-4xl font-black text-viet-text tracking-tight">{loading ? '…' : summary.total_students.toLocaleString('vi-VN')}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] border border-purple-500/20 relative overflow-hidden group hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Bài tập đang hoạt động</span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 group-hover:scale-110 transition-transform"><IconTasks /></div>
            </div>
            <p className="text-4xl font-black text-viet-text tracking-tight">{loading ? '…' : summary.active_assignments.toLocaleString('vi-VN')}</p>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h2 className="text-xl font-bold text-viet-text">Danh sách lớp học</h2>
          <Link to="/teacher/lop" className="inline-flex min-h-11 items-center justify-center px-4 py-2 bg-viet-text text-white rounded-xl text-sm font-bold shadow-md hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-viet-green">
            Quản lý lớp học <span className="ml-1" aria-hidden="true">→</span>
          </Link>
        </div>

        <section aria-label="Danh sách lớp học" aria-busy={loading} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div role="status" className="col-span-full py-10 text-center text-sm font-medium text-viet-text-light">
              <div className="w-8 h-8 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin mx-auto mb-3" aria-hidden="true" />
              Đang tải lớp học…
            </div>
          ) : lop.length === 0 ? (
            <div className="col-span-full py-10 px-4 text-center text-viet-text-light font-bold border-2 border-dashed border-viet-border rounded-2xl">
              <p className="mb-4">Chưa có lớp nào được tạo.</p>
              <Link to="/teacher/lop" className="inline-flex min-h-10 items-center rounded-xl bg-viet-green px-4 text-sm text-white">Tạo lớp đầu tiên</Link>
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

        <section aria-labelledby="linked-accounts-title" className="mt-12 bg-white rounded-[28px] sm:rounded-[32px] border border-viet-border p-5 sm:p-8 hover:shadow-md hover:border-viet-green/30 transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 shrink-0 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
                <path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 id="linked-accounts-title" className="text-xl font-bold text-viet-text">Tài khoản liên kết</h2>
              <p className="text-sm font-medium text-viet-text-light">Liên kết Google để đăng nhập nhanh hơn</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3 min-w-0">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-8 h-8 shrink-0" alt="" aria-hidden="true" />
              <div className="min-w-0">
                <div className="font-bold text-slate-800">Google</div>
                <div className="text-xs text-slate-500 font-medium">Đăng nhập nhanh bằng Google</div>
              </div>
            </div>
            {user?.linkedAccounts?.google ? (
              <div className="self-start sm:self-auto px-4 py-2 rounded-xl text-sm font-bold bg-green-50 text-green-700 border border-green-200">Đã liên kết</div>
            ) : (
              <button
                type="button"
                className="min-h-11 px-4 py-2 rounded-xl text-sm font-bold bg-white border border-slate-200 shadow-sm text-slate-600 hover:text-viet-green hover:border-viet-green transition-all disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleLinkGoogle}
                disabled={isLinkingGoogle}
              >
                {isLinkingGoogle ? 'Đang liên kết…' : 'Liên kết'}
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TeacherDashboard;
