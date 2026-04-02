import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import MissionModal from '@/components/lessons/MissionModal';

const StageChallenge = () => {
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
        console.error('Lỗi tải thử thách:', err);
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
    <div className="min-h-screen bg-viet-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-viet-green border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffbf0]">
      <MissionModal
        lessonTitle={lesson?.title || "Nhiệm vụ nhận biết"}
        challenges={lesson?.challenges && lesson.challenges.length > 0 ? lesson.challenges : [
          {
            type: "image-selection",
            images: [
              "/assets/images/lab-equipment/beaker.png",
              "/assets/images/lab-equipment/test-tube.png",
              "/assets/images/lab-equipment/graduated-cylinder.png",
              "/assets/images/lab-equipment/erlenmeyer-flask.png"
            ],
            question: "Hãy chọn hình ảnh đúng của 'Cốc thủy tinh' để tiếp tục hành trình!",
            correctAnswer: 0,
            targetType: "dụng cụ",
            source: "Tư liệu thực hành"
          }
        ]}
        onUnlock={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default StageChallenge;
