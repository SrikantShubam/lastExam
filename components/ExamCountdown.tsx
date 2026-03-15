import { useState, useEffect } from "react";
import { Calendar, Clock, AlertCircle } from "lucide-react";

interface ExamCountdownProps {
  examDate: string; // ISO date string
  examName?: string;
  className?: string;
  size?: "small" | "medium" | "large";
  showLabel?: boolean;
}

export default function ExamCountdown({
  examDate,
  examName,
  className = "",
  size = "medium",
  showLabel = true,
}: ExamCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(examDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [examDate]);

  const sizeClasses = {
    small: {
      container: "px-3 py-2 text-xs",
      number: "text-lg",
      label: "text-xs",
      icon: 16,
    },
    medium: {
      container: "px-4 py-3 text-sm",
      number: "text-2xl",
      label: "text-sm",
      icon: 20,
    },
    large: {
      container: "px-6 py-4 text-base",
      number: "text-4xl",
      label: "text-base",
      icon: 24,
    },
  };

  const currentSize = sizeClasses[size];

  if (timeLeft.isExpired) {
    return (
      <div
        className={`${currentSize.container} border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg ${className}`}
      >
        <div className="flex items-center gap-2">
          <AlertCircle size={currentSize.icon} />
          <span className="font-semibold">Exam已过期</span>
        </div>
      </div>
    );
  }

  // Determine urgency style
  const isUrgent = timeLeft.days < 7;
  const veryUrgent = timeLeft.days < 3;

  const bgClass = veryUrgent
    ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
    : isUrgent
    ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200"
    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200";

  const formatTimeUnit = (value: number) => value.toString().padStart(2, "0");

  return (
    <div
      className={`${currentSize.container} ${bgClass} border rounded-lg ${className}`}
    >
      {showLabel && examName && (
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={currentSize.icon} />
          <span className="font-semibold">{examName}</span>
        </div>
      )}
      <div className="flex items-center justify-center gap-4 md:gap-6">
        {timeLeft.days > 0 && (
          <div className="text-center">
            <div className={`${currentSize.number} font-bold`}>{timeLeft.days}</div>
            {showLabel && (
              <div className={`${currentSize.label} opacity-70`}>天</div>
            )}
          </div>
        )}
        {(timeLeft.days > 0 || timeLeft.hours > 0) && (
          <div className="text-center">
            <div className={`${currentSize.number} font-bold`}>
              {formatTimeUnit(timeLeft.hours)}
            </div>
            {showLabel && (
              <div className={`${currentSize.label} opacity-70`}>小时</div>
            )}
          </div>
        )}
        <div className="text-center">
          <div className={`${currentSize.number} font-bold`}>
            {formatTimeUnit(timeLeft.minutes)}
          </div>
          {showLabel && (
            <div className={`${currentSize.label} opacity-70`}>分钟</div>
          )}
        </div>
        {(!showLabel || size === "large") && (
          <div className="text-center">
            <div className={`${currentSize.number} font-bold`}>
              {formatTimeUnit(timeLeft.seconds)}
            </div>
            {showLabel && (
              <div className={`${currentSize.label} opacity-70`}>秒</div>
            )}
          </div>
        )}
      </div>
      {isUrgent && !veryUrgent && (
        <div className="flex items-center justify-center gap-1 mt-2 text-xs">
          <Clock size={12} />
          <span>倒计时中...</span>
        </div>
      )}
      {veryUrgent && (
        <div className="flex items-center justify-center gap-1 mt-2 text-xs font-semibold animate-pulse">
          <AlertCircle size={12} />
          <span>即将开始!</span>
        </div>
      )}
    </div>
  );
}

// Mini card variant
interface ExamCountdownCardProps {
  examDate: string;
  examName: string;
}

export function ExamCountdownCard({ examDate, examName }: ExamCountdownCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2">
        <h3 className="text-white font-semibold text-sm truncate">{examName}</h3>
      </div>
      <div className="p-4">
        <ExamCountdown examDate={examDate} showLabel={false} size="small" />
      </div>
    </div>
  );
}

// List variant for exam listings
interface ExamCountdownListItemProps {
  examDate: string;
  examName: string;
}

export function ExamCountdownListItem({ examDate, examName }: ExamCountdownListItemProps) {
  const diffDays = Math.floor(
    (new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const isUrgent = diffDays < 7;
  const urgentClass = isUrgent ? "text-red-600 dark:text-red-400" : "text-blue-600 dark:text-blue-400";

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1 mr-4">
        {examName}
      </span>
      <span className={`text-sm font-medium ${urgentClass} whitespace-nowrap`}>
        {diffDays > 0 ? `${diffDays} 天` : "今天"}
      </span>
    </div>
  );
}
