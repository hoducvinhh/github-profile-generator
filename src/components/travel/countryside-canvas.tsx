"use client";

import * as React from "react";

// --- Types for Stylized Micro-Animations (Ghibli / Aerial Countryside) ---

interface Stork {
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  depth: number;
  opacity: number;
  flapPhase: number;
  flapSpeed: number;
  glideTimer: number;
  isGliding: boolean;
  baseY: number;
  tilt: number;
  wobblePhase: number;
}

interface Fish {
  active: boolean;
  x: number;
  y: number;
  startX: number;
  startY: number;
  vx: number;
  vy: number;
  gravity: number;
  scale: number;
  alpha: number;
  rotation: number;
}

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
}

interface SplashParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

interface SunMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulse: number;
}

interface RiverStreamlet {
  t: number;            // 0.0 to 1.0 along the river spline
  speed: number;        // drift speed along river (gentle, calm)
  lateral: number;      // -0.65 to +0.65 across the channel
  lengthT: number;      // length of the streamlet in t
  phase: number;        // lateral wave wobble phase
  wobbleSpeed: number;  // wave undulation speed
  maxAlpha: number;     // peak opacity
}

// Catmull-Rom control points tracing the river in 1376x768 artwork
const RIVER_CONTROL_POINTS = [
  { x: 580, y: 310 }, // 0: Distant karst valley origin
  { x: 500, y: 335 }, // 1: Flowing down
  { x: 450, y: 360 }, // 2: Curve 1 (left bank reach)
  { x: 530, y: 395 }, // 3: Turning right
  { x: 605, y: 425 }, // 4: Curve 2 (rightmost bend apex)
  { x: 560, y: 475 }, // 5: Returning to center
  { x: 460, y: 530 }, // 6: Curve 3 (past the water buffalo)
  { x: 420, y: 590 }, // 7: Entering wide bend
  { x: 450, y: 645 }, // 8: Flowing beside the sampan boat
  { x: 510, y: 700 }, // 9: Lower sparkling morning pool
  { x: 560, y: 768 }, // 10: Exiting bottom foreground
];

function evalRiverSpline(t: number) {
  const pts = RIVER_CONTROL_POINTS;
  const n = pts.length;
  const clampedT = Math.max(0, Math.min(0.999, t));
  const fIdx = clampedT * (n - 1);
  const idx = Math.min(Math.floor(fIdx), n - 2);
  const u = fIdx - idx;

  const p0 = pts[Math.max(0, idx - 1)];
  const p1 = pts[idx];
  const p2 = pts[Math.min(n - 1, idx + 1)];
  const p3 = pts[Math.min(n - 1, idx + 2)];

  // Catmull-Rom Position
  const posX =
    0.5 *
    (2 * p1.x +
      (-p0.x + p2.x) * u +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u * u +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u * u * u);

  const posY =
    0.5 *
    (2 * p1.y +
      (-p0.y + p2.y) * u +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u * u +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u * u * u);

  // Tangent Vector
  const tanX =
    0.5 *
    (-p0.x +
      p2.x +
      2 * (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u +
      3 * (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u * u);

  const tanY =
    0.5 *
    (-p0.y +
      p2.y +
      2 * (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u +
      3 * (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u * u);

  const len = Math.hypot(tanX, tanY) || 1;
  const nx = -tanY / len;
  const ny = tanX / len;

  // River half-width expands from 8px at distant valley to 72px in foreground pool
  const halfWidth = 8 + clampedT * 70;

  return { posX, posY, nx, ny, halfWidth };
}


interface CountrysideCanvasProps {
  parallaxX?: number;
  parallaxY?: number;
}

export function CountrysideCanvas({
  parallaxX = 0,
  parallaxY = 0,
}: CountrysideCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const parallaxRef = React.useRef({ x: parallaxX, y: parallaxY });

  // Update ref continuously on mousemove without tearing down canvas loop
  React.useEffect(() => {
    parallaxRef.current.x = parallaxX;
    parallaxRef.current.y = parallaxY;
  }, [parallaxX, parallaxY]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let cssWidth = window.innerWidth;
    let cssHeight = window.innerHeight;

    const setupCanvasSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssWidth = window.innerWidth;
      cssHeight = window.innerHeight;
      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    setupCanvasSize();

    // 1. FLOCK OF WHITE STORKS (AERIAL HIGH-ANGLE PERSPECTIVE & GHIBLI AESTHETICS)
    const STORK_COUNT = 7;
    let storks: Stork[] = [];

    const initStorks = () => {
      storks = Array.from({ length: STORK_COUNT }, (_, i) => {
        const depth = 0.6 + (i / STORK_COUNT) * 0.4;
        const spawnX = cssWidth * 0.45 + i * 70 + (Math.random() - 0.5) * 35;
        const spawnY = cssHeight * 0.22 + i * 22 + (Math.random() - 0.5) * 20;

        return {
          x: spawnX,
          y: spawnY,
          baseY: spawnY,
          vx: -(0.6 + depth * 0.35),
          vy: 0,
          scale: 13 + depth * 7,
          depth,
          opacity: 0.85 + depth * 0.15,
          flapPhase: Math.random() * Math.PI * 2,
          flapSpeed: 0.055 + Math.random() * 0.02,
          glideTimer: 60 + Math.random() * 100,
          isGliding: Math.random() > 0.4,
          tilt: 0,
          wobblePhase: Math.random() * Math.PI * 2,
        };
      });
    };

    // 2. JUMPING FISH IN THE JADE RIVER
    let fish: Fish = {
      active: false,
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
      vx: 0,
      vy: 0,
      gravity: 0.32,
      scale: 1,
      alpha: 1,
      rotation: 0,
    };
    let nextFishTime = 160 + Math.random() * 220;

    // 3. WATER RIPPLES & SPLASHES
    let ripples: WaterRipple[] = [];
    let splashes: SplashParticle[] = [];

    // 4. GENTLE FLOWING RIVER STREAMLETS (DÒNG CHẢY UỐN LƯỢN MỀM MẠI)
    const STREAMLET_COUNT = 38;
    const streamlets: RiverStreamlet[] = Array.from({ length: STREAMLET_COUNT }, (_, i) => ({
      t: i / STREAMLET_COUNT + Math.random() * 0.04,
      speed: 0.00045 + Math.random() * 0.00045,
      lateral: (Math.random() - 0.5) * 1.3,
      lengthT: 0.035 + Math.random() * 0.035,
      phase: Math.random() * Math.PI * 2,
      wobbleSpeed: 1.2 + Math.random() * 0.8,
      maxAlpha: 0.14 + Math.random() * 0.16,
    }));

    let motes: SunMote[] = Array.from({ length: 25 }, () => ({
      x: Math.random() * cssWidth,
      y: Math.random() * cssHeight,
      vx: (Math.random() - 0.3) * 0.25,
      vy: -(0.2 + Math.random() * 0.35),
      radius: 1 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.5,
      pulse: Math.random() * Math.PI * 2,
    }));

    initStorks();

    const handleResize = () => {
      setupCanvasSize();
      initStorks();
    };

    window.addEventListener("resize", handleResize);

    let time = 0;
    let currentPX = parallaxRef.current.x;
    let currentPY = parallaxRef.current.y;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // Smooth buttery lerp for parallax transitions (prevents abrupt jumps or stalling)
      currentPX += (parallaxRef.current.x - currentPX) * 0.12;
      currentPY += (parallaxRef.current.y - currentPY) * 0.12;
      const pX = currentPX;
      const pY = currentPY;

      // Coordinate mapping for the 1376x768 landscape background (bg-cover bg-center with inset: -14px)
      const bgPad = 14;
      const contW = cssWidth + bgPad * 2;
      const contH = cssHeight + bgPad * 2;
      const imgW = 1376;
      const imgH = 768;

      const bgScale = Math.max(contW / imgW, contH / imgH);
      const renderedImgW = imgW * bgScale;
      const renderedImgH = imgH * bgScale;

      const imgScreenOriginX = -bgPad + (contW - renderedImgW) * 0.5 - pX * 0.5;
      const imgScreenOriginY = -bgPad + (contH - renderedImgH) * 0.5 - pY * 0.5;

      // =========================================================================
      // 1. GENTLE FLOWING RIVER CURRENTS (DÒNG NƯỚC CHẢY NHẸ NHÀNG, MỀM MẠI)
      // =========================================================================
      for (const s of streamlets) {
        // Very slow, peaceful drift from mountains to foreground pool
        s.t += s.speed;
        if (s.t > 0.98) {
          s.t = 0.01 + Math.random() * 0.06;
          s.lateral = (Math.random() - 0.5) * 1.3;
          s.speed = 0.00045 + Math.random() * 0.00045;
          s.maxAlpha = 0.14 + Math.random() * 0.16;
        }

        // Smooth sinusoidal fade-in / fade-out envelope along the river
        const envelope = Math.sin(s.t * Math.PI);
        const alpha = s.maxAlpha * envelope;
        if (alpha < 0.01) continue;

        const steps = 7;
        const dt = s.lengthT / steps;

        ctx.save();
        ctx.beginPath();

        for (let step = 0; step <= steps; step++) {
          const curT = s.t + step * dt;
          if (curT > 0.999) break;

          const { posX, posY, nx, ny, halfWidth } = evalRiverSpline(curT);

          // Gentle lateral wave undulation
          const wave = Math.sin(time * s.wobbleSpeed + s.phase + step * 0.45) * (1.2 * (0.4 + curT * 0.8));
          let latOffset = s.lateral * halfWidth + wave;

          // Gently guide water flow around the boat (around x: 390, y: 625)
          const imgX = posX + nx * latOffset;
          const imgY = posY + ny * latOffset;
          const distToBoat = Math.hypot(imgX - 390, imgY - 625);
          if (distToBoat < 32) {
            latOffset += (32 - distToBoat) * 0.7;
          }

          const finalImgX = posX + nx * latOffset;
          const finalImgY = posY + ny * latOffset;

          const sx = imgScreenOriginX + finalImgX * bgScale;
          const sy = imgScreenOriginY + finalImgY * bgScale;

          if (step === 0) {
            ctx.moveTo(sx, sy);
          } else {
            ctx.lineTo(sx, sy);
          }
        }

        // Color tone matches local river lighting
        const isSunlit = s.t > 0.45 && s.lateral > -0.15;
        if (isSunlit) {
          // Soft golden dawn light shimmering on flowing water
          ctx.strokeStyle = `rgba(255, 248, 215, ${alpha * 0.9})`;
        } else {
          // Translucent jade emerald river current
          ctx.strokeStyle = `rgba(180, 235, 215, ${alpha * 0.7})`;
        }

        ctx.lineWidth = Math.max(0.65, (0.65 + s.t * 1.5) * bgScale);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
        ctx.restore();
      }

      // Ambient sparkling river glints in the sunlit morning reflection
      for (let i = 0; i < 8; i++) {
        const glintPhase = time * 1.8 + i * 1.1;
        const gAlpha = Math.max(0, Math.sin(glintPhase)) * 0.28;
        if (gAlpha > 0.02) {
          const gt = 0.65 + i * 0.04;
          const { posX, posY, nx, ny, halfWidth } = evalRiverSpline(gt);
          const gLat = 0.15 + (i % 3) * 0.25;
          const gx = posX + nx * (gLat * halfWidth) + Math.sin(time * 0.6 + i) * 6;
          const gy = posY + ny * (gLat * halfWidth) + Math.cos(time * 0.5 + i) * 3;

          const sx = imgScreenOriginX + gx * bgScale;
          const sy = imgScreenOriginY + gy * bgScale;

          ctx.save();
          ctx.strokeStyle = `rgba(255, 250, 220, ${gAlpha})`;
          ctx.lineWidth = 1.0 * bgScale;
          ctx.beginPath();
          // Gentle curved water ripple
          ctx.ellipse(sx, sy, 7 * bgScale, 2.5 * bgScale, -0.1, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // =========================================================================
      // 2. WATER RIPPLES & RIVER SHIMMER
      // =========================================================================
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.radius += rip.speed;
        rip.alpha *= 0.965;

        if (rip.alpha < 0.02 || rip.radius > rip.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = `rgba(255, 245, 200, ${rip.alpha})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.ellipse(
          rip.x + pX * 0.15,
          rip.y + pY * 0.1,
          rip.radius,
          rip.radius * 0.4, // aerial isometric tilt
          -0.1,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();
      }

      // Splash particles
      for (let i = splashes.length - 1; i >= 0; i--) {
        const p = splashes[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        p.alpha *= 0.95;

        if (p.alpha < 0.03) {
          splashes.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 230, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(
          p.x + pX * 0.15,
          p.y + pY * 0.1,
          p.radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      }


      // =========================================================================
      // 3. JUMPING FISH IN THE JADE RIVER (CÁ NHẢY TUNG LÊN MẶT NƯỚC)
      // =========================================================================
      nextFishTime -= 1;
      if (nextFishTime <= 0 && !fish.active) {
        // Spawn fish in mid-river curve (x: 0.35 - 0.45, y: 0.56 - 0.68)
        const spawnX = cssWidth * (0.36 + Math.random() * 0.1);
        const spawnY = cssHeight * (0.58 + Math.random() * 0.1);
        fish = {
          active: true,
          x: spawnX,
          y: spawnY,
          startX: spawnX,
          startY: spawnY,
          vx: (Math.random() - 0.5) * 1.6,
          vy: -(6.0 + Math.random() * 2.2),
          gravity: 0.32,
          scale: 6.5 + Math.random() * 3.5,
          alpha: 1,
          rotation: 0,
        };

        ripples.push({
          x: spawnX,
          y: spawnY,
          radius: 3,
          maxRadius: 24,
          speed: 0.45,
          alpha: 0.6,
        });

        for (let k = 0; k < 6; k++) {
          splashes.push({
            x: spawnX,
            y: spawnY,
            vx: (Math.random() - 0.5) * 2.5,
            vy: -(1.5 + Math.random() * 2.5),
            radius: 1 + Math.random() * 1.4,
            alpha: 0.85,
          });
        }
      }

      if (fish.active) {
        fish.x += fish.vx;
        fish.y += fish.vy;
        fish.vy += fish.gravity;
        fish.rotation = Math.atan2(fish.vy, fish.vx);

        ctx.save();
        const fX = fish.x + pX * 0.15;
        const fY = fish.y + pY * 0.1;
        ctx.translate(fX, fY);
        ctx.rotate(fish.rotation);

        const sz = fish.scale;

        // Silvery golden fish body
        ctx.fillStyle = "rgba(255, 240, 205, 0.95)";
        ctx.strokeStyle = "rgba(195, 145, 70, 0.85)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, sz, sz * 0.36, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Glistening belly
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.beginPath();
        ctx.ellipse(0, sz * 0.08, sz * 0.65, sz * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Forked tail
        ctx.fillStyle = "rgba(240, 175, 90, 0.9)";
        ctx.beginPath();
        ctx.moveTo(-sz * 0.8, 0);
        ctx.lineTo(-sz * 1.3, -sz * 0.32);
        ctx.lineTo(-sz * 1.0, 0);
        ctx.lineTo(-sz * 1.3, sz * 0.32);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        if (fish.vy > 0 && fish.y >= fish.startY) {
          fish.active = false;
          nextFishTime = 220 + Math.random() * 300;

          ripples.push({
            x: fish.x,
            y: fish.startY,
            radius: 4,
            maxRadius: 32,
            speed: 0.5,
            alpha: 0.7,
          });

          for (let k = 0; k < 8; k++) {
            splashes.push({
              x: fish.x,
              y: fish.startY,
              vx: (Math.random() - 0.5) * 3,
              vy: -(2 + Math.random() * 2.8),
              radius: 1 + Math.random() * 1.8,
              alpha: 0.9,
            });
          }
        }
      }



      // =========================================================================
      // 5. FLYING WHITE STORKS (AERIAL HIGH-ANGLE PERSPECTIVE & GHIBLI AESTHETICS)
      // =========================================================================
      for (const s of storks) {
        s.x += s.vx;

        // Dynamic gliding vs flapping cycles (thermal updrafts)
        s.glideTimer -= 1;
        if (s.glideTimer <= 0) {
          s.isGliding = !s.isGliding;
          s.glideTimer = s.isGliding
            ? 90 + Math.random() * 120   // Long tranquil glides
            : 60 + Math.random() * 70;   // Graceful flapping bursts
        }

        s.wobblePhase += 0.025;
        // Subtle vertical thermal drift
        const thermal = Math.sin(s.wobblePhase) * 0.18;

        if (!s.isGliding) {
          s.flapPhase += s.flapSpeed;
          s.vy = Math.cos(s.flapPhase) * 0.25 + thermal;
          s.tilt = Math.sin(s.flapPhase) * 0.04;
        } else {
          // Gentle gliding roll & steady drift
          s.flapPhase = Math.sin(s.wobblePhase * 1.5) * 0.08;
          s.vy = 0.04 + thermal;
          s.tilt = Math.sin(s.wobblePhase) * 0.03;
        }

        s.y += s.vy;

        // Respawn off-screen on the right to preserve continuous natural flock flow
        if (s.x < -s.scale * 2.5 - 50) {
          s.x = cssWidth + 50 + Math.random() * 140;
          s.y = cssHeight * 0.18 + Math.random() * (cssHeight * 0.24);
          s.baseY = s.y;
          s.isGliding = Math.random() > 0.4;
          s.glideTimer = 70 + Math.random() * 100;
        }

        ctx.save();
        const drawX = s.x + pX * (s.depth * 0.25);
        const drawY = s.y + pY * (s.depth * 0.18);
        ctx.translate(drawX, drawY);
        if (s.tilt) ctx.rotate(s.tilt);

        const sz = s.scale;
        const beat = s.isGliding ? -0.1 : Math.sin(s.flapPhase);

        // Wing sweep-back and vertical displacement (aerial 2.5D perspective)
        const farSweepX = sz * (0.58 + beat * 0.1);
        const farLiftY = sz * (0.8 + beat * 0.55);
        const nearSweepX = sz * (0.54 + beat * 0.08);
        const nearDropY = sz * (0.8 - beat * 0.55);

        // 1. LEGS (Slender dusky ochre, natural tucked length)
        ctx.save();
        ctx.strokeStyle = `rgba(165, 125, 75, ${s.opacity * 0.65})`;
        ctx.lineWidth = Math.max(0.7, sz * 0.045);
        ctx.lineCap = "round";
        ctx.beginPath();
        // Upper leg & foot
        ctx.moveTo(sz * 0.3, sz * 0.03);
        ctx.lineTo(sz * 0.65, sz * 0.06);
        ctx.lineTo(sz * 0.95, sz * 0.08);
        // Lower leg & foot
        ctx.moveTo(sz * 0.28, sz * 0.05);
        ctx.lineTo(sz * 0.62, sz * 0.09);
        ctx.lineTo(sz * 0.9, sz * 0.12);
        ctx.stroke();
        ctx.restore();

        // 2. FAR WING (Top Wing - behind body)
        // White covert base
        ctx.save();
        ctx.fillStyle = `rgba(230, 238, 248, ${s.opacity * 0.95})`;
        ctx.beginPath();
        ctx.moveTo(-sz * 0.05, -sz * 0.04);
        ctx.bezierCurveTo(
          sz * 0.05, -farLiftY * 0.5,
          sz * 0.2, -farLiftY * 0.8,
          farSweepX, -farLiftY
        );
        ctx.quadraticCurveTo(
          farSweepX * 0.65, -farLiftY * 0.35,
          sz * 0.22, -sz * 0.02
        );
        ctx.closePath();
        ctx.fill();

        // Dark primary flight feathers along trailing edge & wingtip with feather notches
        ctx.fillStyle = `rgba(32, 38, 48, ${s.opacity * 0.92})`;
        ctx.beginPath();
        ctx.moveTo(sz * 0.22, -farLiftY * 0.78);
        ctx.lineTo(farSweepX, -farLiftY);
        ctx.lineTo(farSweepX * 0.92, -farLiftY * 0.75);
        ctx.lineTo(farSweepX * 0.88, -farLiftY * 0.6);
        ctx.quadraticCurveTo(
          farSweepX * 0.7, -farLiftY * 0.32,
          sz * 0.22, -sz * 0.02
        );
        ctx.quadraticCurveTo(
          farSweepX * 0.42, -farLiftY * 0.35,
          sz * 0.22, -farLiftY * 0.78
        );
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 3. TAIL FEATHERS
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.beginPath();
        ctx.moveTo(sz * 0.2, -sz * 0.02);
        ctx.lineTo(sz * 0.52, sz * 0.01);
        ctx.lineTo(sz * 0.44, sz * 0.06);
        ctx.lineTo(sz * 0.16, sz * 0.04);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 4. TORSO / BODY (Aerodynamic sculpted breast & belly)
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.beginPath();
        ctx.moveTo(-sz * 0.35, -sz * 0.01);
        ctx.quadraticCurveTo(-sz * 0.05, -sz * 0.08, sz * 0.28, -sz * 0.02);
        ctx.lineTo(sz * 0.25, sz * 0.05);
        ctx.quadraticCurveTo(-sz * 0.05, sz * 0.1, -sz * 0.35, sz * 0.03);
        ctx.closePath();
        ctx.fill();

        // Soft subtle underbelly shading for 3D depth
        const grad = ctx.createLinearGradient(0, -sz * 0.05, 0, sz * 0.1);
        grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity})`);
        grad.addColorStop(1, `rgba(220, 230, 242, ${s.opacity * 0.55})`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(-sz * 0.32, sz * 0.02);
        ctx.quadraticCurveTo(-sz * 0.05, sz * 0.1, sz * 0.25, sz * 0.05);
        ctx.lineTo(sz * 0.22, sz * 0.01);
        ctx.quadraticCurveTo(-sz * 0.05, sz * 0.04, -sz * 0.32, sz * 0.02);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 5. NECK, HEAD & BEAK (Graceful S-curved extension)
        ctx.save();
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.beginPath();
        ctx.moveTo(-sz * 0.3, -sz * 0.03);
        ctx.bezierCurveTo(
          -sz * 0.55, -sz * 0.065,
          -sz * 0.72, -sz * 0.045,
          -sz * 0.88, -sz * 0.012
        );
        ctx.lineTo(-sz * 0.94, 0);
        ctx.bezierCurveTo(
          -sz * 0.72, sz * 0.028,
          -sz * 0.52, sz * 0.025,
          -sz * 0.3, sz * 0.025
        );
        ctx.closePath();
        ctx.fill();

        // Amber beak
        ctx.fillStyle = `rgba(242, 168, 48, ${s.opacity})`;
        ctx.beginPath();
        ctx.moveTo(-sz * 0.88, -sz * 0.012);
        ctx.lineTo(-sz * 1.25, 0);
        ctx.lineTo(-sz * 0.88, sz * 0.015);
        ctx.closePath();
        ctx.fill();

        // Eye speck
        ctx.fillStyle = `rgba(32, 38, 48, ${s.opacity * 0.85})`;
        ctx.beginPath();
        ctx.arc(-sz * 0.82, -sz * 0.005, Math.max(0.5, sz * 0.028), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 6. FOREGROUND WING (Near Wing - sweeping camber & black flight feathers)
        ctx.save();
        // White covert
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.beginPath();
        ctx.moveTo(-sz * 0.05, sz * 0.01);
        ctx.bezierCurveTo(
          sz * 0.08, nearDropY * 0.5,
          sz * 0.22, nearDropY * 0.8,
          nearSweepX, nearDropY
        );
        ctx.quadraticCurveTo(
          nearSweepX * 0.65, nearDropY * 0.35,
          sz * 0.18, sz * 0.05
        );
        ctx.closePath();
        ctx.fill();

        // Black primary flight feathers with feather notches
        ctx.fillStyle = `rgba(32, 38, 48, ${s.opacity * 0.95})`;
        ctx.beginPath();
        ctx.moveTo(sz * 0.25, nearDropY * 0.78);
        ctx.lineTo(nearSweepX, nearDropY);
        ctx.lineTo(nearSweepX * 0.92, nearDropY * 0.75);
        ctx.lineTo(nearSweepX * 0.88, nearDropY * 0.6);
        ctx.quadraticCurveTo(
          nearSweepX * 0.7, nearDropY * 0.32,
          sz * 0.18, sz * 0.05
        );
        ctx.quadraticCurveTo(
          nearSweepX * 0.42, nearDropY * 0.35,
          sz * 0.25, nearDropY * 0.78
        );
        ctx.closePath();
        ctx.fill();

        // Sunlit rim highlight on leading edge
        ctx.strokeStyle = `rgba(255, 255, 255, ${s.opacity * 0.9})`;
        ctx.lineWidth = Math.max(0.65, sz * 0.048);
        ctx.beginPath();
        ctx.moveTo(-sz * 0.05, sz * 0.01);
        ctx.bezierCurveTo(
          sz * 0.08, nearDropY * 0.5,
          sz * 0.22, nearDropY * 0.8,
          nearSweepX, nearDropY
        );
        ctx.stroke();
        ctx.restore();

        ctx.restore();
      }

      // =========================================================================
      // 6. SUNLIGHT MOTES
      // =========================================================================
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        m.pulse += 0.03;

        if (m.y < 0) {
          m.y = cssHeight + 10;
          m.x = Math.random() * cssWidth;
        }
        if (m.x < 0) m.x = cssWidth;
        if (m.x > cssWidth) m.x = 0;

        const currentAlpha = Math.abs(Math.sin(m.pulse)) * m.alpha;
        ctx.save();
        ctx.fillStyle = `rgba(255, 245, 195, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(
          m.x + pX * 0.25,
          m.y + pY * 0.2,
          m.radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Static empty dependency array: canvas lifecycle runs continuously at 60 FPS without resets on mouse movement

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 w-full h-full"
    />
  );
}
