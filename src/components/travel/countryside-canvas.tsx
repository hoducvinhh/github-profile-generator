"use client";

import * as React from "react";

// --- Types for Natural Micro-Animations ---

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

    // 1. FLOCK OF WHITE STORKS (ĐÀN CÒ TRẮNG BAY LƯỢN TỰ NHIÊN)
    const STORK_COUNT = 7;
    let storks: Stork[] = [];

    const initStorks = () => {
      storks = Array.from({ length: STORK_COUNT }, (_, i) => {
        const depth = 0.5 + (i / STORK_COUNT) * 0.5;
        const spawnX = cssWidth * 0.52 + i * 42 + Math.random() * 20;
        const spawnY = cssHeight * 0.09 + i * 14 + Math.random() * 15;

        return {
          x: spawnX,
          y: spawnY,
          baseY: spawnY,
          vx: -(0.55 + depth * 0.4),
          vy: 0,
          scale: 8 + depth * 6,
          depth,
          opacity: 0.8 + depth * 0.2,
          flapPhase: Math.random() * Math.PI * 2,
          flapSpeed: 0.065 + Math.random() * 0.02,
          glideTimer: Math.random() * 120 + 80,
          isGliding: false,
        };
      });
    };

    // 2. JUMPING FISH IN THE RIVER (CÁ NHẢY TUNG LÊN MẶT NƯỚC)
    let fish: Fish = {
      active: false,
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
      vx: 0,
      vy: 0,
      gravity: 0.35,
      scale: 1,
      alpha: 1,
      rotation: 0,
    };
    let nextFishTime = 180 + Math.random() * 200; // frames until next fish jump

    // 3. WATER RIPPLES & SPLASHES (GỢN SÓNG VÀ GIỌT NƯỚC BẮN)
    let ripples: WaterRipple[] = [];
    let splashes: SplashParticle[] = [];

    // 4. RIVER SURFACE GLINTS & SUN MOTES
    let glints: RiverGlint[] = Array.from({ length: 20 }, () => ({
      x: cssWidth * (0.34 + Math.random() * 0.45),
      y: cssHeight * (0.63 + Math.random() * 0.32),
      len: 12 + Math.random() * 25,
      speed: 0.025 + Math.random() * 0.03,
      alpha: 0.25 + Math.random() * 0.45,
      phase: Math.random() * Math.PI * 2,
    }));

    let motes: SunMote[] = Array.from({ length: 26 }, () => ({
      x: Math.random() * cssWidth,
      y: Math.random() * cssHeight,
      vx: (Math.random() - 0.3) * 0.25,
      vy: -(0.25 + Math.random() * 0.35),
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
      // 1. WATER RIPPLES & RIVER SHIMMER (GỢN NƯỚC LĂN TĂN)
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
        ctx.strokeStyle = `rgba(255, 240, 190, ${rip.alpha})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        // Perspective squashed ellipse matching river surface angle
        ctx.ellipse(
          rip.x + parallaxX * 0.15,
          rip.y + parallaxY * 0.1,
          rip.radius,
          rip.radius * 0.35,
          0,
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
        p.vy += 0.25; // gravity
        p.alpha *= 0.95;

        if (p.alpha < 0.03) {
          splashes.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = `rgba(255, 250, 220, ${p.alpha})`;
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

      // Ambient river glints
      for (const g of glints) {
        g.phase += g.speed;
        const currentAlpha = Math.max(0, Math.sin(g.phase)) * g.alpha;
        if (currentAlpha > 0.01) {
          ctx.save();
          ctx.strokeStyle = `rgba(255, 240, 185, ${currentAlpha * 0.6})`;
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
      // 2. ROWING BOAT MOVEMENT & WATER WAKE (CON THUYỀN VÀ MÁI CHÈO)
      // =========================================================================
      // The boat is located in the river around (x: 0.72, y: 0.68)
      const boatBaseX = cssWidth * 0.725;
      const boatBaseY = cssHeight * 0.685;

      // Gentle river drift oscillation
      const rowCycle = time * 1.5; // rhythm of the row stroke
      const boatDriftX = Math.sin(time * 0.4) * 8;
      const boatBobY = Math.sin(rowCycle * 2) * 1.6;
      const boatTilt = Math.sin(rowCycle * 2) * 0.025;

      const boatX = boatBaseX + boatDriftX + parallaxX * 0.15;
      const boatY = boatBaseY + boatBobY + parallaxY * 0.1;

      // Emit wake ripples at oar entry moments
      if (Math.sin(rowCycle * 2) > 0.95 && Math.random() < 0.25) {
        ripples.push({
          x: boatX - 25,
          y: boatY + 8,
          radius: 4,
          maxRadius: 28,
          speed: 0.35,
          alpha: 0.45,
        });
        ripples.push({
          x: boatX + 15,
          y: boatY + 12,
          radius: 3,
          maxRadius: 22,
          speed: 0.3,
          alpha: 0.35,
        });
      }

      // Draw subtle rowing oar movement and gentle wake overlay
      ctx.save();
      ctx.translate(boatX, boatY);
      ctx.rotate(boatTilt);

      // Water displacement ripple under the sampan hull
      ctx.strokeStyle = "rgba(255, 240, 200, 0.22)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, 16, 52, 10, -0.05, 0, Math.PI * 2);
      ctx.stroke();

      // Subtle dynamic wooden oar movement (di chuyển nhịp nhàng theo điệu chèo)
      const oarAngle = -0.35 + Math.sin(rowCycle * 2) * 0.25;
      const oarLength = 48;
      const oarPivotX = -6;
      const oarPivotY = 4;
      const oarTipX = oarPivotX - Math.cos(oarAngle) * oarLength;
      const oarTipY = oarPivotY + Math.sin(oarAngle) * oarLength * 0.6;

      // Oar shaft (cán chèo gỗ)
      ctx.strokeStyle = "rgba(70, 48, 28, 0.9)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(oarPivotX + 6, oarPivotY - 8);
      ctx.lineTo(oarTipX, oarTipY);
      ctx.stroke();

      // Oar blade dipping into water (bản chèo)
      ctx.fillStyle = "rgba(85, 55, 32, 0.95)";
      ctx.beginPath();
      ctx.ellipse(oarTipX, oarTipY, 7, 3, oarAngle, 0, Math.PI * 2);
      ctx.fill();

      // Water splash at oar tip when dipping
      if (Math.sin(rowCycle * 2) > 0.4) {
        ctx.fillStyle = "rgba(255, 255, 230, 0.55)";
        ctx.beginPath();
        ctx.arc(oarTipX, oarTipY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // =========================================================================
      // 3. JUMPING FISH MECHANISM (CÁ NHẢY TUNG LÊN MẶT NƯỚC)
      // =========================================================================
      nextFishTime -= 1;
      if (nextFishTime <= 0 && !fish.active) {
        // Spawn fish in open river section (x: 0.38 - 0.58, y: 0.58 - 0.72)
        const spawnX = cssWidth * (0.42 + Math.random() * 0.16);
        const spawnY = cssHeight * (0.62 + Math.random() * 0.1);
        fish = {
          active: true,
          x: spawnX,
          y: spawnY,
          startX: spawnX,
          startY: spawnY,
          vx: (Math.random() - 0.5) * 1.8,
          vy: -(6.5 + Math.random() * 2.5), // Jump impulse
          gravity: 0.32,
          scale: 7 + Math.random() * 4,
          alpha: 1,
          rotation: 0,
        };

        // Emergence ripple & splash
        ripples.push({
          x: spawnX,
          y: spawnY,
          radius: 3,
          maxRadius: 26,
          speed: 0.45,
          alpha: 0.6,
        });

        for (let k = 0; k < 6; k++) {
          splashes.push({
            x: spawnX,
            y: spawnY,
            vx: (Math.random() - 0.5) * 2.5,
            vy: -(1.5 + Math.random() * 2.5),
            radius: 1 + Math.random() * 1.5,
            alpha: 0.8,
          });
        }
      }

      if (fish.active) {
        fish.x += fish.vx;
        fish.y += fish.vy;
        fish.vy += fish.gravity;
        fish.rotation = Math.atan2(fish.vy, fish.vx);

        // Render sleek jumping fish
        ctx.save();
        const fX = fish.x + parallaxX * 0.15;
        const fY = fish.y + parallaxY * 0.1;
        ctx.translate(fX, fY);
        ctx.rotate(fish.rotation);

        const sz = fish.scale;

        // Fish body (silvery golden carp)
        ctx.fillStyle = "rgba(250, 235, 195, 0.95)";
        ctx.strokeStyle = "rgba(180, 130, 60, 0.8)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, sz, sz * 0.38, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Shimmering belly light
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath();
        ctx.ellipse(0, sz * 0.08, sz * 0.7, sz * 0.18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Forked tail fin
        ctx.fillStyle = "rgba(235, 165, 80, 0.85)";
        ctx.beginPath();
        ctx.moveTo(-sz * 0.8, 0);
        ctx.lineTo(-sz * 1.35, -sz * 0.35);
        ctx.lineTo(-sz * 1.05, 0);
        ctx.lineTo(-sz * 1.35, sz * 0.35);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        // Check if fish re-enters the water
        if (fish.vy > 0 && fish.y >= fish.startY) {
          fish.active = false;
          nextFishTime = 240 + Math.random() * 320; // 4 to 9 seconds

          // Re-entry ripple and splash
          ripples.push({
            x: fish.x,
            y: fish.startY,
            radius: 4,
            maxRadius: 36,
            speed: 0.5,
            alpha: 0.7,
          });
          ripples.push({
            x: fish.x,
            y: fish.startY,
            radius: 2,
            maxRadius: 20,
            speed: 0.3,
            alpha: 0.5,
          });

          for (let k = 0; k < 8; k++) {
            splashes.push({
              x: fish.x,
              y: fish.startY,
              vx: (Math.random() - 0.5) * 3,
              vy: -(2 + Math.random() * 3),
              radius: 1 + Math.random() * 1.8,
              alpha: 0.9,
            });
          }
        }
      }

      // =========================================================================
      // 4. CHILDREN FLYING KITE ON RICE PADDY (ĐỨA TRẺ THẢ DIỀU TRÊN ĐỒNG)
      // =========================================================================
      // Dike path location in midground: (x: ~0.56, y: ~0.55)
      const childX = cssWidth * 0.565 + parallaxX * 0.2;
      const childY = cssHeight * 0.555 + parallaxY * 0.15;

      // Flying kite soaring high in the sky: (x: ~0.51, y: ~0.20)
      const kiteSwayX = Math.sin(time * 1.2) * 22;
      const kiteSwayY = Math.cos(time * 0.9) * 14;
      const kiteX = cssWidth * 0.515 + kiteSwayX + parallaxX * 0.3;
      const kiteY = cssHeight * 0.21 + kiteSwayY + parallaxY * 0.2;

      // A. Draw Curved Kite String (Sợi dây diều mảnh uốn lượn trong gió)
      ctx.save();
      ctx.strokeStyle = "rgba(255, 250, 230, 0.45)";
      ctx.lineWidth = 0.85;
      ctx.beginPath();
      ctx.moveTo(childX, childY - 14); // child's raised hand
      // Curved sag control point
      const sagX = (childX + kiteX) * 0.5 + Math.sin(time * 0.8) * 12;
      const sagY = (childY + kiteY) * 0.5 + 24;
      ctx.quadraticCurveTo(sagX, sagY, kiteX, kiteY);
      ctx.stroke();
      ctx.restore();

      // B. Draw The Soaring Diamond Kite (Con Diều Sáo / Diều Đuôi Dài)
      ctx.save();
      ctx.translate(kiteX, kiteY);
      const kiteTilt = Math.sin(time * 1.4) * 0.15;
      ctx.rotate(kiteTilt);

      const kSize = 13; // delicate, small model in the painting

      // Diamond kite frame
      ctx.fillStyle = "rgba(225, 95, 45, 0.92)"; // warm terracotta red
      ctx.strokeStyle = "rgba(245, 205, 110, 0.9)"; // golden bamboo spine
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(0, -kSize * 1.2); // top point
      ctx.lineTo(kSize * 0.85, 0); // right point
      ctx.lineTo(0, kSize * 1.2); // bottom point
      ctx.lineTo(-kSize * 0.85, 0); // left point
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Cross spar
      ctx.beginPath();
      ctx.moveTo(-kSize * 0.85, 0);
      ctx.lineTo(kSize * 0.85, 0);
      ctx.moveTo(0, -kSize * 1.2);
      ctx.lineTo(0, kSize * 1.2);
      ctx.stroke();

      // Flowing tail ribbons (Đuôi diều lượn sóng)
      ctx.strokeStyle = "rgba(255, 220, 120, 0.85)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, kSize * 1.2);

      let prevTx = 0;
      let prevTy = kSize * 1.2;
      for (let s = 1; s <= 5; s++) {
        const segDist = s * 7;
        const waveX = Math.sin(time * 3 - s * 0.6) * (s * 3.5);
        const waveY = prevTy + 6;
        ctx.lineTo(waveX, waveY);
        prevTx = waveX;
        prevTy = waveY;
      }
      ctx.stroke();

      ctx.restore();

      // C. Draw Subtle Children Figures on the Path (Đứa trẻ nông thôn thả diều)
      ctx.save();
      ctx.translate(childX, childY);

      // Child 1 (holding the spool)
      // Legs / pants (quần nâu)
      ctx.fillStyle = "rgba(55, 42, 32, 0.95)";
      ctx.fillRect(-2, 0, 2, 8);
      ctx.fillRect(1, 0, 2, 8);

      // Shirt (áo nâu/áo bà ba)
      ctx.fillStyle = "rgba(165, 85, 45, 0.95)";
      ctx.beginPath();
      ctx.ellipse(0, -5, 4.5, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Raised arm holding kite string
      ctx.strokeStyle = "rgba(195, 135, 90, 0.95)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-2, -7);
      ctx.lineTo(0, -14); // hand raised
      ctx.stroke();

      // Conical hat (nón lá)
      ctx.fillStyle = "rgba(240, 215, 145, 0.95)";
      ctx.beginPath();
      ctx.moveTo(-6, -11);
      ctx.lineTo(0, -16);
      ctx.lineTo(6, -11);
      ctx.closePath();
      ctx.fill();

      // Child 2 (smaller friend standing beside watching)
      const c2OffsetX = 11;
      ctx.fillStyle = "rgba(45, 55, 40, 0.9)";
      ctx.fillRect(c2OffsetX - 1.5, 2, 1.8, 6);
      ctx.fillRect(c2OffsetX + 1, 2, 1.8, 6);

      // Shirt
      ctx.fillStyle = "rgba(135, 110, 75, 0.95)";
      ctx.beginPath();
      ctx.ellipse(c2OffsetX, -3, 3.8, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Small hat
      ctx.fillStyle = "rgba(240, 215, 145, 0.95)";
      ctx.beginPath();
      ctx.moveTo(c2OffsetX - 5, -8);
      ctx.lineTo(c2OffsetX, -12);
      ctx.lineTo(c2OffsetX + 5, -8);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // =========================================================================
      // 5. REALISTIC FLYING WHITE STORKS (ĐÀN CÒ TRẮNG)
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
          s.vy = Math.cos(s.flapPhase) * 0.22;
        } else {
          s.flapPhase = Math.sin(s.flapPhase) * 0.1;
          s.vy = 0.04;
        }

        s.y += s.vy;

        if (s.x < -80) {
          s.x = cssWidth + 60 + Math.random() * 80;
          s.y = cssHeight * 0.08 + Math.random() * (cssHeight * 0.25);
          s.baseY = s.y;
          s.isGliding = false;
          s.glideTimer = 100 + Math.random() * 60;
        }

        ctx.save();
        const drawX = s.x + parallaxX * (s.depth * 0.3);
        const drawY = s.y + parallaxY * (s.depth * 0.2);
        ctx.translate(drawX, drawY);

        const sz = s.scale;
        const wingBeat = s.isGliding ? 0.08 : Math.sin(s.flapPhase);

        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.strokeStyle = `rgba(240, 245, 250, ${s.opacity})`;

        // Slender Body
        ctx.beginPath();
        ctx.ellipse(0, 0, sz * 0.65, sz * 0.18, -0.05, 0, Math.PI * 2);
        ctx.fill();

        // Graceful Long Neck & Beak
        ctx.beginPath();
        ctx.moveTo(-sz * 0.5, 0);
        ctx.quadraticCurveTo(-sz * 0.9, -sz * 0.08, -sz * 1.3, -sz * 0.02);
        ctx.lineTo(-sz * 1.65, -sz * 0.01);
        ctx.lineTo(-sz * 1.25, sz * 0.04);
        ctx.closePath();
        ctx.fill();

        // Amber Beak Accent
        ctx.fillStyle = `rgba(245, 180, 75, ${s.opacity})`;
        ctx.beginPath();
        ctx.moveTo(-sz * 1.3, -sz * 0.02);
        ctx.lineTo(-sz * 1.65, -sz * 0.01);
        ctx.lineTo(-sz * 1.3, sz * 0.03);
        ctx.closePath();
        ctx.fill();

        // Trailing Legs
        ctx.strokeStyle = `rgba(215, 155, 70, ${s.opacity * 0.8})`;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(sz * 0.5, 0);
        ctx.lineTo(sz * 1.45, sz * 0.08);
        ctx.moveTo(sz * 0.45, sz * 0.04);
        ctx.lineTo(sz * 1.4, sz * 0.14);
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

        // Dark wingtip feathers
        ctx.fillStyle = `rgba(35, 40, 50, ${s.opacity * 0.65})`;
        ctx.beginPath();
        ctx.arc(sz * 0.35, wingTipY, 1.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // =========================================================================
      // 6. GOLDEN SUNLIGHT MOTES (BỤI NẮNG MAI)
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
