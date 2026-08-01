import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { parseAdminMutationResponse } from '@/utils/adminApproval';
import {
  getVideoEmbedUrl,
  isExternalEmbedVideo,
  normalizeHttpUrl,
} from '@/utils/videoLinks';
import {
  formatTeacherDateTime,
  localDateTimeToIso,
  toDateTimeLocalValue,
  toNonNegativeInteger,
} from '@/utils/teacherUi';

const EMPTY_POST = {
  content: '',
  type: 'announcement',
  media_url: '',
  deadline: '',
  hoc_sinh_nhan_id: '',
};
const EMPTY_SCHEDULE = { title: '', start_time: '', meet_url: '' };

const fetchClassJson = async (url, token, signal, fallbackMessage) => {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || data.error || fallbackMessage);
  return data;
};

const memberName = (member) => {
  const username = typeof member?.username === 'string' ? member.username.trim() : '';
  return username || 'Học sinh';
};

const MessageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false">
    <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4v8z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const VideoAttachment = ({ url, title }) => {
  const normalizedUrl = normalizeHttpUrl(url);
  if (!normalizedUrl) {
    return <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">Đường dẫn video không hợp lệ.</p>;
  }

  const embedUrl = isExternalEmbedVideo(normalizedUrl) ? getVideoEmbedUrl(normalizedUrl) : '';
  const canEmbed = embedUrl.startsWith('https://www.youtube.com/embed/')
    || embedUrl.startsWith('https://player.vimeo.com/video/');

  if (!canEmbed) {
    return (
      <a href={normalizedUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-viet-border bg-slate-50 px-4 text-sm font-bold text-viet-green hover:bg-white hover:underline">
        Mở video trong thẻ mới
      </a>
    );
  }

  return (
    <div className="w-full aspect-video rounded-xl bg-black overflow-hidden mt-2">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
};

const SectionError = ({ message, retry, busy }) => (
  <div role="alert" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
    <p>{message}</p>
    <button type="button" onClick={retry} disabled={busy} className="mt-3 min-h-10 rounded-xl border border-amber-300 bg-white px-4 font-bold disabled:cursor-not-allowed disabled:opacity-60">
      {busy ? 'Đang tải…' : 'Thử lại'}
    </button>
  </div>
);

const ClassDetail = () => {
  const { id } = useParams();
  const [cls, setCls] = useState(null);
  const [posts, setPosts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [sectionErrors, setSectionErrors] = useState({ posts: '', schedules: '', members: '' });
  const [newPost, setNewPost] = useState(EMPTY_POST);
  const [newSchedule, setNewSchedule] = useState(EMPTY_SCHEDULE);
  const [postError, setPostError] = useState('');
  const [scheduleError, setScheduleError] = useState('');
  const [postNotice, setPostNotice] = useState('');
  const [scheduleNotice, setScheduleNotice] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [referenceTime, setReferenceTime] = useState(0);
  const dataRequestRef = useRef(null);
  const postRequestRef = useRef(null);
  const scheduleRequestRef = useRef(null);
  const postFormRef = useRef(null);
  const postContentRef = useRef(null);

  const fetchClassData = useCallback(async (initialLoad = false) => {
    dataRequestRef.current?.abort();
    const controller = new AbortController();
    dataRequestRef.current = controller;

    if (initialLoad) {
      setLoading(true);
      setCls(null);
      setPosts([]);
      setSchedules([]);
      setMembers([]);
    } else {
      setRefreshing(true);
    }
    setLoadError('');
    setSectionErrors({ posts: '', schedules: '', members: '' });

    const token = localStorage.getItem('token');
    const [classResult, postsResult, schedulesResult, membersResult] = await Promise.allSettled([
      fetchClassJson(`/api/classes/${id}`, token, controller.signal, 'Không thể tải thông tin lớp học.'),
      fetchClassJson(`/api/classes/${id}/posts`, token, controller.signal, 'Không thể tải bài đăng.'),
      fetchClassJson(`/api/classes/${id}/schedules`, token, controller.signal, 'Không thể tải lịch học.'),
      fetchClassJson(`/api/classes/${id}/members`, token, controller.signal, 'Không thể tải danh sách học viên.'),
    ]);

    if (controller.signal.aborted || dataRequestRef.current !== controller) return;

    if (classResult.status === 'fulfilled' && classResult.value && typeof classResult.value === 'object' && !Array.isArray(classResult.value)) {
      setCls(classResult.value);
    } else {
      if (initialLoad) setCls(null);
      setLoadError(classResult.status === 'rejected'
        ? classResult.reason?.message || 'Không thể tải thông tin lớp học.'
        : 'Thông tin lớp học không đúng định dạng.');
    }

    const errors = { posts: '', schedules: '', members: '' };
    const updateCollection = (result, key, setter, invalidMessage) => {
      if (result.status === 'fulfilled' && Array.isArray(result.value)) {
        setter(result.value);
      } else {
        errors[key] = result.status === 'rejected'
          ? result.reason?.message || invalidMessage
          : invalidMessage;
      }
    };

    updateCollection(postsResult, 'posts', setPosts, 'Dữ liệu bài đăng không đúng định dạng.');
    updateCollection(schedulesResult, 'schedules', setSchedules, 'Dữ liệu lịch học không đúng định dạng.');
    updateCollection(membersResult, 'members', setMembers, 'Dữ liệu học viên không đúng định dạng.');
    setSectionErrors(errors);
    setReferenceTime(Date.now());
    setLoading(false);
    setRefreshing(false);
  }, [id]);

  useEffect(() => {
    const timer = window.setTimeout(() => fetchClassData(true), 0);
    return () => {
      window.clearTimeout(timer);
      dataRequestRef.current?.abort();
      postRequestRef.current?.abort();
      scheduleRequestRef.current?.abort();
    };
  }, [fetchClassData]);

  const handleCreatePost = async (event) => {
    event.preventDefault();
    if (isPosting) return;

    const content = newPost.content.trim();
    if (!content) {
      setPostError('Vui lòng nhập nội dung bài đăng.');
      return;
    }

    let mediaUrl = null;
    if (newPost.type === 'video') {
      mediaUrl = normalizeHttpUrl(newPost.media_url);
      if (!mediaUrl) {
        setPostError('Vui lòng nhập đường dẫn video HTTP(S) hợp lệ.');
        return;
      }
    }

    let deadline = null;
    if (newPost.type === 'assignment' && newPost.deadline) {
      deadline = localDateTimeToIso(newPost.deadline);
      if (!deadline) {
        setPostError('Hạn nộp không hợp lệ.');
        return;
      }
      if (new Date(deadline).getTime() <= Date.now()) {
        setPostError('Hạn nộp phải ở thời điểm trong tương lai.');
        return;
      }
    }

    postRequestRef.current?.abort();
    const controller = new AbortController();
    postRequestRef.current = controller;
    setIsPosting(true);
    setPostError('');
    setPostNotice('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/classes/${id}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          type: newPost.type,
          media_url: mediaUrl,
          deadline,
          hoc_sinh_nhan_id: newPost.hoc_sinh_nhan_id || null,
        }),
        signal: controller.signal,
      });
      const result = await parseAdminMutationResponse(response);
      if (controller.signal.aborted) return;

      setPostNotice(result.message || 'Đã gửi bài đăng.');
      if (!result.pendingApproval && result.data?.id) {
        const targetMember = members.find((member) => member.id === newPost.hoc_sinh_nhan_id);
        const createdPost = targetMember && !result.data.target
          ? { ...result.data, target: { username: memberName(targetMember) } }
          : result.data;
        setPosts((current) => [createdPost, ...current.filter((post) => post.id !== createdPost.id)]);
        setSectionErrors((current) => ({ ...current, posts: '' }));
      } else if (!result.pendingApproval) {
        await fetchClassData(false);
      }
      setNewPost(EMPTY_POST);
    } catch (error) {
      if (error.name !== 'AbortError') setPostError(error.message || 'Không thể tạo bài đăng.');
    } finally {
      if (postRequestRef.current === controller && !controller.signal.aborted) setIsPosting(false);
    }
  };

  const handleCreateSchedule = async (event) => {
    event.preventDefault();
    if (isScheduling) return;

    const title = newSchedule.title.trim();
    const startTime = localDateTimeToIso(newSchedule.start_time);
    if (!title) {
      setScheduleError('Vui lòng nhập tiêu đề buổi học.');
      return;
    }
    if (!startTime || new Date(startTime).getTime() <= Date.now()) {
      setScheduleError('Thời gian bắt đầu phải ở thời điểm trong tương lai.');
      return;
    }

    const meetUrl = newSchedule.meet_url ? normalizeHttpUrl(newSchedule.meet_url) : '';
    if (newSchedule.meet_url && !meetUrl) {
      setScheduleError('Đường dẫn phòng học phải là URL HTTP(S) hợp lệ.');
      return;
    }

    scheduleRequestRef.current?.abort();
    const controller = new AbortController();
    scheduleRequestRef.current = controller;
    setIsScheduling(true);
    setScheduleError('');
    setScheduleNotice('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/classes/${id}/schedules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, start_time: startTime, meet_url: meetUrl || null }),
        signal: controller.signal,
      });
      const result = await parseAdminMutationResponse(response);
      if (controller.signal.aborted) return;

      setScheduleNotice(result.message || 'Đã gửi lịch học.');
      if (!result.pendingApproval && result.data?.id) {
        setSchedules((current) => [result.data, ...current.filter((schedule) => schedule.id !== result.data.id)]
          .sort((left, right) => new Date(left.start_time).getTime() - new Date(right.start_time).getTime()));
        setSectionErrors((current) => ({ ...current, schedules: '' }));
      } else if (!result.pendingApproval) {
        await fetchClassData(false);
      }
      setNewSchedule(EMPTY_SCHEDULE);
    } catch (error) {
      if (error.name !== 'AbortError') setScheduleError(error.message || 'Không thể tạo lịch học.');
    } finally {
      if (scheduleRequestRef.current === controller && !controller.signal.aborted) setIsScheduling(false);
    }
  };

  const handlePostTypeChange = (type) => {
    setNewPost((current) => ({
      ...current,
      type,
      media_url: type === 'video' ? current.media_url : '',
      deadline: type === 'assignment' ? current.deadline : '',
    }));
    setPostError('');
  };

  const startPrivateMessage = (studentId) => {
    setNewPost((current) => ({
      ...current,
      type: 'announcement',
      media_url: '',
      deadline: '',
      hoc_sinh_nhan_id: studentId,
    }));
    setPostError('');
    window.requestAnimationFrame(() => {
      postFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      postContentRef.current?.focus({ preventScroll: true });
    });
  };

  const minimumDateTime = referenceTime ? toDateTimeLocalValue(referenceTime + 60_000) : '';

  if (loading) {
    return (
      <div role="status" className="px-4 py-12 sm:p-8 flex flex-col items-center justify-center gap-3 text-sm font-medium text-viet-text-light">
        <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin" aria-hidden="true" />
        Đang tải thông tin lớp học…
      </div>
    );
  }

  if (!cls) {
    return (
      <div className="px-4 py-10 sm:p-8">
        <div role="alert" className="max-w-xl mx-auto rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h1 className="text-xl font-black text-red-800">Không thể mở lớp học</h1>
          <p className="mt-2 text-sm text-red-700">{loadError || 'Không tìm thấy thông tin lớp học.'}</p>
          <div className="mt-5 flex flex-col-reverse sm:flex-row justify-center gap-3">
            <Link to="/teacher/lop" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-sm font-bold text-red-800">Quay lại danh sách</Link>
            <button type="button" onClick={() => fetchClassData(true)} className="min-h-11 rounded-xl bg-red-700 px-4 text-sm font-bold text-white">Thử lại</button>
          </div>
        </div>
      </div>
    );
  }

  const grade = cls.khoi_id ?? cls.gradeLevelId;

  return (
    <div className="px-4 py-6 sm:p-8 sm:pb-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <header className="lg:col-span-12 mb-2 sm:mb-6">
          <Link to="/teacher/lop" className="inline-flex min-h-10 items-center rounded-lg text-viet-green font-bold text-xs hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-viet-green">← Quay lại danh sách lớp</Link>
          <div className="bg-white p-5 sm:p-8 rounded-[28px] sm:rounded-[32px] border border-viet-border shadow-sm">
            <h1 className="text-2xl sm:text-3xl font-black text-viet-text uppercase tracking-tight break-words">{cls.name || 'Lớp chưa đặt tên'}</h1>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm sm:text-base text-viet-text-light font-medium">
              <span>{grade ? `Khối ${grade}` : 'Chưa xác định khối'}</span>
              <span aria-hidden="true">•</span>
              <span>Mã tham gia:</span>
              <strong className="text-viet-green bg-viet-green/10 px-2 py-1 rounded select-all">{cls.code || 'Chưa có'}</strong>
            </p>
          </div>
        </header>

        {loadError && (
          <div role="alert" className="lg:col-span-12 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <span>{loadError} Thông tin đang hiển thị có thể chưa được cập nhật.</span>
            <button type="button" onClick={() => fetchClassData(false)} disabled={refreshing} className="min-h-10 shrink-0 rounded-xl border border-amber-300 bg-white px-4 font-bold disabled:opacity-60">{refreshing ? 'Đang tải…' : 'Thử lại'}</button>
          </div>
        )}

        <main className="lg:col-span-8 space-y-6">
          <section ref={postFormRef} className="scroll-mt-6 bg-white p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] border border-viet-border shadow-sm" aria-labelledby="new-post-title">
            <h2 id="new-post-title" className="text-sm font-black text-viet-text uppercase tracking-widest mb-4">Tạo bài đăng mới</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              {postError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{postError}</p>}
              {postNotice && <p role="status" aria-live="polite" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{postNotice}</p>}
              <div>
                <label htmlFor="post-content" className="mb-1 block text-xs font-bold text-viet-text-light">Nội dung</label>
                <textarea
                  ref={postContentRef}
                  id="post-content"
                  value={newPost.content}
                  onChange={(event) => setNewPost((current) => ({ ...current, content: event.target.value }))}
                  className="w-full min-h-28 p-4 rounded-xl border border-viet-border bg-slate-50 outline-none focus:border-viet-green focus:ring-2 focus:ring-viet-green/20 focus:bg-white transition-colors text-sm font-medium resize-y"
                  placeholder="Chia sẻ bài giảng, thông báo hoặc bài tập với lớp…"
                  maxLength={10000}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="post-type" className="mb-1 block text-xs font-bold text-viet-text-light">Loại bài đăng</label>
                  <select id="post-type" value={newPost.type} onChange={(event) => handlePostTypeChange(event.target.value)} className="w-full h-11 px-4 rounded-xl border border-viet-border outline-none text-xs font-bold text-viet-text focus:border-viet-green focus:ring-2 focus:ring-viet-green/20">
                    <option value="announcement">Thông báo</option>
                    <option value="video">Video bài giảng</option>
                    <option value="assignment">Bài tập</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="post-recipient" className="mb-1 block text-xs font-bold text-viet-text-light">Người nhận</label>
                  <select id="post-recipient" value={newPost.hoc_sinh_nhan_id} onChange={(event) => setNewPost((current) => ({ ...current, hoc_sinh_nhan_id: event.target.value }))} className="w-full h-11 px-4 rounded-xl border border-viet-border outline-none text-xs font-bold text-viet-text focus:border-viet-green focus:ring-2 focus:ring-viet-green/20">
                    <option value="">Cả lớp</option>
                    {members.map((member) => <option key={member.id} value={member.id}>{memberName(member)}</option>)}
                  </select>
                </div>

                {newPost.type === 'video' && (
                  <div className="sm:col-span-2">
                    <label htmlFor="post-video" className="mb-1 block text-xs font-bold text-viet-text-light">Đường dẫn video</label>
                    <input id="post-video" type="url" placeholder="https://youtube.com/watch?v=…" maxLength={2048} value={newPost.media_url} onChange={(event) => setNewPost((current) => ({ ...current, media_url: event.target.value }))} className="w-full h-11 px-4 rounded-xl border border-viet-border outline-none text-xs focus:border-viet-green focus:ring-2 focus:ring-viet-green/20" required />
                  </div>
                )}
                {newPost.type === 'assignment' && (
                  <div className="sm:col-span-2">
                    <label htmlFor="post-deadline" className="mb-1 block text-xs font-bold text-viet-text-light">Hạn nộp (không bắt buộc)</label>
                    <input id="post-deadline" type="datetime-local" min={minimumDateTime} value={newPost.deadline} onChange={(event) => setNewPost((current) => ({ ...current, deadline: event.target.value }))} className="w-full h-11 px-4 rounded-xl border border-viet-border outline-none text-xs focus:border-viet-green focus:ring-2 focus:ring-viet-green/20" />
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={isPosting} className="w-full sm:w-auto min-h-11 px-6 py-2 bg-viet-green text-white font-black uppercase text-xs tracking-widest rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-viet-green/20 disabled:cursor-not-allowed disabled:opacity-60">
                  {isPosting ? 'Đang đăng…' : 'Đăng bài'}
                </button>
              </div>
            </form>
          </section>

          <section className="space-y-4" aria-labelledby="post-history-title">
            <h2 id="post-history-title" className="text-xs font-black text-viet-text-light uppercase tracking-widest pl-2">Lịch sử bài đăng</h2>
            {sectionErrors.posts ? (
              <SectionError message={sectionErrors.posts} retry={() => fetchClassData(false)} busy={refreshing} />
            ) : posts.length === 0 ? (
              <p className="rounded-2xl border-2 border-dashed border-viet-border px-4 py-8 text-center text-sm font-medium text-viet-text-light">Chưa có bài đăng nào trong lớp.</p>
            ) : (
              posts.map((post) => {
                const authorName = typeof post.author?.username === 'string' && post.author.username.trim() ? post.author.username.trim() : 'Giáo viên';
                return (
                  <motion.article key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 sm:p-6 rounded-[24px] border border-viet-border shadow-sm flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-viet-border">
                        <img src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(authorName)}`} alt="" className="w-full h-full object-cover" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-viet-text truncate">{authorName}</p>
                        <p className="text-[10px] font-bold text-viet-text-light uppercase">{formatTeacherDateTime(post.created_at)}</p>
                      </div>
                      <div className="w-full sm:w-auto sm:ml-auto flex flex-wrap items-center gap-2">
                        {post.target && <span className="max-w-full truncate px-2 py-1 bg-purple-50 text-purple-700 font-black text-[10px] rounded-lg tracking-widest uppercase">Gửi riêng: {post.target.username || 'Học sinh'}</span>}
                        {post.type === 'video' && <span className="px-2 py-1 bg-red-50 text-red-600 font-black text-[10px] rounded-lg tracking-widest uppercase">Video</span>}
                        {post.type === 'assignment' && <span className="px-2 py-1 bg-blue-50 text-blue-600 font-black text-[10px] rounded-lg tracking-widest uppercase">Bài tập</span>}
                        {post.type === 'announcement' && <span className="px-2 py-1 bg-orange-50 text-orange-600 font-black text-[10px] rounded-lg tracking-widest uppercase">Thông báo</span>}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-viet-text whitespace-pre-wrap break-words leading-relaxed">{post.content}</div>
                    {post.media_url && post.type === 'video' && <VideoAttachment url={post.media_url} title={`Video bài đăng của ${authorName}`} />}
                    {post.deadline && (
                      <div className="mt-2 py-3 px-4 bg-red-50 border border-red-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-red-600 text-[11px] font-black uppercase tracking-widest">Hạn nộp</span>
                        <span className="text-red-700 font-bold text-sm bg-white px-2 py-1 rounded border border-red-100">{formatTeacherDateTime(post.deadline)}</span>
                      </div>
                    )}
                  </motion.article>
                );
              })
            )}
          </section>
        </main>

        <aside className="lg:col-span-4 space-y-6">
          <section className="bg-white p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] border border-viet-border shadow-sm" aria-labelledby="schedule-title">
            <h2 id="schedule-title" className="text-sm font-black text-viet-text uppercase tracking-widest mb-4">Lên lịch học</h2>
            <form onSubmit={handleCreateSchedule} className="space-y-3 mb-6">
              {scheduleError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{scheduleError}</p>}
              {scheduleNotice && <p role="status" aria-live="polite" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">{scheduleNotice}</p>}
              <div>
                <label htmlFor="schedule-name" className="mb-1 block text-xs font-bold text-viet-text-light">Tiêu đề buổi học</label>
                <input id="schedule-name" type="text" placeholder="Ôn tập chương 1" maxLength={200} value={newSchedule.title} onChange={(event) => setNewSchedule((current) => ({ ...current, title: event.target.value }))} className="w-full h-11 px-4 rounded-xl border border-viet-border outline-none text-xs focus:border-viet-green focus:ring-2 focus:ring-viet-green/20" required />
              </div>
              <div>
                <label htmlFor="schedule-start" className="mb-1 block text-xs font-bold text-viet-text-light">Thời gian bắt đầu</label>
                <input id="schedule-start" type="datetime-local" min={minimumDateTime} value={newSchedule.start_time} onChange={(event) => setNewSchedule((current) => ({ ...current, start_time: event.target.value }))} className="w-full h-11 px-4 rounded-xl border border-viet-border outline-none text-xs focus:border-viet-green focus:ring-2 focus:ring-viet-green/20" required />
              </div>
              <div>
                <label htmlFor="schedule-url" className="mb-1 block text-xs font-bold text-viet-text-light">Link Google Meet / Zoom (không bắt buộc)</label>
                <input id="schedule-url" type="url" placeholder="https://meet.google.com/…" maxLength={2048} value={newSchedule.meet_url} onChange={(event) => setNewSchedule((current) => ({ ...current, meet_url: event.target.value }))} className="w-full h-11 px-4 rounded-xl border border-viet-border outline-none text-xs focus:border-viet-green focus:ring-2 focus:ring-viet-green/20" />
              </div>
              <button type="submit" disabled={isScheduling} className="w-full min-h-11 py-2 bg-viet-text text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-black transition-colors disabled:cursor-not-allowed disabled:opacity-60">
                {isScheduling ? 'Đang tạo…' : 'Tạo lịch'}
              </button>
            </form>

            <div className="space-y-3 border-t border-viet-border pt-4">
              <h3 className="text-xs font-black text-viet-text-light uppercase tracking-widest">Lịch học</h3>
              {sectionErrors.schedules ? (
                <SectionError message={sectionErrors.schedules} retry={() => fetchClassData(false)} busy={refreshing} />
              ) : schedules.length === 0 ? (
                <p className="rounded-xl bg-slate-50 px-3 py-4 text-center text-xs font-medium text-viet-text-light">Chưa có lịch học nào.</p>
              ) : (
                schedules.map((schedule) => {
                  const meetUrl = normalizeHttpUrl(schedule.meet_url);
                  const startTimestamp = new Date(schedule.start_time).getTime();
                  const isPast = Number.isFinite(startTimestamp) && referenceTime > 0 && startTimestamp < referenceTime;
                  return (
                    <article key={schedule.id} className="p-3 border border-viet-border rounded-xl">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-black text-viet-text min-w-0 break-words">{schedule.title || 'Buổi học chưa đặt tên'}</p>
                        {isPast && <span className="shrink-0 rounded bg-slate-100 px-2 py-1 text-[9px] font-bold uppercase text-slate-500">Đã diễn ra</span>}
                      </div>
                      <p className={`text-[10px] font-bold mt-1 ${isPast ? 'text-viet-text-light' : 'text-viet-green'}`}>{formatTeacherDateTime(schedule.start_time)}</p>
                      {meetUrl && (
                        <a href={meetUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-9 items-center rounded-lg text-xs font-bold text-blue-600 hover:underline">
                          Mở phòng học <span className="ml-1" aria-hidden="true">↗</span>
                        </a>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </section>

          <section className="bg-white p-5 sm:p-6 rounded-[28px] sm:rounded-[32px] border border-viet-border shadow-sm" aria-labelledby="member-list-title">
            <h2 id="member-list-title" className="text-sm font-black text-viet-text uppercase tracking-widest mb-4">Danh sách học viên ({members.length.toLocaleString('vi-VN')})</h2>
            <div className="space-y-3">
              {sectionErrors.members ? (
                <SectionError message={sectionErrors.members} retry={() => fetchClassData(false)} busy={refreshing} />
              ) : members.length === 0 ? (
                <p className="text-xs text-viet-text-light font-medium italic">Chưa có học sinh tham gia.</p>
              ) : (
                members.map((member) => {
                  const name = memberName(member);
                  const activeMinutes = toNonNegativeInteger(member.active_minutes);
                  return (
                    <div key={member.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 border border-viet-border rounded-2xl transition-all hover:bg-white hover:shadow-sm">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                          <div className="w-9 h-9 bg-slate-100 text-viet-text border border-viet-border rounded-full flex items-center justify-center font-bold text-xs uppercase shadow-sm" aria-hidden="true">{name.slice(0, 2)}</div>
                          <span role="img" aria-label={member.isOnline ? 'Đang trực tuyến' : 'Ngoại tuyến'} className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${member.isOnline ? 'bg-green-500' : 'bg-slate-300'}`} title={member.isOnline ? 'Đang trực tuyến' : 'Ngoại tuyến'} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-viet-text truncate">{name}</span>
                          <span className="text-[9px] font-bold text-viet-text-light/70 uppercase">
                            {activeMinutes > 0
                              ? `${Math.floor(activeMinutes / 60) > 0 ? `${Math.floor(activeMinutes / 60)} giờ ` : ''}${activeMinutes % 60 > 0 ? `${activeMinutes % 60} phút ` : ''}hoạt động`
                              : 'Chưa có hoạt động'}
                          </span>
                        </div>
                      </div>
                      <button type="button" onClick={() => startPrivateMessage(member.id)} className="w-11 h-11 shrink-0 rounded-xl bg-white border border-viet-border flex items-center justify-center text-viet-text-light transition-all hover:bg-viet-green hover:text-white hover:border-viet-green shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-viet-green" title={`Nhắn tin riêng cho ${name}`} aria-label={`Nhắn tin riêng cho ${name}`}>
                        <MessageIcon />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default ClassDetail;
