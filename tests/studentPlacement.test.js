import { describe, expect, it } from 'vitest';
import { getPlacementAssessment, gradePlacementAssessment, PLACEMENT_GRADES } from '../api/data/placementAssessments.js';
import { canAccessJourneyGrade, isStudentPlaced, usesInitialPlacement } from '../src/utils/studentPlacement.js';

describe('student grade placement', () => {
  it('publishes seven questions for every supported grade without leaking answer keys', () => {
    expect(PLACEMENT_GRADES).toEqual(['6', '7', '8', '9', '10', '11', '12']);

    PLACEMENT_GRADES.forEach((grade) => {
      const assessment = getPlacementAssessment(grade);
      expect(assessment.questions).toHaveLength(7);
      expect(assessment.passingPercent).toBe(70);
      assessment.questions.forEach((question) => {
        expect(question).not.toHaveProperty('correctAnswer');
        expect(question.options.length).toBeGreaterThanOrEqual(4);
      });
    });
  });

  it('uses the server answer key and the 70 percent threshold', () => {
    const fiveCorrectAnswers = {
      'g9-1': 1,
      'g9-2': 1,
      'g9-3': 0,
      'g9-4': 1,
      'g9-5': 0,
      'g9-6': 0,
      'g9-7': 0,
    };
    const passing = gradePlacementAssessment('9', fiveCorrectAnswers);
    expect(passing).toMatchObject({ correct: 5, total: 7, percent: 71, passed: true });

    const failing = gradePlacementAssessment('9', { ...fiveCorrectAnswers, 'g9-5': 2 });
    expect(failing).toMatchObject({ correct: 4, total: 7, percent: 57, passed: false });
    expect(gradePlacementAssessment('9', { 'g9-1': 1 })).toBeNull();
  });

  it('restricts only newly managed students to their confirmed grade', () => {
    const unassigned = { role: 'student', balancingProgress: { placement: { required: true, status: 'unassigned' } } };
    const placed = { role: 'student', balancingProgress: { placement: { required: true, status: 'placed', assignedGrade: '9' } } };
    const legacy = { role: 'student', balancingProgress: { passedGrades: [] } };

    expect(usesInitialPlacement(unassigned)).toBe(true);
    expect(isStudentPlaced(unassigned)).toBe(false);
    expect(canAccessJourneyGrade(unassigned, '9')).toBe(false);
    expect(canAccessJourneyGrade(placed, '9')).toBe(true);
    expect(canAccessJourneyGrade(placed, '10')).toBe(false);
    expect(canAccessJourneyGrade(legacy, '10')).toBe(true);
  });
});

