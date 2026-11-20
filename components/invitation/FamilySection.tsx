'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { groomFamily, brideFamily } from '@/config/families';
import type { FamilySide } from '@/types/family';
import { SectionReveal } from '@/components/animations/SectionReveal';
import { DecorativeDivider } from '@/components/animations/DecorativeDivider';

/**
 * Corner floral ornament for family panels
 */
function PanelCornerFlourish({ className = '' }: { className?: string }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-antique-gold/50 pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <path
        d="M 2 34 L 2 10 C 2 5.58, 5.58 2, 10 2 L 34 2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.75" />
      <path
        d="M 6 18 C 9 15, 14 16, 13 21 C 12 24, 8 23, 6 20"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <path
        d="M 18 6 C 15 9, 16 14, 21 13 C 24 12, 23 8, 20 6"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Individual Family Panel Component
 */
function FamilyCard({
  family,
  direction,
}: {
  family: FamilySide;
  direction: 'left' | 'right';
}) {
  const sortedMembers = [...family.members].sort((a, b) => a.order - b.order);

  const containerVariants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -60 : 60,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1] as const,
        when: 'beforeChildren',
        staggerChildren: 0.08,
      },
    },
  };

  const memberItemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="relative flex flex-col justify-between h-full bg-ivory/95 rounded-2xl border border-antique-gold/30 p-6 sm:p-8 md:p-10 shadow-xl shadow-royal-maroon/5 hover:shadow-2xl hover:shadow-royal-maroon/10 transition-shadow duration-500 overflow-hidden"
    >
      {/* Subtle Corner Flourishes */}
      <PanelCornerFlourish className="absolute top-3 left-3" />
      <PanelCornerFlourish className="absolute bottom-3 right-3 rotate-180" />

      {/* Card Content Top */}
      <div>
        {/* Top Decorative Gold Line with Center Diamond */}
        <div className="flex items-center justify-center gap-2.5 w-full max-w-xs mx-auto mb-4">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-antique-gold/40 to-antique-gold" />
          <span className="w-2.5 h-2.5 rotate-45 border border-antique-gold bg-champagne/80 shrink-0" />
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-antique-gold/40 to-antique-gold" />
        </div>

        {/* Family Title */}
        <div className="text-center">
          <span className="font-serif uppercase tracking-[0.25em] text-antique-gold text-xs sm:text-sm font-semibold select-none">
            {family.title}
          </span>

          {/* Family Surname */}
          <h3 className="font-script text-3xl sm:text-4xl md:text-5xl text-royal-maroon font-normal mt-1 mb-2 select-none">
            {family.familyName}
          </h3>
        </div>

        {/* Divider line between header and members */}
        <div className="flex items-center justify-center gap-2 my-4">
          <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-antique-gold/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-antique-gold/60" />
          <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-antique-gold/50" />
        </div>

        {/* Family Members List (Sorted by order) */}
        <div className="space-y-4 sm:space-y-5 my-6 sm:my-8">
          {sortedMembers.map((member, idx) => (
            <motion.div
              key={`${family.side}-${member.relation}-${idx}`}
              variants={memberItemVariants}
              className="flex flex-col items-center text-center"
            >
              <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.2em] text-antique-gold font-semibold mb-0.5 select-none">
                {member.relation}
              </span>
              <span className="font-serif text-base sm:text-lg text-deep-burgundy font-medium leading-snug">
                {member.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Card Content Bottom: Family Message */}
      <div className="mt-4 pt-6 border-t border-antique-gold/20 text-center">
        <p className="font-serif italic text-sm sm:text-base text-deep-burgundy/80 leading-relaxed max-w-md mx-auto">
          &ldquo;{family.message}&rdquo;
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Traditional Jaali Lattice Background Pattern
 */
function SubtleJaaliPattern() {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none opacity-[0.045] mix-blend-multiply"
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="jaali-pattern"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            {/* Traditional Indian Jaali lattice geometry */}
            <circle cx="30" cy="30" r="14" fill="none" stroke="#781F35" strokeWidth="1" />
            <circle cx="30" cy="30" r="4" fill="#781F35" />
            <path
              d="M 30 0 L 30 60 M 0 30 L 60 30"
              stroke="#781F35"
              strokeWidth="0.8"
            />
            <path
              d="M 0 0 L 60 60 M 60 0 L 0 60"
              stroke="#781F35"
              strokeWidth="0.5"
              strokeDasharray="2 3"
            />
            <circle cx="0" cy="0" r="8" fill="none" stroke="#781F35" strokeWidth="0.8" />
            <circle cx="60" cy="0" r="8" fill="none" stroke="#781F35" strokeWidth="0.8" />
            <circle cx="0" cy="60" r="8" fill="none" stroke="#781F35" strokeWidth="0.8" />
            <circle cx="60" cy="60" r="8" fill="none" stroke="#781F35" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#jaali-pattern)" />
      </svg>
    </div>
  );
}

/**
 * FamilySection Component
 * Displays both the Groom's and Bride's families in elegant side-by-side panels.
 */
export function FamilySection() {
  return (
    <section
      id="families"
      className="relative w-full py-16 sm:py-20 md:py-28 px-4 sm:px-6 md:px-10 bg-[#FAF8F5] overflow-hidden"
    >
      {/* Background Jaali Subtle Pattern */}
      <SubtleJaaliPattern />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Heading */}
        <SectionReveal direction="down" duration={0.8} className="text-center mb-8 sm:mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-royal-maroon font-semibold tracking-wide">
            With the Blessings of Our Families
          </h2>

          <DecorativeDivider
            variant="ornate"
            animated={true}
            className="mt-4 mb-2 max-w-md"
          />
        </SectionReveal>

        {/* Family Panels: Desktop 2-column grid, mobile single column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* Groom's Panel: Slides in from left */}
          <FamilyCard family={groomFamily} direction="left" />

          {/* Bride's Panel: Slides in from right */}
          <FamilyCard family={brideFamily} direction="right" />
        </div>
      </div>
    </section>
  );
}

export default FamilySection;
