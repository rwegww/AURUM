import express from 'express';
import { supabase } from '../lib/supabase.js';
import User from '../models/User.js';
import Mission from '../models/Mission.js';
import { auth } from '../_middleware/auth.js';
import { balanceEquation, balanceEquationText, parseSpeciesList } from '../../src/utils/balancer.js';
import {
  formatStructuredEquation,
  isStructurallyBalancedReaction,
  normalizeLabFormula,
} from '../../src/utils/labChemistry.js';
import { getRecipeRequirementCounts, normalizeInventory, generateCraftableItems } from '../../src/data/labInventory.js';
import { craftingTasks } from '../../src/data/craftingTasks.js';
import { chemicals as staticLabChemicals, reactions as staticLabReactions } from '../../src/data/reactions/index.js';
import { enrichReaction } from '../../src/data/reactions/enrichment.js';

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
    grade_level_id: record.khoi_id ?? record.grade_level_id ?? record.gradeLevel ?? null,
    gradeLevel: record.khoi_id ?? record.gradeLevel ?? record.grade_level_id ?? null,
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

const mergeLabChemicals = (databaseChemicals = []) => {
  const merged = new Map(staticLabChemicals.map(chemical => [
    normalizeLabFormula(chemical.formula),
    { ...chemical },
  ]));

  databaseChemicals.map(normalizeChemical).forEach((chemical) => {
    const key = normalizeLabFormula(chemical.formula);
    if (!key) return;
    const populatedFields = Object.fromEntries(
      Object.entries(chemical).filter(([, value]) => value !== undefined && value !== null),
    );
    merged.set(key, { ...(merged.get(key) || {}), ...populatedFields });
  });

  return Array.from(merged.values());
};

const mergeLabReactions = (databaseReactions = []) => {
  const merged = new Map(staticLabReactions.map(reaction => [reaction.id, reaction]));

  databaseReactions.map(normalizeLabRecord).forEach((reaction) => {
    const baseline = merged.get(reaction.id) || {};
    const populatedFields = Object.fromEntries(
      Object.entries(reaction).filter(([, value]) => value !== undefined && value !== null),
    );
    merged.set(reaction.id, enrichReaction({
      ...baseline,
      ...populatedFields,
      reactants: reaction.reactants?.length ? reaction.reactants : baseline.reactants,
      products: reaction.products?.length ? reaction.products : baseline.products,
    }));
  });

  return Array.from(merged.values());
};

const isUsableLabReaction = (reaction, knownFormulas) => {
  const species = [...(reaction.reactants || []), ...(reaction.products || [])];
  return species.length > 0
    && species.every(item => knownFormulas.has(normalizeLabFormula(item.formula)))
    && (reaction.isQualitative || isStructurallyBalancedReaction(reaction));
};

// GET /api/lab/chemicals - Get all chemicals
router.get('/chemicals', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('hoa_chat')
      .select('*')
      .order('cong_thuc', { ascending: true });

    if (error) throw error;
    const chemicals = mergeLabChemicals(data || [])
      .sort((a, b) => String(a.formula).localeCompare(String(b.formula), 'vi'));
    res.set('Cache-Control', 'private, max-age=300');
    res.status(200).json(chemicals);
  } catch (error) {
    console.error('Lỗi tải danh sách hóa chất:', error);
    res.set('Cache-Control', 'private, max-age=60');
    res.set('X-Lab-Data-Source', 'static-fallback');
    res.status(200).json(mergeLabChemicals([]));
  }
});

// GET /api/lab/reactions - Get all reactions
router.get('/reactions', async (req, res) => {
  try {
    const [reactionResult, chemicalResult] = await Promise.all([
      supabase.from('phan_ung').select('*').order('id', { ascending: true }),
      supabase.from('hoa_chat').select('cong_thuc'),
    ]);

    if (reactionResult.error) throw reactionResult.error;
    if (chemicalResult.error) throw chemicalResult.error;

    const allChemicals = mergeLabChemicals(chemicalResult.data || []);
    const knownFormulas = new Set(allChemicals.map(item => normalizeLabFormula(item.formula)));
    const normalizedReactions = mergeLabReactions(reactionResult.data || []);
    const usableReactions = normalizedReactions.filter(reaction => isUsableLabReaction(reaction, knownFormulas));

    if (usableReactions.length !== normalizedReactions.length) {
      console.warn(`[Lab] Đã loại ${normalizedReactions.length - usableReactions.length} phản ứng không cân bằng hoặc tham chiếu hóa chất không tồn tại.`);
    }
    res.set('Cache-Control', 'private, max-age=300');
    res.status(200).json(usableReactions);
  } catch (error) {
    console.error('Lỗi tải danh sách phản ứng:', error);
    const knownFormulas = new Set(staticLabChemicals.map(item => normalizeLabFormula(item.formula)));
    res.set('Cache-Control', 'private, max-age=60');
    res.set('X-Lab-Data-Source', 'static-fallback');
    res.status(200).json(staticLabReactions.filter(reaction => isUsableLabReaction(reaction, knownFormulas)));
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
      const structuredReaction = { reactants: reactantsList, products: productsList };
      if (!isStructurallyBalancedReaction(structuredReaction)) return null;
      return {
        reactants: reactantsList.map(r => r.formula),
        products: productsList.map(p => p.formula),
        answer: [...reactantsList.map(r => Number(r.coeff) || 1), ...productsList.map(p => Number(p.coeff) || 1)],
        equation_string: formatStructuredEquation(structuredReaction),
      };
    }).filter(Boolean);

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

    const requestedFormulas = formulas ? formulas : [formula];
    const normalizedRequested = Array.from(new Set(requestedFormulas.map(normalizeLabFormula).filter(Boolean)));
    if (normalizedRequested.length === 0 || normalizedRequested.length > 20) {
      return res.status(400).json({ message: 'Danh sách hóa chất cần mở khóa không hợp lệ.' });
    }
    const { data: existingChemicals, error: chemicalError } = await supabase
      .from('hoa_chat')
      .select('cong_thuc, la_chat_khoi_dau');
    if (chemicalError) throw chemicalError;
    const completeChemicals = mergeLabChemicals(existingChemicals || []);
    const canonicalByNormalized = new Map(completeChemicals.map(item => [normalizeLabFormula(item.formula), item.formula]));
    const formulasToUnlock = normalizedRequested.map(item => canonicalByNormalized.get(item)).filter(Boolean);

    if (formulasToUnlock.length !== normalizedRequested.length) {
      return res.status(400).json({ message: 'Có hóa chất không tồn tại trong thư viện.' });
    }

    const unlockedByNormalized = new Map((req.user.unlockedChemicals || []).map(item => [normalizeLabFormula(item), item]));
    const newFormulas = formulasToUnlock.filter(item => !unlockedByNormalized.has(normalizeLabFormula(item)));
    newFormulas.forEach(item => unlockedByNormalized.set(normalizeLabFormula(item), item));
    const unlockedChemicals = Array.from(unlockedByNormalized.values());

    if (newFormulas.length > 0) {
      const { data: reactionRows, error: reactionError } = await supabase
        .from('phan_ung')
        .select('id, chat_tham_gia, san_pham');
      if (reactionError) throw reactionError;

      const availableReactants = new Set([
        ...(req.user.unlockedChemicals || []).map(normalizeLabFormula),
        ...completeChemicals
          .filter(item => item.isStarter || item.is_starter)
          .map(item => normalizeLabFormula(item.formula)),
      ]);
      const knownFormulas = new Set(completeChemicals.map(item => normalizeLabFormula(item.formula)));
      const authoredReactions = mergeLabReactions(reactionRows || [])
        .filter(reaction => isUsableLabReaction(reaction, knownFormulas));
      const invalidUnlock = newFormulas.find(targetFormula => !authoredReactions.some(reaction => (
        (reaction.products || []).some(product => normalizeLabFormula(product.formula) === normalizeLabFormula(targetFormula))
        && (reaction.reactants || []).every(reactant => availableReactants.has(normalizeLabFormula(reactant.formula)))
      )));

      if (invalidUnlock) {
        return res.status(409).json({
          message: `Chưa thể mở khóa ${invalidUnlock}: hãy thực hiện một phản ứng hợp lệ từ các chất đã khám phá.`,
        });
      }

      const { error: unlockError } = await supabase
        .from('tien_do_nguoi_dung')
        .upsert(newFormulas.map(item => ({
          nguoi_dung_id: req.user.id,
          loai_tien_do: 'chemical',
          doi_tuong_id: item,
          noi_dung_tien_do: {},
          updated_at: new Date().toISOString(),
        })), { onConflict: 'nguoi_dung_id,loai_tien_do,doi_tuong_id' });
      if (unlockError) throw unlockError;

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

    const dynamicCraftableItems = generateCraftableItems(mergeLabChemicals(chemicals));

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
    const dynamicCraftableItems = generateCraftableItems(mergeLabChemicals(chemicals));

    const item = dynamicCraftableItems.find(candidate => candidate.id === itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Không tìm thấy vật phẩm cần chế tạo.' });

    const { data: craftResult, error: craftError } = await supabase.rpc('craft_lab_item', {
      p_user_id: req.user.id,
      p_item_id: item.id,
      p_formula: item.formula,
      p_requirements: getRecipeRequirementCounts(item),
      p_xp_reward: item.xpReward || 0,
    });
    if (craftError) throw craftError;

    const unlockedByFormula = new Map(
      [...(req.user.unlockedChemicals || []), item.formula]
        .map(formula => [normalizeLabFormula(formula), formula]),
    );
    const unlockedChemicals = Array.from(unlockedByFormula.values());

    try {
      await Mission.updateProgress(req.user.id, 'reaction', 1);
    } catch (err) {
      console.warn('⚠️ Failed to update craft mission progress:', err.message);
    }

    res.status(200).json({
      success: true,
      item,
      inventory: normalizeInventory(craftResult.inventory),
      unlockedChemicals,
      xp: craftResult.totalXP,
      level: craftResult.newLevel,
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
