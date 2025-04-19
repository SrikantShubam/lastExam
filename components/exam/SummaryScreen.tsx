// import { Button } from "@/components/ui/button";

// const SummaryScreen = ({
//   questions,
//   userAnswers,
//   flaggedQuestions,
//   totalQuestions,
//   positiveMarking,
//   negativeMarking,
//   onBack,
//   decryptAnswer,
// }) => {
//   const calculateScore = () => {
//     let score = 0;
//     questions.forEach((q) => {
//       const userAnswer = userAnswers[q.question_no];
//       const correctAnswer = decryptAnswer(q.question_no);
//       console.log(`Question ${q.question_no}:`, { userAnswer, correctAnswer });
//       if (!correctAnswer) return;

//       if (q.question_type === "mcq") {
//         if (userAnswer && userAnswer === correctAnswer) {
//           score += positiveMarking;
//         } else if (userAnswer) {
//           score -= negativeMarking;
//         }
//       } else if (q.question_type === "fill-in-the-blanks") {
//         if (userAnswer) {
//           const user = userAnswer.toLowerCase().trim().replace(/\s+/g, "");
//           const correct = correctAnswer.toLowerCase().trim().replace(/\s+/g, "");
//           if (user === correct) {
//             score += positiveMarking;
//           } else {
//             score -= negativeMarking;
//           }
//         }
//       }
//     });
//     return score;
//   };

//   const score = calculateScore();

//   return (
//     <section className="py-12 px-6 md:px-12 lg:px-24 bg-background text-foreground min-h-screen">
//       <h1 className="text-3xl font-bold mb-4 text-center">Submission Summary</h1>
//       <p className="text-center text-muted-foreground mb-6">
//         Total Score: {score} / {totalQuestions * positiveMarking}
//       </p>
//       <div className="max-w-3xl mx-auto">
//         {questions.map((q, index) => {
//           const correctAnswerKey = decryptAnswer(q.question_no);
//           const userAnswerKey = userAnswers[q.question_no];
//           const correctAnswerValue = correctAnswerKey ? q.options?.[correctAnswerKey] : null;
//           const userAnswerValue = userAnswerKey ? q.options?.[userAnswerKey] : null;

//           return (
//             <div
//               key={q.question_no}
//               className={`mb-4 p-4 border rounded ${
//                 flaggedQuestions.includes(q.question_no) ? "border-yellow-500" : ""
//               }`}
//             >
//               <p className="font-semibold">
//                 Q{q.question_no}. {q.question}
//               </p>
//               <p>Your Answer: {userAnswerValue || "Not answered"}</p>
//               <p>Correct Answer: {correctAnswerValue || "Error displaying answer"}</p>
//               <p
//                 className={
//                   userAnswerKey &&
//                   correctAnswerKey &&
//                   (q.question_type === "mcq"
//                     ? userAnswerKey === correctAnswerKey
//                     : userAnswerKey.toLowerCase().trim().replace(/\s+/g, "") ===
//                       correctAnswerKey.toLowerCase().trim().replace(/\s+/g, ""))
//                     ? "text-green-600"
//                     : "text-red-600"
//                 }
//               >
//                 {userAnswerKey &&
//                 correctAnswerKey &&
//                 (q.question_type === "mcq"
//                   ? userAnswerKey === correctAnswerKey
//                   : userAnswerKey.toLowerCase().trim().replace(/\s+/g, "") ===
//                     correctAnswerKey.toLowerCase().trim().replace(/\InvisibleSpace+/g, ""))
//                   ? "Correct"
//                   : "Incorrect"}
//               </p>
//             </div>
//           );
//         })}
//       </div>
//       <div className="flex justify-center mt-6">
//         <Button
//           onClick={onBack}
//           className="bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
//         >
//           Back to Papers
//         </Button>
//       </div>
//     </section>
//   );
// };

// export default SummaryScreen;























































































'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FiCheck, FiX, FiCopy, FiClock, FiList, FiChevronDown, FiChevronUp, FiCircle, FiArrowRight } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';

const SummaryScreen = ({
  questions,
  userAnswers,
  flaggedQuestions,
  totalQuestions,
  positiveMarking,
  negativeMarking,
  timeTaken,
  paperName,
  onBack,
  decryptAnswer,
}) => {
  const router = useRouter();
  const [expandedQuestions, setExpandedQuestions] = useState([]);
  const [showIncorrectOnly, setShowIncorrectOnly] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false);
 
  const calculateMetrics = () => {
    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;
    let positiveMarks = 0;
    let negativeMarks = 0;

    questions.forEach((q) => {
      const userAnswer = userAnswers[q.question_no];
      const correctAnswer = decryptAnswer(q.question_no);

      if (!correctAnswer) {
        unanswered += 1;
        return;
      }

      if (q.question_type === 'mcq') {
        if (!q.options || !Object.keys(q.options).length) {
          unanswered += 1;
          return;
        }
        if (userAnswer && userAnswer === correctAnswer) {
          score += positiveMarking;
          positiveMarks += positiveMarking;
          correct += 1;
        } else if (userAnswer) {
          score -= negativeMarking;
          negativeMarks += negativeMarking;
          incorrect += 1;
        } else {
          unanswered += 1;
        }
      } else if (q.question_type === 'fill-in-the-blanks') {
        if (userAnswer) {
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
        } else {
          unanswered += 1;
        }
      } else {
        unanswered += 1;
      }
    });

    const maxScore = totalQuestions * positiveMarking;
    const accuracy = totalQuestions > 0 ? ((correct / totalQuestions) * 100).toFixed(1) : 0;
    const avgTimePerQuestion = totalQuestions > 0 ? (timeTaken / totalQuestions).toFixed(1) : 0;

    return { score, maxScore, positiveMarks, negativeMarks, correct, incorrect, unanswered, accuracy, avgTimePerQuestion };
  };

  const { score, maxScore, positiveMarks, negativeMarks, correct, incorrect, unanswered, accuracy, avgTimePerQuestion } =
    calculateMetrics();
  const percentage = maxScore > 0 ? ((score / maxScore) * 100).toFixed(1) : 0;
  const isPass = percentage >= 60;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  const toggleQuestion = (questionNo) => {
    setExpandedQuestions((prev) =>
      prev.includes(questionNo) ? prev.filter((no) => no !== questionNo) : [...prev, questionNo]
    );
  };

  const handleExpandAll = () => {
    setShowIncorrectOnly(false);
    setExpandedQuestions(questions.map((q) => q.question_no));
  };

  const handleReviewIncorrect = () => {
    setShowIncorrectOnly(!showIncorrectOnly);
    setExpandedQuestions([]);
  };

  const handleRetryQuiz = () => {
    const { exam, subject, paper, mode } = router.query;
    localStorage.removeItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`);
    localStorage.removeItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`);
    localStorage.removeItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
    localStorage.removeItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`);
    router.push(`/${exam}/${subject}/${paper}?mode=${mode}`);
  };

  const handleShareScore = () => {
    const text = `I scored ${percentage}% (${correct}/${totalQuestions}) on ${paperName} in ${formatTime(timeTaken)}.`;
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Score copied to clipboard!', { autoClose: 2000 });
    });
  };

  const chartData = [
    { name: 'Correct', value: correct, fill: '#22d3ee' },
    { name: 'Incorrect', value: incorrect, fill: '#a855f7' },
    { name: 'Unanswered', value: unanswered, fill: '#6b7280' },
  ];

  if (!questions || questions.length === 0) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Submission Summary
          </h2>
          <p className="text-destructive">Error: No questions available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background text-foreground min-h-screen">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
            Submission Summary
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Review your performance and analyze your results. See what you got right and where you can improve.
          </p>
        </motion.div>
        
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgNjBIMFYwaDYwdjYweiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')] opacity-5 z-0" />
        </div>

        {/* Bento-Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Score Card */}
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
                transition={{ duration: 1.5, ease: "easeOut" }}
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

          {/* Performance Metrics */}
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
                  <p className="text-2xl font-bold">{totalQuestions}</p>
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
              
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-3 bg-emerald-500/10 rounded-lg">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Correct</p>
                  <p className="text-3xl font-bold text-emerald-500">{correct}</p>
                </div>
                
                <div className="flex flex-col items-center p-3 bg-rose-500/10 rounded-lg">
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
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
              </motion.div>
            </Card>
          </motion.div>

          {/* Bar Chart */}
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
                      color: 'hsl(var(--foreground))'
                    }} 
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                </BarChart>
              </div>
              
              <motion.div 
                className="absolute top-1/2 right-0 w-32 h-32 rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.05 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
              </motion.div>
            </Card>
          </motion.div>

          {/* Action Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-1 relative"
          >
            <Card className="h-full p-6 overflow-hidden relative">
              <h3 className="text-2xl font-bold mb-6">Actions</h3>
              <div className="space-y-4">
                <Button 
                  onClick={handleRetryQuiz}
                  className="w-full justify-between group"
                >
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
                    <FiCopy className="mr-2" /> 
                    Share Score
                  </span>
                  <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
              
              <motion.div 
                className="absolute bottom-0 right-0 w-32 h-32 rounded-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.05 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
              </motion.div>
            </Card>
          </motion.div>
        </div>

        {/* Question Review Section */}
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
                  variant={showIncorrectOnly ? "secondary" : "outline"}
                  className="text-sm"
                  size="sm"
                >
                  {showIncorrectOnly ? "Show All" : `Incorrect Only (${incorrect})`}
                </Button>
                <Button 
                  onClick={handleExpandAll}
                  variant="outline"
                  className="text-sm"
                  size="sm"
                >
                  Expand All
                </Button>
              </div>
            </div>
            
            <Collapsible open={true}>
              <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                  {questions
                    .filter((q) => !showIncorrectOnly || userAnswers[q.question_no] !== decryptAnswer(q.question_no))
                    .map((q, index) => {
                      const correctAnswerKey = decryptAnswer(q.question_no);
                      const userAnswerKey = userAnswers[q.question_no];
                      const correctAnswerValue = correctAnswerKey && q.options ? q.options[correctAnswerKey] : correctAnswerKey;
                      const userAnswerValue = userAnswerKey && q.options ? q.options[userAnswerKey] : userAnswerKey;
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
                              "border transition-colors",
                              isCorrect 
                                ? "hover:border-emerald-500/50" 
                                : "hover:border-rose-500/50",
                              expandedQuestions.includes(q.question_no)
                                ? isCorrect ? "border-emerald-500/50" : "border-rose-500/50"
                                : "border-border"
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
                                        "flex items-center justify-center w-8 h-8 rounded-full",
                                        isCorrect 
                                          ? "bg-emerald-500/10 text-emerald-500" 
                                          : "bg-rose-500/10 text-rose-500"
                                      )}
                                    >
                                      {isCorrect ? <FiCheck /> : <FiX />}
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
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 w-8 p-0 rounded-full"
                                    >
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
                                    <div className={cn(
                                      "p-3 rounded-lg",
                                      !userAnswerValue 
                                        ? "bg-muted/50" 
                                        : isCorrect 
                                          ? "bg-emerald-500/10" 
                                          : "bg-rose-500/10"
                                    )}>
                                      <p className="text-sm text-muted-foreground mb-1">
                                        Your Answer
                                      </p>
                                      <p className="font-medium">
                                        {userAnswerValue || 'Not answered'}
                                      </p>
                                    </div>
                                    
                                    <div className="p-3 rounded-lg bg-emerald-500/10">
                                      <p className="text-sm text-muted-foreground mb-1">
                                        Correct Answer
                                      </p>
                                      <p className="font-medium">
                                        {correctAnswerValue || 'Error'}
                                      </p>
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
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <div className="w-full h-full bg-gradient-to-t from-foreground to-transparent rounded-full blur-3xl" />
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default SummaryScreen;