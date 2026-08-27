import { describe, expect, it } from 'vitest';
import { class6Data } from '../src/data/curriculum/class6/index.js';
import { class7Data } from '../src/data/curriculum/class7/index.js';
import { class8Data } from '../src/data/curriculum/class8/index.js';
import { class9Data } from '../src/data/curriculum/class9/index.js';
import { class10Data } from '../src/data/curriculum/class10/index.js';
import { class11Data } from '../src/data/curriculum/class11/index.js';
import { ketnoi as class12Lessons } from '../src/data/curriculum/class12/index.js';
import { buildKnowledgeMapTree, getLessonCoreTopics } from '../src/utils/knowledgeMapData.js';

describe('dữ liệu bản đồ tri thức', () => {
  it('lấy đúng các mục kiến thức trọng tâm của bài lớp 6 và bỏ phần bổ trợ', () => {
    const topics = getLessonCoreTopics(class6Data.ketnoi[0]);

    expect(topics.map(topic => topic.title)).toEqual([
      '1. Vì sao phải học an toàn trước khi làm thí nghiệm?',
      '2. Quy tắc trước, trong và sau thí nghiệm',
      '3. Kí hiệu cảnh báo thường gặp',
      '4. Xử lí sự cố ban đầu',
    ]);
    expect(topics.every(topic => topic.description.length > 0)).toBe(true);
  });

  it('dùng trực tiếp các đề mục lý thuyết của bài trong Hành trình', () => {
    const topics = getLessonCoreTopics(class8Data.ketnoi[0]);

    expect(topics.map(topic => topic.title)).toEqual([
      '1. Một số dụng cụ thí nghiệm thông dụng',
      '2. Quy tắc an toàn trong phòng thí nghiệm',
      '3. Cách sử dụng thiết bị đo cơ bản',
    ]);
  });

  it('giữ đủ bài và đúng thứ tự ở từng khối', () => {
    const lessons = [
      ...class6Data.ketnoi,
      ...class7Data.ketnoi,
      ...class8Data.ketnoi,
      ...class9Data.ketnoi,
      ...class10Data.ketnoi,
      ...class11Data.ketnoi,
      ...class12Lessons,
    ].map(lesson => ({ ...lesson, lessonId: lesson.id }));
    const tree = buildKnowledgeMapTree(lessons);

    expect(tree[6]).toHaveLength(class6Data.ketnoi.length);
    expect(tree[7]).toHaveLength(class7Data.ketnoi.length);
    expect(tree[8]).toHaveLength(class8Data.ketnoi.length);
    expect(tree[9]).toHaveLength(class9Data.ketnoi.length);
    expect(tree[10]).toHaveLength(class10Data.ketnoi.length);
    expect(tree[11]).toHaveLength(class11Data.ketnoi.length);
    expect(tree[12]).toHaveLength(class12Lessons.length);
    expect(tree[8][0].title).toBe(class8Data.ketnoi[0].title);
    expect(tree[12].at(-1).title).toBe(class12Lessons.at(-1).title);
  });
});
