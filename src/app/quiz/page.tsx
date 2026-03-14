"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardCardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

interface QuizData {
  [key: string]: Question[];
}

const QUIZ_DATA: QuizData = {
  Mathematics: [
    {
      id: 1,
      question: "What is the value of π to two decimal places?",
      options: ["3.12", "3.14", "3.16", "3.18"],
      correctIndex: 1,
    },
    {
      id: 2,
      question: "Solve: 2x + 5 = 15",
      options: ["x = 5", "x = 10", "x = 15", "x = 20"],
      correctIndex: 0,
    },
    {
      id: 3,
      question: "What is the derivative of x²?",
      options: ["x", "2x", "x²", "2"],
      correctIndex: 1,
    },
    {
      id: 4,
      question: "What is the area of a circle with radius 5?",
      options: ["15π", "20π", "25π", "30π"],
      correctIndex: 2,
    },
    {
      id: 5,
      question: "What is the value of sin(90°)?",
      options: ["0", "1", "-1", "0.5"],
      correctIndex: 1,
    },
  ],
  Physics: [
    {
      id: 1,
      question: "What is the SI unit of force?",
      options: ["Watt", "Newton", "Joule", "Pascal"],
      correctIndex: 1,
    },
    {
      id: 2,
      question: "What is the speed of light in vacuum?",
      options: ["3×10^6 m/s", "3×10^8 m/s", "3×10^10 m/s", "3×10^12 m/s"],
      correctIndex: 1,
    },
    {
      id: 3,
      question: "Which law explains the buoyant force?",
      options: ["Newton's First Law", "Archimedes' Principle", "Ohm's Law", "Pascal's Law"],
      correctIndex: 1,
    },
    {
      id: 4,
      question: "What is the unit of electric current?",
      options: ["Volt", "Ampere", "Ohm", "Coulomb"],
      correctIndex: 1,
    },
    {
      id: 5,
      question: "What type of waves are sound waves?",
      options: ["Transverse", "Longitudinal", "Electromagnetic", "Standing"],
      correctIndex: 1,
    },
  ],
  "Computer Science": [
    {
      id: 1,
      question: "What does CPU stand for?",
      options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Unit", "Computer Processing Unit"],
      correctIndex: 0,
    },
    {
      id: 2,
      question: "Which data structure follows LIFO principle?",
      options: ["Queue", "Array", "Stack", "Linked List"],
      correctIndex: 2,
    },
    {
      id: 3,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctIndex: 1,
    },
    {
      id: 4,
      question: "Which paradigm focuses on 'objects'?",
      options: ["Procedural", "Object-Oriented", "Functional", "Imperative"],
      correctIndex: 1,
    },
    {
      id: 5,
      question: "What is the output of 2 << 3 in binary?",
      options: ["16", "8", "32", "4"],
      correctIndex: 0,
    },
  ],
  Chemistry: [
    {
      id: 1,
      question: "What is the atomic number of Carbon?",
      options: ["4", "6", "8", "12"],
      correctIndex: 1,
    },
    {
      id: 2,
      question: "Which gas is used in soft drinks?",
      options: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Hydrogen"],
      correctIndex: 2,
    },
    {
      id: 3,
      question: "What is pH scale measure?",
      options: ["Temperature", "Acidity/Basicity", "Density", "Pressure"],
      correctIndex: 1,
    },
    {
      id: 4,
      question: "Which element has the symbol 'Fe'?",
      options: ["Fluorine", "Iron", "Francium", "Fermium"],
      correctIndex: 1,
    },
    {
      id: 5,
      question: "What type of bond is CO₂?",
      options: ["Ionic", "Covalent", "Metallic", "Hydrogen"],
      correctIndex: 1,
    },
  ],
  Biology: [
    {
      id: 1,
      question: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"],
      correctIndex: 1,
    },
    {
      id: 2,
      question: "How many bones are in the adult human body?",
      options: ["186", "206", "226", "246"],
      correctIndex: 1,
    },
    {
      id: 3,
      question: "What is the largest organ in the human body?",
      options: ["Heart", "Liver", "Brain", "Skin"],
      correctIndex: 3,
    },
    {
      id: 4,
      question: "Which blood type is the universal donor?",
      options: ["Type A", "Type B", "Type AB", "Type O negative"],
      correctIndex: 3,
    },
    {
      id: 5,
      question: "What process do plants use to make food?",
      options: ["Respiration", "Photosynthesis", "Digestion", "Fermentation"],
      correctIndex: 1,
    },
  ],
};

const SUBJECTS = Object.keys(QUIZ_DATA);
const QUIZ_DURATION = 300; // 5 minutes in seconds
const POINTS_PER_QUESTION = 10;

type QuizState = "select-subject" | "active" | "completed";

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>("select-subject");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Restore quiz progress from sessionStorage
  useEffect(() => {
    const savedState = sessionStorage.getItem("quizState");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      setQuizState(parsed.quizState || "select-subject");
      setSelectedSubject(parsed.selectedSubject || "");
      setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
      setScore(parsed.score || 0);
      setTimeLeft(parsed.timeLeft || QUIZ_DURATION);
      setUserAnswers(parsed.userAnswers || []);
      if (parsed.selectedSubject) {
        setQuestions(QUIZ_DATA[parsed.selectedSubject] || []);
      }
    }
  }, []);

  // Save quiz progress to sessionStorage
  useEffect(() => {
    const stateToSave = {
      quizState,
      selectedSubject,
      currentQuestionIndex,
      score,
      timeLeft,
      userAnswers,
    };
    sessionStorage.setItem("quizState", JSON.stringify(stateToSave));
  }, [quizState, selectedSubject, currentQuestionIndex, score, timeLeft, userAnswers]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (quizState === "active" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleQuizComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [quizState, timeLeft]);

  const handleSelectSubject = (subject: string) => {
    setSelectedSubject(subject);
    setQuestions(QUIZ_DATA[subject]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setTimeLeft(QUIZ_DURATION);
    setQuizState("active");
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;

    const newScore = isCorrect ? score + POINTS_PER_QUESTION : score;
    const newUserAnswers = [...userAnswers, selectedAnswer];

    setScore(newScore);
    setUserAnswers(newUserAnswers);
    setSelectedAnswer(null);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz completed
      setScore(newScore);
      setQuizState("completed");
    }
  };

  const handleQuizComplete = () => {
    setQuizState("completed");
  };

  const handleRestart = () => {
    sessionStorage.removeItem("quizState");
    setQuizState("select-subject");
    setSelectedSubject("");
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setTimeLeft(QUIZ_DURATION);
    setQuestions([]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (quizState === "select-subject") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Quiz Time!</h1>
            <p className="text-lg text-muted-foreground">
              Test your knowledge with our quick quizzes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SUBJECTS.map((subject) => (
              <Card key={subject} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{subject}</CardTitle>
                  <CardDescription>
                    {QUIZ_DATA[subject as keyof QuizData]?.length} questions • 5 minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleSelectSubject(subject)}
                    className="w-full"
                  >
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (quizState === "active" && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">
                    {selectedSubject}
                  </Badge>
                  <CardTitle className="text-xl">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </CardTitle>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Time Left</div>
                  <div className={`text-2xl font-bold ${timeLeft < 60 ? "text-destructive" : ""}`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Question Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className={`w-full justify-start text-left p-4 h-auto ${
                      selectedAnswer === index ? "bg-primary text-primary-foreground" : ""
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  size="lg"
                >
                  {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (quizState === "completed") {
    const totalPoints = questions.length * POINTS_PER_QUESTION;
    const percentage = Math.round((score / totalPoints) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
              <CardDescription>{selectedSubject}</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="p-6 bg-primary/10 rounded-lg">
                <div className="text-5xl font-bold text-primary mb-2">{score}</div>
                <div className="text-muted-foreground">Points Earned</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Correct Answers</span>
                  <span className="font-semibold">
                    {score / POINTS_PER_QUESTION} / {questions.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Accuracy</span>
                  <span className="font-semibold">{percentage}%</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  Great job practicing! Points contribute to your leaderboard ranking.
                </p>
                <Button onClick={handleRestart} className="w-full" size="lg">
                  Try Another Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
