import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { Navbar } from "./components/ui/navbar";

import Home from "@/pages/home";
import Menu from "@/pages/menu";
import Booking from "@/pages/booking";
import Cart from "@/pages/cart";
import TableManagement from "@/pages/admin/table-management";
import MenuManagement from "@/pages/admin/menu-management";
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
        <div className="max-w-[1440px] mx-auto px-4">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/menu" component={Menu} />
            <Route path="/booking" component={Booking} />
            <Route path="/cart" component={Cart} />
            <Route path="/admin/tables" component={TableManagement} />
            <Route path="/admin/menu" component={MenuManagement} />
            <Route path="/admin/dashboard" component={Dashboard} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/account" component={Account} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}