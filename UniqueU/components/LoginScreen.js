import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Auth0 from 'react-native-auth0';
import * as SecureStore from 'expo-secure-store';
import { auth0Config } from '../config/authConfig';

const auth0 = new Auth0({
  domain: auth0Config.domain,
  clientId: auth0Config.clientId,
});

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    try {
      const credentials = await auth0.webAuth.authorize({
        scope: 'openid profile email',
        audience: `https://${auth0Config.domain}/userinfo`,
        username: email,
        password,
      });

      console.log('Logged in with credentials: ', credentials);
      await SecureStore.setItemAsync('authToken', credentials.accessToken);

      alert('Login successful!');
    } catch (error) {
      console.log('Login error: ', error);
      alert('Authentication failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login to Your Account</Text>

        <TextInput
          style={[styles.input, styles.inputPlaceholder]}
          placeholder="Email"
          placeholderTextColor="#606F7B" // Darker color to make it more visible
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={[styles.input, styles.inputPlaceholder]}
          placeholder="Password"
          placeholderTextColor="#606F7B" // Darker color to make it more visible
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Signup</Text>
          </TouchableOpacity>
        </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1A202C',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#F7FAFC',
  },
  inputPlaceholder: {
    color: '#333333', // Ensures input text is visible if user starts typing
    fontWeight: '500', // This gives a thicker, more visible style to the placeholder
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#1E5AA7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    color: '#1E5AA7',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#4A5568',
  },
  signupLink: {
    fontSize: 16,
    color: '#1E5AA7',
    fontWeight: '700',
  },
});

export default LoginScreen;
