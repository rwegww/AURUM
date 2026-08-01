import { describe, expect, it } from 'vitest';
import {
  getVideoEmbedUrl,
  isExternalEmbedVideo,
  normalizeHttpUrl,
} from '../src/utils/videoLinks.js';

describe('xử lý đường dẫn video admin', () => {
  it('chỉ nhúng đúng tên miền YouTube/Vimeo', () => {
    expect(isExternalEmbedVideo('https://youtube.com/watch?v=abc123')).toBe(true);
    expect(isExternalEmbedVideo('https://player.vimeo.com/video/12345')).toBe(true);
    expect(isExternalEmbedVideo('https://notyoutube.com/watch?v=abc123')).toBe(false);
    expect(isExternalEmbedVideo('https://youtube.com.attacker.example/watch?v=abc123')).toBe(false);
  });

  it('chuẩn hóa URL HTTP(S) và từ chối giao thức nguy hiểm', () => {
    expect(normalizeHttpUrl('youtube.com/watch?v=abc123')).toBe('https://youtube.com/watch?v=abc123');
    expect(normalizeHttpUrl('javascript:alert(1)')).toBe('');
    expect(normalizeHttpUrl('data:text/html,test')).toBe('');
  });

  it('chuyển URL YouTube hợp lệ thành URL nhúng kèm thời điểm bắt đầu', () => {
    expect(getVideoEmbedUrl('https://youtu.be/abc123?t=1m30s'))
      .toBe('https://www.youtube.com/embed/abc123?start=90');
  });
});
