import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currencySymbol: string = "$"): string {
  return `${currencySymbol}${amount.toFixed(2)}`;
}

export function convertCurrency(amount: number, rate: number): number {
  return amount * rate;
}

export const timeSlots = [
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", 
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"
];

export const guestOptions = [
  { value: "1", label: "1 person" },
  { value: "2", label: "2 people" },
  { value: "3", label: "3 people" },
  { value: "4", label: "4 people" },
  { value: "5", label: "5 people" },
  { value: "6", label: "6 people" },
  { value: "7+", label: "7+ people" }
];

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getMinDate(): string {
  const today = new Date();
  return formatDate(today);
}
