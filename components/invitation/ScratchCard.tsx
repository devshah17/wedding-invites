'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, Eye } from 'lucide-react';
import { weddingConfig } from '@/config/wedding';
import { formatWeddingDate, getDayOfWeek } from '@/lib/date';
import { CountdownTimer } from './CountdownTimer';
import { SectionReveal } from '@/components/animations/SectionReveal';
import { DecorativeDivider } from '@/components/animations/DecorativeDivider';

export function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  const weddingDateStr = weddingConfig.weddingDate;
  const formattedDate = formatWeddingDate(weddingDateStr, weddingConfig.timezone);
  const dayName = getDayOfWeek(weddingDateStr, weddingConfig.timezone);

  // Initialize canvas with luxurious gold & maroon metallic gradient
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Handle high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Create rich metallic gold & royal maroon gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#C99A45');
    gradient.addColorStop(0.3, '#E8C872');
    gradient.addColorStop(0.5, '#FAF0D7');
    gradient.addColorStop(0.7, '#D4AF37');
    gradient.addColorStop(1, '#A07628');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle metallic texture overlay
    ctx.fillStyle = 'rgba(84, 20, 38, 0.08)';
    for (let i = 0; i < width; i += 8) {
      ctx.fillRect(i, 0, 4, height);
    }

    // Traditional ornamental border inside canvas
    ctx.strokeStyle = '#781F35';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    ctx.strokeStyle = '#FAF0D7';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Gold foil text instructions
    ctx.fillStyle = '#541426';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Top message
    ctx.font = '600 13px Montserrat, sans-serif';
    ctx.fillText('✨ SOMETHING SPECIAL IS HERE ✨', width / 2, height / 2 - 32);

    // Center main call-to-action
    ctx.font = 'bold 20px Cormorant Garamond, serif';
    ctx.fillText('Scratch to Reveal Our Date', width / 2, height / 2);

    // Hint
    ctx.font = 'italic 12px Montserrat, sans-serif';
    ctx.fillStyle = '#781F35';
    ctx.fillText('Touch & scratch or drag cursor', width / 2, height / 2 + 32);
  }, []);

  useEffect(() => {
    initCanvas();

    const handleResize = () => {
      if (!isRevealed) {
        initCanvas();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas, isRevealed]);

  const triggerReveal = useCallback(() => {
    setIsRevealed(true);
  }, []);

  // Calculate scratched area percentage
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width;
    const height = canvas.height;

    try {
      // Sample pixels with a step of 16 for high performance
      const step = Math.floor(16 * dpr);
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      let transparentCount = 0;
      let totalCount = 0;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4 + 3; // alpha channel
          if (data[index] < 128) {
            transparentCount++;
          }
          totalCount++;
        }
      }

      const percent = Math.round((transparentCount / totalCount) * 100);
      setScratchPercent(percent);

      // Auto-reveal when >= 45% is scratched
      if (percent >= 45) {
        triggerReveal();
      }
    } catch {
      // Fallback
    }
  }, [isRevealed, triggerReveal]);

  // Erasing stroke on canvas
  const erasePoint = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 32, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    erasePoint(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    erasePoint(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsScratching(false);
  };

  // Touch Handlers with touch-action: none to prevent mobile screen scroll
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    setIsScratching(true);
    if (e.touches[0]) {
      erasePoint(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isScratching) return;
    if (e.touches[0]) {
      erasePoint(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    setIsScratching(false);
  };

  return (
    <section id="date" className="relative py-20 px-4 sm:px-6 lg:px-8 bg-ivory overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Heading */}
        <SectionReveal direction="up">
          <div className="inline-flex items-center justify-center space-x-2 text-antique-gold mb-2">
            <Sparkles className="w-5 h-5 text-antique-gold animate-pulse" />
            <span className="font-sans text-xs tracking-widest uppercase font-semibold text-antique-gold">
              Auspicious Union
            </span>
            <Sparkles className="w-5 h-5 text-antique-gold animate-pulse" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-royal-maroon font-bold tracking-tight">
            Save Our Auspicious Date
          </h2>
          <p className="mt-3 text-deep-burgundy/80 font-serif italic text-base sm:text-lg max-w-xl mx-auto">
            Something sacred and beautiful is about to unfold. Scratch to reveal the day two souls become one!
          </p>
          <DecorativeDivider variant="ornate" className="my-6" />
        </SectionReveal>

        {/* Scratch Card Container */}
        <SectionReveal direction="up" delay={0.2}>
          <div
            ref={containerRef}
            className="relative mx-auto mt-6 w-full max-w-[340px] sm:max-w-md h-60 sm:h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-antique-gold/40 bg-gradient-to-br from-champagne/40 via-ivory to-soft-blush/30"
          >
            {/* Underlying Revealed Card Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#FFFDF9] via-[#FAF3E0] to-[#F5E6CC] text-royal-maroon select-none">
              {/* Corner Ornaments */}
              <div className="absolute top-3 left-3 text-antique-gold/60">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M2 22V6a4 4 0 0 1 4-4h16" strokeWidth="1.5" />
                  <circle cx="6" cy="6" r="2" fill="currentColor" />
                </svg>
              </div>
              <div className="absolute top-3 right-3 text-antique-gold/60 rotate-90">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M2 22V6a4 4 0 0 1 4-4h16" strokeWidth="1.5" />
                  <circle cx="6" cy="6" r="2" fill="currentColor" />
                </svg>
              </div>
              <div className="absolute bottom-3 left-3 text-antique-gold/60 -rotate-90">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M2 22V6a4 4 0 0 1 4-4h16" strokeWidth="1.5" />
                  <circle cx="6" cy="6" r="2" fill="currentColor" />
                </svg>
              </div>
              <div className="absolute bottom-3 right-3 text-antique-gold/60 rotate-180">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M2 22V6a4 4 0 0 1 4-4h16" strokeWidth="1.5" />
                  <circle cx="6" cy="6" r="2" fill="currentColor" />
                </svg>
              </div>

              {/* Revealed Badge */}
              <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-royal-maroon/10 text-royal-maroon text-xs font-sans font-semibold uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5 text-royal-maroon" />
                <span>Save The Date</span>
              </div>

              {/* Day of Week */}
              <div className="text-sm font-sans tracking-widest uppercase font-semibold text-antique-gold">
                {dayName}
              </div>

              {/* Wedding Date Display */}
              <div className="my-1.5 text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-royal-maroon tracking-tight">
                {formattedDate}
              </div>

              {/* Couple Tagline */}
              <div className="text-xs sm:text-sm font-script text-antique-gold text-2xl mt-1">
                {weddingConfig.groom.firstName} & {weddingConfig.bride.firstName}
              </div>

              <div className="mt-2 text-xs font-sans text-deep-burgundy/70 tracking-wide">
                Petlad, Gujarat • Chitri, Rajasthan
              </div>
            </div>

            {/* Opaque HTML5 Canvas Scratch Layer */}
            <AnimatePresence>
              {!isRevealed && (
                <motion.canvas
                  ref={canvasRef}
                  exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.6, ease: 'easeOut' } }}
                  className="absolute inset-0 w-full h-full cursor-pointer touch-none z-10"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                />
              )}
            </AnimatePresence>

            {/* Scratch progress indicator */}
            {!isRevealed && scratchPercent > 0 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                <span className="text-[11px] font-sans font-semibold text-deep-burgundy bg-ivory/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-antique-gold/30">
                  {scratchPercent}% Scratched
                </span>
              </div>
            )}
          </div>

          {/* Accessible Alternative Reveal Button */}
          {!isRevealed && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={triggerReveal}
                className="inline-flex items-center gap-2 text-xs font-sans font-medium text-antique-gold hover:text-royal-maroon transition-colors py-1.5 px-3 rounded-lg border border-antique-gold/30 hover:border-royal-maroon/40 bg-ivory/60"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Tap here to reveal instantly</span>
              </button>
            </div>
          )}
        </SectionReveal>

        {/* Live Countdown Timer */}
        <div className="mt-12">
          <CountdownTimer />
        </div>
      </div>
    </section>
  );
}

export default ScratchCard;
