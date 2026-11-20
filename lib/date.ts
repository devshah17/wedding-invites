import { parseISO, isValid } from 'date-fns';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

export const DEFAULT_TIMEZONE = 'Asia/Kolkata';

/**
 * Parses a date or datetime string into a Date object correctly aligned with the target timezone.
 * Handles ISO strings with offset, ISO strings without offset, and plain date strings (YYYY-MM-DD).
 */
export function parseWeddingDate(
  dateStr: string,
  timezone: string = DEFAULT_TIMEZONE
): Date {
  if (!dateStr) {
    return new Date(0);
  }

  const trimmed = dateStr.trim();

  // If date-only string (e.g. '2027-02-15')
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    // Interpret at start of day in the specified timezone
    return fromZonedTime(`${trimmed}T00:00:00`, timezone);
  }

  // If ISO string without timezone offset or Z (e.g. '2027-02-15T10:00:00')
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(trimmed)) {
    return fromZonedTime(trimmed, timezone);
  }

  // Standard ISO string with offset or Z
  try {
    const parsed = parseISO(trimmed);
    if (isValid(parsed)) {
      return parsed;
    }
  } catch {
    // Fall back to native Date
  }

  const fallback = new Date(trimmed);
  return isValid(fallback) ? fallback : new Date(0);
}

/**
 * Calculates remaining countdown time until target wedding date.
 * Returns days, hours, minutes, seconds. All zeroes if target date has passed.
 */
export function getCountdown(
  targetDate: string,
  timezone: string = DEFAULT_TIMEZONE
): { days: number; hours: number; minutes: number; seconds: number } {
  const target = parseWeddingDate(targetDate, timezone);
  const now = new Date();

  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

/**
 * Formats a wedding date string as 'Saturday, 15th February 2027'
 */
export function formatWeddingDate(
  dateStr: string,
  timezone: string = DEFAULT_TIMEZONE
): string {
  const date = parseWeddingDate(dateStr, timezone);
  return formatInTimeZone(date, timezone, 'EEEE, do MMMM yyyy');
}

/**
 * Formats an event date string as '15 Feb 2027'
 */
export function formatEventDate(
  dateStr: string,
  timezone: string = DEFAULT_TIMEZONE
): string {
  const date = parseWeddingDate(dateStr, timezone);
  return formatInTimeZone(date, timezone, 'd MMM yyyy');
}

/**
 * Formats a time string into standard 12-hour format with AM/PM (e.g. '10:00 AM')
 */
export function formatEventTime(
  timeStr: string,
  timezone: string = DEFAULT_TIMEZONE
): string {
  if (!timeStr) return '';
  const trimmed = timeStr.trim();

  // If timeStr is a full ISO datetime string
  if (trimmed.includes('T')) {
    try {
      const parsed = parseWeddingDate(trimmed, timezone);
      if (isValid(parsed)) {
        return formatInTimeZone(parsed, timezone, 'hh:mm a');
      }
    } catch {
      // Fall through to regex handling
    }
  }

  // If already 12-hour format with AM/PM (e.g. '10:00 AM', '02:30 pm')
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
  if (match12) {
    const hours = match12[1].padStart(2, '0');
    const minutes = match12[2];
    const ampm = match12[3].toUpperCase();
    return `${hours}:${minutes} ${ampm}`;
  }

  // If 24-hour format (e.g. '18:30', '10:00')
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match24) {
    let hours = parseInt(match24[1], 10);
    const minutes = match24[2];
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  }

  return timeStr;
}

/**
 * Checks whether the given wedding date has already passed.
 */
export function isWeddingPassed(
  dateStr: string,
  timezone: string = DEFAULT_TIMEZONE
): boolean {
  const target = parseWeddingDate(dateStr, timezone);
  return new Date().getTime() >= target.getTime();
}

/**
 * Gets the day of the week (e.g. 'Saturday', 'Monday') for a given date.
 */
export function getDayOfWeek(
  dateStr: string,
  timezone: string = DEFAULT_TIMEZONE
): string {
  const date = parseWeddingDate(dateStr, timezone);
  return formatInTimeZone(date, timezone, 'EEEE');
}
