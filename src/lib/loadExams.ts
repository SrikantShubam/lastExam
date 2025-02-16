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

export const loadExams = (): Exam[] => {
  try {
    const filePath = path.join(process.cwd(), "data", "exam.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error loading exams:", error);
    return [];
  }
};

export const loadCategories = (): Category[] => {
  try {
    const filePath = path.join(process.cwd(), "data", "categories.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
};

export const getPopularExams = (): { name: string; exam_date: string; other_category: string }[] => {
  const categories = loadCategories();
  const exams = loadExams();

  // Find the popular category (id: 3)
  const popularCategory = categories.find((cat) => cat.id === 3);
  
  if (!popularCategory) {
    console.warn("Popular category not found!");
    return [];
  }

  // Convert popular category ID to string for comparison
  const popularCategoryId = popularCategory.id.toString();

  // Filter exams that have popular category in their comma-separated list
  const filteredExams = exams
    .map((exam) => {
      const examCategories = exam.category.split(",").map((c) => c.trim());
      if (examCategories.includes(popularCategoryId)) {
        // Find the first category that is not "popular"
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
    .filter((exam) => exam !== null) as { name: string; exam_date: string; other_category: string }[];

  console.log("Filtered Popular Exams:", filteredExams);
  return filteredExams;
};