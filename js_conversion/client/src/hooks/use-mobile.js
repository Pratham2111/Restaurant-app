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
    // Create a MediaQueryList object
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);
    
    // Define event listener function
    const handleChange = (event) => {
      setMatches(event.matches);
    };
    
    // Add event listener
    mediaQuery.addEventListener("change", handleChange);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);
  
  return matches;
}

/**
 * Hook to check if screen is mobile size
 * @returns {boolean} Whether screen is mobile size
 */
export function useMobile() {
  return useMediaQuery("(max-width: 767px)");
}

/**
 * Hook to check if screen is tablet size
 * @returns {boolean} Whether screen is tablet size
 */
export function useTablet() {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
}

/**
 * Hook to check if screen is desktop size
 * @returns {boolean} Whether screen is desktop size
 */
export function useDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}