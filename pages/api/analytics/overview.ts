/**
 * Analytics Overview API Route
 * Returns comprehensive analytics data for the dashboard
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../../lib/firebase-admin';
import { AnalyticsOverview } from '../../../lib/types/database';

/**
 * GET /api/analytics/overview
 *
 * Requires authentication via Bearer token
 *
 * Response:
 * {
 *   totalPoints: number,
 *   examsCompleted: number,
 *   currentStreak: number,
 *   bestStreak: number,
 *   averageAccuracy: number,
 *   timeSpentStudying: number,
 *   subjectsMastered: string[],
 *   subjectsNeedingWork: string[],
 *   weeklyProgress: { date, points, exams }[],
 *   improvementTrend: number
 * }
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalyticsOverview | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token.' });
    }
    const token = authorization.split('Bearer ')[1];

    const { auth } = await import('../../../lib/firebase-admin');
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid user ID.' });
    }

    console.log(`API: Fetching analytics for user: ${userId}`);

    // Fetch user document and collections in parallel
    const userDocRef = firestore.collection('users').doc(userId);
    const [
      userDoc,
      examHistorySnapshot,
      analyticsDoc,
      subjectsStatsSnapshot,
    ] = await Promise.all([
      userDocRef.get(),
      userDocRef.collection('examHistory').orderBy('timestamp', 'desc').limit(100).get(),
      userDocRef.collection('analytics').doc('overview').get(),
      userDocRef.collection('subjects').listDocuments(),
    ]);

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User data not found.' });
    }

    const userData = userDoc.data()!;

    // Basic stats
    const totalPoints = userData.totalPoints || 0;
    const currentStreak = userData.currentStreak || 0;
    const bestStreak = userData.bestStreak || currentStreak;

    // Calculate exam stats
    const examsCompleted = examHistorySnapshot.size;
    let totalAccuracy = 0;
    let totalTimeSpent = 0;

    examHistorySnapshot.forEach(doc => {
      const data = doc.data();
      totalAccuracy += data.percentage || 0;
      totalTimeSpent += data.timeSpent || 0;
    });

    const averageAccuracy = examsCompleted > 0 ? Math.round(totalAccuracy / examsCompleted) : 0;
    const timeSpentStudying = totalTimeSpent;

    // Fetch subject stats
    const subjectsMastered: string[] = [];
    const subjectsNeedingWork: string[] = [];

    for (const subjectDoc of subjectsStatsSnapshot) {
      const statsSnapshot = await subjectDoc.collection('stats').doc('overview').get();
      if (statsSnapshot.exists) {
        const stats = statsSnapshot.data()!;
        const accuracy = stats.averageAccuracy || 0;
        const subject = subjectDoc.id;

        if (accuracy >= 80) {
          subjectsMastered.push(subject);
        } else if (accuracy < 60) {
          subjectsNeedingWork.push(subject);
        }
      }
    }

    // Get weekly progress from analytics
    let weeklyProgress: { date: string; points: number; exams: number }[] = [];
    if (analyticsDoc.exists) {
      const analyticsData = analyticsDoc.data()!;
      weeklyProgress = analyticsData.weeklyActivity || [];
    } else {
      // If no analytics data, calculate from exam history
      const activityByDate: Record<string, { points: number; exams: number }> = {};

      examHistorySnapshot.forEach(doc => {
        const data = doc.data();
        const date = new Date((data.timestamp || 0) * 1000).toISOString().split('T')[0];
        if (!activityByDate[date]) {
          activityByDate[date] = { points: 0, exams: 0 };
        }
        activityByDate[date].points += data.pointsEarned || 0;
        activityByDate[date].exams += 1;
      });

      weeklyProgress = Object.entries(activityByDate)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, stats]) => ({ date, points: stats.points, exams: stats.exams }))
        .slice(-30); // Last 30 days
    }

    // Calculate improvement trend (compare recent vs older performance)
    let improvementTrend = 0;
    const historyArray = examHistorySnapshot.docs.map(doc => doc.data());

    if (historyArray.length >= 5) {
      const recentAverage = historyArray.slice(0, Math.min(5, historyArray.length)).reduce((sum, h) => sum + (h.percentage || 0), 0) / Math.min(5, historyArray.length);
      const olderAverage = historyArray.slice(Math.min(5, historyArray.length)).reduce((sum, h) => sum + (h.percentage || 0), 0) / (historyArray.length - Math.min(5, historyArray.length)) || recentAverage;

      improvementTrend = Math.round((recentAverage - olderAverage) * 10) / 10;
    }

    const responseData: AnalyticsOverview = {
      totalPoints,
      examsCompleted,
      currentStreak,
      bestStreak,
      averageAccuracy,
      timeSpentStudying,
      subjectsMastered,
      subjectsNeedingWork,
      weeklyProgress,
      improvementTrend,
    };

    res.status(200).json(responseData);

  } catch (error: any) {
    console.error('Error fetching analytics overview:', error);
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Unauthorized: Token has expired.' });
    }
    res.status(500).json({ error: 'Internal Server Error: ' + (error.message || error) });
  }
}
