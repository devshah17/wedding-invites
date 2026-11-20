'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function AmbientSoundControl() {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bellIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const windGainRef = useRef<GainNode | null>(null);

  // Play peaceful temple bell chime using Web Audio API
  const playTempleBell = () => {
    if (!audioCtxRef.current || audioCtxRef.current.state !== 'running') return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;

    // Harmonic bell frequencies (authentic Himalayan bronze temple bell)
    const bellFrequencies = [587.33, 880.0, 1174.66, 1760.0];
    const bellGains = [0.25, 0.15, 0.08, 0.04];

    bellFrequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(bellGains[i], now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 4.0);
    });
  };

  const startAmbience = async () => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }

      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;

      // Soft Himalayan mountain wind breeze (filtered noise generator)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Low pass filter for soft gentle mountain wind
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      windGainRef.current = gain;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start();

      // Trigger initial temple bell, then recurring every 9 seconds
      playTempleBell();
      bellIntervalRef.current = setInterval(() => {
        playTempleBell();
      }, 9000);

      setIsAudioActive(true);
    } catch {
      // Audio context error or user rejected
    }
  };

  const stopAmbience = () => {
    if (bellIntervalRef.current) {
      clearInterval(bellIntervalRef.current);
      bellIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.suspend();
    }
    setIsAudioActive(false);
  };

  const toggleSound = () => {
    if (isAudioActive) {
      stopAmbience();
    } else {
      startAmbience();
    }
  };

  useEffect(() => {
    return () => {
      stopAmbience();
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      type="button"
      className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-antique-gold/50 text-[#FAF0D7] shadow-lg transition-all active:scale-95 cursor-pointer"
      aria-label={isAudioActive ? 'Mute Himalayan Ambience' : 'Play Himalayan Ambience'}
    >
      {isAudioActive ? (
        <>
          <Volume2 className="w-4 h-4 text-antique-gold animate-pulse" />
          <span className="text-[10px] sm:text-xs font-sans tracking-wider uppercase font-medium">Ambience On</span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4 text-white/70" />
          <span className="text-[10px] sm:text-xs font-sans tracking-wider uppercase font-medium text-white/80">Ambience</span>
        </>
      )}
    </button>
  );
}

export default AmbientSoundControl;
