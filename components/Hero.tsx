// // 8️⃣ Create Hero Section Component (components/Hero.tsx)
// "use client";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { motion } from "framer-motion";

// export default function Hero() {
//   return (
//     <section className="relative flex flex-col items-center text-center py-32 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-primary/10 to-background text-foreground overflow-hidden">
//       {/* Background Animation */}
//       <div className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent opacity-30 blur-3xl -z-10" />
      
//       {/* Animated Title */}
//       <motion.h1 
//         initial={{ opacity: 0, y: -20 }} 
//         animate={{ opacity: 1, y: 0 }} 
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="text-4xl md:text-5xl font-bold leading-tight max-w-4xl"
//       >
//         Your Ultimate <span className="text-primary">Exam Repository</span>
//       </motion.h1>
      
//       {/* Animated Subtitle */}
//       <motion.p
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
//         className="mt-4 text-lg text-muted-foreground max-w-2xl"
//       >
//         Find, track, and prepare for exams with the most up-to-date information and resources.
//       </motion.p>
      
//       {/* Animated CTA Buttons */}
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
//         className="mt-6 flex gap-4"
//       >
//         <Link href="/explore">
//         <Button 
//     size="lg" variant="outline"
//     className="px-2 rounded-md py-2 text-[1.1rem] shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
//   > Explore Exams </Button>
//         </Link>
//         <Link href="/signup">
//           <Button variant="outline" size="lg" className="px-2 rounded-md py-2 text-[1.1rem] shadow-lg shadow-primary/20 hover:scale-105 transition-transform">Sign Up</Button>
//         </Link>
//       </motion.div>
//     </section>
//   );
// }


"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex flex-col items-center text-center py-24 px-4 bg-white dark:bg-black text-black dark:text-white overflow-hidden">
      {/* Background Animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 border border-black dark:border-white opacity-5"
      />
      
      {/* Animated Line */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "2rem" }}
        transition={{ duration: 0.8 }}
        className="absolute top-12 h-px bg-black dark:bg-white"
      />
      
      {/* Title with Animation */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl md:text-4xl font-medium leading-tight max-w-xl mt-10"
      >
        YOUR ULTIMATE <motion.span 
          initial={{ borderBottomWidth: 0 }}
          animate={{ borderBottomWidth: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="border-black dark:border-white border-b-0"
        >EXAM REPOSITORY</motion.span>
      </motion.h1>
      
      {/* Subtitle with Animation */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="mt-6 text-sm md:text-base max-w-lg"
      >
        Find, track, and prepare for exams with the most up-to-date information and resources.
      </motion.p>
      
      {/* CTA Buttons with Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        className="mt-10 flex flex-col sm:flex-row gap-4"
      >
        <Link href="/explore">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 border border-black dark:border-white text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            EXPLORE
          </motion.button>
        </Link>
        <Link href="/signup">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 border border-black dark:border-white text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            SIGN UP
          </motion.button>
        </Link>
      </motion.div>
      
      {/* Animated Line */}
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "2rem" }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-12 h-px bg-black dark:bg-white"
      />
    </section>
  );
}