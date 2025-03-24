import { QueryClient } from "@tanstack/react-query";

/**
 * Checks if a Response is okay, throws an error if not
 * @param {Response} res - The Response object
 * @throws {Error} If the response is not okay
 */
async function throwIfResNotOk(res) {
  if (!res.ok) {
    let errorText;
    try {
      const errorData = await res.json();
      errorText = errorData.message || "An unknown error occurred";
    } catch (e) {
      errorText = "Failed to parse error response";
    }
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }
}

/**
 * Makes an API request with proper error handling
 * @param {string} path - API path to request
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
export async function apiRequest(path, options = {}) {
  try {
    const res = await fetch(path, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    await throwIfResNotOk(res);

    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    }

    return await res.text();
  } catch (error) {
    console.error(`API request failed for ${path}:`, error);
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
    try {
      const [path] = queryKey;
      return await apiRequest(path);
    } catch (error) {
      if (
        error.message &&
        error.message.includes("API Error (401)") &&
        options.on401 === "returnNull"
      ) {
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
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      queryFn: getQueryFn(),
    },
  },
});