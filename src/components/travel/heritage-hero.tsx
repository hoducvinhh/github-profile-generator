"use client";

import * as React from "react";
import { CountrysideCanvas } from "./countryside-canvas";
import { Compass, MapPin, ShieldCheck, ChevronDown } from "lucide-react";

export function HeritageHero() {
  const [mouseOffset, setMouseOffset] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;
    const normX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
    const normY = (e.clientY - innerHeight / 2) / (innerHeight / 2);
    setMouseOffset({ x: normX * 16, y: normY * 10 });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative min-h-[92vh] w-full flex flex-col justify-between overflow-hidden select-none bg-[#080d0a]"
    >
      {/* 1. Cinematic Photographic Masterpiece Background */}
      <div
        className="pointer-events-none absolute inset-[-16px] z-0 bg-cover bg-center transition-transform duration-500 ease-out will-change-transform"
        style={{
          backgroundImage: "url('/travel/vietnam-countryside.jpg')",
          transform: `translate3d(${-mouseOffset.x * 0.45}px, ${-mouseOffset.y * 0.45}px, 0)`,
        }}
      />

      {/* 2. Carefully Calibrated Scrim Overlays (WCAG AAA readability without muddying art) */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-t from-[#080d0a] via-[#080d0a]/30 to-[#080d0a]/60" />
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#080d0a]/90 via-[#080d0a]/40 to-transparent" />

      {/* 3. Lightweight 60 FPS Micro-Animation Canvas (Storks, Spline River, Sun Motes) */}
      <CountrysideCanvas
        parallaxX={mouseOffset.x}
        parallaxY={mouseOffset.y}
      />

      {/* 4. Vertical Heritage Edge Stamps */}
      <div className="hidden 2xl:flex fixed left-4 top-1/2 -translate-y-1/2 vertical-stamp text-xs font-mono tracking-widest text-zinc-400 uppercase pointer-events-none z-30">
        [// DI_SẢN_THẾ_GIỚI // TRÀNG_AN // VÙNG_LÕI: 6,226_HA]
      </div>
      <div className="hidden 2xl:flex fixed right-4 top-1/2 -translate-y-1/2 vertical-stamp text-xs font-mono tracking-widest text-zinc-400 uppercase pointer-events-none z-30">
        [// QUẦN_THỂ_DANH_THẮNG // NINH_BÌNH // 20°15&apos;N · 105°58&apos;E]
      </div>

      {/* 5. Center-Left Editorial Stage */}
      <div className="relative z-20 flex-1 flex flex-col justify-center px-4 sm:px-12 max-w-4xl py-16">
        {/* Geographic Coordinates & Representative Inscription Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-amber-400/40 bg-black/60 backdrop-blur-md text-xs font-mono text-amber-300 w-fit mb-6 shadow-xl">
          <MapPin className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold tracking-wide">QUẦN THỂ DANH THẮNG TRÀNG AN</span>
          <span className="text-zinc-500">·</span>
          <span className="text-zinc-300 text-[11px]">20°15&apos;N · 105°58&apos;E</span>
        </div>

        {/* Headline Masterpiece (Playfair Display, 0% Italic Slop) */}
        <h1 className="font-serif tracking-tight text-5xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] drop-shadow-2xl">
          THE SOUL OF
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 drop-shadow">
            VIETNAM
          </span>
        </h1>

        {/* Poetic Supporting Copy */}
        <p className="mt-6 text-xl sm:text-2xl text-amber-100 font-serif leading-relaxed drop-shadow">
          Nơi vẻ đẹp bình dị chạm đến tâm hồn.
        </p>

        <p className="mt-3 max-w-xl text-sm sm:text-base text-zinc-200 font-sans leading-relaxed [text-wrap:pretty] drop-shadow">
          Hành trình vượt thời gian qua thung lũng đá vôi karst 250 triệu năm, nơi dòng sông Ngô Đồng ôm lấy dải lúa chín vàng và nếp sống mộc mạc ngàn đời của vùng đất cố đô.
        </p>

        {/* Call to Action */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#hanh-trinh"
            className="h-12 px-8 rounded-full bg-amber-400 text-zinc-950 font-serif font-bold text-xs uppercase tracking-widest hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all shadow-[0_0_24px_rgba(251,191,36,0.35)] flex items-center gap-2 cursor-pointer"
          >
            <Compass className="h-4 w-4" />
            <span>KHÁM PHÁ HÀNH TRÌNH</span>
          </a>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-300 px-3.5 py-2.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>DI SẢN HỖN HỢP ĐẦU TIÊN ĐÔNG NAM Á</span>
          </div>
        </div>
      </div>

      {/* 6. Subtle Scroll Cue */}
      <div className="relative z-20 w-full px-4 sm:px-12 pb-6 flex items-center justify-between text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          <span>TAM CỐC – BÍCH ĐỘNG · TRÀNG AN</span>
        </div>

        <a
          href="#gioi-thieu"
          className="flex items-center gap-1.5 text-zinc-300 hover:text-amber-300 transition-colors"
        >
          <span>BẮT ĐẦU CÂU CHUYỆN</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
