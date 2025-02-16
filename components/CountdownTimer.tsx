// CountdownTimer.tsx
"use client";
import { useEffect, useState } from "react";

export const CountdownTimer = ({ examDate }: { examDate: string }) => {
  const [days, setDays] = useState<number>(0);

  useEffect(() => {
    const calculateDays = () => {
      const examTime = new Date(examDate).getTime();
      const now = new Date().getTime();
      return Math.ceil((examTime - now) / (1000 * 60 * 60 * 24));
    };

    setDays(calculateDays());
    const interval = setInterval(() => setDays(calculateDays()), 86400000);
    
    return () => clearInterval(interval);
  }, [examDate]);

  return <>{days > 0 ? days : 0}</>;
};