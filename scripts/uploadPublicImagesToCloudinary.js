import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const CACHE_DIR = path.join(ROOT, '.cache');
const MANIFEST_PATH = path.join(CACHE_DIR, 'public-image-upload-manifest.json');
const IMAGE_EXTENSIONS = new Set(['.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);

dotenv.config({ path: ['.env.local', '.env'] });

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const DELETE_LOCAL = args.includes('--delete-local');
const PREFIX = getArgValue('--prefix') || 'aurum/public';
const ONLY = getArgValue('--only');

function getArgValue(name) {
  const prefix = `${name}=`;
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || 'dpcorzgkm';
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const toPosix = (value) => value.split(path.sep).join('/');

const withoutExtension = (filePath) => {
  const extension = path.extname(filePath);
  return filePath.slice(0, -extension.length);
};

const isSvg = (relativePath) => path.extname(relativePath).toLowerCase() === '.svg';

const getPublicId = (relativePath) => isSvg(relativePath)
  ? `${PREFIX}/${toPosix(relativePath)}`
  : `${PREFIX}/${withoutExtension(toPosix(relativePath))}`;

const deliveryUrl = (relativePath) => {
  const publicId = getPublicId(relativePath);
  if (isSvg(relativePath)) {
    return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;
  }
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}${path.extname(relativePath).toLowerCase()}`;
};

const assertApplyEnv = () => {
  const missing = [];
  if (!apiKey) missing.push('CLOUDINARY_API_KEY');
  if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');
  if (missing.length > 0) {
    throw new Error(`Missing Cloudinary credentials: ${missing.join(', ')}`);
  }
};

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(filePath));
      continue;
    }

    if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(filePath);
    }
  }

  return files;
};

const readImageFiles = async () => {
  const allFiles = await walk(PUBLIC_DIR);
  const onlyPrefix = ONLY?.replace(/^public\//, '').replace(/\/$/, '');
  const filtered = ONLY
    ? allFiles.filter((filePath) => toPosix(path.relative(PUBLIC_DIR, filePath)).startsWith(onlyPrefix))
    : allFiles;

  return filtered.sort().map((filePath) => {
    const relativePath = toPosix(path.relative(PUBLIC_DIR, filePath));
    const publicId = getPublicId(relativePath);
    return {
      filePath,
      relativePath,
      publicId,
      expectedUrl: deliveryUrl(relativePath),
    };
  });
};

const writeManifest = async (entries) => {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(
    MANIFEST_PATH,
    JSON.stringify({ generatedAt: new Date().toISOString(), prefix: PREFIX, entries }, null, 2),
    'utf8'
  );
};

const verifyUrl = async (url) => {
  const response = await fetch(url, { method: 'HEAD' });
  if (!response.ok) {
    throw new Error(`Cloudinary CDN verification failed (${response.status}) for ${url}`);
  }
};

const uploadOne = async (asset) => {
  const resourceType = isSvg(asset.relativePath) ? 'raw' : 'image';
  const result = await cloudinary.uploader.upload(asset.filePath, {
    resource_type: resourceType,
    public_id: asset.publicId,
    overwrite: true,
    invalidate: true,
    tags: ['aurum', 'public-assets'],
  });

  await verifyUrl(asset.expectedUrl);

  if (DELETE_LOCAL) {
    await fs.rm(asset.filePath);
  }

  return {
    relativePath: asset.relativePath,
    publicId: result.public_id,
    bytes: result.bytes,
    format: result.format,
    resourceType,
    secureUrl: result.secure_url,
    deliveryUrl: asset.expectedUrl,
    localDeleted: DELETE_LOCAL,
    status: 'uploaded',
  };
};

const main = async () => {
  const assets = await readImageFiles();
  console.log(`Found ${assets.length} public image assets in ${path.relative(ROOT, PUBLIC_DIR)}`);

  if (!APPLY) {
    console.log('Dry run only. Re-run with --apply to upload.');
    await writeManifest(assets.map((asset) => ({
      relativePath: asset.relativePath,
      publicId: asset.publicId,
      deliveryUrl: asset.expectedUrl,
      status: 'dry_run',
    })));
    return;
  }

  assertApplyEnv();
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  const manifest = [];
  await writeManifest(manifest);

  for (const asset of assets) {
    console.log(`Uploading ${asset.relativePath}`);
    try {
      manifest.push(await uploadOne(asset));
    } catch (error) {
      manifest.push({
        relativePath: asset.relativePath,
        publicId: asset.publicId,
        deliveryUrl: asset.expectedUrl,
        localDeleted: false,
        status: 'failed',
        error: error.message,
      });
      await writeManifest(manifest);
      throw error;
    }
    await writeManifest(manifest);
  }

  console.log(`Done. Manifest written to ${path.relative(ROOT, MANIFEST_PATH)}`);
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
