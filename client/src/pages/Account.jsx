import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { formatCurrency } from "../lib/utils";
import { useToast } from "../hooks/use-toast.jsx";
import { useCurrency } from "../hooks/useCurrency";

/**
 * Account page for logged-in users
 */
function Account() {
  const { user, logout, isAdmin, isSubAdmin, loading } = useAuth();
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { formatAmount } = useCurrency();

  // Fetch user's orders and bookings
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        // Log user info to help with debugging
        console.log('Current user in Account page:', user);
        
        // Get token from localStorage
        const token = localStorage.getItem('la_mason_auth_token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        console.log('Using auth token for API requests:', token ? 'present' : 'not present');
        
        // Fetch orders - will be filtered on the server if authenticated
        const ordersResponse = await fetch('/api/orders', {
          headers,
          credentials: 'include' // Include cookies as well
        });
        
        if (ordersResponse.ok) {
          const userOrders = await ordersResponse.json();
          console.log('User orders from API:', userOrders);
          setOrders(userOrders);
        } else {
          console.error('Failed to fetch orders:', ordersResponse.status);
        }
        
        // Fetch bookings - will be filtered on the server if authenticated
        const bookingsResponse = await fetch('/api/reservations', {
          headers,
          credentials: 'include' // Include cookies as well
        });
        
        if (bookingsResponse.ok) {
          const userBookings = await bookingsResponse.json();
          console.log('User bookings from API:', userBookings);
          setBookings(userBookings);
        } else {
          console.error('Failed to fetch bookings:', bookingsResponse.status);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load your activity data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, toast]);

  // Redirect to login if not authenticated
  if (!loading && !user) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    // Just call logout - it will handle redirection via page refresh
    await logout();
    // No need to navigate here as we're using window.location.href in logout function
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Function to get status badge variant
  const getStatusVariant = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'processing':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Your Account</CardTitle>
            <CardDescription>View and manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Name</h3>
              <p className="text-lg">{user.name}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
              <p className="text-lg">{user.email}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Role</h3>
              <p className="text-lg capitalize">{user.role}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
            {isAdmin() && (
              <Button onClick={() => navigate("/admin")} variant="default">
                Admin Dashboard
              </Button>
            )}
            {isSubAdmin() && (
              <Button onClick={() => navigate("/admin")} variant="default">
                Staff Dashboard
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Orders/Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Your Activity</CardTitle>
            <CardDescription>Recent orders and bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="bookings">Reservations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="orders">
                {isLoading ? (
                  <p className="text-center py-6">Loading your orders...</p>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id || order._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Order #{order.id || order._id}</h4>
                          <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {order.createdAt ? formatDate(order.createdAt) : 'Date not available'}
                        </p>
                        <div className="border-t pt-2 mt-2">
                          <p className="text-sm font-medium">Items:</p>
                          <ul className="text-sm">
                            {order.items?.map((item, index) => (
                              <li key={index} className="flex justify-between">
                                <span>{item.quantity}x {item.name}</span>
                                <span>{format(item.price * item.quantity)}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                            <span>Total</span>
                            <span>{format(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-muted-foreground">
                    You haven't placed any orders yet.
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="bookings">
                {isLoading ? (
                  <p className="text-center py-6">Loading your reservations...</p>
                ) : bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id || booking._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Reservation #{booking.id || booking._id}</h4>
                          <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Date & Time:</p>
                            <p>{booking.date ? formatDate(booking.date) : 'Not available'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Guests:</p>
                            <p>{booking.guests}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Name:</p>
                            <p>{booking.name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Phone:</p>
                            <p>{booking.phone}</p>
                          </div>
                          {booking.specialRequests && (
                            <div className="col-span-2">
                              <p className="text-muted-foreground">Special Requests:</p>
                              <p>{booking.specialRequests}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-6 text-muted-foreground">
                    You haven't made any reservations yet.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-start space-x-4">
            <Button variant="outline" onClick={() => navigate("/order")}>Place an Order</Button>
            <Button variant="outline" onClick={() => navigate("/booking")}>Make a Reservation</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Account;