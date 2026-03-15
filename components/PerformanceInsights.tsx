import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Award,
  BookOpen,
  Flame,
  Calendar,
} from "lucide-react";

interface QuizHistory {
  id: string;
  exam: string;
  score: number;
  timestamp: string;
  subject: string;
  timeSpent?: number; // in minutes
}

interface PerformanceInsightsProps {
  quizHistory: QuizHistory[];
  className?: string;
}

export default function PerformanceInsights({
  quizHistory,
  className = "",
}: PerformanceInsightsProps) {
  // Calculate stats
  const totalQuizzes = quizHistory.length;
  const averageScore =
    totalQuizzes > 0
      ? quizHistory.reduce((sum, q) => sum + q.score, 0) / totalQuizzes
      : 0;
  const totalTimeSpent = quizHistory.reduce((sum, q) => sum + (q.timeSpent || 0), 0);
  const totalTimeHours = Math.round(totalTimeSpent / 60 * 10) / 10;

  // Calculate average score per subject
  const avgScoreBySubject = quizHistory.reduce((acc, quiz) => {
    if (!acc[quiz.subject]) {
      acc[quiz.subject] = { totalScore: 0, count: 0 };
    }
    acc[quiz.subject].totalScore += quiz.score;
    acc[quiz.subject].count += 1;
    return acc;
  }, {} as Record<string, { totalScore: number; count: number }>);

  const subjectPerformance = Object.entries(avgScoreBySubject)
    .map(([subject, data]) => ({
      subject,
      avgScore: data.totalScore / data.count,
      quizCount: data.count,
    }))
    .sort((a, b) => b.avgScore - a.avgScore);

  // Calculate improvement (compare last 5 quizzes with previous 5)
  const sortedByDate = [...quizHistory].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const recent5 = sortedByDate.slice(0, 5);
  const previous5 = sortedByDate.slice(5, 10);

  const recentAvg =
    recent5.length > 0 ? recent5.reduce((sum, q) => sum + q.score, 0) / recent5.length : 0;
  const previousAvg =
    previous5.length > 0
      ? previous5.reduce((sum, q) => sum + q.score, 0) / previous5.length
      : recentAvg; // Fallback to recent if no previous

  const improvement = ((recentAvg - previousAvg) / previousAvg) * 100;
  const improvementColor = improvement >= 0 ? "text-green-600" : "text-red-600";

  // Calculate streak (consecutive days with activity)
  const streak = calculateStreak(sortedByDate.map((q) => q.timestamp));

  const cards = [
    {
      title: "Total Quizzes",
      value: totalQuizzes,
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Average Score",
      value: `${Math.round(averageScore)}%`,
      icon: Target,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Study Time",
      value: totalTimeHours > 0 ? `${totalTimeHours}h` : "0h",
      icon: Clock,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Current Streak",
      value: `${streak} day${streak !== 1 ? "s" : ""}`,
      icon: Flame,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.bgColor} border border-gray-200 dark:border-gray-700 rounded-xl p-6`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {card.title}
              </span>
              <card.icon size={20} className="text-gray-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Improvement Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Performance Trend
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Recent performance vs previous quizzes
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${improvementColor}`}>
              {improvement >= 0 ? "+" : ""}
              {improvement.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {improvement >= 0 ? "Improvement" : "Decline"}
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      {subjectPerformance.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 size={24} className="text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Performance by Subject
            </h3>
          </div>
          <div className="space-y-3">
            {subjectPerformance.map((subject) => (
              <div key={subject.subject}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {subject.subject}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(subject.avgScore)}% ({subject.quizCount} {subject.quizCount === 1 ? 'quiz' : 'quizzes'})
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      subject.avgScore >= 80
                        ? "bg-green-500"
                        : subject.avgScore >= 60
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${subject.avgScore}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function calculateStreak(timestamps: string[]): number {
  if (timestamps.length === 0) return 0;

  const uniqueDays = new Set(
    timestamps.map((ts) => new Date(ts).toDateString())
  ).size;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const sortedDates = timestamps
    .map((ts) => new Date(ts))
    .sort((a, b) => b.getTime() - a.getTime())
    .map((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date;
    });

  const uniqueDates = Array.from(new Set(sortedDates.map((d) => d.getTime()))).map(
    (t) => new Date(t)
  );

  for (const date of uniqueDates) {
    const diffDays = Math.floor((currentDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === streak) {
      streak++;
    } else if (diffDays > streak) {
      break;
    }
  }

  return streak;
}
