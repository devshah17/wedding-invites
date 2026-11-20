/**
 * Theme & Design System Tokens
 * Comprehensive design tokens for typography, Indian wedding color palette,
 * royal gradients, and luxurious animation presets.
 */

export const colors = {
  royalMaroon: '#781F35',
  deepBurgundy: '#541426',
  antiqueGold: '#C99A45',
  champagne: '#F6EBD5',
  ivory: '#FFF9F0',
  softBlush: '#F3D9D5',
  vermilion: '#D85A32',
  leafGreen: '#59764B',
  // Accent & functional shades
  goldLight: '#E8C872',
  goldDark: '#A07628',
  maroonLight: '#942B44',
  maroonDark: '#3A0C18',
  charcoal: '#222222',
  offWhite: '#FAF7F2',
} as const;

export const gradients = {
  gold: 'linear-gradient(135deg, #C99A45 0%, #E8C872 50%, #B38634 100%)',
  goldShimmer: 'linear-gradient(90deg, #C99A45 0%, #FFF3DB 50%, #C99A45 100%)',
  royalMaroon: 'linear-gradient(135deg, #781F35 0%, #541426 100%)',
  champagneGold: 'linear-gradient(135deg, #F6EBD5 0%, #E2CA9D 100%)',
  vermilion: 'linear-gradient(135deg, #D85A32 0%, #C99A45 100%)',
  leafGreen: 'linear-gradient(135deg, #59764B 0%, #2E5A36 100%)',
  softBlush: 'linear-gradient(135deg, #F3D9D5 0%, #FFF9F0 100%)',
  cardGlow: 'radial-gradient(ellipse at top, rgba(201, 154, 69, 0.18), transparent 70%)',
  borderGold: 'linear-gradient(90deg, transparent, #C99A45, transparent)',
} as const;

export const fonts = {
  script: 'var(--font-great-vibes), "Great Vibes", cursive',
  serif: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
  sans: 'var(--font-montserrat), "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  display: 'var(--font-cormorant), "Cormorant Garamond", Georgia, serif',
  names: {
    script: 'Great Vibes',
    serif: 'Cormorant Garamond',
    sans: 'Montserrat',
  },
} as const;

export const shadows = {
  goldSubtle: '0 4px 20px -2px rgba(201, 154, 69, 0.15)',
  goldElevated: '0 12px 36px -4px rgba(201, 154, 69, 0.28)',
  maroonSubtle: '0 4px 24px -2px rgba(120, 31, 53, 0.14)',
  maroonElevated: '0 16px 44px -4px rgba(84, 20, 38, 0.24)',
  cardLuxury: '0 10px 30px -5px rgba(84, 20, 38, 0.08), 0 0 0 1px rgba(201, 154, 69, 0.2)',
} as const;

export const animations = {
  duration: {
    instant: 0.1,
    fast: 0.25,
    normal: 0.45,
    medium: 0.65,
    slow: 0.9,
    luxurious: 1.3,
    ceremonial: 1.8,
  },
  easing: {
    easeOutCubic: [0.33, 1, 0.68, 1] as const,
    easeInOutCubic: [0.65, 0, 0.35, 1] as const,
    royalEntrance: [0.16, 1, 0.3, 1] as const,
    gentleFloat: [0.45, 0.05, 0.55, 0.95] as const,
  },
  transitions: {
    default: {
      duration: 0.45,
      ease: [0.33, 1, 0.68, 1],
    },
    royal: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
    ceremonial: {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
    },
    springGentle: {
      type: 'spring',
      damping: 24,
      stiffness: 130,
    },
    springBouncy: {
      type: 'spring',
      damping: 14,
      stiffness: 180,
    },
  },
  motionPresets: {
    fadeInUp: {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
    fadeInDown: {
      initial: { opacity: 0, y: -24 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
    scaleUp: {
      initial: { opacity: 0, scale: 0.92 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.92 },
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  },
} as const;

export const theme = {
  colors,
  gradients,
  fonts,
  shadows,
  animations,
};

export default theme;
