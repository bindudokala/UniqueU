import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useCart } from '../contexts/CartContext';
import { db } from '../config/firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
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

  const handleOrderCreation = async () => {
    const orderDate = new Date();
    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setDate(orderDate.getDate() + 7);

    const orderData = {
      uid: user.uid,
      email: user.email,
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
          subtotal: `${subtotal.toFixed(2)}`,
          tax: `${tax.toFixed(2)}`,
          total: `${grandTotal.toFixed(2)}`,
          orderDate: orderDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          estimatedDelivery: estimatedDeliveryDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        }
      });

      // Alert.alert('Order Created', 'Your order has been successfully created, and a confirmation email has been sent!');
      navigation.navigate('OrderConfirmation');
      clearCart();
      // navigation.navigate('Home');
    } catch (error) {
      console.error('Error creating order or sending email:', error);
      Alert.alert('Order Failed', 'Failed to create your order or send email. Please try again.');
    }
  };

  const handlePayment = () => {
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

    // Call handleOrderCreation after successful payment validation
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

        {/* Separator Line */}
        <View style={styles.separator} />

        <View style={styles.paymentForm}>
          <Text style={styles.paymentTitle}>Payment Information</Text>
          <TextInput
            style={[styles.input, styles.inputPlaceholder]}
            placeholder="Name on Card"
            placeholderTextColor="#606F7B"
            value={nameOnCard}
            onChangeText={setNameOnCard}
          />
          <TextInput
            style={[styles.input, styles.inputPlaceholder]}
            placeholder="Card Number"
            placeholderTextColor="#606F7B"
            keyboardType="numeric"
            maxLength={10}
            value={cardNumber}
            onChangeText={setCardNumber}
          />
          <TextInput
            style={[styles.input, styles.inputPlaceholder]}
            placeholder="Expiry Date (MM/YY)"
            placeholderTextColor="#606F7B"
            maxLength={5}
            value={expiryDate}
            onChangeText={setExpiryDate}
          />
          <TextInput
            style={[styles.input, styles.inputPlaceholder]}
            placeholder="CVV"
            placeholderTextColor="#606F7B"
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
  orderSummaryContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paymentTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    marginTop: 10,
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
    marginTop: 5,
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
    color: '#333333',
    fontWeight: '500',
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
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default CheckoutPage;
