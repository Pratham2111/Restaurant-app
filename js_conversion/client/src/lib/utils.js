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
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // Using USD format but replacing symbol
    minimumFractionDigits: 2,
  });
  
  // Format the amount and replace the currency symbol
  const formatted = formatter.format(amount);
  const usdSymbol = "$";
  
  if (formatted.startsWith(usdSymbol)) {
    return formatted.replace(usdSymbol, currencySymbol);
  }
  
  return formatted;
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
  "2:00 PM", "2:30 PM", "3:00 PM", "5:00 PM", "5:30 PM", 
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", 
  "8:30 PM", "9:00 PM"
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
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Gets the minimum date for bookings (today)
 * @returns {string} Minimum date in YYYY-MM-DD format
 */
export function getMinDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}