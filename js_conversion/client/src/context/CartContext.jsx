import { createContext, useState, useEffect } from "react";

/**
 * Cart context
 * Provides cart functionality throughout the application
 */
export const CartContext = createContext({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getSubtotal: () => 0,
  getDeliveryFee: () => 0,
  getTax: () => 0,
  getTotal: () => 0,
  getItemCount: () => 0
});

/**
 * CartProvider component
 * Provides cart context to child components
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const CartProvider = ({ children }) => {
  // Initialize cart items from localStorage if available
  const [items, setItems] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items]);
  
  /**
   * Add an item to the cart
   * @param {Object} menuItem - Menu item to add
   * @param {number} quantity - Quantity to add (default: 1)
   */
  const addToCart = (menuItem, quantity = 1) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        item => item.menuItemId === menuItem.id
      );
      
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        const newItem = {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity,
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
    setItems(prevItems => 
      prevItems.filter(item => item.menuItemId !== menuItemId)
    );
  };
  
  /**
   * Update the quantity of an item in the cart
   * @param {number} menuItemId - ID of menu item to update
   * @param {number} quantity - New quantity
   */
  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.menuItemId === menuItemId
          ? { ...item, quantity }
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
   * Calculate the subtotal of all items in the cart
   * @returns {number} Subtotal
   */
  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  /**
   * Get the delivery fee
   * @returns {number} Delivery fee
   */
  const getDeliveryFee = () => {
    // Free delivery for orders over $50
    return getSubtotal() > 50 ? 0 : 5;
  };
  
  /**
   * Calculate the tax
   * @returns {number} Tax
   */
  const getTax = () => {
    return getSubtotal() * 0.1; // 10% tax
  };
  
  /**
   * Calculate the total order amount
   * @returns {number} Total
   */
  const getTotal = () => {
    return getSubtotal() + getDeliveryFee() + getTax();
  };
  
  /**
   * Get the total number of items in the cart
   * @returns {number} Item count
   */
  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };
  
  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getSubtotal,
        getDeliveryFee,
        getTax,
        getTotal,
        getItemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};