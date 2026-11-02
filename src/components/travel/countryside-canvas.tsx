"use client";

import * as React from "react";

interface Stork {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  flap: number;
  flapSpeed: number;
  altitudeOffset: number;
  opacity: number;
}

interface SunMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulseSpeed: number;
}

interface RiverRipple {
  x: number;
  y: number;
  width: number;
  speed: number;
  phase: number;
  alpha: number;
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
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initElements();
    };

    window.addEventListener("resize", handleResize);

    // 1. Initialize Flocks of White Storks (Cánh cò trắng)
    let storks: Stork[] = [];
    const STORK_COUNT = 7;

    // 2. Initialize Golden Sunlight Pollen / Motes
    let motes: SunMote[] = [];
    const MOTE_COUNT = 35;

    // 3. Initialize River Shimmer Ripples
    let ripples: RiverRipple[] = [];
    const RIPPLE_COUNT = 24;

    const initElements = () => {
      // Storks flying across the sky (upper 45% of viewport)
      storks = Array.from({ length: STORK_COUNT }, (_, i) => ({
        x: width * 0.45 + (i * 35) + Math.random() * 20,
        y: height * 0.12 + (i * 18) + Math.random() * 15,
        vx: -(0.5 + Math.random() * 0.4),
        vy: (Math.random() - 0.5) * 0.15,
        size: 9 + Math.random() * 6,
        flap: Math.random() * Math.PI * 2,
        flapSpeed: 0.08 + Math.random() * 0.04,
        altitudeOffset: Math.random() * 100,
        opacity: 0.85 + Math.random() * 0.15,
      }));

      // Golden motes floating in sunbeams
      motes = Array.from({ length: MOTE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.3) * 0.4,
        vy: -(0.3 + Math.random() * 0.5),
        radius: 1 + Math.random() * 2,
        alpha: 0.2 + Math.random() * 0.6,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      }));

      // River surface ripples (concentrated in river area: lower half)
      ripples = Array.from({ length: RIPPLE_COUNT }, () => ({
        x: width * (0.28 + Math.random() * 0.45),
        y: height * (0.55 + Math.random() * 0.4),
        width: 14 + Math.random() * 32,
        speed: 0.03 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.3 + Math.random() * 0.45,
      }));
    };

    initElements();

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      // --- 1. RENDER RIVER SHIMMER (Golden Morning Reflections) ---
      for (const r of ripples) {
        r.phase += r.speed;
        const currentAlpha = Math.max(0, Math.sin(r.phase)) * r.alpha;
        const currentWidth = r.width * (0.8 + 0.4 * Math.sin(r.phase * 0.7));

        ctx.save();
        ctx.strokeStyle = `rgba(255, 230, 160, ${currentAlpha * 0.5})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        // Gentle wave arc
        ctx.ellipse(
          r.x + parallaxX * 0.3,
          r.y + parallaxY * 0.2,
          currentWidth,
          1.8,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();
      }

      // --- 2. RENDER GOLDEN MOTES IN SUNBEAMS ---
      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        m.alpha += Math.sin(time * 2) * m.pulseSpeed;

        if (m.y < 0) {
          m.y = height + 10;
          m.x = Math.random() * width;
        }
        if (m.x < 0) m.x = width;
        if (m.x > width) m.x = 0;

        ctx.save();
        ctx.fillStyle = `rgba(254, 240, 180, ${Math.abs(m.alpha)})`;
        ctx.beginPath();
        ctx.arc(
          m.x + parallaxX * 0.5,
          m.y + parallaxY * 0.4,
          m.radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      }

      // --- 3. RENDER FLYING WHITE STORKS (Cánh Cò Trắng) ---
      for (const s of storks) {
        s.flap += s.flapSpeed;
        s.x += s.vx;
        // Undulating flight trajectory
        s.y += s.vy + Math.sin(time + s.altitudeOffset) * 0.25;

        // Reset if offscreen to the left
        if (s.x < -60) {
          s.x = width + 50 + Math.random() * 80;
          s.y = height * 0.12 + Math.random() * (height * 0.25);
        }

        ctx.save();
        ctx.translate(s.x + parallaxX * 0.2, s.y + parallaxY * 0.15);

        // Wing flap angle (-0.6 to 0.7)
        const wingFlap = Math.sin(s.flap);
        const wingSpan = s.size;
        const bodyLength = s.size * 0.7;

        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.strokeStyle = `rgba(235, 240, 245, ${s.opacity})`;
        ctx.lineWidth = 1.2;

        // Draw bird body
        ctx.beginPath();
        ctx.ellipse(0, 0, bodyLength, bodyLength * 0.28, -0.08, 0, Math.PI * 2);
        ctx.fill();

        // Draw left wing
        ctx.beginPath();
        ctx.moveTo(-bodyLength * 0.2, 0);
        ctx.quadraticCurveTo(
          -bodyLength * 0.1,
          wingFlap * wingSpan * 0.9,
          wingSpan * 0.9,
          wingFlap * wingSpan * 1.2
        );
        ctx.quadraticCurveTo(
          0,
          wingFlap * wingSpan * 0.4,
          bodyLength * 0.2,
          0
        );
        ctx.fill();

        // Draw right wing
        ctx.beginPath();
        ctx.moveTo(-bodyLength * 0.2, 0);
        ctx.quadraticCurveTo(
          -bodyLength * 0.3,
          -wingFlap * wingSpan * 0.8,
          -wingSpan * 0.8,
          -wingFlap * wingSpan * 1.1
        );
        ctx.quadraticCurveTo(
          -bodyLength * 0.1,
          -wingFlap * wingSpan * 0.3,
          bodyLength * 0.1,
          0
        );
        ctx.fill();

        // Subtle dark wingtip feather tips
        ctx.fillStyle = "rgba(40, 45, 55, 0.55)";
        ctx.beginPath();
        ctx.arc(wingSpan * 0.85, wingFlap * wingSpan * 1.15, 1.2, 0, Math.PI * 2);
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

