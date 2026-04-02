import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StageVideoModal from '@/components/lessons/StageVideoModal';

const StageIntro = () => {
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
        console.error('Lỗi tải bài học:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

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
        lessonTitle={lesson?.title || "Đang tải..."}
        onComplete={handleComplete}
        onSkip={handleComplete}
        onBack={handleBack}
      />
    </div>
  );
};

export default StageIntro;
