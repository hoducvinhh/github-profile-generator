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
        const drawX = s.x + pX * (s.depth * 0.25);
        const drawY = s.y + pY * (s.depth * 0.18);
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
