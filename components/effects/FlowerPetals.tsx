'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

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
  rotateZ: number;
  color: string;
  shape: 'marigold' | 'rose' | 'jasmine';
  swayX: number;
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
      // Semi-random deterministic values
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
        x: Math.round(rnd1 * 96) + 2, // 2% to 98%
        delay: Number((rnd2 * 5).toFixed(2)),
        duration: Number((7 + rnd3 * 6).toFixed(2)), // 7s to 13s
        size: Math.round(14 + rnd4 * 16), // 14px to 30px
        rotation: Math.round(rnd1 * 360),
        rotateZ: Math.round(rnd2 * 720) - 360,
        color,
        shape,
        swayX: Math.round((rnd3 - 0.5) * 80), // -40px to +40px sway
      };
    });
  }, [count, colors]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden z-10 ${className}`}
      aria-hidden="true"
    >
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute top-[-40px]"
          style={{
            left: `${petal.x}%`,
            width: petal.size,
            height: petal.size,
          }}
          initial={{
            y: -50,
            x: 0,
            opacity: 0,
            rotate: 0,
            rotateY: 0,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, petal.swayX, -petal.swayX * 0.5, petal.swayX * 0.8],
            opacity: [0, 0.85, 0.95, 0.8, 0],
            rotate: [petal.rotation, petal.rotation + petal.rotateZ],
            rotateY: [0, 180, 360],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {petal.shape === 'marigold' && (
            <svg
              viewBox="0 0 24 24"
              width={petal.size}
              height={petal.size}
              fill="none"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
            >
              {/* Layered Indian Marigold petal */}
              <path
                d="M12 2 C8 6, 6 11, 12 18 C18 11, 16 6, 12 2 Z"
                fill={petal.color}
                opacity={0.9}
              />
              <path
                d="M12 5 C9.5 8, 8 11, 12 16 C16 11, 14.5 8, 12 5 Z"
                fill="#FFB703"
                opacity={0.4}
              />
            </svg>
          )}

          {petal.shape === 'rose' && (
            <svg
              viewBox="0 0 24 24"
              width={petal.size}
              height={petal.size}
              fill="none"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
            >
              {/* Rounded curved rose petal */}
              <path
                d="M12 3 C6 3 3 8 5 15 C7 20 12 22 15 20 C19 17 21 10 18 5 C16 3 14 3 12 3 Z"
                fill={petal.color}
                opacity={0.88}
              />
              <path
                d="M12 6 C8 6 6 10 8 14 C10 17 13 18 15 16 C17 14 17 9 15 7 C14 6 13 6 12 6 Z"
                fill="#FFF9F0"
                opacity={0.2}
              />
            </svg>
          )}

          {petal.shape === 'jasmine' && (
            <svg
              viewBox="0 0 24 24"
              width={petal.size}
              height={petal.size}
              fill="none"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
            >
              {/* Delicate teardrop floral petal */}
              <ellipse
                cx="12"
                cy="12"
                rx="5"
                ry="9"
                transform="rotate(25 12 12)"
                fill={petal.color}
                opacity={0.85}
              />
              <circle cx="12" cy="12" r="1.5" fill="#FFF9F0" opacity={0.6} />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default FlowerPetals;
