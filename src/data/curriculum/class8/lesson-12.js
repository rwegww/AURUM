export const bai12 = {
  "id": "hoa8_kntt_bai12",
  "classId": 8,
  "lessonId": 12,
  "programId": "ketnoi",
  "curriculumType": "ketnoi",
  "title": "Bài 12: Phân bón hóa học",
  "chapter": "Chương 2: Một số hợp chất thông dụng",
  "order": 12,
  "isPremium": false,
  "description": "Vai trò nguyên tố dinh dưỡng, các loại phân bón thông dụng (Đạm, Lân, Kali, NPK) and nguyên tắc sử dụng hợp lí.",
  "challenges": [
    {
      "type": "matching",
      "narrative": "Hãy nối các nguyên tố dinh dưỡng with vai trò chính của chúng đối with cây.",
      "leftItems": [
        { "id": "p1", "label": "Đạm (N)" },
        { "id": "p2", "label": "Lân (P)" },
        { "id": "p3", "label": "Kali (K)" }
      ],
      "items": [
        { "id": "p2", "label": "Phát triển rễ and hoa" },
        { "id": "p1", "label": "Phát triển thân and lá" },
        { "id": "p3", "label": "Năng suất, chống chịu sâu bệnh" }
      ],
      "correctOrder": ["p1", "p2", "p3"],
      "question": "Vai trò của các nguyên tố đa lượng.",
      "source": "Giá trị dinh dưỡng"
    },
    {
      "type": "multiple-choice",
      "narrative": "Phân bón giúp cung cấp các nguyên tố thiết yếu cho cây trồng. 'NPK' là loại phân hỗn hợp rất phổ biến.",
      "options": [
        "Nitơ (N), Photpho (P), Kali (K)",
        "Natri (Na), Photpho (P), Kali (K)",
        "Nitơ (N), Lưu huỳnh (S), Kali (K)",
        "Niken (Ni), Photpho (P), Kali (K)"
      ],
      "correctAnswer": 0,
      "question": "Ba nguyên tố chính trong phân NPK là gì?",
      "source": "Phân bón hỗn hợp"
    },
    {
      "type": "fill-in-the-blank",
      "narrative": "Một loại phân đạm rất phổ biến có công thức $(NH_2)_2CO$ and chứa hàm lượng đạm rất cao (khoảng 46%N).",
      "placeholder": "Nhập tên (ví dụ: Ure)...",
      "correctAnswer": "Ure",
      "question": "Tên gọi của loại phân đạm này là gì?",
      "source": "Sản xuất nông nghiệp"
    },
    {
      "type": "drag-drop",
      "narrative": "Hãy sắp xếp các 'nguyên tắc 4 đúng' trong việc bón phân.",
      "items": [
        { "id": "d1", "label": "Đúng loại, Đúng lượng" },
        { "id": "d2", "label": "Đúng lúc" },
        { "id": "d3", "label": "Đúng cách" }
      ],
      "correctOrder": ["d1", "d2", "d3"],
      "question": "Các nguyên tắc bón phân hợp lý là gì?",
      "source": "Kỹ thuật canh tác"
    }
  ],
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Vai trò của Phân bón hóa học",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Phân bón hóa học là những hóa chất có chứa các **nguyên tố dinh dưỡng** cần thiết cho cây trồng, được bón vào đất hoặc phun lên lá nhằm nâng cao năng suất and chất lượng nông sản. Ba nguyên tố dinh dưỡng chính (đa lượng) mà cây cần nhiều nhất là **Nitrogen (N)**, **Phosphorus (P)** and **Potassium (K)**."
      }
    },
    {
      "id": "mod3",
      "type": "infoBox",
      "content": {
        "title": "Vai trò của từng nguyên tố",
        "content": "- **Nitrogen (N)**: Thành phần của protein, axit nucleic (DNA/RNA) and chlorophyll. Giúp cây **phát triển thân, lá**, lá xanh tốt. Thiếu N → cây còi cọc, lá vàng.\\n- **Phosphorus (P)**: Tham gia cấu tạo ATP (năng lượng tế bào), DNA. Giúp cây **phát triển rễ, ra hoa, kết quả**. Thiếu P → rễ yếu, ra hoa muộn.\\n- **Potassium (K)**: Điều hòa áp suất thẩm thấu, tổng hợp đường, tinh bột. Giúp cây **chống chịu** (hạn, rét, sâu bệnh), tăng chất lượng nông sản. Thiếu K → lá mép vàng, quả nhỏ.",
        "color": "blue"
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Các loại phân bón đơn",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Phân Đạm (cung cấp N)**:\\n  - **Urea** $(NH_2)_2CO$ — chứa $46\\%$ N, phổ biến nhất, hòa tan tốt.\\n  - **Ammonium nitrate** $NH_4NO_3$ — chứa $35\\%$ N, tan tốt nhưng dễ hút ẩm.\\n  - **Ammonium sulfate** $(NH_4)_2SO_4$ — chứa $21\\%$ N and S, ít hút ẩm hơn.\\n  *Tác dụng*: Kích thích cây ra lá, phát triển thân nhanh.",
          "**Phân Lân (cung cấp P)**:\\n  - **Supephốtphat đơn**: $Ca(H_2PO_4)_2 + CaSO_4$.\\n  - **Supephốtphat kép**: $Ca(H_2PO_4)_2$ (hàm lượng P cao hơn).\\n  - **Phân lân nung chảy**: Không tan trong nước, thích hợp cho đất chua.\\n  *Tác dụng*: Giúp rễ phát triển, cây ra hoa kết quả tốt.",
          "**Phân Kali (cung cấp K)**:\\n  - $KCl$ (Kali clorua) — phổ biến, rẻ, dễ kiếm.\\n  - $K_2SO_4$ (Kali sunfat) — dùng cho cây không ưa Clo.\\n  *Tác dụng*: Tăng sức đề kháng, giúp cây cứng cáp, tăng phẩm chất nông sản."
        ]
      }
    },
    {
      "id": "mod6",
      "type": "heading",
      "content": {
        "text": "3. Phân hỗn hợp and phân vi lượng",
        "level": "h2"
      }
    },
    {
      "id": "mod7",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Phân hỗn hợp NPK**: Chứa cả ba nguyên tố N, P, K theo tỉ lệ khác nhau (ví dụ NPK 16-16-8 nghĩa là 16%N, 16%P₂O₅, 8%K₂O). Tiện lợi, cung cấp dinh dưỡng cân đối.",
          "**Phân phức hợp**: Vừa chứa N vừa chứa P trong cùng một phân tử. Ví dụ: Diamoni hydro phosphate $(NH_4)_2HPO_4$ (DAP).",
          "**Phân vi lượng**: Cung cấp các nguyên tố cây cần **rất ít** nhưng cực kỳ quan trọng: Bo (B), Mangan (Mn), Kẽm (Zn), Đồng (Cu), Molypden (Mo)... Thiếu vi lượng → cây sinh bệnh; thừa → gây ngộ độc."
        ]
      }
    },
    {
      "id": "mod8",
      "type": "heading",
      "content": {
        "text": "4. Nguyên tắc sử dụng phân bón hợp lý",
        "level": "h2"
      }
    },
    {
      "id": "mod9",
      "type": "warningBox",
      "content": {
        "title": "Bón phân đúng kỹ thuật — 4 ĐÚNG",
        "content": "1. **Đúng loại**: Chọn phân phù hợp with loại đất and loại cây (cây lá cần nhiều N, cây quả cần nhiều K).\\n2. **Đúng lượng**: Không bón quá nhiều (gây lãng phí, ô nhiễm) hoặc quá ít (cây thiếu dinh dưỡng). Theo khuyến cáo trên bao bì.\\n3. **Đúng thời kỳ**: Bón lót trước khi gieo (phân lân), bón thúc khi cây đang sinh trưởng (phân đạm), bón khi cây ra hoa (phân kali).\\n4. **Đúng cách**: Bón vào gốc rễ (phân rễ), phun lên lá (phân bón lá), không bón khi trời mưa to.",
        "color": "orange"
      }
    },
    {
      "id": "mod10",
      "type": "heading",
      "content": {
        "text": "5. Tác hại của việc lạm dụng phân bón",
        "level": "h2"
      }
    },
    {
      "id": "mod11",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Ô nhiễm nguồn nước**: Phân bón dư thừa bị rửa trôi xuống sông hồ → tảo phát triển mạnh (phú dưỡng hóa) → hút hết oxy → cá and sinh vật thủy sinh chết.",
          "**Đất bạc màu**: Bón quá nhiều phân hóa học lâu dài → phá hủy cấu trúc đất, giảm vi sinh vật có ích, đất chai cứng.",
          "**Nguy hại sức khỏe**: Dư lượng nitrate ($NO_3^-$) trong rau quả có thể chuyển hóa thành nitrite ($NO_2^-$) — chất gây ung thư.",
          "**Khuyến nghị**: Nên kết hợp phân hóa học with phân hữu cơ (phân chuồng, phân xanh) để vừa cung cấp dinh dưỡng vừa cải tạo đất."
        ]
      }
    },
    {
      "id": "mod12",
      "type": "infoBox",
      "content": {
        "title": "Lưu ý thực tế quan trọng",
        "content": "- **Không** bón phân đạm ($NH_4^+$) cùng with vôi ($Ca(OH)_2$) vì sẽ xảy ra phản ứng giải phóng khí $NH_3$ (amoniac), làm mất đạm.\\n- **Phân lân nung chảy** thích hợp cho đất chua (đất có pH thấp). **Supephốtphat** thích hợp cho đất trung tính hoặc kiềm.\\n- Bón phân NPK là cách tiện lợi nhất để cung cấp đủ 3 nguyên tố cùng lúc.",
        "color": "green"
      }
    }
  ],
  "quizzes": [],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: Phân bón hóa học",
      "url": "https://www.youtube.com/watch?v=zPQFk6U7b9c",
      "thumbnail": "https://img.youtube.com/vi/zPQFk6U7b9c/0.jpg",
      "description": "Vai trò của phân bón đối with cây trồng and các loại phân N, P, K phổ biến (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Phân đạm cung cấp nguyên tố dinh dưỡng nào?",
        "options": [
          "N (Nitrogen)",
          "P (Phosphorus)",
          "K (Potassium)",
          "S (Sulfur)"
        ],
        "correctAnswer": 0,
        "explanation": "N.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Phân bón NPK là loại phân bón:",
        "options": [
          "Phân đơn",
          "Phân hỗn hợp",
          "Phân vi lượng",
          "Phân hữu cơ"
        ],
        "correctAnswer": 1,
        "explanation": "Chứa cả 3 nguyên tố chính.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Phân Kali ($K$) có tác dụng chính là giúp cây:",
        "options": [
          "Phát triển lá xanh",
          "Cứng cáp, chịu rét, chống sâu bệnh",
          "Nảy mầm nhanh",
          "Thơm quả"
        ],
        "correctAnswer": 1,
        "explanation": "Kali giúp tăng sức đề kháng cho cây.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Người ta không bón phân đạm cùng with vôi vì:",
        "options": [
          "Làm tốn phân",
          "Xảy ra phản ứng giải phóng khí amoniac làm mất đạm",
          "Làm đất quá cứng",
          "Làm cây héo"
        ],
        "correctAnswer": 1,
        "explanation": "Mất chất dinh dưỡng dưới dạng khí.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Tại sao cần bón phân vi lượng cho cây with lượng rất nhỏ?",
        "options": [
          "Vì nó đắt",
          "Vì cây chỉ cần một lượng rất ít nhưng cực kỳ quan trọng",
          "Vì nó gây độc nếu dùng nhiều",
          "Cả b and c"
        ],
        "correctAnswer": 3,
        "explanation": "Thiếu thì cây bệnh, thừa thì gây độc.",
        "points": 10
      }
    ],
    "intermediate": [],
    "advanced": []
  },
  "realWorldApplications": []
};
