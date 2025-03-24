import { createContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

/**
 * Context for managing currency state across the application
 */

// Default currency when API fails
const defaultCurrency = {
  id: 1,
  code: "USD",
  symbol: "$",
  rate: 1,
  isDefault: true
};

// Initial context value
const initialCurrencyContext = {
  currencySettings: [],
  currentCurrency: defaultCurrency,
  loading: true,
  error: null,
  setCurrency: async () => {}
};

// Create context
export const CurrencyContext = createContext(initialCurrencyContext);

/**
 * Provider component for the CurrencyContext
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const CurrencyProvider = ({ children }) => {
  const [currencySettings, setCurrencySettings] = useState([]);
  const [currentCurrency, setCurrentCurrency] = useState(defaultCurrency);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch all currency settings
  const { 
    data: currencies,
    isLoading: currenciesLoading,
    error: currenciesError
  } = useQuery({
    queryKey: ["/api/currency-settings"],
    onSuccess: (data) => {
      if (data && data.length > 0) {
        setCurrencySettings(data);
      }
    },
    onError: (err) => {
      console.error("Error fetching currency settings:", err);
      setError("Unable to load currency settings");
    }
  });
  
  // Fetch default currency
  const {
    data: defaultCurrencyData,
    isLoading: defaultCurrencyLoading,
    error: defaultCurrencyError
  } = useQuery({
    queryKey: ["/api/currency-settings/default"],
    onSuccess: (data) => {
      if (data) {
        setCurrentCurrency(data);
      }
    },
    onError: (err) => {
      console.error("Error fetching default currency:", err);
      // Fall back to USD if default currency can't be fetched
      setCurrentCurrency(defaultCurrency);
    }
  });
  
  // Update loading and error states
  useEffect(() => {
    setLoading(currenciesLoading || defaultCurrencyLoading);
    
    if (currenciesError || defaultCurrencyError) {
      setError(
        (currenciesError?.message || defaultCurrencyError?.message) ||
        "Error loading currency data"
      );
    } else {
      setError(null);
    }
  }, [
    currenciesLoading,
    defaultCurrencyLoading,
    currenciesError,
    defaultCurrencyError
  ]);
  
  /**
   * Set the current currency by ID
   * @param {number} currencyId - ID of the currency to set
   * @returns {Promise<void>}
   */
  const setCurrency = async (currencyId) => {
    try {
      // First check if the currency exists in our local state
      const currencyToSet = currencySettings.find(
        currency => currency.id === currencyId
      );
      
      if (currencyToSet) {
        setCurrentCurrency(currencyToSet);
        return;
      }
      
      // If not found locally, try to update it on the server
      const updatedCurrency = await apiRequest(
        `/api/currency-settings/${currencyId}/default`,
        { method: "PATCH" }
      );
      
      if (updatedCurrency) {
        setCurrentCurrency(updatedCurrency);
      }
    } catch (err) {
      console.error("Error setting currency:", err);
      setError("Failed to update currency");
    }
  };
  
  // Context value
  const value = {
    currencySettings,
    currentCurrency,
    loading,
    error,
    setCurrency
  };
  
  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};