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
 * @param dateStr  - Any Date-parseable string (ISO, etc.)
 * @param fmt      - date-fns format string. Defaults to "MMM dd, yyyy"
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

/**
 * Derives display initials from a Firebase user's display name or email.
 * Uses the first letter of each word in the display name (up to 2 letters),
 * falling back to the first letter of the email address.
 *
 * @param displayName - Firebase user.displayName (may be null)
 * @param email       - Firebase user.email (may be null)
 * @param fallback    - String returned when both inputs are empty
 */
export function getUserInitials(
  displayName?: string | null,
  email?: string | null,
  fallback = "U"
): string {
  if (displayName) {
    return displayName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email?.charAt(0).toUpperCase() || fallback;
}
