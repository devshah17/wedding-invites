'use client';

import React, { useMemo, useSyncExternalStore } from 'react';

export interface FloatingParticlesProps {
  /** Number of floating gold particles (default: 25) */
  count?: number;
  /** Optional custom CSS class name */
  className?: string;
}

interface ParticleConfig {
  id: number;
  left: number; // percentage (0 - 100)
  top: number; // percentage (0 - 100)
  size: number; // px (2 - 6)
  color: string;
  duration: number; // seconds (5 - 12)
  delay: number; // seconds (0 - 6)
  driftX: number; // px (-20 to +20)
  driftY: number; // px (-40 to -90)
  maxOpacity: number; // 0.2 - 0.5
  glow: boolean;
}

const GOLD_SHADES = [
  '#C99A45', // Antique Gold
  '#E8C872', // Light Gold
  '#F5C518', // Sun Gold
  '#E2CA9D', // Champagne Gold
];

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const emptySubscribe = () => () => {};

function subscribeVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
}

function generateParticles(count: number): ParticleConfig[] {
  return Array.from({ length: count }, (_, i) => {
    const seed1 = (i * 9301 + 49297) % 233280;
    const seed2 = (i * 49297 + 9301) % 233280;
    const seed3 = (i * 233280 + 49297) % 9301;
    const r1 = seed1 / 233280;
    const r2 = seed2 / 233280;
    const r3 = seed3 / 9301;

    const size = +(2 + r1 * 4).toFixed(1); // 2 - 6px
    const duration = +(5 + r2 * 7).toFixed(1); // 5 - 12s
    const delay = +(r3 * 6).toFixed(1); // 0 - 6s
    const driftX = +(-20 + r1 * 40).toFixed(1); // -20 to 20px
    const driftY = +(-40 - r2 * 50).toFixed(1); // -40 to -90px
    const maxOpacity = +(0.2 + r3 * 0.3).toFixed(2); // 0.2 - 0.5
    const color = GOLD_SHADES[i % GOLD_SHADES.length];
    const left = +(r1 * 100).toFixed(1);
    const top = +(10 + r2 * 85).toFixed(1);
    const glow = r3 > 0.4;

    return {
      id: i,
      left,
      top,
      size,
      color,
      duration,
      delay,
      driftX,
      driftY,
      maxOpacity,
      glow,
    };
  });
}

export function FloatingParticles({
  count = 25,
  className = '',
}: FloatingParticlesProps) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const isPaused = useSyncExternalStore(
    subscribeVisibility,
    () => document.hidden,
    () => false
  );

  const particles = useMemo(() => generateParticles(count), [count]);

  // If reduced motion is requested or before mount, render nothing
  if (!mounted || prefersReducedMotion) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes goldenParticleFloat {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0;
          }
          20% {
            opacity: var(--particle-opacity, 0.4);
          }
          80% {
            opacity: var(--particle-opacity, 0.4);
          }
          100% {
            transform: translate3d(var(--drift-x, 15px), var(--drift-y, -60px), 0);
            opacity: 0;
          }
        }
      `}</style>
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
        aria-hidden="true"
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={
              {
                position: 'absolute',
                left: `${p.left}%`,
                top: `${p.top}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: '50%',
                backgroundColor: p.color,
                boxShadow: p.glow
                  ? `0 0 ${p.size * 2}px ${p.color}, 0 0 ${p.size * 3}px rgba(232, 200, 114, 0.5)`
                  : 'none',
                '--particle-opacity': p.maxOpacity,
                '--drift-x': `${p.driftX}px`,
                '--drift-y': `${p.driftY}px`,
                animation: `goldenParticleFloat ${p.duration}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
                animationPlayState: isPaused ? 'paused' : 'running',
                willChange: 'transform, opacity',
              } as React.CSSProperties
            }
          />
        ))}
      </div>
    </>
  );
}

export default FloatingParticles;
