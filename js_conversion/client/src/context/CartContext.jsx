import { createContext, useState, useEffect } from "react";

/**
 * Context for managing shopping cart state across the application
 */

// Initial cart context state
const initialCartContext = {
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  getSubtotal: () => 0,
  getItemCount: () => 0
};

// Create context
export const CartContext = createContext(initialCartContext);

/**
 * Provider component for the CartContext
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);
  
  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);
  
  /**
   * Add an item to the cart
   * @param {Object} menuItem - The menu item to add
   * @param {number} quantity - Quantity to add (default: 1)
   */
  const addToCart = (menuItem, quantity = 1) => {
    setItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.menuItemId === menuItem.id
      );
      
      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item to cart
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
   * @param {number} menuItemId - ID of the menu item to remove
   */
  const removeFromCart = (menuItemId) => {
    setItems((prevItems) => 
      prevItems.filter((item) => item.menuItemId !== menuItemId)
    );
  };
  
  /**
   * Update the quantity of an item in the cart
   * @param {number} menuItemId - ID of the menu item to update
   * @param {number} quantity - New quantity
   */
  const updateQuantity = (menuItemId, quantity) => {
    setItems((prevItems) => {
      return prevItems.map((item) => 
        item.menuItemId === menuItemId 
          ? { ...item, quantity } 
          : item
      );
    });
  };
  
  /**
   * Clear all items from the cart
   */
  const clearCart = () => {
    setItems([]);
  };
  
  /**
   * Calculate the subtotal of items in the cart
   * @returns {number} Subtotal amount
   */
  const getSubtotal = () => {
    return items.reduce(
      (total, item) => total + item.price * item.quantity, 
      0
    );
  };
  
  /**
   * Get the total number of items in the cart
   * @returns {number} Number of items
   */
  const getItemCount = () => {
    return items.reduce(
      (count, item) => count + item.quantity, 
      0
    );
  };
  
  // Context value
  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    getItemCount
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};