import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date string for display.
 * Returns `fallback` (default "—") when the value is missing or not a valid date.
 *
 * @param dateStr - Any Date-parseable string (ISO, etc.)
 * @param fmt     - date-fns format string. Defaults to "MMM dd, yyyy"
 * @param fallback - String to return for null/undefined/invalid dates
 */
export function formatDate(
  dateStr: string | undefined | null,
  fmt = "MMM dd, yyyy",
  fallback = "—"
): string {
  if (!dateStr) return fallback;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? fallback : format(d, fmt);
}
