import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const Header = () => {
  const navigation = useNavigation();

  const handleHomePress = () => {
    navigation.navigate('HomePage');
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleSignupPress = () => {
    navigation.navigate('Signup');
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.header}>
      {/* Left-aligned Title */}
      <TouchableOpacity onPress={handleHomePress}>
        <Text style={styles.title}>UniqueU</Text>
      </TouchableOpacity>

      {/* Right-aligned Buttons and Icons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleLoginPress}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignupPress} style={styles.signupButton}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleProfilePress} style={styles.icon}>
          <FontAwesome name="user" size={22} color="black" />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleCartPress} style={styles.icon}>
          <FontAwesome name="shopping-cart" size={22} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingTop: 58, 
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
    marginHorizontal: 5, 
  },
  icon: {
    marginLeft: 10, 
  },
});

export default Header;
