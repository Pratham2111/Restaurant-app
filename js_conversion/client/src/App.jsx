import React from "react";
import { Route, Switch } from "wouter";
import { Layout } from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Booking from "@/pages/Booking";
import Order from "@/pages/Order";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/not-found";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/CartContext";
import { CurrencyProvider } from "@/context/CurrencyContext";

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <CartProvider>
          <Layout>
            <Router />
            <Toaster />
          </Layout>
        </CartProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  );
}

export default App;