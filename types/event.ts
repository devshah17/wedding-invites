/**
 * Wedding Event & Celebration Types
 * Detailed types for ceremonies, venue locations, and thematic styling.
 */

export type EventAnimationType =
  | 'fadeGlow'
  | 'petalCascade'
  | 'floralDraw'
  | 'lightsSequence'
  | 'mandapReveal'
  | 'goldParticles';

export interface EventVenue {
  name: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  mapUrl: string;
}

export interface EventTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  gradient: string;
  animationType: EventAnimationType;
}

export interface WeddingEvent {
  id: string;
  name: string;
  description: string;
  date: string; // ISO date (e.g. '2027-02-15')
  day: string;
  startTime: string;
  endTime: string;
  venue: EventVenue;
  theme: EventTheme;
  dressCode?: string;
  illustration?: string;
  rsvpEnabled: boolean;
  calendarEnabled: boolean;
}
