import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const defaultBalancingProgress = {
  completedNodeIds: [],
  completedCount: 0,
  passedGrades: [],
  lessonStars: {}
};

const isMissingDbObject = (error) =>
  error?.code === '42P01' ||
  error?.code === '42703' ||
  error?.code === 'PGRST204' ||
  error?.code === 'PGRST205' ||
  error?.message?.includes('Could not find the table') ||
  error?.message?.includes('Could not find the column');

const normalizeIdList = (items, objectKey) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => (typeof item === 'string' ? item : item?.[objectKey] || item?.doi_tuong_id))
    .filter(Boolean);
};

const fetchUserProgressRows = async (userId) => {
  const { data, error } = await supabase
    .from('tien_do_nguoi_dung')
    .select('loai_tien_do, doi_tuong_id, noi_dung_tien_do, mo_khoa_luc')
    .eq('nguoi_dung_id', userId);

  if (error) throw error;
  return data || [];
};

const normalizeBalancingProgress = (progress) => {
  if (!progress || typeof progress !== 'object' || Array.isArray(progress)) {
    return { ...defaultBalancingProgress };
  }

  return {
    completedNodeIds: progress.completedNodeIds || [],
    completedCount: progress.completedCount || 0,
    passedGrades: progress.passedGrades || [],
    lessonStars: progress.lessonStars || {}
  };
};

const attachUserProgress = async (user) => {
  try {
    const data = await fetchUserProgressRows(user.id);

    user.unlocked_bai_hoc = (data || [])
      .filter((item) => item.loai_tien_do === 'lesson')
      .map((item) => item.doi_tuong_id);
    user.unlocked_chemicals = (data || [])
      .filter((item) => item.loai_tien_do === 'chemical')
      .map((item) => item.doi_tuong_id);

    const balancing = (data || []).find(
      (item) => item.loai_tien_do === 'balancing' && item.doi_tuong_id === 'current'
    );
    user.balancingProgressPayload = balancing?.noi_dung_tien_do || user.balancingProgressPayload;
    return user;
  } catch (error) {
    if (!isMissingDbObject(error)) throw error;
    console.warn('tien_do_nguoi_dung table or columns missing, returning base user.');
    user.unlocked_bai_hoc = [];
    user.unlocked_chemicals = [];
  }

  return user;
};

const upsertUserProgress = async (rows) => {
  if (!rows.length) return false;

  const { error } = await supabase
    .from('tien_do_nguoi_dung')
    .upsert(rows, { onConflict: 'nguoi_dung_id,loai_tien_do,doi_tuong_id' });

  if (error) throw error;

  return true;
};

const mapUser = (user) => {
  if (!user) return null;
  const xp = user.diem_kinh_nghiem ?? user.xp ?? 0;
  const level = user.cap_do ?? user.level ?? 1;
  const arenaStats = user.thong_ke_dau || user.arena_stats || { total: 0, wins: 0, losses: 0, points: 0 };
  const activeMinutes = user.phut_hoat_dong ?? user.active_minutes ?? 0;
  const lastActiveAt = user.hoat_dong_cuoi_luc || user.last_active_at;
  const isLocked = user.bi_khoa ?? user.is_locked ?? false;
  const streakCount = user.so_ngay_chuoi ?? user.streak_count ?? 0;
  const todayOnlineMinutes = user.phut_online_hom_nay ?? user.today_online_minutes ?? 0;
  const todayLessonCompleted = user.da_hoan_thanh_bai_hom_nay ?? user.today_lesson_completed ?? false;
  const studyPlan = user.ke_hoach_hoc || user.study_plan || { emailEnabled: false, dailyLessonTarget: 1, completed: false };
  const linkedAccounts = user.tai_khoan_lien_ket || user.linked_accounts || {};
  return {
    ...user,
    id: user.id,
    xp,
    level,
    createdAt: user.created_at,
    // Flatten normalized arrays if they exist in the joined record
    unlockedLessons: normalizeIdList(user.unlocked_bai_hoc, 'bai_hoc_id').length > 0
      ? normalizeIdList(user.unlocked_bai_hoc, 'bai_hoc_id')
      : (user.unlockedLessons || []),
    unlockedChemicals: normalizeIdList(user.unlocked_chemicals, 'chemical_formula').length > 0
      ? normalizeIdList(user.unlocked_chemicals, 'chemical_formula')
      : (user.unlockedChemicals || []),
    avatarSeed: user.avatar_seed || user.username,
    arenaStats,
    arenaAvatar: { seed: 'Chem Master', aura: '#a855f7' },
    // Cleanup
    unlocked_bai_hoc: undefined,
    unlocked_chemicals: undefined,
    avatar_seed: undefined,
    arena_stats: undefined,
    thong_ke_dau: undefined,
    created_at: undefined,
    lastActiveAt: user.updated_at || lastActiveAt,
    activeMinutes,
    isOnline: user.is_online || (lastActiveAt && new Date(lastActiveAt) > new Date(Date.now() - 5*60*1000)),
    isLocked,
    balancingProgress: normalizeBalancingProgress(user.balancingProgressPayload || user.balancingProgress),
    balancingProgressPayload: undefined,
    streakCount,
    lastStreakAt: user.chuoi_cuoi_luc || user.last_streak_at,
    todayOnlineMinutes,
    todayLessonCompleted,
    currentSessionId: user.current_session_id,
    studyPlan,
    linkedAccounts,
    password: user.password_hash,
    password_hash: undefined,
    diem_kinh_nghiem: undefined,
    cap_do: undefined,
    phut_hoat_dong: undefined,
    hoat_dong_cuoi_luc: undefined,
    bi_khoa: undefined,
    so_ngay_chuoi: undefined,
    chuoi_cuoi_luc: undefined,
    phut_online_hom_nay: undefined,
    da_hoan_thanh_bai_hom_nay: undefined,
    ke_hoach_hoc: undefined,
    tai_khoan_lien_ket: undefined
  };
};

export const User = {
  async findOne(filter) {
    // 1. Fetch core user data first (safe)
    if (filter.username && filter.email) {
      const byUsername = await this.findOne({ username: filter.username });
      if (byUsername) return byUsername;
      return this.findOne({ email: filter.email });
    }

    let query = supabase.from('nguoi_dung').select('*');

    if (filter.username) {
      query = query.eq('username', filter.username);
    } else if (filter.email) {
      query = query.eq('email', filter.email);
    } else if (filter.id) {
      query = query.eq('id', filter.id);
    } else if (filter.googleId) {
      query = query.eq('tai_khoan_lien_ket->>google', filter.googleId);
    }

    const { data: user, error: userError } = await query.maybeSingle();
    if (userError) {
      // Gracefully handle missing linked_accounts column
      if (userError.message?.includes('Could not find the column') || userError.code === '42703') {
        console.warn('Column not found in nguoi_dung table, returning null for findOne:', userError.message);
        return null;
      }
      throw userError;
    }
    if (!user) return null;
    return mapUser(await attachUserProgress(user));
  },

  async findById(id) {
    // 1. Fetch core (safe)
    const { data: user, error: userError } = await supabase
      .from('nguoi_dung')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (userError) throw userError;
    if (!user) return null;
    return mapUser(await attachUserProgress(user));
  },

  async create(userData) {
    const hashedPassword = userData.skipHash ? userData.password : await bcrypt.hash(userData.password, 10);
    const userId = userData.id || crypto.randomUUID();
    
    // 1. Create User
    const userPayload = {
      id: userId,
      username: userData.username,
      email: userData.email,
      password_hash: hashedPassword,
      role: userData.role || 'student',
      avatar_seed: userData.avatarSeed || userData.username,
      ke_hoach_hoc: { emailEnabled: false, dailyLessonTarget: 1, completed: false, grade: userData.grade || null },
      so_ngay_chuoi: 0,
      phut_online_hom_nay: 0,
      da_hoan_thanh_bai_hom_nay: false
    };

    const insertResult = await supabase
      .from('nguoi_dung')
      .insert([userPayload])
      .select()
      .single();
    
    if (insertResult.error) throw insertResult.error;

    // 2. Initial Unlocked Content (if any)
    const initialLessons = userData.unlockedLessons || [];
    const initialChemicals = userData.unlockedChemicals || [];
    const initialBalancingProgress = { ...defaultBalancingProgress };
    const progressRows = [
      ...initialLessons.map((lessonId) => ({
        nguoi_dung_id: userId,
        loai_tien_do: 'lesson',
        doi_tuong_id: lessonId,
        noi_dung_tien_do: {}
      })),
      ...initialChemicals.map((chemical) => ({
        nguoi_dung_id: userId,
        loai_tien_do: 'chemical',
        doi_tuong_id: chemical,
        noi_dung_tien_do: {}
      })),
      {
        nguoi_dung_id: userId,
        loai_tien_do: 'balancing',
        doi_tuong_id: 'current',
        noi_dung_tien_do: initialBalancingProgress
      }
    ];

    await upsertUserProgress(progressRows);

    return this.findById(userId);
  },

  async update(id, updateData) {
    const pgUpdateData = { ...updateData };
    const directFieldMap = {
      xp: 'diem_kinh_nghiem',
      level: 'cap_do',
      arena_stats: 'thong_ke_dau',
      active_minutes: 'phut_hoat_dong',
      last_active_at: 'hoat_dong_cuoi_luc',
      is_locked: 'bi_khoa',
      streak_count: 'so_ngay_chuoi',
      last_streak_at: 'chuoi_cuoi_luc',
      today_online_minutes: 'phut_online_hom_nay',
      today_lesson_completed: 'da_hoan_thanh_bai_hom_nay',
      study_plan: 'ke_hoach_hoc',
      linked_accounts: 'tai_khoan_lien_ket'
    };

    Object.entries(directFieldMap).forEach(([from, to]) => {
      if (pgUpdateData[from] !== undefined) {
        pgUpdateData[to] = pgUpdateData[from];
        delete pgUpdateData[from];
      }
    });
    
    if (updateData.password) {
      pgUpdateData.password_hash = await bcrypt.hash(updateData.password, 10);
      delete pgUpdateData.password;
    }
    
    // Handle special mappings
    if (updateData.avatarSeed) {
      pgUpdateData.avatar_seed = updateData.avatarSeed;
      delete pgUpdateData.avatarSeed;
    }

    const balancingProgress = updateData.balancingProgress;
    delete pgUpdateData.balancingProgress;

    if (updateData.linkedAccounts) {
      pgUpdateData.tai_khoan_lien_ket = updateData.linkedAccounts;
      delete pgUpdateData.linkedAccounts;
    }
    
    // 1. Update Core User Data (excluding junction lists)
    const junctionLessons = updateData.unlockedLessons;
    const junctionChemicals = updateData.unlockedChemicals;
    delete pgUpdateData.unlockedLessons;
    delete pgUpdateData.unlockedChemicals;

    if (updateData.currentSessionId) {
      pgUpdateData.current_session_id = updateData.currentSessionId;
      delete pgUpdateData.currentSessionId;
    }

    if (updateData.studyPlan) {
      pgUpdateData.ke_hoach_hoc = updateData.studyPlan;
      delete pgUpdateData.studyPlan;
    }

    if (Object.keys(pgUpdateData).length > 0) {
      console.log(`[User.update] Updating ID ${id} with:`, JSON.stringify(pgUpdateData, null, 2));
      const { error } = await supabase
        .from('nguoi_dung')
        .update(pgUpdateData)
        .eq('id', id);
      if (error) {
        // Gracefully handle missing columns (e.g. current_session_id, linked_accounts, etc.)
        if (isMissingDbObject(error)) {
          console.warn('[User.update] Column missing in nguoi_dung table, skipping update:', error.message || error);
        } else {
          console.error('[User.update] Supabase error:', error);
          throw error;
        }
      }
    }

    // 2. Update Junction Tables for Unlocked Content
    // NOTE: This implementation is simple "add if missing". 
    // For a full replacement, we'd need to delete first if that's the intent.
    const progressRows = [];
    if (junctionLessons) {
      progressRows.push(...junctionLessons.map((lessonId) => ({
        nguoi_dung_id: id,
        loai_tien_do: 'lesson',
        doi_tuong_id: lessonId,
        noi_dung_tien_do: {}
      })));
    }

    if (junctionChemicals) {
      progressRows.push(...junctionChemicals.map((chemical) => ({
        nguoi_dung_id: id,
        loai_tien_do: 'chemical',
        doi_tuong_id: chemical,
        noi_dung_tien_do: {}
      })));
    }

    if (balancingProgress) {
      progressRows.push({
        nguoi_dung_id: id,
        loai_tien_do: 'balancing',
        doi_tuong_id: 'current',
        noi_dung_tien_do: balancingProgress
      });
    }

    if (progressRows.length > 0) {
      await upsertUserProgress(progressRows);
    }

    return this.findById(id);
  },

  async findStudents() {
    // For the leaderboard, we ONLY need names and XP. 
    // This query is extremely safe because it doesn't use any complex joins.
    const { data, error } = await supabase
      .from('nguoi_dung')
      .select(`
        id, username, role, diem_kinh_nghiem, cap_do, avatar_seed, updated_at, hoat_dong_cuoi_luc, phut_hoat_dong, bi_khoa
      `)
      .eq('role', 'student')
      .gt('diem_kinh_nghiem', 0)
      .order('diem_kinh_nghiem', { ascending: false });
    
    if (error) throw error;
    return data.map(mapUser);
  },

  async countStudents() {
    const { count, error } = await supabase
      .from('nguoi_dung')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'student');
    
    if (error) throw error;
    return count;
  },

  async countActiveStudents() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count, error } = await supabase
      .from('nguoi_dung')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'student')
      .gt('hoat_dong_cuoi_luc', fiveMinutesAgo);
    
    if (error) throw error;
    return count;
  },

  async aggregateStats() {
    const { data, error } = await supabase
      .from('nguoi_dung')
      .select('id, username, diem_kinh_nghiem, cap_do, ke_hoach_hoc, so_ngay_chuoi, avatar_seed')
      .eq('role', 'student');
    
    if (error) throw error;
    
    const totalXP = data.reduce((sum, u) => sum + (u.diem_kinh_nghiem || 0), 0);
    const avgLevel = data.length > 0 ? data.reduce((sum, u) => sum + (u.cap_do || 1), 0) / data.length : 1;
    
    const levels = {};
    const grades = {};
    
    data.forEach(u => {
      const lvl = u.cap_do || 1;
      levels[lvl] = (levels[lvl] || 0) + 1;
      
      const grade = u.ke_hoach_hoc?.grade || 'Chưa rõ';
      grades[grade] = (grades[grade] || 0) + 1;
    });
    
    const levelDistribution = Object.keys(levels).map(lvl => ({
      name: `Cấp ${lvl}`,
      students: levels[lvl]
    })).sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
    
    const gradeDistribution = Object.keys(grades).map(g => ({
      name: g === 'Chưa rõ' ? g : `Lớp ${g}`,
      students: grades[g],
      color: g === 'Chưa rõ' ? '#94a3b8' : (g == 8 ? '#f43f5e' : (g == 9 ? '#eab308' : (g == 10 ? '#3b82f6' : (g == 11 ? '#a855f7' : '#14b8a6'))))
    }));

    const topXP = [...data].sort((a, b) => (b.diem_kinh_nghiem || 0) - (a.diem_kinh_nghiem || 0)).slice(0, 5).map(u => ({
      id: u.id,
      name: u.username,
      xp: u.diem_kinh_nghiem || 0,
      level: u.cap_do || 1,
      avatar: u.avatar_seed || u.username
    }));
    
    const topStreak = [...data].sort((a, b) => (b.so_ngay_chuoi || 0) - (a.so_ngay_chuoi || 0)).slice(0, 5).map(u => ({
      id: u.id,
      name: u.username,
      streak: u.so_ngay_chuoi || 0,
      avatar: u.avatar_seed || u.username
    }));

    return { totalXP, avgLevel, levelDistribution, gradeDistribution, topXP, topStreak };
  },

  async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  async toggleLock(id, lockStatus) {
    const { data, error } = await supabase
      .from('nguoi_dung')
      .update({ bi_khoa: lockStatus })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return mapUser(data);
  }
};

export default User;
