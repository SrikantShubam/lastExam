import fs from "fs";
import path from "path";

export interface Category {
  id: number;
  name: string;
}

export interface Exam {
  id: number;
  exam_id: string;
  name: string;
  exam_date: string;
  category: string;
}

export interface Exam2 {
  id: number;
  exam_id: string;
  name: string;
  exam_date: string;
  duration: string;
  keywords: string;
  category: string;
  application_link: string;
  more_info: string;
  exam_description: string;
  eligibility_criteria: string;
  important_resources: string;
  important_dates: string;
}
export const loadJSON = (fileName: string) => {
  try {
    const filePath = path.join(process.cwd(), "data", fileName);
    const jsonData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error(`Error loading ${fileName}:`, error);
    return [];
  }
};

const categoriesPath = path.join(process.cwd(), "data", "categories.json");
const examsPath = path.join(process.cwd(), "data", "exam.json");

const categories: Category[] = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));
const exams: Exam[] = JSON.parse(fs.readFileSync(examsPath, "utf-8"));
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();

export const getExamByName = (slug: string): Exam | undefined => {
  return exams.find((exam) => slugify(exam.name) === slug);
};
// Function to get popular exams
export const getPopularExams = (): { name: string; exam_date: string; other_category: string }[] => {
  const popularCategory = categories.find((cat) => cat.id === 3);
  if (!popularCategory) return [];

  const popularCategoryId = popularCategory.id.toString();

  return exams
    .map((exam) => {
      const examCategories = exam.category.split(",").map((c) => c.trim());
      if (examCategories.includes(popularCategoryId)) {
        const otherCategoryId = examCategories.find((c) => c !== popularCategoryId);
        const otherCategoryName = categories.find((cat) => cat.id.toString() === otherCategoryId)?.name || "Unknown";

        return {
          name: exam.name,
          exam_date: exam.exam_date,
          other_category: otherCategoryName,
        };
      }
      return null;
    })
    .filter(Boolean) as { name: string; exam_date: string; other_category: string }[];
};

// Function to get exams by category
export const getExamsByCategory = (categoryId: number): { name: string; exam_date: string }[] => {
  const categoryIdStr = categoryId.toString();

  return exams
    .filter((exam) => exam.category.split(",").map((c) => c.trim()).includes(categoryIdStr))
    .map((exam) => ({
      name: exam.name,
      exam_date: exam.exam_date,
    }));
};
