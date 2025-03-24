import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { CartProvider } from "./context/CartContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { queryClient } from "./lib/queryClient";

// Import pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Booking from "./pages/Booking";
import Order from "./pages/Order";
import Contact from "./pages/Contact";
import NotFound from "./pages/not-found";

/**
 * Router component
 * Handles all route configurations
 */
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      <Route path="/booking" component={Booking} />
      <Route path="/order" component={Order} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

/**
 * Main App component
 * Sets up providers and router
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  );
}

export default App;