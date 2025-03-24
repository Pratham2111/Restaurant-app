import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { Layout } from "./components/layout/Layout";
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

// Router component to handle page routing
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

// Main application component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <CartProvider>
          <Layout>
            <Router />
          </Layout>
          <Toaster />
        </CartProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  );
}

export default App;