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
  interactMode?: "ripple" | "feed";
  onFoodEaten?: () => void;
  onFpsUpdate?: (fps: number) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
}

interface FoodPellet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
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
  interactMode = "ripple",
  onFoodEaten,
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

  // Petals, Lilypads, Ripples, and Food Pellets
  const petalsRef = React.useRef<Petal[]>([]);
  const lilypadsRef = React.useRef<Lilypad[]>([]);
  const ripplesRef = React.useRef<PixelRipple[]>([]);
  const foodsRef = React.useRef<FoodPellet[]>([]);

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

  // Click handler: create water shockwave ripple OR drop fish food pellets
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;

    if (interactMode === "feed") {
      // Drop 3 floating food pellets
      for (let i = 0; i < 3; i++) {
        foodsRef.current.push({
          x: nx + (Math.random() - 0.5) * 0.03,
          y: ny + (Math.random() - 0.5) * 0.03,
          vx: (Math.random() - 0.5) * 0.0008,
          vy: (Math.random() - 0.5) * 0.0008,
          age: 0,
          maxAge: 480, // lasts ~8 seconds
        });
      }

      // Small entry water ripple
      ripplesRef.current.push({
        x: nx,
        y: ny,
        r: 1,
        maxR: 16,
        alpha: 0.75,
        speed: 0.55,
      });

      if (zenWaterAudio && zenWaterAudio.getStatus()) {
        zenWaterAudio.playWaterDrop(1760.0);
      }
      burstSpeedRef.current = 0.8;
    } else {
      // Shockwave ripple
      ripplesRef.current.push({
        x: nx,
        y: ny,
        r: 1,
        maxR: 35,
        alpha: 1.0,
        speed: 0.85,
      });

      if (zenWaterAudio && zenWaterAudio.getStatus()) {
        zenWaterAudio.playWaterDrop();
      }

      // Boost fish speed briefly
      burstSpeedRef.current = 1.8;
    }
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

      // Smoothly lerp orbit center towards target cursor (or floating food pellet)
      if (foodsRef.current.length > 0) {
        const nearestFood = foodsRef.current[0];
        targetOrbitRef.current.x += (nearestFood.x - targetOrbitRef.current.x) * 0.04;
        targetOrbitRef.current.y += (nearestFood.y - targetOrbitRef.current.y) * 0.04;
      }

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
      // 3.5. FLOATING KOI FOOD PELLETS (THỨC ĂN CÁ KOI NỔI TRÊN MẶT NƯỚC)
      // =========================================================================
      for (let f = foodsRef.current.length - 1; f >= 0; f--) {
        const food = foodsRef.current[f];
        food.age++;
        food.x += food.vx;
        food.y += food.vy;
        food.vx *= 0.985;
        food.vy *= 0.985;

        if (food.age > food.maxAge) {
          foodsRef.current.splice(f, 1);
          continue;
        }

        const fx = Math.round(food.x * vW);
        const fy = Math.round(food.y * vH);
        const bob = Math.sin(time * 3.5 + food.x * 15) * 0.45;

        // Floating golden feed morsel
        vCtx.fillStyle = "#d97706";
        vCtx.fillRect(fx, Math.round(fy + bob), 2, 2);
        vCtx.fillStyle = "#fef08a";
        vCtx.fillRect(fx, Math.round(fy + bob), 1, 1);
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
      // 5. THE TWO PIXEL KOI (1 RED KOHAKU, 1 WHITE TANCHO) IN YIN-YANG ORBIT
      // =========================================================================
      const orbitBaseR = Math.min(vW, vH) * 0.28;
      // Radius breathes organically with gentle harmonic sway
      const orbitR = orbitBaseR + Math.sin(time * 0.6) * (orbitBaseR * 0.18);

      const drawKoi = (
        startX: number,
        startY: number,
        heading: number,
        timeOffset: number,
        isRed: boolean
      ) => {
        const N = 26; // 26 articulated spine segments for silky smooth ribbon undulation
        const segLen = 2.0;

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
          // Organic swimming equation: head leads with subtle yaw, body amplifies wave towards tail
          const amp = (0.05 + 0.42 * Math.pow(u, 1.4)) * (effectiveSpeed * 0.85);
          const wave = Math.sin((time + timeOffset) * 5.4 - i * 0.32) * amp;
          curAng += wave;
          curX -= Math.cos(curAng) * segLen;
          curY -= Math.sin(curAng) * segLen;
          pts.push({ x: curX, y: curY });
          angs.push(curAng);
        }

        // Tail wake ripples
        if (showRipples && Math.random() < 0.10) {
          const tail = pts[N - 1];
          ripplesRef.current.push({
            x: tail.x / vW,
            y: tail.y / vH,
            r: 1,
            maxR: 12,
            alpha: 0.45,
            speed: 0.35,
          });
        }

        // Anatomically accurate Nishikigoi half-width profile
        const widths: number[] = [];
        for (let i = 0; i < N; i++) {
          const u = i / (N - 1);
          let w: number;
          if (u < 0.12) {
            // Snout to mouth & eyes (rounded bullet snout)
            const t = u / 0.12;
            w = 2.4 + Math.sqrt(t) * 3.0;
          } else if (u < 0.30) {
            // Eyes to muscular shoulder crest (widest point)
            const t = (u - 0.12) / 0.18;
            w = 5.4 + Math.sin(t * Math.PI * 0.5) * 1.5; // up to 6.9px half-width (~13.8px total)
          } else if (u < 0.82) {
            // Shoulder through torso to caudal peduncle
            const t = (u - 0.30) / 0.52;
            w = 6.9 - t * 4.6; // down to 2.3px
          } else {
            // Caudal peduncle to fin root
            const t = (u - 0.82) / 0.18;
            w = 2.3 - t * 1.1; // down to 1.2px
          }
          widths.push(Math.max(0.8, w));
        }

        // Compute 5 longitudinal spine and flank vertices for 3D volumetric shading
        const leftOuter: { x: number; y: number }[] = [];
        const leftMid: { x: number; y: number }[] = [];
        const spinePts: { x: number; y: number }[] = [];
        const rightMid: { x: number; y: number }[] = [];
        const rightOuter: { x: number; y: number }[] = [];

        for (let i = 0; i < N; i++) {
          const p = pts[i];
          const a = angs[i];
          const w = widths[i];

          const nx = -Math.sin(a);
          const ny = Math.cos(a);

          leftOuter.push({ x: p.x + nx * w, y: p.y + ny * w });
          leftMid.push({ x: p.x + nx * (w * 0.5), y: p.y + ny * (w * 0.5) });
          spinePts.push({ x: p.x, y: p.y });
          rightMid.push({ x: p.x - nx * (w * 0.5), y: p.y - ny * (w * 0.5) });
          rightOuter.push({ x: p.x - nx * w, y: p.y - ny * w });
        }

        // -----------------------------------------------------------------------
        // 5.1. PECTORAL FINS (VÂY NGỰC CÁNH QUẠT LỤA VUỐT XUÔI THEO THÂN - Joint 4)
        // -----------------------------------------------------------------------
        const pecBase = pts[4];
        const pecAng = angs[4];
        const pecFlap = Math.sin((time + timeOffset) * 5.4) * 0.22;

        for (const side of [-1, 1]) {
          // Outward perpendicular side angle
          const sideAngle = pecAng + side * (Math.PI * 0.5);
          // Root of the fin on the body contour
          const rootX = pecBase.x + Math.cos(sideAngle) * (widths[4] * 0.95);
          const rootY = pecBase.y + Math.sin(sideAngle) * (widths[4] * 0.95);

          // Fin points backward towards tail, angled slightly outward
          const baseBackAngle = pecAng + Math.PI;
          const finCenterDir = baseBackAngle + side * (0.42 + pecFlap * 0.18);

          // 5 feathered translucent fin rays per pectoral fin
          const numRays = 5;
          const rayPts: { x: number; y: number }[] = [];
          for (let r = 0; r < numRays; r++) {
            const spread = (r / (numRays - 1) - 0.5) * 0.44;
            const rLen = 13.5 - Math.abs(spread) * 4.2;
            const rx = rootX + Math.cos(finCenterDir + spread) * rLen;
            const ry = rootY + Math.sin(finCenterDir + spread) * rLen;
            rayPts.push({ x: rx, y: ry });
          }

          // Translucent silk fin webbing with soft pearlescent glow
          vCtx.fillStyle = isRed
            ? "rgba(255, 247, 237, 0.65)"
            : "rgba(241, 245, 249, 0.65)";
          vCtx.beginPath();
          vCtx.moveTo(Math.round(rootX), Math.round(rootY));
          for (const rp of rayPts) {
            vCtx.lineTo(Math.round(rp.x), Math.round(rp.y));
          }
          vCtx.closePath();
          vCtx.fill();

          // Individual crisp fin rays (tia vây)
          vCtx.strokeStyle = isRed ? "#fed7aa" : "#ffffff";
          vCtx.lineWidth = 1;
          for (let r = 0; r < numRays; r++) {
            const rp = rayPts[r];
            vCtx.beginPath();
            vCtx.moveTo(Math.round(rootX), Math.round(rootY));
            vCtx.lineTo(Math.round(rp.x), Math.round(rp.y));
            vCtx.stroke();
          }

          // Warm Motoaka coral accent at fin base
          if (isRed) {
            vCtx.fillStyle = "#f97316";
            vCtx.fillRect(Math.round(rootX), Math.round(rootY), 1, 1);
          }

          // Glowing white outer edge on leading ray
          vCtx.fillStyle = "#ffffff";
          vCtx.fillRect(Math.round(rayPts[0].x), Math.round(rayPts[0].y), 1, 1);
        }

        // -----------------------------------------------------------------------
        // 5.2. PELVIC / VENTRAL FINS (VÂY BỤNG XUÔI THEO THÂN - Joint 13)
        // -----------------------------------------------------------------------
        const pelvBase = pts[13];
        const pelvAng = angs[13];
        const pelvFlap = Math.sin((time + timeOffset) * 5.4 - 1.2) * 0.18;

        for (const side of [-1, 1]) {
          const sideAngle = pelvAng + side * (Math.PI * 0.5);
          const rootX = pelvBase.x + Math.cos(sideAngle) * (widths[13] * 0.9);
          const rootY = pelvBase.y + Math.sin(sideAngle) * (widths[13] * 0.9);

          const baseBackAngle = pelvAng + Math.PI;
          const fDir = baseBackAngle + side * (0.30 + pelvFlap * 0.15);

          vCtx.fillStyle = isRed
            ? "rgba(255, 237, 213, 0.55)"
            : "rgba(241, 245, 249, 0.55)";
          vCtx.beginPath();
          vCtx.moveTo(Math.round(rootX), Math.round(rootY));
          vCtx.lineTo(
            Math.round(rootX + Math.cos(fDir) * 7.5),
            Math.round(rootY + Math.sin(fDir) * 7.5)
          );
          vCtx.lineTo(
            Math.round(rootX + Math.cos(fDir - side * 0.22) * 5.5),
            Math.round(rootY + Math.sin(fDir - side * 0.22) * 5.5)
          );
          vCtx.closePath();
          vCtx.fill();
        }

        // -----------------------------------------------------------------------
        // 5.3. BUTTERFLY VEIL TAIL FIN (VÂY ĐUÔI LỤA THƯỚT THA XẺ CÁNH BƯỚM - Joint N-1)
        // -----------------------------------------------------------------------
        const tail = pts[N - 1];
        const tailAng = angs[N - 1];
        const tailBaseW = widths[N - 1];

        // 13 undulating silk fin rays forming a double-lobed butterfly caudal fin
        const tailRayCount = 13;
        const tailRayTips: { x: number; y: number }[] = [];

        for (let r = 0; r < tailRayCount; r++) {
          const normR = (r / (tailRayCount - 1) - 0.5) * 2.0; // -1.0 to 1.0
          const absR = Math.abs(normR);

          // Swallow-tail butterfly profile: lobes are longest at absR ~ 0.65, center has graceful notch
          const lobeShape = Math.sin(absR * Math.PI);
          const baseLen = 13.5 + lobeShape * 10.5; // up to 24px silk length
          const raySpread = normR * 0.78;

          // Secondary sinusoidal wave lag along the trailing silk fabric
          const lagWave =
            Math.sin((time + timeOffset) * 5.4 - N * 0.32 - normR * 0.9) *
            (3.4 * (1.0 - absR * 0.22));

          const rx =
            tail.x -
            Math.cos(tailAng + raySpread) * baseLen +
            Math.sin(tailAng) * lagWave;
          const ry =
            tail.y -
            Math.sin(tailAng + raySpread) * baseLen -
            Math.cos(tailAng) * lagWave;

          tailRayTips.push({ x: rx, y: ry });
        }

        // Translucent flowing silk membrane
        vCtx.fillStyle = isRed
          ? "rgba(255, 237, 213, 0.42)"
          : "rgba(241, 245, 249, 0.42)";
        vCtx.beginPath();
        vCtx.moveTo(
          Math.round(tail.x + Math.sin(tailAng) * tailBaseW),
          Math.round(tail.y - Math.cos(tailAng) * tailBaseW)
        );
        for (const tip of tailRayTips) {
          vCtx.lineTo(Math.round(tip.x), Math.round(tip.y));
        }
        vCtx.lineTo(
          Math.round(tail.x - Math.sin(tailAng) * tailBaseW),
          Math.round(tail.y + Math.cos(tailAng) * tailBaseW)
        );
        vCtx.closePath();
        vCtx.fill();

        // Delicate radiating fin rays (tia vây đuôi)
        vCtx.strokeStyle = isRed ? "#fed7aa" : "#ffffff";
        vCtx.lineWidth = 1;
        for (let r = 0; r < tailRayCount; r++) {
          vCtx.beginPath();
          vCtx.moveTo(Math.round(tail.x), Math.round(tail.y));
          vCtx.lineTo(Math.round(tailRayTips[r].x), Math.round(tailRayTips[r].y));
          vCtx.stroke();
        }

        // Sparkle glints on trailing veil tips
        for (let r = 0; r < tailRayCount; r += 2) {
          vCtx.fillStyle = "#ffffff";
          vCtx.fillRect(
            Math.round(tailRayTips[r].x),
            Math.round(tailRayTips[r].y),
            1,
            1
          );
        }

        // -----------------------------------------------------------------------
        // 5.4. VOLUMETRIC BODY QUADS WITH NISHIKIGOI COLOR MARKINGS
        // -----------------------------------------------------------------------
        for (let i = 0; i < N - 1; i++) {
          let colLeft: string;
          let colCenter: string;
          let colRight: string;

          if (isRed) {
            // Authentic Kohaku:
            // 0-1: Pearl white snout & mouth
            // 2-5: Menkaburi head crown (Ruby & Scarlet)
            // 6: Gill plate border (pearl white)
            // 7-14: Kata Moyo dominant dorsal saddle (Scarlet)
            // 15-16: Shiroji pearl white body step
            // 17-21: Rear Hi scarlet saddle
            // 22-25: Pure immaculate Odome white tail wrist
            const isRedSegment =
              (i >= 2 && i <= 5) || (i >= 7 && i <= 14) || (i >= 17 && i <= 21);

            if (isRedSegment) {
              colLeft = "#b91c1c"; // Deep crimson shadow
              colCenter = "#ef4444"; // Brilliant vermilion spine highlight
              colRight = "#dc2626"; // Rich scarlet core
            } else {
              colLeft = "#cbd5e1"; // Silvery slate flank shadow
              colCenter = "#ffffff"; // Pure diamond white spine highlight
              colRight = "#f1f5f9"; // Soft pearlescent white
            }
          } else {
            // Authentic Tancho & Shiro Utsuri:
            // 0-1: Snow white snout
            // 2-4: Tancho Red Sun Crown (CENTER ONLY, flanks are pearl white!)
            // 5-8: Platinum white body
            // 9-11: Sumi calligraphic ink spot
            // 12-16: Platinum white body
            // 17-19: Secondary Sumi marking
            // 20-25: Pure white caudal peduncle
            const isTanchoCrown = i >= 2 && i <= 4;
            const isSumiPatch = (i >= 9 && i <= 11) || (i >= 17 && i <= 19);

            if (isTanchoCrown) {
              // The iconic Tancho Crown: bright red circular disc on the forehead between the eyes
              colLeft = "#cbd5e1"; // White cheek
              colCenter = "#dc2626"; // Vibrant Scarlet Crown Disc!
              colRight = "#cbd5e1"; // White cheek
            } else if (isSumiPatch) {
              colLeft = "#020617";
              colCenter = "#334155";
              colRight = "#0f172a";
            } else {
              colLeft = "#cbd5e1";
              colCenter = "#ffffff";
              colRight = "#f1f5f9";
            }
          }

          // Draw Left Flank Quad
          vCtx.fillStyle = colLeft;
          vCtx.beginPath();
          vCtx.moveTo(Math.round(leftOuter[i].x), Math.round(leftOuter[i].y));
          vCtx.lineTo(Math.round(leftOuter[i + 1].x), Math.round(leftOuter[i + 1].y));
          vCtx.lineTo(Math.round(leftMid[i + 1].x), Math.round(leftMid[i + 1].y));
          vCtx.lineTo(Math.round(leftMid[i].x), Math.round(leftMid[i].y));
          vCtx.closePath();
          vCtx.fill();

          // Draw Center Dorsal Ridge Quad (High Volume)
          vCtx.fillStyle = colCenter;
          vCtx.beginPath();
          vCtx.moveTo(Math.round(leftMid[i].x), Math.round(leftMid[i].y));
          vCtx.lineTo(Math.round(leftMid[i + 1].x), Math.round(leftMid[i + 1].y));
          vCtx.lineTo(Math.round(rightMid[i + 1].x), Math.round(rightMid[i + 1].y));
          vCtx.lineTo(Math.round(rightMid[i].x), Math.round(rightMid[i].y));
          vCtx.closePath();
          vCtx.fill();

          // Draw Right Flank Quad
          vCtx.fillStyle = colRight;
          vCtx.beginPath();
          vCtx.moveTo(Math.round(rightMid[i].x), Math.round(rightMid[i].y));
          vCtx.lineTo(Math.round(rightMid[i + 1].x), Math.round(rightMid[i + 1].y));
          vCtx.lineTo(Math.round(rightOuter[i + 1].x), Math.round(rightOuter[i + 1].y));
          vCtx.lineTo(Math.round(rightOuter[i].x), Math.round(rightOuter[i].y));
          vCtx.closePath();
          vCtx.fill();

          // Ginrin Scale Specular Glints on the back
          if (i >= 5 && i <= 20 && i % 2 === 0) {
            const glintPhase = Math.sin(time * 2.5 + i * 0.8);
            if (glintPhase > 0.4) {
              vCtx.fillStyle = isRed ? "#fed7aa" : "#ffffff";
              vCtx.fillRect(Math.round(spinePts[i].x), Math.round(spinePts[i].y), 1, 1);
            }
          }
        }

        // -----------------------------------------------------------------------
        // 5.5. DORSAL FIN CREST (VÂY LƯNG UỐN LƯỢN - Joints 7 to 17)
        // -----------------------------------------------------------------------
        vCtx.strokeStyle = isRed ? "#fed7aa" : "#ffffff";
        vCtx.lineWidth = 1;
        vCtx.beginPath();
        for (let i = 7; i <= 17; i++) {
          const p = spinePts[i];
          const a = angs[i];
          // Fin tilts slightly outward when body flexes
          const tilt = Math.sin((time + timeOffset) * 5.4 - i * 0.32) * 1.8;
          const fx = p.x + Math.sin(a) * tilt;
          const fy = p.y - Math.cos(a) * tilt;
          if (i === 7) vCtx.moveTo(Math.round(fx), Math.round(fy));
          else vCtx.lineTo(Math.round(fx), Math.round(fy));
        }
        vCtx.stroke();

        // -----------------------------------------------------------------------
        // 5.6. HYDRODYNAMIC ROUNDED HEAD & LIPS (Joint 0)
        // -----------------------------------------------------------------------
        const head = pts[0];
        const headAng = angs[0];
        const hRad = widths[0];

        // Check Food Nibbling by Koi Mouth
        const mouthX = head.x;
        const mouthY = head.y;
        for (let f = foodsRef.current.length - 1; f >= 0; f--) {
          const food = foodsRef.current[f];
          const fx = food.x * vW;
          const fy = food.y * vH;
          if (Math.hypot(mouthX - fx, mouthY - fy) < 8.5) {
            foodsRef.current.splice(f, 1);
            ripplesRef.current.push({
              x: food.x,
              y: food.y,
              r: 1,
              maxR: 12,
              alpha: 0.85,
              speed: 0.5,
            });
            if (zenWaterAudio && zenWaterAudio.getStatus()) {
              zenWaterAudio.playFeedBubble();
            }
            onFoodEaten?.();
          }
        }

        // Snout fill
        vCtx.fillStyle = isRed ? "#f8fafc" : "#ffffff";
        vCtx.beginPath();
        vCtx.arc(Math.round(head.x), Math.round(head.y), Math.round(hRad), 0, Math.PI * 2);
        vCtx.fill();

        // Delicate lips
        const lipX = head.x + Math.cos(headAng) * (hRad + 0.6);
        const lipY = head.y + Math.sin(headAng) * (hRad + 0.6);
        vCtx.fillStyle = isRed ? "#fbcfe8" : "#f1f5f9";
        vCtx.fillRect(Math.round(lipX), Math.round(lipY), 1, 1);

        // Operculum (Mang cá) subtle shading arc
        const gillPt = pts[5];
        const gillAng = angs[5];
        for (const side of [-1, 1]) {
          const gx = gillPt.x + Math.cos(gillAng + side * 1.5) * (widths[5] - 0.5);
          const gy = gillPt.y + Math.sin(gillAng + side * 1.5) * (widths[5] - 0.5);
          vCtx.fillStyle = isRed ? "#991b1b" : "#94a3b8";
          vCtx.fillRect(Math.round(gx), Math.round(gy), 1, 1);
        }

        // -----------------------------------------------------------------------
        // 5.7. OBSIDIAN EYES & SENSORY BARBELS (MẮT & RÂU CÁ KOI)
        // -----------------------------------------------------------------------
        const eyeBase = pts[2];
        const eyeAng = angs[2];

        for (const side of [-1, 1]) {
          // Eye positioned laterally on the curve of the head
          const ex = eyeBase.x + Math.cos(eyeAng + side * 1.45) * 3.4;
          const ey = eyeBase.y + Math.sin(eyeAng + side * 1.45) * 3.4;

          // Obsidian pupil
          vCtx.fillStyle = "#020617";
          vCtx.fillRect(Math.round(ex), Math.round(ey), 1, 1);

          // Specular catchlight facing forward
          vCtx.fillStyle = "#ffffff";
          vCtx.fillRect(
            Math.round(ex + Math.cos(eyeAng) * 0.9),
            Math.round(ey + Math.sin(eyeAng) * 0.9),
            1,
            1
          );

          // Slender Sensory Barbels (Râu cá) trailing gracefully backwards along the cheeks
          const barbelRootX = head.x + Math.cos(headAng + side * 1.15) * (hRad * 0.9);
          const barbelRootY = head.y + Math.sin(headAng + side * 1.15) * (hRad * 0.9);
          const bAngle = (headAng + Math.PI) - side * 0.42;
          const bWiggle = Math.sin(time * 3.8 + side) * 0.35;
          const barbelTipX = barbelRootX + Math.cos(bAngle + bWiggle) * 3.2;
          const barbelTipY = barbelRootY + Math.sin(bAngle + bWiggle) * 3.2;

          vCtx.strokeStyle = isRed ? "#fed7aa" : "#ffffff";
          vCtx.lineWidth = 1;
          vCtx.beginPath();
          vCtx.moveTo(Math.round(barbelRootX), Math.round(barbelRootY));
          vCtx.lineTo(Math.round(barbelTipX), Math.round(barbelTipY));
          vCtx.stroke();
        }
      };

      // Calculate Orbital Positions for both Koi with Yin-Yang dynamic breathing
      const redOrbitR = orbitR * (1.0 + 0.12 * Math.cos(orbitAngle * 2.0));
      const redX = cx + Math.cos(orbitAngle) * redOrbitR;
      const redY = cy + Math.sin(orbitAngle) * (redOrbitR * 0.88);
      const redHeading = orbitAngle + Math.PI * 0.5 + 0.14;

      const whiteAngle = orbitAngle + Math.PI;
      const whiteOrbitR = orbitR * (1.0 - 0.12 * Math.cos(orbitAngle * 2.0));
      const whiteX = cx + Math.cos(whiteAngle) * whiteOrbitR;
      const whiteY = cy + Math.sin(whiteAngle) * (whiteOrbitR * 0.88);
      const whiteHeading = whiteAngle + Math.PI * 0.5 + 0.14;

      // Draw both Koi
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

