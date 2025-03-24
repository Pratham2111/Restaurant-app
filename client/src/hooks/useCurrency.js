import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import { formatCurrency, convertCurrency } from "../lib/utils";

/**
 * Custom hook for accessing currency functionality
 * Provides access to currency data and conversion operations
 * @returns {Object} Currency methods and state
 */
export const useCurrency = () => {
  const currencyContext = useContext(CurrencyContext);
  
  if (!currencyContext) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  
  const { 
    currency, 
    currencyOptions, 
    changeCurrency, 
    isLoading, 
    error 
  } = currencyContext;
  
  /**
   * Convert an amount from USD to the current currency
   * @param {number} amount - Amount in USD
   * @returns {number} Converted amount
   */
  const convertAmount = (amount) => {
    return convertCurrency(amount, currency.rate);
  };
  
  /**
   * Format an amount in the current currency
   * @param {number} amount - Amount in USD
   * @returns {string} Formatted amount with currency symbol
   */
  const formatAmount = (amount) => {
    return formatCurrency(convertAmount(amount), currency.symbol);
  };
  
  return {
    currency,
    currencyOptions,
    changeCurrency,
    isLoading,
    error,
    convertAmount,
    formatAmount
  };
};