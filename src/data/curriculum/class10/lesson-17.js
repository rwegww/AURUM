export const bai17 = {
  "id": "hoa10_kntt_bai17",
  "classId": 10,
  "lessonId": 17,
  "programId": "ketnoi",
  "curriculumType": "ketnoi",
  "title": "Bài 17: Biến thiên enthalpy trong các phản ứng hóa học",
  "chapter": "Chương 5: Năng lượng hóa học",
  "order": 17,
  "isPremium": false,
  "description": "Khái niệm enthalpy, phản ứng tỏa nhiệt and thu nhiệt.",
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Biến thiên Enthalpy của phản ứng ($\\Delta_rH$)",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Trong hóa học, Enthalpy ($H$) là đại lượng đặc trưng cho nội năng của hệ cộng với tích của áp suất and thể tích. Tuy nhiên, ta không thể đo giá trị tuyệt đối của enthalpy mà chỉ đo được sự thay đổi của nó trong quá trình phản ứng, gọi là **Biến thiên Enthalpy ($\\Delta_rH$)**.\\n\\nDựa vào dấu của $\\Delta_rH$, phản ứng được chia làm hai loại:\\n- **Phản ứng tỏa nhiệt ($\\Delta_rH < 0$)**: Hệ giải phóng năng lượng dưới dạng nhiệt ra môi trường xung quanh (Ví dụ: phản ứng cháy, phản ứng trung hòa). Tống năng lượng của sản phẩm thấp hơn chất tham gia.\\n- **Phản ứng thu nhiệt ($\\Delta_rH > 0$)**: Hệ hấp thụ nhiệt từ môi trường để xảy ra phản ứng (Ví dụ: nhiệt phân đá vôi, phản ứng quang hợp). Tổng năng lượng của sản phẩm cao hơn chất tham gia."
      }
    },
    {
      "id": "mod3",
      "type": "heading",
      "content": {
        "text": "2. Enthalpy tạo thành chuẩn ($\\Delta_fH_{298}^o$)",
        "level": "h2"
      }
    },
    {
      "id": "mod4",
      "type": "infoBox",
      "content": {
        "title": "Khái niệm and quy ước chuẩn",
        "content": "**Enthalpy tạo thành chuẩn** là biến thiên enthalpy của phản ứng tạo thành 1 mol hợp chất từ các đơn chất bền vững nhất ở điều kiện chuẩn ($25^\\circ C$ hay $298 K$, áp suất $1 bar$).\\n\\n- **Quy ước**: Enthalpy tạo thành chuẩn của các đơn chất bền vững nhất (như $O_2(g), H_2(g), Fe(s)$) bằng 0.",
        "color": "blue"
      }
    },
    {
      "id": "mod5",
      "type": "heading",
      "content": {
        "text": "3. Tính biến thiên enthalpy chuẩn của phản ứng",
        "level": "h2"
      }
    },
    {
      "id": "mod6",
      "type": "warningBox",
      "content": {
        "title": "Công thức tính từ Enthalpy tạo thành",
        "content": "Biến thiên enthalpy chuẩn của phản ứng được tính bằng tổng enthalpy tạo thành chuẩn của các sản phẩm trừ đi tổng enthalpy tạo thành chuẩn của các chất đầu (có nhân với hệ số tỉ lượng):\\n$$\\Delta_rH_{298}^o = \\sum \\Delta_fH_{298}^o (SP) - \\sum \\Delta_fH_{298}^o (CD)$$ ",
        "color": "orange"
      }
    }
  ],
  "quizzes": [],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: Biến thiên enthalpy trong các phản ứng hóa học",
      "url": "https://www.youtube.com/watch?v=PLltqnGR34E",
      "thumbnail": "https://img.youtube.com/vi/PLltqnGR34E/0.jpg",
      "description": "Phản ứng thu nhiệt, tỏa nhiệt and cách tính biến thiên enthalpy chuẩn (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Biến thiên enthalpy ($ \\Delta_r H^o_{298} < 0 $) đặc trưng cho phản ứng:",
        "options": [
          "Phản ứng thu nhiệt",
          "Phản ứng tỏa nhiệt",
          "Phản ứng không nhiệt",
          "Sự bay hơi"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Điều kiện chuẩn đo nhiệt lượng thường là:",
        "options": [
          "0 độ C, 1 atm",
          "25 độ C (298 K), 1 bar",
          "100 độ C, 1 bar",
          "Nhiệt độ phòng bất kỳ"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Khi $ \\Delta_r H^o  > 0 $, phản ứng có xu hướng:",
        "options": [
          "Tỏa nhiệt",
          "Thu nhiệt từ môi trường",
          "Tự phát sáng",
          "Làm bình nóng lên"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Nhiệt phản ứng được ký hiệu là:",
        "options": [
          "$\\Delta H$",
          "$Q$",
          "$C$",
          "$P$"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Đơn vị thường dùng của biến thiên enthalpy là:",
        "options": [
          "kJ/mol",
          "gam",
          "lít",
          "Kenvin"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ],
    "intermediate": [],
    "advanced": []
  },
  "realWorldApplications": []
};
