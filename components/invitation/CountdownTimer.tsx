'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock } from 'lucide-react';
import { weddingConfig } from '@/config/wedding';
import { getCountdown, isWeddingPassed } from '@/lib/date';

interface TimeBlockProps {
  label: string;
  value: number;
}

function TimeBlock({ label, value }: TimeBlockProps) {
  const formattedValue = String(value).padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      {/* Box */}
      <div className="relative w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 rounded-xl bg-gradient-to-b from-champagne/40 to-ivory border border-antique-gold/40 shadow-lg shadow-royal-maroon/5 flex items-center justify-center overflow-hidden">
        {/* Subtle center groove line for flip effect look */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-antique-gold/20 z-10" />

        {/* Animated digit */}
        <AnimatePresence mode="popLayout">
          <motion.span
            key={formattedValue}
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-royal-maroon tracking-tight"
          >
            {formattedValue}
          </motion.span>
        </AnimatePresence>

        {/* Corner gold studs */}
        <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-antique-gold/40" />
        <div className="absolute top-1.5 right-1.5 w-1 h-1 rounded-full bg-antique-gold/40" />
        <div className="absolute bottom-1.5 left-1.5 w-1 h-1 rounded-full bg-antique-gold/40" />
        <div className="absolute bottom-1.5 right-1.5 w-1 h-1 rounded-full bg-antique-gold/40" />
      </div>

      {/* Label */}
      <span className="mt-2 text-[10px] sm:text-xs font-sans uppercase tracking-widest text-antique-gold font-semibold">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer() {
  const targetDate = weddingConfig.weddingDate;
  const timezone = weddingConfig.timezone;

  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [hasPassed, setHasPassed] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasPassed(isWeddingPassed(targetDate, timezone));
    setTimeLeft(getCountdown(targetDate, timezone));

    const interval = setInterval(() => {
      if (isWeddingPassed(targetDate, timezone)) {
        setHasPassed(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft(getCountdown(targetDate, timezone));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, timezone]);

  if (!mounted) {
    // Avoid hydration mismatch
    return (
      <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-6 py-6">
        {['Days', 'Hours', 'Minutes', 'Seconds'].map((lbl) => (
          <div key={lbl} className="flex flex-col items-center">
            <div className="w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 rounded-xl bg-champagne/30 border border-antique-gold/20 flex items-center justify-center">
              <span className="font-serif text-2xl sm:text-3xl text-royal-maroon/40">--</span>
            </div>
            <span className="mt-2 text-xs font-sans uppercase tracking-widest text-antique-gold/50">{lbl}</span>
          </div>
        ))}
      </div>
    );
  }

  if (hasPassed) {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-r from-champagne/30 via-ivory to-soft-blush/30 border border-antique-gold/40 max-w-lg mx-auto text-center shadow-lg">
        <Heart className="w-8 h-8 text-royal-maroon mx-auto mb-2 animate-bounce" />
        <h3 className="font-serif text-2xl font-bold text-royal-maroon">The Celebrations Have Begun!</h3>
        <p className="mt-2 text-sm text-deep-burgundy/80 font-serif italic">
          Dev & Vishakha are happily united in love and marriage. Thank you for your heartfelt blessings!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="inline-flex items-center gap-2 mb-4 text-xs font-sans uppercase tracking-widest text-deep-burgundy/70 font-medium">
        <Clock className="w-3.5 h-3.5 text-antique-gold" />
        <span>The Countdown to Forever</span>
      </div>

      <div className="flex justify-center items-center gap-2.5 sm:gap-4 md:gap-6">
        <TimeBlock label="Days" value={timeLeft.days} />
        <span className="text-xl sm:text-2xl md:text-3xl font-serif text-antique-gold -mt-6">:</span>
        <TimeBlock label="Hours" value={timeLeft.hours} />
        <span className="text-xl sm:text-2xl md:text-3xl font-serif text-antique-gold -mt-6">:</span>
        <TimeBlock label="Minutes" value={timeLeft.minutes} />
        <span className="text-xl sm:text-2xl md:text-3xl font-serif text-antique-gold -mt-6">:</span>
        <TimeBlock label="Seconds" value={timeLeft.seconds} />
      </div>
    </div>
  );
}

export default CountdownTimer;
