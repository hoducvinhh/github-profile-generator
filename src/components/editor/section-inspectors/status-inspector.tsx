"use client";

import * as React from "react";
import { CurrentStatusConfig } from "@/types/profile";
import { Input } from "@/components/ui/input";

interface StatusInspectorProps {
  config: CurrentStatusConfig;
  onChange: (updated: Partial<CurrentStatusConfig>) => void;
}

export function StatusInspector({ config, onChange }: StatusInspectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          🔭 Working On (Text)
        </label>
        <Input
          placeholder="e.g. Next-generation developer tooling"
          value={config.workingOnText || ""}
          onChange={(e) => onChange({ workingOnText: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          Working On (Project Link)
        </label>
        <Input
          placeholder="https://github.com/..."
          value={config.workingOnLink || ""}
          onChange={(e) => onChange({ workingOnLink: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          🌱 Currently Learning
        </label>
        <Input
          placeholder="e.g. WebAssembly & Rust internals"
          value={config.learningText || ""}
          onChange={(e) => onChange({ learningText: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          💬 Looking to Collaborate On
        </label>
        <Input
          placeholder="e.g. Developer productivity CLI tools"
          value={config.collaboratingText || ""}
          onChange={(e) => onChange({ collaboratingText: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          ⚡ Pronouns
        </label>
        <Input
          placeholder="e.g. they/them or she/her or he/him"
          value={config.pronouns || ""}
          onChange={(e) => onChange({ pronouns: e.target.value })}
        />
      </div>
    </div>
  );
}
