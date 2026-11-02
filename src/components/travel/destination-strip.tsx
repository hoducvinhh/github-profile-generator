"use client";

import * as React from "react";
import { Compass, Sparkles } from "lucide-react";

export interface Destination {
  id: string;
  number: string;
  name: string;
  region: string;
  tagline: string;
  coordinates: string;
}

export const DESTINATIONS: Destination[] = [
  {
    id: "tam-coc",
    number: "01",
    name: "TAM CỐC",
    region: "NINH BÌNH",
    tagline: "Dòng Ngô Đồng uốn lượn qua ba hang kỳ vĩ giữa mùa lúa chín.",
    coordinates: "20°13'N · 105°56'E",
  },
  {
    id: "trang-an",
    number: "02",
    name: "TRÀNG AN",
    region: "NINH BÌNH",
    tagline: "Quần thể di sản thế giới nơi non nước hữu tình giao hòa mây trời.",
    coordinates: "20°15'N · 105°54'E",
  },
  {
    id: "bac-son",
    number: "03",
    name: "BẮC SƠN",
    region: "LẠNG SƠN",
    tagline: "Thung lũng lúa ngút ngàn đan sắc màu trù phú dưới chân núi đá vôi.",
    coordinates: "21°54'N · 106°19'E",
  },
  {
    id: "mai-chau",
    number: "04",
    name: "MAI CHÂU",
    region: "HÒA BÌNH",
    tagline: "Bản làng người Thái thanh bình với mái nhà sàn nép bên nương lúa.",
    coordinates: "20°40'N · 105°04'E",
  },
];

interface DestinationStripProps {
  activeId: string;
  onSelect: (dest: Destination) => void;
}

export function DestinationStrip({
  activeId,
  onSelect,
}: DestinationStripProps) {
  return (
    <footer className="relative z-30 w-full border-t border-white/15 bg-black/40 backdrop-blur-md px-4 sm:px-8 py-3 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
        {/* Left: Section Indicator */}
        <div className="flex items-center gap-2 text-zinc-300 uppercase tracking-widest text-xs">
          <Compass className="h-3.5 w-3.5 text-amber-300" />
          <span>DANH THẮNG MIỀN BẮC:</span>
        </div>

        {/* Center: Destination Scrubber (Villa Castagneto reference pattern) */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5">
          {DESTINATIONS.map((dest) => {
            const isActive = activeId === dest.id;
            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => onSelect(dest)}
                className={`px-3.5 py-1.5 rounded-full transition-all text-xs tracking-wider shrink-0 flex items-center gap-2 border cursor-pointer ${
                  isActive
                    ? "border-amber-400 bg-amber-400 text-stone-950 font-bold shadow-lg"
                    : "border-white/20 text-zinc-200 hover:border-white/50 hover:text-white bg-black/40"
                }`}
              >
                <span
                  className={
                    isActive
                      ? "text-stone-900 text-xs font-mono"
                      : "text-amber-300/80 text-xs font-mono"
                  }
                >
                  {dest.number}
                </span>
                <span className="font-sans font-medium uppercase text-xs">
                  {dest.name}
                </span>
                <span
                  className={`text-xs pl-1.5 hidden lg:inline border-l ${
                    isActive ? "border-stone-900/30 text-stone-900" : "border-white/25 text-zinc-400"
                  }`}
                >
                  {dest.region}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Stamp */}
        <div className="text-xs font-mono text-zinc-300 hidden xl:flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-amber-300" />
          <span>DI SẢN THIÊN NHIÊN VIỆT NAM</span>
        </div>
      </div>
    </footer>
  );
}
