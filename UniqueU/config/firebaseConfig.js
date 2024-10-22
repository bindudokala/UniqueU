import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCYyI3KdGQWzZwVVnc8KmDvf6Z9yyPwRus",
  authDomain: "uniqueu-3a9dd.firebaseapp.com",
  projectId: "uniqueu-3a9dd",
  storageBucket: "uniqueu-3a9dd.appspot.com",
  messagingSenderId: "287404735144",
  appId: "1:287404735144:web:f6918359bd975a8885209d",
  measurementId: "G-E4CQ3Z01M8"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Use AsyncStorage for React Native persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { createUserWithEmailAndPassword, signInWithEmailAndPassword };
export default app;