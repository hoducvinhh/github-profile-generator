"use client";

import * as React from "react";
import { QuoteCounterConfig } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface QuoteCounterInspectorProps {
  config: QuoteCounterConfig;
  onChange: (updated: Partial<QuoteCounterConfig>) => void;
}

export function QuoteCounterInspector({ config, onChange }: QuoteCounterInspectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-muted-foreground">
          Alignment
        </label>
        <Select
          value={config.alignment || "center"}
          onValueChange={(val: "center" | "left") => onChange({ alignment: val })}
        >
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="left">Left</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3 pt-2 border-t">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-foreground">
            Display Random Dev Quote
          </label>
          <Switch
            checked={!!config.showQuote}
            onCheckedChange={(val) => onChange({ showQuote: val })}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-foreground">
            Display Visitor Counter Badge
          </label>
          <Switch
            checked={!!config.showVisitorCounter}
            onCheckedChange={(val) => onChange({ showVisitorCounter: val })}
          />
        </div>

        {config.showVisitorCounter && (
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-muted-foreground">
              Counter GitHub Username
            </label>
            <Input
              placeholder="e.g. torvalds"
              value={config.counterUsername || ""}
              onChange={(e) => onChange({ counterUsername: e.target.value })}
            />
          </div>
        )}
      </div>
    </div>
  );
}
