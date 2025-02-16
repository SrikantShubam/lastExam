"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const categories = ["Engineering", "Medical", "Civil Services", "Law", "Commerce", "Arts & Humanities"];

export default function ExamCategories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <section className="py-32 px-6 md:px-12 lg:px-24 bg-background text-foreground text-center">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold mb-10"
      >
        Exam Categories
      </motion.h2>
      <div className="flex flex-wrap justify-center gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              onClick={() => setSelectedCategory(category)}
              className={
                `px-6 py-3 text-lg ${selectedCategory === category ? "bg-primary text-white" : ""}`
              }
            >
              {category}
            </Button>
          </motion.div>
        ))}
      </div>
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-12 text-lg text-muted-foreground"
        >
          Showing exams for <span className="font-semibold">{selectedCategory}</span>
        </motion.div>
      )}
    </section>
  );
}
