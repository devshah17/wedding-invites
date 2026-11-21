'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { weddingConfig } from '@/config/wedding';
import { formatWeddingDate } from '@/lib/date';
import { DecorativeDivider } from '@/components/animations/DecorativeDivider';
import Image from 'next/image';
import { RoyalElephantArtwork } from '@/components/sacred/DeityArtworks';
import { usePersonalizedInvitation } from '@/context/InvitationContext';

/**
 * Traditional Indian Toran (hanging arch) SVG Border
 * Animated to draw/expand outwards from center.
 */
function ToranBorder({ inverted = false }: { inverted?: boolean }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ originX: 0.5 }}
      className={`w-full max-w-4xl px-4 pointer-events-none select-none ${
        inverted ? 'rotate-180 -mt-2' : '-mb-2'
      }`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1000 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-antique-gold drop-shadow-xs"
      >
        {/* Top parallel trim lines */}
        <line
          x1="20"
          y1="8"
          x2="980"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeOpacity="0.85"
        />
        <line
          x1="40"
          y1="13"
          x2="960"
          y2="13"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="4 4"
          strokeOpacity="0.6"
        />

        {/* Small bead dots along top line */}
        {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((cx) => (
          <circle
            key={`bead-${cx}`}
            cx={cx}
            cy="8"
            r="2"
            fill="currentColor"
            opacity="0.9"
          />
        ))}

        {/* 7 Scalloped arches */}
        {[
          { start: 80, mid: 140, end: 200 },
          { start: 200, mid: 260, end: 320 },
          { start: 320, mid: 380, end: 440 },
          { start: 440, mid: 500, end: 560 }, // Center
          { start: 560, mid: 620, end: 680 },
          { start: 680, mid: 740, end: 800 },
          { start: 800, mid: 860, end: 920 },
        ].map((arch, idx) => (
          <g key={`arch-${idx}`}>
            {/* Outer scalloped curve */}
            <path
              d={`M ${arch.start} 13 Q ${arch.mid} 44 ${arch.end} 13`}
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
            {/* Inner parallel curve */}
            <path
              d={`M ${arch.start + 8} 13 Q ${arch.mid} 38 ${arch.end - 8} 13`}
              stroke="currentColor"
              strokeWidth="0.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
            {/* Mango / Kalash petal inside each scallop */}
            <path
              d={`M ${arch.mid} 20 C ${arch.mid - 8} 27, ${arch.mid - 4} 34, ${arch.mid} 37 C ${arch.mid + 4} 34, ${arch.mid + 8} 27, ${arch.mid} 20 Z`}
              fill="currentColor"
              opacity="0.25"
            />
            {/* Hanging ghungroo/bell at each scallop center drop */}
            <line
              x1={arch.mid}
              y1="44"
              x2={arch.mid}
              y2="52"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.75"
            />
            <circle
              cx={arch.mid}
              cy="54"
              r="2.5"
              fill="currentColor"
              opacity="0.9"
            />
            <circle
              cx={arch.mid}
              cy="59"
              r="1.2"
              fill="currentColor"
              opacity="0.7"
            />
          </g>
        ))}

        {/* Small hanging droplets at cusp points between scallops */}
        {[200, 320, 440, 560, 680, 800].map((cx) => (
          <g key={`cusp-${cx}`}>
            <line
              x1={cx}
              y1="13"
              x2={cx}
              y2="24"
              stroke="currentColor"
              strokeWidth="0.9"
              opacity="0.6"
            />
            <circle cx={cx} cy="26" r="1.8" fill="currentColor" opacity="0.8" />
          </g>
        ))}

        {/* Central apex motif on center arch (x=500) */}
        <path
          d="M 500 2 C 496 5, 492 8, 492 11 C 492 13, 496 13, 500 13 C 504 13, 508 13, 508 11 C 508 8, 504 2, 500 2 Z"
          fill="currentColor"
          opacity="0.9"
        />
        <circle cx="500" cy="2" r="1.5" fill="#FFF9F0" />
      </svg>
    </motion.div>
  );
}

/**
 * Traditional Indian Floral Corner Flourish
 */
function CornerOrnament({
  position,
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-3 left-3 sm:top-6 sm:left-6';
      case 'top-right':
        return 'top-3 right-3 sm:top-6 sm:right-6 scale-x-[-1]';
      case 'bottom-left':
        return 'bottom-3 left-3 sm:bottom-6 sm:left-6 scale-y-[-1]';
      case 'bottom-right':
        return 'bottom-3 right-3 sm:bottom-6 sm:right-6 scale-x-[-1] scale-y-[-1]';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 0.85, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute ${getPositionClasses()} pointer-events-none select-none z-10`}
      aria-hidden="true"
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 sm:w-14 sm:h-14 text-antique-gold drop-shadow-xs"
      >
        {/* Outer border curves */}
        <path
          d="M 4 52 L 4 16 C 4 9.37, 9.37 4, 16 4 L 52 4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 9 46 L 9 18 C 9 13.03, 13.03 9, 18 9 L 46 9"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="2 2"
          opacity="0.6"
        />

        {/* Corner floral flourish */}
        <path
          d="M 12 12 C 16 22, 22 16, 26 26 C 21 27, 16 23, 12 12 Z"
          fill="currentColor"
          opacity="0.5"
        />
        <circle cx="15" cy="15" r="2.5" fill="currentColor" opacity="0.85" />
        <circle cx="28" cy="28" r="1.8" fill="currentColor" opacity="0.7" />

        {/* Small curls */}
        <path
          d="M 4 28 C 7 24, 12 26, 11 31 C 10 35, 6 34, 4 30"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M 28 4 C 24 7, 26 12, 31 11 C 35 10, 34 6, 30 4"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
    </motion.div>
  );
}

/**
 * Faint Watermark Mandala Background
 */
function MandalaWatermark() {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.035] w-[500px] h-[500px] md:w-[720px] md:h-[720px] z-0"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-antique-gold animate-[spin_160s_linear_infinite]"
      >
        <circle
          cx="200"
          cy="200"
          r="190"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="200"
          cy="200"
          r="180"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeDasharray="4 4"
        />
        <circle
          cx="200"
          cy="200"
          r="150"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle
          cx="200"
          cy="200"
          r="110"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle
          cx="200"
          cy="200"
          r="70"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle
          cx="200"
          cy="200"
          r="30"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="200" cy="200" r="10" fill="currentColor" />

        {/* 16 Radial Petals */}
        {[
          0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270,
          292.5, 315, 337.5,
        ].map((angle) => (
          <g key={angle} transform={`rotate(${angle} 200 200)`}>
            {/* Inner petal */}
            <path
              d="M 200 130 C 188 155, 188 175, 200 190 C 212 175, 212 155, 200 130 Z"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="currentColor"
              fillOpacity="0.12"
            />
            {/* Outer lotus petal */}
            <path
              d="M 200 20 C 175 65, 175 110, 200 150 C 225 110, 225 65, 200 20 Z"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="currentColor"
              fillOpacity="0.08"
            />
            <circle cx="200" cy="50" r="3" fill="currentColor" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/**
 * Main Hero Section Component (Couple Introduction)
 * Appears after the royal wedding envelope opens.
 */
export function InvitationHero() {
  const { invitation } = usePersonalizedInvitation();
  const groomName = weddingConfig.groom.firstName || 'Dev';
  const brideName = weddingConfig.bride.firstName || 'Vishakha';

  // Format wedding date cleanly using existing helper
  const formattedWeddingDate = weddingConfig.weddingDate
    ? formatWeddingDate(weddingConfig.weddingDate, weddingConfig.timezone)
    : 'Monday, 15th February 2027';

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex flex-col justify-between items-center py-10 md:py-16 px-4 md:px-8 overflow-hidden bg-[radial-gradient(ellipse_at_center,_#FFFFFF_20%,_#FDFBF7_60%,_#F7F4EE_100%)] text-deep-burgundy"
    >
      {/* 4 Corner Ornaments */}
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />
      <CornerOrnament position="bottom-left" />
      <CornerOrnament position="bottom-right" />

      {/* Background Watermark Mandala */}
      <MandalaWatermark />

      {/* 1. Top Ornamental Toran Border */}
      <div className="w-full flex justify-center z-10 pt-2">
        <ToranBorder inverted={false} />
      </div>

      {/* Center Main Invitation Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-4xl mx-auto my-auto py-6 sm:py-8 px-2">
        {/* Lord Ganpati Auspicious Blessing & Flanking Royal Elephants */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-4 sm:gap-8 mb-2"
        >
          <RoyalElephantArtwork className="w-14 h-12 sm:w-20 sm:h-16 opacity-85 hidden sm:block" facing="right" />
          <div className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative flex justify-center mb-2 filter drop-shadow-[0_8px_20px_rgba(201,154,69,0.35)]"
            >
              <Image
                src="/images/ganpati.png"
                alt="Lord Shree Ganesha"
                width={130}
                height={160}
                priority
                className="w-24 sm:w-28 md:w-32 h-auto max-w-full select-none object-contain"
              />
            </motion.div>
            <h2 className="font-serif text-sm md:text-base tracking-[0.28em] text-antique-gold font-bold select-none">
              ॐ श्री गणेशाय नमः
            </h2>
          </div>
          <RoyalElephantArtwork className="w-14 h-12 sm:w-20 sm:h-16 opacity-85 hidden sm:block" facing="left" />
        </motion.div>

        {/* 3. Sub-blessing: "Together with our families" */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-xs sm:text-sm tracking-[0.25em] md:tracking-[0.3em] uppercase text-deep-burgundy/90 font-medium mt-1 mb-4 md:mb-6"
        >
          Together with our families
        </motion.p>

        {/* Couple Names & Ampersand Presentation */}
        <div className="flex flex-col items-center justify-center w-full py-2">
          {/* 4. Groom Name: Slides in from left */}
          <motion.div
            initial={{ opacity: 0, x: -70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.0,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full"
          >
            <h1 className="font-script text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-royal-maroon font-normal leading-tight select-none tracking-normal drop-shadow-xs">
              {groomName}
            </h1>
          </motion.div>

          {/* 5. Ornamental Ampersand surrounded by floral SVG motifs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex items-center justify-center gap-3 sm:gap-6 my-1 sm:my-2"
          >
            {/* Left floral flourish vine */}
            <svg
              width="64"
              height="28"
              viewBox="0 0 64 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-antique-gold hidden sm:block drop-shadow-xs"
              aria-hidden="true"
            >
              <path
                d="M 2 14 C 14 14, 20 4, 34 14 C 42 20, 52 10, 62 14"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <circle cx="34" cy="14" r="2.5" fill="currentColor" />
              <path
                d="M 26 8 C 27 3, 31 3, 32 7"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="28" cy="3" r="1.5" fill="currentColor" />
              <path
                d="M 44 19 C 45 23, 49 23, 50 19"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="47" cy="24" r="1.5" fill="currentColor" />
            </svg>

            {/* Ornamental Ampersand in script font */}
            <span className="font-script text-4xl sm:text-5xl md:text-6xl text-antique-gold leading-none select-none drop-shadow-xs px-2">
              &amp;
            </span>

            {/* Right floral flourish vine (mirrored) */}
            <svg
              width="64"
              height="28"
              viewBox="0 0 64 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-antique-gold hidden sm:block scale-x-[-1] drop-shadow-xs"
              aria-hidden="true"
            >
              <path
                d="M 2 14 C 14 14, 20 4, 34 14 C 42 20, 52 10, 62 14"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <circle cx="34" cy="14" r="2.5" fill="currentColor" />
              <path
                d="M 26 8 C 27 3, 31 3, 32 7"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="28" cy="3" r="1.5" fill="currentColor" />
              <path
                d="M 44 19 C 45 23, 49 23, 50 19"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="47" cy="24" r="1.5" fill="currentColor" />
            </svg>
          </motion.div>

          {/* 6. Bride Name: Slides in from right */}
          <motion.div
            initial={{ opacity: 0, x: 70 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.0,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full"
          >
            <h1 className="font-script text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-royal-maroon font-normal leading-tight select-none tracking-normal drop-shadow-xs">
              {brideName}
            </h1>
          </motion.div>
        </div>

        {/* Small decorative divider separator */}
        <DecorativeDivider
          variant="simple"
          animated={true}
          className="my-3 sm:my-4 max-w-xs"
        />

        {/* 7. Invitation Text: Personalized or Generic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl mx-auto text-center mt-2 px-2"
        >
          {invitation ? (
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-antique-gold/20 via-champagne/40 to-antique-gold/20 border border-antique-gold/50 shadow-xs">
                <Sparkles className="w-4 h-4 text-antique-gold" />
                <span className="font-serif text-sm sm:text-base font-bold text-royal-maroon tracking-wide">
                  Cordially Inviting {invitation.guestName}
                </span>
                <Sparkles className="w-4 h-4 text-antique-gold" />
              </div>

              <p className="font-serif text-sm sm:text-base text-deep-burgundy/85 tracking-wide font-normal leading-relaxed">
                To celebrate their joyous wedding ceremonies
              </p>

              {invitation.note && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/90 border border-antique-gold/40 shadow-md text-xs sm:text-sm font-serif italic text-deep-burgundy max-w-md mx-auto">
                  <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-antique-gold mb-1 not-italic">
                    💌 A Special Note For You
                  </div>
                  &ldquo;{invitation.note}&rdquo;
                </div>
              )}
            </div>
          ) : (
            <p className="font-serif text-base sm:text-lg md:text-xl text-deep-burgundy/85 tracking-wide max-w-md mx-auto font-normal leading-relaxed">
              Are delighted to invite you to celebrate their wedding
            </p>
          )}
        </motion.div>

        {/* 8. Wedding Date: Formatted wedding date */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 sm:mt-5 flex flex-col items-center gap-1.5"
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="w-6 sm:w-12 h-[1px] bg-gradient-to-r from-transparent to-antique-gold/70" />
            <time className="font-serif text-base sm:text-xl md:text-2xl text-antique-gold font-semibold tracking-wide text-center">
              {formattedWeddingDate}
            </time>
            <span className="w-6 sm:w-12 h-[1px] bg-gradient-to-l from-transparent to-antique-gold/70" />
          </div>
        </motion.div>
      </div>

      {/* 9. Bottom Ornamental Toran Border (Mirrored/Inverted) */}
      <div className="w-full flex justify-center z-10 pb-2">
        <ToranBorder inverted={true} />
      </div>
    </section>
  );
}

export default InvitationHero;
