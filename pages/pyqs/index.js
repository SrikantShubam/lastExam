"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "../../components/Layout";

export default function PyqsPage() {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      if (!db) {
        console.error("Firestore is not initialized. Are you on the server?");
        setLoading(false);
        return;
      }
  
      setLoading(true);
      try {
        console.log("Fetching exams from Firestore...");
        const examsSnapshot = await getDocs(collection(db, "exams"));
        console.log("Exams snapshot size:", examsSnapshot.size);
  
        const examsData = [];
  
        for (const examDoc of examsSnapshot.docs) {
          const examName = examDoc.id;
          const examData = examDoc.data();
          console.log(`Raw examData for ${examName}:`, examData);
  
          let metadata = examData.metadata;
          if (typeof metadata === "string") {
            try {
              metadata = JSON.parse(metadata);
            } catch (error) {
              console.error(`Error parsing metadata for ${examName}:`, error);
              metadata = { exam: examName, subjects: [] };
            }
          }
  
          const metadataSubjects = metadata?.subjects || [];
          const uniqueSubjects = [...new Set(metadataSubjects)]; // Remove duplicates
  
          console.log(`Exam: ${examName}, Metadata:`, metadata);
          console.log(`Subjects for ${examName}:`, uniqueSubjects);
  
          let totalPapers = 0;
          const allPaperNames = [];
  
          for (const subject of uniqueSubjects) {
            console.log(`Fetching papers for ${examName}/${subject}...`);
            try {
              const papersSnapshot = await getDocs(collection(db, `exams/${examName}/${subject}`));
              console.log(`Subject: ${subject}, Total documents: ${papersSnapshot.size}`);
  
              papersSnapshot.forEach((paperDoc) => {
                const paperName = paperDoc.id;
                if (
                  paperName.toLowerCase() !== "quizzes" &&
                  paperName.includes("-202")
                ) {
                  allPaperNames.push(`${subject}/${paperName}`);
                  totalPapers += 1;
                }
              });
  
              console.log(`Subject: ${subject}, Filtered paper count: ${allPaperNames.filter(name => name.startsWith(subject)).length}`);
            } catch (error) {
              console.error(`Error fetching papers for ${examName}/${subject}:`, error);
            }
          }
  
          console.log(`All paper names for ${examName}:`, allPaperNames);
          console.log(`Total papers for ${examName}: ${totalPapers}`);
  
          examsData.push({
            examName: examName,
            subjects: metadataSubjects,
            totalPapers: totalPapers,
          });
        }
  
        setExams(examsData);
        setFilteredExams(examsData);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchExams();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredExams(exams);
    } else {
      const filtered = exams.filter((exam) =>
        exam.examName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredExams(filtered);
    }
  }, [searchQuery, exams]);

  return (
    <Layout>
      <section className="relative py-24 px-6 md:px-12 lg:px-24 bg-background text-foreground overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/20 to-background opacity-80 -z-10" />
        
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold mb-12 text-center bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Previous Year Questions (PYQs)
        </motion.h2>
        <p className="text-md text-center text-muted-foreground max-w-2xl mx-auto mb-10">
        Access past exam papers to boost your preparation. PYQs help you understand exam patterns and important topics.
      </p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mb-12 flex justify-center"
        >
          <Input
            type="text"
            placeholder="Search exams by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md py-3 px-4 border bg-card text-card-foreground focus:outline-none focus:border-primary transition-all"
          />
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-lg text-muted-foreground"
          >
            Loading...
          </motion.div>
        ) : filteredExams.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-lg text-muted-foreground"
          >
            No exams found.
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExams.map((exam, index) => (
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
                          Exam
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold">{exam.examName}</h3>
                      <div className="text-sm text-muted-foreground">
                        Total Papers: {exam.totalPapers}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Subjects: {exam.subjects.length > 0 ? exam.subjects.join(", ") : "None"}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <span className="text-3xl font-bold">{exam.totalPapers}</span>
                      <div className="text-xs font-medium">Papers</div>
                    </div>
                  </div>
                  
                  <Link href={`/pyqs/${exam.examName}`} className="mt-6 block relative z-10">
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-all">
                      View Papers
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
