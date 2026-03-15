"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { withAdminProtection } from "@/utils/adminProtection";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface DashboardStats {
  totalUsers: number;
  totalExams: number;
  quizzesCompletedToday: number;
  pointsEarnedThisWeek: number;
  pendingQuestions: number;
  failedGenerations: number;
}

function AdminDashboardOverview() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalExams: 0,
    quizzesCompletedToday: 0,
    pointsEarnedThisWeek: 0,
    pendingQuestions: 0,
    failedGenerations: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard-stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Overview of platform metrics and quick actions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl">
                {loading ? '-' : stats.totalUsers}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-green-600 dark:text-green-400">
                Registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Exams</CardDescription>
              <CardTitle className="text-3xl">
                {loading ? '-' : stats.totalExams}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Available exams
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Quizzes Completed Today</CardDescription>
              <CardTitle className="text-3xl">
                {loading ? '-' : stats.quizzesCompletedToday}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Today's activity
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Points Earned This Week</CardDescription>
              <CardTitle className="text-3xl">
                {loading ? '-' : stats.pointsEarnedThisWeek}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-orange-600 dark:text-orange-400">
                Total points
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className={stats.pendingQuestions > 0 ? "border-orange-500" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Pending Questions
                {stats.pendingQuestions > 0 && (
                  <Badge variant="destructive">
                    {stats.pendingQuestions}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Questions waiting for review before publishing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.pendingQuestions > 0 ? (
                <Button
                  onClick={() => router.push('/admin/question-queue')}
                  className="w-full"
                >
                  Review Questions
                </Button>
              ) : (
                <p className="text-sm text-green-600 dark:text-green-400">
                  All questions reviewed ✓
                </p>
              )}
            </CardContent>
          </Card>

          <Card className={stats.failedGenerations > 0 ? "border-red-500" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Failed Generation Attempts
                {stats.failedGenerations > 0 && (
                  <Badge variant="destructive">
                    {stats.failedGenerations}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Recent question generation failures
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.failedGenerations > 0 ? (
                <Button
                  onClick={() => router.push('/admin/pipeline')}
                  variant="outline"
                  className="w-full"
                >
                  View Pipeline
                </Button>
              ) : (
                <p className="text-sm text-green-600 dark:text-green-400">
                  All generations successful ✓
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity Graph Placeholder */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
            <CardDescription>
              Platform activity over the past 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-2">
                  Activity Graph Placeholder
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Visualization of user activity and quiz completions
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => router.push('/admin/pipeline')}
                variant="default"
                className="w-full"
              >
                Generate Questions
              </Button>
              <Button
                onClick={() => router.push('/admin/question-queue')}
                variant="outline"
                className="w-full"
              >
                View Question Queue
              </Button>
              <Button
                onClick={() => router.push('/admin/pipeline')}
                variant="outline"
                className="w-full"
              >
                Manage Pipeline
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

export default withAdminProtection(AdminDashboardOverview);
