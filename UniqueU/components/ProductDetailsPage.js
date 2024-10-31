import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../components/CartContext';

const ProductDetailsPage = ({ route }) => {
  const { product } = route.params;
  const [selectedSize, setSelectedSize] = useState(null); 
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const navigation = useNavigation();
  const { addItemToCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) {
      Alert.alert('Size Selection Required', 'Please select a size.');
      return;
    }

    const productWithSize = { ...product, size: selectedSize };
    addItemToCart(productWithSize);

    setIsAddedToCart(true);
    // Alert.alert('Added to Cart', `${product.name} has been added to your cart!`);
  };

  const handleGoToCart = () => {
    navigation.navigate('Cart', { product: { ...product, size: selectedSize } });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageGallery}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
      </View>

      <View style={styles.productDetails}>
        <Text style={styles.description}>{product.description}</Text>
        <Text style={styles.price}>${product.price}</Text>

        <Text style={styles.sectionTitle}>Select Size</Text>
        <View style={styles.sizeContainer}>
          <TouchableOpacity
            style={[
              styles.sizeButton,
              selectedSize === 'Free Size' && styles.selectedSizeButton,
            ]}
            onPress={() => setSelectedSize('Free Size')}
          >
            <Text
              style={[
                styles.sizeText,
                selectedSize === 'Free Size' && styles.selectedSizeText,
              ]}
            >
              Free Size
            </Text>
          </TouchableOpacity>
        </View>

        {isAddedToCart ? (
          <TouchableOpacity style={styles.addToCartButton} onPress={handleGoToCart}>
            <Text style={styles.addToCartText}>Go to Cart</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
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
  imageGallery: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 510,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  productDetails: {
    paddingHorizontal: 15,
  },
  description: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  price: {
    fontSize: 22,
    color: '#000',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#000',
  },
  sizeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  sizeButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedSizeButton: {
    backgroundColor: '#000',
  },
  sizeText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  selectedSizeText: {
    color: '#fff',
  },
  addToCartButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductDetailsPage;
