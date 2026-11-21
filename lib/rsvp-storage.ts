import type { RSVPFormData, RSVPResponse } from '@/types/rsvp';

const RSVP_STORAGE_KEY = 'wedding-rsvp-responses';

/**
 * Generates a unique identifier (UUID v4 or secure fallback)
 */
function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'rsvp_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Retrieves all saved RSVP responses from localStorage.
 * Handles SSR safely by returning an empty array if window is undefined.
 */
export function getRSVPs(): RSVPResponse[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(RSVP_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RSVPResponse[]) : [];
  } catch (error) {
    console.error('Failed to parse RSVPs from localStorage:', error);
    return [];
  }
}

/**
 * Finds a saved RSVP response by guest mobile number.
 * Returns null if not found or during SSR.
 */
export function getRSVPByMobile(mobile: string): RSVPResponse | null {
  if (!mobile) return null;
  const normalizedMobile = mobile.trim();
  const allRSVPs = getRSVPs();
  return allRSVPs.find((r) => r.mobile.trim() === normalizedMobile) || null;
}

/**
 * Filters all saved RSVP responses for attendance at a specific event.
 */
export function getRSVPsByEvent(eventId: string): RSVPResponse[] {
  if (!eventId) return [];
  const allRSVPs = getRSVPs();
  return allRSVPs.filter(
    (rsvp) => rsvp.eventAttendance && rsvp.eventAttendance[eventId] === true
  );
}

/**
 * Saves or updates an RSVP response in localStorage.
 * Automatically detects duplicates by mobile number and updates existing record.
 * Generates a UUID for new records and preserves original submittedAt timestamp on update.
 */
export function saveRSVP(data: RSVPFormData): RSVPResponse {
  const now = new Date().toISOString();
  const normalizedMobile = data.mobile.trim();

  if (typeof window === 'undefined') {
    // SSR fallback: return response without persisting
    return {
      ...data,
      id: generateId(),
      submittedAt: now,
      updatedAt: now,
    };
  }

  const existingList = getRSVPs();
  const existingIndex = existingList.findIndex(
    (item) => item.mobile.trim() === normalizedMobile
  );

  let response: RSVPResponse;

  if (existingIndex !== -1) {
    // Update existing RSVP, preserving original ID and submittedAt
    const original = existingList[existingIndex];
    response = {
      ...data,
      id: original.id,
      submittedAt: original.submittedAt,
      updatedAt: now,
    };
    existingList[existingIndex] = response;
  } else {
    // Create new RSVP response
    response = {
      ...data,
      id: generateId(),
      submittedAt: now,
      updatedAt: now,
    };
    existingList.push(response);
  }

  try {
    window.localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(existingList));
  } catch (error) {
    console.error('Failed to save RSVP to localStorage:', error);
  }

  return response;
}

/**
 * Escapes a cell value for CSV output in accordance with RFC 4180.
 */
function escapeCSVCell(value: unknown): string {
  if (value === null || value === undefined) {
    return '""';
  }
  const stringValue = String(value);
  // Double quote any internal quotes and wrap in quotes
  return `"${stringValue.replace(/"/g, '""')}"`;
}

/**
 * Exports all saved RSVPs as a formatted CSV string.
 * Columns: ID, Guest Name, Mobile, Total Attendees, Events Attending, Message, Submitted At, Updated At
 */
export function exportRSVPsToCSV(): string {
  const rsvps = getRSVPs();

  const headers = [
    'ID',
    'Guest Name',
    'Mobile',
    'Total Attendees',
    'Events Attending',
    'Message',
    'Submitted At',
    'Updated At',
  ];

  const rows = rsvps.map((rsvp) => {
    // Format attending events list
    const attendingEvents = Object.entries(rsvp.eventAttendance || {})
      .filter(([, attending]) => attending)
      .map(([eventId]) => eventId)
      .join(', ');

    return [
      escapeCSVCell(rsvp.id),
      escapeCSVCell(rsvp.guestName),
      escapeCSVCell(rsvp.mobile),
      escapeCSVCell(rsvp.totalAttendees),
      escapeCSVCell(attendingEvents),
      escapeCSVCell(rsvp.message || ''),
      escapeCSVCell(rsvp.submittedAt),
      escapeCSVCell(rsvp.updatedAt),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Removes an RSVP record from localStorage by mobile number or ID.
 */
export function deleteRSVPFromStorage(identifier: string): void {
  if (typeof window === 'undefined' || !identifier) return;
  try {
    const list = getRSVPs();
    const filtered = list.filter(
      (item) => item.id !== identifier && item.mobile.trim() !== identifier.trim()
    );
    window.localStorage.setItem(RSVP_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove RSVP from localStorage:', error);
  }
}
