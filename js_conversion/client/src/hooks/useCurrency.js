import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import { formatCurrency, convertCurrency } from "../lib/utils";

/**
 * Custom hook for accessing currency functionality
 * @returns {Object} Currency methods and state
 */
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  
  // Add additional currency utility functions
  
  /**
   * Format a price to currency string with current currency symbol
   * @param {number} amount - Price amount to format
   * @returns {string} Formatted price string
   */
  const formatPrice = (amount) => {
    return formatCurrency(amount, context.currentCurrency?.symbol || "$");
  };
  
  /**
   * Convert a price from USD to current currency
   * @param {number} amount - Price amount in USD
   * @returns {number} Converted price
   */
  const convertPrice = (amount) => {
    // If no current currency or rate is 1 (USD), return original amount
    if (!context.currentCurrency || context.currentCurrency.rate === 1) {
      return amount;
    }
    
    return convertCurrency(amount, context.currentCurrency.rate);
  };
  
  /**
   * Format a price after converting to current currency
   * @param {number} amount - Price amount in USD
   * @returns {string} Formatted converted price string
   */
  const formatConvertedPrice = (amount) => {
    const convertedAmount = convertPrice(amount);
    return formatPrice(convertedAmount);
  };
  
  return {
    ...context,
    formatPrice,
    convertPrice,
    formatConvertedPrice,
  };
};