import '../api/_env.js';
import User from '../api/_models/User.js';
import { supabase } from '../api/_lib/supabase.js';

const DEFAULT_PASSWORD = process.env.DEFAULT_SEED_PASSWORD || 'password123';
const SECOND_ADMIN_USERNAME = process.env.SECOND_ADMIN_USERNAME || 'admin2';
const SECOND_ADMIN_EMAIL = process.env.SECOND_ADMIN_EMAIL || 'admin2@chemodyssey.com';
const SECOND_ADMIN_PASSWORD = process.env.SECOND_ADMIN_PASSWORD || process.env.DEFAULT_SEED_PASSWORD || '';

const ensureAccount = async ({ username, email, password, role }) => {
  let user = await User.findOne({ username });

  if (!user) {
    user = await User.create({ username, email, password, role });
    console.log(`Đã tạo tài khoản ${role}: ${username}`);
    return user;
  }

  if (user.role !== role) {
    user = await User.update(user.id, { role });
    console.log(`Đã cập nhật quyền ${username} thành ${role}`);
  } else {
    console.log(`Tài khoản ${username} đã tồn tại.`);
  }

  return user;
};

const upsertProgressRows = async (rows) => {
  if (!rows.length) return;

  const { error } = await supabase
    .from('tien_do_nguoi_dung')
    .upsert(rows, { onConflict: 'nguoi_dung_id,loai_tien_do,doi_tuong_id' });

  if (error) throw error;
};

const grantFullStudentAccess = async (userId) => {
  const [{ data: lessons, error: lessonError }, { data: chemicals, error: chemicalError }] = await Promise.all([
    supabase.from('bai_hoc').select('id'),
    supabase.from('hoa_chat').select('cong_thuc'),
  ]);

  if (lessonError) throw lessonError;
  if (chemicalError) throw chemicalError;

  const progressRows = [
    ...(lessons || []).map((lesson) => ({
      nguoi_dung_id: userId,
      loai_tien_do: 'lesson',
      doi_tuong_id: lesson.id,
      noi_dung_tien_do: {},
    })),
    ...(chemicals || []).map((chemical) => ({
      nguoi_dung_id: userId,
      loai_tien_do: 'chemical',
      doi_tuong_id: chemical.cong_thuc,
      noi_dung_tien_do: {},
    })),
  ];

  await upsertProgressRows(progressRows);
  console.log(`Đã mở khóa ${lessons?.length || 0} bài học và ${chemicals?.length || 0} hóa chất cho admin học sinh.`);
};

const incrementScore = (scoreMap, classId, points) => {
  if (!classId || !scoreMap.has(classId)) return;
  scoreMap.set(classId, scoreMap.get(classId) + points);
};

const findMostActiveClass = async () => {
  const [
    { data: classes, error: classError },
    { data: members, error: memberError },
    { data: posts, error: postError },
    { data: schedules, error: scheduleError },
    { data: submissions, error: submissionError },
  ] = await Promise.all([
    supabase.from('lop').select('id, ten, created_at'),
    supabase.from('thanh_vien_lop').select('lop_id'),
    supabase.from('bai_dang_lop').select('id, lop_id'),
    supabase.from('lich_lop').select('lop_id'),
    supabase.from('bai_nop').select('bai_dang_id'),
  ]);

  if (classError) throw classError;
  if (memberError) throw memberError;
  if (postError) throw postError;
  if (scheduleError) throw scheduleError;
  if (submissionError) throw submissionError;

  if (!classes?.length) return null;

  const scoreMap = new Map(classes.map((cls) => [cls.id, 0]));
  const postClassMap = new Map((posts || []).map((post) => [post.id, post.lop_id]));

  (members || []).forEach((member) => incrementScore(scoreMap, member.lop_id, 1));
  (posts || []).forEach((post) => incrementScore(scoreMap, post.lop_id, 3));
  (schedules || []).forEach((schedule) => incrementScore(scoreMap, schedule.lop_id, 2));
  (submissions || []).forEach((submission) => incrementScore(scoreMap, postClassMap.get(submission.bai_dang_id), 2));

  return [...classes]
    .map((cls) => ({ ...cls, activityScore: scoreMap.get(cls.id) || 0 }))
    .sort((a, b) => {
      if (b.activityScore !== a.activityScore) return b.activityScore - a.activityScore;
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    })[0];
};

const joinMostActiveClass = async (userId) => {
  const targetClass = await findMostActiveClass();
  if (!targetClass) {
    console.log('Chưa có lớp học để admin học sinh tham gia.');
    return;
  }

  const { error } = await supabase
    .from('thanh_vien_lop')
    .upsert(
      { lop_id: targetClass.id, hoc_sinh_id: userId },
      { onConflict: 'lop_id,hoc_sinh_id' }
    );

  if (error) throw error;
  console.log(`Đã cho ${SECOND_ADMIN_USERNAME} tham gia lớp sôi nổi nhất: ${targetClass.ten} (điểm ${targetClass.activityScore}).`);
};

async function createAccounts() {
  try {
    if (!SECOND_ADMIN_PASSWORD) {
      throw new Error('Missing SECOND_ADMIN_PASSWORD. Set it before creating the second admin account.');
    }

    await ensureAccount({
      username: 'admin',
      email: 'admin@chemodyssey.com',
      password: DEFAULT_PASSWORD,
      role: 'admin',
    });

    await ensureAccount({
      username: 'teacher',
      email: 'teacher@chemodyssey.com',
      password: DEFAULT_PASSWORD,
      role: 'teacher',
    });

    const secondAdmin = await ensureAccount({
      username: SECOND_ADMIN_USERNAME,
      email: SECOND_ADMIN_EMAIL,
      password: SECOND_ADMIN_PASSWORD,
      role: 'admin',
    });

    await grantFullStudentAccess(secondAdmin.id);
    await joinMostActiveClass(secondAdmin.id);

    console.log(`Hoàn tất. Admin thứ hai: ${SECOND_ADMIN_USERNAME}`);
    process.exit(0);
  } catch (err) {
    console.error('Lỗi khi tạo tài khoản:', err);
    process.exit(1);
  }
}

createAccounts();
