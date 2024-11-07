import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  ScrollView, 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';

const getEstimatedDeliveryDate = () => {
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + 7);

  const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' };
  return deliveryDate.toLocaleDateString('en-US', options);
};

const CartPage = () => {
  const navigation = useNavigation();
  const { cartItems, removeItemFromCart } = useCart();
  const estimatedDelivery = getEstimatedDeliveryDate();

  const subtotal = cartItems.reduce((total, item) => total + item.price, 0);
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  const handleContinueShopping = () => {
    navigation.navigate('Home');
  };

  const handleRemoveItem = (item) => {
    removeItemFromCart(item);
  };

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyCartContainer}>
        <Text style={styles.errorText}>No product found in the cart.</Text>
  
        <View style={{ flex: 1 }} />
  
        <TouchableOpacity 
          style={styles.emptyCartContinueShoppingButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.emptyCartContinueShoppingButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Cart: {cartItems.length} Item(s)</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {cartItems.map((item, index) => (
          <View key={index} style={styles.cartItemContainer}>
            <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>Price: ${item.price.toFixed(2)}</Text>
              <Text style={styles.sizeLabel}>Size: {item.size || 'Free Size'}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveItem(item)} style={styles.removeButton}>
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.estimatedDeliveryContainer}>
          <Ionicons name="time-outline" size={20} color="green" />
          <Text style={styles.estimatedDeliveryText}>
            Est Delivery: {estimatedDelivery}
          </Text>
        </View>

        <View style={styles.priceDetailContainer}>
          <Text style={styles.priceDetailHeader}>Price Detail</Text>
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
          <Text style={styles.taxInfo}>Inclusive of taxes</Text>
        </View>

        <View style={styles.checkoutSection}>
          <TouchableOpacity style={styles.continueShoppingButton} onPress={handleContinueShopping}>
            <Text style={styles.buttonText}>Continue Shopping</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.proceedCheckoutButton} onPress={() => navigation.navigate('Checkout')}>
            <Text style={styles.buttonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyCartContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  emptyCartContinueShoppingButton: {
    backgroundColor: '#000', 
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: 'center',
    width: '98%', 
    marginTop: 20, 
  },
  emptyCartContinueShoppingButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  cartItemContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 2,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 180,
    borderRadius: 10,
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-around',
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    marginBottom: 8,
  },
  sizeLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  removeButton: {
    padding: 10,
    marginTop: 85,
  },
  removeButtonText: {
    color: 'red',
    fontSize: 16,
  },
  estimatedDeliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  estimatedDeliveryText: {
    marginLeft: 5,
    fontSize: 16,
    color: 'green',
  },
  priceDetailContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  priceDetailHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 18,
    color: '#555',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  grandTotalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  taxInfo: {
    fontSize: 14,
    color: '#888',
  },
  checkoutSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    position: 'absolute',
    bottom: 1,
    left: 20,
    right: 20,
  },
  continueShoppingButton: {
    backgroundColor: '#000',
    paddingVertical: 25,
    borderRadius: 10,
    alignItems: 'center',
    width: '49%',
  },
  proceedCheckoutButton: {
    backgroundColor: '#000',
    paddingVertical: 25,
    borderRadius: 10,
    alignItems: 'center',
    width: '49%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default CartPage;