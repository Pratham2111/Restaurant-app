import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useCurrency } from "./useCurrency";

/**
 * Custom hook for accessing cart functionality
 * Provides access to cart data and operations with currency conversion
 * @returns {Object} Cart methods and state with currency formatting
 */
export const useCart = () => {
  const cartContext = useContext(CartContext);
  const { formatPrice, convertPrice } = useCurrency();
  
  if (!cartContext) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  /**
   * Format the subtotal in the current currency
   * @returns {string} Formatted subtotal
   */
  const getFormattedSubtotal = () => {
    return formatPrice(cartContext.getSubtotal());
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
    return formatPrice(cartContext.getDeliveryFee());
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
    return formatPrice(cartContext.getTax());
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
    return formatPrice(cartContext.getTotal());
  };
  
  /**
   * Format an item's price in the current currency
   * @param {number} price - The price to format
   * @returns {string} Formatted price
   */
  const formatItemPrice = (price) => {
    return formatPrice(price);
  };
  
  /**
   * Format an item's price with quantity
   * @param {number} price - The price of the item
   * @param {number} quantity - The quantity of the item
   * @returns {string} Formatted price with quantity
   */
  const formatItemTotalPrice = (price, quantity) => {
    return formatPrice(price * quantity);
  };
  
  return {
    ...cartContext,
    getFormattedSubtotal,
    getConvertedDeliveryFee,
    getFormattedDeliveryFee,
    getConvertedTax,
    getFormattedTax,
    getConvertedTotal,
    getFormattedTotal,
    formatItemPrice,
    formatItemTotalPrice
  };
};