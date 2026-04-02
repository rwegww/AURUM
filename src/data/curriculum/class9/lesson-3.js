export const bai3 = {
  "id": "hoa9_kntt_bai3",
  "classId": 9,
  "curriculumType": "ketnoi",
  "chapterId": 6,
  "chapterName": "Chương 6: Kim loại",
  "lessonId": 3,
  "title": "Bài 3: Tách kim loại và sử dụng hợp kim",
  "description": "Khám phá các phương pháp 'giải phóng' kim loại từ quặng mỏ và sức mạnh của các loại hợp kim trong đời sống.",
  "level": "Intermediate",
  "order": 3,
  "videoModules": [
    {
      "id": "v1",
      "title": "Kỹ thuật luyện kim & Hợp kim",
      "url": "https://www.youtube.com/watch?v=sO1V9cB1O9g",
      "thumbnail": "https://img.youtube.com/vi/sO1V9cB1O9g/0.jpg",
      "description": "Hành trình từ quặng đá đến những thanh thép kiên cố."
    }
  ],
  "practiceModules": [],
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Phương Pháp Tách Kim Loại",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Trong tự nhiên, hầu hết kim loại nằm trong quặng (dưới dạng Oxide hoặc Muối). Để thu được kim loại nguyên chất, chúng ta cần thực hiện quá trình 'Khử' Ion kim loại."
      }
    },
    {
      "id": "mod3",
      "type": "infoBox",
      "content": {
        "title": "3 Chiến Thuật Luyện Kim",
        "content": "- **Điện phân nóng chảy:** Dành cho các kim loại 'vô địch' đứng đầu dãy (K, Na, Ca, Mg, Al). Ví dụ: Điện phân $Al_2O_3$ để lấy Nhôm.\n- **Nhiệt luyện:** Dùng các chất khử như $C, CO, H_2$ để chiếm Oxi của các Oxide kim loại (Zn, Fe, Sn, Pb, Cu). Ví dụ: $Fe_2O_3 + 3CO \\xrightarrow{t^o} 2Fe + 3CO_2$.\n- **Thủy luyện:** Dùng kim loại mạnh đẩy kim loại yếu ra khỏi dung dịch muối (phù hợp với Cu, Ag, Au).",
        "color": "blue"
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Hợp Kim - 'Siêu Nhân' Của Vật Liệu",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "paragraph",
      "content": {
        "text": "Hợp kim là hỗn hợp của kim loại với các nguyên tố khác (kim loại hoặc phi kim). Hợp kim thường cứng hơn, bền hơn và chống ăn mòn tốt hơn kim loại nguyên chất."
      }
    },
    {
      "id": "mod6",
      "type": "warningBox",
      "content": {
        "title": "Gang và Thép",
        "content": "- **Gang:** Chứa 2 - 5% Carbon. Rất cứng nhưng giòn.\n- **Thép:** Chứa dưới 2% Carbon. Cực kỳ bền bỉ và dẻo dai, là 'xương sống' của ngành xây dựng.",
        "color": "orange"
      }
    }
  ],
  "challenges": [
    {
      "type": "image-selection",
      "narrative": "Nhôm (Al) là kim loại phổ biến nhưng không thể tách bằng phương pháp nhiệt luyện thông thường. Ta phải dùng dòng điện cực mạnh để 'chiết' nó ra từ quặng.",
      "images": [
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1590486803833-2c7097571333?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1562243061-2045d06490a6?auto=format&fit=crop&w=400&q=80"
      ],
      "question": "Hình ảnh nào gợi nhớ đến quặng Bauxite — nguồn nguyên liệu chính chứa oxide để sản xuất Nhôm?",
      "correctAnswer": 3,
      "targetType": "nhận biết",
      "source": "Khai thác thực tế"
    },
    {
      "type": "matching",
      "narrative": "Mỗi loại quặng cần một 'chìa khóa' kỹ thuật riêng để mở khóa kim loại bên trong. Hãy giúp tôi khớp chúng lại.",
      "leftItems": [
        { "id": "me1", "label": "Luyện Nhôm (Al)" },
        { "id": "me2", "label": "Luyện Sắt (Fe)" },
        { "id": "me3", "label": "Luyện Bạc (Ag)" }
      ],
      "items": [
        { "id": "me1", "label": "Điện phân nóng chảy quặng Bauxite" },
        { "id": "me2", "label": "Lò cao (Dùng CO khử Oxide sắt)" },
        { "id": "me3", "label": "Dùng Zn đẩy Ag khỏi dung dịch muối" }
      ],
      "correctOrder": ["me1", "me2", "me3"],
      "question": "Nối mục tiêu luyện kim với phương pháp kỹ thuật tương ứng.",
      "source": "Kỹ thuật luyện kim"
    },
    {
      "type": "multiple-choice",
      "narrative": "Gang và Thép trông khá giống nhau nhưng tính chất cơ lý lại rất khác biệt. Kẻ tội đồ nào tạo nên sự khác biệt này?",
      "options": [
        "Hàm lượng Carbon (C)",
        "Dòng điện sử dụng",
        "Độ cao của lò luyện",
        "Màu của quặng sắt"
      ],
      "correctAnswer": 0,
      "question": "Thành phần phi kim nào quyết định tính chất của hợp kim sắt?",
      "source": "Hợp kim"
    },
    {
      "type": "fill-in-the-blank",
      "narrative": "Trong lò cao, người ta bơm khí Carbon oxide ($CO$) để 'cướp' lấy nguyên tử Oxi từ quặng sắt, giải phóng sắt lỏng.",
      "placeholder": "Nhập tên phương pháp...",
      "correctAnswer": "Nhiệt luyện",
      "question": "Tên gọi của phương pháp dùng chất khử ở nhiệt độ cao để luyện kim là gì?",
      "source": "Ngành sắt thép"
    },
    {
      "type": "drag-drop",
      "narrative": "Hành trình của Sắt từ quặng đến Gang: Hãy sắp xếp sự biến đổi của quặng sắt ($Fe_2O_3$) khi dần mất Oxi trong lò cao.",
      "items": [
        { "id": "f1", "label": "Quặng đỏ (Fe2O3)" },
        { "id": "f2", "label": "Oxit sắt từ (Fe3O4)" },
        { "id": "f3", "label": "Oxit sắt II (FeO)" },
        { "id": "f4", "label": "Sắt lỏng (Fe)" }
      ],
      "correctOrder": ["f1", "f2", "f3", "f4"],
      "question": "Sắp xếp chuỗi biến đổi của Sắt trong lò cao theo chiều mất dần Oxi.",
      "source": "Quy trình Lò cao"
    }
  ],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Kim loại nào sau đây được sản xuất bằng điện phân nóng chảy?",
        "options": ["Al", "Fe", "Cu", "Ag"],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Hàm lượng C trong Thép là bao nhiêu?",
        "options": ["Dưới 2%", "Trên 2%", "Trên 5%", "0%"],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Khí nào thường dùng làm chất khử trong lò cao luyện gang?",
        "options": ["$O_2$", "$CO$", "$N_2$", "$Cl_2$"],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Ưu điểm nổi bật nhất của hợp kim so với kim loại nguyên chất là:",
        "options": ["Cứng hơn, bền hơn", "Dễ nóng chảy hơn", "Mềm hơn", "Dẫn điện tốt hơn"],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Quặng nào là nguyên liệu chính để luyện gang?",
        "options": ["Bauxite", "Hematite", "Pyrite", "Thạch anh"],
        "correctAnswer": 1,
        "points": 10
      }
    ],
    "intermediate": [],
    "advanced": []
  }
};
