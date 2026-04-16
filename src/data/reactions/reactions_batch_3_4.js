export const reactionsBatch3_4 = [
  // --- BỔ SUNG KHỐI LƯỢNG LỚN (BATCH 3: HỮU CƠ ĐẠI CƯƠNG & CHUYÊN SÂU - PHẦN A) ---
  {
    id: "rx_075",
    name: "Phản ứng thế Clo của Metan (Giai đoạn 1)",
    type: "single-replacement",
    reactants: [
      { formula: "CH₄", coeff: 1, name: "Khí Metan" },
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" }
    ],
    products: [
      { formula: "CH₃Cl", coeff: 1, name: "Metyl Clorua" },
      { formula: "HCl", coeff: 1, name: "Hydro Clo" }
    ],
    equation: "CH₄ + Cl₂ →(as) CH₃Cl + HCl",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Ánh sáng khuếch tán",
    observation: "Màu vàng lục của clo nhạt dần, tạo ra khí hydro clorua làm đỏ quỳ tím ẩm.",
    energy: -103,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_076",
    name: "Nhiệt phân Metan (1500°C)",
    type: "decomposition",
    reactants: [
      { formula: "CH₄", coeff: 2, name: "Khí Metan" }
    ],
    products: [
      { formula: "C₂H₂", coeff: 1, name: "Axetilen" },
      { formula: "H₂", coeff: 3, name: "Khí Hydro" }
    ],
    equation: "2CH₄ →(1500°C, làm lạnh nhanh) C₂H₂ + 3H₂↑",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "1500°C, làm lạnh nhanh",
    observation: "Metan bị phân hủy tạo khí axetilen dùng trong công nghiệp.",
    energy: 377,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_077",
    name: "Đốt cháy Etan",
    type: "combustion",
    reactants: [
      { formula: "C₂H₆", coeff: 2, name: "Khí Etan" },
      { formula: "O₂", coeff: 7, name: "Khí Oxy" }
    ],
    products: [
      { formula: "CO₂", coeff: 4, name: "Khí Cacbonic" },
      { formula: "H₂O", coeff: 6, name: "Nước" }
    ],
    equation: "2C₂H₆ + 7O₂ →(t°) 4CO₂ + 6H₂O",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Nhiệt độ cao",
    observation: "Etan cháy mạnh tỏa nhiều nhiệt, tạo khí làm đục nước vôi trong.",
    energy: -3120,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_078",
    name: "Cộng Hydro vào Etilen",
    type: "combination",
    reactants: [
      { formula: "C₂H₄", coeff: 1, name: "Etilen" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    products: [
      { formula: "C₂H₆", coeff: 1, name: "Etan" }
    ],
    equation: "C₂H₄ + H₂ →(t°, Ni) C₂H₆",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Nhiệt độ, xúc tác Ni",
    observation: "Etilen phản ứng tạo thành Etan.",
    energy: -137,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_079",
    name: "Cộng Hydro vào Axetilen (Tỉ lệ 1:1)",
    type: "combination",
    reactants: [
      { formula: "C₂H₂", coeff: 1, name: "Axetilen" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    products: [
      { formula: "C₂H₄", coeff: 1, name: "Etilen" }
    ],
    equation: "C₂H₂ + H₂ →(t°, Pd/PbCO₃) C₂H₄",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Nhiệt độ, xúc tác Pd/PbCO₃",
    observation: "Phản ứng dừng lại ở giai đoạn tạo Etilen nhờ xúc tác đặc biệt.",
    energy: -175,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_080",
    name: "Cộng Hydro vào Axetilen (Tỉ lệ 1:2)",
    type: "combination",
    reactants: [
      { formula: "C₂H₂", coeff: 1, name: "Axetilen" },
      { formula: "H₂", coeff: 2, name: "Khí Hydro" }
    ],
    products: [
      { formula: "C₂H₆", coeff: 1, name: "Etan" }
    ],
    equation: "C₂H₂ + 2H₂ →(t°, Ni) C₂H₆",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Nhiệt độ, xúc tác Ni",
    observation: "Axetilen phản ứng hoàn toàn tạo thành Etan.",
    energy: -312,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_081",
    name: "Đime hóa Axetilen",
    type: "combination",
    reactants: [
      { formula: "C₂H₂", coeff: 2, name: "Axetilen" }
    ],
    products: [
      { formula: "C₄H₄", coeff: 1, name: "Vinylaxetilen" }
    ],
    equation: "2C₂H₂ →(t°, xt) CH₂=CH-C≡CH",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Nhiệt độ, xúc tác CuCl/NH₄Cl",
    observation: "Tạo thành Vinylaxetilen dùng trong sản xuất cao su chloroprene.",
    energy: -200,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_082",
    name: "Trime hóa Axetilen (Tạo Benzen)",
    type: "combination",
    reactants: [
      { formula: "C₂H₂", coeff: 3, name: "Axetilen" }
    ],
    products: [
      { formula: "C₆H₆", coeff: 1, name: "Benzen" }
    ],
    equation: "3C₂H₂ →(600°C, C) C₆H₆",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "600°C, xúc tác Than hoạt tính",
    observation: "Ba phân tử axetilen kết hợp tạo thành vòng benzen.",
    energy: -600,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_083",
    name: "Cộng nước vào Axetilen (Điều chế Andehit)",
    type: "combination",
    reactants: [
      { formula: "C₂H₂", coeff: 1, name: "Axetilen" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "CH₃CHO", coeff: 1, name: "Andehit Axetic" }
    ],
    equation: "C₂H₂ + H₂O →(80°C, HgSO₄) CH₃CHO",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "80°C, xúc tác HgSO₄",
    observation: "Sản phẩm trung gian bền chuyển hóa ngay thành andehit axetic.",
    energy: -138,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_084",
    name: "Cộng Hydro vào Benzen",
    type: "combination",
    reactants: [
      { formula: "C₆H₆", coeff: 1, name: "Benzen" },
      { formula: "H₂", coeff: 3, name: "Khí Hydro" }
    ],
    products: [
      { formula: "C₆H₁₂", coeff: 1, name: "Xyclohexan" }
    ],
    equation: "C₆H₆ + 3H₂ →(t°, Ni) C₆H₁₂",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Nhiệt độ, xúc tác Ni",
    observation: "Vòng benzen bị phá vỡ tạo thành hợp chất vòng bão hòa.",
    energy: -206,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_085",
    name: "Nitrat hóa Benzen",
    type: "single-replacement",
    reactants: [
      { formula: "C₆H₆", coeff: 1, name: "Benzen" },
      { formula: "HNO₃", coeff: 1, name: "Axit Nitric" }
    ],
    products: [
      { formula: "C₆H₅NO₂", coeff: 1, name: "Nitrobenzen" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "C₆H₆ + HNO₃(đ) →(H₂SO₄ đ) C₆H₅NO₂ + H₂O",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "H₂SO₄ đặc làm xúc tác",
    observation: "Tạo thành chất lỏng màu vàng nhạt, mùi hạnh nhân (Nitrobenzen) lắng xuống.",
    energy: -150,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_086",
    name: "Đốt cháy Benzen",
    type: "combustion",
    reactants: [
      { formula: "C₆H₆", coeff: 2, name: "Benzen" },
      { formula: "O₂", coeff: 15, name: "Khí Oxy" }
    ],
    products: [
      { formula: "CO₂", coeff: 12, name: "Khí Cacbonic" },
      { formula: "H₂O", coeff: 6, name: "Nước" }
    ],
    equation: "2C₆H₆ + 15O₂ →(t°) 12CO₂ + 6H₂O",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Nhiệt độ cao",
    observation: "Benzen cháy trong không khí với ngọn lửa nhiều khói đen do hàm lượng carbon cao.",
    energy: -6540,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_087",
    name: "Methanol hóa (Điều chế rượu metylic)",
    type: "combination",
    reactants: [
      { formula: "CO", coeff: 1, name: "Oxit Cacbon" },
      { formula: "H₂", coeff: 2, name: "Khí Hydro" }
    ],
    products: [
      { formula: "CH₃OH", coeff: 1, name: "Rượu Metylic" }
    ],
    equation: "CO + 2H₂ →(t°, xt) CH₃OH",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "400°C, xúc tác ZnO/Cr₂O₃",
    observation: "Phản ứng công nghiệp quan trọng để sản xuất methanol.",
    energy: -91,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_088",
    name: "Thủy phân Dẫn xuất Halogen (Tạo rượu)",
    type: "double-replacement",
    reactants: [
      { formula: "C₂H₅Cl", coeff: 1, name: "Etyl Clorua" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "C₂H₅OH", coeff: 1, name: "Rượu Etylic" },
      { formula: "NaCl", coeff: 1, name: "Natri Clorua" }
    ],
    equation: "C₂H₅Cl + NaOH →(t°) C₂H₅OH + NaCl",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "Đun nóng",
    observation: "Dẫn xuất halogen bị thủy phân tạo rượu tương ứng.",
    energy: -50,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_089",
    name: "Rượu Etylic tác dụng với Axit HCl",
    type: "double-replacement",
    reactants: [
      { formula: "C₂H₅OH", coeff: 1, name: "Rượu Etylic" },
      { formula: "HCl", coeff: 1, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "C₂H₅Cl", coeff: 1, name: "Etyl Clorua" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "C₂H₅OH + HCl →(t°) C₂H₅Cl + H₂O",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "Đun nóng",
    observation: "Nhóm OH bị thay thế bởi nguyên tử Clo.",
    energy: -10,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_090",
    name: "Tách nước rượu Etylic ở 140°C (Tạo Ête)",
    type: "decomposition",
    reactants: [
      { formula: "C₂H₅OH", coeff: 2, name: "Rượu Etylic" }
    ],
    products: [
      { formula: "C₂H₅OC₂H₅", coeff: 1, name: "Đietyl Ête" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "2C₂H₅OH →(140°C, H₂SO₄) C₂H₅OC₂H₅ + H₂O",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "140°C, xúc tác H₂SO₄ đặc",
    observation: "Hai phân tử rượu tách nước tạo thành ete.",
    energy: -20,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_091",
    name: "Đốt cháy Rượu Etylic",
    type: "combustion",
    reactants: [
      { formula: "C₂H₅OH", coeff: 1, name: "Rượu Etylic" },
      { formula: "O₂", coeff: 3, name: "Khí Oxy" }
    ],
    products: [
      { formula: "CO₂", coeff: 2, name: "Khí Cacbonic" },
      { formula: "H₂O", coeff: 3, name: "Nước" }
    ],
    equation: "C₂H₅OH + 3O₂ →(t°) 2CO₂ + 3H₂O",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "Đốt cháy",
    observation: "Rượu cháy với ngọn lửa màu xanh nhạt, tỏa nhiều nhiệt.",
    energy: -1367,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_092",
    name: "Phenol tác dụng với Natri",
    type: "single-replacement",
    reactants: [
      { formula: "C₆H₅OH", coeff: 2, name: "Phenol" },
      { formula: "Na", coeff: 2, name: "Natri" }
    ],
    products: [
      { formula: "C₆H₅ONa", coeff: 2, name: "Natri Phenolat" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "2C₆H₅OH + 2Na → 2C₆H₅ONa + H₂↑",
    gradeLevel: 11,
    category: "Phenol",
    conditions: "Đun nóng chảy phenol",
    observation: "Natri tan, giải phóng khí hydro.",
    energy: -170,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_093",
    name: "Phenol tác dụng với NaOH",
    type: "double-replacement",
    reactants: [
      { formula: "C₆H₅OH", coeff: 1, name: "Phenol" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "C₆H₅ONa", coeff: 1, name: "Natri Phenolat" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "C₆H₅OH + NaOH → C₆H₅ONa + H₂O",
    gradeLevel: 11,
    category: "Phenol",
    conditions: "Nhiệt độ thường",
    observation: "Phenol (đục) tan dần tạo dung dịch đồng nhất (Natri Phenolat).",
    energy: -30,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_094",
    name: "Phản ứng của Natri Phenolat với CO₂",
    type: "double-replacement",
    reactants: [
      { formula: "C₆H₅ONa", coeff: 1, name: "Natri Phenolat" },
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "C₆H₅OH", coeff: 1, name: "Phenol" },
      { formula: "NaHCO₃", coeff: 1, name: "Natri Bicacbonat" }
    ],
    equation: "C₆H₅ONa + CO₂ + H₂O → C₆H₅OH↓ + NaHCO₃",
    gradeLevel: 11,
    category: "Phenol",
    conditions: "Nhiệt độ thường",
    observation: "Dung dịch bị vẩn đục do Phenol tách ra (Axit cacbonic mạnh hơn phenol).",
    energy: -15,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_095",
    name: "Khử Andehit thành Rượu (Cộng H₂)",
    type: "combination",
    reactants: [
      { formula: "CH₃CHO", coeff: 1, name: "Andehit Axetic" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    products: [
      { formula: "C₂H₅OH", coeff: 1, name: "Rượu Etylic" }
    ],
    equation: "CH₃CHO + H₂ →(t°, Ni) C₂H₅OH",
    gradeLevel: 11,
    category: "Andehit",
    conditions: "Nhiệt độ, xúc tác Ni",
    observation: "Andehit bị khử thành rượu etylic bão hòa.",
    energy: -70,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_096",
    name: "Oxi hóa Andehit bằng Oxy (Sản xuất axit)",
    type: "redox",
    reactants: [
      { formula: "CH₃CHO", coeff: 2, name: "Andehit Axetic" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "CH₃COOH", coeff: 2, name: "Axit Axetic" }
    ],
    equation: "2CH₃CHO + O₂ →(t°, xt) 2CH₃COOH",
    gradeLevel: 11,
    category: "Andehit",
    conditions: "Nhiệt độ, xúc tác Mn²⁺",
    observation: "Andehit bị oxi hóa thành axit tương ứng.",
    energy: -300,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_097",
    name: "Axit Axetic tác dụng với NaOH",
    type: "double-replacement",
    reactants: [
      { formula: "CH₃COOH", coeff: 1, name: "Axit Axetic" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "CH₃COONa", coeff: 1, name: "Natri Axetat" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "CH₃COOH + NaOH → CH₃COONa + H₂O",
    gradeLevel: 11,
    category: "Axit hữu cơ",
    conditions: "Nhiệt độ thường",
    observation: "Phản ứng trung hòa tỏa nhiệt nhẹ.",
    energy: -57,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_098",
    name: "Saponification (Thủy phân este trong kiềm)",
    type: "double-replacement",
    reactants: [
      { formula: "CH₃COOC₂H₅", coeff: 1, name: "Etyl Axetat" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "CH₃COONa", coeff: 1, name: "Natri Axetat" },
      { formula: "C₂H₅OH", coeff: 1, name: "Rượu Etylic" }
    ],
    equation: "CH₃COOC₂H₅ + NaOH →(t°) CH₃COONa + C₂H₅OH",
    gradeLevel: 12,
    category: "Este",
    conditions: "Đun nóng",
    observation: "Mùi este mất dần, dung dịch trở nên đồng nhất.",
    energy: -40,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_099",
    name: "Phản ứng của Glyxin với HCl",
    type: "combination",
    reactants: [
      { formula: "Gly", coeff: 1, name: "Glyxin" },
      { formula: "HCl", coeff: 1, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "ClH₃N-CH₂-COOH", coeff: 1, name: "Muối Glyxinat" }
    ],
    equation: "H₂N-CH₂-COOH + HCl → ClH₃N-CH₂-COOH",
    gradeLevel: 12,
    category: "Amino Acid",
    conditions: "Nhiệt độ thường",
    observation: "Amino acid thể hiện tính bazơ.",
    energy: -45,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_100",
    name: "Phản ứng của Glyxin với NaOH",
    type: "double-replacement",
    reactants: [
      { formula: "Gly", coeff: 1, name: "Glyxin" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "H₂N-CH₂-COONa", coeff: 1, name: "Natri Glyxinat" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "H₂N-CH₂-COOH + NaOH → H₂N-CH₂-COONa + H₂O",
    gradeLevel: 12,
    category: "Amino Acid",
    conditions: "Nhiệt độ thường",
    observation: "Amino acid thể hiện tính axit.",
    energy: -50,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_101",
    name: "Thủy phân Saccarozơ",
    type: "double-replacement",
    reactants: [
      { formula: "C₁₂H₂₂O₁₁", coeff: 1, name: "Saccarozơ" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "C₆H₁₂O₆", coeff: 2, name: "Glucozơ & Fructozơ" }
    ],
    equation: "C₁₂H₂₂O₁₁ + H₂O →(t°, H⁺) C₆H₁₂O₆ + C₆H₁₂O₆",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Đun nóng, xúc tác axit",
    observation: "Đường đôi bị phân cắt thành hai đường đơn.",
    energy: -10,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_102",
    name: "Thủy phân Tinh bột",
    type: "double-replacement",
    reactants: [
      { formula: "Starch", coeff: 1, name: "Tinh bột" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "C₆H₁₂O₆", coeff: 1, name: "Glucozơ" }
    ],
    equation: "(C₆H₁₀O₅)n + nH₂O →(t°, H⁺) nC₆H₁₂O₆",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Đun nóng, xúc tác axit hoặc enzyme",
    observation: "Tinh bột dần biến đổi thành đường glucozơ.",
    energy: -5,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_103",
    name: "Phản ứng màu Iốt của Tinh bột",
    type: "combination",
    reactants: [
      { formula: "Starch", coeff: 1, name: "Tinh bột" },
      { formula: "I₂", coeff: 1, name: "Dung dịch Iốt" }
    ],
    products: [
      { formula: "Starch-I2", coeff: 1, name: "Hợp chất màu xanh tím" }
    ],
    equation: "Tinh bột + I₂ → Hợp chất màu xanh tím",
    gradeLevel: 10,
    category: "Carbohydrate",
    conditions: "Nhiệt độ thường (mất màu khi đun nóng)",
    observation: "Dung dịch xuất hiện màu xanh tím đặc trưng, khi đun nóng màu biến mất, để nguội lại hiện ra.",
    energy: -10,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_104",
    name: "Glucozơ tác dụng với Cu(OH)₂ (Nhiệt độ thường)",
    type: "combination",
    reactants: [
      { formula: "C₆H₁₂O₆", coeff: 2, name: "Glucozơ" },
      { formula: "Cu(OH)₂", coeff: 1, name: "Đồng(II) Hidroxit" }
    ],
    products: [
      { formula: "Glucose-Cu", coeff: 1, name: "Phức đồng-glucozơ" }
    ],
    equation: "2C₆H₁₂O₆ + Cu(OH)₂ → Phức đồng glucozơ + 2H₂O",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Nhiệt độ thường",
    observation: "Kết tủa xanh lơ tan tạo thành dung dịch màu xanh lam thẫm đặc trưng.",
    energy: -20,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_105",
    name: "Glucozơ tác dụng với Cu(OH)₂ (Đun nóng)",
    type: "redox",
    reactants: [
      { formula: "C₆H₁₂O₆", coeff: 1, name: "Glucozơ" },
      { formula: "Cu(OH)₂", coeff: 2, name: "Đồng(II) Hidroxit" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "C₆H₁₁O₇Na", coeff: 1, name: "Natri Gluconat" },
      { formula: "Cu₂O", coeff: 1, name: "Đồng(I) Oxit" },
      { formula: "H₂O", coeff: 3, name: "Nước" }
    ],
    equation: "C₆H₁₂O₆ + 2Cu(OH)₂ + NaOH → C₆H₁₁O₇Na + Cu₂O↓ + 3H₂O",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Đun nóng",
    observation: "Dung dịch xanh lam xuất hiện kết tủa màu đỏ gạch của Cu₂O.",
    energy: -80,
    animation: "precipitation",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_106",
    name: "Phản ứng thế của Toluen với Brom",
    type: "single-replacement",
    reactants: [
      { formula: "C₇H₈", coeff: 1, name: "Toluen" },
      { formula: "Br₂", coeff: 1, name: "Brom lỏng" }
    ],
    products: [
      { formula: "C₇H₇Br", coeff: 1, name: "Benzyl Bromua" },
      { formula: "HBr", coeff: 1, name: "Hydro Bromua" }
    ],
    equation: "C₆H₅-CH₃ + Br₂ →(t°, as) C₆H₅-CH₂Br + HBr",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Chiếu sáng hoặc đun nóng (thế vào nhánh)",
    observation: "Màu nâu đỏ của brom mất dần, có khí thoát ra.",
    energy: -45,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_107",
    name: "Oxihóa Toluen bằng KMnO₄",
    type: "redox",
    reactants: [
      { formula: "C₇H₈", coeff: 1, name: "Toluen" },
      { formula: "KMnO₄", coeff: 2, name: "Thuốc tím" }
    ],
    products: [
      { formula: "C₆H₅COOK", coeff: 1, name: "Kali Benzoat" },
      { formula: "MnO₂", coeff: 2, name: "Mangan Đioxit" },
      { formula: "KOH", coeff: 1, name: "Kali Hidroxit" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "C₆H₅-CH₃ + 2KMnO₄ →(t°) C₆H₅-COOK + 2MnO₂↓ + KOH + H₂O",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Đun nóng",
    observation: "Màu tím của dung dịch bị mất đi, xuất hiện kết tủa đen.",
    energy: -250,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_108",
    name: "Đốt cháy Methanol",
    type: "combustion",
    reactants: [
      { formula: "CH₃OH", coeff: 2, name: "Rượu Metylic" },
      { formula: "O₂", coeff: 3, name: "Khí Oxy" }
    ],
    products: [
      { formula: "CO₂", coeff: 2, name: "Khí Cacbonic" },
      { formula: "H₂O", coeff: 4, name: "Nước" }
    ],
    equation: "2CH₃OH + 3O₂ →(t°) 2CO₂ + 4H₂O",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "Đốt cháy",
    observation: "Cháy với ngọn lửa xanh nhạt mãnh liệt.",
    energy: -1450,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_109",
    name: "Glixerol tác dụng với Cu(OH)₂",
    type: "combination",
    reactants: [
      { formula: "C₃H₈O₃", coeff: 2, name: "Glixerol" },
      { formula: "Cu(OH)₂", coeff: 1, name: "Đồng(II) Hidroxit" }
    ],
    products: [
      { formula: "Glycerol-Cu", coeff: 1, name: "Phức đồng-glixerol" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "2C₃H₈O₃ + Cu(OH)₂ → Phức đồng-glixerol + 2H₂O",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "Nhiệt độ thường",
    observation: "Hòa tan kết tủa Cu(OH)₂ tạo dung dịch màu xanh lam thẫm.",
    energy: -30,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_110",
    name: "Sản xuất Axit Axetic bằng cách lên men giấm",
    type: "redox",
    reactants: [
      { formula: "C₂H₅OH", coeff: 1, name: "Rượu Etylic" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "CH₃COOH", coeff: 1, name: "Axit Axetic" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "C₂H₅OH + O₂ →(men) CH₃COOH + H₂O",
    gradeLevel: 9,
    category: "Hữu cơ",
    conditions: "Men giấm, 25-30°C",
    observation: "Rượu loãng chuyển thành giấm có vị chua đặc trưng.",
    energy: -480,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_111",
    name: "Axit Axetic tác dụng với Magie",
    type: "single-replacement",
    reactants: [
      { formula: "CH₃COOH", coeff: 2, name: "Axit Axetic" },
      { formula: "Mg", coeff: 1, name: "Magiê" }
    ],
    products: [
      { formula: "(CH₃COO)₂Mg", coeff: 1, name: "Magiê Axetat" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "2CH₃COOH + Mg → (CH₃COO)₂Mg + H₂↑",
    gradeLevel: 9,
    category: "Hữu cơ",
    conditions: "Nhiệt độ thường",
    observation: "Magiê tan dần, sủi bọt khí hydro.",
    energy: -250,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_112",
    name: "Axit Axetic tác dụng với Na₂CO₃",
    type: "double-replacement",
    reactants: [
      { formula: "CH₃COOH", coeff: 2, name: "Axit Axetic" },
      { formula: "Na₂CO₃", coeff: 1, name: "Natri Cacbonat" }
    ],
    products: [
      { formula: "CH₃COONa", coeff: 2, name: "Natri Axetat" },
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "2CH₃COOH + Na₂CO₃ → 2CH₃COONa + CO₂↑ + H₂O",
    gradeLevel: 9,
    category: "Hữu cơ",
    conditions: "Nhiệt độ thường",
    observation: "Sủi bọt khí CO₂ mãnh liệt.",
    energy: -30,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_113",
    name: "Đốt cháy Methan trong Clo (Tạo muội than)",
    type: "redox",
    reactants: [
      { formula: "CH₄", coeff: 1, name: "Khí Metan" },
      { formula: "Cl₂", coeff: 2, name: "Khí Clo" }
    ],
    products: [
      { formula: "C", coeff: 1, name: "Muội than" },
      { formula: "HCl", coeff: 4, name: "Hydro Clo" }
    ],
    equation: "CH₄ + 2Cl₂ →(t°) C + 4HCl",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Đốt cháy trong khí clo",
    observation: "Ngọn lửa sẫm màu, xuất hiện nhiều muội than đen và khí HCl.",
    energy: -300,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_114",
    name: "Phản ứng của Anilin với dung dịch Brom",
    type: "double-replacement",
    reactants: [
      { formula: "C₆H₅NH₂", coeff: 1, name: "Anilin" },
      { formula: "Br₂", coeff: 3, name: "Nước Brom" }
    ],
    products: [
      { formula: "C₆H₂Br₃NH₂", coeff: 1, name: "2,4,6-Tribromanilin" },
      { formula: "HBr", coeff: 3, name: "Hydro Bromua" }
    ],
    equation: "C₆H₅NH₂ + 3Br₂ → C₆H₂Br₃NH₂↓ + 3HBr",
    gradeLevel: 12,
    category: "Amin",
    conditions: "Nhiệt độ thường",
    observation: "Dung dịch brom bị mất màu, xuất hiện kết tủa trắng (Tribromanilin).",
    energy: -110,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_115",
    name: "Phản ứng cộng H₂ vào dầu thực vật (Lỏng thành Rắn)",
    type: "combination",
    reactants: [
      { formula: "(C₁₇H₃₃COO)₃C₃H₅", coeff: 1, name: "Triolein (Dầu)" },
      { formula: "H₂", coeff: 3, name: "Khí Hydro" }
    ],
    products: [
      { formula: "(C₁₇H₃₅COO)₃C₃H₅", coeff: 1, name: "Tristearin (Mỡ)" }
    ],
    equation: "(C₁₇H₃₃COO)₃C₃H₅ + 3H₂ →(t°, Ni) (C₁₇H₃₅COO)₃C₃H₅",
    gradeLevel: 12,
    category: "Lipit",
    conditions: "Nhiệt độ, áp suất, Ni",
    observation: "Dầu thực vật lỏng chuyển hóa thành chất béo rắn (bơ thực vật).",
    energy: -350,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  // --- BỔ SUNG KHỐI LƯỢNG LỚN (BATCH 3 PHẦN B & BATCH 4: NHẬN BIẾT & CHUYÊN SÂU) ---
  {
    id: "rx_116",
    name: "Thủy phân Tristearin trong môi trường Axit",
    type: "double-replacement",
    reactants: [
      { formula: "(C₁₇H₃₅COO)₃C₃H₅", coeff: 1, name: "Tristearin" },
      { formula: "H₂O", coeff: 3, name: "Nước" }
    ],
    products: [
      { formula: "C₁₇H₃₅COOH", coeff: 3, name: "Axit Stearic" },
      { formula: "C₃H₈O₃", coeff: 1, name: "Glixerol" }
    ],
    equation: "(C₁₇H₃₅COO)₃C₃H₅ + 3H₂O →(t°, H⁺) 3C₁₇H₃₅COOH + C₃H₈O₃",
    gradeLevel: 12,
    category: "Lipit",
    conditions: "Đun nóng, xúc tác axit",
    observation: "Hỗn hợp chất béo dần tan ra, tạo thành axit béo và glixerol.",
    energy: -20,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_117",
    name: "Xà phòng hóa Tristearin",
    type: "double-replacement",
    reactants: [
      { formula: "(C₁₇H₃₅COO)₃C₃H₅", coeff: 1, name: "Tristearin" },
      { formula: "NaOH", coeff: 3, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "C₁₇H₃₅COONa", coeff: 3, name: "Natri Stearat (Xà phòng)" },
      { formula: "C₃H₈O₃", coeff: 1, name: "Glixerol" }
    ],
    equation: "(C₁₇H₃₅COO)₃C₃H₅ + 3NaOH →(t°) 3C₁₇H₃₅COONa + C₃H₈O₃",
    gradeLevel: 12,
    category: "Lipit",
    conditions: "Đun nóng",
    observation: "Chất béo tan trong kiềm, sau đó thêm NaCl bão hòa thấy xà phòng nổi lên trên.",
    energy: -100,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_118",
    name: "Phản ứng este hóa giữa Axit Axetic và Methanol",
    type: "double-replacement",
    reactants: [
      { formula: "CH₃COOH", coeff: 1, name: "Axit Axetic" },
      { formula: "CH₃OH", coeff: 1, name: "Rượu Metylic" }
    ],
    products: [
      { formula: "CH₃COOCH₃", coeff: 1, name: "Metyl Axetat" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "CH₃COOH + CH₃OH ⇌(t°, H₂SO₄) CH₃COOCH₃ + H₂O",
    gradeLevel: 12,
    category: "Este",
    conditions: "Đun nóng, H₂SO₄ đặc làm xúc tác",
    observation: "Tạo thành chất lỏng không màu, mùi thơm dễ chịu của este.",
    energy: -10,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_119",
    name: "Thủy phân Xenlulozơ",
    type: "double-replacement",
    reactants: [
      { formula: "Cellulose", coeff: 1, name: "Xenlulozơ" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "C₆H₁₂O₆", coeff: 1, name: "Glucozơ" }
    ],
    equation: "(C₆H₁₀O₅)n + nH₂O →(t°, H⁺) nC₆H₁₂O₆",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Đun nóng lâu với xác tác axit đặc",
    observation: "Nguyên liệu chứa xenlulozơ (bông, gỗ) bị hòa tan tạo dung dịch đường.",
    energy: -5,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_120",
    name: "Phản ứng nhựa Novolac (Phenol + Fomanđehit)",
    type: "combination",
    reactants: [
      { formula: "C₆H₅OH", coeff: 1, name: "Phenol" },
      { formula: "HCHO", coeff: 1, name: "Fomanđehit" }
    ],
    products: [
      { formula: "Novolac", coeff: 1, name: "Nhựa Novolac" }
    ],
    equation: "nC₆H₅OH + nHCHO →(H⁺, t°) Nhựa Novolac + nH₂O",
    gradeLevel: 12,
    category: "Polyme",
    conditions: "Xúc tác Axit, dư Phenol",
    observation: "Hỗn hợp lỏng chuyển sang dạng nhựa dẻo, rồi rắn lại khi nguội.",
    energy: -150,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_121",
    name: "Phản ứng trùng hợp Etilen (Tạo nhựa PE)",
    type: "combination",
    reactants: [
      { formula: "C₂H₄", coeff: 1, name: "Etilen" }
    ],
    products: [
      { formula: "(C₂H₄)n", coeff: 1, name: "Nhựa Polietilen" }
    ],
    equation: "nCH₂=CH₂ →(t°, p, xt) (-CH₂-CH₂-)n",
    gradeLevel: 12,
    category: "Polyme",
    conditions: "Nhiệt độ, áp suất cao, chất xúc tác",
    observation: "Khí Etilen kết hợp thành chất rắn dẻo, màu trắng đục.",
    energy: -90,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_122",
    name: "Phản ứng trùng hợp Styren (Tạo nhựa PS)",
    type: "combination",
    reactants: [
      { formula: "C₆H₅-CH=CH₂", coeff: 1, name: "Styren" }
    ],
    products: [
      { formula: "PS", coeff: 1, name: "Nhựa Polystyren" }
    ],
    equation: "nC₆H₅-CH=CH₂ →(t°, xt) (-CH(C₆H₅)-CH₂-)n",
    gradeLevel: 12,
    category: "Polyme",
    conditions: "Nhiệt độ, xúc tác",
    observation: "Chất lỏng chuyển thành chất rắn trong suốt, giòn.",
    energy: -70,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_123",
    name: "Anilin tác dụng với HCl",
    type: "combination",
    reactants: [
      { formula: "C₆H₅NH₂", coeff: 1, name: "Anilin" },
      { formula: "HCl", coeff: 1, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "C₆H₅NH₃Cl", coeff: 1, name: "Phenylamôni Clorua" }
    ],
    equation: "C₆H₅NH₂ + HCl → C₆H₅NH₃Cl",
    gradeLevel: 12,
    category: "Amin",
    conditions: "Nhiệt độ thường",
    observation: "Anilin (ít tan, vẩn đục) tan dần tạo dung dịch trong suốt.",
    energy: -60,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_124",
    name: "Phản ứng trùng hợp Vinyl Clorua (Tạo nhựa PVC)",
    type: "combination",
    reactants: [
      { formula: "C₂H₃Cl", coeff: 1, name: "Vinyl Clorua" }
    ],
    products: [
      { formula: "PVC", coeff: 1, name: "Nhựa PVC" }
    ],
    equation: "nCH₂=CHCl →(t°, p, xt) (-CH₂-CHCl-)n",
    gradeLevel: 12,
    category: "Polyme",
    conditions: "Áp suất, nhiệt độ, chất xúc tác",
    observation: "Tạo thành chất bột màu trắng, dùng làm ống nhựa.",
    energy: -100,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_125",
    name: "Phản ứng màu Biure của Protein",
    type: "combination",
    reactants: [
      { formula: "Protein", coeff: 1, name: "Lòng trắng trứng" },
      { formula: "Cu(OH)₂", coeff: 1, name: "Đồng(II) Hidroxit" }
    ],
    products: [
      { formula: "Protein-Cu", coeff: 1, name: "Hợp chất màu tím" }
    ],
    equation: "Protein + Cu(OH)₂ → Hợp chất phức màu tím đặc trưng",
    gradeLevel: 12,
    category: "Peptit - Protein",
    conditions: "Nhiệt độ thường, môi trường kiềm",
    observation: "Hòa tan kết tủa Cu(OH)₂ tạo dung dịch có màu tím đặc trưng.",
    energy: -10,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_126",
    name: "Nhận biết Ion Fe²⁺ bằng dung dịch kiềm",
    type: "double-replacement",
    reactants: [
      { formula: "FeCl₂", coeff: 1, name: "Sắt(II) Clorua" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Fe(OH)₂", coeff: 1, name: "Sắt(II) Hidroxit" },
      { formula: "NaCl", coeff: 2, name: "Natri Clorua" }
    ],
    equation: "FeCl₂ + 2NaOH → Fe(OH)₂↓ + 2NaCl",
    gradeLevel: 11,
    category: "Phân tích định tính",
    conditions: "Không có không khí",
    observation: "Xuất hiện kết tủa trắng xanh.",
    energy: -30,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_127",
    name: "Nhận biết Ion Fe³⁺ bằng dung dịch kiềm",
    type: "double-replacement",
    reactants: [
      { formula: "FeCl₃", coeff: 1, name: "Sắt(III) Clorua" },
      { formula: "NaOH", coeff: 3, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Fe(OH)₃", coeff: 1, name: "Sắt(III) Hidroxit" },
      { formula: "NaCl", coeff: 3, name: "Natri Clorua" }
    ],
    equation: "FeCl₃ + 3NaOH → Fe(OH)₃↓ + 3NaCl",
    gradeLevel: 11,
    category: "Phân tích định tính",
    conditions: "Nhiệt độ thường",
    observation: "Xuất hiện kết tủa màu nâu đỏ.",
    energy: -45,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_128",
    name: "Oxy hóa Sắt(II) Hidroxit trong không khí",
    type: "redox",
    reactants: [
      { formula: "Fe(OH)₂", coeff: 4, name: "Sắt(II) Hidroxit" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    products: [
      { formula: "Fe(OH)₃", coeff: 4, name: "Sắt(III) Hidroxit" }
    ],
    equation: "4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃",
    gradeLevel: 12,
    category: "Phân tích định tính",
    conditions: "Tiếp xúc không khí ẩm",
    observation: "Kết tủa trắng xanh nhanh chóng chuyển sang màu nâu đỏ.",
    energy: -280,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_129",
    name: "Nhận biết Ion Cu²⁺ bằng Amoniac (Dư NH₃)",
    type: "combination",
    reactants: [
      { formula: "CuSO₄", coeff: 1, name: "Đồng(II) Sunfat" },
      { formula: "NH₃", coeff: 4, name: "Amoniac" }
    ],
    products: [
      { formula: "[Cu(NH₃)₄]SO₄", coeff: 1, name: "Phức đồng-amoniac" }
    ],
    equation: "CuSO₄ + 4NH₃ → [Cu(NH₃)₄]SO₄",
    gradeLevel: 12,
    category: "Phân tích định tính",
    conditions: "Dung dịch NH₃ dư",
    observation: "Tạo kết tủa xanh, sau đó tan tạo dung dịch màu xanh lam thẫm đặc trưng.",
    energy: -120,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_130",
    name: "Nhận biết Ion Al³⁺ bằng dung dịch kiềm (Dư kiềm)",
    type: "redox",
    reactants: [
      { formula: "AlCl₃", coeff: 1, name: "Nhôm Clorua" },
      { formula: "NaOH", coeff: 4, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "NaAlO₂", coeff: 1, name: "Natri Aluminat" },
      { formula: "NaCl", coeff: 3, name: "Natri Clorua" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "AlCl₃ + 4NaOH → NaAlO₂ + 3NaCl + 2H₂O",
    gradeLevel: 12,
    category: "Phân tích định tính",
    conditions: "NaOH dư",
    observation: "Kết tủa trắng keo tan hoàn toàn trong kiềm dư.",
    energy: -150,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_131",
    name: "Sắt(III) Clorua tác dụng với KI",
    type: "redox",
    reactants: [
      { formula: "FeCl₃", coeff: 2, name: "Sắt(III) Clorua" },
      { formula: "KI", coeff: 2, name: "Kali Iotua" }
    ],
    products: [
      { formula: "FeCl₂", coeff: 2, name: "Sắt(II) Clorua" },
      { formula: "KCl", coeff: 2, name: "Kali Clorua" },
      { formula: "I₂", coeff: 1, name: "Iốt" }
    ],
    equation: "2FeCl₃ + 2KI → 2FeCl₂ + 2KCl + I₂",
    gradeLevel: 12,
    category: "Redox",
    conditions: "Nhiệt độ thường",
    observation: "Dung dịch chuyển từ vàng nâu sang màu đen tím của Iốt.",
    energy: -120,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_132",
    name: "Thủy phân Protein bằng Axit",
    type: "double-replacement",
    reactants: [
      { formula: "Protein", coeff: 1, name: "Protein" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "Gly", coeff: 2, name: "Amino Acid (Glyxin)" }
    ],
    equation: "Protein + nH₂O →(H⁺) n Amino Acid",
    gradeLevel: 12,
    category: "Protein",
    conditions: "Đun nóng lâu",
    observation: "Protein bị phân cắt thành các amino acid đơn giản.",
    energy: -5,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_133",
    name: "Lên men Axit Lactic (Từ Glucozơ)",
    type: "decomposition",
    reactants: [
      { formula: "C₆H₁₂O₆", coeff: 1, name: "Glucozơ" }
    ],
    products: [
      { formula: "CH₃CH(OH)COOH", coeff: 2, name: "Axit Lactic" }
    ],
    equation: "C₆H₁₂O₆ → 2CH₃CH(OH)COOH",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Vi khuẩn lactic",
    observation: "Tạo thành vị chua của sữa chua.",
    energy: -120,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_134",
    name: "Nhận biết Ion NH₄⁺ bằng kiềm",
    type: "double-replacement",
    reactants: [
      { formula: "NH₄Cl", coeff: 1, name: "Amôni Clorua" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "NH₃", coeff: 1, name: "Amoniac" },
      { formula: "NaCl", coeff: 1, name: "Natri Clorua" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "NH₄Cl + NaOH → NaCl + NH₃↑ + H₂O",
    gradeLevel: 11,
    category: "Phân tích định tính",
    conditions: "Đun nhẹ",
    observation: "Giải phóng khí mùi khai, làm xanh giấy quỳ tím ẩm.",
    energy: -20,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_135",
    name: "Axit Nitric đặc nóng tác dụng với S",
    type: "redox",
    reactants: [
      { formula: "S", coeff: 1, name: "Lưu huỳnh" },
      { formula: "HNO₃", coeff: 6, name: "Axit Nitric đặc" }
    ],
    products: [
      { formula: "H₂SO₄", coeff: 1, name: "Axit Sunfuric" },
      { formula: "NO₂", coeff: 6, name: "Nitơ Đioxit" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "S + 6HNO₃(đ) → H₂SO₄ + 6NO₂↑ + 2H₂O",
    gradeLevel: 11,
    category: "Nitơ",
    conditions: "Nhiệt độ cao",
    observation: "Giải phóng khí nâu đỏ NO₂.",
    energy: -380,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_136",
    name: "Phản ứng của NH₃ với khí Clo",
    type: "redox",
    reactants: [
      { formula: "NH₃", coeff: 2, name: "Amoniac" },
      { formula: "Cl₂", coeff: 3, name: "Khí Clo" }
    ],
    products: [
      { formula: "N₂", coeff: 1, name: "Khí Nitơ" },
      { formula: "HCl", coeff: 6, name: "Hydro Clo" }
    ],
    equation: "2NH₃ + 3Cl₂ → N₂ + 6HCl",
    gradeLevel: 11,
    category: "Nitơ",
    conditions: "Tự cháy trong khí Clo",
    observation: "Amoniac bùng cháy trong Clo, tạo khói trắng.",
    energy: -460,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_137",
    name: "Bạc clorua bị phân hủy bởi ánh sáng",
    type: "decomposition",
    reactants: [
      { formula: "AgCl", coeff: 2, name: "Bạc Clorua" }
    ],
    products: [
      { formula: "Ag", coeff: 2, name: "Bạc" },
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" }
    ],
    equation: "2AgCl → 2Ag + Cl₂↑",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Ánh sáng mặt trời",
    observation: "Kết tủa trắng chuyển sang màu xám đen của bạc.",
    energy: 127,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_138",
    name: "Phản ứng giữa SO₂ và H₂S (Tạo Lưu huỳnh vụn)",
    type: "redox",
    reactants: [
      { formula: "SO₂", coeff: 1, name: "Lưu huỳnh Đioxit" },
      { formula: "H₂S", coeff: 2, name: "Hydro Sunfua" }
    ],
    products: [
      { formula: "S", coeff: 3, name: "Lưu huỳnh" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "SO₂ + 2H₂S → 3S↓ + 2H₂O",
    gradeLevel: 10,
    category: "Lưu huỳnh",
    conditions: "Nhiệt độ thường",
    observation: "Xuất hiện lớp bột màu vàng bám trên thành ống nghiệm.",
    energy: -230,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_139",
    name: "Tính háo nước của H₂SO₄ đặc (Đường ăn)",
    type: "decomposition",
    reactants: [
      { formula: "C₁₂H₂₂O₁₁", coeff: 1, name: "Đường Saccarozơ" },
      { formula: "H₂SO₄", coeff: 1, name: "Axit Sunfuric đặc" }
    ],
    products: [
      { formula: "C", coeff: 12, name: "Cacbon" },
      { formula: "H₂O", coeff: 11, name: "Hơi nước" }
    ],
    equation: "C₁₂H₂₂O₁₁ → 12C + 11H₂O",
    gradeLevel: 10,
    category: "Lưu huỳnh",
    conditions: "Nhiệt độ thường",
    observation: "Đường hóa đen và trào lên khỏi cốc như cột than.",
    energy: -500,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_140",
    name: "Điều chế Khí Cacbonic trong Lab",
    type: "double-replacement",
    reactants: [
      { formula: "CaCO₃", coeff: 1, name: "Đá vôi" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "CaCl₂", coeff: 1, name: "Canxi Clorua" },
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O",
    gradeLevel: 9,
    category: "Cacbon",
    conditions: "Nhiệt độ thường",
    observation: "Đá vôi sủi bọt khí mạnh mẽ, tan dần.",
    energy: -20,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_141",
    name: "Sản xuất Gang (Khử Fe₂O₃ bằng CO)",
    type: "redox",
    reactants: [
      { formula: "Fe₂O₃", coeff: 1, name: "Oxit sắt(III)" },
      { formula: "CO", coeff: 3, name: "Cacbon Monoxit" }
    ],
    products: [
      { formula: "Fe", coeff: 2, name: "Sắt" },
      { formula: "CO₂", coeff: 3, name: "Khí Cacbonic" }
    ],
    equation: "Fe₂O₃ + 3CO → 2Fe + 3CO₂",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Oxit đỏ nâu chuyển thành chất rắn màu xám đen.",
    energy: -30,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_142",
    name: "Nhận biết hồ tinh bột bằng Iốt",
    type: "combination",
    reactants: [
      { formula: "Starch", coeff: 1, name: "Hồ tinh bột" },
      { formula: "I₂", coeff: 1, name: "Dung dịch Iốt" }
    ],
    products: [
      { formula: "Starch-I2", coeff: 1, name: "Phức màu xanh tím" }
    ],
    equation: "Tinh bột + I₂ → Hợp chất màu xanh tím",
    gradeLevel: 10,
    category: "Hữu cơ",
    conditions: "Nhiệt độ phòng",
    observation: "Dung dịch chuyển sang màu xanh tím đặc trưng ngay lập tức.",
    energy: -10,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_143",
    name: "Thủy phân Saccarozơ bằng Axit",
    type: "double-replacement",
    reactants: [
      { formula: "C₁₂H₂₂O₁₁", coeff: 1, name: "Saccarozơ" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "C₆H₁₂O₆", coeff: 2, name: "Glucozơ & Fructozơ" }
    ],
    equation: "C₁₂H₂₂O₁₁ + H₂O →(H⁺, t°) C₆H₁₂O₆ + C₆H₁₂O₆",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Đun nóng, xúc tác Axit",
    observation: "Saccarozơ bị thủy phân, tạo ra các đường đơn có tính khử.",
    energy: -10,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_144",
    name: "Anilin tác dụng với nước Brom (Nhận biết)",
    type: "double-replacement",
    reactants: [
      { formula: "C₆H₅NH₂", coeff: 1, name: "Anilin" },
      { formula: "Br₂", coeff: 3, name: "Nước Brom" }
    ],
    products: [
      { formula: "C₆H₂Br₃NH₂", coeff: 1, name: "2,4,6-Tribromanilin" }
    ],
    equation: "C₆H₅NH₂ + 3Br₂ → C₆H₂Br₃NH₂↓ + 3HBr",
    gradeLevel: 12,
    category: "Amin",
    conditions: "Nhiệt độ thường",
    observation: "Mất màu nước brom, xuất hiện kết tủa trắng.",
    energy: -120,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_145",
    name: "Nhận biết Ion Cl⁻ bằng Bạc Nitrat",
    type: "double-replacement",
    reactants: [
      { formula: "NaCl", coeff: 1, name: "Natri Clorua" },
      { formula: "AgNO₃", coeff: 1, name: "Bạc Nitrat" }
    ],
    products: [
      { formula: "AgCl", coeff: 1, name: "Bạc Clorua" },
      { formula: "NaNO₃", coeff: 1, name: "Natri Nitrat" }
    ],
    equation: "NaCl + AgNO₃ → AgCl↓ + NaNO₃",
    gradeLevel: 10,
    category: "Phân tích định tính",
    conditions: "Nhiệt độ thường",
    observation: "Xuất hiện kết tủa trắng vón cục, không tan trong axit.",
    energy: -65,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_146",
    name: "Nhận biết Ion SO₄²⁻ bằng Bari Clorua",
    type: "double-replacement",
    reactants: [
      { formula: "Na₂SO₄", coeff: 1, name: "Natri Sunfat" },
      { formula: "BaCl₂", coeff: 1, name: "Bari Clorua" }
    ],
    products: [
      { formula: "BaSO₄", coeff: 1, name: "Bari Sunfat" },
      { formula: "NaCl", coeff: 2, name: "Natri Clorua" }
    ],
    equation: "Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl",
    gradeLevel: 10,
    category: "Phân tích định tính",
    conditions: "Nhiệt độ thường",
    observation: "Xuất hiện kết tủa trắng, bền trong axit.",
    energy: -40,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_147",
    name: "Nhận biết Ion PO₄³⁻ bằng Bạc Nitrat",
    type: "double-replacement",
    reactants: [
      { formula: "Na₃PO₄", coeff: 1, name: "Natri Photphat" },
      { formula: "AgNO₃", coeff: 3, name: "Bạc Nitrat" }
    ],
    products: [
      { formula: "Ag₃PO₄", coeff: 1, name: "Bạc Photphat" },
      { formula: "NaNO₃", coeff: 3, name: "Natri Nitrat" }
    ],
    equation: "Na₃PO₄ + 3AgNO₃ → Ag₃PO₄↓ + 3NaNO₃",
    gradeLevel: 11,
    category: "Phân tích định tính",
    conditions: "Nhiệt độ thường",
    observation: "Xuất hiện kết tủa màu vàng tinh khiết.",
    energy: -150,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_148",
    name: "Nhôm tác dụng với Axit Nitric (Tạo khí N₂O)",
    type: "redox",
    reactants: [
      { formula: "Al", coeff: 8, name: "Nhôm" },
      { formula: "HNO₃", coeff: 30, name: "Axit Nitric loãng" }
    ],
    products: [
      { formula: "Al(NO₃)₃", coeff: 8, name: "Nhôm Nitrat" },
      { formula: "N₂O", coeff: 3, name: "Khí Cười" },
      { formula: "H₂O", coeff: 15, name: "Nước" }
    ],
    equation: "8Al + 30HNO₃ → 8Al(NO₃)₃ + 3N₂O + 15H₂O",
    gradeLevel: 12,
    category: "Redox",
    conditions: "Axit Nitric loãng",
    observation: "Nhôm tan, giải phóng bọt khí không màu.",
    energy: -4500,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_149",
    name: "Đốt cháy Magie trong hơi nước",
    type: "redox",
    reactants: [
      { formula: "Mg", coeff: 1, name: "Magiê" },
      { formula: "H₂O", coeff: 2, name: "Hơi nước" }
    ],
    products: [
      { formula: "Mg(OH)₂", coeff: 1, name: "Magiê Hidroxit" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "Mg + 2H₂O → Mg(OH)₂ + H₂↑",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Magiê cháy sáng trong hơi nước giải phóng Hydro.",
    energy: -350,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_150",
    name: "Nhôm tác dụng với Axit Nitric rất loãng (Tạo NH₄⁺)",
    type: "redox",
    reactants: [
      { formula: "Al", coeff: 8, name: "Nhôm" },
      { formula: "HNO₃", coeff: 30, name: "Axit Nitric rất loãng" }
    ],
    products: [
      { formula: "Al(NO₃)₃", coeff: 8, name: "Nhôm Nitrat" },
      { formula: "NH₄NO₃", coeff: 3, name: "Amôni Nitrat" },
      { formula: "H₂O", coeff: 9, name: "Nước" }
    ],
    equation: "8Al + 30HNO₃ → 8Al(NO₃)₃ + 3NH₄NO₃ + 9H₂O",
    gradeLevel: 12,
    category: "Redox",
    conditions: "Axit Nitric cực loãng",
    observation: "Nhôm tan nhưng không thấy bọt khí thoát ra.",
    energy: -5000,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_151",
    name: "Baking Soda tác dụng với Axit dạ dày",
    type: "double-replacement",
    reactants: [
      { formula: "NaHCO₃", coeff: 1, name: "Baking Soda" },
      { formula: "HCl", coeff: 1, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "NaCl", coeff: 1, name: "Muối" },
      { formula: "CO₂", coeff: 1, name: "Khí" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "NaHCO₃ + HCl → NaCl + H₂O + CO₂↑",
    gradeLevel: 9,
    category: "Ứng dụng",
    conditions: "Nhiệt độ thường",
    observation: "Sủi bọt khí mạnh (giúp giảm đầy hơi).",
    energy: -20,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_152",
    name: "Kết tủa Bari Sunfat do tác dụng của axit",
    type: "double-replacement",
    reactants: [
      { formula: "BaCl₂", coeff: 1, name: "Bari Clorua" },
      { formula: "H₂SO₄", coeff: 1, name: "Axit Sunfuric" }
    ],
    products: [
      { formula: "BaSO₄", coeff: 1, name: "Bari Sunfat" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    equation: "BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl",
    gradeLevel: 10,
    category: "Phân tích định tính",
    conditions: "Nhiệt độ thường",
    observation: "Kết tủa trắng mịn xuất hiện ngay lập tức.",
    energy: -45,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_153",
    name: "Natri Peroxit tác dụng với nước (Giải phóng Oxy)",
    type: "redox",
    reactants: [
      { formula: "Na₂O₂", coeff: 2, name: "Natri Peroxit" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    products: [
      { formula: "NaOH", coeff: 4, name: "Natri Hidroxit" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    equation: "2Na₂O₂ + 2H₂O → 4NaOH + O₂↑",
    gradeLevel: 12,
    category: "Kim loại kiềm",
    conditions: "Nhiệt độ thường",
    observation: "Sủi bọt khí Oxy mạnh mẽ, tỏa nhiệt.",
    energy: -200,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_154",
    name: "Đốt cháy Ma Trơi (Phosphine)",
    type: "redox",
    reactants: [
      { formula: "PH₃", coeff: 2, name: "Phosphine" },
      { formula: "O₂", coeff: 4, name: "Khí Oxy" }
    ],
    products: [
      { formula: "P₂O₅", coeff: 1, name: "Pentaoxit" },
      { formula: "H₂O", coeff: 3, name: "Hơi nước" }
    ],
    equation: "2PH₃ + 4O₂ → P₂O₅ + 3H₂O",
    gradeLevel: 11,
    category: "Nitơ - Photpho",
    conditions: "Tự cháy trong không khí",
    observation: "Khí tự cháy trong không khí tạo khói trắng, ánh sáng xanh mờ.",
    energy: -1200,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_155",
    name: "Luyện thép (Oxihóa Cacbon trong gang)",
    type: "redox",
    reactants: [
      { formula: "C", coeff: 1, name: "Cacbon" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" }
    ],
    equation: "C + O₂ → CO₂",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ cao (Lò oxy)",
    observation: "Hàm lượng cacbon giảm giúp gang chuyển thành thép.",
    energy: -393,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_156",
    name: "Nhận biết Ion Cu²⁺ bằng dung dịch kiềm",
    type: "double-replacement",
    reactants: [
      { formula: "CuSO₄", coeff: 1, name: "Đồng(II) Sunfat" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Cu(OH)₂", coeff: 1, name: "Đồng Hidroxit" },
      { formula: "Na₂SO₄", coeff: 1, name: "Natri Sunfat" }
    ],
    equation: "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄",
    gradeLevel: 11,
    category: "Phân tích định tính",
    conditions: "Nhiệt độ thường",
    observation: "Kết tủa xanh lơ dạng keo.",
    energy: -40,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_157",
    name: "Đun nóng Sét (Sản xuất gốm)",
    type: "decomposition",
    reactants: [
      { formula: "Clay", coeff: 1, name: "Sét" }
    ],
    products: [
      { formula: "Ceramic", coeff: 1, name: "Gốm sứ" }
    ],
    equation: "Sét (chưa nung) →(t°) Gốm sứ",
    gradeLevel: 11,
    category: "Silicat",
    conditions: "Nhiệt độ rất cao (~1000°C)",
    observation: "Nguyên liệu mềm dẻo biến thành vật liệu cứng, giòn.",
    energy: 100,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_158",
    name: "Phản ứng của Clo với dung dịch KI",
    type: "redox",
    reactants: [
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" },
      { formula: "KI", coeff: 2, name: "Kali Iotua" }
    ],
    products: [
      { formula: "KCl", coeff: 2, name: "Kali Clorua" },
      { formula: "I₂", coeff: 1, name: "Iốt" }
    ],
    equation: "Cl₂ + 2KI → 2KCl + I₂",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiệt độ thường",
    observation: "Dung dịch không màu chuyển sang màu nâu đặc trưng của Iốt.",
    energy: -150,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_159",
    name: "Nhận biết Ion Br⁻ bằng Bạc Nitrat",
    type: "double-replacement",
    reactants: [
      { formula: "NaBr", coeff: 1, name: "Natri Bromua" },
      { formula: "AgNO₃", coeff: 1, name: "Bạc Nitrat" }
    ],
    products: [
      { formula: "AgBr", coeff: 1, name: "Bạc Bromua" },
      { formula: "NaNO₃", coeff: 1, name: "Natri Nitrat" }
    ],
    equation: "NaBr + AgNO₃ → AgBr↓ + NaNO₃",
    gradeLevel: 10,
    category: "Phân tích định tính",
    conditions: "Nhiệt độ thường",
    observation: "Xuất hiện kết tủa màu vàng nhạt.",
    energy: -70,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_160",
    name: "Nhận biết Ion I⁻ bằng Bạc Nitrat",
    type: "double-replacement",
    reactants: [
      { formula: "NaI", coeff: 1, name: "Natri Iotua" },
      { formula: "AgNO₃", coeff: 1, name: "Bạc Nitrat" }
    ],
    products: [
      { formula: "AgI", coeff: 1, name: "Bạc Iotua" },
      { formula: "NaNO₃", coeff: 1, name: "Natri Nitrat" }
    ],
    equation: "NaI + AgNO₃ → AgI↓ + NaNO₃",
    gradeLevel: 10,
    category: "Phân tích định tính",
    conditions: "Nhiệt độ thường",
    observation: "Xuất hiện kết tủa màu vàng đậm.",
    energy: -80,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
];