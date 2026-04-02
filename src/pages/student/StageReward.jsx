import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import StageRewardModal from '@/components/lessons/StageRewardModal';

const StageReward = () => {
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
        console.error('Lỗi tải phần thưởng:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [lessonId]);

  const handleReturnToJourney = () => {
    navigate(`/classroom/${grade}/journey`);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#fffbf0] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <StageRewardModal
        rewardSrc={`/assets/curriculum/class${grade}/${grade}-${order}.png`}
        lessonTitle={lesson?.title || "Phần thưởng chặng"}
        onProceed={handleReturnToJourney}
      />
    </div>
  );
};

export default StageReward;
