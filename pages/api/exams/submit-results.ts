/**
 * Exam Results Submission API
 * Saves detailed exam results to Firestore and updates points/leaderboards
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { admin, firestore } from '../../../lib/firebase-admin';
import {
  ExamHistoryDocument,
  QuestionResult,
} from '../../../lib/types/database';
import { PointsType } from '../../../lib/types/database';

/**
 * POST /api/exams/submit-results
 *
 * Request body:
 * {
 *   userId: string,
 *   examId: string,
 *   examName: string,
 *   subject: string,
 *   paper: string,
 *   score: number,
 *   maxScore: number,
 *   timeSpent: number, (minutes)
 *   detailedResults: [
 *     {
 *       questionId: string,
 *       questionText?: string,
 *       userAnswer?: string,
 *       correctAnswer?: string,
 *       isCorrect: boolean,
 *       timeTaken: number (seconds),
 *       explanation?: string
 *     }
 *   ]
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   examHistoryId: string,
 *   pointsEarned: number,
 *   message?: string
 * }
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        success: boolean;
        examHistoryId: string;
        pointsEarned: number;
        message?: string;
      }
    | { error: string }
  >
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const {
      userId,
      examId,
      examName,
      subject,
      paper,
      score,
      maxScore,
      timeSpent,
      detailedResults = [],
    } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'Missing required field: userId' });
    }
    if (!examId) {
      return res.status(400).json({ error: 'Missing required field: examId' });
    }
    if (!examName) {
      return res.status(400).json({ error: 'Missing required field: examName' });
    }
    if (!subject) {
      return res.status(400).json({ error: 'Missing required field: subject' });
    }
    if (!paper) {
      return res.status(400).json({ error: 'Missing required field: paper' });
    }
    if (typeof score !== 'number') {
      return res.status(400).json({ error: 'Missing or invalid field: score' });
    }
    if (typeof maxScore !== 'number') {
      return res.status(400).json({ error: 'Missing or invalid field: maxScore' });
    }
    if (typeof timeSpent !== 'number') {
      return res.status(400).json({ error: 'Missing or invalid field: timeSpent' });
    }
    if (!Array.isArray(detailedResults)) {
      return res.status(400).json({ error: 'Missing or invalid field: detailedResults' });
    }

    // Calculate derived fields
    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const questionsAttempted = detailedResults.length;
    const questionsCorrect = detailedResults.filter((q: QuestionResult) => q.isCorrect).length;

    // Calculate points
    const pointsModule = await import('../../../lib/points');
    const pointsEarned = pointsModule.calculateExamPoints(score, maxScore, timeSpent);

    // Use transaction to save exam history and update user stats
    const result = await firestore.runTransaction(async (transaction) => {
      const userRef = firestore.collection('users').doc(userId);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data()!;

      // Save exam history
      const examHistoryRef = userRef.collection('examHistory').doc();
      const examHistoryData: ExamHistoryDocument = {
        examId,
        examName,
        subject,
        paper,
        score,
        maxScore,
        percentage,
        timestamp: Math.floor(Date.now() / 1000),
        timeSpent,
        questionsAttempted,
        questionsCorrect,
        detailedResults,
        pointsEarned,
      };

      transaction.set(examHistoryRef, examHistoryData);

      // Update subject stats
      const subjectStatsRef = userRef.collection('subjects').doc(subject).collection('stats').doc('overview');

      const subjectStatsDoc = await transaction.get(subjectStatsRef);
      let subjectStatsData: any = subjectStatsDoc.exists ? subjectStatsDoc.data()! : {};

      // Update subject stats
      transaction.set(
        subjectStatsRef,
        {
          totalQuestionsAnswered: (subjectStatsData.totalQuestionsAnswered || 0) + questionsAttempted,
          correctAnswers: (subjectStatsData.correctAnswers || 0) + questionsCorrect,
          averageAccuracy: percentage,
          bestScore: Math.max(score, subjectStatsData.bestScore || 0),
          examsAttempted: (subjectStatsData.examsAttempted || 0) + 1,
          timeSpent: (subjectStatsData.timeSpent || 0) + timeSpent,
        },
        { merge: true }
      );

      // Calculate weak/strong topics based on question results
      const topicAccuracy: Record<string, { correct: number; total: number }> = {};

      detailedResults.forEach((question: QuestionResult) => {
        // Try to extract topic from questionId or metadata
        const topic = question.questionId?.split('/')[0] || 'General';
        if (!topicAccuracy[topic]) {
          topicAccuracy[topic] = { correct: 0, total: 0 };
        }
        topicAccuracy[topic].total++;
        if (question.isCorrect) {
          topicAccuracy[topic].correct++;
        }
      });

      const weakTopics: { topic: string; accuracy: number }[] = [];
      const strongTopics: { topic: string; accuracy: number }[] = [];

      Object.entries(topicAccuracy).forEach(([topic, stats]) => {
        const accuracy = stats.correct / stats.total;
        if (accuracy < 0.6) {
          weakTopics.push({ topic, accuracy });
        } else if (accuracy >= 0.8) {
          strongTopics.push({ topic, accuracy });
        }
      });

      // Update analytics
      const analyticsRef = userRef.collection('analytics').doc('overview');
      const analyticsDoc = await transaction.get(analyticsRef);

      let analyticsData: any = analyticsDoc.exists ? analyticsDoc.data()! : {};
      let weeklyActivity = analyticsData.weeklyActivity || [];
      const today = new Date().toISOString().split('T')[0];

      // Update today's activity
      const todayActivity = weeklyActivity.find((a: any) => a.date === today);
      if (todayActivity) {
        todayActivity.points += pointsEarned;
        todayActivity.examsCompleted += 1;
      } else {
        weeklyActivity.push({
          date: today,
          points: pointsEarned,
          examsCompleted: 1,
        });
        // Keep only last 30 days
        weeklyActivity = weeklyActivity.slice(-30);
      }

      transaction.set(
        analyticsRef,
        {
          weeklyActivity,
          updatedAt: Math.floor(Date.now() / 1000),
        },
        { merge: true }
      );

      return {
        examHistoryId: examHistoryRef.id,
        pointsEarned,
      };
    });

    // Call points API to update points and leaderboards
    const pointsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/user/points/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        type: PointsType.EXAM_COMPLETION,
        metadata: {
          examId,
          subject,
          score,
          maxScore,
          timeSpent,
          examCompleted: true,
        },
      }),
    });

    if (!pointsResponse.ok) {
      console.error('Failed to update points:', await pointsResponse.text());
    }

    res.status(200).json({
      success: true,
      examHistoryId: result.examHistoryId,
      pointsEarned: result.pointsEarned,
      message: 'Exam results saved successfully',
    });

  } catch (error: any) {
    console.error('Error saving exam results:', error);
    res.status(500).json({ error: 'Failed to save exam results: ' + (error.message || error) });
  }
}
