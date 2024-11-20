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

### 8. **Checkout Page**
- Allows users to review their order before proceeding.
- Displays product details along with the total order amount (inclusive of taxes).
- Requires users to enter payment information for order processing.
- Validates payment details (e.g., card number and CVV format) before allowing checkout.
- On successful payment, it triggers the order creation.

### 9. **Order Confirmation Page**
- Displayed after a successful checkout.
- Shows a confirmation message with a zoom-in animation for the tick mark, changing from green to black for visual feedback.
- Automatically navigates back to the home page after a short delay, or the user can click a button to return manually.

### 10. **Email Notifications**
- Sends an order confirmation email to the user upon successful checkout.
- Email includes order details, estimated delivery date, and a list of purchased items.
- Implemented with Vercel Serverless Functions and SendGrid for email delivery.

### 11. **Search and Filter Features**
- **Search Functionality:**
    - Allows users to search for products by name across multiple categories.
    - Integrated with a loading indicator to show the search process.
    - Displays a message when no products match the search criteria.
- **Filter by Category and Price Range:**
    - Users can filter results by selecting product categories (e.g., sarees, kurtis, lehengas).
    - Price ranges can also be selected (e.g., $0-$50, $51-$100, 101-200).
    - Selected filters are dynamically highlighted (bold) for clear identification.
    - Includes a **Clear Filters** button to reset all applied filters.
- **Sort by Price:**
    - Allows users to sort search results by price:
      - **Low to High.**
      - **High to Low.**
    - Sort selection dynamically updates the displayed results.

### 12. **User Profile Page**
- Displays the logged-in user's **Username, Email**, and **Order History**.
- **Order History** shows each order’s details, including items purchased, order ID, date, and total amount.
- Includes sections for **Order Details** and **Address Management**:
  - Tapping on **Order Details** allows users to view all past orders.
  - Tapping on **Addresses** allows users to manage delivery addresses (feature can be extended in the future).
- **Logout Button** allows users to securely log out of the app.


## **Technology Stack**

- **Frontend**: React Native, Expo
- **Navigation**: React Navigation
- **Backend Services**: Firebase Firestore and Firebase Authentication
- **State Management**: React Hooks (`useState`, `useEffect`, `useContext`)
- **Icons and Styling**: Expo Vector Icons (`Ionicons`), CSS-in-JS Libraries
- **Persistence**: AsyncStorage for user sessions
- **Email Service**: SendGrid (for sending order confirmation emails)
- **APIs and Serverless Functions** - Vercel Serverless Functions for backend API logic(sending order confirmation emails)