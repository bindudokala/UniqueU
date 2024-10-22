import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../components/LoginPage';
import SignupPage from '../components/SignupPage';
import HomePage from '../components/HomePage';
import Header from '../components/Header';
import { View, Text, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  
  return (
      <View style={{ flex: 1 }}>
        <Header />
        <Stack.Navigator
          initialRouteName="HomePage"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="HomePage" component={HomePage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Signup" component={SignupPage} />
        </Stack.Navigator>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
