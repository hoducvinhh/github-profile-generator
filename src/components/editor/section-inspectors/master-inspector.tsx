"use client";

import * as React from "react";
import { useProfileStore } from "@/stores/use-profile-store";
import { HeaderInspector } from "./header-inspector";
import { AboutInspector } from "./about-inspector";
import { SocialsInspector } from "./socials-inspector";
import { TechStackInspector } from "./tech-stack-inspector";
import { StatsInspector } from "./stats-inspector";
import { ProjectsInspector } from "./projects-inspector";
import { StatusInspector } from "./status-inspector";
import { QuoteCounterInspector } from "./quote-counter-inspector";
import { Input } from "@/components/ui/input";
import { Sliders, Settings2 } from "lucide-react";
import { SECTION_METAS } from "@/lib/sections/registry";

export function MasterInspector() {
  const { config, activeSectionId, updateSectionConfig, updateSectionTitle } =
    useProfileStore();

  const activeSection = config.sections.find((s) => s.id === activeSectionId);

  if (!activeSection) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground border border-dashed rounded-xl border-border/60 bg-card/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/50 border border-border/60 text-muted-foreground mb-3">
          <Sliders className="h-6 w-6 stroke-1 opacity-70" />
        </div>
        <h4 className="font-semibold text-foreground text-sm">Chưa chọn Section</h4>
        <p className="text-xs text-muted-foreground/80 mt-1 max-w-[220px]">
          Chọn một mục từ danh sách bên trái để mở bảng tùy chỉnh cấu hình.
        </p>
      </div>
    );
  }

  const handleConfigChange = (partial: Record<string, any>) => {
    updateSectionConfig(activeSection.id, partial);
  };

  const meta = SECTION_METAS[activeSection.type];

  return (
    <div className="flex flex-col h-full space-y-3.5 overflow-y-auto pr-1">
      {/* Section Header & Title input */}
      <div className="space-y-2 border-b border-border/70 pb-3 bg-muted/20 p-2.5 rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Settings2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Cấu hình Section</span>
          </div>
          <span className="text-[11px] font-mono text-muted-foreground uppercase px-1.5 py-0.5 rounded bg-muted border border-border/60">
            {meta?.title || activeSection.type}
          </span>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-muted-foreground">
            Tiêu đề hiển thị (Markdown Heading)
          </label>
          <Input
            value={activeSection.title}
            onChange={(e) => updateSectionTitle(activeSection.id, e.target.value)}
            className="font-medium text-xs h-8 border-border/80 focus-visible:ring-emerald-500/50"
            placeholder="Nhập tiêu đề cho section..."
          />
        </div>
      </div>

      {/* Dynamic Inspector Form */}
      <div className="flex-1 space-y-4">
        {activeSection.type === "header" && (
          <HeaderInspector
            config={activeSection.config as any}
            onChange={handleConfigChange}
          />
        )}

        {activeSection.type === "about" && (
          <AboutInspector
            config={activeSection.config as any}
            onChange={handleConfigChange}
          />
        )}

        {activeSection.type === "socials" && (
          <SocialsInspector
            config={activeSection.config as any}
            onChange={handleConfigChange}
          />
        )}

        {activeSection.type === "tech-stack" && (
          <TechStackInspector
            config={activeSection.config as any}
            onChange={handleConfigChange}
          />
        )}

        {(activeSection.type === "github-stats" ||
          activeSection.type === "streak-stats" ||
          activeSection.type === "top-langs") && (
          <StatsInspector
            type={activeSection.type}
            config={activeSection.config as any}
            onChange={handleConfigChange}
          />
        )}

        {activeSection.type === "projects" && (
          <ProjectsInspector
            config={activeSection.config as any}
            onChange={handleConfigChange}
          />
        )}

        {activeSection.type === "current-status" && (
          <StatusInspector
            config={activeSection.config as any}
            onChange={handleConfigChange}
          />
        )}

        {activeSection.type === "quote-counter" && (
          <QuoteCounterInspector
            config={activeSection.config as any}
            onChange={handleConfigChange}
          />
        )}
      </div>
    </div>
  );
}
