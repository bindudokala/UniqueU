import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const navigation = useNavigation();
  const { cartItems } = useCart();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleHomePress = () => {
    navigation.navigate('Home');
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  const handleSignupPress = () => {
    navigation.navigate('Signup');
  };

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  const handleProfilePress = () => {
    navigation.navigate('UserProfile');
  };

  const handleSearchPress = () => {
    setIsSearchExpanded(true);
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      navigation.navigate('ProductSearch', { searchText });
      setIsSearchExpanded(false);
      setSearchText('');
    }
  };

  const handleCloseSearch = () => {
    setIsSearchExpanded(false);
    setSearchText('');
  };

  return (
    <View style={styles.header}>
      {!isSearchExpanded ? (
        <>
          {/* Left-aligned Title */}
          <TouchableOpacity onPress={handleHomePress}>
            <Text style={styles.title}>UniqueU</Text>
          </TouchableOpacity>

          {/* Right-aligned Buttons and Icons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={handleLoginPress}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSignupPress} style={styles.signupButton}>
              <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>

            {/* Search Icon */}
            <TouchableOpacity onPress={handleSearchPress} style={styles.icon}>
              <Ionicons name="search-outline" size={22} color="black" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleProfilePress} style={styles.icon}>
              <FontAwesome name="user" size={22} color="black" />
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={handleCartPress} style={{ position: 'relative' }}>
                <Ionicons name="cart-outline" size={22} color="black" />
                {cartItems.length > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearchSubmit}
            autoFocus
          />
          <TouchableOpacity onPress={handleCloseSearch} style={styles.closeButton}>
            <Ionicons name="close-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingTop: 58, 
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
    marginHorizontal: 5, 
  },
  icon: {
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  closeButton: {
    marginLeft: 10,
  },
});

export default Header;
