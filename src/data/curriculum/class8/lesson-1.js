export const bai1 = {
  "id": "hoa8_kntt_bai1",
  "classId": 8,
  "lessonId": 1,
  "programId": "ketnoi",
  "curriculumType": "ketnoi",
  "title": "Bài 1: Sử dụng một số hóa chất, thiết bị cơ bản trong phòng thí nghiệm",
  "chapter": "Chương mở đầu",
  "order": 1,
  "isPremium": false,
  "description": "Học sinh nhận biết hóa chất, dụng cụ và thiết bị đo cơ bản; thực hành đúng quy tắc an toàn theo định hướng SGK Kết nối tri thức.",
  "challenges": [
    {
      "type": "image-selection",
      "narrative": "Chào mừng bạn đến với phòng thí nghiệm! Hãy tìm 'Bình tam giác' (Erlenmeyer flask) để bắt đầu.",
      "images": [
        "/assets/images/lab-equipment/erlenmeyer-flask.png",
        "/assets/images/lab-equipment/beaker.png",
        "/assets/images/lab-equipment/test-tube.png",
        "/assets/images/lab-equipment/graduated-cylinder.png"
      ],
      "question": "Dụng cụ nào có hình dạng đặc trưng giúp hạn chế rơi vãi hóa chất khi lắc?",
      "correctAnswer": 0,
      "targetType": "dụng cụ",
      "source": "Phòng thí nghiệm ảo"
    },
    {
      "type": "matching",
      "narrative": "Tuyệt vời! Bây giờ hãy giúp tôi kết nối các dụng cụ với đúng công dụng của chúng nhé.",
      "leftItems": [
        { "id": "b1", "label": "Ống đong" },
        { "id": "b2", "label": "Phễu lọc" },
        { "id": "b3", "label": "Đèn cồn" }
      ],
      "items": [
        { "id": "b2", "label": "Tách chất rắn khỏi chất lỏng" },
        { "id": "b3", "label": "Cung cấp nguồn nhiệt" },
        { "id": "b1", "label": "Đo thể tích chất lỏng" }
      ],
      "correctOrder": ["b1", "b2", "b3"],
      "question": "Hãy sắp xếp Cột B sao cho tương ứng với công dụng ở Cột A.",
      "source": "Sách giáo khoa KNTT"
    },
    {
      "type": "multiple-choice",
      "narrative": "An toàn là trên hết! Bạn sẽ làm gì nếu vô tình để hóa chất dính vào tay?",
      "options": [
        "Rửa ngay dưới vòi nước sạch nhiều lần",
        "Dùng khăn khô lau thật mạnh",
        "Đổ thêm một loại hóa chất khác để trung hòa",
        "Thổi mạnh cho khô"
      ],
      "correctAnswer": 0,
      "question": "Hành động sơ cứu đầu tiên và quan trọng nhất khi bị dính hóa chất là gì?",
      "source": "Nội quy an toàn"
    },
    {
      "type": "fill-in-the-blank",
      "narrative": "Gần xong rồi! Hãy điền tên dụng cụ này nhé.",
      "image": "/assets/images/lab-equipment/test-tube.png",
      "placeholder": "Nhập tên dụng cụ...",
      "correctAnswer": "Ống nghiệm",
      "question": "Dụng cụ thủy tinh nhỏ, hình trụ, dùng để thực hiện các phản ứng lượng nhỏ là gì?",
      "source": "Danh mục dụng cụ"
    },
    {
      "type": "drag-drop",
      "narrative": "Thử thách cuối cùng: Sắp xếp quy trình lấy hóa chất lỏng từ chai bằng ống hút nhỏ giọt.",
      "items": [
        { "id": "step1", "label": "Bóp đầu cao su để đẩy không khí ra" },
        { "id": "step2", "label": "Nhúng đầu ống vào chất lỏng" },
        { "id": "step3", "label": "Thả tay từ từ để chất lỏng đi lên" }
      ],
      "correctOrder": ["step1", "step2", "step3"],
      "question": "Hãy sắp xếp thứ tự các bước thao tác đúng.",
      "source": "Kỹ năng thực hành"
    }
  ],
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Một số dụng cụ thí nghiệm thông dụng",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Phòng thí nghiệm hóa học là nơi chứa nhiều loại dụng cụ chuyên dụng, mỗi loại có chức năng riêng biệt giúp học sinh thực hiện các phép đo và phản ứng một cách chính xác. Việc hiểu rõ cấu tạo và cách sử dụng các dụng cụ này là bước đầu tiên để trở thành một nhà khoa học chuyên nghiệp."
      }
    },
    {
      "id": "mod3",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Ống nghiệm (Test tube)**: Dùng để chứa hóa chất lỏng hoặc rắn với lượng nhỏ. Khi đun nóng, cần kẹp ở 1/3 thân ống từ miệng xuống, nghiêng 45° và không hướng miệng ống về phía người khác.",
          "**Ống đong (Graduated Cylinder)**: Dùng để đo thể tích chất lỏng. Cần chọn ống đong có dung tích gần với thể tích cần đo để giảm sai số. Đọc kết quả ở mức ngang tầm mắt tại điểm thấp nhất của bề mặt khum.",
          "**Bình tam giác (Erlenmeyer flask)**: Đáy rộng, cổ hẹp, lý tưởng cho các thí nghiệm cần lắc hoặc khuấy trộn mạnh mà không làm bắn hóa chất.",
          "**Cốc thủy tinh (Beaker)**: Dùng để đựng, pha trộn hoặc đun nóng. Vạch chia độ trên cốc chỉ mang tính chất tham khảo, không dùng để đo thể tích chính xác. Nếu cần đo chính xác, hãy dùng ống đong hoặc pipet thay vì cốc thủy tinh.",
          "**Phễu (Funnel)**: Dùng để rót chất lỏng vào bình có cổ hẹp hoặc kết hợp với giấy lọc để tách chất rắn khỏi chất lỏng.",
          "**Đũa thủy tinh**: Dùng để khuấy hoặc dẫn dòng chất lỏng khi rót."
        ]
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Quy tắc an toàn trong phòng thí nghiệm",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "infoBox",
      "content": {
        "title": "Cấm thử, nếm và ngửi trực tiếp hóa chất",
        "content": "- **Tuyệt đối không nếm**: Nhiều hóa chất có độc tính cực mạnh hoặc tính ăn mòn cao, có thể gây nguy hiểm tính mạng ngay lập tức.\n- **Cách nhận biết mùi an toàn**: Đặt lọ hóa chất cách mũi khoảng 20-30cm, dùng bàn tay phẩy nhẹ không khí từ miệng lọ hướng về phía mũi.\n- **Sử dụng đồ bảo hộ**: Luôn đeo kính bảo hộ, áo blouse và găng tay khi tiếp xúc với hóa chất độc hại.",
        "color": "blue"
      }
    },
    {
      "id": "mod6",
      "type": "warningBox",
      "content": {
        "title": "Quy tắc pha loãng Acid Sunfuric ($H_2SO_4$) đặc",
        "content": "Đây là thao tác cực kỳ nguy hiểm nếu làm sai. Để đảm bảo an toàn, bạn phải tuân thủ tuyệt đối quy tắc: **RÓT TỪ TỪ ACID VÀO NƯỚC** và khuấy nhẹ. **TUYỆT ĐỐI KHÔNG** làm ngược lại (rót nước vào acid đặc) vì nước sẽ sôi đột ngột và làm bắn acid ra ngoài, gây bỏng nghiêm trọng.",
        "color": "orange"
      }
    },
    {
      "id": "mod7",
      "type": "heading",
      "content": {
        "text": "3. Cách sử dụng thiết bị đo cơ bản",
        "level": "h2"
      }
    },
    {
      "id": "mod8",
      "type": "paragraph",
      "content": {
        "text": "Sử dụng đúng thiết bị đo giúp đảm bảo tính chính xác của thực nghiệm:"
      }
    },
    {
      "id": "mod9",
      "type": "list",
      "content": {
        "type": "bullet",
        "items": [
          "**Cân điện tử**: Đặt cân trên bề mặt phẳng, đưa cân về mức 0 (ấn nút Tare/Zero) trước khi đặt vật cần cân. Nên dùng giấy cân hoặc cốc thủy tinh để đựng hóa chất khi cân.",
          "**Nhiệt kế**: Dùng để đo nhiệt độ môi trường phản ứng. Khi đo nhiệt độ chất lỏng, không để bầu nhiệt kế chạm vào đáy hoặc thành cốc đang đun nóng.",
          "**Giấy chỉ thị pH**: Dùng để xác định nhanh tính acid hoặc base của dung dịch qua sự thay đổi màu sắc khi so sánh với bảng màu chuẩn."
        ]
      }
    }
  ],
  "quizzes": [],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: Sử dụng một số hóa chất, thiết bị cơ bản trong phòng thí nghiệm",
      "url": "https://www.youtube.com/watch?v=YUc8QjD2wdk",
      "thumbnail": "https://img.youtube.com/vi/YUc8QjD2wdk/0.jpg",
      "description": "Hướng dẫn an toàn và cách sử dụng các dụng cụ thí nghiệm hóa học cơ bản (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Khi hòa tan axit sunfuric đặc ($H_2SO_4$) vào nước, thao tác nào sau đây là an toàn?",
        "options": [
          "Đổ nhanh nước vào axit đặc",
          "Rót từ từ axit vào nước và khuấy nhẹ",
          "Đổ cả hai cùng lúc vào nhau",
          "Đun nóng axit rồi mới đổ nước vào"
        ],
        "correctAnswer": 1,
        "explanation": "Rót axit vào nước giúp nhiệt tỏa ra được nước hấp thụ, tránh gây bắn axit gây bỏng.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Để đo thể tích chất lỏng một cách chính xác nhất, ta nên dùng dụng cụ nào?",
        "options": [
          "Mỏ cốc (Beaker)",
          "Bình tam giác (Erlenmeyer)",
          "Ống đong có chia vạch (Cylinder)",
          "Ống nghiệm (Test tube)"
        ],
        "correctAnswer": 2,
        "explanation": "Ống đong có chia vạch giúp quan sát thể tích chính xác hơn.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Cách ngửi hóa chất an toàn là:",
        "options": [
          "Kê mũi sát vào miệng lọ và hít thật sâu",
          "Dùng tay phẩy nhẹ hơi hóa chất từ miệng lọ vào mũi",
          "Đun nóng hóa chất để mùi bay lên mạnh hơn",
          "Nhờ bạn khác ngửi trước"
        ],
        "correctAnswer": 1,
        "explanation": "Phẩy tay giúp loãng nồng độ khí hóa chất, tránh gây sốc hoặc ngộ độc trực tiếp.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Nếu chẳng may bị axit dính vào tay, việc đầu tiên cần làm là:",
        "options": [
          "Bôi kem đánh răng",
          "Rửa ngay dưới vòi nước sạch nhiều lần",
          "Dùng khăn khô lau thật mạnh",
          "Đổ dung dịch xút (NaOH) đậm đặc lên để trung hòa"
        ],
        "correctAnswer": 1,
        "explanation": "Rửa nước sạch là cách nhanh nhất để làm loãng và loại bỏ axit khỏi da.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Ký hiệu 'Chất dễ cháy' trên nhãn hóa chất thường có hình gì?",
        "options": [
          "Hình ngọn lửa",
          "Hình đầu lâu xương chéo",
          "Hình dấu x",
          "Hình chiếc quạt"
        ],
        "correctAnswer": 0,
        "explanation": "Hình ngọn lửa cảnh báo hóa chất dễ bắt cháy, cần tránh xa nguồn nhiệt.",
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Dụng cụ dùng để lấy hóa chất dạng bột (rắn) là:",
        "options": [
          "Ống hút nhỏ giọt",
          "Thìa (muỗng) thủy tinh hoặc kim loại",
          "Kẹp gỗ",
          "Đũa thủy tinh"
        ],
        "correctAnswer": 1,
        "explanation": "Thìa giúp lấy lượng nhỏ hóa chất rắn mà không làm bẩn tay.",
        "points": 10
      }
    ],
    "intermediate": [],
    "advanced": []
  },
  "realWorldApplications": []
};
