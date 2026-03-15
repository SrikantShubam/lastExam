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

//   // Debug paperData
//   useEffect(() => {
//     if (paperData) {
//       console.log("PaperData:", paperData);
//       console.log("Questions:", paperData.questions);
//     }
//   }, [paperData]);

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
//   const totalTime = mode === "quiz" ? 20 * 60 : parseInt((paperData?.total_time || "2 hours").split(" ")[0], 10) * 3600;
//   const timeTaken = totalTime - (timeLeft || totalTime);

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
//           timeTaken={timeTaken}
//           paperName={paperData.paper_name}
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
// import { db, auth } from "../../../../lib/firebase";
// import Layout from "../../../../components/Layout";
// import CryptoJS from "crypto-js";
// import StartScreen from "../../../../components/exam/StartScreen";
// import AdPrompt from "../../../../components/exam/AdPrompt";
// import ExamScreen from "../../../../components/exam/ExamScreen";
// import SummaryScreen from "../../../../components/exam/SummaryScreen";
// import { formatTime } from "../../../../utils/formatTime";
// import { toast } from "react-toastify";

// // Custom useAuth hook
// const useAuth = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (typeof window === "undefined") {
//       setLoading(false);
//       return;
//     }

//     const unsubscribe = auth.onAuthStateChanged((currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     // Fallback timeout in case onAuthStateChanged doesn't resolve
//     const timeout = setTimeout(() => {
//       if (loading) {
//         console.warn("Auth state check timed out, assuming user is not logged in.");
//         setLoading(false);
//       }
//     }, 5000); // 5 seconds timeout

//     return () => {
//       unsubscribe();
//       clearTimeout(timeout);
//     };
//   }, []);

//   return {
//     isLoggedIn: !!user,
//     loading,
//     user,
//   };
// };

// const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

// export default function PaperPage() {
//   const router = useRouter();
//   const { exam, subject, paper, mode = "exam" } = router.query;
//   const { isLoggedIn, loading: authLoading, user } = useAuth();
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

//   // Debug paperData
//   useEffect(() => {
//     if (paperData) {
//       console.log("PaperData:", paperData);
//       console.log("Questions:", paperData.questions);
//     }
//   }, [paperData]);

//   // Load user progress from localStorage
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
//           handleSubmission();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, showSummary, examStarted, exam, subject, paper, mode]);

//   // Clear local storage and reset state
//   const clearLocalData = () => {
//     if (!exam || !subject || !paper || !mode) return;

//     localStorage.removeItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`);

//     setUserAnswers({});
//     setFlaggedQuestions([]);
//     setCurrentQuestionIndex(0);
//     setHasPreviousAttempt(false);
//   };

//   // Handle submission and cleanup
//   const handleSubmission = () => {
//     setShowSummary(true);
//     toast.success("Exam submitted successfully!", { autoClose: 2000 });
//     clearLocalData();
//   };

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
//         handleSubmission();
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
//         handleSubmission();
//       }
//     }
//   };

//   // Handle finish exam
//   const handleFinishExam = () => {
//     if (flaggedQuestions.length > 0) {
//       setShowConfirmDialog(true);
//     } else {
//       handleSubmission();
//     }
//   };

//   // Handle submission confirmation
//   const handleConfirmSubmit = () => {
//     setShowConfirmDialog(false);
//     handleSubmission();
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

//   // Redirect to dashboard after showing summary
//   useEffect(() => {
//     if (showSummary) {
//       // Optionally redirect to dashboard after a delay or on user action
//     }
//   }, [showSummary]);

//   if (authLoading || loading) {
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
//   const totalTime = mode === "quiz" ? 20 * 60 : parseInt((paperData?.total_time || "2 hours").split(" ")[0], 10) * 3600;
//   const timeTaken = totalTime - (timeLeft || totalTime);

//   return (
//     <Layout>
//       {!examStarted && (
//         <StartScreen
//           paperData={paperData}
//           hasPreviousAttempt={hasPreviousAttempt}
//           onStartExam={startExam}
//           isLoggedIn={isLoggedIn} // Pass isLoggedIn to StartScreen
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
//           timeTaken={timeTaken}
//           paperName={paperData.paper_name}
//           onBack={() => router.push('/dashboard')}
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
// import { db, auth } from "../../../../lib/firebase";
// import Layout from "../../../../components/Layout";
// import CryptoJS from "crypto-js";
// import StartScreen from "../../../../components/exam/StartScreen";
// import AdPrompt from "../../../../components/exam/AdPrompt";
// import ExamScreen from "../../../../components/exam/ExamScreen";
// import SummaryScreen from "../../../../components/exam/SummaryScreen";
// import { formatTime } from "../../../../utils/formatTime";
// import { toast } from "react-toastify";

// // Custom useAuth hook
// const useAuth = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (typeof window === "undefined") {
//       setLoading(false);
//       return;
//     }

//     const unsubscribe = auth.onAuthStateChanged((currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     // Fallback timeout in case onAuthStateChanged doesn't resolve
//     const timeout = setTimeout(() => {
//       if (loading) {
//         console.warn("Auth state check timed out, assuming user is not logged in.");
//         setLoading(false);
//       }
//     }, 5000); // 5 seconds timeout

//     return () => {
//       unsubscribe();
//       clearTimeout(timeout);
//     };
//   }, []);

//   return {
//     isLoggedIn: !!user,
//     loading,
//     user,
//   };
// };

// const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

// export default function PaperPage() {
//   const router = useRouter();
//   const { exam, subject, paper, mode = "exam" } = router.query;
//   const { isLoggedIn, loading: authLoading, user } = useAuth();
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
//   const [showFinishConfirmDialog, setShowFinishConfirmDialog] = useState(false); // New state for finish confirmation
//   const [submitted, setSubmitted] = useState(false); // Track submission status

//   // Debug paperData
//   useEffect(() => {
//     if (paperData) {
//       console.log("PaperData:", paperData);
//       console.log("Questions:", paperData.questions);
//     }
//   }, [paperData]);

//   // Load user progress from localStorage and check submission status
//   useEffect(() => {
//     if (!exam || !subject || !paper || !mode) return;

//     const submittedFlag = localStorage.getItem(`submitted-${mode}-${exam}-${subject}-${paper}`);
//     if (submittedFlag === "true") {
//       setSubmitted(true);
//       setHasPreviousAttempt(false); // No previous attempt if submitted
//       return;
//     }

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
//           handleSubmission();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, showSummary, examStarted, exam, subject, paper, mode]);

//   // Clear local storage and reset state
//   const clearLocalData = () => {
//     if (!exam || !subject || !paper || !mode) return;

//     localStorage.removeItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`);

//     setUserAnswers({});
//     setFlaggedQuestions([]);
//     setCurrentQuestionIndex(0);
//     setHasPreviousAttempt(false);
//   };

//   // Handle submission and cleanup
//   const handleSubmission = () => {
//     setShowSummary(true);
//     toast.success("Exam submitted successfully!", { autoClose: 2000 });
//     clearLocalData();
//     localStorage.setItem(`submitted-${mode}-${exam}-${subject}-${paper}`, "true"); // Set submitted flag
//     setSubmitted(true); // Update state
//   };

//   // Initialize timer when exam starts
//   const startExam = (isNewAttempt = false) => {
//     setIsNewAttempt(isNewAttempt);
//     setShowAdPrompt(true);
//     localStorage.removeItem(`submitted-${mode}-${exam}-${subject}-${paper}`); // Clear submitted flag on new attempt
//     setSubmitted(false); // Reset submitted state
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
//         handleSubmission();
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
//       setShowFinishConfirmDialog(true); // Show confirmation dialog
//     }
//   };

//   // Handle finish exam
//   const handleFinishExam = () => {
//     setShowFinishConfirmDialog(true); // Show confirmation dialog
//   };

//   // Handle finish confirmation
//   const handleConfirmFinish = () => {
//     setShowFinishConfirmDialog(false);
//     if (flaggedQuestions.length > 0) {
//       setShowConfirmDialog(true); // Proceed to flagged questions dialog if applicable
//     } else {
//       handleSubmission();
//     }
//   };

//   // Handle cancel finish
//   const handleCancelFinish = () => {
//     setShowFinishConfirmDialog(false);
//   };

//   // Handle submission confirmation for flagged questions
//   const handleConfirmSubmit = () => {
//     setShowConfirmDialog(false);
//     handleSubmission();
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

//   // Redirect to dashboard after showing summary
//   useEffect(() => {
//     if (showSummary) {
//       // Optionally redirect to dashboard after a delay or on user action
//     }
//   }, [showSummary]);

//   if (authLoading || loading) {
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
//   const totalTime = mode === "quiz" ? 20 * 60 : parseInt((paperData?.total_time || "2 hours").split(" ")[0], 10) * 3600;
//   const timeTaken = totalTime - (timeLeft || totalTime);

//   return (
//     <Layout>
//       {!examStarted && (
//         <StartScreen
//           paperData={paperData}
//           hasPreviousAttempt={hasPreviousAttempt && !submitted} // Skip prompt if submitted
//           onStartExam={startExam}
//           isLoggedIn={isLoggedIn}
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
//       {examStarted && !showSummary && !showConfirmDialog && !showFinishConfirmDialog && (
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
//       {showFinishConfirmDialog && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="finish-dialog-title"
//         >
//           <div className="bg-white dark:bg-black rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
//             <h2 id="finish-dialog-title" className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//               Confirm Submission
//             </h2>
//             <p className="text-gray-700 dark:text-gray-300 mb-6">
//               Are you sure you want to submit your attempt? You will not be able to make changes after submission.
//             </p>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={handleCancelFinish}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
//                 aria-label="Cancel submission"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmFinish}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:text-gray-900 dark:bg-white dark:hover:bg-white-900"
//                 aria-label="Confirm submission"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
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
//           timeTaken={timeTaken}
//           paperName={paperData.paper_name}
//           onBack={() => router.push('/dashboard')}
//           decryptAnswer={decryptAnswer}
//         />
//       )}
//     </Layout>
//   );
// }




















// 'use client';

// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { doc, getDoc, Firestore, DocumentData } from "firebase/firestore";
// import { Auth, onAuthStateChanged } from "firebase/auth";
// import { db, auth } from "../../../../lib/firebase"; // Ensure these are exported with types
// import Layout from "../../../../components/Layout";
// import CryptoJS from "crypto-js";
// import StartScreen from "../../../../components/exam/StartScreen";
// import AdPrompt from "../../../../components/exam/AdPrompt";
// import ExamScreen from "../../../../components/exam/ExamScreen";
// import SummaryScreen from "../../../../components/exam/SummaryScreen";
// import { formatTime } from "../../../../utils/formatTime";
// import { toast } from "react-toastify";

// // Define types for paper data
// interface PaperData {
//   questions: {
//     question_no: number;
//     answer: string;
//     [key: string]: any;
//   }[];
//   total_time?: string;
//   total_questions?: number;
//   paper_name?: string;
//   positive_marking?: number;
//   negative_marking?: number;
// }

// // Custom useAuth hook
// const useAuth = () => {
//   const [user, setUser] = useState<any>(null); // Replace `any` with `User` if using Firebase types
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (typeof window === "undefined") {
//       setLoading(false);
//       return;
//     }

//     const unsubscribe = onAuthStateChanged(auth as Auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     const timeout = setTimeout(() => {
//       if (loading) {
//         console.warn("Auth state check timed out.");
//         setLoading(false);
//       }
//     }, 5000);

//     return () => {
//       unsubscribe();
//       clearTimeout(timeout);
//     };
//   }, []);

//   return {
//     isLoggedIn: !!user,
//     loading,
//     user,
//   };
// };

// const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-key";

// export default function PaperPage() {
//   const router = useRouter();
//   const { exam, subject, paper, mode = "exam" } = router.query as {
//     exam?: string;
//     subject?: string;
//     paper?: string;
//     mode?: string;
//   };
//   const { isLoggedIn, loading: authLoading, user } = useAuth();
//   const [paperData, setPaperData] = useState<PaperData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [examStarted, setExamStarted] = useState(false);
//   const [hasPreviousAttempt, setHasPreviousAttempt] = useState(false);
//   const [showAdPrompt, setShowAdPrompt] = useState(false);
//   const [isNewAttempt, setIsNewAttempt] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
//   const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
//   const [showSummary, setShowSummary] = useState(false);
//   const [timeLeft, setTimeLeft] = useState<number | null>(null);
//   const [showNavigator, setShowNavigator] = useState(true);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [showFinishConfirmDialog, setShowFinishConfirmDialog] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

//   useEffect(() => {
//     if (paperData) {
//       console.log("PaperData:", paperData);
//       console.log("Questions:", paperData.questions);
//     }
//   }, [paperData]);

//   useEffect(() => {
//     if (!exam || !subject || !paper || !mode) return;

//     const submittedFlag = localStorage.getItem(`submitted-${mode}-${exam}-${subject}-${paper}`);
//     if (submittedFlag === "true") {
//       setSubmitted(true);
//       setHasPreviousAttempt(false);
//       return;
//     }

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
//     if (!exam || !subject || !paper || !mode) return;

//     const fetchPaperContent = async () => {
//       setLoading(true);
//       try {
//         const collectionPath = mode === "quiz" ? "quizzes" : "exams";
//         const paperDocRef = doc(db as Firestore, `${collectionPath}/${exam}/${subject}/${paper}`);
//         const paperDoc = await getDoc(paperDocRef);
//         if (paperDoc.exists()) {
//           const data = paperDoc.data() as PaperData;
//           if (data.questions) {
//             data.questions.forEach((q) => {
//               if (q.answer && ENCRYPTION_KEY) {
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

//   useEffect(() => {
//     if (!examStarted || timeLeft === null || showSummary) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev === null || prev <= 0) {
//           clearInterval(timer);
//           handleSubmission();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, showSummary, examStarted, exam, subject, paper, mode, handleSubmission]);

//   const clearLocalData = () => {
//     if (!exam || !subject || !paper || !mode) return;
//     localStorage.removeItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`);
//     setUserAnswers({});
//     setFlaggedQuestions([]);
//     setCurrentQuestionIndex(0);
//     setHasPreviousAttempt(false);
//   };

//   const handleSubmission = () => {
//     setShowSummary(true);
//     toast.success("Exam submitted successfully!", { autoClose: 2000 });
//     clearLocalData();
//     localStorage.setItem(`submitted-${mode}-${exam}-${subject}-${paper}`, "true");
//     setSubmitted(true);
//   };

//   const startExam = (isNewAttempt: boolean = false) => {
//     setIsNewAttempt(isNewAttempt);
//     setShowAdPrompt(true);
//     localStorage.removeItem(`submitted-${mode}-${exam}-${subject}-${paper}`);
//     setSubmitted(false);
//   };

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
//       setTimeLeft(remaining > 0 ? remaining : 0);
//     } else {
//       const totalTime = paperData?.total_time || (mode === "quiz" ? "20 minutes" : "2 hours");
//       const totalSeconds = mode === "quiz" ? 20 * 60 : parseInt(totalTime.split(" ")[0], 10) * 3600;
//       setTimeLeft(totalSeconds);
//       localStorage.setItem(`startTime-${mode}-${exam}-${subject}-${paper}`, new Date().toISOString());
//     }
//   };

//   const handleAnswerChange = (value: string) => {
//     setUserAnswers((prev) => ({
//       ...prev,
//       [currentQuestionIndex + 1]: value,
//     }));
//   };

//   const handleToggleFlag = () => {
//     const questionNo = currentQuestionIndex + 1;
//     setFlaggedQuestions((prev) =>
//       prev.includes(questionNo)
//         ? prev.filter((q) => q !== questionNo)
//         : [...prev, questionNo].sort((a, b) => a - b)
//     );
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < (totalQuestions - 1)) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       setShowFinishConfirmDialog(true);
//     }
//   };

//   const handleFinishExam = () => {
//     setShowFinishConfirmDialog(true);
//   };

//   const handleConfirmFinish = () => {
//     setShowFinishConfirmDialog(false);
//     if (flaggedQuestions.length > 0) {
//       setShowConfirmDialog(true);
//     } else {
//       handleSubmission();
//     }
//   };

//   const handleCancelFinish = () => {
//     setShowFinishConfirmDialog(false);
//   };

//   const handleConfirmSubmit = () => {
//     setShowConfirmDialog(false);
//     handleSubmission();
//   };

//   const handleReturnToFlagged = () => {
//     setShowConfirmDialog(false);
//     if (flaggedQuestions.length > 0) {
//       const unansweredFlagged = flaggedQuestions.find((q) => !userAnswers[q]);
//       const targetQuestion = unansweredFlagged || flaggedQuestions[0];
//       setCurrentQuestionIndex(targetQuestion - 1);
//     }
//   };

//   const handleJumpToQuestion = (index: number) => {
//     setCurrentQuestionIndex(index);
//   };

//   const handleToggleNavigator = () => {
//     setShowNavigator(!showNavigator);
//   };

//   const decryptAnswer = (questionNo: number): string | null => {
//     const encryptedAnswer = localStorage.getItem(`encryptedAnswer-${mode}-${exam}-${subject}-${paper}-${questionNo}`);
//     if (!encryptedAnswer || !ENCRYPTION_KEY) return null;
//     try {
//       const bytes = CryptoJS.AES.decrypt(encryptedAnswer, ENCRYPTION_KEY);
//       return bytes.toString(CryptoJS.enc.Utf8) || null;
//     } catch (error) {
//       console.error(`Error decrypting answer for question ${questionNo}:`, error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     if (showSummary) {
//       // Optionally redirect after a delay
//     }
//   }, [showSummary, router]);

//   if (authLoading || loading) {
//     return (
//       <Layout>
//         <div className="text-center text-lg text-muted-foreground py-12">Loading...</div>
//       </Layout>
//     );
//   }

//   if (!paperData) {
//     return (
//       <Layout>
//         <div className="text-center text-lg text-muted-foreground py-12">Paper not found.</div>
//       </Layout>
//     );
//   }

//   const totalQuestions = paperData.total_questions || 0;
//   const questions = paperData.questions || [];
//   const totalTime = mode === "quiz" ? 20 * 60 : parseInt((paperData.total_time || "2 hours").split(" ")[0], 10) * 3600;
//   const timeTaken = totalTime - (timeLeft || totalTime);

//   return (
//     <Layout>
//       {!examStarted && (
//         <StartScreen
//           paperData={paperData}
//           hasPreviousAttempt={hasPreviousAttempt && !submitted}
//           onStartExam={startExam}
//           isLoggedIn={isLoggedIn}
//         />
//       )}
//       {showAdPrompt && (
//         <AdPrompt
//           paperName={paperData.paper_name || ""}
//           onProceed={proceedAfterAd}
//           adType="video"
//           videoUrl="https://www.youtube.com/watch?v=NuI2u_9it4o"
//         />
//       )}
//       {examStarted && !showSummary && !showConfirmDialog && !showFinishConfirmDialog && (
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
//       {showFinishConfirmDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-black rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Submission</h2>
//             <p className="text-gray-700 dark:text-gray-300 mb-6">
//               Are you sure you want to submit your attempt? You will not be able to make changes after submission.
//             </p>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={handleCancelFinish}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmFinish}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showConfirmDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Flagged Questions Detected</h2>
//             <p className="text-gray-700 dark:text-gray-300 mb-6">
//               You have {flaggedQuestions.length} flagged question(s): Q{flaggedQuestions.join(", Q")}. Would you like to review them?
//             </p>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={handleReturnToFlagged}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Review Flagged
//               </button>
//               <button
//                 onClick={handleConfirmSubmit}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
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
//           timeTaken={timeTaken}
//           paperName={paperData.paper_name || ""}
//           onBack={() => router.push("/dashboard")}
//           decryptAnswer={decryptAnswer}
//         />
//       )}
//     </Layout>
//   );
// }




















// 'use client';

// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { doc, getDoc, Firestore, DocumentData } from "firebase/firestore";
// import { Auth, onAuthStateChanged } from "firebase/auth";
// import { db, auth } from "../../../../lib/firebase";
// import Layout from "../../../../components/Layout";
// import CryptoJS from "crypto-js";
// import StartScreen from "../../../../components/exam/StartScreen";
// import AdPrompt from "../../../../components/exam/AdPrompt";
// import ExamScreen from "../../../../components/exam/ExamScreen";
// import SummaryScreen from "../../../../components/exam/SummaryScreen";
// import { formatTime } from "../../../../utils/formatTime";
// import { toast } from "react-toastify";

// interface PaperData {
//   questions: {
//     question_no: number;
//     answer: string;
//     [key: string]: any;
//   }[];
//   total_time?: string;
//   total_questions?: number;
//   paper_name?: string;
//   positive_marking?: number;
//   negative_marking?: number;
// }

// // const useAuth = () => {
// //   const [user, setUser] = useState<any>(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     if (typeof window === "undefined") {
// //       setLoading(false);
// //       return;
// //     }

// //     const unsubscribe = onAuthStateChanged(auth as Auth, (currentUser) => {
// //       setUser(currentUser);
// //       setLoading(false);
// //     });

// //     const timeout = setTimeout(() => {
// //       if (loading) {
// //         console.warn("Auth state check timed out.");
// //         setLoading(false);
// //       }
// //     }, 5000);

// //     return () => {
// //       unsubscribe();
// //       clearTimeout(timeout);
// //     };
// //   }, []);

// //   return {
// //     isLoggedIn: !!user,
// //     loading,
// //     user,
// //   };
// // };
// const useAuth = () => {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (typeof window === "undefined") {
//       setLoading(false);
//       return;
//     }

//     const unsubscribe = onAuthStateChanged(auth as Auth, (currentUser) => {
//       console.log("Auth state resolved:", currentUser);
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   return {
//     isLoggedIn: !!user,
//     loading,
//     user,
//   };
// };
// const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-key";

// export default function PaperPage() {
//   const router = useRouter();
//   const { exam, subject, paper, mode = "exam" } = router.query as {
//     exam?: string;
//     subject?: string;
//     paper?: string;
//     mode?: string;
//   };
//   const { isLoggedIn, loading: authLoading, user } = useAuth();
//   const [paperData, setPaperData] = useState<PaperData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [examStarted, setExamStarted] = useState(false);
//   const [hasPreviousAttempt, setHasPreviousAttempt] = useState(false);
//   const [showAdPrompt, setShowAdPrompt] = useState(false);
//   const [isNewAttempt, setIsNewAttempt] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
//   const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
//   const [showSummary, setShowSummary] = useState(false);
//   const [timeLeft, setTimeLeft] = useState<number | null>(null);
//   const [showNavigator, setShowNavigator] = useState(true);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [showFinishConfirmDialog, setShowFinishConfirmDialog] = useState(false);
//   const [submitted, setSubmitted] = useState(false);

// const [summaryUserAnswers, setSummaryUserAnswers] = useState<{ [key: number]: string }>({});


//   // Define all functions before useEffect hooks
//   const clearLocalData = () => {
//     if (!exam || !subject || !paper || !mode) return;
//     localStorage.removeItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`);
//     setUserAnswers({});
//     setFlaggedQuestions([]);
//     setCurrentQuestionIndex(0);
//     setHasPreviousAttempt(false);
//   };

//   const handleSubmission = () => {
//     setShowSummary(true);
//     toast.success("Exam submitted successfully!", { autoClose: 2000 });
//     clearLocalData();
//     localStorage.setItem(`submitted-${mode}-${exam}-${subject}-${paper}`, "true");
//      setSummaryUserAnswers(userAnswers); // Capture userAnswers before clearing
 
//   toast.success("Exam submitted successfully!", { autoClose: 2000 });
  
//   localStorage.setItem(`submitted-${mode}-${exam}-${subject}-${paper}`, "true");

//     setSubmitted(true);
//   };

//   const startExam = (isNewAttempt: boolean = false) => {
//     setIsNewAttempt(isNewAttempt);
//     setShowAdPrompt(true);
//     localStorage.removeItem(`submitted-${mode}-${exam}-${subject}-${paper}`);
//     setSubmitted(false);
//   };

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
//       setTimeLeft(remaining > 0 ? remaining : 0);
//     } else {
//       const totalTime = paperData?.total_time || (mode === "quiz" ? "20 minutes" : "2 hours");
//       const totalSeconds = mode === "quiz" ? 20 * 60 : parseInt(totalTime.split(" ")[0], 10) * 3600;
//       setTimeLeft(totalSeconds);
//       localStorage.setItem(`startTime-${mode}-${exam}-${subject}-${paper}`, new Date().toISOString());
//     }
//   };

//   // const handleAnswerChange = (value: string) => {
//   //   setUserAnswers((prev) => ({
//   //     ...prev,
//   //     [currentQuestionIndex + 1]: value,
//   //   }));
//   // };
//   const handleAnswerChange = (value: string) => {
//   setUserAnswers((prev) => {
//     const newAnswers = { ...prev, [currentQuestionIndex + 1]: value };
//     console.log("UserAnswers updated:", newAnswers);
//     return newAnswers;
//   });
// };

//   // const handleToggleFlag = () => {
//   //   const questionNo = currentQuestionIndex + 1;
//   //   setFlaggedQuestions((prev) =>
//   //     prev.includes(questionNo)
//   //       ? prev.filter((q) => q !== questionNo)
//   //       : [...prev, questionNo].sort((a, b) => a - b)
//   //   );
//   // };
//   const handleToggleFlag = () => {
//   const questionNo = currentQuestionIndex + 1;
//   setFlaggedQuestions((prev) => {
//     const newFlagged = prev.includes(questionNo)
//       ? prev.filter((q) => q !== questionNo)
//       : [...prev, questionNo].sort((a, b) => a - b);
//     console.log("FlaggedQuestions updated:", newFlagged);
//     return newFlagged;
//   });
// };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < (totalQuestions - 1)) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       setShowFinishConfirmDialog(true);
//     }
//   };

//   const handleFinishExam = () => {
//     setShowFinishConfirmDialog(true);
//   };

//   const handleConfirmFinish = () => {
//     setShowFinishConfirmDialog(false);
//     if (flaggedQuestions.length > 0) {
//       setShowConfirmDialog(true);
//     } else {
//       handleSubmission();
//     }
//   };

//   const handleCancelFinish = () => {
//     setShowFinishConfirmDialog(false);
//   };

//   const handleConfirmSubmit = () => {
//     setShowConfirmDialog(false);
//     handleSubmission();
//   };

//   const handleReturnToFlagged = () => {
//     setShowConfirmDialog(false);
//     if (flaggedQuestions.length > 0) {
//       const unansweredFlagged = flaggedQuestions.find((q) => !userAnswers[q]);
//       const targetQuestion = unansweredFlagged || flaggedQuestions[0];
//       setCurrentQuestionIndex(targetQuestion - 1);
//     }
//   };

//   const handleJumpToQuestion = (index: number) => {
//   console.log("CurrentQuestionIndex updated to:", index);
//   setCurrentQuestionIndex(index);
// };

//   const handleToggleNavigator = () => {
//     setShowNavigator(!showNavigator);
//   };
// console.log("PaperPage rendered");
//   const decryptAnswer = (questionNo: number): string | null => {
//     const encryptedAnswer = localStorage.getItem(`encryptedAnswer-${mode}-${exam}-${subject}-${paper}-${questionNo}`);
//     if (!encryptedAnswer || !ENCRYPTION_KEY) return null;
//     try {
//       const bytes = CryptoJS.AES.decrypt(encryptedAnswer, ENCRYPTION_KEY);
//       return bytes.toString(CryptoJS.enc.Utf8) || null;
//     } catch (error) {
//       console.error(`Error decrypting answer for question ${questionNo}:`, error);
//       return null;
//     }
//   };

//   // useEffect hooks
//   useEffect(() => {
//     // if (paperData) {
//     //   console.log("PaperData:", paperData);
//     //   console.log("Questions:", paperData.questions);
//     // }
//   }, [paperData]);

//   useEffect(() => {
//     if (!exam || !subject || !paper || !mode) return;

//     const submittedFlag = localStorage.getItem(`submitted-${mode}-${exam}-${subject}-${paper}`);
//     if (submittedFlag === "true") {
//       setSubmitted(true);
//       setHasPreviousAttempt(false);
//       return;
//     }

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
//     if (!exam || !subject || !paper || !mode) return;

//     const fetchPaperContent = async () => {
//       setLoading(true);
//       try {
//         const collectionPath = mode === "quiz" ? "quizzes" : "exams";
//         const paperDocRef = doc(db as Firestore, `${collectionPath}/${exam}/${subject}/${paper}`);
//         const paperDoc = await getDoc(paperDocRef);
//         if (paperDoc.exists()) {
//           const data = paperDoc.data() as PaperData;
//           if (data.questions) {
//             data.questions.forEach((q) => {
//               if (q.answer && ENCRYPTION_KEY) {
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

//   useEffect(() => {
//     if (!examStarted || timeLeft === null || showSummary) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev === null || prev <= 0) {
//           clearInterval(timer);
//           handleSubmission();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [ showSummary, examStarted, exam, subject, paper, mode]);

//   if (authLoading || loading) {
//     return (
//       <Layout>
//         <div className="text-center text-lg text-muted-foreground py-12">Loading...</div>
//       </Layout>
//     );
//   }

//   if (!paperData) {
//     return (
//       <Layout>
//         <div className="text-center text-lg text-muted-foreground py-12">Paper not found.</div>
//       </Layout>
//     );
//   }

//   const totalQuestions = paperData.total_questions || 0;
//   const questions = paperData.questions || [];
//   const totalTime = mode === "quiz" ? 20 * 60 : parseInt((paperData.total_time || "2 hours").split(" ")[0], 10) * 3600;
//   const timeTaken = totalTime - (timeLeft || totalTime);

//   return (
//     <Layout>
//       {!examStarted && (
//         <StartScreen
//           paperData={paperData}
//           hasPreviousAttempt={hasPreviousAttempt && !submitted}
//           onStartExam={startExam}
//           isLoggedIn={isLoggedIn}
//         />
//       )}
//       {showAdPrompt && (
//         <AdPrompt
//           paperName={paperData.paper_name || ""}
//           onProceed={proceedAfterAd}
//           adType="video"
//           videoUrl="https://www.youtube.com/watch?v=NuI2u_9it4o"
//         />
//       )}
//       {examStarted && !showSummary && !showConfirmDialog && !showFinishConfirmDialog && (
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
//       {showFinishConfirmDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-black rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Submission</h2>
//             <p className="text-gray-700 dark:text-gray-300 mb-6">
//               Are you sure you want to submit your attempt? You will not be able to make changes after submission.
//             </p>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={handleCancelFinish}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmFinish}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showConfirmDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Flagged Questions Detected</h2>
//             <p className="text-gray-700 dark:text-gray-300 mb-6">
//               You have {flaggedQuestions.length} flagged question(s): Q{flaggedQuestions.join(", Q")}. Would you like to review them?
//             </p>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={handleReturnToFlagged}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Review Flagged
//               </button>
//               <button
//                 onClick={handleConfirmSubmit}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//               >
//                 Submit Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showSummary && (
//   <SummaryScreen
//     questions={questions}
//     userAnswers={summaryUserAnswers} // Use the preserved answers
//     flaggedQuestions={flaggedQuestions}
//     totalQuestions={totalQuestions}
//     positiveMarking={paperData.positive_marking || 1}
//     negativeMarking={paperData.negative_marking || 0.25}
//     timeTaken={timeTaken}
//     paperName={paperData.paper_name || ""}
//     onBack={() => router.push("/dashboard")}
//     decryptAnswer={decryptAnswer}
//   />
// )}
//     </Layout>
//   );
// }
























































// 'use client';

// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
// import { doc, getDoc, Firestore } from "firebase/firestore";
// import { Auth, onAuthStateChanged, User } from "firebase/auth";
// import { db, auth } from "../../../../lib/firebase";
// import Layout from "../../../../components/Layout";
// import CryptoJS from "crypto-js";
// import StartScreen from "../../../../components/exam/StartScreen";
// import AdPrompt from "../../../../components/exam/AdPrompt";
// import ExamScreen from "../../../../components/exam/ExamScreen";
// import SummaryScreen from "../../../../components/exam/SummaryScreen";
// import { formatTime } from "../../../../utils/formatTime";
// import { toast } from "react-toastify";

// interface PaperData {
//   questions: {
//     question_no: number;
//     question: string;
//     answer: string;
//     question_type: string;
//     options?: Record<string, string>;
//     [key: string]: any;
//   }[];
//   total_time?: string;
//   total_questions?: number;
//   paper_name?: string;
//   positive_marking?: number;
//   negative_marking?: number;
// }

// const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (typeof window === "undefined") {
//       setLoading(false);
//       return;
//     }

//     const unsubscribe = onAuthStateChanged(auth as Auth, (currentUser) => {
//       console.log("Auth state resolved:", currentUser);
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   return {
//     isLoggedIn: !!user,
//     loading,
//   };
// };

// const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-key";

// export default function PaperPage() {
//   const router = useRouter();
//   const { exam, subject, paper, mode = "exam" } = router.query as {
//     exam?: string;
//     subject?: string;
//     paper?: string;
//     mode?: string;
//   };
//   const { isLoggedIn, loading: authLoading } = useAuth();
//   const [paperData, setPaperData] = useState<PaperData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [examStarted, setExamStarted] = useState(false);
//   const [hasPreviousAttempt, setHasPreviousAttempt] = useState(false);
//   const [showAdPrompt, setShowAdPrompt] = useState(false);
//   const [isNewAttempt, setIsNewAttempt] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
//   const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
//   const [showSummary, setShowSummary] = useState(false);
//   const [timeLeft, setTimeLeft] = useState<number | null>(null);
//   const [showNavigator, setShowNavigator] = useState(true);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [showFinishConfirmDialog, setShowFinishConfirmDialog] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [summaryUserAnswers, setSummaryUserAnswers] = useState<{ [key: number]: string }>({});

//   // Define all functions before useEffect hooks
//   const clearLocalData = () => {
//     if (!exam || !subject || !paper || !mode) return;
//     localStorage.removeItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`isNewAttempt-${mode}-${exam}-${subject}-${paper}`);
//     setUserAnswers({});
//     setFlaggedQuestions([]);
//     setCurrentQuestionIndex(0);
//     setHasPreviousAttempt(false);
//   };

//   const handleSubmission = () => {
//     setShowSummary(true);
//     toast.success("Exam submitted successfully!", { autoClose: 2000 });
//     setSummaryUserAnswers(userAnswers); 
//     if (user) {
//     const attemptId = `${mode}-${exam}-${subject}-${paper}-${Date.now()}`;
//     const score = calculateScore(userAnswers, paperData.questions); // Implement this
//     try {
//       await setDoc(doc(db, "users", user.uid, "examHistory", attemptId), {
//         exam,
//         subject,
//         paper,
//         mode,
//         score,
//         totalQuestions: paperData.total_questions || 0,
//         timestamp: serverTimestamp(),
//       });
//     } catch (error) {
//       console.error("Error saving exam attempt:", error);
//     }
//   }
//     clearLocalData();
//     localStorage.setItem(`submitted-${mode}-${exam}-${subject}-${paper}`, "true");
//     setSubmitted(true);
//   };

//   const startExam = (isNewAttempt: boolean = false) => {
//     console.log("Starting exam, isNewAttempt:", isNewAttempt);
//     setIsNewAttempt(isNewAttempt);
//     localStorage.setItem(`isNewAttempt-${mode}-${exam}-${subject}-${paper}`, JSON.stringify(isNewAttempt));
//     setShowAdPrompt(true);
//     localStorage.removeItem(`submitted-${mode}-${exam}-${subject}-${paper}`);
//     setSubmitted(false);
//   };

//   const proceedAfterAd = () => {
//     setShowAdPrompt(false);
//     setExamStarted(true);

//     const savedStartTime = localStorage.getItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
//     const savedIsNewAttempt = JSON.parse(localStorage.getItem(`isNewAttempt-${mode}-${exam}-${subject}-${paper}`) || "true");
//     console.log("Proceeding after ad, savedStartTime:", savedStartTime, "savedIsNewAttempt:", savedIsNewAttempt);

//     if (!savedIsNewAttempt && savedStartTime) {
//       const startTime = new Date(savedStartTime).getTime();
//       const now = new Date().getTime();
//       const elapsed = Math.floor((now - startTime) / 1000);
//       const totalTime = paperData?.total_time || (mode === "quiz" ? "20 minutes" : "2 hours");
//       const totalSeconds = mode === "quiz" ? 20 * 60 : parseInt(totalTime.split(" ")[0], 10) * 3600;
//       const remaining = totalSeconds - elapsed;
//       console.log("Resuming timer, remaining:", remaining);
//       setTimeLeft(remaining > 0 ? remaining : 0);
//     } else {
//       const totalTime = paperData?.total_time || (mode === "quiz" ? "20 minutes" : "2 hours");
//       const totalSeconds = mode === "quiz" ? 20 * 60 : parseInt(totalTime.split(" ")[0], 10) * 3600;
//       console.log("Starting new timer, totalSeconds:", totalSeconds);
//       setTimeLeft(totalSeconds);
//       localStorage.setItem(`startTime-${mode}-${exam}-${subject}-${paper}`, new Date().toISOString());
//     }
//   };

//   const handleAnswerChange = (value: string) => {
//     setUserAnswers((prev) => {
//       const newAnswers = { ...prev, [currentQuestionIndex + 1]: value };
//       console.log("UserAnswers updated:", newAnswers);
//       return newAnswers;
//     });
//   };

//   const handleToggleFlag = () => {
//     const questionNo = currentQuestionIndex + 1;
//     setFlaggedQuestions((prev) => {
//       const newFlagged = prev.includes(questionNo)
//         ? prev.filter((q) => q !== questionNo)
//         : [...prev, questionNo].sort((a, b) => a - b);
//       console.log("FlaggedQuestions updated:", newFlagged);
//       return newFlagged;
//     });
//   };

//   const handlePrevious = () => {
//     if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < (totalQuestions - 1)) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       setShowFinishConfirmDialog(true);
//     }
//   };

//   const handleFinishExam = () => {
//     setShowFinishConfirmDialog(true);
//   };

//   const handleConfirmFinish = () => {
//     setShowFinishConfirmDialog(false);
//     if (flaggedQuestions.length > 0) {
//       setShowConfirmDialog(true);
//     } else {
//       handleSubmission();
//     }
//   };

//   const handleCancelFinish = () => {
//     setShowFinishConfirmDialog(false);
//   };

//   const handleConfirmSubmit = () => {
//     setShowConfirmDialog(false);
//     handleSubmission();
//   };

//   const handleReturnToFlagged = () => {
//     setShowConfirmDialog(false);
//     if (flaggedQuestions.length > 0) {
//       const unansweredFlagged = flaggedQuestions.find((q) => !userAnswers[q]);
//       const targetQuestion = unansweredFlagged || flaggedQuestions[0];
//       setCurrentQuestionIndex(targetQuestion - 1);
//     }
//   };

//   const handleJumpToQuestion = (index: number) => {
//     console.log("CurrentQuestionIndex updated to:", index);
//     setCurrentQuestionIndex(index);
//   };

//   const handleToggleNavigator = () => {
//     setShowNavigator(!showNavigator);
//   };

//   const decryptAnswer = (questionNo: number): string | null => {
//     const encryptedAnswer = localStorage.getItem(`encryptedAnswer-${mode}-${exam}-${subject}-${paper}-${questionNo}`);
//     if (!encryptedAnswer || !ENCRYPTION_KEY) return null;
//     try {
//       const bytes = CryptoJS.AES.decrypt(encryptedAnswer, ENCRYPTION_KEY);
//       return bytes.toString(CryptoJS.enc.Utf8) || null;
//     } catch (error) {
//       console.error(`Error decrypting answer for question ${questionNo}:`, error);
//       return null;
//     }
//   };

//   // useEffect hooks
//   useEffect(() => {
//     if (!exam || !subject || !paper || !mode) return;

//     const submittedFlag = localStorage.getItem(`submitted-${mode}-${exam}-${subject}-${paper}`);
//     if (submittedFlag === "true") {
//       setSubmitted(true);
//       setHasPreviousAttempt(false);
//       return;
//     }

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

//   useEffect(() => {
//     if (!exam || !subject || !paper || !mode) return;

//     const savedIsNewAttempt = localStorage.getItem(`isNewAttempt-${mode}-${exam}-${subject}-${paper}`);
//     if (savedIsNewAttempt) {
//       setIsNewAttempt(JSON.parse(savedIsNewAttempt));
//     }
//   }, [exam, subject, paper, mode]);

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
//     if (!exam || !subject || !paper || !mode) return;

//     const fetchPaperContent = async () => {
//       console.log("Fetching paper, mode:", mode, "path:", `${mode}/${exam}/${subject}/${paper}`);
//       setLoading(true);
//       try {
//         const collectionPath = mode === "quiz" ? "quizzes" : "exams";
//         const paperDocRef = doc(db as Firestore, `${collectionPath}/${exam}/${subject}/${paper}`);
//         const paperDoc = await getDoc(paperDocRef);
//         console.log("Fetched paper data:", paperDoc.data());
//         if (paperDoc.exists()) {
//           const data = paperDoc.data() as PaperData;
//           if (data.questions) {
//             data.questions.forEach((q) => {
//               if (q.answer && ENCRYPTION_KEY) {
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

//   useEffect(() => {
//     console.log("PaperPage rendered");
//   }, []);

//   useEffect(() => {
//     if (!examStarted || timeLeft === null || showSummary) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         console.log("TimeLeft updated:", prev);
//         if (prev === null || prev <= 0) {
//           clearInterval(timer);
//           handleSubmission();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [showSummary, examStarted, exam, subject, paper, mode, handleSubmission, timeLeft]);

//   if (authLoading || loading) {
//     return (
//       <Layout>
//         <div className="text-center text-lg text-muted-foreground py-12">Loading...</div>
//       </Layout>
//     );
//   }

//   if (!paperData) {
//     return (
//       <Layout>
//         <div className="text-center text-lg text-muted-foreground py-12">Paper not found.</div>
//       </Layout>
//     );
//   }

//   const totalQuestions = paperData.total_questions || 0;
//   const questions = paperData.questions || [];
//   const totalTime = mode === "quiz" ? 20 * 60 : parseInt((paperData.total_time || "2 hours").split(" ")[0], 10) * 3600;
//   const timeTaken = totalTime - (timeLeft || totalTime);

//   return (
//     <Layout>
//       {!examStarted && (
//         <StartScreen
//           paperData={paperData}
//           hasPreviousAttempt={hasPreviousAttempt && !submitted}
//           onStartExam={startExam}
//           isLoggedIn={isLoggedIn}
//         />
//       )}
//       {showAdPrompt && (
//         <AdPrompt
//           paperName={paperData.paper_name || ""}
//           onProceed={proceedAfterAd}
//           adType="video"
//           videoUrl="https://www.youtube.com/watch?v=NuI2u_9it4o"
//         />
//       )}
//       {examStarted && !showSummary && !showConfirmDialog && !showFinishConfirmDialog && (
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
//       {showFinishConfirmDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-black rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Submission</h2>
//             <p className="text-gray-700 dark:text-gray-300 mb-6">
//               Are you sure you want to submit your attempt? You will not be able to make changes after submission.
//             </p>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={handleCancelFinish}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmFinish}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showConfirmDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Flagged Questions Detected</h2>
//             <p className="text-gray-700 dark:text-gray-300 mb-6">
//               You have {flaggedQuestions.length} flagged question(s): Q{flaggedQuestions.join(", Q")}. Would you like to review them?
//             </p>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={handleReturnToFlagged}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Review Flagged
//               </button>
//               <button
//                 onClick={handleConfirmSubmit}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
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
//           userAnswers={summaryUserAnswers}
//           flaggedQuestions={flaggedQuestions}
//           totalQuestions={totalQuestions}
//           positiveMarking={paperData.positive_marking || 1}
//           negativeMarking={paperData.negative_marking || 0.25}
//           timeTaken={timeTaken}
//           paperName={paperData.paper_name || ""}
//           onBack={() => router.push("/dashboard")}
//           decryptAnswer={decryptAnswer}
//         />
//       )}
//     </Layout>
//   );
// }






























//no summary page

// 'use client';

// import { useEffect, useState, useCallback } from "react";
// import { useRouter } from "next/router";
// import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
// import { onAuthStateChanged, User } from "firebase/auth";
// import { db, auth } from "../../../../lib/firebase";
// import Layout from "../../../../components/Layout";
// import CryptoJS from "crypto-js";
// import StartScreen from "../../../../components/exam/StartScreen";
// import AdPrompt from "../../../../components/exam/AdPrompt";
// import ExamScreen from "../../../../components/exam/ExamScreen";
// import SummaryScreen from "../../../../components/exam/SummaryScreen";
// import { formatTime } from "../../../../utils/formatTime";
// import { toast } from "react-toastify";

// interface PaperData {
//   questions: {
//     question_no: number;
//     question: string;
//     answer: string;
//     question_type: string;
//     options?: Record<string, string>;
//   }[];
//   total_time?: string;
//   total_questions?: number;
//   paper_name?: string;
//   positive_marking?: number;
//   negative_marking?: number;
// }

// const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (typeof window === "undefined") {
//       setLoading(false);
//       return;
//     }

//     const unsubscribe = onAuthStateChanged(auth!, (currentUser) => {
//       console.log("Auth state resolved:", currentUser);
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   return {
//     user,
//     isLoggedIn: !!user,
//     loading,
//   };
// };

// const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-key";

// export default function PaperPage() {
//   const router = useRouter();
//   const { exam, subject, paper, mode = "exam" } = router.query as {
//     exam?: string;
//     subject?: string;
//     paper?: string;
//     mode?: string;
//   };
//   const { user, isLoggedIn, loading: authLoading } = useAuth();
//   const [paperData, setPaperData] = useState<PaperData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [examStarted, setExamStarted] = useState(false);
//   const [hasPreviousAttempt, setHasPreviousAttempt] = useState(false);
//   const [showAdPrompt, setShowAdPrompt] = useState(false);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
//   const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
//   const [showSummary, setShowSummary] = useState(false);
//   const [timeLeft, setTimeLeft] = useState<number | null>(null);
//   const [showNavigator, setShowNavigator] = useState(true);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [showFinishConfirmDialog, setShowFinishConfirmDialog] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [summaryUserAnswers, setSummaryUserAnswers] = useState<{ [key: number]: string }>({});

//   // Define all functions before useEffect hooks
//   const clearLocalData = useCallback(() => {
//     if (!exam || !subject || !paper || !mode) return;
//     localStorage.removeItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`);
//     localStorage.removeItem(`isNewAttempt-${mode}-${exam}-${subject}-${paper}`);
//     setUserAnswers({});
//     setFlaggedQuestions([]);
//     setCurrentQuestionIndex(0);
//     setHasPreviousAttempt(false);
//   }, [exam, subject, paper, mode]);

//   const calculateScore = (answers: { [key: number]: string }, questions: PaperData['questions']) => {
//     // Implement your score calculation logic here
//     // For example:
//     let score = 0;
//     questions.forEach((q) => {
//       if (answers[q.question_no] === q.answer) {
//         score += paperData?.positive_marking || 1;
//       } else if (answers[q.question_no]) {
//         score -= paperData?.negative_marking || 0.25;
//       }
//     });
//     return score;
//   };

//   const handleSubmission = useCallback(async () => {
//     setShowSummary(true);
//     toast.success("Exam submitted successfully!", { autoClose: 2000 });
//     setSummaryUserAnswers(userAnswers); 
//     if (user) {
//       const attemptId = `${mode}-${exam}-${subject}-${paper}-${Date.now()}`;
//       const score = calculateScore(userAnswers, paperData?.questions || []);
//       try {
//         await setDoc(doc(db!, "users", user.uid, "examHistory", attemptId), {
//           exam,
//           subject,
//           paper,
//           mode,
//           score,
//           totalQuestions: paperData?.total_questions || 0,
//           timestamp: serverTimestamp(),
//         });
//       } catch (error) {
//         console.error("Error saving exam attempt:", error);
//       }
//     }
//     clearLocalData();
//     localStorage.setItem(`submitted-${mode}-${exam}-${subject}-${paper}`, "true");
//     setSubmitted(true);
//   }, [user, mode, exam, subject, paper, userAnswers, paperData, clearLocalData]);

//   const startExam = useCallback((newAttempt: boolean = false) => {
//     console.log("Starting exam, isNewAttempt:", newAttempt);
//     localStorage.setItem(`isNewAttempt-${mode}-${exam}-${subject}-${paper}`, JSON.stringify(newAttempt));
//     setShowAdPrompt(true);
//     localStorage.removeItem(`submitted-${mode}-${exam}-${subject}-${paper}`);
//     setSubmitted(false);
//   }, [exam, subject, paper, mode]);

//   const proceedAfterAd = useCallback(() => {
//     setShowAdPrompt(false);
//     setExamStarted(true);

//     const savedStartTime = localStorage.getItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
//     const savedIsNewAttempt = JSON.parse(localStorage.getItem(`isNewAttempt-${mode}-${exam}-${subject}-${paper}`) || "true");
//     console.log("Proceeding after ad, savedStartTime:", savedStartTime, "savedIsNewAttempt:", savedIsNewAttempt);

//     if (!savedIsNewAttempt && savedStartTime) {
//       const startTime = new Date(savedStartTime).getTime();
//       const now = new Date().getTime();
//       const elapsed = Math.floor((now - startTime) / 1000);
//       const totalTime = paperData?.total_time || (mode === "quiz" ? "20 minutes" : "2 hours");
//       const totalSeconds = mode === "quiz" ? 20 * 60 : parseInt(totalTime.split(" ")[0], 10) * 3600;
//       const remaining = totalSeconds - elapsed;
//       console.log("Resuming timer, remaining:", remaining);
//       setTimeLeft(remaining > 0 ? remaining : 0);
//     } else {
//       const totalTime = paperData?.total_time || (mode === "quiz" ? "20 minutes" : "2 hours");
//       const totalSeconds = mode === "quiz" ? 20 * 60 : parseInt(totalTime.split(" ")[0], 10) * 3600;
//       console.log("Starting new timer, totalSeconds:", totalSeconds);
//       setTimeLeft(totalSeconds);
//       localStorage.setItem(`startTime-${mode}-${exam}-${subject}-${paper}`, new Date().toISOString());
//     }
//   }, [paperData, mode, exam, subject, paper]);

//   const handleAnswerChange = useCallback((value: string) => {
//     setUserAnswers((prev) => {
//       const newAnswers = { ...prev, [currentQuestionIndex + 1]: value };
//       console.log("UserAnswers updated:", newAnswers);
//       return newAnswers;
//     });
//   }, [currentQuestionIndex]);

//   const handleToggleFlag = useCallback(() => {
//     const questionNo = currentQuestionIndex + 1;
//     setFlaggedQuestions((prev) => {
//       const newFlagged = prev.includes(questionNo)
//         ? prev.filter((q) => q !== questionNo)
//         : [...prev, questionNo].sort((a, b) => a - b);
//       console.log("FlaggedQuestions updated:", newFlagged);
//       return newFlagged;
//     });
//   }, [currentQuestionIndex]);

//   const handlePrevious = useCallback(() => {
//     if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
//   }, [currentQuestionIndex]);

//   const handleNext = useCallback(() => {
//     if (currentQuestionIndex < (paperData?.total_questions || 0) - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     } else {
//       setShowFinishConfirmDialog(true);
//     }
//   }, [currentQuestionIndex, paperData]);

//   const handleFinishExam = useCallback(() => {
//     setShowFinishConfirmDialog(true);
//   }, []);

//   const handleConfirmFinish = useCallback(() => {
//     setShowFinishConfirmDialog(false);
//     if (flaggedQuestions.length > 0) {
//       setShowConfirmDialog(true);
//     } else {
//       handleSubmission();
//     }
//   }, [flaggedQuestions, handleSubmission]);

//   const handleCancelFinish = useCallback(() => {
//     setShowFinishConfirmDialog(false);
//   }, []);

//   const handleConfirmSubmit = useCallback(() => {
//     setShowConfirmDialog(false);
//     handleSubmission();
//   }, [handleSubmission]);

//   const handleReturnToFlagged = useCallback(() => {
//     setShowConfirmDialog(false);
//     if (flaggedQuestions.length > 0) {
//       const unansweredFlagged = flaggedQuestions.find((q) => !userAnswers[q]);
//       const targetQuestion = unansweredFlagged || flaggedQuestions[0];
//       setCurrentQuestionIndex(targetQuestion - 1);
//     }
//   }, [flaggedQuestions, userAnswers]);

//   const handleJumpToQuestion = useCallback((index: number) => {
//     console.log("CurrentQuestionIndex updated to:", index);
//     setCurrentQuestionIndex(index);
//   }, []);

//   const handleToggleNavigator = useCallback(() => {
//     setShowNavigator((prev) => !prev);
//   }, []);

//   const decryptAnswer = useCallback((questionNo: number): string | null => {
//     const encryptedAnswer = localStorage.getItem(`encryptedAnswer-${mode}-${exam}-${subject}-${paper}-${questionNo}`);
//     if (!encryptedAnswer || !ENCRYPTION_KEY) return null;
//     try {
//       const bytes = CryptoJS.AES.decrypt(encryptedAnswer, ENCRYPTION_KEY);
//       return bytes.toString(CryptoJS.enc.Utf8) || null;
//     } catch (error) {
//       console.error(`Error decrypting answer for question ${questionNo}:`, error);
//       return null;
//     }
//   }, [exam, subject, paper, mode]);

//   // useEffect hooks
//   useEffect(() => {
//     if (!exam || !subject || !paper || !mode) return;

//     const submittedFlag = localStorage.getItem(`submitted-${mode}-${exam}-${subject}-${paper}`);
//     if (submittedFlag === "true") {
//       setSubmitted(true);
//       setHasPreviousAttempt(false);
//       return;
//     }

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
//     if (!exam || !subject || !paper || !mode) return;

//     const fetchPaperContent = async () => {
//       console.log("Fetching paper, mode:", mode, "path:", `${mode}/${exam}/${subject}/${paper}`);
//       setLoading(true);
//       try {
//         const collectionPath = mode === "quiz" ? "quizzes" : "exams";
//         const paperDocRef = doc(db!, `${collectionPath}/${exam}/${subject}/${paper}`);
//         const paperDoc = await getDoc(paperDocRef);
//         console.log("Fetched paper data:", paperDoc.data());
//         if (paperDoc.exists()) {
//           const data = paperDoc.data() as PaperData;
//           if (data.questions) {
//             data.questions.forEach((q) => {
//               if (q.answer && ENCRYPTION_KEY) {
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

//   useEffect(() => {
//     console.log("PaperPage rendered");
//   }, []);

//   useEffect(() => {
//     if (!examStarted || timeLeft === null || showSummary) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         console.log("TimeLeft updated:", prev);
//         if (prev === null || prev <= 0) {
//           clearInterval(timer);
//           handleSubmission();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [showSummary, examStarted, handleSubmission, timeLeft]);

//   if (authLoading || loading) {
//     return (
//       <Layout>
//         <div className="text-center text-lg text-muted-foreground py-12">Loading...</div>
//       </Layout>
//     );
//   }

//   if (!paperData) {
//     return (
//       <Layout>
//         <div className="text-center text-lg text-muted-foreground py-12">Paper not found.</div>
//       </Layout>
//     );
//   }

//   const totalQuestions = paperData.total_questions || 0;
//   const questions = paperData.questions || [];
//   const totalTime = mode === "quiz" ? 20 * 60 : parseInt((paperData.total_time || "2 hours").split(" ")[0], 10) * 3600;
//   const timeTaken = totalTime - (timeLeft || totalTime);

//   return (
//     <Layout>
//       {!examStarted && (
//         <StartScreen
//           paperData={paperData}
//           hasPreviousAttempt={hasPreviousAttempt && !submitted}
//           onStartExam={startExam}
//           isLoggedIn={isLoggedIn}
//         />
//       )}
//       {showAdPrompt && (
//         <AdPrompt
//           paperName={paperData.paper_name || ""}
//           onProceed={proceedAfterAd}
//           adType="video"
//           videoUrl="https://www.youtube.com/watch?v=NuI2u_9it4o"
//         />
//       )}
//       {examStarted && !showSummary && !showConfirmDialog && !showFinishConfirmDialog && (
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
//       {showFinishConfirmDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-black rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Submission</h2>
//             <p className="text-gray-700 dark:text-gray-300 mb-6">
//               Are you sure you want to submit your attempt? You will not be able to make changes after submission.
//             </p>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={handleCancelFinish}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleConfirmFinish}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//       {showConfirmDialog && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
//             <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Flagged Questions Detected</h2>
//             <p className="text-gray-700 dark:text-gray-300 mb-6">
//               You have {flaggedQuestions.length} flagged question(s): Q{flaggedQuestions.join(", Q")}. Would you like to review them?
//             </p>
//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={handleReturnToFlagged}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Review Flagged
//               </button>
//               <button
//                 onClick={handleConfirmSubmit}
//                 className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
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
//           userAnswers={summaryUserAnswers}
//           flaggedQuestions={flaggedQuestions}
//           totalQuestions={totalQuestions}
//           positiveMarking={paperData.positive_marking || 1}
//           negativeMarking={paperData.negative_marking || 0.25}
//           timeTaken={timeTaken}
//           paperName={paperData.paper_name || ""}
//           onBack={() => router.push("/dashboard")}
//           decryptAnswer={decryptAnswer}
//         />
//       )}
//     </Layout>
//   );
// }






























//summary page for more clarity

'use client';

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth } from "../../../../lib/firebase";
import Layout from "../../../../components/Layout";
import CryptoJS from "crypto-js";
import StartScreen from "../../../../components/exam/StartScreen";
import AdPrompt from "../../../../components/exam/AdPrompt";
import ExamScreen from "../../../../components/exam/ExamScreen";
import { formatTime } from "../../../../utils/formatTime";
import { toast } from "react-toastify";

interface PaperData {
  questions: {
    question_no: number;
    question: string;
    answer: string;
    question_type: string;
    options?: Record<string, string>;
  }[];
  total_time?: string;
  total_questions?: number;
  paper_name?: string;
  positive_marking?: number;
  negative_marking?: number;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth!, (currentUser) => {
      console.log("Auth state resolved:", currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    loading,
  };
};

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default-key";

export default function PaperPage() {
  const router = useRouter();
  const { exam, subject, paper, mode = "exam" } = router.query as {
    exam?: string;
    subject?: string;
    paper?: string;
    mode?: string;
  };
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [paperData, setPaperData] = useState<PaperData | null>(null);
  const [loading, setLoading] = useState(true);
  const [examStarted, setExamStarted] = useState(false);
  const [hasPreviousAttempt, setHasPreviousAttempt] = useState(false);
  const [showAdPrompt, setShowAdPrompt] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showNavigator, setShowNavigator] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showFinishConfirmDialog, setShowFinishConfirmDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Define all functions before useEffect hooks
  const clearLocalData = useCallback(() => {
    if (!exam || !subject || !paper || !mode) return;
    localStorage.removeItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`);
    localStorage.removeItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`);
    localStorage.removeItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
    localStorage.removeItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`);
    localStorage.removeItem(`isNewAttempt-${mode}-${exam}-${subject}-${paper}`);
    setUserAnswers({});
    setFlaggedQuestions([]);
    setCurrentQuestionIndex(0);
    setHasPreviousAttempt(false);
  }, [exam, subject, paper, mode]);

  const calculateScoreAndCorrect = (answers: { [key: number]: string }, questions: PaperData['questions'], positiveMarking: number, negativeMarking: number) => {
    let score = 0;
    let correctCount = 0;
    questions.forEach((q) => {
      const userAnswer = answers[q.question_no];
      if (userAnswer === q.answer) {
        score += positiveMarking;
        correctCount += 1;
      } else if (userAnswer) {
        score -= negativeMarking;
      }
    });
    return { score, correct: correctCount };
  };

  const handleSubmission = useCallback(async () => {
    toast.success("Exam submitted successfully!", { autoClose: 2000 });
    const positive = paperData?.positive_marking || 1;
    const negative = paperData?.negative_marking || 0.25;
    const { score, correct: correctCount } = calculateScoreAndCorrect(userAnswers, paperData?.questions || [], positive, negative);
    const totalTimeSeconds = mode === "quiz" ? 20 * 60 : parseInt((paperData?.total_time || "2 hours").split(" ")[0], 10) * 3600;
    const timeTakenVal = Math.max(0, totalTimeSeconds - (timeLeft || 0));
    const avgTimePerQ = (paperData?.questions.length || 0) > 0 ? (timeTakenVal / (paperData?.questions.length || 1)).toFixed(1) : '0';

    if (user) {
      const attemptId = `${mode}-${exam}-${subject}-${paper}-${Date.now()}`;
      try {
        await setDoc(doc(db!, "users", user.uid, "examHistory", attemptId), {
          exam,
          subject,
          paper,
          mode,
          score,
          totalQuestions: paperData?.total_questions || 0,
          correct: correctCount,
          avgTimePerQuestion: avgTimePerQ,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error saving exam attempt:", error);
      }
    }
    // Save summary data to localStorage
    const summaryData = {
      questions: paperData?.questions || [],
      userAnswers,
      flaggedQuestions,
      totalQuestions: paperData?.total_questions || 0,
      positiveMarking: positive,
      negativeMarking: negative,
      timeTaken: timeTakenVal,
      paperName: paperData?.paper_name || "",
    };
    localStorage.setItem(`summaryData-${mode}-${exam}-${subject}-${paper}`, JSON.stringify(summaryData));
    clearLocalData();
    localStorage.setItem(`submitted-${mode}-${exam}-${subject}-${paper}`, "true");
    setSubmitted(true);
    // Redirect to /exam-report with query params
    router.push(`/exam-report?exam=${exam}&subject=${subject}&paper=${paper}&mode=${mode}`);
  }, [user, mode, exam, subject, paper, userAnswers, paperData, timeLeft, clearLocalData, router]);

  const startExam = useCallback((newAttempt: boolean = false) => {
    console.log("Starting exam, isNewAttempt:", newAttempt);
    localStorage.setItem(`isNewAttempt-${mode}-${exam}-${subject}-${paper}`, JSON.stringify(newAttempt));
    setShowAdPrompt(true);
    localStorage.removeItem(`submitted-${mode}-${exam}-${subject}-${paper}`);
    setSubmitted(false);
  }, [exam, subject, paper, mode]);

  const proceedAfterAd = useCallback(() => {
    setShowAdPrompt(false);
    setExamStarted(true);

    const savedStartTime = localStorage.getItem(`startTime-${mode}-${exam}-${subject}-${paper}`);
    const savedIsNewAttempt = JSON.parse(localStorage.getItem(`isNewAttempt-${mode}-${exam}-${subject}-${paper}`) || "true");
    console.log("Proceeding after ad, savedStartTime:", savedStartTime, "savedIsNewAttempt:", savedIsNewAttempt);

    if (!savedIsNewAttempt && savedStartTime) {
      const startTime = new Date(savedStartTime).getTime();
      const now = new Date().getTime();
      const elapsed = Math.floor((now - startTime) / 1000);
      const totalTime = paperData?.total_time || (mode === "quiz" ? "20 minutes" : "2 hours");
      const totalSeconds = mode === "quiz" ? 20 * 60 : parseInt(totalTime.split(" ")[0], 10) * 3600;
      const remaining = totalSeconds - elapsed;
      console.log("Resuming timer, remaining:", remaining);
      setTimeLeft(remaining > 0 ? remaining : 0);
    } else {
      const totalTime = paperData?.total_time || (mode === "quiz" ? "20 minutes" : "2 hours");
      const totalSeconds = mode === "quiz" ? 20 * 60 : parseInt(totalTime.split(" ")[0], 10) * 3600;
      console.log("Starting new timer, totalSeconds:", totalSeconds);
      setTimeLeft(totalSeconds);
      localStorage.setItem(`startTime-${mode}-${exam}-${subject}-${paper}`, new Date().toISOString());
    }
  }, [paperData, mode, exam, subject, paper]);

  const handleAnswerChange = useCallback((value: string) => {
    setUserAnswers((prev) => {
      const newAnswers = { ...prev, [currentQuestionIndex + 1]: value };
      console.log("UserAnswers updated:", newAnswers);
      return newAnswers;
    });
  }, [currentQuestionIndex]);

  const handleToggleFlag = useCallback(() => {
    const questionNo = currentQuestionIndex + 1;
    setFlaggedQuestions((prev) => {
      const newFlagged = prev.includes(questionNo)
        ? prev.filter((q) => q !== questionNo)
        : [...prev, questionNo].sort((a, b) => a - b);
      console.log("FlaggedQuestions updated:", newFlagged);
      return newFlagged;
    });
  }, [currentQuestionIndex]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  }, [currentQuestionIndex]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < (paperData?.total_questions || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowFinishConfirmDialog(true);
    }
  }, [currentQuestionIndex, paperData]);

  const handleFinishExam = useCallback(() => {
    setShowFinishConfirmDialog(true);
  }, []);

  const handleConfirmFinish = useCallback(() => {
    setShowFinishConfirmDialog(false);
    if (flaggedQuestions.length > 0) {
      setShowConfirmDialog(true);
    } else {
      handleSubmission();
    }
  }, [flaggedQuestions, handleSubmission]);

  const handleCancelFinish = useCallback(() => {
    setShowFinishConfirmDialog(false);
  }, []);

  const handleConfirmSubmit = useCallback(() => {
    setShowConfirmDialog(false);
    handleSubmission();
  }, [handleSubmission]);

  const handleReturnToFlagged = useCallback(() => {
    setShowConfirmDialog(false);
    if (flaggedQuestions.length > 0) {
      const unansweredFlagged = flaggedQuestions.find((q) => !userAnswers[q]);
      const targetQuestion = unansweredFlagged || flaggedQuestions[0];
      setCurrentQuestionIndex(targetQuestion - 1);
    }
  }, [flaggedQuestions, userAnswers]);

  const handleJumpToQuestion = useCallback((index: number) => {
    console.log("CurrentQuestionIndex updated to:", index);
    setCurrentQuestionIndex(index);
  }, []);

  const handleToggleNavigator = useCallback(() => {
    setShowNavigator((prev) => !prev);
  }, []);

  const decryptAnswer = useCallback((questionNo: number): string | null => {
    const encryptedAnswer = localStorage.getItem(`encryptedAnswer-${mode}-${exam}-${subject}-${paper}-${questionNo}`);
    if (!encryptedAnswer || !ENCRYPTION_KEY) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedAnswer, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8) || null;
    } catch (error) {
      console.error(`Error decrypting answer for question ${questionNo}:`, error);
      return null;
    }
  }, [exam, subject, paper, mode]);

  // useEffect hooks
  useEffect(() => {
    if (!exam || !subject || !paper || !mode) return;

    const submittedFlag = localStorage.getItem(`submitted-${mode}-${exam}-${subject}-${paper}`);
    if (submittedFlag === "true") {
      setSubmitted(true);
      setHasPreviousAttempt(false);
      return;
    }

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

  useEffect(() => {
    if (!exam || !subject || !paper || !mode) return;

    const handler = setTimeout(() => {
      localStorage.setItem(`userAnswers-${mode}-${exam}-${subject}-${paper}`, JSON.stringify(userAnswers));
      localStorage.setItem(`flaggedQuestions-${mode}-${exam}-${subject}-${paper}`, JSON.stringify(flaggedQuestions));
      localStorage.setItem(`currentQuestionIndex-${mode}-${exam}-${subject}-${paper}`, currentQuestionIndex.toString());
    }, 500);

    return () => clearTimeout(handler);
  }, [userAnswers, flaggedQuestions, currentQuestionIndex, exam, subject, paper, mode]);

  useEffect(() => {
    if (!exam || !subject || !paper || !mode) return;

    const fetchPaperContent = async () => {
      console.log("Fetching paper, mode:", mode, "path:", `${mode}/${exam}/${subject}/${paper}`);
      setLoading(true);
      try {
        const collectionPath = mode === "quiz" ? "quizzes" : "exams";
        const paperDocRef = doc(db!, `${collectionPath}/${exam}/${subject}/${paper}`);
        const paperDoc = await getDoc(paperDocRef);
        console.log("Fetched paper data:", paperDoc.data());
        if (paperDoc.exists()) {
          const data = paperDoc.data() as PaperData;
          if (data.questions) {
            data.questions.forEach((q) => {
              if (q.answer && ENCRYPTION_KEY) {
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

  useEffect(() => {
    console.log("PaperPage rendered");
  }, []);

  useEffect(() => {
    if (!examStarted || timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        console.log("TimeLeft updated:", prev);
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          handleSubmission();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeLeft, handleSubmission]);

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="text-center text-lg text-muted-foreground py-12">Loading...</div>
      </Layout>
    );
  }

  if (!paperData) {
    return (
      <Layout>
        <div className="text-center text-lg text-muted-foreground py-12">Paper not found.</div>
      </Layout>
    );
  }

  const totalQuestionsVal = paperData.total_questions || 0;
  const questionsList = paperData.questions || [];
  const totalTime = mode === "quiz" ? 20 * 60 : parseInt((paperData.total_time || "2 hours").split(" ")[0], 10) * 3600;

  return (
    <Layout>
      {!examStarted && (
        <StartScreen
          paperData={paperData}
          hasPreviousAttempt={hasPreviousAttempt && !submitted}
          onStartExam={startExam}
          isLoggedIn={isLoggedIn}
        />
      )}
      {showAdPrompt && (
        <AdPrompt
          paperName={paperData.paper_name || ""}
          onProceed={proceedAfterAd}
          adType="video"
          videoUrl="https://www.youtube.com/watch?v=NuI2u_9it4o"
        />
      )}
      {examStarted && !showConfirmDialog && !showFinishConfirmDialog && (
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
      {showFinishConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-black rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Confirm Submission</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to submit your attempt? You will not be able to make changes after submission.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelFinish}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFinish}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Flagged Questions Detected</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              You have {flaggedQuestions.length} flagged question(s): Q{flaggedQuestions.join(", Q")}. Would you like to review them?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleReturnToFlagged}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Review Flagged
              </button>
              <button
                onClick={handleConfirmSubmit}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}