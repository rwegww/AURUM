export const bai5 = {
  "id": "hoa8_kntt_bai5",
  "classId": 8,
  "lessonId": 5,
  "programId": "ketnoi",
  "curriculumType": "ketnoi",
  "title": "Bài 5: Định luật bảo toàn khối lượng và Phương trình hóa học",
  "chapter": "Chương 1: Phản ứng hóa học",
  "order": 5,
  "isPremium": false,
  "description": "Nội dung định luật bảo toàn khối lượng, cách lập phương trình hóa học và ý nghĩa định lượng của phương trình.",
  "challenges": [
    {
      "type": "matching",
      "narrative": "Hãy nối các thành phần của một phương trình hóa học đúng.",
      "leftItems": [
        { "id": "e1", "label": "Hệ số (Coefficient)" },
        { "id": "e2", "label": "Chỉ số (Index)" },
        { "id": "e3", "label": "Mũi tên (→)" }
      ],
      "items": [
        { "id": "e3", "label": "Biểu diễn chiều phản ứng" },
        { "id": "e1", "label": "Số đặt trước công thức" },
        { "id": "e2", "label": "Số nhỏ dưới ký hiệu" }
      ],
      "correctOrder": ["e1", "e2", "e3"],
      "question": "Khớp các khái niệm trong phương trình hóa học.",
      "source": "Sách giáo khoa"
    },
    {
      "type": "multiple-choice",
      "narrative": "Cho phản ứng: A + B → C. Biết m_A = 4g, m_C = 10g. Hãy tính khối lượng chất B đã tham gia phản ứng.",
      "options": [
        "6 gam",
        "14 gam",
        "4 gam",
        "10 gam"
      ],
      "correctAnswer": 0,
      "question": "Áp dụng định luật bảo toàn khối lượng: m_A + m_B = m_C.",
      "source": "Tính toán bảo toàn"
    },
    {
      "type": "fill-in-the-blank",
      "narrative": "Trong phản ứng hóa học, sự thay đổi chỉ xảy ra ở liên kết giữa các nguyên tử, còn số lượng nguyên tử mỗi loại được bảo toàn.",
      "placeholder": "Ai đã tìm ra định luật này?",
      "correctAnswer": "Lavoisier",
      "question": "Định luật bảo toàn khối lượng do nhà bác học Lomonosov và ai tìm ra?",
      "source": "Lịch sử hóa học"
    },
    {
      "type": "drag-drop",
      "narrative": "Thử thách lập phương trình: Hãy sắp xếp các bước để cân bằng một phương trình hóa học.",
      "items": [
        { "id": "b1", "label": "Viết sơ đồ phản ứng" },
        { "id": "b2", "label": "Cân bằng số nguyên tử mỗi nguyên tố" },
        { "id": "b3", "label": "Viết phương trình hóa học hoàn chỉnh" }
      ],
      "correctOrder": ["b1", "b2", "b3"],
      "question": "Trình tự lập phương trình hóa học.",
      "source": "Kỹ năng lập phương trình"
    }
  ],
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Định luật bảo toàn khối lượng",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Đây là một trong những định luật nền tảng nhất của hóa học, được phát biểu bởi hai nhà bác học Lomonosov (1748, Nga) và Lavoisier (1774, Pháp). Định luật này giúp chúng ta hiểu rằng vật chất không tự sinh ra hay mất đi trong phản ứng hóa học."
      }
    },
    {
      "id": "mod3",
      "type": "infoBox",
      "content": {
        "title": "Nội dung định luật",
        "content": "**Phát biểu**: Trong một phản ứng hóa học, tổng khối lượng của các **chất sản phẩm** bằng tổng khối lượng của các **chất phản ứng** (chất tham gia).\\n\\n**Biểu thức tổng quát**: Với phản ứng $A + B \\rightarrow C + D$:\\n$$m_A + m_B = m_C + m_D$$",
        "color": "blue"
      }
    },
    {
      "id": "mod4",
      "type": "paragraph",
      "content": {
        "text": "**Giải thích bản chất**: Trong phản ứng hóa học, chỉ có **liên kết giữa các nguyên tử** bị phá vỡ và hình thành liên kết mới. Bản thân các nguyên tử không bị mất đi hay tạo thêm — số lượng nguyên tử của mỗi nguyên tố trước và sau phản ứng luôn **giữ nguyên**. Do khối lượng mỗi nguyên tử không đổi và số lượng không đổi, nên tổng khối lượng được bảo toàn."
      }
    },
    {
      "id": "mod5",
      "type": "warningBox",
      "content": {
        "title": "Lưu ý thường gặp",
        "content": "- Khi nung sắt trong không khí, khối lượng chất rắn **tăng** vì sắt đã kết hợp với oxygen trong không khí tạo thành oxit sắt. Tổng khối lượng ($m_{Fe} + m_{O_2}$) **vẫn bằng** khối lượng oxit sắt tạo thành.\\n- Khi đốt cháy nến, khối lượng nến **giảm** vì sản phẩm ($CO_2$ và $H_2O$) bay hơi vào không khí. Nhưng nếu thu hết sản phẩm, tổng khối lượng vẫn bảo toàn.",
        "color": "orange"
      }
    },
    {
      "id": "mod6",
      "type": "heading",
      "content": {
        "text": "2. Phương trình hóa học",
        "level": "h2"
      }
    },
    {
      "id": "mod7",
      "type": "paragraph",
      "content": {
        "text": "Phương trình hóa học không chỉ là những ký hiệu khô khan, mà là **ngôn ngữ toàn cầu** của hóa học. Nó biểu diễn ngắn gọn diễn biến của một phản ứng, cho biết danh tính các chất tham gia, sản phẩm tạo thành và đặc biệt là **tỉ lệ số lượng** giữa chúng. Một phương trình được cân bằng đúng chính là chìa khóa để giải quyết mọi bài toán tính toán sau này."
      }
    },
    {
      "id": "mod8",
      "type": "heading",
      "content": {
        "text": "3. Ba bước lập phương trình hóa học",
        "level": "h2"
      }
    },
    {
      "id": "mod9",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Bước 1 — Viết sơ đồ phản ứng**: Ghi công thức hóa học của các chất tham gia (trái) và sản phẩm (phải), ngăn cách bởi mũi tên nét đứt. Ví dụ: $Al + O_2 \\dashrightarrow Al_2O_3$.",
          "**Bước 2 — Cân bằng số nguyên tử**: Đây là bước quan trọng nhất. Chọn hệ số đặt trước các công thức sao cho số nguyên tử mỗi nguyên tố ở hai vế bằng nhau. \\n  *Mẹo nhỏ*: Ưu tiên cân bằng nguyên tố có số nguyên tử lớn nhất hoặc xuất hiện ít nhất trước. Nếu có nhóm nguyên tử (như $SO_4, OH$) giữ nguyên sau phản ứng, hãy cân bằng cả nhóm như một đơn vị.",
          "**Bước 3 — Viết phương trình hoàn chỉnh**: Thay mũi tên nét đứt bằng mũi tên nét liền. Kiểm tra lại lần cuối tất cả các hệ số."
        ]
      }
    },
    {
      "id": "mod10",
      "type": "heading",
      "content": {
        "text": "4. Ví dụ minh họa cân bằng phương trình",
        "level": "h2"
      }
    },
    {
      "id": "mod11",
      "type": "infoBox",
      "content": {
        "title": "Ví dụ 1: Phản ứng đốt cháy Nhôm",
        "content": "**Sơ đồ**: $Al + O_2 \\rightarrow Al_2O_3$\\n\\n**Bước cân bằng**:\\n- Đếm: Vế trái có 1 Al, 2 O. Vế phải có 2 Al, 3 O. → Chưa bằng nhau.\\n- Cân bằng Al: Đặt hệ số 2 trước Al → $2Al + O_2 \\rightarrow Al_2O_3$. Al đã bằng (2=2).\\n- Cân bằng O: Vế trái có 2 O, vế phải có 3 O. Bội chung nhỏ nhất của 2 và 3 là 6. → Đặt hệ số 3 trước $O_2$ và 2 trước $Al_2O_3$.\\n- Kiểm tra lại Al: Vế trái cần 4 Al → hệ số 4.\\n\\n**Kết quả**: $4Al + 3O_2 \\rightarrow 2Al_2O_3$",
        "color": "blue"
      }
    },
    {
      "id": "mod12",
      "type": "infoBox",
      "content": {
        "title": "Ví dụ 2: Phản ứng đốt cháy Metan",
        "content": "**Sơ đồ**: $CH_4 + O_2 \\rightarrow CO_2 + H_2O$\\n\\n- C: 1 = 1 ✓\\n- H: 4 bên trái, 2 bên phải → đặt hệ số **2** trước $H_2O$: $CH_4 + O_2 \\rightarrow CO_2 + 2H_2O$\\n- O: Bên phải có $2 + 2 = 4$ O, bên trái có 2 O → đặt hệ số **2** trước $O_2$.\\n\\n**Kết quả**: $CH_4 + 2O_2 \\rightarrow CO_2 + 2H_2O$\\n\\nKiểm tra: C(1=1) ✓, H(4=4) ✓, O(4=4) ✓",
        "color": "blue"
      }
    },
    {
      "id": "mod13",
      "type": "heading",
      "content": {
        "text": "5. Ý nghĩa của phương trình hóa học",
        "level": "h2"
      }
    },
    {
      "id": "mod14",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Ý nghĩa định tính**: Cho biết chất nào phản ứng với chất nào, sản phẩm tạo thành là gì.",
          "**Ý nghĩa định lượng**: Cho biết **tỉ lệ số mol** (và số phân tử) giữa các chất. Ví dụ: $2H_2 + O_2 \\rightarrow 2H_2O$ cho biết cứ 2 mol $H_2$ phản ứng với 1 mol $O_2$ tạo ra 2 mol $H_2O$.",
          "**Ứng dụng**: Từ phương trình, ta có thể tính được lượng chất cần dùng hoặc lượng sản phẩm thu được — đây là nền tảng cho bài toán hóa học."
        ]
      }
    },
    {
      "id": "mod15",
      "type": "heading",
      "content": {
        "text": "6. Bài tập vận dụng định luật BTKL",
        "level": "h2"
      }
    },
    {
      "id": "mod16",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Bài mẫu**: Cho 5,6g sắt tác dụng hoàn toàn với dung dịch $HCl$, thu được $FeCl_2$ và 0,2g khí $H_2$. Biết lượng $HCl$ đã dùng là 7,3g. Tính khối lượng $FeCl_2$ tạo thành.\\n  *Giải*: Theo ĐLBTKL: $m_{Fe} + m_{HCl} = m_{FeCl_2} + m_{H_2}$.\\n  $5,6 + 7,3 = m_{FeCl_2} + 0,2$.\\n  $m_{FeCl_2} = 12,9 - 0,2 = 12,7$g."
        ]
      }
    },
    {
      "id": "mod17",
      "type": "heading",
      "content": {
        "text": "7. Ý nghĩa thực tiễn của Định luật BTKL",
        "level": "h2"
      }
    },
    {
      "id": "mod18",
      "type": "paragraph",
      "content": {
        "text": "Trong công nghiệp hóa chất, định luật này giúp kỹ sư tính toán chính xác lượng nguyên liệu cần nhập vào để thu được sản lượng mong muốn, tránh lãng phí và kiểm soát chất thải. Nếu tổng khối lượng sản phẩm thu được ít hơn đầu vào một cách bất thường, đó là dấu hiệu của sự rò rỉ hoặc phản ứng phụ không mong muốn—một mấu chốt để bảo vệ môi trường và tối ưu hóa chi phí."
      }
    }
  ],
  "quizzes": [],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: Định luật bảo toàn khối lượng và phương trình hóa học",
      "url": "https://www.youtube.com/watch?v=5Wj-98YFpNw",
      "thumbnail": "https://img.youtube.com/vi/5Wj-98YFpNw/0.jpg",
      "description": "Nội dung định luật bảo toàn khối lượng và các bước cân bằng phương trình hóa học (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Trong một phản ứng hóa học, tổng khối lượng của các chất sản phẩm so với các chất tham gia là:",
        "options": [
          "Lớn hơn",
          "Nhỏ hơn",
          "Bằng nhau",
          "Khác nhau"
        ],
        "correctAnswer": 2,
        "explanation": "Định luật bảo toàn khối lượng khẳng định tổng khối lượng không đổi.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Cho phản ứng: $A + B \\rightarrow C + D$. Nếu biết $m_A = 5g, m_B = 10g, m_C = 7g$, thì khối lượng chất $D$ là:",
        "options": [
          "15g",
          "8g",
          "12g",
          "3g"
        ],
        "correctAnswer": 1,
        "explanation": "$m_D = (m_A + m_B) - m_C = (5 + 10) - 7 = 8g$.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Tại sao khi nung một thanh sắt trong không khí, khối lượng thanh sắt lại tăng lên?",
        "options": [
          "Vì chất rắn kết hợp thêm khí $O_2$ từ môi trường",
          "Vì sắt nở ra khi nóng",
          "Vì cân bị lỗi",
          "Vì nguyên tử sắt nặng hơn"
        ],
        "correctAnswer": 0,
        "explanation": "Phản ứng hóa hợp làm tăng khối lượng chất rắn.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Hệ số cân bằng của phương trình: $P + O_2 \\dashrightarrow P_2O_5$ lần lượt là:",
        "options": [
          "2, 5, 2",
          "4, 5, 2",
          "4, 3, 2",
          "2, 3, 1"
        ],
        "correctAnswer": 1,
        "explanation": "$4P + 5O_2 \\rightarrow 2P_2O_5$.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Cân bằng phương trình: $Al + HCl \\rightarrow AlCl_3 + H_2$. Tổng hệ số (nguyên, tối giản) các chất là:",
        "options": [
          "13",
          "11",
          "12",
          "10"
        ],
        "correctAnswer": 0,
        "explanation": "$2Al + 6HCl \\rightarrow 2AlCl_3 + 3H_2 \\Rightarrow 2+6+2+3 = 13$.",
        "points": 10
      }
    ],
    "intermediate": [],
    "advanced": []
  },
  "realWorldApplications": []
};
