'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';
import type { WeddingEvent } from '@/types/event';
import { LocationPanel } from './LocationPanel';
import { CalendarButton } from './CalendarButton';
import { RSVPButton } from './RSVPButton';

interface EventCardProps {
  event: WeddingEvent;
  index: number;
}

/**
 * Event-specific themed SVG motif illustrations
 */
function ThemedEventMotif({ eventId }: { eventId: string }) {
  switch (eventId) {
    case 'ganesh-sthapana':
      // Ganesha / Kalash & Diya motif in warm vermilion
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-vermilion" fill="none">
          {/* Diya Base */}
          <path d="M 25 65 Q 50 85 75 65 Z" fill="#D85A32" opacity="0.85" />
          {/* Diya Rim */}
          <ellipse cx="50" cy="65" rx="25" ry="5" fill="#C99A45" />
          {/* Sacred Flame */}
          <path d="M 50 62 Q 43 45 50 30 Q 57 45 50 62 Z" fill="#F59E0B" />
          <path d="M 50 58 Q 46 48 50 38 Q 54 48 50 58 Z" fill="#FAF0D7" />
          {/* Modak / Auspicious Drops */}
          <circle cx="50" cy="22" r="3" fill="#C99A45" />
        </svg>
      );
    case 'haldi-ceremony':
      // Turmeric Bowl & Marigold Flowers
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
          {/* Urli / Brass Bowl */}
          <path d="M 20 60 Q 50 85 80 60 Z" fill="#C99A45" />
          <ellipse cx="50" cy="60" rx="30" ry="7" fill="#E5A910" />
          {/* Turmeric Powder mounds */}
          <circle cx="45" cy="54" r="8" fill="#F59E0B" />
          <circle cx="55" cy="54" r="8" fill="#F59E0B" />
          <circle cx="50" cy="48" r="7" fill="#FBBF24" />
          {/* Marigold Petals */}
          <circle cx="30" cy="58" r="4" fill="#E8871E" />
          <circle cx="70" cy="58" r="4" fill="#E8871E" />
        </svg>
      );
    case 'mehendi-rasam':
      // Henna Mandala & Floral Vines
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-leaf-green" fill="none">
          <circle cx="50" cy="50" r="22" stroke="#59764B" strokeWidth="2" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="14" fill="#59764B" opacity="0.2" />
          <circle cx="50" cy="50" r="6" fill="#C99A45" />
          {/* Petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
            <ellipse
              key={idx}
              cx="50"
              cy="25"
              rx="4"
              ry="7"
              fill="#59764B"
              opacity="0.75"
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
        </svg>
      );
    case 'grah-shanti':
      // Sacred Purna Kalash (Copper/Brass pot with coconut & mango leaves)
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
          {/* Kalash Pot */}
          <path d="M 32 50 Q 22 66 32 80 Q 50 86 68 80 Q 78 66 68 50 Z" fill="#C99A45" />
          <ellipse cx="50" cy="50" rx="18" ry="4" fill="#D85A32" />
          {/* Sacred Swastik / Tilak on pot */}
          <circle cx="50" cy="66" r="3" fill="#781F35" />
          {/* Mango Leaves */}
          <path d="M 38 48 Q 24 38 30 26 Q 42 36 40 48 Z" fill="#59764B" />
          <path d="M 62 48 Q 76 38 70 26 Q 58 36 60 48 Z" fill="#59764B" />
          <path d="M 44 48 Q 38 28 50 18 Q 62 28 56 48 Z" fill="#59764B" />
          {/* Coconut */}
          <circle cx="50" cy="38" r="9" fill="#8B5A2B" />
        </svg>
      );
    case 'garba-sangeet':
      // Dandiya Sticks & Sparkles
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
          {/* Crossed Dandiya sticks */}
          <rect x="22" y="47" width="60" height="6" rx="3" fill="#D85A32" transform="rotate(-35 50 50)" />
          <rect x="22" y="47" width="60" height="6" rx="3" fill="#C99A45" transform="rotate(35 50 50)" />
          {/* Bell tassels */}
          <circle cx="26" cy="32" r="4" fill="#C99A45" />
          <circle cx="74" cy="32" r="4" fill="#C99A45" />
          {/* Sparkles */}
          <circle cx="50" cy="22" r="3" fill="#FAF0D7" />
          <circle cx="50" cy="78" r="3" fill="#FAF0D7" />
        </svg>
      );
    case 'wedding-ceremony':
      // Mandap Pillars & Sacred Agni (Holy Fire)
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-royal-maroon" fill="none">
          {/* Mandap Arch */}
          <path d="M 22 75 L 22 35 Q 50 18 78 35 L 78 75" stroke="#C99A45" strokeWidth="2.5" />
          <line x1="16" y1="75" x2="84" y2="75" stroke="#C99A45" strokeWidth="3" />
          {/* Havan Kund / Fire altar */}
          <path d="M 38 75 L 42 63 L 58 63 L 62 75 Z" fill="#781F35" />
          {/* Sacred Flames */}
          <path d="M 50 63 Q 44 50 50 40 Q 56 50 50 63 Z" fill="#D85A32" />
          <path d="M 50 60 Q 46 52 50 44 Q 54 52 50 60 Z" fill="#F59E0B" />
        </svg>
      );
    case 'wedding-reception':
      // Champagne & Starlight Stage Chandelier
      return (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-antique-gold" fill="none">
          <circle cx="50" cy="30" r="16" stroke="#C99A45" strokeWidth="1.5" />
          <circle cx="50" cy="30" r="6" fill="#C99A45" />
          {/* Crystal drops */}
          <line x1="50" y1="46" x2="50" y2="68" stroke="#C99A45" strokeWidth="1.5" />
          <circle cx="50" cy="71" r="3" fill="#C99A45" />
          <line x1="42" y1="44" x2="38" y2="60" stroke="#C99A45" strokeWidth="1" />
          <circle cx="37" cy="63" r="2.5" fill="#C99A45" />
          <line x1="58" y1="44" x2="62" y2="60" stroke="#C99A45" strokeWidth="1" />
          <circle cx="63" cy="63" r="2.5" fill="#C99A45" />
        </svg>
      );
    default:
      return null;
  }
}

export function EventCard({ event, index }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
      className="relative rounded-3xl overflow-hidden border border-antique-gold/30 shadow-xl transition-all duration-300 hover:shadow-2xl"
      style={{
        backgroundColor: event.theme.backgroundColor || '#FFF9F0',
      }}
    >
      {/* Decorative Top Accent Stripe */}
      <div
        className="h-2 w-full"
        style={{
          background: event.theme.gradient,
        }}
      />

      <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between">
        {/* Top Header Row: Motif, Name, Date/Time */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-white/80 border border-antique-gold/20 shadow-xs">
                <ThemedEventMotif eventId={event.id} />
              </div>
              <div>
                <span className="text-[11px] font-sans font-semibold uppercase tracking-widest text-antique-gold">
                  Ceremony {index + 1}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-royal-maroon tracking-tight">
                  {event.name}
                </h3>
              </div>
            </div>

            {/* Date Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-white/80 border border-antique-gold/30 shadow-xs">
              <Calendar className="w-4 h-4 text-royal-maroon" />
              <div className="text-xs font-sans font-semibold text-royal-maroon">
                {event.day}, {event.date}
              </div>
            </div>
          </div>

          {/* Time & Duration */}
          <div className="inline-flex items-center gap-2 text-xs font-sans text-deep-burgundy/80 font-medium mb-4 px-3 py-1 rounded-lg bg-champagne/30 border border-antique-gold/20">
            <Clock className="w-3.5 h-3.5 text-antique-gold" />
            <span>
              {event.startTime} – {event.endTime}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base font-serif text-deep-burgundy/85 leading-relaxed italic mb-6">
            &ldquo;{event.description}&rdquo;
          </p>
        </div>

        {/* Bottom Section: Location Panel & Actions */}
        <div className="space-y-4 pt-4 border-t border-antique-gold/20">
          <LocationPanel event={event} />

          {/* Action Row: RSVP & Add to Calendar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <RSVPButton eventId={event.id} eventName={event.name} />
              <CalendarButton event={event} />
            </div>

            <span className="text-[11px] font-serif italic text-deep-burgundy/60">
              Dev & Vishakha Celebrations
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default EventCard;
