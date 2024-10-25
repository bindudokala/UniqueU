import { getFirestore, collection, getDocs, doc } from 'firebase/firestore';
import { app } from '../config/firebaseConfig';

const db = getFirestore(app);

/**
 * Fetch the first document ID from the 'products' collection.
 */
export const fetchParentDocId = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    if (querySnapshot.empty) {
      throw new Error('No documents found in the products collection.');
    }

    const parentDocId = querySnapshot.docs[0].id;
    return parentDocId;
  } catch (error) {
    console.error('Error fetching parent document ID:', error);
    throw error;
  }
};

/**
 * Fetch categories (sarees, kurtis, lehangas) under the parent document.
 * This assumes known categories; Firestore doesn't support dynamic listing of sub-collections.
 * @param {string} parentDocId - The ID of the parent document.
 */
export const fetchCategories = async (parentDocId) => {
  try {
    const categories = ['sarees', 'kurtis', 'Lehengas']; 
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetch products from a specific category.
 * @param {string} parentDocId - The ID of the parent document.
 * @param {string} category - The category (sub-collection) name.
 */
export const fetchProductsByCategory = async (parentDocId, category) => {
  try {
    const categoryCollectionRef = collection(db, `products/${parentDocId}/${category}`);
    const querySnapshot = await getDocs(categoryCollectionRef);

    const productList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return productList;
  } catch (error) {
    console.error(`Error fetching products from ${category}:`, error);
    throw error;
  }
};
