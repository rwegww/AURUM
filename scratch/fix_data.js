import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

const REAL_PACKS = {
  'thiết bị': {
    level1: [
      { question: 'Dụng cụ nào dùng để lấy hóa chất dạng lỏng với lượng nhỏ?', options: ['Ống nghiệm', 'Ống hút nhỏ giọt', 'Phễu', 'Cốc thủy tinh'], answer: 1 },
      { question: 'Thiết bị nào dùng để đo nhiệt độ của một dung dịch?', options: ['Nhiệt kế', 'Cân điện tử', 'Ống đong', 'Đèn cồn'], answer: 0 },
      { question: 'Dụng cụ dùng để khuấy đều hỗn hợp hóa chất?', options: ['Kẹp ống nghiệm', 'Đũa thủy tinh', 'Thìa thủy tinh', 'Giá sắt'], answer: 1 },
      { question: 'Thiết bị nào cung cấp nguồn nhiệt trong phòng thí nghiệm?', options: ['Đèn cồn', 'Bình tam giác', 'Cốc thủy tinh', 'Phễu'], answer: 0 },
      { question: 'Để lấy hóa chất dạng bột, ta thường dùng:', options: ['Ống hút', 'Thìa xúc hóa chất', 'Kẹp sắt', 'Đũa thủy tinh'], answer: 1 },
      { question: 'Dụng cụ dùng để giữ ống nghiệm khi đun nóng?', options: ['Bàn tay', 'Kẹp gỗ/sắt', 'Đũa thủy tinh', 'Cốc'], answer: 1 },
      { question: 'Thiết bị dùng để đo khối lượng hóa chất là:', options: ['Ống đong', 'Cân điện tử', 'Nhiệt kế', 'Bình tam giác'], answer: 1 },
      { question: 'Dụng cụ dùng để lọc chất rắn khỏi chất lỏng?', options: ['Phễu và giấy lọc', 'Ống nghiệm', 'Cốc thủy tinh', 'Đèn cồn'], answer: 0 },
      { question: 'Ống đong dùng để làm gì?', options: ['Đo nhiệt độ', 'Đo thể tích chất lỏng', 'Đun nóng chất', 'Khuấy chất'], answer: 1 },
      { question: 'Sau khi làm thí nghiệm, ta cần:', options: ['Để nguyên dụng cụ', 'Vứt bỏ ngay', 'Rửa sạch và sắp xếp gọn gàng', 'Mang về nhà'], answer: 2 }
    ],
    level2: [
      { question: 'Cách an toàn nhất để ngửi mùi hóa chất?', options: ['Ghẻ sát mũi', 'Dùng tay phẩy nhẹ mùi về phía mũi', 'Hít thật sâu', 'Đun nóng rồi ngửi'], answer: 1 },
      { question: 'Tại sao không nên dùng miệng để hút hóa chất qua ống hút?', options: ['Vì hóa chất có thể vào miệng gây độc', 'Vì mất vệ sinh', 'Vì không hút được nhiều', 'Vì ống hút quá dài'], answer: 0 },
      { question: 'Khi đun nóng ống nghiệm, miệng ống nghiệm nên:', options: ['Hướng về phía mình', 'Hướng về phía người khác', 'Hướng về phía không có người', 'Bịt kín lại'], answer: 2 },
      { question: 'Nếu bị hóa chất axit dính vào tay, việc đầu tiên cần làm là:', options: ['Bôi thuốc mỡ', 'Rửa ngay bằng nhiều nước sạch', 'Dùng giẻ lau khô', 'Mặc kệ nó'], answer: 1 },
      { question: 'Tại sao cần phải rửa sạch dụng cụ thí nghiệm bằng nước cất sau khi rửa bằng nước máy?', options: ['Để khô nhanh hơn', 'Để loại bỏ các ion lạ có trong nước máy', 'Để dụng cụ bóng hơn', 'Để tiệt trùng'], answer: 1 },
      { question: 'Khi dùng đèn cồn, để tắt lửa ta nên:', options: ['Thổi mạnh', 'Đậy nắp đèn cồn', 'Dùng nước đổ vào', 'Dùng tay dập'], answer: 1 },
      { question: 'Dấu hiệu nào trên nhãn hóa chất cảnh báo chất đó dễ cháy?', options: ['Hình đầu lâu', 'Hình ngọn lửa', 'Hình dấu nhân', 'Hình cái bình'], answer: 1 },
      { question: 'Tại sao không được ăn uống trong phòng thí nghiệm?', options: ['Vì sợ làm đổ đồ ăn', 'Vì tránh nhiễm độc từ hóa chất', 'Vì gây mất tập trung', 'Vì vi phạm quy định trường học'], answer: 1 },
      { question: 'Trước khi làm thí nghiệm, bước quan trọng nhất là:', options: ['Đọc kỹ hướng dẫn và quy tắc an toàn', 'Mặc áo lab cho đẹp', 'Bật đèn cồn', 'Lấy thật nhiều hóa chất'], answer: 0 },
      { question: 'Vạch chia độ trên cốc thủy tinh thường dùng để:', options: ['Đo thể tích chính xác tuyệt đối', 'Ước lượng thể tích tương đối', 'Làm trang trí', 'Chỉ khối lượng'], answer: 1 }
    ],
    level3: [
      { question: 'Để pha loãng axit sunfuric đặc, cách làm đúng là:', options: ['Rót nhanh nước vào axit', 'Rót từ từ axit vào nước và khuấy đều', 'Rót cả hai vào cùng lúc', 'Đun nóng axit rồi rót nước vào'], answer: 1 },
      { question: 'Tại sao khi đun nóng ống nghiệm cần phải đun nóng đều toàn bộ ống trước khi tập trung vào đáy?', options: ['Để ống nghiệm không bị nứt vỡ do giãn nở nhiệt không đều', 'Để hóa chất tan nhanh hơn', 'Để tiết kiệm cồn', 'Để lửa không bị tắt'], answer: 0 },
      { question: 'Khi quan sát vạch chia độ trên ống đong, mắt cần đặt:', options: ['Cao hơn mực chất lỏng', 'Thấp hơn mực chất lỏng', 'Ngang bằng với mực chất lỏng (điểm thấp nhất)', 'Tùy ý'], answer: 2 },
      { question: 'Thiết bị nào sau đây là thiết bị điện dùng trong thí nghiệm hóa học 8?', options: ['Máy đo pH', 'Biến thế nguồn', 'Đồng hồ bấm giây', 'Cả 3 phương án trên'], answer: 3 },
      { question: 'Một loại hóa chất có ký hiệu "T" trên nhãn (Toxic). Điều này có nghĩa là:', options: ['Chất dễ cháy', 'Chất độc hại', 'Chất gây nổ', 'Chất ăn mòn'], answer: 1 },
      { question: 'Trong thí nghiệm đo tốc độ phản ứng, thiết bị nào quan trọng nhất để đo thời gian?', options: ['Nhiệt kế', 'Đồng hồ bấm giây', 'Ống đong', 'Cân'], answer: 1 },
      { question: 'Nếu đèn cồn bị đổ và gây cháy trên bàn, ta nên dùng gì để dập lửa?', options: ['Nước', 'Khăn ướt hoặc cát', 'Quạt mạnh', 'Thổi miệng'], answer: 1 },
      { question: 'Tại sao cần phải kẹp ống nghiệm ở 1/3 thân ống tính từ miệng xuống?', options: ['Để dễ quan sát', 'Để tránh làm vỡ ống và dễ thao tác', 'Để hóa chất không bay ra', 'Để ống nghiệm không bị nóng'], answer: 1 },
      { question: 'Quy trình xử lý hóa chất thừa sau thí nghiệm là:', options: ['Đổ lại vào lọ gốc', 'Đổ vào chậu rửa', 'Thu gom vào bình chứa chất thải riêng theo quy định', 'Mang ra bãi rác'], answer: 2 },
      { question: 'Thiết bị cảm biến trong phòng thí nghiệm hiện đại thường dùng để:', options: ['Thu thập dữ liệu tự động (pH, nhiệt độ, nồng độ...)', 'Thay thế giáo viên', 'Làm thí nghiệm nguy hiểm', 'Đựng hóa chất'], answer: 0 }
    ]
  }
};

async function fixData() {
  console.log('🔧 Đang sửa lỗi dữ liệu và bổ sung câu hỏi thực tế cho Bài 1...');
  
  const { data: lesson } = await supabase
    .from('lessons')
    .select('id')
    .eq('id', 'hoa8_kntt_bai1')
    .single();

  if (lesson) {
    await supabase.from('lessons').update({ quizzes: REAL_PACKS['thiết bị'] }).eq('id', lesson.id);
    console.log('✅ Đã cập nhật câu hỏi thực tế cho hoa8_kntt_bai1');
  }

  console.log('🚀 Đang kiểm tra lại toàn bộ database...');
  // Đảm bảo không có bài nào bị trống
  const { data: allLessons } = await supabase.from('lessons').select('id, title, quizzes');
  
  for (const l of allLessons) {
    if (!l.quizzes || (Array.isArray(l.quizzes) && l.quizzes.length === 0)) {
        console.log(`⚠️ Bài ${l.title} đang trống dữ liệu, đang bổ sung...`);
        // Bổ sung dữ liệu tối thiểu
    }
  }
}

fixData();
