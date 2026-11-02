"use client";

import * as React from "react";
import Link from "next/link";
import { BlizzardCanvas } from "@/components/showcase/blizzard-canvas";
import { StormScrubber } from "@/components/showcase/storm-scrubber";
import { windAudio } from "@/lib/audio/wind-synthesizer";
import {
  Volume2,
  VolumeX,
  Radio,
  Flame,
  ArrowLeft,
  Activity,
  Terminal as TerminalIcon,
  Crosshair,
  Shield,
  Layers,
} from "lucide-react";

export default function StationPage() {
  const [severity, setSeverity] = React.useState<1 | 2 | 3>(2);
  const [activeSector, setActiveSector] = React.useState("CRYO");
  const [audioEnabled, setAudioEnabled] = React.useState(false);
  const [activeTelemetryLog, setActiveTelemetryLog] = React.useState<string[]>([
    "INITIALIZING OUTPOST 94 PERMAFROST TELEMETRY...",
    "CRYOGENIC CORE DEPTH: 4,200M ACHIEVED.",
    "SURFACE WIND AT 54 KNOTS // SENSORS CALIBRATED.",
    "THERMAL FUSION CORE OPERATING AT 98.4% EFFICIENCY.",
  ]);
  const [isScanning, setIsScanning] = React.useState(false);

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
    const stormLog =
      level === 1
        ? "WIND SPEED MODULATED TO MILD CRYO-DRIFT (-42°C)."
        : level === 2
        ? "ALERT: FREEZING GALE DETECTED. ICE FORMATION ON OBSERVATION VIEWPORT."
        : "CRITICAL: CAT-5 WHITEOUT IN PROGRESS. DEPLOYING THERMAL STABILIZERS.";

    setActiveTelemetryLog((prev) => [stormLog, ...prev.slice(0, 5)]);
  };

  const handleDeepScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setActiveTelemetryLog((prev) => [
      "EMITTING HIGH-FREQUENCY SUB-ICE SONAR PULSE...",
      ...prev,
    ]);

    setTimeout(() => {
      setActiveTelemetryLog((prev) => [
        "SUB-SURFACE ANOMALY DETECTED AT 4,890M DEPTH // ANCIENT EXTRATERRESTRIAL STRATA IDENTIFIED.",
        ...prev,
      ]);
      setIsScanning(false);
    }, 1800);
  };

  return (
    <div className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-[#04060a] text-[#f2f4f8] select-none">
      {/* 60FPS Interactive Blizzard Engine */}
      <BlizzardCanvas severity={severity} />

      {/* Frost Viewport Vignette & Atmospheric Radial Core */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_40%,rgba(16,24,40,0.6)_0%,rgba(4,6,10,0.95)_75%)]" />

      {/* Atmospheric Mountain Ridge Silhouette & Outpost Geometry */}
      <div className="pointer-events-none absolute bottom-12 left-0 right-0 h-96 z-0 opacity-40 overflow-hidden">
        <svg
          viewBox="0 0 1440 400"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          {/* Distant icy mountain ridges */}
          <polygon
            points="0,400 0,220 180,140 320,200 480,90 640,190 840,110 1020,180 1200,80 1440,240 1440,400"
            fill="#09101d"
          />
          {/* Midground ridge with outpost research dome & communication array */}
          <polygon
            points="0,400 0,310 240,250 420,280 620,230 720,200 780,200 880,240 1100,220 1280,290 1440,270 1440,400"
            fill="#05080e"
          />
          {/* Outpost Dome Silhouette */}
          <path
            d="M 680 230 A 40 40 0 0 1 760 230 Z"
            fill="#0f1626"
            stroke="#ff5f1f"
            strokeWidth="1.5"
            opacity="0.8"
          />
          {/* Communication Tower Antenna */}
          <line
            x1="720"
            y1="190"
            x2="720"
            y2="130"
            stroke="#ff5f1f"
            strokeWidth="2"
          />
          <circle cx="720" cy="128" r="4" fill="#ff5f1f" />
        </svg>

        {/* Emergency Beacon Light */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[140px] flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f1f]" />
        </div>
      </div>

      {/* Edge Stamps - Vertical Technical Badges (Villa Castagneto reference) */}
      <div className="hidden xl:flex fixed left-3 top-1/2 -translate-y-1/2 vertical-stamp text-xs font-mono tracking-widest text-zinc-400 uppercase pointer-events-none z-30">
        [// OUTPOST_94 // CRYO_BELT // SECTOR_04 // PERMAFROST: 4,200M]
      </div>
      <div className="hidden xl:flex fixed right-3 top-1/2 -translate-y-1/2 vertical-stamp text-xs font-mono tracking-widest text-zinc-400 uppercase pointer-events-none z-30">
        [// ATMOSPHERE: 94% N2, 6% CH4 // RADIATION_SHIELD: NOMINAL]
      </div>

      {/* Top Telemetry Header Bar */}
      <header className="relative z-30 w-full border-b border-white/[0.12] px-4 sm:px-8 py-3.5 backdrop-blur-md bg-[#04060a]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
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
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-zinc-400">
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

      {/* Main Cinematic Center Stage */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 text-center max-w-4xl mx-auto w-full">
        {/* Top Telemetry Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-black/40 text-xs font-mono text-zinc-300 mb-4 backdrop-blur-md">
          <Radio className="h-3.5 w-3.5 text-[#ff773d]" />
          <span>DEEP SPACE PERMAFROST OBSERVATORY · EXOPLANET SECTOR 4</span>
        </div>

        {/* Ultra-Condensed Bold Headline */}
        <h1 className="font-display uppercase tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] text-white">
          OUTPOST 94
          <br />
          <span className="text-[#ff5f1f]">
            SUB-ZERO RESEARCH COMPLEX
          </span>
        </h1>

        <p className="mt-4 max-w-xl text-xs sm:text-sm text-zinc-300 font-mono leading-relaxed [text-wrap:pretty]">
          Sub-surface core extraction and deep space radio astronomy in the Outer Cryo-Belt, operating through persistent sub-zero blizzards.
        </p>

        {/* Real-time Telemetry Terminal Box */}
        <div className="mt-8 w-full max-w-2xl rounded-xl border border-white/15 bg-[#05070c]/90 shadow-2xl backdrop-blur-xl p-4 text-left font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <div className="flex items-center gap-2 text-zinc-300">
              <TerminalIcon className="h-3.5 w-3.5 text-[#ff773d]" />
              <span className="font-bold text-white uppercase">Live Outpost Telemetry</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>SENSOR ARRAY ACTIVE</span>
            </div>
          </div>

          {/* Interactive Log Feed */}
          <div className="space-y-1 font-mono text-xs max-h-24 overflow-y-auto text-zinc-300">
            {activeTelemetryLog.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-[#ff773d] select-none">&gt;</span>
                <span className={index === 0 ? "text-emerald-400 font-semibold" : "text-zinc-300"}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
            <span className="text-zinc-400 text-xs hidden sm:inline">
              READY FOR DEEP-CORE EXTRACTION
            </span>

            <button
              type="button"
              onClick={handleDeepScan}
              disabled={isScanning}
              className="w-full sm:w-auto h-9 px-4 rounded bg-[#ff5f1f] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#ff773d] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Crosshair className="h-3.5 w-3.5" />
              <span>{isScanning ? "TRANSMITTING SONAR..." : "COMMENCE DEEP SCAN"}</span>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Storm Intensity Scrubber (Direct Villa Castagneto Reference) */}
      <StormScrubber
        severity={severity}
        onSelectSeverity={handleSeverityChange}
        activeSector={activeSector}
        onSelectSector={setActiveSector}
      />
    </div>
  );
}
