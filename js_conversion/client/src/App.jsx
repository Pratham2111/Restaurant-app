import { Route, Switch } from "wouter";

// Import pages
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Booking from "./pages/Booking";
import Order from "./pages/Order";
import Contact from "./pages/Contact";
import NotFound from "./pages/not-found";

/**
 * Router component for application navigation
 * Uses wouter for client-side routing
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
 * Wraps the router with necessary context providers
 */
function App() {
  return <Router />;
}

export default App;