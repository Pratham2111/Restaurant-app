import { useEffect, useState } from "react";

/**
 * Hook to check if a media query matches
 * @param {string} query - Media query string to match
 * @returns {boolean} Whether the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Initial check
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    
    // Update state when media query changes
    const handleChange = (event) => {
      setMatches(event.matches);
    };
    
    // Add event listener
    media.addEventListener("change", handleChange);
    
    // Clean up
    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, [matches, query]);
  
  return matches;
}

/**
 * Hook to check if screen is mobile size
 * @returns {boolean} Whether screen is mobile size
 */
export function useMobile() {
  return useMediaQuery("(max-width: 768px)");
}

/**
 * Hook to check if screen is tablet size
 * @returns {boolean} Whether screen is tablet size
 */
export function useTablet() {
  return useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
}

/**
 * Hook to check if screen is desktop size
 * @returns {boolean} Whether screen is desktop size
 */
export function useDesktop() {
  return useMediaQuery("(min-width: 1025px)");
}