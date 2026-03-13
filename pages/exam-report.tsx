import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import SummaryScreen from '../components/exam/SummaryScreen'; // Adjust path based on your structure
import CryptoJS from 'crypto-js';
import Layout from '../components/Layout'; // Adjust if needed
import { toast } from 'react-toastify';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "default-key";

export default function ExamReport() {
  const router = useRouter();
  const { exam, subject, paper, mode = "exam" } = router.query as {
    exam?: string;
    subject?: string;
    paper?: string;
    mode?: string;
  };

  const [summaryData, setSummaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!exam || !subject || !paper || !mode) {
      toast.error('Missing exam parameters.');
      router.push('/dashboard');
      return;
    }

    const key = `summaryData-${mode}-${exam}-${subject}-${paper}`;
    const storedData = localStorage.getItem(key);
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setSummaryData(parsedData);
        localStorage.removeItem(key); // Clear after loading
      } catch (error) {
        console.error('Error parsing summary data:', error);
        toast.error('Invalid summary data.');
        router.push('/dashboard');
      }
    } else {
      toast.error('No summary data found.');
      router.push('/dashboard');
    }
    setLoading(false);
  }, [exam, subject, paper, mode, router]);

  const decryptAnswer = (questionNo: number): string | null => {
    const encryptedAnswer = localStorage.getItem(`encryptedAnswer-${mode}-${exam}-${subject}-${paper}-${questionNo}`);
    if (!encryptedAnswer || !ENCRYPTION_KEY) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedAnswer, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8) || null;
    } catch (error) {
      console.error(`Error decrypting answer for question ${questionNo}:`, error);
      return null;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center text-lg text-muted-foreground py-12">Loading report...</div>
      </Layout>
    );
  }

  if (!summaryData) {
    return (
      <Layout>
        <div className="text-center text-lg text-muted-foreground py-12">No report data available.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SummaryScreen
        questions={summaryData.questions}
        userAnswers={summaryData.userAnswers}
        flaggedQuestions={summaryData.flaggedQuestions}
        totalQuestions={summaryData.totalQuestions}
        positiveMarking={summaryData.positiveMarking}
        negativeMarking={summaryData.negativeMarking}
        timeTaken={summaryData.timeTaken}
        paperName={summaryData.paperName}
        decryptAnswer={decryptAnswer}
      />
    </Layout>
  );
}