import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useCurrency } from "./useCurrency";

/**
 * Custom hook for accessing cart functionality
 * @returns {Object} Cart methods and state
 */
export const useCart = () => {
  const cartContext = useContext(CartContext);
  const { formatConvertedPrice, convertPrice } = useCurrency();
  
  if (!cartContext) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  /**
   * Format the subtotal in the current currency
   * @returns {string} Formatted subtotal
   */
  const formatSubtotal = () => {
    return formatConvertedPrice(cartContext.getSubtotal());
  };
  
  /**
   * Get the delivery fee in the current currency
   * @returns {number} Converted delivery fee
   */
  const getDeliveryFee = () => {
    // Base delivery fee is $5.00
    const baseFee = 5.00;
    
    // Free delivery for orders over $50
    if (cartContext.getSubtotal() > 50) {
      return 0;
    }
    
    return convertPrice(baseFee);
  };
  
  /**
   * Format the delivery fee in the current currency
   * @returns {string} Formatted delivery fee
   */
  const formatDeliveryFee = () => {
    return formatConvertedPrice(getDeliveryFee());
  };
  
  /**
   * Get the tax in the current currency
   * @returns {number} Converted tax
   */
  const getTax = () => {
    // Tax rate is 8.875% (NYC tax rate)
    const taxRate = 0.08875;
    return convertPrice(cartContext.getSubtotal() * taxRate);
  };
  
  /**
   * Format the tax in the current currency
   * @returns {string} Formatted tax
   */
  const formatTax = () => {
    return formatConvertedPrice(getTax());
  };
  
  /**
   * Get the total in the current currency
   * @returns {number} Converted total
   */
  const getTotal = () => {
    return cartContext.getSubtotal() + getDeliveryFee() + getTax();
  };
  
  /**
   * Format the total in the current currency
   * @returns {string} Formatted total
   */
  const formatTotal = () => {
    return formatConvertedPrice(getTotal());
  };
  
  /**
   * Format an item's price in the current currency
   * @param {number} price - The price to format
   * @returns {string} Formatted price
   */
  const formatItemPrice = (price) => {
    return formatConvertedPrice(price);
  };
  
  return {
    ...cartContext,
    formatSubtotal,
    getDeliveryFee,
    formatDeliveryFee,
    getTax,
    formatTax,
    getTotal,
    formatTotal,
    formatItemPrice,
  };
};