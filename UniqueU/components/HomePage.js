import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebaseConfig'; // Firebase instance

const HomePage = () => {
  const navigation = useNavigation();

  const onLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login'); 
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the Home Page!</Text>
      <Button title="Logout" onPress={onLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomePage;
