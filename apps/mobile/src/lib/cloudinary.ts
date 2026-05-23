import { apiBaseUrl } from './api';

type PickedAsset = {
  uri: string;
  name?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  type?: string | null;
};

const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

export const uploadToCloudinary = async (asset: PickedAsset, folder = 'chemistry-odyssey/mobile') => {
  if (!cloudName || !uploadPreset) {
    throw new Error('Thiếu EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME hoặc EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET.');
  }

  const formData = new FormData();
  formData.append('file', {
    uri: asset.uri,
    name: asset.name || asset.fileName || `aurum-upload-${Date.now()}.jpg`,
    type: asset.mimeType || asset.type || 'image/jpeg',
  } as unknown as Blob);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || 'Không thể tải tệp lên Cloudinary.');
  return data as { secure_url?: string; url?: string };
};

export const resolveAssetUrl = (url?: string | null) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${apiBaseUrl.replace(/\/api$/, '')}${url.startsWith('/') ? url : `/${url}`}`;
};
