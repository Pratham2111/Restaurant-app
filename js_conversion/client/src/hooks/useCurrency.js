import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import { formatCurrency } from "../lib/utils";

/**
 * Custom hook for accessing currency functionality
 * Provides access to currency data and conversion operations
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
   * Convert an amount from USD to the current currency
   * @param {number} amount - Amount in USD
   * @returns {number} Converted amount
   */
  const convertAmount = (amount) => {
    if (!currentCurrency) return amount;
    return amount * currentCurrency.rate;
  };
  
  /**
   * Format an amount in the current currency
   * @param {number} amount - Amount in USD
   * @returns {string} Formatted amount with currency symbol
   */
  const formatPrice = (amount) => {
    const convertedAmount = convertAmount(amount);
    return formatCurrency(convertedAmount, currentCurrency?.symbol || "$");
  };
  
  return {
    currencySettings,
    currentCurrency,
    loading,
    error,
    setCurrency,
    convertAmount,
    formatPrice
  };
};