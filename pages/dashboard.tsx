// pages/dashboard.tsx
import { useState, useEffect, Fragment } from 'react'; // Added Fragment
import { useRouter } from "next/router";
import Link from "next/link";
import { onAuthStateChanged, User, getIdToken } from "firebase/auth";
import { auth } from "../lib/firebase"; // Correct path assuming lib is at root
import UserDashboard from '../components/UserDashboard'; // Correct relative path assuming components is at root
import Layout from "../components/Layout"; // Your existing layout

// Define the UserData type (or import from a shared types file)
// This should match the structure expected by the UserDashboard component prop
interface UserData {
  name: string;
  email: string;
  avatarUrl: string;
  stats: {
    projects: number;
    tasksCompleted: number;
    revenue?: number;
  };
  recentActivity: {
    id: string;
    type: 'project_created' | 'task_completed' | 'comment_added' | 'login';
    description: string;
    timestamp: string;
  }[];
}


export default function DashboardPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setError(null);
        setLoading(true); // Set loading true when auth state changes and user exists
        try {
          const idToken = await getIdToken(user);

          const response = await fetch('/api/dashboard-data', {
            headers: {
              'Authorization': `Bearer ${idToken}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' })); // Catch potential JSON parse error
            throw new Error(errorData.error || `API request failed: ${response.statusText} (${response.status})`);
          }

          const apiData = await response.json();

          // Combine data: Prioritize live Firebase Auth info for display elements
          setUserData({
            name: user.displayName || apiData.name || 'User',
            email: user.email || 'No email provided',
            avatarUrl: user.photoURL || apiData.avatarUrl || '', // Use placeholder logic within UserDashboard if empty string
            stats: apiData.stats,
            recentActivity: apiData.recentActivity,
          });

        } catch (fetchError: any) {
          console.error("Failed to fetch dashboard data:", fetchError);
          setError(fetchError.message || "Could not load dashboard data.");
          setUserData(null);
        } finally {
          setLoading(false);
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        setUserData(null);
        setLoading(false); // Stop loading
        setError(null);
        router.push("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]); // Include router in dependency array as it's used in the effect

  // --- Render Logic ---

  // Show loading state within the Layout
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <p className="animate-pulse">Loading Dashboard...</p> {/* Use theme colors if defined */}
        </div>
      </Layout>
    );
  }

  // Show error state within the Layout
  if (error) {
     return (
       <Layout>
         <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-gray-900 p-4 text-center">
           <p className="text-red-600 dark:text-red-400 font-semibold">Could not load dashboard</p>
           <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">{error}</p>
           <button
             onClick={() => window.location.reload()} // Simple retry
             className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
           >
             Retry
           </button>
         </div>
       </Layout>
     );
  }

  // If user is somehow null after loading (should be handled by redirect, but belt-and-suspenders)
  // or if userData failed to load but no specific error was caught (unlikely with current logic, but safe)
  if (!currentUser || !userData) {
     // Redirect should have happened, but show login link as fallback
     return (
       <Layout>
         <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
           <p>
             Please <Link href="/login" className="text-primary hover:underline">log in</Link>.
           </p>
         </div>
       </Layout>
     );
  }

  // Render the cool dashboard component with fetched data inside the Layout
  return (
    <Layout>
      <UserDashboard user={userData} />
    </Layout>
  );
}