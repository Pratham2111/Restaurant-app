import { useState, useEffect } from "react";

/**
 * Hook to check if a media query matches
 * @param {string} query - Media query string to match
 * @returns {boolean} Whether the media query matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    } 
    // Legacy browsers
    else {
      media.addListener(handleChange);
      return () => media.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

/**
 * Hook to check if screen is mobile size
 * @returns {boolean} Whether screen is mobile size
 */
export function useMobile() {
  return useMediaQuery("(max-width: 639px)");
}

/**
 * Hook to check if screen is tablet size
 * @returns {boolean} Whether screen is tablet size
 */
export function useTablet() {
  return useMediaQuery("(min-width: 640px) and (max-width: 1023px)");
}

/**
 * Hook to check if screen is desktop size
 * @returns {boolean} Whether screen is desktop size
 */
export function useDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}