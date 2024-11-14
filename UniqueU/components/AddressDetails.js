import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Modal, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const AddressDetails = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState({
    streetAddress: '',
    apartmentSuite: '',
    stateProvince: '',
    zipCode: '',
    country: '',
    phoneNumber: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAddresses(userData.addresses || []);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        Alert.alert('Error', 'Could not fetch addresses');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user]);

  const handleSaveAddress = async () => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedAddresses = [...addresses];

      if (editIndex !== null) {
        // Edit existing address
        updatedAddresses[editIndex] = address;
      } else {
        // Add new address
        updatedAddresses.push(address);
      }

      await setDoc(userDocRef, { addresses: updatedAddresses }, { merge: true });
      setAddresses(updatedAddresses);

      Alert.alert('Success', editIndex !== null ? 'Address updated successfully' : 'Address added successfully');
      setIsEditing(false);
      setAddress({
        streetAddress: '',
        apartmentSuite: '',
        stateProvince: '',
        zipCode: '',
        country: '',
        phoneNumber: '',
      });
      setEditIndex(null);
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Could not save address');
    }
  };

  const handleChange = (field, value) => {
    setAddress(prevAddress => ({ ...prevAddress, [field]: value }));
  };

  const handleEditAddress = (index) => {
    setEditIndex(index);
    setAddress(addresses[index]);
    setIsEditing(true);
  };

  const handleAddNewAddress = () => {
    setEditIndex(null);
    setAddress({
      streetAddress: '',
      apartmentSuite: '',
      stateProvince: '',
      zipCode: '',
      country: '',
      phoneNumber: '',
    });
    setIsEditing(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Addresses</Text>
      </View>

      {addresses.map((addr, index) => (
        <View key={index} style={styles.addressContainer}>
          <Text style={styles.addressText}>Street Address: {addr.streetAddress}</Text>
          <Text style={styles.addressText}>Apartment/Suite: {addr.apartmentSuite}</Text>
          <Text style={styles.addressText}>State/Province: {addr.stateProvince}</Text>
          <Text style={styles.addressText}>Zip Code: {addr.zipCode}</Text>
          <Text style={styles.addressText}>Country: {addr.country}</Text>
          <Text style={styles.addressText}>Phone Number: {addr.phoneNumber}</Text>
          <TouchableOpacity onPress={() => handleEditAddress(index)} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Address</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={handleAddNewAddress} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New Address</Text>
      </TouchableOpacity>

      <Modal visible={isEditing} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>{editIndex !== null ? 'Edit Address' : 'Add Address'}</Text>
            <TextInput
              placeholder="Street Address"
              value={address.streetAddress}
              onChangeText={(text) => handleChange('streetAddress', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Apartment/Suite"
              value={address.apartmentSuite}
              onChangeText={(text) => handleChange('apartmentSuite', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="State/Province"
              value={address.stateProvince}
              onChangeText={(text) => handleChange('stateProvince', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Zip Code"
              value={address.zipCode}
              onChangeText={(text) => handleChange('zipCode', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Country"
              value={address.country}
              onChangeText={(text) => handleChange('country', text)}
              style={styles.input}
            />
            <TextInput
              placeholder="Phone Number"
              value={address.phoneNumber}
              onChangeText={(text) => handleChange('phoneNumber', text)}
              keyboardType="phone-pad"
              style={styles.input}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveAddress} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  addressContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 15,
    position: 'relative',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  editButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#777',
    paddingVertical: 10,
    borderRadius: 5,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    borderRadius: 5,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default AddressDetails;
