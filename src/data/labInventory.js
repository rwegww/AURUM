// Há»‡ thá»‘ng Game hÃ³a PhÃ²ng Lab
// NguyÃªn liá»‡u = kiáº¿n thá»©c tá»« bÃ i há»c/quiz
// Váº­t pháº©m = cháº¥t hÃ³a há»c cÃ³ thá»ƒ "cháº¿ táº¡o"

export const ingredients = [
  // NguyÃªn liá»‡u cÆ¡ báº£n (má»Ÿ khÃ³a tá»« quiz lá»›p 8)
  { id: "ing_h", name: "Tinh cháº¥t Hydro", icon: "ðŸ’§", formula: "H", requiredQuiz: "hoa8_kntt_bai1", gradeLevel: 8 },
  { id: "ing_o", name: "Tinh cháº¥t Oxy", icon: "ðŸŒ¬ï¸", formula: "O", requiredQuiz: "hoa8_kntt_bai2", gradeLevel: 8 },
  { id: "ing_fe", name: "Bá»™t Sáº¯t nguyÃªn cháº¥t", icon: "âš™ï¸", formula: "Fe", requiredQuiz: "hoa8_kntt_bai3", gradeLevel: 8 },
  { id: "ing_na", name: "Tinh thá»ƒ Natri", icon: "ðŸ”¶", formula: "Na", requiredQuiz: "hoa8_kntt_bai4", gradeLevel: 8 },
  { id: "ing_cl", name: "KhÃ­ Clo cÃ´ Ä‘áº·c", icon: "ðŸ’š", formula: "Cl", requiredQuiz: "hoa8_kntt_bai5", gradeLevel: 8 },
  { id: "ing_c", name: "Than Cacbon tinh khiáº¿t", icon: "â¬›", formula: "C", requiredQuiz: "hoa8_kntt_bai6", gradeLevel: 8 },
  // NguyÃªn liá»‡u nÃ¢ng cao (lá»›p 9-10)
  { id: "ing_s", name: "Bá»™t LÆ°u huá»³nh", icon: "ðŸŸ¡", formula: "S", requiredQuiz: "hoa9_kntt_bai1", gradeLevel: 9 },
  { id: "ing_n", name: "KhÃ­ NitÆ¡ nguyÃªn cháº¥t", icon: "ðŸ”µ", formula: "N", requiredQuiz: "hoa10_kntt_bai1", gradeLevel: 10 },
  { id: "ing_ca", name: "Bá»™t Canxi", icon: "ðŸ¤", formula: "Ca", requiredQuiz: "hoa9_kntt_bai2", gradeLevel: 9 },
  { id: "ing_ag", name: "Tinh cháº¥t Báº¡c", icon: "ðŸ¥ˆ", formula: "Ag", requiredQuiz: "hoa11_kntt_bai1", gradeLevel: 11 },
  { id: "ing_au", name: "Tinh cháº¥t VÃ ng", icon: "ðŸ¥‡", formula: "Au", requiredQuiz: "hoa12_kntt_bai1", gradeLevel: 12 },
  
  // Halogen & KhÃ­ hiáº¿m (Lá»›p 10)
  { id: "ing_f", name: "KhÃ­ Flo", icon: "ðŸŸ¢", formula: "F", requiredQuiz: "hoa10_kntt_bai1", gradeLevel: 10 },
  { id: "ing_br", name: "Dung dá»‹ch Brom", icon: "ðŸŸ¤", formula: "Br", requiredQuiz: "hoa10_kntt_bai2", gradeLevel: 10 },
  { id: "ing_i", name: "Tinh thá»ƒ Iá»‘t", icon: "ðŸŸ£", formula: "I", requiredQuiz: "hoa10_kntt_bai3", gradeLevel: 10 },
  { id: "ing_he", name: "KhÃ­ Heli", icon: "ðŸŽˆ", formula: "He", requiredQuiz: "hoa10_kntt_bai4", gradeLevel: 10 },
  { id: "ing_ne", name: "KhÃ­ Neon", icon: "ðŸš¥", formula: "Ne", requiredQuiz: "hoa10_kntt_bai5", gradeLevel: 10 },
  { id: "ing_ar", name: "KhÃ­ Argon", icon: "ðŸ›¡ï¸", formula: "Ar", requiredQuiz: "hoa10_kntt_bai6", gradeLevel: 10 },
  
  // Ã kim & Kim loáº¡i kiá»m thá»• (Lá»›p 11-12)
  { id: "ing_si", name: "Bá»™t Silic", icon: "ðŸŒ‘", formula: "Si", requiredQuiz: "hoa11_kntt_bai2", gradeLevel: 11 },
  { id: "ing_be", name: "Bá»™t Beri", icon: "âšª", formula: "Be", requiredQuiz: "hoa12_kntt_bai2", gradeLevel: 12 },
  { id: "ing_ba", name: "Bá»™t Bari", icon: "ðŸ", formula: "Ba", requiredQuiz: "hoa12_kntt_bai3", gradeLevel: 12 },
];

export const craftableItems = [
  {
    id: "craft_h2o",
    name: "NÆ°á»›c tinh khiáº¿t",
    formula: "Hâ‚‚O",
    icon: "ðŸ’§",
    category: "CÆ¡ báº£n",
    rarity: "common",
    description: "Cháº¥t lá»ng thiáº¿t yáº¿u cho sá»± sá»‘ng. Chiáº¿m 70% bá» máº·t TrÃ¡i Ä‘áº¥t.",
    ingredients: ["ing_h", "ing_h", "ing_o"],
    xpReward: 50,
    unlockMessage: "Báº¡n Ä‘Ã£ cháº¿ táº¡o thÃ nh cÃ´ng phÃ¢n tá»­ nÆ°á»›c â€” ná»n táº£ng cá»§a sá»± sá»‘ng!",
  },
  {
    id: "craft_nacl",
    name: "Muá»‘i Äƒn",
    formula: "NaCl",
    icon: "ðŸ§‚",
    category: "CÆ¡ báº£n",
    rarity: "common",
    description: "Gia vá»‹ quen thuá»™c trong má»—i bá»¯a Äƒn. LiÃªn káº¿t ion kinh Ä‘iá»ƒn.",
    ingredients: ["ing_na", "ing_cl"],
    xpReward: 60,
    unlockMessage: "Muá»‘i Äƒn â€” sáº£n pháº©m cá»§a liÃªn káº¿t ion giá»¯a Naâº vÃ  Clâ»!",
  },
  {
    id: "craft_fe3o4",
    name: "Oxit sáº¯t tá»«",
    formula: "Feâ‚ƒOâ‚„",
    icon: "ðŸ§²",
    category: "Trung bÃ¬nh",
    rarity: "uncommon",
    description: "CÃ³ tá»« tÃ­nh, dÃ¹ng lÃ m nam chÃ¢m vÃ  sÆ¡n chá»‘ng gá»‰.",
    ingredients: ["ing_fe", "ing_fe", "ing_fe", "ing_o", "ing_o"],
    xpReward: 100,
    unlockMessage: "Feâ‚ƒOâ‚„ â€” oxit sáº¯t cÃ³ tá»« tÃ­nh! ÄÃ¢y lÃ  pháº£n á»©ng Ä‘á»‘t chÃ¡y sáº¯t trong oxy.",
  },
  {
    id: "craft_co2",
    name: "KhÃ­ Cacbonic",
    formula: "COâ‚‚",
    icon: "ðŸ’¨",
    category: "CÆ¡ báº£n",
    rarity: "common",
    description: "KhÃ­ nhÃ  kÃ­nh. CÃ³ trong nÆ°á»›c ngá»t táº¡o bá»t ga.",
    ingredients: ["ing_c", "ing_o", "ing_o"],
    xpReward: 50,
    unlockMessage: "COâ‚‚ â€” khÃ­ mÃ  báº¡n thá»Ÿ ra má»—i ngÃ y! CÅ©ng lÃ  thá»© táº¡o bá»t cho nÆ°á»›c ngá»t.",
  },
  {
    id: "craft_caco3",
    name: "ÄÃ¡ vÃ´i",
    formula: "CaCOâ‚ƒ",
    icon: "ðŸª¨",
    category: "Trung bÃ¬nh",
    rarity: "uncommon",
    description: "ThÃ nh pháº§n táº¡o nÃªn nÃºi Ä‘Ã¡ vÃ´i, vá» sÃ², vÃ  san hÃ´.",
    ingredients: ["ing_ca", "ing_c", "ing_o", "ing_o", "ing_o"],
    xpReward: 120,
    unlockMessage: "CaCOâ‚ƒ â€” thÃ nh pháº§n táº¡o nÃªn nhá»¯ng dÃ£y nÃºi Ä‘Ã¡ vÃ´i hÃ¹ng vÄ©!",
  },
  {
    id: "craft_nh3",
    name: "Amoniac",
    formula: "NHâ‚ƒ",
    icon: "ðŸŒ¿",
    category: "NÃ¢ng cao",
    rarity: "rare",
    description: "NguyÃªn liá»‡u sáº£n xuáº¥t phÃ¢n bÃ³n. MÃ¹i khai Ä‘áº·c trÆ°ng.",
    ingredients: ["ing_n", "ing_h", "ing_h", "ing_h"],
    xpReward: 150,
    unlockMessage: "NHâ‚ƒ â€” muá»‘n cÃ³ cÃ¢y xanh tá»‘t tÆ°Æ¡i, pháº£i cÃ³ amoniac lÃ m phÃ¢n bÃ³n!",
  },
];

export const rarityConfig = {
  common: { label: "Phá»• thÃ´ng", color: "text-gray-600 bg-gray-100 border-gray-200" },
  uncommon: { label: "Äáº·c biá»‡t", color: "text-blue-600 bg-blue-50 border-blue-200" },
  rare: { label: "Hiáº¿m", color: "text-purple-600 bg-purple-50 border-purple-200" },
  legendary: { label: "Huyá»n thoáº¡i", color: "text-orange-600 bg-orange-50 border-orange-200" },
};

export const initialInventory = ingredients.map(ing => ({
  ...ing,
  amount: ing.gradeLevel === 8 ? 5 : 0 // Give some starting hoc_lieu for grade 8
}));

export const recipes = [
  { ingredients: ["ing_h", "ing_h", "ing_o"], productId: "craft_h2o", productName: "NÆ°á»›c (Hâ‚‚O)" },
  { ingredients: ["ing_na", "ing_cl"], productId: "craft_nacl", productName: "Muá»‘i Äƒn (NaCl)" },
  { ingredients: ["ing_c", "ing_o", "ing_o"], productId: "craft_co2", productName: "KhÃ­ Cacbonic (COâ‚‚)" },
  { ingredients: ["ing_fe", "ing_fe", "ing_fe", "ing_o", "ing_o", "ing_o", "ing_o"], productId: "craft_fe3o4", productName: "Oxit sáº¯t tá»« (Feâ‚ƒOâ‚„)" },
];

export const getLevelFromXP = (xp) => {
  if (xp < 100) return { level: 1, title: "Táº­p sá»± giáº£ kim", nextLevelXP: 100 };
  if (xp < 300) return { level: 2, title: "Há»c Ä‘á»“ hÃ³a há»c", nextLevelXP: 300 };
  if (xp < 600) return { level: 3, title: "ChuyÃªn viÃªn Lab", nextLevelXP: 600 };
  if (xp < 1000) return { level: 4, title: "Báº­c tháº§y phÃ¢n tá»­", nextLevelXP: 1000 };
  return { level: 5, title: "GiÃ¡o sÆ° HÃ³a há»c", nextLevelXP: 2000 };
};


