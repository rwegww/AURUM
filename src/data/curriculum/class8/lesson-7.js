export const bai7 = {
  "id": "hoa8_kntt_bai7",
  "classId": 8,
  "lessonId": 7,
  "programId": "ketnoi",
  "curriculumType": "ketnoi",
  "title": "Bài 7: Tốc độ phản ứng và chất xúc tác",
  "chapter": "Chương 1: Phản ứng hóa học",
  "order": 7,
  "isPremium": false,
  "description": "Khái niệm tốc độ phản ứng, các yếu tố ảnh thuận và vai trò quan trọng của chất xúc tác, enzyme trong hóa học và đời sống.",
  "challenges": [
    {
      "type": "matching",
      "narrative": "Hãy giúp tôi kết nối các hành động trong đời sống với yếu tố ảnh hưởng đến tốc độ phản ứng tương ứng nhé!",
      "leftItems": [
        { "id": "f1", "label": "Đập nhỏ than để đun nấu" },
        { "id": "f2", "label": "Cất thức ăn vào tủ lạnh" },
        { "id": "f3", "label": "Dùng quạt để nhóm bếp" }
      ],
      "items": [
        { "id": "f2", "label": "Giảm Nhiệt độ" },
        { "id": "f1", "label": "Tăng Diện tích bề mặt" },
        { "id": "f3", "label": "Tăng Nồng độ Oxy" }
      ],
      "correctOrder": ["f1", "f2", "f3"],
      "question": "Nối ví dụ thực tế với yếu tố tác động chính xác.",
      "source": "Ứng dụng thực tiễn"
    },
    {
      "type": "multiple-choice",
      "narrative": "Trong hóa học, có những 'người giúp việc' thầm lặng làm tăng tốc độ phản ứng mà không hề bị tiêu hao. Bạn có biết họ là ai không?",
      "options": [
        "Chất phản ứng chính",
        "Chất xúc tác (Catalyst)",
        "Chất ức chế",
        "Sản phẩm phụ"
      ],
      "correctAnswer": 1,
      "question": "Chất làm tăng tốc độ phản ứng nhưng không biến đổi về lượng và chất gọi là gì?",
      "source": "Lý thuyết tốc độ"
    },
    {
      "type": "fill-in-the-blank",
      "narrative": "Trong cơ thể người, các phản ứng sinh hóa được điều khiển bởi chất xúc tác sinh học đặc biệt giúp tiêu hóa thức ăn nhanh hơn.",
      "placeholder": "Nhập tên (ví dụ: Enzyme)...",
      "correctAnswer": "Enzyme",
      "question": "Tên gọi của các chất xúc tác sinh học trong cơ thể sống là gì?",
      "source": "Xúc tác sinh học"
    },
    {
      "type": "drag-drop",
      "narrative": "Để làm chủ tốc độ phản ứng, bạn cần nắm vững các công cụ điều khiển. Hãy lắp ráp các yếu tố ảnh hưởng chính sau đây.",
      "items": [
        { "id": "yt1", "label": "Nồng độ, Nhiệt độ" },
        { "id": "yt2", "label": "Diện tích bề mặt" },
        { "id": "yt3", "label": "Áp suất, Xúc tác" }
      ],
      "correctOrder": ["yt1", "yt2", "yt3"],
      "question": "Các yếu tố chính ảnh hưởng đến tốc độ phản ứng là gì?",
      "source": "Tổng kết yếu tố"
    }
  ],
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Khái niệm về Tốc độ phản ứng",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Tốc độ phản ứng là đại lượng đặc trưng cho sự biến đổi nồng độ của một trong các chất phản ứng hoặc sản phẩm trong một đơn vị thời gian. Phản ứng xảy ra nhanh khi biến đổi lớn trong thời gian ngắn, và ngược lại."
      }
    },
    {
      "id": "mod3",
      "type": "infoBox",
      "content": {
        "title": "Ý nghĩa của Tốc độ phản ứng",
        "content": "Trong thực tế, việc kiểm soát tốc độ phản ứng giúp chúng ta tiết kiệm thời gian (trong sản xuất công nghiệp) hoặc bảo quản đồ dùng tốt hơn (làm chậm sự gỉ sét, hư hỏng thức ăn).",
        "color": "blue"
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Các yếu tố ảnh hưởng đến tốc độ phản ứng",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "paragraph",
      "content": {
        "text": "Có 5 yếu tố chính thường được sử dụng để làm thay đổi tốc độ của một phản ứng hóa học:"
      }
    },
    {
      "id": "mod6",
      "type": "infoBox",
      "content": {
        "title": "a) Nồng độ",
        "content": "Khi tăng nồng độ chất phản ứng, số lượng hạt (phân tử, nguyên tử) trong cùng một thể tích tăng lên → số va chạm hiệu quả giữa các hạt tăng → tốc độ phản ứng **tăng**.\\n\\n**Thí nghiệm minh họa**: Thả cùng một viên kẽm vào hai cốc $HCl$ có nồng độ khác nhau. Cốc chứa $HCl$ đặc hơn sẽ sủi bọt khí $H_2$ mạnh và nhanh hơn.",
        "color": "blue"
      }
    },
    {
      "id": "mod7",
      "type": "infoBox",
      "content": {
        "title": "b) Nhiệt độ",
        "content": "Khi **tăng nhiệt độ**, các phân tử chuyển động nhanh hơn, va chạm with nhau mạnh hơn và thường xuyên hơn → tốc độ phản ứng **tăng**.\\n\\n**Quy tắc kinh nghiệm (Van't Hoff)**: Khi nhiệt độ tăng thêm $10^\\circ C$, tốc độ phản ứng thường tăng gấp 2-4 lần.\\n\\n**Thí nghiệm**: Đặt hai cốc nước oxy già ($H_2O_2$): một cốc ở nhiệt độ phòng, một cốc đun nóng $50^\\circ C$. Cốc nóng phân hủy tạo bọt $O_2$ nhanh hơn nhiều.",
        "color": "blue"
      }
    },
    {
      "id": "mod8",
      "type": "infoBox",
      "content": {
        "title": "c) Diện tích bề mặt tiếp xúc",
        "content": "Với chất rắn, khi **nghiền nhỏ hoặc đập nhỏ**, diện tích bề mặt tăng lên → số điểm tiếp xúc giữa chất rắn và chất phản ứng khác tăng → tốc độ phản ứng **tăng**.\\n\\n**Ví dụ thực tế**: Củi chẻ nhỏ cháy nhanh hơn khúc gỗ nguyên. Đường bột tan nhanh hơn đường phèn nguyên cục. Bột sắt cháy sáng rực trong $O_2$ nhưng thanh sắt lớn không tự cháy.",
        "color": "blue"
      }
    },
    {
      "id": "mod9",
      "type": "infoBox",
      "content": {
        "title": "d) Áp suất (đối với chất khí)",
        "content": "Tăng áp suất → thể tích khí giảm → các phân tử khí bị nén gần nhau hơn → tần suất va chạm tăng → tốc độ phản ứng **tăng**.\\n\\n**Ví dụ**: Trong công nghiệp sản xuất ammonia ($NH_3$), người ta dùng áp suất rất cao ($200-300$ atm) để phản ứng $N_2 + 3H_2 \\rightarrow 2NH_3$ đạt hiệu quả.",
        "color": "blue"
      }
    },
    {
      "id": "mod10",
      "type": "heading",
      "content": {
        "text": "3. Chất xúc tác",
        "level": "h2"
      }
    },
    {
      "id": "mod11",
      "type": "paragraph",
      "content": {
        "text": "Chất xúc tác là chất **làm tăng tốc độ phản ứng** nhưng **không bị biến đổi về chất** sau khi phản ứng kết thúc. Nó có thể được thu hồi và tái sử dụng."
      }
    },
    {
      "id": "mod12",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Ví dụ kinh điển**: $MnO_2$ là chất xúc tác cho phản ứng phân hủy $H_2O_2$:\\n  $2H_2O_2 \\xrightarrow{MnO_2} 2H_2O + O_2$. Không có $MnO_2$, phản ứng xảy ra rất chậm. Khi thêm $MnO_2$, oxy sủi bọt rất mạnh.",
          "**Enzyme (chất xúc tác sinh học)**: Trong cơ thể sinh vật, các phản ứng sinh hóa được điều khiển bởi **enzyme** — một loại protein đặc biệt. Enzyme amylase trong nước bọt phân hủy tinh bột thành đường maltose. Enzyme pepsin trong dạ dày phân hủy protein.",
          "**Ứng dụng công nghiệp**: Bộ chuyển đổi xúc tác (catalytic converter) trong ống xả ô tô sử dụng Platinum ($Pt$) và Palladium ($Pd$) để biến khí thải độc ($CO, NO_x$) thành $CO_2$ và $N_2$ ít độc hơn."
        ]
      }
    },
    {
      "id": "mod13",
      "type": "heading",
      "content": {
        "text": "4. Ứng dụng trong đời sống và công nghiệp",
        "level": "h2"
      }
    },
    {
      "id": "mod14",
      "type": "warningBox",
      "content": {
        "title": "Áp dụng kiến thức tốc độ phản ứng",
        "content": "- **Bảo quản thực phẩm trong tủ lạnh**: ↓ Nhiệt độ → ↓ Tốc độ phân hủy vi sinh vật.\\n- **Quạt gió khi nhóm bếp than**: ↑ Nồng độ $O_2$ → than cháy mạnh hơn.\\n- **Chẻ nhỏ củi trước khi đốt**: ↑ Diện tích tiếp xúc → lửa bắt nhanh hơn.\\n- **Sản xuất ammonia (Haber)**: Dùng xúc tác $Fe$, áp suất cao ($200$ atm), nhiệt độ $450^\\circ C$ → tối ưu tốc độ và hiệu suất.\\n- **Phòng ngừa nổ bụi than**: Bụi than mịn trong hầm mỏ có diện tích tiếp xúc rất lớn → cháy cực nhanh → gây nổ.",
        "color": "orange"
      }
    }
  ],
  "quizzes": [],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: Tốc độ phản ứng và chất xúc tác",
      "url": "https://www.youtube.com/watch?v=SrJAeKX8sgg",
      "thumbnail": "https://img.youtube.com/vi/SrJAeKX8sgg/0.jpg",
      "description": "Các yếu tố ảnh hưởng đến tốc độ phản ứng và vai trò của chất xúc tác (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Để tăng tốc độ phản ứng giữa kẽm ($Zn$) và axit clohydric ($HCl$), ta nên làm gì?",
        "options": [
          "Dùng kẽm viên to",
          "Dùng kẽm bột mỏng mịn",
          "Pha loãng axit thêm nữa",
          "Để trong tủ lạnh"
        ],
        "correctAnswer": 1,
        "explanation": "Tăng diện tích tiếp xúc.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Vai trò của chất xúc tác trong phản ứng hóa học là gì?",
        "options": [
          "Làm dừng phản ứng lại",
          "Làm tăng tốc độ phản ứng nhưng không bị biến đổi",
          "Tham gia vào sản phẩm",
          "Làm giảm nhiệt độ"
        ],
        "correctAnswer": 1,
        "explanation": "Chất xúc tác làm nhanh hơn mà không bị tiêu hao.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Tại sao thực phẩm được hút chân không lại bảo quản được lâu hơn?",
        "options": [
          "Vì nồng độ Oxi giảm làm giảm tốc độ phản ứng oxy hóa",
          "Vì thực phẩm bị nén chặt",
          "Vì vi khuẩn thích Oxi",
          "Vì túi nilon bảo vệ"
        ],
        "correctAnswer": 0,
        "explanation": "Giảm nồng độ chất phản ứng (O2) làm chậm tốc độ hư hỏng.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Tốc độ phản ứng hóa học KHÔNG phụ thuộc vào yếu tố nào?",
        "options": [
          "Nhiệt độ",
          "Nồng độ",
          "Áp suất (đối với chất khí)",
          "Màu sắc của dụng cụ thí nghiệm"
        ],
        "correctAnswer": 3,
        "explanation": "Màu sắc bình không ảnh hưởng đến động học phản ứng.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Khi đun nấu bằng bếp than, người ta thường đập nhỏ than để:",
        "options": [
          "Than nhanh cháy hơn do tăng diện tích tiếp xúc",
          "Đỡ tốn than",
          "Giảm lượng khói",
          "Làm lửa xanh hơn"
        ],
        "correctAnswer": 0,
        "explanation": "Tăng bề mặt tiếp xúc với Oxi trong không khí.",
        "points": 10
      }
    ],
    "intermediate": [],
    "advanced": []
  },
  "realWorldApplications": []
};
