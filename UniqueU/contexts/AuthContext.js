import React, { createContext, useEffect, useState, useContext } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore'; 
import { useNavigation } from '@react-navigation/native';

const AuthContext = createContext(null);

// AuthProvider component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation(); 

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setIsLoading(false); 

    if (currentUser) {
      setUser(currentUser); 

      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
        // console.log("Auth Context Output", userDoc);
      }
    } else {
      setUser(null);
      setUserData(null);
      navigation.navigate('Login');
    }
    setIsLoading(false);
  });

    return () => unsubscribe(); 
  }, [navigation]);

  return (
    <AuthContext.Provider value={{ user, userData, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
