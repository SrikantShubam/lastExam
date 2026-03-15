# Implementation Batch 3
**Date:** 2026-03-15
**Status:** Planning
**Prerequisites:** Batch 1 and Batch 2 Complete
**Assigned:** Atla

---

## Overview

Batch 3 adds **user engagement and growth features**: recommendations, reminders, social features, and personalization. This is about keeping users coming back and helping them learn better.

**Key Focus:** Personalization, retention, and learning assistance.

---

## Feature Specifications

### 1. Personalized Recommendations Engine

**Objective:** Suggest exams, papers, and topics based on user's weak areas and learning goals.

**Required Actions:**

#### 1.1 Database Schema

```
recommendations/
├── {uid}/
│   ├── lastUpdated: timestamp
│   └── items: [
│       {
│         id: string,
│         type: "EXAM" | "PAPER" | "SUBJECT" | "TOPIC",
│         title: string,
│         description: string,
│         reason: string, // why this is recommended
│         priority: number, // 1-3 (3 = highest)
│         actionUrl: string,
│         metadata: {
│           subject: string,
│           examId?: string,
│           paperId?: string,
│           estimatedDifficulty: "Easy" | "Medium" | "Hard"
│         },
│         createdAt: timestamp,
│         viewed: boolean,
│         actedOn: boolean
│       }
│     ]
```

#### 1.2 Recommendation Algorithm

Create `lib/recommendations.ts`:

**Factors considered:**
1. **Weak subjects** (low accuracy from analytics)
2. **Inconsistent subjects** (high variance in scores)
3. **Last practiced** (subjects not attempted in 7+ days)
4. **Goal alignment** (if user selected prep goals)
5. **Similar users** (collaborative filtering - simple version)
6. **Difficulty progression** (suggest harder topics as user improves)

**Algorithm flow:**

```typescript
function generateRecommendations(userId: string): Recommendation[] {
  const userStats = getUserStats(userId);
  const recommendations: Recommendation[] = [];

  // 1. Weak subjects (priority 3)
  const weakSubjects = getWeakSubjects(userStats, threshold = 0.60);
  for (const subject of weakSubjects) {
    recommendations.push({
      id: generateId(),
      type: "EXAM",
      title: `Practice ${subject}`,
      description: "Your accuracy is below 60% here",
      reason: "Needs improvement",
      priority: 3,
      actionUrl: `/pyqs?subject=${subject}`,
      metadata: { subject, estimatedDifficulty: "Medium" },
      createdAt: Date.now(),
      viewed: false,
      actedOn: false
    });
  }

  // 2. Neglected subjects (priority 2)
  const neglectedSubjects = getNeglectedSubjects(userStats, days = 7);
  for (const subject of neglectedSubjects) {
    recommendations.push({
      id: generateId(),
      type: "SUBJECT",
      title: `Review ${subject}`,
      description: "You haven't practiced in 7+ days",
      reason: "Due for review",
      priority: 2,
      actionUrl: `/pyqs?subject=${subject}`,
      metadata: { subject, estimatedDifficulty: "Easy" },
      createdAt: Date.now(),
      viewed: false,
      actedOn: false
    });
  }

  // 3. Progression (priority 1)
  const masteredSubjects = getMasteredSubjects(userStats, threshold = 0.85);
  for (const subject of masteredSubjects) {
    const nextDifficulty = getNextDifficultyLevel(userStats, subject);
    recommendations.push({
      id: generateId(),
      type: "EXAM",
      title: `Challenge yourself in ${subject}`,
      description: `Try ${nextDifficulty} problems`,
      reason: "Ready for next level",
      priority: 1,
      actionUrl: `/pyqs?subject=${subject}&difficulty=${nextDifficulty}`,
      metadata: { subject, estimatedDifficulty: nextDifficulty },
      createdAt: Date.now(),
      viewed: false,
      actedOn: false
    });
  }

  // Sort by priority, then recency
  return recommendations.sort((a, b) =>
    b.priority - a.priority || b.createdAt - a.createdAt
  ).slice(0, 10); // Limit to top 10
}
```

#### 1.3 API Route

`pages/api/recommendations.ts`:

```typescript
// GET /api/recommendations?limit=10&force=false

// If force=false: Return cached recommendations (if < 24h old)
// If force=true: Generate fresh recommendations

// Returns:
{
  recommendations: Recommendation[],
  generatedAt: timestamp,
  isStale: boolean // if > 24h old
}
```

#### 1.4 Frontend Implementation

Create `pages/recommendations.tsx`:

**Features:**
- Show top 10 recommendations prioritized by urgency
- "Why this?" tooltip explaining the reason
- Subject tags, difficulty badges
- "Dismiss" button to hide recommendation
- "Mark as done" when user acts on it
- Refresh button (generate new recommendations)
- Recommendation history (dismissed items)

**UI Components:**
- Recommendation cards with priority indicators
- Color coding: High (red), Medium (yellow), Low (green)
- Action buttons: "Start Now", "Later", "Not Interested"
- Recommendation reasoning shown in expandable section

**Success Criteria:**
- Recommendations are genuinely helpful and relevant
- User sees recommendations on home/dashboard
- Can dismiss irrelevant recommendations
- Recommendations update periodically
- Algorithm considers different factors realistically

---

### 2. Study Reminders & Notifications

**Objective:** Keep users engaged with personalized reminders.

**Required Actions:**

#### 2.1 Database Schema

```
users/{uid}/
├── notifications/
│   └── {notifId}/
│       ├── type: "STUDY_REMINDER" | "STREAK_WARNING" | "ACHIEVEMENT" | "NEW_QUIZ"
│       ├── title: string
│       ├── message: string
│       ├── actionUrl?: string,
│       ├── scheduledFor: timestamp
│       ├── sent: boolean
│       ├── sentAt?: timestamp
│       ├── read: boolean
│       ├── readAt?: timestamp
│       └── metadata: { ... }
│
├── reminderSettings/
│   ├── enabled: boolean,
│   ├── studyTime: "Morning" | "Afternoon" | "Evening" | "Night",
│   ├── timezone: string,
│   ├── frequency: "Daily" | "Weekdays" | "Weekends",
│   ├── streakWarning: boolean,
│   └── quietHours: { start: "22:00", end: "09:00" }
```

#### 2.2 Reminder Types

**Study Reminders:**
- Trigger: User hasn't studied in 2+ days
- Message: "Hey! It's been 2 days since you last practiced. Ready for a quick quiz in {weak_subject}?"

**Streak Warnings:**
- Trigger: User's streak about to break (user hasn't logged in today)
- Message: "Don't break your streak! {current_streak} days in a row. Jump in now to keep it going!"

**Achievements:**
- Trigger: User reaches milestone (10 quizzes, 50 exams, etc.)
- Message: "🎉 You just completed 10 quizzes! Keep up the great work!"

**New Content:**
- Trigger: New PYQs added for user's preferred exams
- Message: "New past year questions added for {exam_name}. Check them out!"

#### 2.3 Notification Delivery

**Options:**

**Option A: In-app only** (Simple, for now)
- Fetch notifications on dashboard load
- Show notification bell with badge
- Display as toast/snackbar when available

**Option B: Email + Push** (Advanced)
- Firebase Cloud Messaging for push notifications
- Email via Firebase Extensions (Transactional Email)
- Sendgrid/Mailgun integration

**Recommendation:** Start with Option A (in-app), expand to B later.

#### 2.4 API Routes

`pages/api/notifications.ts`:
```typescript
// GET /api/notifications?limit=10&unreadOnly=true
// Returns user's notifications

// POST /api/notifications/{notifId}/read
// Marks notification as read

// DELETE /api/notifications/{notifId}
// Dismisses notification
```

`pages/api/notifications/schedule.ts`:
```typescript
// POST /api/notifications/schedule
// Triggers recommendation algorithm and schedules reminders

// Should be called:
// - After user completes exam
// - Daily cron job via external scheduler
```

#### 2.5 Frontend Implementation

**Notification Bell:**
- In navbar, show bell icon with unread count badge
- Click opens dropdown with recent notifications

**Notification Panel:**
- List of notifications, grouped by date
- Mark all as read button
- Dismiss individual notifications
- Action buttons (e.g., "Start Quiz" links to exam)

**Reminder Settings Page:**
Create `pages/settings/notifications.tsx`:
- Toggle notifications on/off
- Set preferred study time
- Choose days (daily, weekdays only, etc.)
- Set timezone
- Configure quiet hours

**Success Criteria:**
- Users see relevant reminders
- Can disable notifications
- Don't spam (rate limit reminders)
- Quiet hours respected
- Notifications link to actions

---

### 3. Study Goals & Milestones

**Objective:** Help users set and track learning goals.

**Required Actions:**

#### 3.1 Database Schema

```
users/{uid}/
├── goals/
│   └── {goalId}/
│       ├── type: "DAILY_QUESTIONS" | "WEEKLY_EXAMS" | "STREAK" | "ACCURACY" | "POINTS"
│       ├── targetValue: number,
│       ├── currentValue: number,
│       ├── unit: string,
│       ├── deadline: timestamp, // for time-based goals
│       ├── createdAt: timestamp,
│       ├── completedAt?: timestamp,
│       ├── frequency: "One-time" | "Daily" | "Weekly" | "Monthly",
│       └── isActive: boolean
```

#### 3.2 Goal Creation

**Goal templates:**

**Daily goals:**
- "Answer 20 questions per day"
- "Achieve 80% accuracy today"
- "Maintain my streak"

**Weekly goals:**
- "Complete 3 full exams this week"
- "Practice all 5 subjects this week"

**Long-term goals:**
- "Reach 1000 total points"
- "Achieve 85% accuracy in Mathematics"
- "Complete 30 exams before exam date"

#### 3.3 API Routes

`pages/api/goals/`:
```typescript
// GET - List user's goals
// POST - Create new goal
// PUT - Update goal progress
// DELETE - Delete goal

// POST /api/goals/{goalId}/complete
// Marks goal as completed with timestamp
```

#### 3.4 Frontend Implementation

Create `pages/goals.tsx`:

**Features:**
- Goal dashboard with progress bars
- Create goal wizard with templates
- Set from scratch or use templates
- Track progress visually (progress bars, circles)
- Celebrate completion (confetti, animation)
- Goal history (past completed goals)

**UI Components:**
- Goal cards with progress visualization
- "Create Goal" wizard (step-by-step)
- Template gallery
- Goal details view with streak/recent progress

**Home Dashboard Integration:**
- Showing top 3 active goals
- Progress indicators
- Quick actions to work on a goal

**Success Criteria:**
- Users can create custom goals
- Progress updates automatically (on exam completion, etc.)
- Completion feels rewarding
- Goals are flexible (daily, weekly, one-time)
- Templates help users get started

---

### 4. Social Features (Profiles & Sharing)

**Objective:** Add social elements to increase engagement and competition.

**Required Actions:**

#### 4.1 Public User Profiles

Create `pages/profile/[username].tsx`:

**Public profile shows:**
- Basic info: name, avatar, bio (user-settable)
- Stats: total score, exams completed, streak, rank
- Active badges/achievements
- Recent activity (last 3 exams/quizzes)
- Subject strengths (accuracy by subject)
- Join date

**Database Schema:**

```
users/{uid}/
├── publicProfile/
│   ├── displayName: string,
│   ├── username: string (unique),
│   ├── bio: string,
│   ├── avatarUrl: string,
│   ├── badges: string[],
│   ├── isPublic: boolean,
│   └── customUrl: string // optional custom slug
```

#### 4.2 Share Results

After completing exam or quiz, add:

**"Share" buttons:**
- Share as image (generate social card with stats)
- Share as text (copyable markdown for Discord/Reddit)
- Share link (public result page)

API route: `POST /api/share/generate`

Returns:
```typescript
{
  shareUrl: string, // e.g., /share/exam/{shareId}
  imageUrl: string, // Generated OG image
  text: string // Formatted text for copy-paste
}
```

Create `pages/share/[type]/[id].tsx`:
- Public view of exam result
- Shows score, time, comparison
- Link to app (sign up prompt if not logged in)

#### 4.3 Follow/Friends (Optional - Advanced)

**If implementing:**
```
users/{uid}/
├── following/ - list of other user IDs
└── followers/ - list of other user IDs who follow this user
```

API: `GET /api/user/{username}/friends`

Features:
- Add/remove friends
- See friends' activity in feed
- Compare scores with friends

**Recommendation:** Skip full social network for now, focus on public profiles and sharing.

#### 4.4 Badges & Achievements

**Define achievement tiers:**

```
badges/
├── {badgeId}/
│   ├── name: string,
│   ├── description: string,
│   ├── icon: string,
│   ├── category: "STREAK" | "ACCURACY" | "QUIZ_MASTER" | "SOCIAL",
│   ├── rarity: "Common" | "Rare" | "Epic" | "Legendary",
│   └── requirement: conditions
```

**Example badges:**
- "Starter" - Completed first quiz
- "Week Warrior" - 7-day streak
- "Month Master" - 30-day streak
- "Quiz Wizard" - 100 quizzes completed
- "Accuracy Ace" - 90%+ accuracy on 10+ quizzes
- "Subject Specialist" - 50+ attempts in one subject
- "Social Butterfly" - Generated 5+ shares

Award badges automatically when conditions met.

**Success Criteria:**
- Public profiles accessible via username
- Results can be shared easily
- Users feel motivated by badges
- Sharing doesn't require sign-up
- Profile is customizable

---

### 5. Spaced Repetition Review System

**Objective:** Help users retain knowledge by reviewing at optimal intervals.

**Required Actions:**

#### 5.1 SRS Algorithm

Implement **SM-2 algorithm** (Simplified version):

For each question answered:
- If correct: increase interval (review later)
- If incorrect: reset interval (review soon)

Deck management:
```
users/{uid}/
├── srsDecks/
│   └── {subject}/
│       ├── nextReview: timestamp,
│       ├── cardCount: number,
│       └── cards: [
│           {
│             questionId: string,
│             nextReview: timestamp,
│             interval: number (days),
│             easeFactor: number (1.3 - 2.5),
│             timesReviewed: number
│           }
│         ]
```

#### 5.2 API Route

`pages/api/srs/next-review.ts`:
```typescript
// GET /api/srs/next-review?limit=20

// Returns questions due for review today:
{
  subject: string,
  questions: [
    {
      id: string,
      question: string,
      options: string[],
      difficulty: string,
      dueDate: timestamp
    }
  ],
  totalDue: number
}
```

`POST /api/srs/answer`:
```typescript
{
  questionId: string,
  subject: string,
  userRating: "Again" | "Hard" | "Good" | "Easy" // SM-2 rating
}

// Updates:
// - nextReview date
// - interval
// - easeFactor
```

#### 5.3 Frontend Implementation

Create `pages/review.tsx`:

**Features:**
- "Review Now" deck shows due questions (max 20 per session)
- Show subject being reviewed
- Progress: "8/20 due today"
- Rating buttons after each answer: Again/Hard/Good/Easy
- "Review later" option to skip to next batch

**Dashboard integration:**
- Show "X questions due for review"
- Priority indicator (if > 5 due)

**Success Criteria:**
- Questions appear at optimal review intervals
- User progresses through spaced repetition
- Can skip/pause review sessions
- Different subjects tracked separately
- SRS doesn't interfere with regular exam practice

---

### 6. Study Planner / Calendar

**Objective:** Help users plan their exam preparation schedule.

**Required Actions:**

#### 6.1 Database Schema

```
users/{uid}/
├── studyPlan/
│   ├── examDate: timestamp, // target exam date
│   ├── examName: string, // e.g., "JEE Main"
│   ├── subjects: [
│       {
│         name: string,
│         hoursNeeded: number,
│         hoursCompleted: number,
│         priority: number
│       }
│     ],
│   ↔️ dailyGoals: { "Mon": 2, "Tue": 3, ... }, // hours per day
│   ├── startDate: timestamp,
│   ├── totalHoursNeeded: number
│   └── totalHoursCompleted: number
│
├── scheduleEntries/
│   └── {entryId}/
│       ├── date: string (YYYY-MM-DD),
│       ├── subject: string,
│       ├── activity: "PYQ" | "QUIZ" | "REVIEW" | "FREE",
│       ├── plannedHours: number,
│       ├── completedHours: number,
│       ├── notes: string
│   └── completed: boolean
```

#### 6.2 API Routes

`pages/api/study-plan/`:
```typescript
// GET - Show current plan
// POST - Create or update plan
// POST /study-plan/add-entry - Add scheduled session
// PUT /study-plan/entry/{id}/complete - Mark as done
```

#### 6.3 Frontend Implementation

Create `pages/plan.tsx`:

**Features:**
- Calendar view (day/month/week)
- Drag-and-drop to schedule sessions
- Progress bars per subject
- "Today's schedule" sidebar
- Overall progress to exam date
- Adjust total hours needed

**Plan Creator Wizard:**
1. Select exam (from list or custom)
2. Set exam date
3. Assign hours per subject (auto-calculated based on difficulty?)
4. Set daily study hours
5. Generate schedule

**Success Criteria:**
- User can create study plan
- Calendar shows what to study each day
- Marking sessions done updates progress
- Plan adapts if user falls behind
- Exam date countdown visible

---

## Dependencies

Batch 3 requires:
- Batch 1 and Batch 2 complete
- Analytics data available
- User base engaged (for social validation)
- Email/push infrastructure (if implementing notifications)

---

## Testing Checklist

Before marking Batch 3 complete:

- [ ] Recommendations are relevant and helpful
- [ ] Users can create and dismiss reminders
- [ ] Goals track progress automatically
- [ ] Public profiles load correctly
- [ ] Share generation works
- [ ] Badges awarded correctly
- [ ] SRS system respects intervals
- [ ] Study planner calendar functional
- [ ] All features don't spam users
- [ ] Privacy settings respected

---

## Notes for Atla

1. **User privacy matters.** Make profile/public data optional (opt-in).
2. **Don't over-notify.** Rate limit reminders to avoid annoying users.
3. **Goal flexibility is key.** Users should be able to adjust goals without guilt.
4. **Social features should enhance, not distract.** Keep focus on learning.
5. **SRS is advanced.** If it complicates the app, prioritize other features first.

---

## End State for Batch 3

The app now has:
- ✅ Personalized recommendations
- ✅ Study reminders and notifications
- ✅ User-set goals and milestones
- ✅ Public profiles and sharing
- ✅ Badges/achievements system
- ✅ Spaced repetition review
- ✅ Study planner/calendar

Users stay engaged longer and have tools to manage their learning journey.

---

**Next:** Batch 4 - Refinement, optimization, and polish (performance, SEO, mobile)
