import { createContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

/**
 * Context for managing currency throughout the application
 * @type {React.Context}
 */
export const CurrencyContext = createContext({
  currencySettings: [],
  currentCurrency: { id: 1, code: "USD", symbol: "$", rate: 1, isDefault: true },
  loading: false,
  error: null,
  setCurrency: async () => {},
});

/**
 * Provider component for currency context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState(null);
  const [error, setError] = useState(null);

  // Fetch all available currencies
  const { data: currencySettings = [], isLoading: isLoadingSettings } = useQuery({
    queryKey: ["/api/currency-settings"],
  });

  // Fetch default currency
  const { data: defaultCurrency, isLoading: isLoadingDefault } = useQuery({
    queryKey: ["/api/currency-settings/default"],
  });

  // Set current currency to default when loaded
  useEffect(() => {
    if (defaultCurrency && !currentCurrency) {
      setCurrentCurrency(defaultCurrency);
    }
  }, [defaultCurrency, currentCurrency]);

  /**
   * Change currency by ID
   * @param {number} currencyId - The ID of the currency to switch to
   * @returns {Promise<void>}
   */
  const setCurrency = async (currencyId) => {
    try {
      setError(null);
      
      // Find the selected currency in settings
      const selectedCurrency = currencySettings.find(
        (currency) => currency.id === currencyId
      );
      
      if (selectedCurrency) {
        setCurrentCurrency(selectedCurrency);
      } else {
        throw new Error("Currency not found");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error setting currency:", err);
    }
  };

  // Create context value
  const contextValue = {
    currencySettings,
    currentCurrency: currentCurrency || defaultCurrency,
    loading: isLoadingSettings || isLoadingDefault,
    error,
    setCurrency,
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};