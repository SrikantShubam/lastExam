/**
 * Database Schema Types for Batch 2
 * All Firestore collection and document types
 */

// ============================================================================
// LEADERBOARD TYPES
// ============================================================================

export interface LeaderboardEntry {
  uid: string;
  name: string;
  avatarUrl?: string;
  totalPoints: number;
  examsCompleted: number;
  currentStreak: number;
  lastActive: number; // timestamp (seconds)
  rank?: number; // denormalized for queries
}

export interface SubjectLeaderboardEntry extends LeaderboardEntry {
  subjectPoints: number;
}

export interface ExamLeaderboardEntry extends LeaderboardEntry {
  examPoints: number;
}

// Leaderboard collections structure:
// leaderboards/global/entries/{uid}
// leaderboards/subjects/{subject}/entries/{uid}
// leaderboards/exams/{examId}/entries/{uid}

export type LeaderboardCategory = 'global' | 'subject' | 'exam';

export interface LeaderboardQueryParams {
  category: LeaderboardCategory;
  categoryValue?: string; // subject name or exam ID
  limit?: number;
  offset?: number;
  currentUserUid?: string;
}

export interface LeaderboardResponse {
  category: LeaderboardCategory;
  entries: LeaderboardEntry[];
  currentUserRank?: {
    rank: number;
    totalPoints: number;
  };
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// ============================================================================
// USER EXAM HISTORY TYPES
// ============================================================================

export interface ExamHistoryDocument {
  examId: string;
  examName: string;
  subject: string;
  paper: string;
  score: number;
  maxScore: number;
  percentage: number;
  timestamp: number; // timestamp (seconds)
  timeSpent: number; // minutes
  questionsAttempted: number;
  questionsCorrect: number;
  detailedResults: QuestionResult[];
  pointsEarned: number;
}

export interface QuestionResult {
  questionId: string;
  questionText?: string;
  userAnswer?: string;
  correctAnswer?: string;
  isCorrect: boolean;
  timeTaken: number; // seconds
  explanation?: string;
}

// User exam history structure:
// users/{uid}/examHistory/{historyId}

export interface ExamHistoryQueryParams {
  limit?: number;
  offset?: number;
  subject?: string;
  fromDate?: number; // timestamp
  toDate?: number; // timestamp
}

// ============================================================================
// QUIZ HISTORY TYPES
// ============================================================================

export interface QuizHistoryDocument {
  quizId: string;
  subject: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timestamp: number; // timestamp (seconds)
  timeTaken?: number; // minutes
  questionsAttempted: string[];
}

// Quiz history structure:
// users/{uid}/quizHistory/{quizId}

export interface QuizHistoryQueryParams {
  limit?: number;
  offset?: number;
  subject?: string;
}

// ============================================================================
// SUBJECT STATS TYPES
// ============================================================================

export interface SubjectStatsDocument {
  totalQuestionsAnswered: number;
  correctAnswers: number;
  averageAccuracy: number;
  bestScore: number;
  examsAttempted: number;
  timeSpent: number; // minutes
  weakTopics: TopicAccuracy[];
  strongTopics: TopicAccuracy[];
}

export interface TopicAccuracy {
  topic: string;
  accuracy: number;
}

// Subject stats structure:
// users/{uid}/subjects/{subject}/stats

// ============================================================================
// USER ANALYTICS TYPES
// ============================================================================

export interface UserAnalyticsDocument {
  weeklyActivity: WeeklyActivity[];
  skillGaps: SubjectSkillGap[];
  improvementTrends: ImprovementTrends;
  updatedAt: number; // timestamp (seconds)
}

export interface WeeklyActivity {
  date: string; // "YYYY-MM-DD"
  points: number;
  examsCompleted: number;
}

export interface SubjectSkillGap {
  subject: string;
  accuracy: number;
}

export interface ImprovementTrends {
  overallAccuracy: {
    lastMonth: number;
    thisMonth: number;
  };
  averageScore: {
    lastMonth: number;
    thisMonth: number;
  };
}

// User analytics structure:
// users/{uid}/analytics

// ============================================================================
// POINTS & GAMIFICATION TYPES
// ============================================================================

export enum PointsType {
  EXAM_ATTEMPT = 'EXAM_ATTEMPT',
  EXAM_COMPLETION = 'EXAM_COMPLETION',
  EXAM_PERFECT_SCORE = 'EXAM_PERFECT_SCORE',
  QUIZ_CORRECT = 'QUIZ_CORRECT',
  QUIZ_PERFECT = 'QUIZ_PERFECT',
  DAILY_LOGIN = 'DAILY_LOGIN',
  STREAK_BONUS = 'STREAK_BONUS',
  MILESTONE = 'MILESTONE',
}

export interface PointsEvent {
  type: PointsType;
  points: number;
  timestamp: number; // timestamp (seconds)
  metadata: Record<string, any>;
  reason?: string;
}

export const POINTS_VALUES = {
  EXAM_ATTEMPT: 10,
  EXAM_COMPLETION: 50,
  EXAM_PERFECT_SCORE: 100,
  QUIZ_CORRECT: 10,
  QUIZ_PERFECT: 50,
  DAILY_LOGIN: 5,
  STREAK_DAY_3: 20,
  STREAK_DAY_7: 50,
  STREAK_DAY_30: 100,
  MILESTONE_10_EXAMS: 100,
  MILESTONE_50_EXAMS: 500,
  MILESTONE_100_EXAMS: 1000,
} as const;

export interface PointsUpdateRequest {
  userId: string;
  type: PointsType;
  metadata: Record<string, any>;
}

export interface PointsUpdateResponse {
  success: boolean;
  totalPoints: number;
  pointsAdded: number;
  message?: string;
}

// ============================================================================
// ANALYTICS OVERVIEW TYPES
// ============================================================================

export interface AnalyticsOverview {
  totalPoints: number;
  examsCompleted: number;
  currentStreak: number;
  bestStreak: number;
  averageAccuracy: number;
  timeSpentStudying: number; // minutes
  subjectsMastered: string[];
  subjectsNeedingWork: string[];
  weeklyProgress: WeeklyProgress[];
  improvementTrend: number; // positive = improving
}

export interface WeeklyProgress {
  date: string; // "YYYY-MM-DD"
  points: number;
  exams: number;
}

// ============================================================================
// SUBJECT ANALYTICS TYPES
// ============================================================================

export interface SubjectAnalytics {
  subject: string;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  averageTimePerQuestion: number; // seconds
  weakTopics: TopicAccuracy[];
  strongTopics: TopicAccuracy[];
  examHistory: ExamHistorySummary[];
  accuracyTrend: number[]; // last 5 attempts
}

export interface ExamHistorySummary {
  examId: string;
  score: number;
  percentage: number;
  timestamp: number;
}

// ============================================================================
// QUIZ HISTORY RESPONSE TYPES
// ============================================================================

export interface QuizHistoryResponse {
  totalQuizzesTaken: number;
  averageAccuracy: number;
  bestScore: number;
  recentQuizzes: RecentQuiz[];
  subjectBreakdown: SubjectBreakdown;
}

export interface RecentQuiz {
  quizId: string;
  subject: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timestamp: number;
  timeTaken?: number;
}

export interface SubjectBreakdown {
  [subject: string]: {
    total: number;
    bestScore: number;
    avgAccuracy: number;
  };
}

// ============================================================================
// LEADERBOARD UPDATE TYPES
// ============================================================================

export interface LeaderboardUpdateRequest {
  userId: string;
  category: LeaderboardCategory;
  categoryValue?: string;
  pointsEarned: number;
  examCompleted?: boolean;
}

export interface LeaderboardUpdateResponse {
  success: boolean;
  newPoints: number;
  newRank?: number;
  message?: string;
}
