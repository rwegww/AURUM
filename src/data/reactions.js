// Cơ sở dữ liệu phản ứng hóa học phổ thông (Lớp 8-12)
// Mỗi phản ứng bao gồm: chất tham gia, sản phẩm, hệ số, điều kiện, loại, hiện tượng

export const reactions = [
  // === LỚP 8 ===
  {
    id: "rx_001",
    name: "Đốt cháy Hydro trong Oxy",
    reactants: [
      { formula: "H₂", coeff: 2, name: "Khí Hydro" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    type: "combination",
    conditions: "Đốt cháy",
    observation: "Ngọn lửa xanh nhạt cháy sáng. Hơi nước ngưng tụ thành giọt trên thành ống nghiệm.",
    equation: "2H₂ + O₂ → 2H₂O",
    gradeLevel: 8,
    category: "Phi kim"
  },
  {
    id: "rx_002",
    name: "Đốt cháy Sắt trong Oxy",
    reactants: [
      { formula: "Fe", coeff: 3, name: "Sắt" },
      { formula: "O₂", coeff: 2, name: "Khí Oxy" }
    ],
    products: [
      { formula: "Fe₃O₄", coeff: 1, name: "Oxit sắt từ" }
    ],
    type: "combination",
    conditions: "Đốt cháy trong bình chứa O₂",
    observation: "Sắt cháy sáng chói, tóe các tia lửa sáng. Tạo ra các hạt nóng chảy màu nâu đen.",
    equation: "3Fe + 2O₂ → Fe₃O₄",
    gradeLevel: 8,
    category: "Kim loại"
  },
  {
    id: "rx_003",
    name: "Phản ứng Kẽm với Axit Clohidric",
    reactants: [
      { formula: "Zn", coeff: 1, name: "Kẽm" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "ZnCl₂", coeff: 1, name: "Kẽm Clorua" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    type: "single-replacement",
    conditions: "Nhiệt độ thường",
    observation: "Viên kẽm tan dần. Bọt khí sủi lên mạnh (H₂). Dung dịch trong suốt.",
    equation: "Zn + 2HCl → ZnCl₂ + H₂↑",
    gradeLevel: 8,
    category: "Kim loại"
  },
  {
    id: "rx_004",
    name: "Nung đá vôi (Phân hủy CaCO₃)",
    reactants: [
      { formula: "CaCO₃", coeff: 1, name: "Canxi Cacbonat (Đá vôi)" }
    ],
    products: [
      { formula: "CaO", coeff: 1, name: "Canxi Oxit (Vôi sống)" },
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" }
    ],
    type: "decomposition",
    conditions: "Nhiệt độ cao (~900°C)",
    observation: "Đá vôi chuyển thành bite trắng bite xốp (vôi sống). Khí CO₂ thoát ra.",
    equation: "CaCO₃ →(t°) CaO + CO₂↑",
    gradeLevel: 8,
    category: "Oxit"
  },
  {
    id: "rx_005",
    name: "Natri tác dụng với nước",
    reactants: [
      { formula: "Na", coeff: 2, name: "Natri" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    products: [
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    type: "single-replacement",
    conditions: "Nhiệt độ thường",
    observation: "Natri chạy trên mặt nước, tan nhanh. Có tiếng xì xì, bốc khói. Dung dịch chuyển hồng với phenolphtalein.",
    equation: "2Na + 2H₂O → 2NaOH + H₂↑",
    gradeLevel: 8,
    category: "Kim loại kiềm"
  },
  // === LỚP 9 ===
  {
    id: "rx_006",
    name: "Trung hòa: NaOH + HCl",
    reactants: [
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" },
      { formula: "HCl", coeff: 1, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "NaCl", coeff: 1, name: "Natri Clorua (Muối ăn)" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    type: "double-replacement",
    conditions: "Nhiệt độ thường",
    observation: "Không có hiện tượng rõ rệt. Dung dịch từ kiềm chuyển trung tính (pH = 7).",
    equation: "NaOH + HCl → NaCl + H₂O",
    gradeLevel: 9,
    category: "Axit - Bazơ"
  },
  {
    id: "rx_007",
    name: "Phản ứng tạo kết tủa: BaCl₂ + Na₂SO₄",
    reactants: [
      { formula: "BaCl₂", coeff: 1, name: "Bari Clorua" },
      { formula: "Na₂SO₄", coeff: 1, name: "Natri Sunfat" }
    ],
    products: [
      { formula: "BaSO₄", coeff: 1, name: "Bari Sunfat" },
      { formula: "NaCl", coeff: 2, name: "Natri Clorua" }
    ],
    type: "double-replacement",
    conditions: "Nhiệt độ thường",
    observation: "Xuất hiện kết tủa trắng BaSO₄ không tan trong nước và axit.",
    equation: "BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl",
    gradeLevel: 9,
    category: "Muối"
  },
  {
    id: "rx_008",
    name: "Sắt + Dung dịch CuSO₄",
    reactants: [
      { formula: "Fe", coeff: 1, name: "Sắt" },
      { formula: "CuSO₄", coeff: 1, name: "Đồng Sunfat" }
    ],
    products: [
      { formula: "FeSO₄", coeff: 1, name: "Sắt (II) Sunfat" },
      { formula: "Cu", coeff: 1, name: "Đồng" }
    ],
    type: "single-replacement",
    conditions: "Nhiệt độ thường",
    observation: "Đinh sắt phủ lớp đồng đỏ. Dung dịch từ xanh lam nhạt dần.",
    equation: "Fe + CuSO₄ → FeSO₄ + Cu",
    gradeLevel: 9,
    category: "Kim loại"
  },
  // === LỚP 10 ===
  {
    id: "rx_009",
    name: "Đốt cháy Lưu huỳnh",
    reactants: [
      { formula: "S", coeff: 1, name: "Lưu huỳnh" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "SO₂", coeff: 1, name: "Khí Lưu huỳnh Dioxit" }
    ],
    type: "combination",
    conditions: "Đốt cháy",
    observation: "Lưu huỳnh cháy với ngọn lửa xanh lam. Mùi hắc khó chịu.",
    equation: "S + O₂ → SO₂",
    gradeLevel: 10,
    category: "Phi kim"
  },
  {
    id: "rx_010",
    name: "Phản ứng giữa MnO₂ và HCl đặc",
    reactants: [
      { formula: "MnO₂", coeff: 1, name: "Mangan Dioxit" },
      { formula: "HCl", coeff: 4, name: "Axit Clohidric đặc" }
    ],
    products: [
      { formula: "MnCl₂", coeff: 1, name: "Mangan Clorua" },
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    type: "redox",
    conditions: "Đun nóng",
    observation: "Khí vàng lục (Cl₂) thoát ra, mùi hắc. Dung dịch chuyển màu.",
    equation: "MnO₂ + 4HCl(đặc) →(t°) MnCl₂ + Cl₂↑ + 2H₂O",
    gradeLevel: 10,
    category: "Halogen"
  },
  // === LỚP 11 ===
  {
    id: "rx_011",
    name: "Phản ứng cháy Metan",
    reactants: [
      { formula: "CH₄", coeff: 1, name: "Metan" },
      { formula: "O₂", coeff: 2, name: "Khí Oxy" }
    ],
    products: [
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    type: "combustion",
    conditions: "Đốt cháy",
    observation: "Ngọn lửa xanh nhạt. Hơi nước ngưng tụ. Nước vôi trong vẩn đục.",
    equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
    gradeLevel: 11,
    category: "Hữu cơ"
  },
  {
    id: "rx_012",
    name: "Etanol + Natri",
    reactants: [
      { formula: "C₂H₅OH", coeff: 2, name: "Rượu Etylic (Etanol)" },
      { formula: "Na", coeff: 2, name: "Natri" }
    ],
    products: [
      { formula: "C₂H₅ONa", coeff: 2, name: "Natri Etylat" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    type: "single-replacement",
    conditions: "Nhiệt độ thường",
    observation: "Na tan dần trong rượu. Khí H₂ sủi bọt nhẹ.",
    equation: "2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑",
    gradeLevel: 11,
    category: "Hữu cơ"
  },
  // === LỚP 12 ===
  {
    id: "rx_013",
    name: "Điện phân dung dịch NaCl",
    reactants: [
      { formula: "NaCl", coeff: 2, name: "Natri Clorua" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    products: [
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" }
    ],
    type: "electrolysis",
    conditions: "Điện phân dung dịch (có màng ngăn)",
    observation: "Khí vàng lục (Cl₂) ở anod. Khí không màu (H₂) ở catod. DD kiềm tạo thành.",
    equation: "2NaCl + 2H₂O →(đp) Cl₂↑ + H₂↑ + 2NaOH",
    gradeLevel: 12,
    category: "Điện hóa"
  },
  {
    id: "rx_014",
    name: "Thủy phân Saccarozơ",
    reactants: [
      { formula: "C₁₂H₂₂O₁₁", coeff: 1, name: "Saccarozơ (Đường)" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "C₆H₁₂O₆", coeff: 1, name: "Glucozơ" },
      { formula: "C₆H₁₂O₆", coeff: 1, name: "Fructozơ" }
    ],
    type: "hydrolysis",
    conditions: "Axit H₂SO₄ loãng, đun nóng",
    observation: "Dung dịch đường tan hoàn toàn. Sản phẩm tạo kết tủa đỏ gạch với Cu(OH)₂ khi đun nóng.",
    equation: "C₁₂H₂₂O₁₁ + H₂O →(H⁺,t°) C₆H₁₂O₆ + C₆H₁₂O₆",
    gradeLevel: 12,
    category: "Hữu cơ"
  },
  {
    id: "rx_015",
    name: "Đốt cháy Magiê",
    reactants: [
      { formula: "Mg", coeff: 2, name: "Magiê" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "MgO", coeff: 2, name: "Magiê Oxit" }
    ],
    type: "combination",
    conditions: "Đốt cháy",
    observation: "Ngọn lửa trắng sáng chói. Tạo bột trắng MgO.",
    equation: "2Mg + O₂ → 2MgO",
    gradeLevel: 8,
    category: "Kim loại"
  },
  {
    id: "rx_016",
    name: "Axit Sunfuric + Đồng Oxit",
    reactants: [
      { formula: "H₂SO₄", coeff: 1, name: "Axit Sunfuric" },
      { formula: "CuO", coeff: 1, name: "Đồng (II) Oxit" }
    ],
    products: [
      { formula: "CuSO₄", coeff: 1, name: "Đồng Sunfat" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    type: "double-replacement",
    conditions: "Đun nóng nhẹ",
    observation: "Bột CuO đen tan dần. Dung dịch chuyển sang màu xanh lam đặc trưng.",
    equation: "H₂SO₄ + CuO → CuSO₄ + H₂O",
    gradeLevel: 9,
    category: "Axit - Bazơ"
  },
];

// Danh sách hóa chất đơn có sẵn để chọn
export const chemicals = [
  { formula: "H₂", name: "Khí Hydro", state: "gas", category: "Phi kim" },
  { formula: "O₂", name: "Khí Oxy", state: "gas", category: "Phi kim" },
  { formula: "N₂", name: "Khí Nitơ", state: "gas", category: "Phi kim" },
  { formula: "Cl₂", name: "Khí Clo", state: "gas", category: "Halogen" },
  { formula: "S", name: "Lưu huỳnh", state: "solid", category: "Phi kim" },
  { formula: "C", name: "Cacbon", state: "solid", category: "Phi kim" },
  { formula: "Fe", name: "Sắt", state: "solid", category: "Kim loại" },
  { formula: "Na", name: "Natri", state: "solid", category: "Kim loại kiềm" },
  { formula: "Mg", name: "Magiê", state: "solid", category: "Kim loại" },
  { formula: "Zn", name: "Kẽm", state: "solid", category: "Kim loại" },
  { formula: "Cu", name: "Đồng", state: "solid", category: "Kim loại" },
  { formula: "Al", name: "Nhôm", state: "solid", category: "Kim loại" },
  { formula: "Ca", name: "Canxi", state: "solid", category: "Kim loại" },
  { formula: "H₂O", name: "Nước", state: "liquid", category: "Dung môi" },
  { formula: "HCl", name: "Axit Clohidric", state: "liquid", category: "Axit" },
  { formula: "H₂SO₄", name: "Axit Sunfuric", state: "liquid", category: "Axit" },
  { formula: "NaOH", name: "Natri Hidroxit", state: "solid", category: "Bazơ" },
  { formula: "CaCO₃", name: "Đá vôi", state: "solid", category: "Muối" },
  { formula: "CuO", name: "Đồng (II) Oxit", state: "solid", category: "Oxit" },
  { formula: "MnO₂", name: "Mangan Dioxit", state: "solid", category: "Oxit" },
  { formula: "CuSO₄", name: "Đồng Sunfat", state: "solid", category: "Muối" },
  { formula: "BaCl₂", name: "Bari Clorua", state: "solid", category: "Muối" },
  { formula: "Na₂SO₄", name: "Natri Sunfat", state: "solid", category: "Muối" },
  { formula: "NaCl", name: "Natri Clorua", state: "solid", category: "Muối" },
  { formula: "CH₄", name: "Metan", state: "gas", category: "Hữu cơ" },
  { formula: "C₂H₅OH", name: "Rượu Etylic", state: "liquid", category: "Hữu cơ" },
  { formula: "C₁₂H₂₂O₁₁", name: "Saccarozơ", state: "solid", category: "Hữu cơ" },
];

// Tìm phản ứng giữa 2 chất
export const findReaction = (chem1, chem2) => {
  return reactions.find(rx => {
    const reactantFormulas = rx.reactants.map(r => r.formula);
    return (
      (reactantFormulas.includes(chem1) && reactantFormulas.includes(chem2)) ||
      (reactantFormulas.length === 1 && reactantFormulas.includes(chem1)) ||
      (reactantFormulas.length === 1 && reactantFormulas.includes(chem2))
    );
  });
};

// Lọc phản ứng theo lớp
export const getReactionsByGrade = (grade) => {
  return reactions.filter(rx => rx.gradeLevel === grade);
};

// Loại phản ứng
export const reactionTypes = {
  "combination": "Phản ứng hóa hợp",
  "decomposition": "Phản ứng phân hủy",
  "single-replacement": "Phản ứng thế",
  "double-replacement": "Phản ứng trao đổi",
  "combustion": "Phản ứng cháy",
  "redox": "Phản ứng oxi hóa-khử",
  "electrolysis": "Phản ứng điện phân",
  "hydrolysis": "Phản ứng thủy phân",
};
