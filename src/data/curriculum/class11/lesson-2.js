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
  "description": "Bản chất sự điện li của nước, pH, môi trường acid - base and cân bằng acid - base trong dung dịch.",
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
        "text": "Nước uống hàng ngày không phải là một dung môi tĩnh lặng rỗng tuếch. Nước nguyên chất (Nước tinh khiết) cũng tự phân rã, tự điện li tuy ở một mức độ cực kì yếu ớt. Quá trình tự điện li của phân tử nước là một phản ứng thuận nghịch: **$H_2O \\rightleftharpoons H^+ + OH^-$**. Trên thực tế, ion $H^+$ trần trụi (Proton) quá nhỏ bé nên nó không đứng một mình mà bám ngay vào một phân tử nước khác kết thành ion Hydronium ($H_3O^+$). Tại 25°C, cú phân rã này nhỏ đến mức cứ khoảng 556 triệu phân tử nước mới có vỡ ra 1 phân tử, cho nên nồng độ của ion acid $[H^+]$ = nồng độ kiềm $[OH^-]$ = $1,0 \\times 10^{-7}$ mol/L."
      }
    },
    {
      "id": "mod3",
      "type": "infoBox",
      "content": {
        "title": "Tích số ion của Nước (Kw) - Định luật Vĩnh hằng",
        "content": "Vì nồng độ Nước ($H_2O$) khổng lồ and coi như hằng số, người ta suy ra Tích số ion của nước $K_w = [H^+] \\cdot [OH^-]$. Đặc biệt tại nhiệt độ phòng 25°C, $K_w = (1,0 \\times 10^{-7}) \\times (1,0 \\times 10^{-7}) = 1,0 \\times 10^{-14}$. \nTuyệt kĩ làm toán: Giá trị $10^{-14}$ này bị KHÓA CỨNG ÁP DỤNG cho **bất cứ dung dịch loãng nào** (nước đường, giấm, xí muội, axit H2SO4) miễn là đang pha ở 25°C. Có [H+] lập tức suy ra [OH-] bằng phép chia.",
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
        "text": "Việc cồng kềnh ghi chép các nồng độ ngũ phân số $10^{-7}$, $10^{-3}$ quá bất tiện, nhà hóa học Sørensen đã tạo ra thanh đo **Chỉ số pH** (power of Hydrogen) lấy logarit cơ số 10 nồng độ H+. \n- **Môi trường Acid (Chua):** Có nhiều mầm $H^+$ trỗi dậy khiến $[H^+] > 10^{-7} M$ $\\rightarrow$ pH < 7.\n- **Môi trường Trung tính (Lành tính):** Tính âm dương cân bằng hoàn mĩ $[H^+] = [OH^-] = 10^{-7} M$ $\\rightarrow$ pH đúng bằng 7 (Ví dụ: nước cất, dung dịch muối ăn NaCl).\n- **Môi trường Base (Kiềm/Đắng nháp):** Lũ $OH^-$ đàn áp $H+$ khiến $[H^+] < 10^{-7} M$ $\\rightarrow$ pH đo đạc chạy vọt > 7."
      }
    },
    {
      "id": "mod6",
      "type": "infoBox",
      "content": {
        "title": "Công thức giải nhanh pH",
        "content": "1. Tính pH cực rát: $pH = -\\log_{10}[H^+]$\n2. Đại lượng song sinh: $pOH = -\\log_{10}[OH^-]$\n3. Mối liên kết sinh tử: Ở $25^\\circ C$, ta luôn luôn có phanh giới không thể phá vỡ: **$pH + pOH = 14$**.",
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
          "Quên đi Thuyết cổ điển Arrhenius lỗi thời, Thuyết vạn vật Brønsted-Lowry ra đời ôm trọn mọi hệ dung môi. \n**Định nghĩa Đỉnh cao:**",
          "1. **Acid (Kẻ hào phóng):** Bất cứ phần tử nào (phân tử hay ion) có năng lực NHƯỜNG, ĐÁ VĂNG HẠT PROTON ($H^+$) sang chất khác. ($HCl \\rightarrow H^+ + Cl^-$)",
          "2. **Base (Kẻ bòn mót):** Bất kì phần tử nào CHỤP LẤY, NHẬN LẤY Proton ($H^+$) từ môi trường. (Ammonia $NH_3 + H^+ \\rightarrow NH_4^+$ mập lên).",
          "3. **Lưỡng tính (Amphoteric):** Kẻ vừa có khả năng nhả $H^+$, lại vừa có khả năng nhận cướp $H^+$ khi gặp đối thủ khó nhằn. (Nước $H_2O$, Ion $HCO_3^-$, Amino Acid Zwitterion)."
        ]
      }
    },
    {
      "id": "mod9",
      "type": "paragraph",
      "content": {
        "text": "Độ sâu của sự phân ly định đoạt sức mạnh: Các **Chất điện li MẠNH** (Acid mạnh $HCl, HNO_3, H_2SO_4$, Base kiềm kiềm thổ $NaOH, Ba(OH)_2$ and Hầu Hết Mọi Loại Muối tan) sẽ xả thân phân đôi 100% trong nước tạo dòng ion dẫn điện dữ dội (Mũi tên 1 chiều). Các **Chất điện li YẾU** ($CH_3COOH, HF, NH_3$...) thì keo kiệt, hòa 100 phân tử chỉ vỡ ra được 1-2 phân tử rỉ ion, quá trình đứt gãy phải dùng mũi tên Cân Bằng 2 Chiều thuận nghịch."
      }
    },
    {
      "id": "mod10",
      "type": "warningBox",
      "content": {
        "title": "Sự Thủy phân của Muối - Bẻ gãy Cán Cân Dung Dịch",
        "content": "Cú sốc lớn: Không phải Muối nào pha vào nước cũng Trung Tính (pH=7) như muối ăn NaCl. \nNếu muối kết tinh từ mầm Acid Mạnh đàn áp Base Yếu (VD muối Cục $NH_4Cl$, $FeCl_3$, $Al_2(SO_4)_3$) $\\Rightarrow$ Dung dịch đó sẽ chua hóa ngả PH \n< 7, làm quỳ tím đỏ.\nNgược lại, Muối sinh ra do Base Mạnh bao bọc mầm Acid Yếu (VD $Na_2CO_3, CH_3COONa, K_3PO_4$) $\\Rightarrow$ Ion gốc Yếu đó bòn rút lại phân li Nước để tái chiếm chua $H^+$, để dư kiềm $OH^-$ ra ngả dung dịch thành môi trường Kiềm Xanh (pH > 7). Hiện tượng ăn mòn tái tạo đó gọi là Phản ứng Thủy Phân tạo vị.",
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
        "Cả acid and base"
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
      "description": "Sự điện li, khái niệm pH and ý nghĩa của pH trong thực tiễn (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": null,
  "realWorldApplications": []
};
