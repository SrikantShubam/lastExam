import { generateResponse } from './groq';

export interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  examId: string;
}

export async function generateQuestions(examData: { id: string; name: string; category: string }, syllabus: string, count: number = 10): Promise<GeneratedQuestion[]> {
  const prompt = `Generate ${count} multiple choice questions for exam: ${examData.name}\nCategory: ${examData.category}\nSyllabus topics: ${syllabus}\n\nReturn ONLY a valid JSON array with this EXACT structure:\n[\n  {\n    "id": "unique-id-1",\n    "question": "What is X?",\n    "options": ["Option A", "Option B", "Option C", "Option D"],\n    "correctAnswer": "Option A",\n    "explanation": "Explanation here",\n    "difficulty": "medium",\n    "subject": "Physics",\n    "examId": "${examData.id}"\n  }\n]`;

  try {
    const response = await generateResponse(prompt);
    const parsed = JSON.parse(response);

    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array');
    }

    return parsed.map(q => ({
      id: q.id || `q-${Date.now()}-${Math.random()}`,
      question: q.question || '',
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: q.correctAnswer || '',
      explanation: q.explanation || '',
      difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : 'medium',
      subject: q.subject || 'General',
      examId: q.examId || examData.id
    }));
  } catch (error) {
    console.error('Question generation error:', error);
    throw new Error('Failed to generate questions');
  }
}
