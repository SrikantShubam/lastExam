"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Category {
  id: number;
  name: string;
}

interface Exam {
  name: string;
  exam_date: string;
  category: string;
}

export default function ExamCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);

  // Fetch categories and exams from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data.categories);
        setExams(data.exams);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle category selection
  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setFilteredExams(
      exams.filter((exam) =>
        exam.category.split(",").map((c) => c.trim()).includes(categoryId.toString())
      )
    );
  };

  return (
    <section className="relative py-16 px-6 md:px-12 lg:px-24 bg-background text-foreground overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-background opacity-50 -z-10" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, x: Math.random() * window.innerWidth }}
            animate={{ y: window.innerHeight + 100 }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-primary/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Exam Categories
        </motion.h2>

        {/* Categories List */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-primary text-white shadow-lg"
                  : "bg-secondary/50 hover:bg-secondary/70 text-foreground"
              }`}
            >
              {category.name}
            </motion.button>
          ))}
        </div>

        {/* Exams List */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-2xl font-semibold mb-6">
                Exams in {categories.find((cat) => cat.id === selectedCategory)?.name}
              </h3>
              <div className="space-y-4">
                {filteredExams.length > 0 ? (
                  filteredExams.map((exam, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{exam.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(exam.exam_date).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No exams found for this category.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}