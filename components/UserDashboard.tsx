// src/components/UserDashboard.tsx
"use client"; // If you plan to fetch data client-side or use hooks like useState/useEffect here

import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard, // Or use a specific icon for your app
  User,
  Settings,
  Activity,
  BarChart2,
  DollarSign, // Example icons for stats
  FilePlus,
  Bell,
  CheckCircle,
  Clock, // Example icons for activity
} from 'lucide-react';
import { Fragment } from 'react'; // Needed for some Headless UI transitions if you add them

// --- Define Sample Prop Types (Replace with your actual data structure) ---
interface UserData {
  name: string;
  email: string;
  avatarUrl: string;
  stats: {
    projects: number;
    tasksCompleted: number;
    revenue?: number; // Optional stat
  };
  recentActivity: {
    id: string;
    type: 'project_created' | 'task_completed' | 'comment_added' | 'login'; // Example types
    description: string;
    timestamp: string; // Ideally an ISO string or Date object
  }[];
}

interface UserDashboardProps {
  user: UserData;
}

// --- Helper Function to format Date/Time ---
function formatRelativeTime(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// --- The Dashboard Component ---
export default function UserDashboard({ user }: UserDashboardProps) {
  // Placeholder - you might fetch user data here using useEffect/SWR/React Query etc.

  const getIconForActivity = (type: UserData['recentActivity'][0]['type']) => {
    switch (type) {
      case 'project_created': return <FilePlus size={16} className="text-blue-500" />;
      case 'task_completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'comment_added': return <Bell size={16} className="text-yellow-500" />;
      case 'login': return <User size={16} className="text-gray-500" />;
      default: return <Activity size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Here's your dashboard overview for today, {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}.
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">

          {/* Profile Card (spans more on larger screens potentially) */}
          <section className="lg:col-span-1 xl:col-span-1 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700/50">
            <div className="flex flex-col items-center text-center">
              <Image
                src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                alt={`${user.name}'s avatar`}
                width={96}
                height={96}
                className="rounded-full mb-4 border-2 border-indigo-300 dark:border-indigo-600 shadow-sm"
              />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{user.email}</p>
              <Link
                href="/profile/settings" // Adjust link as needed
                className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition duration-150 ease-in-out group"
              >
                <Settings size={16} className="group-hover:rotate-45 transition-transform duration-200" />
                Account Settings
              </Link>
            </div>
          </section>

          {/* Stats Card */}
          <section className="lg:col-span-2 xl:col-span-3 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700/50">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">Overview</h3>
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* Stat 1 */}
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/40 p-5 shadow-sm border border-blue-200 dark:border-blue-700/50">
                <dt>
                  <div className="absolute rounded-md bg-blue-500 p-3 -mt-1 -ml-1">
                    <LayoutDashboard className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                </dt>
                <dd className="ml-16 flex items-baseline pb-1">
                  <p className="text-2xl font-semibold text-blue-900 dark:text-blue-200">{user.stats.projects}</p>
                </dd>
              </div>

               {/* Stat 2 */}
               <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/40 p-5 shadow-sm border border-green-200 dark:border-green-700/50">
                <dt>
                  <div className="absolute rounded-md bg-green-500 p-3 -mt-1 -ml-1">
                    <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-600 dark:text-gray-400">Tasks Completed</p>
                </dt>
                <dd className="ml-16 flex items-baseline pb-1">
                  <p className="text-2xl font-semibold text-green-900 dark:text-green-200">{user.stats.tasksCompleted}</p>
                </dd>
              </div>

              {/* Stat 3 (Optional) */}
              {user.stats.revenue !== undefined && (
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/40 p-5 shadow-sm border border-purple-200 dark:border-purple-700/50">
                  <dt>
                    <div className="absolute rounded-md bg-purple-500 p-3 -mt-1 -ml-1">
                      <DollarSign className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <p className="ml-16 truncate text-sm font-medium text-gray-600 dark:text-gray-400">Revenue (MTD)</p>
                  </dt>
                  <dd className="ml-16 flex items-baseline pb-1">
                    <p className="text-2xl font-semibold text-purple-900 dark:text-purple-200">${user.stats.revenue.toLocaleString()}</p>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Recent Activity Card */}
          <section className="lg:col-span-2 xl:col-span-2 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700/50">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            {user.recentActivity.length > 0 ? (
              <ul className="space-y-4 max-h-80 overflow-y-auto pr-2"> {/* Limit height and allow scroll */}
                {user.recentActivity.map((activity) => (
                  <li key={activity.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150 ease-in-out">
                    <span className="mt-1 flex-shrink-0">
                      {getIconForActivity(activity.type)}
                    </span>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-800 dark:text-gray-200">{activity.description}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        <Clock size={12} className="inline mr-1" />
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">No recent activity to display.</p>
            )}
             <Link
                href="/activity" // Link to full activity log
                className="inline-block mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                View all activity
            </Link>
          </section>

          {/* Quick Actions Card */}
          <section className="lg:col-span-1 xl:col-span-2 bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700/50">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Link href="/projects/new" className="group flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition duration-150 ease-in-out">
                 <FilePlus size={18} className="group-hover:scale-110 transition-transform" />
                 <span className="text-sm font-medium">New Project</span>
               </Link>
               <Link href="/tasks" className="group flex items-center justify-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-3 text-gray-800 dark:text-gray-200 shadow-sm hover:bg-gray-200 dark:hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition duration-150 ease-in-out">
                 <CheckCircle size={18} className="group-hover:scale-110 transition-transform" />
                 <span className="text-sm font-medium">My Tasks</span>
               </Link>
                {/* Add more actions as needed */}
            </div>
          </section>

        </div> {/* End Grid */}

      </div> {/* End Max Width Container */}
    </div> /* End Page Background */
  );
}