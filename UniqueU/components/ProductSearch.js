import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { fetchParentDocId, fetchCategories, fetchProductsByCategory } from '../services/firestoreService';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 40) / 2;

const ProductSearch = ({ route, navigation }) => {
  const { searchText } = route.params;
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [parentDocId, setParentDocId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [isFilterMenuVisible, setIsFilterMenuVisible] = useState(false);
  const [isSortMenuVisible, setIsSortMenuVisible] = useState(false);

  useEffect(() => {
    const loadParentDocId = async () => {
      try {
        const id = await fetchParentDocId();
        setParentDocId(id);
      } catch (error) {
        console.error('Error fetching parent document ID:', error);
        Alert.alert('Error', 'Unable to load products.');
      }
    };

    loadParentDocId();
  }, []);

  useEffect(() => {
    if (parentDocId && searchText) {
      handleSearch(searchText);
    }
  }, [parentDocId, searchText, selectedCategory, selectedPriceRange, sortOrder]);

  const handleSearch = async (text) => {
    setLoading(true);
    try {
      const allCategories = await fetchCategories(parentDocId);
      setCategories(allCategories);

      let results = [];
      for (const category of allCategories) {
        if (selectedCategory && category !== selectedCategory) continue;

        const products = await fetchProductsByCategory(parentDocId, category);
        let filteredProducts = products.filter(product =>
          product.name.toLowerCase().includes(text.toLowerCase())
        ).filter(product => {
          if (!selectedPriceRange) return true;
          const [min, max] = selectedPriceRange;
          return product.price >= min && product.price <= max;
        });

        results = [...results, ...filteredProducts];
      }

      if (sortOrder === 'asc') {
        results.sort((a, b) => a.price - b.price);
      } else if (sortOrder === 'desc') {
        results.sort((a, b) => b.price - a.price);
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching products:', error);
      Alert.alert('Error', 'An error occurred while searching.');
    } finally {
      setLoading(false);
    }
  };

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

  const openFilterModal = () => setIsFilterMenuVisible(true);
  const closeFilterModal = () => setIsFilterMenuVisible(false);
  const openSortModal = () => setIsSortMenuVisible(true);
  const closeSortModal = () => setIsSortMenuVisible(false);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedPriceRange(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Showing results for '{searchText}'</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.productsContainer}
        />
      ) : (
        <View style={styles.noProductsContainer}>
          <Text style={styles.noProductsText}>No products found</Text>
        </View> 
      )}

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.bottomButton} onPress={openSortModal}>
          <Ionicons name="swap-vertical-outline" size={20} color="white" />
          <Text style={styles.bottomButtonText}>Sort By</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomButton} onPress={openFilterModal}>
          <Ionicons name="filter-outline" size={20} color="white" />
          <Text style={styles.bottomButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal visible={isFilterMenuVisible} animationType="slide" transparent={true} onRequestClose={closeFilterModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Filters</Text>
            <ScrollView>
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Category</Text>
                {categories.map((category, index) => (
                  <TouchableOpacity key={index} onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}>
                    <Text style={[styles.filterOption, selectedCategory === category && styles.selectedFilterOption]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Price</Text>
                {[ [0, 50], [51, 100], [101, 200], [201,500], [501,1000], [1001, 2000] ].map((range, index) => (
                  <TouchableOpacity key={index} onPress={() => setSelectedPriceRange(selectedPriceRange === range ? null : range)}>
                    <Text style={[styles.filterOption, selectedPriceRange === range && styles.selectedFilterOption]}>
                      ${range[0]} - ${range[1]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={closeFilterModal}>
              <Text style={styles.closeButtonText}>Apply Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal visible={isSortMenuVisible} animationType="slide" transparent={true} onRequestClose={closeSortModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Sort By</Text>
            <TouchableOpacity onPress={() => { setSortOrder('asc'); closeSortModal(); }}>
              <Text style={[styles.filterOption, sortOrder === 'asc' && styles.selectedFilterOption]}>Price: Low to High</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSortOrder('desc'); closeSortModal(); }}>
              <Text style={[styles.filterOption, sortOrder === 'desc' && styles.selectedFilterOption]}>Price: High to Low</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeSortModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
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
  noProductsContainer: {
    flex: 1,
    paddingVertical: 310,
    alignItems: 'center',
  },
  noProductsText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productsContainer: {
    paddingBottom: 60,
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
    marginBottom: 15,
  },
  productImage: {
    width: '100%',
    height: 320,
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
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  filterOption: {
    fontSize: 14,
    paddingVertical: 5,
    color: '#555',
  },
  selectedFilterOption: {
    color: '#000',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ProductSearch;

