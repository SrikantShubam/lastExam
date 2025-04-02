import { Button } from "@/components/ui/button";
import { FiClock } from "react-icons/fi";
import { motion } from "framer-motion";
import QuestionDisplay from "./QuestionDisplay";
import ProgressDisplay from "./ProgressDisplay";

const ExamScreen = ({
  paperData,
  currentQuestionIndex,
  userAnswers,
  flaggedQuestions,
  timeLeft,
  showNavigator,
  formatTime,
  onAnswerChange,
  onToggleFlag,
  onPrevious,
  onNext,
  onJumpToQuestion,
  onToggleNavigator,
}) => {
  const questions = paperData.questions || [];
  const totalQuestions = paperData.total_questions || 0;
  const currentQuestion = questions[currentQuestionIndex] || {};

  // Find directions for the current question
  const getDirectionsForQuestion = (questionNo) => {
    const questionDirections = paperData.question_directions || [];
    if (!questionDirections.length) return null;
    const direction = questionDirections.find((dir) => {
      const [start, end] = dir.range.split("-").map(Number);
      return questionNo >= start && questionNo <= end;
    });
    return direction ? direction.text : null;
  };

  const directionsText = getDirectionsForQuestion(currentQuestion.question_no);

  return (
    <section className="py-12 px-6 md:px-12 lg:px-24 bg-background text-foreground min-h-screen flex items-center justify-center">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* Time Left in Top-Right Corner */}
        <div className="fixed top-4 right-6 z-20 flex items-center gap-2">
          <FiClock className={`text-lg ${timeLeft <= 300 ? "text-red-600" : "text-muted-foreground"}`} />
          <p className={`text-muted-foreground ${timeLeft <= 300 ? "text-red-600 font-semibold" : ""}`}>
            Time Left: {timeLeft !== null ? formatTime(timeLeft) : "Loading..."}
            {timeLeft <= 300 && timeLeft > 0 && " - Time is almost up!"}
          </p>
        </div>

        {/* Question Navigator in Top-Right Corner (below Time Left) */}
        <div className="fixed top-12 right-6 z-20">
          <Button onClick={onToggleNavigator} size="sm" className="shadow-sm">
            {showNavigator ? "Hide Navigator" : "Show Navigator"}
          </Button>
          {showNavigator && (
            <div className="mt-2 p-2 bg-card border rounded shadow-lg max-h-[50vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">Question Navigator</h3>
              <div className="grid grid-cols-5 gap-0.5">
                {questions.map((q, index) => (
                  <Button
                    key={q.question_no}
                    onClick={() => onJumpToQuestion(index)}
                    variant="outline"
                    className={`w-6 h-6 text-xs ${
                      flaggedQuestions.includes(q.question_no)
                        ? "bg-yellow-500 text-white"
                        : userAnswers[q.question_no]
                        ? "bg-green-500 text-white"
                        : index === currentQuestionIndex
                        ? "bg-blue-500 text-white"
                        : ""
                    }`}
                  >
                    {q.question_no}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Paper Name in Center */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">{paperData.paper_name}</h1>
        </div>

        {/* Progress and Flag Button */}
        <div className="flex items-center justify-between mb-6 max-w-3xl w-full">
          <ProgressDisplay
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            userAnswers={userAnswers}
            isFlagged={flaggedQuestions.includes(currentQuestion.question_no)}
            onToggleFlag={onToggleFlag}
          />
        </div>

        {/* Current Question */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="max-w-3xl w-full"
        >
          {/* Directions */}
          {directionsText && (
            <div className="mb-3 p-3 bg-muted rounded">
              <p className="text-muted-foreground">{directionsText}</p>
            </div>
          )}

          {/* Question Display */}
          <QuestionDisplay
            question={currentQuestion}
            userAnswer={userAnswers[currentQuestion.question_no]}
            onAnswerChange={onAnswerChange}
          />
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-between max-w-3xl w-full mt-6">
          <Button
            onClick={onPrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            Previous
          </Button>
          <Button onClick={onNext}>
            {currentQuestionIndex === totalQuestions - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExamScreen;