import { createContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";

/**
 * Currency Context
 * Manages currency settings and conversion throughout the app
 */
const CurrencyContext = createContext({
  currencySettings: [],
  currentCurrency: { id: 1, code: "USD", symbol: "$", rate: 1, isDefault: true },
  loading: true,
  error: null,
  setCurrency: async () => {}
});

/**
 * Currency Provider Component
 * Provides currency state and functions to child components
 */
const CurrencyProvider = ({ children }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Default currency state
  const [currentCurrency, setCurrentCurrency] = useState({
    id: 1,
    code: "USD",
    symbol: "$",
    rate: 1,
    isDefault: true
  });
  
  // Fetch all available currencies
  const {
    data: currencySettings = [],
    isLoading: loadingSettings,
    error: settingsError
  } = useQuery({
    queryKey: ["/api/currency-settings"],
    staleTime: 1000 * 60 * 60 // 1 hour
  });
  
  // Fetch default currency
  const {
    data: defaultCurrency,
    isLoading: loadingDefault,
    error: defaultError
  } = useQuery({
    queryKey: ["/api/currency-settings/default"],
    staleTime: 1000 * 60 * 60 // 1 hour
  });
  
  // Update current currency based on default currency from API
  useEffect(() => {
    if (defaultCurrency) {
      setCurrentCurrency(defaultCurrency);
    }
  }, [defaultCurrency]);
  
  // Mutation to change the active currency
  const { mutate: mutateCurrency, isPending: changingCurrency } = useMutation({
    mutationFn: async (currencyId) => {
      return await apiRequest(`/api/currency-settings/${currencyId}/default`, {
        method: "PATCH"
      });
    },
    onSuccess: (newCurrency) => {
      setCurrentCurrency(newCurrency);
      queryClient.invalidateQueries({ queryKey: ["/api/currency-settings/default"] });
      
      toast({
        title: "Currency Updated",
        description: `Currency changed to ${newCurrency.code}`,
        variant: "default"
      });
    },
    onError: (error) => {
      console.error("Error changing currency:", error);
      
      toast({
        title: "Error",
        description: "Failed to change currency. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Function to set the active currency
  const setCurrency = async (currencyId) => {
    if (currencyId === currentCurrency.id) return;
    mutateCurrency(currencyId);
  };
  
  // Derive loading and error states
  const loading = loadingSettings || loadingDefault || changingCurrency;
  const error = settingsError || defaultError ? "Failed to load currency settings" : null;
  
  return (
    <CurrencyContext.Provider
      value={{
        currencySettings,
        currentCurrency,
        loading,
        error,
        setCurrency
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export { CurrencyContext, CurrencyProvider };