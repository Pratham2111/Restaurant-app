import { createContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

/**
 * Currency context for the application
 * Manages currency settings and provides conversion functionality
 */

// Default currency in case API fails
const defaultCurrency = {
  id: 1,
  code: "USD",
  symbol: "$",
  rate: 1,
  isDefault: true
};

// Create context with default values
const CurrencyContext = createContext({
  currencySettings: [],
  currentCurrency: defaultCurrency,
  loading: true,
  error: null,
  setCurrency: async () => {},
});

/**
 * Currency context provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
const CurrencyProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [currentCurrency, setCurrentCurrency] = useState(defaultCurrency);
  
  // Fetch all currency settings
  const {
    data: currencySettings = [],
    isLoading: loadingSettings,
    error: settingsError
  } = useQuery({
    queryKey: ["/api/currency-settings"],
    onSuccess: (data) => {
      // Check if we already have the current currency
      if (data && data.length > 0 && !currentCurrency.id) {
        const defaultCurrency = data.find(c => c.isDefault) || data[0];
        setCurrentCurrency(defaultCurrency);
      }
    }
  });
  
  // Fetch default currency on initial load
  const {
    data: defaultCurrencyData,
    isLoading: loadingDefault,
    error: defaultError
  } = useQuery({
    queryKey: ["/api/currency-settings/default"],
    onSuccess: (data) => {
      if (data) {
        setCurrentCurrency(data);
      }
    }
  });
  
  // Mutation to set default currency
  const mutation = useMutation({
    mutationFn: (currencyId) => {
      return apiRequest(`/api/currency-settings/${currencyId}/set-default`, {
        method: "POST"
      });
    },
    onSuccess: (data) => {
      setCurrentCurrency(data);
      queryClient.invalidateQueries({ queryKey: ["/api/currency-settings"] });
    }
  });
  
  // Change current currency
  const setCurrency = async (currencyId) => {
    // If we already have the settings, find the currency in our local state
    const newCurrency = currencySettings.find(c => c.id === currencyId);
    if (newCurrency) {
      mutation.mutate(currencyId);
    }
  };
  
  // Context value
  const value = {
    currencySettings,
    currentCurrency,
    loading: loadingSettings || loadingDefault,
    error: settingsError || defaultError || null,
    setCurrency,
  };
  
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export { CurrencyContext, CurrencyProvider };