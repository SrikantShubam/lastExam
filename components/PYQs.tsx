// "use client";

// import { motion } from "framer-motion";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export default function PYQSection() {
//   return (
//     <section id="pyq" className="px-8 py-16 bg-background text-foreground">
     
//       <motion.h2
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8, ease: "easeOut" }}
//         className="text-4xl md:text-6xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
//       >
//         Practice with PYQs
//       </motion.h2>
//       <motion.p
//         className="text-lg text-muted-foreground text-center mt-4"
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.2 }}
//       >
//         Prepare smarter with past year questions—test your skills now!
//       </motion.p>

//       {/* PYQ Cards */}
//       <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
//         {[
//           { title: "Subject 1", description: "Practice questions from past exams." },
//           { title: "Subject 2", description: "Improve your skills with real questions." },
//           { title: "Subject 3", description: "Master concepts with previous papers." },
//         ].map((pyq, index) => (
//           <motion.div
//             key={index}
//             className="flex flex-col items-center text-center"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
//           >
//             <Card className="p-6 border border-border rounded-xl shadow-lg bg-card">
//               <CardContent>
//                 <h3 className="text-xl font-bold">{pyq.title}</h3>
//                 <p className="text-muted-foreground mt-2">{pyq.description}</p>
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>

//       {/* CTA Button */}
//       <motion.div
//         className="mt-10 flex justify-center"
//         initial={{ opacity: 0, scale: 0.8 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.4, delay: 0.7 }}
//       >
//         <Link href="/pyqs">
//           <Button className="px-6 py-3 text-lg rounded-lg font-semibold bg-primary text-primary-foreground shadow-lg hover:shadow-primary/80 transition">
//             Explore All PYQs
//           </Button>
//         </Link>
//       </motion.div>
//     </section>
//   );
// }

"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useCallback } from "react";

// Particle initialization callback
const particlesInit = async (engine) => {
  await loadSlim(engine);
};

export default function PYQSection() {
  // Define subjects with image paths
  const subjects = [
    {
      title: "Mathematics",
      description: "Master calculus, algebra, and more with comprehensive question papers.",
      image: "/images/math.svg", // Replace with actual image path
      count: "250+ Questions",
    },
    {
      title: "Physics",
      description: "Practice mechanics, thermodynamics, and electricity with past papers.",
      image: "/images/physics.svg",
      count: "180+ Questions",
    },
    {
      title: "Computer Science",
      description: "Test your knowledge of algorithms, data structures, and programming.",
      image: "/images/computer-science.svg",
      count: "210+ Questions",
    },
  ];

  // Animation variants
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
      transition: { duration: 0.5, type: "spring", stiffness: 120 },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.98 },
    arrow: {
      x: [0, 5, 0],
      transition: { repeat: Infinity, duration: 1.5 },
    },
  };

  return (
    <section id="pyq" className="relative px-6 py-24 bg-background text-foreground overflow-hidden">
      {/* Particle Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            particles: {
              number: { value: 30, density: { enable: true, value_area: 800 } },
              color: { value: ["#000000", "#ffffff"] }, // Primary/secondary colors
              shape: { type: "circle" },
              opacity: { value: 0.1, random: true },
              size: { value: 3, random: true },
              move: {
                enable: true,
                speed: 0.5,
                direction: "none",
                random: true,
                out_mode: "out",
              },
            },
            interactivity: {
              events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
              },
              modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: 4 },
              },
            },
            retina_detect: true,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Heading Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-heading">
            Practice with PYQs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Prepare smarter with past year questions—test your skills now!
          </p>
        </motion.div>

        {/* Cards Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {subjects.map((subject, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 },
              }}
              className="relative h-full"
            >
              <Card className="h-full border border-border rounded-xl bg-card hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <CardContent className="p-6 flex flex-col items-start space-y-4">
                  {/* Image */}
                  <div className="relative w-12 h-12 mb-4">
                    <Image
                      src={subject.image}
                      alt={`${subject.title} illustration`}
                      fill
                      className="object-contain text-primary"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">{subject.title}</h3>
                  <p className="text-muted-foreground text-sm">{subject.description}</p>
                  <p className="text-sm font-medium text-primary">{subject.count}</p>
                </CardContent>
              </Card>
              {/* Subtle gradient border on hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-primary/20 group-hover:to-secondary/20 rounded-xl pointer-events-none transition-all duration-300" />
            </motion.div>
          ))}
        </motion.div>

        {/* Button Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 text-center"
        >
          <Link href="/pyqs">
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button className="px-8 py-4 text-lg rounded-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all shadow-lg shadow-primary/20">
                <span>Explore All PYQs</span>
                <motion.span variants={buttonVariants} animate="arrow" className="ml-2">
                  <FiArrowRight className="h-5 w-5" />
                </motion.span>
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}