"use client";

import * as React from "react";
import { TechStackConfig, TechItem } from "@/types/profile";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface TechStackInspectorProps {
  config: TechStackConfig;
  onChange: (updated: Partial<TechStackConfig>) => void;
}

const COMMON_SKILLS: Array<{ name: string; slug: string; category: TechItem["category"] }> = [
  // Languages
  { name: "TypeScript", slug: "ts", category: "languages" },
  { name: "JavaScript", slug: "js", category: "languages" },
  { name: "Python", slug: "python", category: "languages" },
  { name: "Rust", slug: "rust", category: "languages" },
  { name: "Go", slug: "go", category: "languages" },
  { name: "C++", slug: "cpp", category: "languages" },
  { name: "Java", slug: "java", category: "languages" },
  { name: "PHP", slug: "php", category: "languages" },
  { name: "Ruby", slug: "ruby", category: "languages" },
  { name: "Swift", slug: "swift", category: "languages" },
  { name: "Kotlin", slug: "kotlin", category: "languages" },
  // Frameworks
  { name: "React", slug: "react", category: "frameworks" },
  { name: "Next.js", slug: "nextjs", category: "frameworks" },
  { name: "Vue.js", slug: "vue", category: "frameworks" },
  { name: "Tailwind CSS", slug: "tailwind", category: "frameworks" },
  { name: "Node.js", slug: "nodejs", category: "frameworks" },
  { name: "Express", slug: "express", category: "frameworks" },
  { name: "FastAPI", slug: "fastapi", category: "frameworks" },
  { name: "Django", slug: "django", category: "frameworks" },
  // Databases
  { name: "PostgreSQL", slug: "postgres", category: "databases" },
  { name: "MySQL", slug: "mysql", category: "databases" },
  { name: "MongoDB", slug: "mongodb", category: "databases" },
  { name: "Redis", slug: "redis", category: "databases" },
  { name: "SQLite", slug: "sqlite", category: "databases" },
  // Tools & Cloud
  { name: "Docker", slug: "docker", category: "tools" },
  { name: "Kubernetes", slug: "kubernetes", category: "tools" },
  { name: "Git", slug: "git", category: "tools" },
  { name: "Linux", slug: "linux", category: "tools" },
  { name: "AWS", slug: "aws", category: "cloud" },
  { name: "GCP", slug: "gcp", category: "cloud" },
];

export function TechStackInspector({ config, onChange }: TechStackInspectorProps) {
  const [customName, setCustomName] = React.useState("");
  const [customSlug, setCustomSlug] = React.useState("");

  const addSkill = (skill: { name: string; slug: string; category: TechItem["category"] }) => {
    const existing = config.skills || [];
    if (existing.some((s) => s.slug === skill.slug)) return;

    onChange({
      skills: [
        ...existing,
        {
          id: `tech_${skill.slug}_${Date.now()}`,
          name: skill.name,
          slug: skill.slug,
          category: skill.category,
        },
      ],
    });
  };

  const removeSkill = (slug: string) => {
    onChange({
      skills: (config.skills || []).filter((s) => s.slug !== slug),
    });
  };

  const addCustomSkill = () => {
    if (!customName.trim() || !customSlug.trim()) return;
    addSkill({
      name: customName.trim(),
      slug: customSlug.trim().toLowerCase(),
      category: "tools",
    });
    setCustomName("");
    setCustomSlug("");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Display Mode
          </label>
          <Select
            value={config.viewMode || "icons"}
            onValueChange={(val: "icons" | "badges") => onChange({ viewMode: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="icons">Skill Icons (SVG Grid)</SelectItem>
              <SelectItem value="badges">Shield Badges</SelectItem>
            </SelectContent>
          </Select>
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
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold text-muted-foreground">
          Selected Skills ({config.skills?.length || 0})
        </label>
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 border rounded-md bg-muted/20">
          {(config.skills || []).map((skill) => (
            <span
              key={skill.slug}
              className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-xs text-secondary-foreground"
            >
              <span>{skill.name}</span>
              <button
                type="button"
                onClick={() => removeSkill(skill.slug)}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t">
        <span className="text-xs font-semibold text-muted-foreground">
          Quick Add Popular Skills
        </span>
        <div className="flex flex-wrap gap-1 max-h-40 overflow-y-auto pr-1">
          {COMMON_SKILLS.map((skill) => {
            const isSelected = (config.skills || []).some(
              (s) => s.slug === skill.slug
            );
            return (
              <Button
                key={skill.slug}
                size="sm"
                variant={isSelected ? "secondary" : "outline"}
                className="h-6 text-[11px] px-2 py-0"
                disabled={isSelected}
                onClick={() => addSkill(skill)}
              >
                {skill.name}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t">
        <span className="text-xs font-semibold text-muted-foreground">
          Add Custom Skill
        </span>
        <div className="flex gap-2">
          <Input
            placeholder="Name (e.g. Next.js)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="h-8 text-xs"
          />
          <Input
            placeholder="Slug (e.g. nextjs)"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
            className="h-8 text-xs"
          />
          <Button size="sm" type="button" onClick={addCustomSkill} className="h-8">
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
