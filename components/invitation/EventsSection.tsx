'use client';

import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';
import { weddingEvents } from '@/config/events';
import { EventCard } from './EventCard';
import { SectionReveal } from '@/components/animations/SectionReveal';
import { DecorativeDivider } from '@/components/animations/DecorativeDivider';

export function EventsSection() {
  return (
    <section id="events" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-ivory overflow-hidden">
      {/* Background Subtle Watermark Ornaments */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-antique-gold/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-royal-maroon/5 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <SectionReveal direction="up">
            <div className="inline-flex items-center justify-center space-x-2 text-antique-gold mb-2">
              <Sparkles className="w-4 h-4 text-antique-gold animate-pulse" />
              <span className="font-sans text-xs tracking-widest uppercase font-semibold text-antique-gold">
                Festive Itinerary
              </span>
              <Sparkles className="w-4 h-4 text-antique-gold animate-pulse" />
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-royal-maroon font-bold tracking-tight">
              Auspicious Ceremonies & Events
            </h2>

            <p className="mt-3 text-deep-burgundy/80 font-serif italic text-base sm:text-lg max-w-xl mx-auto">
              Each moment is blessed with holy traditions, laughter, dance, and timeless love. We look forward to celebrating each auspicious chapter with you.
            </p>

            <DecorativeDivider variant="ornate" className="my-6" />
          </SectionReveal>
        </div>

        {/* Events Cards Stack / Grid */}
        <div className="space-y-10 sm:space-y-12">
          {weddingEvents.map((event, index) => (
            <EventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default EventsSection;
