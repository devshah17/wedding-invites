/**
 * RSVP & Guest Management Types
 * Types representing guest confirmations, submission payloads, and guest identity.
 */

export interface RSVPFormData {
  guestName: string;
  mobile: string;
  totalAttendees: number;
  eventAttendance: Record<string, boolean>; // eventId -> attending
  message?: string;
}

export interface RSVPResponse extends RSVPFormData {
  id: string;
  submittedAt: string;
  updatedAt: string;
}

export interface GuestInfo {
  name: string;
  mobile: string;
  attendees: number;
}
