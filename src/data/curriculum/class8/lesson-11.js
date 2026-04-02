export const bai11 = {
  "id": "hoa8_kntt_bai11",
  "classId": 8,
  "lessonId": 11,
  "programId": "ketnoi",
  "curriculumType": "ketnoi",
  "title": "Bài 11: muối",
  "chapter": "Chương 2: Một số hợp chất thông dụng",
  "order": 11,
  "isPremium": false,
  "description": "Khái niệm muối, cách gọi tên, tính tan, tính chất hóa học, các cách điều chế muối and mối quan hệ vô cơ.",
  "challenges": [
    {
      "type": "matching",
      "narrative": "Hãy nối các muối sau with màu sắc kết tủa đặc trưng của chúng.",
      "leftItems": [
        { "id": "m1", "label": "Bạc clorua (AgCl)" },
        { "id": "m2", "label": "Đồng(II) hydroxide (tạo từ muối Cu)" },
        { "id": "m3", "label": "Bari sunfat (BaSO4)" }
      ],
      "items": [
        { "id": "m2", "label": "Màu xanh lam" },
        { "id": "m1", "label": "Màu trắng" },
        { "id": "m3", "label": "Màu trắng (rất bền)" }
      ],
      "correctOrder": ["m1", "m2", "m3"],
      "question": "Khớp muối/kết tủa with màu sắc.",
      "source": "Nhận biết hóa chất"
    },
    {
      "type": "multiple-choice",
      "narrative": "Tính tan của muối là kiến thức rất quan trọng để xác định sản phẩm phản ứng.",
      "options": [
        "Tất cả muối Nitrate ($NO_3$) đều tan",
        "Tất cả muối Clorua ($Cl$) đều không tan",
        "Muối Bari Sunfat ($BaSO_4$) tan rất tốt",
        "Muối Cacbonat của kim loại kiềm không tan"
      ],
      "correctAnswer": 0,
      "question": "Phát biểu nào sau đây đúng về tính tan của muối?",
      "source": "Bảng tính tan"
    },
    {
      "type": "fill-in-the-blank",
      "narrative": "Phản ứng trao đổi trong dung dịch chỉ xảy ra nếu sản phẩm tạo thành có chất khí, nước hoặc chất ...",
      "placeholder": "Nhập từ (ví dụ: Kết tủa)...",
      "correctAnswer": "Kết tủa",
      "question": "Điều kiện quan trọng để phản ứng trao đổi xảy ra là gì?",
      "source": "Phản ứng trao đổi"
    },
    {
      "type": "drag-drop",
      "narrative": "Hãy sắp xếp các thành phần của phản ứng: $AgNO_3 + NaCl \\rightarrow$ ... + ...",
      "items": [
        { "id": "s1", "label": "AgCl (kết tủa)" },
        { "id": "s2", "label": "+" },
        { "id": "s3", "label": "NaNO3" }
      ],
      "correctOrder": ["s1", "s2", "s3"],
      "question": "Sản phẩm của phản ứng giữa bạc nitrate and muối ăn là gì?",
      "source": "Phương trình hóa học"
    }
  ],
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Khái niệm and Phân loại Muối",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Muối là hợp chất mà phân tử gồm có nguyên tử **kim loại** (hoặc nhóm $NH_4^+$) liên kết with **gốc acid**. Muối là sản phẩm chung của nhiều loại phản ứng khác nhau and có ứng dụng rộng rãi trong đời sống."
      }
    },
    {
      "id": "mod3",
      "type": "infoBox",
      "content": {
        "title": "Tên gọi and Phân loại",
        "content": "**Tên gọi**: Tên kim loại (kèm hóa trị nếu cần) + tên gốc acid.\\nVí dụ: $NaCl$ — Natri clorua, $CuSO_4$ — Đồng(II) sunfat, $CaCO_3$ — Canxi cacbonat.\\n\\n**Phân loại**:\\n1. **Muối trung hòa**: Gốc acid **không còn** nguyên tử H có thể thay thế. Ví dụ: $Na_2SO_4$, $KCl$, $CaCO_3$.\\n2. **Muối acid**: Gốc acid **còn** nguyên tử H chưa được thay thế hết. Ví dụ: $NaHCO_3$ (baking soda), $NaHSO_4$, $Ca(HCO_3)_2$ (gây nước cứng).",
        "color": "blue"
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Tính tan của Muối",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "paragraph",
      "content": {
        "text": "Không phải tất cả các muối đều tan trong nước. Để giải bài tập, cần nắm vững quy tắc tính tan:"
      }
    },
    {
      "id": "mod6",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Luôn tan**: Hầu hết muối $Na^+$, $K^+$, $NH_4^+$ đều tan. Muối $NO_3^-$ (nitrate) đều tan. Muối $Cl^-$ (clorua) hầu hết tan (trừ $AgCl$, $PbCl_2$).",
          "**Không tan hoặc ít tan**: Hầu hết muối $CO_3^{2-}$ (cacbonat) không tan (trừ $Na_2CO_3$, $K_2CO_3$). $BaSO_4$ không tan. $AgCl$ kết tủa trắng.",
          "**Mẹo nhớ nhanh**: *'Natri Kali Amoni luôn tan. Nitrate nào cũng tan. Clorua tan trừ Bạc, Chì.'*"
        ]
      }
    },
    {
      "id": "mod7",
      "type": "heading",
      "content": {
        "text": "3. Tính chất hóa học của Muối",
        "level": "h2"
      }
    },
    {
      "id": "mod8",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**a) Tác dụng with Kim loại**: Muối (dung dịch) + kim loại mạnh hơn → muối mới + kim loại mới.\\n  *Ví dụ*: $Fe + CuSO_4 \\rightarrow FeSO_4 + Cu \\downarrow$ (nhúng đinh sắt vào dung dịch $CuSO_4$ xanh → đinh phủ lớp đồng đỏ).",
          "**b) Tác dụng with Acid**: Muối + Acid → Muối mới + Acid mới.\\n  *Ví dụ*: $CaCO_3 + 2HCl \\rightarrow CaCl_2 + H_2O + CO_2 \\uparrow$ (đá vôi sủi bọt trong acid).",
          "**c) Tác dụng with Base tan (Kiềm)**: Muối + Base → Muối mới + Base mới.\\n  *Ví dụ*: $CuSO_4 + 2NaOH \\rightarrow Cu(OH)_2 \\downarrow + Na_2SO_4$ (xuất hiện kết tủa xanh lam).",
          "**d) Tác dụng giữa hai dung dịch Muối**: Muối + Muối → 2 Muối mới.\\n  *Ví dụ*: $AgNO_3 + NaCl \\rightarrow AgCl \\downarrow + NaNO_3$ (kết tủa trắng $AgCl$ xuất hiện).",
          "**e) Bị nhiệt phân hủy**: Một số muối bị phân hủy khi nung nóng.\\n  *Ví dụ*: $CaCO_3 \\xrightarrow{t^\\circ} CaO + CO_2 \\uparrow$ (nung đá vôi tạo vôi sống)."
        ]
      }
    },
    {
      "id": "mod9",
      "type": "heading",
      "content": {
        "text": "4. Phản ứng trao đổi trong dung dịch",
        "level": "h2"
      }
    },
    {
      "id": "mod10",
      "type": "warningBox",
      "content": {
        "title": "Điều kiện xảy ra phản ứng trao đổi",
        "content": "Phản ứng trao đổi trong dung dịch chỉ xảy ra nếu sản phẩm tạo thành có ít nhất một trong các điều kiện sau:\\n- Tạo **chất kết tủa** (↓ không tan).\\n- Tạo **chất khí** (↑ bay hơi).\\n- Tạo **nước** (phản ứng trung hòa).\\n\\n**Ví dụ không xảy ra**: $NaCl + KNO_3$ → không phản ứng vì cả $NaNO_3$ and $KCl$ đều tan tốt, không tạo kết tủa hay khí.",
        "color": "red"
      }
    },
    {
      "id": "mod11",
      "type": "heading",
      "content": {
        "text": "5. Mối quan hệ giữa các hợp chất vô cơ",
        "level": "h2"
      }
    },
    {
      "id": "mod12",
      "type": "infoBox",
      "content": {
        "title": "Sơ đồ chuyển đổi giữa các loại hợp chất",
        "content": "Các loại hợp chất vô cơ (Oxide, Acid, Base, Muối) có thể chuyển đổi qua lại with nhau theo sơ đồ:\\n\\n- **Oxide base** + Nước → **Base** (tan). Oxide base + Acid → **Muối** + Nước.\\n- **Oxide acid** + Nước → **Acid**. Oxide acid + Base → **Muối** + Nước.\\n- **Acid** + Base → **Muối** + Nước (trung hòa).\\n- **Acid** + Kim loại → **Muối** + $H_2$.\\n\\nĐây là mối quan hệ then chốt giúp giải các bài tập chuỗi phản ứng and nhận biết chất.",
        "color": "green"
      }
    },
    {
      "id": "mod13",
      "type": "heading",
      "content": {
        "text": "6. Ứng dụng của Muối trong đời sống",
        "level": "h2"
      }
    },
    {
      "id": "mod14",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**$NaCl$ (Muối ăn)**: Gia vị, bảo quản thực phẩm (muối cá, muối dưa), sản xuất nước mắm, điện phân tạo $NaOH$ and $Cl_2$.",
          "**$CaCO_3$ (Đá vôi)**: Sản xuất xi măng, vôi sống, chất độn trong sơn, kem đánh răng (abrasive nhẹ).",
          "**$NaHCO_3$ (Baking soda)**: Làm bánh (tạo khí $CO_2$ làm bánh nở), thuốc kháng acid dạ dày, chữa cháy nhỏ.",
          "**$CuSO_4$ (Đồng sunfat)**: Pha dung dịch Bordeaux diệt nấm cho cây trồng, mạ đồng điện phân."
        ]
      }
    }
  ],
  "quizzes": [],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: muối",
      "url": "https://www.youtube.com/watch?v=9KfYiVCSof8",
      "thumbnail": "https://img.youtube.com/vi/9KfYiVCSof8/0.jpg",
      "description": "Cách gọi tên, tính chất hóa học and các phản ứng trao đổi tạo thành muối (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Tên gọi của muối $NaCl$ là:",
        "options": [
          "Natri clorua",
          "Natri sunfat",
          "Kali clorua",
          "Canxi cacbonat"
        ],
        "correctAnswer": 0,
        "explanation": "Salt.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Phản ứng trao đổi trong dung dịch chỉ xảy ra khi:",
        "options": [
          "Có chất kết tủa hoặc chất khí",
          "Hai muối đều tan",
          "Cả a and b",
          "Luôn xảy ra"
        ],
        "correctAnswer": 2,
        "explanation": "Điều kiện phản ứng trao đổi.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Muối Bari sunfat ($BaSO_4$) có màu gì and có tan trong nước không?",
        "options": [
          "Màu xanh, tan tốt",
          "Màu trắng, không tan (kết tủa)",
          "Màu vàng, tan nhẹ",
          "Không màu, tan tốt"
        ],
        "correctAnswer": 1,
        "explanation": "BaSO4 là kết tủa trắng đặc trưng.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Để điều chế muối, ta có thể dùng cách nào?",
        "options": [
          "Kim loại + Axit",
          "Axit + base",
          "Muối + muối",
          "Tất cả các ý trên"
        ],
        "correctAnswer": 3,
        "explanation": "Có rất nhiều con đường tạo ra muối.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Thành phần chính của vỏ trứng là muối nào?",
        "options": [
          "$CaCO_3$",
          "$NaCl$",
          "$CaSO_4$",
          "$Mg(NO_3)_2$"
        ],
        "correctAnswer": 0,
        "explanation": "Canxi cacbonat.",
        "points": 10
      }
    ],
    "intermediate": [],
    "advanced": []
  },
  "realWorldApplications": []
};
