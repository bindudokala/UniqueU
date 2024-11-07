import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const orderHistory = [
    { id: '1', date: 'Oct 1, 2024', status: 'Delivered', total: '$35.00' },
    { id: '2', date: 'Oct 15, 2024', status: 'Processing', total: '$25.00' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.info}>{user.name || 'Bindu Dokala'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.info}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Delivery Address:</Text>
        <Text style={styles.info}>{user.address || 'No address provided'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Order History:</Text>
        {orderHistory.map(order => (
          <View key={order.id} style={styles.order}>
            <Text style={styles.orderText}>Order ID: {order.id}</Text>
            <Text style={styles.orderText}>Date: {order.date}</Text>
            <Text style={styles.orderText}>Status: {order.status}</Text>
            <Text style={styles.orderText}>Total: {order.total}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => logout()}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  info: {
    fontSize: 16,
    color: '#555',
  },
  order: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderText: {
    fontSize: 14,
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserProfile;
