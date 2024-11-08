import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const UserProfile = () => {
  const { user, userData, logout } = useAuth();
  const [orderHistory, setOrderHistory] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user) return;

      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const orders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrderHistory(orders);
      } catch (error) {
        console.error('Error fetching order history:', error);
        Alert.alert('Error', 'Could not fetch order history');
      }
    };

    fetchOrderHistory();
  }, [user]);

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
      <Text style={styles.header}>User Profile</Text>
      <Text style={styles.label}>Username: {userData ? userData.username : 'Loading...'}</Text>
      <Text style={styles.label}>Email: {user ? user.email : 'Loading...'}</Text>
      <Text style={styles.sectionHeader}>Order History</Text>

      <FlatList
        data={orderHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderContainer}>
            <Text style={styles.orderText}>Order ID: {item.id}</Text>
            <Text style={styles.orderText}>Date: {item.createdAt?.toDate().toLocaleDateString()}</Text>
            <Text style={styles.orderText}>Total: ${item.total}</Text>
            <FlatList
              data={item.items}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text>{item.name} - ${item.price}</Text>
                  <Text>Size: {item.size}</Text>
                </View>
              )}
            />
          </View>
        )}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  orderContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  orderText: {
    fontSize: 16,
  },
  itemContainer: {
    marginLeft: 10,
    marginTop: 5,
  },
  logoutButton: {
    backgroundColor: '#000',
    paddingVertical: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#FFF',
    fontSize: 22,
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
    // color: '#888',
    marginBottom: 20,
    fontWeight: '5',
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
