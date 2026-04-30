import express from 'express';
import { supabase } from '../lib/supabase.js';
import Mission from '../models/Mission.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { auth } from '../_middleware/auth.js';

const router = express.Router();

// Auth Middleware (Simplified from lab.js)

// GET /api/missions - Get all missions with current progress
router.get('/', auth, async (req, res) => {
  try {
    const data = await Mission.getUserMissions(req.user.id);
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error fetching missions:', error);
    res.status(500).json({ message: 'Error fetching missions', error: error.message });
  }
});

// POST /api/missions/claim - Claim a mission reward
router.post('/claim', auth, async (req, res) => {
  try {
    const { missionId } = req.body;
    if (!missionId) return res.status(400).json({ message: 'Mission ID required' });

    const result = await Mission.claimReward(req.user.id, missionId);
    res.status(200).json({ 
      success: true, 
      message: 'Reward claimed!', 
      ...result 
    });
  } catch (error) {
    console.error('❌ Error claiming mission:', error);
    res.status(400).json({ message: error.message });
  }
});

export default router;
