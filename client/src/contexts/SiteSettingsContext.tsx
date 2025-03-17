import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SiteSettings } from "@shared/schema";

interface SiteSettingsContextType {
  settings: SiteSettings | null;
  isLoading: boolean;
  translate: (key: string) => string;
  formatCurrency: (amount: number) => string;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: null,
  isLoading: true,
  translate: (key: string) => key,
  formatCurrency: (amount: number) => `$${amount.toFixed(2)}`,
});

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/settings"],
  });

  const translate = (key: string): string => {
    if (!settings?.translations || !settings.language) return key;
    const translations = settings.translations[settings.language];
    return translations?.[key] || key;
  };

  const formatCurrency = (amount: number): string => {
    if (!settings) return `$${amount.toFixed(2)}`;

    return new Intl.NumberFormat(settings.language, {
      style: 'currency',
      currency: settings.currency
    }).format(amount);
  };

  return (
    <SiteSettingsContext.Provider 
      value={{ 
        settings: settings || null,
        isLoading,
        translate,
        formatCurrency
      }}
    >
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}
