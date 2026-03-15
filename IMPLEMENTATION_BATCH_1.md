# Implementation Batch 1
**Date:** 2026-03-15
**Status:** Ready for Implementation
**Assigned:** Atla
**Architecture:** Next.js Pages Router (src/app to be deprioritized)

---

## Overview

This batch fixes critical authentication and duplicate implementation issues identified in the audit report. The goal is to have a **single, working source of truth** for each feature.

**DO NOT write code for App Router features in src/app/. Focus on Pages Router implementation.**

---

## Feature Specifications

### 1. Firebase Environment Configuration

**Objective:** Enable Firebase authentication by providing all required environment variables.

**Required Actions:**
1. Create `.env.local.example` with template:
```
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Server-side)
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json

# Other
NEXT_PUBLIC_GROQ_API_KEY=your_groq_key
```

2. Update `README.md` with setup instructions for Firebase
3. Add build-time validation in `next.config.js` to fail build if critical env vars are missing

**Success Criteria:**
- `.env.local.example` exists
- README has Firebase setup section
- Build fails with helpful error if Firebase vars missing
- Developer can run app locally after setting env vars

**DO NOT:** Commit actual `.env.local` with real keys

---

### 2. Remove Duplicate Signup Implementation

**Objective:** Eliminate confusion between two signup implementations.

**Current State:**
- `pages/signup.tsx` ✅ Fully functional with Firebase
- `src/app/signup/page.tsx` ❌ Placeholder code, no Firebase

**Required Actions:**

1. **Delete `src/app/signup/page.tsx`**

2. **Verify `pages/signup.tsx` is fully functional:**
   - Firebase Auth integration working
   - Google OAuth working
   - Firestore user creation working
   - Error handling covers edge cases
   - Email verification flow (if applicable)

3. **Add route redirect:**
   - If using App Router on any pages, redirect `/signup` to use Pages Router version
   - Or simply ensure all navigation links point to `/signup` (which routes to `pages/signup.tsx`)

**Success Criteria:**
- Single signup page exists at `/signup`
- Sign up works end-to-end (form → Firebase → dashboard)
- Firebase Auth admin panel shows new users
- Google OAuth sign-up works

**DO NOT:** Create a new signup in App Router

---

### 3. Remove Duplicate PYQs Landing Page

**Objective:** Eliminate mock data landing page, keep only real implementation.

**Current State:**
- `pages/pyqs/[exam].tsx` ✅ Real Firestore integration
- `src/app/pyqs/page.tsx` ⚠️ Mock data only

**Required Actions:**

1. **Delete `src/app/pyqs/page.tsx`**

2. **Keep `pages/pyqs/[exam].tsx` as the PYQs entry point**

3. **Update navigation:** Ensure all "Past Year Questions" links route to `/pyqs` category selection page (already exists in `pages/pyqs/index.js` or equivalent)

**Success Criteria:**
- Single PYQs entry point
- All PYQ data comes from Firestore
- User can browse → select exam → select subject → view paper

**DO NOT:** Recreate mock data page in App Router

---

### 4. Fix Quiz Implementation

**Objective:** Replace hardcoded quiz data with database-backed implementation.

**Current State:**
- `src/app/quiz/page.tsx` ⚠️ 25 hardcoded questions in file

**Required Actions:**

1. **Create Firebase collection structure:**

```
Firestore:
- questions/
  - {subject}/
    - {questionId}/
      - id: string
      - question: string
      - options: string[]
      - correctIndex: number
      - difficulty: "Easy" | "Medium" | "Hard"
      - subject: string
```

2. **Create API route: `pages/api/quiz/[subject].ts`**
   ```typescript
   // GET /api/quiz/Mathematics?count=5
   // Returns array of questions for the subject
   // Optionally supports difficulty filter
   ```

3. **Update `src/app/quiz/page.tsx`:**
   - Replace `QUIZ_DATA` constant with API fetch
   - Add loading state
   - Add error handling
   - Keep all existing UI/timer/scoring logic

4. **Migrate existing hardcoded questions to Firestore:**
   - Use Firebase Admin SDK or Firebase Console
   - Add Mathematics, Physics, Computer Science, Chemistry, Biology questions

**Success Criteria:**
- Quiz loads questions from API
- Adding a new question to Firestore appears in quiz immediately
- Question count can be changed via API param
- Error state shown if API fails

**DO NOT:** Keep hardcoded `QUIZ_DATA` in the file. Move it to Firestore or delete.

---

### 5. Deprecate Mock Leaderboard

**Objective:** Either remove or clearly mark as placeholder until backend is ready.

**Current State:**
- `src/app/leaderboard/page.tsx` ❌ Hardcoded mock data

**Required Actions (Choose ONE):**

**Option A: Remove entirely**
1. Delete `src/app/leaderboard/page.tsx`
2. Remove all navigation links to `/leaderboard`
3. Add placeholder note to roadmap: "Leaderboard - Coming soon"

**Option B: Build real implementation**
1. Create Firestore collection:
   ```
   - leaderboards/
     - global/
       - entries/{uid}/
         - uid: string
         - name: string
         - avatarUrl: string
         - totalPoints: number
         - examsCompleted: number
   ```

2. Create API route: `pages/api/leaderboard/range=global&limit=10`
   - Query Firestore, sort by totalPoints, return top 10
   - Support pagination

3. Update `src/app/leaderboard/page.tsx` to fetch from API
4. Trigger leaderboard updates when user completes exam

**Recommendation:** Choose Option A for Batch 1. Build real leaderboard in Batch 2.

**Success Criteria (Option A):**
- No broken mock leaderboard
- UI removed cleanly
- Navigation updated

**Success Criteria (Option B):**
- Real data from Firestore
- Updates when users complete exams
- Pagination works

**DO NOT (for Option A):** Leave mock data live in production. Either remove or make it real.

---

### 6. Add Architecture Documentation

**Objective:** Document the active routing strategy and what works vs what's deprecated.

**Required Actions:**

1. **Create `ARCHITECTURE.md`:**

```markdown
# Architecture Documentation

## Routing Strategy

This repo uses **Next.js Pages Router** as the primary routing strategy.

### Active Routes (Pages Router)
- `/signup` → `pages/signup.tsx` - Firebase Auth
- `/login` → `pages/login.tsx` → `components/auth/Login.tsx`
- `/pyqs/[exam]` → `pages/pyqs/[exam].tsx` - Firestore queries
- `/api/*` → `pages/api/*` - Server-side Firebase Admin

### Deprecated Routes (Do Not Use)
- `src/app/signup/page.tsx` - Placeholder, use `pages/signup.tsx`
- `src/app/pyqs/page.tsx` - Mock data, use `pages/pyqs/[exam].tsx`
- `src/app/leaderboard/page.tsx` - Mock data (do not use)

## Firebase Integration

### Client SDK (`lib/firebase.tsx`)
- Used in pages/components
- Auth, Firestore queries

### Admin SDK (`lib/firebase-admin.ts`)
- Used in API routes
- Server-side operations, privileged access

### Database Schema
- `users/{uid}` - User profiles, streaks, favorites
- `exams/{exam}/{subject}/{paper}` - Exam papers, questions
- `questions/{subject}/{questionId}` - Quiz questions (Quiz feature)
```

2. **Add `DEPRECATED.md`** (optional):
```markdown
# Deprecated Features

## App Router Migration (On Hold)
The migration to Next.js App Router (`src/app/`) is paused. Do not add new features there.

See ARCHITECTURE.md for active routes.
```

**Success Criteria:**
- New developers know which router to use
- No confusion about `pages/` vs `src/app/`
- Clear path forward for future App Router migration

---

## Testing Checklist

Before marking Batch 1 complete:

- [ ] Firebase auth works: signup → email verification (if enabled) → login → dashboard
- [ ] Google OAuth works
- [ ] Quiz loads from API, not hardcoded data
- [ ] PYQs browse → exam → subject → paper flow works
- [ ] No broken mock data pages
- [ ] Build passes without errors
- [ ] Environment variables documented
- [ ] Navigation links updated (no dead ends)

---

## Dependencies

This batch requires:
- Firebase project configured
- Environment variables set
- Firestore collections created (for quiz)
- Service account key for Firebase Admin (for API routes)

---

## Notes for Atla

1. **Write clean, production code.** No placeholders, no "TODO, implement this."
2. **Commit often.** One logical change per commit with descriptive messages.
3. **Test locally.** Don't just write code - verify it works.
4. **Ask blocker questions.** If you hit a wall, ask before working around.
5. **Follow existing patterns.** Look at `pages/api/dashboard-data.ts` as the model for API routes.

---

**Batch 1 End State:** Clean, working authentication and core features with no duplicate/conflicting implementations.
