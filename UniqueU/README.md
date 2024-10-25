readme_content = """
# **UniqueU: E-commerce Mobile Application**

**UniqueU** is a cross-platform mobile application built using **React Native**. It allows users to browse products, add them to their cart, and proceed to checkout with an intuitive shopping experience.

## **Project Overview**

The UniqueU app offers an easy-to-use interface for shopping enthusiasts. Users can browse through product categories, view product details, and seamlessly add items to their cart. With an emphasis on modern design, the project features a clean user interface for product pages, cart functionality, and essential authentication flows like login and signup.

## **Features Implemented So Far**

### 1. **Home Page**
- Displays available product categories.
- Added a loading indicator ("Loading categories...") for improved user experience.

### 2. **Header Navigation**
- Customized header with:
  - **Logo (UniqueU)** aligned to the left.
  - **Login**, **Signup**, **Profile Icon**, and **Cart Icon** aligned to the right.
  - Even spacing between header elements.
- Clicking on the **Login** or **Signup** redirects users to the respective screens.

### 3. **Category Products Page**
- Displays products under a specific category.
- Each product card shows:
  - Product Image.
  - Product Name, Price, and Size.
- **Back Button** at the top allows users to return to the previous screen.
- Products displayed in a two-column grid layout.

### 4. **Product Details Page**
- Displays the selected product’s detailed information, including:
  - Product image (with rounded corners for aesthetics).
  - Name, Price, Description, and Size (Free Size option).
- **Add to Cart Button**:
  - Validates that the size is selected before adding to cart.
  - If successfully added, the button text changes to **"Go to Cart"**.
- **Navigation to Cart** from the Product Details Page.

### 5. **Cart Page**
- Displays the product(s) added to the cart with:
  - Product Image, Name, Price, and Size.
  - **Back Button** aligned properly to the left, with **"Cart: 1 Item"** centered in the header.
- **Price Breakdown Section**:
  - Order Subtotal.
  - Grand Total (inclusive of taxes).
- **Checkout Section**:
  - **Continue Shopping** button (navigates to the HomePage).
  - **Proceed to Checkout** button with an alert confirming the action.

### 6. **Authentication (Login and Signup)**
- **Firebase Authentication** integrated with **React Native AsyncStorage** for persistence.
- Authentication state managed through `AuthProvider` and Firebase’s `onAuthStateChanged` listener.
- If the user is not logged in, the app redirects to the **Login Page**.

### 7. **Cart Management**
- Cart dynamically updates based on the product added from the **Product Details Page**.
- Displays a relevant message if the cart is empty.

## **Technology Stack**

- **Frontend**: React Native, Expo
- **Navigation**: React Navigation
- **Backend Services**: Firebase Firestore and Firebase Authentication
- **State Management**: React Hooks (`useState`, `useEffect`, `useContext`)
- **Icons**: Expo Vector Icons (`Ionicons`)
- **Persistence**: AsyncStorage for user sessions


