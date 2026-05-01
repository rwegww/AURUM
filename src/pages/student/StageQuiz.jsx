import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import MissionModal from '@/components/lessons/MissionModal';
import { useTranslation } from 'react-i18next';

const StageQuiz = () => {
  const { t } = useTranslation();
  const { grade, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const order = searchParams.get('order') || '1';

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/lessons/${lessonId}`);
        const data = await res.json();
        setLesson(data);
      } catch (err) {
        console.error('Lỗi tải bài kiểm tra:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleComplete = () => {
    navigate(`/classroom/${grade}/journey/${lessonId}/reward?order=${order}`);
  };

  const handleCancel = () => {
    navigate(`/classroom/${grade}/journey`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // If no quizzes, skip to reward
  if (!lesson?.quizzes || lesson.quizzes.length === 0) {
    handleComplete();
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <MissionModal
        lessonTitle={lesson?.title || 'Bài kiểm tra'}
        challenges={lesson.quizzes}
        onUnlock={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default StageQuiz;
