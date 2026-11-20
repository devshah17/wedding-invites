'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { weddingConfig } from '@/config/wedding';

interface LoadingScreenProps {
  onLoaded?: () => void;
}

export function LoadingScreen({ onLoaded }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fast initial entrance display (700ms) to ensure smooth hydration without blocking
    const timer = setTimeout(() => {
      setIsLoading(false);
      onLoaded?.();
    }, 800);

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep-burgundy text-champagne select-none"
        >
          {/* Subtle Traditional Arch background */}
          <div className="relative flex flex-col items-center">
            {/* Monogram Seal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className="w-24 h-24 rounded-full border-2 border-antique-gold/60 p-1 flex items-center justify-center shadow-2xl bg-royal-maroon/60"
            >
              <div className="w-full h-full rounded-full border border-antique-gold/40 flex items-center justify-center px-2">
                <span className="font-script text-3xl sm:text-4xl text-antique-gold whitespace-nowrap leading-none">
                  {weddingConfig.coupleInitials}
                </span>
              </div>
            </motion.div>

            {/* Names */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-4 font-serif text-lg tracking-widest text-champagne uppercase font-semibold"
            >
              {weddingConfig.groom.firstName} & {weddingConfig.bride.firstName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-1 font-serif italic text-xs text-antique-gold"
            >
              Opening an auspicious celebration...
            </motion.p>

            {/* Animated Golden Progress Bar */}
            <div className="mt-6 w-32 h-0.5 bg-royal-maroon overflow-hidden rounded-full border border-antique-gold/30">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                className="w-full h-full bg-gradient-to-r from-transparent via-antique-gold to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingScreen;
