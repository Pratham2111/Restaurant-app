import { QueryClient } from "@tanstack/react-query";

/**
 * Checks if a Response is okay, throws an error if not
 * Used for API error handling
 * @param {Response} res - The Response object
 * @throws {Error} If the response is not okay
 */
async function throwIfResNotOk(res) {
  if (!res.ok) {
    let errorText;
    try {
      const data = await res.json();
      errorText = data.message || data.error || res.statusText;
    } catch (e) {
      errorText = res.statusText;
    }
    
    const error = new Error(errorText);
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
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  if (mergedOptions.body && typeof mergedOptions.body !== "string") {
    mergedOptions.body = JSON.stringify(mergedOptions.body);
  }
  
  const res = await fetch(path, mergedOptions);
  await throwIfResNotOk(res);
  
  // Check if there's content to parse
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const contentLength = res.headers.get("content-length");
    if (contentLength === "0") return null;
    return res.json();
  }
  
  return null;
}

/**
 * Creates a query function with unauthorized behavior options
 * @param {Object} options - Options for handling 401 responses
 * @returns {Function} Query function for TanStack Query
 */
export const getQueryFn = (options = { on401: "throw" }) => {
  return async ({ queryKey }) => {
    const [path] = queryKey;
    
    try {
      return await apiRequest(path);
    } catch (error) {
      if (error.status === 401 && options.on401 === "returnNull") {
        return null;
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
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});