import React, { createContext, useState, useEffect } from "react";
import { useToast } from "../hooks/use-toast.jsx";

export const CartContext = createContext(null);

const TAX_RATE = 0.08; // 8% tax
const DELIVERY_FEE = 5; // $5 delivery fee

const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  // Calculate subtotal, tax, and total when items change
  useEffect(() => {
    const newSubtotal = calculateSubtotal();
    const newTax = calculateTax(newSubtotal);
    const newTotal = calculateTotal(newSubtotal, newTax);
    
    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  }, [items]);

  // Calculate subtotal (sum of item prices * quantities)
  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  // Calculate tax based on subtotal
  const calculateTax = (subtotal) => {
    return subtotal * TAX_RATE;
  };

  // Calculate total (subtotal + tax + delivery fee)
  const calculateTotal = (subtotal, tax) => {
    return subtotal + tax + DELIVERY_FEE;
  };

  // Add an item to the cart
  const addItem = (item) => {
    // Check if the item is already in the cart
    const existingItemIndex = items.findIndex(
      (i) => i.menuItemId === item.menuItemId
    );

    if (existingItemIndex >= 0) {
      // If the item exists, update its quantity
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += item.quantity || 1;
      setItems(updatedItems);
      
      toast({
        title: "Quantity updated",
        description: `${item.name} quantity increased to ${updatedItems[existingItemIndex].quantity}`,
        variant: "default",
      });
    } else {
      // If the item doesn't exist, add it to the cart
      setItems([...items, { ...item, quantity: item.quantity || 1 }]);
      
      toast({
        title: "Item added",
        description: `${item.name} added to your cart`,
        variant: "default",
      });
    }
  };

  // Remove an item from the cart
  const removeItem = (menuItemId) => {
    const itemToRemove = items.find(item => item.menuItemId === menuItemId);
    
    if (itemToRemove) {
      const newItems = items.filter(item => item.menuItemId !== menuItemId);
      setItems(newItems);
      
      toast({
        title: "Item removed",
        description: `${itemToRemove.name} removed from your cart`,
        variant: "destructive",
      });
    }
  };

  // Update the quantity of an item in the cart
  const updateQuantity = (menuItemId, quantity) => {
    if (quantity < 1) {
      removeItem(menuItemId);
      return;
    }

    const updatedItems = items.map(item => {
      if (item.menuItemId === menuItemId) {
        const newQuantity = Math.max(1, quantity); // Ensure quantity is at least 1
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setItems(updatedItems);
  };

  // Clear the cart
  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart",
      variant: "default",
    });
  };

  // Prepare the context value
  const contextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    tax,
    deliveryFee: DELIVERY_FEE,
    total
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;