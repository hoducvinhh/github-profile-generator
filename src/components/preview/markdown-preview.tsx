"use client";

import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { BookOpen, Lock, ShieldCheck, Sun, Moon } from "lucide-react";
import { useProfileStore } from "@/stores/use-profile-store";

interface MarkdownPreviewProps {
  markdown: string;
}

const customSanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    div: [...(defaultSchema.attributes?.div || []), "align", "style", "className"],
    p: [...(defaultSchema.attributes?.p || []), "align"],
    h1: [...(defaultSchema.attributes?.h1 || []), "align"],
    h2: [...(defaultSchema.attributes?.h2 || []), "align"],
    h3: [...(defaultSchema.attributes?.h3 || []), "align"],
    img: [
      ...(defaultSchema.attributes?.img || []),
      "align",
      "width",
      "height",
      "style",
      "alt",
      "src",
    ],
    table: [...(defaultSchema.attributes?.table || []), "align", "width"],
    th: [...(defaultSchema.attributes?.th || []), "align"],
    td: [...(defaultSchema.attributes?.td || []), "align"],
  },
};

export function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
  const { config } = useProfileStore();
  const username = config.githubUsername || "alexrivera";
  const [previewMode, setPreviewMode] = React.useState<"dark" | "light">("dark");

  return (
    <div className="flex flex-col h-full w-full rounded-xl border border-border/80 bg-card overflow-hidden shadow-xl">
      {/* Browser Mockup Chrome Bar */}
      <div className="flex h-10 items-center justify-between border-b border-border/70 bg-muted/40 px-3.5 select-none">
        {/* Window controls */}
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        </div>

        {/* URL Pill */}
        <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-background/80 px-3 py-1 text-xs font-mono text-muted-foreground shadow-inner">
          <Lock className="h-3 w-3 text-emerald-400" />
          <span className="text-muted-foreground/60">github.com/</span>
          <span className="text-foreground font-semibold">{username}</span>
          <span className="text-muted-foreground/60">/{username}</span>
        </div>

        {/* Preview Theme Simulator Toggle */}
        <button
          type="button"
          onClick={() => setPreviewMode(previewMode === "dark" ? "light" : "dark")}
          className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground px-2 py-0.5 rounded border border-border/60 bg-background/50 hover:bg-muted transition-colors"
          title="Mô phỏng giao diện GitHub Dark / GitHub Light"
        >
          {previewMode === "dark" ? (
            <>
              <Moon className="h-3 w-3 text-indigo-400" />
              <span className="hidden sm:inline">GitHub Dark</span>
            </>
          ) : (
            <>
              <Sun className="h-3 w-3 text-amber-500" />
              <span className="hidden sm:inline">GitHub Light</span>
            </>
          )}
        </button>
      </div>

      {/* Profile Document Header bar (like real GitHub README box) */}
      <div
        className={`flex items-center justify-between px-4 py-2 border-b text-xs font-mono select-none ${
          previewMode === "dark"
            ? "bg-[#161b22] border-[#30363d] text-[#c9d1d9]"
            : "bg-[#f6f8fa] border-[#d0d7de] text-[#1f2328]"
        }`}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 opacity-70" />
          <span className="font-semibold">{username}</span>
          <span className="opacity-50">/</span>
          <span className="opacity-80">README.md</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>GFM Verified</span>
        </div>
      </div>

      {/* Rendered Markdown Body */}
      <div
        className={`flex-1 overflow-y-auto px-6 sm:px-10 py-8 transition-colors ${
          previewMode === "dark"
            ? "bg-[#0d1117] text-[#c9d1d9]"
            : "bg-white text-[#1f2328]"
        }`}
      >
        <div className="markdown-body max-w-3xl mx-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[rehypeSanitize, customSanitizeSchema]]}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
