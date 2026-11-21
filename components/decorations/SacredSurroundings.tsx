'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Floral Hibiscus Frame Borders (SacredSurroundings)
 * - Exact high-detail botanical borders with lush emerald leaves and vibrant pink hibiscus blossoms
 *   extracted directly from 'Floral Hibiscus Frame Borders.png'.
 * - Animated to gracefully sway left and right like a continuous gust/gaze of natural wind passing through.
 * - Dynamic scroll breeze reactivity, pointer proximity flex, and interactive petal bursts on tap/click.
 * - Fully responsive: frames the viewport top-to-bottom on mobile, tablet, and desktop without blocking UI.
 */

interface InteractivePetal {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  color: string;
}

const HIBISCUS_PETAL_COLORS = [
  '#FF2E93', // Vivid magenta hibiscus
  '#FF5E97', // Soft pink blossom
  '#E0115F', // Ruby rose
  '#FF85A2', // Blush coral petal
  '#FFA6C9', // Carnation pink
  '#FFD700', // Golden pollen highlight
];

export function SacredSurroundings() {
  const [interactivePetals, setInteractivePetals] = useState<InteractivePetal[]>([]);
  const [scrollSway, setScrollSway] = useState(0);
  const [pointerBend, setPointerBend] = useState({ left: 0, right: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Track dynamic scroll velocity for organic wind reaction
  useEffect(() => {
    let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      if (!ticking) {
        requestAnimationFrame(() => {
          // Dynamic scroll tilt (-2.5 to 2.5 degrees)
          const targetSway = Math.max(-2.5, Math.min(2.5, delta * 0.1));
          setScrollSway(targetSway);

          // Return gently to resting wind
          setTimeout(() => {
            setScrollSway((prev) => prev * 0.35);
          }, 160);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track cursor / touch proximity to bend foliage gently
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const clientX = e.clientX;

    // Proximity to left border (within 240px)
    if (clientX < 240) {
      const intensity = (240 - clientX) / 240;
      setPointerBend((prev) => ({ ...prev, left: intensity * 2.5 }));
    } else {
      setPointerBend((prev) => ({ ...prev, left: 0 }));
    }

    // Proximity to right border (within 240px)
    if (clientX > screenWidth - 240) {
      const intensity = (clientX - (screenWidth - 240)) / 240;
      setPointerBend((prev) => ({ ...prev, right: -intensity * 2.5 }));
    } else {
      setPointerBend((prev) => ({ ...prev, right: 0 }));
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    setPointerBend({ left: 0, right: 0 });
  }, []);

  // Spawn fluttering hibiscus petals on tap / click
  const triggerPetalBurst = useCallback(
    (e: React.MouseEvent<HTMLElement> | React.PointerEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const originX = e.clientX && e.clientX > 0 ? e.clientX : rect.left + rect.width / 2;
      const originY = e.clientY && e.clientY > 0 ? e.clientY : rect.top + rect.height / 2;
      const isLeft = originX < (typeof window !== 'undefined' ? window.innerWidth / 2 : 600);

      const newPetals: InteractivePetal[] = Array.from({ length: 7 }).map((_, i) => ({
        id: Date.now() + Math.random() + i,
        x: originX,
        y: originY,
        vx: (isLeft ? 1 : -1) * (25 + Math.random() * 55),
        vy: 20 + Math.random() * 85,
        rotation: Math.random() * 360,
        color: HIBISCUS_PETAL_COLORS[Math.floor(Math.random() * HIBISCUS_PETAL_COLORS.length)],
      }));

      setInteractivePetals((prev) => [...prev.slice(-20), ...newPetals]);

      // Clean up petals after animation
      setTimeout(() => {
        setInteractivePetals((prev) => prev.filter((p) => !newPetals.some((np) => np.id === p.id)));
      }, 1600);
    },
    []
  );

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none"
      aria-hidden="true"
    >
      <style>{`
        /* Natural wind gust keyframes: passing left-to-right through foliage */
        @keyframes hibiscusWindLeft {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg) skewX(0deg);
          }
          18% {
            transform: translate3d(5px, 0, 0) rotate(0.4deg) skewX(0.2deg);
          }
          38% {
            transform: translate3d(13px, 0, 0) rotate(1.2deg) skewX(0.6deg);
          }
          54% {
            transform: translate3d(6px, 0, 0) rotate(0.5deg) skewX(0.3deg);
          }
          70% {
            transform: translate3d(11px, 0, 0) rotate(0.9deg) skewX(0.5deg);
          }
          85% {
            transform: translate3d(2px, 0, 0) rotate(0.2deg) skewX(0.1deg);
          }
        }

        @keyframes hibiscusWindRight {
          0%, 100% {
            transform: translate3d(0, 0, 0) rotate(0deg) skewX(0deg);
          }
          18% {
            transform: translate3d(-4px, 0, 0) rotate(-0.3deg) skewX(-0.2deg);
          }
          38% {
            transform: translate3d(-13px, 0, 0) rotate(-1.2deg) skewX(-0.6deg);
          }
          54% {
            transform: translate3d(-5px, 0, 0) rotate(-0.5deg) skewX(-0.3deg);
          }
          70% {
            transform: translate3d(-10px, 0, 0) rotate(-0.8deg) skewX(-0.4deg);
          }
          85% {
            transform: translate3d(-2px, 0, 0) rotate(-0.2deg) skewX(-0.1deg);
          }
        }

        .hibiscus-sway-left {
          animation: hibiscusWindLeft 7.2s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          transform-origin: left center;
          will-change: transform;
        }

        .hibiscus-sway-right {
          animation: hibiscusWindRight 7.8s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          transform-origin: right center;
          will-change: transform;
        }
      `}</style>

      {/* ================= LEFT BORDER: FLORAL HIBISCUS FRAME ================= */}
      <motion.div
        className="fixed top-0 bottom-0 left-0 pointer-events-none select-none z-20 flex flex-col justify-stretch items-start overflow-visible h-screen"
        animate={{
          x: scrollSway * 3 + pointerBend.left * 4,
          rotate: scrollSway * 0.6 + pointerBend.left * 0.5,
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      >
        <div className="hibiscus-sway-left h-full flex items-stretch origin-left">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/decorations/hibiscus_border_left.png"
            alt="Floral Hibiscus Left Border"
            onPointerDown={triggerPetalBurst}
            className="h-full w-auto select-none pointer-events-auto cursor-pointer filter drop-shadow-[2px_6px_14px_rgba(0,0,0,0.18)] -ml-8 sm:-ml-4 md:ml-0 transition-opacity hover:opacity-95"
            draggable={false}
          />
        </div>
      </motion.div>

      {/* ================= RIGHT BORDER: FLORAL HIBISCUS FRAME ================= */}
      <motion.div
        className="fixed top-0 bottom-0 right-0 pointer-events-none select-none z-20 flex flex-col justify-stretch items-end overflow-visible h-screen"
        animate={{
          x: -scrollSway * 3 + pointerBend.right * 4,
          rotate: -scrollSway * 0.6 + pointerBend.right * 0.5,
        }}
        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      >
        <div className="hibiscus-sway-right h-full flex items-stretch origin-right">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/decorations/hibiscus_border_right.png"
            alt="Floral Hibiscus Right Border"
            onPointerDown={triggerPetalBurst}
            className="h-full w-auto select-none pointer-events-auto cursor-pointer filter drop-shadow-[-2px_6px_14px_rgba(0,0,0,0.18)] -mr-8 sm:-mr-4 md:mr-0 transition-opacity hover:opacity-95"
            draggable={false}
          />
        </div>
      </motion.div>

      {/* ================= INTERACTIVE HIBISCUS PETAL BURST PARTICLES ================= */}
      <AnimatePresence>
        {interactivePetals.map((petal) => (
          <motion.div
            key={petal.id}
            initial={{
              x: petal.x,
              y: petal.y,
              scale: 0.5,
              opacity: 0.95,
              rotate: petal.rotation,
            }}
            animate={{
              x: petal.x + petal.vx,
              y: petal.y + petal.vy,
              scale: [0.5, 1.2, 0.85],
              opacity: [0.95, 0.9, 0],
              rotate: petal.rotation + (petal.vx > 0 ? 210 : -210),
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="fixed pointer-events-none z-40"
            style={{
              width: '16px',
              height: '20px',
              background: `radial-gradient(ellipse at 35% 30%, #FFFFFF 0%, ${petal.color} 65%, #C2185B 100%)`,
              boxShadow: '0 2px 8px rgba(255, 46, 147, 0.35)',
              borderRadius: '50% 50% 50% 0',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default SacredSurroundings;
