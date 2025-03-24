import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useCurrency } from "./useCurrency";

/**
 * Custom hook for accessing cart functionality
 * @returns {Object} Cart methods and state
 */
export const useCart = () => {
  const cart = useContext(CartContext);
  const { formatConvertedPrice, convertPrice } = useCurrency();
  
  /**
   * Format the subtotal in the current currency
   * @returns {string} Formatted subtotal
   */
  const formatSubtotal = () => {
    return formatConvertedPrice(cart.getSubtotal());
  };
  
  /**
   * Get the delivery fee in the current currency
   * @returns {number} Converted delivery fee
   */
  const getConvertedDeliveryFee = () => {
    return convertPrice(cart.getDeliveryFee());
  };
  
  /**
   * Format the delivery fee in the current currency
   * @returns {string} Formatted delivery fee
   */
  const formatDeliveryFee = () => {
    return formatConvertedPrice(cart.getDeliveryFee());
  };
  
  /**
   * Get the tax in the current currency
   * @returns {number} Converted tax
   */
  const getConvertedTax = () => {
    return convertPrice(cart.getTax());
  };
  
  /**
   * Format the tax in the current currency
   * @returns {string} Formatted tax
   */
  const formatTax = () => {
    return formatConvertedPrice(cart.getTax());
  };
  
  /**
   * Get the total in the current currency
   * @returns {number} Converted total
   */
  const getConvertedTotal = () => {
    return convertPrice(cart.getTotal());
  };
  
  /**
   * Format the total in the current currency
   * @returns {string} Formatted total
   */
  const formatTotal = () => {
    return formatConvertedPrice(cart.getTotal());
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
    ...cart,
    formatSubtotal,
    getConvertedDeliveryFee,
    formatDeliveryFee,
    getConvertedTax,
    formatTax,
    getConvertedTotal,
    formatTotal,
    formatItemPrice
  };
};