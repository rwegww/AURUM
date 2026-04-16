export const reactionsCore = [
  // === LỚP 8 ===
  {
    id: "rx_001",
    name: "Tổng hợp nước (Đốt cháy H₂)",
    type: "combination",
    reactants: [
      { formula: "H₂", coeff: 2, name: "Khí Hydro" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "2H₂ + O₂ → 2H₂O",
    gradeLevel: 8,
    category: "Phi kim",
    conditions: "Đốt cháy hoặc tia lửa điện",
    observation: "Ngọn lửa xanh nhạt, tiếng nổ nhẹ. Hơi nước ngưng tụ trên thành ống nghiệm.",
    energy: -571.66, // kJ/mol (tỏa nhiệt mạnh)
    animation: "explosion",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_002",
    name: "Đốt cháy Sắt trong Oxy",
    type: "combination",
    reactants: [
      { formula: "Fe", coeff: 3, name: "Sắt" },
      { formula: "O₂", coeff: 2, name: "Khí Oxy" }
    ],
    products: [
      { formula: "Fe₃O₄", coeff: 1, name: "Oxit sắt từ" }
    ],
    equation: "3Fe + 2O₂ → Fe₃O₄",
    gradeLevel: 8,
    category: "Kim loại",
    conditions: "Nhiệt độ cao (t°)",
    observation: "Sắt cháy sáng chói, không có ngọn lửa, tóe các tia lửa sáng.",
    energy: -1118.4,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_003",
    name: "Kẽm tác dụng với Axit Clohidric",
    type: "single-replacement",
    reactants: [
      { formula: "Zn", coeff: 1, name: "Kẽm" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "ZnCl₂", coeff: 1, name: "Kẽm Clorua" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "Zn + 2HCl → ZnCl₂ + H₂↑",
    gradeLevel: 8,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Viên kẽm tan dần, bọt khí không màu thoát ra mạnh mẽ.",
    energy: -153.89,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_004",
    name: "Nung đá vôi (Phân hủy CaCO₃)",
    type: "decomposition",
    reactants: [
      { formula: "CaCO₃", coeff: 1, name: "Đá vôi" }
    ],
    products: [
      { formula: "CaO", coeff: 1, name: "Vôi sống" },
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" }
    ],
    equation: "CaCO₃ →(t°) CaO + CO₂↑",
    gradeLevel: 8,
    category: "Oxit",
    conditions: "Nhiệt độ cao (~900°C)",
    observation: "Đá vôi chuyển thành bite trắng bite xốp. Khí thoát ra làm đục nước vôi trong.",
    energy: 178.3, // Thu nhiệt
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_005",
    name: "Natri phản ứng với nước",
    type: "single-replacement",
    reactants: [
      { formula: "Na", coeff: 2, name: "Natri" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    products: [
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "2Na + 2H₂O → 2NaOH + H₂↑",
    gradeLevel: 8,
    category: "Kim loại kiềm",
    conditions: "Nhiệt độ thường",
    observation: "Natri nóng chảy thành viên tròn chạy trên mặt nước, tan nhanh và bốc khói.",
    energy: -368.6,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  // === LỚP 9 ===
  {
    id: "rx_006",
    name: "Phản ứng trung hòa Axit-Bazơ",
    type: "double-replacement",
    reactants: [
      { formula: "HCl", coeff: 1, name: "Axit Clohidric" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "NaCl", coeff: 1, name: "Natri Clorua" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "HCl + NaOH → NaCl + H₂O",
    gradeLevel: 9,
    category: "Axit - Bazơ",
    conditions: "Nhiệt độ thường",
    observation: "Phản ứng tỏa nhiệt. Nếu có chỉ thị màu sẽ thấy sự đổi màu dung dịch.",
    energy: -57.32,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_007",
    name: "Sắt đẩy Đồng ra khỏi muối",
    type: "single-replacement",
    reactants: [
      { formula: "Fe", coeff: 1, name: "Sắt" },
      { formula: "CuSO₄", coeff: 1, name: "Đồng(II) Sunfat" }
    ],
    products: [
      { formula: "FeSO₄", coeff: 1, name: "Sắt(II) Sunfat" },
      { formula: "Cu", coeff: 1, name: "Đồng" }
    ],
    equation: "Fe + CuSO₄ → FeSO₄ + Cu↓",
    gradeLevel: 9,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Một lớp kim loại màu đỏ (Cu) bám ngoài đinh sắt. Dung dịch xanh lam nhạt dần.",
    energy: -149.7,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_008",
    name: "Phản ứng tạo kết tủa Trắng",
    type: "double-replacement",
    reactants: [
      { formula: "BaCl₂", coeff: 1, name: "Bari Clorua" },
      { formula: "Na₂SO₄", coeff: 1, name: "Natri Sunfat" }
    ],
    products: [
      { formula: "BaSO₄", coeff: 1, name: "Bari Sunfat" },
      { formula: "NaCl", coeff: 2, name: "Natri Clorua" }
    ],
    equation: "BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl",
    gradeLevel: 9,
    category: "Muối",
    conditions: "Nhiệt độ thường",
    observation: "Xuất hiện kết tủa trắng (BaSO₄) lắng xuống đáy ống nghiệm.",
    energy: -24.5,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  // === LỚP 10-12 ===
  {
    id: "rx_009",
    name: "Tổng hợp Amoniac (Haber)",
    type: "combination",
    reactants: [
      { formula: "N₂", coeff: 1, name: "Khí Nitơ" },
      { formula: "H₂", coeff: 3, name: "Khí Hydro" }
    ],
    products: [
      { formula: "NH₃", coeff: 2, name: "Amoniac" }
    ],
    equation: "N₂ + 3H₂ ⇌ 2NH₃",
    gradeLevel: 10,
    category: "Phi kim",
    conditions: "450-500°C, 200atm, xúc tác Fe",
    observation: "Khí tạo thành có mùi khai đặc trưng.",
    energy: -92.4,
    animation: "synthesis",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_010",
    name: "Phản ứng cháy Metan",
    type: "combustion",
    reactants: [
      { formula: "CH₄", coeff: 1, name: "Khí Metan" },
      { formula: "O₂", coeff: 2, name: "Khí Oxy" }
    ],
    products: [
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "CH₄ + 2O₂ → CO₂ + 2H₂O",
    gradeLevel: 11,
    category: "Hữu cơ",
    conditions: "Đốt cháy",
    observation: "Ngọn lửa xanh nhẹ tỏa nhiều nhiệt. Làm đục nước vôi trong.",
    energy: -890.3,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_011",
    name: "Tổng hợp Axit Clohidric",
    type: "combination",
    reactants: [
      { formula: "H₂", coeff: 1, name: "Khí Hydro" },
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" }
    ],
    products: [
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    equation: "H₂ + Cl₂ → 2HCl",
    gradeLevel: 8,
    category: "Axit",
    conditions: "Ánh sáng hoặc Nhiệt độ",
    observation: "Hỗn hợp khí nổ nhẹ (nếu tỉ lệ 1:1), tạo khói trắng.",
    energy: -184.6,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_012",
    name: "Phân hủy thuốc tím (KMnO₄)",
    type: "decomposition",
    reactants: [
      { formula: "KMnO₄", coeff: 2, name: "Kali Pemanganat" }
    ],
    products: [
      { formula: "K₂MnO₄", coeff: 1, name: "Kali Manganat" },
      { formula: "MnO₂", coeff: 1, name: "Mangan Đioxit" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    equation: "2KMnO₄ →(t°) K₂MnO₄ + MnO₂ + O₂↑",
    gradeLevel: 9,
    category: "Muối",
    conditions: "Nhiệt độ cao (t°)",
    observation: "Chất rắn màu tím đen phân hủy thành bột màu xanh đen và khí làm que đốm bùng sáng.",
    energy: 50,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_013",
    name: "Nhiệt phân Kali Clorat",
    type: "decomposition",
    reactants: [
      { formula: "KClO₃", coeff: 2, name: "Kali Clorat" }
    ],
    products: [
      { formula: "KCl", coeff: 2, name: "Kali Clorua" },
      { formula: "O₂", coeff: 3, name: "Khí Oxy" }
    ],
    equation: "2KClO₃ →(t°, MnO₂) 2KCl + 3O₂↑",
    gradeLevel: 10,
    category: "Muối",
    conditions: "Nhiệt độ cao, xúc tác MnO₂",
    observation: "Chất rắn chảy lỏng, bọt khí thoát ra mạnh mẽ làm que đốm cháy sáng.",
    energy: -45,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_014",
    name: "Sắt tác dụng với Lưu huỳnh",
    type: "combination",
    reactants: [
      { formula: "Fe", coeff: 1, name: "Sắt" },
      { formula: "S", coeff: 1, name: "Lưu huỳnh" }
    ],
    products: [
      { formula: "FeS", coeff: 1, name: "Sắt(II) Sunfua" }
    ],
    equation: "Fe + S →(t°) FeS",
    gradeLevel: 8,
    category: "Kim loại",
    conditions: "Nhiệt độ cao (t°)",
    observation: "Hỗn hợp cháy sáng mạnh, tạo chất rắn màu xám đen.",
    energy: -100,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_015",
    name: "Tổng hợp Hydro Sunfua",
    type: "combination",
    reactants: [
      { formula: "H₂", coeff: 1, name: "Khí Hydro" },
      { formula: "S", coeff: 1, name: "Lưu huỳnh" }
    ],
    products: [
      { formula: "H₂S", coeff: 1, name: "Hydro Sunfua" }
    ],
    equation: "H₂ + S →(t°) H₂S",
    gradeLevel: 10,
    category: "Phi kim",
    conditions: "Nhiệt độ cao (350-400°C)",
    observation: "Khí tạo thành có mùi trứng thối đặc trưng.",
    energy: -20,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_016",
    name: "Magiê cháy trong Oxy",
    type: "combination",
    reactants: [
      { formula: "Mg", coeff: 2, name: "Magiê" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "MgO", coeff: 2, name: "Magiê Oxit" }
    ],
    equation: "2Mg + O₂ →(t°) 2MgO",
    gradeLevel: 8,
    category: "Kim loại",
    conditions: "Đốt cháy",
    observation: "Magiê cháy sáng chói với ngọn lửa trắng, tạo bột trắng (MgO).",
    energy: -601,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_017",
    name: "Natri cháy trong Clo",
    type: "combination",
    reactants: [
      { formula: "Na", coeff: 2, name: "Natri" },
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" }
    ],
    products: [
      { formula: "NaCl", coeff: 2, name: "Natri Clorua" }
    ],
    equation: "2Na + Cl₂ →(t°) 2NaCl",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiệt độ cao",
    observation: "Natri nóng chảy và cháy trong khí clo với ngọn lửa vàng chói, tạo tinh thể muối trắng.",
    energy: -411,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
];