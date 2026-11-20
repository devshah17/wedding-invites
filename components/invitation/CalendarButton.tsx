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
    <div ref={dropdownRef} className={`relative inline-block ${isOpen ? 'z-50' : 'z-20'} ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-champagne/40 hover:bg-champagne/70 border border-antique-gold/40 text-royal-maroon text-xs font-sans font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
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
            className="absolute bottom-full mb-2 left-0 w-56 rounded-xl border border-antique-gold/50 shadow-2xl p-1.5 z-50"
            style={{
              backgroundColor: '#FFFDF9',
              boxShadow: '0 12px 30px -4px rgba(84, 20, 38, 0.25), 0 4px 12px rgba(0, 0, 0, 0.12)',
            }}
          >
            <div className="px-2.5 py-1 text-[10px] font-sans font-semibold uppercase tracking-wider text-antique-gold/90 border-b border-antique-gold/20 mb-1">
              Select Calendar
            </div>
            <button
              type="button"
              onClick={handleGoogleCalendar}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-sans text-deep-burgundy hover:bg-champagne/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 font-medium">
                <ExternalLink className="w-3.5 h-3.5 text-royal-maroon" />
                <span>Google Calendar</span>
              </div>
            </button>

            <button
              type="button"
              onClick={handleDownloadICS}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs font-sans text-deep-burgundy hover:bg-champagne/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2 font-medium">
                <Download className="w-3.5 h-3.5 text-royal-maroon" />
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
