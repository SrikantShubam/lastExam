/**
 * Analytics Dashboard Page - Pages Router
 * Real Firestore-backed analytics with charts and insights
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import {
  TrendingUp,
  Clock,
  Award,
  Flame,
  BookOpen,
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AnalyticsOverview as AnalyticsOverviewType } from '../lib/types/database';

interface AnalyticsOverview extends AnalyticsOverviewType {
  subjectsMastered: string[];
  subjectsNeedingWork: string[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F'];

export default function AnalyticsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchAnalytics();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');

    try {
      if (!user?.uid) {
        throw new Error('User not authenticated');
      }

      const token = await user.getIdToken();

      const response = await fetch('/api/analytics/overview', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data: AnalyticsOverview = await response.json();
      setAnalytics(data);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const getSubjectStrengthColor = (subject: string, isMastered: boolean) => {
    return isMastered
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Analytics</h1>
          <p className="text-lg text-muted-foreground">
            Track your progress and improve your performance
          </p>
        </motion.div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 p-6 border-destructive">
            <p className="text-destructive text-center">{error}</p>
          </Card>
        )}

        {/* Loading State */}
        {loading && !analytics && (
          <Card className="mb-6 p-12">
            <p className="text-center text-muted-foreground">Loading your analytics...</p>
          </Card>
        )}

        {/* Empty/Login State */}
        {!loading && !analytics && !user && (
          <Card className="mb-6 p-12">
            <p className="text-center text-muted-foreground">Please log in to view your analytics</p>
          </Card>
        )}

        {/* Analytics Content */}
        {!loading && analytics && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Points */}
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Award className="w-8 h-8 text-primary" />
                    <span className="text-2xl font-bold text-primary">
                      {analytics.totalPoints.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </Card>
              </motion.div>

              {/* Exams Completed */}
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <BookOpen className="w-8 h-8 text-blue-500" />
                    <span className="text-2xl font-bold text-blue-500">
                      {analytics.examsCompleted}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Exams Completed</p>
                </Card>
              </motion.div>

              {/* Current Streak */}
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Flame className="w-8 h-8 text-orange-500" />
                    <span className="text-2xl font-bold text-orange-500">
                      🔥 {analytics.currentStreak}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground}>Current Streak</p>
                  <p className="text-xs text-muted-foreground mt-1">Best: {analytics.bestStreak}</p>
                </Card>
              </motion.div>

              {/* Average Accuracy */}
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Target className="w-8 h-8 text-green-500" />
                    <span className="text-2xl font-bold text-green-500">
                      {analytics.averageAccuracy}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Average Accuracy</p>
                </Card>
              </motion.div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Weekly Progress Chart */}
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Weekly Activity
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.weeklyProgress}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          labelFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString();
                          }}
                        />
                        <Bar dataKey="points" fill="#8884d8" name="Points" />
                        <Bar dataKey="exams" fill="#82ca9d" name="Exams" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>

              {/* Subject Breakdown */}
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Subject Performance</h3>

                  {/* Subjects Mastered */}
                  {analytics.subjectsMastered.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Subjects Mastered
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analytics.subjectsMastered.map((subject) => (
                          <span
                            key={subject}
                            className={`px-3 py-1 rounded-full text-sm ${getSubjectStrengthColor(subject, true)}`}
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subjects Needing Work */}
                  {analytics.subjectsNeedingWork.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        Focus Areas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {analytics.subjectsNeedingWork.map((subject) => (
                          <span
                            key={subject}
                            className={`px-3 py-1 rounded-full text-sm ${getSubjectStrengthColor(subject, false)}`}
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {analytics.subjectsMastered.length === 0 && analytics.subjectsNeedingWork.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Complete more exams to see subject performance
                    </p>
                  )}
                </Card>
              </motion.div>
            </div>

            {/* Improvement Trend & Time Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Improvement Trend */}
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Trend
                  </h3>
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <p className="text-5xl font-bold mb-2">
                        {analytics.improvementTrend > 0 ? '+' : ''}{analytics.improvementTrend}%
                      </p>
                      <p className="text-muted-foreground">
                        {analytics.improvementTrend > 0 ? 'Improving' : analytics.improvementTrend < 0 ? 'Declining' : 'Steady'}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Time Stats */}
              <motion.div variants={itemVariants}>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Time Spent Studying
                  </h3>
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <p className="text-5xl font-bold mb-2">{Math.round(analytics.timeSpentStudying / 60)}</p>
                      <p className="text-muted-foreground">Hours</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Total: {analytics.timeSpentStudying.toLocaleString()} minutes
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
