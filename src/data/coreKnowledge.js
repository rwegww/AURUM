/**
 * KIáº¾N THá»¨C Cá»T LÃ•I - Core Knowledge Data
 * Maps each knowledge topic in CHEMISTRY_KNOWLEDGE_BASE to specific curriculum bai_hoc.
 * Used by KnowledgeMap to navigate directly to related bai_hoc.
 * 
 * IMPORTANT: lessonId must match the string ID in the database (e.g., "hoa10_kntt_bai1")
 */

export const CORE_KNOWLEDGE_LESSONS = {
  // === Äáº I CÆ¯Æ NG ===
  'atom-structure': [
    { classId: 10, lessonId: 'hoa10_kntt_bai1', title: 'BÃ i 1: ThÃ nh pháº§n cá»§a nguyÃªn tá»­' },
    { classId: 10, lessonId: 'hoa10_kntt_bai2', title: 'BÃ i 2: NguyÃªn tá»‘ hÃ³a há»c' },
  ],
  'isotope': [
    { classId: 10, lessonId: 'hoa10_kntt_bai2', title: 'BÃ i 2: NguyÃªn tá»‘ hÃ³a há»c' },
  ],
  'electron-config': [
    { classId: 10, lessonId: 'hoa10_kntt_bai3', title: 'BÃ i 3: Cáº¥u trÃºc lá»›p vá» electron nguyÃªn tá»­' },
  ],
  'periodic-law': [
    { classId: 10, lessonId: 'hoa10_kntt_bai5', title: 'BÃ i 5: Cáº¥u táº¡o cá»§a báº£ng tuáº§n hoÃ n' },
    { classId: 10, lessonId: 'hoa10_kntt_bai8', title: 'BÃ i 8: Äá»‹nh luáº­t tuáº§n hoÃ n and Ã½ nghÄ©a' },
  ],
  'periodic-trends': [
    { classId: 10, lessonId: 'hoa10_kntt_bai6', title: 'BÃ i 6: Xu hÆ°á»›ng biáº¿n Ä‘á»•i tÃ­nh cháº¥t cá»§a nguyÃªn tá»­' },
    { classId: 10, lessonId: 'hoa10_kntt_bai7', title: 'BÃ i 7: Xu hÆ°á»›ng biáº¿n Ä‘á»•i tÃ­nh cháº¥t cá»§a há»£p cháº¥t' },
  ],
  'metals-nonmetals': [
    { classId: 9, lessonId: 'hoa9_kntt_bai4', title: 'BÃ i 4: PhÃ¢n biá»‡t Phi kim vÃ  Kim loáº¡i' },
    { classId: 9, lessonId: 'hoa9_kntt_bai16', title: 'BÃ i 16: SÆ¡ lÆ°á»£c vá» hÃ³a há»c vá» TrÃ¡i Äáº¥t' },
    { classId: 10, lessonId: 'hoa10_kntt_bai6', title: 'BÃ i 6: Xu hÆ°á»›ng biáº¿n Ä‘á»•i tÃ­nh cháº¥t cá»§a nguyÃªn tá»­' },
    { classId: 12, lessonId: 'hoa12_kntt_bai18', title: 'BÃ i 18: Cáº¥u táº¡o vÃ  liÃªn káº¿t trong tinh thá»ƒ kim loáº¡i' },
    { classId: 12, lessonId: 'hoa12_kntt_bai19', title: 'BÃ i 19: TÃ­nh cháº¥t váº­t lÃ­ vÃ  hoÃ¡ há»c cá»§a kim loáº¡i' },
  ],

  // === LIÃŠN Káº¾T ===
  'chemical-bonding': [
    { classId: 10, lessonId: 'hoa10_kntt_bai10', title: 'BÃ i 10: Quy táº¯c octet' },
    { classId: 10, lessonId: 'hoa10_kntt_bai11', title: 'BÃ i 11: LiÃªn káº¿t ion' },
    { classId: 10, lessonId: 'hoa10_kntt_bai12', title: 'BÃ i 12: LiÃªn káº¿t cá»™ng hÃ³a trá»‹' },
  ],
  'ionic-bond': [
    { classId: 10, lessonId: 'hoa10_kntt_bai11', title: 'BÃ i 11: LiÃªn káº¿t ion' },
  ],
  'covalent-bond': [
    { classId: 10, lessonId: 'hoa10_kntt_bai12', title: 'BÃ i 12: LiÃªn káº¿t cá»™ng hÃ³a trá»‹' },
  ],
  'metallic-bond': [
    { classId: 10, lessonId: 'hoa10_kntt_bai13', title: 'BÃ i 13: LiÃªn káº¿t hydrogen and TÆ°Æ¡ng tÃ¡c van der Waals' },
    { classId: 12, lessonId: 'hoa12_kntt_bai18', title: 'BÃ i 18: Cáº¥u táº¡o vÃ  liÃªn káº¿t trong tinh thá»ƒ kim loáº¡i' },
  ],

  // === MOL VÃ€ Äá»ŠNH LÆ¯á»¢NG ===
  'mole-concept': [
    { classId: 8, lessonId: 'hoa8_kntt_bai3', title: 'BÃ i 3: Mol vÃ  tá»‰ khá»‘i cháº¥t khÃ­' },
    { classId: 8, lessonId: 'hoa8_kntt_bai6', title: 'BÃ i 6: TÃ­nh toÃ¡n theo phÆ°Æ¡ng trÃ¬nh hÃ³a há»c' },
    { classId: 10, lessonId: 'hoa10_kntt_bai1', title: 'BÃ i 1: ThÃ nh pháº§n cá»§a nguyÃªn tá»­' },
    { classId: 10, lessonId: 'hoa10_kntt_bai2', title: 'BÃ i 2: NguyÃªn tá»‘ hÃ³a há»c' },
  ],
  'molar-mass': [
    { classId: 8, lessonId: 'hoa8_kntt_bai3', title: 'BÃ i 3: Mol vÃ  tá»‰ khá»‘i cháº¥t khÃ­' },
    { classId: 10, lessonId: 'hoa10_kntt_bai2', title: 'BÃ i 2: NguyÃªn tá»‘ hÃ³a há»c' },
  ],
  'mol-mass': [
    { classId: 8, lessonId: 'hoa8_kntt_bai3', title: 'BÃ i 3: Mol vÃ  tá»‰ khá»‘i cháº¥t khÃ­' },
    { classId: 10, lessonId: 'hoa10_kntt_bai2', title: 'BÃ i 2: NguyÃªn tá»‘ hÃ³a há»c' },
  ],
  'mol-particles': [
    { classId: 8, lessonId: 'hoa8_kntt_bai3', title: 'BÃ i 3: Mol vÃ  tá»‰ khá»‘i cháº¥t khÃ­' },
    { classId: 10, lessonId: 'hoa10_kntt_bai1', title: 'BÃ i 1: ThÃ nh pháº§n cá»§a nguyÃªn tá»­' },
  ],
  'mol-vol': [
    { classId: 8, lessonId: 'hoa8_kntt_bai3', title: 'BÃ i 3: Mol vÃ  tá»‰ khá»‘i cháº¥t khÃ­' },
    { classId: 10, lessonId: 'hoa10_kntt_bai2', title: 'BÃ i 2: NguyÃªn tá»‘ hÃ³a há»c' },
  ],

  // === CHáº¤T KHÃ ===
  'ideal-gas': [
    { classId: 11, lessonId: 'hoa11_kntt_bai1', title: 'BÃ i 1: KhÃ¡i niá»‡m vá» cÃ¢n báº±ng hÃ³a há»c' },
  ],
  'boyle-law': [
    { classId: 11, lessonId: 'hoa11_kntt_bai1', title: 'BÃ i 1: KhÃ¡i niá»‡m vá» cÃ¢n báº±ng hÃ³a há»c' },
  ],
  'charles-law': [
    { classId: 11, lessonId: 'hoa11_kntt_bai1', title: 'BÃ i 1: KhÃ¡i niá»‡m vá» cÃ¢n báº±ng hÃ³a há»c' },
  ],
  'density-gas': [
    { classId: 8, lessonId: 'hoa8_kntt_bai3', title: 'BÃ i 3: Mol vÃ  tá»‰ khá»‘i cháº¥t khÃ­' },
    { classId: 11, lessonId: 'hoa11_kntt_bai4', title: 'BÃ i 4: Nitrogen' },
  ],

  // === DUNG Dá»ŠCH ===
  'solution-basic': [
    { classId: 8, lessonId: 'hoa8_kntt_bai4', title: 'BÃ i 4: Dung dá»‹ch vÃ  Ná»“ng Ä‘á»™' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'BÃ i 2: CÃ¢n báº±ng trong dung dá»‹ch nÆ°á»›c' },
  ],
  'molar-conc': [
    { classId: 8, lessonId: 'hoa8_kntt_bai4', title: 'BÃ i 4: Dung dá»‹ch vÃ  Ná»“ng Ä‘á»™' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'BÃ i 2: CÃ¢n báº±ng trong dung dá»‹ch nÆ°á»›c' },
  ],
  'percent-conc': [
    { classId: 8, lessonId: 'hoa8_kntt_bai4', title: 'BÃ i 4: Dung dá»‹ch vÃ  Ná»“ng Ä‘á»™' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'BÃ i 2: CÃ¢n báº±ng trong dung dá»‹ch nÆ°á»›c' },
  ],
  'dilution': [
    { classId: 8, lessonId: 'hoa8_kntt_bai4', title: 'BÃ i 4: Dung dá»‹ch vÃ  Ná»“ng Ä‘á»™' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'BÃ i 2: CÃ¢n báº±ng trong dung dá»‹ch nÆ°á»›c' },
  ],
  'solubility': [
    { classId: 8, lessonId: 'hoa8_kntt_bai4', title: 'BÃ i 4: Dung dá»‹ch vÃ  Ná»“ng Ä‘á»™' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'BÃ i 2: CÃ¢n báº±ng trong dung dá»‹ch nÆ°á»›c' },
  ],
  'electrolyte': [
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'BÃ i 2: CÃ¢n báº±ng trong dung dá»‹ch nÆ°á»›c' },
  ],

  // === AXIT â€“ BAZÆ  â€“ MUá»I ===
  'acid-definition': [
    { classId: 8, lessonId: 'hoa8_kntt_bai8', title: 'BÃ i 8: acid' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'BÃ i 2: CÃ¢n báº±ng trong dung dá»‹ch nÆ°á»›c' },
    { classId: 11, lessonId: 'hoa11_kntt_bai8', title: 'BÃ i 8: Sulfuric acid and muá»‘i sulfate' },
  ],
  'base-definition': [
    { classId: 8, lessonId: 'hoa8_kntt_bai9', title: 'BÃ i 9: Base - Thang pH' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'BÃ i 2: CÃ¢n báº±ng trong dung dá»‹ch nÆ°á»›c' },
    { classId: 11, lessonId: 'hoa11_kntt_bai5', title: 'BÃ i 5: Ammonia â€“ Muá»‘i ammonium' },
  ],
  'salt-definition': [
    { classId: 8, lessonId: 'hoa8_kntt_bai11', title: 'BÃ i 11: muá»‘i' },
    { classId: 8, lessonId: 'hoa8_kntt_bai12', title: 'BÃ i 12: PhÃ¢n bÃ³n hÃ³a há»c' },
    { classId: 9, lessonId: 'hoa9_kntt_bai17', title: 'BÃ i 17: Khai thÃ¡c Ä‘Ã¡ vÃ´i. CÃ´ng nghiá»‡p Silicate' },
    { classId: 11, lessonId: 'hoa11_kntt_bai5', title: 'BÃ i 5: Ammonia â€“ Muá»‘i ammonium' },
    { classId: 11, lessonId: 'hoa11_kntt_bai8', title: 'BÃ i 8: Sulfuric acid and muá»‘i sulfate' },
  ],
  'oxide-classification': [
    { classId: 8, lessonId: 'hoa8_kntt_bai10', title: 'BÃ i 10: oxide' },
    { classId: 11, lessonId: 'hoa11_kntt_bai6', title: 'BÃ i 6: Má»™t sá»‘ há»£p cháº¥t cá»§a nitrogen vá»›i oxygen' },
    { classId: 11, lessonId: 'hoa11_kntt_bai7', title: 'BÃ i 7: Sulfur and sulfur dioxide' },
  ],
  'neutralization': [
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'BÃ i 2: CÃ¢n báº±ng trong dung dá»‹ch nÆ°á»›c' },
  ],
  'ph-scale': [
    { classId: 8, lessonId: 'hoa8_kntt_bai9', title: 'BÃ i 9: Base - Thang pH' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'BÃ i 2: CÃ¢n báº±ng trong dung dá»‹ch nÆ°á»›c' },
  ],
  'strong-weak-acid-base': [
    { classId: 8, lessonId: 'hoa8_kntt_bai8', title: 'BÃ i 8: acid' },
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'BÃ i 2: CÃ¢n báº±ng trong dung dá»‹ch nÆ°á»›c' },
  ],

  // === PHáº¢N á»¨NG HÃ“A Há»ŒC ===
  'precipitation': [
    { classId: 11, lessonId: 'hoa11_kntt_bai2', title: 'BÃ i 2: CÃ¢n báº±ng trong dung dá»‹ch nÆ°á»›c' },
  ],
  'gas-evolution': [
    { classId: 11, lessonId: 'hoa11_kntt_bai6', title: 'BÃ i 6: Má»™t sá»‘ há»£p cháº¥t cá»§a nitrogen vá»›i oxygen' },
  ],
  'reaction-classification': [
    { classId: 8, lessonId: 'hoa8_kntt_bai2', title: 'BÃ i 2: Pháº£n á»©ng hÃ³a há»c' },
    { classId: 8, lessonId: 'hoa8_kntt_bai5', title: 'BÃ i 5: Äá»‹nh luáº­t báº£o toÃ n khá»‘i lÆ°á»£ng vÃ  PhÆ°Æ¡ng trÃ¬nh hÃ³a há»c' },
    { classId: 10, lessonId: 'hoa10_kntt_bai15', title: 'BÃ i 15: Pháº£n á»©ng oxi hÃ³a - khá»­' },
  ],

  // === Äá»˜NG HÃ“A Há»ŒC ===
  'reaction-rate': [
    { classId: 8, lessonId: 'hoa8_kntt_bai7', title: 'BÃ i 7: Tá»‘c Ä‘á»™ pháº£n á»©ng vÃ  cháº¥t xÃºc tÃ¡c' },
    { classId: 10, lessonId: 'hoa10_kntt_bai19', title: 'BÃ i 19: Tá»‘c Ä‘á»™ pháº£n á»©ng' },
  ],
  'catalyst': [
    { classId: 8, lessonId: 'hoa8_kntt_bai7', title: 'BÃ i 7: Tá»‘c Ä‘á»™ pháº£n á»©ng vÃ  cháº¥t xÃºc tÃ¡c' },
    { classId: 10, lessonId: 'hoa10_kntt_bai19', title: 'BÃ i 19: Tá»‘c Ä‘á»™ pháº£n á»©ng' },
  ],

  // === CÃ‚N Báº°NG HÃ“A Há»ŒC ===
  'chemical-equilibrium': [
    { classId: 11, lessonId: 'hoa11_kntt_bai1', title: 'BÃ i 1: KhÃ¡i niá»‡m vá» cÃ¢n báº±ng hÃ³a há»c' },
  ],
  'le-chatelier': [
    { classId: 11, lessonId: 'hoa11_kntt_bai1', title: 'BÃ i 1: KhÃ¡i niá»‡m vá» cÃ¢n báº±ng hÃ³a há»c' },
  ],

  // === NHIá»†T HÃ“A Há»ŒC ===
  'enthalpy': [
    { classId: 10, lessonId: 'hoa10_kntt_bai17', title: 'BÃ i 17: Biáº¿n thiÃªn enthalpy trong cÃ¡c pháº£n á»©ng hÃ³a há»c' },
  ],
  'hess-law': [
    { classId: 10, lessonId: 'hoa10_kntt_bai17', title: 'BÃ i 17: Biáº¿n thiÃªn enthalpy trong cÃ¡c pháº£n á»©ng hÃ³a há»c' },
  ],

  // === OXI HÃ“A â€“ KHá»¬ ===
  'redox': [
    { classId: 10, lessonId: 'hoa10_kntt_bai15', title: 'BÃ i 15: Pháº£n á»©ng oxi hÃ³a - khá»­' },
  ],
  'oxidation-number': [
    { classId: 10, lessonId: 'hoa10_kntt_bai15', title: 'BÃ i 15: Pháº£n á»©ng oxi hÃ³a - khá»­' },
  ],

  // === ÄIá»†N HÃ“A ===
  'electrochemistry': [
    { classId: 12, lessonId: 'hoa12_kntt_bai15', title: 'BÃ i 15: Tháº¿ Ä‘iá»‡n cá»±c vÃ  nguá»“n Ä‘iá»‡n hoÃ¡ há»c' },
  ],
  'electrolysis': [
    { classId: 12, lessonId: 'hoa12_kntt_bai15', title: 'BÃ i 15: Tháº¿ Ä‘iá»‡n cá»±c vÃ  nguá»“n Ä‘iá»‡n hoÃ¡ há»c' },
  ],

  // === KIM LOáº I ===
  'metal-activity-series': [
    { classId: 9, lessonId: 'hoa9_kntt_bai2', title: 'BÃ i 2: DÃ£y hoáº¡t Ä‘á»™ng hÃ³a há»c' },
    { classId: 12, lessonId: 'hoa12_kntt_bai19', title: 'BÃ i 19: TÃ­nh cháº¥t váº­t lÃ­ vÃ  hoÃ¡ há»c cá»§a kim loáº¡i' },
  ],
  'metal-properties': [
    { classId: 9, lessonId: 'hoa9_kntt_bai1', title: 'BÃ i 1: TÃ­nh cháº¥t chung cá»§a kim loáº¡i' },
    { classId: 9, lessonId: 'hoa9_kntt_bai3', title: 'BÃ i 3: TÃ¡ch kim loáº¡i vÃ  sá»­ dá»¥ng há»£p kim' },
    { classId: 12, lessonId: 'hoa12_kntt_bai18', title: 'BÃ i 18: Cáº¥u táº¡o vÃ  liÃªn káº¿t trong tinh thá»ƒ kim loáº¡i' },
    { classId: 12, lessonId: 'hoa12_kntt_bai19', title: 'BÃ i 19: TÃ­nh cháº¥t váº­t lÃ­ vÃ  hoÃ¡ há»c cá»§a kim loáº¡i' },
  ],
  'corrosion': [
    { classId: 12, lessonId: 'hoa12_kntt_bai22', title: 'BÃ i 22: Sá»± Äƒn mÃ²n kim loáº¡i' },
  ],

  // === PHI KIM ===
  'nonmetal-properties': [
    { classId: 10, lessonId: 'hoa10_kntt_bai21', title: 'BÃ i 21: NhÃ³m halogen' },
  ],
  'halogen': [
    { classId: 10, lessonId: 'hoa10_kntt_bai21', title: 'BÃ i 21: NhÃ³m halogen' },
    { classId: 10, lessonId: 'hoa10_kntt_bai22', title: 'BÃ i 22: Hydrogen halide and Muá»‘i halide' },
  ],
  'oxygen-sulfur': [
    { classId: 11, lessonId: 'hoa11_kntt_bai7', title: 'BÃ i 7: Sulfur and sulfur dioxide' },
    { classId: 11, lessonId: 'hoa11_kntt_bai8', title: 'BÃ i 8: Sulfuric acid and muá»‘i sulfate' },
  ],
  'nitrogen-phosphorus': [
    { classId: 8, lessonId: 'hoa8_kntt_bai12', title: 'BÃ i 12: PhÃ¢n bÃ³n hÃ³a há»c' },
    { classId: 11, lessonId: 'hoa11_kntt_bai4', title: 'BÃ i 4: Nitrogen' },
    { classId: 11, lessonId: 'hoa11_kntt_bai5', title: 'BÃ i 5: Ammonia â€“ Muá»‘i ammonium' },
    { classId: 11, lessonId: 'hoa11_kntt_bai6', title: 'BÃ i 6: Má»™t sá»‘ há»£p cháº¥t cá»§a nitrogen vá»›i oxygen' },
  ],

  // === Há»®U CÆ  ===
  'organic-overview': [
    { classId: 9, lessonId: 'hoa9_kntt_bai5', title: 'BÃ i 5: Giá»›i thiá»‡u Há»£p cháº¥t há»¯u cÆ¡' },
    { classId: 9, lessonId: 'hoa9_kntt_bai18', title: 'BÃ i 18: NhiÃªn liá»‡u hÃ³a tháº¡ch, Chu trÃ¬nh Carbon vÃ  Sá»± áº¥m lÃªn toÃ n cáº§u' },
    { classId: 11, lessonId: 'hoa11_kntt_bai10', title: 'BÃ i 10: Há»£p cháº¥t há»¯u cÆ¡ and hÃ³a há»c há»¯u cÆ¡' },
    { classId: 11, lessonId: 'hoa11_kntt_bai12', title: 'BÃ i 12: CÃ´ng thá»©c phÃ¢n tá»­ há»£p cháº¥t há»¯u cÆ¡' },
    { classId: 11, lessonId: 'hoa11_kntt_bai13', title: 'BÃ i 13: Cáº¥u táº¡o hÃ³a há»c há»£p cháº¥t há»¯u cÆ¡' },
  ],
  'hydrocarbon': [
    { classId: 9, lessonId: 'hoa9_kntt_bai8', title: 'BÃ i 8: Nguá»“n nhiÃªn liá»‡u' },
    { classId: 11, lessonId: 'hoa11_kntt_bai15', title: 'BÃ i 15: Alkane' },
    { classId: 11, lessonId: 'hoa11_kntt_bai16', title: 'BÃ i 16: Hydrocarbon khÃ´ng no' },
    { classId: 11, lessonId: 'hoa11_kntt_bai17', title: 'BÃ i 17: Arene (hydrocarbon thÆ¡m)' },
  ],
  'alkane': [
    { classId: 9, lessonId: 'hoa9_kntt_bai6', title: 'BÃ i 6: Alkane' },
    { classId: 11, lessonId: 'hoa11_kntt_bai15', title: 'BÃ i 15: Alkane' },
  ],
  'alkene': [
    { classId: 9, lessonId: 'hoa9_kntt_bai7', title: 'BÃ i 7: Alkene' },
    { classId: 11, lessonId: 'hoa11_kntt_bai16', title: 'BÃ i 16: Hydrocarbon khÃ´ng no' },
  ],
  'alkyne': [
    { classId: 11, lessonId: 'hoa11_kntt_bai16', title: 'BÃ i 16: Hydrocarbon khÃ´ng no' },
  ],
  'benzene': [
    { classId: 11, lessonId: 'hoa11_kntt_bai17', title: 'BÃ i 17: Arene (hydrocarbon thÆ¡m)' },
  ],
  'functional-group': [
    { classId: 11, lessonId: 'hoa11_kntt_bai13', title: 'BÃ i 13: Cáº¥u táº¡o hÃ³a há»c há»£p cháº¥t há»¯u cÆ¡' },
  ],
  'alcohol': [
    { classId: 9, lessonId: 'hoa9_kntt_bai9', title: 'BÃ i 9: Ethylic alcohol' },
    { classId: 11, lessonId: 'hoa11_kntt_bai20', title: 'BÃ i 20: Alcohol' },
  ],
  'phenol': [
    { classId: 11, lessonId: 'hoa11_kntt_bai21', title: 'BÃ i 21: Phenol' },
  ],
  'aldehyde-ketone': [
    { classId: 11, lessonId: 'hoa11_kntt_bai23', title: 'BÃ i 23: Há»£p cháº¥t carbonyl' },
  ],
  'carboxylic-acid': [
    { classId: 9, lessonId: 'hoa9_kntt_bai10', title: 'BÃ i 10: Acetic acid' },
    { classId: 11, lessonId: 'hoa11_kntt_bai24', title: 'BÃ i 24: Carboxylic acid' },
  ],
  'ester': [
    { classId: 12, lessonId: 'hoa12_kntt_bai1', title: 'BÃ i 1: Ester â€“ Lipid' },
  ],
  'lipid': [
    { classId: 9, lessonId: 'hoa9_kntt_bai11', title: 'BÃ i 11: Lipid' },
    { classId: 12, lessonId: 'hoa12_kntt_bai1', title: 'BÃ i 1: Ester â€“ Lipid' },
    { classId: 12, lessonId: 'hoa12_kntt_bai2', title: 'BÃ i 2: XÃ  phÃ²ng vÃ  cháº¥t giáº·t rá»­a' },
  ],
  'carbohydrate': [
    { classId: 9, lessonId: 'hoa9_kntt_bai12', title: 'BÃ i 12: Carbohydrate. Glucose vÃ  Saccharose' },
    { classId: 9, lessonId: 'hoa9_kntt_bai13', title: 'BÃ i 13: Tinh bá»™t vÃ  Cellulose' },
    { classId: 12, lessonId: 'hoa12_kntt_bai4', title: 'BÃ i 4: Glucose vÃ  fructose' },
    { classId: 12, lessonId: 'hoa12_kntt_bai5', title: 'BÃ i 5: Saccharose vÃ  maltose' },
    { classId: 12, lessonId: 'hoa12_kntt_bai6', title: 'BÃ i 6: Tinh bá»™t vÃ  cellulose' },
  ],
  'amine-amino-acid-protein': [
    { classId: 9, lessonId: 'hoa9_kntt_bai14', title: 'BÃ i 14: Protein' },
    { classId: 12, lessonId: 'hoa12_kntt_bai8', title: 'BÃ i 8: Amine' },
    { classId: 12, lessonId: 'hoa12_kntt_bai9', title: 'BÃ i 9: Amino acid vÃ  peptide' },
    { classId: 12, lessonId: 'hoa12_kntt_bai10', title: 'BÃ i 10: Protein vÃ  enzyme' },
  ],
  'polymer': [
    { classId: 9, lessonId: 'hoa9_kntt_bai15', title: 'BÃ i 15: Polymer' },
    { classId: 12, lessonId: 'hoa12_kntt_bai12', title: 'BÃ i 12: Äáº¡i cÆ°Æ¡ng vá» polymer' },
    { classId: 12, lessonId: 'hoa12_kntt_bai13', title: 'BÃ i 13: Váº­t liá»‡u polymer' },
  ],

  // === AN TOÃ€N ===
  'lab-safety': [
    { classId: 8, lessonId: 'hoa8_kntt_bai1', title: 'BÃ i 1: Sá»­ dá»¥ng hÃ³a cháº¥t vÃ  thiáº¿t bá»‹ cÆ¡ báº£n' },
  ],
  'hazard-symbols': [
    { classId: 8, lessonId: 'hoa8_kntt_bai1', title: 'BÃ i 1: Sá»­ dá»¥ng hÃ³a cháº¥t vÃ  thiáº¿t bá»‹ cÆ¡ báº£n' },
  ],
};

