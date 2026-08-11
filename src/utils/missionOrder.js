const rewardPriority = (mission) => {
  if (mission.isClaimed ?? mission.claimed) return 2;
  const completed = mission.isCompleted ?? (mission.progress >= mission.target);
  return completed ? 0 : 1;
};

// Keep the original order within each status group without mutating API data.
export const sortMissionsByReward = (missions) =>
  [...missions].sort((a, b) => rewardPriority(a) - rewardPriority(b));
