"use client";

import * as React from "react";

export type PixelResolution = "160x90" | "240x135" | "320x180" | "480x270";
export type PaletteType = "snes" | "sunset" | "gameboy" | "pico8" | "cyberpunk";

export interface PixelCanvasProps {
  resolution: PixelResolution;
  palette: PaletteType;
  dithering: boolean;
  crtEffect: boolean;
  pixelGrid: boolean;
  animateWater: boolean;
  animateStorks: boolean;
  animateSmoke: boolean;
  animateGodRays: boolean;
  animateKite: boolean;
  onFpsUpdate?: (fps: number) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

// 4x4 Bayer Dithering Matrix
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

// Curated 16-bit & Retro Palettes (RGB)
const PALETTES: Record<PaletteType, [number, number, number][]> = {
  snes: [
    [12, 20, 16], [24, 48, 32], [42, 85, 48], [68, 128, 62], [105, 175, 75], [152, 205, 95], [205, 235, 135],
    [18, 38, 52], [32, 68, 85], [48, 110, 115], [75, 158, 145], [120, 200, 180], [180, 235, 215],
    [54, 38, 24], [92, 62, 35], [145, 95, 45], [198, 138, 55], [235, 185, 75], [255, 225, 120], [255, 248, 195],
    [85, 28, 22], [145, 48, 36], [195, 75, 52], [225, 115, 80],
    [32, 38, 48], [62, 72, 88], [110, 125, 145], [165, 180, 200], [220, 230, 242], [255, 255, 255]
  ],
  sunset: [
    [24, 12, 28], [48, 20, 52], [82, 32, 75], [125, 48, 92], [175, 65, 98], [215, 92, 105],
    [58, 42, 26], [105, 72, 38], [162, 108, 48], [215, 150, 60], [248, 195, 85], [255, 235, 145],
    [32, 45, 40], [55, 82, 65], [88, 128, 95], [135, 175, 125],
    [245, 220, 180], [255, 245, 225]
  ],
  gameboy: [
    [15, 56, 15],
    [48, 98, 48],
    [139, 172, 15],
    [155, 188, 15]
  ],
  pico8: [
    [0, 0, 0], [29, 43, 83], [126, 37, 83], [0, 135, 81],
    [171, 82, 54], [95, 87, 79], [194, 195, 199], [255, 241, 232],
    [255, 0, 77], [255, 163, 0], [255, 236, 39], [0, 228, 54],
    [41, 173, 255], [131, 118, 156], [255, 119, 168], [255, 204, 170]
  ],
  cyberpunk: [
    [10, 8, 25], [25, 15, 50], [55, 20, 85], [110, 25, 130], [180, 35, 170], [255, 60, 210],
    [15, 30, 60], [25, 65, 110], [35, 120, 170], [45, 190, 230], [120, 240, 255],
    [255, 230, 80], [255, 255, 255]
  ]
};

interface PixelSmoke {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
}

interface PixelStork {
  x: number;
  y: number;
  vx: number;
  vy: number;
  frame: number;
  flapTimer: number;
  flapSpeed: number;
}

export function PixelCanvas({
  resolution,
  palette,
  dithering,
  crtEffect,
  pixelGrid,
  animateWater,
  animateStorks,
  animateSmoke,
  animateGodRays,
  animateKite,
  onFpsUpdate,
  canvasRef: externalCanvasRef,
}: PixelCanvasProps) {
  const internalCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;

  // Virtual low-res canvas buffer
  const virtualCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const baseImageDataRef = React.useRef<ImageData | null>(null);
  const processedImageDataRef = React.useRef<ImageData | null>(null);

  const [resW, resH] = React.useMemo(() => {
    switch (resolution) {
      case "160x90":
        return [160, 90];
      case "240x135":
        return [240, 135];
      case "480x270":
        return [480, 270];
      case "320x180":
      default:
        return [320, 180];
    }
  }, [resolution]);

  // Load source image and generate processed pixel buffer
  const [isLoaded, setIsLoaded] = React.useState(false);
  const sourceImageRef = React.useRef<HTMLImageElement | null>(null);

  React.useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/pixel/countryside-source.jpg";
    img.onload = () => {
      sourceImageRef.current = img;
      setIsLoaded(true);
    };
  }, []);

  // Compute Quantized & Dithered Pixel Buffer when resolution, palette, or dithering changes
  React.useEffect(() => {
    if (!isLoaded || !sourceImageRef.current) return;

    // Create virtual canvas of exact low-res dimensions
    const vCanvas = document.createElement("canvas");
    vCanvas.width = resW;
    vCanvas.height = resH;
    const vCtx = vCanvas.getContext("2d", { willReadFrequently: true });
    if (!vCtx) return;

    // Draw source scaled down
    vCtx.drawImage(sourceImageRef.current, 0, 0, resW, resH);
    const rawData = vCtx.getImageData(0, 0, resW, resH);
    baseImageDataRef.current = rawData;

    // Output buffer
    const outData = vCtx.createImageData(resW, resH);
    const src = rawData.data;
    const dst = outData.data;

    const pal = PALETTES[palette];
    const ditherAmp = dithering ? 14 : 0;

    for (let y = 0; y < resH; y++) {
      for (let x = 0; x < resW; x++) {
        const idx = (y * resW + x) * 4;

        // Bayer offset
        const bayer = BAYER_4X4[y % 4][x % 4];
        const ditherOffset = (bayer / 16 - 0.5) * ditherAmp;

        const r = Math.max(0, Math.min(255, src[idx] + ditherOffset));
        const g = Math.max(0, Math.min(255, src[idx + 1] + ditherOffset));
        const b = Math.max(0, Math.min(255, src[idx + 2] + ditherOffset));

        // Find nearest color in palette using weighted Euclidean perception distance
        let minDist = Infinity;
        let bestR = pal[0][0];
        let bestG = pal[0][1];
        let bestB = pal[0][2];

        for (let i = 0; i < pal.length; i++) {
          const pr = pal[i][0];
          const pg = pal[i][1];
          const pb = pal[i][2];

          const dr = r - pr;
          const dg = g - pg;
          const db = b - pb;
          // Perceptual color weights
          const dist = 0.3 * dr * dr + 0.59 * dg * dg + 0.11 * db * db;

          if (dist < minDist) {
            minDist = dist;
            bestR = pr;
            bestG = pg;
            bestB = pb;
          }
        }

        dst[idx] = bestR;
        dst[idx + 1] = bestG;
        dst[idx + 2] = bestB;
        dst[idx + 3] = 255;
      }
    }

    processedImageDataRef.current = outData;
    virtualCanvasRef.current = vCanvas;
  }, [isLoaded, resW, resH, palette, dithering]);

  // Main 60 FPS Animation Loop
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let time = 0;
    let lastTime = performance.now();
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    // 1. Pixel Smoke Particles (Chimney position: x ~ 0.855 * resW, y ~ 0.428 * resH)
    const smokes: PixelSmoke[] = [];
    const chimneyX = Math.round(0.855 * resW);
    const chimneyY = Math.round(0.428 * resH);

    // 2. Pixel Storks (Flying right to left across sky)
    const storks: PixelStork[] = Array.from({ length: 5 }, (_, i) => ({
      x: resW * (0.4 + i * 0.15) + (Math.random() - 0.5) * 20,
      y: resH * (0.2 + i * 0.05) + (Math.random() - 0.5) * 8,
      vx: -(0.35 + Math.random() * 0.2),
      vy: (Math.random() - 0.5) * 0.05,
      frame: Math.floor(Math.random() * 3),
      flapTimer: Math.random() * 10,
      flapSpeed: 0.18 + Math.random() * 0.08,
    }));

    // 3. Pixel River Spline points mapped to virtual resolution
    const riverPoints = [
      { x: 0.42 * resW, y: 0.42 * resH },
      { x: 0.37 * resW, y: 0.49 * resH },
      { x: 0.46 * resW, y: 0.54 * resH },
      { x: 0.35 * resW, y: 0.63 * resH },
      { x: 0.27 * resW, y: 0.73 * resH },
      { x: 0.33 * resW, y: 0.87 * resH },
      { x: 0.15 * resW, y: 1.0 * resH },
    ];

    const render = () => {
      const now = performance.now();
      time += 0.03;
      frameCount++;

      if (now - lastFpsUpdate >= 1000) {
        onFpsUpdate?.(Math.round((frameCount * 1000) / (now - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = now;
      }

      const vCanvas = virtualCanvasRef.current;
      const baseProcessed = processedImageDataRef.current;

      if (vCanvas && baseProcessed) {
        const vCtx = vCanvas.getContext("2d", { willReadFrequently: true });
        if (vCtx) {
          // Clone base image data for dynamic pixel modification
          const frameData = vCtx.createImageData(resW, resH);
          frameData.data.set(baseProcessed.data);
          const pixels = frameData.data;

          // =========================================================================
          // 1. PROCEDURAL PIXEL WATER SHIMMER & PALETTE CYCLING
          // =========================================================================
          if (animateWater) {
            // Apply sinusoidal water ripple sparkles in the river region
            for (let y = Math.round(resH * 0.42); y < resH; y++) {
              for (let x = Math.round(resW * 0.08); x < Math.round(resW * 0.55); x++) {
                const idx = (y * resW + x) * 4;
                const r = pixels[idx];
                const g = pixels[idx + 1];
                const b = pixels[idx + 2];

                // Identify river jade/gold water pixels
                const isWater = (g > r && b > 40 && g > 60) || (r > 160 && g > 150 && b < 130);
                if (isWater) {
                  const wave = Math.sin(time * 2.8 + x * 0.35 + y * 0.6);
                  if (wave > 0.75) {
                    // Golden sunlit glint pixel
                    pixels[idx] = Math.min(255, r + 45);
                    pixels[idx + 1] = Math.min(255, g + 40);
                    pixels[idx + 2] = Math.min(255, b + 25);
                  } else if (wave < -0.75) {
                    // Deep jade shadow pixel
                    pixels[idx] = Math.max(10, r - 30);
                    pixels[idx + 1] = Math.max(15, g - 25);
                    pixels[idx + 2] = Math.max(20, b - 20);
                  }
                }
              }
            }
          }

          // =========================================================================
          // 2. PIXEL PULSING GOD RAYS
          // =========================================================================
          if (animateGodRays) {
            const rayPulse = 0.5 + Math.sin(time * 1.2) * 0.5;
            const sunX = Math.round(resW * 0.42);
            const sunY = Math.round(resH * 0.24);

            for (let ray = -2; ray <= 2; ray++) {
              const angle = Math.PI * 0.55 + ray * 0.22;
              const len = resH * 0.45;
              for (let step = 0; step < len; step += 3) {
                const rx = Math.round(sunX + Math.cos(angle) * step);
                const ry = Math.round(sunY + Math.sin(angle) * step);
                if (rx >= 0 && rx < resW && ry >= 0 && ry < resH) {
                  const idx = (ry * resW + rx) * 4;
                  const intensity = (1 - step / len) * 25 * rayPulse;
                  pixels[idx] = Math.min(255, pixels[idx] + intensity * 1.2);
                  pixels[idx + 1] = Math.min(255, pixels[idx + 1] + intensity);
                  pixels[idx + 2] = Math.min(255, pixels[idx + 2] + intensity * 0.6);
                }
              }
            }
          }

          // Write modified pixels back to virtual canvas
          vCtx.putImageData(frameData, 0, 0);

          // =========================================================================
          // 3. PIXEL CHIMNEY SMOKE PARTICLES
          // =========================================================================
          if (animateSmoke) {
            // Spawn new puff periodically
            if (Math.random() < 0.25) {
              smokes.push({
                x: chimneyX + (Math.random() - 0.5) * 1.5,
                y: chimneyY,
                vx: 0.12 + Math.random() * 0.18, // drift right with morning breeze
                vy: -(0.3 + Math.random() * 0.25), // rise gently
                size: 1 + Math.random() * 1.5,
                alpha: 0.8,
                life: 0,
              });
            }

            for (let i = smokes.length - 1; i >= 0; i--) {
              const s = smokes[i];
              s.x += s.vx;
              s.y += s.vy;
              s.life += 1;
              s.alpha -= 0.012;
              s.size += 0.03;

              if (s.alpha <= 0.05 || s.y < 0) {
                smokes.splice(i, 1);
                continue;
              }

              // Draw pixelated smoke cluster
              vCtx.fillStyle = `rgba(240, 242, 245, ${s.alpha})`;
              const sz = Math.round(s.size);
              vCtx.fillRect(Math.round(s.x), Math.round(s.y), sz, sz);
            }
          }

          // =========================================================================
          // 4. PIXEL FLYING STORKS (16-BIT RETRO SPRITES)
          // =========================================================================
          if (animateStorks) {
            for (const stk of storks) {
              stk.x += stk.vx;
              stk.y += stk.vy;
              stk.flapTimer += stk.flapSpeed;
              if (stk.flapTimer >= 1) {
                stk.frame = (stk.frame + 1) % 3;
                stk.flapTimer = 0;
              }

              // Horizon loop
              if (stk.x < -10) {
                stk.x = resW + 15 + Math.random() * 20;
                stk.y = resH * (0.15 + Math.random() * 0.25);
              }

              const sx = Math.round(stk.x);
              const sy = Math.round(stk.y);

              // Draw 16-bit Stork Sprite
              vCtx.save();
              // Body (white)
              vCtx.fillStyle = "#ffffff";
              vCtx.fillRect(sx, sy, 3, 1);
              // Neck & Beak
              vCtx.fillRect(sx - 1, sy, 1, 1);
              vCtx.fillStyle = "#f5a030"; // Amber beak
              vCtx.fillRect(sx - 2, sy, 1, 1);

              // Wings based on frame: 0=Up, 1=Glide, 2=Down
              if (stk.frame === 0) {
                // Wings Up
                vCtx.fillStyle = "#ffffff";
                vCtx.fillRect(sx + 1, sy - 1, 1, 1);
                vCtx.fillRect(sx + 1, sy - 2, 1, 1);
                vCtx.fillStyle = "#222832"; // Dark primary tips
                vCtx.fillRect(sx + 2, sy - 3, 1, 1);

                vCtx.fillStyle = "#ffffff";
                vCtx.fillRect(sx + 1, sy + 1, 1, 1);
                vCtx.fillRect(sx + 1, sy + 2, 1, 1);
                vCtx.fillStyle = "#222832";
                vCtx.fillRect(sx + 2, sy + 3, 1, 1);
              } else if (stk.frame === 1) {
                // Gliding Wings (Swept back)
                vCtx.fillStyle = "#ffffff";
                vCtx.fillRect(sx + 1, sy - 1, 2, 1);
                vCtx.fillStyle = "#222832";
                vCtx.fillRect(sx + 3, sy - 1, 1, 1);

                vCtx.fillStyle = "#ffffff";
                vCtx.fillRect(sx + 1, sy + 1, 2, 1);
                vCtx.fillStyle = "#222832";
                vCtx.fillRect(sx + 3, sy + 1, 1, 1);
              } else {
                // Wings Down
                vCtx.fillStyle = "#ffffff";
                vCtx.fillRect(sx + 1, sy, 2, 1);
                vCtx.fillStyle = "#222832";
                vCtx.fillRect(sx + 3, sy, 1, 1);
              }

              // Trailing Legs
              vCtx.fillStyle = "rgba(180, 130, 60, 0.7)";
              vCtx.fillRect(sx + 3, sy, 2, 1);
              vCtx.restore();
            }
          }

          // =========================================================================
          // 5. PIXEL FLUTTERING KITE
          // =========================================================================
          if (animateKite) {
            const kBaseX = Math.round(0.63 * resW);
            const kBaseY = Math.round(0.57 * resH);
            const kX = kBaseX + Math.sin(time * 2.5) * 2;
            const kY = kBaseY + Math.cos(time * 3.0) * 1.5;

            // Diamond Kite 4-quadrant pixels (Red, Yellow, Blue, Cyan)
            vCtx.fillStyle = "#ef4444";
            vCtx.fillRect(kX, kY - 2, 1, 1);
            vCtx.fillStyle = "#fbbf24";
            vCtx.fillRect(kX - 1, kY - 1, 1, 1);
            vCtx.fillStyle = "#3b82f6";
            vCtx.fillRect(kX + 1, kY - 1, 1, 1);
            vCtx.fillStyle = "#06b6d4";
            vCtx.fillRect(kX, kY, 1, 1);

            // Fluttering Tail Ribbons
            vCtx.fillStyle = "#f59e0b";
            for (let t = 1; t <= 4; t++) {
              const tx = kX + Math.sin(time * 4.0 + t * 0.8) * 2 + t * 0.6;
              const ty = kY + t * 1.2;
              vCtx.fillRect(Math.round(tx), Math.round(ty), 1, 1);
            }
          }

          // =========================================================================
          // 6. RENDER VIRTUAL CANVAS TO PHYSICAL CANVAS (NEAREST NEIGHBOR)
          // =========================================================================
          const dstW = canvas.width;
          const dstH = canvas.height;

          // Disable smoothing for razor-sharp pixel edges
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(vCanvas, 0, 0, resW, resH, 0, 0, dstW, dstH);

          // Optional Pixel Grid (Draw 1px subtle dark boundary between pixel blocks)
          if (pixelGrid) {
            const cellW = dstW / resW;
            const cellH = dstH / resH;
            ctx.strokeStyle = "rgba(0, 0, 0, 0.12)";
            ctx.lineWidth = 1;

            ctx.beginPath();
            for (let x = 0; x <= dstW; x += cellW) {
              ctx.moveTo(x, 0);
              ctx.lineTo(x, dstH);
            }
            for (let y = 0; y <= dstH; y += cellH) {
              ctx.moveTo(0, y);
              ctx.lineTo(dstW, y);
            }
            ctx.stroke();
          }

          // Optional CRT Scanlines
          if (crtEffect) {
            ctx.fillStyle = "rgba(10, 15, 20, 0.15)";
            for (let y = 0; y < dstH; y += 4) {
              ctx.fillRect(0, y, dstW, 1.5);
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [
    isLoaded,
    resW,
    resH,
    palette,
    dithering,
    pixelGrid,
    crtEffect,
    animateWater,
    animateStorks,
    animateSmoke,
    animateGodRays,
    animateKite,
    onFpsUpdate,
    canvasRef,
  ]);

  // Adjust canvas size to parent container
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [canvasRef]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}

