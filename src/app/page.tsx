import { getPopularExams, loadCategories } from "../lib/loadExams";
import Hero from "../../components/Hero";
import Features from "../../components/Features";
import PopularExams from "../../components/PopularExams";
import ExamCategories from "../../components/ExamCategories";

export default async function Home() {
  const popularExams = getPopularExams(); // Fetch exams dynamically
  const categories = loadCategories();
console.log(popularExams);
  return (
    <main>
      <Hero />
      <Features />
      <PopularExams exams={popularExams} />
      <ExamCategories categories={categories} />
    </main>
  );
}
