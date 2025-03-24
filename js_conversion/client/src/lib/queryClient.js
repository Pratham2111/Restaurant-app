import { QueryClient } from "@tanstack/react-query";

/**
 * Checks if a Response is okay, throws an error if not
 * Used for API error handling
 * @param {Response} res - The Response object
 * @throws {Error} If the response is not okay
 */
async function throwIfResNotOk(res) {
  if (!res.ok) {
    // Try to parse error message from response
    let errorMessage;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || `HTTP error ${res.status}`;
    } catch (e) {
      errorMessage = `HTTP error ${res.status}`;
    }
    
    const error = new Error(errorMessage);
    error.status = res.status;
    throw error;
  }
}

/**
 * Makes an API request with proper error handling
 * @param {string} path - API path to request
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export async function apiRequest(path, options = {}) {
  // Set default headers if not provided
  const headers = options.headers || {};
  if (!headers["Content-Type"] && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  
  // Set default method
  const method = options.method || "GET";
  
  // Stringify body if it's an object and not FormData
  if (typeof options.body === "object" && !(options.body instanceof FormData)) {
    options.body = JSON.stringify(options.body);
  }
  
  // Make the request
  const res = await fetch(path, {
    ...options,
    headers,
    method
  });
  
  // Check for errors
  await throwIfResNotOk(res);
  
  // If no content, return null
  if (res.status === 204) {
    return null;
  }
  
  // Parse the response based on content type
  const contentType = res.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  
  return res.text();
}

/**
 * Creates a query function with unauthorized behavior options
 * @param {Object} options - Options for handling 401 responses
 * @returns {Function} Query function for TanStack Query
 */
export const getQueryFn = (options = { on401: "throw" }) => {
  return async ({ queryKey }) => {
    let path = Array.isArray(queryKey) ? queryKey[0] : queryKey;
    
    try {
      return await apiRequest(path);
    } catch (error) {
      // Handle 401 Unauthorized based on options
      if (error.status === 401) {
        if (options.on401 === "returnNull") {
          return null;
        }
      }
      throw error;
    }
  };
};

/**
 * Configure QueryClient with sensible defaults
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn(),
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 401, 403, 404, or 500
        if (error.status === 401 || error.status === 403 || error.status === 404 || error.status === 500) {
          return false;
        }
        
        // Retry other errors up to 3 times
        return failureCount < 3;
      }
    }
  }
});