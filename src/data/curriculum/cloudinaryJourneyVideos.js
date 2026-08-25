const CLOUDINARY_CLOUD_NAME = 'dpcorzgkm';
const CURRICULUM_VIDEO_COUNTS = new Map([
  [8, 12],
  [9, 18],
  [10, 23],
]);

export const getCurriculumCloudinaryVideoUrl = (classId, order) => {
  const normalizedClassId = Number(classId);
  const normalizedOrder = Number(order);
  const videoCount = CURRICULUM_VIDEO_COUNTS.get(normalizedClassId) || 0;

  if (!Number.isInteger(normalizedOrder) || normalizedOrder < 1 || normalizedOrder > videoCount) {
    return '';
  }

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/video/upload/chemistry-odyssey/curriculum/${normalizedClassId}-${normalizedOrder}.mp4`;
};

export const withCurriculumCloudinaryVideo = (lesson) => {
  const introVideoUrl = getCurriculumCloudinaryVideoUrl(lesson?.classId, lesson?.order);
  if (!introVideoUrl) return lesson;

  return {
    ...lesson,
    introVideoUrl,
    assets: {
      ...(lesson.assets || {}),
      introVideoUrl,
      journeyVideoUrl: introVideoUrl,
      cloudinaryVideoUrl: introVideoUrl,
    },
  };
};
