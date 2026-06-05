export const bai4 = {
  id: "hoa7_kntt_bai4",
  classId: 7,
  lessonId: 4,
  programId: "ketnoi",
  curriculumType: "ketnoi",
  title: "Bài 4: Sơ lược bảng tuần hoàn các nguyên tố hóa học",
  chapter: "Chương 2: Nguyên tử - Nguyên tố hóa học",
  order: 4,
  isPremium: false,
  description: "Nguyên tắc sắp xếp, cấu trúc bảng tuần hoàn bao gồm ô, chu kì, nhóm và các nhóm nguyên tố chính.",
  challenges: [
    {
      type: "multiple-choice",
      narrative: "Hãy tìm hiểu nguyên tắc sắp xếp các nguyên tố hóa học.",
      options: [
        "Sắp xếp theo chiều tăng dần của điện tích hạt nhân",
        "Sắp xếp theo chiều tăng dần của khối lượng nguyên tử",
        "Sắp xếp theo thứ tự bảng chữ cái tên nguyên tố",
        "Sắp xếp ngẫu nhiên"
      ],
      correctAnswer: 0,
      question: "Các nguyên tố trong bảng tuần hoàn được sắp xếp theo nguyên tắc chủ đạo nào?",
      source: "SGK KHTN 7 - KNTT"
    }
  ],
  theoryModules: [
    {
      id: "mod1",
      type: "heading",
      content: {
        text: "1. Nguyên tắc sắp xếp các nguyên tố hóa học",
        level: "h2"
      }
    },
    {
      id: "mod2",
      type: "paragraph",
      content: {
        text: "Các nguyên tố hóa học trong bảng tuần hoàn được sắp xếp theo chiều tăng dần của điện tích hạt nhân nguyên tử. Các nguyên tố có cùng số lớp electron trong nguyên tử được xếp thành một hàng (chu kì). Các nguyên tố có tính chất hóa học tương tự nhau được xếp thành một cột (nhóm)."
      }
    },
    {
      id: "mod3",
      type: "heading",
      content: {
        text: "2. Cấu tạo của bảng tuần hoàn",
        level: "h2"
      }
    },
    {
      id: "mod4",
      type: "paragraph",
      content: {
        text: "Bảng tuần hoàn gồm các ô nguyên tố, chu kì và nhóm. Ô nguyên tố cho biết: số hiệu nguyên tử, kí hiệu hóa học, tên nguyên tố và khối lượng nguyên tử. Chu kì là dãy các nguyên tố mà nguyên tử của chúng có cùng số lớp electron. Nhóm gồm các nguyên tố có tính chất tương tự nhau."
      }
    }
  ],
  game: {
    basic: [
      {
        question: "Bảng tuần hoàn các nguyên tố hóa học hiện nay có bao nhiêu chu kì?",
        options: ["5", "6", "7", "8"],
        answer: 2
      }
    ]
  },
  videoModules: [
    {
      id: "vid1",
      title: "Bảng tuần hoàn các nguyên tố hóa học - KHTN 7",
      url: "https://www.youtube.com/embed/6eE2k7qf_jA"
    }
  ]
};