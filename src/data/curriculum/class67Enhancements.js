const buildTable = (headers, rows) => {
  const headerLine = `| ${headers.join(' | ')} |`;
  const divider = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.join(' | ')} |`).join('\n');
  return `${headerLine}\n${divider}\n${body}`;
};

const moduleId = (lesson, suffix) => `${lesson.id || lesson.lessonId}-enhanced-${suffix}`;

const heading = (lesson, suffix, text, level = 'h2') => ({
  id: moduleId(lesson, suffix),
  type: 'heading',
  content: { text, level },
});

const paragraph = (lesson, suffix, text) => ({
  id: moduleId(lesson, suffix),
  type: 'paragraph',
  content: { text },
});

const list = (lesson, suffix, items) => ({
  id: moduleId(lesson, suffix),
  type: 'list',
  content: {
    type: 'bullet',
    items,
  },
});

const markdown = (lesson, suffix, text) => ({
  id: moduleId(lesson, suffix),
  type: 'markdown',
  content: { text },
});

const infoBox = (lesson, suffix, title, content) => ({
  id: moduleId(lesson, suffix),
  type: 'infoBox',
  content: { title, content },
});

const warningBox = (lesson, suffix, title, content) => ({
  id: moduleId(lesson, suffix),
  type: 'warningBox',
  content: { title, content },
});

const normalizeTitle = (lesson) => (lesson.title || '').replace(/^Bài\s+\d+:\s*/i, '');

const CLOUDINARY_CLOUD_NAME = import.meta.env?.VITE_CLOUDINARY_CLOUD_NAME || 'dpcorzgkm';

const YOUTUBE_VIDEO_URLS = {
  '6-2': 'https://youtu.be/8hu1zdXjSqo?si=oUxhSJLKPzveOQya',
  '6-6': 'https://youtu.be/nOWRE9XyaMc?si=pT1qW9WC2kDf2tZE',
  '6-8': 'https://youtu.be/IvPcVp6tFKA?si=i6SR_Ak2XCuvk5sv',
  '6-9': 'https://youtu.be/k17Wwd4nyEA?si=AaMq5vsnT8aHnubm',
  '6-10': 'https://youtu.be/8iPryAd5igw?si=GBp2szRSQ-yCb2C6',
  '6-11': 'https://youtu.be/hIKct2T-jfc?si=WDNkz0qjFK01wlK-',
  '6-12': 'https://youtu.be/qxs6psfLiE0?si=07SjQ2zdPYCDWPnE',
  '6-13': 'https://youtu.be/fgf_xQEQ5Cw?si=5IGUj6jAKdywpymf',
  '6-14': 'https://youtu.be/E_96vVDizV8?si=Pe-ziyNnqnIThk5b',
  '6-15': 'https://youtu.be/6l7SAMM00-s?si=tAfCXii3LQRXhPF0',
  '6-16': 'https://youtu.be/zUyq_VAFzkk?si=VVzXQptHP3y0JFgA',
  '6-17': 'https://youtu.be/ITTkFZYmuoY?si=xeFYloU16cQ0vxwK',
  '7-1': 'https://youtu.be/4-dapXgvvQ0?si=w5bI4n4YRYUR09HM',
  '7-2': 'https://youtu.be/n-no-o3RfWM?si=P1V4bflriZQmHIso',
  '7-3': 'https://youtu.be/v_CBSKC3xfw?si=NPSewvA1NfZF0nGk',
  '7-4': 'https://youtu.be/hYpFvIpzask?si=Mhmu_WwxI_bpHUE0',
  '7-5': 'https://youtu.be/hHySWk2_Ix8?si=ooXuzwxZgg_XXYWr',
  '7-6': 'https://youtu.be/D-0f3e1SAt4?si=VdW5SCpvw7f7TCBO',
  '7-7': 'https://youtu.be/Vjk0sOlNt-I?si=jNQ_8wFadSmWddBL',
};

const buildCloudinaryAssetUrl = (resourceType, classId, order, extension) => {
  if (!CLOUDINARY_CLOUD_NAME || !classId || !order) return '';
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/aurum/curriculum/class${classId}/${classId}-${order}.${extension}`;
};

const buildJourneyAssets = (lesson) => {
  const classId = lesson.classId || lesson.gradeLevelId;
  const order = lesson.order;
  const assetKey = `${classId}-${order}`;
  const assetBase = classId && order ? `/assets/curriculum/class${classId}/${classId}-${order}` : '';
  const youtubeVideoUrl = YOUTUBE_VIDEO_URLS[assetKey] || '';
  const cloudinaryVideoUrl = buildCloudinaryAssetUrl('video', classId, order, 'mp4');
  const cloudinaryInfographicUrl = buildCloudinaryAssetUrl('image', classId, order, 'png');
  const existingVideoModules = Array.isArray(lesson.videoModules) ? lesson.videoModules : [];
  const existingVideoUrl = existingVideoModules.find((module) => module?.url)?.url;
  const introVideoUrl = lesson.introVideoUrl || cloudinaryVideoUrl || (assetBase ? `${assetBase}.mp4` : '');
  const learningVideoUrl = youtubeVideoUrl || existingVideoUrl || '';
  const infographicUrl = lesson.infographicUrl || lesson.assets?.infographicUrl || lesson.game?.assets?.infographicUrl || cloudinaryInfographicUrl || (assetBase ? `${assetBase}.webp` : '');
  const hasLearningVideoModule = existingVideoModules.some((module) => module?.url === learningVideoUrl);
  const learningVideoSource = learningVideoUrl === youtubeVideoUrl ? 'youtube' : 'existing';

  return {
    introVideoUrl,
    infographicUrl,
    assets: {
      ...(lesson.assets || {}),
      infographicUrl,
      introVideoUrl,
      journeyVideoUrl: introVideoUrl,
      youtubeVideoUrl,
      cloudinaryVideoUrl,
    },
    videoModules: learningVideoUrl && !hasLearningVideoModule
      ? [
        {
          id: `${lesson.id || lesson.lessonId}-learning-video`,
          title: 'Video bài giảng',
          url: learningVideoUrl,
          type: 'lesson',
          source: learningVideoSource,
        },
        ...existingVideoModules,
      ]
      : existingVideoModules,
  };
};

const rotateQuestion = (question, seed = 0) => {
  const options = [question.correct, ...question.distractors].slice(0, 4);
  const offset = seed % options.length;
  const rotated = [...options.slice(offset), ...options.slice(0, offset)];
  return {
    question: question.question,
    options: rotated,
    answer: rotated.indexOf(question.correct),
    explanation: question.explanation || question.correct,
  };
};

const toGameQuestion = (question, points) => ({
  type: 'multiple-choice',
  question: question.question,
  options: question.options,
  correctAnswer: question.answer,
  explanation: question.explanation,
  points,
});

const uniqueQuestions = (questions) => {
  const seen = new Set();
  return questions.filter((question) => {
    const key = question.question;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const makeConceptQuestion = (lesson, profile, concept, index) => rotateQuestion({
  question: `Trong bài "${normalizeTitle(lesson)}", nhận định nào đúng về "${concept[0]}"?`,
  correct: concept[1],
  distractors: profile.concepts
    .filter((_, conceptIndex) => conceptIndex !== index)
    .map((item) => item[1])
    .slice(0, 3),
  explanation: `${concept[0]}: ${concept[1]}`,
}, index + lesson.order);

const makeScenarioQuestion = (lesson, profile, index) => rotateQuestion({
  question: profile.scenario.question,
  correct: profile.scenario.correct,
  distractors: profile.scenario.distractors,
  explanation: profile.scenario.explanation,
}, index + lesson.order);

const makeDeepQuestion = (lesson, profile, index) => rotateQuestion({
  question: profile.deepQuestion.question,
  correct: profile.deepQuestion.correct,
  distractors: profile.deepQuestion.distractors,
  explanation: profile.deepQuestion.explanation,
}, index + lesson.order + 2);

const CLASS_67_PROFILES = {
  hoa6_kntt_bai2: {
    hook: 'Một nhóm học sinh chuẩn bị đun nóng ống nghiệm. Trước khi bắt đầu, cả nhóm phải kiểm tra kính bảo hộ, hướng miệng ống nghiệm và nhãn cảnh báo trên chai hóa chất. Đây là bước quyết định để thí nghiệm có kết quả và không gây nguy hiểm.',
    essentialQuestion: 'Làm thế nào để nhận ra rủi ro và chọn cách thao tác an toàn trước, trong và sau thí nghiệm?',
    keyMessage: 'An toàn phòng thực hành là một quy trình, không phải một lời nhắc chung chung. Muốn thao tác đúng, em cần đọc yêu cầu, nhận biết cảnh báo, dùng lượng hóa chất nhỏ, quan sát theo hướng dẫn và báo giáo viên ngay khi có sự cố.',
    concepts: [
      ['Quy tắc chung', 'Chỉ làm thí nghiệm khi có hướng dẫn, không đùa nghịch và không tự ý thay đổi thao tác', 'Nhóm có phiếu hướng dẫn, dụng cụ được kiểm tra trước khi dùng', 'Ưu tiên phòng tránh rủi ro hơn xử lí khi đã xảy ra sự cố'],
      ['Nhãn cảnh báo', 'Kí hiệu trên nhãn cho biết nguy cơ như dễ cháy, ăn mòn, độc hoặc dễ vỡ', 'Trên chai lọ có biểu tượng và chữ cảnh báo', 'Không suy đoán chất không màu là an toàn'],
      ['Thao tác hóa chất', 'Không nếm, không ngửi trực tiếp, không trộn tùy ý và chỉ dùng lượng vừa đủ', 'Dùng thìa, ống nhỏ giọt hoặc kẹp theo yêu cầu', 'Luôn hướng miệng ống nghiệm ra xa người'],
      ['Xử lí sự cố', 'Bình tĩnh báo giáo viên, rửa bằng nước sạch khi hóa chất dính vào da hoặc mắt', 'Có vỡ dụng cụ, đổ hóa chất, bốc khói hoặc cháy nhỏ', 'Không tự nhặt mảnh vỡ bằng tay trần'],
    ],
    mistakes: [
      'Nghĩ rằng hóa chất ít mùi là không nguy hiểm. Cần đọc nhãn và làm theo hướng dẫn.',
      'Ngửi trực tiếp miệng ống nghiệm. Nếu được phép nhận biết mùi, chỉ phẩy nhẹ hơi về phía mũi.',
      'Tự xử lí mảnh thủy tinh vỡ. Phải báo giáo viên và dùng dụng cụ thu gom phù hợp.',
    ],
    applications: [
      'Đọc nhãn dung dịch tẩy rửa trong gia đình để nhận biết cảnh báo ăn mòn hoặc kích ứng.',
      'Sắp xếp bàn học thực hành gọn, để nguồn nhiệt xa giấy, cồn và vật dễ cháy.',
      'Lập checklist an toàn trước khi làm một thí nghiệm quan sát đơn giản.',
    ],
    lab: {
      title: 'Lập phiếu kiểm tra an toàn trước thí nghiệm',
      steps: ['Ghi tên thí nghiệm và dụng cụ cần dùng', 'Đánh dấu nguy cơ: nhiệt, thủy tinh, hóa chất, điện', 'Viết một việc cần làm trước, trong và sau thí nghiệm', 'Đổi phiếu cho bạn để kiểm tra chéo'],
      safety: 'Chỉ dùng nhãn minh họa hoặc dụng cụ sạch, không mở chai hóa chất thật nếu chưa được giáo viên yêu cầu.',
      expected: 'Học sinh nêu được rủi ro chính và hành động phòng tránh tương ứng.',
    },
    scenario: {
      question: 'Một chai hóa chất có biểu tượng dễ cháy. Cách xử lí nào phù hợp nhất khi sử dụng?',
      correct: 'Để xa nguồn lửa, dùng lượng nhỏ, đậy nắp sau khi dùng và nghe hướng dẫn của giáo viên.',
      distractors: ['Hơ nóng trực tiếp để phản ứng nhanh hơn.', 'Mở nắp lâu để dễ lấy hóa chất.', 'Đưa sát mũi để kiểm tra mùi trước khi dùng.'],
      explanation: 'Chất dễ cháy phải tránh nguồn nhiệt và chỉ dùng theo hướng dẫn với lượng cần thiết.',
    },
    deepQuestion: {
      question: 'Vì sao phải kiểm tra dụng cụ thủy tinh trước khi đun nóng?',
      correct: 'Vì dụng cụ nứt có thể vỡ khi gặp nhiệt, gây bỏng hoặc bắn hóa chất.',
      distractors: ['Vì dụng cụ nứt giúp truyền nhiệt nhanh hơn.', 'Vì dụng cụ nứt làm hóa chất đổi màu rõ hơn.', 'Vì chỉ cần kiểm tra sau khi thí nghiệm xong.'],
      explanation: 'Vết nứt làm dụng cụ yếu, khi đun nóng dễ vỡ đột ngột.',
    },
  },
  hoa6_kntt_bai6: {
    hook: 'Khi làm bánh, chỉ cần cân lệch vài chục gam bột hoặc đường, sản phẩm có thể quá khô hoặc quá ngọt. Trong khoa học, đo khối lượng chính xác giúp kết luận đáng tin cậy hơn.',
    essentialQuestion: 'Muốn đo khối lượng đúng, em phải chọn cân, đặt mẫu và đọc kết quả như thế nào?',
    keyMessage: 'Đo khối lượng không chỉ là đặt vật lên cân. Em cần chọn cân phù hợp, chỉnh cân về 0, dùng đơn vị đúng, tránh làm bẩn đĩa cân và ghi kết quả theo độ chia của cân.',
    concepts: [
      ['Khối lượng', 'Cho biết lượng chất tạo nên vật, thường đo bằng gam hoặc kilogam', 'Kết quả đi kèm đơn vị g, kg, mg', 'Không nhầm khối lượng với thể tích hoặc kích thước'],
      ['Dụng cụ đo', 'Cân dùng để đo khối lượng, mỗi cân có giới hạn đo và độ chia nhỏ nhất', 'Trên cân có vạch, màn hình hoặc quả cân', 'Chọn cân có giới hạn đo lớn hơn khối lượng vật cần đo'],
      ['Hiệu chỉnh cân', 'Đưa cân về vạch 0 hoặc màn hình 0 trước khi đo', 'Kim cân lệch hoặc màn hình chưa về 0', 'Nếu không chỉnh 0, kết quả sẽ sai hệ thống'],
      ['Đọc và ghi kết quả', 'Đọc khi cân ổn định và ghi kèm đơn vị', 'Màn hình hoặc kim cân đứng yên', 'Không làm tròn tùy tiện vượt quá độ chia của cân'],
    ],
    mistakes: [
      'Quên chỉnh cân về 0 trước khi đặt vật lên cân.',
      'Ghi số đo nhưng bỏ quên đơn vị, làm kết quả mất ý nghĩa.',
      'Đặt vật ướt hoặc hóa chất trực tiếp lên đĩa cân, gây bẩn và sai số.',
    ],
    applications: [
      'Cân nguyên liệu khi nấu ăn hoặc pha chế để tỉ lệ ổn định.',
      'So sánh khối lượng vỏ chai trước và sau khi đựng nước để hiểu phần khối lượng tăng thêm.',
      'Ước lượng khối lượng đồ vật hằng ngày rồi kiểm tra bằng cân.',
    ],
    lab: {
      title: 'Đo khối lượng một vật nhỏ',
      steps: ['Chọn cân có giới hạn đo phù hợp', 'Kiểm tra cân ở vị trí bằng phẳng và chỉnh về 0', 'Đặt vật nhẹ nhàng lên giữa đĩa cân', 'Chờ số đo ổn định rồi ghi kết quả kèm đơn vị'],
      safety: 'Không cân vật nóng, vật ướt hoặc hóa chất trực tiếp trên cân nếu không có giấy/lọ đựng.',
      expected: 'Kết quả có số đo, đơn vị và ghi chú dụng cụ đã dùng.',
    },
    scenario: {
      question: 'Trước khi cân một mẫu bột, thao tác nào cần làm đầu tiên?',
      correct: 'Đặt cân trên mặt phẳng, kiểm tra và chỉnh cân về 0.',
      distractors: ['Đổ bột trực tiếp lên đĩa cân.', 'Đọc số trước khi đặt vật.', 'Chọn cân có giới hạn đo nhỏ hơn mẫu cần cân.'],
      explanation: 'Chỉnh 0 giúp loại sai số ban đầu của dụng cụ đo.',
    },
    deepQuestion: {
      question: 'Vì sao phải ghi đơn vị sau số đo khối lượng?',
      correct: 'Vì cùng một con số nhưng đơn vị khác nhau sẽ biểu thị lượng chất rất khác nhau.',
      distractors: ['Vì đơn vị chỉ dùng để trang trí báo cáo.', 'Vì không có đơn vị thì cân sẽ hỏng.', 'Vì mọi cân chỉ đo bằng một đơn vị duy nhất.'],
      explanation: '500 mg, 500 g và 500 kg là các khối lượng hoàn toàn khác nhau.',
    },
  },
  hoa6_kntt_bai8: {
    hook: 'Một cốc nước nhìn có vẻ ấm nhưng tay mỗi người cảm nhận khác nhau. Nhiệt kế giúp biến cảm giác thành số đo để so sánh khách quan.',
    essentialQuestion: 'Làm thế nào để đo nhiệt độ đúng mà không làm hỏng nhiệt kế hoặc gây nguy hiểm?',
    keyMessage: 'Nhiệt độ cho biết mức độ nóng lạnh của vật. Khi đo, em cần chọn nhiệt kế phù hợp, đặt bầu nhiệt kế tiếp xúc đúng vị trí, chờ số đo ổn định và đọc ngang tầm mắt.',
    concepts: [
      ['Nhiệt độ', 'Đại lượng cho biết vật nóng hay lạnh, thường dùng đơn vị độ C', 'Kết quả như 25 °C hoặc 80 °C', 'Không dùng tay để kết luận chính xác'],
      ['Nhiệt kế', 'Dụng cụ đo nhiệt độ, có giới hạn đo và độ chia nhỏ nhất', 'Có nhiệt kế y tế, nhiệt kế rượu, nhiệt kế điện tử', 'Chọn nhiệt kế theo khoảng nhiệt độ cần đo'],
      ['Cách đặt nhiệt kế', 'Bầu nhiệt kế phải tiếp xúc với vật hoặc chất cần đo', 'Bầu không chạm đáy cốc khi đo chất lỏng', 'Tránh làm vỡ nhiệt kế thủy tinh'],
      ['Đọc kết quả', 'Chờ cột chất lỏng hoặc màn hình ổn định rồi đọc ngang tầm mắt', 'Số đo không còn thay đổi nhanh', 'Ghi rõ đơn vị và điều kiện đo'],
    ],
    mistakes: [
      'Đọc số đo khi nhiệt kế chưa ổn định.',
      'Để bầu nhiệt kế chạm đáy cốc đang đun, làm số đo không đại diện cho chất lỏng.',
      'Nhầm cảm giác nóng lạnh của tay với số đo nhiệt độ.',
    ],
    applications: [
      'Đo nhiệt độ cơ thể bằng nhiệt kế y tế đúng cách.',
      'Theo dõi nhiệt độ nước khi pha sữa, pha trà hoặc làm thí nghiệm hòa tan.',
      'So sánh nhiệt độ trong bóng râm và ngoài nắng để hiểu ảnh hưởng môi trường.',
    ],
    lab: {
      title: 'Theo dõi nhiệt độ nước theo thời gian',
      steps: ['Chuẩn bị cốc nước ấm và nhiệt kế phù hợp', 'Đặt bầu nhiệt kế trong nước, không chạm đáy cốc', 'Ghi nhiệt độ ban đầu và sau mỗi 2 phút', 'Nhận xét xu hướng thay đổi nhiệt độ'],
      safety: 'Không dùng nước quá nóng; cầm nhiệt kế thủy tinh cẩn thận.',
      expected: 'Nhiệt độ nước ấm giảm dần khi truyền nhiệt ra môi trường.',
    },
    scenario: {
      question: 'Khi đo nhiệt độ nước trong cốc, cách đặt nhiệt kế nào đúng?',
      correct: 'Để bầu nhiệt kế ngập trong nước nhưng không chạm đáy hoặc thành cốc.',
      distractors: ['Đặt nhiệt kế sát đáy cốc để số tăng nhanh.', 'Chỉ đưa đầu trên của nhiệt kế vào nước.', 'Đọc ngay khi vừa nhúng nhiệt kế.'],
      explanation: 'Bầu nhiệt kế cần tiếp xúc với nước và chờ ổn định để số đo đại diện hơn.',
    },
    deepQuestion: {
      question: 'Vì sao cảm giác của tay không đủ để đo nhiệt độ chính xác?',
      correct: 'Vì cảm giác phụ thuộc vào cơ thể và môi trường trước đó, không cho số đo khách quan.',
      distractors: ['Vì tay không cảm nhận được nóng lạnh.', 'Vì nhiệt độ không thể đo bằng dụng cụ.', 'Vì mọi người luôn cảm nhận giống nhau.'],
      explanation: 'Nhiệt kế cho số đo có đơn vị nên có thể so sánh và ghi lại.',
    },
  },
  hoa6_kntt_bai9: {
    hook: 'Đường, muối, nước, sắt và nhựa đều là chất nhưng có tính chất khác nhau. Nhờ nhận biết tính chất, ta chọn được cách sử dụng và bảo quản phù hợp.',
    essentialQuestion: 'Dựa vào những dấu hiệu nào để phân biệt các chất và sử dụng chúng đúng mục đích?',
    keyMessage: 'Mỗi chất có một tập hợp tính chất. Tính chất vật lí có thể quan sát hoặc đo mà chưa tạo chất mới; tính chất hóa học thể hiện qua khả năng biến đổi thành chất khác.',
    concepts: [
      ['Chất', 'Thành phần tạo nên vật thể và có tính chất xác định', 'Nước, muối ăn, sắt, oxygen', 'Một vật thể có thể gồm nhiều chất'],
      ['Vật thể', 'Đồ vật, cơ thể hoặc đối tượng cụ thể được tạo từ chất', 'Cốc thủy tinh, dây đồng, viên đá', 'Không nhầm vật thể với chất tạo nên nó'],
      ['Tính chất vật lí', 'Màu, mùi, thể, nhiệt độ sôi, tính tan, dẫn điện, dẫn nhiệt', 'Quan sát hoặc đo mà không tạo chất mới', 'Có thể dùng để nhận biết và tách chất'],
      ['Tính chất hóa học', 'Khả năng cháy, bị gỉ, phân hủy hoặc phản ứng tạo chất mới', 'Xuất hiện chất mới, khí, kết tủa, màu mới', 'Cần làm thí nghiệm an toàn để kiểm chứng'],
    ],
    mistakes: [
      'Gọi chiếc cốc là chất. Cốc là vật thể, thủy tinh mới là chất tạo nên cốc.',
      'Cho rằng mọi thay đổi hình dạng đều là biến đổi hóa học.',
      'Chỉ dựa vào màu để nhận biết chất, trong khi nhiều chất có màu giống nhau.',
    ],
    applications: [
      'Chọn dây điện bằng kim loại vì kim loại dẫn điện tốt.',
      'Bảo quản muối và đường nơi khô ráo vì chúng dễ hút ẩm hoặc tan trong nước.',
      'Phân biệt bột mì và muối bằng tính tan, không nếm trực tiếp trong phòng thực hành.',
    ],
    lab: {
      title: 'Lập thẻ tính chất của một chất quen thuộc',
      steps: ['Chọn một chất an toàn như muối, đường hoặc nước', 'Ghi màu, thể, mùi, khả năng tan trong nước', 'Nêu một ứng dụng dựa trên tính chất đó', 'Chỉ ra thông tin nào cần đo bằng dụng cụ'],
      safety: 'Không nếm mẫu; chỉ dùng chất sạch được giáo viên cho phép.',
      expected: 'Thẻ mô tả được ít nhất ba tính chất và một ứng dụng liên quan.',
    },
    scenario: {
      question: 'Câu nào phân biệt đúng giữa vật thể và chất?',
      correct: 'Đinh sắt là vật thể, sắt là chất tạo nên đinh.',
      distractors: ['Sắt là vật thể, đinh sắt là chất.', 'Màu xám là một chất.', 'Khối lượng là một vật thể.'],
      explanation: 'Vật thể là đối tượng cụ thể; chất là thành phần tạo nên vật thể.',
    },
    deepQuestion: {
      question: 'Dấu hiệu nào thường cho thấy có biến đổi hóa học?',
      correct: 'Xuất hiện chất mới như khí, kết tủa, màu mới hoặc sự cháy.',
      distractors: ['Vật bị cắt nhỏ nhưng vẫn là chất ban đầu.', 'Nước đông thành đá rồi tan lại.', 'Muối được nghiền thành hạt nhỏ hơn.'],
      explanation: 'Biến đổi hóa học tạo chất mới, khác với thay đổi trạng thái hoặc kích thước.',
    },
  },
  hoa6_kntt_bai10: {
    hook: 'Một viên nước đá tan thành nước, nước đun sôi tạo hơi, hơi gặp nắp lạnh lại thành giọt. Cùng một chất có thể tồn tại ở nhiều thể khác nhau.',
    essentialQuestion: 'Khi chất chuyển thể, điều gì thay đổi và điều gì vẫn giữ nguyên?',
    keyMessage: 'Sự chuyển thể là biến đổi vật lí: chất vẫn là chất ban đầu nhưng trạng thái và cách sắp xếp các hạt thay đổi. Nhiệt độ và điều kiện môi trường ảnh hưởng mạnh đến quá trình này.',
    concepts: [
      ['Thể rắn', 'Có hình dạng và thể tích gần như xác định', 'Đá, muối hạt, kim loại', 'Các hạt sắp xếp chặt chẽ hơn'],
      ['Thể lỏng', 'Có thể tích xác định nhưng hình dạng theo bình chứa', 'Nước, dầu ăn, cồn', 'Mặt thoáng chất lỏng thường nằm ngang'],
      ['Thể khí', 'Không có hình dạng và thể tích xác định, lan ra khắp bình chứa', 'Hơi nước, không khí, oxygen', 'Khó nhìn thấy nếu khí không màu'],
      ['Chuyển thể', 'Nóng chảy, đông đặc, bay hơi, sôi, ngưng tụ là các quá trình chuyển trạng thái', 'Đá tan, nước sôi, hơi nước đọng giọt', 'Thường không tạo chất mới'],
    ],
    mistakes: [
      'Nghĩ nước đá tan là tạo chất mới. Thực ra vẫn là nước.',
      'Nhầm bay hơi và sôi: bay hơi có thể xảy ra ở mặt thoáng, sôi xảy ra trong toàn bộ chất lỏng ở nhiệt độ sôi.',
      'Cho rằng chỉ đun nóng mới có chuyển thể; làm lạnh cũng gây đông đặc hoặc ngưng tụ.',
    ],
    applications: [
      'Phơi quần áo dựa vào sự bay hơi của nước.',
      'Làm đá trong tủ lạnh dựa vào sự đông đặc.',
      'Quan sát giọt nước trên thành cốc lạnh để nhận biết hơi nước ngưng tụ.',
    ],
    lab: {
      title: 'Quan sát vòng chuyển thể của nước',
      steps: ['Quan sát đá đang tan ở nhiệt độ phòng', 'Ghi hiện tượng khi đun nước ấm dưới sự giám sát', 'Đặt nắp lạnh phía trên để quan sát giọt nước ngưng tụ', 'Vẽ sơ đồ rắn -> lỏng -> khí -> lỏng'],
      safety: 'Không tự đun nước nếu không có giáo viên; tránh hơi nóng và nước nóng.',
      expected: 'Học sinh mô tả được chuyển thể và khẳng định chất vẫn là nước.',
    },
    scenario: {
      question: 'Hiện tượng nào là sự ngưng tụ?',
      correct: 'Hơi nước gặp mặt kính lạnh tạo thành giọt nước.',
      distractors: ['Đá tan thành nước.', 'Nước trong khay đông thành đá.', 'Muối tan trong nước.'],
      explanation: 'Ngưng tụ là quá trình chất khí chuyển thành chất lỏng.',
    },
    deepQuestion: {
      question: 'Vì sao sự chuyển thể thường được xem là biến đổi vật lí?',
      correct: 'Vì chất ban đầu không biến thành chất mới, chỉ thay đổi trạng thái.',
      distractors: ['Vì luôn tạo ra khí mới.', 'Vì luôn làm chất biến mất hoàn toàn.', 'Vì không phụ thuộc vào nhiệt độ.'],
      explanation: 'Trong chuyển thể của nước, H2O vẫn là H2O ở rắn, lỏng hoặc khí.',
    },
  },
  hoa6_kntt_bai11: {
    hook: 'Ngọn nến tắt khi bị úp cốc kín, còn con người cần hít thở liên tục. Cả hai hiện tượng đều liên quan đến oxygen trong không khí.',
    essentialQuestion: 'Oxygen có vai trò gì và vì sao không khí được xem là một hỗn hợp quan trọng?',
    keyMessage: 'Oxygen duy trì sự sống và sự cháy, nhưng không khí không phải oxygen tinh khiết. Không khí là hỗn hợp gồm nitrogen, oxygen, carbon dioxide, hơi nước và một số khí khác.',
    concepts: [
      ['Oxygen', 'Khí cần cho hô hấp và duy trì sự cháy', 'Nến cháy được khi có đủ oxygen', 'Oxygen không phải là chất cháy mà là chất duy trì sự cháy'],
      ['Không khí', 'Hỗn hợp nhiều khí bao quanh Trái Đất', 'Có nitrogen, oxygen, carbon dioxide, hơi nước', 'Thành phần có thể thay đổi theo môi trường'],
      ['Sự cháy', 'Quá trình cần chất cháy, oxygen và nguồn nhiệt thích hợp', 'Ngọn lửa tắt khi thiếu oxygen hoặc bị làm lạnh', 'Không dùng nước cho mọi đám cháy hóa chất'],
      ['Ô nhiễm không khí', 'Không khí chứa bụi, khói hoặc khí độc vượt mức an toàn', 'Có mùi khét, bụi mịn, khói xe, khói đốt rác', 'Cần giảm phát thải và tăng cây xanh'],
    ],
    mistakes: [
      'Nghĩ oxygen là chất cháy. Oxygen giúp chất khác cháy mạnh hơn.',
      'Cho rằng không khí chỉ gồm oxygen.',
      'Đốt rác hoặc nhiên liệu trong phòng kín vì nghĩ vẫn còn không khí.',
    ],
    applications: [
      'Thông gió phòng học và phòng bếp để giảm tích tụ khí độc.',
      'Không che kín lỗ thông gió của bếp than, bếp gas hoặc thiết bị đốt.',
      'Trồng cây và hạn chế đốt rác để góp phần bảo vệ không khí.',
    ],
    lab: {
      title: 'Quan sát vai trò của không khí đối với sự cháy',
      steps: ['Thắp nến dưới sự giám sát của giáo viên', 'Úp cốc thủy tinh lên nến', 'Quan sát thời gian nến tắt', 'Giải thích bằng vai trò của oxygen'],
      safety: 'Chỉ làm khi có giáo viên, tránh chạm vào cốc nóng và ngọn lửa.',
      expected: 'Nến tắt khi oxygen trong cốc giảm xuống không đủ duy trì sự cháy.',
    },
    scenario: {
      question: 'Vì sao nến đang cháy có thể tắt khi bị úp cốc kín?',
      correct: 'Vì lượng oxygen trong cốc giảm dần, không đủ duy trì sự cháy.',
      distractors: ['Vì cốc làm nến lạnh ngay lập tức.', 'Vì nitrogen là chất cháy mạnh.', 'Vì không khí biến thành nước.'],
      explanation: 'Sự cháy cần oxygen; khi oxygen giảm, ngọn lửa tắt.',
    },
    deepQuestion: {
      question: 'Nhận định nào đúng về không khí?',
      correct: 'Không khí là hỗn hợp nhiều khí, trong đó có oxygen.',
      distractors: ['Không khí là oxygen tinh khiết.', 'Không khí là một nguyên tố hóa học.', 'Không khí không có vai trò với sự sống.'],
      explanation: 'Không khí gồm nhiều khí với thành phần chính là nitrogen và oxygen.',
    },
  },
  hoa6_kntt_bai12: {
    hook: 'Một chiếc ghế có thể làm từ gỗ, nhựa hoặc kim loại. Chọn vật liệu đúng giúp đồ vật bền, an toàn và ít lãng phí hơn.',
    essentialQuestion: 'Dựa vào tính chất nào để chọn vật liệu phù hợp cho từng mục đích sử dụng?',
    keyMessage: 'Vật liệu được chọn dựa trên độ bền, khối lượng, khả năng dẫn nhiệt, dẫn điện, chống ăn mòn, tính dễ gia công và tác động đến môi trường.',
    concepts: [
      ['Vật liệu', 'Chất hoặc hỗn hợp chất dùng để làm đồ vật, công trình, dụng cụ', 'Gỗ, nhựa, kim loại, thủy tinh, cao su', 'Một sản phẩm có thể gồm nhiều vật liệu'],
      ['Tính chất vật liệu', 'Độ cứng, độ dẻo, dẫn nhiệt, dẫn điện, bền với nước hoặc hóa chất', 'Quan sát qua cách vật liệu chịu lực, nóng, điện, nước', 'Tính chất quyết định ứng dụng'],
      ['Chọn vật liệu', 'Phải phù hợp công dụng, an toàn và chi phí', 'Nồi cần dẫn nhiệt, vỏ dây điện cần cách điện', 'Không có vật liệu tốt nhất cho mọi mục đích'],
      ['Sử dụng bền vững', 'Dùng tiết kiệm, tái sử dụng, tái chế và xử lí rác đúng cách', 'Giảm đồ nhựa dùng một lần', 'Cần cân nhắc vòng đời sản phẩm'],
    ],
    mistakes: [
      'Chọn vật liệu chỉ vì đẹp mà bỏ qua an toàn và độ bền.',
      'Nghĩ nhựa nào cũng giống nhau, trong khi mỗi loại có tính chất và cách tái chế khác nhau.',
      'Bỏ qua tác động môi trường khi dùng vật liệu một lần.',
    ],
    applications: [
      'Chọn bình nước cá nhân bền, dễ vệ sinh và dùng nhiều lần.',
      'Giải thích vì sao tay cầm nồi thường làm bằng nhựa hoặc gỗ.',
      'Phân loại rác tái chế như giấy, nhựa, kim loại.',
    ],
    lab: {
      title: 'So sánh vật liệu làm tay cầm dụng cụ',
      steps: ['Chọn mẫu gỗ, nhựa, kim loại hoặc hình ảnh minh họa', 'So sánh độ cứng, khối lượng, dẫn nhiệt, độ bền nước', 'Ghi ưu điểm và hạn chế', 'Đề xuất vật liệu phù hợp cho tay cầm nồi'],
      safety: 'Không thử dẫn điện hoặc đốt vật liệu; chỉ quan sát mẫu an toàn.',
      expected: 'Học sinh giải thích được vì sao vật liệu cách nhiệt phù hợp làm tay cầm.',
    },
    scenario: {
      question: 'Vật liệu nào thường phù hợp để làm lõi dây điện?',
      correct: 'Kim loại dẫn điện tốt như đồng hoặc nhôm.',
      distractors: ['Cao su vì dẫn điện mạnh.', 'Gỗ khô vì dẫn điện tốt.', 'Thủy tinh vì mềm và dễ kéo sợi điện.'],
      explanation: 'Lõi dây cần vật liệu dẫn điện, còn vỏ dây cần vật liệu cách điện.',
    },
    deepQuestion: {
      question: 'Vì sao không nên nói một vật liệu là tốt nhất cho mọi sản phẩm?',
      correct: 'Vì mỗi sản phẩm cần những tính chất khác nhau như bền, nhẹ, dẫn nhiệt hoặc cách điện.',
      distractors: ['Vì mọi vật liệu đều có tính chất giống nhau.', 'Vì tính chất vật liệu không ảnh hưởng đến ứng dụng.', 'Vì chỉ màu sắc mới quan trọng.'],
      explanation: 'Chọn vật liệu luôn gắn với mục đích sử dụng cụ thể.',
    },
  },
  hoa6_kntt_bai13: {
    hook: 'Cát, đá vôi, quặng sắt, dầu mỏ hay gỗ đều có thể trở thành đầu vào để sản xuất đồ dùng. Trước khi thành sản phẩm, chúng là nguyên liệu.',
    essentialQuestion: 'Nguyên liệu khác vật liệu thế nào và vì sao cần khai thác, sử dụng nguyên liệu hợp lí?',
    keyMessage: 'Nguyên liệu là nguồn đầu vào để sản xuất vật liệu hoặc sản phẩm. Nhiều nguyên liệu trong tự nhiên có giới hạn, nên cần khai thác có kế hoạch, tiết kiệm và tái chế.',
    concepts: [
      ['Nguyên liệu', 'Nguồn chất ban đầu dùng để sản xuất vật liệu, nhiên liệu hoặc sản phẩm', 'Quặng sắt, đá vôi, cát, dầu mỏ, gỗ', 'Nguyên liệu có thể cần chế biến trước khi dùng'],
      ['Nguồn tự nhiên', 'Nguyên liệu lấy từ khoáng sản, sinh vật, nước, không khí hoặc đất', 'Mỏ đá, mỏ quặng, rừng trồng', 'Không phải nguồn nào cũng tái tạo nhanh'],
      ['Chế biến', 'Biến nguyên liệu thành vật liệu hoặc sản phẩm có ích', 'Quặng sắt -> kim loại sắt; cát -> thủy tinh', 'Cần năng lượng và có thể phát sinh chất thải'],
      ['Sử dụng hợp lí', 'Tiết kiệm, thay thế, tái chế và phục hồi môi trường sau khai thác', 'Thu gom giấy, kim loại, nhựa để tái chế', 'Khai thác quá mức gây cạn kiệt và ô nhiễm'],
    ],
    mistakes: [
      'Nhầm nguyên liệu với sản phẩm hoàn chỉnh.',
      'Nghĩ tài nguyên thiên nhiên luôn vô hạn.',
      'Chỉ quan tâm giá rẻ mà không xét tác động môi trường khi khai thác.',
    ],
    applications: [
      'Tái chế giấy để giảm nhu cầu dùng gỗ mới.',
      'Dùng đồ kim loại bền lâu và thu gom phế liệu đúng nơi.',
      'Tìm hiểu nguồn gốc nguyên liệu của một sản phẩm trong nhà.',
    ],
    lab: {
      title: 'Truy vết nguyên liệu của một đồ vật',
      steps: ['Chọn một đồ vật như chai thủy tinh, lon nhôm hoặc ghế gỗ', 'Ghi vật liệu chính của đồ vật', 'Suy luận nguyên liệu ban đầu', 'Đề xuất cách dùng hoặc tái chế hợp lí'],
      safety: 'Không tháo đồ vật sắc nhọn hoặc thiết bị điện; chỉ quan sát và ghi chép.',
      expected: 'Học sinh nêu được chuỗi nguyên liệu -> vật liệu -> sản phẩm.',
    },
    scenario: {
      question: 'Cặp nào thể hiện đúng nguyên liệu và sản phẩm/vật liệu tạo ra?',
      correct: 'Cát có thể dùng để sản xuất thủy tinh.',
      distractors: ['Thủy tinh dùng để sản xuất cát tự nhiên.', 'Quặng sắt là sản phẩm nhựa.', 'Gỗ luôn được tạo ra từ kim loại.'],
      explanation: 'Cát chứa thành phần dùng trong sản xuất thủy tinh.',
    },
    deepQuestion: {
      question: 'Vì sao cần tái chế nguyên liệu và vật liệu?',
      correct: 'Để giảm khai thác tài nguyên mới, tiết kiệm năng lượng và giảm rác thải.',
      distractors: ['Để làm tài nguyên cạn nhanh hơn.', 'Vì tái chế luôn làm chất độc hơn.', 'Vì nguyên liệu tự nhiên không bao giờ hết.'],
      explanation: 'Tái chế giúp kéo dài vòng đời vật liệu và giảm áp lực môi trường.',
    },
  },
  hoa6_kntt_bai14: {
    hook: 'Bếp gas, than, xăng và cồn đều cung cấp năng lượng khi cháy. Tuy nhiên, dùng nhiên liệu sai cách có thể gây cháy nổ hoặc ô nhiễm.',
    essentialQuestion: 'Nhiên liệu tạo năng lượng như thế nào và cần dùng ra sao để an toàn, tiết kiệm?',
    keyMessage: 'Nhiên liệu là chất khi cháy tỏa nhiệt và có thể dùng để đun nấu, sưởi ấm, phát điện hoặc vận hành động cơ. Sử dụng nhiên liệu phải đi kèm thông gió, kiểm soát nguồn lửa và giảm phát thải.',
    concepts: [
      ['Nhiên liệu', 'Chất cháy được và tỏa năng lượng khi cháy', 'Than, củi, xăng, dầu, khí gas, cồn', 'Không phải chất nào cháy được cũng an toàn để dùng'],
      ['Sự cháy của nhiên liệu', 'Cần nhiên liệu, oxygen và nguồn nhiệt thích hợp', 'Có ngọn lửa, nhiệt, ánh sáng, khói hoặc khí sinh ra', 'Thiếu oxygen có thể tạo khí độc'],
      ['Hiệu quả sử dụng', 'Dùng lượng nhiên liệu vừa đủ để đạt mục đích', 'Bếp xanh lửa, nồi có nắp, thiết bị bảo dưỡng tốt', 'Lãng phí nhiên liệu làm tăng chi phí và ô nhiễm'],
      ['An toàn nhiên liệu', 'Bảo quản xa nguồn nhiệt, tránh rò rỉ và dùng nơi thông thoáng', 'Có mùi gas, bình chứa, dây dẫn', 'Không bật lửa khi nghi rò gas'],
    ],
    mistakes: [
      'Dùng bếp than trong phòng kín, có nguy cơ ngộ độc khí.',
      'Đổ thêm cồn khi ngọn lửa chưa tắt hoàn toàn.',
      'Nghĩ đốt nhiều nhiên liệu luôn tốt hơn, trong khi có thể gây lãng phí và ô nhiễm.',
    ],
    applications: [
      'Tắt thiết bị khi không dùng để tiết kiệm nhiên liệu và điện năng.',
      'Kiểm tra mùi gas và khóa van sau khi nấu.',
      'Ưu tiên đi bộ, xe đạp hoặc phương tiện công cộng khi phù hợp.',
    ],
    lab: {
      title: 'Phân tích cách dùng nhiên liệu trong gia đình',
      steps: ['Liệt kê các thiết bị dùng nhiên liệu hoặc điện', 'Ghi nguồn năng lượng của từng thiết bị', 'Nêu một rủi ro an toàn', 'Đề xuất một cách tiết kiệm hoặc giảm ô nhiễm'],
      safety: 'Không tự kiểm tra bình gas hoặc thiết bị cháy; chỉ quan sát dưới sự hướng dẫn của người lớn.',
      expected: 'Học sinh liên hệ được nhiên liệu với năng lượng, an toàn và môi trường.',
    },
    scenario: {
      question: 'Khi ngửi thấy mùi gas trong bếp, việc nào nên làm trước?',
      correct: 'Khóa van gas, mở cửa thông thoáng và báo người lớn, không bật lửa hoặc công tắc điện.',
      distractors: ['Bật bếp để kiểm tra gas có cháy không.', 'Đóng kín cửa để mùi không bay ra.', 'Dùng diêm soi gần bình gas.'],
      explanation: 'Rò gas có nguy cơ cháy nổ, cần loại nguồn lửa và thông gió ngay.',
    },
    deepQuestion: {
      question: 'Vì sao dùng nhiên liệu hóa thạch quá mức gây hại môi trường?',
      correct: 'Vì khi đốt có thể tạo khí thải và bụi, góp phần ô nhiễm không khí và biến đổi khí hậu.',
      distractors: ['Vì nhiên liệu hóa thạch không cháy được.', 'Vì đốt nhiên liệu không sinh ra chất nào.', 'Vì càng nhiều khói thì không khí càng sạch.'],
      explanation: 'Sản phẩm cháy và tạp chất trong nhiên liệu có thể gây ô nhiễm.',
    },
  },
  hoa6_kntt_bai15: {
    hook: 'Một bữa ăn chỉ có nước ngọt và bánh kẹo có thể làm no tạm thời nhưng không đủ chất. Khoa học giúp ta hiểu vai trò của từng nhóm lương thực, thực phẩm.',
    essentialQuestion: 'Làm thế nào để chọn, bảo quản và sử dụng lương thực, thực phẩm an toàn, cân đối?',
    keyMessage: 'Lương thực và thực phẩm cung cấp năng lượng, chất xây dựng cơ thể, vitamin, khoáng chất và nước. Chế độ ăn hợp lí cần đa dạng, sạch, an toàn và phù hợp nhu cầu.',
    concepts: [
      ['Lương thực', 'Thực phẩm giàu tinh bột, thường là nguồn năng lượng chính', 'Gạo, ngô, khoai, mì', 'Không nên chỉ ăn một nhóm lương thực'],
      ['Thực phẩm', 'Nguồn thức ăn cung cấp nhiều chất dinh dưỡng khác nhau', 'Thịt, cá, trứng, sữa, rau, quả, đậu', 'Cần chọn thực phẩm tươi, sạch, rõ nguồn gốc'],
      ['Nhóm dinh dưỡng', 'Tinh bột, chất đạm, chất béo, vitamin, khoáng chất và nước có vai trò khác nhau', 'Bữa ăn có cơm, rau, đạm, chất béo vừa đủ', 'Thiếu hoặc thừa đều ảnh hưởng sức khỏe'],
      ['An toàn thực phẩm', 'Bảo quản, chế biến và sử dụng đúng cách để tránh hư hỏng, nhiễm khuẩn', 'Mùi lạ, mốc, đổi màu là dấu hiệu nguy cơ', 'Không ăn thực phẩm quá hạn hoặc mốc'],
    ],
    mistakes: [
      'Bỏ bữa sáng hoặc thay bữa chính bằng đồ ngọt.',
      'Ăn thực phẩm mốc sau khi cắt bỏ phần mốc nhìn thấy.',
      'Cho rằng thực phẩm càng đắt thì luôn càng phù hợp.',
    ],
    applications: [
      'Đọc hạn sử dụng và điều kiện bảo quản trên bao bì.',
      'Xây dựng một bữa ăn có đủ lương thực, rau quả và nguồn đạm.',
      'Rửa tay, rửa rau quả và tách thực phẩm sống với chín khi chế biến.',
    ],
    lab: {
      title: 'Thiết kế bữa ăn cân đối',
      steps: ['Chọn một bữa ăn trong ngày', 'Liệt kê món ăn và nhóm dinh dưỡng chính', 'Kiểm tra có rau/quả và nguồn đạm hay chưa', 'Đề xuất một điều chỉnh để cân đối hơn'],
      safety: 'Không nếm thực phẩm lạ hoặc đã hỏng; chỉ phân tích từ thông tin an toàn.',
      expected: 'Bữa ăn đề xuất có đủ nhóm chất và lưu ý vệ sinh thực phẩm.',
    },
    scenario: {
      question: 'Dấu hiệu nào cho thấy thực phẩm có thể không an toàn?',
      correct: 'Có mùi lạ, mốc, đổi màu hoặc quá hạn sử dụng.',
      distractors: ['Bao bì có ghi rõ hạn sử dụng còn xa.', 'Thực phẩm được bảo quản đúng hướng dẫn.', 'Rau quả được rửa sạch trước khi ăn.'],
      explanation: 'Mùi lạ, mốc, đổi màu hoặc quá hạn là dấu hiệu cần loại bỏ.',
    },
    deepQuestion: {
      question: 'Vì sao bữa ăn cần đa dạng nhóm thực phẩm?',
      correct: 'Vì mỗi nhóm cung cấp chất dinh dưỡng khác nhau cho năng lượng, xây dựng cơ thể và bảo vệ sức khỏe.',
      distractors: ['Vì mọi thực phẩm có thành phần giống nhau.', 'Vì chỉ tinh bột là cần thiết.', 'Vì vitamin có thể thay thế hoàn toàn nước.'],
      explanation: 'Cơ thể cần nhiều nhóm chất với vai trò khác nhau.',
    },
  },
  hoa6_kntt_bai16: {
    hook: 'Nước muối trong suốt, nước cam có tép, còn cát trộn sỏi nhìn thấy từng phần. Tất cả đều là hỗn hợp nhưng không giống nhau.',
    essentialQuestion: 'Làm thế nào nhận biết hỗn hợp, dung dịch và các thành phần trong hỗn hợp?',
    keyMessage: 'Hỗn hợp gồm hai hay nhiều chất trộn lẫn. Hỗn hợp đồng nhất có thành phần phân bố đều như dung dịch; hỗn hợp không đồng nhất có thể nhìn thấy hoặc phân biệt các phần.',
    concepts: [
      ['Hỗn hợp', 'Gồm từ hai chất trở lên trộn lẫn với nhau', 'Không khí, nước muối, cát lẫn sỏi', 'Thành phần có thể thay đổi theo tỉ lệ trộn'],
      ['Hỗn hợp đồng nhất', 'Thành phần phân bố đều, nhìn như một pha', 'Nước muối, nước đường, không khí sạch', 'Không dễ phân biệt thành phần bằng mắt thường'],
      ['Hỗn hợp không đồng nhất', 'Thành phần phân bố không đều hoặc nhìn thấy các phần khác nhau', 'Nước cam có tép, dầu và nước, cát lẫn sỏi', 'Có thể tách bằng phương pháp vật lí phù hợp'],
      ['Dung dịch', 'Hỗn hợp đồng nhất gồm dung môi và chất tan', 'Muối tan trong nước tạo nước muối', 'Không phải mọi chất đều tan tốt trong nước'],
    ],
    mistakes: [
      'Nghĩ dung dịch luôn có màu. Nhiều dung dịch trong suốt như nước muối.',
      'Gọi mọi hỗn hợp là dung dịch, kể cả dầu trộn nước.',
      'Cho rằng tỉ lệ thành phần của hỗn hợp luôn cố định như hợp chất.',
    ],
    applications: [
      'Pha nước chanh, nước muối sinh lí hoặc dung dịch đường đúng tỉ lệ.',
      'Nhận biết hỗn hợp không đồng nhất trong thực phẩm như nước cam có tép.',
      'Chọn cách tách sơ bộ rác, sỏi, cát dựa vào kích thước và tính tan.',
    ],
    lab: {
      title: 'So sánh ba hỗn hợp quen thuộc',
      steps: ['Chuẩn bị nước muối, cát trong nước và dầu ăn với nước', 'Quan sát bằng mắt thường sau khi khuấy', 'Phân loại đồng nhất hoặc không đồng nhất', 'Giải thích bằng sự phân bố thành phần'],
      safety: 'Không nếm dung dịch trong thí nghiệm; lau sạch dầu hoặc nước đổ ra bàn.',
      expected: 'Học sinh phân biệt được dung dịch với hỗn hợp không đồng nhất.',
    },
    scenario: {
      question: 'Mẫu nào là dung dịch?',
      correct: 'Nước muối trong suốt sau khi muối tan hoàn toàn.',
      distractors: ['Dầu ăn nổi trên nước.', 'Cát khuấy trong nước.', 'Hỗn hợp sỏi và cát khô.'],
      explanation: 'Dung dịch là hỗn hợp đồng nhất gồm chất tan phân bố đều trong dung môi.',
    },
    deepQuestion: {
      question: 'Vì sao không khí được xem là hỗn hợp?',
      correct: 'Vì không khí gồm nhiều khí trộn lẫn, thành phần có thể thay đổi.',
      distractors: ['Vì không khí chỉ có một chất duy nhất.', 'Vì không khí luôn nhìn thấy từng lớp khí.', 'Vì mọi hỗn hợp đều phải là chất lỏng.'],
      explanation: 'Không khí gồm nitrogen, oxygen, carbon dioxide, hơi nước và các khí khác.',
    },
  },
  hoa6_kntt_bai17: {
    hook: 'Muốn lấy muối từ nước biển, không thể dùng tay nhặt từng hạt muối trong nước. Ta phải dựa vào sự khác nhau về tính chất để tách chất.',
    essentialQuestion: 'Chọn phương pháp tách chất như thế nào cho phù hợp với từng hỗn hợp?',
    keyMessage: 'Tách chất khỏi hỗn hợp dựa trên khác nhau về kích thước hạt, tính tan, khối lượng riêng, nhiệt độ sôi hoặc khả năng bay hơi. Cần xác định mục tiêu tách trước khi chọn phương pháp.',
    concepts: [
      ['Lọc', 'Tách chất rắn không tan khỏi chất lỏng bằng giấy lọc hoặc màng lọc', 'Cát trong nước được giữ trên giấy lọc', 'Không tách được muối đã tan trong nước'],
      ['Lắng và gạn', 'Dựa vào khối lượng riêng hoặc sự phân lớp để tách phần trên/phần dưới', 'Bùn lắng xuống, dầu nổi trên nước', 'Cần thao tác chậm để không trộn lại'],
      ['Cô cạn', 'Làm bay hơi dung môi để thu chất rắn hòa tan', 'Thu muối từ nước muối', 'Cần kiểm soát nhiệt và tránh bắn dung dịch'],
      ['Chiết/tách lớp', 'Tách các chất lỏng không tan vào nhau và phân lớp', 'Dầu ăn và nước', 'Dựa vào lớp trên, lớp dưới và dụng cụ phù hợp'],
    ],
    mistakes: [
      'Dùng lọc để tách muối đã tan trong nước.',
      'Gạn quá nhanh làm cặn bị cuốn theo phần nước trong.',
      'Không xác định cần thu chất nào nên chọn phương pháp sai.',
    ],
    applications: [
      'Lọc bã trà hoặc bã cà phê khỏi nước.',
      'Để nước bùn lắng rồi gạn lấy phần nước trong hơn trước khi lọc.',
      'Làm muối từ nước biển bằng bay hơi nước dưới nắng.',
    ],
    lab: {
      title: 'Thiết kế quy trình tách cát và muối',
      steps: ['Hòa hỗn hợp cát và muối vào nước', 'Lọc để giữ cát trên giấy lọc', 'Cô cạn phần nước lọc để thu muối', 'Ghi rõ tính chất được dùng ở mỗi bước'],
      safety: 'Cô cạn chỉ thực hiện dưới sự giám sát; tránh nước nóng và dụng cụ nóng.',
      expected: 'Quy trình dùng tính tan của muối, tính không tan của cát và sự bay hơi của nước.',
    },
    scenario: {
      question: 'Muốn tách cát không tan ra khỏi nước, phương pháp nào phù hợp nhất?',
      correct: 'Lọc qua giấy lọc hoặc vật liệu lọc phù hợp.',
      distractors: ['Cô cạn để thu cát tan.', 'Dùng nam châm hút cát.', 'Lắc mạnh để cát biến mất.'],
      explanation: 'Cát không tan và có hạt lớn hơn lỗ lọc nên có thể bị giữ lại.',
    },
    deepQuestion: {
      question: 'Vì sao cô cạn tách được muối khỏi nước muối?',
      correct: 'Vì nước bay hơi còn muối hòa tan không bay hơi theo trong điều kiện đó.',
      distractors: ['Vì muối biến thành nước.', 'Vì giấy lọc giữ được ion muối trong dung dịch.', 'Vì nước muối là chất tinh khiết.'],
      explanation: 'Cô cạn dựa vào sự bay hơi của dung môi để thu chất tan rắn.',
    },
  },
  hoa7_kntt_bai1: {
    hook: 'Khi thấy đường tan nhanh hơn trong nước nóng, nhà khoa học không dừng ở câu “vì nó nóng”. Họ đặt câu hỏi, dự đoán, thiết kế kiểm chứng và dùng dữ liệu để kết luận.',
    essentialQuestion: 'Một câu hỏi khoa học cần được kiểm chứng bằng kế hoạch và dữ liệu như thế nào?',
    keyMessage: 'Học Khoa học tự nhiên cần quy trình: quan sát, đặt câu hỏi, giả thuyết, lập kế hoạch, thực hiện, xử lí dữ liệu và báo cáo. Kết luận tốt phải dựa trên bằng chứng.',
    concepts: [
      ['Quan sát', 'Thu thập thông tin bằng giác quan và dụng cụ đo', 'Ghi hiện tượng, số đo, màu, nhiệt độ, thời gian', 'Quan sát cần trung thực, không thêm suy đoán'],
      ['Câu hỏi khoa học', 'Câu hỏi cụ thể và có thể kiểm chứng', 'Nhiệt độ ảnh hưởng thế nào đến thời gian hòa tan?', 'Tránh câu quá rộng hoặc không đo được'],
      ['Giả thuyết', 'Dự đoán có căn cứ trước khi kiểm chứng', 'Nếu tăng nhiệt độ thì đường tan nhanh hơn', 'Giả thuyết có thể đúng hoặc sai sau thí nghiệm'],
      ['Dữ liệu và báo cáo', 'Số liệu, bảng, biểu đồ và kết luận trình bày rõ ràng', 'Bảng thời gian tan ở các nhiệt độ', 'Ghi đơn vị và điều kiện thí nghiệm'],
    ],
    mistakes: [
      'Kết luận theo cảm giác mà không có số liệu.',
      'Thay đổi nhiều yếu tố cùng lúc nên không biết yếu tố nào gây ra kết quả.',
      'Báo cáo chỉ ghi kết luận mà không ghi cách làm và dữ liệu.',
    ],
    applications: [
      'Thiết kế kiểm chứng yếu tố ảnh hưởng đến tốc độ tan của đường.',
      'Dùng bảng để ghi dữ liệu khi quan sát sự bay hơi của nước.',
      'Đọc biểu đồ đơn giản để rút ra xu hướng.',
    ],
    lab: {
      title: 'Thiết kế thí nghiệm công bằng',
      steps: ['Chọn câu hỏi về tốc độ tan', 'Xác định một biến thay đổi', 'Giữ các yếu tố còn lại giống nhau', 'Lập bảng ghi kết quả và dự kiến cách kết luận'],
      safety: 'Không dùng nước quá nóng; đo nhiệt độ và thời gian theo hướng dẫn.',
      expected: 'Kế hoạch nêu được biến thay đổi, biến giữ nguyên và dữ liệu cần thu.',
    },
    scenario: {
      question: 'Câu hỏi nào có thể kiểm chứng bằng thí nghiệm công bằng?',
      correct: 'Nhiệt độ nước ảnh hưởng thế nào đến thời gian hòa tan cùng một lượng đường?',
      distractors: ['Vì sao mọi thứ trong tự nhiên đều thú vị?', 'Đường có ngon hơn muối không?', 'Nước nào đẹp nhất?'],
      explanation: 'Câu hỏi khoa học cần cụ thể và có đại lượng có thể quan sát hoặc đo.',
    },
    deepQuestion: {
      question: 'Vì sao trong thí nghiệm công bằng chỉ nên thay đổi một yếu tố chính?',
      correct: 'Để biết yếu tố đó có thực sự ảnh hưởng đến kết quả hay không.',
      distractors: ['Để thí nghiệm có nhiều lỗi hơn.', 'Để không cần ghi dữ liệu.', 'Để kết quả luôn giống giả thuyết.'],
      explanation: 'Giữ các yếu tố khác không đổi giúp kết luận đáng tin cậy hơn.',
    },
  },
  hoa7_kntt_bai2: {
    hook: 'Một hạt bụi rất nhỏ vẫn gồm vô số nguyên tử. Hiểu nguyên tử giúp giải thích vì sao chất có khối lượng, có cấu tạo và có thể tạo thành phân tử, hợp chất.',
    essentialQuestion: 'Nguyên tử gồm những hạt nào và vì sao nguyên tử thường trung hòa về điện?',
    keyMessage: 'Nguyên tử gồm hạt nhân mang điện dương và các electron mang điện âm chuyển động xung quanh. Số proton trong hạt nhân quyết định nguyên tố hóa học; nguyên tử trung hòa khi số proton bằng số electron.',
    concepts: [
      ['Nguyên tử', 'Hạt vô cùng nhỏ tạo nên các chất', 'Mô hình có hạt nhân và electron', 'Không quan sát trực tiếp bằng mắt thường'],
      ['Hạt nhân', 'Phần trung tâm nguyên tử, chứa proton và neutron', 'Mang điện dương do proton', 'Tập trung gần như toàn bộ khối lượng nguyên tử'],
      ['Electron', 'Hạt mang điện âm chuyển động xung quanh hạt nhân', 'Thường biểu diễn trên các lớp electron', 'Liên quan nhiều đến liên kết hóa học'],
      ['Trung hòa điện', 'Nguyên tử trung hòa khi số proton bằng số electron', 'Tổng điện dương và âm cân bằng', 'Mất hoặc nhận electron có thể tạo ion'],
    ],
    mistakes: [
      'Nghĩ nguyên tử là hạt đặc hoàn toàn, không có cấu tạo bên trong.',
      'Nhầm proton với electron về điện tích.',
      'Cho rằng neutron quyết định nguyên tố, trong khi số proton mới quyết định nguyên tố.',
    ],
    applications: [
      'Đọc mô hình nguyên tử đơn giản để xác định số proton và electron.',
      'Giải thích vì sao nguyên tử trung hòa không hút mạnh vật khác như ion.',
      'Liên hệ electron lớp ngoài cùng với khả năng tạo liên kết ở bài sau.',
    ],
    lab: {
      title: 'Dựng mô hình nguyên tử bằng thẻ hạt',
      steps: ['Dùng thẻ màu biểu diễn proton, neutron, electron', 'Đặt proton và neutron ở hạt nhân', 'Xếp electron vào vùng xung quanh', 'Kiểm tra số proton và electron để kết luận trung hòa điện'],
      safety: 'Dùng vật liệu giấy hoặc nhựa an toàn, không dùng hạt quá nhỏ với học sinh dễ làm rơi nuốt.',
      expected: 'Mô hình thể hiện được hạt nhân, electron và cân bằng điện tích.',
    },
    scenario: {
      question: 'Một nguyên tử trung hòa có 8 proton. Số electron của nguyên tử đó là bao nhiêu?',
      correct: '8 electron.',
      distractors: ['4 electron.', '16 electron.', 'Không có electron.'],
      explanation: 'Nguyên tử trung hòa có số proton bằng số electron.',
    },
    deepQuestion: {
      question: 'Hạt nào quyết định nguyên tử thuộc nguyên tố nào?',
      correct: 'Số proton trong hạt nhân.',
      distractors: ['Số electron ở mọi nguyên tử luôn bằng 0.', 'Số neutron luôn giống nhau ở mọi nguyên tố.', 'Kích thước mô hình vẽ trong sách.'],
      explanation: 'Các nguyên tử cùng nguyên tố có cùng số proton.',
    },
  },
  hoa7_kntt_bai3: {
    hook: 'Than chì và kim cương trông rất khác nhau nhưng đều được tạo từ nguyên tố carbon. Nguyên tố hóa học giúp ta gọi tên “loại nguyên tử” tạo nên chất.',
    essentialQuestion: 'Nguyên tố hóa học là gì và kí hiệu hóa học giúp biểu diễn nguyên tố như thế nào?',
    keyMessage: 'Nguyên tố hóa học là tập hợp các nguyên tử có cùng số proton. Mỗi nguyên tố có tên, kí hiệu hóa học và được dùng để viết công thức chất một cách ngắn gọn.',
    concepts: [
      ['Nguyên tố hóa học', 'Tập hợp nguyên tử có cùng số proton trong hạt nhân', 'Hydrogen, oxygen, carbon, sodium', 'Không nhầm nguyên tố với đơn chất cụ thể'],
      ['Kí hiệu hóa học', 'Cách viết ngắn gọn tên nguyên tố bằng một hoặc hai chữ cái', 'H, O, C, Na, Cl', 'Chữ cái đầu viết hoa, chữ thứ hai nếu có viết thường'],
      ['Số proton', 'Đặc trưng xác định nguyên tố', 'Nguyên tử có 6 proton là carbon', 'Thay đổi số proton sẽ thành nguyên tố khác'],
      ['Ý nghĩa biểu diễn', 'Kí hiệu có thể chỉ nguyên tố hoặc một nguyên tử của nguyên tố đó tùy ngữ cảnh', 'O có thể chỉ nguyên tố oxygen hoặc một nguyên tử oxygen', 'Cần đọc theo nội dung bài'],
    ],
    mistakes: [
      'Viết kí hiệu sodium là S thay vì Na.',
      'Viết cả hai chữ trong kí hiệu hai chữ cái đều in hoa, ví dụ CL thay vì Cl.',
      'Nhầm nguyên tố oxygen với khí oxygen O2.',
    ],
    applications: [
      'Đọc nhãn nước khoáng có Ca, Mg, Na để nhận biết nguyên tố khoáng.',
      'Dùng kí hiệu hóa học để viết công thức chất ngắn gọn hơn tên gọi dài.',
      'Tra bảng tuần hoàn để biết tên và kí hiệu nguyên tố.',
    ],
    lab: {
      title: 'Làm thẻ nguyên tố hóa học',
      steps: ['Chọn 6 nguyên tố quen thuộc', 'Ghi tên tiếng Việt và kí hiệu hóa học', 'Thêm một ứng dụng hoặc chất chứa nguyên tố đó', 'Kiểm tra quy tắc viết hoa, viết thường'],
      safety: 'Không dùng mẫu hóa chất thật; chỉ dùng thẻ giấy hoặc dữ liệu bảng tuần hoàn.',
      expected: 'Thẻ nguyên tố viết đúng kí hiệu và liên hệ được với chất quen thuộc.',
    },
    scenario: {
      question: 'Cách viết nào đúng cho kí hiệu hóa học của chlorine?',
      correct: 'Cl.',
      distractors: ['CL.', 'cl.', 'C l.'],
      explanation: 'Kí hiệu hai chữ cái có chữ đầu viết hoa, chữ thứ hai viết thường.',
    },
    deepQuestion: {
      question: 'Vì sao các nguyên tử có cùng số proton được xếp vào cùng một nguyên tố?',
      correct: 'Vì số proton là đặc trưng xác định loại nguyên tử.',
      distractors: ['Vì mọi nguyên tử có cùng khối lượng.', 'Vì electron không bao giờ thay đổi.', 'Vì tên nguyên tố được chọn ngẫu nhiên.'],
      explanation: 'Số proton thay đổi thì nguyên tử thuộc nguyên tố khác.',
    },
  },
  hoa7_kntt_bai4: {
    hook: 'Bảng tuần hoàn giống bản đồ của thế giới nguyên tố. Nhìn đúng vị trí, em có thể biết nguyên tố thuộc nhóm nào, chu kì nào và có tính chất gần với nguyên tố nào.',
    essentialQuestion: 'Làm thế nào đọc được ô nguyên tố, chu kì, nhóm và ý nghĩa sắp xếp trong bảng tuần hoàn?',
    keyMessage: 'Bảng tuần hoàn sắp xếp các nguyên tố theo số hiệu nguyên tử tăng dần và tính chất lặp lại có quy luật. Vị trí của nguyên tố giúp dự đoán đặc điểm cơ bản.',
    concepts: [
      ['Ô nguyên tố', 'Cung cấp thông tin cơ bản như số hiệu, kí hiệu, tên và khối lượng nguyên tử tương đối', 'Một ô có kí hiệu như H, O, Na', 'Cần đọc đúng từng phần trong ô'],
      ['Chu kì', 'Hàng ngang trong bảng tuần hoàn', 'Các nguyên tố cùng chu kì nằm trên một hàng', 'Số chu kì liên quan số lớp electron trong kiến thức mở rộng'],
      ['Nhóm', 'Cột dọc gồm các nguyên tố có tính chất gần nhau', 'Kim loại kiềm, halogen, khí hiếm', 'Nguyên tố cùng nhóm thường có điểm giống nhau'],
      ['Phân loại nguyên tố', 'Có kim loại, phi kim, khí hiếm và một số nhóm đặc biệt', 'Kim loại thường ở bên trái, phi kim ở bên phải', 'Ranh giới chỉ là định hướng ban đầu'],
    ],
    mistakes: [
      'Đọc nhầm chu kì là cột và nhóm là hàng.',
      'Chỉ nhìn màu ô mà không đọc kí hiệu và số hiệu.',
      'Cho rằng mọi nguyên tố cùng chu kì có tính chất giống hệt nhau.',
    ],
    applications: [
      'Tìm nhanh kí hiệu và tên nguyên tố trong bảng tuần hoàn.',
      'Dự đoán nguyên tố thuộc kim loại hay phi kim từ vị trí.',
      'Liên hệ nhóm khí hiếm với tính chất kém hoạt động hóa học.',
    ],
    lab: {
      title: 'Truy tìm nguyên tố trên bảng tuần hoàn',
      steps: ['Chọn một nguyên tố được giao', 'Xác định số hiệu, kí hiệu, tên', 'Ghi chu kì và nhóm', 'Nêu nguyên tố lân cận cùng nhóm hoặc cùng chu kì'],
      safety: 'Dùng bảng tuần hoàn giấy hoặc màn hình, không cần mẫu hóa chất thật.',
      expected: 'Học sinh đọc được vị trí và thông tin cơ bản của nguyên tố.',
    },
    scenario: {
      question: 'Trong bảng tuần hoàn, nhóm là gì?',
      correct: 'Cột dọc gồm các nguyên tố có tính chất gần nhau.',
      distractors: ['Hàng ngang bất kì trong bảng.', 'Một ô đơn lẻ của nguyên tố.', 'Tên khác của khối lượng nguyên tử.'],
      explanation: 'Nhóm là cột dọc; chu kì là hàng ngang.',
    },
    deepQuestion: {
      question: 'Vì sao bảng tuần hoàn được xem là “bản đồ” của các nguyên tố?',
      correct: 'Vì vị trí nguyên tố cho biết thông tin và gợi ý tính chất theo quy luật.',
      distractors: ['Vì chỉ dùng để trang trí phòng học.', 'Vì mọi ô trong bảng có thông tin giống hệt nhau.', 'Vì bảng không có quy luật sắp xếp.'],
      explanation: 'Bảng tuần hoàn giúp tra cứu và dự đoán tính chất nguyên tố.',
    },
  },
  hoa7_kntt_bai5: {
    hook: 'Khí oxygen gồm các phân tử O2, nước gồm các phân tử H2O, còn muối ăn gồm các hạt tạo bởi sodium và chlorine. Công thức giúp ta nhìn thấy chất được tạo từ nguyên tố nào.',
    essentialQuestion: 'Phân tử, đơn chất và hợp chất khác nhau như thế nào?',
    keyMessage: 'Phân tử là hạt đại diện cho chất gồm một số nguyên tử liên kết với nhau. Đơn chất tạo từ một nguyên tố; hợp chất tạo từ hai hay nhiều nguyên tố khác nhau.',
    concepts: [
      ['Phân tử', 'Hạt gồm các nguyên tử liên kết với nhau và đại diện cho chất', 'O2, H2O, CO2', 'Không phải mọi chất đều tồn tại dưới dạng phân tử riêng lẻ đơn giản'],
      ['Đơn chất', 'Chất tạo nên từ một nguyên tố hóa học', 'O2, H2, Fe, C', 'Một nguyên tố có thể tạo nhiều dạng đơn chất'],
      ['Hợp chất', 'Chất tạo nên từ hai hay nhiều nguyên tố hóa học', 'H2O, CO2, NaCl', 'Tỉ lệ nguyên tử trong hợp chất thường xác định'],
      ['Công thức hóa học', 'Biểu diễn thành phần nguyên tố và số nguyên tử trong chất', 'H2O có H và O theo tỉ lệ 2:1', 'Chỉ số nhỏ cho biết số nguyên tử của nguyên tố đứng trước'],
    ],
    mistakes: [
      'Nghĩ O2 là hợp chất vì có hai nguyên tử, nhưng chỉ gồm một nguyên tố oxygen.',
      'Nhầm CO2 là đơn chất vì viết gọn trong một công thức.',
      'Bỏ qua chỉ số nhỏ trong công thức hóa học.',
    ],
    applications: [
      'Đọc công thức H2O, CO2, O2 để biết chất gồm nguyên tố nào.',
      'Phân loại chất quen thuộc thành đơn chất hoặc hợp chất.',
      'Liên hệ thành phần CO2 với hiện tượng hô hấp và cháy.',
    ],
    lab: {
      title: 'Xếp mô hình phân tử bằng thẻ nguyên tử',
      steps: ['Chuẩn bị thẻ H, O, C, N hoặc hạt màu', 'Ghép O2, H2O, CO2 theo công thức', 'Đếm số nguyên tố khác nhau trong mỗi mô hình', 'Phân loại đơn chất hoặc hợp chất'],
      safety: 'Dùng vật liệu học tập an toàn, không dùng mẫu hóa chất thật.',
      expected: 'Học sinh giải thích được O2 là đơn chất, H2O và CO2 là hợp chất.',
    },
    scenario: {
      question: 'Chất nào sau đây là hợp chất?',
      correct: 'H2O.',
      distractors: ['O2.', 'Fe.', 'H2.'],
      explanation: 'H2O gồm hai nguyên tố hydrogen và oxygen.',
    },
    deepQuestion: {
      question: 'Vì sao O2 là đơn chất dù phân tử có hai nguyên tử?',
      correct: 'Vì cả hai nguyên tử trong O2 đều thuộc cùng một nguyên tố oxygen.',
      distractors: ['Vì O2 không có nguyên tử.', 'Vì mọi chất khí đều là hợp chất.', 'Vì số 2 luôn biểu thị hai nguyên tố.'],
      explanation: 'Đơn chất được xác định theo số loại nguyên tố, không chỉ số nguyên tử.',
    },
  },
  hoa7_kntt_bai6: {
    hook: 'Muối ăn và nước đều bền ở điều kiện thường, nhưng cách các nguyên tử gắn với nhau trong chúng không giống nhau. Đó là câu chuyện của liên kết hóa học.',
    essentialQuestion: 'Vì sao nguyên tử có xu hướng liên kết và có những kiểu liên kết cơ bản nào?',
    keyMessage: 'Liên kết hóa học hình thành khi các nguyên tử tương tác để đạt trạng thái bền hơn. Ở mức nhập môn, cần phân biệt ý tưởng nhường - nhận electron trong liên kết ion và góp chung electron trong liên kết cộng hóa trị.',
    concepts: [
      ['Liên kết hóa học', 'Sự kết hợp giữa các nguyên tử hoặc ion tạo nên chất', 'NaCl, H2O, O2', 'Liên quan đến electron lớp ngoài cùng'],
      ['Liên kết ion', 'Hình thành do lực hút giữa ion dương và ion âm', 'Na+ và Cl- trong muối ăn', 'Thường gặp giữa kim loại và phi kim'],
      ['Liên kết cộng hóa trị', 'Các nguyên tử góp chung electron để tạo phân tử', 'H2, O2, H2O', 'Thường gặp giữa các nguyên tử phi kim'],
      ['Trạng thái bền', 'Nguyên tử có xu hướng đạt cấu hình electron bền hơn', 'Mô hình lớp electron ngoài cùng đầy hơn', 'Đây là mô hình giải thích ở mức cơ bản'],
    ],
    mistakes: [
      'Nghĩ mọi liên kết đều do nhường nhận electron hoàn toàn.',
      'Cho rằng ion và nguyên tử trung hòa là giống nhau.',
      'Nhìn công thức mà không xét loại nguyên tố tham gia khi dự đoán kiểu liên kết.',
    ],
    applications: [
      'Giải thích vì sao muối ăn gồm ion sodium và chloride hút nhau.',
      'Mô tả phân tử nước bằng ý tưởng góp chung electron.',
      'Liên hệ liên kết với việc chất có tính chất khác nguyên tố ban đầu.',
    ],
    lab: {
      title: 'Mô phỏng liên kết bằng thẻ electron',
      steps: ['Dùng thẻ biểu diễn electron lớp ngoài cùng', 'Mô phỏng nhường - nhận để tạo ion trái dấu', 'Mô phỏng góp chung electron giữa hai phi kim', 'So sánh điểm khác nhau của hai mô hình'],
      safety: 'Hoạt động mô hình giấy, không cần hóa chất thật.',
      expected: 'Học sinh nêu được ion là lực hút ion trái dấu, cộng hóa trị là góp chung electron.',
    },
    scenario: {
      question: 'Mô tả nào phù hợp nhất với liên kết cộng hóa trị?',
      correct: 'Các nguyên tử góp chung electron.',
      distractors: ['Một chất bị lọc qua giấy lọc.', 'Ion dương đẩy ion âm ra xa.', 'Nguyên tử biến thành vật thể lớn.'],
      explanation: 'Liên kết cộng hóa trị hình thành khi các nguyên tử dùng chung electron.',
    },
    deepQuestion: {
      question: 'Vì sao Na+ và Cl- hút nhau trong mô hình liên kết ion?',
      correct: 'Vì chúng mang điện tích trái dấu.',
      distractors: ['Vì chúng đều không mang điện.', 'Vì chúng có cùng điện tích dương.', 'Vì chúng là hai phân tử nước.'],
      explanation: 'Ion trái dấu hút nhau bằng lực hút tĩnh điện.',
    },
  },
  hoa7_kntt_bai7: {
    hook: 'Công thức H2O không phải viết ngẫu nhiên. Nó phản ánh hóa trị và tỉ lệ kết hợp giữa hydrogen và oxygen trong hợp chất.',
    essentialQuestion: 'Dùng hóa trị như thế nào để viết và kiểm tra công thức hóa học của hợp chất?',
    keyMessage: 'Hóa trị biểu thị khả năng liên kết của nguyên tử hoặc nhóm nguyên tử. Khi lập công thức hợp chất hai nguyên tố, tích chỉ số và hóa trị của nguyên tố này bằng tích chỉ số và hóa trị của nguyên tố kia.',
    concepts: [
      ['Hóa trị', 'Con số biểu thị khả năng liên kết của nguyên tử hoặc nhóm nguyên tử', 'H có hóa trị I, O thường hóa trị II', 'Cần học thuộc một số hóa trị thường gặp'],
      ['Quy tắc hóa trị', 'Trong công thức AxBy: x.a = y.b với a, b là hóa trị tương ứng', 'H2O: 2.I = 1.II', 'Dùng để kiểm tra công thức'],
      ['Lập công thức', 'Chọn kí hiệu nguyên tố, đặt chỉ số sao cho thỏa quy tắc hóa trị và rút gọn nếu cần', 'Al hóa trị III với O hóa trị II tạo Al2O3', 'Không viết chỉ số 1 trong công thức'],
      ['Ý nghĩa công thức', 'Cho biết nguyên tố tạo nên chất và tỉ lệ số nguyên tử', 'CO2 có 1 C và 2 O', 'Chỉ số nhỏ khác hệ số trước công thức'],
    ],
    mistakes: [
      'Viết chỉ số 1 trong công thức, ví dụ H2O1.',
      'Đổi nhầm hóa trị thành chỉ số mà không kiểm tra rút gọn.',
      'Nhầm hệ số trước công thức với chỉ số trong công thức.',
    ],
    applications: [
      'Kiểm tra công thức của nước, carbon dioxide, aluminium oxide.',
      'Lập công thức từ hóa trị của hai nguyên tố quen thuộc.',
      'Đọc công thức để biết tỉ lệ nguyên tử trong chất.',
    ],
    lab: {
      title: 'Dùng thẻ hóa trị để lập công thức',
      steps: ['Chuẩn bị thẻ nguyên tố và thẻ hóa trị', 'Chọn hai nguyên tố hoặc nhóm nguyên tử', 'Tìm chỉ số thỏa quy tắc hóa trị', 'Kiểm tra lại bằng tích chỉ số và hóa trị'],
      safety: 'Hoạt động mô hình giấy, không dùng hóa chất thật.',
      expected: 'Học sinh lập được công thức đơn giản và giải thích bằng quy tắc hóa trị.',
    },
    scenario: {
      question: 'Công thức của hợp chất tạo bởi Al hóa trị III và O hóa trị II là gì?',
      correct: 'Al2O3.',
      distractors: ['Al3O2.', 'AlO.', 'Al2O2.'],
      explanation: 'Al2O3 thỏa 2 x III = 3 x II.',
    },
    deepQuestion: {
      question: 'Trong công thức CO2, số 2 cho biết điều gì?',
      correct: 'Trong một phân tử hoặc đơn vị công thức có 2 nguyên tử oxygen ứng với 1 carbon.',
      distractors: ['Có 2 nguyên tố carbon.', 'Oxygen có hóa trị luôn bằng 2 trong mọi chất.', 'Số 2 là hệ số đứng trước công thức.'],
      explanation: 'Chỉ số nhỏ nằm sau kí hiệu nguyên tố cho biết số nguyên tử của nguyên tố đó.',
    },
  },
};

const buildEnhancementModules = (lesson, profile) => {
  const conceptTable = buildTable(
    ['Mạch kiến thức', 'Cần hiểu đúng', 'Dấu hiệu nhận biết', 'Lưu ý khi học'],
    profile.concepts,
  );

  const practiceTable = buildTable(
    ['Mức', 'Việc cần làm', 'Sản phẩm học tập'],
    [
      ['Nhận biết', `Gạch chân các từ khóa của bài "${normalizeTitle(lesson)}".`, 'Danh sách 4-6 từ khóa chính'],
      ['Thông hiểu', 'Giải thích một hiện tượng bằng ít nhất hai ý trong bảng hệ thống hóa.', 'Đoạn giải thích 3-5 câu'],
      ['Vận dụng', profile.applications[0], 'Một ví dụ thực tế kèm lí do khoa học'],
    ],
  );

  return [
    heading(lesson, 'hook-title', 'Khởi động học tập'),
    infoBox(
      lesson,
      'hook-box',
      'Tình huống mở đầu',
      `${profile.hook}\n\n**Câu hỏi lớn:** ${profile.essentialQuestion}`,
    ),
    heading(lesson, 'learning-goals', 'Đích đến của bài học'),
    list(lesson, 'learning-goals-list', [
      `Nói được ý chính của bài bằng ngôn ngữ của mình: ${profile.keyMessage}`,
      `Dùng đúng các khái niệm: ${profile.concepts.map((concept) => concept[0]).join(', ')}.`,
      'Giải thích được một tình huống thực tế thay vì chỉ học thuộc định nghĩa.',
      'Hoàn thành câu hỏi nhanh, nhiệm vụ vận dụng và mini-lab an toàn.',
    ]),
    heading(lesson, 'concept-map-title', 'Hệ thống hóa kiến thức'),
    markdown(lesson, 'concept-map-table', conceptTable),
    heading(lesson, 'deep-understanding-title', 'Hiểu sâu hơn'),
    paragraph(lesson, 'deep-understanding-paragraph', profile.keyMessage),
    list(lesson, 'deep-understanding-list', [
      `Khi gặp câu hỏi nhận biết, hãy tìm dấu hiệu liên quan đến "${profile.concepts[0][0]}" hoặc "${profile.concepts[1][0]}".`,
      `Khi gặp câu hỏi giải thích, hãy nối hiện tượng với tính chất hoặc quy tắc trong bảng trên.`,
      'Khi gặp câu hỏi vận dụng, hãy nêu rõ điều kiện, cách làm và lí do khoa học.',
    ]),
    warningBox(
      lesson,
      'mistakes',
      'Sai lầm hay gặp',
      profile.mistakes.map((item) => `- ${item}`).join('\n'),
    ),
    heading(lesson, 'practice-title', 'Luyện tập theo 3 mức'),
    markdown(lesson, 'practice-table', practiceTable),
    heading(lesson, 'applications-title', 'Vận dụng vào đời sống'),
    list(lesson, 'applications-list', profile.applications),
    heading(lesson, 'mini-lab-title', 'Mini-lab hoặc nhiệm vụ quan sát'),
    infoBox(
      lesson,
      'mini-lab-box',
      profile.lab.title,
      [
        '**Cách làm:**',
        ...profile.lab.steps.map((step, index) => `${index + 1}. ${step}`),
        '',
        `**An toàn:** ${profile.lab.safety}`,
        `**Kết quả mong đợi:** ${profile.lab.expected}`,
      ].join('\n'),
    ),
    heading(lesson, 'exit-ticket-title', 'Phiếu tự kiểm tra cuối bài'),
    list(lesson, 'exit-ticket-list', [
      `Em có thể giải thích "${profile.concepts[0][0]}" mà không nhìn tài liệu không?`,
      `Em có phân biệt được "${profile.concepts[1][0]}" và "${profile.concepts[2][0]}" trong ví dụ mới không?`,
      'Em có nêu được một lỗi thường gặp và cách sửa không?',
      'Em có vận dụng được bài học vào một tình huống trong gia đình, lớp học hoặc phòng thực hành không?',
    ]),
  ];
};

const buildPracticeModules = (lesson, profile) => ([
  {
    id: `${lesson.id}-practice-1`,
    title: 'Nhận biết nhanh',
    prompt: `Nêu 3 từ khóa quan trọng nhất trong bài "${normalizeTitle(lesson)}" và giải thích ngắn từng từ.`,
    expectedAnswer: profile.concepts.slice(0, 3).map((concept) => `${concept[0]}: ${concept[1]}`),
  },
  {
    id: `${lesson.id}-practice-2`,
    title: 'Giải thích tình huống',
    prompt: profile.scenario.question,
    expectedAnswer: profile.scenario.correct,
  },
  {
    id: `${lesson.id}-practice-3`,
    title: 'Vận dụng',
    prompt: profile.applications[0],
    expectedAnswer: 'Câu trả lời cần có hiện tượng, khái niệm liên quan và lí do khoa học.',
  },
]);

const buildChallenges = (lesson, profile) => ([
  {
    id: `${lesson.id}-challenge-1`,
    text: `Đọc tình huống mở đầu và xác định câu hỏi lớn của bài: ${profile.essentialQuestion}`,
    narrative: 'Bước đầu tiên là biết mình đang cần giải thích điều gì.',
  },
  {
    id: `${lesson.id}-challenge-2`,
    text: `Chọn 2 khái niệm trong bảng hệ thống hóa và nêu dấu hiệu nhận biết của từng khái niệm.`,
    narrative: 'Muốn qua màn này, em cần biến định nghĩa thành dấu hiệu quan sát được.',
  },
  {
    id: `${lesson.id}-challenge-3`,
    text: `Hoàn thành nhiệm vụ "${profile.lab.title}" hoặc viết mô phỏng quy trình nếu không có dụng cụ.`,
    narrative: 'Vận dụng an toàn quan trọng hơn làm thật khi chưa đủ điều kiện.',
  },
]);

const buildInteractiveLabs = (lesson, profile) => ([
  {
    id: `${lesson.id}-lab-1`,
    title: profile.lab.title,
    steps: profile.lab.steps,
    safety: profile.lab.safety,
    expected: profile.lab.expected,
  },
]);

const buildQuizzes = (lesson, profile) => {
  const existing = lesson.quizzes && !Array.isArray(lesson.quizzes)
    ? lesson.quizzes
    : { level1: [], level2: Array.isArray(lesson.quizzes) ? lesson.quizzes : [], level3: [] };

  const level1 = profile.concepts
    .slice(0, 4)
    .map((concept, index) => makeConceptQuestion(lesson, profile, concept, index));
  const scenarioQuestion = makeScenarioQuestion(lesson, profile, 0);
  const deepQuestion = makeDeepQuestion(lesson, profile, 1);

  return {
    level1: uniqueQuestions([...(existing.level1 || []), ...level1]),
    level2: uniqueQuestions([...(existing.level2 || []), scenarioQuestion]),
    level3: uniqueQuestions([...(existing.level3 || []), deepQuestion]),
  };
};

const buildGame = (lesson, quizzes) => ({
  ...(lesson.game || {}),
  basic: quizzes.level1.map((question) => toGameQuestion(question, 10)),
  intermediate: quizzes.level2.map((question) => toGameQuestion(question, 15)),
  advanced: quizzes.level3.map((question) => toGameQuestion(question, 20)),
});

export const enhanceClass67Lesson = (lesson) => {
  const profile = CLASS_67_PROFILES[lesson.id || lesson.lessonId];
  if (!profile) return lesson;

  const enhancedModules = buildEnhancementModules(lesson, profile);
  const quizzes = buildQuizzes(lesson, profile);
  const journeyAssets = buildJourneyAssets(lesson);
  const vocabulary = Array.from(new Set([
    ...(lesson.vocabulary || []),
    ...profile.concepts.map((concept) => concept[0]),
  ]));

  return {
    ...lesson,
    description: `${profile.essentialQuestion} ${profile.keyMessage}`,
    ...journeyAssets,
    theoryModules: [
      ...enhancedModules.slice(0, 4),
      ...(lesson.theoryModules || []),
      ...enhancedModules.slice(4),
    ],
    quizzes,
    practiceModules: buildPracticeModules(lesson, profile),
    interactiveLabs: buildInteractiveLabs(lesson, profile),
    challenges: buildChallenges(lesson, profile),
    game: {
      ...buildGame(lesson, quizzes),
      assets: {
        ...(lesson.game?.assets || {}),
        infographicUrl: journeyAssets.infographicUrl,
        introVideoUrl: journeyAssets.introVideoUrl,
        journeyVideoUrl: journeyAssets.assets.journeyVideoUrl,
        youtubeVideoUrl: journeyAssets.assets.youtubeVideoUrl,
        cloudinaryVideoUrl: journeyAssets.assets.cloudinaryVideoUrl,
      },
    },
    realWorldApplications: profile.applications,
    vocabulary,
  };
};
