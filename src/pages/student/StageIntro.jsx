import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StageVideoModal from '@/components/lessons/StageVideoModal';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

const StageIntro = () => {
  const { t } = useTranslation();
  const { grade, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const order = searchParams.get('order') || '1';

  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all lessons for this grade to determine order
        const listRes = await fetch(`/api/lessons?classId=${grade}`);
        const listData = await listRes.json();
        const sortedLessons = Array.isArray(listData) ? listData : [];
        setLessons(sortedLessons);

        const res = await fetch(`/api/lessons/${lessonId}`);
        const data = await res.json();
        setLesson(data);

        // Security check
        if (user?.role !== 'admin' && user?.role !== 'teacher') {
          const currentIndex = sortedLessons.findIndex(l => l.lessonId === lessonId);
          if (currentIndex !== -1) {
            const isFirstOfG8 = currentIndex === 0 && grade === '8';
            const isSelfUnlocked = user?.unlockedLessons?.includes(lessonId);
            const isPrevUnlocked = currentIndex > 0 && user?.unlockedLessons?.includes(sortedLessons[currentIndex - 1].lessonId);
            
            if (!isFirstOfG8 && !isSelfUnlocked && !isPrevUnlocked) {
              console.warn('Truy cập bị chặn: Bài học chưa được mở khóa (cần pass test học vượt hoặc hoàn thành bài trước)');
              navigate(`/classroom/${grade}/journey`);
            }
          }
        }

      } catch (err) {
        console.error('Lỗi tải bài học:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lessonId, grade, user, navigate]);


  const handleComplete = () => {
    navigate(`/classroom/${grade}/journey/${lessonId}/challenge?order=${order}`);
  };

  const handleBack = () => {
    navigate(`/classroom/${grade}/journey`);
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <StageVideoModal
        videoSrc={`/assets/curriculum/class${grade}/${grade}-${order}.mp4`}
        lessonTitle={lesson?.title || t('common.loading')}
        onComplete={handleComplete}
        onSkip={handleComplete}
        onBack={handleBack}
      />
    </div>
  );
};

export default StageIntro;
