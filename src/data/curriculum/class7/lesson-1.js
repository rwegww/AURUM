export const bai1 = {
  id: "hoa7_kntt_bai1",
  classId: 7,
  lessonId: 1,
  programId: "ketnoi",
  curriculumType: "ketnoi",
  title: "Bài 1: Phương pháp và kĩ năng học tập môn Khoa học tự nhiên",
  chapter: "Chương mở đầu",
  order: 1,
  isPremium: false,
  description: "Tìm hiểu các phương pháp học tập và kĩ năng nghiên cứu khoa học tự nhiên: quan sát, đặt câu hỏi, dự đoán, thí nghiệm và rút ra kết luận.",
  challenges: [
    {
      type: "multiple-choice",
      narrative: "Chào mừng bạn đến với KHTN lớp 7! Hãy tìm hiểu phương pháp học tập khoa học nhé.",
      options: [
        "Quan sát → Đặt câu hỏi → Dự đoán → Thí nghiệm → Kết luận",
        "Kết luận → Thí nghiệm → Dự đoán → Quan sát → Đặt câu hỏi",
        "Dự đoán → Quan sát → Kết luận → Thí nghiệm → Đặt câu hỏi",
        "Đặt câu hỏi → Kết luận → Dự đoán → Thí nghiệm → Quan sát"
      ],
      correctAnswer: 0,
      question: "Trình tự đúng của phương pháp tìm hiểu tự nhiên là gì?",
      source: "SGK KHTN 7 - KNTT"
    }
  ],
  theoryModules: [
    {
      id: "mod1",
      type: "heading",
      content: {
        text: "1. Phương pháp tìm hiểu tự nhiên",
        level: "h2"
      }
    },
    {
      id: "mod2",
      type: "paragraph",
      content: {
        text: "Phương pháp tìm hiểu tự nhiên là một chuỗi các hoạt động có hệ thống nhằm khám phá, tìm hiểu thế giới tự nhiên xung quanh ta. Gồm các bước: 1. Quan sát và đặt câu hỏi nghiên cứu; 2. Biện pháp kiểm chứng; 3. Thiết kế và thực hiện thí nghiệm; 4. Phân tích kết quả; 5. Kết luận."
      }
    }
  ],
  game: {
    basic: [
      {
        question: "Đâu là bước đầu tiên trong phương pháp tìm hiểu tự nhiên?",
        options: ["Quan sát và đặt câu hỏi", "Thực hiện thí nghiệm", "Phân tích kết quả", "Rút ra kết luận"],
        answer: 0
      }
    ]
  },
  videoModules: [
    {
      id: "vid1",
      title: "Phương pháp và kĩ năng học tập môn KHTN 7",
      url: "https://www.youtube.com/embed/2D5iJ3hN5_A"
    }
  ]
};