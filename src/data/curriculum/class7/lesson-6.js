export const bai6 = {
  id: "hoa7_kntt_bai6",
  classId: 7,
  lessonId: 6,
  programId: "ketnoi",
  curriculumType: "ketnoi",
  title: "Bài 6: Giới thiệu về liên kết hóa học",
  chapter: "Chương 3: Phân tử - Liên kết hóa học",
  order: 6,
  isPremium: false,
  description: "Khái quát về xu hướng đạt cấu hình electron bền vững của khí hiếm, liên kết ion và liên kết cộng hóa trị.",
  challenges: [
    {
      type: "multiple-choice",
      narrative: "Hãy tìm hiểu vì sao các nguyên tử lại liên kết với nhau.",
      options: [
        "Để đạt cấu hình electron bền vững giống khí hiếm",
        "Để tăng khối lượng nguyên tử",
        "Để giảm số lượng proton",
        "Để tạo ra nhiều hạt neutron hơn"
      ],
      correctAnswer: 0,
      question: "Xu hướng chung của các nguyên tử khi liên kết hóa học là gì?",
      source: "SGK KHTN 7 - KNTT"
    }
  ],
  theoryModules: [
    {
      id: "mod1",
      type: "heading",
      content: {
        text: "1. Xu hướng đạt cấu hình electron bền vững",
        level: "h2"
      }
    },
    {
      id: "mod2",
      type: "paragraph",
      content: {
        text: "Các nguyên tử khí hiếm hoạt động hóa học rất yếu và rất bền vững vì vỏ nguyên tử của chúng có 8 electron ở lớp ngoài cùng (riêng Helium có 2 electron). Nguyên tử các nguyên tố khác có xu hướng nhường, nhận hoặc dùng chung electron để đạt lớp vỏ bền vững tương tự khí hiếm."
      }
    },
    {
      id: "mod3",
      type: "heading",
      content: {
        text: "2. Liên kết ion và Liên kết cộng hóa trị",
        level: "h2"
      }
    },
    {
      id: "mod4",
      type: "paragraph",
      content: {
        text: "Liên kết ion là liên kết được hình thành bởi lực hút tĩnh điện giữa các ion mang điện tích trái dấu (thường giữa kim loại và phi kim). Liên kết cộng hóa trị là liên kết được hình thành giữa hai nguyên tử bằng một hoặc nhiều cặp electron dùng chung (thường giữa các phi kim)."
      }
    }
  ],
  game: {
    basic: [
      {
        question: "Liên kết trong phân tử nước (H2O) là loại liên kết nào?",
        options: ["Liên kết ion", "Liên kết cộng hóa trị", "Liên kết kim loại", "Không có liên kết"],
        answer: 1
      }
    ]
  },
  videoModules: [
    {
      id: "vid1",
      title: "Liên kết hóa học - KHTN 7",
      url: "https://www.youtube.com/embed/5Hwz1_d8vR4"
    }
  ]
};