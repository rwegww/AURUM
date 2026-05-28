/**
 * Upload file directly to Cloudinary from the browser.
 * Uses an unsigned upload preset so no backend/server is needed.
 *
 * Required environment variables (set in Vercel + .env.local):
 *   VITE_CLOUDINARY_CLOUD_NAME   = your cloud name (e.g. "abc123")
 *   VITE_CLOUDINARY_UPLOAD_PRESET = an UNSIGNED upload preset (e.g. "aurum_public")
 */
export async function uploadToCloudinary(file, folder = 'chemistry-odyssey/public') {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Thiáº¿u cáº¥u hÃ¬nh Cloudinary. Vui lÃ²ng thÃªm VITE_CLOUDINARY_CLOUD_NAME vÃ  VITE_CLOUDINARY_UPLOAD_PRESET vÃ o biáº¿n mÃ´i trÆ°á»ng.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Cloudinary upload failed: ${res.status}`);
  }

  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    format: data.format,
    size: data.bytes,
  };
}

