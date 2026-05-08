import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const QUIZ_LIBRARY = {
  'nguyên tử': [
    { question: 'Hạt nào mang điện tích dương trong nguyên tử?', options: ['Electron', 'Proton', 'Nơtron', 'Phân tử'], answer: 1, level: 'easy' },
    { question: 'Nguyên tử trung hòa về điện vì:', options: ['Số p = số n', 'Số p = số e', 'Số n = số e', 'Chỉ có hạt nơtron'], answer: 1, level: 'medium' },
    { question: 'Khối lượng của nguyên tử tập trung chủ yếu ở:', options: ['Lớp vỏ', 'Hạt nhân', 'Hạt electron', 'Hạt nơtron'], answer: 1, level: 'easy' }
  ],
  'phản ứng': [
    { question: 'Trong phản ứng hóa học, yếu tố nào sau đây không thay đổi?', options: ['Số lượng phân tử', 'Liên kết giữa các nguyên tử', 'Số lượng nguyên tử mỗi nguyên tố', 'Trạng thái của chất'], answer: 2, level: 'medium' },
    { question: 'Dấu hiệu nào sau đây chứng tỏ có phản ứng hóa học xảy ra?', options: ['Sự thay đổi màu sắc', 'Có chất khí thoát ra', 'Có chất kết tủa tạo thành', 'Cả 3 phương án trên'], answer: 3, level: 'easy' }
  ],
  'mol': [
    { question: 'Một mol chất khí ở điều kiện chuẩn (25°C, 1 bar) có thể tích là:', options: ['22,4 lít', '24,79 lít', '11,2 lít', '24 lít'], answer: 1, level: 'easy' },
    { question: 'Khối lượng mol của khí Oxi (O2) là:', options: ['16 g/mol', '32 g/mol', '8 g/mol', '64 g/mol'], answer: 1, level: 'easy' }
  ],
  'axit': [
    { question: 'Axit làm quỳ tím chuyển sang màu gì?', options: ['Xanh', 'Đỏ', 'Không đổi màu', 'Vàng'], answer: 1, level: 'easy' },
    { question: 'Axit nào có trong dịch vị dạ dày người?', options: ['H2SO4', 'HCl', 'HNO3', 'CH3COOH'], answer: 1, level: 'medium' }
  ],
  'bazo': [
    { question: 'Dung dịch bazo (kiềm) làm phenolphtalein không màu chuyển sang màu:', options: ['Xanh', 'Hồng', 'Đỏ', 'Vàng'], answer: 1, level: 'easy' },
    { question: 'Bazo nào sau đây tan được trong nước?', options: ['Cu(OH)2', 'NaOH', 'Fe(OH)3', 'Al(OH)3'], answer: 1, level: 'easy' }
  ],
  'kim loại': [
    { question: 'Kim loại nào có tính dẫn điện tốt nhất?', options: ['Vàng', 'Bạc', 'Đồng', 'Nhôm'], answer: 1, level: 'medium' },
    { question: 'Kim loại nào ở trạng thái lỏng ở điều kiện thường?', options: ['Sắt', 'Thủy ngân', 'Chì', 'Natri'], answer: 1, level: 'easy' },
    { question: 'Dãy kim loại nào tác dụng được với nước ở nhiệt độ thường?', options: ['Fe, Cu', 'K, Na', 'Mg, Al', 'Ag, Au'], answer: 1, level: 'medium' }
  ],
  'oxi': [
    { question: 'Thành phần thể tích của khí Oxi trong không khí khoảng:', options: ['21%', '78%', '1%', '50%'], answer: 0, level: 'easy' },
    { question: 'Sự oxi hóa chậm là:', options: ['Sự cháy có tỏa nhiệt và phát sáng', 'Sự oxi hóa có tỏa nhiệt nhưng không phát sáng', 'Sự tác dụng của oxi với đơn chất', 'Sự phân hủy chất'], answer: 1, level: 'medium' }
  ],
  'hữu cơ': [
    { question: 'Thành phần nguyên tố nhất thiết phải có trong hợp chất hữu cơ là:', options: ['Nitơ', 'Oxi', 'Cacbon', 'Hydro'], answer: 2, level: 'easy' },
    { question: 'Công thức phân tử của Methane là:', options: ['C2H4', 'CH4', 'C2H2', 'C6H6'], answer: 1, level: 'easy' }
  ],
  'liên kết': [
    { question: 'Liên kết được hình thành bởi sự dùng chung electron giữa các nguyên tử là:', options: ['Liên kết ion', 'Liên kết cộng hóa trị', 'Liên kết hydrogen', 'Liên kết kim loại'], answer: 1, level: 'medium' },
    { question: 'Trong phân tử NaCl, liên kết giữa Na và Cl là:', options: ['Liên kết cộng hóa trị', 'Liên kết ion', 'Liên kết hydrogen', 'Liên kết van der Waals'], answer: 1, level: 'medium' }
  ],
  'cân bằng': [
    { question: 'Yếu tố nào sau đây không làm chuyển dịch cân bằng hóa học?', options: ['Nhiệt độ', 'Nồng độ', 'Chất xúc tác', 'Áp suất (đối với hệ có khí)'], answer: 2, level: 'hard' }
  ],
  'polymer': [
    { question: 'Chất nào sau đây là polymer thiên nhiên?', options: ['Nhựa PE', 'Cao su buna', 'Tinh bột', 'Tơ nilon-6,6'], answer: 2, level: 'medium' }
  ],
  'ester': [
    { question: 'Phản ứng giữa axit cacboxylic và ancol tạo thành ester được gọi là:', options: ['Phản ứng xà phòng hóa', 'Phản ứng ester hóa', 'Phản ứng thủy phân', 'Phản ứng trùng ngưng'], answer: 1, level: 'easy' }
  ]
};

const DEFAULT_QUESTIONS = [
  { question: 'Hóa học là ngành khoa học nghiên cứu về:', options: ['Các loài sinh vật', 'Chất, sự biến đổi và ứng dụng của chất', 'Các vì sao', 'Các hiện tượng vật lý'], answer: 1, level: 'easy' },
  { question: 'Chất tinh khiết là chất:', options: ['Có lẫn tạp chất', 'Không lẫn chất khác', 'Là hỗn hợp', 'Có màu trắng'], answer: 1, level: 'easy' },
  { question: 'Ký hiệu hóa học của Sắt là:', options: ['S', 'Si', 'Fe', 'Cu'], answer: 2, level: 'easy' },
  { question: 'Đơn vị đo lượng chất trong hóa học là:', options: ['Gram', 'Lít', 'Mol', 'Nguyên tử khối'], answer: 2, level: 'easy' },
  { question: 'Hiện tượng hóa học là hiện tượng:', options: ['Chất biến đổi có tạo thành chất mới', 'Chất chỉ thay đổi trạng thái', 'Chất chỉ thay đổi hình dạng', 'Chất nóng chảy'], answer: 0, level: 'easy' }
];

async function updateAllQuizzes() {
  console.log('🚀 Bắt đầu cập nhật dữ liệu câu hỏi cho 110 bài học...');

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, title, class_id');

  if (error) {
    console.error('❌ Lỗi tải bài học:', error);
    return;
  }

  console.log(`📂 Tìm thấy ${lessons.length} bài học cần xử lý.`);

  for (const lesson of lessons) {
    const titleLower = lesson.title.toLowerCase();
    let selectedQuestions = [];

    // Chọn câu hỏi dựa trên từ khóa trong tiêu đề
    for (const [key, questions] of Object.entries(QUIZ_LIBRARY)) {
      if (titleLower.includes(key)) {
        selectedQuestions.push(...questions);
      }
    }

    // Nếu không đủ 5 câu hoặc không có từ khóa, thêm câu hỏi mặc định
    if (selectedQuestions.length < 5) {
      const remainingCount = 5 - selectedQuestions.length;
      selectedQuestions.push(...DEFAULT_QUESTIONS.slice(0, remainingCount));
    }

    // Trộn ngẫu nhiên và lấy 5 câu
    const finalQuizzes = selectedQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(q => ({
        question: q.question,
        options: q.options,
        answer: q.answer,
        level: q.level
      }));

    console.log(`📝 Cập nhật: ${lesson.title} (${finalQuizzes.length} câu)`);

    const { error: updateError } = await supabase
      .from('lessons')
      .update({ quizzes: finalQuizzes })
      .eq('id', lesson.id);

    if (updateError) {
      console.warn(`⚠️ Lỗi cập nhật bài ${lesson.id}:`, updateError.message);
    }
  }

  console.log('\n🏁 Hoàn tất cập nhật 110 bài học!');
}

updateAllQuizzes();
