"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";

export default function LeaderboardPage() {
  const leaderboardData = [
    { rank: 1, name: "Rahul Sharma", points: 2850, examsCompleted: 45, avatar: "RS" },
    { rank: 2, name: "Priya Patel", points: 2680, examsCompleted: 42, avatar: "PP" },
    { rank: 3, name: "Amit Kumar", points: 2590, examsCompleted: 40, avatar: "AK" },
    { rank: 4, name: "Sneha Gupta", points: 2420, examsCompleted: 38, avatar: "SG" },
    { rank: 5, name: "Vikram Singh", points: 2310, examsCompleted: 36, avatar: "VS" },
    { rank: 6, name: "Anjali Verma", points: 2180, examsCompleted: 34, avatar: "AV" },
    { rank: 7, name: "Karan Mehta", points: 2090, examsCompleted: 32, avatar: "KM" },
    { rank: 8, name: "Divya Nair", points: 1980, examsCompleted: 30, avatar: "DN" },
    { rank: 9, name: "Rohan Das", points: 1890, examsCompleted: 29, avatar: "RD" },
    { rank: 10, name: "Pooja Reddy", points: 1750, examsCompleted: 27, avatar: "PR" },
  ];

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

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950";
    if (rank === 2) return "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900";
    if (rank === 3) return "bg-gradient-to-br from-orange-400 to-orange-600 text-orange-950";
    return "bg-muted text-muted-foreground";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5" />;
    if (rank === 2) return <Medal className="w-5 h-5" />;
    if (rank === 3) return <Award className="w-5 h-5" />;
    return <span className="font-bold">{rank}</span>;
  };

  const getRowStyle = (rank: number) => {
    if (rank === 1) return "border-yellow-500/50 shadow-lg shadow-yellow-500/20";
    if (rank === 2) return "border-gray-400/50 shadow-md shadow-gray-400/20";
    if (rank === 3) return "border-orange-500/50 shadow-md shadow-orange-500/20";
    return "";
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Top Performers
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Congratulations to our top performers this month!
          </p>
        </motion.div>

        {/* Podium Section */}
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
                  <span className="text-3xl font-bold text-gray-900">{leaderboardData[1].avatar}</span>
                </div>
                <div className="bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900 px-6 py-2 rounded-full -mt-10 mb-4 shadow-lg border-4 border-white dark:border-gray-900">
                  <Medal className="w-6 h-6" />
                  <span className="sr-only">2nd</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{leaderboardData[1].name}</h3>
                <p className="text-3xl font-bold text-gray-900">{leaderboardData[1].points}</p>
                <p className="text-sm text-muted-foreground">points</p>
                <p className="text-xs text-muted-foreground mt-1">{leaderboardData[1].examsCompleted} exams completed</p>
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
                  <span className="text-4xl font-bold text-yellow-950">{leaderboardData[0].avatar}</span>
                </div>
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950 px-8 py-2 rounded-full -mt-12 mb-4 shadow-xl border-4 border-white dark:border-yellow-900">
                  <Trophy className="w-8 h-8" />
                  <span className="sr-only">1st</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">{leaderboardData[0].name}</h3>
                <p className="text-4xl font-bold text-yellow-900">{leaderboardData[0].points}</p>
                <p className="text-sm text-muted-foreground">points</p>
                <p className="text-xs text-muted-foreground mt-1">{leaderboardData[0].examsCompleted} exams completed</p>
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
                  <span className="text-3xl font-bold text-orange-950">{leaderboardData[2].avatar}</span>
                </div>
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-orange-950 px-6 py-2 rounded-full -mt-10 mb-4 shadow-lg border-4 border-white dark:border-orange-900">
                  <Award className="w-6 h-6" />
                  <span className="sr-only">3rd</span>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">{leaderboardData[2].name}</h3>
                <p className="text-3xl font-bold text-orange-900">{leaderboardData[2].points}</p>
                <p className="text-sm text-muted-foreground">points</p>
                <p className="text-xs text-muted-foreground mt-1">{leaderboardData[2].examsCompleted} exams completed</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Leaderboard Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Rank</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Points</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Exams Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user, index) => (
                    <motion.tr
                      key={user.rank}
                      variants={itemVariants}
                      className={`border-b border-border hover:bg-muted/50 transition-colors ${getRowStyle(user.rank)}`}
                    >
                      <td className="px-6 py-4">
                        <div className={`w-10 h-10 rounded-full ${getRankStyle(user.rank)} flex items-center justify-center`}>
                          {getRankIcon(user.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                            user.rank <= 3
                              ? getRankStyle(user.rank)
                              : "bg-muted text-muted-foreground"
                          }`}>
                            {user.avatar}
                          </div>
                          <span className="font-medium text-foreground">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-primary">
                        {user.points.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-muted-foreground">
                        {user.examsCompleted}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
