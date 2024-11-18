import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true); 
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
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Order History</Text>
      </View>

      {orderHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No orders placed</Text>
        </View>
        ) : (
        <FlatList
          data={orderHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderContainer}>
              <Text style={styles.orderId}>Order ID: <Text style={styles.orderIdValue}>{item.id}</Text></Text>
              <Text style={styles.orderDate}>Date: {item.createdAt?.toDate().toLocaleDateString()}</Text>
              <View style={styles.itemsHeader}>
                <Text style={styles.itemsHeaderText}>Items:</Text>
              </View>
              <FlatList
                data={item.items}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemSize}>Size: {item.size}</Text>
                      <Text style={styles.itemPrice}>${item.price}</Text>
                    </View>
                  </View>
                )}
              />
              <View style={styles.totalContainer}>
                <Text style={styles.orderTotalLabel}>Total:</Text>
                <Text style={styles.orderTotalValue}>${item.total}</Text>
              </View>
            </View>
          )}
        />
      )} 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    paddingVertical: 310,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    paddingVertical: 310,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  orderIdValue: {
    fontWeight: '400',
  },
  orderDate: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  itemsHeader: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 8,
    marginTop: 8,
  },
  itemsHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 2,
  },
  itemContainer: {
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  itemSize: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  orderTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderTotalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default OrderHistory;
