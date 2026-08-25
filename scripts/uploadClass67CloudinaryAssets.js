import '../api/_env.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error('Missing Cloudinary credentials. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

const lessonAssets = [
  ...[2, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((order) => ({ grade: 6, order })),
  ...[1, 2, 3, 4, 5, 6, 7].map((order) => ({ grade: 7, order })),
];

const uploadOne = async ({ grade, order, extension, resourceType }) => {
  const fileName = `${grade}-${order}.${extension}`;
  const filePath = path.join(rootDir, 'anh', `lop${grade}`, fileName);
  await fs.access(filePath);

  const publicId = `aurum/curriculum/class${grade}/${grade}-${order}`;
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: resourceType,
    public_id: publicId,
    overwrite: true,
    invalidate: true,
    tags: ['aurum', 'curriculum', `class${grade}`, resourceType === 'image' ? 'infographic' : 'video'],
  });

  console.log(JSON.stringify({
    grade,
    order,
    resourceType,
    publicId: result.public_id,
    secureUrl: result.secure_url,
    bytes: result.bytes,
  }));
};

const main = async () => {
  for (const asset of lessonAssets) {
    await uploadOne({ ...asset, extension: 'png', resourceType: 'image' });
    await uploadOne({ ...asset, extension: 'mp4', resourceType: 'video' });
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
