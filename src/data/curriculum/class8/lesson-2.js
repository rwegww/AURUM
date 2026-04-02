export const bai2 = {
  "id": "hoa8_kntt_bai2",
  "classId": 8,
  "lessonId": 2,
  "programId": "ketnoi",
  "curriculumType": "ketnoi",
  "title": "Bài 2: Phản ứng hóa học",
  "chapter": "Chương 1: Phản ứng hóa học",
  "order": 2,
  "isPremium": false,
  "description": "Tìm hiểu về biến đổi vật lí, biến đổi hóa học, khái niệm phản ứng hóa học, dấu hiệu nhận biết và năng lượng của phản ứng.",
  "challenges": [
    {
      "type": "image-selection",
      "narrative": "Trong hóa học, việc nhận biến đổi là rất quan trọng. Hãy chọn hình ảnh mô tả một 'Biến đổi hóa học'!",
      "images": [
        "/assets/images/lab-equipment/rusting-nail.png",
        "/assets/images/lab-equipment/melting-ice.png",
        "/assets/images/lab-equipment/dissolving-sugar.png",
        "/assets/images/lab-equipment/graduated-cylinder.png"
      ],
      "question": "Dấu hiệu nào sau đây chắc chắn có phản ứng hóa học xảy ra (tạo ra chất mới)?",
      "correctAnswer": 0,
      "targetType": "biến đổi",
      "source": "Quan sát thực tế"
    },
    {
      "type": "multiple-choice",
      "narrative": "Hãy cùng kiểm tra kiến thức về các điều kiện để phản ứng xảy ra nhé.",
      "options": [
        "Các chất tham gia tiếp xúc với nhau",
        "Chỉ cần đặt các chất cạnh nhau",
        "Phải dùng bình tam giác",
        "Chỉ cần có nước"
      ],
      "correctAnswer": 0,
      "question": "Điều kiện tiên quyết để một phản ứng hóa học có thể xảy ra là gì?",
      "source": "Lý thuyết phản ứng"
    },
    {
      "type": "matching",
      "narrative": "Bạn có nhớ cách gọi tên các thành phần trong phương trình hóa học không?",
      "leftItems": [
        { "id": "r1", "label": "Chất tham gia" },
        { "id": "r2", "label": "Chất sản phẩm" },
        { "id": "r3", "label": "Dấu mũi tên (→)" }
      ],
      "items": [
        { "id": "r3", "label": "Chiều của phản ứng" },
        { "id": "r1", "label": "Chất ban đầu trước phản ứng" },
        { "id": "r2", "label": "Chất tạo thành sau phản ứng" }
      ],
      "correctOrder": ["r1", "r2", "r3"],
      "question": "Hãy nối các khái niệm ở Cột A với định nghĩa ở Cột B.",
      "source": "Phương trình hóa học"
    },
    {
      "type": "fill-in-the-blank",
      "narrative": "Khi nến cháy, một loại khí được sinh ra làm vẩn đục nước vôi trong. Đó là khí gì?",
      "placeholder": "Nhập tên loại khí (ví dụ: Oxy)...",
      "correctAnswer": "Carbon dioxid",
      "question": "Khí này là sản phẩm của phản ứng cháy giữa nến và Oxy.",
      "source": "Thí nghiệm đốt nến"
    },
    {
      "type": "drag-drop",
      "narrative": "Hãy sắp xếp các giai đoạn của một phản ứng hóa học theo đúng trình tự.",
      "items": [
        { "id": "s1", "label": "Các chất tham gia va chạm" },
        { "id": "s2", "label": "Liên kết cũ bị phá vỡ" },
        { "id": "s3", "label": "Liên kết mới hình thành" }
      ],
      "correctOrder": ["s1", "s2", "s3"],
      "question": "Diễn biến của một phản ứng hóa học diễn ra như thế nào?",
      "source": "Bản chất phản ứng"
    }
  ],
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Biến đổi vật lý và biến đổi hóa học",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Trong đời sống hàng ngày, các chất luôn vận động và biến đổi. Có hai loại biến đổi chính mà chúng ta cần phân biệt rõ:"
      }
    },
    {
      "id": "mod3",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Biến đổi vật lý**: Là hiện tượng chất có thể thay đổi về trạng thái (rắn, lỏng, khí), kích thước hoặc hình dạng, nhưng **bản chất của chất đó vẫn được giữ nguyên**. Ví dụ: Nước đá tan chảy thành nước lỏng, hòa tan muối ăn vào nước thành dung dịch muối.",
          "**Biến đổi hóa học**: Là hiện tượng chất biến đổi có **tạo ra chất mới**. Ví dụ: Đốt cháy than tạo ra khí $CO_2$, sắt bị gỉ sét tạo thành oxit sắt ($Fe_2O_3$)."
        ]
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Phản ứng hóa học và diễn biến",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "infoBox",
      "content": {
        "title": "Khái niệm và Bản chất",
        "content": "- **Định nghĩa**: Phản ứng hóa học là quá trình biến đổi từ chất này thành chất khác. Chất ban đầu bị biến đổi gọi là **chất phản ứng** (hay chất tham gia), chất mới sinh ra gọi là **sản phẩm**.\n- **Bản chất**: Trong phản ứng hóa học, chỉ có liên kết giữa các nguyên tử thay đổi, làm cho phân tử này biến đổi thành phân tử khác. Kết quả là chất này biến đổi thành chất khác. **Số lượng nguyên tử mỗi loại luôn được bảo toàn**.",
        "color": "blue"
      }
    },
    {
      "id": "mod6",
      "type": "heading",
      "content": {
        "text": "3. Dấu hiệu nhận biết phản ứng hóa học",
        "level": "h2"
      }
    },
    {
      "id": "mod7",
      "type": "paragraph",
      "content": {
        "text": "Chúng ta có thể quan sát thấy phản ứng hóa học xảy ra thông qua một số dấu hiệu trực quan sau:"
      }
    },
    {
      "id": "mod8",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Sự thay đổi màu sắc**: Ví dụ, nhúng đinh sắt vào dung dịch đồng sunfat, đinh sắt sẽ chuyển sang màu đỏ gạch.",
          "**Sự tạo thành chất khí**: Xuất hiện hiện tượng sủi bọt khí trong dung dịch.",
          "**Sự xuất hiện chất kết tủa**: Tạo ra chất rắn không tan làm đục dung dịch.",
          "**Sự tỏa nhiệt hoặc phát sáng**: Ví dụ như khi đốt cháy cồn hoặc nến."
        ]
      }
    },
    {
      "id": "mod9",
      "type": "infoBox",
      "content": {
        "title": "Năng lượng trong phản ứng hóa học",
        "content": "- **Phản ứng tỏa nhiệt**: Giải phóng năng lượng (thường là nhiệt) ra môi trường xung quanh (Vd: Phản ứng cháy).\n- **Phản ứng thu nhiệt**: Hấp thụ năng lượng từ môi trường để phản ứng có thể xảy ra (Vd: Phản ứng phân hủy đá vôi cần cung cấp nhiệt độ cao).",
        "color": "orange"
      }
    }
  ],
  "quizzes": [],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: Phản ứng hóa học",
      "url": "https://www.youtube.com/watch?v=wYgS37jBV8k",
      "thumbnail": "https://img.youtube.com/vi/wYgS37jBV8k/0.jpg",
      "description": "Khái niệm, diễn biến và các dấu hiệu nhận biết phản ứng hóa học xảy ra (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Dấu hiệu nào sau đây CHỨNG TỎ có phản ứng hóa học xảy ra?",
        "options": [
          "Nước sôi và bốc hơi",
          "Cây nến chảy lỏng ra",
          "Xuất hiện chất mới có màu sắc khác lạ hoặc kết tủa",
          "Hòa tan đường vào nước"
        ],
        "correctAnswer": 2,
        "explanation": "Sự tạo thành chất mới là bản chất của phản ứng hóa học.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Phản ứng tỏa nhiệt là phản ứng:",
        "options": [
          "Giải phóng năng lượng dưới dạng nhiệt ra môi trường",
          "Hấp thụ nhiệt từ môi trường làm xung quanh lạnh đi",
          "Không làm thay đổi nhiệt độ",
          "Cần phải đun nóng liên tục mới xảy ra"
        ],
        "correctAnswer": 0,
        "explanation": "Tỏa nhiệt là 'nhả' nhiệt ra ngoài.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Trong phản ứng hóa học, hạt nào sau đây được bảo toàn (không thay đổi)?",
        "options": [
          "Phân tử",
          "Nguyên tử",
          "Liên kết hóa học",
          "Cả a và b"
        ],
        "correctAnswer": 1,
        "explanation": "Trong phản ứng, chỉ có liên kết thay đổi, các nguyên tử được giữ nguyên số lượng và loại.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Phản ứng thu nhiệt là phản ứng:",
        "options": [
          "Làm môi trường nóng lên",
          "Làm môi trường lạnh đi do hấp thụ nhiệt",
          "Tự phát sáng",
          "Không cần năng lượng"
        ],
        "correctAnswer": 1,
        "explanation": "Thu nhiệt lấy năng lượng từ môi trường, ví dụ như hòa tan ure vào nước.",
        "points": 10
      }
    ],
    "intermediate": [],
    "advanced": []
  },
  "realWorldApplications": []
};
