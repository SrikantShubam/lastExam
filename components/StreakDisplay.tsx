import { useState, useEffect } from "react";
import { Flame, TrendingUp } from "lucide-react";
import { useAuth } from "./context/AuthContext";

interface StreakDisplayProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

export function StreakDisplay({ className = "", size = "medium" }: StreakDisplayProps) {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (user) {
      // Load streak from localStorage
      const savedStreak = localStorage.getItem(`streak_${user.uid}`);
      if (savedStreak) {
        setStreak(parseInt(savedStreak, 10));
      }
    }
  }, [user]);

  const sizeClasses = {
    small: "text-xs px-2 py-1",
    medium: "text-sm px-3 py-1.5",
    large: "text-base px-4 py-2",
  };

  const flameSize = { small: 14, medium: 16, large: 20 }[size];

  const getStreakColor = () => {
    if (streak >= 30) return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100";
    if (streak >= 14) return "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100";
    if (streak >= 7) return "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100";
    return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
  };

  const isHotStreak = streak >= 7;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full font-semibold ${getStreakColor()} ${sizeClasses[size]} ${className}`}
    >
      <Flame
        size={flameSize}
        className={`${isHotStreak ? "animate-pulse" : ""}`}
      />
      <span>{streak} day{streak !== 1 ? "s" : ""}</span>
      {isHotStreak && (
        <TrendingUp size={flameSize} className="opacity-70" />
      )}
    </div>
  );
}

// Hook to update and track streaks
export function useStreakUpdate() {
  const { user } = useAuth();

  const updateStreak = () => {
    if (!user) return;

    const today = new Date().toDateString();
    const lastActivity = localStorage.getItem(`lastActivity_${user.uid}`);
    let currentStreak = parseInt(localStorage.getItem(`streak_${user.uid}`) || "0", 10);

    if (lastActivity === today) {
      // Already recorded activity today, no change
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    if (lastActivity === yesterdayString) {
      // Consecutive day, increment streak
      currentStreak += 1;
    } else if (lastActivity) {
      // Missed a day, reset streak
      currentStreak = 1;
    } else {
      // First time recording activity
      currentStreak = 1;
    }

    localStorage.setItem(`lastActivity_${user.uid}`, today);
    localStorage.setItem(`streak_${user.uid}`, currentStreak.toString());
  };

  return { updateStreak };
}
