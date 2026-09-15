// A quarter ellipse uses this handle length to keep wide turns round.
const ARC_HANDLE = (4 * (Math.SQRT2 - 1)) / 3;
const WAVE_COLUMNS = [-1, 0, 1, 0];
const WAVE_DIRECTIONS = [0, 1, 0, -1];

const makeLayout = (count, amplitude, quarterHeight, stageStride) => {
  const quarterCount = Math.max(0, count - 1) * stageStride;
  const railPoints = Array.from({ length: count > 0 ? quarterCount + 1 : 0 }, (_, index) => ({
    x: count === 1 ? 50 : 50 + amplitude * WAVE_COLUMNS[index % 4],
    y: 10 + index * quarterHeight,
    // Vertical at each turnaround, horizontal through the middle of the map.
    handleX: WAVE_DIRECTIONS[index % 4] * amplitude * ARC_HANDLE,
    handleY: index % 2 === 0 ? quarterHeight * ARC_HANDLE : 0,
  }));

  return {
    height: 20 + quarterCount * quarterHeight,
    points: railPoints.filter((_, index) => index % stageStride === 0),
    railPoints,
    stageStride,
  };
};

// X is a percentage and Y is in rem, shared by the rail and lesson pedestals.
export const createJourneyLayout = (count) => ({
  desktop: makeLayout(count, 26, 12, 1),
  // Keep an intermediate curve point between mobile stages for equally broad bends.
  mobile: makeLayout(count, 20, 7, 2),
});

export const buildJourneyPath = (layout, lastStageIndex = layout.points.length - 1) => {
  const { railPoints, stageStride } = layout;
  if (railPoints.length < 2 || lastStageIndex < 1) return '';

  const lastPointIndex = Math.min(lastStageIndex * stageStride, railPoints.length - 1);
  let path = `M ${railPoints[0].x} ${railPoints[0].y}`;

  for (let index = 1; index <= lastPointIndex; index += 1) {
    const previous = railPoints[index - 1];
    const current = railPoints[index];
    // Both strokes use these same handles, even when progress stops mid-wave.
    path += ` C ${previous.x + previous.handleX} ${previous.y + previous.handleY},`
      + ` ${current.x - current.handleX} ${current.y - current.handleY}, ${current.x} ${current.y}`;
  }

  return path;
};
