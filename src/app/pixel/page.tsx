"use client";

import * as React from "react";
import {
  PixelCanvas,
  PixelResolution,
  PaletteType,
} from "@/components/pixel/pixel-canvas";
import { PixelControls } from "@/components/pixel/pixel-controls";

export default function PixelPage() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const [resolution, setResolution] = React.useState<PixelResolution>("320x180");
  const [palette, setPalette] = React.useState<PaletteType>("snes");
  const [dithering, setDithering] = React.useState(true);
  const [crtEffect, setCrtEffect] = React.useState(false);
  const [pixelGrid, setPixelGrid] = React.useState(false);

  const [animateWater, setAnimateWater] = React.useState(true);
  const [animateStorks, setAnimateStorks] = React.useState(true);
  const [animateSmoke, setAnimateSmoke] = React.useState(true);
  const [animateGodRays, setAnimateGodRays] = React.useState(true);
  const [animateKite, setAnimateKite] = React.useState(true);

  const [fps, setFps] = React.useState(60);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black select-none">
      {/* 60 FPS Algorithmic Pixel Art Canvas */}
      <PixelCanvas
        canvasRef={canvasRef}
        resolution={resolution}
        palette={palette}
        dithering={dithering}
        crtEffect={crtEffect}
        pixelGrid={pixelGrid}
        animateWater={animateWater}
        animateStorks={animateStorks}
        animateSmoke={animateSmoke}
        animateGodRays={animateGodRays}
        animateKite={animateKite}
        onFpsUpdate={setFps}
      />

      {/* Floating Retro Algorithmic Control Deck */}
      <PixelControls
        canvasRef={canvasRef}
        resolution={resolution}
        setResolution={setResolution}
        palette={palette}
        setPalette={setPalette}
        dithering={dithering}
        setDithering={setDithering}
        crtEffect={crtEffect}
        setCrtEffect={setCrtEffect}
        pixelGrid={pixelGrid}
        setPixelGrid={setPixelGrid}
        animateWater={animateWater}
        setAnimateWater={setAnimateWater}
        animateStorks={animateStorks}
        setAnimateStorks={setAnimateStorks}
        animateSmoke={animateSmoke}
        setAnimateSmoke={setAnimateSmoke}
        animateGodRays={animateGodRays}
        setAnimateGodRays={setAnimateGodRays}
        fps={fps}
      />
    </div>
  );
}
