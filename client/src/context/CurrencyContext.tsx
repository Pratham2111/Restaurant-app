import React, { createContext, useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { CurrencySetting } from "@shared/schema";
import { CURRENCY_OPTIONS } from "@/lib/constants";

interface CurrencyContextType {
  currencySettings: CurrencySetting[];
  currentCurrency: CurrencySetting;
  loading: boolean;
  error: string | null;
  setCurrency: (currencyId: number) => Promise<void>;
}

const defaultCurrency: CurrencySetting = {
  id: 1,
  code: "USD",
  symbol: "$",
  rate: 1.0,
  isDefault: true
};

export const CurrencyContext = createContext<CurrencyContextType>({
  currencySettings: [],
  currentCurrency: defaultCurrency,
  loading: true,
  error: null,
  setCurrency: async () => {}
});

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currencySettings, setCurrencySettings] = useState<CurrencySetting[]>([]);
  const [currentCurrency, setCurrentCurrency] = useState<CurrencySetting>(defaultCurrency);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/currency-settings");
        if (!res.ok) {
          throw new Error("Failed to fetch currency settings");
        }
        const data = await res.json();
        setCurrencySettings(data);
        
        // Get default currency
        const defaultRes = await fetch("/api/currency-settings/default");
        if (!defaultRes.ok) {
          throw new Error("Failed to fetch default currency");
        }
        const defaultData = await defaultRes.json();
        setCurrentCurrency(defaultData);
      } catch (err) {
        console.error("Error fetching currencies:", err);
        setError("Failed to load currency settings");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const setCurrency = async (currencyId: number) => {
    try {
      const res = await apiRequest("POST", `/api/currency-settings/${currencyId}/set-default`, {});
      if (!res.ok) {
        throw new Error("Failed to update currency");
      }
      const updatedCurrency = await res.json();
      setCurrentCurrency(updatedCurrency);
      
      // Refresh currency settings
      const settingsRes = await fetch("/api/currency-settings");
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setCurrencySettings(data);
      }
    } catch (err) {
      console.error("Error updating currency:", err);
      setError("Failed to update currency");
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
