/**
 * Career Recommender Logic
 * Analyzes student assessment responses and recommends career paths
 */

import { generateJSONResponse, GROQ_MODELS } from './groq';

export interface AssessmentResponse {
  questionId?: string;
  question: string;
  userAnswer: string | string[];
  correctAnswer?: string;
  isCorrect?: boolean;
  subject?: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  timeTaken?: number; // in seconds
}

export interface StudentProfile {
  id?: string;
  name?: string;
  grade?: string;
  interests?: string[];
  strengths?: string[];
  weakAreas?: string[];
  preferences?: {
    fieldOfInterest?: string;
    careerGoals?: string;
    studyStyle?: string;
  };
}

export interface CareerRecommendation {
  careerPath: string;
  description: string;
  whyItFits: string;
  matchingExams: Array<{
    examId: string;
    examName: string;
    relevance: 'high' | 'medium' | 'low';
    description?: string;
  }>;
  requiredSkills: string[];
  preparationTips: string[];
  confidence: number; // 0-100
}

export interface CareerAnalysisResult {
  topRecommendations: CareerRecommendation[];
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  suggestedNextSteps: string[];
}

/**
 * Analyze student's assessment responses and recommend career paths
 * @param assessmentResponses - Array of student's responses to assessment questions
 * @param studentProfile - (Optional) Additional profile information about the student
 * @param availableExams - (Optional) List of available exams to match against
 * @returns Top 3 career path recommendations
 */
export async function recommendCareers(
  assessmentResponses: AssessmentResponse[],
  studentProfile?: Partial<StudentProfile>,
  availableExams?: any[]
): Promise<CareerAnalysisResult> {
  // Validate inputs
  if (!assessmentResponses || assessmentResponses.length === 0) {
    throw new Error('Assessment responses are required for career recommendation');
  }

  // Analyze the responses
  const analysis = analyzeStudentResponses(assessmentResponses);

  // Build the prompt for Groq API
  const prompt = buildCareerPrompt(analysis, studentProfile, availableExams);

  try {
    // Call Groq API for career recommendations
    const result = await generateJSONResponse<CareerAnalysisResult>(
      prompt,
      GROQ_MODELS.LLAMA3_70B,
      {
        temperature: 0.7,
        maxTokens: 3000,
      }
    );

    // Ensure we have exactly 3 recommendations (or fewer if not enough)
    if (result.topRecommendations && result.topRecommendations.length > 3) {
      result.topRecommendations = result.topRecommendations.slice(0, 3);
    }

    return result;
  } catch (error) {
    console.error('Error generating career recommendations:', error);
    throw new Error(`Failed to generate career recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Analyze student responses to extract patterns and insights
 */
function analyzeStudentResponses(responses: AssessmentResponse[]) {
  const subjects = new Map<string, { correct: number; total: number; easy: number; medium: number; hard: number }>();
  const topics = new Map<string, { correct: number; total: number }>();
  const strengths: string[] = [];
  const weakAreas: string[] = [];

  let totalCorrect = 0;
  let totalQuestions = 0;
  let totalTimeTaken = 0;
  let timeTakenCount = 0;

  responses.forEach(response => {
    // Count subject-wise performance
    if (response.subject) {
      if (!subjects.has(response.subject)) {
        subjects.set(response.subject, { correct: 0, total: 0, easy: 0, medium: 0, hard: 0 });
      }
      const subjectData = subjects.get(response.subject)!;
      subjectData.total++;
      if (response.isCorrect) {
        subjectData.correct++;
      }
      if (response.difficulty) {
        subjectData[response.difficulty]++;
      }
    }

    // Count topic-wise performance
    if (response.topic) {
      if (!topics.has(response.topic)) {
        topics.set(response.topic, { correct: 0, total: 0 });
      }
      const topicData = topics.get(response.topic)!;
      topicData.total++;
      if (response.isCorrect) {
        topicData.correct++;
      }
    }

    // Overall statistics
    if (response.isCorrect !== undefined) {
      totalQuestions++;
      if (response.isCorrect) {
        totalCorrect++;
      }
    }

    // Time tracking
    if (response.timeTaken !== undefined && response.timeTaken > 0) {
      totalTimeTaken += response.timeTaken;
      timeTakenCount++;
    }
  });

  // Identify strengths and weaknesses
  subjects.forEach((data, subject) => {
    const accuracy = (data.correct / data.total) * 100;
    if (accuracy >= 70 && data.total >= 3) {
      strengths.push(`${subject} (${accuracy.toFixed(0)}% accuracy)`);
    } else if (accuracy < 50 && data.total >= 3) {
      weakAreas.push(`${subject} (${accuracy.toFixed(0)}% accuracy)`);
    }
  });

  // Top performing topics
  const topicPerformance = Array.from(topics.entries())
    .filter(([_, data]) => data.total >= 2)
    .map(([topic, data]) => ({
      topic,
      accuracy: (data.correct / data.total) * 100,
    }))
    .sort((a, b) => b.accuracy - a.accuracy);

  return {
    overallAccuracy: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
    totalQuestions,
    totalCorrect,
    subjects: Object.fromEntries(subjects),
    topTopics: topicPerformance.slice(0, 5),
    strengths,
    weakAreas,
    averageTime: timeTakenCount > 0 ? totalTimeTaken / timeTakenCount : 0,
  };
}

/**
 * Build the prompt for career recommendation
 */
function buildCareerPrompt(
  analysis: any,
  studentProfile: Partial<StudentProfile> = {},
  availableExams: any[] = []
): string {
  const examList = availableExams.slice(0, 20).map(exam => ({
    id: exam.exam_id,
    name: exam.name,
    category: exam.category,
    description: exam.exam_description?.substring(0, 100) || '',
  }));

  return `You are an expert career counselor for students in India. Your task is to analyze a student's assessment results and provide personalized career recommendations.

STUDENT ASSESSMENT ANALYSIS:
- Overall Accuracy: ${analysis.overallAccuracy.toFixed(1)}%
- Questions Attempted: ${analysis.totalQuestions} of ${analysis.totalQuestions}
- Average Time per Question: ${analysis.averageTime.toFixed(1)} seconds

SUBJECT-WISE PERFORMANCE:
${Object.entries(analysis.subjects)
  .map(([subject, data]: [string, any]) => {
    const accuracy = ((data.correct / data.total) * 100).toFixed(1);
    return `  • ${subject}: ${data.correct}/${data.total} correct (${accuracy}%)`;
  })
  .join('\n')}

TOP PERFORMING TOPICS:
${analysis.topTopics.map((t: any) => `  • ${t.topic}: ${t.accuracy.toFixed(1)}% accuracy`).join('\n')}

IDENTIFIED STRENGTHS:
${analysis.strengths.length > 0 ? analysis.strengths.map((s: string) => `  • ${s}`).join('\n') : '  • None identified yet'}
AREAS FOR IMPROVEMENT:
${analysis.weakAreas.length > 0 ? analysis.weakAreas.map((w: string) => `  • ${w}`).join('\n') : '  • None identified'}
${studentProfile.name ? `STUDENT NAME: ${studentProfile.name}` : ''}
${studentProfile.grade ? `GRADE/CLASS: ${studentProfile.grade}` : ''}
${studentProfile.interests?.length ? `INTERESTS: ${studentProfile.interests.join(', ')}` : ''}
${studentProfile.strengths?.length ? `SELF-IDENTIFIED STRENGTHS: ${studentProfile.strengths.join(', ')}` : ''}
${studentProfile.weakAreas?.length ? `SELF-IDENTIFIED WEAKNESES: ${studentProfile.weakAreas.join(', ')}` : ''}
${studentProfile.preferences?.fieldOfInterest ? `FIELD OF INTEREST: ${studentProfile.preferences.fieldOfInterest}` : ''}
${studentProfile.preferences?.careerGoals ? `CAREER GOALS: ${studentProfile.preferences.careerGoals}` : ''}

AVAILABLE EXAMS TO CONSIDER:
${examList.map(exam => `  • ${exam.name} (ID: ${exam.id})${exam.category ? ` - Category: ${exam.category}` : ''}`).join('\n')}

TASK:
Based on the student's assessment performance, interests, and goals, recommend exactly 3 career paths. For each recommended career:

1. Provide a clear, specific career path name
2. Describe what the career involves
3. Explain why it fits this student (reference their strengths and performance)
4. Suggest at least 2 relevant exams from the available list (or mention if none match well)
5. List required skills for this career
6. Provide 2-3 specific preparation tips

RESPONSE FORMAT (JSON ONLY):
{
  "topRecommendations": [
    {
      "careerPath": "Data Scientist",
      "description": "Brief description of what this career involves...",
      "whyItFits": "Explain why this matches the student's strengths and interests...",
      "matchingExams": [
        {
          "examId": "exam-id-here",
          "examName": "Exact exam name from list",
          "relevance": "high|medium|low",
          "description": "Why this exam is relevant"
        }
      ],
      "requiredSkills": ["Skill 1", "Skill 2", "Skill 3"],
      "preparationTips": ["Tip 1", "Tip 2", "Tip 3"],
      "confidence": 85
    }
  ],
  "summary": "A brief summary (2-3 sentences) of the student's overall profile and potential...",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "areasForImprovement": ["Area 1", "Area 2"],
  "suggestedNextSteps": ["Recommended next step 1", "Next step 2", "Next step 3"]
}

REQUIREMENTS:
- Maximum 3 career recommendations
- Each recommendation should have a confidence score (0-100)
- Match exams from the provided list when possible
- Base recommendations on actual assessment performance data
- Be encouraging yet realistic
- Focus on careers that align with student strengths and interests
- Consider competitive exams relevant to each career path
- Include exam IDs exactly as provided in the available exams list
- If no exams match well for a career, you may suggest generic exam types or explain why`;
}

/**
 * Get career details for a specific career path
 */
export async function getCareerDetails(
  careerPath: string,
  availableExams: any[] = []
): Promise<CareerRecommendation> {
  const examList = availableExams
    .filter(exam => {
      const examName = exam.name?.toLowerCase() || '';
      const examDesc = exam.exam_description?.toLowerCase() || '';
      const careerLower = careerPath.toLowerCase();
      
      // Simple matching based on keywords
      const careerKeywords = {
        'engineering': ['jee', 'engineering', 'btech', 'bitsat', 'viteee'],
        'medical': ['neet', 'medical', 'mbbs', 'aiims'],
        'law': ['clat', 'ailet', 'law', 'llb'],
        'mba': ['cat', 'mat', 'xat', 'snap', 'mba'],
        'commerce': ['ca', 'cma', 'cs', 'accounting', 'commerce'],
        'design': ['nid', 'ceed', 'design'],
        'architecture': ['nata', 'jee main arch', 'architecture'],
        'analytics': ['cat', 'gmat', 'analytics', 'data'],
      };

      return Object.values(careerKeywords).some(keywords =>
        keywords.some(keyword => examName.includes(keyword) || examDesc.includes(keyword))
      );
    })
    .slice(0, 5)
    .map(exam => ({
      examId: exam.exam_id,
      examName: exam.name,
      relevance: 'medium' as const,
      description: exam.exam_description?.substring(0, 150) || '',
    }));

  const prompt = `Provide detailed information about the career path: ${careerPath}

Focus on:
1. What this career involves
2. Required skills and qualifications
3. Career prospects and growth in India
4. Typical salary expectations
5. Top companies/organizations in this field

Provide a concise, informative response in JSON format with this structure:
{
  "careerPath": "${careerPath}",
  "description": "...",
  "whyItFits": "...",
  "matchingExams": [],
  "requiredSkills": ["skill1", "skill2", "skill3"],
  "preparationTips": ["tip1", "tip2", "tip3"],
  "confidence": 90
}`;

  try {
    const result = await generateJSONResponse<CareerRecommendation>(
      prompt,
      GROQ_MODELS.LLAMA3_70B,
      {
        temperature: 0.6,
        maxTokens: 1500,
      }
    );

    // Override matching exams with our calculated ones
    result.matchingExams = examList;

    return result;
  } catch (error) {
    console.error('Error getting career details:', error);
    throw new Error(`Failed to get details for ${careerPath}`);
  }
}

/**
 * Compare multiple career options
 */
export async function compareCareers(
  careerPaths: string[],
  studentProfile?: Partial<StudentProfile>
): Promise<{
  comparison: string[];
  bestMatch: string;
  reasoning: string;
}> {
  const prompt = `Compare the following career paths for a student:
  
Career Paths to Compare:
${careerPaths.map((c, i) => `${i + 1}. ${c}`).join('\n')}
${studentProfile ? `
Student Context:
${studentProfile.grade ? `- Grade: ${studentProfile.grade}` : ''}
${studentProfile.interests?.length ? `- Interests: ${studentProfile.interests.join(', ')}` : ''}
${studentProfile.strengths?.length ? `- Strengths: ${studentProfile.strengths.join(', ')}` : ''}
` : ''}

Provide:
1. A comparison of all careers (key similarities and differences)
2. Which career is the best match and why
3. Specific reasoning for the recommendation

RESPONSE FORMAT (JSON ONLY):
{
  "comparison": ["Point 1 comparing careers", "Point 2", "Point 3"],
  "bestMatch": "Career Name",
  "reasoning": "Detailed explanation of why this is the best match..."
}`;

  try {
    const result = await generateJSONResponse<{
      comparison: string[];
      bestMatch: string;
      reasoning: string;
    }>(
      prompt,
      GROQ_MODELS.LLAMA3_70B,
      {
        temperature: 0.7,
        maxTokens: 2000,
      }
    );

    return result;
  } catch (error) {
    console.error('Error comparing careers:', error);
    throw new Error('Failed to compare careers');
  }
}
