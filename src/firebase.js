/**
 * Firebase Configuration
 * ─────────────────────────────────────────────
 * 1. أنشئ مشروعاً على https://console.firebase.google.com
 * 2. انسخ إعدادات المشروع هنا أو عبر متغيرات البيئة (.env)
 * 3. فعّل: Authentication + Firestore + Storage
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db      = getFirestore(app);
export const auth    = getAuth(app);
export const storage = getStorage(app);

/**
 * مجموعات Firestore المطلوبة:
 *
 * /standards          معايير CBAHI
 * /submissions        استجابات الموظفين
 * /users              بيانات المستخدمين
 * /auditLog           سجل المراقبة (للكتابة فقط — لا يُحذف)
 */
