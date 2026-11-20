'use client';

import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { MapPin, Navigation, QrCode } from 'lucide-react';
import type { WeddingEvent } from '@/types/event';
import { generateDirectionsUrl } from '@/lib/maps';
import { QRCodeModal } from './QRCodeModal';

interface LocationPanelProps {
  event: WeddingEvent;
  className?: string;
}

export function LocationPanel({ event, className = '' }: LocationPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const directionsUrl = generateDirectionsUrl(event.venue.latitude, event.venue.longitude);

  return (
    <>
      <div className={`p-4 rounded-2xl bg-white/70 border border-antique-gold/30 shadow-sm backdrop-blur-xs ${className}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Venue Info */}
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <div className="p-2 rounded-xl bg-champagne/40 border border-antique-gold/30 text-royal-maroon shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-royal-maroon" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-sans uppercase tracking-widest text-antique-gold font-bold">
                Venue Location
              </span>
              <h4 className="text-sm sm:text-base font-serif font-bold text-royal-maroon truncate">
                {event.venue.name}
              </h4>
              <p className="text-xs font-sans text-deep-burgundy/80 mt-0.5 leading-snug line-clamp-2">
                {event.venue.address}, {event.venue.city}
              </p>
            </div>
          </div>

          {/* Right Action: QR Code button & Directions Button */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
            {/* Clickable QR Code Preview */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              title="Click to enlarge QR code for scanning"
              className="group relative flex flex-col items-center justify-center p-1.5 rounded-xl bg-ivory border border-antique-gold/40 hover:border-royal-maroon/50 shadow-sm transition-all"
            >
              <div className="w-12 h-12 flex items-center justify-center p-1 bg-white rounded-lg">
                <QRCode
                  value={directionsUrl}
                  size={44}
                  style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                  viewBox="0 0 256 256"
                  fgColor="#541426"
                />
              </div>
              <span className="text-[9px] font-sans font-semibold text-antique-gold group-hover:text-royal-maroon mt-0.5 flex items-center gap-0.5">
                <QrCode className="w-2.5 h-2.5" />
                <span>Enlarge</span>
              </span>
            </button>

            {/* Direct Navigation Button */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-royal-maroon hover:bg-deep-burgundy text-champagne text-xs font-sans font-semibold uppercase tracking-wider transition-all shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 text-antique-gold" />
              <span>Directions</span>
            </a>
          </div>
        </div>
      </div>

      {/* Enlarged QR Code Modal */}
      <QRCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
      />
    </>
  );
}

export default LocationPanel;
