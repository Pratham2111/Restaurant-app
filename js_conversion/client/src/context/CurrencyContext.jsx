import React, { createContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

// Default currency fallback if API fails
const defaultCurrency = {
  id: 1,
  code: "USD",
  symbol: "$",
  name: "US Dollar",
  rate: 1,
  isDefault: true,
};

// Context definition
export const CurrencyContext = createContext({
  currencySettings: [],
  currentCurrency: defaultCurrency,
  loading: true,
  error: null,
  setCurrency: async () => {},
});

export const CurrencyProvider = ({ children }) => {
  // State to track current currency
  const [currentCurrency, setCurrentCurrency] = useState(defaultCurrency);

  // Fetch all available currencies
  const {
    data: currencySettings = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/currency-settings"],
  });

  // Fetch default currency
  const { data: defaultCurrencyData } = useQuery({
    queryKey: ["/api/currency-settings/default"],
  });

  // Update default currency mutation
  const mutation = useMutation({
    mutationFn: (currencyId) => {
      return fetch(`/api/currency-settings/${currencyId}/default`, {
        method: "PATCH",
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update currency");
        }
        return res.json();
      });
    },
    onSuccess: () => {
      // Invalidate currency queries to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ["/api/currency-settings"] });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/currency-settings/default"] 
      });
    },
  });

  // Set the current currency when default is loaded or changed
  useEffect(() => {
    if (defaultCurrencyData) {
      setCurrentCurrency(defaultCurrencyData);
    }
  }, [defaultCurrencyData]);

  // Function to change the current currency
  const setCurrency = async (currencyId) => {
    // Find the currency in our settings
    const newCurrency = currencySettings.find(
      (currency) => currency.id === currencyId
    );

    if (newCurrency) {
      try {
        // Update the default currency on the server
        await mutation.mutateAsync(currencyId);
        // Update the local state
        setCurrentCurrency(newCurrency);
        return true;
      } catch (error) {
        console.error("Failed to set currency:", error);
        return false;
      }
    }
    return false;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currencySettings,
        currentCurrency,
        loading: isLoading,
        error: error ? error.message : null,
        setCurrency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};