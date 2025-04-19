// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../../../lib/firebase";
// import Layout from "../../../../components/Layout";
// import CryptoJS from "crypto-js";
// import StartScreen from "../../../../components/exam/StartScreen";
// import AdPrompt from "../../../../components/exam/AdPrompt";
// import ExamScreen from "../../../../components/exam/ExamScreen";
// import SummaryScreen from "../../../../components/exam/SummaryScreen";
// import { formatTime } from "../../../../utils/formatTime";
// const ENCRYPTION_KEY=process.env.NEXT_PUBLIC_ENCRYPTION_KEY

// export default function PaperPage() {
//   const router = useRouter();
//   const { exam, subject, paper, mode = "exam" } = router.query;
//   const [paperData, setPaperData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [examStarted, setExamStarted] = useState(false);
//   const [hasPreviousAttempt, setHasPreviousAttempt] = useState(false);
//   const [showAdPrompt, setShowAdPrompt] = useState(false);
//   const [isNewAttempt, setIsNewAttempt] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [flaggedQuestions, setFlaggedQuestions] = useState([]);
//   const [showSummary, setShowSummary] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [showNavigator, setShowNavigator] = useState(true);

//   // Load user progress from localStorage (run only once on mount)
//   useEffect(() => {
//     if (!exam || !subject || !paper || !mode) return;

//     const savedAnswers = localStorage.getItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`);
//     const savedFlagged = localStorage.getItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`);
//     const savedStartTime = localStorage.getItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
//     const savedIndex = localStorage.getItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`);

//     if (savedAnswers || savedFlagged || savedStartTime) {
//       setHasPreviousAttempt(true);
//       if (savedAnswers) setUserAnswers(JSON.parse(savedAnswers));
//       if (savedFlagged) setFlaggedQuestions(JSON.parse(savedFlagged));
//       if (savedIndex) setCurrentQuestionIndex(parseInt(savedIndex, 10));
//     }
//   }, [exam, subject, paper, mode]);

//   // Save user progress to localStorage
//   useEffect(() => {
//     if (!exam || !subject || !paper || !mode) return;

//     const handler = setTimeout(() => {
//       localStorage.setItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`, JSON.stringify(userAnswers));
//       localStorage.setItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`, JSON.stringify(flaggedQuestions));
//       localStorage.setItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`, currentQuestionIndex.toString());
//     }, 500);

//     return () => clearTimeout(handler);
//   }, [userAnswers, flaggedQuestions, currentQuestionIndex, exam, subject, paper, mode]);

//   // Fetch paper data and encrypt answers locally
//   useEffect(() => {
//     if (!exam || !subject || !paper || !mode) return;

//     const fetchPaperContent = async () => {
//       setLoading(true);
//       try {
//         const collectionPath = mode === "quiz" ? "quizzes" : "exams";
//         const paperDocRef = doc(db, `${collectionPath}/${exam}/${subject}/${paper}`);
//         const paperDoc = await getDoc(paperDocRef);
//         if (paperDoc.exists()) {
//           const data = paperDoc.data();
//           // Encrypt answers locally and store in localStorage
//           if (data.questions) {
//             data.questions.forEach((q) => {
//               if (q.answer) {
//                 const encryptedAnswer = CryptoJS.AES.encrypt(q.answer, ENCRYPTION_KEY).toString();
//                 localStorage.setItem(`encryptedAnswer-${mode}-${exam}-${subject}-${paper}-${q.question_no}`, encryptedAnswer);
//               }
//             });
//           }
//           setPaperData(data);
//         } else {
//           console.error("Paper not found");
//         }
//       } catch (error) {
//         console.error("Error fetching paper:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPaperContent();
//   }, [exam, subject, paper, mode]);

//   // Timer countdown
//   useEffect(() => {
//     if (!examStarted || timeLeft === null || showSummary) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 0) {
//           clearInterval(timer);
//           setShowSummary(true);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, showSummary, examStarted]);

//   // Initialize timer when exam starts
//   const startExam = (isNewAttempt = false) => {
//     setIsNewAttempt(isNewAttempt);
//     setShowAdPrompt(true);
//   };

//   // Proceed after ad prompt
//   const proceedAfterAd = () => {
//     setShowAdPrompt(false);
//     setExamStarted(true);

//     const savedStartTime = localStorage.getItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
//     if (!isNewAttempt && savedStartTime) {
//       const startTime = new Date(savedStartTime).getTime();
//       const now = new Date().getTime();
//       const elapsed = Math.floor((now - startTime) / 1000);
//       const totalTime = paperData?.total_time || (mode === "quiz" ? "20 minutes" : "2 hours");
//       const totalSeconds = mode === "quiz" ? 20 * 60 : parseInt(totalTime.split(" ")[0], 10) * 3600;
//       const remaining = totalSeconds - elapsed;
//       console.log("ProceedAfterAd - Continue:", { savedStartTime, elapsed, totalSeconds, remaining });
//       if (remaining > 0) {
//         setTimeLeft(remaining);
//       } else {
//         setShowSummary(true);
//       }
//     } else {
//       const totalTime = paperData?.total_time || (mode === "quiz" ? "20 minutes" : "2 hours");
//       const totalSeconds = mode === "quiz" ? 20 * 60 : parseInt(totalTime.split(" ")[0], 10) * 3600;
//       setTimeLeft(totalSeconds);
//       localStorage.setItem(`startTime-${mode}-${exam}-${subject}-${paper}`, new Date().toISOString());
//       console.log("ProceedAfterAd - New Attempt:", { totalTime, totalSeconds });
//     }
//   };

//   // Handle answer selection
//   const handleAnswerChange = (value) => {
//     setUserAnswers((prev) => ({
//       ...prev,
//       [currentQuestionIndex + 1]: value,
//     }));
//   };

//   // Handle flagging
//   const handleToggleFlag = () => {
//     const questionNo = currentQuestionIndex + 1;
//     setFlaggedQuestions((prev) =>
//       prev.includes(questionNo)
//         ? prev.filter((q) => q !== questionNo)
//         : [...prev, questionNo].sort((a, b) => a - b)
//     );
//   };

//   // Navigation
//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < totalQuestions - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       setShowSummary(true);
//     }
//   };

//   // Jump to a question
//   const handleJumpToQuestion = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   // Toggle navigator
//   const handleToggleNavigator = () => {
//     setShowNavigator(!showNavigator);
//   };

//   // Decrypt answers for summary
//   const decryptAnswer = (questionNo) => {
//     const encryptedAnswer = localStorage.getItem(`encryptedAnswer-${mode}-${exam}-${subject}-${paper}-${questionNo}`);
//     if (!encryptedAnswer) {
//       console.error(`No encrypted answer found for question ${questionNo}`);
//       return null;
//     }
//     try {
//       const bytes = CryptoJS.AES.decrypt(encryptedAnswer, ENCRYPTION_KEY);
//       const decrypted = bytes.toString(CryptoJS.enc.Utf8);
//       if (!decrypted) {
//         console.error(`Decryption failed for question ${questionNo}`);
//         return null;
//       }
//       return decrypted;
//     } catch (error) {
//       console.error(`Error decrypting answer for question ${questionNo}:`, error);
//       return null;
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="text-center text-lg text-muted-foreground py-12">
//           Loading...
//         </div>
//       </Layout>
//     );
//   }

//   if (!paperData) {
//     return (
//       <Layout>
//         <div className="text-center text-lg text-muted-foreground py-12">
//           Paper not found.
//         </div>
//       </Layout>
//     );
//   }

//   const totalQuestions = paperData.total_questions || 0;
//   const questions = paperData.questions || [];

//   return (
//     <Layout>
//       {!examStarted && (
//         <StartScreen
//           paperData={paperData}
//           hasPreviousAttempt={hasPreviousAttempt}
//           onStartExam={startExam}
//         />
//       )}
//       {showAdPrompt && (
//         <AdPrompt
//           paperName={paperData.paper_name}
//           onProceed={proceedAfterAd}
//           adType="video"
//           videoUrl="https://www.youtube.com/watch?v=NuI2u_9it4o"
//         />
//       )}
//       {examStarted && !showSummary && (
//         <ExamScreen
//           paperData={paperData}
//           currentQuestionIndex={currentQuestionIndex}
//           userAnswers={userAnswers}
//           flaggedQuestions={flaggedQuestions}
//           timeLeft={timeLeft}
//           showNavigator={showNavigator}
//           formatTime={formatTime}
//           onAnswerChange={handleAnswerChange}
//           onToggleFlag={handleToggleFlag}
//           onPrevious={handlePrevious}
//           onNext={handleNext}
//           onJumpToQuestion={handleJumpToQuestion}
//           onToggleNavigator={handleToggleNavigator}
//         />
//       )}
//       {showSummary && (
//         <SummaryScreen
//           questions={questions}
//           userAnswers={userAnswers}
//           flaggedQuestions={flaggedQuestions}
//           totalQuestions={totalQuestions}
//           positiveMarking={paperData.positive_marking || 1}
//           negativeMarking={paperData.negative_marking || 0.25}
//           onBack={() => router.back()}
//           decryptAnswer={decryptAnswer}
//         />
//       )}
//     </Layout>
//   );
// }

















// 'use client';

// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../../../lib/firebase";
// import Layout from "../../../../components/Layout";
// import CryptoJS from "crypto-js";
// import StartScreen from "../../../../components/exam/StartScreen";
// import AdPrompt from "../../../../components/exam/AdPrompt";
// import ExamScreen from "../../../../components/exam/ExamScreen";
// import SummaryScreen from "../../../../components/exam/SummaryScreen";
// import { formatTime } from "../../../../utils/formatTime";
// import { toast } from "react-toastify";

// const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secret-key-here';

// export default function PaperPage() {
//   const router = useRouter();
//   const { exam, subject, paper, mode = "exam" } = router.query;
//   const [paperData, setPaperData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [examStarted, setExamStarted] = useState(false);
//   const [hasPreviousAttempt, setHasPreviousAttempt] = useState(false);
//   const [showAdPrompt, setShowAdPrompt] = useState(false);
//   const [isNewAttempt, setIsNewAttempt] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [flaggedQuestions, setFlaggedQuestions] = useState([]);
//   const [showSummary, setShowSummary] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [showNavigator, setShowNavigator] = useState(true);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);

//   // Load user progress from localStorage (run only once on mount)
//   useEffect(() => {
//     if (!exam || !subject || !paper || !mode) return;

//     const savedAnswers = localStorage.getItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`);
//     const savedFlagged = localStorage.getItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`);
//     const savedStartTime = localStorage.getItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
//     const savedIndex = localStorage.getItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`);

//     if (savedAnswers || savedFlagged || savedStartTime) {
//       setHasPreviousAttempt(true);
//       if (savedAnswers) setUserAnswers(JSON.parse(savedAnswers));
//       if (savedFlagged) setFlaggedQuestions(JSON.parse(savedFlagged));
//       if (savedIndex) setCurrentQuestionIndex(parseInt(savedIndex, 10));
//     }
//   }, [exam, subject, paper, mode]);

//   // Save user progress to localStorage
//   useEffect(() => {
//     if (!exam || !subject || !paper || !mode) return;

//     const handler = setTimeout(() => {
//       localStorage.setItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`, JSON.stringify(userAnswers));
//       localStorage.setItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`, JSON.stringify(flaggedQuestions));
//       localStorage.setItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`, currentQuestionIndex.toString());
//     }, 500);

//     return () => clearTimeout(handler);
//   }, [userAnswers, flaggedQuestions, currentQuestionIndex, exam, subject, paper, mode]);
//   useEffect(() => {
//     toast.success("Test toast!");
//   }, []);
//   // Fetch paper data and encrypt answers locally
//   useEffect(() => {
//     if (!exam || !subject || !paper || !mode) return;

//     const fetchPaperContent = async () => {
//       setLoading(true);
//       try {
//         const collectionPath = mode === "quiz" ? "quizzes" : "exams";
//         const paperDocRef = doc(db, `${collectionPath}/${exam}/${subject}/${paper}`);
//         const paperDoc = await getDoc(paperDocRef);
//         if (paperDoc.exists()) {
//           const data = paperDoc.data();
//           if (data.questions) {
//             data.questions.forEach((q) => {
//               if (q.answer) {
//                 const encryptedAnswer = CryptoJS.AES.encrypt(q.answer, ENCRYPTION_KEY).toString();
//                 localStorage.setItem(`encryptedAnswer-${mode}-${exam}-${subject}-${paper}-${q.question_no}`, encryptedAnswer);
//               }
//             });
//           }
//           setPaperData(data);
//         } else {
//           console.error("Paper not found");
//         }
//       } catch (error) {
//         console.error("Error fetching paper:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPaperContent();
//   }, [exam, subject, paper, mode]);

//   // Timer countdown
//   useEffect(() => {
//     if (!examStarted || timeLeft === null || showSummary) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 0) {
//           clearInterval(timer);
//           setShowSummary(true);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, showSummary, examStarted]);

//   // Initialize timer when exam starts
//   const startExam = (isNewAttempt = false) => {
//     setIsNewAttempt(isNewAttempt);
//     setShowAdPrompt(true);
//   };

//   // Proceed after ad prompt
//   const proceedAfterAd = () => {
//     setShowAdPrompt(false);
//     setExamStarted(true);

//     const savedStartTime = localStorage.getItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
//     if (!isNewAttempt && savedStartTime) {
//       const startTime = new Date(savedStartTime).getTime();
//       const now = new Date().getTime();
//       const elapsed = Math.floor((now - startTime) / 1000);
//       const totalTime = paperData?.total_time || (mode === "quiz" ? "20 minutes" : "2 hours");
//       const totalSeconds = mode === "quiz" ? 20 * 60 : parseInt(totalTime.split(" ")[0], 10) * 3600;
//       const remaining = totalSeconds - elapsed;
//       if (remaining > 0) {
//         setTimeLeft(remaining);
//       } else {
//         setShowSummary(true);
//       }
//     } else {
//       const totalTime = paperData?.total_time || (mode === "quiz" ? "20 minutes" : "2 hours");
//       const totalSeconds = mode === "quiz" ? 20 * 60 : parseInt(totalTime.split(" ")[0], 10) * 3600;
//       setTimeLeft(totalSeconds);
//       localStorage.setItem(`startTime-${mode}-${exam}-${subject}-${paper}`, new Date().toISOString());
//     }
//   };

//   // Handle answer selection
//   const handleAnswerChange = (value) => {
//     setUserAnswers((prev) => ({
//       ...prev,
//       [currentQuestionIndex + 1]: value,
//     }));
//   };

//   // Handle flagging
//   const handleToggleFlag = () => {
//     const questionNo = currentQuestionIndex + 1;
//     setFlaggedQuestions((prev) =>
//       prev.includes(questionNo)
//         ? prev.filter((q) => q !== questionNo)
//         : [...prev, questionNo].sort((a, b) => a - b)
//     );
//   };

//   // Navigation
//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < totalQuestions - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       if (flaggedQuestions.length > 0) {
//         setShowConfirmDialog(true);
//       } else {
//         setShowSummary(true);
//         toast.success("Exam submitted successfully!", { autoClose: 2000 });
//       }
//     }
//   };

//   // Handle finish exam
//   const handleFinishExam = () => {
//     if (flaggedQuestions.length > 0) {
//       setShowConfirmDialog(true);
//     } else {
//       setShowSummary(true);
//       toast.success("Exam submitted successfully!", { autoClose: 2000 });
//     }
//   };

//   // Handle submission confirmation
//   const handleConfirmSubmit = () => {
//     setShowConfirmDialog(false);
//     setShowSummary(true);
//     toast.success("Exam submitted successfully!", { autoClose: 2000 });
//   };

//   // Handle return to flagged questions
//   const handleReturnToFlagged = () => {
//     setShowConfirmDialog(false);
//     if (flaggedQuestions.length > 0) {
//       const unansweredFlagged = flaggedQuestions.find((q) => !userAnswers[q]);
//       const targetQuestion = unansweredFlagged || flaggedQuestions[0];
//       setCurrentQuestionIndex(targetQuestion - 1);
//     }
//   };

//   // Jump to a question
//   const handleJumpToQuestion = (index) => {
//     setCurrentQuestionIndex(index);
//   };

//   // Toggle navigator
//   const handleToggleNavigator = () => {
//     setShowNavigator(!showNavigator);
//   };

//   // Decrypt answers for summary
//   const decryptAnswer = (questionNo) => {
//     const encryptedAnswer = localStorage.getItem(`encryptedAnswer-${mode}-${exam}-${subject}-${paper}-${questionNo}`);
//     if (!encryptedAnswer) {
//       console.error(`No encrypted answer found for question ${questionNo}`);
//       return null;
//     }
//     try {
//       const bytes = CryptoJS.AES.decrypt(encryptedAnswer, ENCRYPTION_KEY);
//       const decrypted = bytes.toString(CryptoJS.enc.Utf8);
//       if (!decrypted) {
//         console.error(`Decryption failed for question ${questionNo}`);
//         return null;
//       }
//       return decrypted;
//     } catch (error) {
//       console.error(`Error decrypting answer for question ${questionNo}:`, error);
//       return null;
//     }
//   };

//   if (loading) {
//     return (
//       <Layout>
//         <div className="text-center text-lg text-muted-foreground py-12">
//           Loading...
//         </div>
//       </Layout>
//     );
//   }

//   if (!paperData) {
//     return (
//       <Layout>
//         <div className="text-center text-lg text-muted-foreground py-12">
//           Paper not found.
//         </div>
//       </Layout>
//     );
//   }

//   const totalQuestions = paperData.total_questions || 0;
//   const questions = paperData.questions || [];

//   return (
//     <Layout>
//       {!examStarted && (
//         <StartScreen
//           paperData={paperData}
//           hasPreviousAttempt={hasPreviousAttempt}
//           onStartExam={startExam}
//         />
//       )}
//       {showAdPrompt && (
//         <AdPrompt
//           paperName={paperData.paper_name}
//           onProceed={proceedAfterAd}
//           adType="video"
//           videoUrl="https://www.youtube.com/watch?v=NuI2u_9it4o"
//         />
//       )}
//       {examStarted && !showSummary && !showConfirmDialog && (
//         <ExamScreen
//           paperData={paperData}
//           currentQuestionIndex={currentQuestionIndex}
//           userAnswers={userAnswers}
//           flaggedQuestions={flaggedQuestions}
//           timeLeft={timeLeft}
//           showNavigator={showNavigator}
//           formatTime={formatTime}
//           onAnswerChange={handleAnswerChange}
//           onToggleFlag={handleToggleFlag}
//           onPrevious={handlePrevious}
//           onNext={handleNext}
//           onJumpToQuestion={handleJumpToQuestion}
//           onToggleNavigator={handleToggleNavigator}
//           onFinishExam={handleFinishExam}
//         />
//       )}
//       {showConfirmDialog && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="dialog-title"
//         >
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
//             <h2 id="dialog-title" className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//               Flagged Questions Detected
//             </h2>
//             <p className="text-gray-700 dark:text-gray-300 mb-6">
//               You have {flaggedQuestions.length} flagged question(s): Q{flaggedQuestions.join(", Q")}. Would you like to review them before submitting?
//             </p>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={handleReturnToFlagged}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
//                 aria-label="Review flagged questions"
//               >
//                 Review Flagged
//               </button>
//               <button
//                 onClick={handleConfirmSubmit}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
//                 aria-label="Submit exam now"
//               >
//                 Submit Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showSummary && (
//         <SummaryScreen
//           questions={questions}
//           userAnswers={userAnswers}
//           flaggedQuestions={flaggedQuestions}
//           totalQuestions={totalQuestions}
//           positiveMarking={paperData.positive_marking || 1}
//           negativeMarking={paperData.negative_marking || 0.25}
//           onBack={() => router.back()}
//           decryptAnswer={decryptAnswer}
//         />
//       )}
//     </Layout>
//   );
// }
















































'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import Layout from "../../../../components/Layout";
import CryptoJS from "crypto-js";
import StartScreen from "../../../../components/exam/StartScreen";
import AdPrompt from "../../../../components/exam/AdPrompt";
import ExamScreen from "../../../../components/exam/ExamScreen";
import SummaryScreen from "../../../../components/exam/SummaryScreen";
import { formatTime } from "../../../../utils/formatTime";
import { toast } from "react-toastify";

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'your-secret-key-here';

export default function PaperPage() {
  const router = useRouter();
  const { exam, subject, paper, mode = "exam" } = router.query;
  const [paperData, setPaperData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [examStarted, setExamStarted] = useState(false);
  const [hasPreviousAttempt, setHasPreviousAttempt] = useState(false);
  const [showAdPrompt, setShowAdPrompt] = useState(false);
  const [isNewAttempt, setIsNewAttempt] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showNavigator, setShowNavigator] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Debug paperData
  useEffect(() => {
    if (paperData) {
      console.log("PaperData:", paperData);
      console.log("Questions:", paperData.questions);
    }
  }, [paperData]);

  // Load user progress from localStorage (run only once on mount)
  useEffect(() => {
    if (!exam || !subject || !paper || !mode) return;

    const savedAnswers = localStorage.getItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`);
    const savedFlagged = localStorage.getItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`);
    const savedStartTime = localStorage.getItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
    const savedIndex = localStorage.getItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`);

    if (savedAnswers || savedFlagged || savedStartTime) {
      setHasPreviousAttempt(true);
      if (savedAnswers) setUserAnswers(JSON.parse(savedAnswers));
      if (savedFlagged) setFlaggedQuestions(JSON.parse(savedFlagged));
      if (savedIndex) setCurrentQuestionIndex(parseInt(savedIndex, 10));
    }
  }, [exam, subject, paper, mode]);

  // Save user progress to localStorage
  useEffect(() => {
    if (!exam || !subject || !paper || !mode) return;

    const handler = setTimeout(() => {
      localStorage.setItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`, JSON.stringify(userAnswers));
      localStorage.setItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`, JSON.stringify(flaggedQuestions));
      localStorage.setItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`, currentQuestionIndex.toString());
    }, 500);

    return () => clearTimeout(handler);
  }, [userAnswers, flaggedQuestions, currentQuestionIndex, exam, subject, paper, mode]);

  // Fetch paper data and encrypt answers locally
  useEffect(() => {
    if (!exam || !subject || !paper || !mode) return;

    const fetchPaperContent = async () => {
      setLoading(true);
      try {
        const collectionPath = mode === "quiz" ? "quizzes" : "exams";
        const paperDocRef = doc(db, `${collectionPath}/${exam}/${subject}/${paper}`);
        const paperDoc = await getDoc(paperDocRef);
        if (paperDoc.exists()) {
          const data = paperDoc.data();
          if (data.questions) {
            data.questions.forEach((q) => {
              if (q.answer) {
                const encryptedAnswer = CryptoJS.AES.encrypt(q.answer, ENCRYPTION_KEY).toString();
                localStorage.setItem(`encryptedAnswer-${mode}-${exam}-${subject}-${paper}-${q.question_no}`, encryptedAnswer);
              }
            });
          }
          setPaperData(data);
        } else {
          console.error("Paper not found");
        }
      } catch (error) {
        console.error("Error fetching paper:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPaperContent();
  }, [exam, subject, paper, mode]);

  // Timer countdown
  useEffect(() => {
    if (!examStarted || timeLeft === null || showSummary) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          setShowSummary(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showSummary, examStarted]);

  // Initialize timer when exam starts
  const startExam = (isNewAttempt = false) => {
    setIsNewAttempt(isNewAttempt);
    setShowAdPrompt(true);
  };

  // Proceed after ad prompt
  const proceedAfterAd = () => {
    setShowAdPrompt(false);
    setExamStarted(true);

    const savedStartTime = localStorage.getItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
    if (!isNewAttempt && savedStartTime) {
      const startTime = new Date(savedStartTime).getTime();
      const now = new Date().getTime();
      const elapsed = Math.floor((now - startTime) / 1000);
      const totalTime = paperData?.total_time || (mode === "quiz" ? "20 minutes" : "2 hours");
      const totalSeconds = mode === "quiz" ? 20 * 60 : parseInt(totalTime.split(" ")[0], 10) * 3600;
      const remaining = totalSeconds - elapsed;
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        setShowSummary(true);
      }
    } else {
      const totalTime = paperData?.total_time || (mode === "quiz" ? "20 minutes" : "2 hours");
      const totalSeconds = mode === "quiz" ? 20 * 60 : parseInt(totalTime.split(" ")[0], 10) * 3600;
      setTimeLeft(totalSeconds);
      localStorage.setItem(`startTime-${mode}-${exam}-${subject}-${paper}`, new Date().toISOString());
    }
  };

  // Handle answer selection
  const handleAnswerChange = (value) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex + 1]: value,
    }));
  };

  // Handle flagging
  const handleToggleFlag = () => {
    const questionNo = currentQuestionIndex + 1;
    setFlaggedQuestions((prev) =>
      prev.includes(questionNo)
        ? prev.filter((q) => q !== questionNo)
        : [...prev, questionNo].sort((a, b) => a - b)
    );
  };

  // Navigation
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (flaggedQuestions.length > 0) {
        setShowConfirmDialog(true);
      } else {
        setShowSummary(true);
        toast.success("Exam submitted successfully!", { autoClose: 2000 });
      }
    }
  };

  // Handle finish exam
  const handleFinishExam = () => {
    if (flaggedQuestions.length > 0) {
      setShowConfirmDialog(true);
    } else {
      setShowSummary(true);
      toast.success("Exam submitted successfully!", { autoClose: 2000 });
    }
  };

  // Handle submission confirmation
  const handleConfirmSubmit = () => {
    setShowConfirmDialog(false);
    setShowSummary(true);
    toast.success("Exam submitted successfully!", { autoClose: 2000 });
  };

  // Handle return to flagged questions
  const handleReturnToFlagged = () => {
    setShowConfirmDialog(false);
    if (flaggedQuestions.length > 0) {
      const unansweredFlagged = flaggedQuestions.find((q) => !userAnswers[q]);
      const targetQuestion = unansweredFlagged || flaggedQuestions[0];
      setCurrentQuestionIndex(targetQuestion - 1);
    }
  };

  // Jump to a question
  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Toggle navigator
  const handleToggleNavigator = () => {
    setShowNavigator(!showNavigator);
  };

  // Decrypt answers for summary
  const decryptAnswer = (questionNo) => {
    const encryptedAnswer = localStorage.getItem(`encryptedAnswer-${mode}-${exam}-${subject}-${paper}-${questionNo}`);
    if (!encryptedAnswer) {
      console.error(`No encrypted answer found for question ${questionNo}`);
      return null;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedAnswer, ENCRYPTION_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      if (!decrypted) {
        console.error(`Decryption failed for question ${questionNo}`);
        return null;
      }
      return decrypted;
    } catch (error) {
      console.error(`Error decrypting answer for question ${questionNo}:`, error);
      return null;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-lg text-muted-foreground py-12">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!paperData) {
    return (
      <Layout>
        <div className="text-center text-lg text-muted-foreground py-12">
          Paper not found.
        </div>
      </Layout>
    );
  }

  const totalQuestions = paperData.total_questions || 0;
  const questions = paperData.questions || [];
  const totalTime = mode === "quiz" ? 20 * 60 : parseInt((paperData?.total_time || "2 hours").split(" ")[0], 10) * 3600;
  const timeTaken = totalTime - (timeLeft || totalTime);

  return (
    <Layout>
      {!examStarted && (
        <StartScreen
          paperData={paperData}
          hasPreviousAttempt={hasPreviousAttempt}
          onStartExam={startExam}
        />
      )}
      {showAdPrompt && (
        <AdPrompt
          paperName={paperData.paper_name}
          onProceed={proceedAfterAd}
          adType="video"
          videoUrl="https://www.youtube.com/watch?v=NuI2u_9it4o"
        />
      )}
      {examStarted && !showSummary && !showConfirmDialog && (
        <ExamScreen
          paperData={paperData}
          currentQuestionIndex={currentQuestionIndex}
          userAnswers={userAnswers}
          flaggedQuestions={flaggedQuestions}
          timeLeft={timeLeft}
          showNavigator={showNavigator}
          formatTime={formatTime}
          onAnswerChange={handleAnswerChange}
          onToggleFlag={handleToggleFlag}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onJumpToQuestion={handleJumpToQuestion}
          onToggleNavigator={handleToggleNavigator}
          onFinishExam={handleFinishExam}
        />
      )}
      {showConfirmDialog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h2 id="dialog-title" className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Flagged Questions Detected
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              You have {flaggedQuestions.length} flagged question(s): Q{flaggedQuestions.join(", Q")}. Would you like to review them before submitting?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleReturnToFlagged}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                aria-label="Review flagged questions"
              >
                Review Flagged
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
                aria-label="Submit exam now"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
      {showSummary && (
        <SummaryScreen
          questions={questions}
          userAnswers={userAnswers}
          flaggedQuestions={flaggedQuestions}
          totalQuestions={totalQuestions}
          positiveMarking={paperData.positive_marking || 1}
          negativeMarking={paperData.negative_marking || 0.25}
          timeTaken={timeTaken}
          paperName={paperData.paper_name}
          onBack={() => router.back()}
          decryptAnswer={decryptAnswer}
        />
      )}
    </Layout>
  );
}