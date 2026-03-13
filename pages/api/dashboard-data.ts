// pages/api/dashboard-data.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { admin, firestore } from '../../lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// Helper function to safely convert a date field (Timestamp or string) to an ISO string
function toISOString(dateField: any): string {
    // Case 1: It's a Firestore Timestamp object
    if (dateField instanceof Timestamp) {
        return dateField.toDate().toISOString();
    }
    // Case 2: It's already a string (like "2025-07-17T09:01:32.741Z")
    if (typeof dateField === 'string') {
        // Optional: You could add validation here to ensure it's a valid date string
        return dateField;
    }
    // Case 3: It's missing or another type, provide a fallback
    return new Date().toISOString();
}


interface DashboardData {
    name: string;
    email: string;
    avatarUrl: string;
    createdAt: string;
    currentStreak: number;
    examHistory: {
        id: string;
        exam: string;
        score: number;
        timestamp: string;
        subject:string;
        paper:string;
    }[];
    favoriteExams: { id: string; name: string }[];
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<DashboardData | { error: string }>
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
        
        const decodedToken = await admin.auth().verifyIdToken(token);
        const userId = decodedToken.uid;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized: Invalid user ID.' });
        }
        
        console.log(`API: Fetching REAL data for authenticated user: ${userId}`);

        const userDocRef = firestore.collection('users').doc(userId);
        const historyCollectionRef = userDocRef.collection('examHistory');

        const [userDoc, historySnapshot] = await Promise.all([
            userDocRef.get(),
            historyCollectionRef.get()
        ]);

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User data not found.' });
        }

        const userData = userDoc.data()!;

        const examHistory = historySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                exam: data.exam || 'Unknown Exam',
                score: data.score || 0,
                // --- FIXED: Use the robust helper function ---
                timestamp: toISOString(data.timestamp),
                paper: data.paper || 'Unknown Paper',  // ADD THIS
                subject: data.subject || 'Unknown Subject',  // ADD THIS
            };
        });
        
        const responseData: DashboardData = {
            name: userData.name || 'No Name',
            email: userData.email || 'No Email',
            avatarUrl: userData.avatarUrl || '',
            // --- FIXED: Use the robust helper function ---
            createdAt: toISOString(userData.createdAt),
            currentStreak: userData.currentStreak || 0,
            examHistory: examHistory,
            favoriteExams: userData.favoriteExams || [],
        };

        res.status(200).json(responseData);

    } catch (error: any) {
        console.error("API Error fetching dashboard data:", error);
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ error: 'Unauthorized: Token has expired.' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
