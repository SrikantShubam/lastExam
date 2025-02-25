// "use client";
// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { GetServerSideProps } from "next";
// import { getExamByName, Exam } from "../../src/lib/loadExams";
// import Layout from "../../components/Layout";

// interface ExamDetails {
//   id: number;
//   exam_id: string;
//   name: string;
//   exam_date: string;
//   duration: string;
//   keywords: string;
//   category: string;
//   application_link: string;
//   more_info: string;
//   exam_description: string;
//   eligibility_criteria: string;
//   important_resources: string;
//   important_dates: string;
// }

// function getAdjustedDate(examDate: string) {
//   try {
//     const date = new Date(examDate);
//     if (isNaN(date.getTime())) throw new Error("Invalid date");

//     const now = new Date();
//     let isEstimated = false;
//     while (date < now) {
//       date.setFullYear(date.getFullYear() + 1);
//       isEstimated = true;
//     }
//     return { date, isEstimated };
//   } catch (error) {
//     console.error("Invalid exam date:", examDate);
//     const fallbackDate = new Date();
//     fallbackDate.setMonth(fallbackDate.getMonth() + 3);
//     return { date: fallbackDate, isEstimated: true };
//   }
// }

// const CountdownTimer = ({ examDate }: { examDate: string }) => {
//   const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

//   useEffect(() => {
//     const updateTimer = () => {
//       const { date } = getAdjustedDate(examDate);
//       const now = new Date().getTime();
//       const diff = date.getTime() - now;

//       if (diff <= 0) {
//         setTimeLeft({ days: 0, hours: 0, minutes: 0 });
//         return;
//       }

//       const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
//       setTimeLeft({ days, hours, minutes });
//     };

//     updateTimer();
//     const interval = setInterval(updateTimer, 60000);
//     return () => clearInterval(interval);
//   }, [examDate]);

//   return (
//     <div className="text-center mt-10 mb-16">
//       <div className="text-6xl sm:text-7xl font-black text-black dark:text-white tracking-tighter">
//         {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m
//       </div>
//       <div className="text-xl sm:text-2xl text-black dark:text-white opacity-70 mt-2">
//         Countdown to Victory
//       </div>
//     </div>
//   );
// };

// export default function ExamDetails({ exam }: { exam: Exam | null }) {
//   if (!exam) {
//     return (
//       <Layout>
//         <div className="text-center py-20 text-black dark:text-white text-2xl font-bold">
//           Exam Not Found
//         </div>
//       </Layout>
//     );
//   }

//   const { date, isEstimated } = getAdjustedDate(exam.exam_date);
//   const importantResources = JSON.parse(exam.important_resources || "{}");
//   const importantDates = JSON.parse(exam.important_dates || "{}");

//   return (
//     <Layout>
//       <section className="py-12 px-4 sm:py-16 sm:px-6 md:px-12 lg:px-24 bg-white dark:bg-black text-black dark:text-white min-h-screen">
//         <div className="max-w-5xl mx-auto">
//           {/* Header Section */}
//           <motion.div
//             initial={{ opacity: 0, y: -30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-center mb-12"
//           >
//             <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tight text-black dark:text-white mb-4">
//               {exam.name}
//             </h1>
//             <div className="text-xl sm:text-2xl opacity-80 mb-6">
//               {date.toLocaleDateString("en-IN", {
//                 day: "numeric",
//                 month: "long",
//                 year: "numeric",
//               })}
//               {isEstimated && (
//                 <span className="ml-2 text-lg text-red-500 dark:text-red-400 font-semibold">
//                   *Expected
//                 </span>
//               )}
//             </div>
//             <p className="text-lg sm:text-xl max-w-2xl mx-auto leading-tight opacity-90">
//               {exam.exam_description}
//             </p>
//           </motion.div>

//           {/* Countdown Timer */}
//           <CountdownTimer examDate={exam.exam_date} />

//           {/* Main Content */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
//             {/* Eligibility Criteria */}
//             <motion.div
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//             >
//               <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
//                 Eligibility
//               </h2>
//               <div className="border-t-2 border-black dark:border-white pt-4">
//                 <p className="text-base sm:text-lg text-black dark:text-white leading-snug whitespace-pre-line">
//                   {exam.eligibility_criteria}
//                 </p>
//               </div>
//             </motion.div>

//             {/* More Info */}
//             <motion.div
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//             >
//               <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
//                 Details
//               </h2>
//               <div className="border-t-2 border-black dark:border-white pt-4">
//                 <p className="text-base sm:text-lg text-black dark:text-white leading-snug whitespace-pre-line">
//                   {exam.more_info}
//                 </p>
//               </div>
//             </motion.div>
//           </div>

//           {/* Dates and Resources */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
//             {/* Important Dates */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//             >
//               <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
//                 Key Dates
//               </h2>
//               <div className="border-t-2 border-black dark:border-white pt-4">
//                 <ul className="text-base sm:text-lg text-black dark:text-white space-y-3">
//                   {Object.entries(importantDates).map(([key, value]) => {
//                     const dateMatch = (value as string).match(/(\d{1,2} \w+ \d{4})/);
//                     let adjustedDate = value as string;
//                     let isDateEstimated = false;

//                     if (dateMatch) {
//                       const parsedDate = getAdjustedDate(dateMatch[0]);
//                       adjustedDate = (value as string).replace(
//                         dateMatch[0],
//                         parsedDate.date.toLocaleDateString("en-IN", {
//                           day: "numeric",
//                           month: "long",
//                           year: "numeric",
//                         })
//                       );
//                       isDateEstimated = parsedDate.isEstimated;
//                     }

//                     return (
//                       <li key={key} className="flex items-start">
//                         <span className="font-semibold min-w-[140px]">{key}:</span>
//                         <span>
//                           {adjustedDate}
//                           {isDateEstimated && (
//                             <span className="ml-2 text-sm text-red-500 dark:text-red-400 font-semibold">
//                               *Expected
//                             </span>
//                           )}
//                         </span>
//                       </li>
//                     );
//                   })}
//                 </ul>
//               </div>
//             </motion.div>

//             {/* Important Resources */}
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: 0.4 }}
//             >
//               <h2 className="text-3xl font-bold text-black dark:text-white mb-4">
//                 Resources
//               </h2>
//               <div className="border-t-2 border-black dark:border-white pt-4">
//                 <ul className="text-base sm:text-lg text-black dark:text-white space-y-3">
//                   {Object.entries(importantResources).map(([key, value]) => (
//                     <li key={key} className="flex items-start">
//                       <span className="font-semibold min-w-[140px]">{key}:</span>
//                       <a
//                         href={value as string}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="underline hover:opacity-70 break-all"
//                       >
//                         {value as string}
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </motion.div>
//           </div>

//           {/* Back Button */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.6 }}
//             className="text-center mb-12"
//           >
//             <Link href="/">
//               <Button className="bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80 px-8 py-3 text-lg font-semibold tracking-wide border-2 border-black dark:border-white">
//                 Back to Categories
//               </Button>
//             </Link>
//           </motion.div>
//         </div>
//       </section>
//     </Layout>
//   );
// }

// // Server-side data fetching
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { name } = context.params as { name: string };

//   if (!name) {
//     return { notFound: true };
//   }

//   const exam = getExamByName(name);

//   if (!exam) {
//     return { notFound: true };
//   }

//   return {
//     props: {
//       exam,
//     },
//   };
// };
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GetServerSideProps } from "next";
import { getExamByName, Exam } from "../../src/lib/loadExams";
import Layout from "../../components/Layout";

interface ExamDetails {
  id: number;
  exam_id: string;
  name: string;
  exam_date: string;
  duration: string;
  keywords: string;
  category: string;
  application_link: string;
  more_info: string;
  exam_description: string;
  eligibility_criteria: string;
  important_resources: string;
  important_dates: string;
}

function getAdjustedDate(examDate: string) {
  try {
    const date = new Date(examDate);
    if (isNaN(date.getTime())) throw new Error("Invalid date");

    const now = new Date();
    let isEstimated = false;
    while (date < now) {
      date.setFullYear(date.getFullYear() + 1);
      isEstimated = true;
    }
    return { date, isEstimated };
  } catch (error) {
    console.error("Invalid exam date:", examDate);
    const fallbackDate = new Date();
    fallbackDate.setMonth(fallbackDate.getMonth() + 3);
    return { date: fallbackDate, isEstimated: true };
  }
}

const CountdownTimer = ({ examDate }: { examDate: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const { date } = getAdjustedDate(examDate);
      const now = new Date().getTime();
      const diff = date.getTime() - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ days, hours, minutes });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [examDate]);

  return (
    <div className="my-12 text-center">
      <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-black dark:text-white">
        {String(timeLeft.days).padStart(2, "0")} :{" "}
        {String(timeLeft.hours).padStart(2, "0")} :{" "}
        {String(timeLeft.minutes).padStart(2, "0")}
      </div>
      <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-black dark:text-white opacity-70">
        Days · Hours · Minutes
      </div>
    </div>
  );
};

export default function ExamDetails({ exam }: { exam: Exam | null }) {
  if (!exam) {
    return (
      <Layout>
        <div className="py-20 text-center text-xl font-bold text-black dark:text-white">
          Exam Not Found
        </div>
      </Layout>
    );
  }

  const { date, isEstimated } = getAdjustedDate(exam.exam_date);
  const importantResources = JSON.parse(exam.important_resources || "{}");
  const importantDates = JSON.parse(exam.important_dates || "{}");

  return (
    <Layout>
      <section className="max-w-4xl px-6 py-16 mx-auto bg-white dark:bg-black text-black dark:text-white min-h-screen">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-2 text-4xl sm:text-5xl font-bold tracking-tight text-black dark:text-white">
            {exam.name}
          </h1>
          <div className="mb-6 text-sm font-semibold uppercase tracking-widest text-black dark:text-white opacity-70">
            {date.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {isEstimated && (
              <span className="ml-2 text-red-500 dark:text-red-400 font-semibold">
                · Estimated
              </span>
            )}
          </div>
          <p className="max-w-xl mx-auto text-sm sm:text-base text-black dark:text-white opacity-80 leading-relaxed">
            {exam.exam_description}
          </p>
        </motion.header>

        {/* Countdown Timer */}
        <CountdownTimer examDate={exam.exam_date} />

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 gap-12 mb-16 md:grid-cols-2 md:gap-16"
        >
          {/* Eligibility */}
          <div>
            <h2 className="mb-4 text-lg sm:text-xl font-semibold uppercase tracking-widest text-black dark:text-white">
              Eligibility
            </h2>
            <div className="pt-3 border-t-2 border-black dark:border-white">
              <p className="text-sm sm:text-base text-black dark:text-white leading-relaxed whitespace-pre-line">
                {exam.eligibility_criteria}
              </p>
            </div>
          </div>

          {/* Details */}
          <div>
            <h2 className="mb-4 text-lg sm:text-xl font-semibold uppercase tracking-widest text-black dark:text-white">
              Details
            </h2>
            <div className="pt-3 border-t-2 border-black dark:border-white">
              <p className="text-sm sm:text-base text-black dark:text-white leading-relaxed whitespace-pre-line">
                {exam.more_info}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Dates and Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 gap-12 mb-16 md:grid-cols-2 md:gap-16"
        >
          {/* Important Dates */}
          <div>
            <h2 className="mb-4 text-lg sm:text-xl font-semibold uppercase tracking-widest text-black dark:text-white">
              Key Dates
            </h2>
            <div className="pt-3 border-t-2 border-black dark:border-white">
              <ul className="space-y-4 text-sm sm:text-base text-black dark:text-white">
                {Object.entries(importantDates).map(([key, value]) => {
                  const dateMatch = (value as string).match(
                    /(\d{1,2}(?:st|nd|rd|th)?\s+\w+\s+\d{4}|\d{1,2}\s+\w+\s+\d{4})/i
                  );
                  let adjustedDate = value as string;
                  let isDateEstimated = false;

                  if (dateMatch) {
                    const cleanDateStr = dateMatch[0].replace(
                      /(\d+)(st|nd|rd|th)/,
                      "$1"
                    );
                    try {
                      const parsedDate = getAdjustedDate(cleanDateStr);
                      const formattedDate = parsedDate.date.toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      );
                      adjustedDate = (value as string).replace(
                        dateMatch[0],
                        formattedDate
                      );
                      isDateEstimated = parsedDate.isEstimated;
                    } catch (e) {
                      console.error("Error parsing date:", cleanDateStr, e);
                    }
                  }

                  return (
                    <li key={key} className="flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wider text-black dark:text-white opacity-60">
                        {key}
                      </span>
                      <span>
                        {adjustedDate}
                        {isDateEstimated && (
                          <span className="ml-2 text-xs text-red-500 dark:text-red-400">
                            · Estimated
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Important Resources */}
          <div>
            <h2 className="mb-4 text-lg sm:text-xl font-semibold uppercase tracking-widest text-black dark:text-white">
              Resources
            </h2>
            <div className="pt-3 border-t-2 border-black dark:border-white">
              <ul className="space-y-4 text-sm sm:text-base text-black dark:text-white">
                {Object.entries(importantResources).map(([key, value]) => (
                  <li key={key} className="group flex items-start">
                    <span className="inline-flex items-center justify-center w-8 h-5 mr-2 text-xs font-bold border border-black dark:border-white rounded-sm">
                      LINK
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold uppercase tracking-wider text-black dark:text-white opacity-60">
                        {key}
                      </span>
                      <a
                        href={value as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-b border-transparent group-hover:border-black dark:group-hover:border-white transition-colors break-all"
                      >
                        {(value as string).length > 40
                          ? (value as string).substring(0, 40) + "..."
                          : value as string}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Link href="/exam-categories">
            <Button className="px-6 py-2 text-sm font-semibold uppercase tracking-widest bg-black text-white dark:bg-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 border border-black dark:border-white">
              Back to Categories
            </Button>
          </Link>
        </motion.div>
      </section>
    </Layout>
  );
}

// Server-side data fetching
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { name } = context.params as { name: string };

  if (!name) {
    return { notFound: true };
  }

  const exam = getExamByName(name);

  if (!exam) {
    return { notFound: true };
  }

  return {
    props: {
      exam,
    },
  };
};