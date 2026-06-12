import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { BookOpen, Play, Search, Video } from 'lucide-react';
import {
  formatSgkLessonReference,
  getAurumLessonOrder,
  getLessonDisplayTitle,
} from '@/utils/lessonLabels';

const Lectures = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const queryGrade = searchParams.get('grade');
  
  const [selectedGrade, setSelectedGrade] = useState(queryGrade ? parseInt(queryGrade) : 6);
  const [bai_hoc, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLessons = async (grade) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lessons?classId=${grade}`);
      const data = await res.json();
      setLessons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Lỗi tải bài giảng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons(selectedGrade);
  }, [selectedGrade]);

  const lessonsWithLabels = bai_hoc.map((lesson, index) => {
    const displayTitle = getLessonDisplayTitle(lesson);
    const sgkReference = formatSgkLessonReference(lesson);

    return {
      ...lesson,
      aurumOrder: getAurumLessonOrder(lesson, index),
      displayTitle,
      sgkReference,
    };
  });

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredLessons = lessonsWithLabels.filter((lesson) => {
    if (!normalizedSearchQuery) return true;

    return [
      lesson.title,
      lesson.displayTitle,
      lesson.description,
      lesson.sgkReference,
    ].some((value) => String(value || '').toLowerCase().includes(normalizedSearchQuery));
  });

  return (
    <div className="min-h-screen bg-viet-bg pt-28 pb-20 px-4 sm:px-6 lg:px-8">
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
             <Search size={18} className="text-viet-text-light" aria-hidden="true" />
          </div>
        </header>

        {/* Grade Filter */}
        <div className="flex flex-wrap gap-3 mb-10">
          {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
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
                to={`/bai_hoc/${selectedGrade}/${lesson.lessonId}?mode=lecture`}
                className="bg-white rounded-[24px] border border-viet-border p-6 hover:shadow-xl hover:shadow-viet-green/5 transition-all group flex flex-col h-full"
              >
                <div className="flex items-center justify-between mb-4">
                   <span className="text-[10px] font-black text-viet-green uppercase tracking-widest">
                      {t('lectures.card.system_lesson', {
                        order: lesson.aurumOrder,
                        defaultValue: 'Bài {{order}} trên AURUM',
                      })}
                   </span>
                   <div className="w-8 h-8 rounded-full bg-viet-green/10 flex items-center justify-center text-viet-green text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={14} fill="currentColor" aria-hidden="true" />
                   </div>
                </div>
                
                <h3 className="text-lg font-bold text-viet-text mb-3 leading-snug group-hover:text-viet-green transition-colors">
                   {lesson.displayTitle}
                </h3>

                {lesson.sgkReference && (
                  <div className="mb-4 inline-flex w-fit max-w-full items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-black tracking-[0.02em] text-amber-700">
                    <BookOpen size={12} aria-hidden="true" />
                    <span className="truncate">({lesson.sgkReference})</span>
                  </div>
                )}
                
                <p className="text-viet-text-light text-xs font-medium line-clamp-2 mb-6 flex-1">
                   {lesson.description}
                </p>

                <div className="flex items-center gap-4 text-[10px] font-bold text-viet-text-light/60 uppercase">
                   <span className="flex items-center gap-1"><Video size={12} aria-hidden="true" /> {t('lectures.metadata.video')}</span>
                   <span className="flex items-center gap-1"><BookOpen size={12} aria-hidden="true" /> {t('lectures.metadata.theory')}</span>
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

