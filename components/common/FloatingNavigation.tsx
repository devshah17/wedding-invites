'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Home, Users, Calendar, Sparkles } from 'lucide-react';
import { RSVPModal } from '@/components/invitation/RSVPModal';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'families', label: 'Families', icon: Users },
  { id: 'date', label: 'Save Date', icon: Calendar },
  { id: 'events', label: 'Ceremonies', icon: Sparkles },
];

interface FloatingNavigationProps {
  visible?: boolean;
}

export function FloatingNavigation({ visible = true }: FloatingNavigationProps) {
  const [activeSection, setActiveSection] = useState('home');
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Floating Bottom Center Bar */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[94vw]">
        <motion.nav
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex items-center gap-0.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-ivory/90 backdrop-blur-md border border-antique-gold/40 shadow-xl"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`relative flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-champagne font-semibold shadow-xs'
                    : 'text-royal-maroon hover:text-antique-gold'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-royal-maroon to-deep-burgundy"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              </button>
            );
          })}

          <div className="h-4 w-[1px] bg-antique-gold/30 mx-0.5 sm:mx-1" />

          {/* Quick RSVP Trigger in Nav */}
          <button
            type="button"
            onClick={() => setIsRSVPOpen(true)}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full bg-antique-gold/20 hover:bg-antique-gold/30 text-royal-maroon text-xs font-sans font-bold transition-colors shrink-0"
          >
            <Heart className="w-3.5 h-3.5 text-royal-maroon fill-royal-maroon" />
            <span>RSVP</span>
          </button>
        </motion.nav>
      </div>

      <RSVPModal isOpen={isRSVPOpen} onClose={() => setIsRSVPOpen(false)} />
    </>
  );
}

export default FloatingNavigation;
