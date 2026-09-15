export const isJourneyAnswerCorrect = (question, answer) => {
  if (question.type === 'multiple-choice' || question.type === 'image-selection') {
    return answer !== null && answer !== '' && Number(answer) === Number(question.correctAnswer);
  }
  if (question.type === 'fill-in-the-blank') {
    return String(answer ?? '').trim().toLowerCase() === String(question.correctAnswer ?? '').trim().toLowerCase();
  }
  if (question.type === 'drag-drop' || question.type === 'matching') {
    return Array.isArray(answer) && JSON.stringify(answer.map((item) => item.id)) === JSON.stringify(question.correctOrder);
  }
  return question.type === 'lab-task' && answer === true;
};
