import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Eye,
  FileText,
  Image as ImageIcon,
  Loader2,
  UploadCloud,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { MATERIAL_CATEGORIES } from '@/constants/materialCategories';
import { uploadToCloudinary } from '@/utils/cloudinaryUpload';

const CUSTOM_CATEGORY_VALUE = '__custom__';
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = new Set([
  'pdf',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'gif',
  'mp4',
  'mov',
  'zip',
]);
const ACCEPTED_FILE_INPUT = '.pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp,.gif,.mp4,.mov,.zip';

const MIME_TO_FILE_TYPE = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.ms-powerpoint': 'ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/quicktime': 'mov',
  'application/zip': 'zip',
};

const initialForm = {
  title: '',
  category: '',
  customCategory: '',
  description: '',
};

const getFileExtension = (fileName = '') => {
  const segments = fileName.split('.');
  return segments.length > 1 ? segments.pop().toLowerCase() : '';
};

const getFileType = (file, uploadData = {}) => {
  const typeFromMime = MIME_TO_FILE_TYPE[file.type];
  const typeFromUpload = uploadData.format?.toLowerCase();
  const typeFromName = getFileExtension(file.name);
  return (typeFromMime || typeFromUpload || typeFromName || '').replace(/^\./, '');
};

const formatFileSize = (bytes = 0) => {
  if (!bytes) return '0 KB';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const isImageMaterial = (fileType = '') => /^(png|jpg|jpeg|webp|gif)$/i.test(fileType);

const TeacherLibrary = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [hoc_lieu, setMaterials] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState('');
  const [form, setForm] = useState(initialForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const isTeacher = user?.role === 'teacher';
  const isBusy = isSubmitting || isUploading;

  const categoryValue = useMemo(() => {
    return form.category === CUSTOM_CATEGORY_VALUE ? form.customCategory.trim() : form.category.trim();
  }, [form.category, form.customCategory]);

  const fetchMaterials = useCallback(async () => {
    setListLoading(true);
    setListError('');

    try {
      const res = await fetch('/api/materials');
      const data = await res.json().catch(() => []);
      if (!res.ok) throw new Error(data.message || 'KhÃ´ng thá»ƒ táº£i danh sÃ¡ch thÆ° viá»‡n');
      setMaterials(Array.isArray(data) ? data : []);
    } catch (err) {
      setListError(err.message);
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(fetchMaterials, 0);
    return () => window.clearTimeout(timeout);
  }, [fetchMaterials]);

  const validateFile = (file) => {
    if (!file) return 'Vui lÃ²ng chá»n tá»‡p há»c liá»‡u';
    const fileType = getFileType(file);
    if (!ACCEPTED_FILE_TYPES.has(fileType)) return 'Äá»‹nh dáº¡ng tá»‡p khÃ´ng Ä‘Æ°á»£c há»— trá»£';
    if (file.size > MAX_FILE_SIZE) return 'Tá»‡p há»c liá»‡u tá»‘i Ä‘a 20MB';
    return '';
  };

  const validateForm = () => {
    const nextErrors = {};
    const title = form.title.trim();
    const description = form.description.trim();
    const fileError = validateFile(selectedFile);

    if (!isTeacher) nextErrors.permission = 'Chá»‰ giÃ¡o viÃªn má»›i Ä‘Æ°á»£c upload há»c liá»‡u';
    if (!title) nextErrors.title = 'Vui lÃ²ng nháº­p tiÃªu Ä‘á»';
    else if (title.length > 160) nextErrors.title = 'TiÃªu Ä‘á» tá»‘i Ä‘a 160 kÃ½ tá»±';
    if (!categoryValue) nextErrors.category = 'Vui lÃ²ng chá»n hoáº·c nháº­p danh má»¥c';
    else if (categoryValue.length > 120) nextErrors.category = 'Danh má»¥c tá»‘i Ä‘a 120 kÃ½ tá»±';
    if (description.length > 1200) nextErrors.description = 'MÃ´ táº£ tá»‘i Ä‘a 1200 kÃ½ tá»±';
    if (fileError) nextErrors.file = fileError;

    return nextErrors;
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSuccessMessage('');
    setSubmitError('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const fileError = validateFile(file);
    setFieldErrors((prev) => ({ ...prev, file: fileError || undefined }));
    setSelectedFile(fileError ? null : file);

    if (fileError && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFieldErrors((prev) => ({ ...prev, file: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetForm = () => {
    setForm(initialForm);
    clearSelectedFile();
    setFieldErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');
    setSuccessMessage('');

    const nextErrors = validateForm();
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      setIsUploading(true);
      const uploadData = await uploadToCloudinary(selectedFile, 'chemistry-odyssey/hoc_lieu');
      setIsUploading(false);

      const fileType = getFileType(selectedFile, uploadData);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
          category: categoryValue,
          file_url: uploadData.url,
          file_type: fileType,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) setFieldErrors(data.errors);
        throw new Error(data.message || 'KhÃ´ng thá»ƒ lÆ°u há»c liá»‡u');
      }

      setMaterials((prev) => [data, ...prev.filter((item) => item.id !== data.id)]);
      setSuccessMessage('ÄÃ£ thÃªm há»c liá»‡u vÃ o thÆ° viá»‡n');
      resetForm();
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsUploading(false);
      setIsSubmitting(false);
    }
  };

  if (!isTeacher) {
    return (
      <div className="p-8 pb-24">
        <div className="max-w-3xl mx-auto bg-white border border-red-100 rounded-[32px] p-8">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-5">
            <AlertCircle size={28} aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-black text-viet-text uppercase tracking-tight mb-2">KhÃ´ng cÃ³ quyá»n upload</h1>
          <p className="text-sm font-bold text-viet-text-light">Chá»©c nÄƒng nÃ y chá»‰ dÃ nh cho tÃ i khoáº£n giÃ¡o viÃªn.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-viet-green text-white flex items-center justify-center shadow-lg shadow-viet-green/20">
              <BookOpen size={28} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-viet-text tracking-tight uppercase">ThÆ° viá»‡n há»c liá»‡u</h1>
              <p className="text-sm font-bold text-viet-text-light mt-1">Quáº£n lÃ½ há»c liá»‡u má»›i Ä‘Äƒng trong thÆ° viá»‡n chung.</p>
            </div>
          </div>
          <Link
            to="/library"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-viet-border bg-white text-viet-text font-black text-xs uppercase tracking-widest hover:border-viet-green hover:text-viet-green transition-all"
          >
            <ExternalLink size={16} aria-hidden="true" />
            Má»Ÿ thÆ° viá»‡n
          </Link>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,480px)_1fr] gap-8 items-start">
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] border border-viet-border p-6 md:p-8 shadow-sm"
          >
            <div className="flex items-center justify-between gap-4 mb-7">
              <div>
                <h2 className="text-xl font-black text-viet-text uppercase tracking-tight">Upload bÃ i má»›i</h2>
                <p className="text-xs font-bold text-viet-text-light mt-1">TÃ i liá»‡u, áº£nh, bÃ i táº­p hoáº·c slide.</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-viet-green/10 text-viet-green flex items-center justify-center">
                <UploadCloud size={22} aria-hidden="true" />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1" htmlFor="material-title">
                  TiÃªu Ä‘á»
                </label>
                <input
                  id="material-title"
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="w-full h-[52px] px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-bold"
                  placeholder="VÃ­ dá»¥: Phiáº¿u luyá»‡n táº­p cÃ¢n báº±ng phÆ°Æ¡ng trÃ¬nh"
                  disabled={isBusy}
                />
                {fieldErrors.title && <p className="mt-2 text-xs font-bold text-red-500">{fieldErrors.title}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1" htmlFor="material-category">
                    Danh má»¥c
                  </label>
                  <select
                    id="material-category"
                    value={form.category}
                    onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                    className="w-full h-[52px] px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-bold"
                    disabled={isBusy}
                  >
                    <option value="">Chá»n danh má»¥c</option>
                    {MATERIAL_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>{category.label}</option>
                    ))}
                    <option value={CUSTOM_CATEGORY_VALUE}>Danh má»¥c khÃ¡c</option>
                  </select>
                </div>

                {form.category === CUSTOM_CATEGORY_VALUE && (
                  <div>
                    <label className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1" htmlFor="material-custom-category">
                      TÃªn danh má»¥c
                    </label>
                    <input
                      id="material-custom-category"
                      type="text"
                      value={form.customCategory}
                      onChange={(event) => setForm((prev) => ({ ...prev, customCategory: event.target.value }))}
                      className="w-full h-[52px] px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-bold"
                      placeholder="VÃ­ dá»¥: BÃ€I Táº¬P HÃ“A 10"
                      disabled={isBusy}
                    />
                  </div>
                )}
              </div>
              {fieldErrors.category && <p className="-mt-3 text-xs font-bold text-red-500">{fieldErrors.category}</p>}

              <div>
                <label className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1" htmlFor="material-description">
                  MÃ´ táº£
                </label>
                <textarea
                  id="material-description"
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-3xl outline-none focus:border-viet-green focus:bg-white transition-all text-sm font-medium min-h-[130px] resize-none"
                  placeholder="Ná»™i dung ngáº¯n vá» bÃ i há»c hoáº·c tÃ i liá»‡u"
                  disabled={isBusy}
                />
                {fieldErrors.description && <p className="mt-2 text-xs font-bold text-red-500">{fieldErrors.description}</p>}
              </div>

              <div>
                <span className="block text-[10px] font-black text-viet-text-light uppercase tracking-[2px] mb-2 px-1">Tá»‡p há»c liá»‡u</span>
                <label
                  className={`flex min-h-[130px] cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 text-center transition-all ${
                    selectedFile
                      ? 'border-viet-green bg-viet-green/5'
                      : 'border-slate-200 bg-slate-50 hover:border-viet-green/50 hover:bg-viet-green/5'
                  } ${isBusy ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_FILE_INPUT}
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isBusy}
                  />
                  {selectedFile ? (
                    <div className="w-full flex items-center gap-4 text-left">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-viet-border flex items-center justify-center text-viet-green shrink-0">
                        {selectedFile.type.startsWith('image/') ? <ImageIcon size={24} aria-hidden="true" /> : <FileText size={24} aria-hidden="true" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-viet-text truncate">{selectedFile.name}</p>
                        <p className="text-[10px] font-bold text-viet-text-light uppercase tracking-widest mt-1">
                          {getFileType(selectedFile).toUpperCase()} Â· {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          clearSelectedFile();
                        }}
                        className="w-9 h-9 rounded-xl bg-white border border-viet-border text-slate-400 hover:text-red-500 hover:border-red-200 flex items-center justify-center transition-all shrink-0"
                        aria-label="XÃ³a tá»‡p Ä‘Ã£ chá»n"
                      >
                        <X size={18} aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <UploadCloud size={34} className="text-viet-green mb-3" aria-hidden="true" />
                      <span className="text-sm font-black text-viet-text">Chá»n tá»‡p há»c liá»‡u</span>
                      <span className="text-[10px] font-bold text-viet-text-light uppercase tracking-widest mt-2">
                        PDF, DOCX, PPTX, áº£nh, video hoáº·c ZIP
                      </span>
                    </>
                  )}
                </label>
                {fieldErrors.file && <p className="mt-2 text-xs font-bold text-red-500">{fieldErrors.file}</p>}
              </div>

              {(submitError || successMessage) && (
                <div className={`flex items-start gap-3 rounded-2xl border p-4 ${
                  successMessage ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-600'
                }`}>
                  {successMessage ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" /> : <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />}
                  <p className="text-xs font-bold leading-relaxed">{successMessage || submitError}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isBusy}
                  className="sm:w-36 h-[52px] rounded-2xl bg-slate-100 text-viet-text font-black text-xs uppercase tracking-widest hover:bg-slate-200 disabled:opacity-50 transition-all"
                >
                  XÃ³a form
                </button>
                <button
                  type="submit"
                  disabled={isBusy}
                  className="flex-1 h-[52px] rounded-2xl bg-viet-green text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-viet-green/20 hover:bg-emerald-600 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2"
                >
                  {isBusy ? <Loader2 size={17} className="animate-spin" aria-hidden="true" /> : <UploadCloud size={17} aria-hidden="true" />}
                  {isUploading ? 'Äang táº£i tá»‡p' : isSubmitting ? 'Äang lÆ°u' : 'ÄÄƒng vÃ o thÆ° viá»‡n'}
                </button>
              </div>
            </form>
          </motion.section>

          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-viet-text uppercase tracking-tight">Há»c liá»‡u má»›i nháº¥t</h2>
                <p className="text-xs font-bold text-viet-text-light mt-1">{hoc_lieu.length} má»¥c trong thÆ° viá»‡n</p>
              </div>
              <button
                type="button"
                onClick={fetchMaterials}
                disabled={listLoading}
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-viet-border text-viet-text font-black text-xs uppercase tracking-widest hover:border-viet-green hover:text-viet-green disabled:opacity-50 transition-all"
              >
                {listLoading ? <Loader2 size={15} className="animate-spin" aria-hidden="true" /> : <BookOpen size={15} aria-hidden="true" />}
                Táº£i láº¡i
              </button>
            </div>

            {listError && (
              <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 flex gap-3">
                <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs font-bold">{listError}</p>
              </div>
            )}

            {listLoading ? (
              <div className="py-24 rounded-[32px] border-2 border-dashed border-slate-200 bg-white/60 flex flex-col items-center justify-center">
                <Loader2 size={32} className="animate-spin text-viet-green mb-3" aria-hidden="true" />
                <p className="text-xs font-black text-viet-text-light uppercase tracking-widest">Äang táº£i thÆ° viá»‡n</p>
              </div>
            ) : hoc_lieu.length === 0 ? (
              <div className="py-24 rounded-[32px] border-2 border-dashed border-slate-200 bg-white/60 text-center">
                <BookOpen size={44} className="mx-auto mb-4 text-slate-300" aria-hidden="true" />
                <p className="text-sm font-black text-viet-text-light uppercase tracking-widest">ChÆ°a cÃ³ há»c liá»‡u</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {hoc_lieu.slice(0, 10).map((material, index) => (
                  <motion.article
                    key={material.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.2) }}
                    className="bg-white border border-viet-border rounded-[24px] p-5 shadow-sm hover:shadow-md hover:border-viet-green/30 transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center text-viet-green shrink-0">
                        {isImageMaterial(material.file_type) ? (
                          <img src={material.file_url} alt={material.title} className="w-full h-full object-cover" />
                        ) : (
                          <FileText size={26} aria-hidden="true" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[9px] font-black text-viet-green uppercase tracking-widest truncate">
                            {material.category || 'Há»ŒC LIá»†U'}
                          </span>
                          {material.nguoi_tao_id === user?.id && (
                            <span className="shrink-0 text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                              Cá»§a tÃ´i
                            </span>
                          )}
                        </div>
                        <h3 className="font-black text-viet-text text-sm leading-snug line-clamp-2">{material.title}</h3>
                        <p className="text-[11px] font-bold text-viet-text-light mt-2 line-clamp-2">
                          {material.description || 'KhÃ´ng cÃ³ mÃ´ táº£'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-viet-text-light uppercase">
                        <span className="flex items-center gap-1">
                          <Eye size={12} aria-hidden="true" />
                          {material.view_count || 0}
                        </span>
                        <span>#{material.file_type || 'file'}</span>
                      </div>
                      <Link
                        to={`/library/${material.id}`}
                        className="inline-flex items-center gap-1.5 text-[10px] font-black text-viet-green uppercase tracking-widest hover:text-viet-text transition-colors"
                      >
                        Xem
                        <ExternalLink size={12} aria-hidden="true" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default TeacherLibrary;

