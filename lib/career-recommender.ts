import { generateResponse } from './groq';

export interface AssessmentResponse {
  questionId: string;
  answer: string;
}

export interface CareerRecommendation {
  career: string;
  description: string;
  whyFits: string;
  recommendedExams: string[];
  matchScore: number;
}

export async function recommendCareers(responses: AssessmentResponse[], availableExams: { id: string; name: string; category: string }[]): Promise<CareerRecommendation[]> {
  const examList = availableExams.map(e => `${e.name} (${e.id})`).join(', ');
  const prompt = `Based on these assessment responses: ${JSON.stringify(responses)}\n\nAvailable exams: ${examList}\n\nAnalyze and recommend top 3 career paths.\n\nReturn ONLY a valid JSON array with this EXACT structure:\n[\n  {\n    "career": "Research Scientist",\n    "description": "Brief description",\n    "whyFits": "Why this fits based on responses",\n    "recommendedExams": ["exam-id-1", "exam-id-2"],\n    "matchScore": 85\n  }\n]`;

  try {
    const response = await generateResponse(prompt);
    const parsed = JSON.parse(response);

    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array');
    }

    return parsed.slice(0, 3).map(r => ({
      career: r.career || 'Unknown',
      description: r.description || '',
      whyFits: r.whyFits || '',
      recommendedExams: Array.isArray(r.recommendedExams) ? r.recommendedExams : [],
      matchScore: typeof r.matchScore === 'number' ? Math.min(100, Math.max(0, r.matchScore)) : 70
    }));
  } catch (error) {
    console.error('Career recommendation error:', error);
    throw new Error('Failed to generate career recommendations');
  }
}
