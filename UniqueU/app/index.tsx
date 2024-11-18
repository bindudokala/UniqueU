import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from '../components/LoginPage';
import SignupPage from '../components/SignupPage';
import HomePage from '../components/HomePage';
import Header from '../components/Header';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext'; 
import CategoryProductsPage from '../components/CategoryProductsPage'; 
import ProductDetailsPage from '../components/ProductDetailsPage';
import CartPage from '../components/CartPage';
import { CartProvider } from '../contexts/CartContext';
import CheckoutPage from '../components/CheckoutPage';
import OrderConfirmation from '../components/OrderConfirmation';
import UserProfile from '../components/UserProfile';
import OrderHistory from '../components/OrderHistory';
import ProfileDetails from '../components/ProfileDetails';
import AddressDetails from '../components/AddressDetails';
import ProductSearch from '../components/ProductSearch';
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
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Header />
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>

          <Stack.Screen name="Home" component={HomePage} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Signup" component={SignupPage} />
          
          <Stack.Screen name="CategoryProducts" component={CategoryProductsPage} options={{ title: 'Category Products' }} />

          <Stack.Screen name="ProductDetails" component={ProductDetailsPage} options={{ title: 'Product Details' }} />

          <Stack.Screen name="Cart" component={CartPage} />

          <Stack.Screen name="Checkout" component={CheckoutPage} options={{ title: 'Checkout' }} />

          <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} options={{ title: 'OrderConfirmation' }} />

          <Stack.Screen name="UserProfile" component={UserProfile} options={{ title: 'UserProfile' }} />

          <Stack.Screen name="OrderHistory" component={OrderHistory} options={{ title: 'Order History' }} />

          <Stack.Screen name="ProfileDetails" component={ProfileDetails} options={{ title: 'ProfileDetails' }} />

          <Stack.Screen name="AddressDetails" component={AddressDetails} options={{ title: 'AddressDetails' }} />

          <Stack.Screen name="ProductSearch" component={ProductSearch} options={{ title: 'ProductSearch' }} />

        </Stack.Navigator>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    paddingVertical: 310,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

});
