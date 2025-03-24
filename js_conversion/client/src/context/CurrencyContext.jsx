import { createContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";

// Default currency fallback if API fails
const defaultCurrency = {
  id: 1,
  code: "USD",
  symbol: "$",
  name: "US Dollar",
  rate: 1,
  isDefault: true,
};

// Create currency context
export const CurrencyContext = createContext({
  currencySettings: [],
  currentCurrency: defaultCurrency,
  loading: true,
  error: null,
  setCurrency: async () => {},
});

export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState(defaultCurrency);
  const { toast } = useToast();
  
  // Fetch all available currencies
  const {
    data: currencySettings = [],
    isLoading: loadingSettings,
    isError: isSettingsError,
    error: settingsError,
  } = useQuery({
    queryKey: ["/api/currency-settings"],
    staleTime: Infinity, // Currency settings rarely change
  });
  
  // Fetch the default currency
  const {
    data: defaultCurrencyData,
    isLoading: loadingDefault,
    isError: isDefaultError,
    error: defaultError,
  } = useQuery({
    queryKey: ["/api/currency-settings/default"],
    staleTime: Infinity,
  });
  
  // Set up mutation for changing the default currency
  const updateDefaultCurrencyMutation = useMutation({
    mutationFn: async (currencyId) => {
      return await apiRequest(`/api/currency-settings/${currencyId}/default`, {
        method: "PATCH",
      });
    },
    onSuccess: (updatedCurrency) => {
      setCurrentCurrency(updatedCurrency);
      toast({
        title: "Currency updated",
        description: `Currency changed to ${updatedCurrency.name} (${updatedCurrency.symbol})`,
      });
    },
    onError: (error) => {
      console.error("Failed to update currency:", error);
      toast({
        title: "Currency update failed",
        description: "Could not change the currency. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Set the current currency when default currency data is loaded
  useEffect(() => {
    if (defaultCurrencyData) {
      setCurrentCurrency(defaultCurrencyData);
    }
  }, [defaultCurrencyData]);
  
  // Function to change the current currency
  const setCurrency = async (currencyId) => {
    // Find the currency in our settings
    const newCurrency = currencySettings.find((currency) => currency.id === currencyId);
    
    if (!newCurrency) {
      toast({
        title: "Currency not found",
        description: "The selected currency is not available",
        variant: "destructive",
      });
      return;
    }
    
    // Update the default currency on the server
    await updateDefaultCurrencyMutation.mutateAsync(currencyId);
  };
  
  // Determine if there's an error from either query
  const error = isSettingsError
    ? settingsError?.message
    : isDefaultError
    ? defaultError?.message
    : null;
  
  // Create the context value object
  const value = {
    currencySettings,
    currentCurrency,
    loading: loadingSettings || loadingDefault,
    error,
    setCurrency,
  };
  
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};