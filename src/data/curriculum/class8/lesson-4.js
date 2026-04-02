export const bai4 = {
  "id": "hoa8_kntt_bai4",
  "classId": 8,
  "lessonId": 4,
  "programId": "ketnoi",
  "curriculumType": "ketnoi",
  "title": "Bài 4: Dung dịch và Nồng độ",
  "chapter": "Chương 1: Phản ứng hóa học",
  "order": 4,
  "isPremium": false,
  "description": "Khái niệm dung dịch, độ tan, nồng độ phần trăm, nồng độ mol và cách pha chế dung dịch.",
  "challenges": [
    {
      "type": "image-selection",
      "narrative": "Dung dịch là một hỗn hợp đồng nhất. Hãy chọn hình ảnh của 'Nước muối sinh lý'!",
      "images": [
        "/assets/images/lab-equipment/saline-solution.png",
        "/assets/images/lab-equipment/muddy-water.png",
        "/assets/images/lab-equipment/oil-water-emulsion.png",
        "/assets/images/lab-equipment/beaker.png"
      ],
      "question": "Đâu là hệ dung dịch (hỗn hợp đồng nhất) giữa chất tan và dung môi?",
      "correctAnswer": 0,
      "targetType": "hỗn hợp",
      "source": "Quan sát thực tiễn"
    },
    {
      "type": "multiple-choice",
      "narrative": "Tính toán nồng độ phần trăm: Hòa tan 10 gam muối vào 90 gam nước. Nồng độ % là bao nhiêu?",
      "options": [
        "10%",
        "9%",
        "11.1%",
        "100%"
      ],
      "correctAnswer": 0,
      "question": "Công thức: C% = (mct / mdd) x 100%. Đáp án chính xác là?",
      "source": "Toán hóa học"
    },
    {
      "type": "matching",
      "narrative": "Hãy phân biệt các loại nồng độ dung dịch khác nhau.",
      "leftItems": [
        { "id": "n1", "label": "Nồng độ phần trăm (C%)" },
        { "id": "n2", "label": "Nồng độ mol (CM)" },
        { "id": "n3", "label": "Độ tan (S)" }
      ],
      "items": [
        { "id": "n3", "label": "Số gam chất tan trong 100g nước" },
        { "id": "n1", "label": "Số gam chất tan trong 100g dung dịch" },
        { "id": "n2", "label": "Số mol chất tan trong 1 lít dung dịch" }
      ],
      "correctOrder": ["n1", "n2", "n3"],
      "question": "Nối khái niệm với đơn vị hoặc định nghĩa đúng.",
      "source": "Kiến thức trọng tâm"
    },
    {
      "type": "fill-in-the-blank",
      "narrative": "Khi hòa tan dầu ăn vào nước và lắc mạnh, ta thu được một hỗn hợp không đồng nhất gọi là gì?",
      "placeholder": "Nhũ tương hay Huyền phù?",
      "correctAnswer": "Nhũ tương",
      "question": "Hệ gồm các hạt chất lỏng phân tán trong chất lỏng khác được gọi là gì?",
      "source": "Phân loại hỗn hợp"
    },
    {
      "type": "drag-drop",
      "narrative": "Thử thách chuẩn bị dung dịch: Hãy sắp xếp thứ tự pha chế nước đường.",
      "items": [
        { "id": "p1", "label": "Cân một lượng đường nhất định" },
        { "id": "p2", "label": "Đong một lượng nước chính xác" },
        { "id": "p3", "label": "Cho đường vào nước và khuấy đều" }
      ],
      "correctOrder": ["p1", "p2", "p3"],
      "question": "Các bước pha chế dung dịch cơ bản.",
      "source": "Kỹ năng thực hành"
    }
  ],
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Khái niệm về Dung dịch",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Trong đời sống hàng ngày, chúng ta gặp rất nhiều dung dịch: nước muối, nước đường, nước chanh, thuốc tiêm... Hiểu rõ bản chất của dung dịch giúp ta pha chế chính xác và an toàn."
      }
    },
    {
      "id": "mod3",
      "type": "infoBox",
      "content": {
        "title": "Định nghĩa và thành phần",
        "content": "**Dung dịch** là hỗn hợp **đồng nhất** của chất tan và dung môi.\\n- **Dung môi**: Là chất có khả năng hòa tan chất khác (thường là nước).\\n- **Chất tan**: Là chất bị hòa tan trong dung môi.\\n\\n**Ví dụ**: Khi hòa tan muối ăn ($NaCl$) vào nước → Nước là dung môi, muối ăn là chất tan, nước muối là dung dịch.\\n\\n**Đặc điểm quan trọng**: Dung dịch có thành phần đồng nhất ở mọi vị trí, không phân lớp, không lắng đọng (khác với huyền phù và nhũ tương).",
        "color": "blue"
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Độ tan ($S$) và Dung dịch bão hòa",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "paragraph",
      "content": {
        "text": "Không phải lúc nào chúng ta cũng có thể hòa tan thêm chất tan vào dung dịch. Mỗi chất có một giới hạn hòa tan nhất định phụ thuộc vào nhiệt độ."
      }
    },
    {
      "id": "mod6",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Độ tan ($S$)**: Là số gam chất đó hòa tan trong **100 gam dung môi** để tạo thành dung dịch bão hòa ở một nhiệt độ xác định. Công thức: $$S = \\frac{m_{ct}}{m_{dm}} \\times 100$$",
          "**Dung dịch bão hòa**: Là dung dịch **không thể hòa tan thêm** chất tan ở nhiệt độ đó. Nếu thêm chất tan sẽ lắng đọng ở đáy.",
          "**Dung dịch chưa bão hòa**: Là dung dịch vẫn có thể hòa tan thêm chất tan.",
          "**Ví dụ**: Ở $25^\\circ C$, độ tan của $NaCl$ là 36 g/100g nước. Nghĩa là cứ 100g nước chỉ hòa tan tối đa 36g muối ăn."
        ]
      }
    },
    {
      "id": "mod7",
      "type": "infoBox",
      "content": {
        "title": "Các yếu tố ảnh hưởng đến độ tan",
        "content": "- **Nhiệt độ**: Đa số chất rắn có độ tan tăng khi nhiệt độ tăng (ví dụ: đường tan nhanh hơn trong nước nóng). Tuy nhiên, khí lại tan **ít hơn** khi nhiệt độ tăng (ví dụ: nước nóng có ít khí $O_2$ hơn nước lạnh).\\n- **Bản chất chất tan và dung môi**: Muối $NaCl$ tan tốt trong nước nhưng không tan trong xăng. Ngược lại, dầu mỡ tan trong xăng nhưng không tan trong nước.\\n- **Áp suất** (đối với chất khí): Tăng áp suất → khí tan nhiều hơn. Đây là lý do nước có gas bốc bọt khi mở nắp chai.",
        "color": "green"
      }
    },
    {
      "id": "mod8",
      "type": "heading",
      "content": {
        "text": "3. Nồng độ phần trăm ($C\\%$)",
        "level": "h2"
      }
    },
    {
      "id": "mod9",
      "type": "paragraph",
      "content": {
        "text": "Nồng độ phần trăm cho biết **số gam chất tan** có trong **100 gam dung dịch**. Đây là cách biểu thị nồng độ phổ biến nhất trong đời sống."
      }
    },
    {
      "id": "mod10",
      "type": "infoBox",
      "content": {
        "title": "Công thức $C\\%$ và các biến đổi",
        "content": "$$C\\% = \\frac{m_{ct}}{m_{dd}} \\times 100\\%$$\\n\\nCác công thức suy ra:\\n- $m_{ct} = \\frac{C\\% \\times m_{dd}}{100}$\\n- $m_{dd} = \\frac{m_{ct} \\times 100}{C\\%}$\\n\\n**Lưu ý quan trọng**: $m_{dd} = m_{ct} + m_{dm}$ (khối lượng dung dịch = khối lượng chất tan + khối lượng dung môi).\\n\\n**Ví dụ**: Hòa tan 10g $NaCl$ vào 90g nước. $C\\% = \\frac{10}{10+90} \\times 100 = 10\\%$.",
        "color": "blue"
      }
    },
    {
      "id": "mod11",
      "type": "heading",
      "content": {
        "text": "4. Nồng độ mol ($C_M$)",
        "level": "h2"
      }
    },
    {
      "id": "mod12",
      "type": "paragraph",
      "content": {
        "text": "Nồng độ Mol ($C_M$) cho biết số mol chất tan có trong 1 lít dung dịch. Đây là đơn vị cực kỳ quan trọng trong thực hành hóa học. \\n\\n**Công thức**: $$C_M = \\frac{n}{V}$$\\nTrong đó:\\n- $n$: Số mol chất tan (mol)\\n- $V$: Thể tích dung dịch (**lít**)\\n\\n**Ví dụ**: Hòa tan 4g $NaOH$ ($M=40$) vào nước để được 200ml dung dịch. \\n- $n_{NaOH} = 0,1$ mol\\n- $V = 0,2$ lít\\n- $C_M = 0,1 / 0,2 = 0,5$ M."
      }
    },
    {
      "id": "mod13",
      "type": "infoBox",
      "content": {
        "title": "Công thức $C_M$ và các biến đổi",
        "content": "$$C_M = \\frac{n}{V}$$\\nTrong đó: $n$ là số mol chất tan, $V$ là thể tích dung dịch tính bằng **lít**.\\n\\nCác công thức suy ra:\\n- $n = C_M \\times V$\\n- $V = \\frac{n}{C_M}$\\n\\n**Ví dụ**: Hòa tan 0,1 mol $NaOH$ vào nước được 500 ml dung dịch.\\n$C_M = \\frac{0,1}{0,5} = 0,2$ M (hoặc 0,2 mol/l).",
        "color": "blue"
      }
    },
    {
      "id": "mod14",
      "type": "heading",
      "content": {
        "text": "5. Mối liên hệ giữa $C\\%$ và $C_M$",
        "level": "h2"
      }
    },
    {
      "id": "mod15",
      "type": "paragraph",
      "content": {
        "text": "Công thức chuyển đổi nhanh giữa hai loại nồng độ:\\n\\n$$C_M = \\frac{10 \\times D \\times C\\%}{M}$$\\n\\nTrong đó: $D$ là khối lượng riêng của dung dịch (g/ml), $M$ là khối lượng mol chất tan (g/mol)."
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
          "**Ví dụ 1**: Hòa tan 20g đường vào 180g nước. Tính $C\\%$.\\n  *Giải*: $m_{dd} = 20 + 180 = 200$g. $C\\% = \\frac{20}{200} \\times 100 = 10\\%$.",
          "**Ví dụ 2**: Tính khối lượng $NaCl$ cần để pha 200g dung dịch $NaCl$ $15\\%$.\\n  *Giải*: $m_{ct} = \\frac{15 \\times 200}{100} = 30$g $NaCl$. Cần hòa tan 30g muối vào $200 - 30 = 170$g nước.",
          "**Ví dụ 3**: Tính $C_M$ của dung dịch chứa 4g $NaOH$ ($M=40$) trong 500ml dung dịch.\\n  *Giải*: $n = \\frac{4}{40} = 0,1$ mol. $V = 0,5$ lít. $C_M = \\frac{0,1}{0,5} = 0,2$M."
        ]
      }
    },
    {
      "id": "mod18",
      "type": "warningBox",
      "content": {
        "title": "Ứng dụng thực tế",
        "content": "- **Y tế**: Nước muối sinh lý có nồng độ $NaCl$ $0,9\\%$. Pha quá đặc sẽ gây xót, pha quá loãng sẽ không hiệu quả.\\n- **Nông nghiệp**: Pha thuốc trừ sâu phải đúng nồng độ hướng dẫn. Quá đặc sẽ cháy lá cây, quá loãng sẽ không diệt được sâu bệnh.\\n- **Pha chế đồ uống**: Dung dịch nước đường trong sản xuất nước giải khát thường có $C\\%$ khoảng $10-12\\%$.",
        "color": "orange"
      }
    }
  ],
  "quizzes": [],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: Dung dịch và nồng độ",
      "url": "https://www.youtube.com/watch?v=QeL8uqPndyA",
      "thumbnail": "https://img.youtube.com/vi/QeL8uqPndyA/0.jpg",
      "description": "Khái niệm dung dịch, chất tan, dung môi và các công thức tính nồng độ C%, CM (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Một mol chất chứa bao nhiêu hạt vi tử?",
        "options": [
          "$6,022 \\times 10^{23}$",
          "$6,022 \\times 10^{22}$",
          "$100$ hạt",
          "$1$ tỷ hạt"
        ],
        "correctAnswer": 0,
        "explanation": "Số avogadro.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Khối lượng mol của khí Oxi ($O_2$) là bao nhiêu? (Biết $O = 16$)",
        "options": [
          "16 g/mol",
          "32 g/mol",
          "8 g/mol",
          "1 g/mol"
        ],
        "correctAnswer": 1,
        "explanation": "16 x 2 = 32.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Thể tích của 1 mol chất khí bất kỳ ở điều kiện chuẩn ($25^oC, 1 bar$) là:",
        "options": [
          "22,4 lít",
          "24,79 lít",
          "11,2 lít",
          "1 lít"
        ],
        "correctAnswer": 1,
        "explanation": "Chuẩn mới IUPAC là 24,79 lít.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Tỉ khối của khí Metan ($CH_4$) so với khí Hidro ($H_2$) là: ($C=12, H=1$)",
        "options": [
          "16",
          "8",
          "2",
          "32"
        ],
        "correctAnswer": 1,
        "explanation": "d = M(CH4) / M(H2) = 16 / 2 = 8.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "0,5 mol nước ($H_2O$) có khối lượng là bao nhiêu gam? ($H=1, O=16$)",
        "options": [
          "18g",
          "9g",
          "36g",
          "1g"
        ],
        "correctAnswer": 1,
        "explanation": "m = n x M = 0,5 x 18 = 9g.",
        "points": 10
      }
    ],
    "intermediate": [],
    "advanced": []
  },
  "realWorldApplications": []
};
