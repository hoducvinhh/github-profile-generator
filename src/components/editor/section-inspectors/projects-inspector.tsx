"use client";

import * as React from "react";
import { ProjectsConfig, ProjectItem } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ProjectsInspectorProps {
  config: ProjectsConfig;
  onChange: (updated: Partial<ProjectsConfig>) => void;
}

export function ProjectsInspector({ config, onChange }: ProjectsInspectorProps) {
  const addProject = () => {
    const newProject: ProjectItem = {
      id: `proj_${Date.now()}`,
      name: "My Awesome Project",
      description: "A fast, open-source web application.",
      repoUrl: "https://github.com/username/project",
      demoUrl: "https://project.dev",
      techs: ["TypeScript", "Next.js"],
      starsBadge: true,
    };
    onChange({ projects: [...(config.projects || []), newProject] });
  };

  const updateProject = (id: string, partial: Partial<ProjectItem>) => {
    const updated = (config.projects || []).map((p) =>
      p.id === id ? { ...p, ...partial } : p
    );
    onChange({ projects: updated });
  };

  const removeProject = (id: string) => {
    onChange({ projects: (config.projects || []).filter((p) => p.id !== id) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-muted-foreground">
          Projects ({config.projects?.length || 0})
        </label>
        <Button size="sm" variant="outline" onClick={addProject} className="h-7 text-xs">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Project
        </Button>
      </div>

      <div className="space-y-3">
        {(config.projects || []).map((project, idx) => (
          <div
            key={project.id}
            className="space-y-2 rounded-lg border bg-muted/30 p-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">
                Project #{idx + 1}: {project.name}
              </span>
              <button
                type="button"
                onClick={() => removeProject(project.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-muted-foreground">
                Project Name
              </label>
              <Input
                className="h-8 text-xs"
                placeholder="Project Name"
                value={project.name}
                onChange={(e) => updateProject(project.id, { name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] text-muted-foreground">
                Description
              </label>
              <Textarea
                rows={2}
                className="text-xs"
                placeholder="What does it do?"
                value={project.description}
                onChange={(e) =>
                  updateProject(project.id, { description: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">
                  Repo URL
                </label>
                <Input
                  className="h-8 text-xs"
                  placeholder="https://github.com/..."
                  value={project.repoUrl}
                  onChange={(e) =>
                    updateProject(project.id, { repoUrl: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-muted-foreground">
                  Demo URL (Optional)
                </label>
                <Input
                  className="h-8 text-xs"
                  placeholder="https://..."
                  value={project.demoUrl || ""}
                  onChange={(e) =>
                    updateProject(project.id, { demoUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">
                Tech Stack (comma-separated)
              </label>
              <Input
                className="h-8 text-xs"
                placeholder="React, TypeScript, Tailwind"
                value={(project.techs || []).join(", ")}
                onChange={(e) =>
                  updateProject(project.id, {
                    techs: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
