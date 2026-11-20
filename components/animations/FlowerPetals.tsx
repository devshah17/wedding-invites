'use client';

import React, { useEffect, useState } from 'react';

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
  delay: number; // delay in seconds (0 - 12)
  swayDuration: number; // sway duration in seconds (2.5 - 5)
  swayAmount: number; // sway amplitude in px (25 - 60)
  opacity: number; // 0.65 - 0.95
  initialRotation: number; // deg
  rotateDirection: number; // 1 or -1
  variant: number; // 0, 1, 2, or 3
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
          className="drop-shadow-[0_2px_4px_rgba(135,10,36,0.3)]"
        >
          <path
            d="M 12 2 C 5 2, 1 9, 2 16 C 3 23, 10 26, 12 27 C 14 26, 21 23, 22 16 C 23 9, 19 2, 12 2 Z"
            fill={color}
          />
          {/* Subtle curved petal ridge */}
          <path
            d="M 12 4 Q 10 14 12 24"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          {/* Velvety shadow overlay */}
          <path
            d="M 4 14 Q 12 18 20 14 Q 12 23 4 14 Z"
            fill="rgba(0,0,0,0.12)"
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
          className="drop-shadow-[0_2px_4px_rgba(135,10,36,0.25)]"
        >
          <path
            d="M 10 1 C 4 3, 0 10, 2 17 C 4 24, 11 27, 14 27 C 19 26, 24 20, 22 14 C 20 7, 16 1, 10 1 Z"
            fill={color}
          />
          {/* Delicate petal fold */}
          <path
            d="M 2 17 Q 8 13 14 27"
            stroke="rgba(255,255,255,0.18)"
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
          className="drop-shadow-[0_2px_3px_rgba(135,10,36,0.2)]"
        >
          <path
            d="M 10 1 C 4 4, 1 11, 3 17 C 5 22, 10 23, 10 23 C 10 23, 15 22, 17 17 C 19 11, 16 4, 10 1 Z"
            fill={color}
          />
          <path
            d="M 10 3 L 10 20"
            stroke="rgba(255,255,255,0.25)"
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
          className="drop-shadow-[0_2px_4px_rgba(135,10,36,0.3)]"
        >
          <path
            d="M 12 1 C 6 1, 1 7, 1 14 C 1 20, 7 23, 12 23 C 17 23, 23 20, 23 14 C 23 7, 18 1, 12 1 Z"
            fill={color}
          />
          <path
            d="M 12 3 Q 11 12 12 21"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.75"
            strokeLinecap="round"
          />
          <ellipse
            cx="12"
            cy="15"
            rx="6"
            ry="4"
            fill="rgba(0,0,0,0.08)"
          />
        </svg>
      );
  }
}

/**
 * Continuous Rose Petal Shower Animation
 * Showers natural, velvety rose petals across the entire page with gentle wind drift
 */
export function FlowerPetals({
  count = 36,
  className = '',
}: FlowerPetalsProps) {
  const [petals, setPetals] = useState<RosePetalConfig[]>([]);
  const [isTabVisible, setIsTabVisible] = useState(true);

  // Generate randomized petal configurations
  useEffect(() => {
    const generated: RosePetalConfig[] = Array.from({ length: count }, (_, i) => {
      // Deterministic pseudo-random seed to avoid layout shifts
      const seed1 = (i * 9301 + 49297) % 233280;
      const seed2 = (i * 49297 + 9301) % 233280;
      const seed3 = (i * 233280 + 49297) % 9301;
      const r1 = seed1 / 233280;
      const r2 = seed2 / 233280;
      const r3 = seed3 / 9301;

      return {
        id: i,
        left: Math.floor(r1 * 100),
        size: Math.floor(15 + r2 * 16), // 15px - 31px
        color: ROSE_COLORS[i % ROSE_COLORS.length],
        duration: 8 + r3 * 7, // 8s - 15s fall duration
        delay: (i * 0.35) % 12, // Staggered delays for continuous shower
        swayDuration: 3 + r1 * 2.5, // 3s - 5.5s
        swayAmount: Math.floor(30 + r2 * 35), // 30px - 65px
        opacity: 0.65 + r3 * 0.3, // 0.65 - 0.95
        initialRotation: Math.floor(r1 * 360),
        rotateDirection: i % 2 === 0 ? 1 : -1,
        variant: i % 4,
      };
    });

    setPetals(generated);
  }, [count]);

  // Page Visibility API to pause CPU usage when tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (!isTabVisible || petals.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none z-30 ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes roseFall {
          0% {
            transform: translateY(-80px) rotateX(0deg) rotateY(0deg) rotateZ(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--petal-opacity);
          }
          90% {
            opacity: var(--petal-opacity);
          }
          100% {
            transform: translateY(112vh) rotateX(360deg) rotateY(180deg) rotateZ(360deg);
            opacity: 0;
          }
        }

        @keyframes roseSway {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(var(--sway-amount));
          }
        }

        .rose-petal-fall {
          animation: roseFall var(--fall-duration) linear infinite;
          animation-delay: var(--petal-delay);
          will-change: transform, opacity;
        }

        .rose-petal-sway {
          animation: roseSway var(--sway-duration) ease-in-out infinite alternate;
          will-change: transform;
        }

        @media (prefers-reduced-motion: reduce) {
          .rose-petal-fall, .rose-petal-sway {
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
        };

        const swayStyle: React.CSSProperties & Record<string, string | number> = {
          '--sway-duration': `${petal.swayDuration}s`,
          '--sway-amount': `${petal.swayAmount * petal.rotateDirection}px`,
          transform: `rotate(${petal.initialRotation}deg)`,
        };

        return (
          <div key={petal.id} className="rose-petal-fall" style={fallStyle}>
            <div className="rose-petal-sway" style={swayStyle}>
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
