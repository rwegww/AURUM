export const reactionsBatch3_4 = [
  // --- Bá»” SUNG KHá»I LÆ¯á»¢NG Lá»šN (BATCH 3: Há»®U CÆ  Äáº I CÆ¯Æ NG & CHUYÃŠN SÃ‚U - PHáº¦N A) ---
  {
    id: "rx_075",
    name: "Pháº£n á»©ng tháº¿ Clo cá»§a Metan (Giai Ä‘oáº¡n 1)",
    type: "single-replacement",
    reactants: [
      { formula: "CHâ‚„", coeff: 1, name: "KhÃ­ Metan" },
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" }
    ],
    products: [
      { formula: "CHâ‚ƒCl", coeff: 1, name: "Metyl Clorua" },
      { formula: "HCl", coeff: 1, name: "Hydro Clo" }
    ],
    equation: "CHâ‚„ + Clâ‚‚ â†’(as) CHâ‚ƒCl + HCl",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Ãnh sÃ¡ng khuáº¿ch tÃ¡n",
    observation: "MÃ u vÃ ng lá»¥c cá»§a clo nháº¡t dáº§n, táº¡o ra khÃ­ hydro clorua lÃ m Ä‘á» quá»³ tÃ­m áº©m.",
    energy: -103,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_076",
    name: "Nhiá»‡t phÃ¢n Metan (1500Â°C)",
    type: "decomposition",
    reactants: [
      { formula: "CHâ‚„", coeff: 2, name: "KhÃ­ Metan" }
    ],
    products: [
      { formula: "Câ‚‚Hâ‚‚", coeff: 1, name: "Axetilen" },
      { formula: "Hâ‚‚", coeff: 3, name: "KhÃ­ Hydro" }
    ],
    equation: "2CHâ‚„ â†’(1500Â°C, lÃ m láº¡nh nhanh) Câ‚‚Hâ‚‚ + 3Hâ‚‚â†‘",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "1500Â°C, lÃ m láº¡nh nhanh",
    observation: "Metan bá»‹ phÃ¢n há»§y táº¡o khÃ­ axetilen dÃ¹ng trong cÃ´ng nghiá»‡p.",
    energy: 377,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_077",
    name: "Äá»‘t chÃ¡y Etan",
    type: "combustion",
    reactants: [
      { formula: "Câ‚‚Hâ‚†", coeff: 2, name: "KhÃ­ Etan" },
      { formula: "Oâ‚‚", coeff: 7, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "COâ‚‚", coeff: 4, name: "KhÃ­ Cacbonic" },
      { formula: "Hâ‚‚O", coeff: 6, name: "NÆ°á»›c" }
    ],
    equation: "2Câ‚‚Hâ‚† + 7Oâ‚‚ â†’(tÂ°) 4COâ‚‚ + 6Hâ‚‚O",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Etan chÃ¡y máº¡nh tá»a nhiá»u nhiá»‡t, táº¡o khÃ­ lÃ m Ä‘á»¥c nÆ°á»›c vÃ´i trong.",
    energy: -3120,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_078",
    name: "Cá»™ng Hydro vÃ o Etilen",
    type: "combination",
    reactants: [
      { formula: "Câ‚‚Hâ‚„", coeff: 1, name: "Etilen" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    products: [
      { formula: "Câ‚‚Hâ‚†", coeff: 1, name: "Etan" }
    ],
    equation: "Câ‚‚Hâ‚„ + Hâ‚‚ â†’(tÂ°, Ni) Câ‚‚Hâ‚†",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Nhiá»‡t Ä‘á»™, xÃºc tÃ¡c Ni",
    observation: "Etilen pháº£n á»©ng táº¡o thÃ nh Etan.",
    energy: -137,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_079",
    name: "Cá»™ng Hydro vÃ o Axetilen (Tá»‰ lá»‡ 1:1)",
    type: "combination",
    reactants: [
      { formula: "Câ‚‚Hâ‚‚", coeff: 1, name: "Axetilen" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    products: [
      { formula: "Câ‚‚Hâ‚„", coeff: 1, name: "Etilen" }
    ],
    equation: "Câ‚‚Hâ‚‚ + Hâ‚‚ â†’(tÂ°, Pd/PbCOâ‚ƒ) Câ‚‚Hâ‚„",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Nhiá»‡t Ä‘á»™, xÃºc tÃ¡c Pd/PbCOâ‚ƒ",
    observation: "Pháº£n á»©ng dá»«ng láº¡i á»Ÿ giai Ä‘oáº¡n táº¡o Etilen nhá» xÃºc tÃ¡c Ä‘áº·c biá»‡t.",
    energy: -175,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_080",
    name: "Cá»™ng Hydro vÃ o Axetilen (Tá»‰ lá»‡ 1:2)",
    type: "combination",
    reactants: [
      { formula: "Câ‚‚Hâ‚‚", coeff: 1, name: "Axetilen" },
      { formula: "Hâ‚‚", coeff: 2, name: "KhÃ­ Hydro" }
    ],
    products: [
      { formula: "Câ‚‚Hâ‚†", coeff: 1, name: "Etan" }
    ],
    equation: "Câ‚‚Hâ‚‚ + 2Hâ‚‚ â†’(tÂ°, Ni) Câ‚‚Hâ‚†",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Nhiá»‡t Ä‘á»™, xÃºc tÃ¡c Ni",
    observation: "Axetilen pháº£n á»©ng hoÃ n toÃ n táº¡o thÃ nh Etan.",
    energy: -312,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_081",
    name: "Äime hÃ³a Axetilen",
    type: "combination",
    reactants: [
      { formula: "Câ‚‚Hâ‚‚", coeff: 2, name: "Axetilen" }
    ],
    products: [
      { formula: "Câ‚„Hâ‚„", coeff: 1, name: "Vinylaxetilen" }
    ],
    equation: "2Câ‚‚Hâ‚‚ â†’(tÂ°, xt) CHâ‚‚=CH-Câ‰¡CH",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Nhiá»‡t Ä‘á»™, xÃºc tÃ¡c CuCl/NHâ‚„Cl",
    observation: "Táº¡o thÃ nh Vinylaxetilen dÃ¹ng trong sáº£n xuáº¥t cao su chloroprene.",
    energy: -200,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_082",
    name: "Trime hÃ³a Axetilen (Táº¡o Benzen)",
    type: "combination",
    reactants: [
      { formula: "Câ‚‚Hâ‚‚", coeff: 3, name: "Axetilen" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚†", coeff: 1, name: "Benzen" }
    ],
    equation: "3Câ‚‚Hâ‚‚ â†’(600Â°C, C) Câ‚†Hâ‚†",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "600Â°C, xÃºc tÃ¡c Than hoáº¡t tÃ­nh",
    observation: "Ba phÃ¢n tá»­ axetilen káº¿t há»£p táº¡o thÃ nh vÃ²ng benzen.",
    energy: -600,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_083",
    name: "Cá»™ng nÆ°á»›c vÃ o Axetilen (Äiá»u cháº¿ Andehit)",
    type: "combination",
    reactants: [
      { formula: "Câ‚‚Hâ‚‚", coeff: 1, name: "Axetilen" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "CHâ‚ƒCHO", coeff: 1, name: "Andehit Axetic" }
    ],
    equation: "Câ‚‚Hâ‚‚ + Hâ‚‚O â†’(80Â°C, HgSOâ‚„) CHâ‚ƒCHO",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "80Â°C, xÃºc tÃ¡c HgSOâ‚„",
    observation: "Sáº£n pháº©m trung gian bá»n chuyá»ƒn hÃ³a ngay thÃ nh andehit axetic.",
    energy: -138,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_084",
    name: "Cá»™ng Hydro vÃ o Benzen",
    type: "combination",
    reactants: [
      { formula: "Câ‚†Hâ‚†", coeff: 1, name: "Benzen" },
      { formula: "Hâ‚‚", coeff: 3, name: "KhÃ­ Hydro" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚â‚‚", coeff: 1, name: "Xyclohexan" }
    ],
    equation: "Câ‚†Hâ‚† + 3Hâ‚‚ â†’(tÂ°, Ni) Câ‚†Hâ‚â‚‚",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Nhiá»‡t Ä‘á»™, xÃºc tÃ¡c Ni",
    observation: "VÃ²ng benzen bá»‹ phÃ¡ vá»¡ táº¡o thÃ nh há»£p cháº¥t vÃ²ng bÃ£o hÃ²a.",
    energy: -206,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_085",
    name: "Nitrat hÃ³a Benzen",
    type: "single-replacement",
    reactants: [
      { formula: "Câ‚†Hâ‚†", coeff: 1, name: "Benzen" },
      { formula: "HNOâ‚ƒ", coeff: 1, name: "Axit Nitric" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚…NOâ‚‚", coeff: 1, name: "Nitrobenzen" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "Câ‚†Hâ‚† + HNOâ‚ƒ(Ä‘) â†’(Hâ‚‚SOâ‚„ Ä‘) Câ‚†Hâ‚…NOâ‚‚ + Hâ‚‚O",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Hâ‚‚SOâ‚„ Ä‘áº·c lÃ m xÃºc tÃ¡c",
    observation: "Táº¡o thÃ nh cháº¥t lá»ng mÃ u vÃ ng nháº¡t, mÃ¹i háº¡nh nhÃ¢n (Nitrobenzen) láº¯ng xuá»‘ng.",
    energy: -150,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_086",
    name: "Äá»‘t chÃ¡y Benzen",
    type: "combustion",
    reactants: [
      { formula: "Câ‚†Hâ‚†", coeff: 2, name: "Benzen" },
      { formula: "Oâ‚‚", coeff: 15, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "COâ‚‚", coeff: 12, name: "KhÃ­ Cacbonic" },
      { formula: "Hâ‚‚O", coeff: 6, name: "NÆ°á»›c" }
    ],
    equation: "2Câ‚†Hâ‚† + 15Oâ‚‚ â†’(tÂ°) 12COâ‚‚ + 6Hâ‚‚O",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Benzen chÃ¡y trong khÃ´ng khÃ­ vá»›i ngá»n lá»­a nhiá»u khÃ³i Ä‘en do hÃ m lÆ°á»£ng carbon cao.",
    energy: -6540,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_087",
    name: "Methanol hÃ³a (Äiá»u cháº¿ rÆ°á»£u metylic)",
    type: "combination",
    reactants: [
      { formula: "CO", coeff: 1, name: "Oxit Cacbon" },
      { formula: "Hâ‚‚", coeff: 2, name: "KhÃ­ Hydro" }
    ],
    products: [
      { formula: "CHâ‚ƒOH", coeff: 1, name: "RÆ°á»£u Metylic" }
    ],
    equation: "CO + 2Hâ‚‚ â†’(tÂ°, xt) CHâ‚ƒOH",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "400Â°C, xÃºc tÃ¡c ZnO/Crâ‚‚Oâ‚ƒ",
    observation: "Pháº£n á»©ng cÃ´ng nghiá»‡p quan trá»ng Ä‘á»ƒ sáº£n xuáº¥t methanol.",
    energy: -91,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_088",
    name: "Thá»§y phÃ¢n Dáº«n xuáº¥t Halogen (Táº¡o rÆ°á»£u)",
    type: "double-replacement",
    reactants: [
      { formula: "Câ‚‚Hâ‚…Cl", coeff: 1, name: "Etyl Clorua" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Câ‚‚Hâ‚…OH", coeff: 1, name: "RÆ°á»£u Etylic" },
      { formula: "NaCl", coeff: 1, name: "Natri Clorua" }
    ],
    equation: "Câ‚‚Hâ‚…Cl + NaOH â†’(tÂ°) Câ‚‚Hâ‚…OH + NaCl",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "Äun nÃ³ng",
    observation: "Dáº«n xuáº¥t halogen bá»‹ thá»§y phÃ¢n táº¡o rÆ°á»£u tÆ°Æ¡ng á»©ng.",
    energy: -50,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_089",
    name: "RÆ°á»£u Etylic tÃ¡c dá»¥ng vá»›i Axit HCl",
    type: "double-replacement",
    reactants: [
      { formula: "Câ‚‚Hâ‚…OH", coeff: 1, name: "RÆ°á»£u Etylic" },
      { formula: "HCl", coeff: 1, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "Câ‚‚Hâ‚…Cl", coeff: 1, name: "Etyl Clorua" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "Câ‚‚Hâ‚…OH + HCl â†’(tÂ°) Câ‚‚Hâ‚…Cl + Hâ‚‚O",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "Äun nÃ³ng",
    observation: "NhÃ³m OH bá»‹ thay tháº¿ bá»Ÿi nguyÃªn tá»­ Clo.",
    energy: -10,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_090",
    name: "TÃ¡ch nÆ°á»›c rÆ°á»£u Etylic á»Ÿ 140Â°C (Táº¡o ÃŠte)",
    type: "decomposition",
    reactants: [
      { formula: "Câ‚‚Hâ‚…OH", coeff: 2, name: "RÆ°á»£u Etylic" }
    ],
    products: [
      { formula: "Câ‚‚Hâ‚…OCâ‚‚Hâ‚…", coeff: 1, name: "Äietyl ÃŠte" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "2Câ‚‚Hâ‚…OH â†’(140Â°C, Hâ‚‚SOâ‚„) Câ‚‚Hâ‚…OCâ‚‚Hâ‚… + Hâ‚‚O",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "140Â°C, xÃºc tÃ¡c Hâ‚‚SOâ‚„ Ä‘áº·c",
    observation: "Hai phÃ¢n tá»­ rÆ°á»£u tÃ¡ch nÆ°á»›c táº¡o thÃ nh ete.",
    energy: -20,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_091",
    name: "Äá»‘t chÃ¡y RÆ°á»£u Etylic",
    type: "combustion",
    reactants: [
      { formula: "Câ‚‚Hâ‚…OH", coeff: 1, name: "RÆ°á»£u Etylic" },
      { formula: "Oâ‚‚", coeff: 3, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "COâ‚‚", coeff: 2, name: "KhÃ­ Cacbonic" },
      { formula: "Hâ‚‚O", coeff: 3, name: "NÆ°á»›c" }
    ],
    equation: "Câ‚‚Hâ‚…OH + 3Oâ‚‚ â†’(tÂ°) 2COâ‚‚ + 3Hâ‚‚O",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "Äá»‘t chÃ¡y",
    observation: "RÆ°á»£u chÃ¡y vá»›i ngá»n lá»­a mÃ u xanh nháº¡t, tá»a nhiá»u nhiá»‡t.",
    energy: -1367,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_092",
    name: "Phenol tÃ¡c dá»¥ng vá»›i Natri",
    type: "single-replacement",
    reactants: [
      { formula: "Câ‚†Hâ‚…OH", coeff: 2, name: "Phenol" },
      { formula: "Na", coeff: 2, name: "Natri" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚…ONa", coeff: 2, name: "Natri Phenolat" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "2Câ‚†Hâ‚…OH + 2Na â†’ 2Câ‚†Hâ‚…ONa + Hâ‚‚â†‘",
    gradeLevel: 11,
    category: "Phenol",
    conditions: "Äun nÃ³ng cháº£y phenol",
    observation: "Natri tan, giáº£i phÃ³ng khÃ­ hydro.",
    energy: -170,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_093",
    name: "Phenol tÃ¡c dá»¥ng vá»›i NaOH",
    type: "double-replacement",
    reactants: [
      { formula: "Câ‚†Hâ‚…OH", coeff: 1, name: "Phenol" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚…ONa", coeff: 1, name: "Natri Phenolat" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "Câ‚†Hâ‚…OH + NaOH â†’ Câ‚†Hâ‚…ONa + Hâ‚‚O",
    gradeLevel: 11,
    category: "Phenol",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Phenol (Ä‘á»¥c) tan dáº§n táº¡o dung dá»‹ch Ä‘á»“ng nháº¥t (Natri Phenolat).",
    energy: -30,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_094",
    name: "Pháº£n á»©ng cá»§a Natri Phenolat vá»›i COâ‚‚",
    type: "double-replacement",
    reactants: [
      { formula: "Câ‚†Hâ‚…ONa", coeff: 1, name: "Natri Phenolat" },
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚…OH", coeff: 1, name: "Phenol" },
      { formula: "NaHCOâ‚ƒ", coeff: 1, name: "Natri Bicacbonat" }
    ],
    equation: "Câ‚†Hâ‚…ONa + COâ‚‚ + Hâ‚‚O â†’ Câ‚†Hâ‚…OHâ†“ + NaHCOâ‚ƒ",
    gradeLevel: 11,
    category: "Phenol",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Dung dá»‹ch bá»‹ váº©n Ä‘á»¥c do Phenol tÃ¡ch ra (Axit cacbonic máº¡nh hÆ¡n phenol).",
    energy: -15,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_095",
    name: "Khá»­ Andehit thÃ nh RÆ°á»£u (Cá»™ng Hâ‚‚)",
    type: "combination",
    reactants: [
      { formula: "CHâ‚ƒCHO", coeff: 1, name: "Andehit Axetic" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    products: [
      { formula: "Câ‚‚Hâ‚…OH", coeff: 1, name: "RÆ°á»£u Etylic" }
    ],
    equation: "CHâ‚ƒCHO + Hâ‚‚ â†’(tÂ°, Ni) Câ‚‚Hâ‚…OH",
    gradeLevel: 11,
    category: "Andehit",
    conditions: "Nhiá»‡t Ä‘á»™, xÃºc tÃ¡c Ni",
    observation: "Andehit bá»‹ khá»­ thÃ nh rÆ°á»£u etylic bÃ£o hÃ²a.",
    energy: -70,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_096",
    name: "Oxi hÃ³a Andehit báº±ng Oxy (Sáº£n xuáº¥t axit)",
    type: "redox",
    reactants: [
      { formula: "CHâ‚ƒCHO", coeff: 2, name: "Andehit Axetic" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "CHâ‚ƒCOOH", coeff: 2, name: "Axit Axetic" }
    ],
    equation: "2CHâ‚ƒCHO + Oâ‚‚ â†’(tÂ°, xt) 2CHâ‚ƒCOOH",
    gradeLevel: 11,
    category: "Andehit",
    conditions: "Nhiá»‡t Ä‘á»™, xÃºc tÃ¡c MnÂ²âº",
    observation: "Andehit bá»‹ oxi hÃ³a thÃ nh axit tÆ°Æ¡ng á»©ng.",
    energy: -300,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_097",
    name: "Axit Axetic tÃ¡c dá»¥ng vá»›i NaOH",
    type: "double-replacement",
    reactants: [
      { formula: "CHâ‚ƒCOOH", coeff: 1, name: "Axit Axetic" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "CHâ‚ƒCOONa", coeff: 1, name: "Natri Axetat" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "CHâ‚ƒCOOH + NaOH â†’ CHâ‚ƒCOONa + Hâ‚‚O",
    gradeLevel: 11,
    category: "Axit há»¯u cÆ¡",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Pháº£n á»©ng trung hÃ²a tá»a nhiá»‡t nháº¹.",
    energy: -57,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_098",
    name: "Saponification (Thá»§y phÃ¢n este trong kiá»m)",
    type: "double-replacement",
    reactants: [
      { formula: "CHâ‚ƒCOOCâ‚‚Hâ‚…", coeff: 1, name: "Etyl Axetat" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "CHâ‚ƒCOONa", coeff: 1, name: "Natri Axetat" },
      { formula: "Câ‚‚Hâ‚…OH", coeff: 1, name: "RÆ°á»£u Etylic" }
    ],
    equation: "CHâ‚ƒCOOCâ‚‚Hâ‚… + NaOH â†’(tÂ°) CHâ‚ƒCOONa + Câ‚‚Hâ‚…OH",
    gradeLevel: 12,
    category: "Este",
    conditions: "Äun nÃ³ng",
    observation: "MÃ¹i este máº¥t dáº§n, dung dá»‹ch trá»Ÿ nÃªn Ä‘á»“ng nháº¥t.",
    energy: -40,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_099",
    name: "Pháº£n á»©ng cá»§a Glyxin vá»›i HCl",
    type: "combination",
    reactants: [
      { formula: "Gly", coeff: 1, name: "Glyxin" },
      { formula: "HCl", coeff: 1, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "ClHâ‚ƒN-CHâ‚‚-COOH", coeff: 1, name: "Muá»‘i Glyxinat" }
    ],
    equation: "Hâ‚‚N-CHâ‚‚-COOH + HCl â†’ ClHâ‚ƒN-CHâ‚‚-COOH",
    gradeLevel: 12,
    category: "Amino Acid",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Amino acid thá»ƒ hiá»‡n tÃ­nh bazÆ¡.",
    energy: -45,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_100",
    name: "Pháº£n á»©ng cá»§a Glyxin vá»›i NaOH",
    type: "double-replacement",
    reactants: [
      { formula: "Gly", coeff: 1, name: "Glyxin" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Hâ‚‚N-CHâ‚‚-COONa", coeff: 1, name: "Natri Glyxinat" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "Hâ‚‚N-CHâ‚‚-COOH + NaOH â†’ Hâ‚‚N-CHâ‚‚-COONa + Hâ‚‚O",
    gradeLevel: 12,
    category: "Amino Acid",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Amino acid thá»ƒ hiá»‡n tÃ­nh axit.",
    energy: -50,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_101",
    name: "Thá»§y phÃ¢n SaccarozÆ¡",
    type: "double-replacement",
    reactants: [
      { formula: "Câ‚â‚‚Hâ‚‚â‚‚Oâ‚â‚", coeff: 1, name: "SaccarozÆ¡" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚â‚‚Oâ‚†", coeff: 2, name: "GlucozÆ¡ & FructozÆ¡" }
    ],
    equation: "Câ‚â‚‚Hâ‚‚â‚‚Oâ‚â‚ + Hâ‚‚O â†’(tÂ°, Hâº) Câ‚†Hâ‚â‚‚Oâ‚† + Câ‚†Hâ‚â‚‚Oâ‚†",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Äun nÃ³ng, xÃºc tÃ¡c axit",
    observation: "ÄÆ°á»ng Ä‘Ã´i bá»‹ phÃ¢n cáº¯t thÃ nh hai Ä‘Æ°á»ng Ä‘Æ¡n.",
    energy: -10,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_102",
    name: "Thá»§y phÃ¢n Tinh bá»™t",
    type: "double-replacement",
    reactants: [
      { formula: "Starch", coeff: 1, name: "Tinh bá»™t" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚â‚‚Oâ‚†", coeff: 1, name: "GlucozÆ¡" }
    ],
    equation: "(Câ‚†Hâ‚â‚€Oâ‚…)n + nHâ‚‚O â†’(tÂ°, Hâº) nCâ‚†Hâ‚â‚‚Oâ‚†",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Äun nÃ³ng, xÃºc tÃ¡c axit hoáº·c enzyme",
    observation: "Tinh bá»™t dáº§n biáº¿n Ä‘á»•i thÃ nh Ä‘Æ°á»ng glucozÆ¡.",
    energy: -5,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_103",
    name: "Pháº£n á»©ng mÃ u Iá»‘t cá»§a Tinh bá»™t",
    type: "combination",
    reactants: [
      { formula: "Starch", coeff: 1, name: "Tinh bá»™t" },
      { formula: "Iâ‚‚", coeff: 1, name: "Dung dá»‹ch Iá»‘t" }
    ],
    products: [
      { formula: "Starch-I2", coeff: 1, name: "Há»£p cháº¥t mÃ u xanh tÃ­m" }
    ],
    equation: "Tinh bá»™t + Iâ‚‚ â†’ Há»£p cháº¥t mÃ u xanh tÃ­m",
    gradeLevel: 10,
    category: "Carbohydrate",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng (máº¥t mÃ u khi Ä‘un nÃ³ng)",
    observation: "Dung dá»‹ch xuáº¥t hiá»‡n mÃ u xanh tÃ­m Ä‘áº·c trÆ°ng, khi Ä‘un nÃ³ng mÃ u biáº¿n máº¥t, Ä‘á»ƒ nguá»™i láº¡i hiá»‡n ra.",
    energy: -10,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_104",
    name: "GlucozÆ¡ tÃ¡c dá»¥ng vá»›i Cu(OH)â‚‚ (Nhiá»‡t Ä‘á»™ thÆ°á»ng)",
    type: "combination",
    reactants: [
      { formula: "Câ‚†Hâ‚â‚‚Oâ‚†", coeff: 2, name: "GlucozÆ¡" },
      { formula: "Cu(OH)â‚‚", coeff: 1, name: "Äá»“ng(II) Hidroxit" }
    ],
    products: [
      { formula: "Glucose-Cu", coeff: 1, name: "Phá»©c Ä‘á»“ng-glucozÆ¡" }
    ],
    equation: "2Câ‚†Hâ‚â‚‚Oâ‚† + Cu(OH)â‚‚ â†’ Phá»©c Ä‘á»“ng glucozÆ¡ + 2Hâ‚‚O",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Káº¿t tá»§a xanh lÆ¡ tan táº¡o thÃ nh dung dá»‹ch mÃ u xanh lam tháº«m Ä‘áº·c trÆ°ng.",
    energy: -20,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_105",
    name: "GlucozÆ¡ tÃ¡c dá»¥ng vá»›i Cu(OH)â‚‚ (Äun nÃ³ng)",
    type: "redox",
    reactants: [
      { formula: "Câ‚†Hâ‚â‚‚Oâ‚†", coeff: 1, name: "GlucozÆ¡" },
      { formula: "Cu(OH)â‚‚", coeff: 2, name: "Äá»“ng(II) Hidroxit" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚â‚Oâ‚‡Na", coeff: 1, name: "Natri Gluconat" },
      { formula: "Cuâ‚‚O", coeff: 1, name: "Äá»“ng(I) Oxit" },
      { formula: "Hâ‚‚O", coeff: 3, name: "NÆ°á»›c" }
    ],
    equation: "Câ‚†Hâ‚â‚‚Oâ‚† + 2Cu(OH)â‚‚ + NaOH â†’ Câ‚†Hâ‚â‚Oâ‚‡Na + Cuâ‚‚Oâ†“ + 3Hâ‚‚O",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Äun nÃ³ng",
    observation: "Dung dá»‹ch xanh lam xuáº¥t hiá»‡n káº¿t tá»§a mÃ u Ä‘á» gáº¡ch cá»§a Cuâ‚‚O.",
    energy: -80,
    animation: "precipitation",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_106",
    name: "Pháº£n á»©ng tháº¿ cá»§a Toluen vá»›i Brom",
    type: "single-replacement",
    reactants: [
      { formula: "Câ‚‡Hâ‚ˆ", coeff: 1, name: "Toluen" },
      { formula: "Brâ‚‚", coeff: 1, name: "Brom lá»ng" }
    ],
    products: [
      { formula: "Câ‚‡Hâ‚‡Br", coeff: 1, name: "Benzyl Bromua" },
      { formula: "HBr", coeff: 1, name: "Hydro Bromua" }
    ],
    equation: "Câ‚†Hâ‚…-CHâ‚ƒ + Brâ‚‚ â†’(tÂ°, as) Câ‚†Hâ‚…-CHâ‚‚Br + HBr",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Chiáº¿u sÃ¡ng hoáº·c Ä‘un nÃ³ng (tháº¿ vÃ o nhÃ¡nh)",
    observation: "MÃ u nÃ¢u Ä‘á» cá»§a brom máº¥t dáº§n, cÃ³ khÃ­ thoÃ¡t ra.",
    energy: -45,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_107",
    name: "OxihÃ³a Toluen báº±ng KMnOâ‚„",
    type: "redox",
    reactants: [
      { formula: "Câ‚‡Hâ‚ˆ", coeff: 1, name: "Toluen" },
      { formula: "KMnOâ‚„", coeff: 2, name: "Thuá»‘c tÃ­m" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚…COOK", coeff: 1, name: "Kali Benzoat" },
      { formula: "MnOâ‚‚", coeff: 2, name: "Mangan Äioxit" },
      { formula: "KOH", coeff: 1, name: "Kali Hidroxit" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "Câ‚†Hâ‚…-CHâ‚ƒ + 2KMnOâ‚„ â†’(tÂ°) Câ‚†Hâ‚…-COOK + 2MnOâ‚‚â†“ + KOH + Hâ‚‚O",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Äun nÃ³ng",
    observation: "MÃ u tÃ­m cá»§a dung dá»‹ch bá»‹ máº¥t Ä‘i, xuáº¥t hiá»‡n káº¿t tá»§a Ä‘en.",
    energy: -250,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_108",
    name: "Äá»‘t chÃ¡y Methanol",
    type: "combustion",
    reactants: [
      { formula: "CHâ‚ƒOH", coeff: 2, name: "RÆ°á»£u Metylic" },
      { formula: "Oâ‚‚", coeff: 3, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "COâ‚‚", coeff: 2, name: "KhÃ­ Cacbonic" },
      { formula: "Hâ‚‚O", coeff: 4, name: "NÆ°á»›c" }
    ],
    equation: "2CHâ‚ƒOH + 3Oâ‚‚ â†’(tÂ°) 2COâ‚‚ + 4Hâ‚‚O",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "Äá»‘t chÃ¡y",
    observation: "ChÃ¡y vá»›i ngá»n lá»­a xanh nháº¡t mÃ£nh liá»‡t.",
    energy: -1450,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_109",
    name: "Glixerol tÃ¡c dá»¥ng vá»›i Cu(OH)â‚‚",
    type: "combination",
    reactants: [
      { formula: "Câ‚ƒHâ‚ˆOâ‚ƒ", coeff: 2, name: "Glixerol" },
      { formula: "Cu(OH)â‚‚", coeff: 1, name: "Äá»“ng(II) Hidroxit" }
    ],
    products: [
      { formula: "Glycerol-Cu", coeff: 1, name: "Phá»©c Ä‘á»“ng-glixerol" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "2Câ‚ƒHâ‚ˆOâ‚ƒ + Cu(OH)â‚‚ â†’ Phá»©c Ä‘á»“ng-glixerol + 2Hâ‚‚O",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "HÃ²a tan káº¿t tá»§a Cu(OH)â‚‚ táº¡o dung dá»‹ch mÃ u xanh lam tháº«m.",
    energy: -30,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_110",
    name: "Sáº£n xuáº¥t Axit Axetic báº±ng cÃ¡ch lÃªn men giáº¥m",
    type: "redox",
    reactants: [
      { formula: "Câ‚‚Hâ‚…OH", coeff: 1, name: "RÆ°á»£u Etylic" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "CHâ‚ƒCOOH", coeff: 1, name: "Axit Axetic" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "Câ‚‚Hâ‚…OH + Oâ‚‚ â†’(men) CHâ‚ƒCOOH + Hâ‚‚O",
    gradeLevel: 9,
    category: "Há»¯u cÆ¡",
    conditions: "Men giáº¥m, 25-30Â°C",
    observation: "RÆ°á»£u loÃ£ng chuyá»ƒn thÃ nh giáº¥m cÃ³ vá»‹ chua Ä‘áº·c trÆ°ng.",
    energy: -480,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_111",
    name: "Axit Axetic tÃ¡c dá»¥ng vá»›i Magie",
    type: "single-replacement",
    reactants: [
      { formula: "CHâ‚ƒCOOH", coeff: 2, name: "Axit Axetic" },
      { formula: "Mg", coeff: 1, name: "MagiÃª" }
    ],
    products: [
      { formula: "(CHâ‚ƒCOO)â‚‚Mg", coeff: 1, name: "MagiÃª Axetat" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "2CHâ‚ƒCOOH + Mg â†’ (CHâ‚ƒCOO)â‚‚Mg + Hâ‚‚â†‘",
    gradeLevel: 9,
    category: "Há»¯u cÆ¡",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "MagiÃª tan dáº§n, sá»§i bá»t khÃ­ hydro.",
    energy: -250,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_112",
    name: "Axit Axetic tÃ¡c dá»¥ng vá»›i Naâ‚‚COâ‚ƒ",
    type: "double-replacement",
    reactants: [
      { formula: "CHâ‚ƒCOOH", coeff: 2, name: "Axit Axetic" },
      { formula: "Naâ‚‚COâ‚ƒ", coeff: 1, name: "Natri Cacbonat" }
    ],
    products: [
      { formula: "CHâ‚ƒCOONa", coeff: 2, name: "Natri Axetat" },
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "2CHâ‚ƒCOOH + Naâ‚‚COâ‚ƒ â†’ 2CHâ‚ƒCOONa + COâ‚‚â†‘ + Hâ‚‚O",
    gradeLevel: 9,
    category: "Há»¯u cÆ¡",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Sá»§i bá»t khÃ­ COâ‚‚ mÃ£nh liá»‡t.",
    energy: -30,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_113",
    name: "Äá»‘t chÃ¡y Methan trong Clo (Táº¡o muá»™i than)",
    type: "redox",
    reactants: [
      { formula: "CHâ‚„", coeff: 1, name: "KhÃ­ Metan" },
      { formula: "Clâ‚‚", coeff: 2, name: "KhÃ­ Clo" }
    ],
    products: [
      { formula: "C", coeff: 1, name: "Muá»™i than" },
      { formula: "HCl", coeff: 4, name: "Hydro Clo" }
    ],
    equation: "CHâ‚„ + 2Clâ‚‚ â†’(tÂ°) C + 4HCl",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Äá»‘t chÃ¡y trong khÃ­ clo",
    observation: "Ngá»n lá»­a sáº«m mÃ u, xuáº¥t hiá»‡n nhiá»u muá»™i than Ä‘en vÃ  khÃ­ HCl.",
    energy: -300,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_114",
    name: "Pháº£n á»©ng cá»§a Anilin vá»›i dung dá»‹ch Brom",
    type: "double-replacement",
    reactants: [
      { formula: "Câ‚†Hâ‚…NHâ‚‚", coeff: 1, name: "Anilin" },
      { formula: "Brâ‚‚", coeff: 3, name: "NÆ°á»›c Brom" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚‚Brâ‚ƒNHâ‚‚", coeff: 1, name: "2,4,6-Tribromanilin" },
      { formula: "HBr", coeff: 3, name: "Hydro Bromua" }
    ],
    equation: "Câ‚†Hâ‚…NHâ‚‚ + 3Brâ‚‚ â†’ Câ‚†Hâ‚‚Brâ‚ƒNHâ‚‚â†“ + 3HBr",
    gradeLevel: 12,
    category: "Amin",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Dung dá»‹ch brom bá»‹ máº¥t mÃ u, xuáº¥t hiá»‡n káº¿t tá»§a tráº¯ng (Tribromanilin).",
    energy: -110,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_115",
    name: "Pháº£n á»©ng cá»™ng Hâ‚‚ vÃ o dáº§u thá»±c váº­t (Lá»ng thÃ nh Ráº¯n)",
    type: "combination",
    reactants: [
      { formula: "(Câ‚â‚‡Hâ‚ƒâ‚ƒCOO)â‚ƒCâ‚ƒHâ‚…", coeff: 1, name: "Triolein (Dáº§u)" },
      { formula: "Hâ‚‚", coeff: 3, name: "KhÃ­ Hydro" }
    ],
    products: [
      { formula: "(Câ‚â‚‡Hâ‚ƒâ‚…COO)â‚ƒCâ‚ƒHâ‚…", coeff: 1, name: "Tristearin (Má»¡)" }
    ],
    equation: "(Câ‚â‚‡Hâ‚ƒâ‚ƒCOO)â‚ƒCâ‚ƒHâ‚… + 3Hâ‚‚ â†’(tÂ°, Ni) (Câ‚â‚‡Hâ‚ƒâ‚…COO)â‚ƒCâ‚ƒHâ‚…",
    gradeLevel: 12,
    category: "Lipit",
    conditions: "Nhiá»‡t Ä‘á»™, Ã¡p suáº¥t, Ni",
    observation: "Dáº§u thá»±c váº­t lá»ng chuyá»ƒn hÃ³a thÃ nh cháº¥t bÃ©o ráº¯n (bÆ¡ thá»±c váº­t).",
    energy: -350,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  // --- Bá»” SUNG KHá»I LÆ¯á»¢NG Lá»šN (BATCH 3 PHáº¦N B & BATCH 4: NHáº¬N BIáº¾T & CHUYÃŠN SÃ‚U) ---
  {
    id: "rx_116",
    name: "Thá»§y phÃ¢n Tristearin trong mÃ´i trÆ°á»ng Axit",
    type: "double-replacement",
    reactants: [
      { formula: "(Câ‚â‚‡Hâ‚ƒâ‚…COO)â‚ƒCâ‚ƒHâ‚…", coeff: 1, name: "Tristearin" },
      { formula: "Hâ‚‚O", coeff: 3, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Câ‚â‚‡Hâ‚ƒâ‚…COOH", coeff: 3, name: "Axit Stearic" },
      { formula: "Câ‚ƒHâ‚ˆOâ‚ƒ", coeff: 1, name: "Glixerol" }
    ],
    equation: "(Câ‚â‚‡Hâ‚ƒâ‚…COO)â‚ƒCâ‚ƒHâ‚… + 3Hâ‚‚O â†’(tÂ°, Hâº) 3Câ‚â‚‡Hâ‚ƒâ‚…COOH + Câ‚ƒHâ‚ˆOâ‚ƒ",
    gradeLevel: 12,
    category: "Lipit",
    conditions: "Äun nÃ³ng, xÃºc tÃ¡c axit",
    observation: "Há»—n há»£p cháº¥t bÃ©o dáº§n tan ra, táº¡o thÃ nh axit bÃ©o vÃ  glixerol.",
    energy: -20,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_117",
    name: "XÃ  phÃ²ng hÃ³a Tristearin",
    type: "double-replacement",
    reactants: [
      { formula: "(Câ‚â‚‡Hâ‚ƒâ‚…COO)â‚ƒCâ‚ƒHâ‚…", coeff: 1, name: "Tristearin" },
      { formula: "NaOH", coeff: 3, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Câ‚â‚‡Hâ‚ƒâ‚…COONa", coeff: 3, name: "Natri Stearat (XÃ  phÃ²ng)" },
      { formula: "Câ‚ƒHâ‚ˆOâ‚ƒ", coeff: 1, name: "Glixerol" }
    ],
    equation: "(Câ‚â‚‡Hâ‚ƒâ‚…COO)â‚ƒCâ‚ƒHâ‚… + 3NaOH â†’(tÂ°) 3Câ‚â‚‡Hâ‚ƒâ‚…COONa + Câ‚ƒHâ‚ˆOâ‚ƒ",
    gradeLevel: 12,
    category: "Lipit",
    conditions: "Äun nÃ³ng",
    observation: "Cháº¥t bÃ©o tan trong kiá»m, sau Ä‘Ã³ thÃªm NaCl bÃ£o hÃ²a tháº¥y xÃ  phÃ²ng ná»•i lÃªn trÃªn.",
    energy: -100,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_118",
    name: "Pháº£n á»©ng este hÃ³a giá»¯a Axit Axetic vÃ  Methanol",
    type: "double-replacement",
    reactants: [
      { formula: "CHâ‚ƒCOOH", coeff: 1, name: "Axit Axetic" },
      { formula: "CHâ‚ƒOH", coeff: 1, name: "RÆ°á»£u Metylic" }
    ],
    products: [
      { formula: "CHâ‚ƒCOOCHâ‚ƒ", coeff: 1, name: "Metyl Axetat" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "CHâ‚ƒCOOH + CHâ‚ƒOH â‡Œ(tÂ°, Hâ‚‚SOâ‚„) CHâ‚ƒCOOCHâ‚ƒ + Hâ‚‚O",
    gradeLevel: 12,
    category: "Este",
    conditions: "Äun nÃ³ng, Hâ‚‚SOâ‚„ Ä‘áº·c lÃ m xÃºc tÃ¡c",
    observation: "Táº¡o thÃ nh cháº¥t lá»ng khÃ´ng mÃ u, mÃ¹i thÆ¡m dá»… chá»‹u cá»§a este.",
    energy: -10,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_119",
    name: "Thá»§y phÃ¢n XenlulozÆ¡",
    type: "double-replacement",
    reactants: [
      { formula: "Cellulose", coeff: 1, name: "XenlulozÆ¡" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚â‚‚Oâ‚†", coeff: 1, name: "GlucozÆ¡" }
    ],
    equation: "(Câ‚†Hâ‚â‚€Oâ‚…)n + nHâ‚‚O â†’(tÂ°, Hâº) nCâ‚†Hâ‚â‚‚Oâ‚†",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Äun nÃ³ng lÃ¢u vá»›i xÃ¡c tÃ¡c axit Ä‘áº·c",
    observation: "NguyÃªn liá»‡u chá»©a xenlulozÆ¡ (bÃ´ng, gá»—) bá»‹ hÃ²a tan táº¡o dung dá»‹ch Ä‘Æ°á»ng.",
    energy: -5,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_120",
    name: "Pháº£n á»©ng nhá»±a Novolac (Phenol + FomanÄ‘ehit)",
    type: "combination",
    reactants: [
      { formula: "Câ‚†Hâ‚…OH", coeff: 1, name: "Phenol" },
      { formula: "HCHO", coeff: 1, name: "FomanÄ‘ehit" }
    ],
    products: [
      { formula: "Novolac", coeff: 1, name: "Nhá»±a Novolac" }
    ],
    equation: "nCâ‚†Hâ‚…OH + nHCHO â†’(Hâº, tÂ°) Nhá»±a Novolac + nHâ‚‚O",
    gradeLevel: 12,
    category: "Polyme",
    conditions: "XÃºc tÃ¡c Axit, dÆ° Phenol",
    observation: "Há»—n há»£p lá»ng chuyá»ƒn sang dáº¡ng nhá»±a dáº»o, rá»“i ráº¯n láº¡i khi nguá»™i.",
    energy: -150,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_121",
    name: "Pháº£n á»©ng trÃ¹ng há»£p Etilen (Táº¡o nhá»±a PE)",
    type: "combination",
    reactants: [
      { formula: "Câ‚‚Hâ‚„", coeff: 1, name: "Etilen" }
    ],
    products: [
      { formula: "(Câ‚‚Hâ‚„)n", coeff: 1, name: "Nhá»±a Polietilen" }
    ],
    equation: "nCHâ‚‚=CHâ‚‚ â†’(tÂ°, p, xt) (-CHâ‚‚-CHâ‚‚-)n",
    gradeLevel: 12,
    category: "Polyme",
    conditions: "Nhiá»‡t Ä‘á»™, Ã¡p suáº¥t cao, cháº¥t xÃºc tÃ¡c",
    observation: "KhÃ­ Etilen káº¿t há»£p thÃ nh cháº¥t ráº¯n dáº»o, mÃ u tráº¯ng Ä‘á»¥c.",
    energy: -90,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_122",
    name: "Pháº£n á»©ng trÃ¹ng há»£p Styren (Táº¡o nhá»±a PS)",
    type: "combination",
    reactants: [
      { formula: "Câ‚†Hâ‚…-CH=CHâ‚‚", coeff: 1, name: "Styren" }
    ],
    products: [
      { formula: "PS", coeff: 1, name: "Nhá»±a Polystyren" }
    ],
    equation: "nCâ‚†Hâ‚…-CH=CHâ‚‚ â†’(tÂ°, xt) (-CH(Câ‚†Hâ‚…)-CHâ‚‚-)n",
    gradeLevel: 12,
    category: "Polyme",
    conditions: "Nhiá»‡t Ä‘á»™, xÃºc tÃ¡c",
    observation: "Cháº¥t lá»ng chuyá»ƒn thÃ nh cháº¥t ráº¯n trong suá»‘t, giÃ²n.",
    energy: -70,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_123",
    name: "Anilin tÃ¡c dá»¥ng vá»›i HCl",
    type: "combination",
    reactants: [
      { formula: "Câ‚†Hâ‚…NHâ‚‚", coeff: 1, name: "Anilin" },
      { formula: "HCl", coeff: 1, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚…NHâ‚ƒCl", coeff: 1, name: "PhenylamÃ´ni Clorua" }
    ],
    equation: "Câ‚†Hâ‚…NHâ‚‚ + HCl â†’ Câ‚†Hâ‚…NHâ‚ƒCl",
    gradeLevel: 12,
    category: "Amin",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Anilin (Ã­t tan, váº©n Ä‘á»¥c) tan dáº§n táº¡o dung dá»‹ch trong suá»‘t.",
    energy: -60,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_124",
    name: "Pháº£n á»©ng trÃ¹ng há»£p Vinyl Clorua (Táº¡o nhá»±a PVC)",
    type: "combination",
    reactants: [
      { formula: "Câ‚‚Hâ‚ƒCl", coeff: 1, name: "Vinyl Clorua" }
    ],
    products: [
      { formula: "PVC", coeff: 1, name: "Nhá»±a PVC" }
    ],
    equation: "nCHâ‚‚=CHCl â†’(tÂ°, p, xt) (-CHâ‚‚-CHCl-)n",
    gradeLevel: 12,
    category: "Polyme",
    conditions: "Ãp suáº¥t, nhiá»‡t Ä‘á»™, cháº¥t xÃºc tÃ¡c",
    observation: "Táº¡o thÃ nh cháº¥t bá»™t mÃ u tráº¯ng, dÃ¹ng lÃ m á»‘ng nhá»±a.",
    energy: -100,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_125",
    name: "Pháº£n á»©ng mÃ u Biure cá»§a Protein",
    type: "combination",
    reactants: [
      { formula: "Protein", coeff: 1, name: "LÃ²ng tráº¯ng trá»©ng" },
      { formula: "Cu(OH)â‚‚", coeff: 1, name: "Äá»“ng(II) Hidroxit" }
    ],
    products: [
      { formula: "Protein-Cu", coeff: 1, name: "Há»£p cháº¥t mÃ u tÃ­m" }
    ],
    equation: "Protein + Cu(OH)â‚‚ â†’ Há»£p cháº¥t phá»©c mÃ u tÃ­m Ä‘áº·c trÆ°ng",
    gradeLevel: 12,
    category: "Peptit - Protein",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng, mÃ´i trÆ°á»ng kiá»m",
    observation: "HÃ²a tan káº¿t tá»§a Cu(OH)â‚‚ táº¡o dung dá»‹ch cÃ³ mÃ u tÃ­m Ä‘áº·c trÆ°ng.",
    energy: -10,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_126",
    name: "Nháº­n biáº¿t Ion FeÂ²âº báº±ng dung dá»‹ch kiá»m",
    type: "double-replacement",
    reactants: [
      { formula: "FeClâ‚‚", coeff: 1, name: "Sáº¯t(II) Clorua" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Fe(OH)â‚‚", coeff: 1, name: "Sáº¯t(II) Hidroxit" },
      { formula: "NaCl", coeff: 2, name: "Natri Clorua" }
    ],
    equation: "FeClâ‚‚ + 2NaOH â†’ Fe(OH)â‚‚â†“ + 2NaCl",
    gradeLevel: 11,
    category: "PhÃ¢n tÃ­ch Ä‘á»‹nh tÃ­nh",
    conditions: "KhÃ´ng cÃ³ khÃ´ng khÃ­",
    observation: "Xuáº¥t hiá»‡n káº¿t tá»§a tráº¯ng xanh.",
    energy: -30,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_127",
    name: "Nháº­n biáº¿t Ion FeÂ³âº báº±ng dung dá»‹ch kiá»m",
    type: "double-replacement",
    reactants: [
      { formula: "FeClâ‚ƒ", coeff: 1, name: "Sáº¯t(III) Clorua" },
      { formula: "NaOH", coeff: 3, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Fe(OH)â‚ƒ", coeff: 1, name: "Sáº¯t(III) Hidroxit" },
      { formula: "NaCl", coeff: 3, name: "Natri Clorua" }
    ],
    equation: "FeClâ‚ƒ + 3NaOH â†’ Fe(OH)â‚ƒâ†“ + 3NaCl",
    gradeLevel: 11,
    category: "PhÃ¢n tÃ­ch Ä‘á»‹nh tÃ­nh",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Xuáº¥t hiá»‡n káº¿t tá»§a mÃ u nÃ¢u Ä‘á».",
    energy: -45,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_128",
    name: "Oxy hÃ³a Sáº¯t(II) Hidroxit trong khÃ´ng khÃ­",
    type: "redox",
    reactants: [
      { formula: "Fe(OH)â‚‚", coeff: 4, name: "Sáº¯t(II) Hidroxit" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Fe(OH)â‚ƒ", coeff: 4, name: "Sáº¯t(III) Hidroxit" }
    ],
    equation: "4Fe(OH)â‚‚ + Oâ‚‚ + 2Hâ‚‚O â†’ 4Fe(OH)â‚ƒ",
    gradeLevel: 12,
    category: "PhÃ¢n tÃ­ch Ä‘á»‹nh tÃ­nh",
    conditions: "Tiáº¿p xÃºc khÃ´ng khÃ­ áº©m",
    observation: "Káº¿t tá»§a tráº¯ng xanh nhanh chÃ³ng chuyá»ƒn sang mÃ u nÃ¢u Ä‘á».",
    energy: -280,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_129",
    name: "Nháº­n biáº¿t Ion CuÂ²âº báº±ng Amoniac (DÆ° NHâ‚ƒ)",
    type: "combination",
    reactants: [
      { formula: "CuSOâ‚„", coeff: 1, name: "Äá»“ng(II) Sunfat" },
      { formula: "NHâ‚ƒ", coeff: 4, name: "Amoniac" }
    ],
    products: [
      { formula: "[Cu(NHâ‚ƒ)â‚„]SOâ‚„", coeff: 1, name: "Phá»©c Ä‘á»“ng-amoniac" }
    ],
    equation: "CuSOâ‚„ + 4NHâ‚ƒ â†’ [Cu(NHâ‚ƒ)â‚„]SOâ‚„",
    gradeLevel: 12,
    category: "PhÃ¢n tÃ­ch Ä‘á»‹nh tÃ­nh",
    conditions: "Dung dá»‹ch NHâ‚ƒ dÆ°",
    observation: "Táº¡o káº¿t tá»§a xanh, sau Ä‘Ã³ tan táº¡o dung dá»‹ch mÃ u xanh lam tháº«m Ä‘áº·c trÆ°ng.",
    energy: -120,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_130",
    name: "Nháº­n biáº¿t Ion AlÂ³âº báº±ng dung dá»‹ch kiá»m (DÆ° kiá»m)",
    type: "redox",
    reactants: [
      { formula: "AlClâ‚ƒ", coeff: 1, name: "NhÃ´m Clorua" },
      { formula: "NaOH", coeff: 4, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "NaAlOâ‚‚", coeff: 1, name: "Natri Aluminat" },
      { formula: "NaCl", coeff: 3, name: "Natri Clorua" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "AlClâ‚ƒ + 4NaOH â†’ NaAlOâ‚‚ + 3NaCl + 2Hâ‚‚O",
    gradeLevel: 12,
    category: "PhÃ¢n tÃ­ch Ä‘á»‹nh tÃ­nh",
    conditions: "NaOH dÆ°",
    observation: "Káº¿t tá»§a tráº¯ng keo tan hoÃ n toÃ n trong kiá»m dÆ°.",
    energy: -150,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_131",
    name: "Sáº¯t(III) Clorua tÃ¡c dá»¥ng vá»›i KI",
    type: "redox",
    reactants: [
      { formula: "FeClâ‚ƒ", coeff: 2, name: "Sáº¯t(III) Clorua" },
      { formula: "KI", coeff: 2, name: "Kali Iotua" }
    ],
    products: [
      { formula: "FeClâ‚‚", coeff: 2, name: "Sáº¯t(II) Clorua" },
      { formula: "KCl", coeff: 2, name: "Kali Clorua" },
      { formula: "Iâ‚‚", coeff: 1, name: "Iá»‘t" }
    ],
    equation: "2FeClâ‚ƒ + 2KI â†’ 2FeClâ‚‚ + 2KCl + Iâ‚‚",
    gradeLevel: 12,
    category: "Redox",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Dung dá»‹ch chuyá»ƒn tá»« vÃ ng nÃ¢u sang mÃ u Ä‘en tÃ­m cá»§a Iá»‘t.",
    energy: -120,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_132",
    name: "Thá»§y phÃ¢n Protein báº±ng Axit",
    type: "double-replacement",
    reactants: [
      { formula: "Protein", coeff: 1, name: "Protein" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Gly", coeff: 2, name: "Amino Acid (Glyxin)" }
    ],
    equation: "Protein + nHâ‚‚O â†’(Hâº) n Amino Acid",
    gradeLevel: 12,
    category: "Protein",
    conditions: "Äun nÃ³ng lÃ¢u",
    observation: "Protein bá»‹ phÃ¢n cáº¯t thÃ nh cÃ¡c amino acid Ä‘Æ¡n giáº£n.",
    energy: -5,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_133",
    name: "LÃªn men Axit Lactic (Tá»« GlucozÆ¡)",
    type: "decomposition",
    reactants: [
      { formula: "Câ‚†Hâ‚â‚‚Oâ‚†", coeff: 1, name: "GlucozÆ¡" }
    ],
    products: [
      { formula: "CHâ‚ƒCH(OH)COOH", coeff: 2, name: "Axit Lactic" }
    ],
    equation: "Câ‚†Hâ‚â‚‚Oâ‚† â†’ 2CHâ‚ƒCH(OH)COOH",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Vi khuáº©n lactic",
    observation: "Táº¡o thÃ nh vá»‹ chua cá»§a sá»¯a chua.",
    energy: -120,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_134",
    name: "Nháº­n biáº¿t Ion NHâ‚„âº báº±ng kiá»m",
    type: "double-replacement",
    reactants: [
      { formula: "NHâ‚„Cl", coeff: 1, name: "AmÃ´ni Clorua" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "NHâ‚ƒ", coeff: 1, name: "Amoniac" },
      { formula: "NaCl", coeff: 1, name: "Natri Clorua" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "NHâ‚„Cl + NaOH â†’ NaCl + NHâ‚ƒâ†‘ + Hâ‚‚O",
    gradeLevel: 11,
    category: "PhÃ¢n tÃ­ch Ä‘á»‹nh tÃ­nh",
    conditions: "Äun nháº¹",
    observation: "Giáº£i phÃ³ng khÃ­ mÃ¹i khai, lÃ m xanh giáº¥y quá»³ tÃ­m áº©m.",
    energy: -20,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_135",
    name: "Axit Nitric Ä‘áº·c nÃ³ng tÃ¡c dá»¥ng vá»›i S",
    type: "redox",
    reactants: [
      { formula: "S", coeff: 1, name: "LÆ°u huá»³nh" },
      { formula: "HNOâ‚ƒ", coeff: 6, name: "Axit Nitric Ä‘áº·c" }
    ],
    products: [
      { formula: "Hâ‚‚SOâ‚„", coeff: 1, name: "Axit Sunfuric" },
      { formula: "NOâ‚‚", coeff: 6, name: "NitÆ¡ Äioxit" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "S + 6HNOâ‚ƒ(Ä‘) â†’ Hâ‚‚SOâ‚„ + 6NOâ‚‚â†‘ + 2Hâ‚‚O",
    gradeLevel: 11,
    category: "NitÆ¡",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Giáº£i phÃ³ng khÃ­ nÃ¢u Ä‘á» NOâ‚‚.",
    energy: -380,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_136",
    name: "Pháº£n á»©ng cá»§a NHâ‚ƒ vá»›i khÃ­ Clo",
    type: "redox",
    reactants: [
      { formula: "NHâ‚ƒ", coeff: 2, name: "Amoniac" },
      { formula: "Clâ‚‚", coeff: 3, name: "KhÃ­ Clo" }
    ],
    products: [
      { formula: "Nâ‚‚", coeff: 1, name: "KhÃ­ NitÆ¡" },
      { formula: "HCl", coeff: 6, name: "Hydro Clo" }
    ],
    equation: "2NHâ‚ƒ + 3Clâ‚‚ â†’ Nâ‚‚ + 6HCl",
    gradeLevel: 11,
    category: "NitÆ¡",
    conditions: "Tá»± chÃ¡y trong khÃ­ Clo",
    observation: "Amoniac bÃ¹ng chÃ¡y trong Clo, táº¡o khÃ³i tráº¯ng.",
    energy: -460,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_137",
    name: "Báº¡c clorua bá»‹ phÃ¢n há»§y bá»Ÿi Ã¡nh sÃ¡ng",
    type: "decomposition",
    reactants: [
      { formula: "AgCl", coeff: 2, name: "Báº¡c Clorua" }
    ],
    products: [
      { formula: "Ag", coeff: 2, name: "Báº¡c" },
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" }
    ],
    equation: "2AgCl â†’ 2Ag + Clâ‚‚â†‘",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Ãnh sÃ¡ng máº·t trá»i",
    observation: "Káº¿t tá»§a tráº¯ng chuyá»ƒn sang mÃ u xÃ¡m Ä‘en cá»§a báº¡c.",
    energy: 127,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_138",
    name: "Pháº£n á»©ng giá»¯a SOâ‚‚ vÃ  Hâ‚‚S (Táº¡o LÆ°u huá»³nh vá»¥n)",
    type: "redox",
    reactants: [
      { formula: "SOâ‚‚", coeff: 1, name: "LÆ°u huá»³nh Äioxit" },
      { formula: "Hâ‚‚S", coeff: 2, name: "Hydro Sunfua" }
    ],
    products: [
      { formula: "S", coeff: 3, name: "LÆ°u huá»³nh" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    equation: "SOâ‚‚ + 2Hâ‚‚S â†’ 3Sâ†“ + 2Hâ‚‚O",
    gradeLevel: 10,
    category: "LÆ°u huá»³nh",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Xuáº¥t hiá»‡n lá»›p bá»™t mÃ u vÃ ng bÃ¡m trÃªn thÃ nh á»‘ng nghiá»‡m.",
    energy: -230,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_139",
    name: "TÃ­nh hÃ¡o nÆ°á»›c cá»§a Hâ‚‚SOâ‚„ Ä‘áº·c (ÄÆ°á»ng Äƒn)",
    type: "decomposition",
    reactants: [
      { formula: "Câ‚â‚‚Hâ‚‚â‚‚Oâ‚â‚", coeff: 1, name: "ÄÆ°á»ng SaccarozÆ¡" },
      { formula: "Hâ‚‚SOâ‚„", coeff: 1, name: "Axit Sunfuric Ä‘áº·c" }
    ],
    products: [
      { formula: "C", coeff: 12, name: "Cacbon" },
      { formula: "Hâ‚‚O", coeff: 11, name: "HÆ¡i nÆ°á»›c" }
    ],
    equation: "Câ‚â‚‚Hâ‚‚â‚‚Oâ‚â‚ â†’ 12C + 11Hâ‚‚O",
    gradeLevel: 10,
    category: "LÆ°u huá»³nh",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "ÄÆ°á»ng hÃ³a Ä‘en vÃ  trÃ o lÃªn khá»i cá»‘c nhÆ° cá»™t than.",
    energy: -500,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_140",
    name: "Äiá»u cháº¿ KhÃ­ Cacbonic trong Lab",
    type: "double-replacement",
    reactants: [
      { formula: "CaCOâ‚ƒ", coeff: 1, name: "ÄÃ¡ vÃ´i" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "CaClâ‚‚", coeff: 1, name: "Canxi Clorua" },
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "CaCOâ‚ƒ + 2HCl â†’ CaClâ‚‚ + COâ‚‚â†‘ + Hâ‚‚O",
    gradeLevel: 9,
    category: "Cacbon",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "ÄÃ¡ vÃ´i sá»§i bá»t khÃ­ máº¡nh máº½, tan dáº§n.",
    energy: -20,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_141",
    name: "Sáº£n xuáº¥t Gang (Khá»­ Feâ‚‚Oâ‚ƒ báº±ng CO)",
    type: "redox",
    reactants: [
      { formula: "Feâ‚‚Oâ‚ƒ", coeff: 1, name: "Oxit sáº¯t(III)" },
      { formula: "CO", coeff: 3, name: "Cacbon Monoxit" }
    ],
    products: [
      { formula: "Fe", coeff: 2, name: "Sáº¯t" },
      { formula: "COâ‚‚", coeff: 3, name: "KhÃ­ Cacbonic" }
    ],
    equation: "Feâ‚‚Oâ‚ƒ + 3CO â†’ 2Fe + 3COâ‚‚",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "Oxit Ä‘á» nÃ¢u chuyá»ƒn thÃ nh cháº¥t ráº¯n mÃ u xÃ¡m Ä‘en.",
    energy: -30,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_142",
    name: "Nháº­n biáº¿t há»“ tinh bá»™t báº±ng Iá»‘t",
    type: "combination",
    reactants: [
      { formula: "Starch", coeff: 1, name: "Há»“ tinh bá»™t" },
      { formula: "Iâ‚‚", coeff: 1, name: "Dung dá»‹ch Iá»‘t" }
    ],
    products: [
      { formula: "Starch-I2", coeff: 1, name: "Phá»©c mÃ u xanh tÃ­m" }
    ],
    equation: "Tinh bá»™t + Iâ‚‚ â†’ Há»£p cháº¥t mÃ u xanh tÃ­m",
    gradeLevel: 10,
    category: "Há»¯u cÆ¡",
    conditions: "Nhiá»‡t Ä‘á»™ phÃ²ng",
    observation: "Dung dá»‹ch chuyá»ƒn sang mÃ u xanh tÃ­m Ä‘áº·c trÆ°ng ngay láº­p tá»©c.",
    energy: -10,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_143",
    name: "Thá»§y phÃ¢n SaccarozÆ¡ báº±ng Axit",
    type: "double-replacement",
    reactants: [
      { formula: "Câ‚â‚‚Hâ‚‚â‚‚Oâ‚â‚", coeff: 1, name: "SaccarozÆ¡" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚â‚‚Oâ‚†", coeff: 2, name: "GlucozÆ¡ & FructozÆ¡" }
    ],
    equation: "Câ‚â‚‚Hâ‚‚â‚‚Oâ‚â‚ + Hâ‚‚O â†’(Hâº, tÂ°) Câ‚†Hâ‚â‚‚Oâ‚† + Câ‚†Hâ‚â‚‚Oâ‚†",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Äun nÃ³ng, xÃºc tÃ¡c Axit",
    observation: "SaccarozÆ¡ bá»‹ thá»§y phÃ¢n, táº¡o ra cÃ¡c Ä‘Æ°á»ng Ä‘Æ¡n cÃ³ tÃ­nh khá»­.",
    energy: -10,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_144",
    name: "Anilin tÃ¡c dá»¥ng vá»›i nÆ°á»›c Brom (Nháº­n biáº¿t)",
    type: "double-replacement",
    reactants: [
      { formula: "Câ‚†Hâ‚…NHâ‚‚", coeff: 1, name: "Anilin" },
      { formula: "Brâ‚‚", coeff: 3, name: "NÆ°á»›c Brom" }
    ],
    products: [
      { formula: "Câ‚†Hâ‚‚Brâ‚ƒNHâ‚‚", coeff: 1, name: "2,4,6-Tribromanilin" }
    ],
    equation: "Câ‚†Hâ‚…NHâ‚‚ + 3Brâ‚‚ â†’ Câ‚†Hâ‚‚Brâ‚ƒNHâ‚‚â†“ + 3HBr",
    gradeLevel: 12,
    category: "Amin",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Máº¥t mÃ u nÆ°á»›c brom, xuáº¥t hiá»‡n káº¿t tá»§a tráº¯ng.",
    energy: -120,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_145",
    name: "Nháº­n biáº¿t Ion Clâ» báº±ng Báº¡c Nitrat",
    type: "double-replacement",
    reactants: [
      { formula: "NaCl", coeff: 1, name: "Natri Clorua" },
      { formula: "AgNOâ‚ƒ", coeff: 1, name: "Báº¡c Nitrat" }
    ],
    products: [
      { formula: "AgCl", coeff: 1, name: "Báº¡c Clorua" },
      { formula: "NaNOâ‚ƒ", coeff: 1, name: "Natri Nitrat" }
    ],
    equation: "NaCl + AgNOâ‚ƒ â†’ AgClâ†“ + NaNOâ‚ƒ",
    gradeLevel: 10,
    category: "PhÃ¢n tÃ­ch Ä‘á»‹nh tÃ­nh",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Xuáº¥t hiá»‡n káº¿t tá»§a tráº¯ng vÃ³n cá»¥c, khÃ´ng tan trong axit.",
    energy: -65,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_146",
    name: "Nháº­n biáº¿t Ion SOâ‚„Â²â» báº±ng Bari Clorua",
    type: "double-replacement",
    reactants: [
      { formula: "Naâ‚‚SOâ‚„", coeff: 1, name: "Natri Sunfat" },
      { formula: "BaClâ‚‚", coeff: 1, name: "Bari Clorua" }
    ],
    products: [
      { formula: "BaSOâ‚„", coeff: 1, name: "Bari Sunfat" },
      { formula: "NaCl", coeff: 2, name: "Natri Clorua" }
    ],
    equation: "Naâ‚‚SOâ‚„ + BaClâ‚‚ â†’ BaSOâ‚„â†“ + 2NaCl",
    gradeLevel: 10,
    category: "PhÃ¢n tÃ­ch Ä‘á»‹nh tÃ­nh",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Xuáº¥t hiá»‡n káº¿t tá»§a tráº¯ng, bá»n trong axit.",
    energy: -40,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_147",
    name: "Nháº­n biáº¿t Ion POâ‚„Â³â» báº±ng Báº¡c Nitrat",
    type: "double-replacement",
    reactants: [
      { formula: "Naâ‚ƒPOâ‚„", coeff: 1, name: "Natri Photphat" },
      { formula: "AgNOâ‚ƒ", coeff: 3, name: "Báº¡c Nitrat" }
    ],
    products: [
      { formula: "Agâ‚ƒPOâ‚„", coeff: 1, name: "Báº¡c Photphat" },
      { formula: "NaNOâ‚ƒ", coeff: 3, name: "Natri Nitrat" }
    ],
    equation: "Naâ‚ƒPOâ‚„ + 3AgNOâ‚ƒ â†’ Agâ‚ƒPOâ‚„â†“ + 3NaNOâ‚ƒ",
    gradeLevel: 11,
    category: "PhÃ¢n tÃ­ch Ä‘á»‹nh tÃ­nh",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Xuáº¥t hiá»‡n káº¿t tá»§a mÃ u vÃ ng tinh khiáº¿t.",
    energy: -150,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_148",
    name: "NhÃ´m tÃ¡c dá»¥ng vá»›i Axit Nitric (Táº¡o khÃ­ Nâ‚‚O)",
    type: "redox",
    reactants: [
      { formula: "Al", coeff: 8, name: "NhÃ´m" },
      { formula: "HNOâ‚ƒ", coeff: 30, name: "Axit Nitric loÃ£ng" }
    ],
    products: [
      { formula: "Al(NOâ‚ƒ)â‚ƒ", coeff: 8, name: "NhÃ´m Nitrat" },
      { formula: "Nâ‚‚O", coeff: 3, name: "KhÃ­ CÆ°á»i" },
      { formula: "Hâ‚‚O", coeff: 15, name: "NÆ°á»›c" }
    ],
    equation: "8Al + 30HNOâ‚ƒ â†’ 8Al(NOâ‚ƒ)â‚ƒ + 3Nâ‚‚O + 15Hâ‚‚O",
    gradeLevel: 12,
    category: "Redox",
    conditions: "Axit Nitric loÃ£ng",
    observation: "NhÃ´m tan, giáº£i phÃ³ng bá»t khÃ­ khÃ´ng mÃ u.",
    energy: -4500,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_149",
    name: "Äá»‘t chÃ¡y Magie trong hÆ¡i nÆ°á»›c",
    type: "redox",
    reactants: [
      { formula: "Mg", coeff: 1, name: "MagiÃª" },
      { formula: "Hâ‚‚O", coeff: 2, name: "HÆ¡i nÆ°á»›c" }
    ],
    products: [
      { formula: "Mg(OH)â‚‚", coeff: 1, name: "MagiÃª Hidroxit" },
      { formula: "Hâ‚‚", coeff: 1, name: "KhÃ­ Hydro" }
    ],
    equation: "Mg + 2Hâ‚‚O â†’ Mg(OH)â‚‚ + Hâ‚‚â†‘",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao",
    observation: "MagiÃª chÃ¡y sÃ¡ng trong hÆ¡i nÆ°á»›c giáº£i phÃ³ng Hydro.",
    energy: -350,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_150",
    name: "NhÃ´m tÃ¡c dá»¥ng vá»›i Axit Nitric ráº¥t loÃ£ng (Táº¡o NHâ‚„âº)",
    type: "redox",
    reactants: [
      { formula: "Al", coeff: 8, name: "NhÃ´m" },
      { formula: "HNOâ‚ƒ", coeff: 30, name: "Axit Nitric ráº¥t loÃ£ng" }
    ],
    products: [
      { formula: "Al(NOâ‚ƒ)â‚ƒ", coeff: 8, name: "NhÃ´m Nitrat" },
      { formula: "NHâ‚„NOâ‚ƒ", coeff: 3, name: "AmÃ´ni Nitrat" },
      { formula: "Hâ‚‚O", coeff: 9, name: "NÆ°á»›c" }
    ],
    equation: "8Al + 30HNOâ‚ƒ â†’ 8Al(NOâ‚ƒ)â‚ƒ + 3NHâ‚„NOâ‚ƒ + 9Hâ‚‚O",
    gradeLevel: 12,
    category: "Redox",
    conditions: "Axit Nitric cá»±c loÃ£ng",
    observation: "NhÃ´m tan nhÆ°ng khÃ´ng tháº¥y bá»t khÃ­ thoÃ¡t ra.",
    energy: -5000,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_151",
    name: "Baking Soda tÃ¡c dá»¥ng vá»›i Axit dáº¡ dÃ y",
    type: "double-replacement",
    reactants: [
      { formula: "NaHCOâ‚ƒ", coeff: 1, name: "Baking Soda" },
      { formula: "HCl", coeff: 1, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "NaCl", coeff: 1, name: "Muá»‘i" },
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­" },
      { formula: "Hâ‚‚O", coeff: 1, name: "NÆ°á»›c" }
    ],
    equation: "NaHCOâ‚ƒ + HCl â†’ NaCl + Hâ‚‚O + COâ‚‚â†‘",
    gradeLevel: 9,
    category: "á»¨ng dá»¥ng",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Sá»§i bá»t khÃ­ máº¡nh (giÃºp giáº£m Ä‘áº§y hÆ¡i).",
    energy: -20,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_152",
    name: "Káº¿t tá»§a Bari Sunfat do tÃ¡c dá»¥ng cá»§a axit",
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
    gradeLevel: 10,
    category: "PhÃ¢n tÃ­ch Ä‘á»‹nh tÃ­nh",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Káº¿t tá»§a tráº¯ng má»‹n xuáº¥t hiá»‡n ngay láº­p tá»©c.",
    energy: -45,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_153",
    name: "Natri Peroxit tÃ¡c dá»¥ng vá»›i nÆ°á»›c (Giáº£i phÃ³ng Oxy)",
    type: "redox",
    reactants: [
      { formula: "Naâ‚‚Oâ‚‚", coeff: 2, name: "Natri Peroxit" },
      { formula: "Hâ‚‚O", coeff: 2, name: "NÆ°á»›c" }
    ],
    products: [
      { formula: "NaOH", coeff: 4, name: "Natri Hidroxit" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    equation: "2Naâ‚‚Oâ‚‚ + 2Hâ‚‚O â†’ 4NaOH + Oâ‚‚â†‘",
    gradeLevel: 12,
    category: "Kim loáº¡i kiá»m",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Sá»§i bá»t khÃ­ Oxy máº¡nh máº½, tá»a nhiá»‡t.",
    energy: -200,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_154",
    name: "Äá»‘t chÃ¡y Ma TrÆ¡i (Phosphine)",
    type: "redox",
    reactants: [
      { formula: "PHâ‚ƒ", coeff: 2, name: "Phosphine" },
      { formula: "Oâ‚‚", coeff: 4, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "Pâ‚‚Oâ‚…", coeff: 1, name: "Pentaoxit" },
      { formula: "Hâ‚‚O", coeff: 3, name: "HÆ¡i nÆ°á»›c" }
    ],
    equation: "2PHâ‚ƒ + 4Oâ‚‚ â†’ Pâ‚‚Oâ‚… + 3Hâ‚‚O",
    gradeLevel: 11,
    category: "NitÆ¡ - Photpho",
    conditions: "Tá»± chÃ¡y trong khÃ´ng khÃ­",
    observation: "KhÃ­ tá»± chÃ¡y trong khÃ´ng khÃ­ táº¡o khÃ³i tráº¯ng, Ã¡nh sÃ¡ng xanh má».",
    energy: -1200,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_155",
    name: "Luyá»‡n thÃ©p (OxihÃ³a Cacbon trong gang)",
    type: "redox",
    reactants: [
      { formula: "C", coeff: 1, name: "Cacbon" },
      { formula: "Oâ‚‚", coeff: 1, name: "KhÃ­ Oxy" }
    ],
    products: [
      { formula: "COâ‚‚", coeff: 1, name: "KhÃ­ Cacbonic" }
    ],
    equation: "C + Oâ‚‚ â†’ COâ‚‚",
    gradeLevel: 12,
    category: "Kim loáº¡i",
    conditions: "Nhiá»‡t Ä‘á»™ cao (LÃ² oxy)",
    observation: "HÃ m lÆ°á»£ng cacbon giáº£m giÃºp gang chuyá»ƒn thÃ nh thÃ©p.",
    energy: -393,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_156",
    name: "Nháº­n biáº¿t Ion CuÂ²âº báº±ng dung dá»‹ch kiá»m",
    type: "double-replacement",
    reactants: [
      { formula: "CuSOâ‚„", coeff: 1, name: "Äá»“ng(II) Sunfat" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Cu(OH)â‚‚", coeff: 1, name: "Äá»“ng Hidroxit" },
      { formula: "Naâ‚‚SOâ‚„", coeff: 1, name: "Natri Sunfat" }
    ],
    equation: "CuSOâ‚„ + 2NaOH â†’ Cu(OH)â‚‚â†“ + Naâ‚‚SOâ‚„",
    gradeLevel: 11,
    category: "PhÃ¢n tÃ­ch Ä‘á»‹nh tÃ­nh",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Káº¿t tá»§a xanh lÆ¡ dáº¡ng keo.",
    energy: -40,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_157",
    name: "Äun nÃ³ng SÃ©t (Sáº£n xuáº¥t gá»‘m)",
    type: "decomposition",
    reactants: [
      { formula: "Clay", coeff: 1, name: "SÃ©t" }
    ],
    products: [
      { formula: "Ceramic", coeff: 1, name: "Gá»‘m sá»©" }
    ],
    equation: "SÃ©t (chÆ°a nung) â†’(tÂ°) Gá»‘m sá»©",
    gradeLevel: 11,
    category: "Silicat",
    conditions: "Nhiá»‡t Ä‘á»™ ráº¥t cao (~1000Â°C)",
    observation: "NguyÃªn liá»‡u má»m dáº»o biáº¿n thÃ nh váº­t liá»‡u cá»©ng, giÃ²n.",
    energy: 100,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_158",
    name: "Pháº£n á»©ng cá»§a Clo vá»›i dung dá»‹ch KI",
    type: "redox",
    reactants: [
      { formula: "Clâ‚‚", coeff: 1, name: "KhÃ­ Clo" },
      { formula: "KI", coeff: 2, name: "Kali Iotua" }
    ],
    products: [
      { formula: "KCl", coeff: 2, name: "Kali Clorua" },
      { formula: "Iâ‚‚", coeff: 1, name: "Iá»‘t" }
    ],
    equation: "Clâ‚‚ + 2KI â†’ 2KCl + Iâ‚‚",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Dung dá»‹ch khÃ´ng mÃ u chuyá»ƒn sang mÃ u nÃ¢u Ä‘áº·c trÆ°ng cá»§a Iá»‘t.",
    energy: -150,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_159",
    name: "Nháº­n biáº¿t Ion Brâ» báº±ng Báº¡c Nitrat",
    type: "double-replacement",
    reactants: [
      { formula: "NaBr", coeff: 1, name: "Natri Bromua" },
      { formula: "AgNOâ‚ƒ", coeff: 1, name: "Báº¡c Nitrat" }
    ],
    products: [
      { formula: "AgBr", coeff: 1, name: "Báº¡c Bromua" },
      { formula: "NaNOâ‚ƒ", coeff: 1, name: "Natri Nitrat" }
    ],
    equation: "NaBr + AgNOâ‚ƒ â†’ AgBrâ†“ + NaNOâ‚ƒ",
    gradeLevel: 10,
    category: "PhÃ¢n tÃ­ch Ä‘á»‹nh tÃ­nh",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Xuáº¥t hiá»‡n káº¿t tá»§a mÃ u vÃ ng nháº¡t.",
    energy: -70,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
  {
    id: "rx_160",
    name: "Nháº­n biáº¿t Ion Iâ» báº±ng Báº¡c Nitrat",
    type: "double-replacement",
    reactants: [
      { formula: "NaI", coeff: 1, name: "Natri Iotua" },
      { formula: "AgNOâ‚ƒ", coeff: 1, name: "Báº¡c Nitrat" }
    ],
    products: [
      { formula: "AgI", coeff: 1, name: "Báº¡c Iotua" },
      { formula: "NaNOâ‚ƒ", coeff: 1, name: "Natri Nitrat" }
    ],
    equation: "NaI + AgNOâ‚ƒ â†’ AgIâ†“ + NaNOâ‚ƒ",
    gradeLevel: 10,
    category: "PhÃ¢n tÃ­ch Ä‘á»‹nh tÃ­nh",
    conditions: "Nhiá»‡t Ä‘á»™ thÆ°á»ng",
    observation: "Xuáº¥t hiá»‡n káº¿t tá»§a mÃ u vÃ ng Ä‘áº­m.",
    energy: -80,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "ThÃ­ nghiá»‡m an toÃ n, cÃ³ thá»ƒ thá»±c hiá»‡n trÃªn mÃ´ phá»ng",
    isBlocked: false
  },
];
