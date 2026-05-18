import express from 'express';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';

const router = express.Router();

import { auth } from '../_middleware/auth.js';

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

  res.json({
    id: req.user.id,
    username: req.user.username,
    role: req.user.role,
    xp: req.user.xp,
    level: req.user.level,
    inventory: req.user.inventory || { ingredients: [], craftedItems: [] },
    unlockedLessons: req.user.unlockedLessons,
    unlockedChemicals: req.user.unlockedChemicals || [],
    avatarSeed: req.user.avatarSeed,
    createdAt: req.user.createdAt,
    arenaStats: req.user.arenaStats || { total: 0, wins: 0, losses: 0, points: 0 },
    arenaAvatar: req.user.arenaAvatar || { seed: 'Chem Master', aura: '#a855f7' },
    balancingProgress: req.user.balancingProgress || { completedNodeIds: [], completedCount: 0, passedGrades: [], lessonStars: {} },
    studyPlan: req.user.studyPlan,
    streakCount: req.user.streakCount || 0,
    lastStreakAt: req.user.lastStreakAt,
    todayOnlineMinutes: req.user.todayOnlineMinutes || 0,
    todayLessonCompleted: req.user.todayLessonCompleted || false,
    linkedAccounts: req.user.linkedAccounts || {}
  });
});

// Update Profile
import { sendStudyPlanHourlyReminderEmail, sendStreakReminderEmail } from '../lib/mailer.js';

router.patch('/profile', auth, async (req, res) => {
  try {
    const updatedUser = await User.update(req.user.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật thông tin', error: err.message });
  }
});

// Update XP & Progress
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

import { supabase } from '../lib/supabase.js';

// Cron Job: Send Study Plan Reminders & Streak Reminders
router.get('/cron-send-reminders', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const cronSecret = process.env.CRON_SECRET;
    
    // Secure the cron endpoint in production environment
    if (process.env.NODE_ENV === 'production' && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ message: 'Không có quyền truy cập endpoint này.' });
    }

    console.log('[Cron Reminders] Starting reminder check...');

    // Fetch all students (students have roles, emails, study plans, streak counts)
    const { data: students, error } = await supabase
      .from('users')
      .select('id, username, email, study_plan, today_lesson_completed, streak_count')
      .eq('role', 'student');

    if (error) {
      console.error('[Cron Reminders] Supabase fetch error:', error);
      return res.status(500).json({ message: 'Lỗi truy vấn cơ sở dữ liệu', error: error.message });
    }

    // Get current Vietnam Time (GMT+7) in HH:MM format
    const nowVN = new Date();
    const currentHHMM = nowVN.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });

    console.log(`[Cron Reminders] Current Vietnam Time: ${currentHHMM}`);

    const getMinutesSinceMidnight = (timeStr) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };
    const currentMinutes = getMinutesSinceMidnight(currentHHMM);

    // 1. Filter students for hourly study reminders:
    // Must have study plan, emailEnabled === true, today_lesson_completed === false,
    // and current time must be exactly at/after scheduled time and matching integer hour.
    const matchingStudyReminders = [];

    (students || []).forEach(student => {
      const plan = student.study_plan;
      if (!plan || !plan.emailEnabled) return;
      if (student.today_lesson_completed) return;

      const studyTime = plan.studyTime ? plan.studyTime.trim() : null;
      if (!studyTime) return;

      const scheduledMinutes = getMinutesSinceMidnight(studyTime);
      const diff = currentMinutes - scheduledMinutes;

      if (diff >= 0 && diff % 60 === 0) {
        const hourOffset = diff / 60;
        matchingStudyReminders.push({
          student,
          hourOffset
        });
      }
    });

    // 2. Filter students for daily streak reminders at 21:00 (9 PM):
    // Must have streak_count > 0, emailEnabled === true, and today_lesson_completed === false.
    const matchingStreakReminders = [];
    if (currentHHMM === '21:00') {
      (students || []).forEach(student => {
        const plan = student.study_plan;
        const hasActiveEmail = plan ? plan.emailEnabled : false;
        const streakCount = student.streak_count || 0;

        if (hasActiveEmail && !student.today_lesson_completed && streakCount > 0) {
          matchingStreakReminders.push(student);
        }
      });
    }

    console.log(`[Cron Reminders] Found ${matchingStudyReminders.length} matching study reminders and ${matchingStreakReminders.length} streak reminders.`);

    if (matchingStudyReminders.length === 0 && matchingStreakReminders.length === 0) {
      return res.json({ message: 'Không có học sinh nào cần gửi nhắc nhở tại thời điểm này.', sentCount: 0 });
    }

    // Send Hourly Study Plan Reminders
    const studyPromises = matchingStudyReminders.map(({ student, hourOffset }) => {
      console.log(`[Cron Reminders] Sending hourly reminder to ${student.username} (offset: ${hourOffset}h)`);
      return sendStudyPlanHourlyReminderEmail(student.email, student.username, student.study_plan, hourOffset)
        .then(result => ({
          username: student.username,
          email: student.email,
          type: 'study_reminder',
          hourOffset,
          success: result.success,
          error: result.error || null
        }))
        .catch(err => ({
          username: student.username,
          email: student.email,
          type: 'study_reminder',
          hourOffset,
          success: false,
          error: err.message
        }));
    });

    // Send Streak reminders
    const streakPromises = matchingStreakReminders.map(student => {
      console.log(`[Cron Reminders] Sending streak reminder to ${student.username} (streak: ${student.streak_count})`);
      return sendStreakReminderEmail(student.email, student.username, student.streak_count)
        .then(result => ({
          username: student.username,
          email: student.email,
          type: 'streak_reminder',
          success: result.success,
          error: result.error || null
        }))
        .catch(err => ({
          username: student.username,
          email: student.email,
          type: 'streak_reminder',
          success: false,
          error: err.message
        }));
    });

    const allResults = await Promise.all([...studyPromises, ...streakPromises]);
    const successfulCount = allResults.filter(r => r.success).length;

    console.log(`[Cron Reminders] Completed. Successfully sent ${successfulCount}/${allResults.length} emails.`);

    res.json({
      message: `Đã hoàn thành gửi nhắc nhở: ${successfulCount}/${allResults.length} thành công.`,
      details: allResults
    });
  } catch (err) {
    console.error('[Cron Reminders] Unexpected error:', err);
    res.status(500).json({ message: 'Lỗi hệ thống bất ngờ', error: err.message });
  }
});

export default router;
