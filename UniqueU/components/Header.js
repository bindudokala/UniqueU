import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

const Header = () => {
  const navigation = useNavigation(); // Get navigation instance

  const handleHomePress = () => {
    navigation.navigate('HomePage'); // Navigate to HomePage
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleSignupPress = () => {
    navigation.navigate('Signup');
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleHomePress}>
        <Text style={styles.title}>UniqueU</Text>
      </TouchableOpacity>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignupPress}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingTop: 50, // To account for the camera notch on iOS devices
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#333333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#4E61FF',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Header;
