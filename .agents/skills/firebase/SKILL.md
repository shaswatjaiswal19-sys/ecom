---
name: firebase
description: Firebase and Firestore integration, deployment, authentication, and database helper skills for Antigravity AI assistant.
---

# Firebase Agent Skill

This skill provides workflow guidance and best practices for integrating Firebase, Firestore, Firebase Auth, and Cloud Functions into Next.js applications.

## Key Firebase Patterns

1. **Singleton Initialization**:
   Always initialize Firebase App and Firestore singletons in `src/lib/firebase.ts` to prevent multiple initialization errors during Hot Module Reloading (HMR).

2. **Firestore Hybrid Storage**:
   When environment keys are set, interact with Firestore collections (`products`, `orders`, `users`).
   When environment keys are missing or using mock credentials, use local storage fallback to ensure zero downtime.

3. **Data Sanitization**:
   Always strip `undefined` properties before passing objects to Firestore (`addDoc` or `updateDoc`) using a JSON sanitizer:
   ```ts
   function sanitizeForFirestore<T>(data: T): T {
     return JSON.parse(
       JSON.stringify(data, (_, value) => (value === undefined ? null : value))
     );
   }
   ```
