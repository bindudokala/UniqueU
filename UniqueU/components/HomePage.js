import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Image
} from 'react-native';
import { fetchParentDocId, fetchCategories } from '../services/firestoreService';
import { auth } from '../config/firebaseConfig';

const HomePage = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parentDocId, setParentDocId] = useState(null);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const loadCategories = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        navigation.replace('Login'); 
        return;
      }

      try {
        const docId = await fetchParentDocId(); 
        setParentDocId(docId);

        const categoryList = await fetchCategories(docId); 
        setCategories(categoryList);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryPress = (category) => {
    if (parentDocId) {
      navigation.navigate('CategoryProducts', { parentDocId, category });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text>Loading categories...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => navigation.replace('Home')}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Banner Image */}
      <Text style={styles.welcomeText}>Welcome to UniqueU</Text>
      <Image
        source={{ uri: 'https://i.pinimg.com/736x/d0/78/70/d078705c172a131d88c67bd19986172d.jpg' }} 
        style={styles.banner}
      />

      {/* Welcome Section */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.subtitle}>Select a category to get started</Text>
      </View>

      {/* Category List */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(item)}
          >
            <Text style={styles.categoryText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  banner: {
    width: '100%',

    paddingVertical: 110,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  categoryCard: {
    backgroundColor: '#000000',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1E88E5',
    padding: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default HomePage;
