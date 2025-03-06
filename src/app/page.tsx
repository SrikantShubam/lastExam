import { getPopularExams } from "../lib/loadExams";
import Hero from "../../components/Hero";
import Features from "../../components/Features";
import PopularExams from "../../components/PopularExams";
import ExamCategories from "../../components/ExamCategories";
import Testimonials from "../../components/Testinomials";
import AboutUs from "../../components/AboutUs";
import PYQSection from "../../components/PYQs";
import FAQSection from "../../components/Faqs";
import ContributeSection from "../../components/Contribute";
import "../../styles/globals.css";

export default async function Home() {
  const popularExams = getPopularExams(); // Fetch exams dynamically
  

  return (
    <main>
      <Hero />
      <Features />
      <PopularExams exams={popularExams} />
      <ExamCategories  />
      <PYQSection />
      <Testimonials />
      <AboutUs />
      <FAQSection />
      < ContributeSection />
    </main>
  );
}
