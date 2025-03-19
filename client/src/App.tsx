import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { ParallaxProvider } from 'react-scroll-parallax';
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";
import { Navbar } from "./components/ui/navbar";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";
import { AdminRoute } from "./components/auth/AdminRoute";

import Home from "@/pages/home";
import Menu from "@/pages/menu";
import Booking from "@/pages/booking";
import Cart from "@/pages/cart";
import Events from "@/pages/events";
import TableManagement from "@/pages/admin/table-management";
import MenuManagement from "@/pages/admin/menu-management";
import EventsManagement from "@/pages/admin/events-management";
import UserManagement from "@/pages/admin/user-management";
import Dashboard from "@/pages/admin/dashboard";
import BookingManagement from "@/pages/admin/booking-management";
import SiteSettings from "@/pages/admin/site-settings";
import OrderManagement from "@/pages/admin/order-management";
import PolicyPage from "@/pages/admin/policies";
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

          {/* Admin Routes */}
          <Route path="/admin/dashboard">
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          </Route>
          <Route path="/admin/tables">
            <AdminRoute>
              <TableManagement />
            </AdminRoute>
          </Route>
          <Route path="/admin/menu">
            <AdminRoute>
              <MenuManagement />
            </AdminRoute>
          </Route>
          <Route path="/admin/events">
            <AdminRoute>
              <EventsManagement />
            </AdminRoute>
          </Route>
          <Route path="/admin/users">
            <AdminRoute>
              <UserManagement />
            </AdminRoute>
          </Route>
          <Route path="/admin/orders">
            <AdminRoute>
              <OrderManagement />
            </AdminRoute>
          </Route>
          <Route path="/admin/settings">
            <AdminRoute>
              <SiteSettings />
            </AdminRoute>
          </Route>
          <Route path="/admin/settings/policies/:type">
            <AdminRoute>
              <PolicyPage />
            </AdminRoute>
          </Route>
          <Route path="/admin/booking-management">
            <AdminRoute>
              <BookingManagement />
            </AdminRoute>
          </Route>

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
      <SiteSettingsProvider>
        <ParallaxProvider>
          <Router />
          <Toaster />
        </ParallaxProvider>
      </SiteSettingsProvider>
    </QueryClientProvider>
  );
}