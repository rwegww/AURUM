export const PLACEMENT_GRADES = Object.freeze(['6', '7', '8', '9', '10', '11', '12']);

export const getStudentPlacement = (user) => user?.balancingProgress?.placement || null;

export const usesInitialPlacement = (user) => (
  user?.role === 'student' && getStudentPlacement(user)?.required === true
);

export const isStudentPlaced = (user) => {
  const placement = getStudentPlacement(user);
  return placement?.status === 'placed' && PLACEMENT_GRADES.includes(String(placement.assignedGrade));
};

export const canAccessJourneyGrade = (user, grade) => {
  if (!usesInitialPlacement(user)) return true;
  if (!isStudentPlaced(user)) return false;
  return String(getStudentPlacement(user).assignedGrade) === String(grade);
};

