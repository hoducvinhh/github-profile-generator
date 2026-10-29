"use client";

import * as React from "react";
import { AboutConfig } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AboutInspectorProps {
  config: AboutConfig;
  onChange: (updated: Partial<AboutConfig>) => void;
}

export function AboutInspector({ config, onChange }: AboutInspectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          Bio / Summary
        </label>
        <Textarea
          rows={3}
          placeholder="Brief intro about yourself..."
          value={config.bio || ""}
          onChange={(e) => onChange({ bio: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          🔭 Currently Working On
        </label>
        <Input
          placeholder="e.g. Next-generation web apps"
          value={config.currentWork || ""}
          onChange={(e) => onChange({ currentWork: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          👯 Looking to Collaborate On
        </label>
        <Input
          placeholder="e.g. Developer tools & open source projects"
          value={config.collaborateOn || ""}
          onChange={(e) => onChange({ collaborateOn: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          💬 Ask Me About
        </label>
        <Input
          placeholder="e.g. React, TypeScript, APIs"
          value={config.askMeAbout || ""}
          onChange={(e) => onChange({ askMeAbout: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          📫 Reach Me At
        </label>
        <Input
          placeholder="e.g. email or website URL"
          value={config.reachMeAt || ""}
          onChange={(e) => onChange({ reachMeAt: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          ⚡ Fun Fact
        </label>
        <Input
          placeholder="e.g. I brew espresso between git commits"
          value={config.funFact || ""}
          onChange={(e) => onChange({ funFact: e.target.value })}
        />
      </div>
    </div>
  );
}
