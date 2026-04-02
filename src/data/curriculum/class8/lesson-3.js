export const bai3 = {
  "id": "hoa8_kntt_bai3",
  "classId": 8,
  "lessonId": 3,
  "programId": "ketnoi",
  "curriculumType": "ketnoi",
  "title": "Bài 3: Mol và tỉ khối chất khí",
  "chapter": "Chương 1: Phản ứng hóa học",
  "order": 3,
  "isPremium": false,
  "description": "Khái niệm mol, số Avogadro, khối lượng mol, thể tích mol chất khí và tỉ khối để so sánh các chất khí.",
  "challenges": [
    {
      "type": "image-selection",
      "narrative": "Mol là một khái niệm trừu tượng. Hãy chọn hình ảnh tượng trưng cho '1 mol' nguyên tử sắt!",
      "images": [
        "/assets/images/lab-equipment/beaker.png",
        "/assets/images/lab-equipment/test-tube.png",
        "/assets/images/lab-equipment/erlenmeyer-flask.png",
        "/assets/images/lab-equipment/graduated-cylinder.png"
      ],
      "question": "Mol là lượng chất chứa 6,022 x 10^23 hạt vi hạt. Đâu là dụng cụ đựng hóa chất này?",
      "correctAnswer": 0,
      "targetType": "khái niệm",
      "source": "Đơn vị đo lường"
    },
    {
      "type": "multiple-choice",
      "narrative": "Tính toán nhanh: Hãy tính khối lượng của 0,5 mol khí Oxy (O2). Cho O=16.",
      "options": [
        "16 gam",
        "32 gam",
        "8 gam",
        "64 gam"
      ],
      "correctAnswer": 0,
      "question": "Công thức tính: m = n x M. Đáp án là bao nhiêu?",
      "source": "Tính toán hóa học"
    },
    {
      "type": "matching",
      "narrative": "Điều kiện đo lường rất quan trọng. Hãy nối các thông số với điều kiện đo đúng.",
      "leftItems": [
        { "id": "c1", "label": "Điều kiện chuẩn (STP)" },
        { "id": "c2", "label": "Nhiệt độ phòng (25°C, 1 bar)" },
        { "id": "c3", "label": "Khối lượng mol (M)" }
      ],
      "items": [
        { "id": "c3", "label": "gam/mol" },
        { "id": "c1", "label": "22,4 lít (Legacy)" },
        { "id": "c2", "label": "24,79 lít (KNTT)" }
      ],
      "correctOrder": ["c1", "c2", "c3"],
      "question": "Kết nối các đơn vị/thông số với khái niệm tương ứng.",
      "source": "Sách giáo khoa"
    },
    {
      "type": "fill-in-the-blank",
      "narrative": "Tỉ khối của khí A đối với khí B được tính bằng công thức: d = MA / MB. Nếu A là Hydro (H2=2) và B là Không khí (29).",
      "placeholder": "Nặng hơn hay Nhẹ hơn?",
      "correctAnswer": "Nhẹ hơn",
      "question": "Khí Hydro đối với không khí là nặng hơn hay nhẹ hơn?",
      "source": "Tỉ khối chất khí"
    },
    {
      "type": "drag-drop",
      "narrative": "Thử thách cuối: Hãy sắp xếp các bước để tính số mol từ khối lượng cho trước.",
      "items": [
        { "id": "step1", "label": "Xác định khối lượng mol M của chất" },
        { "id": "step2", "label": "Lấy khối lượng m chia cho M" },
        { "id": "step3", "label": "Ghi đáp án với đơn vị là mol" }
      ],
      "correctOrder": ["step1", "step2", "step3"],
      "question": "Trình tự tính số mol từ khối lượng.",
      "source": "Kỹ năng tính toán"
    }
  ],
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Khái niệm về Mol và Số Avogadro",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Vì nguyên tử và phân tử có kích thước cực kỳ nhỏ bé (cỡ $10^{-10}$ m), chúng ta không thể cân hay đếm từng hạt riêng lẻ bằng các dụng cụ thông thường. Thay vào đó, các nhà khoa học sử dụng đơn vị **Mol** — một đơn vị đo lượng chất trong hệ SI — để gom các hạt vi mô thành một nhóm lớn có thể đo đếm được."
      }
    },
    {
      "id": "mod3",
      "type": "infoBox",
      "content": {
        "title": "Định nghĩa chính thức",
        "content": "**Mol** là lượng chất có chứa $6,022 \\times 10^{23}$ hạt vi mô (nguyên tử, phân tử, hoặc ion) của chất đó.\\nCon số $6,022 \\times 10^{23}$ được gọi là **số Avogadro**, ký hiệu là $N_A$, đặt theo tên nhà bác học người Ý Amedeo Avogadro.\\n\\n**Ý nghĩa thực tế**: Nếu ta đếm 1 triệu hạt mỗi giây, phải mất hơn 19 triệu tỷ năm mới đếm hết 1 mol hạt! Điều này cho thấy số Avogadro lớn đến mức nào.",
        "color": "blue"
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Khối lượng mol ($M$)",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "paragraph",
      "content": {
        "text": "Khối lượng mol của một chất là khối lượng tính bằng gam của **1 mol** chất đó, có đơn vị là **g/mol**. Điều đặc biệt là trị số của khối lượng mol ($M$) bằng đúng trị số của nguyên tử khối hoặc phân tử khối (tính bằng đvC)."
      }
    },
    {
      "id": "mod6",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Ví dụ 1**: Nguyên tử khối của Carbon là 12 đvC → $M_C = 12$ g/mol. Nghĩa là 1 mol nguyên tử Carbon nặng 12 gam.",
          "**Ví dụ 2**: Phân tử khối của nước $H_2O$ = $2 \\times 1 + 16 = 18$ đvC → $M_{H_2O} = 18$ g/mol.",
          "**Ví dụ 3**: Phân tử khối của $H_2SO_4$ = $2 \\times 1 + 32 + 4 \\times 16 = 98$ đvC → $M_{H_2SO_4} = 98$ g/mol."
        ]
      }
    },
    {
      "id": "mod7",
      "type": "heading",
      "content": {
        "text": "3. Thể tích mol chất khí",
        "level": "h2"
      }
    },
    {
      "id": "mod8",
      "type": "paragraph",
      "content": {
        "text": "Ở cùng điều kiện nhiệt độ và áp suất, **1 mol của bất kỳ chất khí nào** cũng chiếm những thể tích bằng nhau, bất kể chất khí đó là gì. Đây là tính chất riêng của chất khí mà chất rắn và chất lỏng không có."
      }
    },
    {
      "id": "mod9",
      "type": "infoBox",
      "content": {
        "title": "Giá trị thể tích mol ở các điều kiện",
        "content": "- Ở **điều kiện tiêu chuẩn (STP)** ($0^\\circ C$ và 1 atm): $V_{mol} = 22,4$ lít.\\n- Ở **điều kiện chuẩn** ($25^\\circ C$ và 1 bar): $V_{mol} = 24,79$ lít.\\n\\n**Lưu ý quan trọng**: Chương trình SGK Kết nối tri thức sử dụng điều kiện chuẩn $25^\\circ C$, 1 bar → dùng $24,79$ lít/mol.",
        "color": "green"
      }
    },
    {
      "id": "mod10",
      "type": "heading",
      "content": {
        "text": "4. Công thức chuyển đổi giữa các đại lượng",
        "level": "h2"
      }
    },
    {
      "id": "mod11",
      "type": "paragraph",
      "content": {
        "text": "Trong bài tập, chúng ta thường phải chuyển đổi qua lại giữa **số mol ($n$)**, **khối lượng ($m$)**, **thể tích khí ($V$)** và **số hạt ($A$)**. Các công thức quan trọng:"
      }
    },
    {
      "id": "mod12",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Từ khối lượng sang số mol**: $n = \\frac{m}{M}$ (với $m$ là khối lượng tính bằng gam, $M$ là khối lượng mol).",
          "**Từ số mol sang khối lượng**: $m = n \\times M$.",
          "**Từ thể tích khí sang số mol** (ở đkc): $n = \\frac{V}{24,79}$.",
          "**Từ số mol sang thể tích khí** (ở đkc): $V = n \\times 24,79$ (lít).",
          "**Từ số hạt sang số mol**: $n = \\frac{A}{N_A} = \\frac{A}{6,022 \\times 10^{23}}$.",
          "**Từ số mol sang số hạt**: $A = n \\times N_A$."
        ]
      }
    },
    {
      "id": "mod13",
      "type": "heading",
      "content": {
        "text": "5. Tỉ khối của chất khí",
        "level": "h2"
      }
    },
    {
      "id": "mod14",
      "type": "paragraph",
      "content": {
        "text": "Tỉ khối cho biết khí này nặng hay nhẹ hơn khí khác bao nhiêu lần. Đây là đại lượng giúp ta so sánh độ nặng nhẹ giữa các chất khí mà không cần cân đo trực tiếp."
      }
    },
    {
      "id": "mod15",
      "type": "infoBox",
      "content": {
        "title": "Công thức tỉ khối",
        "content": "**a) Tỉ khối của khí A so với khí B:**\\n$$d_{A/B} = \\frac{M_A}{M_B}$$\\n\\n**b) Tỉ khối của khí A so với không khí:**\\n$$d_{A/kk} = \\frac{M_A}{29}$$\\n(vì $M_{kk} \\approx 29$ g/mol)\\n\\n- Nếu $d > 1$: Khí A **nặng hơn** khí B (hoặc không khí).\\n- Nếu $d < 1$: Khí A **nhẹ hơn** khí B (hoặc không khí).\\n- Nếu $d = 1$: Hai khí **nặng bằng nhau**.",
        "color": "blue"
      }
    },
    {
      "id": "mod16",
      "type": "heading",
      "content": {
        "text": "6. Ví dụ minh họa",
        "level": "h2"
      }
    },
    {
      "id": "mod17",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Ví dụ 1**: Tính khối lượng của 0,5 mol $Fe_2O_3$.\\n  *Giải*: $M_{Fe_2O_3} = 2 \\times 56 + 3 \\times 16 = 160$ g/mol. Vậy $m = n \\times M = 0,5 \\times 160 = 80$ gam.",
          "**Ví dụ 2**: Tính thể tích ở đkc của 0,25 mol khí $CO_2$.\\n  *Giải*: $V = n \\times 24,79 = 0,25 \\times 24,79 = 6,1975$ lít.",
          "**Ví dụ 3**: Khí $SO_2$ nặng hơn hay nhẹ hơn không khí?\\n  *Giải*: $M_{SO_2} = 32 + 2 \\times 16 = 64$ g/mol. $d_{SO_2/kk} = \\frac{64}{29} \\approx 2,21 > 1$. Vậy khí $SO_2$ **nặng hơn không khí** khoảng 2,2 lần. Đây là lý do $SO_2$ tích tụ ở những vùng trũng gần núi lửa và gây nguy hiểm."
        ]
      }
    },
    {
      "id": "mod18",
      "type": "warningBox",
      "content": {
        "title": "Ứng dụng thực tế của tỉ khối",
        "content": "- Khí $H_2$ ($d = 2/29 \\approx 0,069$) nhẹ hơn không khí nhiều lần → Dùng bơm bóng bay (nhưng dễ cháy nổ nên nay thay bằng $He$).\\n- Khí $CO_2$ ($d = 44/29 \\approx 1,52$) nặng hơn không khí → Tích tụ ở đáy giếng sâu, hầm mỏ gây ngạt thở. Trước khi xuống giếng cần thử bằng cách thả ngọn đèn xuống trước.\\n- Khí gas ($C_3H_8$, $d = 44/29 \\approx 1,52$) nặng hơn không khí → Khi rò rỉ sẽ chìm xuống sàn nhà, rất nguy hiểm vì dễ gây nổ.",
        "color": "orange"
      }
    }
  ],
  "quizzes": [],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: Mol và tỉ khối chất khí",
      "url": "https://www.youtube.com/watch?v=YRSDdiEHsWU",
      "thumbnail": "https://img.youtube.com/vi/YRSDdiEHsWU/0.jpg",
      "description": "Định nghĩa Mol, khối lượng mol, thể tích mol và cách tính tỉ khối chất khí (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Khối lượng mol ($M$) của khí Oxygen ($O_2$) là bao nhiêu?",
        "options": [
          "16 g/mol",
          "32 g/mol",
          "8 g/mol",
          "32 đvC"
        ],
        "correctAnswer": 1,
        "explanation": "$16 \\times 2 = 32$. Đơn vị của khối lượng mol là g/mol.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Thể tích của 1 mol chất khí bất kỳ ở điều kiện chuẩn ($25^\\circ C, 1 bar$) là:",
        "options": [
          "22,4 lít",
          "24,79 lít",
          "11,2 lít",
          "1 lít"
        ],
        "correctAnswer": 1,
        "explanation": "Theo chuẩn IUPAC mới (25°C, 1 bar), thể tích mol là 24,79 lít.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Số Avogadro ($N_A$) có giá trị xấp xỉ là:",
        "options": [
          "$6,022 \\times 10^{23}$",
          "$6,022 \\times 10^{22}$",
          "$100$ hạt",
          "$1$ tỷ hạt"
        ],
        "correctAnswer": 0,
        "explanation": "Đây là hằng số đại diện cho số hạt trong 1 mol chất.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Khí nào sau đây nhẹ hơn không khí?",
        "options": [
          "$O_2$",
          "$CO_2$",
          "$H_2$",
          "$SO_2$"
        ],
        "correctAnswer": 2,
        "explanation": "$M_{H_2} = 2 < M_{kk} = 29$.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Ở cùng điều kiện nhiệt độ và áp suất, 1 mol khí $CO_2$ and 1 mol khí $H_2$ có điểm gì chung?",
        "options": [
          "Cùng khối lượng",
          "Cùng thể tích",
          "Cùng số nguyên tử",
          "Cùng khối lượng riêng"
        ],
        "correctAnswer": 1,
        "explanation": "Các chất khí khác nhau có cùng số mol thì chiếm thể tích bằng nhau ở cùng điều kiện.",
        "points": 10
      }
    ],
    "intermediate": [],
    "advanced": []
  },
  "realWorldApplications": []
};
