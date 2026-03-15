// /app/api/exams/route.ts (or /pages/api/exams.ts for Pages Router)
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth'; // Or use your Firebase auth method
import fs from 'fs';
import path from 'path';

const examsPath = path.join(process.cwd(), 'data', 'exams.json');
const exams = JSON.parse(fs.readFileSync(examsPath, 'utf-8'));

export async function GET(req: NextRequest) {
  // Optional: Add auth check (e.g., via Firebase or NextAuth)
  const session = await getServerSession(); // Adjust based on your auth setup
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query')?.toLowerCase() || '';

  const filteredExams = query
    ? exams.filter((exam: any) => exam.name.toLowerCase().includes(query))
    : []; // Return empty if no query to avoid exposing all

  return NextResponse.json(filteredExams.slice(0, 20)); // Limit results for security
}