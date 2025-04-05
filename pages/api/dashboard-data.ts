// pages/api/dashboard-data.ts
import type { NextApiRequest, NextApiResponse } from 'next';
// --- IMPORTANT: Add server-side auth check here! ---
// This usually involves verifying a token (e.g., Firebase ID token) sent in the request headers
// or checking a session cookie. Libraries like `next-firebase-auth` or Firebase Admin SDK can help.
// import { verifyIdToken } from '@/lib/server-auth'; // Example auth verification function

// Define the structure of the data you expect to return (matches UserData without sensitive info)
// Note: We already defined UserData interface, can reuse/adapt it
interface DashboardApiResponse {
    name: string;
    // email is often available client-side via Firebase auth, might not need to send it
    avatarUrl: string; // Can be derived server-side or client-side
    stats: {
        projects: number;
        tasksCompleted: number;
        revenue?: number;
    };
    recentActivity: {
        id: string;
        type: 'project_created' | 'task_completed' | 'comment_added' | 'login';
        description: string;
        timestamp: string; // Send as ISO string
    }[];
}


// --- Sample Data Function (Replace with your actual DB queries/logic) ---
async function getDashboardDataForUser(userId: string): Promise<DashboardApiResponse> {
    console.log("API: Fetching data for user:", userId);
    // Simulate fetching data from your database based on userId
    await new Promise(resolve => setTimeout(resolve, 300));

    // Replace with real data retrieval
    return {
        name: 'Alice (from API)', // You might get this from your DB profile
        avatarUrl: `https://via.placeholder.com/96/A78BFA/FFFFFF?text=API`,
        stats: {
            projects: 15, // Example data
            tasksCompleted: 90,
            revenue: 2500.75,
        },
        recentActivity: [
            { id: 'api1', type: 'task_completed', description: 'API: Completed task "Review PR #123"', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
            { id: 'api2', type: 'project_created', description: 'API: Created project "Documentation Update"', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
        ],
    };
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardApiResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    // --- === Server-Side Authentication Check === ---
    // 1. Get token from Authorization header (e.g., Bearer token)
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing bearer token' });
    }
    const idToken = authorization.split('Bearer ')[1];

    // 2. Verify the token (using Firebase Admin SDK or similar)
    // This is a placeholder - implement actual verification!
    // const decodedToken = await verifyIdToken(idToken); // Your verification function
    // const userId = decodedToken.uid;
    // --- === End Placeholder Auth Check === ---

    // --- Placeholder: Assume token is valid and contains uid ---
    // !!! Replace this with real user ID from verified token !!!
    const userId = "DUMMY_USER_ID_REPLACE_WITH_REAL_ONE";
    // --- End Placeholder ---


    if (!userId) {
         return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    // Fetch data using the authenticated user ID
    const dashboardData = await getDashboardDataForUser(userId);
    res.status(200).json(dashboardData);

  } catch (error: any) {
    console.error("API Error fetching dashboard data:", error);
    // Don't send detailed errors to the client in production
    res.status(500).json({ error: 'Internal Server Error' });
  }
}