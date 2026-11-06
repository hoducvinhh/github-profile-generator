"use client";

import * as React from "react";
import Link from "next/link";
import {
  PixelResolution,
  PaletteType,
} from "./pixel-canvas";
import { chiptunePastoralAudio } from "@/lib/audio/chiptune-pastoral-synthesizer";
import {
  Volume2,
  VolumeX,
  Tv,
  Grid,
  Sparkles,
  Download,
  Video,
  ArrowLeft,
  Sliders,
  Check,
  Play,
  RotateCcw,
} from "lucide-react";

interface PixelControlsProps {
  resolution: PixelResolution;
  setResolution: (r: PixelResolution) => void;
  palette: PaletteType;
  setPalette: (p: PaletteType) => void;
  dithering: boolean;
  setDithering: (d: boolean | ((prev: boolean) => boolean)) => void;
  crtEffect: boolean;
  setCrtEffect: (c: boolean | ((prev: boolean) => boolean)) => void;
  pixelGrid: boolean;
  setPixelGrid: (g: boolean | ((prev: boolean) => boolean)) => void;
  animateWater: boolean;
  setAnimateWater: (a: boolean | ((prev: boolean) => boolean)) => void;
  animateStorks: boolean;
  setAnimateStorks: (a: boolean | ((prev: boolean) => boolean)) => void;
  animateSmoke: boolean;
  setAnimateSmoke: (a: boolean | ((prev: boolean) => boolean)) => void;
  animateGodRays: boolean;
  setAnimateGodRays: (a: boolean | ((prev: boolean) => boolean)) => void;
  fps: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function PixelControls({
  resolution,
  setResolution,
  palette,
  setPalette,
  dithering,
  setDithering,
  crtEffect,
  setCrtEffect,
  pixelGrid,
  setPixelGrid,
  animateWater,
  setAnimateWater,
  animateStorks,
  setAnimateStorks,
  animateSmoke,
  setAnimateSmoke,
  animateGodRays,
  setAnimateGodRays,
  fps,
  canvasRef,
}: PixelControlsProps) {
  const [audioEnabled, setAudioEnabled] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordProgress, setRecordProgress] = React.useState(0);
  const [showSettings, setShowSettings] = React.useState(true);

  const toggleAudio = () => {
    if (!chiptunePastoralAudio) return;
    if (audioEnabled) {
      chiptunePastoralAudio.stop();
      setAudioEnabled(false);
    } else {
      chiptunePastoralAudio.start();
      setAudioEnabled(true);
    }
  };

  // Download high-resolution pixel art snapshot
  const takeSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `vietnam-countryside-pixel-${resolution}-${palette}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Record 5-second 60 FPS pixel video directly in browser
  const recordVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRecording) return;

    try {
      // Capture stream from canvas
      const canvasWithStream = canvas as HTMLCanvasElement & {
        captureStream?: (fps?: number) => MediaStream;
      };
      if (!canvasWithStream.captureStream) {
        alert("Trình duyệt của bạn không hỗ trợ tính năng quay video trực tiếp từ Canvas");
        return;
      }

      const stream: MediaStream = canvasWithStream.captureStream(60);
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";

      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 6000000 });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `vietnam-pixel-countryside-${resolution}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecording(false);
        setRecordProgress(0);
      };

      recorder.start();
      setIsRecording(true);
      setRecordProgress(0);

      const duration = 5000;
      const step = 100;
      let elapsed = 0;

      const interval = setInterval(() => {
        elapsed += step;
        setRecordProgress(Math.min(100, Math.round((elapsed / duration) * 100)));
        if (elapsed >= duration) {
          clearInterval(interval);
          recorder.stop();
        }
      }, step);
    } catch (err) {
      console.error("Recording error:", err);
      alert("Trình duyệt không hỗ trợ MediaRecorder captureStream");
      setIsRecording(false);
    }
  };

  return (
    <>
      {/* Top Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-black/75 backdrop-blur-md select-none font-mono text-xs">
        {/* Left: Brand & Return */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
            title="Quay lại ProfileForge"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">HOME</span>
          </Link>

          <div className="h-3.5 w-[1px] bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wider text-amber-400">
              VIỆT NAM · PIXEL ART
            </span>
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 font-bold hidden sm:inline-block">
              {fps} FPS
            </span>
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded border border-amber-500/40 bg-amber-950/60 text-amber-300 font-bold hidden md:inline-block">
              VIRTUAL {resolution}
            </span>
          </div>
        </div>

        {/* Center: Quick Palette Pills */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full border border-white/10 bg-zinc-950/70">
          {(
            [
              { id: "snes", name: "ĐỒNG QUÊ 16-BIT" },
              { id: "sunset", name: "HOÀNG HÔN LOFI" },
              { id: "gameboy", name: "GAMEBOY 4-COLOR" },
              { id: "pico8", name: "PICO-8" },
              { id: "cyberpunk", name: "CYBERPUNK" },
            ] as const
          ).map((p) => (
            <button
              key={p.id}
              onClick={() => setPalette(p.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                palette === p.id
                  ? "bg-amber-400 text-stone-950 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Right: Audio Toggle, Record & Settings */}
        <div className="flex items-center gap-2">
          {/* Chiptune Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`h-8 px-3 rounded-full border flex items-center gap-1.5 transition-colors cursor-pointer text-xs ${
              audioEnabled
                ? "border-amber-400 bg-amber-400 text-stone-950 font-bold shadow"
                : "border-white/20 bg-zinc-900/80 text-zinc-300 hover:text-white"
            }`}
            title="Bật/Tắt âm thanh Chiptune 8-bit đồng quê"
          >
            {audioEnabled ? (
              <>
                <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                <span className="hidden sm:inline">CHIPTUNE: BẬT</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">NHẠC 8-BIT 🌾</span>
              </>
            )}
          </button>

          {/* Snapshot Button */}
          <button
            onClick={takeSnapshot}
            className="h-8 px-3 rounded-full border border-white/20 bg-zinc-900/80 text-zinc-200 hover:text-white hover:border-white/40 flex items-center gap-1.5 cursor-pointer text-xs"
            title="Tải ảnh Pixel Art PNG"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">ẢNH PNG</span>
          </button>

          {/* Record Video Button */}
          <button
            onClick={recordVideo}
            disabled={isRecording}
            className={`h-8 px-3.5 rounded-full font-bold flex items-center gap-1.5 text-xs transition-all shadow cursor-pointer ${
              isRecording
                ? "bg-red-500 text-white animate-pulse border border-red-400"
                : "bg-emerald-500 text-stone-950 hover:bg-emerald-400 border border-emerald-400"
            }`}
            title="Quay video WebM 60 FPS trực tiếp"
          >
            <Video className="h-3.5 w-3.5" />
            <span>{isRecording ? `QUAY: ${recordProgress}%` : "XUẤT VIDEO"}</span>
          </button>

          {/* Toggle Settings Drawer */}
          <button
            onClick={() => setShowSettings((prev) => !prev)}
            className={`h-8 w-8 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              showSettings
                ? "border-amber-400 bg-amber-400 text-stone-950"
                : "border-white/20 bg-zinc-900/80 text-zinc-300 hover:text-white"
            }`}
            title="Bảng điều khiển thông số thuật toán"
          >
            <Sliders className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Floating Algorithmic Settings HUD (Bottom-Right or Collapsed) */}
      {showSettings && (
        <div className="fixed bottom-4 right-4 z-30 max-w-sm w-full bg-black/85 border border-white/15 backdrop-blur-md rounded-2xl p-4 text-xs font-mono text-zinc-200 shadow-2xl space-y-3.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="font-bold uppercase tracking-wider text-white">
                BỘ ĐIỀU KHIỂN THUẬT TOÁN
              </span>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="text-zinc-400 hover:text-white text-xs cursor-pointer px-1"
            >
              ✕
            </button>
          </div>

          {/* 1. Resolution / Pixel Grid Size */}
          <div>
            <label className="text-[11px] text-zinc-400 uppercase tracking-widest block mb-1.5 font-bold">
              ĐỘ PHÂN GIẢI PIXEL VIRTUAL
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: "160x90", name: "8-BIT NES (160×90)" },
                  { id: "240x135", name: "16-BIT GBA (240×135)" },
                  { id: "320x180", name: "16-BIT SNES (320×180)" },
                  { id: "480x270", name: "32-BIT ARCADE (480×270)" },
                ] as const
              ).map((r) => (
                <button
                  key={r.id}
                  onClick={() => setResolution(r.id)}
                  className={`px-2 py-1.5 rounded-lg border text-left text-[10px] tracking-wide transition-all cursor-pointer ${
                    resolution === r.id
                      ? "border-amber-400 bg-amber-400/20 text-amber-300 font-bold"
                      : "border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Visual Effects & Retro Shaders */}
          <div>
            <label className="text-[11px] text-zinc-400 uppercase tracking-widest block mb-1.5 font-bold">
              HIỆU ỨNG THỊ GIÁC & RETRO
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setDithering((v) => !v)}
                className={`px-2 py-1.5 rounded-lg border text-center text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                  dithering
                    ? "border-amber-400 bg-amber-400/20 text-amber-300"
                    : "border-white/10 bg-zinc-900/60 text-zinc-400"
                }`}
              >
                DITHER 4×4 {dithering ? "✓" : ""}
              </button>

              <button
                onClick={() => setCrtEffect((v) => !v)}
                className={`px-2 py-1.5 rounded-lg border text-center text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                  crtEffect
                    ? "border-amber-400 bg-amber-400/20 text-amber-300"
                    : "border-white/10 bg-zinc-900/60 text-zinc-400"
                }`}
              >
                CRT SCANLINE {crtEffect ? "✓" : ""}
              </button>

              <button
                onClick={() => setPixelGrid((v) => !v)}
                className={`px-2 py-1.5 rounded-lg border text-center text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                  pixelGrid
                    ? "border-amber-400 bg-amber-400/20 text-amber-300"
                    : "border-white/10 bg-zinc-900/60 text-zinc-400"
                }`}
              >
                LƯỚI Ô PIXEL {pixelGrid ? "✓" : ""}
              </button>
            </div>
          </div>

          {/* 3. Micro-Animations Toggle */}
          <div>
            <label className="text-[11px] text-zinc-400 uppercase tracking-widest block mb-1.5 font-bold">
              HOẠT HỌA 60 FPS (ANIMATIONS)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setAnimateWater((v) => !v)}
                className={`px-2 py-1 rounded-lg border text-[10px] flex items-center justify-between cursor-pointer ${
                  animateWater
                    ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                    : "border-white/10 text-zinc-500 bg-zinc-900/40"
                }`}
              >
                <span>🌊 Sông lấp lánh</span>
                <span>{animateWater ? "ON" : "OFF"}</span>
              </button>

              <button
                onClick={() => setAnimateStorks((v) => !v)}
                className={`px-2 py-1 rounded-lg border text-[10px] flex items-center justify-between cursor-pointer ${
                  animateStorks
                    ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                    : "border-white/10 text-zinc-500 bg-zinc-900/40"
                }`}
              >
                <span>🕊️ Đàn cò bay</span>
                <span>{animateStorks ? "ON" : "OFF"}</span>
              </button>

              <button
                onClick={() => setAnimateSmoke((v) => !v)}
                className={`px-2 py-1 rounded-lg border text-[10px] flex items-center justify-between cursor-pointer ${
                  animateSmoke
                    ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                    : "border-white/10 text-zinc-500 bg-zinc-900/40"
                }`}
              >
                <span>💨 Khói bếp làng</span>
                <span>{animateSmoke ? "ON" : "OFF"}</span>
              </button>

              <button
                onClick={() => setAnimateGodRays((v) => !v)}
                className={`px-2 py-1 rounded-lg border text-[10px] flex items-center justify-between cursor-pointer ${
                  animateGodRays
                    ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                    : "border-white/10 text-zinc-500 bg-zinc-900/40"
                }`}
              >
                <span>✨ Tia nắng mai</span>
                <span>{animateGodRays ? "ON" : "OFF"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Info Pill at Bottom-Left */}
      <div className="fixed bottom-4 left-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/75 border border-white/15 backdrop-blur-md text-[11px] font-mono text-zinc-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>THUẬT TOÁN: BAYER 4×4 DITHER · EUCLIDEAN PALETTE QUANTIZATION</span>
      </div>
    </>
  );
}
