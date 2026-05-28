/**
 * AURUM CHEMISTRY KNOWLEDGE BASE
 * Contains all static theoretical data, maps, and safety constants for the Aurum AI Agent.
 */

export const SAFETY_RESTRICTIONS = [
  'thuá»‘c ná»•', 'bom', 'cháº¿ táº¡o ná»•', 'tnt', 'dynamite', 'nitroglycerin',
  'Ä‘áº§u Ä‘á»™c', 'Ä‘á»™c háº¡i Ä‘á»ƒ giáº¿t', 'giáº¿t', 'táº¥n cÃ´ng', 'phÃ¡t ná»•', 'ná»• máº¡nh',
  'lÃ m vÅ© khÃ­', 'weapon', 'explosive', 'poison'
];

export const PEDAGOGICAL_PROMPTS = [
  'Báº¡n cÃ³ muá»‘n thá»­ mÃ´ phá»ng pháº£n á»©ng nÃ y trong Lab 3D khÃ´ng?',
  'Báº¡n cÃ³ biáº¿t yáº¿u tá»‘ nÃ o áº£nh hÆ°á»Ÿng Ä‘áº¿n tá»‘c Ä‘á»™ cá»§a pháº£n á»©ng nÃ y khÃ´ng?',
  'HÃ£y thá»­ liÃªn há»‡ cháº¥t nÃ y vá»›i á»©ng dá»¥ng thá»±c táº¿ trong Ä‘á»i sá»‘ng nhÃ©!',
  'Báº¡n cÃ³ muá»‘n xem cháº¥t nÃ y thuá»™c nhÃ³m kiáº¿n thá»©c nÃ o trong lá»™ trÃ¬nh hÃ³a há»c khÃ´ng?',
  'Báº¡n cÃ³ muá»‘n so sÃ¡nh cháº¥t nÃ y vá»›i má»™t cháº¥t gáº§n giá»‘ng Ä‘á»ƒ há»c nhanh hÆ¡n khÃ´ng?'
];

export const COMMON_ION_MAP = {
  'H+': { name: 'Ion hiÄ‘ro', charge: '+1', kind: 'cation' },
  'NH4+': { name: 'Ion amoni', charge: '+1', kind: 'cation' },
  'Na+': { name: 'Ion natri', charge: '+1', kind: 'cation' },
  'K+': { name: 'Ion kali', charge: '+1', kind: 'cation' },
  'Ag+': { name: 'Ion báº¡c', charge: '+1', kind: 'cation' },
  'Mg2+': { name: 'Ion magie', charge: '+2', kind: 'cation' },
  'Ca2+': { name: 'Ion canxi', charge: '+2', kind: 'cation' },
  'Ba2+': { name: 'Ion bari', charge: '+2', kind: 'cation' },
  'Zn2+': { name: 'Ion káº½m', charge: '+2', kind: 'cation' },
  'Fe2+': { name: 'Ion sáº¯t(II)', charge: '+2', kind: 'cation' },
  'Fe3+': { name: 'Ion sáº¯t(III)', charge: '+3', kind: 'cation' },
  'Cu2+': { name: 'Ion Ä‘á»“ng(II)', charge: '+2', kind: 'cation' },
  'Al3+': { name: 'Ion nhÃ´m', charge: '+3', kind: 'cation' },
  'OH-': { name: 'Ion hiÄ‘roxit', charge: '-1', kind: 'anion' },
  'Cl-': { name: 'Ion clorua', charge: '-1', kind: 'anion' },
  'Br-': { name: 'Ion bromua', charge: '-1', kind: 'anion' },
  'I-': { name: 'Ion iodua', charge: '-1', kind: 'anion' },
  'NO3-': { name: 'Ion nitrat', charge: '-1', kind: 'anion' },
  'NO2-': { name: 'Ion nitrit', charge: '-1', kind: 'anion' },
  'HCO3-': { name: 'Ion hiÄ‘rocacbonat', charge: '-1', kind: 'anion' },
  'HSO4-': { name: 'Ion hiÄ‘rosunfat', charge: '-1', kind: 'anion' },
  'MnO4-': { name: 'Ion pemanganat', charge: '-1', kind: 'anion' },
  'CO3 2-': { name: 'Ion cacbonat', charge: '-2', kind: 'anion' },
  'CO32-': { name: 'Ion cacbonat', charge: '-2', kind: 'anion' },
  'SO4 2-': { name: 'Ion sunfat', charge: '-2', kind: 'anion' },
  'SO42-': { name: 'Ion sunfat', charge: '-2', kind: 'anion' },
  'SO3 2-': { name: 'Ion sunfit', charge: '-2', kind: 'anion' },
  'SO32-': { name: 'Ion sunfit', charge: '-2', kind: 'anion' },
  'S2-': { name: 'Ion sunfua', charge: '-2', kind: 'anion' },
  'Cr2O7 2-': { name: 'Ion Ä‘icromat', charge: '-2', kind: 'anion' },
  'Cr2O72-': { name: 'Ion Ä‘icromat', charge: '-2', kind: 'anion' },
  'PO4 3-': { name: 'Ion photphat', charge: '-3', kind: 'anion' },
  'PO43-': { name: 'Ion photphat', charge: '-3', kind: 'anion' }
};

export const VALENCY_MAP = {
  H: 'I', He: '0', Li: 'I', Be: 'II', B: 'III', C: 'II, IV', N: 'II, III, IV, V', O: 'II', F: 'I',
  Na: 'I', Mg: 'II', Al: 'III', Si: 'IV', P: 'III, V', S: 'II, IV, VI', Cl: 'I, III, V, VII',
  K: 'I', Ca: 'II', Sc: 'III', Ti: 'II, III, IV', V: 'II, III, IV, V', Cr: 'II, III, VI', Mn: 'II, IV, VII',
  Fe: 'II, III', Co: 'II, III', Ni: 'II, III', Cu: 'I, II', Zn: 'II', Br: 'I, III, V, VII', Ag: 'I',
  Sr: 'II', Sn: 'II, IV', I: 'I, III, V, VII', Ba: 'II', Pb: 'II, IV',
  Ne: '0', Ar: '0', Kr: '0', Xe: '0', Rn: '0', Og: '0',
  Mc: 'III, V', Nh: 'I, III', Ts: 'I, III', Lv: 'II, IV'
};

export const OXIDATION_STATE_MAP = {
  H: ['+1', '-1 (trong hiÄ‘rua kim loáº¡i)'],
  O: ['-2', '-1 (trong peoxit)', '+2 (trong OF2)'],
  F: ['-1'],
  Cl: ['-1', '+1', '+3', '+5', '+7'],
  Br: ['-1', '+1', '+3', '+5', '+7'],
  I: ['-1', '+1', '+3', '+5', '+7'],
  S: ['-2', '+4', '+6'],
  N: ['-3', '+1', '+2', '+3', '+4', '+5'],
  P: ['-3', '+3', '+5'],
  C: ['-4', '+2', '+4'],
  Fe: ['+2', '+3'],
  Cu: ['+1', '+2'],
  Mn: ['+2', '+4', '+6', '+7'],
  Cr: ['+2', '+3', '+6'],
  Na: ['+1'], Mg: ['+2'], Al: ['+3']
};

export const CHEMISTRY_KNOWLEDGE_BASE = [
  {
    id: 'atom-structure',
    category: 'Äáº¡i cÆ°Æ¡ng',
    patterns: ['cáº¥u táº¡o nguyÃªn tá»­', 'nguyÃªn tá»­ gá»“m gÃ¬', 'proton neutron electron', 'háº¡t cÆ¡ báº£n', 'nguyÃªn tá»­ lÃ  gÃ¬', 'Sá»‘ khá»‘i vÃ  sá»‘ hiá»‡u nguyÃªn tá»­', 'sá»‘ hiá»‡u nguyÃªn tá»­', 'sá»‘ khá»‘i'],
    title: 'Cáº¥u táº¡o nguyÃªn tá»­',
    explanation:
      'NguyÃªn tá»­ gá»“m **háº¡t nhÃ¢n** vÃ  **vá» electron**. Háº¡t nhÃ¢n chá»©a **proton** mang Ä‘iá»‡n dÆ°Æ¡ng vÃ  **neutron** khÃ´ng mang Ä‘iá»‡n. Electron mang Ä‘iá»‡n Ã¢m vÃ  chuyá»ƒn Ä‘á»™ng quanh háº¡t nhÃ¢n theo cÃ¡c má»©c nÄƒng lÆ°á»£ng. Trong nguyÃªn tá»­ trung hÃ²a: sá»‘ proton = sá»‘ electron. **Sá»‘ hiá»‡u nguyÃªn tá»­ Z = sá»‘ proton**; **sá»‘ khá»‘i A = proton + neutron**.',
    suggestions: ['Sá»‘ hiá»‡u nguyÃªn tá»­ lÃ  gÃ¬?', 'Cáº¥u hÃ¬nh electron', 'Äá»“ng vá»‹ lÃ  gÃ¬?']
  },
  {
    id: 'isotope',
    category: 'Äáº¡i cÆ°Æ¡ng',
    patterns: ['Ä‘á»“ng vá»‹', 'isotope', 'nguyÃªn tá»­ cÃ¹ng z khÃ¡c n', 'NguyÃªn tá»­ khá»‘i trung bÃ¬nh'],
    title: 'Äá»“ng vá»‹',
    explanation:
      'Äá»“ng vá»‹ lÃ  cÃ¡c nguyÃªn tá»­ cá»§a cÃ¹ng má»™t nguyÃªn tá»‘ cÃ³ **cÃ¹ng sá»‘ proton** nhÆ°ng **khÃ¡c sá»‘ neutron**, nÃªn khÃ¡c sá»‘ khá»‘i. TÃ­nh cháº¥t hÃ³a há»c cá»§a cÃ¡c Ä‘á»“ng vá»‹ gáº§n nhÆ° giá»‘ng nhau vÃ¬ phá»¥ thuá»™c chá»§ yáº¿u vÃ o electron; tÃ­nh cháº¥t váº­t lÃ½ cÃ³ thá»ƒ khÃ¡c nhau.',
    suggestions: ['NguyÃªn tá»­ khá»‘i trung bÃ¬nh', 'Sá»‘ khá»‘i vÃ  sá»‘ hiá»‡u nguyÃªn tá»­']
  },
  {
    id: 'electron-config',
    category: 'Äáº¡i cÆ°Æ¡ng',
    patterns: ['cáº¥u hÃ¬nh electron', 'electron hÃ³a trá»‹', 'lá»›p electron', 'phÃ¢n bá»‘ electron'],
    title: 'Cáº¥u hÃ¬nh electron vÃ  electron hÃ³a trá»‹',
    explanation:
      'Electron Ä‘Æ°á»£c phÃ¢n bá»‘ vÃ o cÃ¡c lá»›p vÃ  phÃ¢n lá»›p theo má»©c nÄƒng lÆ°á»£ng tÄƒng dáº§n. **Electron hÃ³a trá»‹** lÃ  cÃ¡c electron á»Ÿ lá»›p ngoÃ i cÃ¹ng, quyáº¿t Ä‘á»‹nh pháº§n lá»›n tÃ­nh cháº¥t hÃ³a há»c cá»§a nguyÃªn tá»‘. Dá»±a vÃ o cáº¥u hÃ¬nh electron cÃ³ thá»ƒ suy ra vá»‹ trÃ­ nguyÃªn tá»‘ trong báº£ng tuáº§n hoÃ n, khuynh hÆ°á»›ng nhÆ°á»ng/nháº­n electron vÃ  hÃ³a trá»‹ thÆ°á»ng gáº·p.',
    suggestions: ['Báº£ng tuáº§n hoÃ n', 'HÃ³a trá»‹ lÃ  gÃ¬?']
  },
  {
    id: 'periodic-law',
    category: 'Äáº¡i cÆ°Æ¡ng',
    patterns: ['báº£ng tuáº§n hoÃ n', 'Ä‘á»‹nh luáº­t tuáº§n hoÃ n', 'chu kÃ¬ nhÃ³m', 'periodic table'],
    title: 'Báº£ng tuáº§n hoÃ n cÃ¡c nguyÃªn tá»‘ hÃ³a há»c',
    explanation:
      'Báº£ng tuáº§n hoÃ n sáº¯p xáº¿p cÃ¡c nguyÃªn tá»‘ theo **chiá»u tÄƒng dáº§n Ä‘iá»‡n tÃ­ch háº¡t nhÃ¢n**. **Chu kÃ¬** lÃ  hÃ ng ngang, **nhÃ³m** lÃ  cá»™t dá»c. CÃ¡c nguyÃªn tá»‘ cÃ¹ng nhÃ³m thÆ°á»ng cÃ³ cáº¥u hÃ¬nh electron lá»›p ngoÃ i cÃ¹ng gáº§n giá»‘ng nhau nÃªn cÃ³ tÃ­nh cháº¥t hÃ³a há»c tÆ°Æ¡ng tá»±.',
    suggestions: ['Xu hÆ°á»›ng báº£ng tuáº§n hoÃ n', 'Kim loáº¡i vÃ  phi kim']
  },
  {
    id: 'periodic-trends',
    category: 'Äáº¡i cÆ°Æ¡ng',
    patterns: ['xu hÆ°á»›ng báº£ng tuáº§n hoÃ n', 'bÃ¡n kÃ­nh nguyÃªn tá»­', 'Ä‘á»™ Ã¢m Ä‘iá»‡n', 'nÄƒng lÆ°á»£ng ion hÃ³a'],
    title: 'Má»™t sá»‘ xu hÆ°á»›ng tuáº§n hoÃ n quan trá»ng',
    explanation:
      'Trong má»™t chu kÃ¬ tá»« trÃ¡i sang pháº£i, **bÃ¡n kÃ­nh nguyÃªn tá»­ thÆ°á»ng giáº£m**, cÃ²n **Ä‘á»™ Ã¢m Ä‘iá»‡n** vÃ  **nÄƒng lÆ°á»£ng ion hÃ³a** thÆ°á»ng tÄƒng. Trong má»™t nhÃ³m tá»« trÃªn xuá»‘ng, **bÃ¡n kÃ­nh nguyÃªn tá»­ tÄƒng**, cÃ²n Ä‘á»™ Ã¢m Ä‘iá»‡n thÆ°á»ng giáº£m. Kim loáº¡i máº¡nh dáº§n khi Ä‘i xuá»‘ng trong nhÃ³m IA; phi kim máº¡nh thÆ°á»ng tÄƒng vá» phÃ­a gÃ³c trÃªn bÃªn pháº£i báº£ng tuáº§n hoÃ n.',
    suggestions: ['LiÃªn káº¿t hÃ³a há»c', 'Kim loáº¡i vÃ  phi kim']
  },
  {
    id: 'metals-nonmetals',
    category: 'Äáº¡i cÆ°Æ¡ng',
    patterns: ['kim loáº¡i', 'phi kim', 'kim loáº¡i vÃ  phi kim', 'metalloid', 'Ã¡ kim', 'tÃ­nh kim loáº¡i'],
    title: 'Kim loáº¡i vÃ  phi kim',
    explanation:
      '**Kim loáº¡i** thÆ°á»ng cÃ³ tÃ­nh dáº«n Ä‘iá»‡n, dáº«n nhiá»‡t tá»‘t, cÃ³ Ã¡nh kim vÃ  cÃ³ khuynh hÆ°á»›ng nhÆ°á»ng electron. **Phi kim** thÆ°á»ng khÃ´ng dáº«n Ä‘iá»‡n (trá»« than chÃ¬), dáº«n nhiá»‡t kÃ©m vÃ  cÃ³ khuynh hÆ°á»›ng nháº­n electron. **Ã kim** (metalloid) náº±m giá»¯a hai nhÃ³m nÃ y, mang Ä‘áº·c tÃ­nh trung gian.',
    suggestions: ['Báº£ng tuáº§n hoÃ n', 'Pháº£n á»©ng hÃ³a há»c']
  },
  {
    id: 'chemical-bonding',
    category: 'LiÃªn káº¿t',
    patterns: ['liÃªn káº¿t hÃ³a há»c', 'liÃªn káº¿t gÃ¬', 'cÃ¡c loáº¡i liÃªn káº¿t', 'loáº¡i liÃªn káº¿t'],
    title: 'CÃ¡c loáº¡i liÃªn káº¿t hÃ³a há»c cÆ¡ báº£n',
    formula: '\\text{Cá»™ng hÃ³a trá»‹} \\leftrightarrow \\text{Ion} \\leftrightarrow \\text{Kim loáº¡i}',
    explanation:
      'Ba loáº¡i thÆ°á»ng gáº·p lÃ : **liÃªn káº¿t ion** (kim loáº¡i + phi kim, do cho nháº­n electron), **liÃªn káº¿t cá»™ng hÃ³a trá»‹** (thÆ°á»ng giá»¯a cÃ¡c phi kim, do dÃ¹ng chung electron) vÃ  **liÃªn káº¿t kim loáº¡i** (máº¡ng ion dÆ°Æ¡ng trong â€œbiá»ƒn electronâ€ tá»± do). NgoÃ i ra cÃ²n cÃ³ **liÃªn káº¿t hiÄ‘ro** vÃ  **tÆ°Æ¡ng tÃ¡c Van der Waals** á»Ÿ má»©c liÃªn phÃ¢n tá»­.',
    suggestions: ['LiÃªn káº¿t ion', 'LiÃªn káº¿t cá»™ng hÃ³a trá»‹', 'LiÃªn káº¿t hiÄ‘ro']
  },
  {
    id: 'ionic-bond',
    category: 'LiÃªn káº¿t',
    patterns: ['liÃªn káº¿t ion', 'ion bond'],
    title: 'LiÃªn káº¿t ion',
    explanation:
      'LiÃªn káº¿t ion hÃ¬nh thÃ nh khi má»™t nguyÃªn tá»­ nhÆ°á»ng electron vÃ  nguyÃªn tá»­ khÃ¡c nháº­n electron, táº¡o nÃªn lá»±c hÃºt tÄ©nh Ä‘iá»‡n giá»¯a cation vÃ  anion. Há»£p cháº¥t ion thÆ°á»ng cÃ³ nhiá»‡t Ä‘á»™ nÃ³ng cháº£y cao, dáº«n Ä‘iá»‡n khi nÃ³ng cháº£y hoáº·c khi tan trong nÆ°á»›c.',
    suggestions: ['LiÃªn káº¿t cá»™ng hÃ³a trá»‹', 'Cháº¥t Ä‘iá»‡n li lÃ  gÃ¬?']
  },
  {
    id: 'covalent-bond',
    category: 'LiÃªn káº¿t',
    patterns: ['liÃªn káº¿t cá»™ng hÃ³a trá»‹', 'covalent', 'dÃ¹ng chung electron'],
    title: 'LiÃªn káº¿t cá»™ng hÃ³a trá»‹',
    explanation:
      'LiÃªn káº¿t cá»™ng hÃ³a trá»‹ Ä‘Æ°á»£c táº¡o bá»Ÿi má»™t hay nhiá»u cáº·p electron dÃ¹ng chung giá»¯a cÃ¡c nguyÃªn tá»­. CÃ³ thá»ƒ lÃ  **khÃ´ng cá»±c** hoáº·c **cÃ³ cá»±c** tÃ¹y theo chÃªnh lá»‡ch Ä‘á»™ Ã¢m Ä‘iá»‡n. Nhiá»u cháº¥t cá»™ng hÃ³a trá»‹ tá»“n táº¡i dÆ°á»›i dáº¡ng phÃ¢n tá»­, Ã­t dáº«n Ä‘iá»‡n á»Ÿ tráº¡ng thÃ¡i thÆ°á»ng.',
    suggestions: ['PhÃ¢n cá»±c liÃªn káº¿t', 'LiÃªn káº¿t ion']
  },
  {
    id: 'metallic-bond',
    category: 'LiÃªn káº¿t',
    patterns: ['liÃªn káº¿t kim loáº¡i', 'kim loáº¡i dáº«n Ä‘iá»‡n vÃ¬ sao'],
    title: 'LiÃªn káº¿t kim loáº¡i',
    explanation:
      'Trong tinh thá»ƒ kim loáº¡i, cÃ¡c ion dÆ°Æ¡ng náº±m á»Ÿ nÃºt máº¡ng cÃ²n electron hÃ³a trá»‹ chuyá»ƒn Ä‘á»™ng tÆ°Æ¡ng Ä‘á»‘i tá»± do táº¡o thÃ nh â€œbiá»ƒn electronâ€. Äiá»u nÃ y giáº£i thÃ­ch tÃ­nh dáº»o, dáº«n Ä‘iá»‡n, dáº«n nhiá»‡t vÃ  Ã¡nh kim cá»§a kim loáº¡i.',
    suggestions: ['DÃ£y hoáº¡t Ä‘á»™ng hÃ³a há»c cá»§a kim loáº¡i']
  },
  {
    id: 'mole-concept',
    category: 'Mol vÃ  Ä‘á»‹nh lÆ°á»£ng',
    patterns: ['mol lÃ  gÃ¬', 'khÃ¡i niá»‡m mol', 'sá»‘ avogadro'],
    title: 'KhÃ¡i niá»‡m mol',
    explanation:
      'Mol lÃ  lÆ°á»£ng cháº¥t chá»©a **6,022 Ã— 10^23** háº¡t vi mÃ´ nhÆ° nguyÃªn tá»­, phÃ¢n tá»­, ion. Mol lÃ  cáº§u ná»‘i giá»¯a tháº¿ giá»›i vi mÃ´ vÃ  Ä‘áº¡i lÆ°á»£ng Ä‘o Ä‘Æ°á»£c trong thÃ­ nghiá»‡m nhÆ° khá»‘i lÆ°á»£ng, thá»ƒ tÃ­ch, ná»“ng Ä‘á»™.',
    suggestions: ['n = m/M', 'Khá»‘i lÆ°á»£ng mol', 'Mol theo thá»ƒ tÃ­ch khÃ­']
  },
  {
    id: 'molar-mass',
    category: 'Mol vÃ  Ä‘á»‹nh lÆ°á»£ng',
    patterns: ['khá»‘i lÆ°á»£ng mol', 'molar mass', 'm lÃ  gÃ¬'],
    title: 'Khá»‘i lÆ°á»£ng mol',
    explanation:
      'Khá»‘i lÆ°á»£ng mol **M** lÃ  khá»‘i lÆ°á»£ng cá»§a 1 mol cháº¥t, Ä‘Æ¡n vá»‹ thÆ°á»ng dÃ¹ng lÃ  g/mol. Vá» sá»‘ trá»‹, khá»‘i lÆ°á»£ng mol cá»§a má»™t cháº¥t báº±ng tá»•ng nguyÃªn tá»­ khá»‘i cá»§a cÃ¡c nguyÃªn tá»­ trong cÃ´ng thá»©c hÃ³a há»c cá»§a cháº¥t Ä‘Ã³.',
    suggestions: ['n = m/M', 'TÃ­nh phÃ¢n tá»­ khá»‘i']
  },
  {
    id: 'mol-mass',
    category: 'Mol vÃ  Ä‘á»‹nh lÆ°á»£ng',
    patterns: ['mol theo khá»‘i lÆ°á»£ng', 'n = m/m', 'n=m/m', 'mol tá»« m', 'tÃ­nh sá»‘ mol theo khá»‘i lÆ°á»£ng'],
    title: 'CÃ´ng thá»©c tÃ­nh sá»‘ mol theo khá»‘i lÆ°á»£ng',
    formula: 'n = \\frac{m}{M}',
    explanation:
      'Trong Ä‘Ã³: **n** lÃ  sá»‘ mol, **m** lÃ  khá»‘i lÆ°á»£ng cháº¥t tÃ­nh báº±ng gam, **M** lÃ  khá»‘i lÆ°á»£ng mol tÃ­nh báº±ng g/mol. ÄÃ¢y lÃ  cÃ´ng thá»©c cÆ¡ báº£n nháº¥t trong bÃ i toÃ¡n hÃ³a há»c Ä‘á»‹nh lÆ°á»£ng.',
    suggestions: ['Mol theo thá»ƒ tÃ­ch khÃ­', 'Ná»“ng Ä‘á»™ mol']
  },
  {
    id: 'mol-particles',
    category: 'Mol vÃ  Ä‘á»‹nh lÆ°á»£ng',
    patterns: ['mol theo sá»‘ háº¡t', 'n=n/na', 'sá»‘ háº¡t avogadro', 'tÃ­nh mol theo sá»‘ phÃ¢n tá»­'],
    title: 'CÃ´ng thá»©c tÃ­nh sá»‘ mol theo sá»‘ háº¡t',
    formula: 'n = \\frac{N}{N_A}',
    explanation:
      'Trong Ä‘Ã³ **N** lÃ  sá»‘ háº¡t vi mÃ´ vÃ  **N_A = 6,022 \\times 10^{23}** háº¡t/mol. CÃ´ng thá»©c nÃ y dÃ¹ng khi Ä‘á» cho sá»‘ nguyÃªn tá»­, phÃ¢n tá»­ hoáº·c ion.',
    suggestions: ['Mol lÃ  gÃ¬?', 'Khá»‘i lÆ°á»£ng mol']
  },
  {
    id: 'mol-vol',
    category: 'Mol vÃ  Ä‘á»‹nh lÆ°á»£ng',
    patterns: ['mol theo thá»ƒ tÃ­ch', 'Ä‘ktc', 'v/22.4', 'mol khÃ­', 'tÃ­nh mol khÃ­'],
    title: 'CÃ´ng thá»©c tÃ­nh sá»‘ mol cháº¥t khÃ­ á»Ÿ Ä‘iá»u kiá»‡n tiÃªu chuáº©n thÆ°á»ng dÃ¹ng',
    formula: 'n = \\frac{V}{22,4}',
    explanation:
      'Trong nhiá»u bÃ i há»c phá»• thÃ´ng, á»Ÿ **Ä‘ktc** ngÆ°á»i ta thÆ°á»ng dÃ¹ng thá»ƒ tÃ­ch mol khÃ­ lÃ  **22,4 lÃ­t/mol**. Khi Ä‘Ã³ sá»‘ mol khÃ­ Ä‘Æ°á»£c tÃ­nh báº±ng thá»ƒ tÃ­ch khÃ­ chia cho 22,4.',
    suggestions: ['PhÆ°Æ¡ng trÃ¬nh khÃ­ lÃ­ tÆ°á»Ÿng', 'Tá»‰ khá»‘i cháº¥t khÃ­']
  },
  {
    id: 'ideal-gas',
    category: 'Cháº¥t khÃ­',
    patterns: ['phÆ°Æ¡ng trÃ¬nh khÃ­ lÃ½ tÆ°á»Ÿng', 'pv=nrt', 'khÃ­ lÃ½ tÆ°á»Ÿng', 'khÃ­ lÃ­ tÆ°á»Ÿng'],
    title: 'PhÆ°Æ¡ng trÃ¬nh khÃ­ lÃ­ tÆ°á»Ÿng',
    formula: 'PV = nRT',
    explanation:
      'PhÆ°Æ¡ng trÃ¬nh liÃªn há»‡ Ã¡p suáº¥t **P**, thá»ƒ tÃ­ch **V**, sá»‘ mol **n**, háº±ng sá»‘ khÃ­ **R** vÃ  nhiá»‡t Ä‘á»™ tuyá»‡t Ä‘á»‘i **T**. Khi lÃ m bÃ i cáº§n thá»‘ng nháº¥t há»‡ Ä‘Æ¡n vá»‹. ÄÃ¢y lÃ  cÃ´ng thá»©c tá»•ng quÃ¡t hÆ¡n so vá»›i dÃ¹ng 22,4 lÃ­t/mol.',
    suggestions: ['Äá»‹nh luáº­t Boyle', 'Äá»‹nh luáº­t Charles']
  },
  {
    id: 'boyle-law',
    category: 'Cháº¥t khÃ­',
    patterns: ['Ä‘á»‹nh luáº­t boyle', 'boyle mariotte', 'p1v1=p2v2'],
    title: 'Äá»‹nh luáº­t Boyle â€“ Mariotte',
    formula: 'P_1V_1 = P_2V_2',
    explanation:
      'á»ž nhiá»‡t Ä‘á»™ khÃ´ng Ä‘á»•i, thá»ƒ tÃ­ch cá»§a má»™t lÆ°á»£ng khÃ­ xÃ¡c Ä‘á»‹nh tá»‰ lá»‡ nghá»‹ch vá»›i Ã¡p suáº¥t. Khi Ã¡p suáº¥t tÄƒng thÃ¬ thá»ƒ tÃ­ch giáº£m vÃ  ngÆ°á»£c láº¡i.',
    suggestions: ['Äá»‹nh luáº­t Charles', 'PV=nRT']
  },
  {
    id: 'charles-law',
    category: 'Cháº¥t khÃ­',
    patterns: ['Ä‘á»‹nh luáº­t charles', 'v/t', 'v1/t1=v2/t2'],
    title: 'Äá»‹nh luáº­t Charles',
    formula: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}',
    explanation:
      'á»ž Ã¡p suáº¥t khÃ´ng Ä‘á»•i, thá»ƒ tÃ­ch cá»§a má»™t lÆ°á»£ng khÃ­ xÃ¡c Ä‘á»‹nh tá»‰ lá»‡ thuáº­n vá»›i nhiá»‡t Ä‘á»™ tuyá»‡t Ä‘á»‘i. Nhiá»‡t Ä‘á»™ trong cÃ´ng thá»©c pháº£i Ä‘á»•i sang Kelvin.',
    suggestions: ['Nhiá»‡t Ä‘á»™ tuyá»‡t Ä‘á»‘i lÃ  gÃ¬?', 'PV=nRT']
  },
  {
    id: 'density-gas',
    category: 'Cháº¥t khÃ­',
    patterns: ['tá»‰ khá»‘i cháº¥t khÃ­', 'd khÃ­', 'so vá»›i h2', 'so vá»›i khÃ´ng khÃ­'],
    title: 'Tá»‰ khá»‘i cháº¥t khÃ­',
    explanation:
      'Tá»‰ khá»‘i cá»§a khÃ­ A Ä‘á»‘i vá»›i khÃ­ B báº±ng tá»‰ sá»‘ khá»‘i lÆ°á»£ng mol: **d(A/B) = M_A / M_B**. Má»™t sá»‘ dáº¡ng quen thuá»™c: **d(A/H2) = M_A / 2** vÃ  **d(A/kk) = M_A / 29** náº¿u láº¥y khá»‘i lÆ°á»£ng mol trung bÃ¬nh cá»§a khÃ´ng khÃ­ xáº¥p xá»‰ 29 g/mol.',
    suggestions: ['Khá»‘i lÆ°á»£ng mol', 'PV=nRT']
  },
  {
    id: 'solution-basic',
    category: 'Dung dá»‹ch',
    patterns: ['dung dá»‹ch lÃ  gÃ¬', 'cháº¥t tan dung mÃ´i', 'solution lÃ  gÃ¬'],
    title: 'Dung dá»‹ch vÃ  cÃ¡c khÃ¡i niá»‡m cÆ¡ báº£n',
    explanation:
      'Dung dá»‹ch gá»“m **cháº¥t tan** vÃ  **dung mÃ´i**. Náº¿u cháº¥t tan phÃ¢n bá»‘ Ä‘á»u á»Ÿ má»©c phÃ¢n tá»­/ion trong dung mÃ´i thÃ¬ thu Ä‘Æ°á»£c há»‡ Ä‘á»“ng nháº¥t. NÆ°á»›c lÃ  dung mÃ´i ráº¥t thÃ´ng dá»¥ng vÃ¬ cÃ³ kháº£ nÄƒng hÃ²a tan nhiá»u cháº¥t phÃ¢n cá»±c vÃ  cháº¥t Ä‘iá»‡n li.',
    suggestions: ['Ná»“ng Ä‘á»™ mol', 'Ná»“ng Ä‘á»™ pháº§n trÄƒm', 'Pha loÃ£ng dung dá»‹ch']
  },
  {
    id: 'molar-conc',
    category: 'Dung dá»‹ch',
    patterns: ['ná»“ng Ä‘á»™ mol', 'cm', 'mol/l', 'molar concentration'],
    title: 'CÃ´ng thá»©c tÃ­nh ná»“ng Ä‘á»™ mol',
    formula: 'C_M = \\frac{n}{V}',
    explanation:
      'Trong Ä‘Ã³ **C_M** lÃ  ná»“ng Ä‘á»™ mol (mol/L), **n** lÃ  sá»‘ mol cháº¥t tan, **V** lÃ  thá»ƒ tÃ­ch dung dá»‹ch tÃ­nh báº±ng lÃ­t. ÄÃ¢y lÃ  Ä‘áº¡i lÆ°á»£ng quan trá»ng trong bÃ i toÃ¡n pha cháº¿ vÃ  pháº£n á»©ng trong dung dá»‹ch.',
    suggestions: ['Pha loÃ£ng dung dá»‹ch', 'Ná»“ng Ä‘á»™ pháº§n trÄƒm']
  },
  {
    id: 'percent-conc',
    category: 'Dung dá»‹ch',
    patterns: ['ná»“ng Ä‘á»™ pháº§n trÄƒm', 'c%', 'percent concentration'],
    title: 'CÃ´ng thá»©c tÃ­nh ná»“ng Ä‘á»™ pháº§n trÄƒm',
    formula: 'C\\% = \\frac{m_{ct}}{m_{dd}} \\times 100\\%',
    explanation:
      'Trong Ä‘Ã³ **m_ct** lÃ  khá»‘i lÆ°á»£ng cháº¥t tan, **m_dd** lÃ  khá»‘i lÆ°á»£ng dung dá»‹ch. Ná»“ng Ä‘á»™ pháº§n trÄƒm biá»ƒu diá»…n sá»‘ gam cháº¥t tan trong 100 gam dung dá»‹ch.',
    suggestions: ['Ná»“ng Ä‘á»™ mol', 'Khá»‘i lÆ°á»£ng dung dá»‹ch']
  },
  {
    id: 'dilution',
    category: 'Dung dá»‹ch',
    patterns: ['pha loÃ£ng', 'dilution', 'c1v1=c2v2'],
    title: 'Pha loÃ£ng dung dá»‹ch',
    formula: 'C_1V_1 = C_2V_2',
    explanation:
      'Khi pha loÃ£ng mÃ  lÆ°á»£ng cháº¥t tan khÃ´ng Ä‘á»•i, sá»‘ mol cháº¥t tan trÆ°á»›c vÃ  sau pha loÃ£ng báº±ng nhau nÃªn cÃ³ cÃ´ng thá»©c **C1V1 = C2V2**. CÃ´ng thá»©c nÃ y chá»‰ Ä‘Ãºng khi cÃ¹ng nÃ³i vá» ná»“ng Ä‘á»™ mol cá»§a cÃ¹ng má»™t cháº¥t tan.',
    suggestions: ['Ná»“ng Ä‘á»™ mol', 'Dung dá»‹ch lÃ  gÃ¬?']
  },
  {
    id: 'solubility',
    category: 'Dung dá»‹ch',
    patterns: ['Ä‘á»™ tan', 'solubility', 'bÃ£o hÃ²a', 'dung dá»‹ch bÃ£o hÃ²a'],
    title: 'Äá»™ tan vÃ  dung dá»‹ch bÃ£o hÃ²a',
    explanation:
      'Äá»™ tan cho biáº¿t lÆ°á»£ng cháº¥t tan tá»‘i Ä‘a cÃ³ thá»ƒ hÃ²a tan trong má»™t lÆ°á»£ng dung mÃ´i xÃ¡c Ä‘á»‹nh á»Ÿ nhiá»‡t Ä‘á»™ xÃ¡c Ä‘á»‹nh. Dung dá»‹ch chá»©a lÆ°á»£ng cháº¥t tan tá»‘i Ä‘a gá»i lÃ  **dung dá»‹ch bÃ£o hÃ²a**; náº¿u chá»©a Ã­t hÆ¡n lÃ  **chÆ°a bÃ£o hÃ²a**.',
    suggestions: ['Káº¿t tinh', 'áº¢nh hÆ°á»Ÿng cá»§a nhiá»‡t Ä‘á»™ Ä‘áº¿n Ä‘á»™ tan']
  },
  {
    id: 'electrolyte',
    category: 'Dung dá»‹ch',
    patterns: ['cháº¥t Ä‘iá»‡n li', 'Ä‘iá»‡n li lÃ  gÃ¬', 'acid base salt in water'],
    title: 'Cháº¥t Ä‘iá»‡n li vÃ  khÃ´ng Ä‘iá»‡n li',
    explanation:
      'Cháº¥t Ä‘iá»‡n li lÃ  cháº¥t khi tan trong nÆ°á»›c hoáº·c nÃ³ng cháº£y táº¡o ra ion nÃªn cÃ³ kháº£ nÄƒng dáº«n Ä‘iá»‡n. Axit, bazÆ¡, muá»‘i thÆ°á»ng lÃ  cháº¥t Ä‘iá»‡n li; nhiá»u há»£p cháº¥t cá»™ng hÃ³a trá»‹ nhÆ° Ä‘Æ°á»ng, ancol khÃ´ng Ä‘iá»‡n li hoáº·c Ä‘iá»‡n li ráº¥t yáº¿u.',
    suggestions: ['Axit lÃ  gÃ¬?', 'BazÆ¡ lÃ  gÃ¬?', 'pH lÃ  gÃ¬?']
  },
  {
    id: 'acid-definition',
    category: 'Axit â€“ bazÆ¡ â€“ muá»‘i',
    patterns: ['axit lÃ  gÃ¬', 'acid lÃ  gÃ¬', 'Ä‘á»‹nh nghÄ©a axit'],
    title: 'Axit',
    explanation:
      'Theo Arrhenius, axit lÃ  cháº¥t khi tan trong nÆ°á»›c phÃ¢n li táº¡o **H+**. Theo BrÃ¸nstedâ€“Lowry, axit lÃ  cháº¥t **cho proton**. Axit thÆ°á»ng lÃ m quá»³ tÃ­m hÃ³a Ä‘á», pháº£n á»©ng vá»›i bazÆ¡ táº¡o muá»‘i vÃ  nÆ°á»›c, vÃ  má»™t sá»‘ axit pháº£n á»©ng vá»›i kim loáº¡i giáº£i phÃ³ng hiÄ‘ro.',
    suggestions: ['BazÆ¡ lÃ  gÃ¬?', 'Pháº£n á»©ng trung hÃ²a', 'pH lÃ  gÃ¬?']
  },
  {
    id: 'base-definition',
    category: 'Axit â€“ bazÆ¡ â€“ muá»‘i',
    patterns: ['bazÆ¡ lÃ  gÃ¬', 'base lÃ  gÃ¬', 'Ä‘á»‹nh nghÄ©a bazÆ¡', 'kiá»m lÃ  gÃ¬'],
    title: 'BazÆ¡ vÃ  kiá»m',
    explanation:
      'Theo Arrhenius, bazÆ¡ lÃ  cháº¥t khi tan trong nÆ°á»›c phÃ¢n li táº¡o **OH-**. Theo BrÃ¸nstedâ€“Lowry, bazÆ¡ lÃ  cháº¥t **nháº­n proton**. BazÆ¡ tan trong nÆ°á»›c gá»i lÃ  **kiá»m**. Dung dá»‹ch bazÆ¡ thÆ°á»ng lÃ m quá»³ tÃ­m hÃ³a xanh vÃ  phenolphtalein hÃ³a há»“ng.',
    suggestions: ['Axit lÃ  gÃ¬?', 'Pháº£n á»©ng trung hÃ²a']
  },
  {
    id: 'salt-definition',
    category: 'Axit â€“ bazÆ¡ â€“ muá»‘i',
    patterns: ['muá»‘i lÃ  gÃ¬', 'salt lÃ  gÃ¬', 'Ä‘á»‹nh nghÄ©a muá»‘i'],
    title: 'Muá»‘i',
    explanation:
      'Muá»‘i lÃ  há»£p cháº¥t ion gá»“m cation kim loáº¡i hoáº·c amoni vÃ  anion gá»‘c axit. Muá»‘i cÃ³ thá»ƒ Ä‘Æ°á»£c táº¡o thÃ nh tá»« pháº£n á»©ng giá»¯a axit vÃ  bazÆ¡, giá»¯a kim loáº¡i vÃ  axit, hoáº·c qua nhiá»u pháº£n á»©ng trao Ä‘á»•i trong dung dá»‹ch.',
    suggestions: ['Pháº£n á»©ng trao Ä‘á»•i', 'Muá»‘i axit vÃ  muá»‘i trung hÃ²a']
  },
  {
    id: 'oxide-classification',
    category: 'Axit â€“ bazÆ¡ â€“ muá»‘i',
    patterns: ['oxit lÃ  gÃ¬', 'phÃ¢n loáº¡i oxit', 'oxide'],
    title: 'PhÃ¢n loáº¡i oxit',
    explanation:
      'Oxit lÃ  há»£p cháº¥t cá»§a oxi vá»›i má»™t nguyÃªn tá»‘ khÃ¡c. CÃ³ thá»ƒ chia thÃ nh **oxit bazÆ¡**, **oxit axit**, **oxit lÆ°á»¡ng tÃ­nh** vÃ  **oxit trung tÃ­nh**. VÃ­ dá»¥: Na2O lÃ  oxit bazÆ¡, SO3 lÃ  oxit axit, Al2O3 lÃ  oxit lÆ°á»¡ng tÃ­nh, CO lÃ  oxit trung tÃ­nh.',
    suggestions: ['Axit bazÆ¡ muá»‘i', 'Pháº£n á»©ng oxit vá»›i nÆ°á»›c']
  },
  {
    id: 'neutralization',
    category: 'Axit â€“ bazÆ¡ â€“ muá»‘i',
    patterns: ['trung hÃ²a', 'pháº£n á»©ng trung hÃ²a', 'neutralization'],
    title: 'Pháº£n á»©ng trung hÃ²a',
    formula: 'H^+ + OH^- \rightarrow H_2O',
    explanation:
      'Pháº£n á»©ng trung hÃ²a lÃ  pháº£n á»©ng giá»¯a axit vÃ  bazÆ¡ táº¡o thÃ nh muá»‘i vÃ  nÆ°á»›c. á»ž má»©c ion rÃºt gá»n, báº£n cháº¥t cá»§a pháº£n á»©ng lÃ  ion **H+** káº¿t há»£p vá»›i ion **OH-** táº¡o thÃ nh nÆ°á»›c.',
    suggestions: ['Axit lÃ  gÃ¬?', 'BazÆ¡ lÃ  gÃ¬?', 'pH lÃ  gÃ¬?']
  },
  {
    id: 'ph-scale',
    category: 'Axit â€“ bazÆ¡ â€“ muá»‘i',
    patterns: ['ph lÃ  gÃ¬', 'thang ph', 'mÃ´i trÆ°á»ng axit bazÆ¡', 'poh'],
    title: 'pH vÃ  mÃ´i trÆ°á»ng dung dá»‹ch',
    formula: 'pH = -\\log[H^+]',
    explanation:
      'pH dÃ¹ng Ä‘á»ƒ biá»ƒu thá»‹ Ä‘á»™ axit â€“ bazÆ¡ cá»§a dung dá»‹ch. Dung dá»‹ch cÃ³ **pH < 7** thÆ°á»ng lÃ  mÃ´i trÆ°á»ng axit, **pH = 7** gáº§n trung tÃ­nh, **pH > 7** lÃ  mÃ´i trÆ°á»ng bazÆ¡ á»Ÿ Ä‘iá»u kiá»‡n thÆ°á»ng dÃ¹ng trong chÆ°Æ¡ng trÃ¬nh há»c. Vá»›i nÆ°á»›c tinh khiáº¿t á»Ÿ 25Â°C: **pH + pOH = 14**.',
    suggestions: ['Axit máº¡nh vÃ  yáº¿u', 'BazÆ¡ máº¡nh vÃ  yáº¿u']
  },
  {
    id: 'strong-weak-acid-base',
    category: 'Axit â€“ bazÆ¡ â€“ muá»‘i',
    patterns: ['axit máº¡nh axit yáº¿u', 'bazÆ¡ máº¡nh bazÆ¡ yáº¿u', 'Ä‘iá»‡n li máº¡nh yáº¿u'],
    title: 'Axit máº¡nh/yáº¿u vÃ  bazÆ¡ máº¡nh/yáº¿u',
    explanation:
      'Axit máº¡nh vÃ  bazÆ¡ máº¡nh phÃ¢n li gáº§n nhÆ° hoÃ n toÃ n trong nÆ°á»›c; axit yáº¿u vÃ  bazÆ¡ yáº¿u chá»‰ phÃ¢n li má»™t pháº§n. Cáº§n phÃ¢n biá»‡t **Ä‘á»™ máº¡nh** vá»›i **ná»“ng Ä‘á»™**: má»™t axit yáº¿u váº«n cÃ³ thá»ƒ cÃ³ dung dá»‹ch Ä‘áº­m Ä‘áº·c, cÃ²n axit máº¡nh cÃ³ thá»ƒ á»Ÿ ná»“ng Ä‘á»™ tháº¥p.',
    suggestions: ['pH lÃ  gÃ¬?', 'Cháº¥t Ä‘iá»‡n li']
  },
  {
    id: 'precipitation',
    category: 'Pháº£n á»©ng hÃ³a há»c',
    patterns: ['káº¿t tá»§a', 'precipitation', 'pháº£n á»©ng káº¿t tá»§a'],
    title: 'Pháº£n á»©ng káº¿t tá»§a',
    explanation:
      'Pháº£n á»©ng káº¿t tá»§a xáº£y ra khi hai dung dá»‹ch cháº¥t Ä‘iá»‡n li pháº£n á»©ng vá»›i nhau táº¡o thÃ nh cháº¥t ráº¯n khÃ´ng tan. VÃ­ dá»¥ quen thuá»™c lÃ  **AgNO3 + NaCl â†’ AgClâ†“ + NaNO3**. Viá»‡c nháº­n biáº¿t cháº¥t káº¿t tá»§a dá»±a vÃ o quy táº¯c tÃ­nh tan lÃ  ráº¥t quan trá»ng.',
    suggestions: ['Báº£ng tÃ­nh tan', 'Pháº£n á»©ng trao Ä‘á»•i']
  },
  {
    id: 'gas-evolution',
    category: 'Pháº£n á»©ng hÃ³a há»c',
    patterns: ['pháº£n á»©ng táº¡o khÃ­', 'giáº£i phÃ³ng khÃ­', 'thoÃ¡t khÃ­'],
    title: 'Pháº£n á»©ng táº¡o cháº¥t khÃ­',
    explanation:
      'Má»™t sá»‘ pháº£n á»©ng trong dung dá»‹ch táº¡o ra cháº¥t khÃ­ nhÆ° CO2, SO2, H2S, NH3 hoáº·c H2. VÃ­ dá»¥: muá»‘i cacbonat tÃ¡c dá»¥ng vá»›i axit táº¡o CO2; kim loáº¡i tÃ¡c dá»¥ng vá»›i axit loÃ£ng thÆ°á»ng táº¡o H2; muá»‘i amoni vá»›i bazÆ¡ máº¡nh cÃ³ thá»ƒ giáº£i phÃ³ng NH3.',
    suggestions: ['Kim loáº¡i + axit', 'Muá»‘i cacbonat']
  },
  {
    id: 'reaction-classification',
    category: 'Pháº£n á»©ng hÃ³a há»c',
    patterns: ['phÃ¢n loáº¡i pháº£n á»©ng', 'cÃ¡c loáº¡i pháº£n á»©ng', 'reaction types'],
    title: 'Má»™t sá»‘ kiá»ƒu pháº£n á»©ng hÃ³a há»c thÆ°á»ng gáº·p',
    explanation:
      'CÃ¡c kiá»ƒu pháº£n á»©ng cÆ¡ báº£n gá»“m: **hÃ³a há»£p**, **phÃ¢n há»§y**, **tháº¿**, **trao Ä‘á»•i**, **trung hÃ²a**, **chÃ¡y**, **oxi hÃ³a â€“ khá»­**, **káº¿t tá»§a**, **táº¡o khÃ­**. Má»™t pháº£n á»©ng thá»±c táº¿ cÃ³ thá»ƒ Ä‘á»“ng thá»i thuá»™c nhiá»u nhÃ³m náº¿u xÃ©t theo tiÃªu chÃ­ khÃ¡c nhau.',
    suggestions: ['Pháº£n á»©ng oxi hÃ³a khá»­', 'Pháº£n á»©ng trao Ä‘á»•i']
  },
  {
    id: 'reaction-rate',
    category: 'Äá»™ng hÃ³a há»c',
    patterns: ['tá»‘c Ä‘á»™ pháº£n á»©ng', 'yáº¿u tá»‘ áº£nh hÆ°á»Ÿng tá»‘c Ä‘á»™ pháº£n á»©ng', 'reaction rate'],
    title: 'Tá»‘c Ä‘á»™ pháº£n á»©ng vÃ  cÃ¡c yáº¿u tá»‘ áº£nh hÆ°á»Ÿng',
    explanation:
      'Tá»‘c Ä‘á»™ pháº£n á»©ng cho biáº¿t má»©c Ä‘á»™ nhanh cháº­m cá»§a pháº£n á»©ng. CÃ¡c yáº¿u tá»‘ áº£nh hÆ°á»Ÿng chÃ­nh gá»“m **ná»“ng Ä‘á»™**, **nhiá»‡t Ä‘á»™**, **diá»‡n tÃ­ch bá» máº·t cháº¥t ráº¯n**, **Ã¡p suáº¥t** vá»›i cháº¥t khÃ­ vÃ  **cháº¥t xÃºc tÃ¡c**. TÄƒng nhiá»‡t Ä‘á»™ thÆ°á»ng lÃ m tÄƒng tá»‘c Ä‘á»™ pháº£n á»©ng.',
    suggestions: ['XÃºc tÃ¡c lÃ  gÃ¬?', 'CÃ¢n báº±ng hÃ³a há»c']
  },
  {
    id: 'catalyst',
    category: 'Äá»™ng hÃ³a há»c',
    patterns: ['xÃºc tÃ¡c', 'catalyst', 'cháº¥t xÃºc tÃ¡c lÃ  gÃ¬'],
    title: 'Cháº¥t xÃºc tÃ¡c',
    explanation:
      'Cháº¥t xÃºc tÃ¡c lÃ m tÄƒng tá»‘c Ä‘á»™ pháº£n á»©ng báº±ng cÃ¡ch táº¡o cÆ¡ cháº¿ pháº£n á»©ng cÃ³ nÄƒng lÆ°á»£ng hoáº¡t hÃ³a tháº¥p hÆ¡n nhÆ°ng **khÃ´ng lÃ m thay Ä‘á»•i vá»‹ trÃ­ cÃ¢n báº±ng cuá»‘i cÃ¹ng** vÃ  khÃ´ng bá»‹ tiÃªu hao hoÃ n toÃ n sau pháº£n á»©ng.',
    suggestions: ['Tá»‘c Ä‘á»™ pháº£n á»©ng', 'CÃ¢n báº±ng hÃ³a há»c']
  },
  {
    id: 'chemical-equilibrium',
    category: 'CÃ¢n báº±ng hÃ³a há»c',
    patterns: ['cÃ¢n báº±ng hÃ³a há»c', 'equilibrium', 'pháº£n á»©ng thuáº­n nghá»‹ch'],
    title: 'CÃ¢n báº±ng hÃ³a há»c',
    explanation:
      'CÃ¢n báº±ng hÃ³a há»c lÃ  tráº¡ng thÃ¡i cá»§a pháº£n á»©ng thuáº­n nghá»‹ch khi tá»‘c Ä‘á»™ pháº£n á»©ng thuáº­n báº±ng tá»‘c Ä‘á»™ pháº£n á»©ng nghá»‹ch. á»ž tráº¡ng thÃ¡i cÃ¢n báº±ng, ná»“ng Ä‘á»™ cÃ¡c cháº¥t khÃ´ng Ä‘á»•i theo thá»i gian nhÆ°ng pháº£n á»©ng váº«n diá»…n ra á»Ÿ má»©c vi mÃ´.',
    suggestions: ['Le Chatelier', 'Háº±ng sá»‘ cÃ¢n báº±ng']
  },
  {
    id: 'le-chatelier',
    category: 'CÃ¢n báº±ng hÃ³a há»c',
    patterns: ['le chatelier', 'dá»‹ch chuyá»ƒn cÃ¢n báº±ng', 'nguyÃªn lÃ½ chuyá»ƒn dá»‹ch cÃ¢n báº±ng'],
    title: 'NguyÃªn lÃ½ Le Chatelier',
    explanation:
      'Khi há»‡ cÃ¢n báº±ng chá»‹u tÃ¡c Ä‘á»™ng tá»« bÃªn ngoÃ i nhÆ° thay Ä‘á»•i ná»“ng Ä‘á»™, nhiá»‡t Ä‘á»™ hoáº·c Ã¡p suáº¥t, cÃ¢n báº±ng sáº½ chuyá»ƒn dá»‹ch theo chiá»u lÃ m giáº£m tÃ¡c Ä‘á»™ng Ä‘Ã³. NguyÃªn lÃ½ nÃ y giÃºp dá»± Ä‘oÃ¡n chiá»u chuyá»ƒn dá»‹ch cá»§a há»‡ cÃ¢n báº±ng.',
    suggestions: ['CÃ¢n báº±ng hÃ³a há»c', 'Tá»‘c Ä‘á»™ pháº£n á»©ng']
  },
  {
    id: 'enthalpy',
    category: 'Nhiá»‡t hÃ³a há»c',
    patterns: ['nhiá»‡t pháº£n á»©ng', 'entanpi', 'enthalpy', 'delta h'],
    title: 'Hiá»‡u á»©ng nhiá»‡t cá»§a pháº£n á»©ng',
    formula: '\\Delta H = H_{sp} - H_{tp}',
    explanation:
      'Náº¿u **Î”H < 0**, pháº£n á»©ng tá»a nhiá»‡t; náº¿u **Î”H > 0**, pháº£n á»©ng thu nhiá»‡t. Nhiá»‡t hÃ³a há»c giÃºp giáº£i thÃ­ch vÃ¬ sao má»™t sá»‘ pháº£n á»©ng tá»± lÃ m nÃ³ng mÃ´i trÆ°á»ng, cÃ²n má»™t sá»‘ pháº£n á»©ng cáº§n háº¥p thá»¥ nhiá»‡t Ä‘á»ƒ xáº£y ra.',
    suggestions: ['Pháº£n á»©ng tá»a nhiá»‡t', 'Äá»‹nh luáº­t Hess']
  },
  {
    id: 'hess-law',
    category: 'Nhiá»‡t hÃ³a há»c',
    patterns: ['Ä‘á»‹nh luáº­t hess', 'hess law'],
    title: 'Äá»‹nh luáº­t Hess',
    explanation:
      'Biáº¿n thiÃªn entanpi cá»§a pháº£n á»©ng chá»‰ phá»¥ thuá»™c vÃ o tráº¡ng thÃ¡i Ä‘áº§u vÃ  tráº¡ng thÃ¡i cuá»‘i, khÃ´ng phá»¥ thuá»™c vÃ o con Ä‘Æ°á»ng thá»±c hiá»‡n pháº£n á»©ng. VÃ¬ váº­y cÃ³ thá»ƒ cá»™ng trá»« cÃ¡c phÆ°Æ¡ng trÃ¬nh nhiá»‡t hÃ³a há»c Ä‘á»ƒ tÃ­nh Î”H cá»§a pháº£n á»©ng cáº§n tÃ¬m.',
    suggestions: ['Hiá»‡u á»©ng nhiá»‡t', 'Chu trÃ¬nh Born-Haber']
  },
  {
    id: 'redox',
    category: 'Oxi hÃ³a â€“ khá»­',
    patterns: ['oxi hÃ³a khá»­', 'pháº£n á»©ng oxi hÃ³a khá»­', 'redox', 'sá»‘ oxi hÃ³a', 'cháº¥t oxi hÃ³a lÃ  gÃ¬', 'cháº¥t khá»­ lÃ  gÃ¬'],
    title: 'Pháº£n á»©ng oxi hÃ³a â€“ khá»­',
    explanation:
      'Pháº£n á»©ng oxi hÃ³a â€“ khá»­ lÃ  pháº£n á»©ng cÃ³ sá»± **thay Ä‘á»•i sá»‘ oxi hÃ³a** cá»§a cÃ¡c nguyÃªn tá»‘. **Cháº¥t oxi hÃ³a** lÃ  cháº¥t nháº­n electron, cÃ²n **cháº¥t khá»­** lÃ  cháº¥t nhÆ°á»ng electron. QuÃ¡ trÃ¬nh oxi hÃ³a lÃ  nhÆ°á»ng electron; quÃ¡ trÃ¬nh khá»­ lÃ  nháº­n electron.',
    suggestions: ['Sá»‘ oxi hÃ³a', 'CÃ¢n báº±ng pháº£n á»©ng oxi hÃ³a khá»­']
  },
  {
    id: 'oxidation-number',
    category: 'Oxi hÃ³a â€“ khá»­',
    patterns: ['sá»‘ oxi hÃ³a', 'oxidation number', 'quy táº¯c sá»‘ oxi hÃ³a'],
    title: 'Sá»‘ oxi hÃ³a vÃ  quy táº¯c cÆ¡ báº£n',
    explanation:
      'Sá»‘ oxi hÃ³a lÃ  Ä‘iá»‡n tÃ­ch giáº£ Ä‘á»‹nh cá»§a nguyÃªn tá»­ trong há»£p cháº¥t náº¿u xem electron liÃªn káº¿t thuá»™c hoÃ n toÃ n vá» nguyÃªn tá»­ cÃ³ Ä‘á»™ Ã¢m Ä‘iá»‡n lá»›n hÆ¡n. Má»™t sá»‘ quy táº¯c thÆ°á»ng dÃ¹ng: Ä‘Æ¡n cháº¥t cÃ³ sá»‘ oxi hÃ³a báº±ng 0; tá»•ng sá»‘ oxi hÃ³a trong phÃ¢n tá»­ trung hÃ²a báº±ng 0; tá»•ng sá»‘ oxi hÃ³a trong ion báº±ng Ä‘iá»‡n tÃ­ch cá»§a ion.',
    suggestions: ['Oxi hÃ³a khá»­', 'Cháº¥t oxi hÃ³a cháº¥t khá»­']
  },
  {
    id: 'electrochemistry',
    category: 'Äiá»‡n hÃ³a',
    patterns: ['Ä‘iá»‡n hÃ³a', 'pin Ä‘iá»‡n hÃ³a', 'galvani', 'Ä‘iá»‡n cá»±c'],
    title: 'Äiá»‡n hÃ³a há»c cÆ¡ báº£n',
    explanation:
      'Äiá»‡n hÃ³a há»c nghiÃªn cá»©u má»‘i liÃªn há»‡ giá»¯a pháº£n á»©ng oxi hÃ³a â€“ khá»­ vÃ  dÃ²ng Ä‘iá»‡n. Trong **pin Ä‘iá»‡n hÃ³a**, pháº£n á»©ng hÃ³a há»c tá»± diá»…n ra Ä‘á»ƒ táº¡o dÃ²ng Ä‘iá»‡n. Trong **Ä‘iá»‡n phÃ¢n**, dÃ²ng Ä‘iá»‡n Ä‘Æ°á»£c dÃ¹ng Ä‘á»ƒ Ã©p pháº£n á»©ng oxi hÃ³a â€“ khá»­ xáº£y ra theo chiá»u khÃ´ng tá»± diá»…n ra.',
    suggestions: ['Äiá»‡n phÃ¢n', 'Pin Daniell']
  },
  {
    id: 'electrolysis',
    category: 'Äiá»‡n hÃ³a',
    patterns: ['Ä‘iá»‡n phÃ¢n', 'electrolysis', 'catot anot'],
    title: 'Äiá»‡n phÃ¢n',
    explanation:
      'Trong Ä‘iá»‡n phÃ¢n, **catot** lÃ  nÆ¡i xáº£y ra quÃ¡ trÃ¬nh **khá»­**, **anot** lÃ  nÆ¡i xáº£y ra quÃ¡ trÃ¬nh **oxi hÃ³a**. Khi Ä‘iá»‡n phÃ¢n dung dá»‹ch, viá»‡c Æ°u tiÃªn ion nÃ o bá»‹ Ä‘iá»‡n phÃ¢n cÃ²n phá»¥ thuá»™c vÃ o báº£n cháº¥t ion vÃ  Ä‘iá»‡n cá»±c.',
    suggestions: ['Äiá»‡n hÃ³a há»c', 'Oxi hÃ³a khá»­']
  },
  {
    id: 'metal-activity-series',
    category: 'Kim loáº¡i',
    patterns: ['dÃ£y hoáº¡t Ä‘á»™ng hÃ³a há»c kim loáº¡i', 'dÃ£y Ä‘iá»‡n hÃ³a kim loáº¡i', 'kim loáº¡i máº¡nh yáº¿u'],
    title: 'DÃ£y hoáº¡t Ä‘á»™ng hÃ³a há»c cá»§a kim loáº¡i',
    explanation:
      'DÃ£y hoáº¡t Ä‘á»™ng hÃ³a há»c cho biáº¿t má»©c Ä‘á»™ dá»… nhÆ°á»ng electron cá»§a kim loáº¡i. Kim loáº¡i hoáº¡t Ä‘á»™ng máº¡nh cÃ³ thá»ƒ Ä‘áº©y kim loáº¡i yáº¿u hÆ¡n ra khá»i dung dá»‹ch muá»‘i cá»§a nÃ³; nhiá»u kim loáº¡i Ä‘á»©ng trÆ°á»›c H cÃ³ thá»ƒ pháº£n á»©ng vá»›i axit loÃ£ng giáº£i phÃ³ng H2.',
    suggestions: ['Kim loáº¡i tÃ¡c dá»¥ng vá»›i axit', 'Äiá»‡n hÃ³a há»c']
  },
  {
    id: 'metal-properties',
    category: 'Kim loáº¡i',
    patterns: ['tÃ­nh cháº¥t kim loáº¡i', 'kim loáº¡i cÃ³ tÃ­nh cháº¥t gÃ¬'],
    title: 'TÃ­nh cháº¥t váº­t lÃ½ vÃ  hÃ³a há»c chung cá»§a kim loáº¡i',
    explanation:
      'Kim loáº¡i thÆ°á»ng cÃ³ Ã¡nh kim, dáº«n Ä‘iá»‡n, dáº«n nhiá»‡t, tÃ­nh dáº»o. Vá» hÃ³a há»c, kim loáº¡i cÃ³ xu hÆ°á»›ng **nhÆ°á»ng electron** nÃªn thá»ƒ hiá»‡n tÃ­nh khá»­. Kim loáº¡i cÃ³ thá»ƒ tÃ¡c dá»¥ng vá»›i phi kim, vá»›i nÆ°á»›c hoáº·c dung dá»‹ch axit tÃ¹y vÃ o má»©c Ä‘á»™ hoáº¡t Ä‘á»™ng hÃ³a há»c.',
    suggestions: ['DÃ£y hoáº¡t Ä‘á»™ng hÃ³a há»c', 'Ä‚n mÃ²n kim loáº¡i']
  },
  {
    id: 'corrosion',
    category: 'Kim loáº¡i',
    patterns: ['Äƒn mÃ²n kim loáº¡i', 'gá»‰ sáº¯t', 'corrosion'],
    title: 'Ä‚n mÃ²n kim loáº¡i',
    explanation:
      'Ä‚n mÃ²n kim loáº¡i lÃ  quÃ¡ trÃ¬nh phÃ¡ há»§y kim loáº¡i do tÃ¡c dá»¥ng cá»§a mÃ´i trÆ°á»ng. CÃ³ hai dáº¡ng chÃ­nh lÃ  **Äƒn mÃ²n hÃ³a há»c** vÃ  **Äƒn mÃ²n Ä‘iá»‡n hÃ³a**. Chá»‘ng Äƒn mÃ²n cÃ³ thá»ƒ báº±ng sÆ¡n phá»§, máº¡ kim loáº¡i, báº£o vá»‡ Ä‘iá»‡n hÃ³a hoáº·c dÃ¹ng há»£p kim bá»n hÆ¡n.',
    suggestions: ['Äiá»‡n hÃ³a há»c', 'Kim loáº¡i']
  },
  {
    id: 'nonmetal-properties',
    category: 'Phi kim',
    patterns: ['tÃ­nh cháº¥t phi kim', 'phi kim cÃ³ tÃ­nh cháº¥t gÃ¬'],
    title: 'TÃ­nh cháº¥t chung cá»§a phi kim',
    explanation:
      'Phi kim thÆ°á»ng cÃ³ xu hÆ°á»›ng **nháº­n electron** hoáº·c dÃ¹ng chung electron trong liÃªn káº¿t cá»™ng hÃ³a trá»‹. Nhiá»u phi kim lÃ  cháº¥t oxi hÃ³a, cÃ³ thá»ƒ pháº£n á»©ng vá»›i kim loáº¡i táº¡o muá»‘i hoáº·c oxit; oxit cá»§a phi kim nhiá»u trÆ°á»ng há»£p lÃ  oxit axit.',
    suggestions: ['LiÃªn káº¿t cá»™ng hÃ³a trá»‹', 'Oxit axit']
  },
  {
    id: 'halogen',
    category: 'Phi kim',
    patterns: ['halogen', 'nhÃ³m halogen', 'clo brom iot flo'],
    title: 'NhÃ³m halogen',
    explanation:
      'Halogen gá»“m F, Cl, Br, I... lÃ  cÃ¡c phi kim máº¡nh, thÆ°á»ng cÃ³ sá»‘ oxi hÃ³a -1 trong há»£p cháº¥t. ChÃºng cÃ³ kháº£ nÄƒng oxi hÃ³a khÃ¡ máº¡nh, pháº£n á»©ng vá»›i kim loáº¡i táº¡o muá»‘i halogenua vÃ  vá»›i hiÄ‘ro táº¡o hiÄ‘ro halogenua.',
    suggestions: ['Axit HCl', 'Sá»‘ oxi hÃ³a']
  },
  {
    id: 'oxygen-sulfur',
    category: 'Phi kim',
    patterns: ['oxi vÃ  lÆ°u huá»³nh', 'nhÃ³m oxi lÆ°u huá»³nh', 'nhÃ³m via', 'SO2 vÃ  SO3', 'O2 vÃ  O3'],
    title: 'NhÃ³m oxi â€“ lÆ°u huá»³nh',
    explanation:
      'Oxi lÃ  phi kim hoáº¡t Ä‘á»™ng máº¡nh, tham gia nhiá»u pháº£n á»©ng chÃ¡y vÃ  oxi hÃ³a. LÆ°u huá»³nh cÃ³ thá»ƒ vá»«a thá»ƒ hiá»‡n tÃ­nh oxi hÃ³a vá»«a thá»ƒ hiá»‡n tÃ­nh khá»­, cÃ³ nhiá»u sá»‘ oxi hÃ³a khÃ¡c nhau nhÆ° -2, +4, +6.',
    suggestions: ['Oxi hÃ³a khá»­', 'SO2 vÃ  SO3']
  },
  {
    id: 'nitrogen-phosphorus',
    category: 'Phi kim',
    patterns: ['nitÆ¡ photpho', 'nhÃ³m nitÆ¡', 'nhÃ³m va'],
    title: 'NhÃ³m nitÆ¡ â€“ photpho',
    explanation:
      'NitÆ¡ khÃ¡ trÆ¡ á»Ÿ Ä‘iá»u kiá»‡n thÆ°á»ng do liÃªn káº¿t ba bá»n trong N2, nhÆ°ng nhiá»u há»£p cháº¥t cá»§a nitÆ¡ ráº¥t quan trá»ng nhÆ° NH3, HNO3, muá»‘i nitrat. Photpho cÃ³ dáº¡ng tráº¯ng vÃ  Ä‘á», tham gia nhiá»u pháº£n á»©ng oxi hÃ³a â€“ khá»­ vÃ  táº¡o axit photphoric cÃ¹ng cÃ¡c muá»‘i photphat.',
    suggestions: ['Amoniac', 'Axit nitric', 'Photphat']
  },
  {
    id: 'organic-overview',
    category: 'Há»¯u cÆ¡',
    patterns: ['hÃ³a há»¯u cÆ¡ lÃ  gÃ¬', 'organic chemistry', 'há»£p cháº¥t há»¯u cÆ¡'],
    title: 'KhÃ¡i quÃ¡t vá» hÃ³a há»c há»¯u cÆ¡',
    explanation:
      'HÃ³a há»¯u cÆ¡ nghiÃªn cá»©u cÃ¡c há»£p cháº¥t cá»§a cacbon, ngoáº¡i trá»« má»™t sá»‘ há»£p cháº¥t Ä‘Æ¡n giáº£n nhÆ° CO, CO2, H2CO3, muá»‘i cacbonat, xianua kim loáº¡i... Há»£p cháº¥t há»¯u cÆ¡ thÆ°á»ng cÃ³ liÃªn káº¿t cá»™ng hÃ³a trá»‹, Ä‘a dáº¡ng vá» cáº¥u trÃºc vÃ  pháº£n á»©ng.',
    suggestions: ['HiÄ‘rocacbon', 'NhÃ³m chá»©c', 'Äá»“ng phÃ¢n']
  },
  {
    id: 'hydrocarbon',
    category: 'Há»¯u cÆ¡',
    patterns: ['hiÄ‘rocacbon', 'hydrocarbon', 'há»£p cháº¥t chá»‰ cÃ³ c vÃ  h'],
    title: 'HiÄ‘rocacbon',
    explanation:
      'HiÄ‘rocacbon lÃ  há»£p cháº¥t há»¯u cÆ¡ chá»‰ chá»©a cacbon vÃ  hiÄ‘ro. Gá»“m cÃ¡c nhÃ³m lá»›n nhÆ° **ankan**, **anken**, **ankin**, **aren**. TÃ­nh cháº¥t hÃ³a há»c phá»¥ thuá»™c vÃ o loáº¡i liÃªn káº¿t trong phÃ¢n tá»­: no, khÃ´ng no hay thÆ¡m.',
    suggestions: ['Ankan', 'Anken', 'Ankin', 'Benzen']
  },
  {
    id: 'alkane',
    category: 'Há»¯u cÆ¡',
    patterns: ['ankan', 'alkane', 'cÃ´ng thá»©c ankan'],
    title: 'Ankan',
    formula: 'C_nH_{2n+2}',
    explanation:
      'Ankan lÃ  hiÄ‘rocacbon no máº¡ch há»Ÿ, chá»‰ chá»©a liÃªn káº¿t Ä‘Æ¡n Câ€“C vÃ  Câ€“H. Pháº£n á»©ng Ä‘áº·c trÆ°ng thÆ°á»ng gáº·p lÃ  **pháº£n á»©ng tháº¿** vá»›i halogen vÃ  **pháº£n á»©ng chÃ¡y**.',
    suggestions: ['Anken', 'Äá»“ng phÃ¢n máº¡ch cacbon']
  },
  {
    id: 'alkene',
    category: 'Há»¯u cÆ¡',
    patterns: ['anken', 'alkene', 'cÃ´ng thá»©c anken'],
    title: 'Anken',
    formula: 'C_nH_{2n}',
    explanation:
      'Anken lÃ  hiÄ‘rocacbon khÃ´ng no cÃ³ má»™t liÃªn káº¿t Ä‘Ã´i C=C. Pháº£n á»©ng Ä‘áº·c trÆ°ng lÃ  **pháº£n á»©ng cá»™ng** nhÆ° cá»™ng H2, Br2, HX vÃ  pháº£n á»©ng trÃ¹ng há»£p Ä‘á»‘i vá»›i má»™t sá»‘ monome phÃ¹ há»£p.',
    suggestions: ['Ankin', 'Pháº£n á»©ng cá»™ng']
  },
  {
    id: 'alkyne',
    category: 'Há»¯u cÆ¡',
    patterns: ['ankin', 'alkyne', 'cÃ´ng thá»©c ankin'],
    title: 'Ankin',
    formula: 'C_nH_{2n-2}',
    explanation:
      'Ankin lÃ  hiÄ‘rocacbon khÃ´ng no cÃ³ má»™t liÃªn káº¿t ba Câ‰¡C. ChÃºng cÃ³ thá»ƒ tham gia pháº£n á»©ng cá»™ng tÆ°Æ¡ng tá»± anken; má»™t sá»‘ ankin Ä‘áº§u máº¡ch cÃ²n thá»ƒ hiá»‡n tÃ­nh axit ráº¥t yáº¿u.',
    suggestions: ['Anken', 'Axetilen']
  },
  {
    id: 'benzene',
    category: 'Há»¯u cÆ¡',
    patterns: ['benzen', 'benzene', 'aren'],
    title: 'Benzen vÃ  hiÄ‘rocacbon thÆ¡m',
    explanation:
      'Benzen lÃ  Ä‘áº¡i diá»‡n quan trá»ng cá»§a hiÄ‘rocacbon thÆ¡m. Do há»‡ electron Ï€ liÃªn há»£p bá»n, benzen Æ°u tiÃªn tham gia **phÃ¡ÂºÂ£n á»©ng tháº¿** hÆ¡n lÃ  pháº£n á»©ng cá»™ng. Benzen lÃ  nguyÃªn liá»‡u ná»n cá»§a nhiá»u há»£p cháº¥t há»¯u cÆ¡ cÃ´ng nghiá»‡p.',
    suggestions: ['Ankan', 'Anken', 'Phenol']
  },
  {
    id: 'functional-group',
    category: 'Há»¯u cÆ¡',
    patterns: ['nhÃ³m chá»©c', 'functional group'],
    title: 'NhÃ³m chá»©c',
    explanation:
      'NhÃ³m chá»©c lÃ  nhÃ³m nguyÃªn tá»­ quyáº¿t Ä‘á»‹nh tÃ­nh cháº¥t hÃ³a há»c Ä‘áº·c trÆ°ng cá»§a há»£p cháº¥t há»¯u cÆ¡. VÃ­ dá»¥: **â€“OH** cá»§a ancol, **â€“CHO** cá»§a andehit, **>C=O** cá»§a xeton, **â€“COOH** cá»§a axit cacboxylic, **â€“COOâ€“** cá»§a este.',
    suggestions: ['Ancol', 'Axit cacboxylic', 'Este']
  },
  {
    id: 'alcohol',
    category: 'Há»¯u cÆ¡',
    patterns: ['ancol', 'alcohol', 'etanol'],
    title: 'Ancol',
    explanation:
      'Ancol lÃ  há»£p cháº¥t há»¯u cÆ¡ cÃ³ nhÃ³m **â€“OH** liÃªn káº¿t trá»±c tiáº¿p vá»›i nguyÃªn tá»­ cacbon no. Ancol cÃ³ thá»ƒ tham gia pháº£n á»©ng vá»›i kim loáº¡i kiá»m, pháº£n á»©ng tÃ¡ch nÆ°á»›c, oxi hÃ³a vÃ  pháº£n á»©ng chÃ¡y.',
    suggestions: ['Phenol', 'Este hÃ³a']
  },
  {
    id: 'phenol',
    category: 'Há»¯u cÆ¡',
    patterns: ['phenol', 'phenol lÃ  gÃ¬'],
    title: 'Phenol',
    explanation:
      'Phenol cÃ³ nhÃ³m â€“OH gáº¯n trá»±c tiáº¿p vÃ o vÃ²ng benzen. Do áº£nh hÆ°á»Ÿng cá»§a vÃ²ng thÆ¡m, phenol thá»ƒ hiá»‡n tÃ­nh axit máº¡nh hÆ¡n ancol thÃ´ng thÆ°á»ng vÃ  cÃ³ thá»ƒ pháº£n á»©ng vá»›i dung dá»‹ch bazÆ¡ máº¡nh.',
    suggestions: ['Ancol', 'Benzen']
  },
  {
    id: 'aldehyde-ketone',
    category: 'Há»¯u cÆ¡',
    patterns: ['andehit', 'xeton', 'aldehyde', 'ketone'],
    title: 'Andehit vÃ  xeton',
    explanation:
      'Andehit chá»©a nhÃ³m **â€“CHO**, cÃ²n xeton chá»©a nhÃ³m **>C=O** náº±m giá»¯a máº¡ch cacbon. Andehit dá»… bá»‹ oxi hÃ³a hÆ¡n xeton; má»™t sá»‘ pháº£n á»©ng nháº­n biáº¿t andehit gá»“m pháº£n á»©ng trÃ¡ng báº¡c vÃ  pháº£n á»©ng vá»›i Cu(OH)2 trong mÃ´i trÆ°á»ng kiá»m, Ä‘un nÃ³ng.',
    suggestions: ['Axit cacboxylic', 'Ancol']
  },
  {
    id: 'carboxylic-acid',
    category: 'Há»¯u cÆ¡',
    patterns: ['axit cacboxylic', 'carboxylic acid', 'cooh'],
    title: 'Axit cacboxylic',
    explanation:
      'Axit cacboxylic chá»©a nhÃ³m chá»©c **â€“COOH**. ChÃºng thá»ƒ hiá»‡n tÃ­nh axit, pháº£n á»©ng vá»›i bazÆ¡, oxit bazÆ¡, muá»‘i cacbonat vÃ  cÃ³ thá»ƒ tham gia pháº£n á»©ng este hÃ³a vá»›i ancol.',
    suggestions: ['Este', 'Ancol', 'Pháº£n á»©ng este hÃ³a']
  },
  {
    id: 'ester',
    category: 'Há»¯u cÆ¡',
    patterns: ['este', 'ester', 'este hÃ³a'],
    title: 'Este',
    explanation:
      'Este thÆ°á»ng Ä‘Æ°á»£c táº¡o thÃ nh tá»« pháº£n á»©ng giá»¯a axit cacboxylic vÃ  ancol. Nhiá»u este cÃ³ mÃ¹i thÆ¡m Ä‘áº·c trÆ°ng. Pháº£n á»©ng quan trá»ng cá»§a este lÃ  **thá»§y phÃ¢n** trong mÃ´i trÆ°á»ng axit hoáº·c bazÆ¡; trong mÃ´i trÆ°á»ng bazÆ¡ pháº£n á»©ng cÃ²n gá»i lÃ  **xÃ  phÃ²ng hÃ³a**.',
    suggestions: ['Axit cacboxylic', 'Lipit', 'XÃ  phÃ²ng hÃ³a']
  },
  {
    id: 'lipid',
    category: 'Há»¯u cÆ¡',
    patterns: ['lipit', 'lipid', 'cháº¥t bÃ©o'],
    title: 'Lipit vÃ  cháº¥t bÃ©o',
    explanation:
      'Cháº¥t bÃ©o lÃ  trieste cá»§a glixerol vá»›i axit bÃ©o. ChÃºng khÃ´ng tan trong nÆ°á»›c, nháº¹ hÆ¡n nÆ°á»›c vÃ  lÃ  nguá»“n dá»± trá»¯ nÄƒng lÆ°á»£ng quan trá»ng. Pháº£n á»©ng Ä‘áº·c trÆ°ng lÃ  thá»§y phÃ¢n/xÃ  phÃ²ng hÃ³a.',
    suggestions: ['Este', 'Glixerol']
  },
  {
    id: 'carbohydrate',
    category: 'Há»¯u cÆ¡',
    patterns: ['cacbohidrat', 'glucozo', 'saccarozo', 'tinh bá»™t', 'cellulose'],
    title: 'CacbohiÄ‘rat',
    explanation:
      'CacbohiÄ‘rat gá»“m cÃ¡c nhÃ³m lá»›n nhÆ° **monosaccarit** (glucozÆ¡, fructozÆ¡), **Ä‘isaccarit** (saccarozÆ¡) vÃ  **polisaccarit** (tinh bá»™t, xenlulozÆ¡). ÄÃ¢y lÃ  nhÃ³m cháº¥t há»¯u cÆ¡ quan trá»ng trong sinh há»c vÃ  cÃ´ng nghiá»‡p thá»±c pháº©m.',
    suggestions: ['GlucozÆ¡', 'Tinh bá»™t', 'XenlulozÆ¡']
  },
  {
    id: 'amine-amino-acid-protein',
    category: 'Há»¯u cÆ¡',
    patterns: ['amin', 'amino axit', 'protein', 'peptit'],
    title: 'Amin, amino axit, peptit vÃ  protein',
    explanation:
      'Amin lÃ  dáº«n xuáº¥t cá»§a amoniac khi má»™t hay nhiá»u H bá»‹ thay báº±ng gá»‘c hiÄ‘rocacbon. Amino axit vá»«a cÃ³ nhÃ³m **â€“NH2** vá»«a cÃ³ nhÃ³m **â€“COOH** trong phÃ¢n tá»­. Peptit vÃ  protein Ä‘Æ°á»£c táº¡o bá»Ÿi cÃ¡c gá»‘c amino axit liÃªn káº¿t vá»›i nhau qua **liÃªn káº¿t peptit**.',
    suggestions: ['Axit bazÆ¡', 'NhÃ³m chá»©c']
  },
  {
    id: 'polymer',
    category: 'Há»¯u cÆ¡',
    patterns: ['polime', 'polymer', 'trÃ¹ng há»£p', 'trÃ¹ng ngÆ°ng'],
    title: 'Polime',
    explanation:
      'Polime lÃ  há»£p cháº¥t cÃ³ phÃ¢n tá»­ khá»‘i ráº¥t lá»›n do nhiá»u máº¯t xÃ­ch liÃªn káº¿t vá»›i nhau táº¡o thÃ nh. CÃ³ hai hÆ°á»›ng táº¡o polime thÆ°á»ng gáº·p lÃ  **trÃ¹ng há»£p** vÃ  **trÃ¹ng ngÆ°ng**. Nhiá»u váº­t liá»‡u quen thuá»™c nhÆ° PE, PVC, nilon Ä‘á»u lÃ  polime.',
    suggestions: ['Anken', 'Váº­t liá»‡u polime']
  },
  {
    id: 'lab-safety',
    category: 'An toÃ n',
    patterns: ['an toÃ n phÃ²ng thÃ­ nghiá»‡m', 'lab safety', 'quy táº¯c an toÃ n hÃ³a há»c'],
    title: 'NguyÃªn táº¯c an toÃ n trong phÃ²ng thÃ­ nghiá»‡m hÃ³a há»c',
    explanation:
      'LuÃ´n Ä‘eo kÃ­nh, gÄƒng tay vÃ  Ã¡o choÃ ng phÃ¹ há»£p; Ä‘á»c nhÃ£n hÃ³a cháº¥t trÆ°á»›c khi dÃ¹ng; khÃ´ng náº¿m hay ngá»­i trá»±c tiáº¿p hÃ³a cháº¥t; thÃªm axit vÃ o nÆ°á»›c khi pha loÃ£ng, khÃ´ng lÃ m ngÆ°á»£c láº¡i; dÃ¹ng tá»§ hÃºt vá»›i cháº¥t bay hÆ¡i Ä‘á»™c; thu gom cháº¥t tháº£i Ä‘Ãºng quy Ä‘á»‹nh; vÃ  xá»­ lÃ½ sá»± cá»‘ theo quy trÃ¬nh an toÃ n cá»§a phÃ²ng thÃ­ nghiá»‡m.',
    suggestions: ['KÃ­ hiá»‡u cáº£nh bÃ¡o hÃ³a cháº¥t', 'Xá»­ lÃ½ trÃ n Ä‘á»• hÃ³a cháº¥t']
  },
  {
    id: 'hazard-symbols',
    category: 'An toÃ n',
    patterns: ['kÃ½ hiá»‡u cáº£nh bÃ¡o hÃ³a cháº¥t', 'ghs', 'hazard symbols'],
    title: 'Má»™t sá»‘ nhÃ³m cáº£nh bÃ¡o hÃ³a cháº¥t thÆ°á»ng gáº·p',
    explanation:
      'CÃ¡c cáº£nh bÃ¡o thÆ°á»ng gáº·p gá»“m: **dá»… chÃ¡y**, **Äƒn mÃ²n**, **Ä‘á»™c cáº¥p tÃ­nh**, **gÃ¢y kÃ­ch á»©ng**, **oxi hÃ³a máº¡nh**, **nguy háº¡i mÃ´i trÆ°á»ng**. Khi xÃ¢y dá»±ng á»©ng dá»¥ng giÃ¡o dá»¥c, nÃªn gáº¯n biá»ƒu tÆ°á»£ng nguy cÆ¡ vÃ  hÆ°á»›ng dáº«n xá»­ lÃ½ an toÃ n thay vÃ¬ chá»‰ hiá»ƒn thá»‹ tÃªn cháº¥t.',
    suggestions: ['An toÃ n phÃ²ng thÃ­ nghiá»‡m']
  }
];

export const CHEMISTRY_CURRICULUM = [
  {
    id: 'chemistry-map',
    patterns: ['báº£n Ä‘á»“ kiáº¿n thá»©c', 'báº£n Ä‘á»“ hÃ³a há»c', 'sÆ¡ Ä‘á»“ hÃ³a há»c', 'toÃ n bá»™ hÃ³a há»c', 'tá»•ng quan hÃ³a há»c', 'knowledge map'],
    title: 'Báº£n Ä‘á»“ kiáº¿n thá»©c hÃ³a há»c cá»‘t lÃµi',
    explanation:
      'ChÃ o má»«ng báº¡n Ä‘áº¿n vá»›i **Báº£n Ä‘á»“ Kiáº¿n thá»©c Aurum**. ÄÃ¢y lÃ  nÆ¡i há»™i tá»¥ táº¥t cáº£ cÃ¡c máº£ng kiáº¿n thá»©c tá»« **Ä‘áº¡i cÆ°Æ¡ng nguyÃªn tá»­ â€“ báº£ng tuáº§n hoÃ n**, **liÃªn káº¿t hÃ³a há»c** Ä‘áº¿n **hÃ³a há»c há»¯u cÆ¡** vÃ  **an toÃ n phÃ²ng thÃ­ nghiá»‡m**. Nháº¥n nÃºt bÃªn dÆ°á»›i Ä‘á»ƒ má»Ÿ báº£n Ä‘á»“ tÆ°Æ¡ng tÃ¡c vÃ  khÃ¡m phÃ¡ chiá»u sÃ¢u cá»§a hÃ³a há»c!',
    suggestions: ['KhÃ¡m phÃ¡ báº£n Ä‘á»“', 'Äáº¡i cÆ°Æ¡ng', 'Há»¯u cÆ¡', 'An toÃ n']
  }
];

export const FLAT_KNOWLEDGE_BASE = [...CHEMISTRY_KNOWLEDGE_BASE, ...CHEMISTRY_CURRICULUM];

