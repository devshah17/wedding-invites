'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, Heart, Users, Phone, User, MessageSquare, Sparkles } from 'lucide-react';
import { weddingEvents } from '@/config/events';
import { saveRSVP, getRSVPByMobile } from '@/lib/rsvp-storage';
import type { RSVPFormData } from '@/types/rsvp';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEventId?: string;
}

export function RSVPModal({ isOpen, onClose, defaultEventId }: RSVPModalProps) {
  const [guestName, setGuestName] = useState('');
  const [mobile, setMobile] = useState('');
  const [totalAttendees, setTotalAttendees] = useState(1);
  const [message, setMessage] = useState('');
  const [prevEventId, setPrevEventId] = useState(defaultEventId);
  const [eventAttendance, setEventAttendance] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    weddingEvents.forEach((ev) => {
      initial[ev.id] = defaultEventId ? ev.id === defaultEventId : true;
    });
    return initial;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (defaultEventId !== prevEventId) {
    setPrevEventId(defaultEventId);
    const initial: Record<string, boolean> = {};
    weddingEvents.forEach((ev) => {
      initial[ev.id] = defaultEventId ? ev.id === defaultEventId : true;
    });
    setEventAttendance(initial);
  }

  // When mobile changes, check if guest already submitted before
  const handleMobileBlur = () => {
    const trimmed = mobile.trim();
    if (trimmed.length >= 10) {
      const existing = getRSVPByMobile(trimmed);
      if (existing) {
        setGuestName(existing.guestName);
        setTotalAttendees(existing.totalAttendees || 1);
        if (existing.message) setMessage(existing.message);
        if (existing.eventAttendance) {
          setEventAttendance(existing.eventAttendance);
        }
      }
    }
  };

  const toggleEvent = (eventId: string) => {
    setEventAttendance((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!guestName.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }

    const cleanMobile = mobile.trim();
    if (!cleanMobile || cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    const attendingAny = Object.values(eventAttendance).some(Boolean);
    if (!attendingAny) {
      setErrorMessage('Please select at least one ceremony to attend');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData: RSVPFormData = {
        guestName: guestName.trim(),
        mobile: cleanMobile,
        totalAttendees: Number(totalAttendees) || 1,
        eventAttendance,
        message: message.trim(),
      };

      saveRSVP(formData);
      setIsSubmitting(false);
      setIsSuccess(true);
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Unable to save response. Please try again.');
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="fixed inset-0 bg-deep-burgundy/70 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg rounded-3xl bg-ivory p-6 sm:p-8 shadow-2xl border-2 border-antique-gold/40 my-8 z-10 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-champagne/40 hover:bg-champagne/80 text-royal-maroon transition-colors"
          aria-label="Close RSVP form"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-antique-gold/20 text-antique-gold mx-auto flex items-center justify-center mb-4 border border-antique-gold/40">
              <CheckCircle2 className="w-10 h-10 text-antique-gold" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-royal-maroon">
              Auspicious Wishes Received!
            </h3>
            <p className="mt-2 text-sm text-deep-burgundy/80 font-serif italic max-w-sm mx-auto">
              Thank you, <strong className="text-royal-maroon font-bold">{guestName}</strong>! Your RSVP has been saved. We are overjoyed to celebrate these cherished moments with you!
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-champagne/30 border border-antique-gold/30 text-left text-xs space-y-2">
              <div className="flex justify-between font-sans">
                <span className="text-deep-burgundy/70">Total Guests:</span>
                <span className="font-bold text-royal-maroon">{totalAttendees} Guest(s)</span>
              </div>
              <div className="font-sans text-deep-burgundy/70">
                <span>Functions attending:</span>
                <ul className="mt-1 list-disc list-inside space-y-0.5 text-royal-maroon font-semibold">
                  {weddingEvents
                    .filter((ev) => eventAttendance[ev.id])
                    .map((ev) => (
                      <li key={ev.id}>{ev.name}</li>
                    ))}
                </ul>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-royal-maroon to-deep-burgundy text-champagne font-sans font-semibold text-xs uppercase tracking-wider shadow-md hover:opacity-95"
            >
              Done
            </button>
          </div>
        ) : (
          /* RSVP Form */
          <div>
            <div className="text-center mb-6">
              <span className="text-xs font-sans uppercase tracking-widest text-antique-gold font-bold">
                Wedding Celebration
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-royal-maroon mt-1">
                RSVP for Celebrations
              </h3>
              <p className="text-xs text-deep-burgundy/70 font-serif italic mt-1">
                Kindly let us know which auspicious ceremonies you will grace with your presence.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-vermilion/10 border border-vermilion/30 text-vermilion text-xs font-sans font-medium text-center">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-royal-maroon mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-antique-gold" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Rahul & Family"
                  className="w-full px-4 py-2.5 rounded-xl border border-antique-gold/40 bg-white/90 text-deep-burgundy text-sm focus:outline-none focus:border-royal-maroon focus:ring-1 focus:ring-royal-maroon"
                />
              </div>

              {/* Mobile Number & Attendees count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-royal-maroon mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-antique-gold" />
                    <span>Mobile Number *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    onBlur={handleMobileBlur}
                    placeholder="10-digit number"
                    className="w-full px-4 py-2.5 rounded-xl border border-antique-gold/40 bg-white/90 text-deep-burgundy text-sm focus:outline-none focus:border-royal-maroon focus:ring-1 focus:ring-royal-maroon"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-royal-maroon mb-1.5 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-antique-gold" />
                    <span>Total Attendees</span>
                  </label>
                  <select
                    value={totalAttendees}
                    onChange={(e) => setTotalAttendees(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-antique-gold/40 bg-white/90 text-deep-burgundy text-sm focus:outline-none focus:border-royal-maroon focus:ring-1 focus:ring-royal-maroon"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Individual Event Checkboxes */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-royal-maroon mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
                  <span>Select Ceremonies Attending</span>
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {weddingEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={() => toggleEvent(ev.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        eventAttendance[ev.id]
                          ? 'bg-champagne/40 border-antique-gold/60 text-royal-maroon shadow-xs'
                          : 'bg-white/50 border-antique-gold/20 text-deep-burgundy/60 hover:bg-champagne/20'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-serif font-bold truncate">{ev.name}</div>
                        <div className="text-[10px] font-sans text-deep-burgundy/70 mt-0.5">
                          {ev.day}, {ev.startTime}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                          eventAttendance[ev.id]
                            ? 'bg-royal-maroon border-royal-maroon text-white'
                            : 'border-antique-gold/50 bg-white'
                        }`}
                      >
                        {eventAttendance[ev.id] && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message to Couple */}
              <div>
                <label className="block text-xs font-sans font-semibold uppercase tracking-wider text-royal-maroon mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-antique-gold" />
                  <span>Personal Message or Blessings (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your warm blessings with Dev & Vishakha..."
                  className="w-full px-4 py-2 rounded-xl border border-antique-gold/40 bg-white/90 text-deep-burgundy text-sm focus:outline-none focus:border-royal-maroon focus:ring-1 focus:ring-royal-maroon resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-royal-maroon to-deep-burgundy text-champagne font-sans font-semibold text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 text-antique-gold fill-antique-gold" />
                <span>{isSubmitting ? 'Submitting...' : 'Confirm RSVP'}</span>
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default RSVPModal;
