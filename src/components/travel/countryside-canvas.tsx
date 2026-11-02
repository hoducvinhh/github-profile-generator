"use client";

import * as React from "react";

interface Stork {
  x: number;
  y: number;
  vx: number;
  vy: number;
  scale: number;
  depth: number; // 0.4 (far away) to 1.0 (closer)
  opacity: number;
  flapPhase: number;
  flapSpeed: number;
  glideTimer: number; // countdown for gliding
  isGliding: boolean;
  baseY: number;
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

    // 1. Initialize Realistic Flying Storks (Đàn Cò Trắng Bay Lượn Tự Nhiên)
    // Structured in a graceful staggered flight formation
    const STORK_COUNT = 8;
    let storks: Stork[] = [];

    const initStorks = () => {
      storks = Array.from({ length: STORK_COUNT }, (_, i) => {
        const depth = 0.45 + (i / STORK_COUNT) * 0.55; // Multi-layer depth
        const spawnX = cssWidth * 0.55 + i * 45 + Math.random() * 20;
        const spawnY = cssHeight * 0.08 + i * 16 + Math.random() * 20;

        return {
          x: spawnX,
          y: spawnY,
          baseY: spawnY,
          vx: -(0.55 + depth * 0.45), // Distant storks fly slower
          vy: 0,
          scale: (8 + depth * 7),
          depth,
          opacity: 0.75 + depth * 0.25,
          flapPhase: Math.random() * Math.PI * 2,
          flapSpeed: 0.065 + Math.random() * 0.02, // Majestic, slow wingbeat (~1.5/s)
          glideTimer: Math.random() * 120 + 80,
          isGliding: false,
        };
      });
    };

    // 2. Initialize Golden Sunlight Pollen / Motes
    let motes: SunMote[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * cssWidth,
      y: Math.random() * cssHeight,
      vx: (Math.random() - 0.3) * 0.3,
      vy: -(0.25 + Math.random() * 0.4),
      radius: 1 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.5,
      pulse: Math.random() * Math.PI * 2,
    }));

    // 3. Initialize River Water Light Glints (Ánh nước sông lăn tăn)
    let glints: RiverGlint[] = Array.from({ length: 22 }, () => ({
      x: cssWidth * (0.32 + Math.random() * 0.45),
      y: cssHeight * (0.62 + Math.random() * 0.35),
      len: 12 + Math.random() * 28,
      speed: 0.025 + Math.random() * 0.03,
      alpha: 0.25 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
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

      // --- 1. RENDER RIVER SURFACE GLINTS ---
      for (const g of glints) {
        g.phase += g.speed;
        const currentAlpha = Math.max(0, Math.sin(g.phase)) * g.alpha;
        if (currentAlpha > 0.01) {
          ctx.save();
          ctx.strokeStyle = `rgba(255, 235, 175, ${currentAlpha * 0.6})`;
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

      // --- 2. RENDER SUNLIGHT MOTES ---
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

      // --- 3. RENDER REALISTIC FLYING WHITE STORKS (Cánh Cò Đích Thực) ---
      for (const s of storks) {
        // Flight movement
        s.x += s.vx;

        // Glide vs Flap State Machine
        s.glideTimer -= 1;
        if (s.glideTimer <= 0) {
          s.isGliding = !s.isGliding;
          // Flap for 140-200 frames, glide for 90-150 frames
          s.glideTimer = s.isGliding
            ? 80 + Math.random() * 80
            : 130 + Math.random() * 100;
        }

        if (!s.isGliding) {
          s.flapPhase += s.flapSpeed;
          // Downstroke gives upward lift; upstroke loses slight lift
          const lift = Math.cos(s.flapPhase) * 0.22;
          s.vy = lift;
        } else {
          // Slow graceful descent during glide
          s.flapPhase = Math.sin(s.flapPhase) * 0.12; // wings gently held flat
          s.vy = 0.05;
        }

        s.y += s.vy;

        // Respawn when crossing off the left edge
        if (s.x < -80) {
          s.x = cssWidth + 60 + Math.random() * 80;
          s.y = cssHeight * 0.08 + Math.random() * (cssHeight * 0.26);
          s.baseY = s.y;
          s.isGliding = false;
          s.glideTimer = 100 + Math.random() * 60;
        }

        // Draw Anatomical Stork Silhouette
        ctx.save();
        const drawX = s.x + parallaxX * (s.depth * 0.3);
        const drawY = s.y + parallaxY * (s.depth * 0.2);
        ctx.translate(drawX, drawY);

        const sz = s.scale;
        const wingBeat = s.isGliding ? 0.08 : Math.sin(s.flapPhase);

        // Facing direction: flying toward left
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.strokeStyle = `rgba(240, 245, 250, ${s.opacity})`;

        // --- A. Slender Body & Tail ---
        ctx.beginPath();
        ctx.ellipse(0, 0, sz * 0.65, sz * 0.18, -0.05, 0, Math.PI * 2);
        ctx.fill();

        // --- B. Graceful Long Neck & Pointed Beak (Stretched forward-left) ---
        ctx.beginPath();
        ctx.moveTo(-sz * 0.5, 0);
        ctx.quadraticCurveTo(-sz * 0.9, -sz * 0.08, -sz * 1.3, -sz * 0.02); // neck
        ctx.lineTo(-sz * 1.65, -sz * 0.01); // sharp yellow-orange beak tip
        ctx.lineTo(-sz * 1.25, sz * 0.04);
        ctx.closePath();
        ctx.fill();

        // Amber beak accent
        ctx.fillStyle = `rgba(245, 180, 75, ${s.opacity})`;
        ctx.beginPath();
        ctx.moveTo(-sz * 1.3, -sz * 0.02);
        ctx.lineTo(-sz * 1.65, -sz * 0.01);
        ctx.lineTo(-sz * 1.3, sz * 0.03);
        ctx.closePath();
        ctx.fill();

        // --- C. Trailing Slender Legs (Stretched back behind tail) ---
        ctx.strokeStyle = `rgba(215, 155, 70, ${s.opacity * 0.8})`;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(sz * 0.5, 0);
        ctx.lineTo(sz * 1.45, sz * 0.08); // leg 1
        ctx.moveTo(sz * 0.45, sz * 0.04);
        ctx.lineTo(sz * 1.4, sz * 0.14); // leg 2
        ctx.stroke();

        // --- D. Articulated Wings with Primary Feathers ---
        // Left Wing (Foreground wing)
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        const wingSpan = sz * 1.25;
        const wingTipY = wingBeat * wingSpan * 0.9;
        const wingElbowY = wingBeat * wingSpan * 0.45;

        ctx.beginPath();
        ctx.moveTo(-sz * 0.1, -sz * 0.05); // shoulder
        ctx.quadraticCurveTo(
          sz * 0.1,
          wingElbowY,
          sz * 0.35,
          wingTipY
        ); // leading wing edge to tip
        ctx.quadraticCurveTo(
          sz * 0.15,
          wingTipY * 0.7 + sz * 0.2,
          sz * 0.3,
          sz * 0.05
        ); // trailing wing edge back to body
        ctx.closePath();
        ctx.fill();

        // Right Wing (Background wing)
        const backTipY = -wingBeat * wingSpan * 0.75;
        const backElbowY = -wingBeat * wingSpan * 0.35;
        ctx.beginPath();
        ctx.moveTo(-sz * 0.15, -sz * 0.08);
        ctx.quadraticCurveTo(
          -sz * 0.05,
          backElbowY,
          sz * 0.15,
          backTipY
        );
        ctx.quadraticCurveTo(
          sz * 0.05,
          backTipY * 0.6,
          sz * 0.2,
          -sz * 0.02
        );
        ctx.closePath();
        ctx.fill();

        // Dark wingtip feather accents (cò trắng có chót cánh đen sẫm)
        ctx.fillStyle = `rgba(35, 40, 50, ${s.opacity * 0.65})`;
        ctx.beginPath();
        ctx.arc(sz * 0.35, wingTipY, 1.4, 0, Math.PI * 2);
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
