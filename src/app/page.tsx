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
  Zap,
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
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Flame className="h-5 w-5" />
            </div>
            <span>ProfileForge</span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>Star on GitHub</span>
            </a>

            <Link href="/builder">
              <Button size="sm" className="gap-1.5">
                <span>Open Builder</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 text-center px-4">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="container mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>ProfileForge v1.0 is Live & 100% Free</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Build your dream{" "}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              GitHub Profile
            </span>{" "}
            in minutes.
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
            No more manual Markdown tables, broken badge links, or misaligned SVGs.
            Import real GitHub data, rearrange sections visually, and export 100%
            GitHub-compatible Markdown with one click.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
            <Link href="/builder">
              <Button size="lg" className="h-12 px-8 text-base gap-2 shadow-lg">
                <Sparkles className="h-4 w-4" />
                <span>Start Building for Free</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <a
              href="#templates"
              className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-6 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Browse 5 Templates
            </a>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              No sign-up or database required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              100% GitHub Flavored Markdown
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Real GitHub API Integration
            </span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="border-t bg-muted/20 py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to stand out
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Engineered with clean architectural principles to eliminate the friction
              of showcasing your engineering skills and career highlights.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">Visual Drag & Drop</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Reorder, duplicate, toggle, and configure sections with fluid `@dnd-kit`
                interactions and instant reactive updates.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Github className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">GitHub Data Import</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect your GitHub username to auto-populate your bio, avatar, top starred
                repositories, and language graphs without manual entry.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Palette className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">6 Curated Themes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Choose from GitHub Dark, Light, Dracula, Nord, Tokyo Night, and Catppuccin
                with synchronized SVG widget query colors.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">Strict GFM Serializer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Deterministic Markdown generator guaranteed to render cleanly in GitHub
                repositories without broken tags or unescaped characters.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">Live Split Preview</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Inspect raw GitHub Flavored Markdown with CodeMirror 6 or preview the live
                sanitized GitHub container side-by-side.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Download className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-lg">One-Click Exports & ZIP</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Copy to clipboard with confetti, download `README.md`, or package a complete
                setup bundle with step-by-step instructions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-3 mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              5 Pre-Built Professional Templates
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Choose a starter layout tailored to your career stage and aesthetic preference.
              Customize every detail anytime.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TEMPLATE_LIST.map((template) => (
              <div
                key={template.id}
                className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm hover:border-primary/50 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {template.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-xl">{template.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {template.description}
                  </p>
                </div>

                <div className="pt-6">
                  <Button
                    onClick={() => handleSelectTemplate(template.id as TemplateId)}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <span>Use This Template</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t bg-muted/20 py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-12">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              3 simple steps from zero to a standout developer profile
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3 text-left">
            <div className="space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                1
              </div>
              <h4 className="font-bold text-base">Select or Import</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose a template or import your profile info by typing your GitHub username.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                2
              </div>
              <h4 className="font-bold text-base">Customize Visually</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Rearrange sections, toggle skills, pick your favorite theme, and tweak metrics.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                3
              </div>
              <h4 className="font-bold text-base">Copy & Publish</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Copy the generated Markdown into your `username/username` GitHub repository!
              </p>
            </div>
          </div>

          <div className="pt-6">
            <Link href="/builder">
              <Button size="lg" className="gap-2 px-8">
                <span>Launch ProfileForge Builder</span>
                <ArrowRight className="h-4 w-4" />
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
