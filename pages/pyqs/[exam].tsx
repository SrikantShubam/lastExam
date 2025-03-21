// // pages/pyqs/[exam].tsx
// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/router";
// import { collection, getDocs, getDoc, doc } from "firebase/firestore";
// import { db } from "../../lib/firebase";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import Layout from "../../components/Layout";
// import Particles from "react-tsparticles";
// import { loadSlim } from "tsparticles-slim";

// export default function ExamPyqsPage() {
//   const router = useRouter();
//   const { exam } = router.query; // e.g., "NDA"
//   const [pyqs, setPyqs] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [filters, setFilters] = useState({ subject: "all" });
//   const [loading, setLoading] = useState(true);

//   // Particles initialization
//   const particlesInit = useCallback(async (engine) => {
//     await loadSlim(engine);
//   }, []);

//   useEffect(() => {
//     if (!exam) return;

//     const fetchPyqs = async () => {
//       if (!db) {
//         console.error("Firestore is not initialized. Are you on the server?");
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       try {
//         const examDocRef = doc(db, "exams", exam);
//         const examDoc = await getDoc(examDocRef);
//         if (!examDoc.exists()) {
//           console.error(`${exam} document not found`);
//           setLoading(false);
//           return;
//         }

//         const examData = examDoc.data();
//         let metadata = examData.metadata;
//         if (typeof metadata === "string") {
//           try {
//             metadata = JSON.parse(metadata);
//           } catch (error) {
//             console.error(`Error parsing metadata for ${exam}:`, error);
//             metadata = { exam: exam, subjects: [] };
//           }
//         }

//         const metadataSubjects = metadata?.subjects || [];
//         const uniqueSubjects = [...new Set(metadataSubjects)];

//         const foundSubjects = [];
//         const pyqsData = [];

//         for (const subject of uniqueSubjects) {
//           try {
//             const papersSnapshot = await getDocs(collection(db, `exams/${exam}/${subject}`));
//             if (!papersSnapshot.empty) {
//               foundSubjects.push(subject);
//               papersSnapshot.forEach((paperDoc) => {
//                 const paperName = paperDoc.id;
//                 if (paperName.toLowerCase() !== "quizzes") {
//                   const paperData = paperDoc.data();
//                   pyqsData.push({
//                     exam: exam,
//                     subject: subject,
//                     paperName: paperDoc.id,
//                     displayName: paperData.paper_name || paperDoc.id,
//                     totalQuestions: paperData.total_questions || "N/A",
//                   });
//                 }
//               });
//             }
//           } catch (error) {
//             console.error(`Error fetching papers for ${exam}/${subject}:`, error);
//           }
//         }

//         setSubjects(foundSubjects);
//         setPyqs(pyqsData);
//       } catch (error) {
//         console.error("Error fetching PYQs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPyqs();
//   }, [exam]);

//   const filteredPyqs = pyqs.filter((pyq) => {
//     const matchesSubject = filters.subject === "all" ? true : pyq.subject === filters.subject;
//     return matchesSubject;
//   });

//   return (
//     <Layout>
//       <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-background text-foreground overflow-hidden">
//         {/* Gradient Background */}
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 0.8 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/20 to-background -z-10"
//         />

//         {/* Particles Background */}
//         <Particles
//           id="tsparticles"
//           init={particlesInit}
//           options={{
//             fpsLimit: 120,
//             particles: {
//               color: {
//                 value: ["#ffffff", "#a1a1aa"], // White and light gray for visibility in both themes
//               },
//               links: {
//                 color: "#ffffff",
//                 distance: 150,
//                 enable: true,
//                 opacity: 0.2, // Subtle connections
//                 width: 0.5,
//               },
//               move: {
//                 enable: true,
//                 random: true,
//                 speed: 0.3, // Very slow movement for a minimal effect
//                 direction: "none",
//                 outModes: {
//                   default: "bounce",
//                 },
//               },
//               number: {
//                 value: 15, // Low number of particles for minimalism
//                 density: {
//                   enable: true,
//                   value_area: 800,
//                 },
//               },
//               opacity: {
//                 value: { min: 0.1, max: 0.3 }, // Faint particles
//               },
//               shape: {
//                 type: "circle",
//               },
//               size: {
//                 value: { min: 1, max: 2 }, // Small particles
//                 random: true,
//               },
//             },
//             detectRetina: true,
//           }}
//           className="absolute inset-0 -z-20" // Behind the gradient
//         />

//         {/* Header */}
//         <motion.h2
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, ease: "easeOut" }}
//           className="text-4xl md:text-6xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
//         >
//           {exam} Previous Year Questions
//         </motion.h2>
//         <p className="text-md text-center text-muted-foreground max-w-2xl mx-auto mb-10">
//           Access past exam papers to boost your preparation. PYQs help you understand exam patterns and important topics.
//         </p>

//         {/* Subject Filter */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
//           className="mb-12 flex justify-center"
//         >
//           <Select
//             value={filters.subject}
//             onValueChange={(value) => setFilters({ ...filters, subject: value })}
//           >
//             <SelectTrigger className="w-full max-w-md py-3 px-4 border bg-card text-card-foreground focus:outline-none focus:border-primary transition-all">
//               <SelectValue placeholder="Filter by subject" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Subjects</SelectItem>
//               {subjects.map((subject) => (
//                 <SelectItem key={subject} value={subject}>
//                   {subject}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </motion.div>

//         {/* Papers List */}
//         {loading ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center text-lg text-muted-foreground"
//           >
//             Loading...
//           </motion.div>
//         ) : filteredPyqs.length === 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center text-lg text-muted-foreground"
//           >
//             No papers found for the selected subject.
//           </motion.div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredPyqs.map((pyq, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
//               >
//                 <Card className="p-6 bg-card text-card-foreground hover:shadow-xl transition-shadow relative overflow-hidden group">
//                   {/* Subtle Gradient Overlay on Hover */}
//                   <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

//                   <div className="flex justify-between items-start relative z-10">
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-2">
//                         <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
//                           Paper
//                         </span>
//                       </div>
//                       <h3 className="text-2xl font-bold">{pyq.displayName}</h3>
//                       <div className="text-sm text-muted-foreground">
//                         Subject: {pyq.subject}
//                       </div>
//                       <div className="text-sm text-muted-foreground">
//                         Total Questions: {pyq.totalQuestions}
//                       </div>
//                     </div>

//                     <div className="text-center">
//                       <span className="text-3xl font-bold">{pyq.totalQuestions !== "N/A" ? pyq.totalQuestions : "—"}</span>
//                       <div className="text-xs font-medium">Questions</div>
//                     </div>
//                   </div>

//                   <Link href={`/pyqs/${pyq.exam}/${pyq.paperName}`} className="mt-6 block relative z-10">
//                     <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all">
//                       View Paper
//                     </Button>
//                   </Link>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </section>
//     </Layout>
//   );
// }






























// pages/pyqs/[exam].tsx
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Layout from "../../components/Layout";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine"; // Import Engine type for particlesInit

export default function ExamPyqsPage() {
  const router = useRouter();
  const { exam } = router.query; // e.g., "NDA"
  const [pyqs, setPyqs] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filters, setFilters] = useState({ subject: "all" });
  const [loading, setLoading] = useState(true);

  // Particles initialization
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    if (!exam) return;

    const fetchPyqs = async () => {
      if (!db) {
        console.error("Firestore is not initialized. Are you on the server?");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const examDocRef = doc(db, "exams", exam);
        const examDoc = await getDoc(examDocRef);
        if (!examDoc.exists()) {
          console.error(`${exam} document not found`);
          setLoading(false);
          return;
        }

        const examData = examDoc.data();
        let metadata = examData.metadata;
        if (typeof metadata === "string") {
          try {
            metadata = JSON.parse(metadata);
          } catch (error) {
            console.error(`Error parsing metadata for ${exam}:`, error);
            metadata = { exam: exam, subjects: [] };
          }
        }

        const metadataSubjects = metadata?.subjects || [];
        const uniqueSubjects = [...new Set(metadataSubjects)];

        const foundSubjects = [];
        const pyqsData = [];

        for (const subject of uniqueSubjects) {
          try {
            const papersSnapshot = await getDocs(collection(db, `exams/${exam}/${subject}`));
            if (!papersSnapshot.empty) {
              foundSubjects.push(subject);
              papersSnapshot.forEach((paperDoc) => {
                const paperName = paperDoc.id;
                if (paperName.toLowerCase() !== "quizzes") {
                  const paperData = paperDoc.data();
                  pyqsData.push({
                    exam: exam,
                    subject: subject,
                    paperName: paperDoc.id,
                    displayName: paperData.paper_name || paperDoc.id,
                    totalQuestions: paperData.total_questions || "N/A",
                  });
                }
              });
            }
          } catch (error) {
            console.error(`Error fetching papers for ${exam}/${subject}:`, error);
          }
        }

        setSubjects(foundSubjects);
        setPyqs(pyqsData);
      } catch (error) {
        console.error("Error fetching PYQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPyqs();
  }, [exam]);

  const filteredPyqs = pyqs.filter((pyq) => {
    const matchesSubject = filters.subject === "all" ? true : pyq.subject === filters.subject;
    return matchesSubject;
  });

  return (
    <Layout>
      <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-background text-foreground overflow-hidden">
        {/* Gradient Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/20 to-background -z-20"
        />

        {/* Particles Background */}
        <Particles
          id="tsparticles"
          init={particlesInit}
          options={{
            fpsLimit: 120,
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: ["#ffffff", "#a1a1aa"], // White and light gray for visibility in both themes
              },
              links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.2, // Subtle connections
                width: 0.5,
              },
              move: {
                enable: true,
                random: true,
                speed: 0.3, // Very slow movement for a minimal effect
                direction: "none",
                outModes: {
                  default: "bounce",
                },
              },
              number: {
                value: 30, // Increased number of particles for a richer effect
                density: {
                  enable: true,
                  value_area: 800,
                },
              },
              opacity: {
                value: { min: 0.1, max: 0.3 }, // Faint particles
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 }, // Slightly larger particles
                random: true,
              },
            },
            detectRetina: true,
          }}
          className="absolute inset-0 -z-9" // Behind the gradient
        />

        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          {exam} Previous Year Questions
        </motion.h2>
        <p className="text-md text-center text-muted-foreground max-w-2xl mx-auto mb-10">
          Access past exam papers to boost your preparation. PYQs help you understand exam patterns and important topics.
        </p>

        {/* Subject Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mb-12 flex justify-center"
        >
          <Select
            value={filters.subject}
            onValueChange={(value) => setFilters({ ...filters, subject: value })}
          >
            <SelectTrigger className="w-full max-w-md py-3 px-4 border bg-card text-card-foreground focus:outline-none focus:border-primary transition-all">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Papers List */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-lg text-muted-foreground"
          >
            Loading...
          </motion.div>
        ) : filteredPyqs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-lg text-muted-foreground"
          >
            No papers found for the selected subject.
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPyqs.map((pyq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
              >
                <Card className="p-6 bg-card text-card-foreground hover:shadow-xl transition-shadow relative overflow-hidden group">
                  {/* Subtle Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                          Paper
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold">{pyq.displayName}</h3>
                      <div className="text-sm text-muted-foreground">
                        Subject: {pyq.subject}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Questions: {pyq.totalQuestions}
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-3xl font-bold">{pyq.totalQuestions !== "N/A" ? pyq.totalQuestions : "—"}</span>
                      <div className="text-xs font-medium">Questions</div>
                    </div>
                  </div>

                  <Link href={`/pyqs/${pyq.exam}/${pyq.paperName}`} className="mt-6 block relative z-10">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all">
                      View Paper
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}