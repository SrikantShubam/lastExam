"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Atom, CircuitBoard, FlaskConical, Leaf, TrendingUp } from "lucide-react";

export default function PYQsPage() {
  const subjects = [
    {
      name: "Mathematics",
      icon: Calculator,
      questionCount: 250,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "Physics",
      icon: Atom,
      questionCount: 180,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      name: "Computer Science",
      icon: CircuitBoard,
      questionCount: 210,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      name: "Chemistry",
      icon: FlaskConical,
      questionCount: 165,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      name: "Biology",
      icon: Leaf,
      questionCount: 145,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
  ];

  const popularQuestions = [
    {
      id: 1,
      subject: "Mathematics",
      question: "Find the derivative of x³ + 2x² - x + 1",
      difficulty: "Medium",
      attempts: 1250,
    },
    {
      id: 2,
      subject: "Physics",
      question: "Calculate the force required to accelerate a 5kg mass at 10m/s²",
      difficulty: "Easy",
      attempts: 980,
    },
    {
      id: 3,
      subject: "Computer Science",
      question: "What is the time complexity of binary search?",
      difficulty: "Medium",
      attempts: 1100,
    },
    {
      id: 4,
      subject: "Chemistry",
      question: "Balance the combustion reaction of methane",
      difficulty: "Easy",
      attempts: 850,
    },
    {
      id: 5,
      subject: "Biology",
      question: "Explain the process of photosynthesis in plants",
      difficulty: "Medium",
      attempts: 720,
    },
    {
      id: 6,
      subject: "Mathematics",
      question: "Solve the quadratic equation: 2x² - 5x + 3 = 0",
      difficulty: "Easy",
      attempts: 1050,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Past Year Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practice with questions from past exams across all subjects
          </p>
        </motion.div>

        {/* Subjects Grid */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Subject</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.name}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full border border-border rounded-xl bg-card hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className={`w-16 h-16 ${subject.bgColor} rounded-full flex items-center justify-center`}>
                      <subject.icon className={`w-8 h-8 ${subject.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{subject.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {subject.questionCount} Questions
                    </p>
                    <Button className="w-full mt-2">Explore</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Popular Questions */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center flex items-center justify-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            Popular Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularQuestions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full border border-border rounded-xl bg-card hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {q.subject}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          q.difficulty === "Easy"
                            ? "bg-green-500/10 text-green-500"
                            : q.difficulty === "Medium"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2">
                      {q.question}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{q.attempts} attempts</span>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
