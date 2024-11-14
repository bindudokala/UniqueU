// ProfileDetailsScreen.js
import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const ProfileDetails = () => {
  const { user, userData } = useAuth();
  const navigation = useNavigation();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.noUserText}>No user data available...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Profile Details</Text>
      </View>

      {/* User details container with borders */}
      <View style={styles.detailsBox}>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value} selectable={true}>{userData?.username || 'User'}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Member Since:</Text>
          <Text style={styles.value}>
            {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  detailsBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    color: '#333',
    fontWeight: '400',
  },
  noUserText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ProfileDetails;
