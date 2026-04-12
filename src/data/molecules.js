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
