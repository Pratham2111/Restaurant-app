import { createContext, useEffect, useState } from "react";
import { formatCurrency, convertCurrency } from "../lib/utils";
import { useToast } from "../hooks/use-toast";

// Default currency if API fails
const defaultCurrency = {
  id: 1,
  code: "USD",
  symbol: "$",
  rate: 1,
  name: "US Dollar",
  isDefault: true
};

/**
 * Context for currency functionality
 * @type {React.Context}
 */
export const CurrencyContext = createContext({
  currencySettings: [],
  currentCurrency: defaultCurrency,
  loading: true,
  error: null,
  setCurrency: async () => {}
});

/**
 * Provider component for the currency context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const CurrencyProvider = ({ children }) => {
  const [currencySettings, setCurrencySettings] = useState([]);
  const [currentCurrency, setCurrentCurrency] = useState(defaultCurrency);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  
  // Load available currencies and default currency on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        
        // Fetch all available currencies
        const currenciesResponse = await fetch("/api/currency-settings");
        const currencies = await currenciesResponse.json();
        
        if (currencies && currencies.length > 0) {
          setCurrencySettings(currencies);
          
          // Check if we have a saved currency preference
          const savedCurrencyId = localStorage.getItem("preferredCurrency");
          
          if (savedCurrencyId) {
            // Find the saved currency in the fetched currencies
            const savedCurrency = currencies.find(c => c.id === parseInt(savedCurrencyId));
            if (savedCurrency) {
              setCurrentCurrency(savedCurrency);
              setLoading(false);
              return;
            }
          }
          
          // If no saved preference or it's invalid, get the default currency
          const defaultResponse = await fetch("/api/currency-settings/default");
          const defaultCurrencyData = await defaultResponse.json();
          
          if (defaultCurrencyData) {
            setCurrentCurrency(defaultCurrencyData);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch currency settings:", err);
        setError("Failed to load currency settings");
        setLoading(false);
        
        // Use default fallback if API fails
        toast({
          title: "Currency settings unavailable",
          description: "Using default currency (USD)",
          variant: "destructive"
        });
      }
    };
    
    fetchCurrencies();
  }, [toast]);
  
  /**
   * Change the current currency
   * @param {number} currencyId - ID of the currency to set
   * @returns {Promise<void>}
   */
  const setCurrency = async (currencyId) => {
    try {
      const newCurrency = currencySettings.find(c => c.id === currencyId);
      
      if (newCurrency) {
        setCurrentCurrency(newCurrency);
        localStorage.setItem("preferredCurrency", currencyId.toString());
        
        toast({
          title: "Currency updated",
          description: `Currency changed to ${newCurrency.name} (${newCurrency.code})`
        });
      }
    } catch (err) {
      console.error("Failed to set currency:", err);
      toast({
        title: "Currency update failed",
        description: "Could not change the currency",
        variant: "destructive"
      });
    }
  };
  
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