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
  Github,
  ChevronDown,
} from "lucide-react";

export function Header() {
  const { config, undo, redo, canUndo, canRedo, importProfileConfig } =
    useProfileStore();
  const { theme, setTheme } = useTheme();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const markdown = React.useMemo(() => {
    return serializeProfileMarkdown(config);
  }, [config]);

  const handleCopy = () => {
    copyMarkdownToClipboard(markdown);
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
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Left: Brand & Nav */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Flame className="h-4 w-4" />
            </div>
            <span className="hidden text-base sm:inline">ProfileForge</span>
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
              v1.0
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1.5 border-l pl-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={undo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={redo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Center: Template & Theme Pickers */}
        <div className="hidden lg:flex items-center gap-2">
          <TemplateSelector />
          <ThemeSelector />
          <GithubImportDialog />
        </div>

        {/* Right: Actions & Export */}
        <div className="flex items-center gap-2">
          {/* Mobile fallbacks for selectors */}
          <div className="flex lg:hidden items-center gap-1">
            <TemplateSelector />
            <ThemeSelector />
          </div>

          <Button
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 font-semibold shadow-sm"
          >
            <Copy className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Copy Markdown</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 px-2.5">
                <Download className="h-3.5 w-3.5" />
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Export & Backup</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDownloadReadme} className="cursor-pointer gap-2">
                <Download className="h-4 w-4 text-primary" />
                <span>Download README.md</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadZip} className="cursor-pointer gap-2">
                <Archive className="h-4 w-4 text-primary" />
                <span>Download ZIP Bundle</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExportJson} className="cursor-pointer gap-2">
                <FileJson className="h-4 w-4" />
                <span>Backup JSON Config</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer gap-2"
              >
                <Upload className="h-4 w-4" />
                <span>Restore JSON Config</span>
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
            className="h-8 w-8"
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
