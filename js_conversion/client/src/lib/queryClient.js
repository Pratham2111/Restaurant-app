import { QueryClient } from "@tanstack/react-query";

/**
 * Checks if a Response is okay, throws an error if not
 * @param {Response} res - The Response object
 * @throws {Error} If the response is not okay
 */
async function throwIfResNotOk(res) {
  if (!res.ok) {
    let errorMessage;
    try {
      const data = await res.json();
      errorMessage = data.message || data.error || res.statusText;
    } catch (e) {
      errorMessage = res.statusText;
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
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  
  await throwIfResNotOk(res);
  
  return res.json();
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
      refetchOnWindowFocus: false
    }
  }
});