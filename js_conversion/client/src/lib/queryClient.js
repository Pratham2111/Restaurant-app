import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const errorText = await res.text();
    let error;
    try {
      error = JSON.parse(errorText);
    } catch (e) {
      error = { message: errorText || "Network response was not ok" };
    }
    throw new Error(error.message || "Network response was not ok");
  }
  return res;
}

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
  
  if (mergedOptions.body && typeof mergedOptions.body !== "string") {
    mergedOptions.body = JSON.stringify(mergedOptions.body);
  }
  
  const res = await fetch(path, mergedOptions);
  await throwIfResNotOk(res);
  
  // Check if the response is empty or not
  const text = await res.text();
  if (!text) return null;
  
  return JSON.parse(text);
}

export const getQueryFn = (options = { on401: "throw" }) => {
  return async ({ queryKey }) => {
    const [path] = queryKey;
    try {
      return await apiRequest(path);
    } catch (e) {
      // Handle 401 errors
      if (e.message === "401" && options.on401 === "returnNull") {
        return null;
      }
      throw e;
    }
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn(),
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});