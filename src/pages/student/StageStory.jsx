import React from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';

const StageStory = () => {
  const { grade, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const order = searchParams.get('order') || '1';

  return (
    <Navigate
      replace
      to={`/classroom/${grade}/journey/${lessonId}/challenge?order=${order}`}
    />
  );
};

export default StageStory;
