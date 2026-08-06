import { describe, expect, it } from 'vitest';
import { buildJourneyPath, createJourneyLayout } from '../src/utils/journeyLayout.js';

const point = (values, offset = 0) => ({ x: values[offset], y: values[offset + 1] });

// Inspect the actual SVG output, not a second implementation of its control handles.
const readSegments = (path) => {
  if (!path) return [];
  const commands = path.match(/[MC][^MC]+/g);
  let start = point(commands[0].slice(1).trim().split(/[\s,]+/).map(Number));
  return commands.slice(1).map((command) => {
    const values = command.slice(1).trim().split(/[\s,]+/).map(Number);
    const segment = [start, point(values), point(values, 2), point(values, 4)];
    start = segment[3];
    return segment;
  });
};

const derivatives = (segment, t) => {
  const first = {};
  const second = {};
  for (const axis of ['x', 'y']) {
    const [a, b, c, d] = segment.map((value) => value[axis]);
    first[axis] = 3 * ((1 - t) ** 2 * (b - a)
      + 2 * (1 - t) * t * (c - b) + t ** 2 * (d - c));
    second[axis] = 6 * ((1 - t) * (c - 2 * b + a) + t * (d - 2 * c + b));
  }
  return { first, second };
};

describe('journey rail geometry', () => {
  it('leaves empty and single-stage journeys without a dangling rail', () => {
    for (const count of [0, 1]) {
      for (const layout of Object.values(createJourneyLayout(count))) {
        expect(layout.points).toHaveLength(count);
        expect(buildJourneyPath(layout)).toBe('');
        expect(buildJourneyPath(layout, 100)).toBe('');
        if (count === 1) expect(layout.points[0].x).toBe(50);
      }
    }
  });

  describe.each(['desktop', 'mobile'])('%s', (variant) => {
    it('passes through every stage in order, including beyond the old five-stage boundary', () => {
      for (const count of [2, 3, 6, 12]) {
        const layout = createJourneyLayout(count)[variant];
        const segments = readSegments(buildJourneyPath(layout));
        const endpoints = [segments[0][0], ...segments.map((segment) => segment[3])];
        expect(layout.points).toHaveLength(count);
        let previousEndpointIndex = -1;
        for (const stage of layout.points) {
          const endpointIndex = endpoints.findIndex((end) => end.x === stage.x && end.y === stage.y);
          expect(endpointIndex).toBeGreaterThan(previousEndpointIndex);
          previousEndpointIndex = endpointIndex;
        }
        expect(previousEndpointIndex).toBe(endpoints.length - 1);
      }
    });

    it('keeps partial progress on the identical rail and stops at the selected stage', () => {
      const layout = createJourneyLayout(12)[variant];
      const fullPath = buildJourneyPath(layout);
      expect(buildJourneyPath(layout, -1)).toBe('');
      expect(buildJourneyPath(layout, 0)).toBe('');
      for (let index = 1; index < layout.points.length; index += 1) {
        const progressPath = buildJourneyPath(layout, index);
        expect(fullPath.startsWith(progressPath)).toBe(true);
        expect(readSegments(progressPath).at(-1)[3]).toEqual({
          x: layout.points[index].x,
          y: layout.points[index].y,
        });
      }
      expect(buildJourneyPath(layout, 100)).toBe(fullPath);
    });

    it('joins adjacent curves with a shared nonzero tangent', () => {
      const segments = readSegments(buildJourneyPath(createJourneyLayout(12)[variant]));
      for (let index = 1; index < segments.length; index += 1) {
        const incoming = derivatives(segments[index - 1], 1).first;
        const outgoing = derivatives(segments[index], 0).first;
        expect(Math.hypot(incoming.x, incoming.y)).toBeGreaterThan(0);
        expect(outgoing.x).toBeCloseTo(incoming.x, 10);
        expect(outgoing.y).toBeCloseTo(incoming.y, 10);
      }
    });
  });

  it.each([320, 390, 580, 581, 900, 901, 1440])(
    'keeps the inside road edge from folding at a %ipx viewport',
    (viewport) => {
      // Match GradeJourney.css: rem-based height/strokes, percentage-based X,
      // 72rem shell and the 580px/900px page-padding and rail-width breakpoints.
      const rem = 16;
      const padding = viewport <= 580 ? 0.55 : viewport <= 900 ? 0.85 : 1.25;
      const mapWidth = Math.min(72 * rem, viewport - 2 * padding * rem);
      const shadowWidth = (viewport <= 580 ? 3.6 : viewport <= 900 ? 4.8 : 6) * rem;
      const layout = createJourneyLayout(6)[viewport <= 900 ? 'mobile' : 'desktop'];
      const segments = readSegments(buildJourneyPath(layout)).map((segment) => (
        segment.map(({ x, y }) => ({ x: x * mapWidth / 100, y: y * rem }))
      ));
      let minimumRadius = Infinity;
      for (const segment of segments) {
        for (let sample = 0; sample <= 100; sample += 1) {
          const { first, second } = derivatives(segment, sample / 100);
          const speed = Math.hypot(first.x, first.y);
          expect(speed).toBeGreaterThan(0);
          const cross = Math.abs(first.x * second.y - first.y * second.x);
          if (cross > 0) minimumRadius = Math.min(minimumRadius, speed ** 3 / cross);
        }
      }
      // An offset curve forms a cusp when the half-stroke exceeds its radius.
      expect(minimumRadius).toBeGreaterThan(shadowWidth / 2);
    },
  );
});
