import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import { auth, createUserWithEmailAndPassword } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const onSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      Alert.alert('Success', 'Signup successful!');
      navigation.replace('HomePage'); 
      console.log('User signed up:', user);
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create an Account</Text>

        <TextInput
          style={[styles.input, styles.inputPlaceholder]}
          placeholder="Email"
          placeholderTextColor="#606F7B"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={[styles.input, styles.inputPlaceholder]}
          placeholder="Password"
          placeholderTextColor="#606F7B"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"  
          autoComplete="password"  
        />

        <TextInput
          style={[styles.input, styles.inputPlaceholder]}
          placeholder="Confirm Password"
          placeholderTextColor="#606F7B"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"  
          autoComplete="password"  
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

export default SignupPage;