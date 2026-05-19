import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import { supabase } from '../lib/supabase.js';

const router = express.Router();

import { auth } from '../_middleware/auth.js';

// Get Online Count (Public)
router.get('/online-count', async (req, res) => {
  try {
    const activeCount = await User.countActiveStudents();
    // Fallback minimum to 1 if we are sure at least the current user is active (though this is public)
    res.json({ count: Math.max(1, activeCount) });
  } catch (err) {
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
    todayLessonCompleted: req.user.todayLessonCompleted || false
  });
});

// Update Profile
import { sendStudyPlanEmail } from '../lib/mailer.js';

router.patch('/profile', auth, async (req, res) => {
  try {
    const updatedUser = await User.update(req.user.id, req.body);
    
    // Send email notification if study plan was updated and email reminders are enabled
    if (req.body.studyPlan && req.body.studyPlan.emailEnabled) {
      sendStudyPlanEmail(req.user.email || updatedUser.email, req.user.username || updatedUser.username, req.body.studyPlan)
        .then(result => {
          if (result.previewUrl) {
            console.log(`[Email Reminder] Ethereal Preview URL: ${result.previewUrl}`);
          }
        })
        .catch(err => console.error('[Email Reminder] Failed to send email in background:', err));
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật thông tin', error: err.message });
  }
});

// Update XP & Progress
router.post('/progress', auth, async (req, res) => {
  try {
    const { xpGain, unlockedLessonId, isLessonCompletion } = req.body;
    let { xp, level, unlockedLessons, todayLessonCompleted } = req.user;
    
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
      return res.status(400).json({ message: `Bạn cần ${cost} XP để khôi phục chuỗi ${streakToRestore} ngày. Hiện tại bạn chỉ có ${currentXP} XP.` });
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

export default router;
