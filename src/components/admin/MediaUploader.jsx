import React, { useEffect, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { uploadAdminMedia } from '@/utils/cloudinaryUpload';

const ACCEPT_BY_TYPE = {
  image: 'image/png,image/jpeg,image/webp,image/gif',
  video: 'video/mp4,video/webm,video/ogg,video/quicktime',
  media: 'image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm,video/ogg,video/quicktime',
};

const TYPE_LABELS = {
  image: 'PNG, JPG, WEBP hoặc GIF',
  video: 'MP4, WEBM, OGG hoặc MOV',
  media: 'PNG, JPG, WEBP, GIF, MP4, WEBM, OGG hoặc MOV',
};

const MediaUploader = ({
  onUploadSuccess,
  onUploadingChange,
  type = 'image',
  maxSizeMB = 10,
  disabled = false,
  folder = 'chemistry-odyssey/admin',
}) => {
  const inputId = useId();
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const mountedRef = useRef(true);
  const previewUrlRef = useRef('');
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      const activeController = abortRef.current;
      abortRef.current = null;
      activeController?.abort();
      if (activeController) onUploadingChange?.(false);
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = '';
    };
  }, [onUploadingChange]);

  const clearPreviewUrl = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = '';
  };

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = '';
  };

  const validateFile = (file) => {
    const allowedTypes = (ACCEPT_BY_TYPE[type] || ACCEPT_BY_TYPE.image).split(',');
    if (!allowedTypes.includes(file.type)) {
      return `Định dạng tệp không hợp lệ. Vui lòng chọn ${TYPE_LABELS[type] || TYPE_LABELS.image}.`;
    }
    if (file.size === 0) return 'Tệp đang trống. Vui lòng chọn tệp khác.';
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Tệp vượt quá dung lượng tối đa ${maxSizeMB} MB.`;
    }
    return '';
  };

  const uploadFile = async (file) => {
    if (!file || abortRef.current || uploading || disabled) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      resetInput();
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    clearPreviewUrl();
    const localUrl = URL.createObjectURL(file);
    previewUrlRef.current = localUrl;
    setPreview({ url: localUrl, isImage: file.type.startsWith('image/'), name: file.name });
    setUploading(true);
    onUploadingChange?.(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const uploadData = await uploadAdminMedia(file, folder, {
        signal: controller.signal,
        token,
      });
      if (mountedRef.current && abortRef.current === controller && !controller.signal.aborted) {
        onUploadSuccess?.(uploadData.url, uploadData);
      }
    } catch (err) {
      if (mountedRef.current && abortRef.current === controller && err.name !== 'AbortError') {
        setError(err.message || 'Không thể tải tệp lên. Vui lòng thử lại.');
        clearPreviewUrl();
        setPreview(null);
      }
    } finally {
      if (mountedRef.current && abortRef.current === controller) {
        abortRef.current = null;
        setUploading(false);
        onUploadingChange?.(false);
        resetInput();
      }
    }
  };

  const handleInputChange = (event) => uploadFile(event.target.files?.[0]);

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    uploadFile(event.dataTransfer.files?.[0]);
  };

  const handleRemove = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    clearPreviewUrl();
    setPreview(null);
    setUploading(false);
    onUploadingChange?.(false);
    setError('');
    resetInput();
  };

  const isDisabled = disabled || uploading;
  const accept = ACCEPT_BY_TYPE[type] || ACCEPT_BY_TYPE.image;

  return (
    <div className="space-y-4">
      <div
        onDragEnter={(event) => { event.preventDefault(); if (!isDisabled) setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);
        }}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-5 text-center transition-all sm:p-8 ${
          uploading || dragging
            ? 'border-viet-green/60 bg-viet-green/5'
            : 'border-viet-border hover:border-viet-green/30'
        } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          id={inputId}
          className="sr-only"
          onChange={handleInputChange}
          accept={accept}
          disabled={isDisabled}
        />
        <label
          htmlFor={inputId}
          className={isDisabled ? 'block cursor-not-allowed' : 'block cursor-pointer'}
          aria-disabled={isDisabled}
        >
          {uploading ? (
            <div className="flex flex-col items-center" role="status" aria-live="polite">
              <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-viet-green/20 border-t-viet-green" />
              <p className="text-sm font-bold text-viet-green">Đang tải lên Cloudinary...</p>
              <p className="mt-1 max-w-full truncate text-xs text-viet-text-light">{preview?.name}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-viet-bg text-viet-green">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-sm font-bold text-viet-text">Chọn tệp hoặc kéo thả vào đây</p>
              <p className="mt-1 text-xs text-viet-text-light">{TYPE_LABELS[type] || TYPE_LABELS.image} (tối đa {maxSizeMB} MB)</p>
            </div>
          )}
        </label>
      </div>

      {error && <p className="text-xs font-bold text-red-600" role="alert">{error}</p>}

      {preview && !uploading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-video overflow-hidden rounded-xl border border-viet-border bg-black/5"
        >
          {preview.isImage ? (
            <img src={preview.url} alt={`Xem trước ${preview.name}`} className="h-full w-full object-contain" />
          ) : (
            <video src={preview.url} className="h-full w-full object-contain" controls aria-label={`Xem trước ${preview.name}`} />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-red-600 shadow-md hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
            aria-label="Đóng bản xem trước tệp vừa tải lên"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default MediaUploader;
