import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import Footer from '@/components/common/Footer';
import { Download, Eye, FileText, Folder, PackageOpen, Search } from 'lucide-react';
import { CHEMISTRY_GRADES, CHEMISTRY_TYPES } from '@/constants/materialCategories';

const Library = () => {
  const { t } = useTranslation();
  const [hoc_lieu, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [search, setSearch] = useState('');

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Tính toán category chính xác nếu người dùng chọn cả Grade và Type
      let queryCategory = '';
      if (selectedGrade && selectedType) {
        const gradeLabel = selectedGrade === 'chung' ? 'CHUNG' : `LỚP ${selectedGrade}`;
        const typeObj = CHEMISTRY_TYPES.find(t => t.id === selectedType);
        const typeLabel = typeObj ? typeObj.label : '';
        queryCategory = `HÓA ${gradeLabel} - ${typeLabel}`;
      }

      // 2. Fetch từ API. Nếu queryCategory trống, API sẽ trả về tất cả
      const url = `/api/materials?category=${encodeURIComponent(queryCategory)}&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();

      // 3. Thực hiện lọc client-side nếu queryCategory trống (tức là fetch tất cả vì 1 trong 2 filter là 'Tất cả')
      let filteredData = Array.isArray(data) ? data : [];
      if (!queryCategory) {
        if (selectedGrade) {
          const gradeLabel = selectedGrade === 'chung' ? 'CHUNG' : `LỚP ${selectedGrade}`;
          filteredData = filteredData.filter(item => 
            item.category && item.category.includes(`HÓA ${gradeLabel}`)
          );
        }
        if (selectedType) {
          const typeObj = CHEMISTRY_TYPES.find(t => t.id === selectedType);
          const typeLabel = typeObj ? typeObj.label : '';
          filteredData = filteredData.filter(item => 
            item.category && item.category.includes(` - ${typeLabel}`)
          );
        }
      }

      setMaterials(filteredData);
    } catch (err) {
      console.error(t('library.loading_error'), err);
    } finally {
      setLoading(false);
    }
  }, [selectedGrade, selectedType, search, t]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const grades = [
    { id: '', label: t('library.filter.all_grades', 'Tất cả lớp') },
    { id: 'chung', label: t('library.filter.grade_general', 'Hóa Chung') },
    { id: '7', label: t('library.filter.grade_7', 'Lớp 7') },
    { id: '8', label: t('library.filter.grade_8', 'Lớp 8') },
    { id: '9', label: t('library.filter.grade_9', 'Lớp 9') },
    { id: '10', label: t('library.filter.grade_10', 'Lớp 10') },
    { id: '11', label: t('library.filter.grade_11', 'Lớp 11') },
    { id: '12', label: t('library.filter.grade_12', 'Lớp 12') },
  ];

  const types = [
    { id: '', label: t('library.filter.all_types', 'Tất cả loại') },
    { id: 'bai_giang', label: t('library.filter.type_lecture', 'Bài giảng') },
    { id: 'de_thi', label: t('library.filter.type_exam', 'Đề thi') },
    { id: 'de_on', label: t('library.filter.type_review', 'Đề ôn') },
    { id: 'anh', label: t('library.filter.type_image', 'Ảnh minh họa') },
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
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-viet-text-light transition-all group-focus-within:text-viet-green" aria-hidden="true" />
            </div>
          </motion.div>
        </header>

        {/* Filter Panel */}
        <div className="bg-white border-2 border-duo-border rounded-[2rem] p-6 mb-8 shadow-sm flex flex-col gap-4">
          {/* Grade Selector */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <span className="text-[11px] font-black text-viet-text-light uppercase tracking-widest min-w-[100px] select-none">
              {t('library.filter.by_grade', 'Khối lớp')}:
            </span>
            <div className="flex overflow-x-auto gap-2 pb-1 md:pb-0 no-scrollbar scroll-smooth">
              {grades.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGrade(g.id)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                    selectedGrade === g.id
                      ? 'btn-tactile-green text-white'
                      : 'bg-slate-50 text-[#1a1a1a] border-2 border-slate-200 border-b-4 hover:bg-slate-100 hover:scale-105 active:scale-95'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-slate-100 w-full" />

          {/* Type Selector */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <span className="text-[11px] font-black text-viet-text-light uppercase tracking-widest min-w-[100px] select-none">
              {t('library.filter.by_type', 'Loại tài liệu')}:
            </span>
            <div className="flex overflow-x-auto gap-2 pb-1 md:pb-0 no-scrollbar scroll-smooth">
              {types.map((tp) => (
                <button
                  key={tp.id}
                  onClick={() => setSelectedType(tp.id)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all ${
                    selectedType === tp.id
                      ? 'btn-tactile-green text-white'
                      : 'bg-slate-50 text-[#1a1a1a] border-2 border-slate-200 border-b-4 hover:bg-slate-100 hover:scale-105 active:scale-95'
                  }`}
                >
                  {tp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-16 h-16 border-4 border-viet-green/10 border-t-viet-green rounded-full animate-spin mb-6"></div>
            <p className="text-viet-text-light font-black uppercase tracking-widest animate-pulse">{t('library.loading')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {hoc_lieu.map((item, index) => (
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
                    {item.file_type === 'pdf' ? <FileText size={42} className="text-viet-green" aria-hidden="true" /> : 
                     item.file_type?.match(/png|jpg|jpeg|webp/) ? (
                       <img src={item.file_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.title} />
                     ) : <Folder size={42} className="text-viet-text-light" aria-hidden="true" />}
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
                       <span className="flex items-center gap-1"><Eye size={12} aria-hidden="true" /> {item.view_count || 0}</span>
                       <span className="flex items-center gap-1"><Download size={12} aria-hidden="true" /> {item.download_count || 0}</span>
                    </div>
                    <span className="text-[10px] font-black text-viet-text-light/40 uppercase">
                      #{item.file_type}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}

            {hoc_lieu.length === 0 && (
              <div className="col-span-full py-24 text-center bg-white/50 rounded-[1.5rem] border-2 border-dashed border-duo-border">
                <PackageOpen size={56} className="mx-auto mb-4 text-viet-text-light/30" aria-hidden="true" />
                <p className="text-viet-text-light font-black text-xl uppercase tracking-widest">{t('library.empty.title')}</p>
                <button onClick={() => {setSelectedGrade(''); setSelectedType(''); setSearch('');}} className="mt-4 text-viet-green font-bold hover:underline">{t('library.empty.clear_btn')}</button>
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
