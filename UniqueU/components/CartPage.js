import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const CartPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const product = route.params?.product;

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No product found in the cart.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleContinueShopping = () => {
    navigation.navigate('HomePage'); 
  };
  
  const handleCheckout = () => {
    Alert.alert('Proceeding to Checkout', 'Redirecting to checkout...');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="black" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Cart: 1 Item</Text>
      </View>

      <View style={styles.cartItemContainer}>
        <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price}</Text>
          <Text style={styles.sizeLabel}>Size: {product.size || 'Free Size'}</Text>
        </View>
      </View>

      <View style={styles.priceDetailContainer}>
        <Text style={styles.priceDetailHeader}>Price Detail</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Order Sub-total</Text>
          <Text style={styles.priceValue}>${product.price}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotalValue}>${product.price}</Text>
        </View>
        <Text style={styles.taxInfo}>Inclusive of taxes</Text>
      </View>

      <View style={styles.checkoutSection}>
      <TouchableOpacity style={styles.continueShoppingButton} onPress={handleContinueShopping}>
          <Text style={styles.buttonText}>Continue Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.proceedCheckoutButton} onPress={handleCheckout}>
          <Text style={styles.buttonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', 
    position: 'relative', 
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute', 
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cartItemContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    elevation: 2,
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
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 18,
  },
  sizeLabel: {
    fontSize: 16,
    color: '#555',
  },
  priceDetailContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  priceDetailHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  priceLabel: {
    fontSize: 16,
    color: '#555',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  taxInfo: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
  checkoutSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  continueShoppingButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  proceedCheckoutButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
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
  },
});

export default CartPage;
