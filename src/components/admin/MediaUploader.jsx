import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MediaUploader = ({ onUploadSuccess, type = 'image' }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    
    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Lỗi tải lên');

      onUploadSuccess(data.url);
      setUploading(false);
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
          uploading ? 'border-viet-green/50 bg-viet-green/5' : 'border-viet-border hover:border-viet-green/30'
        }`}
      >
        <input
          type="file"
          id="media-upload"
          className="hidden"
          onChange={handleUpload}
          accept={type === 'image' ? 'image/*' : 'video/*,image/*'}
        />
        <label htmlFor="media-upload" className="cursor-pointer block">
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin mb-2"></div>
              <p className="text-sm font-bold text-viet-green">Đang tải lên Cloudinary...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-viet-bg rounded-xl flex items-center justify-center text-viet-green mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-sm font-bold text-viet-text">Chọn tệp hoặc kéo thả vào đây</p>
              <p className="text-xs text-viet-text-light mt-1">PNG, JPG, WEBP hoặc MP4 (Max 10MB)</p>
            </div>
          )}
        </label>
      </div>

      {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
      
      {preview && !uploading && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-xl overflow-hidden border border-viet-border aspect-video bg-black/5"
        >
          {type === 'image' || preview.startsWith('data:image') ? (
            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
          ) : (
            <video src={preview} className="w-full h-full object-contain" controls />
          )}
          <button 
            onClick={() => { setPreview(null); onUploadSuccess(''); }}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-red-500 shadow-md hover:bg-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default MediaUploader;
