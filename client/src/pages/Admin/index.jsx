import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { BookText, Utensils, Calendar, MessageCircle, Star, ShoppingBag, DollarSign, Users } from "lucide-react";
import UserManagement from "./UserManagement";
import CategoryManagement from "./CategoryManagement";
import MenuManagement from "./MenuManagement";
import BookingManagement from "./BookingManagement";
import OrderManagement from "./OrderManagement";

/**
 * Admin Dashboard page
 */
function AdminDashboard() {
  const { user, isAdmin, isSubAdmin, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalOrders: "Loading...",
    totalBookings: "Loading...",
    totalMenuItems: "Loading..."
  });

  // Redirect to login if not authenticated
  if (!loading && !user) {
    navigate("/login");
    return null;
  }
  
  // Redirect to account if not admin or sub-admin
  if (!loading && !isAdmin() && !isSubAdmin()) {
    navigate("/account");
    return null;
  }

  // Define which tabs are visible based on user role
  const isTabVisible = (tabId) => {
    // Admin can access all tabs
    if (isAdmin()) return true;
    
    // Sub-admin can only access specific tabs
    if (isSubAdmin()) {
      return ["dashboard", "bookings", "orders"].includes(tabId);
    }
    
    return false;
  };

  // Fetch dashboard stats
  useEffect(() => {
    let isMounted = true;
    
    const getStats = async () => {
      if (!loading && user) {
        try {
          await fetchStats();
        } catch (error) {
          console.error("Error in stats fetching:", error);
        }
      }
    };
    
    getStats();
    
    return () => {
      isMounted = false;
    };
  }, [loading, user]);

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      // Fetch orders count
      try {
        const ordersResponse = await fetch("/api/orders");
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setStats(prev => ({ ...prev, totalOrders: ordersData.length }));
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setStats(prev => ({ ...prev, totalOrders: "Error" }));
      }

      // Fetch bookings count
      try {
        const bookingsResponse = await fetch("/api/reservations");
        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setStats(prev => ({ ...prev, totalBookings: bookingsData.length }));
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setStats(prev => ({ ...prev, totalBookings: "Error" }));
      }

      // Fetch menu items count
      try {
        const menuItemsResponse = await fetch("/api/menu-items");
        if (menuItemsResponse.ok) {
          const menuItemsData = await menuItemsResponse.json();
          setStats(prev => ({ ...prev, totalMenuItems: menuItemsData.length }));
        }
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setStats(prev => ({ ...prev, totalMenuItems: "Error" }));
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  // Handle tab switching
  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your restaurant</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => navigate("/account")} variant="outline" className="mr-2">
            Back to Account
          </Button>
          <Button onClick={() => navigate("/")} variant="outline">
            View Website
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Restaurant Management</CardTitle>
          <CardDescription>
            Welcome, {user.name}. You are logged in as {user.role}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 mb-6">
              {isTabVisible("dashboard") && (
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BookText className="h-4 w-4" />
                  <span className="hidden md:inline">Dashboard</span>
                </TabsTrigger>
              )}
              {isTabVisible("categories") && (
                <TabsTrigger value="categories" className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  <span className="hidden md:inline">Categories</span>
                </TabsTrigger>
              )}
              {isTabVisible("menu") && (
                <TabsTrigger value="menu" className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  <span className="hidden md:inline">Menu</span>
                </TabsTrigger>
              )}
              {isTabVisible("bookings") && (
                <TabsTrigger value="bookings" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden md:inline">Bookings</span>
                </TabsTrigger>
              )}
              {isTabVisible("contacts") && (
                <TabsTrigger value="contacts" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden md:inline">Contacts</span>
                </TabsTrigger>
              )}
              {isTabVisible("orders") && (
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="hidden md:inline">Orders</span>
                </TabsTrigger>
              )}
              {isTabVisible("testimonials") && (
                <TabsTrigger value="testimonials" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span className="hidden md:inline">Testimonials</span>
                </TabsTrigger>
              )}
              {isTabVisible("currency") && (
                <TabsTrigger value="currency" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="hidden md:inline">Currency</span>
                </TabsTrigger>
              )}
              {isTabVisible("users") && (
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden md:inline">Users</span>
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="dashboard" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary/10 rounded-lg p-4">
                  <h3 className="font-medium">Total Orders</h3>
                  <p className="text-2xl font-bold">{stats.totalOrders}</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-4">
                  <h3 className="font-medium">Total Bookings</h3>
                  <p className="text-2xl font-bold">{stats.totalBookings}</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-4">
                  <h3 className="font-medium">Total Menu Items</h3>
                  <p className="text-2xl font-bold">{stats.totalMenuItems}</p>
                </div>
              </div>
              <p className="mt-4 text-center text-muted-foreground">
                Welcome to the admin dashboard. Select a tab above to manage different aspects of your restaurant.
              </p>
            </TabsContent>
            
            <TabsContent value="categories" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Category Management</h2>
              <CategoryManagement />
            </TabsContent>
            
            <TabsContent value="menu" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Menu Management</h2>
              <MenuManagement />
            </TabsContent>
            
            <TabsContent value="bookings" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Booking Management</h2>
              <BookingManagement />
            </TabsContent>
            
            <TabsContent value="contacts" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
              <p className="text-center py-10 text-muted-foreground">
                Contact message management functionality will be implemented here.
              </p>
            </TabsContent>
            
            <TabsContent value="orders" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Order Management</h2>
              <OrderManagement />
            </TabsContent>
            
            <TabsContent value="testimonials" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Testimonial Management</h2>
              <p className="text-center py-10 text-muted-foreground">
                Testimonial management functionality will be implemented here.
              </p>
            </TabsContent>
            
            <TabsContent value="currency" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Currency Settings</h2>
              <p className="text-center py-10 text-muted-foreground">
                Currency management functionality will be implemented here.
              </p>
            </TabsContent>
            
            <TabsContent value="users" className="mt-6">
              <h2 className="text-2xl font-bold mb-4">User Management</h2>
              <UserManagement />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;