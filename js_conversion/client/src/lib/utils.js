import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currencySymbol = "$") {
  return `${currencySymbol}${parseFloat(amount).toFixed(2)}`;
}

export function convertCurrency(amount, rate) {
  return parseFloat(amount) * rate;
}

export const timeSlots = [
  "11:00 AM", "11:30 AM", 
  "12:00 PM", "12:30 PM", 
  "1:00 PM", "1:30 PM", 
  "2:00 PM", "2:30 PM", 
  "5:00 PM", "5:30 PM", 
  "6:00 PM", "6:30 PM", 
  "7:00 PM", "7:30 PM", 
  "8:00 PM", "8:30 PM", 
  "9:00 PM"
];

export const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export function formatDate(date) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

export function getMinDate() {
  const today = new Date();
  return today.toISOString().split('T')[0]; // returns YYYY-MM-DD for today
}