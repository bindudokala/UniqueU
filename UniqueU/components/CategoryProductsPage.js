import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { fetchProductsByCategory } from '../services/firestoreService';
import { Ionicons } from '@expo/vector-icons'; 

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 30) / 2;

const CategoryProductsPage = ({ route, navigation }) => {
  const { parentDocId, category } = route.params;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productList = await fetchProductsByCategory(parentDocId, category);
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    loadProducts();
  }, [parentDocId, category]);

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color="black" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Products in {category}</Text>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  headerContainer: {
    height: 60,
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
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productCard: {
    width: ITEM_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  productImage: {
    width: '100%',
    height: 320,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 10,
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  productSize: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default CategoryProductsPage;
