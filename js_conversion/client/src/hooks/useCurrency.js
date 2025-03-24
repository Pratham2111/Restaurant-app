import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import { formatCurrency, convertCurrency } from "../lib/utils";

/**
 * Custom hook for accessing currency functionality
 * @returns {Object} Currency methods and state
 */
export const useCurrency = () => {
  const currencyContext = useContext(CurrencyContext);
  
  if (!currencyContext) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  
  const { currentCurrency } = currencyContext;
  
  /**
   * Convert a price from USD to current currency
   * @param {number} amount - Price amount in USD
   * @returns {number} Converted price
   */
  const convertPrice = (amount) => {
    if (!amount) return 0;
    return convertCurrency(amount, currentCurrency.rate);
  };
  
  /**
   * Format a price after converting to current currency
   * @param {number} amount - Price amount in USD
   * @returns {string} Formatted converted price string
   */
  const formatConvertedPrice = (amount) => {
    if (!amount) return formatCurrency(0, currentCurrency.symbol);
    const convertedAmount = convertPrice(amount);
    return formatCurrency(convertedAmount, currentCurrency.symbol);
  };
  
  return {
    ...currencyContext,
    convertPrice,
    formatConvertedPrice
  };
};