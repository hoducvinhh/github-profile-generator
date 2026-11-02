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
  ArrowLeft,
  Terminal as TerminalIcon,
  Crosshair,
  ShieldAlert,
  Compass,
} from "lucide-react";

type TargetId = "STATION" | "SHIP";

export default function StationPage() {
  const [severity, setSeverity] = React.useState<1 | 2 | 3>(2);
  const [activeSector, setActiveSector] = React.useState<string>("STATION");
  const [activeTarget, setActiveTarget] = React.useState<TargetId>("STATION");
  const [audioEnabled, setAudioEnabled] = React.useState(false);
  const [isScanning, setIsScanning] = React.useState(false);

  const [stationLogs, setStationLogs] = React.useState<string[]>([
    "OUTPOST 94 GEODESIC DOMES 1-3 MAINTAINING 1.02 ATM PRESSURE.",
    "RADAR DISH LOCKED ON RECON EX-744 EMERGENCY BEACON (142.8 MHZ).",
    "THERMAL FUSION CORE EFFICIENCY STABLE AT 98.4%.",
    "DEEP SUB-ICE CORING MAST PENETRATING PERMAFROST AT 4,200 METERS.",
  ]);

  const [shipLogs, setShipLogs] = React.useState<string[]>([
    "CRITICAL: RECON SCOUT EX-744 CRASH-LANDED IN SECTOR 4 RAVINE.",
    "ATMOSPHERIC ENTRY HULL SCORCHING CONFIRMED // STARBOARD WING FRACTURED.",
    "EMERGENCY AMBER BEACON BROADCASTING TELEMETRY OVER LOCAL PERMAFROST.",
    "BIO-TELEMETRY: STASIS COCOON INTACT // 1 LIFE SIGN DETECTED IN FORWARD COCKPIT.",
  ]);

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
        ? "WIND SPEED MODULATED TO MILD CRYO-DRIFT (-42°C, 18 KNOTS)."
        : level === 2
        ? "ALERT: FREEZING GALE DETECTED. ICE FORMATION ON OBSERVATION VIEWPORT."
        : "CRITICAL: CAT-5 WHITEOUT IN PROGRESS. DEPLOYING HEAVY THERMAL STABILIZERS.";

    if (activeTarget === "STATION") {
      setStationLogs((prev) => [stormLog, ...prev.slice(0, 4)]);
    } else {
      setShipLogs((prev) => [stormLog, ...prev.slice(0, 4)]);
    }
  };

  const handleSelectTarget = (target: TargetId) => {
    setActiveTarget(target);
    setActiveSector(target);
  };

  const handleSectorSelect = (sector: string) => {
    setActiveSector(sector);
    if (sector === "SHIP" || sector === "STATION") {
      setActiveTarget(sector);
    }
  };

  const handleTriggerAction = () => {
    if (isScanning) return;
    setIsScanning(true);

    if (activeTarget === "STATION") {
      setStationLogs((prev) => [
        "EMITTING HIGH-FREQUENCY SUB-ICE SONAR PULSE...",
        ...prev,
      ]);
      setTimeout(() => {
        setStationLogs((prev) => [
          "SUB-SURFACE ANOMALY CONFIRMED AT 4,890M DEPTH // ANCIENT EXTRATERRESTRIAL STRATA DETECTED.",
          ...prev,
        ]);
        setIsScanning(false);
      }, 1800);
    } else {
      setShipLogs((prev) => [
        "DISPATCHING AUTOMATED CRYO-RESCUE DRONE TO VESSEL EX-744...",
        ...prev,
      ]);
      setTimeout(() => {
        setShipLogs((prev) => [
          "DRONE DOCKED WITH FORWARD HATCH // LIFE-SUPPORT UMBILICAL SECURED // EXTRACTION READY.",
          ...prev,
        ]);
        setIsScanning(false);
      }, 1800);
    }
  };

  const activeLogs = activeTarget === "STATION" ? stationLogs : shipLogs;

  return (
    <div className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-[#04060a] text-[#f2f4f8] select-none">
      {/* Visual Masterpiece: Outpost 94 & Damaged Spaceship Illustration */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: "url('/showcase/outpost-blizzard.jpg')" }}
      />

      {/* Atmospheric Vignette & Contrast Control (guarantees WCAG AA readability) */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-[#04060a] via-black/45 to-[#04060a]/90" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#04060a]/70 via-transparent to-[#04060a]/70" />

      {/* 60FPS Interactive Blizzard Engine Swirling Over Scene */}
      <BlizzardCanvas severity={severity} />

      {/* Interactive Target Pins Over Visual Scenery (Positioned in gutters to prevent text occlusion) */}
      {/* Target Pin 1: Outpost 94 Research Station (Top Left Cliff) */}
      <button
        type="button"
        onClick={() => handleSelectTarget("STATION")}
        className={`hidden md:flex absolute top-20 sm:top-24 left-4 sm:left-8 z-30 items-center gap-2.5 group transition-all cursor-pointer ${
          activeTarget === "STATION" ? "scale-105" : "opacity-85 hover:opacity-100"
        }`}
        title="Chọn trạm nghiên cứu Outpost 94"
      >
        <div
          className={`h-4 w-4 rounded-full flex items-center justify-center border transition-all ${
            activeTarget === "STATION"
              ? "border-[#ff5f1f] bg-[#ff5f1f]"
              : "border-white/60 bg-black/70"
          }`}
        >
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              activeTarget === "STATION" ? "bg-black" : "bg-white"
            }`}
          />
        </div>
        <div className="flex flex-col items-start px-2.5 py-1.5 rounded border border-white/20 bg-black/85 backdrop-blur-md text-left font-mono shadow-xl">
          <span className="text-xs font-bold text-white tracking-wider">
            [01 · OUTPOST 94]
          </span>
          <span className="text-xs text-[#ff773d]">
            RESEARCH DOMES &amp; RADAR ARRAY
          </span>
        </div>
      </button>

      {/* Target Pin 2: Crashed Scout Spaceship EX-744 (Bottom Right Ravine) */}
      <button
        type="button"
        onClick={() => handleSelectTarget("SHIP")}
        className={`hidden md:flex absolute bottom-20 sm:bottom-24 right-4 sm:right-8 z-30 items-center gap-2.5 group transition-all cursor-pointer ${
          activeTarget === "SHIP" ? "scale-105" : "opacity-85 hover:opacity-100"
        }`}
        title="Chọn con tàu bị rơi EX-744"
      >
        <div
          className={`h-4 w-4 rounded-full flex items-center justify-center border transition-all ${
            activeTarget === "SHIP"
              ? "border-amber-400 bg-amber-400"
              : "border-white/60 bg-black/70"
          }`}
        >
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              activeTarget === "SHIP" ? "bg-black" : "bg-white"
            }`}
          />
        </div>
        <div className="flex flex-col items-start px-2.5 py-1.5 rounded border border-amber-500/60 bg-black/90 backdrop-blur-md text-left font-mono shadow-xl">
          <span className="text-xs font-bold text-amber-300 tracking-wider">
            [02 · CRASHED SCOUT EX-744]
          </span>
          <span className="text-xs text-zinc-200">
            DAMAGED WING · BEACON ON · 1 SURVIVOR
          </span>
        </div>
      </button>

      {/* Edge Stamps - Vertical Technical Badges (Villa Castagneto reference) */}
      <div className="hidden xl:flex fixed left-3 top-1/2 -translate-y-1/2 vertical-stamp text-xs font-mono tracking-widest text-zinc-400 uppercase pointer-events-none z-30">
        [// OUTPOST_94 // CRYO_BELT // SECTOR_04 // PERMAFROST: 4,200M]
      </div>
      <div className="hidden xl:flex fixed right-3 top-1/2 -translate-y-1/2 vertical-stamp text-xs font-mono tracking-widest text-zinc-400 uppercase pointer-events-none z-30">
        [// VESSEL: EX-744 // STATUS: CRITICAL // DISTRESS_BEACON: 142.8MHZ]
      </div>

      {/* Top Telemetry Header Bar */}
      <header className="relative z-30 w-full border-b border-white/[0.12] px-4 sm:px-8 py-3.5 backdrop-blur-md bg-[#04060a]/85">
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

          {/* Center Coordinates & Target Status */}
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

      {/* Main Cinematic Center Stage */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 text-center max-w-4xl mx-auto w-full">
        {/* Top Telemetry Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-black/60 text-xs font-mono text-zinc-300 mb-3 backdrop-blur-md">
          <Radio className="h-3.5 w-3.5 text-[#ff773d]" />
          <span>DEEP SPACE PERMAFROST OBSERVATORY · EXOPLANET SECTOR 4</span>
        </div>

        {/* Ultra-Condensed Bold Headline */}
        <h1 className="font-display uppercase tracking-tight text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] text-white drop-shadow-md">
          OUTPOST 94
          <br />
          <span className="text-[#ff5f1f]">
            THE FALLEN RECON CRAFT
          </span>
        </h1>

        <p className="mt-3 max-w-xl text-xs sm:text-sm text-zinc-200 font-mono leading-relaxed [text-wrap:pretty] drop-shadow">
          A sub-zero research base overlooking a stranded recon scout vessel embedded in the snow blizzard. Select targets to inspect telemetry.
        </p>

        {/* Two Target Selector Pills */}
        <div className="mt-4 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSelectTarget("STATION")}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors flex items-center gap-1.5 ${
              activeTarget === "STATION"
                ? "border-[#ff5f1f] bg-[#ff5f1f] text-black font-bold"
                : "border-white/20 bg-black/60 text-zinc-300 hover:text-white"
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>01 · OUTPOST 94 COMPLEX</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectTarget("SHIP")}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors flex items-center gap-1.5 ${
              activeTarget === "SHIP"
                ? "border-amber-400 bg-amber-400 text-black font-bold"
                : "border-white/20 bg-black/60 text-zinc-300 hover:text-white"
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>02 · CRASHED SCOUT EX-744</span>
          </button>
        </div>

        {/* Real-time Telemetry Terminal Box */}
        <div className="mt-6 w-full max-w-2xl rounded-xl border border-white/15 bg-[#05070c]/90 shadow-2xl backdrop-blur-xl p-4 text-left font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
            <div className="flex items-center gap-2 text-zinc-300">
              <TerminalIcon className="h-3.5 w-3.5 text-[#ff773d]" />
              <span className="font-bold text-white uppercase">
                {activeTarget === "STATION"
                  ? "Live Outpost 94 Diagnostics"
                  : "Vessel EX-744 Crash Telemetry"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  activeTarget === "STATION" ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span>
                {activeTarget === "STATION" ? "SYSTEMS NOMINAL" : "BEACON BROADCASTING"}
              </span>
            </div>
          </div>

          {/* Interactive Log Feed */}
          <div className="space-y-1 font-mono text-xs max-h-24 overflow-y-auto text-zinc-300">
            {activeLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-[#ff773d] select-none">&gt;</span>
                <span
                  className={
                    index === 0
                      ? activeTarget === "STATION"
                        ? "text-emerald-400 font-semibold"
                        : "text-amber-300 font-semibold"
                      : "text-zinc-300"
                  }
                >
                  {log}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
            <span className="text-zinc-400 text-xs hidden sm:inline">
              {activeTarget === "STATION"
                ? "READY FOR SUB-ICE PROBE PENETRATION"
                : "STASIS LIFE POD EXTRACTION READY"}
            </span>

            <button
              type="button"
              onClick={handleTriggerAction}
              disabled={isScanning}
              className="w-full sm:w-auto h-9 px-4 rounded bg-[#ff5f1f] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#ff773d] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Crosshair className="h-3.5 w-3.5" />
              <span>
                {isScanning
                  ? "TRANSMITTING PULSE..."
                  : activeTarget === "STATION"
                  ? "COMMENCE DEEP SCAN"
                  : "DEPLOY RESCUE DRONE"}
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Storm Intensity Scrubber (Direct Villa Castagneto Reference) */}
      <StormScrubber
        severity={severity}
        onSelectSeverity={handleSeverityChange}
        activeSector={activeSector}
        onSelectSector={handleSectorSelect}
      />
    </div>
  );
}
