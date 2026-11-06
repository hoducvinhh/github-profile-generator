"use client";

import * as React from "react";
import {
  KoiCanvas,
  PixelScaleMode,
  PondTheme,
} from "@/components/fish/koi-canvas";
import { KoiControls } from "@/components/fish/koi-controls";
import { zenWaterAudio } from "@/lib/audio/zen-water-synthesizer";

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

  // Interactive Feeding & Zen Mode State
  const [interactMode, setInteractMode] = React.useState<"ripple" | "feed">("feed");
  const [feedCount, setFeedCount] = React.useState(0);
  const [zenMode, setZenMode] = React.useState(false);
  const [volume, setVolume] = React.useState(0.75);

  const [fps, setFps] = React.useState(60);

  // Global Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "h":
          setZenMode((prev) => !prev);
          break;
        case "m":
          if (zenWaterAudio) {
            if (zenWaterAudio.getStatus()) {
              zenWaterAudio.stop();
            } else {
              zenWaterAudio.start();
              zenWaterAudio.setVolume(volume);
            }
          }
          break;
        case "f":
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
          break;
        case "1":
          setTheme("midnight");
          break;
        case "2":
          setTheme("emerald");
          break;
        case "3":
          setTheme("sunset");
          break;
        case "4":
          setTheme("gameboy");
          break;
        case " ":
          // Trigger space event on canvas if focused
          e.preventDefault();
          if (canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const clickEvent = new MouseEvent("click", {
              clientX: rect.left + rect.width * 0.5,
              clientY: rect.top + rect.height * 0.5,
              bubbles: true,
            });
            canvasRef.current.dispatchEvent(clickEvent);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [volume]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black select-none font-sans">
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
        interactMode={interactMode}
        onFoodEaten={() => setFeedCount((c) => c + 1)}
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
        interactMode={interactMode}
        setInteractMode={setInteractMode}
        feedCount={feedCount}
        zenMode={zenMode}
        setZenMode={setZenMode}
        volume={volume}
        setVolume={setVolume}
        fps={fps}
      />
    </div>
  );
}
