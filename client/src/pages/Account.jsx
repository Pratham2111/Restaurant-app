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
import { apiRequest } from "../lib/queryClient";

/**
 * Account page for logged-in users
 */
function Account() {
  const { user, logout, isAdmin, isSubAdmin, loading, setUser } = useAuth();
  const [, navigate] = useLocation();
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { formatAmount } = useCurrency();
  
  // Profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setProfileData(prevData => ({
        ...prevData,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

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
  
  // Handle profile form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for the field
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validate profile form
  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileData.name) {
      errors.name = "Name is required";
    }
    
    if (!profileData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      errors.email = "Email is invalid";
    }
    
    // If changing password, validate password fields
    if (profileData.newPassword) {
      if (!profileData.currentPassword) {
        errors.currentPassword = "Current password is required";
      }
      
      if (profileData.newPassword.length < 6) {
        errors.newPassword = "Password must be at least 6 characters";
      }
      
      if (profileData.newPassword !== profileData.confirmPassword) {
        errors.confirmPassword = "Passwords don't match";
      }
    }
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) {
      return;
    }
    
    setIsSubmittingProfile(true);
    
    try {
      // Prepare data to send
      const updateData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
      };
      
      // Add password fields if updating password
      if (profileData.newPassword) {
        updateData.currentPassword = profileData.currentPassword;
        updateData.newPassword = profileData.newPassword;
      }
      
      // Send update request
      const result = await apiRequest(`/api/users/${user.id || user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData),
        credentials: 'include'
      });
      
      // Update user in context
      if (result && setUser) {
        setUser({
          ...user,
          name: result.name,
          email: result.email,
          phone: result.phone,
        });
      }
      
      // Reset password fields
      setProfileData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      
      // Show success message
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Show error message
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingProfile(false);
    }
  };

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
          
          {isEditing ? (
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="font-medium text-sm text-muted-foreground block mb-1">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      profileErrors.name ? "border-red-500" : "border-input"
                    } bg-background`}
                  />
                  {profileErrors.name && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.name}</p>
                  )}
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="font-medium text-sm text-muted-foreground block mb-1">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      profileErrors.email ? "border-red-500" : "border-input"
                    } bg-background`}
                  />
                  {profileErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{profileErrors.email}</p>
                  )}
                </div>
                
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="font-medium text-sm text-muted-foreground block mb-1">Phone (optional)</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  />
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-3">Change Password (optional)</h3>
                  
                  {/* Current Password */}
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="font-medium text-sm text-muted-foreground block mb-1">Current Password</label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={profileData.currentPassword}
                      onChange={handleProfileChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        profileErrors.currentPassword ? "border-red-500" : "border-input"
                      } bg-background`}
                    />
                    {profileErrors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.currentPassword}</p>
                    )}
                  </div>
                  
                  {/* New Password */}
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="font-medium text-sm text-muted-foreground block mb-1">New Password</label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={profileData.newPassword}
                      onChange={handleProfileChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        profileErrors.newPassword ? "border-red-500" : "border-input"
                      } bg-background`}
                    />
                    {profileErrors.newPassword && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.newPassword}</p>
                    )}
                  </div>
                  
                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="font-medium text-sm text-muted-foreground block mb-1">Confirm New Password</label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={profileData.confirmPassword}
                      onChange={handleProfileChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        profileErrors.confirmPassword ? "border-red-500" : "border-input"
                      } bg-background`}
                    />
                    {profileErrors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{profileErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button 
                  type="submit" 
                  disabled={isSubmittingProfile}
                  className="flex items-center"
                >
                  {isSubmittingProfile ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Name</h3>
                  <p className="text-lg">{user.name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                  <p className="text-lg">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">Phone</h3>
                    <p className="text-lg">{user.phone}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Role</h3>
                  <p className="text-lg capitalize">{user.role}</p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div className="space-x-3">
                  <Button variant="outline" onClick={handleLogout}>Logout</Button>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                </div>
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
            </>
          )}
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
                                <span>{formatAmount(item.price * item.quantity)}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                            <span>Total</span>
                            <span>{formatAmount(order.total)}</span>
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