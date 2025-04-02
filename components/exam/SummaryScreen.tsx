const SummaryScreen = ({
    questions,
    userAnswers,
    flaggedQuestions,
    totalQuestions,
    positiveMarking,
    negativeMarking,
    onBack,
    decryptAnswer,
  }) => {
    const calculateScore = () => {
      let score = 0;
      questions.forEach((q) => {
        const userAnswer = userAnswers[q.question_no];
        const correctAnswer = decryptAnswer(q.answer);
        if (!correctAnswer) return;
  
        if (q.question_type === "mcq") {
          if (userAnswer && userAnswer === correctAnswer) {
            score += positiveMarking;
          } else if (userAnswer) {
            score -= negativeMarking;
          }
        } else if (q.question_type === "fill-in-the-blanks") {
          if (userAnswer) {
            const user = userAnswer.toLowerCase().trim().replace(/\s+/g, "");
            const correct = correctAnswer.toLowerCase().trim().replace(/\s+/g, "");
            if (user === correct) {
              score += positiveMarking;
            } else {
              score -= negativeMarking;
            }
          }
        }
      });
      return score;
    };
  
    const score = calculateScore();
  
    return (
      <section className="py-12 px-6 md:px-12 lg:px-24 bg-background text-foreground min-h-screen">
        <h1 className="text-3xl font-bold mb-4 text-center">Submission Summary</h1>
        <p className="text-center text-muted-foreground mb-6">
          Total Score: {score} / {totalQuestions * positiveMarking}
        </p>
        <div className="max-w-3xl mx-auto">
          {questions.map((q, index) => {
            const correctAnswerKey = decryptAnswer(q.answer);
            const userAnswerKey = userAnswers[q.question_no];
            const correctAnswerValue = correctAnswerKey ? q.options?.[correctAnswerKey] : null;
            const userAnswerValue = userAnswerKey ? q.options?.[userAnswerKey] : null;
  
            return (
              <div
                key={q.question_no}
                className={`mb-4 p-4 border rounded ${
                  flaggedQuestions.includes(q.question_no) ? "border-yellow-500" : ""
                }`}
              >
                <p className="font-semibold">
                  Q{q.question_no}. {q.question}
                </p>
                <p>
                  Your Answer: {userAnswerValue || "Not answered"}
                </p>
                <p>
                  Correct Answer: {correctAnswerValue || "Error displaying answer"}
                </p>
                <p
                  className={
                    userAnswerKey &&
                    correctAnswerKey &&
                    (q.question_type === "mcq"
                      ? userAnswerKey === correctAnswerKey
                      : userAnswerKey.toLowerCase().trim().replace(/\s+/g, "") ===
                        correctAnswerKey.toLowerCase().trim().replace(/\s+/g, ""))
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {userAnswerKey &&
                  correctAnswerKey &&
                  (q.question_type === "mcq"
                    ? userAnswerKey === correctAnswerKey
                    : userAnswerKey.toLowerCase().trim().replace(/\s+/g, "") ===
                      correctAnswerKey.toLowerCase().trim().replace(/\s+/g, ""))
                    ? "Correct"
                    : "Incorrect"}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center mt-6">
          <Button onClick={onBack}>
            Back to Papers
          </Button>
        </div>
      </section>
    );
  };
  
  export default SummaryScreen;