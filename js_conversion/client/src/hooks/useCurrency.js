import { useContext } from "react";
import { CurrencyContext } from "@/context/CurrencyContext";

export const useCurrency = () => {
  return useContext(CurrencyContext);
};