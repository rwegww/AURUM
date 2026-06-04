export const reactionsCore = [
  // === Lá»šP 8 ===
  {
    id: "rx_001",
    name: "Tá»•ng há»£p nÆ°á»›c (Äá»‘t chÃ¡y Hâ‚‚)",
    type: "combination",
    reactants: [
      { formula: "Hâ‚‚", coeff: 2, name: "KhÃ­ Hydro" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "2Hâ‚‚ + Oâ‚‚ â†’ 2Hâ‚‚O",
    gradeLevel: 8,
    category: "Phi kim",
    conditions: "Äá»‘t chÃ¡y hoáº·c tia lá»­a Ä‘iá»‡n",
    observation: "Ngá»n lá»­a xanh nháº¡t, tiáº¿ng ná»• nháº¹. HÆ¡i nÆ°á»›c ngÆ°ng tá»¥ trÃªn thÃ nh á»‘ng nghiá»‡m.",
    energy: -571.66, // kJ/mol (tá»a nhiá»‡t máº¡nh)
    animation: "explosion",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_002",
    name: "Äá»‘t chÃ¡y Sáº¯t trong Oxy",
    type: "combination",
    reactants: [
      { formula: "Fe", coeff: 3, name: "Sáº¯t" },
      { formula: "Oâ‚‚", coeff: 2, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "Feâ‚ƒOâ‚„", coeff: 1, name: "Oxit sáº¯t tá»«" }
    ],
    equation: "3Fe + 2Oâ‚‚ â†’ Feâ‚ƒOâ‚„",
    gradeLevel: 8,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao (tÂ°)",
    observation: "Sáº¯t chÃ¡y sÃ¡ng chÃ³i, khÃ´ng cÃ³ ngá»n lá»­a, tÃ³e cÃ¡c tia lá»­a sÃ¡ng.",
    energy: -1118.4,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_003",
    name: "Káº½m tÃ¡c dá»¥ng vá»›i Axit Clohidric",
    type: "single-replacement",
    reactants: [
      { formula: "Zn", coeff: 1, name: "Káº½m" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "ZnClâ‚‚", coeff: 1, name: "Káº½m Clorua" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "Zn + 2HCl â†’ ZnClâ‚‚ + Hâ‚‚â†‘",
    gradeLevel: 8,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "ViÃªn káº½m tan dáº§n, bá»t khÃ­ khÃ´ng mÃ u thoÃ¡t ra máº¡nh máº½.",
    energy: -153.89,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_004",
    name: "Nung Ä‘Ã¡ vÃ´i (PhÃ¢n há»§y CaCOâ‚ƒ)",
    type: "decomposition",
    reactants: [
      { formula: "CaCOâ‚ƒ", coeff: 1, name: "ÄÃ¡ vÃ´i" }
    ],
    products: [
      { formula: "CaO", coeff: 1, name: "VÃ´i sá»‘ng" },
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" }
    ],
    equation: "CaCOâ‚ƒ â†’(tÂ°) CaO + COâ‚‚â†‘",
    gradeLevel: 8,
    category: "Oxit",
    conditions: "Nhiá»‡t Ä‘á»™ cao (~900Â°C)",
    observation: "ÄÃ¡ vÃ´i chuyá»ƒn thÃ nh bite tráº¯ng bite xá»‘p. KhÃ­ thoÃ¡t ra lÃ m Ä‘á»¥c nÆ°á»›c vÃ´i trong.",
    energy: 178.3, // Thu nhiá»‡t
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_005",
    name: "Natri pháº£n á»©ng vá»›i nÆ°á»›c",
    type: "single-replacement",
    reactants: [
      { formula: "Na", coeff: 2, name: "Natri" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "2Na + 2Hâ‚‚O â†’ 2NaOH + Hâ‚‚â†‘",
    gradeLevel: 8,
    category: "Kim loáº¡i kiá»m",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Natri nÃ³ng cháº£y thÃ nh viÃªn trÃ²n cháº¡y trÃªn máº·t nÆ°á»›c, tan nhanh vÃ  bá»‘c khÃ³i.",
    energy: -368.6,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  // === Lá»šP 9 ===
  {
    id: "rx_006",
    name: "Pháº£n á»©ng trung hÃ²a Axit-BazÆ¡",
    type: "double-replacement",
    reactants: [
      { formula: "HCl", coeff: 1, name: "Axit Clohidric" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "NaCl", coeff: 1, name: "Natri Clorua" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "HCl + NaOH â†’ NaCl + Hâ‚‚O",
    gradeLevel: 9,
    category: "Axit - BazÆ¡",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Pháº£n á»©ng tá»a nhiá»‡t. Náº¿u cÃ³ chá»‰ thá»‹ mÃ u sáº½ tháº¥y sá»± Ä‘á»•i mÃ u dung dá»‹ch.",
    energy: -57.32,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_007",
    name: "Sáº¯t Ä‘áº©y Äá»“ng ra khá»i muá»‘i",
    type: "single-replacement",
    reactants: [
      { formula: "Fe", coeff: 1, name: "Sáº¯t" },
      { formula: "CuSOâ‚„", coeff: 1, name: "Äá»“ng(II) Sunfat" }
    ],
    products: [
      { formula: "FeSOâ‚„", coeff: 1, name: "Sáº¯t(II) Sunfat" },
      { formula: "Cu", coeff: 1, name: "Äá»“ng" }
    ],
    equation: "Fe + CuSOâ‚„ â†’ FeSOâ‚„ + Cuâ†“",
    gradeLevel: 9,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Má»™t lá»›p kim loáº¡i mÃ u Ä‘á» (Cu) bÃ¡m ngoÃ i Ä‘inh sáº¯t. Dung dá»‹ch xanh lam nháº¡t dáº§n.",
    energy: -149.7,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_008",
    name: "Pháº£n á»©ng táº¡o káº¿t tá»§a Tráº¯ng",
    type: "double-replacement",
    reactants: [
      { formula: "BaClâ‚‚", coeff: 1, name: "Bari Clorua" },
      { formula: "Naâ‚‚SOâ‚„", coeff: 1, name: "Natri Sunfat" }
    ],
    products: [
      { formula: "BaSOâ‚„", coeff: 1, name: "Bari Sunfat" },
      { formula: "NaCl", coeff: 2, name: "Natri Clorua" }
    ],
    equation: "BaClâ‚‚ + Naâ‚‚SOâ‚„ â†’ BaSOâ‚„â†“ + 2NaCl",
    gradeLevel: 9,
    category: "Muá»‘i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Xuáº¥t hiá»‡n káº¿t tá»§a tráº¯ng (BaSOâ‚„) láº¯ng xuá»‘ng Ä‘Ã¡y á»‘ng nghiá»‡m.",
    energy: -24.5,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  // === Lá»šP 10-12 ===
  {
    id: "rx_009",
    name: "Tá»•ng há»£p Amoniac (Haber)",
    type: "combination",
    reactants: [
      { formula: "Nâ‚‚", coeff: 1, name: "KhÃ­ NitÆ¡" },
      { formula: "Hâ‚‚", coeff: 3, name: "KhÃ­ Hydro" }
    ],
    products: [
      { formula: "NHâ‚ƒ", coeff: 2, name: "Amoniac" }
    ],
    equation: "Nâ‚‚ + 3Hâ‚‚ â‡Œ 2NHâ‚ƒ",
    gradeLevel: 10,
    category: "Phi kim",
    conditions: "450-500Â°C, 200atm, xÃºc tÃ¡c Fe",
    observation: "KhÃ­ táº¡o thÃ nh cÃ³ mÃ¹i khai Ä‘áº·c trÆ°ng.",
    energy: -92.4,
    animation: "synthesis",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_010",
    name: "Pháº£n á»©ng chÃ¡y Metan",
    type: "combustion",
    reactants: [
      { formula: "CHâ‚„", coeff: 1, name: "KhÃ­ Metan" },
      { formula: "Oâ‚‚", coeff: 2, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "CHâ‚„ + 2Oâ‚‚ â†’ COâ‚‚ + 2Hâ‚‚O",
    gradeLevel: 11,
    category: "Há»¯u cÆ¡",
    conditions: "Äá»‘t chÃ¡y",
    observation: "Ngá»n lá»­a xanh nháº¹ tá»a nhiá»u nhiá»‡t. LÃ m Ä‘á»¥c nÆ°á»›c vÃ´i trong.",
    energy: -890.3,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_011",
    name: "Tá»•ng há»£p Axit Clohidric",
    type: "combination",
    reactants: [
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" },
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" }
    ],
    products: [
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    equation: "Hâ‚‚ + Clâ‚‚ â†’ 2HCl",
    gradeLevel: 8,
    category: "Axit",
    conditions: "Ãnh sÃ¡ng hoáº·c Nhiá»‡t Ä‘á»™",
    observation: "Há»—n há»£p khÃ­ ná»• nháº¹ (náº¿u tá»‰ lá»‡ 1:1), táº¡o khÃ³i tráº¯ng.",
    energy: -184.6,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_012",
    name: "PhÃ¢n há»§y thuá»‘c tÃ­m (KMnOâ‚„)",
    type: "decomposition",
    reactants: [
      { formula: "KMnOâ‚„", coeff: 2, name: "Kali Pemanganat" }
    ],
    products: [
      { formula: "Kâ‚‚MnOâ‚„", coeff: 1, name: "Kali Manganat" },
      { formula: "MnOâ‚‚", coeff: 1, name: "Mangan Äioxit" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    equation: "2KMnOâ‚„ â†’(tÂ°) Kâ‚‚MnOâ‚„ + MnOâ‚‚ + Oâ‚‚â†‘",
    gradeLevel: 9,
    category: "Muá»‘i",
    conditions: "Nhiá»‡t Ä‘á»™ cao (tÂ°)",
    observation: "Cháº¥t ráº¯n mÃ u tÃ­m Ä‘en phÃ¢n há»§y thÃ nh bá»™t mÃ u xanh Ä‘en vÃ  khÃ­ lÃ m que Ä‘á»‘m bÃ¹ng sÃ¡ng.",
    energy: 50,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_013",
    name: "Nhiá»‡t phÃ¢n Kali Clorat",
    type: "decomposition",
    reactants: [
      { formula: "KClOâ‚ƒ", coeff: 2, name: "Kali Clorat" }
    ],
    products: [
      { formula: "KCl", coeff: 2, name: "Kali Clorua" },
      { formula: "Oâ‚‚", coeff: 3, name: "KhÃ­ Oxy" }
    ],
    equation: "2KClOâ‚ƒ â†’(tÂ°, MnOâ‚‚) 2KCl + 3Oâ‚‚â†‘",
    gradeLevel: 10,
    category: "Muá»‘i",
    conditions: "Nhiá»‡t Ä‘á»™ cao, xÃºc tÃ¡c MnOâ‚‚",
    observation: "Cháº¥t ráº¯n cháº£y lá»ng, bá»t khÃ­ thoÃ¡t ra máº¡nh máº½ lÃ m que Ä‘á»‘m chÃ¡y sÃ¡ng.",
    energy: -45,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_014",
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
    gradeLevel: 8,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao (tÂ°)",
    observation: "Há»—n há»£p chÃ¡y sÃ¡ng máº¡nh, táº¡o cháº¥t ráº¯n mÃ u xÃ¡m Ä‘en.",
    energy: -100,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_015",
    name: "Tá»•ng há»£p Hydro Sunfua",
    type: "combination",
    reactants: [
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" },
      { formula: "S", coeff: 1, name: "LÆ°u huá»³nh" }
    ],
    products: [
      { formula: "Hâ‚‚S", coeff: 1, name: "Hydro Sunfua" }
    ],
    equation: "Hâ‚‚ + S â†’(tÂ°) Hâ‚‚S",
    gradeLevel: 10,
    category: "Phi kim",
    conditions: "Nhiá»‡t Ä‘á»™ cao (350-400Â°C)",
    observation: "KhÃ­ táº¡o thÃ nh cÃ³ mÃ¹i trá»©ng thá»‘i Ä‘áº·c trÆ°ng.",
    energy: -20,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_016",
    name: "MagiÃª chÃ¡y trong Oxy",
    type: "combination",
    reactants: [
      { formula: "Mg", coeff: 2, name: "MagiÃª" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "MgO", coeff: 2, name: "MagiÃª Oxit" }
    ],
    equation: "2Mg + Oâ‚‚ â†’(tÂ°) 2MgO",
    gradeLevel: 8,
    category: "Kim loáº¡i",
    conditions: "Äá»‘t chÃ¡y",
    observation: "MagiÃª chÃ¡y sÃ¡ng chÃ³i vá»›i ngá»n lá»­a tráº¯ng, táº¡o bá»™t tráº¯ng (MgO).",
    energy: -601,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_017",
    name: "Natri chÃ¡y trong Clo",
    type: "combination",
    reactants: [
      { formula: "Na", coeff: 2, name: "Natri" },
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" }
    ],
    products: [
      { formula: "NaCl", coeff: 2, name: "Natri Clorua" }
    ],
    equation: "2Na + Clâ‚‚ â†’(tÂ°) 2NaCl",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Natri nÃ³ng cháº£y vÃ  chÃ¡y trong khÃ­ clo vá»›i ngá»n lá»­a vÃ ng chÃ³i, táº¡o tinh thá»ƒ muá»‘i tráº¯ng.",
    energy: -411,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
];
