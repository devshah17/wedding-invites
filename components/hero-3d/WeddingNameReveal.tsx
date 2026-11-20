'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface WeddingNameRevealProps {
  /** Scroll progress (0.0 to 1.0) */
  scrollProgress: number;
}

export function WeddingNameReveal({ scrollProgress }: WeddingNameRevealProps) {
  // Scene 1: Sky Title (Matching Screenshot 1) - visible at 0.0, dissolves as camera dives at 0.18
  const isSkyScene = scrollProgress < 0.20;
  const skyOpacity = Math.max(0, 1 - scrollProgress * 5.5);

  // Scene 5: Final Temple Reveal (Matching Screenshot 3) - fades in at 0.72 - 1.0
  const isFinalScene = scrollProgress >= 0.70;
  const revealProgress = Math.max(0, Math.min(1, (scrollProgress - 0.70) / 0.24));

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 sm:p-10 z-20 overflow-hidden">
      {/* Top Auspicious Invocation Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{
          opacity: isSkyScene ? skyOpacity : isFinalScene ? revealProgress : 0,
          y: isSkyScene ? 0 : isFinalScene ? 0 : -8,
        }}
        transition={{ duration: 0.3 }}
        className="w-full text-center pt-2 sm:pt-4"
      >
        <span className="font-serif text-xs sm:text-sm tracking-[0.35em] uppercase text-antique-gold font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          || ॐ नमः शिवाय ||
        </span>
      </motion.div>

      {/* CENTER TYPOGRAPHY CONTAINER */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto my-auto -mt-4 sm:-mt-8">
        {/* SCENE 1: SKY NAMES (Dev weds Vishakha floating in the high Himalayan sky) */}
        {isSkyScene && (
          <div
            style={{
              opacity: skyOpacity,
              transform: `translate3d(0, ${scrollProgress * -30}px, 0)`,
            }}
            className="flex flex-col items-center transition-opacity"
          >
            <h1 className="font-serif text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[0.08em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF8] via-[#FCE39E] to-[#CCA043] drop-shadow-[0_4px_24px_rgba(20,40,75,0.7)]">
              DEV
            </h1>

            <div className="flex items-center gap-3 my-1">
              <span className="h-[1px] w-8 sm:w-16 bg-antique-gold/70 shadow" />
              <span className="font-script text-2xl xs:text-3xl sm:text-4xl text-[#FFF3DB] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] px-2">
                weds
              </span>
              <span className="h-[1px] w-8 sm:w-16 bg-antique-gold/70 shadow" />
            </div>

            <h1 className="font-serif text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-[0.08em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF8] via-[#FCE39E] to-[#CCA043] drop-shadow-[0_4px_24px_rgba(20,40,75,0.7)]">
              VISHAKHA
            </h1>
          </div>
        )}

        {/* SCENE 5: FINAL TEMPLE REVEAL (Outside Kedarnath Temple) */}
        {isFinalScene && (
          <div
            style={{
              opacity: revealProgress,
              transform: `translate3d(0, ${(1 - revealProgress) * 25}px, 0)`,
            }}
            className="flex flex-col items-center transition-all"
          >
            {/* Subtle Golden Divider */}
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-antique-gold to-transparent mb-3" />

            <h1 className="font-serif text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-bold tracking-[0.06em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF8] via-[#FCE39E] to-[#CCA043] drop-shadow-[0_4px_20px_rgba(30,10,18,0.9)]">
              DEV
            </h1>

            <div className="flex items-center gap-3 my-1 sm:my-2">
              <span className="h-[1px] w-10 sm:w-20 bg-antique-gold/70 shadow" />
              <span className="font-script text-2xl xs:text-3xl sm:text-4xl text-[#FFF5DC] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] px-3">
                weds
              </span>
              <span className="h-[1px] w-10 sm:w-20 bg-antique-gold/70 shadow" />
            </div>

            <h1 className="font-serif text-5xl xs:text-6xl sm:text-7xl md:text-8xl font-bold tracking-[0.06em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF8] via-[#FCE39E] to-[#CCA043] drop-shadow-[0_4px_20px_rgba(30,10,18,0.9)]">
              VISHAKHA
            </h1>

            <p className="mt-3 sm:mt-5 font-serif italic text-base sm:text-lg text-[#FFF3DB] tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-light max-w-md">
              &ldquo;Two souls, one beautiful journey.&rdquo;
            </p>

            <div className="mt-4 px-4 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-antique-gold/50 shadow-xl">
              <span className="font-sans text-[11px] sm:text-xs tracking-widest uppercase text-champagne font-medium">
                Kedarnath Blessings &bull; January 2027
              </span>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM SCROLL PROMPT */}
      <div className="w-full flex justify-center pb-4 sm:pb-8">
        {isSkyScene && (
          <div
            style={{ opacity: skyOpacity }}
            className="flex flex-col items-center gap-2 transition-opacity"
          >
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-semibold">
              Scroll to begin sacred journey
            </span>
            <div className="w-5 h-8 rounded-full border-2 border-white/70 flex items-start justify-center p-1 shadow-lg bg-black/20">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 rounded-full bg-antique-gold shadow"
              />
            </div>
          </div>
        )}

        {isFinalScene && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: revealProgress }}
            className="flex flex-col items-center gap-1.5"
          >
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#FFF3DB] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-medium">
              Scroll down for wedding ceremonies & invitation
            </span>
            <div className="text-antique-gold text-lg animate-bounce drop-shadow">
              ↓
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default WeddingNameReveal;
