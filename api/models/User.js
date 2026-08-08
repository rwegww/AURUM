import { supabase } from '../lib/supabase.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { normalizeInventory, craftableItems } from '../../src/data/labInventory.js';
import { craftingTasks } from '../../src/data/craftingTasks.js';

const toNormalFormula = (formula) => {
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return String(formula || '').replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (match) => subMap[match] || match).replace(/\s+/g, '').toUpperCase();
};

const normalizeChemicalFormulaValue = (item) => {
  if (typeof item === 'string' || typeof item === 'number') {
    return String(item).trim();
  }

  if (!item || typeof item !== 'object') return '';

  const value = item.chemical_formula
    || item.cong_thuc
    || item.formula
    || item.doi_tuong_id
    || item.target_id
    || item.item_id;

  if (value) return String(value).trim();

  return typeof item.id === 'string' && !item.id.startsWith('ing_')
    ? item.id.trim()
    : '';
};

const syncUserProgressData = (unlockedChemicalsArray, inventoryObject) => {
  let unlocked = Array.isArray(unlockedChemicalsArray) 
    ? unlockedChemicalsArray.map(normalizeChemicalFormulaValue).filter(Boolean)
    : [];

  const inventory = normalizeInventory(inventoryObject);
  const crafted = Array.isArray(inventory.craftedItems) 
    ? [...inventory.craftedItems] 
    : [];

  const rawIngredients = Array.isArray(inventoryObject?.ingredients) ? inventoryObject.ingredients : [];
  const rawAmountById = new Map();
  rawIngredients.forEach(item => {
    const id = typeof item === 'string' ? item : item?.id;
    if (!id) return;
    const amount = typeof item === 'string' ? 1 : Math.max(0, Number.parseInt(item.amount ?? 0, 10) || 0);
    rawAmountById.set(id, (rawAmountById.get(id) || 0) + amount);
  });
  const rawCrafted = Array.isArray(inventoryObject?.craftedItems)
    ? inventoryObject.craftedItems.map(item => (typeof item === 'string' ? item : item?.id)).filter(Boolean)
    : [];
  const inventoryNeedsSync = rawAmountById.size !== inventory.ingredients.length
    || inventory.ingredients.some(item => rawAmountById.get(item.id) !== item.amount)
    || rawCrafted.length !== crafted.length
    || rawCrafted.some(item => !crafted.includes(item));

  let changed = inventoryNeedsSync;

  const normToCraftable = {};
  craftableItems.forEach(item => {
    const norm = toNormalFormula(item.formula);
    normToCraftable[norm] = item;
  });

  // Vật phẩm đã chế tạo sẽ mở khóa hóa chất. Chiều ngược lại không đúng:
  // khám phá một chất trong simulator không có nghĩa là đã tiêu nguyên liệu để chế tạo.
  crafted.forEach(craftId => {
    const item = craftableItems.find(c => c.id === craftId);
    if (item) {
      const targetFormula = item.formula;
      const normTarget = toNormalFormula(targetFormula);
      const hasFormula = unlocked.some(f => toNormalFormula(f) === normTarget);
      if (!hasFormula) {
        unlocked.push(targetFormula);
        changed = true;
      }
    }
  });

  // Chuẩn hóa công thức đã mở khóa theo dữ liệu biên soạn.
  unlocked = unlocked.map(formula => {
    const normalizedFormula = normalizeChemicalFormulaValue(formula);
    if (!normalizedFormula) {
      changed = true;
      return '';
    }

    const norm = toNormalFormula(normalizedFormula);
    const item = normToCraftable[norm];
    if (item && normalizedFormula !== item.formula) {
      changed = true;
      return item.formula;
    }
    return normalizedFormula;
  }).filter(Boolean);

  const uniqueUnlocked = Array.from(new Set(unlocked));
  if (uniqueUnlocked.length !== unlocked.length) {
    changed = true;
  }

  inventory.craftedItems = crafted;

  return {
    unlockedChemicals: uniqueUnlocked,
    inventory,
    changed
  };
};

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

const isMissingDbFunction = (error) =>
  error?.code === '42883' ||
  error?.code === 'PGRST202' ||
  error?.message?.includes('Could not find the function');

const normalizeIdList = (items, objectKey) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (objectKey === 'chemical_formula') return normalizeChemicalFormulaValue(item);
      if (typeof item === 'string' || typeof item === 'number') return String(item);
      if (!item || typeof item !== 'object') return '';
      return item?.[objectKey] || item?.doi_tuong_id || item?.lessonId || item?.lesson_id || item?.id;
    })
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

const normalizeCraftingTasks = (payload) => {
  const base = {
    lastResetDate: "",
    tasks: Object.fromEntries(craftingTasks.map(task => [
      task.id,
      { progress: 0, claimed: false, history: [], rewards: [] },
    ])),
  };
  if (!payload || typeof payload !== 'object' || !payload.tasks) {
    return base;
  }
  
  base.lastResetDate = payload.lastResetDate || "";
  Object.keys(base.tasks).forEach(taskId => {
    const pTask = payload.tasks[taskId] || {};
    base.tasks[taskId] = {
      progress: typeof pTask.progress === 'number' ? pTask.progress : 0,
      claimed: !!pTask.claimed,
      history: Array.isArray(pTask.history) ? pTask.history : [],
      rewards: Array.isArray(pTask.rewards) ? pTask.rewards : []
    };
  });
  return base;
};

const getVietnamToday = () => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date())
      .filter(part => part.type !== 'literal')
      .map(part => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const resetDailyCraftingTasks = (payload) => {
  const currentTasks = normalizeCraftingTasks(payload);
  const today = getVietnamToday();
  if (currentTasks.lastResetDate === today) return currentTasks;

  currentTasks.lastResetDate = today;
  Object.keys(currentTasks.tasks).forEach(taskId => {
    const taskDef = craftingTasks.find(task => task.id === taskId);
    currentTasks.tasks[taskId] = {
      progress: 0,
      claimed: false,
      history: [],
      rewards: (taskDef?.rewards || []).map(reward => ({ ...reward })),
    };
  });
  return currentTasks;
};


const attachUserProgress = async (user) => {
  try {
    const data = await fetchUserProgressRows(user.id);

    const unlockedLessons = (data || [])
      .filter((item) => item.loai_tien_do === 'lesson')
      .map((item) => item.doi_tuong_id);
    const unlockedChemicalsRaw = (data || [])
      .filter((item) => item.loai_tien_do === 'chemical')
      .map((item) => item.doi_tuong_id);

    const balancing = (data || []).find(
      (item) => item.loai_tien_do === 'balancing' && item.doi_tuong_id === 'current'
    );
    user.balancingProgressPayload = balancing?.noi_dung_tien_do || user.balancingProgressPayload;

    const inventoryRecord = (data || []).find(
      (item) => item.loai_tien_do === 'achievement' && item.doi_tuong_id === 'inventory'
    );
    const inventoryRaw = inventoryRecord?.noi_dung_tien_do || user.inventoryPayload || user.inventory;

    const craftingTasksRecord = (data || []).find(
      (item) => item.loai_tien_do === 'achievement' && item.doi_tuong_id === 'crafting_tasks'
    );
    
    const todayStr = getVietnamToday();
    let currentTasksPayload = normalizeCraftingTasks(craftingTasksRecord?.noi_dung_tien_do);
    
    if (!currentTasksPayload.lastResetDate || currentTasksPayload.lastResetDate !== todayStr) {
      console.log(`[attachUserProgress] Resetting daily crafting tasks for user ${user.id}. Old reset date: ${currentTasksPayload.lastResetDate}, New: ${todayStr}`);
      const { data: resetPayload, error: resetError } = await supabase.rpc('increment_crafting_task_progress', {
        p_user_id: user.id,
        p_item_id: null,
        p_tasks: [],
        p_reset_payload: resetDailyCraftingTasks(currentTasksPayload),
      });
      if (resetError) {
        if (!isMissingDbFunction(resetError)) throw resetError;
        // Giữ đăng nhập hoạt động trong lúc triển khai cuốn chiếu; tính nguyên tử
        // sẽ được dùng ngay sau khi schema mới đã được áp dụng.
        currentTasksPayload = resetDailyCraftingTasks(currentTasksPayload);
        await upsertUserProgress([{
          nguoi_dung_id: user.id,
          loai_tien_do: 'achievement',
          doi_tuong_id: 'crafting_tasks',
          noi_dung_tien_do: currentTasksPayload,
        }]);
      } else {
        currentTasksPayload = normalizeCraftingTasks(resetPayload);
      }
    }

    user.craftingTasksPayload = currentTasksPayload;


    // Run the synchronization!
    const { unlockedChemicals, inventory, changed } = syncUserProgressData(unlockedChemicalsRaw, inventoryRaw);

    // If data changed, update it in the database and also update the database rows
    if (changed) {
      console.log(`[attachUserProgress] Progress out of sync for user ${user.id}. Synchronizing...`);
      const progressRows = [
        ...unlockedChemicals.map((chemical) => ({
          nguoi_dung_id: user.id,
          loai_tien_do: 'chemical',
          doi_tuong_id: chemical,
          noi_dung_tien_do: {}
        })),
        {
          nguoi_dung_id: user.id,
          loai_tien_do: 'achievement',
          doi_tuong_id: 'inventory',
          noi_dung_tien_do: inventory
        }
      ];

      // Delete out-of-sync formulas that were replaced or are redundant (e.g. ASCII instead of subscripts)
      const oldFormulasSet = new Set(unlockedChemicalsRaw);
      const newFormulasSet = new Set(unlockedChemicals);
      const formulasToDelete = [...oldFormulasSet].filter(f => !newFormulasSet.has(f));
      
      if (formulasToDelete.length > 0) {
        console.log(`[attachUserProgress] Deleting out-of-sync formulas: ${formulasToDelete.join(', ')}`);
        await supabase
          .from('tien_do_nguoi_dung')
          .delete()
          .eq('nguoi_dung_id', user.id)
          .eq('loai_tien_do', 'chemical')
          .in('doi_tuong_id', formulasToDelete);
      }

      await upsertUserProgress(progressRows);
    }

    user.unlocked_bai_hoc = unlockedLessons;
    user.unlocked_chemicals = unlockedChemicals;
    user.inventoryPayload = inventory;
    return user;
  } catch (error) {
    if (!isMissingDbObject(error)) throw error;
    console.warn('tien_do_nguoi_dung table or columns missing, returning base user.');
    user.unlocked_bai_hoc = [];
    user.unlocked_chemicals = [];
    user.inventoryPayload = normalizeInventory(user.inventoryPayload || user.inventory);
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
  const avatarUrl = (linkedAccounts.useGoogleAvatar !== false && typeof linkedAccounts.googleAvatarUrl === 'string') ? linkedAccounts.googleAvatarUrl : null;
  return {
    ...user,
    id: user.id,
    xp,
    level,
    createdAt: user.created_at,
    // Flatten normalized arrays if they exist in the joined record
    unlockedLessons: normalizeIdList(user.unlocked_bai_hoc, 'bai_hoc_id').length > 0
      ? normalizeIdList(user.unlocked_bai_hoc, 'bai_hoc_id')
      : normalizeIdList(user.unlockedLessons || [], 'bai_hoc_id'),
    unlockedChemicals: normalizeIdList(user.unlocked_chemicals, 'chemical_formula').length > 0
      ? normalizeIdList(user.unlocked_chemicals, 'chemical_formula')
      : normalizeIdList(user.unlockedChemicals || [], 'chemical_formula'),
    avatarSeed: user.avatar_seed || user.username,
    avatarUrl,
    arenaStats,
    arenaAvatar: { seed: 'Chem Master', aura: '#a855f7' },
    // Cleanup
    unlocked_bai_hoc: undefined,
    unlocked_chemicals: undefined,
    avatar_seed: undefined,
    arena_stats: undefined,
    thong_ke_dau: undefined,
    created_at: undefined,
    lastActiveAt: lastActiveAt || user.updated_at,
    activeMinutes,
    isOnline: Boolean(user.is_online || (lastActiveAt && new Date(lastActiveAt) > new Date(Date.now() - 5*60*1000))),
    isLocked,
    balancingProgress: normalizeBalancingProgress(user.balancingProgressPayload || user.balancingProgress),
    balancingProgressPayload: undefined,
    inventory: normalizeInventory(user.inventoryPayload || user.inventory),
    inventoryPayload: undefined,
    craftingTasks: user.craftingTasksPayload || normalizeCraftingTasks(null),
    craftingTasksPayload: undefined,
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
      email: typeof userData.email === 'string' ? userData.email.trim().toLowerCase() : null,
      password_hash: hashedPassword,
      role: userData.role || 'student',
      avatar_seed: userData.avatarSeed || userData.username,
      tai_khoan_lien_ket: userData.linkedAccounts || {},
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

    const { unlockedChemicals, inventory } = syncUserProgressData(initialChemicals, userData.inventory);

    const progressRows = [
      ...initialLessons.map((lessonId) => ({
        nguoi_dung_id: userId,
        loai_tien_do: 'lesson',
        doi_tuong_id: lessonId,
        noi_dung_tien_do: {}
      })),
      ...unlockedChemicals.map((chemical) => ({
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
      },
      {
        nguoi_dung_id: userId,
        loai_tien_do: 'achievement',
        doi_tuong_id: 'inventory',
        noi_dung_tien_do: inventory
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
    const inventory = updateData.inventory;
    delete pgUpdateData.balancingProgress;
    delete pgUpdateData.inventory;

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
      const normalizedChemicals = junctionChemicals.map(normalizeChemicalFormulaValue).filter(Boolean);
      progressRows.push(...normalizedChemicals.map((chemical) => ({
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

    if (inventory) {
      progressRows.push({
        nguoi_dung_id: id,
        loai_tien_do: 'achievement',
        doi_tuong_id: 'inventory',
        noi_dung_tien_do: normalizeInventory(inventory)
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
        id, username, role, diem_kinh_nghiem, cap_do, avatar_seed, tai_khoan_lien_ket, updated_at, hoat_dong_cuoi_luc, phut_hoat_dong, bi_khoa
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
    const data = [];
    let cursor;
    // PostgREST caps each response. Walk the primary key so every student is
    // included, even when the server's configured cap is below our page size.
    while (true) {
      let query = supabase
        .from('nguoi_dung')
        .select('id, username, diem_kinh_nghiem, cap_do, ke_hoach_hoc, so_ngay_chuoi, avatar_seed')
        .eq('role', 'student')
        .order('id', { ascending: true })
        .limit(500);
      if (cursor) query = query.gt('id', cursor);
      const { data: page, error } = await query;
      if (error) throw error;
      if (!page?.length) break;
      data.push(...page);
      const nextCursor = page.at(-1).id;
      if (!nextCursor || nextCursor === cursor) throw new Error('Không thể phân trang thống kê người dùng.');
      cursor = nextCursor;
    }
    
    const totalXP = data.reduce((sum, u) => sum + (u.diem_kinh_nghiem || 0), 0);
    const avgLevel = data.length > 0 ? data.reduce((sum, u) => sum + (u.cap_do || 1), 0) / data.length : 0;
    
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
  },

  async incrementCraftingTaskProgress(userId, actionType, itemId) {
    try {
      const matchingTasks = craftingTasks
        .filter(task => task.actionType === actionType)
        .map(task => ({ id: task.id, target: task.target }));
      if (matchingTasks.length === 0) return null;

      const { data, error } = await supabase.rpc('increment_crafting_task_progress', {
        p_user_id: userId,
        p_item_id: itemId || null,
        p_tasks: matchingTasks,
        p_reset_payload: resetDailyCraftingTasks(null),
      });
      if (error) throw error;
      return normalizeCraftingTasks(data);
    } catch (e) {
      console.error('[incrementCraftingTaskProgress] Error:', e.message);
      return null;
    }
  },

  async claimCraftingTaskReward(userId, taskId) {
    try {
      const { data: taskRecord, error: fetchTaskError } = await supabase
        .from('tien_do_nguoi_dung')
        .select('noi_dung_tien_do')
        .eq('nguoi_dung_id', userId)
        .eq('loai_tien_do', 'achievement')
        .eq('doi_tuong_id', 'crafting_tasks')
        .maybeSingle();

      if (fetchTaskError) throw fetchTaskError;

      const currentTasks = normalizeCraftingTasks(taskRecord?.noi_dung_tien_do);
      const userTask = currentTasks.tasks[taskId];
      
      const taskDef = craftingTasks.find(t => t.id === taskId);
      if (!userTask || !taskDef) throw new Error("Không tìm thấy nhiệm vụ.");
      if (userTask.claimed) throw new Error("Phần thưởng này đã được nhận.");
      if (userTask.progress < taskDef.target) throw new Error("Chưa hoàn thành mục tiêu nhiệm vụ.");
      const rewardsToGrant = (userTask.rewards && userTask.rewards.length > 0)
        ? userTask.rewards
        : taskDef.rewards;
      const xpReward = taskDef.difficulty === 'hard' ? 150 : taskDef.difficulty === 'medium' ? 100 : 50;

      const { data, error } = await supabase.rpc('claim_crafting_task_reward', {
        p_user_id: userId,
        p_task_id: taskId,
        p_target: taskDef.target,
        p_rewards: rewardsToGrant,
        p_xp_reward: xpReward,
      });
      if (error) throw error;
      if (!data) throw new Error('Không thể nhận phần thưởng lúc này.');

      return {
        tasks: normalizeCraftingTasks(data.tasks),
        inventory: normalizeInventory(data.inventory),
        rewards: Array.isArray(data.rewards) ? data.rewards : rewardsToGrant,
        xpGained: data.xpGained ?? xpReward,
        totalXP: data.totalXP,
        newLevel: data.newLevel,
      };
    } catch (e) {
      console.error('[claimCraftingTaskReward] Error:', e.message);
      throw e;
    }
  }
};

export default User;
