export const bai3 = {
  "id": "hoa10_kntt_bai3",
  "classId": 10,
  "lessonId": 3,
  "programId": "ketnoi",
  "curriculumType": "ketnoi",
  "title": "Bài 3: Cấu trúc lớp vỏ electron nguyên tử",
  "chapter": "Chương 1: Cấu tạo nguyên tử",
  "order": 3,
  "isPremium": false,
  "description": "Sự phân bố electron theo lớp, phân lớp and nguyên tắc viết cấu hình electron.",
  "theoryModules": [
    {
      "id": "mod1",
      "type": "heading",
      "content": {
        "text": "1. Lớp and phân lớp electron",
        "level": "h2"
      }
    },
    {
      "id": "mod2",
      "type": "paragraph",
      "content": {
        "text": "Trong lớp vỏ nguyên tử, các electron được phân bố vào các mức năng lượng khác nhau gọi là các **lớp electron** (kí hiệu n = 1, 2, 3... tương ứng với tên lớp K, L, M, N...). Lớp càng xa hạt nhân thì mức năng lượng càng cao.\n\nMỗi lớp electron lại được chia thành các **phân lớp** (kí hiệu là $s, p, d, f$). Số lượng phân lớp trong một lớp đúng bằng số thứ tự của lớp đó (ví dụ lớp n=3 có 3 phân lớp là $3s, 3p, 3d$)."
      }
    },
    {
      "id": "mod3",
      "type": "infoBox",
      "content": {
        "title": "Sức chứa electron tối đa",
        "content": "- Mỗi phân lớp có số electron tối đa xác định: $s^2, p^6, d^{10}, f^{14}$.\n- Số electron tối đa trong lớp thứ $n$ là **$2n^2$**. Chẳng hạn lớp M (n=3) có tối đa 18 electron.\n- Các electron trên cùng một phân lớp có mức năng lượng bằng nhau.",
        "color": "blue"
      }
    },
    {
      "id": "mod4",
      "type": "heading",
      "content": {
        "text": "2. Cấu hình electron nguyên tử",
        "level": "h2"
      }
    },
    {
      "id": "mod5",
      "type": "paragraph",
      "content": {
        "text": "**Cấu hình electron** biểu diễn sự phân bố electron trên các phân lớp thuộc các lớp khác nhau. Việc viết cấu hình tuân theo các quy tắc khắt khe:\n1. **Nguyên lý vững bền**: Electron chiếm các mức năng lượng từ thấp đến cao (1s < 2s < 2p < 3s < 3p < 4s < 3d < 4p...).\n2. **Nguyên lý Pauli**: Mỗi orbital chứa tối đa 2 electron ngược chiều nhau.\n3. **Quy tắc Hund**: Electron phân bố sao cho số electron độc thân là tối đa."
      }
    },
    {
      "id": "mod6",
      "type": "warningBox",
      "content": {
        "title": "Lưu ý về trật tự phân mức năng lượng",
        "content": "Phân lớp $4s$ có mức năng lượng thấp hơn $3d$, nên electron sẽ điền đầy $4s^2$ trước khi điền vào $3d$. Tuy nhiên, khi viết cấu hình electron sau cùng, ta phải sắp xếp lại theo từng lớp: $...3s^2 3p^6 3d^{n} 4s^m$.",
        "color": "orange"
      }
    },
    {
      "id": "mod7",
      "type": "heading",
      "content": {
        "text": "3. Ý nghĩa của Lớp electron ngoài cùng",
        "level": "h2"
      }
    },
    {
      "id": "mod8",
      "type": "paragraph",
      "content": {
        "text": "Số electron lớp ngoài cùng (valence electrons) quyết định tính chất hóa học cơ bản của nguyên tố:\n- **1, 2, 3 electron**: Nguyên tố Kim loại (trừ H, He, B).\n- **5, 6, 7 electron**: Nguyên tố Phi kim.\n- **8 electron**: Nguyên tố Khí hiếm (trừ He có 2e), cực kỳ bền vững về mặt hóa học.\n- **4 electron**: Có thể là kim loại hoặc phi kim. \n\nĐây là cơ sở để giải thích sự hình thành liên kết hóa học trong các phản ứng."
      }
    }
  ],
  "quizzes": [],
  "videoModules": [
    {
      "id": "v1",
      "title": "Bài giảng: Cấu trúc lớp vỏ electron nguyên tử",
      "url": "https://www.youtube.com/watch?v=6zZqqyuwrOU",
      "thumbnail": "https://img.youtube.com/vi/6zZqqyuwrOU/0.jpg",
      "description": "Sự phân bố electron vào các lớp, phân lớp and cách viết cấu hình electron (VietJack)."
    }
  ],
  "practiceModules": [],
  "vocabulary": [],
  "interactiveLabs": [],
  "game": {
    "basic": [
      {
        "type": "multiple-choice",
        "question": "Lớp electron thứ 2 (lớp L) có tối đa bao nhiêu electron?",
        "options": [
          "2",
          "8",
          "18",
          "32"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Sự phân bố electron vào các phân lớp tuân theo nguyên lý:",
        "options": [
          "Nguyên lý vững bền",
          "Quy tắc hund",
          "Nguyên lý pauli",
          "Tất cả các ý trên"
        ],
        "correctAnswer": 3,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Cấu hình electron của nguyên tử Natri ($Z=11$) là:",
        "options": [
          "$1s^2 2s^2 2p^6 3s^1$",
          "$1s^2 2s^2 2p^6 3s^2$",
          "$1s^2 2s^2 2p^5 3s^2$",
          "$1s^2 2s^2 2p^7$"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Nguyên tử có 7 electron ở lớp ngoài cùng thuộc loại nguyên tố nào?",
        "options": [
          "Kim loại",
          "Phi kim",
          "Khí hiếm",
          "Á kim"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "type": "multiple-choice",
        "question": "Lớp electron ngoài cùng quyết định yếu tố nào của nguyên tử?",
        "options": [
          "Tính chất hóa học",
          "Khối lượng",
          "Số hiệu nguyên tử",
          "Số neutron"
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
