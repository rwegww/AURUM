import { parseFormula } from '../utils/balancer.js';

export const ingredients = [
  { id: "ing_h", name: "Tinh chất Hydro", icon: "Droplet", formula: "H", requiredQuiz: "hoa8_kntt_bai1", gradeLevel: 8 },
  { id: "ing_o", name: "Tinh chất Oxy", icon: "Wind", formula: "O", requiredQuiz: "hoa8_kntt_bai2", gradeLevel: 8 },
  { id: "ing_fe", name: "Bột Sắt nguyên chất", icon: "Settings", formula: "Fe", requiredQuiz: "hoa8_kntt_bai3", gradeLevel: 8 },
  { id: "ing_na", name: "Tinh thể Natri", icon: "Diamond", formula: "Na", requiredQuiz: "hoa8_kntt_bai4", gradeLevel: 8 },
  { id: "ing_cl", name: "Khí Clo cô đặc", icon: "Hexagon", formula: "Cl", requiredQuiz: "hoa8_kntt_bai5", gradeLevel: 8 },
  { id: "ing_c", name: "Than Cacbon tinh khiết", icon: "Square", formula: "C", requiredQuiz: "hoa8_kntt_bai6", gradeLevel: 8 },
  // Nguyên liệu nâng cao (lớp 9-10)
  { id: "ing_s", name: "Bột Lưu huỳnh", icon: "Circle", formula: "S", requiredQuiz: "hoa9_kntt_bai1", gradeLevel: 9 },
  { id: "ing_n", name: "Khí Nitơ nguyên chất", icon: "Circle", formula: "N", requiredQuiz: "hoa10_kntt_bai1", gradeLevel: 10 },
  { id: "ing_ca", name: "Bột Canxi", icon: "Circle", formula: "Ca", requiredQuiz: "hoa9_kntt_bai2", gradeLevel: 9 },
  { id: "ing_ag", name: "Tinh chất Bạc", icon: "Circle", formula: "Ag", requiredQuiz: "hoa11_kntt_bai1", gradeLevel: 11 },
  { id: "ing_au", name: "Tinh chất Vàng", icon: "Circle", formula: "Au", requiredQuiz: "hoa12_kntt_bai1", gradeLevel: 12 },
  
  // Halogen & Khí hiếm (Lớp 10)
  { id: "ing_f", name: "Khí Flo", icon: "Circle", formula: "F", requiredQuiz: "hoa10_kntt_bai1", gradeLevel: 10 },
  { id: "ing_br", name: "Dung dịch Brom", icon: "Circle", formula: "Br", requiredQuiz: "hoa10_kntt_bai2", gradeLevel: 10 },
  { id: "ing_i", name: "Tinh thể Iốt", icon: "Circle", formula: "I", requiredQuiz: "hoa10_kntt_bai3", gradeLevel: 10 },
  { id: "ing_he", name: "Khí Heli", icon: "Wind", formula: "He", requiredQuiz: "hoa10_kntt_bai4", gradeLevel: 10 },
  { id: "ing_ne", name: "Khí Neon", icon: "Wind", formula: "Ne", requiredQuiz: "hoa10_kntt_bai5", gradeLevel: 10 },
  { id: "ing_ar", name: "Khí Argon", icon: "Shield", formula: "Ar", requiredQuiz: "hoa10_kntt_bai6", gradeLevel: 10 },
  
  // Á kim & Kim loại kiềm thổ (Lớp 11-12)
  { id: "ing_si", name: "Bột Silic", icon: "Circle", formula: "Si", requiredQuiz: "hoa11_kntt_bai2", gradeLevel: 11 },
  { id: "ing_be", name: "Bột Beri", icon: "Circle", formula: "Be", requiredQuiz: "hoa12_kntt_bai2", gradeLevel: 12 },
  { id: "ing_ba", name: "Bột Bari", icon: "Circle", formula: "Ba", requiredQuiz: "hoa12_kntt_bai3", gradeLevel: 12 },
];

export const craftableItems = [
  {
    id: "craft_h2o",
    name: "Nước tinh khiết",
    formula: "H₂O",
    icon: "Droplet",
    category: "Cơ bản",
    rarity: "common",
    description: "Chất lỏng thiết yếu cho sự sống. Chiếm 70% bề mặt Trái đất.",
    ingredients: ["ing_h", "ing_h", "ing_o"],
    xpReward: 50,
    unlockMessage: "Bạn đã chế tạo thành công phân tử nước — nền tảng của sự sống!",
  },
  {
    id: "craft_nacl",
    name: "Muối ăn",
    formula: "NaCl",
    icon: "FlaskConical",
    category: "Cơ bản",
    rarity: "common",
    description: "Gia vị quen thuộc trong mỗi bữa ăn. Liên kết ion kinh điển.",
    ingredients: ["ing_na", "ing_cl"],
    xpReward: 60,
    unlockMessage: "Muối ăn — sản phẩm của liên kết ion giữa Na⁺ và Cl⁻!",
  },
  {
    id: "craft_fe3o4",
    name: "Oxit sắt từ",
    formula: "Fe₃O₄",
    icon: "Magnet",
    category: "Trung bình",
    rarity: "uncommon",
    description: "Có từ tính, dùng làm nam châm và sơn chống gỉ.",
    ingredients: ["ing_fe", "ing_fe", "ing_fe", "ing_o", "ing_o"],
    xpReward: 100,
    unlockMessage: "Fe₃O₄ — oxit sắt có từ tính! Đây là phản ứng đốt cháy sắt trong oxy.",
  },
  {
    id: "craft_co2",
    name: "Khí Cacbonic",
    formula: "CO₂",
    icon: "Wind",
    category: "Cơ bản",
    rarity: "common",
    description: "Khí nhà kính. Có trong nước ngọt tạo bọt ga.",
    ingredients: ["ing_c", "ing_o", "ing_o"],
    xpReward: 50,
    unlockMessage: "CO₂ — khí mà bạn thở ra mỗi ngày! Cũng là thứ tạo bọt cho nước ngọt.",
  },
  {
    id: "craft_caco3",
    name: "Đá vôi",
    formula: "CaCO₃",
    icon: "Circle",
    category: "Trung bình",
    rarity: "uncommon",
    description: "Thành phần tạo nên núi đá vôi, vỏ sò, và san hô.",
    ingredients: ["ing_ca", "ing_c", "ing_o", "ing_o", "ing_o"],
    xpReward: 120,
    unlockMessage: "CaCO₃ — thành phần tạo nên những dãy núi đá vôi hùng vĩ!",
  },
  {
    id: "craft_nh3",
    name: "Amoniac",
    formula: "NH₃",
    icon: "Circle",
    category: "Nâng cao",
    rarity: "rare",
    description: "Nguyên liệu sản xuất phân bón. Mùi khai đặc trưng.",
    ingredients: ["ing_n", "ing_h", "ing_h", "ing_h"],
    xpReward: 150,
    unlockMessage: "NH₃ — muốn có cây xanh tốt tươi, phải có amoniac làm phân bón!",
  },
];

export const rarityConfig = {
  common: { label: "Phổ thông", color: "text-gray-600 bg-gray-100 border-gray-200" },
  uncommon: { label: "Đặc biệt", color: "text-blue-600 bg-blue-50 border-blue-200" },
  rare: { label: "Hiếm", color: "text-purple-600 bg-purple-50 border-purple-200" },
  legendary: { label: "Huyền thoại", color: "text-orange-600 bg-orange-50 border-orange-200" },
};

export const initialInventory = ingredients.map(ing => ({
  ...ing,
  amount: ing.gradeLevel === 8 ? 5 : 0 // Give some starting hoc_lieu for grade 8
}));

export const lessonIngredientRewardsByGrade = {
  8: ["ing_h", "ing_o", "ing_fe", "ing_na", "ing_cl", "ing_c"],
  9: ["ing_s", "ing_ca", "ing_fe", "ing_o", "ing_c", "ing_na"],
  10: ["ing_n", "ing_f", "ing_br", "ing_i", "ing_he", "ing_ne", "ing_ar"],
  11: ["ing_ag", "ing_si", "ing_c", "ing_n", "ing_o"],
  12: ["ing_au", "ing_be", "ing_ba", "ing_ca", "ing_cl"],
};

export const recipes = [
  { ingredients: ["ing_h", "ing_h", "ing_o"], productId: "craft_h2o", productName: "Nước (H₂O)" },
  { ingredients: ["ing_na", "ing_cl"], productId: "craft_nacl", productName: "Muối ăn (NaCl)" },
  { ingredients: ["ing_c", "ing_o", "ing_o"], productId: "craft_co2", productName: "Khí Cacbonic (CO₂)" },
  { ingredients: ["ing_fe", "ing_fe", "ing_fe", "ing_o", "ing_o", "ing_o", "ing_o"], productId: "craft_fe3o4", productName: "Oxit sắt từ (Fe₃O₄)" },
];

export const getLevelFromXP = (xp) => {
  if (xp < 100) return { level: 1, title: "Tập sự giả kim", nextLevelXP: 100 };
  if (xp < 300) return { level: 2, title: "Học đồ hóa học", nextLevelXP: 300 };
  if (xp < 600) return { level: 3, title: "Chuyên viên Lab", nextLevelXP: 600 };
  if (xp < 1000) return { level: 4, title: "Bậc thầy phân tử", nextLevelXP: 1000 };
  return { level: 5, title: "Giáo sư Hóa học", nextLevelXP: 2000 };
};

export const getIngredientAmountMap = (inventory) => {
  const normalized = normalizeInventory(inventory);
  return Object.fromEntries(normalized.ingredients.map((item) => [item.id, item.amount]));
};

export const getRecipeRequirementCounts = (item) => {
  const counts = {};
  (item?.ingredients || []).forEach((ingredientId) => {
    counts[ingredientId] = (counts[ingredientId] || 0) + 1;
  });
  return counts;
};

export const createInitialInventory = () => ({
  ingredients: initialInventory.map(({ id, amount }) => ({ id, amount })),
  craftedItems: [],
});

export const normalizeInventory = (inventory) => {
  const baseAmounts = Object.fromEntries(initialInventory.map((item) => [item.id, item.amount || 0]));
  const sourceIngredients = inventory?.ingredients;

  if (Array.isArray(sourceIngredients)) {
    sourceIngredients.forEach((item) => {
      if (typeof item === "string") {
        baseAmounts[item] = (baseAmounts[item] || 0) + 1;
      } else if (item?.id) {
        baseAmounts[item.id] = Math.max(0, Number.parseInt(item.amount ?? 0, 10) || 0);
      }
    });
  } else if (sourceIngredients && typeof sourceIngredients === "object") {
    Object.entries(sourceIngredients).forEach(([id, amount]) => {
      baseAmounts[id] = Math.max(0, Number.parseInt(amount, 10) || 0);
    });
  }

  const craftedItems = Array.isArray(inventory?.craftedItems)
    ? inventory.craftedItems.map((item) => (typeof item === "string" ? item : item?.id)).filter(Boolean)
    : [];

  return {
    ingredients: ingredients.map((ingredient) => ({
      ...ingredient,
      amount: baseAmounts[ingredient.id] || 0,
    })),
    craftedItems: Array.from(new Set(craftedItems)),
  };
};

export const canCraftItem = (item, inventory) => {
  const normalized = normalizeInventory(inventory);
  const amounts = getIngredientAmountMap(normalized);
  const requirements = getRecipeRequirementCounts(item);
  const missingIngredients = Object.entries(requirements)
    .filter(([ingredientId, amount]) => (amounts[ingredientId] || 0) < amount)
    .map(([ingredientId, amount]) => ({
      ingredientId,
      required: amount,
      available: amounts[ingredientId] || 0,
    }));

  return {
    canCraft: missingIngredients.length === 0 && !normalized.craftedItems.includes(item.id),
    alreadyCrafted: normalized.craftedItems.includes(item.id),
    missingIngredients,
  };
};

export const craftItemInInventory = (itemId, inventory, customCraftableItems = null) => {
  const pool = customCraftableItems || craftableItems;
  const item = pool.find((candidate) => candidate.id === itemId);
  if (!item) throw new Error("Không tìm thấy vật phẩm cần chế tạo.");

  const normalized = normalizeInventory(inventory);
  const status = canCraftItem(item, normalized);
  if (status.alreadyCrafted) throw new Error("Vật phẩm này đã được chế tạo.");
  if (!status.canCraft) throw new Error("Chưa đủ nguyên liệu kiến thức để chế tạo.");

  const amounts = getIngredientAmountMap(normalized);
  Object.entries(getRecipeRequirementCounts(item)).forEach(([ingredientId, amount]) => {
    amounts[ingredientId] = Math.max(0, (amounts[ingredientId] || 0) - amount);
  });

  return {
    inventory: normalizeInventory({
      ingredients: Object.entries(amounts).map(([id, amount]) => ({ id, amount })),
      craftedItems: [...normalized.craftedItems, item.id],
    }),
    item,
  };
};

export const getLessonIngredientRewards = ({ lesson = {}, lessonId, level = "level1", stars = 1 }) => {
  const grade = Number.parseInt(lesson.gradeLevelId ?? lesson.classId ?? lesson.khoi_id, 10);
  const rewardPool = lessonIngredientRewardsByGrade[grade] || lessonIngredientRewardsByGrade[8];
  const rawOrder = Number.parseInt(lesson.order ?? lesson.thu_tu ?? lessonId, 10);
  const orderIndex = Number.isFinite(rawOrder) ? Math.max(0, rawOrder - 1) : 0;
  const primaryIngredientId = rewardPool[orderIndex % rewardPool.length];
  const levelBaseAmount = level === "level3" ? 3 : level === "level2" ? 2 : 1;
  const starBonus = Math.max(0, Math.min(3, Number.parseInt(stars, 10) || 1) - 1);

  return [{
    ingredientId: primaryIngredientId,
    amount: levelBaseAmount + starBonus,
    source: `lesson:${lessonId}:${level}`,
  }];
};

export const grantIngredientsToInventory = (inventory, rewards = []) => {
  const normalized = normalizeInventory(inventory);
  const amounts = getIngredientAmountMap(normalized);

  rewards.forEach(({ ingredientId, amount }) => {
    if (!ingredientId) return;
    amounts[ingredientId] = (amounts[ingredientId] || 0) + Math.max(1, Number.parseInt(amount, 10) || 1);
  });

  return normalizeInventory({
    ingredients: Object.entries(amounts).map(([id, amount]) => ({ id, amount })),
    craftedItems: normalized.craftedItems,
  });
};

const ingredientMap = {
  'H': 'ing_h',
  'O': 'ing_o',
  'FE': 'ing_fe',
  'NA': 'ing_na',
  'CL': 'ing_cl',
  'C': 'ing_c',
  'S': 'ing_s',
  'N': 'ing_n',
  'CA': 'ing_ca',
  'AG': 'ing_ag',
  'AU': 'ing_au',
  'F': 'ing_f',
  'BR': 'ing_br',
  'I': 'ing_i',
  'HE': 'ing_he',
  'NE': 'ing_ne',
  'AR': 'ing_ar',
  'SI': 'ing_si',
  'BE': 'ing_be',
  'BA': 'ing_ba'
};

const getRarity = (ingredientCount) => {
  if (ingredientCount <= 2) return 'common';
  if (ingredientCount <= 4) return 'uncommon';
  if (ingredientCount <= 6) return 'rare';
  return 'legendary';
};

const toCompareKey = (formula) => {
  const subMap = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
  return String(formula || '').replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (match) => subMap[match] || match).replace(/[^A-Za-z0-9]/g, '').toUpperCase();
};

export const generateCraftableItems = (chemicalsList) => {
  const items = [];
  const generatedKeys = new Set();
  
  (chemicalsList || []).forEach(c => {
    if (c.la_chat_khoi_dau || c.is_starter || c.isStarter) return;
    
    try {
      const formula = c.cong_thuc || c.formula;
      if (!formula) return;
      
      const parsed = parseFormula(formula);
      const recipeIngredients = [];
      let canBuildRecipe = true;
      
      Object.entries(parsed).forEach(([element, count]) => {
        const ingId = ingredientMap[element.toUpperCase()];
        if (!ingId) {
          canBuildRecipe = false;
        } else {
          for (let i = 0; i < count; i++) {
            recipeIngredients.push(ingId);
          }
        }
      });
      
      if (!canBuildRecipe || recipeIngredients.length === 0) return;
      
      const compKey = toCompareKey(formula);
      if (generatedKeys.has(compKey)) return;
      generatedKeys.add(compKey);
      
      const rarity = getRarity(recipeIngredients.length);
      const xpReward = recipeIngredients.length * 30;
      const cleanFormulaId = compKey.toLowerCase();
      
      items.push({
        id: `craft_${cleanFormulaId}`,
        name: c.ten || c.name,
        formula: formula,
        icon: c.trang_thai_vat_chat === 'gas' ? 'Wind' : (c.trang_thai_vat_chat === 'liquid' ? 'Droplet' : 'FlaskConical'),
        category: c.danh_muc || 'Hợp chất',
        rarity: rarity,
        description: `Hợp chất hóa học cấu tạo từ các nguyên tố thành phần.`,
        ingredients: recipeIngredients,
        xpReward: xpReward,
        unlockMessage: `Bạn đã chế tạo thành công ${c.ten || c.name} (${formula})!`
      });
    } catch (e) {
      console.warn(`[Crafting] Could not generate recipe for formula: ${c.cong_thuc || c.formula}`, e.message);
    }
  });
  
  craftableItems.forEach(item => {
    const compKey = toCompareKey(item.formula);
    if (!generatedKeys.has(compKey)) {
      generatedKeys.add(compKey);
      items.push(item);
    }
  });

  return items;
};
