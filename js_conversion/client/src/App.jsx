import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { CartProvider } from "./context/CartContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import { Toaster } from "./components/ui/toaster";

// Pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Booking from "./pages/Booking";
import Order from "./pages/Order";
import Contact from "./pages/Contact";
import NotFound from "./pages/not-found";

/**
 * Router component for handling page navigation
 */
function Router() {
  const [location] = useLocation();
  
  return (
    <Switch location={location}>
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
 * Main application component
 * Sets up providers and global context
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