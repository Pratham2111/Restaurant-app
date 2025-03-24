import { createContext, useState, useEffect } from "react";
import { useToast } from "../hooks/use-toast";

/**
 * Context for managing shopping cart throughout the application
 * @type {React.Context}
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
  getItemCount: () => 0,
});

/**
 * Provider component for cart context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const { toast } = useToast();
  
  // Tax rate and delivery fee constants
  const TAX_RATE = 0.1; // 10%
  const DELIVERY_FEE = 5.99;
  const FREE_DELIVERY_THRESHOLD = 50;

  // Load cart from localStorage on initialization
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
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

      // Create new items array based on existing item presence
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        
        toast({
          title: "Updated Cart",
          description: `Added ${quantity} more ${menuItem.name} to your cart.`,
        });
        
        return updatedItems;
      } else {
        // Add new item
        const newItem = {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity,
          image: menuItem.image,
        };
        
        toast({
          title: "Added to Cart",
          description: `${menuItem.name} has been added to your cart.`,
        });
        
        return [...prevItems, newItem];
      }
    });
  };

  /**
   * Remove an item from the cart
   * @param {number} menuItemId - The ID of the menu item to remove
   */
  const removeFromCart = (menuItemId) => {
    setItems((prevItems) => {
      const removedItem = prevItems.find((item) => item.menuItemId === menuItemId);
      
      if (removedItem) {
        toast({
          title: "Removed from Cart",
          description: `${removedItem.name} has been removed from your cart.`,
        });
      }
      
      return prevItems.filter((item) => item.menuItemId !== menuItemId);
    });
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
      prevItems.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  /**
   * Clear all items from the cart
   */
  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  };

  /**
   * Calculate the subtotal of all items in the cart
   * @returns {number} Subtotal amount
   */
  const getSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  /**
   * Calculate the delivery fee based on subtotal
   * @returns {number} Delivery fee
   */
  const getDeliveryFee = () => {
    const subtotal = getSubtotal();
    return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  };

  /**
   * Calculate the tax based on subtotal
   * @returns {number} Tax amount
   */
  const getTax = () => {
    return getSubtotal() * TAX_RATE;
  };

  /**
   * Calculate the total order amount
   * @returns {number} Total amount
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

  // Create context value
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
    getItemCount,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};