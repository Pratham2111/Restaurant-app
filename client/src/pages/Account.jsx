import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";

/**
 * Account page for logged-in users
 */
function Account() {
  const { user, logout, isAdmin, isSubAdmin, loading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to login if not authenticated
  if (!loading && !user) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading...</p>
      </div>
    );
  }

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
            <p className="text-center py-6 text-muted-foreground">
              Order history functionality coming soon.
            </p>
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