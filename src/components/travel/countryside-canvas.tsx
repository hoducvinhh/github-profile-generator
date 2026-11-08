"use client";

import * as React from "react";

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

interface RiverPoint {
  x: number;
  y: number;
  w: number;
}

interface Streamlet {
  t: number;
  speed: number;
  lateral: number;
  length: number;
  alpha: number;
  colorType: number;
}

interface SunMote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface CountrysideCanvasProps {
  parallaxX?: number;
  parallaxY?: number;
  className?: string;
}

export function CountrysideCanvas({
  parallaxX = 0,
  parallaxY = 0,
  className = "",
}: CountrysideCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      // Draw static graceful frame and exit
      return;
    }

    let isVisible = true;
    let isIntersecting = true;
    let animationFrameId: number;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Resize handler
    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const isMobile = window.innerWidth < 768;

    // 1. Storks: 3-5 elegant white silhouettes
    const storkCount = isMobile ? 3 : 4;
    const storks: Stork[] = [];
    for (let i = 0; i < storkCount; i++) {
      storks.push({
        x: width * 0.3 + (i * width) / (storkCount + 1),
        y: height * (0.2 + i * 0.12),
        baseY: height * (0.2 + i * 0.12),
        vx: -(0.55 + Math.random() * 0.35),
        vy: 0,
        scale: 0.65 + i * 0.15,
        depth: 0.35 + i * 0.15,
        opacity: 0.75 + i * 0.08,
        flapPhase: i * 1.5,
        flapSpeed: 0.045 + Math.random() * 0.02,
        glideTimer: Math.random() * 180,
        isGliding: false,
      });
    }

    // 2. River spline points (Ngo Dong River S-curve topography)
    const riverPoints: RiverPoint[] = [
      { x: 0.32, y: 0.58, w: 14 },
      { x: 0.38, y: 0.62, w: 22 },
      { x: 0.46, y: 0.65, w: 32 },
      { x: 0.55, y: 0.69, w: 42 },
      { x: 0.63, y: 0.74, w: 56 },
      { x: 0.70, y: 0.81, w: 72 },
      { x: 0.76, y: 0.90, w: 90 },
      { x: 0.82, y: 1.02, w: 110 },
    ];

    function getSplinePoint(t: number): { x: number; y: number; w: number } {
      const p = riverPoints;
      const n = p.length - 1;
      const idx = Math.min(Math.floor(t * n), n - 1);
      const segT = t * n - idx;

      const p0 = p[Math.max(0, idx - 1)];
      const p1 = p[idx];
      const p2 = p[Math.min(n, idx + 1)];
      const p3 = p[Math.min(n, idx + 2)];

      const t2 = segT * segT;
      const t3 = t2 * segT;

      const cx =
        0.5 *
        (2 * p1.x +
          (-p0.x + p2.x) * segT +
          (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
          (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
      const cy =
        0.5 *
        (2 * p1.y +
          (-p0.y + p2.y) * segT +
          (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
          (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
      const cw = p1.w + (p2.w - p1.w) * segT;

      return { x: cx, y: cy, w: cw };
    }

    // 16 gentle streamlets
    const streamletCount = isMobile ? 10 : 16;
    const streamlets: Streamlet[] = [];
    for (let i = 0; i < streamletCount; i++) {
      streamlets.push({
        t: Math.random(),
        speed: 0.0006 + Math.random() * 0.0004,
        lateral: (Math.random() - 0.5) * 0.7,
        length: 0.03 + Math.random() * 0.02,
        alpha: 0.25 + Math.random() * 0.35,
        colorType: Math.random() > 0.4 ? 0 : 1, // 0 = warm gold, 1 = emerald
      });
    }

    // 3. Sun motes: 10-15 particles
    const moteCount = isMobile ? 8 : 14;
    const sunMotes: SunMote[] = [];
    for (let i = 0; i < moteCount; i++) {
      sunMotes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.15 - Math.random() * 0.25,
        radius: 1.2 + Math.random() * 1.8,
        baseAlpha: 0.25 + Math.random() * 0.35,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
      });
    }

    // Visibility handlers (pause on hidden/offscreen)
    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Smooth Lerp parallax
    let curParallaxX = 0;
    let curParallaxY = 0;

    // Render loop
    const render = () => {
      if (!isVisible || !isIntersecting) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      curParallaxX += (parallaxX - curParallaxX) * 0.08;
      curParallaxY += (parallaxY - curParallaxY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // --- A. Draw River Streamlets ---
      ctx.save();
      for (let i = 0; i < streamlets.length; i++) {
        const s = streamlets[i];
        s.t += s.speed;
        if (s.t > 1) {
          s.t = 0;
          s.lateral = (Math.random() - 0.5) * 0.7;
        }

        const pStart = getSplinePoint(s.t);
        const pEnd = getSplinePoint(Math.min(s.t + s.length, 1));

        const sx = pStart.x * width + s.lateral * pStart.w + curParallaxX * 0.2;
        const sy = pStart.y * height + curParallaxY * 0.2;
        const ex = pEnd.x * width + s.lateral * pEnd.w + curParallaxX * 0.2;
        const ey = pEnd.y * height + curParallaxY * 0.2;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);

        if (s.colorType === 0) {
          ctx.strokeStyle = `rgba(252, 211, 77, ${s.alpha})`; // Golden amber
        } else {
          ctx.strokeStyle = `rgba(110, 231, 183, ${s.alpha})`; // Soft emerald
        }
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();

      // --- B. Draw Storks ---
      ctx.save();
      for (let i = 0; i < storks.length; i++) {
        const st = storks[i];

        // Motion update
        st.x += st.vx;
        st.flapPhase += st.flapSpeed;

        st.glideTimer++;
        if (st.glideTimer > 240) {
          st.isGliding = !st.isGliding;
          st.glideTimer = 0;
        }

        const wingAngle = st.isGliding
          ? 0.08
          : Math.sin(st.flapPhase) * 0.55;

        // Wrap around horizon
        if (st.x < -60) {
          st.x = width + 60;
          st.y = st.baseY + (Math.random() - 0.5) * 40;
        }

        const sx = st.x + curParallaxX * st.depth;
        const sy = st.y + curParallaxY * st.depth;

        // Draw elegant stork silhouette
        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(st.scale, st.scale);

        // Facing left
        ctx.fillStyle = `rgba(248, 250, 252, ${st.opacity})`;

        // Body
        ctx.beginPath();
        ctx.ellipse(0, 0, 14, 4.5, -0.08, 0, Math.PI * 2);
        ctx.fill();

        // Neck & Head
        ctx.beginPath();
        ctx.moveTo(-10, -1);
        ctx.quadraticCurveTo(-18, -4, -22, -8);
        ctx.lineTo(-21, -6);
        ctx.quadraticCurveTo(-16, -1, -8, 1);
        ctx.fill();

        // Bill (Amber gold touch)
        ctx.fillStyle = `rgba(251, 191, 36, ${st.opacity})`;
        ctx.beginPath();
        ctx.moveTo(-22, -8);
        ctx.lineTo(-29, -9);
        ctx.lineTo(-21, -6);
        ctx.fill();

        // Tail feathers
        ctx.fillStyle = `rgba(248, 250, 252, ${st.opacity})`;
        ctx.beginPath();
        ctx.moveTo(12, -1);
        ctx.lineTo(20, 2);
        ctx.lineTo(13, 2.5);
        ctx.fill();

        // Elegant arched wings
        ctx.strokeStyle = `rgba(248, 250, 252, ${st.opacity})`;
        ctx.fillStyle = `rgba(248, 250, 252, ${st.opacity * 0.9})`;
        ctx.lineWidth = 1.5;

        // Near wing
        ctx.beginPath();
        ctx.moveTo(-3, -2);
        ctx.quadraticCurveTo(
          2,
          -18 * Math.cos(wingAngle),
          16,
          -22 * Math.cos(wingAngle)
        );
        ctx.quadraticCurveTo(8, -6, 4, 0);
        ctx.fill();

        // Primary wing tips (charcoal edge)
        ctx.fillStyle = `rgba(15, 23, 42, ${st.opacity * 0.75})`;
        ctx.beginPath();
        ctx.moveTo(12, -18 * Math.cos(wingAngle));
        ctx.lineTo(16, -22 * Math.cos(wingAngle));
        ctx.lineTo(14, -14 * Math.cos(wingAngle));
        ctx.fill();

        ctx.restore();
      }
      ctx.restore();

      // --- C. Draw Subtle Sun Motes ---
      ctx.save();
      for (let i = 0; i < sunMotes.length; i++) {
        const m = sunMotes[i];
        m.x += m.vx;
        m.y += m.vy;
        m.pulsePhase += m.pulseSpeed;

        if (m.y < -10) {
          m.y = height + 10;
          m.x = Math.random() * width;
        }

        const alpha = m.baseAlpha * (0.6 + 0.4 * Math.sin(m.pulsePhase));
        const mx = m.x + curParallaxX * 0.4;
        const my = m.y + curParallaxY * 0.4;

        ctx.beginPath();
        ctx.arc(mx, my, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(253, 230, 138, ${alpha})`;
        ctx.fill();
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer.disconnect();
    };
  }, [parallaxX, parallaxY]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 z-10 overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
