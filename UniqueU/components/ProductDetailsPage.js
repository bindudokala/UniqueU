import React from 'react';
import { Text, Image, StyleSheet, ScrollView } from 'react-native';

const ProductDetailsPage = ({ route }) => {
  const { product } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>₹{product.price}</Text>
      <Text style={styles.description}>{product.description}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: '#1E88E5',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProductDetailsPage;
