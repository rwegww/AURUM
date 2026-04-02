export const bai8 = {
  "id": "hoa8_kntt_bai8",
  "classId": 8,
  "lessonId": 8,
  "programId": "ketnoi",
  "curriculumType": "ketnoi",
  "title": "Bài 8: acid",
  "chapter": "Chương 2: Một số hợp chất thông dụng",
  "order": 8,
  "isPremium": false,
  "description": "Khái niệm acid, tính chất hóa học (quỳ tím, + kim loại, + base, + oxide base) and một số acid thông dụng trong đời sống.",
  "challenges": [
    {
      "type": "multiple-choice",
      "narrative": "Pha loãng Acid Sunfuric ($H_2SO_4$) đặc là một thao tác cực kỳ nguy hiểm.",
      "options": [
        "Rót nhanh nước vào acid đặc",
        "Rót từ từ nước vào acid đặc và khuấy",
        "Rót từ từ acid đặc vào nước và khuấy nhẹ",
        "Đổ cả hai cùng lúc vào một xô lớn"
      ],
      "correctAnswer": 2,
      "question": "Thao tác pha loãng acid đặc an toàn là gì?",
      "source": "Quy tắc an toàn"
    },
    {
      "type": "matching",
      "narrative": "Hãy nối các acid sau với ứng dụng thực tế của chúng.",
      "leftItems": [
        { "id": "a1", "label": "Acid Clohydric (HCl)" },
        { "id": "a2", "label": "Acid Sunfuric (H2SO4)" },
        { "id": "a3", "label": "Acid Acetic (CH3COOH)" }
      ],
      "items": [
        { "id": "a3", "label": "Thành phần của giấm ăn" },
        { "id": "a1", "label": "Có trong dịch vị dạ dày" },
        { "id": "a2", "label": "Sản xuất phân bón, ắc quy" }
      ],
      "correctOrder": ["a1", "a2", "a3"],
      "question": "Khớp các loại acid với vai trò của chúng.",
      "source": "Acid trong đời sống"
    },
    {
      "type": "fill-in-the-blank",
      "narrative": "Khi cho acid tác dụng with một kim loại như kẽm ($Zn$), ta thấy sủi bọt khí. Đó là khí gì?",
      "placeholder": "Nhập tên khí (ví dụ: Hidro)...",
      "correctAnswer": "Hidro",
      "question": "Khí thoát ra khi kim loại (đứng trước H) phản ứng with acid loãng là gì?",
      "source": "Tính chất hóa học"
    },
    {
      "type": "drag-drop",
      "narrative": "Hãy hoàn thành sơ đồ phản ứng trung hòa: Acid + Base $\\rightarrow$ ...",
      "items": [
        { "id": "p1", "label": "Muối" },
        { "id": "p2", "label": "+" },
        { "id": "p3", "label": "Nước" }
      ],
      "correctOrder": ["p1", "p2", "p3"],
      "question": "Sản phẩm của phản ứng trung hòa là gì?",
      "source": "Phản ứng trung hòa"
    }
  ],
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Khái niệm về Acid",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Acid là những hợp chất mà phân tử gồm có một hay nhiều nguyên tử hydrogen liên kết with **gốc acid**. Khi tan trong nước, acid phân li tạo ra ion $H^+$ (hay $H_3O^+$) — chính ion này quyết định tính chất đặc trưng của acid."
      }
    },
    {
      "id": "mod3",
      "type": "infoBox",
      "content": {
        "title": "Công thức chung và Cách gọi tên",
        "content": "**Công thức chung**: $H_nA$ (with $n$ là hóa trị của gốc acid $A$).\\n\\n**Cách đọc tên**:\\n- Acid không có oxygen: Acid + tên phi kim + hydric. (Vd: $HCl$ — Acid clohydric).\\n- Acid có oxygen (nhiều O): Acid + tên phi kim + ic. (Vd: $H_2SO_4$ — Acid sunfuric).\\n- Acid có oxygen (ít O): Acid + tên phi kim + ous. (Vd: $H_2SO_3$ — Acid sunfurous).\\n\\n**Một số acid thông dụng**:\\n- $HCl$: Acid clohydric (có trong dạ dày)\\n- $H_2SO_4$: Acid sunfuric (vua của các acid)\\n- $HNO_3$: Acid nitric (dùng sản xuất phân bón)\\n- $CH_3COOH$: Acid acetic (giấm ăn, nồng độ 2-5%)",
        "color": "blue"
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Tính chất hóa học của Acid",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**a) Làm đổi màu chỉ thị**: Dung dịch acid làm **quỳ tím chuyển đỏ**. Đây là cách đơn giản nhất để nhận biết acid. (Phenolphthalein không đổi màu trong acid).",
          "**b) Tác dụng with kim loại**: Acid loãng tác dụng with nhiều kim loại **đứng trước $H$** trong dãy hoạt động hóa học → tạo **muối + khí $H_2$**.\\n  *Ví dụ*: $Zn + 2HCl \\rightarrow ZnCl_2 + H_2 \\uparrow$\\n  *Lưu ý*: Kim loại đứng sau $H$ (Cu, Ag, Au) **không** phản ứng with acid loãng thông thường.",
          "**c) Tác dụng with Base oxide**: Tạo **muối + nước**.\\n  *Ví dụ*: $CuO + 2HCl \\rightarrow CuCl_2 + H_2O$\\n  (Tán bột $CuO$ đen vào dung dịch $HCl$ → dung dịch chuyển sang **màu xanh lam** do tạo $CuCl_2$).",
          "**d) Tác dụng with Base (Phản ứng trung hòa)**: Tạo **muối + nước**.\\n  *Ví dụ*: $NaOH + HCl \\rightarrow NaCl + H_2O$\\n  Đây là phản ứng có ý nghĩa rất quan trọng trong y tế (dùng thuốc kháng acid chữa đau dạ dày).",
          "**e) Tác dụng with muối**: Tạo muối mới và acid mới (sẽ học kỹ ở bài Muối).\\n  *Ví dụ*: $BaCl_2 + H_2SO_4 \\rightarrow BaSO_4 \\downarrow + 2HCl$"
        ]
      }
    },
    {
      "id": "mod6",
      "type": "heading",
      "content": {
        "text": "3. Dãy hoạt động hóa học của kim loại",
        "level": "h2"
      }
    },
    {
      "id": "mod7",
      "type": "infoBox",
      "content": {
        "title": "Thứ tự từ mạnh đến yếu",
        "content": "$K > Na > Ca > Mg > Al > Zn > Fe > Ni > Sn > Pb > (H) > Cu > Hg > Ag > Pt > Au$\\n\\n- Kim loại đứng **trước $H$** → phản ứng được with acid loãng, giải phóng $H_2$.\\n- Kim loại đứng **sau $H$** → **không** phản ứng with acid loãng ($HCl$, $H_2SO_4$ loãng).\\n\\n**Mẹo nhớ**: *Khi Nào Cần May Áo Záp Sắt Nịt Sắn Phải (H¹) Cu Hà Ác Phạt Âu.*",
        "color": "green"
      }
    },
    {
      "id": "mod8",
      "type": "heading",
      "content": {
        "text": "4. Acid Sunfuric đặc ($H_2SO_4$ đặc)",
        "level": "h2"
      }
    },
    {
      "id": "mod9",
      "type": "paragraph",
      "content": {
        "text": "$H_2SO_4$ đặc có những tính chất đặc biệt mà acid loãng không có, khiến nó trở thành một trong những hóa chất nguy hiểm nhất trong phòng thí nghiệm."
      }
    },
    {
      "id": "mod10",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Tính háo nước**: $H_2SO_4$ đặc hút nước mãnh liệt, có thể rút nước từ các hợp chất hữu cơ. Khi nhỏ lên đường ($C_{12}H_{22}O_{11}$), acid sẽ rút $H_2O$ ra, biến đường trắng thành cột carbon đen phồng lên (thí nghiệm 'rắn carbon').",
          "**Tính oxy hóa mạnh**: $H_2SO_4$ đặc nóng có thể hòa tan cả kim loại Cu (đứng sau H): $Cu + 2H_2SO_4 (đặc, nóng) \\rightarrow CuSO_4 + SO_2 \\uparrow + 2H_2O$.",
          "**Pha loãng acid đặc**: Luôn nhớ quy tắc: **rót acid vào nước**, khuấy nhẹ, TUYỆT ĐỐI KHÔNG rót nước vào acid đặc."
        ]
      }
    },
    {
      "id": "mod11",
      "type": "heading",
      "content": {
        "text": "5. Ứng dụng của Acid",
        "level": "h2"
      }
    },
    {
      "id": "mod12",
      "type": "warningBox",
      "content": {
        "title": "Acid trong đời sống và sản xuất",
        "content": "- **$HCl$**: Có trong dịch vị dạ dày ($pH \\approx 1-2$), giúp tiêu hóa protein và tiêu diệt vi khuẩn. Trong công nghiệp dùng tẩy gỉ kim loại.\\n- **$H_2SO_4$**: Sản xuất phân bón (supephốtphat), chất tẩy rửa, ắc quy ô tô, tinh chế dầu mỏ. Được mệnh danh là 'máu của công nghiệp hóa chất'.\\n- **$CH_3COOH$**: Giấm ăn (nồng độ 2-5%), dùng trong chế biến thực phẩm, làm gia vị, ngâm dưa chua.\\n- **Acid citric** (trong chanh, cam): Tạo vị chua tự nhiên, dùng trong bảo quản thực phẩm.",
        "color": "orange"
      }
    }
  ],
  "quizzes": [],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: acid",
      "url": "https://www.youtube.com/watch?v=QDVGQwxU8XA",
      "thumbnail": "https://img.youtube.com/vi/QDVGQwxU8XA/0.jpg",
      "description": "Khái niệm, tên gọi và tính chất hóa học đặc trưng của Acid (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Axit clohydric ($HCl$) làm quỳ tím chuyển sang màu gì?",
        "options": [
          "Xanh",
          "Đỏ",
          "Vàng",
          "Không đổi màu"
        ],
        "correctAnswer": 1,
        "explanation": "Axit làm quỳ tím hóa đỏ.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Khi cho sắt ($Fe$) tác dụng with dung dịch $HCl$, khí nào sinh ra?",
        "options": [
          "$O_2$",
          "$CO_2$",
          "$H_2$",
          "$Cl_2$"
        ],
        "correctAnswer": 2,
        "explanation": "Giải phóng hidro.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Axit sunfuric ($H_2SO_4$) đặc có tính chất đặc trưng nào sau đây?",
        "options": [
          "Tính háo nước mạnh",
          "Làm quỳ tím hóa xanh",
          "Không tác dụng with kim loại",
          "Mùi thơm"
        ],
        "correctAnswer": 0,
        "explanation": "Axit H2SO4 đặc hút nước cực mạnh từ chất hữu cơ.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Phản ứng trung hòa là phản ứng giữa:",
        "options": [
          "Axit and base",
          "Muối and muối",
          "Kim loại and Phi kim",
          "Oxit and nước"
        ],
        "correctAnswer": 0,
        "explanation": "Axit + Base $\\rightarrow$ Muối + Nước.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Chất nào sau đây không phải là axit?",
        "options": [
          "$HNO_3$",
          "$H_2SO_4$",
          "$NaOH$",
          "$CH_3COOH$"
        ],
        "correctAnswer": 2,
        "explanation": "NaOH là base (kiềm).",
        "points": 10
      }
    ],
    "intermediate": [],
    "advanced": []
  },
  "realWorldApplications": []
};
