import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import MissionModal from '@/components/lessons/MissionModal';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { normalizeJourneyChallenges } from '@/utils/journeyLessonData';

const StageChallenge = () => {
  const { t } = useTranslation();
  const { grade, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const order = searchParams.get('order') || '1';

  const { user } = useAuth();

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [listRes, lessonRes] = await Promise.all([
          fetch(`/api/lessons?classId=${grade}`, { signal: controller.signal }),
          fetch(`/api/lessons/${lessonId}`, { signal: controller.signal }),
        ]);
        if (!listRes.ok || !lessonRes.ok) {
          throw new Error('Không thể tải dữ liệu thử thách của chặng này.');
        }

        const listData = await listRes.json();
        const sortedLessons = Array.isArray(listData) ? listData : [];
        const data = await lessonRes.json();
        setLesson(data);

        if (user?.role !== 'admin' && user?.role !== 'teacher') {
          const currentIndex = sortedLessons.findIndex((item) => String(item.lessonId) === String(lessonId));
          if (currentIndex !== -1) {
            const unlockedLessonIds = (user?.unlockedLessons || []).map(String);
            const isFirstDefaultUnlocked = currentIndex === 0 && ['6', '7', '8'].includes(grade);
            const isPlacedFirstLesson = currentIndex === 0
              && user?.balancingProgress?.placement?.status === 'placed'
              && String(user.balancingProgress.placement.assignedGrade) === String(grade);
            const isSelfUnlocked = unlockedLessonIds.includes(String(lessonId));
            const isPrevUnlocked = currentIndex > 0
              && unlockedLessonIds.includes(String(sortedLessons[currentIndex - 1].lessonId));

            if (!isFirstDefaultUnlocked && !isPlacedFirstLesson && !isSelfUnlocked && !isPrevUnlocked) {
              console.warn('Truy cập bị chặn: Bài học chưa được mở khóa (cần pass test học vượt hoặc hoàn thành bài trước)');
              navigate(`/classroom/${grade}/journey`, { replace: true });
            }
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Lỗi tải thử thách:', err);
          setError(err.message || 'Không thể tải thử thách.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    fetchData();
    return () => controller.abort();
  }, [lessonId, grade, user, navigate]);

  const challenges = useMemo(
    () => normalizeJourneyChallenges(lesson?.challenges),
    [lesson?.challenges],
  );

  useEffect(() => {
    if (!loading && !error && lesson && challenges.length === 0) {
      navigate(`/classroom/${grade}/journey/${lessonId}/quiz?level=level1&order=${order}`, { replace: true });
    }
  }, [challenges.length, error, grade, lesson, lessonId, loading, navigate, order]);

  const handleComplete = () => {
    navigate(`/classroom/${grade}/journey/${lessonId}/quiz?level=level1&order=${order}`);
  };

  const handleCancel = () => {
    navigate(`/classroom/${grade}/journey`);
  };

  if (loading) return (
    <div className="min-h-screen bg-viet-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center px-4">
      <div className="max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl">
        <h1 className="text-xl font-black text-viet-text">Chưa tải được thử thách</h1>
        <p className="mt-3 text-sm font-medium text-viet-text-light">{error}</p>
        <button type="button" onClick={handleCancel} className="mt-6 rounded-2xl bg-viet-green px-6 py-3 font-black text-white">
          Quay lại lộ trình
        </button>
      </div>
    </div>
  );

  if (challenges.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <MissionModal
        lessonTitle={lesson?.title || t('mission_modal.labels.mission')}
        challenges={challenges}
        onUnlock={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default StageChallenge;
