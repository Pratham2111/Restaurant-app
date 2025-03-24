import { createContext, useState, useEffect } from "react";
import { useCurrency } from "../hooks/useCurrency";

/**
 * Context for managing shopping cart state across the application
 */

// Initial context value
const initialCartContext = {
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
};

// Create context
export const CartContext = createContext(initialCartContext);

// Constants for cart calculations
const DELIVERY_FEE = 4.99;
const TAX_RATE = 0.08; // 8%

/**
 * Provider component for the CartContext
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const { convertAmount } = useCurrency();
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (err) {
        console.error("Failed to parse saved cart:", err);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);
  
  /**
   * Add a menu item to the cart
   * @param {Object} menuItem - The menu item to add
   * @param {number} quantity - The quantity to add (default: 1)
   */
  const addToCart = (menuItem, quantity = 1) => {
    setItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        item => item.menuItemId === menuItem.id
      );
      
      // If item exists, update quantity
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      }
      
      // If item doesn't exist, add new item
      const newItem = {
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: quantity,
        image: menuItem.image
      };
      
      return [...prevItems, newItem];
    });
  };
  
  /**
   * Remove a menu item from the cart
   * @param {number} menuItemId - ID of the menu item to remove
   */
  const removeFromCart = (menuItemId) => {
    setItems(prevItems => 
      prevItems.filter(item => item.menuItemId !== menuItemId)
    );
  };
  
  /**
   * Update the quantity of a menu item in the cart
   * @param {number} menuItemId - ID of the menu item
   * @param {number} quantity - New quantity
   */
  const updateQuantity = (menuItemId, quantity) => {
    // If quantity is 0 or less, remove the item
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
   * Calculate the subtotal for all items in the cart
   * @returns {number} Subtotal amount
   */
  const getSubtotal = () => {
    return items.reduce(
      (total, item) => total + item.price * item.quantity, 
      0
    );
  };
  
  /**
   * Get the delivery fee
   * @returns {number} Delivery fee
   */
  const getDeliveryFee = () => {
    return items.length > 0 ? DELIVERY_FEE : 0;
  };
  
  /**
   * Calculate tax on the subtotal
   * @returns {number} Tax amount
   */
  const getTax = () => {
    return getSubtotal() * TAX_RATE;
  };
  
  /**
   * Calculate the total for all items, including taxes and fees
   * @returns {number} Total amount
   */
  const getTotal = () => {
    return getSubtotal() + getTax() + getDeliveryFee();
  };
  
  /**
   * Get the total number of items in the cart
   * @returns {number} Item count
   */
  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };
  
  // Context value
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
    getItemCount
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};