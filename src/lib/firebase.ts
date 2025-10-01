// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "studio-3593338318-28583",
  appId: "1:646961692651:web:074774565514be426da3ae",
  apiKey: "AIzaSyCI2gPnsdWGQEV3LyNMsYecQVwDiML18m4",
  authDomain: "studio-3593338318-28583.firebaseapp.com",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
