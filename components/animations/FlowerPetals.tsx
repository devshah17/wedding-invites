'use client';

import React, { useMemo, useSyncExternalStore } from 'react';

export interface FlowerPetalsProps {
  /** Number of floating rose petals (default: 36 for full page shower) */
  count?: number;
  /** Optional custom CSS class name for the wrapper */
  className?: string;
}

interface RosePetalConfig {
  id: number;
  left: number; // percentage (0 - 100)
  size: number; // px (14 - 30)
  color: string;
  duration: number; // fall duration in seconds (7 - 14)
  delay: number; // delay offset in seconds (0 - 14)
  swayDuration: number; // sway duration in seconds (2.5 - 5)
  swayAmount: number; // sway amplitude in px (18 - 42)
  opacity: number; // 0.65 - 0.95
  rotation: number; // rotation in deg (180 - 540)
  rotateDirection: number; // 1 or -1
  variant: number; // 0, 1, 2, or 3
  isMobile: boolean; // true if petal should render on mobile viewports
}

// Royal velvet red and soft pink rose petals with occasional antique gold fleck
const ROSE_COLORS = [
  '#A0153E', // Deep Velvety Crimson
  '#C71F42', // Rich Royal Rose Red
  '#870A24', // Burgundy Rose Petal
  '#D8315B', // Vibrant Rose Petal
  '#E63956', // Fresh Blooming Rose
  '#F08092', // Delicate Soft Rose Pink
  '#C99A45', // Gilded Gold Sparkle Petal
];

const emptySubscribe = () => () => {};

function subscribeVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
}

function generatePetals(count: number): RosePetalConfig[] {
  return Array.from({ length: count }, (_, i) => {
    const seed1 = (i * 9301 + 49297) % 233280;
    const seed2 = (i * 49297 + 9301) % 233280;
    const seed3 = (i * 233280 + 49297) % 9301;
    const r1 = seed1 / 233280;
    const r2 = seed2 / 233280;
    const r3 = seed3 / 9301;

    // Enable roughly 16 petals on mobile (<768px), and all petals on desktop
    const isMobile = i % 2 === 0 || i < 6;

    return {
      id: i,
      left: Math.floor(2 + r1 * 96), // 2% - 98%
      size: Math.floor(14 + r2 * 14), // 14px - 28px
      color: ROSE_COLORS[i % ROSE_COLORS.length],
      duration: Number((9 + r3 * 6).toFixed(1)), // 9s - 15s fall duration
      delay: Number((r2 * 14).toFixed(1)), // negative delay offset in seconds
      swayDuration: Number((2.8 + r1 * 2).toFixed(1)), // 2.8s - 4.8s sway
      swayAmount: Math.floor(18 + r2 * 24), // 18px - 42px
      opacity: Number((0.7 + r3 * 0.25).toFixed(2)), // 0.7 - 0.95
      rotation: Math.floor(180 + r1 * 360), // total rotation during fall
      rotateDirection: i % 2 === 0 ? 1 : -1,
      variant: i % 4,
      isMobile,
    };
  });
}

/**
 * Authentic Curved Rose Petal Shapes
 */
function RosePetalShape({
  variant,
  color,
  size,
}: {
  variant: number;
  color: string;
  size: number;
}) {
  switch (variant) {
    case 1:
      // Curved heart-edged rose petal with natural curling lip
      return (
        <svg
          width={size}
          height={Math.round(size * 1.15)}
          viewBox="0 0 24 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 12 2 C 5 2, 1 9, 2 16 C 3 23, 10 26, 12 27 C 14 26, 21 23, 22 16 C 23 9, 19 2, 12 2 Z"
            fill={color}
          />
          {/* Subtle curved petal ridge */}
          <path
            d="M 12 4 Q 10 14 12 24"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          {/* Velvety shadow overlay */}
          <path
            d="M 4 14 Q 12 18 20 14 Q 12 23 4 14 Z"
            fill="rgba(0,0,0,0.15)"
          />
        </svg>
      );

    case 2:
      // Asymmetric fluttering rose petal with folded edge
      return (
        <svg
          width={size}
          height={Math.round(size * 1.2)}
          viewBox="0 0 24 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 10 1 C 4 3, 0 10, 2 17 C 4 24, 11 27, 14 27 C 19 26, 24 20, 22 14 C 20 7, 16 1, 10 1 Z"
            fill={color}
          />
          {/* Delicate petal fold */}
          <path
            d="M 2 17 Q 8 13 14 27"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="0.75"
          />
        </svg>
      );

    case 3:
      // Small young rose petal / bud leaf
      return (
        <svg
          width={Math.round(size * 0.85)}
          height={size}
          viewBox="0 0 20 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 10 1 C 4 4, 1 11, 3 17 C 5 22, 10 23, 10 23 C 10 23, 15 22, 17 17 C 19 11, 16 4, 10 1 Z"
            fill={color}
          />
          <path
            d="M 10 3 L 10 20"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.6"
          />
        </svg>
      );

    default:
      // Classic wide cup-shaped velvety rose petal
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 12 1 C 6 1, 1 7, 1 14 C 1 20, 7 23, 12 23 C 17 23, 23 20, 23 14 C 23 7, 18 1, 12 1 Z"
            fill={color}
          />
          <path
            d="M 12 3 Q 11 12 12 21"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
          <ellipse
            cx="12"
            cy="15"
            rx="6"
            ry="4"
            fill="rgba(0,0,0,0.12)"
          />
        </svg>
      );
  }
}

/**
 * Continuous Rose Petal Shower Animation
 * 100% GPU-composited, hardware-accelerated CSS animations with negative delays
 * for instant, buttery-smooth 60fps performance on mobile devices.
 */
export function FlowerPetals({
  count = 36,
  className = '',
}: FlowerPetalsProps) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isTabVisible = useSyncExternalStore(
    subscribeVisibility,
    () => !document.hidden,
    () => true
  );

  const petals = useMemo(() => generatePetals(count), [count]);

  if (!mounted || !isTabVisible || petals.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-30 ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes smoothRoseFall {
          0% {
            transform: translate3d(0, -70px, 0) rotate(0deg);
            opacity: 0;
          }
          6% {
            opacity: var(--petal-opacity);
          }
          92% {
            opacity: var(--petal-opacity);
          }
          100% {
            transform: translate3d(0, calc(100vh + 80px), 0) rotate(var(--petal-rot));
            opacity: 0;
          }
        }

        @keyframes smoothRoseSway {
          0% {
            transform: translate3d(calc(-1 * var(--sway-amount)), 0, 0);
          }
          100% {
            transform: translate3d(var(--sway-amount), 0, 0);
          }
        }

        .smooth-petal-fall {
          animation: smoothRoseFall var(--fall-duration) linear infinite both;
          animation-delay: calc(var(--petal-delay) * -1);
          will-change: transform;
          backface-visibility: hidden;
        }

        .smooth-petal-sway {
          animation: smoothRoseSway var(--sway-duration) ease-in-out infinite alternate both;
          animation-delay: calc(var(--petal-delay) * -0.6);
          will-change: transform;
          backface-visibility: hidden;
        }

        @media (prefers-reduced-motion: reduce) {
          .smooth-petal-fall, .smooth-petal-sway {
            animation: none !important;
            display: none !important;
          }
        }
      `}</style>

      {petals.map((petal) => {
        const fallStyle: React.CSSProperties & Record<string, string | number> = {
          position: 'absolute',
          top: 0,
          left: `${petal.left}%`,
          '--fall-duration': `${petal.duration}s`,
          '--petal-delay': `${petal.delay}s`,
          '--petal-opacity': petal.opacity,
          '--petal-rot': `${petal.rotation * petal.rotateDirection}deg`,
        };

        const swayStyle: React.CSSProperties & Record<string, string | number> = {
          '--sway-duration': `${petal.swayDuration}s`,
          '--sway-amount': `${petal.swayAmount * petal.rotateDirection}px`,
        };

        return (
          <div
            key={petal.id}
            className={`smooth-petal-fall ${petal.isMobile ? '' : 'hidden sm:block'}`}
            style={fallStyle}
          >
            <div className="smooth-petal-sway" style={swayStyle}>
              <RosePetalShape
                variant={petal.variant}
                color={petal.color}
                size={petal.size}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FlowerPetals;
