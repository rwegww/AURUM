import { supabase } from '../api/lib/supabase.js';
import Lesson from '../api/models/Lesson.js';
import dotenv from 'dotenv';

dotenv.config();

const lesson1Challenges = [
  {
    type: "image-selection",
    narrative: "Trong phòng thí nghiệm có rất nhiều dụng cụ. Hãy quan sát 4 hình ảnh và chọn đúng cốc thủy tinh (beaker).",
    question: "Đâu là cốc thủy tinh (beaker)?",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Erlenmeyer_flask_hg.jpg/220px-Erlenmeyer_flask_hg.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Becher_mit_Wasser.jpg/220px-Becher_mit_Wasser.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Graduated_cylinder_hg.jpg/120px-Graduated_cylinder_hg.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Round-bottom_flask_100ml.jpg/220px-Round-bottom_flask_100ml.jpg"
    ],
    correctAnswer: 1,
    targetType: "dụng cụ"
  },
  {
    type: "image-selection",
    narrative: "Ống nghiệm là dụng cụ cơ bản nhất. Hãy tìm đúng ống nghiệm trong 4 hình sau.",
    question: "Đâu là ống nghiệm (test tube)?",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Two_small_test_tubes_held_in_spring_clamps.jpg/320px-Two_small_test_tubes_held_in_spring_clamps.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Buret.jpg/90px-Buret.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Erlenmeyer_flask_hg.jpg/220px-Erlenmeyer_flask_hg.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Retort.png/220px-Retort.png"
    ],
    correctAnswer: 0,
    targetType: "dụng cụ"
  },
  {
    type: "image-selection",
    narrative: "Bình tam giác (Erlenmeyer) có thiết kế đặc biệt giúp lắc trộn dung dịch mà không bị bắn ra ngoài.",
    question: "Đâu là bình tam giác Erlenmeyer?",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Becher_mit_Wasser.jpg/220px-Becher_mit_Wasser.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Round-bottom_flask_100ml.jpg/220px-Round-bottom_flask_100ml.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Graduated_cylinder_hg.jpg/120px-Graduated_cylinder_hg.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Erlenmeyer_flask_hg.jpg/220px-Erlenmeyer_flask_hg.jpg"
    ],
    correctAnswer: 3,
    targetType: "dụng cụ"
  },
  {
    type: "image-selection",
    narrative: "Ống đong dùng để đo thể tích chất lỏng. Nó có hình trụ dài với vạch chia.",
    question: "Đâu là ống đong (graduated cylinder)?",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Graduated_cylinder_hg.jpg/120px-Graduated_cylinder_hg.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Two_small_test_tubes_held_in_spring_clamps.jpg/320px-Two_small_test_tubes_held_in_spring_clamps.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Becher_mit_Wasser.jpg/220px-Becher_mit_Wasser.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Buret.jpg/90px-Buret.jpg"
    ],
    correctAnswer: 0,
    targetType: "dụng cụ đo"
  },
  {
    type: "image-selection",
    narrative: "Đèn Bunsen là nguồn nhiệt phổ biến nhất trong phòng thí nghiệm.",
    question: "Đâu là đèn Bunsen?",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Alcohol_Lamp.jpg/220px-Alcohol_Lamp.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Bunsen_burner_flame_types_with_air_flow_labeled.jpg/220px-Bunsen_burner_flame_types_with_air_flow_labeled.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Hot_plate.jpg/220px-Hot_plate.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Spirit_thermometer.jpg/100px-Spirit_thermometer.jpg"
    ],
    correctAnswer: 1,
    targetType: "thiết bị nhiệt"
  },
  {
    type: "multiple-choice",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Becher_mit_Wasser.jpg/220px-Becher_mit_Wasser.jpg",
    narrative: "Quan sát hình ảnh dụng cụ thủy tinh có hình trụ, thành mỏng, có vạch chia thể tích và miệng rộng.",
    question: "Dụng cụ này thường dùng để:",
    options: ["Đo thể tích chính xác", "Chứa, pha và đun nóng dung dịch", "Lọc chất rắn", "Đo nhiệt độ"],
    correctAnswer: 1,
    targetType: "công dụng"
  },
  {
    type: "image-selection",
    narrative: "Phễu lọc giúp tách chất rắn ra khỏi chất lỏng bằng phương pháp lọc.",
    question: "Đâu là phễu lọc (filter funnel)?",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Two_small_test_tubes_held_in_spring_clamps.jpg/320px-Two_small_test_tubes_held_in_spring_clamps.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Round-bottom_flask_100ml.jpg/220px-Round-bottom_flask_100ml.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Separating_funnel.jpg/150px-Separating_funnel.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Filtration-20.png/220px-Filtration-20.png"
    ],
    correctAnswer: 3,
    targetType: "dụng cụ"
  },
  {
    type: "multiple-choice",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Two_small_test_tubes_held_in_spring_clamps.jpg/320px-Two_small_test_tubes_held_in_spring_clamps.jpg",
    narrative: "Hãy quan sát kỹ hình ảnh các ống nhỏ bằng thủy tinh đang được giữ bởi kẹp.",
    question: "Ống nghiệm dùng để làm gì?",
    options: ["Đo thể tích lớn", "Thực hiện phản ứng với lượng nhỏ hóa chất", "Đun sôi nước", "Cân hóa chất"],
    correctAnswer: 1,
    targetType: "công dụng"
  },
  {
    type: "image-selection",
    narrative: "Cân điện tử giúp đo khối lượng chính xác trong phòng thí nghiệm.",
    question: "Đâu là cân điện tử (electronic balance)?",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Graduated_cylinder_hg.jpg/120px-Graduated_cylinder_hg.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Analytical_balance_mettler_ae-260.jpg/220px-Analytical_balance_mettler_ae-260.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Alcohol_Lamp.jpg/220px-Alcohol_Lamp.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Buret.jpg/90px-Buret.jpg"
    ],
    correctAnswer: 1,
    targetType: "thiết bị đo"
  },
  {
    type: "image-selection",
    narrative: "Nhiệt kế thủy ngân dùng để đo nhiệt độ dung dịch hoặc phản ứng.",
    question: "Đâu là nhiệt kế?",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Becher_mit_Wasser.jpg/220px-Becher_mit_Wasser.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Buret.jpg/90px-Buret.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Spirit_thermometer.jpg/100px-Spirit_thermometer.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Erlenmeyer_flask_hg.jpg/220px-Erlenmeyer_flask_hg.jpg"
    ],
    correctAnswer: 2,
    targetType: "dụng cụ đo"
  }
];

async function seedMultiMissions() {
  console.log("🚀 Seeding Image-Selection Missions to Supabase...");
  try {
    const { data: lessons, error: fetchError } = await supabase
      .from('lessons')
      .select('id, title, order')
      .eq('class_id', 8);
    
    if (fetchError) throw fetchError;
    
    const lesson = lessons?.find(l => l.order === 1);
    
    if (lesson) {
      const { error } = await supabase
        .from('lessons')
        .update({ challenges: lesson1Challenges })
        .eq('id', lesson.id);

      if (error) throw error;
      console.log(`✅ Updated challenges for: ${lesson.title}`);
    } else {
      console.log("❌ Lesson (Class 8, Order 1) not found in Supabase.");
    }

    console.log("🎉 Successfully seeded image-selection missions!");
  } catch (err) {
    console.error("Error seeding missions:", err.message);
  }
}

seedMultiMissions();
