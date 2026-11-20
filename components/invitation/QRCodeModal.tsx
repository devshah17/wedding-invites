'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { X, MapPin, ExternalLink, Navigation } from 'lucide-react';
import type { WeddingEvent } from '@/types/event';
import { generateDirectionsUrl } from '@/lib/maps';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: WeddingEvent | null;
}

export function QRCodeModal({ isOpen, onClose, event }: QRCodeModalProps) {
  if (!event) return null;

  const directionsUrl = generateDirectionsUrl(event.venue.latitude, event.venue.longitude);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-deep-burgundy/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className="relative w-full max-w-sm rounded-3xl bg-ivory p-6 shadow-2xl border-2 border-antique-gold/40 text-center overflow-hidden z-10"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-champagne/40 hover:bg-champagne/80 text-royal-maroon transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mt-2 mb-4">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-widest text-antique-gold">
                Venue Navigation
              </span>
              <h3 className="text-xl font-serif font-bold text-royal-maroon mt-1">
                {event.name}
              </h3>
            </div>

            {/* QR Code Container */}
            <div className="my-4 mx-auto w-48 h-48 sm:w-56 sm:h-56 p-4 rounded-2xl bg-white border border-antique-gold/30 shadow-inner flex items-center justify-center">
              <QRCode
                value={directionsUrl}
                size={200}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                viewBox="0 0 256 256"
                fgColor="#541426"
              />
            </div>

            <p className="text-xs text-deep-burgundy/70 font-sans">
              Scan with phone camera to navigate via Google Maps
            </p>

            {/* Venue Details */}
            <div className="mt-4 p-3 rounded-xl bg-champagne/30 border border-antique-gold/20 text-left">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-royal-maroon shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-serif font-bold text-royal-maroon">{event.venue.name}</div>
                  <div className="text-[11px] text-deep-burgundy/80 font-sans mt-0.5 leading-snug">
                    {event.venue.address}, {event.venue.city}
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Open Button */}
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-royal-maroon to-deep-burgundy text-champagne text-xs font-sans font-semibold uppercase tracking-wider hover:opacity-95 shadow-md transition-opacity"
            >
              <Navigation className="w-3.5 h-3.5 text-antique-gold" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default QRCodeModal;
