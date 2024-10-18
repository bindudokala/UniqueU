// config/firebaseConfig.js
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "uniqueu-3a9dd.firebaseapp.com",
  projectId: "uniqueu-3a9dd",
  storageBucket: "uniqueu-3a9dd.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "1:287404735144:ios:e3f7ab7d1a1e7fd885209d",
};

const app = initializeApp(firebaseConfig);
export default app;
