// Hệ thống Game hóa Phòng Lab
// Nguyên liệu = kiến thức từ bài học/quiz
// Vật phẩm = chất hóa học có thể "chế tạo"

export const ingredients = [
  // Nguyên liệu cơ bản (mở khóa từ quiz lớp 8)
  { id: "ing_h", name: "Tinh chất Hydro", icon: "💧", formula: "H", requiredQuiz: "hoa8_kntt_bai1", gradeLevel: 8 },
  { id: "ing_o", name: "Tinh chất Oxy", icon: "🌬️", formula: "O", requiredQuiz: "hoa8_kntt_bai2", gradeLevel: 8 },
  { id: "ing_fe", name: "Bột Sắt nguyên chất", icon: "⚙️", formula: "Fe", requiredQuiz: "hoa8_kntt_bai3", gradeLevel: 8 },
  { id: "ing_na", name: "Tinh thể Natri", icon: "🔶", formula: "Na", requiredQuiz: "hoa8_kntt_bai4", gradeLevel: 8 },
  { id: "ing_cl", name: "Khí Clo cô đặc", icon: "💚", formula: "Cl", requiredQuiz: "hoa8_kntt_bai5", gradeLevel: 8 },
  { id: "ing_c", name: "Than Cacbon tinh khiết", icon: "⬛", formula: "C", requiredQuiz: "hoa8_kntt_bai6", gradeLevel: 8 },
  // Nguyên liệu nâng cao (lớp 9-10)
  { id: "ing_s", name: "Bột Lưu huỳnh", icon: "🟡", formula: "S", requiredQuiz: "hoa9_kntt_bai1", gradeLevel: 9 },
  { id: "ing_n", name: "Khí Nitơ nguyên chất", icon: "🔵", formula: "N", requiredQuiz: "hoa10_kntt_bai1", gradeLevel: 10 },
  { id: "ing_ca", name: "Bột Canxi", icon: "🤍", formula: "Ca", requiredQuiz: "hoa9_kntt_bai2", gradeLevel: 9 },
];

export const craftableItems = [
  {
    id: "craft_h2o",
    name: "Nước tinh khiết",
    formula: "H₂O",
    icon: "💧",
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
    icon: "🧂",
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
    icon: "🧲",
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
    icon: "💨",
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
    icon: "🪨",
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
    icon: "🌿",
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
  amount: ing.gradeLevel === 8 ? 5 : 0 // Give some starting materials for grade 8
}));

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

