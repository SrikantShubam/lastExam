// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getStorage } from "firebase/storage";
// // Define variables at module level
// let app;

// let db;
// let auth;
// let googleProvider;
// let storage;
// // Only initialize Firebase if running in the browser
// if (typeof window !== "undefined") {
//   const firebaseConfig = {
//     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   };

//   app = initializeApp(firebaseConfig);
//   db = getFirestore(app);
//   auth = getAuth(app);
//   googleProvider = new GoogleAuthProvider();
//   googleProvider.setCustomParameters({ prompt: "select_account" }); // Avoid clipboard usage
//   storage = getStorage(app);
// }

// export { db, auth, googleProvider,storage };

// // import { initializeApp } from "firebase/app";
// // import { getFirestore } from "firebase/firestore";
// // import { getAuth, GoogleAuthProvider } from "firebase/auth";
// // import { getStorage } from "firebase/storage";

// // // Define variables at module level
// // let app;
// // let db;
// // let auth;
// // let googleProvider;
// // let storage;

// // const firebaseConfig = {
// //   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
// //   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
// //   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
// //   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
// //   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
// //   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// // };

// // export function getApp() {
// //   if (!app && typeof window !== "undefined") {
// //     app = initializeApp(firebaseConfig);
// //   }
// //   return app;
// // }

// // export function getDb() {
// //   if (!db && typeof window !== "undefined") {
// //     db = getFirestore(getApp());
// //   }
// //   return db;
// // }

// // export function getAuthInstance() {
// //   if (!auth && typeof window !== "undefined") {
// //     auth = getAuth(getApp());
// //   }
// //   return auth;
// // }

// // export function getGoogleProvider() {
// //   if (!googleProvider && typeof window !== "undefined") {
// //     googleProvider = new GoogleAuthProvider();
// //     googleProvider.setCustomParameters({ prompt: "select_account" });
// //   }
// //   return googleProvider;
// // }

// // export function getStorageInstance() {
// //   if (!storage && typeof window !== "undefined") {
// //     storage = getStorage(getApp());
// //   }
// //   return storage;
// // }


// // export { db, auth, googleProvider,storage }



import { initializeApp } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import type { FirebaseStorage } from "firebase/storage";

// Define variables at module level with types (possibly undefined since conditional init)
let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;
let storage: FirebaseStorage | undefined;

// Only initialize Firebase if running in the browser
if (typeof window !== "undefined") {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" }); // Avoid clipboard usage
  storage = getStorage(app);
}

export { db, auth, googleProvider, storage };