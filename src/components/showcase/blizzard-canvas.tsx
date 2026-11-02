"use client";

import * as React from "react";

interface BlizzardCanvasProps {
  severity: 1 | 2 | 3;
}

interface Snowflake {
  x: number;
  y: number;
  z: number; // depth layer: 0.2 (distant) to 2.2 (foreground)
  radius: number;
  vx: number;
  vy: number;
  opacity: number;
  wobble: number;
  wobbleSpeed: number;
}

export function BlizzardCanvas({ severity }: BlizzardCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const mouseRef = React.useRef({ x: -1000, y: -1000, vx: 0, lastX: 0 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mouseRef.current.lastX;
      mouseRef.current.vx = dx * 0.15;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.lastX = e.clientX;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize 450 snowflakes with varied 3D z-depth
    const particleCount = severity === 1 ? 260 : severity === 2 ? 420 : 620;
    const particles: Snowflake[] = [];

    for (let i = 0; i < particleCount; i++) {
      const z = Math.random() * 1.8 + 0.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        radius: (Math.random() * 1.8 + 0.6) * z,
        vx: 0,
        vy: 0,
        opacity: Math.random() * 0.6 + 0.25,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.04 + 0.01,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Mouse gust decay
      mouseRef.current.vx *= 0.94;

      // Base wind physics governed by storm severity
      const baseWind = severity === 1 ? 1.5 : severity === 2 ? 5.5 : 12.0;
      const windTurbulence = Math.sin(time * 0.8) * (severity === 3 ? 3.5 : 1.2);
      const totalWind = baseWind + windTurbulence + mouseRef.current.vx;
      const fallSpeedBase = severity === 1 ? 1.8 : severity === 2 ? 3.2 : 5.8;

      ctx.fillStyle = "#ffffff";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.wobble += p.wobbleSpeed;

        // Individual particle movement with depth parallax
        const windX = (totalWind + Math.sin(p.wobble) * 0.8) * p.z;
        const fallY = (fallSpeedBase + Math.cos(p.wobble) * 0.4) * p.z;

        p.x += windX;
        p.y += fallY;

        // Wrap around screen boundaries seamlessly
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;
        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }

        // Severe blizzard renders wind-blown motion blur streaks
        if (severity >= 2 && p.z > 0.8) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity * 0.85})`;
          ctx.lineWidth = p.radius * 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - windX * 2.2, p.y - fallY * 1.5);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [severity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-20 h-full w-full"
    />
  );
}
