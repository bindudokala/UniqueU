import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  ScrollView 
} from 'react-native';
import Swiper from 'react-native-swiper';
import { fetchParentDocId, fetchCategories } from '../services/firestoreService';
import { auth } from '../config/firebaseConfig';

const HomePage = ({ navigation }) => {
  const [categories, setCategories] = useState([
    { name: 'Sarees', image: 'https://www.sacredweaves.com/cdn/shop/articles/Blog_banner-min_1600x.jpg?v=1625036042' },
    { name: 'Kurtis', image: 'https://cdn.shopify.com/s/files/1/0341/4805/7228/files/banner_fcfc7c2c-588e-4248-9e9f-54040ce9c1b7.jpg?v=1670905659' },
    { name: 'Lehengas', image: 'https://www.shreekama.com/cdn/shop/articles/banner-image-for-a-blog-post-with-title-long-vs-sh-JsAVVIFBTleP97LNfRp_4w-kLOYJUyLQTilwhDyCowTDg.jpg?v=1717133215' }
  ]);
  const [loading, setLoading] = useState(true);
  const [parentDocId, setParentDocId] = useState(null);
  const [error, setError] = useState(null); 
  const [banners, setBanners] = useState([
    { uri: 'https://i.pinimg.com/736x/d0/78/70/d078705c172a131d88c67bd19986172d.jpg' },
    { uri: 'https://m.media-amazon.com/images/S/stores-image-uploads-eu-prod/2/AmazonStores/A21TJRUUN4KGV/05e6761286e62648b6aba8335fc4f99a.w1920.h597.jpg' },
    { uri: 'https://hariomexport.com/wp-content/uploads/2018/06/Roopsangam-Web-Banner03.jpg-1118x486.jpg' }
  ]);

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
        setCategories((prevCategories) =>
          prevCategories.map((cat, index) => ({
            ...cat,
            name: categoryList[index] || cat.name,
          }))
        );
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
      navigation.navigate('CategoryProducts', { parentDocId, category: category.name });
    }
  };

  const renderBannerItem = (banner) => (
    <View key={banner.uri} style={styles.slide}>
      <Image source={{ uri: banner.uri }} style={styles.banner} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.loadingText}>Loading...</Text>
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Sliding Banner */}
      <Swiper autoplay={true} loop={true}  style={styles.swiper} showsPagination={false}>
        {banners.map(renderBannerItem)}
      </Swiper>

      <Text style={styles.sectionTitle}>Shop By Category</Text>

      {/* Category List - Static View with TouchableOpacity items */}
      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(category)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: category.image }}
              style={styles.categoryImage}
            />
            <View style={styles.textOverlay}>
              <Text style={styles.categoryText}>{category.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
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
  scrollContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  swiper: {
    height: 200,
    marginBottom: 20,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  banner: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  categoriesContainer: {
    flexDirection: 'column',
    cursor: 'pointer',
  },
  categoryCard: {
    width: '100%',
    height: 200,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    cursor: 'pointer',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 20, 
    paddingHorizontal: 20,
    paddingVertical: 6,
    width: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
