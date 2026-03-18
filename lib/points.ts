/**
 * Points & Gamification Calculation Service
 * Handles all points calculations and rewards
 */

import {
  POINTS_VALUES,
  PointsType,
  PointsEvent,
} from './types/database';

// ============================================================================
// POINTS CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate points earned from exam completion
 * @param score - User's score
 * @param maxScore - Maximum possible score
 * @param timeSpent - Time spent in minutes
 * @returns Points earned
 */
export function calculateExamPoints(
  score: number,
  maxScore: number,
  timeSpent: number
): number {
  let points = 0;

  // Base points for attempting an exam
  points += POINTS_VALUES.EXAM_ATTEMPT;

  // Bonus for completing the exam
  points += POINTS_VALUES.EXAM_COMPLETION;

  // Bonus for perfect score
  const percentage = (score / maxScore) * 100;
  if (percentage === 100) {
    points += POINTS_VALUES.EXAM_PERFECT_SCORE;
  }

  // Performance bonus based on score percentage
  if (percentage >= 90) {
    points += 30;
  } else if (percentage >= 80) {
    points += 20;
  } else if (percentage >= 70) {
    points += 10;
  }

  // Time efficiency bonus (if completed faster than expected)
  // Assume average exam takes 60 minutes
  const expectedTime = 60;
  if (timeSpent < expectedTime && percentage >= 70) {
    const efficiencyBonus = Math.floor((expectedTime - timeSpent) / 5) * 5; // +5 points per 5 minutes saved
    points += efficiencyBonus;
  }

  return points;
}

/**
 * Calculate points earned from quiz completion
 * @param score - User's score
 * @param totalQuestions - Total questions in quiz
 * @returns Points earned
 */
export function calculateQuizPoints(
  score: number,
  totalQuestions: number
): number {
  let points = 0;

  // Points for each correct answer
  points += score * POINTS_VALUES.QUIZ_CORRECT;

  // Bonus for perfect score
  if (score === totalQuestions) {
    points += POINTS_VALUES.QUIZ_PERFECT;
  }

  return points;
}

/**
 * Calculate streak bonus points
 * @param streakDays - Current streak in days
 * @returns Streak bonus points
 */
export function calculateStreakBonus(streakDays: number): number {
  if (streakDays >= 30) {
    return POINTS_VALUES.STREAK_DAY_30;
  } else if (streakDays >= 7) {
    return POINTS_VALUES.STREAK_DAY_7;
  } else if (streakDays >= 3) {
    return POINTS_VALUES.STREAK_DAY_3;
  }
  return 0;
}

/**
 * Check and calculate milestone rewards
 * @param totalExamsCompleted - Total number of exams completed by user
 * @returns Array of milestone rewards earned
 */
export function checkMilestones(totalExamsCompleted: number): PointsEvent[] {
  const milestones: PointsEvent[] = [];
  const now = Math.floor(Date.now() / 1000);

  // Check 10 exams milestone
  if (totalExamsCompleted >= 10 && totalExamsCompleted - 10 < 1) {
    milestones.push({
      type: PointsType.MILESTONE,
      points: POINTS_VALUES.MILESTONE_10_EXAMS,
      timestamp: now,
      metadata: { milestone: '10_EXAMS' },
      reason: 'Completed 10 exams',
    });
  }

  // Check 50 exams milestone
  if (totalExamsCompleted >= 50 && totalExamsCompleted - 50 < 1) {
    milestones.push({
      type: PointsType.MILESTONE,
      points: POINTS_VALUES.MILESTONE_50_EXAMS,
      timestamp: now,
      metadata: { milestone: '50_EXAMS' },
      reason: 'Completed 50 exams',
    });
  }

  // Check 100 exams milestone
  if (totalExamsCompleted >= 100 && totalExamsCompleted - 100 < 1) {
    milestones.push({
      type: PointsType.MILESTONE,
      points: POINTS_VALUES.MILESTONE_100_EXAMS,
      timestamp: now,
      metadata: { milestone: '100_EXAMS' },
      reason: 'Completed 100 exams',
    });
  }

  return milestones;
}

/**
 * Calculate daily login points
 * Only awards points once per day
 * @param lastLoginDate - Last login date (YYYY-MM-DD format)
 * @returns Daily login points if eligible, 0 otherwise
 */
export function calculateDailyLoginPoints(lastLoginDate?: string): number {
  if (!lastLoginDate) {
    return POINTS_VALUES.DAILY_LOGIN;
  }

  const today = new Date().toISOString().split('T')[0];
  if (lastLoginDate !== today) {
    return POINTS_VALUES.DAILY_LOGIN;
  }

  return 0;
}

// ============================================================================
// POINTS EVENT CREATION HELPERS
// ============================================================================

/**
 * Create a points event object
 * @param type - Type of points event
 * @param points - Points earned
 * @param metadata - Additional event metadata
 * @param reason - Human-readable reason
 * @returns Points event object
 */
export function createPointsEvent(
  type: PointsType,
  points: number,
  metadata: Record<string, any>,
  reason?: string
): PointsEvent {
  return {
    type,
    points,
    timestamp: Math.floor(Date.now() / 1000),
    metadata,
    reason,
  };
}

/**
 * Create exam completion points event
 */
export function createExamPointsEvent(
  score: number,
  maxScore: number,
  examId: string,
  subject: string,
  timeSpent: number
): PointsEvent {
  const points = calculateExamPoints(score, maxScore, timeSpent);
  const percentage = Math.round((score / maxScore) * 100);

  return createPointsEvent(
    PointsType.EXAM_COMPLETION,
    points,
    {
      examId,
      subject,
      score,
      maxScore,
      percentage,
      timeSpent,
    },
    `Completed ${subject} exam: ${score}/${maxScore} (${percentage}%)`
  );
}

/**
 * Create quiz completion points event
 */
export function createQuizPointsEvent(
  score: number,
  totalQuestions: number,
  subject: string,
  quizId: string
): PointsEvent {
  const points = calculateQuizPoints(score, totalQuestions);
  const accuracy = Math.round((score / totalQuestions) * 100);

  return createPointsEvent(
    PointsType.QUIZ_CORRECT,
    points,
    {
      quizId,
      subject,
      score,
      totalQuestions,
      accuracy,
    },
    `Quiz: ${score}/${totalQuestions} correct (${accuracy}%)`
  );
}

/**
 * Create streak bonus points event
 */
export function createStreakBonusPointsEvent(streakDays: number): PointsEvent | null {
  const bonus = calculateStreakBonus(streakDays);
  if (bonus === 0) {
    return null;
  }

  let reason = '';
  if (streakDays >= 30) {
    reason = '30-day streak achieved! 🔥';
  } else if (streakDays >= 7) {
    reason = '7-day streak achieved! 🔥';
  } else if (streakDays >= 3) {
    reason = '3-day streak achieved! 🔥';
  }

  return createPointsEvent(
    PointsType.STREAK_BONUS,
    bonus,
    { streakDays },
    reason
  );
}

// ============================================================================
// POINTS VALIDATION
// ============================================================================

/**
 * Validate points value (ensure it's within reasonable bounds)
 * @param points - Points to validate
 * @returns True if valid, false otherwise
 */
export function validatePointsValue(points: number): boolean {
  return (
    typeof points === 'number' &&
    isFinite(points) &&
    points >= 0 &&
    points <= 10000 // Reasonable max per event
  );
}

/**
 * Validate points event
 * @param event - Points event to validate
 * @returns True if valid, false otherwise
 */
export function validatePointsEvent(event: PointsEvent): boolean {
  return (
    event !== null &&
    typeof event === 'object' &&
    typeof event.type === 'string' &&
    typeof event.points === 'number' &&
    typeof event.timestamp === 'number' &&
    validatePointsValue(event.points) &&
    event.timestamp <= Math.floor(Date.now() / 1000) + 60 // Allow 60s clock skew
  );
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  calculateExamPoints,
  calculateQuizPoints,
  calculateStreakBonus,
  checkMilestones,
  calculateDailyLoginPoints,
  createPointsEvent,
  createExamPointsEvent,
  createQuizPointsEvent,
  createStreakBonusPointsEvent,
  validatePointsValue,
  validatePointsEvent,
};
