"use client";

import * as React from "react";
import Link from "next/link";
import { useProfileStore } from "@/stores/use-profile-store";
import { serializeProfileMarkdown } from "@/lib/markdown/serializer";
import { copyMarkdownToClipboard } from "@/lib/export/clipboard";
import { downloadReadme, downloadProfileConfigJson } from "@/lib/export/download";
import { downloadZipBundle } from "@/lib/export/zip";
import { importConfigFromFile } from "@/lib/export/importer";
import { TemplateSelector } from "@/components/editor/template-selector";
import { ThemeSelector } from "@/components/editor/theme-selector";
import { GithubImportDialog } from "@/components/github/github-import-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import {
  Flame,
  Copy,
  Download,
  Archive,
  Upload,
  FileJson,
  Undo2,
  Redo2,
  Sun,
  Moon,
  ChevronDown,
  Check,
} from "lucide-react";

export function Header() {
  const { config, undo, redo, canUndo, canRedo, importProfileConfig } =
    useProfileStore();
  const { theme, setTheme } = useTheme();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [copied, setCopied] = React.useState(false);

  const markdown = React.useMemo(() => {
    return serializeProfileMarkdown(config);
  }, [config]);

  const handleCopy = () => {
    copyMarkdownToClipboard(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReadme = () => {
    downloadReadme(markdown);
  };

  const handleDownloadZip = () => {
    downloadZipBundle(markdown, config);
  };

  const handleExportJson = () => {
    downloadProfileConfigJson(config);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importConfigFromFile(file, importProfileConfig);
      e.target.value = "";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="flex h-13 items-center justify-between px-3 sm:px-5">
        {/* Left: Brand & History Controls */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 border border-white/10 text-emerald-400 group-hover:border-emerald-500/50 group-hover:text-emerald-300 transition-all shadow-inner">
              <Flame className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm tracking-tight text-foreground">
                ProfileForge
              </span>
              <span className="rounded px-1.5 py-0.5 text-xs font-mono font-medium border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                v1.0
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1 border-l pl-3 ml-1 border-border/60">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Center: Command Controls (Template, Theme, GitHub Import) */}
        <div className="hidden lg:flex items-center gap-1.5 bg-muted/40 border border-border/60 p-1 rounded-lg">
          <TemplateSelector />
          <div className="h-4 w-[1px] bg-border/60 mx-0.5" />
          <ThemeSelector />
          <div className="h-4 w-[1px] bg-border/60 mx-0.5" />
          <GithubImportDialog />
        </div>

        {/* Right: Export & Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile fallbacks for selectors */}
          <div className="flex lg:hidden items-center gap-1">
            <TemplateSelector />
            <ThemeSelector />
          </div>

          <Button
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm tech-glow-subtle transition-all"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Copy Markdown</span>
              </>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 px-2.5 text-xs border-border/80 hover:bg-muted/60"
              >
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="hidden md:inline">Export</span>
                <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5">
              <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                Export Options
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDownloadReadme}
                className="cursor-pointer gap-2.5 text-xs py-2"
              >
                <Download className="h-4 w-4 text-emerald-400" />
                <span>Download README.md</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDownloadZip}
                className="cursor-pointer gap-2.5 text-xs py-2"
              >
                <Archive className="h-4 w-4 text-emerald-400" />
                <span>Download ZIP Package</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleExportJson}
                className="cursor-pointer gap-2.5 text-xs py-2"
              >
                <FileJson className="h-4 w-4 text-muted-foreground" />
                <span>Backup Profile (JSON)</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer gap-2.5 text-xs py-2"
              >
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span>Restore Profile (JSON)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden"
          />

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
