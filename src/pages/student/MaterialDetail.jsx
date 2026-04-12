import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

const MaterialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { t, i18n } = useTranslation();
  
  const [material, setMaterial] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matRes, feedRes] = await Promise.all([
          fetch(`/api/materials/${id}`),
          fetch(`/api/materials/${id}/feedback`)
        ]);
        
        const matData = await matRes.json();
        const feedData = await feedRes.json();
        
        setMaterial(matData);
        setFeedback(Array.isArray(feedData) ? feedData : []);
      } catch (err) {
        console.error(t('material_detail.feedback.err_fetch'), err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, t]);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return alert(t('material_detail.feedback.alert_login'));
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/materials/${id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          rating,
          userId: user.id
        })
      });

      if (res.ok) {
        const added = await res.json();
        setFeedback([{ ...added, users: { username: user.username } }, ...feedback]);
        setNewComment('');
      }
    } catch (err) {
      console.error(t('material_detail.feedback.err_submit'), err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-viet-bg">
      <div className="w-16 h-16 border-4 border-viet-green border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!material) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-viet-bg">
      <h2 className="text-2xl font-black text-viet-text mb-4">{t('material_detail.not_found')}</h2>
      <button onClick={() => navigate('/library')} className="bg-viet-green text-white px-8 py-3 rounded-xl font-bold">{t('material_detail.back_btn')}</button>
    </div>
  );

  const isImage = material.file_type?.match(/png|jpg|jpeg|webp/);
  const isPdf = material.file_type === 'pdf';

  return (
    <main className="min-h-screen bg-viet-bg pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/library')}
          className="flex items-center gap-2 text-viet-text-light font-black uppercase text-xs mb-8 hover:text-viet-green transition-colors"
        >
          ← {t('material_detail.back_btn')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content: Preview */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[40px] border-2 border-viet-border overflow-hidden shadow-sm"
            >
              <div className="p-8 border-b-2 border-viet-border bg-viet-bg/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-viet-green text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                    {material.category}
                  </span>
                  <div className="flex gap-4 text-xs font-bold text-viet-text-light uppercase tracking-tighter">
                    <span>👁️ {material.view_count} {t('material_detail.views')}</span>
                    <span>⬇️ {material.download_count} {t('material_detail.downloads')}</span>
                  </div>
                </div>
                <h1 className="text-3xl font-black text-viet-text italic uppercase leading-tight">
                  {material.title}
                </h1>
              </div>

              <div className="p-4 bg-gray-100 min-h-[500px] flex items-center justify-center relative group">
                {isImage && (
                  <img src={material.file_url} className="max-w-full h-auto rounded-xl shadow-lg" alt={material.title} />
                )}
                {isPdf && (
                  <iframe 
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(material.file_url)}&embedded=true`}
                    className="w-full h-[600px] rounded-xl border-none"
                    title="PDF Preview"
                  />
                )}
                {!isImage && !isPdf && (
                  <div className="text-center p-12">
                    <span className="text-6xl mb-4 block">📁</span>
                    <p className="text-viet-text-light font-bold">
                      {t('material_detail.unsupported_format', { type: material.file_type })}
                    </p>
                    <a 
                      href={material.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-6 inline-block bg-viet-text text-white px-10 py-4 rounded-2xl font-black uppercase text-sm"
                    >
                      {t('material_detail.download_to_view')}
                    </a>
                  </div>
                )}
              </div>

              <div className="p-8 flex items-center justify-between bg-white">
                <p className="text-viet-text-light font-medium italic">
                   {material.description || t('material_detail.no_desc')}
                </p>
                <a 
                  href={material.file_url} 
                  download 
                  target="_blank"
                  className="bg-viet-green text-white px-10 py-5 rounded-[24px] font-black uppercase text-sm shadow-xl shadow-viet-green/20 hover:scale-105 transition-all text-center"
                >
                  {t('material_detail.download_btn')}
                </a>
              </div>
            </motion.div>

            {/* Feedback Section */}
            <motion.section 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-white rounded-[40px] border-2 border-viet-border p-8"
            >
              <h3 className="text-2xl font-black text-viet-text uppercase italic mb-8 flex items-center gap-3">
                {t('material_detail.feedback.title_main')} <span className="text-viet-green">{t('material_detail.feedback.title_highlight')}</span>
                <span className="text-sm font-bold text-viet-text-light not-italic">({Array.isArray(feedback) ? feedback.length : 0})</span>
              </h3>

              {isLoggedIn ? (
                <form onSubmit={handleSubmitFeedback} className="mb-12 space-y-4">
                  <div className="flex gap-2 mb-4">
                    {[1,2,3,4,5].map(star => (
                      <button 
                        key={star} 
                        type="button" 
                        onClick={() => setRating(star)}
                        className={`text-2xl transition-all ${rating >= star ? 'scale-110 grayscale-0' : 'grayscale opacity-30 scale-90'}`}
                      >
                        {star <= 2 ? '⭐' : star <= 4 ? '🌟' : '🔥'}
                      </button>
                    ))}
                  </div>
                  <textarea 
                    placeholder={t('material_detail.feedback.placeholder')}
                    className="w-full bg-viet-bg border-2 border-viet-border rounded-3xl p-6 min-h-[120px] outline-none focus:border-viet-green transition-all font-medium text-viet-text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button 
                    disabled={submitting || !newComment.trim()}
                    className="bg-viet-text text-white px-10 py-4 rounded-2xl font-black uppercase text-sm disabled:opacity-50 hover:bg-viet-green transition-colors"
                  >
                    {submitting ? t('material_detail.feedback.submitting_btn') : t('material_detail.feedback.submit_btn')}
                  </button>
                </form>
              ) : (
                <div className="bg-viet-bg rounded-3xl p-8 text-center mb-12">
                   <p className="text-viet-text-light font-bold mb-4 text-sm">{t('material_detail.feedback.login_required')}</p>
                   <Link to="/login" className="text-viet-green font-black uppercase text-xs border-b-2 border-viet-green pb-1 hover:text-viet-text hover:border-viet-text transition-all">{t('material_detail.feedback.login_link')}</Link>
                </div>
              )}

              <div className="space-y-6">
                <AnimatePresence>
                  {Array.isArray(feedback) && feedback.map((f) => (
                    <motion.div 
                      key={f.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-b-2 border-viet-border/30 pb-6 last:border-0"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-viet-green/10 flex items-center justify-center font-black text-viet-green text-sm uppercase">
                            {(f.users?.username || t('material_detail.feedback.default_user')).charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-viet-text text-sm uppercase leading-none">{f.users?.username || t('material_detail.feedback.default_user')}</p>
                            <p className="text-[10px] font-bold text-viet-text-light mt-1">
                              {formatDate(f.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="bg-viet-bg px-3 py-1 rounded-full text-[10px] font-black text-viet-green uppercase">
                           {'★'.repeat(f.rating)}
                        </div>
                      </div>
                      <p className="text-viet-text text-sm font-medium pl-13 leading-relaxed">
                        {f.content}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {(!Array.isArray(feedback) || feedback.length === 0) && (
                  <p className="text-center py-10 text-viet-text-light/50 font-bold text-xs uppercase tracking-widest italic">{t('material_detail.feedback.no_feedback')}</p>
                )}
              </div>
            </motion.section>
          </div>

          {/* Sidebar: Info */}
          <div className="lg:sticky lg:top-32 space-y-8 h-fit max-h-[calc(100vh-10rem)] overflow-y-auto pr-2 custom-scrollbar">
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-viet-text text-white rounded-[40px] p-8"
            >
               <h4 className="text-xs font-black uppercase tracking-widest text-viet-green mb-6">{t('material_detail.sidebar.file_info')}</h4>
               <ul className="space-y-4">
                  <li className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-[10px] font-bold uppercase opacity-60">{t('material_detail.sidebar.format')}</span>
                    <span className="font-black uppercase text-xs">{material.file_type}</span>
                  </li>
                  <li className="flex justify-between border-b border-white/10 pb-4">
                    <span className="text-[10px] font-bold uppercase opacity-60">{t('material_detail.sidebar.posted_date')}</span>
                    <span className="font-black text-xs">{formatDate(material.created_at)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-[10px] font-bold uppercase opacity-60">{t('material_detail.sidebar.size')}</span>
                    <span className="font-black text-xs">FREE</span>
                  </li>
               </ul>

               <div className="mt-12 bg-white/5 rounded-3xl p-6 border border-white/10">
                  <p className="text-[10px] font-bold leading-relaxed opacity-70 italic">
                     "{t('material_detail.sidebar.disclaimer')}"
                  </p>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MaterialDetail;
