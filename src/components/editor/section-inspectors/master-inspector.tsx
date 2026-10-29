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
import { Sliders, HelpCircle } from "lucide-react";

export function MasterInspector() {
  const { config, activeSectionId, updateSectionConfig, updateSectionTitle } =
    useProfileStore();

  const activeSection = config.sections.find((s) => s.id === activeSectionId);

  if (!activeSection) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <Sliders className="h-10 w-10 stroke-1 opacity-50 mb-3" />
        <h4 className="font-semibold text-foreground text-sm">No Section Selected</h4>
        <p className="text-xs mt-1">
          Select or add a section from the left list to customize its configuration.
        </p>
      </div>
    );
  }

  const handleConfigChange = (partial: Record<string, any>) => {
    updateSectionConfig(activeSection.id, partial);
  };

  return (
    <div className="flex flex-col h-full space-y-4 overflow-y-auto pr-1">
      <div className="space-y-1.5 border-b pb-3">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Section Title
        </label>
        <Input
          value={activeSection.title}
          onChange={(e) => updateSectionTitle(activeSection.id, e.target.value)}
          className="font-medium text-sm h-8"
        />
      </div>

      <div className="flex-1">
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
