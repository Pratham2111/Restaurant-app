import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useCurrency } from "./useCurrency";
import { formatCurrency } from "../lib/utils";

/**
 * Custom hook for accessing cart functionality
 * Provides access to cart data and operations with currency conversion
 * @returns {Object} Cart methods and state with currency formatting
 */
export const useCart = () => {
  const cart = useContext(CartContext);
  const { currentCurrency, convertAmount } = useCurrency();
  
  /**
   * Format the subtotal in the current currency
   * @returns {string} Formatted subtotal
   */
  const formatSubtotal = () => {
    const subtotal = cart.getSubtotal();
    const convertedSubtotal = convertAmount(subtotal);
    return formatCurrency(convertedSubtotal, currentCurrency.symbol);
  };
  
  /**
   * Get the delivery fee in the current currency
   * @returns {number} Converted delivery fee
   */
  const getConvertedDeliveryFee = () => {
    const fee = cart.getDeliveryFee();
    return convertAmount(fee);
  };
  
  /**
   * Format the delivery fee in the current currency
   * @returns {string} Formatted delivery fee
   */
  const formatDeliveryFee = () => {
    const convertedFee = getConvertedDeliveryFee();
    return formatCurrency(convertedFee, currentCurrency.symbol);
  };
  
  /**
   * Get the tax in the current currency
   * @returns {number} Converted tax
   */
  const getConvertedTax = () => {
    const tax = cart.getTax();
    return convertAmount(tax);
  };
  
  /**
   * Format the tax in the current currency
   * @returns {string} Formatted tax
   */
  const formatTax = () => {
    const convertedTax = getConvertedTax();
    return formatCurrency(convertedTax, currentCurrency.symbol);
  };
  
  /**
   * Get the total in the current currency
   * @returns {number} Converted total
   */
  const getConvertedTotal = () => {
    const total = cart.getTotal();
    return convertAmount(total);
  };
  
  /**
   * Format the total in the current currency
   * @returns {string} Formatted total
   */
  const formatTotal = () => {
    const convertedTotal = getConvertedTotal();
    return formatCurrency(convertedTotal, currentCurrency.symbol);
  };
  
  /**
   * Format an item's price in the current currency
   * @param {number} price - The price to format
   * @returns {string} Formatted price
   */
  const formatPrice = (price) => {
    const convertedPrice = convertAmount(price);
    return formatCurrency(convertedPrice, currentCurrency.symbol);
  };
  
  /**
   * Format an item's price with quantity
   * @param {number} price - The price of the item
   * @param {number} quantity - The quantity of the item
   * @returns {string} Formatted price with quantity
   */
  const formatItemTotal = (price, quantity) => {
    const total = price * quantity;
    return formatPrice(total);
  };
  
  return {
    ...cart,
    formatSubtotal,
    formatDeliveryFee,
    formatTax,
    formatTotal,
    formatPrice,
    formatItemTotal,
    getConvertedTotal,
    getConvertedTax,
    getConvertedDeliveryFee
  };
};