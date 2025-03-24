import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import { formatCurrency, convertCurrency } from "../lib/utils";

/**
 * Custom hook for accessing currency functionality
 * Provides access to currency data and conversion operations
 * @returns {Object} Currency methods and state
 */
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  
  /**
   * Convert an amount from USD to the current currency
   * @param {number} amount - Amount in USD
   * @returns {number} Converted amount
   */
  const convert = (amount) => {
    return convertCurrency(amount, context.currentCurrency.rate);
  };
  
  /**
   * Format an amount in the current currency
   * @param {number} amount - Amount in USD
   * @returns {string} Formatted amount with currency symbol
   */
  const formatPrice = (amount) => {
    const convertedAmount = convert(amount);
    return formatCurrency(convertedAmount, context.currentCurrency.symbol);
  };
  
  return {
    ...context,
    convert,
    formatPrice
  };
};