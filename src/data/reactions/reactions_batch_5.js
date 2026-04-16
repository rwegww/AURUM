export const reactionsBatch5 = [
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
  {
    id: "rx_311",
    name: "Flo tác dụng với Hydro",
    type: "combination",
    reactants: [
      { formula: "F₂", coeff: 1, name: "Khí Flo" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    products: [
      { formula: "HF", coeff: 2, name: "Hydro Florua" }
    ],
    equation: "F₂ + H₂ → 2HF",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Phản ứng ngay cả trong bóng tối ở nhiệt độ rất thấp",
    observation: "Phản ứng nổ mạnh ngay cả ở điều kiện khắc nghiệt.",
    energy: -542,
    animation: "explosion",
    dangerLevel: 2,
    safetyWarning: "Cực kỳ nguy hiểm, phản ứng nổ",
    isBlocked: false
  },
  {
    id: "rx_312",
    name: "Flo tác dụng với nước",
    type: "redox",
    reactants: [
      { formula: "F₂", coeff: 2, name: "Khí Flo" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    products: [
      { formula: "HF", coeff: 4, name: "Hydro Florua" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    equation: "2F₂ + 2H₂O → 4HF + O₂↑",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiệt độ thường",
    observation: "Flo bốc cháy trong nước, giải phóng Oxy.",
    energy: -750,
    animation: "burn",
    dangerLevel: 2,
    safetyWarning: "Phản ứng mãnh liệt",
    isBlocked: false
  },
  {
    id: "rx_313",
    name: "Silic tác dụng với Magie",
    type: "combination",
    reactants: [
      { formula: "Si", coeff: 1, name: "Silic" },
      { formula: "Mg", coeff: 2, name: "Magiê" }
    ],
    products: [
      { formula: "Mg₂Si", coeff: 1, name: "Magiê Silixua" }
    ],
    equation: "Si + 2Mg →(t°) Mg₂Si",
    gradeLevel: 11,
    category: "Á kim",
    conditions: "Nhiệt độ cao",
    observation: "Tạo hợp chất silixua kim loại.",
    energy: -77,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_314",
    name: "Silic tác dụng với Flo",
    type: "combination",
    reactants: [
      { formula: "Si", coeff: 1, name: "Silic" },
      { formula: "F₂", coeff: 2, name: "Khí Flo" }
    ],
    products: [
      { formula: "SiF₄", coeff: 1, name: "Silic Tetraflorua" }
    ],
    equation: "Si + 2F₂ → SiF₄",
    gradeLevel: 11,
    category: "Á kim",
    conditions: "Nhiệt độ thường",
    observation: "Silic bùng cháy trong luồng khí Flo.",
    energy: -1615,
    animation: "burn",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_315",
    name: "Bo tác dụng với Oxy",
    type: "combination",
    reactants: [
      { formula: "B", coeff: 4, name: "Bo" },
      { formula: "O₂", coeff: 3, name: "Khí Oxy" }
    ],
    products: [
      { formula: "B₂O₃", coeff: 2, name: "Bo Trioxit" }
    ],
    equation: "4B + 3O₂ →(t°) 2B₂O₃",
    gradeLevel: 11,
    category: "Á kim",
    conditions: "Nhiệt độ cao",
    observation: "Bo cháy sáng tạo chất rắn màu trắng.",
    energy: -1273,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_316",
    name: "Beri tác dụng với Axit Clohidric",
    type: "single-replacement",
    reactants: [
      { formula: "Be", coeff: 1, name: "Beri" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "BeCl₂", coeff: 1, name: "Beri Clorua" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "Be + 2HCl → BeCl₂ + H₂↑",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Beri tan dần, sủi bọt khí không màu.",
    energy: -450,
    animation: "fizz",
    dangerLevel: 2,
    safetyWarning: "Hợp chất Beri rất độc",
    isBlocked: false
  },
  {
    id: "rx_317",
    name: "Cacbon khử Đồng(II) Oxit",
    type: "redox",
    reactants: [
      { formula: "C", coeff: 1, name: "Cacbon" },
      { formula: "CuO", coeff: 2, name: "Đồng(II) Oxit" }
    ],
    products: [
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" },
      { formula: "Cu", coeff: 2, name: "Đồng" }
    ],
    equation: "C + 2CuO →(t°) CO₂↑ + 2Cu",
    gradeLevel: 9,
    category: "Phi kim",
    conditions: "Nhiệt độ cao",
    observation: "Bột màu đen chuyển dần sang màu đỏ của kim loại Đồng.",
    energy: -80,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_318",
    name: "Cacbon khử Sắt(III) Oxit",
    type: "redox",
    reactants: [
      { formula: "C", coeff: 3, name: "Cacbon" },
      { formula: "Fe₂O₃", coeff: 2, name: "Sắt(III) Oxit" }
    ],
    products: [
      { formula: "CO₂", coeff: 3, name: "Khí Cacbonic" },
      { formula: "Fe", coeff: 4, name: "Sắt" }
    ],
    equation: "3C + 2Fe₂O₃ →(t°) 3CO₂↑ + 4Fe",
    gradeLevel: 9,
    category: "Phi kim",
    conditions: "Nhiệt độ cao",
    observation: "Dùng trong công nghiệp luyện gang thép.",
    energy: -460,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_319",
    name: "Canxi tác dụng với Clo",
    type: "combination",
    reactants: [
      { formula: "Ca", coeff: 1, name: "Canxi" },
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" }
    ],
    products: [
      { formula: "CaCl₂", coeff: 1, name: "Canxi Clorua" }
    ],
    equation: "Ca + Cl₂ →(t°) CaCl₂",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Canxi cháy sáng trong khí Clo tạo muối trắng.",
    energy: -795,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_320",
    name: "Bạc tác dụng với Lưu huỳnh",
    type: "combination",
    reactants: [
      { formula: "Ag", coeff: 2, name: "Bạc" },
      { formula: "S", coeff: 1, name: "Lưu huỳnh" }
    ],
    products: [
      { formula: "Ag₂S", coeff: 1, name: "Bạc Sunfua" }
    ],
    equation: "2Ag + S →(t°) Ag₂S",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Đun nóng",
    observation: "Tạo chất rắn màu đen, giải thích hiện tượng bạc bị đen khi tiếp xúc với lưu huỳnh.",
    energy: -32.6,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_321",
    name: "Khắc thủy tinh bằng HF",
    type: "double-replacement",
    reactants: [
      { formula: "SiO₂", coeff: 1, name: "Silic Đioxit" },
      { formula: "HF", coeff: 4, name: "Axit Floridric" }
    ],
    products: [
      { formula: "SiF₄", coeff: 1, name: "Silic Tetraflorua" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "SiO₂ + 4HF → SiF₄↑ + 2H₂O",
    gradeLevel: 11,
    category: "Phi kim",
    conditions: "Nhiệt độ thường",
    observation: "Bề mặt thủy tinh bị ăn mòn, mờ đi.",
    energy: -191,
    animation: "fizz",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_322",
    name: "Bo tác dụng với Magie",
    type: "combination",
    reactants: [
      { formula: "B", coeff: 2, name: "Bo" },
      { formula: "Mg", coeff: 3, name: "Magiê" }
    ],
    products: [
      { formula: "Mg₃B₂", coeff: 1, name: "Magiê Borua" }
    ],
    equation: "2B + 3Mg →(t°) Mg₃B₂",
    gradeLevel: 11,
    category: "Á kim",
    conditions: "Nhiệt độ cao",
    observation: "Tạo hợp chất borua kim loại.",
    energy: -120,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_323",
    name: "Silic tác dụng với Oxy",
    type: "combination",
    reactants: [
      { formula: "Si", coeff: 1, name: "Silic" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "SiO₂", coeff: 1, name: "Silic Đioxit" }
    ],
    equation: "Si + O₂ →(t°) SiO₂",
    gradeLevel: 11,
    category: "Á kim",
    conditions: "Nhiệt độ cao (>400°C)",
    observation: "Silic cháy tạo thành cát trắng tinh khiết.",
    energy: -911,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_324",
    name: "Hòa tan Oxit Bạc trong Axit Nitric",
    type: "double-replacement",
    reactants: [
      { formula: "Ag₂O", coeff: 1, name: "Bạc Oxit" },
      { formula: "HNO₃", coeff: 2, name: "Axit Nitric" }
    ],
    products: [
      { formula: "AgNO₃", coeff: 2, name: "Bạc Nitrat" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    equation: "Ag₂O + 2HNO₃ → 2AgNO₃ + H₂O",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Bột oxit đen tan trong axit tạo dung dịch không màu.",
    energy: -85,
    animation: "mix",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_325",
    name: "Beri tác dụng với Oxy",
    type: "combination",
    reactants: [
      { formula: "Be", coeff: 2, name: "Beri" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "BeO", coeff: 2, name: "Beri Oxit" }
    ],
    equation: "2Be + O₂ →(t°) 2BeO",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Beri cháy sáng tạo lớp oxit trắng.",
    energy: -1200,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_326",
    name: "Hòa tan Vàng trong nước cường toan",
    type: "redox",
    reactants: [
      { formula: "Au", coeff: 1, name: "Vàng" },
      { formula: "HNO₃", coeff: 1, name: "Axit Nitric" },
      { formula: "HCl", coeff: 3, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "AuCl₃", coeff: 1, name: "Vàng(III) Clorua" },
      { formula: "NO", coeff: 1, name: "Khí Nitơ Oxit" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "Au + HNO₃ + 3HCl → AuCl₃ + NO↑ + 2H₂O",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Hỗn hợp HNO₃ và HCl (tỉ lệ 1:3)",
    observation: "Vàng tan dần, giải phóng khí không màu hóa nâu trong không khí (NO).",
    energy: -150,
    animation: "fizz",
    dangerLevel: 2,
    safetyWarning: "Cần thực hiện trong tủ hút, axit cực mạnh",
    isBlocked: false
  },
  {
    id: "rx_327",
    name: "Bạc tác dụng với Axit Nitric loãng",
    type: "redox",
    reactants: [
      { formula: "Ag", coeff: 3, name: "Bạc" },
      { formula: "HNO₃", coeff: 4, name: "Axit Nitric loãng" }
    ],
    products: [
      { formula: "AgNO₃", coeff: 3, name: "Bạc Nitrat" },
      { formula: "NO", coeff: 1, name: "Khí Nitơ Oxit" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "3Ag + 4HNO₃(l) → 3AgNO₃ + NO↑ + 2H₂O",
    gradeLevel: 11,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Bạc tan, thoát ra khí không màu hóa nâu trong không khí.",
    energy: -80,
    animation: "fizz",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_328",
    name: "Bạc tác dụng với Axit Sunfuric đặc nóng",
    type: "redox",
    reactants: [
      { formula: "Ag", coeff: 2, name: "Bạc" },
      { formula: "H₂SO₄", coeff: 2, name: "Axit Sunfuric đặc" }
    ],
    products: [
      { formula: "Ag₂SO₄", coeff: 1, name: "Bạc Sunfat" },
      { formula: "SO₂", coeff: 1, name: "Khí Lưu huỳnh Đioxit" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "2Ag + 2H₂SO₄(đ) → Ag₂SO₄ + SO₂↑ + 2H₂O",
    gradeLevel: 11,
    category: "Kim loại",
    conditions: "Đun nóng",
    observation: "Bạc tan, thoát ra khí mùi hắc (SO₂).",
    energy: -110,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_329",
    name: "Sự xỉn màu của Bạc (Tarnishing)",
    type: "redox",
    reactants: [
      { formula: "Ag", coeff: 4, name: "Bạc" },
      { formula: "H₂S", coeff: 2, name: "Khí Hydro Sunfua" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "Ag₂S", coeff: 2, name: "Bạc Sunfua (Đen)" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "4Ag + 2H₂S + O₂ → 2Ag₂S + 2H₂O",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Môi trường không khí ẩm",
    observation: "Bề mặt bạc bị đen lại do tạo thành lớp Ag₂S.",
    energy: -600,
    animation: "color-change",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_330",
    name: "Crom tác dụng với Axit Clohidric",
    type: "single-replacement",
    reactants: [
      { formula: "Cr", coeff: 1, name: "Crom" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "CrCl₂", coeff: 1, name: "Crom(II) Clorua" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "Cr + 2HCl → CrCl₂ + H₂↑",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Không có không khí",
    observation: "Crom tan dần, thoát ra bọt khí, dung dịch có màu xanh lam.",
    energy: -90,
    animation: "fizz",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_331",
    name: "Oxy hóa Crom",
    type: "combination",
    reactants: [
      { formula: "Cr", coeff: 4, name: "Crom" },
      { formula: "O₂", coeff: 3, name: "Khí Oxy" }
    ],
    products: [
      { formula: "Cr₂O₃", coeff: 2, name: "Crom(III) Oxit" }
    ],
    equation: "4Cr + 3O₂ →(t°) 2Cr₂O₃",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Crom cháy sáng tạo lớp oxit màu xanh lục.",
    energy: -1140,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_332",
    name: "Crom tác dụng với Axit Sunfuric loãng",
    type: "single-replacement",
    reactants: [
      { formula: "Cr", coeff: 1, name: "Crom" },
      { formula: "H₂SO₄", coeff: 1, name: "Axit Sunfuric loãng" }
    ],
    products: [
      { formula: "CrSO₄", coeff: 1, name: "Crom(II) Sunfat" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "Cr + H₂SO₄ → CrSO₄ + H₂↑",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Không có không khí",
    observation: "Crom tan tạo dung dịch màu xanh lam và bọt khí.",
    energy: -85,
    animation: "fizz",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_333",
    name: "Sản xuất khí than ướt",
    type: "redox",
    reactants: [
      { formula: "C", coeff: 1, name: "Cacbon (Than)" },
      { formula: "H₂O", coeff: 1, name: "Hơi nước" }
    ],
    products: [
      { formula: "CO", coeff: 1, name: "Khí Cacbon Oxit" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "C + H₂O(h) →(1000°C) CO + H₂",
    gradeLevel: 9,
    category: "Phi kim",
    conditions: "Nhiệt độ ~1000°C",
    observation: "Than đỏ nóng tác dụng với hơi nước tạo hỗn hợp khí đốt.",
    energy: 131,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_334",
    name: "Cacbon tác dụng với Axit Sunfuric đặc",
    type: "redox",
    reactants: [
      { formula: "C", coeff: 1, name: "Cacbon" },
      { formula: "H₂SO₄", coeff: 2, name: "Axit Sunfuric đặc" }
    ],
    products: [
      { formula: "CO₂", coeff: 1, name: "Khí Cacbonic" },
      { formula: "SO₂", coeff: 2, name: "Khí Lưu huỳnh Đioxit" },
      { formula: "H₂O", coeff: 2, name: "Nước" }
    ],
    equation: "C + 2H₂SO₄(đ) →(t°) CO₂ + 2SO₂ + 2H₂O",
    gradeLevel: 10,
    category: "Phi kim",
    conditions: "Đun nóng",
    observation: "Cacbon tan dần, giải phóng hỗn hợp khí CO₂ và SO₂.",
    energy: -180,
    animation: "fizz",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_335",
    name: "Canxi tác dụng với Axit Clohidric",
    type: "single-replacement",
    reactants: [
      { formula: "Ca", coeff: 1, name: "Canxi" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "CaCl₂", coeff: 1, name: "Canxi Clorua" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "Ca + 2HCl → CaCl₂ + H₂↑",
    gradeLevel: 9,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Canxi tan nhanh, bọt khí thoát ra mãnh liệt.",
    energy: -540,
    animation: "fizz",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_336",
    name: "Oxy hóa Liti",
    type: "combination",
    reactants: [
      { formula: "Li", coeff: 4, name: "Liti" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "Li₂O", coeff: 2, name: "Liti Oxit" }
    ],
    equation: "4Li + O₂ →(t°) 2Li₂O",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Liti cháy với ngọn lửa đỏ tươi, tạo chất rắn trắng Li₂O.",
    energy: -1198,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_337",
    name: "Liti tác dụng với Clo",
    type: "combination",
    reactants: [
      { formula: "Li", coeff: 2, name: "Liti" },
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" }
    ],
    products: [
      { formula: "LiCl", coeff: 2, name: "Liti Clorua" }
    ],
    equation: "2Li + Cl₂ →(t°) 2LiCl",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Nhiệt độ cao",
    observation: "Liti cháy sáng trong khí Clo tạo muối trắng LiCl.",
    energy: -816,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_338",
    name: "Kali tác dụng với Lưu huỳnh",
    type: "combination",
    reactants: [
      { formula: "K", coeff: 2, name: "Kali" },
      { formula: "S", coeff: 1, name: "Lưu huỳnh" }
    ],
    products: [
      { formula: "K₂S", coeff: 1, name: "Kali Sunfua" }
    ],
    equation: "2K + S →(t°) K₂S",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Đun nóng nhẹ",
    observation: "Kali phản ứng mạnh với lưu huỳnh khi đun nóng.",
    energy: -450,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 2,
    safetyWarning: "Phản ứng tỏa nhiều nhiệt, cần cẩn trọng",
    isBlocked: false
  },
  {
    id: "rx_339",
    name: "Nhôm tác dụng với Brom",
    type: "combination",
    reactants: [
      { formula: "Al", coeff: 2, name: "Nhôm" },
      { formula: "Br₂", coeff: 3, name: "Brom" }
    ],
    products: [
      { formula: "AlBr₃", coeff: 2, name: "Nhôm Bromua" }
    ],
    equation: "2Al + 3Br₂ → 2AlBr₃",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiệt độ thường",
    observation: "Nhôm cháy sáng trong Brom lỏng, tỏa nhiều nhiệt và phát ra ánh sáng chói lóa.",
    energy: -1050,
    animation: "explosion",
    dangerLevel: 2,
    safetyWarning: "Phản ứng rất mãnh liệt, cần thực hiện cẩn thận.",
    isBlocked: false
  },
  {
    id: "rx_340",
    name: "Hydro tác dụng với Brom",
    type: "combination",
    reactants: [
      { formula: "H₂", coeff: 1, name: "Khí Hydro" },
      { formula: "Br₂", coeff: 1, name: "Brom" }
    ],
    products: [
      { formula: "HBr", coeff: 2, name: "Hydro Bromua" }
    ],
    equation: "H₂ + Br₂ →(t°) 2HBr",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Đun nóng",
    observation: "Hơi brom màu nâu đỏ nhạt dần, tạo ra khí hydro bromua không màu.",
    energy: -72,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_341",
    name: "Nhôm tác dụng với Iốt",
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
    conditions: "Xúc tác nước",
    observation: "Phản ứng tỏa nhiệt mạnh làm Iốt thăng hoa thành khói màu tím đặc trưng.",
    energy: -620,
    animation: "smoke",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_342",
    name: "Hydro tác dụng với Iốt",
    type: "combination",
    reactants: [
      { formula: "H₂", coeff: 1, name: "Khí Hydro" },
      { formula: "I₂", coeff: 1, name: "Iốt" }
    ],
    products: [
      { formula: "HI", coeff: 2, name: "Hydro Iotua" }
    ],
    equation: "H₂ + I₂ ⇌(t°, xt) 2HI",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Đun nóng mạnh, phản ứng thuận nghịch",
    observation: "Hơi iốt màu tím nhạt dần, tạo ra khí hydro iotua.",
    energy: 53,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_343",
    name: "Natri tác dụng với Clo",
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
    conditions: "Đun nóng",
    observation: "Natri cháy sáng chói trong bình khí Clo, tạo ra tinh thể muối ăn màu trắng.",
    energy: -822,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_344",
    name: "Đồng tác dụng với Clo",
    type: "combination",
    reactants: [
      { formula: "Cu", coeff: 1, name: "Đồng" },
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" }
    ],
    products: [
      { formula: "CuCl₂", coeff: 1, name: "Đồng(II) Clorua" }
    ],
    equation: "Cu + Cl₂ →(t°) CuCl₂",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Đun nóng",
    observation: "Đồng cháy trong khí Clo tạo thành khói màu nâu của CuCl₂ khan.",
    energy: -205,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_345",
    name: "Đặc tính Khí Trơ (Heli)",
    type: "combination",
    reactants: [
      { formula: "He", coeff: 1, name: "Heli" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "He", coeff: 1, name: "Heli" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    equation: "He + O₂ → Không phản ứng",
    gradeLevel: 10,
    category: "Khí hiếm",
    conditions: "Mọi điều kiện",
    observation: "Khí Heli hoàn toàn trơ, không phản ứng với Oxy ở bất kỳ nhiệt độ nào.",
    energy: 0,
    animation: "mix",
    dangerLevel: 0,
    safetyWarning: "Không có phản ứng xảy ra.",
    isBlocked: false
  },
  {
    id: "rx_346",
    name: "Đặc tính Khí Trơ (Neon)",
    type: "combination",
    reactants: [
      { formula: "Ne", coeff: 1, name: "Neon" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "Ne", coeff: 1, name: "Neon" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    equation: "Ne + O₂ → Không phản ứng",
    gradeLevel: 10,
    category: "Khí hiếm",
    conditions: "Mọi điều kiện",
    observation: "Khí Neon hoàn toàn trơ, không phản ứng với Oxy. Dùng làm đèn huỳnh quang.",
    energy: 0,
    animation: "mix",
    dangerLevel: 0,
    safetyWarning: "Không có phản ứng xảy ra.",
    isBlocked: false
  },
  {
    id: "rx_347",
    name: "Đặc tính Khí Trơ (Argon)",
    type: "combination",
    reactants: [
      { formula: "Ar", coeff: 1, name: "Khí Agon" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "Ar", coeff: 1, name: "Khí Agon" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    equation: "Ar + O₂ → Không phản ứng",
    gradeLevel: 10,
    category: "Khí hiếm",
    conditions: "Mọi điều kiện",
    observation: "Argon trơ về mặt hóa học, được dùng làm môi trường bảo vệ trong hàn kim loại.",
    energy: 0,
    animation: "mix",
    dangerLevel: 0,
    safetyWarning: "Không có phản ứng xảy ra.",
    isBlocked: false
  },
  {
    id: "rx_348",
    name: "Thiếc tác dụng với Oxy",
    type: "combination",
    reactants: [
      { formula: "Sn", coeff: 1, name: "Thiếc" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "SnO₂", coeff: 1, name: "Thiếc(IV) Oxit" }
    ],
    equation: "Sn + O₂ →(t°) SnO₂",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Đun nóng mạnh",
    observation: "Thiếc cháy sáng tạo thành bột oxit màu trắng.",
    energy: -580,
    animation: "burn",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_349",
    name: "Thiếc tác dụng với Axit Clohidric",
    type: "single-replacement",
    reactants: [
      { formula: "Sn", coeff: 1, name: "Thiếc" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "SnCl₂", coeff: 1, name: "Thiếc(II) Clorua" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "Sn + 2HCl → SnCl₂ + H₂↑",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Axit đặc, đun nóng nhẹ",
    observation: "Kim loại thiếc tan chậm, sủi bọt khí không màu.",
    energy: -35,
    animation: "fizz",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_350",
    name: "Chì tác dụng với Oxy",
    type: "combination",
    reactants: [
      { formula: "Pb", coeff: 2, name: "Chì" },
      { formula: "O₂", coeff: 1, name: "Khí Oxy" }
    ],
    products: [
      { formula: "PbO", coeff: 2, name: "Chì(II) Oxit" }
    ],
    equation: "2Pb + O₂ →(t°) 2PbO",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Đun nóng",
    observation: "Bề mặt chì bị mờ đi nhanh chóng, chuyển thành lớp oxit màu vàng nhạt.",
    energy: -219,
    animation: "color-change",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_351",
    name: "Chì tác dụng với Lưu huỳnh",
    type: "combination",
    reactants: [
      { formula: "Pb", coeff: 1, name: "Chì" },
      { formula: "S", coeff: 1, name: "Lưu huỳnh" }
    ],
    products: [
      { formula: "PbS", coeff: 1, name: "Chì(II) Sunfua" }
    ],
    equation: "Pb + S →(t°) PbS",
    gradeLevel: 10,
    category: "Kim loại",
    conditions: "Đun nóng",
    observation: "Tạo thành chất rắn có màu đen sẫm của chì(II) sunfua.",
    energy: -100,
    animation: "mix",
    requiresHeat: true,
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_352",
    name: "Bari tác dụng với Axit Clohidric",
    type: "single-replacement",
    reactants: [
      { formula: "Ba", coeff: 1, name: "Bari" },
      { formula: "HCl", coeff: 2, name: "Axit Clohidric" }
    ],
    products: [
      { formula: "BaCl₂", coeff: 1, name: "Bari Clorua" },
      { formula: "H₂", coeff: 1, name: "Khí Hydro" }
    ],
    equation: "Ba + 2HCl → BaCl₂ + H₂↑",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Nhiệt độ thường",
    observation: "Bari tan cực mạnh, sủi bọt khí mãnh liệt.",
    energy: -550,
    animation: "fizz",
    dangerLevel: 2,
    isBlocked: false
  },
  {
    id: "rx_353",
    name: "Beri tác dụng với Clo",
    type: "combination",
    reactants: [
      { formula: "Be", coeff: 1, name: "Beri" },
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" }
    ],
    products: [
      { formula: "BeCl₂", coeff: 1, name: "Beri Clorua" }
    ],
    equation: "Be + Cl₂ →(t°) BeCl₂",
    gradeLevel: 12,
    category: "Kim loại",
    conditions: "Đun nóng",
    observation: "Beri cháy trong khí Clo tạo ra tinh thể Beri clorua.",
    energy: -496,
    animation: "smoke",
    requiresHeat: true,
    dangerLevel: 2,
    safetyWarning: "Hợp chất của Beri rất độc.",
    isBlocked: false
  },
  {
    id: "rx_354",
    name: "Iốt tác dụng với Natri",
    type: "combination",
    reactants: [
      { formula: "Na", coeff: 2, name: "Natri" },
      { formula: "I₂", coeff: 1, name: "Iốt" }
    ],
    products: [
      { formula: "NaI", coeff: 2, name: "Natri Iotua" }
    ],
    equation: "2Na + I₂ → 2NaI",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiệt độ thường hoặc đun nhẹ",
    observation: "Phản ứng tỏa nhiệt mạnh, Iốt thăng hoa màu tím và tạo ra muối.",
    energy: -576,
    animation: "mix",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_355",
    name: "Clo đẩy Brom ra khỏi muối",
    type: "single-replacement",
    reactants: [
      { formula: "Cl₂", coeff: 1, name: "Khí Clo" },
      { formula: "NaBr", coeff: 2, name: "Natri Bromua" }
    ],
    products: [
      { formula: "NaCl", coeff: 2, name: "Natri Clorua" },
      { formula: "Br₂", coeff: 1, name: "Brom" }
    ],
    equation: "Cl₂ + 2NaBr → 2NaCl + Br₂",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiệt độ thường",
    observation: "Dung dịch chuyển sang màu vàng nâu của Brom.",
    energy: -90,
    animation: "color-change",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_356",
    name: "Brom đẩy Iốt ra khỏi muối",
    type: "single-replacement",
    reactants: [
      { formula: "Br₂", coeff: 1, name: "Brom" },
      { formula: "KI", coeff: 2, name: "Kali Iotua" }
    ],
    products: [
      { formula: "KBr", coeff: 2, name: "Kali Bromua" },
      { formula: "I₂", coeff: 1, name: "Iốt" }
    ],
    equation: "Br₂ + 2KI → 2KBr + I₂",
    gradeLevel: 10,
    category: "Halogen",
    conditions: "Nhiệt độ thường",
    observation: "Tạo ra Iốt có màu tím đen đặc trưng.",
    energy: -50,
    animation: "color-change",
    dangerLevel: 1,
    isBlocked: false
  },
  {
    id: "rx_357",
    name: "Silic tan trong kiềm",
    type: "redox",
    reactants: [
      { formula: "Si", coeff: 1, name: "Silic" },
      { formula: "NaOH", coeff: 2, name: "Natri Hidroxit" },
      { formula: "H₂O", coeff: 1, name: "Nước" }
    ],
    products: [
      { formula: "Na₂SiO₃", coeff: 1, name: "Natri Silicat" },
      { formula: "H₂", coeff: 2, name: "Khí Hydro" }
    ],
    equation: "Si + 2NaOH + H₂O → Na₂SiO₃ + 2H₂↑",
    gradeLevel: 11,
    category: "Á kim",
    conditions: "Dung dịch kiềm đặc",
    observation: "Silic tan dần, sủi bọt khí không màu.",
    energy: -120,
    animation: "fizz",
    dangerLevel: 1,
    isBlocked: false
  },
];