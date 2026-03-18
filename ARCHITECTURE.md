# Architecture Documentation

**Last Updated:** 2026-03-18  
**Status:** Active

---

## Routing Strategy

This repo uses **Next.js Pages Router** as the primary routing strategy. The migration to App Router (`src/app/`) is **paused** and should not be used for new features.

### Active Routes (Pages Router)

| Route | File | Status | Description |
|-------|------|--------|-------------|
| `/signup` | `pages/signup.tsx` | ✅ Active | Firebase Auth + Google OAuth |
| `/login` | `pages/login.tsx` | ✅ Active | Firebase Auth + Google OAuth |
| `/dashboard` | `pages/dashboard.tsx` | ✅ Active | User dashboard |
| `/pyqs` | `pages/pyqs/index.js` | ✅ Active | PYQ category selection |
| `/pyqs/[exam]` | `pages/pyqs/[exam].tsx` | ✅ Active | Real Firestore queries |
| `/api/*` | `pages/api/*` | ✅ Active | Server-side API routes |
| `/leaderboard` | `pages/leaderboard.tsx` | 🔄 Building | Real leaderboard (Batch 2) |
| `/analytics` | `pages/analytics.tsx` | ⏳ Planned | Analytics dashboard (Batch 2) |

### Deprecated Routes (Do Not Use)

| Route | File | Reason |
|-------|------|--------|
| `/signup` | `src/app/signup/page.tsx` | ❌ Deleted - Placeholder code |
| `/pyqs` | `src/app/pyqs/page.tsx` | ❌ Deleted - Mock data |
| `/leaderboard` | `src/app/leaderboard/page.tsx` | ❌ Deleted - Mock data |

**Note:** All `src/app/` routes have been removed. Do not add new features there.

---

## Firebase Integration

### Client SDK (`lib/firebase.tsx`)
- **Used in:** Pages, components, client-side code
- **Operations:** Auth, Firestore queries, storage
- **Environment:** Browser

### Admin SDK (`lib/firebase-admin.ts`)
- **Used in:** API routes (`pages/api/*`)
- **Operations:** Server-side auth, privileged access, writes
- **Environment:** Node.js server

### Database Schema

```
users/{uid}
├── profile: { name, email, avatarUrl }
├── totalPoints: number
├── currentStreak: number
├── bestStreak: number
├── examHistory/{historyId}
│   ├── examId, subject, paper, score
│   ├── detailedResults: []
│   └── pointsEarned: number
├── quizHistory/{quizId}
│   ├── subject, score, accuracy
│   └── timestamp
├── subjects/{subject}/stats
│   ├── totalQuestionsAnswered
│   ├── correctAnswers
│   └── accuracy
└── analytics
    ├── weeklyActivity
    ├── skillGaps
    └── improvementTrends

exams/{examId}
└── {subject}
    └── {paper}
        └── questions: []

leaderboards/
├── global/entries/{uid}
├── subjects/{subject}/entries/{uid}
└── exams/{examId}/entries/{uid}

questions/{subject}/{questionId}
├── question, options, correctIndex
└── difficulty, subject
```

---

## API Routes Pattern

All API routes follow this structure:

```typescript
// pages/api/{feature}/{action}.ts
import { admin, firestore } from '../../lib/firebase-admin';

export default async function handler(req, res) {
  // 1. Validate method
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Validate auth (if required)
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  // 3. Execute logic
  // ...

  // 4. Return response
  res.status(200).json({ success: true, data: ... });
}
```

### Existing API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/dashboard-data` | GET | User dashboard data (auth required) |
| `/api/quiz/[subject]` | GET | Quiz questions for subject |
| `/api/leaderboard/category` | GET | Query leaderboard (global/subject/exam) |
| `/api/leaderboard/update` | POST | Update leaderboard entry |
| `/api/user/points/add` | POST | Add points to user account |

---

## Environment Variables

Required in `.env.local`:

```bash
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Groq API
NEXT_PUBLIC_GROQ_API_KEY=
```

---

## Development Workflow

1. **Always work on `v2` branch**
2. **Never commit to `main`**
3. **Use Pages Router** (`pages/`) for new features
4. **Use Firebase Admin SDK** in API routes
5. **Use Client SDK** in pages/components
6. **Test locally** before pushing
7. **Verify files exist** after implementation (no overclaiming)

---

## Batch Status

| Batch | Status | Notes |
|-------|--------|-------|
| Batch 1 | ✅ Complete | AI features, cleanup, Firebase setup |
| Batch 2 | 🔄 In Progress | Leaderboards, analytics, gamification |
| Batch 3 | ⏳ Planned | User engagement, recommendations, social |

---

## Migration Path (Future)

If App Router migration resumes:
1. Port API routes to `/api/` convention in `app/api/`
2. Use Server Components for data fetching
3. Keep Firebase Admin SDK for server operations
4. Deprecate `pages/` directory gradually

**Current Priority:** Complete Batch 2 before considering migration.

---

**End of Architecture Documentation**
