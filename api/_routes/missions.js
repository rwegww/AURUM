import express from 'express';
import Mission from '../_models/Mission.js';
import User from '../_models/User.js';
import { auth } from '../_middleware/auth.js';
import { craftingTasks } from '../../src/data/craftingTasks.js';

const router = express.Router();

// GET /api/missions - Get all nhiem_vu with current progress
router.get('/', auth, async (req, res) => {
  try {
    const data = await Mission.getUserMissions(req.user.id);
    
    // Gộp các nhiệm vụ thu thập nguyên tố hàng ngày vào
    const userTasks = req.user.craftingTasks || { tasks: {} };
    const craftingTasksData = craftingTasks.map(task => {
      const uTask = userTasks.tasks[task.id] || { progress: 0, claimed: false, history: [], rewards: [] };
      const rewardsToDisplay = (uTask.rewards && uTask.rewards.length > 0) ? uTask.rewards : task.rewards;

      return {
        id: task.id,
        title: task.title,
        description: task.description,
        type: 'daily',
        action_type: task.actionType,
        target_count: task.target,
        xp_reward: task.difficulty === 'hard' ? 150 : task.difficulty === 'medium' ? 100 : 50,
        icon: task.difficulty === 'hard' ? '💎' : task.difficulty === 'medium' ? '⚡' : '⭐️',
        currentCount: uTask.progress,
        isCompleted: uTask.progress >= task.target,
        isClaimed: uTask.claimed,
        isCraftingTask: true,
        rewards: rewardsToDisplay
      };
    });

    res.status(200).json([...data, ...craftingTasksData]);
  } catch (error) {
    console.error('Lỗi tải nhiệm vụ:', error);
    res.status(500).json({ message: 'Không thể tải nhiệm vụ lúc này.', error: error.message });
  }
});

// POST /api/missions/claim - Claim a mission reward
router.post('/claim', auth, async (req, res) => {
  try {
    const { missionId } = req.body;
    if (!missionId) return res.status(400).json({ message: 'Thiếu nhiệm vụ cần nhận thưởng.' });

    if (missionId.startsWith('task_')) {
      const result = await User.claimCraftingTaskReward(req.user.id, missionId);
      return res.status(200).json({
        success: true,
        message: 'Đã nhận thưởng nhiệm vụ thu thập nguyên tố.',
        xpGained: result.xpGained,
        totalXP: result.totalXP,
        newLevel: result.newLevel,
        rewards: result.rewards,
        isCraftingTask: true
      });
    }

    const result = await Mission.claimReward(req.user.id, missionId);
    res.status(200).json({ 
      success: true, 
      message: 'Đã nhận thưởng nhiệm vụ.', 
      ...result 
    });
  } catch (error) {
    console.error('Lỗi nhận thưởng nhiệm vụ:', error);
    res.status(400).json({ message: error.message });
  }
});

export default router;
