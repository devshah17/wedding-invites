'use client';

import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { KedarnathCanvas } from './KedarnathCanvas';
import { WeddingNameReveal } from './WeddingNameReveal';
import { AmbientSoundControl } from './AmbientSoundControl';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function KedarnathHero() {
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);
  const pinTargetRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const track = scrollTrackRef.current;
    const pinTarget = pinTargetRef.current;
    if (!track || !pinTarget) return;

    // Create GSAP ScrollTrigger timeline to pin the hero for 450vh scroll duration
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      pin: pinTarget,
      pinSpacing: false,
      scrub: 1.2, // Smooth momentum scrub
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div
      ref={scrollTrackRef}
      className="relative w-full h-[450vh] bg-[#3267B8]"
      id="kedarnath-journey"
    >
      {/* Pinned 100vh Fullscreen Viewport */}
      <div
        ref={pinTargetRef}
        className="sticky top-0 w-full h-screen overflow-hidden select-none"
      >
        {/* 1. Interactive 3D Himalayan & Kedarnath WebGL Canvas */}
        <KedarnathCanvas
          scrollProgress={scrollProgress}
          className="absolute inset-0 z-0"
        />

        {/* 2. Top-Right Ambient Himalayan Sound Toggle */}
        <AmbientSoundControl />

        {/* 3. Luxury Typography Overlay (Dev weds Vishakha) */}
        <WeddingNameReveal scrollProgress={scrollProgress} />

        {/* 4. Bottom Vignette Transition into the rest of the invitation */}
        <div
          style={{
            opacity: Math.max(0, (scrollProgress - 0.85) / 0.15),
          }}
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FCFAF7] via-[#FCFAF7]/60 to-transparent pointer-events-none z-10 transition-opacity"
        />
      </div>
    </div>
  );
}

export default KedarnathHero;
