import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useCurrency } from "./useCurrency";

/**
 * Custom hook for accessing cart functionality
 * @returns {Object} Cart methods and state
 */
export const useCart = () => {
  const cartContext = useContext(CartContext);
  const { convertPrice, formatPrice, formatConvertedPrice } = useCurrency();
  
  if (!cartContext) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  // Add additional cart utility functions with currency conversion
  
  /**
   * Get the subtotal in the current currency
   * @returns {number} Converted subtotal
   */
  const getConvertedSubtotal = () => {
    return convertPrice(cartContext.getSubtotal());
  };
  
  /**
   * Format the subtotal in the current currency
   * @returns {string} Formatted subtotal
   */
  const getFormattedSubtotal = () => {
    return formatConvertedPrice(cartContext.getSubtotal());
  };
  
  /**
   * Get the delivery fee in the current currency
   * @returns {number} Converted delivery fee
   */
  const getConvertedDeliveryFee = () => {
    return convertPrice(cartContext.getDeliveryFee());
  };
  
  /**
   * Format the delivery fee in the current currency
   * @returns {string} Formatted delivery fee
   */
  const getFormattedDeliveryFee = () => {
    return formatConvertedPrice(cartContext.getDeliveryFee());
  };
  
  /**
   * Get the tax in the current currency
   * @returns {number} Converted tax
   */
  const getConvertedTax = () => {
    return convertPrice(cartContext.getTax());
  };
  
  /**
   * Format the tax in the current currency
   * @returns {string} Formatted tax
   */
  const getFormattedTax = () => {
    return formatConvertedPrice(cartContext.getTax());
  };
  
  /**
   * Get the total in the current currency
   * @returns {number} Converted total
   */
  const getConvertedTotal = () => {
    return convertPrice(cartContext.getTotal());
  };
  
  /**
   * Format the total in the current currency
   * @returns {string} Formatted total
   */
  const getFormattedTotal = () => {
    return formatConvertedPrice(cartContext.getTotal());
  };
  
  /**
   * Format an item's price in the current currency
   * @param {number} price - The price to format
   * @returns {string} Formatted price
   */
  const getFormattedPrice = (price) => {
    return formatConvertedPrice(price);
  };
  
  return {
    ...cartContext,
    getConvertedSubtotal,
    getFormattedSubtotal,
    getConvertedDeliveryFee,
    getFormattedDeliveryFee,
    getConvertedTax,
    getFormattedTax,
    getConvertedTotal,
    getFormattedTotal,
    getFormattedPrice,
  };
};