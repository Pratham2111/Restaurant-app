import { Route, Switch } from "wouter";
import { Toaster } from "./components/ui/toaster";
import { CurrencyProvider } from "./context/CurrencyContext";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Booking from "./pages/Booking";
import Order from "./pages/Order";
import Contact from "./pages/Contact";
import NotFound from "./pages/not-found";

/**
 * Router component to handle application routing
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
 */
function App() {
  return (
    <CurrencyProvider>
      <CartProvider>
        <Router />
        <Toaster />
      </CartProvider>
    </CurrencyProvider>
  );
}

export default App;