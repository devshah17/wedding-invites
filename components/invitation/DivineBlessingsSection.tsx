'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { SectionReveal } from '@/components/animations/SectionReveal';
import { DecorativeDivider } from '@/components/animations/DecorativeDivider';

interface BlessingCardProps {
  title: string;
  mantra: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  companionText: string;
  aspectClass?: string;
}

function BlessingCard({
  title,
  mantra,
  description,
  imageSrc,
  imageAlt,
  companionText,
  aspectClass = 'w-44 h-56 sm:w-48 sm:h-64',
}: BlessingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
      className="relative flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-white/95 border border-antique-gold/35 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-xs group overflow-hidden"
    >
      {/* Decorative top gold rim */}
      <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-antique-gold to-transparent" />

      {/* Subtle corner aura accents */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-radial from-antique-gold/15 to-transparent rounded-full pointer-events-none" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-radial from-antique-gold/15 to-transparent rounded-full pointer-events-none" />

      {/* Main Deity Shrine Container with Flanking Kamdhenu Cows */}
      <div className="relative mb-5 w-full flex items-center justify-center">
        {/* Flanking Left Kamdhenu Cow (facing towards deity) */}
        <div className="hidden sm:block absolute left-0 md:left-2 bottom-1 w-16 lg:w-20 h-auto opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none select-none">
          <Image
            src="/images/sacred/kamdhenu_left.png"
            alt="Sacred Kamdhenu Cow"
            width={120}
            height={110}
            className="w-full h-auto object-contain filter drop-shadow-[0_4px_10px_rgba(201,154,69,0.3)]"
          />
        </div>

        {/* Central Shrine Arch with Celestial Radiance */}
        <div className="relative flex items-center justify-center p-3 sm:p-4 rounded-3xl bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5ECE0] border border-antique-gold/40 shadow-inner group-hover:shadow-md transition-all duration-500">
          {/* Celestial radial aura behind deity */}
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_center,_rgba(232,200,114,0.35)_0%,_rgba(255,255,255,0)_70%)] pointer-events-none" />

          {/* Deity Transparent Artwork */}
          <div className={`relative z-10 ${aspectClass} group-hover:scale-105 transition-transform duration-500 flex items-center justify-center`}>
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 176px, 220px"
              className="object-contain filter drop-shadow-[0_8px_20px_rgba(201,154,69,0.35)] select-none"
              priority
            />
          </div>
        </div>

        {/* Flanking Right Kamdhenu Cow (facing towards deity) */}
        <div className="hidden sm:block absolute right-0 md:right-2 bottom-1 w-16 lg:w-20 h-auto opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 pointer-events-none select-none">
          <Image
            src="/images/sacred/kamdhenu_right.png"
            alt="Sacred Kamdhenu Cow"
            width={120}
            height={110}
            className="w-full h-auto object-contain filter drop-shadow-[0_4px_10px_rgba(201,154,69,0.35)]"
          />
        </div>
      </div>

      {/* Mantra / Sacred Shlok Badge */}
      <span className="text-xs sm:text-sm font-serif font-bold text-royal-maroon tracking-wide mb-1.5 px-4 py-1 rounded-full bg-champagne/40 border border-antique-gold/30 shadow-xs">
        {mantra}
      </span>

      {/* Deity Title */}
      <h3 className="text-xl sm:text-2xl font-serif font-bold text-deep-burgundy mt-2 tracking-tight">
        {title}
      </h3>

      {/* Blessing Description */}
      <p className="mt-2 text-xs sm:text-sm font-serif italic text-deep-burgundy/80 leading-relaxed max-w-sm">
        &ldquo;{description}&rdquo;
      </p>

      {/* Companion Sacred Animal Footer Bar */}
      <div className="mt-4 pt-3 w-full border-t border-antique-gold/20 flex items-center justify-center gap-2 sm:gap-3">
        <div className="w-9 sm:w-11 h-auto opacity-90 select-none">
          <Image
            src="/images/sacred/kamdhenu_left.png"
            alt="Sacred Kamdhenu Gau Mata"
            width={60}
            height={55}
            className="w-full h-auto object-contain"
          />
        </div>
        <span className="text-[11px] sm:text-xs font-serif italic text-deep-burgundy/80 tracking-wide text-center">
          {companionText}
        </span>
        <div className="w-9 sm:w-11 h-auto opacity-90 select-none">
          <Image
            src="/images/sacred/kamdhenu_right.png"
            alt="Sacred Kamdhenu Gau Mata"
            width={60}
            height={55}
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </motion.div>
  );
}

export function DivineBlessingsSection() {
  return (
    <section id="blessings" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-[#FDFBF7] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <SectionReveal direction="up">
          <div className="text-center mb-14">
            {/* Header Flanked by Kamdhenu Cows */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 mb-3">
              <div className="w-16 h-14 sm:w-22 sm:h-18 opacity-90 hidden sm:block">
                <Image
                  src="/images/sacred/kamdhenu_left.png"
                  alt="Sacred Kamdhenu Gau Mata"
                  width={120}
                  height={100}
                  className="w-full h-full object-contain filter drop-shadow-sm select-none pointer-events-none"
                />
              </div>
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
              <div className="w-16 h-14 sm:w-22 sm:h-18 opacity-90 hidden sm:block">
                <Image
                  src="/images/sacred/kamdhenu_right.png"
                  alt="Sacred Kamdhenu Gau Mata"
                  width={120}
                  height={100}
                  className="w-full h-full object-contain filter drop-shadow-sm select-none pointer-events-none"
                />
              </div>
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
            imageSrc="/images/sacred/ganpati.png"
            imageAlt="Lord Shri Ganesha on Lotus"
            companionText="Pratham Poojya • Auspicious Beginnings"
            aspectClass="w-44 h-56 sm:w-48 sm:h-64"
          />

          {/* 2. Shrinathji & Holy Pichwai Cows */}
          <BlessingCard
            title="Shree Shrinathji"
            mantra="श्री कृष्णः शरणं मम"
            description="With the divine Pushtimarg grace of Lord Shrinathji lifting Govardhan, blessing the couple with unconditional love and bliss."
            imageSrc="/images/sacred/shrinathji.png"
            imageAlt="Lord Shrinathji Lifting Govardhan"
            companionText="Pushtimarg Grace • Sacred Kamdhenu Gau Mata"
            aspectClass="w-40 h-56 sm:w-44 sm:h-64"
          />

          {/* 3. Mahadev & Parvati Ji */}
          <BlessingCard
            title="Shiv & Shakti Kalyana"
            mantra="कर्पूरगौरं करुणावतारम्"
            description="Symbolizing eternal marital companionship, cosmic devotion, and unwavering mutual respect, guided by Shiva and Parvati."
            imageSrc="/images/sacred/shivparvati.png"
            imageAlt="Lord Shiva and Mata Parvati on Mount Kailash"
            companionText="Eternal Kalyana • Sacred Saptapadi"
            aspectClass="w-48 h-56 sm:w-52 sm:h-64"
          />

          {/* 4. Shree Radha Krishna */}
          <BlessingCard
            title="Shree Radha Krishna"
            mantra="राधे राधे • प्रेम स्वरूपम्"
            description="Inspiring timeless selfless love, soul harmony, and joyful celebrations, accompanied by the melodious sacred flute in Vrindavan."
            imageSrc="/images/sacred/radhakrishna.png"
            imageAlt="Shree Radha Krishna in Vrindavan"
            companionText="Vrindavan Gau Prem • Eternal Divine Love"
            aspectClass="w-42 h-56 sm:w-46 sm:h-64"
          />
        </div>
      </div>
    </section>
  );
}

export default DivineBlessingsSection;
