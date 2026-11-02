"use client";

import * as React from "react";
import { AlertTriangle, Compass, Wind } from "lucide-react";

interface StormScrubberProps {
  severity: 1 | 2 | 3;
  onSelectSeverity: (level: 1 | 2 | 3) => void;
  activeSector: string;
  onSelectSector: (sector: string) => void;
}

const SECTORS = [
  { id: "COMM", name: "COMMUNICATIONS ARRAY", status: "ONLINE", metric: "384 GHz" },
  { id: "CRYO", name: "CRYO-CORE SAMPLING", status: "DRILLING", metric: "4,200m" },
  { id: "REACT", name: "FUSION THERMAL CORE", status: "OPTIMAL", metric: "98.4%" },
  { id: "OBS", name: "DEEP SPACE OBSERVATORY", status: "LOCKED", metric: "14.2 AU" },
];

export function StormScrubber({
  severity,
  onSelectSeverity,
  activeSector,
  onSelectSector,
}: StormScrubberProps) {
  return (
    <footer className="relative z-30 w-full border-t border-white/[0.12] bg-[#05070c]/90 backdrop-blur-md px-4 sm:px-8 py-3 select-none">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4 font-mono text-xs">
        {/* Left: Storm Severity Controller (Bespoke Scrubber echoing the Villa month strip) */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-1.5 text-zinc-300 font-semibold tracking-wider text-xs uppercase">
            <Wind className="h-3.5 w-3.5 text-[#ff773d]" />
            <span>BLIZZARD LEVEL:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { level: 1 as const, name: "01 · MILD DRIFT", temp: "-42°C", wind: "18 KTS" },
              { level: 2 as const, name: "02 · SEVERE GALE", temp: "-68°C", wind: "54 KTS" },
              { level: 3 as const, name: "03 · CAT-5 WHITE-OUT", temp: "-94°C", wind: "128 KTS" },
            ].map((item) => {
              const isActive = severity === item.level;
              return (
                <button
                  key={item.level}
                  type="button"
                  onClick={() => onSelectSeverity(item.level)}
                  className={`px-3 py-1.5 rounded transition-colors text-xs uppercase tracking-wider flex items-center gap-2 border ${
                    isActive
                      ? "border-[#ff5f1f] bg-[#ff5f1f] text-zinc-950 font-bold"
                      : "border-white/15 text-zinc-300 hover:border-white/40 hover:text-white bg-white/[0.04]"
                  }`}
                >
                  <span>{item.name}</span>
                  <span
                    className={`text-xs pl-1.5 hidden sm:inline border-l ${
                      isActive ? "border-zinc-900/40 text-zinc-900" : "border-white/20 text-zinc-400"
                    }`}
                  >
                    {item.temp}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Sector Telemetry Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
          <span className="text-zinc-400 text-xs uppercase mr-1 hidden xl:inline">
            OUTPOST SECTOR:
          </span>
          {SECTORS.map((s) => {
            const isActive = activeSector === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectSector(s.id)}
                className={`px-2.5 py-1.5 rounded border text-xs tracking-wider transition-colors flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? "border-emerald-400 bg-emerald-950/40 text-emerald-300 font-semibold"
                    : "border-white/15 text-zinc-300 hover:border-white/30 hover:text-white bg-black/40"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  {s.id}: {s.metric}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
