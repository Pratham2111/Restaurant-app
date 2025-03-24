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
  const cartContext = useContext(CartContext);
  const { currency, convertAmount } = useCurrency();
  
  if (!cartContext) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  const { 
    items, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart,
    subtotal,
    deliveryFee,
    tax,
    total
  } = cartContext;
  
  /**
   * Format the subtotal in the current currency
   * @returns {string} Formatted subtotal
   */
  const formattedSubtotal = () => {
    return formatCurrency(convertAmount(subtotal), currency.symbol);
  };
  
  /**
   * Get the delivery fee in the current currency
   * @returns {number} Converted delivery fee
   */
  const convertedDeliveryFee = () => {
    return convertAmount(deliveryFee);
  };
  
  /**
   * Format the delivery fee in the current currency
   * @returns {string} Formatted delivery fee
   */
  const formattedDeliveryFee = () => {
    return formatCurrency(convertAmount(deliveryFee), currency.symbol);
  };
  
  /**
   * Get the tax in the current currency
   * @returns {number} Converted tax
   */
  const convertedTax = () => {
    return convertAmount(tax);
  };
  
  /**
   * Format the tax in the current currency
   * @returns {string} Formatted tax
   */
  const formattedTax = () => {
    return formatCurrency(convertAmount(tax), currency.symbol);
  };
  
  /**
   * Get the total in the current currency
   * @returns {number} Converted total
   */
  const convertedTotal = () => {
    return convertAmount(total);
  };
  
  /**
   * Format the total in the current currency
   * @returns {string} Formatted total
   */
  const formattedTotal = () => {
    return formatCurrency(convertAmount(total), currency.symbol);
  };
  
  /**
   * Format an item's price in the current currency
   * @param {number} price - The price to format
   * @returns {string} Formatted price
   */
  const formatItemPrice = (price) => {
    return formatCurrency(convertAmount(price), currency.symbol);
  };
  
  /**
   * Format an item's price with quantity
   * @param {number} price - The price of the item
   * @param {number} quantity - The quantity of the item
   * @returns {string} Formatted price with quantity
   */
  const formatItemTotal = (price, quantity) => {
    return formatCurrency(convertAmount(price * quantity), currency.symbol);
  };
  
  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount: items.length,
    subtotal,
    deliveryFee,
    tax,
    total,
    formattedSubtotal,
    convertedDeliveryFee,
    formattedDeliveryFee,
    convertedTax,
    formattedTax,
    convertedTotal,
    formattedTotal,
    formatItemPrice,
    formatItemTotal,
    isEmpty: items.length === 0,
    totalQuantity: items.reduce((acc, item) => acc + item.quantity, 0)
  };
};