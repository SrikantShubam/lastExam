/**
 * Subject Analytics API Route
 * Returns detailed analytics for a specific subject
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../../../lib/firebase-admin';
import { SubjectAnalytics } from '../../../../lib/types/database';

/**
 * GET /api/analytics/[subject]
 *
 * Requires authentication via Bearer token
 *
 * Response:
 * {
 *   subject: string,
 *   totalQuestionsAnswered: number,
 *   correctAnswers: number,
 *   accuracy: number,
 *   averageTimePerQuestion: number,
 *   weakTopics: [{ topic, accuracy }],
 *   strongTopics: [{ topic, accuracy }],
 *   examHistory: [{ examId, score, timestamp }],
 *   accuracyTrend: number[]
 * }
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubjectAnalytics | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { subject } = req.query;

    if (!subject || typeof subject !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid subject parameter' });
    }

    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token.' });
    }
    const token = authorization.split('Bearer ')[1];

    const { auth } = await import('../../../../lib/firebase-admin');
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid user ID.' });
    }

    console.log(`API: Fetching subject analytics for user: ${userId}, subject: ${subject}`);

    // Fetch subject stats, exam history, and quiz history
    const userDocRef = firestore.collection('users').doc(userId);
    const [
      subjectStatsRef,
      examHistorySnapshot,
      quizHistorySnapshot,
    ] = await Promise.all([
      userDocRef.collection('subjects').doc(subject).collection('stats').doc('overview'),
      userDocRef.collection('examHistory').where('subject', '==', subject).orderBy('timestamp', 'desc').limit(50).get(),
      userDocRef.collection('quizHistory').where('subject', '==', subject).orderBy('timestamp', 'desc').limit(50).get(),
    ]);

    // Get subject stats
    const subjectStatsDoc = await subjectStatsRef.get();
    const subjectStatsData = subjectStatsDoc.exists ? subjectStatsDoc.data()! : {};

    // Calculate combinedstats
    const totalQuestionsAnswered = (subjectStatsData.totalQuestionsAnswered || 0) + quizHistorySnapshot.docs.reduce((sum, doc) => sum + (doc.data().totalQuestions || 0), 0);
    const correctAnswers = (subjectStatsData.correctAnswers || 0) + quizHistorySnapshot.docs.reduce((sum, doc) => sum + Math.round((doc.data().accuracy || 0) * (doc.data().totalQuestions || 0) / 100), 0);
    const accuracy = totalQuestionsAnswered > 0 ? Math.round((correctAnswers / totalQuestionsAnswered) * 100) : 0;

    // Calculate average time per question from exam history
    let totalExamTime = 0;
    let totalExamQuestions = 0;

    examHistorySnapshot.forEach(doc => {
      const data = doc.data();
      totalExamTime += data.timeSpent || 0; // minutes
      totalExamQuestions += data.questionsAttempted || 0;
    });

    const averageTimePerQuestion = totalExamQuestions > 0
      ? Math.round((totalExamTime * 60) / totalExamQuestions) // convert to seconds
      : 0;

    // Get weak and strong topics from subject stats
    const weakTopics = subjectStatsData.weakTopics || [];
    const strongTopics = subjectStatsData.strongTopics || [];

    // Build exam history summary
    const examHistory: { examId: string; score: number; percentage: number; timestamp: number }[] = [];
    examHistorySnapshot.forEach(doc => {
      const data = doc.data();
      examHistory.push({
        examId: data.examId,
        score: data.score,
        percentage: data.percentage,
        timestamp: data.timestamp,
      });
    });

    // Calculate accuracy trend (last 5 attempts)
    const allAttempts: number[] = [];

    examHistorySnapshot.forEach(doc => {
      allAttempts.push(doc.data().percentage);
    });

    quizHistorySnapshot.forEach(doc => {
      allAttempts.push(Math.round(doc.data().accuracy));
    });

    // Sort by timestamp and get last 5
    allAttempts.sort((a, b) => 0); // Already in descending order from query
    const accuracyTrend = allAttempts.slice(0, 5);

    const responseData: SubjectAnalytics = {
      subject,
      totalQuestionsAnswered,
      correctAnswers,
      accuracy,
      averageTimePerQuestion,
      weakTopics,
      strongTopics,
      examHistory,
      accuracyTrend,
    };

    res.status(200).json(responseData);

  } catch (error: any) {
    console.error('Error fetching subject analytics:', error);
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Unauthorized: Token has expired.' });
    }
    res.status(500).json({ error: 'Internal Server Error: ' + (error.message || error) });
  }
}
