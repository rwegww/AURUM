import express from 'express';
import { supabase } from '../lib/supabase.js';
import User from '../models/User.js';
import Mission from '../models/Mission.js';

const router = express.Router();

import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    // If no token, treat as guest
    if (!token) {
      req.user = null;
      return next();
    }

    let userId;
    let user;

    // 1. Try to verify as Supabase token
    try {
      const { data, error: sbError } = await supabase.auth.getUser(token);
      if (data?.user && !sbError) {
        userId = data.user.id;
        user = await User.findById(userId);
      }
    } catch (sbErr) {
      // Fall through to JWT check
    }

    // 2. Fallback: Try to verify as custom JWT
    if (!user) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
        user = await User.findById(userId);
      } catch (jwtErr) {
        // Not a valid JWT either, just treat as guest or ignore
      }
    }

    req.user = user;
    next();
  } catch (e) {
    console.error('❌ Lab Auth Error:', e.message);
    next(); // Fallback to guest
  }
};

// GET /api/lab/chemicals - Get all chemicals
router.get('/chemicals', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lab_chemicals')
      .select('*')
      .order('formula', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error fetching chemicals:', error);
    res.status(500).json({ message: 'Error fetching chemicals', error: error.message });
  }
});

// GET /api/lab/reactions - Get all reactions
router.get('/reactions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('lab_reactions')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error fetching reactions:', error);
    res.status(500).json({ message: 'Error fetching reactions', error: error.message });
  }
});

// GET /api/lab/balancing/search - Search for balanced equations
router.get('/balancing/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json([]);

    // Simple search in equation_string
    const { data, error } = await supabase
      .from('balancing_questions')
      .select('reactants, products, answer, equation_string')
      .ilike('equation_string', `%${q}%`)
      .limit(10);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error searching balancing equations:', error);
    res.status(500).json({ message: 'Error searching equations' });
  }
});

// GET /api/lab/balancing/:nodeId - Get 6 questions for a specific balancing node
router.get('/balancing/:nodeId', async (req, res) => {
  try {
    const { nodeId } = req.params;
    const { data, error } = await supabase
      .from('balancing_questions')
      .select('*')
      .eq('node_id', nodeId);

    if (error) throw error;
    
    // If no data found for this specific nodeId, maybe it's out of range, 
    // but we return whatever we have.
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ Error fetching balancing questions:', error);
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
});

// GET /api/lab/balancing/progress - Get user's balancing progress
router.get('/balancing/progress', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({ completedNodeIds: [], completedCount: 0 });
    }
    res.status(200).json(req.user.balancingProgress);
  } catch (error) {
    console.error('❌ Error fetching balancing progress:', error);
    res.status(500).json({ message: 'Error fetching progress' });
  }
});

// POST /api/lab/balancing/progress - Update user's balancing progress
router.post('/balancing/progress', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({ message: 'Guest mode, progress not saved' });
    }

    const { balancingProgress } = req.body;
    if (!balancingProgress) {
      return res.status(400).json({ message: 'balancingProgress missing' });
    }

    const updatedUser = await User.update(req.user.id, { 
      balancingProgress 
    });

    res.status(200).json(updatedUser.balancingProgress);
  } catch (error) {
    console.error('❌ Error updating balancing progress:', error);
    res.status(500).json({ message: 'Error updating progress' });
  }
});

// POST /api/lab/unlock - Unlock a chemical for a user
router.post('/unlock', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({ message: 'Guest mode, progress not saved to DB' });
    }

    const { formula, formulas } = req.body;
    if (!formula && (!formulas || !Array.isArray(formulas))) {
      return res.status(400).json({ message: 'Formula(s) missing' });
    }

    const formulasToUnlock = formulas ? formulas : [formula];

    // Ensure it's treated as an array
    let unlockedChemicals = Array.isArray(req.user.unlockedChemicals) 
      ? [...req.user.unlockedChemicals] 
      : [];

    let changed = false;
    formulasToUnlock.forEach(f => {
      if (!unlockedChemicals.includes(f)) {
        unlockedChemicals.push(f);
        changed = true;
        console.log(`🔓 Unlocking ${f} for user ${req.user.id}`);
      }
    });

    if (changed) {
      await User.update(req.user.id, { 
        unlockedChemicals: unlockedChemicals 
      });
      // Track mission progress
      try {
        await Mission.updateProgress(req.user.id, 'reaction', 1);
      } catch (err) {
        console.warn('⚠️ Failed to update mission progress:', err.message);
      }
    }

    res.status(200).json({ unlockedChemicals });
  } catch (error) {
    console.error('❌ Error unlocking chemical:', error);
    res.status(500).json({ message: 'Error unlocking chemical', error: error.message });
  }
});

export default router;
