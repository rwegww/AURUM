export const bai9 = {
  "id": "hoa8_kntt_bai9",
  "classId": 8,
  "lessonId": 9,
  "programId": "ketnoi",
  "curriculumType": "ketnoi",
  "title": "Bài 9: Base - Thang pH",
  "chapter": "Chương 2: Một số hợp chất thông dụng",
  "order": 9,
  "isPremium": false,
  "description": "Khái niệm base, cách gọi tên, tính chất hóa học (chỉ thị, trung hòa, + oxide acid) and thang pH.",
  "challenges": [
    {
      "type": "matching",
      "narrative": "Hãy nối các base sau with độ tan của chúng trong nước.",
      "leftItems": [
        { "id": "b1", "label": "Natri hydroxide (NaOH)" },
        { "id": "b2", "label": "Đồng(II) hydroxide (Cu(OH)2)" },
        { "id": "b3", "label": "Canxi hydroxide (Ca(OH)2)" }
      ],
      "items": [
        { "id": "b2", "label": "Không tan (kết tủa xanh)" },
        { "id": "b1", "label": "Tan rất tốt (kiềm)" },
        { "id": "b3", "label": "Ít tan (nước vôi)" }
      ],
      "correctOrder": ["b1", "b2", "b3"],
      "question": "Phân loại base theo tính tan.",
      "source": "Tính chất vật lý"
    },
    {
      "type": "multiple-choice",
      "narrative": "Base là những hợp chất có vị đắng and cảm giác nhờn như xà phòng. Để nhận biết chúng, ta dùng chỉ thị màu.",
      "options": [
        "Làm quỳ tím hóa xanh",
        "Làm quỳ tím hóa đỏ",
        "Làm phenolphthalein mất màu",
        "Không làm đổi màu chỉ thị"
      ],
      "correctAnswer": 0,
      "question": "Dung dịch kiềm (base tan) có tính chất gì sau đây?",
      "source": "Chất chỉ thị"
    },
    {
      "type": "fill-in-the-blank",
      "narrative": "Thang pH dùng để đo độ acid hoặc base. Một dung dịch trung tính (như nước tinh khiết) có một giá trị pH xác định.",
      "placeholder": "Nhập số...",
      "correctAnswer": "7",
      "question": "Giá trị pH của môi trường trung tính là bao nhiêu?",
      "source": "Thang pH"
    },
    {
      "type": "drag-drop",
      "narrative": "Hãy sắp xếp các môi trường theo thứ tự pH tăng dần (từ Acid đến Base).",
      "items": [
        { "id": "p1", "label": "Dịch vị dạ dày (pH 1-2)" },
        { "id": "p2", "label": "Nước tinh khiết (pH 7)" },
        { "id": "p3", "label": "Nước xà phòng (pH 9-10)" }
      ],
      "correctOrder": ["p1", "p2", "p3"],
      "question": "Sắp xếp theo thứ tự pH từ thấp đến cao.",
      "source": "So sánh pH"
    }
  ],
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Khái niệm về Base",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Base là hợp chất mà phân tử gồm có một nguyên tử kim loại liên kết with một hay nhiều nhóm **hydroxide ($-OH$)**. Khi tan trong nước, base phân li tạo ra ion $OH^-$, chính ion này quyết định tính chất đặc trưng của base."
      }
    },
    {
      "id": "mod3",
      "type": "infoBox",
      "content": {
        "title": "Công thức, Tên gọi and Phân loại",
        "content": "**Công thức chung**: $M(OH)_n$ ($M$ là kim loại, $n$ là hóa trị).\\n**Tên gọi**: Tên kim loại (kèm hóa trị nếu cần) + hydroxide.\\n\\n**Phân loại**:\\n1. **Base tan trong nước (Kiềm)**: $NaOH$ (natri hydroxide), $KOH$ (kali hydroxide), $Ba(OH)_2$ (bari hydroxide), $Ca(OH)_2$ (canxi hydroxide — vôi tôi, ít tan).\\n2. **Base không tan trong nước**: $Cu(OH)_2$ (đồng(II) hydroxide — màu xanh lam), $Fe(OH)_3$ (sắt(III) hydroxide — màu nâu đỏ), $Al(OH)_3$ (nhôm hydroxide — keo trắng).\\n\\n**Nhận biết**: Chỉ base tan (kiềm) mới có thể dùng chỉ thị để nhận biết.",
        "color": "blue"
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Tính chất hóa học của Base",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "paragraph",
      "content": {
        "text": "Base có những tính chất hóa học đặc trưng, chia thành hai nhóm: tính chất chung (của cả base tan and không tan) and tính chất riêng."
      }
    },
    {
      "id": "mod6",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**a) Đổi màu chỉ thị** (Chỉ base tan — kiềm):\\n  - Quỳ tím → **xanh**.\\n  - Phenolphthalein không màu → **hồng**.\\n  Đây là cách nhận biết base tan đơn giản and nhanh nhất.",
          "**b) Tác dụng with Acid** (Phản ứng trung hòa — cả base tan and không tan):\\n  Base + Acid → Muối + Nước.\\n  *Ví dụ 1*: $NaOH + HCl \\rightarrow NaCl + H_2O$\\n  *Ví dụ 2*: $Cu(OH)_2 + 2HCl \\rightarrow CuCl_2 + 2H_2O$ (kết tủa xanh tan dần, dung dịch chuyển xanh lam).",
          "**c) Tác dụng with Oxide acid** (Chỉ base tan):\\n  Base tan + Oxide acid → Muối + Nước.\\n  *Ví dụ*: $2NaOH + CO_2 \\rightarrow Na_2CO_3 + H_2O$ (Đây là lý do nước vôi bị đục khi thở $CO_2$ vào).",
          "**d) Tác dụng with dung dịch Muối** (Chỉ base tan):\\n  *Ví dụ*: $2NaOH + CuSO_4 \\rightarrow Cu(OH)_2 \\downarrow + Na_2SO_4$ (kết tủa xanh lam xuất hiện).",
          "**e) Bị nhiệt phân hủy** (Chỉ base không tan):\\n  Khi nung nóng, base không tan bị phân hủy thành oxide base + nước.\\n  *Ví dụ*: $Cu(OH)_2 \\xrightarrow{t^\\circ} CuO + H_2O$ (chất rắn từ xanh lam chuyển thành đen)."
        ]
      }
    },
    {
      "id": "mod7",
      "type": "heading",
      "content": {
        "text": "3. Một số Base quan trọng",
        "level": "h2"
      }
    },
    {
      "id": "mod8",
      "type": "infoBox",
      "content": {
        "title": "$NaOH$ — Natri hydroxide (Xút ăn da)",
        "content": "- Chất rắn trắng, hút ẩm mạnh, tan rất tốt trong nước and tỏa nhiệt.\\n- **Ứng dụng**: Sản xuất xà phòng, giấy, tơ nhân tạo, chế biến dầu mỏ, xử lý nước thải.\\n- **Cảnh báo**: Gây bỏng da nghiêm trọng khi tiếp xúc trực tiếp → phải đeo găng tay.",
        "color": "blue"
      }
    },
    {
      "id": "mod9",
      "type": "infoBox",
      "content": {
        "title": "$Ca(OH)_2$ — Canxi hydroxide (Vôi tôi)",
        "content": "- Chất bột trắng, ít tan trong nước (dung dịch gọi là **nước vôi trong**).\\n- **Ứng dụng**: Khử chua đất trong nông nghiệp, xử lý nước, quét vôi tường, khử trùng chuồng trại, sản xuất thuốc trừ sâu Bordeaux.\\n- **Thí nghiệm**: Thổi $CO_2$ qua nước vôi trong → nước vôi bị **đục** do tạo $CaCO_3$ không tan.",
        "color": "green"
      }
    },
    {
      "id": "mod10",
      "type": "heading",
      "content": {
        "text": "4. Thang pH",
        "level": "h2"
      }
    },
    {
      "id": "mod11",
      "type": "paragraph",
      "content": {
        "text": "Thang pH là thước đo định lượng để biểu thị **mức độ acid hay base** của một dung dịch, thay vì chỉ biết \"có tính acid\" hay \"có tính base\" một cách định tính."
      }
    },
    {
      "id": "mod12",
      "type": "infoBox",
      "content": {
        "title": "Giá trị pH and ý nghĩa",
        "content": "Thang pH thường đi từ 0 đến 14:\\n- $pH = 7$: **Trung tính** (nước tinh khiết).\\n- $pH < 7$: **Môi trường acid**. pH càng nhỏ → acid càng mạnh.\\n- $pH > 7$: **Môi trường base (kiềm)**. pH càng lớn → base càng mạnh.\\n\\n**Ví dụ pH của một số chất quen thuộc**:\\n- Dịch vị dạ dày: $pH \\approx 1-2$\\n- Nước chanh: $pH \\approx 2-3$\\n- Giấm: $pH \\approx 3$\\n- Nước tinh khiết: $pH = 7$\\n- Máu người: $pH \\approx 7,35-7,45$\\n- Nước xà phòng: $pH \\approx 9-10$\\n- Nước tẩy (bleach): $pH \\approx 12-13$",
        "color": "blue"
      }
    },
    {
      "id": "mod13",
      "type": "warningBox",
      "content": {
        "title": "Ứng dụng thực tế của thang pH",
        "content": "- **Nông nghiệp**: Đất trồng cần pH phù hợp (5,5-7,5). Đất chua ($pH < 5,5$) cần bón vôi ($Ca(OH)_2$) để trung hòa acid.\\n- **Y tế**: Máu người phải duy trì pH ổn định ($7,35-7,45$). Lệch khỏi khoảng này gây nguy hiểm tính mạng.\\n- **Thủy sản**: Nước nuôi cá cần pH từ $6,5-8,5$. Quá acid hoặc quá kiềm sẽ làm cá chết.\\n- **Mỹ phẩm**: Sữa rửa mặt thường có pH $5-6$ (gần pH da) để không gây kích ứng.",
        "color": "orange"
      }
    }
  ],
  "quizzes": [],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: Base. Thang pH",
      "url": "https://www.youtube.com/watch?v=pzjncAQjAC0",
      "thumbnail": "https://img.youtube.com/vi/pzjncAQjAC0/0.jpg",
      "description": "Khái niệm kiềm (base), thang pH and cách nhận biết môi trường acid/base (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Dung dịch có pH = 10 là môi trường gì?",
        "options": [
          "Axit",
          "Trung tính",
          "Base (Kiềm)",
          "Muối"
        ],
        "correctAnswer": 2,
        "explanation": "pH > 7.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Thuốc thử nhận biết dung dịch Base (Kiềm) là:",
        "options": [
          "Quỳ tím",
          "Phenolphthalein",
          "Cả a and b",
          "Không có"
        ],
        "correctAnswer": 2,
        "explanation": "Hóa xanh (quỳ) and hóa hồng (phenolphthalein).",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Công dụng của vôi bột ($Ca(OH)_2$) trong nông nghiệp là:",
        "options": [
          "Khử chua đất trồng",
          "Làm đất thêm axit",
          "Tạo màu cho lá",
          "Diệt sâu bọ"
        ],
        "correctAnswer": 0,
        "explanation": "Vôi có tính base dùng để trung hòa axit trong đất.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Thang pH dùng để đo:",
        "options": [
          "Độ nóng của dung dịch",
          "Độ axit hoặc độ kiềm của dung dịch",
          "Khối lượng chất tan",
          "Thể tích dung dịch"
        ],
        "correctAnswer": 1,
        "explanation": "Đo nồng độ ion H+.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Chất nào là Base tan trong nước?",
        "options": [
          "$Cu(OH)_2$",
          "$Al(OH)_3$",
          "$KOH$",
          "$Fe(OH)_3$"
        ],
        "correctAnswer": 2,
        "explanation": "Kali hydroxit là kiềm mạnh tan tốt.",
        "points": 10
      }
    ],
    "intermediate": [],
    "advanced": []
  },
  "realWorldApplications": []
};
