import { Gem } from "lucide-react";

interface PointsDisplayProps {
  points: number;
  className?: string;
  size?: "small" | "medium" | "large";
}

export function PointsDisplay({ points, className = "", size = "medium" }: PointsDisplayProps) {
  const sizeClasses = {
    small: "text-xs px-2 py-1",
    medium: "text-sm px-3 py-1.5",
    large: "text-base px-4 py-2",
  };

  return (
    <div
      className={`inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-800 dark:text-purple-100 rounded-full font-semibold ${sizeClasses[size]} ${className}`}
    >
      <Gem size={size === "small" ? 14 : size === "medium" ? 16 : 20} className="animate-pulse" />
      <span>{points.toLocaleString()} pts</span>
    </div>
  );
}

interface PointsEarnedBadgeProps {
  pointsEarned: number;
  className?: string;
}

export function PointsEarnedBadge({ pointsEarned, className = "" }: PointsEarnedBadgeProps) {
  return (
    <div
      className={`inline-flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-300 dark:border-green-600 rounded-xl ${className}`}
    >
      <div className="flex items-center gap-2 text-green-700 dark:text-green-100">
        <Gem size={24} className="animate-pulse" />
        <span className="text-2xl font-bold">+{pointsEarned}</span>
      </div>
      <span className="text-sm text-green-600 dark:text-green-200 font-medium mt-1">
        Points Earned!
      </span>
    </div>
  );
}
