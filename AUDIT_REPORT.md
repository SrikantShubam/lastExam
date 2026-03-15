# Code Audit Report
**Date:** 2026-03-15
**Auditor:** AtlaAugus_bot
**Repo:** lastExam (exam-repo)
**Branch:** v2

---

## Executive Summary

The codebase exhibits a **mismatch between claimed functionality and actual implementation**. Commit messages consistently overclaim features as "complete" when only UI implementations exist. The root cause is an **incomplete migration** from Next.js Pages Router to App Router, leaving duplicate pages with conflicting levels of implementation.

**Overall Assessment:** ⚠️ **Mixed** - Good UI work, honest backend integration exists in Pages Router, but App Router features are mostly placeholders.

---

## Critical Issues

### 1. Overclaiming in Commit Messages

| Commit | Claim | Reality |
|--------|-------|---------|
| `8bb7702` | "feat: add user features - signup, custom exam lists, and quiz pages... Firebase Auth integration" | Signup in `src/app/` has NO Firebase - just console.log + localStorage |
| `8bb7702` | "Custom exam lists... Saved to localStorage for persistence" | True, but misleading - localStorage ≠ real persistence |
| `e63683a` | "feat: Create PYQs and Leaderboard pages" | Leaderboard is hardcoded mock data, no backend connection |

**Impact:** Deploying based on these commits would result in broken authentication and non-functional features.

---

### 2. Duplicate / Conflicting Implementations

#### Signup Pages
- **`pages/signup.tsx`** ✅ - Real Firebase Auth, Google OAuth, Firestore user creation
- **`src/app/signup/page.tsx`** ❌ - Placeholder code only, saves to localStorage

```typescript
// src/app/signup/page.tsx - Line 47
// Firebase auth placeholder - will be implemented with environment variables
// In production, this would be:
// const userCredential = await createUserWithEmailAndPassword(...)
console.log("Signup data:", { ...formData, password: "***" });
localStorage.setItem("user", JSON.stringify({ name: formData.name, email: formData.email }));
```

#### PYQs
- **`pages/pyqs/[exam].tsx`** ✅ - Real Firebase Firestore integration
- **`src/app/pyqs/page.tsx`** ⚠️ - Hardcoded mock data, subject grid with fake question counts

#### Leaderboards
- **`src/app/leaderboard/page.tsx`** ❌ - Hardcoded array of 10 mock users

```typescript
const leaderboardData = [
  { rank: 1, name: "Rahul Sharma", points: 2850, examsCompleted: 45, avatar: "RS" },
  // ... 9 more hardcoded entries
];
```

#### Firebase Config
- `lib/firebase.tsx` - Client-side Firebase (active)
- `lib/firebase-admin.ts` - Server-side Firebase (for API routes)

**Issue:** No documentation on which to use for what.

---

### 3. Missing Environment Variables

`.env.local` contains:
```
NEXT_PUBLIC_GROQ_API_KEY=<redacted>
```

**Missing Firebase vars:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `GOOGLE_APPLICATION_CREDENTIALS` (for Firebase Admin)

**Impact:** Firebase Auth will not work without these variables configured.

---

### 4. Inconsistent Router Architecture

The repo has **both** Next.js routing strategies active:

| Directory | Router | Status |
|-----------|--------|--------|
| `pages/` | Pages Router | ✅ Fully integrated with Firebase |
| `src/app/` | App Router | ⚠️ Mostly UI-only, fake backend |

**Assessment:** This is a **migration in progress** that was never completed.

---

## Feature-by-Feature Audit

### ✅ Working Features

| Feature | Location | Implementation |
|---------|----------|----------------|
| User Signup (real) | `pages/signup.tsx` | Firebase Auth + Firestore + Google OAuth + login streak logic |
| User Login | `pages/login.tsx` → `components/auth/Login.tsx` | Firebase Auth + Google OAuth + forgot password |
| Dashboard API | `pages/api/dashboard-data.ts` | Real Firestore queries with auth |
| PYQs View | `pages/pyqs/[exam].tsx` | Real Firestore: `exams/{exam}/{subject}/{paper}` |
| Custom Exam Lists | `src/app/my-exams/page.tsx` | localStorage persistence (client-only) |
| Exam Categories | Multiple locations | Works with data.json |

### ⚠️ Partial Features

| Feature | Location | Implementation |
|---------|----------|----------------|
| Signup (App Router) | `src/app/signup/page.tsx` | Placeholder code, saves to localStorage only |
| PYQs Landing | `src/app/pyqs/page.tsx` | Hardcoded subject cards, mock data |
| Quiz | `src/app/quiz/page.tsx` | 25 hardcoded questions in file, no DB connection |
| Exam API | `pages/api/exams.ts` | References non-existent `data/exams.json` file |

### ❌ Non-Functional Features

| Feature | Location | Issue |
|---------|----------|-------|
| Leaderboard | `src/app/leaderboard/page.tsx` | Mock data only, no backend connection |
| Forgot Password | `pages/login.tsx` | Code exists, but uses Firebase client SDK (will fail without env vars) |
| Auth API endpoints? | N/A | Not implemented (only Firebase client SDK used) |

---

## Code Quality Observations

### Good ✅
- TypeScript usage with proper types
- Clean UI with shadcn/ui components
- Proper error handling in API routes
- Responsive design
- Consistent styling with Tailwind CSS

### Needs Work ⚠️
- Inconsistent architecture (dual routers)
- Missing environment variables validation
- No clear documentation on active vs deprecated routes
- Commit messages don't reflect actual implementation state
- Mix of "production-ready" and "placeholder" code without markers

---

## Dashboard Data Flow

```
/pages/api/dashboard-data.ts
    ↓ (Bearer token auth)
Firebase Admin SDK → Firestore
    ↓
GET /api/dashboard-data?token=...
```

**This is the model implementation.** It works correctly.

Other features should follow this pattern: API route → Firebase Admin SDK → Frontend.

---

## Recommended Actions

### Immediate (Priority 1)

1. **Clean up duplicate pages**
   - Delete `src/app/signup/page.tsx` → use `pages/signup.tsx`
   - Delete `src/app/pyqs/page.tsx` → point to `pages/pyqs/[exam].tsx` or build real backend
   - Decide: complete App Router migration OR abandon it

2. **Add Firebase environment variables**
   - Copy from Firebase Console
   - Update `.env.local.example` with template
   - Add validation at build time

3. **Fix commit history**
   - Create a new commit honestly marking features: "wip: leaderboard UI built, backend pending"
   - Don't deploy to production without testing auth

### Short Term (Priority 2)

4. **Connect leaderboards to Firestore**
   - Create `leaderboards` collection
   - Build API route: `/api/leaderboard`
   - Replace `src/app/leaderboard/page.tsx` mock data with real API calls

5. **Connect quiz to database**
   - Create `questions` collection
   - Build API route: `/api/quiz/{subject}`
   - Remove hardcoded `QUIZ_DATA` from `src/app/quiz/page.tsx`

6. **Document architecture**
   - Add `ARCHITECTURE.md` explaining Pages vs App router
   - Mark which routes are active vs deprecated

### Long Term (Priority 3)

7. **Complete App Router migration** (if desired)
   - Port Firebase auth to App Router server components
   - Update all API routes to `/api/` convention
   - Deprecate `pages/` directory

8. **Add CI/CD**
   - Build step verifying env vars present
   - Type checking
   - Linting

---

## Risk Assessment

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Deploy broken auth features | High | High | Test auth flow before production deploy |
| User data loss (localStorage) | Medium | High | Don't use localStorage for critical data |
| Feature confusion (dual routers) | Medium | High | Complete migration or delete App Router pages |
| Missing env vars break app | High | Medium | Add build-time validation |

---

## Conclusion

**You have ~50% of a great app.**

- UI/UX is solid
- Firebase integration works where implemented
- Database schema seems reasonable

**The other 50% is:**
- Incomplete migration to App Router
- Overclaiming in commit history
- Missing environment configuration

**Recommendation:** Choose one routing strategy, delete the other, and complete the remaining backend integrations honestly.

---

## Appendix: File Tree (Active Components)

```
lib/
├── firebase.tsx              ✅ Client Firebase (active)
└── firebase-admin.ts         ✅ Server Firebase (for APIs)

pages/
├── api/
│   ├── dashboard-data.ts     ✅ Real Firestore integration
│   ├── exams.ts              ⚠️ References missing file
│   └── generate-insights.ts  ? (not reviewed)
├── login.tsx                 ✅ → components/auth/Login.tsx (real Firebase)
├── signup.tsx                ✅ Real Firebase Auth + Google OAuth
└── pyqs/[exam].tsx           ✅ Real Firestore queries

src/app/
├── signup/page.tsx           ❌ Placeholder, no Firebase
├── my-exams/page.tsx         ⚠️ localStorage only
├── quiz/page.tsx             ⚠️ Hardcoded questions
├── pyqs/page.tsx             ⚠️ Mock data
└── leaderboard/page.tsx      ❌ Mock data

components/
└── auth/Login.tsx            ✅ Real Firebase, streak tracking
```

---

**Report generated for code review.**
