import express from 'express';
import User from '../_models/User.js';
import Feedback from '../_models/Feedback.js';
import Lesson from '../_models/Lesson.js';
import Mission from '../_models/Mission.js';
import { supabase } from '../_lib/supabase.js';
import { sendStudyPlanHourlyReminderEmail, sendStreakReminderEmail } from '../_lib/mailer.js';
import { getLessonIngredientRewards, grantIngredientsToInventory } from '../../src/data/labInventory.js';
import { LESSON_LEVEL_XP } from '../../shared/journeyRewards.js';
import {
  getPlacementAssessment,
  gradePlacementAssessment,
  PLACEMENT_GRADES as SUPPORTED_PLACEMENT_GRADES,
} from '../_data/placementAssessments.js';

const router = express.Router();

import { auth } from '../_middleware/auth.js';

const VIETNAM_TIME_ZONE = 'Asia/Ho_Chi_Minh';
const DEFAULT_STUDY_PLAN = {
  dailyLessonTarget: 1,
  emailEnabled: false,
  completed: false,
  grade: null,
};
const STUDY_REMINDER_INTERVAL_MINUTES = 240;
const PROFILE_UPDATE_FIELDS = new Set(['avatarSeed', 'studyPlan', 'username', 'useGoogleAvatar']);
const PLACEMENT_GRADES = new Set(['9', '10', '11', '12']);
const ALL_PLACEMENT_GRADES = new Set(SUPPORTED_PLACEMENT_GRADES);

const datePartFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: VIETNAM_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const timePartFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: VIETNAM_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const getFormatterParts = (formatter, date) => Object.fromEntries(
  formatter.formatToParts(date)
    .filter(part => part.type !== 'literal')
    .map(part => [part.type, part.value])
);

const getVietnamDateKey = (date) => {
  const parts = getFormatterParts(datePartFormatter, date);
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const getVietnamMinuteOfDay = (date) => {
  const parts = getFormatterParts(timePartFormatter, date);
  return Number(parts.hour) * 60 + Number(parts.minute);
};

const getVietnamHHMM = (date) => {
  const parts = getFormatterParts(timePartFormatter, date);
  return `${parts.hour}:${parts.minute}`;
};

const normalizeStudyPlan = (incoming, existing = {}) => {
  const base = existing && typeof existing === 'object' && !Array.isArray(existing) ? existing : {};
  const patch = incoming && typeof incoming === 'object' && !Array.isArray(incoming) ? incoming : {};
  const merged = { ...DEFAULT_STUDY_PLAN, ...base, ...patch };
  const target = Number.parseInt(merged.dailyLessonTarget, 10);

  return {
    dailyLessonTarget: Number.isFinite(target) ? Math.min(Math.max(target, 1), 10) : DEFAULT_STUDY_PLAN.dailyLessonTarget,
    emailEnabled: Boolean(merged.emailEnabled),
    completed: Boolean(merged.completed),
    grade: merged.grade || null,
    lastStudyReminderDate: merged.lastStudyReminderDate || null,
    lastReminderSentAt: merged.lastReminderSentAt || null,
    firstReminderSentAt: merged.firstReminderSentAt || null,
  };
};

const resetStudyReminderState = (plan) => {
  const {
    lastStudyReminderDate: _lastStudyReminderDate,
    lastReminderSentAt: _lastReminderSentAt,
    firstReminderSentAt: _firstReminderSentAt,
    ...rest
  } = plan;

  return rest;
};

const shouldResetStudyReminderState = (nextPlan, previousPlan = {}) => {
  const previous = normalizeStudyPlan(previousPlan);

  return nextPlan.dailyLessonTarget !== previous.dailyLessonTarget
    || (nextPlan.emailEnabled && !previous.emailEnabled);
};

const toProfileResponse = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email || null,
  role: user.role,
  xp: user.xp,
  level: user.level,
  inventory: user.inventory || { ingredients: [], craftedItems: [] },
  unlockedLessons: user.unlockedLessons || [],
  unlockedChemicals: user.unlockedChemicals || [],
  avatarSeed: user.avatarSeed,
  createdAt: user.createdAt,
  arenaStats: user.arenaStats || { total: 0, wins: 0, losses: 0, points: 0 },
  arenaAvatar: user.arenaAvatar || { seed: 'Chem Master', aura: '#a855f7' },
  balancingProgress: user.balancingProgress || { completedNodeIds: [], completedCount: 0, passedGrades: [], lessonStars: {} },
  studyPlan: user.studyPlan,
  streakCount: user.streakCount || 0,
  lastStreakAt: user.lastStreakAt,
  todayOnlineMinutes: user.todayOnlineMinutes || 0,
  todayLessonCompleted: user.todayLessonCompleted || false,
  linkedAccounts: user.linkedAccounts || {}
});

const applyLessonStreak = (updateFields, user) => {
  updateFields.today_lesson_completed = true;
  const plan = normalizeStudyPlan(user.studyPlan);
  plan.completed = true;
  updateFields.studyPlan = plan;
  
  const now = new Date();
  const today = getVietnamDateKey(now);
  const lastStreak = user.lastStreakAt ? getVietnamDateKey(new Date(user.lastStreakAt)) : null;

  if (today !== lastStreak) {
    updateFields.streak_count = (user.streakCount || 0) + 1;
    updateFields.last_streak_at = now.toISOString();
  }
};

// Get Online Count (Public)
router.get('/online-count', async (req, res) => {
  try {
    const activeCount = await User.countActiveStudents();
    // Fallback minimum to 1 if we are sure at least the current user is active (though this is public)
    res.json({ count: Math.max(1, activeCount) });
  } catch (_err) {
    res.status(200).json({ count: 1 });
  }
});

// Get Leaderboard (Public)
router.get('/leaderboard', async (req, res) => {
  try {
    const students = await User.findStudents();
    // Return only top 10 and strip sensitive data if any
    const topStudents = students
      .filter(s => (s.xp || 0) > 0)
      .slice(0, 10)
      .map(s => ({
        username: s.username,
        xp: s.xp || 0,
        level: s.level || 1,
        role: s.role,
        avatarSeed: s.avatarSeed,
        streakCount: s.streakCount || 0,
        lastActiveAt: s.lastActiveAt,
        activeMinutes: s.activeMinutes,
        isOnline: s.isOnline
      }));
    res.json(topStudents);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải bảng xếp hạng', error: err.message });
  }
});

// Get Public Praises (Home Page)
router.get('/public-praises', async (req, res) => {
  try {
    const praises = await Feedback.getApprovedPraises();
    res.json(praises);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tải lời khen ngợi', error: err.message });
  }
});

// Get Profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json(toProfileResponse(req.user));
  } catch (err) {
    console.error('Error in /profile:', err);
    res.status(500).json({ message: 'Không thể tải hồ sơ lúc này.', error: err.message });
  }
});

// Update Profile
router.patch('/profile', auth, async (req, res) => {
  try {
    const invalidFields = Object.keys(req.body || {}).filter((field) => !PROFILE_UPDATE_FIELDS.has(field));
    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: 'Unsupported profile fields',
        fields: invalidFields,
      });
    }

    const updateData = { ...req.body };

    if (updateData.username) {
      const existingUser = await User.findOne({ username: updateData.username });
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
      }
    }

    if (Object.prototype.hasOwnProperty.call(updateData, 'studyPlan')) {
      const nextStudyPlan = normalizeStudyPlan(updateData.studyPlan, req.user.studyPlan);
      updateData.studyPlan = shouldResetStudyReminderState(nextStudyPlan, req.user.studyPlan)
        ? resetStudyReminderState(nextStudyPlan)
        : nextStudyPlan;
    }

    // Handle useGoogleAvatar toggle - store it inside linkedAccounts
    if (Object.prototype.hasOwnProperty.call(updateData, 'useGoogleAvatar')) {
      const useGoogle = Boolean(updateData.useGoogleAvatar);
      const currentLinked = req.user.linkedAccounts || {};
      updateData.linkedAccounts = { ...currentLinked, useGoogleAvatar: useGoogle };
      delete updateData.useGoogleAvatar;
    }

    const updatedUser = await User.update(req.user.id, updateData);
    res.json(toProfileResponse(updatedUser));
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật thông tin', error: err.message });
  }
});

router.post('/progress', auth, async (_req, res) => {
  res.status(410).json({ message: 'Deprecated. Use the dedicated lesson and placement endpoints.' });
});

router.post('/placement/start', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Chỉ tài khoản học sinh mới cần xếp lớp.' });
    }

    const grade = String(req.body?.grade || '');
    if (!ALL_PLACEMENT_GRADES.has(grade)) {
      return res.status(400).json({ message: 'Khối lớp lựa chọn không hợp lệ.' });
    }

    const currentProgress = req.user.balancingProgress || {};
    const currentPlacement = currentProgress.placement;
    if (currentPlacement?.required !== true) {
      return res.status(409).json({ message: 'Tài khoản này không thuộc luồng xếp lớp ban đầu.' });
    }
    if (currentPlacement.status === 'placed' && currentPlacement.assignedGrade) {
      return res.status(409).json({ message: `Bạn đã được xếp vào lớp ${currentPlacement.assignedGrade}.` });
    }

    const lessons = await Lesson.find({ classId: grade, view: 'summary' });
    const firstLesson = lessons[0];
    const assessment = getPlacementAssessment(grade);
    if (!firstLesson || !assessment) {
      return res.status(409).json({ message: 'Khối này chưa đủ dữ liệu để xếp lớp. Vui lòng chọn khối khác.' });
    }

    const attemptId = crypto.randomUUID();
    const nextPlacement = {
      ...currentPlacement,
      required: true,
      status: 'testing',
      assignedGrade: null,
      selectedGrade: grade,
      attemptId,
      attempts: (Number(currentPlacement.attempts) || 0) + 1,
      startedAt: new Date().toISOString(),
      firstLessonId: firstLesson.lessonId,
      firstLessonTitle: firstLesson.title,
      firstLessonOrder: firstLesson.order,
    };

    const updatedUser = await User.update(req.user.id, {
      balancingProgress: { ...currentProgress, placement: nextPlacement },
    });

    res.json({
      success: true,
      user: toProfileResponse(updatedUser),
      assessment: {
        ...assessment,
        attemptId,
        firstLesson: {
          lessonId: firstLesson.lessonId,
          title: firstLesson.title,
          order: firstLesson.order,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Không thể bắt đầu bài xếp lớp lúc này.', error: err.message });
  }
});

router.post('/placement/submit', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Chỉ tài khoản học sinh mới cần xếp lớp.' });
    }

    const currentProgress = req.user.balancingProgress || {};
    const currentPlacement = currentProgress.placement;
    const attemptId = String(req.body?.attemptId || '');
    if (currentPlacement?.required !== true
      || currentPlacement.status !== 'testing'
      || !attemptId
      || attemptId !== currentPlacement.attemptId) {
      return res.status(409).json({ message: 'Lượt xếp lớp đã hết hạn. Vui lòng chọn khối và bắt đầu lại.' });
    }

    const result = gradePlacementAssessment(currentPlacement.selectedGrade, req.body?.answers);
    if (!result) {
      return res.status(400).json({ message: 'Bạn cần trả lời đầy đủ tất cả câu hỏi.' });
    }

    const grade = currentPlacement.selectedGrade;
    const recommendedGrade = result.passed
      ? grade
      : String(Math.max(Number(SUPPORTED_PLACEMENT_GRADES[0]), Number(grade) - 1));
    const completedAt = new Date().toISOString();
    const history = [
      ...(Array.isArray(currentPlacement.history) ? currentPlacement.history : []),
      { grade, correct: result.correct, total: result.total, percent: result.percent, passed: result.passed, completedAt },
    ].slice(-10);
    const nextPlacement = {
      ...currentPlacement,
      status: result.passed ? 'placed' : 'unassigned',
      assignedGrade: result.passed ? grade : null,
      selectedGrade: result.passed ? grade : null,
      attemptId: null,
      completedAt,
      history,
      lastResult: { ...result, grade, recommendedGrade },
    };

    const updateFields = {
      balancingProgress: { ...currentProgress, placement: nextPlacement },
    };
    if (result.passed) {
      updateFields.studyPlan = {
        ...normalizeStudyPlan(req.user.studyPlan),
        grade,
      };
    }

    const updatedUser = await User.update(req.user.id, updateFields);
    res.json({
      success: true,
      user: toProfileResponse(updatedUser),
      result: { ...result, grade, recommendedGrade },
      firstLesson: result.passed ? {
        lessonId: currentPlacement.firstLessonId,
        title: currentPlacement.firstLessonTitle,
        order: currentPlacement.firstLessonOrder,
      } : null,
    });
  } catch (err) {
    res.status(500).json({ message: 'Không thể chấm bài xếp lớp lúc này.', error: err.message });
  }
});

router.post('/lesson-segment', auth, async (req, res) => {
  try {
    const { lessonId, level, stars } = req.body || {};
    if (!lessonId || !Object.prototype.hasOwnProperty.call(LESSON_LEVEL_XP, level)) {
      return res.status(400).json({ message: 'Dữ liệu phần bài học không hợp lệ.' });
    }

    const requestedStars = Number.parseInt(stars, 10);
    if (!Number.isFinite(requestedStars) || requestedStars < 1 || requestedStars > 3) {
      return res.status(400).json({ message: 'Số sao không hợp lệ.' });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Không tìm thấy bài học.' });
    }

    const placement = req.user.balancingProgress?.placement;
    if (req.user.role === 'student' && placement?.required === true) {
      const canRecordProgress = placement.status === 'placed'
        && String(placement.assignedGrade) === String(lesson.classId);
      if (!canRecordProgress) {
        return res.status(403).json({ message: 'Bạn cần hoàn tất xếp lớp trước khi lưu tiến độ của khối này.' });
      }
    }

    const currentProgress = req.user.balancingProgress || { completedNodeIds: [], completedCount: 0, passedGrades: [], lessonStars: {} };
    const lessonStars = { ...(currentProgress.lessonStars || {}) };
    const currentLessonStars = { ...(lessonStars[lessonId] || { level1: 0, level2: 0, level3: 0 }) };
    const prerequisiteLevel = level === 'level2' ? 'level1' : level === 'level3' ? 'level2' : null;
    if (req.user.role === 'student' && prerequisiteLevel && !(currentLessonStars[prerequisiteLevel] > 0)) {
      return res.status(409).json({
        message: `Bạn cần hoàn thành ${prerequisiteLevel === 'level1' ? 'mốc 1' : 'mốc 2'} trước.`,
      });
    }

    const previousStars = currentLessonStars[level] || 0;
    const firstCompletionForLevel = previousStars <= 0;

    // Mỗi vòng là một mốc hoàn thành và chỉ tương ứng với đúng một sao.
    // Vẫn chấp nhận payload 1-3 từ client cũ nhưng không còn dùng điểm số để
    // làm tăng số sao của một vòng.
    currentLessonStars[level] = 1;
    lessonStars[lessonId] = currentLessonStars;

    const updateFields = {
      balancingProgress: {
        ...currentProgress,
        lessonStars,
      },
    };

    if (firstCompletionForLevel) {
      const streakBonus = Math.floor((req.user.streakCount || 0) / 7) * 5;
      const nextXp = (req.user.xp || 0) + LESSON_LEVEL_XP[level] + streakBonus;
      updateFields.xp = nextXp;
      updateFields.level = Math.floor(nextXp / 1000) + 1;

      const labRewards = getLessonIngredientRewards({ lesson, lessonId, level, stars: 1 });
      updateFields.inventory = grantIngredientsToInventory(req.user.inventory, labRewards);
    }

    if (level === 'level3') {
      const unlockedLessons = Array.isArray(req.user.unlockedLessons) ? [...req.user.unlockedLessons] : [];
      if (!unlockedLessons.includes(lessonId)) {
        unlockedLessons.push(lessonId);
        updateFields.unlockedLessons = unlockedLessons;
      }
      applyLessonStreak(updateFields, req.user);
    }

    if (level === 'level1') {
      try {
        await User.incrementCraftingTaskProgress(req.user.id, 'watch_video', lessonId);
      } catch (err) {
        console.warn('⚠️ Lỗi tăng tiến độ nhiệm vụ xem video bài giảng:', err.message);
      }
    } else if (level === 'level3') {
      try {
        await User.incrementCraftingTaskProgress(req.user.id, 'complete_lesson', lessonId);
        await Mission.updateProgress(req.user.id, 'lesson_complete', 1);
      } catch (err) {
        console.warn('⚠️ Lỗi tăng tiến độ nhiệm vụ hoàn thành bài học:', err.message);
      }
    }

    const updatedUser = await User.update(req.user.id, updateFields);
    res.json({
      success: true,
      user: toProfileResponse(updatedUser),
      awardedStars: firstCompletionForLevel ? 1 : 0,
    });
  } catch (err) {
    res.status(500).json({ message: 'Không thể lưu tiến độ bài học lúc này.', error: err.message });
  }
});

router.post('/placement-pass', auth, async (req, res) => {
  try {
    if (req.user.balancingProgress?.placement?.required === true) {
      return res.status(403).json({ message: 'Tài khoản mới phải hoàn thành bài xếp lớp được chấm ở máy chủ.' });
    }
    const grade = String(req.body?.grade || '');
    if (!PLACEMENT_GRADES.has(grade)) {
      return res.status(400).json({ message: 'Khối lớp kiểm tra không hợp lệ.' });
    }

    const currentProgress = req.user.balancingProgress || { completedNodeIds: [], completedCount: 0, passedGrades: [], lessonStars: {} };
    const passedGrades = Array.isArray(currentProgress.passedGrades) ? currentProgress.passedGrades : [];
    const alreadyPassed = passedGrades.includes(grade);
    const updateFields = {
      balancingProgress: {
        ...currentProgress,
        passedGrades: alreadyPassed ? passedGrades : [...passedGrades, grade],
      },
    };

    if (!alreadyPassed) {
      const nextXp = (req.user.xp || 0) + 500;
      updateFields.xp = nextXp;
      updateFields.level = Math.floor(nextXp / 1000) + 1;
    }

    const updatedUser = await User.update(req.user.id, updateFields);
    res.json({ success: true, user: toProfileResponse(updatedUser), xpGained: alreadyPassed ? 0 : 500 });
  } catch (err) {
    res.status(500).json({ message: 'Không thể lưu kết quả kiểm tra lúc này.', error: err.message });
  }
});

// Link an OAuth provider to the current account.
router.post('/link-account', auth, async (req, res) => {
  try {
    const { provider, providerAccessToken } = req.body || {};
    if (provider !== 'google' || typeof providerAccessToken !== 'string' || providerAccessToken.length > 16384) {
      return res.status(400).json({ message: 'Cần phiên Google hợp lệ để liên kết tài khoản.' });
    }
    const { data, error } = await supabase.auth.getUser(providerAccessToken);
    const providerUser = data?.user;
    if (error || !providerUser || !providerUser.email_confirmed_at
      || !providerUser.identities?.some((identity) => identity.provider === 'google')
      || !req.user.email || providerUser.email?.trim().toLowerCase() !== req.user.email.trim().toLowerCase()) {
      return res.status(403).json({ message: 'Phiên Google phải xác minh đúng email của tài khoản hiện tại.' });
    }
    const accountId = providerUser.id;

    // Check if another user already linked this account
    const filter = { googleId: accountId };
    const existingUser = await User.findOne(filter);
    if (existingUser && existingUser.id !== req.user.id) {
      return res.status(400).json({ message: 'Tài khoản này đã được liên kết với một người dùng khác' });
    }

    const linkedAccounts = { ...(req.user.linkedAccounts || {}) };
    linkedAccounts[provider] = accountId;

    await User.update(req.user.id, { linkedAccounts });

    res.json({ message: `Đã liên kết tài khoản ${provider} thành công!`, linkedAccounts });
  } catch (err) {
    res.status(err.code === '23505' ? 409 : 500).json({ message: 'Không thể liên kết tài khoản. Vui lòng kiểm tra tài khoản Google và thử lại.' });
  }
});

// Activity Logging Routes
router.post('/activities', auth, async (req, res) => {
  try {
    const { action_type, description, metadata } = req.body;
    const { error } = await supabase
      .from('hoat_dong_nguoi_dung')
      .insert([{
        nguoi_dung_id: req.user.id,
        loai_hanh_dong: action_type,
        mo_ta: description,
        thong_tin_bo_sung: metadata
      }]);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/activities', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hoat_dong_nguoi_dung')
      .select('*')
      .eq('nguoi_dung_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (error) throw error;
    res.json((data || []).map((activity) => ({
      ...activity,
      action_type: activity.loai_hanh_dong ?? activity.action_type,
      description: activity.mo_ta ?? activity.description,
      metadata: activity.thong_tin_bo_sung ?? activity.metadata,
      loai_hanh_dong: undefined,
      mo_ta: undefined,
      thong_tin_bo_sung: undefined
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/activities', auth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('hoat_dong_nguoi_dung')
      .delete()
      .eq('nguoi_dung_id', req.user.id);
      
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Heartbeat (Activity Tracking & Streak)
router.post('/heartbeat', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const today = getVietnamDateKey(now);
    const lastActiveDate = req.user.lastActiveAt ? getVietnamDateKey(new Date(req.user.lastActiveAt)) : null;
    
    let onlineMinutes = req.user.todayOnlineMinutes || 0;
    
    // Reset online minutes if it's a new day
    if (today !== lastActiveDate) {
      onlineMinutes = 0;
    }
    
    onlineMinutes += 1;
    
    const updateFields = {
      last_active_at: now.toISOString(),
      today_online_minutes: onlineMinutes,
      active_minutes: (req.user.activeMinutes || 0) + 1
    };

    // Auto-reset today_lesson_completed on new day
    if (today !== lastActiveDate) {
      updateFields.today_lesson_completed = false;
      const plan = normalizeStudyPlan(req.user.studyPlan);
      plan.completed = false;
      updateFields.studyPlan = plan;
    }

    // Check for streak maintenance (10 minutes online)
    const lastStreakDate = req.user.lastStreakAt ? getVietnamDateKey(new Date(req.user.lastStreakAt)) : null;
    if (onlineMinutes >= 10 && today !== lastStreakDate) {
      updateFields.streak_count = (req.user.streakCount || 0) + 1;
      updateFields.last_streak_at = now.toISOString();
    }

    const updatedUser = await User.update(userId, updateFields);
    const userProfile = await User.findById(userId);

    res.json({ 
      success: true, 
      onlineMinutes, 
      streakCount: updatedUser.streakCount,
      todayLessonCompleted: updatedUser.todayLessonCompleted,
      user: userProfile
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Recover Streak
router.post('/streak/recover', auth, async (req, res) => {
  try {
    const { streakToRestore } = req.body; // The streak count they want to get back
    const currentXP = req.user.xp || 0;
    
    // Cost formula: 100 XP base + (streak * 20)
    const cost = 100 + (streakToRestore * 20);
    
    if (currentXP < cost) {
      return res.status(200).json({ success: false, message: `Bạn cần ${cost} XP để khôi phục chuỗi ${streakToRestore} ngày. Hiện tại bạn chỉ có ${currentXP} XP.` });
    }

    const updatedUser = await User.update(req.user.id, {
      xp: currentXP - cost,
      streak_count: streakToRestore,
      last_streak_at: new Date().toISOString()
    });

    res.json({
      message: 'Khôi phục chuỗi thành công!',
      streakCount: updatedUser.streakCount,
      xp: updatedUser.xp
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khôi phục chuỗi', error: err.message });
  }
});

// Reset Streak (Accept Loss)
router.post('/streak/reset', auth, async (req, res) => {
  try {
    const updatedUser = await User.update(req.user.id, {
      streak_count: 0,
      last_streak_at: new Date().toISOString()
    });

    res.json({
      message: 'Đã thiết lập lại chuỗi!',
      streakCount: updatedUser.streakCount
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi thiết lập lại chuỗi', error: err.message });
  }
});

// Cron Job: Send Study Plan Reminders & Streak Reminders
router.get('/cron-send-reminders', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;

    if (process.env.NODE_ENV === 'production') {
      if (!cronSecret) {
        console.error('[Cron Reminders] CRON_SECRET is missing in production.');
        return res.status(503).json({ message: 'Cron endpoint chưa được cấu hình bảo mật.' });
      }

      if (authHeader !== `Bearer ${cronSecret}`) {
        return res.status(401).json({ message: 'Không có quyền truy cập endpoint này.' });
      }
    }

    console.log('[Cron Reminders] Starting reminder check...');

    const loadReminderStudents = () => supabase
      .from('nguoi_dung')
      .select('id, username, email, ke_hoach_hoc, da_hoan_thanh_bai_hom_nay, so_ngay_chuoi')
      .eq('role', 'student');

    let { data: students, error } = await loadReminderStudents();
    const errorText = [error?.message, error?.details].filter(Boolean).join(' ');

    if (error && /fetch failed|ECONNRESET|network/i.test(errorText)) {
      console.warn('[Cron Reminders] Transient Supabase error, retrying once.');
      await new Promise((resolve) => setTimeout(resolve, 500));
      ({ data: students, error } = await loadReminderStudents());
    }

    if (error) {
      console.error('[Cron Reminders] Supabase fetch error:', error);
      return res.status(500).json({ message: 'Loi truy van co so du lieu', error: error.message });
    }

    const now = new Date();
    const todayKey = getVietnamDateKey(now);
    const currentHHMM = getVietnamHHMM(now);
    const results = [];
    const skipped = {
      noEmail: 0,
      completed: 0,
      disabled: 0,
      invalidTime: 0,
      notDue: 0,
    };

    console.log(`[Cron Reminders] Current Vietnam Time: ${todayKey} ${currentHHMM}`);

    for (const student of (students || [])) {
      const plan = normalizeStudyPlan(student.ke_hoach_hoc);
      let updatedPlan = { ...plan };
      let hasPlanUpdate = false;

      if (!plan.emailEnabled) {
        skipped.disabled += 1;
        continue;
      }

      if (!student.email) {
        skipped.noEmail += 1;
        results.push({
          username: student.username,
          type: 'email_reminder',
          success: false,
          error: 'missing_student_email',
        });
        continue;
      }

      if (student.da_hoan_thanh_bai_hom_nay) {
        skipped.completed += 1;
        continue;
      }

      // Mặc định thời gian nhắc nhở là 12am (00:00) -> 0 phút của ngày
      const scheduledMinute = 0;

      const checkAt = new Date();
      const checkTodayKey = getVietnamDateKey(checkAt);
      const checkMinute = getVietnamMinuteOfDay(checkAt);

      if (checkMinute >= scheduledMinute) {
        const lateMinutes = Math.max(0, checkMinute - scheduledMinute);
        const lastSentAt = plan.lastReminderSentAt ? new Date(plan.lastReminderSentAt) : null;
        const lastSentValid = lastSentAt instanceof Date && !Number.isNaN(lastSentAt.getTime());
        const minutesSinceLast = lastSentValid ? Math.floor((checkAt - lastSentAt) / 60000) : Infinity;
        const lastStudyReminderDate = plan.lastStudyReminderDate
          || (lastSentValid ? getVietnamDateKey(lastSentAt) : null);
        const isFirstToday = lastStudyReminderDate !== checkTodayKey;
        const shouldSendStudyReminder = isFirstToday || minutesSinceLast >= STUDY_REMINDER_INTERVAL_MINUTES;

        if (shouldSendStudyReminder) {
          const sendAttemptAt = new Date();
          const sendAttemptDateKey = getVietnamDateKey(sendAttemptAt);
          const sendAttemptMinute = getVietnamMinuteOfDay(sendAttemptAt);
          const lateMinutesAtSend = sendAttemptDateKey === checkTodayKey
            ? Math.max(0, sendAttemptMinute - scheduledMinute)
            : lateMinutes;
          const hourOffset = Math.max(0, Math.floor(lateMinutesAtSend / 60));
          const streakCount = student.so_ngay_chuoi || 0;

          let sendResult;
          if (streakCount > 0) {
            console.log(`[Cron Reminders] Sending streak reminder to ${student.username} (streak: ${streakCount}, late: ${lateMinutesAtSend}m, offset: ${hourOffset}h)`);
            sendResult = await sendStreakReminderEmail(student.email, student.username, streakCount, hourOffset, lateMinutesAtSend);
          } else {
            console.log(`[Cron Reminders] Sending study reminder to ${student.username} (late: ${lateMinutesAtSend}m, offset: ${hourOffset}h)`);
            sendResult = await sendStudyPlanHourlyReminderEmail(student.email, student.username, plan, hourOffset, lateMinutesAtSend);
          }

          results.push({
            username: student.username,
            email: student.email,
            type: streakCount > 0 ? 'streak_reminder' : 'study_reminder',
            hourOffset,
            lateMinutes: lateMinutesAtSend,
            success: sendResult.success,
            error: sendResult.error || null,
          });

          if (sendResult.success) {
            const sentAt = sendAttemptAt.toISOString();
            updatedPlan = {
              ...updatedPlan,
              lastStudyReminderDate: checkTodayKey,
              lastReminderSentAt: sentAt,
              firstReminderSentAt: isFirstToday ? sentAt : (plan.firstReminderSentAt || sentAt),
            };
            hasPlanUpdate = true;
          }
        } else {
          skipped.notDue += 1;
        }
      } else {
        skipped.notDue += 1;
      }

      if (hasPlanUpdate) {
        await User.update(student.id, { studyPlan: updatedPlan });
      }
    }

    const successfulCount = results.filter(r => r.success).length;

    console.log(`[Cron Reminders] Completed. Successfully sent ${successfulCount}/${results.length} emails.`);

    res.json({
      message: `Da hoan thanh gui nhac nho: ${successfulCount}/${results.length} thanh cong.`,
      sentCount: successfulCount,
      checkedCount: students?.length || 0,
      skipped,
      details: results,
    });
  } catch (err) {
    console.error('[Cron Reminders] Unexpected error:', err);
    res.status(500).json({ message: 'Loi he thong bat ngo', error: err.message });
  }
});
export default router;
