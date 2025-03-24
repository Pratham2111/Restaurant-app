import React, { createContext, useState, useEffect } from "react";
import { CURRENCY_OPTIONS } from "../lib/constants";
import { apiRequest } from "../lib/queryClient";

export const CurrencyContext = createContext(null);

const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(CURRENCY_OPTIONS[0]); // Default to USD
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch default currency on component mount
  useEffect(() => {
    const fetchDefaultCurrency = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("/api/currency/default");
        
        if (response) {
          // If API returns a default currency, find matching option
          const matchingOption = CURRENCY_OPTIONS.find(
            option => option.value === response.code
          );
          
          if (matchingOption) {
            setCurrency(matchingOption);
          }
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching default currency:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    // For now, we'll use local currency options until API is implemented
    // fetchDefaultCurrency();
  }, []);

  // Change the current currency
  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    
    // Optional: Update user's preference on the server
    // We can uncomment this when the API is implemented
    /*
    apiRequest("/api/currency/set-preference", {
      method: "POST",
      body: JSON.stringify({ code: newCurrency.value }),
    }).catch(err => {
      console.error("Error saving currency preference:", err);
    });
    */
  };

  // Prepare the context value
  const contextValue = {
    currency,
    currencyOptions: CURRENCY_OPTIONS,
    changeCurrency,
    isLoading,
    error
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyProvider;