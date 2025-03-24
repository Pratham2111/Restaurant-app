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
      const errorData = await res.json();
      errorMessage = errorData.message || `HTTP error ${res.status}`;
    } catch (e) {
      errorMessage = `HTTP error ${res.status}`;
    }
    throw new Error(errorMessage);
  }
}

/**
 * Makes an API request with proper error handling
 * @param {string} path - API path to request
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export async function apiRequest(path, options = {}) {
  // Default options
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
    // Use 'include' instead of 'same-origin' to ensure cookies are sent with cross-origin requests
    // This is important in development since Vite's dev server might use a different port
    credentials: "include",
  };

  // Combine default options with provided options
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  // Always ensure credentials are included
  fetchOptions.credentials = "include";

  console.log(`Making API request to: ${path}`, { 
    method: fetchOptions.method || 'GET',
    credentials: fetchOptions.credentials,
    withHeaders: Object.keys(fetchOptions.headers)
  });

  try {
    const res = await fetch(path, fetchOptions);
    
    console.log(`Response from ${path}:`, { 
      status: res.status, 
      ok: res.ok,
      headers: [...res.headers.entries()].reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {})
    });
    
    await throwIfResNotOk(res);
    
    // For no content responses
    if (res.status === 204) {
      return null;
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(`API request error for ${path}:`, error);
    throw error;
  }
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
      // Handle unauthorized differently if needed
      if (options.on401 === "redirect" && error.message.includes("401")) {
        window.location.href = "/login";
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
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
  },
});