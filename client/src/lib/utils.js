import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string and merges Tailwind classes
 * @param  {...any} inputs - Class name inputs
 * @returns {string} Merged class names
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric amount to a currency string
 * @param {number} amount - The amount to format
 * @param {string} currencySymbol - The currency symbol (default: "$")
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currencySymbol = "$") {
  return `${currencySymbol}${amount.toFixed(2)}`;
}

/**
 * Generate a base64 data URI of a placeholder image with text
 * @param {string} text - Text to display on the placeholder
 * @param {number} width - Width of the image
 * @param {number} height - Height of the image
 * @returns {string} Base64 data URI of the image
 */
export function generatePlaceholderImage(text = "Image", width = 400, height = 300) {
  // Return a simple data URI for a colored rectangle with text
  return `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect fill='%23cccccc' width='${width}' height='${height}'/%3E%3Ctext fill='%23666666' font-family='sans-serif' font-size='24' font-weight='bold' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E${text}%3C/text%3E%3C/svg%3E`;
}

/**
 * Converts an amount from one currency to another
 * @param {number} amount - The amount to convert
 * @param {number} rate - The conversion rate
 * @returns {number} Converted amount
 */
export function convertCurrency(amount, rate) {
  return amount * rate;
}

/**
 * Available time slots for booking
 */
export const timeSlots = [
  "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", 
  "2:00 PM", "2:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", 
  "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"
];

/**
 * Guest options for booking
 */
export const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * Formats a date object to a string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

/**
 * Gets the minimum date for bookings (today)
 * @returns {string} Minimum date in YYYY-MM-DD format
 */
export function getMinDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

/**
 * Truncates text to a specified length
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Generates a random ID
 * @returns {string} Random ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Debounces a function call
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validates a phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether phone number is valid
 */
export function isValidPhone(phone) {
  const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return re.test(phone);
}

/**
 * Gets current browser viewport width
 * @returns {number} Viewport width
 */
export function getViewportWidth() {
  return window.innerWidth || document.documentElement.clientWidth;
}

/**
 * Formats a number with comma separators
 * @param {number} number - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Capitalizes the first letter of each word in a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalizeWords(str) {
  if (!str) return "";
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}