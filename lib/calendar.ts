import type { WeddingEvent } from '@/types/event';

const TIMEZONE = 'Asia/Kolkata';

/**
 * Parses time components from a string (supports '10:00 AM', '18:30', '10:00', etc.)
 */
function parseTimeComponents(timeStr?: string): { hours: number; minutes: number } {
  if (!timeStr) {
    return { hours: 10, minutes: 0 };
  }

  const trimmed = timeStr.trim();

  // Try 12-hour format with AM/PM (e.g., "10:00 AM", "02:30 PM")
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const ampm = match12[3].toUpperCase();

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    return { hours, minutes };
  }

  // Try 24-hour format (e.g., "18:30", "09:00")
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    return { hours, minutes };
  }

  // Default fallback
  return { hours: 10, minutes: 0 };
}

/**
 * Formats a date string and optional time string into an ICS datetime representation (YYYYMMDDTHHMMSS)
 */
function formatToICSDateTime(dateStr: string, timeStr?: string, defaultHourOffset: number = 0): string {
  if (!dateStr) {
    return '20270215T100000';
  }

  // Extract date portion (YYYY-MM-DD)
  let year = '2027';
  let month = '02';
  let day = '15';

  const datePartMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (datePartMatch) {
    year = datePartMatch[1];
    month = datePartMatch[2];
    day = datePartMatch[3];
  }

  const { minutes } = parseTimeComponents(timeStr);
  let { hours } = parseTimeComponents(timeStr);
  if (defaultHourOffset > 0) {
    hours = (hours + defaultHourOffset) % 24;
  }

  const paddedHours = hours.toString().padStart(2, '0');
  const paddedMinutes = minutes.toString().padStart(2, '0');

  return `${year}${month}${day}T${paddedHours}${paddedMinutes}00`;
}

/**
 * Escapes special characters for iCalendar text fields according to RFC 5545
 */
function escapeICSText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Generates an RFC 5545 compliant .ics calendar file string for a wedding event.
 * Uses the Asia/Kolkata timezone with proper VTIMEZONE definitions.
 */
export function generateICSFile(event: WeddingEvent): string {
  const startICS = formatToICSDateTime(event.date, event.startTime);
  const endICS = event.endTime
    ? formatToICSDateTime(event.date, event.endTime)
    : formatToICSDateTime(event.date, event.startTime, 3); // Default 3 hours if endTime not set

  // Timestamp of generation in UTC (Z)
  const now = new Date();
  const dtstamp =
    now.getUTCFullYear().toString() +
    (now.getUTCMonth() + 1).toString().padStart(2, '0') +
    now.getUTCDate().toString().padStart(2, '0') +
    'T' +
    now.getUTCHours().toString().padStart(2, '0') +
    now.getUTCMinutes().toString().padStart(2, '0') +
    now.getUTCSeconds().toString().padStart(2, '0') +
    'Z';

  const uid = `${event.id || 'wedding'}-${startICS}@dev-weds-vishakha.com`;
  const summary = `${event.name} — Dev & Vishakha's Wedding`;
  
  const descriptionParts = [
    event.description,
    event.dressCode ? `Dress Code: ${event.dressCode}` : null,
    `Venue: ${event.venue.name}`,
    `${event.venue.address}, ${event.venue.city}, ${event.venue.state}`,
  ].filter(Boolean);
  const description = descriptionParts.join('\n\n');

  const fullLocation = [
    event.venue.name,
    event.venue.address,
    event.venue.city,
    event.venue.state,
  ]
    .filter(Boolean)
    .join(', ');

  const geoCoord =
    typeof event.venue.latitude === 'number' && typeof event.venue.longitude === 'number'
      ? `GEO:${event.venue.latitude.toFixed(6)};${event.venue.longitude.toFixed(6)}\r\n`
      : '';

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dev & Vishakha Wedding Celebration//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    `TZID:${TIMEZONE}`,
    'X-LIC-LOCATION:Asia/Kolkata',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0530',
    'TZOFFSETTO:+0530',
    'TZNAME:IST',
    'DTSTART:19700101T000000',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;TZID=${TIMEZONE}:${startICS}`,
    `DTEND;TZID=${TIMEZONE}:${endICS}`,
    `SUMMARY:${escapeICSText(summary)}`,
    `DESCRIPTION:${escapeICSText(description)}`,
    `LOCATION:${escapeICSText(fullLocation)}`,
  ];

  if (geoCoord) {
    icsLines.push(`GEO:${event.venue.latitude.toFixed(6)};${event.venue.longitude.toFixed(6)}`);
  }

  icsLines.push('STATUS:CONFIRMED', 'TRANSP:OPAQUE', 'SEQUENCE:0', 'END:VEVENT', 'END:VCALENDAR');

  return icsLines.join('\r\n');
}

/**
 * Generates a prefilled Google Calendar event URL for web browsers.
 */
export function generateGoogleCalendarUrl(event: WeddingEvent): string {
  const startICS = formatToICSDateTime(event.date, event.startTime);
  const endICS = event.endTime
    ? formatToICSDateTime(event.date, event.endTime)
    : formatToICSDateTime(event.date, event.startTime, 3);

  const summary = `${event.name} — Dev & Vishakha's Wedding`;
  
  const descriptionParts = [
    event.description,
    event.dressCode ? `Dress Code: ${event.dressCode}` : null,
    `Venue: ${event.venue.name}`,
    `${event.venue.address}, ${event.venue.city}, ${event.venue.state}`,
  ].filter(Boolean);
  const details = descriptionParts.join('\n\n');

  const location = [
    event.venue.name,
    event.venue.address,
    event.venue.city,
    event.venue.state,
  ]
    .filter(Boolean)
    .join(', ');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: summary,
    dates: `${startICS}/${endICS}`,
    ctz: TIMEZONE,
    details: details,
    location: location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Triggers a browser download of an .ics calendar file for the given wedding event.
 * Safe for SSR (no-op if window is not available).
 */
export function downloadICSFile(event: WeddingEvent): void {
  if (typeof window === 'undefined') {
    return;
  }

  const icsContent = generateICSFile(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);

  const safeFilename = (event.name || 'wedding-event')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${safeFilename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}
