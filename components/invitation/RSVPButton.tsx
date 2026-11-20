'use client';

import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { RSVPModal } from './RSVPModal';

interface RSVPButtonProps {
  eventId?: string;
  eventName?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'floating';
}

export function RSVPButton({
  eventId,
  eventName,
  className = '',
  variant = 'primary',
}: RSVPButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'floating') {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-royal-maroon to-deep-burgundy text-champagne font-sans font-semibold text-xs tracking-wider uppercase shadow-xl hover:scale-105 transition-all border border-antique-gold/50 ${className}`}
        >
          <Heart className="w-4 h-4 text-antique-gold fill-antique-gold animate-pulse" />
          <span>RSVP</span>
        </button>
        <RSVPModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          defaultEventId={eventId}
        />
      </>
    );
  }

  const isPrimary = variant === 'primary';

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-sans font-semibold tracking-wider uppercase transition-all shadow-sm ${
          isPrimary
            ? 'bg-gradient-to-r from-royal-maroon to-deep-burgundy text-champagne hover:opacity-95'
            : 'bg-white/80 hover:bg-white text-royal-maroon border border-antique-gold/50'
        } ${className}`}
      >
        <Heart className="w-3.5 h-3.5 text-antique-gold fill-antique-gold" />
        <span>RSVP {eventName ? `for ${eventName}` : 'Now'}</span>
      </button>

      <RSVPModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        defaultEventId={eventId}
      />
    </>
  );
}

export default RSVPButton;
