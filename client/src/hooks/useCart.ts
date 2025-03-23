import { useContext } from "react";
import { CartContext } from "@/context/CartContext";
import { useCurrency } from "@/hooks/useCurrency";

export const useCart = () => {
  const cart = useContext(CartContext);
  const { formatPrice } = useCurrency();

  // Add formatted price functions
  const getFormattedSubtotal = () => formatPrice(cart.getSubtotal());
  const getFormattedDeliveryFee = () => formatPrice(cart.getDeliveryFee());
  const getFormattedTax = () => formatPrice(cart.getTax());
  const getFormattedTotal = () => formatPrice(cart.getTotal());

  return {
    ...cart,
    getFormattedSubtotal,
    getFormattedDeliveryFee,
    getFormattedTax,
    getFormattedTotal
  };
};
