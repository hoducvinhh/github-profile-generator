"use client";

import * as React from "react";
import { zenWaterAudio } from "@/lib/audio/zen-water-synthesizer";

export type PixelScaleMode = "large" | "medium" | "fine";
export type PondTheme = "midnight" | "emerald" | "sunset" | "gameboy";

export interface KoiCanvasProps {
  pixelScale: PixelScaleMode;
  theme: PondTheme;
  swimSpeed: number;
  showLilypads: boolean;
  showPetals: boolean;
  showCaustics: boolean;
  showRipples: boolean;
  crtEffect: boolean;
  pixelGrid: boolean;
  onFpsUpdate?: (fps: number) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

interface PixelRipple {
  x: number;
  y: number;
  r: number;
  maxR: number;
  alpha: number;
  speed: number;
}

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vRot: number;
  scale: number;
}

interface Lilypad {
  x: number;
  y: number;
  radius: number;
  notchAngle: number;
  hasFlower: boolean;
  bobPhase: number;
}

const THEME_COLORS: Record<
  PondTheme,
  {
    bgDark: [number, number, number];
    bgLight: [number, number, number];
    caustic: [number, number, number];
    ripple: [number, number, number];
    lilyPad: [number, number, number];
    lilyPadDark: [number, number, number];
  }
> = {
  midnight: {
    bgDark: [8, 18, 28],
    bgLight: [14, 32, 48],
    caustic: [24, 62, 85],
    ripple: [160, 210, 240],
    lilyPad: [28, 105, 60],
    lilyPadDark: [18, 75, 42],
  },
  emerald: {
    bgDark: [6, 24, 20],
    bgLight: [12, 44, 36],
    caustic: [28, 92, 75],
    ripple: [140, 240, 210],
    lilyPad: [35, 125, 55],
    lilyPadDark: [22, 85, 38],
  },
  sunset: {
    bgDark: [28, 16, 24],
    bgLight: [52, 28, 38],
    caustic: [115, 65, 75],
    ripple: [255, 200, 160],
    lilyPad: [45, 95, 55],
    lilyPadDark: [30, 68, 38],
  },
  gameboy: {
    bgDark: [15, 56, 15],
    bgLight: [48, 98, 48],
    caustic: [139, 172, 15],
    ripple: [155, 188, 15],
    lilyPad: [139, 172, 15],
    lilyPadDark: [48, 98, 48],
  },
};

export function KoiCanvas({
  pixelScale,
  theme,
  swimSpeed = 1.0,
  showLilypads = true,
  showPetals = true,
  showCaustics = true,
  showRipples = true,
  crtEffect = false,
  pixelGrid = false,
  onFpsUpdate,
  canvasRef: externalCanvasRef,
}: KoiCanvasProps) {
  const internalCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;

  // Offscreen low-res pixel canvas
  const vCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Mouse & Orbit center lerping
  const targetOrbitRef = React.useRef({ x: 0.5, y: 0.5 });
  const currentOrbitRef = React.useRef({ x: 0.5, y: 0.5 });

  // Burst speed on click/interaction
  const burstSpeedRef = React.useRef(0);

  // Pixel size mapping (in physical screen pixels)
  // Large: 12px (very chunky), Medium: 8px (standard retro), Fine: 5px (detailed retro)
  const pixelBlockSize = React.useMemo(() => {
    switch (pixelScale) {
      case "large":
        return 12;
      case "fine":
        return 5;
      case "medium":
      default:
        return 8;
    }
  }, [pixelScale]);

  // Petals and Lilypads
  const petalsRef = React.useRef<Petal[]>([]);
  const lilypadsRef = React.useRef<Lilypad[]>([]);
  const ripplesRef = React.useRef<PixelRipple[]>([]);

  // Initialize petals & lilypads on mount
  React.useEffect(() => {
    // 5 Lotus pads around the pond periphery
    lilypadsRef.current = [
      { x: 0.16, y: 0.22, radius: 9, notchAngle: 0.8, hasFlower: true, bobPhase: 0 },
      { x: 0.82, y: 0.28, radius: 10, notchAngle: -0.5, hasFlower: false, bobPhase: 1.2 },
      { x: 0.86, y: 0.76, radius: 11, notchAngle: 2.2, hasFlower: true, bobPhase: 2.5 },
      { x: 0.18, y: 0.82, radius: 9.5, notchAngle: -2.0, hasFlower: false, bobPhase: 3.8 },
      { x: 0.48, y: 0.12, radius: 8, notchAngle: 1.4, hasFlower: false, bobPhase: 4.5 },
    ];

    // 12 drifting blossom petals
    petalsRef.current = Array.from({ length: 14 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: 0.0002 + Math.random() * 0.0004,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.02,
      scale: 1.5 + Math.random() * 1.5,
    }));
  }, []);

  // Mouse move handler: attract fish orbit center gently towards cursor
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    targetOrbitRef.current = { x: nx, y: ny };
  };

  // Click handler: create water shockwave ripple & sound
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;

    // Spawns ripple in normalized coordinates
    ripplesRef.current.push({
      x: nx,
      y: ny,
      r: 1,
      maxR: 35,
      alpha: 1.0,
      speed: 0.85,
    });

    // Play procedural water pling drop
    if (zenWaterAudio && zenWaterAudio.getStatus()) {
      zenWaterAudio.playWaterDrop();
    }

    // Boost fish speed briefly
    burstSpeedRef.current = 1.8;
  };

  // Main 60 FPS Canvas Render Loop
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let time = 0;
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    // Fish swim angle tracker
    let orbitAngle = 0;

    const render = () => {
      const now = performance.now();
      frameCount++;

      if (now - lastFpsUpdate >= 1000) {
        onFpsUpdate?.(Math.round((frameCount * 1000) / (now - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = now;
      }

      // Smooth decay burst speed
      burstSpeedRef.current *= 0.96;
      const effectiveSpeed = swimSpeed * (1.0 + burstSpeedRef.current);
      time += 0.028 * effectiveSpeed;
      orbitAngle += 0.018 * effectiveSpeed;

      // Smoothly lerp orbit center towards target cursor
      currentOrbitRef.current.x +=
        (targetOrbitRef.current.x - currentOrbitRef.current.x) * 0.04;
      currentOrbitRef.current.y +=
        (targetOrbitRef.current.y - currentOrbitRef.current.y) * 0.04;

      // Virtual Grid Resolution
      const screenW = canvas.width;
      const screenH = canvas.height;
      const vW = Math.max(40, Math.floor(screenW / pixelBlockSize));
      const vH = Math.max(30, Math.floor(screenH / pixelBlockSize));

      // Setup / resize virtual canvas
      if (!vCanvasRef.current) {
        vCanvasRef.current = document.createElement("canvas");
      }
      const vCanvas = vCanvasRef.current;
      if (vCanvas.width !== vW || vCanvas.height !== vH) {
        vCanvas.width = vW;
        vCanvas.height = vH;
      }

      const vCtx = vCanvas.getContext("2d", { willReadFrequently: true });
      if (!vCtx) return;

      const colors = THEME_COLORS[theme];

      // =========================================================================
      // 1. ZEN POND WATER BACKGROUND WITH RADIAL DEPTH
      // =========================================================================
      const cx = vW * currentOrbitRef.current.x;
      const cy = vH * currentOrbitRef.current.y;

      const bgGrad = vCtx.createRadialGradient(cx, cy, 5, cx, cy, Math.max(vW, vH) * 0.75);
      bgGrad.addColorStop(
        0,
        `rgb(${colors.bgLight[0]}, ${colors.bgLight[1]}, ${colors.bgLight[2]})`
      );
      bgGrad.addColorStop(
        1,
        `rgb(${colors.bgDark[0]}, ${colors.bgDark[1]}, ${colors.bgDark[2]})`
      );
      vCtx.fillStyle = bgGrad;
      vCtx.fillRect(0, 0, vW, vH);

      // =========================================================================
      // 2. PROCEDURAL PIXEL WATER CAUSTICS
      // =========================================================================
      if (showCaustics) {
        vCtx.fillStyle = `rgba(${colors.caustic[0]}, ${colors.caustic[1]}, ${colors.caustic[2]}, 0.45)`;
        const step = 3;
        for (let x = 0; x < vW; x += step) {
          for (let y = 0; y < vH; y += step) {
            const v1 = Math.sin(x * 0.09 + time * 0.7);
            const v2 = Math.cos(y * 0.09 - time * 0.5);
            const v3 = Math.sin((x + y) * 0.07 + time * 0.9);
            if (v1 + v2 + v3 > 1.85) {
              vCtx.fillRect(x, y, 1, 1);
            }
          }
        }
      }

      // =========================================================================
      // 3. PIXEL WATER RIPPLES
      // =========================================================================
      if (showRipples) {
        for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
          const rip = ripplesRef.current[i];
          rip.r += rip.speed;
          rip.alpha *= 0.96;

          if (rip.alpha <= 0.03 || rip.r >= rip.maxR) {
            ripplesRef.current.splice(i, 1);
            continue;
          }

          const rx = rip.x * vW;
          const ry = rip.y * vH;
          const radius = rip.r;

          vCtx.strokeStyle = `rgba(${colors.ripple[0]}, ${colors.ripple[1]}, ${colors.ripple[2]}, ${rip.alpha * 0.65})`;
          vCtx.lineWidth = 1;
          vCtx.beginPath();
          // Draw pixelated octagonal ripple
          for (let a = 0; a <= Math.PI * 2; a += Math.PI / 4) {
            const px = Math.round(rx + Math.cos(a) * radius);
            const py = Math.round(ry + Math.sin(a) * (radius * 0.75));
            if (a === 0) vCtx.moveTo(px, py);
            else vCtx.lineTo(px, py);
          }
          vCtx.closePath();
          vCtx.stroke();
        }
      }

      // =========================================================================
      // 4. FLOATING LOTUS PADS (LÁ SEN & BÔNG SEN PIXEL)
      // =========================================================================
      if (showLilypads) {
        for (const pad of lilypadsRef.current) {
          pad.bobPhase += 0.02;
          const bob = Math.sin(pad.bobPhase) * 0.8;
          const lx = Math.round(pad.x * vW);
          const ly = Math.round(pad.y * vH + bob);
          const rad = pad.radius;

          // Draw notched circular pixel lilypad
          for (let px = lx - rad; px <= lx + rad; px++) {
            for (let py = ly - rad; py <= ly + rad; py++) {
              const dx = px - lx;
              const dy = py - ly;
              const dist = Math.hypot(dx, dy);
              if (dist <= rad) {
                // Notch angle cutout
                const ang = Math.atan2(dy, dx);
                let diffAng = Math.abs(ang - pad.notchAngle);
                if (diffAng > Math.PI) diffAng = Math.PI * 2 - diffAng;
                if (diffAng > 0.22) {
                  const isEdge = dist >= rad - 1;
                  const c = isEdge ? colors.lilyPadDark : colors.lilyPad;
                  vCtx.fillStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
                  vCtx.fillRect(px, py, 1, 1);
                }
              }
            }
          }

          // Flower Bud in center
          if (pad.hasFlower) {
            vCtx.fillStyle = "#f472b6"; // Pink lotus petal
            vCtx.fillRect(lx - 1, ly - 1, 3, 3);
            vCtx.fillStyle = "#fef08a"; // Yellow golden stamen
            vCtx.fillRect(lx, ly, 1, 1);
          }
        }
      }

      // =========================================================================
      // 5. THE TWO PIXEL KOI (1 RED, 1 WHITE) IN YIN-YANG ORBIT
      // =========================================================================
      const orbitBaseR = Math.min(vW, vH) * 0.26;
      // Radius breathes organically
      const orbitR = orbitBaseR + Math.sin(time * 0.8) * (orbitBaseR * 0.15);

      const drawKoi = (
        startX: number,
        startY: number,
        heading: number,
        timeOffset: number,
        isRed: boolean
      ) => {
        const N = 20; // 20 spine joints for silk ribbon swimming undulation
        const segLen = 1.85;

        // Spine points and headings
        const pts: { x: number; y: number }[] = [];
        const angs: number[] = [];

        let curX = startX;
        let curY = startY;
        let curAng = heading;

        pts.push({ x: curX, y: curY });
        angs.push(curAng);

        for (let i = 1; i < N; i++) {
          const u = i / N;
          // Traveling wave: amplitude increases towards tail
          const wave = Math.sin((time + timeOffset) * 5.2 - i * 0.44) * (Math.pow(u, 1.25) * 0.38);
          curAng += wave;
          curX -= Math.cos(curAng) * segLen;
          curY -= Math.sin(curAng) * segLen;
          pts.push({ x: curX, y: curY });
          angs.push(curAng);
        }

        // Periodic tail wake ripple
        if (showRipples && Math.random() < 0.12) {
          const tail = pts[N - 1];
          ripplesRef.current.push({
            x: tail.x / vW,
            y: tail.y / vH,
            r: 1,
            maxR: 14,
            alpha: 0.5,
            speed: 0.4,
          });
        }

        // Smooth hydrodynamic thickness envelope
        const widths: number[] = [];
        for (let i = 0; i < N; i++) {
          const u = i / (N - 1);
          let w: number;
          if (u < 0.2) {
            // Snout to broad shoulder
            w = 2.0 + Math.sin((u / 0.2) * Math.PI * 0.5) * 3.4;
          } else if (u < 0.8) {
            // Shoulder to caudal peduncle
            w = 5.4 - ((u - 0.2) / 0.6) * 4.1;
          } else {
            // Peduncle to tail fin base
            w = 1.3 - ((u - 0.8) / 0.2) * 0.7;
          }
          widths.push(Math.max(0.6, w));
        }

        // Left & right contour vertices
        const leftPts: { x: number; y: number }[] = [];
        const rightPts: { x: number; y: number }[] = [];

        for (let i = 0; i < N; i++) {
          const p = pts[i];
          const a = angs[i];
          const w = widths[i];
          const nx = -Math.sin(a) * w;
          const ny = Math.cos(a) * w;
          leftPts.push({ x: p.x + nx, y: p.y + ny });
          rightPts.push({ x: p.x - nx, y: p.y - ny });
        }

        // 5.1. PECTORAL FINS (At Joint 3-4)
        const finCol = isRed ? "#fb923c" : "#e2e8f0";
        const finBase = pts[3];
        const finAng = angs[3];
        const flap = Math.sin((time + timeOffset) * 5.2) * 0.35;

        for (const side of [-1, 1]) {
          const fDir = finAng + side * (Math.PI * 0.45 + flap * side);
          const fLen = 9.0;
          const rootX = finBase.x + Math.cos(finAng + side * 1.5) * widths[3];
          const rootY = finBase.y + Math.sin(finAng + side * 1.5) * widths[3];

          vCtx.fillStyle = finCol;
          vCtx.beginPath();
          vCtx.moveTo(Math.round(rootX), Math.round(rootY));
          vCtx.lineTo(
            Math.round(rootX + Math.cos(fDir - side * 0.3) * (fLen * 0.8)),
            Math.round(rootY + Math.sin(fDir - side * 0.3) * (fLen * 0.8))
          );
          vCtx.lineTo(
            Math.round(rootX + Math.cos(fDir) * fLen),
            Math.round(rootY + Math.sin(fDir) * fLen)
          );
          vCtx.lineTo(
            Math.round(rootX + Math.cos(fDir + side * 0.3) * (fLen * 0.7)),
            Math.round(rootY + Math.sin(fDir + side * 0.3) * (fLen * 0.7))
          );
          vCtx.closePath();
          vCtx.fill();
        }

        // 5.2. VEIL TAIL FIN (Silk Pixel Veil at Joint N-1)
        const tail = pts[N - 1];
        const tailAng = angs[N - 1];
        const tWave = Math.sin((time + timeOffset) * 5.2 - N * 0.44) * 2.8;
        const veilCol = isRed ? "#fed7aa" : "#f1f5f9";

        vCtx.fillStyle = veilCol;
        vCtx.beginPath();
        vCtx.moveTo(Math.round(tail.x), Math.round(tail.y));

        const rayCount = 11;
        for (let r = 0; r < rayCount; r++) {
          const normR = (r / (rayCount - 1) - 0.5) * 1.3;
          const flen = 15.0 + (1.0 - Math.abs(normR)) * 6.0;
          const rx = tail.x - Math.cos(tailAng + normR) * flen + tWave * (1.0 - Math.abs(normR) * 0.4);
          const ry = tail.y - Math.sin(tailAng + normR) * flen;
          vCtx.lineTo(Math.round(rx), Math.round(ry));
        }
        vCtx.closePath();
        vCtx.fill();

        // 5.3. SOLID SEGMENT QUADS (Forming the seamless body ribbon with color markings)
        for (let i = 0; i < N - 1; i++) {
          let segCol: string;
          if (isRed) {
            // Kohaku Pattern: Vibrant Crimson + Pure White scale bands
            if (i <= 1) {
              segCol = "#ea580c"; // Warm orange snout
            } else if ((i >= 2 && i <= 6) || (i >= 11 && i <= 14)) {
              segCol = "#dc2626"; // Fiery Crimson
            } else if ((i >= 7 && i <= 10) || i >= 15) {
              segCol = "#ffffff"; // Pure White Band
            } else {
              segCol = "#f97316";
            }
          } else {
            // Shiro / Tancho Pattern: Silk White with Crimson Sun Crown on head
            if (i <= 2) {
              segCol = "#ef4444"; // Iconic Tancho Red Crown!
            } else if (i === 9 || i === 10 || i === 16) {
              segCol = "#1e293b"; // Sumi ink charcoal accent
            } else if (i % 2 === 0) {
              segCol = "#ffffff"; // Silk White
            } else {
              segCol = "#cbd5e1"; // Platinum silver shade
            }
          }

          vCtx.fillStyle = segCol;
          vCtx.beginPath();
          vCtx.moveTo(Math.round(leftPts[i].x), Math.round(leftPts[i].y));
          vCtx.lineTo(Math.round(leftPts[i + 1].x), Math.round(leftPts[i + 1].y));
          vCtx.lineTo(Math.round(rightPts[i + 1].x), Math.round(rightPts[i + 1].y));
          vCtx.lineTo(Math.round(rightPts[i].x), Math.round(rightPts[i].y));
          vCtx.closePath();
          vCtx.fill();
        }

        // 5.4. ROUNDED SNOUT
        const head = pts[0];
        const hRad = widths[0];
        vCtx.fillStyle = isRed ? "#ea580c" : "#ef4444";
        vCtx.beginPath();
        vCtx.arc(Math.round(head.x), Math.round(head.y), Math.round(hRad), 0, Math.PI * 2);
        vCtx.fill();

        // 5.5. EYES & SENSORY BARBELS
        const headAng = angs[0];
        for (const side of [-1, 1]) {
          const ex = head.x + Math.cos(headAng + side * 1.4) * 2.6;
          const ey = head.y + Math.sin(headAng + side * 1.4) * 2.6;
          // Black eye pixel
          vCtx.fillStyle = "#0f172a";
          vCtx.fillRect(Math.round(ex), Math.round(ey), 1, 1);
          // Catchlight
          vCtx.fillStyle = "#ffffff";
          vCtx.fillRect(
            Math.round(ex - Math.cos(headAng) * 0.8),
            Math.round(ey - Math.sin(headAng) * 0.8),
            1,
            1
          );

          // Barbel (Râu cá koi)
          const bx = head.x + Math.cos(headAng + side * 0.65) * 3.5;
          const by = head.y + Math.sin(headAng + side * 0.65) * 3.5;
          vCtx.fillStyle = isRed ? "#fed7aa" : "#ffffff";
          vCtx.fillRect(Math.round(bx), Math.round(by), 1, 1);
        }
      };

      // Calculate Orbital Positions for both Koi
      const redX = cx + Math.cos(orbitAngle) * orbitR;
      const redY = cy + Math.sin(orbitAngle) * (orbitR * 0.85);
      const redHeading = orbitAngle + Math.PI * 0.5 + 0.12;

      const whiteAngle = orbitAngle + Math.PI;
      const whiteX = cx + Math.cos(whiteAngle) * orbitR;
      const whiteY = cy + Math.sin(whiteAngle) * (orbitR * 0.85);
      const whiteHeading = whiteAngle + Math.PI * 0.5 + 0.12;

      // Draw both fish
      drawKoi(redX, redY, redHeading, 0.0, true);
      drawKoi(whiteX, whiteY, whiteHeading, 0.5, false);

      // =========================================================================
      // 6. DRIFTING CHERRY BLOSSOM / LOTUS PETALS (CÁNH HOA SEN RƠI)
      // =========================================================================
      if (showPetals) {
        for (const petal of petalsRef.current) {
          petal.x += petal.vx;
          petal.y += petal.vy;
          petal.rot += petal.vRot;

          // Screen wrapping
          if (petal.y > 1.05) petal.y = -0.05;
          if (petal.x < -0.05) petal.x = 1.05;
          if (petal.x > 1.05) petal.x = -0.05;

          const px = Math.round(petal.x * vW);
          const py = Math.round(petal.y * vH);

          vCtx.save();
          vCtx.translate(px, py);
          vCtx.rotate(petal.rot);
          vCtx.fillStyle = "#f472b6";
          vCtx.fillRect(-1, -2, 2, 3);
          vCtx.fillStyle = "#fbcfe8";
          vCtx.fillRect(0, -1, 1, 2);
          vCtx.restore();
        }
      }

      // =========================================================================
      // 7. UPSCALE VIRTUAL CANVAS TO SCREEN (NEAREST NEIGHBOR RASTERIZATION)
      // =========================================================================
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(vCanvas, 0, 0, vW, vH, 0, 0, screenW, screenH);

      // 8. OPTIONAL PIXEL GRID LINES
      if (pixelGrid) {
        const cellW = screenW / vW;
        const cellH = screenH / vH;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.14)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x <= screenW; x += cellW) {
          ctx.moveTo(x, 0);
          ctx.lineTo(x, screenH);
        }
        for (let y = 0; y <= screenH; y += cellH) {
          ctx.moveTo(0, y);
          ctx.lineTo(screenW, y);
        }
        ctx.stroke();
      }

      // 9. OPTIONAL CRT SCANLINES
      if (crtEffect) {
        ctx.fillStyle = "rgba(5, 10, 15, 0.16)";
        for (let y = 0; y < screenH; y += 4) {
          ctx.fillRect(0, y, screenW, 1.5);
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [
    pixelBlockSize,
    theme,
    swimSpeed,
    showLilypads,
    showPetals,
    showCaustics,
    showRipples,
    crtEffect,
    pixelGrid,
    onFpsUpdate,
    canvasRef,
  ]);

  // Resize canvas to full window
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [canvasRef]);

  return (
    <div
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      className="relative w-full h-full overflow-hidden select-none bg-black cursor-pointer"
    >
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
