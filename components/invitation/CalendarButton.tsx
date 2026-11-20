'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Download, ExternalLink, ChevronDown } from 'lucide-react';
import type { WeddingEvent } from '@/types/event';
import { generateGoogleCalendarUrl, downloadICSFile } from '@/lib/calendar';

interface CalendarButtonProps {
  event: WeddingEvent;
  className?: string;
}

export function CalendarButton({ event, className = '' }: CalendarButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleDownloadICS = () => {
    downloadICSFile(event);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-champagne/40 hover:bg-champagne/70 border border-antique-gold/40 text-royal-maroon text-xs font-sans font-semibold tracking-wide transition-all shadow-sm"
        aria-expanded={isOpen}
      >
        <Calendar className="w-3.5 h-3.5 text-antique-gold" />
        <span>Add to Calendar</span>
        <ChevronDown className={`w-3 h-3 text-royal-maroon transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-52 rounded-xl bg-ivory border border-antique-gold/40 shadow-xl p-1.5 z-30"
          >
            <button
              type="button"
              onClick={handleGoogleCalendar}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-sans text-deep-burgundy hover:bg-champagne/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-antique-gold" />
                <span>Google Calendar</span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleDownloadICS}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-sans text-deep-burgundy hover:bg-champagne/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5 text-antique-gold" />
                <span>Apple / Outlook (.ics)</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CalendarButton;
