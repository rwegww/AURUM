export const craftingTasks = [
  {
    id: "task_video_1",
    title: "Xem video bài giảng mới",
    description: "Xem hết 1 video bài giảng của một bài học bất kỳ để tích lũy kiến thức nền tảng.",
    difficulty: "easy",
    actionType: "watch_video",
    target: 1,
    rewards: [
      { ingredientId: "ing_h", amount: 3 },
      { ingredientId: "ing_o", amount: 1 },
      { ingredientId: "ing_he", amount: 2 },
      { ingredientId: "ing_ne", amount: 1 },
      { ingredientId: "ing_ar", amount: 1 }
    ]
  },
  {
    id: "task_library_1",
    title: "Nghiên cứu tài liệu (Cấp 1)",
    description: "Đọc và tương tác với 1 tài liệu bất kỳ trong thư viện học liệu.",
    difficulty: "easy",
    actionType: "interact_library",
    target: 1,
    rewards: [
      { ingredientId: "ing_na", amount: 2 },
      { ingredientId: "ing_cl", amount: 2 },
      { ingredientId: "ing_f", amount: 1 },
      { ingredientId: "ing_br", amount: 1 }
    ]
  },
  {
    id: "task_library_2",
    title: "Nghiên cứu tài liệu (Cấp 2)",
    description: "Đọc và tương tác với 2 tài liệu khác nhau trong thư viện học liệu.",
    difficulty: "medium",
    actionType: "interact_library",
    target: 2,
    rewards: [
      { ingredientId: "ing_fe", amount: 3 },
      { ingredientId: "ing_o", amount: 3 },
      { ingredientId: "ing_si", amount: 2 },
      { ingredientId: "ing_i", amount: 1 }
    ]
  },
  {
    id: "task_library_3",
    title: "Nghiên cứu tài liệu (Cấp 3)",
    description: "Đọc và tương tác với 3 tài liệu khác nhau trong thư viện học liệu.",
    difficulty: "hard",
    actionType: "interact_library",
    target: 3,
    rewards: [
      { ingredientId: "ing_ca", amount: 3 },
      { ingredientId: "ing_c", amount: 2 },
      { ingredientId: "ing_be", amount: 1 },
      { ingredientId: "ing_ba", amount: 1 }
    ]
  },
  {
    id: "task_lesson_1",
    title: "Chinh phục bài học mới",
    description: "Hoàn thành toàn bộ các đoạn/cấp độ của 1 bài học mới.",
    difficulty: "hard",
    actionType: "complete_lesson",
    target: 1,
    rewards: [
      { ingredientId: "ing_n", amount: 3 },
      { ingredientId: "ing_s", amount: 3 },
      { ingredientId: "ing_ca", amount: 2 },
      { ingredientId: "ing_ag", amount: 2 },
      { ingredientId: "ing_au", amount: 1 }
    ]
  }
];
