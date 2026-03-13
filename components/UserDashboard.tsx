// "use client";

// import Image from 'next/image';
// import { Edit, Save, TrendingUp, Target, Award, Gem, FileText, Sparkles, Search, ChevronDown, BrainCircuit, X } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Fragment, useState, useEffect } from 'react';
// import { Dialog, Transition } from '@headlessui/react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import { db, auth, storage } from '../lib/firebase';
// import { updateProfile as updateAuthProfile } from 'firebase/auth';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { doc, updateDoc, arrayUnion, arrayRemove, collection, getDocs } from 'firebase/firestore';
// import examsData from "../data/exam.json"
// import Link from 'next/link';

// // --- INTERFACES & HELPERS ---

// interface UserData {
//   name: string; email: string; avatarUrl: string; createdAt: string; currentStreak: number;
//   examHistory?: { id: string; exam: string; score: number; timestamp: string; }[];
//   favoriteExams?: { id: string; name: string; exam_date: string; }[];
// }

// interface UserDashboardProps { user: UserData; }

// interface ExamFromJson {
//   id: number;
//   exam_id: string;
//   name: string;
//   exam_date: string;
//   // other fields...
// }

// const exams: ExamFromJson[] = examsData; // Assuming exams.json exports an array

// function parseExamName(examStr: string = "") {
//     const parts = examStr.split('-');
//     const subject = parts[1] || examStr || "General";
//     const paperName = parts[0] || "Paper";
//     return { subject, paperName };
// }

// function calculateStats(history?: UserData['examHistory']) {
//   if (!history || history.length === 0) return { highestScore: 0, lastScore: 0 };
//   const sorted = [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
//   const highest = Math.max(...sorted.map(h => h.score));
//   return { highestScore: highest, lastScore: sorted[0]?.score || 0 };
// }

// function predictNextScore(history?: UserData['examHistory']): number {
//     if (!history || history.length < 3) return 0;
//     const scores = history.map(h => h.score).slice(0, 5).reverse();
//     const n = scores.length;
//     let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
//     for (let i = 0; i < n; i++) {
//         sumX += i;
//         sumY += scores[i];
//         sumXY += i * scores[i];
//         sumX2 += i * i;
//     }
//     const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
//     const intercept = (sumY - slope * sumX) / n;
//     const prediction = slope * n + intercept;
//     return Math.max(10, Math.min(98, Math.round(prediction)));
// }

// function calculateCountdown(examDateStr: string): { days: number; est: boolean } | null {
//   if (!examDateStr) return null;
//   let examDate = new Date(examDateStr);
//   let est = false;
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   let target = new Date(examDate);
//   target.setHours(0, 0, 0, 0);
//   let days = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
//   while (days < 0) {
//     examDate.setFullYear(examDate.getFullYear() + 1);
//     target = new Date(examDate);
//     target.setHours(0, 0, 0, 0);
//     days = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
//     est = true;
//   }
//   return { days, est };
// }

// function slugify(text: string) {
//   return text
//     .toLowerCase()
//     .replace(/\s+/g, "-")
//     .replace(/[^\w-]+/g, "")
//     .replace(/--+/g, "-")
//     .trim();
// }

// // --- COMPONENT ---

// export default function UserDashboard({ user }: UserDashboardProps) {
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [newName, setNewName] = useState(user.name);
//   const [newAvatar, setNewAvatar] = useState<File | null>(null);
//   const [showAllHistory, setShowAllHistory] = useState(false);
//   const [aiTips, setAiTips] = useState<string[]>([]);
//   const [isGeneratingAi, setIsGeneratingAi] = useState(false);
//   const [predictedScore, setPredictedScore] = useState(0);
//   const [favorites, setFavorites] = useState<UserData['favoriteExams']>(user.favoriteExams || []);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filteredExams, setFilteredExams] = useState<ExamFromJson[]>([]);
//   const [randomPapers, setRandomPapers] = useState<{ exam: string; paperName: string; paperId: string }[]>([]);

//   useEffect(() => {
//     setNewName(user.name);
//     setPredictedScore(predictNextScore(user.examHistory));
//     setFavorites(user.favoriteExams || []);
//   }, [user]);



// useEffect(() => {
//   const fetchFilteredExams = async () => {
//     if (searchTerm) {
//       try {
//         const response = await fetch(`/api/exams?query=${encodeURIComponent(searchTerm)}`);
//         if (!response.ok) throw new Error('Failed to fetch exams');
//         const data = await response.json();
//         setFilteredExams(data);
//       } catch (error) {
//         console.error('Error fetching exams:', error);
//         // Optionally show toast error
//       }
//     } else {
//       setFilteredExams([]);
//     }
//   };
//   fetchFilteredExams();
// }, [searchTerm]);

//   useEffect(() => {
//     const fetchRandomPapers = async () => {
//       if (favorites.length === 0) {
//         setRandomPapers([]);
//         return;
//       }
//       const papers: { exam: string; paperName: string; paperId: string }[] = [];
//       for (const fav of favorites) {
//         const subjectsRef = collection(db, `exams/${fav.name}/subjects`);
//         const snapshot = await getDocs(subjectsRef);
//         if (!snapshot.empty) {
//           const randomIndex = Math.floor(Math.random() * snapshot.docs.length);
//           const randomDoc = snapshot.docs[randomIndex];
//           papers.push({
//             exam: fav.name,
//             paperName: randomDoc.data().name || randomDoc.id, // Assume 'name' field in doc, fallback to id
//             paperId: randomDoc.id,
//           });
//         }
//       }
//       setRandomPapers(papers.slice(0, 5)); // Limit to 5
//     };
//     fetchRandomPapers();
//   }, [favorites]);

//   const stats = calculateStats(user.examHistory);
//   const sortedHistory = [...(user.examHistory || [])].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

//   const chartData = [...sortedHistory].reverse().slice(-10).map((h, i) => ({
//     name: `${parseExamName(h.exam).subject.substring(0, 4)}. ${i + 1}`,
//     score: h.score,
//     fullExamName: h.exam,
//   }));

//   async function updateProfile() {
//     if (!auth.currentUser) {
//       console.error("No user is signed in to update the profile.");
//       return;
//     }

//     const userRef = doc(db, 'users', auth.currentUser.uid);
//     const firestoreUpdates: { name?: string; avatarUrl?: string } = {};
//     const authUpdates: { displayName?: string; photoURL?: string } = {};

//     if (newName !== user.name) {
//       firestoreUpdates.name = newName;
//       authUpdates.displayName = newName;
//     }

//     if (newAvatar) {
//       const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
//       try {
//         await uploadBytes(storageRef, newAvatar);
//         const downloadURL = await getDownloadURL(storageRef);
//         firestoreUpdates.avatarUrl = downloadURL;
//         authUpdates.photoURL = downloadURL;
//       } catch (error) {
//         console.error("Error uploading new avatar:", error);
//       }
//     }

//     try {
//       if (Object.keys(authUpdates).length > 0) {
//         await updateAuthProfile(auth.currentUser, authUpdates);
//       }

//       if (Object.keys(firestoreUpdates).length > 0) {
//         await updateDoc(userRef, firestoreUpdates);
//       }

//       setEditModalOpen(false);
//       window.location.reload();
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     }
//   }

//   async function handleGenerateInsights() {
//     setIsGeneratingAi(true);
//     setAiTips([]);

//     try {
//       const response = await fetch('/api/generate-insights', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           examHistory: sortedHistory,
//           predictedScore: predictedScore,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to generate insights.");
//       }

//       const data = await response.json();
//       setAiTips(data.tips);

//     } catch (error: any) {
//       console.error("Error fetching AI insights:", error);
//       setAiTips([`Sorry, we couldn't generate insights right now. Please try again later.`]);
//     } finally {
//       setIsGeneratingAi(false);
//     }
//   }

//   async function addFavorite(exam: ExamFromJson) {
//     if (favorites.length >= 5) {
//       console.error("Max 5 favorites allowed.");
//       return;
//     }
//     if (favorites.some(f => f.name === exam.name)) {
//       console.error("Already added.");
//       return;
//     }
//     const newFav = { id: exam.exam_id, name: exam.name, exam_date: exam.exam_date };
//     try {
//       const userRef = doc(db, 'users', auth.currentUser!.uid);
//       await updateDoc(userRef, { favoriteExams: arrayUnion(newFav) });
//       setFavorites([...favorites, newFav]);
//       setSearchTerm('');
//     } catch (error) {
//       console.error("Error adding favorite:", error);
//     }
//   }

//   async function removeFavorite(fav: { id: string; name: string; exam_date: string }) {
//     try {
//       const userRef = doc(db, 'users', auth.currentUser!.uid);
//       await updateDoc(userRef, { favoriteExams: arrayRemove(fav) });
//       setFavorites(favorites.filter(f => f.name !== fav.name));
//     } catch (error) {
//       console.error("Error removing favorite:", error);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto space-y-8">
//         <header>
//           <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-foreground mb-2">
//             Welcome back, {user.name}!
//           </motion.h1>
//         </header>

//         <section className="grid grid-cols-1 lg:grid-cols-6 gap-6">
//           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-card rounded-xl shadow-lg p-6 border border-border flex flex-col items-center text-center">
//             <Image src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} alt={`${user.name}'s avatar`} width={96} height={96} className="rounded-full mb-4 border-2 border-primary/50 shadow-sm" />
//             <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
//             <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
//             <button onClick={() => setEditModalOpen(true)} className="mt-auto inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group">
//               <Edit size={16} /> Edit Profile
//             </button>
//           </motion.div>

//           <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//             {[
//                 { icon: TrendingUp, label: "Current Streak", value: `${user.currentStreak} days`},
//                 { icon: Award, label: "Highest Score", value: `${stats.highestScore}%` },
//                 { icon: Target, label: "Last Score", value: `${stats.lastScore}%` },
//                 { icon: Gem, label: "Points Earned", value: "0" },
//             ].map((stat, index) => (
//                 <motion.div key={stat.label} className="bg-card rounded-xl shadow-lg p-5 border border-border flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-colors hover:-translate-y-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.05 }}>
//                     <div className="bg-primary/10 p-3 rounded-lg text-primary mb-3"><stat.icon size={24} /></div>
//                     <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
//                     <p className="text-2xl font-bold text-foreground">{stat.value}</p>
//                 </motion.div>
//             ))}
//           </div>
//         </section>

//         <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-6 bg-gradient-to-r from-primary/10 to-transparent bg-card rounded-xl shadow-lg p-6 border border-primary/20">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//                 <div className="flex items-center gap-4">
//                     <BrainCircuit className="text-primary w-16 h-16 shrink-0"/>
//                     <div>
//                         <h3 className="text-xl font-semibold text-foreground">AI Exam Forecast</h3>
//                         {predictedScore > 0 ? (
//                             <p className="text-muted-foreground mt-1">Based on your recent trend, we predict you'll score <span className="font-bold text-primary">{predictedScore}%</span> on your next exam.</p>
//                         ) : (
//                             <p className="text-muted-foreground mt-1">Complete a few more exams to unlock your AI score prediction.</p>
//                         )}
//                     </div>
//                 </div>
//                 <button onClick={handleGenerateInsights} disabled={isGeneratingAi || sortedHistory.length < 3} className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto shrink-0 flex items-center justify-center gap-2">
//                     <Sparkles size={16}/> {isGeneratingAi ? "Analyzing..." : "Get Deep Dive Analysis"}
//                 </button>
//             </div>
//             <AnimatePresence>
//             {aiTips.length > 0 && (
//                 <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="border-t border-primary/20 pt-4">
//                     <ul className="space-y-3">
//                         {aiTips.map((tip, index) => (
//                             <motion.li key={index} className="flex items-start gap-3 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
//                                 <Sparkles className="w-4 h-4 text-primary shrink-0 mt-1"/>
//                                 <span>{tip}</span>
//                             </motion.li>
//                         ))}
//                     </ul>
//                 </motion.div>
//             )}
//             </AnimatePresence>
//         </motion.section>

//         <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-xl shadow-lg p-6 border border-border">
//              <h3 className="text-xl font-semibold text-foreground mb-4">Personal Exam Countdown</h3>
//              <p className="text-muted-foreground text-sm mb-4">Add exams to track their countdowns.</p>
//              <div className="relative">
//                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                <input
//                  type="text"
//                  placeholder="Search for an exam..."
//                  value={searchTerm}
//                  onChange={(e) => setSearchTerm(e.target.value)}
//                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
//                />
//                {filteredExams.length > 0 && (
//                  <ul className="absolute z-10 w-full bg-card border border-border rounded-lg mt-1 max-h-40 overflow-y-auto">
//                    {filteredExams.map((exam) => (
//                      <li
//                        key={exam.name}
//                        onClick={() => addFavorite(exam)}
//                        className="p-2 hover:bg-background cursor-pointer text-foreground"
//                      >
//                        {exam.name}
//                      </li>
//                    ))}
//                  </ul>
//                )}
//              </div>
//              <div className="mt-4 space-y-2">
//                {favorites.length > 0 ? (
//                  favorites.map((fav) => {
//                    const countdown = calculateCountdown(fav.exam_date);
//                    return (
//                      <div key={fav.name} className="flex justify-between items-center p-2 bg-background rounded-lg">
//                        <span>{fav.name}</span>
//                        <div className="flex items-center gap-2">
//                          {countdown && (
//                            <span className="text-muted-foreground">
//                              {countdown.days} days {countdown.est ? 'est' : ''}
//                            </span>
//                          )}
//                          <button onClick={() => removeFavorite(fav)} className="text-red-500 hover:text-red-700">
//                            <X size={16} />
//                          </button>
//                        </div>
//                      </div>
//                    );
//                  })
//                ) : (
//                  <div className="text-center text-muted-foreground p-4 border-2 border-dashed border-border rounded-lg bg-background/50">
//                    Add exams to track their countdowns.
//                  </div>
//                )}
//              </div>
//           </motion.div>

//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-xl shadow-lg p-6 border border-border">
//             <h3 className="text-xl font-semibold text-foreground mb-4">Recent History</h3>
//             {sortedHistory.length > 0 ? (
//                 <div>
//                   <div className="space-y-3">
//                     <AnimatePresence initial={false}>
//                       {(showAllHistory ? sortedHistory : sortedHistory.slice(0, 3)).map((exam) => {
//                           const { subject, paperName } = parseExamName(exam.exam);
//                           return (
//                               <motion.div key={exam.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-between p-3 rounded-lg hover:bg-background">
//                                   <div className="flex items-center gap-4"><div className="bg-primary/10 p-3 rounded-lg text-primary"><FileText /></div><div><p className="font-semibold text-foreground">{paperName} - {subject}</p><p className="text-xs text-muted-foreground">{new Date(exam.timestamp).toLocaleDateString()}</p></div></div>
//                                   <p className="font-bold text-lg text-foreground">{exam.score}%</p>
//                               </motion.div>
//                           );
//                       })}
//                     </AnimatePresence>
//                   </div>
//                   {sortedHistory.length > 3 && (<button onClick={() => setShowAllHistory(!showAllHistory)} className="w-full mt-4 text-sm text-primary font-semibold hover:underline flex items-center justify-center gap-2">{showAllHistory ? 'Show Less' : 'Show More'}<motion.div animate={{ rotate: showAllHistory ? 180 : 0 }}><ChevronDown size={16}/></motion.div></button>)}
//                 </div>
//             ) : ( <div className="text-center text-muted-foreground p-4 border-2 border-dashed border-border rounded-lg bg-background/50">No Exam History</div> )}
//           </motion.div>
//         </section>

//         <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-card rounded-xl shadow-lg p-6 border border-border">
//           <h3 className="text-xl font-semibold text-foreground mb-4">Score Trends</h3>
//           {chartData.length > 1 ? (
//               <div className="h-72 -ml-4">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
//                     <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
//                     <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
//                     <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} formatter={(value: number, name: string, props: any) => [`${value}%`, props.payload.fullExamName]} labelFormatter={() => ''} />
//                     <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//           ) : ( <div className="text-center text-muted-foreground p-8 border-2 border-dashed border-border rounded-lg bg-background/50">Complete at least two exams to see your progress chart.</div> )}
//         </motion.section>

//         <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-card rounded-xl shadow-lg p-6 border border-border">
//           <h3 className="text-xl font-semibold text-foreground mb-4">Practice These Exams!</h3>
//           {randomPapers.length > 0 ? (
//             <div className="space-y-3">
//               {randomPapers.map((paper) => (
//                 <div key={paper.paperId} className="flex justify-between items-center p-3 rounded-lg hover:bg-background">
//                   <span>{paper.paperName} ({paper.exam})</span>
//                   <Link href={`/exams/${slugify(paper.exam)}/${slugify(paper.paperId)}`} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
//                     Practice
//                   </Link>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center text-muted-foreground p-4 border-2 border-dashed border-border rounded-lg bg-background/50">
//               Add favorite exams to see practice suggestions.
//             </div>
//           )}
//         </motion.section>

//         <Transition appear show={editModalOpen} as={Fragment}>
//           <Dialog as="div" className="relative z-50" onClose={() => setEditModalOpen(false)}>
//             <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
//               <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
//             </Transition.Child>
//             <div className="fixed inset-0 overflow-y-auto">
//               <div className="flex min-h-full items-center justify-center p-4 text-center">
//                 <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
//                   <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-card p-6 text-left align-middle shadow-xl transition-all border border-border">
//                     <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-foreground">
//                       Edit Profile
//                     </Dialog.Title>
//                     <div className="mt-4 space-y-4">
//                       <div>
//                           <label className="block text-sm font-medium text-muted-foreground mb-1">Username</label>
//                           <input
//                             type="text"
//                             value={newName}
//                             onChange={(e) => setNewName(e.target.value)}
//                             className="w-full rounded-md border-border bg-background text-foreground shadow-sm p-2 focus:ring-2 focus:ring-primary focus:outline-none"
//                           />
//                       </div>
//                       <div>
//                           <label className="block text-sm font-medium text-muted-foreground mb-1">Avatar</label>
//                           <input
//                             type="file"
//                             accept="image/*"
//                             onChange={(e) => setNewAvatar(e.target.files?.[0] || null)}
//                             className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
//                           />
//                       </div>
//                     </div>
//                     <div className="mt-6 flex justify-end gap-4">
//                       <button
//                         type="button"
//                         className="inline-flex justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-background"
//                         onClick={() => setEditModalOpen(false)}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="button"
//                         className="inline-flex justify-center items-center gap-2 rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
//                         onClick={updateProfile}
//                       >
//                         <Save size={16} /> Save Changes
//                       </button>
//                     </div>
//                   </Dialog.Panel>
//                 </Transition.Child>
//               </div>
//             </div>
//           </Dialog>
//         </Transition>
//       </div>
//     </div>
//   );
// }











//==================v2=======
"use client";

import Image from 'next/image';
import { Edit, Save, TrendingUp, Target, Award, Gem, FileText, Sparkles, Search, ChevronDown, BrainCircuit, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db, auth, storage } from '../lib/firebase';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion, arrayRemove, collection, getDocs } from 'firebase/firestore';
import examsData from "../data/exam.json"
import Link from 'next/link';

// --- INTERFACES & HELPERS ---

interface UserData {
  name: string; email: string; avatarUrl: string; createdAt: string; currentStreak: number;
  examHistory?: { id: string; exam: string; score: number; timestamp: string; paper?: string; subject?: string; }[];
  favoriteExams?: { id: string; name: string; exam_date: string; }[];
}

interface UserDashboardProps { user: UserData; }

interface ExamFromJson {
  id: number;
  exam_id: string;
  name: string;
  exam_date: string;
  // other fields...
}

const exams: ExamFromJson[] = examsData; // Assuming exams.json exports an array

function calculateStats(history?: UserData['examHistory']) {
  if (!history || history.length === 0) return { highestScore: 0, lastScore: 0 };
  const sorted = [...history].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const highest = Math.max(...sorted.map(h => h.score));
  return { highestScore: highest, lastScore: sorted[0]?.score || 0 };
}

function predictNextScore(history?: UserData['examHistory']): number {
    if (!history || history.length < 3) return 0;
    const scores = history.map(h => h.score).slice(0, 5).reverse();
    const n = scores.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += scores[i];
        sumXY += i * scores[i];
        sumX2 += i * i;
    }
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const prediction = slope * n + intercept;
    return Math.max(10, Math.min(98, Math.round(prediction)));
}

function calculateCountdown(examDateStr: string): { days: number; est: boolean } | null {
  if (!examDateStr) return null;
  let examDate = new Date(examDateStr);
  let est = false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let target = new Date(examDate);
  target.setHours(0, 0, 0, 0);
  let days = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  while (days < 0) {
    examDate.setFullYear(examDate.getFullYear() + 1);
    target = new Date(examDate);
    target.setHours(0, 0, 0, 0);
    days = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    est = true;
  }
  return { days, est };
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

// --- COMPONENT ---

export default function UserDashboard({ user }: UserDashboardProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [predictedScore, setPredictedScore] = useState(0);
  const [favorites, setFavorites] = useState<UserData['favoriteExams']>(user.favoriteExams || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExams, setFilteredExams] = useState<ExamFromJson[]>([]);
  const [randomPapers, setRandomPapers] = useState<{ exam: string; paperName: string; paperId: string }[]>([]);

  useEffect(() => {
    setNewName(user.name);
    setPredictedScore(predictNextScore(user.examHistory));
    setFavorites(user.favoriteExams || []);
  }, [user]);



useEffect(() => {
  const fetchFilteredExams = async () => {
    if (searchTerm) {
      try {
        const response = await fetch(`/api/exams?query=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) throw new Error('Failed to fetch exams');
        const data = await response.json();
        setFilteredExams(data);
      } catch (error) {
        console.error('Error fetching exams:', error);
        // Optionally show toast error
      }
    } else {
      setFilteredExams([]);
    }
  };
  fetchFilteredExams();
}, [searchTerm]);

  useEffect(() => {
    const fetchRandomPapers = async () => {
      if (favorites.length === 0) {
        setRandomPapers([]);
        return;
      }
      const papers: { exam: string; paperName: string; paperId: string }[] = [];
      for (const fav of favorites) {
        const subjectsRef = collection(db, `exams/${fav.name}/subjects`);
        const snapshot = await getDocs(subjectsRef);
        if (!snapshot.empty) {
          const randomIndex = Math.floor(Math.random() * snapshot.docs.length);
          const randomDoc = snapshot.docs[randomIndex];
          papers.push({
            exam: fav.name,
            paperName: randomDoc.data().name || randomDoc.id, // Assume 'name' field in doc, fallback to id
            paperId: randomDoc.id,
          });
        }
      }
      setRandomPapers(papers.slice(0, 5)); // Limit to 5
    };
    fetchRandomPapers();
  }, [favorites]);

  const stats = calculateStats(user.examHistory);
  const sortedHistory = [...(user.examHistory || [])].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  console.log('Debug: Sorted Exam History:', sortedHistory.map(h => ({
    id: h.id,
    exam: h.exam,
    paper: h.paper,
    subject: h.subject,
    score: h.score,
    timestamp: h.timestamp
  })));

  const chartData = [...sortedHistory].reverse().slice(-10).map((h, i) => {
    const displayPart = h.paper || h.subject || null;
    const name = displayPart ? `${h.exam.substring(0, 4)} - ${displayPart.substring(0, 4)}. ${i + 1}` : `${h.exam.substring(0, 4)}. ${i + 1}`;
    const fullExamName = displayPart ? `${h.exam} - ${displayPart}` : h.exam;
    console.log('Debug: Chart Item:', { exam: h.exam, paper: h.paper, subject: h.subject, index: i, name, fullExamName });
    return { name, score: h.score, fullExamName };
  });

  async function updateProfile() {
    if (!auth.currentUser) {
      console.error("No user is signed in to update the profile.");
      return;
    }

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const firestoreUpdates: { name?: string; avatarUrl?: string } = {};
    const authUpdates: { displayName?: string; photoURL?: string } = {};

    if (newName !== user.name) {
      firestoreUpdates.name = newName;
      authUpdates.displayName = newName;
    }

    if (newAvatar) {
      const storageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
      try {
        await uploadBytes(storageRef, newAvatar);
        const downloadURL = await getDownloadURL(storageRef);
        firestoreUpdates.avatarUrl = downloadURL;
        authUpdates.photoURL = downloadURL;
      } catch (error) {
        console.error("Error uploading new avatar:", error);
      }
    }

    try {
      if (Object.keys(authUpdates).length > 0) {
        await updateAuthProfile(auth.currentUser, authUpdates);
      }

      if (Object.keys(firestoreUpdates).length > 0) {
        await updateDoc(userRef, firestoreUpdates);
      }

      setEditModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  }

  async function handleGenerateInsights() {
    setIsGeneratingAi(true);
    setAiTips([]);

    try {
      const response = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examHistory: sortedHistory,
          predictedScore: predictedScore,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate insights.");
      }

      const data = await response.json();
      setAiTips(data.tips);

    } catch (error: any) {
      console.error("Error fetching AI insights:", error);
      setAiTips([`Sorry, we couldn't generate insights right now. Please try again later.`]);
    } finally {
      setIsGeneratingAi(false);
    }
  }

  async function addFavorite(exam: ExamFromJson) {
    if (favorites.length >= 5) {
      console.error("Max 5 favorites allowed.");
      return;
    }
    if (favorites.some(f => f.name === exam.name)) {
      console.error("Already added.");
      return;
    }
    const newFav = { id: exam.exam_id, name: exam.name, exam_date: exam.exam_date };
    try {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      await updateDoc(userRef, { favoriteExams: arrayUnion(newFav) });
      setFavorites([...favorites, newFav]);
      setSearchTerm('');
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  }

  async function removeFavorite(fav: { id: string; name: string; exam_date: string }) {
    try {
      const userRef = doc(db, 'users', auth.currentUser!.uid);
      await updateDoc(userRef, { favoriteExams: arrayRemove(fav) });
      setFavorites(favorites.filter(f => f.name !== fav.name));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header>
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome back, {user.name}!
          </motion.h1>
        </header>

        <section className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-card rounded-xl shadow-lg p-6 border border-border flex flex-col items-center text-center">
            <Image src={user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} alt={`${user.name}'s avatar`} width={96} height={96} className="rounded-full mb-4 border-2 border-primary/50 shadow-sm" />
            <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
            <button onClick={() => setEditModalOpen(true)} className="mt-auto inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group">
              <Edit size={16} /> Edit Profile
            </button>
          </motion.div>

          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
                { icon: TrendingUp, label: "Current Streak", value: `${user.currentStreak} days`},
                { icon: Award, label: "Highest Score", value: `${stats.highestScore}%` },
                { icon: Target, label: "Last Score", value: `${stats.lastScore}%` },
                { icon: Gem, label: "Points Earned", value: "0" },
            ].map((stat, index) => (
                <motion.div key={stat.label} className="bg-card rounded-xl shadow-lg p-5 border border-border flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-colors hover:-translate-y-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.05 }}>
                    <div className="bg-primary/10 p-3 rounded-lg text-primary mb-3"><stat.icon size={24} /></div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </motion.div>
            ))}
          </div>
        </section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-6 bg-gradient-to-r from-primary/10 to-transparent bg-card rounded-xl shadow-lg p-6 border border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <BrainCircuit className="text-primary w-16 h-16 shrink-0"/>
                    <div>
                        <h3 className="text-xl font-semibold text-foreground">AI Exam Forecast</h3>
                        {predictedScore > 0 ? (
                            <p className="text-muted-foreground mt-1">Based on your recent trend, we predict you'll score <span className="font-bold text-primary">{predictedScore}%</span> on your next exam.</p>
                        ) : (
                            <p className="text-muted-foreground mt-1">Complete a few more exams to unlock your AI score prediction.</p>
                        )}
                    </div>
                </div>
                <button onClick={handleGenerateInsights} disabled={isGeneratingAi || sortedHistory.length < 3} className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto shrink-0 flex items-center justify-center gap-2">
                    <Sparkles size={16}/> {isGeneratingAi ? "Analyzing..." : "Get Deep Dive Analysis"}
                </button>
            </div>
            <AnimatePresence>
            {aiTips.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '1.5rem' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="border-t border-primary/20 pt-4">
                    <ul className="space-y-3">
                        {aiTips.map((tip, index) => (
                            <motion.li key={index} className="flex items-start gap-3 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-1"/>
                                <span>{tip}</span>
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>
            )}
            </AnimatePresence>
        </motion.section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-xl shadow-lg p-6 border border-border">
             <h3 className="text-xl font-semibold text-foreground mb-4">Personal Exam Countdown</h3>
             <p className="text-muted-foreground text-sm mb-4">Add exams to track their countdowns.</p>
             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
               <input
                 type="text"
                 placeholder="Search for an exam..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-10 pr-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary focus:outline-none"
               />
               {filteredExams.length > 0 && (
                 <ul className="absolute z-10 w-full bg-card border border-border rounded-lg mt-1 max-h-40 overflow-y-auto">
                   {filteredExams.map((exam) => (
                     <li
                       key={exam.name}
                       onClick={() => addFavorite(exam)}
                       className="p-2 hover:bg-background cursor-pointer text-foreground"
                     >
                       {exam.name}
                     </li>
                   ))}
                 </ul>
               )}
             </div>
             <div className="mt-4 space-y-2">
               {favorites.length > 0 ? (
                 favorites.map((fav) => {
                   const countdown = calculateCountdown(fav.exam_date);
                   return (
                     <div key={fav.name} className="flex justify-between items-center p-2 bg-background rounded-lg">
                       <span>{fav.name}</span>
                       <div className="flex items-center gap-2">
                         {countdown && (
                           <span className="text-muted-foreground">
                             {countdown.days} days {countdown.est ? 'est' : ''}
                           </span>
                         )}
                         <button onClick={() => removeFavorite(fav)} className="text-red-500 hover:text-red-700">
                           <X size={16} />
                         </button>
                       </div>
                     </div>
                   );
                 })
               ) : (
                 <div className="text-center text-muted-foreground p-4 border-2 border-dashed border-border rounded-lg bg-background/50">
                   Add exams to track their countdowns.
                 </div>
               )}
             </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-xl shadow-lg p-6 border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-4">Recent History</h3>
            {sortedHistory.length > 0 ? (
                <div>
                  <div className="space-y-3">
                    <AnimatePresence initial={false}>
                      {(showAllHistory ? sortedHistory : sortedHistory.slice(0, 3)).map((exam) => {
                          const displayPart = exam.paper || exam.subject || null;
                          const displayName = displayPart ? `${exam.exam} - ${displayPart}` : exam.exam;
                          return (
                              <motion.div key={exam.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-between p-3 rounded-lg hover:bg-background">
                                  <div className="flex items-center gap-4"><div className="bg-primary/10 p-3 rounded-lg text-primary"><FileText /></div><div><p className="font-semibold text-foreground">{displayName}</p><p className="text-xs text-muted-foreground">{new Date(exam.timestamp).toLocaleDateString()}</p></div></div>
                                  <p className="font-bold text-lg text-foreground">{exam.score}%</p>
                              </motion.div>
                          );
                      })}
                    </AnimatePresence>
                  </div>
                  {sortedHistory.length > 3 && (<button onClick={() => setShowAllHistory(!showAllHistory)} className="w-full mt-4 text-sm text-primary font-semibold hover:underline flex items-center justify-center gap-2">{showAllHistory ? 'Show Less' : 'Show More'}<motion.div animate={{ rotate: showAllHistory ? 180 : 0 }}><ChevronDown size={16}/></motion.div></button>)}
                </div>
            ) : ( <div className="text-center text-muted-foreground p-4 border-2 border-dashed border-border rounded-lg bg-background/50">No Exam History</div> )}
          </motion.div>
        </section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-card rounded-xl shadow-lg p-6 border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Score Trends</h3>
          {chartData.length > 1 ? (
              <div className="h-72 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }} formatter={(value: number, name: string, props: any) => [`${value}%`, props.payload.fullExamName]} labelFormatter={() => ''} />
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
          ) : ( <div className="text-center text-muted-foreground p-8 border-2 border-dashed border-border rounded-lg bg-background/50">Complete at least two exams to see your progress chart.</div> )}
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-card rounded-xl shadow-lg p-6 border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Practice These Exams!</h3>
          {randomPapers.length > 0 ? (
            <div className="space-y-3">
              {randomPapers.map((paper) => (
                <div key={paper.paperId} className="flex justify-between items-center p-3 rounded-lg hover:bg-background">
                  <span>{paper.paperName} ({paper.exam})</span>
                  <Link href={`/exams/${slugify(paper.exam)}/${slugify(paper.paperId)}`} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
                    Practice
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground p-4 border-2 border-dashed border-border rounded-lg bg-background/50">
              Add favorite exams to see practice suggestions.
            </div>
          )}
        </motion.section>

        <Transition appear show={editModalOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setEditModalOpen(false)}>
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
              <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-card p-6 text-left align-middle shadow-xl transition-all border border-border">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-foreground">
                      Edit Profile
                    </Dialog.Title>
                    <div className="mt-4 space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">Username</label>
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full rounded-md border-border bg-background text-foreground shadow-sm p-2 focus:ring-2 focus:ring-primary focus:outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">Avatar</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewAvatar(e.target.files?.[0] || null)}
                            className="w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                          />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-background"
                        onClick={() => setEditModalOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center items-center gap-2 rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        onClick={updateProfile}
                      >
                        <Save size={16} /> Save Changes
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
}