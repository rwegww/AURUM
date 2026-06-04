// Cơ sở dữ liệu phân tử với tọa độ 3D chuẩn hóa
// Dữ liệu được đồng bộ từ dự án KL, hỗ trợ hiển thị 3D và xoay không gian

export const molecules = [
  {
    id: "h2",
    name: "Hydro (H₂)",
    formula: "H₂",
    category: "Vô cơ",
    description: "Khí hydro, phân tử đơn giản nhất gồm 2 nguyên tử hydro liên kết đơn.",
    gradeLevel: 8,
    atoms: [
      { id: 0, element: "H", position: [-0.37, 0, 0] },
      { id: 1, element: "H", position: [0.37, 0, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: "single" }
    ]
  },
  {
    id: "o2",
    name: "Oxy (O₂)",
    formula: "O₂",
    category: "Vô cơ",
    description: "Khí oxy, cần thiết cho sự sống và sự cháy. Phân tử gồm 2 nguyên tử O liên kết đôi.",
    gradeLevel: 8,
    atoms: [
      { id: 0, element: "O", position: [-0.6, 0, 0] },
      { id: 1, element: "O", position: [0.6, 0, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: "double" }
    ]
  },
  {
    id: "n2",
    name: "Nitơ (N₂)",
    formula: "N₂",
    category: "Vô cơ",
    description: "Khí nitơ chiếm 78% bầu khí quyển. Liên kết ba cực kỳ bền vững.",
    gradeLevel: 8,
    atoms: [
      { id: 0, element: "N", position: [-0.55, 0, 0] },
      { id: 1, element: "N", position: [0.55, 0, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: "triple" }
    ]
  },
  {
    id: "h2o",
    name: "Nước (H₂O)",
    formula: "H₂O",
    category: "Vô cơ",
    description: "Phân tử nước có cấu trúc góc 104.5°. Là dung môi của sự sống.",
    gradeLevel: 8,
    atoms: [
      { id: 0, element: "O", position: [0, 0, 0] },
      { id: 1, element: "H", position: [0.757, 0.586, 0] },
      { id: 2, element: "H", position: [-0.757, 0.586, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" }
    ]
  },
  {
    id: "co2",
    name: "Cacbon Dioxit (CO₂)",
    formula: "CO₂",
    category: "Vô cơ",
    description: "Khí CO₂ có cấu trúc thẳng hàng hoàn hảo O=C=O.",
    gradeLevel: 8,
    atoms: [
      { id: 0, element: "C", position: [0, 0, 0] },
      { id: 1, element: "O", position: [-1.16, 0, 0] },
      { id: 2, element: "O", position: [1.16, 0, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "double" }
    ]
  },
  {
    id: "nh3",
    name: "Amoniac (NH₃)",
    formula: "NH₃",
    category: "Vô cơ",
    description: "Phân tử amoniac có dạng hình chóp tam giác với N ở đỉnh.",
    gradeLevel: 10,
    atoms: [
      { id: 0, element: "N", position: [0, 0, 0.38] },
      { id: 1, element: "H", position: [0.94, 0, -0.12] },
      { id: 2, element: "H", position: [-0.47, 0.81, -0.12] },
      { id: 3, element: "H", position: [-0.47, -0.81, -0.12] }
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" }
    ]
  },
  {
    id: "ch4",
    name: "Metan (CH₄)",
    formula: "CH₄",
    category: "Hữu cơ",
    description: "Hydrocarbon đơn giản nhất, cấu trúc tứ diện đều hoàn hảo.",
    gradeLevel: 11,
    atoms: [
      { id: 0, element: "C", position: [0, 0, 0] },
      { id: 1, element: "H", position: [0.63, 0.63, 0.63] },
      { id: 2, element: "H", position: [-0.63, -0.63, 0.63] },
      { id: 3, element: "H", position: [-0.63, 0.63, -0.63] },
      { id: 4, element: "H", position: [0.63, -0.63, -0.63] }
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" },
      { from: 0, to: 4, type: "single" }
    ]
  },
  {
    id: "c2h5oh",
    name: "Ethanol (C₂H₅OH)",
    formula: "C₂H₅OH",
    category: "Hữu cơ",
    description: "Phân tử rượu etylic, cấu trúc gồm khung C-C và nhóm chức -OH.",
    gradeLevel: 11,
    atoms: [
      { id: 0, element: "C", position: [-0.76, 0, 0] },
      { id: 1, element: "C", position: [0.76, 0, 0] },
      { id: 2, element: "O", position: [1.43, 1.2, 0] },
      { id: 3, element: "H", position: [2.0, 1.5, 0.7] },
      { id: 4, element: "H", position: [-1.16, 0.51, 0.89] },
      { id: 5, element: "H", position: [-1.16, 0.51, -0.89] },
      { id: 6, element: "H", position: [-1.16, -1.03, 0] },
      { id: 7, element: "H", position: [1.16, -0.51, 0.89] },
      { id: 8, element: "H", position: [1.16, -0.51, -0.89] }
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 1, to: 2, type: "single" },
      { from: 2, to: 3, type: "single" },
      { from: 0, to: 4, type: "single" },
      { from: 0, to: 5, type: "single" },
      { from: 0, to: 6, type: "single" },
      { from: 1, to: 7, type: "single" },
      { from: 1, to: 8, type: "single" }
    ]
  },
  {
    id: "h2so4",
    name: "Axit Sunfuric (H₂SO₄)",
    formula: "H₂SO₄",
    category: "Vô cơ",
    description: "Axit mạnh, cấu trúc tứ diện lệch với S ở trung tâm.",
    gradeLevel: 10,
    atoms: [
      { id: 0, element: "S", position: [0, 0, 0] },
      { id: 1, element: "O", position: [1.42, 0, 0] },
      { id: 2, element: "O", position: [-1.42, 0, 0] },
      { id: 3, element: "O", position: [0, 1.42, 0] },
      { id: 4, element: "O", position: [0, -1.42, 0] },
      { id: 5, element: "H", position: [0.97, 1.89, 0] },
      { id: 6, element: "H", position: [-0.97, -1.89, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "double" },
      { from: 0, to: 3, type: "single" },
      { from: 0, to: 4, type: "single" },
      { from: 3, to: 5, type: "single" },
      { from: 4, to: 6, type: "single" }
    ]
  },
  {
    id: "c6h6",
    name: "Benzen (C₆H₆)",
    formula: "C₆H₆",
    category: "Hữu cơ",
    description: "Vòng benzen thơm, các liên kết C-C có độ dài tương đương nhau (liên kết phi cục bộ).",
    gradeLevel: 11,
    atoms: [
      { id: 0, element: "C", position: [1.4, 0, 0] },
      { id: 1, element: "C", position: [0.7, 1.21, 0] },
      { id: 2, element: "C", position: [-0.7, 1.21, 0] },
      { id: 3, element: "C", position: [-1.4, 0, 0] },
      { id: 4, element: "C", position: [-0.7, -1.21, 0] },
      { id: 5, element: "C", position: [0.7, -1.21, 0] },
      { id: 6, element: "H", position: [2.49, 0, 0] },
      { id: 7, element: "H", position: [1.24, 2.16, 0] },
      { id: 8, element: "H", position: [-1.24, 2.16, 0] },
      { id: 9, element: "H", position: [-2.49, 0, 0] },
      { id: 10, element: "H", position: [-1.24, -2.16, 0] },
      { id: 11, element: "H", position: [1.24, -2.16, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 1, to: 2, type: "single" },
      { from: 2, to: 3, type: "double" },
      { from: 3, to: 4, type: "single" },
      { from: 4, to: 5, type: "double" },
      { from: 5, to: 0, type: "single" },
      { from: 0, to: 6, type: "single" },
      { from: 1, to: 7, type: "single" },
      { from: 2, to: 8, type: "single" },
      { from: 3, to: 9, type: "single" },
      { from: 4, to: 10, type: "single" },
      { from: 5, to: 11, type: "single" }
    ]
  },
  {
    id: "hcl",
    name: "Hydro Clorua (HCl)",
    formula: "HCl",
    category: "Vô cơ",
    description: "Phân tử phân cực mạnh; khi tan trong nước tạo axit clohidric.",
    gradeLevel: 9,
    atoms: [
      { id: 0, element: "H", position: [-0.64, 0, 0] },
      { id: 1, element: "Cl", position: [0.64, 0, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: "single" }]
  },
  {
    id: "cl2",
    name: "Clo (Cl₂)",
    formula: "Cl₂",
    category: "Vô cơ",
    description: "Khí halogen màu vàng lục, gồm hai nguyên tử clo liên kết cộng hóa trị đơn.",
    gradeLevel: 10,
    atoms: [
      { id: 0, element: "Cl", position: [-0.99, 0, 0] },
      { id: 1, element: "Cl", position: [0.99, 0, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: "single" }]
  },
  {
    id: "nacl",
    name: "Natri Clorua (NaCl)",
    formula: "NaCl",
    category: "Muối",
    description: "Mô hình cặp ion Na⁺ và Cl⁻ trong mạng tinh thể muối ăn.",
    gradeLevel: 8,
    atoms: [
      { id: 0, element: "Na", position: [-0.9, 0, 0] },
      { id: 1, element: "Cl", position: [0.9, 0, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: "ionic" }]
  },
  {
    id: "naoh",
    name: "Natri Hidroxit (NaOH)",
    formula: "NaOH",
    category: "Bazơ",
    description: "Bazơ mạnh gồm ion Na⁺ và nhóm hydroxide OH⁻.",
    gradeLevel: 9,
    atoms: [
      { id: 0, element: "Na", position: [-1.35, 0, 0] },
      { id: 1, element: "O", position: [0, 0, 0] },
      { id: 2, element: "H", position: [0.92, 0.28, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: "ionic" },
      { from: 1, to: 2, type: "single" }
    ]
  },
  {
    id: "caco3",
    name: "Canxi Cacbonat (CaCO₃)",
    formula: "CaCO₃",
    category: "Muối",
    description: "Mô hình ion Ca²⁺ tương tác với nhóm carbonate CO₃²⁻ dạng tam giác phẳng.",
    gradeLevel: 9,
    atoms: [
      { id: 0, element: "Ca", position: [-1.55, 0, 0.25] },
      { id: 1, element: "C", position: [0, 0, 0] },
      { id: 2, element: "O", position: [1.15, 0, 0] },
      { id: 3, element: "O", position: [-0.58, 1.0, 0] },
      { id: 4, element: "O", position: [-0.58, -1.0, 0] }
    ],
    bonds: [
      { from: 0, to: 3, type: "ionic" },
      { from: 1, to: 2, type: "double" },
      { from: 1, to: 3, type: "single" },
      { from: 1, to: 4, type: "single" }
    ]
  },
  {
    id: "fe3o4",
    name: "Oxit Sắt Từ (Fe₃O₄)",
    formula: "Fe₃O₄",
    category: "Oxit",
    description: "Cụm mô phỏng đơn vị magnetite, nhấn mạnh mạng Fe-O thay vì một phân tử riêng lẻ.",
    gradeLevel: 9,
    atoms: [
      { id: 0, element: "O", position: [0, 0, 0] },
      { id: 1, element: "Fe", position: [1.15, 0, 0.55] },
      { id: 2, element: "Fe", position: [-0.58, 1.0, -0.35] },
      { id: 3, element: "Fe", position: [-0.58, -1.0, -0.35] },
      { id: 4, element: "O", position: [0, 1.45, 0.8] },
      { id: 5, element: "O", position: [-1.25, -0.72, 0.8] },
      { id: 6, element: "O", position: [1.25, -0.72, -0.8] }
    ],
    bonds: [
      { from: 0, to: 1, type: "ionic" },
      { from: 0, to: 2, type: "ionic" },
      { from: 0, to: 3, type: "ionic" },
      { from: 1, to: 4, type: "ionic" },
      { from: 2, to: 5, type: "ionic" },
      { from: 3, to: 6, type: "ionic" }
    ]
  },
  {
    id: "h2s",
    name: "Hydro Sunfua (H₂S)",
    formula: "H₂S",
    category: "Vô cơ",
    description: "Phân tử dạng góc, có mùi trứng thối đặc trưng.",
    gradeLevel: 10,
    atoms: [
      { id: 0, element: "S", position: [0, 0, 0] },
      { id: 1, element: "H", position: [0.92, 0.42, 0] },
      { id: 2, element: "H", position: [-0.92, 0.42, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" }
    ]
  },
  {
    id: "so2",
    name: "Lưu huỳnh Dioxit (SO₂)",
    formula: "SO₂",
    category: "Vô cơ",
    description: "Phân tử dạng góc do cặp electron tự do trên lưu huỳnh.",
    gradeLevel: 10,
    atoms: [
      { id: 0, element: "S", position: [0, 0, 0] },
      { id: 1, element: "O", position: [1.22, 0.58, 0] },
      { id: 2, element: "O", position: [-1.22, 0.58, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "double" }
    ]
  },
  {
    id: "o3",
    name: "Ozon (O₃)",
    formula: "O₃",
    category: "Vô cơ",
    description: "Dạng thù hình của oxy, có cấu trúc góc và liên kết cộng hưởng.",
    gradeLevel: 10,
    atoms: [
      { id: 0, element: "O", position: [0, 0, 0] },
      { id: 1, element: "O", position: [1.08, 0.55, 0] },
      { id: 2, element: "O", position: [-1.08, 0.55, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "single" }
    ]
  },
  {
    id: "h2o2",
    name: "Hydro Peroxit (H₂O₂)",
    formula: "H₂O₂",
    category: "Vô cơ",
    description: "Phân tử có liên kết O-O; dung dịch quen thuộc là nước oxy già.",
    gradeLevel: 10,
    atoms: [
      { id: 0, element: "O", position: [-0.72, 0, 0.2] },
      { id: 1, element: "O", position: [0.72, 0, -0.2] },
      { id: 2, element: "H", position: [-1.25, 0.78, 0.2] },
      { id: 3, element: "H", position: [1.25, -0.78, -0.2] }
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
      { from: 1, to: 3, type: "single" }
    ]
  },
  {
    id: "c2h6",
    name: "Etan (C₂H₆)",
    formula: "C₂H₆",
    category: "Hữu cơ",
    description: "Ankan đơn giản với liên kết đơn C-C và hình học gần tứ diện quanh mỗi carbon.",
    gradeLevel: 11,
    atoms: [
      { id: 0, element: "C", position: [-0.77, 0, 0] },
      { id: 1, element: "C", position: [0.77, 0, 0] },
      { id: 2, element: "H", position: [-1.15, 0.92, 0.45] },
      { id: 3, element: "H", position: [-1.15, -0.92, 0.45] },
      { id: 4, element: "H", position: [-1.15, 0, -0.95] },
      { id: 5, element: "H", position: [1.15, 0.92, -0.45] },
      { id: 6, element: "H", position: [1.15, -0.92, -0.45] },
      { id: 7, element: "H", position: [1.15, 0, 0.95] }
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" },
      { from: 0, to: 4, type: "single" },
      { from: 1, to: 5, type: "single" },
      { from: 1, to: 6, type: "single" },
      { from: 1, to: 7, type: "single" }
    ]
  },
  {
    id: "c2h4",
    name: "Eten (C₂H₄)",
    formula: "C₂H₄",
    category: "Hữu cơ",
    description: "Anken đơn giản nhất, phân tử phẳng với liên kết đôi C=C.",
    gradeLevel: 11,
    atoms: [
      { id: 0, element: "C", position: [-0.67, 0, 0] },
      { id: 1, element: "C", position: [0.67, 0, 0] },
      { id: 2, element: "H", position: [-1.2, 0.9, 0] },
      { id: 3, element: "H", position: [-1.2, -0.9, 0] },
      { id: 4, element: "H", position: [1.2, 0.9, 0] },
      { id: 5, element: "H", position: [1.2, -0.9, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" },
      { from: 1, to: 4, type: "single" },
      { from: 1, to: 5, type: "single" }
    ]
  },
  {
    id: "c2h2",
    name: "Axetilen (C₂H₂)",
    formula: "C₂H₂",
    category: "Hữu cơ",
    description: "Ankin đơn giản nhất, phân tử thẳng với liên kết ba C≡C.",
    gradeLevel: 11,
    atoms: [
      { id: 0, element: "H", position: [-1.8, 0, 0] },
      { id: 1, element: "C", position: [-0.6, 0, 0] },
      { id: 2, element: "C", position: [0.6, 0, 0] },
      { id: 3, element: "H", position: [1.8, 0, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 1, to: 2, type: "triple" },
      { from: 2, to: 3, type: "single" }
    ]
  },
  {
    id: "ch3cooh",
    name: "Axit Axetic (CH₃COOH)",
    formula: "CH₃COOH",
    category: "Hữu cơ",
    description: "Axit hữu cơ chính trong giấm, có nhóm chức carboxyl -COOH.",
    gradeLevel: 11,
    atoms: [
      { id: 0, element: "C", position: [-0.85, 0, 0] },
      { id: 1, element: "C", position: [0.55, 0, 0] },
      { id: 2, element: "O", position: [1.2, 1.05, 0] },
      { id: 3, element: "O", position: [1.25, -1.05, 0] },
      { id: 4, element: "H", position: [1.95, -1.18, 0] },
      { id: 5, element: "H", position: [-1.25, 0.95, 0.25] },
      { id: 6, element: "H", position: [-1.25, -0.95, 0.25] },
      { id: 7, element: "H", position: [-1.35, 0, -0.9] }
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 1, to: 2, type: "double" },
      { from: 1, to: 3, type: "single" },
      { from: 3, to: 4, type: "single" },
      { from: 0, to: 5, type: "single" },
      { from: 0, to: 6, type: "single" },
      { from: 0, to: 7, type: "single" }
    ]
  }
];

// Bảng màu nguyên tố chuẩn CPK
export const elementColors = {
  H: "#e2e8f0", // Light silver/gray instead of pure white to be visible on white bg
  C: "#2c3e50",
  N: "#3498db",
  O: "#e74c3c",
  S: "#f1c40f",
  P: "#e67e22",
  Cl: "#27ae60",
  Na: "#f39c12",
  Mg: "#2ecc71",
  Fe: "#d35400",
  Ca: "#1abc9c",
  K: "#9b59b6",
  Al: "#95a5a6",
  Zn: "#7f8c8d",
  Cu: "#e67e22",
  Br: "#c0392b",
  F: "#2ecc71",
};

// Kích thước nguyên tử tương ứng (Van der Waals radii tỷ lệ)
export const elementRadii = {
  H: 12,
  C: 17,
  N: 15,
  O: 15,
  S: 18,
  P: 18,
  Cl: 17,
  Na: 22,
  Mg: 17,
  Fe: 20,
  Ca: 23,
  K: 28,
  Al: 18,
  Zn: 14,
  Cu: 14,
};

// Nhãn loại liên kết
export const bondTypeLabels = {
  single: "Liên kết đơn",
  double: "Liên kết đôi",
  triple: "Liên kết ba",
  ionic: "Liên kết ion",
};

