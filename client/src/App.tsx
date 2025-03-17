import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { ParallaxProvider } from 'react-scroll-parallax';
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { Navbar } from "./components/ui/navbar";

import Home from "@/pages/home";
import Menu from "@/pages/menu";
import Booking from "@/pages/booking";
import Cart from "@/pages/cart";
import Events from "@/pages/events";
import TableManagement from "@/pages/admin/table-management";
import MenuManagement from "@/pages/admin/menu-management";
import EventsManagement from "@/pages/admin/events-management";
import Dashboard from "@/pages/admin/dashboard";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Account from "@/pages/account";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/menu" component={Menu} />
          <Route path="/booking" component={Booking} />
          <Route path="/cart" component={Cart} />
          <Route path="/events" component={Events} />
          <Route path="/admin/tables" component={TableManagement} />
          <Route path="/admin/menu" component={MenuManagement} />
          <Route path="/admin/events" component={EventsManagement} />
          <Route path="/admin/dashboard" component={Dashboard} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/account" component={Account} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ParallaxProvider>
        <Router />
        <Toaster />
      </ParallaxProvider>
    </QueryClientProvider>
  );
}