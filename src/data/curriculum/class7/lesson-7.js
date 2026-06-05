export const bai7 = {
  id: "hoa7_kntt_bai7",
  classId: 7,
  lessonId: 7,
  programId: "ketnoi",
  curriculumType: "ketnoi",
  title: "Bài 7: Hóa trị và công thức hóa học",
  chapter: "Chương 3: Phân tử - Liên kết hóa học",
  order: 7,
  isPremium: false,
  description: "Cách xác định hóa trị, quy tắc hóa trị và cách lập công thức hóa học của các hợp chất đơn giản.",
  challenges: [
    {
      type: "multiple-choice",
      narrative: "Hãy áp dụng quy tắc hóa trị cho công thức AxBy của các nguyên tố có hóa trị tương ứng là a và b.",
      options: [
        "x . a = y . b",
        "x . y = a . b",
        "x . b = y . a",
        "x + a = y + b"
      ],
      correctAnswer: 0,
      question: "Quy tắc hóa trị đối với hợp chất hai nguyên tố AxBy được biểu diễn như thế nào?",
      source: "SGK KHTN 7 - KNTT"
    }
  ],
  theoryModules: [
    {
      id: "mod1",
      type: "heading",
      content: {
        text: "1. Hóa trị",
        level: "h2"
      }
    },
    {
      id: "mod2",
      type: "paragraph",
      content: {
        text: "Hóa trị là con số biểu thị khả năng liên kết của nguyên tử nguyên tố này với nguyên tử nguyên tố khác. Hóa trị của Hydrogen luôn được chọn làm đơn vị (I) và hóa trị của Oxygen thường là (II)."
      }
    },
    {
      id: "mod3",
      type: "heading",
      content: {
        text: "2. Công thức hóa học và Quy tắc hóa trị",
        level: "h2"
      }
    },
    {
      id: "mod4",
      type: "paragraph",
      content: {
        text: "Công thức hóa học dùng để biểu diễn chất, gồm một hoặc nhiều kí hiệu hóa học kèm theo chỉ số dưới chân. Quy tắc hóa trị: Trong công thức hóa học của hợp chất hai nguyên tố AxBy, tích chỉ số và hóa trị của nguyên tố này bằng tích chỉ số và hóa trị của nguyên tố kia: x * a = y * b."
      }
    }
  ],
  game: {
    basic: [
      {
        question: "Trong hợp chất CO2, carbon có hóa trị là bao nhiêu (biết Oxygen hóa trị II)?",
        options: ["II", "III", "IV", "V"],
        answer: 2
      }
    ]
  },
  videoModules: [
    {
      id: "vid1",
      title: "Hóa trị và Công thức hóa học - KHTN 7",
      url: "https://www.youtube.com/embed/zHj2aTjN4gM"
    }
  ]
};