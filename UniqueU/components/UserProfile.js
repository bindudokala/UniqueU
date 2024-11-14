import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const UserProfile = () => {
  const { user, userData, logout } = useAuth();
  const navigation = useNavigation();

  if (!user) {
    return (
      <View style={styles.noUserContainer}>
        <Text style={styles.noUserText}>No user logged in...</Text>
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileHeader}>
        <Ionicons name="person-circle-outline" size={80} color="#555" />
        <Text style={styles.username}>{userData?.username || 'User'}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Sections */}
      <View style={styles.sectionsContainer}>
        <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('ProfileDetails')}>
          <Ionicons name="person-outline" size={24} color="#333" />
          <Text style={styles.sectionText}>Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('OrderHistory')}>
          <Ionicons name="cube-outline" size={24} color="#333" />
          <Text style={styles.sectionText}>Order History</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.section} onPress={() => navigation.navigate('AddressDetails')}>
          <Ionicons name="location-outline" size={24} color="#333" />
          <Text style={styles.sectionText}>Address</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#555',
  },
  sectionsContainer: {
    marginVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sectionText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noUserContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  noUserText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#555',
  },
  loginButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserProfile;
