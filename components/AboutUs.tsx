"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaUsers, FaBookOpen, FaHandsHelping } from "react-icons/fa";

export default function AboutUs() {
  return (
    <section className="px-8 py-16 bg-background text-foreground" id="about">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-6xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
      >
        How It Started
      </motion.h2>

      {/* Content Wrapper */}
      <div className="mt-10 max-w-3xl mx-auto space-y-6">
        <motion.p
          className="text-lg text-muted-foreground text-center leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          At Examtards, we know that deciding what to do after passing class 10th or 12th can be tough. Many students end up choosing common fields like engineering or medicine because they don’t know about other options.
        </motion.p>

        <motion.p
          className="text-lg text-muted-foreground text-center leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          We want to change that by offering a place where students can learn about all kinds of exams and career paths.
        </motion.p>
      </div>

      {/* Goals Section */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {[
          {
            title: "Inclusivity",
            description: "Share information on many different exams and careers.",
            icon: <FaUsers className="text-3xl text-primary" />,
          },
          {
            title: "Accessibility",
            description: "Provide easy-to-use resources like quizzes and past exam papers.",
            icon: <FaBookOpen className="text-3xl text-primary" />,
          },
          {
            title: "Support",
            description: "Build a community where students can share experiences and advice.",
            icon: <FaHandsHelping className="text-3xl text-primary" />,
          },
        ].map((goal, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <Card className="p-6 border border-border rounded-xl shadow-md bg-card w-full">
              <CardContent className="flex flex-col items-center">
                {goal.icon}
                <h3 className="text-xl font-bold mt-4">{goal.title}</h3>
                <p className="text-muted-foreground mt-2">{goal.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* How We Operate Section */}
      <div className="mt-24 max-w-4xl mx-auto">
        <motion.h3
          className="text-2xl font-bold text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          How We Operate
        </motion.h3>

        <motion.p
          className="text-lg text-muted-foreground text-center leading-relaxed mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Our platform depends on the generous contributions of students. By donating previous year questions (PYQs), notes, and other materials, students help us keep the website free and cost-effective. These contributions are crucial for us to build valuable features and resources.
        </motion.p>

        <motion.p
          className="text-lg text-muted-foreground text-center leading-relaxed mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          To cover our costs and continue providing these services, we rely on ads. We strive to keep them minimal and non-intrusive, ensuring a smooth user experience.
        </motion.p>
      </div>

      {/* CTA Button */}
      <motion.div
        className="mt-10 flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <Link href="/quiz">
          <Button className="px-6 py-3 text-lg rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition">
            Try a Free Quiz
          </Button>
        </Link>
      </motion.div>
    </section>
  );
}
