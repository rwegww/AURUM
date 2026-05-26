import express from 'express';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import Lesson from '../models/Lesson.js';
import { supabase } from '../lib/supabase.js';
import { sendStudyPlanHourlyReminderEmail, sendStreakReminderEmail } from '../lib/mailer.js';

const router = express.Router();

import { auth } from '../_middleware/auth.js';

const VIETNAM_TIME_ZONE = 'Asia/Ho_Chi_Minh';
const DEFAULT_STUDY_PLAN = {
  studyTime: '20:00',
  dailyLessonTarget: 1,
  remindersEnabled: true,
  emailEnabled: false,
  calendarEnabled: false,
};
const STUDY_REMINDER_INTERVAL_MINUTES = 60;
const PROFILE_UPDATE_FIELDS = new Set(['avatarSeed', 'studyPlan']);
const LESSON_LEVEL_XP = {
  level1: 30,
  level2: 50,
  level3: 100,
};
const PLACEMENT_GRADES = new Set(['9', '10', '11', '12']);

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

const parseStudyTimeMinutes = (value) => {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^([01]\d|2[0-3]):([0-5]\d)$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
};

const normalizeStudyPlan = (incoming, existing = {}) => {
  const base = existing && typeof existing === 'object' && !Array.isArray(existing) ? existing : {};
  const patch = incoming && typeof incoming === 'object' && !Array.isArray(incoming) ? incoming : {};
  const merged = { ...DEFAULT_STUDY_PLAN, ...base, ...patch };
  const target = Number.parseInt(merged.dailyLessonTarget, 10);

  return {
    ...merged,
    studyTime: parseStudyTimeMinutes(merged.studyTime) !== null ? merged.studyTime.trim() : DEFAULT_STUDY_PLAN.studyTime,
    dailyLessonTarget: Number.isFinite(target) ? Math.min(Math.max(target, 1), 10) : DEFAULT_STUDY_PLAN.dailyLessonTarget,
    remindersEnabled: Boolean(merged.remindersEnabled),
    emailEnabled: Boolean(merged.emailEnabled),
    calendarEnabled: Boolean(merged.calendarEnabled),
    customSessions: merged.customSessions && typeof merged.customSessions === 'object' && !Array.isArray(merged.customSessions)
      ? merged.customSessions
      : {},
    completedDates: Array.isArray(merged.completedDates) ? merged.completedDates : [],
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

  return nextPlan.studyTime !== previous.studyTime
    || nextPlan.dailyLessonTarget !== previous.dailyLessonTarget
    || (nextPlan.remindersEnabled && !previous.remindersEnabled)
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
  const today = new Date().toISOString().split('T')[0];
  const lastStreak = user.lastStreakAt ? new Date(user.lastStreakAt).toISOString().split('T')[0] : null;

  if (today !== lastStreak) {
    updateFields.streak_count = (user.streakCount || 0) + 1;
    updateFields.last_streak_at = new Date().toISOString();
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
    const topStudents = students.slice(0, 10).map(s => ({
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
  // If 'claim' param is true, update the currentSessionId in DB
  if (req.query.claim === 'true') {
    const sessionId = req.header('X-Session-ID');
    if (sessionId) {
      await User.update(req.user.id, { currentSessionId: sessionId });
      req.user.currentSessionId = sessionId; // Update in-memory user for immediate consistency
    }
  }

  res.json(toProfileResponse(req.user));
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
    if (Object.prototype.hasOwnProperty.call(updateData, 'studyPlan')) {
      const nextStudyPlan = normalizeStudyPlan(updateData.studyPlan, req.user.studyPlan);
      updateData.studyPlan = shouldResetStudyReminderState(nextStudyPlan, req.user.studyPlan)
        ? resetStudyReminderState(nextStudyPlan)
        : nextStudyPlan;
    }

    const updatedUser = await User.update(req.user.id, updateData);
    res.json(toProfileResponse(updatedUser));
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật thông tin', error: err.message });
  }
});

router.post('/progress', auth, async (_req, res) => {
  res.status(410).json({ message: 'Deprecated. Use /api/user/lesson-segment or /api/user/placement-pass.' });
});

router.post('/lesson-segment', auth, async (req, res) => {
  try {
    const { lessonId, level, stars } = req.body || {};
    if (!lessonId || !Object.prototype.hasOwnProperty.call(LESSON_LEVEL_XP, level)) {
      return res.status(400).json({ message: 'Invalid lesson segment payload' });
    }

    const normalizedStars = Number.parseInt(stars, 10);
    if (!Number.isFinite(normalizedStars) || normalizedStars < 1 || normalizedStars > 3) {
      return res.status(400).json({ message: 'Invalid star count' });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    const currentProgress = req.user.balancingProgress || { completedNodeIds: [], completedCount: 0, passedGrades: [], lessonStars: {} };
    const lessonStars = { ...(currentProgress.lessonStars || {}) };
    const currentLessonStars = { ...(lessonStars[lessonId] || { level1: 0, level2: 0, level3: 0 }) };
    const previousStars = currentLessonStars[level] || 0;
    const firstCompletionForLevel = previousStars <= 0;

    currentLessonStars[level] = Math.max(previousStars, normalizedStars);
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
    }

    if (level === 'level3') {
      const unlockedLessons = Array.isArray(req.user.unlockedLessons) ? [...req.user.unlockedLessons] : [];
      if (!unlockedLessons.includes(lessonId)) {
        unlockedLessons.push(lessonId);
        updateFields.unlockedLessons = unlockedLessons;
      }
      applyLessonStreak(updateFields, req.user);
    }

    const updatedUser = await User.update(req.user.id, updateFields);
    res.json({ success: true, user: toProfileResponse(updatedUser) });
  } catch (err) {
    res.status(500).json({ message: 'Could not update lesson segment', error: err.message });
  }
});

router.post('/placement-pass', auth, async (req, res) => {
  try {
    const grade = String(req.body?.grade || '');
    if (!PLACEMENT_GRADES.has(grade)) {
      return res.status(400).json({ message: 'Invalid placement grade' });
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
    res.status(500).json({ message: 'Could not save placement result', error: err.message });
  }
});

// Update XP & Progress (legacy, shadowed by the deprecation handler above)
router.post('/link-account', auth, async (req, res) => {
  try {
    const { provider, accountId, providerEmail } = req.body;
    if (!provider || !accountId) {
      return res.status(400).json({ message: 'Thiếu thông tin liên kết' });
    }
    
    // Check if provider is supported
    if (provider !== 'google') {
      return res.status(400).json({ message: 'Nhà cung cấp không được hỗ trợ' });
    }

    // Verify email matches if the user registered with an email
    if (req.user.email && req.user.email !== providerEmail) {
      return res.status(400).json({ message: 'Email liên kết phải trùng khớp với email của tài khoản hiện tại' });
    }

    // Check if another user already linked this account
    const filter = { googleId: accountId };
    const existingUser = await User.findOne(filter);
    if (existingUser && existingUser.id !== req.user.id) {
      return res.status(400).json({ message: 'Tài khoản này đã được liên kết với một người dùng khác' });
    }

    const linkedAccounts = req.user.linkedAccounts || {};
    linkedAccounts[provider] = accountId;

    await User.update(req.user.id, { linkedAccounts });

    res.json({ message: `Đã liên kết tài khoản ${provider} thành công!`, linkedAccounts });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi liên kết tài khoản', error: err.message });
  }
});

// Update XP & Progress
router.post('/progress', auth, async (req, res) => {
  try {
    const { xpGain, unlockedLessonId, isLessonCompletion } = req.body;
    let { xp, level, unlockedLessons } = req.user;
    
    if (xpGain) {
      // Apply streak bonus if applicable
      const streakBonus = Math.floor((req.user.streakCount || 0) / 7) * 5; // e.g., +5 XP for every 7 days of streak
      xp += (xpGain + streakBonus);
      level = Math.floor(xp / 1000) + 1;
    }

    const updateFields = { xp, level };

    if (unlockedLessonId && !unlockedLessons.includes(unlockedLessonId)) {
      unlockedLessons.push(unlockedLessonId);
      updateFields.unlockedLessons = unlockedLessons;
    }

    if (isLessonCompletion) {
      updateFields.today_lesson_completed = true;
      
      // Update streak if not already updated today
      const today = new Date().toISOString().split('T')[0];
      const lastStreak = req.user.lastStreakAt ? new Date(req.user.lastStreakAt).toISOString().split('T')[0] : null;
      
      if (today !== lastStreak) {
        updateFields.streak_count = (req.user.streakCount || 0) + 1;
        updateFields.last_streak_at = new Date().toISOString();
      }
    }

    const updatedUser = await User.update(req.user.id, updateFields);
    
    res.json({
      xp: updatedUser.xp,
      level: updatedUser.level,
      unlockedLessons: updatedUser.unlockedLessons,
      streakCount: updatedUser.streakCount,
      todayLessonCompleted: updatedUser.todayLessonCompleted
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật tiến độ', error: err.message });
  }
});

// Heartbeat (Activity Tracking & Streak)
router.post('/heartbeat', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const lastActiveDate = req.user.lastActiveAt ? new Date(req.user.lastActiveAt).toISOString().split('T')[0] : null;
    
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
    }

    // Check for streak maintenance (10 minutes online)
    const lastStreakDate = req.user.lastStreakAt ? new Date(req.user.lastStreakAt).toISOString().split('T')[0] : null;
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

    if (process.env.NODE_ENV === 'production' && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ message: 'Khong co quyen truy cap endpoint nay.' });
    }

    console.log('[Cron Reminders] Starting reminder check...');

    const { data: students, error } = await supabase
      .from('users')
      .select('id, username, email, study_plan, today_lesson_completed, streak_count')
      .eq('role', 'student');

    if (error) {
      console.error('[Cron Reminders] Supabase fetch error:', error);
      return res.status(500).json({ message: 'Loi truy van co so du lieu', error: error.message });
    }

    const now = new Date();
    const todayKey = getVietnamDateKey(now);
    const currentMinute = getVietnamMinuteOfDay(now);
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
      const plan = normalizeStudyPlan(student.study_plan);
      let updatedPlan = { ...plan };
      let hasPlanUpdate = false;

      if (!plan.remindersEnabled || !plan.emailEnabled) {
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

      if (student.today_lesson_completed) {
        skipped.completed += 1;
        continue;
      }

      const scheduledMinute = parseStudyTimeMinutes(plan.studyTime);
      if (scheduledMinute === null) {
        skipped.invalidTime += 1;
        continue;
      }

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
          console.log(`[Cron Reminders] Sending study reminder to ${student.username} (late: ${lateMinutesAtSend}m, offset: ${hourOffset}h)`);
          const sendResult = await sendStudyPlanHourlyReminderEmail(student.email, student.username, plan, hourOffset, lateMinutesAtSend);

          results.push({
            username: student.username,
            email: student.email,
            type: 'study_reminder',
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

      const streakCount = student.streak_count || 0;
      if (currentMinute >= 21 * 60 && streakCount > 0 && updatedPlan.lastStreakReminderDate !== todayKey) {
        console.log(`[Cron Reminders] Sending streak reminder to ${student.username} (streak: ${streakCount})`);
        const sendResult = await sendStreakReminderEmail(student.email, student.username, streakCount);

        results.push({
          username: student.username,
          email: student.email,
          type: 'streak_reminder',
          success: sendResult.success,
          error: sendResult.error || null,
        });

        if (sendResult.success) {
          updatedPlan = {
            ...updatedPlan,
            lastStreakReminderDate: todayKey,
          };
          hasPlanUpdate = true;
        }
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

