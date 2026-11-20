/**
 * Wedding Configuration & Profile Type Definitions
 * Core types for couple details, wedding metadata, and site-wide configuration.
 */

export interface PersonInfo {
  firstName: string;
  lastName: string;
  fullName: string;
}

export interface WeddingConfig {
  groom: PersonInfo;
  bride: PersonInfo;
  coupleInitials: string;
  weddingDate: string; // ISO date string (e.g., '2027-02-15T10:00:00+05:30' or '2027-02-15')
  timezone: string;
  weddingMessage: string;
  websiteUrl: string;
  musicPath: string;
  ogImage: string;
}

export interface WeddingMetadata {
  title: string;
  description: string;
  ogImage: string;
  url: string;
}
