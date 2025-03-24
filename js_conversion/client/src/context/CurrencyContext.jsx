import { createContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

/**
 * Currency context type definition
 */
const defaultCurrency = {
  id: 1,
  code: "USD",
  symbol: "$",
  rate: 1,
  isDefault: true
};

/**
 * Currency context
 * Provides currency-related functionality throughout the application
 */
export const CurrencyContext = createContext({
  currencySettings: [],
  currentCurrency: defaultCurrency,
  loading: true,
  error: null,
  setCurrency: async () => {}
});

/**
 * CurrencyProvider component
 * Provides currency context to child components
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState(defaultCurrency);
  
  // Fetch all currency settings
  const {
    data: currencySettings = [],
    isLoading: loadingSettings,
    error: settingsError
  } = useQuery({
    queryKey: ["/api/currency-settings"]
  });
  
  // Fetch default currency
  const {
    data: defaultCurrencyData,
    isLoading: loadingDefault,
    error: defaultError
  } = useQuery({
    queryKey: ["/api/currency-settings/default"]
  });
  
  // Set current currency to default when data is loaded
  useEffect(() => {
    if (defaultCurrencyData && !loadingDefault) {
      setCurrentCurrency(defaultCurrencyData);
    }
  }, [defaultCurrencyData, loadingDefault]);
  
  // Function to change the current currency
  const setCurrency = async (currencyId) => {
    const selected = currencySettings.find(c => c.id === currencyId);
    if (selected) {
      setCurrentCurrency(selected);
      return true;
    }
    return false;
  };
  
  // Determine loading and error states
  const loading = loadingSettings || loadingDefault;
  const error = settingsError || defaultError;
  
  // Context value
  const contextValue = {
    currencySettings,
    currentCurrency,
    loading,
    error: error ? error.message : null,
    setCurrency
  };
  
  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};