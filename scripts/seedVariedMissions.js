import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../api/models/Lesson.js';

dotenv.config();

const lesson2Challenges = [
  {
    type: "image-selection",
    narrative: "Phản ứng hóa học luôn kèm theo dấu hiệu đặc trưng. Hãy chọn hình ảnh thể hiện phản ứng tỏa nhiệt.",
    question: "Đâu là ví dụ phản ứng tỏa nhiệt?",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Ice_melting.jpg/220px-Ice_melting.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Large_bonfire.jpg/220px-Large_bonfire.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Evaporation_%28PSF%29.png/220px-Evaporation_%28PSF%29.png",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Sugar_2xMacro.jpg/220px-Sugar_2xMacro.jpg"
    ],
    correctAnswer: 1,
    targetType: "loại phản ứng"
  },
  {
    type: "image-selection",
    narrative: "Sắt bị gỉ trong không khí ẩm. Đây là quá trình chuyển đổi chất.",
    question: "Đâu là hình ảnh sắt bị gỉ (phản ứng hóa học)?",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Rust_and_dirt.jpg/220px-Rust_and_dirt.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24_heures_de_Daytona_2007_Bentley_3.jpg/220px-24_heures_de_Daytona_2007_Bentley_3.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Ice_melting.jpg/220px-Ice_melting.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Sugar_2xMacro.jpg/220px-Sugar_2xMacro.jpg"
    ],
    correctAnswer: 0,
    targetType: "hiện tượng"
  },
  {
    type: "multiple-choice",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Rust_and_dirt.jpg/220px-Rust_and_dirt.jpg",
    narrative: "Sắt bị gỉ trong không khí ẩm tạo thành một chất mới.",
    question: "Tên gọi hiện tượng chất chuyển đổi thành chất mới là gì?",
    options: ["Biến đổi vật lý", "Phản ứng hóa học", "Sự bay hơi", "Sự hòa tan"],
    correctAnswer: 1,
    targetType: "khái niệm"
  },
  {
    type: "drag-drop",
    narrative: "Sắp xếp các bước diễn ra của một phản ứng hóa học thông thường:",
    question: "Hãy kéo để sắp xếp đúng thứ tự:",
    items: [
      { id: 1, label: "1. Các chất phản ứng tiếp xúc nhau" },
      { id: 2, label: "2. Liên kết giữa các nguyên tử bị phá vỡ" },
      { id: 3, label: "3. Các nguyên tử sắp xếp lại" },
      { id: 4, label: "4. Sản phẩm mới được tạo thành" }
    ],
    correctOrder: [1, 2, 3, 4],
    targetType: "diễn biến"
  },
  {
    type: "image-selection",
    narrative: "Khi cho đá vôi vào axit, có bọt khí sủi lên. Hãy tìm hình ảnh thể hiện dấu hiệu này.",
    question: "Đâu là dấu hiệu sủi bọt khí trong phản ứng?",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Sugar_2xMacro.jpg/220px-Sugar_2xMacro.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Ice_melting.jpg/220px-Ice_melting.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Champagne_flute_and_schnapps_glass.jpg/160px-Champagne_flute_and_schnapps_glass.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Large_bonfire.jpg/220px-Large_bonfire.jpg"
    ],
    correctAnswer: 2,
    targetType: "dấu hiệu"
  },
  {
    type: "fill-in-the-blank",
    narrative: "Trong phản ứng: Sắt + Lưu huỳnh → Sắt (II) sunfua",
    question: "Chất được tạo thành sau phản ứng gọi là gì?",
    placeholder: "Nhập câu trả lời...",
    correctAnswer: "Sản phẩm",
    targetType: "khái niệm"
  },
  {
    type: "multiple-choice",
    narrative: "Trước và sau phản ứng, tổng khối lượng các chất không đổi.",
    question: "Đây là nội dung của định luật nào?",
    options: ["Định luật vạn vật hấp dẫn", "Định luật bảo toàn khối lượng", "Định luật bảo toàn năng lượng", "Định luật Hooke"],
    correctAnswer: 1,
    targetType: "định luật"
  },
  {
    type: "image-selection",
    narrative: "Nhiều phản ứng sinh ra kết tủa - một chất rắn lắng xuống đáy dung dịch.",
    question: "Đâu là hình ảnh thể hiện sự kết tủa?",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Large_bonfire.jpg/220px-Large_bonfire.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Ice_melting.jpg/220px-Ice_melting.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Lead%28II%29_iodide_precipitate.jpg/220px-Lead%28II%29_iodide_precipitate.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Evaporation_%28PSF%29.png/220px-Evaporation_%28PSF%29.png"
    ],
    correctAnswer: 2,
    targetType: "dấu hiệu"
  }
];

async function seedVariedMissions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB!");

    const lesson = await Lesson.findOne({ classId: 8, order: 2 });
    if (lesson) {
      lesson.challenges = lesson2Challenges;
      await lesson.save();
      console.log(`✅ Updated 8 challenges (4 img-select + 2 MCQ + 1 fill + 1 drag) for: ${lesson.title}`);
    } else {
      console.log("❌ Lesson 2 not found.");
    }

    console.log("🎉 Successfully seeded varied missions!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding missions:", err);
    process.exit(1);
  }
}

seedVariedMissions();
