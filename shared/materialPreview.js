const IMAGE_FILE_TYPES = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif']);
const DOCUMENT_FILE_TYPES = new Set(['doc', 'docx']);
const ALLOWED_PREVIEW_HOSTS = new Set([
  'res.cloudinary.com',
  'api.cloudinary.com',
]);

const cleanFileType = (value) => (
  typeof value === 'string'
    ? value.trim().replace(/^\./, '').toLowerCase()
    : ''
);

export const getMaterialFileType = (material) => {
  const explicitType = cleanFileType(
    typeof material === 'string' ? material : material?.file_type,
  );
  if (explicitType) return explicitType;

  try {
    const pathname = new URL(material?.file_url || '').pathname;
    return cleanFileType(pathname.split('.').pop());
  } catch {
    return '';
  }
};

export const getMaterialPreviewKind = (material) => {
  const fileType = getMaterialFileType(material);
  if (IMAGE_FILE_TYPES.has(fileType)) return 'image';
  if (fileType === 'pdf') return 'pdf';
  if (DOCUMENT_FILE_TYPES.has(fileType)) return 'document';
  return 'unsupported';
};

export const getMaterialPdfPreviewUrl = (material) => (
  material?.id
    ? `/api/materials/${encodeURIComponent(material.id)}/pdf`
    : ''
);

export const isAllowedMaterialPreviewUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' && ALLOWED_PREVIEW_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
};

export const normalizeRating = (value) => {
  const parsed = Math.round(Number(value));
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(5, Math.max(0, parsed));
};
