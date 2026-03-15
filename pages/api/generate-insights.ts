import type { NextApiRequest, NextApiResponse } from 'next';

// Define the expected structure of the request body from the dashboard
interface InsightsRequestBody {
  examHistory: { exam: string; score: number; timestamp: string }[];
  predictedScore: number;
}

// Define the structure of a successful response
interface InsightsResponse {
  tips: string[];
}

// Helper to find the weakest and strongest subjects from the user's history
function analyzeHistory(history: InsightsRequestBody['examHistory']) {
  const subjectScores: { [key: string]: number[] } = {};
  history.forEach(exam => {
    const subject = exam.exam.split('-')[1] || "General";
    if (!subjectScores[subject]) {
      subjectScores[subject] = [];
    }
    subjectScores[subject].push(exam.score);
  });

  let weakest = { subject: 'N/A', score: 101 };
  let strongest = { subject: 'N/A', score: -1 };
  for (const subject in subjectScores) {
    const avg = subjectScores[subject].reduce((a, b) => a + b, 0) / subjectScores[subject].length;
    if (avg < weakest.score) {
      weakest = { subject, score: Math.round(avg) };
    }
    if (avg > strongest.score) {
      strongest = { subject, score: Math.round(avg) };
    }
  }
  return { weakest, strongest };
}

// NEW: Pre-written fallback tips for when the API fails
const fallbackTips = [
    "Consistency is key. Try to dedicate at least one hour every day to focused study.",
    "Don't forget to review your mistakes. Understanding why you got a question wrong is as important as getting one right.",
    "Ensure you're getting enough rest. A well-rested mind performs significantly better under pressure."
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InsightsResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { examHistory, predictedScore }: InsightsRequestBody = req.body;

    if (!examHistory || examHistory.length < 3) {
      return res.status(400).json({ error: 'Insufficient exam history for analysis.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not set on the server.");
      // Use fallback instead of showing an error
      return res.status(200).json({ tips: fallbackTips });
    }

    const { weakest, strongest } = analyzeHistory(examHistory);

    // IMPROVEMENT 1: Add more context with the last 5 scores
    const recentTrend = examHistory
        .slice(0, 5) // Get the 5 most recent exams
        .map(e => `${e.score}% in ${e.exam.split('-')[1] || 'General'}`)
        .join(', ');

    const prompt = `
      You are an expert exam coach and performance analyst. A student has provided their performance data for a series of competitive exams.
      Analyze their data and provide exactly 3 concise, actionable, and encouraging tips in a numbered list format.
      Do not write any introduction or conclusion, only the numbered list. Use a friendly and motivational tone.

      PERFORMANCE DATA:
      - AI Predicted Score for their next exam: ${predictedScore}%
      - Student's Strongest Subject: ${strongest.subject} (Average Score: ${strongest.score}%)
      - Student's Weakest Subject: ${weakest.subject} (Average Score: ${weakest.score}%)
      - Recent Performance Trend (last 5 exams): ${recentTrend}

      Based on this data, generate the 3 tips now.
    `;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      // If the API call fails, throw an error to be caught by the catch block
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error('Failed to get insights from AI.');
    }

    const result = await response.json();
    
    // Check for valid response structure before accessing parts
    if (!result.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid response structure from AI.");
    }

    const text = result.candidates[0].content.parts[0].text;
    const tips = text.trim().split('\n').map(tip => tip.replace(/^\d+\.\s*/, ''));

    res.status(200).json({ tips });

  } catch (error: any) {
    console.error("Error in generate-insights handler:", error);
    // IMPROVEMENT 2: Provide helpful fallback tips instead of an error message
    res.status(200).json({ tips: fallbackTips });
  }
}
