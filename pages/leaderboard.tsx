/**
 * Leaderboard Page - Pages Router
 * Real Firestore-backed leaderboard with multiple categories
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Medal, Award, TrendingUp, Search, Filter, RefreshCw } from 'lucide-react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface LeaderboardEntry {
  rank: number;
  uid: string;
  name: string;
  avatarUrl?: string;
  totalPoints: number;
  examsCompleted: number;
  currentStreak: number;
  lastActive: number;
}

interface LeaderboardResponse {
  category: string;
  entries: LeaderboardEntry[];
  currentUserRank?: {
    rank: number;
    totalPoints: number;
  };
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

type TimeFilter = 'all' | 'month' | 'week';
type Category = 'global' | 'subject' | 'exam';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];

export default function LeaderboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [category, setCategory] = useState<Category>('global');
  const [categoryValue, setCategoryValue] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paginating, setPaginating] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const limit = 20;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setOffset(0);
    setLeaderboardData([]);
    setHasMore(true);
    fetchLeaderboard(true);
  }, [category, categoryValue, timeFilter, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500) {
        if (!paginating && hasMore && !loading) {
          loadMore();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [paginating, hasMore, loading, offset]);

  const fetchLeaderboard = async (reset = false) => {
    setLoading(true);
    setError('');

    try {
      const params: Record<string, string> = {
        category,
        limit: limit.toString(),
        offset: (reset ? 0 : offset).toString(),
      };

      if (categoryValue && category !== 'global') {
        params.value = categoryValue;
      }

      // Add current user UID if logged in
      if (user?.uid) {
        params.currentUserUid = user.uid;
      }

      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`/api/leaderboard/category?${queryString}`);

      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const data: LeaderboardResponse = await response.json();

      if (reset) {
        setLeaderboardData(data.entries);
      } else {
        setLeaderboardData(prev => [...prev, ...data.entries]);
      }

      setCurrentUserRank(data.currentUserRank?.rank || null);
      setHasMore(data.pagination.hasMore);
      setTotal(data.pagination.total);

      if (!reset) {
        setOffset(prev => prev + data.entries.length);
      }
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (paginating || !hasMore) return;

    setPaginating(true);
    await fetchLeaderboard(false);
    setPaginating(false);
  };

  const handleRefresh = () => {
    setOffset(0);
    setLeaderboardData([]);
    setHasMore(true);
    fetchLeaderboard(true);
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900';
    if (rank === 3) return 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-950';
    return 'bg-muted text-muted-foreground';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5" />;
    if (rank === 2) return <Medal className="w-5 h-5" />;
    if (rank === 3) return <Award className="w-5 h-5" />;
    return <span className="font-bold">{rank}</span>;
  };

  const getPodiumData = () => {
    if (leaderboardData.length < 3) return null;
    return {
      first: leaderboardData[0],
      second: leaderboardData[1],
      third: leaderboardData[2],
    };
  };

  const podiumData = getPodiumData();

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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Top Performers
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compete with others and climb the ranks!
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Card className="p-6">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(['global', 'subject', 'exam'] as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat);
                    setCategoryValue('');
                  }}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    category === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Category Value Selection */}
            {category === 'subject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Subject</label>
                <div className="flex flex-wrap gap-2">
                  {SUBJECTS.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setCategoryValue(subject)}
                      className={`px-3 py-1 rounded-md text-sm transition-all ${
                        categoryValue === subject
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search & Filter */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background"
                  />
                </div>
              </div>

              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                className="px-4 py-2 border border-input rounded-md bg-background"
              >
                <option value="all">All Time</option>
                <option value="month">This Month</option>
                <option value="week">This Week</option>
              </select>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Current User Rank */}
            {currentUserRank && user && (
              <div className="mt-4 p-3 bg-primary/10 rounded-md">
                <p className="text-sm font-medium">
                  Your Rank: <span className="text-primary">#{currentUserRank}</span>
                </p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 p-6 border-destructive">
            <p className="text-destructive text-center">{error}</p>
          </Card>
        )}

        {/* Loading State */}
        {loading && leaderboardData.length === 0 && (
          <Card className="mb-6 p-12">
            <p className="text-center text-muted-foreground">Loading leaderboard...</p>
          </Card>
        )}

        {/* Empty State */}
        {!loading && leaderboardData.length === 0 && (
          <Card className="mb-6 p-12">
            <p className="text-center text-muted-foreground">No entries yet. Be the first!</p>
          </Card>
        )}

        {/* Podium Section */}
        {podiumData && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {/* 2nd Place */}
            <motion.div
              className="order-2 md:order-1 transform md:translate-y-8"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full border-2 border-gray-400/50 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-3xl font-bold text-gray-900">
                      {podiumData.second.name.charAt(0)}
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900 px-6 py-2 rounded-full -mt-10 mb-4 shadow-lg border-4 border-white dark:border-gray-900">
                    <Medal className="w-6 h-6" />
                    <span className="sr-only">2nd</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{podiumData.second.name}</h3>
                  <p className="text-3xl font-bold text-gray-900">{podiumData.second.totalPoints.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">points</p>
                  <p className="text-xs text-muted-foreground mt-1">{podiumData.second.examsCompleted} exams</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              className="order-1 md:order-2"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-4 shadow-xl">
                    <span className="text-4xl font-bold text-yellow-950">
                      {podiumData.first.name.charAt(0)}
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950 px-8 py-2 rounded-full -mt-12 mb-4 shadow-xl border-4 border-white dark:border-yellow-900">
                    <Trophy className="w-8 h-8" />
                    <span className="sr-only">1st</span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">{podiumData.first.name}</h3>
                  <p className="text-4xl font-bold text-yellow-900">{podiumData.first.totalPoints.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">points</p>
                  <p className="text-xs text-muted-foreground mt-1">{podiumData.first.examsCompleted} exams</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              className="order-3 md:order-3 transform md:translate-y-8"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full border-2 border-orange-500/50 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-3xl font-bold text-orange-950">
                      {podiumData.third.name.charAt(0)}
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-orange-950 px-6 py-2 rounded-full -mt-10 mb-4 shadow-lg border-4 border-white dark:border-orange-900">
                    <Award className="w-6 h-6" />
                    <span className="sr-only">3rd</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{podiumData.third.name}</h3>
                  <p className="text-3xl font-bold text-orange-900">{podiumData.third.totalPoints.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">points</p>
                  <p className="text-xs text-muted-foreground mt-1">{podiumData.third.examsCompleted} exams</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Leaderboard Table */}
        {!loading && leaderboardData.length > 0 && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rank</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Points</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Exams</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Streak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((entry) => (
                      <motion.tr
                        key={entry.uid}
                        variants={itemVariants}
                        className={`border-b border-border hover:bg-muted/50 transition-colors ${
                          user?.uid === entry.uid ? 'bg-primary/5' : ''
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div
                            className={`w-10 h-10 rounded-full ${getRankStyle(entry.rank)} flex items-center justify-center`}
                          >
                            {getRankIcon(entry.rank)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {entry.avatarUrl ? (
                              <img
                                src={entry.avatarUrl}
                                alt={entry.name}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                                  entry.rank <= 3 ? getRankStyle(entry.rank) : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {entry.name.charAt(0)}
                              </div>
                            )}
                            <span className="font-medium text-foreground">{entry.name}</span>
                            {user?.uid === entry.uid && (
                              <span className="text-xs text-primary">You</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-primary">
                          {entry.totalPoints.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right text-muted-foreground">{entry.examsCompleted}</td>
                        <td className="px-6 py-4 text-right text-muted-foreground">🔥 {entry.currentStreak}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Pagination Info */}
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Showing {Math.min(offset + leaderboardData.length, total)} of {total} entries
            </div>

            {/* Load More Button (as fallback for mobile) */}
            {hasMore && (
              <div className="mt-4 text-center">
                <button
                  onClick={loadMore}
                  disabled={paginating}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                  {paginating ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
