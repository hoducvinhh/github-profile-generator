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

interface RiverGlint {
  x: number;
  y: number;
  len: number;
  speed: number;
  alpha: number;
  phase: number;
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

    // 1. FLOCK OF WHITE STORKS (AERIAL HIGH-ANGLE PERSPECTIVE)
    const STORK_COUNT = 6;
    let storks: Stork[] = [];

    const initStorks = () => {
      storks = Array.from({ length: STORK_COUNT }, (_, i) => {
        const depth = 0.55 + (i / STORK_COUNT) * 0.45;
        const spawnX = cssWidth * 0.35 + i * 36 + Math.random() * 15;
        const spawnY = cssHeight * 0.36 + i * 14 + Math.random() * 12;

        return {
          x: spawnX,
          y: spawnY,
          baseY: spawnY,
          vx: -(0.5 + depth * 0.35),
          vy: 0,
          scale: 7 + depth * 5,
          depth,
          opacity: 0.8 + depth * 0.2,
          flapPhase: Math.random() * Math.PI * 2,
          flapSpeed: 0.065 + Math.random() * 0.02,
          glideTimer: Math.random() * 120 + 80,
          isGliding: false,
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

    // 4. RIVER SURFACE GLINTS & SUNLIGHT PARTICLES
    let glints: RiverGlint[] = Array.from({ length: 22 }, () => ({
      x: cssWidth * (0.28 + Math.random() * 0.22),
      y: cssHeight * (0.52 + Math.random() * 0.42),
      len: 10 + Math.random() * 24,
      speed: 0.025 + Math.random() * 0.03,
      alpha: 0.3 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
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

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, cssWidth, cssHeight);

      // =========================================================================
      // 1. WATER RIPPLES & RIVER SHIMMER
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
          rip.x + parallaxX * 0.15,
          rip.y + parallaxY * 0.1,
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
          p.x + parallaxX * 0.15,
          p.y + parallaxY * 0.1,
          p.radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      }

      // Ambient river sunlight glints
      for (const g of glints) {
        g.phase += g.speed;
        const currentAlpha = Math.max(0, Math.sin(g.phase)) * g.alpha;
        if (currentAlpha > 0.01) {
          ctx.save();
          ctx.strokeStyle = `rgba(255, 240, 185, ${currentAlpha * 0.65})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          const rx = g.x + parallaxX * 0.15;
          const ry = g.y + parallaxY * 0.1;
          ctx.moveTo(rx - g.len * 0.5, ry);
          ctx.lineTo(rx + g.len * 0.5, ry);
          ctx.stroke();
          ctx.restore();
        }
      }

      // =========================================================================
      // 2. SAMPAN BOAT ROWING MOVEMENT & WATER WAKE (AERIAL PERSPECTIVE)
      // =========================================================================
      // In the new aerial painting, the boat is situated in the lower-left river bend
      const boatBaseX = cssWidth * 0.285;
      const boatBaseY = cssHeight * 0.815;

      const rowCycle = time * 1.5;
      const boatDriftX = Math.sin(time * 0.35) * 6;
      const boatBobY = Math.sin(rowCycle * 2) * 1.4;
      const boatTilt = Math.sin(rowCycle * 2) * 0.025;

      const boatX = boatBaseX + boatDriftX + parallaxX * 0.15;
      const boatY = boatBaseY + boatBobY + parallaxY * 0.1;

      // Emit wake ripples behind the boat
      if (Math.sin(rowCycle * 2) > 0.93 && Math.random() < 0.3) {
        ripples.push({
          x: boatX - 18,
          y: boatY + 8,
          radius: 3,
          maxRadius: 26,
          speed: 0.35,
          alpha: 0.45,
        });
        ripples.push({
          x: boatX + 16,
          y: boatY + 12,
          radius: 3,
          maxRadius: 22,
          speed: 0.3,
          alpha: 0.35,
        });
      }

      // Dynamic rowing oar and water wake
      ctx.save();
      ctx.translate(boatX, boatY);
      ctx.rotate(boatTilt);

      // Water displacement ripple around the wooden hull
      ctx.strokeStyle = "rgba(255, 245, 210, 0.24)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, 10, 42, 12, -0.2, 0, Math.PI * 2);
      ctx.stroke();

      // Dynamic rowing oar sweeping in water (điệu chèo quạt nước)
      const oarAngle = -0.45 + Math.sin(rowCycle * 2) * 0.28;
      const oarLength = 40;
      const oarPivotX = -6;
      const oarPivotY = 2;
      const oarTipX = oarPivotX - Math.cos(oarAngle) * oarLength;
      const oarTipY = oarPivotY + Math.sin(oarAngle) * oarLength * 0.55;

      // Oar shaft
      ctx.strokeStyle = "rgba(75, 52, 30, 0.95)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(oarPivotX + 4, oarPivotY - 6);
      ctx.lineTo(oarTipX, oarTipY);
      ctx.stroke();

      // Oar blade dipping in water
      ctx.fillStyle = "rgba(90, 60, 35, 0.95)";
      ctx.beginPath();
      ctx.ellipse(oarTipX, oarTipY, 6, 2.8, oarAngle, 0, Math.PI * 2);
      ctx.fill();

      // Water splash when oar pushes water
      if (Math.sin(rowCycle * 2) > 0.45) {
        ctx.fillStyle = "rgba(255, 255, 235, 0.6)";
        ctx.beginPath();
        ctx.arc(oarTipX, oarTipY, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

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
        const fX = fish.x + parallaxX * 0.15;
        const fY = fish.y + parallaxY * 0.1;
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
      // 5. FLYING WHITE STORKS (AERIAL ANGLE)
      // =========================================================================
      for (const s of storks) {
        s.x += s.vx;

        s.glideTimer -= 1;
        if (s.glideTimer <= 0) {
          s.isGliding = !s.isGliding;
          s.glideTimer = s.isGliding
            ? 70 + Math.random() * 80
            : 120 + Math.random() * 100;
        }

        if (!s.isGliding) {
          s.flapPhase += s.flapSpeed;
          s.vy = Math.cos(s.flapPhase) * 0.2;
        } else {
          s.flapPhase = Math.sin(s.flapPhase) * 0.08;
          s.vy = 0.03;
        }

        s.y += s.vy;

        if (s.x < -60) {
          s.x = cssWidth * 0.45 + Math.random() * 60;
          s.y = cssHeight * 0.35 + Math.random() * (cssHeight * 0.12);
          s.baseY = s.y;
          s.isGliding = false;
          s.glideTimer = 90 + Math.random() * 60;
        }

        ctx.save();
        const drawX = s.x + parallaxX * (s.depth * 0.25);
        const drawY = s.y + parallaxY * (s.depth * 0.18);
        ctx.translate(drawX, drawY);

        const sz = s.scale;
        const wingBeat = s.isGliding ? 0.08 : Math.sin(s.flapPhase);

        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.strokeStyle = `rgba(240, 245, 250, ${s.opacity})`;

        // Body
        ctx.beginPath();
        ctx.ellipse(0, 0, sz * 0.65, sz * 0.18, -0.05, 0, Math.PI * 2);
        ctx.fill();

        // Neck & Beak
        ctx.beginPath();
        ctx.moveTo(-sz * 0.5, 0);
        ctx.quadraticCurveTo(-sz * 0.9, -sz * 0.08, -sz * 1.3, -sz * 0.02);
        ctx.lineTo(-sz * 1.6, -sz * 0.01);
        ctx.lineTo(-sz * 1.25, sz * 0.04);
        ctx.closePath();
        ctx.fill();

        // Amber Beak
        ctx.fillStyle = `rgba(245, 180, 75, ${s.opacity})`;
        ctx.beginPath();
        ctx.moveTo(-sz * 1.3, -sz * 0.02);
        ctx.lineTo(-sz * 1.6, -sz * 0.01);
        ctx.lineTo(-sz * 1.3, sz * 0.03);
        ctx.closePath();
        ctx.fill();

        // Trailing Legs
        ctx.strokeStyle = `rgba(215, 155, 70, ${s.opacity * 0.8})`;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(sz * 0.5, 0);
        ctx.lineTo(sz * 1.4, sz * 0.08);
        ctx.moveTo(sz * 0.45, sz * 0.04);
        ctx.lineTo(sz * 1.35, sz * 0.14);
        ctx.stroke();

        // Wings
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        const wingSpan = sz * 1.25;
        const wingTipY = wingBeat * wingSpan * 0.9;
        const wingElbowY = wingBeat * wingSpan * 0.45;

        // Foreground Wing
        ctx.beginPath();
        ctx.moveTo(-sz * 0.1, -sz * 0.05);
        ctx.quadraticCurveTo(sz * 0.1, wingElbowY, sz * 0.35, wingTipY);
        ctx.quadraticCurveTo(
          sz * 0.15,
          wingTipY * 0.7 + sz * 0.2,
          sz * 0.3,
          sz * 0.05
        );
        ctx.closePath();
        ctx.fill();

        // Background Wing
        const backTipY = -wingBeat * wingSpan * 0.75;
        const backElbowY = -wingBeat * wingSpan * 0.35;
        ctx.beginPath();
        ctx.moveTo(-sz * 0.15, -sz * 0.08);
        ctx.quadraticCurveTo(-sz * 0.05, backElbowY, sz * 0.15, backTipY);
        ctx.quadraticCurveTo(sz * 0.05, backTipY * 0.6, sz * 0.2, -sz * 0.02);
        ctx.closePath();
        ctx.fill();

        // Dark feather wingtips
        ctx.fillStyle = `rgba(35, 40, 50, ${s.opacity * 0.65})`;
        ctx.beginPath();
        ctx.arc(sz * 0.35, wingTipY, 1.3, 0, Math.PI * 2);
        ctx.fill();

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
          m.x + parallaxX * 0.25,
          m.y + parallaxY * 0.2,
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
  }, [parallaxX, parallaxY]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 w-full h-full"
    />
  );
}
