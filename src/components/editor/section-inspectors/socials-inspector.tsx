"use client";

import * as React from "react";
import { SocialsConfig, SocialLinkItem } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface SocialsInspectorProps {
  config: SocialsConfig;
  onChange: (updated: Partial<SocialsConfig>) => void;
}

const POPULAR_PLATFORMS = [
  { id: "github", label: "GitHub", prefix: "https://github.com/" },
  { id: "linkedin", label: "LinkedIn", prefix: "https://linkedin.com/in/" },
  { id: "x", label: "X (Twitter)", prefix: "https://x.com/" },
  { id: "discord", label: "Discord", prefix: "https://discord.gg/" },
  { id: "youtube", label: "YouTube", prefix: "https://youtube.com/@" },
  { id: "portfolio", label: "Portfolio", prefix: "https://" },
  { id: "email", label: "Email", prefix: "mailto:" },
  { id: "twitch", label: "Twitch", prefix: "https://twitch.tv/" },
];

export function SocialsInspector({ config, onChange }: SocialsInspectorProps) {
  const addLink = (platformId: string) => {
    const meta = POPULAR_PLATFORMS.find((p) => p.id === platformId) || {
      id: platformId,
      label: platformId,
      prefix: "https://",
    };

    const newLink: SocialLinkItem = {
      id: `soc_${platformId}_${Date.now()}`,
      platform: meta.id,
      label: meta.label,
      username: "username",
      url: `${meta.prefix}username`,
      style: "for-the-badge",
    };

    onChange({ links: [...(config.links || []), newLink] });
  };

  const updateLink = (id: string, partial: Partial<SocialLinkItem>) => {
    const updated = (config.links || []).map((l) =>
      l.id === id ? { ...l, ...partial } : l
    );
    onChange({ links: updated });
  };

  const removeLink = (id: string) => {
    onChange({ links: (config.links || []).filter((l) => l.id !== id) });
  };

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

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">
          Active Links ({config.links?.length || 0})
        </label>

        <div className="space-y-2">
          {config.links?.map((link) => (
            <div
              key={link.id}
              className="space-y-2 rounded-lg border bg-muted/40 p-2.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold capitalize text-foreground">
                  {link.label || link.platform}
                </span>
                <button
                  type="button"
                  onClick={() => removeLink(link.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  className="h-8 text-xs"
                  placeholder="Username"
                  value={link.username}
                  onChange={(e) => updateLink(link.id, { username: e.target.value })}
                />
                <Input
                  className="h-8 text-xs"
                  placeholder="Full URL"
                  value={link.url}
                  onChange={(e) => updateLink(link.id, { url: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t space-y-1.5">
        <span className="text-xs font-semibold text-muted-foreground">
          Add Social Platform
        </span>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_PLATFORMS.map((platform) => (
            <Button
              key={platform.id}
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => addLink(platform.id)}
            >
              <Plus className="h-3 w-3 mr-1" />
              {platform.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
