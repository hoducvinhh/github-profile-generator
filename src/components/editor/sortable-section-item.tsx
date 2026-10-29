"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SectionItem } from "@/types/profile";
import { SECTION_METAS } from "@/lib/sections/registry";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  GripVertical,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  User,
  BookOpen,
  Share2,
  Code,
  BarChart3,
  Flame,
  PieChart,
  FolderGit2,
  Activity,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  User,
  BookOpen,
  Share2,
  Code,
  BarChart3,
  Flame,
  PieChart,
  FolderGit2,
  Activity,
  Sliders,
};

interface SortableSectionItemProps {
  section: SectionItem;
  isActive: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function SortableSectionItem({
  section,
  isActive,
  onSelect,
  onToggle,
  onDuplicate,
  onDelete,
}: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const meta = SECTION_METAS[section.type];
  const IconComponent = (meta && ICONS[meta.icon]) || Sliders;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center justify-between rounded-lg border p-2 text-sm transition-all duration-150 select-none",
        isActive
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border bg-card/60 hover:border-muted-foreground/30",
        !section.enabled && "opacity-50",
        isDragging && "z-50 opacity-40 shadow-lg"
      )}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={onSelect}
          className="flex items-center gap-2 text-left truncate focus:outline-none"
        >
          <IconComponent className="h-4 w-4 shrink-0 text-primary" />
          <span className="font-medium truncate text-foreground">
            {section.title}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onToggle}
          className="p-1 text-muted-foreground hover:text-foreground"
          title={section.enabled ? "Disable section" : "Enable section"}
        >
          {section.enabled ? (
            <Eye className="h-3.5 w-3.5 text-primary" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" />
          )}
        </button>

        <button
          type="button"
          onClick={onDuplicate}
          className="p-1 text-muted-foreground hover:text-foreground"
          title="Duplicate section"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="p-1 text-muted-foreground hover:text-destructive"
          title="Remove section"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
