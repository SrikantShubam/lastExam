// lib/firebase-admin.ts

import * as admin from 'firebase-admin';

// This pattern prevents re-initializing the app on every hot-reload
if (!admin.apps.length) {
  try {
    // When GOOGLE_APPLICATION_CREDENTIALS is set, 
    // initializeApp() automatically finds and uses the credentials.
    admin.initializeApp();
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('CRITICAL: Firebase Admin initialization failed.', error);
  }
}

// Export the initialized admin instance and services
const firestore = admin.firestore();
const auth = admin.auth();

export { admin, firestore, auth };