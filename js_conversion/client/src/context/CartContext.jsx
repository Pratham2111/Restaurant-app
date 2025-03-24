import { createContext, useState, useEffect } from "react";
import { useToast } from "../hooks/use-toast";

/**
 * Cart context
 * Provides shopping cart functionality throughout the application
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
 * Cart provider component
 * Manages cart state and provides cart functionality to children
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const CartProvider = ({ children }) => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);
  
  /**
   * Add an item to the cart
   * @param {Object} menuItem - The menu item to add
   * @param {number} quantity - The quantity to add (default: 1)
   */
  const addToCart = (menuItem, quantity = 1) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(item => item.menuItemId === menuItem.id);
      
      if (existingItem) {
        // If item already exists, update quantity
        return prevItems.map(item => 
          item.menuItemId === menuItem.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Otherwise add new item
        const newItem = {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image,
          quantity
        };
        return [...prevItems, newItem];
      }
    });
    
    // Show toast notification
    toast({
      title: "Added to Cart",
      description: `${quantity} × ${menuItem.name} added to your cart.`,
      duration: 3000
    });
  };
  
  /**
   * Remove an item from the cart
   * @param {number} menuItemId - The ID of the menu item to remove
   */
  const removeFromCart = (menuItemId) => {
    setItems((prevItems) => prevItems.filter(item => item.menuItemId !== menuItemId));
  };
  
  /**
   * Update the quantity of an item in the cart
   * @param {number} menuItemId - The ID of the menu item to update
   * @param {number} quantity - The new quantity
   */
  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    
    setItems((prevItems) => 
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
   * @returns {number} The subtotal
   */
  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  /**
   * Get the delivery fee
   * @returns {number} The delivery fee
   */
  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    // Free delivery for orders over $50
    return subtotal > 50 ? 0 : 5.99;
  };
  
  /**
   * Calculate the tax amount
   * @returns {number} The tax amount
   */
  const getTax = () => {
    const subtotal = getSubtotal();
    // 8% tax
    return subtotal * 0.08;
  };
  
  /**
   * Calculate the total amount
   * @returns {number} The total amount
   */
  const getTotal = () => {
    return getSubtotal() + getDeliveryFee() + getTax();
  };
  
  /**
   * Get the total number of items in the cart
   * @returns {number} The total number of items
   */
  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };
  
  // Context value to provide
  const contextValue = {
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
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};