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
  
  const { currencySettings, currentCurrency, loading, error, setCurrency } = context;
  
  /**
   * Convert an amount from USD to the current currency
   * @param {number} amount - Amount in USD
   * @returns {number} Converted amount
   */
  const convert = (amount) => {
    if (!amount) return 0;
    if (!currentCurrency) return amount;
    
    return convertCurrency(amount, currentCurrency.rate);
  };
  
  /**
   * Format an amount in the current currency
   * @param {number} amount - Amount in USD
   * @returns {string} Formatted amount with currency symbol
   */
  const format = (amount) => {
    if (!amount) return formatCurrency(0, currentCurrency?.symbol || "$");
    if (!currentCurrency) return formatCurrency(amount, "$");
    
    return formatCurrency(
      convertCurrency(amount, currentCurrency.rate),
      currentCurrency.symbol
    );
  };
  
  return {
    currencySettings,
    currentCurrency,
    loading,
    error,
    setCurrency,
    convert,
    format
  };
};