import React, { createContext, useState, useEffect } from "react";
import { apiRequest } from "../lib/queryClient";

const defaultCurrency = {
  id: 1,
  symbol: "$",
  code: "USD",
  rate: 1,
  isDefault: true
};

export const CurrencyContext = createContext({
  currencySettings: [],
  currentCurrency: defaultCurrency,
  loading: false,
  error: null,
  setCurrency: async () => {}
});

export const CurrencyProvider = ({ children }) => {
  const [currencySettings, setCurrencySettings] = useState([]);
  const [currentCurrency, setCurrentCurrency] = useState(defaultCurrency);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all available currencies and set the default one
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const currencies = await apiRequest("/api/currency-settings");
        setCurrencySettings(currencies);
        
        // Get and set default currency
        const defaultCurrency = await apiRequest("/api/currency-settings/default");
        setCurrentCurrency(defaultCurrency);
        
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch currency settings:", err);
        setError("Failed to load currency settings");
        setLoading(false);
      }
    };
    
    fetchCurrencies();
  }, []);

  // Function to change the current currency
  const setCurrency = async (currencyId) => {
    try {
      const selected = currencySettings.find(c => c.id === currencyId);
      if (selected) {
        setCurrentCurrency(selected);
        
        // Store preference in localStorage
        localStorage.setItem('preferredCurrency', selected.id.toString());
      }
    } catch (err) {
      console.error("Failed to set currency:", err);
      setError("Failed to change currency");
      throw err;
    }
  };

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