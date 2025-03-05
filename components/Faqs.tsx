// "use client";

// import { motion } from "framer-motion";
// import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// export default function FAQSection() {
//   return (
//     <section className="relative py-8 px-2 sm:py-12 sm:px-4 md:py-24 md:px-12 lg:px-20 bg-background text-foreground">
//       <div className="max-w-8xl mx-auto">
//         {/* Heading */}
//         <motion.h2
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 sm:mb-8 md:mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
//         >
//           Frequently Asked Questions
//         </motion.h2>

//         {/* Accordion Container */}
//         <div className="max-w-3xl mx-auto">
//           <Accordion type="single" collapsible className="space-y-3">
//             {[
//               {
//                 question: "What is Examtards?",
//                 answer: "Examtards is a platform dedicated to helping students explore different career options and prepare for various exams with resources like past year questions and quizzes.",
//               },
//               {
//                 question: "Is Examtards free to use?",
//                 answer: "Yes! Our platform is completely free. We sustain ourselves through minimal and non-intrusive ads while students contribute study materials.",
//               },
//               {
//                 question: "How can I contribute past year questions (PYQs)?",
//                 answer: "You can upload your PYQs directly on our website, or email them to us. Your contributions help keep the platform valuable for everyone.",
//               },
//               {
//                 question: "Do you provide mock tests?",
//                 answer: "Yes, we have a collection of quizzes and mock tests that help students practice before their actual exams.",
//               },
//               {
//                 question: "Can I request specific study materials?",
//                 answer: "Absolutely! You can request specific PYQs or resources, and we'll try to add them based on availability.",
//               },
//             ].map((faq, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
//               >
//                 <AccordionItem
//                   value={`faq-${index}`}
//                   className="border border-muted rounded-md overflow-hidden group"
//                 >
//                   <AccordionTrigger className="w-full px-4 py-3 text-lg font-medium text-foreground bg-muted hover:bg-accent rounded-md transition-all focus:ring-2 focus:ring-accent">
//                     {faq.question}
//                   </AccordionTrigger>
//                   <AccordionContent className="px-4 py-2 bg-background text-muted-foreground rounded-b-md border-t border-muted">
//                     {faq.answer}
//                   </AccordionContent>
//                 </AccordionItem>
//               </motion.div>
//             ))}
//           </Accordion>
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import { motion } from "framer-motion";
// import { FiPlus, FiMinus } from "react-icons/fi";
// import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

// export default function FAQSection() {
//   return (
//     <section className="relative py-16 px-4 sm:px-6 lg:py-24 lg:px-8 bg-background text-foreground">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
//           {/* Abstract Graphic Section */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.8 }}
//             className="relative hidden md:block"
//           >
//             <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-15">
//               <div className="w-full h-full bg-gradient-to-br from-foreground to-transparent rounded-full mix-blend-overlay blur-3xl" />
//             </div>
            
//             <div className="relative space-y-8">
//               <div className="h-48 w-48 bg-foreground/10 rounded-2xl rotate-45 transform origin-bottom-right" />
//               <div className="h-32 w-32 bg-foreground/20 rounded-full ml-auto -mt-12" />
//               <div className="h-40 w-40 bg-foreground/15 rounded-2xl rotate-12 transform -translate-x-8" />
//             </div>
//           </motion.div>

//           {/* FAQ Content */}
//           <div>
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6 }}
//               className="mb-12 lg:mb-16"
//             >
//               <h2 className="text-4xl sm:text-5xl font-bold mb-4">
//                 Common Questions
//               </h2>
//               <p className="text-muted-foreground">
//                 Everything you need to know. Can't find an answer? Contact us directly.
//               </p>
//             </motion.div>

//             <Accordion type="single" collapsible className="space-y-4">
//               {[
//                 {
//                   question: "What is Examtards?",
//                   answer: "Examtards is a platform dedicated to helping students explore different career options and prepare for various exams with resources like past year questions and quizzes.",
//                 },
//                 // ... keep other FAQ items same as before
//               ].map((faq, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.4, delay: index * 0.1 }}
//                 >
//                   <AccordionItem
//                     value={`faq-${index}`}
//                     className="border rounded-lg bg-background hover:bg-muted/10 transition-colors dark:hover:bg-muted/20"
//                   >
//                     <AccordionTrigger className="flex items-center justify-between w-full px-6 py-4 [&[data-state=open]>svg]:rotate-180">
//                       <span className="text-lg font-medium text-left">{faq.question}</span>
//                       <div className="ml-4 shrink-0 text-foreground">
//                         <FiPlus className="h-5 w-5 transition-transform duration-200 block dark:hidden" />
//                         <FiMinus className="h-5 w-5 transition-transform duration-200 hidden dark:block" />
//                       </div>
//                     </AccordionTrigger>
//                     <AccordionContent className="px-6 py-4 text-muted-foreground dark:text-muted-foreground/80">
//                       {faq.answer}
//                     </AccordionContent>
//                   </AccordionItem>
//                 </motion.div>
//               ))}
//             </Accordion>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import { motion } from "framer-motion";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function FAQSection() {
  const faqItems = [
    {
      question: "What is Examtards?",
      answer: "Examtards is a platform dedicated to helping students explore different career options and prepare for various exams with resources like past year questions and quizzes.",
    },
    {
      question: "Is Examtards free to use?",
      answer: "Yes! Our platform is completely free. We sustain ourselves through minimal and non-intrusive ads while students contribute study materials.",
    },
    {
      question: "How can I contribute past year questions (PYQs)?",
      answer: "You can upload your PYQs directly on our website, or email them to us. Your contributions help keep the platform valuable for everyone.",
    },
    {
      question: "Do you provide mock tests?",
      answer: "Yes, we have a collection of quizzes and mock tests that help students practice before their actual exams.",
    },
    {
      question: "Can I request specific study materials?",
      answer: "Absolutely! You can request specific PYQs or resources, and we'll try to add them based on availability.",
    },
  ];

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:py-24 lg:px-8 bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          {/* Abstract Graphic Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden md:block"
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-10 dark:opacity-15">
              <div className="w-full h-full bg-gradient-to-br from-foreground to-transparent rounded-full mix-blend-overlay blur-3xl" />
            </div>
            
            <div className="relative space-y-8">
              <motion.div
                animate={{ rotate: [45, -45, 45] }}
                transition={{ duration: 15, repeat: Infinity }}
                className="h-48 w-48 bg-foreground/10 rounded-2xl rotate-45 transform origin-bottom-right"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="h-32 w-32 bg-foreground/20 rounded-full ml-auto -mt-12"
              />
              <motion.div
                animate={{ rotate: [12, -12, 12] }}
                transition={{ duration: 20, repeat: Infinity }}
                className="h-40 w-40 bg-foreground/15 rounded-2xl rotate-12 transform -translate-x-8"
              />
            </div>
          </motion.div>

          {/* FAQ Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 lg:mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground">
                Everything you need to know about Examtards.Can not find an answer? Contact us directly.
              </p>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={`faq-${index}`}
                    className="border rounded-lg bg-background hover:bg-muted/10 transition-colors dark:hover:bg-muted/20"
                  >
                    <AccordionTrigger className="flex items-center justify-between w-full px-6 py-4 [&[data-state=open]>svg]:rotate-180">
                      <span className="text-lg font-medium text-left">
                        {faq.question}
                      </span>
                    
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4 text-muted-foreground dark:text-muted-foreground/80">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}