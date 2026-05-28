export const reactionsBatch1_2 = [
  // --- Bá»” SUNG KHá»I LÆ¯á»¢NG Lá»šN (BATCH 1: Lá»šP 8-9) ---
  {
    id: "rx_018",
    name: "Äá»‘t chÃ¡y Photpho",
    type: "combination",
    reactants: [
      { formula: "P", coeff: 4, name: "Photpho" },
      { formula: "Oâ‚‚", coeff: 5, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "Pâ‚‚Oâ‚…", coeff: 2, name: "Diphotpho Pentaoxit" }
    ],
    equation: "4P + 5Oâ‚‚ â†’(tÂ°) 2Pâ‚‚Oâ‚…",
    gradeLevel: 8,
    category: "Phi kim",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Photpho chÃ¡y máº¡nh vá»›i ngá»n lá»­a sÃ¡ng chÃ³i, táº¡o khÃ³i tráº¯ng dÃ y Ä‘áº·c (Pâ‚‚Oâ‚…).",
    energy: -3013,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_019",
    name: "Dáº«n khÃ­ Hydro qua Äá»“ng(II) Oxit",
    type: "single-replacement",
    reactants: [
      { formula: "CuO", coeff: 1, name: "Äá»“ng(II) Oxit" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    products: [
      { formula: "Cu", coeff: 1, name: "Äá»“ng" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "CuO + Hâ‚‚ â†’(tÂ°) Cu + Hâ‚‚O",
    gradeLevel: 8,
    category: "Oxit",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Bá»™t CuO mÃ u Ä‘en chuyá»ƒn dáº§n sang mÃ u Ä‘á» cá»§a kim loáº¡i Äá»“ng (Cu). CÃ³ hÆ¡i nÆ°á»›c thoÃ¡t ra.",
    energy: -130,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_020",
    name: "NhÃ´m tÃ¡c dá»¥ng vá»›i Axit Sunfuric loÃ£ng",
    type: "single-replacement",
    reactants: [
      { formula: "Al", coeff: 2, name: "NhÃ´m" },
      { formula: "Hâ‚‚SOâ‚„", coeff: 3, name: "Axit Sunfuric" }
    ],
    products: [
      { formula: "Alâ‚‚(SOâ‚„)â‚ƒ", coeff: 1, name: "NhÃ´m Sunfat" },
      { formula: "Hâ‚‚", coeff: 3, name: "KhÃ­ Hydro" }
    ],
    equation: "2Al + 3Hâ‚‚SOâ‚„ â†’ Alâ‚‚(SOâ‚„)â‚ƒ + 3Hâ‚‚â†‘",
    gradeLevel: 8,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "NhÃ´m tan nhanh, bá»t khÃ­ thoÃ¡t ra ráº¥t máº¡nh.",
    energy: -500,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_021",
    name: "HÃ²a tan Canxi Oxit vÃ o nÆ°á»›c",
    type: "combination",
    reactants: [
      { formula: "CaO", coeff: 1, name: "VÃ´i sá»‘ng" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Ca(OH)â‚‚", coeff: 1, name: "Canxi Hidroxit" }
    ],
    equation: "CaO + Hâ‚‚O â†’ Ca(OH)â‚‚",
    gradeLevel: 9,
    category: "Oxit",
    conditions: "Pháº£n á»©ng tá»a nhiá»‡t máº¡nh",
    observation: "CaO rÃ£ ra thÃ nh bá»™t tráº¯ng, nÆ°á»›c nÃ³ng lÃªn máº¡nh máº½.",
    energy: -63.5,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_022",
    name: "Sáº¯t tÃ¡c dá»¥ng vá»›i Axit Clohidric",
    type: "single-replacement",
    reactants: [
      { formula: "Fe", coeff: 1, name: "Sáº¯t" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "FeClâ‚‚", coeff: 1, name: "Sáº¯t(II) Clorua" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "Fe + 2HCl â†’ FeClâ‚‚ + Hâ‚‚â†‘",
    gradeLevel: 8,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Äinh sáº¯t tan dáº§n, bá»t khÃ­ khÃ´ng mÃ u thoÃ¡t ra, dung dá»‹ch chuyá»ƒn sang mÃ u xanh nháº¡t.",
    energy: -87.9,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_023",
    name: "Pháº£n á»©ng giá»¯a BaClâ‚‚ vÃ  Hâ‚‚SOâ‚„",
    type: "double-replacement",
    reactants: [
      { formula: "BaClâ‚‚", coeff: 1, name: "Bari Clorua" },
      { formula: "Hâ‚‚SOâ‚„", coeff: 1, name: "Axit Sunfuric" }
    ],
    products: [
      { formula: "BaSOâ‚„", coeff: 1, name: "Bari Sunfat" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    equation: "BaClâ‚‚ + Hâ‚‚SOâ‚„ â†’ BaSOâ‚„â†“ + 2HCl",
    gradeLevel: 9,
    category: "Muá»‘i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Xuáº¥t hiá»‡n káº¿t tá»§a tráº¯ng (BaSOâ‚„) ngay láº­p tá»©c.",
    energy: -30,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_024",
    name: "Nhiá»‡t phÃ¢n Axit Silicic",
    type: "decomposition",
    reactants: [
      { formula: "Hâ‚‚SiOâ‚ƒ", coeff: 1, name: "Axit Silicic" }
    ],
    products: [
      { formula: "SiOâ‚‚", coeff: 1, name: "Silic Äioxit" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "Hâ‚‚SiOâ‚ƒ â†’(tÂ°) SiOâ‚‚ + Hâ‚‚O",
    gradeLevel: 11,
    category: "Axit",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Cháº¥t ráº¯n mÃ u tráº¯ng phÃ¢n há»§y thÃ nh cÃ¡t khÃ´ (SiOâ‚‚) vÃ  hÆ¡i nÆ°á»›c.",
    energy: 40,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_025",
    name: "HÃ²a tan Pâ‚‚Oâ‚… vÃ o nÆ°á»›c",
    type: "combination",
    reactants: [
      { formula: "Pâ‚‚Oâ‚…", coeff: 1, name: "Pentaoxit" },
      { formula: "Hâ‚‚O", coeff: 3, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Hâ‚ƒPOâ‚„", coeff: 2, name: "Axit Photphoric" }
    ],
    equation: "Pâ‚‚Oâ‚… + 3Hâ‚‚O â†’ 2Hâ‚ƒPOâ‚„",
    gradeLevel: 9,
    category: "Oxit",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Bá»™t Pâ‚‚Oâ‚… tan hoÃ n toÃ n trong nÆ°á»›c táº¡o dung dá»‹ch axit.",
    energy: -120,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_026",
    name: "Äá»“ng(II) Oxit tÃ¡c dá»¥ng vá»›i HCl",
    type: "double-replacement",
    reactants: [
      { formula: "CuO", coeff: 1, name: "Äá»“ng(II) Oxit" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "CuClâ‚‚", coeff: 1, name: "Äá»“ng(II) Clorua" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "CuO + 2HCl â†’ CuClâ‚‚ + Hâ‚‚O",
    gradeLevel: 9,
    category: "Oxit",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Bá»™t CuO mÃ u Ä‘en tan dáº§n, táº¡o ra dung dá»‹ch cÃ³ mÃ u xanh lÃ¡ cÃ¢y hoáº·c xanh lam.",
    energy: -60,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_027",
    name: "HÃ²a tan NhÃ´m vÃ o NaOH",
    type: "redox",
    reactants: [
      { formula: "Al", coeff: 2, name: "NhÃ´m" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "NaAlOâ‚‚", coeff: 2, name: "Natri Aluminat" },
      { formula: "Hâ‚‚", coeff: 3, name: "KhÃ­ Hydro" }
    ],
    equation: "2Al + 2NaOH + 2Hâ‚‚O â†’ 2NaAlOâ‚‚ + 3Hâ‚‚â†‘",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "NhÃ´m tan máº¡nh, giáº£i phÃ³ng bá»t khÃ­ hydro dá»“i dÃ o.",
    energy: -850,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_028",
    name: "Nhiá»‡t phÃ¢n Äá»“ng(II) Hidroxit",
    type: "decomposition",
    reactants: [
      { formula: "Cu(OH)â‚‚", coeff: 1, name: "Äá»“ng(II) Hidroxit" }
    ],
    products: [
      { formula: "CuO", coeff: 1, name: "Äá»“ng(II) Oxit" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "Cu(OH)â‚‚ â†’(tÂ°) CuO + Hâ‚‚O",
    gradeLevel: 9,
    category: "BazÆ¡",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Káº¿t tá»§a mÃ u xanh lÆ¡ cá»§a Cu(OH)â‚‚ chuyá»ƒn dáº§n thÃ nh cháº¥t ráº¯n mÃ u Ä‘en (CuO).",
    energy: 52,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_029",
    name: "NhÃ´m tÃ¡c dá»¥ng vá»›i Clo",
    type: "combination",
    reactants: [
      { formula: "Al", coeff: 2, name: "NhÃ´m" },
      { formula: "Clâ‚‚", coeff: 3, name: "KhÃ­ Clo" }
    ],
    products: [
      { formula: "AlClâ‚ƒ", coeff: 2, name: "NhÃ´m Clorua" }
    ],
    equation: "2Al + 3Clâ‚‚ â†’(tÂ°) 2AlClâ‚ƒ",
    gradeLevel: 10,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "NhÃ´m chÃ¡y sÃ¡ng trong khÃ­ Clo, táº¡o ra khÃ³i tráº¯ng (AlClâ‚ƒ).",
    energy: -1400,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_030",
    name: "Pháº£n á»©ng táº¡o AgCl",
    type: "double-replacement",
    reactants: [
      { formula: "AgNOâ‚ƒ", coeff: 1, name: "Báº¡c Nitrat" },
      { formula: "NaCl", coeff: 1, name: "Natri Clorua" }
    ],
    products: [
      { formula: "AgCl", coeff: 1, name: "Báº¡c Clorua" },
      { formula: "NaNOâ‚ƒ", coeff: 1, name: "Natri Nitrat" }
    ],
    equation: "AgNOâ‚ƒ + NaCl â†’ AgClâ†“ + NaNOâ‚ƒ",
    gradeLevel: 9,
    category: "Muá»‘i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Xuáº¥t hiá»‡n káº¿t tá»§a tráº¯ng vÃ³n cá»¥c (AgCl).",
    energy: -65.7,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_031",
    name: "Pháº£n á»©ng táº¡o AgBr",
    type: "double-replacement",
    reactants: [
      { formula: "AgNOâ‚ƒ", coeff: 1, name: "Báº¡c Nitrat" },
      { formula: "NaBr", coeff: 1, name: "Natri Bromua" }
    ],
    products: [
      { formula: "AgBr", coeff: 1, name: "Báº¡c Bromua" },
      { formula: "NaNOâ‚ƒ", coeff: 1, name: "Natri Nitrat" }
    ],
    equation: "AgNOâ‚ƒ + NaBr â†’ AgBrâ†“ + NaNOâ‚ƒ",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Xuáº¥t hiá»‡n káº¿t tá»§a mÃ u vÃ ng nháº¡t (AgBr).",
    energy: -84.2,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_032",
    name: "Pháº£n á»©ng táº¡o AgI",
    type: "double-replacement",
    reactants: [
      { formula: "AgNOâ‚ƒ", coeff: 1, name: "Báº¡c Nitrat" },
      { formula: "NaI", coeff: 1, name: "Natri Iotua" }
    ],
    products: [
      { formula: "AgI", coeff: 1, name: "Báº¡c Iotua" },
      { formula: "NaNOâ‚ƒ", coeff: 1, name: "Natri Nitrat" }
    ],
    equation: "AgNOâ‚ƒ + NaI â†’ AgIâ†“ + NaNOâ‚ƒ",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Xuáº¥t hiá»‡n káº¿t tá»§a mÃ u vÃ ng Ä‘áº­m (AgI).",
    energy: -112,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_033",
    name: "Äá»‘t chÃ¡y Sáº¯t trong Clo",
    type: "combination",
    reactants: [
      { formula: "Fe", coeff: 2, name: "Sáº¯t" },
      { formula: "Clâ‚‚", coeff: 3, name: "KhÃ­ Clo" }
    ],
    products: [
      { formula: "FeClâ‚ƒ", coeff: 2, name: "Sáº¯t(III) Clorua" }
    ],
    equation: "2Fe + 3Clâ‚‚ â†’(tÂ°) 2FeClâ‚ƒ",
    gradeLevel: 10,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Sáº¯t chÃ¡y sÃ¡ng máº¡nh trong Clo, táº¡o ra khÃ³i mÃ u nÃ¢u Ä‘á» (FeClâ‚ƒ).",
    energy: -800,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_034",
    name: "Pháº£n á»©ng táº¡o CaCOâ‚ƒ (Thá»•i COâ‚‚ vÃ o nÆ°á»›c vÃ´i trong)",
    type: "combination",
    reactants: [
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" },
      { formula: "Ca(OH)â‚‚", coeff: 1, name: "Canxi Hidroxit" }
    ],
    products: [
      { formula: "CaCOâ‚ƒ", coeff: 1, name: "ÄÃ¡ vÃ´i" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "COâ‚‚ + Ca(OH)â‚‚ â†’ CaCOâ‚ƒâ†“ + Hâ‚‚O",
    gradeLevel: 9,
    category: "Oxit",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "NÆ°á»›c vÃ´i trong bá»‹ váº©n Ä‘á»¥c do sá»± hÃ¬nh thÃ nh káº¿t tá»§a tráº¯ng CaCOâ‚ƒ.",
    energy: -113,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_035",
    name: "Natri tÃ¡c dá»¥ng vá»›i RÆ°á»£u Etylic",
    type: "single-replacement",
    reactants: [
      { formula: "Câ‚‚Hâ‚…OH", coeff: 2, name: "RÆ°á»£u Etylic" },
      { formula: "Na", coeff: 2, name: "Natri" }
    ],
    products: [
      { formula: "Câ‚‚Hâ‚…ONa", coeff: 2, name: "Natri Etylat" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "2Câ‚‚Hâ‚…OH + 2Na â†’ 2Câ‚‚Hâ‚…ONa + Hâ‚‚â†‘",
    gradeLevel: 12,
    category: "Há»¯u cÆ¡",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Máº£nh Natri tan dáº§n, bá»t khÃ­ thoÃ¡t ra Ä‘á»u Ä‘áº·n.",
    energy: -200,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_206",
    name: "LÆ°u huá»³nh chÃ¡y trong Oxy (Táº¡o SOâ‚‚)",
    type: "combination",
    reactants: [
      { formula: "S", coeff: 1, name: "LÆ°u huá»³nh" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "SOâ‚‚", coeff: 1, name: "LÆ°u huá»³nh Äioxit" }
    ],
    equation: "S + Oâ‚‚ â†’(tÂ°) SOâ‚‚",
    gradeLevel: 8,
    category: "Phi kim",
    conditions: "Äá»‘t chÃ¡y",
    observation: "LÆ°u huá»³nh chÃ¡y trong oxy vá»›i ngá»n lá»­a xanh nháº¡t, táº¡o khÃ­ mÃ¹i háº¯c.",
    energy: -297,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 2,
    safetyWarning: "KhÃ­ SOâ‚‚ Ä‘á»™c, pháº£i thá»±c hiá»‡n trong tá»§ hÃºt.",
    isBlocked: false
  },
  {
    id: "rx_207",
    name: "SOâ‚‚ tÃ¡c dá»¥ng vá»›i nÆ°á»›c (Táº¡o Hâ‚‚SOâ‚ƒ)",
    type: "combination",
    reactants: [
      { formula: "SOâ‚‚", coeff: 1, name: "LÆ°u huá»³nh Äioxit" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Hâ‚‚SOâ‚ƒ", coeff: 1, name: "Axit SunfurÆ¡" }
    ],
    equation: "SOâ‚‚ + Hâ‚‚O â‡Œ Hâ‚‚SOâ‚ƒ",
    gradeLevel: 9,
    category: "Axit",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "KhÃ­ SOâ‚‚ tan trong nÆ°á»›c táº¡o dung dá»‹ch lÃ m quá»³ tÃ­m hÃ³a Ä‘á».",
    energy: -20,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_208",
    name: "MagiÃª tÃ¡c dá»¥ng vá»›i HCl",
    type: "single-replacement",
    reactants: [
      { formula: "Mg", coeff: 1, name: "MagiÃª" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "MgClâ‚‚", coeff: 1, name: "MagiÃª Clorua" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "Mg + 2HCl â†’ MgClâ‚‚ + Hâ‚‚â†‘",
    gradeLevel: 8,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "MagiÃª tan ráº¥t nhanh, tá»a nhiá»‡t vÃ  bá»t khÃ­ thoÃ¡t ra mÃ£nh liá»‡t.",
    energy: -467,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_209",
    name: "Äá»“ng(II) Sunfat tÃ¡c dá»¥ng vá»›i NaOH",
    type: "double-replacement",
    reactants: [
      { formula: "CuSOâ‚„", coeff: 1, name: "Äá»“ng(II) Sunfat" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Cu(OH)â‚‚", coeff: 1, name: "Äá»“ng(II) Hidroxit" },
      { formula: "Naâ‚‚SOâ‚„", coeff: 1, name: "Natri Sunfat" }
    ],
    equation: "CuSOâ‚„ + 2NaOH â†’ Cu(OH)â‚‚â†“ + Naâ‚‚SOâ‚„",
    gradeLevel: 9,
    category: "BazÆ¡",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Xuáº¥t hiá»‡n káº¿t tá»§a xanh lÆ¡ (Cu(OH)â‚‚) láº¯ng xuá»‘ng.",
    energy: -50,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_210",
    name: "Pháº£n á»©ng táº¡o AgCl (dÃ¹ng KCl)",
    type: "double-replacement",
    reactants: [
      { formula: "AgNOâ‚ƒ", coeff: 1, name: "Báº¡c Nitrat" },
      { formula: "KCl", coeff: 1, name: "Kali Clorua" }
    ],
    products: [
      { formula: "AgCl", coeff: 1, name: "Báº¡c Clorua" },
      { formula: "KNOâ‚ƒ", coeff: 1, name: "Kali Nitrat" }
    ],
    equation: "AgNOâ‚ƒ + KCl â†’ AgClâ†“ + KNOâ‚ƒ",
    gradeLevel: 9,
    category: "Muá»‘i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Xuáº¥t hiá»‡n káº¿t tá»§a tráº¯ng vÃ³n cá»¥c (AgCl).",
    energy: -65.7,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },

  {
    id: "rx_036",
    name: "Natri tÃ¡c dá»¥ng vá»›i Axit Axetic",
    type: "single-replacement",
    reactants: [
      { formula: "CHâ‚ƒCOOH", coeff: 2, name: "Axit Axetic" },
      { formula: "Na", coeff: 2, name: "Natri" }
    ],
    products: [
      { formula: "CHâ‚ƒCOONa", coeff: 2, name: "Natri Axetat" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "2CHâ‚ƒCOOH + 2Na â†’ 2CHâ‚ƒCOONa + Hâ‚‚â†‘",
    gradeLevel: 11,
    category: "Axit há»¯u cÆ¡",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Natri tan máº¡nh, giáº£i phÃ³ng bá»t khÃ­ hydro.",
    energy: -180,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_037",
    name: "Pháº£n á»©ng Este hÃ³a (Tá»•ng há»£p Etyl Axetat)",
    type: "combination",
    reactants: [
      { formula: "CHâ‚ƒCOOH", coeff: 1, name: "Axit Axetic" },
      { formula: "Câ‚‚Hâ‚…OH", coeff: 1, name: "RÆ°á»£u Etylic" }
    ],
    products: [
      { formula: "CHâ‚ƒCOOCâ‚‚Hâ‚…", coeff: 1, name: "Etyl Axetat" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "CHâ‚ƒCOOH + Câ‚‚Hâ‚…OH â‡Œ(tÂ°, Hâ‚‚SOâ‚„) CHâ‚ƒCOOCâ‚‚Hâ‚… + Hâ‚‚O",
    gradeLevel: 12,
    category: "Este",
    conditions: "Nhiá»‡t Ä‘á»™ cao, xÃºc tÃ¡c Hâ‚‚SOâ‚„ Ä‘áº·c",
    observation: "Dung dá»‹ch cÃ³ mÃ¹i thÆ¡m Ä‘áº·c trÆ°ng cá»§a tÃ¡o hoáº·c chuá»‘i.",
    energy: 15,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_038",
    name: "LÃªn men GlucozÆ¡",
    type: "decomposition",
    reactants: [
      { formula: "Câ‚†Hâ‚â‚‚Oâ‚†", coeff: 1, name: "GlucozÆ¡" }
    ],
    products: [
      { formula: "Câ‚‚Hâ‚…OH", coeff: 2, name: "RÆ°á»£u Etylic" },
      { formula: "COâ‚‚", coeff: 2, name: "KhÃ­ Cacbonic" }
    ],
    equation: "Câ‚†Hâ‚â‚‚Oâ‚† â†’(men) 2Câ‚‚Hâ‚…OH + 2COâ‚‚â†‘",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Nhiá»‡t Ä‘á»™ 30-35Â°C, men rÆ°á»£u",
    observation: "CÃ³ bá»t khÃ­ COâ‚‚ thoÃ¡t ra, dung dá»‹ch cÃ³ mÃ¹i rÆ°á»£u.",
    energy: -70,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  // --- Bá»” SUNG KHá»I LÆ¯á»¢NG Lá»šN (BATCH 2: VÃ” CÆ  NÃ‚NG CAO) ---
  {
    id: "rx_039",
    name: "Clo tÃ¡c dá»¥ng vá»›i nÆ°á»›c (Pháº£n á»©ng thuáº­n nghá»‹ch)",
    type: "redox",
    reactants: [
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "HCl", coeff: 1, name: "Axit Clohidric" },
      { formula: "HClO", coeff: 1, name: "Axit HipoclorÆ¡" }
    ],
    equation: "Clâ‚‚ + Hâ‚‚O â‡Œ HCl + HClO",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "NÆ°á»›c clo cÃ³ mÃ u vÃ ng nháº¡t, mÃ¹i háº¯c. Dung dá»‹ch cÃ³ tÃ­nh táº©y mÃ u.",
    energy: 25,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_040",
    name: "Äiá»u cháº¿ nÆ°á»›c Gia-ven",
    type: "redox",
    reactants: [
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "NaCl", coeff: 1, name: "Natri Clorua" },
      { formula: "NaClO", coeff: 1, name: "Natri Hipoclorit" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "Clâ‚‚ + 2NaOH â†’ NaCl + NaClO + Hâ‚‚O",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "KhÃ­ clo tan dáº§n, táº¡o dung dá»‹ch khÃ´ng mÃ u cÃ³ tÃ­nh táº©y mÃ u máº¡nh.",
    energy: -110,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_041",
    name: "Clo tÃ¡c dá»¥ng vá»›i Canxi Hidroxit (Táº¡o Clorua vÃ´i)",
    type: "redox",
    reactants: [
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" },
      { formula: "Ca(OH)â‚‚", coeff: 1, name: "Canxi Hidroxit" }
    ],
    products: [
      { formula: "CaOClâ‚‚", coeff: 1, name: "Clorua vÃ´i" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "Clâ‚‚ + Ca(OH)â‚‚ â†’ CaOClâ‚‚ + Hâ‚‚O",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "30Â°C",
    observation: "Táº¡o thÃ nh cháº¥t bá»™t mÃ u tráº¯ng cÃ³ mÃ¹i xá»‘c cá»§a clo.",
    energy: -80,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_042",
    name: "Äiá»u cháº¿ Clo trong phÃ²ng thÃ­ nghiá»‡m (Sá»­ dá»¥ng MnOâ‚‚)",
    type: "redox",
    reactants: [
      { formula: "MnOâ‚‚", coeff: 1, name: "Mangan Äioxit" },
      { formula: "HCl", coeff: 4, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "MnClâ‚‚", coeff: 1, name: "Mangan(II) Clorua" },
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "MnOâ‚‚ + 4HCl â†’(tÂ°) MnClâ‚‚ + Clâ‚‚â†‘ + 2Hâ‚‚O",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Bá»™t MnOâ‚‚ tan dáº§n, giáº£i phÃ³ng khÃ­ clo mÃ u vÃ ng lá»¥c, mÃ¹i xá»‘c.",
    energy: 150,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_043",
    name: "Äiá»u cháº¿ Clo trong phÃ²ng thÃ­ nghiá»‡m (Sá»­ dá»¥ng KMnOâ‚„)",
    type: "redox",
    reactants: [
      { formula: "KMnOâ‚„", coeff: 2, name: "Kali Pemanganat" },
      { formula: "HCl", coeff: 16, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "KCl", coeff: 2, name: "Kali Clorua" },
      { formula: "MnClâ‚‚", coeff: 2, name: "Mangan(II) Clorua" },
      { formula: "Clâ‚‚", coeff: 5, name: "KhÃ­ Clo" },
      { formula: "Hâ‚‚O", coeff: 8, name: "NÆ°á»›c" }
    ],
    equation: "2KMnOâ‚„ + 16HCl â†’ 2KCl + 2MnClâ‚‚ + 5Clâ‚‚â†‘ + 8Hâ‚‚O",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Thuá»‘c tÃ­m tan nhanh, giáº£i phÃ³ng khÃ­ Clo ráº¥t máº¡nh.",
    energy: -450,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_044",
    name: "HÃ²a tan SiOâ‚‚ trong HF (Ä‚n mÃ²n thá»§y tinh)",
    type: "double-replacement",
    reactants: [
      { formula: "SiOâ‚‚", coeff: 1, name: "Thá»§y tinh" },
      { formula: "HF", coeff: 4, name: "Hydro Florua" }
    ],
    products: [
      { formula: "SiFâ‚„", coeff: 1, name: "Silic Tetraflorua" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "SiOâ‚‚ + 4HF â†’ SiFâ‚„â†‘ + 2Hâ‚‚O",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Thá»§y tinh bá»‹ Äƒn mÃ²n, táº¡o thÃ nh khÃ­ SiFâ‚„.",
    energy: -190,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_045",
    name: "Äá»‘t chÃ¡y LÆ°u huá»³nh trong Oxy",
    type: "combination",
    reactants: [
      { formula: "S", coeff: 1, name: "LÆ°u huá»³nh" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "SOâ‚‚", coeff: 1, name: "LÆ°u huá»³nh Äioxit" }
    ],
    equation: "S + Oâ‚‚ â†’(tÂ°) SOâ‚‚",
    gradeLevel: 10,
    category: "Oxi - LÆ°u huá»³nh",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "LÆ°u huá»³nh chÃ¡y trong oxy vá»›i ngá»n lá»­a xanh lam nháº¡t, táº¡o khÃ­ mÃ¹i háº¯c.",
    energy: -297,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_046",
    name: "Tá»•ng há»£p SOâ‚ƒ (XÃºc tÃ¡c Vâ‚‚Oâ‚…)",
    type: "combination",
    reactants: [
      { formula: "SOâ‚‚", coeff: 2, name: "LÆ°u huá»³nh Äioxit" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "SOâ‚ƒ", coeff: 2, name: "LÆ°u huá»³nh Trioxit" }
    ],
    equation: "2SOâ‚‚ + Oâ‚‚ â‡Œ(tÂ°, Vâ‚‚Oâ‚…) 2SOâ‚ƒ",
    gradeLevel: 10,
    category: "Oxi - LÆ°u huá»³nh",
    conditions: "450Â°C, xÃºc tÃ¡c Vâ‚‚Oâ‚…",
    observation: "KhÃ­ SOâ‚‚ pháº£n á»©ng táº¡o thÃ nh khÃ³i SOâ‚ƒ dá»… ngÆ°ng tá»¥.",
    energy: -198,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_047",
    name: "Axit Sunfuric Ä‘áº·c tÃ¡c dá»¥ng vá»›i Äá»“ng",
    type: "redox",
    reactants: [
      { formula: "Cu", coeff: 1, name: "Äá»“ng" },
      { formula: "Hâ‚‚SOâ‚„", coeff: 2, name: "Axit Sunfuric" }
    ],
    products: [
      { formula: "CuSOâ‚„", coeff: 1, name: "Äá»“ng(II) Sunfat" },
      { formula: "SOâ‚‚", coeff: 1, name: "LÆ°u huá»³nh Äioxit" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "Cu + 2Hâ‚‚SOâ‚„(Ä‘) â†’ CuSOâ‚„ + SOâ‚‚â†‘ + 2Hâ‚‚O",
    gradeLevel: 10,
    category: "Oxi - LÆ°u huá»³nh",
    conditions: "Nhiá»‡t Ä‘á»™ cao, Hâ‚‚SOâ‚„ Ä‘áº·c",
    observation: "Äá»“ng tan dáº§n, dung dá»‹ch chuyá»ƒn sang mÃ u xanh lam, cÃ³ khÃ­ mÃ¹i háº¯c thoÃ¡t ra.",
    energy: -120,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_048",
    name: "Axit Sunfuric Ä‘áº·c tÃ¡c dá»¥ng vá»›i Cacbon",
    type: "redox",
    reactants: [
      { formula: "C", coeff: 1, name: "Than graphite" },
      { formula: "Hâ‚‚SOâ‚„", coeff: 2, name: "Axit Sunfuric" }
    ],
    products: [
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" },
      { formula: "SOâ‚‚", coeff: 2, name: "LÆ°u huá»³nh Äioxit" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "C + 2Hâ‚‚SOâ‚„(Ä‘) â†’ COâ‚‚â†‘ + 2SOâ‚‚â†‘ + 2Hâ‚‚O",
    gradeLevel: 10,
    category: "Oxi - LÆ°u huá»³nh",
    conditions: "Nhiá»‡t Ä‘á»™ cao, Hâ‚‚SOâ‚„ Ä‘áº·c",
    observation: "Than tan dáº§n, giáº£i phÃ³ng há»—n há»£p khÃ­.",
    energy: -150,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_049",
    name: "Pháº£n á»©ng cá»§a Hâ‚‚S vá»›i Oxy (Thiáº¿u oxy)",
    type: "redox",
    reactants: [
      { formula: "Hâ‚‚S", coeff: 2, name: "Hydro Sunfua" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "S", coeff: 2, name: "LÆ°u huá»³nh" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "2Hâ‚‚S + Oâ‚‚ â†’ 2S + 2Hâ‚‚O",
    gradeLevel: 10,
    category: "Oxi - LÆ°u huá»³nh",
    conditions: "Nhiá»‡t Ä‘á»™ tháº¥p, thiáº¿u oxy",
    observation: "Táº¡o thÃ nh cháº¥t ráº¯n mÃ u vÃ ng (LÆ°u huá»³nh) bÃ¡m trÃªn thÃ nh bÃ¬nh.",
    energy: -200,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_050",
    name: "Pháº£n á»©ng cá»§a Hâ‚‚S vá»›i Oxy (DÆ° oxy)",
    type: "redox",
    reactants: [
      { formula: "Hâ‚‚S", coeff: 2, name: "Hydro Sunfua" },
      { formula: "Oâ‚‚", coeff: 3, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "SOâ‚‚", coeff: 2, name: "LÆ°u huá»³nh Äioxit" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "2Hâ‚‚S + 3Oâ‚‚ â†’ 2SOâ‚‚ + 2Hâ‚‚O",
    gradeLevel: 10,
    category: "Oxi - LÆ°u huá»³nh",
    conditions: "Äá»‘t chÃ¡y",
    observation: "KhÃ­ Hâ‚‚S chÃ¡y táº¡o thÃ nh khÃ­ mÃ¹i háº¯c SOâ‚‚.",
    energy: -1037,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_051",
    name: "Äiá»u cháº¿ Amoniac tá»« NHâ‚„Cl",
    type: "double-replacement",
    reactants: [
      { formula: "NHâ‚„Cl", coeff: 2, name: "AmÃ´ni Clorua" },
      { formula: "Ca(OH)â‚‚", coeff: 1, name: "Canxi Hidroxit" }
    ],
    products: [
      { formula: "CaClâ‚‚", coeff: 1, name: "Canxi Clorua" },
      { formula: "NHâ‚ƒ", coeff: 2, name: "Amoniac" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "2NHâ‚„Cl + Ca(OH)â‚‚ â†’ CaClâ‚‚ + 2NHâ‚ƒâ†‘ + 2Hâ‚‚O",
    gradeLevel: 11,
    category: "NitÆ¡ - Photpho",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Giáº£i phÃ³ng khÃ­ Amoniac cÃ³ mÃ¹i khai Ä‘áº·c trÆ°ng.",
    energy: 95,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_052",
    name: "Axit Nitric loÃ£ng tÃ¡c dá»¥ng vá»›i Äá»“ng",
    type: "redox",
    reactants: [
      { formula: "Cu", coeff: 3, name: "Äá»“ng" },
      { formula: "HNOâ‚ƒ", coeff: 8, name: "Axit Nitric" }
    ],
    products: [
      { formula: "Cu(NOâ‚ƒ)â‚‚", coeff: 3, name: "Äá»“ng(II) Nitrat" },
      { formula: "NO", coeff: 2, name: "NitÆ¡ Oxit" },
      { formula: "Hâ‚‚O", coeff: 4, name: "NÆ°á»›c" }
    ],
    equation: "3Cu + 8HNOâ‚ƒ(l) â†’ 3Cu(NOâ‚ƒ)â‚‚ + 2NOâ†‘ + 4Hâ‚‚O",
    gradeLevel: 11,
    category: "NitÆ¡ - Photpho",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Äá»“ng tan, táº¡o dung dá»‹ch xanh lam vÃ  khÃ­ khÃ´ng mÃ u NO (hÃ³a nÃ¢u trong khÃ´ng khÃ­).",
    energy: -200,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_053",
    name: "Axit Nitric Ä‘áº·c tÃ¡c dá»¥ng vá»›i Äá»“ng",
    type: "redox",
    reactants: [
      { formula: "Cu", coeff: 1, name: "Äá»“ng" },
      { formula: "HNOâ‚ƒ", coeff: 4, name: "Axit Nitric" }
    ],
    products: [
      { formula: "Cu(NOâ‚ƒ)â‚‚", coeff: 1, name: "Äá»“ng(II) Nitrat" },
      { formula: "NOâ‚‚", coeff: 2, name: "NitÆ¡ Äioxit" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "Cu + 4HNOâ‚ƒ(Ä‘) â†’ Cu(NOâ‚ƒ)â‚‚ + 2NOâ‚‚â†‘ + 2Hâ‚‚O",
    gradeLevel: 11,
    category: "NitÆ¡ - Photpho",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Äá»“ng tan nhanh, táº¡o dung dá»‹ch xanh lam vÃ  khÃ­ NOâ‚‚ mÃ u nÃ¢u Ä‘á».",
    energy: -150,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_054",
    name: "Äá»‘t chÃ¡y Photpho trong Oxy",
    type: "combination",
    reactants: [
      { formula: "P", coeff: 4, name: "Photpho" },
      { formula: "Oâ‚‚", coeff: 5, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "Pâ‚‚Oâ‚…", coeff: 2, name: "Diphotpho Pentaoxit" }
    ],
    equation: "4P + 5Oâ‚‚ â†’(tÂ°) 2Pâ‚‚Oâ‚…",
    gradeLevel: 11,
    category: "NitÆ¡ - Photpho",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Photpho chÃ¡y máº¡nh vá»›i ngá»n lá»­a sÃ¡ng chÃ³i, táº¡o khÃ³i tráº¯ng Pâ‚‚Oâ‚….",
    energy: -3013,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_055",
    name: "HÃ²a tan Pâ‚‚Oâ‚… trong nÆ°á»›c",
    type: "combination",
    reactants: [
      { formula: "Pâ‚‚Oâ‚…", coeff: 1, name: "Diphotpho Pentaoxit" },
      { formula: "Hâ‚‚O", coeff: 3, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Hâ‚ƒPOâ‚„", coeff: 2, name: "Axit Photphoric" }
    ],
    equation: "Pâ‚‚Oâ‚… + 3Hâ‚‚O â†’ 2Hâ‚ƒPOâ‚„",
    gradeLevel: 11,
    category: "NitÆ¡ - Photpho",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Cháº¥t ráº¯n tráº¯ng tan hoÃ n toÃ n táº¡o dung dá»‹ch Axit Photphoric.",
    energy: -120,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_056",
    name: "HÃ²a tan Al trong dung dá»‹ch kiá»m nÃ³ng",
    type: "redox",
    reactants: [
      { formula: "Al", coeff: 2, name: "NhÃ´m" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "NaAlOâ‚‚", coeff: 2, name: "Natri Aluminat" },
      { formula: "Hâ‚‚", coeff: 3, name: "KhÃ­ Hydro" }
    ],
    equation: "2Al + 2NaOH + 2Hâ‚‚O â†’ 2NaAlOâ‚‚ + 3Hâ‚‚â†‘",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "NhÃ´m tan máº¡nh, giáº£i phÃ³ng bá»t khÃ­ hydro.",
    energy: -850,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_057",
    name: "Pháº£n á»©ng nhiá»‡t nhÃ´m vá»›i Feâ‚‚Oâ‚ƒ",
    type: "redox",
    reactants: [
      { formula: "Al", coeff: 2, name: "NhÃ´m" },
      { formula: "Feâ‚‚Oâ‚ƒ", coeff: 1, name: "Oxit sáº¯t(III)" }
    ],
    products: [
      { formula: "Alâ‚‚Oâ‚ƒ", coeff: 1, name: "NhÃ´m Oxit" },
      { formula: "Fe", coeff: 2, name: "Sáº¯t" }
    ],
    equation: "2Al + Feâ‚‚Oâ‚ƒ â†’(tÂ°) Alâ‚‚Oâ‚ƒ + 2Fe",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ ráº¥t cao",
    observation: "Pháº£n á»©ng tá»a nhiá»‡t cá»±c máº¡nh, sáº¯t táº¡o thÃ nh nÃ³ng cháº£y.",
    energy: -851,
    animation: "explosion",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_058",
    name: "Äiá»u cháº¿ NaOH báº±ng Ä‘iá»‡n phÃ¢n (cÃ³ mÃ ng ngÄƒn)",
    type: "redox",
    reactants: [
      { formula: "NaCl", coeff: 2, name: "Natri Clorua" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" },
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "2NaCl + 2Hâ‚‚O â†’(Ä‘pmn) 2NaOH + Clâ‚‚â†‘ + Hâ‚‚â†‘",
    gradeLevel: 12,
    category: "Kim loáº¡i kiá»m",
    conditions: "Äiá»‡n phÃ¢n cÃ³ mÃ ng ngÄƒn",
    observation: "Giáº£i phÃ³ng khÃ­ Clo á»Ÿ aná»‘t vÃ  khÃ­ Hydro á»Ÿ catá»‘t.",
    energy: 400,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_059",
    name: "Natri chÃ¡y trong khÃ´ng khÃ­ (Táº¡o Natri Peroxit)",
    type: "combination",
    reactants: [
      { formula: "Na", coeff: 2, name: "Natri" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "Naâ‚‚Oâ‚‚", coeff: 1, name: "Natri Peroxit" }
    ],
    equation: "2Na + Oâ‚‚ â†’(tÂ°) Naâ‚‚Oâ‚‚",
    gradeLevel: 12,
    category: "Kim loáº¡i kiá»m",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Natri chÃ¡y vá»›i ngá»n lá»­a vÃ ng, táº¡o cháº¥t ráº¯n mÃ u vÃ ng nháº¡t.",
    energy: -510,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_060",
    name: "HÃ²a tan Naâ‚‚O vÃ o nÆ°á»›c",
    type: "combination",
    reactants: [
      { formula: "Naâ‚‚O", coeff: 1, name: "Natri Oxit" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" }
    ],
    equation: "Naâ‚‚O + Hâ‚‚O â†’ 2NaOH",
    gradeLevel: 12,
    category: "Kim loáº¡i kiá»m",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Oxit tan hoÃ n toÃ n tá»a nhiá»u nhiá»‡t.",
    energy: -238,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_061",
    name: "Nhiá»‡t phÃ¢n Natri Bicacbonat",
    type: "decomposition",
    reactants: [
      { formula: "NaHCOâ‚ƒ", coeff: 2, name: "Natri Bicacbonat" }
    ],
    products: [
      { formula: "Naâ‚‚COâ‚ƒ", coeff: 1, name: "Natri Cacbonat" },
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "2NaHCOâ‚ƒ â†’(tÂ°) Naâ‚‚COâ‚ƒ + COâ‚‚â†‘ + Hâ‚‚O",
    gradeLevel: 12,
    category: "Kim loáº¡i kiá»m",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Sá»§i bá»t khÃ­ COâ‚‚, cháº¥t ráº¯n chuyá»ƒn thÃ nh Ä‘Ã¡ xoda.",
    energy: 135,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_062",
    name: "MagiÃª chÃ¡y trong khÃ´ng khÃ­",
    type: "combination",
    reactants: [
      { formula: "Mg", coeff: 2, name: "MagiÃª" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "MgO", coeff: 2, name: "MagiÃª Oxit" }
    ],
    equation: "2Mg + Oâ‚‚ â†’(tÂ°) 2MgO",
    gradeLevel: 12,
    category: "Kim loáº¡i kiá»m thá»•",
    conditions: "Äá»‘t chÃ¡y",
    observation: "MagiÃª chÃ¡y vá»›i ngá»n lá»­a tráº¯ng chÃ³i, tá»a nhiá»u nhiá»‡t vÃ  Ã¡nh sÃ¡ng.",
    energy: -1202,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_063",
    name: "Canxi Oxit tÃ¡c dá»¥ng vá»›i nÆ°á»›c (TÃ´i vÃ´i)",
    type: "combination",
    reactants: [
      { formula: "CaO", coeff: 1, name: "VÃ´i sá»‘ng" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Ca(OH)â‚‚", coeff: 1, name: "Canxi Hidroxit" }
    ],
    equation: "CaO + Hâ‚‚O â†’ Ca(OH)â‚‚",
    gradeLevel: 12,
    category: "Kim loáº¡i kiá»m thá»•",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "VÃ´i sá»‘ng tan vÃ  tá»a nhiá»‡t máº¡nh.",
    energy: -65,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_064",
    name: "HÃ²a tan CaCOâ‚ƒ báº±ng COâ‚‚ dÆ°",
    type: "combination",
    reactants: [
      { formula: "CaCOâ‚ƒ", coeff: 1, name: "ÄÃ¡ vÃ´i" },
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Ca(HCOâ‚ƒ)â‚‚", coeff: 1, name: "Canxi Bicacbonat" }
    ],
    equation: "CaCOâ‚ƒ + COâ‚‚ + Hâ‚‚O â‡Œ Ca(HCOâ‚ƒ)â‚‚",
    gradeLevel: 12,
    category: "Kim loáº¡i kiá»m thá»•",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Káº¿t tá»§a tráº¯ng Ä‘Ã¡ vÃ´i tan dáº§n táº¡o dung dá»‹ch trong suá»‘t.",
    energy: -40,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_065",
    name: "Nhiá»‡t phÃ¢n Canxi Bicacbonat (Táº¡o tháº¡ch nhÅ©)",
    type: "decomposition",
    reactants: [
      { formula: "Ca(HCOâ‚ƒ)â‚‚", coeff: 1, name: "Canxi Bicacbonat" }
    ],
    products: [
      { formula: "CaCOâ‚ƒ", coeff: 1, name: "ÄÃ¡ vÃ´i" },
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "Ca(HCOâ‚ƒ)â‚‚ â†’(tÂ°) CaCOâ‚ƒâ†“ + COâ‚‚â†‘ + Hâ‚‚O",
    gradeLevel: 12,
    category: "Kim loáº¡i kiá»m thá»•",
    conditions: "Äun nÃ³ng",
    observation: "Dung dá»‹ch trong suá»‘t xuáº¥t hiá»‡n káº¿t tá»§a tráº¯ng vÃ  sá»§i bá»t khÃ­.",
    energy: 40,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_066",
    name: "NhÃ´m tÃ¡c dá»¥ng vá»›i Oxy (Äá»‘t bá»™t nhÃ´m)",
    type: "combination",
    reactants: [
      { formula: "Al", coeff: 4, name: "NhÃ´m" },
      { formula: "Oâ‚‚", coeff: 3, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "Alâ‚‚Oâ‚ƒ", coeff: 2, name: "NhÃ´m Oxit" }
    ],
    equation: "4Al + 3Oâ‚‚ â†’(tÂ°) 2Alâ‚‚Oâ‚ƒ",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Bá»™t nhÃ´m chÃ¡y sÃ¡ng mÃ£nh liá»‡t, tá»a nhiá»u nhiá»‡t.",
    energy: -3352,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_067",
    name: "HÃ²a tan Alâ‚‚Oâ‚ƒ báº±ng Axit",
    type: "double-replacement",
    reactants: [
      { formula: "Alâ‚‚Oâ‚ƒ", coeff: 1, name: "NhÃ´m Oxit" },
      { formula: "HCl", coeff: 6, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "AlClâ‚ƒ", coeff: 2, name: "NhÃ´m Clorua" },
      { formula: "Hâ‚‚O", coeff: 3, name: "NÆ°á»›c" }
    ],
    equation: "Alâ‚‚Oâ‚ƒ + 6HCl â†’ 2AlClâ‚ƒ + 3Hâ‚‚O",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Bá»™t tráº¯ng tan hoÃ n toÃ n táº¡o dung dá»‹ch trong suá»‘t.",
    energy: -300,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_068",
    name: "HÃ²a tan Alâ‚‚Oâ‚ƒ báº±ng Kiá»m",
    type: "redox",
    reactants: [
      { formula: "Alâ‚‚Oâ‚ƒ", coeff: 1, name: "NhÃ´m Oxit" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" },
      { formula: "Hâ‚‚O", coeff: 3, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "NaAlOâ‚‚", coeff: 2, name: "Natri Aluminat" },
      { formula: "Hâ‚‚O", coeff: 0, name: "" }
    ],
    equation: "Alâ‚‚Oâ‚ƒ + 2NaOH + 3Hâ‚‚O â†’ 2Na[Al(OH)â‚„]",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "NhÃ´m oxit tan trong dung dá»‹ch kiá»m nÃ³ng.",
    energy: -200,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_069",
    name: "Sáº¯t tÃ¡c dá»¥ng vá»›i Hâ‚‚SOâ‚„ loÃ£ng",
    type: "single-replacement",
    reactants: [
      { formula: "Fe", coeff: 1, name: "Sáº¯t" },
      { formula: "Hâ‚‚SOâ‚„", coeff: 1, name: "Axit Sunfuric loÃ£ng" }
    ],
    products: [
      { formula: "FeSOâ‚„", coeff: 1, name: "Sáº¯t(II) Sunfat" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "Fe + Hâ‚‚SOâ‚„ â†’ FeSOâ‚„ + Hâ‚‚â†‘",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Sáº¯t tan dáº§n, sá»§i bá»t khÃ­ hydro, dung dá»‹ch xanh nháº¡t.",
    energy: -85,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_070",
    name: "Sáº¯t tÃ¡c dá»¥ng vá»›i Hâ‚‚SOâ‚„ Ä‘áº·c nÃ³ng",
    type: "redox",
    reactants: [
      { formula: "Fe", coeff: 2, name: "Sáº¯t" },
      { formula: "Hâ‚‚SOâ‚„", coeff: 6, name: "Axit Sunfuric Ä‘áº·c" }
    ],
    products: [
      { formula: "Feâ‚‚(SOâ‚„)â‚ƒ", coeff: 1, name: "Sáº¯t(III) Sunfat" },
      { formula: "SOâ‚‚", coeff: 3, name: "LÆ°u huá»³nh Äioxit" },
      { formula: "Hâ‚‚O", coeff: 6, name: "NÆ°á»›c" }
    ],
    equation: "2Fe + 6Hâ‚‚SOâ‚„(Ä‘) â†’ Feâ‚‚(SOâ‚„)â‚ƒ + 3SOâ‚‚â†‘ + 6Hâ‚‚O",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Sáº¯t tan nhanh, giáº£i phÃ³ng khÃ­ SOâ‚‚ mÃ¹i háº¯c, dung dá»‹ch mÃ u vÃ ng nÃ¢u.",
    energy: -450,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_071",
    name: "Äá»‘t chÃ¡y Sáº¯t trong Oxy",
    type: "combination",
    reactants: [
      { formula: "Fe", coeff: 3, name: "Sáº¯t" },
      { formula: "Oâ‚‚", coeff: 2, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "Feâ‚ƒOâ‚„", coeff: 1, name: "Oxit sáº¯t tá»«" }
    ],
    equation: "3Fe + 2Oâ‚‚ â†’(tÂ°) Feâ‚ƒOâ‚„",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "DÃ¢y sáº¯t chÃ¡y sÃ¡ng chÃ³i, tÃ³e ra cÃ¡c tia lá»­a sÃ¡ng.",
    energy: -1118,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_072",
    name: "Sáº¯t tÃ¡c dá»¥ng vá»›i LÆ°u huá»³nh",
    type: "combination",
    reactants: [
      { formula: "Fe", coeff: 1, name: "Sáº¯t" },
      { formula: "S", coeff: 1, name: "LÆ°u huá»³nh" }
    ],
    products: [
      { formula: "FeS", coeff: 1, name: "Sáº¯t(II) Sunfua" }
    ],
    equation: "Fe + S â†’(tÂ°) FeS",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Há»—n há»£p chÃ¡y sÃ¡ng, táº¡o cháº¥t ráº¯n mÃ u xÃ¡m Ä‘en.",
    energy: -100,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_073",
    name: "OxihÃ³a Sáº¯t(II) thÃ nh Sáº¯t(III) báº±ng Clo",
    type: "redox",
    reactants: [
      { formula: "FeClâ‚‚", coeff: 2, name: "Sáº¯t(II) Clorua" },
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" }
    ],
    products: [
      { formula: "FeClâ‚ƒ", coeff: 2, name: "Sáº¯t(III) Clorua" }
    ],
    equation: "2FeClâ‚‚ + Clâ‚‚ â†’ 2FeClâ‚ƒ",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Dung dá»‹ch xanh nháº¡t chuyá»ƒn sang mÃ u vÃ ng nÃ¢u.",
    energy: -170,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_074",
    name: "Khá»­ Sáº¯t(III) Oxit báº±ng CO (Luyá»‡n kim)",
    type: "redox",
    reactants: [
      { formula: "Feâ‚‚Oâ‚ƒ", coeff: 1, name: "Oxit sáº¯t(III)" },
      { formula: "CO", coeff: 3, name: "KhÃ­ Oxit Cacbon" }
    ],
    products: [
      { formula: "Fe", coeff: 2, name: "Sáº¯t" },
      { formula: "COâ‚‚", coeff: 3, name: "KhÃ­ Cacbonic" }
    ],
    equation: "Feâ‚‚Oâ‚ƒ + 3CO â†’(tÂ°) 2Fe + 3COâ‚‚",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ ráº¥t cao",
    observation: "Oxit mÃ u Ä‘á» nÃ¢u chuyá»ƒn sang mÃ u xÃ¡m cá»§a kim loáº¡i sáº¯t.",
    energy: -28,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
];
