import { useContext } from "react";
import { CartContext } from "../context/CartContext";

/**
 * Custom hook for accessing cart functionality
 * @returns {Object} Cart methods and state
 */
export const useCart = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  return context;
};