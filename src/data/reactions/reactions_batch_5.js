export const reactionsBatch5 = [
  // --- Bá»” SUNG KHá»I LÆ¯á»¢NG Lá»šN (BATCH 5: CÃ”NG NGHIá»†P & MÃ”I TRÆ¯á»œNG & NÃ‚NG CAO) ---
  {
    id: "rx_161",
    name: "Sáº£n xuáº¥t SOâ‚‚ tá»« quáº·ng Pirit sáº¯t",
    type: "redox",
    reactants: [
      { formula: "FeSâ‚‚", coeff: 4, name: "Pirit sáº¯t" },
      { formula: "Oâ‚‚", coeff: 11, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "Feâ‚‚Oâ‚ƒ", coeff: 2, name: "Oxit sáº¯t(III)" },
      { formula: "SOâ‚‚", coeff: 8, name: "LÆ°u huá»³nh Äioxit" }
    ],
    equation: "4FeSâ‚‚ + 11Oâ‚‚ â†’(tÂ°) 2Feâ‚‚Oâ‚ƒ + 8SOâ‚‚",
    gradeLevel: 10,
    category: "CÃ´ng nghiá»‡p",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Quáº·ng chÃ¡y máº¡nh, giáº£i phÃ³ng khÃ­ mÃ¹i háº¯c SOâ‚‚.",
    energy: -3400,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_162",
    name: "Oxy hÃ³a SOâ‚‚ (XÃºc tÃ¡c Vâ‚‚Oâ‚…)",
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
    category: "CÃ´ng nghiá»‡p",
    conditions: "450Â°C, xÃºc tÃ¡c Vâ‚‚Oâ‚…",
    observation: "Chuyá»ƒn hÃ³a khÃ­ SOâ‚‚ thÃ nh SOâ‚ƒ trong thÃ¡p tiáº¿p xÃºc.",
    energy: -198,
    animation: "synthesis",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_163",
    name: "HÃ²a tan SOâ‚ƒ vÃ o nÆ°á»›c (Táº¡o Hâ‚‚SOâ‚„)",
    type: "combination",
    reactants: [
      { formula: "SOâ‚ƒ", coeff: 1, name: "LÆ°u huá»³nh Trioxit" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Hâ‚‚SOâ‚„", coeff: 1, name: "Axit Sunfuric" }
    ],
    equation: "SOâ‚ƒ + Hâ‚‚O â†’ Hâ‚‚SOâ‚„",
    gradeLevel: 10,
    category: "CÃ´ng nghiá»‡p",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Pháº£n á»©ng tá»a nhiá»‡t cá»±c máº¡nh, táº¡o sÆ°Æ¡ng mÃ¹ axit.",
    energy: -130,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_164",
    name: "Sáº£n xuáº¥t NO tá»« Amoniac (Oxy hÃ³a NHâ‚ƒ)",
    type: "redox",
    reactants: [
      { formula: "NHâ‚ƒ", coeff: 4, name: "Amoniac" },
      { formula: "Oâ‚‚", coeff: 5, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "NO", coeff: 4, name: "NitÆ¡ Oxit" },
      { formula: "Hâ‚‚O", coeff: 6, name: "NÆ°á»›c" }
    ],
    equation: "4NHâ‚ƒ + 5Oâ‚‚ â†’(tÂ°, Pt) 4NO + 6Hâ‚‚O",
    gradeLevel: 11,
    category: "CÃ´ng nghiá»‡p",
    conditions: "850Â°C, xÃºc tÃ¡c Báº¡ch kim (Pt)",
    observation: "KhÃ­ Amoniac chÃ¡y trÃªn bá» máº·t lÆ°á»›i báº¡ch kim sÃ¡ng rá»±c.",
    energy: -905,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_165",
    name: "Oxy hÃ³a NO thÃ nh NOâ‚‚ (Tá»± nhiÃªn)",
    type: "combination",
    reactants: [
      { formula: "NO", coeff: 2, name: "NitÆ¡ Oxit" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "NOâ‚‚", coeff: 2, name: "NitÆ¡ Äioxit" }
    ],
    equation: "2NO + Oâ‚‚ â†’ 2NOâ‚‚",
    gradeLevel: 11,
    category: "MÃ´i trÆ°á»ng",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "KhÃ­ khÃ´ng mÃ u NO hÃ³a nÃ¢u ngay láº­p tá»©c khi tiáº¿p xÃºc khÃ´ng khÃ­.",
    energy: -114,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_166",
    name: "Sáº£n xuáº¥t HNOâ‚ƒ trong cÃ´ng nghiá»‡p",
    type: "redox",
    reactants: [
      { formula: "NOâ‚‚", coeff: 4, name: "NitÆ¡ Äioxit" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "HNOâ‚ƒ", coeff: 4, name: "Axit Nitric" }
    ],
    equation: "4NOâ‚‚ + Oâ‚‚ + 2Hâ‚‚O â†’ 4HNOâ‚ƒ",
    gradeLevel: 11,
    category: "CÃ´ng nghiá»‡p",
    conditions: "Háº¥p thá»¥ báº±ng nÆ°á»›c",
    observation: "KhÃ­ nÃ¢u Ä‘á» bá»‹ háº¥p thá»¥ táº¡o thÃ nh dung dá»‹ch axit khÃ´ng mÃ u.",
    energy: -250,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_167",
    name: "Pháº£n á»©ng nhiá»‡t nhÃ´m (Wholer)",
    type: "redox",
    reactants: [
      { formula: "Al", coeff: 2, name: "NhÃ´m" },
      { formula: "Feâ‚‚Oâ‚ƒ", coeff: 1, name: "Oxit sáº¯t(III)" }
    ],
    products: [
      { formula: "Alâ‚‚Oâ‚ƒ", coeff: 1, name: "NhÃ´m Oxit" },
      { formula: "Fe", coeff: 2, name: "Sáº¯t nÃ³ng cháº£y" }
    ],
    equation: "2Al + Feâ‚‚Oâ‚ƒ â†’(tÂ°) Alâ‚‚Oâ‚ƒ + 2Fe",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Má»“i báº±ng Mg hoáº·c nhiá»‡t Ä‘á»™ ráº¥t cao",
    observation: "Pháº£n á»©ng chÃ¡y sÃ¡ng chÃ³i nhÆ° phÃ¡o hoa, sáº¯t nÃ³ng cháº£y cháº£y ra.",
    energy: -850,
    animation: "explosion",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_168",
    name: "Äiá»u cháº¿ KhÃ­ Clo trong phÃ²ng thÃ­ nghiá»‡m",
    type: "redox",
    reactants: [
      { formula: "MnOâ‚‚", coeff: 1, name: "Mangan Äioxit" },
      { formula: "HCl", coeff: 4, name: "Axit Clohidric Ä‘áº·c" }
    ],
    products: [
      { formula: "MnClâ‚‚", coeff: 1, name: "Mangan(II) Clorua" },
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "MnOâ‚‚ + 4HCl(Ä‘) â†’(tÂ°) MnClâ‚‚ + Clâ‚‚â†‘ + 2Hâ‚‚O",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Äun nÃ³ng",
    observation: "Cháº¥t ráº¯n mÃ u Ä‘en tan dáº§n, giáº£i phÃ³ng khÃ­ mÃ u vÃ ng lá»¥c, mÃ¹i háº¯c.",
    energy: -30,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_169",
    name: "Natri Nitrat phÃ¢n há»§y nhiá»‡t (Táº¡o Oxy)",
    type: "decomposition",
    reactants: [
      { formula: "NaNOâ‚ƒ", coeff: 2, name: "Natri Nitrat" }
    ],
    products: [
      { formula: "NaNOâ‚‚", coeff: 2, name: "Natri Nitrit" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    equation: "2NaNOâ‚ƒ â†’(tÂ°) 2NaNOâ‚‚ + Oâ‚‚â†‘",
    gradeLevel: 11,
    category: "Muá»‘i",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Muá»‘i lá»ng ra, bá»t khÃ­ Oxy thoÃ¡t ra máº¡nh.",
    energy: 100,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_170",
    name: "Cacbon khá»­ nÆ°á»›c (Sáº£n xuáº¥t khÃ­ than Æ°á»›t)",
    type: "redox",
    reactants: [
      { formula: "C", coeff: 1, name: "Than Ä‘á»" },
      { formula: "Hâ‚‚O", coeff: 1, name: "HÆ¡i nÆ°á»›c" }
    ],
    products: [
      { formula: "CO", coeff: 1, name: "Cacbon Monoxit" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "C + Hâ‚‚O â‡Œ(tÂ°) CO + Hâ‚‚",
    gradeLevel: 11,
    category: "Cacbon",
    conditions: "Than nÃ³ng Ä‘á» (~1000Â°C)",
    observation: "Sáº£n xuáº¥t há»—n há»£p khÃ­ Ä‘á»‘t quan trá»ng trong cÃ´ng nghiá»‡p.",
    energy: 131,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_171",
    name: "Sáº¯t tÃ¡c dá»¥ng vá»›i nÆ°á»›c (Nhiá»‡t Ä‘á»™ cao)",
    type: "redox",
    reactants: [
      { formula: "Fe", coeff: 3, name: "Sáº¯t" },
      { formula: "Hâ‚‚O", coeff: 4, name: "HÆ¡i nÆ°á»›c" }
    ],
    products: [
      { formula: "Feâ‚ƒOâ‚„", coeff: 1, name: "Oxit sáº¯t tá»«" },
      { formula: "Hâ‚‚", coeff: 4, name: "KhÃ­ Hydro" }
    ],
    equation: "3Fe + 4Hâ‚‚O â†’(tÂ° < 570Â°C) Feâ‚ƒOâ‚„ + 4Hâ‚‚â†‘",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ dÆ°á»›i 570Â°C",
    observation: "Sáº¯t bá»‹ oxy hÃ³a bá»Ÿi hÆ¡i nÆ°á»›c giáº£i phÃ³ng Hydro.",
    energy: -150,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_172",
    name: "NhÃ´m tÃ¡c dá»¥ng vá»›i Iá»‘t (XÃºc tÃ¡c nÆ°á»›c)",
    type: "combination",
    reactants: [
      { formula: "Al", coeff: 2, name: "NhÃ´m" },
      { formula: "Iâ‚‚", coeff: 3, name: "Iá»‘t" }
    ],
    products: [
      { formula: "AlIâ‚ƒ", coeff: 2, name: "NhÃ´m Iotua" }
    ],
    equation: "2Al + 3Iâ‚‚ â†’(Hâ‚‚O) 2AlIâ‚ƒ",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "VÃ i giá»t nÆ°á»›c lÃ m xÃºc tÃ¡c",
    observation: "Pháº£n á»©ng bÃ¹ng chÃ¡y mÃ£nh liá»‡t, tá»a khÃ³i tÃ­m cá»§a Iá»‘t thÄƒng hoa.",
    energy: -600,
    animation: "explosion",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_173",
    name: "Thá»§y phÃ¢n SaccarozÆ¡ (á»¨ng dá»¥ng trÃ¡ng gÆ°Æ¡ng)",
    type: "double-replacement",
    reactants: [
      { formula: "Câ‚â‚‚Hâ‚‚â‚‚Oâ‚â‚", coeff: 1, name: "SaccarozÆ¡" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚â‚‚Oâ‚†", coeff: 1, name: "GlucozÆ¡" },
      { formula: "Câ‚†Hâ‚â‚‚Oâ‚†", coeff: 1, name: "FructozÆ¡" }
    ],
    equation: "Câ‚â‚‚Hâ‚‚â‚‚Oâ‚â‚ + Hâ‚‚O â†’(Hâº, tÂ°) GlucozÆ¡ + FructozÆ¡",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Axit, nhiá»‡t Ä‘á»™",
    observation: "Chuyá»ƒn Ä‘Æ°á»ng khÃ´ng khá»­ thÃ nh há»—n há»£p Ä‘Æ°á»ng cÃ³ tÃ­nh khá»­.",
    energy: -15,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_174",
    name: "Pháº£n á»©ng chÃ¡y cá»§a Photphin (Ma trÆ¡i)",
    type: "redox",
    reactants: [
      { formula: "PHâ‚ƒ", coeff: 2, name: "Photphin" },
      { formula: "Oâ‚‚", coeff: 4, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "Pâ‚‚Oâ‚…", coeff: 1, name: "Diphotpho Pentaoxit" },
      { formula: "Hâ‚‚O", coeff: 3, name: "NÆ°á»›c" }
    ],
    equation: "2PHâ‚ƒ + 4Oâ‚‚ â†’ Pâ‚‚Oâ‚… + 3Hâ‚‚O",
    gradeLevel: 11,
    category: "Photpho",
    conditions: "Tá»± chÃ¡y trong khÃ´ng khÃ­",
    observation: "Ãnh sÃ¡ng xanh má» áº£o Ä‘áº·c trÆ°ng cá»§a hiá»‡n tÆ°á»£ng ma trÆ¡i.",
    energy: -1200,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_175",
    name: "Axit Nitric Ä‘áº·c nguá»™i lÃ m thá»¥ Ä‘á»™ng NhÃ´m",
    type: "redox",
    reactants: [
      { formula: "Al", coeff: 1, name: "NhÃ´m" },
      { formula: "HNOâ‚ƒ", coeff: 1, name: "HNOâ‚ƒ Ä‘áº·c nguá»™i" }
    ],
    products: [
      { formula: "Al-Passivated", coeff: 1, name: "Lá»›p mÃ ng oxit báº£o vá»‡" }
    ],
    equation: "Al + HNOâ‚ƒ(Ä‘, nguá»™i) â†’ (Thá»¥ Ä‘á»™ng hÃ³a)",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ tháº¥p, axit Ä‘áº·c",
    observation: "NhÃ´m khÃ´ng tan, bá» máº·t trÆ¡ vá»›i axit do lá»›p oxit cá»±c má»ng báº£o vá»‡.",
    energy: 0,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_176",
    name: "Sáº£n xuáº¥t AmÃ´ni Sunfat (PhÃ¢n bÃ³n)",
    type: "double-replacement",
    reactants: [
      { formula: "NHâ‚ƒ", coeff: 2, name: "Amoniac" },
      { formula: "Hâ‚‚SOâ‚„", coeff: 1, name: "Axit Sunfuric" }
    ],
    products: [
      { formula: "(NHâ‚„)â‚‚SOâ‚„", coeff: 1, name: "AmÃ´ni Sunfat" }
    ],
    equation: "2NHâ‚ƒ + Hâ‚‚SOâ‚„ â†’ (NHâ‚„)â‚‚SOâ‚„",
    gradeLevel: 11,
    category: "PhÃ¢n bÃ³n",
    conditions: "Nhiá»‡t Ä‘á»™ phÃ²ng",
    observation: "Dung dá»‹ch khÃ´ng mÃ u, cÃ´ cáº¡n táº¡o tinh thá»ƒ muá»‘i tráº¯ng.",
    energy: -120,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_177",
    name: "Pháº£n á»©ng cá»§a Cu vá»›i Hâ‚‚SOâ‚„ Ä‘áº·c nÃ³ng",
    type: "redox",
    reactants: [
      { formula: "Cu", coeff: 1, name: "Äá»“ng" },
      { formula: "Hâ‚‚SOâ‚„", coeff: 2, name: "Axit Ä‘áº·c" }
    ],
    products: [
      { formula: "CuSOâ‚„", coeff: 1, name: "Äá»“ng(II) Sunfat" },
      { formula: "SOâ‚‚", coeff: 1, name: "KhÃ­ SunfurÆ¡" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "Cu + 2Hâ‚‚SOâ‚„(Ä‘) â†’(tÂ°) CuSOâ‚„ + SOâ‚‚â†‘ + 2Hâ‚‚O",
    gradeLevel: 10,
    category: "LÆ°u huá»³nh",
    conditions: "Äun nÃ³ng",
    observation: "Äá»“ng tan, dung dá»‹ch chuyá»ƒn xanh lam, khÃ­ mÃ¹i háº¯c thoÃ¡t ra.",
    energy: -180,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_178",
    name: "Oxy hÃ³a Ancol Etylic báº±ng CuO",
    type: "redox",
    reactants: [
      { formula: "Câ‚‚Hâ‚…OH", coeff: 1, name: "RÆ°á»£u Etylic" },
      { formula: "CuO", coeff: 1, name: "Äá»“ng(II) Oxit" }
    ],
    products: [
      { formula: "CHâ‚ƒCHO", coeff: 1, name: "Andehit Axetic" },
      { formula: "Cu", coeff: 1, name: "Äá»“ng" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "Câ‚‚Hâ‚…OH + CuO â†’(tÂ°) CHâ‚ƒCHO + Cu + Hâ‚‚O",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "DÃ¢y Ä‘á»“ng oxit nÃ³ng Ä‘á»",
    observation: "DÃ¢y Ä‘á»“ng mÃ u Ä‘en chuyá»ƒn sang mÃ u Ä‘á» kim loáº¡i, cÃ³ mÃ¹i xá»‘c cá»§a andehit.",
    energy: -50,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_179",
    name: "Phenol tÃ¡c dá»¥ng vá»›i nÆ°á»›c Brom (Nháº­n biáº¿t)",
    type: "double-replacement",
    reactants: [
      { formula: "Câ‚†Hâ‚…OH", coeff: 1, name: "Phenol" },
      { formula: "Brâ‚‚", coeff: 3, name: "NÆ°á»›c Brom" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚‚Brâ‚ƒOH", coeff: 1, name: "2,4,6-Tribromphenol" },
      { formula: "HBr", coeff: 3, name: "Hydro Bromua" }
    ],
    equation: "Câ‚†Hâ‚…OH + 3Brâ‚‚ â†’ Câ‚†Hâ‚‚Brâ‚ƒOHâ†“ + 3HBr",
    gradeLevel: 11,
    category: "Phenol",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Dung dá»‹ch brom máº¥t mÃ u, xuáº¥t hiá»‡n káº¿t tá»§a tráº¯ng tinh.",
    energy: -95,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_180",
    name: "TrÃ¹ng há»£p Isopren (Táº¡o cao su thiÃªn nhiÃªn)",
    type: "combination",
    reactants: [
      { formula: "Câ‚…Hâ‚ˆ", coeff: 1, name: "Isopren" }
    ],
    products: [
      { formula: "(Câ‚…Hâ‚ˆ)n", coeff: 1, name: "Cao su Isopren" }
    ],
    equation: "nCHâ‚‚=C(CHâ‚ƒ)-CH=CHâ‚‚ â†’ (-CHâ‚‚-C(CHâ‚ƒ)=CH-CHâ‚‚-)n",
    gradeLevel: 12,
    category: "Polyme",
    conditions: "XÃºc tÃ¡c Ziegler-Natta",
    observation: "Cháº¥t lá»ng chuyá»ƒn thÃ nh khá»‘i dáº»o Ä‘Ã n há»“i.",
    energy: -110,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_181",
    name: "Sáº£n xuáº¥t VÃ´i trong lÃ² thá»§ cÃ´ng",
    type: "decomposition",
    reactants: [
      { formula: "CaCOâ‚ƒ", coeff: 1, name: "ÄÃ¡ vÃ´i" },
      { formula: "C", coeff: 1, name: "Than (nhiÃªn liá»‡u)" }
    ],
    products: [
      { formula: "CaO", coeff: 1, name: "VÃ´i sá»‘ng" },
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ tháº£i" }
    ],
    equation: "CaCOâ‚ƒ â†’(tÂ°) CaO + COâ‚‚",
    gradeLevel: 9,
    category: "CÃ´ng nghiá»‡p",
    conditions: "Nhiá»‡t Ä‘á»™ > 900Â°C",
    observation: "Sáº£n xuáº¥t vÃ´i sá»‘ng quy mÃ´ lá»›n phá»¥c vá»¥ xÃ¢y dá»±ng.",
    energy: 178,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_182",
    name: "HÃ²a tan SiOâ‚‚ báº±ng HF (Kháº¯c thá»§y tinh)",
    type: "double-replacement",
    reactants: [
      { formula: "SiOâ‚‚", coeff: 1, name: "CÃ¡t/Thá»§y tinh" },
      { formula: "HF", coeff: 4, name: "Axit Floridric" }
    ],
    products: [
      { formula: "SiFâ‚„", coeff: 1, name: "Silic Tetraflorua" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "SiOâ‚‚ + 4HF â†’ SiFâ‚„â†‘ + 2Hâ‚‚O",
    gradeLevel: 11,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ phÃ²ng",
    observation: "Thá»§y tinh bá»‹ Äƒn mÃ²n máº¡nh, dÃ¹ng Ä‘á»ƒ kháº¯c chá»¯ lÃªn thá»§y tinh.",
    energy: -150,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_183",
    name: "Äá»‘t chÃ¡y Magie trong khÃ­ Cacbonic",
    type: "redox",
    reactants: [
      { formula: "Mg", coeff: 2, name: "MagiÃª" },
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" }
    ],
    products: [
      { formula: "MgO", coeff: 2, name: "MagiÃª Oxit" },
      { formula: "C", coeff: 1, name: "Than (Muá»™i Ä‘en)" }
    ],
    equation: "2Mg + COâ‚‚ â†’(tÂ°) 2MgO + C",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Mg Ä‘ang chÃ¡y",
    observation: "Mg váº«n chÃ¡y máº¡nh trong COâ‚‚, táº¡o bá»™t tráº¯ng vÃ  muá»™i than Ä‘en.",
    energy: -810,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_184",
    name: "Pháº£n á»©ng cá»§a Glyxin vá»›i NaOH",
    type: "double-replacement",
    reactants: [
      { formula: "Gly", coeff: 1, name: "Glyxin" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Gly-Na", coeff: 1, name: "Natri GlyxinÃ¡t" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "Hâ‚‚NCHâ‚‚COOH + NaOH â†’ Hâ‚‚NCHâ‚‚COONa + Hâ‚‚O",
    gradeLevel: 12,
    category: "Amino Acid",
    conditions: "Nhiá»‡t Ä‘á»™ phÃ²ng",
    observation: "Glyxin tan trong kiá»m táº¡o muá»‘i tan.",
    energy: -55,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_185",
    name: "Pháº£n á»©ng cá»§a Glyxin vá»›i HCl",
    type: "combination",
    reactants: [
      { formula: "Gly", coeff: 1, name: "Glyxin" },
      { formula: "HCl", coeff: 1, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "Gly-HCl", coeff: 1, name: "Glyxin Hidroclorua" }
    ],
    equation: "Hâ‚‚NCHâ‚‚COOH + HCl â†’ Clâ»Hâ‚ƒNâºCHâ‚‚COOH",
    gradeLevel: 12,
    category: "Amino Acid",
    conditions: "Nhiá»‡t Ä‘á»™ phÃ²ng",
    observation: "Thá»ƒ hiá»‡n tÃ­nh lÆ°á»¡ng tÃ­nh cá»§a amino acid.",
    energy: -40,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_186",
    name: "Sáº¯t tÃ¡c dá»¥ng vá»›i Dung dá»‹ch muá»‘i Ä‘á»“ng",
    type: "single-replacement",
    reactants: [
      { formula: "Fe", coeff: 1, name: "Sáº¯t" },
      { formula: "CuClâ‚‚", coeff: 1, name: "Äá»“ng(II) Clorua" }
    ],
    products: [
      { formula: "FeClâ‚‚", coeff: 1, name: "Sáº¯t(II) Clorua" },
      { formula: "Cu", coeff: 1, name: "Äá»“ng" }
    ],
    equation: "Fe + CuClâ‚‚ â†’ FeClâ‚‚ + Cuâ†“",
    gradeLevel: 9,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Kim loáº¡i mÃ u Ä‘á» bÃ¡m trÃªn sáº¯t, dung dá»‹ch xanh lam nháº¡t dáº§n.",
    energy: -150,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_187",
    name: "NhÃ´m tÃ¡c dá»¥ng vá»›i Dung dá»‹ch muá»‘i sáº¯t(III)",
    type: "single-replacement",
    reactants: [
      { formula: "Al", coeff: 1, name: "NhÃ´m" },
      { formula: "FeClâ‚ƒ", coeff: 1, name: "Sáº¯t(III) Clorua" }
    ],
    products: [
      { formula: "AlClâ‚ƒ", coeff: 1, name: "NhÃ´m Clorua" },
      { formula: "FeClâ‚‚", coeff: 1, name: "Sáº¯t(II) Clorua" }
    ],
    equation: "Al + 3FeClâ‚ƒ â†’ AlClâ‚ƒ + 3FeClâ‚‚",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "NhÃ´m tan dáº§n, dung dá»‹ch thay Ä‘á»•i mÃ u sáº¯c.",
    energy: -320,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_188",
    name: "Cacbon Monoxit chÃ¡y (KhÃ­ lÃ² ga)",
    type: "redox",
    reactants: [
      { formula: "CO", coeff: 2, name: "Cacbon Monoxit" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "COâ‚‚", coeff: 2, name: "KhÃ­ Cacbonic" }
    ],
    equation: "2CO + Oâ‚‚ â†’(tÂ°) 2COâ‚‚",
    gradeLevel: 9,
    category: "Cacbon",
    conditions: "Äá»‘t chÃ¡y",
    observation: "Ngá»n lá»­a mÃ u xanh lam ráº¥t Ä‘áº¹p, tá»a nhiá»u nhiá»‡t.",
    energy: -566,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_189",
    name: "Äiá»u cháº¿ KhÃ­ Oxy báº±ng Hâ‚‚Oâ‚‚",
    type: "decomposition",
    reactants: [
      { formula: "Hâ‚‚Oâ‚‚", coeff: 2, name: "Oxy giÃ " }
    ],
    products: [
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    equation: "2Hâ‚‚Oâ‚‚ â†’(MnOâ‚‚) 2Hâ‚‚O + Oâ‚‚â†‘",
    gradeLevel: 8,
    category: "Oxi",
    conditions: "XÃºc tÃ¡c MnOâ‚‚",
    observation: "Dung dá»‹ch sá»§i bá»t khÃ­ Oxy máº¡nh máº½.",
    energy: -196,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_190",
    name: "Káº¿t tá»§a NhÃ´m Hidroxit báº±ng NHâ‚ƒ",
    type: "double-replacement",
    reactants: [
      { formula: "AlClâ‚ƒ", coeff: 1, name: "NhÃ´m Clorua" },
      { formula: "NHâ‚ƒ", coeff: 3, name: "Amoniac" },
      { formula: "Hâ‚‚O", coeff: 3, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Al(OH)â‚ƒ", coeff: 1, name: "NhÃ´m Hidroxit" },
      { formula: "NHâ‚„Cl", coeff: 3, name: "AmÃ´ni Clorua" }
    ],
    equation: "AlClâ‚ƒ + 3NHâ‚ƒ + 3Hâ‚‚O â†’ Al(OH)â‚ƒâ†“ + 3NHâ‚„Cl",
    gradeLevel: 11,
    category: "PhÃ¢n tÃ­ch Ä‘á»‹nh tÃ­nh",
    conditions: "Dung dá»‹ch NHâ‚ƒ",
    observation: "Káº¿t tá»§a tráº¯ng dáº¡ng keo xuáº¥t hiá»‡n vÃ  khÃ´ng tan trong NHâ‚ƒ dÆ°.",
    energy: -45,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_191",
    name: "Pháº£n á»©ng giá»¯a khÃ­ Clo vÃ  dung dá»‹ch NaOH nguá»™i",
    type: "redox",
    reactants: [
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" },
      { formula: "NaOH", coeff: 2, name: "Kiá»m nguá»™i" }
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
    observation: "Sáº£n xuáº¥t nÆ°á»›c Gia-ven cÃ³ tÃ­nh táº©y mÃ u máº¡nh.",
    energy: -100,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_192",
    name: "Pháº£n á»©ng giá»¯a khÃ­ Clo vÃ  dung dá»‹ch NaOH nÃ³ng",
    type: "redox",
    reactants: [
      { formula: "Clâ‚‚", coeff: 3, name: "KhÃ­ Clo" },
      { formula: "NaOH", coeff: 6, name: "Kiá»m nÃ³ng" }
    ],
    products: [
      { formula: "NaCl", coeff: 5, name: "Natri Clorua" },
      { formula: "NaClOâ‚ƒ", coeff: 1, name: "Natri Clorat" },
      { formula: "Hâ‚‚O", coeff: 3, name: "NÆ°á»›c" }
    ],
    equation: "3Clâ‚‚ + 6NaOH â†’(tÂ°) 5NaCl + NaClOâ‚ƒ + 3Hâ‚‚O",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ ~70Â°C",
    observation: "MÃ u vÃ ng cá»§a clo biáº¿n máº¥t nhanh hÆ¡n so vá»›i Ä‘iá»u kiá»‡n thÆ°á»ng.",
    energy: -250,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_193",
    name: "Thá»§y phÃ¢n Tinh bá»™t thÃ nh ÄÆ°á»ng",
    type: "double-replacement",
    reactants: [
      { formula: "Starch", coeff: 1, name: "Tinh bá»™t" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚â‚‚Oâ‚†", coeff: 1, name: "GlucozÆ¡" }
    ],
    equation: "(Câ‚†Hâ‚â‚€Oâ‚…)n + nHâ‚‚O â†’ nCâ‚†Hâ‚â‚‚Oâ‚†",
    gradeLevel: 9,
    category: "Carbohydrate",
    conditions: "XÃºc tÃ¡c Axit, tÂ°",
    observation: "Bá»™t tráº¯ng biáº¿n thÃ nh dung dá»‹ch Ä‘Æ°á»ng cÃ³ vá»‹ ngá»t.",
    energy: -5,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_194",
    name: "Pháº£n á»©ng tháº¿ cá»§a Benzen vá»›i Brâ‚‚ (CÃ³ bá»™t sáº¯t)",
    type: "single-replacement",
    reactants: [
      { formula: "Câ‚†Hâ‚†", coeff: 1, name: "Benzen" },
      { formula: "Brâ‚‚", coeff: 1, name: "Brom lá»ng" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚…Br", coeff: 1, name: "Brombenzen" },
      { formula: "HBr", coeff: 1, name: "Hydro Bromua" }
    ],
    equation: "Câ‚†Hâ‚† + Brâ‚‚ â†’(Fe, tÂ°) Câ‚†Hâ‚…Br + HBr",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "XÃºc tÃ¡c bá»™t Fe, Ä‘un nÃ³ng",
    observation: "MÃ u Ä‘á» nÃ¢u cá»§a brom nháº¡t dáº§n, cÃ³ khÃ­ HBr thoÃ¡t ra.",
    energy: -45,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_195",
    name: "Sáº£n xuáº¥t Photpho trong lÃ² Ä‘iá»‡n",
    type: "redox",
    reactants: [
      { formula: "Caâ‚ƒ(POâ‚„)â‚‚", coeff: 1, name: "Quáº·ng Photphorit" },
      { formula: "SiOâ‚‚", coeff: 3, name: "CÃ¡t" },
      { formula: "C", coeff: 5, name: "Than cá»‘c" }
    ],
    products: [
      { formula: "CaSiOâ‚ƒ", coeff: 3, name: "Canxi Silicat" },
      { formula: "CO", coeff: 5, name: "Cacbon Monoxit" },
      { formula: "P", coeff: 2, name: "Photpho" }
    ],
    equation: "Caâ‚ƒ(POâ‚„)â‚‚ + 3SiOâ‚‚ + 5C â†’ 3CaSiOâ‚ƒ + 5CO + 2P",
    gradeLevel: 11,
    category: "Photpho",
    conditions: "Nhiá»‡t Ä‘á»™ 1200Â°C trong lÃ² Ä‘iá»‡n",
    observation: "HÆ¡i photpho thoÃ¡t ra vÃ  Ä‘Æ°á»£c ngÆ°ng tá»¥ dÆ°á»›i nÆ°á»›c.",
    energy: 1500,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_196",
    name: "Thá»§y phÃ¢n dáº«n xuáº¥t Clo cá»§a Benzen",
    type: "redox",
    reactants: [
      { formula: "Câ‚†Hâ‚…Cl", coeff: 1, name: "Clorbenzen" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚…OH", coeff: 1, name: "Phenol" },
      { formula: "NaCl", coeff: 1, name: "Natri Clorua" }
    ],
    equation: "Câ‚†Hâ‚…Cl + NaOH â†’(tÂ°, p) Câ‚†Hâ‚…OH + NaCl",
    gradeLevel: 11,
    category: "Há»¯u cÆ¡",
    conditions: "Nhiá»‡t Ä‘á»™ vÃ  Ã¡p suáº¥t ráº¥t cao",
    observation: "Dáº«n xuáº¥t halogen cá»§a vÃ²ng thÆ¡m khÃ³ thá»§y phÃ¢n hÆ¡n so vá»›i dáº«n xuáº¥t no.",
    energy: 200,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_197",
    name: "Phenol tÃ¡c dá»¥ng vá»›i Natri",
    type: "single-replacement",
    reactants: [
      { formula: "Câ‚†Hâ‚…OH", coeff: 2, name: "Phenol nÃ³ng cháº£y" },
      { formula: "Na", coeff: 2, name: "Natri" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚…ONa", coeff: 2, name: "Natri Phenolat" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "2Câ‚†Hâ‚…OH + 2Na â†’ 2Câ‚†Hâ‚…ONa + Hâ‚‚â†‘",
    gradeLevel: 11,
    category: "Phenol",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng (Phenol nÃ³ng cháº£y)",
    observation: "CÃ³ bá»t khÃ­ Hydro thoÃ¡t ra, thá»ƒ hiá»‡n tÃ­nh axit yáº¿u cá»§a phenol.",
    energy: -140,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_198",
    name: "Sáº£n xuáº¥t PVC tá»« Axetilen",
    type: "combination",
    reactants: [
      { formula: "Câ‚‚Hâ‚‚", coeff: 1, name: "Axetilen" },
      { formula: "HCl", coeff: 1, name: "Hydro Clo" }
    ],
    products: [
      { formula: "Câ‚‚Hâ‚ƒCl", coeff: 1, name: "Vinyl Clorua" }
    ],
    equation: "CHâ‰¡CH + HCl â†’(150-200Â°C, HgClâ‚‚) CHâ‚‚=CHCl",
    gradeLevel: 12,
    category: "CÃ´ng nghiá»‡p",
    conditions: "XÃºc tÃ¡c HgClâ‚‚",
    observation: "Chuyá»ƒn hÃ³a khÃ­ axetilen thÃ nh nguyÃªn liá»‡u sáº£n xuáº¥t nhá»±a.",
    energy: -85,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_199",
    name: "Pháº£n á»©ng chÃ¡y cá»§a Propane (KhÃ­ gas gia Ä‘Ã¬nh)",
    type: "combustion",
    reactants: [
      { formula: "Câ‚ƒHâ‚ˆ", coeff: 1, name: "KhÃ­ Propane" },
      { formula: "Oâ‚‚", coeff: 5, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "COâ‚‚", coeff: 3, name: "KhÃ­ Cacbonic" },
      { formula: "Hâ‚‚O", coeff: 4, name: "NÆ°á»›c" }
    ],
    equation: "Câ‚ƒHâ‚ˆ + 5Oâ‚‚ â†’ 3COâ‚‚ + 4Hâ‚‚O",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Äá»‘t chÃ¡y",
    observation: "Tá»a nhiá»‡t lÆ°á»£ng cá»±c lá»›n, dÃ¹ng trong báº¿p ga sinh hoáº¡t.",
    energy: -2220,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_200",
    name: "Nháº­n biáº¿t GlucozÆ¡ báº±ng Agâ‚‚O/NHâ‚ƒ (TrÃ¡ng gÆ°Æ¡ng)",
    type: "redox",
    reactants: [
      { formula: "Câ‚†Hâ‚â‚‚Oâ‚†", coeff: 1, name: "GlucozÆ¡" },
      { formula: "Agâ‚‚O", coeff: 1, name: "Báº¡c Oxit (trong NHâ‚ƒ)" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚â‚‚Oâ‚‡", coeff: 1, name: "Axit Gluconic" },
      { formula: "Ag", coeff: 2, name: "Báº¡c kim loáº¡i" }
    ],
    equation: "CHâ‚‚OH(CHOH)â‚„CHO + Agâ‚‚O â†’(NHâ‚ƒ, tÂ°) Axit Gluconic + 2Agâ†“",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Dung dá»‹ch AgNOâ‚ƒ/NHâ‚ƒ (Tollens)",
    observation: "Xuáº¥t hiá»‡n lá»›p báº¡c sÃ¡ng bÃ³ng nhÆ° gÆ°Æ¡ng bÃ¡m vÃ o thÃ nh á»‘ng nghiá»‡m.",
    energy: -200,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_201",
    name: "Hiá»‡u á»©ng NhÃ  kÃ­nh (ChÃ¡y rá»«ng/NhiÃªn liá»‡u)",
    type: "combustion",
    reactants: [
      { formula: "Wood", coeff: 1, name: "Sinh khá»‘i/Gá»—" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" }
    ],
    equation: "CÃ¡c nguá»“n C + Oâ‚‚ â†’ COâ‚‚ (PhÃ¡t tháº£i lá»›n)",
    gradeLevel: 10,
    category: "MÃ´i trÆ°á»ng",
    conditions: "Äá»‘t chÃ¡y",
    observation: "Tháº£i ra lÆ°á»£ng lá»›n COâ‚‚, gÃ³p pháº§n gÃ¢y áº¥m lÃªn toÃ n cáº§u.",
    energy: -300,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_202",
    name: "MÆ°a axit (Oxy hÃ³a LÆ°u huá»³nh Ä‘iÃ´xit)",
    type: "redox",
    reactants: [
      { formula: "SOâ‚‚", coeff: 2, name: "SOâ‚‚ (KhÃ­ tháº£i)" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" },
      { formula: "Hâ‚‚O", coeff: 2, name: "HÆ¡i nÆ°á»›c" }
    ],
    products: [
      { formula: "Hâ‚‚SOâ‚„", coeff: 2, name: "Axit Sunfuric (MÆ°a)" }
    ],
    equation: "2SOâ‚‚ + Oâ‚‚ + 2Hâ‚‚O â†’ 2Hâ‚‚SOâ‚„",
    gradeLevel: 10,
    category: "MÃ´i trÆ°á»ng",
    conditions: "Ãnh sÃ¡ng, sÆ°Æ¡ng mÃ¹",
    observation: "NÆ°á»›c mÆ°a cÃ³ Ä‘á»™ pH tháº¥p, lÃ m mÃ²n cÃ¡c cÃ´ng trÃ¬nh Ä‘Ã¡ vÃ´i.",
    energy: -380,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_203",
    name: "PhÃ¢n há»§y rÃ¡c tháº£i há»¯u cÆ¡ (Táº¡o Metan)",
    type: "decomposition",
    reactants: [
      { formula: "Waste", coeff: 1, name: "RÃ¡c há»¯u cÆ¡" }
    ],
    products: [
      { formula: "CHâ‚„", coeff: 1, name: "KhÃ­ Biogas" }
    ],
    equation: "Há»£p cháº¥t há»¯u cÆ¡ â†’(vi sinh yáº¿m khÃ­) CHâ‚„ + ...",
    gradeLevel: 11,
    category: "MÃ´i trÆ°á»ng",
    conditions: "MÃ´i trÆ°á»ng yáº¿m khÃ­",
    observation: "Táº¡o ra khÃ­ metan cÃ³ thá»ƒ dÃ¹ng lÃ m cháº¥t Ä‘á»‘t (biogas).",
    energy: -40,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_204",
    name: "Nháº­n biáº¿t Saponin (Trong Bá»“ káº¿t/XÃ  phÃ²ng)",
    type: "combination",
    reactants: [
      { formula: "Saponin", coeff: 1, name: "Dá»‹ch bá»“ káº¿t" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Foam", coeff: 1, name: "Lá»›p bá»t bá»n" }
    ],
    equation: "Saponin + NÆ°á»›c (Láº¯c máº¡nh) â†’ Bá»t",
    gradeLevel: 12,
    category: "Há»¯u cÆ¡",
    conditions: "Láº¯c máº¡nh",
    observation: "Táº¡o ra lá»›p bá»t ráº¥t bá»n vÃ  má»‹n.",
    energy: -5,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_205",
    name: "Thá»§y phÃ¢n Protein báº±ng Enzyme (TiÃªu hÃ³a)",
    type: "double-replacement",
    reactants: [
      { formula: "Protein", coeff: 1, name: "Thá»‹t/CÃ¡" },
      { formula: "Enzyme", coeff: 1, name: "Men tiÃªu hÃ³a" }
    ],
    products: [
      { formula: "Peptides", coeff: 2, name: "DÆ°á»¡ng cháº¥t" }
    ],
    equation: "Protein + Hâ‚‚O â†’(enzyme) Amino acids",
    gradeLevel: 12,
    category: "Protein",
    conditions: "37Â°C, pH thÃ­ch há»£p",
    observation: "CÃ¡c phÃ¢n tá»­ protein lá»›n vá»¡ ra thÃ nh cÃ¡c máº£nh nhá» dá»… háº¥p thá»¥.",
    energy: -10,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_301",
    name: "Äá»‘t chÃ¡y Cacbon",
    type: "combination",
    reactants: [
      { formula: "C", coeff: 1, name: "Cacbon" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" }
    ],
    equation: "C + Oâ‚‚ â†’(tÂ°) COâ‚‚",
    gradeLevel: 8,
    category: "Phi kim",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Than chÃ¡y sÃ¡ng, tá»a nhiá»u nhiá»‡t, khÃ´ng cÃ³ ngá»n lá»­a.",
    energy: -393.5,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n",
    isBlocked: false
  },
  {
    id: "rx_302",
    name: "Canxi tÃ¡c dá»¥ng vá»›i nÆ°á»›c",
    type: "single-replacement",
    reactants: [
      { formula: "Ca", coeff: 1, name: "Canxi" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Ca(OH)â‚‚", coeff: 1, name: "Canxi Hidroxit" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "Ca + 2Hâ‚‚O â†’ Ca(OH)â‚‚ + Hâ‚‚â†‘",
    gradeLevel: 9,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Canxi tan dáº§n, sá»§i bá»t khÃ­ máº¡nh, dung dá»‹ch trá»Ÿ nÃªn Ä‘á»¥c.",
    energy: -413,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n",
    isBlocked: false
  },
  {
    id: "rx_303",
    name: "Äá»‘t chÃ¡y Canxi",
    type: "combination",
    reactants: [
      { formula: "Ca", coeff: 2, name: "Canxi" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "CaO", coeff: 2, name: "VÃ´i sá»‘ng" }
    ],
    equation: "2Ca + Oâ‚‚ â†’(tÂ°) 2CaO",
    gradeLevel: 8,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Canxi chÃ¡y vá»›i ngá»n lá»­a Ä‘á» cam Ä‘áº·c trÆ°ng, táº¡o cháº¥t ráº¯n mÃ u tráº¯ng.",
    energy: -1270,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n",
    isBlocked: false
  },
  {
    id: "rx_304",
    name: "Liti tÃ¡c dá»¥ng vá»›i nÆ°á»›c",
    type: "single-replacement",
    reactants: [
      { formula: "Li", coeff: 2, name: "Liti" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "LiOH", coeff: 2, name: "Liti Hidroxit" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "2Li + 2Hâ‚‚O â†’ 2LiOH + Hâ‚‚â†‘",
    gradeLevel: 10,
    category: "Kim loáº¡i kiá»m",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Liti tan cháº­m hÆ¡n Natri, sá»§i bá»t khÃ­ khÃ´ng mÃ u.",
    energy: -444,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n",
    isBlocked: false
  },
  {
    id: "rx_305",
    name: "Kali tÃ¡c dá»¥ng vá»›i nÆ°á»›c",
    type: "single-replacement",
    reactants: [
      { formula: "K", coeff: 2, name: "Kali" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "KOH", coeff: 2, name: "Kali Hidroxit" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "2K + 2Hâ‚‚O â†’ 2KOH + Hâ‚‚â†‘",
    gradeLevel: 8,
    category: "Kim loáº¡i kiá»m",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Kali pháº£n á»©ng cá»±c máº¡nh, tá»± bÃ¹ng chÃ¡y vá»›i ngá»n lá»­a mÃ u tÃ­m Ä‘áº·c trÆ°ng.",
    energy: -392,
    animation: "explosion",
    dangerLevel: 2,
    safetyWarning: "Pháº£n á»©ng mÃ£nh liá»‡t, cáº§n cáº©n trá»ng",
    isBlocked: false
  },
  {
    id: "rx_306",
    name: "Kali tÃ¡c dá»¥ng vá»›i Clo",
    type: "combination",
    reactants: [
      { formula: "K", coeff: 2, name: "Kali" },
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" }
    ],
    products: [
      { formula: "KCl", coeff: 2, name: "Kali Clorua" }
    ],
    equation: "2K + Clâ‚‚ â†’(tÂ°) 2KCl",
    gradeLevel: 10,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Kali chÃ¡y sÃ¡ng trong khÃ­ Clo, táº¡o tinh thá»ƒ tráº¯ng.",
    energy: -874,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n",
    isBlocked: false
  },
  {
    id: "rx_307",
    name: "Bari tÃ¡c dá»¥ng vá»›i nÆ°á»›c",
    type: "single-replacement",
    reactants: [
      { formula: "Ba", coeff: 1, name: "Bari" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Ba(OH)â‚‚", coeff: 1, name: "Bari Hidroxit" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "Ba + 2Hâ‚‚O â†’ Ba(OH)â‚‚ + Hâ‚‚â†‘",
    gradeLevel: 11,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Bari tan nhanh, sá»§i bá»t khÃ­ máº¡nh máº½.",
    energy: -430,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n",
    isBlocked: false
  },
  {
    id: "rx_309",
    name: "Báº¡c tÃ¡c dá»¥ng vá»›i Axit Nitric Ä‘áº·c",
    type: "redox",
    reactants: [
      { formula: "Ag", coeff: 1, name: "Báº¡c" },
      { formula: "HNOâ‚ƒ", coeff: 2, name: "Axit Nitric Ä‘áº·c" }
    ],
    products: [
      { formula: "AgNOâ‚ƒ", coeff: 1, name: "Báº¡c Nitrat" },
      { formula: "NOâ‚‚", coeff: 1, name: "KhÃ­ NitÆ¡ Äioxit" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "Ag + 2HNOâ‚ƒ(Ä‘) â†’ AgNOâ‚ƒ + NOâ‚‚â†‘ + Hâ‚‚O",
    gradeLevel: 11,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Báº¡c tan, giáº£i phÃ³ng khÃ­ mÃ u nÃ¢u Ä‘á» NOâ‚‚.",
    energy: -100,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n",
    isBlocked: false
  },
  {
    id: "rx_310",
    name: "Oxy hÃ³a Báº¡c",
    type: "combination",
    reactants: [
      { formula: "Ag", coeff: 4, name: "Báº¡c" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "Agâ‚‚O", coeff: 2, name: "Báº¡c Oxit" }
    ],
    equation: "4Ag + Oâ‚‚ â†’(200Â°C) 2Agâ‚‚O",
    gradeLevel: 11,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ ~200Â°C",
    observation: "Bá» máº·t báº¡c bá»‹ xá»‰n mÃ u, táº¡o lá»›p oxit mÃ u Ä‘en.",
    energy: -62.2,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n",
    isBlocked: false
  },
  {
    id: "rx_311",
    name: "Flo tÃ¡c dá»¥ng vá»›i Hydro",
    type: "combination",
    reactants: [
      { formula: "Fâ‚‚", coeff: 1, name: "KhÃ­ Flo" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    products: [
      { formula: "HF", coeff: 2, name: "Hydro Florua" }
    ],
    equation: "Fâ‚‚ + Hâ‚‚ â†’ 2HF",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Pháº£n á»©ng ngay cáº£ trong bÃ³ng tá»‘i á»Ÿ nhiá»‡t Ä‘á»™ ráº¥t tháº¥p",
    observation: "Pháº£n á»©ng ná»• máº¡nh ngay cáº£ á»Ÿ Ä‘iá»u kiá»‡n kháº¯c nghiá»‡t.",
    energy: -542,
    animation: "explosion",
    dangerLevel: 2,
    safetyWarning: "Cá»±c ká»³ nguy hiá»ƒm, pháº£n á»©ng ná»•",
    isBlocked: false
  },
  {
    id: "rx_312",
    name: "Flo tÃ¡c dá»¥ng vá»›i nÆ°á»›c",
    type: "redox",
    reactants: [
      { formula: "Fâ‚‚", coeff: 2, name: "KhÃ­ Flo" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "HF", coeff: 4, name: "Hydro Florua" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    equation: "2Fâ‚‚ + 2Hâ‚‚O â†’ 4HF + Oâ‚‚â†‘",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Flo bá»‘c chÃ¡y trong nÆ°á»›c, giáº£i phÃ³ng Oxy.",
    energy: -750,
    animation: "burn",
    dangerLevel: 2,
    safetyWarning: "Pháº£n á»©ng mÃ£nh liá»‡t",
    isBlocked: false
  },
  {
    id: "rx_313",
    name: "Silic tÃ¡c dá»¥ng vá»›i Magie",
    type: "combination",
    reactants: [
      { formula: "Si", coeff: 1, name: "Silic" },
      { formula: "Mg", coeff: 2, name: "MagiÃª" }
    ],
    products: [
      { formula: "Mgâ‚‚Si", coeff: 1, name: "MagiÃª Silixua" }
    ],
    equation: "Si + 2Mg â†’(tÂ°) Mgâ‚‚Si",
    gradeLevel: 11,
    category: "Ã kim",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Táº¡o há»£p cháº¥t silixua kim loáº¡i.",
    energy: -77,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_314",
    name: "Silic tÃ¡c dá»¥ng vá»›i Flo",
    type: "combination",
    reactants: [
      { formula: "Si", coeff: 1, name: "Silic" },
      { formula: "Fâ‚‚", coeff: 2, name: "KhÃ­ Flo" }
    ],
    products: [
      { formula: "SiFâ‚„", coeff: 1, name: "Silic Tetraflorua" }
    ],
    equation: "Si + 2Fâ‚‚ â†’ SiFâ‚„",
    gradeLevel: 11,
    category: "Ã kim",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Silic bÃ¹ng chÃ¡y trong luá»“ng khÃ­ Flo.",
    energy: -1615,
    animation: "burn",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_317",
    name: "Cacbon khá»­ Äá»“ng(II) Oxit",
    type: "redox",
    reactants: [
      { formula: "C", coeff: 1, name: "Cacbon" },
      { formula: "CuO", coeff: 2, name: "Äá»“ng(II) Oxit" }
    ],
    products: [
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" },
      { formula: "Cu", coeff: 2, name: "Äá»“ng" }
    ],
    equation: "C + 2CuO â†’(tÂ°) COâ‚‚â†‘ + 2Cu",
    gradeLevel: 9,
    category: "Phi kim",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Bá»™t mÃ u Ä‘en chuyá»ƒn dáº§n sang mÃ u Ä‘á» cá»§a kim loáº¡i Äá»“ng.",
    energy: -80,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_318",
    name: "Cacbon khá»­ Sáº¯t(III) Oxit",
    type: "redox",
    reactants: [
      { formula: "C", coeff: 3, name: "Cacbon" },
      { formula: "Feâ‚‚Oâ‚ƒ", coeff: 2, name: "Sáº¯t(III) Oxit" }
    ],
    products: [
      { formula: "COâ‚‚", coeff: 3, name: "KhÃ­ Cacbonic" },
      { formula: "Fe", coeff: 4, name: "Sáº¯t" }
    ],
    equation: "3C + 2Feâ‚‚Oâ‚ƒ â†’(tÂ°) 3COâ‚‚â†‘ + 4Fe",
    gradeLevel: 9,
    category: "Phi kim",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "DÃ¹ng trong cÃ´ng nghiá»‡p luyá»‡n gang thÃ©p.",
    energy: -460,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_319",
    name: "Canxi tÃ¡c dá»¥ng vá»›i Clo",
    type: "combination",
    reactants: [
      { formula: "Ca", coeff: 1, name: "Canxi" },
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" }
    ],
    products: [
      { formula: "CaClâ‚‚", coeff: 1, name: "Canxi Clorua" }
    ],
    equation: "Ca + Clâ‚‚ â†’(tÂ°) CaClâ‚‚",
    gradeLevel: 10,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Canxi chÃ¡y sÃ¡ng trong khÃ­ Clo táº¡o muá»‘i tráº¯ng.",
    energy: -795,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_320",
    name: "Báº¡c tÃ¡c dá»¥ng vá»›i LÆ°u huá»³nh",
    type: "combination",
    reactants: [
      { formula: "Ag", coeff: 2, name: "Báº¡c" },
      { formula: "S", coeff: 1, name: "LÆ°u huá»³nh" }
    ],
    products: [
      { formula: "Agâ‚‚S", coeff: 1, name: "Báº¡c Sunfua" }
    ],
    equation: "2Ag + S â†’(tÂ°) Agâ‚‚S",
    gradeLevel: 10,
    category: "Kim loáº¡i",
    conditions: "Äun nÃ³ng",
    observation: "Táº¡o cháº¥t ráº¯n mÃ u Ä‘en, giáº£i thÃ­ch hiá»‡n tÆ°á»£ng báº¡c bá»‹ Ä‘en khi tiáº¿p xÃºc vá»›i lÆ°u huá»³nh.",
    energy: -32.6,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_321",
    name: "Kháº¯c thá»§y tinh báº±ng HF",
    type: "double-replacement",
    reactants: [
      { formula: "SiOâ‚‚", coeff: 1, name: "Silic Äioxit" },
      { formula: "HF", coeff: 4, name: "Axit Floridric" }
    ],
    products: [
      { formula: "SiFâ‚„", coeff: 1, name: "Silic Tetraflorua" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "SiOâ‚‚ + 4HF â†’ SiFâ‚„â†‘ + 2Hâ‚‚O",
    gradeLevel: 11,
    category: "Phi kim",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Bá» máº·t thá»§y tinh bá»‹ Äƒn mÃ²n, má» Ä‘i.",
    energy: -191,
    animation: "fizz",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_323",
    name: "Silic tÃ¡c dá»¥ng vá»›i Oxy",
    type: "combination",
    reactants: [
      { formula: "Si", coeff: 1, name: "Silic" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "SiOâ‚‚", coeff: 1, name: "Silic Äioxit" }
    ],
    equation: "Si + Oâ‚‚ â†’(tÂ°) SiOâ‚‚",
    gradeLevel: 11,
    category: "Ã kim",
    conditions: "Nhiá»‡t Ä‘á»™ cao (>400Â°C)",
    observation: "Silic chÃ¡y táº¡o thÃ nh cÃ¡t tráº¯ng tinh khiáº¿t.",
    energy: -911,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_324",
    name: "HÃ²a tan Oxit Báº¡c trong Axit Nitric",
    type: "double-replacement",
    reactants: [
      { formula: "Agâ‚‚O", coeff: 1, name: "Báº¡c Oxit" },
      { formula: "HNOâ‚ƒ", coeff: 2, name: "Axit Nitric" }
    ],
    products: [
      { formula: "AgNOâ‚ƒ", coeff: 2, name: "Báº¡c Nitrat" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "Agâ‚‚O + 2HNOâ‚ƒ â†’ 2AgNOâ‚ƒ + Hâ‚‚O",
    gradeLevel: 10,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Bá»™t oxit Ä‘en tan trong axit táº¡o dung dá»‹ch khÃ´ng mÃ u.",
    energy: -85,
    animation: "mix",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_327",
    name: "Báº¡c tÃ¡c dá»¥ng vá»›i Axit Nitric loÃ£ng",
    type: "redox",
    reactants: [
      { formula: "Ag", coeff: 3, name: "Báº¡c" },
      { formula: "HNOâ‚ƒ", coeff: 4, name: "Axit Nitric loÃ£ng" }
    ],
    products: [
      { formula: "AgNOâ‚ƒ", coeff: 3, name: "Báº¡c Nitrat" },
      { formula: "NO", coeff: 1, name: "KhÃ­ NitÆ¡ Oxit" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "3Ag + 4HNOâ‚ƒ(l) â†’ 3AgNOâ‚ƒ + NOâ†‘ + 2Hâ‚‚O",
    gradeLevel: 11,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Báº¡c tan, thoÃ¡t ra khÃ­ khÃ´ng mÃ u hÃ³a nÃ¢u trong khÃ´ng khÃ­.",
    energy: -80,
    animation: "fizz",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_328",
    name: "Báº¡c tÃ¡c dá»¥ng vá»›i Axit Sunfuric Ä‘áº·c nÃ³ng",
    type: "redox",
    reactants: [
      { formula: "Ag", coeff: 2, name: "Báº¡c" },
      { formula: "Hâ‚‚SOâ‚„", coeff: 2, name: "Axit Sunfuric Ä‘áº·c" }
    ],
    products: [
      { formula: "Agâ‚‚SOâ‚„", coeff: 1, name: "Báº¡c Sunfat" },
      { formula: "SOâ‚‚", coeff: 1, name: "KhÃ­ LÆ°u huá»³nh Äioxit" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "2Ag + 2Hâ‚‚SOâ‚„(Ä‘) â†’ Agâ‚‚SOâ‚„ + SOâ‚‚â†‘ + 2Hâ‚‚O",
    gradeLevel: 11,
    category: "Kim loáº¡i",
    conditions: "Äun nÃ³ng",
    observation: "Báº¡c tan, thoÃ¡t ra khÃ­ mÃ¹i háº¯c (SOâ‚‚).",
    energy: -110,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_329",
    name: "Sá»± xá»‰n mÃ u cá»§a Báº¡c (Tarnishing)",
    type: "redox",
    reactants: [
      { formula: "Ag", coeff: 4, name: "Báº¡c" },
      { formula: "Hâ‚‚S", coeff: 2, name: "KhÃ­ Hydro Sunfua" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "Agâ‚‚S", coeff: 2, name: "Báº¡c Sunfua (Äen)" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "4Ag + 2Hâ‚‚S + Oâ‚‚ â†’ 2Agâ‚‚S + 2Hâ‚‚O",
    gradeLevel: 10,
    category: "Kim loáº¡i",
    conditions: "MÃ´i trÆ°á»ng khÃ´ng khÃ­ áº©m",
    observation: "Bá» máº·t báº¡c bá»‹ Ä‘en láº¡i do táº¡o thÃ nh lá»›p Agâ‚‚S.",
    energy: -600,
    animation: "color-change",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_333",
    name: "Sáº£n xuáº¥t khÃ­ than Æ°á»›t",
    type: "redox",
    reactants: [
      { formula: "C", coeff: 1, name: "Cacbon (Than)" },
      { formula: "Hâ‚‚O", coeff: 1, name: "HÆ¡i nÆ°á»›c" }
    ],
    products: [
      { formula: "CO", coeff: 1, name: "KhÃ­ Cacbon Oxit" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "C + Hâ‚‚O(h) â†’(1000Â°C) CO + Hâ‚‚",
    gradeLevel: 9,
    category: "Phi kim",
    conditions: "Nhiá»‡t Ä‘á»™ ~1000Â°C",
    observation: "Than Ä‘á» nÃ³ng tÃ¡c dá»¥ng vá»›i hÆ¡i nÆ°á»›c táº¡o há»—n há»£p khÃ­ Ä‘á»‘t.",
    energy: 131,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_334",
    name: "Cacbon tÃ¡c dá»¥ng vá»›i Axit Sunfuric Ä‘áº·c",
    type: "redox",
    reactants: [
      { formula: "C", coeff: 1, name: "Cacbon" },
      { formula: "Hâ‚‚SOâ‚„", coeff: 2, name: "Axit Sunfuric Ä‘áº·c" }
    ],
    products: [
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" },
      { formula: "SOâ‚‚", coeff: 2, name: "KhÃ­ LÆ°u huá»³nh Äioxit" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "C + 2Hâ‚‚SOâ‚„(Ä‘) â†’(tÂ°) COâ‚‚ + 2SOâ‚‚ + 2Hâ‚‚O",
    gradeLevel: 10,
    category: "Phi kim",
    conditions: "Äun nÃ³ng",
    observation: "Cacbon tan dáº§n, giáº£i phÃ³ng há»—n há»£p khÃ­ COâ‚‚ vÃ  SOâ‚‚.",
    energy: -180,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_335",
    name: "Canxi tÃ¡c dá»¥ng vá»›i Axit Clohidric",
    type: "single-replacement",
    reactants: [
      { formula: "Ca", coeff: 1, name: "Canxi" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "CaClâ‚‚", coeff: 1, name: "Canxi Clorua" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "Ca + 2HCl â†’ CaClâ‚‚ + Hâ‚‚â†‘",
    gradeLevel: 9,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Canxi tan nhanh, bá»t khÃ­ thoÃ¡t ra mÃ£nh liá»‡t.",
    energy: -540,
    animation: "fizz",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_336",
    name: "Oxy hÃ³a Liti",
    type: "combination",
    reactants: [
      { formula: "Li", coeff: 4, name: "Liti" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "Liâ‚‚O", coeff: 2, name: "Liti Oxit" }
    ],
    equation: "4Li + Oâ‚‚ â†’(tÂ°) 2Liâ‚‚O",
    gradeLevel: 10,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Liti chÃ¡y vá»›i ngá»n lá»­a Ä‘á» tÆ°Æ¡i, táº¡o cháº¥t ráº¯n tráº¯ng Liâ‚‚O.",
    energy: -1198,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_337",
    name: "Liti tÃ¡c dá»¥ng vá»›i Clo",
    type: "combination",
    reactants: [
      { formula: "Li", coeff: 2, name: "Liti" },
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" }
    ],
    products: [
      { formula: "LiCl", coeff: 2, name: "Liti Clorua" }
    ],
    equation: "2Li + Clâ‚‚ â†’(tÂ°) 2LiCl",
    gradeLevel: 10,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Liti chÃ¡y sÃ¡ng trong khÃ­ Clo táº¡o muá»‘i tráº¯ng LiCl.",
    energy: -816,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_338",
    name: "Kali tÃ¡c dá»¥ng vá»›i LÆ°u huá»³nh",
    type: "combination",
    reactants: [
      { formula: "K", coeff: 2, name: "Kali" },
      { formula: "S", coeff: 1, name: "LÆ°u huá»³nh" }
    ],
    products: [
      { formula: "Kâ‚‚S", coeff: 1, name: "Kali Sunfua" }
    ],
    equation: "2K + S â†’(tÂ°) Kâ‚‚S",
    gradeLevel: 10,
    category: "Kim loáº¡i",
    conditions: "Äun nÃ³ng nháº¹",
    observation: "Kali pháº£n á»©ng máº¡nh vá»›i lÆ°u huá»³nh khi Ä‘un nÃ³ng.",
    energy: -450,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 2,
    safetyWarning: "Pháº£n á»©ng tá»a nhiá»u nhiá»‡t, cáº§n cáº©n trá»ng",
    isBlocked: false
  },
  {
    id: "rx_339",
    name: "NhÃ´m tÃ¡c dá»¥ng vá»›i Brom",
    type: "combination",
    reactants: [
      { formula: "Al", coeff: 2, name: "NhÃ´m" },
      { formula: "Brâ‚‚", coeff: 3, name: "Brom" }
    ],
    products: [
      { formula: "AlBrâ‚ƒ", coeff: 2, name: "NhÃ´m Bromua" }
    ],
    equation: "2Al + 3Brâ‚‚ â†’ 2AlBrâ‚ƒ",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "NhÃ´m chÃ¡y sÃ¡ng trong Brom lá»ng, tá»a nhiá»u nhiá»‡t vÃ  phÃ¡t ra Ã¡nh sÃ¡ng chÃ³i lÃ³a.",
    energy: -1050,
    animation: "explosion",
    dangerLevel: 2,
    safetyWarning: "Pháº£n á»©ng ráº¥t mÃ£nh liá»‡t, cáº§n thá»±c hiá»‡n cáº©n tháº­n.",
    isBlocked: false
  },
  {
    id: "rx_340",
    name: "Hydro tÃ¡c dá»¥ng vá»›i Brom",
    type: "combination",
    reactants: [
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" },
      { formula: "Brâ‚‚", coeff: 1, name: "Brom" }
    ],
    products: [
      { formula: "HBr", coeff: 2, name: "Hydro Bromua" }
    ],
    equation: "Hâ‚‚ + Brâ‚‚ â†’(tÂ°) 2HBr",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Äun nÃ³ng",
    observation: "HÆ¡i brom mÃ u nÃ¢u Ä‘á» nháº¡t dáº§n, táº¡o ra khÃ­ hydro bromua khÃ´ng mÃ u.",
    energy: -72,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_341",
    name: "NhÃ´m tÃ¡c dá»¥ng vá»›i Iá»‘t",
    type: "combination",
    reactants: [
      { formula: "Al", coeff: 2, name: "NhÃ´m" },
      { formula: "Iâ‚‚", coeff: 3, name: "Iá»‘t" }
    ],
    products: [
      { formula: "AlIâ‚ƒ", coeff: 2, name: "NhÃ´m Iotua" }
    ],
    equation: "2Al + 3Iâ‚‚ â†’(Hâ‚‚O) 2AlIâ‚ƒ",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "XÃºc tÃ¡c nÆ°á»›c",
    observation: "Pháº£n á»©ng tá»a nhiá»‡t máº¡nh lÃ m Iá»‘t thÄƒng hoa thÃ nh khÃ³i mÃ u tÃ­m Ä‘áº·c trÆ°ng.",
    energy: -620,
    animation: "smoke",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_342",
    name: "Hydro tÃ¡c dá»¥ng vá»›i Iá»‘t",
    type: "combination",
    reactants: [
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" },
      { formula: "Iâ‚‚", coeff: 1, name: "Iá»‘t" }
    ],
    products: [
      { formula: "HI", coeff: 2, name: "Hydro Iotua" }
    ],
    equation: "Hâ‚‚ + Iâ‚‚ â‡Œ(tÂ°, xt) 2HI",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Äun nÃ³ng máº¡nh, pháº£n á»©ng thuáº­n nghá»‹ch",
    observation: "HÆ¡i iá»‘t mÃ u tÃ­m nháº¡t dáº§n, táº¡o ra khÃ­ hydro iotua.",
    energy: 53,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_343",
    name: "Natri tÃ¡c dá»¥ng vá»›i Clo",
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
    conditions: "Äun nÃ³ng",
    observation: "Natri chÃ¡y sÃ¡ng chÃ³i trong bÃ¬nh khÃ­ Clo, táº¡o ra tinh thá»ƒ muá»‘i Äƒn mÃ u tráº¯ng.",
    energy: -822,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_344",
    name: "Äá»“ng tÃ¡c dá»¥ng vá»›i Clo",
    type: "combination",
    reactants: [
      { formula: "Cu", coeff: 1, name: "Äá»“ng" },
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" }
    ],
    products: [
      { formula: "CuClâ‚‚", coeff: 1, name: "Äá»“ng(II) Clorua" }
    ],
    equation: "Cu + Clâ‚‚ â†’(tÂ°) CuClâ‚‚",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Äun nÃ³ng",
    observation: "Äá»“ng chÃ¡y trong khÃ­ Clo táº¡o thÃ nh khÃ³i mÃ u nÃ¢u cá»§a CuClâ‚‚ khan.",
    energy: -205,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_348",
    name: "Thiáº¿c tÃ¡c dá»¥ng vá»›i Oxy",
    type: "combination",
    reactants: [
      { formula: "Sn", coeff: 1, name: "Thiáº¿c" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "SnOâ‚‚", coeff: 1, name: "Thiáº¿c(IV) Oxit" }
    ],
    equation: "Sn + Oâ‚‚ â†’(tÂ°) SnOâ‚‚",
    gradeLevel: 10,
    category: "Kim loáº¡i",
    conditions: "Äun nÃ³ng máº¡nh",
    observation: "Thiáº¿c chÃ¡y sÃ¡ng táº¡o thÃ nh bá»™t oxit mÃ u tráº¯ng.",
    energy: -580,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_349",
    name: "Thiáº¿c tÃ¡c dá»¥ng vá»›i Axit Clohidric",
    type: "single-replacement",
    reactants: [
      { formula: "Sn", coeff: 1, name: "Thiáº¿c" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "SnClâ‚‚", coeff: 1, name: "Thiáº¿c(II) Clorua" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "Sn + 2HCl â†’ SnClâ‚‚ + Hâ‚‚â†‘",
    gradeLevel: 10,
    category: "Kim loáº¡i",
    conditions: "Axit Ä‘áº·c, Ä‘un nÃ³ng nháº¹",
    observation: "Kim loáº¡i thiáº¿c tan cháº­m, sá»§i bá»t khÃ­ khÃ´ng mÃ u.",
    energy: -35,
    animation: "fizz",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_350",
    name: "ChÃ¬ tÃ¡c dá»¥ng vá»›i Oxy",
    type: "combination",
    reactants: [
      { formula: "Pb", coeff: 2, name: "ChÃ¬" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "PbO", coeff: 2, name: "ChÃ¬(II) Oxit" }
    ],
    equation: "2Pb + Oâ‚‚ â†’(tÂ°) 2PbO",
    gradeLevel: 10,
    category: "Kim loáº¡i",
    conditions: "Äun nÃ³ng",
    observation: "Bá» máº·t chÃ¬ bá»‹ má» Ä‘i nhanh chÃ³ng, chuyá»ƒn thÃ nh lá»›p oxit mÃ u vÃ ng nháº¡t.",
    energy: -219,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_351",
    name: "ChÃ¬ tÃ¡c dá»¥ng vá»›i LÆ°u huá»³nh",
    type: "combination",
    reactants: [
      { formula: "Pb", coeff: 1, name: "ChÃ¬" },
      { formula: "S", coeff: 1, name: "LÆ°u huá»³nh" }
    ],
    products: [
      { formula: "PbS", coeff: 1, name: "ChÃ¬(II) Sunfua" }
    ],
    equation: "Pb + S â†’(tÂ°) PbS",
    gradeLevel: 10,
    category: "Kim loáº¡i",
    conditions: "Äun nÃ³ng",
    observation: "Táº¡o thÃ nh cháº¥t ráº¯n cÃ³ mÃ u Ä‘en sáº«m cá»§a chÃ¬(II) sunfua.",
    energy: -100,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_352",
    name: "Bari tÃ¡c dá»¥ng vá»›i Axit Clohidric",
    type: "single-replacement",
    reactants: [
      { formula: "Ba", coeff: 1, name: "Bari" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "BaClâ‚‚", coeff: 1, name: "Bari Clorua" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "Ba + 2HCl â†’ BaClâ‚‚ + Hâ‚‚â†‘",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Bari tan cá»±c máº¡nh, sá»§i bá»t khÃ­ mÃ£nh liá»‡t.",
    energy: -550,
    animation: "fizz",
    dangerLevel: 2,
    isBlocked: false
  },
  {
    id: "rx_354",
    name: "Iá»‘t tÃ¡c dá»¥ng vá»›i Natri",
    type: "combination",
    reactants: [
      { formula: "Na", coeff: 2, name: "Natri" },
      { formula: "Iâ‚‚", coeff: 1, name: "Iá»‘t" }
    ],
    products: [
      { formula: "NaI", coeff: 2, name: "Natri Iotua" }
    ],
    equation: "2Na + Iâ‚‚ â†’ 2NaI",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng hoáº·c Ä‘un nháº¹",
    observation: "Pháº£n á»©ng tá»a nhiá»‡t máº¡nh, Iá»‘t thÄƒng hoa mÃ u tÃ­m vÃ  táº¡o ra muá»‘i.",
    energy: -576,
    animation: "mix",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_355",
    name: "Clo Ä‘áº©y Brom ra khá»i muá»‘i",
    type: "single-replacement",
    reactants: [
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" },
      { formula: "NaBr", coeff: 2, name: "Natri Bromua" }
    ],
    products: [
      { formula: "NaCl", coeff: 2, name: "Natri Clorua" },
      { formula: "Brâ‚‚", coeff: 1, name: "Brom" }
    ],
    equation: "Clâ‚‚ + 2NaBr â†’ 2NaCl + Brâ‚‚",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Dung dá»‹ch chuyá»ƒn sang mÃ u vÃ ng nÃ¢u cá»§a Brom.",
    energy: -90,
    animation: "color-change",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_356",
    name: "Brom Ä‘áº©y Iá»‘t ra khá»i muá»‘i",
    type: "single-replacement",
    reactants: [
      { formula: "Brâ‚‚", coeff: 1, name: "Brom" },
      { formula: "KI", coeff: 2, name: "Kali Iotua" }
    ],
    products: [
      { formula: "KBr", coeff: 2, name: "Kali Bromua" },
      { formula: "Iâ‚‚", coeff: 1, name: "Iá»‘t" }
    ],
    equation: "Brâ‚‚ + 2KI â†’ 2KBr + Iâ‚‚",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Táº¡o ra Iá»‘t cÃ³ mÃ u tÃ­m Ä‘en Ä‘áº·c trÆ°ng.",
    energy: -50,
    animation: "color-change",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_357",
    name: "Silic tan trong kiá»m",
    type: "redox",
    reactants: [
      { formula: "Si", coeff: 1, name: "Silic" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Naâ‚‚SiOâ‚ƒ", coeff: 1, name: "Natri Silicat" },
      { formula: "Hâ‚‚", coeff: 2, name: "KhÃ­ Hydro" }
    ],
    equation: "Si + 2NaOH + Hâ‚‚O â†’ Naâ‚‚SiOâ‚ƒ + 2Hâ‚‚â†‘",
    gradeLevel: 11,
    category: "Ã kim",
    conditions: "Dung dá»‹ch kiá»m Ä‘áº·c",
    observation: "Silic tan dáº§n, sá»§i bá»t khÃ­ khÃ´ng mÃ u.",
    energy: -120,
    animation: "fizz",
    dangerLevel: 1,
    isBlocked: false
  },
];
