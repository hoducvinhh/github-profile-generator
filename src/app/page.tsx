"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/stores/use-profile-store";
import { TemplateId } from "@/types/profile";
import { TEMPLATE_LIST } from "@/lib/templates/registry";
import {
  Flame,
  Github,
  Zap,
  Terminal,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { setTemplate, setGithubUsername } = useProfileStore();
  const [inputUsername, setInputUsername] = React.useState("");
  const [selectedArchetype, setSelectedArchetype] = React.useState<TemplateId>("modern");

  const handleForge = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const target = inputUsername.trim() || "alexrivera";
    setGithubUsername(target);
    setTemplate(selectedArchetype);
    router.push("/builder");
  };

  const handleSelectTemplate = (id: TemplateId) => {
    setSelectedArchetype(id);
    setTemplate(id);
    router.push("/builder");
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-[#07080a] text-[#f2f4f8] select-none">
      {/* Edge Technical Stamps (Inspired by Impeccable Villa Castagneto) */}
      <div className="hidden xl:flex fixed left-3 top-1/2 -translate-y-1/2 vertical-stamp text-xs font-mono tracking-widest text-zinc-400 uppercase pointer-events-none">
        [// IDENTITY_FOUNDRY // DETERMINISTIC_GFM_COMPILER]
      </div>
      <div className="hidden xl:flex fixed right-3 top-1/2 -translate-y-1/2 vertical-stamp text-xs font-mono tracking-widest text-zinc-400 uppercase pointer-events-none">
        [// OCTOKIT_API // ZERO_DATABASE // CLIENT_SIDE]
      </div>

      {/* Top Header Bar */}
      <header className="relative z-30 w-full border-b border-white/[0.08] px-4 sm:px-8 py-3.5 backdrop-blur-md bg-[#07080a]/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#13151b] border border-white/15 text-[#ff5f1f] group-hover:border-[#ff5f1f]/60 transition-all shadow-inner">
              <Flame className="h-4.5 w-4.5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-sm uppercase text-white font-sans">
                ProfileForge
              </span>
              <span className="text-xs font-mono text-[#ff773d] px-1.5 py-0.5 rounded border border-[#ff5f1f]/40 bg-[#ff5f1f]/10">
                01.00
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/hoducvinhh/github-profile-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              <span>SOURCE</span>
            </a>

            <Link href="/builder">
              <button
                type="button"
                className="h-8 px-4 rounded-md text-xs font-mono font-medium border border-[#ff5f1f]/50 bg-[#ff5f1f]/20 text-[#ff773d] hover:bg-[#ff5f1f] hover:text-black transition-all shadow-sm"
              >
                ENTER WORKSPACE ➔
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Central Dramatic Stage */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 text-center max-w-5xl mx-auto w-full">
        {/* Top Monospace Ticker */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/[0.04] text-xs font-mono text-zinc-300 mb-6 backdrop-blur-sm">
          <span className="flex h-1.5 w-1.5 rounded-full bg-[#ff5f1f]" />
          <span>GITHUB PROFILE README STUDIO · OPEN SOURCE</span>
        </div>

        {/* Ultra-Condensed Bold Headline (Calibrated display scale) */}
        <h1 className="font-display uppercase tracking-tight text-5xl sm:text-7xl md:text-8xl leading-none text-white">
          FORGE YOUR IDENTITY
          <br />
          <span className="text-[#ff5f1f]">
            IN RAW CODE &amp; METRICS
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-sm sm:text-base text-zinc-300 font-sans leading-relaxed">
          No boilerplate templates. No broken SVG formatting. Import real GitHub activity,
          arrange sections visually, and compile 100% deterministic GitHub Flavored Markdown.
        </p>

        {/* The Interactive Forge Console */}
        <div className="mt-10 w-full max-w-2xl">
          <form
            onSubmit={handleForge}
            className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-xl border border-white/15 bg-[#0f1117] shadow-2xl backdrop-blur-xl"
          >
            <div className="flex-1 flex items-center gap-2 px-3 w-full font-mono text-xs text-zinc-300">
              <span className="text-[#ff5f1f] font-bold text-sm select-none">&gt;</span>
              <span className="text-zinc-400 select-none hidden sm:inline">github.com/</span>
              <input
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="type your github username (e.g. alexrivera)..."
                className="w-full bg-transparent text-white placeholder:text-zinc-400 focus:outline-none text-xs sm:text-sm font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto h-11 px-6 rounded-lg bg-[#ff5f1f] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#ff773d] transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>FORGE IDENTITY</span>
            </button>
          </form>

          {/* Quick-Pick Sample Developers */}
          <div className="mt-3 flex items-center justify-center gap-2 text-xs font-mono text-zinc-400 flex-wrap">
            <span>Or test with:</span>
            {["alexrivera", "shadcn", "torvalds", "leerob"].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setInputUsername(name);
                  setGithubUsername(name);
                  router.push("/builder");
                }}
                className="underline underline-offset-4 text-zinc-300 hover:text-[#ff5f1f] transition-colors"
              >
                @{name}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Technical Guarantees */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-left max-w-3xl w-full border-t border-white/[0.08] pt-6 font-mono text-xs">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-[#ff5f1f] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">100% GFM Spec</span>
              <span className="text-zinc-300 text-xs leading-relaxed block mt-0.5">
                Deterministic Markdown guaranteed to render natively on GitHub.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Terminal className="h-4 w-4 text-[#ff5f1f] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Octokit REST Pipeline</span>
              <span className="text-zinc-300 text-xs leading-relaxed block mt-0.5">
                Pulls real avatar, bio, top repos, stars, and language telemetry.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 text-[#ff5f1f] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Zero Database Lock-in</span>
              <span className="text-zinc-300 text-xs leading-relaxed block mt-0.5">
                Runs entirely client-side. 1-click clipboard copy, ZIP, or JSON backup.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* The Bottom Archetype Ribbon (Directly inspired by the Month Scrubber in the Villa image) */}
      <footer className="relative z-30 w-full border-t border-white/[0.08] bg-[#090b0f] px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-300 uppercase tracking-wider text-xs">
            <span className="text-[#ff5f1f] font-bold">ARCHETYPES:</span>
            <span>CHOOSE STARTER BLUEPRINT ➔</span>
          </div>

          {/* Archetype Ribbon (Like the month strip in the Villa Castagneto example) */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
            {TEMPLATE_LIST.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSelectTemplate(t.id as TemplateId)}
                className={`px-3 py-1.5 rounded border transition-all text-xs uppercase tracking-wider shrink-0 flex items-center gap-1.5 ${
                  selectedArchetype === t.id
                    ? "border-[#ff5f1f] bg-[#ff5f1f]/20 text-[#ff773d] font-bold"
                    : "border-white/10 text-zinc-300 hover:border-white/30 hover:text-white bg-white/[0.02]"
                }`}
              >
                <span className="text-zinc-400 text-xs">0{idx + 1}</span>
                <span>{t.name}</span>
              </button>
            ))}
          </div>

          <div className="text-xs text-zinc-400 hidden lg:block">
            MIT LICENSE · PROFILEFORGE
          </div>
        </div>
      </footer>
    </div>
  );
}
