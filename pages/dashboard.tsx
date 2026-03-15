// // import { useState, useEffect  } from 'react';
// // import { useRouter } from "next/router";
// // import Link from "next/link";
// // import { onAuthStateChanged, User, getIdToken } from "firebase/auth";
// // import { auth } from "../lib/firebase";
// // import UserDashboard from '../components/UserDashboard';
// // import Layout from "../components/Layout";

// // interface UserData {
// //   name: string;
// //   email: string;
// //   avatarUrl: string;
// //   stats: {
// //     projects: number;
// //     tasksCompleted: number;
// //     revenue?: number;
// //   };
// //   recentActivity: {
// //     id: string;
// //     type: 'project_created' | 'task_completed' | 'comment_added' | 'login';
// //     description: string;
// //     timestamp: string;
// //   }[];
// // }

// // export default function DashboardPage() {
// //   const router = useRouter();
// //   const [userData, setUserData] = useState<UserData | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [currentUser, setCurrentUser] = useState<User | null>(null);

// //   useEffect(() => {
// //     const unsubscribe = onAuthStateChanged(auth, async (user) => {
// //       if (user) {
// //         setCurrentUser(user);
// //         setError(null);
// //         setLoading(true);
// //         try {
// //           const idToken = await getIdToken(user);

// //           const response = await fetch('/api/dashboard-data', {
// //             headers: {
// //               'Authorization': `Bearer ${idToken}`,
// //             },
// //           });

// //           if (!response.ok) {
// //             const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
// //             throw new Error(errorData.error || `API request failed: ${response.statusText} (${response.status})`);
// //           }

// //           const apiData = await response.json();

// //           // Combine data with Google account image and fallback
// //           setUserData({
// //             name: user.displayName || apiData.name || 'User',
// //             email: user.email || 'No email provided',
// //             avatarUrl: user.photoURL || apiData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&size=64`,
// //             stats: apiData.stats,
// //             recentActivity: apiData.recentActivity,
// //           });

// //         } catch (fetchError: any) {
// //           console.error("Failed to fetch dashboard data:", fetchError);
// //           setError(fetchError.message || "Could not load dashboard data.");
// //           setUserData(null);
// //         } finally {
// //           setLoading(false);
// //         }
// //       } else {
// //         setCurrentUser(null);
// //         setUserData(null);
// //         setLoading(false);
// //         setError(null);
// //         router.push("/login");
// //       }
// //     });

// //     return () => unsubscribe();
// //   }, [router]);

// //   if (loading) {
// //     return (
// //       <Layout>
// //         <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
// //           <p className="animate-pulse">Loading Dashboard...</p>
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <Layout>
// //         <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-gray-900 p-4 text-center">
// //           <p className="text-red-600 dark:text-red-400 font-semibold">Could not load dashboard</p>
// //           <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">{error}</p>
// //           <button
// //             onClick={() => window.location.reload()}
// //             className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
// //           >
// //             Retry
// //           </button>
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   if (!currentUser || !userData) {
// //     return (
// //       <Layout>
// //         <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
// //           <p>
// //             Please <Link href="/login" className="text-primary hover:underline">log in</Link>.
// //           </p>
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   return (
// //     <Layout>
// //       <UserDashboard user={userData} />
// //     </Layout>
// //   );
// // }






















// "use client";
// import { useState, useEffect  } from 'react';
// import { useRouter } from "next/router";
// import Link from "next/link";
// import { onAuthStateChanged, User } from "firebase/auth";
// import { auth } from "../lib/firebase";
// import UserDashboard from '../components/UserDashboard';
// import Layout from "../components/Layout";

// // CHANGED: This interface now matches the API response and UserDashboard component's expectation.
// interface UserData {
//   name: string;
//   email: string;
//   avatarUrl: string;
//   createdAt: string;
//   currentStreak: number;
//   examHistory?: {
//     id: string;
//     exam: string;
//     score: number;
//     timestamp: string;
//   }[];
//   favoriteExams?: { id: string; name: string }[];
// }

// export default function DashboardPage() {
//   const router = useRouter();
//   const [userData, setUserData] = useState<UserData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [currentUser, setCurrentUser] = useState<User | null>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         setCurrentUser(user);
//         setError(null);
//         setLoading(true);
//         try {
//           const idToken = await user.getIdToken();

//           const response = await fetch('/api/dashboard-data', {
//             headers: {
//               'Authorization': `Bearer ${idToken}`,
//             },
//           });

//           if (!response.ok) {
//             const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
//             throw new Error(errorData.error || `API request failed: ${response.statusText} (${response.status})`);
//           }

//           const apiData: UserData = await response.json();

//           // ADDED: Console log the fetched data as you requested.
//           // Check your browser's developer console (F12) to see this output.
//           console.log("Fetched data from API:", apiData);

//           // CHANGED: The API data now perfectly matches our UserData interface,
//           // so we can set it directly.
//           setUserData(apiData);

//         } catch (fetchError: any) {
//           console.error("Failed to fetch dashboard data:", fetchError);
//           setError(fetchError.message || "Could not load dashboard data.");
//           setUserData(null);
//         } finally {
//           setLoading(false);
//         }
//       } else {
//         // User is not logged in
//         setCurrentUser(null);
//         setUserData(null);
//         setLoading(false);
//         setError(null);
//         router.push("/login");
//       }
//     });

//     return () => unsubscribe();
//   }, [router]);

//   if (loading) {
//     return (
//       <Layout>
//         <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
//           <p className="animate-pulse">Loading Dashboard...</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (error) {
//     return (
//       <Layout>
//         <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-gray-900 p-4 text-center">
//           <p className="text-red-600 dark:text-red-400 font-semibold">Could not load dashboard</p>
//           <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
//           >
//             Retry
//           </button>
//         </div>
//       </Layout>
//     );
//   }

//   // Render the UserDashboard ONLY when we have the data
//   if (currentUser && userData) {
//     return (
//       <Layout>
//         <UserDashboard user={userData} />
//       </Layout>
//     );
//   }

//   // Fallback if data is somehow still missing
//   return (
//     <Layout>
//       <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
//         <p>
//           Please <Link href="/login" className="text-primary hover:underline">log in</Link> to continue.
//         </p>
//       </div>
//     </Layout>
//   );
// }











"use client";
import { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import UserDashboard from '../components/UserDashboard';
import Layout from "../components/Layout";

// CHANGED: This interface now matches the API response and UserDashboard component's expectation.
interface UserData {
  name: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
  currentStreak: number;
  examHistory?: {
    id: string;
    exam: string;
    score: number;
    timestamp: string;
    paper:string;
    subject: string;
  }[];
  favoriteExams?: {
    id: string;
    name: string;
    exam_date: string;
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
        setLoading(true);
        try {
          const idToken = await user.getIdToken();

          const response = await fetch('/api/dashboard-data', {
            headers: {
              'Authorization': `Bearer ${idToken}`,
            },
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
            throw new Error(errorData.error || `API request failed: ${response.statusText} (${response.status})`);
          }

          const apiData: UserData = await response.json();

          // ADDED: Console log the fetched data as you requested.
          // Check your browser's developer console (F12) to see this output.
          console.log("Fetched data from API:", apiData);

          // CHANGED: The API data now perfectly matches our UserData interface,
          // so we can set it directly.
          setUserData(apiData);

        } catch (fetchError: any) {
          console.error("Failed to fetch dashboard data:", fetchError);
          setError(fetchError.message || "Could not load dashboard data.");
          setUserData(null);
        } finally {
          setLoading(false);
        }
      } else {
        // User is not logged in
        setCurrentUser(null);
        setUserData(null);
        setLoading(false);
        setError(null);
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <p className="animate-pulse">Loading Dashboard...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-gray-900 p-4 text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold">Could not load dashboard</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
          >
            Retry
          </button>
        </div>
      </Layout>
    );
  }

  // Render the UserDashboard ONLY when we have the data
  if (currentUser && userData) {
    return (
      <Layout>
        <UserDashboard user={userData} />
      </Layout>
    );
  }

  // Fallback if data is somehow still missing
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>
          Please <Link href="/login" className="text-primary hover:underline">log in</Link> to continue.
        </p>
      </div>
    </Layout>
  );
}