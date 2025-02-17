import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const categoriesPath = path.join(process.cwd(), "data", "categories.json");
    const examsPath = path.join(process.cwd(), "data", "exam.json");

    const categories = JSON.parse(fs.readFileSync(categoriesPath, "utf-8"));
    const exams = JSON.parse(fs.readFileSync(examsPath, "utf-8"));

    return NextResponse.json({ categories, exams });
  } catch (error) {
    console.error("Error loading categories or exams:", error);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
