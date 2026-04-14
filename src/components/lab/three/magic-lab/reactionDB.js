// Danh mục các hóa chất cơ bản để người dùng chọn
export const CHEMICALS = {
  // --- Các hợp chất phổ biến (Compounds) ---
  H2O: { formula: 'H2O', name: 'Nước', state: 'liquid', color: '#ffffff', opacity: 0.2 },
  HCl: { formula: 'HCl', name: 'Axit Clohidric', state: 'liquid', color: '#e8e8ff', opacity: 0.3 },
  NaOH: { formula: 'NaOH', name: 'Natri Hidroxit', state: 'liquid', color: '#ffffff', opacity: 0.2 },
  H2SO4: { formula: 'H2SO4', name: 'Axit Sunfuric', state: 'liquid', color: '#ffffff', opacity: 0.2 },
  HNO3: { formula: 'HNO3', name: 'Axit Nitric', state: 'liquid', color: '#ffffff', opacity: 0.2 },
  H3PO4: { formula: 'H3PO4', name: 'Axit Photphoric', state: 'liquid', color: '#ffffff', opacity: 0.2 },
  CH3COOH: { formula: 'CH3COOH', name: 'Axit Axetic', state: 'liquid', color: '#ffffff', opacity: 0.2 },
  CuSO4: { formula: 'CuSO4', name: 'Đồng(II) Sunfat', state: 'liquid', color: '#2e81ff', opacity: 0.8 },
  AgNO3: { formula: 'AgNO3', name: 'Bạc Nitrat', state: 'liquid', color: '#ffffff', opacity: 0.2 },
  BaCl2: { formula: 'BaCl2', name: 'Bari Clorua', state: 'liquid', color: '#ffffff', opacity: 0.2 },
  Na2SO4: { formula: 'Na2SO4', name: 'Natri Sunfat', state: 'liquid', color: '#ffffff', opacity: 0.2 },
  KI: { formula: 'KI', name: 'Kali Iodua', state: 'liquid', color: '#ffffff', opacity: 0.2 },
  PbNO32: { formula: 'Pb(NO3)2', name: 'Chì(II) Nitrat', state: 'liquid', color: '#ffffff', opacity: 0.2 },
  K2CrO4: { formula: 'K2CrO4', name: 'Kali Cromat', state: 'liquid', color: '#ffff00', opacity: 0.8 }, // Vàng
  K2Cr2O7: { formula: 'K2Cr2O7', name: 'Kali Dicromat', state: 'liquid', color: '#ff8c00', opacity: 0.8 }, // Cam
  NaHCO3: { formula: 'NaHCO3', name: 'Natri Bicacbonat', state: 'solid', color: '#ffffff' },
  CaCO3: { formula: 'CaCO3', name: 'Canxi Cacbonat', state: 'solid', color: '#ffffff' },
  CaOH2: { formula: 'Ca(OH)2', name: 'Canxi Hidroxit (vôi tôi)', state: 'liquid', color: '#f8f8f8', opacity: 0.4 },
  NH3: { formula: 'NH3', name: 'Amoniac', state: 'liquid', color: '#ffffff', opacity: 0.2 },
  H2O2: { formula: 'H2O2', name: 'Hidro Peroxit', state: 'liquid', color: '#ffffff', opacity: 0.2 },
  Phenol: { formula: 'Phenolphthalein', name: 'Chỉ thị Phenol', state: 'liquid', color: '#ffffff', opacity: 0.2 },
  KMnO4: { formula: 'KMnO4', name: 'Kali Pemanganat', state: 'liquid', color: '#800080', opacity: 0.9 },
  Glycerin: { formula: 'Glycerin', name: 'Glycerin', state: 'liquid', color: '#ffffff', opacity: 0.1 },

  // --- Sản phẩm phản ứng (để render) ---
  NaCl: { formula: 'NaCl', name: 'Muối ăn', state: 'liquid', color: '#ffffff', opacity: 0.1 },
  FeCl2: { formula: 'FeCl2', name: 'Sắt(II) Clorua', state: 'liquid', color: '#a8c686', opacity: 0.6 },
  ZnCl2: { formula: 'ZnCl2', name: 'Kẽm Clorua', state: 'liquid', color: '#f0f0f0', opacity: 0.3 },
  FeSO4: { formula: 'FeSO4', name: 'Sắt(II) Sunfat', state: 'liquid', color: '#a3d9a5', opacity: 0.6 },
  NaOH_Pink: { formula: 'NaOH_Pink', name: 'Base + Phenol (hồng)', state: 'liquid', color: '#ff007f', opacity: 0.7 },
  KOH: { formula: 'KOH', name: 'Kali Hidroxit', state: 'liquid', color: '#ffffff', opacity: 0.2},
  CaSO4: { formula: 'CaSO4', name: 'Canxi Sunfat', state: 'solid', color: '#f5f5f5'},
  BaSO4: { formula: 'BaSO4', name: 'Bari Sunfat', state: 'solid', color: '#ffffff'},
  AgCl: { formula: 'AgCl', name: 'Bạc Clorua', state: 'solid', color: '#ffffff'},
  AgI: { formula: 'AgI', name: 'Bạc Iodua', state: 'solid', color: '#ffffd4'},
  PbI2: { formula: 'PbI2', name: 'Chì(II) Iodua', state: 'solid', color: '#ffd700'}, // Vàng kim (mưa vàng)
  CuOH2: { formula: 'CuOH2', name: 'Đồng(II) Hidroxit', state: 'solid', color: '#00ffff'}, // Xanh lơ
  MgCl2: { formula: 'MgCl2', name: 'Magie Clorua', state: 'liquid', color: '#ffffff', opacity: 0.2},
  AlCl3: { formula: 'AlCl3', name: 'Nhôm Clorua', state: 'liquid', color: '#ffffee', opacity: 0.2},
  CuCl2: { formula: 'CuCl2', name: 'Đồng(II) Clorua', state: 'liquid', color: '#2e8b57', opacity: 0.7},
  CuNO32: { formula: 'Cu(NO3)2', name: 'Đồng(II) Nitrat', state: 'liquid', color: '#2e81ff', opacity: 0.8},
  NH4Cl: { formula: 'NH4Cl', name: 'Amoni Clorua (khói)', state: 'gas', color: '#ffffff', opacity: 0.1},
  RbOH: { formula: 'RbOH', name: 'Rubidi Hidroxit', state: 'liquid', color: '#ffffff', opacity: 0.2 },
  CsOH: { formula: 'CsOH', name: 'Xesi Hidroxit', state: 'liquid', color: '#ffffff', opacity: 0.2 },

  // --- Các nguyên tố Bảng tuần hoàn (Elements) ---
  H: { formula: 'H', name: 'Hydro', state: 'gas', color: '#ffffff', opacity: 0.1, type: 'nonmetal' },
  Li: { formula: 'Li', name: 'Liti', state: 'solid', color: '#d3d3d3', type: 'metal' },
  Be: { formula: 'Be', name: 'Beryli', state: 'solid', color: '#cccccc', type: 'metal' },
  B: { formula: 'B', name: 'Bo', state: 'solid', color: '#555555', type: 'nonmetal' },
  C: { formula: 'C', name: 'Carbon', state: 'solid', color: '#222222', type: 'nonmetal' },
  N: { formula: 'N', name: 'Nitơ', state: 'gas', color: '#ffffff', opacity: 0.1, type: 'nonmetal' },
  O: { formula: 'O', name: 'Oxy', state: 'gas', color: '#ffffff', opacity: 0.1, type: 'nonmetal' },
  F: { formula: 'F', name: 'Fluor', state: 'gas', color: '#ffffcc', opacity: 0.3, type: 'nonmetal' },
  Na: { formula: 'Na', name: 'Natri', state: 'solid', color: '#aaaaaa', type: 'metal' },
  Mg: { formula: 'Mg', name: 'Magie', state: 'solid', color: '#e0e0e0', type: 'metal' },
  Al: { formula: 'Al', name: 'Nhôm', state: 'solid', color: '#d9d9d9', type: 'metal' },
  Si: { formula: 'Si', name: 'Silic', state: 'solid', color: '#7a8b8b', type: 'nonmetal' },
  P: { formula: 'P', name: 'Phospho (trắng)', state: 'solid', color: '#ffffdd', type: 'nonmetal' },
  S: { formula: 'S', name: 'Lưu huỳnh', state: 'solid', color: '#ffff00', type: 'nonmetal' },
  Cl: { formula: 'Cl', name: 'Clo', state: 'gas', color: '#ccffcc', opacity: 0.4, type: 'nonmetal' },
  K: { formula: 'K', name: 'Kali', state: 'solid', color: '#888888', type: 'metal' },
  Ca: { formula: 'Ca', name: 'Canxi', state: 'solid', color: '#cecece', type: 'metal' },
  Sc: { formula: 'Sc', name: 'Scandi', state: 'solid', color: '#e6e6e6', type: 'metal' },
  Ti: { formula: 'Ti', name: 'Titan', state: 'solid', color: '#c0c0c0', type: 'metal' },
  V: { formula: 'V', name: 'Vanadi', state: 'solid', color: '#aba8a8', type: 'metal' },
  Cr: { formula: 'Cr', name: 'Crom', state: 'solid', color: '#dbdbdb', type: 'metal' },
  Mn: { formula: 'Mn', name: 'Mangan', state: 'solid', color: '#c4c3cd', type: 'metal' },
  Fe: { formula: 'Fe', name: 'Sắt', state: 'solid', color: '#555555', type: 'metal' },
  Co: { formula: 'Co', name: 'Coban', state: 'solid', color: '#8a929b', type: 'metal' },
  Ni: { formula: 'Ni', name: 'Niken', state: 'solid', color: '#bdc1c6', type: 'metal' },
  Cu: { formula: 'Cu', name: 'Đồng', state: 'solid', color: '#b87333', type: 'metal' },
  Zn: { formula: 'Zn', name: 'Kẽm', state: 'solid', color: '#bac4c8', type: 'metal' },
  Rb: { formula: 'Rb', name: 'Rubidi', state: 'solid', color: '#cccccc', type: 'metal' },
  Sr: { formula: 'Sr', name: 'Stronti', state: 'solid', color: '#dddddd', type: 'metal' },
  Y: { formula: 'Y', name: 'Ytri', state: 'solid', color: '#d8d8d8', type: 'metal' },
  Zr: { formula: 'Zr', name: 'Ziconi', state: 'solid', color: '#e0e0e0', type: 'metal' },
  Nb: { formula: 'Nb', name: 'Niobi', state: 'solid', color: '#e6e6e6', type: 'metal' },
  Mo: { formula: 'Mo', name: 'Molypden', state: 'solid', color: '#cccccc', type: 'metal' },
  Ag: { formula: 'Ag', name: 'Bạc', state: 'solid', color: '#e3e4e5', type: 'metal' },
  Cd: { formula: 'Cd', name: 'Cadimi', state: 'solid', color: '#b6b9bd', type: 'metal' },
  Sn: { formula: 'Sn', name: 'Thiếc', state: 'solid', color: '#c9cacb', type: 'metal' },
  Sb: { formula: 'Sb', name: 'Antimon', state: 'solid', color: '#b6b6b6', type: 'metal' },
  Te: { formula: 'Te', name: 'Telu', state: 'solid', color: '#d4d4d4', type: 'nonmetal' },
  I: { formula: 'I', name: 'Iod', state: 'solid', color: '#4a2c59', type: 'nonmetal' },
  Cs: { formula: 'Cs', name: 'Xesi', state: 'solid', color: '#d9d9d9', type: 'metal' },
  Ba: { formula: 'Ba', name: 'Bari', state: 'solid', color: '#e2e2e2', type: 'metal' },
  Pt: { formula: 'Pt', name: 'Bạch kim', state: 'solid', color: '#e5e4e2', type: 'metal' },
  Au: { formula: 'Au', name: 'Vàng', state: 'solid', color: '#ffd700', type: 'metal' },
  Hg: { formula: 'Hg', name: 'Thủy ngân', state: 'liquid', color: '#b8b8b8', opacity: 1, type: 'metal' },
  Pb: { formula: 'Pb', name: 'Chì', state: 'solid', color: '#888888', type: 'metal' },
  Bi: { formula: 'Bi', name: 'Bitmut', state: 'solid', color: '#d4c9c9', type: 'metal' },
  Sugar: { formula: 'C12H22O11', name: 'Đường (Saccarozơ)', state: 'solid', color: '#ffffff' },
  Ethanol: { formula: 'C2H5OH', name: 'Rượu Ethanol', state: 'liquid', color: '#ffffff', opacity: 0.1 },
  Fe2O3: { formula: 'Fe2O3', name: 'Sắt(III) Oxit (Rỉ sắt)', state: 'solid', color: '#8b4513' },
  MnO2: { formula: 'MnO2', name: 'Mangan Dioxit', state: 'solid', color: '#333333' },
  K2CO3: { formula: 'K2CO3', name: 'Kali Cacbonat', state: 'solid', color: '#f0f0f0' },
  Mn2O3: { formula: 'Mn2O3', name: 'Mangan(III) Oxit', state: 'solid', color: '#222222' }
};

// Từ điển các phản ứng
// requiresHeat: true => chỉ xảy ra khi bật lửa
export const REACTIONS = [
  {
    // Na + H2O -> NaOH + H2 (tỏa nhiệt mạnh)
    reactants: ['H2O', 'Na'],
    products: ['NaOH'],
    requiresHeat: false,
    effects: {
      type: 'explosion',
      intensity: 'high',
      gas: 'H₂',
      colorChange: '#ffffff',
      smoke: 'white'
    },
    message: "💥 2Na + 2H₂O → 2NaOH + H₂↑ — Phản ứng tỏa nhiệt mạnh, khí H₂ thoát ra!"
  },
  {
    // K + H2O -> KOH + H2 (tỏa nhiệt rất mạnh)
    reactants: ['H2O', 'K'],
    products: ['KOH'],
    requiresHeat: false,
    effects: {
      type: 'explosion',
      intensity: 'very_high',
      gas: 'H₂',
      colorChange: '#ffffff',
      smoke: 'white'
    },
    message: "💥 2K + 2H₂O → 2KOH + H₂↑ — Phản ứng cực mạnh, lửa tím bốc lên!"
  },
  {
    // Rb + H2O -> RbOH + H2 (Tương tác nổ cực mạnh)
    reactants: ['H2O', 'Rb'],
    products: ['RbOH'],
    requiresHeat: false,
    effects: {
      type: 'explosion',
      intensity: 'extreme',
      gas: 'H₂',
      colorChange: '#ffffff',
      smoke: 'white'
    },
    message: "💣 Rb + H₂O → RbOH + H₂↑ — NỔ CỰC MẠNH! Rubidi phản ứng dữ dội with nước."
  },
  {
    // Cs + H2O -> CsOH + H2 (Phá hủy cốc)
    reactants: ['H2O', 'Cs'],
    products: ['CsOH'],
    requiresHeat: false,
    effects: {
      type: 'explosion',
      intensity: 'shatter',
      gas: 'H₂',
      colorChange: '#ffffff',
      smoke: 'grey'
    },
    message: "☢️ Cs + H₂O → CsOH + H₂↑ — KINH HOÀNG! Xesi phá hủy mọi thứ!"
  },
  {
    // 14KMnO4 + 4Glycerin -> 7K2CO3 + 7Mn2O3 + 5CO2 + 16H2O
    reactants: ['KMnO4', 'Glycerin'],
    products: ['K2CO3', 'Mn2O3'],
    requiresHeat: false,
    effects: {
      type: 'fire',
      intensity: 'extreme',
      smoke: 'purple',
      colorChange: '#222222',
      gas: 'CO₂'
    },
    message: "🔥 14KMnO₄ + 4C₃H₅(OH)₃ → 7K₂CO₃ + 7Mn₂O₃ + 5CO₂↑ + 16H₂O — Phản ứng tự bốc cháy cực mạnh with khói tím và lửa sáng chói!"
  },
  {
    // P (white) + O2 (Heat) -> P2O5 (Khói trắng dày đặc)
    reactants: ['P'],
    products: ['P'],
    requiresHeat: true,
    effects: {
      type: 'smoke_only',
      intensity: 'high',
      smoke: 'white',
      colorChange: '#ffffff'
    },
    message: "🚬 P (trắng) + O₂ — Phốt pho trắng bốc khói trắng dày đặc khi đun nóng."
  },
  {
    // Pb(NO3)2 + KI -> PbI2 + KNO3 (Mưa vàng)
    reactants: ['PbNO32', 'KI'],
    products: ['PbI2'],
    requiresHeat: false,
    effects: {
      type: 'precipitate',
      precipitateColor: '#ffd700',
      colorChange: '#ffffe0'
    },
    message: "✨ Pb(NO₃)₂ + 2KI → PbI₂↓ + 2KNO₃ — Kết tủa vàng lấp lánh (Mưa vàng)!"
  },
  {
    // AgNO3 + HCl -> AgCl + HNO3
    reactants: ['AgNO3', 'HCl'],
    products: ['AgCl'],
    requiresHeat: false,
    effects: {
      type: 'precipitate',
      precipitateColor: '#ffffff'
    },
    message: "⬜ AgNO₃ + HCl → AgCl↓ + HNO₃ — Kết tủa trắng vón cục."
  },
  {
    // AgNO3 + KI -> AgI + KNO3
    reactants: ['AgNO3', 'KI'],
    products: ['AgI'],
    requiresHeat: false,
    effects: {
      type: 'precipitate',
      precipitateColor: '#ffffd4'
    },
    message: "🟡 AgNO₃ + KI → AgI↓ + KNO₃ — Kết tủa vàng nhạt."
  },
  {
    // NaHCO3 + HCl -> NaCl + CO2 + H2O
    reactants: ['NaHCO3', 'HCl'],
    products: ['NaCl'],
    requiresHeat: false,
    effects: {
      type: 'dissolve',
      gas: 'CO₂',
      smoke: 'white'
    },
    message: "🫧 NaHCO₃ + HCl → NaCl + H₂O + CO₂↑ — Sủi bọt khí mạnh!"
  },
  {
    // CaCO3 + HCl -> CaCl2 + CO2 + H2O
    reactants: ['CaCO3', 'HCl'],
    products: ['NaCl'], // CaCl2 fallback
    requiresHeat: false,
    effects: {
      type: 'dissolve',
      gas: 'CO₂'
    },
    message: "🫧 CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑ — Đá vôi tan sủi bọt khí."
  },
  {
    // K2CrO4 + H2SO4 -> K2Cr2O7 (Vàng sang Cam)
    reactants: ['K2CrO4', 'H2SO4'],
    products: ['K2Cr2O7'],
    requiresHeat: false,
    effects: {
      type: 'color_shift',
      colorChange: '#ff8c00'
    },
    message: "🟠 2K₂CrO₄ + H₂SO₄ → K₂Cr₂O₇ + K₂SO₄ + H₂O — Chuyển từ Vàng sang Cam."
  },
  {
    // K2Cr2O7 + NaOH -> K2CrO4 (Cam sang Vàng)
    reactants: ['K2Cr2O7', 'NaOH'],
    products: ['K2CrO4'],
    requiresHeat: false,
    effects: {
      type: 'color_shift',
      colorChange: '#ffff00'
    },
    message: "🟡 K₂Cr₂O₇ + 2NaOH → 2K₂CrO₄ + H₂O + Na₂SO₄ — Chuyển từ Cam sang Vàng."
  },
  {
    // Cu + HNO3 -> Cu(NO3)2 + NO2 (Khí nâu)
    reactants: ['Cu', 'HNO3'],
    products: ['CuNO32'],
    requiresHeat: true,
    effects: {
      type: 'dissolve',
      smoke: 'brown',
      intensity: 'high',
      colorChange: '#2e81ff'
    },
    message: "🟫 Cu + 4HNO₃ → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O — Đun nóng tạo khí NO₂ màu nâu độc hại!"
  },
  {
    // CuSO4 + NaOH -> Cu(OH)2 (Kết tủa xanh)
    reactants: ['CuSO4', 'NaOH'],
    products: ['CuOH2'],
    requiresHeat: false,
    effects: {
      type: 'precipitate',
      precipitateColor: '#00ffff'
    },
    message: "🟦 CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄ — Kết tủa xanh lơ đặc trưng."
  },
  {
    // H2O2 + Mn (MnO2) -> O2 + H2O
    reactants: ['H2O2', 'Mn'],
    products: ['H2O'],
    requiresHeat: false,
    effects: {
      type: 'dissolve',
      gas: 'O₂',
      intensity: 'high'
    },
    message: "⚡ 2H₂O₂ —(MnO₂)→ 2H₂O + O₂↑ — Phân hủy Peroxit sủi bọt oxy cực mạnh!"
  },
  {
    // Al + NaOH -> NaAlO2 + H2
    reactants: ['Al', 'NaOH'],
    products: ['NaOH'], // NaAlO2 fallback
    requiresHeat: false,
    effects: {
      type: 'dissolve',
      gas: 'H₂',
      intensity: 'high'
    },
    message: "🫧 2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂↑ — Nhôm tan trong kiềm giải phóng Hydro."
  },
  {
    // HCl + NaOH -> NaCl + H2O
    reactants: ['HCl', 'NaOH'],
    products: ['NaCl', 'H2O'],
    requiresHeat: false,
    effects: {
      type: 'neutralize',
      colorChange: '#ffffff'
    },
    message: "⚗️ HCl + NaOH → NaCl + H₂O — Trung hòa axit-base"
  },
  {
    // Phenolphthalein + NaOH -> Màu hồng
    reactants: ['NaOH', 'Phenol'],
    products: ['NaOH_Pink'],
    requiresHeat: false,
    effects: {
      type: 'color_shift',
      colorChange: '#ff007f'
    },
    message: "🩷 Môi trường Base làm Phenolphthalein hóa hồng"
  },
  {
    // NaOH_Pink + HCl -> Mất màu
    reactants: ['HCl', 'NaOH_Pink'],
    products: ['NaCl', 'H2O'],
    requiresHeat: false,
    effects: {
      type: 'color_shift',
      colorChange: '#ffffff'
    },
    message: "⚪ Trung hòa NaOH → mất màu hồng Phenolphthalein"
  },
  {
    // Fe + CuSO4 -> FeSO4 + Cu
    reactants: ['CuSO4', 'Fe'],
    products: ['FeSO4'],
    requiresHeat: false,
    effects: {
      type: 'precipitate',
      colorChange: '#a3d9a5',
      precipitateColor: '#b8421c'
    },
    message: "🔶 Fe + CuSO₄ → FeSO₄ + Cu↓ — Đồng đỏ bám trên sắt"
  },
  {
    // BaCl2 + Na2SO4 -> BaSO4 (trắng) + NaCl
    reactants: ['BaCl2', 'Na2SO4'],
    products: ['NaCl'],
    requiresHeat: false,
    effects: {
      type: 'precipitate',
      colorChange: '#ffffff',
      precipitateColor: '#eeeeee',
      opacity: 1
    },
    message: "⬜ BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl — Kết tủa trắng"
  },
  {
    // Fe + HCl -> FeCl2 + H2 (cần nhiệt)
    reactants: ['Fe', 'HCl'],
    products: ['FeCl2'],
    requiresHeat: true,
    effects: {
      type: 'dissolve',
      gas: 'H₂',
      colorChange: '#a8c686',
      smoke: 'white'
    },
    message: "🔥 Fe + 2HCl → FeCl₂ + H₂↑ — Sắt tan in axit, sủi bọt khí"
  },
  {
    // Zn + HCl -> ZnCl2 + H2 (cần nhiệt)
    reactants: ['HCl', 'Zn'],
    products: ['ZnCl2'],
    requiresHeat: true,
    effects: {
      type: 'dissolve',
      gas: 'H₂',
      colorChange: '#f0f0f0'
    },
    message: "🔥 Zn + 2HCl → ZnCl₂ + H₂↑ — Kẽm tan, sủi bọt mạnh"
  },
  {
    // CH3COOH + NaHCO3 -> CH3COONa + CO2 + H2O (Giấm + Muối nở)
    reactants: ['CH3COOH', 'NaHCO3'],
    products: ['NaCl'], // Na-acetate fallback
    requiresHeat: false,
    effects: {
      type: 'dissolve',
      gas: 'CO₂',
      intensity: 'high'
    },
    message: "🫧 CH3COOH + NaHCO₃ → CH3COONa + H₂O + CO₂↑ — Phản ứng sủi bọt khí cực mạnh giữa giấm và muối nở!"
  },
  {
    // Al + I (solid) + H2O drop -> AlI3 + purple smoke
    reactants: ['Al', 'I', 'H2O'],
    products: ['AlCl3'], // AlI3 fallback
    requiresHeat: false,
    effects: {
      type: 'fire',
      smoke: 'purple',
      intensity: 'extreme'
    },
    message: "🟣 2Al + 3I₂ —(H₂O)→ 2AlI₃ — Phản ứng tỏa nhiệt cực mạnh sinh khói tím mịt mù!"
  },
  {
    // Mg + O2 (Heat) -> MgO
    reactants: ['Mg'],
    products: ['CaCO3'], // MgO fallback
    requiresHeat: true,
    effects: {
      type: 'fire',
      intensity: 'extreme',
      smoke: 'white'
    },
    message: "🌟 2Mg + O₂ → 2MgO — Magie cháy sáng chói lòa in không khí!"
  },
  {
    // Sugar + H2SO4 -> C + H2O (Carbon Snake)
    reactants: ['Sugar', 'H2SO4'],
    products: ['C'], 
    requiresHeat: false,
    effects: {
      type: 'smoke_only',
      smoke: 'grey',
      intensity: 'extreme'
    },
    message: "🐍 C₁₂H₂₂O₁₁ + H₂SO₄ — Phản ứng háo nước cực mạnh! H2SO4 rút nước từ đường tạo thành cột than xốp bốc khói dữ dội."
  },
  {
    // Al + Fe2O3 -> Al2O3 + Fe (Thermite)
    reactants: ['Al', 'Fe2O3'],
    products: ['Fe'],
    requiresHeat: true,
    effects: {
      type: 'fire',
      intensity: 'extreme',
      smoke: 'white'
    },
    message: "💥 2Al + Fe₂O₃ —(Heat)→ Al₂O₃ + 2Fe — Phản ứng Nhiệt nhôm tỏa nhiệt kinh khủng, sắt nóng chảy ngàn độ!"
  },
  {
    // Ethanol + Heat -> Burning
    reactants: ['Ethanol'],
    products: ['H2O'],
    requiresHeat: true,
    effects: {
      type: 'fire',
      intensity: 'high',
      smoke: 'white'
    },
    message: "🔥 C₂H₅OH + 3O₂ —(Heat)→ 2CO₂ + 3H₂O — Rượu cháy rực rỡ with ngọn lửa xanh mờ."
  },
  {
    // KMnO4 + HCl -> Cl2
    reactants: ['KMnO4', 'HCl'],
    products: ['MgCl2'], // Cl2 fallback
    requiresHeat: false,
    effects: {
      type: 'dissolve',
      gas: 'Cl₂',
      smoke: 'white'
    },
    message: "🧪 2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂↑ + 8H₂O — Giải phóng khí Clo màu vàng xanh độc hại!"
  },
  {
    // NH3 + HCl -> NH4Cl (Khói trắng)
    reactants: ['NH3', 'HCl'],
    products: ['NH4Cl'],
    requiresHeat: false,
    effects: {
      type: 'smoke_only',
      smoke: 'white',
      intensity: 'high'
    },
    message: "☁️ NH₃ (khí) + HCl (khí) → NH₄Cl (rắn) — Tạo khói trắng dày đặc!"
  },
  // --- Các phản ứng Bay hơi / Sôi (Boiling/Volatilization) ---
  {
    reactants: ['H2O'],
    products: ['H2O'],
    requiresHeat: true,
    preserveReactants: true,
    effects: {
      type: 'smoke_only',
      smoke: 'white',
      intensity: 'low'
    },
    message: "💧 Nước đang sôi và bay hơi..."
  },
  {
    reactants: ['NH3'],
    products: ['NH3'],
    requiresHeat: true,
    preserveReactants: true,
    effects: {
      type: 'smoke_only',
      smoke: 'white',
      intensity: 'medium'
    },
    message: "💨 Amoniac đang bay hơi mạnh (mùi khai đặc trưng)!"
  },
  {
    reactants: ['HCl'],
    products: ['HCl'],
    requiresHeat: true,
    preserveReactants: true,
    effects: {
      type: 'smoke_only',
      smoke: 'white',
      intensity: 'medium'
    },
    message: "💨 Axit Clohidric đang bốc khói (hiện tượng bốc khói in không khí ẩm)!"
  },
  {
    reactants: ['HNO3'],
    products: ['HNO3'],
    requiresHeat: true,
    preserveReactants: true,
    effects: {
      type: 'smoke_only',
      smoke: 'white',
      intensity: 'medium'
    },
    message: "💨 Axit Nitric đang bốc khói và bị phân hủy nhẹ!"
  },
  {
    // H2O2 + MnO2 -> H2O + O2 (MnO2 là xúc tác)
    reactants: ['H2O2', 'MnO2'],
    products: ['H2O'],
    requiresHeat: false,
    effects: {
      type: 'smoke_only',
      intensity: 'extreme',
      gas: 'O₂',
      smoke: 'white'
    },
    message: "⚡ 2H₂O₂ —(MnO₂ xúc tác)→ 2H₂O + O₂ — Phân hủy Hydro Peroxit cực nhanh, bốc khói và sủi bọt oxy dữ dội!"
  },
  {
    // MnO2 + HCl -> Cl2 (Cần nhiệt)
    reactants: ['MnO2', 'HCl'],
    products: ['MgCl2'], // Cl2 fallback
    requiresHeat: true,
    effects: {
      type: 'dissolve',
      intensity: 'high',
      gas: 'Cl₂',
      smoke: 'white'
    },
    message: "🧪 MnO₂ + 4HCl —(Heat)→ MnCl₂ + Cl₂↑ + 2H₂O — Giải phóng khí Clo màu vàng xanh độc hại!"
  },
  {
    // H2SO4 + NaOH -> Na2SO4 + H2O
    reactants: ['H2SO4', 'NaOH'],
    products: ['NaCl'], // Na2SO4 fallback
    requiresHeat: false,
    effects: {
      type: 'neutralize',
      intensity: 'medium'
    },
    message: "⚗️ H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O — Phản ứng trung hòa tạo muối và nước."
  },
  {
    // Al + H2SO4 -> Al2(SO4)3 + H2
    reactants: ['Al', 'H2SO4'],
    products: ['AlCl3'], // Al-sulfate fallback
    requiresHeat: true,
    effects: {
      type: 'dissolve',
      intensity: 'high',
      gas: 'H₂'
    },
    message: "🫧 2Al + 3H₂SO₄ → Al₂(SO₄)₃ + 3H₂↑ — Nhôm tan in axit sunfuric loãng giải phóng khí Hydro."
  },
  {
    // C + O2 -> CO2 (Heat)
    reactants: ['C'],
    products: ['C'], 
    requiresHeat: true,
    effects: {
      type: 'fire',
      intensity: 'low',
      smoke: 'white'
    },
    message: "🔥 C + O₂ —(Heat)→ CO₂ — Cacbon cháy in không khí tạo khí cacbonic."
  },
  {
    // S + O2 -> SO2 (Heat)
    reactants: ['S'],
    products: ['S'],
    requiresHeat: true,
    effects: {
      type: 'fire',
      intensity: 'medium',
      smoke: 'white'
    },
    message: "🔥 S + O₂ —(Heat)→ SO₂ — Lưu huỳnh cháy with ngọn lửa xanh nhạt, mùi hắc khó chịu."
  },
  {
    // BaCl2 + H2SO4 -> BaSO4 + HCl
    reactants: ['BaCl2', 'H2SO4'],
    products: ['BaSO4'],
    requiresHeat: false,
    effects: {
      type: 'precipitate',
      precipitateColor: '#ffffff'
    },
    message: "⬜ BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl — Kết tủa trắng Bari Sunfat bền vững không tan in axit."
  }
];

/**
 * Tìm phản ứng phù hợp
 * @param {Array} currentItems - Chất hiện có trong cốc
 * @param {boolean} isHeating - Cốc đang được đun nóng?
 */
export const getReaction = (currentItems, isHeating = false) => {
  // formulas ở đây thực chất là mảng các key (Id) của chất
  const currentKeys = currentItems.map(item => item.key || item.formula).sort();

  for (let rx of REACTIONS) {
    // Kiểm tra reactants có đủ không (so sánh theo key)
    const isMatch = rx.reactants.every(req => currentKeys.includes(req));
    if (!isMatch) continue;

    // Nếu phản ứng cần nhiệt mà chưa bật lửa => bỏ qua
    if (rx.requiresHeat && !isHeating) continue;

    return rx;
  }
  return null;
};

/**
 * Tìm các phản ứng khả thi tiếp theo dựa trên chất hiện có
 */
export const getSuggestions = (currentItems) => {
  const currentKeys = currentItems.map(item => item.key || item.formula);
  if (currentKeys.length === 0) return [{ text: "Hãy thử thêm H2O hoặc một kim loại kiềm như Na!", type: 'tip' }];

  const suggestions = [];
  
  for (let rx of REACTIONS) {
    // Tìm các phản ứng mà currentKeys là một tập con của rx.reactants
    const hasSome = rx.reactants.some(req => currentKeys.includes(req));
    const isMissingSomething = rx.reactants.some(req => !currentKeys.includes(req));
    const alreadyMatch = rx.reactants.every(req => currentKeys.includes(req));

    if (hasSome && isMissingSomething && !alreadyMatch) {
      const missing = rx.reactants.filter(req => !currentKeys.includes(req));
      const missingNames = missing.map(m => CHEMICALS[m]?.name || m).join(', ');
      suggestions.push({
        text: `Thêm ${missingNames} để thực hiện phản ứng: ${rx.message.split('—')[0]}`,
        type: 'reaction_path',
        missing: missing
      });
    }
  }

  // Nếu đang có chất mà không có phản ứng nào gợi ý tiếp, gợi ý trung hòa hoặc đun nóng
  if (suggestions.length === 0) {
    if (currentKeys.includes('NaOH') || currentKeys.includes('KOH')) {
      suggestions.push({ text: "Thử thêm HCl để trung hòa dung dịch kiềm này.", type: 'tip' });
    }
    if (currentKeys.includes('HCl') || currentKeys.includes('H2SO4')) {
      suggestions.push({ text: "Thử thêm một kim loại hoặc base để xem phản ứng.", type: 'tip' });
    }
  }

  return suggestions.slice(0, 3); // Trả về tối đa 3 gợi ý
};

/**
 * Tìm cách tạo ra một chất cụ thể
 */
export const getRecipe = (targetFormula) => {
  const recipes = [];
  
  for (let rx of REACTIONS) {
    if (rx.products.includes(targetFormula)) {
      const reactants = rx.reactants.map(r => CHEMICALS[r]?.name || r).join(' + ');
      recipes.push({
        target: CHEMICALS[targetFormula]?.name || targetFormula,
        reactants: reactants,
        conditions: rx.requiresHeat ? "Cần đun nóng" : "Điều kiện thường",
        message: rx.message
      });
    }
  }
  
  return recipes;
};

export const isChemicalAllowed = (chemKey, currentItems, isHeating = false) => {
  return true; 
};
