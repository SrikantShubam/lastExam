# Implementation Batch 2
**Date:** 2026-03-15
**Status:** Planning
**Prerequisites:** Batch 1 Complete
**Assigned:** Atla

---

## Overview

Batch 2 builds production-ready features that were either mock-data placeholders or missing from the initial implementation. This batch focuses on **data-backed features** and **score tracking**.

**Key Focus:** Real leaderboard, exam history tracking, and user progress analytics.

---

## Feature Specifications

### 1. Real Leaderboard System

**Objective:** Replace mock leaderboard with competitive, data-driven leaderboard with multiple categories.

**Current State:**
- `src/app/leaderboard/page.tsx` has hardcoded data (to be removed in Batch 1)

**Required Actions:**

#### 1.1 Database Schema

Create Firestore collections:

```
leaderboards/
├── global/
│   └── entries/{uid}/
│       ├── uid: string
│       ├── name: string
│       ├── avatarUrl: string
│       ├── totalPoints: number
│       ├── examsCompleted: number
│       ├── currentStreak: number
│       ├── lastActive: timestamp
│       └── rank: number (denormalized for queries)
├── subjects/
│   └── {subject}/
│       └── entries/{uid}/
│           ├── (same fields as global)
│           └── subjectPoints: number
└── exams/
    └── {examId}/
        └── entries/{uid}/
            ├── (same fields as global)
            └── examPoints: number
```

#### 1.2 API Routes

Create `pages/api/leaderboard/{category}.ts`:

```typescript
// GET /api/leaderboard/global?limit=10&offset=0
// GET /api/leaderboard/subject/Mathematics?limit=10
// GET /api/leaderboard/exam/jee-main?limit=10

// Supports:
// - limit: number of results (default 20, max 100)
// - offset: pagination offset (default 0)
// - currentUserUid: to highlight current user's rank
```

Response format:
```typescript
{
  category: "global",
  entries: [
    {
      rank: 1,
      uid: "xxx",
      name: "Rahul Sharma",
      avatarUrl: "https://...",
      totalPoints: 2850,
      examsCompleted: 45,
      currentStreak: 7
    },
    // ...
  ],
  currentUserRank?: { // if currentUserUid provided
    rank: 15,
    totalPoints: 1250
  },
  pagination: {
    total: 1250,
    limit: 20,
    offset: 0,
    hasMore: true
  }
}
```

#### 1.3 Leaderboard Updates

Create a trigger system to update leaderboards when:
- User completes an exam
- User answers quiz questions correctly

Implement via:
- **Cloud Function** (preferred, automatic updates)
- OR Manual update via API on exam completion (fallback)

API route to trigger update: `POST /api/leaderboard/update`

```typescript
// Request body:
{
  userId: string,
  category: "global" | "subject" | "exam",
  categoryValue?: string, // subject name or exam ID
  pointsEarned: number,
  examCompleted?: boolean
}
```

#### 1.4 Frontend Implementation

Create `pages/leaderboard.tsx` (Pages Router):

**Features:**
- Tabbed interface: Global | By Subject | By Exam
- Infinite scroll pagination (load more on scroll)
- Highlight current user's rank (even if not in top 100)
- Search/filter by exam name, subject
- Time selector: All time | This month | This week
- Real-time updates (poll every 30s or use Firestore realtime)

**UI Components:**
- Podium top 3 (gold/silver/bronze)
- Rank badges
- Hover cards showing user stats

**Success Criteria:**
- Leaderboard loads real data from Firestore
- Pagination works smoothly
- Current user sees their rank highlighted
- Updating scores reflects on leaderboard
- Multiple categories (global, subject, exam) work
- Search/filter functions properly

**DO NOT:** Use any cached or mock data. Everything must come from Firestore.

---

### 2. Enhanced Exam History & Analytics

**Objective:** Rich exam history with detailed analytics and progress tracking.

**Current State:**
- `pages/api/dashboard-data.ts` returns basic exam history
- Limited analytics

**Required Actions:**

#### 2.1 Database Schema

Expand exam history data:

```
users/{uid}/
├── examHistory/{examId} -> NO, this is wrong
│
├── examHistory/{historyId}/
│   ├── examId: string
│   ├── examName: string
│   ├── subject: string
│   ├── paper: string
│   ├── score: number
│   ├── maxScore: number
│   ├── percentage: number
│   ├── timestamp: timestamp
│   ├── timeSpent: number (minutes)
│   ├── questionsAttempted: number
│   ├── questionsCorrect: number
│   ├── detailedResults: [
│       {
│         questionId: string,
│         isCorrect: boolean,
│         timeTaken: number (seconds)
│       }
│     ]
│   └── pointsEarned: number
│
├── quizHistory/{quizId}/
│   ├── subject: string
│   ├── score: number
│   ├── totalQuestions: number
│   ├── accuracy: number
│   ├── timestamp: timestamp
│   └── questionsAttempted: string[]
│
├── subjects/{subject}/
│   └── stats/
│       ├── totalQuestionsAnswered: number
│       ├── correctAnswers: number
│       ├── averageAccuracy: number
│       ├── bestScore: number
│       ├── examsAttempted: number
│       └── timeSpent: number (minutes)
│
└── analytics/
    ├── weeklyActivity: [
        { date: "2026-03-09", points: 150, examsCompleted: 2 },
        // last 30 days
      ]
    ├── skillGaps: [
        { subject: "Mathematics", accuracy: 0.62 },
        { subject: "Physics", accuracy: 0.85 }
      ]
    └── improvementTrends: {
        overallAccuracy: { lastMonth: 0.65, thisMonth: 0.72 },
        averageScore: { lastMonth: 75, thisMonth: 82 }
      }
```

#### 2.2 API Routes

**`pages/api/analytics/overview.ts`**
```typescript
// GET /api/analytics/overview

// Returns:
{
  totalPoints: number,
  examsCompleted: number,
  currentStreak: number,
  bestStreak: number,
  averageAccuracy: number,
  timeSpentStudying: number (minutes),
  subjectsMastered: string[],
  subjectsNeedingWork: string[],
  weeklyProgress: { points: number, exams: number }[],
  improvementTrend: number // positive = improving
}
```

**`pages/api/analytics/subject.ts`**
```typescript
// GET /api/analytics/subject/{subject}

// Returns detailed stats for a specific subject:
{
  subject: string,
  totalQuestionsAnswered: number,
  correctAnswers: number,
  accuracy: number,
  averageTimePerQuestion: number (seconds),
  weakTopics: [
    { topic: "Calculus", accuracy: 0.45 },
    { topic: "Linear Algebra", accuracy: 0.52 }
  ],
  strongTopics: [
    { topic: "Trigonometry", accuracy: 0.92 }
  ],
  examHistory: [
    { examId, score, timestamp }
  ],
  accuracyTrend: [0.65, 0.68, 0.72, 0.70, 0.75] // last 5 attempts
}
```

#### 2.3 Frontend Implementation

Create `pages/analytics.tsx`:

**Features:**
- Overview dashboard with key metrics
- Subject-wise performance charts
- Weekly activity heatmap
- Skill gap analysis (what to focus on)
- Progress trends over time
- Compare performance vs average user

**UI Components:**
- Charts: line charts, bar charts, pie charts (use recharts or similar)
- Heatmap for study activity (GitHub-style)
- Subject cards with progress bars
- "Focus areas" list (red = weak, green = strong)

**Success Criteria:**
- Dashboard loads real historical data
- Charts visualize trends accurately
- Subject-level drill-down works
- Weak areas identified correctly
- Comparison data available

---

### 3. Detailed Exam Results View

**Objective:** After completing an exam, show detailed breakdown of performance.

**Current State:**
- Basic score display (likely exists)
- No question-level breakdown

**Required Actions:**

#### 3.1 Exam Completion Flow Update

When user completes exam, save detailed results:

```typescript
// Save to users/{uid}/examHistory/{historyId}
{
  examId: "jee-main-2023",
  examName: "JEE Main 2023",
  subject: "Physics",
  paper: "Paper 1",
  score: 45,
  maxScore: 90,
  percentage: 50,
  timestamp: Date.now(),
  timeSpent: 45, // minutes
  questionsAttempted: 45,
  questionsCorrect: 22,
  detailedResults: [
    {
      questionId: "q1",
      questionText: "What is the...",
      userAnswer: "A",
      correctAnswer: "A",
      isCorrect: true,
      timeTaken: 45, // seconds
      explanation: "The correct answer is..."
    },
    // ... for all questions
  ]
}
```

#### 3.2 Create Result Page

Create `pages/exams/[examId]/[subject]/[paper]/result.tsx`:

**Features:**
- Score summary card with percentage
- Time spent
- Rank comparison (if available)
- Question-by-question breakdown:
  - Correct ✅ / Incorrect ❌ / Skipped ⏸️
  - Click to see question + explanation
  - Time taken per question
- Subject-wise performance (if multiple subjects)
- "Retry" button
- "Share result" button
- "Review mistakes" focused view

**UI Components:**
- Score visualization (circular progress or bar)
- Question list with status icons
- Expanded question view with explanation
- Analytics summary chart

**Success Criteria:**
- User can review every question after exam
- Explanations provided for incorrect answers
- Time analysis shows which questions took longest
- Can retry exam or review specific sections

---

### 4. Quiz History & Performance Tracking

**Objective:** Track quiz attempts and show progress over time.

**Current State:**
- Quiz exists (Batch 1 will fix hardcoded data)
- No history tracking

**Required Actions:**

#### 4.1 Database Schema

Already defined in section 2.1:
```
users/{uid}/quizHistory/{quizId}/
```

#### 4.2 API Route

`pages/api/quiz/history.ts`:
```typescript
// GET /api/quiz/history?limit=10&subject=Mathematics

// Returns:
{
  totalQuizzesTaken: number,
  averageAccuracy: number,
  bestScore: number,
  recentQuizzes: [
    {
      quizId: string,
      subject: string,
      score: number,
      totalQuestions: number,
      accuracy: number,
      timestamp: timestamp,
      timeTaken: number // minutes
    }
  ],
  subjectBreakdown: {
    Mathematics: { total: 15, bestScore: 50, avgAccuracy: 0.80 },
    Physics: { total: 10, bestScore: 40, avgAccuracy: 0.72 }
  }
}
```

#### 4.3 Frontend Implementation

Update quiz page to show:
- Previous quiz history
- Subject-wise performance
- Improvement trend

Create `pages/quiz/history.tsx`:
- List of past quizzes
- Subject filter
- Performance graph over time
- "Retake" for any past quiz

**Success Criteria:**
- Quiz history saved to Firestore
- User can see progress over time
- Identify which subjects need practice
- Can retake any quiz from history

---

### 5. Points & Gamification System

**Objective:** Centralized points system with clear values and rewarding progress.

**Required Actions:**

#### 5.1 Define Points Values

Create constant/enum:

```typescript
const POINTS_VALUES = {
  EXAM_ATTEMPT: 10,              // Just starting an exam
  EXAM_COMPLETION: 50,           // Finishing any exam
  EXAM_PERFECT_SCORE: 100,       // 100% on exam
  QUIZ_CORRECT: 10,              // Per correct question
  QUIZ_PERFECT: 50,              // 100% on quiz
  DAILY_LOGIN: 5,                // Logging in daily
  STREAK_DAY_3: 20,              // 3-day streak
  STREAK_DAY_7: 50,              // 7-day streak
  STREAK_DAY_30: 100,            // 30-day streak
  MILESTONE_10_EXAMS: 100,       // Completed 10 exams
  MILESTONE_50_EXAMS: 500,       // Completed 50 exams
  MILESTONE_100_EXAMS: 1000      // Completed 100 exams
};
```

#### 5.2 Points Calculation Service

Create `lib/points.ts`:

```typescript
// Functions:
calculateExamPoints(score, maxScore, percentage, timeSpent) => points
calculateQuizPoints(score, totalQuestions, accuracy) => points
calculateStreakBonus(streakDays) => points
checkMilestones(userStats) => points[]
```

#### 5.3 Points Update Trigger

API route: `POST /api/user/points/add`

```typescript
// Request:
{
  userId: string,
  type: "EXAM" | "QUIZ" | "LOGIN" | "MILESTONE",
  metadata: { score, maxScore, subject, etc. }
}

// Updates:
// - users/{uid}/totalPoints
// - leaderboards/all/{uid}/totalPoints
// - users/{uid}/pointsHistory[] (log all point additions)
```

#### 5.4 Frontend: Points Dashboard

Add to dashboard:
- Total points prominently displayed
- Points breakdown by category (exams, quizzes, bonuses)
- Recent points activity feed
- Next milestone progress bar

**Success Criteria:**
- Points calculated consistently
- Leaderboard reflects real-time changes
- User understands how points work
- Milestones clearly defined and achieved

---

### 6. Firebase Admin Cloud Functions (Optional, Recommended)

**Objective:** Trigger leaderboard and points updates automatically.

**If NOT implementing:**
Ensure all API routes are called correctly from frontend on each action.

**If implementing:**

Create functions to trigger on:
- User document changes (auth creation)
- Exam history document creation
- Quiz history document creation

Functions:
- `updateLeaderboardOnExamComplete` - Recalculates ranks
- `updatePointsOnAction` - Adds points and updates totals
- `checkMilestones` - Awards milestone bonuses

**Deployment:**
- Use Firebase Functions CLI
- Test locally with emulator
- Deploy to production

**Success Criteria:**
- Leaderboard updates automatically
- No race conditions on concurrent updates
- Functions have error handling and retry logic

---

## Dependencies

Batch 2 requires:
- Batch 1 complete (clean codebase)
- Firestore indexes for leaderboard queries
- Cloud Functions deployment (if implementing)
- Real client usage data (optional, for comparison)

---

## Testing Checklist

Before marking Batch 2 complete:

- [ ] Leaderboard loads and sorts correctly
- [ ] Leaderboard pagination works
- [ ] Current user rank highlighted
- [ ] Search/filter by subject and exam
- [ ] Analytics dashboard loads historical data
- [ ] Charts visualize trends accurately
- [ ] Subject-wise drill-down works
- [ ] Exam results show question-level breakdown
- [ ] Quiz history saved and retrievable
- [ ] Points calculated consistently
- [ ] Leaderboard updates when points change
- [ ] Time zone awareness across features
- [ ] Performance acceptable (< 2s for dashboard load)

---

## Notes for Atla

1. **Batch 2 is data-heavy.** Focus on efficient Firestore queries and proper indexing.
2. **Cache intelligently.** Don't fetch everything on every page load.
3. **Test with realistic data.** Load sample exam history to verify analytics calculations.
4. **Points system must be immutable.** Never subtract points, only add (or add negative for corrections with clear reasons).
5. **Leaderboard requires proper transactions** to avoid race conditions.

---

## End State for Batch 2

The app now has:
- ✅ Real, competitive leaderboards
- ✅ Rich analytics and progress tracking
- ✅ Detailed exam result breakdown
- ✅ Complete quiz history
- ✅ Gamification points system
- ✅ User can track improvement over time

All features are data-backed, no mock data.

---

**Next:** Batch 3 - User engagement features (reminders, recommendations, social)
