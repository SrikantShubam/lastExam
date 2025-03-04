// "use client";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface Category {
//   id: number;
//   name: string;
//   description: string;
//   categoryGroup: string;
// }

// interface Exam {
//   id: number;
//   exam_id: string;
//   name: string;
//   exam_date: string;
//   duration: string;
//   keywords: string;
//   category: string;
//   application_link: string;
// }

// // function getAdjustedDate(examDate: string) {
// //   try {
// //     const date = new Date(examDate);
// //     if (isNaN(date.getTime())) throw new Error("Invalid date");

// //     const now = new Date();
// //     let isEstimated = false;
// //     while (date < now) {
// //       date.setFullYear(date.getFullYear() + 1);
// //       isEstimated = true;
// //     }
// //     return { date, isEstimated };
// //   } catch (error) {
// //     console.error("Invalid exam date:", examDate);
// //     const fallbackDate = new Date();
// //     fallbackDate.setMonth(fallbackDate.getMonth() + 3);
// //     return { date: fallbackDate, isEstimated: true };
// //   }
// // }
// function getAdjustedDate(examDate: string) {
//   // Check if examDate is empty or not a string
//   if (!examDate || typeof examDate !== "string" || examDate.trim() === "") {
//     console.warn("Empty or invalid exam_date:", examDate);
//     return { date: null, isEstimated: false, isTBD: true };
//   }

//   try {
//     const date = new Date(examDate.trim()); // Trim whitespace
//     if (isNaN(date.getTime())) {
//       console.warn("Failed to parse exam_date:", examDate);
//       return { date: null, isEstimated: false, isTBD: true };
//     }

//     const now = new Date();
//     let isEstimated = false;
//     while (date < now) {
//       date.setFullYear(date.getFullYear() + 1);
//       isEstimated = true;
//     }
//     return { date, isEstimated, isTBD: false };
//   } catch (error) {
//     console.warn("Error processing exam_date:", examDate, error);
//     return { date: null, isEstimated: false, isTBD: true };
//   }
// }
// export default function ExamCategories() {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [exams, setExams] = useState<Exam[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
//   const [isUpcomingSelected, setIsUpcomingSelected] = useState(false);
//   const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
//   const [visibleCount, setVisibleCount] = useState(9); // Default to 9
//   const [itemsPerPage, setItemsPerPage] = useState(9);

//   const slugify = (text: string) =>
//     text
//       .toLowerCase()
//       .replace(/\s+/g, "-")
//       .replace(/[^\w-]+/g, "")
//       .replace(/--+/g, "-")
//       .trim();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch("/api/categories");
//         const data = await res.json();
//         const filteredCategories = data.categories.filter(
//           (cat: Category) => cat.name !== "popular"
//         );

//         setCategories(filteredCategories);
//         setExams(data.exams);

//         setIsUpcomingSelected(true);
//         setSelectedCategory(null);

//         const today = new Date();
//         const upcomingExams = data.exams.filter((exam) => {
//           const { date } = getAdjustedDate(exam.exam_date);
//           const diffTime = date.getTime() - today.getTime();
//           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//           return diffDays > 0 && diffDays <= 60;
//         });

//         setFilteredExams(upcomingExams);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     const updateVisibleCount = () => {
//       const isMobile = window.innerWidth <= 640;
//       const newItemsPerPage = isMobile ? 3 : 9;
//       setItemsPerPage(newItemsPerPage);
//       setVisibleCount(newItemsPerPage); // Reset visibleCount on resize
//     };

//     updateVisibleCount();
//     window.addEventListener("resize", updateVisibleCount);

//     return () => {
//       window.removeEventListener("resize", updateVisibleCount);
//     };
//   }, []);

//   const getCategoryDescription = () => {
//     if (isUpcomingSelected) {
//       return "Exams scheduled within the next 60 days.";
//     }
//     const selected = categories.find((cat) => cat.id === selectedCategory);
//     return selected ? selected.description : "Select a category to view exams.";
//   };

//   const handleViewMore = () => {
//     setVisibleCount((prev) => prev + itemsPerPage);
//   };

//   return (
//     <section className="relative py-8 px-2 sm:py-12 sm:px-4 md:py-24 md:px-12 lg:px-20 bg-background text-foreground">
//       <div className="max-w-8xl mx-auto">
//         {/* Mobile and Tablet View (<1024px) */}
//         <div className="lg:hidden">
//           <motion.h1
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, ease: "easeOut" }}
//             className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
//           >
//             Exam Categories
//           </motion.h1>

//           <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 md:mb-12">
//             <motion.button
//               onClick={() => {
//                 setIsUpcomingSelected(true);
//                 setSelectedCategory(null);
//                 const today = new Date();
//                 const upcoming = exams.filter((exam) => {
//                   const { date } = getAdjustedDate(exam.exam_date);
//                   const diffTime = date.getTime() - today.getTime();
//                   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//                   return diffDays > 0 && diffDays <= 60;
//                 });
//                 setFilteredExams(upcoming);
//                 setVisibleCount(itemsPerPage); // Reset to itemsPerPage
//               }}
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-medium transition-all ${
//                 isUpcomingSelected
//                   ? "bg-primary text-primary-foreground shadow-lg"
//                   : "bg-muted hover:bg-muted/80 text-foreground"
//               }`}
//             >
//               Upcoming
//             </motion.button>
//             {categories.map((category) => (
//               <motion.button
//                 key={category.id}
//                 onClick={() => {
//                   setIsUpcomingSelected(false);
//                   setSelectedCategory(category.id);
//                   setFilteredExams(
//                     exams.filter((exam) =>
//                       exam.category
//                         .split(",")
//                         .map((c) => c.trim())
//                         .includes(category.id.toString())
//                     )
//                   );
//                   setVisibleCount(itemsPerPage); // Reset to itemsPerPage
//                 }}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-medium transition-all ${
//                   selectedCategory === category.id
//                     ? "bg-primary text-primary-foreground shadow-lg"
//                     : "bg-muted hover:bg-muted/80 text-foreground"
//                 }`}
//               >
//                 {category.name}
//               </motion.button>
//             ))}
//           </div>

//           <AnimatePresence mode="wait">
//             <motion.p
//               key={isUpcomingSelected ? "upcoming" : selectedCategory || "default"}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.5 }}
//               className="text-center text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 md:mb-12 max-w-2xl mx-auto"
//             >
//               {getCategoryDescription()}
//             </motion.p>
//           </AnimatePresence>

//           <AnimatePresence>
//             {filteredExams.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
//                 {filteredExams.slice(0, visibleCount).map((exam, index) => {
//                   const { date, isEstimated } = getAdjustedDate(exam.exam_date);
//                   return (
//                     <motion.div
//                       key={`${exam.exam_id}-${index}`}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 }}
//                     >
//                       <Card className="p-4 bg-card text-card-foreground hover:shadow-xl transition-shadow relative overflow-hidden group">
//                         <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//                         <div className="relative z-10 space-y-3">
//                           <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{exam.name}</h3>
//                           <div className="text-xs sm:text-sm text-muted-foreground">
//                             {date.toLocaleDateString("en-IN", {
//                               day: "numeric",
//                               month: "short",
//                               year: "numeric",
//                             })}
//                             {isEstimated && (
//                               <span className="ml-2 text-[10px] sm:text-xs text-red-500 font-medium">
//                                 Expected
//                               </span>
//                             )}
//                           </div>
//                           <div className="text-xs sm:text-sm text-muted-foreground">
//                             Duration: {exam.duration} | Keywords: {exam.keywords.split(",")[0]}{" "}
//                             {exam.keywords.split(",").length > 1 && "..."}
//                           </div>
//                           {exam.application_link && (
//                             <a
//                               href={exam.application_link}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-xs sm:text-sm text-primary hover:underline"
//                             >
//                               Apply Now
//                             </a>
//                           )}
//                           <Link href={`/exam-details/${slugify(exam.name)}`}>
//                             <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all mt-3 text-sm">
//                               View Details
//                             </Button>
//                           </Link>
//                         </div>
//                       </Card>
//                     </motion.div>
//                   );
//                 })}

//                 {filteredExams.length > visibleCount && (
//                   <motion.button
//                     onClick={handleViewMore}
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="mt-4 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-sm font-medium shadow-md transition-all mx-auto block col-span-full"
//                   >
//                     View More
//                   </motion.button>
//                 )}
//               </div>
//             ) : (
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="text-center text-sm sm:text-base md:text-lg text-muted-foreground"
//               >
//                 {isUpcomingSelected || selectedCategory
//                   ? "No exams found."
//                   : "Select a category to view exams."}
//               </motion.p>
//             )}
//           </AnimatePresence>
//         </div>

//         {/* Desktop View (≥1024px): Sidebar Layout */}
//         <div className="hidden lg:flex">
//           <motion.aside
//             initial={{ x: -50, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ duration: 0.5 }}
//             className="w-64 p-6 bg-background border-r border-border h-screen overflow-y-auto sticky top-0"
//           >
//             <h2 className="text-2xl font-bold tracking-tight mb-6">Categories</h2>
//             <ul className="space-y-3">
//               <li>
//                 <button
//                   onClick={() => {
//                     setIsUpcomingSelected(true);
//                     setSelectedCategory(null);
//                     const today = new Date();
//                     const upcoming = exams.filter((exam) => {
//                       const { date } = getAdjustedDate(exam.exam_date);
//                       const diffTime = date.getTime() - today.getTime();
//                       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//                       return diffDays > 0 && diffDays <= 60;
//                     });
//                     setFilteredExams(upcoming);
//                     setVisibleCount(itemsPerPage); // Reset to itemsPerPage
//                   }}
//                   className={`w-full text-left text-base font-semibold tracking-tight py-2 px-3 rounded ${
//                     isUpcomingSelected
//                       ? "bg-primary text-primary-foreground"
//                       : "hover:bg-muted"
//                   }`}
//                 >
//                   Upcoming
//                 </button>
//               </li>
//               {categories.map((category) => (
//                 <li key={category.id}>
//                   <button
//                     onClick={() => {
//                       setIsUpcomingSelected(false);
//                       setSelectedCategory(category.id);
//                       setFilteredExams(
//                         exams.filter((exam) =>
//                           exam.category
//                             .split(",")
//                             .map((c) => c.trim())
//                             .includes(category.id.toString())
//                         )
//                       );
//                       setVisibleCount(itemsPerPage); // Reset to itemsPerPage
//                     }}
//                     className={`w-full text-left text-base font-semibold tracking-tight py-2 px-3 rounded ${
//                       selectedCategory === category.id
//                         ? "bg-primary text-primary-foreground"
//                         : "hover:bg-muted"
//                     }`}
//                   >
//                     {category.name}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </motion.aside>

//           <main className="flex-1 overflow-y-auto lg:pl-8">
//             <motion.h1
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8, ease: "easeOut" }}
//               className="text-4xl lg:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
//             >
//               Exam Categories
//             </motion.h1>

//             <AnimatePresence mode="wait">
//               <motion.p
//                 key={isUpcomingSelected ? "upcoming" : selectedCategory || "default"}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.5 }}
//                 className="text-center text-base lg:text-lg text-muted-foreground mb-8 lg:mb-12 max-w-2xl mx-auto"
//               >
//                 {getCategoryDescription()}
//               </motion.p>
//             </AnimatePresence>

//             {/* <AnimatePresence>
//               {filteredExams.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
//                   {filteredExams.slice(0, visibleCount).map((exam, index) => {
//                     const { date, isEstimated } = getAdjustedDate(exam.exam_date);
//                     return (
//                       <motion.div
//                         key={`${exam.exam_id}-${index}`}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
//                       >
//                         <Card className="p-4 lg:p-6 bg-card text-card-foreground hover:shadow-xl transition-shadow relative overflow-hidden group">
//                           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//                           <div className="relative z-10 space-y-3 lg:space-y-4">
//                             <h3 className="text-lg lg:text-2xl font-bold">{exam.name}</h3>
//                             <div className="text-xs lg:text-sm text-muted-foreground">
//                               {date.toLocaleDateString("en-IN", {
//                                 day: "numeric",
//                                 month: "short",
//                                 year: "numeric",
//                               })}
//                               {isEstimated && (
//                                 <span className="ml-2 text-[10px] lg:text-xs text-red-500 font-medium">
//                                   Expected
//                                 </span>
//                               )}
//                             </div>
//                             <div className="text-xs lg:text-sm text-muted-foreground">
//                               Duration: {exam.duration} | Keywords: {exam.keywords.split(",")[0]}{" "}
//                               {exam.keywords.split(",").length > 1 && "..."}
//                             </div>
//                             {exam.application_link && (
//                               <a
//                                 href={exam.application_link}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-xs lg:text-sm text-primary hover:underline"
//                               >
//                                 Apply Now
//                               </a>
//                             )}
//                             <Link href={`/exam-details/${slugify(exam.name)}`}>
//                               <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all mt-3 lg:mt-4 text-sm lg:text-base">
//                                 View Details
//                               </Button>
//                             </Link>
//                           </div>
//                         </Card>
//                       </motion.div>
//                     );
//                   })}
//                   {filteredExams.length > visibleCount && (
//                     <motion.button
//                       onClick={handleViewMore}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="mt-6 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-sm font-medium shadow-md transition-all mx-auto block col-span-full"
//                     >
//                       View More
//                     </motion.button>
//                   )}
//                 </div>
//               ) : (
//                 <motion.p
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 0.5 }}
//                   className="text-center text-base lg:text-lg text-muted-foreground"
//                 >
//                   {isUpcomingSelected || selectedCategory
//                     ? "No exams found."
//                     : "Select a category to view exams."}
//                 </motion.p>
//               )}
//             </AnimatePresence> */}
//            <AnimatePresence>
//   {filteredExams.length > 0 ? (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
//       {filteredExams.slice(0, visibleCount).map((exam, index) => {
//         const { date, isEstimated, isTBD } = getAdjustedDate(exam.exam_date);
//         console.log(`Exam: ${exam.name}, Date: ${exam.exam_date}, Parsed:`, { date, isEstimated, isTBD }); // Debug log
//         return (
//           <motion.div
//             key={`${exam.exam_id}-${index}`}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 }}
//           >
//             <Card className="p-4 bg-card text-card-foreground hover:shadow-xl transition-shadow relative overflow-hidden group">
//               <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//               <div className="relative z-10 space-y-3">
//                 <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{exam.name}</h3>
//                 <div className="text-xs sm:text-sm text-muted-foreground">
//                   {isTBD || !date ? (
//                     "TBD"
//                   ) : (
//                     <>
//                       {date.toLocaleDateString("en-IN", {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                       {isEstimated && (
//                         <span className="ml-2 text-[10px] sm:text-xs text-red-500 font-medium">
//                           Expected
//                         </span>
//                       )}
//                     </>
//                   )}
//                 </div>
//                 <div className="text-xs sm:text-sm text-muted-foreground">
//                   Duration: {exam.duration || "N/A"} | Keywords: {exam.keywords.split(",")[0] || "N/A"}{" "}
//                   {exam.keywords.split(",").length > 1 && "..."}
//                 </div>
//                 {exam.application_link && (
//                   <a
//                     href={exam.application_link}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-xs sm:text-sm text-primary hover:underline"
//                   >
//                     Apply Now
//                   </a>
//                 )}
//                 <Link href={`/exam-details/${slugify(exam.name)}`}>
//                   <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all mt-3 text-sm">
//                     View Details
//                   </Button>
//                 </Link>
//               </div>
//             </Card>
//           </motion.div>
//         );
//       })}
//       {filteredExams.length > visibleCount && (
//         <motion.button
//           onClick={handleViewMore}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           className="mt-4 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-sm font-medium shadow-md transition-all mx-auto block col-span-full"
//         >
//           View More
//         </motion.button>
//       )}
//     </div>
//   ) : (
//     <motion.p
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className="text-center text-sm sm:text-base md:text-lg text-muted-foreground"
//     >
//       {isUpcomingSelected || selectedCategory
//         ? "No exams found."
//         : "Select a category to view exams."}
//     </motion.p>
//   )}
// </AnimatePresence>
//           </main>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Category {
  id: number;
  name: string;
  description: string;
  categoryGroup: string;
}

interface Exam {
  id: number;
  exam_id: string;
  name: string;
  exam_date: string;
  duration: string;
  keywords: string;
  category: string;
  application_link: string;
}

function getAdjustedDate(examDate: string) {
  if (!examDate || typeof examDate !== "string" || examDate.trim() === "") {
    console.warn("Empty or invalid exam_date:", examDate);
    return { date: null, isEstimated: false, isTBD: true };
  }

  try {
    const date = new Date(examDate.trim());
    if (isNaN(date.getTime())) {
      console.warn("Failed to parse exam_date:", examDate);
      return { date: null, isEstimated: false, isTBD: true };
    }

    const now = new Date();
    let isEstimated = false;
    while (date < now) {
      date.setFullYear(date.getFullYear() + 1);
      isEstimated = true;
    }
    return { date, isEstimated, isTBD: false };
  } catch (error) {
    console.warn("Error processing exam_date:", examDate, error);
    return { date: null, isEstimated: false, isTBD: true };
  }
}

export default function ExamCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isUpcomingSelected, setIsUpcomingSelected] = useState(false);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-")
      .trim();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        const filteredCategories = data.categories.filter(
          (cat: Category) => cat.name !== "popular"
        );

        setCategories(filteredCategories);
        setExams(data.exams);

        setIsUpcomingSelected(true);
        setSelectedCategory(null);

        const today = new Date();
        const upcomingExams = data.exams.filter((exam) => {
          const { date } = getAdjustedDate(exam.exam_date);
          if (!date) return false; // Skip exams with invalid/null dates
          const diffTime = date.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays > 0 && diffDays <= 60;
        });

        setFilteredExams(upcomingExams);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateVisibleCount = () => {
      const isMobile = window.innerWidth <= 640;
      const newItemsPerPage = isMobile ? 3 : 9;
      setItemsPerPage(newItemsPerPage);
      setVisibleCount(newItemsPerPage);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);

  const getCategoryDescription = () => {
    if (isUpcomingSelected) {
      return "Exams scheduled within the next 60 days.";
    }
    const selected = categories.find((cat) => cat.id === selectedCategory);
    return selected ? selected.description : "Select a category to view exams.";
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + itemsPerPage);
  };

  return (
    <section className="relative py-8 px-2 sm:py-12 sm:px-4 md:py-24 md:px-12 lg:px-20 bg-background text-foreground">
      <div className="max-w-8xl mx-auto">
        {/* Mobile and Tablet View (<1024px) */}
        <div className="lg:hidden">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            Exam Categories
          </motion.h1>

          <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 md:mb-12">
            <motion.button
              onClick={() => {
                setIsUpcomingSelected(true);
                setSelectedCategory(null);
                const today = new Date();
                const upcoming = exams.filter((exam) => {
                  const { date } = getAdjustedDate(exam.exam_date);
                  if (!date) return false; // Skip exams with invalid/null dates
                  const diffTime = date.getTime() - today.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays > 0 && diffDays <= 60;
                });
                setFilteredExams(upcoming);
                setVisibleCount(itemsPerPage);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-medium transition-all ${
                isUpcomingSelected
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              Upcoming
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => {
                  setIsUpcomingSelected(false);
                  setSelectedCategory(category.id);
                  setFilteredExams(
                    exams.filter((exam) =>
                      exam.category
                        .split(",")
                        .map((c) => c.trim())
                        .includes(category.id.toString())
                    )
                  );
                  setVisibleCount(itemsPerPage);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={isUpcomingSelected ? "upcoming" : selectedCategory || "default"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="text-center text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 md:mb-12 max-w-2xl mx-auto"
            >
              {getCategoryDescription()}
            </motion.p>
          </AnimatePresence>

          <AnimatePresence>
            {filteredExams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {filteredExams.slice(0, visibleCount).map((exam, index) => {
                  const { date, isEstimated, isTBD } = getAdjustedDate(exam.exam_date);
                  console.log(`Exam: ${exam.name}, Date: ${exam.exam_date}, Parsed:`, { date, isEstimated, isTBD });
                  return (
                    <motion.div
                      key={`${exam.exam_id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.05 }}
                    >
                      <Card className="p-4 bg-card text-card-foreground hover:shadow-xl transition-shadow relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10 space-y-3">
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{exam.name}</h3>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            {isTBD || !date ? (
                              "TBD"
                            ) : (
                              <>
                                {date.toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                                {isEstimated && (
                                  <span className="ml-2 text-[10px] sm:text-xs text-red-500 font-medium">
                                    Expected
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Duration: {exam.duration || "N/A"} | Keywords: {exam.keywords.split(",")[0] || "N/A"}{" "}
                            {exam.keywords.split(",").length > 1 && "..."}
                          </div>
                          {exam.application_link && (
                            <a
                              href={exam.application_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs sm:text-sm text-primary hover:underline"
                            >
                              Apply Now
                            </a>
                          )}
                          <Link href={`/exam-details/${slugify(exam.name)}`}>
                            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all mt-3 text-sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
                {filteredExams.length > visibleCount && (
                  <motion.button
                    onClick={handleViewMore}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-sm font-medium shadow-md transition-all mx-auto block col-span-full"
                  >
                    View More
                  </motion.button>
                )}
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center text-sm sm:text-base md:text-lg text-muted-foreground"
              >
                {isUpcomingSelected || selectedCategory
                  ? "No exams found."
                  : "Select a category to view exams."}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop View (≥1024px): Sidebar Layout */}
        <div className="hidden lg:flex">
          <motion.aside
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-64 p-6 bg-background border-r border-border h-screen overflow-y-auto sticky top-0"
          >
            <h2 className="text-2xl font-bold tracking-tight mb-6">Categories</h2>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => {
                    setIsUpcomingSelected(true);
                    setSelectedCategory(null);
                    const today = new Date();
                    const upcoming = exams.filter((exam) => {
                      const { date } = getAdjustedDate(exam.exam_date);
                      if (!date) return false; // Skip exams with invalid/null dates
                      const diffTime = date.getTime() - today.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays > 0 && diffDays <= 60;
                    });
                    setFilteredExams(upcoming);
                    setVisibleCount(itemsPerPage);
                  }}
                  className={`w-full text-left text-base font-semibold tracking-tight py-2 px-3 rounded ${
                    isUpcomingSelected
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  Upcoming
                </button>
              </li>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    onClick={() => {
                      setIsUpcomingSelected(false);
                      setSelectedCategory(category.id);
                      setFilteredExams(
                        exams.filter((exam) =>
                          exam.category
                            .split(",")
                            .map((c) => c.trim())
                            .includes(category.id.toString())
                        )
                      );
                      setVisibleCount(itemsPerPage);
                    }}
                    className={`w-full text-left text-base font-semibold tracking-tight py-2 px-3 rounded ${
                      selectedCategory === category.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    }`}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.aside>

          <main className="flex-1 overflow-y-auto lg:pl-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-4xl lg:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              Exam Categories
            </motion.h1>

            <AnimatePresence mode="wait">
              <motion.p
                key={isUpcomingSelected ? "upcoming" : selectedCategory || "default"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-center text-base lg:text-lg text-muted-foreground mb-8 lg:mb-12 max-w-2xl mx-auto"
              >
                {getCategoryDescription()}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence>
              {filteredExams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {filteredExams.slice(0, visibleCount).map((exam, index) => {
                    const { date, isEstimated, isTBD } = getAdjustedDate(exam.exam_date);
                    console.log(`Exam: ${exam.name}, Date: ${exam.exam_date}, Parsed:`, { date, isEstimated, isTBD });
                    return (
                      <motion.div
                        key={`${exam.exam_id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                      >
                        <Card className="p-4 lg:p-6 bg-card text-card-foreground hover:shadow-xl transition-shadow relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative z-10 space-y-3 lg:space-y-4">
                            <h3 className="text-lg lg:text-2xl font-bold">{exam.name}</h3>
                            <div className="text-xs lg:text-sm text-muted-foreground">
                              {isTBD || !date ? (
                                "TBD"
                              ) : (
                                <>
                                  {date.toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                  {isEstimated && (
                                    <span className="ml-2 text-[10px] lg:text-xs text-red-500 font-medium">
                                      Expected
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                            <div className="text-xs lg:text-sm text-muted-foreground">
                              Duration: {exam.duration || "N/A"} | Keywords: {exam.keywords.split(",")[0] || "N/A"}{" "}
                              {exam.keywords.split(",").length > 1 && "..."}
                            </div>
                            {exam.application_link && (
                              <a
                                href={exam.application_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs lg:text-sm text-primary hover:underline"
                              >
                                Apply Now
                              </a>
                            )}
                            <Link href={`/exam-details/${slugify(exam.name)}`}>
                              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all mt-3 lg:mt-4 text-sm lg:text-base">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                  {filteredExams.length > visibleCount && (
                    <motion.button
                      onClick={handleViewMore}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-6 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full text-sm font-medium shadow-md transition-all mx-auto block col-span-full"
                    >
                      View More
                    </motion.button>
                  )}
                </div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center text-base lg:text-lg text-muted-foreground"
                >
                  {isUpcomingSelected || selectedCategory
                    ? "No exams found."
                    : "Select a category to view exams."}
                </motion.p>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </section>
  );
}