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


// "use client";
// import Link from "next/link";
// import { motion } from "framer-motion";

// export default function Hero() {
//   return (
//     <section className="relative flex flex-col items-center text-center py-24 px-4 bg-white dark:bg-black text-black dark:text-white overflow-hidden">
//       {/* Background Animation */}
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.5 }}
//         transition={{ duration: 1.5 }}
//         className="absolute inset-0 border border-black dark:border-white opacity-5"
//       />
      
//       {/* Animated Line */}
//       <motion.div 
//         initial={{ width: 0 }}
//         animate={{ width: "2rem" }}
//         transition={{ duration: 0.8 }}
//         className="absolute top-12 h-px bg-black dark:bg-white"
//       />
      
//       {/* Title with Animation */}
//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="text-3xl md:text-4xl font-medium leading-tight max-w-xl mt-10"
//       >
//         YOUR ULTIMATE <motion.span 
//           initial={{ borderBottomWidth: 0 }}
//           animate={{ borderBottomWidth: 1 }}
//           transition={{ duration: 0.8, delay: 0.8 }}
//           className="border-black dark:border-white border-b-0"
//         >EXAM REPOSITORY</motion.span>
//       </motion.h1>
      
//       {/* Subtitle with Animation */}
//       <motion.p
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
//         className="mt-6 text-sm md:text-base max-w-lg"
//       >
//         Find, track, and prepare for exams with the most up-to-date information and resources.
//       </motion.p>
      
//       {/* CTA Buttons with Animation */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
//         className="mt-10 flex flex-col sm:flex-row gap-4"
//       >
//         <Link href="/explore">
//           <motion.button 
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="px-6 py-2 border border-black dark:border-white text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
//           >
//             EXPLORE
//           </motion.button>
//         </Link>
//         <Link href="/signup">
//           <motion.button 
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             className="px-6 py-2 border border-black dark:border-white text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
//           >
//             SIGN UP
//           </motion.button>
//         </Link>
//       </motion.div>
      
//       {/* Animated Line */}
//       <motion.div 
//         initial={{ width: 0 }}
//         animate={{ width: "2rem" }}
//         transition={{ duration: 0.8 }}
//         className="absolute bottom-12 h-px bg-black dark:bg-white"
//       />
//     </section>
//   );
// }

// "use client";

// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button"; // ShadCN Button
// import Link from "next/link";

// // Animation Variants
// const containerVariants = {
//   initial: { opacity: 0 },
//   animate: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.2,
//       delayChildren: 0.3,
//     },
//   },
// };

// const fadeInUp = {
//   initial: { opacity: 0, y: 30 },
//   animate: { opacity: 1, y: 0 },
//   transition: { duration: 0.8, ease: [0.16, 1, 0.36, 1] }, // Cubic bezier for smooth, natural motion
// };

// const scaleFade = {
//   initial: { opacity: 0, scale: 0.95 },
//   animate: { opacity: 1, scale: 1 },
//   transition: { duration: 0.6, ease: "easeOut" },
// };

// export default function Hero() {
//   return (
//     <section className="relative flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-white dark:bg-black text-black dark:text-white overflow-hidden">
//       {/* Subtle Gradient Background */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.5 }}
//         animate={{ opacity: 0.06, scale: 1 }}
//         transition={{ duration: 1.2, ease: "easeOut" }}
//         className="absolute inset-0 bg-gradient-to-tl from-gray-200/50 to-transparent dark:from-gray-900/50 rounded-full blur-3xl w-[60vw] h-[60vh] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
//       />

//       {/* Content Container */}
//       <motion.div
//         variants={containerVariants}
//         initial="initial"
//         animate="animate"
//         className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-10"
//       >
//         {/* Title */}
//         <motion.h1
//           variants={fadeInUp}
//           className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
//         >
//           Exam Prep,{" "}
//           <span className="relative inline-block">
//             <span className="relative z-10 bg-gradient-to-r from-black to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
//               Redefined
//             </span>
//             <motion.span
//               initial={{ scaleX: 0 }}
//               animate={{ scaleX: 1 }}
//               transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
//               className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-black/50 to-gray-500/50 dark:from-white/50 dark:to-gray-400/50 origin-left"
//             />
//           </span>
//         </motion.h1>

//         {/* Subtitle */}
//         <motion.p
//           variants={fadeInUp}
//           className="text-lg sm:text-xl lg:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed"
//         >
//           Streamline your study with curated resources and intuitive tools.
//         </motion.p>

//         {/* CTA Buttons */}
//         <motion.div
//           variants={scaleFade}
//           className="flex flex-col sm:flex-row gap-4 sm:gap-6"
//         >
//           <Link href="/explore">
//             <Button
//               asChild
//               variant="outline"
//               className="px-8 py-3 text-base font-medium bg-transparent border-2 border-black dark:border-white text-black dark:text-white hover:bg-gradient-to-r hover:from-black hover:to-gray-800 dark:hover:from-white dark:hover:to-gray-200 hover:text-white dark:hover:text-black transition-all duration-300 rounded-md"
//             >
//               <motion.span
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 Explore Now
//               </motion.span>
//             </Button>
//           </Link>
//           <Link href="/signup">
//             <Button
//               asChild
//               variant="default"
//               className="px-8 py-3 text-base font-medium bg-black dark:bg-white text-white dark:text-black hover:bg-gradient-to-r hover:from-black/90 hover:to-gray-700 dark:hover:from-white/90 dark:hover:to-gray-300 transition-all duration-300 rounded-md"
//             >
//               <motion.span
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 Get Started
//               </motion.span>
//             </Button>
//           </Link>
//         </motion.div>
//       </motion.div>

//       {/* Minimal Floating Accents */}
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 0.08 }}
//         transition={{ duration: 1.5, delay: 1.2 }}
//         className="absolute inset-0 pointer-events-none"
//       >
//         <motion.div
//           animate={{ y: [0, -20, 0], opacity: [0.08, 0.15, 0.08] }}
//           transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
//           className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full absolute top-1/4 left-1/5"
//         />
//         <motion.div
//           animate={{ y: [0, 20, 0], opacity: [0.08, 0.15, 0.08] }}
//           transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
//           className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full absolute bottom-1/5 right-1/6"
//         />
//       </motion.div>
//     </section>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 bg-white dark:bg-black text-black dark:text-white overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute inset-0 z-0">
        {/* Primary gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.03)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
        
        {/* Secondary diagonal gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.02)_0%,transparent_70%)] dark:bg-[linear-gradient(45deg,rgba(255,255,255,0.02)_0%,transparent_70%)]" />
        
        {/* Animated circles */}
        <motion.div 
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-800 dark:to-transparent opacity-20 blur-3xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isLoaded ? 1 : 0.8, opacity: isLoaded ? 0.2 : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        <motion.div 
          className="absolute bottom-1/3 left-1/3 w-96 h-96 rounded-full bg-gradient-to-t from-gray-200 to-transparent dark:from-gray-800 dark:to-transparent opacity-10 blur-3xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: isLoaded ? 1 : 0.8, opacity: isLoaded ? 0.15 : 0 }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgNjBIMFYwaDYwdjYweiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9Ii41Ii8+PC9nPjwvc3ZnPg==')]" />
      </div>

     

      {/* Main content container */}
      <motion.div
        className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Overline */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="text-xs font-medium tracking-widest uppercase opacity-70">Your Ultimate Resource</div>
        </motion.div>

        {/* Title */}
        <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none mb-6">
          <span className="block">Exam</span>
          <span className="relative inline-block">
            Repository
            <motion.span
              className="absolute -bottom-2 left-0 w-full h-px bg-black dark:bg-white"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isLoaded ? 1 : 0 }}
              transition={{ duration: 1.2, delay: 1, ease: "easeInOut" }}
            />
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="max-w-md text-base md:text-lg opacity-80 mb-12"
        >
          Find, track, and prepare for exams with the most up-to-date information and resources.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/pyqs">
            <Button
              variant="default"
              className="min-w-40 bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 rounded-none border border-black dark:border-white px-8 py-6 text-sm font-medium tracking-wide uppercase transition-all duration-300"
            >
              Explore Exams
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="outline"
              className="min-w-40 bg-transparent text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-none border border-black dark:border-white px-8 py-6 text-sm font-medium tracking-wide uppercase transition-all duration-300"
            >
              Sign Up
            </Button>
          </Link>
        </motion.div>
      </motion.div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute bottom-12 right-12 w-32 h-32 md:w-44 md:h-44"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 0.7 : 0 }}
        transition={{ duration: 1.2, delay: 0.8 }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <circle cx="50" cy="50" r="49" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" className="opacity-30" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" className="opacity-50" />
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute top-24 left-12 w-20 h-20 md:w-28 md:h-28"
        initial={{ opacity: 0, rotate: -10 }}
        animate={{ opacity: isLoaded ? 0.6 : 0, rotate: isLoaded ? 0 : -10 }}
        transition={{ duration: 1.2, delay: 0.5 }}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect x="20" y="20" width="60" height="60" stroke="currentColor" strokeWidth="0.5" className="opacity-40" />
          <rect x="35" y="35" width="30" height="30" stroke="currentColor" strokeWidth="0.5" className="opacity-70" />
        </svg>
      </motion.div>
    </section>
  );
}