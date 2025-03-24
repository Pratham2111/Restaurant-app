import React from "react";
import { useCurrency } from "../../hooks/useCurrency";

/**
 * Currency selector component
 */
function CurrencySelector() {
  const { currency, changeCurrency, currencyOptions, isLoading } = useCurrency();

  const handleCurrencyChange = (e) => {
    const selectedCode = e.target.value;
    const selectedCurrency = currencyOptions.find(
      (option) => option.value === selectedCode
    );
    
    if (selectedCurrency) {
      changeCurrency(selectedCurrency);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="px-2 py-1 text-xs bg-secondary rounded-md animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <select
      className="text-sm border-border rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
      value={currency.value}
      onChange={handleCurrencyChange}
      aria-label="Select currency"
    >
      {currencyOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.symbol} {option.label}
        </option>
      ))}
    </select>
  );
}

export default CurrencySelector;