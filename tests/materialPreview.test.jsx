import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { extractMaterialDocumentPreview } from '../api/_lib/materialDocumentPreview';
import RatingStars from '../src/components/library/RatingStars';
import {
  getMaterialFileType,
  getMaterialPreviewKind,
  isAllowedMaterialPreviewUrl,
  normalizeRating,
} from '../shared/materialPreview';

describe('xem trước học liệu', () => {
  it('nhận diện PDF, ảnh và tài liệu Word có thể xem trực tiếp', () => {
    expect(getMaterialPreviewKind({ file_type: 'PDF' })).toBe('pdf');
    expect(getMaterialPreviewKind({ file_type: '.docx' })).toBe('document');
    expect(getMaterialPreviewKind({ file_type: 'doc' })).toBe('document');
    expect(getMaterialPreviewKind({ file_type: 'webp' })).toBe('image');
    expect(getMaterialPreviewKind({ file_type: 'zip' })).toBe('unsupported');
  });

  it('suy ra định dạng từ URL khi dữ liệu cũ chưa có file_type', () => {
    const material = { file_url: 'https://res.cloudinary.com/demo/raw/upload/de-thi.DOCX?x=1' };
    expect(getMaterialFileType(material)).toBe('docx');
    expect(getMaterialPreviewKind(material)).toBe('document');
  });

  it('chỉ cho máy chủ tải tệp xem trước từ Cloudinary qua HTTPS', () => {
    expect(isAllowedMaterialPreviewUrl('https://res.cloudinary.com/demo/raw/upload/file.docx')).toBe(true);
    expect(isAllowedMaterialPreviewUrl('https://api.cloudinary.com/v1_1/demo/download_backup')).toBe(true);
    expect(isAllowedMaterialPreviewUrl('http://res.cloudinary.com/demo/file.docx')).toBe(false);
    expect(isAllowedMaterialPreviewUrl('https://example.com/file.docx')).toBe(false);
    expect(isAllowedMaterialPreviewUrl('http://127.0.0.1/private.docx')).toBe(false);
  });

  it('trích xuất nội dung có nghĩa từ tệp DOCX thật', async () => {
    const docxPath = fileURLToPath(new URL(
      '../Hóa/hoa-lop-8-de-thi-thuvienhoclieu-com-de-kiem-tra-giua-hk1-khnt8-kntt-24-25.docx',
      import.meta.url,
    ));
    const preview = await extractMaterialDocumentPreview(fs.readFileSync(docxPath), 'docx');

    expect(preview.text).toContain('ĐỀ KIỂM TRA GIỮA KÌ I');
    expect(preview.text.length).toBeGreaterThan(1000);
    expect(preview.truncated).toBe(false);
  });
});

describe('hiển thị đánh giá học liệu', () => {
  it('render biểu tượng sao thay vì chuỗi StarStarStar', () => {
    const html = renderToStaticMarkup(<RatingStars rating={5} />);

    expect(html).toContain('aria-label="5/5 sao"');
    expect(html).not.toContain('StarStar');
    expect((html.match(/<svg/g) || [])).toHaveLength(5);
  });

  it('giới hạn đánh giá trong khoảng hợp lệ', () => {
    expect(normalizeRating(9)).toBe(5);
    expect(normalizeRating(-2)).toBe(0);
    expect(normalizeRating('3')).toBe(3);
  });
});

