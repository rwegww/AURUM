// CÆ¡ sá»Ÿ dá»¯ liá»‡u phÃ¢n tá»­ vá»›i tá»a Ä‘á»™ 3D chuáº©n hÃ³a
// Dá»¯ liá»‡u Ä‘Æ°á»£c Ä‘á»“ng bá»™ tá»« dá»± Ã¡n KL, há»— trá»£ hiá»ƒn thá»‹ 3D vÃ  xoay khÃ´ng gian

export const molecules = [
  {
    id: "h2",
    name: "Hydro (Hâ‚‚)",
    formula: "Hâ‚‚",
    category: "VÃ´ cÆ¡",
    description: "KhÃ­ hydro, phÃ¢n tá»­ Ä‘Æ¡n giáº£n nháº¥t gá»“m 2 nguyÃªn tá»­ hydro liÃªn káº¿t Ä‘Æ¡n.",
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
    name: "Oxy (Oâ‚‚)",
    formula: "Oâ‚‚",
    category: "VÃ´ cÆ¡",
    description: "KhÃ­ oxy, cáº§n thiáº¿t cho sá»± sá»‘ng vÃ  sá»± chÃ¡y. PhÃ¢n tá»­ gá»“m 2 nguyÃªn tá»­ O liÃªn káº¿t Ä‘Ã´i.",
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
    name: "NitÆ¡ (Nâ‚‚)",
    formula: "Nâ‚‚",
    category: "VÃ´ cÆ¡",
    description: "KhÃ­ nitÆ¡ chiáº¿m 78% báº§u khÃ­ quyá»ƒn. LiÃªn káº¿t ba cá»±c ká»³ bá»n vá»¯ng.",
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
    name: "NÆ°á»›c (Hâ‚‚O)",
    formula: "Hâ‚‚O",
    category: "VÃ´ cÆ¡",
    description: "PhÃ¢n tá»­ nÆ°á»›c cÃ³ cáº¥u trÃºc gÃ³c 104.5Â°. LÃ  dung mÃ´i cá»§a sá»± sá»‘ng.",
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
    name: "Cacbon Dioxit (COâ‚‚)",
    formula: "COâ‚‚",
    category: "VÃ´ cÆ¡",
    description: "KhÃ­ COâ‚‚ cÃ³ cáº¥u trÃºc tháº³ng hÃ ng hoÃ n háº£o O=C=O.",
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
    name: "Amoniac (NHâ‚ƒ)",
    formula: "NHâ‚ƒ",
    category: "VÃ´ cÆ¡",
    description: "PhÃ¢n tá»­ amoniac cÃ³ dáº¡ng hÃ¬nh chÃ³p tam giÃ¡c vá»›i N á»Ÿ Ä‘á»‰nh.",
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
    name: "Metan (CHâ‚„)",
    formula: "CHâ‚„",
    category: "Há»¯u cÆ¡",
    description: "Hydrocarbon Ä‘Æ¡n giáº£n nháº¥t, cáº¥u trÃºc tá»© diá»‡n Ä‘á»u hoÃ n háº£o.",
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
    name: "Ethanol (Câ‚‚Hâ‚…OH)",
    formula: "Câ‚‚Hâ‚…OH",
    category: "Há»¯u cÆ¡",
    description: "PhÃ¢n tá»­ rÆ°á»£u etylic, cáº¥u trÃºc gá»“m khung C-C vÃ  nhÃ³m chá»©c -OH.",
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
    name: "Axit Sunfuric (Hâ‚‚SOâ‚„)",
    formula: "Hâ‚‚SOâ‚„",
    category: "VÃ´ cÆ¡",
    description: "Axit máº¡nh, cáº¥u trÃºc tá»© diá»‡n lá»‡ch vá»›i S á»Ÿ trung tÃ¢m.",
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
    name: "Benzen (Câ‚†Hâ‚†)",
    formula: "Câ‚†Hâ‚†",
    category: "Há»¯u cÆ¡",
    description: "VÃ²ng benzen thÆ¡m, cÃ¡c liÃªn káº¿t C-C cÃ³ Ä‘á»™ dÃ i tÆ°Æ¡ng Ä‘Æ°Æ¡ng nhau (liÃªn káº¿t phi cá»¥c bá»™).",
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

// Báº£ng mÃ u nguyÃªn tá»‘ chuáº©n CPK
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

// KÃ­ch thÆ°á»›c nguyÃªn tá»­ tÆ°Æ¡ng á»©ng (Van der Waals radii tá»· lá»‡)
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

// NhÃ£n loáº¡i liÃªn káº¿t
export const bondTypeLabels = {
  single: "LiÃªn káº¿t Ä‘Æ¡n",
  double: "LiÃªn káº¿t Ä‘Ã´i",
  triple: "LiÃªn káº¿t ba",
  ionic: "LiÃªn káº¿t ion",
};

