"use client";

import * as React from "react";
import { HeaderConfig } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface HeaderInspectorProps {
  config: HeaderConfig;
  onChange: (updated: Partial<HeaderConfig>) => void;
}

export function HeaderInspector({ config, onChange }: HeaderInspectorProps) {
  const [typingInput, setTypingInput] = React.useState("");

  const addTypingText = () => {
    if (!typingInput.trim()) return;
    const current = config.typingTexts || [];
    onChange({ typingTexts: [...current, typingInput.trim()] });
    setTypingInput("");
  };

  const removeTypingText = (index: number) => {
    const current = config.typingTexts || [];
    onChange({ typingTexts: current.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          Greeting / Salutation
        </label>
        <Input
          placeholder="e.g. Hi there, I'm"
          value={config.greeting || ""}
          onChange={(e) => onChange({ greeting: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          Display Name
        </label>
        <Input
          placeholder="e.g. Alex Rivera"
          value={config.name || ""}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          Subtitle / Role
        </label>
        <Input
          placeholder="e.g. Full Stack Engineer"
          value={config.title || ""}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
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

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Avatar Shape
          </label>
          <Select
            value={config.avatarStyle || "circle"}
            onValueChange={(val: "circle" | "square" | "none") =>
              onChange({ avatarStyle: val })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="circle">Circular</SelectItem>
              <SelectItem value="square">Square</SelectItem>
              <SelectItem value="none">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          Avatar Image URL (Optional)
        </label>
        <Input
          placeholder="https://..."
          value={config.avatarUrl || ""}
          onChange={(e) => onChange({ avatarUrl: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground">
          Banner Image URL (Optional)
        </label>
        <Input
          placeholder="https://..."
          value={config.bannerUrl || ""}
          onChange={(e) => onChange({ bannerUrl: e.target.value })}
        />
      </div>

      <div className="space-y-2 pt-1 border-t">
        <label className="text-xs font-semibold text-muted-foreground">
          Typing Animation Lines
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="Add animated text..."
            value={typingInput}
            onChange={(e) => setTypingInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTypingText())}
          />
          <Button size="sm" type="button" onClick={addTypingText}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {config.typingTexts && config.typingTexts.length > 0 && (
          <div className="space-y-1 pt-1">
            {config.typingTexts.map((text, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded bg-muted/60 px-2.5 py-1 text-xs"
              >
                <span className="truncate">{text}</span>
                <button
                  type="button"
                  onClick={() => removeTypingText(i)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
