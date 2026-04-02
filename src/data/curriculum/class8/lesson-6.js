export const bai6 = {
  "id": "hoa8_kntt_bai6",
  "classId": 8,
  "lessonId": 6,
  "programId": "ketnoi",
  "curriculumType": "ketnoi",
  "title": "Bài 6: Tính toán theo phương trình hóa học",
  "chapter": "Chương 1: Phản ứng hóa học",
  "order": 6,
  "isPremium": false,
  "description": "Các bước tính khối lượng, thể tích chất tham gia và sản phẩm; xác định chất dư; hiệu suất phản ứng.",
  "challenges": [
    {
      "type": "matching",
      "narrative": "Rất chính xác! Bây giờ, hãy giúp tôi sắp xếp quy trình 4 bước chuẩn để giải mọi bài toán hóa học nhé.",
      "leftItems": [
        { "id": "s1", "label": "Bước 1" },
        { "id": "s2", "label": "Bước 2" },
        { "id": "s3", "label": "Bước 3" },
        { "id": "s4", "label": "Bước 4" }
      ],
      "items": [
        { "id": "s3", "label": "Lập tỉ lệ mol từ PTHH để tìm chất cần tính" },
        { "id": "s1", "label": "Tính số mol các chất đã biết từ đề bài" },
        { "id": "s4", "label": "Chuyển số mol tìm được sang khối lượng/thể tích" },
        { "id": "s2", "label": "Viết và cân bằng phương trình hóa học" }
      ],
      "correctOrder": ["s1", "s2", "s3", "s4"],
      "question": "Hãy sắp xếp các bước theo đúng trình tự giải bài tập.",
      "source": "Kỹ năng giải bài"
    },
    {
      "type": "multiple-choice",
      "narrative": "Để tính toán thành công, bạn có nhớ công thức 'vàng' để chuyển đổi từ khối lượng sang số mol không?",
      "options": [
        "n = m / M",
        "n = m * M",
        "n = M / m",
        "n = V / 24.79"
      ],
      "correctAnswer": 0,
      "question": "Công thức nào là chìa khóa để chuyển đổi từ gam sang mol?",
      "source": "Công thức cơ bản"
    },
    {
      "type": "fill-in-the-blank",
      "narrative": "Trong thực tế, đôi khi chúng ta không thu được 100% sản phẩm do thất thoát. Ta gọi đó là 'Hiệu suất'. Ký hiệu của nó là gì?",
      "placeholder": "Nhập ký hiệu (ví dụ: H)...",
      "correctAnswer": "H",
      "question": "Ký hiệu thường dùng để chỉ hiệu suất phản ứng là chữ cái nào?",
      "source": "Lý thuyết hiệu suất"
    },
    {
      "type": "drag-drop",
      "narrative": "Cuối cùng, hãy lắp ráp công thức tính Hiệu suất (H%) để báo cáo cho quản lý phòng thí nghiệm nhé!",
      "items": [
        { "id": "h1", "label": "Lượng thực tế" },
        { "id": "h2", "label": "/" },
        { "id": "h3", "label": "Lượng lý thuyết" },
        { "id": "h4", "label": "x 100%" }
      ],
      "correctOrder": ["h1", "h2", "h3", "h4"],
      "question": "Hãy hoàn thành công thức: H% = (Lượng thực tế / Lượng lý thuyết) * 100%",
      "source": "Công thức hiệu suất"
    }
  ],
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Quy trình 4 bước tính toán theo PTHH",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Để giải bài toán hóa học theo phương trình, chúng ta cần tuân thủ quy trình 4 bước hệ thống. Đây là kỹ năng quan trọng nhất mà học sinh lớp 8 cần nắm vững."
      }
    },
    {
      "id": "mod3",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Bước 1 — Tính số mol**: Chuyển đổi các đại lượng đã cho (khối lượng, thể tích khí, số hạt) sang **số mol** ($n$).\\n  - Từ khối lượng: $n = m/M$\\n  - Từ thể tích khí (đkc): $n = V/24,79$",
          "**Bước 2 — Viết và cân bằng PTHH**: Viết phương trình hóa học, cân bằng chính xác số nguyên tử mỗi nguyên tố.",
          "**Bước 3 — Lập tỉ lệ mol**: Dựa vào hệ số trong PTHH và số mol chất đã biết → tìm số mol chất cần tính bằng quy tắc tam suất (nhân chéo chia đối).",
          "**Bước 4 — Chuyển đổi kết quả**: Đổi số mol vừa tìm sang đại lượng đề yêu cầu: $m = n \\times M$ hoặc $V = n \\times 24,79$ lít."
        ]
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Ví dụ minh họa: Bài toán tính khối lượng",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "infoBox",
      "content": {
        "title": "Ví dụ: Đốt cháy sắt trong khí Oxi",
        "content": "**Đề bài**: Đốt cháy hoàn toàn 11,2g Fe trong khí $O_2$. Tính khối lượng oxit sắt từ ($Fe_3O_4$) tạo thành.\\n\\n**Giải chi tiết**:\\n1. **Tính số mol Fe**: $n_{Fe} = \\frac{11,2}{56} = 0,2$ mol.\\n2. **PTHH**: $3Fe + 2O_2 \\xrightarrow{t^\\circ} Fe_3O_4$.\\n3. **Lập tỉ lệ**: Theo PTHH, 3 mol Fe tạo ra 1 mol $Fe_3O_4$. \\n   Vậy 0,2 mol Fe tạo ra: $n_{Fe_3O_4} = \\frac{0,2 \\times 1}{3} = \\frac{1}{15} \\approx 0,0667$ mol.\\n4. **Tính khối lượng**: $m_{Fe_3O_4} = 0,0667 \\times 232 \\approx 15,47$g.\\n\\n**Đáp số**: 15,47 gam $Fe_3O_4$.",
        "color": "blue"
      }
    },
    {
      "id": "mod6",
      "type": "heading",
      "content": {
        "text": "3. Bài toán có chất dư",
        "level": "h2"
      }
    },
    {
      "id": "mod7",
      "type": "paragraph",
      "content": {
        "text": "Khi đề bài cho biết lượng của **cả hai chất phản ứng**, cần xác định chất nào hết trước (chất thiếu) và chất nào còn dư. Sản phẩm được tính theo lượng **chất hết** (chất thiếu)."
      }
    },
    {
      "id": "mod8",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Cách xác định chất dư**: Tính số mol mỗi chất phản ứng ($n_A, n_B$), sau đó lấy số mol chia cho hệ số tương ứng ($a, b$) trong PTHH. \\n  - Nếu $\\frac{n_A}{a} < \\frac{n_B}{b} \\Rightarrow$ A hết, B dư. Tính theo A.\\n  - Nếu $\\frac{n_A}{a} > \\frac{n_B}{b} \\Rightarrow$ B hết, A dư. Tính theo B.",
          "**Mẹo nhỏ**: Luôn viết dòng 'Ban đầu - Phản ứng - Sau phản ứng' để dễ dàng theo dõi lượng chất còn lại sau thí nghiệm.",
          "**Ví dụ**: Cho 6,5g Zn tác dụng với 200ml dung dịch $HCl$ 1M. Tính thể tích khí $H_2$ thu được (đkc).\\n  $n_{Zn} = 0,1$ mol. $n_{HCl} = 0,2$ mol.\\n  PTHH: $Zn + 2HCl \\rightarrow ZnCl_2 + H_2$. \\n  Tỉ số: $\\frac{0,1}{1} = \\frac{0,2}{2} = 0,1$. Hai chất phản ứng vừa đủ.\\n  $n_{H_2} = n_{Zn} = 0,1$ mol $\\Rightarrow V = 2,479$ lít."
        ]
      }
    },
    {
      "id": "mod9",
      "type": "heading",
      "content": {
        "text": "4. Hiệu suất phản ứng ($H\\%$)",
        "level": "h2"
      }
    },
    {
      "id": "mod10",
      "type": "paragraph",
      "content": {
        "text": "Trong thực tế, lượng sản phẩm thu được thường **ít hơn** lượng tính toán lý thuyết vì nhiều nguyên nhân: hóa chất không tinh khiết 100%, một phần bị thất thoát khi thao tác, hoặc phản ứng không xảy ra hoàn toàn."
      }
    },
    {
      "id": "mod11",
      "type": "infoBox",
      "content": {
        "title": "Công thức tính hiệu suất",
        "content": "$$H\\% = \\frac{m_{tt}}{m_{lt}} \\times 100\\%$$\\nTrong đó:\\n- $m_{tt}$ (Khối lượng thực tế): Lượng sản phẩm cân được sau khi làm thí nghiệm.\\n- $m_{lt}$ (Khối lượng lý thuyết): Lượng sản phẩm tính toán được dựa trên phương trình.\\n\\n**Lưu ý quan trọng**: Hiệu suất luôn nhỏ hơn hoặc cùng lắm là bằng $100\\%$. Nếu bạn tính ra $>100\\%$, hãy kiểm tra lại các phép tính hoặc độ tinh khiết của hóa chất!",
        "color": "blue"
      }
    },
    {
      "id": "mod12",
      "type": "infoBox",
      "content": {
        "title": "Ví dụ: Tính hiệu suất nung đá vôi",
        "content": "**Đề bài**: Nung 10g $CaCO_3$, thực tế thu được 4,48g $CaO$. Tính hiệu suất.\\n\\n**Giải**:\\n- PTHH: $CaCO_3 \\xrightarrow{t^\\circ} CaO + CO_2$.\\n- $n_{CaCO_3} = 10/100 = 0,1$ mol → theo lý thuyết: $n_{CaO} = 0,1$ mol → $m_{lt} = 0,1 \\times 56 = 5,6$g.\\n- $H\\% = \\frac{4,48}{5,6} \\times 100 = 80\\%$.\\n\\nVậy hiệu suất phản ứng nung vôi là **80%**.",
        "color": "green"
      }
    },
    {
      "id": "mod13",
      "type": "warningBox",
      "content": {
        "title": "Mẹo giải bài tập nhanh",
        "content": "- Luôn bắt đầu từ **\"tìm n\"** (số mol). Đây là cầu nối giữa đề bài và phương trình.\\n- Ghi nhớ: Khối lượng mol ($M$) của một số chất thường gặp: $H_2=2$, $O_2=32$, $N_2=28$, $CO_2=44$, $H_2O=18$, $NaCl=58,5$, $CaCO_3=100$, $Fe=56$, $Al=27$.\\n- Luôn ghi đơn vị sau mỗi phép tính để tránh nhầm lẫn.",
        "color": "orange"
      }
    }
  ],
  "quizzes": [],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: Tính toán theo phương trình hóa học",
      "url": "https://www.youtube.com/watch?v=vNfWn6qXWsk",
      "thumbnail": "https://img.youtube.com/vi/vNfWn6qXWsk/0.jpg",
      "description": "Cách giải các bài toán hóa học dựa trên phương trình và tỉ lệ số mol (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Để tính khối lượng chất tham gia khi biết số mol, ta dùng công thức nào?",
        "options": [
          "$m = n \\times M$",
          "$m = n / M$",
          "$m = V / 24,79$",
          "$m = C\\% / 100$"
        ],
        "correctAnswer": 0,
        "explanation": "Khối lượng (m) bằng số mol (n) nhân khối lượng mol (M).",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Cho phản ứng: $CaCO_3 \\xrightarrow{t^\\circ} CaO + CO_2$. Để thu được 0,1 mol $CaO$, cần nung bao nhiêu mol $CaCO_3$?",
        "options": [
          "0,1 mol",
          "0,2 mol",
          "0,05 mol",
          "1 mol"
        ],
        "correctAnswer": 0,
        "explanation": "Theo phương trình, tỉ lệ mol là 1:1.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Hiệu suất phản ứng ($H$) được tính bằng công thức nào?",
        "options": [
          "$H = (m_{tt} / m_{lt}) \\times 100\\%$",
          "$H = (m_{lt} / m_{tt}) \\times 100\\%$",
          "$H = m_{tt} / m_{lt}$",
          "$H = m_{tt} \\times m_{lt} / 100$"
        ],
        "correctAnswer": 0,
        "explanation": "Hiệu suất = (Thực tế / Lý thuyết) x 100%.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Nung 10g đá vôi, thực tế thu được 4,48g vôi sống. Biết lý thuyết là 5,6g. Hiệu suất là:",
        "options": [
          "80%",
          "70%",
          "90%",
          "100%"
        ],
        "correctAnswer": 0,
        "explanation": "$H = \\frac{4,48}{5,6} \\times 100 = 80\\%$.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Trong bài toán chất dư, lượng sản phẩm được tính theo:",
        "options": [
          "Chất phản ứng hết (chất thiếu)",
          "Chất phản ứng còn dư",
          "Cả hai chất",
          "Tùy ý chất nào cũng được"
        ],
        "correctAnswer": 0,
        "explanation": "Sản phẩm ngừng tạo ra khi có ít nhất một chất tham gia bị dùng hết.",
        "points": 10
      }
    ],
    "intermediate": [],
    "advanced": []
  },
  "realWorldApplications": []
};
