import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import Footer from '@/components/common/Footer';

const Library = () => {
  const { t } = useTranslation();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const url = `/api/materials?category=${encodeURIComponent(category)}&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      setMaterials(data);
    } catch (err) {
      console.error(t('library.loading_error'), err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [category, search]);

  const categories = [
    { id: '', name: t('library.categories.all') },
    { id: 'INFOGRAPHIC HÓA 11', name: t('library.categories.infographic_11') },
    { id: 'INFOGRAPHIC HÓA 12', name: t('library.categories.infographic_12') },
    { id: 'SĐTD HÓA 10', name: t('library.categories.mindmap_10') },
    { id: 'SĐTD HÓA 11', name: t('library.categories.mindmap_11') },
    { id: 'SĐTD HÓA 12', name: t('library.categories.mindmap_12') },
    { id: 'PHIẾU HỌC TẬP HÓA 12', name: t('library.categories.worksheet_12') },
    { id: 'TRUYỆN TRANH HÓA 10', name: t('library.categories.comic_10') },
    { id: 'TRUYỆN TRANH 11', name: t('library.categories.comic_11') },
    { id: 'TRUYỆN TRANH HÓA 12', name: t('library.categories.comic_12') },
    { id: 'PHT HÓA 9', name: t('library.categories.worksheet_9') },
    { id: 'SĐTD KHTN 6', name: t('library.categories.mindmap_6') },
  ];

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.02_135)] pt-28 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-viet-green selection:text-white">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <h1 className="font-rubik text-5xl md:text-6xl font-black text-[#1a1a1a] uppercase tracking-tight leading-none mb-4">
                <Trans i18nKey="library.title">
                  Thư viện <span className="text-viet-green">Học liệu</span>
                </Trans>
              </h1>
              <p className="text-[#1a1a1a]/70 font-bold text-lg">{t('library.subtitle')}</p>
            </div>

            <div className="relative w-full md:w-96 group">
              <input 
                type="text" 
                placeholder={t('library.search_placeholder')}
                className="w-full bg-white border-2 border-duo-border border-b-4 rounded-full py-4 px-12 focus:ring-0 focus:outline-none focus:border-gray-300 transition-all font-bold text-[#1a1a1a]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl grayscale group-focus-within:grayscale-0 transition-all">🔍</span>
            </div>
          </motion.div>
        </header>

        {/* Categories Bar */}
        <div className="flex overflow-x-auto gap-3 pb-8 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`whitespace-nowrap px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                category === cat.id
                  ? 'btn-tactile-green'
                  : 'bg-white text-[#1a1a1a] border-2 border-duo-border border-b-4 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-viet-green/10 border-t-viet-green rounded-full animate-spin mb-6"></div>
            <p className="text-viet-text-light font-black uppercase tracking-widest animate-pulse">{t('library.loading')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {materials.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/library/${item.id}`}
                  className="card-tactile p-5 h-full transition-all group flex flex-col relative overflow-hidden hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="bg-viet-green text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                        {t('library.card.view_details')}
                     </span>
                  </div>

                  <div className="w-full aspect-[4/3] bg-viet-bg rounded-[24px] mb-6 flex items-center justify-center text-4xl overflow-hidden border border-viet-border/50">
                    {item.file_type === 'pdf' ? '📄' : 
                     item.file_type?.match(/png|jpg|jpeg|webp/) ? (
                       <img src={item.file_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                     ) : '📁'}
                  </div>
                  
                  <div className="flex-1">
                    <span className="text-[10px] font-black text-viet-green uppercase tracking-widest mb-2 block">
                      {item.category || t('library.card.default_category')}
                    </span>
                    <h3 className="text-lg font-bold text-viet-text mb-2 leading-tight line-clamp-2">
                       {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-viet-border/50">
                    <div className="flex items-center gap-3 text-[10px] font-bold text-viet-text-light uppercase">
                       <span>👁️ {item.view_count || 0}</span>
                       <span>⬇️ {item.download_count || 0}</span>
                    </div>
                    <span className="text-[10px] font-black text-viet-text-light/40 uppercase">
                      #{item.file_type}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}

            {materials.length === 0 && (
              <div className="col-span-full py-24 text-center bg-white/50 rounded-[1.5rem] border-2 border-dashed border-duo-border">
                <span className="text-6xl mb-4 block">📦</span>
                <p className="text-viet-text-light font-black text-xl uppercase tracking-widest">{t('library.empty.title')}</p>
                <button onClick={() => {setCategory(''); setSearch('');}} className="mt-4 text-viet-green font-bold hover:underline">{t('library.empty.clear_btn')}</button>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Library;
