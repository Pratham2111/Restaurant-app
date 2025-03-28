import { useState, useEffect } from "react";

/**
 * Hook to check if a media query matches
 * Used for responsive design breakpoints
 * @param {string} query - Media query string to match
 * @returns {boolean} Whether the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create media query to check
    const media = window.matchMedia(query);
    
    // Set the initial value
    setMatches(media.matches);
    
    // Handle media query change
    const handleChange = (event) => {
      setMatches(event.matches);
    };
    
    // Add event listener
    media.addEventListener("change", handleChange);
    
    // Clean up
    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Hook to check if screen is mobile size
 * @returns {boolean} Whether screen is mobile size
 */
export function useMobile() {
  return useMediaQuery("(max-width: 640px)");
}

/**
 * Hook to check if screen is tablet size
 * @returns {boolean} Whether screen is tablet size
 */
export function useTablet() {
  return useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
}

/**
 * Hook to check if screen is desktop size
 * @returns {boolean} Whether screen is desktop size
 */
export function useDesktop() {
  return useMediaQuery("(min-width: 1025px)");
}