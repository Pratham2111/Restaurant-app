import { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";

/**
 * Custom hook for accessing currency functionality
 * @returns {Object} Currency methods and state
 */
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  
  return context;
};