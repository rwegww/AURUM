export const bai2 = {
  id: "hoa7_kntt_bai2",
  classId: 7,
  lessonId: 2,
  programId: "ketnoi",
  curriculumType: "ketnoi",
  title: "Bài 2: Nguyên tử",
  chapter: "Chương 2: Nguyên tử - Nguyên tố hóa học",
  order: 2,
  isPremium: false,
  description: "Tìm hiểu về cấu tạo nguyên tử bao gồm hạt nhân (proton, neutron) và lớp vỏ electron.",
  challenges: [
    {
      type: "multiple-choice",
      narrative: "Hãy tìm hiểu về thành phần mang điện của nguyên tử.",
      options: [
        "Proton và neutron",
        "Proton và electron",
        "Neutron và electron",
        "Proton, neutron và electron"
      ],
      correctAnswer: 1,
      question: "Các hạt mang điện trong nguyên tử gồm những loại nào?",
      source: "SGK KHTN 7 - KNTT"
    }
  ],
  theoryModules: [
    {
      id: "mod1",
      type: "heading",
      content: {
        text: "1. Khái niệm nguyên tử",
        level: "h2"
      }
    },
    {
      id: "mod2",
      type: "paragraph",
      content: {
        text: "Nguyên tử là hạt vô cùng nhỏ bé và trung hòa về điện. Nguyên tử gồm hạt nhân mang điện tích dương và vỏ nguyên tử chứa các electron mang điện tích âm."
      }
    },
    {
      id: "mod3",
      type: "heading",
      content: {
        text: "2. Cấu tạo hạt nhân nguyên tử",
        level: "h2"
      }
    },
    {
      id: "mod4",
      type: "paragraph",
      content: {
        text: "Hạt nhân nằm ở tâm nguyên tử, gồm các hạt proton (kí hiệu p, mang điện tích dương) và neutron (kí hiệu n, không mang điện)."
      }
    }
  ],
  game: {
    basic: [
      {
        question: "Hạt electron mang điện tích gì?",
        options: ["Dương", "Âm", "Không mang điện", "Trung hòa"],
        answer: 1
      }
    ]
  },
  videoModules: [
    {
      id: "vid1",
      title: "Cấu tạo nguyên tử - KHTN lớp 7",
      url: "https://www.youtube.com/embed/Pj1Gj5Hk_y0"
    }
  ]
};