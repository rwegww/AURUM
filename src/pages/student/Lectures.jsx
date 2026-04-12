import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

const Lectures = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const queryGrade = searchParams.get('grade');
  
  const [selectedGrade, setSelectedGrade] = useState(queryGrade ? parseInt(queryGrade) : 8);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLessons = async (grade) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lessons?classId=${grade}`);
      const data = await res.json();
      setLessons(data);
    } catch (err) {
      console.error('Lỗi tải bài giảng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons(selectedGrade);
  }, [selectedGrade]);

  const filteredLessons = lessons.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-viet-bg pt-[110px] pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-[32px] font-black text-viet-text uppercase tracking-tight italic mb-2">
              <Trans i18nKey="lectures.title">
                Thư viện <span className="text-viet-green">Bài giảng</span>
              </Trans>
            </h1>
            <p className="text-viet-text-light font-bold">{t('lectures.subtitle')}</p>
          </div>

          <div className="flex bg-white border border-viet-border rounded-[20px] px-4 py-2 w-full md:w-80 shadow-sm focus-within:ring-2 focus-within:ring-viet-green/20 transition-all">
             <input 
                type="text" 
                placeholder={t('lectures.search_placeholder')}
                className="bg-transparent border-none outline-none w-full text-sm font-medium text-viet-text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
             <span className="text-xl">🔍</span>
          </div>
        </header>

        {/* Grade Filter */}
        <div className="flex flex-wrap gap-3 mb-10">
          {[8, 9, 10, 11, 12].map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-8 py-3 rounded-[16px] font-black text-[12px] uppercase tracking-widest transition-all ${
                selectedGrade === grade
                  ? 'bg-viet-green text-white shadow-lg shadow-viet-green/20'
                  : 'bg-white border border-viet-border text-viet-text-light hover:bg-viet-green/5'
              }`}
            >
              {t('lectures.grade_filter', { grade })}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-viet-green/20 border-t-viet-green rounded-full animate-spin mb-4"></div>
            <p className="text-viet-text-light font-bold">{t('lectures.loading')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLessons.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/lessons/${selectedGrade}/${lesson.lessonId}?mode=lecture`}
                className="bg-white rounded-[24px] border border-viet-border p-6 hover:shadow-xl hover:shadow-viet-green/5 transition-all group flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-4">
                   <span className="text-[10px] font-black text-viet-green uppercase tracking-widest">
                      {t('common.lesson', { order: lesson.order || lesson.lessonId.split('_').pop() })}
                   </span>
                   <div className="w-8 h-8 rounded-full bg-viet-green/10 flex items-center justify-center text-viet-green text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      ▶
                   </div>
                </div>
                
                <h3 className="text-lg font-bold text-viet-text mb-3 leading-snug group-hover:text-viet-green transition-colors">
                   {lesson.title}
                </h3>
                
                <p className="text-viet-text-light text-xs font-medium line-clamp-2 mb-6 flex-1">
                   {lesson.description}
                </p>

                <div className="flex items-center gap-4 text-[10px] font-bold text-viet-text-light/60 uppercase">
                   <span className="flex items-center gap-1">🎥 {t('lectures.metadata.video')}</span>
                   <span className="flex items-center gap-1">📖 {t('lectures.metadata.theory')}</span>
                </div>
              </Link>
            ))}
            
            {filteredLessons.length === 0 && (
              <div className="col-span-full text-center py-24 bg-white/50 rounded-[32px] border-2 border-dashed border-viet-border">
                <p className="text-viet-text-light font-bold text-lg">{t('lectures.no_results')}</p>
                <button onClick={() => setSearchQuery('')} className="mt-4 text-viet-green font-bold hover:underline">{t('lectures.clear_filters')}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Lectures;
