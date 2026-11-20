'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { animations } from '@/config/theme';

export interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
}

export function SectionReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.6,
}: SectionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  // Directional translation offset (28px)
  const getInitialPosition = () => {
    if (shouldReduceMotion) {
      return { x: 0, y: 0 };
    }

    switch (direction) {
      case 'up':
        return { x: 0, y: 28 };
      case 'down':
        return { x: 0, y: -28 };
      case 'left':
        return { x: 28, y: 0 };
      case 'right':
        return { x: -28, y: 0 };
      default:
        return { x: 0, y: 28 };
    }
  };

  const initialOffset = getInitialPosition();

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        ...initialOffset,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: '-80px',
      }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : duration,
        delay,
        ease: animations.easing.royalEntrance,
      }}
    >
      {children}
    </motion.div>
  );
}

export default SectionReveal;
