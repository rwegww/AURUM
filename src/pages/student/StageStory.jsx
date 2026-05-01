import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StoryIntro from '@/components/lessons/StoryIntro';
import { useTranslation } from 'react-i18next';

const StageStory = () => {
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
        console.error('Lỗi tải cốt truyện:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleComplete = () => {
    navigate(`/classroom/${grade}/journey/${lessonId}/challenge?order=${order}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  // If no story slides, skip to challenge
  if (!lesson?.storySlides || lesson.storySlides.length === 0) {
    handleComplete();
    return null;
  }

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <StoryIntro 
        slides={lesson.storySlides}
        onComplete={handleComplete}
        onSkip={handleComplete}
      />
    </div>
  );
};

export default StageStory;
