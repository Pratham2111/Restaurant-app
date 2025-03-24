import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { CartProvider } from "./context/CartContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { Toaster } from "./components/ui/toaster";
import App from "./App";
import "./index.css";

/**
 * Main entry point for the application
 * Sets up context providers and renders the root component
 */
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <CurrencyProvider>
      <CartProvider>
        <App />
        <Toaster />
      </CartProvider>
    </CurrencyProvider>
  </QueryClientProvider>
);