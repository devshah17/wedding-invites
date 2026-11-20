import type { WeddingConfig, WeddingMetadata } from '@/types/wedding';

/**
 * Master Wedding Configuration
 * Contains couple information, main wedding date, timezone, and metadata.
 * Placeholders are marked clearly for easy customization.
 */
export const weddingConfig: WeddingConfig = {
  groom: {
    firstName: 'Dev',
    lastName: 'Shah',
    fullName: 'Dev Shah',
  },
  bride: {
    firstName: 'Vishakha',
    lastName: 'Sikligar',
    fullName: 'Vishakha Sikligar',
  },
  coupleInitials: 'D & V',
  weddingDate: '2027-01-20T10:00:00+05:30', // January 20, 2027
  timezone: 'Asia/Kolkata',
  weddingMessage:
    'With the divine grace of Lord Ganesha and the cherished blessings of our beloved parents and elders, we joyfully invite you to celebrate the holy wedding celebrations of Dev and Vishakha. Two souls, two families, uniting in an eternal bond of love, respect, and companionship.',
  websiteUrl: 'https://dev-weds-vishakha.com',
  musicPath: '/music/wedding-bg.mp3',
  ogImage: '/images/og-wedding.jpg',
};

export const weddingMetadata: WeddingMetadata = {
  title: 'Dev & Vishakha — The Wedding Celebration',
  description:
    'Celebrate the wedding of Dev Shah & Vishakha Sikligar from January 18 to January 22, 2027. Join us for auspicious ceremonies in Petlad, Gujarat and Chitri, Rajasthan.',
  ogImage: weddingConfig.ogImage,
  url: weddingConfig.websiteUrl,
};

export default weddingConfig;
