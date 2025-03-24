import { createContext, useState, useEffect } from "react";
import { useToast } from "../hooks/use-toast";
import { RESTAURANT_INFO } from "../lib/constants";

// Create cart context
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

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const { toast } = useToast();
  
  // Load cart from local storage on mount
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
  
  // Save cart to local storage when it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);
  
  // Add an item to the cart
  const addToCart = (menuItem, quantity = 1) => {
    setItems((prevItems) => {
      // Check if the item is already in the cart
      const existingItemIndex = prevItems.findIndex(
        (item) => item.menuItemId === menuItem.id
      );
      
      if (existingItemIndex !== -1) {
        // If the item exists, update its quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        
        toast({
          title: "Cart updated",
          description: `${menuItem.name} quantity updated to ${newItems[existingItemIndex].quantity}`,
        });
        
        return newItems;
      } else {
        // If the item doesn't exist, add it to the cart
        const newItem = {
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity,
          image: menuItem.image,
        };
        
        toast({
          title: "Added to cart",
          description: `${menuItem.name} added to your cart`,
        });
        
        return [...prevItems, newItem];
      }
    });
  };
  
  // Remove an item from the cart
  const removeFromCart = (menuItemId) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find(item => item.menuItemId === menuItemId);
      
      if (itemToRemove) {
        toast({
          title: "Removed from cart",
          description: `${itemToRemove.name} removed from your cart`,
        });
      }
      
      return prevItems.filter((item) => item.menuItemId !== menuItemId);
    });
  };
  
  // Update the quantity of an item in the cart
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
  
  // Clear all items from the cart
  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
    });
  };
  
  // Calculate the subtotal of all items in the cart
  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };
  
  // Get the delivery fee
  const getDeliveryFee = () => {
    return items.length > 0 ? RESTAURANT_INFO.deliveryFee : 0;
  };
  
  // Calculate the tax amount
  const getTax = () => {
    return getSubtotal() * RESTAURANT_INFO.taxRate;
  };
  
  // Calculate the total price including subtotal, tax, and delivery fee
  const getTotal = () => {
    return getSubtotal() + getTax() + getDeliveryFee();
  };
  
  // Get the total number of items in the cart
  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };
  
  // Create the context value object
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
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};