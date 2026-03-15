// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
// import { Badge } from '@/components/ui/badge';
// import { Card } from '@/components/ui/card';
// import { FiCheck, FiX, FiCopy, FiClock, FiList, FiChevronDown, FiChevronUp, FiCircle, FiArrowRight } from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
// import { Tooltip as ReactTooltip } from 'react-tooltip';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/router';
// import { cn } from '@/lib/utils';

// interface SummaryScreenProps {
//   questions: Array<{
//     question_no: number;
//     question: string;
//     question_type: string;
//     options?: Record<string, string>;
//   }>;
//   userAnswers: Record<number, string>;
//   flaggedQuestions: number[];
//   totalQuestions: number;
//   positiveMarking: number;
//   negativeMarking: number;
//   timeTaken: number;
//   paperName: string;
//   decryptAnswer: (questionNo: number) => string | null;
// }

// const SummaryScreen: React.FC<SummaryScreenProps> = ({
//   questions,
//   userAnswers,
//   flaggedQuestions,
//   totalQuestions,
//   positiveMarking,
//   negativeMarking,
//   timeTaken,
//   paperName,
//   decryptAnswer,
// }) => {
//   const router = useRouter();
//   const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
//   const [showIncorrectOnly, setShowIncorrectOnly] = useState(false);

//   useEffect(() => {
//     // console.log('Total Questions:', questions.length);
//     // console.log('User Answers:', userAnswers);
//     questions.forEach((q) => {
//       const userAnswer = userAnswers[q.question_no];
//       const correctAnswer = decryptAnswer(q.question_no);
//       // console.log(`Question ${q.question_no}: User Answer = ${userAnswer || 'Not answered'}, Correct Answer = ${correctAnswer || 'Failed to decrypt'}`);
//     });
//   }, [questions, userAnswers, decryptAnswer]);

//   const calculateMetrics = () => {
//     let score = 0;
//     let correct = 0;
//     let incorrect = 0;
//     let unanswered = 0;
//     let positiveMarks = 0;
//     let negativeMarks = 0;
//     let attempted = 0;

//     questions.forEach((q) => {
//       const userAnswer = userAnswers[q.question_no];
//       const correctAnswer = decryptAnswer(q.question_no);

//       if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
//         attempted += 1;
//         if (correctAnswer) {
//           if (q.question_type === 'mcq') {
//             if (userAnswer === correctAnswer) {
//               score += positiveMarking;
//               positiveMarks += positiveMarking;
//               correct += 1;
//             } else {
//               score -= negativeMarking;
//               negativeMarks += negativeMarking;
//               incorrect += 1;
//             }
//           } else if (q.question_type === 'fill-in-the-blanks') {
//             const userAnswerNormalized = userAnswer.toLowerCase().trim().replace(/\s+/g, '');
//             const correctAnswerNormalized = correctAnswer.toLowerCase().trim().replace(/\s+/g, '');
//             if (userAnswerNormalized === correctAnswerNormalized) {
//               score += positiveMarking;
//               positiveMarks += positiveMarking;
//               correct += 1;
//             } else {
//               score -= negativeMarking;
//               negativeMarks += negativeMarking;
//               incorrect += 1;
//             }
//           }
//         } else {
//           score -= negativeMarking;
//           negativeMarks += negativeMarking;
//           incorrect += 1;
//         }
//       } else {
//         unanswered += 1;
//       }
//     });

//     const actualTotalQuestions = questions.length;
//     const maxScore = actualTotalQuestions * positiveMarking;
//     const accuracy = actualTotalQuestions > 0 ? ((correct / actualTotalQuestions) * 100).toFixed(1) : '0';
//     const attemptRate = actualTotalQuestions > 0 ? ((attempted / actualTotalQuestions) * 100).toFixed(1) : '0';
//     const avgTimePerQuestion = actualTotalQuestions > 0 ? (timeTaken / actualTotalQuestions).toFixed(1) : '0';

//     // console.log('Metrics:', { score, correct, incorrect, unanswered, attempted, totalQuestions: actualTotalQuestions });

//     return {
//       score,
//       maxScore,
//       positiveMarks,
//       negativeMarks,
//       correct,
//       incorrect,
//       unanswered,
//       attempted,
//       accuracy,
//       attemptRate,
//       avgTimePerQuestion,
//     };
//   };

//   const {
//     score,
//     maxScore,
//     positiveMarks,
//     negativeMarks,
//     correct,
//     incorrect,
//     unanswered,
//     attempted,
//     accuracy,
//     attemptRate,
//     avgTimePerQuestion,
//   } = calculateMetrics();
//   const percentage = maxScore > 0 ? parseFloat(((score / maxScore) * 100).toFixed(1)) : 0;
//   const isPass = percentage >= 60;

//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${minutes}m ${secs}s`;
//   };

//   const toggleQuestion = (questionNo: number) => {
//     setExpandedQuestions((prev) =>
//       prev.includes(questionNo) ? prev.filter((no) => no !== questionNo) : [...prev, questionNo]
//     );
//   };

//   const handleExpandAll = () => {
//     setShowIncorrectOnly(false);
//     setExpandedQuestions(questions.map((q) => q.question_no));
//   };

//   const handleReviewIncorrect = () => {
//     setShowIncorrectOnly((prev) => !prev);
//     if (!showIncorrectOnly) {
//       setExpandedQuestions([]);
//     }
//   };

//   const handleRetryQuiz = () => {
//     const { exam, subject, paper, mode } = router.query;
//     localStorage.removeItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`);
//     router.push(`/${exam}/${subject}/${paper}?mode=${mode}`);
//   };

//   const handleShareScore = () => {
//     const text = `I scored ${percentage}% (${correct}/${questions.length}) on ${paperName} in ${formatTime(timeTaken)}.`;
//     navigator.clipboard.writeText(text).then(() => {
//       toast.success('Score copied to clipboard!', { autoClose: 2000 });
//     });
//   };

//   const chartData = [
//     { name: 'Attempted', value: attempted, fill: '#0ea5e9' },
//     { name: 'Correct', value: correct, fill: '#22d3ee' },
//     { name: 'Incorrect', value: incorrect, fill: '#a855f7' },
//     { name: 'Unanswered', value: unanswered, fill: '#6b7280' },
//   ];

//   if (!questions || questions.length === 0) {
//     return (
//       <section className="py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//             Submission Summary
//           </h2>
//           <p className="text-destructive">Error: No questions available.</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
//       <div className="max-w-5xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="mb-12"
//         >
//           <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
//             Submission Summary
//           </h2>
//           <p className="text-muted-foreground text-center max-w-2xl mx-auto">
//             Review your performance and analyze your results. See what you got right and where you can improve.
//           </p>
//         </motion.div>

//         <div className="absolute inset-0 z-0">
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
//           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgNjBIMFYwaDYwdjYweiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-5 z-0" />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="lg:col-span-1 relative"
//           >
//             <Card className="h-full p-6 flex flex-col items-center justify-center overflow-hidden relative">
//               <motion.div
//                 className="absolute bottom-0 right-0 w-64 h-64 rounded-full"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 0.05 }}
//                 transition={{ duration: 1.5, ease: 'easeOut' }}
//               >
//                 <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
//               </motion.div>

//               <h3 className="text-2xl font-bold mb-4 relative">Your Score</h3>
//               <div className="w-32 h-32 mb-6 relative">
//                 <CircularProgressbar
//                   value={percentage}
//                   text={`${percentage}%`}
//                   styles={buildStyles({
//                     textColor: 'hsl(var(--foreground))',
//                     pathColor: isPass ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-1))',
//                     trailColor: 'hsl(var(--muted))',
//                     textSize: '20px',
//                   })}
//                 />
//               </div>
//               <p className="text-3xl font-bold mb-2 relative">
//                 {score} / {maxScore}
//               </p>
//               <Badge
//                 className={cn(
//                   'text-base font-medium mb-4 py-1 px-3',
//                   isPass ? 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20' : 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20'
//                 )}
//               >
//                 {isPass ? 'Pass (≥60%)' : 'Fail (<60%)'}
//               </Badge>
//               <p
//                 className="text-base text-muted-foreground relative"
//                 data-tooltip-id="score-calc"
//                 data-tooltip-content={`Score = ${correct} Correct × ${positiveMarking} − ${incorrect} Incorrect × ${negativeMarking}`}
//               >
//                 +{positiveMarks} (Correct) − {negativeMarks} (Incorrect) = {score} Total
//               </p>
//               <ReactTooltip id="score-calc" place="top" />
//             </Card>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="lg:col-span-2 relative"
//           >
//             <Card className="h-full p-6 overflow-hidden relative">
//               <h3 className="text-2xl font-bold mb-4">Performance Metrics</h3>

//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                 <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
//                   <FiList className="text-2xl mb-2 text-foreground" />
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Total Questions</p>
//                   <p className="text-2xl font-bold">{questions.length}</p>
//                 </div>

//                 <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
//                   <FiCheck className="text-2xl mb-2 text-emerald-500" />
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Accuracy</p>
//                   <p className="text-2xl font-bold">{accuracy}%</p>
//                 </div>

//                 <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
//                   <FiClock className="text-2xl mb-2 text-foreground" />
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Time Taken</p>
//                   <p className="text-2xl font-bold">{formatTime(timeTaken)}</p>
//                 </div>

//                 <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
//                   <FiClock className="text-2xl mb-2 text-foreground" />
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Avg Time/Q</p>
//                   <p className="text-2xl font-bold">{avgTimePerQuestion}s</p>
//                 </div>
//               </div>

//               <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
//                 <div className="flex flex-col items-center p-3 bg-blue-500/10 rounded-lg">
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Attempted</p>
//                   <p className="text-3xl font-bold text-blue-500">{attempted}</p>
//                   <p className="text-xs text-muted-foreground mt-1">{attemptRate}% of total</p>
//                 </div>

//                 <div className="flex flex-col items-center p-3 bg-emerald-500/10 rounded-lg">
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Correct</p>
//                   <p className="text-3xl font-bold text-emerald-500">{correct}</p>
//                 </div>

//                 <div className="flex flex-col items-center p-3 bg-rose-500/10 rounded-lg">
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Incorrect</p>
//                   <p className="text-3xl font-bold text-rose-500">{incorrect}</p>
//                 </div>

//                 <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Unanswered</p>
//                   <p className="text-3xl font-bold text-muted-foreground">{unanswered}</p>
//                 </div>
//               </div>

//               <motion.div
//                 className="absolute bottom-0 left-0 w-64 h-64 rounded-full"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 0.05 }}
//                 transition={{ duration: 1.5, ease: 'easeOut' }}
//               >
//                 <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
//               </motion.div>
//             </Card>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//             className="lg:col-span-2 relative"
//           >
//             <Card className="h-full p-6 overflow-hidden relative">
//               <h3 className="text-2xl font-bold mb-6">Performance Overview</h3>
//               <div className="w-full h-[200px] mx-auto">
//                 <BarChart
//                   width={500}
//                   height={200}
//                   data={chartData}
//                   layout="vertical"
//                   margin={{ left: 75, right: 30, top: 10, bottom: 10 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                   <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
//                   <YAxis
//                     type="category"
//                     dataKey="name"
//                     tick={{ fontSize: 14 }}
//                     stroke="hsl(var(--muted-foreground))"
//                     width={70}
//                   />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: 'hsl(var(--card))',
//                       borderColor: 'hsl(var(--border))',
//                       color: 'hsl(var(--foreground))',
//                     }}
//                   />
//                   <Bar dataKey="value" radius={[0, 4, 4, 0]} />
//                 </BarChart>
//               </div>

//               <motion.div
//                 className="absolute top-1/2 right-0 w-32 h-32 rounded-full"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 0.05 }}
//                 transition={{ duration: 1.5, ease: 'easeOut' }}
//               >
//                 <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
//               </motion.div>
//             </Card>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//             className="lg:col-span-1 relative"
//           >
//             <Card className="h-full p-6 overflow-hidden relative">
//               <h3 className="text-2xl font-bold mb-6">Actions</h3>
//               <div className="space-y-4">
//                 <Button onClick={handleRetryQuiz} className="w-full justify-between group">
//                   Retry Quiz
//                   <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
//                 </Button>

//                 <Button
//                   onClick={() => router.push('/dashboard')}
//                   className="w-full justify-between group"
//                   variant="outline"
//                 >
//                   Dashboard
//                   <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
//                 </Button>

//                 <Button
//                   onClick={handleShareScore}
//                   className="w-full justify-between group"
//                   variant="secondary"
//                 >
//                   <span className="flex items-center">
//                     <FiCopy className="mr-2" />
//                     Share Score
//                   </span>
//                   <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
//                 </Button>
//               </div>

//               <motion.div
//                 className="absolute bottom-0 right-0 w-32 h-32 rounded-full"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 0.05 }}
//                 transition={{ duration: 1.5, ease: 'easeOut' }}
//               >
//                 <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
//               </motion.div>
//             </Card>
//           </motion.div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.5 }}
//           className="relative"
//         >
//           <Card className="p-6 overflow-hidden relative">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-2xl font-bold">Question Review</h3>
//               <div className="flex gap-3">
//                 <Button
//                   onClick={handleReviewIncorrect}
//                   variant={showIncorrectOnly ? 'secondary' : 'outline'}
//                   className="text-sm"
//                   size="sm"
//                 >
//                   {showIncorrectOnly ? 'Show All' : `Incorrect Only (${incorrect})`}
//                 </Button>
//                 <Button onClick={handleExpandAll} variant="outline" className="text-sm" size="sm">
//                   Expand All
//                 </Button>
//               </div>
//             </div>

//             <Collapsible open={true}>
//               <div className="grid grid-cols-1 gap-4">
//                 <AnimatePresence>
//                   {questions
//                     .filter((q) => {
//                       if (!showIncorrectOnly) return true;
//                       const userAnswer = userAnswers[q.question_no];
//                       const correctAnswer = decryptAnswer(q.question_no);
//                       return userAnswer && correctAnswer && userAnswer !== correctAnswer;
//                     })
//                     .map((q, index) => {
//                       const correctAnswerKey = decryptAnswer(q.question_no);
//                       const userAnswerKey = userAnswers[q.question_no];
//                       const correctAnswerValue = correctAnswerKey && q.options ? q.options[correctAnswerKey] : correctAnswerKey || 'Answer not available';
//                       const userAnswerValue = userAnswerKey && q.options ? q.options[userAnswerKey] : userAnswerKey || 'Not answered';
//                       const isCorrect =
//                         userAnswerKey &&
//                         correctAnswerKey &&
//                         (q.question_type === 'mcq'
//                           ? userAnswerKey === correctAnswerKey
//                           : userAnswerKey.toLowerCase().trim().replace(/\s+/g, '') ===
//                             correctAnswerKey.toLowerCase().trim().replace(/\s+/g, ''));
//                       const isFlagged = flaggedQuestions.includes(q.question_no);

//                       return (
//                         <motion.div
//                           key={q.question_no}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ duration: 0.3, delay: index * 0.05 }}
//                         >
//                           <Card
//                             className={cn(
//                               'border transition-colors',
//                               isCorrect ? 'hover:border-emerald-500/50' : 'hover:border-rose-500/50',
//                               expandedQuestions.includes(q.question_no)
//                                 ? isCorrect
//                                   ? 'border-emerald-500/50'
//                                   : 'border-rose-500/50'
//                                 : 'border-border'
//                             )}
//                           >
//                             <Collapsible
//                               open={expandedQuestions.includes(q.question_no)}
//                               onOpenChange={() => toggleQuestion(q.question_no)}
//                             >
//                               <CollapsibleTrigger asChild>
//                                 <div className="p-4 flex items-center justify-between cursor-pointer">
//                                   <div className="flex items-center gap-3">
//                                     <div
//                                       className={cn(
//                                         'flex items-center justify-center w-8 h-8 rounded-full',
//                                         isCorrect
//                                           ? 'bg-emerald-500/10 text-emerald-500'
//                                           : userAnswerKey
//                                           ? 'bg-rose-500/10 text-rose-500'
//                                           : 'bg-muted text-muted-foreground'
//                                       )}
//                                     >
//                                       {isCorrect ? <FiCheck /> : userAnswerKey ? <FiX /> : <FiCircle />}
//                                     </div>
//                                     <div>
//                                       <p className="font-medium text-foreground">
//                                         Question {q.question_no}
//                                         {isFlagged && (
//                                           <Badge className="ml-2 bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
//                                             Flagged
//                                           </Badge>
//                                         )}
//                                       </p>
//                                       <p className="text-sm text-muted-foreground line-clamp-1">
//                                         {q.question.substring(0, 60)}...
//                                       </p>
//                                     </div>
//                                   </div>
//                                   <div className="flex items-center">
//                                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
//                                       {expandedQuestions.includes(q.question_no) ? (
//                                         <FiChevronUp className="text-lg" />
//                                       ) : (
//                                         <FiChevronDown className="text-lg" />
//                                       )}
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </CollapsibleTrigger>
//                               <CollapsibleContent>
//                                 <div className="px-4 pb-4 border-t border-border pt-4">
//                                   <p className="mb-4 text-foreground">{q.question}</p>

//                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                                     <div
//                                       className={cn(
//                                         'p-3 rounded-lg',
//                                         !userAnswerKey
//                                           ? 'bg-muted/50'
//                                           : isCorrect
//                                           ? 'bg-emerald-500/10'
//                                           : 'bg-rose-500/10'
//                                       )}
//                                     >
//                                       <p className="text-sm text-muted-foreground mb-1">Your Answer</p>
//                                       <p className="font-medium">{userAnswerValue}</p>
//                                     </div>

//                                     <div className="p-3 rounded-lg bg-emerald-500/10">
//                                       <p className="text-sm text-muted-foreground mb-1">Correct Answer</p>
//                                       <p className="font-medium">{correctAnswerValue}</p>
//                                     </div>
//                                   </div>

//                                   <div className="flex justify-end">
//                                     <a
//                                       href={`https://www.google.com/search?q=explain ${encodeURIComponent(q.question)}`}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="text-primary underline-offset-4 hover:underline"
//                                     >
//                                       Explain Answer
//                                     </a>
//                                   </div>
//                                 </div>
//                               </CollapsibleContent>
//                             </Collapsible>
//                           </Card>
//                         </motion.div>
//                       );
//                     })}
//                 </AnimatePresence>
//               </div>
//             </Collapsible>

//             <motion.div
//               className="absolute bottom-0 left-0 w-64 h-64 rounded-full"
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 0.05 }}
//               transition={{ duration: 1.5, ease: 'easeOut' }}
//             >
//               <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
//             </motion.div>
//           </Card>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default SummaryScreen;

































// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { Button } from '@/components/ui/button';
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
// import { Badge } from '@/components/ui/badge';
// import { Card } from '@/components/ui/card';
// import { FiCheck, FiX, FiCopy, FiClock, FiList, FiChevronDown, FiChevronUp, FiCircle, FiArrowRight } from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
// import { Tooltip as ReactTooltip } from 'react-tooltip';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/router';
// import { cn } from '@/lib/utils';
// import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
// import { db } from '../../lib/firebase'; // Adjust path as needed
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';

// interface SummaryScreenProps {
//   questions: Array<{
//     question_no: number;
//     question: string;
//     question_type: string;
//     options?: Record<string, string>;
//   }>;
//   userAnswers: Record<number, string>;
//   flaggedQuestions: number[];
//   totalQuestions: number;
//   positiveMarking: number;
//   negativeMarking: number;
//   timeTaken: number;
//   paperName: string;
//   decryptAnswer: (questionNo: number) => string | null;
// }

// const SummaryScreen: React.FC<SummaryScreenProps> = ({
//   questions,
//   userAnswers,
//   flaggedQuestions,
//   totalQuestions,
//   positiveMarking,
//   negativeMarking,
//   timeTaken,
//   paperName,
//   decryptAnswer,
// }) => {
//   const router = useRouter();
//   const { exam, subject, paper, mode } = router.query;
//   const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
//   const [showIncorrectOnly, setShowIncorrectOnly] = useState(false);
//   const [tips, setTips] = useState<string[]>([]);
//   const [loadingTips, setLoadingTips] = useState(true);
//   const [previousAccuracy, setPreviousAccuracy] = useState<number | null>(null);
//   const [isExporting, setIsExporting] = useState(false);

//   useEffect(() => {
//     // console.log('Total Questions:', questions.length);
//     // console.log('User Answers:', userAnswers);
//     questions.forEach((q) => {
//       const userAnswer = userAnswers[q.question_no];
//       const correctAnswer = decryptAnswer(q.question_no);
//       // console.log(`Question ${q.question_no}: User Answer = ${userAnswer || 'Not answered'}, Correct Answer = ${correctAnswer || 'Failed to decrypt'}`);
//     });
//   }, [questions, userAnswers, decryptAnswer]);

//   const calculateMetrics = () => {
//     let score = 0;
//     let correct = 0;
//     let incorrect = 0;
//     let unanswered = 0;
//     let positiveMarks = 0;
//     let negativeMarks = 0;
//     let attempted = 0;

//     questions.forEach((q) => {
//       const userAnswer = userAnswers[q.question_no];
//       const correctAnswer = decryptAnswer(q.question_no);

//       if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
//         attempted += 1;
//         if (correctAnswer) {
//           if (q.question_type === 'mcq') {
//             if (userAnswer === correctAnswer) {
//               score += positiveMarking;
//               positiveMarks += positiveMarking;
//               correct += 1;
//             } else {
//               score -= negativeMarking;
//               negativeMarks += negativeMarking;
//               incorrect += 1;
//             }
//           } else if (q.question_type === 'fill-in-the-blanks') {
//             const userAnswerNormalized = userAnswer.toLowerCase().trim().replace(/\s+/g, '');
//             const correctAnswerNormalized = correctAnswer.toLowerCase().trim().replace(/\s+/g, '');
//             if (userAnswerNormalized === correctAnswerNormalized) {
//               score += positiveMarking;
//               positiveMarks += positiveMarking;
//               correct += 1;
//             } else {
//               score -= negativeMarking;
//               negativeMarks += negativeMarking;
//               incorrect += 1;
//             }
//           }
//         } else {
//           score -= negativeMarking;
//           negativeMarks += negativeMarking;
//           incorrect += 1;
//         }
//       } else {
//         unanswered += 1;
//       }
//     });

//     const actualTotalQuestions = questions.length;
//     const maxScore = actualTotalQuestions * positiveMarking;
//     const accuracy = actualTotalQuestions > 0 ? ((correct / actualTotalQuestions) * 100).toFixed(1) : '0';
//     const attemptRate = actualTotalQuestions > 0 ? ((attempted / actualTotalQuestions) * 100).toFixed(1) : '0';
//     const avgTimePerQuestion = actualTotalQuestions > 0 ? (timeTaken / actualTotalQuestions).toFixed(1) : '0';

//     // console.log('Metrics:', { score, correct, incorrect, unanswered, attempted, totalQuestions: actualTotalQuestions });

//     return {
//       score,
//       maxScore,
//       positiveMarks,
//       negativeMarks,
//       correct,
//       incorrect,
//       unanswered,
//       attempted,
//       accuracy: parseFloat(accuracy),
//       attemptRate,
//       avgTimePerQuestion,
//     };
//   };

//   const {
//     score,
//     maxScore,
//     positiveMarks,
//     negativeMarks,
//     correct,
//     incorrect,
//     unanswered,
//     attempted,
//     accuracy,
//     attemptRate,
//     avgTimePerQuestion,
//   } = calculateMetrics();
//   const percentage = maxScore > 0 ? parseFloat(((score / maxScore) * 100).toFixed(1)) : 0;
//   const isPass = percentage >= 60;

//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${minutes}m ${secs}s`;
//   };

//   const toggleQuestion = (questionNo: number) => {
//     setExpandedQuestions((prev) =>
//       prev.includes(questionNo) ? prev.filter((no) => no !== questionNo) : [...prev, questionNo]
//     );
//   };

//   const handleExpandAll = () => {
//     setShowIncorrectOnly(false);
//     setExpandedQuestions(questions.map((q) => q.question_no));
//   };

//   const handleReviewIncorrect = () => {
//     setShowIncorrectOnly((prev) => !prev);
//     if (!showIncorrectOnly) {
//       setExpandedQuestions([]);
//     }
//   };

//   const handleRetryQuiz = () => {
//     localStorage.removeItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`);
//     router.push(`/${exam}/${subject}/${paper}?mode=${mode}`);
//   };

//   const handleShareScore = () => {
//     const text = `I scored ${percentage}% (${correct}/${questions.length}) on ${paperName} in ${formatTime(timeTaken)}.`;
//     navigator.clipboard.writeText(text).then(() => {
//       toast.success('Score copied to clipboard!', { autoClose: 2000 });
//     });
//   };

//   const chartData = [
//     { name: 'Attempted', value: attempted, fill: '#0ea5e9' },
//     { name: 'Correct', value: correct, fill: '#22d3ee' },
//     { name: 'Incorrect', value: incorrect, fill: '#a855f7' },
//     { name: 'Unanswered', value: unanswered, fill: '#6b7280' },
//   ];

//   const fetchPreviousAttempt = useCallback(async () => {
//     if (!exam || !subject || !paper || !mode) return;
//     try {
//       const q = query(
//         collection(db!, 'users', auth!.currentUser!.uid, 'examHistory'),
//         where('exam', '==', exam),
//         where('subject', '==', subject),
//         where('paper', '==', paper),
//         where('mode', '==', mode),
//         orderBy('timestamp', 'desc'),
//         limit(2) // Get last two attempts
//       );
//       const querySnapshot = await getDocs(q);
//       if (querySnapshot.docs.length >= 2) {
//         const prevAttempt = querySnapshot.docs[1].data();
//         const prevAccuracy = ((prevAttempt.correct / prevAttempt.totalQuestions) * 100).toFixed(1);
//         setPreviousAccuracy(parseFloat(prevAccuracy));
//       }
//     } catch (error) {
//       console.error('Error fetching previous attempt:', error);
//     }
//   }, [exam, subject, paper, mode]);

//   const generateTips = async (fallback = false) => {
//     setLoadingTips(true);
//     try {
//       if (!fallback) {
//         const GEMINI_KEY=process.env.NEXT_PUBLIC_GEIMIN_KEY
//         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_KEY}`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             contents: [{
//               parts: [{
//                 text: `Generate 2-3 personalized tips based on these exam stats: Accuracy: ${accuracy}%, Attempted: ${attempted}/${totalQuestions}, Correct: ${correct}, Incorrect: ${incorrect}, Unanswered: ${unanswered}, Avg Time/Q: ${avgTimePerQuestion}s, Time Taken: ${formatTime(timeTaken)}. Keep tips concise and actionable.`
//               }]
//             }]
//           }),
//         });
//         const data = await response.json();
//         const generatedTips = data.candidates[0].content.parts[0].text.split('\n').filter(t => t.trim());
//         setTips(generatedTips);
//       } else {
//         // Rule-based fallback
//         const fallbackTips: string[] = [];
//         if (accuracy < 50) {
//           fallbackTips.push(`Your accuracy is low (${accuracy.toFixed(1)}%)—focus on understanding core concepts. Review the ${incorrect} incorrect answers first.`);
//         } else if (accuracy < 80) {
//           fallbackTips.push(`Solid effort at ${accuracy.toFixed(1)}% accuracy! Work on reducing the ${incorrect} mistakes by practicing similar questions.`);
//         } else {
//           fallbackTips.push(`Great accuracy (${accuracy.toFixed(1)}%)—challenge yourself with timed mocks to maintain it.`);
//         }
//         if (unanswered > totalQuestions * 0.2) {
//           fallbackTips.push(`You left ${unanswered} questions unanswered (${((unanswered / totalQuestions) * 100).toFixed(1)}%). Try guessing educated options next time to boost your score.`);
//         }
//         const expectedTimePerQ = 60;
//         if (parseFloat(avgTimePerQuestion) < expectedTimePerQ * 0.5) {
//           fallbackTips.push(`You were fast (${avgTimePerQuestion}s/Q), but check if rushing led to the ${incorrect} errors.`);
//         } else if (parseFloat(avgTimePerQuestion) > expectedTimePerQ * 1.5) {
//           fallbackTips.push(`Time management tip: At ${avgTimePerQuestion}s/Q, practice speed drills to reduce overall time from ${formatTime(timeTaken)}.`);
//         }
//         setTips(fallbackTips.slice(0, 3));
//       }
//     } catch (error) {
//       console.error('Error generating tips:', error);
//       // Fallback to rule-based if API fails
//       if (!fallback) {
//         generateTips(true);
//       }
//     } finally {
//       setLoadingTips(false);
//     }
//   };

//   useEffect(() => {
//     fetchPreviousAttempt();
//     generateTips();
//   }, [fetchPreviousAttempt]);

//   const handleExportReport = async () => {
//     setIsExporting(true);
//     try {
//       const element = document.getElementById('summary-report');
//       if (!element) return;

//       const canvas = await html2canvas(element, { scale: 2 });
//       const imgData = canvas.toDataURL('image/png');
      
//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'px',
//         format: [canvas.width, canvas.height]
//       });
      
//       pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
//       pdf.save(`${paperName}-summary.pdf`);
//       toast.success('Report exported successfully!');
//     } catch (error) {
//       console.error('Error exporting report:', error);
//       toast.error('Failed to export report');
//     } finally {
//       setIsExporting(false);
//     }
//   };

//   if (!questions || questions.length === 0) {
//     return (
//       <section className="py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//             Submission Summary
//           </h2>
//           <p className="text-destructive">Error: No questions available.</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section id="summary-report" className="py-16 px-4 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
//       <div className="max-w-5xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="mb-12"
//         >
//           <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
//             Submission Summary
//           </h2>
//           <p className="text-muted-foreground text-center max-w-2xl mx-auto">
//             Review your performance and analyze your results. See what you got right and where you can improve.
//           </p>
//         </motion.div>

//         <div className="absolute inset-0 z-0">
//           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
//           <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgNjBIMFYwaDYwdjYweiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-5 z-0" />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.1 }}
//             className="lg:col-span-1 relative"
//           >
//             <Card className="h-full p-6 flex flex-col items-center justify-center overflow-hidden relative">
//               <motion.div
//                 className="absolute bottom-0 right-0 w-64 h-64 rounded-full"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 0.05 }}
//                 transition={{ duration: 1.5, ease: 'easeOut' }}
//               >
//                 <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
//               </motion.div>

//               <h3 className="text-2xl font-bold mb-4 relative">Your Score</h3>
//               <div className="w-32 h-32 mb-6 relative">
//                 <CircularProgressbar
//                   value={percentage}
//                   text={`${percentage}%`}
//                   styles={buildStyles({
//                     textColor: 'hsl(var(--foreground))',
//                     pathColor: isPass ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-1))',
//                     trailColor: 'hsl(var(--muted))',
//                     textSize: '20px',
//                   })}
//                 />
//               </div>
//               <p className="text-3xl font-bold mb-2 relative">
//                 {score} / {maxScore}
//               </p>
//               <Badge
//                 className={cn(
//                   'text-base font-medium mb-4 py-1 px-3',
//                   isPass ? 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20' : 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20'
//                 )}
//               >
//                 {isPass ? 'Pass (≥60%)' : 'Fail (<60%)'}
//               </Badge>
//               <p
//                 className="text-base text-muted-foreground relative"
//                 data-tooltip-id="score-calc"
//                 data-tooltip-content={`Score = ${correct} Correct × ${positiveMarking} − ${incorrect} Incorrect × ${negativeMarking}`}
//               >
//                 +{positiveMarks} (Correct) − {negativeMarks} (Incorrect) = {score} Total
//               </p>
//               <ReactTooltip id="score-calc" place="top" />
//             </Card>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//             className="lg:col-span-2 relative"
//           >
//             <Card className="h-full p-6 overflow-hidden relative">
//               <h3 className="text-2xl font-bold mb-4">Performance Metrics</h3>

//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                 <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
//                   <FiList className="text-2xl mb-2 text-foreground" />
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Total Questions</p>
//                   <p className="text-2xl font-bold">{questions.length}</p>
//                 </div>

//                 <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
//                   <FiCheck className="text-2xl mb-2 text-emerald-500" />
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Accuracy</p>
//                   <p className="text-2xl font-bold">{accuracy}%</p>
//                 </div>

//                 <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
//                   <FiClock className="text-2xl mb-2 text-foreground" />
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Time Taken</p>
//                   <p className="text-2xl font-bold">{formatTime(timeTaken)}</p>
//                 </div>

//                 <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
//                   <FiClock className="text-2xl mb-2 text-foreground" />
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Avg Time/Q</p>
//                   <p className="text-2xl font-bold">{avgTimePerQuestion}s</p>
//                 </div>
//               </div>

//               <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
//                 <div className="flex flex-col items-center p-3 bg-blue-500/10 rounded-lg">
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Attempted</p>
//                   <p className="text-3xl font-bold text-blue-500">{attempted}</p>
//                   <p className="text-xs text-muted-foreground mt-1">{attemptRate}% of total</p>
//                 </div>

//                 <div className="flex flex-col items-center p-3 bg-emerald-500/10 rounded-lg">
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Correct</p>
//                   <p className="text-3xl font-bold text-emerald-500">{correct}</p>
//                 </div>

//                 <div className="flex flex-col items-center p-3 bg-rose-500/10 rounded-lg">
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Incorrect</p>
//                   <p className="text-3xl font-bold text-rose-500">{incorrect}</p>
//                 </div>

//                 <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
//                   <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Unanswered</p>
//                   <p className="text-3xl font-bold text-muted-foreground">{unanswered}</p>
//                 </div>
//               </div>

//               <motion.div
//                 className="absolute bottom-0 left-0 w-64 h-64 rounded-full"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 0.05 }}
//                 transition={{ duration: 1.5, ease: 'easeOut' }}
//               >
//                 <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
//               </motion.div>
//             </Card>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.3 }}
//             className="lg:col-span-2 relative"
//           >
//             <Card className="h-full p-6 overflow-hidden relative">
//               <h3 className="text-2xl font-bold mb-6">Performance Overview</h3>
//               <div className="w-full h-[200px] mx-auto">
//                 <BarChart
//                   width={500}
//                   height={200}
//                   data={chartData}
//                   layout="vertical"
//                   margin={{ left: 75, right: 30, top: 10, bottom: 10 }}
//                 >
//                   <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                   <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
//                   <YAxis
//                     type="category"
//                     dataKey="name"
//                     tick={{ fontSize: 14 }}
//                     stroke="hsl(var(--muted-foreground))"
//                     width={70}
//                   />
//                   <Tooltip
//                     contentStyle={{
//                       backgroundColor: 'hsl(var(--card))',
//                       borderColor: 'hsl(var(--border))',
//                       color: 'hsl(var(--foreground))',
//                     }}
//                   />
//                   <Bar dataKey="value" radius={[0, 4, 4, 0]} />
//                 </BarChart>
//               </div>

//               <motion.div
//                 className="absolute top-1/2 right-0 w-32 h-32 rounded-full"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 0.05 }}
//                 transition={{ duration: 1.5, ease: 'easeOut' }}
//               >
//                 <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
//               </motion.div>
//             </Card>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//             className="lg:col-span-1 relative"
//           >
//             <Card className="h-full p-6 overflow-hidden relative">
//               <h3 className="text-2xl font-bold mb-6">Actions</h3>
//               <div className="space-y-4">
//                 <Button onClick={handleRetryQuiz} className="w-full justify-between group">
//                   Retry Quiz
//                   <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
//                 </Button>

//                 <Button
//                   onClick={() => router.push('/dashboard')}
//                   className="w-full justify-between group"
//                   variant="outline"
//                 >
//                   Dashboard
//                   <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
//                 </Button>

//                 <Button
//                   onClick={handleShareScore}
//                   className="w-full justify-between group"
//                   variant="secondary"
//                 >
//                   <span className="flex items-center">
//                     <FiCopy className="mr-2" />
//                     Share Score
//                   </span>
//                   <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
//                 </Button>

//                 <Button
//                   onClick={handleExportReport}
//                   disabled={isExporting}
//                   className="w-full justify-between group"
//                   variant="secondary"
//                 >
//                   <span className="flex items-center">
//                     <FiCopy className="mr-2" />
//                     {isExporting ? 'Exporting...' : 'Export Report'}
//                   </span>
//                   <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
//                 </Button>
//               </div>

//               <motion.div
//                 className="absolute bottom-0 right-0 w-32 h-32 rounded-full"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 0.05 }}
//                 transition={{ duration: 1.5, ease: 'easeOut' }}
//               >
//                 <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
//               </motion.div>
//             </Card>
//           </motion.div>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.5 }}
//           className="relative mb-12"
//         >
//           <Card className="p-6 overflow-hidden relative">
//             <h3 className="text-2xl font-bold mb-4">Progress Comparison</h3>
//             {previousAccuracy !== null ? (
//               <p className="text-lg">
//                 Accuracy vs. Last Attempt: {accuracy}% {accuracy > previousAccuracy ? '(up' : '(down'} {Math.abs(accuracy - previousAccuracy).toFixed(1)}%)
//               </p>
//             ) : (
//               <p className="text-lg text-muted-foreground">No previous attempt found for comparison.</p>
//             )}
//           </Card>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.5 }}
//           className="relative mb-12"
//         >
//           <Card className="p-6 overflow-hidden relative">
//             <h3 className="text-2xl font-bold mb-4">Personalized Tips</h3>
//             {loadingTips ? (
//               <p className="text-muted-foreground">Generating tips...</p>
//             ) : tips.length > 0 ? (
//               <ul className="list-disc pl-5 space-y-2">
//                 {tips.map((tip, idx) => (
//                   <li key={idx}>{tip}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-muted-foreground">No tips available.</p>
//             )}
//           </Card>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.5 }}
//           className="relative"
//         >
//           <Card className="p-6 overflow-hidden relative">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-2xl font-bold">Question Review</h3>
//               <div className="flex gap-3">
//                 <Button
//                   onClick={handleReviewIncorrect}
//                   variant={showIncorrectOnly ? 'secondary' : 'outline'}
//                   className="text-sm"
//                   size="sm"
//                 >
//                   {showIncorrectOnly ? 'Show All' : `Incorrect Only (${incorrect})`}
//                 </Button>
//                 <Button onClick={handleExpandAll} variant="outline" className="text-sm" size="sm">
//                   Expand All
//                 </Button>
//               </div>
//             </div>

//             <Collapsible open={true}>
//               <div className="grid grid-cols-1 gap-4">
//                 <AnimatePresence>
//                   {questions
//                     .filter((q) => {
//                       if (!showIncorrectOnly) return true;
//                       const userAnswer = userAnswers[q.question_no];
//                       const correctAnswer = decryptAnswer(q.question_no);
//                       return userAnswer && correctAnswer && userAnswer !== correctAnswer;
//                     })
//                     .map((q, index) => {
//                       const correctAnswerKey = decryptAnswer(q.question_no);
//                       const userAnswerKey = userAnswers[q.question_no];
//                       const correctAnswerValue = correctAnswerKey && q.options ? q.options[correctAnswerKey] : correctAnswerKey || 'Answer not available';
//                       const userAnswerValue = userAnswerKey && q.options ? q.options[userAnswerKey] : userAnswerKey || 'Not answered';
//                       const isCorrect =
//                         userAnswerKey &&
//                         correctAnswerKey &&
//                         (q.question_type === 'mcq'
//                           ? userAnswerKey === correctAnswerKey
//                           : userAnswerKey.toLowerCase().trim().replace(/\s+/g, '') ===
//                             correctAnswerKey.toLowerCase().trim().replace(/\s+/g, ''));
//                       const isFlagged = flaggedQuestions.includes(q.question_no);

//                       return (
//                         <motion.div
//                           key={q.question_no}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ duration: 0.3, delay: index * 0.05 }}
//                         >
//                           <Card
//                             className={cn(
//                               'border transition-colors',
//                               isCorrect ? 'hover:border-emerald-500/50' : 'hover:border-rose-500/50',
//                               expandedQuestions.includes(q.question_no)
//                                 ? isCorrect
//                                   ? 'border-emerald-500/50'
//                                   : 'border-rose-500/50'
//                                 : 'border-border'
//                             )}
//                           >
//                             <Collapsible
//                               open={expandedQuestions.includes(q.question_no)}
//                               onOpenChange={() => toggleQuestion(q.question_no)}
//                             >
//                               <CollapsibleTrigger asChild>
//                                 <div className="p-4 flex items-center justify-between cursor-pointer">
//                                   <div className="flex items-center gap-3">
//                                     <div
//                                       className={cn(
//                                         'flex items-center justify-center w-8 h-8 rounded-full',
//                                         isCorrect
//                                           ? 'bg-emerald-500/10 text-emerald-500'
//                                           : userAnswerKey
//                                           ? 'bg-rose-500/10 text-rose-500'
//                                           : 'bg-muted text-muted-foreground'
//                                       )}
//                                     >
//                                       {isCorrect ? <FiCheck /> : userAnswerKey ? <FiX /> : <FiCircle />}
//                                     </div>
//                                     <div>
//                                       <p className="font-medium text-foreground">
//                                         Question {q.question_no}
//                                         {isFlagged && (
//                                           <Badge className="ml-2 bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
//                                             Flagged
//                                           </Badge>
//                                         )}
//                                       </p>
//                                       <p className="text-sm text-muted-foreground line-clamp-1">
//                                         {q.question.substring(0, 60)}...
//                                       </p>
//                                     </div>
//                                   </div>
//                                   <div className="flex items-center">
//                                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
//                                       {expandedQuestions.includes(q.question_no) ? (
//                                         <FiChevronUp className="text-lg" />
//                                       ) : (
//                                         <FiChevronDown className="text-lg" />
//                                       )}
//                                     </Button>
//                                   </div>
//                                 </div>
//                               </CollapsibleTrigger>
//                               <CollapsibleContent>
//                                 <div className="px-4 pb-4 border-t border-border pt-4">
//                                   <p className="mb-4 text-foreground">{q.question}</p>

//                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                                     <div
//                                       className={cn(
//                                         'p-3 rounded-lg',
//                                         !userAnswerKey
//                                           ? 'bg-muted/50'
//                                           : isCorrect
//                                           ? 'bg-emerald-500/10'
//                                           : 'bg-rose-500/10'
//                                       )}
//                                     >
//                                       <p className="text-sm text-muted-foreground mb-1">Your Answer</p>
//                                       <p className="font-medium">{userAnswerValue}</p>
//                                     </div>

//                                     <div className="p-3 rounded-lg bg-emerald-500/10">
//                                       <p className="text-sm text-muted-foreground mb-1">Correct Answer</p>
//                                       <p className="font-medium">{correctAnswerValue}</p>
//                                     </div>
//                                   </div>

//                                   <div className="flex justify-end">
//                                     <a
//                                       href={`https://www.google.com/search?q=explain ${encodeURIComponent(q.question)}`}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="text-primary underline-offset-4 hover:underline"
//                                     >
//                                       Explain Answer
//                                     </a>
//                                   </div>
//                                 </div>
//                               </CollapsibleContent>
//                             </Collapsible>
//                           </Card>
//                         </motion.div>
//                       );
//                     })}
//                 </AnimatePresence>
//               </div>
//             </Collapsible>

//             <motion.div
//               className="absolute bottom-0 left-0 w-64 h-64 rounded-full"
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 0.05 }}
//               transition={{ duration: 1.5, ease: 'easeOut' }}
//             >
//               <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
//             </motion.div>
//           </Card>
//         </motion.div>
//       </div>
//     </section>
//   );
// };

// export default SummaryScreen;





























































// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { Button } from '@/components/ui/button';
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
// import { Badge } from '@/components/ui/badge';
// import { Card } from '@/components/ui/card';
// import { FiCheck, FiX, FiShare2, FiClock, FiList, FiChevronDown, FiChevronUp, FiCircle, FiArrowRight, FiDownload } from 'react-icons/fi';
// import { motion, AnimatePresence } from 'framer-motion';
// import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
// import { Tooltip as ReactTooltip } from 'react-tooltip';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/router';
// import { cn } from '@/lib/utils';
// import { collection, query, getDocs, orderBy, limit, deleteDoc, addDoc, serverTimestamp,where } from 'firebase/firestore';
// import { db, auth } from '../../lib/firebase'; // Adjust path as needed and ensure auth is imported
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import { Loader2 } from 'lucide-react';
// import {
//   FacebookShareButton,
//   TwitterShareButton,
//   LinkedinShareButton,
//   FacebookIcon,
//   XIcon,
//   LinkedinIcon,
// } from 'react-share';

// interface SummaryScreenProps {
//   questions: Array<{
//     question_no: number;
//     question: string;
//     question_type: string;
//     options?: Record<string, string>;
//   }>;
//   userAnswers: Record<number, string>;
//   flaggedQuestions: number[];
//   totalQuestions: number;
//   positiveMarking: number;
//   negativeMarking: number;
//   timeTaken: number;
//   paperName: string;
//   decryptAnswer: (questionNo: number) => string | null;
// }

// const SummaryScreen: React.FC<SummaryScreenProps> = ({
//   questions,
//   userAnswers,
//   flaggedQuestions,
//   totalQuestions,
//   positiveMarking,
//   negativeMarking,
//   timeTaken,
//   paperName,
//   decryptAnswer,
// }) => {
//   const router = useRouter();
//   const { exam, subject, paper, mode } = router.query;
//   const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
//   const [showIncorrectOnly, setShowIncorrectOnly] = useState(false);
//   const [tips, setTips] = useState<string[]>([]);
//   const [loadingTips, setLoadingTips] = useState(true);
//   const [previousData, setPreviousData] = useState<any[] | null>(null);
//   const [isExporting, setIsExporting] = useState(false);
//   const [showShareModal, setShowShareModal] = useState(false);

//   useEffect(() => {
//     // console.log('Total Questions:', questions.length);
//     // console.log('User Answers:', userAnswers);
//     questions.forEach((q) => {
//       const userAnswer = userAnswers[q.question_no];
//       const correctAnswer = decryptAnswer(q.question_no);
//       // console.log(`Question ${q.question_no}: User Answer = ${userAnswer || 'Not answered'}, Correct Answer = ${correctAnswer || 'Failed to decrypt'}`);
//     });
//   }, [questions, userAnswers, decryptAnswer]);

//   const calculateMetrics = () => {
//     let score = 0;
//     let correct = 0;
//     let incorrect = 0;
//     let unanswered = 0;
//     let positiveMarks = 0;
//     let negativeMarks = 0;
//     let attempted = 0;

//     questions.forEach((q) => {
//       const userAnswer = userAnswers[q.question_no];
//       const correctAnswer = decryptAnswer(q.question_no);

//       if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
//         attempted += 1;
//         if (correctAnswer) {
//           if (q.question_type === 'mcq') {
//             if (userAnswer === correctAnswer) {
//               score += positiveMarking;
//               positiveMarks += positiveMarking;
//               correct += 1;
//             } else {
//               score -= negativeMarking;
//               negativeMarks += negativeMarking;
//               incorrect += 1;
//             }
//           } else if (q.question_type === 'fill-in-the-blanks') {
//             const userAnswerNormalized = userAnswer.toLowerCase().trim().replace(/\s+/g, '');
//             const correctAnswerNormalized = correctAnswer.toLowerCase().trim().replace(/\s+/g, '');
//             if (userAnswerNormalized === correctAnswerNormalized) {
//               score += positiveMarking;
//               positiveMarks += positiveMarking;
//               correct += 1;
//             } else {
//               score -= negativeMarking;
//               negativeMarks += negativeMarking;
//               incorrect += 1;
//             }
//           }
//         } else {
//           score -= negativeMarking;
//           negativeMarks += negativeMarking;
//           incorrect += 1;
//         }
//       } else {
//         unanswered += 1;
//       }
//     });

//     const actualTotalQuestions = questions.length;
//     const maxScore = actualTotalQuestions * positiveMarking;
//     const accuracy = actualTotalQuestions > 0 ? ((correct / actualTotalQuestions) * 100).toFixed(1) : '0';
//     const attemptRate = actualTotalQuestions > 0 ? ((attempted / actualTotalQuestions) * 100).toFixed(1) : '0';
//     const avgTimePerQuestion = actualTotalQuestions > 0 ? (timeTaken / actualTotalQuestions).toFixed(1) : '0';

//     // console.log('Metrics:', { score, correct, incorrect, unanswered, attempted, totalQuestions: actualTotalQuestions });

//     return {
//       score,
//       maxScore,
//       positiveMarks,
//       negativeMarks,
//       correct,
//       incorrect,
//       unanswered,
//       attempted,
//       accuracy: parseFloat(accuracy),
//       attemptRate,
//       avgTimePerQuestion,
//     };
//   };

//   const {
//     score,
//     maxScore,
//     positiveMarks,
//     negativeMarks,
//     correct,
//     incorrect,
//     unanswered,
//     attempted,
//     accuracy,
//     attemptRate,
//     avgTimePerQuestion,
//   } = calculateMetrics();
//   const percentage = maxScore > 0 ? parseFloat(((score / maxScore) * 100).toFixed(1)) : 0;
//   const isPass = percentage >= 60;

//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${minutes}m ${secs}s`;
//   };

//   const toggleQuestion = (questionNo: number) => {
//     setExpandedQuestions((prev) =>
//       prev.includes(questionNo) ? prev.filter((no) => no !== questionNo) : [...prev, questionNo]
//     );
//   };

//   const handleExpandAll = () => {
//     setShowIncorrectOnly(false);
//     setExpandedQuestions(questions.map((q) => q.question_no));
//   };

//   const handleReviewIncorrect = () => {
//     setShowIncorrectOnly((prev) => !prev);
//     if (!showIncorrectOnly) {
//       setExpandedQuestions([]);
//     }
//   };

//   const handleRetryQuiz = () => {
//     // Clear localStorage keys with proper string interpolation
//     if (mode && exam && subject && paper) {
//       const keyPrefix = `${mode}-${exam}-${subject}-${paper}`;
//       console.log('Clearing localStorage for prefix:', keyPrefix);
//       localStorage.removeItem(`userAnswers-${keyPrefix}`);
//       localStorage.removeItem(`flaggedQuestions-${keyPrefix}`);
//       localStorage.removeItem(`startTime-${keyPrefix}`);
//       localStorage.removeItem(`currentQuestionIndex-${keyPrefix}`);
//       // Redirect with /pyqs prefix
//       const retryPath = `/pyqs/${exam}/${subject}/${paper}`;
//       console.log('Retrying to path:', retryPath);
//       router.push(retryPath);
//     } else {
//       console.error('Missing query parameters for retry:', { mode, exam, subject, paper });
//        const retryPath = `/pyqs/${exam}/${subject}/${paper}`;
//       console.log('Retrying to path:', retryPath);
//       toast.error('Unable to retry quiz due to missing parameters.');
//     }
//   };

//   const handleShareScore = () => {
//     setShowShareModal(true);
//   };

//   const chartData = [
//     { name: 'Attempted', value: attempted, fill: '#0ea5e9' },
//     { name: 'Correct', value: correct, fill: '#22d3ee' },
//     { name: 'Incorrect', value: incorrect, fill: '#a855f7' },
//     { name: 'Unanswered', value: unanswered, fill: '#6b7280' },
//   ];

//   const cleanupGlobalHistory = useCallback(async () => {
//     try {
//       const q = query(
//         collection(db!, 'users', auth!.currentUser!.uid, 'examHistory'),
//         orderBy('timestamp', 'desc'),
//         limit(11)
//       );
//       const querySnapshot = await getDocs(q);
//       const docs = querySnapshot.docs;
//       console.log('Fetched global history count before cleanup:', docs.length);

//       if (docs.length > 10) {
//         const oldestDocs = docs.slice(10);
//         console.log('Deleting oldest docs:', oldestDocs.length);
//         for (const doc of oldestDocs) {
//           await deleteDoc(doc.ref);
//         }
//       } else {
//         console.log('No cleanup needed, history within limit.');
//       }
//     } catch (error) {
//       console.error('Error cleaning global history:', error);
//     }
//   }, []);

//   const fetchPreviousAttempt = useCallback(async () => {
//     if (!exam || !subject || !paper || !mode) return;
//     try {
//       const q = query(
//         collection(db!, 'users', auth!.currentUser!.uid, 'examHistory'),
//         where('exam', '==', exam),
//         where('subject', '==', subject),
//         where('paper', '==', paper),
//         where('mode', '==', mode),
//         orderBy('timestamp', 'desc'),
//         limit(4) // Get current + last 3
//       );
//       const querySnapshot = await getDocs(q);
//       console.log('Fetched previous attempts count:', querySnapshot.docs.length);
//       if (querySnapshot.docs.length >= 2) {
//         const prevAttempts = querySnapshot.docs.slice(1, 4).map(doc => doc.data());
//         console.log('Previous data:', prevAttempts);
//         setPreviousData(prevAttempts);
//       } else {
//         console.log('No previous attempts found.');
//       }
//     } catch (error) {
//       console.error('Error fetching previous attempt:', error);
//     }
//   }, [exam, subject, paper, mode]);

//   const generateTips = async (fallback = false) => {
//     setLoadingTips(true);
//     try {
//       if (!fallback) {
//         const GEMINI_KEY = process.env.NEXT_PUBLIC_GEIMIN_KEY;
//         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_KEY}`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             contents: [{
//               parts: [{
//                 text: `As an exam preparation coach, generate 3 personalized, concise, and actionable tips to help the user improve, based on these detailed stats from their recent attempt: Score: ${score}/${maxScore} (${percentage.toFixed(1)}%), Accuracy: ${accuracy}% (based on attempted questions), Attempted: ${attempted}/${totalQuestions} (${attemptRate}%), Correct: ${correct}, Incorrect: ${incorrect}, Unanswered: ${unanswered}, Avg Time per Question: ${avgTimePerQuestion}s, Total Time Taken: ${formatTime(timeTaken)}, Positive Marking per Correct: +${positiveMarking}, Negative Marking per Incorrect: -${negativeMarking}. Focus on addressing key weaknesses like low accuracy, high unanswered, negative marking impacts, or time management issues, and suggest specific strategies for better performance in future attempts. Make tips encouraging and practical.`
//               }]
//             }]
//           }),
//         });
//         const data = await response.json();
//         const generatedTips = data.candidates[0].content.parts[0].text.split('\n').filter(t => t.trim());
//         setTips(generatedTips);
//       } else {
//         // Rule-based fallback
//         const fallbackTips: string[] = [];
//         if (accuracy < 50) {
//           fallbackTips.push(`Your accuracy is low (${accuracy.toFixed(1)}%)—focus on understanding core concepts. Review the ${incorrect} incorrect answers first.`);
//         } else if (accuracy < 80) {
//           fallbackTips.push(`Solid effort at ${accuracy.toFixed(1)}% accuracy! Work on reducing the ${incorrect} mistakes by practicing similar questions.`);
//         } else {
//           fallbackTips.push(`Great accuracy (${accuracy.toFixed(1)}%)—challenge yourself with timed mocks to maintain it.`);
//         }
//         if (unanswered > totalQuestions * 0.2) {
//           fallbackTips.push(`You left ${unanswered} questions unanswered (${((unanswered / totalQuestions) * 100).toFixed(1)}%). Try guessing educated options next time to boost your score.`);
//         }
//         const expectedTimePerQ = 60;
//         if (parseFloat(avgTimePerQuestion) < expectedTimePerQ * 0.5) {
//           fallbackTips.push(`You were fast (${avgTimePerQuestion}s/Q), but check if rushing led to the ${incorrect} errors.`);
//         } else if (parseFloat(avgTimePerQuestion) > expectedTimePerQ * 1.5) {
//           fallbackTips.push(`Time management tip: At ${avgTimePerQuestion}s/Q, practice speed drills to reduce overall time from ${formatTime(timeTaken)}.`);
//         }
//         fallbackTips.push('Practice daily to build consistency and improve overall performance.');
//         fallbackTips.push('Review weak areas identified in this attempt and focus on them in your next study session.');
//         fallbackTips.push('Use active recall techniques to strengthen memory retention.');
//         fallbackTips.push('Set specific goals for each practice session to track progress effectively.');
//         setTips(fallbackTips.slice(0, 5));
//       }
//     } catch (error) {
//       console.error('Error generating tips:', error);
//       // Fallback to rule-based if API fails
//       if (!fallback) {
//         generateTips(true);
//       }
//     } finally {
//       setLoadingTips(false);
//     }
//   };

//   useEffect(() => {
//     const saveHistory = async () => {
//       if (!exam || !subject || !paper || !mode) {
//         console.error('Missing parameters for saving history:', { exam, subject, paper, mode });
//         return;
//       }
//       try {
//         console.log('Attempting to save history with data:', { exam, mode, paper, score, subject, totalQuestions: questions.length, correct, avgTimePerQuestion });
//         const historyRef = collection(db!, 'users', auth!.currentUser!.uid, 'examHistory');
//         const docRef = await addDoc(historyRef, {
//           exam,
//           mode,
//           paper,
//           score,
//           subject,
//           timestamp: serverTimestamp(),
//           totalQuestions: questions.length,
//           correct,
//           avgTimePerQuestion
//         });
//         console.log('Saved new history document with ID:', docRef.id);
//       } catch (error) {
//         console.error('Error saving history:', error);
//       }
//     };

//     saveHistory();
//     cleanupGlobalHistory();
//     fetchPreviousAttempt();
//     generateTips();
//   }, [exam, subject, paper, mode, score, questions.length, correct, avgTimePerQuestion, cleanupGlobalHistory, fetchPreviousAttempt]);

// const handleExportReport = async () => {
//     const toastId = toast('Preparing your comprehensive report...', { autoClose: false, type: 'info' });
//     setIsExporting(true);

//     try {
//       toast.update(toastId, { render: 'Generating cover page...' });
//       // Create a temporary container for the report
//       const reportContainer = document.createElement('div');
//       reportContainer.id = 'export-report-container';
//       reportContainer.style.position = 'fixed';
//       reportContainer.style.top = '-10000px';
//       reportContainer.style.left = '-10000px';
//       reportContainer.style.width = '210mm'; // A4 width
//       reportContainer.style.backgroundColor = '#1a1a1a';
//       reportContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
//       document.body.appendChild(reportContainer);

//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'mm',
//         format: 'a4'
//       });

//       // Common watermark
//       const watermark = `
//         <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; opacity: 0.1; color: #666666; pointer-events: none; user-select: none;">
//           examtards
//         </div>
//       `;

//       // Page 1: Cover Page
//       reportContainer.innerHTML = `
//         <div style="width: 210mm; height: 297mm; padding: 40mm; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%); color: #ffffff; text-align: center; position: relative; overflow: hidden;">
//           <!-- Background Pattern -->
//           <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.1; background-image: radial-gradient(circle at 20% 50%, #ffffff 2px, transparent 2px), radial-gradient(circle at 80% 50%, #ffffff 2px, transparent 2px); background-size: 50px 50px;"></div>
          
//           <!-- Main Content -->
//           <div style="position: relative; z-index: 1;">
//             <div style="width: 120px; height: 120px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.2);">
//               <div style="font-size: 48px; font-weight: 800;">📊</div>
//             </div>
            
//             <h1 style="font-size: 48px; font-weight: 800; margin: 0 0 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
//               EXAMTARDS
//             </h1>
            
//             <div style="height: 4px; width: 100px; background: rgba(255,255,255,0.5); margin: 0 auto 40px; border-radius: 2px;"></div>
            
//             <h2 style="font-size: 32px; font-weight: 600; margin: 0 0 60px 0; opacity: 0.95;">
//               ${paperName}
//             </h2>
            
//             <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
//               <h3 style="font-size: 24px; font-weight: 600; margin: 0 0 20px 0;">Performance Summary</h3>
//               <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
//                 <span style="font-size: 18px; opacity: 0.9;">Score:</span>
//                 <span style="font-size: 24px; font-weight: 700;">${score}/${maxScore} (${percentage}%)</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
//                 <span style="font-size: 18px; opacity: 0.9;">Status:</span>
//                 <span style="font-size: 20px; font-weight: 600; color: ${isPass ? '#4ade80' : '#f87171'};">${isPass ? 'PASS' : 'FAIL'}</span>
//               </div>
//               <div style="display: flex; justify-content: space-between; align-items: center;">
//                 <span style="font-size: 18px; opacity: 0.9;">Accuracy:</span>
//                 <span style="font-size: 20px; font-weight: 600;">${accuracy}%</span>
//               </div>
//             </div>
            
//             <div style="margin-top: 60px; font-size: 16px; opacity: 0.8;">
//               Generated on ${new Date().toLocaleDateString('en-US', { 
//                 year: 'numeric', 
//                 month: 'long', 
//                 day: 'numeric',
//                 hour: '2-digit',
//                 minute: '2-digit'
//               })}
//             </div>
//           </div>
//           ${watermark}
//         </div>
//       `;

//       let canvas = await html2canvas(reportContainer, { 
//         scale: 1, 
//         useCORS: true,
//         backgroundColor: '#1a1a1a'
//       });
//       let imgData = canvas.toDataURL('image/jpeg', 0.5);
//       pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

//       toast.update(toastId, { render: 'Generating performance overview...' });

//       // Page 2: Performance Overview
//       reportContainer.innerHTML = `
//         <div style="width: 210mm; height: 297mm; padding: 25mm; background: #1a1a1a; color: #f3f4f6; position: relative;">
//           <!-- Header -->
//           <div style="border-bottom: 3px solid #818cf8; padding-bottom: 15px; margin-bottom: 30px;">
//             <h1 style="font-size: 28px; font-weight: 700; margin: 0; color: #818cf8;">Performance Overview</h1>
//             <p style="font-size: 14px; color: #9ca3af; margin: 5px 0 0 0;">Detailed analysis of your exam performance</p>
//           </div>

//           <!-- Key Metrics Grid -->
//           <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 40px;">
//             <div style="background: linear-gradient(135deg, #27272a 0%, #3f3f46 100%); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #3f3f46;">
//               <div style="font-size: 36px; font-weight: 800; color: #f3f4f6; margin-bottom: 5px;">${questions.length}</div>
//               <div style="font-size: 14px; color: #9ca3af; font-weight: 500;">Total Questions</div>
//             </div>
//             <div style="background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #065f46;">
//               <div style="font-size: 36px; font-weight: 800; color: #ecfdf5; margin-bottom: 5px;">${accuracy}%</div>
//               <div style="font-size: 14px; color: #ecfdf5; font-weight: 500;">Accuracy</div>
//             </div>
//             <div style="background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #1d4ed8;">
//               <div style="font-size: 36px; font-weight: 800; color: #eff6ff; margin-bottom: 5px;">${formatTime(timeTaken)}</div>
//               <div style="font-size: 14px; color: #eff6ff; font-weight: 500;">Time Taken</div>
//             </div>
//           </div>

//           <!-- Performance Breakdown -->
//           <div style="background: #27272a; padding: 25px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #3f3f46;">
//             <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 20px 0; color: #d1d5db;">Performance Breakdown</h2>
//             <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
//               <div>
//                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #3f3f46;">
//                   <span style="font-weight: 500; color: #d1d5db;">Attempted Questions</span>
//                   <span style="font-weight: 600; color: #f3f4f6;">${attempted} (${attemptRate}%)</span>
//                 </div>
//                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #3f3f46;">
//                   <span style="font-weight: 500; color: #d1d5db;">Correct Answers</span>
//                   <span style="font-weight: 600; color: #4ade80;">${correct}</span>
//                 </div>
//                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #3f3f46;">
//                   <span style="font-weight: 500; color: #d1d5db;">Incorrect Answers</span>
//                   <span style="font-weight: 600; color: #f87171;">${incorrect}</span>
//                 </div>
//                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
//                   <span style="font-weight: 500; color: #d1d5db;">Unanswered</span>
//                   <span style="font-weight: 600; color: #9ca3af;">${unanswered}</span>
//                 </div>
//               </div>
//               <div>
//                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #3f3f46;">
//                   <span style="font-weight: 500; color: #d1d5db;">Positive Marks</span>
//                   <span style="font-weight: 600; color: #4ade80;">+${positiveMarks}</span>
//                 </div>
//                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #3f3f46;">
//                   <span style="font-weight: 500; color: #d1d5db;">Negative Marks</span>
//                   <span style="font-weight: 600; color: #f87171;">-${negativeMarks}</span>
//                 </div>
//                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #3f3f46;">
//                   <span style="font-weight: 500; color: #d1d5db;">Average Time/Question</span>
//                   <span style="font-weight: 600; color: #f3f4f6;">${avgTimePerQuestion}s</span>
//                 </div>
//                 <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
//                   <span style="font-weight: 500; color: #d1d5db;">Final Score</span>
//                   <span style="font-weight: 700; color: #f3f4f6; font-size: 18px;">${score}/${maxScore}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <!-- Score Visualization -->
//           <div style="background: #27272a; padding: 25px; border-radius: 16px; border: 1px solid #3f3f46; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">
//             <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 20px 0; color: #d1d5db;">Score Analysis</h2>
//             <div style="display: flex; align-items: center; gap: 30px;">
//               <div style="flex: 1;">
//                 <div style="background: #3f3f46; height: 20px; border-radius: 10px; overflow: hidden; margin-bottom: 10px;">
//                   <div style="background: linear-gradient(90deg, ${isPass ? '#22c55e' : '#ef4444'} 0%, ${isPass ? '#16a34a' : '#dc2626'} 100%); height: 100%; width: ${Math.min(percentage, 100)}%; border-radius: 10px; transition: width 0.3s ease;"></div>
//                 </div>
//                 <div style="display: flex; justify-content: space-between; font-size: 14px; color: #9ca3af;">
//                   <span>0%</span>
//                   <span style="font-weight: 600; color: #f3f4f6;">${percentage}%</span>
//                   <span>100%</span>
//                 </div>
//               </div>
//               <div style="text-align: center;">
//                 <div style="font-size: 48px; font-weight: 800; color: ${isPass ? '#22c55e' : '#ef4444'}; margin-bottom: 5px;">${percentage}%</div>
//                 <div style="font-size: 16px; font-weight: 600; color: ${isPass ? '#22c55e' : '#ef4444'}; padding: 8px 16px; background: ${isPass ? '#052e16' : '#450a0a'}; border-radius: 20px; border: 1px solid ${isPass ? '#14532d' : '#7f1d1d'};">
//                   ${isPass ? 'PASS' : 'FAIL'}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <!-- Footer -->
//           <div style="position: absolute; bottom: 20mm; left: 25mm; right: 25mm; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #3f3f46; padding-top: 15px;">
//             <p style="margin: 0;">Page 2 of ${Math.ceil(questions.length / 5) + 3} • Generated by Examtards • ${new Date().toLocaleDateString()}</p>
//           </div>
//           ${watermark}
//         </div>
//       `;

//       pdf.addPage();
//       canvas = await html2canvas(reportContainer, { 
//         scale: 1, 
//         useCORS: true,
//         backgroundColor: '#1a1a1a'
//       });
//       imgData = canvas.toDataURL('image/jpeg', 0.5);
//       pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

//       toast.update(toastId, { render: 'Generating tips & recommendations...' });

//       // Page 3: Tips & Recommendations
//       reportContainer.innerHTML = `
//         <div style="width: 210mm; height: 297mm; padding: 25mm; background: #1a1a1a; color: #f3f4f6; position: relative;">
//           <!-- Header -->
//           <div style="border-bottom: 3px solid #a78bfa; padding-bottom: 15px; margin-bottom: 30px;">
//             <h1 style="font-size: 28px; font-weight: 700; margin: 0; color: #a78bfa;">Tips & Recommendations</h1>
//             <p style="font-size: 14px; color: #9ca3af; margin: 5px 0 0 0;">Personalized insights to improve your performance</p>
//           </div>

//           <!-- Progress Comparison -->
//           <div style="background: linear-gradient(135deg, #422006 0%, #713f12 100%); padding: 25px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #854d0e;">
//             <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 15px 0; color: #fde68a;">Progress Comparison</h2>
//             ${previousData ? `
//               <div style="display: flex; flex-direction: column; gap: 10px;">
//                 <div style="font-size: 16px; color: #fde68a;">Current: Score ${score}, Correct ${correct}, Avg Time/Q ${avgTimePerQuestion}s</div>
//                 ${previousData.map((d, i) => `
//                   <div style="font-size: 16px; color: #fde68a;">${i + 1} attempt ago: Score ${d.score} ${score > d.score ? '(+' + (score - d.score) + ')' : '(-' + (d.score - score) + ')'}, Correct ${d.correct} ${correct > d.correct ? '(+' + (correct - d.correct) + ')' : '(-' + (d.correct - correct) + ')'}, Avg Time/Q ${d.avgTimePerQuestion}s ${parseFloat(avgTimePerQuestion) < parseFloat(d.avgTimePerQuestion) ? '(Faster)' : '(Slower)'}</div>
//                 `).join('')}
//               </div>
//             ` : `
//               <p style="font-size: 16px; color: #fde68a; margin: 0;">This is your first attempt. Keep practicing to track your progress!</p>
//             `}
//           </div>

//           <!-- Personalized Tips -->
//           <div style="background: #27272a; padding: 25px; border-radius: 16px; border: 1px solid #3f3f46; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">
//             <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 20px 0; color: #d1d5db;">Personalized Tips</h2>
//             ${loadingTips ? `
//               <div style="display: flex; align-items: center; justify-content: center; padding: 40px;">
//                 <div style="font-size: 16px; color: #9ca3af;">Generating personalized tips...</div>
//               </div>
//             ` : allTips.length > 0 ? `
//               <div style="display: grid; gap: 15px;">
//                 ${allTips.slice(0, 5).map((tip, idx) => `
//                   <div style="display: flex; align-items: flex-start; gap: 15px; padding: 20px; background: #3f3f46; border-radius: 12px; border-left: 4px solid #a78bfa;">
//                     <div style="background: #a78bfa; color: #1a1a1a; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">
//                       ${idx + 1}
//                     </div>
//                     <div style="flex: 1; font-size: 15px; line-height: 1.5; color: #f3f4f6;">${tip}</div>
//                   </div>
//                 `).join('')}
//               </div>
//             ` : `
//               <p style="font-size: 16px; color: #9ca3af; margin: 0; text-align: center; padding: 40px;">No tips available at this time.</p>
//             `}
//           </div>

//           <!-- Footer -->
//           <div style="position: absolute; bottom: 20mm; left: 25mm; right: 25mm; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #3f3f46; padding-top: 15px;">
//             <p style="margin: 0;">Page 3 of ${Math.ceil(questions.length / 5) + 3} • Generated by Examtards • ${new Date().toLocaleDateString()}</p>
//           </div>
//           ${watermark}
//         </div>
//       `;

//       pdf.addPage();
//       canvas = await html2canvas(reportContainer, { 
//         scale: 1, 
//         useCORS: true,
//         backgroundColor: '#1a1a1a'
//       });
//       imgData = canvas.toDataURL('image/jpeg', 0.5);
//       pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

//       toast.update(toastId, { render: 'Generating question review...' });

//       // Pages 4+: Question Review (5 questions per page)
//       const questionsPerPage = 5;
//       const totalPages = Math.ceil(questions.length / questionsPerPage);
      
//       for (let page = 0; page < totalPages; page++) {
//         const startIdx = page * questionsPerPage;
//         const endIdx = Math.min(startIdx + questionsPerPage, questions.length);
//         const pageQuestions = questions.slice(startIdx, endIdx);
        
//         reportContainer.innerHTML = `
//           <div style="width: 210mm; height: 297mm; padding: 25mm; background: #1a1a1a; color: #f3f4f6; position: relative;">
//             <!-- Header -->
//             <div style="border-bottom: 3px solid #22d3ee; padding-bottom: 15px; margin-bottom: 25px;">
//               <h1 style="font-size: 28px; font-weight: 700; margin: 0; color: #22d3ee;">Question Review</h1>
//               <p style="font-size: 14px; color: #9ca3af; margin: 5px 0 0 0;">Questions ${startIdx + 1} - ${endIdx} of ${questions.length}</p>
//             </div>

//             <!-- Questions -->
//             <div style="display: grid; gap: 20px;">
//               ${pageQuestions.map(q => {
//                 const correctAnswerKey = decryptAnswer(q.question_no);
//                 const userAnswerKey = userAnswers[q.question_no];
//                 const correctAnswerValue = correctAnswerKey && q.options ? q.options[correctAnswerKey] : correctAnswerKey || 'Answer not available';
//                 const userAnswerValue = userAnswerKey && q.options ? q.options[userAnswerKey] : userAnswerKey || 'Not answered';
//                 const isCorrect = userAnswerKey && correctAnswerKey && (
//                   q.question_type === 'mcq' 
//                     ? userAnswerKey === correctAnswerKey 
//                     : userAnswerKey.toLowerCase().trim().replace(/\s+/g, '') === correctAnswerKey.toLowerCase().trim().replace(/\s+/g, '')
//                 );
//                 const isFlagged = flaggedQuestions.includes(q.question_no);
                
//                 return `
//                   <div style="background: #27272a; border-radius: 12px; border: 1px solid #3f3f46; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">
//                     <!-- Question Header -->
//                     <div style="background: ${isCorrect ? '#052e16' : userAnswerKey ? '#450a0a' : '#27272a'}; padding: 15px; border-bottom: 1px solid #3f3f46;">
//                       <div style="display: flex; align-items: center; gap: 12px;">
//                         <div style="background: ${isCorrect ? '#22c55e' : userAnswerKey ? '#ef4444' : '#6b7280'}; color: #1a1a1a; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">
//                           ${isCorrect ? '✓' : userAnswerKey ? '✗' : '○'}
//                         </div>
//                         <div style="flex: 1;">
//                           <div style="font-size: 16px; font-weight: 600; color: #f3f4f6; margin-bottom: 2px;">
//                             Question ${q.question_no}
//                             ${isFlagged ? '<span style="background: #92400e; color: #fde68a; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; margin-left: 8px;">Flagged</span>' : ''}
//                           </div>
//                           <div style="font-size: 14px; color: #9ca3af;">
//                             ${isCorrect ? 'Correct Answer' : userAnswerKey ? 'Incorrect Answer' : 'Not Answered'}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
                    
//                     <!-- Question Content -->
//                     <div style="padding: 20px;">
//                       <div style="font-size: 15px; line-height: 1.6; color: #f3f4f6; margin-bottom: 20px;">
//                         ${q.question}
//                       </div>
                      
//                       <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
//                         <div style="background: ${!userAnswerKey ? '#3f3f46' : isCorrect ? '#052e16' : '#450a0a'}; padding: 15px; border-radius: 8px; border: 1px solid ${!userAnswerKey ? '#4b5563' : isCorrect ? '#14532d' : '#7f1d1d'};">
//                           <div style="font-size: 12px; color: #9ca3af; font-weight: 500; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Your Answer</div>
//                           <div style="font-size: 14px; font-weight: 600; color: #f3f4f6;">${userAnswerValue}</div>
//                         </div>
                        
//                         <div style="background: #052e16; padding: 15px; border-radius: 8px; border: 1px solid #14532d;">
//                           <div style="font-size: 12px; color: #9ca3af; font-weight: 500; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Correct Answer</div>
//                           <div style="font-size: 14px; font-weight: 600; color: #4ade80;">${correctAnswerValue}</div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 `;
//               }).join('')}
//             </div>

//             <!-- Footer -->
//             <div style="position: absolute; bottom: 20mm; left: 25mm; right: 25mm; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #3f3f46; padding-top: 15px;">
//               <p style="margin: 0;">Page ${page + 4} of ${totalPages + 3} • Generated by Examtards • ${new Date().toLocaleDateString()}</p>
//             </div>
//             ${watermark}
//           </div>
//         `;

//         pdf.addPage();
//         canvas = await html2canvas(reportContainer, { 
//           scale: 1, 
//           useCORS: true,
//           backgroundColor: '#1a1a1a',
//           logging: false
//         });
//         imgData = canvas.toDataURL('image/jpeg', 1);
//         pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
//       }

//       // Remove the temporary container
//       document.body.removeChild(reportContainer);
      
//       // Save the PDF
//       const userName = auth?.currentUser?.displayName || 'user';
//       pdf.save(`${userName}-${exam}-${paperName}-detailed-report.pdf`);
//       toast.update(toastId, { render: 'Modern report exported successfully!', type: 'success', autoClose: 5000 });
      
//     } catch (error) {
//       console.error('Error exporting report:', error);
//       toast.update(toastId, { render: 'Failed to export report', type: 'error', autoClose: 5000 });
//     } finally {
//       setIsExporting(false);
//     }
//   };
//   if (!questions || questions.length === 0) {
//     return (
//       <section className="py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//             {paperName} Summary
//           </h2>
//           <p className="text-destructive">Error: No questions available.</p>
//         </div>
//       </section>
//     );
//   }

//   const staticTips = [
//     'Practice daily to build consistency and improve overall performance.',
//     'Review weak areas identified in this attempt and focus on them in your next study session.'
//   ];

//   const allTips = loadingTips ? [] : [...tips.slice(0, 3), ...staticTips];

//   return (
//     <section id="summary-report" className="py-16 px-4 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
//       <div className="max-w-5xl mx-auto">
//         <>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="mb-12"
//           >
//             <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
//               {paperName} Summary
//             </h2>
//             <p className="text-muted-foreground text-center max-w-2xl mx-auto">
//               Review your performance and analyze your results. See what you got right and where you can improve.
//             </p>
//           </motion.div>

//           <div className="absolute inset-0 z-0">
//             <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
//             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgNjBIMFYwaDYwdjYweiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-5 z-0" />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//               className="lg:col-span-1 relative"
//             >
//               <Card className="h-full p-6 flex flex-col items-center justify-center overflow-hidden relative">
//                 <motion.div
//                   className="absolute bottom-0 right-0 w-64 h-64 rounded-full"
//                   initial={{ scale: 0.8, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 0.05 }}
//                   transition={{ duration: 1.5, ease: 'easeOut' }}
//                 >
//                   <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
//                 </motion.div>

//                 <h3 className="text-2xl font-bold mb-4 relative">Your Score</h3>
//                 <div className="w-32 h-32 mb-6 relative">
//                   <CircularProgressbar
//                     value={percentage}
//                     text={`${percentage}%`}
//                     styles={buildStyles({
//                       textColor: 'hsl(var(--foreground))',
//                       pathColor: isPass ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-1))',
//                       trailColor: 'hsl(var(--muted))',
//                       textSize: '20px',
//                     })}
//                   />
//                 </div>
//                 <p className="text-3xl font-bold mb-2 relative">
//                   {score} / {maxScore}
//                 </p>
//                 <Badge
//                   className={cn(
//                     'text-base font-medium mb-4 py-1 px-3',
//                     isPass ? 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20' : 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20'
//                   )}
//                 >
//                   {isPass ? 'Pass (≥60%)' : 'Fail (<60%)'}
//                 </Badge>
//                 <p
//                   className="text-base text-muted-foreground relative"
//                   data-tooltip-id="score-calc"
//                   data-tooltip-content={`Score = ${correct} Correct × ${positiveMarking} − ${incorrect} Incorrect × ${negativeMarking}`}
//                 >
//                   +{positiveMarks} (Correct) − {negativeMarks} (Incorrect) = {score} Total
//                 </p>
//                 <ReactTooltip id="score-calc" place="top" />
//               </Card>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="lg:col-span-2 relative"
//             >
//               <Card className="h-full p-6 overflow-hidden relative">
//                 <h3 className="text-2xl font-bold mb-4">Performance Metrics</h3>

//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//                   <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
//                     <FiList className="text-2xl mb-2 text-foreground" />
//                     <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Total Questions</p>
//                     <p className="text-2xl font-bold">{questions.length}</p>
//                   </div>

//                   <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
//                     <FiCheck className="text-2xl mb-2 text-emerald-500" />
//                     <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Accuracy</p>
//                     <p className="text-2xl font-bold">{accuracy}%</p>
//                   </div>

//                   <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
//                     <FiClock className="text-2xl mb-2 text-foreground" />
//                     <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Time Taken</p>
//                     <p className="text-2xl font-bold">{formatTime(timeTaken)}</p>
//                   </div>

//                   <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
//                     <FiClock className="text-2xl mb-2 text-foreground" />
//                     <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Avg Time/Q</p>
//                     <p className="text-2xl font-bold">{avgTimePerQuestion}s</p>
//                   </div>
//                 </div>

//                 <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
//                   <div className="flex flex-col items-center p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
//                     <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Attempted</p>
//                     <p className="text-3xl font-bold text-blue-500">{attempted}</p>
//                     <p className="text-xs text-muted-foreground mt-1">{attemptRate}% of total</p>
//                   </div>

//                   <div className="flex flex-col items-center p-3 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg">
//                     <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Correct</p>
//                     <p className="text-3xl font-bold text-emerald-500">{correct}</p>
//                   </div>

//                   <div className="flex flex-col items-center p-3 bg-rose-500/10 dark:bg-rose-500/20 rounded-lg">
//                     <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Incorrect</p>
//                     <p className="text-3xl font-bold text-rose-500">{incorrect}</p>
//                   </div>

//                   <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
//                     <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Unanswered</p>
//                     <p className="text-3xl font-bold text-muted-foreground">{unanswered}</p>
//                   </div>
//                 </div>

//                 <motion.div
//                   className="absolute bottom-0 left-0 w-64 h-64 rounded-full"
//                   initial={{ scale: 0.8, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 0.05 }}
//                   transition={{ duration: 1.5, ease: 'easeOut' }}
//                 >
//                   <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
//                 </motion.div>
//               </Card>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//               className="lg:col-span-2 relative"
//             >
//               <Card className="h-full p-6 overflow-hidden relative">
//                 <h3 className="text-2xl font-bold mb-6">Performance Overview</h3>
//                 <div className="w-full h-[200px] mx-auto">
//                   <BarChart
//                     width={500}
//                     height={200}
//                     data={chartData}
//                     layout="vertical"
//                     margin={{ left: 75, right: 30, top: 10, bottom: 10 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                     <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
//                     <YAxis
//                       type="category"
//                       dataKey="name"
//                       tick={{ fontSize: 14 }}
//                       stroke="hsl(var(--muted-foreground))"
//                       width={70}
//                     />
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: 'hsl(var(--card))',
//                         borderColor: 'hsl(var(--border))',
//                         color: 'hsl(var(--foreground))',
//                       }}
//                     />
//                     <Bar dataKey="value" radius={[0, 4, 4, 0]} />
//                   </BarChart>
//                 </div>

//                 <motion.div
//                   className="absolute top-1/2 right-0 w-32 h-32 rounded-full"
//                   initial={{ scale: 0.8, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 0.05 }}
//                   transition={{ duration: 1.5, ease: 'easeOut' }}
//                 >
//                   <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
//                 </motion.div>
//               </Card>
//             </motion.div>

//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//               className="lg:col-span-1 relative"
//             >
//               <Card className="h-full p-6 overflow-hidden relative">
//                 <h3 className="text-2xl font-bold mb-6">Actions</h3>
//                 <div className="space-y-4">
//                   <Button onClick={handleRetryQuiz} className="w-full justify-between group">
//                     Retry Quiz
//                     <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
//                   </Button>

//                   <Button
//                     onClick={() => router.push('/dashboard')}
//                     className="w-full justify-between group"
//                     variant="outline"
//                   >
//                     Dashboard
//                     <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
//                   </Button>

//                   <Button
//                     onClick={handleShareScore}
//                     className="w-full justify-between group"
//                     variant="secondary"
//                   >
//                     <span className="flex items-center">
//                       <FiShare2 className="mr-2" />
//                       Share Score
//                     </span>
//                     <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
//                   </Button>

//                   <Button
//                     onClick={handleExportReport}
//                     disabled={isExporting}
//                     className="w-full justify-between group"
//                     variant="secondary"
//                   >
//                     <span className="flex items-center">
//                       <FiDownload className="mr-2" />
//                       {isExporting ? 'Exporting...' : 'Export Report'}
//                     </span>
//                     <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
//                   </Button>
//                 </div>

//                 <motion.div
//                   className="absolute bottom-0 right-0 w-32 h-32 rounded-full"
//                   initial={{ scale: 0.8, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 0.05 }}
//                   transition={{ duration: 1.5, ease: 'easeOut' }}
//                 >
//                   <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
//                 </motion.div>
//               </Card>
//             </motion.div>
//           </div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.5 }}
//             className="relative mb-12"
//           >
//             <Card className="p-6 overflow-hidden relative">
//               <h3 className="text-2xl font-bold mb-4">Progress Comparison</h3>
//               {previousData !== null && previousData.length > 0 ? (
//                 <div>
//                   {previousData.map((prev, i) => (
//                     <p key={i} className="text-lg">
//                       {i + 1} attempt ago: Score {prev.score} {score > prev.score ? `(up ${score - prev.score})` : `(down ${prev.score - score})`}, Correct {prev.correct} {correct > prev.correct ? `(up ${correct - prev.correct})` : `(down ${prev.correct - correct})`}, Avg Time/Q {prev.avgTimePerQuestion}s {parseFloat(avgTimePerQuestion) < parseFloat(prev.avgTimePerQuestion) ? '(Faster)' : '(Slower)'}
//                     </p>
//                   ))}
//                 </div>
//               ) : (
//                 <p className="text-lg text-muted-foreground">No previous attempt found for comparison.</p>
//               )}
//             </Card>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.5 }}
//             className="relative mb-12"
//           >
//             <Card className="p-6 overflow-hidden relative">
//               <h3 className="text-2xl font-bold mb-4">Personalized Tips</h3>
//               {loadingTips ? (
//                 <div className="flex items-center justify-center">
//                   <Loader2 className="animate-spin text-primary" size={24} />
//                   <p className="ml-2 text-muted-foreground">Generating tips...</p>
//                 </div>
//               ) : tips.length > 0 ? (
//                 <ul className="list-disc pl-5 space-y-2">
//                   {tips.map((tip, idx) => (
//                     <li key={idx}>{tip}</li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-muted-foreground">No tips available.</p>
//               )}
//             </Card>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.5 }}
//             className="relative"
//           >
//             <Card className="p-6 overflow-hidden relative">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-2xl font-bold">Question Review</h3>
//                 <div className="flex gap-3">
//                   <Button
//                     onClick={handleReviewIncorrect}
//                     variant={showIncorrectOnly ? 'secondary' : 'outline'}
//                     className="text-sm"
//                     size="sm"
//                   >
//                     {showIncorrectOnly ? 'Show All' : `Incorrect Only (${incorrect})`}
//                   </Button>
//                   <Button onClick={handleExpandAll} variant="outline" className="text-sm" size="sm">
//                     Expand All
//                   </Button>
//                 </div>
//               </div>

//               <Collapsible open={true}>
//                 <div className="grid grid-cols-1 gap-4">
//                   <AnimatePresence>
//                     {questions
//                       .filter((q) => {
//                         if (!showIncorrectOnly) return true;
//                         const userAnswer = userAnswers[q.question_no];
//                         const correctAnswer = decryptAnswer(q.question_no);
//                         return userAnswer && correctAnswer && userAnswer !== correctAnswer;
//                       })
//                       .map((q, index) => {
//                         const correctAnswerKey = decryptAnswer(q.question_no);
//                         const userAnswerKey = userAnswers[q.question_no];
//                         const correctAnswerValue = correctAnswerKey && q.options ? q.options[correctAnswerKey] : correctAnswerKey || 'Answer not available';
//                         const userAnswerValue = userAnswerKey && q.options ? q.options[userAnswerKey] : userAnswerKey || 'Not answered';
//                         const isCorrect =
//                           userAnswerKey &&
//                           correctAnswerKey &&
//                           (q.question_type === 'mcq'
//                             ? userAnswerKey === correctAnswerKey
//                             : userAnswerKey.toLowerCase().trim().replace(/\s+/g, '') ===
//                               correctAnswerKey.toLowerCase().trim().replace(/\s+/g, ''));
//                         const isFlagged = flaggedQuestions.includes(q.question_no);

//                         return (
//                           <motion.div
//                             key={q.question_no}
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.3, delay: index * 0.05 }}
//                           >
//                             <Card
//                               className={cn(
//                                 'border transition-colors',
//                                 isCorrect ? 'hover:border-emerald-500/50' : 'hover:border-rose-500/50',
//                                 expandedQuestions.includes(q.question_no)
//                                   ? isCorrect
//                                     ? 'border-emerald-500/50'
//                                     : 'border-rose-500/50'
//                                   : 'border-border'
//                               )}
//                             >
//                               <Collapsible
//                                 open={expandedQuestions.includes(q.question_no)}
//                                 onOpenChange={() => toggleQuestion(q.question_no)}
//                               >
//                                 <CollapsibleTrigger asChild>
//                                   <div className="p-4 flex items-center justify-between cursor-pointer">
//                                     <div className="flex items-center gap-3">
//                                       <div
//                                         className={cn(
//                                           'flex items-center justify-center w-8 h-8 rounded-full',
//                                           isCorrect
//                                             ? 'bg-emerald-500/10 text-emerald-500'
//                                             : userAnswerKey
//                                             ? 'bg-rose-500/10 text-rose-500'
//                                             : 'bg-muted text-muted-foreground'
//                                         )}
//                                       >
//                                         {isCorrect ? <FiCheck /> : userAnswerKey ? <FiX /> : <FiCircle />}
//                                       </div>
//                                       <div>
//                                         <p className="font-medium text-foreground">
//                                           Question {q.question_no}
//                                           {isFlagged && (
//                                             <Badge className="ml-2 bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
//                                               Flagged
//                                             </Badge>
//                                           )}
//                                         </p>
//                                         <p className="text-sm text-muted-foreground line-clamp-1">
//                                           {q.question.substring(0, 60)}...
//                                         </p>
//                                       </div>
//                                     </div>
//                                     <div className="flex items-center">
//                                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
//                                         {expandedQuestions.includes(q.question_no) ? (
//                                           <FiChevronUp className="text-lg" />
//                                         ) : (
//                                           <FiChevronDown className="text-lg" />
//                                         )}
//                                       </Button>
//                                     </div>
//                                   </div>
//                                 </CollapsibleTrigger>
//                                 <CollapsibleContent>
//                                   <div className="px-4 pb-4 border-t border-border pt-4">
//                                     <p className="mb-4 text-foreground">{q.question}</p>

//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                                       <div
//                                         className={cn(
//                                           'p-3 rounded-lg',
//                                           !userAnswerKey
//                                             ? 'bg-muted/50'
//                                             : isCorrect
//                                             ? 'bg-emerald-500/10 dark:bg-emerald-500/20'
//                                             : 'bg-rose-500/10 dark:bg-rose-500/20'
//                                         )}
//                                       >
//                                         <p className="text-sm text-muted-foreground mb-1">Your Answer</p>
//                                         <p className="font-medium">{userAnswerValue}</p>
//                                       </div>

//                                       <div className="p-3 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20">
//                                         <p className="text-sm text-muted-foreground mb-1">Correct Answer</p>
//                                         <p className="font-medium">{correctAnswerValue}</p>
//                                       </div>
//                                     </div>

//                                     <div className="flex justify-end">
//                                       <a
//                                         href={`https://www.google.com/search?q=explain ${encodeURIComponent(q.question)}`}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="text-primary underline-offset-4 hover:underline"
//                                       >
//                                         Explain Answer
//                                       </a>
//                                     </div>
//                                   </div>
//                                 </CollapsibleContent>
//                               </Collapsible>
//                             </Card>
//                           </motion.div>
//                         );
//                       })}
//                   </AnimatePresence>
//                 </div>
//               </Collapsible>

//               <motion.div
//                 className="absolute bottom-0 left-0 w-64 h-64 rounded-full"
//                 initial={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 0.05 }}
//                 transition={{ duration: 1.5, ease: 'easeOut' }}
//               >
//                 <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
//               </motion.div>
//             </Card>
//           </motion.div>
//         </>
//       </div>

//       {showShareModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="p-6 max-w-md w-full mx-4 bg-white dark:bg-black rounded-lg shadow-lg">
//             <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Share Your Score</h3>
//             <p className="mb-4 text-gray-900 dark:text-white">
//              I scored {percentage}% ({correct}/{questions.length}) on {exam ? `${exam} - ` : ''}{paperName || paper || 'this quiz'} in {formatTime(timeTaken)}.
//             </p>
//             <div className="flex gap-4 justify-center">
//               <FacebookShareButton url={window.location.href} quote={`I scored ${percentage}% on ${paper}!`}>
//                 <FacebookIcon size={40} round={false} />
//               </FacebookShareButton>
//               <TwitterShareButton url={window.location.href} title={`I scored ${percentage}% on ${paper}!`}>
//                 <XIcon size={40} round={false} />
//               </TwitterShareButton>
//               <LinkedinShareButton
//                 url={window.location.href}
//                 title={`${paperName} Score`}
//                 summary={`Scored ${percentage}% in ${formatTime(timeTaken)}.`}
//               >
//                 <LinkedinIcon size={40} round={false} />
//               </LinkedinShareButton>
//             </div>
//             <button
//               className="mt-4 w-full border border-gray-300 dark:border-gray-600 rounded py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
//               onClick={() => setShowShareModal(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default SummaryScreen;





















'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { FiCheck, FiX, FiShare2, FiClock, FiList, FiChevronDown, FiChevronUp, FiCircle, FiArrowRight, FiDownload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,LineChart, Line,Area ,AreaChart,ResponsiveContainer} from 'recharts';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { collection, query, getDocs, orderBy, limit, deleteDoc, setDoc, doc, serverTimestamp,where } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase'; // Adjust path as needed and ensure auth is imported
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Loader2 } from 'lucide-react';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  XIcon,
  LinkedinIcon,
} from 'react-share';

interface SummaryScreenProps {
  questions: Array<{
    question_no: number;
    question: string;
    question_type: string;
    options?: Record<string, string>;
  }>;
  userAnswers: Record<number, string>;
  flaggedQuestions: number[];
  totalQuestions: number;
  positiveMarking: number;
  negativeMarking: number;
  timeTaken: number;
  paperName: string;
  decryptAnswer: (questionNo: number) => string | null;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({
  questions,
  userAnswers,
  flaggedQuestions,
  totalQuestions,
  positiveMarking,
  negativeMarking,
  timeTaken,
  paperName,
  decryptAnswer,
}) => {
  const router = useRouter();
  const { exam, subject, paper, mode } = router.query;
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);
  const [showIncorrectOnly, setShowIncorrectOnly] = useState(false);
  const [tips, setTips] = useState<string[]>([]);
  const [loadingTips, setLoadingTips] = useState(true);
  const [previousData, setPreviousData] = useState<any[] | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('score');
  useEffect(() => {
    // console.log('Total Questions:', questions.length);
    // console.log('User Answers:', userAnswers);
    questions.forEach((q) => {
      const userAnswer = userAnswers[q.question_no];
      const correctAnswer = decryptAnswer(q.question_no);
      // console.log(`Question ${q.question_no}: User Answer = ${userAnswer || 'Not answered'}, Correct Answer = ${correctAnswer || 'Failed to decrypt'}`);
    });
  }, [questions, userAnswers, decryptAnswer]);

  const calculateMetrics = () => {
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    let positiveMarks = 0;
    let negativeMarks = 0;
    let attempted = 0;

    questions.forEach((q) => {
      const userAnswer = userAnswers[q.question_no];
      const correctAnswer = decryptAnswer(q.question_no);

      if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
        attempted += 1;
        if (correctAnswer) {
          if (q.question_type === 'mcq') {
            if (userAnswer === correctAnswer) {
              score += positiveMarking;
              positiveMarks += positiveMarking;
              correct += 1;
            } else {
              score -= negativeMarking;
              negativeMarks += negativeMarking;
              incorrect += 1;
            }
          } else if (q.question_type === 'fill-in-the-blanks') {
            const userAnswerNormalized = userAnswer.toLowerCase().trim().replace(/\s+/g, '');
            const correctAnswerNormalized = correctAnswer.toLowerCase().trim().replace(/\s+/g, '');
            if (userAnswerNormalized === correctAnswerNormalized) {
              score += positiveMarking;
              positiveMarks += positiveMarking;
              correct += 1;
            } else {
              score -= negativeMarking;
              negativeMarks += negativeMarking;
              incorrect += 1;
            }
          }
        } else {
          score -= negativeMarking;
          negativeMarks += negativeMarking;
          incorrect += 1;
        }
      } else {
        unanswered += 1;
      }
    });

    const actualTotalQuestions = questions.length;
    const maxScore = actualTotalQuestions * positiveMarking;
    const accuracy = actualTotalQuestions > 0 ? ((correct / actualTotalQuestions) * 100).toFixed(1) : '0';
    const attemptRate = actualTotalQuestions > 0 ? ((attempted / actualTotalQuestions) * 100).toFixed(1) : '0';
    const avgTimePerQuestion = actualTotalQuestions > 0 ? (timeTaken / actualTotalQuestions).toFixed(1) : '0';

    // console.log('Metrics:', { score, correct, incorrect, unanswered, attempted, totalQuestions: actualTotalQuestions });

    return {
      score,
      maxScore,
      positiveMarks,
      negativeMarks,
      correct,
      incorrect,
      unanswered,
      attempted,
      accuracy: parseFloat(accuracy),
      attemptRate,
      avgTimePerQuestion,
    };
  };

  const {
    score,
    maxScore,
    positiveMarks,
    negativeMarks,
    correct,
    incorrect,
    unanswered,
    attempted,
    accuracy,
    attemptRate,
    avgTimePerQuestion,
  } = calculateMetrics();
  const percentage = maxScore > 0 ? parseFloat(((score / maxScore) * 100).toFixed(1)) : 0;
  const isPass = percentage >= 60;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  const toggleQuestion = (questionNo: number) => {
    setExpandedQuestions((prev) =>
      prev.includes(questionNo) ? prev.filter((no) => no !== questionNo) : [...prev, questionNo]
    );
  };

  const handleExpandAll = () => {
    setShowIncorrectOnly(false);
    setExpandedQuestions(questions.map((q) => q.question_no));
  };

  const handleReviewIncorrect = () => {
    setShowIncorrectOnly((prev) => !prev);
    if (!showIncorrectOnly) {
      setExpandedQuestions([]);
    }
  };

  const handleRetryQuiz = () => {
    // Clear localStorage keys with proper string interpolation
    if (mode && exam && subject && paper) {
      const keyPrefix = `${mode}-${exam}-${subject}-${paper}`;
      console.log('Clearing localStorage for prefix:', keyPrefix);
      localStorage.removeItem(`userAnswers-${keyPrefix}`);
      localStorage.removeItem(`flaggedQuestions-${keyPrefix}`);
      localStorage.removeItem(`startTime-${keyPrefix}`);
      localStorage.removeItem(`currentQuestionIndex-${keyPrefix}`);
      // Redirect with /pyqs prefix
      const retryPath = `/pyqs/${exam}/${subject}/${paper}`;
      console.log('Retrying to path:', retryPath);
      router.push(retryPath);
    } else {
      console.error('Missing query parameters for retry:', { mode, exam, subject, paper });
       const retryPath = `/pyqs/${exam}/${subject}/${paper}`;
      console.log('Retrying to path:', retryPath);
      toast.error('Unable to retry quiz due to missing parameters.');
    }
  };

  const handleShareScore = () => {
    setShowShareModal(true);
  };

  const chartData = [
    { name: 'Attempted', value: attempted, fill: '#0ea5e9' },
    { name: 'Correct', value: correct, fill: '#22d3ee' },
    { name: 'Incorrect', value: incorrect, fill: '#a855f7' },
    { name: 'Unanswered', value: unanswered, fill: '#6b7280' },
  ];

  const cleanupGlobalHistory = useCallback(async () => {
    try {
      const q = query(
        collection(db!, 'users', auth!.currentUser!.uid, 'examHistory'),
        orderBy('timestamp', 'desc'),
        limit(11)
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs;
      console.log('Fetched global history count before cleanup:', docs.length);

      if (docs.length > 10) {
        const oldestDocs = docs.slice(10);
        console.log('Deleting oldest docs:', oldestDocs.length);
        for (const doc of oldestDocs) {
          await deleteDoc(doc.ref);
        }
      } else {
        console.log('No cleanup needed, history within limit.');
      }
    } catch (error) {
      console.error('Error cleaning global history:', error);
    }
  }, []);

  const fetchPreviousAttempt = useCallback(async () => {
    if (!exam || !subject || !paper || !mode) return;
    try {
      const q = query(
        collection(db!, 'users', auth!.currentUser!.uid, 'examHistory'),
        where('exam', '==', exam),
        where('subject', '==', subject),
        where('paper', '==', paper),
        where('mode', '==', mode),
        orderBy('timestamp', 'desc'),
        limit(4) // Get current + last 3
      );
      const querySnapshot = await getDocs(q);
      console.log('Fetched previous attempts count:', querySnapshot.docs.length);
      if (querySnapshot.docs.length >= 2) {
        const prevAttempts = querySnapshot.docs.slice(1, 4).map(doc => doc.data());
        console.log('Previous data:', prevAttempts);
        setPreviousData(prevAttempts);
      } else {
        console.log('No previous attempts found.');
      }
    } catch (error) {
      console.error('Error fetching previous attempt:', error);
    }
  }, [exam, subject, paper, mode]);

  // const generateTips = async (fallback = false) => {
  //   setLoadingTips(true);
  //   try {
  //     if (!fallback) {
  //       const GEMINI_KEY = process.env.NEXT_PUBLIC_GEMINI_KEY;
  //       const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_KEY}`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           contents: [{
  //             parts: [{
  //               text: `As an exam preparation coach, generate  personalized, concise, and actionable tips to help the user improve, based on these detailed stats from their recent attempt: Score: ${score}/${maxScore} (${percentage.toFixed(1)}%), Accuracy: ${accuracy}% (based on attempted questions), Attempted: ${attempted}/${totalQuestions} (${attemptRate}%), Correct: ${correct}, Incorrect: ${incorrect}, Unanswered: ${unanswered}, Avg Time per Question: ${avgTimePerQuestion}s, Total Time Taken: ${formatTime(timeTaken)}, Positive Marking per Correct: +${positiveMarking}, Negative Marking per Incorrect: -${negativeMarking}. Focus on addressing key weaknesses like low accuracy, high unanswered, negative marking impacts, or time management issues, and suggest specific strategies for better performance in future attempts. Make tips encouraging and practical.`
  //             }]
  //           }]
  //         }),
  //       });
  //       const data = await response.json();
  //       const generatedTips = data.candidates[0].content.parts[0].text.split('\n').filter(t => t.trim());
  //       setTips(generatedTips);
  //     } else {
  //       // Rule-based fallback
  //       const fallbackTips: string[] = [];
  //       if (accuracy < 50) {
  //         fallbackTips.push(`Your accuracy is low (${accuracy.toFixed(1)}%)—focus on understanding core concepts. Review the ${incorrect} incorrect answers first.`);
  //       } else if (accuracy < 80) {
  //         fallbackTips.push(`Solid effort at ${accuracy.toFixed(1)}% accuracy! Work on reducing the ${incorrect} mistakes by practicing similar questions.`);
  //       } else {
  //         fallbackTips.push(`Great accuracy (${accuracy.toFixed(1)}%)—challenge yourself with timed mocks to maintain it.`);
  //       }
  //       if (unanswered > totalQuestions * 0.2) {
  //         fallbackTips.push(`You left ${unanswered} questions unanswered (${((unanswered / totalQuestions) * 100).toFixed(1)}%). Try guessing educated options next time to boost your score.`);
  //       }
  //       const expectedTimePerQ = 60;
  //       if (parseFloat(avgTimePerQuestion) < expectedTimePerQ * 0.5) {
  //         fallbackTips.push(`You were fast (${avgTimePerQuestion}s/Q), but check if rushing led to the ${incorrect} errors.`);
  //       } else if (parseFloat(avgTimePerQuestion) > expectedTimePerQ * 1.5) {
  //         fallbackTips.push(`Time management tip: At ${avgTimePerQuestion}s/Q, practice speed drills to reduce overall time from ${formatTime(timeTaken)}.`);
  //       }
  //       fallbackTips.push('Practice daily to build consistency and improve overall performance.');
  //       fallbackTips.push('Review weak areas identified in this attempt and focus on them in your next study session.');
  //       fallbackTips.push('Use active recall techniques to strengthen memory retention.');
  //       fallbackTips.push('Set specific goals for each practice session to track progress effectively.');
  //       setTips(fallbackTips.slice(0, 5));
  //     }
  //   } catch (error) {
  //     console.error('Error generating tips:', error);
  //     // Fallback to rule-based if API fails
  //     if (!fallback) {
  //       generateTips(true);
  //     }
  //   } finally {
  //     setLoadingTips(false);
  //   }
  // };
const generateTips = async (fallback = false) => {
  setLoadingTips(true);
  try {
    if (!fallback) {
      // 1. Call YOUR OWN secure API route, not Google's directly.
      const response = await fetch('/api/generate-tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 2. Send all the necessary stats in the body.
        body: JSON.stringify({
          score, maxScore, percentage, accuracy, attempted, totalQuestions,
          attemptRate, correct, incorrect, unanswered, avgTimePerQuestion,
          timeTaken: formatTime(timeTaken), // Send the formatted string
          positiveMarking, negativeMarking
        }),
      });

      if (!response.ok) {
        // If our server API returned an error, throw to trigger the fallback.
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      setTips(data.tips);

    } else {
      // 3. Improved Rule-based fallback logic.
      console.log("API failed or was skipped. Generating fallback tips.");
      const fallbackTips: string[] = [];

      // Accuracy check
      if (accuracy < 60) {
        fallbackTips.push(`Accuracy is a key area for improvement at ${accuracy.toFixed(1)}%. Focus on strengthening your fundamental concepts before attempting more questions.`);
      } else if (accuracy < 85) {
        fallbackTips.push(`Good effort on accuracy (${accuracy.toFixed(1)}%)! To improve, carefully review your ${incorrect} mistakes to identify patterns.`);
      }

      // Unanswered questions check
      const unansweredRate = (unanswered / totalQuestions) * 100;
      if (unansweredRate > 25) {
        fallbackTips.push(`You left ${unanswered} questions unanswered (${unansweredRate.toFixed(1)}%). Build confidence by practicing more questions, even on topics you feel weak in.`);
      }
      
      // Educated guessing tip that accounts for negative marking
      if (negativeMarking === 0 && unanswered > 0) {
        fallbackTips.push(`Since there's no negative marking, don't leave questions unanswered! An educated guess is better than zero marks.`);
      } else if (negativeMarking > 0 && unanswered > 0) {
        fallbackTips.push(`With negative marking, it was wise to skip ${unanswered} questions. Only guess if you can eliminate at least two options.`);
      }

      // Time management check
      const expectedTimePerQ = 90; // Example: more realistic for some exams
      if (parseFloat(avgTimePerQuestion) > expectedTimePerQ * 1.2) {
        fallbackTips.push(`Your pace of ${avgTimePerQuestion}s per question is a bit slow. Practice timed sets to improve your speed.`);
      } else if (parseFloat(avgTimePerQuestion) < expectedTimePerQ * 0.5 && accuracy < 80) {
        fallbackTips.push(`You're very fast at ${avgTimePerQuestion}s per question, but it may be hurting your accuracy. Slow down slightly to read questions more carefully.`);
      }
      
      fallbackTips.push('Review this attempt to pinpoint weak topics for your next study session.');
      fallbackTips.push('Consistency is key. Set aside time each day for practice.');
      
      setTips(fallbackTips.slice(0, 5)); // Show up to 5 best fallback tips
    }
  } catch (error) {
    console.error('Error generating tips:', error);
    // If the API call fails, trigger the fallback logic.
    if (!fallback) {
      generateTips(true);
    }
  } finally {
    setLoadingTips(false);
  }
};


  useEffect(() => {
  const saveHistory = async () => {
  if (!exam || !subject || !paper || !mode || typeof exam !== 'string' || typeof subject !== 'string' || typeof paper !== 'string' || typeof mode !== 'string') {
    console.error('Missing or invalid parameters for saving history:', { exam, subject, paper, mode });
    return; // Skip save to avoid inconsistent entries
  }
  try {
    console.log('Attempting to save history with data:', { exam, mode, paper, score, subject, totalQuestions: questions.length, correct, avgTimePerQuestion });
    const historyRef = collection(db!, 'users', auth!.currentUser!.uid, 'examHistory');
    const docId = `exam-${exam.replace(/\s/g, '_')}-${subject.replace(/\s/g, '_')}-${paper.replace(/\s/g, '_')}-${mode.replace(/\s/g, '_')}-${Date.now()}`;
    await setDoc(doc(historyRef, docId), {
      exam,
      mode,
      paper,
      score,
      subject,
      timestamp: serverTimestamp(),
      totalQuestions: questions.length,
      correct,
      avgTimePerQuestion
    });
    console.log('Saved new history document with ID:', docId);
  } catch (error) {
    console.error('Error saving history:', error);
  }
};

    saveHistory();
    cleanupGlobalHistory();
    fetchPreviousAttempt();
    generateTips();
  }, [exam, subject, paper, mode, score, questions.length, correct, avgTimePerQuestion, cleanupGlobalHistory, fetchPreviousAttempt]);

const handleExportReport = async () => {
    const toastId = toast('Preparing your comprehensive report...', { autoClose: false, type: 'info' });
    setIsExporting(true);

    try {
      toast.update(toastId, { render: 'Generating cover page...' });
      // Create a temporary container for the report
      const reportContainer = document.createElement('div');
      reportContainer.id = 'export-report-container';
      reportContainer.style.position = 'fixed';
      reportContainer.style.top = '-10000px';
      reportContainer.style.left = '-10000px';
      reportContainer.style.width = '210mm'; // A4 width
      reportContainer.style.backgroundColor = '#1a1a1a';
      reportContainer.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      document.body.appendChild(reportContainer);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Common watermark
      const watermark = `
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; opacity: 0.1; color: #666666; pointer-events: none; user-select: none;">
          examtards
        </div>
      `;

      // Page 1: Cover Page
      reportContainer.innerHTML = `
        <div style="width: 210mm; height: 297mm; padding: 40mm; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%); color: #ffffff; text-align: center; position: relative; overflow: hidden;">
          <!-- Background Pattern -->
          <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.1; background-image: radial-gradient(circle at 20% 50%, #ffffff 2px, transparent 2px), radial-gradient(circle at 80% 50%, #ffffff 2px, transparent 2px); background-size: 50px 50px;"></div>
          
          <!-- Main Content -->
          <div style="position: relative; z-index: 1;">
            <div style="width: 120px; height: 120px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.2);">
              <div style="font-size: 48px; font-weight: 800;">📊</div>
            </div>
            
            <h1 style="font-size: 48px; font-weight: 800; margin: 0 0 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
              EXAMTARDS
            </h1>
            
            <div style="height: 4px; width: 100px; background: rgba(255,255,255,0.5); margin: 0 auto 40px; border-radius: 2px;"></div>
            
            <h2 style="font-size: 32px; font-weight: 600; margin: 0 0 60px 0; opacity: 0.95;">
              ${paperName}
            </h2>
            
            <div style="background: rgba(255,255,255,0.1); padding: 30px; border-radius: 20px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
              <h3 style="font-size: 24px; font-weight: 600; margin: 0 0 20px 0;">Performance Summary</h3>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 18px; opacity: 0.9;">Score:</span>
                <span style="font-size: 24px; font-weight: 700;">${score}/${maxScore} (${percentage}%)</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <span style="font-size: 18px; opacity: 0.9;">Status:</span>
                <span style="font-size: 20px; font-weight: 600; color: ${isPass ? '#4ade80' : '#f87171'};">${isPass ? 'PASS' : 'FAIL'}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 18px; opacity: 0.9;">Accuracy:</span>
                <span style="font-size: 20px; font-weight: 600;">${accuracy}%</span>
              </div>
            </div>
            
            <div style="margin-top: 60px; font-size: 16px; opacity: 0.8;">
              Generated on ${new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          ${watermark}
        </div>
      `;

      let canvas = await html2canvas(reportContainer, { 
        scale: 1, 
        useCORS: true,
        backgroundColor: '#1a1a1a'
      });
      let imgData = canvas.toDataURL('image/jpeg', 0.5);
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

      toast.update(toastId, { render: 'Generating performance overview...' });

      // Page 2: Performance Overview
      reportContainer.innerHTML = `
        <div style="width: 210mm; height: 297mm; padding: 25mm; background: #1a1a1a; color: #f3f4f6; position: relative;">
          <!-- Header -->
          <div style="border-bottom: 3px solid #818cf8; padding-bottom: 15px; margin-bottom: 30px;">
            <h1 style="font-size: 28px; font-weight: 700; margin: 0; color: #818cf8;">Performance Overview</h1>
            <p style="font-size: 14px; color: #9ca3af; margin: 5px 0 0 0;">Detailed analysis of your exam performance</p>
          </div>

          <!-- Key Metrics Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #27272a 0%, #3f3f46 100%); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #3f3f46;">
              <div style="font-size: 36px; font-weight: 800; color: #f3f4f6; margin-bottom: 5px;">${questions.length}</div>
              <div style="font-size: 14px; color: #9ca3af; font-weight: 500;">Total Questions</div>
            </div>
            <div style="background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #065f46;">
              <div style="font-size: 36px; font-weight: 800; color: #ecfdf5; margin-bottom: 5px;">${accuracy}%</div>
              <div style="font-size: 14px; color: #ecfdf5; font-weight: 500;">Accuracy</div>
            </div>
            <div style="background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%); padding: 20px; border-radius: 12px; text-align: center; border: 1px solid #1d4ed8;">
              <div style="font-size: 36px; font-weight: 800; color: #eff6ff; margin-bottom: 5px;">${formatTime(timeTaken)}</div>
              <div style="font-size: 14px; color: #eff6ff; font-weight: 500;">Time Taken</div>
            </div>
          </div>

          <!-- Performance Breakdown -->
          <div style="background: #27272a; padding: 25px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #3f3f46;">
            <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 20px 0; color: #d1d5db;">Performance Breakdown</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #3f3f46;">
                  <span style="font-weight: 500; color: #d1d5db;">Attempted Questions</span>
                  <span style="font-weight: 600; color: #f3f4f6;">${attempted} (${attemptRate}%)</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #3f3f46;">
                  <span style="font-weight: 500; color: #d1d5db;">Correct Answers</span>
                  <span style="font-weight: 600; color: #4ade80;">${correct}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #3f3f46;">
                  <span style="font-weight: 500; color: #d1d5db;">Incorrect Answers</span>
                  <span style="font-weight: 600; color: #f87171;">${incorrect}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
                  <span style="font-weight: 500; color: #d1d5db;">Unanswered</span>
                  <span style="font-weight: 600; color: #9ca3af;">${unanswered}</span>
                </div>
              </div>
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #3f3f46;">
                  <span style="font-weight: 500; color: #d1d5db;">Positive Marks</span>
                  <span style="font-weight: 600; color: #4ade80;">+${positiveMarks}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #3f3f46;">
                  <span style="font-weight: 500; color: #d1d5db;">Negative Marks</span>
                  <span style="font-weight: 600; color: #f87171;">-${negativeMarks}</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #3f3f46;">
                  <span style="font-weight: 500; color: #d1d5db;">Average Time/Question</span>
                  <span style="font-weight: 600; color: #f3f4f6;">${avgTimePerQuestion}s</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
                  <span style="font-weight: 500; color: #d1d5db;">Final Score</span>
                  <span style="font-weight: 700; color: #f3f4f6; font-size: 18px;">${score}/${maxScore}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Score Visualization -->
          <div style="background: #27272a; padding: 25px; border-radius: 16px; border: 1px solid #3f3f46; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">
            <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 20px 0; color: #d1d5db;">Score Analysis</h2>
            <div style="display: flex; align-items: center; gap: 30px;">
              <div style="flex: 1;">
                <div style="background: #3f3f46; height: 20px; border-radius: 10px; overflow: hidden; margin-bottom: 10px;">
                  <div style="background: linear-gradient(90deg, ${isPass ? '#22c55e' : '#ef4444'} 0%, ${isPass ? '#16a34a' : '#dc2626'} 100%); height: 100%; width: ${Math.min(percentage, 100)}%; border-radius: 10px; transition: width 0.3s ease;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px; color: #9ca3af;">
                  <span>0%</span>
                  <span style="font-weight: 600; color: #f3f4f6;">${percentage}%</span>
                  <span>100%</span>
                </div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 48px; font-weight: 800; color: ${isPass ? '#22c55e' : '#ef4444'}; margin-bottom: 5px;">${percentage}%</div>
                <div style="font-size: 16px; font-weight: 600; color: ${isPass ? '#22c55e' : '#ef4444'}; padding: 8px 16px; background: ${isPass ? '#052e16' : '#450a0a'}; border-radius: 20px; border: 1px solid ${isPass ? '#14532d' : '#7f1d1d'};">
                  ${isPass ? 'PASS' : 'FAIL'}
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="position: absolute; bottom: 20mm; left: 25mm; right: 25mm; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #3f3f46; padding-top: 15px;">
            <p style="margin: 0;">Page 2 of ${Math.ceil(questions.length / 5) + 3} • Generated by Examtards • ${new Date().toLocaleDateString()}</p>
          </div>
          ${watermark}
        </div>
      `;

      pdf.addPage();
      canvas = await html2canvas(reportContainer, { 
        scale: 1, 
        useCORS: true,
        backgroundColor: '#1a1a1a'
      });
      imgData = canvas.toDataURL('image/jpeg', 0.5);
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

      toast.update(toastId, { render: 'Generating tips & recommendations...' });

      // Page 3: Tips & Recommendations
      reportContainer.innerHTML = `
        <div style="width: 210mm; height: 297mm; padding: 25mm; background: #1a1a1a; color: #f3f4f6; position: relative;">
          <!-- Header -->
          <div style="border-bottom: 3px solid #a78bfa; padding-bottom: 15px; margin-bottom: 30px;">
            <h1 style="font-size: 28px; font-weight: 700; margin: 0; color: #a78bfa;">Tips & Recommendations</h1>
            <p style="font-size: 14px; color: #9ca3af; margin: 5px 0 0 0;">Personalized insights to improve your performance</p>
          </div>

          <!-- Progress Comparison -->
          <div style="background: linear-gradient(135deg, #422006 0%, #713f12 100%); padding: 25px; border-radius: 16px; margin-bottom: 30px; border: 1px solid #854d0e;">
            <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 15px 0; color: #fde68a;">Progress Comparison</h2>
            ${previousData ? `
              <div style="display: flex; flex-direction: column; gap: 10px;">
                <div style="font-size: 16px; color: #fde68a;">Current: Score ${score}, Correct ${correct}, Avg Time/Q ${avgTimePerQuestion}s</div>
                ${previousData.map((d, i) => `
                  <div style="font-size: 16px; color: #fde68a;">${i + 1} attempt ago: Score ${d.score} ${score > d.score ? '(+' + (score - d.score) + ')' : '(-' + (d.score - score) + ')'}, Correct ${d.correct} ${correct > d.correct ? '(+' + (correct - d.correct) + ')' : '(-' + (d.correct - correct) + ')'}, Avg Time/Q ${d.avgTimePerQuestion}s ${parseFloat(avgTimePerQuestion) < parseFloat(d.avgTimePerQuestion) ? '(Faster)' : '(Slower)'}</div>
                `).join('')}
              </div>
            ` : `
              <p style="font-size: 16px; color: #fde68a; margin: 0;">This is your first attempt. Keep practicing to track your progress!</p>
            `}
          </div>

          <!-- Personalized Tips -->
          <div style="background: #27272a; padding: 25px; border-radius: 16px; border: 1px solid #3f3f46; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">
            <h2 style="font-size: 20px; font-weight: 600; margin: 0 0 20px 0; color: #d1d5db;">Personalized Tips</h2>
            ${loadingTips ? `
              <div style="display: flex; align-items: center; justify-content: center; padding: 40px;">
                <div style="font-size: 16px; color: #9ca3af;">Generating personalized tips...</div>
              </div>
            ` : allTips.length > 0 ? `
              <div style="display: grid; gap: 15px;">
                ${allTips.slice(0, 5).map((tip, idx) => `
                  <div style="display: flex; align-items: flex-start; gap: 15px; padding: 20px; background: #3f3f46; border-radius: 12px; border-left: 4px solid #a78bfa;">
                    <div style="background: #a78bfa; color: #1a1a1a; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0;">
                      ${idx + 1}
                    </div>
                    <div style="flex: 1; font-size: 15px; line-height: 1.5; color: #f3f4f6;">${tip}</div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <p style="font-size: 16px; color: #9ca3af; margin: 0; text-align: center; padding: 40px;">No tips available at this time.</p>
            `}
          </div>

          <!-- Footer -->
          <div style="position: absolute; bottom: 20mm; left: 25mm; right: 25mm; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #3f3f46; padding-top: 15px;">
            <p style="margin: 0;">Page 3 of ${Math.ceil(questions.length / 5) + 3} • Generated by Examtards • ${new Date().toLocaleDateString()}</p>
          </div>
          ${watermark}
        </div>
      `;

      pdf.addPage();
      canvas = await html2canvas(reportContainer, { 
        scale: 1, 
        useCORS: true,
        backgroundColor: '#1a1a1a'
      });
      imgData = canvas.toDataURL('image/jpeg', 0.5);
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

      toast.update(toastId, { render: 'Generating question review...' });

      // Pages 4+: Question Review (5 questions per page)
      const questionsPerPage = 5;
      const totalPages = Math.ceil(questions.length / questionsPerPage);
      
      for (let page = 0; page < totalPages; page++) {
        const startIdx = page * questionsPerPage;
        const endIdx = Math.min(startIdx + questionsPerPage, questions.length);
        const pageQuestions = questions.slice(startIdx, endIdx);
        
        reportContainer.innerHTML = `
          <div style="width: 210mm; height: 297mm; padding: 25mm; background: #1a1a1a; color: #f3f4f6; position: relative;">
            <!-- Header -->
            <div style="border-bottom: 3px solid #22d3ee; padding-bottom: 15px; margin-bottom: 25px;">
              <h1 style="font-size: 28px; font-weight: 700; margin: 0; color: #22d3ee;">Question Review</h1>
              <p style="font-size: 14px; color: #9ca3af; margin: 5px 0 0 0;">Questions ${startIdx + 1} - ${endIdx} of ${questions.length}</p>
            </div>

            <!-- Questions -->
            <div style="display: grid; gap: 20px;">
              ${pageQuestions.map(q => {
                const correctAnswerKey = decryptAnswer(q.question_no);
                const userAnswerKey = userAnswers[q.question_no];
                const correctAnswerValue = correctAnswerKey && q.options ? q.options[correctAnswerKey] : correctAnswerKey || 'Answer not available';
                const userAnswerValue = userAnswerKey && q.options ? q.options[userAnswerKey] : userAnswerKey || 'Not answered';
                const isCorrect = userAnswerKey && correctAnswerKey && (
                  q.question_type === 'mcq' 
                    ? userAnswerKey === correctAnswerKey 
                    : userAnswerKey.toLowerCase().trim().replace(/\s+/g, '') === correctAnswerKey.toLowerCase().trim().replace(/\s+/g, '')
                );
                const isFlagged = flaggedQuestions.includes(q.question_no);
                
                return `
                  <div style="background: #27272a; border-radius: 12px; border: 1px solid #3f3f46; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.3);">
                    <!-- Question Header -->
                    <div style="background: ${isCorrect ? '#052e16' : userAnswerKey ? '#450a0a' : '#27272a'}; padding: 15px; border-bottom: 1px solid #3f3f46;">
                      <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="background: ${isCorrect ? '#22c55e' : userAnswerKey ? '#ef4444' : '#6b7280'}; color: #1a1a1a; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px;">
                          ${isCorrect ? '✓' : userAnswerKey ? '✗' : '○'}
                        </div>
                        <div style="flex: 1;">
                          <div style="font-size: 16px; font-weight: 600; color: #f3f4f6; margin-bottom: 2px;">
                            Question ${q.question_no}
                            ${isFlagged ? '<span style="background: #92400e; color: #fde68a; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; margin-left: 8px;">Flagged</span>' : ''}
                          </div>
                          <div style="font-size: 14px; color: #9ca3af;">
                            ${isCorrect ? 'Correct Answer' : userAnswerKey ? 'Incorrect Answer' : 'Not Answered'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Question Content -->
                    <div style="padding: 20px;">
                      <div style="font-size: 15px; line-height: 1.6; color: #f3f4f6; margin-bottom: 20px;">
                        ${q.question}
                      </div>
                      
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div style="background: ${!userAnswerKey ? '#3f3f46' : isCorrect ? '#052e16' : '#450a0a'}; padding: 15px; border-radius: 8px; border: 1px solid ${!userAnswerKey ? '#4b5563' : isCorrect ? '#14532d' : '#7f1d1d'};">
                          <div style="font-size: 12px; color: #9ca3af; font-weight: 500; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Your Answer</div>
                          <div style="font-size: 14px; font-weight: 600; color: #f3f4f6;">${userAnswerValue}</div>
                        </div>
                        
                        <div style="background: #052e16; padding: 15px; border-radius: 8px; border: 1px solid #14532d;">
                          <div style="font-size: 12px; color: #9ca3af; font-weight: 500; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px;">Correct Answer</div>
                          <div style="font-size: 14px; font-weight: 600; color: #4ade80;">${correctAnswerValue}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Footer -->
            <div style="position: absolute; bottom: 20mm; left: 25mm; right: 25mm; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #3f3f46; padding-top: 15px;">
              <p style="margin: 0;">Page ${page + 4} of ${totalPages + 3} • Generated by Examtards • ${new Date().toLocaleDateString()}</p>
            </div>
            ${watermark}
          </div>
        `;

        pdf.addPage();
        canvas = await html2canvas(reportContainer, { 
          scale: 1, 
          useCORS: true,
          backgroundColor: '#1a1a1a',
          logging: false
        });
        imgData = canvas.toDataURL('image/jpeg', 1);
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
      }

      // Remove the temporary container
      document.body.removeChild(reportContainer);
      
      // Save the PDF
      const userName = auth?.currentUser?.displayName || 'user';
      pdf.save(`${userName}-${exam}-${paperName}-detailed-report.pdf`);
      toast.update(toastId, { render: 'Modern report exported successfully!', type: 'success', autoClose: 5000 });
      
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.update(toastId, { render: 'Failed to export report', type: 'error', autoClose: 5000 });
    } finally {
      setIsExporting(false);
    }
  };
  if (!questions || questions.length === 0) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {paperName} Summary
          </h2>
          <p className="text-destructive">Error: No questions available.</p>
        </div>
      </section>
    );
  }

  const staticTips = [
    'Practice daily to build consistency and improve overall performance.',
    'Review weak areas identified in this attempt and focus on them in your next study session.'
  ];

  const allTips = loadingTips ? [] : [...tips.slice(0, 3), ...staticTips];

  return (
    <section id="summary-report" className="py-16 px-4 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
      <div className="max-w-5xl mx-auto">
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
              {paperName} Summary
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto">
              Review your performance and analyze your results. See what you got right and where you can improve.
            </p>
          </motion.div>

          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgNjBIMFYwaDYwdjYweiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-5 z-0" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1 relative"
            >
              <Card className="h-full p-6 flex flex-col items-center justify-center overflow-hidden relative">
                <motion.div
                  className="absolute bottom-0 right-0 w-64 h-64 rounded-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.05 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
                </motion.div>

                <h3 className="text-2xl font-bold mb-4 relative">Your Score</h3>
                <div className="w-32 h-32 mb-6 relative">
                  <CircularProgressbar
                    value={percentage}
                    text={`${percentage}%`}
                    styles={buildStyles({
                      textColor: 'hsl(var(--foreground))',
                      pathColor: isPass ? 'hsl(var(--chart-2))' : 'hsl(var(--chart-1))',
                      trailColor: 'hsl(var(--muted))',
                      textSize: '20px',
                    })}
                  />
                </div>
                <p className="text-3xl font-bold mb-2 relative">
                  {score} / {maxScore}
                </p>
                <Badge
                  className={cn(
                    'text-base font-medium mb-4 py-1 px-3',
                    isPass ? 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20' : 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20'
                  )}
                >
                  {isPass ? 'Pass (≥60%)' : 'Fail (<60%)'}
                </Badge>
                <p
                  className="text-base text-muted-foreground relative"
                  data-tooltip-id="score-calc"
                  data-tooltip-content={`Score = ${correct} Correct × ${positiveMarking} − ${incorrect} Incorrect × ${negativeMarking}`}
                >
                  +{positiveMarks} (Correct) − {negativeMarks} (Incorrect) = {score} Total
                </p>
                <ReactTooltip id="score-calc" place="top" />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2 relative"
            >
              <Card className="h-full p-6 overflow-hidden relative">
                <h3 className="text-2xl font-bold mb-4">Performance Metrics</h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
                    <FiList className="text-2xl mb-2 text-foreground" />
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Total Questions</p>
                    <p className="text-2xl font-bold">{questions.length}</p>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
                    <FiCheck className="text-2xl mb-2 text-emerald-500" />
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Accuracy</p>
                    <p className="text-2xl font-bold">{accuracy}%</p>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
                    <FiClock className="text-2xl mb-2 text-foreground" />
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Time Taken</p>
                    <p className="text-2xl font-bold">{formatTime(timeTaken)}</p>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-background/50 rounded-lg border border-border">
                    <FiClock className="text-2xl mb-2 text-foreground" />
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Avg Time/Q</p>
                    <p className="text-2xl font-bold">{avgTimePerQuestion}s</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Attempted</p>
                    <p className="text-3xl font-bold text-blue-500">{attempted}</p>
                    <p className="text-xs text-muted-foreground mt-1">{attemptRate}% of total</p>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-lg">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Correct</p>
                    <p className="text-3xl font-bold text-emerald-500">{correct}</p>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-rose-500/10 dark:bg-rose-500/20 rounded-lg">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Incorrect</p>
                    <p className="text-3xl font-bold text-rose-500">{incorrect}</p>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Unanswered</p>
                    <p className="text-3xl font-bold text-muted-foreground">{unanswered}</p>
                  </div>
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 w-64 h-64 rounded-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.05 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
                </motion.div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2 relative"
            >
              <Card className="h-full p-6 overflow-hidden relative">
                <h3 className="text-2xl font-bold mb-6">Performance Overview</h3>
                <div className="w-full h-[200px] mx-auto">
                  <BarChart
                    width={500}
                    height={200}
                    data={chartData}
                    layout="vertical"
                    margin={{ left: 75, right: 30, top: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 14 }}
                      stroke="hsl(var(--muted-foreground))"
                      width={70}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </div>

                <motion.div
                  className="absolute top-1/2 right-0 w-32 h-32 rounded-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.05 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
                </motion.div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-1 relative"
            >
              <Card className="h-full p-6 overflow-hidden relative">
                <h3 className="text-2xl font-bold mb-6">Actions</h3>
                <div className="space-y-4">
                  <Button onClick={handleRetryQuiz} className="w-full justify-between group">
                    Retry Quiz
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <Button
                    onClick={() => router.push('/dashboard')}
                    className="w-full justify-between group"
                    variant="outline"
                  >
                    Dashboard
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <Button
                    onClick={handleShareScore}
                    className="w-full justify-between group"
                    variant="secondary"
                  >
                    <span className="flex items-center">
                      <FiShare2 className="mr-2" />
                      Share Score
                    </span>
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <Button
                    onClick={handleExportReport}
                    disabled={isExporting}
                    className="w-full justify-between group"
                    variant="secondary"
                  >
                    <span className="flex items-center">
                      <FiDownload className="mr-2" />
                      {isExporting ? 'Exporting...' : 'Export Report'}
                    </span>
                    <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>

                <motion.div
                  className="absolute bottom-0 right-0 w-32 h-32 rounded-full"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.05 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
                </motion.div>
              </Card>
            </motion.div>
          </div>

      <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: 0.5 }}
  className="relative mb-12"
>
  <Card className="p-6 overflow-hidden relative">
    <h3 className="text-2xl font-bold mb-4">Progress Comparison</h3>
    {previousData !== null && previousData.length > 0 ? (
      <div>
        <div className="flex justify-center mb-6 space-x-2">
          <Button
            variant={selectedMetric === "score" ? "secondary" : "outline"}
            onClick={() => setSelectedMetric("score")}
            size="sm"
          >
            Score
          </Button>
          <Button
            variant={selectedMetric === "correct" ? "secondary" : "outline"}
            onClick={() => setSelectedMetric("correct")}
            size="sm"
          >
            Correct Answers
          </Button>
          <Button
            variant={selectedMetric === "avgTimePerQuestion" ? "secondary" : "outline"}
            onClick={() => setSelectedMetric("avgTimePerQuestion")}
            size="sm"
          >
            Avg Time/Q
          </Button>
        </div>
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            {selectedMetric === "score" ? (
              <BarChart
                data={[
                  ...previousData
                    .slice()
                    .reverse()
                    .map((prev, i) => ({
                      name: `${previousData.length - i} ago`,
                      value: prev.score,
                    })),
                  {
                    name: "Current",
                    value: score,
                  },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Bar dataKey="value" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : selectedMetric === "correct" ? (
              <LineChart
                data={[
                  ...previousData
                    .slice()
                    .reverse()
                    .map((prev, i) => ({
                      name: `${previousData.length - i} ago`,
                      value: prev.correct,
                    })),
                  {
                    name: "Current",
                    value: correct,
                  },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            ) : (
              <AreaChart
                data={[
                  ...previousData
                    .slice()
                    .reverse()
                    .map((prev, i) => ({
                      name: `${previousData.length - i} ago`,
                      value: parseFloat(prev.avgTimePerQuestion),
                    })),
                  {
                    name: "Current",
                    value: parseFloat(avgTimePerQuestion),
                  },
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    color: "hsl(var(--foreground))",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0ea5e9"
                  fill="#0ea5e9"
                  fillOpacity={0.3}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    ) : (
      <p className="text-lg text-muted-foreground">
        No previous attempt found for comparison.
      </p>
    )}
  </Card>
</motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative mb-12"
          >
            <Card className="p-6 overflow-hidden relative">
              <h3 className="text-2xl font-bold mb-4">Personalized Tips</h3>
              {loadingTips ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin text-primary" size={24} />
                  <p className="ml-2 text-muted-foreground">Generating tips...</p>
                </div>
              ) : tips.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {tips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No tips available.</p>
              )}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative"
          >
            <Card className="p-6 overflow-hidden relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Question Review</h3>
                <div className="flex gap-3">
                  <Button
                    onClick={handleReviewIncorrect}
                    variant={showIncorrectOnly ? 'secondary' : 'outline'}
                    className="text-sm"
                    size="sm"
                  >
                    {showIncorrectOnly ? 'Show All' : `Incorrect Only (${incorrect})`}
                  </Button>
                  <Button onClick={handleExpandAll} variant="outline" className="text-sm" size="sm">
                    Expand All
                  </Button>
                </div>
              </div>

              <Collapsible open={true}>
                <div className="grid grid-cols-1 gap-4">
                  <AnimatePresence>
                    {questions
                      .filter((q) => {
                        if (!showIncorrectOnly) return true;
                        const userAnswer = userAnswers[q.question_no];
                        const correctAnswer = decryptAnswer(q.question_no);
                        return userAnswer && correctAnswer && userAnswer !== correctAnswer;
                      })
                      .map((q, index) => {
                        const correctAnswerKey = decryptAnswer(q.question_no);
                        const userAnswerKey = userAnswers[q.question_no];
                        const correctAnswerValue = correctAnswerKey && q.options ? q.options[correctAnswerKey] : correctAnswerKey || 'Answer not available';
                        const userAnswerValue = userAnswerKey && q.options ? q.options[userAnswerKey] : userAnswerKey || 'Not answered';
                        const isCorrect =
                          userAnswerKey &&
                          correctAnswerKey &&
                          (q.question_type === 'mcq'
                            ? userAnswerKey === correctAnswerKey
                            : userAnswerKey.toLowerCase().trim().replace(/\s+/g, '') ===
                              correctAnswerKey.toLowerCase().trim().replace(/\s+/g, ''));
                        const isFlagged = flaggedQuestions.includes(q.question_no);

                        return (
                          <motion.div
                            key={q.question_no}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                          >
                            <Card
                              className={cn(
                                'border transition-colors',
                                isCorrect ? 'hover:border-emerald-500/50' : 'hover:border-rose-500/50',
                                expandedQuestions.includes(q.question_no)
                                  ? isCorrect
                                    ? 'border-emerald-500/50'
                                    : 'border-rose-500/50'
                                  : 'border-border'
                              )}
                            >
                              <Collapsible
                                open={expandedQuestions.includes(q.question_no)}
                                onOpenChange={() => toggleQuestion(q.question_no)}
                              >
                                <CollapsibleTrigger asChild>
                                  <div className="p-4 flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={cn(
                                          'flex items-center justify-center w-8 h-8 rounded-full',
                                          isCorrect
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : userAnswerKey
                                            ? 'bg-rose-500/10 text-rose-500'
                                            : 'bg-muted text-muted-foreground'
                                        )}
                                      >
                                        {isCorrect ? <FiCheck /> : userAnswerKey ? <FiX /> : <FiCircle />}
                                      </div>
                                      <div>
                                        <p className="font-medium text-foreground">
                                          Question {q.question_no}
                                          {isFlagged && (
                                            <Badge className="ml-2 bg-amber-500/10 text-amber-500 dark:bg-amber-500/20">
                                              Flagged
                                            </Badge>
                                          )}
                                        </p>
                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                          {q.question.substring(0, 60)}...
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center">
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                                        {expandedQuestions.includes(q.question_no) ? (
                                          <FiChevronUp className="text-lg" />
                                        ) : (
                                          <FiChevronDown className="text-lg" />
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <div className="px-4 pb-4 border-t border-border pt-4">
                                    <p className="mb-4 text-foreground">{q.question}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                      <div
                                        className={cn(
                                          'p-3 rounded-lg',
                                          !userAnswerKey
                                            ? 'bg-muted/50'
                                            : isCorrect
                                            ? 'bg-emerald-500/10 dark:bg-emerald-500/20'
                                            : 'bg-rose-500/10 dark:bg-rose-500/20'
                                        )}
                                      >
                                        <p className="text-sm text-muted-foreground mb-1">Your Answer</p>
                                        <p className="font-medium">{userAnswerValue}</p>
                                      </div>

                                      <div className="p-3 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20">
                                        <p className="text-sm text-muted-foreground mb-1">Correct Answer</p>
                                        <p className="font-medium">{correctAnswerValue}</p>
                                      </div>
                                    </div>

                                    <div className="flex justify-end">
                                      <a
                                        href={`https://www.google.com/search?q=explain ${encodeURIComponent(q.question)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary underline-offset-4 hover:underline"
                                      >
                                        Explain Answer
                                      </a>
                                    </div>
                                  </div>
                                </CollapsibleContent>
                              </Collapsible>
                            </Card>
                          </motion.div>
                        );
                      })}
                  </AnimatePresence>
                </div>
              </Collapsible>

              <motion.div
                className="absolute bottom-0 left-0 w-64 h-64 rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.05 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              >
                <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
              </motion.div>
            </Card>
          </motion.div>
        </>
      </div>

      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="p-6 max-w-md w-full mx-4 bg-white dark:bg-black rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Share Your Score</h3>
            <p className="mb-4 text-gray-900 dark:text-white">
             I scored {percentage}% ({correct}/{questions.length}) on {exam ? `${exam} - ` : ''}{paperName || paper || 'this quiz'} in {formatTime(timeTaken)}.
            </p>
            <div className="flex gap-4 justify-center">
              <FacebookShareButton url={window.location.href} quote={`I scored ${percentage}% on ${paper}!`}>
                <FacebookIcon size={40} round={false} />
              </FacebookShareButton>
              <TwitterShareButton url={window.location.href} title={`I scored ${percentage}% on ${paper}!`}>
                <XIcon size={40} round={false} />
              </TwitterShareButton>
              <LinkedinShareButton
                url={window.location.href}
                title={`${paperName} Score`}
                summary={`Scored ${percentage}% in ${formatTime(timeTaken)}.`}
              >
                <LinkedinIcon size={40} round={false} />
              </LinkedinShareButton>
            </div>
            <button
              className="mt-4 w-full border border-gray-300 dark:border-gray-600 rounded py-2 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setShowShareModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default SummaryScreen;