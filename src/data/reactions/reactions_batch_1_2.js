export const reactionsBatch1_2 = [
  // --- BỔ SUNG KHỐI LƯỢNG LỚN (BATCH 1: LỚP 8-9) ---
  {
    id: "rx_018",
    name: "Đốt cháy Photpho",
    type: "combination",
    reactants: [
      { formula: "P", coeff: 4, name: "Photpho" },
      { formula: "O₂", coeff: 5, name: "Khí Oxy" }
    ],
    products: [
      { formula: "P₂O₅", coeff: 2, name: "Diphotpho Pentaoxit" }
    ],
    equation: "4P + 5O₂ →(t°) 2P₂O₅",
    gradeLevel: 8,
    category: "Phi kim",
    conditions: "Nhiệt độ cao",
    observation: "Photpho cháy mạnh với ngọn lửa sáng chói, tạo khói trắng dày đặc (P₂O₅).",
    energy: -3013,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_019",
    name: "Dẫn khí Hydro qua Đồng(II) Oxit",
    type: "single-replacement",
    reactants: [
      { formula: "CuO", coeff: 1, name: "Đồng(II) Oxit" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    products: [
      { formula: "Cu", coeff: 1, name: "Đồng" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "CuO + H₂ →(t°) Cu + H₂O",
    gradeLevel: 8,
    category: "Oxit",
    conditions: "Nhiệt độ cao",
    observation: "Bột CuO màu đen chuyển dần sang màu đỏ của kim loại Đồng (Cu). Có hơi nước thoát ra.",
    energy: -130,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_020",
    name: "Nhôm tác dụng với Axit Sunfuric loãng",
    type: "single-replacement",
    reactants: [
      { formula: "Al", coeff: 2, name: "Nhôm" },
      { formula: "H₂SO₄", coeff: 3, name: "Axit Sunfuric" }
    ],
    products: [
      { formula: "Al₂(SO₄)₃", coeff: 1, name: "Nhôm Sunfat" },
      { formula: "H₂", coeff: 3, name: "Khí Hydro" }
    ],
    equation: "2Al + 3H₂SO₄ → Al₂(SO₄)₃ + 3H₂↑",
    gradeLevel: 8,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Nhôm tan nhanh, bọt khí thoát ra rất mạnh.",
    energy: -500,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_021",
    name: "Hòa tan Canxi Oxit vào nước",
    type: "combination",
    reactants: [
      { formula: "CaO", coeff: 1, name: "Vôi sống" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "Ca(OH)₂", coeff: 1, name: "Canxi Hidroxit" }
    ],
    equation: "CaO + H₂O → Ca(OH)₂",
    gradeLevel: 9,
    category: "Oxit",
    conditions: "Phản ứng tỏa nhiệt mạnh",
    observation: "CaO rã ra thành bột trắng, nước nóng lên mạnh mẽ.",
    energy: -63.5,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_022",
    name: "Sắt tác dụng với Axit Clohidric",
    type: "single-replacement",
    reactants: [
      { formula: "Fe", coeff: 1, name: "Sắt" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "FeCl₂", coeff: 1, name: "Sắt(II) Clorua" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "Fe + 2HCl → FeCl₂ + H₂↑",
    gradeLevel: 8,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Đinh sắt tan dần, bọt khí không màu thoát ra, dung dịch chuyển sang màu xanh nhạt.",
    energy: -87.9,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_023",
    name: "Phản ứng giữa BaCl₂ và H₂SO₄",
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
    gradeLevel: 9,
    category: "Muối",
    conditions: "Nhiệt độ thường",
    observation: "Xuất hiện kết tủa trắng (BaSO₄) ngay lập tức.",
    energy: -30,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_024",
    name: "Nhiệt phân Axit Silicic",
    type: "decomposition",
    reactants: [
      { formula: "H₂SiO₃", coeff: 1, name: "Axit Silicic" }
    ],
    products: [
      { formula: "SiO₂", coeff: 1, name: "Silic Đioxit" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "H₂SiO₃ →(t°) SiO₂ + H₂O",
    gradeLevel: 11,
    category: "Axit",
    conditions: "Nhiệt độ cao",
    observation: "Chất rắn màu trắng phân hủy thành cát khô (SiO₂) và hơi nước.",
    energy: 40,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_025",
    name: "Hòa tan P₂O₅ vào nước",
    type: "combination",
    reactants: [
      { formula: "P₂O₅", coeff: 1, name: "Pentaoxit" },
      { formula: "H₂O", coeff: 3, name: "Nước" }
    ],
    products: [
      { formula: "H₃PO₄", coeff: 2, name: "Axit Photphoric" }
    ],
    equation: "P₂O₅ + 3H₂O → 2H₃PO₄",
    gradeLevel: 9,
    category: "Oxit",
    conditions: "Nhiệt độ thường",
    observation: "Bột P₂O₅ tan hoàn toàn trong nước tạo dung dịch axit.",
    energy: -120,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_026",
    name: "Đồng(II) Oxit tác dụng với HCl",
    type: "double-replacement",
    reactants: [
      { formula: "CuO", coeff: 1, name: "Đồng(II) Oxit" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "CuCl₂", coeff: 1, name: "Đồng(II) Clorua" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "CuO + 2HCl → CuCl₂ + H₂O",
    gradeLevel: 9,
    category: "Oxit",
    conditions: "Nhiệt độ thường",
    observation: "Bột CuO màu đen tan dần, tạo ra dung dịch có màu xanh lá cây hoặc xanh lam.",
    energy: -60,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_027",
    name: "Hòa tan Nhôm vào NaOH",
    type: "redox",
    reactants: [
      { formula: "Al", coeff: 2, name: "Nhôm" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    products: [
      { formula: "NaAlO₂", coeff: 2, name: "Natri Aluminat" },
      { formula: "H₂", coeff: 3, name: "Khí Hydro" }
    ],
    equation: "2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂↑",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Nhôm tan mạnh, giải phóng bọt khí hydro dồi dào.",
    energy: -850,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_028",
    name: "Nhiệt phân Đồng(II) Hidroxit",
    type: "decomposition",
    reactants: [
      { formula: "Cu(OH)₂", coeff: 1, name: "Đồng(II) Hidroxit" }
    ],
    products: [
      { formula: "CuO", coeff: 1, name: "Đồng(II) Oxit" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "Cu(OH)₂ →(t°) CuO + H₂O",
    gradeLevel: 9,
    category: "Bazơ",
    conditions: "Nhiệt độ cao",
    observation: "Kết tủa màu xanh lơ của Cu(OH)₂ chuyển dần thành chất rắn màu đen (CuO).",
    energy: 52,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_029",
    name: "Nhôm tác dụng với Clo",
    type: "combination",
    reactants: [
      { formula: "Al", coeff: 2, name: "Nhôm" },
      { formula: "Cl₂", coeff: 3, name: "Khí Clo" }
    ],
    products: [
      { formula: "AlCl₃", coeff: 2, name: "Nhôm Clorua" }
    ],
    equation: "2Al + 3Cl₂ →(t°) 2AlCl₃",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Nhôm cháy sáng trong khí Clo, tạo ra khói trắng (AlCl₃).",
    energy: -1400,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_030",
    name: "Phản ứng tạo AgCl",
    type: "double-replacement",
    reactants: [
      { formula: "AgNO₃", coeff: 1, name: "Bạc Nitrat" },
      { formula: "NaCl", coeff: 1, name: "Natri Clorua" }
    ],
    products: [
      { formula: "AgCl", coeff: 1, name: "Bạc Clorua" },
      { formula: "NaNO₃", coeff: 1, name: "Natri Nitrat" }
    ],
    equation: "AgNO₃ + NaCl → AgCl↓ + NaNO₃",
    gradeLevel: 9,
    category: "Muối",
    conditions: "Nhiệt độ thường",
    observation: "Xuất hiện kết tủa trắng vón cục (AgCl).",
    energy: -65.7,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_031",
    name: "Phản ứng tạo AgBr",
    type: "double-replacement",
    reactants: [
      { formula: "AgNO₃", coeff: 1, name: "Bạc Nitrat" },
      { formula: "NaBr", coeff: 1, name: "Natri Bromua" }
    ],
    products: [
      { formula: "AgBr", coeff: 1, name: "Bạc Bromua" },
      { formula: "NaNO₃", coeff: 1, name: "Natri Nitrat" }
    ],
    equation: "AgNO₃ + NaBr → AgBr↓ + NaNO₃",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiệt độ thường",
    observation: "Xuất hiện kết tủa màu vàng nhạt (AgBr).",
    energy: -84.2,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_032",
    name: "Phản ứng tạo AgI",
    type: "double-replacement",
    reactants: [
      { formula: "AgNO₃", coeff: 1, name: "Bạc Nitrat" },
      { formula: "NaI", coeff: 1, name: "Natri Iotua" }
    ],
    products: [
      { formula: "AgI", coeff: 1, name: "Bạc Iotua" },
      { formula: "NaNO₃", coeff: 1, name: "Natri Nitrat" }
    ],
    equation: "AgNO₃ + NaI → AgI↓ + NaNO₃",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiệt độ thường",
    observation: "Xuất hiện kết tủa màu vàng đậm (AgI).",
    energy: -112,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_033",
    name: "Đốt cháy Sắt trong Clo",
    type: "combination",
    reactants: [
      { formula: "Fe", coeff: 2, name: "Sắt" },
      { formula: "Cl₂", coeff: 3, name: "Khí Clo" }
    ],
    products: [
      { formula: "FeCl₃", coeff: 2, name: "Sắt(III) Clorua" }
    ],
    equation: "2Fe + 3Cl₂ →(t°) 2FeCl₃",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Sắt cháy sáng mạnh trong Clo, tạo ra khói màu nâu đỏ (FeCl₃).",
    energy: -800,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_034",
    name: "Phản ứng tạo CaCO₃ (Thổi CO₂ vào nước vôi trong)",
    type: "combination",
    reactants: [
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" },
      { formula: "Ca(OH)₂", coeff: 1, name: "Canxi Hidroxit" }
    ],
    products: [
      { formula: "CaCO₃", coeff: 1, name: "Đá vôi" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O",
    gradeLevel: 9,
    category: "Oxit",
    conditions: "Nhiệt độ thường",
    observation: "Nước vôi trong bị vẩn đục do sự hình thành kết tủa trắng CaCO₃.",
    energy: -113,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_035",
    name: "Natri tác dụng với Rượu Etylic",
    type: "single-replacement",
    reactants: [
      { formula: "C₂H₅OH", coeff: 2, name: "Rượu Etylic" },
      { formula: "Na", coeff: 2, name: "Natri" }
    ],
    products: [
      { formula: "C₂H₅ONa", coeff: 2, name: "Natri Etylat" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑",
    gradeLevel: 12,
    category: "Hữu cơ",
    conditions: "Nhiệt độ thường",
    observation: "Mảnh Natri tan dần, bọt khí thoát ra đều đặn.",
    energy: -200,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_206",
    name: "Lưu huỳnh cháy trong Oxy (Tạo SO₂)",
    type: "combination",
    reactants: [
      { formula: "S", coeff: 1, name: "Lưu huỳnh" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "SO₂", coeff: 1, name: "Lưu huỳnh Đioxit" }
    ],
    equation: "S + O₂ →(t°) SO₂",
    gradeLevel: 8,
    category: "Phi kim",
    conditions: "Đốt cháy",
    observation: "Lưu huỳnh cháy trong oxy với ngọn lửa xanh nhạt, tạo khí mùi hắc.",
    energy: -297,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 2,
    safetyWarning: "Khí SO₂ độc, phải thực hiện trong tủ hút.",
    isBlocked: false
  },
  {
    id: "rx_207",
    name: "SO₂ tác dụng với nước (Tạo H₂SO₃)",
    type: "combination",
    reactants: [
      { formula: "SO₂", coeff: 1, name: "Lưu huỳnh Đioxit" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "H₂SO₃", coeff: 1, name: "Axit Sunfurơ" }
    ],
    equation: "SO₂ + H₂O ⇌ H₂SO₃",
    gradeLevel: 9,
    category: "Axit",
    conditions: "Nhiệt độ thường",
    observation: "Khí SO₂ tan trong nước tạo dung dịch làm quỳ tím hóa đỏ.",
    energy: -20,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_208",
    name: "Magiê tác dụng với HCl",
    type: "single-replacement",
    reactants: [
      { formula: "Mg", coeff: 1, name: "Magiê" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "MgCl₂", coeff: 1, name: "Magiê Clorua" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "Mg + 2HCl → MgCl₂ + H₂↑",
    gradeLevel: 8,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Magiê tan rất nhanh, tỏa nhiệt và bọt khí thoát ra mãnh liệt.",
    energy: -467,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_209",
    name: "Đồng(II) Sunfat tác dụng với NaOH",
    type: "double-replacement",
    reactants: [
      { formula: "CuSO₄", coeff: 1, name: "Đồng(II) Sunfat" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Cu(OH)₂", coeff: 1, name: "Đồng(II) Hidroxit" },
      { formula: "Na₂SO₄", coeff: 1, name: "Natri Sunfat" }
    ],
    equation: "CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄",
    gradeLevel: 9,
    category: "Bazơ",
    conditions: "Nhiệt độ thường",
    observation: "Xuất hiện kết tủa xanh lơ (Cu(OH)₂) lắng xuống.",
    energy: -50,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },

  {
    id: "rx_036",
    name: "Natri tác dụng với Axit Axetic",
    type: "single-replacement",
    reactants: [
      { formula: "CH₃COOH", coeff: 2, name: "Axit Axetic" },
      { formula: "Na", coeff: 2, name: "Natri" }
    ],
    products: [
      { formula: "CH₃COONa", coeff: 2, name: "Natri Axetat" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "2CH₃COOH + 2Na → 2CH₃COONa + H₂↑",
    gradeLevel: 11,
    category: "Axit hữu cơ",
    conditions: "Nhiệt độ thường",
    observation: "Natri tan mạnh, giải phóng bọt khí hydro.",
    energy: -180,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_037",
    name: "Phản ứng Este hóa (Tổng hợp Etyl Axetat)",
    type: "combination",
    reactants: [
      { formula: "CH₃COOH", coeff: 1, name: "Axit Axetic" },
      { formula: "C₂H₅OH", coeff: 1, name: "Rượu Etylic" }
    ],
    products: [
      { formula: "CH₃COOC₂H₅", coeff: 1, name: "Etyl Axetat" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "CH₃COOH + C₂H₅OH ⇌(t°, H₂SO₄) CH₃COOC₂H₅ + H₂O",
    gradeLevel: 12,
    category: "Este",
    conditions: "Nhiệt độ cao, xúc tác H₂SO₄ đặc",
    observation: "Dung dịch có mùi thơm đặc trưng của táo hoặc chuối.",
    energy: 15,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_038",
    name: "Lên men Glucozơ",
    type: "decomposition",
    reactants: [
      { formula: "C₆H₁₂O₆", coeff: 1, name: "Glucozơ" }
    ],
    products: [
      { formula: "C₂H₅OH", coeff: 2, name: "Rượu Etylic" },
      { formula: "CO₂", coeff: 2, name: "Khí Cacbonic" }
    ],
    equation: "C₆H₁₂O₆ →(men) 2C₂H₅OH + 2CO₂↑",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Nhiệt độ 30-35°C, men rượu",
    observation: "Có bọt khí CO₂ thoát ra, dung dịch có mùi rượu.",
    energy: -70,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  // --- BỔ SUNG KHỐI LƯỢNG LỚN (BATCH 2: VÔ CƠ NÂNG CAO) ---
  {
    id: "rx_039",
    name: "Clo tác dụng với nước (Phản ứng thuận nghịch)",
    type: "redox",
    reactants: [
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "HCl", coeff: 1, name: "Axit Clohidric" },
      { formula: "HClO", coeff: 1, name: "Axit Hipoclorơ" }
    ],
    equation: "Cl₂ + H₂O ⇌ HCl + HClO",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiệt độ thường",
    observation: "Nước clo có màu vàng nhạt, mùi hắc. Dung dịch có tính tẩy màu.",
    energy: 25,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_040",
    name: "Điều chế nước Gia-ven",
    type: "redox",
    reactants: [
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "NaCl", coeff: 1, name: "Natri Clorua" },
      { formula: "NaClO", coeff: 1, name: "Natri Hipoclorit" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "Cl₂ + 2NaOH → NaCl + NaClO + H₂O",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiệt độ thường",
    observation: "Khí clo tan dần, tạo dung dịch không màu có tính tẩy màu mạnh.",
    energy: -110,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_041",
    name: "Clo tác dụng với Canxi Hidroxit (Tạo Clorua vôi)",
    type: "redox",
    reactants: [
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" },
      { formula: "Ca(OH)₂", coeff: 1, name: "Canxi Hidroxit" }
    ],
    products: [
      { formula: "CaOCl₂", coeff: 1, name: "Clorua vôi" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "Cl₂ + Ca(OH)₂ → CaOCl₂ + H₂O",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "30°C",
    observation: "Tạo thành chất bột màu trắng có mùi xốc của clo.",
    energy: -80,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_042",
    name: "Điều chế Clo trong phòng thí nghiệm (Sử dụng MnO₂)",
    type: "redox",
    reactants: [
      { formula: "MnO₂", coeff: 1, name: "Mangan Đioxit" },
      { formula: "HCl", coeff: 4, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "MnCl₂", coeff: 1, name: "Mangan(II) Clorua" },
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "MnO₂ + 4HCl →(t°) MnCl₂ + Cl₂↑ + 2H₂O",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiệt độ cao",
    observation: "Bột MnO₂ tan dần, giải phóng khí clo màu vàng lục, mùi xốc.",
    energy: 150,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_043",
    name: "Điều chế Clo trong phòng thí nghiệm (Sử dụng KMnO₄)",
    type: "redox",
    reactants: [
      { formula: "KMnO₄", coeff: 2, name: "Kali Pemanganat" },
      { formula: "HCl", coeff: 16, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "KCl", coeff: 2, name: "Kali Clorua" },
      { formula: "MnCl₂", coeff: 2, name: "Mangan(II) Clorua" },
      { formula: "Cl₂", coeff: 5, name: "Khí Clo" },
      { formula: "H₂O", coeff: 8, name: "Nước" }
    ],
    equation: "2KMnO₄ + 16HCl → 2KCl + 2MnCl₂ + 5Cl₂↑ + 8H₂O",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiệt độ thường",
    observation: "Thuốc tím tan nhanh, giải phóng khí Clo rất mạnh.",
    energy: -450,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_044",
    name: "Hòa tan SiO₂ trong HF (Ăn mòn thủy tinh)",
    type: "double-replacement",
    reactants: [
      { formula: "SiO₂", coeff: 1, name: "Thủy tinh" },
      { formula: "HF", coeff: 4, name: "Hydro Florua" }
    ],
    products: [
      { formula: "SiF₄", coeff: 1, name: "Silic Tetraflorua" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "SiO₂ + 4HF → SiF₄↑ + 2H₂O",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiệt độ thường",
    observation: "Thủy tinh bị ăn mòn, tạo thành khí SiF₄.",
    energy: -190,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_045",
    name: "Đốt cháy Lưu huỳnh trong Oxy",
    type: "combination",
    reactants: [
      { formula: "S", coeff: 1, name: "Lưu huỳnh" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "SO₂", coeff: 1, name: "Lưu huỳnh Đioxit" }
    ],
    equation: "S + O₂ →(t°) SO₂",
    gradeLevel: 10,
    category: "Oxi - Lưu huỳnh",
    conditions: "Nhiệt độ cao",
    observation: "Lưu huỳnh cháy trong oxy với ngọn lửa xanh lam nhạt, tạo khí mùi hắc.",
    energy: -297,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_046",
    name: "Tổng hợp SO₃ (Xúc tác V₂O₅)",
    type: "combination",
    reactants: [
      { formula: "SO₂", coeff: 2, name: "Lưu huỳnh Đioxit" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "SO₃", coeff: 2, name: "Lưu huỳnh Trioxit" }
    ],
    equation: "2SO₂ + O₂ ⇌(t°, V₂O₅) 2SO₃",
    gradeLevel: 10,
    category: "Oxi - Lưu huỳnh",
    conditions: "450°C, xúc tác V₂O₅",
    observation: "Khí SO₂ phản ứng tạo thành khói SO₃ dễ ngưng tụ.",
    energy: -198,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_047",
    name: "Axit Sunfuric đặc tác dụng với Đồng",
    type: "redox",
    reactants: [
      { formula: "Cu", coeff: 1, name: "Đồng" },
      { formula: "H₂SO₄", coeff: 2, name: "Axit Sunfuric" }
    ],
    products: [
      { formula: "CuSO₄", coeff: 1, name: "Đồng(II) Sunfat" },
      { formula: "SO₂", coeff: 1, name: "Lưu huỳnh Đioxit" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "Cu + 2H₂SO₄(đ) → CuSO₄ + SO₂↑ + 2H₂O",
    gradeLevel: 10,
    category: "Oxi - Lưu huỳnh",
    conditions: "Nhiệt độ cao, H₂SO₄ đặc",
    observation: "Đồng tan dần, dung dịch chuyển sang màu xanh lam, có khí mùi hắc thoát ra.",
    energy: -120,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_048",
    name: "Axit Sunfuric đặc tác dụng với Cacbon",
    type: "redox",
    reactants: [
      { formula: "C", coeff: 1, name: "Than graphite" },
      { formula: "H₂SO₄", coeff: 2, name: "Axit Sunfuric" }
    ],
    products: [
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" },
      { formula: "SO₂", coeff: 2, name: "Lưu huỳnh Đioxit" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "C + 2H₂SO₄(đ) → CO₂↑ + 2SO₂↑ + 2H₂O",
    gradeLevel: 10,
    category: "Oxi - Lưu huỳnh",
    conditions: "Nhiệt độ cao, H₂SO₄ đặc",
    observation: "Than tan dần, giải phóng hỗn hợp khí.",
    energy: -150,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_049",
    name: "Phản ứng của H₂S với Oxy (Thiếu oxy)",
    type: "redox",
    reactants: [
      { formula: "H₂S", coeff: 2, name: "Hydro Sunfua" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "S", coeff: 2, name: "Lưu huỳnh" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "2H₂S + O₂ → 2S + 2H₂O",
    gradeLevel: 10,
    category: "Oxi - Lưu huỳnh",
    conditions: "Nhiệt độ thấp, thiếu oxy",
    observation: "Tạo thành chất rắn màu vàng (Lưu huỳnh) bám trên thành bình.",
    energy: -200,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_050",
    name: "Phản ứng của H₂S với Oxy (Dư oxy)",
    type: "redox",
    reactants: [
      { formula: "H₂S", coeff: 2, name: "Hydro Sunfua" },
      { formula: "O₂", coeff: 3, name: "Khí Oxy" }
    ],
    products: [
      { formula: "SO₂", coeff: 2, name: "Lưu huỳnh Đioxit" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "2H₂S + 3O₂ → 2SO₂ + 2H₂O",
    gradeLevel: 10,
    category: "Oxi - Lưu huỳnh",
    conditions: "Đốt cháy",
    observation: "Khí H₂S cháy tạo thành khí mùi hắc SO₂.",
    energy: -1037,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_051",
    name: "Điều chế Amoniac từ NH₄Cl",
    type: "double-replacement",
    reactants: [
      { formula: "NH₄Cl", coeff: 2, name: "Amôni Clorua" },
      { formula: "Ca(OH)₂", coeff: 1, name: "Canxi Hidroxit" }
    ],
    products: [
      { formula: "CaCl₂", coeff: 1, name: "Canxi Clorua" },
      { formula: "NH₃", coeff: 2, name: "Amoniac" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "2NH₄Cl + Ca(OH)₂ → CaCl₂ + 2NH₃↑ + 2H₂O",
    gradeLevel: 11,
    category: "Nitơ - Photpho",
    conditions: "Nhiệt độ cao",
    observation: "Giải phóng khí Amoniac có mùi khai đặc trưng.",
    energy: 95,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_052",
    name: "Axit Nitric loãng tác dụng với Đồng",
    type: "redox",
    reactants: [
      { formula: "Cu", coeff: 3, name: "Đồng" },
      { formula: "HNO₃", coeff: 8, name: "Axit Nitric" }
    ],
    products: [
      { formula: "Cu(NO₃)₂", coeff: 3, name: "Đồng(II) Nitrat" },
      { formula: "NO", coeff: 2, name: "Nitơ Oxit" },
      { formula: "H₂O", coeff: 4, name: "Nước" }
    ],
    equation: "3Cu + 8HNO₃(l) → 3Cu(NO₃)₂ + 2NO↑ + 4H₂O",
    gradeLevel: 11,
    category: "Nitơ - Photpho",
    conditions: "Nhiệt độ thường",
    observation: "Đồng tan, tạo dung dịch xanh lam và khí không màu NO (hóa nâu trong không khí).",
    energy: -200,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_053",
    name: "Axit Nitric đặc tác dụng với Đồng",
    type: "redox",
    reactants: [
      { formula: "Cu", coeff: 1, name: "Đồng" },
      { formula: "HNO₃", coeff: 4, name: "Axit Nitric" }
    ],
    products: [
      { formula: "Cu(NO₃)₂", coeff: 1, name: "Đồng(II) Nitrat" },
      { formula: "NO₂", coeff: 2, name: "Nitơ Đioxit" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "Cu + 4HNO₃(đ) → Cu(NO₃)₂ + 2NO₂↑ + 2H₂O",
    gradeLevel: 11,
    category: "Nitơ - Photpho",
    conditions: "Nhiệt độ thường",
    observation: "Đồng tan nhanh, tạo dung dịch xanh lam và khí NO₂ màu nâu đỏ.",
    energy: -150,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_054",
    name: "Đốt cháy Photpho trong Oxy",
    type: "combination",
    reactants: [
      { formula: "P", coeff: 4, name: "Photpho" },
      { formula: "O₂", coeff: 5, name: "Khí Oxy" }
    ],
    products: [
      { formula: "P₂O₅", coeff: 2, name: "Diphotpho Pentaoxit" }
    ],
    equation: "4P + 5O₂ →(t°) 2P₂O₅",
    gradeLevel: 11,
    category: "Nitơ - Photpho",
    conditions: "Nhiệt độ cao",
    observation: "Photpho cháy mạnh với ngọn lửa sáng chói, tạo khói trắng P₂O₅.",
    energy: -3013,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_055",
    name: "Hòa tan P₂O₅ trong nước",
    type: "combination",
    reactants: [
      { formula: "P₂O₅", coeff: 1, name: "Diphotpho Pentaoxit" },
      { formula: "H₂O", coeff: 3, name: "Nước" }
    ],
    products: [
      { formula: "H₃PO₄", coeff: 2, name: "Axit Photphoric" }
    ],
    equation: "P₂O₅ + 3H₂O → 2H₃PO₄",
    gradeLevel: 11,
    category: "Nitơ - Photpho",
    conditions: "Nhiệt độ thường",
    observation: "Chất rắn trắng tan hoàn toàn tạo dung dịch Axit Photphoric.",
    energy: -120,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_056",
    name: "Hòa tan Al trong dung dịch kiềm nóng",
    type: "redox",
    reactants: [
      { formula: "Al", coeff: 2, name: "Nhôm" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    products: [
      { formula: "NaAlO₂", coeff: 2, name: "Natri Aluminat" },
      { formula: "H₂", coeff: 3, name: "Khí Hydro" }
    ],
    equation: "2Al + 2NaOH + 2H₂O → 2NaAlO₂ + 3H₂↑",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Nhôm tan mạnh, giải phóng bọt khí hydro.",
    energy: -850,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_057",
    name: "Phản ứng nhiệt nhôm với Fe₂O₃",
    type: "redox",
    reactants: [
      { formula: "Al", coeff: 2, name: "Nhôm" },
      { formula: "Fe₂O₃", coeff: 1, name: "Oxit sắt(III)" }
    ],
    products: [
      { formula: "Al₂O₃", coeff: 1, name: "Nhôm Oxit" },
      { formula: "Fe", coeff: 2, name: "Sắt" }
    ],
    equation: "2Al + Fe₂O₃ →(t°) Al₂O₃ + 2Fe",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ rất cao",
    observation: "Phản ứng tỏa nhiệt cực mạnh, sắt tạo thành nóng chảy.",
    energy: -851,
    animation: "explosion",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_058",
    name: "Điều chế NaOH bằng điện phân (có màng ngăn)",
    type: "redox",
    reactants: [
      { formula: "NaCl", coeff: 2, name: "Natri Clorua" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    products: [
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" },
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "2NaCl + 2H₂O →(đpmn) 2NaOH + Cl₂↑ + H₂↑",
    gradeLevel: 12,
    category: "Kim loại kiềm",
    conditions: "Điện phân có màng ngăn",
    observation: "Giải phóng khí Clo ở anốt và khí Hydro ở catốt.",
    energy: 400,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_059",
    name: "Natri cháy trong không khí (Tạo Natri Peroxit)",
    type: "combination",
    reactants: [
      { formula: "Na", coeff: 2, name: "Natri" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "Na₂O₂", coeff: 1, name: "Natri Peroxit" }
    ],
    equation: "2Na + O₂ →(t°) Na₂O₂",
    gradeLevel: 12,
    category: "Kim loại kiềm",
    conditions: "Nhiệt độ cao",
    observation: "Natri cháy với ngọn lửa vàng, tạo chất rắn màu vàng nhạt.",
    energy: -510,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_060",
    name: "Hòa tan Na₂O vào nước",
    type: "combination",
    reactants: [
      { formula: "Na₂O", coeff: 1, name: "Natri Oxit" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" }
    ],
    equation: "Na₂O + H₂O → 2NaOH",
    gradeLevel: 12,
    category: "Kim loại kiềm",
    conditions: "Nhiệt độ thường",
    observation: "Oxit tan hoàn toàn tỏa nhiều nhiệt.",
    energy: -238,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_061",
    name: "Nhiệt phân Natri Bicacbonat",
    type: "decomposition",
    reactants: [
      { formula: "NaHCO₃", coeff: 2, name: "Natri Bicacbonat" }
    ],
    products: [
      { formula: "Na₂CO₃", coeff: 1, name: "Natri Cacbonat" },
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "2NaHCO₃ →(t°) Na₂CO₃ + CO₂↑ + H₂O",
    gradeLevel: 12,
    category: "Kim loại kiềm",
    conditions: "Nhiệt độ cao",
    observation: "Sủi bọt khí CO₂, chất rắn chuyển thành đá xoda.",
    energy: 135,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_062",
    name: "Magiê cháy trong không khí",
    type: "combination",
    reactants: [
      { formula: "Mg", coeff: 2, name: "Magiê" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "MgO", coeff: 2, name: "Magiê Oxit" }
    ],
    equation: "2Mg + O₂ →(t°) 2MgO",
    gradeLevel: 12,
    category: "Kim loại kiềm thổ",
    conditions: "Đốt cháy",
    observation: "Magiê cháy với ngọn lửa trắng chói, tỏa nhiều nhiệt và ánh sáng.",
    energy: -1202,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_063",
    name: "Canxi Oxit tác dụng với nước (Tôi vôi)",
    type: "combination",
    reactants: [
      { formula: "CaO", coeff: 1, name: "Vôi sống" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "Ca(OH)₂", coeff: 1, name: "Canxi Hidroxit" }
    ],
    equation: "CaO + H₂O → Ca(OH)₂",
    gradeLevel: 12,
    category: "Kim loại kiềm thổ",
    conditions: "Nhiệt độ thường",
    observation: "Vôi sống tan và tỏa nhiệt mạnh.",
    energy: -65,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_064",
    name: "Hòa tan CaCO₃ bằng CO₂ dư",
    type: "combination",
    reactants: [
      { formula: "CaCO₃", coeff: 1, name: "Đá vôi" },
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "Ca(HCO₃)₂", coeff: 1, name: "Canxi Bicacbonat" }
    ],
    equation: "CaCO₃ + CO₂ + H₂O ⇌ Ca(HCO₃)₂",
    gradeLevel: 12,
    category: "Kim loại kiềm thổ",
    conditions: "Nhiệt độ thường",
    observation: "Kết tủa trắng đá vôi tan dần tạo dung dịch trong suốt.",
    energy: -40,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_065",
    name: "Nhiệt phân Canxi Bicacbonat (Tạo thạch nhũ)",
    type: "decomposition",
    reactants: [
      { formula: "Ca(HCO₃)₂", coeff: 1, name: "Canxi Bicacbonat" }
    ],
    products: [
      { formula: "CaCO₃", coeff: 1, name: "Đá vôi" },
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "Ca(HCO₃)₂ →(t°) CaCO₃↓ + CO₂↑ + H₂O",
    gradeLevel: 12,
    category: "Kim loại kiềm thổ",
    conditions: "Đun nóng",
    observation: "Dung dịch trong suốt xuất hiện kết tủa trắng và sủi bọt khí.",
    energy: 40,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_066",
    name: "Nhôm tác dụng với Oxy (Đốt bột nhôm)",
    type: "combination",
    reactants: [
      { formula: "Al", coeff: 4, name: "Nhôm" },
      { formula: "O₂", coeff: 3, name: "Khí Oxy" }
    ],
    products: [
      { formula: "Al₂O₃", coeff: 2, name: "Nhôm Oxit" }
    ],
    equation: "4Al + 3O₂ →(t°) 2Al₂O₃",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Bột nhôm cháy sáng mãnh liệt, tỏa nhiều nhiệt.",
    energy: -3352,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_067",
    name: "Hòa tan Al₂O₃ bằng Axit",
    type: "double-replacement",
    reactants: [
      { formula: "Al₂O₃", coeff: 1, name: "Nhôm Oxit" },
      { formula: "HCl", coeff: 6, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "AlCl₃", coeff: 2, name: "Nhôm Clorua" },
      { formula: "H₂O", coeff: 3, name: "Nước" }
    ],
    equation: "Al₂O₃ + 6HCl → 2AlCl₃ + 3H₂O",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Bột trắng tan hoàn toàn tạo dung dịch trong suốt.",
    energy: -300,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_068",
    name: "Hòa tan Al₂O₃ bằng Kiềm",
    type: "redox",
    reactants: [
      { formula: "Al₂O₃", coeff: 1, name: "Nhôm Oxit" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" },
      { formula: "H₂O", coeff: 3, name: "Nước" }
    ],
    products: [
      { formula: "NaAlO₂", coeff: 2, name: "Natri Aluminat" },
      { formula: "H₂O", coeff: 0, name: "" }
    ],
    equation: "Al₂O₃ + 2NaOH + 3H₂O → 2Na[Al(OH)₄]",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Nhôm oxit tan trong dung dịch kiềm nóng.",
    energy: -200,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_069",
    name: "Sắt tác dụng với H₂SO₄ loãng",
    type: "single-replacement",
    reactants: [
      { formula: "Fe", coeff: 1, name: "Sắt" },
      { formula: "H₂SO₄", coeff: 1, name: "Axit Sunfuric loãng" }
    ],
    products: [
      { formula: "FeSO₄", coeff: 1, name: "Sắt(II) Sunfat" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "Fe + H₂SO₄ → FeSO₄ + H₂↑",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Sắt tan dần, sủi bọt khí hydro, dung dịch xanh nhạt.",
    energy: -85,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_070",
    name: "Sắt tác dụng với H₂SO₄ đặc nóng",
    type: "redox",
    reactants: [
      { formula: "Fe", coeff: 2, name: "Sắt" },
      { formula: "H₂SO₄", coeff: 6, name: "Axit Sunfuric đặc" }
    ],
    products: [
      { formula: "Fe₂(SO₄)₃", coeff: 1, name: "Sắt(III) Sunfat" },
      { formula: "SO₂", coeff: 3, name: "Lưu huỳnh Đioxit" },
      { formula: "H₂O", coeff: 6, name: "Nước" }
    ],
    equation: "2Fe + 6H₂SO₄(đ) → Fe₂(SO₄)₃ + 3SO₂↑ + 6H₂O",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Sắt tan nhanh, giải phóng khí SO₂ mùi hắc, dung dịch màu vàng nâu.",
    energy: -450,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_071",
    name: "Đốt cháy Sắt trong Oxy",
    type: "combination",
    reactants: [
      { formula: "Fe", coeff: 3, name: "Sắt" },
      { formula: "O₂", coeff: 2, name: "Khí Oxy" }
    ],
    products: [
      { formula: "Fe₃O₄", coeff: 1, name: "Oxit sắt từ" }
    ],
    equation: "3Fe + 2O₂ →(t°) Fe₃O₄",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Dây sắt cháy sáng chói, tóe ra các tia lửa sáng.",
    energy: -1118,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_072",
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
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Hỗn hợp cháy sáng, tạo chất rắn màu xám đen.",
    energy: -100,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_073",
    name: "Oxihóa Sắt(II) thành Sắt(III) bằng Clo",
    type: "redox",
    reactants: [
      { formula: "FeCl₂", coeff: 2, name: "Sắt(II) Clorua" },
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" }
    ],
    products: [
      { formula: "FeCl₃", coeff: 2, name: "Sắt(III) Clorua" }
    ],
    equation: "2FeCl₂ + Cl₂ → 2FeCl₃",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Dung dịch xanh nhạt chuyển sang màu vàng nâu.",
    energy: -170,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_074",
    name: "Khử Sắt(III) Oxit bằng CO (Luyện kim)",
    type: "redox",
    reactants: [
      { formula: "Fe₂O₃", coeff: 1, name: "Oxit sắt(III)" },
      { formula: "CO", coeff: 3, name: "Khí Oxit Cacbon" }
    ],
    products: [
      { formula: "Fe", coeff: 2, name: "Sắt" },
      { formula: "CO₂", coeff: 3, name: "Khí Cacbonic" }
    ],
    equation: "Fe₂O₃ + 3CO →(t°) 2Fe + 3CO₂",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ rất cao",
    observation: "Oxit màu đỏ nâu chuyển sang màu xám của kim loại sắt.",
    energy: -28,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
];