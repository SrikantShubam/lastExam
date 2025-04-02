import { Button } from "@/components/ui/button";

const ProgressDisplay = ({ currentQuestionIndex, totalQuestions, userAnswers, isFlagged, onToggleFlag }) => {
  // Calculate the number of answered questions
  const answeredCount = Object.values(userAnswers).filter((answer) => answer !== undefined && answer !== "").length;
  const remainingQuestions = totalQuestions - answeredCount;

  return (
    <div className="flex items-center gap-2">
      <p className="text-muted-foreground">
        Question {currentQuestionIndex + 1} of {totalQuestions} |{" "}
        {remainingQuestions} questions left
      </p>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleFlag}
        className={isFlagged ? "text-yellow-600" : ""}
      >
        {isFlagged ? "Unflag" : "Flag"}
      </Button>
    </div>
  );
};

export default ProgressDisplay;