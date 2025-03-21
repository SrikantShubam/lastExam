"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function QuestionCard({ question, index }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowAnswer(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-4 mb-4 border border-black/20 dark:border-white/20 rounded-lg bg-white/5 dark:bg-black/5"
    >
      <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
        {index}. {question.text}
      </h3>
      <div className="space-y-2">
        {question.options.map((option, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOptionSelect(option)}
            className={`w-full text-left p-2 rounded-md border border-black/20 dark:border-white/20 ${
              selectedOption === option
                ? option === question.correctAnswer
                  ? "bg-green-500/20 text-black dark:text-white"
                  : "bg-red-500/20 text-black dark:text-white"
                : "bg-transparent text-black dark:text-white hover:bg-white/10 dark:hover:bg-white/10"
            }`}
            disabled={showAnswer}
          >
            {option}
          </motion.button>
        ))}
      </div>
      {showAnswer && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-2 text-gray-600 dark:text-gray-300"
        >
          Correct Answer: {question.correctAnswer}
        </motion.p>
      )}
      <Button
        variant="outline"
        className="mt-4 text-black dark:text-white border-black dark:border-white"
        onClick={() => {
          setSelectedOption(null);
          setShowAnswer(false);
        }}
      >
        Reset
      </Button>
    </motion.div>
  );
}