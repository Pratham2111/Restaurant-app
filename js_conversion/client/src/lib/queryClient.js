import { QueryClient } from "@tanstack/react-query";

/**
 * Checks if a Response is okay, throws an error if not
 * Used for API error handling
 * @param {Response} res - The Response object
 * @throws {Error} If the response is not okay
 */
async function throwIfResNotOk(res) {
  if (!res.ok) {
    let errorText = "";
    try {
      const errorData = await res.json();
      errorText = errorData.message || errorData.error || res.statusText;
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
  
  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  // Convert body to JSON string if needed
  if (mergedOptions.body && typeof mergedOptions.body === "object") {
    mergedOptions.body = JSON.stringify(mergedOptions.body);
  }
  
  const res = await fetch(path, mergedOptions);
  await throwIfResNotOk(res);
  
  // Return null for 204 No Content
  if (res.status === 204) {
    return null;
  }
  
  return res.json();
}

/**
 * Creates a query function with unauthorized behavior options
 * @param {Object} options - Options for handling 401 responses
 * @returns {Function} Query function for TanStack Query
 */
export const getQueryFn = (options = { on401: "throw" }) => {
  return async ({ queryKey }) => {
    let [path, ...params] = queryKey;
    
    try {
      // If there are parameters, append them to the path as query string
      if (params && params.length > 0 && params[0] !== undefined) {
        if (path.includes("/")) {
          path = path.replace(/\/\d+$/, `/${params[0]}`);
        } else {
          const queryParams = new URLSearchParams(params[0]);
          path = `${path}?${queryParams}`;
        }
      }
      
      return await apiRequest(path);
    } catch (error) {
      // Handle unauthorized errors according to options
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
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});