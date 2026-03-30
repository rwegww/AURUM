// Cơ sở dữ liệu phân tử với tọa độ 2D cho mô hình ball-and-stick
// Mỗi phân tử gồm: atoms (vị trí + nguyên tố) và bonds (liên kết giữa các nguyên tử)

export const molecules = [
  {
    id: "h2o",
    name: "Nước",
    formula: "H₂O",
    category: "Vô cơ",
    description: "Phân tử nước gồm 1 nguyên tử Oxy liên kết với 2 nguyên tử Hydro. Góc liên kết 104.5°.",
    gradeLevel: 8,
    atoms: [
      { id: 0, element: "O", x: 200, y: 150, color: "#e74c3c", radius: 28 },
      { id: 1, element: "H", x: 120, y: 230, color: "#ecf0f1", radius: 18 },
      { id: 2, element: "H", x: 280, y: 230, color: "#ecf0f1", radius: 18 },
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
    ]
  },
  {
    id: "co2",
    name: "Cacbon Dioxit",
    formula: "CO₂",
    category: "Vô cơ",
    description: "Phân tử CO₂ có cấu trúc thẳng. 1 nguyên tử C liên kết đôi với 2 nguyên tử O.",
    gradeLevel: 8,
    atoms: [
      { id: 0, element: "C", x: 200, y: 180, color: "#2c3e50", radius: 24 },
      { id: 1, element: "O", x: 100, y: 180, color: "#e74c3c", radius: 28 },
      { id: 2, element: "O", x: 300, y: 180, color: "#e74c3c", radius: 28 },
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "double" },
    ]
  },
  {
    id: "ch4",
    name: "Metan",
    formula: "CH₄",
    category: "Hữu cơ",
    description: "Phân tử Metan: 1 C ở trung tâm liên kết với 4 H. Cấu trúc tứ diện đều (2D phẳng).",
    gradeLevel: 11,
    atoms: [
      { id: 0, element: "C", x: 200, y: 180, color: "#2c3e50", radius: 24 },
      { id: 1, element: "H", x: 200, y: 80, color: "#ecf0f1", radius: 18 },
      { id: 2, element: "H", x: 300, y: 200, color: "#ecf0f1", radius: 18 },
      { id: 3, element: "H", x: 200, y: 280, color: "#ecf0f1", radius: 18 },
      { id: 4, element: "H", x: 100, y: 200, color: "#ecf0f1", radius: 18 },
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" },
      { from: 0, to: 4, type: "single" },
    ]
  },
  {
    id: "nacl",
    name: "Natri Clorua",
    formula: "NaCl",
    category: "Vô cơ",
    description: "Liên kết ion giữa Na⁺ và Cl⁻. Na nhường 1 electron cho Cl.",
    gradeLevel: 9,
    atoms: [
      { id: 0, element: "Na", x: 150, y: 180, color: "#f39c12", radius: 30 },
      { id: 1, element: "Cl", x: 270, y: 180, color: "#27ae60", radius: 32 },
    ],
    bonds: [
      { from: 0, to: 1, type: "ionic" },
    ]
  },
  {
    id: "h2so4",
    name: "Axit Sunfuric",
    formula: "H₂SO₄",
    category: "Vô cơ",
    description: "Axit mạnh, gồm S ở trung tâm liên kết với 4 O, 2 trong số đó liên kết với H.",
    gradeLevel: 10,
    atoms: [
      { id: 0, element: "S", x: 200, y: 180, color: "#f1c40f", radius: 26 },
      { id: 1, element: "O", x: 200, y: 80, color: "#e74c3c", radius: 22 },
      { id: 2, element: "O", x: 300, y: 180, color: "#e74c3c", radius: 22 },
      { id: 3, element: "O", x: 200, y: 280, color: "#e74c3c", radius: 22 },
      { id: 4, element: "O", x: 100, y: 180, color: "#e74c3c", radius: 22 },
      { id: 5, element: "H", x: 310, y: 100, color: "#ecf0f1", radius: 16 },
      { id: 6, element: "H", x: 90, y: 260, color: "#ecf0f1", radius: 16 },
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "double" },
      { from: 0, to: 4, type: "single" },
      { from: 2, to: 5, type: "single" },
      { from: 4, to: 6, type: "single" },
    ]
  },
  {
    id: "c2h5oh",
    name: "Etanol (Rượu Etylic)",
    formula: "C₂H₅OH",
    category: "Hữu cơ",
    description: "Phân tử rượu etylic gồm 2 nguyên tử C, nhóm OH, và 5 nguyên tử H.",
    gradeLevel: 11,
    atoms: [
      { id: 0, element: "C", x: 140, y: 180, color: "#2c3e50", radius: 24 },
      { id: 1, element: "C", x: 260, y: 180, color: "#2c3e50", radius: 24 },
      { id: 2, element: "O", x: 340, y: 120, color: "#e74c3c", radius: 22 },
      { id: 3, element: "H", x: 80, y: 110, color: "#ecf0f1", radius: 16 },
      { id: 4, element: "H", x: 80, y: 250, color: "#ecf0f1", radius: 16 },
      { id: 5, element: "H", x: 140, y: 280, color: "#ecf0f1", radius: 16 },
      { id: 6, element: "H", x: 260, y: 280, color: "#ecf0f1", radius: 16 },
      { id: 7, element: "H", x: 320, y: 240, color: "#ecf0f1", radius: 16 },
      { id: 8, element: "H", x: 410, y: 80, color: "#ecf0f1", radius: 16 },
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 1, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" },
      { from: 0, to: 4, type: "single" },
      { from: 0, to: 5, type: "single" },
      { from: 1, to: 6, type: "single" },
      { from: 1, to: 7, type: "single" },
      { from: 2, to: 8, type: "single" },
    ]
  },
  {
    id: "hcl",
    name: "Axit Clohidric",
    formula: "HCl",
    category: "Vô cơ",
    description: "Liên kết cộng hóa trị phân cực giữa H và Cl.",
    gradeLevel: 9,
    atoms: [
      { id: 0, element: "H", x: 150, y: 180, color: "#ecf0f1", radius: 18 },
      { id: 1, element: "Cl", x: 270, y: 180, color: "#27ae60", radius: 32 },
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
    ]
  },
  {
    id: "nh3",
    name: "Amoniac",
    formula: "NH₃",
    category: "Vô cơ",
    description: "1 nguyên tử N liên kết với 3 nguyên tử H. Dạng chóp tam giác.",
    gradeLevel: 10,
    atoms: [
      { id: 0, element: "N", x: 200, y: 140, color: "#3498db", radius: 26 },
      { id: 1, element: "H", x: 120, y: 240, color: "#ecf0f1", radius: 18 },
      { id: 2, element: "H", x: 200, y: 260, color: "#ecf0f1", radius: 18 },
      { id: 3, element: "H", x: 280, y: 240, color: "#ecf0f1", radius: 18 },
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" },
    ]
  },
  {
    id: "c6h12o6",
    name: "Glucozơ",
    formula: "C₆H₁₂O₆",
    category: "Hữu cơ",
    description: "Đường đơn (monosaccarit). Mạch hở 6C thẳng với nhiều nhóm OH. (Biểu diễn đơn giản hóa)",
    gradeLevel: 12,
    atoms: [
      { id: 0, element: "C", x: 80, y: 180, color: "#2c3e50", radius: 20 },
      { id: 1, element: "C", x: 140, y: 140, color: "#2c3e50", radius: 20 },
      { id: 2, element: "C", x: 200, y: 180, color: "#2c3e50", radius: 20 },
      { id: 3, element: "C", x: 260, y: 140, color: "#2c3e50", radius: 20 },
      { id: 4, element: "C", x: 320, y: 180, color: "#2c3e50", radius: 20 },
      { id: 5, element: "C", x: 380, y: 140, color: "#2c3e50", radius: 20 },
      { id: 6, element: "O", x: 80, y: 100, color: "#e74c3c", radius: 18 },
      { id: 7, element: "O", x: 140, y: 220, color: "#e74c3c", radius: 16 },
      { id: 8, element: "O", x: 200, y: 100, color: "#e74c3c", radius: 16 },
      { id: 9, element: "O", x: 260, y: 220, color: "#e74c3c", radius: 16 },
      { id: 10, element: "O", x: 320, y: 100, color: "#e74c3c", radius: 16 },
      { id: 11, element: "O", x: 380, y: 220, color: "#e74c3c", radius: 16 },
    ],
    bonds: [
      { from: 0, to: 1, type: "single" },
      { from: 1, to: 2, type: "single" },
      { from: 2, to: 3, type: "single" },
      { from: 3, to: 4, type: "single" },
      { from: 4, to: 5, type: "single" },
      { from: 0, to: 6, type: "double" },
      { from: 1, to: 7, type: "single" },
      { from: 2, to: 8, type: "single" },
      { from: 3, to: 9, type: "single" },
      { from: 4, to: 10, type: "single" },
      { from: 5, to: 11, type: "single" },
    ]
  },
  {
    id: "o2",
    name: "Khí Oxy",
    formula: "O₂",
    category: "Vô cơ",
    description: "2 nguyên tử Oxy liên kết đôi với nhau.",
    gradeLevel: 8,
    atoms: [
      { id: 0, element: "O", x: 160, y: 180, color: "#e74c3c", radius: 28 },
      { id: 1, element: "O", x: 260, y: 180, color: "#e74c3c", radius: 28 },
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
    ]
  },
  {
    id: "n2",
    name: "Khí Nitơ",
    formula: "N₂",
    category: "Vô cơ",
    description: "2 nguyên tử Nitơ liên kết ba — liên kết rất bền vững.",
    gradeLevel: 10,
    atoms: [
      { id: 0, element: "N", x: 160, y: 180, color: "#3498db", radius: 26 },
      { id: 1, element: "N", x: 260, y: 180, color: "#3498db", radius: 26 },
    ],
    bonds: [
      { from: 0, to: 1, type: "triple" },
    ]
  },
  {
    id: "c2h4",
    name: "Etylen",
    formula: "C₂H₄",
    category: "Hữu cơ",
    description: "Anken đơn giản nhất. 2 C liên kết đôi, mỗi C gắn 2 H.",
    gradeLevel: 11,
    atoms: [
      { id: 0, element: "C", x: 160, y: 180, color: "#2c3e50", radius: 24 },
      { id: 1, element: "C", x: 270, y: 180, color: "#2c3e50", radius: 24 },
      { id: 2, element: "H", x: 90, y: 120, color: "#ecf0f1", radius: 16 },
      { id: 3, element: "H", x: 90, y: 240, color: "#ecf0f1", radius: 16 },
      { id: 4, element: "H", x: 340, y: 120, color: "#ecf0f1", radius: 16 },
      { id: 5, element: "H", x: 340, y: 240, color: "#ecf0f1", radius: 16 },
    ],
    bonds: [
      { from: 0, to: 1, type: "double" },
      { from: 0, to: 2, type: "single" },
      { from: 0, to: 3, type: "single" },
      { from: 1, to: 4, type: "single" },
      { from: 1, to: 5, type: "single" },
    ]
  },
];

// Bảng màu nguyên tố chuẩn CPK
export const elementColors = {
  H: "#ffffff",
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

// Bond type labels
export const bondTypeLabels = {
  single: "Liên kết đơn",
  double: "Liên kết đôi",
  triple: "Liên kết ba",
  ionic: "Liên kết ion",
};
