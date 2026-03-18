/**
 * Leaderboard Query API Route
 * Supports multiple categories: global, subject, exam
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { firestore } from '../../../lib/firebase-admin';
import {
  LeaderboardCategory,
  LeaderboardResponse,
  LeaderboardEntry,
} from '../../../lib/types/database';

/**
 * GET /api/leaderboard/category?category=global&limit=20&offset=0&currentUserUid=xxx
 * GET /api/leaderboard/category?category=subject&value=Physics&limit=20
 * GET /api/leaderboard/category?category=exam&value=jee-main-2023&limit=20
 *
 * Query parameters:
 * - category: 'global' | 'subject' | 'exam'
 * - value: subject name or exam ID (required for subject/exam)
 * - limit: number of results (default 20, max 100)
 * - offset: pagination offset (default 0)
 * - currentUserUid: to highlight current user's rank
 *
 * Response:
 * {
 *   category: "global",
 *   entries: [...],
 *   currentUserRank?: {...},
 *   pagination: { total, limit, offset, hasMore }
 * }
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LeaderboardResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const {
      category,
      value,
      limit = '20',
      offset = '0',
      currentUserUid,
    } = req.query;

    // Validate category
    if (!category || typeof category !== 'string') {
      return res.status(400).json({ error: 'Missing required parameter: category' });
    }

    if (
!['global', 'subject', 'exam'].includes(category)
) {
      return res.status(400).json({ error: 'Invalid category. Must be global, subject, or exam' });
    }

    const parsedLimit = Math.min(Math.max(parseInt(limit as string, 10) || 20, 1), 100);
    const parsedOffset = Math.max(parseInt(offset as string, 10) || 0, 0);

    // Build query based on category
    let collectionPath = `leaderboards/global/entries`;

    if (category === 'subject') {
      if (!value || typeof value !== 'string') {
        return res.status(400).json({ error: 'Missing required parameter: value (subject name)' });
      }
      collectionPath = `leaderboards/subjects/${value}/entries`;
    } else if (category === 'exam') {
      if (!value || typeof value !== 'string') {
        return res.status(400).json({ error: 'Missing required parameter: value (exam ID)' });
      }
      collectionPath = `leaderboards/exams/${value}/entries`;
    }

    // Get total count for pagination
    const snapshot = await firestore.collection(collectionPath).get();
    const total = snapshot.size;

    // Query entries with pagination
    let query = firestore
      .collection(collectionPath)
      .orderBy('totalPoints', 'desc')
      .limit(parsedLimit);

    if (parsedOffset > 0) {
      // Simple offset by starting after offset-th document
      const offsetSnapshot = await firestore
        .collection(collectionPath)
        .orderBy('totalPoints', 'desc')
        .limit(parsedOffset)
        .get();

      if (!offsetSnapshot.empty) {
        const lastDoc = offsetSnapshot.docs[offsetSnapshot.docs.length - 1];
        query = query.startAfter(lastDoc);
      }
    }

    const entriesSnapshot = await query.get();

    // Fetch all entries and assign ranks
    const entries: LeaderboardEntry[] = entriesSnapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        uid: data.uid || '',
        name: data.name || 'Anonymous',
        avatarUrl: data.avatarUrl || '',
        totalPoints: data.totalPoints || 0,
        examsCompleted: data.examsCompleted || 0,
        currentStreak: data.currentStreak || 0,
        lastActive: data.lastActive || 0,
        rank: parsedOffset + index + 1, // Actual rank including offset
      };
    });

    // Fetch current user's rank if provided
    let currentUserRank;
    if (currentUserUid && typeof currentUserUid === 'string') {
      const allEntries = snapshot.docs.map(doc => doc.data());

      // Find user and calculate rank
      const userEntry = allEntries.find(e => e.uid === currentUserUid);
      if (userEntry) {
        const sortedEntries = allEntries.sort((a, b) => {
          const pointsA = a.totalPoints || 0;
          const pointsB = b.totalPoints || 0;
          return pointsB - pointsA;
        });

        const userIndex = sortedEntries.findIndex(e => e.uid === currentUserUid);
        if (userIndex !== -1) {
          currentUserRank = {
            rank: userIndex + 1,
            totalPoints: userEntry.totalPoints || 0,
          };
        }
      }
    }

    res.status(200).json({
      category: category as LeaderboardCategory,
      entries,
      currentUserRank,
      pagination: {
        total,
        limit: parsedLimit,
        offset: parsedOffset,
        hasMore: parsedOffset + entries.length < total,
      },
    });

  } catch (error: any) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard: ' + (error.message || error) });
  }
}
