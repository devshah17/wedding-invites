'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import {
  GanpatiArtwork,
  ShrinathjiArtwork,
  ShivParvatiArtwork,
  RadhaKrishnaArtwork,
  PichwaiCowArtwork,
  RoyalElephantArtwork,
} from '@/components/sacred/DeityArtworks';
import { SectionReveal } from '@/components/animations/SectionReveal';
import { DecorativeDivider } from '@/components/animations/DecorativeDivider';

interface BlessingCardProps {
  title: string;
  mantra: string;
  description: string;
  artwork: React.ReactNode;
  companion?: React.ReactNode;
}

function BlessingCard({
  title,
  mantra,
  description,
  artwork,
  companion,
}: BlessingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
      className="relative flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-white/95 border border-antique-gold/35 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-xs group"
    >
      {/* Decorative top gold rim */}
      <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-antique-gold to-transparent" />

      {/* Deity Artwork Container */}
      <div className="relative mb-4 flex items-center justify-center p-3 rounded-full bg-gradient-to-b from-[#FFFDF9] to-[#FAF5EB] border border-antique-gold/30 shadow-inner group-hover:scale-105 transition-transform duration-500">
        {artwork}
      </div>

      {/* Mantra / Sacred Shlok */}
      <span className="text-xs sm:text-sm font-serif font-bold text-royal-maroon tracking-wide mb-1.5 px-3 py-1 rounded-full bg-champagne/40 border border-antique-gold/25">
        {mantra}
      </span>

      {/* Deity Title */}
      <h3 className="text-xl sm:text-2xl font-serif font-bold text-deep-burgundy mt-2 tracking-tight">
        {title}
      </h3>

      {/* Blessing Description */}
      <p className="mt-2 text-xs sm:text-sm font-serif italic text-deep-burgundy/80 leading-relaxed max-w-xs">
        &ldquo;{description}&rdquo;
      </p>

      {/* Companion Sacred Animals (Cows / Elephants) */}
      {companion && (
        <div className="mt-4 pt-3 border-t border-antique-gold/20 flex items-center justify-center gap-3">
          {companion}
        </div>
      )}
    </motion.div>
  );
}

export function DivineBlessingsSection() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#FDFBF7] overflow-hidden">
      {/* Flanking Royal Elephants on Header */}
      <div className="max-w-6xl mx-auto">
        <SectionReveal direction="up">
          <div className="text-center mb-14">
            {/* Top Royal Elephant Emblems */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 mb-3">
              <RoyalElephantArtwork className="w-14 h-12 sm:w-20 sm:h-16 opacity-85 hidden sm:block" facing="right" />
              <div className="flex flex-col items-center">
                <div className="inline-flex items-center justify-center space-x-2 text-antique-gold mb-1">
                  <Sparkles className="w-4 h-4 text-antique-gold animate-pulse" />
                  <span className="font-sans text-xs tracking-widest uppercase font-semibold text-antique-gold">
                    Divine Invocations
                  </span>
                  <Sparkles className="w-4 h-4 text-antique-gold animate-pulse" />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-royal-maroon font-bold tracking-tight">
                  Blessed by the Divine
                </h2>
              </div>
              <RoyalElephantArtwork className="w-14 h-12 sm:w-20 sm:h-16 opacity-85 hidden sm:block" facing="left" />
            </div>

            <p className="mt-2 text-deep-burgundy/80 font-serif italic text-base sm:text-lg max-w-2xl mx-auto">
              Our holy union is solemnized under the eternal grace, celestial guardianship, and boundless blessings of our revered deities.
            </p>

            <DecorativeDivider variant="ornate" className="my-6" />
          </div>
        </SectionReveal>

        {/* 4 Divine Blessings Cards (2x2 Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* 1. Lord Ganpati */}
          <BlessingCard
            title="Lord Shri Ganesha"
            mantra="ॐ गं गणपतये नमः"
            description="May the divine remover of all obstacles shower wisdom, supreme peace, and everlasting prosperity upon Dev & Vishakha."
            artwork={<GanpatiArtwork className="w-24 h-24 sm:w-28 sm:h-28" />}
            companion={
              <div className="flex items-center gap-2 text-xs font-serif text-deep-burgundy/70">
                <span className="w-2 h-2 rounded-full bg-vermilion" />
                <span>Pratham Poojya • Auspicious Beginnings</span>
              </div>
            }
          />

          {/* 2. Shrinathji & Holy Pichwai Cows */}
          <BlessingCard
            title="Shree Shrinathji"
            mantra="श्री कृष्णः शरणं मम"
            description="With the divine Pushtimarg grace of Lord Shrinathji lifting Govardhan, blessing the couple with unconditional love and bliss."
            artwork={<ShrinathjiArtwork className="w-24 h-28 sm:w-28 sm:h-32" />}
            companion={
              <div className="flex items-center justify-center gap-3">
                <PichwaiCowArtwork className="w-16 h-12" facing="right" />
                <span className="text-[11px] font-serif italic text-deep-burgundy/70">
                  Sacred Kamdhenu Gau Mata
                </span>
                <PichwaiCowArtwork className="w-16 h-12" facing="left" />
              </div>
            }
          />

          {/* 3. Mahadev & Parvati Ji */}
          <BlessingCard
            title="Shiv & Shakti Kalyana"
            mantra="कर्पूरगौरं करुणावतारम्"
            description="Symbolizing eternal marital companionship, cosmic devotion, and unwavering mutual respect, guided by Shiva and Parvati."
            artwork={<ShivParvatiArtwork className="w-28 h-24 sm:w-32 sm:h-28" />}
            companion={
              <div className="flex items-center gap-2 text-xs font-serif text-deep-burgundy/70">
                <span className="w-2 h-2 rounded-full bg-royal-maroon" />
                <span>Eternal Kalyana • Sacred Saptapadi</span>
              </div>
            }
          />

          {/* 4. Shree Radha Krishna & Holy Cows */}
          <BlessingCard
            title="Shree Radha Krishna"
            mantra="राधे राधे • प्रेम स्वरूपम्"
            description="Inspiring timeless selfless love, soul harmony, and joyful celebrations, accompanied by the melodious sacred flute in Vrindavan."
            artwork={<RadhaKrishnaArtwork className="w-28 h-24 sm:w-32 sm:h-28" />}
            companion={
              <div className="flex items-center justify-center gap-3">
                <PichwaiCowArtwork className="w-16 h-12" facing="right" />
                <span className="text-[11px] font-serif italic text-deep-burgundy/70">
                  Vrindavan Gau Prem
                </span>
                <PichwaiCowArtwork className="w-16 h-12" facing="left" />
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}

export default DivineBlessingsSection;
