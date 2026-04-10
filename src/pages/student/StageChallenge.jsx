import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import MissionModal from '@/components/lessons/MissionModal';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

const StageChallenge = () => {
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
        console.error('Lỗi tải thử thách:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lessonId, grade, user, navigate]);


  const handleComplete = () => {
    navigate(`/classroom/${grade}/journey/${lessonId}/reward?order=${order}`);
  };

  const handleCancel = () => {
    navigate(`/classroom/${grade}/journey`);
  };

  if (loading) return (
    <div className="min-h-screen bg-viet-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <MissionModal
        lessonTitle={lesson?.title || t('mission_modal.labels.mission')}
        challenges={lesson?.challenges && lesson.challenges.length > 0 ? lesson.challenges : [
          {
            type: "image-selection",
            images: [
              "/assets/images/lab-equipment/beaker.png",
              "/assets/images/lab-equipment/test-tube.png",
              "/assets/images/lab-equipment/graduated-cylinder.png",
              "/assets/images/lab-equipment/erlenmeyer-flask.png"
            ],
            question: t('mission_modal.image_selection.fallback_question'),
            correctAnswer: 0,
            targetType: t('mission_modal.labels.target_type_fallback'),
            source: t('mission_modal.source_fallback')
          }
        ]}
        onUnlock={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default StageChallenge;
