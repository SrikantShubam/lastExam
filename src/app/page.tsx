import { getPopularExams } from "../lib/loadExams";
import Hero from "../../components/Hero";
import Features from "../../components/Features";
import PopularExams from "../../components/PopularExams";
import ExamCategories from "../../components/ExamCategories";

export default async function Home() {
  const popularExams = getPopularExams(); // Fetch exams dynamically
  
console.log(popularExams);
  return (
    <main>
      <Hero />
      <Features />
      <PopularExams exams={popularExams} />
      <ExamCategories  />
    </main>
  );
}
