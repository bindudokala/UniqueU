import 'react-native-gesture-handler'; // Import for React Navigation gesture handling
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import HomePageScreen from '../components/HomePageScreen'; // Update paths as necessary
import LoginScreen from '../components/LoginScreen';
import SignupScreen from '../components/SignupScreen';
import Header from '../components/Header'; // Import the Header component

const Stack = createStackNavigator();

export default function App() {
  return (
      <View style={{ flex: 1 }}>
        {/* Add Header at the top */}
        <Header />

        {/* Stack Navigator below the Header */}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
