import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../components/LoginPage';
import SignupPage from '../components/SignupPage';
import HomePage from '../components/HomePage';
import Header from '../components/Header';
import { View, Text, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext'; 
import CategoryProductsPage from '../components/CategoryProductsPage'; 
import ProductDetailsPage from '../components/ProductDetailsPage';
import CartPage from '../components/CartPage';
import { CartProvider } from '../components/CartContext';
import CheckoutPage from '../components/CheckoutPage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RootNavigator />
      </CartProvider>
    </AuthProvider>
  );
}

const RootNavigator = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Signup" component={SignupPage} />
          
        <Stack.Screen 
          name="CategoryProducts" 
          component={CategoryProductsPage} 
          options={{ title: 'Category Products' }} 
        />

        <Stack.Screen 
          name="ProductDetails" 
          component={ProductDetailsPage} 
          options={{ title: 'Product Details' }} 
        />

        <Stack.Screen name="Cart" component={CartPage} />

        <Stack.Screen 
          name="Checkout" 
          component={CheckoutPage} 
          options={{ title: 'Checkout' }} 
        />
        </Stack.Navigator>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
