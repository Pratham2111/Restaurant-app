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
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's name
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @returns {Promise<boolean>} - Success status
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData), // The server will automatically set role to "customer"
      });

      // Auto-login after successful registration
      setUser(response.user);
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created!",
      });
      return true;
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message || "Could not create account. Please try again.",
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
      register,
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