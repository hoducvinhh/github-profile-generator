"use client";

import * as React from "react";
import {
  KoiCanvas,
  PixelScaleMode,
  PondTheme,
} from "@/components/fish/koi-canvas";
import { KoiControls } from "@/components/fish/koi-controls";

export default function FishPage() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Pixel scale: "medium" (8px) matches the user's requirement: "ô vuông vừa phải không nhỏ quá nhé"
  const [pixelScale, setPixelScale] = React.useState<PixelScaleMode>("medium");
  const [theme, setTheme] = React.useState<PondTheme>("midnight");
  const [swimSpeed, setSwimSpeed] = React.useState(1.0);

  const [showLilypads, setShowLilypads] = React.useState(true);
  const [showPetals, setShowPetals] = React.useState(true);
  const [showCaustics, setShowCaustics] = React.useState(true);
  const [showRipples, setShowRipples] = React.useState(true);
  const [crtEffect, setCrtEffect] = React.useState(false);
  const [pixelGrid, setPixelGrid] = React.useState(false);

  const [fps, setFps] = React.useState(60);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black select-none">
      {/* 60 FPS Algorithmic Pixel Koi Canvas */}
      <KoiCanvas
        canvasRef={canvasRef}
        pixelScale={pixelScale}
        theme={theme}
        swimSpeed={swimSpeed}
        showLilypads={showLilypads}
        showPetals={showPetals}
        showCaustics={showCaustics}
        showRipples={showRipples}
        crtEffect={crtEffect}
        pixelGrid={pixelGrid}
        onFpsUpdate={setFps}
      />

      {/* Floating Zen Controls & Soundscape Deck */}
      <KoiControls
        canvasRef={canvasRef}
        pixelScale={pixelScale}
        setPixelScale={setPixelScale}
        theme={theme}
        setTheme={setTheme}
        swimSpeed={swimSpeed}
        setSwimSpeed={setSwimSpeed}
        showLilypads={showLilypads}
        setShowLilypads={setShowLilypads}
        showPetals={showPetals}
        setShowPetals={setShowPetals}
        showCaustics={showCaustics}
        setShowCaustics={setShowCaustics}
        showRipples={showRipples}
        setShowRipples={setShowRipples}
        crtEffect={crtEffect}
        setCrtEffect={setCrtEffect}
        pixelGrid={pixelGrid}
        setPixelGrid={setPixelGrid}
        fps={fps}
      />
    </div>
  );
}

