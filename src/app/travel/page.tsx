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
    setMouseOffset({ x: normX * 16, y: normY * 10 });
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
        // Clicking anywhere toggles the ambient pastoral audio
        toggleAudio();
      }}
      className="relative h-screen w-full overflow-hidden bg-[#0a0f0d] select-none cursor-pointer"
    >
      {/* 2.5D Living Artwork: Ultra-Sharp Crystal-Clear 4K Rural Vietnam Painting */}
      <div
        className="pointer-events-none absolute inset-[-12px] z-0 bg-cover bg-center transition-transform duration-300 ease-out will-change-transform"
        style={{
          backgroundImage: "url('/travel/vietnam-countryside.jpg')",
          transform: `translate3d(${-mouseOffset.x * 0.5}px, ${-mouseOffset.y * 0.5}px, 0)`,
        }}
      />

      {/* Subtle Natural Vignette for Depth (Preserves tack-sharp brightness and contrast) */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />

      {/* 60 FPS Canvas: Anatomical Flying White Storks (Cánh Cò Trắng), Sunbeam Motes & Water Glints */}
      <CountrysideCanvas
        parallaxX={mouseOffset.x}
        parallaxY={mouseOffset.y}
      />

      {/* Minimal Icon Controls (Zero Visible Text Words) */}
      <div className="absolute top-5 left-5 z-30 flex items-center gap-3">
        <Link
          href="/"
          onClick={(e) => e.stopPropagation()}
          className="h-10 w-10 rounded-full bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/25 hover:border-white/60 text-white/90 hover:text-white transition-all flex items-center justify-center shadow-xl cursor-pointer hover:scale-105"
          aria-label="Quay lại ProfileForge"
          title="Quay lại"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </Link>
      </div>

      <div className="absolute top-5 right-5 z-30 flex items-center gap-3">
        <button
          type="button"
          onClick={toggleAudio}
          className={`h-10 w-10 rounded-full backdrop-blur-md border transition-all flex items-center justify-center shadow-xl cursor-pointer hover:scale-105 ${
            audioEnabled
              ? "bg-amber-400 text-stone-950 border-amber-300 shadow-amber-400/20"
              : "bg-black/40 hover:bg-black/75 border-white/25 hover:border-white/60 text-white/90 hover:text-white"
          }`}
          aria-label="Bật tắt âm thanh đồng quê"
          title="Bật/Tắt âm thanh đồng quê"
        >
          {audioEnabled ? (
            <Volume2 className="h-4.5 w-4.5" />
          ) : (
            <VolumeX className="h-4.5 w-4.5" />
          )}
        </button>
      </div>
    </div>
  );
}
