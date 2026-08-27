import React from 'react';
import { Star } from 'lucide-react';
import { normalizeRating } from '../../../shared/materialPreview';

const RatingStars = ({ rating }) => {
  const normalizedRating = normalizeRating(rating);

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${normalizedRating}/5 sao`}
      title={`${normalizedRating}/5 sao`}
    >
      {Array.from({ length: normalizedRating }, (_, index) => (
        <Star
          key={index}
          size={13}
          fill="currentColor"
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default RatingStars;

