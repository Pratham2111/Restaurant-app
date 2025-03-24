import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import { formatCurrency, convertCurrency } from "../lib/utils";

/**
 * Custom hook for accessing currency functionality
 * @returns {Object} Currency methods and state
 */
export const useCurrency = () => {
  const { 
    currencySettings, 
    currentCurrency, 
    loading, 
    error, 
    setCurrency 
  } = useContext(CurrencyContext);
  
  /**
   * Convert a price from USD to current currency
   * @param {number} amount - Price amount in USD
   * @returns {number} Converted price
   */
  const convertPrice = (amount) => {
    if (!currentCurrency) return amount;
    return convertCurrency(amount, currentCurrency.rate);
  };
  
  /**
   * Format a price after converting to current currency
   * @param {number} amount - Price amount in USD
   * @returns {string} Formatted converted price string
   */
  const formatConvertedPrice = (amount) => {
    if (!currentCurrency) return formatCurrency(amount, "$");
    const convertedAmount = convertCurrency(amount, currentCurrency.rate);
    return formatCurrency(convertedAmount, currentCurrency.symbol);
  };
  
  return {
    currencySettings,
    currentCurrency,
    loading,
    error,
    setCurrency,
    convertPrice,
    formatConvertedPrice
  };
};