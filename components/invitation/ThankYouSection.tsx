'use client';

import React from 'react';
import { Heart, Sparkles, MessageSquare } from 'lucide-react';
import { weddingConfig } from '@/config/wedding';
import { SectionReveal } from '@/components/animations/SectionReveal';
import { DecorativeDivider } from '@/components/animations/DecorativeDivider';
import { RSVPButton } from './RSVPButton';

export function ThankYouSection() {
  return (
    <footer className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF8F5] via-[#FFFDF9] to-[#F5EFEB] overflow-hidden text-center border-t border-antique-gold/30">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-antique-gold/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-antique-gold/15 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto z-10">
        <SectionReveal direction="up">
          {/* Couple Initials Seal */}
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-antique-gold via-champagne to-antique-gold p-[2px] shadow-xl mb-6 mx-auto">
            <div className="w-full h-full rounded-full bg-royal-maroon flex items-center justify-center text-champagne border border-antique-gold/40 px-2">
              <span className="font-script text-2xl sm:text-3xl md:text-4xl text-antique-gold whitespace-nowrap leading-none">
                {weddingConfig.coupleInitials}
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="inline-flex items-center justify-center space-x-2 text-antique-gold mb-2">
            <Sparkles className="w-4 h-4 text-antique-gold" />
            <span className="font-sans text-xs tracking-widest uppercase font-semibold text-antique-gold">
              Heartfelt Gratitude
            </span>
            <Sparkles className="w-4 h-4 text-antique-gold" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-royal-maroon font-bold tracking-tight">
            Your Presence Will Make Our Celebration Complete
          </h2>

          <DecorativeDivider variant="ornate" className="my-6" />

          {/* Emotional Message */}
          <p className="text-base sm:text-lg font-serif text-deep-burgundy/85 leading-relaxed italic max-w-2xl mx-auto">
            With the sacred blessings of our families and the warm love of everyone dear to us, we begin this beautiful new journey of togetherness. We would be truly blessed and delighted to have you with us as we celebrate our forever.
          </p>

          {/* Couple Sign-off */}
          <div className="mt-8">
            <p className="text-sm font-sans tracking-widest uppercase text-antique-gold font-semibold">
              With Love & Respect,
            </p>
            <div className="mt-2 font-script text-4xl sm:text-5xl text-royal-maroon">
              {weddingConfig.groom.firstName} & {weddingConfig.bride.firstName}
            </div>
          </div>

          {/* Actions: RSVP & Wishes */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <RSVPButton variant="primary" className="px-6 py-3 text-sm shadow-lg w-full sm:w-auto" />
            <a
              href="#wishes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-antique-gold/50 bg-white/80 hover:bg-antique-gold/15 text-royal-maroon font-sans font-semibold text-sm shadow-md transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-antique-gold" />
              <span>Send Blessings &amp; Wishes</span>
            </a>
          </div>

          <div className="mt-16 pt-8 border-t border-antique-gold/20 flex flex-col items-center justify-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-serif italic text-deep-burgundy/70">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-vermilion fill-vermilion animate-pulse" />
              <span>for our forever.</span>
            </div>
            <p className="text-[10px] font-sans text-deep-burgundy/50 tracking-wider">
              {weddingConfig.groom.firstName} & {weddingConfig.bride.firstName} Wedding • Petlad, Gujarat &amp; Chitri, Rajasthan
            </p>
          </div>
        </SectionReveal>
      </div>
    </footer>
  );
}

export default ThankYouSection;
