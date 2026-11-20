import type { EventVenue } from '@/types/event';

/**
 * Generates a Google Maps directions URL targeting the exact GPS coordinates.
 */
export function generateDirectionsUrl(latitude: number, longitude: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
}

/**
 * Generates a full Google Maps URL with venue name, address, and coordinates.
 * Falls back to search query if venue.mapUrl is not explicitly configured.
 */
export function generateMapUrl(venue: EventVenue): string {
  if (venue.mapUrl && venue.mapUrl.trim().startsWith('http')) {
    return venue.mapUrl.trim();
  }

  const queryParts = [venue.name, venue.address, venue.city, venue.state].filter(Boolean);
  if (queryParts.length > 0) {
    const query = queryParts.join(', ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${venue.latitude},${venue.longitude}`;
}

/**
 * Generates content payload for the venue QR code (the directions URL).
 */
export function generateQRContent(venue: EventVenue): string {
  return generateDirectionsUrl(venue.latitude, venue.longitude);
}
