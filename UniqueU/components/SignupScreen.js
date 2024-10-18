// SignupScreen.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSignup = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Signup successful!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create an Account</Text>

        <TextInput
          style={[styles.input, styles.inputPlaceholder]}
          placeholder="Email"
          placeholderTextColor="#606F7B" // Darker color for better visibility
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={[styles.input, styles.inputPlaceholder]}
          placeholder="Password"
          placeholderTextColor="#606F7B" // Darker color for better visibility
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={[styles.input, styles.inputPlaceholder]}
          placeholder="Confirm Password"
          placeholderTextColor="#606F7B" // Darker color for better visibility
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.signupButton} onPress={onSignup}>
          <Text style={styles.signupButtonText}>Signup</Text>
        </TouchableOpacity>
      </View>
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
  card: {
    width: '90%',
    padding: 25,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    marginBottom: 15,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  inputPlaceholder: {
    color: '#333333', 
    fontWeight: '500',
  },
  signupButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E5AA7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SignupScreen;
