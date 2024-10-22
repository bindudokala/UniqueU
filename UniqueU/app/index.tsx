import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../components/LoginScreen';
import SignupScreen from '../components/SignupScreen';
import HomePageScreen from '../components/HomePageScreen';
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
          <Stack.Screen name="HomePage" component={HomePageScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
