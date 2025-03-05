"use client";
import { FaBook, FaClipboardList, FaTrophy, FaChartLine } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Features() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-background text-foreground text-center overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96  rounded-full " />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-secondary/10 rounded-full " />
      </div>

      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
      >
        Platform Features
      </motion.h2>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-16"
      >
        Unlock a seamless experience for tracking, organizing, and preparing for exams with our intuitive platform.
      </motion.p>
      
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {[{
          icon: <FaBook className="text-primary w-12 h-12 mb-6" />, 
          title: "Track Exams",
          description: "Get real-time updates and countdowns for upcoming exams across multiple categories."
        }, {
          icon: <FaClipboardList className="text-primary w-12 h-12 mb-6" />,
          title: "Create Custom Lists",
          description: "Save and manage exams based on your preferences to keep track of important dates and details."
        }, {
          icon: <FaTrophy className="text-primary w-12 h-12 mb-6" />,
          title: "Earn Rewards",
          description: "Participate in quizzes, earn points, and unlock exclusive content for a better exam preparation journey."
        }].map((feature, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
          >
            <Card className="p-8 flex flex-col items-center bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all hover:shadow-xl group relative overflow-hidden">
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="mb-6 flex justify-center">
                  <div className="">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground/90 leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Leaderboard Teaser */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
        className="mt-20 relative z-10"
      >
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8 backdrop-blur-sm border border-border/50">
          <div className="flex flex-col items-center">
            <div className="mb-6 p-3 rounded-full bg-primary/10 border border-primary/20">
              <FaChartLine className="text-primary w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Top Performers Leaderboard</h3>
            <p className="text-muted-foreground/90 text-lg max-w-2xl mx-auto mb-8">
              Stay motivated by competing with other aspirants and tracking your progress in real-time.
            </p>
            <Link href="/leaderboard">
              <Button 
                size="lg" 
                className="mt-4 px-8 py-6 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02]"
              >
                View Leaderboard
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}