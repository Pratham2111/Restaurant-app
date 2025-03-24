import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useCurrency } from "./useCurrency";

/**
 * Custom hook for accessing cart functionality
 * Provides access to cart data and operations with currency conversion
 * @returns {Object} Cart methods and state with currency formatting
 */
export const useCart = () => {
  const cart = useContext(CartContext);
  const { convert, formatPrice } = useCurrency();
  
  if (!cart) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  /**
   * Format the subtotal in the current currency
   * @returns {string} Formatted subtotal
   */
  const getFormattedSubtotal = () => {
    return formatPrice(cart.getSubtotal());
  };
  
  /**
   * Get the delivery fee in the current currency
   * @returns {number} Converted delivery fee
   */
  const getConvertedDeliveryFee = () => {
    return convert(cart.getDeliveryFee());
  };
  
  /**
   * Format the delivery fee in the current currency
   * @returns {string} Formatted delivery fee
   */
  const getFormattedDeliveryFee = () => {
    return formatPrice(cart.getDeliveryFee());
  };
  
  /**
   * Get the tax in the current currency
   * @returns {number} Converted tax
   */
  const getConvertedTax = () => {
    return convert(cart.getTax());
  };
  
  /**
   * Format the tax in the current currency
   * @returns {string} Formatted tax
   */
  const getFormattedTax = () => {
    return formatPrice(cart.getTax());
  };
  
  /**
   * Get the total in the current currency
   * @returns {number} Converted total
   */
  const getConvertedTotal = () => {
    return convert(cart.getTotal());
  };
  
  /**
   * Format the total in the current currency
   * @returns {string} Formatted total
   */
  const getFormattedTotal = () => {
    return formatPrice(cart.getTotal());
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
  const formatItemTotal = (price, quantity) => {
    return formatPrice(price * quantity);
  };
  
  return {
    ...cart,
    getFormattedSubtotal,
    getConvertedDeliveryFee,
    getFormattedDeliveryFee,
    getConvertedTax,
    getFormattedTax,
    getConvertedTotal,
    getFormattedTotal,
    formatItemPrice,
    formatItemTotal
  };
};