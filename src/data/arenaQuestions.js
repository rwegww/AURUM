export const arenaQuestions = {
  // Tiêu chí độ khó: basic = 8, medium = 9, hard = 10, super = 12
  easy: [
    {
      id: "ez1",
      question: "Ký hiệu hóa học của nguyên tố Oxi là gì?",
      options: ["O", "H", "C", "N"],
      correct: 0,
      points: 10,
    },
    {
      id: "ez2",
      question: "Nước có công thức hóa học là gì?",
      options: ["HO2", "H2O", "H2O2", "OH"],
      correct: 1,
      points: 10,
    },
    {
      id: "ez3",
      question: "Khí nào duy trì sự cháy?",
      options: ["Khí Nitơ", "Khí Cacbonic", "Khí Oxi", "Khí Hidro"],
      correct: 2,
      points: 10,
    },
    {
      id: "ez4",
      question: "Hóa trị của Hidro trong các hợp chất là bao nhiêu?",
      options: ["I", "II", "III", "IV"],
      correct: 0,
      points: 10,
    },
    {
      id: "ez5",
      question: "Chất khí nào nhẹ nhất?",
      options: ["Oxi", "Hidro", "Nitơ", "Clo"],
      correct: 1,
      points: 10,
    }
  ],
  medium: [
    {
      id: "med1",
      question: "Tổng hệ số cân bằng của phương trình: Fe + O2 -> Fe3O4 là?",
      options: ["5", "6", "8", "9"],
      correct: 1, // 3Fe + 2O2 -> Fe3O4 (3+2+1 = 6)
      points: 20,
    },
    {
      id: "med2",
      question: "Cho m gam Zn tác dụng với HCl dư tạo ra 2.24 lít H2 (đktc). Tính m?",
      options: ["3.25g", "6.5g", "13g", "65g"],
      correct: 1,
      points: 20,
    },
    {
      id: "med3",
      question: "Phản ứng giữa BaCl2 và Na2SO4 tạo ra chất kết tủa màu gì?",
      options: ["Xanh lam", "Nâu đỏ", "Trắng", "Đen"],
      correct: 2, // BaSO4 trắng
      points: 20,
    },
    {
      id: "med4",
      question: "Axit nào sau đây làm quỳ tím hóa đỏ?",
      options: ["NaCl", "H2SO4", "NaOH", "H2O"],
      correct: 1,
      points: 20,
    },
    {
      id: "med5",
      question: "Nguyên tử khối của Canxi (Ca) là bao nhiêu?",
      options: ["24", "40", "56", "64"],
      correct: 1,
      points: 20,
    }
  ],
  hard: [
    {
      id: "hd1",
      question: "Hòa tan hoàn toàn 2,4g Mg vào dung dịch HNO3 đặc nóng, dư thu được khí NO2 (sản phẩm khử duy nhất). Thể tích khí NO2 (đktc) là?",
      options: ["2.24 lít", "4.48 lít", "3.36 lít", "6.72 lít"],
      correct: 1, // 4.48 lit
      points: 30,
    },
    {
      id: "hd2",
      question: "Quá trình sản xuất amoniac (Haber) sử dụng chất xúc tác là kim loại nào?",
      options: ["Niken (Ni)", "Bạch kim (Pt)", "Sắt (Fe)", "Đồng (Cu)"],
      correct: 2,
      points: 30,
    },
    {
      id: "hd3",
      question: "Số oxi hóa của Lưu huỳnh trong H2SO4 là?",
      options: ["+2", "+4", "+6", "+8"],
      correct: 2,
      points: 30,
    }
  ],
  super: [
    {
      id: "sp1",
      question: "Hỗn hợp X gồm Fe, FeO, Fe2O3, Fe3O4. Để khử hoàn toàn 11,6 gam X thành Fe cần đủ V lít khí CO (đktc). Nếu cho 11,6 gam X tác dụng với dung dịch HNO3 loãng dư thì thu được 1,12 lít khí NO (đktc). Tính V?",
      options: ["2.24", "3.36", "4.48", "5.60"],
      correct: 1, // 3.36 lit
      points: 50,
    },
    {
      id: "sp2",
      question: "Nhiệt phân hoàn toàn m gam hỗn hợp NaNO3 và Cu(NO3)2 thu được hỗn hợp khí có tỉ khối so với H2 bằng 21.6. Tính % khối lượng Cu(NO3)2 trong hỗn hợp ban đầu?",
      options: ["41.2%", "58.8%", "60%", "40%"],
      correct: 0,
      points: 50,
    }
  ]
};

// Mock Lobby Rooms
export const mockRooms = [
  { id: 'RM101', name: 'Đấu rank Lớp 8', mode: 'solo', currentPlayers: 1, maxPlayers: 2, difficulty: 'easy', status: 'waiting', host: 'Minh Tuấn' },
  { id: 'RM102', name: 'Đội tuyển HSG Hóa', mode: '3vs3', currentPlayers: 5, maxPlayers: 6, difficulty: 'hard', status: 'waiting', host: 'Thầy Đức' },
  { id: 'RM103', name: 'Ôn tập học kỳ (1vs100)', mode: '1vs100', currentPlayers: 45, maxPlayers: 100, difficulty: 'medium', status: 'playing', host: 'Cô Lan' },
];
