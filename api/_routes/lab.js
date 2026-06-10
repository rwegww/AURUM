import express from 'express';
import { supabase } from '../lib/supabase.js';
import User from '../models/User.js';
import Mission from '../models/Mission.js';
import { auth } from '../_middleware/auth.js';

const router = express.Router();

const normalizeChemical = (chemical) => {
  if (!chemical) return chemical;
  return {
    ...chemical,
    formula: chemical.cong_thuc ?? chemical.formula,
    name: chemical.ten ?? chemical.name,
    state: chemical.trang_thai_vat_chat ?? chemical.state,
    color: chemical.mau_sac ?? chemical.color,
    category: chemical.danh_muc ?? chemical.category ?? null,
    is_starter: chemical.la_chat_khoi_dau ?? chemical.is_starter,
    cong_thuc: undefined,
    ten: undefined,
    trang_thai_vat_chat: undefined,
    mau_sac: undefined,
    danh_muc: undefined,
    la_chat_khoi_dau: undefined,
  };
};

const normalizeLabRecord = (record) => {
  if (!record) return record;
  return {
    ...record,
    name: record.ten ?? record.name,
    equation: record.phuong_trinh ?? record.equation,
    reactants: record.chat_tham_gia ?? record.reactants,
    products: record.san_pham ?? record.products,
    answer: record.dap_an ?? record.answer,
    difficulty: record.do_kho ?? record.difficulty,
    category: record.danh_muc ?? record.category,
    grade_level_id: record.khoi_id ?? record.grade_level_id ?? null,
    equation_string: record.chuoi_phuong_trinh ?? record.equation_string,
    node_id: record.nut_id ?? record.node_id,
    lesson_id: record.bai_hoc_id ?? record.lesson_id,
    conditions: record.dieu_kien ?? record.conditions,
    observation: record.hien_tuong ?? record.observation,
    energy: record.nang_luong ?? record.energy,
    animation: record.hieu_ung ?? record.animation,
    requires_heat: record.can_nhiet ?? record.requires_heat,
    danger_level: record.muc_do_nguy_hiem ?? record.danger_level,
    safety_warning: record.canh_bao_an_toan ?? record.safety_warning,
    ten: undefined,
    phuong_trinh: undefined,
    chat_tham_gia: undefined,
    san_pham: undefined,
    dap_an: undefined,
    do_kho: undefined,
    danh_muc: undefined,
    khoi_id: undefined,
    chuoi_phuong_trinh: undefined,
    nut_id: undefined,
    bai_hoc_id: undefined,
    dieu_kien: undefined,
    hien_tuong: undefined,
    nang_luong: undefined,
    hieu_ung: undefined,
    can_nhiet: undefined,
    muc_do_nguy_hiem: undefined,
    canh_bao_an_toan: undefined,
  };
};

// GET /api/lab/chemicals - Get all chemicals
router.get('/chemicals', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hoa_chat')
      .select('*')
      .order('cong_thuc', { ascending: true });

    if (error) throw error;
    res.status(200).json((data || []).map(normalizeChemical));
  } catch (error) {
    console.error('Lỗi tải danh sách hóa chất:', error);
    res.status(500).json({ message: 'Không thể tải danh sách hóa chất.', error: error.message });
  }
});

// GET /api/lab/reactions - Get all reactions
router.get('/reactions', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('phan_ung')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.status(200).json((data || []).map(normalizeLabRecord));
  } catch (error) {
    console.error('Lỗi tải danh sách phản ứng:', error);
    res.status(500).json({ message: 'Không thể tải danh sách phản ứng.', error: error.message });
  }
});

// GET /api/lab/balancing/search - Search for balanced equations
router.get('/balancing/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json([]);

    // Simple search in equation_string
    const { data, error } = await supabase
      .from('cau_hoi_can')
      .select('chat_tham_gia, san_pham, dap_an, chuoi_phuong_trinh')
      .ilike('chuoi_phuong_trinh', `%${q}%`)
      .limit(10);

    if (error) throw error;
    res.status(200).json((data || []).map(normalizeLabRecord));
  } catch (error) {
    console.error('Lỗi tìm phương trình cân bằng:', error);
    res.status(500).json({ message: 'Không thể tìm phương trình lúc này.' });
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
    console.error('Lỗi tải tiến độ cân bằng phương trình:', error);
    res.status(500).json({ message: 'Không thể tải tiến độ cân bằng phương trình.' });
  }
});

// POST /api/lab/balancing/progress - Update user's balancing progress
router.post('/balancing/progress', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({ message: 'Bạn đang học ở chế độ khách nên tiến độ chưa được lưu.' });
    }

    const { balancingProgress } = req.body;
    if (!balancingProgress) {
      return res.status(400).json({ message: 'Thiếu tiến độ cần lưu.' });
    }

    const updatedUser = await User.update(req.user.id, { 
      balancingProgress 
    });

    res.status(200).json(updatedUser.balancingProgress);
  } catch (error) {
    console.error('Lỗi cập nhật tiến độ cân bằng phương trình:', error);
    res.status(500).json({ message: 'Không thể lưu tiến độ cân bằng phương trình.' });
  }
});

// GET /api/lab/balancing/:nodeId - Get 6 questions for a specific balancing node
router.get('/balancing/:nodeId', async (req, res) => {
  try {
    const { nodeId } = req.params;
    const { data, error } = await supabase
      .from('cau_hoi_can')
      .select('*')
      .eq('nut_id', nodeId);

    if (error) throw error;
    
    // If no data found for this specific nodeId, maybe it's out of range, 
    // but we return whatever we have.
    res.status(200).json((data || []).map(normalizeLabRecord));
  } catch (error) {
    console.error('Lỗi tải câu hỏi cân bằng phương trình:', error);
    res.status(500).json({ message: 'Không thể tải câu hỏi cân bằng phương trình.', error: error.message });
  }
});

// POST /api/lab/unlock - Unlock a chemical for a user
router.post('/unlock', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json({ message: 'Bạn đang học ở chế độ khách nên tiến độ chưa được lưu.' });
    }

    const { formula, formulas } = req.body;
    if (!formula && (!formulas || !Array.isArray(formulas))) {
      return res.status(400).json({ message: 'Thiếu công thức cần mở khóa.' });
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
    console.error('Lỗi mở khóa hóa chất:', error);
    res.status(500).json({ message: 'Không thể mở khóa hóa chất lúc này.', error: error.message });
  }
});

export default router;

