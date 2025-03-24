import { createContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

/**
 * Context for currency settings and conversion throughout the application
 */
const defaultCurrency = {
  id: 1,
  code: "USD",
  symbol: "$",
  name: "US Dollar",
  rate: 1,
  isDefault: true
};

/**
 * Currency context
 * Provides access to currency data and conversion operations
 */
export const CurrencyContext = createContext({
  currencySettings: [],
  currentCurrency: defaultCurrency,
  loading: true,
  error: null,
  setCurrency: () => Promise.resolve()
});

/**
 * Currency provider component
 * Manages currency state and provides currency functionality to children
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export const CurrencyProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [currentCurrency, setCurrentCurrency] = useState(defaultCurrency);
  
  // Fetch all available currencies
  const { 
    data: currencySettings = [],
    isLoading: loadingCurrencies,
    error: currenciesError
  } = useQuery({
    queryKey: ["/api/currency-settings"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch default currency
  const {
    data: defaultCurrencyData,
    isLoading: loadingDefault,
    error: defaultError
  } = useQuery({
    queryKey: ["/api/currency-settings/default"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Set default currency when data is loaded
  useEffect(() => {
    if (defaultCurrencyData) {
      setCurrentCurrency(defaultCurrencyData);
    }
  }, [defaultCurrencyData]);
  
  // Mutation to update default currency
  const updateDefaultMutation = useMutation({
    mutationFn: async (id) => {
      return apiRequest(`/api/currency-settings/${id}/set-default`, {
        method: "POST"
      });
    },
    onSuccess: () => {
      // Invalidate currency queries to refetch the data
      queryClient.invalidateQueries({ queryKey: ["/api/currency-settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/currency-settings/default"] });
    }
  });
  
  // Set currency function
  const setCurrency = async (id) => {
    try {
      const selectedCurrency = currencySettings.find(c => c.id === id);
      if (selectedCurrency) {
        // First update UI for immediate feedback
        setCurrentCurrency(selectedCurrency);
        // Then update server
        await updateDefaultMutation.mutateAsync(id);
      }
    } catch (err) {
      console.error("Failed to set currency:", err);
    }
  };
  
  // Calculate loading and error states
  const loading = loadingCurrencies || loadingDefault;
  const error = currenciesError || defaultError || null;
  
  // Context value to provide
  const contextValue = {
    currencySettings,
    currentCurrency,
    loading,
    error,
    setCurrency
  };
  
  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};