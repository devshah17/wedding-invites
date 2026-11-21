'use client';

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, Heart } from 'lucide-react';
import { weddingConfig } from '@/config/wedding';
import { formatWeddingDate, getDayOfWeek } from '@/lib/date';
import { CountdownTimer } from './CountdownTimer';
import { SectionReveal } from '@/components/animations/SectionReveal';
import { DecorativeDivider } from '@/components/animations/DecorativeDivider';

interface ShowerPetal {
  id: number;
  x: number; // percentage across screen width (1% to 99%)
  delay: number;
  duration: number;
  size: number;
  swayAmount: number;
  swayDuration: number;
  rotMid: number;
  rotEnd: number;
  type: 'rose' | 'hibiscus' | 'marigold' | 'jasmine' | 'goldFlake';
  isMobileOnly: boolean;
}

interface BurstPetal {
  id: number;
  angle: number;
  distance: number;
  arcHeight: number;
  gravityFall: number;
  size: number;
  rot: number;
  delay: number;
  duration: number;
  type: 'rose' | 'hibiscus' | 'marigold' | 'jasmine' | 'goldFlake' | 'hibiscusBloom';
  color: string;
  isMobile: boolean;
}

const BURST_COLORS = ['#A6192E', '#C41E3A', '#FF2E93', '#FF69B4', '#F59E0B', '#E5C158', '#FFFDF9'];

// Pre-computed deterministic full-screen shower petals (Velvet Rose, Hibiscus, Marigold, Jasmine & Gold)
const SHOWER_PETALS: ShowerPetal[] = (() => {
  const types: ('rose' | 'hibiscus' | 'marigold' | 'jasmine' | 'goldFlake')[] = [
    'rose',
    'rose',
    'hibiscus',
    'marigold',
    'marigold',
    'jasmine',
    'goldFlake',
  ];
  return Array.from({ length: 70 }, (_, i) => {
    const seed = (i * 9301 + 49297) % 233280;
    const r1 = seed / 233280;
    const r2 = ((seed * 9301 + 49297) % 233280) / 233280;
    const r3 = ((seed * 49297 + 9301) % 233280) / 233280;
    const r4 = ((seed * 12345 + 67890) % 233280) / 233280;

    return {
      id: i,
      x: Math.round(r1 * 96) + 2, // 2% to 98% across screen width
      delay: Number((r2 * 2.8).toFixed(2)),
      duration: Number((4.2 + r3 * 2.8).toFixed(2)), // 4.2s to 7.0s smooth fall
      size: Math.round(16 + r4 * 14), // 16px to 30px
      swayAmount: Math.round(18 + r3 * 26), // 18px to 44px lateral drift
      swayDuration: Number((2.0 + r4 * 1.5).toFixed(2)),
      rotMid: Math.round(160 + r1 * 200),
      rotEnd: Math.round(360 + r2 * 360),
      type: types[i % types.length],
      // Filter half of the particles on mobile for 60fps performance and elegant density
      isMobileOnly: i % 2 === 0,
    };
  });
})();

// Pre-computed deterministic central flower burst from card (66 flowers & petals across 3 waves)
const BURST_PETALS: BurstPetal[] = (() => {
  const types: ('rose' | 'hibiscus' | 'marigold' | 'jasmine' | 'goldFlake' | 'hibiscusBloom')[] = [
    'rose',
    'hibiscusBloom',
    'marigold',
    'jasmine',
    'hibiscus',
    'goldFlake',
  ];

  const total = 66;
  return Array.from({ length: total }, (_, i) => {
    const seed = (i * 7919 + 104729) % 233280;
    const r1 = seed / 233280;
    const r2 = ((seed * 9301 + 49297) % 233280) / 233280;
    const r3 = ((seed * 49297 + 9301) % 233280) / 233280;
    const r4 = ((seed * 12345 + 67890) % 233280) / 233280;
    const r5 = ((seed * 34567 + 12345) % 233280) / 233280;

    // 3 concentric expanding waves: 0 = core, 1 = mid plume, 2 = grand outer arc
    const wave = i % 3;
    const baseDist = wave === 0 ? 80 : wave === 1 ? 160 : 245;
    const distance = baseDist + r2 * (wave === 0 ? 60 : wave === 1 ? 75 : 90);

    // Full 360-degree radial spread with natural organic angular jitter
    const angle = (i / total) * Math.PI * 2 + (r1 - 0.5) * 0.35;

    // Upward fountain arc against gravity
    const arcHeight = Math.round(45 + r3 * 65);
    // Gentle settling gravity drop
    const gravityFall = Math.round(25 + r4 * 55);

    const duration = Number((1.5 + wave * 0.28 + r5 * 0.35).toFixed(2));
    const delay = Number((wave * 0.07 + r1 * 0.1).toFixed(2));

    return {
      id: i,
      angle,
      distance,
      arcHeight,
      gravityFall,
      size: Math.round(16 + r3 * 16), // 16px to 32px
      rot: Math.round(r1 * 360),
      delay,
      duration,
      type: types[i % types.length],
      color: BURST_COLORS[i % BURST_COLORS.length],
      // 44 flowers on mobile, all 66 on desktop
      isMobile: wave !== 2,
    };
  });
})();

export function ScratchCard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastCheckTimeRef = useRef<number>(0);

  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [showFlowerShower, setShowFlowerShower] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  const weddingDateStr = weddingConfig.weddingDate;
  const formattedDate = formatWeddingDate(weddingDateStr, weddingConfig.timezone);
  const dayName = getDayOfWeek(weddingDateStr, weddingConfig.timezone);

  // Initialize canvas with luxurious gold & maroon metallic foil gradient
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Metallic gold & royal maroon gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#C99A45');
    gradient.addColorStop(0.3, '#E8C872');
    gradient.addColorStop(0.5, '#FAF0D7');
    gradient.addColorStop(0.7, '#D4AF37');
    gradient.addColorStop(1, '#A07628');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Subtle metallic brush texture
    ctx.fillStyle = 'rgba(84, 20, 38, 0.08)';
    for (let i = 0; i < width; i += 8) {
      ctx.fillRect(i, 0, 4, height);
    }

    // Traditional ornamental foil borders
    ctx.strokeStyle = '#781F35';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, width - 24, height - 24);

    ctx.strokeStyle = '#FAF0D7';
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // Gold foil call-to-action text
    ctx.fillStyle = '#541426';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = '600 13px Montserrat, sans-serif';
    ctx.fillText('✨ SOMETHING SPECIAL IS HERE ✨', width / 2, height / 2 - 32);

    ctx.font = 'bold 20px Cormorant Garamond, serif';
    ctx.fillText('Scratch to Reveal Our Date', width / 2, height / 2);

    ctx.font = 'italic 12px Montserrat, sans-serif';
    ctx.fillStyle = '#781F35';
    ctx.fillText('Touch & scratch or drag cursor', width / 2, height / 2 + 32);
  }, []);

  useEffect(() => {
    initCanvas();

    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 640);
      if (!isRevealed) {
        initCanvas();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas, isRevealed]);

  // Trigger celebratory flower shower when 100% completed
  const triggerCelebration = useCallback(() => {
    setIsRevealed(true);
    setScratchPercent(100);
    setShowFlowerShower(true);
    setBurstKey((prev) => prev + 1);

    // Soft celebration haptic feedback on mobile devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 50, 40]);
      } catch {
        // Ignore if unsupported
      }
    }

    // Auto-taper shower after 8.5 seconds
    setTimeout(() => {
      setShowFlowerShower(false);
    }, 8500);
  }, []);

  // Calculate scratched area percentage
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.width;
    const height = canvas.height;

    try {
      // Step size 16 for instant performance
      const step = Math.floor(16 * dpr);
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      let transparentCount = 0;
      let totalCount = 0;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const index = (y * width + x) * 4 + 3;
          if (data[index] < 128) {
            transparentCount++;
          }
          totalCount++;
        }
      }

      const percent = Math.round((transparentCount / totalCount) * 100);
      setScratchPercent(percent);

      // Once user scratches >= 68% across the date, smoothly complete to 100% and shower flowers!
      if (percent >= 68) {
        let currentP = percent;
        const interval = setInterval(() => {
          currentP += 6;
          if (currentP >= 100) {
            clearInterval(interval);
            triggerCelebration();
          } else {
            setScratchPercent(currentP);
          }
        }, 32);
      }
    } catch {
      // Fallback
    }
  }, [isRevealed, triggerCelebration]);

  // Continuous Line Erasing for silky-smooth scratch strokes on mouse and mobile touch
  const eraseLine = (clientX: number, clientY: number, isInitial = false) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';

    if (isInitial || !lastPointRef.current) {
      // Draw initial round erase circle
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw continuous line between consecutive points (prevents dotted gaps during fast swipes)
      ctx.lineWidth = 56;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    lastPointRef.current = { x, y };

    // Throttle image data calculation to once every 120ms to keep 60 FPS on mobile
    const now = Date.now();
    if (now - lastCheckTimeRef.current > 120) {
      lastCheckTimeRef.current = now;
      checkScratchPercentage();
    }
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    eraseLine(e.clientX, e.clientY, true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return;
    eraseLine(e.clientX, e.clientY, false);
  };

  const handleMouseUp = () => {
    lastPointRef.current = null;
    checkScratchPercentage();
  };

  // Mobile Touch Handlers with hardware pointer locking
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches[0]) {
      eraseLine(e.touches[0].clientX, e.touches[0].clientY, true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches[0]) {
      eraseLine(e.touches[0].clientX, e.touches[0].clientY, false);
    }
  };

  const handleTouchEnd = () => {
    lastPointRef.current = null;
    checkScratchPercentage();
  };

  // Filter particles based on screen width for locked 60fps performance
  const activeShowerPetals = useMemo(() => {
    if (isMobileScreen) {
      return SHOWER_PETALS.filter((p) => p.isMobileOnly); // 35 elegant petals on mobile
    }
    return SHOWER_PETALS; // 70 petals on desktop
  }, [isMobileScreen]);

  const activeBurstPetals = useMemo(() => {
    if (isMobileScreen) {
      return BURST_PETALS.filter((p) => p.isMobile); // 44 flowers & petals on mobile
    }
    return BURST_PETALS; // 66 flowers & petals on desktop
  }, [isMobileScreen]);

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
            className={`relative mx-auto mt-6 w-full max-w-[340px] sm:max-w-md h-60 sm:h-72 rounded-2xl overflow-hidden shadow-2xl border-2 transition-all duration-700 ${
              isRevealed
                ? 'border-antique-gold shadow-[0_0_35px_rgba(201,154,69,0.35)] scale-[1.02]'
                : 'border-antique-gold/40'
            } bg-gradient-to-br from-champagne/40 via-ivory to-soft-blush/30`}
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

              {/* Revealed Celebratory Badge */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-royal-maroon/15 via-antique-gold/25 to-royal-maroon/15 text-royal-maroon text-xs font-sans font-semibold uppercase tracking-wider mb-2 border border-antique-gold/30 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-antique-gold animate-spin" style={{ animationDuration: '4s' }} />
                <span>Save The Date • 100% Unveiled</span>
                <Sparkles className="w-3.5 h-3.5 text-antique-gold animate-spin" style={{ animationDuration: '4s' }} />
              </motion.div>

              {/* Day of Week */}
              <div className="text-sm font-sans tracking-widest uppercase font-semibold text-antique-gold">
                {dayName}
              </div>

              {/* Wedding Date Display */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="my-1.5 text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-royal-maroon tracking-tight drop-shadow-xs"
              >
                {formattedDate}
              </motion.div>

              {/* Couple Tagline */}
              <div className="text-xs sm:text-sm font-script text-antique-gold text-2xl mt-1">
                {weddingConfig.groom.firstName} & {weddingConfig.bride.firstName}
              </div>

              <div className="mt-2 text-xs font-sans text-deep-burgundy/70 tracking-wide flex items-center gap-1">
                <Heart className="w-3 h-3 text-royal-maroon fill-royal-maroon/30 inline" />
                <span>Petlad, Gujarat • Chitri, Rajasthan</span>
              </div>
            </div>

            {/* Opaque HTML5 Canvas Scratch Layer with touch-action: none */}
            <AnimatePresence>
              {!isRevealed && (
                <motion.canvas
                  ref={canvasRef}
                  exit={{ opacity: 0, scale: 1.08, transition: { duration: 0.7, ease: 'easeOut' } }}
                  className="absolute inset-0 w-full h-full cursor-pointer touch-none z-10"
                  style={{ touchAction: 'none' }}
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
                <span className="text-[11px] font-sans font-semibold text-deep-burgundy bg-ivory/95 backdrop-blur-sm px-3.5 py-1 rounded-full shadow-lg border border-antique-gold/40 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-antique-gold animate-ping" />
                  <span>{scratchPercent}% Scratched</span>
                </span>
              </div>
            )}
          </div>

          {/* Reveal Buttons */}
          <div className="mt-4 flex justify-center items-center gap-3">
            {!isRevealed ? (
              <button
                type="button"
                onClick={triggerCelebration}
                className="inline-flex items-center gap-2 text-xs font-sans font-medium text-antique-gold hover:text-royal-maroon transition-all py-1.5 px-3.5 rounded-lg border border-antique-gold/40 hover:border-royal-maroon/50 bg-ivory/80 shadow-xs hover:shadow-md cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Tap here to reveal 100% instantly</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowFlowerShower(false);
                  setTimeout(() => triggerCelebration(), 50);
                }}
                className="inline-flex items-center gap-2 text-xs font-sans font-semibold text-royal-maroon hover:text-deep-burgundy transition-all py-2 px-4 rounded-full border border-antique-gold/60 bg-gradient-to-r from-champagne/60 via-ivory to-champagne/60 shadow-md hover:scale-105 cursor-pointer active:scale-95"
              >
                <span>🌸 Shower Flowers Again</span>
              </button>
            )}
          </div>
        </SectionReveal>

        {/* Live Countdown Timer */}
        <div className="mt-12">
          <CountdownTimer />
        </div>
      </div>

      {/* ================= CELEBRATORY FULL-SCREEN FLOWER SHOWER (TRIGGERED AT 100%) ================= */}
      <AnimatePresence>
        {showFlowerShower && (
          <div
            className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none"
            aria-hidden="true"
          >
            <style>{`
              @keyframes showerFallKeyframe {
                0% {
                  transform: translate3d(0, -50px, 0);
                  opacity: 0;
                }
                8% {
                  opacity: 0.96;
                }
                88% {
                  opacity: 0.92;
                }
                100% {
                  transform: translate3d(0, 106vh, 0);
                  opacity: 0;
                }
              }

              @keyframes showerSwayKeyframe {
                0% {
                  transform: translate3d(calc(-1 * var(--sway-dist)), 0, 0) rotate(0deg) rotateY(0deg);
                }
                50% {
                  transform: translate3d(var(--sway-dist), 0, 0) rotate(var(--rot-mid)) rotateY(180deg);
                }
                100% {
                  transform: translate3d(calc(-1 * var(--sway-dist)), 0, 0) rotate(var(--rot-end)) rotateY(360deg);
                }
              }

              .shower-petal-fall {
                animation: showerFallKeyframe var(--fall-dur) cubic-bezier(0.25, 0.46, 0.45, 0.94) var(--fall-delay) forwards;
                will-change: transform, opacity;
                backface-visibility: hidden;
              }

              .shower-petal-sway {
                animation: showerSwayKeyframe var(--sway-dur) ease-in-out infinite;
                will-change: transform;
                backface-visibility: hidden;
              }
            `}</style>

            {/* 1. Full-Screen Cascading Flower Shower (Responsive: 35 on mobile, 70 on desktop) */}
            {activeShowerPetals.map((petal) => (
              <div
                key={petal.id}
                className="absolute top-0 shower-petal-fall"
                style={
                  {
                    left: `${petal.x}%`,
                    '--fall-dur': `${petal.duration}s`,
                    '--fall-delay': `${petal.delay}s`,
                  } as React.CSSProperties
                }
              >
                <div
                  className="shower-petal-sway"
                  style={
                    {
                      '--sway-dist': `${isMobileScreen ? Math.round(petal.swayAmount * 0.6) : petal.swayAmount}px`,
                      '--sway-dur': `${petal.swayDuration}s`,
                      '--rot-mid': `${petal.rotMid}deg`,
                      '--rot-end': `${petal.rotEnd}deg`,
                    } as React.CSSProperties
                  }
                >
                  {/* Velvet Red Rose Petal */}
                  {petal.type === 'rose' && (
                    <svg
                      width={isMobileScreen ? petal.size * 0.85 : petal.size}
                      height={isMobileScreen ? petal.size * 1.05 : petal.size * 1.25}
                      viewBox="0 0 32 40"
                      className="filter drop-shadow-[0_2px_5px_rgba(120,31,53,0.3)]"
                    >
                      <path
                        d="M16 2 C8 2 2 12 2 24 C2 33 9 38 16 38 C23 38 30 33 30 24 C30 12 24 2 16 2 Z"
                        fill="url(#roseShowerGrad)"
                      />
                    </svg>
                  )}

                  {/* Pink Hibiscus / Lotus Petal */}
                  {petal.type === 'hibiscus' && (
                    <svg
                      width={isMobileScreen ? petal.size * 0.85 : petal.size}
                      height={isMobileScreen ? petal.size * 1.0 : petal.size * 1.2}
                      viewBox="0 0 32 38"
                      className="filter drop-shadow-[0_2px_5px_rgba(255,46,147,0.3)]"
                    >
                      <path
                        d="M16 2 C6 6 2 16 4 28 C6 35 12 37 16 37 C20 37 26 35 28 28 C30 16 26 6 16 2 Z"
                        fill="url(#hibiscusShowerGrad)"
                      />
                    </svg>
                  )}

                  {/* Golden Saffron Marigold Petal */}
                  {petal.type === 'marigold' && (
                    <svg
                      width={isMobileScreen ? petal.size * 0.65 : petal.size * 0.75}
                      height={isMobileScreen ? petal.size * 1.1 : petal.size * 1.3}
                      viewBox="0 0 24 40"
                      className="filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.3)]"
                    >
                      <path
                        d="M12 2 C7 8 4 18 6 30 C8 38 11 39 12 39 C13 39 16 38 18 30 C20 18 17 8 12 2 Z"
                        fill="url(#marigoldShowerGrad)"
                      />
                    </svg>
                  )}

                  {/* Fragrant White Jasmine (Mogra) Flower Floret */}
                  {petal.type === 'jasmine' && (
                    <svg
                      width={isMobileScreen ? petal.size * 0.8 : petal.size}
                      height={isMobileScreen ? petal.size * 0.8 : petal.size}
                      viewBox="0 0 32 32"
                      className="filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
                    >
                      <g transform="translate(16, 16)">
                        {[0, 72, 144, 216, 288].map((angle, i) => (
                          <path
                            key={i}
                            d="M0 0 C-3 -6, -4 -12, 0 -14 C4 -12, 3 -6, 0 0 Z"
                            fill="#FFFDF7"
                            stroke="#E8E2D5"
                            strokeWidth="0.5"
                            transform={`rotate(${angle})`}
                          />
                        ))}
                        <circle r="2" fill="#FDE047" />
                      </g>
                    </svg>
                  )}

                  {/* Shimmering Gold Leaf Foil Flake */}
                  {petal.type === 'goldFlake' && (
                    <div
                      style={{
                        width: `${isMobileScreen ? petal.size * 0.5 : petal.size * 0.65}px`,
                        height: `${isMobileScreen ? petal.size * 0.5 : petal.size * 0.65}px`,
                        background: 'linear-gradient(135deg, #FAF0D7 0%, #D4AF37 50%, #9E782F 100%)',
                        boxShadow: '0 2px 5px rgba(212,175,55,0.4)',
                        transform: 'rotate(45deg)',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </div>
              </div>
            ))}

            {/* 2. Center Fountain Burst from Card (66 Authentic Flowers & Petals) */}
            <div
              key={`burst-${burstKey}`}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              {activeBurstPetals.map((bp) => {
                const distanceScale = isMobileScreen ? 0.62 : 1.0;
                const targetX = Math.cos(bp.angle) * bp.distance * distanceScale;
                const targetY = Math.sin(bp.angle) * bp.distance * distanceScale;
                const arcH = bp.arcHeight * (isMobileScreen ? 0.65 : 1.0);
                const grav = bp.gravityFall * (isMobileScreen ? 0.65 : 1.0);
                const pSize = isMobileScreen ? bp.size * 0.8 : bp.size;

                return (
                  <motion.div
                    key={bp.id}
                    initial={{ x: 0, y: 0, scale: 0.1, opacity: 0, rotate: 0 }}
                    animate={{
                      x: [0, targetX * 0.65, targetX],
                      y: [0, targetY - arcH, targetY + grav],
                      scale: [0.1, 1.3, 0.95, 0],
                      opacity: [0, 1, 0.95, 0],
                      rotate: [0, bp.rot * 0.5, bp.rot + 540],
                    }}
                    transition={{
                      duration: bp.duration,
                      delay: bp.delay,
                      times: [0, 0.42, 0.85, 1],
                      ease: 'easeOut',
                    }}
                    className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                  >
                    {/* Full Hibiscus Blossom with Stamen Column */}
                    {bp.type === 'hibiscusBloom' && (
                      <svg
                        width={pSize * 1.25}
                        height={pSize * 1.25}
                        viewBox="0 0 40 40"
                        className="filter drop-shadow-[0_2px_6px_rgba(194,24,91,0.35)]"
                      >
                        <g transform="translate(20, 20)">
                          {[0, 72, 144, 216, 288].map((angle, idx) => (
                            <path
                              key={idx}
                              d="M0 0 C-6 -8, -10 -16, 0 -18 C10 -16, 6 -8, 0 0 Z"
                              fill="url(#hibiscusShowerGrad)"
                              transform={`rotate(${angle})`}
                            />
                          ))}
                          <line x1="0" y1="0" x2="3" y2="-7" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" />
                          <circle cx="3" cy="-7" r="1.5" fill="#FDE047" />
                          <circle cx="0" cy="0" r="2.5" fill="#880E4F" />
                        </g>
                      </svg>
                    )}

                    {/* Fragrant White Jasmine (Mogra) Blossom */}
                    {bp.type === 'jasmine' && (
                      <svg
                        width={pSize * 1.05}
                        height={pSize * 1.05}
                        viewBox="0 0 32 32"
                        className="filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.18)]"
                      >
                        <g transform="translate(16, 16)">
                          {[0, 72, 144, 216, 288].map((angle, idx) => (
                            <path
                              key={idx}
                              d="M0 0 C-3 -6, -4 -12, 0 -14 C4 -12, 3 -6, 0 0 Z"
                              fill="#FFFDF7"
                              stroke="#E8E2D5"
                              strokeWidth="0.5"
                              transform={`rotate(${angle})`}
                            />
                          ))}
                          <circle r="2.4" fill="#FDE047" />
                        </g>
                      </svg>
                    )}

                    {/* Velvet Red Rose Petal */}
                    {bp.type === 'rose' && (
                      <svg
                        width={pSize}
                        height={pSize * 1.25}
                        viewBox="0 0 32 40"
                        className="filter drop-shadow-[0_2px_6px_rgba(166,25,46,0.4)]"
                      >
                        <path
                          d="M16 2 C8 2 2 12 2 24 C2 33 9 38 16 38 C23 38 30 33 30 24 C30 12 24 2 16 2 Z"
                          fill="url(#roseShowerGrad)"
                        />
                      </svg>
                    )}

                    {/* Pink Hibiscus / Lotus Petal */}
                    {bp.type === 'hibiscus' && (
                      <svg
                        width={pSize}
                        height={pSize * 1.2}
                        viewBox="0 0 32 38"
                        className="filter drop-shadow-[0_2px_6px_rgba(255,46,147,0.4)]"
                      >
                        <path
                          d="M16 2 C6 6 2 16 4 28 C6 35 12 37 16 37 C20 37 26 35 28 28 C30 16 26 6 16 2 Z"
                          fill="url(#hibiscusShowerGrad)"
                        />
                      </svg>
                    )}

                    {/* Golden Saffron Marigold Petal */}
                    {bp.type === 'marigold' && (
                      <svg
                        width={pSize * 0.75}
                        height={pSize * 1.3}
                        viewBox="0 0 24 40"
                        className="filter drop-shadow-[0_2px_5px_rgba(245,158,11,0.4)]"
                      >
                        <path
                          d="M12 2 C7 8 4 18 6 30 C8 38 11 39 12 39 C13 39 16 38 18 30 C20 18 17 8 12 2 Z"
                          fill="url(#marigoldShowerGrad)"
                        />
                      </svg>
                    )}

                    {/* Shimmering Gold Leaf Foil Flake */}
                    {bp.type === 'goldFlake' && (
                      <div
                        style={{
                          width: `${pSize * 0.65}px`,
                          height: `${pSize * 0.65}px`,
                          background: 'linear-gradient(135deg, #FAF0D7 0%, #D4AF37 50%, #9E782F 100%)',
                          boxShadow: '0 2px 7px rgba(212,175,55,0.5)',
                          transform: 'rotate(45deg)',
                          borderRadius: '2px',
                        }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* SVG Gradients for Petal Visual Depth */}
            <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
              <defs>
                <radialGradient id="roseShowerGrad" cx="45%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#E23E57" />
                  <stop offset="50%" stopColor="#A6192E" />
                  <stop offset="90%" stopColor="#6B0C1E" />
                  <stop offset="100%" stopColor="#4A0512" />
                </radialGradient>

                <radialGradient id="hibiscusShowerGrad" cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="35%" stopColor="#FF69B4" />
                  <stop offset="80%" stopColor="#FF1493" />
                  <stop offset="100%" stopColor="#C2185B" />
                </radialGradient>

                <linearGradient id="marigoldShowerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FDE047" />
                  <stop offset="45%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#B45309" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default ScratchCard;
