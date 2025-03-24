import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string and merges Tailwind classes
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
  return +(amount * rate).toFixed(2);
}

/**
 * Available time slots for booking
 */
export const timeSlots = [
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
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
  return date.toISOString().split("T")[0];
}

/**
 * Gets the minimum date for bookings (today)
 * @returns {string} Minimum date in YYYY-MM-DD format
 */
export function getMinDate() {
  const today = new Date();
  return formatDate(today);
}