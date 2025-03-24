import React, { createContext, useState, useContext, useEffect } from "react";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast.jsx";

/**
 * Context for authentication-related functionality
 */
const AuthContext = createContext();

// Key for storing the token in localStorage
const TOKEN_STORAGE_KEY = 'la_mason_auth_token';

/**
 * Provider component for the AuthContext
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) || null);
  const { toast } = useToast();

  // Function to save token to localStorage
  const saveToken = (newToken) => {
    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      setToken(newToken);
      console.log('Auth token saved to localStorage');
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setToken(null);
      console.log('Auth token removed from localStorage');
    }
  };

  // Check for an existing session on initial load or when token changes
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('Checking auth status with token:', token ? 'exists' : 'none');
        
        // If we have a token, add it to the Authorization header
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const userData = await apiRequest("/api/auth/me", { headers });
        console.log('Auth status check successful, user data:', userData);
        setUser(userData.user);
      } catch (error) {
        console.log('Auth status check failed:', error.message);
        // Clear token if it's invalid or expired
        if (token && (error.message.includes('401') || error.message.includes('Invalid token'))) {
          console.log('Clearing invalid token');
          saveToken(null);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [token]);

  /**
   * Login a user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<boolean>} - Success status
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('Attempting to login with email:', email);
      
      const response = await apiRequest("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response received:', response);
      
      // Save token if it exists in the response
      if (response.token) {
        console.log('Token received with login response');
        saveToken(response.token);
      } else {
        console.log('No token received with login response - relying on cookie-based auth');
      }

      setUser(response.user);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
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
      console.log('Attempting to register user with email:', userData.email);
      
      const response = await apiRequest("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData), // The server will automatically set role to "customer"
      });

      console.log('Registration response received:', response);
      
      // Save token if it exists in the response
      if (response.token) {
        console.log('Token received with registration response');
        saveToken(response.token);
      } else {
        console.log('No token received with registration response - relying on cookie-based auth');
      }

      // Auto-login after successful registration
      setUser(response.user);
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created!",
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
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
      console.log('Attempting to logout user');
      
      // First set user to null to immediately update UI
      setUser(null);
      
      // Clear token from localStorage
      saveToken(null);
      
      // Then call the server to clear the cookie
      await apiRequest("/api/auth/logout", {
        method: "POST",
        // Adding credentials include to ensure cookies are sent with the request
        credentials: "include",
      });
      
      console.log('Logout successful, user data cleared');
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      
      // Force a page refresh to ensure all state is cleared
      // Comment out this line if you want to handle navigation without refresh
      // window.location.href = '/';
      
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if the server request fails, ensure user is logged out locally
      setUser(null);
      saveToken(null);
      
      toast({
        title: "Logout Warning",
        description: "You've been logged out locally, but there was an issue with the server.",
        variant: "destructive",
      });
      
      return false;
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
   * Check if the current user is a subadmin
   * @returns {boolean} - Whether the user is a subadmin
   */
  const isSubAdmin = () => {
    return user?.role === "subadmin";
  };

  /**
   * Check if the current user has staff privileges (admin or subadmin)
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