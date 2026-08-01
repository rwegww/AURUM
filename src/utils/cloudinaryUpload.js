/**
 * Upload file directly to Cloudinary from the browser.
 * Uses an unsigned upload preset so no backend/server is needed.
 *
 * Required environment variables (set in Vercel + .env.local):
 *   VITE_CLOUDINARY_CLOUD_NAME   = your cloud name (e.g. "abc123")
 *   VITE_CLOUDINARY_UPLOAD_PRESET = an UNSIGNED upload preset (e.g. "aurum_public")
 */
export async function uploadToCloudinary(file, folder = 'chemistry-odyssey/public', { signal } = {}) {
  if (!(file instanceof File)) {
    throw new Error('Tệp tải lên không hợp lệ.');
  }

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
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: 'POST', body: formData, signal }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Cloudinary upload failed: ${res.status}`);
  }

  const data = await res.json();
  if (!data.secure_url) {
    throw new Error('Cloudinary không trả về đường dẫn tệp an toàn.');
  }

  return {
    url: data.secure_url,
    publicId: data.public_id,
    format: data.format,
    size: data.bytes,
  };
}

/** Upload admin media with a short-lived server signature. */
export async function uploadAdminMedia(file, folder = 'chemistry-odyssey/admin', { signal, token } = {}) {
  if (!(file instanceof File)) {
    throw new Error('Tệp tải lên không hợp lệ.');
  }
  if (!token) {
    throw new Error('Phiên quản trị không hợp lệ. Vui lòng đăng nhập lại.');
  }

  const signatureResponse = await fetch('/api/admin/media/signature', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ folder }),
    signal,
  });
  const signatureData = await signatureResponse.json().catch(() => ({}));
  if (!signatureResponse.ok) {
    throw new Error(signatureData.message || 'Không thể cấp quyền tải tệp quản trị.');
  }
  if (
    typeof signatureData.cloudName !== 'string'
    || typeof signatureData.apiKey !== 'string'
    || typeof signatureData.signature !== 'string'
    || typeof signatureData.folder !== 'string'
    || !Number.isInteger(signatureData.timestamp)
  ) {
    throw new Error('Dữ liệu cấp quyền tải tệp không hợp lệ.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', signatureData.apiKey);
  formData.append('timestamp', String(signatureData.timestamp));
  formData.append('signature', signatureData.signature);
  formData.append('folder', signatureData.folder);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(signatureData.cloudName)}/auto/upload`,
    { method: 'POST', body: formData, signal },
  );
  const uploadData = await uploadResponse.json().catch(() => ({}));
  if (!uploadResponse.ok) {
    throw new Error(uploadData.error?.message || `Không thể tải tệp lên (HTTP ${uploadResponse.status}).`);
  }
  if (!uploadData.secure_url) {
    throw new Error('Cloudinary không trả về đường dẫn tệp an toàn.');
  }

  return {
    url: uploadData.secure_url,
    publicId: uploadData.public_id,
    format: uploadData.format,
    size: uploadData.bytes,
  };
}

