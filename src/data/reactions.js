// Cơ sở dữ liệu phản ứng hóa học phổ thông (Lớp 8-12)
// Đồng bộ từ cơ sở dữ liệu dự án KL
// Bổ sung: Năng lượng phản ứng, hiệu ứng hoạt ảnh, điều kiện mở khóa và phần thưởng

export const reactions = [
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
  // --- BỔ SUNG KHỐI LƯỢNG LỚN (BATCH 5: CÔNG NGHIỆP & MÔI TRƯỜNG & NÂNG CAO) ---
  {
    id: "rx_161",
    name: "Sản xuất SO₂ từ quặng Pirit sắt",
    type: "redox",
    reactants: [
      { formula: "FeS₂", coeff: 4, name: "Pirit sắt" },
      { formula: "O₂", coeff: 11, name: "Khí Oxy" }
    ],
    products: [
      { formula: "Fe₂O₃", coeff: 2, name: "Oxit sắt(III)" },
      { formula: "SO₂", coeff: 8, name: "Lưu huỳnh Đioxit" }
    ],
    equation: "4FeS₂ + 11O₂ →(t°) 2Fe₂O₃ + 8SO₂",
    gradeLevel: 10,
    category: "Công nghiệp",
    conditions: "Nhiệt độ cao",
    observation: "Quặng cháy mạnh, giải phóng khí mùi hắc SO₂.",
    energy: -3400,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_162",
    name: "Oxy hóa SO₂ (Xúc tác V₂O₅)",
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
    category: "Công nghiệp",
    conditions: "450°C, xúc tác V₂O₅",
    observation: "Chuyển hóa khí SO₂ thành SO₃ trong tháp tiếp xúc.",
    energy: -198,
    animation: "synthesis",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_163",
    name: "Hòa tan SO₃ vào nước (Tạo H₂SO₄)",
    type: "combination",
    reactants: [
      { formula: "SO₃", coeff: 1, name: "Lưu huỳnh Trioxit" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "H₂SO₄", coeff: 1, name: "Axit Sunfuric" }
    ],
    equation: "SO₃ + H₂O → H₂SO₄",
    gradeLevel: 10,
    category: "Công nghiệp",
    conditions: "Nhiệt độ thường",
    observation: "Phản ứng tỏa nhiệt cực mạnh, tạo sương mù axit.",
    energy: -130,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_164",
    name: "Sản xuất NO từ Amoniac (Oxy hóa NH₃)",
    type: "redox",
    reactants: [
      { formula: "NH₃", coeff: 4, name: "Amoniac" },
      { formula: "O₂", coeff: 5, name: "Khí Oxy" }
    ],
    products: [
      { formula: "NO", coeff: 4, name: "Nitơ Oxit" },
      { formula: "H₂O", coeff: 6, name: "Nước" }
    ],
    equation: "4NH₃ + 5O₂ →(t°, Pt) 4NO + 6H₂O",
    gradeLevel: 11,
    category: "Công nghiệp",
    conditions: "850°C, xúc tác Bạch kim (Pt)",
    observation: "Khí Amoniac cháy trên bề mặt lưới bạch kim sáng rực.",
    energy: -905,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_165",
    name: "Oxy hóa NO thành NO₂ (Tự nhiên)",
    type: "combination",
    reactants: [
      { formula: "NO", coeff: 2, name: "Nitơ Oxit" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "NO₂", coeff: 2, name: "Nitơ Đioxit" }
    ],
    equation: "2NO + O₂ → 2NO₂",
    gradeLevel: 11,
    category: "Môi trường",
    conditions: "Nhiệt độ thường",
    observation: "Khí không màu NO hóa nâu ngay lập tức khi tiếp xúc không khí.",
    energy: -114,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_166",
    name: "Sản xuất HNO₃ trong công nghiệp",
    type: "redox",
    reactants: [
      { formula: "NO₂", coeff: 4, name: "Nitơ Đioxit" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    products: [
      { formula: "HNO₃", coeff: 4, name: "Axit Nitric" }
    ],
    equation: "4NO₂ + O₂ + 2H₂O → 4HNO₃",
    gradeLevel: 11,
    category: "Công nghiệp",
    conditions: "Hấp thụ bằng nước",
    observation: "Khí nâu đỏ bị hấp thụ tạo thành dung dịch axit không màu.",
    energy: -250,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_167",
    name: "Phản ứng nhiệt nhôm (Wholer)",
    type: "redox",
    reactants: [
      { formula: "Al", coeff: 2, name: "Nhôm" },
      { formula: "Fe₂O₃", coeff: 1, name: "Oxit sắt(III)" }
    ],
    products: [
      { formula: "Al₂O₃", coeff: 1, name: "Nhôm Oxit" },
      { formula: "Fe", coeff: 2, name: "Sắt nóng chảy" }
    ],
    equation: "2Al + Fe₂O₃ →(t°) Al₂O₃ + 2Fe",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Mồi bằng Mg hoặc nhiệt độ rất cao",
    observation: "Phản ứng cháy sáng chói như pháo hoa, sắt nóng chảy chảy ra.",
    energy: -850,
    animation: "explosion",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_168",
    name: "Điều chế Khí Clo trong phòng thí nghiệm",
    type: "redox",
    reactants: [
      { formula: "MnO₂", coeff: 1, name: "Mangan Đioxit" },
      { formula: "HCl", coeff: 4, name: "Axit Clohidric đặc" }
    ],
    products: [
      { formula: "MnCl₂", coeff: 1, name: "Mangan(II) Clorua" },
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "MnO₂ + 4HCl(đ) →(t°) MnCl₂ + Cl₂↑ + 2H₂O",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Đun nóng",
    observation: "Chất rắn màu đen tan dần, giải phóng khí màu vàng lục, mùi hắc.",
    energy: -30,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_169",
    name: "Natri Nitrat phân hủy nhiệt (Tạo Oxy)",
    type: "decomposition",
    reactants: [
      { formula: "NaNO₃", coeff: 2, name: "Natri Nitrat" }
    ],
    products: [
      { formula: "NaNO₂", coeff: 2, name: "Natri Nitrit" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    equation: "2NaNO₃ →(t°) 2NaNO₂ + O₂↑",
    gradeLevel: 11,
    category: "Muối",
    conditions: "Nhiệt độ cao",
    observation: "Muối lỏng ra, bọt khí Oxy thoát ra mạnh.",
    energy: 100,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_170",
    name: "Cacbon khử nước (Sản xuất khí than ướt)",
    type: "redox",
    reactants: [
      { formula: "C", coeff: 1, name: "Than đỏ" },
      { formula: "H₂O", coeff: 1, name: "Hơi nước" }
    ],
    products: [
      { formula: "CO", coeff: 1, name: "Cacbon Monoxit" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "C + H₂O ⇌(t°) CO + H₂",
    gradeLevel: 11,
    category: "Cacbon",
    conditions: "Than nóng đỏ (~1000°C)",
    observation: "Sản xuất hỗn hợp khí đốt quan trọng trong công nghiệp.",
    energy: 131,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_171",
    name: "Sắt tác dụng với nước (Nhiệt độ cao)",
    type: "redox",
    reactants: [
      { formula: "Fe", coeff: 3, name: "Sắt" },
      { formula: "H₂O", coeff: 4, name: "Hơi nước" }
    ],
    products: [
      { formula: "Fe₃O₄", coeff: 1, name: "Oxit sắt từ" },
      { formula: "H₂", coeff: 4, name: "Khí Hydro" }
    ],
    equation: "3Fe + 4H₂O →(t° < 570°C) Fe₃O₄ + 4H₂↑",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ dưới 570°C",
    observation: "Sắt bị oxy hóa bởi hơi nước giải phóng Hydro.",
    energy: -150,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_172",
    name: "Nhôm tác dụng với Iốt (Xúc tác nước)",
    type: "combination",
    reactants: [
      { formula: "Al", coeff: 2, name: "Nhôm" },
      { formula: "I₂", coeff: 3, name: "Iốt" }
    ],
    products: [
      { formula: "AlI₃", coeff: 2, name: "Nhôm Iotua" }
    ],
    equation: "2Al + 3I₂ →(H₂O) 2AlI₃",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Vài giọt nước làm xúc tác",
    observation: "Phản ứng bùng cháy mãnh liệt, tỏa khói tím của Iốt thăng hoa.",
    energy: -600,
    animation: "explosion",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_173",
    name: "Thủy phân Saccarozơ (Ứng dụng tráng gương)",
    type: "double-replacement",
    reactants: [
      { formula: "C₁₂H₂₂O₁₁", coeff: 1, name: "Saccarozơ" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "C₆H₁₂O₆", coeff: 1, name: "Glucozơ" },
      { formula: "C₆H₁₂O₆", coeff: 1, name: "Fructozơ" }
    ],
    equation: "C₁₂H₂₂O₁₁ + H₂O →(H⁺, t°) Glucozơ + Fructozơ",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Axit, nhiệt độ",
    observation: "Chuyển đường không khử thành hỗn hợp đường có tính khử.",
    energy: -15,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_174",
    name: "Phản ứng cháy của Photphin (Ma trơi)",
    type: "redox",
    reactants: [
      { formula: "PH₃", coeff: 2, name: "Photphin" },
      { formula: "O₂", coeff: 4, name: "Khí Oxy" }
    ],
    products: [
      { formula: "P₂O₅", coeff: 1, name: "Diphotpho Pentaoxit" },
      { formula: "H₂O", coeff: 3, name: "Nước" }
    ],
    equation: "2PH₃ + 4O₂ → P₂O₅ + 3H₂O",
    gradeLevel: 11,
    category: "Photpho",
    conditions: "Tự cháy trong không khí",
    observation: "Ánh sáng xanh mờ ảo đặc trưng của hiện tượng ma trơi.",
    energy: -1200,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_175",
    name: "Axit Nitric đặc nguội làm thụ động Nhôm",
    type: "redox",
    reactants: [
      { formula: "Al", coeff: 1, name: "Nhôm" },
      { formula: "HNO₃", coeff: 1, name: "HNO₃ đặc nguội" }
    ],
    products: [
      { formula: "Al-Passivated", coeff: 1, name: "Lớp màng oxit bảo vệ" }
    ],
    equation: "Al + HNO₃(đ, nguội) → (Thụ động hóa)",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ thấp, axit đặc",
    observation: "Nhôm không tan, bề mặt trơ với axit do lớp oxit cực mỏng bảo vệ.",
    energy: 0,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_176",
    name: "Sản xuất Amôni Sunfat (Phân bón)",
    type: "double-replacement",
    reactants: [
      { formula: "NH₃", coeff: 2, name: "Amoniac" },
      { formula: "H₂SO₄", coeff: 1, name: "Axit Sunfuric" }
    ],
    products: [
      { formula: "(NH₄)₂SO₄", coeff: 1, name: "Amôni Sunfat" }
    ],
    equation: "2NH₃ + H₂SO₄ → (NH₄)₂SO₄",
    gradeLevel: 11,
    category: "Phân bón",
    conditions: "Nhiệt độ phòng",
    observation: "Dung dịch không màu, cô cạn tạo tinh thể muối trắng.",
    energy: -120,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_177",
    name: "Phản ứng của Cu với H₂SO₄ đặc nóng",
    type: "redox",
    reactants: [
      { formula: "Cu", coeff: 1, name: "Đồng" },
      { formula: "H₂SO₄", coeff: 2, name: "Axit đặc" }
    ],
    products: [
      { formula: "CuSO₄", coeff: 1, name: "Đồng(II) Sunfat" },
      { formula: "SO₂", coeff: 1, name: "Khí Sunfurơ" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "Cu + 2H₂SO₄(đ) →(t°) CuSO₄ + SO₂↑ + 2H₂O",
    gradeLevel: 10,
    category: "Lưu huỳnh",
    conditions: "Đun nóng",
    observation: "Đồng tan, dung dịch chuyển xanh lam, khí mùi hắc thoát ra.",
    energy: -180,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_178",
    name: "Oxy hóa Ancol Etylic bằng CuO",
    type: "redox",
    reactants: [
      { formula: "C₂H₅OH", coeff: 1, name: "Rượu Etylic" },
      { formula: "CuO", coeff: 1, name: "Đồng(II) Oxit" }
    ],
    products: [
      { formula: "CH₃CHO", coeff: 1, name: "Andehit Axetic" },
      { formula: "Cu", coeff: 1, name: "Đồng" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "C₂H₅OH + CuO →(t°) CH₃CHO + Cu + H₂O",
    gradeLevel: 11,
    category: "Ancol",
    conditions: "Dây đồng oxit nóng đỏ",
    observation: "Dây đồng màu đen chuyển sang màu đỏ kim loại, có mùi xốc của andehit.",
    energy: -50,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_179",
    name: "Phenol tác dụng với nước Brom (Nhận biết)",
    type: "double-replacement",
    reactants: [
      { formula: "C₆H₅OH", coeff: 1, name: "Phenol" },
      { formula: "Br₂", coeff: 3, name: "Nước Brom" }
    ],
    products: [
      { formula: "C₆H₂Br₃OH", coeff: 1, name: "2,4,6-Tribromphenol" },
      { formula: "HBr", coeff: 3, name: "Hydro Bromua" }
    ],
    equation: "C₆H₅OH + 3Br₂ → C₆H₂Br₃OH↓ + 3HBr",
    gradeLevel: 11,
    category: "Phenol",
    conditions: "Nhiệt độ thường",
    observation: "Dung dịch brom mất màu, xuất hiện kết tủa trắng tinh.",
    energy: -95,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_180",
    name: "Trùng hợp Isopren (Tạo cao su thiên nhiên)",
    type: "combination",
    reactants: [
      { formula: "C₅H₈", coeff: 1, name: "Isopren" }
    ],
    products: [
      { formula: "(C₅H₈)n", coeff: 1, name: "Cao su Isopren" }
    ],
    equation: "nCH₂=C(CH₃)-CH=CH₂ → (-CH₂-C(CH₃)=CH-CH₂-)n",
    gradeLevel: 12,
    category: "Polyme",
    conditions: "Xúc tác Ziegler-Natta",
    observation: "Chất lỏng chuyển thành khối dẻo đàn hồi.",
    energy: -110,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_181",
    name: "Sản xuất Vôi trong lò thủ công",
    type: "decomposition",
    reactants: [
      { formula: "CaCO₃", coeff: 1, name: "Đá vôi" },
      { formula: "C", coeff: 1, name: "Than (nhiên liệu)" }
    ],
    products: [
      { formula: "CaO", coeff: 1, name: "Vôi sống" },
      { formula: "CO₂", coeff: 1, name: "Khí thải" }
    ],
    equation: "CaCO₃ →(t°) CaO + CO₂",
    gradeLevel: 9,
    category: "Công nghiệp",
    conditions: "Nhiệt độ > 900°C",
    observation: "Sản xuất vôi sống quy mô lớn phục vụ xây dựng.",
    energy: 178,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_182",
    name: "Hòa tan SiO₂ bằng HF (Khắc thủy tinh)",
    type: "double-replacement",
    reactants: [
      { formula: "SiO₂", coeff: 1, name: "Cát/Thủy tinh" },
      { formula: "HF", coeff: 4, name: "Axit Floridric" }
    ],
    products: [
      { formula: "SiF₄", coeff: 1, name: "Silic Tetraflorua" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "SiO₂ + 4HF → SiF₄↑ + 2H₂O",
    gradeLevel: 11,
    category: "Halogen",
    conditions: "Nhiệt độ phòng",
    observation: "Thủy tinh bị ăn mòn mạnh, dùng để khắc chữ lên thủy tinh.",
    energy: -150,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_183",
    name: "Đốt cháy Magie trong khí Cacbonic",
    type: "redox",
    reactants: [
      { formula: "Mg", coeff: 2, name: "Magiê" },
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" }
    ],
    products: [
      { formula: "MgO", coeff: 2, name: "Magiê Oxit" },
      { formula: "C", coeff: 1, name: "Than (Muội đen)" }
    ],
    equation: "2Mg + CO₂ →(t°) 2MgO + C",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Mg đang cháy",
    observation: "Mg vẫn cháy mạnh trong CO₂, tạo bột trắng và muội than đen.",
    energy: -810,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_184",
    name: "Phản ứng của Glyxin với NaOH",
    type: "double-replacement",
    reactants: [
      { formula: "Gly", coeff: 1, name: "Glyxin" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "Gly-Na", coeff: 1, name: "Natri Glyxinát" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "H₂NCH₂COOH + NaOH → H₂NCH₂COONa + H₂O",
    gradeLevel: 12,
    category: "Amino Acid",
    conditions: "Nhiệt độ phòng",
    observation: "Glyxin tan trong kiềm tạo muối tan.",
    energy: -55,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_185",
    name: "Phản ứng của Glyxin với HCl",
    type: "combination",
    reactants: [
      { formula: "Gly", coeff: 1, name: "Glyxin" },
      { formula: "HCl", coeff: 1, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "Gly-HCl", coeff: 1, name: "Glyxin Hidroclorua" }
    ],
    equation: "H₂NCH₂COOH + HCl → Cl⁻H₃N⁺CH₂COOH",
    gradeLevel: 12,
    category: "Amino Acid",
    conditions: "Nhiệt độ phòng",
    observation: "Thể hiện tính lưỡng tính của amino acid.",
    energy: -40,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_186",
    name: "Sắt tác dụng với Dung dịch muối đồng",
    type: "single-replacement",
    reactants: [
      { formula: "Fe", coeff: 1, name: "Sắt" },
      { formula: "CuCl₂", coeff: 1, name: "Đồng(II) Clorua" }
    ],
    products: [
      { formula: "FeCl₂", coeff: 1, name: "Sắt(II) Clorua" },
      { formula: "Cu", coeff: 1, name: "Đồng" }
    ],
    equation: "Fe + CuCl₂ → FeCl₂ + Cu↓",
    gradeLevel: 9,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Kim loại màu đỏ bám trên sắt, dung dịch xanh lam nhạt dần.",
    energy: -150,
    animation: "color-change",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_187",
    name: "Nhôm tác dụng với Dung dịch muối sắt(III)",
    type: "single-replacement",
    reactants: [
      { formula: "Al", coeff: 1, name: "Nhôm" },
      { formula: "FeCl₃", coeff: 1, name: "Sắt(III) Clorua" }
    ],
    products: [
      { formula: "AlCl₃", coeff: 1, name: "Nhôm Clorua" },
      { formula: "FeCl₂", coeff: 1, name: "Sắt(II) Clorua" }
    ],
    equation: "Al + 3FeCl₃ → AlCl₃ + 3FeCl₂",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Nhôm tan dần, dung dịch thay đổi màu sắc.",
    energy: -320,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_188",
    name: "Cacbon Monoxit cháy (Khí lò ga)",
    type: "redox",
    reactants: [
      { formula: "CO", coeff: 2, name: "Cacbon Monoxit" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "CO₂", coeff: 2, name: "Khí Cacbonic" }
    ],
    equation: "2CO + O₂ →(t°) 2CO₂",
    gradeLevel: 9,
    category: "Cacbon",
    conditions: "Đốt cháy",
    observation: "Ngọn lửa màu xanh lam rất đẹp, tỏa nhiều nhiệt.",
    energy: -566,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_189",
    name: "Điều chế Khí Oxy bằng H₂O₂",
    type: "decomposition",
    reactants: [
      { formula: "H₂O₂", coeff: 2, name: "Oxy già" }
    ],
    products: [
      { formula: "H₂O", coeff: 2, name: "Nước" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    equation: "2H₂O₂ →(MnO₂) 2H₂O + O₂↑",
    gradeLevel: 8,
    category: "Oxi",
    conditions: "Xúc tác MnO₂",
    observation: "Dung dịch sủi bọt khí Oxy mạnh mẽ.",
    energy: -196,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_190",
    name: "Kết tủa Nhôm Hidroxit bằng NH₃",
    type: "double-replacement",
    reactants: [
      { formula: "AlCl₃", coeff: 1, name: "Nhôm Clorua" },
      { formula: "NH₃", coeff: 3, name: "Amoniac" },
      { formula: "H₂O", coeff: 3, name: "Nước" }
    ],
    products: [
      { formula: "Al(OH)₃", coeff: 1, name: "Nhôm Hidroxit" },
      { formula: "NH₄Cl", coeff: 3, name: "Amôni Clorua" }
    ],
    equation: "AlCl₃ + 3NH₃ + 3H₂O → Al(OH)₃↓ + 3NH₄Cl",
    gradeLevel: 11,
    category: "Phân tích định tính",
    conditions: "Dung dịch NH₃",
    observation: "Kết tủa trắng dạng keo xuất hiện và không tan trong NH₃ dư.",
    energy: -45,
    animation: "precipitation",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_191",
    name: "Phản ứng giữa khí Clo và dung dịch NaOH nguội",
    type: "redox",
    reactants: [
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" },
      { formula: "NaOH", coeff: 2, name: "Kiềm nguội" }
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
    observation: "Sản xuất nước Gia-ven có tính tẩy màu mạnh.",
    energy: -100,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_192",
    name: "Phản ứng giữa khí Clo và dung dịch NaOH nóng",
    type: "redox",
    reactants: [
      { formula: "Cl₂", coeff: 3, name: "Khí Clo" },
      { formula: "NaOH", coeff: 6, name: "Kiềm nóng" }
    ],
    products: [
      { formula: "NaCl", coeff: 5, name: "Natri Clorua" },
      { formula: "NaClO₃", coeff: 1, name: "Natri Clorat" },
      { formula: "H₂O", coeff: 3, name: "Nước" }
    ],
    equation: "3Cl₂ + 6NaOH →(t°) 5NaCl + NaClO₃ + 3H₂O",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiệt độ ~70°C",
    observation: "Màu vàng của clo biến mất nhanh hơn so với điều kiện thường.",
    energy: -250,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_193",
    name: "Thủy phân Tinh bột thành Đường",
    type: "double-replacement",
    reactants: [
      { formula: "Starch", coeff: 1, name: "Tinh bột" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "C₆H₁₂O₆", coeff: 1, name: "Glucozơ" }
    ],
    equation: "(C₆H₁₀O₅)n + nH₂O → nC₆H₁₂O₆",
    gradeLevel: 9,
    category: "Carbohydrate",
    conditions: "Xúc tác Axit, t°",
    observation: "Bột trắng biến thành dung dịch đường có vị ngọt.",
    energy: -5,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_194",
    name: "Phản ứng thế của Benzen với Br₂ (Có bột sắt)",
    type: "single-replacement",
    reactants: [
      { formula: "C₆H₆", coeff: 1, name: "Benzen" },
      { formula: "Br₂", coeff: 1, name: "Brom lỏng" }
    ],
    products: [
      { formula: "C₆H₅Br", coeff: 1, name: "Brombenzen" },
      { formula: "HBr", coeff: 1, name: "Hydro Bromua" }
    ],
    equation: "C₆H₆ + Br₂ →(Fe, t°) C₆H₅Br + HBr",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Xúc tác bột Fe, đun nóng",
    observation: "Màu đỏ nâu của brom nhạt dần, có khí HBr thoát ra.",
    energy: -45,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_195",
    name: "Sản xuất Photpho trong lò điện",
    type: "redox",
    reactants: [
      { formula: "Ca₃(PO₄)₂", coeff: 1, name: "Quặng Photphorit" },
      { formula: "SiO₂", coeff: 3, name: "Cát" },
      { formula: "C", coeff: 5, name: "Than cốc" }
    ],
    products: [
      { formula: "CaSiO₃", coeff: 3, name: "Canxi Silicat" },
      { formula: "CO", coeff: 5, name: "Cacbon Monoxit" },
      { formula: "P", coeff: 2, name: "Photpho" }
    ],
    equation: "Ca₃(PO₄)₂ + 3SiO₂ + 5C → 3CaSiO₃ + 5CO + 2P",
    gradeLevel: 11,
    category: "Photpho",
    conditions: "Nhiệt độ 1200°C trong lò điện",
    observation: "Hơi photpho thoát ra và được ngưng tụ dưới nước.",
    energy: 1500,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_196",
    name: "Thủy phân dẫn xuất Clo của Benzen",
    type: "redox",
    reactants: [
      { formula: "C₆H₅Cl", coeff: 1, name: "Clorbenzen" },
      { formula: "NaOH", coeff: 1, name: "Natri Hidroxit" }
    ],
    products: [
      { formula: "C₆H₅OH", coeff: 1, name: "Phenol" },
      { formula: "NaCl", coeff: 1, name: "Natri Clorua" }
    ],
    equation: "C₆H₅Cl + NaOH →(t°, p) C₆H₅OH + NaCl",
    gradeLevel: 11,
    category: "Hữu cơ",
    conditions: "Nhiệt độ và áp suất rất cao",
    observation: "Dẫn xuất halogen của vòng thơm khó thủy phân hơn so với dẫn xuất no.",
    energy: 200,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_197",
    name: "Phenol tác dụng với Natri",
    type: "single-replacement",
    reactants: [
      { formula: "C₆H₅OH", coeff: 2, name: "Phenol nóng chảy" },
      { formula: "Na", coeff: 2, name: "Natri" }
    ],
    products: [
      { formula: "C₆H₅ONa", coeff: 2, name: "Natri Phenolat" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "2C₆H₅OH + 2Na → 2C₆H₅ONa + H₂↑",
    gradeLevel: 11,
    category: "Phenol",
    conditions: "Nhiệt độ thường (Phenol nóng chảy)",
    observation: "Có bọt khí Hydro thoát ra, thể hiện tính axit yếu của phenol.",
    energy: -140,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_198",
    name: "Sản xuất PVC từ Axetilen",
    type: "combination",
    reactants: [
      { formula: "C₂H₂", coeff: 1, name: "Axetilen" },
      { formula: "HCl", coeff: 1, name: "Hydro Clo" }
    ],
    products: [
      { formula: "C₂H₃Cl", coeff: 1, name: "Vinyl Clorua" }
    ],
    equation: "CH≡CH + HCl →(150-200°C, HgCl₂) CH₂=CHCl",
    gradeLevel: 12,
    category: "Công nghiệp",
    conditions: "Xúc tác HgCl₂",
    observation: "Chuyển hóa khí axetilen thành nguyên liệu sản xuất nhựa.",
    energy: -85,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_199",
    name: "Phản ứng cháy của Propane (Khí gas gia đình)",
    type: "combustion",
    reactants: [
      { formula: "C₃H₈", coeff: 1, name: "Khí Propane" },
      { formula: "O₂", coeff: 5, name: "Khí Oxy" }
    ],
    products: [
      { formula: "CO₂", coeff: 3, name: "Khí Cacbonic" },
      { formula: "H₂O", coeff: 4, name: "Nước" }
    ],
    equation: "C₃H₈ + 5O₂ → 3CO₂ + 4H₂O",
    gradeLevel: 11,
    category: "Hydrocarbon",
    conditions: "Đốt cháy",
    observation: "Tỏa nhiệt lượng cực lớn, dùng trong bếp ga sinh hoạt.",
    energy: -2220,
    animation: "burn",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_200",
    name: "Nhận biết Glucozơ bằng Ag₂O/NH₃ (Tráng gương)",
    type: "redox",
    reactants: [
      { formula: "C₆H₁₂O₆", coeff: 1, name: "Glucozơ" },
      { formula: "Ag₂O", coeff: 1, name: "Bạc Oxit (trong NH₃)" }
    ],
    products: [
      { formula: "C₆H₁₂O₇", coeff: 1, name: "Axit Gluconic" },
      { formula: "Ag", coeff: 2, name: "Bạc kim loại" }
    ],
    equation: "CH₂OH(CHOH)₄CHO + Ag₂O →(NH₃, t°) Axit Gluconic + 2Ag↓",
    gradeLevel: 12,
    category: "Carbohydrate",
    conditions: "Dung dịch AgNO₃/NH₃ (Tollens)",
    observation: "Xuất hiện lớp bạc sáng bóng như gương bám vào thành ống nghiệm.",
    energy: -200,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_201",
    name: "Hiệu ứng Nhà kính (Cháy rừng/Nhiên liệu)",
    type: "combustion",
    reactants: [
      { formula: "Wood", coeff: 1, name: "Sinh khối/Gỗ" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" }
    ],
    equation: "Các nguồn C + O₂ → CO₂ (Phát thải lớn)",
    gradeLevel: 10,
    category: "Môi trường",
    conditions: "Đốt cháy",
    observation: "Thải ra lượng lớn CO₂, góp phần gây ấm lên toàn cầu.",
    energy: -300,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_202",
    name: "Mưa axit (Oxy hóa Lưu huỳnh điôxit)",
    type: "redox",
    reactants: [
      { formula: "SO₂", coeff: 2, name: "SO₂ (Khí thải)" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" },
      { formula: "H₂O", coeff: 2, name: "Hơi nước" }
    ],
    products: [
      { formula: "H₂SO₄", coeff: 2, name: "Axit Sunfuric (Mưa)" }
    ],
    equation: "2SO₂ + O₂ + 2H₂O → 2H₂SO₄",
    gradeLevel: 10,
    category: "Môi trường",
    conditions: "Ánh sáng, sương mù",
    observation: "Nước mưa có độ pH thấp, làm mòn các công trình đá vôi.",
    energy: -380,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_203",
    name: "Phân hủy rác thải hữu cơ (Tạo Metan)",
    type: "decomposition",
    reactants: [
      { formula: "Waste", coeff: 1, name: "Rác hữu cơ" }
    ],
    products: [
      { formula: "CH₄", coeff: 1, name: "Khí Biogas" }
    ],
    equation: "Hợp chất hữu cơ →(vi sinh yếm khí) CH₄ + ...",
    gradeLevel: 11,
    category: "Môi trường",
    conditions: "Môi trường yếm khí",
    observation: "Tạo ra khí metan có thể dùng làm chất đốt (biogas).",
    energy: -40,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_204",
    name: "Nhận biết Saponin (Trong Bồ kết/Xà phòng)",
    type: "combination",
    reactants: [
      { formula: "Saponin", coeff: 1, name: "Dịch bồ kết" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "Foam", coeff: 1, name: "Lớp bọt bền" }
    ],
    equation: "Saponin + Nước (Lắc mạnh) → Bọt",
    gradeLevel: 12,
    category: "Hữu cơ",
    conditions: "Lắc mạnh",
    observation: "Tạo ra lớp bọt rất bền và mịn.",
    energy: -5,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_205",
    name: "Thủy phân Protein bằng Enzyme (Tiêu hóa)",
    type: "double-replacement",
    reactants: [
      { formula: "Protein", coeff: 1, name: "Thịt/Cá" },
      { formula: "Enzyme", coeff: 1, name: "Men tiêu hóa" }
    ],
    products: [
      { formula: "Peptides", coeff: 2, name: "Dưỡng chất" }
    ],
    equation: "Protein + H₂O →(enzyme) Amino acids",
    gradeLevel: 12,
    category: "Protein",
    conditions: "37°C, pH thích hợp",
    observation: "Các phân tử protein lớn vỡ ra thành các mảnh nhỏ dễ hấp thụ.",
    energy: -10,
    animation: "mix",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn, có thể thực hiện trên mô phỏng",
    isBlocked: false
  },
  {
    id: "rx_301",
    name: "Đốt cháy Cacbon",
    type: "combination",
    reactants: [
      { formula: "C", coeff: 1, name: "Cacbon" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" }
    ],
    equation: "C + O₂ →(t°) CO₂",
    gradeLevel: 8,
    category: "Phi kim",
    conditions: "Nhiệt độ cao",
    observation: "Than cháy sáng, tỏa nhiều nhiệt, không có ngọn lửa.",
    energy: -393.5,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn",
    isBlocked: false
  },
  {
    id: "rx_302",
    name: "Canxi tác dụng với nước",
    type: "single-replacement",
    reactants: [
      { formula: "Ca", coeff: 1, name: "Canxi" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    products: [
      { formula: "Ca(OH)₂", coeff: 1, name: "Canxi Hidroxit" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "Ca + 2H₂O → Ca(OH)₂ + H₂↑",
    gradeLevel: 9,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Canxi tan dần, sủi bọt khí mạnh, dung dịch trở nên đục.",
    energy: -413,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn",
    isBlocked: false
  },
  {
    id: "rx_303",
    name: "Đốt cháy Canxi",
    type: "combination",
    reactants: [
      { formula: "Ca", coeff: 2, name: "Canxi" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "CaO", coeff: 2, name: "Vôi sống" }
    ],
    equation: "2Ca + O₂ →(t°) 2CaO",
    gradeLevel: 8,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Canxi cháy với ngọn lửa đỏ cam đặc trưng, tạo chất rắn màu trắng.",
    energy: -1270,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn",
    isBlocked: false
  },
  {
    id: "rx_304",
    name: "Liti tác dụng với nước",
    type: "single-replacement",
    reactants: [
      { formula: "Li", coeff: 2, name: "Liti" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    products: [
      { formula: "LiOH", coeff: 2, name: "Liti Hidroxit" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "2Li + 2H₂O → 2LiOH + H₂↑",
    gradeLevel: 10,
    category: "Kim loại kiềm",
    conditions: "Nhiệt độ thường",
    observation: "Liti tan chậm hơn Natri, sủi bọt khí không màu.",
    energy: -444,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn",
    isBlocked: false
  },
  {
    id: "rx_305",
    name: "Kali tác dụng với nước",
    type: "single-replacement",
    reactants: [
      { formula: "K", coeff: 2, name: "Kali" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    products: [
      { formula: "KOH", coeff: 2, name: "Kali Hidroxit" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "2K + 2H₂O → 2KOH + H₂↑",
    gradeLevel: 8,
    category: "Kim loại kiềm",
    conditions: "Nhiệt độ thường",
    observation: "Kali phản ứng cực mạnh, tự bùng cháy với ngọn lửa màu tím đặc trưng.",
    energy: -392,
    animation: "explosion",
    dangerLevel: 2,
    safetyWarning: "Phản ứng mãnh liệt, cần cẩn trọng",
    isBlocked: false
  },
  {
    id: "rx_306",
    name: "Kali tác dụng với Clo",
    type: "combination",
    reactants: [
      { formula: "K", coeff: 2, name: "Kali" },
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" }
    ],
    products: [
      { formula: "KCl", coeff: 2, name: "Kali Clorua" }
    ],
    equation: "2K + Cl₂ →(t°) 2KCl",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Kali cháy sáng trong khí Clo, tạo tinh thể trắng.",
    energy: -874,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn",
    isBlocked: false
  },
  {
    id: "rx_307",
    name: "Bari tác dụng với nước",
    type: "single-replacement",
    reactants: [
      { formula: "Ba", coeff: 1, name: "Bari" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    products: [
      { formula: "Ba(OH)₂", coeff: 1, name: "Bari Hidroxit" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "Ba + 2H₂O → Ba(OH)₂ + H₂↑",
    gradeLevel: 11,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Bari tan nhanh, sủi bọt khí mạnh mẽ.",
    energy: -430,
    animation: "fizz",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn",
    isBlocked: false
  },
  {
    id: "rx_308",
    name: "Crom tác dụng với Clo",
    type: "combination",
    reactants: [
      { formula: "Cr", coeff: 2, name: "Crom" },
      { formula: "Cl₂", coeff: 3, name: "Khí Clo" }
    ],
    products: [
      { formula: "CrCl₃", coeff: 2, name: "Crom(III) Clorua" }
    ],
    equation: "2Cr + 3Cl₂ →(t°) 2CrCl₃",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Crom cháy trong Clo tạo tinh thể màu tím đỏ.",
    energy: -556,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn",
    isBlocked: false
  },
  {
    id: "rx_309",
    name: "Bạc tác dụng với Axit Nitric đặc",
    type: "redox",
    reactants: [
      { formula: "Ag", coeff: 1, name: "Bạc" },
      { formula: "HNO₃", coeff: 2, name: "Axit Nitric đặc" }
    ],
    products: [
      { formula: "AgNO₃", coeff: 1, name: "Bạc Nitrat" },
      { formula: "NO₂", coeff: 1, name: "Khí Nitơ Đioxit" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "Ag + 2HNO₃(đ) → AgNO₃ + NO₂↑ + H₂O",
    gradeLevel: 11,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Bạc tan, giải phóng khí màu nâu đỏ NO₂.",
    energy: -100,
    animation: "smoke",
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn",
    isBlocked: false
  },
  {
    id: "rx_310",
    name: "Oxy hóa Bạc",
    type: "combination",
    reactants: [
      { formula: "Ag", coeff: 4, name: "Bạc" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "Ag₂O", coeff: 2, name: "Bạc Oxit" }
    ],
    equation: "4Ag + O₂ →(200°C) 2Ag₂O",
    gradeLevel: 11,
    category: "Kim loại",
    conditions: "Nhiệt độ ~200°C",
    observation: "Bề mặt bạc bị xỉn màu, tạo lớp oxit màu đen.",
    energy: -62.2,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    safetyWarning: "Thí nghiệm an toàn",
    isBlocked: false
  },
];


// Danh sách hóa chất khả dụng trong Lab
export const chemicals = [
  { id: "H2", formula: "H₂", name: "Khí Hydro", state: "gas", category: "Phi kim", molarMass: 2.016, color: "#e2e8f0", isStarter: true },

  { id: "O2", formula: "O₂", name: "Khí Oxy", state: "gas", category: "Phi kim", molarMass: 31.998, color: "#cbd5e1", isStarter: true },
  { id: "N2", formula: "N₂", name: "Khí Nitơ", state: "gas", category: "Phi kim", molarMass: 28.014, color: "#f8fafc", isStarter: true },
  { id: "Cl2", formula: "Cl₂", name: "Khí Clo", state: "gas", category: "Halogen", molarMass: 70.90, color: "#bef264", isStarter: true },
  { id: "Fe", formula: "Fe", name: "Sắt", state: "solid", category: "Kim loại", molarMass: 55.845, color: "#94a3b8", isStarter: true },
  { id: "Na", formula: "Na", name: "Natri", state: "solid", category: "Kim loại kiềm", molarMass: 22.99, color: "#e2e8f0", isStarter: true },
  { id: "Mg", formula: "Mg", name: "Magiê", state: "solid", category: "Kim loại", molarMass: 24.305, color: "#cbd5e1", isStarter: true },
  { id: "Zn", formula: "Zn", name: "Kẽm", state: "solid", category: "Kim loại", molarMass: 65.38, color: "#94a3b8", isStarter: true },
  { id: "He", formula: "He", name: "Heli", state: "gas", category: "Khí hiếm", molarMass: 4.003, color: "#cbd5e1", isStarter: true },
  { id: "C", formula: "C", name: "Cacbon", state: "solid", category: "Phi kim", molarMass: 12.011, color: "#1e293b", isStarter: true },
  { id: "Ca", formula: "Ca", name: "Canxi", state: "solid", category: "Kim loại kiềm thổ", molarMass: 40.078, color: "#e2e8f0", isStarter: true },
  { id: "Li", formula: "Li", name: "Liti", state: "solid", category: "Kim loại kiềm", molarMass: 6.941, color: "#cbd5e1", isStarter: true },
  { id: "Be", formula: "Be", name: "Beri", state: "solid", category: "Kim loại kiềm thổ", molarMass: 9.012, color: "#94a3b8", isStarter: true },
  { id: "B", formula: "B", name: "Bo", state: "solid", category: "Á kim", molarMass: 10.81, color: "#475569", isStarter: true },
  { id: "F2", formula: "F₂", name: "Khí Flo", state: "gas", category: "Halogen", molarMass: 38.00, color: "#bef264", isStarter: true },
  { id: "Ne", formula: "Ne", name: "Khí Neon", state: "gas", category: "Khí hiếm", molarMass: 20.18, color: "#f8fafc", isStarter: true },
  { id: "Si", formula: "Si", name: "Silic", state: "solid", category: "Á kim", molarMass: 28.085, color: "#475569", isStarter: true },
  { id: "K", formula: "K", name: "Kali", state: "solid", category: "Kim loại kiềm", molarMass: 39.098, color: "#e2e8f0", isStarter: true },
  { id: "Ar", formula: "Ar", name: "Khí Agon", state: "gas", category: "Khí hiếm", molarMass: 39.948, color: "#f8fafc", isStarter: true },
  { id: "Cr", formula: "Cr", name: "Crom", state: "solid", category: "Kim loại", molarMass: 51.996, color: "#94a3b8", isStarter: true },
  { id: "Ba", formula: "Ba", name: "Bari", state: "solid", category: "Kim loại kiềm thổ", molarMass: 137.33, color: "#e2e8f0", isStarter: true },
  { id: "Ag", formula: "Ag", name: "Bạc", state: "solid", category: "Kim loại", molarMass: 107.87, color: "#f8fafc", isStarter: true },
  { id: "Cu", formula: "Cu", name: "Đồng", state: "solid", category: "Kim loại", molarMass: 63.546, color: "#f97316", isStarter: true },
  { id: "H2O", formula: "H₂O", name: "Nước", state: "liquid", category: "Dung môi", molarMass: 18.015, color: "#38bdf8" },
  { id: "HCl", formula: "HCl", name: "Axit Clohidric", state: "liquid", category: "Axit", molarMass: 36.46, color: "rgba(255,255,255,0.2)" },
  { id: "NaOH", formula: "NaOH", name: "Natri Hidroxit", state: "solid", category: "Bazơ", molarMass: 40.00, color: "#818cf8" },
  { id: "CuSO4", formula: "CuSO₄", name: "Đồng(II) Sunfat", state: "solid", category: "Muối", molarMass: 159.61, color: "#3b82f6" },
  { id: "BaCl2", formula: "BaCl₂", name: "Bari Clorua", state: "solid", category: "Muối", molarMass: 208.23, color: "#f1f5f9" },
  { id: "Na2SO4", formula: "Na₂SO₄", name: "Natri Sunfat", state: "solid", category: "Muối", molarMass: 142.04, color: "#f8fafc" },
  { id: "CaCO3", formula: "CaCO₃", name: "Đá vôi", state: "solid", category: "Muối", molarMass: 100.09, color: "#e2e8f0" },
  { id: "CH4", formula: "CH₄", name: "Khí Metan", state: "gas", category: "Hữu cơ", molarMass: 16.04, color: "#f1f5f9" },
  { id: "KMnO4", formula: "KMnO₄", name: "Thuốc tím", state: "solid", category: "Muối", molarMass: 158.03, color: "#4c1d95", isStarter: true },
  { id: "KClO3", formula: "KClO₃", name: "Kali Clorat", state: "solid", category: "Muối", molarMass: 122.55, color: "#f8fafc" },
  { id: "MnO2", formula: "MnO₂", name: "Mangan Đioxit", state: "solid", category: "Oxit", molarMass: 86.93, color: "#1e293b" },
  { id: "S", formula: "S", name: "Lưu huỳnh", state: "solid", category: "Phi kim", molarMass: 32.06, color: "#eab308", isStarter: true },
  { id: "FeS", formula: "FeS", name: "Sắt(II) Sunfua", state: "solid", category: "Muối", molarMass: 87.91, color: "#475569" },
  { id: "H2S", formula: "H₂S", name: "Hydro Sunfua", state: "gas", category: "Phi kim", molarMass: 34.08, color: "#f1f5f9" },
  { id: "MgO", formula: "MgO", name: "Magiê Oxit", state: "solid", category: "Oxit", molarMass: 40.30, color: "#f8fafc" },
  { id: "Fe3O4", formula: "Fe₃O₄", name: "Oxit sắt từ", state: "solid", category: "Oxit", molarMass: 231.53, color: "#1e293b" },
  { id: "ZnCl2", formula: "ZnCl₂", name: "Kẽm Clorua", state: "solid", category: "Muối", molarMass: 136.31, color: "#f1f5f9" },
  { id: "CaO", formula: "CaO", name: "Vôi sống", state: "solid", category: "Oxit", molarMass: 56.07, color: "#e2e8f0" },
  { id: "CO2", formula: "CO₂", name: "Khí Cacbonic", state: "gas", category: "Oxit", molarMass: 44.01, color: "#f8fafc" },
  { id: "FeSO4", formula: "FeSO₄", name: "Sắt(II) Sunfat", state: "solid", category: "Muối", molarMass: 151.91, color: "#d1fae5" },
  { id: "BaSO4", formula: "BaSO₄", name: "Bari Sunfat", state: "solid", category: "Muối", molarMass: 233.39, color: "#ffffff" },
  { id: "NH3", formula: "NH₃", name: "Amoniac", state: "gas", category: "Phi kim", molarMass: 17.03, color: "#f1f5f9" },
  { id: "K2MnO4", formula: "K₂MnO₄", name: "Kali Manganat", state: "solid", category: "Muối", molarMass: 197.13, color: "#064e3b" },
  { id: "KCl", formula: "KCl", name: "Kali Clorua", state: "solid", category: "Muối", molarMass: 74.55, color: "#f8fafc" },
  { id: "NaCl", formula: "NaCl", name: "Natri Clorua", state: "solid", category: "Muối", molarMass: 58.44, color: "#ffffff" },
  { id: "SO2", formula: "SO₂", name: "Lưu huỳnh Đioxit", state: "gas", category: "Oxit", molarMass: 64.06, color: "#f8fafc" },
  { id: "H2SO3", formula: "H₂SO₃", name: "Axit Sunfurơ", state: "liquid", category: "Axit", molarMass: 82.07, color: "#fef08a" },
  { id: "Na2SO3", formula: "Na₂SO₃", name: "Natri Sunfit", state: "solid", category: "Muối", molarMass: 126.04, color: "#ffffff" },
  { id: "MgCl2", formula: "MgCl₂", name: "Magiê Clorua", state: "solid", category: "Muối", molarMass: 95.21, color: "#f1f5f9" },
  { id: "MgCl2_liq", formula: "MgCl₂", name: "Dung dịch Magiê Clorua", state: "liquid", category: "Muối", molarMass: 95.21, color: "#f8fafc" },
  { id: "MgSO4", formula: "MgSO₄", name: "Magiê Sunfat", state: "solid", category: "Muối", molarMass: 120.37, color: "#ffffff" },
  { id: "ZnSO4", formula: "ZnSO₄", name: "Kẽm Sunfat", state: "solid", category: "Muối", molarMass: 161.47, color: "#ffffff" },
  { id: "Cu(OH)2", formula: "Cu(OH)₂", name: "Đồng(II) Hidroxit", state: "solid", category: "Bazơ", molarMass: 97.56, color: "#38bdf8" },
  { id: "Al2(SO4)3", formula: "Al₂(SO₄)₃", name: "Nhôm Sunfat", state: "solid", category: "Muối", molarMass: 342.15, color: "#ffffff" },

  // --- BỔ SUNG KHỐI LƯỢNG LỚN (BATCH 1) ---
  // Kim loại & Oxit bổ sung
  { id: "Al", formula: "Al", name: "Nhôm", state: "solid", category: "Kim loại", molarMass: 26.98, color: "#cbd5e1", isStarter: true },
  { id: "Al2O3", formula: "Al₂O₃", name: "Nhôm Oxit", state: "solid", category: "Oxit", molarMass: 101.96, color: "#f8fafc" },
  { id: "Al(OH)3", formula: "Al(OH)₃", name: "Nhôm Hidroxit", state: "solid", category: "Bazơ", molarMass: 78.00, color: "#ffffff" },
  { id: "AlCl3", formula: "AlCl₃", name: "Nhôm Clorua", state: "solid", category: "Muối", molarMass: 133.34, color: "#f1f5f9" },
  { id: "NaAlO2", formula: "NaAlO₂", name: "Natri Aluminat", state: "solid", category: "Muối", molarMass: 81.97, color: "#f8fafc" },
  { id: "ZnO", formula: "ZnO", name: "Kẽm Oxit", state: "solid", category: "Oxit", molarMass: 81.38, color: "#f8fafc" },
  { id: "AgNO3", formula: "AgNO₃", name: "Bạc Nitrat", state: "liquid", category: "Muối", molarMass: 169.87, color: "#f8fafc", isStarter: true },
  { id: "AgCl", formula: "AgCl", name: "Bạc Clorua", state: "solid", category: "Muối", molarMass: 143.32, color: "#ffffff" },
  { id: "AgBr", formula: "AgBr", name: "Bạc Bromua", state: "solid", category: "Muối", molarMass: 187.77, color: "#fef3c7" },
  { id: "AgI", formula: "AgI", name: "Bạc Iotua", state: "solid", category: "Muối", molarMass: 234.77, color: "#fde047" },
  { id: "Ag2O", formula: "Ag₂O", name: "Bạc Oxit", state: "solid", category: "Oxit", molarMass: 231.74, color: "#1e293b" },

  // Hợp chất Nitơ - Photpho - Lưu huỳnh nâng cao
  { id: "NO", formula: "NO", name: "Nitơ Oxit", state: "gas", category: "Oxit", molarMass: 30.01, color: "#f8fafc" },
  { id: "NO2", formula: "NO₂", name: "Nitơ Đioxit", state: "gas", category: "Oxit", molarMass: 46.01, color: "#92400e" },
  { id: "HNO3", formula: "HNO₃", name: "Axit Nitric", state: "liquid", category: "Axit", molarMass: 63.01, color: "#fef08a", isStarter: true },
  { id: "H2SO4", formula: "H₂SO₄", name: "Axit Sunfuric", state: "liquid", category: "Axit", molarMass: 98.08, color: "rgba(255,255,255,0.15)", isStarter: true },
  { id: "NH4Cl", formula: "NH₄Cl", name: "Amôni Clorua", state: "solid", category: "Muối", molarMass: 53.49, color: "#ffffff" },
  { id: "P", formula: "P", name: "Photpho", state: "solid", category: "Phi kim", molarMass: 30.97, color: "#ef4444", isStarter: true },
  { id: "P2O5", formula: "P₂O₅", name: "Diphotpho Pentaoxit", state: "solid", category: "Oxit", molarMass: 141.94, color: "#ffffff" },
  { id: "H3PO4", formula: "H₃PO₄", name: "Axit Photphoric", state: "liquid", category: "Axit", molarMass: 98.00, color: "#ffffff" },

  // Carbon - Silicon & Halogen khác
  { id: "Na2CO3", formula: "Na₂CO₃", name: "Natri Cacbonat", state: "solid", category: "Muối", molarMass: 105.99, color: "#ffffff" },
  { id: "NaHCO3", formula: "NaHCO₃", name: "Natri Bicacbonat", state: "solid", category: "Muối", molarMass: 84.01, color: "#ffffff" },
  { id: "Ca(OH)2", formula: "Ca(OH)₂", name: "Canxi Hidroxit", state: "liquid", category: "Bazơ", molarMass: 74.09, color: "#f8fafc" },
  { id: "Br2", formula: "Br₂", name: "Brom", state: "liquid", category: "Halogen", molarMass: 159.8, color: "#7c2d12", isStarter: true },
  { id: "I2", formula: "I₂", name: "Iốt", state: "solid", category: "Halogen", molarMass: 253.8, color: "#4c1d95", isStarter: true },
  { id: "KClO3", formula: "KClO₃", name: "Kali Clorat", state: "solid", category: "Muối", molarMass: 122.5, color: "#ffffff" },

  // Hữu cơ (Organic)
  { id: "C2H4", formula: "C₂H₄", name: "Etilen", state: "gas", category: "Hydrocarbon", molarMass: 28.05, color: "#f8fafc" },
  { id: "C2H2", formula: "C₂H₂", name: "Axetilen", state: "gas", category: "Hydrocarbon", molarMass: 26.04, color: "#f8fafc" },
  { id: "C2H5OH", formula: "C₂H₅OH", name: "Rượu Etylic", state: "liquid", category: "Ancol", molarMass: 46.07, color: "#f8fafc", isStarter: true },
  { id: "CH3COOH", formula: "CH₃COOH", name: "Axit Axetic", state: "liquid", category: "Axit hữu cơ", molarMass: 60.05, color: "#f8fafc", isStarter: true },
  { id: "CH3COOC2H5", formula: "CH₃COOC₂H₅", name: "Etyl Axetat", state: "liquid", category: "Este", molarMass: 88.11, color: "#f8fafc" },
  { id: "C6H12O6", formula: "C₆H₁₂O₆", name: "Glucozơ", state: "solid", category: "Carbohydrate", molarMass: 180.16, color: "#ffffff" },
  { id: "C12H22O11", formula: "C₁₂H₂₂O₁₁", name: "Saccarozơ", state: "solid", category: "Carbohydrate", molarMass: 342.3, color: "#ffffff" },
  { id: "CH3CHO", formula: "CH₃CHO", name: "Andehit Axetic", state: "liquid", category: "Andehit", molarMass: 44.05, color: "#f8fafc" },
  { id: "C6H6", formula: "C₆H₆", name: "Benzen", state: "liquid", category: "Hydrocarbon", molarMass: 78.11, color: "#f8fafc" },
  { id: "Gly", formula: "H₂N-CH₂-COOH", name: "Glyxin", state: "solid", category: "Amino Acid", molarMass: 75.07, color: "#ffffff" },

  // --- Hóa chất phân tích & Nâng cao (Bổ sung) ---
  { id: "FeCl2", formula: "FeCl₂", name: "Sắt(II) Clorua", state: "solid", category: "Muối", molarMass: 126.75, color: "#dcfce7" },
  { id: "FeCl3", formula: "FeCl₃", name: "Sắt(III) Clorua", state: "solid", category: "Muối", molarMass: 162.2, color: "#92400e" },
  { id: "Fe(OH)2", formula: "Fe(OH)₂", name: "Sắt(II) Hidroxit", state: "solid", category: "Bazơ", molarMass: 89.86, color: "#f8fafc" },
  { id: "Fe(OH)3", formula: "Fe(OH)₃", name: "Sắt(III) Hidroxit", state: "solid", category: "Bazơ", molarMass: 106.87, color: "#7c2d12" },
  { id: "Sn", formula: "Sn", name: "Thiếc", state: "solid", category: "Kim loại", molarMass: 118.71, color: "#e2e8f0" },
  { id: "Pb", formula: "Pb", name: "Chì", state: "solid", category: "Kim loại", molarMass: 207.2, color: "#94a3b8" },
  { id: "SO3", formula: "SO₃", name: "Lưu huỳnh Trioxit", state: "solid", category: "Oxit", molarMass: 80.06, color: "#ffffff" },
  { id: "NH4NO3", formula: "NH₄NO₃", name: "Amôni Nitrat", state: "solid", category: "Muối", molarMass: 80.04, color: "#ffffff" },
  { id: "Na3PO4", formula: "Na₃PO₄", name: "Natri Photphat", state: "solid", category: "Muối", molarMass: 163.94, color: "#ffffff" },
  { id: "PH3", formula: "PH₃", name: "Photphin (Ma trơi)", state: "gas", category: "Phi kim", molarMass: 34.0, color: "#f1f5f9" },
  { id: "C3H5(OH)3", formula: "C₃H₈O₃", name: "Glixerol", state: "liquid", category: "Ancol", molarMass: 92.09, color: "#f8fafc" },
  { id: "C17H35COOH", formula: "C₁₇H₃₅COOH", name: "Axit Stearic", state: "solid", category: "Axit béo", molarMass: 284.48, color: "#ffffff" },
  { id: "Protein", formula: "Protein", name: "Protein (Lòng trắng)", state: "liquid", category: "Protein", molarMass: 10000, color: "#ffffff" },
  { id: "Cellulose", formula: "Cellulose", name: "Xenlulozơ", state: "solid", category: "Carbohydrate", molarMass: 162.14, color: "#ffffff" },
  { id: "Starch", formula: "Starch", name: "Tinh bột", state: "solid", category: "Carbohydrate", molarMass: 162.14, color: "#ffffff" },
];

// Hệ thống điều kiện mở khóa (Gamification)
export const unlockRequirements = {
  chemicals: {
    'H2O': { level: 1, required: [] },
    'HCl': { level: 1, required: [] },
    'NaOH': { level: 1, required: [] },
    'O2': { level: 2, required: [] },
    'H2': { level: 2, required: [] },
    'Fe': { level: 3, required: [] },
    'CuSO4': { level: 4, required: [] },
    'Na': { level: 5, required: ['rx_001'] },
  },
  reactions: {
    'rx_001': { level: 2, requiredChemicals: ['H2', 'O2'] },
    'rx_006': { level: 1, requiredChemicals: ['HCl', 'NaOH'] },
    'rx_007': { level: 3, requiredChemicals: ['Fe', 'CuSO4'] },
    'rx_020': { level: 8, requiredChemicals: ['Al', 'H2SO4'] },
    'rx_037': { level: 12, requiredChemicals: ['CH3COOH', 'C2H5OH'] },
    'rx_125': { level: 12, requiredChemicals: ['Protein', 'Cu(OH)2'] },
    'rx_145': { level: 10, requiredChemicals: ['NaCl', 'AgNO3'] },
    'rx_163': { level: 10, requiredChemicals: ['SO3', 'H2O'] },
    'rx_200': { level: 12, requiredChemicals: ['C6H12O6', 'Ag2O'] },
  }
};

// Tìm phản ứng giữa các chất tham gia
export const findReaction = (reactantFormulas, isHeating = false) => {
  if (!reactantFormulas || reactantFormulas.length === 0) return null;

  // Clean nulls from A/B selection
  const formulas = reactantFormulas.filter(f => f !== null && f !== undefined);

  return reactions.find(rx => {
    const rxReactantFormulas = rx.reactants.map(r => r.formula);

    // Match number of reactants
    if (rxReactantFormulas.length !== formulas.length) return false;

    // Match exact formulas
    const matchReactants = formulas.every(f => rxReactantFormulas.includes(f));

    // Check heat condition if required
    if (rx.requiresHeat && !isHeating) return false;

    return matchReactants;
  });
};

// Loại phản ứng (Tiếng Việt)
export const reactionTypes = {
  "combination": "Phản ứng hóa hợp",
  "decomposition": "Phản ứng phân hủy",
  "single-replacement": "Phản ứng thế",
  "double-replacement": "Phản ứng trao đổi",
  "combustion": "Phản ứng cháy",
  "redox": "Phản ứng oxi hóa-khử",
};
