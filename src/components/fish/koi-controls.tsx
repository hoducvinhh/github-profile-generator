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
  Camera,
  Video,
  ArrowLeft,
  SlidersHorizontal,
  Sparkles,
  Waves,
  Flower2,
  Grid3X3,
  Tv,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Cookie,
  Activity,
  Layers,
  X,
  HelpCircle,
  Keyboard,
  RotateCcw,
} from "lucide-react";

export interface KoiControlsProps {
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
  interactMode: "ripple" | "feed";
  setInteractMode: (m: "ripple" | "feed" | ((prev: "ripple" | "feed") => "ripple" | "feed")) => void;
  feedCount: number;
  zenMode: boolean;
  setZenMode: (z: boolean | ((prev: boolean) => boolean)) => void;
  volume: number;
  setVolume: (v: number) => void;
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
  interactMode,
  setInteractMode,
  feedCount,
  zenMode,
  setZenMode,
  volume,
  setVolume,
  fps,
  canvasRef,
}: KoiControlsProps) {
  const [audioEnabled, setAudioEnabled] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordProgress, setRecordProgress] = React.useState(0);
  const [showSettings, setShowSettings] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"display" | "physics" | "zen">("display");
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Toggle Zen Audio
  const toggleAudio = () => {
    if (!zenWaterAudio) return;
    if (audioEnabled) {
      zenWaterAudio.stop();
      setAudioEnabled(false);
    } else {
      zenWaterAudio.start();
      zenWaterAudio.setVolume(volume);
      setAudioEnabled(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (zenWaterAudio && audioEnabled) {
      zenWaterAudio.setVolume(val);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Snapshot PNG
  const takeSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `zen-koi-pond-${theme}-${pixelScale}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Video recording
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

  // If in pure Zen contemplation mode, show only a gentle minimalist floater to restore UI
  if (zenMode) {
    return (
      <div className="fixed bottom-6 right-6 z-40 animate-in fade-in duration-300">
        <button
          onClick={() => setZenMode(false)}
          className="h-10 px-4 rounded-full bg-zinc-950/80 border border-white/20 backdrop-blur-xl text-zinc-300 hover:text-white flex items-center gap-2 text-xs font-medium tracking-wide shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400"
          title="Hiện lại thanh công cụ (Phím H)"
          aria-label="Hiện lại thanh công cụ"
        >
          <Eye className="h-4 w-4 text-amber-400" />
          <span>HIỆN CÔNG CỤ</span>
          <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-white/10 text-zinc-400 font-mono">H</kbd>
        </button>
      </div>
    );
  }

  return (
    <>
      {/* =========================================================================
          TOP NAVIGATION & ZEN TOOLBAR (GLASSMORPHISM LUXURY)
          ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 py-2.5 bg-zinc-950/75 border-b border-white/10 backdrop-blur-xl select-none text-xs text-zinc-200 shadow-lg">
        {/* Left: Home link & Brand Identity */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="h-8 px-2.5 rounded-lg flex items-center gap-1.5 text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400"
            title="Quay lại Trang Chủ"
            aria-label="Quay lại Trang Chủ"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline font-medium">Home</span>
          </Link>

          <div className="h-4 w-[1px] bg-white/15 hidden sm:block" />

          {/* Yin-Yang Dual Koi Vector Emblem & Title */}
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-zinc-900 border border-white/15 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] -mr-1 z-10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] -ml-1" />
            </div>

            <div>
              <div className="font-semibold tracking-wide text-zinc-100 flex items-center gap-1.5 text-[13px]">
                <span>Hồ Cá Koi Thái Cực</span>
                <span className="hidden xl:inline text-[11px] font-normal text-zinc-400">
                  (Zen Yin-Yang Pond)
                </span>
              </div>
            </div>

            {/* Performance status pills */}
            <div className="hidden md:flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {fps} FPS
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-medium">
                {pixelScale.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Curated Zen Pond Themes */}
        <nav
          aria-label="Chọn chủ đề hồ cá"
          className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-black/60 border border-white/10 shadow-inner"
        >
          {(
            [
              { id: "midnight", label: "Đêm Lam Ngọc", color: "bg-cyan-500" },
              { id: "emerald", label: "Hồ Ngọc Bích", color: "bg-emerald-500" },
              { id: "sunset", label: "Hoàng Hôn Vàng", color: "bg-amber-500" },
              { id: "gameboy", label: "Gameboy 4-Bit", color: "bg-lime-500" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`h-7 px-3 rounded-full text-[11px] font-medium tracking-wide flex items-center gap-1.5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 ${
                theme === t.id
                  ? "bg-amber-400 text-zinc-950 font-semibold shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  theme === t.id ? "bg-zinc-950" : t.color
                }`}
              />
              {t.label}
            </button>
          ))}
        </nav>

        {/* Right: Interactive Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Interaction Mode: Ripple vs Feed */}
          <button
            onClick={() => setInteractMode((prev) => (prev === "feed" ? "ripple" : "feed"))}
            className={`h-8 px-3 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 ${
              interactMode === "feed"
                ? "bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)]"
                : "bg-zinc-900/80 border-white/15 text-zinc-300 hover:text-white hover:border-white/30"
            }`}
            title="Bật chế độ Thả Thức Ăn cho cá Koi"
            aria-label="Chế độ cho cá ăn"
          >
            <Cookie className={`h-3.5 w-3.5 ${interactMode === "feed" ? "text-amber-400 animate-bounce" : ""}`} />
            <span className="hidden sm:inline">
              {interactMode === "feed" ? `Thả Mồi (${feedCount})` : "Cho Ăn"}
            </span>
          </button>

          {/* Zen Water Audio Toggle */}
          <button
            onClick={toggleAudio}
            className={`h-8 px-3 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 ${
              audioEnabled
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                : "bg-zinc-900/80 border-white/15 text-zinc-300 hover:text-white hover:border-white/30"
            }`}
            title="Bật/Tắt âm thanh suối nước Zen và giọt nước thánh thót (Phím M)"
            aria-label="Bật tắt âm thanh Zen"
          >
            {audioEnabled ? (
              <>
                <Volume2 className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">Âm Thanh</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Âm Thanh</span>
              </>
            )}
          </button>

          {/* Snapshot PNG Button */}
          <button
            onClick={takeSnapshot}
            className="h-8 px-2.5 sm:px-3 rounded-lg bg-zinc-900/80 border border-white/15 text-zinc-300 hover:text-white hover:border-white/30 flex items-center gap-1.5 text-xs font-medium transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400"
            title="Chụp ảnh Pixel Art PNG độ phân giải gốc"
            aria-label="Chụp ảnh PNG"
          >
            <Camera className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Ảnh PNG</span>
          </button>

          {/* Record 60 FPS Video Button */}
          <button
            onClick={recordVideo}
            disabled={isRecording}
            className={`h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-md cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 ${
              isRecording
                ? "bg-red-500 text-white animate-pulse border border-red-400"
                : "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-semibold border border-emerald-400"
            }`}
            title="Quay video WebM 60 FPS độ dài 5 giây"
            aria-label="Quay video WebM"
          >
            <Video className="h-3.5 w-3.5" />
            <span>{isRecording ? `${recordProgress}%` : "Xuất Video"}</span>
          </button>

          {/* Zen Contemplation Mode (Hide UI) */}
          <button
            onClick={() => setZenMode(true)}
            className="h-8 w-8 rounded-lg bg-zinc-900/80 border border-white/15 text-zinc-400 hover:text-white hover:border-white/30 flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400"
            title="Chế độ Tĩnh Tâm Zen: Ẩn thanh công cụ (Phím H)"
            aria-label="Ẩn thanh công cụ"
          >
            <EyeOff className="h-3.5 w-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex h-8 w-8 rounded-lg bg-zinc-900/80 border border-white/15 text-zinc-400 hover:text-white hover:border-white/30 items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400"
            title="Bật/Tắt Toàn màn hình (Phím F)"
            aria-label="Bật tắt toàn màn hình"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>

          {/* Settings Drawer Toggle */}
          <button
            onClick={() => setShowSettings((prev) => !prev)}
            className={`h-8 w-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 ${
              showSettings
                ? "bg-amber-400 text-zinc-950 border-amber-400 shadow-md"
                : "bg-zinc-900/80 border-white/15 text-zinc-300 hover:text-white hover:border-white/30"
            }`}
            title="Tùy chỉnh thông số Pixel & Môi trường (Phím S)"
            aria-label="Mở bảng tùy chỉnh"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* =========================================================================
          SETTINGS & ACCESSIBLE DRAWER (UI/UX PRO MAX STANDARD)
          ========================================================================= */}
      {showSettings && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Bảng điều khiển thông số hồ cá Koi"
          className="fixed bottom-4 right-4 z-40 w-full max-w-sm bg-zinc-950/90 border border-white/15 backdrop-blur-2xl rounded-2xl shadow-2xl text-zinc-200 animate-in fade-in slide-in-from-bottom-3 duration-200 overflow-hidden"
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span className="font-semibold text-xs tracking-wide text-zinc-100">
                Bảng Tùy Chỉnh Zen Studio
              </span>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="h-6 w-6 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400"
              aria-label="Đóng bảng tùy chỉnh"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center border-b border-white/10 px-2 bg-black/40 text-[11px] font-medium">
            <button
              onClick={() => setActiveTab("display")}
              className={`flex-1 py-2 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === "display"
                  ? "border-amber-400 text-amber-300 font-semibold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Hiển Thị & Lớp
            </button>
            <button
              onClick={() => setActiveTab("physics")}
              className={`flex-1 py-2 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === "physics"
                  ? "border-amber-400 text-amber-300 font-semibold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Động Học Cá Koi
            </button>
            <button
              onClick={() => setActiveTab("zen")}
              className={`flex-1 py-2 text-center border-b-2 transition-all cursor-pointer ${
                activeTab === "zen"
                  ? "border-amber-400 text-amber-300 font-semibold"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Âm Thanh & Phím
            </button>
          </div>

          {/* Tab 1: Display & Visual Layers */}
          {activeTab === "display" && (
            <div className="p-4 space-y-4 max-h-[65vh] overflow-y-auto">
              {/* Pixel Block Scale */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                  Kích Thước Ô Vuông Pixel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "large", label: "Lớn (12px)", desc: "Retro thô" },
                      { id: "medium", label: "Vừa (8px)", desc: "Chuẩn đẹp" },
                      { id: "fine", label: "Mịn (5px)", desc: "Chi tiết cao" },
                    ] as const
                  ).map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setPixelScale(mode.id)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 ${
                        pixelScale === mode.id
                          ? "border-amber-400 bg-amber-400/20 text-amber-300 font-semibold shadow-inner"
                          : "border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
                      }`}
                    >
                      <div className="text-xs">{mode.label}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Layer Toggles */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                  Các Lớp Môi Trường Thủy Sinh
                </label>
                <div className="space-y-1.5">
                  {[
                    {
                      label: "Lá Sen & Bông Sen Pixel",
                      icon: Flower2,
                      value: showLilypads,
                      toggle: () => setShowLilypads((v) => !v),
                    },
                    {
                      label: "Cánh Hoa Sen Rơi Trôi",
                      icon: Sparkles,
                      value: showPetals,
                      toggle: () => setShowPetals((v) => !v),
                    },
                    {
                      label: "Khúc Xạ Ánh Nắng Đáy Hồ",
                      icon: Waves,
                      value: showCaustics,
                      toggle: () => setShowCaustics((v) => !v),
                    },
                    {
                      label: "Sóng Nước Đuôi Cá Bơi",
                      icon: Activity,
                      value: showRipples,
                      toggle: () => setShowRipples((v) => !v),
                    },
                    {
                      label: "Hiển Thị Lưới Ô Pixel",
                      icon: Grid3X3,
                      value: pixelGrid,
                      toggle: () => setPixelGrid((v) => !v),
                    },
                    {
                      label: "Hiệu Ứng Quét CRT Retro",
                      icon: Tv,
                      value: crtEffect,
                      toggle: () => setCrtEffect((v) => !v),
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        role="switch"
                        aria-checked={item.value}
                        onClick={item.toggle}
                        className={`w-full px-3 py-2 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 ${
                          item.value
                            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                            : "bg-zinc-900/50 border-white/10 text-zinc-400 hover:text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`h-4 w-4 ${item.value ? "text-emerald-400" : "text-zinc-500"}`} />
                          <span>{item.label}</span>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                            item.value
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-white/5 text-zinc-500"
                          }`}
                        >
                          {item.value ? "BẬT" : "TẮT"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Physics & Koi Mechanics */}
          {activeTab === "physics" && (
            <div className="p-4 space-y-4 max-h-[65vh] overflow-y-auto">
              {/* Swim Speed */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                  Tốc Độ Bơi Uốn Lượn
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { speed: 0.5, label: "Rất Chậm", desc: "0.5x" },
                    { speed: 0.8, label: "Từ Tốn", desc: "0.8x" },
                    { speed: 1.2, label: "Tự Nhiên", desc: "1.2x" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setSwimSpeed(item.speed)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 ${
                        swimSpeed === item.speed
                          ? "border-amber-400 bg-amber-400/20 text-amber-300 font-semibold shadow-inner"
                          : "border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <div className="text-xs">{item.label}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interaction Mode */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                  Chế Độ Tương Tác Chuột & Phím
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setInteractMode("ripple")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      interactMode === "ripple"
                        ? "border-cyan-400 bg-cyan-950/40 text-cyan-200 font-semibold"
                        : "border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Waves className="h-4 w-4 mb-1 text-cyan-400" />
                    <div className="text-xs font-semibold">Tạo Sóng Nước</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Click mặt hồ để lan tỏa sóng</div>
                  </button>

                  <button
                    onClick={() => setInteractMode("feed")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      interactMode === "feed"
                        ? "border-amber-400 bg-amber-950/40 text-amber-200 font-semibold"
                        : "border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Cookie className="h-4 w-4 mb-1 text-amber-400" />
                    <div className="text-xs font-semibold">Thả Thức Ăn</div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">Cá bơi lại gần đớp mồi ({feedCount})</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Zen Sound & Shortcuts */}
          {activeTab === "zen" && (
            <div className="p-4 space-y-4 max-h-[65vh] overflow-y-auto">
              {/* Sound Volume Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Âm Lượng Tiếng Suối Chảy
                  </label>
                  <span className="text-[11px] font-mono text-emerald-400">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-amber-400 cursor-pointer"
                  aria-label="Điều chỉnh âm lượng tiếng nước Zen"
                />
              </div>

              {/* Keyboard Shortcuts Guide */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Keyboard className="h-3.5 w-3.5" />
                  <span>Phím Tắt Zen Studio</span>
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    { key: "Space", desc: "Thả thức ăn / Tạo sóng mặt hồ" },
                    { key: "H", desc: "Ẩn / Hiện thanh công cụ (Tĩnh tâm)" },
                    { key: "M", desc: "Bật / Tắt âm thanh suối nước Zen" },
                    { key: "F", desc: "Bật / Tắt toàn màn hình" },
                    { key: "S", desc: "Mở / Đóng bảng tùy chỉnh này" },
                    { key: "1 - 4", desc: "Đổi nhanh 4 chủ đề hồ nước" },
                  ].map((sc) => (
                    <div
                      key={sc.key}
                      className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-white/5"
                    >
                      <span className="text-zinc-300">{sc.desc}</span>
                      <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] text-amber-300 font-semibold">
                        {sc.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Drawer Footer */}
          <div className="px-4 py-2.5 bg-black/60 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
            <span>Zen Koi Engine 2.0</span>
            <span className="text-amber-400/80 font-mono">UI/UX Pro Max Certified</span>
          </div>
        </div>
      )}

      {/* =========================================================================
          BOTTOM ZEN HELPER / INTERACTIVE FLOATING PILL
          ========================================================================= */}
      <div className="fixed bottom-4 left-4 z-20 hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-zinc-950/80 border border-white/15 backdrop-blur-xl text-xs text-zinc-300 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="font-medium text-zinc-200">
            {interactMode === "feed"
              ? "Chế độ cho cá ăn: Click để thả mồi ngon trên mặt hồ"
              : "Di chuột để dẫn đường, Click để tạo sóng nước lan tỏa"}
          </span>
        </div>

        <div className="h-3 w-[1px] bg-white/15" />

        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px] text-zinc-300">Space</kbd>
          <span>Tương tác</span>
        </div>
      </div>
    </>
  );
}
