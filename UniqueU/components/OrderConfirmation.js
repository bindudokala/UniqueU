import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const OrderConfirmation = () => {
  const navigation = useNavigation();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2, 
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1, 
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Redirect to home after 20 seconds
    const timeout = setTimeout(() => {
      navigation.navigate('Home');
    }, 20000);

    return () => clearTimeout(timeout);
  }, [scaleAnim, navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Ionicons name="checkmark-circle" size={100} color="black" />
        </Animated.View>
        <Text style={styles.confirmationText}>Order Confirmed!</Text>
        <Text style={styles.subText}>Thank you for your purchase. We are processing your order. Please check your Email for order details.</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  confirmationText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    alignItems: 'center',      
    paddingBottom: 5,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 23,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default OrderConfirmation;
