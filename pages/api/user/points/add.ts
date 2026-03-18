/**
 * Points Update API Route
 * Adds points to user account and updates leaderboards
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { admin, firestore } from '../../../lib/firebase-admin';
import {
  PointsType,
  PointsEvent,
  PointsUpdateRequest,
  PointsUpdateResponse,
  LeaderboardEntry,
  LeaderboardCategory,
} from '../../../lib/types/database';
import {
  validatePointsEvent,
  createPointsEvent,
} from '../../../lib/points';

/**
 * POST /api/user/points/add
 *
 * Request body:
 * {
 *   userId: string,
 *   type: "EXAM" | "QUIZ" | "LOGIN" | "MILESTONE" | "STREAK_BONUS",
 *   metadata: { score, maxScore, subject, examId, etc. }
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   totalPoints: number,
 *   pointsAdded: number,
 *   message?: string
 * }
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PointsUpdateResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { userId, type, metadata } = req.body as PointsUpdateRequest;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'Missing required field: userId' });
    }

    if (!type) {
      return res.status(400).json({ error: 'Missing required field: type' });
    }

    if (!metadata || typeof metadata !== 'object') {
      return res.status(400).json({ error: 'Missing required field: metadata' });
    }

    // Verify user exists
    const userDoc = await firestore.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate points based on type
    let pointsToAdd = 0;
    let reason = '';

    switch (type) {
      case PointsType.EXAM_COMPLETION: {
        const { score, maxScore, examId, subject, timeSpent } = metadata;
        if (typeof score !== 'number' || typeof maxScore !== 'number') {
          return res.status(400).json({ error: 'Missing score or maxScore for exam event' });
        }

        // Import points calculation from lib/points
        const pointsModule = await import('../../../lib/points');
        const event = pointsModule.createExamPointsEvent(score, maxScore, examId, subject, timeSpent || 0);
        pointsToAdd = event.points;
        reason = event.reason || '';
        break;
      }

      case PointsType.QUIZ_CORRECT: {
        const { score, totalQuestions, quizId, subject } = metadata;
        if (typeof score !== 'number' || typeof totalQuestions !== 'number') {
          return res.status(400).json({ error: 'Missing score or totalQuestions for quiz event' });
        }

        const pointsModule = await import('../../../lib/points');
        const event = pointsModule.createQuizPointsEvent(score, totalQuestions, subject, quizId);
        pointsToAdd = event.points;
        reason = event.reason || '';
        break;
      }

      case PointsType.DAILY_LOGIN: {
        pointsToAdd = 5; // POINTS_VALUES.DAILY_LOGIN
        reason = 'Daily login';
        break;
      }

      case PointsType.STREAK_BONUS: {
        const { streakDays } = metadata;
        if (typeof streakDays !== 'number') {
          return res.status(400).json({ error: 'Missing streakDays for streak bonus' });
        }

        const pointsModule = await import('../../../lib/points');
        const bonus = pointsModule.calculateStreakBonus(streakDays);
        pointsToAdd = bonus;
        reason = pointsModule.createStreakBonusPointsEvent(streakDays)?.reason || 'Streak bonus';
        break;
      }

      case PointsType.MILESTONE: {
        const { milestone } = metadata;
        const pointsModule = await import('../../../lib/points');
        const pointsValues = pointsModule.POINTS_VALUES;

        switch (milestone) {
          case '10_EXAMS':
            pointsToAdd = pointsValues.MILESTONE_10_EXAMS;
            reason = 'Completed 10 exams';
            break;
          case '50_EXAMS':
            pointsToAdd = pointsValues.MILESTONE_50_EXAMS;
            reason = 'Completed 50 exams';
            break;
          case '100_EXAMS':
            pointsToAdd = pointsValues.MILESTONE_100_EXAMS;
            reason = 'Completed 100 exams';
            break;
          default:
            return res.status(400).json({ error: `Unknown milestone: ${milestone}` });
        }
        break;
      }

      default:
        return res.status(400).json({ error: `Unknown points type: ${type}` });
    }

    if (pointsToAdd <= 0) {
      return res.status(400).json({ error: 'Invalid points calculation: no points to add' });
    }

    // Create points event
    const pointsEvent: PointsEvent = {
      type,
      points: pointsToAdd,
      timestamp: Math.floor(Date.now() / 1000),
      metadata,
      reason,
    };

    // Validate event
    if (!validatePointsEvent(pointsEvent)) {
      return res.status(400).json({ error: 'Invalid points event' });
    }

    // Use transaction to update user points and log history
    await firestore.runTransaction(async (transaction) => {
      const userRef = firestore.collection('users').doc(userId);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        throw new Error('User not found in transaction');
      }

      const userData = userDoc.data()!;
      const currentPoints = userData.totalPoints || 0;
      const newPoints = currentPoints + pointsToAdd;

      // Update total points
      transaction.update(userRef, {
        totalPoints: newPoints,
        lastActive: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Add to points history
      const pointsHistoryRef = userRef.collection('pointsHistory');
      const newHistoryRef = pointsHistoryRef.doc();
      transaction.set(newHistoryRef, pointsEvent);

      // Update global leaderboard
      const globalLeaderboardRef = firestore
        .collection('leaderboards')
        .doc('global')
        .collection('entries')
        .doc(userId);

      const globalLeaderboardDoc = await transaction.get(globalLeaderboardRef);

      const leaderboardData: Partial<LeaderboardEntry> = {
        uid: userId,
        name: userData.name || 'User',
        avatarUrl: userData.avatarUrl || '',
        totalPoints: newPoints,
        examsCompleted: metadata.examCompleted ? admin.firestore.FieldValue.increment(1) : (globalLeaderboardDoc.data()?.examsCompleted || 0),
        currentStreak: userData.currentStreak || 0,
        lastActive: Math.floor(Date.now() / 1000),
      };

      if (globalLeaderboardDoc.exists) {
        transaction.update(globalLeaderboardRef, leaderboardData);
      } else {
        transaction.set(globalLeaderboardRef, leaderboardData as LeaderboardEntry);
      }

      // Update subject-specific leaderboard if subject metadata exists
      if (metadata.subject) {
        const subject = metadata.subject;
        const subjectLeaderboardRef = firestore
          .collection('leaderboards')
          .doc('subjects')
          .collection(subject)
          .collection('entries')
          .doc(userId);

        const subjectLeaderboardDoc = await transaction.get(subjectLeaderboardRef);

        const subjectData: Partial<LeaderboardEntry> = {
          uid: userId,
          name: userData.name || 'User',
          avatarUrl: userData.avatarUrl || '',
          totalPoints: newPoints,
          subjectPoints: newPoints,
          examsCompleted: metadata.examCompleted ? admin.firestore.FieldValue.increment(1) : (subjectLeaderboardDoc.data()?.examsCompleted || 0),
          currentStreak: userData.currentStreak || 0,
          lastActive: Math.floor(Date.now() / 1000),
        };

        if (subjectLeaderboardDoc.exists) {
          transaction.update(subjectLeaderboardRef, subjectData);
        } else {
          transaction.set(subjectLeaderboardRef, subjectData as any);
        }
      }

      // Update exam-specific leaderboard if examId metadata exists
      if (metadata.examId) {
        const examId = metadata.examId;
        const examLeaderboardRef = firestore
          .collection('leaderboards')
          .doc('exams')
          .collection(examId)
          .collection('entries')
          .doc(userId);

        const examLeaderboardDoc = await transaction.get(examLeaderboardRef);

        const examData: Partial<LeaderboardEntry> = {
          uid: userId,
          name: userData.name || 'User',
          avatarUrl: userData.avatarUrl || '',
          totalPoints: newPoints,
          examPoints: newPoints,
          examsCompleted: metadata.examCompleted ? admin.firestore.FieldValue.increment(1) : (examLeaderboardDoc.data()?.examsCompleted || 0),
          currentStreak: userData.currentStreak || 0,
          lastActive: Math.floor(Date.now() / 1000),
        };

        if (examLeaderboardDoc.exists) {
          transaction.update(examLeaderboardRef, examData);
        } else {
          transaction.set(examLeaderboardRef, examData as any);
        }
      }
    });

    // Fetch updated total points
    const updatedUserDoc = await firestore.collection('users').doc(userId).get();
    const updatedUser = updatedUserDoc.data()!;
    const totalPoints = updatedUser.totalPoints || 0;

    res.status(200).json({
      success: true,
      totalPoints,
      pointsAdded: pointsToAdd,
      message: reason,
    });

  } catch (error: any) {
    console.error('Error adding points:', error);
    res.status(500).json({ error: 'Failed to add points: ' + (error.message || error) });
  }
}
