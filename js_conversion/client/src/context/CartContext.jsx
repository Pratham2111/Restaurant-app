import { createContext, useEffect, useState } from "react";
import { useCurrency } from "../hooks/useCurrency";
import { useToast } from "../hooks/use-toast";

/**
 * Context for shopping cart functionality
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
  getItemCount: () => 0
});

/**
 * Provider component for the cart context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const { convertPrice, formatConvertedPrice, currentCurrency } = useCurrency();
  const { toast } = useToast();
  
  // Load cart from localStorage on mount
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
  
  // Save cart to localStorage when it changes
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
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.menuItemId === menuItem.id
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        
        toast({
          title: "Item quantity updated",
          description: `${menuItem.name} quantity increased to ${newItems[existingItemIndex].quantity}`
        });
        
        return newItems;
      } else {
        // Add new item if it doesn't exist
        const newItem = {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity,
          image: menuItem.image
        };
        
        toast({
          title: "Item added to cart",
          description: `${quantity} × ${menuItem.name} added to your order`
        });
        
        return [...prevItems, newItem];
      }
    });
  };
  
  /**
   * Remove an item from the cart
   * @param {number} menuItemId - ID of the menu item to remove
   */
  const removeFromCart = (menuItemId) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.menuItemId === menuItemId);
      if (itemToRemove) {
        toast({
          title: "Item removed",
          description: `${itemToRemove.name} was removed from your order`
        });
      }
      
      return prevItems.filter((item) => item.menuItemId !== menuItemId);
    });
  };
  
  /**
   * Update the quantity of an item in the cart
   * @param {number} menuItemId - ID of the menu item
   * @param {number} quantity - New quantity
   */
  const updateQuantity = (menuItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((item) =>
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
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your order"
    });
  };
  
  /**
   * Calculate the subtotal of all items in the cart
   * @returns {number} Subtotal amount in USD
   */
  const getSubtotal = () => {
    return items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  
  // Fixed delivery fee in USD
  const BASE_DELIVERY_FEE = 4.99;
  
  /**
   * Get the delivery fee
   * @returns {number} Delivery fee in USD
   */
  const getDeliveryFee = () => {
    // Free delivery for orders over $50
    return getSubtotal() >= 50 ? 0 : BASE_DELIVERY_FEE;
  };
  
  /**
   * Calculate tax amount (10% of subtotal)
   * @returns {number} Tax amount in USD
   */
  const getTax = () => {
    return getSubtotal() * 0.1;
  };
  
  /**
   * Calculate total order amount
   * @returns {number} Total amount in USD
   */
  const getTotal = () => {
    return getSubtotal() + getDeliveryFee() + getTax();
  };
  
  /**
   * Count total number of items in cart
   * @returns {number} Total item count
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
    getItemCount
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};