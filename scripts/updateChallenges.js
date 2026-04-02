import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../api/models/Lesson.js';

dotenv.config();

const challenges = [
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Beaker_selection_01.jpg/800px-Beaker_selection_01.jpg",
    question: "Dụng cụ dùng để chứa và đun nóng dung dịch này tên là gì?",
    options: ["Cốc thủy tinh", "Ống đong", "Bình tam giác", "Ống nghiệm"],
    correctAnswer: 0,
    targetType: "dụng cụ"
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Magnesium_ribbon_burning.jpg/800px-Magnesium_ribbon_burning.jpg",
    question: "Hiện tượng dải Magiê cháy sáng rực rỡ này là dấu hiệu của:",
    options: ["Biến đổi vật lý", "Sự bay hơi", "Phản ứng hóa học", "Sự hòa tan"],
    correctAnswer: 2,
    targetType: "biến đổi"
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Amedeo_Avogadro2.jpg",
    question: "Đây là chân dung nhà bác học đã đề xuất hằng số $6,022 \\times 10^{23}$. Ông là ai?",
    options: ["Lavoisier", "Dalton", "Avogadro", "Mendeleev"],
    correctAnswer: 2,
    targetType: "nhà bác học"
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Copper%28II%29_sulfate_solution.jpg/800px-Copper%28II%29_sulfate_solution.jpg",
    question: "Chất lỏng màu xanh lam đồng nhất này là ví dụ của khái niệm:",
    options: ["Nhũ tương", "Huyền phù", "Dung dịch", "Hỗn hợp không đồng nhất"],
    correctAnswer: 2,
    targetType: "trạng thái chất"
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Antoine_Lavoisier.jpg/800px-Antoine_Lavoisier.jpg",
    question: "Dưới đây là một nhà bác học người Pháp, cha đẻ của định luật Bảo toàn khối lượng. Tên ông là gì?",
    options: ["Isaac Newton", "Antoine Lavoisier", "Marie Curie", "Albert Einstein"],
    correctAnswer: 1,
    targetType: "nhà bác học"
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/H2_Combustion_Reaction.png/800px-H2_Combustion_Reaction.png",
    question: "Sơ đồ này mô tả điều gì trong hóa học?",
    options: ["Tỉ khối", "Độ tan", "Phương trình hóa học", "Công thức phân tử"],
    correctAnswer: 2,
    targetType: "mô hình"
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Litmus_paper.JPG/800px-Litmus_paper.JPG",
    question: "Dụng cụ dùng để nhận biết nhanh tính Acid/Base này là:",
    options: ["Giấy quỳ tím", "Giấy lọc", "Ống đong", "Phễu"],
    correctAnswer: 0,
    targetType: "dụng cụ thử"
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Sodium_hydroxide_pellets.JPG/800px-Sodium_hydroxide_pellets.JPG",
    question: "Những viên chất rắn màu trắng ẩm ướt này thường là ví dụ của:",
    options: ["Acid", "Base (Kiềm)", "Oxit", "Muối"],
    correctAnswer: 1,
    targetType: "loại chất"
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Rust_on_iron.jpg/800px-Rust_on_iron.jpg",
    question: "Lớp gỉ màu nâu đỏ trên bề mặt sắt này chính là một loại:",
    options: ["Oxit", "Axit", "Muối", "Ba-zơ"],
    correctAnswer: 0,
    targetType: "loại chất"
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Halite_Crystal.jpg/800px-Halite_Crystal.jpg",
    question: "Dưới đây là tinh thể Muối ăn trong tự nhiên, tên khoáng học là:",
    options: ["Thạch anh", "Halite (Muối đá)", "Canxit", "Pirit"],
    correctAnswer: 1,
    targetType: "loại chất"
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Potassium_carbonate_potash.jpg/800px-Potassium_carbonate_potash.jpg",
    question: "Chất này được dùng rộng rãi trong sản xuất phân bón. Đây là:",
    options: ["Axit mạnh", "Nhiên liệu", "Muối Kali (Potash)", "Oxit kim loại"],
    correctAnswer: 2,
    targetType: "ứng dụng"
  },
  {
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Methane-3D-balls.png/800px-Methane-3D-balls.png",
    question: "Mô hình này mô tả khí Mêtan ($CH_4$), thành phần chính của loại:",
    options: ["Acid", "Base", "Nhiên liệu khí", "Oxit khí"],
    correctAnswer: 2,
    targetType: "ứng dụng"
  }
];

async function updateChallenges() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB!");

    const lessons = await Lesson.find({ classId: 8 }).sort({ order: 1 });
    console.log(`Found ${lessons.length} lessons for Grade 8.`);

    for (let i = 0; i < Math.min(lessons.length, challenges.length); i++) {
      const lesson = lessons[i];
      lesson.challenge = challenges[i];
      await lesson.save();
      console.log(`Updated challenge for: ${lesson.title}`);
    }

    console.log("Successfully updated all challenges! 🎉");
    process.exit(0);
  } catch (err) {
    console.error("Error updating challenges:", err);
    process.exit(1);
  }
}

updateChallenges();
