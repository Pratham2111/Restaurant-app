import { createContext, useState, useEffect } from "react";

/**
 * Cart context for the application
 * Manages shopping cart state and operations
 */

// Default values for cart context
const CartContext = createContext({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getSubtotal: () => 0,
  getDeliveryFee: () => 0,
  getTax: () => 0,
  getTotal: () => 0,
  getItemCount: () => 0,
});

/**
 * CartProvider component
 * Provides cart state and functions to the application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
const CartProvider = ({ children }) => {
  // Initialize cart items from local storage if available
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem("cart");
    return savedItems ? JSON.parse(savedItems) : [];
  });
  
  // Save cart items to local storage when they change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);
  
  /**
   * Add an item to the cart
   * @param {Object} menuItem - Menu item to add
   * @param {number} quantity - Quantity to add (default: 1)
   */
  const addToCart = (menuItem, quantity = 1) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.menuItemId === menuItem.id
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item if it doesn't exist
        const newItem = {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity: quantity,
          image: menuItem.image
        };
        return [...prevItems, newItem];
      }
    });
  };
  
  /**
   * Remove an item from the cart
   * @param {number} menuItemId - ID of menu item to remove
   */
  const removeFromCart = (menuItemId) => {
    setItems((prevItems) => 
      prevItems.filter((item) => item.menuItemId !== menuItemId)
    );
  };
  
  /**
   * Update quantity of an item in the cart
   * @param {number} menuItemId - ID of menu item to update
   * @param {number} quantity - New quantity
   */
  const updateQuantity = (menuItemId, quantity) => {
    setItems((prevItems) => 
      prevItems.map((item) => 
        item.menuItemId === menuItemId
          ? { ...item, quantity: quantity }
          : item
      )
    );
  };
  
  /**
   * Clear all items from the cart
   */
  const clearCart = () => {
    setItems([]);
  };
  
  /**
   * Calculate subtotal of all items in cart
   * @returns {number} Subtotal
   */
  const getSubtotal = () => {
    return items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  
  /**
   * Get delivery fee
   * @returns {number} Delivery fee
   */
  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    // Free delivery for orders over $50
    return subtotal > 50 ? 0 : 4.99;
  };
  
  /**
   * Calculate tax
   * @returns {number} Tax amount
   */
  const getTax = () => {
    const subtotal = getSubtotal();
    // Tax rate 8.5%
    return subtotal * 0.085;
  };
  
  /**
   * Calculate total
   * @returns {number} Total amount
   */
  const getTotal = () => {
    return getSubtotal() + getDeliveryFee() + getTax();
  };
  
  /**
   * Get total number of items in cart
   * @returns {number} Item count
   */
  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };
  
  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    getDeliveryFee,
    getTax,
    getTotal,
    getItemCount,
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export { CartContext, CartProvider };