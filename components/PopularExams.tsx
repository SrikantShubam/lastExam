"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import '../styles/globals.css'
interface Exam {
  id: number;
  exam_id: string;
  name: string;
  exam_date: string;
  other_category: string;
}

function getAdjustedDate(examDate: string) {
  try {
    const date = new Date(examDate);
    if (isNaN(date.getTime())) throw new Error('Invalid date');
    
    const now = new Date();
    let isEstimated = false;
    while (date < now) {
      date.setFullYear(date.getFullYear() + 1);
      isEstimated = true;
    }
    return { date, isEstimated };
  } catch (error) {
    console.error('Invalid exam date:', examDate);
    const fallbackDate = new Date();
    fallbackDate.setMonth(fallbackDate.getMonth() + 3);
    return { date: fallbackDate, isEstimated: true };
  }
}
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
const CountdownTimer = ({ examDate }: { examDate: string }) => {
  const [days, setDays] = useState<number>(0);
  const [isEstimated, setIsEstimated] = useState<boolean>(false);

  useEffect(() => {
    const calculateDays = () => {
      try {
        const { date, isEstimated } = getAdjustedDate(examDate);
        setIsEstimated(isEstimated);
        const now = new Date().getTime();
        const diff = date.getTime() - now;
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

  return (
    <div className="text-center">
      <span className="text-5xl font-bold">{days}</span>
      {isEstimated && <div className="text-xs text-red-500 font-medium">Expected</div>}
    </div>
  );
};

export default function PopularExams({ exams }: { exams: Exam[] }) {
  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-background text-foreground overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/20 to-background opacity-80 -z-10" />
      
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-6xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
      >
        Popular Exams
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exams.map((exam, index) => {
          const { date, isEstimated } = getAdjustedDate(exam.exam_date);
          return (
            <motion.div
      key={`${exam.exam_id}-${index}`} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card text-card-foreground hover:shadow-xl transition-shadow relative overflow-hidden group">
                {/* Subtle Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {exam.other_category?.split(",")[0]?.replace(/\b\w/g, (char) => char.toUpperCase()) || "General"}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold">{exam.name}</h3>
                    <div className="text-sm text-muted-foreground">
                      {date.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <CountdownTimer examDate={exam.exam_date} />
                </div>
               
                <Link href={`/exam-details/${slugify(exam.name)}`} className="mt-6 block relative z-10">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all">
                    View Details
                  </Button>
                </Link>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

// "use client";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { useState, useEffect } from "react";
// import '../styles/globals.css'

// interface Exam {
//   id: number;
//   exam_id: string;
//   name: string;
//   exam_date: string;
//   other_category: string;
// }

// function getAdjustedDate(examDate: string) {
//   try {
//     const date = new Date(examDate);
//     if (isNaN(date.getTime())) throw new Error('Invalid date');
    
//     const now = new Date();
//     let isEstimated = false;
//     while (date < now) {
//       date.setFullYear(date.getFullYear() + 1);
//       isEstimated = true;
//     }
//     return { date, isEstimated };
//   } catch (error) {
//     console.error('Invalid exam date:', examDate);
//     const fallbackDate = new Date();
//     fallbackDate.setMonth(fallbackDate.getMonth() + 3);
//     return { date: fallbackDate, isEstimated: true };
//   }
// }

// const CountdownTimer = ({ examDate }: { examDate: string }) => {
//   const [days, setDays] = useState<number>(0);
//   const [isEstimated, setIsEstimated] = useState<boolean>(false);

//   useEffect(() => {
//     const calculateDays = () => {
//       try {
//         const { date, isEstimated } = getAdjustedDate(examDate);
//         setIsEstimated(isEstimated);
//         const now = new Date().getTime();
//         const diff = date.getTime() - now;
//         return Math.ceil(diff / (1000 * 60 * 60 * 24));
//       } catch (error) {
//         console.error('Date calculation error:', error);
//         return 0;
//       }
//     };

//     const updateDays = () => {
//       const calculatedDays = calculateDays();
//       setDays(calculatedDays > 0 ? calculatedDays : 0);
//     };

//     updateDays();
//     const interval = setInterval(updateDays, 86400000);
    
//     return () => clearInterval(interval);
//   }, [examDate]);

//   return (
//     <div className="text-center">
//       <span className="text-4xl font-mono">{days}</span>
//       {isEstimated && <div className="text-xs mt-1">est.</div>}
//     </div>
//   );
// };

// export default function PopularExams({ exams }: { exams: Exam[] }) {
//   return (
//     <section className="py-24 px-6 bg-white dark:bg-black text-black dark:text-white">
//       <h2 className="text-3xl font-light tracking-tight mb-16 text-center">
//         Upcoming Examinations
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {exams.map((exam, index) => {
//           const { date, isEstimated } = getAdjustedDate(exam.exam_date);
//           return (
//             <div key={`${exam.exam_id}-${index}`}>
//               <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:border-black dark:hover:border-white transition-colors">
//                 <div className="flex justify-between items-start">
//                   <div className="space-y-4">
//                     <div>
//                       <span className="text-xs uppercase tracking-wider">
//                         {exam.other_category?.split(",")[0]?.replace(/\b\w/g, (char) => char.toUpperCase()) || "General"}
//                       </span>
//                     </div>
//                     <h3 className="text-lg font-normal">{exam.name}</h3>
//                     <div className="text-xs text-gray-600 dark:text-gray-400">
//                       {date.toLocaleDateString("en-IN", {
//                         day: "numeric",
//                         month: "long",
//                         year: "numeric",
//                       })}
//                     </div>
//                   </div>
//                   <div className="flex flex-col items-center">
//                     <CountdownTimer examDate={exam.exam_date} />
//                     <div className="text-xs mt-1">days</div>
//                   </div>
//                 </div>
//                 <Link href={`/exam/${exam.exam_id}`} className="mt-8 block">
//                   <Button className="w-full text-xs uppercase tracking-widest py-5 bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 border border-black dark:border-white">
//                     Details
//                   </Button>
//                 </Link>
//               </Card>
//             </div>
//           );
//         })}
//       </div>
//     </section>
//   );
// }