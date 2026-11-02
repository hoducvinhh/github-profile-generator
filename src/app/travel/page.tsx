"use client";

import * as React from "react";
import Link from "next/link";
import { CountrysideCanvas } from "@/components/travel/countryside-canvas";
import { pastoralAudio } from "@/lib/audio/pastoral-synthesizer";
import { Volume2, VolumeX, ArrowLeft } from "lucide-react";

export default function TravelPage() {
  const [audioEnabled, setAudioEnabled] = React.useState(false);

  // 2.5D Mouse Parallax Coordinates
  const [mouseOffset, setMouseOffset] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;
    // Normalized offset from center (-1 to 1)
    const normX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    const normY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    setMouseOffset({ x: normX * 22, y: normY * 15 });
  };

  const toggleAudio = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!pastoralAudio) return;
    if (audioEnabled) {
      pastoralAudio.stop();
      setAudioEnabled(false);
    } else {
      pastoralAudio.start();
      setAudioEnabled(true);
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onClick={() => {
        // Clicking anywhere gently starts the ambient pastoral audio if not started
        if (!audioEnabled) toggleAudio();
      }}
      className="relative h-screen w-full overflow-hidden bg-[#0c1410] select-none cursor-default"
    >
      {/* 2.5D Living Artwork: Pure Panoramic Rural Vietnam Painting */}
      <div
        className="pointer-events-none absolute inset-[-28px] z-0 bg-cover bg-center transition-transform duration-500 ease-out will-change-transform"
        style={{
          backgroundImage: "url('/travel/vietnam-countryside.jpg')",
          transform: `translate3d(${-mouseOffset.x * 0.8}px, ${-mouseOffset.y * 0.8}px, 0) scale(1.06)`,
        }}
      />

      {/* Subtle Natural Vignette for Depth */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-radial-[circle_at_center] from-transparent via-transparent to-black/35" />

      {/* 60 FPS Canvas: Flying White Storks, Sunbeam Motes & River Light Reflections */}
      <CountrysideCanvas
        parallaxX={mouseOffset.x}
        parallaxY={mouseOffset.y}
      />

      {/* Minimal Icon Controls (Zero Visible Text Words) */}
      <div className="absolute top-5 left-5 z-30 flex items-center gap-3">
        <Link
          href="/"
          onClick={(e) => e.stopPropagation()}
          className="h-9 w-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 hover:border-white/50 text-white/80 hover:text-white transition-all flex items-center justify-center shadow-lg"
          aria-label="Return to ProfileForge"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      <div className="absolute top-5 right-5 z-30 flex items-center gap-3">
        <button
          type="button"
          onClick={toggleAudio}
          className={`h-9 w-9 rounded-full backdrop-blur-md border transition-all flex items-center justify-center shadow-lg cursor-pointer ${
            audioEnabled
              ? "bg-amber-400 text-stone-950 border-amber-300"
              : "bg-black/40 hover:bg-black/70 border-white/20 hover:border-white/50 text-white/80 hover:text-white"
          }`}
          aria-label="Toggle ambient pastoral sound"
        >
          {audioEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
