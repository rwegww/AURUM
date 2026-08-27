const MAX_PREVIEW_CHARACTERS = 150_000;

const cleanExtractedText = (value) => String(value || '')
  .replace(/\r\n?/g, '\n')
  .replace(/\p{Cc}/gu, (character) => (character === '\n' || character === '\t' ? character : ''))
  .replace(/[ \t]+\n/g, '\n')
  .replace(/\n{4,}/g, '\n\n\n')
  .trim();

export const extractMaterialDocumentPreview = async (buffer, fileType) => {
  let extractedText = '';

  if (fileType === 'docx') {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    extractedText = result.value;
  } else if (fileType === 'doc') {
    const WordExtractor = (await import('word-extractor')).default;
    const document = await new WordExtractor().extract(buffer);
    extractedText = document.getBody();
  } else {
    const error = new Error('Định dạng tài liệu không hỗ trợ xem trước.');
    error.status = 415;
    throw error;
  }

  const text = cleanExtractedText(extractedText);
  if (!text) {
    const error = new Error('Không thể trích xuất nội dung từ tài liệu này.');
    error.status = 422;
    throw error;
  }

  return {
    text: text.slice(0, MAX_PREVIEW_CHARACTERS),
    truncated: text.length > MAX_PREVIEW_CHARACTERS,
  };
};
