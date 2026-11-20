'use client';

import React, { useMemo } from 'react';

export interface FlowerPetalsProps {
  count?: number;
  className?: string;
  colors?: string[];
  interactive?: boolean;
}

interface PetalData {
  id: number;
  x: number; // percentage across screen
  delay: number;
  duration: number;
  size: number;
  rotation: number;
  color: string;
  shape: 'marigold' | 'rose' | 'jasmine';
  swayAmount: number;
  swayDuration: number;
  rotateDirection: number;
  isMobile: boolean;
}

const DEFAULT_PETAL_COLORS = [
  '#C99A45', // Antique Gold
  '#D85A32', // Vermilion
  '#F59E0B', // Marigold Amber
  '#E8C97A', // Light Gold
  '#781F35', // Royal Maroon
  '#F3D9D5', // Soft Blush
  '#F6EBD5', // Champagne
];

export function FlowerPetals({
  count = 24,
  className = '',
  colors = DEFAULT_PETAL_COLORS,
}: FlowerPetalsProps) {
  // Generate deterministic petals based on count
  const petals = useMemo<PetalData[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const seed = (i * 9301 + 49297) % 233280;
      const rnd1 = seed / 233280;
      const rnd2 = ((seed * 9301 + 49297) % 233280) / 233280;
      const rnd3 = ((seed * 49297 + 9301) % 233280) / 233280;
      const rnd4 = ((seed * 12345 + 67890) % 233280) / 233280;

      const shapes: ('marigold' | 'rose' | 'jasmine')[] = ['marigold', 'rose', 'jasmine'];
      const shape = shapes[i % shapes.length];
      const color = colors[i % colors.length];

      return {
        id: i,
        x: Math.round(rnd1 * 94) + 3, // 3% to 97%
        delay: Number((rnd2 * 12).toFixed(1)),
        duration: Number((8 + rnd3 * 6).toFixed(1)), // 8s to 14s
        size: Math.round(14 + rnd4 * 14), // 14px to 28px
        rotation: Math.round(180 + rnd1 * 360),
        color,
        shape,
        swayAmount: Math.round(18 + rnd3 * 22), // 18px to 40px
        swayDuration: Number((2.8 + rnd4 * 2).toFixed(1)),
        rotateDirection: i % 2 === 0 ? 1 : -1,
        isMobile: i % 2 === 0 || i < 6,
      };
    });
  }, [count, colors]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden z-10 ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes smoothEffectFall {
          0% {
            transform: translate3d(0, -60px, 0) rotate(0deg);
            opacity: 0;
          }
          8% {
            opacity: 0.9;
          }
          90% {
            opacity: 0.85;
          }
          100% {
            transform: translate3d(0, calc(100vh + 80px), 0) rotate(var(--eff-rot));
            opacity: 0;
          }
        }

        @keyframes smoothEffectSway {
          0% {
            transform: translate3d(calc(-1 * var(--eff-sway)), 0, 0);
          }
          100% {
            transform: translate3d(var(--eff-sway), 0, 0);
          }
        }

        .effect-petal-fall {
          animation: smoothEffectFall var(--eff-duration) linear infinite both;
          animation-delay: calc(var(--eff-delay) * -1);
          will-change: transform;
          backface-visibility: hidden;
        }

        .effect-petal-sway {
          animation: smoothEffectSway var(--eff-sway-duration) ease-in-out infinite alternate both;
          animation-delay: calc(var(--eff-delay) * -0.6);
          will-change: transform;
          backface-visibility: hidden;
        }

        @media (prefers-reduced-motion: reduce) {
          .effect-petal-fall, .effect-petal-sway {
            animation: none !important;
            display: none !important;
          }
        }
      `}</style>

      {petals.map((petal) => {
        const fallStyle: React.CSSProperties & Record<string, string | number> = {
          position: 'absolute',
          top: 0,
          left: `${petal.x}%`,
          '--eff-duration': `${petal.duration}s`,
          '--eff-delay': `${petal.delay}s`,
          '--eff-rot': `${petal.rotation * petal.rotateDirection}deg`,
        };

        const swayStyle: React.CSSProperties & Record<string, string | number> = {
          '--eff-sway': `${petal.swayAmount * petal.rotateDirection}px`,
          '--eff-sway-duration': `${petal.swayDuration}s`,
        };

        return (
          <div
            key={petal.id}
            className={`effect-petal-fall ${petal.isMobile ? '' : 'hidden sm:block'}`}
            style={fallStyle}
          >
            <div className="effect-petal-sway" style={swayStyle}>
              {petal.shape === 'marigold' && (
                <svg
                  viewBox="0 0 24 24"
                  width={petal.size}
                  height={petal.size}
                  fill="none"
                >
                  <path
                    d="M12 2 C8 6, 6 11, 12 18 C18 11, 16 6, 12 2 Z"
                    fill={petal.color}
                    opacity={0.9}
                  />
                  <path
                    d="M12 5 C9.5 8, 8 11, 12 16 C16 11, 14.5 8, 12 5 Z"
                    fill="#FFB703"
                    opacity={0.5}
                  />
                </svg>
              )}

              {petal.shape === 'rose' && (
                <svg
                  viewBox="0 0 24 24"
                  width={petal.size}
                  height={petal.size}
                  fill="none"
                >
                  <path
                    d="M12 3 C6 3 3 8 5 15 C7 20 12 22 15 20 C19 17 21 10 18 5 C16 3 14 3 12 3 Z"
                    fill={petal.color}
                    opacity={0.9}
                  />
                  <path
                    d="M12 6 C8 6 6 10 8 14 C10 17 13 18 15 16 C17 14 17 9 15 7 C14 6 13 6 12 6 Z"
                    fill="#FFF9F0"
                    opacity={0.25}
                  />
                </svg>
              )}

              {petal.shape === 'jasmine' && (
                <svg
                  viewBox="0 0 24 24"
                  width={petal.size}
                  height={petal.size}
                  fill="none"
                >
                  <ellipse
                    cx="12"
                    cy="12"
                    rx="5"
                    ry="9"
                    transform="rotate(25 12 12)"
                    fill={petal.color}
                    opacity={0.88}
                  />
                  <circle cx="12" cy="12" r="1.5" fill="#FFF9F0" opacity={0.7} />
                </svg>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FlowerPetals;
