"use client";

import * as React from "react";
import Link from "next/link";
import {
  PixelScaleMode,
  PondTheme,
} from "./koi-canvas";
import { zenWaterAudio } from "@/lib/audio/zen-water-synthesizer";
import {
  Volume2,
  VolumeX,
  Download,
  Video,
  ArrowLeft,
  Sliders,
  Sparkles,
  Waves,
  Flower2,
} from "lucide-react";

interface KoiControlsProps {
  pixelScale: PixelScaleMode;
  setPixelScale: (s: PixelScaleMode) => void;
  theme: PondTheme;
  setTheme: (t: PondTheme) => void;
  swimSpeed: number;
  setSwimSpeed: (s: number) => void;
  showLilypads: boolean;
  setShowLilypads: (v: boolean | ((p: boolean) => boolean)) => void;
  showPetals: boolean;
  setShowPetals: (v: boolean | ((p: boolean) => boolean)) => void;
  showCaustics: boolean;
  setShowCaustics: (v: boolean | ((p: boolean) => boolean)) => void;
  showRipples: boolean;
  setShowRipples: (v: boolean | ((p: boolean) => boolean)) => void;
  crtEffect: boolean;
  setCrtEffect: (v: boolean | ((p: boolean) => boolean)) => void;
  pixelGrid: boolean;
  setPixelGrid: (v: boolean | ((p: boolean) => boolean)) => void;
  fps: number;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function KoiControls({
  pixelScale,
  setPixelScale,
  theme,
  setTheme,
  swimSpeed,
  setSwimSpeed,
  showLilypads,
  setShowLilypads,
  showPetals,
  setShowPetals,
  showCaustics,
  setShowCaustics,
  showRipples,
  setShowRipples,
  crtEffect,
  setCrtEffect,
  pixelGrid,
  setPixelGrid,
  fps,
  canvasRef,
}: KoiControlsProps) {
  const [audioEnabled, setAudioEnabled] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordProgress, setRecordProgress] = React.useState(0);
  const [showSettings, setShowSettings] = React.useState(true);

  const toggleAudio = () => {
    if (!zenWaterAudio) return;
    if (audioEnabled) {
      zenWaterAudio.stop();
      setAudioEnabled(false);
    } else {
      zenWaterAudio.start();
      setAudioEnabled(true);
    }
  };

  const takeSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `zen-koi-pixel-${theme}-${pixelScale}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const recordVideo = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRecording) return;

    try {
      const canvasWithStream = canvas as HTMLCanvasElement & {
        captureStream?: (fps?: number) => MediaStream;
      };
      if (!canvasWithStream.captureStream) {
        alert("Trình duyệt không hỗ trợ quay video Canvas trực tiếp");
        return;
      }

      const stream = canvasWithStream.captureStream(60);
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
        a.download = `zen-koi-swimming-${theme}.webm`;
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
      console.error(err);
      setIsRecording(false);
    }
  };

  return (
    <>
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-black/75 backdrop-blur-md select-none font-mono text-xs">
        {/* Left: Brand & Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
            title="Quay lại Trang Chủ"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">HOME</span>
          </Link>

          <div className="h-3.5 w-[1px] bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>HỒ CÁ KOI THÁI CỰC</span>
              <span className="text-red-500 font-extrabold">🔴</span>
              <span className="text-white font-extrabold">⚪</span>
            </span>
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 font-bold hidden sm:inline-block">
              {fps} FPS
            </span>
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded border border-amber-500/40 bg-amber-950/60 text-amber-300 font-bold hidden md:inline-block">
              PIXEL: {pixelScale.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Center: Quick Theme Selector */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-full border border-white/10 bg-zinc-950/70">
          {(
            [
              { id: "midnight", name: "HỒ ĐÊM LAM NGỌC" },
              { id: "emerald", name: "HỒ NGỌC BÍCH" },
              { id: "sunset", name: "HOÀNG HÔN ÁNH VÀNG" },
              { id: "gameboy", name: "GAMEBOY 4-COLOR" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider transition-all cursor-pointer ${
                theme === t.id
                  ? "bg-amber-400 text-stone-950 shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Right: Audio, Snapshot, Record, Settings */}
        <div className="flex items-center gap-2">
          {/* Zen Water Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`h-8 px-3 rounded-full border flex items-center gap-1.5 transition-colors cursor-pointer text-xs ${
              audioEnabled
                ? "border-amber-400 bg-amber-400 text-stone-950 font-bold shadow"
                : "border-white/20 bg-zinc-900/80 text-zinc-300 hover:text-white"
            }`}
            title="Bật/Tắt âm thanh suối nước Zen và giọt nước thánh thót"
          >
            {audioEnabled ? (
              <>
                <Volume2 className="h-3.5 w-3.5 animate-pulse text-stone-950" />
                <span className="hidden sm:inline">TIẾNG NƯỚC: BẬT</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">ÂM THANH ZEN 🎋</span>
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
            title="Bảng tùy chỉnh thông số"
          >
            <Sliders className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Floating Settings Drawer */}
      {showSettings && (
        <div className="fixed bottom-4 right-4 z-30 max-w-sm w-full bg-black/85 border border-white/15 backdrop-blur-md rounded-2xl p-4 text-xs font-mono text-zinc-200 shadow-2xl space-y-3.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="font-bold uppercase tracking-wider text-white">
                THÔNG SỐ PIXEL & THUẬT TOÁN
              </span>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="text-zinc-400 hover:text-white text-xs cursor-pointer px-1"
            >
              ✕
            </button>
          </div>

          {/* 1. Pixel Block Size */}
          <div>
            <label className="text-[11px] text-zinc-400 uppercase tracking-widest block mb-1.5 font-bold">
              KÍCH THƯỚC Ô VUÔNG PIXEL
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: "large", name: "LỚN (12PX)", desc: "Rất thô" },
                  { id: "medium", name: "VỪA (8PX)", desc: "Chuẩn đẹp" },
                  { id: "fine", name: "MỊN (5PX)", desc: "Chi tiết" },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setPixelScale(mode.id)}
                  className={`px-2 py-1.5 rounded-lg border text-center text-[10px] tracking-wide transition-all cursor-pointer ${
                    pixelScale === mode.id
                      ? "border-amber-400 bg-amber-400/20 text-amber-300 font-bold"
                      : "border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <div className="font-bold">{mode.name}</div>
                  <div className="text-[9px] text-zinc-500">{mode.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Swim Speed */}
          <div>
            <label className="text-[11px] text-zinc-400 uppercase tracking-widest block mb-1.5 font-bold">
              TỐC ĐỘ BƠI UỐN LƯỢN
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { speed: 0.65, label: "THƯ THÁI" },
                { speed: 1.0, label: "TỰ NHIÊN" },
                { speed: 1.5, label: "NHANH" },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setSwimSpeed(item.speed)}
                  className={`px-2 py-1.5 rounded-lg border text-center text-[10px] font-bold tracking-wide transition-all cursor-pointer ${
                    swimSpeed === item.speed
                      ? "border-amber-400 bg-amber-400/20 text-amber-300"
                      : "border-white/10 bg-zinc-900/60 text-zinc-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Environment & Effects Toggles */}
          <div>
            <label className="text-[11px] text-zinc-400 uppercase tracking-widest block mb-1.5 font-bold">
              MÔI TRƯỜNG & CHI TIẾT
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setShowLilypads((v) => !v)}
                className={`px-2 py-1 rounded-lg border text-[10px] flex items-center justify-between cursor-pointer ${
                  showLilypads
                    ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300 font-bold"
                    : "border-white/10 text-zinc-500 bg-zinc-900/40"
                }`}
              >
                <span>🪷 Lá sen & Hoa</span>
                <span>{showLilypads ? "ON" : "OFF"}</span>
              </button>

              <button
                onClick={() => setShowPetals((v) => !v)}
                className={`px-2 py-1 rounded-lg border text-[10px] flex items-center justify-between cursor-pointer ${
                  showPetals
                    ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300 font-bold"
                    : "border-white/10 text-zinc-500 bg-zinc-900/40"
                }`}
              >
                <span>🌸 Cánh hoa rơi</span>
                <span>{showPetals ? "ON" : "OFF"}</span>
              </button>

              <button
                onClick={() => setShowCaustics((v) => !v)}
                className={`px-2 py-1 rounded-lg border text-[10px] flex items-center justify-between cursor-pointer ${
                  showCaustics
                    ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300 font-bold"
                    : "border-white/10 text-zinc-500 bg-zinc-900/40"
                }`}
              >
                <span>✨ Ánh nước đáy</span>
                <span>{showCaustics ? "ON" : "OFF"}</span>
              </button>

              <button
                onClick={() => setShowRipples((v) => !v)}
                className={`px-2 py-1 rounded-lg border text-[10px] flex items-center justify-between cursor-pointer ${
                  showRipples
                    ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300 font-bold"
                    : "border-white/10 text-zinc-500 bg-zinc-900/40"
                }`}
              >
                <span>🌊 Sóng đuôi cá</span>
                <span>{showRipples ? "ON" : "OFF"}</span>
              </button>

              <button
                onClick={() => setPixelGrid((v) => !v)}
                className={`px-2 py-1 rounded-lg border text-[10px] flex items-center justify-between cursor-pointer ${
                  pixelGrid
                    ? "border-amber-400 bg-amber-400/20 text-amber-300 font-bold"
                    : "border-white/10 text-zinc-500 bg-zinc-900/40"
                }`}
              >
                <span>🔲 Lưới ô pixel</span>
                <span>{pixelGrid ? "ON" : "OFF"}</span>
              </button>

              <button
                onClick={() => setCrtEffect((v) => !v)}
                className={`px-2 py-1 rounded-lg border text-[10px] flex items-center justify-between cursor-pointer ${
                  crtEffect
                    ? "border-amber-400 bg-amber-400/20 text-amber-300 font-bold"
                    : "border-white/10 text-zinc-500 bg-zinc-900/40"
                }`}
              >
                <span>📺 CRT Scanlines</span>
                <span>{crtEffect ? "ON" : "OFF"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Interactive Tip at Bottom-Left */}
      <div className="fixed bottom-4 left-4 z-20 hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 border border-white/15 backdrop-blur-md text-[11px] font-mono text-zinc-300 shadow-xl">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>💡 DI CHUỘT / CLICK VÀO HỒ ĐỂ TẠO SÓNG VÀ TƯƠNG TÁC VỚI 2 CHÚ CÁ KOI</span>
      </div>
    </>
  );
}

