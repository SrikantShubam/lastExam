/**
 * Leaderboard Update API Route
 * Manually triggers leaderboard updates
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { admin, firestore } from '../../../lib/firebase-admin';
import {
  LeaderboardUpdateRequest,
  LeaderboardUpdateResponse,
  LeaderboardEntry,
  LeaderboardCategory,
} from '../../../lib/types/database';

/**
 * POST /api/leaderboard/update
 *
 * Request body:
 * {
 *   userId: string,
 *   category: "global" | "subject" | "exam",
 *   categoryValue?: string, (subject name or exam ID)
 *   pointsEarned: number,
 *   examCompleted?: boolean
 * }
 *
 * Response:
 * {
 *   success: boolean,
 *   newPoints: number,
 *   newRank?: number,
 *   message?: string
 * }
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeaderboardUpdateResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const {
      userId,
      category,
      categoryValue,
      pointsEarned,
      examCompleted = false,
    } = req.body as LeaderboardUpdateRequest;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ error: 'Missing required field: userId' });
    }

    if (!category) {
      return res.status(400).json({ error: 'Missing required field: category' });
    }

    if (
!['global', 'subject', 'exam'].includes(category)
) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    if (category !== 'global' && !categoryValue) {
      return res.status(400).json({ error: 'Missing required field: categoryValue for subject/exam' });
    }

    if (typeof pointsEarned !== 'number' || pointsEarned < 0) {
      return res.status(400).json({ error: 'Invalid pointsEarned value' });
    }

    // Get user data
    const userDoc = await firestore.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data()!;
    const currentPoints = userData.totalPoints || 0;
    const newPoints = currentPoints + pointsEarned;

    // Determine collection path
    let collectionPath = `leaderboards/global/entries`;

    if (category === 'subject') {
      collectionPath = `leaderboards/subjects/${categoryValue}/entries`;
    } else if (category === 'exam') {
      collectionPath = `leaderboards/exams/${categoryValue}/entries`;
    }

    // Use transaction to update leaderboard
    const result = await firestore.runTransaction(async (transaction) => {
      const leaderboardRef = firestore.collection(collectionPath).doc(userId);
      const leaderboardDoc = await transaction.get(leaderboardRef);

      const leaderboardData: Partial<LeaderboardEntry> = {
        uid: userId,
        name: userData.name || 'User',
        avatarUrl: userData.avatarUrl || '',
        totalPoints: newPoints,
        examsCompleted: examCompleted ? admin.firestore.FieldValue.increment(1) : (leaderboardDoc.data()?.examsCompleted || 0),
        currentStreak: userData.currentStreak || 0,
        lastActive: Math.floor(Date.now() / 1000),
      };

      // Add category-specific points
      if (category === 'subject') {
        (leaderboardData as any).subjectPoints = newPoints;
      } else if (category === 'exam') {
        (leaderboardData as any).examPoints = newPoints;
      }

      if (leaderboardDoc.exists) {
        transaction.update(leaderboardRef, {
          ...leaderboardData,
          examsCompleted: examCompleted ? admin.firestore.FieldValue.increment(1) : undefined,
        });
      } else {
        transaction.set(leaderboardRef, leaderboardData as LeaderboardEntry);
      }

      // Return the entry for rank calculation
      return leaderboardData;
    });

    // Recalculate rank
    const allEntriesSnapshot = await firestore.collection(collectionPath).get();
    const allEntries = allEntriesSnapshot.docs.map(doc => doc.data());

    const sortedEntries = allEntries.sort((a, b) => {
      const pointsA = a.totalPoints || 0;
      const pointsB = b.totalPoints || 0;
      return pointsB - pointsA;
    });

    const userRank = sortedEntries.findIndex(e => e.uid === userId) + 1;

    res.status(200).json({
      success: true,
      newPoints,
      newRank: userRank,
      message: `Updated ${category} leaderboard for user`,
    });

  } catch (error: any) {
    console.error('Error updating leaderboard:', error);
    res.status(500).json({ error: 'Failed to update leaderboard: ' + (error.message || error) });
  }
}
