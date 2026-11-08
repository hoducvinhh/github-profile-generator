"use client";

import * as React from "react";
import { TravelHeader } from "@/components/travel/travel-header";
import { HeritageHero } from "@/components/travel/heritage-hero";
import { HeritageIntroduction } from "@/components/travel/heritage-introduction";
import { HeritagePerspectives } from "@/components/travel/heritage-perspectives";
import { ExperienceBento } from "@/components/travel/experience-bento";
import { HeritageFacts } from "@/components/travel/heritage-facts";
import { SeasonPlanner } from "@/components/travel/season-planner";
import { JourneyCTA } from "@/components/travel/journey-cta";
import { TravelFooter } from "@/components/travel/travel-footer";

export default function DuLichPage() {
  return (
    <div className="relative min-h-screen w-full bg-[#080d0a] text-[#f8fafc] overflow-x-hidden selection:bg-amber-400/30 selection:text-amber-200">
      {/* Section 1 — Navigation */}
      <TravelHeader />

      {/* Section 2 — Cinematic Hero & Lightweight Canvas */}
      <HeritageHero />

      {/* Section 3 — Heritage Introduction (Trang An UNESCO) */}
      <HeritageIntroduction />

      {/* Section 4 — Three Perspectives (The River · The Karst · The Heritage) */}
      <HeritagePerspectives />

      {/* Section 5 — Curated Experiences (Asymmetric Bento Grid) */}
      <ExperienceBento />

      {/* Section 6 — Verified Heritage Facts (Authoritative Sources) */}
      <HeritageFacts />

      {/* Section 7 — The Rhythm of Seasons (Interactive Seasonal Explorer) */}
      <SeasonPlanner />

      {/* Section 8 — Plan Your Journey (Interactive Itinerary Planner) */}
      <JourneyCTA />

      {/* Section 9 — Heritage Footer & Preservation Seal */}
      <TravelFooter />
    </div>
  );
}
