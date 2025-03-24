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
 * Converts an amount from one currency to another
 * @param {number} amount - The amount to convert
 * @param {number} rate - The conversion rate
 * @returns {number} Converted amount
 */
export function convertCurrency(amount, rate) {
  return parseFloat((amount * rate).toFixed(2));
}

/**
 * Available time slots for booking
 */
export const timeSlots = [
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", 
  "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", 
  "20:00", "20:30", "21:00", "21:30"
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
  return date.toISOString().split('T')[0];
}

/**
 * Gets the minimum date for bookings (today)
 * @returns {string} Minimum date in YYYY-MM-DD format
 */
export function getMinDate() {
  return formatDate(new Date());
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
  return `${text.substring(0, maxLength)}...`;
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
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether phone number is valid
 */
export function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-+()]{7,15}$/;
  return phoneRegex.test(phone);
}

/**
 * Gets current browser viewport width
 * @returns {number} Viewport width
 */
export function getViewportWidth() {
  return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
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
  return str.replace(/\b\w/g, char => char.toUpperCase());
}