"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

// Testimonials Data
const testimonials = [
  { id: 1, image: "/testimonials/testimonial-1.png" },
  { id: 2, image: "/testimonials/testimonial-2.png" },
  { id: 3, image: "/testimonials/testimonial-3.png" },
  { id: 4, image: "/testimonials/testimonial-7.png" },
  { id: 5, image: "/testimonials/testimonial-5.png" },
  { id: 6, image: "/testimonials/testimonial-6.png" },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-8 py-16 bg-background text-foreground">
     
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-6xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
      >
       What Redditors Say About Us
      </motion.h2>
      <div className="mt-10 relative w-full max-w-lg mx-auto overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={testimonials[currentIndex].id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <Image
              src={testimonials[currentIndex].image}
              alt="Testimonial"
              width={500}
              height={350}
              className="rounded-lg shadow-lg"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-4 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? "bg-primary w-4" : "bg-muted"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
