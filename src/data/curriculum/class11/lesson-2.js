export const bai2 = {
  "id": "hoa11_kntt_bai2",
  "classId": 11,
  "lessonId": 2,
  "programId": "ketnoi",
  "title": "Bài 2. Cân bằng trong dung dịch nước",
  "chapter": "Chương 1. Cân bằng hóa học",
  "order": 2,
  "isPremium": false,
  "thumbnail": "https://res.cloudinary.com/dpcorzgkm/image/upload/v1731464309/chemistry-learning/lesson/oip4e1k80i2e7x83r8h.webp",
  "description": "Bản chất sự điện li của nước, pH, môi trường acid - base và cân bằng acid - base trong dung dịch.",
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Sự điện li của nước & Tích số ion của nước",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Nước nguyên chất cũng tự điện li ở mức độ rất nhỏ. Quá trình này là một cân bằng thuận nghịch: **$H_2O \\rightleftharpoons H^+ + OH^-$**. Trong dung dịch nước, ion $H^+$ thường liên kết với phân tử nước tạo ion hydronium ($H_3O^+$). Ở 25°C, nồng độ $[H^+]$ và $[OH^-]$ trong nước tinh khiết đều bằng $1,0 \\times 10^{-7}$ mol/L."
      }
    },
    {
      "id": "mod3",
      "type": "infoBox",
      "content": {
        "title": "Tích số ion của nước ($K_w$)",
        "content": "Vì nồng độ nước ($H_2O$) rất lớn và gần như không đổi, tích số ion của nước được viết là $K_w = [H^+] \\cdot [OH^-]$. Ở 25°C, $K_w = 1,0 \\times 10^{-14}$. Giá trị này áp dụng cho các dung dịch nước loãng ở 25°C, giúp tính $[H^+]$ khi biết $[OH^-]$ và ngược lại.",
        "color": "blue"
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Khái niệm pH & Môi trường dung dịch",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "paragraph",
      "content": {
        "text": "Để biểu diễn nồng độ $H^+$ thuận tiện hơn, người ta dùng chỉ số **pH**: $pH = -\\log[H^+]$.\n\n- **Môi trường acid:** $[H^+] > 10^{-7} M$, nên $pH < 7$.\n- **Môi trường trung tính:** $[H^+] = [OH^-] = 10^{-7} M$, nên $pH = 7$.\n- **Môi trường base:** $[H^+] < 10^{-7} M$, nên $pH > 7$."
      }
    },
    {
      "id": "mod6",
      "type": "infoBox",
      "content": {
        "title": "Công thức giải nhanh pH",
        "content": "1. $pH = -\\log_{10}[H^+]$\n2. $pOH = -\\log_{10}[OH^-]$\n3. Ở $25^\\circ C$: **$pH + pOH = 14$**.",
        "color": "green"
      }
    },
    {
      "id": "mod7",
      "type": "heading",
      "content": {
        "text": "3. Thuyết Brønsted - Lowry về Acid - Base",
        "level": "h2"
      }
    },
    {
      "id": "mod8",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "Theo thuyết Brønsted-Lowry:",
          "1. **Acid:** Là chất có khả năng nhường proton ($H^+$) cho chất khác.",
          "2. **Base:** Là chất có khả năng nhận proton ($H^+$) từ chất khác.",
          "3. **Chất lưỡng tính:** Là chất có thể vừa nhường vừa nhận proton tùy môi trường, ví dụ $H_2O$, $HCO_3^-$ và amino acid."
        ]
      }
    },
    {
      "id": "mod9",
      "type": "paragraph",
      "content": {
        "text": "Mức độ phân li quyết định độ mạnh của chất điện li. **Chất điện li mạnh** như $HCl$, $HNO_3$, $H_2SO_4$, $NaOH$, $Ba(OH)_2$ và nhiều muối tan phân li gần như hoàn toàn trong nước. **Chất điện li yếu** như $CH_3COOH$, $HF$, $NH_3$ chỉ phân li một phần nên được biểu diễn bằng mũi tên cân bằng hai chiều."
      }
    },
    {
      "id": "mod10",
      "type": "warningBox",
      "content": {
        "title": "Sự thủy phân của muối",
        "content": "Không phải mọi dung dịch muối đều trung tính. Muối tạo bởi acid mạnh và base yếu, ví dụ $NH_4Cl$, $FeCl_3$, $Al_2(SO_4)_3$, thường tạo dung dịch có môi trường acid ($pH < 7$). Ngược lại, muối tạo bởi base mạnh và acid yếu, ví dụ $Na_2CO_3$, $CH_3COONa$, $K_3PO_4$, thường tạo dung dịch có môi trường base ($pH > 7$). Nguyên nhân là các ion của acid yếu hoặc base yếu có thể thủy phân trong nước.",
        "color": "orange"
      }
    }
  ],
  "quizzes": [
    {
      "id": "q1",
      "question": "Dung dịch X có [OH⁻] = 1,0 × 10⁻⁴ M. Ở 25°C, dung dịch X có môi trường:",
      "options": [
        "Acid",
        "Base",
        "Trung tính",
        "Lưỡng tính"
      ],
      "correctAnswer": 1,
      "explanation": "[OH⁻] = 10⁻⁴ > 10⁻⁷, nên đây là môi trường base."
    },
    {
      "id": "q2",
      "question": "Theo thuyết Brønsted – Lowry, NH₃ trong nước đóng vai trò là:",
      "options": [
        "Acid",
        "Base",
        "Chất lưỡng tính",
        "Cả acid và base"
      ],
      "correctAnswer": 1,
      "explanation": "NH₃ nhận H⁺ từ nước để tạo thành NH₄⁺ nên NH₃ là base."
    }
  ],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: Cân bằng trong dung dịch nước",
      "url": "https://www.youtube.com/watch?v=P4hEy0II9uE",
      "thumbnail": "https://img.youtube.com/vi/P4hEy0II9uE/0.jpg",
      "description": "Sự điện li, khái niệm pH và ý nghĩa của pH trong thực tiễn (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": null,
  "realWorldApplications": []
};

