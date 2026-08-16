import React from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';

const StageChallenge = () => {
  const { grade, lessonId } = useParams();
  const [searchParams] = useSearchParams();
  const order = searchParams.get('order') || '1';

  return (
    <Navigate
      replace
      to={`/classroom/${grade}/journey/${lessonId}/quiz?level=level1&order=${order}`}
    />
  );
};

export default StageChallenge;
