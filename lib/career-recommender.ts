import { generateResponse } from './groq';

export interface AssessmentResponse {
  questionId: string;
  answer: string | number;
}

export interface CareerRecommendation {
  careerPath: string;
  description: string;
  whyFitsYou: string;
  recommendedExams: string[];
  matchPercentage: number;
}

export async function recommendCareers(
  assessmentResponses: AssessmentResponse[],
  examData: any[]
): Promise<CareerRecommendation[]> {
  const prompt = `
Based on these assessment responses: ${JSON.stringify(assessmentResponses)}

Analyze and recommend top 3 career paths for this student.

Available exams on platform: ${JSON.stringify(examData.map(e => ({id: e.id, name: e.name, category: e.category})))}

Return JSON array:
{
  "recommendations": [
    {
      "careerPath": "Research Scientist",
      "description": "Conduct scientific research...",
      "whyFitsYou": "Based on your interest in biology...",
      "recommendedExams": ["exam-id-1", "exam-id-2"],
      "matchPercentage": 85
    }
  ]
}
`;

  const response = await generateResponse(prompt);
  const parsed = JSON.parse(response);
  return parsed.recommendations;
}
