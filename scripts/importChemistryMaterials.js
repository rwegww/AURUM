import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';
import WordExtractor from 'word-extractor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CHEMISTRY_DIR = path.join(ROOT, 'H\u00f3a');
const CACHE_DIR = path.join(ROOT, '.cache');
const MANIFEST_PATH = path.join(CACHE_DIR, 'chemistry-materials-manifest.json');
const DATA_PATH = path.join(ROOT, 'src', 'data', 'chemistryMaterials.js');
const CLOUDINARY_FOLDER = 'chemistry-odyssey/hoc-lieu/hoa';
const SUBJECT = 'hoa';
const SIGNED_PDF_EXPIRES_AT = 4102444800; // 2100-01-01T00:00:00Z

dotenv.config({ path: ['.env.local', '.env'], quiet: true });

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');
const RENAME = APPLY || args.has('--rename');
const UPLOAD = APPLY || args.has('--upload');
const SYNC_SUPABASE = APPLY || args.has('--sync-supabase');
const FORCE = args.has('--force');
const NO_EXTRACT = args.has('--no-extract');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const TEXT_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);
const VALID_EXTENSIONS = new Set([...IMAGE_EXTENSIONS, ...TEXT_EXTENSIONS]);

const TYPE_LABELS = {
  'de-thi': 'Đề thi',
  'de-on': 'Đề ôn',
  anh: 'Ảnh',
  'bai-giang': 'Bài giảng',
};

const TYPE_ORDER = {
  'de-thi': 1,
  'de-on': 2,
  'bai-giang': 3,
  anh: 4,
};

const GRADE_ORDER = {
  chung: 0,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
};

const normalizeVi = (value = '') =>
  value
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const toAsciiSearch = (value = '') =>
  normalizeVi(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toSlug = (value = '') =>
  normalizeVi(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');

const sentenceCase = (value = '') => {
  const trimmed = value.replace(/\s+/g, ' ').trim();
  if (!trimmed) return '';
  const lower = trimmed.toLocaleLowerCase('vi-VN');
  const fixed = lower.replace(/(^|[\s([{])([a-zà-ỹđ])/giu, (match, prefix, char) =>
    `${prefix}${char.toLocaleUpperCase('vi-VN')}`
  );

  return fixed
    .replace(/\bSgk\b/gi, 'SGK')
    .replace(/\bThpt\b/gi, 'THPT')
    .replace(/\bTn\b/gi, 'TN')
    .replace(/\bHk\b/gi, 'HK')
    .replace(/\bKntt\b/gi, 'KNTT')
    .replace(/\bCtst\b/gi, 'CTST')
    .replace(/\bHchc\b/gi, 'HCHC')
    .replace(/\bH2s\b/gi, 'H2S')
    .replace(/\bSo2\b/gi, 'SO2')
    .replace(/\bSo3\b/gi, 'SO3');
};

const trimSlug = (slug, maxLength = 88) => {
  if (slug.length <= maxLength) return slug;
  const cut = slug.slice(0, maxLength);
  const lastDash = cut.lastIndexOf('-');
  return (lastDash > 30 ? cut.slice(0, lastDash) : cut).replace(/-+$/g, '');
};

const removeLeadingSourcePrefix = (baseName) =>
  baseName
    .replace(/^\d{8,}[0-9a-f]*[_-]+/i, '')
    .replace(/^[0-9a-f]{10,}[_-]+/i, '');

const cleanBaseName = (fileName) => {
  const ext = path.extname(fileName);
  return removeLeadingSourcePrefix(path.basename(fileName, ext))
    .replace(/\(\d+\)/g, '')
    .replace(/[_-]?page[_\s-]*0*1[_\s-]*converted/gi, '')
    .replace(/[_\s-]*converted/gi, '')
    .replace(/[_\s-]*da_go_p/gi, '')
    .replace(/[_\s-]*tainm/gi, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const isUninformativeName = (cleaned, ext) => {
  const ascii = toAsciiSearch(cleaned);
  if (!ascii) return true;
  if (/^\d+(\s+\d+)*$/.test(ascii)) return true;
  if (/^\d{6,}(\s+\d{6,}){1,}\s*n?$/.test(ascii)) return true;
  if (IMAGE_EXTENSIONS.has(ext) && ascii.split(' ').length <= 2 && /\d{4,}/.test(ascii)) return true;
  return false;
};

const parseNormalizedFileName = (fileName) => {
  const match = fileName.match(/^hoa-(?:(?:lop-(8|9|10|11|12))|(chung))-(de-thi|de-on|anh|bai-giang)-(.+)\.[^.]+$/i);
  if (!match) return null;

  return {
    grade: match[1] || 'chung',
    type: match[3],
    shortSlug: match[4],
  };
};

const collectGradeMatches = (haystack) => {
  const text = toAsciiSearch(haystack);
  const matches = new Set();

  const groupedGrades = text.match(/\b(?:hoa|lop|khoi|cap|mon|hoa hoc)\s+((?:8|9|10|11|12)(?:\s+(?:8|9|10|11|12)){1,})\b/);
  if (groupedGrades) {
    for (const grade of groupedGrades[1].split(/\s+/)) matches.add(grade);
  }

  for (const grade of ['8', '9', '10', '11', '12']) {
    const patterns = [
      new RegExp(`\\blop\\s*${grade}\\b`),
      new RegExp(`\\bkhoi\\s*${grade}\\b`),
      new RegExp(`\\bgrade\\s*${grade}\\b`),
      new RegExp(`\\bclass\\s*${grade}\\b`),
      new RegExp(`\\bhoa\\s*hoc\\s*${grade}\\b`),
      new RegExp(`\\bhoa\\s*${grade}\\b`),
      new RegExp(`\\bkhtn\\s*${grade}\\b`),
      new RegExp(`\\bhuu\\s+co\\s*${grade}\\b`),
      new RegExp(`\\bvo\\s+co\\s*${grade}\\b`),
    ];

    if (patterns.some((pattern) => pattern.test(text))) matches.add(grade);
  }

  if (/\b((on\s+)?thi|on)\s+vao\s+10\b/.test(text)) matches.add('9');
  if (/\b(tot\s+nghiep|tn\s+thpt|thi\s+thpt|de\s+minh\s+hoa)\b/.test(text)) matches.add('12');

  return matches;
};

const inferGradeFromTopic = (haystack) => {
  const text = toAsciiSearch(haystack);
  const rules = [
    [
      '12',
      /\b(este|ester|lipit|lipid|carbohydrate|cacbonhydrate|carbonhydrate|glucose|fructose|polymer|polime|peptit|protein|xa\s+phong|chat\s+tay\s+rua|dieu\s+che\s+kim\s+loai|tot\s+nghiep|tn\s+thpt)\b/,
    ],
    [
      '11',
      /\b(anken|ankadien|ankan|ankin|xicloankan|hidrocacbon|ancol|phenol|andehit|cacboxylic|carboxylic|nitrogen|nito|photpho|phosphorus|nhom\s+hidroxit|dai\s+cuong\s+hoa\s+huu\s+co)\b/,
    ],
    [
      '10',
      /\b(halogen|clo|flo|brom|iot|oxi|ozon|luu\s+huynh|sunfuric|sunfat|lien\s+ket\s+hoa\s+hoc|oxi\s+hoa\s+khu|phan\s+loai\s+phan\s+ung|so\s+oxi\s+hoa|cau\s+tao\s+vo\s+nguyen\s+tu|thanh\s+phan\s+nguyen\s+tu|bang\s+tuan\s+hoan)\b/,
    ],
    [
      '9',
      /\b(ruou\s+etylic|axit\s+axetic|chat\s+beo|saccarozo|tinh\s+bot|xenlulozo|benzen|axetilen|etilen|metan|silic|silicat|cacbonic|muoi\s+cacbonat|hidrocacbon\s+nhien\s+lieu|khai\s+niem\s+hchc|hchc)\b/,
    ],
    [
      '8',
      /\b(cong\s+thuc\s+hoa\s+hoc|hidro\s+nuoc|ti\s+khoi|nguyen\s+tu|phan\s+tu|mol)\b/,
    ],
  ];

  return rules.find(([, pattern]) => pattern.test(text))?.[0] || 'chung';
};

const extractGrade = (nameHaystack, contentHaystack = '') => {
  const nameMatches = collectGradeMatches(nameHaystack);
  if (nameMatches.size === 1) return [...nameMatches][0];
  if (nameMatches.size > 1) return 'chung';

  const contentMatches = collectGradeMatches(contentHaystack);
  if (contentMatches.size === 1) return [...contentMatches][0];

  const topicFromName = inferGradeFromTopic(nameHaystack);
  if (topicFromName !== 'chung') return topicFromName;

  return inferGradeFromTopic(contentHaystack.slice(0, 1200));
};

const extractType = (fileName, ext, textSample) => {
  if (IMAGE_EXTENSIONS.has(ext)) return 'anh';

  const fileText = toAsciiSearch(fileName);
  const contentText = toAsciiSearch(textSample.slice(0, 1600));
  const isExam = (text) =>
    /\b(de\s+thi|de\s+kiem\s+tra|kiem\s+tra|thi\s+thu|hoc\s+ky|hoc\s+ki|hk\s*[12]|giua\s+hk|giua\s+ki|cuoi\s+ki|cuoi\s+ky|de\s+minh\s+hoa|tn\s+thpt|tot\s+nghiep|15\s+phut|15ph)\b/.test(
      text
    );
  const isReview = (text) =>
    /\b(de\s+on|on\s+thi|on\s+tap|trac\s+nghiem|bai\s+tap|giai\s+bai\s+tap|cau\s+trac\s+nghiem|tai\s+lieu\s+on|cong\s+thuc\s+giai\s+nhanh|phuong\s+phap|chuyen\s+de|luyen\s+tap|takenote|take\s+note)\b/.test(
      text
    );
  const isLesson = (text) =>
    /\b(bai\s*\d+|giai\s+hoa|soan\s+hoa|ly\s+thuyet|chuong|thuc\s+hanh|tong\s+hop\s+(kien\s+thuc|ly\s+thuyet))\b/.test(
      text
    );

  if (isExam(fileText)) return 'de-thi';
  if (isReview(fileText)) return 'de-on';
  if (isLesson(fileText)) return 'bai-giang';

  if (
    isExam(contentText)
  ) {
    return 'de-thi';
  }

  if (isReview(contentText)) return 'de-on';

  return 'bai-giang';
};

const extractTextSample = async (filePath, ext) => {
  if (NO_EXTRACT || !TEXT_EXTENSIONS.has(ext)) return { textSample: '', textError: '' };

  try {
    if (ext === '.pdf') {
      const data = await fs.readFile(filePath);
      const parser = new PDFParse({ data });
      const result = await parser.getText({ partial: [1] });
      if (typeof parser.destroy === 'function') await parser.destroy();
      return { textSample: (result.text || '').slice(0, 2500), textError: '' };
    }

    if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      return { textSample: (result.value || '').slice(0, 2500), textError: '' };
    }

    if (ext === '.doc') {
      const extractor = new WordExtractor();
      const doc = await extractor.extract(filePath);
      return { textSample: (doc.getBody() || '').slice(0, 2500), textError: '' };
    }
  } catch (error) {
    return { textSample: '', textError: error.message };
  }

  return { textSample: '', textError: '' };
};

const buildTitle = ({ cleanedName, ext, imageNumber, textSample }) => {
  if (IMAGE_EXTENSIONS.has(ext) && isUninformativeName(cleanedName, ext)) {
    return `Ảnh minh họa Hóa học ${String(imageNumber).padStart(3, '0')}`;
  }

  const firstUsefulLine = textSample
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.length >= 18 && line.length <= 120 && /[a-zA-ZÀ-ỹđĐ]/.test(line));

  const rawTitle = cleanedName.length >= 8 ? cleanedName : firstUsefulLine || cleanedName;
  return sentenceCase(rawTitle);
};

const buildShortSlug = ({ cleanedName, ext, grade, imageNumber, title }) => {
  if (IMAGE_EXTENSIONS.has(ext) && isUninformativeName(cleanedName, ext)) {
    return `minh-hoa-${String(imageNumber).padStart(3, '0')}`;
  }

  let slug = toSlug(cleanedName || title);
  const redundantPatterns = [
    `mon-hoa-hoc-${grade}`,
    `mon-hoa-${grade}`,
    `hoa-hoc-lop-${grade}`,
    `hoa-lop-${grade}`,
    `hoa-hoc-${grade}`,
    `hoa-${grade}`,
    `lop-${grade}`,
    `khoi-${grade}`,
  ];

  for (const pattern of redundantPatterns) {
    slug = slug.replace(new RegExp(`(^|-)${pattern}(-|$)`, 'g'), '-');
  }

  slug = slug
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^de-thi-/, '')
    .replace(/^de-kiem-tra-/, '')
    .replace(/^bai-tap-trac-nghiem-/, 'trac-nghiem-');

  return trimSlug(slug || `tai-lieu-${String(imageNumber).padStart(3, '0')}`);
};

const uniqueFileName = (baseName, ext, usedNames) => {
  let candidate = `${baseName}${ext}`;
  let index = 2;

  while (usedNames.has(candidate.toLowerCase())) {
    candidate = `${baseName}-${index}${ext}`;
    index += 1;
  }

  usedNames.add(candidate.toLowerCase());
  return candidate;
};

const uuidFromString = (value) => {
  const hash = crypto.createHash('sha1').update(value).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const hex = hash.toString('hex').slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

const readJson = async (filePath, fallback) => {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
};

const writeJson = async (filePath, data) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

const readChemistryFiles = async () => {
  const entries = await fs.readdir(CHEMISTRY_DIR, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!VALID_EXTENSIONS.has(ext)) {
      console.warn(`Skipping unsupported file: ${entry.name}`);
      continue;
    }

    const filePath = path.join(CHEMISTRY_DIR, entry.name);
    const stat = await fs.stat(filePath);
    files.push({ originalFileName: entry.name, currentPath: filePath, ext, size: stat.size });
  }

  return files.sort((a, b) => a.originalFileName.localeCompare(b.originalFileName, 'vi'));
};

const analyzeFiles = async (files) => {
  const usedNames = new Set();
  const entries = [];
  let imageNumber = 1;

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const normalized = parseNormalizedFileName(file.originalFileName);
    const cleanedName = cleanBaseName(file.originalFileName);
    const isImage = IMAGE_EXTENSIONS.has(file.ext);
    const imageIndex = isImage ? imageNumber++ : imageNumber;
    const { textSample, textError } = await extractTextSample(file.currentPath, file.ext);
    const grade = normalized?.grade || extractGrade(`${file.originalFileName} ${cleanedName}`, textSample);
    const type = normalized?.type || extractType(file.originalFileName, file.ext, textSample);
    const title =
      normalized?.shortSlug
        ? sentenceCase(normalized.shortSlug.replace(/-/g, ' '))
        : buildTitle({ cleanedName, ext: file.ext, imageNumber: imageIndex, textSample });
    const shortSlug =
      normalized?.shortSlug || buildShortSlug({ cleanedName, ext: file.ext, grade, imageNumber: imageIndex, title });
    const prefix = grade === 'chung' ? `hoa-chung-${type}` : `hoa-lop-${grade}-${type}`;
    const fileName = normalized
      ? file.originalFileName
      : uniqueFileName(`${prefix}-${shortSlug}`, file.ext, usedNames);
    usedNames.add(fileName.toLowerCase());
    const id = uuidFromString(`${SUBJECT}/${fileName}`);

    entries.push({
      id,
      title,
      subject: SUBJECT,
      grade,
      type,
      fileUrl: '',
      fileName,
      sourceFileName: file.originalFileName,
      originalFileName: file.originalFileName,
      size: file.size,
      textError,
      category: buildCategory(grade, type),
      cloudinaryPublicId: '',
      cloudinaryResourceType: '',
      cloudinaryFormat: '',
      uploadStatus: 'pending',
      supabaseStatus: 'pending',
    });

    if ((index + 1) % 50 === 0 || index + 1 === files.length) {
      console.log(`Analyzed ${index + 1}/${files.length}`);
    }
  }

  return entries;
};

const buildCategory = (grade, type) => {
  const gradeLabel = grade === 'chung' ? 'CHUNG' : `LỚP ${grade}`;
  return `HÓA ${gradeLabel} - ${TYPE_LABELS[type].toLocaleUpperCase('vi-VN')}`;
};

const mergeCachedUploadData = (entries, previousManifest) => {
  const previousEntries = previousManifest?.entries || [];
  const byFileName = new Map(previousEntries.map((entry) => [entry.fileName, entry]));
  const byOriginalFileName = new Map(previousEntries.map((entry) => [entry.originalFileName, entry]));

  return entries.map((entry) => {
    const previous = byFileName.get(entry.fileName) || byOriginalFileName.get(entry.originalFileName);
    if (!previous) return entry;

    return {
      ...entry,
      id: previous.id || entry.id,
      title: previous.title || entry.title,
      grade: previous.grade || entry.grade,
      type: previous.type || entry.type,
      originalFileName: previous.originalFileName || entry.originalFileName,
      category: previous.category || entry.category,
      fileUrl: previous.fileUrl || entry.fileUrl,
      cloudinaryPublicId: previous.cloudinaryPublicId || entry.cloudinaryPublicId,
      cloudinaryResourceType: previous.cloudinaryResourceType || entry.cloudinaryResourceType,
      cloudinaryFormat: previous.cloudinaryFormat || entry.cloudinaryFormat,
      uploadStatus: previous.fileUrl ? previous.uploadStatus || 'uploaded' : entry.uploadStatus,
      supabaseStatus: previous.supabaseStatus || entry.supabaseStatus,
    };
  });
};

const writeManifest = async (entries) => {
  const counts = summarize(entries);
  await writeJson(MANIFEST_PATH, {
    generatedAt: new Date().toISOString(),
    chemistryDir: path.relative(ROOT, CHEMISTRY_DIR),
    cloudinaryFolder: CLOUDINARY_FOLDER,
    counts,
    entries,
  });
};

const renameFiles = async (entries) => {
  const changes = entries.filter((entry) => (entry.sourceFileName || entry.originalFileName) !== entry.fileName);
  if (changes.length === 0) return;

  console.log(`Renaming ${changes.length} files`);
  const tempRenames = [];

  for (let index = 0; index < changes.length; index += 1) {
    const entry = changes[index];
    const source = path.join(CHEMISTRY_DIR, entry.sourceFileName || entry.originalFileName);
    const temp = path.join(CHEMISTRY_DIR, `.aurum-renaming-${process.pid}-${index}${entry.ext || path.extname(entry.fileName)}`);
    await fs.rename(source, temp);
    tempRenames.push({ entry, temp, target: path.join(CHEMISTRY_DIR, entry.fileName) });
  }

  for (const item of tempRenames) {
    await fs.rename(item.temp, item.target);
  }
};

const assertCloudinaryEnv = () => {
  const missing = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'].filter(
    (name) => !process.env[name]
  );

  if (missing.length > 0) {
    throw new Error(`Missing Cloudinary env: ${missing.join(', ')}`);
  }
};

const uploadLarge = (filePath, options) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_large(filePath, options, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });

const getDeliverableUrl = (entry, uploadResult = {}) => {
  const ext = path.extname(entry.fileName).toLowerCase();
  const publicId = uploadResult.public_id || entry.cloudinaryPublicId;

  if (ext === '.pdf' && publicId) {
    return cloudinary.utils.private_download_url(publicId, 'pdf', {
      resource_type: 'raw',
      type: 'upload',
      attachment: false,
      expires_at: SIGNED_PDF_EXPIRES_AT,
    });
  }

  return uploadResult.secure_url || entry.fileUrl;
};

const uploadEntries = async (entries) => {
  assertCloudinaryEnv();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const ext = path.extname(entry.fileName).toLowerCase();
    const isRawDocument = ['.pdf', '.doc', '.docx'].includes(ext);
    const desiredResourceType = isRawDocument ? 'raw' : 'image';

    if (entry.fileUrl && !FORCE && entry.cloudinaryResourceType === desiredResourceType) {
      entry.fileUrl = getDeliverableUrl(entry);
      entry.uploadStatus = 'cached';
      continue;
    }

    const filePath = path.join(CHEMISTRY_DIR, entry.fileName);
    const publicId = path.basename(entry.fileName, ext);
    const uploadPublicId = isRawDocument ? `${publicId}${ext}` : publicId;
    console.log(`Uploading ${index + 1}/${entries.length}: ${entry.fileName}`);

    const uploadOptions = {
      resource_type: desiredResourceType,
      folder: CLOUDINARY_FOLDER,
      public_id: uploadPublicId,
      overwrite: true,
      unique_filename: false,
      use_filename: false,
    };
    const stat = await fs.stat(filePath);
    const largeUploadOptions = {
      ...uploadOptions,
      resource_type: desiredResourceType,
      public_id: uploadPublicId,
    };
    const result =
      stat.size > 10 * 1024 * 1024
        ? await uploadLarge(filePath, { ...largeUploadOptions, chunk_size: 6 * 1024 * 1024 })
        : await cloudinary.uploader.upload(filePath, uploadOptions);

    entry.fileUrl = getDeliverableUrl(entry, result);
    entry.cloudinaryPublicId = result.public_id;
    entry.cloudinaryResourceType = result.resource_type;
    entry.cloudinaryFormat = result.format || path.extname(entry.fileName).replace('.', '');
    entry.uploadStatus = 'uploaded';

    if ((index + 1) % 10 === 0 || index + 1 === entries.length) {
      await writeManifest(entries);
    }
  }
};

const getSupabaseKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

const assertSupabaseEnv = () => {
  const missing = [];
  if (!process.env.SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!getSupabaseKey()) missing.push('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY');
  if (missing.length > 0) throw new Error(`Missing Supabase env: ${missing.join(', ')}`);
};

const syncSupabase = async (entries) => {
  assertSupabaseEnv();
  const missingUrls = entries.filter((entry) => !entry.fileUrl);
  if (missingUrls.length > 0) {
    throw new Error(`Cannot sync Supabase because ${missingUrls.length} entries do not have Cloudinary URLs`);
  }

  const supabase = createClient(process.env.SUPABASE_URL, getSupabaseKey());
  const rows = entries.map((entry) => ({
    id: entry.id,
    tieu_de: entry.title,
    mo_ta: `Học liệu Hóa ${entry.grade === 'chung' ? 'chung' : `lớp ${entry.grade}`}, loại ${
      TYPE_LABELS[entry.type]
    }. Tệp chuẩn hóa: ${entry.fileName}.`,
    file_url: entry.fileUrl,
    file_type: path.extname(entry.fileName).replace('.', '').toLowerCase(),
    danh_muc: entry.category,
    nguoi_tao_id: null,
  }));

  const batchSize = 100;
  for (let start = 0; start < rows.length; start += batchSize) {
    const batch = rows.slice(start, start + batchSize);
    const { error } = await supabase.from('hoc_lieu').upsert(batch, { onConflict: 'id' });
    if (error) throw error;

    for (let index = start; index < Math.min(start + batchSize, entries.length); index += 1) {
      entries[index].supabaseStatus = 'upserted';
    }

    console.log(`Synced Supabase ${Math.min(start + batchSize, rows.length)}/${rows.length}`);
    await writeManifest(entries);
  }
};

const serializeDataFile = (entries) => {
  const materials = entries
    .slice()
    .sort((a, b) => {
      const gradeDiff = GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade];
      if (gradeDiff !== 0) return gradeDiff;
      const typeDiff = TYPE_ORDER[a.type] - TYPE_ORDER[b.type];
      if (typeDiff !== 0) return typeDiff;
      return a.title.localeCompare(b.title, 'vi');
    })
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      subject: entry.subject,
      grade: entry.grade,
      type: entry.type,
      fileUrl: entry.fileUrl,
      fileName: entry.fileName,
      originalFileName: entry.originalFileName,
      category: entry.category,
    }));

  return `/**\n * Generated by scripts/importChemistryMaterials.js.\n * Do not edit this list manually; update files in H\\u00f3a and rerun the script.\n *\n * @typedef {Object} ChemistryMaterial\n * @property {string} id\n * @property {string} title\n * @property {'hoa'} subject\n * @property {'chung'|'8'|'9'|'10'|'11'|'12'} grade\n * @property {'de-thi'|'de-on'|'anh'|'bai-giang'} type\n * @property {string} fileUrl\n * @property {string} fileName\n */\n\n/** @type {ChemistryMaterial[]} */\nexport const chemistryMaterials = ${JSON.stringify(materials, null, 2)};\n\nexport default chemistryMaterials;\n`;
};

const writeDataFile = async (entries) => {
  await fs.writeFile(DATA_PATH, serializeDataFile(entries), 'utf8');
};

const summarize = (entries) => {
  const byGrade = {};
  const byType = {};
  const byExtension = {};

  for (const entry of entries) {
    byGrade[entry.grade] = (byGrade[entry.grade] || 0) + 1;
    byType[entry.type] = (byType[entry.type] || 0) + 1;
    const ext = path.extname(entry.fileName).replace('.', '').toLowerCase();
    byExtension[ext] = (byExtension[ext] || 0) + 1;
  }

  return {
    total: entries.length,
    byGrade,
    byType,
    byExtension,
    uploaded: entries.filter((entry) => entry.fileUrl).length,
    supabaseUpserted: entries.filter((entry) => entry.supabaseStatus === 'upserted').length,
    extractionErrors: entries.filter((entry) => entry.textError).length,
  };
};

const printSummary = (entries) => {
  const summary = summarize(entries);
  console.log(JSON.stringify(summary, null, 2));
};

const main = async () => {
  const files = await readChemistryFiles();
  console.log(`Found ${files.length} files in ${path.relative(ROOT, CHEMISTRY_DIR)}`);

  const previousManifest = await readJson(MANIFEST_PATH, null);
  let entries = await analyzeFiles(files);
  entries = mergeCachedUploadData(entries, previousManifest);

  await writeManifest(entries);
  printSummary(entries);

  if (!RENAME && !UPLOAD && !SYNC_SUPABASE) {
    await writeDataFile(entries);
    console.log('Dry run only. Re-run with --apply to rename, upload, and sync Supabase.');
    return;
  }

  if (RENAME) {
    await renameFiles(entries);
    await writeManifest(entries);
  }

  if (UPLOAD) {
    await uploadEntries(entries);
    await writeManifest(entries);
  }

  await writeDataFile(entries);

  if (SYNC_SUPABASE) {
    await syncSupabase(entries);
    await writeDataFile(entries);
  }

  printSummary(entries);
  console.log(`Manifest: ${path.relative(ROOT, MANIFEST_PATH)}`);
  console.log(`Data file: ${path.relative(ROOT, DATA_PATH)}`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
