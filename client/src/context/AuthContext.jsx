import React, { createContext, useState, useContext, useEffect } from "react";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast.jsx";

/**
 * Context for authentication-related functionality
 */
const AuthContext = createContext();

/**
 * Provider component for the AuthContext
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check for an existing session on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await apiRequest("/api/auth/me");
        setUser(userData.user);
      } catch (error) {
        // User is not logged in, or token expired
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Login a user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<boolean>} - Success status
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      setUser(response.user);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      return true;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout the current user
   */
  const logout = async () => {
    try {
      setLoading(true);
      await apiRequest("/api/auth/logout", {
        method: "POST",
      });
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if the current user is an admin
   * @returns {boolean} - Whether the user is an admin
   */
  const isAdmin = () => {
    return user?.role === "admin";
  };

  /**
   * Check if the current user is a sub-admin
   * @returns {boolean} - Whether the user is a sub-admin
   */
  const isSubAdmin = () => {
    return user?.role === "sub-admin";
  };

  /**
   * Check if the current user has staff privileges (admin or sub-admin)
   * @returns {boolean} - Whether the user has staff privileges
   */
  const isStaff = () => {
    return isAdmin() || isSubAdmin();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      login,
      logout,
      isAdmin,
      isSubAdmin,
      isStaff
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook for accessing auth functionality
 * @returns {Object} Auth context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}