"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Exam {
  id: number;
  exam_id: string;
  name: string;
  exam_date: string;
  category: string;
}

function getAdjustedDate(examDate: string) {
  try {
    const date = new Date(examDate);
    if (isNaN(date.getTime())) throw new Error('Invalid date');
    
    const now = new Date();
    if (date < now) {
      date.setFullYear(date.getFullYear() + 1);
      return { date, isEstimated: true };
    }
    return { date, isEstimated: false };
  } catch (error) {
    console.error('Invalid exam date:', examDate);
    const fallbackDate = new Date();
    fallbackDate.setMonth(fallbackDate.getMonth() + 3);
    return { date: fallbackDate, isEstimated: true };
  }
}

const CountdownTimer = ({ examDate }: { examDate: string }) => {
  const [days, setDays] = useState<number>(0);

  useEffect(() => {
    const calculateDays = () => {
      try {
        const examTime = new Date(examDate).getTime();
        const now = new Date().getTime();
        const diff = examTime - now;
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
      } catch (error) {
        console.error('Date calculation error:', error);
        return 0;
      }
    };

    const updateDays = () => {
      const calculatedDays = calculateDays();
      setDays(calculatedDays > 0 ? calculatedDays : 0);
    };

    updateDays();
    const interval = setInterval(updateDays, 86400000);
    
    return () => clearInterval(interval);
  }, [examDate]);

  return <span className="text-5xl font-bold">{days}</span>;
};

export default function PopularExams({ exams }: { exams: Exam[] }) {
    return (
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-background text-foreground">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Popular Exams
        </motion.h2>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exams.map((exam, index) => (
            <motion.div
              key={exam.exam_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card text-card-foreground hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {exam.category?.split(",")[0] || 'General'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold">{exam.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      {new Date(exam.exam_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <CountdownTimer examDate={exam.exam_date} />
                </div>
                <Link href={`/exam/${exam.exam_id}`} className="mt-6 block">
                  <Button className="w-full ">
                    View Details
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }