"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TEMPLATE_LIST } from "@/lib/templates/registry";
import { useProfileStore } from "@/stores/use-profile-store";
import { TemplateId } from "@/types/profile";
import { useRouter } from "next/navigation";
import {
  Flame,
  ArrowRight,
  Sparkles,
  Github,
  CheckCircle2,
  Layers,
  Palette,
  Download,
  Terminal,
  ShieldCheck,
  Lock,
  Code2,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";

export default function LandingPage() {
  const router = useRouter();
  const { setTemplate } = useProfileStore();

  const handleSelectTemplate = (id: TemplateId) => {
    setTemplate(id);
    router.push("/builder");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between px-4 sm:px-6 mx-auto max-w-6xl">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-sm group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 border border-white/10 text-emerald-400 group-hover:border-emerald-500/50 transition-all shadow-inner">
              <Flame className="h-4 w-4" />
            </div>
            <span className="text-foreground tracking-tight">ProfileForge</span>
            <span className="rounded px-1.5 py-0.5 text-xs font-mono font-medium border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              v1.0
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/hoducvinhh/github-profile-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              <span>GitHub</span>
            </a>

            <Link href="/builder">
              <Button size="sm" className="h-8 gap-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 tech-glow-subtle transition-all">
                <span>Open Workspace</span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 px-4">
        {/* Subtle Engineering Grid background */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="container mx-auto max-w-4xl space-y-6 text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-3 py-1 text-xs font-mono text-emerald-400">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>v1.0 · Visual GitHub Profile README Builder</span>
          </div>

          {/* High-Impact Solid Headline (Zero AI Gradient Text) */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-foreground">
            Craft your developer identity.
            <br />
            <span className="text-muted-foreground font-normal">Without Markdown toil.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
            The visual README builder engineered for developers. Import your real GitHub activity,
            arrange sections visually, customize themes, and export deterministic, 100% GitHub-compatible Markdown.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-3 sm:flex-row">
            <Link href="/builder">
              <Button size="lg" className="h-11 px-7 text-sm font-medium gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md tech-glow transition-all">
                <Sparkles className="h-4 w-4" />
                <span>Launch Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <a
              href="#templates"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-border/80 bg-card/60 px-6 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition-colors"
            >
              Browse 5 Templates
            </a>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Zero database or sign-up
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              100% GitHub Flavored Markdown
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              Real Octokit GitHub API
            </span>
          </div>

          {/* Interactive Hero Preview Box (Mock Window) */}
          <div className="mt-12 text-left rounded-xl border border-border/80 bg-zinc-950/80 shadow-2xl overflow-hidden tech-glass">
            {/* Window Bar */}
            <div className="flex h-9 items-center justify-between border-b border-white/[0.08] px-3.5 bg-zinc-900/50">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                <Lock className="h-3 w-3 text-emerald-400" />
                <span>github.com/developer/developer</span>
              </div>
              <div className="text-xs font-mono text-emerald-400/80 hidden sm:inline">
                Live Preview Mock
              </div>
            </div>

            {/* Code & Preview Snippet */}
            <div className="p-5 sm:p-6 space-y-4 font-mono text-xs text-zinc-300">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-semibold text-sm">Hi there, I&apos;m Alex Rivera 👋</span>
                  <span className="rounded bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-xs font-mono border border-emerald-500/20">
                    Full Stack Engineer
                  </span>
                </div>
                <span className="text-zinc-500 text-xs hidden sm:inline">README.md</span>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 space-y-1">
                  <span className="text-zinc-500 text-xs">Total Commits</span>
                  <div className="text-lg font-bold text-white">2,847</div>
                  <span className="text-emerald-400 text-xs font-medium">Top 2% Worldwide</span>
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 space-y-1">
                  <span className="text-zinc-500 text-xs">Current Streak</span>
                  <div className="text-lg font-bold text-white">128 Days</div>
                  <span className="text-emerald-400 text-xs font-medium">Ongoing streak 🔥</span>
                </div>
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-3 space-y-1">
                  <span className="text-zinc-500 text-xs">Primary Stack</span>
                  <div className="text-sm font-semibold text-white pt-1">Next.js · TS · Docker</div>
                  <span className="text-zinc-400 text-xs">5 Production Repos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="border-t border-border/80 bg-muted/10 py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-2 mb-14">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              Built for Engineering Craftsmanship
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Designed to eliminate manual formatting toil and deliver deterministic, clean profiles.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm space-y-2 hover:border-emerald-500/40 hover:bg-card transition-all">
              <div className="flex items-center gap-2.5">
                <Layers className="h-4 w-4 text-emerald-400 shrink-0" />
                <h3 className="font-semibold text-base text-foreground">Visual Drag & Drop Canvas</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Reorder, duplicate, toggle, and configure sections with fluid `@dnd-kit` drag handles and quick up/down controls.
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm space-y-2 hover:border-emerald-500/40 hover:bg-card transition-all">
              <div className="flex items-center gap-2.5">
                <Github className="h-4 w-4 text-emerald-400 shrink-0" />
                <h3 className="font-semibold text-base text-foreground">1-Click GitHub Data Import</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Type your GitHub handle to fetch your real avatar, bio, top starred repos, and language graph instantly.
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm space-y-2 hover:border-emerald-500/40 hover:bg-card transition-all">
              <div className="flex items-center gap-2.5">
                <Palette className="h-4 w-4 text-emerald-400 shrink-0" />
                <h3 className="font-semibold text-base text-foreground">6 Synchronized Themes</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Seamless theme synchronization across stats cards and badges: GitHub Dark, Light, Dracula, Nord, Tokyo Night, Catppuccin.
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm space-y-2 hover:border-emerald-500/40 hover:bg-card transition-all">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <h3 className="font-semibold text-base text-foreground">Strict GFM Serializer</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Deterministic Markdown compiler producing 100% compliant GitHub Flavored Markdown—never fragile browser DOM markup.
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm space-y-2 hover:border-emerald-500/40 hover:bg-card transition-all">
              <div className="flex items-center gap-2.5">
                <Terminal className="h-4 w-4 text-emerald-400 shrink-0" />
                <h3 className="font-semibold text-base text-foreground">Bi-Directional Live Preview</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Inspect raw Markdown with syntax highlighting in CodeMirror 6 or preview the live GitHub container side-by-side.
              </p>
            </div>

            <div className="rounded-xl border border-border/70 bg-card/60 p-5 shadow-sm space-y-2 hover:border-emerald-500/40 hover:bg-card transition-all">
              <div className="flex items-center gap-2.5">
                <Download className="h-4 w-4 text-emerald-400 shrink-0" />
                <h3 className="font-semibold text-base text-foreground">Zero Lock-In & Backup</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Copy with 1 click, download `README.md`, package a ZIP archive, or save/restore complete JSON profile backups anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-18 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              5 Pre-Built Layout Archetypes
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              Tailored to your career stage and aesthetic preference. Completely customizable anytime.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TEMPLATE_LIST.map((template) => (
              <div
                key={template.id}
                className="flex flex-col justify-between rounded-xl border border-border/80 bg-card/60 p-5 shadow-sm hover:border-emerald-500/50 hover:bg-card transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-emerald-400">
                      {template.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground">{template.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="pt-5">
                  <Button
                    onClick={() => handleSelectTemplate(template.id as TemplateId)}
                    variant="outline"
                    className="w-full h-8 text-xs gap-1.5 border-border/80 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
                  >
                    <span>Use Template</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/80 bg-muted/10 py-18 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
              Workflow in 3 Steps
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              From zero to a polished, professional developer profile
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 text-left">
            <div className="space-y-2 rounded-lg border border-border/60 bg-card/40 p-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                01
              </div>
              <h3 className="font-semibold text-sm text-foreground">Select or Import</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose a starter template or auto-fetch your data by typing your GitHub username.
              </p>
            </div>

            <div className="space-y-2 rounded-lg border border-border/60 bg-card/40 p-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                02
              </div>
              <h3 className="font-semibold text-sm text-foreground">Customize Visually</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Drag sections with ⋮⋮, click ▲▼, choose badges, adjust stats, and select color themes.
              </p>
            </div>

            <div className="space-y-2 rounded-lg border border-border/60 bg-card/40 p-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                03
              </div>
              <h3 className="font-semibold text-sm text-foreground">Export & Publish</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Copy markdown into your special `username/username` GitHub repository!
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Link href="/builder">
              <Button size="lg" className="gap-2 px-7 h-11 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 tech-glow transition-all">
                <span>Launch ProfileForge Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
