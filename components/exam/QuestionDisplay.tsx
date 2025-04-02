import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

const QuestionDisplay = ({ question, userAnswer, onAnswerChange }) => {
  return (
    <>
      {/* Question */}
      {question.question ? (
        <div className="mb-3">
          <p className="font-semibold text-lg">
            Q{question.question_no}. {question.question}
          </p>
        </div>
      ) : (
        <div className="mb-3 text-red-600">
          Question data incomplete
          {console.error(`Missing question data for Q${question.question_no}`)}
        </div>
      )}

      {/* Diagram */}
      {question.diagram && (
        <div className="mb-3">
          <Image
            src={question.diagram}
            alt={`Diagram for question ${question.question_no}`}
            width={500}
            height={300}
            loading="lazy"
            className="mx-auto max-w-[500px]"
          />
        </div>
      )}

      {/* Options/Input based on question type */}
      {question.question_type === "mcq" ? (
        question.options ? (
          <RadioGroup
            value={userAnswer || ""}
            onValueChange={onAnswerChange}
            className="space-y-2" // Increased spacing between options
          >
            {["a", "b", "c", "d"].map((key) => {
              const value = question.options[key];
              if (!value) return null;
              return (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={key}
                    id={`option-${key}-${question.question_no}`}
                    aria-label={`Option ${key}: ${value}`}
                  />
                  <Label htmlFor={`option-${key}-${question.question_no}`}>
                    {key}. {value}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        ) : (
          <div className="text-red-600">
            Options missing for this question
            {console.error(`Missing options for Q${question.question_no}`)}
          </div>
        )
      ) : question.question_type === "fill-in-the-blanks" ? (
        <div className="space-y-2">
          <Input
            value={userAnswer || ""}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Enter your answer"
            aria-label={`Answer for question ${question.question_no}`}
          />
        </div>
      ) : (
        <p className="text-muted-foreground">
          Unsupported question type: {question.question_type}
        </p>
      )}
    </>
  );
};

export default QuestionDisplay;