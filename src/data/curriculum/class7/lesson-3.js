export const bai3 = {
  id: "hoa7_kntt_bai3",
  classId: 7,
  lessonId: 3,
  programId: "ketnoi",
  curriculumType: "ketnoi",
  title: "Bài 3: Nguyên tố hóa học",
  chapter: "Chương 2: Nguyên tử - Nguyên tố hóa học",
  order: 3,
  isPremium: false,
  description: "Khái niệm về nguyên tố hóa học, số proton đặc trưng của mỗi nguyên tố và kí hiệu hóa học quốc tế.",
  challenges: [
    {
      type: "multiple-choice",
      narrative: "Hãy định nghĩa thế nào là nguyên tố hóa học.",
      options: [
        "Các nguyên tử có cùng số neutron",
        "Các nguyên tử có cùng số proton",
        "Các nguyên tử có cùng số electron",
        "Các nguyên tử có cùng khối lượng"
      ],
      correctAnswer: 1,
      question: "Nguyên tố hóa học là tập hợp những nguyên tử cùng loại có cùng đặc điểm nào?",
      source: "SGK KHTN 7 - KNTT"
    }
  ],
  theoryModules: [
    {
      id: "mod1",
      type: "heading",
      content: {
        text: "1. Khái niệm nguyên tố hóa học",
        level: "h2"
      }
    },
    {
      id: "mod2",
      type: "paragraph",
      content: {
        text: "Nguyên tố hóa học là tập hợp những nguyên tử có cùng số proton trong hạt nhân. Số proton là số đặc trưng của một nguyên tố hóa học."
      }
    },
    {
      id: "mod3",
      type: "heading",
      content: {
        text: "2. Kí hiệu hóa học",
        level: "h2"
      }
    },
    {
      id: "mod4",
      type: "paragraph",
      content: {
        text: "Mỗi nguyên tố hóa học được biểu diễn bằng một kí hiệu riêng, gọi là kí hiệu hóa học. IUPAC quy định kí hiệu hóa học gồm một hoặc hai chữ cái, chữ cái đầu tiên viết hoa, chữ cái thứ hai (nếu có) viết thường. Ví dụ: Hydrogen kí hiệu là H, Carbon là C, Sodium là Na."
      }
    }
  ],
  game: {
    basic: [
      {
        question: "Kí hiệu hóa học của nguyên tố Iron (Sắt) là gì?",
        options: ["Fe", "fe", "FE", "F"],
        answer: 0
      }
    ]
  },
  videoModules: [
    {
      id: "vid1",
      title: "Nguyên tố hóa học - KHTN lớp 7",
      url: "https://www.youtube.com/embed/S2q8N5xH86k"
    }
  ]
};