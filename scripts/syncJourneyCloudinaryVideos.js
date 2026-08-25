import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'] });

const APPLY = process.argv.includes('--apply');
const LESSON_TABLE = process.env.LESSONS_TABLE || 'bai_hoc';
const RESOURCE_PREFIXES = [
  'aurum/curriculum/class',
  'chemistry-odyssey/curriculum/',
];

const getSupabaseKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

const requireEnvironment = () => {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET', 'SUPABASE_URL'];
  const missing = required.filter((name) => !process.env[name]);
  if (!getSupabaseKey()) missing.push('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY');
  if (missing.length > 0) throw new Error(`Thiếu cấu hình: ${missing.join(', ')}`);
};

const isCloudinaryVideoUrl = (value) => {
  try {
    const url = new URL(String(value || '').trim());
    return url.protocol === 'https:'
      && url.hostname === 'res.cloudinary.com'
      && url.pathname.includes('/video/upload/');
  } catch {
    return false;
  }
};

const parseCurriculumAsset = (resource) => {
  const publicId = String(resource?.public_id || '');
  let match = publicId.match(/^chemistry-odyssey\/curriculum\/(\d+)-(\d+)$/);
  if (match) {
    return { classId: Number(match[1]), order: Number(match[2]), priority: 1, resource };
  }

  match = publicId.match(/^aurum\/curriculum\/class(\d+)\/(\d+)-(\d+)$/);
  if (match && match[1] === match[2]) {
    return { classId: Number(match[1]), order: Number(match[3]), priority: 2, resource };
  }

  return null;
};

const listResourcesByPrefix = async (prefix) => {
  const resources = [];
  let nextCursor;
  do {
    const result = await cloudinary.api.resources({
      resource_type: 'video',
      type: 'upload',
      prefix,
      max_results: 500,
      next_cursor: nextCursor,
    });
    resources.push(...(result.resources || []));
    nextCursor = result.next_cursor;
  } while (nextCursor);
  return resources;
};

const main = async () => {
  requireEnvironment();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const supabase = createClient(process.env.SUPABASE_URL, getSupabaseKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const resources = (await Promise.all(RESOURCE_PREFIXES.map(listResourcesByPrefix))).flat();
  const assetsByLesson = new Map();

  resources.map(parseCurriculumAsset).filter(Boolean).forEach((asset) => {
    const key = `${asset.classId}:${asset.order}`;
    const current = assetsByLesson.get(key);
    if (!current || asset.priority > current.priority) assetsByLesson.set(key, asset);
  });

  const { data: lessons, error } = await supabase
    .from(LESSON_TABLE)
    .select('id, khoi_id, thu_tu, tieu_de, intro_video_url')
    .order('khoi_id', { ascending: true })
    .order('thu_tu', { ascending: true });
  if (error) throw error;

  const updates = [];
  const missing = [];
  for (const lesson of lessons || []) {
    const asset = assetsByLesson.get(`${Number(lesson.khoi_id)}:${Number(lesson.thu_tu)}`);
    if (!asset) {
      missing.push({ id: lesson.id, classId: lesson.khoi_id, order: lesson.thu_tu });
      continue;
    }

    const nextUrl = asset.resource.secure_url;
    if (lesson.intro_video_url !== nextUrl && !isCloudinaryVideoUrl(lesson.intro_video_url)) {
      updates.push({
        id: lesson.id,
        classId: lesson.khoi_id,
        order: lesson.thu_tu,
        previousUrl: lesson.intro_video_url || null,
        nextUrl,
      });
    }
  }

  console.log(JSON.stringify({
    mode: APPLY ? 'apply' : 'dry-run',
    cloudinaryAssets: assetsByLesson.size,
    lessons: lessons?.length || 0,
    updates: updates.length,
    missingCloudinaryVideo: missing.length,
    updateLessons: updates.map(({ id, classId, order }) => ({ id, classId, order })),
    missingLessons: missing,
  }, null, 2));

  if (!APPLY) {
    console.log('Chạy lại với --apply để cập nhật intro_video_url trên Supabase.');
    return;
  }

  for (const update of updates) {
    const { error: updateError } = await supabase
      .from(LESSON_TABLE)
      .update({ intro_video_url: update.nextUrl })
      .eq('id', update.id);
    if (updateError) throw new Error(`Không thể cập nhật ${update.id}: ${updateError.message}`);
  }

  const { data: invalidRows, error: validationError } = await supabase
    .from(LESSON_TABLE)
    .select('id, intro_video_url')
    .not('intro_video_url', 'is', null);
  if (validationError) throw validationError;
  const nonCloudinaryRows = (invalidRows || []).filter((row) => !isCloudinaryVideoUrl(row.intro_video_url));
  if (nonCloudinaryRows.length > 0) {
    throw new Error(`Còn ${nonCloudinaryRows.length} bài có intro_video_url không thuộc Cloudinary.`);
  }

  console.log(`Đã cập nhật ${updates.length} bài; mọi intro_video_url hiện có đều thuộc Cloudinary.`);
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
