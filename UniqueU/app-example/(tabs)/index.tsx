import React from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../../components/LoginPage'; // Make sure the path is correct

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginPage} 
          options={{ title: 'Login' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Register the main component with the app registry
registerRootComponent(App);
