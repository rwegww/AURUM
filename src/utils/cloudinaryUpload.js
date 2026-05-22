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
      'Thiếu cấu hình Cloudinary. Vui lòng thêm VITE_CLOUDINARY_CLOUD_NAME và VITE_CLOUDINARY_UPLOAD_PRESET vào biến môi trường.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
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
