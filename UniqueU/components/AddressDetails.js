import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AddressDetails = () => {
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!user) return;

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAddress(userData.address || '');
        } else {
          setAddress('');
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        Alert.alert('Error', 'Could not fetch address');
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [user]);

  const handleSaveAddress = async () => {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { address }, { merge: true });
      Alert.alert('Success', 'Address saved successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Could not save address');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Address</Text>

      {address && !isEditing ? (
        <View style={styles.addressContainer}>
          <Text style={styles.addressText}>{address}</Text>
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            multiline
          />
          <TouchableOpacity onPress={handleSaveAddress} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Address</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  addressContainer: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    marginBottom: 15,
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
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddressDetails;
