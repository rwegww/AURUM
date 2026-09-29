import { describe, expect, it } from 'vitest';
import { class6Data } from '../src/data/curriculum/class6/index.js';
import { class7Data } from '../src/data/curriculum/class7/index.js';
import { class8Data } from '../src/data/curriculum/class8/index.js';
import { class9Data } from '../src/data/curriculum/class9/index.js';
import { class10Data } from '../src/data/curriculum/class10/index.js';
import { class11Data } from '../src/data/curriculum/class11/index.js';
import { ketnoi as class12Lessons } from '../src/data/curriculum/class12/index.js';
import {
  countJourneyQuestions,
  getJourneyQuizGroups,
  getJourneyStageOverview,
  getJourneyVideoUrl,
  JOURNEY_LEVELS,
  normalizeJourneyChallenges,
} from '../src/utils/journeyLessonData.js';
import { isCloudinaryVideoUrl } from '../src/utils/videoLinks.js';
import { getLessonInfographicUrl } from '../src/utils/lessonAssets.js';

const allLessons = [
  ...class6Data.ketnoi,
  ...class7Data.ketnoi,
  ...class8Data.ketnoi,
  ...class9Data.ketnoi,
  ...class10Data.ketnoi,
  ...class11Data.ketnoi,
  ...class12Lessons,
];

describe('dữ liệu lộ trình học', () => {
  it('giữ nguyên loại và nội dung của thử thách tương tác', () => {
    const [imageSelection, matching] = normalizeJourneyChallenges(class8Data.ketnoi[0].challenges);

    expect(imageSelection.type).toBe('image-selection');
    expect(imageSelection.images).toHaveLength(4);
    expect(imageSelection.correctAnswer).toBe(0);
    expect(matching.type).toBe('matching');
    expect(matching.leftItems).toHaveLength(3);
  });

  it('chuyển thử thách văn bản cũ thành nhiệm vụ lab', () => {
    const [challenge] = normalizeJourneyChallenges([
      { text: 'Quan sát hiện tượng và ghi lại kết quả.', narrative: 'Hãy làm theo hướng dẫn.' },
    ]);

    expect(challenge.type).toBe('lab-task');
    expect(challenge.text).toContain('Quan sát hiện tượng');
  });

  it('chuẩn hóa cả answer và correctAnswer mà không làm mất đáp án', () => {
    const groups = getJourneyQuizGroups({
      quizzes: [
        { question: 'Câu 1', options: ['A', 'B'], correctAnswer: 1 },
        { question: 'Câu 2', options: ['A', 'B'], answer: 0 },
      ],
    });

    expect(groups.level1.map((question) => question.correctAnswer)).toEqual([1]);
    expect(groups.level2.map((question) => question.correctAnswer)).toEqual([0]);
    expect(groups.level3.map((question) => question.correctAnswer)).toEqual([1, 0]);
  });

  it('chia ngân hàng phẳng thành vòng cơ bản, vòng nâng cao và vòng tổng hợp', () => {
    const lesson = class10Data.ketnoi[0];
    const groups = getJourneyQuizGroups(lesson);

    JOURNEY_LEVELS.forEach((level) => expect(groups[level].length).toBeGreaterThan(0));
    expect(groups.level1.length + groups.level2.length).toBe(lesson.game.basic.length);
    expect(groups.level3.length).toBe(lesson.game.basic.length);
    expect(countJourneyQuestions(lesson)).toBe(lesson.game.basic.length);
  });

  it('dùng câu cơ bản cho vòng 1 và thử thách tương tác cho vòng 2 ở dữ liệu khối 8', () => {
    const lesson = class8Data.ketnoi[0];
    const groups = getJourneyQuizGroups(lesson);

    expect(groups.level1).toHaveLength(lesson.game.basic.length);
    expect(groups.level2).toHaveLength(lesson.challenges.length);
    expect(groups.level2.some((question) => question.type === 'matching')).toBe(true);
  });

  it('tạo thông tin chặng cho admin bằng đúng dữ liệu học sinh đang thấy', () => {
    const lesson = {
      ...class8Data.ketnoi[0],
      introVideoUrl: '',
    };
    const overview = getJourneyStageOverview(lesson, 0);
    const groups = getJourneyQuizGroups(lesson);

    expect(overview.title).toBe('Sử dụng một số hóa chất, thiết bị cơ bản trong phòng thí nghiệm');
    expect(overview.description).toBe(lesson.description);
    expect(overview.videoUrl).toBe('https://res.cloudinary.com/dpcorzgkm/video/upload/chemistry-odyssey/curriculum/8-1.mp4');
    JOURNEY_LEVELS.forEach((level) => {
      expect(overview.questionCounts[level]).toBe(groups[level].length);
    });
    expect(overview.totalQuestions).toBe(countJourneyQuestions(lesson));
  });

  it('ưu tiên video Cloudinary mở đầu giống luồng học sinh', () => {
    const overview = getJourneyStageOverview({
      title: 'Bài 3: Liên kết hóa học',
      introVideoUrl: ' https://res.cloudinary.com/aurum/video/upload/v1/intro.mp4 ',
      videoModules: [{ url: 'https://www.youtube.com/watch?v=fallback' }],
    }, 2);

    expect(overview.title).toBe('Liên kết hóa học');
    expect(overview.videoUrl).toBe('https://res.cloudinary.com/aurum/video/upload/v1/intro.mp4');
    expect(overview.questionCounts).toEqual({ level1: 0, level2: 0, level3: 0 });
  });

  it('bỏ qua YouTube và chỉ lấy video Cloudinary trong học liệu', () => {
    const lesson = {
      introVideoUrl: 'https://www.youtube.com/watch?v=old-video',
      videoModules: [
        { url: 'https://vimeo.com/12345' },
        { url: 'https://res.cloudinary.com/aurum/video/upload/v1/bai-8.mp4' },
      ],
    };

    expect(getJourneyVideoUrl(lesson)).toBe('https://res.cloudinary.com/aurum/video/upload/v1/bai-8.mp4');
  });

  it('nhận video Cloudinary đã khai báo trong tài nguyên hành trình', () => {
    const lesson = {
      introVideoUrl: 'https://www.youtube.com/watch?v=old-video',
      assets: {
        journeyVideoUrl: 'https://res.cloudinary.com/aurum/video/upload/v1/tai-nguyen-hanh-trinh.mp4',
      },
    };

    expect(getJourneyVideoUrl(lesson)).toBe('https://res.cloudinary.com/aurum/video/upload/v1/tai-nguyen-hanh-trinh.mp4');
  });

  it('mọi video được dùng trong hành trình đều được phân phối từ Cloudinary', () => {
    const journeyVideoUrls = allLessons.map(getJourneyVideoUrl).filter(Boolean);

    expect(journeyVideoUrls).toHaveLength(72);
    expect(journeyVideoUrls.every(isCloudinaryVideoUrl)).toBe(true);
  });

  it('dùng infographic Cloudinary cho dữ liệu API lớp 6 và lớp 7 chưa có URL', () => {
    const infographicOrders = {
      6: [2, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      7: [1, 2, 3, 4, 5, 6, 7],
    };

    Object.entries(infographicOrders).forEach(([classId, orders]) => {
      orders.forEach((order) => {
        expect(getLessonInfographicUrl({ classId, order }))
          .toBe(`https://res.cloudinary.com/dpcorzgkm/image/upload/aurum/curriculum/class${classId}/${classId}-${order}.png`);
      });
    });
  });

  it('thay đường dẫn local lớp 6–7 bị thiếu nhưng vẫn ưu tiên URL tùy chỉnh hợp lệ', () => {
    expect(getLessonInfographicUrl({
      classId: 6,
      order: 6,
      infographicUrl: '/assets/curriculum/class6/6-6.webp',
    })).toBe('https://res.cloudinary.com/dpcorzgkm/image/upload/aurum/curriculum/class6/6-6.png');

    expect(getLessonInfographicUrl({
      classId: 7,
      order: 2,
      infographicUrl: 'https://cdn.example.com/custom-7-2.webp',
    })).toBe('https://cdn.example.com/custom-7-2.webp');
  });

  it('vòng 3 luôn chứa đầy đủ câu hỏi của hai vòng trước và không lặp câu', () => {
    allLessons.forEach((lesson) => {
      const groups = getJourneyQuizGroups(lesson);
      const signature = (question) => JSON.stringify([
        question.type,
        question.question || question.content || question.text,
        question.options || question.images || question.items || [],
      ]);
      const expected = new Set([...groups.level1, ...groups.level2].map(signature));
      const actual = groups.level3.map(signature);

      expect(new Set(actual).size, `${lesson.id || lesson.lessonId} có câu tổng hợp bị lặp`).toBe(actual.length);
      expect(new Set(actual), `${lesson.id || lesson.lessonId} thiếu câu ở vòng tổng hợp`).toEqual(expected);
    });
  });

  it('tất cả bài trong chương trình đều có câu hỏi chơi được ở cả ba mốc sao', () => {
    expect(allLessons).toHaveLength(129);

    allLessons.forEach((lesson) => {
      const groups = getJourneyQuizGroups(lesson);
      JOURNEY_LEVELS.forEach((level) => {
        expect(groups[level].length, `${lesson.id || lesson.lessonId} thiếu ${level}`).toBeGreaterThan(0);
      });
    });
  });
});
