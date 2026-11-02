"use client";

import * as React from "react";
import Link from "next/link";
import { BlizzardCanvas } from "@/components/showcase/blizzard-canvas";
import { StormScrubber } from "@/components/showcase/storm-scrubber";
import { windAudio } from "@/lib/audio/wind-synthesizer";
import { Volume2, VolumeX, ArrowLeft } from "lucide-react";

export default function StationPage() {
  const [severity, setSeverity] = React.useState<1 | 2 | 3>(2);
  const [activeSector, setActiveSector] = React.useState<string>("STATION");
  const [audioEnabled, setAudioEnabled] = React.useState(false);

  const toggleAudio = () => {
    if (!windAudio) return;
    if (audioEnabled) {
      windAudio.stop();
      setAudioEnabled(false);
    } else {
      windAudio.start(severity);
      setAudioEnabled(true);
    }
  };

  const handleSeverityChange = (level: 1 | 2 | 3) => {
    setSeverity(level);
    if (windAudio && audioEnabled) {
      windAudio.setSeverity(level);
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-[#04060a] text-[#f2f4f8] select-none">
      {/* Visual Masterpiece: Outpost 94 & Damaged Spaceship Artwork */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: "url('/showcase/outpost-blizzard.jpg')" }}
      />

      {/* Subtle Atmospheric Vignette (guarantees WCAG AA readability without darkening the art) */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-[#04060a]/90 via-transparent to-[#04060a]/80" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-radial-[circle_at_center] from-transparent via-transparent to-[#04060a]/60" />

      {/* 60FPS Interactive Blizzard Engine Swirling Over Scene */}
      <BlizzardCanvas severity={severity} />

      {/* Edge Stamps - Vertical Technical Badges (1:1 with Villa Castagneto reference) */}
      <div className="hidden xl:flex fixed left-3 top-1/2 -translate-y-1/2 vertical-stamp text-xs font-mono tracking-widest text-zinc-400 uppercase pointer-events-none z-30">
        [// OUTPOST_94 // CRYO_BELT // SECTOR_04 // PERMAFROST: 4,200M]
      </div>
      <div className="hidden xl:flex fixed right-3 top-1/2 -translate-y-1/2 vertical-stamp text-xs font-mono tracking-widest text-zinc-400 uppercase pointer-events-none z-30">
        [// VESSEL: EX-744 // STATUS: CRITICAL // DISTRESS_BEACON: 142.8MHZ]
      </div>

      {/* Top Header Bar */}
      <header className="relative z-30 w-full border-b border-white/[0.12] px-4 sm:px-8 py-3.5 backdrop-blur-md bg-[#04060a]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
              title="Return to ProfileForge Studio"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">RETURN</span>
            </Link>

            <div className="h-3.5 w-[1px] bg-white/20 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-bold tracking-tight text-sm uppercase text-white font-mono">
                OUTPOST 94
              </span>
              <span className="text-xs font-mono text-zinc-200 px-2 py-0.5 rounded border border-[#ff5f1f]/50 bg-[#ff5f1f]/20">
                CRYO-LAB
              </span>
            </div>
          </div>

          {/* Center Coordinates */}
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-zinc-300">
            <span>LAT 82°04&apos;N // LONG 14°18&apos;W</span>
            <span className="text-zinc-600">·</span>
            <span className="text-emerald-400">BEACON LOCKED</span>
          </div>

          {/* Right Action: Web Audio Ambient Wind Synthesizer */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleAudio}
              className={`h-8 px-3 rounded-md text-xs font-mono font-medium border flex items-center gap-1.5 transition-colors ${
                audioEnabled
                  ? "border-[#ff5f1f] bg-zinc-900 text-white"
                  : "border-white/15 bg-white/[0.04] text-zinc-300 hover:text-white"
              }`}
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-[#ff773d]" />
                  <span>BLIZZARD AUDIO: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5" />
                  <span>UNMUTE WIND 🔊</span>
                </>
              )}
            </button>

            <Link href="/builder">
              <button
                type="button"
                className="h-8 px-3.5 rounded-md text-xs font-mono font-bold bg-[#ff5f1f] text-black hover:bg-[#ff773d] transition-colors shadow-md"
              >
                OPEN FORGE ⚡
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Center Stage (Clean, Minimal & Pure — Exact Villa Castagneto Structure) */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 text-center max-w-4xl mx-auto w-full">
        {/* Ultra-Condensed Bold Headline */}
        <h1 className="font-display uppercase tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] text-white drop-shadow-2xl">
          OUTPOST 94
          <br />
          <span className="text-[#ff5f1f]">
            THE FALLEN RECON CRAFT
          </span>
        </h1>

        {/* Short, Poetic Editorial Subtext */}
        <p className="mt-4 max-w-xl text-sm sm:text-base text-zinc-200 font-mono leading-relaxed [text-wrap:pretty] drop-shadow-md">
          A deep-space cryogenic station on the permafrost cliff. A fallen scout ship half-buried in the snow below.
        </p>

        {/* Single Elegant Pill CTA Button (Echoing 'Write to us about dates') */}
        <div className="mt-8 flex items-center justify-center">
          <Link href="/builder">
            <button
              type="button"
              className="h-11 px-8 rounded-full bg-[#ff5f1f] text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-[#ff773d] transition-all shadow-xl hover:scale-105 cursor-pointer"
            >
              TRANSMIT RESCUE SIGNAL 📡
            </button>
          </Link>
        </div>
      </main>

      {/* Bottom Storm Intensity Scrubber (Direct 1:1 Villa Castagneto Month-Strip Reference) */}
      <StormScrubber
        severity={severity}
        onSelectSeverity={handleSeverityChange}
        activeSector={activeSector}
        onSelectSector={setActiveSector}
      />
    </div>
  );
}
