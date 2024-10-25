import React, { createContext, useEffect, useState, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig'; 
import { useNavigation } from '@react-navigation/native';

const AuthContext = createContext(null);

// AuthProvider component to wrap the app and provide auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); 
      setIsLoading(false); 

      if (!currentUser) {
        navigation.navigate('Login'); 
      } 
    });

    return () => unsubscribe(); 
  }, [navigation]);

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
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
