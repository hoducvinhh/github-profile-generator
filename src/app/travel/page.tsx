"use client";

import * as React from "react";
import Link from "next/link";
import { CountrysideCanvas } from "@/components/travel/countryside-canvas";
import {
  DestinationStrip,
  DESTINATIONS,
  Destination,
} from "@/components/travel/destination-strip";
import { pastoralAudio } from "@/lib/audio/pastoral-synthesizer";
import {
  Volume2,
  VolumeX,
  MapPin,
  Compass,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function TravelPage() {
  const [activeDest, setActiveDest] = React.useState<Destination>(DESTINATIONS[0]);
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

  const toggleAudio = () => {
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
      className="relative h-screen w-full flex flex-col justify-between overflow-hidden bg-[#0c1410] text-[#f8fafc] select-none"
    >
      {/* 2.5D Background Artwork: Ultra-Sharp Rural Vietnam Landscape */}
      <div
        className="pointer-events-none absolute inset-[-14px] z-0 bg-cover bg-center transition-transform duration-300 ease-out will-change-transform"
        style={{
          backgroundImage: "url('/travel/vietnam-countryside.jpg')",
          transform: `translate3d(${-mouseOffset.x * 0.5}px, ${-mouseOffset.y * 0.5}px, 0)`,
        }}
      />

      {/* Atmospheric Sunrise Contrast Overlay (Guarantees WCAG AA readability without darkening landscape) */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-[#080d0a]/90 via-transparent to-[#080d0a]/50" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#080d0a]/80 via-transparent to-transparent" />

      {/* 60 FPS Canvas: Micro-Animations (Storks, Rowing Boat, Jumping Fish, Flying Kite, Sunbeams) */}
      <CountrysideCanvas
        parallaxX={mouseOffset.x}
        parallaxY={mouseOffset.y}
      />

      {/* Edge Stamps - Cultural Heritage Coordinates (1:1 with Villa Castagneto reference) */}
      <div className="hidden 2xl:flex fixed left-3 top-1/2 -translate-y-1/2 vertical-stamp text-xs font-mono tracking-widest text-zinc-300/80 uppercase pointer-events-none z-30">
        [// HERITAGE_ZONE // RED_RIVER_DELTA // BIO_RESERVE: 20°15&apos;N]
      </div>
      <div className="hidden 2xl:flex fixed right-3 top-1/2 -translate-y-1/2 vertical-stamp text-xs font-mono tracking-widest text-zinc-300/80 uppercase pointer-events-none z-30">
        [// THE_SOUL_OF_VIETNAM // TIMELESS_CHARM // UNESCO_HERITAGE]
      </div>

      {/* Transparent Minimal Navigation Bar */}
      <header className="relative z-30 w-full border-b border-white/15 px-4 sm:px-8 py-3.5 backdrop-blur-md bg-black/35">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Brand / Logo */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
              title="Quay lại ProfileForge Studio"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">RETURN</span>
            </Link>

            <div className="h-3.5 w-[1px] bg-white/20 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="font-serif font-bold tracking-widest text-base uppercase text-white drop-shadow">
                VIỆT NAM
              </span>
              <span className="text-xs font-mono text-amber-300 px-2 py-0.5 rounded border border-amber-400/40 bg-black/40">
                HERITAGE
              </span>
            </div>
          </div>

          {/* Center: Editorial Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-sans tracking-widest uppercase text-zinc-200">
            <span className="text-amber-300 font-semibold cursor-pointer">
              Discover
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Destinations
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              Culture
            </span>
            <span className="hover:text-white transition-colors cursor-pointer">
              About
            </span>
          </nav>

          {/* Right: Soundscape Audio Toggle & Action */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleAudio}
              className={`h-8 px-3 rounded-full text-xs font-mono font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                audioEnabled
                  ? "border-amber-400 bg-amber-400 text-stone-950 font-bold shadow-md"
                  : "border-white/20 bg-black/50 text-zinc-200 hover:text-white hover:border-white/50"
              }`}
              title="Bật/Tắt âm thanh đồng quê và tiếng chim hót"
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>TIẾNG ĐỒNG QUÊ: BẬT</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5" />
                  <span>ÂM THANH ĐỒNG QUÊ 🌾</span>
                </>
              )}
            </button>

            <Link href="/builder">
              <button
                type="button"
                className="h-8 px-3.5 rounded-full text-xs font-mono font-semibold bg-emerald-500 text-stone-950 hover:bg-emerald-400 transition-colors shadow-md cursor-pointer"
              >
                OPEN FORGE ⚡
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Cinematic Hero Stage (Left-Weighted, Pure & Elegant) */}
      <main className="relative z-20 flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 max-w-5xl w-full">
        <div className="max-w-2xl text-left">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-black/40 text-xs font-mono text-amber-200 mb-4 backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5 text-amber-400" />
            <span className="tracking-widest uppercase">
              {activeDest.name} · {activeDest.region}
            </span>
            <span className="text-zinc-400">·</span>
            <span className="text-zinc-300 text-xs font-mono">
              {activeDest.coordinates}
            </span>
          </div>

          {/* Master Headline: The Soul of Vietnam (Roman Serif, Upright & Timeless) */}
          <h1 className="font-serif tracking-wide text-5xl sm:text-7xl lg:text-8xl leading-[0.95] text-white drop-shadow-2xl uppercase not-italic">
            THE SOUL OF
            <br />
            <span className="text-amber-300 not-italic">
              VIETNAM
            </span>
          </h1>

          {/* Emotional Tagline */}
          <p className="mt-4 text-xl sm:text-2xl font-serif text-amber-100 font-light leading-snug drop-shadow-md">
            Nơi vẻ đẹp bình dị chạm đến tâm hồn
          </p>

          {/* Poetic Narrative Description */}
          <p className="mt-3 max-w-xl text-xs sm:text-sm text-zinc-200 font-sans leading-relaxed [text-wrap:pretty] drop-shadow">
            {activeDest.tagline} Khung cảnh đồng lúa bát ngát, rặng tre xanh đung đưa
            theo ngọn gió và những cánh cò trắng chao liệng giữa sắc nắng ban mai.
          </p>

          {/* Single High-End CTA Pill Button */}
          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={() => alert(`Khám phá hành trình ${activeDest.name} - ${activeDest.region}`)}
              className="h-11 px-7 rounded-full bg-amber-400 text-stone-950 font-serif font-bold text-xs uppercase tracking-widest hover:bg-amber-300 transition-all shadow-xl hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <span>KHÁM PHÁ HÀNH TRÌNH</span>
              <Compass className="h-4 w-4" />
            </button>

            <span className="text-xs font-mono text-zinc-300/80 hidden sm:inline">
              UNESCO WORLD HERITAGE SITE
            </span>
          </div>
        </div>
      </main>

      {/* Bottom Destination Strip (Villa Castagneto Reference Scrubber) */}
      <DestinationStrip
        activeId={activeDest.id}
        onSelect={(dest) => setActiveDest(dest)}
      />
    </div>
  );
}
