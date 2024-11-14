import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  Modal 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { db } from '../config/firebaseConfig';
import { addDoc, collection, setDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const CheckoutPage = () => {
  const navigation = useNavigation();
  const { cartItems, clearCart } = useCart();
  const { user, userData } = useAuth();
  const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isSelectingAddress, setIsSelectingAddress] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userAddresses = userData.addresses || [];
          setAddresses(userAddresses);
          setSelectedAddress(userAddresses[0] || null); // Set the first address as default if it exists
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchAddresses();
  }, [user]);

  const handleOrderCreation = async () => {
    if (!selectedAddress) {
      Alert.alert('Address Required', 'Please select or enter an address for delivery.');
      return;
    }

    const orderDate = new Date();
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(orderDate.getDate() + 7);

    const orderData = {
      uid: user.uid,
      email: user.email,
      address: selectedAddress,
      items: cartItems.map(item => ({
        name: item.name,
        size: item.size || 'Free Size',
        price: item.price.toFixed(2),
      })),
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: grandTotal.toFixed(2),
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);

      await axios.post('https://unique-u.vercel.app/api/send-email', {
        email: user.email,
        orderId: docRef.id,
        username: userData?.username || 'Dear',
        orderDetails: {
          items: cartItems.map(item => ({
            name: item.name,
            size: item.size || 'Free Size',
            price: `${item.price.toFixed(2)}`,
            imageUrl: item.imageUrl || 'https://via.placeholder.com/80x80?text=Image+Not+Available'
          })),
          address: {
            streetAddress: selectedAddress.streetAddress,
            apartmentSuite: selectedAddress.apartmentSuite,
            stateProvince: selectedAddress.stateProvince,
            zipCode: selectedAddress.zipCode,
            country: selectedAddress.country,
            phoneNumber: selectedAddress.phoneNumber,
          },
          subtotal: `${subtotal.toFixed(2)}`,
          tax: `${tax.toFixed(2)}`,
          total: `${grandTotal.toFixed(2)}`,
          orderDate: orderDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          estimatedDelivery: estimatedDeliveryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        }
      });

      navigation.navigate('OrderConfirmation');
      clearCart();
    } catch (error) {
      console.error('Error creating order or sending email:', error);
      Alert.alert('Order Failed', 'Failed to create your order or send email. Please try again.');
    }
  };

  const handlePayment = () => {
    if (!selectedAddress) {
      Alert.alert('Incomplete Address', 'Please select a delivery address.');
      return;
    }

    if (cardNumber.length !== 10 || !/^\d+$/.test(cardNumber)) {
      Alert.alert('Invalid Card Number', 'Card number must be 10 digits.');
      return;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      Alert.alert('Invalid Expiry Date', 'Enter a valid date in MM/YY format.');
      return;
    }

    if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
      Alert.alert('Invalid CVV', 'CVV must be 3 digits.');
      return;
    }

    handleOrderCreation();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Checkout</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.orderSummaryContainer}>
          {cartItems.map((item, index) => (
            <View key={index} style={styles.cartItemContainer}>
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productSize}>Size: {item.size || 'Free Size'}</Text>
              </View>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.priceDetailContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Order Sub-total</Text>
            <Text style={styles.priceValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Sales Tax (5%)</Text>
            <Text style={styles.priceValue}>${tax.toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>Shipping Address</Text>
        {selectedAddress ? (
          <View style={styles.addressContainer}>
            <Text style={styles.selectedAddressText}>Street Address: {selectedAddress.streetAddress}</Text>
            <Text style={styles.selectedAddressText}>Apartment/Suite: {selectedAddress.apartmentSuite}</Text>
            <Text style={styles.selectedAddressText}>State/Province: {selectedAddress.stateProvince}</Text>
            <Text style={styles.selectedAddressText}>Zip Code: {selectedAddress.zipCode}</Text>
            <Text style={styles.selectedAddressText}>Country: {selectedAddress.country}</Text>
            <Text style={styles.selectedAddressText}>Phone Number: {selectedAddress.phoneNumber}</Text>
            <TouchableOpacity onPress={() => setIsSelectingAddress(true)} style={styles.changeAddressButton}>
              <Text style={styles.changeAddressText}>Change Address</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text>No address selected. Please select an address.</Text>
        )}

        <Text style={styles.sectionTitle}>Payment Information</Text>
        <View style={styles.paymentForm}>
          <TextInput
            style={styles.input}
            placeholder="Name on Card"
            value={nameOnCard}
            onChangeText={setNameOnCard}
          />
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            keyboardType="numeric"
            maxLength={10}
            value={cardNumber}
            onChangeText={setCardNumber}
          />
          <TextInput
            style={styles.input}
            placeholder="Expiry Date (MM/YY)"
            maxLength={5}
            value={expiryDate}
            onChangeText={setExpiryDate}
          />
          <TextInput
            style={styles.input}
            placeholder="CVV"
            keyboardType="numeric"
            maxLength={3}
            value={cvv}
            onChangeText={setCvv}
            secureTextEntry
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
          <Text style={styles.buttonText}>Pay ${grandTotal.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isSelectingAddress} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Address</Text>
            <ScrollView style={styles.addressScrollView} contentContainerStyle={styles.addressScrollViewContent}>
              {addresses.map((addr, index) => (
                <TouchableOpacity 
                  key={index} style={styles.addressOption} 
                  onPress={() => {setSelectedAddress(addr); setIsSelectingAddress(false);}}>

                  <View style={styles.addressDetails}>
                    <Text style={styles.addressText}>Street Address: {addr.streetAddress}</Text>
                    <Text style={styles.addressText}>Apartment/Suite: {addr.apartmentSuite}</Text>
                    <Text style={styles.addressText}>State/Province: {addr.stateProvince}</Text>
                    <Text style={styles.addressText}>Zip Code: {addr.zipCode}</Text>
                    <Text style={styles.addressText}>Country: {addr.country}</Text>
                    <Text style={styles.addressText}>Phone Number: {addr.phoneNumber}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setIsSelectingAddress(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addressForm: {
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: '600',
  },
  orderSummaryContainer: {
    marginBottom: 20,
  },
  cartItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productDetails: {
    marginBottom: 5,
  },
  productName: {
    fontSize: 18,
  },
  productSize: {
    fontSize: 16,
    color: '#555',
  },
  productPrice: {
    fontSize: 18,
  },
  priceDetailContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  paymentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  paymentButton: {
    backgroundColor: '#000',
    paddingVertical: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  addressScrollView: {
    maxHeight: 400,
  },
  addressScrollViewContent: {
    paddingBottom: 20,
  },
  addressOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cancelButton: {
    backgroundColor: '#000',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressContainer: {
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 35,
  },
  addressDetails: {
    paddingVertical: 10,
  },
  selectedAddressText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontWeight: '500',
  },
  addressText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 24,
    fontWeight: '500',
  },
  changeAddressButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  changeAddressText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutPage;
