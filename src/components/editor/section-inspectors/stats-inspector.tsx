"use client";

import * as React from "react";
import { GitHubStatsConfig, StreakStatsConfig, TopLangsConfig } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function StatsInspector({
  type,
  config,
  onChange,
}: {
  type: "github-stats" | "streak-stats" | "top-langs";
  config: any;
  onChange: (updated: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          GitHub Username
        </label>
        <Input
          placeholder="e.g. torvalds"
          value={config.username || ""}
          onChange={(e) => onChange({ username: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          Alignment
        </label>
        <Select
          value={config.alignment || "center"}
          onValueChange={(val: "center" | "left") => onChange({ alignment: val })}
        >
          <SelectTrigger>
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
            Hide Card Border
          </label>
          <Switch
            checked={!!config.hideBorder}
            onCheckedChange={(val) => onChange({ hideBorder: val })}
          />
        </div>

        {type === "github-stats" && (
          <>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">
                Show Metric Icons
              </label>
              <Switch
                checked={config.showIcons !== false}
                onCheckedChange={(val) => onChange({ showIcons: val })}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">
                Include All Commits (All Years)
              </label>
              <Switch
                checked={config.includeAllCommits !== false}
                onCheckedChange={(val) => onChange({ includeAllCommits: val })}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-foreground">
                Count Private Contributions
              </label>
              <Switch
                checked={config.countPrivate !== false}
                onCheckedChange={(val) => onChange({ countPrivate: val })}
              />
            </div>
          </>
        )}

        {type === "top-langs" && (
          <>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Layout
              </label>
              <Select
                value={config.layout || "compact"}
                onValueChange={(val: "compact" | "normal") =>
                  onChange({ layout: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact (Donut Chart)</SelectItem>
                  <SelectItem value="normal">Normal (Bar List)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Languages Count ({config.langsCount || 6})
              </label>
              <Input
                type="number"
                min={1}
                max={10}
                value={config.langsCount || 6}
                onChange={(e) =>
                  onChange({ langsCount: parseInt(e.target.value) || 6 })
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
