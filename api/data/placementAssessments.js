const PASSING_PERCENT = 70;

const ASSESSMENTS = {
  '6': [
    { id: 'g6-1', question: 'Để đo chiều dài của một quyển sách, dụng cụ phù hợp nhất là gì?', options: ['Cân đồng hồ', 'Thước có chia vạch', 'Nhiệt kế', 'Đồng hồ bấm giây'], correctAnswer: 1 },
    { id: 'g6-2', question: 'Khi làm thí nghiệm, hành động nào an toàn?', options: ['Tự ý nếm hóa chất', 'Đọc kĩ hướng dẫn trước khi làm', 'Đùa nghịch với dụng cụ', 'Ngửi trực tiếp hóa chất'], correctAnswer: 1 },
    { id: 'g6-3', question: 'Nước đá tan thành nước là sự thay đổi nào?', options: ['Thay đổi trạng thái', 'Tạo ra chất mới', 'Sự cháy', 'Phản ứng với oxygen'], correctAnswer: 0 },
    { id: 'g6-4', question: 'Đơn vị thường dùng để đo khối lượng là gì?', options: ['Mét', 'Lít', 'Kilôgam', 'Giây'], correctAnswer: 2 },
    { id: 'g6-5', question: 'Vật nào sau đây là vật sống?', options: ['Hòn đá', 'Cây đậu', 'Cốc thủy tinh', 'Chiếc bàn'], correctAnswer: 1 },
    { id: 'g6-6', question: 'Khi chất lỏng bị đổ trong phòng thực hành, em nên làm gì trước tiên?', options: ['Tự dùng tay lau ngay', 'Báo cho giáo viên', 'Bỏ đi nơi khác', 'Đổ thêm nước vào'], correctAnswer: 1 },
    { id: 'g6-7', question: 'Dụng cụ nào dùng để đo nhiệt độ?', options: ['Lực kế', 'Nhiệt kế', 'Ống đong', 'Kính lúp'], correctAnswer: 1 },
  ],
  '7': [
    { id: 'g7-1', question: 'Hạt đại diện cho một chất và gồm một số nguyên tử liên kết với nhau được gọi là gì?', options: ['Tế bào', 'Phân tử', 'Mô', 'Hỗn hợp'], correctAnswer: 1 },
    { id: 'g7-2', question: 'Chất nào sau đây là chất tinh khiết?', options: ['Nước cất', 'Nước biển', 'Không khí', 'Nước chanh'], correctAnswer: 0 },
    { id: 'g7-3', question: 'Muốn tách cát không tan khỏi nước, nên dùng phương pháp nào?', options: ['Cô cạn', 'Lọc', 'Chưng cất', 'Đông đặc'], correctAnswer: 1 },
    { id: 'g7-4', question: 'Oxygen cần thiết nhất cho quá trình nào ở người?', options: ['Hô hấp', 'Nghe', 'Nhìn', 'Tiêu hóa cơ học'], correctAnswer: 0 },
    { id: 'g7-5', question: 'Trong phòng thực hành, kính bảo hộ có tác dụng chính gì?', options: ['Giữ ấm', 'Bảo vệ mắt', 'Đo nhiệt độ', 'Làm thí nghiệm nhanh hơn'], correctAnswer: 1 },
    { id: 'g7-6', question: 'Khi tăng nhiệt độ, đa số chất rắn sẽ như thế nào?', options: ['Nở ra', 'Co lại hoàn toàn', 'Biến mất', 'Tăng khối lượng'], correctAnswer: 0 },
    { id: 'g7-7', question: 'Kí hiệu nào thường dùng cho đơn vị giây?', options: ['m', 'kg', 's', 'L'], correctAnswer: 2 },
  ],
  '8': [
    { id: 'g8-1', question: 'Nguyên tử trung hòa về điện vì sao?', options: ['Số proton bằng số electron', 'Không có proton', 'Không có electron', 'Số neutron bằng số electron'], correctAnswer: 0 },
    { id: 'g8-2', question: 'Kí hiệu hóa học của oxygen là gì?', options: ['Ox', 'O', 'Og', 'On'], correctAnswer: 1 },
    { id: 'g8-3', question: 'Bảng tuần hoàn sắp xếp các nguyên tố chủ yếu theo đại lượng nào tăng dần?', options: ['Khối lượng riêng', 'Số hiệu nguyên tử', 'Nhiệt độ nóng chảy', 'Số lớp vỏ nhìn thấy'], correctAnswer: 1 },
    { id: 'g8-4', question: 'Phân tử nước gồm những nguyên tố nào?', options: ['Hydrogen và oxygen', 'Nitrogen và oxygen', 'Carbon và oxygen', 'Hydrogen và chlorine'], correctAnswer: 0 },
    { id: 'g8-5', question: 'Công thức hóa học đúng của khí oxygen là gì?', options: ['O', 'O₂', 'O₃', '2O'], correctAnswer: 1 },
    { id: 'g8-6', question: 'Dấu hiệu nào cho thấy có thể đã tạo ra chất mới?', options: ['Vật đổi vị trí', 'Xuất hiện kết tủa', 'Vật bị cắt nhỏ', 'Nước được rót sang cốc khác'], correctAnswer: 1 },
    { id: 'g8-7', question: 'Khi pha loãng acid đặc, cách làm an toàn là gì?', options: ['Rót nước vào acid thật nhanh', 'Rót từ từ acid vào nước', 'Dùng tay khuấy', 'Đậy kín rồi lắc mạnh'], correctAnswer: 1 },
  ],
  '9': [
    { id: 'g9-1', question: 'Hiện tượng nào là biến đổi hóa học?', options: ['Nước bay hơi', 'Sắt bị gỉ', 'Đá bị nghiền nhỏ', 'Muối tan trong nước'], correctAnswer: 1 },
    { id: 'g9-2', question: 'Đơn vị đo lượng chất là gì?', options: ['Gam', 'Mol', 'Lít', 'Mét'], correctAnswer: 1 },
    { id: 'g9-3', question: 'Dung dịch có pH nhỏ hơn 7 thường có môi trường gì?', options: ['Acid', 'Base', 'Trung tính', 'Không xác định'], correctAnswer: 0 },
    { id: 'g9-4', question: 'Chất nào làm quỳ tím hóa xanh?', options: ['Dung dịch acid', 'Dung dịch base', 'Nước cất', 'Dung dịch muối ăn loãng'], correctAnswer: 1 },
    { id: 'g9-5', question: 'Trong phương trình hóa học, tổng số nguyên tử mỗi nguyên tố ở hai vế phải như thế nào?', options: ['Bằng nhau', 'Vế trái nhiều hơn', 'Vế phải nhiều hơn', 'Không cần liên quan'], correctAnswer: 0 },
    { id: 'g9-6', question: 'Khí nào duy trì sự cháy?', options: ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Hydrogen'], correctAnswer: 1 },
    { id: 'g9-7', question: 'Công thức hóa học của sodium chloride (muối ăn) là gì?', options: ['NaOH', 'NaCl', 'HCl', 'KCl'], correctAnswer: 1 },
  ],
  '10': [
    { id: 'g10-1', question: 'Kim loại nào đứng trước hydrogen trong dãy hoạt động hóa học có thể phản ứng với dung dịch acid loãng?', options: ['Copper', 'Silver', 'Zinc', 'Gold'], correctAnswer: 2 },
    { id: 'g10-2', question: 'Oxide nào sau đây là oxide acid?', options: ['CaO', 'Na₂O', 'CO₂', 'MgO'], correctAnswer: 2 },
    { id: 'g10-3', question: 'Phản ứng giữa acid và base tạo thành muối và nước được gọi là gì?', options: ['Phản ứng thế', 'Phản ứng trung hòa', 'Phản ứng phân hủy', 'Phản ứng cháy'], correctAnswer: 1 },
    { id: 'g10-4', question: 'Carbon có số hiệu nguyên tử 6. Nguyên tử carbon trung hòa có bao nhiêu electron?', options: ['3', '6', '8', '12'], correctAnswer: 1 },
    { id: 'g10-5', question: 'Dung dịch nào dẫn điện?', options: ['Dung dịch NaCl', 'Nước đường tinh khiết', 'Dầu ăn', 'Nước cất tuyệt đối'], correctAnswer: 0 },
    { id: 'g10-6', question: 'Trong phản ứng oxi hóa – khử, sự oxi hóa là quá trình nào?', options: ['Nhận electron', 'Nhường electron', 'Nhận proton', 'Giảm số oxi hóa'], correctAnswer: 1 },
    { id: 'g10-7', question: 'Một mol chứa xấp xỉ bao nhiêu hạt?', options: ['6,02 × 10²³', '3,14 × 10⁸', '9,81 × 10²', '1,00 × 10³'], correctAnswer: 0 },
  ],
  '11': [
    { id: 'g11-1', question: 'Số hiệu nguyên tử của một nguyên tố bằng số hạt nào trong hạt nhân?', options: ['Neutron', 'Proton', 'Electron', 'Nucleon'], correctAnswer: 1 },
    { id: 'g11-2', question: 'Liên kết trong sodium chloride (NaCl) chủ yếu là liên kết gì?', options: ['Cộng hóa trị không cực', 'Ion', 'Hydrogen', 'Kim loại'], correctAnswer: 1 },
    { id: 'g11-3', question: 'Nguyên tố có độ âm điện lớn nhất là gì?', options: ['Oxygen', 'Chlorine', 'Fluorine', 'Nitrogen'], correctAnswer: 2 },
    { id: 'g11-4', question: 'Chất oxi hóa là chất có xu hướng làm gì?', options: ['Nhường electron', 'Nhận electron', 'Không đổi số oxi hóa', 'Chỉ nhận proton'], correctAnswer: 1 },
    { id: 'g11-5', question: 'Phản ứng tỏa nhiệt có đặc điểm nào?', options: ['Hấp thụ nhiệt từ môi trường', 'Giải phóng nhiệt ra môi trường', 'Không trao đổi năng lượng', 'Chỉ xảy ra ở 0°C'], correctAnswer: 1 },
    { id: 'g11-6', question: 'Trong cùng một chu kì, bán kính nguyên tử nhìn chung biến đổi thế nào từ trái sang phải?', options: ['Tăng dần', 'Giảm dần', 'Không đổi', 'Tăng rồi luôn bằng nhau'], correctAnswer: 1 },
    { id: 'g11-7', question: 'Số oxi hóa của oxygen trong đa số hợp chất là bao nhiêu?', options: ['+2', '+1', '−1', '−2'], correctAnswer: 3 },
  ],
  '12': [
    { id: 'g12-1', question: 'Ở trạng thái cân bằng hóa học, tốc độ phản ứng thuận và nghịch như thế nào?', options: ['Bằng nhau', 'Phản ứng thuận lớn hơn', 'Phản ứng nghịch lớn hơn', 'Đều bằng 0'], correctAnswer: 0 },
    { id: 'g12-2', question: 'Theo Brønsted–Lowry, acid là chất có khả năng gì?', options: ['Nhận proton', 'Cho proton', 'Nhường electron', 'Nhận neutron'], correctAnswer: 1 },
    { id: 'g12-3', question: 'Chất xúc tác ảnh hưởng thế nào đến cân bằng hóa học?', options: ['Làm cân bằng chuyển dịch phải', 'Làm cân bằng chuyển dịch trái', 'Làm hệ nhanh đạt cân bằng hơn', 'Làm tăng hằng số cân bằng'], correctAnswer: 2 },
    { id: 'g12-4', question: 'Ammonia có công thức hóa học nào?', options: ['NH₃', 'NH₄', 'NO₂', 'N₂H₄'], correctAnswer: 0 },
    { id: 'g12-5', question: 'Nhóm chức đặc trưng của alcohol là gì?', options: ['–COOH', '–OH', '–CHO', '–NH₂'], correctAnswer: 1 },
    { id: 'g12-6', question: 'Hydrocarbon chỉ chứa những nguyên tố nào?', options: ['Carbon và hydrogen', 'Carbon và oxygen', 'Hydrogen và oxygen', 'Carbon, hydrogen và nitrogen'], correctAnswer: 0 },
    { id: 'g12-7', question: 'Khi tăng áp suất, cân bằng khí có xu hướng chuyển về phía nào?', options: ['Phía có số mol khí lớn hơn', 'Phía có số mol khí nhỏ hơn', 'Luôn chuyển sang phải', 'Không bao giờ chuyển dịch'], correctAnswer: 1 },
  ],
};

export const PLACEMENT_GRADES = Object.freeze(Object.keys(ASSESSMENTS));

export const getPlacementAssessment = (grade) => {
  const normalizedGrade = String(grade || '');
  const questions = ASSESSMENTS[normalizedGrade];
  if (!questions) return null;

  return {
    grade: normalizedGrade,
    passingPercent: PASSING_PERCENT,
    questions: questions.map(({ correctAnswer: _correctAnswer, ...question }) => question),
  };
};

export const gradePlacementAssessment = (grade, answers) => {
  const normalizedGrade = String(grade || '');
  const questions = ASSESSMENTS[normalizedGrade];
  if (!questions || !answers || typeof answers !== 'object' || Array.isArray(answers)) return null;

  const hasEveryAnswer = questions.every((question) => (
    Number.isInteger(answers[question.id])
    && answers[question.id] >= 0
    && answers[question.id] < question.options.length
  ));
  if (!hasEveryAnswer) return null;

  const correct = questions.reduce(
    (total, question) => total + (answers[question.id] === question.correctAnswer ? 1 : 0),
    0,
  );
  const total = questions.length;
  const percent = Math.round((correct / total) * 100);

  return {
    correct,
    total,
    percent,
    passed: percent >= PASSING_PERCENT,
    passingPercent: PASSING_PERCENT,
  };
};

