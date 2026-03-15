import { generateResponse } from './groq';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  type: 'mcq' | 'fill-blank';
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  examId: string;
}

export async function generateQuestions(
  examData: any,
  syllabus: string,
  examStructure: any,
  count: number = 10
): Promise<Question[]> {
  const prompt = `
Generate ${count} multiple choice questions for exam: ${examData.name}
Syllabus: ${syllabus}
Exam structure: ${JSON.stringify(examStructure)}

Return JSON array with this structure:
{
  "questions": [
    {
      "id": "unique-id",
      "question": "question text",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A",
      "explanation": "why this is correct",
      "type": "mcq",
      "difficulty": "medium",
      "subject": "Physics",
      "examId": "${examData.id}"
    }
  ]
}
`;

  const response = await generateResponse(prompt);
  const parsed = JSON.parse(response);
  return parsed.questions;
}
