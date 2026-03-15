/**
 * Question Generation Pipeline
 * Uses Groq API to generate practice questions from exam data and syllabus
 */

import { generateJSONResponse, GROQ_MODELS } from './groq';

export interface ExamStructure {
  sections: Array<{
    name: string;
    questionCount: number;
    marksPerQuestion?: number;
    duration?: number;
  }>;
  totalQuestions?: number;
  totalMarks?: number;
  duration?: number;
}

export interface GeneratedQuestion {
  id: string;
  question: string;
  options: string[]; // For MCQ
  correct_answer: string; // Could be option letter or text
  explanation: string;
  type: 'mcq' | 'fill-in-the-blanks' | 'true-false' | 'short-answer';
  difficulty: 'easy' | 'medium' | 'hard';
  subject?: string;
  topic?: string;
  marks?: number;
}

export interface QuestionGenerationResult {
  questions: GeneratedQuestion[];
  examName?: string;
  subject?: string;
  generatedAt: string;
  totalQuestions: number;
  distribution: {
    mcq: number;
    fillInBlanks: number;
    trueFalse: number;
    shortAnswer: number;
  };
}

/**
 * Generate questions based on exam data, syllabus, and structure
 * @param examData - The exam metadata (name, description, etc.)
 * @param syllabus - The syllabus text (can be scraped or provided)
 * @param examStructure - Structure of the exam (sections, question counts)
 * @param count - Number of questions to generate
 * @param difficulty - Target difficulty level
 * @returns Generated questions in JSON format
 */
export async function generateQuestions(
  examData: any,
  syllabus: string,
  examStructure: ExamStructure,
  count: number = 10,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<GeneratedQuestion[]> {
  // Validate inputs
  if (!examData || !syllabus) {
    throw new Error('Exam data and syllabus are required');
  }

  if (count < 1) {
    throw new Error('Count must be at least 1');
  }

  // Calculate question distribution based on exam structure or default
  const distribution = calculateQuestionDistribution(examStructure, count);

  // Generate the prompt
  const prompt = buildQuestionPrompt(
    examData,
    syllabus,
    examStructure,
    count,
    difficulty,
    distribution
  );

  try {
    // Call Groq API with JSON response expectation
    const result = await generateJSONResponse<{ questions: GeneratedQuestion[] }>(
      prompt,
      GROQ_MODELS.LLAMA3_70B,
      {
        temperature: 0.7,
        maxTokens: 4096,
      }
    );

    if (!result.questions || !Array.isArray(result.questions)) {
      throw new Error('Invalid response format from Groq API');
    }

    // Validate and clean the generated questions
    const validatedQuestions = result.questions
      .filter(q => isQuestionValid(q))
      .map((q, index) => ({
        ...q,
        id: q.id || generateQuestionId(examData?.name || 'exam', index),
        type: q.type || 'mcq',
        difficulty: q.difficulty || difficulty,
      }));

    return validatedQuestions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw new Error(`Failed to generate questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Calculate the distribution of question types
 */
function calculateQuestionDistribution(
  examStructure: ExamStructure,
  totalCount: number
): {
  mcq: number;
  fillInBlanks: number;
  trueFalse: number;
  shortAnswer: number;
} {
  // Default distribution: 70% MCQ, 20% Fill-in-blanks, 10% True/False
  const defaultDistribution = {
    mcq: Math.floor(totalCount * 0.7),
    fillInBlanks: Math.floor(totalCount * 0.2),
    trueFalse: Math.floor(totalCount * 0.1),
    shortAnswer: 0,
  };

  // If exam structure specifies sections with types, use that
  if (examStructure.sections && examStructure.sections.length > 0) {
    const total = examStructure.sections.reduce((sum, s) => sum + s.questionCount, 0);
    if (total === totalCount) {
      // Try to infer types from section names
      let mcq = 0;
      let fillInBlanks = 0;
      let trueFalse = 0;

      examStructure.sections.forEach(section => {
        const sectionName = section.name.toLowerCase();
        if (sectionName.includes('mcq') || sectionName.includes('multiple choice')) {
          mcq += section.questionCount;
        } else if (sectionName.includes('fill') || sectionName.includes('blank')) {
          fillInBlanks += section.questionCount;
        } else if (sectionName.includes('true') || sectionName.includes('false')) {
          trueFalse += section.questionCount;
        } else {
          mcq += section.questionCount; // Default to MCQ
        }
      });

      return {
        mcq: mcq || defaultDistribution.mcq,
        fillInBlanks: fillInBlanks || defaultDistribution.fillInBlanks,
        trueFalse: trueFalse || defaultDistribution.trueFalse,
        shortAnswer: defaultDistribution.shortAnswer,
      };
    }
  }

  return defaultDistribution;
}

/**
 * Build the prompt for question generation
 */
function buildQuestionPrompt(
  examData: any,
  syllabus: string,
  examStructure: ExamStructure,
  count: number,
  difficulty: 'easy' | 'medium' | 'hard',
  distribution: {
    mcq: number;
    fillInBlanks: number;
    trueFalse: number;
    shortAnswer: number;
  }
): string {
  const examInfo = examData?.more_info || '';
  const examDesc = examData?.exam_description || '';
  const examName = examData?.name || 'Unknown Exam';

  return `You are an expert exam question generator for competitive exams in India. Your task is to generate high-quality practice questions.

EXAM NAME: ${examName}
EXAM DESCRIPTION: ${examDesc}
EXAM DETAILS: ${examInfo}

SYLLABUS:
${syllabus.substring(0, 3000)} ${syllabus.length > 3000 ? '...' : ''}

EXAM STRUCTURE:
Total Sections: ${examStructure.sections?.length || 1}
${examStructure.sections?.map((s, i) => 
  `Section ${i + 1}: ${s.name} (${s.questionCount} questions${s.marksPerQuestion ? `, ${s.marksPerQuestion} marks each` : ''})`
).join('\n') || 'Section 1: General (all questions)'}

QUESTION REQUIREMENTS:
- Total Questions: ${count}
- Difficulty Level: ${difficulty}
- Question Types Distribution:
  * MCQ (Multiple Choice Questions): ${distribution.mcq}
  * Fill-in-the-blanks: ${distribution.fillInBlanks}
  * True/False: ${distribution.trueFalse}
  * Short Answer: ${distribution.shortAnswer}

GUIDELINES FOR QUESTION GENERATION:
1. Generate questions that are directly related to the syllabus topics
2. Ensure questions match the specified difficulty level (${difficulty})
3. MCQ questions must have exactly 4 options (A, B, C, D)
4. The correct_answer field should contain the option letter (A, B, C, or D) for MCQs
5. Include brief but clear explanations for each question
6. Questions should test understanding, not just memorization
7. Avoid overly complex or ambiguous wording
8. For fill-in-the-blanks, the correct_answer should be the exact word/phrase
9. Include appropriate subject and topic fields based on the syllabus

RESPONSE FORMAT (JSON ONLY):
{
  "questions": [
    {
      "id": "unique-id-1",
      "question": "What is the capital of France?",
      "options": ["London", "Paris", "Berlin", "Madrid"],
      "correct_answer": "B",
      "explanation": "Paris is the capital and most populous city of France.",
      "type": "mcq",
      "difficulty": "medium",
      "subject": "Geography",
      "topic": "World Capitals",
      "marks": 1
    }
  ]
}

Generate ${count} questions following this format. Make sure all questions are valid and properly formatted.`;
}

/**
 * Validate a generated question
 */
function isQuestionValid(question: Partial<GeneratedQuestion>): boolean {
  if (!question.question || question.question.trim().length < 10) {
    return false;
  }

  if (!question.correct_answer) {
    return false;
  }

  if (question.type === 'mcq') {
    if (!question.options || !Array.isArray(question.options) || question.options.length !== 4) {
      return false;
    }
  }

  const validTypes = ['mcq', 'fill-in-the-blanks', 'true-false', 'short-answer'];
  if (!question.type || !validTypes.includes(question.type)) {
    return false;
  }

  const validDifficulty = ['easy', 'medium', 'hard'];
  if (question.difficulty && !validDifficulty.includes(question.difficulty)) {
    return false;
  }

  return true;
}

/**
 * Generate a unique question ID
 */
function generateQuestionId(examName: string, index: number): string {
  const timestamp = Date.now();
  const sanitizedName = examName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
  return `${sanitizedName}-q${index + 1}-${timestamp}`;
}

/**
 * Generate questions in batches for large requests
 */
export async function generateQuestionsBatch(
  examData: any,
  syllabus: string,
  examStructure: ExamStructure,
  totalCount: number,
  batchSize: number = 10,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<GeneratedQuestion[]> {
  const allQuestions: GeneratedQuestion[] = [];
  const batches = Math.ceil(totalCount / batchSize);

  for (let i = 0; i < batches; i++) {
    const remaining = totalCount - allQuestions.length;
    const currentBatchSize = Math.min(batchSize, remaining);

    console.log(`Generating batch ${i + 1}/${batches} (${currentBatchSize} questions)...`);

    try {
      const batchQuestions = await generateQuestions(
        examData,
        syllabus,
        examStructure,
        currentBatchSize,
        difficulty
      );

      allQuestions.push(...batchQuestions);

      // Add a small delay between batches to avoid rate limiting
      if (i < batches - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`Error in batch ${i + 1}:`, error);
      // Continue with next batch even if one fails
    }
  }

  return allQuestions;
}

/**
 * Generate questions for a specific topic
 */
export async function generateTopicQuestions(
  topic: string,
  examData: any,
  syllabus: string,
  count: number = 5,
  difficulty: 'easy' | 'medium' | 'hard' = 'medium'
): Promise<GeneratedQuestion[]> {
  const examStructure: ExamStructure = {
    sections: [{ name: topic, questionCount: count }],
    totalQuestions: count,
  };

  const topicSpecificPrompt = `Generate ${count} questions specifically about the topic: ${topic}.

Use the following context:
EXAM: ${examData?.name || 'Unknown Exam'}
SYLLABUS: ${syllabus.substring(0, 1000)}

Focus exclusively on questions related to ${topic}. Ensure the questions cover different aspects of this topic.`;

  try {
    const result = await generateJSONResponse<{ questions: GeneratedQuestion[] }>(
      topicSpecificPrompt,
      GROQ_MODELS.LLAMA3_70B,
      {
        temperature: 0.7,
        maxTokens: 2048,
      }
    );

    return result.questions?.filter(q => isQuestionValid(q)) || [];
  } catch (error) {
    console.error('Error generating topic questions:', error);
    throw new Error(`Failed to generate questions for topic ${topic}`);
  }
}

/**
 * Generate mock exam paper
 */
export async function generateMockExam(
  examData: any,
  syllabus: string,
  examStructure: ExamStructure
): Promise<QuestionGenerationResult> {
  const totalQuestions = examStructure.totalQuestions ||
    examStructure.sections?.reduce((sum, s) => sum + s.questionCount, 0) ||
    30;

  console.log(`Generating mock exam with ${totalQuestions} questions...`);

  const questions = await generateQuestionsBatch(
    examData,
    syllabus,
    examStructure,
    totalQuestions,
    10, // Batch size
    'medium' // Default difficulty for mock exam
  );

  // Calculate distribution
  const distribution = {
    mcq: questions.filter(q => q.type === 'mcq').length,
    fillInBlanks: questions.filter(q => q.type === 'fill-in-the-blanks').length,
    trueFalse: questions.filter(q => q.type === 'true-false').length,
    shortAnswer: questions.filter(q => q.type === 'short-answer').length,
  };

  return {
    questions,
    examName: examData?.name,
    generatedAt: new Date().toISOString(),
    totalQuestions: questions.length,
    distribution,
  };
}
