import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CURRICULUM_PATH = path.join(ROOT, 'public', 'assets', 'curriculum');
const CACHE_DIR = path.join(ROOT, '.cache');
const MANIFEST_PATH = path.join(CACHE_DIR, 'curriculum-upload-manifest.json');

dotenv.config({ path: ['.env.local', '.env'] });

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');
const DELETE_LOCAL = args.has('--delete-local');
const FORCE = args.has('--force');
const LESSON_TABLE = process.env.LESSONS_TABLE || 'lesson';

const requiredWhenApply = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'SUPABASE_URL',
];

const getSupabaseKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

const assertApplyEnv = () => {
  const missing = requiredWhenApply.filter((name) => !process.env[name]);
  if (!getSupabaseKey()) missing.push('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY');
  if (missing.length > 0) {
    throw new Error(`Missing required env for --apply: ${missing.join(', ')}`);
  }
};

const readVideoFiles = async () => {
  const gradeFolders = (await fs.readdir(CURRICULUM_PATH, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && /^class\d+$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => Number(a.replace('class', '')) - Number(b.replace('class', '')));

  const videos = [];
  for (const gradeFolder of gradeFolders) {
    const grade = Number(gradeFolder.replace('class', ''));
    const folderPath = path.join(CURRICULUM_PATH, gradeFolder);
    const files = (await fs.readdir(folderPath))
      .filter((file) => file.endsWith('.mp4'))
      .sort((a, b) => {
        const aOrder = Number(a.split('-')[1]?.replace('.mp4', ''));
        const bOrder = Number(b.split('-')[1]?.replace('.mp4', ''));
        return aOrder - bOrder;
      });

    for (const fileName of files) {
      const order = Number(fileName.split('-')[1]?.replace('.mp4', ''));
      videos.push({
        grade,
        order,
        fileName,
        filePath: path.join(folderPath, fileName),
        publicId: fileName.replace('.mp4', ''),
      });
    }
  }

  return videos;
};

const uploadVideo = async ({ filePath, publicId }, force = false) => {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'video',
    public_id: publicId,
    folder: 'chemistry-odyssey/curriculum',
    overwrite: force,
  });

  return result.secure_url;
};

const verifyUrl = async (url) => {
  const response = await fetch(url, { method: 'HEAD' });
  if (!response.ok) {
    throw new Error(`CDN verification failed (${response.status}) for ${url}`);
  }
};

const loadLessonsByGrade = async (supabase, grade) => {
  const { data, error } = await supabase
    .from(LESSON_TABLE)
    .select('id, title, order')
    .eq('class_id', grade);

  if (error) throw error;
  return data || [];
};

const writeManifest = async (entries) => {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(
    MANIFEST_PATH,
    JSON.stringify({ generatedAt: new Date().toISOString(), entries }, null, 2),
    'utf8'
  );
};

const main = async () => {
  const videos = await readVideoFiles();
  console.log(`Found ${videos.length} curriculum videos in ${CURRICULUM_PATH}`);

  if (!APPLY) {
    console.log('Dry run only. Re-run with --apply to upload and update Supabase.');
    await writeManifest(videos.map((video) => ({ ...video, filePath: path.relative(ROOT, video.filePath) })));
    return;
  }

  assertApplyEnv();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const supabase = createClient(process.env.SUPABASE_URL, getSupabaseKey());
  const lessonsByGrade = new Map();
  const manifest = [];
  await writeManifest(manifest);

  for (const video of videos) {
    if (!lessonsByGrade.has(video.grade)) {
      lessonsByGrade.set(video.grade, await loadLessonsByGrade(supabase, video.grade));
    }

    const lesson = lessonsByGrade.get(video.grade).find((item) => Number(item.order) === video.order);
    if (!lesson) {
      console.warn(`No lesson found for grade ${video.grade}, order ${video.order}, file ${video.fileName}`);
      manifest.push({ ...video, status: 'skipped_no_lesson' });
      await writeManifest(manifest);
      continue;
    }

    console.log(`Uploading ${video.fileName} -> ${lesson.title}`);
    const videoUrl = await uploadVideo(video, FORCE);
    await verifyUrl(videoUrl);

    const { error: updateError } = await supabase
      .from(LESSON_TABLE)
      .update({ intro_video_url: videoUrl })
      .eq('id', lesson.id);
    if (updateError) throw updateError;

    if (DELETE_LOCAL) {
      await fs.rm(video.filePath);
    }

    manifest.push({
      grade: video.grade,
      order: video.order,
      fileName: video.fileName,
      lessonId: lesson.id,
      videoUrl,
      localDeleted: DELETE_LOCAL,
      status: 'uploaded',
    });
    await writeManifest(manifest);
  }

  await writeManifest(manifest);
  console.log(`Done. Manifest written to ${path.relative(ROOT, MANIFEST_PATH)}`);
};

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
