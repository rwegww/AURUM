export const bai2 = {
  "id": "hoa9_kntt_bai2",
  "classId": 9,
  "curriculumType": "ketnoi",
  "chapterId": 6,
  "chapterName": "Chương 6: Kim loại",
  "lessonId": 2,
  "title": "Bài 2: Dãy hoạt động hóa học",
  "description": "Nghiên cứu thứ tự hoạt động hóa học of các kim loại và ý nghĩa của dãy trong việc dự đoán phản ứng.",
  "level": "Intermediate",
  "order": 2,
  "videoModules": [
    {
      "id": "v1",
      "title": "Bí thuật: Dãy Hoạt Động Hóa Học",
      "url": "https://www.youtube.com/watch?v=Trq879pu8Mw",
      "thumbnail": "https://img.youtube.com/vi/Trq879pu8Mw/0.jpg",
      "description": "Khám phá câu thần chú vạn năng để làm chủ mọi phản ứng kim loại."
    }
  ],
  "practiceModules": [],
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Câu Thần Chú Bất Hủ",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Dãy hoạt động hóa học sắp xếp các kim loại theo chiều giảm dần mức độ hoạt động: từ cực mạnh đến cực yếu."
      }
    },
    {
      "id": "mod3",
      "type": "infoBox",
      "content": {
        "title": "Thần Chú Lướt Não",
        "content": "**K - Na - Ca - Mg - Al - Zn - Fe - Ni - Sn - Pb - (H) - Cu - Hg - Ag - Pt - Au**\n\n*Khi Nào Cần May Áo Giáp Sắt Nhớ Sang Phố Hỏi Cửa Hàng Á Phi Âu.*\n\n(Lưu ý: Kim loại đứng trước mạnh hơn, đứng sau yếu hơn).",
        "color": "blue"
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Ý Nghĩa Của Dãy Sấm Truyền",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "list",
      "content": {
        "items": [
          "**Tác dụng với nước:** 4 tiền bối (K, Na, Ba, Ca) phản ứng mãnh liệt với nước ở nhiệt độ thường tạo dung dịch Kiềm và khí $H_2$.",
          "**Tác dụng với Axit:** Kim loại đứng trước (H) đẩy được Hydro ra khỏi dung dịch axit loãng ($HCl, H_2SO_4$).",
          "**Phản ứng đẩy muối:** Kim loại mạnh hơn (đứng trước) đẩy kim loại yếu hơn (đứng sau) ra khỏi dung dịch muối (Trừ 4 kim loại tan trong nước)."
        ]
      }
    },
    {
      "id": "mod6",
      "type": "warningBox",
      "content": {
        "title": "Cảnh báo Lừa Đảo!",
        "content": "Đừng bao giờ dùng luật 'đẩy muối' cho K, Na, Ba, Ca trong dung dịch nước. Tụi nó sẽ 'ăn' nước trước khi kịp chạm vào muối! \n\nVí dụ: $Na$ vào $CuSO_4$ sẽ tạo $Cu(OH)_2$ kết tủa xanh chứ không tạo ra kim loại $Cu$.",
        "color": "orange"
      }
    }
  ],
  "challenges": [
    {
      "type": "image-selection",
      "narrative": "Trong phòng thí nghiệm, có một số kim loại cực kỳ 'hiếu động', chúng phản ứng mãnh liệt ngay khi vừa chạm vào nước.",
      "images": [
        "https://images.unsplash.com/photo-1532187863486-abf9d39d99c5?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1554110397-9bac083977c6?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=400&q=80"
      ],
      "question": "Hình ảnh nào mô tả hiện tượng Natri (Sodium) phản ứng mãnh liệt, chạy trên mặt nước và bốc cháy?",
      "correctAnswer": 0,
      "targetType": "nhận biết",
      "source": "Thí nghiệm thực tế"
    },
    {
      "type": "matching",
      "narrative": "Hãy giúp tôi phân loại các nhóm kim loại dựa theo 'quyền năng' của chúng trong dãy hoạt động.",
      "leftItems": [
        { "id": "m1", "label": "Nhóm Tan Trong Nước" },
        { "id": "m2", "label": "Nhóm Đẩy Hydro" },
        { "id": "m3", "label": "Nhóm Quý Tộc (Yếu)" }
      ],
      "items": [
        { "id": "m1", "label": "K, Na, Ba, Ca" },
        { "id": "m2", "label": "Mg, Al, Zn, Fe" },
        { "id": "m3", "label": "Cu, Ag, Au" }
      ],
      "correctOrder": ["m1", "m2", "m3"],
      "question": "Nối nhóm kim loại với danh sách các nguyên tố tương ứng.",
      "source": "Phân loại dãy"
    },
    {
      "type": "multiple-choice",
      "narrative": "Bạn được cho một mảnh Sắt (Fe) và dung dịch Đồng(II) Sunfat. Hãy dự đoán điều gì sẽ xảy ra.",
      "options": [
        "Đồng bị đẩy ra, bám màu đỏ vào đinh sắt",
        "Sắt không phản ứng với đồng",
        "Dung dịch bốc cháy mãnh liệt",
        "Sắt biến thành vàng"
      ],
      "correctAnswer": 0,
      "question": "Hiện tượng thực tế khi cho đinh sắt vào dung dịch $CuSO_4$ là gì?",
      "source": "Tính chất đẩy muối"
    },
    {
      "type": "fill-in-the-blank",
      "narrative": "Để dự đoán xem một kim loại có tác dụng được với Axit loãng hay không, ta cần so sánh vị trí của nó với một nguyên tố phi kim đặc biệt trong dãy.",
      "placeholder": "Nhập ký hiệu hóa học...",
      "correctAnswer": "H",
      "question": "Kim loại phải đứng trước nguyên tố nào trong dãy để đẩy được $H_2$ ra khỏi axit?",
      "source": "Quy tắc axit"
    },
    {
      "type": "drag-drop",
      "narrative": "Thử thách sắp xếp: Hãy đưa các kim loại sau về đúng thứ tự GIẢM DẦN mức độ hoạt động hóa học.",
      "items": [
        { "id": "d1", "label": "K (Kali)" },
        { "id": "d2", "label": "Al (Nhôm)" },
        { "id": "d3", "label": "Fe (Sắt)" },
        { "id": "d4", "label": "H (Hydro)" },
        { "id": "d5", "label": "Cu (Đồng)" }
      ],
      "correctOrder": ["d1", "d2", "d3", "d4", "d5"],
      "question": "Sắp xếp theo chiều hoạt động hóa học yếu dần.",
      "source": "Thứ tự thần chú"
    }
  ],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Kim loại nào đứng đầu dãy (mạnh nhất) trong các nguyên tố sau?",
        "options": ["K", "Fe", "Cu", "Ag"],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Kim loại đứng sau (H) có tác dụng được với HCl loãng không?",
        "options": ["Có", "Không", "Chỉ khi đun nóng", "Tùy loại axit"],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Hiện tượng khi cho Na vào nước là:",
        "options": ["Chìm xuống", "Tan chậm", "Chạy trên mặt nước, có khí thoát ra", "Không hiện tượng"],
        "correctAnswer": 2,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Phản ứng $Cu + AgNO_3 \to Cu(NO_3)_2 + Ag$ cho thấy:",
        "options": ["Cu mạnh hơn Ag", "Ag mạnh hơn Cu", "Cu và Ag mạnh bằng nhau", "Phản ứng không xảy ra"],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Tại sao không dùng K để đẩy Cu ra khỏi $CuSO_4$ trong dung dịch?",
        "options": ["K yếu hơn Cu", "K phản ứng với nước trước", "K không phản ứng với muối", "K quá đắt"],
        "correctAnswer": 1,
        "points": 10
      }
    ],
    "intermediate": [],
    "advanced": []
  }
};
