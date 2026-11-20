'use client';

import React, { useState } from 'react';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { InvitationEnvelope } from '@/components/invitation/InvitationEnvelope';
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

export default function Home() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#FCFAF7] text-deep-burgundy selection:bg-antique-gold/30 selection:text-royal-maroon overflow-x-hidden">
      {/* 1. Initial Ceremonial Loading Screen */}
      <LoadingScreen />

      {/* 2. Opening 3D Royal Invitation Envelope Experience */}
      <InvitationEnvelope onOpen={() => setEnvelopeOpened(true)} />

      {/* 3. Continuous Velvet Rose Petals Shower (Active throughout the entire page) */}
      <FlowerPetals count={38} />

      {/* 4. Traditional Indian Wedding Canopy (Banana Tree Fronds, Top Marigold Toran, Hanging Jasmine & Brass Lamps) */}
      <TraditionalCanopy />

      {/* 5. Blooming Pink Lotus Clusters & Sage Foliage in Bottom Corners */}
      <BloomingLotusCorners />

      {/* 6. Animated Left & Right Surroundings: Swaying Pichwai Trees & Swinging Temple Bells */}
      <SacredSurroundings />

      {/* 7. Main Invitation Content */}
      <main className="relative z-10 flex flex-col w-full">
        {/* Section 2: Couple Introduction & Hero (with Calligraphic Ganpati & Royal Elephants) */}
        <InvitationHero />

        {/* Section 2.5: Divine Blessings (Shrinathji, Shiv-Parvati, Radha-Krishna & Kamdhenu Cows) */}
        <DivineBlessingsSection />

        {/* Section 3: Family Invitation & Blessings */}
        <FamilySection />

        {/* Section 4: Interactive Scratch Card & Live Countdown (Jan 20, 2027) */}
        <ScratchCard />

        {/* Section 5 & 6: Ceremonies Schedule & Location QR Codes */}
        <EventsSection />

        {/* Section 10: Closing Blessings & Thank You */}
        <ThankYouSection />
      </main>

      {/* 8. Floating Background Instrumental Music Player (Bottom Left) */}
      <MusicToggle />

      {/* 9. Floating Navigation Dock Bar (Bottom Center) */}
      <FloatingNavigation visible={envelopeOpened} />
    </div>
  );
}
