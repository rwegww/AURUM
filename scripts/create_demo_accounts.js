import '../api/env.js';
import User from '../api/models/User.js';
import { supabase } from '../api/lib/supabase.js';

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
  const [{ data: lessons, error: lessonError }, { data: chemicals, error: chemicalError }, { data: achievements, error: achievementError }] = await Promise.all([
    supabase.from('bai_hoc').select('id'),
    supabase.from('hoa_chat').select('cong_thuc'),
    supabase.from('thanh_tuu').select('id')
  ]);

  if (lessonError) throw lessonError;
  if (chemicalError) throw chemicalError;
  if (achievementError) throw achievementError;
  
  // Lấy danh sách nhiệm vụ nếu có
  const { data: missions } = await supabase.from('nhiem_vu_he_thong').select('id');

  const progressRows = [
    ...(lessons || []).map((lesson) => ({
      nguoi_dung_id: userId,
      loai_tien_do: 'lesson',
      doi_tuong_id: lesson.id,
      noi_dung_tien_do: { completed: true, score: 100 },
    })),
    ...(chemicals || []).map((chemical) => ({
      nguoi_dung_id: userId,
      loai_tien_do: 'chemical',
      doi_tuong_id: chemical.cong_thuc,
      noi_dung_tien_do: { discovered: true },
    })),
    ...(achievements || []).map((achievement) => ({
      nguoi_dung_id: userId,
      loai_tien_do: 'achievement',
      doi_tuong_id: achievement.id,
      noi_dung_tien_do: { completed: true, claimed: true },
    })),
  ];
  
  // Đánh dấu nhiệm vụ (nếu bảng tồn tại)
  if (missions && missions.length) {
      const { error: missionError } = await supabase
        .from('nhiem_vu_nguoi_dung')
        .upsert(missions.map(m => ({
          nguoi_dung_id: userId,
          nhiem_vu_id: m.id,
          tien_do: 100,
          trang_thai: 'completed'
        })), { onConflict: 'nguoi_dung_id,nhiem_vu_id' });
      if (missionError) throw missionError;
  }

  await upsertProgressRows(progressRows);
  console.log(`Đã mở khóa và hoàn thành tất cả cho user có ID: ${userId}`);
};

const grantPartialStudentAccess = async (userId) => {
  const [{ data: lessons }, { data: chemicals }] = await Promise.all([
    supabase.from('bai_hoc').select('id').order('thu_tu').limit(2),
    supabase.from('hoa_chat').select('cong_thuc').limit(5)
  ]);

  const progressRows = [
    ...(lessons || []).map((lesson) => ({
      nguoi_dung_id: userId,
      loai_tien_do: 'lesson',
      doi_tuong_id: lesson.id,
      noi_dung_tien_do: { completed: true, score: 85 },
    })),
    ...(chemicals || []).map((chemical) => ({
      nguoi_dung_id: userId,
      loai_tien_do: 'chemical',
      doi_tuong_id: chemical.cong_thuc,
      noi_dung_tien_do: { discovered: true },
    })),
  ];

  await upsertProgressRows(progressRows);
  console.log(`Đã mở khóa 1 vài bài học (demo) cho user có ID: ${userId}`);
};

async function createAccounts() {
  try {
    const demo = await ensureAccount({
      username: 'demo',
      email: 'demo@chemodyssey.com',
      password: 'password123',
      role: 'student',
    });

    const fullDemo = await ensureAccount({
      username: 'fulldemo',
      email: 'fulldemo@chemodyssey.com',
      password: 'password123',
      role: 'student',
    });

    await grantPartialStudentAccess(demo.id);
    await grantFullStudentAccess(fullDemo.id);

    console.log(`Hoàn tất cập nhật tài khoản demo và fulldemo`);
    process.exit(0);
  } catch (err) {
    console.error('Lỗi khi tạo tài khoản:', err);
    process.exit(1);
  }
}

createAccounts();
