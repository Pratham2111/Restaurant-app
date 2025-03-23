import { useContext } from "react";
import { CurrencyContext } from "@/context/CurrencyContext";
import { convertCurrency, formatCurrency } from "@/lib/utils";

export const useCurrency = () => {
  const { currentCurrency, currencySettings, setCurrency } = useContext(CurrencyContext);

  const convertPrice = (price: number | string) => {
    if (typeof price === 'string') {
      price = parseFloat(price);
    }
    return convertCurrency(price, currentCurrency.rate);
  };

  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') {
      price = parseFloat(price);
    }
    const convertedPrice = convertPrice(price);
    return formatCurrency(convertedPrice, currentCurrency.symbol);
  };

  return {
    currentCurrency,
    currencySettings,
    convertPrice,
    formatPrice,
    setCurrency
  };
};
