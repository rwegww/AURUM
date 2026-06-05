export const bai5 = {
  id: "hoa7_kntt_bai5",
  classId: 7,
  lessonId: 5,
  programId: "ketnoi",
  curriculumType: "ketnoi",
  title: "Bài 5: Phân tử - Đơn chất - Hợp chất",
  chapter: "Chương 3: Phân tử - Liên kết hóa học",
  order: 5,
  isPremium: false,
  description: "Phân biệt đơn chất, hợp chất và tìm hiểu khái niệm phân tử, khối lượng phân tử.",
  challenges: [
    {
      type: "multiple-choice",
      narrative: "Hãy phân biệt chất được tạo thành từ một nguyên tố và nhiều nguyên tố.",
      options: [
        "Đơn chất được tạo nên từ một nguyên tố hóa học, hợp chất tạo nên từ hai nguyên tố trở lên",
        "Hợp chất được tạo nên từ một nguyên tố hóa học, đơn chất tạo nên từ hai nguyên tố trở lên",
        "Đơn chất và hợp chất đều tạo từ một nguyên tố",
        "Đơn chất và hợp chất đều tạo từ nhiều nguyên tố"
      ],
      correctAnswer: 0,
      question: "Đơn chất và hợp chất khác nhau cơ bản ở điểm nào?",
      source: "SGK KHTN 7 - KNTT"
    }
  ],
  theoryModules: [
    {
      id: "mod1",
      type: "heading",
      content: {
        text: "1. Đơn chất và hợp chất",
        level: "h2"
      }
    },
    {
      id: "mod2",
      type: "paragraph",
      content: {
        text: "Đơn chất là những chất được tạo nên từ một nguyên tố hóa học. Ví dụ: khí oxygen (O2), kim loại copper (Cu). Hợp chất là những chất được tạo nên từ hai hoặc nhiều nguyên tố hóa học. Ví dụ: nước (H2O), muối ăn (NaCl)."
      }
    },
    {
      id: "mod3",
      type: "heading",
      content: {
        text: "2. Phân tử",
        level: "h2"
      }
    },
    {
      id: "mod4",
      type: "paragraph",
      content: {
        text: "Phân tử là hạt đại diện cho chất, gồm một số nguyên tử liên kết với nhau và thể hiện đầy đủ tính chất hóa học của chất. Khối lượng phân tử bằng tổng khối lượng các nguyên tử trong phân tử chất đó."
      }
    }
  ],
  game: {
    basic: [
      {
        question: "Chất nào sau đây là đơn chất?",
        options: ["Nước (H2O)", "Khí Oxygen (O2)", "Khí Carbon dioxide (CO2)", "Muối ăn (NaCl)"],
        answer: 1
      }
    ]
  },
  videoModules: [
    {
      id: "vid1",
      title: "Đơn chất - Hợp chất - Phân tử - KHTN 7",
      url: "https://www.youtube.com/embed/j4K5q5P3lKk"
    }
  ]
};