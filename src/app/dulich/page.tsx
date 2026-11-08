"use client";

import * as React from "react";
import Link from "next/link";
import { CountrysideCanvas } from "@/components/travel/countryside-canvas";
import { ExperienceBento } from "@/components/travel/experience-bento";
import { pastoralAudio } from "@/lib/audio/pastoral-synthesizer";
import {
  Volume2,
  VolumeX,
  Compass,
  ArrowLeft,
  MapPin,
  Sparkles,
  Sun,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  ChevronDown,
  ShieldCheck,
  Calendar,
  CloudSun,
} from "lucide-react";

type LightingMood = "golden-dawn" | "emerald-mist" | "amber-sunset";

interface MoodConfig {
  id: LightingMood;
  name: string;
  badge: string;
  overlayClass: string;
  filterStyle: string;
  ambientNote: string;
}

const LIGHTING_MOODS: MoodConfig[] = [
  {
    id: "golden-dawn",
    name: "Bình Minh Hoàng Kim",
    badge: "05:45 AM · NẮNG SỚM",
    overlayClass: "from-[#080d0a]/80 via-amber-950/20 to-transparent",
    filterStyle: "contrast(1.08) saturate(1.25) brightness(1.02)",
    ambientNote: "Nắng mai ấm áp rọi xiên, đồng lúa chín ánh vàng rực rỡ",
  },
  {
    id: "emerald-mist",
    name: "Non Nước Lam Ngọc",
    badge: "07:30 AM · SƯƠNG NÚI",
    overlayClass: "from-[#04100c]/85 via-emerald-950/25 to-transparent",
    filterStyle: "contrast(1.05) saturate(1.15) hue-rotate(-8deg)",
    ambientNote: "Sương mai bồng bềnh vòm đá vôi, mặt sông xanh ngọc bích",
  },
  {
    id: "amber-sunset",
    name: "Hoàng Hôn Đồng Chiêm",
    badge: "17:30 PM · RÁC VÀNG",
    overlayClass: "from-[#140804]/85 via-orange-950/30 to-transparent",
    filterStyle: "contrast(1.12) saturate(1.35) sepia(0.12)",
    ambientNote: "Bóng núi ngả dài, ráng chiều đỏ son phủ bóng dòng Ngô Đồng",
  },
];

export default function DuLichPage() {
  const [activeMood, setActiveMood] = React.useState<LightingMood>("golden-dawn");
  const [audioEnabled, setAudioEnabled] = React.useState(false);
  const [zenMode, setZenMode] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // 2.5D Mouse Parallax Coordinates (Smooth Lerping)
  const [mouseOffset, setMouseOffset] = React.useState({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zenMode) return;
    const { innerWidth, innerHeight } = window;
    const normX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    const normY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    setMouseOffset({ x: normX * 18, y: normY * 12 });
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const currentMood = LIGHTING_MOODS.find((m) => m.id === activeMood) || LIGHTING_MOODS[0];

  const scrollToBento = () => {
    const el = document.getElementById("kham-pha-di-san");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-[#080d0a] text-[#f8fafc] overflow-x-hidden selection:bg-amber-400/30 selection:text-amber-200"
    >
      {/* ============================================================ */}
      {/* 1. VISUAL MASTERPIECE HERO STAGE (100vh IMMERSIVE CANVAS)     */}
      {/* ============================================================ */}
      <section className="relative h-screen w-full flex flex-col justify-between overflow-hidden select-none">
        {/* 2.5D Panoramic Artwork Background */}
        <div
          className="pointer-events-none absolute inset-[-20px] z-0 bg-cover bg-center transition-all duration-700 ease-out will-change-transform"
          style={{
            backgroundImage: "url('/travel/vietnam-countryside.jpg')",
            filter: currentMood.filterStyle,
            transform: `translate3d(${-mouseOffset.x * 0.55}px, ${-mouseOffset.y * 0.55}px, 0)`,
          }}
        />

        {/* Dynamic Atmospheric Scrim Overlay (Guarantees WCAG AAA contrast without muddying colors) */}
        <div
          className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-t ${currentMood.overlayClass} transition-all duration-700`}
        />
        <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#080d0a]/90 via-[#080d0a]/35 to-transparent" />

        {/* 60 FPS HTML5 Canvas: Storks, Flowing River Currents, Jumping Fish, Sunlight Motes */}
        <CountrysideCanvas
          parallaxX={mouseOffset.x}
          parallaxY={mouseOffset.y}
        />

        {/* Cultural Heritage Coordinates (Vertical Edge Stamps) */}
        <div
          className={`hidden 2xl:flex fixed left-4 top-1/2 -translate-y-1/2 vertical-stamp text-xs font-mono tracking-widest text-zinc-300/80 uppercase pointer-events-none z-30 transition-opacity duration-300 ${
            zenMode ? "opacity-0" : "opacity-100"
          }`}
        >
          [// DI_SAN_THE_GIOI // TRÀNG_AN // VÙNG_LÕI: 4,200_HA]
        </div>
        <div
          className={`hidden 2xl:flex fixed right-4 top-1/2 -translate-y-1/2 vertical-stamp text-xs font-mono tracking-widest text-zinc-300/80 uppercase pointer-events-none z-30 transition-opacity duration-300 ${
            zenMode ? "opacity-0" : "opacity-100"
          }`}
        >
          [// QUẦN_THỂ_DANH_THẮNG // NINH_BÌNH // 20°13&apos;N · 105°56&apos;E]
        </div>

        {/* Top Header Bar */}
        <header
          className={`relative z-30 w-full border-b border-white/10 px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-black/40 transition-all duration-300 ${
            zenMode ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                title="Quay lại ProfileForge Studio"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">RETURN</span>
              </Link>

              <div className="h-4 w-[1px] bg-white/20 mx-1 hidden sm:block" />

              <div className="flex items-center gap-2">
                <span className="font-serif font-bold tracking-widest text-lg uppercase text-white drop-shadow-md">
                  VIỆT NAM
                </span>
                <span className="text-xs font-mono text-amber-300 px-2 py-0.5 rounded border border-amber-400/40 bg-amber-400/10">
                  HERITAGE
                </span>
              </div>
            </div>

            {/* Center: Lighting Mood Selector (Chuyển Sắc Thái Ánh Sáng) */}
            <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md shadow-inner text-xs font-mono">
              {LIGHTING_MOODS.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setActiveMood(mood.id)}
                  className={`h-7 px-3 rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeMood === mood.id
                      ? "bg-amber-400 text-zinc-950 font-bold shadow-md"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                  title={mood.ambientNote}
                >
                  <Sun className="h-3 w-3" />
                  <span>{mood.name}</span>
                </button>
              ))}
            </div>

            {/* Right: Actions (Web Audio, Zen Mode, Fullscreen) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Procedural Web Audio API Button */}
              <button
                type="button"
                onClick={toggleAudio}
                className={`h-8 px-3 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
                  audioEnabled
                    ? "bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                    : "bg-black/40 border-white/15 text-zinc-300 hover:text-white hover:border-white/30"
                }`}
                title="Bật/Tắt âm thanh đồng quê (Web Audio API thủ tục)"
              >
                {audioEnabled ? (
                  <>
                    <Volume2 className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                    <span className="hidden sm:inline">TIẾNG ĐỒNG NỘI: BẬT</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="hidden sm:inline">BẬT ÂM THANH 🌾</span>
                  </>
                )}
              </button>

              {/* Zen / Immersion Mode Toggle */}
              <button
                type="button"
                onClick={() => setZenMode(!zenMode)}
                className="h-8 w-8 rounded-full bg-black/40 border border-white/15 text-zinc-300 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors cursor-pointer"
                title={zenMode ? "Hiện thanh điều hướng" : "Chế độ ngắm tranh toàn màn hình"}
              >
                {zenMode ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
              </button>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="hidden sm:flex h-8 w-8 rounded-full bg-black/40 border border-white/15 text-zinc-300 hover:text-white hover:border-white/30 items-center justify-center transition-colors cursor-pointer"
                title="Toàn màn hình"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-3.5 w-3.5" />
                ) : (
                  <Maximize2 className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Central Hero Stage (Left-Weighted, Leaving Center & Right Canvas Open for Panorama) */}
        <main
          className={`relative z-20 flex-1 flex flex-col justify-center px-4 sm:px-12 max-w-3xl transition-all duration-500 ${
            zenMode ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          {/* Authentic Heritage GPS & Telemetry Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-black/60 backdrop-blur-md text-xs font-mono text-amber-300 w-fit mb-6 shadow-xl">
            <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold tracking-wide">TAM CỐC · NINH BÌNH</span>
            <span className="text-zinc-500">|</span>
            <span className="text-zinc-300 text-[11px]">20°13&apos;N · 105°56&apos;E</span>
          </div>

          {/* Epic Editorial Headline (Playfair Display, High Authority, 0% Italic Slop) */}
          <h1 className="font-serif tracking-tight text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] drop-shadow-2xl">
            THE SOUL OF
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 drop-shadow">
              VIETNAM
            </span>
          </h1>

          {/* Poetic & Authentic Editorial Tagline */}
          <p className="mt-6 text-lg sm:text-xl text-amber-100/90 font-serif leading-relaxed drop-shadow">
            Nơi vẻ đẹp bình dị chạm đến chiều sâu tâm hồn
          </p>

          <p className="mt-3 max-w-xl text-sm sm:text-base text-zinc-200 font-sans leading-relaxed [text-wrap:pretty] drop-shadow">
            Dòng sông Ngô Đồng uốn lượn hình chữ S qua lòng thung lũng lúa chín vàng, nép mình dưới bóng những vách núi đá vôi karst sừng sững hàng triệu năm.
          </p>

          {/* Primary Action Button (Tactile Luxury Pill CTA) */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={scrollToBento}
              className="h-12 px-8 rounded-full bg-amber-400 text-zinc-950 font-serif font-bold text-xs uppercase tracking-widest hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all shadow-[0_0_24px_rgba(251,191,36,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <Compass className="h-4 w-4" />
              <span>KHÁM PHÁ HÀNH TRÌNH</span>
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 px-3 py-2 rounded-lg bg-black/40 border border-white/10 backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>UNESCO WORLD HERITAGE SITE</span>
            </div>
          </div>
        </main>

        {/* Focused Single-Destination Ribbon (Sát Đáy Màn Hình - Không Rườm Rà Nhiều Địa Danh) */}
        <footer
          className={`relative z-30 w-full border-t border-white/10 bg-black/50 backdrop-blur-xl px-4 sm:px-8 py-3.5 transition-all duration-300 ${
            zenMode ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            {/* Left: Destination Focus */}
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 rounded-full bg-amber-400 text-zinc-950 items-center justify-center font-bold text-xs shadow-md">
                01
              </div>
              <div>
                <span className="font-bold text-white text-sm">TAM CỐC – BÍCH ĐỘNG</span>
                <span className="text-zinc-400 text-xs ml-2 hidden md:inline">
                  (Dòng Ngô Đồng · Ba Hang Kỳ Vĩ)
                </span>
              </div>
            </div>

            {/* Center: Live Season / Climate Telemetry */}
            <div className="flex items-center gap-4 text-zinc-300 text-xs">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-amber-400" />
                <span>Mùa Đẹp Nhất: Tháng 5 – Tháng 6</span>
              </div>
              <span className="text-zinc-600 hidden md:inline">·</span>
              <div className="hidden md:flex items-center gap-1.5">
                <CloudSun className="h-3.5 w-3.5 text-emerald-400" />
                <span>28°C · Nắng Trong · Gió Nhẹ</span>
              </div>
            </div>

            {/* Right: Scroll Down Hint */}
            <button
              type="button"
              onClick={scrollToBento}
              className="flex items-center gap-1 text-amber-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>XEM TRẢI NGHIỆM</span>
              <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
            </button>
          </div>
        </footer>
      </section>

      {/* ============================================================ */}
      {/* 2. CURATED EXPERIENCES BENTO GRID (ANTI-AI SLOP)              */}
      {/* ============================================================ */}
      <div id="kham-pha-di-san" className="relative z-20 bg-gradient-to-b from-[#080d0a] to-[#040806] pt-12">
        <ExperienceBento />

        {/* Sustainable Heritage Seal & Footer */}
        <footer className="w-full border-t border-white/10 bg-black/60 backdrop-blur-xl px-4 sm:px-8 py-10 mt-16 text-center text-xs font-mono text-zinc-400">
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-amber-300 font-serif font-bold text-sm tracking-widest uppercase">
              <span>VIỆT NAM · NƠI DI SẢN CHẠM ĐẾN TÂM HỒN</span>
            </div>
            <p className="text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Trang thông tin di sản phi lợi nhuận tôn vinh thiên nhiên và văn hóa truyền thống Việt Nam. Cam kết 100% du lịch bền vững và bảo vệ sinh thái vùng lõi UNESCO.
            </p>
            <div className="pt-4 flex items-center justify-center gap-4 text-zinc-500 text-[11px]">
              <Link href="/" className="hover:text-amber-300 transition-colors">
                ← Về ProfileForge Studio
              </Link>
              <span>·</span>
              <Link href="/builder" className="hover:text-amber-300 transition-colors">
                Trình Tạo Profile GitHub
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

