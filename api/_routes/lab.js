import express from 'express';
import { supabase } from '../lib/supabase.js';
import User from '../models/User.js';
import Mission from '../models/Mission.js';
import { auth } from '../_middleware/auth.js';
import { balanceEquation, balanceEquationText, normalizeFormula, parseSpeciesList } from '../../src/utils/balancer.js';
import { craftableItems, craftItemInInventory, normalizeInventory, generateCraftableItems } from '../../src/data/labInventory.js';
import { craftingTasks } from '../../src/data/craftingTasks.js';

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

// GET /api/lab/balancing/search - Search for balanced equations (searches phan_ung table as cau_hoi_can is removed)
router.get('/balancing/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(200).json([]);

    // Simple search in phuong_trinh of phan_ung
    const { data, error } = await supabase
      .from('phan_ung')
      .select('chat_tham_gia, san_pham, phuong_trinh')
      .ilike('phuong_trinh', `%${q}%`)
      .limit(10);

    if (error) throw error;
    
    // Map database model to expected format of the solver search page:
    // reactants: array of formula strings, products: array of formula strings, answer: flat array of coefficients
    const mapped = (data || []).map(item => {
      const reactantsList = Array.isArray(item.chat_tham_gia) ? item.chat_tham_gia : [];
      const productsList = Array.isArray(item.san_pham) ? item.san_pham : [];
      return {
        reactants: reactantsList.map(r => r.formula),
        products: productsList.map(p => p.formula),
        answer: [...reactantsList.map(r => r.coeff), ...productsList.map(p => p.coeff)],
        equation_string: item.phuong_trinh
      };
    });

    res.status(200).json(mapped);
  } catch (error) {
    console.error('Lỗi tìm phương trình cân bằng:', error);
    res.status(500).json({ message: 'Không thể tìm phương trình lúc này.' });
  }
});

// POST /api/lab/balancing/solve - Balance a free-form equation
router.post('/balancing/solve', async (req, res) => {
  try {
    const { equation, reactants, products } = req.body || {};
    const result = equation
      ? balanceEquationText(equation)
      : balanceEquation(parseSpeciesList(reactants), parseSpeciesList(products));

    if (!result.balanced) {
      return res.status(422).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Lỗi cân bằng phương trình nhập tự do:', error);
    res.status(500).json({
      balanced: false,
      coefficients: [],
      equation: '',
      message: 'Không thể cân bằng phương trình lúc này.',
      error: error.message,
    });
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

// GET /api/lab/inventory - Get the knowledge ingredient inventory
router.get('/inventory', auth, async (req, res) => {
  try {
    const { data: chemicals, error: chemError } = await supabase
      .from('hoa_chat')
      .select('*')
      .order('cong_thuc', { ascending: true });

    if (chemError) throw chemError;

    const dynamicCraftableItems = generateCraftableItems(chemicals);

    res.status(200).json({
      inventory: normalizeInventory(req.user.inventory),
      craftableItems: dynamicCraftableItems,
      unlockedChemicals: req.user.unlockedChemicals || [],
    });
  } catch (error) {
    console.error('Lỗi tải kho nguyên liệu:', error);
    res.status(500).json({ message: 'Không thể tải kho nguyên liệu.', error: error.message });
  }
});

// POST /api/lab/craft - Turn knowledge ingredients into a crafted chemical
router.post('/craft', auth, async (req, res) => {
  try {
    const { itemId } = req.body || {};
    if (!itemId) {
      return res.status(400).json({ message: 'Thiếu vật phẩm cần chế tạo.' });
    }

    const { data: chemicals, error: chemError } = await supabase
      .from('hoa_chat')
      .select('*');

    if (chemError) throw chemError;
    const dynamicCraftableItems = generateCraftableItems(chemicals);

    const { inventory, item } = craftItemInInventory(itemId, req.user.inventory, dynamicCraftableItems);
    const unlockedChemicals = Array.isArray(req.user.unlockedChemicals)
      ? [...req.user.unlockedChemicals]
      : [];
    const formulaToUnlock = item.formula;

    if (formulaToUnlock && !unlockedChemicals.includes(formulaToUnlock)) {
      unlockedChemicals.push(formulaToUnlock);
    }

    const nextXp = (req.user.xp || 0) + (item.xpReward || 0);
    const updatedUser = await User.update(req.user.id, {
      inventory,
      unlockedChemicals,
      xp: nextXp,
      level: Math.floor(nextXp / 1000) + 1,
    });

    try {
      await Mission.updateProgress(req.user.id, 'reaction', 1);
    } catch (err) {
      console.warn('⚠️ Failed to update craft mission progress:', err.message);
    }

    res.status(200).json({
      success: true,
      item,
      inventory: updatedUser.inventory,
      unlockedChemicals: updatedUser.unlockedChemicals || unlockedChemicals,
      xp: updatedUser.xp,
      level: updatedUser.level,
      message: item.unlockMessage,
    });
  } catch (error) {
    const status = error.message?.includes('đã được chế tạo') || error.message?.includes('Chưa đủ') ? 409 : 500;
    console.error('Lỗi chế tạo vật phẩm:', error);
    res.status(status).json({ success: false, message: error.message || 'Không thể chế tạo vật phẩm lúc này.' });
  }
});

// GET /api/lab/crafting/tasks - Get crafting task progress for the current user
router.get('/crafting/tasks', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Bạn chưa đăng nhập.' });
    }
    
    const userTasks = req.user.craftingTasks || { tasks: {} };
    
    const tasksWithProgress = craftingTasks.map(task => {
      const uTask = userTasks.tasks[task.id] || { progress: 0, claimed: false, history: [], rewards: [] };
      return {
        ...task,
        progress: uTask.progress,
        claimed: uTask.claimed,
        history: uTask.history,
        rewards: (uTask.rewards && uTask.rewards.length > 0) ? uTask.rewards : task.rewards
      };
    });

    res.status(200).json(tasksWithProgress);
  } catch (error) {
    console.error('Lỗi lấy tiến độ nhiệm vụ chế tạo:', error);
    res.status(500).json({ message: 'Không thể tải tiến độ nhiệm vụ chế tạo.', error: error.message });
  }
});

// POST /api/lab/crafting/tasks/claim - Claim rewards for a completed task
router.post('/crafting/tasks/claim', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Bạn chưa đăng nhập.' });
    }

    const { taskId } = req.body || {};
    if (!taskId) {
      return res.status(400).json({ message: 'Thiếu ID nhiệm vụ.' });
    }

    const result = await User.claimCraftingTaskReward(req.user.id, taskId);
    
    res.status(200).json({
      success: true,
      message: 'Nhận phần thưởng thành công!',
      tasks: result.tasks.tasks, // send only tasks structure
      inventory: result.inventory,
      rewards: result.rewards
    });
  } catch (error) {
    console.error('Lỗi nhận thưởng nhiệm vụ chế tạo:', error);
    res.status(400).json({ message: error.message || 'Không thể nhận phần thưởng lúc này.' });
  }
});

export default router;

