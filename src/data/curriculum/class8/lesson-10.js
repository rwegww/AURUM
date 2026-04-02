export const bai10 = {
  "id": "hoa8_kntt_bai10",
  "classId": 8,
  "lessonId": 10,
  "programId": "ketnoi",
  "curriculumType": "ketnoi",
  "title": "Bài 10: oxide",
  "chapter": "Chương 2: Một số hợp chất thông dụng",
  "order": 10,
  "isPremium": false,
  "description": "Khái niệm oxide, phân loại (acid, base, lưỡng tính, trung tính), cách gọi tên and tính chất hóa học đặc trưng.",
  "challenges": [
    {
      "type": "matching",
      "narrative": "Hãy nối công thức hóa học của các oxide with tên gọi đúng của chúng.",
      "leftItems": [
        { "id": "o1", "label": "SO2" },
        { "id": "o2", "label": "Fe2O3" },
        { "id": "o3", "label": "CO" }
      ],
      "items": [
        { "id": "o2", "label": "Sắt(III) oxide" },
        { "id": "o3", "label": "Carbon monoxide (độc)" },
        { "id": "o1", "label": "Sulfur dioxide" }
      ],
      "correctOrder": ["o1", "o2", "o3"],
      "question": "Khớp công thức with tên gọi.",
      "source": "Danh pháp hóa học"
    },
    {
      "type": "multiple-choice",
      "narrative": "Khi cho vôi sống ($CaO$) vào nước, phản ứng xảy ra rất mãnh liệt and tỏa nhiều nhiệt.",
      "options": [
        "Tạo ra dung dịch acid",
        "Tạo ra dung dịch base (kiềm)",
        "Không có phản ứng gì",
        "Tạo ra muối kết tủa"
      ],
      "correctAnswer": 1,
      "question": "Sản phẩm của phản ứng giữa oxide base (như $CaO$) and nước là gì?",
      "source": "Tính chất hóa học"
    },
    {
      "type": "fill-in-the-blank",
      "narrative": "Có một loại oxide rất đặc biệt có thể tác dụng with cả dung dịch acid and dung dịch base. Chúng được gọi là oxide ...",
      "placeholder": "Nhập từ (ví dụ: Lưỡng tính)...",
      "correctAnswer": "Lưỡng tính",
      "question": "Tên gọi của loại oxide có tính chất của cả acid and base là gì?",
      "source": "Phân loại nâng cao"
    },
    {
      "type": "drag-drop",
      "narrative": "Hãy hoàn thành sơ đồ: Oxide acid + Base $\\rightarrow$ ... + ...",
      "items": [
        { "id": "x1", "label": "Muối" },
        { "id": "x2", "label": "+" },
        { "id": "x3", "label": "Nước" }
      ],
      "correctOrder": ["x1", "x2", "x3"],
      "question": "Sản phẩm của phản ứng giữa oxide acid and dung dịch base là gì?",
      "source": "Sơ đồ phản ứng"
    }
  ],
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Khái niệm về Oxide",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Oxide là hợp chất gồm **hai nguyên tố**, trong đó có một nguyên tố là **oxygen ($O$)**. Đây là lớp hợp chất phổ biến nhất trong vỏ Trái Đất. Hầu hết các nguyên tố đều tạo được oxide."
      }
    },
    {
      "id": "mod3",
      "type": "infoBox",
      "content": {
        "title": "Công thức chung and Cách gọi tên",
        "content": "**Công thức chung**: $M_xO_y$ (M là nguyên tố hóa học, O là oxygen).\\n\\n**Cách gọi tên**:\\n- Oxide kim loại: Tên kim loại (kèm hóa trị nếu có nhiều hóa trị) + oxide.\\n  Vd: $FeO$ → Sắt(II) oxide, $Fe_2O_3$ → Sắt(III) oxide.\\n- Oxide phi kim: Dùng tiền tố (mono=1, di=2, tri=3, tetra=4, penta=5) + tên phi kim + tiền tố số O + oxide.\\n  Vd: $CO_2$ → Carbon dioxide, $SO_3$ → Sulfur trioxide, $P_2O_5$ → Diphosphorus pentoxide.",
        "color": "blue"
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Phân loại Oxide",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Oxide base**: Thường là oxide của **kim loại**, tác dụng được with dung dịch acid tạo thành muối and nước. Ví dụ: $CaO, Na_2O, BaO, CuO, Fe_2O_3$.",
          "**Oxide acid**: Thường là oxide của **phi kim**, tác dụng được with dung dịch base tạo thành muối and nước. Ví dụ: $CO_2, SO_2, SO_3, P_2O_5, N_2O_5$.",
          "**Oxide lưỡng tính**: Tác dụng được with **cả acid lẫn base** để tạo muối and nước. Ví dụ: $Al_2O_3, ZnO$.",
          "**Oxide trung tính** (Oxide không tạo muối): Không tác dụng with acid, base, nước ở điều kiện thường. Ví dụ: $CO, NO, N_2O$."
        ]
      }
    },
    {
      "id": "mod6",
      "type": "heading",
      "content": {
        "text": "3. Tính chất hóa học của Oxide base",
        "level": "h2"
      }
    },
    {
      "id": "mod7",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Tác dụng with nước** (chỉ oxide base của kim loại kiềm and kiềm thổ): Tạo thành dung dịch base (kiềm).\\n  $Na_2O + H_2O \\rightarrow 2NaOH$\\n  $CaO + H_2O \\rightarrow Ca(OH)_2$ (phản ứng tôi vôi — tỏa nhiệt mạnh).",
          "**Tác dụng with Acid**: Tạo thành muối + nước.\\n  $CuO + 2HCl \\rightarrow CuCl_2 + H_2O$ (bột đen $CuO$ tan ra, dung dịch chuyển xanh lam).",
          "**Tác dụng with Oxide acid**: Tạo thành muối.\\n  $CaO + CO_2 \\rightarrow CaCO_3$ (vôi sống hấp thụ $CO_2$)."
        ]
      }
    },
    {
      "id": "mod8",
      "type": "heading",
      "content": {
        "text": "4. Tính chất hóa học của Oxide acid",
        "level": "h2"
      }
    },
    {
      "id": "mod9",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Tác dụng with nước**: Tạo thành dung dịch acid.\\n  $SO_3 + H_2O \\rightarrow H_2SO_4$ (acid sunfuric).\\n  $CO_2 + H_2O \\rightleftharpoons H_2CO_3$ (acid cacbonic — không bền, phân hủy dễ dàng).",
          "**Tác dụng with Base tan (Kiềm)**: Tạo thành muối + nước.\\n  $CO_2 + 2NaOH \\rightarrow Na_2CO_3 + H_2O$.",
          "**Tác dụng with Oxide base**: Tạo thành muối (như đã nêu ở trên)."
        ]
      }
    },
    {
      "id": "mod10",
      "type": "heading",
      "content": {
        "text": "5. Một số Oxide quan trọng trong đời sống",
        "level": "h2"
      }
    },
    {
      "id": "mod11",
      "type": "infoBox",
      "content": {
        "title": "$CaO$ — Vôi sống (Canxi oxide)",
        "content": "- Chất rắn trắng, khi gặp nước phản ứng mãnh liệt, tỏa nhiệt cao (dùng làm túi giữ ấm, nấu ăn tự hâm nóng).\\n- **Ứng dụng**: Sản xuất vôi tôi $Ca(OH)_2$, sấy khô khí (hút ẩm), khử chua đất, xử lý nước thải.\\n- **Cảnh báo**: Cần tránh để $CaO$ tiếp xúc nước gần trẻ nhỏ vì nhiệt tỏa ra có thể gây bỏng.",
        "color": "green"
      }
    },
    {
      "id": "mod12",
      "type": "infoBox",
      "content": {
        "title": "$CO_2$ — Carbon dioxide (Khí cacbonic)",
        "content": "- Khí không màu, nặng hơn không khí ($d = 44/29 \\approx 1,52$), không duy trì sự cháy.\\n- **Ứng dụng**: Sản xuất nước giải khát có gas, bình chữa cháy, bảo quản thực phẩm, làm đá khô (giữ lạnh).\\n- **Vấn đề môi trường**: $CO_2$ là khí nhà kính chính, gây ra hiện tượng nóng lên toàn cầu. Nguồn phát thải: đốt nhiên liệu hóa thạch, phá rừng.",
        "color": "orange"
      }
    },
    {
      "id": "mod13",
      "type": "warningBox",
      "content": {
        "title": "Một số Oxide độc hại",
        "content": "- **$CO$ (Carbon monoxide)**: Khí không màu, không mùi, **rất độc**. Nó liên kết chặt with hemoglobin trong máu (mạnh gấp 200 lần $O_2$), cản trở vận chuyển oxy → gây tử vong. Nguồn: Đốt than trong phòng kín, khí thải ô tô.\\n- **$SO_2$ (Sulfur dioxide)**: Khí gây kích thích đường hô hấp, mùi hắc khó chịu. Khi gặp hơi nước tạo mưa acid ($H_2SO_3$) phá hủy công trình and cây trồng.\\n- **$NO_2$ (Nitrogen dioxide)**: Khí màu nâu đỏ, độc, có trong khói xe and khói nhà máy.",
        "color": "red"
      }
    }
  ],
  "quizzes": [],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: oxide",
      "url": "https://www.youtube.com/watch?v=l74_07GoaCk",
      "thumbnail": "https://img.youtube.com/vi/l74_07GoaCk/0.jpg",
      "description": "Phân loại Oxide and các tính chất hóa học quan trọng của acid/base oxide (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Oxide nào sau đây là Oxide axit?",
        "options": [
          "$CaO$",
          "$CuO$",
          "$CO_2$",
          "$MgO$"
        ],
        "correctAnswer": 2,
        "explanation": "CO2 tan trong nước tạo H2CO3.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Vôi sống ($CaO$) thuộc loại oxit nào?",
        "options": [
          "Oxit axit",
          "Oxit base",
          "Oxit lưỡng tính",
          "Oxit trung tính"
        ],
        "correctAnswer": 1,
        "explanation": "Oxit của kim loại kiềm thổ.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Chất nào dùng để tẩy sạch gỉ sắt trên bề mặt kim loại?",
        "options": [
          "Nước",
          "Dung dịch axit ($HCl$)",
          "Dung dịch muối",
          "Dầu hỏa"
        ],
        "correctAnswer": 1,
        "explanation": "Axit hòa tan lớp oxit gỉ sắt.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Phản ứng giữa oxit axit and oxit base tạo ra:",
        "options": [
          "Axit",
          "Base",
          "Muối",
          "Nước"
        ],
        "correctAnswer": 2,
        "explanation": "Vd: cao + CO₂ $\\rightarrow$ caco3.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Oxit nào gây ra mưa axit?",
        "options": [
          "$NO_2, SO_2$",
          "$CO_2$",
          "$H_2O$",
          "$CaO$"
        ],
        "correctAnswer": 0,
        "explanation": "Các oxit này kết hợp with nước mưa tạo axit mạnh.",
        "points": 10
      }
    ],
    "intermediate": [],
    "advanced": []
  },
  "realWorldApplications": []
};
