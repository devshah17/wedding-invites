'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { InvitationHero } from '@/components/invitation/InvitationHero';
import { DivineBlessingsSection } from '@/components/invitation/DivineBlessingsSection';
import { FamilySection } from '@/components/invitation/FamilySection';
import { ScratchCard } from '@/components/invitation/ScratchCard';
import { EventsSection } from '@/components/invitation/EventsSection';
import { ThankYouSection } from '@/components/invitation/ThankYouSection';
import { FlowerPetals } from '@/components/animations/FlowerPetals';
import { TraditionalCanopy } from '@/components/decorations/TraditionalCanopy';
import { BloomingLotusCorners } from '@/components/decorations/BloomingLotusCorners';
import { SacredSurroundings } from '@/components/decorations/SacredSurroundings';
import { FloatingNavigation } from '@/components/common/FloatingNavigation';
import { MusicToggle } from '@/components/common/MusicToggle';

// Dynamically import the 3D Kedarnath Hero to ensure WebGL only initializes on the client
const KedarnathHero = dynamic(
  () => import('@/components/hero-3d/KedarnathHero'),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-screen bg-gradient-to-b from-[#3267B8] via-[#6BA5E7] to-[#FCEAD2] flex items-center justify-center select-none">
        <div className="text-center p-8 bg-black/30 backdrop-blur-md rounded-2xl border border-antique-gold/40 text-champagne shadow-2xl">
          <p className="font-serif text-sm tracking-[0.3em] uppercase text-antique-gold">|| ॐ नमः शिवाय ||</p>
          <h2 className="font-serif text-3xl font-bold tracking-wide mt-2">The Sacred Himalayan Journey</h2>
          <p className="font-sans text-xs tracking-widest uppercase opacity-80 mt-2">Ascending to Kedarnath Temple...</p>
        </div>
      </div>
    ),
  }
);

export default function NewKedarnathInvitationPage() {
  return (
    <div className="relative min-h-screen bg-[#FCFAF7] text-deep-burgundy selection:bg-antique-gold/30 selection:text-royal-maroon overflow-x-hidden">
      {/* 1. Initial Ceremonial Loading Screen */}
      <LoadingScreen />

      {/* 2. MASTER 3D CINEMATIC KEDARNATH SCROLLING HERO EXPERIENCE */}
      <KedarnathHero />

      {/* 3. Sacred Temple Transition Archway into the Wedding Invitation */}
      <div className="relative z-10 w-full bg-gradient-to-b from-[#FCFAF7] via-ivory to-[#FAF8F5] pt-12 pb-6 px-4 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {/* Ornate Archway Motif matching Kedarnath Reference */}
          <div className="flex items-center gap-4 w-full justify-center">
            <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-antique-gold/60 max-w-xs" />
            <span className="font-serif text-xs uppercase tracking-[0.35em] text-royal-maroon font-semibold px-2">
              The Holy Auspicious Invitation
            </span>
            <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-antique-gold/60 max-w-xs" />
          </div>

          <p className="font-serif text-base sm:text-lg italic text-deep-burgundy/80 mt-3 max-w-xl">
            Basking in the divine eternal blessings of Kedarnath, we humbly welcome you to celebrate the holy union of Dev & Vishakha.
          </p>
        </div>
      </div>

      {/* 4. Continuous Velvet Rose Petal Shower across invitation */}
      <FlowerPetals count={36} />

      {/* 5. Traditional Indian Wedding Canopy (Banana Fronds, Hanging Lamps & Toran) */}
      <TraditionalCanopy />

      {/* 6. Blooming Lotus Clusters in bottom corners */}
      <BloomingLotusCorners />

      {/* 7. Pichwai Trees & Swinging Temple Bells */}
      <SacredSurroundings />

      {/* 8. Full Wedding Invitation Flow */}
      <main className="relative z-10 flex flex-col w-full">
        {/* Couple Introduction & Hero (Calligraphic Ganpati & Royal Elephants) */}
        <InvitationHero />

        {/* Divine Blessings (Shrinathji, Shiv-Parvati, Radha-Krishna & Kamdhenu Cows) */}
        <DivineBlessingsSection />

        {/* Family Invitation & Blessings */}
        <FamilySection />

        {/* Interactive Scratch Card & Live Countdown */}
        <ScratchCard />

        {/* Ceremonies Schedule & Location QR Codes */}
        <EventsSection />

        {/* Closing Blessings & Thank You */}
        <ThankYouSection />
      </main>

      {/* 9. Floating Background Music Player */}
      <MusicToggle />

      {/* 10. Floating Navigation Dock */}
      <FloatingNavigation visible={true} />
    </div>
  );
}
