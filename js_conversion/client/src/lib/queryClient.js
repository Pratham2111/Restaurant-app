import { QueryClient } from "@tanstack/react-query";

/**
 * Checks if a Response is okay, throws an error if not
 * Used for API error handling
 * @param {Response} res - The Response object
 * @throws {Error} If the response is not okay
 */
async function throwIfResNotOk(res) {
  if (!res.ok) {
    let errorMessage;

    try {
      const data = await res.json();
      errorMessage = data.message || data.error || `Error: ${res.status} ${res.statusText}`;
    } catch (e) {
      errorMessage = `Error: ${res.status} ${res.statusText}`;
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
  const res = await fetch(path, options);
  
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
    try {
      const [path, ...params] = Array.isArray(queryKey) ? queryKey : [queryKey];
      
      // Build URL with params if needed
      let url = path;
      if (params.length > 0 && typeof params[params.length - 1] === "object") {
        const queryParams = params[params.length - 1];
        const searchParams = new URLSearchParams();
        
        for (const [key, value] of Object.entries(queryParams)) {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString());
          }
        }
        
        const queryString = searchParams.toString();
        if (queryString) {
          url = `${url}?${queryString}`;
        }
      } else if (params.length > 0) {
        // Handle path parameters like /api/endpoint/:id/subresource
        url = [path, ...params].join("/");
      }
      
      return apiRequest(url);
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
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      queryFn: getQueryFn(),
    },
  },
});