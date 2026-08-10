# Deployment Guide - MANOJ TRADERS

Follow this step-by-step guide to deploy **Manoj Traders** to **Vercel** and **Firebase Hosting**.

---

## Option A: Deploying to Vercel (Recommended)

1. Push your source code repository to **GitHub / GitLab / Bitbucket**.
2. Log in to [Vercel Dashboard](https://vercel.com).
3. Click **"Add New Project"** and import the `e-commerce` repository.
4. Configure Environment Variables in Vercel settings:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
5. Click **Deploy**. Vercel will build Next.js 15 pages automatically.

---

## Option B: Deploying Firebase Security Rules & Cloud Functions

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init

# Deploy Firestore Security Rules
firebase deploy --only firestore:rules

# Deploy Firebase Storage Rules
firebase deploy --only storage

# Deploy Cloud Functions
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

## Production Verification Checklist
- [x] Clerk Authentication active for Sign In / Sign Up routes.
- [x] Firestore rules protecting 21 collections against unauthorized mutations.
- [x] PWA Manifest & Service Worker operational.
- [x] Responsive layout verified across Desktop, Tablet, and Mobile.
- [x] Recharts dashboard data rendering correctly.
